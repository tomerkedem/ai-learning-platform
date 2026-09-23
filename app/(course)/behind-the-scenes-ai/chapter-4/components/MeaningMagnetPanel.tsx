"use client";

// MeaningMagnetPanel - כוחות המשמעות שמושכים את המשפט.
// ──────────────────────────────────────────────────────────────────────────
// אורב מרכזי (המשפט) מוקף מגנטים סמנטיים. כל מגנט מושך לפי ערך הממד שלו בפרופיל,
// והווקטור הנטו הוא סכום המשיכות. הזוויות מגיעות מ-MAGNETS, ולכן כיוון הנטו מהדהד
// את הרבע שאליו המפה ממקמת. אין ספריית פיזיקה, רק טריגונומטריה. ל-reduced-motion
// החץ והאורב סטטיים, וערכי המשיכה מוצגים כמספרים.

import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import type { Chapter4LabDict } from '../labContent';
import { MAGNETS, magnetPull, netVector, DIM_STYLE, type Profile } from '../embeddingEngine';

interface MeaningMagnetPanelProps {
    profile: Profile;
    labels: Chapter4LabDict['magnets'];
    title: string;
    dir: 'rtl' | 'ltr';
}

const CENTER = 50;
// רדיוס הטבעת נמשך פנימה כדי שצ'יפי הזכוכית של התוויות לא ייחתכו בקצוות.
const RING = 30;

/** זווית במעלות לנקודה ב-viewBox, עם היפוך ציר Y למסך (מעלה = למעלה). */
const onRing = (angleDeg: number, radius: number) => {
    const a = (angleDeg * Math.PI) / 180;
    return { x: CENTER + radius * Math.cos(a), y: CENTER - radius * Math.sin(a) };
};

export const MeaningMagnetPanel: React.FC<MeaningMagnetPanelProps> = ({ profile, labels, title, dir }) => {
    const reduce = useReducedMotion();

    const pulls = useMemo(
        () =>
            MAGNETS.map((m) => ({
                magnet: m,
                pull: magnetPull(profile, m),
                pos: onRing(m.angle, RING),
            })),
        [profile],
    );

    const net = useMemo(() => netVector(profile), [profile]);

    const strongest = useMemo(() => {
        const top = [...pulls].sort((a, b) => b.pull - a.pull).slice(0, 2);
        return new Set(top.filter((p) => p.pull > 0.2).map((p) => p.magnet.id));
    }, [pulls]);

    // קצה החץ הנטו, מנורמל לרדיוס הטבעת.
    const tipRadius = (RING - 7) * Math.min(1, net.length / 2.4);
    const tip = onRing(net.angle, tipRadius);

    return (
        <div dir={dir} className="text-start">
            <div className="mb-2 flex items-center gap-2">
                <span className="text-base font-bold text-slate-100">{title}</span>
            </div>

            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                    <defs>
                        <marker id="mmp-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L6,3 L0,6 Z" className="fill-violet-200" />
                        </marker>
                    </defs>

                    {/* קרני המשיכה: עובי ושקיפות לפי עוצמת המשיכה */}
                    {pulls.map(({ magnet, pull, pos }) => (
                        <line
                            key={`beam-${magnet.id}`}
                            x1={CENTER}
                            y1={CENTER}
                            x2={pos.x}
                            y2={pos.y}
                            className={`${DIM_STYLE[magnet.dim].text} stroke-current`}
                            strokeWidth={0.4 + pull * 1.8}
                            opacity={0.12 + pull * 0.5}
                            strokeLinecap="round"
                        />
                    ))}

                    {/* החץ הנטו */}
                    <motion.line
                        x1={CENTER}
                        y1={CENTER}
                        initial={false}
                        animate={{ x2: tip.x, y2: tip.y }}
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 18 }}
                        className="stroke-violet-200"
                        strokeWidth={1.1}
                        strokeLinecap="round"
                        markerEnd="url(#mmp-arrow)"
                    />

                    {/* האורב המרכזי: המשפט */}
                    {!reduce && (
                        <motion.circle
                            cx={CENTER}
                            cy={CENTER}
                            r={5}
                            className="fill-none stroke-white/40"
                            strokeWidth={0.5}
                            animate={{ r: [5, 7, 5], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    )}
                    <circle cx={CENTER} cy={CENTER} r={4} className="fill-white/90" />
                    <circle cx={CENTER} cy={CENTER} r={2.2} className="fill-violet-400" />
                </svg>

                {/* תוויות מגנט כצ'יפ זכוכית קריא: מילה קצרה ואחוז משיכה. צבע הממד מסמן
                    את החזקים, הרקע הכהה נותן ניגודיות, וזוהר עדין מדגיש את המובילים.
                    ממוקמות פיזית כדי לא להתהפך, הטקסט עוקב אחרי dir. */}
                {pulls.map(({ magnet, pull, pos }) => {
                    const isTop = strongest.has(magnet.id);
                    const s = DIM_STYLE[magnet.dim];
                    return (
                        <div
                            key={`label-${magnet.id}`}
                            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        >
                            <div
                                className={`flex flex-col items-center rounded-xl border px-2 py-1 leading-tight backdrop-blur-sm ${
                                    isTop
                                        ? `${s.border} ${s.text} bg-slate-950/90 shadow-[0_0_16px_-4px_currentColor]`
                                        : 'border-white/15 bg-slate-950/80 text-slate-100'
                                }`}
                            >
                                <span className="flex items-center gap-1 whitespace-nowrap text-[11px] font-bold">
                                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`} />
                                    {labels[magnet.id]}
                                </span>
                                <span className="font-mono text-[9px] opacity-70" dir="ltr">
                                    {Math.round(pull * 100)}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
