"use client";

import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
import { ACCENTS } from './accents';
import { DUR, EASE, SPRING } from './motionTokens';
import type { Accent, IntentProbability } from './types';

interface ProbabilityBarsProps {
    items: IntentProbability[];
    accent?: Accent;
    /** כותרת אופציונלית מעל העמודות. */
    title?: string;
}

/** מספר שמטפס בהדרגה לערך היעד. */
const AnimatedPercent: React.FC<{ value: number }> = ({ value }) => {
    const reduce = useReducedMotion();
    const mv = useMotionValue(reduce ? value : 0);
    const rounded = useTransform(mv, (v) => `${Math.round(v)}%`);

    useEffect(() => {
        if (reduce) { mv.set(value); return; }
        const controls = animate(mv, value, { duration: DUR.data, ease: EASE.inter });
        return () => controls.stop();
    }, [value, mv, reduce]);

    return <motion.span dir="ltr">{rounded}</motion.span>;
};

/** מציגה כוונות עם עמודות הסתברות מונפשות. אחריות יחידה: רינדור items שהתקבלו ב-props. */
export const ProbabilityBars: React.FC<ProbabilityBarsProps> = ({ items, accent = 'cyan', title }) => {
    const a = ACCENTS[accent];
    const max = items.reduce((m, it) => Math.max(m, it.value), 0);

    return (
        <div className="space-y-3" dir="auto">
            {title && (
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</div>
            )}
            <div className="space-y-2.5">
                {items.map((item) => {
                    const isTop = item.value === max;
                    return (
                        <motion.div key={item.label} layout transition={SPRING.reflow}>
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className={isTop ? `font-bold ${a.text}` : 'text-slate-400'}>{item.label}</span>
                                <span className={isTop ? `font-bold ${a.text}` : 'text-slate-500'}>
                                    <AnimatedPercent value={item.value} />
                                </span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.max(0, Math.min(100, item.value))}%` }}
                                    transition={{ duration: DUR.data, ease: EASE.out }}
                                    className={`h-full rounded-full ${isTop ? `${a.barGradient} ${a.glow}` : 'bg-slate-600'}`}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
