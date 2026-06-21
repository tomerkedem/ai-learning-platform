"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ACCENTS } from './accents';
import type { Accent } from './types';

interface EngineMetricCardProps {
    label: string;
    value: string;
    hint?: string;
    /** גוון לערך המודגש ולפס האקסנט. */
    tone?: Accent;
    icon?: React.ReactNode;
}

/** כרטיס מדד גנרי במנוע: label + value (+hint). אחריות יחידה: תצוגת מדד יחיד. */
export const EngineMetricCard: React.FC<EngineMetricCardProps> = ({
    label,
    value,
    hint,
    tone = 'cyan',
    icon,
}) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[tone];

    return (
        <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 p-4 pr-5 text-right transition-colors hover:border-white/20 hover:bg-slate-900/70" dir="rtl">
            {/* פס אקסנט */}
            <div className={`absolute inset-y-0 right-0 w-1 ${a.barGradient} opacity-80`} />

            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                {icon}
                {label}
            </div>
            <motion.div
                key={value}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`font-bold text-base ${a.text}`}
            >
                {value}
            </motion.div>
            {hint && <div className="text-xs text-slate-400 mt-1 leading-relaxed">{hint}</div>}
        </div>
    );
};
