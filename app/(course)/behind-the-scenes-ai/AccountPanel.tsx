"use client";

// ════════════════════════════════════════════════════════════════════════
// חשבון לומד בסרגל הצד: הרשמה והתחברות במייל וסיסמה, איפוס סיסמה, יציאה, מצב
// ניסיונות שממתינים לשליחה, והצעת ייבוא מפורשת וחד-פעמית של תרגול בלי חשבון.
// AccountSync (נטען פעם אחת ב-layout) מסנכרן שפה ושולח מחדש ניסיונות שממתינים בתור.
// חשבון אינו מעניק גישת בטא או גישה בתשלום. מצב הגישה מוצג כאן בלבד; האכיפה בשרת
// (_access/courseAccess.ts).
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from "react";
import type { AuthError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useT } from "@/i18n/useT";
import { useCourseAccess } from "./_access/CourseAccessContext";
import type { Dictionary } from "@/i18n/dictionary";
import { LOCALES } from "@/i18n/config";
import { getAllRecords, MASTERY_UPDATED_EVENT } from "./masteryProgress";
import {
    supabase,
    useAuthState,
    endPasswordRecovery,
    flushPendingAttempts,
    signOutAndForget,
    importLocalRecords,
    isImportHandled,
    markImportHandled,
    loadPreferredLocale,
    savePreferredLocale,
} from "./account";

type AccountDict = Dictionary["chrome"]["account"];

function errorText(error: AuthError, a: AccountDict): string {
    switch (error.code) {
        case "invalid_credentials": return a.errorInvalid;
        case "email_not_confirmed": return a.errorUnconfirmed;
        case "weak_password": return a.errorWeakPassword;
        case "same_password": return a.errorSamePassword;
        default: return a.errorGeneric;
    }
}

// קישורי מייל (אישור, איפוס) חוזרים לעמוד הנוכחי.
const pageUrl = () => window.location.href.split("#")[0];

const buttonClass = "flex-1 rounded-lg border border-[var(--bts-border)] bg-[var(--bts-sub-fill-soft)] hover:bg-[var(--bts-sub-fill-hover)] px-2.5 py-2 text-[11px] font-bold text-[var(--bts-text-secondary)] transition-colors disabled:opacity-50";
const inputClass = "w-full rounded-lg border border-[var(--bts-border)] bg-[var(--bts-sub-fill)] px-2.5 py-2 text-sm text-[var(--bts-text-primary)]";
const labelClass = "block text-[10px] font-bold text-[var(--bts-text-faint)]";

/** מצב הרשאת הבטא של החשבון המחובר. אימות מייל לבדו לעולם לא מוצג כגישה. */
function AccessStatusLine() {
    const { locale, t } = useT();
    const access = useCourseAccess();
    const x = t.chrome.access;
    const date = access.expiresAt ? new Date(access.expiresAt).toLocaleDateString(LOCALES[locale].htmlLang, { dateStyle: "medium" }) : "";
    const text = access.status === "active" ? x.accessActive(date)
        : access.status === "no-grant" ? x.accessNone
        : access.status === "expired" ? x.accessExpired(date)
        : access.status === "revoked" ? x.accessRevoked
        : null;
    if (!text) return null;
    return <p className="text-[11px] font-bold text-[var(--bts-text-secondary)] leading-relaxed">{text}</p>;
}

export function AccountPanel() {
    const { dir, t } = useT();
    const a = t.chrome.account;
    const { session } = useAuthState();
    const userId = session?.user.id;
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    const [importCount, setImportCount] = useState(0);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- התקדמות מקומית נקראת רק אחרי mount בצד הלקוח
        setImportCount(userId && !isImportHandled(userId) ? getAllRecords().length : 0);
        setMessage("");
    }, [userId]);

    if (!supabase) return null;
    const client = supabase;

    const run = async (task: () => Promise<string>) => {
        setBusy(true);
        setMessage("");
        let text: string;
        try {
            text = await task();
        } catch {
            text = a.errorGeneric;
        }
        setMessage(text);
        setBusy(false);
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const isSignUp = (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value") === "signup";
        const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        void run(async () => {
            if (isSignUp) {
                const { data, error } = await client.auth.signUp({ email, password, options: { emailRedirectTo: pageUrl() } });
                // בלי session = נדרש אישור מייל. אותה הודעה גם לכתובת שכבר רשומה (לא חושפים קיום חשבון).
                return error ? errorText(error, a) : data.session ? "" : a.checkEmail;
            }
            const { error } = await client.auth.signInWithPassword({ email, password });
            return error ? errorText(error, a) : "";
        });
    };

    const requestReset = (e: React.MouseEvent<HTMLButtonElement>) => {
        const emailInput = e.currentTarget.form?.elements.namedItem("email") as HTMLInputElement | null;
        if (!emailInput?.reportValidity()) return;
        void run(async () => {
            const { error } = await client.auth.resetPasswordForEmail(emailInput.value.trim(), { redirectTo: pageUrl() });
            // אותה הודעה בין אם הכתובת רשומה ובין אם לא.
            return error ? errorText(error, a) : a.resetSent;
        });
    };

    const runImport = () => {
        if (!userId) return;
        void run(async () => {
            // שגיאה נזרקת לפני הסימון: ההצעה נשארת, ושום דבר בשרת לא השתנה.
            const { added, kept } = await importLocalRecords(userId, getAllRecords());
            markImportHandled(userId);
            setImportCount(0);
            window.dispatchEvent(new CustomEvent(MASTERY_UPDATED_EVENT));
            return a.importDone(added, kept);
        });
    };

    const skipImport = () => {
        if (userId) markImportHandled(userId);
        setImportCount(0);
    };

    let body: React.ReactNode;
    if (session) {
        body = (
            <>
                <p className="text-[11px] text-[var(--bts-text-muted)]">
                    {a.signedInAs} <bdi className="font-bold text-[var(--bts-text-secondary)]">{session.user.email}</bdi>
                </p>
                <AccessStatusLine />
                {importCount > 0 && (
                    <div className="rounded-lg border border-[var(--bts-border)] bg-[var(--bts-sub-fill)] p-2.5 space-y-2">
                        <p className="text-[11px] font-bold text-[var(--bts-text-primary)]">{a.importTitle}</p>
                        <p className="text-[11px] text-[var(--bts-text-muted)] leading-relaxed">{a.importBody(importCount)}</p>
                        <div className="flex gap-2">
                            <button type="button" className={buttonClass} disabled={busy} onClick={runImport}>{a.importAction}</button>
                            <button type="button" className={buttonClass} disabled={busy} onClick={skipImport}>{a.importSkip}</button>
                        </div>
                    </div>
                )}
                <button type="button" className={buttonClass} disabled={busy} onClick={() => userId && void signOutAndForget(userId)}>{a.signOut}</button>
            </>
        );
    } else {
        body = (
            <form onSubmit={submit} className="space-y-2">
                <p className="text-[11px] text-[var(--bts-text-muted)] leading-relaxed">{a.intro}</p>
                <label className={labelClass}>
                    {a.email}
                    <input name="email" type="email" required autoComplete="email" dir="ltr" className={`${inputClass} mt-1`} />
                </label>
                <label className={labelClass}>
                    {a.password}
                    <input name="password" type="password" required minLength={6} autoComplete="current-password" dir="ltr" className={`${inputClass} mt-1`} />
                </label>
                <div className="flex gap-2">
                    <button type="submit" value="signin" className={buttonClass} disabled={busy}>{a.signIn}</button>
                    <button type="submit" value="signup" className={buttonClass} disabled={busy}>{a.signUp}</button>
                </div>
                <button type="button" onClick={requestReset} disabled={busy} className="text-[11px] font-bold text-[var(--bts-text-muted)] underline hover:text-[var(--bts-text-secondary)] disabled:opacity-50">
                    {a.forgotPassword}
                </button>
            </form>
        );
    }

    return (
        <details className="mt-5 pt-5 border-t border-[var(--bts-sub-rule)]" dir={dir}>
            <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-[var(--bts-text-faint)] hover:text-[var(--bts-text-secondary)]">
                {a.title}
            </summary>
            <div className="pt-3 space-y-3 text-start">
                {body}
                <p aria-live="polite" className="text-[11px] text-[var(--bts-text-secondary)] leading-relaxed">
                    {busy ? a.working : message}
                </p>
            </div>
        </details>
    );
}

/**
 * טופס סיסמה חדשה אחרי חזרה מקישור איפוס. חלון מודאלי מקורי (<dialog>) שנטען פעם אחת
 * ב-layout, ולכן נראה מיד בכל גודל מסך, בלי לפתוח את התפריט. Esc או "סגירה" מסיימים את
 * מצב האיפוס; הלומד נשאר מחובר ויכול לבקש קישור חדש בהמשך.
 */
export function PasswordResetDialog() {
    const { dir, t } = useT();
    const a = t.chrome.account;
    const { session, recovering } = useAuthState();
    const ref = useRef<HTMLDialogElement>(null);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    const [done, setDone] = useState(false);
    const show = !!session && recovering;

    useEffect(() => {
        const d = ref.current;
        if (!d) return;
        if (show && !d.open) d.showModal();
        if (!show && d.open) d.close();
    }, [show]);

    if (!supabase) return null;
    const client = supabase;

    const save = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const password = (e.currentTarget.elements.namedItem("newPassword") as HTMLInputElement).value;
        setBusy(true);
        setMessage("");
        try {
            const { error } = await client.auth.updateUser({ password });
            if (error) setMessage(errorText(error, a));
            else {
                setDone(true);
                setMessage(a.passwordUpdated);
            }
        } catch {
            setMessage(a.errorGeneric);
        }
        setBusy(false);
    };

    return (
        <dialog
            ref={ref}
            dir={dir}
            aria-labelledby="bts-reset-title"
            onCancel={() => endPasswordRecovery()}
            className="m-auto w-[min(92vw,24rem)] rounded-2xl border border-[var(--bts-border)] bg-[var(--bts-surface-elevated)] p-5 text-start text-[var(--bts-text-primary)] shadow-2xl backdrop:bg-black/60"
        >
            <form onSubmit={save} className="space-y-3">
                <h2 id="bts-reset-title" className="text-base font-black">{a.newPasswordTitle}</h2>
                <p className="text-xs text-[var(--bts-text-muted)]">
                    <bdi className="font-bold text-[var(--bts-text-secondary)]">{session?.user.email}</bdi>
                </p>
                {!done && (
                    <label className={labelClass}>
                        {a.newPassword}
                        <input name="newPassword" type="password" required minLength={6} autoComplete="new-password" autoFocus dir="ltr" className={`${inputClass} mt-1`} />
                    </label>
                )}
                <p aria-live="polite" className="text-xs text-[var(--bts-text-secondary)] leading-relaxed">
                    {busy ? a.working : message}
                </p>
                <div className="flex gap-2">
                    {!done && <button type="submit" className={buttonClass} disabled={busy}>{a.savePassword}</button>}
                    <button type="button" className={buttonClass} disabled={busy} onClick={() => endPasswordRecovery()}>{a.close}</button>
                </div>
            </form>
        </dialog>
    );
}

/**
 * נטען פעם אחת ב-layout של הלומדה.
 * 1. ניסיונות שממתינים בתור של המשתמש נשלחים בכל כניסה/טעינה ובכל חזרה של הרשת.
 * 2. שפה: בכניסה, העדפה שמורה מוחלת; אם אין, השפה הנוכחית נשמרת. אחר כך כל החלפת
 *    שפה נשמרת. לא שומרים לפני שהקריאה הראשונה הצליחה, כדי לא לדרוס העדפה ממכשיר אחר.
 */
export function AccountSync() {
    const { locale, setLocale } = useT();
    const { session, ready } = useAuthState();
    const userId = session?.user.id;
    const syncedFor = useRef<string | null>(null);
    const router = useRouter();
    const serverSignedIn = useCourseAccess().status !== "signed-out";
    const seenUser = useRef<string | null | undefined>(undefined);

    // 3. השרת מרנדר לפי העוגייה. כשהמשתמש מתחלף (כניסה/יציאה), או כשבטעינה הראשונה השרת
    //    והדפדפן לא מסכימים (למשל טוקן שרוענן זה עתה), מרעננים פעם אחת את תצוגת השרת.
    useEffect(() => {
        if (!ready) return;
        const current = userId ?? null;
        const changed = seenUser.current !== undefined && seenUser.current !== current;
        const mismatch = seenUser.current === undefined && !!current !== serverSignedIn;
        seenUser.current = current;
        if (changed || mismatch) router.refresh();
    }, [ready, userId, serverSignedIn, router]);

    useEffect(() => {
        if (!userId) return;
        const flush = () => void flushPendingAttempts(userId);
        flush();
        window.addEventListener("online", flush);
        return () => window.removeEventListener("online", flush);
    }, [userId]);

    useEffect(() => {
        if (!userId) {
            syncedFor.current = null;
            return;
        }
        if (syncedFor.current === userId) {
            void savePreferredLocale(userId, locale);
            return;
        }
        let cancelled = false;
        loadPreferredLocale(userId).then(saved => {
            if (cancelled) return;
            syncedFor.current = userId;
            if (!saved) void savePreferredLocale(userId, locale);
            else if (saved !== locale) setLocale(saved);
        }).catch(() => {});
        return () => { cancelled = true; };
    }, [userId, locale, setLocale]);

    return null;
}
