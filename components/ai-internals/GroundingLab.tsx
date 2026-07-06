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
    ungrounded: { Icon: Unlink, cls: 'border-rose-400/50 bg-rose-950/25 text-rose-100' },
    grounded: { Icon: Link2, cls: 'border-emerald-400/50 bg-emerald-950/25 text-emerald-100' },
    incomplete: { Icon: CircleSlash, cls: 'border-amber-400/50 bg-amber-950/25 text-amber-100' },
    contradiction: { Icon: Scale, cls: 'border-violet-400/50 bg-violet-950/25 text-violet-100' },
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
        <div className="rounded-2xl border border-teal-500/25 bg-slate-900/50 p-5 text-start" dir={dir}>
            {/* כותרת הרכיב */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Database size={18} className="text-teal-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-100">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={stateSpeech} speechLocale={speechLocale} />
            </div>

            {/* שאלת הלקוח הקבועה */}
            <div className="mb-4 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    <MessageSquare size={12} className="text-slate-400" /> {data.questionLabel}
                </div>
                <p className="text-sm font-bold text-slate-100">{data.question}</p>
            </div>

            {/* בורר מצב המקור */}
            <div className="mb-1 text-[13px] font-bold uppercase tracking-wider text-slate-400">{data.modeLabel}</div>
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
                                ? 'border-teal-400/60 bg-teal-900/25 text-teal-100'
                                : 'border-slate-700/50 bg-slate-950/30 text-slate-300 hover:border-slate-600'
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
                initial={reduce ? false : { opacity: 0, y: 6 }}
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
                    <div className="rounded-xl border border-sky-500/30 bg-sky-950/15 p-3">
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-200">
                            <FileSearch size={13} aria-hidden /> {mode.source.label}
                        </div>
                        <p className="mb-2.5 text-[13px] leading-relaxed text-slate-400">{mode.source.caption}</p>
                        <dl className="space-y-1.5">
                            {mode.source.rows.map((row) => (
                                <div key={row.label} className="flex items-center justify-between gap-3 border-b border-slate-800/60 pb-1.5 last:border-0 last:pb-0">
                                    <dt className="text-[13px] font-medium text-slate-400">{row.label}</dt>
                                    <dd className={`text-[13px] font-bold ${row.missing ? 'text-amber-300/90' : 'text-slate-100'}`}>{row.value}</dd>
                                </div>
                            ))}
                        </dl>
                        <p className="mt-2.5 text-[13px] leading-relaxed text-sky-200/90">{mode.source.note}</p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-slate-600/40 border-dashed bg-slate-950/30 p-3">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            <ShieldOff size={13} aria-hidden /> {data.noSourceLabel}
                        </div>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{data.noSourceNote}</p>
                    </div>
                )}

                {/* התשובה שהתקבלה */}
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3.5">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{data.answerLabel}</span>
                        <SpeakButton text={mode.answer} speechLocale={speechLocale} />
                    </div>
                    <p className="text-[15px] font-bold leading-relaxed text-slate-100">{mode.answer}</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{mode.answerSummary}</p>
                </div>

                {/* פאנל בדיקת עיגון */}
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/30 p-3.5">
                    <div className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <FileSearch size={13} className="text-teal-300" /> {data.groundingCheckLabel}
                    </div>
                    <ul className="space-y-2.5" role="group" aria-label={data.sr.checks}>
                        {mode.checks.map((check) => {
                            const { Icon, cls } = CHECK_TONE[check.state];
                            return (
                                <li key={check.id} className="flex items-start gap-2.5">
                                    <Icon size={16} className={`mt-0.5 shrink-0 ${cls}`} aria-hidden />
                                    <div>
                                        <div className="text-[13px] font-bold text-slate-200">{check.label}</div>
                                        <p className="text-[13px] leading-relaxed text-slate-400">{check.note}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* מה מותר לומר, מה אסור להמציא */}
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-3.5">
                        <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                            <CheckCircle2 size={13} aria-hidden /> {data.maySayLabel}
                        </div>
                        <p className="text-[13px] leading-relaxed text-slate-200">{mode.maySay}</p>
                    </div>
                    <div className="rounded-xl border border-rose-500/30 bg-rose-950/15 p-3.5">
                        <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-rose-200">
                            <XCircle size={13} aria-hidden /> {data.mustNotInventLabel}
                        </div>
                        <p className="text-[13px] leading-relaxed text-slate-200">{mode.mustNotInvent}</p>
                    </div>
                </div>

                {/* שורה תחתונה */}
                <div className="rounded-xl border border-teal-500/30 bg-teal-950/15 p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-teal-200">
                        <Lightbulb size={13} className="text-teal-300" /> {data.takeawayLabel}
                    </div>
                    <p className="text-[13px] font-bold leading-relaxed text-slate-100">{mode.takeaway}</p>
                </div>
            </motion.div>

            {/* הבהרה: כל הדוגמאות לימודיות בלבד */}
            <p className="mt-4 text-[13px] leading-relaxed text-slate-500">{data.disclaimer}</p>
        </div>
    );
};
