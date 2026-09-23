"use client";

// SemanticCardMap - מפת כרטיסים סמנטיים למשפטים (פרק 4).
// ──────────────────────────────────────────────────────────────────────────
// במקום נקודות אנונימיות, כל משפט הוא כרטיס זכוכית קומפקטי: אייקון, תווית קצרה
// ושבבי משמעות. המשפט הנבחר במרכז, וסביבו שלושה כרטיסים בקווי קשר זוהרים: הכי קרוב
// (קרוב), קשור אבל שונה (אמצע), רחוק יותר (רחוק). הקווים והתוויות עונים חזותית: מה
// קרוב למה, מה רחוק, ולמה. הטקסט המלא של המשפטים יושב מחוץ למפה, בפאנל הצד.
//
// reduced-motion: בלי ריחוף, הכרטיסים מתחלפים מיד. עומק וזוהר סטטיים.

import React from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface SemanticCardData {
    id: string;
    shortLabel: string;
    icon: LucideIcon;
    chips: string[];
}

type Tier = 'closest' | 'related' | 'far';

interface RelationCard {
    card: SemanticCardData;
    tag: string;
    tier: Tier;
}

interface SemanticCardMapProps {
    selected: SemanticCardData;
    relations: RelationCard[];
    onSelect: (id: string) => void;
    dir: 'rtl' | 'ltr';
}

// מיקומים מוסטים פנימה מהשוליים, כך שלכרטיסים יש שוליים נדיבים בתוך הבד.
const CENTER = { x: 0.5, y: 0.5 };
const SLOTS: Record<Tier, { x: number; y: number }> = {
    closest: { x: 0.5, y: 0.21 },
    related: { x: 0.76, y: 0.79 },
    far: { x: 0.24, y: 0.79 },
};

const TIER: Record<Tier, { ring: string; tag: string; icon: string }> = {
    closest: { ring: 'border-emerald-300/55', tag: 'border-emerald-400/40 bg-emerald-900/30 text-emerald-100', icon: 'text-emerald-300' },
    related: { ring: 'border-violet-300/55', tag: 'border-violet-400/40 bg-violet-900/30 text-violet-100', icon: 'text-violet-300' },
    far: { ring: 'border-slate-500/45', tag: 'border-slate-500/40 bg-slate-800/40 text-slate-300', icon: 'text-slate-300' },
};

// צבעי קרני האנרגיה (gradient) מהמרכז אל כל כרטיס. תואמים את שפת הצבע של הדרגות.
const BEAM: Record<Tier, string> = {
    closest: '#34d399',
    related: '#a78bfa',
    far: '#94a3b8',
};

const vb = (v: number) => v * 100;

const Card: React.FC<{
    data: SemanticCardData;
    pos: { x: number; y: number };
    accentRing: string;
    iconColor: string;
    tag?: string;
    tagClass?: string;
    onClick?: () => void;
    reduce: boolean;
}> = ({ data, pos, accentRing, iconColor, tag, tagClass, onClick, reduce }) => {
    const Icon = data.icon;
    const inner = (
        <>
            {tag && <span className={`mb-2.5 inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold ${tagClass}`}>{tag}</span>}
            <div className="flex items-center gap-2">
                <Icon size={16} className={`shrink-0 ${iconColor}`} />
                <span className="truncate text-[13px] font-bold text-slate-100">{data.shortLabel}</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
                {data.chips.map((c) => (
                    <span key={c} className="rounded-md border border-white/10 bg-slate-950/50 px-1.5 py-0.5 text-[10px] font-medium text-slate-300">
                        {c}
                    </span>
                ))}
            </div>
        </>
    );
    const cardCls = `flex min-h-[8.5rem] w-[7rem] flex-col justify-center rounded-2xl border bg-slate-900/85 px-3 py-4 text-start backdrop-blur-sm sm:w-[7.5rem] ${accentRing}`;
    return (
        <div className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${vb(pos.x)}%`, top: `${vb(pos.y)}%` }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={data.id}
                    initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.94 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                >
                    {onClick ? (
                        <button type="button" onClick={onClick} aria-label={data.shortLabel} className={`${cardCls} transition-colors hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60`}>
                            {inner}
                        </button>
                    ) : (
                        <div className={cardCls}>{inner}</div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export const SemanticCardMap: React.FC<SemanticCardMapProps> = ({ selected, relations, onSelect, dir }) => {
    const reduce = useReducedMotion();

    return (
        <div
            dir={dir}
            className="relative aspect-[5/7] w-full overflow-hidden rounded-3xl border border-slate-700/50 bg-[radial-gradient(circle_at_50%_50%,#0b1220_0%,#070b14_55%,#04060c_100%)] sm:aspect-[5/4] md:aspect-[4/3] lg:aspect-[3/2]"
        >
            {/* הילת עומק רכה, והילת עוגן ציאן מאחורי הכרטיס הנבחר במרכז */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.04] blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-2xl" />

            {/* קרני אנרגיה מהמרכז אל כל כרטיס: בהירות ליד העוגן ודועכות החוצה.
                preserveAspectRatio=none מצמיד את קצות הקרניים למרכזי הכרטיסים בכל יחס,
                ו-non-scaling-stroke שומר עובי קו קבוע גם כשהבד נמתח לרוחב מלא. */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
                <defs>
                    {relations.map((r) => {
                        const slot = SLOTS[r.tier];
                        const color = BEAM[r.tier];
                        return (
                            <linearGradient key={r.tier} id={`beam-${r.tier}`} gradientUnits="userSpaceOnUse" x1={vb(CENTER.x)} y1={vb(CENTER.y)} x2={vb(slot.x)} y2={vb(slot.y)}>
                                <stop offset="0%" stopColor={color} stopOpacity={0.85} />
                                <stop offset="55%" stopColor={color} stopOpacity={0.32} />
                                <stop offset="100%" stopColor={color} stopOpacity={0.04} />
                            </linearGradient>
                        );
                    })}
                </defs>
                {relations.map((r) => {
                    const slot = SLOTS[r.tier];
                    const isFar = r.tier === 'far';
                    return (
                        <g key={r.tier}>
                            {/* קרן רכה רחבה */}
                            <line x1={vb(CENTER.x)} y1={vb(CENTER.y)} x2={vb(slot.x)} y2={vb(slot.y)} stroke={`url(#beam-${r.tier})`} strokeWidth={isFar ? 2 : 3.5} strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity={0.75} />
                            {/* קו ליבה דק */}
                            <line x1={vb(CENTER.x)} y1={vb(CENTER.y)} x2={vb(slot.x)} y2={vb(slot.y)} stroke={`url(#beam-${r.tier})`} strokeWidth={1.2} strokeLinecap="round" vectorEffect="non-scaling-stroke" strokeDasharray={isFar ? '3 3' : undefined} />
                        </g>
                    );
                })}
            </svg>

            {/* כרטיסי הקשר */}
            {relations.map((r) => {
                const st = TIER[r.tier];
                return (
                    <Card
                        key={r.tier}
                        data={r.card}
                        pos={SLOTS[r.tier]}
                        accentRing={st.ring}
                        iconColor={st.icon}
                        tag={r.tag}
                        tagClass={st.tag}
                        onClick={() => onSelect(r.card.id)}
                        reduce={!!reduce}
                    />
                );
            })}

            {/* הכרטיס הנבחר במרכז, מודגש */}
            <Card
                data={selected}
                pos={CENTER}
                accentRing="border-cyan-300/70 shadow-[0_0_30px_-8px_rgba(34,211,238,0.55)]"
                iconColor="text-cyan-200"
                reduce={!!reduce}
            />
        </div>
    );
};
