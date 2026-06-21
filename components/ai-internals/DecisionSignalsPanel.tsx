"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Radar, ArrowLeft, Info } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent, DecisionSignal, SignalStrength } from './types';

interface DecisionSignalsPanelProps {
    signals: DecisionSignal[];
    accent: Accent;
}

// מיפוי סטטי: עוצמת רמז -> תוויות (עברית/אנגלית). high מודגש יותר.
const STRENGTH: Record<SignalStrength, { he: string; en: string }> = {
    low: { he: 'חלש', en: 'Low' },
    medium: { he: 'בינוני', en: 'Medium' },
    high: { he: 'חזק', en: 'High' },
};

/**
 * רמזי החלטה (Decision Signals): המחשה לימודית של הסימנים בפרומט
 * שמשפיעים על זיהוי הכוונה ועל בחירת המסלול. אין כאן chain of thought אמיתי.
 */
export const DecisionSignalsPanel: React.FC<DecisionSignalsPanelProps> = ({ signals, accent }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-2 flex items-center gap-2">
                <Radar size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">רמזי החלטה</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Decision Signals</div>
                </div>
            </div>

            <p className="mb-4 text-xs leading-relaxed text-slate-400">
                כאן רואים אילו סימנים בפרומט גרמו למנוע להבין את הכוונה ולבחור מסלול.
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
                            {/* כותרת הרמז + עוצמה */}
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

                            {/* משמעות */}
                            <div className="text-xs text-slate-300">{sig.meaning}</div>

                            {/* השפעה על המנוע */}
                            <div className={`mt-1.5 flex items-start gap-1.5 text-xs font-medium ${isStrong ? a.text : 'text-slate-400'}`}>
                                <ArrowLeft size={13} className="mt-0.5 shrink-0" />
                                <span>{sig.effect}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* הערת שקיפות: זו המחשה לימודית, לא chain of thought אמיתי */}
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 text-[11px] leading-relaxed text-slate-500">
                <Info size={13} className="mt-0.5 shrink-0" />
                <span>
                    זו המחשה לימודית של רמזי החלטה. בפועל מודלים עובדים בחישובים מורכבים יותר, אבל הרעיון דומה:
                    ניסוח הפרומט משנה את הכוונה, את הסיכון ואת המסלול.
                </span>
            </div>
        </div>
    );
};
