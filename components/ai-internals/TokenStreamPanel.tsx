"use client";

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Hash } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';
import { NEGATION_WORDS, type TypingStep } from '@/app/behind-the-scenes-ai/chapter-4/wordEngine';

interface TokenStreamPanelProps {
    step: TypingStep | null;
    accent: Accent;
}

const isNegation = (token: string) => NEGATION_WORDS.includes(token);

/**
 * Token Stream: הטקסט לא נכנס כגוש אחד. כל token נדלק בנפרד כשהמילה מושלמת.
 * מילת שלילה מסומנת בגוון אזהרה כדי לקשר ל-Negation Alert.
 */
export const TokenStreamPanel: React.FC<TokenStreamPanelProps> = ({ step, accent }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const tokens = step ? step.tokens : [];

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-3 flex items-center gap-2">
                <Hash size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">זרם הטוקנים</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Token Stream</div>
                </div>
            </div>

            {tokens.length === 0 ? (
                <p className="text-xs leading-relaxed text-slate-500">התחילו להקליד, וכל מילה תידלק כאן בנפרד.</p>
            ) : (
                <div className="flex flex-wrap gap-2" dir="rtl">
                    <AnimatePresence mode="popLayout">
                        {tokens.map((tok, i) => {
                            const neg = isNegation(tok);
                            return (
                                <motion.span
                                    key={`${tok}-${i}`}
                                    layout
                                    initial={reduce ? false : { opacity: 0, scale: 0.7, y: 6 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={reduce ? undefined : { opacity: 0, scale: 0.8 }}
                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 24, delay: i * 0.04 }}
                                    className={`rounded-lg border px-2.5 py-1 font-mono text-sm ${
                                        neg
                                            ? 'border-rose-500/50 bg-rose-500/15 text-rose-200'
                                            : `${a.border} ${a.bgSoft} text-slate-200`
                                    }`}
                                >
                                    {tok}
                                </motion.span>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};
