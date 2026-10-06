"use client";

// ════════════════════════════════════════════════════════════════════════
// בקשת תמיכה חדשה: סוג (בעיה, עזרה, משוב) והודעה, עד 4000 תווים. Enter בשדה ההודעה
// מוסיף שורה ולעולם אינו שולח (טקסט רב-שורתי, מקלדות נייד ו-IME יפני). השליחה רק בכפתור.
// נתיב המקור כבר נוקה בשרת, ומוצג ללומד כדי שידע מה נשלח עם הבקשה.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import React, { useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { useT } from "@/i18n/useT";
import { formatChapterLabel } from "@/i18n/format";
import { courses } from "@/lib/courseData";
import { tField } from "@/lib/localize";
import { navTitle } from "../../learningPulseModel";
import { AuthAlert, FieldError } from "../../AccountPanel";
import { createSupportRequest } from "../actions";
import { KIND_ICON, KIND_TONE, PRIMARY_BUTTON, SECONDARY_LINK } from "../supportParts";
import { SUPPORT_HOME, SUPPORT_KINDS, SUPPORT_MAX_CHARS, supportHomeHref, type SupportKind } from "../supportShared";

// הצבע הסמנטי של כל סוג (KIND_TONE, משותף לרשימה ולעמוד הבקשה) צובע את האייקון, עיגול רקע עדין ומסגרת
// בבחירה. המצב הנבחר אינו נשען על צבע בלבד: כפתור הרדיו המסומן ומסגרת כפולה.
export function NewRequestForm({ initialKind, from }: { initialKind: SupportKind | null; from: string | null }) {
    const { locale, t } = useT();
    const s = t.chrome.support;
    const router = useRouter();
    const ids = useId();
    const [kind, setKind] = useState<SupportKind | null>(initialKind);
    const [body, setBody] = useState("");
    const [kindError, setKindError] = useState(false);
    const [bodyError, setBodyError] = useState(false);
    const [alert, setAlert] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const firstKindRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<HTMLTextAreaElement>(null);

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (busy) return;
        setAlert(null);
        const noKind = kind === null;
        const empty = body.trim() === "";
        setKindError(noKind);
        setBodyError(empty);
        if (noKind) {
            firstKindRef.current?.focus();
            return;
        }
        if (empty) {
            bodyRef.current?.focus();
            return;
        }
        setBusy(true);
        let result: Awaited<ReturnType<typeof createSupportRequest>>;
        try {
            result = await createSupportRequest(kind, body, from);
        } catch {
            result = { ok: false, outcome: "failed" };
        }
        if (result.ok) {
            // נשאר במצב "שולחים" עד המעבר לעמוד הבקשה, כדי שלא תישלח פעמיים.
            router.push(`${SUPPORT_HOME}/${result.id}?sent=1`);
            return;
        }
        setAlert(s.errors[result.outcome]);
        setBusy(false);
    };

    // ההקשר שנשלח עם הבקשה, בשם קריא (פרק ושמו הקצר, או המבוא). עמוד אחר: הנתיב כפי שהוא.
    const fromChapter = from ? courses["behind-the-scenes-ai"].chapters.find((c) => c.href === from) : undefined;
    const place = fromChapter
        ? fromChapter.id === 0 ? t.chrome.intro : `${formatChapterLabel(locale, fromChapter.id)} · ${navTitle(tField(fromChapter.title, locale))}`
        : null;

    const kindErrorId = `${ids}-kind-error`;
    const bodyHintId = `${ids}-body-hint`;
    const bodyErrorId = `${ids}-body-error`;

    return (
        <>
            <Link href={supportHomeHref(from)} className={SECONDARY_LINK}>{s.backToList}</Link>
            <header className="mt-3 space-y-1.5">
                <h1 className="text-2xl md:text-3xl font-black leading-tight">{s.newRequest}</h1>
                <p className="max-w-[62ch] text-[15px] md:text-base leading-6 text-[var(--bts-text-secondary)]">{s.newLead}</p>
            </header>

            <form onSubmit={submit} noValidate className="mt-5 space-y-5">
                <fieldset aria-describedby={kindError ? kindErrorId : undefined}>
                    <legend className="text-base font-bold text-[var(--bts-text-primary)]">{s.kindLegend}</legend>
                    <div className="mt-2 grid gap-2 md:grid-cols-3">
                        {SUPPORT_KINDS.map((k, i) => {
                            const Icon = KIND_ICON[k];
                            return (
                                <label
                                    key={k}
                                    className={`${KIND_TONE[k]} flex min-h-[44px] cursor-pointer items-start gap-2.5 rounded-xl border border-[var(--bts-border)] bg-[var(--bts-surface)] px-3 py-2.5 transition-colors hover:border-[var(--bts-border-emphasis)] has-[:checked]:border-[var(--kind)] has-[:checked]:bg-[color-mix(in_oklab,var(--kind)_8%,var(--bts-surface))] has-[:checked]:shadow-[inset_0_0_0_1px_var(--kind)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--bts-focus-ring)] motion-reduce:transition-none forced-colors:has-[:checked]:border-[Highlight]`}
                                >
                                    <input
                                        ref={i === 0 ? firstKindRef : undefined}
                                        type="radio"
                                        name="kind"
                                        value={k}
                                        checked={kind === k}
                                        onChange={() => { setKind(k); setKindError(false); }}
                                        className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--bts-brand-primary)] focus:outline-none"
                                    />
                                    <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-[color-mix(in_oklab,var(--kind)_16%,transparent)] text-[var(--kind)] forced-colors:bg-transparent forced-colors:text-[CanvasText]"><Icon size={15} strokeWidth={2.2} /></span>
                                    <span className="min-w-0">
                                        <span className="block font-bold text-[var(--bts-text-primary)]">{s.kinds[k].action}</span>
                                        <span className="block text-[13px] leading-5 text-[var(--bts-text-secondary)]">{s.kinds[k].hint}</span>
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                    <FieldError id={kindErrorId} text={kindError ? s.errorKind : undefined} />
                </fieldset>

                <div>
                    <label htmlFor={`${ids}-body`} className="block text-base font-bold text-[var(--bts-text-primary)]">{s.messageLabel}</label>
                    <p id={bodyHintId} className="mt-0.5 text-sm leading-6 text-[var(--bts-text-muted)]">{s.messageHint(SUPPORT_MAX_CHARS)}</p>
                    <textarea
                        ref={bodyRef}
                        id={`${ids}-body`}
                        name="message"
                        dir="auto"
                        rows={5}
                        maxLength={SUPPORT_MAX_CHARS}
                        value={body}
                        onChange={(e) => { setBody(e.target.value); if (bodyError) setBodyError(false); }}
                        aria-invalid={bodyError || undefined}
                        aria-describedby={bodyError ? `${bodyHintId} ${bodyErrorId}` : bodyHintId}
                        className="mt-1.5 block min-h-[150px] w-full resize-y rounded-xl border border-[var(--bts-border)] bg-[var(--bts-sub-fill)] px-3 py-2.5 text-base leading-7 text-[var(--bts-text-primary)] [overflow-wrap:anywhere] aria-[invalid=true]:border-[var(--bts-status-danger)]"
                    />
                    <div className="flex items-start gap-3">
                        <FieldError id={bodyErrorId} text={bodyError ? s.errorEmpty : undefined} />
                        <p className="ms-auto mt-1 shrink-0 text-xs tabular-nums text-[var(--bts-text-muted)]">{s.charCount(body.length, SUPPORT_MAX_CHARS)}</p>
                    </div>
                </div>

                {alert && <AuthAlert title={s.errorTitle} body={alert} />}

                {/* פעולת השליחה, ובצידה שורת הקשר קומפקטית: מה נשלח עם הבקשה. */}
                <div className="!mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <button type="submit" disabled={busy} className={PRIMARY_BUTTON}>
                        {busy ? s.sending : s.send}
                    </button>
                    <p className="flex min-w-0 items-start gap-1.5 text-xs leading-5 text-[var(--bts-text-muted)]">
                        <MapPin size={13} aria-hidden className="mt-[0.2rem] shrink-0" />
                        {from ? (
                            <span className="min-w-0">
                                {s.contextLabel}{" "}
                                {place
                                    ? <span className="font-semibold text-[var(--bts-text-secondary)]">{place}</span>
                                    : <bdi dir="ltr" className="font-mono text-[var(--bts-text-secondary)] [overflow-wrap:anywhere]">{from}</bdi>}
                                {" · "}{s.contextSent}
                            </span>
                        ) : <span className="min-w-0">{s.contextLanguageOnly}</span>}
                    </p>
                </div>
            </form>
        </>
    );
}
