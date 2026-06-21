"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Gauge } from 'lucide-react';
import { ACCENTS } from './accents';
import { BilingualLabel } from './BilingualLabel';
import type { Accent, ConfidenceLevel } from './types';

interface ConfidenceMarginCardProps {
    topProbability: number;
    secondProbability: number;
    margin: number;
    confidence: ConfidenceLevel;
}

// מיפוי סטטי: רמת ביטחון -> תוויות וגוון. הצבעים נגזרים מ-ACCENTS.
const CONFIDENCE_INFO: Record<ConfidenceLevel, {
    he: string; en: string; accent: Accent;
}> = {
    high: { he: 'ביטחון גבוה', en: 'High', accent: 'emerald' },
    medium: { he: 'ביטחון בינוני', en: 'Medium', accent: 'amber' },
    low: { he: 'ביטחון נמוך', en: 'Low', accent: 'rose' },
};

/**
 * פער הביטחון (Confidence Margin): מראה את ההסתברות הראשונה, השנייה,
 * הפער ביניהן ורמת הביטחון. הרעיון המרכזי - הפער חשוב יותר מהמספר הראשון לבדו.
 * confidence_margin = top_probability - second_probability
 */
export const ConfidenceMarginCard: React.FC<ConfidenceMarginCardProps> = ({
    topProbability,
    secondProbability,
    margin,
    confidence,
}) => {
    const reduce = useReducedMotion();
    const info = CONFIDENCE_INFO[confidence];
    const a = ACCENTS[info.accent];

    return (
        <div className="flex h-full flex-col rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Gauge size={16} className={a.text} />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">פער הביטחון</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Confidence Margin</div>
                    </div>
                </div>
                <BilingualLabel variant="badge" he={info.he} en={info.en} accent={info.accent} />
            </div>

            {/* שלוש מדידות: ראשונה, שנייה, פער */}
            <div className="mb-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-2">
                    <div className="text-[9px] font-medium uppercase tracking-wider text-slate-500" dir="ltr">Top</div>
                    <div className="text-lg font-black tabular-nums text-slate-200" dir="ltr">{topProbability}%</div>
                </div>
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-2">
                    <div className="text-[9px] font-medium uppercase tracking-wider text-slate-500" dir="ltr">Second</div>
                    <div className="text-lg font-black tabular-nums text-slate-400" dir="ltr">{secondProbability}%</div>
                </div>
                <div className={`rounded-xl border p-2 ${a.border} ${a.bgSoft}`}>
                    <div className="text-[9px] font-medium uppercase tracking-wider text-slate-500" dir="ltr">Margin</div>
                    <div className={`text-lg font-black tabular-nums ${a.text}`} dir="ltr">{margin}%</div>
                </div>
            </div>

            {/* פס שמראה כמה גדול הפער ביחס לסקאלה מלאה */}
            <div className="mb-3">
                <div className="mb-1 flex items-center justify-between text-[10px] text-slate-500">
                    <span>גודל הפער</span>
                    <span dir="ltr">{margin}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80">
                    <motion.div
                        initial={reduce ? false : { width: 0 }}
                        animate={{ width: `${Math.max(0, Math.min(100, margin))}%` }}
                        transition={reduce ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className={`h-full rounded-full ${a.barGradient}`}
                    />
                </div>
            </div>

            <p className="mt-auto text-xs leading-relaxed text-slate-400">
                הפער בין האפשרות הראשונה לשנייה חשוב יותר מהמספר הראשון לבדו. פער גדול אומר מוביל ברור, פער קטן אומר התלבטות.
            </p>
        </div>
    );
};
