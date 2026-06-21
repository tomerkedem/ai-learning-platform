"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX, Lock } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent, RiskLevel } from './types';

interface RiskMeterProps {
    level: RiskLevel;
    /** האם נדרש אישור לפני פעולה (נדלק רק במסלול הפעולה). */
    approvalRequired?: boolean;
    /** טקסט הסבר קצר מתחת לכותרת. */
    helper?: string;
}

// מיפוי סטטי: רמת סיכון -> גוון, אחוז מילוי, תוויות (עברית/אנגלית) ואייקון.
const LEVEL: Record<RiskLevel, { accent: Accent; pct: number; he: string; en: string; icon: React.ReactNode }> = {
    low: { accent: 'cyan', pct: 33, he: 'נמוך', en: 'Low', icon: <ShieldCheck size={16} /> },
    medium: { accent: 'amber', pct: 66, he: 'בינוני', en: 'Medium', icon: <ShieldAlert size={16} /> },
    high: { accent: 'rose', pct: 100, he: 'גבוה', en: 'High', icon: <ShieldX size={16} /> },
};

const SCALE: RiskLevel[] = ['low', 'medium', 'high'];

/** מד סיכון ואחריות: מחוון אופקי Low / Medium / High + תווית אישור מותנית. */
export const RiskMeter: React.FC<RiskMeterProps> = ({ level, approvalRequired = false, helper }) => {
    const reduce = useReducedMotion();
    const s = LEVEL[level];
    const a = ACCENTS[s.accent];

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-3 flex items-center justify-between">
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">רמת סיכון ואחריות</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Risk and Responsibility</div>
                </div>
                <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${a.border} ${a.bgSoft} ${a.text}`}>
                    {s.icon}
                    <span className="text-xs font-bold">{s.he}</span>
                    <span className="text-[10px] font-medium uppercase opacity-60" dir="ltr">{s.en}</span>
                </div>
            </div>

            {helper && <p className="mb-4 text-xs leading-relaxed text-slate-400">{helper}</p>}

            {/* פס המד: מילוי דרך scaleX (transform) לשמירה על ביצועים */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800/80">
                <motion.div
                    key={level}
                    initial={reduce ? false : { scaleX: 0 }}
                    animate={{ scaleX: s.pct / 100 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ originX: 1 }}
                    className={`h-full rounded-full ${a.barGradient} ${a.glow}`}
                />
            </div>

            {/* תוויות סולם: עברית ראשית, אנגלית קטנה */}
            <div className="mt-2 flex justify-between">
                {SCALE.map((lvl) => {
                    const isCurrent = lvl === level;
                    return (
                        <span
                            key={lvl}
                            className={`flex flex-col items-center leading-none ${
                                isCurrent ? ACCENTS[LEVEL[lvl].accent].text : 'text-slate-600'
                            }`}
                        >
                            <span className="text-[11px] font-bold">{LEVEL[lvl].he}</span>
                            <span className="text-[9px] font-medium uppercase tracking-wide opacity-70" dir="ltr">{LEVEL[lvl].en}</span>
                        </span>
                    );
                })}
            </div>

            {/* תווית אישור מותנית - נכנסת עם spring כדי שתרגיש כהחלטה אחראית */}
            {approvalRequired && (
                <motion.div
                    initial={reduce ? false : { opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 18 }}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-500/50 bg-rose-900/15 px-3 py-2 text-rose-300"
                >
                    <Lock size={15} />
                    <span className="flex flex-col leading-none">
                        <span className="text-sm font-bold">דרוש אישור</span>
                        <span className="text-[10px] font-medium uppercase tracking-wide opacity-70" dir="ltr">Approval required</span>
                    </span>
                </motion.div>
            )}
        </div>
    );
};
