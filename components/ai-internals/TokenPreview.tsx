"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ACCENTS } from './accents';
import type { Accent } from './types';

interface TokenPreviewProps {
    tokens: string[];
    accent?: Accent;
}

/** מציגה רצף טוקנים כצ'יפים עם הופעה מדורגת. אחריות יחידה: תצוגת טוקנים. */
export const TokenPreview: React.FC<TokenPreviewProps> = ({ tokens, accent = 'cyan' }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];

    if (tokens.length === 0) {
        return <div className="text-xs text-slate-500" dir="rtl">אין טוקנים.</div>;
    }

    return (
        <div className="flex flex-wrap gap-2" dir="rtl">
            {tokens.map((token, i) => (
                <motion.span
                    key={`${token}-${i}`}
                    initial={reduce ? false : { opacity: 0, y: 8, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, delay: reduce ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono border bg-slate-900/60 ${a.border} ${a.text}`}
                >
                    {token}
                </motion.span>
            ))}
        </div>
    );
};
