"use client";

import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
import { ListOrdered, Trophy } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent, ProbabilityCandidate } from './types';

interface CandidateRankingPanelProps {
    candidates: ProbabilityCandidate[];
    accent: Accent;
}

/** מספר שמטפס בהדרגה לערך היעד (אחוז ההסתברות). */
const AnimatedPercent: React.FC<{ value: number }> = ({ value }) => {
    const reduce = useReducedMotion();
    const mv = useMotionValue(reduce ? value : 0);
    const rounded = useTransform(mv, (v) => `${Math.round(v)}%`);

    useEffect(() => {
        if (reduce) { mv.set(value); return; }
        const controls = animate(mv, value, { duration: 0.7, ease: 'easeOut' });
        return () => controls.stop();
    }, [value, mv, reduce]);

    return <motion.span dir="ltr">{rounded}</motion.span>;
};

/**
 * דירוג אפשרויות (Candidate Ranking) - הלב של הפרק.
 * מראה שהתשובה נולדת מתחרות בין כמה פירושים: כל אפשרות מקבלת ציון יחסי,
 * המוביל מודגש, והעמודות נעות יחד עם כל החלפת תרחיש.
 */
export const CandidateRankingPanel: React.FC<CandidateRankingPanelProps> = ({ candidates, accent }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const max = candidates.reduce((m, c) => Math.max(m, c.probability), 0);

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-1 flex items-center gap-2">
                <ListOrdered size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">דירוג אפשרויות</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Candidate Ranking</div>
                </div>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-slate-400">
                כל אפשרות מקבלת ציון יחסי (Probability). שימו לב מי מוביל, ובכמה.
            </p>

            <div className="space-y-3">
                {candidates.map((c) => {
                    const isTop = c.probability === max;
                    return (
                        <motion.div
                            key={c.id}
                            layout
                            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                            className={`rounded-xl border p-3 ${
                                isTop ? `${a.border} ${a.bgSoft}` : 'border-slate-700/50 bg-slate-950/40'
                            }`}
                        >
                            <div className="mb-1.5 flex items-center justify-between gap-2">
                                <span className="flex min-w-0 items-center gap-2">
                                    {isTop && <Trophy size={14} className={`shrink-0 ${a.text}`} />}
                                    <span className="leading-tight">
                                        <span className={`block text-sm font-bold ${isTop ? 'text-white' : 'text-slate-300'}`}>
                                            {c.labelHe}
                                        </span>
                                        <span className="block text-[9px] font-medium uppercase tracking-[0.15em] text-slate-500" dir="ltr">
                                            {c.labelEn}
                                        </span>
                                    </span>
                                </span>
                                <span className={`shrink-0 text-base font-black tabular-nums ${isTop ? a.text : 'text-slate-500'}`}>
                                    <AnimatedPercent value={c.probability} />
                                </span>
                            </div>

                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80">
                                <motion.div
                                    initial={reduce ? false : { width: 0 }}
                                    animate={{ width: `${Math.max(0, Math.min(100, c.probability))}%` }}
                                    transition={reduce ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                    className={`h-full rounded-full ${isTop ? `${a.barGradient} ${a.glow}` : 'bg-slate-600'}`}
                                />
                            </div>

                            <div className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-400">
                                <span className="mt-0.5 shrink-0 font-bold text-slate-500">Reason:</span>
                                <span>{c.reason}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
