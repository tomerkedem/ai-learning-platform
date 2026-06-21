"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';

interface TransparentLabLayoutProps {
    /** ממשק הצ'אט (מימין בדסקטופ, ראשון במובייל). */
    chat: React.ReactNode;
    /** המנוע השקוף (משמאל בדסקטופ, שני במובייל). */
    engine: React.ReactNode;
    accent?: Accent;
}

/** מחבר ויזואלי שמראה זרימת דאטה מהצ'אט אל המנוע (דסקטופ בלבד). */
const DataFlowConnector: React.FC<{ accent: Accent }> = ({ accent }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    return (
        <div className="hidden lg:flex flex-col items-center justify-center gap-2 px-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-600 [writing-mode:vertical-rl] rotate-180">
                data
            </span>
            <div className="relative h-24 w-6 flex items-center justify-center">
                <div className="absolute h-full w-px bg-white/10" />
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className={`absolute h-1.5 w-1.5 rounded-full ${a.dot}`}
                        animate={reduce ? undefined : { y: [-40, 40], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
                    />
                ))}
                <ChevronLeft className={`relative ${a.text} rotate-90`} size={16} />
            </div>
        </div>
    );
};

/**
 * פריסה דו-עמודתית למעבדה השקופה עם מחבר זרימה.
 * RTL: DOM = [chat, connector, engine] -> בדסקטופ chat מימין, engine משמאל.
 * במובייל (עמודה אחת): chat למעלה, engine אחריו (המחבר מוסתר).
 */
export const TransparentLabLayout: React.FC<TransparentLabLayoutProps> = ({ chat, engine, accent = 'cyan' }) => {
    const reduce = useReducedMotion();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-3 items-stretch" dir="rtl">
            <motion.div
                initial={reduce ? false : { opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                {chat}
            </motion.div>

            <DataFlowConnector accent={accent} />

            <motion.div
                initial={reduce ? false : { opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
                {engine}
            </motion.div>
        </div>
    );
};
