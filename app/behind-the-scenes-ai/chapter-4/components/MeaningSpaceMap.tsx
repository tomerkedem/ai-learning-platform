"use client";

// MeaningSpaceMap - שדה משמעות חי לפרק 4 (Embeddings).
// ──────────────────────────────────────────────────────────────────────────
// מציג משפטים כנקודות זוהרות במרחב דו-ממדי. המיקום מגיע מ-projectProfile ולכן הוא
// בלתי תלוי שפה ולעולם אינו מתהפך ב-RTL. רק תוויות הכרום עוקבות אחרי כיוון השפה.
// אין למידה תלוית hover. בחירה היא בלחיצה. ל-reduced-motion יש קיצור ברור: הפוקוס
// נצמד מיד, ושובל ההחלפה עדיין מצויר כך שרואים שהמשמעות זזה.

import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import type { JoinedSentence, Chapter4LabDict } from '../labContent';
import type { SentenceId, ClusterId } from '../embeddingEngine';

interface TrailPoint {
    x: number;
    y: number;
}

export interface SwapTrail {
    from: TrailPoint;
    to: TrailPoint;
}

interface MeaningSpaceMapProps {
    sentences: JoinedSentence[];
    activeId: SentenceId;
    compareId: SentenceId | null;
    onSelect: (id: SentenceId) => void;
    labels: Chapter4LabDict['map'];
    swapTrail: SwapTrail | null;
    dir: 'rtl' | 'ltr';
}

// צבע נקודה לפי אשכול. מחלקות literal בלבד כדי שלא ייגזמו.
const CATEGORY_DOT: Record<ClusterId, string> = {
    'delivery-trouble': 'text-cyan-300',
    system: 'text-indigo-300',
    payment: 'text-emerald-300',
    address: 'text-blue-300',
    'agent-risk': 'text-rose-300',
    unrelated: 'text-slate-300',
};

// הילת אשכול רכה (HTML מטושטש מאחורי ה-SVG).
const CATEGORY_HALO: Record<ClusterId, string> = {
    'delivery-trouble': 'bg-cyan-500/12',
    system: 'bg-indigo-500/12',
    payment: 'bg-emerald-500/12',
    address: 'bg-blue-500/12',
    'agent-risk': 'bg-rose-500/12',
    unrelated: 'bg-slate-500/12',
};

/** נקודה 0..1 לאחוז viewBox 0..100. */
const vb = (v: number) => v * 100;

export const MeaningSpaceMap: React.FC<MeaningSpaceMapProps> = ({
    sentences,
    activeId,
    compareId,
    onSelect,
    labels,
    swapTrail,
    dir,
}) => {
    const reduce = useReducedMotion();

    const byId = useMemo(() => new Map(sentences.map((s) => [s.id, s] as const)), [sentences]);
    const active = byId.get(activeId) ?? null;
    const compare = compareId ? byId.get(compareId) ?? null : null;

    // מרכזי אשכולות להילות הרכות.
    const halos = useMemo(() => {
        const groups = new Map<ClusterId, JoinedSentence[]>();
        sentences.forEach((s) => {
            const list = groups.get(s.category) ?? [];
            list.push(s);
            groups.set(s.category, list);
        });
        return Array.from(groups.entries()).map(([cat, list]) => ({
            cat,
            x: list.reduce((a, s) => a + s.point.x, 0) / list.length,
            y: list.reduce((a, s) => a + s.point.y, 0) / list.length,
        }));
    }, [sentences]);

    const nearby = useMemo(
        () => (active ? active.nearbyIds.map((id) => byId.get(id)).filter((s): s is JoinedSentence => !!s) : []),
        [active, byId],
    );

    return (
        <div dir={dir} className="text-start">
            {/* כותרת קטנה */}
            <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-200">{labels.legendTitle}</span>
            </div>

            {/* השדה הריבועי */}
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                {/* הילות אשכול רכות */}
                {halos.map((h) => (
                    <div
                        key={h.cat}
                        className={`pointer-events-none absolute h-2/5 w-2/5 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl ${CATEGORY_HALO[h.cat]}`}
                        style={{ left: `${vb(h.x)}%`, top: `${vb(h.y)}%` }}
                    />
                ))}

                {/* שכבת ה-SVG: רשת עדינה, קווי קשר, נקודות, פוקוס */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                    <defs>
                        <marker id="msm-arrow" markerWidth="6" markerHeight="6" refX="4.5" refY="3" orient="auto">
                            <path d="M0,0 L5,3 L0,6 Z" className="fill-white/70" />
                        </marker>
                    </defs>

                    {/* רשת עדינה */}
                    {[25, 50, 75].map((g) => (
                        <g key={g} className="stroke-white/5" strokeWidth={0.3}>
                            <line x1={g} y1={4} x2={g} y2={96} />
                            <line x1={4} y1={g} x2={96} y2={g} />
                        </g>
                    ))}

                    {/* קווי קשר אל נקודות קרובות */}
                    {active &&
                        nearby.map((n) => (
                            <line
                                key={`near-${n.id}`}
                                x1={vb(active.point.x)}
                                y1={vb(active.point.y)}
                                x2={vb(n.point.x)}
                                y2={vb(n.point.y)}
                                className="stroke-cyan-300/40"
                                strokeWidth={0.5}
                            />
                        ))}

                    {/* קו השוואה מקווקו */}
                    {active && compare && (
                        <line
                            x1={vb(active.point.x)}
                            y1={vb(active.point.y)}
                            x2={vb(compare.point.x)}
                            y2={vb(compare.point.y)}
                            className="stroke-fuchsia-300/40"
                            strokeWidth={0.5}
                            strokeDasharray="2 2"
                        />
                    )}

                    {/* שובל החלפה: המשמעות זזה */}
                    {swapTrail && (
                        <line
                            x1={vb(swapTrail.from.x)}
                            y1={vb(swapTrail.from.y)}
                            x2={vb(swapTrail.to.x)}
                            y2={vb(swapTrail.to.y)}
                            className="stroke-violet-300/80"
                            strokeWidth={0.7}
                            strokeDasharray="2.5 2"
                            markerEnd="url(#msm-arrow)"
                        />
                    )}

                    {/* נקודות: הילה וליבה */}
                    {sentences.map((s) => {
                        const isActive = s.id === activeId;
                        const isCompare = s.id === compareId;
                        return (
                            <g key={s.id} className={CATEGORY_DOT[s.category]}>
                                <circle
                                    cx={vb(s.point.x)}
                                    cy={vb(s.point.y)}
                                    r={isActive ? 5 : 4}
                                    className="fill-current"
                                    opacity={isActive ? 0.28 : isCompare ? 0.2 : 0.12}
                                />
                                <circle cx={vb(s.point.x)} cy={vb(s.point.y)} r={1.7} className="fill-current" />
                            </g>
                        );
                    })}

                    {/* טבעת השוואה מקווקוות */}
                    {compare && (
                        <circle
                            cx={vb(compare.point.x)}
                            cy={vb(compare.point.y)}
                            r={3.4}
                            className="fill-none stroke-fuchsia-200/80"
                            strokeWidth={0.6}
                            strokeDasharray="2 1.6"
                        />
                    )}

                    {/* דופק פוקוס (רק עם תנועה) */}
                    {!reduce && active && (
                        <motion.circle
                            cx={vb(active.point.x)}
                            cy={vb(active.point.y)}
                            r={3}
                            className="fill-none stroke-white/60"
                            strokeWidth={0.4}
                            animate={{ r: [3, 6.5, 3], opacity: [0.55, 0, 0.55] }}
                            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    )}

                    {/* טבעת פוקוס שמחליקה למיקום הפעיל */}
                    {active && (
                        <motion.circle
                            initial={false}
                            animate={{ cx: vb(active.point.x), cy: vb(active.point.y) }}
                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 20 }}
                            r={3.2}
                            className="fill-none stroke-white"
                            strokeWidth={0.7}
                        />
                    )}
                </svg>

                {/* תוויות צירים, ממוקמות פיזית (לא מתהפכות), הטקסט עצמו עוקב אחרי dir */}
                <span className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 max-w-[40%] text-end text-[10px] font-medium leading-tight text-slate-400">
                    {labels.axisXStart}
                </span>
                <span className="pointer-events-none absolute start-2 top-1/2 -translate-y-1/2 max-w-[40%] text-start text-[10px] font-medium leading-tight text-slate-400">
                    {labels.axisXEnd}
                </span>
                <span className="pointer-events-none absolute left-1/2 top-1.5 -translate-x-1/2 text-[10px] font-medium text-slate-400">
                    {labels.axisYStart}
                </span>
                <span className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-slate-400">
                    {labels.axisYEnd}
                </span>

                {/* תווית המשפט הפעיל */}
                {active && (
                    <span
                        className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-white/15 bg-slate-900/90 px-2 py-0.5 text-[11px] font-bold text-white shadow-lg"
                        style={{ left: `${vb(active.point.x)}%`, top: `calc(${vb(active.point.y)}% - 1.7rem)` }}
                    >
                        {active.text}
                    </span>
                )}

                {/* כפתורי בחירה שקופים (יעדי מגע נגישים), ממוקמים פיזית כדי לא להתהפך */}
                {sentences.map((s) => (
                    <button
                        key={s.id}
                        type="button"
                        onClick={() => onSelect(s.id)}
                        aria-label={s.text}
                        aria-pressed={s.id === activeId}
                        className="absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                        style={{ left: `${vb(s.point.x)}%`, top: `${vb(s.point.y)}%` }}
                    />
                ))}
            </div>

            {/* הבהרת הצל: זו אינה האמת, זו הקרבה */}
            <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{labels.shadowNote}</p>
        </div>
    );
};
