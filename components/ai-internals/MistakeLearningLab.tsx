"use client";

// ────────────────────────────────────────────────────────────────────────
// MistakeLearningLab - מעבדת "ללמוד מטעות" של פרק 14
// (Learning from Mistakes: איך מודל משתפר מטעות).
//
// הרעיון המרכזי: אותה פנייה של לקוח, אותו כרטיס מקור, אותה תשובה שגויה ראשונה ואותו
// תיקון, קבועים לכל המצבים. הלומד עובר בין ארבע רמות שבהן שיפור מטעות יכול לקרות:
// תיקון בהקשר השיחה, שיפור המערכת סביב המודל, תרומה לאימון עתידי, ובדיקה שהשיפור
// אמיתי. בכל רמה רואים "מה השתפר" מול "מה לא בהכרח השתפר".
//
// דטרמיניסטי לחלוטין: אין אקראיות, אין קריאת מודל אמיתית, ואין טענה על מדיניות של
// מוצר מסוים, על שמירת נתונים או על אימון של מערכת ספציפית. כל הנתונים תלויי-השפה
// מגיעים מ-data לפי locale, והכיוון (RTL/LTR) מ-dir. סדר המצבים והשלבים נשאר קבוע
// כדי שהמסך לא יקפוץ. מפתחות ה-level וה-tone מבניים בלבד.
//
// אין בקובץ הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    MessageSquare, FileSearch, Wrench, GraduationCap, Gauge, ClipboardCheck,
    CheckCircle2, XCircle, Lightbulb, ArrowDown, User, Reply, type LucideIcon,
} from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import type {
    MistakeLearningLabContent, MistakeLevel, StepTone,
} from '@/i18n/locales/he/behind-ai/mistakeLearningLab';
import { DUR } from './motionTokens';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

interface MistakeLearningLabProps {
    data: MistakeLearningLabContent;
    dir: Direction;
    /** שפת ההקראה של התוכן (contentLocale). ברירת מחדל: שפת הממשק. */
    speechLocale?: Locale;
}

/** אייקון וגוון לכל רמת שיפור. מבני, נגזר מ-level. */
const LEVEL_TONE: Record<MistakeLevel, { Icon: LucideIcon; cls: string }> = {
    context: { Icon: MessageSquare, cls: 'border-sky-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-sky-950)] [--t-l:var(--color-sky-500)] text-sky-100' },
    system: { Icon: Wrench, cls: 'border-violet-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-violet-950)] [--t-l:var(--color-violet-500)] text-violet-100' },
    training: { Icon: GraduationCap, cls: 'border-amber-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-amber-950)] [--t-l:var(--color-amber-500)] text-amber-100' },
    evaluation: { Icon: Gauge, cls: 'border-emerald-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] text-emerald-100' },
};

/** אייקון וגוון לכל גוון שלב. מבני, נגזר מ-tone. */
const STEP_TONE: Record<StepTone, { Icon: LucideIcon; dot: string; text: string }> = {
    wrong: { Icon: XCircle, dot: 'border-rose-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)]', text: 'text-rose-200' },
    context: { Icon: MessageSquare, dot: 'border-sky-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-sky-950)] [--t-l:var(--color-sky-500)]', text: 'text-sky-200' },
    system: { Icon: Wrench, dot: 'border-violet-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-violet-950)] [--t-l:var(--color-violet-500)]', text: 'text-violet-200' },
    training: { Icon: GraduationCap, dot: 'border-amber-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-amber-950)] [--t-l:var(--color-amber-500)]', text: 'text-amber-200' },
    eval: { Icon: ClipboardCheck, dot: 'border-cyan-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-cyan-950)] [--t-l:var(--color-cyan-500)]', text: 'text-cyan-200' },
    good: { Icon: CheckCircle2, dot: 'border-emerald-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)]', text: 'text-emerald-200' },
};

export const MistakeLearningLab: React.FC<MistakeLearningLabProps> = ({ data, dir, speechLocale }) => {
    const reduce = useReducedMotion();
    const [modeId, setModeId] = useState(data.modes[0].id);

    const mode = data.modes.find((m) => m.id === modeId) ?? data.modes[0];
    const { Icon: LevelIcon, cls: levelCls } = LEVEL_TONE[mode.level];

    // הקראת מצב המעבדה: הפנייה, התשובה השגויה, התיקון, ומה השתפר מול מה שלא.
    const stateSpeech = speakJoin(
        `${data.scenarioLabel}: ${data.scenario}`,
        `${data.initialLabel}: ${data.initialAnswer}`,
        `${data.correctionLabel}: ${data.correction}`,
        `${mode.badgeLabel}. ${mode.title}. ${mode.summary}`,
        `${data.improvedLabel}: ${mode.improved}`,
        `${data.notImprovedLabel}: ${mode.notImproved}`,
    );

    return (
        <div className="rounded-2xl border border-fuchsia-500/25 bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
            {/* כותרת הרכיב */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <GraduationCap size={18} className="text-fuchsia-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-[var(--bts-text-bright)]">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--bts-text-faint)]" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={stateSpeech} speechLocale={speechLocale} />
            </div>

            {/* ── בלוק קבוע: פנייה, מקור, תשובה שגויה, תיקון ── */}
            {/* פניית הלקוח */}
            <div className="mb-3 rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">
                    <User size={12} className="text-[var(--bts-text-muted)]" /> {data.scenarioLabel}
                </div>
                <p className="text-sm font-bold text-[var(--bts-text-bright)]">{data.scenario}</p>
            </div>

            {/* כרטיס המקור הקבוע */}
            <div className="mb-3 rounded-xl border border-sky-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-sky-950)] [--t-l:var(--color-sky-500)] p-3">
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

            {/* התשובה השגויה הראשונה */}
            <div className="mb-2 rounded-xl border border-rose-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)] p-3">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-200">
                        <XCircle size={13} aria-hidden /> {data.initialLabel}
                    </span>
                    <SpeakButton text={`${data.initialLabel}. ${data.initialAnswer}`} speechLocale={speechLocale} />
                </div>
                <p className="text-[15px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{data.initialAnswer}</p>
            </div>

            {/* חץ מהתשובה לתיקון */}
            <div className="flex justify-center" aria-hidden>
                <ArrowDown size={16} className="text-fuchsia-400/70" />
            </div>

            {/* התיקון של הלומד */}
            <div className="mt-2 mb-4 rounded-xl border border-fuchsia-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-fuchsia-950)] [--t-l:var(--color-fuchsia-500)] p-3">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-fuchsia-200">
                        <Reply size={13} aria-hidden /> {data.correctionLabel}
                    </span>
                    <SpeakButton text={`${data.correctionLabel}. ${data.correction}`} speechLocale={speechLocale} />
                </div>
                <p className="text-[15px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{data.correction}</p>
            </div>

            {/* ── בורר רמת השיפור ── */}
            <div className="mb-1 text-[13px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">{data.modeLabel}</div>
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label={data.sr.modeGroup}>
                {data.modes.map((m) => {
                    const active = m.id === modeId;
                    const { Icon } = LEVEL_TONE[m.level];
                    return (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => setModeId(m.id)}
                            aria-pressed={active}
                            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2.5 text-start text-[13px] font-bold leading-tight break-words transition-colors ${active
                                ? 'border-fuchsia-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-fuchsia-900)] [--t-l:var(--color-fuchsia-500)] text-fuchsia-100'
                                : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
                                }`}
                        >
                            <Icon size={15} className="shrink-0" aria-hidden />
                            <span>{m.control}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── המצב הפעיל ── */}
            <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                className="space-y-3"
            >
                {/* תג הרמה + כותרת + תקציר */}
                <div className={`rounded-xl border p-3 ${levelCls}`}>
                    <div className="flex items-center gap-2">
                        <LevelIcon size={16} aria-hidden />
                        <span className="text-sm font-black">{mode.badgeLabel}</span>
                    </div>
                    <div className="mt-1.5 text-[15px] font-bold leading-snug text-[var(--bts-text-bright)]">{mode.title}</div>
                    <p className="mt-1 text-[13px] leading-relaxed text-[var(--bts-text-secondary)]">{mode.summary}</p>
                </div>

                {/* שלבי התהליך */}
                <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-3.5">
                    <div className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">
                        <ArrowDown size={13} className="text-fuchsia-300" aria-hidden /> {data.flowLabel}
                    </div>
                    <ol className="space-y-2" role="group" aria-label={data.sr.steps}>
                        {mode.steps.map((step, i) => {
                            const tone = STEP_TONE[step.tone];
                            const Icon = tone.Icon;
                            return (
                                <li key={step.id}>
                                    <div className={`rounded-lg border p-2.5 ${tone.dot}`}>
                                        <div className="flex items-center gap-2">
                                            <Icon size={15} className={`shrink-0 ${tone.text}`} aria-hidden />
                                            <span className={`text-[13px] font-bold ${tone.text}`}>{step.label}</span>
                                        </div>
                                        <p className="mt-1 text-[13px] leading-relaxed text-[var(--bts-text-secondary)]">{step.text}</p>
                                    </div>
                                    {i < mode.steps.length - 1 && (
                                        <div className="flex justify-center py-0.5" aria-hidden>
                                            <ArrowDown size={14} className="text-[var(--bts-text-subtle)]" />
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </div>

                {/* לפני ואחרי (רק במצבים שיש בהם השוואה) */}
                {mode.beforeAfter && (
                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-xl border border-rose-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)] p-3">
                            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-200">
                                <XCircle size={13} aria-hidden /> {mode.beforeAfter.beforeLabel}
                            </div>
                            <p className="text-[13px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{mode.beforeAfter.before}</p>
                        </div>
                        <div className="rounded-xl border border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] p-3">
                            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                                <CheckCircle2 size={13} aria-hidden /> {mode.beforeAfter.afterLabel}
                            </div>
                            <p className="text-[13px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{mode.beforeAfter.after}</p>
                        </div>
                    </div>
                )}

                {/* מה השתפר מול מה שלא */}
                <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] p-3">
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                            <CheckCircle2 size={13} aria-hidden /> {data.improvedLabel}
                        </div>
                        <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">{mode.improved}</p>
                    </div>
                    <div className="rounded-xl border border-amber-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(12%_-_var(--bts-tint-mix)_*_0.06),transparent)] [--t-d:var(--color-amber-950)] [--t-l:var(--color-amber-500)] p-3">
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-200">
                            <XCircle size={13} aria-hidden /> {data.notImprovedLabel}
                        </div>
                        <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">{mode.notImproved}</p>
                    </div>
                </div>

                {/* שורה תחתונה */}
                <div className="rounded-xl border border-fuchsia-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-fuchsia-950)] [--t-l:var(--color-fuchsia-500)] p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-fuchsia-200">
                        <Lightbulb size={13} className="text-fuchsia-300" /> {data.takeawayLabel}
                    </div>
                    <p className="text-[13px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{mode.takeaway}</p>
                </div>
            </motion.div>

            {/* הבהרה: כל הדוגמאות לימודיות בלבד */}
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--bts-text-faint)]">{data.disclaimer}</p>
        </div>
    );
};
