"use client";

import React from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';

interface EnginePanelProps {
    title: string;
    subtitle?: string;
    accent?: Accent;
    /** משתנה הפעלה: שינוי שלו מנגן מחדש את רצף ההידלקות של המנוע. */
    replayKey?: string | number;
    children: React.ReactNode;
}

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.085, delayChildren: 0.12 } },
};

const item: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.97, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * מעטפת ה"מנוע השקוף": כותרת + רצף כרטיסים שנדלקים אחד-אחרי-השני.
 * אחריות יחידה: לארגן ולהנפיש את תצוגת תוכן המנוע (children).
 * אין כאן לוגיקת AI ואין נתונים ספציפיים לפרק.
 */
export const EnginePanel: React.FC<EnginePanelProps> = ({
    title,
    subtitle,
    accent = 'cyan',
    replayKey = 'static',
    children,
}) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const cards = React.Children.toArray(children);

    return (
        <div className={`relative flex flex-col rounded-[2rem] border ${a.border} bg-slate-950/70 ${a.glow} h-[640px] overflow-hidden`} dir="rtl">
            {/* רקע גריד עדין */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '22px 22px' }}
            />
            {/* הילת פינה */}
            <div className={`pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full blur-[70px] ${a.bgSoft}`} />

            {/* סריקת x-ray שנעה כשהמנוע מתעדכן */}
            {!reduce && (
                <motion.div
                    key={`scan-${replayKey}`}
                    initial={{ y: '-20%', opacity: 0 }}
                    animate={{ y: '120%', opacity: [0, 0.7, 0] }}
                    transition={{ duration: 1.1, ease: 'easeInOut' }}
                    className={`pointer-events-none absolute inset-x-0 h-24 ${a.bgSoft} blur-2xl`}
                />
            )}

            {/* כותרת המנוע */}
            <div className="relative flex items-center gap-3 p-5 border-b border-white/10 shrink-0">
                <div className={`p-2 rounded-xl bg-slate-900 border border-white/10 ${a.text}`}>
                    <motion.div
                        animate={reduce ? undefined : { rotate: [0, 8, -8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Cpu size={18} />
                    </motion.div>
                </div>
                <div className="overflow-hidden">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Transparent Engine</div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={title}
                            initial={reduce ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? undefined : { opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className={`font-black text-lg ${a.text}`}>{title}</div>
                            {subtitle && <div className="text-xs text-slate-400">{subtitle}</div>}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* תוכן המנוע - נדלק שלב-שלב */}
            <div className="relative flex-1 overflow-y-auto custom-scrollbar p-5">
                <motion.div
                    key={replayKey}
                    variants={container}
                    initial={reduce ? false : 'hidden'}
                    animate="show"
                    className="space-y-6"
                >
                    {cards.map((card, i) => (
                        <motion.div key={i} variants={reduce ? undefined : item}>
                            {card}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
