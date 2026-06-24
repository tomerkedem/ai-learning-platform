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
    /** הטוקנים שזורמים פיזית מהצ'אט אל המנוע (דסקטופ בלבד). */
    tokens?: string[];
}

const STREAM_SLOTS = 5;
const STREAM_DUR = 2.8;

/** מחבר ויזואלי: טוקנים אמיתיים זורמים מהצ'אט אל המנוע (דסקטופ בלבד). */
const DataFlowConnector: React.FC<{ accent: Accent; tokens: string[] }> = ({ accent, tokens }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const hasTokens = tokens.length > 0;

    return (
        <div className="hidden lg:flex flex-col items-center px-1">
            <span className="mb-2 text-[9px] font-mono uppercase tracking-widest text-slate-600 [writing-mode:vertical-rl] rotate-180">
                tokens
            </span>
            <div className="relative w-14 flex-1 min-h-[220px]">
                {/* פס המסילה */}
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />

                {/* פולס זוהר שזורם במורד המסילה - פעם אחת בכל החלפת משפט, ואז דועך */}
                {!reduce && hasTokens && (
                    <motion.div
                        aria-hidden
                        className={`absolute left-1/2 w-px -translate-x-1/2 ${a.solid}`}
                        style={{ height: '28%' }}
                        initial={{ top: '-28%', opacity: 0 }}
                        animate={{ top: '110%', opacity: [0, 1, 1, 0] }}
                        transition={{ duration: STREAM_DUR / 1.4, ease: 'linear' }}
                    />
                )}

                {/* צ'יפים של טוקנים אמיתיים, זורמים מהצ'אט (למעלה) אל המנוע (למטה).
                    גל אחד בכל החלפת משפט (ה-key מבחוץ מנגן אותו מחדש), ואז נעצר. */}
                {hasTokens && !reduce && Array.from({ length: STREAM_SLOTS }).map((_, i) => {
                    const token = tokens[i % tokens.length];
                    return (
                        <motion.span
                            key={i}
                            className={`absolute left-1/2 max-w-[3.25rem] -translate-x-1/2 truncate rounded-md border px-1.5 py-0.5 text-center text-[9px] font-mono ${a.border} ${a.bgSoft} ${a.text}`}
                            initial={{ top: '-8%', opacity: 0 }}
                            animate={{ top: ['-8%', '104%'], opacity: [0, 1, 1, 0] }}
                            transition={{ duration: STREAM_DUR, ease: 'easeIn', delay: i * (STREAM_DUR / STREAM_SLOTS) }}
                        >
                            {token}
                        </motion.span>
                    );
                })}

                {/* במצב reduced-motion: כמה צ'יפים סטטיים לאורך המסילה */}
                {hasTokens && reduce && tokens.slice(0, 3).map((token, i) => (
                    <span
                        key={i}
                        className={`absolute left-1/2 max-w-[3.25rem] -translate-x-1/2 truncate rounded-md border px-1.5 py-0.5 text-center text-[9px] font-mono ${a.border} ${a.bgSoft} ${a.text}`}
                        style={{ top: `${20 + i * 30}%` }}
                    >
                        {token}
                    </span>
                ))}

                {/* חץ אל המנוע (מימין למחבר) */}
                <ChevronLeft className={`absolute top-1/2 right-0 ${a.text}`} size={16} style={{ transform: 'translateY(-50%) rotate(180deg)' }} />
            </div>
        </div>
    );
};

/**
 * פריסה דו-עמודתית למעבדה השקופה עם מחבר זרימה.
 * RTL: DOM = [chat, connector, engine] -> בדסקטופ chat מימין, engine משמאל.
 * במובייל (עמודה אחת): chat למעלה, engine אחריו (המחבר מוסתר).
 */
export const TransparentLabLayout: React.FC<TransparentLabLayoutProps> = ({ chat, engine, accent = 'cyan', tokens = [] }) => {
    const reduce = useReducedMotion();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4 lg:gap-3 items-stretch" dir="rtl">
            <motion.div
                initial={reduce ? false : { opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                {chat}
            </motion.div>

            <motion.div
                initial={reduce ? false : { opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
                {engine}
            </motion.div>

            {/* key לפי הטוקנים: המחבר נטען מחדש בכל החלפת משפט/מצב, כך שפרץ הזרימה
                מתנגן פעם אחת ואז נעצר (במקום לולאה אינסופית). */}
            <DataFlowConnector key={tokens.join(' ')} accent={accent} tokens={tokens} />
        </div>
    );
};
