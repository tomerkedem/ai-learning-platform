"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Check, X, Lightbulb,
  Trophy, ChevronRight, ChevronLeft,
  Timer, Eye, EyeOff, Flame, Volume2, VolumeX, Play, ArrowLeft, RotateCcw,
  ListChecks
} from "lucide-react";
import confetti from 'canvas-confetti';
import { Mentor, type MentorAccent } from '../ai-internals/Mentor';

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
    /** האם להפעיל אפקטי סאונד חיצוניים. ברירת מחדל: true (תאימות לאחור). */
    soundEnabled?: boolean;
    /** האם להציג את המנטור במסכי הפתיחה והתוצאות. ברירת מחדל: true. */
    showMentor?: boolean;
    /** צבע ההדגשה של המנטור. ברירת מחדל: ציאן (תואם BTS-AI). */
    mentorAccent?: MentorAccent;
}

const DEFAULT_TIERS: ScoreTier[] = [
    { min: 90, label: "מצוין!", color: "text-emerald-400", sub: "שליטה מלאה בחומר" },
    { min: 70, label: "טוב מאוד", color: "text-blue-400", sub: "הבנה טובה מאוד" },
    { min: 50, label: "עבר", color: "text-amber-400", sub: "יש מקום לשיפור" },
    { min: 0, label: "נכשל", color: "text-red-400", sub: "מומלץ ללמוד שוב" },
];

export const AssessmentEngine = ({
    title,
    subtitle,
    questions,
    passScore = 70,
    scoreTiers,
    nextHref,
    nextLabel = "המשך לפרק הבא",
    reviewHref,
    reviewLabel = "חזרה לחזרה קצרה",
    onComplete,
    getReviewLinks,
    startLabel = "התחל בחינה",
    submitLabel = "סיום בחינה",
    completedTitle = "הבחינה הושלמה!",
    showTimer = true,
    soundEnabled = true,
    showMentor = true,
    mentorAccent,
}: AssessmentProps) => {
    // States
    const [isStarted, setIsStarted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [direction, setDirection] = useState(0);
    const [showExplanation, setShowExplanation] = useState(true);
    const [streak, setStreak] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // גוון ההדגשה לכרום של מסכי הפתיחה/תוצאות (הילות, מסגרות, כפתור ראשי).
    // נגזר מצבע המנטור כדי שהכול ירגיש מתוך עולם אחד; ברירת המחדל ציאן (תואם BTS-AI).
    const accent = mentorAccent ?? { base: '6 182 212', shadow: '34 211 238', text: '#a5f3fc' };

    // פונקציית סאונד מעודכנת
    const playSound = useCallback((type: 'correct' | 'wrong' | 'click' | 'complete') => {
        if (isMuted || !soundEnabled) return;
        const sounds = {
            correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
            wrong: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
            click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
            complete: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'
        };
        const audio = new Audio(sounds[type]);
        audio.volume = 0.2;
        audio.play().catch(() => {});
    }, [isMuted, soundEnabled]);

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
        const tiers = scoreTiers ?? DEFAULT_TIERS;
        return tiers.find(t => score >= t.min) ?? tiers[tiers.length - 1];
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
        playSound('click');
        setIsStarted(true);
        setIsActive(true);
    };

    const handleAnswer = useCallback((oIdx: number) => {
        if (isAnswered && !isReviewMode) return;
        const isCorrect = oIdx === currentQuestion.correctAnswer;
        if (isCorrect) {
            setStreak(prev => prev + 1);
            playSound('correct');
        } else {
            setStreak(0);
            playSound('wrong');
        }
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: oIdx }));
    }, [currentQuestion, isAnswered, isReviewMode, playSound]);

    const handleNext = useCallback(() => {
        playSound('click');
        if (currentIndex < questions.length - 1) {
            setDirection(1);
            setCurrentIndex(prev => prev + 1);
        } else if (!isReviewMode) {
            setIsSubmitted(true);
            setIsActive(false);
            const result = buildResult();
            if (result.passed) {
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                playSound('complete');
            }
            // התמדה: כל סיום נספר כניסיון. onComplete אחראי לשמירה ב-localStorage.
            onComplete?.(result);
        }
    }, [currentIndex, questions, isReviewMode, buildResult, playSound, onComplete]);

    const handleBack = useCallback(() => {
        if (currentIndex > 0) {
            playSound('click');
            setDirection(-1);
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex, playSound]);

    // 1. מסך פתיחה - Start Screen
    if (!isStarted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                className="relative max-w-md mx-auto overflow-hidden p-8 pt-16 rounded-[2rem] bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 text-center shadow-2xl"
                dir="rtl"
            >
                {/* הילת הדגשה רכה בראש הכרטיס */}
                <div
                    className="pointer-events-none absolute -top-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full blur-3xl"
                    style={{ background: `rgb(${accent.base} / 0.18)` }}
                />

                <div className="relative">
                    {showMentor ? (
                        <div className="flex justify-center mb-8">
                            <Mentor pose="ready" width={140} line="מוכן? בוא נראה מה קלטת" accent={mentorAccent} />
                        </div>
                    ) : (
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                            <Play size={32} className="text-blue-400 fill-current ml-1" />
                        </div>
                    )}
                    <h2 className="text-2xl font-black text-white mb-2">{title}</h2>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">{subtitle}</p>

                    <div className={`grid ${showTimer ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-8`}>
                        <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 text-right">
                            <span
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                style={{ background: `rgb(${accent.base} / 0.12)`, color: `rgb(${accent.shadow})` }}
                            >
                                <ListChecks size={18} />
                            </span>
                            <div>
                                <div className="text-slate-500 text-[10px] font-bold uppercase">שאלות</div>
                                <div className="text-white font-black text-lg leading-tight">{questions.length}</div>
                            </div>
                        </div>
                        {showTimer && (
                            <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 text-right">
                                <span
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                    style={{ background: `rgb(${accent.base} / 0.12)`, color: `rgb(${accent.shadow})` }}
                                >
                                    <Timer size={18} />
                                </span>
                                <div>
                                    <div className="text-slate-500 text-[10px] font-bold uppercase">זמן מומלץ</div>
                                    <div className="text-white font-black text-lg leading-tight">{Math.ceil(questions.length * 0.5)} דק&apos;</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleStart}
                        className="group relative w-full overflow-hidden py-4 rounded-2xl font-black text-slate-950 transition-all hover:-translate-y-0.5"
                        style={{
                            background: `linear-gradient(135deg, rgb(${accent.shadow}), rgb(${accent.base}))`,
                            boxShadow: `0 12px 32px rgb(${accent.base} / 0.35)`,
                        }}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {startLabel}
                            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </span>
                        {/* ברק חולף בריחוף */}
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </button>
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
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                className="relative max-w-md mx-auto overflow-hidden p-8 pt-16 rounded-[2rem] bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 text-center shadow-2xl"
                dir="rtl"
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
                        {showMentor ? (
                            <div className="flex justify-center mb-5">
                                <Mentor
                                    pose={passed ? 'celebrate' : 'reassure'}
                                    width={160}
                                    line={passed ? (scoreValue >= 90 ? 'מצוין, שליטה מלאה!' : 'יפה, עברת!') : 'לא נורא, נחזור על זה יחד'}
                                    accent={mentorAccent}
                                />
                            </div>
                        ) : (
                            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-blue-500/5">
                                <Trophy size={40} className="text-blue-400" />
                            </div>
                        )}
                        <h2 className="text-2xl font-black text-white">{completedTitle}</h2>
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
                                initial={{ strokeDashoffset: ring }}
                                animate={{ strokeDashoffset: ring * (1 - scoreValue / 100) }}
                                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15 }}
                                style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, type: 'spring', stiffness: 240, damping: 16 }}
                                className={`text-5xl font-black tabular-nums leading-none ${feedback.color}`}
                            >
                                {scoreValue}%
                            </motion.div>
                            <div className={`mt-1.5 text-base font-black ${feedback.color}`}>{feedback.label}</div>
                            <div className="text-slate-500 text-[11px] font-medium">{feedback.sub}</div>
                        </div>
                    </div>

                    {/* סטטיסטיקות: נכונות וזמן */}
                    <div className={`grid ${showTimer ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-6`}>
                        <div className="flex items-center justify-center gap-2.5 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                            <Check size={16} className="text-emerald-400 stroke-[3px]" />
                            <div className="text-right">
                                <div className="text-[10px] text-slate-500 font-bold uppercase">נכונות</div>
                                <div className="text-white font-black leading-tight">{correctCount} / {questions.length}</div>
                            </div>
                        </div>
                        {showTimer && (
                            <div className="flex items-center justify-center gap-2.5 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                                <Timer size={16} className="text-amber-400" />
                                <div className="text-right">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase">זמן</div>
                                    <div className="text-white font-black leading-tight">{formatTime(seconds)}</div>
                                </div>
                            </div>
                        )}
                    </div>

                {/* אבחון מושגים: מה חזק ומה כדאי לחזק */}
                {(strongConcepts.length > 0 || weakConcepts.length > 0) && (
                    <div className="grid grid-cols-1 gap-3 mb-6 text-right">
                        {strongConcepts.length > 0 && (
                            <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/15">
                                <div className="text-emerald-400 text-xs font-black mb-2">חזק אצלך</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {strongConcepts.map(c => (
                                        <span key={c} className="text-[11px] font-bold text-emerald-200 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">{c}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {weakConcepts.length > 0 && (
                            <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/15">
                                <div className="text-amber-400 text-xs font-black mb-2">כדאי לחזק</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {weakConcepts.map(c => (
                                        <span key={c} className="text-[11px] font-bold text-amber-200 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">{c}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* חזרה מומלצת: עד שלושה קישורים ממוקדים לפי המושגים החלשים */}
                {reviewLinks.length > 0 && (
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-6 text-right">
                        <div className="text-slate-300 text-xs font-black mb-3">חזרה מומלצת</div>
                        <div className="space-y-2">
                            {reviewLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center justify-between gap-2 bg-white/5 hover:bg-white/10 px-3 py-2.5 rounded-xl border border-white/10 transition-all no-underline group"
                                >
                                    <span className="text-sm font-bold text-slate-200">{link.label}</span>
                                    <ArrowLeft size={16} className="text-slate-500 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {passed && nextHref && (
                        <Link
                            href={nextHref}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 no-underline"
                        >
                            {nextLabel} <ArrowLeft size={18} />
                        </Link>
                    )}
                    {!passed && reviewHref && (
                        <Link
                            href={reviewHref}
                            className="w-full py-3 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 rounded-xl font-bold border border-amber-500/20 transition-all flex items-center justify-center gap-2 no-underline"
                        >
                            <RotateCcw size={18} /> {reviewLabel}
                        </Link>
                    )}
                    <button
                        onClick={() => setIsReviewMode(true)}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold border border-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        <Eye size={18} /> סקירת תשובות
                    </button>
                    <button
                        onClick={() => { setAnswers({}); setCurrentIndex(0); setIsSubmitted(false); setIsReviewMode(false); setStreak(0); setSeconds(0); setIsActive(true); setDirection(0); }}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-bold border border-white/10 transition-all"
                    >
                        ניסיון חוזר
                    </button>
                </div>
                </div>
            </motion.div>
        );
    }

    // 3. מסך השאלות - Question Screen (ממוזער ב-30%)
    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-4 font-sans" dir="rtl">
            {/* Header קומפקטי */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-lg font-black text-white leading-tight">{title}</h1>
                    <p className="text-slate-500 text-[11px] font-medium">{subtitle}</p>
                </div>
                {soundEnabled && (
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        aria-label={isMuted ? "הפעלת צלילים" : "השתקת צלילים"}
                        className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-white border border-white/10 transition-colors"
                    >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                )}
            </div>

            {/* Stats Bar */}
            <div className="mb-6 flex items-center gap-2">
                {showTimer && (
                    <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
                        <Timer size={14} />
                        <span className="font-mono text-xs font-bold">{formatTime(seconds)}</span>
                    </div>
                )}

                {streak > 1 && (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/20">
                        <Flame size={14} fill="currentColor" />
                        <span className="font-bold text-[10px]">{streak} רצף</span>
                    </motion.div>
                )}

                <div className="mr-auto flex items-center gap-3 bg-white/5 p-1.5 px-3 rounded-xl border border-white/10">
                    <span className="text-[10px] font-bold text-slate-500">{currentIndex + 1} / {questions.length}</span>
                    <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div animate={{ width: `${progress}%` }} className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                    </div>
                </div>
            </div>

            {/* Question Card */}
            <div className="relative min-h-80">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div 
                        key={currentIndex} custom={direction}
                        initial={{ x: direction > 0 ? -30 : 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: direction < 0 ? -30 : 30, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="bg-slate-900/50 border border-white/10 p-6 sm:p-8 rounded-[2rem] backdrop-blur-md shadow-2xl">
                            <h4 className="text-lg sm:text-xl font-bold text-white mb-6 leading-relaxed">
                                {currentQuestion.question}
                            </h4>

                            <div className="grid gap-3">
                                {currentQuestion.options.map((opt, oIdx) => {
                                    const isSelected = answers[currentQuestion.id] === oIdx;
                                    const isCorrect = oIdx === currentQuestion.correctAnswer;
                                    const showResult = isAnswered || isReviewMode;

                                    let btnStyle = "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10";
                                    if (showResult) {
                                        if (isCorrect) btnStyle = "border-emerald-500/30 bg-emerald-500/10 text-emerald-100";
                                        else if (isSelected) btnStyle = "border-red-500/30 bg-red-500/10 text-red-100";
                                        else btnStyle = "opacity-30 border-transparent";
                                    }

                                    return (
                                        <button 
                                            key={oIdx} 
                                            disabled={showResult && !isReviewMode}
                                            onClick={() => handleAnswer(oIdx)} 
                                            className={`w-full p-4 rounded-2xl text-right transition-all border-2 flex items-center justify-between group ${btnStyle}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-white/10 group-hover:bg-blue-500/20'}`}>
                                                    {oIdx + 1}
                                                </span>
                                                <span className="text-sm font-bold">{opt}</span>
                                            </div>
                                            {showResult && isCorrect && <Check size={18} className="text-emerald-400 stroke-[3px]" />}
                                            {showResult && isSelected && !isCorrect && <X size={18} className="text-red-400 stroke-[3px]" />}
                                        </button>
                                    );
                                })}
                            </div>

                            <AnimatePresence>
                                {(isAnswered || isReviewMode) && showExplanation && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-6 pt-6 border-t border-white/5" role="status" aria-live="polite">
                                        <div className="flex items-start gap-3 bg-blue-500/10 p-4 rounded-2xl border border-blue-500/10">
                                            <Lightbulb size={18} className="text-blue-400 shrink-0 mt-0.5" />
                                            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed font-medium">
                                                {currentQuestion.explanation}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Bar */}
            <div className="mt-8 flex items-center justify-between">
                <button 
                    onClick={handleBack} 
                    disabled={currentIndex === 0} 
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all rounded-xl ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                    <ChevronRight size={18} /> הקודם
                </button>

                <div className="flex gap-3">
                    {isAnswered && (
                        <button 
                            onClick={() => { playSound('click'); setShowExplanation(!showExplanation); }}
                            className="p-2.5 rounded-xl bg-white/5 text-slate-500 hover:text-white border border-white/10 transition-all"
                        >
                            {showExplanation ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                    <button 
                        onClick={handleNext} 
                        disabled={!isAnswered && !isReviewMode} 
                        className={`px-8 py-3 rounded-2xl text-sm font-black flex items-center gap-2 transition-all shadow-xl ${(!isAnswered && !isReviewMode) ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 hover:-translate-y-0.5'}`}
                    >
                        <span>{currentIndex === questions.length - 1 ? submitLabel : "המשך"}</span>
                        <ChevronLeft size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};