"use client";

import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Compass, MousePointerClick, Sparkles, Map, Info, Hand, RotateCcw, ArrowLeftRight, Check } from 'lucide-react';

import type { Direction } from '@/i18n/config';
import { GuessButton } from './GuessButton';

import {
    PHRASES,
    CLUSTER_STYLE,
    ANCHOR_ID,
    NEGATION_PAIR,
    distance,
    closeness,
    closenessTone,
    TONE_STYLE,
    type ClusterKey,
    type PhraseId,
    type Vec,
} from '@/app/behind-the-scenes-ai/chapter-5/semanticSpace';
import type { SemanticSpaceLabDict } from '@/i18n/locales/he/behind-ai/semanticSpaceLab';

/**
 * SemanticSpaceLab - מעבדת פרק 5: "Semantic Space: מפת המשמעות של המודל".
 * רכיב עצמאי ודטרמיניסטי, בנוי סביב פעולה של הלומד, לא רק צפייה.
 *   1. map      - בוחרים או גוררים משפט, ורשימת השכנים הקרובים מתעדכנת חי. הלקח:
 *                 קרוב במרחב = קרוב במשמעות, גם כשהמילים שונות.
 *   2. negation - זוג שלילה: כמעט אותן מילים, משמעות הפוכה. הלקח: קרבה אינה אמת.
 * אין כאן embeddings אמיתיים, מודל או רשת. הכל נקודות קבועות מ-semanticSpace.
 * כל הטקסט מגיע מהמילון (content), כדי שיתורגם ל-6 שפות. הכיווניות דרך dir.
 */

type Experiment = 'map' | 'negation';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/* ── מיפוי קואורדינטות → פיקסלים ל-SVG (ציר y הפוך כדי שלמעלה יהיה למעלה) ── */
const MAP_SIZE = 360;
const MAP_PAD = 40;
const MAP_DOMAIN = 10;
const MAP_R = MAP_SIZE / 2 - MAP_PAD;
const mapPoint = (v: Vec) => ({
    cx: MAP_SIZE / 2 + (v.x / MAP_DOMAIN) * MAP_R,
    cy: MAP_SIZE / 2 - (v.y / MAP_DOMAIN) * MAP_R,
});

/** מרכז ורדיוס לאליפסת אזור לכל אשכול, מהקואורדינטות המקוריות (סטטי). */
const CLUSTER_REGIONS: { key: ClusterKey; cx: number; cy: number; rx: number; ry: number }[] = (
    ['complaint', 'status', 'action', 'unrelated'] as ClusterKey[]
).map((key) => {
    const pts = PHRASES.filter((p) => p.cluster === key);
    const mx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const my = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    const spanX = Math.max(...pts.map((p) => Math.abs(p.x - mx)), 1.5);
    const spanY = Math.max(...pts.map((p) => Math.abs(p.y - my)), 1.5);
    const c = mapPoint({ x: mx, y: my });
    return {
        key,
        cx: c.cx,
        cy: c.cy,
        rx: ((spanX + 2.4) / MAP_DOMAIN) * MAP_R,
        ry: ((spanY + 2.4) / MAP_DOMAIN) * MAP_R,
    };
});

export const SemanticSpaceLab: React.FC<{ content: SemanticSpaceLabDict; dir: Direction }> = ({ content, dir }) => {
    const [experiment, setExperiment] = useState<Experiment>('map');

    return (
        <div className="space-y-4">
            {/* ── בורר הניסוי ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4 sm:flex-row sm:items-center sm:justify-between" dir={dir}>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Map size={16} className="text-violet-300" />
                    <span className="font-bold text-slate-200">{content.selector.label}</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/80 p-1" dir={dir}>
                    {([['map', content.selector.map], ['negation', content.selector.negation]] as const).map(([key, label]) => {
                        const active = experiment === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setExperiment(key)}
                                aria-pressed={active}
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                                    active ? 'bg-violet-500 text-white' : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {experiment === 'map' ? (
                    <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <MapExperiment content={content} dir={dir} />
                    </motion.div>
                ) : (
                    <motion.div key="negation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <NegationExperiment content={content} dir={dir} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* disclaimer */}
            <div className="flex items-start gap-2 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[13px] leading-relaxed text-slate-400" dir={dir}>
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>{content.disclaimer}</span>
            </div>
        </div>
    );
};

/* ═══════════════════════ ניסוי 1: שכנים במרחב ════════════════════════════ */

const MapExperiment: React.FC<{ content: SemanticSpaceLabDict; dir: Direction }> = ({ content, dir }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const m = content.map;

    const initial = useMemo<Record<string, Vec>>(
        () => Object.fromEntries(PHRASES.map((p) => [p.id, { x: p.x, y: p.y }])),
        [],
    );
    const [positions, setPositions] = useState<Record<string, Vec>>(initial);
    const [selectedId, setSelectedId] = useState<PhraseId>(ANCHOR_ID);
    const [draggingId, setDraggingId] = useState<PhraseId | null>(null);
    const [everDragged, setEverDragged] = useState(false);

    const selPhrase = PHRASES.find((p) => p.id === selectedId)!;
    const selPos = positions[selectedId];

    // המרת מיקום מצביע לקואורדינטות הדומיין (הופכי ל-mapPoint).
    const toDomain = (clientX: number, clientY: number): Vec => {
        const svg = svgRef.current;
        if (!svg) return selPos;
        const rect = svg.getBoundingClientRect();
        const sx = (clientX - rect.left) * (MAP_SIZE / rect.width);
        const sy = (clientY - rect.top) * (MAP_SIZE / rect.height);
        return {
            x: clamp(((sx - MAP_SIZE / 2) / MAP_R) * MAP_DOMAIN, -MAP_DOMAIN, MAP_DOMAIN),
            y: clamp(((MAP_SIZE / 2 - sy) / MAP_R) * MAP_DOMAIN, -MAP_DOMAIN, MAP_DOMAIN),
        };
    };

    const startDrag = (id: PhraseId) => (e: React.PointerEvent<SVGGElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setSelectedId(id);
        setDraggingId(id);
    };
    const moveDrag = (e: React.PointerEvent<SVGGElement>) => {
        if (!draggingId) return;
        const d = toDomain(e.clientX, e.clientY);
        setPositions((p) => ({ ...p, [draggingId]: d }));
        if (!everDragged) setEverDragged(true);
    };
    const endDrag = (e: React.PointerEvent<SVGGElement>) => {
        if (draggingId) {
            try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
            setDraggingId(null);
        }
    };

    const reset = () => { setPositions(initial); setEverDragged(false); setSelectedId(ANCHOR_ID); };

    // דירוג שכנים חי לפי מרחק (מהקרוב לרחוק), על סמך המיקומים החיים.
    const others = PHRASES.filter((p) => p.id !== selectedId);
    const neighbors = others
        .map((p) => ({ p, dist: distance(selPos, positions[p.id]) }))
        .sort((a, b) => a.dist - b.dist);
    const nearestDist = neighbors.length ? neighbors[0].dist : 0;

    const selScreen = mapPoint(selPos);

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* ── המפה ─────────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-start" dir={dir}>
                <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Compass size={16} className="text-violet-300" />
                        <div className="leading-tight">
                            <div className="text-sm font-bold text-slate-200">{m.title}</div>
                            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">{m.subtitle}</div>
                        </div>
                    </div>
                    <GuessButton variant="ghost" onClick={reset} leadingIcon={<RotateCcw size={13} />}>
                        {m.reset}
                    </GuessButton>
                </div>

                {/* מקרא אזורים */}
                <div className="mb-3 flex flex-wrap gap-2">
                    {(Object.keys(CLUSTER_STYLE) as ClusterKey[]).map((key) => {
                        const c = CLUSTER_STYLE[key];
                        return (
                            <span key={key} className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-bold ${c.chip} ${c.text}`}>
                                <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                                {content.clusters[key]}
                            </span>
                        );
                    })}
                </div>

                <div className="relative overflow-hidden rounded-xl border border-slate-700/40 bg-slate-950/50">
                    <svg
                        ref={svgRef}
                        viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
                        className="w-full select-none"
                        style={{ touchAction: 'none' }}
                        role="img"
                        aria-label={m.title}
                    >
                        {/* אזורי משמעות רכים (סטטיים, מהמיקום המקורי) */}
                        {CLUSTER_REGIONS.map((r) => (
                            <ellipse
                                key={r.key}
                                cx={r.cx}
                                cy={r.cy}
                                rx={r.rx}
                                ry={r.ry}
                                fill={CLUSTER_STYLE[r.key].hex}
                                opacity={0.07}
                            />
                        ))}

                        {/* נקודות: רק צבע האשכול. אין מלל על המפה חוץ מהמשפט הנבחר, כדי
                            שלא תיווצר ערימת טקסט. ריחוף על נקודה חושף את המשפט שלה (title). */}
                        {PHRASES.map((p) => {
                            const pos = mapPoint(positions[p.id]);
                            const c = CLUSTER_STYLE[p.cluster];
                            const isSel = selectedId === p.id;
                            const isDrag = draggingId === p.id;
                            const dist = distance(selPos, positions[p.id]);
                            const near = closeness(dist);
                            const dim = !isSel ? 0.35 + 0.65 * near : 1;
                            return (
                                <g
                                    key={p.id}
                                    onPointerDown={startDrag(p.id)}
                                    onPointerMove={moveDrag}
                                    onPointerUp={endDrag}
                                    onPointerCancel={endDrag}
                                    style={{ cursor: isDrag ? 'grabbing' : 'grab', opacity: dim }}
                                    className={draggingId ? '' : 'transition-opacity duration-300'}
                                >
                                    <title>{content.phrases[p.id]}</title>
                                    {isSel && <circle cx={pos.cx} cy={pos.cy} r={14} fill="none" stroke={c.hex} strokeWidth={1.5} strokeOpacity={0.6} />}
                                    <circle cx={pos.cx} cy={pos.cy} r={isSel ? 8 : 6} fill={c.hex} stroke="#0b1220" strokeWidth={isSel ? 0 : 1.5} />
                                    {/* אזור גרירה נדיב */}
                                    <circle cx={pos.cx} cy={pos.cy} r={20} fill="transparent" />
                                </g>
                            );
                        })}

                        {/* תווית המשפט הנבחר בלבד, כגלולה קריאה מעל הנקודה (על גבי כל השאר) */}
                        {(() => {
                            const text = content.phrases[selectedId];
                            const labelW = Math.min(text.length * 7 + 18, MAP_SIZE - 2 * (MAP_PAD - 12));
                            const lx = clamp(selScreen.cx, MAP_PAD - 12 + labelW / 2, MAP_SIZE - (MAP_PAD - 12) - labelW / 2);
                            const ly = clamp(selScreen.cy - 30, 6, MAP_SIZE - 26);
                            const selHex = CLUSTER_STYLE[selPhrase.cluster].hex;
                            return (
                                <g pointerEvents="none">
                                    <rect x={lx - labelW / 2} y={ly} width={labelW} height={21} rx={7} fill="#0b1220" stroke={selHex} strokeOpacity={0.7} />
                                    <text x={lx} y={ly + 14.5} fill="#f8fafc" fontSize={11.5} fontWeight={700} textAnchor="middle">{text}</text>
                                    {!everDragged && (
                                        <text x={selScreen.cx} y={selScreen.cy + 26} fill="#c4b5fd" fontSize={11} fontWeight={700} textAnchor="middle">
                                            {m.dragHint}
                                        </text>
                                    )}
                                </g>
                            );
                        })()}
                    </svg>
                </div>

                {/* הסבר חי שמגיב לפעולה */}
                <div className="mt-3 min-h-[3rem]">
                    {!everDragged ? (
                        <p className="flex items-start gap-2 text-xs leading-relaxed text-violet-200">
                            <Hand size={14} className="mt-0.5 shrink-0" /> {m.selectHint}
                        </p>
                    ) : (
                        <p className="flex items-start gap-2 rounded-xl border border-emerald-500/40 bg-emerald-900/15 p-2.5 text-xs leading-relaxed text-emerald-200">
                            <MousePointerClick size={14} className="mt-0.5 shrink-0" /> {m.draggedHint}
                        </p>
                    )}
                </div>
            </div>

            {/* ── שכנים קרובים ─────────────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-start" dir={dir}>
                <div className="mb-3 flex items-center gap-2">
                    <Sparkles size={16} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">{m.neighborsTitle}</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">{m.neighborsSubtitle}</div>
                    </div>
                </div>

                <div className="mb-3 flex items-center gap-2 text-sm">
                    <span className="text-slate-400">{m.closenessTo}</span>
                    <span className={`rounded-md border px-2 py-0.5 font-bold ${CLUSTER_STYLE[selPhrase.cluster].chip} ${CLUSTER_STYLE[selPhrase.cluster].text}`}>
                        {content.phrases[selPhrase.id]}
                    </span>
                </div>

                <div className="space-y-2">
                    {neighbors.slice(0, 6).map(({ p, dist }) => {
                        const tone = closenessTone(dist);
                        const toneStyle = TONE_STYLE[tone];
                        const pct = Math.round(closeness(dist) * 100);
                        const isClosest = dist === nearestDist;
                        const toneLabel = tone === 'near' ? m.toneNear : tone === 'mid' ? m.toneMid : m.toneFar;
                        return (
                            <div key={p.id} className={`rounded-xl border px-3 py-2 ${toneStyle.chip}`}>
                                <div className="mb-1.5 flex items-center justify-between gap-2">
                                    <span className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-bold text-slate-100">{content.phrases[p.id]}</span>
                                        {isClosest && (
                                            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300">{m.closest}</span>
                                        )}
                                        <span className={`text-[10px] font-bold ${toneStyle.text}`}>{toneLabel}</span>
                                    </span>
                                    <span className={`font-mono text-[11px] ${toneStyle.text}`} dir="ltr">{pct}%</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-800/80">
                                    <div
                                        className={`h-full rounded-full transition-[width] duration-100 ease-out ${toneStyle.bar}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{m.note}</p>
            </div>
        </div>
    );
};

/* ═══════════════════════ ניסוי 2: מלכודת השלילה ══════════════════════════ */

const NegationExperiment: React.FC<{ content: SemanticSpaceLabDict; dir: Direction }> = ({ content, dir }) => {
    const reduce = useReducedMotion();
    const n = content.negation;
    const [revealed, setRevealed] = useState(false);

    const baseText = content.phrases[NEGATION_PAIR.base];
    const oppositeText = content.phrases[NEGATION_PAIR.opposite];

    // פילוח מילים כללי (לשפות עם רווחים). המילה הייחודית למקור = ציר השלילה.
    const baseWords = baseText.split(/\s+/).filter(Boolean);
    const oppWords = oppositeText.split(/\s+/).filter(Boolean);
    const pivotWords = baseWords.filter((w) => !oppWords.includes(w));

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* ── שני המשפטים ─────────────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-start" dir={dir}>
                <div className="mb-4 flex items-center gap-2">
                    <ArrowLeftRight size={16} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">{n.title}</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">{n.subtitle}</div>
                    </div>
                </div>

                {/* משפט מקורי, עם הדגשת מילת השלילה */}
                <div className="mb-3 rounded-xl border border-cyan-500/30 bg-cyan-900/10 p-3">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-cyan-300">{n.baseLabel}</div>
                    <div className="flex flex-wrap gap-1.5">
                        {baseWords.map((w, i) => {
                            const isPivot = pivotWords.includes(w);
                            return (
                                <span
                                    key={`${w}-${i}`}
                                    className={`rounded-md px-2 py-1 text-sm font-bold ${
                                        isPivot ? 'bg-rose-500/25 text-rose-200 ring-1 ring-rose-400/50' : 'bg-slate-800/60 text-slate-200'
                                    }`}
                                >
                                    {w}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* משפט הנגד */}
                <div className="rounded-xl border border-amber-500/30 bg-amber-900/10 p-3">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-300">{n.oppositeLabel}</div>
                    <div className="flex flex-wrap gap-1.5">
                        {oppWords.map((w, i) => (
                            <span key={`${w}-${i}`} className="rounded-md bg-slate-800/60 px-2 py-1 text-sm font-bold text-slate-200">
                                {w}
                            </span>
                        ))}
                    </div>
                </div>

                {/* שני צ'יפים: אותן מילים, משמעות הפוכה */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-900/15 px-2.5 py-1 text-[11px] font-bold text-cyan-200">
                        <Check size={12} /> {n.sharedChip}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-900/15 px-2.5 py-1 text-[11px] font-bold text-rose-200">
                        <ArrowLeftRight size={12} /> {n.oppositeChip}
                    </span>
                </div>
            </div>

            {/* ── ההסבר ────────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-start" dir={dir}>
                {/* מיני-מפה: שתי נקודות קרובות מאוד, עם קו ביניהן */}
                <div className="mb-4 overflow-hidden rounded-xl border border-slate-700/40 bg-slate-950/50">
                    <svg viewBox={`0 0 ${MAP_SIZE} 150`} className="w-full" role="img" aria-label={n.title}>
                        {/* שתי נקודות קרובות מאוד במרחב, אבל צבע שונה: קרוב במילים, הפוך במשמעות */}
                        <line x1={150} y1={92} x2={214} y2={70} stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="4 4" strokeOpacity={0.6} />
                        <circle cx={150} cy={92} r={7} fill="#22d3ee" />
                        <text x={150} y={116} fill="#e2e8f0" fontSize={11} fontWeight={700} textAnchor="middle">{baseText}</text>
                        <circle cx={214} cy={70} r={7} fill="#fbbf24" />
                        <text x={214} y={54} fill="#e2e8f0" fontSize={11} fontWeight={700} textAnchor="middle">{oppositeText}</text>
                    </svg>
                </div>

                <AnimatePresence mode="wait">
                    {revealed ? (
                        <motion.div
                            key="revealed"
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                        >
                            <p className="rounded-xl border border-rose-500/30 bg-rose-950/15 p-3 text-sm leading-relaxed text-slate-200">
                                {n.explanation}
                            </p>
                            <p className="mt-3 border-s-2 border-violet-400/50 ps-3 text-sm font-bold leading-relaxed text-violet-100">
                                {n.bridge}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div key="hidden" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
                            <GuessButton onClick={() => setRevealed(true)} rgb="244,63,94" reduce={!!reduce} sheen leadingIcon={<Sparkles size={14} />}>
                                {n.revealButton}
                            </GuessButton>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
