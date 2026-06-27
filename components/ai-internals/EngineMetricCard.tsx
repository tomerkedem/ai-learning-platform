"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/i18n/useT';
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
    // כיוון תלוי-שפה: פס האקסנט והטקסט נצמדים לצד ההתחלה (RTL: ימין, LTR: שמאל),
    // כך שב-LTR הכרטיס מיושר טבעית במקום להישאר נעוץ בעברית.
    const { dir } = useT();
    const isRtl = dir === 'rtl';
    const a = ACCENTS[tone];

    return (
        <div className={`group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 p-4 ${isRtl ? 'pr-5' : 'pl-5'} text-start transition-colors hover:border-white/20 hover:bg-slate-900/70`} dir={dir}>
            {/* פס אקסנט */}
            <div className={`absolute inset-y-0 ${isRtl ? 'right-0' : 'left-0'} w-1 ${a.barGradient} opacity-80`} />

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
