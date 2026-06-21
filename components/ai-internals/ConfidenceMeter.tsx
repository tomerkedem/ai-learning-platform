"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Gauge } from 'lucide-react';
import { ACCENTS } from './accents';
import { DUR, EASE } from './motionTokens';
import type { Accent } from './types';

type Level = 'High' | 'Medium' | 'Low';

interface ConfidenceMeterProps {
    level: Level;
}

const LEVEL: Record<Level, { pct: number; accent: Accent; he: string }> = {
    High: { pct: 100, accent: 'emerald', he: 'גבוה' },
    Medium: { pct: 62, accent: 'amber', he: 'בינוני' },
    Low: { pct: 30, accent: 'rose', he: 'נמוך' },
};

/** מד ביטחון סמנטי עם מילוי מונפש. אחריות יחידה: הצגת רמת ביטחון. */
export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ level }) => {
    const reduce = useReducedMotion();
    const { pct, accent, he } = LEVEL[level];
    const a = ACCENTS[accent];

    return (
        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 text-right" dir="rtl">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <Gauge size={12} /> Confidence
                </div>
                <div className={`flex items-baseline gap-1.5 font-black ${a.text}`}>
                    <span className="text-base">{level}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{he}</span>
                </div>
            </div>

            <div className="relative h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                    key={level}
                    initial={reduce ? false : { width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: DUR.data, ease: EASE.out }}
                    className={`h-full rounded-full ${a.barGradient} ${a.glow}`}
                />
                {/* סמני סף */}
                <div className="absolute inset-0 flex justify-between px-[33%] pointer-events-none">
                    <div className="w-px h-full bg-slate-950/60" />
                    <div className="w-px h-full bg-slate-950/60" />
                </div>
            </div>

            <div className="flex justify-between mt-1.5 text-[9px] font-mono text-slate-600">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
            </div>
        </div>
    );
};
