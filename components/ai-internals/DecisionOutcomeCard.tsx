"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, MessageCircleQuestion, HelpCircle } from 'lucide-react';
import type { ProbabilityDecisionKind } from './types';

interface DecisionOutcomeCardProps {
    kind: ProbabilityDecisionKind;
    decisionHe: string;
    decisionEn: string;
    explanation: string;
}

// מיפוי סטטי של סוג ההחלטה לעיצוב ולאייקון. אין כאן לוגיקת AI - רק תצוגה.
const KIND_STYLE: Record<ProbabilityDecisionKind, {
    icon: React.ReactNode; border: string; grad: string; text: string; dot: string; glow: string;
}> = {
    answer: {
        icon: <CheckCircle2 size={22} />,
        border: 'border-emerald-500/50', grad: 'from-emerald-500/20 to-emerald-900/5',
        text: 'text-emerald-300', dot: 'bg-emerald-400', glow: 'shadow-[0_0_40px_-8px_rgba(52,211,153,0.5)]',
    },
    context: {
        icon: <MessageCircleQuestion size={22} />,
        border: 'border-amber-500/50', grad: 'from-amber-500/20 to-amber-900/5',
        text: 'text-amber-300', dot: 'bg-amber-400', glow: 'shadow-[0_0_40px_-8px_rgba(251,191,36,0.5)]',
    },
    clarify: {
        icon: <HelpCircle size={22} />,
        border: 'border-purple-500/50', grad: 'from-purple-500/20 to-purple-900/5',
        text: 'text-purple-300', dot: 'bg-purple-400', glow: 'shadow-[0_0_40px_-8px_rgba(192,132,252,0.55)]',
    },
};

/**
 * ההחלטה הסופית (Decision): לענות / לבקש הקשר / לשאול שאלת הבהרה.
 * הכרטיס מסביר בבירור למה ההחלטה נבחרה לאור הפער וההתפלגות.
 */
export const DecisionOutcomeCard: React.FC<DecisionOutcomeCardProps> = ({
    kind,
    decisionHe,
    decisionEn,
    explanation,
}) => {
    const reduce = useReducedMotion();
    const s = KIND_STYLE[kind];

    return (
        <motion.div
            key={kind + decisionHe}
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`relative overflow-hidden rounded-2xl border bg-gradient-to-bl p-5 text-right ${s.border} ${s.grad} ${s.glow}`}
            dir="rtl"
        >
            <div className="mb-3 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    {!reduce && <span className={`absolute inline-flex h-full w-full rounded-full ${s.dot} opacity-75 animate-ping`} />}
                    <span className={`relative inline-flex h-2 w-2 rounded-full ${s.dot}`} />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Decision</span>
            </div>

            <div className="flex items-start gap-3">
                <motion.div
                    initial={reduce ? false : { scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 16, delay: 0.05 }}
                    className={`shrink-0 rounded-xl border border-white/10 bg-slate-950/50 p-2.5 ${s.text}`}
                >
                    {s.icon}
                </motion.div>
                <div className="min-w-0">
                    <div className={`text-xl font-black leading-tight ${s.text}`}>{decisionHe}</div>
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-500" dir="ltr">{decisionEn}</div>
                    <p className="text-sm leading-relaxed text-slate-200">{explanation}</p>
                </div>
            </div>
        </motion.div>
    );
};
