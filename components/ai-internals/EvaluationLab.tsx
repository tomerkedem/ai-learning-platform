"use client";

// ────────────────────────────────────────────────────────────────────────
// EvaluationLab - מעבדת "הערכה והכללה" של פרק 15
// (Evaluation & Generalization: שינן או הבין).
//
// הרעיון המרכזי: המודל תוקן על דוגמה אחת (אל תמציא מועד הגעה כשאין מועד במקור).
// עכשיו בודקים אם הוא מחזיק את העיקרון כשהמקרה משתנה. הלומד עובר בין חמישה מקרי
// בדיקה: מקרה מוכר, ניסוח אחר, סתירה מהלקוח, מקור חסר, וסטטוס אחר. בכל מקרה רואים
// את פניית הלקוח, את המקור, את ההתנהגות הרצויה, את תשובת המודל, ואם עבר או נכשל.
// פאנל סיכום מציג כמה מקרים עברו ואיפה הנקודה החלשה.
//
// דטרמיניסטי לחלוטין: אין אקראיות, אין קריאת מודל אמיתית, אין מדד אמיתי (benchmark),
// ואין טענה על מדיניות של מוצר מסוים. כל הנתונים תלויי-השפה מגיעים מ-data לפי locale,
// והכיוון (RTL/LTR) מ-dir. סדר המקרים נשאר קבוע כדי שהמסך לא יקפוץ. מפתחות ה-caseType
// וה-verdict מבניים בלבד.
//
// אין בקובץ הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    BadgeCheck, Repeat, AlertTriangle, FileQuestion, PackageCheck, Target,
    User, FileSearch, CheckCircle2, XCircle, Lightbulb, Gauge, type LucideIcon,
} from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import type {
    EvaluationLabContent, EvalCaseType, EvalVerdict,
} from '@/i18n/locales/he/behind-ai/evaluationLab';
import { DUR } from './motionTokens';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

interface EvaluationLabProps {
    data: EvaluationLabContent;
    dir: Direction;
    /** שפת ההקראה של התוכן (contentLocale). ברירת מחדל: שפת הממשק. */
    speechLocale?: Locale;
}

/** אייקון וגוון לכל סוג מקרה. מבני, נגזר מ-caseType. */
const CASE_TONE: Record<EvalCaseType, { Icon: LucideIcon; cls: string }> = {
    familiar: { Icon: BadgeCheck, cls: 'border-sky-400/50 bg-sky-950/25 text-sky-100' },
    paraphrase: { Icon: Repeat, cls: 'border-violet-400/50 bg-violet-950/25 text-violet-100' },
    contradiction: { Icon: AlertTriangle, cls: 'border-rose-400/50 bg-rose-950/25 text-rose-100' },
    missing: { Icon: FileQuestion, cls: 'border-amber-400/50 bg-amber-950/25 text-amber-100' },
    newStatus: { Icon: PackageCheck, cls: 'border-teal-400/50 bg-teal-950/25 text-teal-100' },
};

/** אייקון וגוון לכל תוצאה. מבני, נגזר מ-verdict. */
const VERDICT_TONE: Record<EvalVerdict, { Icon: LucideIcon; badge: string; answer: string }> = {
    pass: {
        Icon: CheckCircle2,
        badge: 'border-emerald-400/60 bg-emerald-900/25 text-emerald-100',
        answer: 'border-emerald-500/30 bg-emerald-950/15',
    },
    fail: {
        Icon: XCircle,
        badge: 'border-rose-400/60 bg-rose-900/25 text-rose-100',
        answer: 'border-rose-500/30 bg-rose-950/15',
    },
};

export const EvaluationLab: React.FC<EvaluationLabProps> = ({ data, dir, speechLocale }) => {
    const reduce = useReducedMotion();
    const [caseId, setCaseId] = useState(data.cases[0].id);

    const active = data.cases.find((c) => c.id === caseId) ?? data.cases[0];
    const { Icon: CaseIcon, cls: caseCls } = CASE_TONE[active.caseType];
    const verdict = VERDICT_TONE[active.verdict];
    const VerdictIcon = verdict.Icon;
    const verdictLabel = active.verdict === 'pass' ? data.passLabel : data.failLabel;

    // הקראת מצב המעבדה: המטרה, הפנייה, ההתנהגות הרצויה, תשובת המודל, התוצאה, ומה נחשף.
    const stateSpeech = speakJoin(
        `${data.goalLabel}: ${data.goal}`,
        `${data.customerLabel}: ${active.customer}`,
        `${data.expectedLabel}: ${active.expected}`,
        `${data.answerLabel}: ${active.modelAnswer}`,
        `${verdictLabel}. ${data.revealsLabel}: ${active.reveals}`,
    );

    return (
        <div className="rounded-2xl border border-emerald-500/25 bg-slate-900/50 p-5 text-start" dir={dir}>
            {/* כותרת הרכיב */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Gauge size={18} className="text-emerald-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-100">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={stateSpeech} speechLocale={speechLocale} />
            </div>

            {/* ── כרטיס המטרה + הדוגמה שעליה תוקן ── */}
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-3.5">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                    <Target size={13} aria-hidden /> {data.goalLabel}
                </div>
                <p className="text-[14px] font-bold leading-relaxed text-slate-100">{data.goal}</p>

                <div className="mt-3 rounded-lg border border-slate-700/50 bg-slate-950/40 p-2.5">
                    <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">{data.trainedLabel}</div>
                    <p className="text-[13px] leading-relaxed text-slate-300">{data.trainedCustomer}</p>
                    <div className="mt-1.5 flex items-start gap-1.5">
                        <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-300" aria-hidden />
                        <p className="text-[13px] font-bold leading-relaxed text-slate-200">
                            <span className="text-emerald-200">{data.trainedAnswerLabel}: </span>{data.trainedAnswer}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── בורר מקרי הבדיקה ── */}
            <div className="mb-1 text-[13px] font-bold uppercase tracking-wider text-slate-400">{data.caseSelectLabel}</div>
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5" role="group" aria-label={data.sr.caseGroup}>
                {data.cases.map((c) => {
                    const activeBtn = c.id === caseId;
                    const { Icon } = CASE_TONE[c.caseType];
                    return (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => setCaseId(c.id)}
                            aria-pressed={activeBtn}
                            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2.5 text-start text-[13px] font-bold leading-tight break-words transition-colors ${activeBtn
                                ? 'border-emerald-400/60 bg-emerald-900/25 text-emerald-100'
                                : 'border-slate-700/50 bg-slate-950/30 text-slate-300 hover:border-slate-600'
                                }`}
                        >
                            <Icon size={15} className="shrink-0" aria-hidden />
                            <span>{c.control}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── המקרה הפעיל ── */}
            <motion.div
                key={active.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                className="space-y-3"
                role="group"
                aria-label={data.sr.caseDetail}
            >
                {/* תג הסוג + כותרת + תקציר + תג תוצאה */}
                <div className={`rounded-xl border p-3 ${caseCls}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                            <CaseIcon size={16} aria-hidden />
                            <span className="text-sm font-black">{active.badgeLabel}</span>
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-black ${verdict.badge}`}>
                            <VerdictIcon size={12} aria-hidden /> {verdictLabel}
                        </span>
                    </div>
                    <div className="mt-1.5 text-[15px] font-bold leading-snug text-slate-100">{active.title}</div>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-300">{active.summary}</p>
                </div>

                {/* פניית הלקוח */}
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <User size={12} className="text-slate-400" aria-hidden /> {data.customerLabel}
                    </div>
                    <p className="text-[14px] font-bold leading-relaxed text-slate-100">{active.customer}</p>
                </div>

                {/* כרטיס המקור */}
                <div className="rounded-xl border border-sky-500/30 bg-sky-950/15 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-200">
                        <FileSearch size={13} aria-hidden /> {data.sourceLabel}
                    </div>
                    <p className="mb-2.5 text-[13px] leading-relaxed text-slate-400">{data.sourceCaption}</p>
                    <dl className="space-y-1.5">
                        {active.sourceRows.map((row) => (
                            <div key={row.label} className="flex items-center justify-between gap-3 border-b border-slate-800/60 pb-1.5 last:border-0 last:pb-0">
                                <dt className="text-[13px] font-medium text-slate-400">{row.label}</dt>
                                <dd className={`text-[13px] font-bold ${row.missing ? 'text-amber-300/90' : 'text-slate-100'}`}>{row.value}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-2.5 text-[13px] leading-relaxed text-sky-200/90">{active.sourceNote}</p>
                </div>

                {/* ההתנהגות הרצויה */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/12 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                        <Target size={13} aria-hidden /> {data.expectedLabel}
                    </div>
                    <p className="text-[13px] leading-relaxed text-slate-200">{active.expected}</p>
                </div>

                {/* תשובת המודל, בגוון התוצאה */}
                <div className={`rounded-xl border p-3 ${verdict.answer}`}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                            <VerdictIcon size={13} className={active.verdict === 'pass' ? 'text-emerald-300' : 'text-rose-300'} aria-hidden /> {data.answerLabel}
                        </span>
                        <SpeakButton text={`${data.answerLabel}. ${active.modelAnswer}. ${verdictLabel}`} speechLocale={speechLocale} />
                    </div>
                    <p className="text-[14px] font-bold leading-relaxed text-slate-100">{active.modelAnswer}</p>
                </div>

                {/* מה הבדיקה חושפת */}
                <div className="rounded-xl border border-emerald-500/30 bg-slate-950/40 p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                        <Lightbulb size={13} className="text-emerald-300" aria-hidden /> {data.revealsLabel}
                    </div>
                    <p className="text-[13px] font-bold leading-relaxed text-slate-100">{active.reveals}</p>
                </div>
            </motion.div>

            {/* ── פאנל סיכום ההערכה ── */}
            <div className="mt-4 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3.5">
                <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <Gauge size={13} className="text-emerald-300" aria-hidden /> {data.score.title}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-2">
                        <div className="font-mono text-xl font-black text-slate-200" dir="ltr">{data.score.total}</div>
                        <div className="text-[11px] text-slate-500">{data.score.totalLabel}</div>
                    </div>
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/15 p-2">
                        <div className="font-mono text-xl font-black text-emerald-300" dir="ltr">{data.score.passed}</div>
                        <div className="text-[11px] text-emerald-200/80">{data.score.passedLabel}</div>
                    </div>
                    <div className="rounded-lg border border-rose-500/30 bg-rose-950/15 p-2">
                        <div className="font-mono text-xl font-black text-rose-300" dir="ltr">{data.score.failed}</div>
                        <div className="text-[11px] text-rose-200/80">{data.score.failedLabel}</div>
                    </div>
                </div>
                <div className="mt-2.5 flex items-start gap-1.5 rounded-lg border border-amber-500/30 bg-amber-950/12 p-2.5">
                    <AlertTriangle size={13} className="mt-0.5 shrink-0 text-amber-300" aria-hidden />
                    <p className="text-[13px] leading-relaxed text-slate-200">
                        <span className="font-bold text-amber-200">{data.score.weakSpotLabel}: </span>{data.score.weakSpot}
                    </p>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-slate-500">{data.score.note}</p>
            </div>

            {/* הבהרה: כל הדוגמאות לימודיות בלבד */}
            <p className="mt-4 text-[13px] leading-relaxed text-slate-500">{data.disclaimer}</p>
        </div>
    );
};
