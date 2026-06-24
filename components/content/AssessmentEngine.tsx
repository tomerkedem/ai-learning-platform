"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Check, X, Lightbulb,
  Trophy, ChevronRight, ChevronLeft,
  Timer, Eye, EyeOff, Flame, Volume2, VolumeX, Play, ArrowLeft, RotateCcw
} from "lucide-react";
import confetti from 'canvas-confetti';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface ScoreTier {
    /** ציון מינימלי (באחוזים) שמזכה בדרגה הזו. המערך ממוין מהגבוה לנמוך. */
    min: number;
    label: string;
    color: string;
    sub: string;
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

    // פונקציית סאונד מעודכנת
    const playSound = useCallback((type: 'correct' | 'wrong' | 'click' | 'complete') => {
        if (isMuted) return;
        const sounds = {
            correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
            wrong: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
            click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
            complete: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'
        };
        const audio = new Audio(sounds[type]);
        audio.volume = 0.2;
        audio.play().catch(() => {});
    }, [isMuted]);

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
            const score = (questions.reduce((acc, q) => answers[q.id] === q.correctAnswer ? acc + 1 : acc, 0) / questions.length) * 100;
            if (score >= passScore) {
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                playSound('complete');
            }
        }
    }, [currentIndex, questions, isReviewMode, answers, playSound, passScore]);

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
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto p-8 rounded-3xl bg-slate-900 border border-white/10 text-center shadow-2xl"
                dir="rtl"
            >
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                    <Play size={32} className="text-blue-400 fill-current ml-1" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">{title}</h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">{subtitle}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">שאלות</div>
                        <div className="text-white font-black">{questions.length}</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">זמן מומלץ</div>
                        <div className="text-white font-black">{Math.ceil(questions.length * 0.5)} דק&apos;</div>
                    </div>
                </div>

                <button 
                    onClick={handleStart}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 group"
                >
                    התחל בחינה
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
            </motion.div>
        );
    }

    // 2. מסך תוצאות - Results Screen (מעודכן לציון אמיתי)
    if (isSubmitted && !isReviewMode) {
        const correctCount = questions.reduce((acc, q) => answers[q.id] === q.correctAnswer ? acc + 1 : acc, 0);
        const scoreValue = Math.round((correctCount / questions.length) * 100);
        const feedback = getScoreFeedback(scoreValue);
        const passed = scoreValue >= passScore;

        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto p-8 rounded-3xl bg-slate-950 border border-white/10 text-center shadow-2xl"
                dir="rtl"
            >
                <div className="mb-8">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-blue-500/5">
                        <Trophy size={40} className="text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white">הבחינה הושלמה!</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-8">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2">הציון הסופי</div>
                        <div className={`text-6xl font-black mb-1 tabular-nums ${feedback.color}`}>{scoreValue}%</div>
                        <div className={`text-xl font-black mb-1 ${feedback.color}`}>{feedback.label}</div>
                        <div className="text-slate-400 text-xs">{feedback.sub}</div>
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-around">
                            <div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase">נכונות</div>
                                <div className="text-white font-bold">{correctCount} / {questions.length}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase">זמן</div>
                                <div className="text-white font-bold">{formatTime(seconds)}</div>
                            </div>
                        </div>
                    </div>
                </div>

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
                <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-white border border-white/10 transition-colors"
                >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
            </div>

            {/* Stats Bar */}
            <div className="mb-6 flex items-center gap-2">
                <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
                    <Timer size={14} />
                    <span className="font-mono text-xs font-bold">{formatTime(seconds)}</span>
                </div>
                
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
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-6 pt-6 border-t border-white/5">
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
                        <span>{currentIndex === questions.length - 1 ? "סיום בחינה" : "המשך"}</span>
                        <ChevronLeft size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};