"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';

interface TransparentLabLayoutProps {
    /** ממשק הצ'אט (ב-RTL מימין, ב-LTR משמאל; ראשון במובייל). */
    chat: React.ReactNode;
    /** המנוע השקוף (ב-RTL משמאל, ב-LTR מימין; שני במובייל). */
    engine: React.ReactNode;
    accent?: Accent;
    /** הטוקנים שזורמים פיזית מהצ'אט אל המנוע (דסקטופ בלבד). */
    tokens?: string[];
    /**
     * כיוון הפריסה. ברירת מחדל 'rtl' (תואם את הבסיס העברי). ב-LTR סדר הלוחות מתהפך
     * לוגית: הצ'אט עובר לשמאל והמנוע השקוף לימין, לזרימת קריאה טבעית.
     */
    dir?: 'rtl' | 'ltr';
}

const STREAM_SLOTS = 3;
const STREAM_DUR = 1.8;

/** מחבר ויזואלי יחיד: אנכי במובייל ואופקי, תלוי כיוון, בין שני הפאנלים בדסקטופ. */
const DataFlowConnector: React.FC<{ accent: Accent; tokens: string[]; isRtl: boolean }> = ({ accent, tokens, isRtl }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const hasTokens = tokens.length > 0;
    const slotCount = Math.min(STREAM_SLOTS, tokens.length);
    const desktopStart = isRtl ? '105%' : '-5%';
    const desktopEnd = isRtl ? '-5%' : '105%';

    return (
        <div data-transparent-lab-connector className="relative flex h-12 min-w-0 items-center justify-center lg:h-auto lg:min-h-[220px] lg:w-14" aria-hidden>
            {/* מובייל: ה-DOM והזרימה החזותית ממשיכים מלמעלה למטה. */}
            <div className="absolute inset-0 flex items-center justify-center lg:hidden">
                <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10" />
                {!reduce && hasTokens && (
                    <motion.span
                        className={`absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full ${a.solid}`}
                        initial={{ top: '-10%', opacity: 0 }}
                        animate={{ top: ['-10%', '110%'], opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 0.9, ease: 'easeIn' }}
                    />
                )}
                <span className={`relative flex items-center justify-center rounded-full border ${a.border} ${a.bgSoft} ${a.text} p-1`}>
                    <ChevronDown size={14} />
                </span>
            </div>

            {/* דסקטופ: המחבר יושב בעמודה האמצעית וזורם מה-Chat אל ה-Engine. */}
            <div className="relative hidden h-full min-h-[220px] w-14 items-center justify-center lg:flex">
                <span className="absolute top-[calc(50%-2.25rem)] font-mono text-[10px] uppercase tracking-widest text-slate-600">tokens</span>
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/10" />
                {hasTokens && !reduce && Array.from({ length: slotCount }).map((_, i) => (
                    <motion.span
                        key={`${tokens[i]}-${i}`}
                        className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-center font-mono text-[10px] ${a.border} ${a.bgSoft} ${a.text}`}
                        initial={{ left: desktopStart, opacity: 0 }}
                        animate={{ left: desktopEnd, opacity: [0, 1, 1, 0] }}
                        transition={{ duration: STREAM_DUR, ease: 'easeInOut', delay: i * 0.42 }}
                    >
                        {tokens[i]}
                    </motion.span>
                ))}
                {hasTokens && reduce && (
                    <span className={`rounded-md border px-1.5 py-0.5 font-mono text-[10px] ${a.border} ${a.bgSoft} ${a.text}`}>
                        {tokens[0]}
                    </span>
                )}
                <ChevronLeft
                    className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-0' : 'right-0 rotate-180'} ${a.text}`}
                    size={16}
                />
            </div>
        </div>
    );
};

/**
 * פריסה דו-עמודתית למעבדה השקופה עם מחבר זרימה.
 * RTL: DOM = [chat, connector, engine] -> בדסקטופ chat מימין, engine משמאל.
 * במובייל (עמודה אחת): chat למעלה, מחבר אנכי, ואז engine.
 */
export const TransparentLabLayout: React.FC<TransparentLabLayoutProps> = ({ chat, engine, accent = 'cyan', tokens = [], dir = 'rtl' }) => {
    const reduce = useReducedMotion();
    const isRtl = dir === 'rtl';
    // הצ'אט נכנס מהצד שאליו הוא נוחת (RTL: מימין, LTR: משמאל), והמנוע מהצד הנגדי.
    const chatX = isRtl ? 24 : -24;

    return (
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-3" dir={dir}>
            <motion.div
                data-transparent-lab-chat
                initial={reduce ? false : { opacity: 0, x: chatX }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                {chat}
            </motion.div>

            {/* רכיב יחיד באמצע שומר גם על סדר DOM סמנטי: Chat, connector, Engine. */}
            <DataFlowConnector key={tokens.join(' ')} accent={accent} tokens={tokens} isRtl={isRtl} />

            <motion.div
                data-transparent-lab-engine
                initial={reduce ? false : { opacity: 0, x: -chatX }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
                {engine}
            </motion.div>

            {/* במובייל פותחים את פאנל המנוע לגובה התוכן ומבטלים את הגלילה הפנימית שלו.
                כך גלילת העמוד היא הציר היחיד; בדסקטופ נשמרים גובה ו-scroll עצמאיים. */}
            <style>{`
                @media (max-width: 1023px) {
                    [data-transparent-lab-engine] [class~="h-[640px]"] {
                        height: auto !important;
                        min-height: 0 !important;
                    }
                    [data-transparent-lab-engine] .custom-scrollbar {
                        overflow-y: visible !important;
                    }
                }
            `}</style>
        </div>
    );
};
