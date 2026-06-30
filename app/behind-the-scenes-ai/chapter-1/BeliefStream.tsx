"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

import type { Direction } from '@/i18n/config';

// ════════════════════ טיפוסים ושיתופים ════════════════════
// חמשת הערוצים שהמנוע הלימודי של פרק 1 מדרג. סדר קבוע => הפסים נערמים יציב
// ולא קופצים תוך כדי הסריקה.
export type LaneKey = 'notDelivered' | 'tracking' | 'system' | 'payment' | 'other';

export interface BeliefStep {
    word: string;
    /** הסתברות לכל ערוץ (0-100), מסתכמת ל-100. */
    dist: Record<LaneKey, number>;
}

/** סדר הערימה מלמעלה למטה. קבוע כדי שהפסים יישארו במקומם. */
export const LANE_ORDER: LaneKey[] = ['notDelivered', 'tracking', 'payment', 'system', 'other'];

/** תוויות הכוונות - תואמות ל-CHAT_RULES שב-mockEngine (אותן תוויות שהמעבדה הציגה תמיד). */
export const LANE_LABEL: Record<LaneKey, string> = {
    notDelivered: 'Package not delivered',
    tracking: 'Tracking question',
    system: 'System issue',
    payment: 'Payment issue',
    other: 'Other',
};

/** צבע פס לכל ערוץ (ערך מפורש כי SVG fill לא מקבל מחלקת Tailwind דינמית). */
export const LANE_COLOR: Record<LaneKey, string> = {
    notDelivered: '#22d3ee', // cyan
    tracking: '#34d399',     // emerald
    payment: '#fbbf24',      // amber
    system: '#c084fc',       // purple
    other: '#64748b',        // slate
};

/** מיפוי מהתווית האנגלית שהמנוע מחזיר אל מפתח הערוץ (למסלול הטקסט-החופשי). */
export const LABEL_TO_LANE: Record<string, LaneKey> = {
    'Package not delivered': 'notDelivered',
    'Tracking question': 'tracking',
    'System issue': 'system',
    'Payment issue': 'payment',
    'Other': 'other',
};

export type Confidence = 'High' | 'Medium' | 'Low';

export interface DistSummary {
    leader: LaneKey;
    top: number;
    margin: number;
    confidence: Confidence;
}

/** מסכם התפלגות: מי המוביל, הפער מהשני, ורמת הביטחון - אותם ספים כמו mockEngine. */
export function summarizeDist(dist: Record<LaneKey, number>): DistSummary {
    const sorted = LANE_ORDER.map((k) => [k, dist[k] ?? 0] as const).sort((a, b) => b[1] - a[1]);
    const top = sorted[0][1];
    const margin = top - (sorted[1]?.[1] ?? 0);
    const confidence: Confidence = margin >= 40 ? 'High' : margin >= 15 ? 'Medium' : 'Low';
    return { leader: sorted[0][0], top, margin, confidence };
}

// ════════════════════ הרכיב ════════════════════

interface BeliefStreamProps {
    steps: BeliefStep[];
    /** מיקום ראש הקריאה (אינדקס המילה הנוכחית). */
    head: number;
    dir: Direction;
    reduce: boolean;
    labels: {
        /** רמז קצר על קריאת הגרף. */
        streamHint: string;
        /** תווית "המוביל". */
        leader: string;
    };
}

const W = 1000;
const H = 320;

/**
 * "נהר הזמן": גרף-שטח מוערם שמצייר את כל מסע האמונה לאורך המשפט. ציר ה-x הוא
 * המילים (הזמן), והרוחב של כל פס הוא ההסתברות של אותה כוונה. ככל שראש הקריאה
 * מתקדם הגרף נחשף עד נקודת הסורק, וכך רואים את הפיקוד עובר מערוץ לערוץ - בלי
 * צורך לדמיין: שינוי הדעת מצויר כצורה שזורמת. הדגל מודע-כיוון (ב-RTL הזמן זורם
 * ימין->שמאל) ובטוח ל-reduced-motion (הציור סטטי; התנועה היא ראש הקריאה בלבד).
 */
export const BeliefStream: React.FC<BeliefStreamProps> = ({ steps, head, dir, reduce, labels }) => {
    const n = steps.length;
    const isRtl = dir === 'rtl';
    const vis = Math.min(Math.max(head, 0), Math.max(0, n - 1));

    const xAt = useMemo(() => {
        return (i: number) => {
            if (n <= 1) return isRtl ? W : 0;
            const t = i / (n - 1);
            return isRtl ? W - t * W : t * W;
        };
    }, [n, isRtl]);

    // פסי השטח: לכל ערוץ פוליגון מגבול עליון (i=0..vis) חזרה דרך הגבול התחתון.
    const bands = useMemo(() => {
        return LANE_ORDER.map((lane) => {
            const top: Array<[number, number]> = [];
            const bot: Array<[number, number]> = [];
            for (let i = 0; i <= vis; i++) {
                const dist = steps[i].dist;
                let above = 0;
                for (const k of LANE_ORDER) {
                    if (k === lane) break;
                    above += dist[k] ?? 0;
                }
                const val = dist[lane] ?? 0;
                const x = xAt(i);
                top.push([x, (above / 100) * H]);
                bot.push([x, ((above + val) / 100) * H]);
            }
            let d = '';
            top.forEach((p, idx) => { d += `${idx === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)} `; });
            for (let i = bot.length - 1; i >= 0; i--) d += `L${bot[i][0].toFixed(1)} ${bot[i][1].toFixed(1)} `;
            d += 'Z';
            return { lane, d };
        });
    }, [steps, vis, xAt]);

    const headX = xAt(vis);
    const curDist = steps[vis]?.dist;
    const prevDist = vis > 0 ? steps[vis - 1]?.dist : undefined;
    const leader = curDist ? summarizeDist(curDist).leader : 'other';

    return (
        <div dir={dir}>
            <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Belief stream</span>
                <span className="text-[11px] text-slate-500">{labels.streamHint}</span>
            </div>

            {/* הגרף הזורם */}
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/60">
                <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-48 w-full sm:h-56" role="img" aria-label={labels.streamHint}>
                    {bands.map(({ lane, d }) => (
                        <motion.path
                            key={lane}
                            d={d}
                            fill={LANE_COLOR[lane]}
                            initial={false}
                            animate={{ opacity: lane === leader ? 0.92 : 0.34 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                        />
                    ))}
                    {/* קו ראש הקריאה */}
                    <motion.line
                        x1={headX} x2={headX} y1={0} y2={H}
                        stroke="rgba(255,255,255,0.85)" strokeWidth={2}
                        initial={false}
                        animate={{ x1: headX, x2: headX }}
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30 }}
                    />
                </svg>
            </div>

            {/* מקרא "עכשיו": כל ערוץ עם הצבע, ה-% הנוכחי, וחץ שינוי מהמילה הקודמת. המוביל מודגש. */}
            <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {LANE_ORDER.map((lane) => {
                    const value = curDist?.[lane] ?? 0;
                    const prev = prevDist?.[lane];
                    const delta = prev === undefined ? 0 : value - prev;
                    const isLead = lane === leader;
                    return (
                        <div
                            key={lane}
                            className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 ${isLead ? 'border-white/25 bg-white/[0.06]' : 'border-white/5 bg-slate-900/40'}`}
                        >
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: LANE_COLOR[lane] }} />
                            <span className={`flex-1 truncate text-xs ${isLead ? 'font-bold text-slate-100' : 'text-slate-400'}`}>
                                {LANE_LABEL[lane]}
                                {isLead && <span className="ms-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">{labels.leader}</span>}
                            </span>
                            {delta !== 0 && (
                                <span className={`text-[10px] font-bold ${delta > 0 ? 'text-emerald-400' : 'text-slate-500'}`} dir="ltr" aria-hidden>
                                    {delta > 0 ? '▲' : '▼'}{Math.abs(delta)}
                                </span>
                            )}
                            <span className={`w-9 shrink-0 text-end font-mono text-xs font-black tabular-nums ${isLead ? 'text-slate-100' : 'text-slate-400'}`} dir="ltr">
                                {value}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
