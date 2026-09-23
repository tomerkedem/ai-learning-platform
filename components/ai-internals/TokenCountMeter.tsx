"use client";

import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
import { Hash, Info } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';
import { useChapter3Lab } from '@/app/(course)/behind-the-scenes-ai/chapter-3/labContent';
import { useT } from '@/i18n/useT';

interface TokenCountMeterProps {
    count: number;
    accent: Accent;
}

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
    const reduce = useReducedMotion();
    const mv = useMotionValue(0);
    const rounded = useTransform(mv, (v) => `${Math.round(v)}`);
    useEffect(() => {
        if (reduce) { mv.set(value); return; }
        const controls = animate(mv, value, { duration: 0.4, ease: 'easeOut' });
        return () => controls.stop();
    }, [value, mv, reduce]);
    return <motion.span dir="ltr">{rounded}</motion.span>;
};

/**
 * Token Count Meter: כמה טוקנים יש בקלט. עולה כשמוסיפים מילים. המסר -
 * AI לא סופר מילים, הוא עובד עם טוקנים (כולל פיסוק כיחידות נפרדות).
 */
export const TokenCountMeter: React.FC<TokenCountMeterProps> = ({ count, accent }) => {
    const a = ACCENTS[accent];
    const { count: copy } = useChapter3Lab();
    const { dir } = useT();
    return (
        <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
            <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Hash size={16} className={a.text} />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-[var(--bts-text-body)]">{copy.title}</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">{copy.titleEn}</div>
                    </div>
                </div>
                <div className={`text-3xl font-black tabular-nums ${a.text}`}>
                    <AnimatedNumber value={count} />
                </div>
            </div>

            <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-[var(--bts-text-faint)]">
                <Info size={13} className="mt-0.5 shrink-0" />
                {copy.note}
            </p>
        </div>
    );
};
