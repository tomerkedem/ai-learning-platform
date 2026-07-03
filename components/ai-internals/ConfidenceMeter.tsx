"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Gauge } from 'lucide-react';
import { ACCENTS } from './accents';
import { DUR, EASE } from './motionTokens';
import type { Accent } from './types';
import { useT } from '@/i18n/useT';

type Level = 'High' | 'Medium' | 'Low';

interface ConfidenceMeterProps {
    level: Level;
}

// מבנה לא תלוי-שפה (אחוז, גוון). התווית המתורגמת מגיעה מהמילון (aiInternals).
const LEVEL: Record<Level, { pct: number; accent: Accent }> = {
    High: { pct: 100, accent: 'emerald' },
    Medium: { pct: 62, accent: 'amber' },
    Low: { pct: 30, accent: 'rose' },
};

/** מד ביטחון סמנטי עם מילוי מונפש. אחריות יחידה: הצגת רמת ביטחון. */
export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ level }) => {
    const reduce = useReducedMotion();
    const { t, dir } = useT();
    const { pct, accent } = LEVEL[level];
    const a = ACCENTS[accent];
    // תוויות הרמה מהמילון (תלוי-שפה). הערך המרכזי מוצג בשפת הלומד; המונח "Confidence"
    // נשאר כ-eyebrow אנגלי, עקבי עם תגי-המונח האחרים במנוע (Logits, Decoding).
    const lv = t.behindAi.aiInternals.confidenceMeter.levels;
    const label = lv[level.toLowerCase() as 'high' | 'medium' | 'low'];

    return (
        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 text-start" dir={dir}>
            <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <Gauge size={13} /> Confidence
                </div>
                <span className={`text-lg font-black ${a.text}`}>{label}</span>
            </div>

            <div className="relative h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                    key={level}
                    initial={reduce ? false : { width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: DUR.data, ease: EASE.out }}
                    className={`h-full rounded-full ${a.barGradient} ${a.glow}`}
                />
                {/* סמני סף */}
                <div className="absolute inset-0 flex justify-between px-[33%] pointer-events-none">
                    <div className="w-px h-full bg-slate-950/60" />
                    <div className="w-px h-full bg-slate-950/60" />
                </div>
            </div>

            <div className="flex justify-between mt-2 text-[13px] font-bold text-slate-500">
                <span>{lv.low}</span>
                <span>{lv.medium}</span>
                <span>{lv.high}</span>
            </div>
        </div>
    );
};
