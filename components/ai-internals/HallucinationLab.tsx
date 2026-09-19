"use client";

// ────────────────────────────────────────────────────────────────────────
// HallucinationLab - מעבדת ההזיות של פרק 11 (Hallucinations: למה תשובה בטוחה יכולה
// להיות שגויה).
//
// הרעיון המרכזי: אותה שאלה בדיוק של לקוח, וארבעה סגנונות תשובה. הלומד בוחר סגנון,
// ורואה מה מאחורי כל תשובה: רמת סיכון, בדיקת עובדות, מה חסר, ושורה תחתונה. תשובה
// שוטפת ובטוחה יכולה להמציא תאריך, בעוד תשובה זהירה או תשובה שנשענת על מקור בטוחות
// הרבה יותר.
//
// דטרמיניסטי לחלוטין: אין אקראיות, אין קריאת מודל אמיתית, ואין טענה שהעקבה מגיעה
// ממודל אמיתי. כל הנתונים תלויי-השפה (modes, checks, source) מגיעים מ-data לפי locale,
// והכיוון (RTL/LTR) מ-dir. סדר הסגנונות ושורות הבדיקה נשאר קבוע כדי שהמסך לא יקפוץ.
//
// אין בקובץ הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MessageSquare, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, FileSearch, HelpCircle, Lightbulb, Scale, type LucideIcon } from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import type { HallucinationsLabContent, CheckState, RiskLevel } from '@/i18n/locales/he/behind-ai/hallucinationsLab';
import { DUR } from './motionTokens';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

interface HallucinationLabProps {
    data: HallucinationsLabContent;
    dir: Direction;
    /** שפת ההקראה של התוכן (contentLocale). ברירת מחדל: שפת הממשק. */
    speechLocale?: Locale;
}

/** גוון תווית הסיכון לפי רמה. מבני, נגזר מ-risk. */
const RISK_TONE: Record<RiskLevel, string> = {
    high: 'border-rose-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)] text-rose-100',
    medium: 'border-amber-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-amber-950)] [--t-l:var(--color-amber-500)] text-amber-100',
    low: 'border-emerald-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] text-emerald-100',
};

/** אייקון וגוון לכל מצב בדיקת עובדות. מבני, נגזר מ-state. */
const CHECK_TONE: Record<CheckState, { Icon: LucideIcon; cls: string }> = {
    pass: { Icon: CheckCircle2, cls: 'text-emerald-300' },
    warn: { Icon: AlertTriangle, cls: 'text-amber-300' },
    fail: { Icon: XCircle, cls: 'text-rose-300' },
};

export const HallucinationLab: React.FC<HallucinationLabProps> = ({ data, dir, speechLocale }) => {
    const reduce = useReducedMotion();
    const [modeId, setModeId] = useState(data.modes[0].id);

    const mode = data.modes.find((m) => m.id === modeId) ?? data.modes[0];

    // הקראת מצב המעבדה: השאלה, התשובה הנבחרת, רמת הסיכון ומה חסר.
    const stateSpeech = speakJoin(
        `${data.questionLabel}: ${data.question}`,
        `${data.answerLabel}: ${mode.answer}`,
        `${data.riskLabel}: ${mode.riskLabel}. ${mode.riskNote}`,
        `${data.missingLabel} ${mode.missing}`,
    );

    return (
        <div className="rounded-2xl border border-amber-500/25 bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
            {/* כותרת הרכיב */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <FileSearch size={18} className="text-amber-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-[var(--bts-text-bright)]">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--bts-text-faint)]" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={stateSpeech} speechLocale={speechLocale} />
            </div>

            {/* שאלת הלקוח הקבועה */}
            <div className="mb-4 rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">
                    <MessageSquare size={12} className="text-[var(--bts-text-muted)]" /> {data.questionLabel}
                </div>
                <p className="text-sm font-bold text-[var(--bts-text-bright)]">{data.question}</p>
            </div>

            {/* בורר סגנון התשובה */}
            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-faint)]">{data.modeLabel}</div>
            <div className="mb-4 grid grid-cols-2 gap-2" role="group" aria-label={data.sr.modeGroup}>
                {data.modes.map((m) => {
                    const active = m.id === modeId;
                    return (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => setModeId(m.id)}
                            aria-pressed={active}
                            className={`rounded-xl border px-2.5 py-2.5 text-center text-sm font-bold leading-tight break-words transition-colors ${active
                                ? 'border-amber-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-amber-900)] [--t-l:var(--color-amber-500)] text-amber-100'
                                : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
                                }`}
                        >
                            {m.control}
                        </button>
                    );
                })}
            </div>

            {/* מצב הסגנון הפעיל */}
            <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                className="space-y-3"
            >
                {/* תווית סיכון */}
                <div className={`rounded-xl border p-3 ${RISK_TONE[mode.risk]}`}>
                    <div className="flex items-center gap-2">
                        <ShieldAlert size={16} aria-hidden />
                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">{data.riskLabel}</span>
                        <span className="text-sm font-black">{mode.riskLabel}</span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed">{mode.riskNote}</p>
                </div>

                {/* כרטיס מקור לדוגמה (בסגנון המבוסס בלבד) */}
                {mode.showSource && (
                    <div className="rounded-xl border border-sky-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-sky-950)] [--t-l:var(--color-sky-500)] p-3">
                        <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-sky-200">{data.source.label}</div>
                        <p className="mb-2.5 text-[13px] leading-relaxed text-[var(--bts-text-muted)]">{data.source.caption}</p>
                        <dl className="space-y-1.5">
                            {data.source.rows.map((row) => (
                                <div key={row.label} className="flex items-center justify-between gap-3 border-b border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border)_var(--bts-tint-mix),var(--color-slate-800))_60%,transparent)] pb-1.5 last:border-0 last:pb-0">
                                    <dt className="text-[13px] font-medium text-[var(--bts-text-muted)]">{row.label}</dt>
                                    <dd className="text-[13px] font-bold text-[var(--bts-text-bright)]">{row.value}</dd>
                                </div>
                            ))}
                        </dl>
                        <p className="mt-2.5 text-[13px] leading-relaxed text-sky-200/90">{data.source.note}</p>
                    </div>
                )}

                {/* התשובה שהתקבלה */}
                <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3.5">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">{data.answerLabel}</span>
                        <SpeakButton text={mode.answer} speechLocale={speechLocale} />
                    </div>
                    <p className="text-[15px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{mode.answer}</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-[var(--bts-text-muted)]">{mode.answerSummary}</p>
                </div>

                {/* פאנל בדיקת עובדות */}
                <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-3.5">
                    <div className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">
                        <FileSearch size={13} className="text-amber-300" /> {data.factCheckLabel}
                    </div>
                    <ul className="space-y-2.5" role="group" aria-label={data.sr.checks}>
                        {mode.checks.map((check) => {
                            const { Icon, cls } = CHECK_TONE[check.state];
                            return (
                                <li key={check.id} className="flex items-start gap-2.5">
                                    <Icon size={16} className={`mt-0.5 shrink-0 ${cls}`} aria-hidden />
                                    <div>
                                        <div className="text-[13px] font-bold text-[var(--bts-text-body)]">{check.label}</div>
                                        <p className="text-[13px] leading-relaxed text-[var(--bts-text-muted)]">{check.note}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* מה חסר */}
                <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">
                        <HelpCircle size={13} className="text-amber-300" /> {data.missingLabel}
                    </div>
                    <p className="text-[13px] leading-relaxed text-[var(--bts-text-secondary)]">{mode.missing}</p>
                </div>

                {/* שורה תחתונה */}
                <div className="rounded-xl border border-amber-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-amber-950)] [--t-l:var(--color-amber-500)] p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-200">
                        <Lightbulb size={13} className="text-amber-300" /> {data.takeawayLabel}
                    </div>
                    <p className="text-[13px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{mode.takeaway}</p>
                </div>
            </motion.div>

            {/* השוואה קבועה: ביטחון וביסוס הם שני צירים נפרדים, מנוגדים לפי הראיה ולא לפי הנימה */}
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-sky-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-sky-950)] [--t-l:var(--color-sky-500)] p-3.5">
                <Scale size={16} className="mt-0.5 shrink-0 text-sky-300" aria-hidden />
                <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">{data.evidenceNote}</p>
            </div>

            {/* הבהרה: כל הדוגמאות לימודיות בלבד */}
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--bts-text-faint)]">{data.disclaimer}</p>
        </div>
    );
};
