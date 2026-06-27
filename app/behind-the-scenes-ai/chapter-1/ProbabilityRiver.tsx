"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ACCENTS } from '@/components/ai-internals/accents';
import type { Accent, IntentProbability } from '@/components/ai-internals/types';
import type { Direction } from '@/i18n/config';

interface ProbabilityRiverProps {
    /** ההסתברויות בנקודת הסורק הנוכחית (מהרצה אמיתית של אותו mockEngine). */
    items: IntentProbability[];
    /** סדר ערוצים קבוע (כדי שהם יתעבו/יידללו במקום, ולא יקפצו). */
    order: string[];
    accent: Accent;
    reduce: boolean;
    /** כיוון הכתיבה (תווית/אחוז מתיישרים לפיו). */
    dir: Direction;
}

/**
 * "נהר ההסתברויות": כל כוונה היא ערוץ זורם שעוביו = ההסתברות שלה כרגע. כשהסורק
 * מתקדם, הערוצים מתעבים ומידלדלים במקום (סדר קבוע), והמוביל זוהר. הזרימה היא
 * שכבת-הצגה בלבד - העוביים הם המספרים האמיתיים שהמנוע הפיק לאותו prefix.
 */
export const ProbabilityRiver: React.FC<ProbabilityRiverProps> = ({ items, order, accent, reduce, dir }) => {
    const a = ACCENTS[accent];
    const map = new Map(items.map((it) => [it.label, it.value]));
    const maxVal = items.reduce((m, it) => Math.max(m, it.value), 0);
    const lanes = order.length ? order : items.map((it) => it.label);

    return (
        <div className="flex h-44 flex-col gap-1" dir={dir}>
            {lanes.map((label) => {
                const value = map.get(label) ?? 0;
                const isLead = value > 0 && value === maxVal;
                return (
                    <motion.div
                        key={label}
                        layout={!reduce}
                        animate={{ flexGrow: Math.max(value, 1.5) }}
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20 }}
                        style={{ flexBasis: 0 }}
                        className={`group relative flex min-h-[2rem] items-center overflow-hidden rounded-lg border
                            ${isLead ? `${a.border} ${a.glow}` : 'border-white/10'}`}
                    >
                        {/* מילוי הערוץ */}
                        <div
                            className={`absolute inset-0 ${isLead ? a.barGradient : 'bg-gradient-to-l from-slate-700/70 to-slate-800/50'}`}
                            style={{ opacity: isLead ? 1 : 0.35 + Math.min(value, 40) / 100 }}
                        />

                        {/* נצנוץ זרימה לאורך הערוץ */}
                        {!reduce && (
                            <motion.div
                                aria-hidden
                                className="absolute inset-y-0 w-1/3 bg-gradient-to-l from-transparent via-white/20 to-transparent"
                                initial={{ x: '-120%' }}
                                animate={{ x: '320%' }}
                                transition={{ duration: isLead ? 2.2 : 3.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: isLead ? 0.3 : 1 }}
                            />
                        )}

                        {/* תווית + אחוז */}
                        <div className="relative z-10 flex w-full items-center justify-between px-3">
                            <span className={`truncate text-xs font-bold ${isLead ? 'text-slate-950' : 'text-slate-200'}`}>{label}</span>
                            <span className={`shrink-0 font-mono text-xs font-black tabular-nums ${isLead ? 'text-slate-950' : 'text-slate-300'}`} dir="ltr">{value}%</span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
