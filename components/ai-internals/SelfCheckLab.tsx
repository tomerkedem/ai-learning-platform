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
    ClipboardCheck, ListChecks, PenLine, ShieldQuestion, SearchCheck, ArrowDown, type LucideIcon,
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
    overclaim: { Icon: AlertTriangle, cls: 'border-rose-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)] text-rose-100' },
    overcautious: { Icon: ShieldQuestion, cls: 'border-amber-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-amber-950)] [--t-l:var(--color-amber-500)] text-amber-100' },
    checked: { Icon: CheckCircle2, cls: 'border-emerald-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] text-emerald-100' },
    needsSource: { Icon: SearchCheck, cls: 'border-orange-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-orange-950)] [--t-l:var(--color-orange-500)] text-orange-100' },
};

/** אייקון וגוון לכל מצב טענה. מבני, נגזר מ-state. המשמעות מופיעה גם בטקסט ה-note. */
const CLAIM_TONE: Record<ClaimState, { Icon: LucideIcon; box: string; text: string }> = {
    supported: { Icon: CheckCircle2, box: 'border-emerald-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)]', text: 'text-emerald-200' },
    unsupported: { Icon: XCircle, box: 'border-rose-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)]', text: 'text-rose-200' },
    missing: { Icon: AlertTriangle, box: 'border-amber-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-amber-950)] [--t-l:var(--color-amber-500)]', text: 'text-amber-200' },
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
        `${data.takeawayLabel}: ${mode.takeaway}`,
    );

    return (
        <div className="rounded-2xl border border-indigo-500/25 bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
            {/* כותרת הרכיב */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <ClipboardCheck size={18} className="text-indigo-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-[var(--bts-text-bright)]">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--bts-text-faint)]" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={stateSpeech} speechLocale={speechLocale} />
            </div>

            {/* שאלת הלקוח הקבועה */}
            <div className="mb-3 rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">
                    <MessageSquare size={12} className="text-[var(--bts-text-muted)]" /> {data.questionLabel}
                </div>
                <p className="text-sm font-bold text-[var(--bts-text-bright)]">{data.question}</p>
            </div>

            {/* כרטיס המקור הקבוע */}
            <div className="mb-4 rounded-xl border border-sky-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-sky-950)] [--t-l:var(--color-sky-500)] p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-200">
                    <FileSearch size={13} aria-hidden /> {data.sourceLabel}
                </div>
                <p className="mb-2.5 text-[13px] leading-relaxed text-[var(--bts-text-muted)]">{data.sourceCaption}</p>
                <dl className="space-y-1.5">
                    {data.sourceRows.map((row) => (
                        <div key={row.label} className="flex items-center justify-between gap-3 border-b border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border)_var(--bts-tint-mix),var(--color-slate-800))_60%,transparent)] pb-1.5 last:border-0 last:pb-0">
                            <dt className="text-[13px] font-medium text-[var(--bts-text-muted)]">{row.label}</dt>
                            <dd className={`text-[13px] font-bold ${row.missing ? 'text-amber-300/90' : 'text-[var(--bts-text-bright)]'}`}>{row.value}</dd>
                        </div>
                    ))}
                </dl>
                <p className="mt-2.5 text-[13px] leading-relaxed text-sky-200/90">{data.sourceNote}</p>
            </div>

            {/* בורר הטיוטה */}
            <div className="mb-1 text-[13px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">{data.draftLabel}</div>
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label={data.sr.draftGroup}>
                {data.modes.map((m) => {
                    const active = m.id === draftId;
                    return (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => setDraftId(m.id)}
                            aria-pressed={active}
                            className={`rounded-xl border px-2.5 py-2.5 text-center text-[13px] font-bold leading-tight break-words transition-colors ${active
                                ? 'border-indigo-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-indigo-900)] [--t-l:var(--color-indigo-500)] text-indigo-100'
                                : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
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
                initial={{ opacity: 0, y: 6 }}
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
                <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3.5">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">
                            <PenLine size={13} aria-hidden /> {data.draftLabel}
                        </span>
                        <SpeakButton text={mode.draft} speechLocale={speechLocale} />
                    </div>
                    <p className="text-[15px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{mode.draft}</p>
                </div>

                {/* טענות בטיוטה */}
                <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-3.5">
                    <div className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">
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
                                    <p className="mt-1 text-[13px] leading-relaxed text-[var(--bts-text-secondary)]">{claim.note}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* רשימת הבדיקה העצמית */}
                <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-3.5">
                    <div className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">
                        <ClipboardCheck size={13} className="text-indigo-300" /> {data.checklistLabel}
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

                {/* מה הבדיקה מצאה */}
                <div className="rounded-xl border border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))_50%,transparent)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-secondary)]">
                        <AlertTriangle size={13} className="text-amber-300" /> {data.issueLabel}
                    </div>
                    <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">{mode.issue}</p>
                </div>

                {/* חץ מהטיוטה לתשובה המתוקנת */}
                <div className="flex justify-center" aria-hidden>
                    <ArrowDown size={18} className="text-indigo-400/70" />
                </div>

                {/* תשובה מתוקנת */}
                <div className="rounded-xl border border-indigo-500/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-indigo-950)] [--t-l:var(--color-indigo-500)] p-3.5">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                            <CheckCircle2 size={13} aria-hidden /> {data.revisedLabel}
                        </span>
                        <SpeakButton text={`${data.revisedLabel}. ${mode.revised}`} speechLocale={speechLocale} />
                    </div>
                    <p className="text-[15px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{mode.revised}</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-indigo-200/90">{mode.revisedNote}</p>
                </div>

                {/* שורה תחתונה */}
                <div className="rounded-xl border border-indigo-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-indigo-950)] [--t-l:var(--color-indigo-500)] p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                        <Lightbulb size={13} className="text-indigo-300" /> {data.takeawayLabel}
                    </div>
                    <p className="text-[13px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{mode.takeaway}</p>
                </div>
            </motion.div>

            {/* הבהרה: כל הדוגמאות לימודיות בלבד */}
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--bts-text-faint)]">{data.disclaimer}</p>
        </div>
    );
};
