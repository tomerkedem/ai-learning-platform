"use client";

// ────────────────────────────────────────────────────────────────────────
// ScoreBreakdownPanel - הרחבת "הציון הכולל" של פרק 15
// (Evaluation & Generalization: שינן או הבין).
//
// הרכיב הזה הוא אח של EvaluationLab, לא חלק ממנו. המעבדה הקיימת נשארת בדיוק
// כפי שהיא, והלוח הזה מתווסף אחריה ולוקח את הלומד צעד אחד קדימה:
//
//   מעבדה: מקרה בודד נכשל
//   כאן:   סוג מקרה שלם נכשל שוב ושוב, וציון כולל אחד מסתיר את זה
//
// מהלך הלמידה:
//   1. הלומד רואה רק ציון כולל (87%) ומספר מקרים (60).
//   2. הוא מנחש מה אפשר להסיק מהמספר הזה לבד, לפני שהוא רואה את הפירוק.
//   3. הפירוק נפתח: ארבעה סוגי מקרים, אחד מהם נכשל ברוב הפעמים.
//   4. הוא מזיז בקרה אחת: כמה מקרים מהסוג החלש בכלל נאספו לסט הבדיקה.
//      הציון עולה ל-96% בלי שנגענו במערכת.
//   5. בדיקת הבנה: מה באמת השתנה.
//
// סוג המקרה החלש נשאר גלוי תמיד. גם כשהוא לא נספר, הכרטיס שלו נשאר על המסך
// ומסומן בטקסט מפורש. זו הנקודה: ההתנהגות לא נעלמה מהמציאות, היא נעלמה מהמדידה.
//
// דטרמיניסטי לחלוטין: אין אקראיות, אין קריאת מודל, אין מדד אמיתי (benchmark).
// כל הנתונים המספריים הם קבועים מבניים בקובץ הזה, והציונים המוצגים נגזרים מהם
// בחישוב ולא נכתבים ידנית. כך תרגום לא יכול לשבור את האריתמטיקה.
//
// אין בקובץ הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    PieChart, PackageCheck, FileQuestion, MessagesSquare, AlertTriangle,
    Layers, CheckCircle2, XCircle, Lightbulb, ArrowLeftRight, type LucideIcon,
} from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import type {
    EvaluationScoreContent, ScoreCaseTypeId,
} from '@/i18n/locales/he/behind-ai/evaluationScore';
import { DUR } from './motionTokens';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

interface ScoreBreakdownPanelProps {
    data: EvaluationScoreContent['panel'];
    dir: Direction;
    /** שפת ההקראה של התוכן (contentLocale). ברירת מחדל: שפת הממשק. */
    speechLocale?: Locale;
}

/**
 * נתוני הבדיקה. מבניים בלבד, זהים בכל השפות, ולכן הם כאן ולא במילון.
 * סך הכול: 24+14+12+10 = 60 מקרים, 24+13+11+4 = 52 עברו.
 * בלי סוג המקרה החלש: 50 מקרים, 48 עברו.
 */
const CASE_STATS: ReadonlyArray<{ id: ScoreCaseTypeId; cases: number; passed: number }> = [
    { id: 'direct', cases: 24, passed: 24 },
    { id: 'noTracking', cases: 14, passed: 13 },
    { id: 'multiQuestion', cases: 12, passed: 11 },
    { id: 'pressure', cases: 10, passed: 4 },
];

/** סוג המקרה שנכשל ברוב הפעמים, ושאפשר להוציא אותו מסט הבדיקה. */
const WEAK_TYPE_ID: ScoreCaseTypeId = 'pressure';

/** אייקון לכל סוג מקרה. מבני, נגזר מהמזהה. */
const TYPE_ICON: Record<ScoreCaseTypeId, LucideIcon> = {
    direct: PackageCheck,
    noTracking: FileQuestion,
    multiQuestion: MessagesSquare,
    pressure: AlertTriangle,
};

/** האינדקסים הנכונים. מבניים, ולכן סדר האפשרויות במילון חייב להישמר בכל שפה. */
const GUESS_CORRECT = 2;
const LOCK_CORRECT = 1;

/** אחוז שלם מתוך יחס. מקור יחיד לכל המספרים המוצגים. */
const toPercent = (passed: number, total: number) => Math.round((passed / total) * 100);

/** שורת בחירה אחת (ניחוש או בדיקת הבנה). המשמעות עוברת גם באייקון, לא רק בצבע. */
const ChoiceList: React.FC<{
    options: readonly string[];
    correctIndex: number;
    choice: number | null;
    onChoose: (i: number) => void;
    dir: Direction;
}> = ({ options, correctIndex, choice, onChoose, dir }) => {
    const answered = choice !== null;
    return (
        <div className="grid gap-2">
            {options.map((opt, i) => {
                const isCorrect = i === correctIndex;
                const isChosen = i === choice;
                let cls = 'border-slate-700/50 bg-slate-950/30 text-slate-300 hover:border-slate-600';
                if (answered && isCorrect) cls = 'border-emerald-400/70 bg-emerald-900/25 text-emerald-100';
                else if (answered && isChosen && !isCorrect) cls = 'border-rose-400/70 bg-rose-900/20 text-rose-100';
                return (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => onChoose(i)}
                        aria-pressed={isChosen}
                        className={`flex items-start justify-between gap-2 rounded-xl border px-3 py-2.5 text-start text-[13px] font-bold leading-relaxed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 ${cls}`}
                    >
                        <span dir={dir}>{opt}</span>
                        {answered && isCorrect && <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-300" aria-hidden />}
                        {answered && isChosen && !isCorrect && <XCircle size={16} className="mt-0.5 shrink-0 text-rose-300" aria-hidden />}
                    </button>
                );
            })}
        </div>
    );
};

export const ScoreBreakdownPanel: React.FC<ScoreBreakdownPanelProps> = ({ data, dir, speechLocale }) => {
    const reduce = useReducedMotion();
    const [guessChoice, setGuessChoice] = useState<number | null>(null);
    const [revealed, setRevealed] = useState(false);
    const [thin, setThin] = useState(false);
    const [seenThin, setSeenThin] = useState(false);
    const [lockChoice, setLockChoice] = useState<number | null>(null);

    // כל המספרים המוצגים נגזרים מ-CASE_STATS. כשסוג המקרה החלש לא נאסף לסט,
    // הוא יוצא מהחישוב אבל נשאר על המסך.
    const included = thin ? CASE_STATS.filter((s) => s.id !== WEAK_TYPE_ID) : CASE_STATS;
    const total = included.reduce((n, s) => n + s.cases, 0);
    const passed = included.reduce((n, s) => n + s.passed, 0);
    const score = toPercent(passed, total);

    // הקראה תמציתית: הכותרת, הפתיח, המצב המספרי הנוכחי והתובנה. לא כל תווית ולא כל אפשרות.
    const stateSpeech = speakJoin(
        data.title,
        data.intro,
        `${data.headlineLabel}: ${score}%`,
        `${data.totalLabel}: ${total}. ${data.passedLabel}: ${passed}`,
        revealed && `${data.changedLabel}: ${data.changed}`,
        revealed && `${data.unchangedLabel}: ${data.unchanged}`,
        data.insight,
    );

    return (
        <div className="rounded-2xl border border-teal-500/25 bg-slate-900/50 p-5 text-start" dir={dir}>
            {/* כותרת הרכיב */}
            <div className="mb-4 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    <PieChart size={18} className="shrink-0 text-teal-300" aria-hidden />
                    <div className="leading-tight">
                        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-300">{data.eyebrow}</div>
                        <div className="text-sm font-bold text-slate-100">{data.title}</div>
                    </div>
                </div>
                <SpeakButton text={stateSpeech} speechLocale={speechLocale} />
            </div>

            <p className="mb-4 text-[14px] leading-relaxed text-slate-300">{data.intro}</p>

            {/* ── הכותרת המספרית: ציון כולל, מקרים, עברו ── */}
            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-teal-500/35 bg-teal-950/20 p-2 sm:p-3">
                    <motion.div
                        key={score}
                        initial={reduce ? false : { opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                        className="font-mono text-3xl font-black text-teal-200"
                        dir="ltr"
                    >
                        {score}%
                    </motion.div>
                    <div className="mt-0.5 text-[11px] font-bold text-teal-200/80">{data.headlineLabel}</div>
                </div>
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-2 sm:p-3">
                    <div className="font-mono text-3xl font-black text-slate-200" dir="ltr">{total}</div>
                    <div className="mt-0.5 text-[11px] text-slate-500">{data.totalLabel}</div>
                </div>
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-2 sm:p-3">
                    <div className="font-mono text-3xl font-black text-slate-200" dir="ltr">{passed}</div>
                    <div className="mt-0.5 text-[11px] text-slate-500">{data.passedLabel}</div>
                </div>
            </div>

            {/* ── הניחוש שלפני החשיפה ── */}
            {!revealed && (
                <div className="mt-4 rounded-xl border border-slate-700/50 bg-slate-950/30 p-3.5">
                    <p className="mb-3 text-[14px] font-bold leading-relaxed text-slate-100">{data.guess.question}</p>
                    <ChoiceList
                        options={data.guess.options}
                        correctIndex={GUESS_CORRECT}
                        choice={guessChoice}
                        onChoose={setGuessChoice}
                        dir={dir}
                    />
                    {guessChoice !== null && (
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                        >
                            <p className="mt-3 rounded-xl border border-teal-500/30 bg-teal-950/15 p-3 text-[13px] leading-relaxed text-slate-200">
                                {data.guessExplain}
                            </p>
                            <button
                                type="button"
                                onClick={() => setRevealed(true)}
                                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-teal-400/60 bg-teal-900/30 px-4 py-2.5 text-sm font-bold text-teal-100 transition-colors hover:bg-teal-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70 sm:w-auto"
                            >
                                <Layers size={15} aria-hidden /> {data.revealButton}
                            </button>
                        </motion.div>
                    )}
                </div>
            )}

            {/* ── הפירוק לפי סוג מקרה ── */}
            {revealed && (
                <motion.div
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: DUR.base }}
                    className="mt-4 space-y-3"
                >
                    <div className="text-[13px] font-bold uppercase tracking-wider text-slate-400">{data.breakdownLabel}</div>

                    <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label={data.sr.breakdown}>
                        {CASE_STATS.map((stat) => {
                            const text = data.caseTypes[stat.id];
                            const Icon = TYPE_ICON[stat.id];
                            const rate = toPercent(stat.passed, stat.cases);
                            const isWeak = stat.id === WEAK_TYPE_ID;
                            const isExcluded = thin && isWeak;
                            const box = isExcluded
                                ? 'border-slate-700/50 bg-slate-950/60 opacity-70'
                                : isWeak
                                    ? 'border-rose-500/40 bg-rose-950/15'
                                    : 'border-slate-700/50 bg-slate-950/30';
                            return (
                                <div key={stat.id} className={`rounded-xl border p-3 ${box}`}>
                                    <div className="flex items-start gap-2">
                                        <Icon size={15} className={`mt-0.5 shrink-0 ${isWeak ? 'text-rose-300' : 'text-slate-400'}`} aria-hidden />
                                        <div className="min-w-0 flex-1">
                                            <div className="text-[13px] font-bold leading-snug text-slate-100">{text.name}</div>
                                            <p className="mt-0.5 text-[12px] leading-relaxed text-slate-400">{text.note}</p>
                                        </div>
                                    </div>

                                    {/* תגיות מצב: סוג חלש, ואם רלוונטי גם אי-הכללה. שתיהן טקסט, לא צבע בלבד. */}
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {isWeak && (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/50 bg-rose-900/25 px-2 py-0.5 text-[11px] font-bold text-rose-100">
                                                <AlertTriangle size={11} aria-hidden /> {data.weakTypeLabel}
                                            </span>
                                        )}
                                        {isExcluded && (
                                            <span className="inline-flex items-center rounded-full border border-amber-400/50 bg-amber-900/25 px-2 py-0.5 text-[11px] font-bold text-amber-100">
                                                {data.excludedLabel}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[12px] text-slate-400">
                                        <span>
                                            {data.casesLabel}: <span className="font-mono font-bold text-slate-200" dir="ltr">{stat.cases}</span>
                                        </span>
                                        <span>
                                            {data.passedLabel}: <span className="font-mono font-bold text-slate-200" dir="ltr">{stat.passed}</span>
                                        </span>
                                        <span>
                                            {data.rateLabel}: <span className={`font-mono font-bold ${isWeak ? 'text-rose-200' : 'text-emerald-200'}`} dir="ltr">{rate}%</span>
                                        </span>
                                    </div>

                                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-800" aria-hidden>
                                        <motion.div
                                            initial={reduce ? false : { width: 0 }}
                                            animate={{ width: `${rate}%` }}
                                            transition={reduce ? { duration: 0 } : { duration: DUR.data }}
                                            className={`h-full rounded-full ${isWeak ? 'bg-rose-400/70' : 'bg-emerald-400/70'}`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── בקרת היקף סט הבדיקה ── */}
                    <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3.5">
                        <div className="mb-2 flex items-center gap-1.5 text-[13px] font-bold text-slate-200">
                            <ArrowLeftRight size={14} className="shrink-0 text-teal-300" aria-hidden /> {data.coverageLabel}
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label={data.sr.coverageGroup}>
                            <button
                                type="button"
                                onClick={() => setThin(false)}
                                aria-pressed={!thin}
                                className={`rounded-xl border px-3 py-2.5 text-start text-[13px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70 ${!thin
                                    ? 'border-teal-400/60 bg-teal-900/30 text-teal-100'
                                    : 'border-slate-700/50 bg-slate-950/30 text-slate-300 hover:border-slate-600'
                                    }`}
                            >
                                {data.coverageWide}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setThin(true); setSeenThin(true); }}
                                aria-pressed={thin}
                                className={`rounded-xl border px-3 py-2.5 text-start text-[13px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70 ${thin
                                    ? 'border-teal-400/60 bg-teal-900/30 text-teal-100'
                                    : 'border-slate-700/50 bg-slate-950/30 text-slate-300 hover:border-slate-600'
                                    }`}
                            >
                                {data.coverageThin}
                            </button>
                        </div>
                        <p className="mt-2.5 text-[12px] leading-relaxed text-slate-400">{data.coverageNote}</p>
                    </div>

                    {/* ── מה השתנה ומה לא. גלוי מכאן והלאה, זה הרגע המרכזי ── */}
                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-xl border border-amber-500/30 bg-amber-950/12 p-3">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-amber-200">{data.changedLabel}</div>
                            <p className="text-[13px] leading-relaxed text-slate-200">{data.changed}</p>
                        </div>
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/12 p-3">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-emerald-200">{data.unchangedLabel}</div>
                            <p className="text-[13px] leading-relaxed text-slate-200">{data.unchanged}</p>
                        </div>
                    </div>

                    {/* ── בדיקת ההבנה: נפתחת רק אחרי שהלומד ראה את המצב המצומצם ── */}
                    {seenThin && (
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                            className="rounded-xl border border-teal-500/30 bg-slate-950/40 p-3.5"
                        >
                            <p className="mb-3 text-[14px] font-bold leading-relaxed text-slate-100">{data.lock.question}</p>
                            <ChoiceList
                                options={data.lock.options}
                                correctIndex={LOCK_CORRECT}
                                choice={lockChoice}
                                onChoose={setLockChoice}
                                dir={dir}
                            />
                            {lockChoice !== null && (
                                <motion.div
                                    initial={reduce ? false : { opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                                >
                                    <p className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-3 text-[13px] leading-relaxed text-slate-200">
                                        {data.lockSuccess}
                                    </p>
                                    <div className="mt-3 rounded-xl border border-teal-500/30 bg-slate-950/40 p-3.5">
                                        <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-teal-200">
                                            <Lightbulb size={13} className="text-teal-300" aria-hidden /> {data.headlineLabel}
                                        </div>
                                        <p className="text-[13px] font-bold leading-relaxed text-slate-100">{data.insight}</p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            )}

            <p className="mt-4 text-[12px] leading-relaxed text-slate-500">{data.note}</p>
        </div>
    );
};
