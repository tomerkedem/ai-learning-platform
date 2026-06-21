"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Radar, ArrowLeft, Info } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent, ProbabilitySignal, SignalStrength } from './types';

interface ProbabilitySignalsPanelProps {
    signals: ProbabilitySignal[];
    accent: Accent;
}

// מיפוי סטטי: עוצמת רמז -> תווית עברית. high מודגש יותר.
const STRENGTH: Record<SignalStrength, { he: string }> = {
    low: { he: 'חלש' },
    medium: { he: 'בינוני' },
    high: { he: 'חזק' },
};

/**
 * רמזים הסתברותיים (Probability Signals): אילו מילים בפרומט הזיזו את
 * ההסתברויות. המחשה לימודית - לא chain of thought אמיתי של המודל.
 */
export const ProbabilitySignalsPanel: React.FC<ProbabilitySignalsPanelProps> = ({ signals, accent }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-2 flex items-center gap-2">
                <Radar size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">רמזים שהזיזו את ההסתברות</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Probability Signals</div>
                </div>
            </div>

            <p className="mb-4 text-xs leading-relaxed text-slate-400">
                אילו מילים בפרומט הגדילו או פיזרו את ההסתברות בין האפשרויות.
            </p>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {signals.map((sig, i) => {
                    const isStrong = sig.strength === 'high';
                    const strength = sig.strength ? STRENGTH[sig.strength] : undefined;
                    return (
                        <motion.div
                            key={sig.signal}
                            initial={reduce ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                            className={`rounded-xl border p-3 ${
                                isStrong ? `${a.border} ${a.bgSoft}` : 'border-slate-700/50 bg-slate-950/40'
                            }`}
                        >
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <span className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        {isStrong && !reduce && (
                                            <span className={`absolute inline-flex h-full w-full rounded-full ${a.dot} opacity-60 animate-ping`} />
                                        )}
                                        <span className={`relative inline-flex h-2 w-2 rounded-full ${isStrong ? a.dot : 'bg-slate-600'}`} />
                                    </span>
                                    <span className={`text-sm font-bold ${isStrong ? 'text-white' : 'text-slate-300'}`}>
                                        &quot;{sig.signal}&quot;
                                    </span>
                                </span>
                                {strength && (
                                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold ${
                                        isStrong ? `${a.border} ${a.text}` : 'border-slate-700/60 text-slate-500'
                                    }`}>
                                        {strength.he}
                                    </span>
                                )}
                            </div>

                            <div className={`flex items-start gap-1.5 text-xs font-medium ${isStrong ? a.text : 'text-slate-400'}`}>
                                <ArrowLeft size={13} className="mt-0.5 shrink-0" />
                                <span>{sig.effect}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 text-[11px] leading-relaxed text-slate-500">
                <Info size={13} className="mt-0.5 shrink-0" />
                <span>
                    זו המחשה לימודית של רמזים. במודל אמיתי ההתפלגות היא לרוב על המשך הטקסט או על
                    הטוקן (<span dir="ltr">token</span>) הבא, ולא על &quot;כוונות&quot; מוכנות מראש. כאן אנחנו מציגים את
                    אותו עיקרון בצורה לימודית: כמה חזק המידע הקיים דוחף לכיוון אפשרות אחת לעומת האחרות.
                </span>
            </div>
        </div>
    );
};
