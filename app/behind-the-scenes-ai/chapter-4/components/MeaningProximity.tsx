"use client";

// MeaningProximity - תצוגת "קרבה במשמעות" לשימוש חוזר (פרק 4).
// ──────────────────────────────────────────────────────────────────────────
// שדה זכוכית כהה ופרימיום. כל פריט הוא צומת במיקום מחבר (authored): פריטים דומים
// במשמעות קרובים יותר. בחירת פריט מדגישה אותו ואת הקרוב לו ביותר בקו זוהר ותווית
// "הכי קרוב". שני סוגי צמתים: אובייקט (אורב זכוכית עם צללית ותווית) ומשפט (נקודה
// זוהרת, בלי טקסט מלא על השדה). אין צירים, אין שכונות, אין מטאפורת חום.
//
// reduced-motion: בלי ריחוף, בלי פעימה. הדגשת הבחירה והקו מופיעים מיד. העומק והזוהר
// סטטיים, ולכן נשאר פרימיום בלי תלות באנימציה.

import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { ObjectGlyph, type ObjectGlyphKey } from './objectGlyphs';

export interface ProximityNode {
    id: string;
    /** מיקום פריסה 0..1 (קונסטלציה נקייה, authored). */
    pos: { x: number; y: number };
    /** הקרוב ביותר במשמעות. אם אין, לא מצויר קו ולא תווית "הכי קרוב". */
    nearestId?: string;
    /** נכס תמונה (ראשי) לצומת אובייקט. */
    assetSrc?: string;
    /** צללית גיבוי אם הנכס חסר. נוכחות אחד מהם הופכת את הצומת לאובייקט. */
    fallbackGlyph?: ObjectGlyphKey;
    /** תווית קצרה מתחת לצומת (אובייקטים). למשפטים נשאר ריק, הטקסט המלא במקרא. */
    label: string;
    fullText?: string;
    /** הסבר אופציונלי לאובייקט. */
    explanation?: string;
}

interface MeaningProximityProps {
    nodes: ProximityNode[];
    activeId: string;
    onSelect: (id: string) => void;
    closestTag: string;
    dir: 'rtl' | 'ltr';
    /** להציג קו לכל זוג קרוב (לדמו האשכולות), ולא רק לזוג הפעיל. */
    showAllLinks?: boolean;
}

const vb = (v: number) => v * 100;

export const MeaningProximity: React.FC<MeaningProximityProps> = ({ nodes, activeId, onSelect, closestTag, dir, showAllLinks = false }) => {
    const reduce = useReducedMotion();

    const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n] as const)), [nodes]);
    const active = byId.get(activeId) ?? nodes[0] ?? null;
    const nearest = active?.nearestId ? byId.get(active.nearestId) ?? null : null;

    // זוגות הקרבה לציור: או כל הזוגות (דמו אשכולות) או רק זוג הפעיל. הזוג שכולל את
    // הפעיל מודגש. כל זוג מצויר פעם אחת.
    const linkPairs = useMemo(() => {
        const out: { a: ProximityNode; b: ProximityNode; emphasized: boolean }[] = [];
        const seen = new Set<string>();
        const consider = (n: ProximityNode) => {
            if (!n.nearestId) return;
            const m = byId.get(n.nearestId);
            if (!m) return;
            const key = [n.id, m.id].sort().join('|');
            if (seen.has(key)) return;
            seen.add(key);
            out.push({ a: n, b: m, emphasized: n.id === activeId || m.id === activeId });
        };
        if (showAllLinks) nodes.forEach(consider);
        else if (active) consider(active);
        return out;
    }, [showAllLinks, nodes, byId, active, activeId]);

    return (
        <div
            dir={dir}
            className="relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-700/50 bg-[radial-gradient(circle_at_50%_45%,#0b1220_0%,#070b14_55%,#04060c_100%)]"
        >
            {/* ערפל עומק רך */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-3xl" />

            {/* קווי קרבה: זוהר רך מתחת, חוט בהיר מעל לזוג המודגש */}
            {linkPairs.length > 0 && (
                <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full">
                    {linkPairs.map(({ a, b, emphasized }) => (
                        <g key={`${a.id}-${b.id}`}>
                            <line
                                x1={vb(a.pos.x)}
                                y1={vb(a.pos.y)}
                                x2={vb(b.pos.x)}
                                y2={vb(b.pos.y)}
                                className={emphasized ? 'stroke-cyan-300/28' : 'stroke-slate-300/14'}
                                strokeWidth={emphasized ? 1.4 : 1}
                                strokeLinecap="round"
                            />
                            {emphasized && (
                                <line x1={vb(a.pos.x)} y1={vb(a.pos.y)} x2={vb(b.pos.x)} y2={vb(b.pos.y)} className="stroke-cyan-200/70" strokeWidth={0.5} strokeLinecap="round" />
                            )}
                        </g>
                    ))}
                </svg>
            )}

            {/* צמתים */}
            {nodes.map((n, i) => {
                const isActive = n.id === activeId;
                const isNearest = nearest?.id === n.id;
                const isObject = !!n.assetSrc || !!n.fallbackGlyph;
                return (
                    <button
                        key={n.id}
                        type="button"
                        onClick={() => onSelect(n.id)}
                        aria-pressed={isActive}
                        aria-label={n.fullText ?? n.label}
                        className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                        style={{ left: `${vb(n.pos.x)}%`, top: `${vb(n.pos.y)}%` }}
                    >
                        {isObject ? (
                            <span className="flex flex-col items-center gap-1.5">
                                <motion.span
                                    animate={reduce ? undefined : { y: [0, -2.5, 0] }}
                                    transition={reduce ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                                    className="relative flex h-16 w-16 items-center justify-center sm:h-[4.5rem] sm:w-[4.5rem]"
                                >
                                    {/* הילה רכה מאחורי הצומת הצף, חזקה יותר לנבחר */}
                                    <span className={`pointer-events-none absolute inset-0 rounded-full blur-md ${isActive ? 'bg-cyan-400/20' : isNearest ? 'bg-violet-400/14' : 'bg-white/[0.04]'}`} />
                                    {isActive && <span className="pointer-events-none absolute -inset-1 rounded-full ring-1 ring-cyan-300/50" />}
                                    <ObjectGlyph
                                        glyph={n.fallbackGlyph}
                                        assetSrc={n.assetSrc}
                                        className={`relative h-full w-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] ${
                                            n.assetSrc ? '' : isActive ? 'text-cyan-200' : isNearest ? 'text-violet-200' : 'text-slate-300'
                                        }`}
                                    />
                                </motion.span>
                                <span className={`text-[12px] font-bold ${isActive ? 'text-cyan-100' : 'text-slate-300'}`}>{n.label}</span>
                                {isNearest && (
                                    <span className="rounded-full border border-violet-400/40 bg-violet-900/30 px-2 py-0.5 text-[10px] font-bold text-violet-100">{closestTag}</span>
                                )}
                            </span>
                        ) : (
                            <span className="flex flex-col items-center gap-1">
                                <span className="relative flex h-11 w-11 items-center justify-center">
                                    <span className={`pointer-events-none absolute inset-0 rounded-full blur-md ${isActive ? 'bg-cyan-400/20' : isNearest ? 'bg-violet-400/15' : 'bg-slate-500/[0.06]'}`} />
                                    <span className={`relative h-3 w-3 rounded-full ${isActive ? 'bg-cyan-200 shadow-[0_0_12px_3px_rgba(34,211,238,0.5)]' : isNearest ? 'bg-violet-300' : 'bg-slate-400'}`} />
                                </span>
                                {isNearest && (
                                    <span className="rounded-full border border-violet-400/40 bg-violet-900/30 px-2 py-0.5 text-[10px] font-bold text-violet-100">{closestTag}</span>
                                )}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};
