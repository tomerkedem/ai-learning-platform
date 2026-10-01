"use client";

// ════════════════════════════════════════════════════════════════════════
// בקשת גישת בטא ללומד מחובר, עם מייל מאומת, לא מושעה ובלי גישה פעילה. מוצג בפאנל החשבון
// ובמסך הנעילה. מציג את מצב הבקשה האחרונה (ממתינה, אושרה, נדחתה), הסבר, קישור לתנאי הבטא
// ותיבת הסכמה שאינה מסומנת מראש. השליחה פתוחה רק כשהשרת מאשר שבמסד יש גרסה נוכחית של התנאים
// שהנוסח שלה בשפה הזו זהה למה שמוצג (getBetaTermsState); אחרת היא כבויה ומוצג הסבר. אם מצב הבקשה לא נטען, המצב לא ידוע: מוצגת שגיאה עם ניסיון חוזר, בלי טופס
// ובלי הסבר הטיוטה. זו תצוגה בלבד: השרת והמסד אוכפים הכול בעצמם.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useT } from "@/i18n/useT";
import { LOCALES } from "@/i18n/config";
import { SpeakButton } from "@/components/ai-internals/SpeakButton";
import { supabase, useAuthState } from "../account";
import { useCourseAccess } from "./CourseAccessContext";
import { getBetaTermsState, submitBetaRequest, type BetaRequestOutcome, type BetaTermsState } from "./betaActions";

interface LatestRequest {
    status: "pending" | "approved" | "declined";
    submitted_at: string;
    decided_at: string | null;
}

// שני מופעים יכולים להיות על המסך (סרגל ומסך נעילה): שליחה באחד מרעננת את השני.
const UPDATED_EVENT = "bts-beta-request-updated";

const buttonClass = "min-h-[44px] w-full rounded-lg border border-[var(--bts-border)] bg-[var(--bts-sub-fill-soft)] hover:bg-[var(--bts-sub-fill-hover)] px-2.5 py-2 text-xs font-bold text-[var(--bts-text-secondary)] transition-colors disabled:opacity-50";

export function BetaAccessRequest() {
    const { locale, t } = useT();
    const x = t.chrome.access;
    const terms = t.behindAi.infoPages.pages.betaTerms;
    const { session } = useAuthState();
    const access = useCourseAccess();
    const userId = session?.user.id;
    const eligible = !!supabase && !!session?.user.email_confirmed_at
        && (access.status === "no-grant" || access.status === "expired" || access.status === "revoked");
    const ids = useId();
    const [latest, setLatest] = useState<LatestRequest | null | undefined>(undefined);
    // הגרסה הנוכחית במסד, ואם הנוסח המוצג בשפה הזו תואם לה. כשלון בבדיקה = לא מוכן (נכשלים סגור).
    const [termsState, setTermsState] = useState<BetaTermsState>({ ready: false, version: null, reaccept: false });
    const termsReady = termsState.ready;
    const [consent, setConsent] = useState(false);
    const [consentError, setConsentError] = useState(false);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    // true = הטעינה האחרונה של מצב הבקשה נכשלה: המצב לא ידוע, והשליחה לא זמינה עד ניסיון חוזר.
    const [loadFailed, setLoadFailed] = useState(false);
    const [retrying, setRetrying] = useState(false);
    const headingRef = useRef<HTMLHeadingElement>(null);

    const load = useCallback(async (): Promise<boolean> => {
        if (!supabase) return false;
        let ok = false;
        const termsPromise = getBetaTermsState(locale).catch(() => ({ ready: false, version: null, reaccept: false }));
        try {
            // RLS: רק הבקשות של המשתמש עצמו.
            const { data, error } = await supabase
                .from("beta_access_requests")
                .select("status, submitted_at, decided_at")
                .order("submitted_at", { ascending: false })
                .limit(1)
                .maybeSingle<LatestRequest>();
            if (!error) {
                setLatest(data);
                ok = true;
            }
        } catch {
            // שגיאת רשת: כמו שגיאה מהשרת.
        }
        setTermsState(await termsPromise);
        setLoadFailed(!ok);
        return ok;
    }, [locale]);

    useEffect(() => {
        if (!eligible || !userId) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- טעינה מהחשבון אחרי mount
        void load();
        const onUpdate = () => void load();
        window.addEventListener(UPDATED_EVENT, onUpdate);
        return () => window.removeEventListener(UPDATED_EVENT, onUpdate);
    }, [eligible, userId, load]);

    if (!eligible) return null;

    // כפתור הניסיון החוזר נשאר במקומו בזמן הטעינה (המיקוד לא הולך לאיבוד). בהצלחה הוא נעלם,
    // ולכן המיקוד עובר לכותרת הקטע.
    const retry = async () => {
        setRetrying(true);
        const ok = await load();
        setRetrying(false);
        if (ok) headingRef.current?.focus();
    };

    const fmt = (iso: string) => new Date(iso).toLocaleDateString(LOCALES[locale].htmlLang, { dateStyle: "medium" });
    const statusText = !latest ? ""
        : latest.status === "pending" ? x.requestPending(fmt(latest.submitted_at))
        : latest.status === "approved" ? x.requestApproved(fmt(latest.decided_at ?? latest.submitted_at))
        : x.requestDeclined(fmt(latest.decided_at ?? latest.submitted_at));
    const pending = latest?.status === "pending";
    // בקשה ממתינה שהסכמתה כבר לא מכסה את התנאים הנוכחיים: הלומד מאשר שוב (אותה בקשה נשארת).
    const reaccept = pending && termsState.reaccept;

    const outcomeText = (o: BetaRequestOutcome) => {
        switch (o) {
            case "submitted": return x.requestSent;
            case "duplicate": return x.requestDuplicate;
            case "not_allowed": return x.requestNotAllowed;
            case "has_access": return x.requestHasAccess;
            case "consent": return x.requestConsentMissing;
            case "terms_unavailable": return x.requestTermsUnavailable;
            default: return t.chrome.account.errorGeneric;
        }
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!consent) {
            setConsentError(true);
            (e.currentTarget.elements.namedItem("betaConsent") as HTMLInputElement).focus();
            return;
        }
        setBusy(true);
        setMessage("");
        let outcome: BetaRequestOutcome;
        try {
            outcome = await submitBetaRequest(true, locale);
        } catch {
            outcome = "failed";
        }
        setMessage(outcomeText(outcome));
        if (outcome === "submitted" || outcome === "duplicate") {
            setConsent(false);
            window.dispatchEvent(new CustomEvent(UPDATED_EVENT));
        }
        setBusy(false);
    };

    const titleId = `${ids}-title`;
    const errorId = `${ids}-error`;
    const speech = [x.requestTitle, ...x.requestPoints,
        loadFailed ? x.requestLoadError : statusText,
        !loadFailed && reaccept ? x.requestReaccept : "",
        loadFailed || (pending && !reaccept) || termsReady ? "" : x.requestTermsUnavailable]
        .filter(Boolean).join(" ");

    return (
        <section aria-labelledby={titleId} className="rounded-lg border border-[var(--bts-border)] bg-[var(--bts-sub-fill)] p-3 space-y-2 text-start">
            <div className="flex items-start justify-between gap-2">
                <h2 id={titleId} ref={headingRef} tabIndex={-1} className="text-sm font-bold text-[var(--bts-text-primary)] leading-tight">{x.requestTitle}</h2>
                {/* הקראה בלחיצה בלבד; key לפי שפה עוצר הקראה פעילה כשהשפה מתחלפת. */}
                <SpeakButton key={locale} text={speech} />
            </div>
            <ul className="list-disc ps-4 space-y-1 text-xs text-[var(--bts-text-muted)] leading-relaxed">
                {x.requestPoints.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <p className="text-xs">
                <Link href="/behind-the-scenes-ai/beta-terms" className="font-bold text-[var(--bts-text-secondary)] underline hover:text-[var(--bts-text-primary)]">
                    {terms.navTitle}
                </Link>
                {termsState.version && <span className="text-[var(--bts-text-faint)]"> ({x.termsVersion(termsState.version)})</span>}
            </p>
            {loadFailed ? (
                <div className="rounded-lg border border-rose-500/40 px-2.5 py-2 space-y-2">
                    <p role="alert" className="text-xs font-bold text-[var(--bts-status-danger)] leading-relaxed">{x.requestLoadError}</p>
                    {/* aria-disabled ולא disabled: כפתור מושבת מאבד את המיקוד בזמן הניסיון. */}
                    <button type="button" className={`${buttonClass} aria-disabled:opacity-50`} aria-disabled={retrying || undefined} onClick={() => { if (!retrying) void retry(); }}>
                        {t.chrome.account.retry}
                    </button>
                </div>
            ) : statusText && <p className="text-xs font-bold text-[var(--bts-text-secondary)] leading-relaxed">{statusText}</p>}
            {!loadFailed && reaccept && (
                <p role="note" className="rounded-lg border border-amber-500/40 px-2.5 py-2 text-xs font-bold bts-tier-amber leading-relaxed">{x.requestReaccept}</p>
            )}
            {!loadFailed && (!pending || reaccept) && latest !== undefined && (termsReady ? (
                <form onSubmit={submit} noValidate className="space-y-2">
                    <label className="flex min-h-[44px] items-start gap-2 text-xs text-[var(--bts-text-primary)] leading-relaxed">
                        <input
                            name="betaConsent"
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => { setConsent(e.target.checked); setConsentError(false); }}
                            required
                            aria-invalid={consentError || undefined}
                            aria-describedby={consentError ? errorId : undefined}
                            className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--bts-brand-primary-strong)]"
                        />
                        <span>{x.requestConsent}</span>
                    </label>
                    {consentError && <p id={errorId} className="text-xs font-bold text-[var(--bts-status-danger)]">{x.requestConsentMissing}</p>}
                    <button type="submit" className={buttonClass} disabled={busy}>{x.requestSubmit}</button>
                </form>
            ) : (
                <p role="note" className="rounded-lg border border-amber-500/40 px-2.5 py-2 text-xs font-bold bts-tier-amber leading-relaxed">
                    {x.requestTermsUnavailable}
                </p>
            ))}
            <p aria-live="polite" className="text-xs text-[var(--bts-text-secondary)] leading-relaxed">
                {busy || retrying ? t.chrome.account.working : message}
            </p>
        </section>
    );
}
