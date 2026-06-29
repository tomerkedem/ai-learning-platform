"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { HelpCircle, CheckCircle2, Lightbulb, Sparkles, ArrowDown, RotateCcw } from 'lucide-react';

import { Mentor } from '@/components/ai-internals/Mentor';
import type { FlowMode } from '@/components/ai-internals/types';
import { useT } from '@/i18n/useT';

interface PredictDecisionProps {
    mode: FlowMode;
}

// מטא-דאטה מבני של מילות הניחוש: המזהה (מפתח למילון), ההסתברות להמחשה, וסימון
// המילה הנכונה. הטקסט עצמו מגיע מהמילון לפי id (pd.words), כדי שהוא יהיה טבעי בכל שפה.
// ההסתברויות הן המחשה לימודית בלבד (כמו שאר הלוח בפרק 1), לא פלט מודל אמיתי.
const WORD_META: { id: string; prob: number; correct?: boolean }[] = [
    { id: 'absurd', prob: 3 },
    { id: 'arrived', prob: 88, correct: true },
    { id: 'plausible', prob: 9 },
];

/* פעימת ניצוצות חד-פעמית לרגע ההצלחה (מונפש בלבד; ההורה לא מרנדר ב-reduced-motion).
   colorClass קובע את גוון הניצוצות לפי המצב (ציאן ל-Chat, סגול ל-Agent). */
function SparkleBurst({ colorClass }: { colorClass: string }) {
    const bits = [
        { x: -48, y: -6, s: 12, d: 0 },
        { x: -22, y: -30, s: 9, d: 0.05 },
        { x: 8, y: -36, s: 14, d: 0.02 },
        { x: 38, y: -26, s: 9, d: 0.08 },
        { x: 56, y: -4, s: 11, d: 0.04 },
    ];
    return (
        <div className={`pointer-events-none absolute left-1/2 top-3 z-20 ${colorClass}`} aria-hidden>
            {bits.map((b, i) => (
                <motion.span
                    key={i}
                    className="absolute"
                    initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.2, 1, 0.6], x: b.x, y: b.y }}
                    transition={{ duration: 0.9, delay: b.d, ease: 'easeOut' }}
                >
                    <Sparkles size={b.s} strokeWidth={2.5} />
                </motion.span>
            ))}
        </div>
    );
}

/**
 * רגע ניחוש לפני ראש הקריאה: "נחשו את המילה הבאה". הלומד משלים מילה אחת במשפט
 * (עוגן החבילות), בוחר מתוך שלוש מילים, ומגלה שהמנוע מדרג מילים לפי הסתברות ובוחר
 * את הסבירה ביותר - בדיוק מה שראש הקריאה שמתחת מראה חי, מילה אחר מילה. אין כאן
 * חישוב מודל אמיתי: זה רגע מעורבות "ניחוש -> גילוי" שמכין את הקרקע למעבדה שאחריו.
 */
export const PredictDecision: React.FC<PredictDecisionProps> = ({ mode }) => {
    const reduce = useReducedMotion();
    const isChat = mode === 'chat';
    const { t, dir } = useT();
    const isRtl = dir === 'rtl';
    const pd = t.behindAi.chapter1.visuals.predict;

    const [guessId, setGuessId] = useState<string | null>(null);
    const answered = guessId !== null;
    const chosen = WORD_META.find((w) => w.id === guessId) ?? null;
    const correct = !!chosen?.correct;

    // המילים מדורגות לפי הסתברות (יורד) להמחשת הדירוג בגילוי.
    const ranked = [...WORD_META].sort((a, b) => b.prob - a.prob);
    const wordText = (id: string) => (pd.words as Record<string, string>)[id] ?? '';

    // צבעי ההדגשה לפי המצב (Chat ציאן, Agent סגול). מחרוזות מלאות כדי ש-Tailwind יזהה אותן.
    const accentText = isChat ? 'text-cyan-300' : 'text-purple-300';
    const accentTitle = isChat ? 'text-cyan-100' : 'text-purple-100';
    const accentBorder = isChat ? 'border-cyan-500/50' : 'border-purple-500/50';
    const accentBg = isChat ? 'bg-cyan-900/25' : 'bg-purple-900/25';
    const accentGlow = isChat ? 'bg-cyan-500/10' : 'bg-purple-500/10';
    const accentBar = isChat ? 'bg-cyan-400' : 'bg-purple-400';
    const optionHover = isChat
        ? 'hover:border-cyan-500/60 hover:bg-cyan-900/15'
        : 'hover:border-purple-500/60 hover:bg-purple-900/15';
    const successGlow = isChat
        ? 'shadow-[0_0_48px_-12px_rgba(34,211,238,0.5)]'
        : 'shadow-[0_0_48px_-12px_rgba(168,85,247,0.5)]';

    // המנטור הפנימי מגיב לתוצאה: אחרי ניחוש נכון חוגג, אחרי טעות מרגיע. ללא בועת דיבור.
    const mentor = correct
        ? { pose: 'celebrate' as const, glow: true }
        : { pose: 'reassure' as const, glow: false };

    return (
        <div
            dir={dir}
            className="relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl md:p-8"
        >
            <div className={`pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full ${accentGlow} blur-[80px]`} />

            <div className="relative">
                {/* מנטור הזמנה: דמות חושבת ממורכזת מעל הכרטיס, נעלמת אחרי הניחוש */}
                {!answered && (
                    <div className="mb-4 hidden flex-col items-center sm:flex">
                        <Mentor pose="think" width={104} glow={false} />
                    </div>
                )}

                <div className="text-center">
                    <span className={`mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] ${accentText}`}>
                        <HelpCircle size={14} /> {pd.eyebrow}
                    </span>
                    <h3 className="mb-2 text-xl font-black text-white md:text-2xl">{pd.question}</h3>
                    <p className="mx-auto mb-6 max-w-xl text-sm text-slate-400">{pd.subtitle}</p>
                </div>

                {/* המשפט עם החסר: סמן מהבהב לפני הבחירה, מילה ש"נשתלת" פנימה אחרי הבחירה */}
                <div
                    className={`mx-auto mb-6 max-w-xl rounded-2xl border bg-slate-950/50 px-5 py-5 text-center transition-colors ${
                        answered ? (correct ? accentBorder : 'border-amber-400/45') : 'border-slate-700/60'
                    }`}
                >
                    <p className="text-lg font-bold leading-relaxed text-slate-100 md:text-xl">
                        {pd.sentenceLead}
                        {!answered ? (
                            <span className={`mx-1 inline-flex min-w-[3.5rem] items-center justify-center rounded-md border-b-2 px-2 align-baseline ${accentBorder}`}>
                                <span className={`font-black ${accentText} ${reduce ? '' : 'animate-pulse'}`} aria-hidden>▌</span>
                            </span>
                        ) : (
                            <motion.span
                                initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 16 }}
                                className={`mx-1.5 inline-block rounded-lg px-2.5 py-0.5 font-black ${correct ? `${accentBg} ${accentText}` : 'bg-amber-900/30 text-amber-200'}`}
                            >
                                {wordText(guessId)}
                            </motion.span>
                        )}
                        {pd.sentenceTail}
                    </p>
                </div>

                {/* מילים לבחירה (לפני הגילוי) */}
                {!answered && (
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {WORD_META.map((w) => (
                            <motion.button
                                key={w.id}
                                type="button"
                                onClick={() => setGuessId(w.id)}
                                aria-label={wordText(w.id)}
                                whileHover={reduce ? undefined : { scale: 1.04 }}
                                whileTap={reduce ? undefined : { scale: 0.97 }}
                                className={`rounded-2xl border border-slate-700/60 bg-slate-800/40 px-5 py-3 text-base font-black text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${optionHover}`}
                            >
                                {wordText(w.id)}
                            </motion.button>
                        ))}
                    </div>
                )}

                {/* גילוי: תיבת משוב מפורשת + דירוג המילים, מנטור משולב פנימה */}
                <AnimatePresence>
                    {answered && (
                        <motion.div
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.35 }}
                            className="mx-auto max-w-2xl"
                            role="status"
                            aria-live="polite"
                        >
                            <div
                                className={`relative overflow-hidden rounded-2xl border p-5 md:p-6 ${
                                    correct ? `${accentBorder} ${accentBg} ${reduce ? '' : successGlow}` : 'border-amber-400/45 bg-amber-900/[0.12]'
                                }`}
                            >
                                {!reduce && correct && <SparkleBurst colorClass={accentText} />}
                                <div className="relative flex items-start gap-4">
                                    <div className="hidden shrink-0 self-center sm:block">
                                        <Mentor key={mentor.pose} pose={mentor.pose} width={88} float={false} glow={mentor.glow} flip={!isRtl} />
                                    </div>
                                    <div className="flex-1 text-start">
                                        <div className="flex items-center gap-2">
                                            {correct ? (
                                                <motion.span
                                                    initial={reduce ? false : { scale: 0, rotate: -25 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 14 }}
                                                    className="inline-flex"
                                                >
                                                    <CheckCircle2 size={22} className={accentText} />
                                                </motion.span>
                                            ) : (
                                                <Lightbulb size={20} className="shrink-0 text-amber-300" />
                                            )}
                                            <span className={`text-lg font-black md:text-xl ${correct ? accentTitle : 'text-amber-200'}`}>
                                                {correct ? pd.correctTitle : pd.wrongTitle}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-200">
                                            {correct ? pd.correctBody : pd.wrongBody}
                                        </p>

                                        {/* דירוג המילים: בר לכל מילה לפי הסתברות (המחשה), הנכונה מודגשת */}
                                        <div className="mt-4">
                                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">{pd.rankingLabel}</p>
                                            <div className="flex flex-col gap-1.5">
                                                {ranked.map((w, i) => (
                                                    <div key={w.id} className="flex items-center gap-2.5">
                                                        <span className={`w-20 shrink-0 truncate text-sm font-bold ${w.correct ? accentText : 'text-slate-300'}`}>
                                                            {wordText(w.id)}
                                                        </span>
                                                        <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800/70">
                                                            <motion.span
                                                                className={`absolute inset-y-0 rounded-full ${w.correct ? accentBar : 'bg-slate-500/55'} ${isRtl ? 'right-0' : 'left-0'}`}
                                                                initial={reduce ? false : { width: 0 }}
                                                                animate={{ width: `${w.prob}%` }}
                                                                transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.1 + i * 0.1, ease: 'easeOut' }}
                                                            />
                                                        </div>
                                                        <span className="w-9 shrink-0 text-end text-xs font-bold text-slate-400">{w.prob}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2.5">
                                            <span className={`inline-flex items-center gap-1.5 border-s-2 ps-3 text-sm font-bold ${accentBorder} ${accentTitle}`}>
                                                {pd.bridge}
                                                {!reduce ? (
                                                    <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} className="inline-flex" aria-hidden>
                                                        <ArrowDown size={15} />
                                                    </motion.span>
                                                ) : (
                                                    <ArrowDown size={15} aria-hidden />
                                                )}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setGuessId(null)}
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 transition-colors hover:text-slate-200"
                                            >
                                                <RotateCcw size={13} /> {pd.guessAgain}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
