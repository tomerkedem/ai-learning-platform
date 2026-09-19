"use client";

// ────────────────────────────────────────────────────────────────────────
// GroundingLab - מעבדת העיגון של פרק 12 (RAG & Grounding: איך מחברים AI למקורות).
//
// הרעיון המרכזי: אותה שאלה בדיוק של לקוח, וארבעה מצבי מקור. הלומד עובר בין המצבים,
// בלי מקור, עם מקור, מקור חסר ומקור סותר, ורואה איך מקור משנה את מה שהתשובה יכולה
// לומר: על מה היא נשענת, מה מותר לה לומר, ומה אסור לה להמציא.
//
// דטרמיניסטי לחלוטין: אין אקראיות, אין קריאת מודל אמיתית, ואין טענה שהאחזור מגיע
// ממערכת מעקב אמיתית. כל הנתונים תלויי-השפה (modes, source, checks) מגיעים מ-data לפי
// locale, והכיוון (RTL/LTR) מ-dir. סדר המצבים ושורות הבדיקה נשאר קבוע כדי שהמסך לא
// יקפוץ.
//
// אין בקובץ הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    MessageSquare, CheckCircle2, XCircle, AlertTriangle, FileSearch,
    Lightbulb, Link2, Unlink, CircleSlash, Scale, Database, ShieldOff, type LucideIcon,
} from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import type { GroundingLabContent, CheckState, GroundingBadge } from '@/i18n/locales/he/behind-ai/groundingLab';
import { DUR } from './motionTokens';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

interface GroundingLabProps {
    data: GroundingLabContent;
    dir: Direction;
    /** שפת ההקראה של התוכן (contentLocale). ברירת מחדל: שפת הממשק. */
    speechLocale?: Locale;
}

/** אייקון וגוון לכל תג מצב עיגון. מבני, נגזר מ-badge. */
const BADGE_TONE: Record<GroundingBadge, { Icon: LucideIcon; cls: string }> = {
    ungrounded: { Icon: Unlink, cls: 'border-rose-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)] text-rose-100' },
    grounded: { Icon: Link2, cls: 'border-emerald-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] text-emerald-100' },
    incomplete: { Icon: CircleSlash, cls: 'border-amber-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-amber-950)] [--t-l:var(--color-amber-500)] text-amber-100' },
    contradiction: { Icon: Scale, cls: 'border-violet-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-violet-950)] [--t-l:var(--color-violet-500)] text-violet-100' },
};

/** אייקון וגוון לכל מצב בדיקת עיגון. מבני, נגזר מ-state. */
const CHECK_TONE: Record<CheckState, { Icon: LucideIcon; cls: string }> = {
    pass: { Icon: CheckCircle2, cls: 'text-emerald-300' },
    warn: { Icon: AlertTriangle, cls: 'text-amber-300' },
    fail: { Icon: XCircle, cls: 'text-rose-300' },
};

export const GroundingLab: React.FC<GroundingLabProps> = ({ data, dir, speechLocale }) => {
    const reduce = useReducedMotion();
    const [modeId, setModeId] = useState(data.modes[0].id);

    const mode = data.modes.find((m) => m.id === modeId) ?? data.modes[0];
    const { Icon: BadgeIcon, cls: badgeCls } = BADGE_TONE[mode.badge];

    // הקראת מצב המעבדה: השאלה, מצב המקור, התשובה הנבחרת, ומה מותר או אסור לומר.
    const stateSpeech = speakJoin(
        `${data.questionLabel}: ${data.question}`,
        `${mode.badgeLabel}. ${mode.summary}`,
        `${data.answerLabel}: ${mode.answer}`,
        `${data.maySayLabel}: ${mode.maySay}`,
        `${data.mustNotInventLabel}: ${mode.mustNotInvent}`,
    );

    return (
        <div className="rounded-2xl border border-teal-500/25 bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
            {/* כותרת הרכיב */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Database size={18} className="text-teal-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-[var(--bts-text-bright)]">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--bts-text-faint)]" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={stateSpeech} speechLocale={speechLocale} />
            </div>

            {/* שאלת הלקוח הקבועה */}
            <div className="mb-4 rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">
                    <MessageSquare size={12} className="text-[var(--bts-text-muted)]" /> {data.questionLabel}
                </div>
                <p className="text-sm font-bold text-[var(--bts-text-bright)]">{data.question}</p>
            </div>

            {/* בורר מצב המקור */}
            <div className="mb-1 text-[13px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">{data.modeLabel}</div>
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
                                ? 'border-teal-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-teal-900)] [--t-l:var(--color-teal-500)] text-teal-100'
                                : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
                                }`}
                        >
                            {m.control}
                        </button>
                    );
                })}
            </div>

            {/* מצב המקור הפעיל */}
            <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                className="space-y-3"
            >
                {/* תג מצב העיגון */}
                <div className={`rounded-xl border p-3 ${badgeCls}`}>
                    <div className="flex items-center gap-2">
                        <BadgeIcon size={16} aria-hidden />
                        <span className="text-sm font-black">{mode.badgeLabel}</span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed">{mode.summary}</p>
                </div>

                {/* כרטיס המקור, או כרטיס "אין מקור" */}
                {mode.source ? (
                    <div className="rounded-xl border border-sky-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-sky-950)] [--t-l:var(--color-sky-500)] p-3">
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-200">
                            <FileSearch size={13} aria-hidden /> {mode.source.label}
                        </div>
                        <p className="mb-2.5 text-[13px] leading-relaxed text-[var(--bts-text-muted)]">{mode.source.caption}</p>
                        <dl className="space-y-1.5">
                            {mode.source.rows.map((row) => (
                                <div key={row.label} className="flex items-center justify-between gap-3 border-b border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border)_var(--bts-tint-mix),var(--color-slate-800))_60%,transparent)] pb-1.5 last:border-0 last:pb-0">
                                    <dt className="text-[13px] font-medium text-[var(--bts-text-muted)]">{row.label}</dt>
                                    <dd className={`text-[13px] font-bold ${row.missing ? 'text-amber-300/90' : 'text-[var(--bts-text-bright)]'}`}>{row.value}</dd>
                                </div>
                            ))}
                        </dl>
                        <p className="mt-2.5 text-[13px] leading-relaxed text-sky-200/90">{mode.source.note}</p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))_40%,transparent)] border-dashed bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-3">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">
                            <ShieldOff size={13} aria-hidden /> {data.noSourceLabel}
                        </div>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--bts-text-muted)]">{data.noSourceNote}</p>
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

                {/* פאנל בדיקת עיגון */}
                <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-3.5">
                    <div className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">
                        <FileSearch size={13} className="text-teal-300" /> {data.groundingCheckLabel}
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

                {/* מה מותר לומר, מה אסור להמציא */}
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] p-3.5">
                        <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                            <CheckCircle2 size={13} aria-hidden /> {data.maySayLabel}
                        </div>
                        <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">{mode.maySay}</p>
                    </div>
                    <div className="rounded-xl border border-rose-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)] p-3.5">
                        <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-rose-200">
                            <XCircle size={13} aria-hidden /> {data.mustNotInventLabel}
                        </div>
                        <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">{mode.mustNotInvent}</p>
                    </div>
                </div>

                {/* שורה תחתונה */}
                <div className="rounded-xl border border-teal-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-teal-950)] [--t-l:var(--color-teal-500)] p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-teal-200">
                        <Lightbulb size={13} className="text-teal-300" /> {data.takeawayLabel}
                    </div>
                    <p className="text-[13px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{mode.takeaway}</p>
                </div>
            </motion.div>

            {/* הבהרה: כל הדוגמאות לימודיות בלבד */}
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--bts-text-faint)]">{data.disclaimer}</p>
        </div>
    );
};
