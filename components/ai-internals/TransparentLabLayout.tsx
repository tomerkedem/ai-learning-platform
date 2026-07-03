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

const STREAM_SLOTS = 5;
const STREAM_DUR = 4.4;

/** מחבר ויזואלי: טוקנים אמיתיים זורמים מהצ'אט אל המנוע (דסקטופ בלבד). */
const DataFlowConnector: React.FC<{ accent: Accent; tokens: string[]; isRtl: boolean }> = ({ accent, tokens, isRtl }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const hasTokens = tokens.length > 0;
    // כמה צ'יפים זורמים בפועל: לכל היותר STREAM_SLOTS, ולעולם לא יותר ממספר הטוקנים
    // שיש במשפט. כך הגל לא גולש בחזרה להתחלה ואותה מילה לא חוזרת על עצמה ברצף.
    const slotCount = Math.min(STREAM_SLOTS, tokens.length);

    return (
        <div className="hidden lg:flex flex-col items-center px-1">
            <span className="mb-2 text-[11px] font-mono uppercase tracking-widest text-slate-600 [writing-mode:vertical-rl] rotate-180">
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
                {hasTokens && !reduce && Array.from({ length: slotCount }).map((_, i) => {
                    const token = tokens[i];
                    return (
                        <motion.span
                            key={i}
                            className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-center text-[11px] font-mono ${a.border} ${a.bgSoft} ${a.text}`}
                            initial={{ top: '-8%', opacity: 0 }}
                            animate={{ top: ['-8%', '104%'], opacity: [0, 1, 1, 0] }}
                            transition={{ duration: STREAM_DUR, ease: 'easeIn', delay: i * (STREAM_DUR / slotCount) }}
                        >
                            {token}
                        </motion.span>
                    );
                })}

                {/* במצב reduced-motion: כמה צ'יפים סטטיים לאורך המסילה */}
                {hasTokens && reduce && tokens.slice(0, 3).map((token, i) => (
                    <span
                        key={i}
                        className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-center text-[11px] font-mono ${a.border} ${a.bgSoft} ${a.text}`}
                        style={{ top: `${20 + i * 30}%` }}
                    >
                        {token}
                    </span>
                ))}

                {/* חץ אל המנוע: מצביע אל הצד שבו יושב המנוע (RTL: מימין, LTR: משמאל) */}
                <ChevronLeft
                    className={`absolute top-1/2 ${isRtl ? 'right-0' : 'left-0'} ${a.text}`}
                    size={16}
                    style={{ transform: `translateY(-50%) ${isRtl ? 'rotate(180deg)' : ''}` }}
                />
            </div>
        </div>
    );
};

/**
 * פריסה דו-עמודתית למעבדה השקופה עם מחבר זרימה.
 * RTL: DOM = [chat, connector, engine] -> בדסקטופ chat מימין, engine משמאל.
 * במובייל (עמודה אחת): chat למעלה, engine אחריו (המחבר מוסתר).
 */
export const TransparentLabLayout: React.FC<TransparentLabLayoutProps> = ({ chat, engine, accent = 'cyan', tokens = [], dir = 'rtl' }) => {
    const reduce = useReducedMotion();
    const isRtl = dir === 'rtl';
    const a = ACCENTS[accent];
    const hasTokens = tokens.length > 0;
    // הצ'אט נכנס מהצד שאליו הוא נוחת (RTL: מימין, LTR: משמאל), והמנוע מהצד הנגדי.
    const chatX = isRtl ? 24 : -24;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4 lg:gap-3 items-stretch" dir={dir}>
            <motion.div
                initial={reduce ? false : { opacity: 0, x: chatX }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                {chat}
            </motion.div>

            {/* מחבר מובייל: בדסקטופ הזרימה אופקית (DataFlowConnector בעמודה השלישית),
                אבל במובייל הלוחות נערמים אנכית, ולכן כאן קו זרימה אנכי קצר עם חבילת-אור
                שנופלת אל המנוע - כדי שהסיבתיות "זורם אל המנוע" תשרוד גם בטלפון. */}
            <div className="relative flex h-12 items-center justify-center lg:hidden" aria-hidden>
                <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10" />
                {!reduce && hasTokens && (
                    <motion.span
                        key={tokens.join(' ')}
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

            <motion.div
                initial={reduce ? false : { opacity: 0, x: -chatX }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
                {engine}
            </motion.div>

            {/* key לפי הטוקנים: המחבר נטען מחדש בכל החלפת משפט/מצב, כך שפרץ הזרימה
                מתנגן פעם אחת ואז נעצר (במקום לולאה אינסופית). */}
            <DataFlowConnector key={tokens.join(' ')} accent={accent} tokens={tokens} isRtl={isRtl} />
        </div>
    );
};
