"use client";

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';

/** תחנה בודדת במסלול המנוע. ניטרלית לתוכן - הכול מגיע ב-props. */
export interface TrailStep {
    id: string;
    label: string;
    sub?: string;
    icon?: React.ReactNode;
    /** גוון לתחנה. אם לא מוגדר - נופל ל-accent של המסלול. */
    accent?: Accent;
}

interface EngineTrailProps {
    steps: TrailStep[];
    /** גוון ברירת מחדל למסלול. */
    accent?: Accent;
    /** אם true - הילה "זורמת" מהקלט אל התשובה בלולאה. */
    autoplay?: boolean;
    /** מרווח זמן (ms) בין תחנה לתחנה במצב autoplay. */
    interval?: number;
    /** גרסה צפופה לתצוגות preview (Chat/Agent). */
    compact?: boolean;
}

// הילת זוהר סטטית לכל גוון (ללא template-strings דינמיים, כדי ש-Tailwind יזהה).
const GLOW: Record<Accent, string> = {
    cyan: 'shadow-[0_0_28px_-4px_rgba(34,211,238,0.6)]',
    blue: 'shadow-[0_0_28px_-4px_rgba(59,130,246,0.6)]',
    indigo: 'shadow-[0_0_28px_-4px_rgba(99,102,241,0.6)]',
    purple: 'shadow-[0_0_28px_-4px_rgba(168,85,247,0.6)]',
    amber: 'shadow-[0_0_28px_-4px_rgba(245,158,11,0.6)]',
    emerald: 'shadow-[0_0_28px_-4px_rgba(16,185,129,0.6)]',
    rose: 'shadow-[0_0_28px_-4px_rgba(244,63,94,0.6)]',
    slate: 'shadow-[0_0_28px_-4px_rgba(100,116,139,0.5)]',
};

/**
 * מסלול מנוע אנכי ומונפש: כרטיס לכל תחנה, connector מאיר ביניהן,
 * והילה "זורמת" מהקלט אל התשובה. אחריות יחידה: לרנדר את ה-steps שקיבלה.
 * אין תלות ב-courseData ואין לוגיקת פרקים.
 */
export const EngineTrail: React.FC<EngineTrailProps> = ({
    steps,
    accent = 'cyan',
    autoplay = false,
    interval = 700,
    compact = false,
}) => {
    const reduce = useReducedMotion();
    const animate = autoplay && !reduce;
    const [tick, setTick] = useState(0);

    useEffect(() => {
        if (!animate) return;
        const id = setInterval(() => setTick((t) => t + 1), interval);
        return () => clearInterval(id);
    }, [animate, interval]);

    // -1 = שום דבר לא דולק עדיין. בסוף הלולאה הכול דולק לרגע ואז איפוס.
    // במצב סטטי / reduced-motion: הכול דולק.
    const active = animate ? (tick % (steps.length + 2)) - 1 : steps.length;

    return (
        <div className="flex flex-col items-stretch" dir="rtl">
            {steps.map((step, i) => {
                const acc = step.accent ?? accent;
                const a = ACCENTS[acc];
                const lit = i <= active;          // התחנה כבר "נדלקה"
                const isHead = i === active;       // ראש הגל הנוכחי
                const connectorLit = i < active;   // ה-connator שמתחת לתחנה זו זרם

                return (
                    <React.Fragment key={step.id}>
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.06 }}
                            whileHover={reduce ? undefined : { scale: 1.025 }}
                            className={`group relative w-full rounded-2xl border text-right transition-colors duration-300
                                ${compact ? 'p-3' : 'p-4'}
                                ${lit
                                    ? `bg-slate-900/80 ${a.border} ${a.bgSoft}`
                                    : 'bg-slate-900/40 border-white/5'}
                                ${isHead ? `ring-2 ${a.ringSoft} ${GLOW[acc]}` : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                {/* תג מספר / נקודת מצב */}
                                <div
                                    className={`relative shrink-0 rounded-full flex items-center justify-center font-bold transition-all duration-300
                                        ${compact ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'}
                                        ${lit ? `${a.solid} ${a.solidText}` : 'bg-slate-800 text-slate-500 border border-white/10'}`}
                                >
                                    {i + 1}
                                    {isHead && !reduce && (
                                        <motion.span
                                            className={`absolute inset-0 rounded-full ${a.solid}`}
                                            initial={{ opacity: 0.5, scale: 1 }}
                                            animate={{ opacity: 0, scale: 1.9 }}
                                            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
                                        />
                                    )}
                                </div>

                                {/* אייקון */}
                                {step.icon && (
                                    <div className={`shrink-0 transition-colors duration-300 ${lit ? a.text : 'text-slate-600'}`}>
                                        {step.icon}
                                    </div>
                                )}

                                {/* טקסט */}
                                <div className="min-w-0 flex-1">
                                    <div className={`font-bold leading-tight transition-colors duration-300
                                        ${compact ? 'text-sm' : 'text-base'}
                                        ${lit ? 'text-white' : 'text-slate-400'}`}>
                                        {step.label}
                                    </div>
                                    {step.sub && !compact && (
                                        <div className={`text-xs mt-0.5 leading-relaxed transition-colors duration-300 ${lit ? a.text : 'text-slate-600'}`}>
                                            {step.sub}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* connector בין תחנות */}
                        {i < steps.length - 1 && (
                            <div className={`relative flex justify-center items-center ${compact ? 'h-4' : 'h-6'}`} aria-hidden>
                                <div className="relative h-full w-px overflow-hidden bg-white/10">
                                    {connectorLit && (
                                        <motion.div
                                            className={`absolute inset-0 ${ACCENTS[steps[i + 1].accent ?? accent].solid}`}
                                            initial={reduce ? false : { y: '-100%' }}
                                            animate={{ y: '0%' }}
                                            transition={{ duration: 0.35, ease: 'easeOut' }}
                                        />
                                    )}
                                </div>
                                <ChevronDown
                                    size={compact ? 13 : 15}
                                    className={`absolute transition-colors duration-300 ${connectorLit ? ACCENTS[steps[i + 1].accent ?? accent].text : 'text-slate-700'}`}
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
