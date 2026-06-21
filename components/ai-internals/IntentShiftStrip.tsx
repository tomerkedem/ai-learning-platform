"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MessageCircleQuestion, Search, Zap, ArrowRight } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent, IntentStage } from './types';

interface IntentShiftStripProps {
    /** השלב שמודגש כרגע, לפי הניסוח הנבחר. */
    activeStage: IntentStage;
}

// מיפוי סטטי: כל שלב כוונה -> תווית עברית, מושג אנגלי, גוון ואייקון.
const STAGES: { id: IntentStage; he: string; en: string; accent: Accent; icon: React.ReactNode }[] = [
    { id: 'question', he: 'שאלה', en: 'Question', accent: 'cyan', icon: <MessageCircleQuestion size={15} /> },
    { id: 'investigation', he: 'בדיקה', en: 'Investigation', accent: 'indigo', icon: <Search size={15} /> },
    { id: 'action', he: 'פעולה', en: 'Action', accent: 'rose', icon: <Zap size={15} /> },
];

/**
 * רצועת Intent Shift: מראה שאותו נושא משנה כוונה בין שלושת הניסוחים.
 * Same topic. Different intent. Different route. השלב הפעיל נדלק; השאר עמומים.
 */
export const IntentShiftStrip: React.FC<IntentShiftStripProps> = ({ activeStage }) => {
    const reduce = useReducedMotion();

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-xl p-4" dir="rtl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">שינוי כוונה</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500">Intent Shift</div>
                </div>

                {/* שלושת השלבים, בסדר קבוע: שאלה -> בדיקה -> פעולה */}
                <div className="flex items-center gap-2" dir="ltr">
                    {STAGES.map((stage, i) => {
                        const isActive = stage.id === activeStage;
                        const a = ACCENTS[stage.accent];
                        return (
                            <React.Fragment key={stage.id}>
                                <motion.div
                                    animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.96 }}
                                    transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${
                                        isActive
                                            ? `${a.border} ${a.bgSoft} ${a.text} ${a.glow}`
                                            : 'border-slate-700/60 bg-slate-800/40 text-slate-400'
                                    }`}
                                >
                                    {stage.icon}
                                    <span className="flex flex-col leading-none">
                                        <span className="text-xs font-bold">{stage.he}</span>
                                        <span className="text-[9px] font-medium uppercase tracking-wide opacity-60">{stage.en}</span>
                                    </span>
                                </motion.div>
                                {i < STAGES.length - 1 && (
                                    <ArrowRight size={14} className="shrink-0 text-slate-600" />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <p className="mt-3 text-center text-sm font-semibold text-slate-300 md:text-right">
                אותו נושא. כוונה אחרת. מסלול אחר.
                <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-wide text-slate-500" dir="ltr">
                    Same topic. Different intent. Different route.
                </span>
            </p>
        </div>
    );
};
