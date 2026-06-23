"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Compass, MousePointerClick, Sparkles, Play, RotateCcw, Move3d, Info } from 'lucide-react';

import {
    SPACE_WORDS,
    CLUSTER_STYLE,
    ANALOGY,
    ANALOGY_RESULT,
    findWord,
    rankByCloseness,
    angleBetweenDeg,
    closenessLabel,
    TONE_STYLE,
    type ClusterKey,
    type Vec,
} from '@/app/behind-the-scenes-ai/chapter-7/semanticSpace';

/**
 * SemanticSpaceLab - מעבדת פרק 7: "הגיאומטריה של המשמעות".
 * רכיב עצמאי לחלוטין ודטרמיניסטי. שני ניסויים:
 *   1. מרחב המשמעות: מילים כנקודות וחצים, קרבה לפי כיוון (Cosine Similarity).
 *   2. אנלוגיית וקטורים: מלך − גבר + אישה ≈ מלכה.
 * אין כאן embeddings אמיתיים, מודל או רשת. הכל וקטורים קבועים מ-semanticSpace.
 */

type Experiment = 'space' | 'analogy';

/* ── מיפוי קואורדינטות → פיקסלים ל-SVG (ציר y הפוך כדי שלמעלה יהיה למעלה) ── */
const MAP_SIZE = 360;
const MAP_PAD = 42;
const MAP_DOMAIN = 10;
const mapPoint = (v: Vec) => ({
    cx: MAP_SIZE / 2 + (v.x / MAP_DOMAIN) * (MAP_SIZE / 2 - MAP_PAD),
    cy: MAP_SIZE / 2 - (v.y / MAP_DOMAIN) * (MAP_SIZE / 2 - MAP_PAD),
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
                    {([['space', 'קרבה במרחב'], ['analogy', 'אנלוגיית וקטורים']] as const).map(([key, label]) => {
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
                    זהו מרחב לימודי בשני ממדים בלבד, כדי שאפשר יהיה לצייר אותו. במרחב אמיתי יש מאות או אלפי ממדים, והצירים אינם תכונות
                    אנושיות אלא ערכים נלמדים. מה שחשוב לקחת מכאן הוא הרעיון: <span className="font-bold text-slate-400">קרבה במשמעות היא קרבה בכיוון</span>, לא במרחק.
                </span>
            </div>
        </div>
    );
};

/* ═══════════════════════ ניסוי 1: קרבה במרחב ═════════════════════════════ */

const SpaceExperiment: React.FC = () => {
    const reduce = useReducedMotion();
    const [selectedHe, setSelectedHe] = useState<string | null>('חתול');
    const selected = selectedHe ? findWord(selectedHe) ?? null : null;

    const ranking = useMemo(() => (selected ? rankByCloseness(selected) : []), [selected]);

    const selectWord = (he: string) => setSelectedHe((cur) => (cur === he ? null : he));

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* ── המפה ─────────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
                <div className="mb-3 flex items-center gap-2">
                    <Compass size={16} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">מרחב המשמעות</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Semantic Space</div>
                    </div>
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

                <div className="overflow-hidden rounded-xl border border-slate-700/40 bg-slate-950/50">
                    <svg viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`} className="w-full" role="img" aria-label="מפת מילים במרחב סמנטי">
                        {/* צירים דרך הראשית */}
                        <line x1={MAP_SIZE / 2} y1={MAP_PAD / 2} x2={MAP_SIZE / 2} y2={MAP_SIZE - MAP_PAD / 2} stroke="#1e293b" strokeWidth={1} />
                        <line x1={MAP_PAD / 2} y1={MAP_SIZE / 2} x2={MAP_SIZE - MAP_PAD / 2} y2={MAP_SIZE / 2} stroke="#1e293b" strokeWidth={1} />
                        <circle cx={MAP_SIZE / 2} cy={MAP_SIZE / 2} r={3} fill="#475569" />
                        <text x={MAP_SIZE / 2 + 6} y={MAP_SIZE / 2 + 14} fill="#64748b" fontSize={9}>origin</text>

                        {SPACE_WORDS.map((w) => {
                            const p = mapPoint(w);
                            const c = CLUSTER_STYLE[w.cluster];
                            const isSel = selected?.he === w.he;
                            const cos = selected ? angleCos(selected, w) : 1;
                            const dim = selected && !isSel ? 0.2 + 0.8 * Math.max(0, cos) : 1;
                            return (
                                <g
                                    key={w.he}
                                    onClick={() => selectWord(w.he)}
                                    style={{ cursor: 'pointer', opacity: dim }}
                                    className="transition-opacity duration-300"
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
                                    {/* הילה לבחירה */}
                                    {isSel && <circle cx={p.cx} cy={p.cy} r={11} fill="none" stroke={c.hex} strokeWidth={1.5} strokeOpacity={0.5} />}
                                    <circle cx={p.cx} cy={p.cy} r={isSel ? 6.5 : 5} fill={c.hex} />
                                    {/* אזור לחיצה נדיב */}
                                    <circle cx={p.cx} cy={p.cy} r={16} fill="transparent" />
                                    <text
                                        x={p.cx}
                                        y={p.cy - 12}
                                        fill={isSel ? '#f8fafc' : '#cbd5e1'}
                                        fontSize={12}
                                        fontWeight={isSel ? 700 : 500}
                                        textAnchor="middle"
                                    >
                                        {w.he}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                <p className="mt-3 flex items-center gap-2 text-[11px] leading-relaxed text-slate-500">
                    <MousePointerClick size={13} /> לחצו על מילה כדי לראות מה קרוב אליה בכיוון. שימו לב: &quot;אריה&quot; קרוב לראשית יותר
                    מ&quot;חתול&quot;, אבל מצביע לאותו כיוון, ולכן הוא קרוב במשמעות. הכיוון קובע, לא המרחק.
                </p>
            </div>

            {/* ── דירוג קרבה ───────────────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
                <div className="mb-3 flex items-center gap-2">
                    <Sparkles size={16} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">קרבת כיוון</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Cosine Similarity</div>
                    </div>
                </div>

                {!selected ? (
                    <p className="flex items-center gap-2 text-xs leading-relaxed text-slate-500">
                        <MousePointerClick size={14} /> בחרו מילה במפה כדי לדרג את שאר המילים לפי קרבת הכיוון אליה.
                    </p>
                ) : (
                    <>
                        <div className="mb-3 flex items-center gap-2 text-sm">
                            <span className="text-slate-400">קרבה אל</span>
                            <span className={`rounded-md border px-2 py-0.5 font-bold ${CLUSTER_STYLE[selected.cluster].chip} ${CLUSTER_STYLE[selected.cluster].text}`}>
                                {selected.he}
                            </span>
                        </div>
                        <div className="space-y-2">
                            {ranking.map(({ word, cos }) => {
                                const label = closenessLabel(cos);
                                const tone = TONE_STYLE[label.tone];
                                const deg = Math.round(angleBetweenDeg(selected, word));
                                const pct = Math.round(cos * 100);
                                return (
                                    <div key={word.he} className={`rounded-xl border px-3 py-2 ${tone.chip}`}>
                                        <div className="mb-1.5 flex items-center justify-between gap-2">
                                            <span className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-100">{word.he}</span>
                                                <span className={`text-[10px] font-bold ${tone.text}`}>{label.he}</span>
                                            </span>
                                            <span className="flex items-center gap-2 font-mono text-[11px] text-slate-400" dir="ltr">
                                                <span>{deg}°</span>
                                                <span className={tone.text}>{pct}%</span>
                                            </span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-800/80">
                                            <motion.div
                                                initial={reduce ? false : { width: 0 }}
                                                animate={{ width: `${Math.max(0, cos) * 100}%` }}
                                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}
                                                className={`h-full rounded-full ${tone.bar}`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                            הזווית הקטנה ביותר (0°) היא אותו כיוון בדיוק, קרבה מלאה. ככל שהזווית גדלה, המשמעות מתרחקת. זה בדיוק מה
                            ש-Cosine Similarity מודד: כיוון, לא מרחק.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

/** עזר פנימי: Cosine בין שני וקטורים (לחישוב העמעום במפה). */
function angleCos(a: Vec, b: Vec): number {
    const m = Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y);
    return m === 0 ? 0 : (a.x * b.x + a.y * b.y) / m;
}

/* ═══════════════════════ ניסוי 2: אנלוגיית וקטורים ═══════════════════════ */

const A_SIZE = 340;
const A_PAD = 46;
const A_XMAX = 10;
const A_YMAX = 8;
const aPoint = (v: Vec) => ({
    cx: A_PAD + (v.x / A_XMAX) * (A_SIZE - 2 * A_PAD),
    cy: A_SIZE - A_PAD - (v.y / A_YMAX) * (A_SIZE - 2 * A_PAD),
});

const AnalogyExperiment: React.FC = () => {
    const reduce = useReducedMotion();
    const [revealed, setRevealed] = useState(false);

    const man = aPoint(ANALOGY.man);
    const woman = aPoint(ANALOGY.woman);
    const king = aPoint(ANALOGY.king);
    const queen = aPoint(ANALOGY.queen);
    const result = aPoint(ANALOGY_RESULT);

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* ── התרשים ───────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
                <div className="mb-3 flex items-center gap-2">
                    <Move3d size={16} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">אנלוגיה במרחב</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Vector Analogy</div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-700/40 bg-slate-950/50">
                    <svg viewBox={`0 0 ${A_SIZE} ${A_SIZE}`} className="w-full" role="img" aria-label="אנלוגיית וקטורים: מלך פחות גבר ועוד אישה">
                        {/* כיוון המגדר: גבר → אישה */}
                        <Arrow x1={man.cx} y1={man.cy} x2={woman.cx} y2={woman.cy} color="#a78bfa" dashed label="כיוון המגדר" labelColor="#c4b5fd" />

                        {/* אותו כיוון מגדר, מוחל על מלך → מלכה (מתגלה בלחיצה) */}
                        {revealed && (
                            <motion.g
                                initial={reduce ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: reduce ? 0 : 0.5 }}
                            >
                                <Arrow x1={king.cx} y1={king.cy} x2={result.cx} y2={result.cy} color="#34d399" label="אותו כיוון" labelColor="#6ee7b7" />
                            </motion.g>
                        )}

                        {/* ארבע הנקודות */}
                        <WordDot p={man} he="גבר" color="#22d3ee" />
                        <WordDot p={woman} he="אישה" color="#22d3ee" />
                        <WordDot p={king} he="מלך" color="#fbbf24" />
                        <WordDot p={queen} he="מלכה" color="#fbbf24" dim={!revealed} />

                        {/* נקודת התוצאה המחושבת, נוחתת על מלכה */}
                        {revealed && (
                            <motion.circle
                                cx={result.cx}
                                cy={result.cy}
                                r={13}
                                fill="none"
                                stroke="#34d399"
                                strokeWidth={2}
                                initial={reduce ? false : { scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: reduce ? 0 : 0.4 }}
                                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                            />
                        )}
                    </svg>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setRevealed(true)}
                        disabled={revealed}
                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-900/15 px-3 py-2 text-sm font-bold text-emerald-300 transition-colors hover:brightness-110 disabled:opacity-40"
                    >
                        <Play size={14} /> הריצו את האנלוגיה
                    </button>
                    <button
                        type="button"
                        onClick={() => setRevealed(false)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-sm font-bold text-slate-400 transition-colors hover:text-slate-200"
                    >
                        <RotateCcw size={14} /> איפוס
                    </button>
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
                            key={revealed ? 'queen' : 'q'}
                            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={revealed ? 'text-emerald-300' : 'text-slate-600'}
                        >
                            {revealed ? 'מלכה' : '?'}
                        </motion.span>
                    </AnimatePresence>
                </div>

                <p className="text-sm leading-relaxed text-slate-300">
                    החץ הסגול הוא &quot;כיוון המגדר&quot;: ההפרש בין &quot;גבר&quot; ל&quot;אישה&quot;. הרעיון המפתיע הוא שאותו כיוון בדיוק מחבר גם את &quot;מלך&quot;
                    ל&quot;מלכה&quot;. לכן אם לוקחים את &quot;מלך&quot;, מורידים את הכיוון של &quot;גבר&quot; ומוסיפים את הכיוון של &quot;אישה&quot;, נוחתים כמעט בדיוק על
                    &quot;מלכה&quot;.
                </p>
                <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                    זו לא קסם ולא מקריות: כשהמשמעות הופכת לכיוון במרחב, יחסים בין מילים הופכים לחיבור וחיסור של חצים. כאן הצירים נקיים
                    בכוונה כדי שהמשוואה תצא מדויקת. במרחב אמיתי האנלוגיה מקורבת, אבל העיקרון זהה.
                </p>
            </div>
        </div>
    );
};

/* ── עזרי SVG משותפים ל-ניסוי האנלוגיה ─────────────────────────────────── */

const WordDot: React.FC<{ p: { cx: number; cy: number }; he: string; color: string; dim?: boolean }> = ({ p, he, color, dim }) => (
    <g style={{ opacity: dim ? 0.45 : 1 }} className="transition-opacity duration-300">
        <circle cx={p.cx} cy={p.cy} r={6} fill={color} />
        <text x={p.cx} y={p.cy - 11} fill="#e2e8f0" fontSize={12} fontWeight={600} textAnchor="middle">{he}</text>
    </g>
);

const Arrow: React.FC<{
    x1: number; y1: number; x2: number; y2: number;
    color: string; dashed?: boolean; label?: string; labelColor?: string;
}> = ({ x1, y1, x2, y2, color, dashed, label, labelColor }) => {
    // ראש חץ קטן מחושב מזווית הקו
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const head = 9;
    const hx = x2 - Math.cos(ang) * 7;
    const hy = y2 - Math.sin(ang) * 7;
    const left = { x: hx - Math.cos(ang - 0.5) * head, y: hy - Math.sin(ang - 0.5) * head };
    const right = { x: hx - Math.cos(ang + 0.5) * head, y: hy - Math.sin(ang + 0.5) * head };
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return (
        <g>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} strokeDasharray={dashed ? '5 4' : undefined} />
            <polygon points={`${x2},${y2} ${left.x},${left.y} ${right.x},${right.y}`} fill={color} />
            {label && (
                <text x={mx + 6} y={my - 6} fill={labelColor ?? color} fontSize={10} fontWeight={700} textAnchor="middle">{label}</text>
            )}
        </g>
    );
};
