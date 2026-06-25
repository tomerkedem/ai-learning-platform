"use client";

// components/ai-internals/IntroStationViz.tsx
//
// המחשות אינטראקטיביות קצרות שנפתחות בתוך כרטיס תחנה במפת המבוא. כל המחשה
// מלמדת מושג אחד, לא מקשטת. אין כאן מודל אמיתי: אלה דוגמאות לימודיות מוחשיות.
//
// ── יושרה ─────────────────────────────────────────────────────────────────────
// המספרים והאחוזים כאן הם דוגמה להמחשה בלבד, לא פלט אמיתי של מודל.
//
// ── reduced-motion ────────────────────────────────────────────────────────────
// כל המחשה מקבלת reduce. כשהתנועה מצומצמת מציגים את אותו מצב קונספטואלי הסופי
// בלי תנועה מונפשת, כך שהרעיון עדיין נקרא.

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CornerDownLeft } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';
import type { StationVizKind } from '@/app/behind-the-scenes-ai/introduction/introContent';

interface VizProps {
    accent: Accent;
    reduce: boolean;
}

const VIZ_NOTE = 'מספרים להמחשה בלבד, לא פלט אמיתי של מודל.';

function Caption({ children }: { children: React.ReactNode }) {
    return <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{children}</p>;
}

/* ── 1 · פירוק לטוקנים: המשפט נחתך לצ׳יפים ── */
const TOKENIZE_SAMPLE = ['החבילה', 'שלי', 'לא', 'הגיעה'];

function TokenizeViz({ accent, reduce }: VizProps) {
    const a = ACCENTS[accent];
    return (
        <div>
            <div className="mb-3 rounded-lg border border-white/5 bg-slate-950/50 px-3 py-2 text-sm text-slate-300">
                החבילה שלי לא הגיעה
            </div>
            <div className="flex flex-wrap gap-2" dir="rtl">
                {TOKENIZE_SAMPLE.map((tok, i) => (
                    <motion.span
                        key={tok}
                        initial={reduce ? false : { opacity: 0, y: 8, scale: 0.85 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={reduce ? { duration: 0 } : { delay: i * 0.12, type: 'spring', stiffness: 320, damping: 22 }}
                        className={`inline-flex items-center gap-1.5 rounded-lg border ${a.border} bg-slate-950/60 px-2.5 py-1.5`}
                    >
                        <span className="font-mono text-[9px] text-slate-600">{i + 1}</span>
                        <span className={`text-sm font-bold ${a.text}`}>{tok}</span>
                    </motion.span>
                ))}
            </div>
            <Caption>הטקסט נחתך ליחידות. במודל אמיתי החיתוך לפעמים נכנס גם לתוך מילה.</Caption>
        </div>
    );
}

/* ── 2 · מטוקן למזהה לווקטור ── */
const EMB_VECTOR = ['0.12', '-0.44', '0.91', '0.07', '-0.28'];

function EmbeddingViz({ accent, reduce }: VizProps) {
    const a = ACCENTS[accent];
    const step = (i: number) => (reduce ? {} : { delay: i * 0.25 });
    return (
        <div>
            <div className="flex flex-wrap items-center gap-2" dir="rtl">
                <motion.span
                    initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: reduce ? 0 : 0.3, ...step(0) }}
                    className={`rounded-lg border ${a.border} bg-slate-950/60 px-2.5 py-1.5 text-sm font-bold ${a.text}`}
                >
                    החבילה
                </motion.span>

                <ArrowLeft size={14} className="text-slate-600" aria-hidden />

                <motion.span
                    initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: reduce ? 0 : 0.3, ...step(1) }}
                    className="rounded-lg border border-white/10 bg-slate-950/60 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-300"
                    dir="ltr"
                >
                    ID 4812
                </motion.span>

                <ArrowLeft size={14} className="text-slate-600" aria-hidden />

                <div className="flex items-center gap-1" dir="ltr">
                    {EMB_VECTOR.map((v, i) => (
                        <motion.span
                            key={i}
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: reduce ? 0 : 0.25, delay: reduce ? 0 : 0.5 + i * 0.08 }}
                            className="rounded-md border border-white/10 bg-slate-950/60 px-1.5 py-1 font-mono text-[10px] text-slate-300"
                        >
                            {v}
                        </motion.span>
                    ))}
                    <span className="px-1 font-mono text-[10px] text-slate-600">...</span>
                </div>
            </div>
            <Caption>הטוקן הופך למזהה במילון, ואז לווקטור מספרים שמקודד משמעות. {VIZ_NOTE}</Caption>
        </div>
    );
}

/* ── 3 · קשב: קשר בין טוקנים לפי הקשר ── */
// "הוא" בודק על מי להישען. קשר חזק אל "הכלב" (למי הוא מתייחס), קשר חלש אל טוקן אחר.
// הקווים נמדדים מול מיקומי הטוקנים בפועל כדי שינחתו עליהם ולא ייתלו באוויר.
const ATTN = {
    tokens: ['הכלב', 'רץ', 'כי', 'הוא', 'שמח'],
    focus: 3,   // "הוא"
    strong: 0,  // "הכלב"
    weak: 4,    // "שמח"
};

type AttnArc = { d: string; tx: number; ty: number; lx: number; ly: number };

function AttentionViz({ accent, reduce }: VizProps) {
    const a = ACCENTS[accent];
    const wrapRef = useRef<HTMLDivElement>(null);
    const tokRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [geo, setGeo] = useState<{ w: number; h: number; strong: AttnArc; weak: AttnArc } | null>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const compute = () => {
            const els = tokRefs.current;
            const f = els[ATTN.focus], s = els[ATTN.strong], w = els[ATTN.weak];
            if (!f || !s || !w) return;
            const cb = wrap.getBoundingClientRect();
            const topOf = (el: HTMLElement) => {
                const r = el.getBoundingClientRect();
                return { x: r.left - cb.left + r.width / 2, y: r.top - cb.top };
            };
            const fp = topOf(f);
            const toArc = (p: { x: number; y: number }): AttnArc => {
                const cx = (fp.x + p.x) / 2;
                const cy = Math.min(fp.y, p.y) - 26;
                return { d: `M ${fp.x} ${fp.y} Q ${cx} ${cy} ${p.x} ${p.y}`, tx: p.x, ty: p.y, lx: cx, ly: (fp.y + 2 * cy + p.y) / 4 };
            };
            setGeo({ w: cb.width, h: cb.height, strong: toArc(topOf(s)), weak: toArc(topOf(w)) });
        };
        const raf = requestAnimationFrame(compute);
        const ro = new ResizeObserver(compute);
        ro.observe(wrap);
        return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    }, []);

    return (
        <div>
            <div ref={wrapRef} className="relative pt-14" dir="rtl">
                {geo && (
                    <svg
                        className={`pointer-events-none absolute left-0 top-0 ${a.text}`}
                        width={geo.w}
                        height={geo.h}
                        viewBox={`0 0 ${geo.w} ${geo.h}`}
                        aria-hidden
                    >
                        {/* קשר חלש */}
                        <motion.path
                            d={geo.weak.d} fill="none" stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" opacity={0.35}
                            initial={reduce ? false : { pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: 'easeInOut' }}
                        />
                        <circle cx={geo.weak.tx} cy={geo.weak.ty} r={2.5} fill="currentColor" opacity={0.4} />
                        {/* קשר חזק: הילה + קו + נקודת-נחיתה */}
                        <circle cx={geo.strong.tx} cy={geo.strong.ty} r={7} fill="currentColor" opacity={0.18} />
                        <motion.path
                            d={geo.strong.d} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"
                            initial={reduce ? false : { pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: 'easeInOut', delay: reduce ? 0 : 0.15 }}
                        />
                        <circle cx={geo.strong.tx} cy={geo.strong.ty} r={3.5} fill="currentColor" />
                    </svg>
                )}

                {/* תוויות קצרות ליד הקווים */}
                {geo && (
                    <>
                        <span
                            className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-full border ${a.border} bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-bold ${a.text}`}
                            style={{ left: geo.strong.lx, top: geo.strong.ly }}
                        >
                            קשר חזק
                        </span>
                        <span
                            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-full border border-white/10 bg-slate-950/70 px-1.5 py-0.5 text-[9px] font-bold text-slate-400"
                            style={{ left: geo.weak.lx, top: geo.weak.ly }}
                        >
                            חלש
                        </span>
                    </>
                )}

                <div className="flex flex-wrap items-center gap-2">
                    {ATTN.tokens.map((tok, i) => {
                        const cls =
                            i === ATTN.focus ? `${a.border} bg-slate-950/70 ${a.text} ring-1 ${a.ringSoft}`
                                : i === ATTN.strong ? `${a.border} bg-slate-950/60 ${a.text}`
                                    : i === ATTN.weak ? 'border-white/10 bg-slate-950/50 text-slate-300'
                                        : 'border-white/5 bg-slate-950/40 text-slate-500';
                        return (
                            <span
                                key={tok}
                                ref={(el) => { tokRefs.current[i] = el; }}
                                className={`rounded-lg border px-2.5 py-1.5 text-sm font-bold ${cls}`}
                            >
                                {tok}
                            </span>
                        );
                    })}
                </div>
            </div>
            <Caption>{'המודל קושר בין "הוא" ל"הכלב" לפי ההקשר, ויש לו קשר חלש יותר לטוקנים אחרים.'}</Caption>
        </div>
    );
}

/* ── 4 · מציונים גולמיים להסתברויות ── */
const SCORE_ROWS = [
    { label: 'שמש', raw: 8.2, prob: 72 },
    { label: 'גשם', raw: 6.1, prob: 19 },
    { label: 'ענן', raw: 4.0, prob: 6 },
];

function ScoresViz({ accent, reduce }: VizProps) {
    const a = ACCENTS[accent];
    const maxRaw = 10; // קנה מידה קבוע לעמודות הציון הגולמי
    return (
        <div className="flex flex-col gap-2.5">
            {SCORE_ROWS.map((row, i) => (
                <div key={row.label} className="flex items-center gap-2.5" dir="rtl">
                    <span className="w-10 shrink-0 text-xs font-bold text-slate-300">{row.label}</span>
                    {/* ציון גולמי */}
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800/70">
                        <motion.div
                            className="h-full rounded-full bg-slate-500"
                            initial={reduce ? false : { width: 0 }}
                            whileInView={{ width: `${(row.raw / maxRaw) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.1 }}
                        />
                    </div>
                    <span className="w-8 shrink-0 text-left font-mono text-[10px] text-slate-500" dir="ltr">{row.raw}</span>
                    <CornerDownLeft size={12} className="shrink-0 text-slate-600" aria-hidden />
                    {/* הסתברות */}
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800/70">
                        <motion.div
                            className={`h-full rounded-full ${a.barGradient}`}
                            initial={reduce ? false : { width: 0 }}
                            whileInView={{ width: `${row.prob}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.5 + i * 0.1 }}
                        />
                    </div>
                    <span className={`w-9 shrink-0 text-left font-mono text-[10px] font-bold ${a.text}`} dir="ltr">{row.prob}%</span>
                </div>
            ))}
            <Caption>הציונים הגולמיים (אפור) הופכים להסתברויות שמסתכמות ל-100%. {VIZ_NOTE}</Caption>
        </div>
    );
}

/* ── 5 · לולאת הטוקן הבא ── */
const LOOP_STEPS = ['היום', 'היום צפוי', 'היום צפוי שמש'];

function LoopViz({ accent, reduce }: VizProps) {
    const a = ACCENTS[accent];
    return (
        <div>
            <div className="flex flex-col gap-2" dir="rtl">
                {LOOP_STEPS.map((line, i) => (
                    <motion.div
                        key={line}
                        initial={reduce ? false : { opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: reduce ? 0 : 0.35, delay: reduce ? 0 : i * 0.5 }}
                        className="flex items-center gap-2"
                    >
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${a.solid} ${a.solidText}`} dir="ltr">{i + 1}</span>
                        <span className="rounded-lg border border-white/5 bg-slate-950/50 px-2.5 py-1 text-sm text-slate-200">{line}</span>
                    </motion.div>
                ))}
            </div>
            <div className={`mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold ${a.text}`}>
                <CornerDownLeft size={12} aria-hidden />
                וכך הלאה, טוקן אחרי טוקן, עד סימן עצירה
            </div>
        </div>
    );
}

const VIZ_MAP: Record<StationVizKind, React.FC<VizProps>> = {
    tokenize: TokenizeViz,
    embedding: EmbeddingViz,
    attention: AttentionViz,
    scores: ScoresViz,
    loop: LoopViz,
};

export const StationViz: React.FC<{ kind: StationVizKind } & VizProps> = ({ kind, accent, reduce }) => {
    const Cmp = VIZ_MAP[kind];
    return (
        <div className="mt-3 rounded-xl border border-white/5 bg-slate-950/40 p-3.5">
            <Cmp accent={accent} reduce={reduce} />
        </div>
    );
};
