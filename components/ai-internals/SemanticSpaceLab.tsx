"use client";

import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Compass, MousePointerClick, Sparkles, Move3d, Info, Hand, RotateCcw, Target, Lightbulb, Check } from 'lucide-react';

import { GuessButton } from './GuessButton';

import {
    SPACE_WORDS,
    CLUSTER_STYLE,
    ANALOGY,
    ANALOGY_RESULT,
    cosineSim,
    angleBetweenDeg,
    closenessLabel,
    TONE_STYLE,
    type ClusterKey,
    type Vec,
} from '@/app/behind-the-scenes-ai/chapter-5/semanticSpace';

/**
 * SemanticSpaceLab - מעבדת פרק 7: "הגיאומטריה של המשמעות".
 * רכיב עצמאי ודטרמיניסטי, בנוי סביב פעולה של הלומד (גרירה), לא רק צפייה.
 *   1. קרבה במרחב: גוררים מילה, והדירוג לפי כיוון מתעדכן חי. הלקח המוחשי:
 *      גרירה על אותו קו דרך הראשית כמעט לא משנה את הקרבה, שינוי כיוון כן.
 *   2. אנלוגיה: הלומד גורר ניחוש לאן נוחת "מלך − גבר + אישה", ואז מגלה כמה דייק.
 * אין כאן embeddings אמיתיים, מודל או רשת. הכל וקטורים קבועים מ-semanticSpace.
 */

type Experiment = 'space' | 'analogy';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/* ── מיפוי קואורדינטות → פיקסלים ל-SVG (ציר y הפוך כדי שלמעלה יהיה למעלה) ── */
const MAP_SIZE = 360;
const MAP_PAD = 42;
const MAP_DOMAIN = 10;
const MAP_R = MAP_SIZE / 2 - MAP_PAD;
const mapPoint = (v: Vec) => ({
    cx: MAP_SIZE / 2 + (v.x / MAP_DOMAIN) * MAP_R,
    cy: MAP_SIZE / 2 - (v.y / MAP_DOMAIN) * MAP_R,
});

export const SemanticSpaceLab: React.FC = () => {
    const [experiment, setExperiment] = useState<Experiment>('space');

    return (
        <div className="space-y-4">
            {/* ── בורר הניסוי ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4 sm:flex-row sm:items-center sm:justify-between" dir="rtl">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Move3d size={16} className="text-violet-300" />
                    <span className="font-bold text-slate-200">בחרו ניסוי:</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/80 p-1" dir="rtl">
                    {([['space', 'גוררים במרחב'], ['analogy', 'נחשו את האנלוגיה']] as const).map(([key, label]) => {
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
                {experiment === 'space' ? (
                    <motion.div key="space" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <SpaceExperiment />
                    </motion.div>
                ) : (
                    <motion.div key="analogy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <AnalogyExperiment />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* disclaimer */}
            <div className="flex items-start gap-2 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-500" dir="rtl">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>
                    זהו מרחב לימודי בשני ממדים בלבד, כדי שאפשר יהיה לגעת בו. במרחב אמיתי יש מאות או אלפי ממדים, והצירים אינם תכונות
                    אנושיות אלא ערכים נלמדים. מה שחשוב לקחת מכאן הוא הרעיון: <span className="font-bold text-slate-400">קרבה במשמעות היא קרבה בכיוון</span>, לא במרחק.
                </span>
            </div>
        </div>
    );
};

/* ═══════════════════════ ניסוי 1: גוררים במרחב ═══════════════════════════ */

const SpaceExperiment: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);

    const initial = useMemo<Record<string, Vec>>(
        () => Object.fromEntries(SPACE_WORDS.map((w) => [w.he, { x: w.x, y: w.y }])),
        [],
    );
    const [positions, setPositions] = useState<Record<string, Vec>>(initial);
    const [selectedHe, setSelectedHe] = useState<string>('חתול');
    const [draggingHe, setDraggingHe] = useState<string | null>(null);
    const [everDragged, setEverDragged] = useState(false);

    const selWord = SPACE_WORDS.find((w) => w.he === selectedHe)!;
    const selPos = positions[selectedHe];
    const origPos: Vec = { x: selWord.x, y: selWord.y };

    // המרת מיקום עכבר/מגע לקואורדינטות הדומיין (הופכי ל-mapPoint).
    const toDomain = (clientX: number, clientY: number): Vec => {
        const svg = svgRef.current;
        if (!svg) return { x: 0, y: 0 };
        const rect = svg.getBoundingClientRect();
        const sx = (clientX - rect.left) * (MAP_SIZE / rect.width);
        const sy = (clientY - rect.top) * (MAP_SIZE / rect.height);
        return {
            x: clamp(((sx - MAP_SIZE / 2) / MAP_R) * MAP_DOMAIN, -MAP_DOMAIN, MAP_DOMAIN),
            y: clamp(((MAP_SIZE / 2 - sy) / MAP_R) * MAP_DOMAIN, -MAP_DOMAIN, MAP_DOMAIN),
        };
    };

    const startDrag = (he: string) => (e: React.PointerEvent<SVGGElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setSelectedHe(he);
        setDraggingHe(he);
    };
    const moveDrag = (e: React.PointerEvent<SVGGElement>) => {
        if (!draggingHe) return;
        const d = toDomain(e.clientX, e.clientY);
        setPositions((p) => ({ ...p, [draggingHe]: d }));
        if (!everDragged) setEverDragged(true);
    };
    const endDrag = (e: React.PointerEvent<SVGGElement>) => {
        if (draggingHe) {
            try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
            setDraggingHe(null);
        }
    };

    const reset = () => { setPositions(initial); setEverDragged(false); };

    // דירוג חי בסדר קבוע (לא מסתדר מחדש כדי לא לקפוץ), עם תג ל"הכי קרוב".
    const others = SPACE_WORDS.filter((w) => w.he !== selectedHe);
    const cosList = others.map((w) => ({ w, cos: cosineSim(selPos, positions[w.he]) }));
    const maxCos = cosList.reduce((m, c) => Math.max(m, c.cos), -Infinity);

    // מצב הכיוון מול הכיוון המקורי, מזין את ההסבר החי.
    const mag = Math.hypot(selPos.x, selPos.y);
    const origMag = Math.hypot(origPos.x, origPos.y);
    let dAng = Math.abs(Math.atan2(selPos.y, selPos.x) - Math.atan2(origPos.y, origPos.x)) * (180 / Math.PI);
    if (dAng > 180) dAng = 360 - dAng;
    const movedFromOrigin = Math.hypot(selPos.x - origPos.x, selPos.y - origPos.y) > 0.4;
    const onSameLine = movedFromOrigin && dAng < 9;
    const changedDir = movedFromOrigin && dAng >= 9;

    // קו הכיוון המקורי של המילה הנבחרת (דרך הראשית, לשני הכיוונים).
    const unit = origMag === 0 ? { x: 0, y: 0 } : { x: origPos.x / origMag, y: origPos.y / origMag };
    const lineA = mapPoint({ x: unit.x * MAP_DOMAIN, y: unit.y * MAP_DOMAIN });
    const lineB = mapPoint({ x: -unit.x * MAP_DOMAIN, y: -unit.y * MAP_DOMAIN });
    const selScreen = mapPoint(selPos);

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* ── המפה ─────────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Compass size={16} className="text-violet-300" />
                        <div className="leading-tight">
                            <div className="text-sm font-bold text-slate-200">מרחב המשמעות</div>
                            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Drag a word</div>
                        </div>
                    </div>
                    <GuessButton
                        variant="ghost"
                        onClick={reset}
                        leadingIcon={<RotateCcw size={13} />}
                    >
                        איפוס
                    </GuessButton>
                </div>

                {/* מקרא אשכולות */}
                <div className="mb-3 flex flex-wrap gap-2">
                    {(Object.keys(CLUSTER_STYLE) as ClusterKey[]).map((key) => {
                        const c = CLUSTER_STYLE[key];
                        return (
                            <span key={key} className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-bold ${c.chip} ${c.text}`}>
                                <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                                {c.he}
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
                        aria-label="מפת מילים במרחב סמנטי, ניתנת לגרירה"
                    >
                        {/* צירים דרך הראשית */}
                        <line x1={MAP_SIZE / 2} y1={MAP_PAD / 2} x2={MAP_SIZE / 2} y2={MAP_SIZE - MAP_PAD / 2} stroke="#1e293b" strokeWidth={1} />
                        <line x1={MAP_PAD / 2} y1={MAP_SIZE / 2} x2={MAP_SIZE - MAP_PAD / 2} y2={MAP_SIZE / 2} stroke="#1e293b" strokeWidth={1} />

                        {/* קו הכיוון המקורי של המילה הנבחרת */}
                        <line x1={lineA.cx} y1={lineA.cy} x2={lineB.cx} y2={lineB.cy} stroke="#a78bfa" strokeWidth={1.25} strokeOpacity={0.5} strokeDasharray="4 5" />

                        <circle cx={MAP_SIZE / 2} cy={MAP_SIZE / 2} r={3} fill="#475569" />
                        <text x={MAP_SIZE / 2 + 6} y={MAP_SIZE / 2 + 14} fill="#64748b" fontSize={9}>origin</text>

                        {SPACE_WORDS.map((w) => {
                            const p = mapPoint(positions[w.he]);
                            const c = CLUSTER_STYLE[w.cluster];
                            const isSel = selectedHe === w.he;
                            const isDrag = draggingHe === w.he;
                            const cos = cosineSim(selPos, positions[w.he]);
                            const dim = !isSel ? 0.2 + 0.8 * Math.max(0, cos) : 1;
                            return (
                                <g
                                    key={w.he}
                                    onPointerDown={startDrag(w.he)}
                                    onPointerMove={moveDrag}
                                    onPointerUp={endDrag}
                                    onPointerCancel={endDrag}
                                    style={{ cursor: isDrag ? 'grabbing' : 'grab', opacity: dim }}
                                    className={draggingHe ? '' : 'transition-opacity duration-300'}
                                >
                                    {/* החץ מהראשית */}
                                    <line
                                        x1={MAP_SIZE / 2}
                                        y1={MAP_SIZE / 2}
                                        x2={p.cx}
                                        y2={p.cy}
                                        stroke={c.hex}
                                        strokeWidth={isSel ? 2.5 : 1}
                                        strokeOpacity={isSel ? 0.9 : 0.4}
                                    />
                                    {isSel && <circle cx={p.cx} cy={p.cy} r={12} fill="none" stroke={c.hex} strokeWidth={1.5} strokeOpacity={0.55} />}
                                    <circle cx={p.cx} cy={p.cy} r={isSel ? 7 : 5} fill={c.hex} />
                                    {/* אזור גרירה נדיב */}
                                    <circle cx={p.cx} cy={p.cy} r={18} fill="transparent" />
                                    <text
                                        x={p.cx}
                                        y={p.cy - 13}
                                        fill={isSel ? '#f8fafc' : '#cbd5e1'}
                                        fontSize={12}
                                        fontWeight={isSel ? 700 : 500}
                                        textAnchor="middle"
                                        pointerEvents="none"
                                    >
                                        {w.he}
                                    </text>
                                </g>
                            );
                        })}

                        {/* תווית גרירה צפה ליד המילה הנבחרת */}
                        {!everDragged && (
                            <g pointerEvents="none">
                                <text x={selScreen.cx} y={selScreen.cy + 26} fill="#c4b5fd" fontSize={11} fontWeight={700} textAnchor="middle">
                                    גררו אותי ✋
                                </text>
                            </g>
                        )}
                    </svg>
                </div>

                {/* הסבר חי שמגיב לפעולת הגרירה */}
                <div className="mt-3 min-h-[3.5rem]">
                    {!everDragged ? (
                        <p className="flex items-center gap-2 text-xs leading-relaxed text-violet-200">
                            <Hand size={14} /> גררו מילה כלשהי במרחב. שימו לב מה קורה לדירוג הקרבה מצד שמאל בזמן אמת.
                        </p>
                    ) : onSameLine ? (
                        <p className="flex items-start gap-2 rounded-xl border border-emerald-500/40 bg-emerald-900/15 p-2.5 text-xs leading-relaxed text-emerald-200">
                            <Check size={14} className="mt-0.5 shrink-0" />
                            <span>נשארתם על אותו קו כיוון. המרחק מהראשית השתנה (עכשיו {mag.toFixed(1)}), אבל הקרבה למילים האחרות כמעט לא זזה. <span className="font-bold">הכיוון הוא מה שקובע, לא המרחק.</span></span>
                        </p>
                    ) : changedDir ? (
                        <p className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-900/15 p-2.5 text-xs leading-relaxed text-amber-200">
                            <Move3d size={14} className="mt-0.5 shrink-0" />
                            <span>שיניתם כיוון (סטייה של {Math.round(dAng)}° מהקו המקורי). עכשיו הקרבה למילים האחרות משתנה ממש. ככה משמעות זזה במרחב.</span>
                        </p>
                    ) : (
                        <p className="flex items-center gap-2 text-xs leading-relaxed text-slate-400">
                            <MousePointerClick size={13} /> נסו לגרור את &quot;{selectedHe}&quot; לאורך הקו המקווקו (אותו כיוון), ואז לרוחב (כיוון אחר). שימו לב להבדל.
                        </p>
                    )}
                </div>
            </div>

            {/* ── דירוג קרבה חי ─────────────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
                <div className="mb-3 flex items-center gap-2">
                    <Sparkles size={16} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">קרבת כיוון, חי</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Cosine Similarity</div>
                    </div>
                </div>

                <div className="mb-3 flex items-center gap-2 text-sm">
                    <span className="text-slate-400">קרבה אל</span>
                    <span className={`rounded-md border px-2 py-0.5 font-bold ${CLUSTER_STYLE[selWord.cluster].chip} ${CLUSTER_STYLE[selWord.cluster].text}`}>
                        {selWord.he}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500" dir="ltr">|v| = {mag.toFixed(1)}</span>
                </div>

                <div className="space-y-2">
                    {cosList.map(({ w, cos }) => {
                        const label = closenessLabel(cos);
                        const tone = TONE_STYLE[label.tone];
                        const deg = Math.round(angleBetweenDeg(selPos, positions[w.he]));
                        const pct = Math.round(cos * 100);
                        const isClosest = cos === maxCos;
                        return (
                            <div key={w.he} className={`rounded-xl border px-3 py-2 ${tone.chip}`}>
                                <div className="mb-1.5 flex items-center justify-between gap-2">
                                    <span className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-100">{w.he}</span>
                                        {isClosest && (
                                            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300">הכי קרוב</span>
                                        )}
                                        <span className={`text-[10px] font-bold ${tone.text}`}>{label.he}</span>
                                    </span>
                                    <span className="flex items-center gap-2 font-mono text-[11px] text-slate-400" dir="ltr">
                                        <span>{deg}°</span>
                                        <span className={tone.text}>{pct}%</span>
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-800/80">
                                    <div
                                        className={`h-full rounded-full transition-[width] duration-100 ease-out ${tone.bar}`}
                                        style={{ width: `${Math.max(0, cos) * 100}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                    הזווית הקטנה ביותר (0°) היא אותו כיוון בדיוק, קרבה מלאה. גררו וצפו: כל המספרים נגזרים מהכיוון, וזה בדיוק מה
                    ש-Cosine Similarity מודד.
                </p>
            </div>
        </div>
    );
};

/* ═══════════════════════ ניסוי 2: נחשו את האנלוגיה ═══════════════════════ */

const A_SIZE = 340;
const A_PAD = 46;
const A_XMAX = 10;
const A_YMAX = 8;
const A_W = A_SIZE - 2 * A_PAD;
const aPoint = (v: Vec) => ({
    cx: A_PAD + (v.x / A_XMAX) * A_W,
    cy: A_SIZE - A_PAD - (v.y / A_YMAX) * A_W,
});

const guessQuality = (dist: number): { he: string; tone: 'near' | 'mid' | 'far' } => {
    if (dist < 1.0) return { he: 'פגיעה מצוינת!', tone: 'near' };
    if (dist < 2.2) return { he: 'קרוב מאוד', tone: 'near' };
    if (dist < 3.8) return { he: 'בכיוון הנכון', tone: 'mid' };
    return { he: 'רחוק, שווה לנסות שוב', tone: 'far' };
};

const AnalogyExperiment: React.FC = () => {
    const reduce = useReducedMotion();
    const svgRef = useRef<SVGSVGElement>(null);

    const [guess, setGuess] = useState<Vec>({ x: 5, y: 3 });
    const [dragging, setDragging] = useState(false);
    const [moved, setMoved] = useState(false);
    const [checked, setChecked] = useState(false);
    const [hint, setHint] = useState(false);

    const man = aPoint(ANALOGY.man);
    const woman = aPoint(ANALOGY.woman);
    const king = aPoint(ANALOGY.king);
    const queen = aPoint(ANALOGY.queen);
    const result = aPoint(ANALOGY_RESULT);
    const guessP = aPoint(guess);

    const toDomain = (clientX: number, clientY: number): Vec => {
        const svg = svgRef.current;
        if (!svg) return guess;
        const rect = svg.getBoundingClientRect();
        const sx = (clientX - rect.left) * (A_SIZE / rect.width);
        const sy = (clientY - rect.top) * (A_SIZE / rect.height);
        return {
            x: clamp(((sx - A_PAD) / A_W) * A_XMAX, 0, A_XMAX),
            y: clamp(((A_SIZE - A_PAD - sy) / A_W) * A_YMAX, 0, A_YMAX),
        };
    };

    const startDrag = (e: React.PointerEvent<SVGGElement>) => {
        if (checked) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
    };
    const moveDrag = (e: React.PointerEvent<SVGGElement>) => {
        if (!dragging) return;
        setGuess(toDomain(e.clientX, e.clientY));
        if (!moved) setMoved(true);
    };
    const endDrag = (e: React.PointerEvent<SVGGElement>) => {
        if (dragging) {
            try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
            setDragging(false);
        }
    };

    const reset = () => { setChecked(false); setMoved(false); setHint(false); setGuess({ x: 5, y: 3 }); };

    const dist = Math.hypot(guess.x - ANALOGY_RESULT.x, guess.y - ANALOGY_RESULT.y);
    const quality = guessQuality(dist);
    const qTone = quality.tone === 'near' ? 'text-emerald-300' : quality.tone === 'mid' ? 'text-amber-300' : 'text-rose-300';

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* ── התרשים ───────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Target size={16} className="text-violet-300" />
                        <div className="leading-tight">
                            <div className="text-sm font-bold text-slate-200">איפה ינחת מלך − גבר + אישה?</div>
                            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Drag your guess</div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setHint((h) => !h)}
                        aria-pressed={hint}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition-colors ${
                            hint ? 'border-violet-500/50 bg-violet-900/25 text-violet-200' : 'border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Lightbulb size={13} /> רמז
                    </button>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-slate-700/40 bg-slate-950/50">
                    <svg
                        ref={svgRef}
                        viewBox={`0 0 ${A_SIZE} ${A_SIZE}`}
                        className="w-full select-none"
                        style={{ touchAction: 'none' }}
                        role="img"
                        aria-label="אנלוגיית וקטורים, גררו את הניחוש"
                    >
                        {/* רמז: כיוון המגדר גבר → אישה */}
                        {hint && (
                            <Arrow x1={man.cx} y1={man.cy} x2={woman.cx} y2={woman.cy} color="#a78bfa" dashed label="כיוון המגדר" labelColor="#c4b5fd" />
                        )}

                        {/* תשובת אמת, מתגלה אחרי בדיקה */}
                        {checked && (
                            <motion.g initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.5 }}>
                                <Arrow x1={king.cx} y1={king.cy} x2={result.cx} y2={result.cy} color="#34d399" label="אותו כיוון" labelColor="#6ee7b7" />
                                <circle cx={result.cx} cy={result.cy} r={13} fill="none" stroke="#34d399" strokeWidth={2} />
                            </motion.g>
                        )}

                        {/* ארבע נקודות העוגן */}
                        <WordDot p={man} he="גבר" color="#22d3ee" />
                        <WordDot p={woman} he="אישה" color="#22d3ee" />
                        <WordDot p={king} he="מלך" color="#fbbf24" />
                        {/* "מלכה" חבויה עד הבדיקה, אחרת אין מה לנחש */}
                        {checked && <WordDot p={queen} he="מלכה" color="#fbbf24" />}

                        {/* סמן הניחוש הנגרר */}
                        <g
                            onPointerDown={startDrag}
                            onPointerMove={moveDrag}
                            onPointerUp={endDrag}
                            onPointerCancel={endDrag}
                            style={{ cursor: checked ? 'default' : dragging ? 'grabbing' : 'grab' }}
                        >
                            <circle cx={guessP.cx} cy={guessP.cy} r={20} fill="transparent" />
                            <motion.circle
                                cx={guessP.cx}
                                cy={guessP.cy}
                                r={10}
                                fill="rgba(167,139,250,0.18)"
                                stroke="#a78bfa"
                                strokeWidth={2}
                                strokeDasharray={checked ? undefined : '4 3'}
                                animate={!moved && !checked && !reduce ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                                transition={!moved && !checked && !reduce ? { duration: 1.4, repeat: Infinity } : { duration: 0.2 }}
                                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                            />
                            <text x={guessP.cx} y={guessP.cy + 4} fill="#c4b5fd" fontSize={13} fontWeight={800} textAnchor="middle" pointerEvents="none">?</text>
                        </g>
                    </svg>
                </div>

                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                    הציר האופקי מפריד בין אנשים רגילים (גבר, אישה) לבין מלוכה (מלך, מלכה). הציר האנכי מפריד בין גברי (גבר, מלך) לנשי (אישה, מלכה).
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <GuessButton
                        onClick={() => setChecked(true)}
                        disabled={checked || !moved}
                        reduce={!!reduce}
                        rgb="16,185,129"
                        sheen
                        leadingIcon={<Check size={14} />}
                    >
                        בדקו את הניחוש
                    </GuessButton>
                    <GuessButton
                        variant="ghost"
                        onClick={reset}
                        leadingIcon={<RotateCcw size={14} />}
                    >
                        שוב
                    </GuessButton>
                    {!moved && !checked && <span className="text-[11px] text-slate-500">גררו את הסמן הסגול (?) לאן שלדעתכם התוצאה נוחתת.</span>}
                </div>
            </div>

            {/* ── ההסבר ────────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
                <div className="mb-4 flex items-center gap-2">
                    <Sparkles size={16} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">המשוואה של המשמעות</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">King − Man + Woman ≈ Queen</div>
                    </div>
                </div>

                <div className="mb-4 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-700/50 bg-slate-950/40 p-4 text-center text-base font-bold">
                    <span className="text-amber-300">מלך</span>
                    <span className="text-slate-500">−</span>
                    <span className="text-cyan-300">גבר</span>
                    <span className="text-slate-500">+</span>
                    <span className="text-cyan-300">אישה</span>
                    <span className="text-slate-500">≈</span>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={checked ? 'queen' : 'q'}
                            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={checked ? 'text-emerald-300' : 'text-slate-600'}
                        >
                            {checked ? 'מלכה' : '?'}
                        </motion.span>
                    </AnimatePresence>
                </div>

                {/* המשימה לפני הבדיקה, משוב אחריה */}
                <AnimatePresence mode="wait">
                    {checked ? (
                        <motion.div
                            key="feedback"
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-3 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className={`text-sm font-bold ${qTone}`}>{quality.he}</span>
                                <span className="font-mono text-[11px] text-slate-400" dir="ltr">פער מהמלכה: {dist.toFixed(1)}</span>
                            </div>
                            <p className="mt-1.5 text-[12px] leading-relaxed text-slate-300">
                                התשובה נוחתת על &quot;מלכה&quot;, והנה הקסם: החץ הירוק שיצא מ&quot;מלך&quot; הוא בדיוק אותו כיוון כמו החץ מ&quot;גבר&quot; אל &quot;אישה&quot;. אותו יחס, אותו חץ.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="task"
                            initial={reduce ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-3 rounded-xl border border-violet-500/30 bg-violet-900/10 p-3"
                        >
                            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-violet-200">
                                <Target size={15} /> המשימה
                            </div>
                            <ol className="space-y-1.5 text-[13px] leading-relaxed text-slate-300">
                                <li><span className="font-bold text-violet-300">1.</span> גררו את הסמן הסגול (?) במפה, לאן שלדעתכם נוחתת התוצאה.</li>
                                <li><span className="font-bold text-violet-300">2.</span> לחצו &quot;בדקו את הניחוש&quot; וגלו כמה דייקתם.</li>
                            </ol>
                            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                                רמז: &quot;גבר&quot; ו&quot;אישה&quot; נבדלים בכיוון אחד בלבד. אותו כיוון בדיוק מפריד גם את &quot;מלך&quot; אל מי? לחצו &quot;רמז&quot; כדי לראות את החץ.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-[11px] leading-relaxed text-slate-500">
                    כשהמשמעות הופכת לכיוון במרחב, יחסים בין מילים הופכים לחיבור וחיסור של חצים. כאן הצירים נקיים בכוונה כדי שהמשוואה
                    תצא מדויקת. במרחב אמיתי האנלוגיה מקורבת, אבל העיקרון זהה.
                </p>
            </div>
        </div>
    );
};

/* ── עזרי SVG משותפים ──────────────────────────────────────────────────── */

const WordDot: React.FC<{ p: { cx: number; cy: number }; he: string; color: string; dim?: boolean }> = ({ p, he, color, dim }) => (
    <g style={{ opacity: dim ? 0.45 : 1 }} className="transition-opacity duration-300" pointerEvents="none">
        <circle cx={p.cx} cy={p.cy} r={6} fill={color} />
        <text x={p.cx} y={p.cy - 11} fill="#e2e8f0" fontSize={12} fontWeight={600} textAnchor="middle">{he}</text>
    </g>
);

const Arrow: React.FC<{
    x1: number; y1: number; x2: number; y2: number;
    color: string; dashed?: boolean; label?: string; labelColor?: string;
}> = ({ x1, y1, x2, y2, color, dashed, label, labelColor }) => {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const head = 9;
    const hx = x2 - Math.cos(ang) * 7;
    const hy = y2 - Math.sin(ang) * 7;
    const left = { x: hx - Math.cos(ang - 0.5) * head, y: hy - Math.sin(ang - 0.5) * head };
    const right = { x: hx - Math.cos(ang + 0.5) * head, y: hy - Math.sin(ang + 0.5) * head };
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return (
        <g pointerEvents="none">
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} strokeDasharray={dashed ? '5 4' : undefined} />
            <polygon points={`${x2},${y2} ${left.x},${left.y} ${right.x},${right.y}`} fill={color} />
            {label && <text x={mx + 6} y={my - 6} fill={labelColor ?? color} fontSize={10} fontWeight={700} textAnchor="middle">{label}</text>}
        </g>
    );
};
