"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sigma, ChevronDown, ArrowLeft } from 'lucide-react';
import {
    leadingCandidate,
    candidateById,
    wordImpact,
    type TypingStep,
} from '@/app/behind-the-scenes-ai/chapter-4/wordEngine';

interface WordImpactFormulaProps {
    step: TypingStep;
    prevStep: TypingStep | null;
}

/**
 * נוסחת ההשפעה (overlay לימודי, ניתן לפתיחה):
 * new_score = previous_score + word_impact
 * מוצגת על האפשרות המובילה בשלב הנוכחי. זו אינה המתמטיקה האמיתית של מודל,
 * אלא דרך פשוטה לראות שכל מילה מוסיפה או מורידה משקל.
 */
export const WordImpactFormula: React.FC<WordImpactFormulaProps> = ({ step, prevStep }) => {
    const reduce = useReducedMotion();
    const [open, setOpen] = useState(false);

    const id = leadingCandidate(step);
    const cand = candidateById(id);
    const after = step.probabilities[id];
    const impact = wordImpact(prevStep, step, id);
    const before = after - impact;

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 text-right" dir="rtl">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-2 p-4"
            >
                <span className="flex items-center gap-2">
                    <Sigma size={16} className="text-slate-300" />
                    <span className="leading-tight">
                        <span className="block text-sm font-bold text-slate-200">איך נחשב הציר החדש?</span>
                        <span className="block font-mono text-[10px] text-slate-500" dir="ltr">new_score = previous_score + word_impact</span>
                    </span>
                </span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-slate-500">
                    <ChevronDown size={18} />
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-slate-700/50 p-4">
                            <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                                <span>על האפשרות המובילה:</span>
                                <span className="font-bold text-slate-200">{cand.he}</span>
                                <span className="text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{cand.en}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center" dir="ltr">
                                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-2">
                                    <div className="text-[9px] font-medium uppercase tracking-wider text-slate-500">Before</div>
                                    <div className="text-lg font-black tabular-nums text-slate-300">{before}%</div>
                                </div>
                                <div className={`rounded-xl border p-2 ${impact >= 0 ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-rose-500/40 bg-rose-500/10'}`}>
                                    <div className="text-[9px] font-medium uppercase tracking-wider text-slate-500">Word impact</div>
                                    <div className={`text-lg font-black tabular-nums ${impact >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                                        {impact >= 0 ? `+${impact}` : impact}
                                    </div>
                                </div>
                                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-2">
                                    <div className="text-[9px] font-medium uppercase tracking-wider text-slate-500">After</div>
                                    <div className="text-lg font-black tabular-nums text-slate-100">{after}%</div>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-400" dir="ltr">
                                <span className={impact >= 0 ? 'text-emerald-300' : 'text-rose-300'}>Score {impact >= 0 ? 'up' : 'down'}</span>
                                <ArrowLeft size={13} />
                                <span className={impact >= 0 ? 'text-emerald-300' : 'text-rose-300'}>Probability {impact >= 0 ? 'up' : 'down'}</span>
                            </div>

                            <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                                המחשה לימודית: ה-word_impact כאן נגזר מההפרש בין ההתפלגויות של שני השלבים. מודל אמיתי לא מחשב כך, אבל העיקרון דומה - כל מילה מזיזה את המשקל.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
