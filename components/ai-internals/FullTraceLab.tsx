"use client";

// ────────────────────────────────────────────────────────────────────────
// FullTraceLab - מעבדת ה-Full Trace של פרק 19 ("Full Trace: פרומפט אחד, כל
// התחנות"), פרק הסיכום של הלומדה.
//
// הרעיון המרכזי: פרומפט אחד ודטרמיניסטי,
//   "בדוק מה קורה עם החבילה 123456789, נסח עדכון ללקוח, ואל תשלח בלי אישור שלי."
// עובר חמישה שלבים מקובצים, מהקלט ועד ההחלטה המבוקרת. הלומד עובר שלב אחר שלב
// (stepper + בורר שלבים), ובכל שלב רואה פאנלים גלויים: אותות, טוקנים, תוצאת מקור,
// טיוטה, ובדיקת בקרה.
//
// דטרמיניסטי לחלוטין: אין אקראיות, אין קריאת מודל אמיתית, אין חיבור אמיתי למערכת
// מעקב, אין שליחת הודעה אמיתית, אין שינוי סטטוס אמיתי, ואין הצגת שרשרת חשיבה נסתרת.
// Full Trace הוא תיעוד חינוכי של שלבים גלויים. כל הטקסט תלוי-השפה מגיע מ-data לפי
// locale, והכיוון (RTL/LTR) מ-dir. סדר השלבים ומזהיהם קבוע, ומפתחות ה-tone / kind
// מבניים ואינם מתורגמים.
//
// אין בקובץ הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    MessageSquareText, Cpu, Database, PenLine, ShieldCheck,
    ArrowLeft, ArrowRight, Check, XCircle, Lightbulb, type LucideIcon,
} from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import type {
    FullTraceLabContent, FullTracePanel, StageTone, NoteTone,
} from '@/i18n/locales/he/behind-ai/fullTraceLab';
import { DUR } from './motionTokens';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

interface FullTraceLabProps {
    data: FullTraceLabContent;
    dir: Direction;
    /** שפת ההקראה של התוכן (contentLocale). ברירת מחדל: שפת הממשק. */
    speechLocale?: Locale;
}

/** אייקון וגוון לכל גוון שלב. מבני, נגזר מ-tone. */
const STAGE_TONE: Record<StageTone, { Icon: LucideIcon; text: string; border: string; bg: string; chipBg: string; dot: string }> = {
    input: { Icon: MessageSquareText, text: 'text-cyan-300', border: 'border-cyan-500/40', bg: 'bg-cyan-950/15', chipBg: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-100', dot: 'bg-cyan-300' },
    model: { Icon: Cpu, text: 'text-violet-300', border: 'border-violet-500/40', bg: 'bg-violet-950/15', chipBg: 'border-violet-500/30 bg-violet-950/20 text-violet-100', dot: 'bg-violet-300' },
    grounding: { Icon: Database, text: 'text-emerald-300', border: 'border-emerald-500/40', bg: 'bg-emerald-950/15', chipBg: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-100', dot: 'bg-emerald-300' },
    draft: { Icon: PenLine, text: 'text-sky-300', border: 'border-sky-500/40', bg: 'bg-sky-950/15', chipBg: 'border-sky-500/30 bg-sky-950/20 text-sky-100', dot: 'bg-sky-300' },
    guardrails: { Icon: ShieldCheck, text: 'text-indigo-300', border: 'border-indigo-500/40', bg: 'bg-indigo-950/15', chipBg: 'border-indigo-500/30 bg-indigo-950/20 text-indigo-100', dot: 'bg-indigo-300' },
};

/** גוון הערה, נגזר מ-tone. */
const NOTE_TONE: Record<NoteTone, string> = {
    neutral: 'border-slate-700/50 bg-slate-950/40 text-slate-200',
    good: 'border-emerald-500/30 bg-emerald-950/10 text-emerald-100',
    warn: 'border-amber-500/40 bg-amber-950/15 text-amber-100',
    stop: 'border-rose-500/40 bg-rose-950/15 text-rose-100',
};

/** טקסט הקראה של פאנל בודד. */
function panelSpeech(p: FullTracePanel): string {
    switch (p.kind) {
        case 'prompt': return `${p.label}: ${p.text}`;
        case 'signals': return `${p.label}: ${p.items.map((it) => `${it.k}, ${it.v}`).join('. ')}`;
        case 'chips': return `${p.label}: ${p.items.join(', ')}`;
        case 'result': return `${p.label}: ${p.rows.join('. ')}`;
        case 'split': return `${p.posLabel}: ${p.pos.join(', ')}. ${p.negLabel}: ${p.neg.join(', ')}`;
        case 'note': return `${p.label}: ${p.text}`;
    }
}

const Panel: React.FC<{ panel: FullTracePanel; tone: StageTone; dir: Direction; speechLocale?: Locale }> = ({ panel, tone, dir, speechLocale }) => {
    const t = STAGE_TONE[tone];

    switch (panel.kind) {
        case 'prompt':
            return (
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-3.5">
                    <div className="mb-1.5 text-[13px] font-bold uppercase tracking-wider text-slate-400">{panel.label}</div>
                    <p className="text-[15px] font-bold leading-relaxed text-slate-100">{panel.text}</p>
                </div>
            );

        case 'signals':
            return (
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3.5">
                    <div className="mb-2 text-[13px] font-bold uppercase tracking-wider text-slate-400">{panel.label}</div>
                    <ul className="grid gap-2 sm:grid-cols-2">
                        {panel.items.map((it) => (
                            <li key={it.k} className="flex flex-col gap-0.5 rounded-lg border border-slate-700/40 bg-slate-900/50 px-3 py-2">
                                <span className="text-[13px] font-medium text-slate-400">{it.k}</span>
                                <span className="text-[15px] font-bold text-slate-100">{it.v}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            );

        case 'chips':
            return (
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3.5">
                    <div className="mb-2 text-[13px] font-bold uppercase tracking-wider text-slate-400">{panel.label}</div>
                    <div className="flex flex-wrap gap-1.5">
                        {panel.items.map((chip, i) => (
                            <span key={`${chip}-${i}`} className={`rounded-lg border px-2 py-1 text-[14px] font-bold leading-tight ${t.chipBg}`}>
                                {chip}
                            </span>
                        ))}
                    </div>
                </div>
            );

        case 'result':
            return (
                <div className={`rounded-xl border p-3.5 ${t.border} ${t.bg}`}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className={`text-[13px] font-bold uppercase tracking-wider ${t.text}`}>{panel.label}</span>
                        <SpeakButton text={`${panel.label}. ${panel.rows.join(', ')}`} speechLocale={speechLocale} />
                    </div>
                    <ul className="space-y-1.5">
                        {panel.rows.map((row) => (
                            <li key={row} className="flex items-start gap-2 text-[14px] leading-relaxed text-slate-200">
                                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${t.dot}`} aria-hidden />
                                <span>{row}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            );

        case 'split':
            return (
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3.5">
                    <div className="mb-2 text-[13px] font-bold uppercase tracking-wider text-slate-400">{panel.label}</div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/10 p-2.5">
                            <div className="mb-1 flex items-center gap-1.5 text-[13px] font-bold text-emerald-200">
                                <Check size={13} aria-hidden /> {panel.posLabel}
                            </div>
                            <ul className="space-y-1">
                                {panel.pos.map((row) => (
                                    <li key={row} className="text-[14px] leading-relaxed text-slate-200">{row}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded-lg border border-rose-500/30 bg-rose-950/10 p-2.5">
                            <div className="mb-1 flex items-center gap-1.5 text-[13px] font-bold text-rose-200">
                                <XCircle size={13} aria-hidden /> {panel.negLabel}
                            </div>
                            <ul className="space-y-1">
                                {panel.neg.map((row) => (
                                    <li key={row} className="text-[14px] leading-relaxed text-slate-200">{row}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            );

        case 'note':
            return (
                <div className={`rounded-xl border p-3 ${NOTE_TONE[panel.tone]}`} dir={dir}>
                    <span className="text-[13px] font-bold uppercase tracking-wider opacity-90">{panel.label}</span>
                    <p className="mt-0.5 text-[14px] font-bold leading-relaxed">{panel.text}</p>
                </div>
            );
    }
};

export const FullTraceLab: React.FC<FullTraceLabProps> = ({ data, dir, speechLocale }) => {
    const reduce = useReducedMotion();
    const isRtl = dir === 'rtl';
    const [index, setIndex] = useState(0);

    const total = data.stages.length;
    const active = data.stages[index];
    const tone = STAGE_TONE[active.tone];
    const ActiveIcon = tone.Icon;

    const PrevIcon = isRtl ? ArrowRight : ArrowLeft;
    const NextIcon = isRtl ? ArrowLeft : ArrowRight;

    const go = (next: number) => setIndex(Math.max(0, Math.min(total - 1, next)));

    // הקראת מצב השלב: הכותרת, התקציר, הפאנלים והשורה התחתונה.
    const stageSpeech = speakJoin(
        `${active.groupLabel}. ${active.title}. ${active.summary}`,
        ...active.panels.map(panelSpeech),
        `${data.teachingLabel}: ${active.teaching}`,
    );

    return (
        <div className="rounded-2xl border border-indigo-500/25 bg-slate-900/50 p-5 text-start" dir={dir}>
            {/* כותרת הרכיב */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-indigo-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-100">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={stageSpeech} speechLocale={speechLocale} />
            </div>

            {/* ── כרטיס הפרומפט הקבוע ── */}
            <div className="mb-4 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3.5">
                <div className="mb-1.5 text-[13px] font-bold uppercase tracking-wider text-slate-400">{data.promptLabel}</div>
                <p className="text-[15px] font-bold leading-relaxed text-slate-100">{data.prompt}</p>
            </div>

            {/* ── בורר השלבים ── */}
            <div className="mb-4 grid grid-cols-2 gap-2 lg:grid-cols-5" role="group" aria-label={data.sr.stageGroup}>
                {data.stages.map((s, i) => {
                    const isActive = i === index;
                    const st = STAGE_TONE[s.tone];
                    const StepIcon = st.Icon;
                    return (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => go(i)}
                            aria-pressed={isActive}
                            aria-current={isActive ? 'step' : undefined}
                            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2.5 text-start text-[13px] font-bold leading-tight break-words transition-colors ${isActive
                                ? `${st.border} ${st.bg} ${st.text}`
                                : 'border-slate-700/50 bg-slate-950/30 text-slate-300 hover:border-slate-600'
                                }`}
                        >
                            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] ${isActive ? 'bg-white/10' : 'bg-slate-800/70'}`} aria-hidden>{i + 1}</span>
                            <StepIcon size={14} className="shrink-0" aria-hidden />
                            <span dir={dir}>{s.tab}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── השלב הפעיל ── */}
            <motion.div
                key={active.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                className="space-y-3"
                role="group"
                aria-label={data.sr.stageDetail}
            >
                {/* כותרת השלב */}
                <div className={`rounded-xl border p-3.5 ${tone.border} ${tone.bg}`}>
                    <div className={`mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${tone.text}`}>
                        <ActiveIcon size={13} aria-hidden /> {active.groupLabel}
                    </div>
                    <div className="text-[15px] font-black leading-snug text-slate-100">{active.title}</div>
                    <p className="mt-1 text-[14px] leading-relaxed text-slate-300">{active.summary}</p>
                </div>

                {/* פאנלים */}
                {active.panels.map((panel, i) => (
                    <Panel key={`${active.id}-${panel.kind}-${i}`} panel={panel} tone={active.tone} dir={dir} speechLocale={speechLocale} />
                ))}

                {/* מה השלב מלמד */}
                <div className="rounded-xl border border-indigo-500/30 bg-slate-950/40 p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                        <Lightbulb size={13} className="text-indigo-300" aria-hidden /> {data.teachingLabel}
                    </div>
                    <p className="text-[14px] font-bold leading-relaxed text-slate-100">{active.teaching}</p>
                </div>
            </motion.div>

            {/* ── ניווט בין השלבים ── */}
            <div className="mt-4 flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => go(index - 1)}
                    disabled={index === 0}
                    aria-label={data.sr.prevBtn}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/50 bg-slate-950/40 px-3 py-2 text-[13px] font-bold text-slate-200 transition-colors hover:border-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <PrevIcon size={15} aria-hidden /> {data.prevLabel}
                </button>

                <span className="text-[13px] font-bold text-slate-400" aria-live="polite">
                    {data.stageWord} {index + 1}/{total}
                </span>

                <button
                    type="button"
                    onClick={() => go(index + 1)}
                    disabled={index === total - 1}
                    aria-label={data.sr.nextBtn}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/25 px-3 py-2 text-[13px] font-bold text-indigo-100 transition-colors hover:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {data.nextLabel} <NextIcon size={15} aria-hidden />
                </button>
            </div>

            {/* הבהרה: כל הדוגמאות לימודיות בלבד, ו-Full Trace אינו מחשבה נסתרת */}
            <p className="mt-4 text-[13px] leading-relaxed text-slate-500">{data.disclaimer}</p>
        </div>
    );
};
