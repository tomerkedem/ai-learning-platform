"use client";

// ────────────────────────────────────────────────────────────────────────
// GuessVerdict + GuessInvite - החלקים המשותפים של כל "ניחוש מהיר" בלומדה, וגם
// אבני-הבניין הפרימיום שלהם (ShimmerFrame, AuroraBloom, DrawCheck, SparkleBurst)
// שמיוצאות כדי שפרקים עם מנגנון ניחוש ייחודי (למשל משחק ניחוש-המילה בפרק 1) יוכלו
// לשמור על המכניקה שלהם ועדיין לקבל בדיוק אותו מראה מוגבה.
//
// המטרה: אחידות חלקית. מנגנון הניחוש עצמו נשאר גמיש וייחודי לכל פרק, אבל שני
// החלקים האלה זהים בכל מקום:
//   1. GuessInvite  - מנטור ההזמנה שמעל הכרטיסים, לפני הבחירה.
//   2. GuessVerdict - התגובה שאחרי הבחירה: הצלחה ("נכון מאוד!", מנטור חוגג, מסגרת-אור
//      מסתובבת, פריחת אאורה, וי מצויר) או טעות תומכת ("עוד לא", מנטור מרגיע, כתום רך).
//
// שפת עיצוב AI 2026: המסגרת "חיה" (conic shimmer איטי), רגע ההצלחה הוא רגע-שיא עם
// פריחה חד-פעמית, וי מצויר, וכותרת שנכנסת מ-blur. הכל תומך-משמעות ולא דקורטיבי:
// זהו רגע הפרס של הלומד.
//
// נגישות: role=status + aria-live. reduced-motion: בלי סיבוב, פריחה, ציור וחלקיקים,
// רק מצב סטטי מלא ומעבר מיידי. אין מקף ארוך, מקף בינוני או נקודה-פסיק בטקסט עברית.
// ────────────────────────────────────────────────────────────────────────

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Lightbulb, RotateCcw, ArrowDown, Sparkles } from 'lucide-react';
import { Mentor, type MentorPose } from './Mentor';
import { GuessButton } from './GuessButton';
import { SpeakButton } from './SpeakButton';

// re-export כדי שקוד קיים שמייבא GuessButton מ-GuessVerdict ימשיך לעבוד.
export { GuessButton } from './GuessButton';

export type GuessAccent = 'emerald' | 'cyan';

/** conic-gradient למסגרת-האור, נבנה מכל צבע RGB (עם שיא לבן בהיר לסוויפ). */
export function conicFor(rgb: string): string {
    return `conic-gradient(from 0deg, rgba(${rgb},0) 0deg, rgba(${rgb},0) 160deg, rgba(${rgb},0.85) 280deg, rgba(255,255,255,0.95) 320deg, rgba(${rgb},0.85) 340deg, rgba(${rgb},0) 360deg)`;
}

/* גווני ה-accent למצב ההצלחה בלבד. מצב הטעות תמיד כתום רך ואחיד.
   הרקע הפנימי אטום בכוונה: טבעת ה-conic המסתובבת של ShimmerFrame נמצאת מאחוריו,
   ואם הרקע היה שקוף למחצה היא הייתה זולגת פנימה ומלכלכת את הפינות המעוגלות. */
const ACCENT: Record<GuessAccent, {
    rgb: string;
    inner: string;
    sparkle: string;
    icon: string;
    title: string;
    lead: string;
    insight: string;
}> = {
    emerald: {
        rgb: '16,185,129',
        inner: 'bg-gradient-to-b from-emerald-950 to-slate-950',
        sparkle: 'text-emerald-300',
        icon: 'text-emerald-300',
        title: 'text-emerald-100',
        lead: 'text-emerald-200',
        insight: 'border-emerald-400/60 text-emerald-100',
    },
    cyan: {
        rgb: '34,211,238',
        inner: 'bg-gradient-to-b from-cyan-950 to-slate-950',
        sparkle: 'text-cyan-300',
        icon: 'text-cyan-300',
        title: 'text-cyan-100',
        lead: 'text-cyan-200',
        insight: 'border-cyan-400/60 text-cyan-100',
    },
};

/* פעימת ניצוצות חד-פעמית לרגע ההצלחה, בגדלים ומהירויות מגוונים (מונפש בלבד). */
export function SparkleBurst({ colorClass }: { colorClass: string }) {
    const bits = [
        { x: -58, y: -10, s: 13, d: 0, r: -40 },
        { x: -30, y: -38, s: 10, d: 0.06, r: 20 },
        { x: 4, y: -46, s: 16, d: 0.02, r: -15 },
        { x: 42, y: -34, s: 11, d: 0.09, r: 30 },
        { x: 70, y: -8, s: 12, d: 0.04, r: -25 },
        { x: 26, y: 10, s: 9, d: 0.12, r: 15 },
        { x: -46, y: 16, s: 8, d: 0.14, r: -30 },
    ];
    return (
        <div className={`pointer-events-none absolute start-9 top-5 z-20 ${colorClass}`} aria-hidden>
            {bits.map((b, i) => (
                <motion.span
                    key={i}
                    className="absolute"
                    initial={{ opacity: 0, scale: 0.2, x: 0, y: 0, rotate: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.2, 1, 0.5], x: b.x, y: b.y, rotate: b.r }}
                    transition={{ duration: 1, delay: b.d, ease: 'easeOut' }}
                >
                    <Sparkles size={b.s} strokeWidth={2.5} />
                </motion.span>
            ))}
        </div>
    );
}

/* פריחת אאורה חד-פעמית שנפתחת מפינת המנטור ומשאירה זוהר רך (מונפש בלבד). */
export function AuroraBloom({ rgb }: { rgb: string }) {
    return (
        <motion.div
            aria-hidden
            className="pointer-events-none absolute -start-8 -top-10 h-44 w-44 rounded-full blur-2xl"
            style={{ background: `radial-gradient(circle, rgba(${rgb},0.55) 0%, rgba(${rgb},0) 70%)` }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.3, 1.1], opacity: [0, 0.6, 0.22] }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
        />
    );
}

/* וי שמצייר את עצמו - עיגול ואז סימן, במקום קפיצת scale. */
export function DrawCheck({ colorClass, reduce, size = 26 }: { colorClass: string; reduce: boolean; size?: number }) {
    if (reduce) return <CheckCircle2 size={size - 2} className={colorClass} />;
    return (
        <svg width={size} height={size} viewBox="0 0 26 26" fill="none" className={colorClass} aria-hidden>
            <motion.circle
                cx={13} cy={13} r={11} stroke="currentColor" strokeWidth={2}
                initial={{ pathLength: 0, opacity: 0.3 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
            <motion.path
                d="M7.5 13.4 L11.2 17 L18.5 9" stroke="currentColor" strokeWidth={2.4}
                strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, delay: 0.4, ease: 'easeOut' }}
            />
        </svg>
    );
}

/* מסגרת-אור: טבעת conic מסתובבת מאחורי מעטפת inner אטומה. סוויפ-טעינה חד-פעמי
   בהופעה, ואז סחיפה איטית "חיה". ב-reduced-motion: מסגרת סטטית מוצקה. */
export const ShimmerFrame: React.FC<{
    rgb: string;
    reduce: boolean;
    innerClassName?: string;
    children: React.ReactNode;
}> = ({ rgb, reduce, innerClassName = '', children }) => {
    const conic = conicFor(rgb);
    return (
        <div className="relative rounded-[1.2rem]" style={reduce ? undefined : { boxShadow: `0 0 60px -14px rgba(${rgb},0.6)` }}>
            {/* מסגרת גרדיאנט מלאה ואטומה כבסיס (כמו בכפתור): לעולם לא חושפת רקע כהה
                בפינות. ה-conic המסתובב מרצד מעליה בלבד. */}
            <div
                className="relative overflow-hidden rounded-[1.2rem] p-[1.5px]"
                style={{ background: `linear-gradient(180deg, rgba(${rgb},0.75), rgba(${rgb},0.28))` }}
            >
                {!reduce && (
                    <>
                        <motion.div
                            aria-hidden
                            className="absolute inset-[-70%] opacity-35"
                            style={{ background: conic }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                            aria-hidden
                            className="absolute inset-[-70%]"
                            style={{ background: conic }}
                            initial={{ rotate: -130, opacity: 0.9 }}
                            animate={{ rotate: 230, opacity: 0 }}
                            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
                        />
                    </>
                )}
                <div className={`relative overflow-hidden rounded-[calc(1.2rem-1.5px)] ${innerClassName}`}>{children}</div>
            </div>
        </div>
    );
};

/* ── מנטור ההזמנה: דמות תומכת ממורכזת מעל הכרטיסים, נעלמת אחרי הבחירה. ── */
export const GuessInvite: React.FC<{ pose?: MentorPose; line?: string; width?: number }> = ({
    pose = 'think',
    line,
    width = 108,
}) => (
    <div className="mb-5 hidden flex-col items-center sm:flex">
        <Mentor pose={pose} width={width} glow={false} />
        {line && (
            <p className="mt-1 max-w-xs text-center text-[12px] font-medium leading-snug text-slate-400">{line}</p>
        )}
    </div>
);

export interface GuessVerdictProps {
    correct: boolean;
    accent?: GuessAccent;
    /** אם לא מועבר, נגזר מ-useReducedMotion. */
    reduce?: boolean;

    /* ── מצב הצלחה ── */
    correctTitle: string;
    /** שורת פתיח מודגשת אופציונלית (למשל במבוא). */
    correctLead?: string;
    correctExplain: string;
    /** שורת תובנה עם קו-צד אופציונלית. */
    correctInsight?: string;
    /** חץ קופצני אחרי התובנה (למשל במבוא, כשאין כפתור המשך). */
    correctInsightArrow?: boolean;
    /** כפתור המשך אופציונלי (בדרך כלל גלילה ליעד הבא). */
    continueCta?: { label: string; onClick: () => void };

    /* ── מצב טעות ── */
    wrongTitle: string;
    wrongExplain: string;
    /** שורה משנית אופציונלית (מה זה מפספס). */
    wrongExplainMore?: string;
    /** צעד "חשפו את התשובה המדויקת" אופציונלי; המצב מנוהל ע"י הפרק (controlled). */
    reveal?: { button: string; title: string; body: string; revealed: boolean; onReveal: () => void };

    /* ── משותף ── */
    onRetry: () => void;
    retryLabel: string;

    /** דריסת פוזות מנטור. ברירת מחדל: celebrate להצלחה, reassure לטעות. */
    correctPose?: MentorPose;
    wrongPose?: MentorPose;

    /**
     * כפתור הקראה נקודתי לכל תכולת הכרטיס (כותרת, הסברים, וההסבר המדויק כשנחשף).
     * הטקסט מורכב מהתוכן הנוכחי, כך שהוא נכון גם כשהכרטיס משתנה בין בחירות.
     */
    withSpeak?: boolean;
}

/** חיבור מקטעי הקראה: מסנן ריקים ומוסיף נקודה רק כשאין סימן סיום, למניעת "..". */
function speakJoin(...parts: Array<string | false | undefined>): string {
    return parts
        .filter((p): p is string => !!p && !!p.trim())
        .map((p) => {
            const s = p.trim();
            return /[.!?:،؟。]$/.test(s) ? s : `${s}.`;
        })
        .join(' ');
}

export const GuessVerdict: React.FC<GuessVerdictProps> = ({
    correct,
    accent = 'emerald',
    reduce: reduceProp,
    correctTitle,
    correctLead,
    correctExplain,
    correctInsight,
    correctInsightArrow,
    continueCta,
    wrongTitle,
    wrongExplain,
    wrongExplainMore,
    reveal,
    onRetry,
    retryLabel,
    correctPose = 'celebrate',
    wrongPose = 'reassure',
    withSpeak = false,
}) => {
    const reducedMotion = useReducedMotion();
    const reduce = reduceProp ?? !!reducedMotion;
    const a = ACCENT[accent];

    // טקסט ההקראה נגזר מהתוכן הנוכחי של הכרטיס, כולל ההסבר המדויק רק אחרי שנחשף.
    const correctSpeak = speakJoin(correctTitle, correctLead, correctExplain, correctInsight);
    const wrongSpeak = speakJoin(
        wrongTitle,
        wrongExplain,
        wrongExplainMore,
        !!reveal?.revealed && reveal.title,
        !!reveal?.revealed && reveal.body,
    );

    const bounce = reduce
        ? {}
        : { animate: { y: [0, 3, 0] }, transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' as const } };

    return (
        <AnimatePresence initial={false} mode="wait">
            <motion.div
                key={correct ? 'correct' : 'wrong'}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto mt-7 max-w-2xl"
                role="status"
                aria-live="polite"
            >
                {correct ? (
                    <ShimmerFrame rgb={a.rgb} reduce={reduce} innerClassName={`p-5 md:p-6 ${a.inner}`}>
                        {!reduce && <AuroraBloom rgb={a.rgb} />}
                        {!reduce && <SparkleBurst colorClass={a.sparkle} />}
                        <div className="relative flex items-start gap-4">
                            <div className="hidden shrink-0 self-center sm:block">
                                <Mentor pose={correctPose} width={176} glow={false} float={false} />
                            </div>
                            <div className="flex-1 text-start">
                                <div className="flex items-center gap-2">
                                    <DrawCheck colorClass={a.icon} reduce={reduce} />
                                    <motion.span
                                        initial={reduce ? false : { opacity: 0, y: 6, filter: 'blur(6px)' }}
                                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                        transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.12, ease: 'easeOut' }}
                                        className={`text-xl font-black md:text-2xl ${a.title}`}
                                    >
                                        {correctTitle}
                                    </motion.span>
                                    {withSpeak && <SpeakButton text={correctSpeak} className="ms-auto" />}
                                </div>
                                {correctLead && <p className={`mt-2 text-sm font-bold md:text-base ${a.lead}`}>{correctLead}</p>}
                                <p className="mt-2 text-sm leading-relaxed text-slate-200">{correctExplain}</p>
                                {correctInsight && (
                                    <p className={`mt-3 inline-flex items-center gap-1.5 border-s-2 ps-3 text-sm font-bold ${a.insight}`}>
                                        {correctInsight}
                                        {correctInsightArrow && (
                                            <motion.span {...bounce} className="inline-flex" aria-hidden>
                                                <ArrowDown size={15} />
                                            </motion.span>
                                        )}
                                    </p>
                                )}
                                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2.5">
                                    {continueCta && (
                                        <GuessButton
                                            variant="primary"
                                            rgb={a.rgb}
                                            reduce={reduce}
                                            sheen
                                            onClick={continueCta.onClick}
                                            trailingIcon={
                                                <motion.span {...bounce} aria-hidden>
                                                    <ArrowDown size={15} />
                                                </motion.span>
                                            }
                                        >
                                            {continueCta.label}
                                        </GuessButton>
                                    )}
                                    <GuessButton variant="ghost" onClick={onRetry} leadingIcon={<RotateCcw size={13} />}>
                                        {retryLabel}
                                    </GuessButton>
                                </div>
                            </div>
                        </div>
                    </ShimmerFrame>
                ) : (
                    <div className="relative overflow-hidden rounded-2xl border border-amber-400/45 bg-gradient-to-b from-amber-900/[0.16] to-slate-950/60 p-5 md:p-6">
                        {!reduce && (
                            <motion.div
                                aria-hidden
                                className="pointer-events-none absolute -start-6 -top-8 h-36 w-36 rounded-full blur-2xl"
                                style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, rgba(245,158,11,0) 70%)' }}
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1.1, opacity: 0.5 }}
                                transition={{ duration: 0.9, ease: 'easeOut' }}
                            />
                        )}
                        <div className="relative flex items-start gap-4">
                            <div className="hidden shrink-0 self-center sm:block">
                                <Mentor pose={wrongPose} width={172} glow={false} float={false} />
                            </div>
                            <div className="flex-1 text-start">
                                <div className="flex items-center gap-2">
                                    <motion.span
                                        aria-hidden
                                        animate={reduce ? {} : { scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }}
                                        transition={reduce ? {} : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                                        className="inline-flex"
                                    >
                                        <Lightbulb size={20} className="shrink-0 text-amber-300" />
                                    </motion.span>
                                    <span className="text-lg font-black text-amber-200 md:text-xl">{wrongTitle}</span>
                                    {withSpeak && <SpeakButton text={wrongSpeak} className="ms-auto" />}
                                </div>
                                <p className="mt-2.5 text-sm leading-relaxed text-slate-200">{wrongExplain}</p>
                                {wrongExplainMore && (
                                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{wrongExplainMore}</p>
                                )}

                                {reveal && reveal.revealed && (
                                    <motion.div
                                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                                        className="mt-4 rounded-xl border border-emerald-400/35 bg-emerald-900/15 p-3.5"
                                    >
                                        <p className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-200">
                                            <CheckCircle2 size={15} className="text-emerald-300" /> {reveal.title}
                                        </p>
                                        <p className="mt-1 text-sm leading-relaxed text-slate-300">{reveal.body}</p>
                                    </motion.div>
                                )}

                                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                                    <GuessButton variant="primary" rgb="245,158,11" reduce={reduce} onClick={onRetry} leadingIcon={<RotateCcw size={14} />}>
                                        {retryLabel}
                                    </GuessButton>
                                    {reveal && !reveal.revealed && (
                                        <GuessButton variant="primary" rgb="16,185,129" reduce={reduce} onClick={reveal.onReveal} leadingIcon={<Sparkles size={14} />}>
                                            {reveal.button}
                                        </GuessButton>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};
