"use client";

import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Check, X, Lightbulb,
  Trophy, ChevronRight, ChevronLeft,
  Timer, Eye, Flame, Play, ArrowLeft, ArrowRight, RotateCcw,
  ListChecks
} from "lucide-react";
import confetti from 'canvas-confetti';
import { ExpandableLabExitContext } from '../ai-internals/ExpandableLab';
import { Mentor } from '../ai-internals/Mentor';
import { GuessButton } from '../ai-internals/GuessButton';
import { SpeakButton } from '../ai-internals/SpeakButton';
import { speakJoin } from '../ai-internals/GuessVerdict';
import { useT } from '@/i18n/useT';

// שכבת הקונפטי חייבת לצוף מעל מצב "מסך מלא" של ExpandableLab, שהוא Portal אטום
// ב-document.body עם z-index 9999. ברירת המחדל של canvas-confetti היא z-index 100,
// ולכן במסך מלא הקונפטי נורה אבל נשאר מוסתר מאחורי הכיסוי. הקנבס הוא pointer-events:none
// ולכן הרמת ה-z-index אינה חוסמת כפתורים, קישורים או ניווט מקלדת.
const CONFETTI_Z_INDEX = 10000;

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    /** תגית מושג אופציונלית, משמשת לאבחון מושגים חזקים וחלשים. */
    concept?: string;
}

export interface ScoreTier {
    /** ציון מינימלי (באחוזים) שמזכה בדרגה הזו. המערך ממוין מהגבוה לנמוך. */
    min: number;
    label: string;
    color: string;
    sub: string;
}

/** קישור חזרה ממוקד שמוצג בסיום עבור מושג חלש. */
export interface ReviewLink {
    href: string;
    label: string;
}

/** התוצאה שמועברת ל-onComplete בסיום ניסיון. */
export interface AssessmentResult {
    scorePercent: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
    weakConcepts: string[];
    strongConcepts: string[];
}

interface AssessmentProps {
    title: string;
    subtitle: string;
    questions: Question[];
    /** סף ההצלחה באחוזים (משפיע על קונפטי, צבע ועל הצגת כפתור ההמשך). ברירת מחדל: 70. */
    passScore?: number;
    /** דרגות ציון מותאמות. אם לא מסופק, נעשה שימוש בדרגות ברירת המחדל. */
    scoreTiers?: ScoreTier[];
    /** קישור לפרק הבא, מוצג בסיום כאשר עוברים את סף ההצלחה. */
    nextHref?: string;
    nextLabel?: string;
    /** קישור לחזרה על החומר, מוצג בסיום כאשר לא עוברים את סף ההצלחה. */
    reviewHref?: string;
    reviewLabel?: string;
    /** נקרא פעם אחת בכל סיום ניסיון, עם פירוק התוצאה לפי מושגים (לצורך התמדה). */
    onComplete?: (result: AssessmentResult) => void;
    /** ממיר רשימת מושגים חלשים לקישורי חזרה ממוקדים שמוצגים בסיום. */
    getReviewLinks?: (weakConcepts: string[]) => ReviewLink[];
    /** טקסט כפתור ההתחלה. ברירת מחדל: "התחל בחינה". */
    startLabel?: string;
    /** טקסט כפתור הסיום בשאלה האחרונה. ברירת מחדל: "סיום בחינה". */
    submitLabel?: string;
    /** כותרת מסך התוצאות. ברירת מחדל: "הבחינה הושלמה!". */
    completedTitle?: string;
    /** האם להציג טיימר וזמן מומלץ. ברירת מחדל: true (תאימות לאחור). */
    showTimer?: boolean;
    /** לא בשימוש. נשמר לתאימות לאחור בלבד; אפקטי הסאונד החיצוניים הוסרו. */
    soundEnabled?: boolean;
    /**
     * מסלול מורשת: פורטרט מנטור במסך הפתיחה ובמסך התוצאות. ברירת המחדל false, ולכן
     * מבדק חדש הוא חסר-דמות בלי שהקורא צריך לדעת על כך. זהו הגבול המוצהר בין
     * הלומדות: "מאחורי הקלעים של AI" לעולם אינה מעבירה את ה-prop הזה, והוא קיים אך
     * ורק בשביל צרכנים שעדיין בנויים סביב הדמות (כרגע: מבדק ההסמכה של מתמטיקה).
     * true משחזר בדיוק את המסלול הישן: דמות ready בפתיחה, ודמות celebrate/reassure
     * במסך התוצאות בשתי התוצאות.
     * false: אייקון הסטטוס נשאר בראש כרטיס התוצאה (גביע במעבר, חץ-חזרה בגוון דרגת
     * הציון בלי מעבר), ומתחתיו משפט תגובה אנושי ספציפי לפרק כטקסט בלבד. כך אין החלפה
     * בין אייקון סטטוס לפנים, ואין דמות שחוזרת במסך שנראה זהה בכל 19 הפרקים.
     */
    legacyMentorPortraits?: boolean;
    /**
     * משפטי התגובה האנושית, ספציפיים לפרק. בלעדיהם המבדק פשוט אינו מציג שורת תגובה,
     * ולכן אין סיכון למשפט גנרי שחוזר זהה ב-19 פרקים.
     */
    mentorResponse?: { pass: string; fail: string };
    /** מיפוי תצוגה למושגים (concept) בצ׳יפים. המפתח נשאר q.concept היציב; רק התצוגה מתורגמת. */
    conceptDisplayMap?: Record<string, string>;
}

// בונה סדר תצוגה מעורבב לכל שאלה (Fisher-Yates). המפתח הוא q.id, והערך הוא מערך של
// אינדקסים מקוריים מ-question.options בסדר התצוגה הרצוי. ערבוב תצוגה בלבד: לא נוגע
// ב-options או ב-correctAnswer, ואינו רץ בזמן render (נבנה רק בפעולת משתמש) כדי למנוע
// אי-התאמת hydration. משמש כדי שהתשובה הנכונה לא תופיע תמיד באותו מיקום.
function buildOptionOrder(questions: { id: number; options: string[] }[]): Record<number, number[]> {
    const order: Record<number, number[]> = {};
    for (const q of questions) {
        const idxs = q.options.map((_, i) => i);
        for (let i = idxs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
        }
        order[q.id] = idxs;
    }
    return order;
}

// סף וצבע לדרגות ברירת המחדל (מבני, לא תלוי שפה). התווית והכותרת מגיעות מהמילון.
const DEFAULT_TIER_META: { min: number; color: string }[] = [
    { min: 90, color: "text-emerald-400" },
    { min: 70, color: "text-blue-400" },
    { min: 50, color: "text-amber-400" },
    { min: 0, color: "text-rose-400" },
];

export const AssessmentEngine = ({
    title,
    subtitle,
    questions,
    passScore = 70,
    scoreTiers,
    nextHref,
    nextLabel,
    reviewHref,
    reviewLabel,
    onComplete,
    getReviewLinks,
    startLabel,
    submitLabel,
    completedTitle,
    showTimer = true,
    legacyMentorPortraits = false,
    mentorResponse,
    conceptDisplayMap,
}: AssessmentProps) => {
    // כרום מתורגם וכיוון מהרישום. props שמועברים מבחוץ גוברים על ברירות המחדל מהמילון.
    const { t, dir } = useT();
    const a = t.chrome.assessment;
    const isRTL = dir === 'rtl';
    const startLabelR = startLabel ?? a.start;
    const submitLabelR = submitLabel ?? a.submit;
    const completedTitleR = completedTitle ?? a.completed;
    const nextLabelR = nextLabel ?? a.next;
    const reviewLabelR = reviewLabel ?? a.review;
    // דרגות ברירת מחדל מתורגמות: מיזוג הסף/הצבע המבני עם התווית/הכותרת מהמילון.
    const localizedDefaultTiers: ScoreTier[] = DEFAULT_TIER_META.map((m, i) => ({
        ...m,
        label: a.tiers[i].label,
        sub: a.tiers[i].sub,
    }));

    // הנתיב הנוכחי, כדי לזהות קישור חזרה שמצביע על הפרק שכבר נמצאים בו.
    const pathname = usePathname();

    // קיים רק כשהמבדק מוצג במסך מלא (ExpandableLab). אז קישור "חזרה לפרק" חייב קודם לסגור
    // את התצוגה המוגדלת, אחרת הכיסוי נשאר מעל תוכן הפרק והגלילה מתבצעת בתוך ה-Portal.
    const exitFullscreen = useContext(ExpandableLabExitContext);

    // States
    const [isStarted, setIsStarted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    // Stage A: per-session display order per question (presentation only). optionOrder[q.id]
    // is an array of ORIGINAL question.options indices in render order. The shuffle never
    // mutates options/correctAnswer, and answers[q.id] always stores an original index
    // (never a display slot). Clicking a row still resolves immediately (no arm/lock step).
    const [optionOrder, setOptionOrder] = useState<Record<number, number[]>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [direction, setDirection] = useState(0);
    const [streak, setStreak] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // גוון ההדגשה לכרום של מסכי הפתיחה/תוצאות (הילות, מסגרות, כפתור ראשי).
    // ציאן, בהתאמה לשפת הצבע של הלומדה.
    const accent = { base: '6 182 212', shadow: '34 211 238', text: '#a5f3fc' };
    // גוון accent בפורמט של GuessButton (פסיקים במקום רווחים).
    const accentRgb = accent.shadow.replace(/\s+/g, ',');

    // העדפת תנועה מופחתת. נקראת ישירות מ-media query (לא framer useReducedMotion) כדי לא
    // לפלוט אזהרת dev של framer, וכדי לשמור על ריהדרציה ראשונה זהה ל-SSR (reduce=false)
    // ולמנוע אי-התאמת hydration. מסונכרן להעדפת המערכת אחרי mount ומתעדכן בשינוי חי.
    const [reduce, setReduce] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        // eslint-disable-next-line react-hooks/set-state-in-effect -- סנכרון חד-פעמי של העדפת מערכת אחרי mount (בטיחות SSR/hydration)
        setReduce(mq.matches);
        const onChange = () => setReduce(mq.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    // אבחון מבוסס מושגים: בונה את תוצאת הניסיון, כולל מושגים חזקים (כל השאלות של
    // המושג נענו נכון) ומושגים חלשים (לפחות שאלה אחת של המושג נענתה שגוי).
    const buildResult = useCallback((): AssessmentResult => {
        const correctCount = questions.reduce((acc, q) => answers[q.id] === q.correctAnswer ? acc + 1 : acc, 0);
        const totalQuestions = questions.length;
        const scorePercent = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0;

        const byConcept = new Map<string, { correct: number; total: number }>();
        for (const q of questions) {
            if (!q.concept) continue;
            const entry = byConcept.get(q.concept) ?? { correct: 0, total: 0 };
            entry.total += 1;
            if (answers[q.id] === q.correctAnswer) entry.correct += 1;
            byConcept.set(q.concept, entry);
        }

        const weakConcepts: string[] = [];
        const strongConcepts: string[] = [];
        byConcept.forEach((stat, concept) => {
            if (stat.correct === stat.total) strongConcepts.push(concept);
            else weakConcepts.push(concept);
        });

        return {
            scorePercent,
            correctCount,
            totalQuestions,
            passed: scorePercent >= passScore,
            weakConcepts,
            strongConcepts,
        };
    }, [questions, answers, passScore]);

    // פונקציית עזר להערכת ציון (במקום אחוזים יבשים)
    const getScoreFeedback = (score: number): ScoreTier => {
        const tiers = scoreTiers ?? localizedDefaultTiers;
        return tiers.find(tier => score >= tier.min) ?? tiers[tiers.length - 1];
    };

    useEffect(() => {
        if (isActive && !isSubmitted) {
            timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isActive, isSubmitted]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQuestion = questions[currentIndex];
    const isAnswered = answers[currentQuestion?.id] !== undefined;
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleStart = () => {
        // בונים סדר תצוגה מעורבב פעם אחת עם תחילת הניסיון. יציב לכל אורך הניסיון
        // (render/ניווט/סקירה) ומתאפס רק בהתחלה מחדש או בניסיון חוזר.
        setOptionOrder(buildOptionOrder(questions));
        setIsStarted(true);
        setIsActive(true);
    };

    const handleAnswer = useCallback((oIdx: number) => {
        if (isAnswered && !isReviewMode) return;
        const isCorrect = oIdx === currentQuestion.correctAnswer;
        if (isCorrect) {
            setStreak(prev => prev + 1);
        } else {
            setStreak(0);
        }
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: oIdx }));
    }, [currentQuestion, isAnswered, isReviewMode]);

    const handleNext = useCallback(() => {
        if (currentIndex < questions.length - 1) {
            setDirection(1);
            setCurrentIndex(prev => prev + 1);
        } else if (isReviewMode) {
            // בסקירה, השאלה האחרונה מסיימת את הסקירה ומחזירה למסך התוצאות.
            setIsReviewMode(false);
        } else {
            // קודם כל עוברים למסך התוצאות. תופעות הלוואי (קונפטי, צליל, שמירה) עטופות
            // ב-try/catch כדי ששגיאה באחת מהן לא תחסום את המעבר ותשאיר את הכפתור "מת".
            setIsSubmitted(true);
            setIsActive(false);
            const result = buildResult();
            try {
                // קונפטי הוא קישוט בלבד: מדולג כשתנועה מופחתת פעילה.
                if (result.passed && !reduce) {
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, zIndex: CONFETTI_Z_INDEX });
                }
                // התמדה: כל סיום נספר כניסיון. onComplete אחראי לשמירה ב-localStorage.
                onComplete?.(result);
            } catch (err) {
                console.error('[AssessmentEngine] finish side-effects failed', err);
            }
        }
    }, [currentIndex, questions, isReviewMode, buildResult, reduce, onComplete]);

    const handleBack = useCallback(() => {
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex]);

    // חצים אופקיים בזמן ניסיון פעיל. ChapterLayout מאזין לחצים על window ב-bubble ומנווט
    // בין פרקים; הוא מדלג רק כש-defaultPrevented. ניווט כזה באמצע מבדק מוחק את הניסיון,
    // כי התשובות נשמרות רק בסיום. מאזין capture רץ לפני מאזין ה-bubble של הפריסה, ולכן
    // preventDefault כאן לבדו מבטל את ניווט הפרקים. בלי stopPropagation: הוא היה חוסם גם
    // את הפקדים שבתוך המבדק. פעיל רק בין ההתחלה לסיום; במסך התוצאות ובסקירה הניווט חוזר.
    useEffect(() => {
        if (!isStarted || isSubmitted) return;

        const onArrowKey = (e: KeyboardEvent) => {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            if (e.ctrlKey || e.metaKey || e.altKey) return;

            const target = e.target as HTMLElement | null;
            if (target) {
                const tag = target.tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) return;
            }

            e.preventDefault();
        };

        window.addEventListener('keydown', onArrowKey, { capture: true });
        return () => window.removeEventListener('keydown', onArrowKey, { capture: true });
    }, [isStarted, isSubmitted]);

    // 1. מסך פתיחה - Start Screen
    if (!isStarted) {
        return (
            <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 22 }}
                className="relative max-w-md mx-auto overflow-hidden p-8 pt-16 rounded-[2rem] bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 text-center shadow-2xl"
                dir={dir}
            >
                {/* הילת הדגשה רכה בראש הכרטיס */}
                <div
                    className="pointer-events-none absolute -top-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full blur-3xl"
                    style={{ background: `rgb(${accent.base} / 0.18)` }}
                />

                <div className="relative">
                    {legacyMentorPortraits ? (
                        <div className="flex justify-center mb-8">
                            <Mentor pose="ready" width={140} line={a.mentorStart} />
                        </div>
                    ) : (
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                            <Play size={32} className="text-blue-400 fill-current ms-1" />
                        </div>
                    )}
                    <h2 className="text-2xl font-black text-white mb-2">{title}</h2>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">{subtitle}</p>

                    <div className={`grid ${showTimer ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-8`}>
                        <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 text-start">
                            <span
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                style={{ background: `rgb(${accent.base} / 0.12)`, color: `rgb(${accent.shadow})` }}
                            >
                                <ListChecks size={18} />
                            </span>
                            <div>
                                <div className="text-slate-500 text-[10px] font-bold uppercase">{a.questionsLabel}</div>
                                <div className="text-white font-black text-lg leading-tight">{questions.length}</div>
                            </div>
                        </div>
                        {showTimer && (
                            <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 text-start">
                                <span
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                    style={{ background: `rgb(${accent.base} / 0.12)`, color: `rgb(${accent.shadow})` }}
                                >
                                    <Timer size={18} />
                                </span>
                                <div>
                                    <div className="text-slate-500 text-[10px] font-bold uppercase">{a.recommendedTimeLabel}</div>
                                    <div className="text-white font-black text-lg leading-tight">{a.recommendedTime(Math.ceil(questions.length * 0.5))}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <GuessButton
                        onClick={handleStart}
                        rgb={accentRgb}
                        fullWidth
                        sheen
                        trailingIcon={isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    >
                        {startLabelR}
                    </GuessButton>
                </div>
            </motion.div>
        );
    }

    // 2. מסך תוצאות - Results Screen (מעודכן לציון אמיתי)
    if (isSubmitted && !isReviewMode) {
        const result = buildResult();
        const { correctCount, scorePercent: scoreValue, weakConcepts, strongConcepts } = result;
        const feedback = getScoreFeedback(scoreValue);
        const passed = scoreValue >= passScore;
        const reviewLinks = getReviewLinks ? getReviewLinks(weakConcepts).slice(0, 3) : [];
        const ring = 2 * Math.PI * 52; // היקף טבעת ההתקדמות (r=52)

        return (
            <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 24 }}
                className="relative max-w-md mx-auto overflow-hidden p-8 pt-16 rounded-[2rem] bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 text-center shadow-2xl"
                dir={dir}
                role="status"
                aria-live="polite"
            >
                {/* הילת הדגשה רכה, חמה יותר במעבר ורכה יותר בכישלון */}
                <div
                    className="pointer-events-none absolute -top-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full blur-3xl"
                    style={{ background: passed ? `rgb(${accent.base} / 0.20)` : 'rgb(245 158 11 / 0.14)' }}
                />

                <div className="relative">
                    <div className="mb-6">
                        {/* מסלול המורשת בלבד: פורטרט בשתי התוצאות. בברירת המחדל הענף הזה
                            לעולם אינו נבחר, המבדק חסר-דמות לגמרי, ולכן שתי התוצאות מקבלות
                            בסלוט הזה אייקון סטטוס ולא פנים. */}
                        {legacyMentorPortraits ? (
                            <div className="flex justify-center mb-5">
                                <Mentor
                                    pose={passed ? 'celebrate' : 'reassure'}
                                    width={160}
                                    line={passed ? (scoreValue >= 90 ? a.mentorPassHigh : a.mentorPass) : a.mentorFail}
                                />
                            </div>
                        ) : !passed ? (
                            /* אות סטטוס עצמאי לתוצאה שלא עברה. גביע כאן היה משקר, ופנים
                               כאן היו הופכות את הדמות לאייקון הכישלון. חץ-חזרה הוא בדיוק
                               מה שהתוצאה אומרת: עוד סיבוב. הגוון נלקח מדרגת הציון, כדי
                               שהאייקון וטבעת הציון ידברו באותו צבע. */
                            <div className="w-20 h-20 bg-white/[0.06] rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-white/[0.03]">
                                <RotateCcw size={38} className={feedback.color} />
                            </div>
                        ) : (
                            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-blue-500/5">
                                <Trophy size={40} className="text-blue-400" />
                            </div>
                        )}
                        <h2 className="text-2xl font-black text-white">{completedTitleR}</h2>
                    </div>

                    {/* טבעת ציון מונפשת */}
                    <div className="relative mx-auto mb-6 h-44 w-44">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" />
                            <motion.circle
                                cx="60" cy="60" r="52" fill="none"
                                className={feedback.color}
                                stroke="currentColor" strokeWidth="9" strokeLinecap="round"
                                strokeDasharray={ring}
                                initial={reduce ? false : { strokeDashoffset: ring }}
                                animate={{ strokeDashoffset: ring * (1 - scoreValue / 100) }}
                                transition={reduce ? { duration: 0 } : { duration: 1.2, ease: 'easeOut', delay: 0.15 }}
                                style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.div
                                initial={reduce ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                                transition={reduce ? { duration: 0 } : { delay: 0.3, type: 'spring', stiffness: 240, damping: 16 }}
                                className={`text-5xl font-black tabular-nums leading-none ${feedback.color}`}
                            >
                                {scoreValue}%
                            </motion.div>
                            <div className={`mt-1.5 text-base font-black ${feedback.color}`}>{feedback.label}</div>
                            <div className="text-slate-500 text-[11px] font-medium">{feedback.sub}</div>
                        </div>
                    </div>

                    {!passed && (
                        <p className="mb-6 text-sm leading-relaxed text-slate-400">
                            {a.failNote}
                        </p>
                    )}

                    {/* שכבת התגובה האנושית של המבדק, כטקסט בלבד (M7, מודל C). אין כאן דמות:
                        מסך התוצאות זהה במבנה בכל 19 הפרקים, ודמות שחוזרת בו בכל פעם הופכת
                        למרכיב תבנית ולא לרגע הוראה. המשפט עצמו נשאר, כי הוא ספציפי לפרק.
                        טיפוגרפיה: הערת-שוליים עם קו-צד, השפה שכבר משמשת שורות תובנה בלומדה.
                        הקו ניטרלי בכוונה ואינו משתנה לפי התוצאה, כדי שלא ייווצר ערוץ סטטוס
                        שני לצד טבעת הציון. נקרא אוטומטית עם כרטיס התוצאה (role=status
                        aria-live), ולכן בלי כפתור הקראה משלו ובלי דיבור כפול. */}
                    {!legacyMentorPortraits && (passed ? mentorResponse?.pass : mentorResponse?.fail) && (
                        <p className="mb-6 border-s-2 border-white/15 ps-3.5 text-start text-[13px] leading-relaxed text-slate-300">
                            {passed ? mentorResponse?.pass : mentorResponse?.fail}
                        </p>
                    )}

                    {/* סטטיסטיקות: נכונות וזמן */}
                    <div className={`grid ${showTimer ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-6`}>
                        <div className="flex items-center justify-center gap-2.5 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                            {/* אייקון ספירת הנכונות תלוי במעבר: וי ירוק רק כשעוברים. בלי מעבר
                                מציגים אייקון רשימה ניטרלי בגוון התוצאה (rose/amber), כדי לא לאותת
                                הצלחה כשהציון מתחת לסף. */}
                            {passed ? (
                                <Check size={16} className="text-emerald-400 stroke-[3px] shrink-0" />
                            ) : (
                                <ListChecks size={16} className={`${feedback.color} shrink-0`} />
                            )}
                            <div className="text-white font-bold leading-tight text-sm text-start">
                                {a.correctSummary(correctCount, questions.length)}
                            </div>
                        </div>
                        {showTimer && (
                            <div className="flex items-center justify-center gap-2.5 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                                <Timer size={16} className="text-amber-400" />
                                <div className="text-start">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase">{a.timeLabel}</div>
                                    <div className="text-white font-black leading-tight">{formatTime(seconds)}</div>
                                </div>
                            </div>
                        )}
                    </div>

                {/* אבחון מושגים: מה חזק ומה כדאי לחזק */}
                {(strongConcepts.length > 0 || weakConcepts.length > 0) && (
                    <div className="grid grid-cols-1 gap-3 mb-6 text-start">
                        {strongConcepts.length > 0 && (
                            <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/15">
                                <div className="text-emerald-400 text-xs font-black mb-2">{a.strongConcepts}</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {strongConcepts.map(c => (
                                        <span key={c} className="text-[11px] font-bold text-emerald-200 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">{conceptDisplayMap?.[c] ?? c}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {weakConcepts.length > 0 && (
                            <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/15">
                                <div className="text-amber-400 text-xs font-black mb-2">{a.weakConcepts}</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {weakConcepts.map(c => (
                                        <span key={c} className="text-[11px] font-bold text-amber-200 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">{conceptDisplayMap?.[c] ?? c}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* חזרה מומלצת: עד שלושה קישורים ממוקדים לפי המושגים החלשים */}
                {reviewLinks.length > 0 && (
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-6 text-start">
                        <div className="text-slate-300 text-xs font-black mb-3">{a.recommendedReview}</div>
                        <div className="space-y-2">
                            {reviewLinks.map(link => {
                                // קישור שמצביע על הפרק הנוכחי (המבדק יושב בתוכו): ניווט Link לא יזיז
                                // כלום, ולכן נגלול חזרה לראש העמוד כדי לחזור לתוכן הפרק.
                                const isCurrentPage = pathname === link.href || (pathname?.endsWith(link.href) ?? false);
                                const linkCls = "flex items-center justify-between gap-2 bg-white/5 hover:bg-white/10 px-3 py-2.5 rounded-xl border border-white/10 transition-all no-underline group";
                                const arrow = isRTL
                                    ? <ArrowLeft size={16} className="text-slate-500 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
                                    : <ArrowRight size={16} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />;

                                if (isCurrentPage) {
                                    return (
                                        <button
                                            key={link.href}
                                            type="button"
                                            onClick={(e) => {
                                                if (typeof window === 'undefined') return;
                                                // במסך מלא: סוגרים את התצוגה המוגדלת וחוזרים לראש הפרק.
                                                if (exitFullscreen) {
                                                    exitFullscreen();
                                                    return;
                                                }
                                                const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
                                                const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
                                                // ChapterLayout גולל בתוך מיכל פנימי (overflow-y-auto), לא ב-window.
                                                // מאתרים את מיכל הגלילה האמיתי בטיפוס במעלה ה-DOM ונגללים אותו לראש.
                                                let node: HTMLElement | null = e.currentTarget.parentElement;
                                                let scroller: HTMLElement | null = null;
                                                while (node) {
                                                    const oy = getComputedStyle(node).overflowY;
                                                    if ((oy === 'auto' || oy === 'scroll') && node.scrollHeight > node.clientHeight) {
                                                        scroller = node;
                                                        break;
                                                    }
                                                    node = node.parentElement;
                                                }
                                                if (scroller) scroller.scrollTo({ top: 0, behavior });
                                                else window.scrollTo({ top: 0, behavior });
                                            }}
                                            className={`w-full text-start ${linkCls}`}
                                        >
                                            <span className="text-sm font-bold text-slate-200">{link.label}</span>
                                            {arrow}
                                        </button>
                                    );
                                }

                                return (
                                    <Link key={link.href} href={link.href} className={linkCls}>
                                        <span className="text-sm font-bold text-slate-200">{link.label}</span>
                                        {arrow}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="flex flex-col items-stretch gap-3">
                    {passed && nextHref && (
                        <GuessButton
                            href={nextHref}
                            rgb={accentRgb}
                            fullWidth
                            trailingIcon={isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                        >
                            {nextLabelR}
                        </GuessButton>
                    )}
                    {!passed && reviewHref && (
                        <GuessButton href={reviewHref} rgb="245,158,11" fullWidth leadingIcon={<RotateCcw size={18} />}>
                            {reviewLabelR}
                        </GuessButton>
                    )}
                    <GuessButton onClick={() => setIsReviewMode(true)} rgb="100,116,139" fullWidth leadingIcon={<Eye size={18} />}>
                        {a.reviewAnswers}
                    </GuessButton>
                    <GuessButton
                        onClick={() => { setAnswers({}); setCurrentIndex(0); setIsSubmitted(false); setIsReviewMode(false); setStreak(0); setSeconds(0); setIsActive(true); setDirection(0); setOptionOrder(buildOptionOrder(questions)); }}
                        variant="ghost"
                    >
                        {a.retry}
                    </GuessButton>
                </div>
                </div>
            </motion.div>
        );
    }

    // Stage B: מצב הקונסולה לצביעה אדפטיבית (ויזואלי בלבד; לא נוגע בלוגיקה/ניקוד).
    const answeredCorrect = isAnswered && answers[currentQuestion?.id] === currentQuestion?.correctAnswer;
    const answeredWrong = isAnswered && !answeredCorrect;
    const stateGlow = isReviewMode
        ? 'rgb(100 116 139 / 0.10)'
        : answeredCorrect
            ? 'rgb(16 185 129 / 0.14)'
            : answeredWrong
                ? 'rgb(245 158 11 / 0.12)'
                : `rgb(${accent.base} / 0.12)`;

    // 3. מסך השאלות - Decision Console (עיצוב Stage B)
    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-4 font-sans" dir={dir}>
            {/* ===== קונסולת ההחלטה: כרטיס אחד מאוחד. הכרטיס, הכותרת, ההתקדמות והפוטר
                 נשארים מונטים ויציבים; רק תוכן השאלה הפנימי מתחלף (רצף חלק, בלי מסגרת ריקה). ===== */}
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-slate-900/70 to-slate-950/70 shadow-2xl backdrop-blur-md">
                {/* הילה אדפטיבית לפי מצב (ויזואלי בלבד): ציאן רגוע, אמרלד נכון, ענבר תיקון, אפור בסקירה */}
                <div
                    aria-hidden
                    className={`pointer-events-none absolute -top-28 left-1/2 h-56 w-72 -translate-x-1/2 rounded-full blur-3xl ${reduce ? '' : 'transition-colors duration-500'}`}
                    style={{ background: stateGlow }}
                />

                {/* ---- Header band: כותרת + טיימר/רצף/השתקה, ואז מונה "שאלה X מתוך Y" + התקדמות ---- */}
                <div className="relative border-b border-white/10 px-5 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-6">
                    <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            {/* h2, לא h1: כותרת המבדק היא מקטע בתוך העמוד. ה-h1 היחיד הוא ה-hero. */}
                            <h2 className="truncate text-[15px] font-black leading-tight text-white sm:text-base">{title}</h2>
                            <p className="mt-0.5 hidden truncate text-[13px] font-medium text-slate-500 sm:block">{subtitle}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            {showTimer && (
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/15 bg-white/[0.04] px-2.5 py-1 text-slate-200">
                                    <Timer size={13} className="text-cyan-300/70" />
                                    <span className="font-mono text-[13px] font-bold tabular-nums text-slate-100">{formatTime(seconds)}</span>
                                </span>
                            )}
                            {streak > 1 && (
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/25 bg-amber-400/[0.06] px-2.5 py-1 text-amber-200/90">
                                    <Flame size={13} className="text-orange-400" />
                                    <span className="text-[13px] font-bold">{a.streak(streak)}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* המונה קבוצה נפרדת מהטיימר, וברור */}
                        <span className="shrink-0 font-mono text-[13px] font-bold tabular-nums text-slate-300">
                            {a.questionCounter(currentIndex + 1, questions.length)}
                        </span>
                        {/* פס התקדמות accent מונפש עם נצנוץ אור חד-פעמי בכל מעבר */}
                        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                                animate={{ width: `${progress}%` }}
                                transition={reduce ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="relative h-full overflow-hidden rounded-full"
                                style={{ background: `linear-gradient(90deg, rgba(${accentRgb},0.75), rgba(16,185,129,0.9))` }}
                            >
                                {!reduce && (
                                    <motion.span
                                        key={currentIndex}
                                        aria-hidden
                                        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                        initial={{ x: '-120%' }}
                                        animate={{ x: '360%' }}
                                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                                    />
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* ---- גוף: רק כאן מתחלף התוכן. grid-stack לקרוספייד בלי מסגרת ריקה ובלי קריסת פריסה ---- */}
                <div className="relative grid min-h-[16rem] px-5 py-6 sm:px-7 sm:py-7">
                    <AnimatePresence initial={false}>
                        <motion.div
                            key={currentIndex}
                            className="[grid-area:1/1]"
                            initial={reduce ? false : { opacity: 0, x: (direction < 0 ? -1 : 1) * (isRTL ? -18 : 18) }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={reduce ? { opacity: 0 } : { opacity: 0, x: (direction < 0 ? 1 : -1) * (isRTL ? -18 : 18) }}
                            transition={reduce ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {/* שורת השאלה: prompt חזק + הקראה (אח, לא מקונן) */}
                            <div className="mb-6 flex items-start justify-between gap-3">
                                {/* h3: השאלה יושבת תחת כותרת המבדק (h2), בלי לדלג רמה. */}
                                <h3 className="text-xl font-bold leading-relaxed text-white sm:text-2xl">
                                    {currentQuestion.question}
                                </h3>
                                <SpeakButton text={currentQuestion.question} className="mt-1 shrink-0" />
                            </div>

                            {/* שורות החלטה פרימיום. ההתנהגות זהה: לחיצה = פתרון מיידי עם האינדקס
                                המקורי (oIdx); displayPos הוא מיקום התצוגה בלבד. */}
                            <div className="relative grid gap-2.5">
                                {(optionOrder[currentQuestion.id] ?? currentQuestion.options.map((_, i) => i)).map((oIdx, displayPos) => {
                                    const opt = currentQuestion.options[oIdx];
                                    const isSelected = answers[currentQuestion.id] === oIdx;
                                    const isCorrect = oIdx === currentQuestion.correctAnswer;
                                    const showResult = isAnswered || isReviewMode;

                                    // שגוי = ענבר רגוע (לא אדום). לא צבע בלבד: מסגרת + קו-פתיחה + צ'יפ + אייקון + זוהר.
                                    // textCls נקבע במפורש בכל מצב: טקסט האפשרות תמיד בהיר וקריא על רקע כהה
                                    // (לא יורש שחור). מצב מעומעם רך אך עדיין קריא.
                                    let rowCls = "border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-cyan-400/40 hover:from-white/[0.10]";
                                    let chipCls = "bg-gradient-to-b from-white/20 to-white/[0.06] text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] group-hover:from-cyan-400/40 group-hover:text-white";
                                    let textCls = "text-slate-100 group-hover:text-white";
                                    if (showResult) {
                                        if (isCorrect) {
                                            rowCls = "border-emerald-400/50 border-s-2 border-s-emerald-400 bg-gradient-to-b from-emerald-500/[0.14] to-emerald-500/[0.03] shadow-[0_0_26px_-8px_rgba(16,185,129,0.55)]";
                                            chipCls = "bg-emerald-400 text-slate-950";
                                            textCls = "text-emerald-50";
                                        } else if (isSelected) {
                                            rowCls = "border-amber-400/50 border-s-2 border-s-amber-400 bg-gradient-to-b from-amber-500/[0.12] to-amber-500/[0.02]";
                                            chipCls = "bg-amber-400 text-slate-950";
                                            textCls = "text-amber-50";
                                        } else {
                                            rowCls = "border-white/5 bg-transparent opacity-70";
                                            chipCls = "bg-white/10 text-slate-400";
                                            textCls = "text-slate-300";
                                        }
                                    }

                                    // הקראת האפשרות: אח ממוקם של כפתור-השורה (button בתוך button אסור). בפינת
                                    // ה-end בלבד; pe-12 שומר מקום ואינו חוסם את שטח הלחיצה של השורה.
                                    return (
                                        <div key={oIdx} className="relative">
                                            <button
                                                disabled={showResult && !isReviewMode}
                                                onClick={() => handleAnswer(oIdx)}
                                                className={`group relative flex w-full items-center gap-3.5 overflow-hidden rounded-2xl border py-3.5 pe-12 ps-2.5 text-start transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${rowCls} ${showResult || reduce ? '' : 'hover:-translate-y-px active:scale-[0.99]'}`}
                                            >
                                                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[13px] font-black transition-colors ${chipCls}`}>
                                                    {displayPos + 1}
                                                </span>
                                                <span className={`flex-1 break-words text-[15px] font-semibold leading-snug ${textCls}`}>{opt}</span>
                                                {showResult && isCorrect && <Check size={18} className="shrink-0 text-emerald-300 stroke-[3px]" />}
                                                {showResult && isSelected && !isCorrect && <X size={18} className="shrink-0 text-amber-300 stroke-[3px]" />}
                                                {/* הדגשת-אישור חד-פעמית לשורה הנכונה (לא בסקירה). קישוט: מדולג בתנועה מופחתת. */}
                                                {showResult && isCorrect && !isReviewMode && !reduce && (
                                                    <motion.span
                                                        aria-hidden
                                                        className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-emerald-400/60"
                                                        initial={{ opacity: 0.8, scale: 1 }}
                                                        animate={{ opacity: 0, scale: 1.03 }}
                                                        transition={{ duration: 0.7, ease: 'easeOut' }}
                                                    />
                                                )}
                                            </button>
                                            <SpeakButton text={opt} className="absolute end-2 top-1/2 z-10 -translate-y-1/2" />
                                        </div>
                                    );
                                })}

                                {/* Decision scan: סריקת אור עדינה חד-פעמית אחרי הבחירה. משוב ממשק על ההחלטה,
                                    לא הצגת "חשיבת מודל". קישוט: מדולג בתנועה מופחתת. */}
                                {isAnswered && !isReviewMode && !reduce && (
                                    <motion.div
                                        aria-hidden
                                        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-14 bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent"
                                        initial={{ y: '-30%', opacity: 0 }}
                                        animate={{ y: '340%', opacity: [0, 1, 0] }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                    />
                                )}
                            </div>

                            {/* Readout: פאנל משוב חינוכי פרימיום, גלוי מיד אחרי הבחירה, state-aware (אמרלד/ענבר).
                                כניסה בסגנון "פלט קונסולה" (blur-in). טקסט ההסבר הקיים בלבד. */}
                            <AnimatePresence>
                                {(isAnswered || isReviewMode) && (
                                    <motion.div
                                        initial={reduce ? false : { opacity: 0, y: 10, filter: 'blur(6px)' }}
                                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0 }}
                                        transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        className="mt-5"
                                        role="status"
                                        aria-live="polite"
                                    >
                                        {/* פסק הדין נאמר קודם. חזותית הוא מועבר באייקון, בצבע המסגרת ובתג,
                                            ולכן בלי השורה הזאת קורא מסך שומע רק את ההסבר ולא יודע אם צדק. */}
                                        {isAnswered && (
                                            <span className="sr-only">{answeredWrong ? a.verdictWrong : a.verdictCorrect}</span>
                                        )}
                                        <div className={`relative overflow-hidden rounded-2xl border border-white/10 border-s-2 bg-gradient-to-b to-slate-950/40 p-4 ${answeredWrong ? 'border-s-amber-400/70 from-amber-500/[0.09]' : 'border-s-emerald-400/70 from-emerald-500/[0.09]'}`}>
                                            <div className="flex items-start gap-3">
                                                <motion.span
                                                    initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 16 }}
                                                    className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg ${answeredWrong ? 'bg-amber-400/15 text-amber-300' : 'bg-emerald-400/15 text-emerald-300'}`}
                                                >
                                                    <Lightbulb size={14} />
                                                </motion.span>
                                                <p className="flex-1 text-[14px] font-medium leading-relaxed text-slate-200 sm:text-[15px]">
                                                    {currentQuestion.explanation}
                                                </p>
                                                {/* הקראת ה-readout: השאלה ואז ההסבר (אח של ה-p, לא מקונן) */}
                                                <SpeakButton text={speakJoin(currentQuestion.question, currentQuestion.explanation)} className="shrink-0" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* ===== סרגל ניווט דביק: מחוץ ל-AnimatePresence, יציב ולא מהבהב. רק Back + המשך. ===== */}
            <div className="sticky bottom-0 z-20 -mx-4 mt-5 flex items-center justify-between border-t border-white/10 bg-slate-950/85 px-4 py-3 backdrop-blur-md">
                <button
                    onClick={handleBack}
                    disabled={currentIndex === 0}
                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-all ${currentIndex === 0 ? 'pointer-events-none opacity-0' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                >
                    {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />} {a.prev}
                </button>

                <GuessButton
                    onClick={handleNext}
                    disabled={!isAnswered && !isReviewMode}
                    rgb={accentRgb}
                    trailingIcon={isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                >
                    {currentIndex === questions.length - 1 ? submitLabelR : a.continue}
                </GuessButton>
            </div>
        </div>
    );
};