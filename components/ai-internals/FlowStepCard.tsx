"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DUR } from './motionTokens';
import type { Accent, FlowStep } from './types';

interface FlowStepCardProps {
    step: FlowStep;
    /** מספר השלב להצגה (1-based). אופציונלי. */
    index?: number;
    /** האם השלב מודגש כעת. */
    isActive?: boolean;
    /** גוון ויזואלי מתוך קבוצה סגורה. */
    accent?: Accent;
}

// מפות class סטטיות בלבד - אין template-strings דינמיים, כדי ש-Tailwind יזהה אותן.
const ACCENT: Record<Accent, { border: string; ring: string; text: string; dot: string }> = {
    cyan:    { border: 'border-cyan-500/40',    ring: 'ring-cyan-500/20',    text: 'text-cyan-300',    dot: 'bg-cyan-400' },
    sky:     { border: 'border-sky-500/40',     ring: 'ring-sky-500/20',     text: 'text-sky-300',     dot: 'bg-sky-400' },
    teal:    { border: 'border-teal-500/40',    ring: 'ring-teal-500/20',    text: 'text-teal-300',    dot: 'bg-teal-400' },
    blue:    { border: 'border-blue-500/40',    ring: 'ring-blue-500/20',    text: 'text-blue-300',    dot: 'bg-blue-400' },
    indigo:  { border: 'border-indigo-500/40',  ring: 'ring-indigo-500/20',  text: 'text-indigo-300',  dot: 'bg-indigo-400' },
    violet:  { border: 'border-violet-500/40',  ring: 'ring-violet-500/20',  text: 'text-violet-300',  dot: 'bg-violet-400' },
    purple:  { border: 'border-purple-500/40',  ring: 'ring-purple-500/20',  text: 'text-purple-300',  dot: 'bg-purple-400' },
    fuchsia: { border: 'border-fuchsia-500/40', ring: 'ring-fuchsia-500/20', text: 'text-fuchsia-300', dot: 'bg-fuchsia-400' },
    pink:    { border: 'border-pink-500/40',    ring: 'ring-pink-500/20',    text: 'text-pink-300',    dot: 'bg-pink-400' },
    rose:    { border: 'border-rose-500/40',    ring: 'ring-rose-500/20',    text: 'text-rose-300',    dot: 'bg-rose-400' },
    orange:  { border: 'border-orange-500/40',  ring: 'ring-orange-500/20',  text: 'text-orange-300',  dot: 'bg-orange-400' },
    amber:   { border: 'border-amber-500/40',   ring: 'ring-amber-500/20',   text: 'text-amber-300',   dot: 'bg-amber-400' },
    lime:    { border: 'border-lime-500/40',    ring: 'ring-lime-500/20',    text: 'text-lime-300',    dot: 'bg-lime-400' },
    emerald: { border: 'border-emerald-500/40', ring: 'ring-emerald-500/20', text: 'text-emerald-300', dot: 'bg-emerald-400' },
    slate:   { border: 'border-slate-500/40',   ring: 'ring-slate-500/20',   text: 'text-slate-300',   dot: 'bg-slate-400' },
};

/**
 * מציגה שלב בודד במסלול. ניטרלית: לא יודעת אם זה Chat, Agent, Token או Tool.
 * מקבלת props בלבד.
 */
export const FlowStepCard: React.FC<FlowStepCardProps> = ({
    step,
    index,
    isActive = false,
    accent = 'cyan',
}) => {
    const a = ACCENT[accent];
    const reduce = useReducedMotion();

    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
            className={`w-full rounded-2xl border p-4 text-right transition-all
                ${isActive
                    ? `bg-slate-900/80 ${a.border} ring-4 ${a.ring} shadow-lg`
                    : 'bg-slate-900/40 border-white/5'
                }`}
            dir="rtl"
        >
            <div className="flex items-start gap-3">
                <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold
                    ${isActive ? `${a.dot} text-slate-950` : 'bg-slate-800 text-slate-400 border border-white/10'}`}>
                    {typeof index === 'number' ? index : '•'}
                </div>
                <div className="min-w-0">
                    <div className={`font-bold text-sm ${isActive ? a.text : 'text-slate-200'}`}>
                        {step.title}
                    </div>
                    {step.detail && (
                        <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {step.detail}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
