"use client";

// ────────────────────────────────────────────────────────────────────────
// GuardrailsLab - מעבדת ה-Guardrails של פרק 18 ("Guardrails: סיכון, הרשאות,
// אישור ועצירה").
//
// הרעיון המרכזי: אותה משימה בדיוק, "בדוק את החבילה ועדכן את הלקוח", מובילה לחמש
// פעולות שונות, וכל פעולה עוברת שכבת בקרה:
//   1. בקשת מידע חסר: אין מספר מעקב, עוצרים ושואלים.
//   2. בדיקת סטטוס: קריאה בלבד, סיכון נמוך, מותר.
//   3. ניסוח טיוטה: פונה ללקוח אבל לא נשלח, טיוטה בלבד.
//   4. שליחת הודעה: פעולה חיצונית, סיכון גבוה, דרוש אישור.
//   5. סימון כנמסר בלי בסיס במקור: פעולה חסומה.
// בכל פעולה רואים את הפעולה המבוקשת, תג סיכון, פאנל בדיקת בקרה, החלטת המערכת, מה
// מותר ומה אסור, הערת בקרה ושורה תחתונה.
//
// דטרמיניסטי לחלוטין: אין אקראיות, אין קריאת מודל אמיתית, אין חיבור אמיתי למערכת
// מעקב, אין שליחת הודעה אמיתית, אין שינוי סטטוס אמיתי, ואין שרשרת חשיבה נסתרת. כל
// הטקסט תלוי-השפה מגיע מ-data לפי locale, והכיוון (RTL/LTR) מ-dir. סדר הפעולות קבוע
// כדי שהמסך לא יקפוץ, ומפתחות ה-actionType / riskTone / outcomeTone / state מבניים.
//
// אין בקובץ הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    HelpCircle, Search, PenLine, Send, PackageCheck,
    CheckCircle2, XCircle, AlertTriangle, ShieldAlert, Ban,
    ListChecks, ScrollText, Lightbulb, Check, RotateCcw, ShieldCheck, type LucideIcon,
} from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import type {
    GuardrailsLabContent, GuardrailActionType, RiskTone, OutcomeTone, CheckState,
} from '@/i18n/locales/he/behind-ai/guardrailsLab';
import { DUR } from './motionTokens';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

interface GuardrailsLabProps {
    data: GuardrailsLabContent;
    dir: Direction;
    /** שפת ההקראה של התוכן (contentLocale). ברירת מחדל: שפת הממשק. */
    speechLocale?: Locale;
}

/** אייקון לכל סוג פעולה. מבני, נגזר מ-actionType. */
const ACTION_ICON: Record<GuardrailActionType, LucideIcon> = {
    ask: HelpCircle,
    lookup: Search,
    draft: PenLine,
    send: Send,
    mark: PackageCheck,
    retry: RotateCcw,
};

/** גוון תג הסיכון, נגזר מ-riskTone. */
const RISK_TONE: Record<RiskTone, string> = {
    missing: 'border-amber-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-amber-950)] [--t-l:var(--color-amber-500)] text-amber-100',
    low: 'border-emerald-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] text-emerald-100',
    medium: 'border-amber-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-amber-950)] [--t-l:var(--color-amber-500)] text-amber-100',
    high: 'border-orange-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-orange-950)] [--t-l:var(--color-orange-500)] text-orange-100',
    blocked: 'border-rose-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)] text-rose-100',
    limit: 'border-violet-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-violet-950)] [--t-l:var(--color-violet-500)] text-violet-100',
};

/** גוון ואייקון תג ההחלטה, נגזר מ-outcomeTone. */
const OUTCOME_TONE: Record<OutcomeTone, { badge: string; Icon: LucideIcon }> = {
    ask: { badge: 'border-amber-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-amber-950)] [--t-l:var(--color-amber-500)] text-amber-100', Icon: HelpCircle },
    allow: { badge: 'border-emerald-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] text-emerald-100', Icon: CheckCircle2 },
    draft: { badge: 'border-sky-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-sky-950)] [--t-l:var(--color-sky-500)] text-sky-100', Icon: PenLine },
    approval: { badge: 'border-orange-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-orange-950)] [--t-l:var(--color-orange-500)] text-orange-100', Icon: ShieldAlert },
    stop: { badge: 'border-rose-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)] text-rose-100', Icon: Ban },
    limit: { badge: 'border-violet-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-violet-950)] [--t-l:var(--color-violet-500)] text-violet-100', Icon: Ban },
};

/** אייקון וגוון לכל מצב בדיקה, נגזר מ-state. */
const CHECK_STATE: Record<CheckState, { Icon: LucideIcon; color: string }> = {
    pass: { Icon: CheckCircle2, color: 'text-emerald-300' },
    warn: { Icon: AlertTriangle, color: 'text-amber-300' },
    fail: { Icon: XCircle, color: 'text-rose-300' },
};

export const GuardrailsLab: React.FC<GuardrailsLabProps> = ({ data, dir, speechLocale }) => {
    const reduce = useReducedMotion();
    const [actionId, setActionId] = useState(data.actions[0].id);

    const active = data.actions.find((a) => a.id === actionId) ?? data.actions[0];
    const ActionIcon = ACTION_ICON[active.actionType];
    const outcome = OUTCOME_TONE[active.outcomeTone];
    const OutcomeIcon = outcome.Icon;

    // הקראת מצב המעבדה: המשימה, הפעולה, הסיכון, ההחלטה, הבדיקות, התוצאה, מותר/אסור,
    // הערת הבקרה והשורה התחתונה.
    const stateSpeech = speakJoin(
        `${data.heading}. ${data.taskLabel}: ${data.task}`,
        `${data.requestLabel}: ${active.request}`,
        `${data.riskLabel}: ${active.riskLabel}. ${data.outcomeLabel}: ${active.outcomeLabel}`,
        `${data.checksLabel}: ${active.checks.map((c) => `${c.label}, ${c.note}`).join('. ')}`,
        active.result && `${active.result.label}: ${active.result.rows.join(', ')}`,
        `${data.mayLabel}: ${active.mayDo}`,
        `${data.mustNotLabel}: ${active.mustNot}`,
        `${data.auditLabel}: ${active.auditNote}`,
        `${data.verifyLabel}: ${active.verification}`,
        `${data.takeawayLabel}: ${active.takeaway}`,
    );

    return (
        <div className="rounded-2xl border border-indigo-500/25 bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
            {/* כותרת הרכיב */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <ShieldAlert size={18} className="text-indigo-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-[var(--bts-text-bright)]">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--bts-text-faint)]" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={stateSpeech} speechLocale={speechLocale} />
            </div>

            {/* ── כרטיס המשימה הקבוע ── */}
            <div className="mb-4 rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3.5">
                <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">{data.taskLabel}</div>
                <p className="text-[15px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{data.task}</p>
            </div>

            {/* ── בורר הפעולות ── */}
            <div className="mb-1 text-[13px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">{data.actionSelectLabel}</div>
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" role="group" aria-label={data.sr.actionGroup}>
                {data.actions.map((a) => {
                    const activeBtn = a.id === actionId;
                    const Icon = ACTION_ICON[a.actionType];
                    return (
                        <button
                            key={a.id}
                            type="button"
                            onClick={() => setActionId(a.id)}
                            aria-pressed={activeBtn}
                            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2.5 text-start text-[13px] font-bold leading-tight break-words transition-colors ${activeBtn
                                ? 'border-indigo-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-indigo-900)] [--t-l:var(--color-indigo-500)] text-indigo-100'
                                : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
                                }`}
                        >
                            <Icon size={15} className="shrink-0" aria-hidden />
                            <span dir={dir}>{a.control}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── הפעולה הפעילה ── */}
            <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                className="space-y-3"
                role="group"
                aria-label={data.sr.actionDetail}
            >
                {/* פעולה מבוקשת */}
                <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">
                        <ActionIcon size={13} className="text-indigo-300" aria-hidden /> {data.requestLabel}
                    </div>
                    <p className="text-[15px] font-bold leading-snug text-[var(--bts-text-bright)]">{active.request}</p>
                </div>

                {/* שני התגים: רמת סיכון + החלטת המערכת */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className={`rounded-xl border p-3 ${RISK_TONE[active.riskTone]}`}>
                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-90" dir={dir}>{data.riskLabel}</span>
                        <div className="mt-0.5 flex items-center gap-1.5 text-sm font-black">
                            <AlertTriangle size={15} aria-hidden /> {active.riskLabel}
                        </div>
                    </div>
                    <div className={`rounded-xl border p-3 ${outcome.badge}`}>
                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-90" dir={dir}>{data.outcomeLabel}</span>
                        <div className="mt-0.5 flex items-center gap-1.5 text-sm font-black">
                            <OutcomeIcon size={15} aria-hidden /> {active.outcomeLabel}
                        </div>
                    </div>
                </div>

                {/* פאנל בדיקת בקרה */}
                <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">
                        <ListChecks size={13} className="text-[var(--bts-text-secondary)]" aria-hidden /> {data.checksLabel}
                    </div>
                    <ul className="space-y-2">
                        {active.checks.map((c) => {
                            const cs = CHECK_STATE[c.state];
                            const CheckIcon = cs.Icon;
                            return (
                                <li key={c.label} className="flex items-start gap-2">
                                    <CheckIcon size={16} className={`mt-0.5 shrink-0 ${cs.color}`} aria-hidden />
                                    <span className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">
                                        <span className="font-bold text-[var(--bts-text-bright)]">{c.label}: </span>
                                        {c.note}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* תוצאה או טיוטה, רק כשהפעולה כוללת פלט */}
                {active.result && (
                    <div className="rounded-xl border border-indigo-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-indigo-950)] [--t-l:var(--color-indigo-500)] p-3">
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">{active.result.label}</span>
                            <SpeakButton text={`${active.result.label}. ${active.result.rows.join(', ')}`} speechLocale={speechLocale} />
                        </div>
                        <ul className="space-y-1">
                            {active.result.rows.map((row) => (
                                <li key={row} className="flex items-start gap-2 text-[13px] leading-relaxed text-[var(--bts-text-body)]">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" aria-hidden />
                                    <span>{row}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* מותר / אסור */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(10%_-_var(--bts-tint-mix)_*_0.05),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] p-3">
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                            <Check size={13} aria-hidden /> {data.mayLabel}
                        </div>
                        <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">{active.mayDo}</p>
                    </div>
                    <div className="rounded-xl border border-rose-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(10%_-_var(--bts-tint-mix)_*_0.05),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)] p-3">
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-200">
                            <XCircle size={13} aria-hidden /> {data.mustNotLabel}
                        </div>
                        <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">{active.mustNot}</p>
                    </div>
                </div>

                {/* הערת בקרה */}
                <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">
                        <ScrollText size={13} className="text-[var(--bts-text-secondary)]" aria-hidden /> {data.auditLabel}
                    </div>
                    <p className="text-[13px] leading-relaxed text-[var(--bts-text-secondary)]">{active.auditNote}</p>
                </div>

                {/* Verification is separate from authorization and from the decision to run. */}
                <div className="rounded-xl border border-cyan-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(10%_-_var(--bts-tint-mix)_*_0.05),transparent)] [--t-d:var(--color-cyan-950)] [--t-l:var(--color-cyan-500)] p-3">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-200">
                        <ShieldCheck size={13} aria-hidden /> {data.verifyLabel}
                    </div>
                    <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">{active.verification}</p>
                </div>

                {/* השורה התחתונה */}
                <div className="rounded-xl border border-indigo-500/30 bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                        <Lightbulb size={13} className="text-indigo-300" aria-hidden /> {data.takeawayLabel}
                    </div>
                    <p className="text-[13px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{active.takeaway}</p>
                </div>
            </motion.div>

            {/* הבהרה: כל הדוגמאות לימודיות בלבד */}
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--bts-text-faint)]">{data.disclaimer}</p>
        </div>
    );
};
