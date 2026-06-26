"use client";

import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
import { ArrowUp, ArrowDown, Lock, Loader } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';
import {
    CANDIDATES,
    type CandidateId,
    type TypingStep,
    type WordConfidence,
} from '@/app/behind-the-scenes-ai/chapter-5/wordEngine';

interface CandidateProbabilityPanelProps {
    step: TypingStep | null;
    prevStep: TypingStep | null;
    accent: Accent;
    /** האם ההחלטה עדיין זמנית (לפני Send). */
    temporary: boolean;
}

// מיפוי סטטי: רמת ביטחון -> אחוז מילוי, תווית וגוון.
const CONF: Record<WordConfidence, { pct: number; he: string; en: string; accent: Accent }> = {
    low: { pct: 25, he: 'נמוך', en: 'Low', accent: 'rose' },
    'medium-low': { pct: 45, he: 'נמוך-בינוני', en: 'Medium-low', accent: 'amber' },
    medium: { pct: 65, he: 'בינוני', en: 'Medium', accent: 'amber' },
    high: { pct: 90, he: 'גבוה', en: 'High', accent: 'emerald' },
};

// מצב idle אחיד כשעוד לא הוקלדה מילה מוכרת.
const IDLE_PROB: Record<CandidateId, number> = {
    delivered: 20, 'not-delivered': 20, tracking: 20, system: 20, other: 20,
};

/** מספר שמטפס בהדרגה לערך היעד. */
const AnimatedPercent: React.FC<{ value: number }> = ({ value }) => {
    const reduce = useReducedMotion();
    const mv = useMotionValue(reduce ? value : 0);
    const rounded = useTransform(mv, (v) => `${Math.round(v)}%`);
    useEffect(() => {
        if (reduce) { mv.set(value); return; }
        const controls = animate(mv, value, { duration: 0.5, ease: 'easeOut' });
        return () => controls.stop();
    }, [value, mv, reduce]);
    return <motion.span dir="ltr">{rounded}</motion.span>;
};

/**
 * פאנל הסתברויות ה-candidates עם spring physics. הסדר קבוע כדי שאפשר יהיה
 * לראות כל עמודה זזה במקומה. העמודה המובילה מודגשת, וכל עמודה מציגה את
 * הדלתא מול השלב הקודם (כמה המילה האחרונה הזיזה אותה).
 */
export const CandidateProbabilityPanel: React.FC<CandidateProbabilityPanelProps> = ({
    step,
    prevStep,
    accent,
    temporary,
}) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const probs = step ? step.probabilities : IDLE_PROB;
    const max = Math.max(...Object.values(probs));
    const conf = step ? CONF[step.confidence] : CONF.low;
    const ca = ACCENTS[conf.accent];

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">דירוג אפשרויות</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Probability</div>
                </div>
                {/* תווית זמני / סופי - הלב האתי של הפרק */}
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                        temporary
                            ? 'border-slate-600/60 bg-slate-800/50 text-slate-300'
                            : `${a.border} ${a.bgSoft} ${a.text}`
                    }`}
                >
                    {temporary ? <Loader size={11} /> : <Lock size={11} />}
                    <span className="leading-none">
                        {temporary ? 'כיוון זמני' : 'החלטה סופית'}
                        <span className="ms-1 opacity-70" dir="ltr">{temporary ? 'Temporary' : 'Final'}</span>
                    </span>
                </span>
            </div>

            <div className="space-y-3">
                {CANDIDATES.map((c) => {
                    const value = probs[c.id];
                    const isTop = value === max && !!step;
                    const delta = step && prevStep ? value - prevStep.probabilities[c.id] : 0;
                    const showDelta = Math.abs(delta) >= 1;
                    return (
                        <div key={c.id}>
                            <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                                <span className="flex min-w-0 items-center gap-2">
                                    <span className="leading-tight">
                                        <span className={`block font-bold ${isTop ? a.text : 'text-slate-300'}`}>{c.he}</span>
                                        <span className="block text-[9px] uppercase tracking-[0.14em] text-slate-500" dir="ltr">{c.en}</span>
                                    </span>
                                    {showDelta && (
                                        <span
                                            className={`inline-flex items-center gap-0.5 rounded-md px-1 py-0.5 text-[10px] font-bold tabular-nums ${
                                                delta > 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
                                            }`}
                                            dir="ltr"
                                        >
                                            {delta > 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                                            {delta > 0 ? `+${delta}` : delta}
                                        </span>
                                    )}
                                </span>
                                <span className={`shrink-0 font-black tabular-nums ${isTop ? a.text : 'text-slate-500'}`}>
                                    <AnimatedPercent value={value} />
                                </span>
                            </div>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80">
                                <motion.div
                                    animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}
                                    className={`h-full rounded-full ${isTop ? `${a.barGradient} ${a.glow}` : 'bg-slate-600'}`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* מד הביטחון */}
            <div className="mt-5 border-t border-slate-700/50 pt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Confidence</span>
                    <span className={`font-black ${ca.text}`}>
                        {conf.he}
                        <span className="ms-1.5 text-[11px] font-medium text-slate-500" dir="ltr">{conf.en}</span>
                    </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <motion.div
                        animate={{ width: `${conf.pct}%` }}
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20 }}
                        className={`h-full rounded-full ${ca.barGradient}`}
                    />
                </div>
            </div>
        </div>
    );
};
