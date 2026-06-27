"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, HelpCircle, Wrench, Hand } from 'lucide-react';
import { useT } from '@/i18n/useT';
import { DUR, EASE, SPRING, STAGGER } from './motionTokens';
import type { DecisionKind, DecisionState } from './types';

interface DecisionCardProps {
    decision: DecisionState;
}

// מיפוי סטטי של סוג ההחלטה לעיצוב. אין כאן לוגיקת AI - רק תצוגה.
const KIND_STYLE: Record<DecisionKind, {
    icon: React.ReactNode; border: string; grad: string; text: string; dot: string; glow: string;
}> = {
    answer: {
        icon: <CheckCircle2 size={22} />,
        border: 'border-emerald-500/50', grad: 'from-emerald-500/20 to-emerald-900/5',
        text: 'text-emerald-300', dot: 'bg-emerald-400', glow: 'shadow-[0_0_40px_-8px_rgba(52,211,153,0.5)]',
    },
    ask: {
        icon: <HelpCircle size={22} />,
        border: 'border-amber-500/50', grad: 'from-amber-500/20 to-amber-900/5',
        text: 'text-amber-300', dot: 'bg-amber-400', glow: 'shadow-[0_0_40px_-8px_rgba(251,191,36,0.5)]',
    },
    tool: {
        icon: <Wrench size={22} />,
        border: 'border-blue-500/50', grad: 'from-blue-500/20 to-blue-900/5',
        text: 'text-blue-300', dot: 'bg-blue-400', glow: 'shadow-[0_0_40px_-8px_rgba(96,165,250,0.5)]',
    },
    stop: {
        icon: <Hand size={22} />,
        border: 'border-rose-500/50', grad: 'from-rose-500/20 to-rose-900/5',
        text: 'text-rose-300', dot: 'bg-rose-400', glow: 'shadow-[0_0_40px_-8px_rgba(251,113,133,0.55)]',
    },
};

/** מציגה את ההחלטה הסופית: Answer / Ask / Tool / Stop - בחשיפה דרמטית. */
export const DecisionCard: React.FC<DecisionCardProps> = ({ decision }) => {
    const reduce = useReducedMotion();
    const { dir } = useT();
    const isRtl = dir === 'rtl';
    const s = KIND_STYLE[decision.kind];

    return (
        <motion.div
            key={decision.kind + decision.label}
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DUR.mid, ease: EASE.out }}
            className={`relative overflow-hidden rounded-2xl border ${isRtl ? 'bg-gradient-to-bl' : 'bg-gradient-to-br'} p-5 text-start ${s.border} ${s.grad} ${s.glow}`}
            dir={dir}
        >
            {/* תווית מצב */}
            <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                    {!reduce && <span className={`absolute inline-flex h-full w-full rounded-full ${s.dot} opacity-75 animate-ping`} />}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${s.dot}`} />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Final Decision</span>
            </div>

            <div className="flex items-center gap-3">
                <motion.div
                    initial={reduce ? false : { scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ ...SPRING.bump, delay: STAGGER.base }}
                    className={`p-2.5 rounded-xl bg-slate-950/50 border border-white/10 ${s.text}`}
                >
                    {s.icon}
                </motion.div>
                <div className="min-w-0">
                    <div className={`font-black text-xl leading-tight ${s.text}`}>{decision.label}</div>
                    {decision.detail && (
                        <p className="text-sm text-slate-300 mt-1 leading-relaxed">{decision.detail}</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
