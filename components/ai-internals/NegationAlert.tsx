"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Zap, ArrowDown, ArrowUp } from 'lucide-react';
import {
    biggestMovers,
    candidateById,
    type TypingStep,
} from '@/app/behind-the-scenes-ai/chapter-5/wordEngine';

interface NegationAlertProps {
    step: TypingStep;
    prevStep: TypingStep | null;
}

/**
 * Negation Alert: כשמזוהה מילת שלילה, לא רק מתריעים - מראים את ההשפעה
 * המספרית. המילה פועמת, והכרטיס מציג מי צנח ומי זינק בעקבותיה.
 */
export const NegationAlert: React.FC<NegationAlertProps> = ({ step, prevStep }) => {
    const reduce = useReducedMotion();
    const { riser, faller } = biggestMovers(prevStep, step);

    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 22 }}
            className="relative overflow-hidden rounded-2xl border border-rose-500/45 bg-gradient-to-bl from-rose-500/15 to-slate-900/40 p-5 text-right shadow-[0_0_40px_-12px_rgba(251,113,133,0.45)]"
            dir="rtl"
        >
            <div className="flex flex-wrap items-center gap-3">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-400/30 bg-slate-950/60 text-rose-300">
                    {!reduce && <span className="absolute inline-flex h-full w-full rounded-xl bg-rose-400/30 animate-ping" />}
                    <Zap size={18} className="relative" />
                </span>
                <div className="leading-tight">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-400/80" dir="ltr">Negation detected</div>
                    <div className="text-base font-black text-white">
                        זוהתה מילת שלילה:{' '}
                        <motion.span
                            animate={reduce ? undefined : { scale: [1, 1.18, 1] }}
                            transition={reduce ? undefined : { duration: 0.6, repeat: Infinity, repeatDelay: 1.1 }}
                            className="inline-block rounded-md bg-rose-500/25 px-2 font-mono text-rose-200"
                        >
                            &quot;{step.negationWord}&quot;
                        </motion.span>
                    </div>
                </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-200">
                מילת השלילה דחפה את ההסתברות לכיוון ההפוך. כך היא הזיזה את שתי האפשרויות המרכזיות:
            </p>

            {/* ההשפעה המספרית: היורד והעולה */}
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
                    <span className="leading-tight">
                        <span className="block text-sm font-bold text-rose-200">{candidateById(faller.id).he}</span>
                        <span className="block text-[9px] uppercase tracking-wider text-rose-300/70" dir="ltr">{candidateById(faller.id).en}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-lg font-black tabular-nums text-rose-300" dir="ltr">
                        <ArrowDown size={16} />{faller.delta}
                    </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                    <span className="leading-tight">
                        <span className="block text-sm font-bold text-emerald-200">{candidateById(riser.id).he}</span>
                        <span className="block text-[9px] uppercase tracking-wider text-emerald-300/70" dir="ltr">{candidateById(riser.id).en}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-lg font-black tabular-nums text-emerald-300" dir="ltr">
                        <ArrowUp size={16} />+{riser.delta}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
