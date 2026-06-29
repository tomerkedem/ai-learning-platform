"use client";

// MeaningDnaStrip - חתימת המשמעות כסליל DNA כפול שמסתובב בתלת-ממד, חי וקריא.
// ──────────────────────────────────────────────────────────────────────────
// שני המשפטים הם שני גדילים (ציאן מול ורוד) שמשתזרים בסליל כפול ומסתובבים סביב הציר
// האופקי. כל רכיב משמעות שנדלק הוא זוג בסיסים: צומת על כל גדיל, ושלב (rung) שמחבר ביניהם.
// העומק (קדמי מול אחורי) משנה גודל, בהירות וסדר שכבות, כך שהסיבוב נראה תלת-ממדי אמיתי.
// כשהרכיב חזק בשני המשפטים הוא "נקשר": במרכז השלב נדלק קשר ירוק זוהר שפועם ובאדג' משותף.
// כך הסליל עצמו מוכיח למה המשפטים קרובים. שורת פתיחה במילים, מדריך קריאה קצר ופסיקה אחת
// שומרים על המובנות. הגיאומטריה מאולצת ל-LTR כדי שהכל יתיישר זהה ב-RTL וב-LTR.
// reduced-motion מקפיא את הסיבוב והפעימה ומשאיר סליל סטטי וקריא. aria שומר נגישות והקראה.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';

import type { JoinedSentence, Chapter4LabDict } from '../labContent';
import { DNA_DIMS, dimValue, SENTENCE_COLORS } from '../embeddingEngine';

const DEFAULT_A = { hex: '#22d3ee', rgb: '34,211,238' };
const DEFAULT_B = { hex: '#e879f9', rgb: '232,121,249' };

interface MeaningDnaStripProps {
    active: JoinedSentence;
    compare: JoinedSentence | null;
    geneLabels: Chapter4LabDict['genes'];
    dna: Chapter4LabDict['dna'];
    dir: 'rtl' | 'ltr';
}

const LIT = 0.4; // סף "נדלק" לרכיב
const SHOW = 0.35; // סף הצגה: רכיב מוצג רק אם נדלק לפחות במשפט אחד
const CLOSE = 0.2; // קרבה בין הערכים כדי שרכיב ייחשב משותף (נקשר)
const CLOSE_VERDICT = 0.7; // סף הפסיקה הסופית

const TURNS = 1.5; // מספר הסיבובים של הסליל לרוחב
const R = 24; // רדיוס הסליל באחוזי גובה סביב המרכז (50)
const SAMPLES = 64; // צפיפות דגימה לשרטוט גדיל חלק
const SPIN = 0.9; // מהירות סיבוב ברדיאנים לשנייה

/** קרבה ממוצעת על ממדי ה-DNA (1 = זהה, 0 = רחוק). */
function avgCloseness(a: JoinedSentence, b: JoinedSentence): number {
    const dist = DNA_DIMS.reduce((s, d) => s + Math.abs(dimValue(a.profile, d) - dimValue(b.profile, d)), 0) / DNA_DIMS.length;
    return Math.max(0, 1 - dist);
}

/** שני מסלולי הגדילים בפאזה נתונה (סינוס + הפוך), לרוחב כל הקנבס. */
function strandPaths(phase: number): { a: string; b: string } {
    let a = '';
    let b = '';
    for (let k = 0; k <= SAMPLES; k++) {
        const s = k / SAMPLES;
        const x = s * 100;
        const off = R * Math.sin(s * TURNS * 2 * Math.PI + phase);
        a += `${k === 0 ? 'M' : 'L'}${x.toFixed(2)} ${(50 + off).toFixed(2)} `;
        b += `${k === 0 ? 'M' : 'L'}${x.toFixed(2)} ${(50 - off).toFixed(2)} `;
    }
    return { a: a.trim(), b: b.trim() };
}

export const MeaningDnaStrip: React.FC<MeaningDnaStripProps> = ({ active, compare, geneLabels, dna, dir }) => {
    const reduce = useReducedMotion();

    // פאזת הסיבוב, מונעת ב-rAF. reduced-motion משאיר 0 (סליל סטטי).
    const [phase, setPhase] = useState(0);
    const rafRef = useRef<number | null>(null);
    useEffect(() => {
        // reduced-motion: לא מפעילים לולאה, הפאזה נשארת 0 (סליל סטטי וקריא).
        if (reduce) return;
        let start: number | null = null;
        const loop = (t: number) => {
            if (start === null) start = t;
            setPhase(((t - start) / 1000) * SPIN);
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [reduce]);

    // רק רכיבים שנדלקו לפחות במשפט אחד, כדי לא לשרטט זוגות בסיסים ריקים.
    const litDims = useMemo(
        () => DNA_DIMS.filter((d) => Math.max(dimValue(active.profile, d), compare ? dimValue(compare.profile, d) : 0) >= SHOW),
        [active, compare],
    );

    // רכיב "נקשר" (משותף): חזק בשני המשפטים וקרוב בערכו.
    const sharedSet = useMemo(() => {
        const set = new Set<string>();
        if (!compare) return set;
        DNA_DIMS.forEach((d) => {
            const av = dimValue(active.profile, d);
            const bv = dimValue(compare.profile, d);
            if (av >= LIT && bv >= LIT && Math.abs(av - bv) <= CLOSE) set.add(d);
        });
        return set;
    }, [active, compare]);

    const sharedNames = useMemo(
        () => DNA_DIMS.filter((d) => sharedSet.has(d)).map((d) => geneLabels[d]).join(', '),
        [sharedSet, geneLabels],
    );

    const stayedClose = compare ? avgCloseness(active, compare) >= CLOSE_VERDICT : true;
    const verdict = stayedClose ? dna.stayedClose : dna.drifted;
    const lead = !compare ? '' : sharedSet.size > 0 ? dna.leadShared(sharedNames) : dna.leadNone;

    // צבע חתימה לכל משפט: גדיל A מקבל את צבע המשפט הנבחר, גדיל B את צבע ההשוואה.
    const colorA = SENTENCE_COLORS[active.id] ?? DEFAULT_A;
    const colorB = (compare && SENTENCE_COLORS[compare.id]) || DEFAULT_B;

    // גיאומטריה תלוית פאזה: מיקום הצמתים, העומק (קדמי/אחורי) והגדילים.
    const paths = strandPaths(phase);
    const n = Math.max(1, litDims.length);
    const pairs = litDims.map((d, i) => {
        const s = (i + 0.5) / n;
        const theta = s * TURNS * 2 * Math.PI + phase;
        const off = R * Math.sin(theta);
        const depthA = Math.cos(theta); // +1 קדמי, -1 אחורי
        return {
            d,
            x: s * 100,
            yA: 50 + off,
            yB: 50 - off,
            depthA,
            depthB: -depthA,
            va: dimValue(active.profile, d),
            vb: compare ? dimValue(compare.profile, d) : 0,
            shared: sharedSet.has(d),
        };
    });

    // עומק -> גורם גודל ובהירות (קדמי גדול ובהיר יותר).
    const front = (depth: number) => 0.5 + 0.5 * ((depth + 1) / 2);

    return (
        <div dir={dir} className="text-start">
            <div className="mb-2 text-base font-bold text-slate-100">{dna.title}</div>

            {/* שורת הפתיחה במילים: למה קרוב או רחוק */}
            {lead && <p className="mb-2.5 text-[13px] font-semibold leading-relaxed text-slate-200">{lead}</p>}

            {/* מקרא: איזה גדיל שייך לאיזה משפט */}
            <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] font-bold">
                <span className="inline-flex items-center gap-1.5" style={{ color: colorA.hex }}>
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colorA.hex, boxShadow: `0 0 6px 1px rgba(${colorA.rgb},0.7)` }} /> {active.text}
                </span>
                {compare && (
                    <span className="inline-flex items-center gap-1.5" style={{ color: colorB.hex }}>
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colorB.hex, boxShadow: `0 0 6px 1px rgba(${colorB.rgb},0.7)` }} /> {compare.text}
                    </span>
                )}
            </div>

            {/* ── הסליל הכפול המסתובב. גיאומטריה ב-LTR קבוע כדי שתתיישר זהה בכל כיוון ── */}
            <div
                dir="ltr"
                className="relative h-44 w-full overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 sm:h-52"
            >
                {/* זוהר רקע עדין */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[60px]" />

                {/* חלקיקי אווירה שנסחפים לאט (נגזרים מהפאזה, לא רנדומליים) */}
                {!reduce &&
                    [0.18, 0.5, 0.82].map((px, i) => {
                        const py = 50 + 34 * Math.sin(phase * 0.6 + i * 2.1);
                        return (
                            <span
                                key={`spark-${i}`}
                                className="pointer-events-none absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 blur-[1px]"
                                style={{ left: `${px * 100}%`, top: `${py}%`, opacity: 0.25 + 0.25 * Math.cos(phase + i) }}
                            />
                        );
                    })}

                {/* שלבים וגדילים ב-SVG (מתחת לצמתים) */}
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                    {/* שלבי זוגות הבסיסים */}
                    {pairs.map((p) => (
                        <line
                            key={`rung-${p.d}`}
                            x1={p.x}
                            y1={p.yA}
                            x2={p.x}
                            y2={p.yB}
                            className={p.shared ? 'stroke-emerald-400' : 'stroke-slate-500'}
                            strokeWidth={p.shared ? 1.5 : 0.7}
                            strokeLinecap="round"
                            opacity={p.shared ? 0.9 : 0.28}
                        />
                    ))}

                    {/* שני הגדילים */}
                    <path d={paths.a} fill="none" stroke={colorA.hex} strokeWidth={1.2} strokeLinecap="round" opacity={0.8} />
                    <path d={paths.b} fill="none" stroke={colorB.hex} strokeWidth={1.2} strokeLinecap="round" opacity={0.8} />
                </svg>

                {/* צמתים וקשרים כ-overlay עגול (px קבוע => עיגולים מושלמים, עומק לפי הסיבוב) */}
                {pairs.map((p) => {
                    const fA = front(p.depthA);
                    const fB = front(p.depthB);
                    const sizeA = (9 + p.va * 12) * (0.7 + 0.3 * fA);
                    const sizeB = (9 + p.vb * 12) * (0.7 + 0.3 * fB);
                    const bond = 0.5 + 0.5 * Math.sin(phase * 1.7 + p.x);
                    return (
                        <React.Fragment key={`nodes-${p.d}`}>
                            {/* צומת גדיל A (המשפט הנבחר) */}
                            <span
                                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                                style={{
                                    left: `${p.x}%`,
                                    top: `${p.yA}%`,
                                    width: sizeA,
                                    height: sizeA,
                                    backgroundColor: colorA.hex,
                                    opacity: 0.45 + 0.55 * fA,
                                    zIndex: p.depthA >= 0 ? 20 : 10,
                                    boxShadow: `0 0 ${4 + p.va * 14 * fA}px rgba(${colorA.rgb},${0.35 + p.va * 0.5 * fA})`,
                                }}
                            />
                            {/* צומת גדיל B (משפט ההשוואה) */}
                            {compare && (
                                <span
                                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                                    style={{
                                        left: `${p.x}%`,
                                        top: `${p.yB}%`,
                                        width: sizeB,
                                        height: sizeB,
                                        backgroundColor: colorB.hex,
                                        opacity: 0.45 + 0.55 * fB,
                                        zIndex: p.depthB >= 0 ? 20 : 10,
                                        boxShadow: `0 0 ${4 + p.vb * 14 * fB}px rgba(${colorB.rgb},${0.35 + p.vb * 0.5 * fB})`,
                                    }}
                                />
                            )}
                            {/* קשר זוהר באמצע (זוג בסיסים שנקשר) - פועם כשמשותף */}
                            {p.shared && compare && (
                                <span
                                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300"
                                    style={{
                                        left: `${p.x}%`,
                                        top: '50%',
                                        width: reduce ? 9 : 8 + bond * 4,
                                        height: reduce ? 9 : 8 + bond * 4,
                                        zIndex: 25,
                                        opacity: reduce ? 1 : 0.75 + 0.25 * bond,
                                        boxShadow: `0 0 ${reduce ? 12 : 9 + bond * 8}px 2px rgba(52,211,153,0.85)`,
                                    }}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* תוויות זוגות הבסיסים: שורה מתחת לסליל, מיושרת לעמודות (LTR קבוע, הטקסט מקומי) */}
            <div dir="ltr" className="mt-2 grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                {pairs.map((p) => (
                    <div key={`label-${p.d}`} className="flex flex-col items-center gap-1 text-center">
                        <span className="text-[11px] font-bold leading-tight text-slate-200">{geneLabels[p.d]}</span>
                        {p.shared && (
                            <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-400/40 bg-emerald-900/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-200">
                                <Check size={9} /> {dna.sharedBadge}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* מדריך קריאה קצר: איך לפענח את הסליל */}
            <div className="mt-3 space-y-1.5 rounded-xl border border-slate-700/40 bg-slate-950/30 p-3">
                <p className="flex items-start gap-2 text-[12px] leading-relaxed text-slate-400">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                    {dna.guideSize}
                </p>
                <p className="flex items-start gap-2 text-[12px] leading-relaxed text-slate-400">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_6px_1px_rgba(52,211,153,0.7)]" />
                    {dna.guideBond}
                </p>
            </div>

            {/* פסיקה אחת ברורה */}
            {compare && (
                <div className="mt-3">
                    <span
                        className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-bold ${
                            stayedClose
                                ? 'border-emerald-500/30 bg-emerald-900/15 text-emerald-200'
                                : 'border-amber-500/30 bg-amber-900/15 text-amber-200'
                        }`}
                    >
                        {verdict}
                    </span>
                </div>
            )}

            {/* סיכום מוסתר להקראה */}
            <p className="sr-only" aria-live="polite">
                {active.ttsLine}
                {compare ? ` ${compare.ttsLine} ${lead} ${verdict}.` : ''}
            </p>
        </div>
    );
};
