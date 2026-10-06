"use client";

// ════════════════════════════════════════════════════════════════════════
// עמוד בקשת תמיכה: סוג, סטטוס (כפי שהמסד מחזיר ללומד), השיחה ותשובה. הודעות הצוות מוצגות
// כ"צוות הלומדה", בלי זהות המנהל. כללי המעבר (תשובה פותחת מחדש בקשה שנפתרה או שממתינה
// ללומד; בקשה סגורה לקריאה בלבד) נאכפים במסד, והעמוד רק מציג את המצב שהוא מחזיר.
// Enter בשדה התשובה מוסיף שורה ולעולם אינו שולח.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import React, { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useT } from "@/i18n/useT";
import { AuthAlert, FieldError } from "../../AccountPanel";
import { markSupportRequestRead, sendSupportReply } from "../actions";
import { KIND_ICON, KIND_ICON_COLOR, KIND_TONE, LocalTime, PRIMARY_BUTTON, SECONDARY_LINK, StatusBadge, SupportOrigin } from "../supportParts";
import { SUPPORT_HOME, SUPPORT_MAX_CHARS, supportNewHref, type SupportMessage, type SupportRequestDetail } from "../supportShared";

interface Props {
    request: SupportRequestDetail | null;
    messages: SupportMessage[];
    loadFailed: boolean;
    justCreated: boolean;
}

export function SupportRequestView({ request, messages, loadFailed, justCreated }: Props) {
    const { t } = useT();
    const s = t.chrome.support;
    const router = useRouter();
    const ids = useId();
    const headingRef = useRef<HTMLHeadingElement>(null);
    const listRef = useRef<HTMLOListElement>(null);
    const bodyRef = useRef<HTMLTextAreaElement>(null);
    // מספר ההודעות לפני תשובה שנשלחה: כשהשיחה המרועננת ארוכה ממנו, הפוקוס עובר להודעה החדשה.
    const focusAfter = useRef<number | null>(null);
    const [body, setBody] = useState("");
    const [bodyError, setBodyError] = useState(false);
    const [alert, setAlert] = useState<string | null>(null);
    const [status, setStatus] = useState(justCreated ? s.sentNotice : "");
    const [busy, setBusy] = useState(false);
    const requestId = request?.id;

    // בקשה שנוצרה זה עתה: הפוקוס עובר לכותרת, והודעת "נשלחה" מוצגת לידה.
    useEffect(() => {
        if (justCreated) headingRef.current?.focus();
    }, [justCreated]);

    // פתיחת הבקשה מסמנת את ההתראות שלה כנקראו (פעולה בצד השרת, אחרי שהעמוד הוצג בפועל).
    useEffect(() => {
        if (requestId) void markSupportRequestRead(requestId);
    }, [requestId]);

    useEffect(() => {
        if (focusAfter.current !== null && messages.length > focusAfter.current) {
            focusAfter.current = null;
            (listRef.current?.lastElementChild as HTMLElement | null)?.focus();
        }
    }, [messages.length]);

    if (!request) {
        return (
            <>
                <Link href={SUPPORT_HOME} className={SECONDARY_LINK}>{s.backToList}</Link>
                <section aria-labelledby="support-missing" className="mt-4 space-y-3">
                    <h1 id="support-missing" className="text-2xl md:text-3xl font-black leading-tight">{loadFailed ? s.title : s.notFoundTitle}</h1>
                    <p role={loadFailed ? "alert" : undefined} className="leading-7 text-[var(--bts-text-secondary)]">{loadFailed ? s.loadFailed : s.notFoundBody}</p>
                </section>
            </>
        );
    }

    const send = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (busy) return;
        setAlert(null);
        setStatus("");
        if (body.trim() === "") {
            setBodyError(true);
            bodyRef.current?.focus();
            return;
        }
        setBusy(true);
        focusAfter.current = messages.length;
        let result: Awaited<ReturnType<typeof sendSupportReply>>;
        try {
            result = await sendSupportReply(request.id, body);
        } catch {
            result = { ok: false, outcome: "failed" };
        }
        setBusy(false);
        if (result.ok) {
            setBody("");
            setStatus(s.replySent);
            return;
        }
        focusAfter.current = null;
        setAlert(s.errors[result.outcome]);
        // הבקשה נסגרה או נעלמה בינתיים: מרעננים כדי שהעמוד יציג את המצב הנוכחי.
        if (result.outcome === "closed" || result.outcome === "not_found") router.refresh();
    };

    const Icon = KIND_ICON[request.kind];
    const bodyHintId = `${ids}-hint`;
    const bodyErrorId = `${ids}-error`;

    return (
        <>
            <Link href={SUPPORT_HOME} className={SECONDARY_LINK}>{s.backToList}</Link>

            <header className="mt-4 space-y-3">
                <h1 ref={headingRef} tabIndex={-1} className="flex items-center gap-2 text-2xl md:text-3xl font-black leading-tight focus:outline-none">
                    <Icon size={22} aria-hidden className={`${KIND_TONE[request.kind]} ${KIND_ICON_COLOR} shrink-0`} />
                    {s.kinds[request.kind].noun}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={request.status} />
                </div>
                <p className="max-w-[62ch] text-[15px] leading-7 text-[var(--bts-text-secondary)]">{s.statusHelp[request.status]}</p>
                <SupportOrigin route={request.route} className="text-sm text-[var(--bts-text-secondary)]" />
                <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--bts-text-muted)]">
                    <LocalTime iso={request.created_at} format={s.started} />
                    <LocalTime iso={request.last_activity_at} format={s.lastActivity} />
                </p>
            </header>

            <p aria-live="polite" className="mt-4 min-h-[1.25rem] text-sm font-bold text-[var(--bts-status-positive)]">{status}</p>

            <section aria-labelledby="support-conversation" className="mt-4">
                <h2 id="support-conversation" className="text-lg md:text-xl font-bold">{s.conversation}</h2>
                <ol ref={listRef} className="mt-4 space-y-3">
                    {messages.map((m) => (
                        <li
                            key={m.id}
                            tabIndex={-1}
                            className={`rounded-2xl border p-4 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--bts-focus-ring)] ${m.author === "team"
                                ? "border-[color-mix(in_oklab,var(--bts-brand-primary)_45%,transparent)] border-s-4 border-s-[var(--bts-brand-primary)] bg-[color-mix(in_oklab,var(--bts-brand-primary)_7%,var(--bts-surface))]"
                                : "border-[var(--bts-border)] bg-[var(--bts-surface)]"}`}
                        >
                            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <span className="font-bold text-[var(--bts-text-primary)]">{m.author === "team" ? s.team : s.you}</span>
                                <span className="text-xs text-[var(--bts-text-muted)]"><LocalTime iso={m.created_at} /></span>
                            </p>
                            {/* טקסט הלומד או הצוות בדיוק כפי שנכתב, עם בידוד כיוון לכל הודעה. */}
                            <p dir="auto" className="mt-2 whitespace-pre-wrap leading-7 text-[var(--bts-text-body)] [overflow-wrap:anywhere]">{m.body}</p>
                        </li>
                    ))}
                </ol>
            </section>

            {request.can_reply ? (
                <section aria-labelledby="support-reply" className="mt-10">
                    <h2 id="support-reply" className="text-lg md:text-xl font-bold">{s.replyTitle}</h2>
                    <form onSubmit={send} noValidate className="mt-3 space-y-4">
                        <div>
                            <label htmlFor={`${ids}-body`} className="block font-bold text-[var(--bts-text-primary)]">{s.replyLabel}</label>
                            <p id={bodyHintId} className="mt-1 text-sm leading-6 text-[var(--bts-text-muted)]">{s.messageHint(SUPPORT_MAX_CHARS)}</p>
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
                                className="mt-2 block w-full resize-y rounded-xl border border-[var(--bts-border)] bg-[var(--bts-sub-fill)] px-3 py-2.5 text-base leading-7 text-[var(--bts-text-primary)] [overflow-wrap:anywhere] aria-[invalid=true]:border-[var(--bts-status-danger)]"
                            />
                            <div className="flex items-start gap-3">
                                <FieldError id={bodyErrorId} text={bodyError ? s.errorEmpty : undefined} />
                                <p className="ms-auto mt-1 shrink-0 text-xs tabular-nums text-[var(--bts-text-muted)]">{s.charCount(body.length, SUPPORT_MAX_CHARS)}</p>
                            </div>
                        </div>
                        {alert && <AuthAlert title={s.errorTitle} body={alert} />}
                        <button type="submit" disabled={busy} className={PRIMARY_BUTTON}>
                            {busy ? s.sending : s.sendReply}
                        </button>
                    </form>
                </section>
            ) : (
                <section aria-labelledby="support-closed" className="mt-10 space-y-3 rounded-2xl border border-[var(--bts-border)] bg-[var(--bts-fill-soft)] p-5">
                    <h2 id="support-closed" className="sr-only">{s.statuses.closed}</h2>
                    {alert && <AuthAlert title={s.errorTitle} body={alert} />}
                    <p className="leading-7 text-[var(--bts-text-secondary)]">{s.closedNote}</p>
                    <Link href={supportNewHref()} className={PRIMARY_BUTTON}>{s.newRequest}</Link>
                </section>
            )}
        </>
    );
}
