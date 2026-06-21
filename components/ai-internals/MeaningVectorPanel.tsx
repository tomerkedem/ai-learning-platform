"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';
import { VECTOR_LABELS, type TypingStep, type VectorKey } from '@/app/behind-the-scenes-ai/chapter-4/wordEngine';

interface MeaningVectorPanelProps {
    step: TypingStep | null;
    accent: Accent;
}

const IDLE: Record<VectorKey, number> = { delivery: 8, system: 8, payment: 6, address: 8, urgency: 6 };

/**
 * וקטור המשמעות (Meaning Vector): כמה כל ציר נושא משמעות בטקסט הנוכחי.
 * הצירים זזים עם spring ככל שמילים נכנסות, ומראים שהמשפט "מצביע" לכיוונים.
 */
export const MeaningVectorPanel: React.FC<MeaningVectorPanelProps> = ({ step, accent }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const vec = step ? step.vector : IDLE;
    const max = Math.max(...VECTOR_LABELS.map((v) => vec[v.key]), 1);

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <Compass size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">וקטור המשמעות</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Meaning Vector</div>
                </div>
            </div>

            <div className="space-y-2.5">
                {VECTOR_LABELS.map((v) => {
                    const value = vec[v.key];
                    const isTop = value === max && !!step;
                    return (
                        <div key={v.key} className="flex items-center gap-3">
                            <span className="w-20 shrink-0 leading-tight">
                                <span className={`block text-xs font-bold ${isTop ? a.text : 'text-slate-300'}`}>{v.he}</span>
                                <span className="block text-[8px] uppercase tracking-[0.14em] text-slate-500" dir="ltr">{v.en}</span>
                            </span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800/80">
                                <motion.div
                                    animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 130, damping: 19 }}
                                    className={`h-full rounded-full ${isTop ? a.barGradient : 'bg-slate-600'}`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
