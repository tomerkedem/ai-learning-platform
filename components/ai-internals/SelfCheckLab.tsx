"use client";

// ────────────────────────────────────────────────────────────────────────
// SelfCheckLab - מעבדת הבדיקה העצמית של פרק 13 (Self-Check: בדיקה עצמית בזמן תשובה).
//
// הרעיון המרכזי: אותה שאלה של לקוח וכרטיס מקור אחד קבוע, ושלוש טיוטות תשובה. הלומד
// עובר בין הטיוטות, בטוחה מדי בניסוח, זהירה מדי, ומאוזנת, ורואה איך אותה בדיקה עצמית
// מסמנת מה נתמך במקור, מה מומצא, ומה חסר, לפני שהתשובה יוצאת. הבדיקה גלויה: רשימת
// בדיקה והשוואת טענות למקור, בלי חשיפת מחשבות פנימיות.
//
// דטרמיניסטי לחלוטין: אין אקראיות, אין קריאת מודל אמיתית, ואין טענה שהמקור מגיע
// ממערכת מעקב אמיתית. כל הנתונים תלויי-השפה (modes, claims, checks) מגיעים מ-data לפי
// locale, והכיוון (RTL/LTR) מ-dir. סדר הטיוטות ושורות הבדיקה נשאר קבוע כדי שהמסך לא
// יקפוץ.
//
// אין בקובץ הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    MessageSquare, FileSearch, CheckCircle2, XCircle, AlertTriangle, Lightbulb,
    ClipboardCheck, ListChecks, PenLine, ShieldQuestion, ArrowDown, type LucideIcon,
} from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import type {
    SelfCheckLabContent, CheckState, ClaimState, DraftBadge,
} from '@/i18n/locales/he/behind-ai/selfCheckLab';
import { DUR } from './motionTokens';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

interface SelfCheckLabProps {
    data: SelfCheckLabContent;
    dir: Direction;
    /** שפת ההקראה של התוכן (contentLocale). ברירת מחדל: שפת הממשק. */
    speechLocale?: Locale;
}

/** אייקון וגוון לכל תג מצב טיוטה. מבני, נגזר מ-badge. */
const BADGE_TONE: Record<DraftBadge, { Icon: LucideIcon; cls: string }> = {
    overclaim: { Icon: AlertTriangle, cls: 'border-rose-400/50 bg-rose-950/25 text-rose-100' },
    overcautious: { Icon: ShieldQuestion, cls: 'border-amber-400/50 bg-amber-950/25 text-amber-100' },
    checked: { Icon: CheckCircle2, cls: 'border-emerald-400/50 bg-emerald-950/25 text-emerald-100' },
};

/** אייקון וגוון לכל מצב טענה. מבני, נגזר מ-state. המשמעות מופיעה גם בטקסט ה-note. */
const CLAIM_TONE: Record<ClaimState, { Icon: LucideIcon; box: string; text: string }> = {
    supported: { Icon: CheckCircle2, box: 'border-emerald-400/40 bg-emerald-950/20', text: 'text-emerald-200' },
    unsupported: { Icon: XCircle, box: 'border-rose-400/40 bg-rose-950/20', text: 'text-rose-200' },
    missing: { Icon: AlertTriangle, box: 'border-amber-400/40 bg-amber-950/20', text: 'text-amber-200' },
};

/** אייקון וגוון לכל שורת בדיקה. מבני, נגזר מ-state. */
const CHECK_TONE: Record<CheckState, { Icon: LucideIcon; cls: string }> = {
    pass: { Icon: CheckCircle2, cls: 'text-emerald-300' },
    warn: { Icon: AlertTriangle, cls: 'text-amber-300' },
    fail: { Icon: XCircle, cls: 'text-rose-300' },
};

export const SelfCheckLab: React.FC<SelfCheckLabProps> = ({ data, dir, speechLocale }) => {
    const reduce = useReducedMotion();
    const [draftId, setDraftId] = useState(data.modes[0].id);

    const mode = data.modes.find((m) => m.id === draftId) ?? data.modes[0];
    const { Icon: BadgeIcon, cls: badgeCls } = BADGE_TONE[mode.badge];

    // הקראת מצב המעבדה: השאלה, הטיוטה הנבחרת, מה הבדיקה מצאה, והתשובה המתוקנת.
    const stateSpeech = speakJoin(
        `${data.questionLabel}: ${data.question}`,
        `${mode.badgeLabel}. ${mode.summary}`,
        `${data.draftLabel}: ${mode.draft}`,
        `${data.issueLabel}: ${mode.issue}`,
        `${data.revisedLabel}: ${mode.revised}`,
    );

    return (
        <div className="rounded-2xl border border-indigo-500/25 bg-slate-900/50 p-5 text-start" dir={dir}>
            {/* כותרת הרכיב */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <ClipboardCheck size={18} className="text-indigo-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-100">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={stateSpeech} speechLocale={speechLocale} />
            </div>

            {/* שאלת הלקוח הקבועה */}
            <div className="mb-3 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    <MessageSquare size={12} className="text-slate-400" /> {data.questionLabel}
                </div>
                <p className="text-sm font-bold text-slate-100">{data.question}</p>
            </div>

            {/* כרטיס המקור הקבוע */}
            <div className="mb-4 rounded-xl border border-sky-500/30 bg-sky-950/15 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-200">
                    <FileSearch size={13} aria-hidden /> {data.sourceLabel}
                </div>
                <p className="mb-2.5 text-[13px] leading-relaxed text-slate-400">{data.sourceCaption}</p>
                <dl className="space-y-1.5">
                    {data.sourceRows.map((row) => (
                        <div key={row.label} className="flex items-center justify-between gap-3 border-b border-slate-800/60 pb-1.5 last:border-0 last:pb-0">
                            <dt className="text-[13px] font-medium text-slate-400">{row.label}</dt>
                            <dd className={`text-[13px] font-bold ${row.missing ? 'text-amber-300/90' : 'text-slate-100'}`}>{row.value}</dd>
                        </div>
                    ))}
                </dl>
                <p className="mt-2.5 text-[13px] leading-relaxed text-sky-200/90">{data.sourceNote}</p>
            </div>

            {/* בורר הטיוטה */}
            <div className="mb-1 text-[13px] font-bold uppercase tracking-wider text-slate-400">{data.draftLabel}</div>
            <div className="mb-4 grid grid-cols-3 gap-2" role="group" aria-label={data.sr.draftGroup}>
                {data.modes.map((m) => {
                    const active = m.id === draftId;
                    return (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => setDraftId(m.id)}
                            aria-pressed={active}
                            className={`rounded-xl border px-2.5 py-2.5 text-center text-[13px] font-bold leading-tight break-words transition-colors ${active
                                ? 'border-indigo-400/60 bg-indigo-900/25 text-indigo-100'
                                : 'border-slate-700/50 bg-slate-950/30 text-slate-300 hover:border-slate-600'
                                }`}
                        >
                            {m.control}
                        </button>
                    );
                })}
            </div>

            {/* הטיוטה הפעילה והבדיקה שלה */}
            <motion.div
                key={mode.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                className="space-y-3"
            >
                {/* תג מצב הטיוטה */}
                <div className={`rounded-xl border p-3 ${badgeCls}`}>
                    <div className="flex items-center gap-2">
                        <BadgeIcon size={16} aria-hidden />
                        <span className="text-sm font-black">{mode.badgeLabel}</span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed">{mode.summary}</p>
                </div>

                {/* טיוטת התשובה */}
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3.5">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            <PenLine size={13} aria-hidden /> {data.draftLabel}
                        </span>
                        <SpeakButton text={mode.draft} speechLocale={speechLocale} />
                    </div>
                    <p className="text-[15px] font-bold leading-relaxed text-slate-100">{mode.draft}</p>
                </div>

                {/* טענות בטיוטה */}
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/30 p-3.5">
                    <div className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <ListChecks size={13} className="text-indigo-300" /> {data.claimsLabel}
                    </div>
                    <div className="space-y-2">
                        {mode.claims.map((claim) => {
                            const tone = CLAIM_TONE[claim.state];
                            const Icon = tone.Icon;
                            return (
                                <div key={claim.id} className={`rounded-lg border p-2.5 ${tone.box}`}>
                                    <div className="flex items-center gap-2">
                                        <Icon size={15} className={`shrink-0 ${tone.text}`} aria-hidden />
                                        <span className={`text-[13px] font-bold ${tone.text}`}>{claim.text}</span>
                                    </div>
                                    <p className="mt-1 text-[13px] leading-relaxed text-slate-300">{claim.note}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* רשימת הבדיקה העצמית */}
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/30 p-3.5">
                    <div className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <ClipboardCheck size={13} className="text-indigo-300" /> {data.checklistLabel}
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

                {/* מה הבדיקה מצאה */}
                <div className="rounded-xl border border-slate-600/50 bg-slate-900/40 p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                        <AlertTriangle size={13} className="text-amber-300" /> {data.issueLabel}
                    </div>
                    <p className="text-[13px] leading-relaxed text-slate-200">{mode.issue}</p>
                </div>

                {/* חץ מהטיוטה לתשובה המתוקנת */}
                <div className="flex justify-center" aria-hidden>
                    <ArrowDown size={18} className="text-indigo-400/70" />
                </div>

                {/* תשובה מתוקנת */}
                <div className="rounded-xl border border-indigo-500/40 bg-indigo-950/20 p-3.5">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                            <CheckCircle2 size={13} aria-hidden /> {data.revisedLabel}
                        </span>
                        <SpeakButton text={`${data.revisedLabel}. ${mode.revised}`} speechLocale={speechLocale} />
                    </div>
                    <p className="text-[15px] font-bold leading-relaxed text-slate-100">{mode.revised}</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-indigo-200/90">{mode.revisedNote}</p>
                </div>

                {/* שורה תחתונה */}
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/15 p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                        <Lightbulb size={13} className="text-indigo-300" /> {data.takeawayLabel}
                    </div>
                    <p className="text-[13px] font-bold leading-relaxed text-slate-100">{mode.takeaway}</p>
                </div>
            </motion.div>

            {/* הבהרה: כל הדוגמאות לימודיות בלבד */}
            <p className="mt-4 text-[13px] leading-relaxed text-slate-500">{data.disclaimer}</p>
        </div>
    );
};
