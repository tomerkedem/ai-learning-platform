"use client";

// MeaningDnaStrip - חתימת המשמעות כסולם DNA אנכי, קריא ומלמד.
// ──────────────────────────────────────────────────────────────────────────
// כל רכיב משמעות (גן) יושב בשורה משלו, עם התווית שלו לצד הסולם, כך שקל לקרוא אחד-אחד.
// שני המשפטים הם שני גדילים: צומת ציאן בצד אחד וצומת ורוד בצד השני. גודל הצומת מקודד
// דבר אחד בלבד: כמה הרכיב חזק באותו משפט. אין קידוד כפול של עומק או סיבוב.
// כששני המשפטים חזקים באותו רכיב ובערך דומה, נדלק במרכז "קשר" ירוק זוהר - זה בדיוק מה
// שמקרב את שתי המשמעות, וזו ההמחשה החזותית. רצועות ההליקס משני הצדדים מתפתלות בעדינות
// כדי לשמור על זהות DNA תלת-ממדית, אבל הן דקורטיביות בלבד ולא נוגעות בגודל הצמתים.
// כשמחליפים מילה או בוחרים משפט אחר, הרכיבים שבהם הקשר נוצר או נשבר מהבהבים לרגע, כדי
// שיהיה ברור מה בדיוק השתנה ולמה הפסיקה התהפכה. הגיאומטריה של הסולם נעולה ל-LTR כדי
// שתתיישר זהה ב-RTL וב-LTR, והתוויות מקבלות את כיוון השפה. reduced-motion מקפיא את
// הפיתול, הפעימה וההבהוב ומשאיר סולם סטטי וקריא לחלוטין. aria שומר נגישות והקראה.

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';

import type { JoinedSentence, Chapter4LabDict } from '../labContent';
import { DNA_DIMS, dimValue } from '../embeddingEngine';

// צבע לפי תפקיד וקבוע: ציאן = המשפט שבחרת, סגול = המשפט להשוואה. הצבע לא תלוי בזהות
// המשפט (בניגוד למפה), כדי שהעין תקרא "מי מול מי" ולא תחפש משמעות בצבע המתחלף.
// lightInk: גוון כהה של אותו תפקיד לטקסט המקרא על משטח בהיר (Dark משתמש ב-hex עצמו).
const ROLE_A = { hex: '#22d3ee', rgb: '34,211,238', lightInk: '#0e7490' }; // המשפט שבחרת
const ROLE_B = { hex: '#a78bfa', rgb: '167,139,250', lightInk: '#7c3aed' }; // המשפט להשוואה

interface MeaningDnaStripProps {
    active: JoinedSentence;
    compare: JoinedSentence | null;
    geneLabels: Chapter4LabDict['genes'];
    dna: Chapter4LabDict['dna'];
    dir: 'rtl' | 'ltr';
    /** מספר המעבדה בפרק (מוצג כתג ליד הכותרת). לא מוצג אם לא הועבר. */
    labNumber?: number;
    /** דריסת כותרת ה-strip. ברירת מחדל: dna.title. מאפשר לפרק אחר (למשל פרק 5) למסגר
     *  את אותה חתימת DNA לתפקיד משלו בלי לשכפל את הרכיב או לגעת בטקסט של פרק 4. */
    title?: string;
    /** דריסת פסקת המבוא. ברירת מחדל: dna.intro. */
    intro?: string;
    /** האם להציג את פסקת המבוא. ברירת מחדל true. פרק שכבר ממסגר את המקטע מבחוץ יכול
     *  לכבות אותה כדי למנוע מבוא כפול. */
    showIntro?: boolean;
}

const LIT = 0.4; // סף "נדלק" לרכיב
const SHOW = 0.35; // סף הצגה: רכיב מוצג רק אם נדלק לפחות במשפט אחד
const CLOSE = 0.2; // קרבה בין הערכים כדי שרכיב ייחשב משותף (נקשר)
const CLOSE_VERDICT = 0.7; // סף הפסיקה הסופית

const TWISTS = 1.6; // מספר הפיתולים של ההליקס לאורך הגובה
const TIGHT_SEP = 18; // מרחק ממוצע בין הגדילים כשהמשמעות קרובה (הליקס כרוך הדוק)
const LOOSE_SEP = 50; // מרחק ממוצע בין הגדילים כשהמשמעות נסחפת (הגדילים נפרדים)
const TWIST_AMP = 10; // עומק הפיתול (זהות ההליקס, קבוע ולא תלוי בנתונים)
const MIN_HALF = 8; // חצי-מרחק מינימלי כדי שהצמתים לא ייבלעו זה בזה במרכז
const SPIN = 0.55; // מהירות פיתול רגועה (רדיאנים לשנייה)
const SAMPLES = 48; // צפיפות דגימה לשרטוט גדיל חלק
const LANE = 64; // גובה שורת רכיב בפיקסלים

/** קרבה ממוצעת על ממדי ה-DNA (1 = זהה, 0 = רחוק). */
function avgCloseness(a: JoinedSentence, b: JoinedSentence): number {
    const dist = DNA_DIMS.reduce((s, d) => s + Math.abs(dimValue(a.profile, d) - dimValue(b.profile, d)), 0) / DNA_DIMS.length;
    return Math.max(0, 1 - dist);
}

/**
 * חצי המרחק בין הגדיל למרכז בגובה יחסי t (0..1). המרכז נקבע לפי הקרבה: משמעות קרובה ->
 * גדילים כרוכים הדוק (מרחק קטן), משמעות נסחפת -> גדילים נפרדים (מרחק גדול). על המרכז
 * רוכב פיתול קבוע בעוצמת TWIST_AMP שנותן את צורת ה-DNA, ואינו תלוי בנתונים.
 */
function halfAt(t: number, phase: number, closeness: number): number {
    const center = LOOSE_SEP - (LOOSE_SEP - TIGHT_SEP) * closeness; // קרוב -> TIGHT, רחוק -> LOOSE
    const sep = center + TWIST_AMP * Math.cos(t * TWISTS * 2 * Math.PI + phase);
    return Math.max(MIN_HALF, sep / 2);
}

/** שני מסלולי הגדילים לכל גובה הסולם בפאזה נתונה (x ב-0..100, y ב-0..100). */
function railPaths(phase: number, closeness: number): { a: string; b: string } {
    let a = '';
    let b = '';
    for (let k = 0; k <= SAMPLES; k++) {
        const t = k / SAMPLES;
        const y = t * 100;
        const half = halfAt(t, phase, closeness);
        a += `${k === 0 ? 'M' : 'L'}${(50 - half).toFixed(2)} ${y.toFixed(2)} `;
        b += `${k === 0 ? 'M' : 'L'}${(50 + half).toFixed(2)} ${y.toFixed(2)} `;
    }
    return { a: a.trim(), b: b.trim() };
}

export const MeaningDnaStrip: React.FC<MeaningDnaStripProps> = ({ active, compare, geneLabels, dna, dir, labNumber, title, intro, showIntro = true }) => {
    const reduce = useReducedMotion();

    // פאזת הפיתול, מונעת ב-rAF. reduced-motion משאיר 0 (סולם סטטי וקריא).
    const [phase, setPhase] = useState(0);
    const rafRef = useRef<number | null>(null);
    const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
    useEffect(() => {
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

    // רק רכיבים שנדלקו לפחות במשפט אחד, כדי לא לצייר שורות ריקות.
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

    // הבהוב "מה השתנה": רכיבים שהקשר שלהם נוצר או נשבר מאז הבחירה הקודמת.
    // הזיהוי נעשה באפקט מול ref (גישה ל-ref מותרת באפקט), ו-setFlash נקרא רק בתוך timeout
    // אסינכרוני: ההבהוב נדלק בטיק הבא ונכבה אחרי 1.5 שניות, בלי setState סינכרוני באפקט.
    const prevRef = useRef<{ sig: string; shared: Set<string> } | null>(null);
    const [flash, setFlash] = useState<Set<string>>(new Set());
    useEffect(() => {
        const sig = `${active.id}|${compare?.id ?? ''}`;
        const prev = prevRef.current;
        prevRef.current = { sig, shared: new Set(sharedSet) };
        if (!prev || prev.sig === sig || reduce) return;
        const changed = new Set<string>();
        DNA_DIMS.forEach((d) => {
            if (prev.shared.has(d) !== sharedSet.has(d)) changed.add(d);
        });
        if (changed.size === 0) return;
        const onId = setTimeout(() => setFlash(changed), 0);
        const offId = setTimeout(() => setFlash(new Set()), 1500);
        return () => {
            clearTimeout(onId);
            clearTimeout(offId);
        };
    }, [active.id, compare?.id, sharedSet, reduce]);

    const sharedNames = useMemo(
        () => DNA_DIMS.filter((d) => sharedSet.has(d)).map((d) => geneLabels[d]).join(', '),
        [sharedSet, geneLabels],
    );

    // קרבה כוללת בין שני המשפטים (1 = זהה). מניעה גם את הפסיקה וגם את הידוק ההליקס.
    const closeness = compare ? avgCloseness(active, compare) : 0.7;
    const stayedClose = compare ? closeness >= CLOSE_VERDICT : true;
    const verdict = stayedClose ? dna.stayedClose : dna.drifted;
    const lead = !compare ? '' : sharedSet.size > 0 ? dna.leadShared(sharedNames) : dna.leadNone;

    // צבע לפי תפקיד וקבוע (לא לפי זהות המשפט): ציאן = שבחרת, סגול = להשוואה.
    const colorA = ROLE_A;
    const colorB = ROLE_B;

    const n = Math.max(1, litDims.length);
    const rails = railPaths(phase, closeness);

    // נתוני שורה לכל רכיב: גובה יחסי, מיקומי הצמתים בפאזה הנוכחית, עוצמות וקשר.
    const rows = litDims.map((d, i) => {
        const t = (i + 0.5) / n;
        const half = halfAt(t, phase, closeness);
        return {
            d,
            yPct: t * 100,
            xA: 50 - half,
            xB: 50 + half,
            va: dimValue(active.profile, d),
            vb: compare ? dimValue(compare.profile, d) : 0,
            shared: sharedSet.has(d),
            flashed: flash.has(d),
        };
    });

    // מצב תנועה מופחתת נקבע רק אחרי ה-mount, כדי שה-style בהידרציה יהיה זהה לשרת.
    const still = mounted && reduce;
    const bondPulse = still ? 1 : 0.5 + 0.5 * Math.sin(phase * 1.6);
    const helixHeight = n * LANE;

    return (
        <div dir={dir} className="text-start">
            <div className="mb-2 flex items-center gap-2.5">
                {labNumber != null && (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))_50%,transparent)] bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(60%_+_var(--bts-tint-mix)_*_0.4),transparent)] font-mono text-sm font-black text-[var(--bts-text-body)]">
                        {labNumber}
                    </span>
                )}
                <div className="text-base font-bold text-[var(--bts-text-bright)]">{title ?? dna.title}</div>
            </div>

            {/* מסגור: למה זה DNA ומה כל חלק אומר. ניתן לכיבוי/דריסה מבחוץ (showIntro/intro). */}
            {showIntro && <p className="mb-2.5 text-[12px] leading-relaxed text-[var(--bts-text-muted)]">{intro ?? dna.intro}</p>}

            {/* שורת הפתיחה במילים: למה קרוב או רחוק */}
            {lead && <p className="mb-2.5 text-[13px] font-semibold leading-relaxed text-[var(--bts-text-body)]">{lead}</p>}

            {/* מקרא לפי תפקיד: ציאן = המשפט שבחרת, סגול = המשפט להשוואה */}
            <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] font-bold">
                <span className="inline-flex items-center gap-1.5" style={{ color: `color-mix(in oklab, ${colorA.lightInk} var(--bts-tint-mix), ${colorA.hex})` }}>
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: colorA.hex, boxShadow: `0 0 6px 1px rgba(${colorA.rgb},0.7)` }} />
                    <span className="text-[10px] uppercase tracking-wide opacity-75">{dna.roleActive}</span>
                    <span>{active.text}</span>
                </span>
                {compare && (
                    <span className="inline-flex items-center gap-1.5" style={{ color: `color-mix(in oklab, ${colorB.lightInk} var(--bts-tint-mix), ${colorB.hex})` }}>
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: colorB.hex, boxShadow: `0 0 6px 1px rgba(${colorB.rgb},0.7)` }} />
                        <span className="text-[10px] uppercase tracking-wide opacity-75">{dna.roleCompare}</span>
                        <span>{compare.text}</span>
                    </span>
                )}
            </div>

            {/* ── סולם ה-DNA: עמודת הליקס + עמודת תוויות, מיושרות שורה מול שורה ── */}
            <div data-theme="dark" className="flex items-stretch gap-2 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-3 sm:gap-3 sm:p-4">
                {/* עמודת ההליקס. dir=ltr קבוע כדי שצומת A תמיד משמאל וההתיישרות זהה בכל שפה */}
                <div dir="ltr" className="relative flex-[0_0_56%] sm:flex-[0_0_58%]" style={{ height: helixHeight }}>
                    {/* זוהר רקע עדין */}
                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[60px]" />

                    {/* רצועות ההליקס ושלבי הסולם (מתחת לצמתים) */}
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                        {/* שלבי זוגות הבסיסים */}
                        {rows.map((p) => (
                            <line
                                key={`rung-${p.d}`}
                                x1={p.xA}
                                y1={p.yPct}
                                x2={p.xB}
                                y2={p.yPct}
                                className={p.shared ? 'stroke-emerald-400' : 'stroke-slate-500'}
                                strokeWidth={p.shared ? 1.6 : 0.7}
                                strokeLinecap="round"
                                opacity={p.shared ? 0.9 : 0.3}
                                vectorEffect="non-scaling-stroke"
                            />
                        ))}
                        {/* שתי רצועות ההליקס */}
                        <path d={rails.a} fill="none" stroke={colorA.hex} strokeWidth={1.4} strokeLinecap="round" opacity={0.55} vectorEffect="non-scaling-stroke" />
                        <path d={rails.b} fill="none" stroke={colorB.hex} strokeWidth={1.4} strokeLinecap="round" opacity={0.55} vectorEffect="non-scaling-stroke" />
                    </svg>

                    {/* צמתים וקשרים כ-overlay (px קבוע => עיגולים מושלמים, גודל = עוצמה בלבד) */}
                    {rows.map((p) => {
                        // גודל = עוצמת הרכיב בלבד. טווח רחב (8..28) כדי שחזק וחלש ייראו שונה לגמרי.
                        const sizeA = 8 + p.va * 20;
                        const sizeB = 8 + p.vb * 20;
                        const bondSize = still ? 15 : 13 + bondPulse * 5;
                        return (
                            <React.Fragment key={`nodes-${p.d}`}>
                                {/* צומת גדיל A (המשפט הנבחר) */}
                                <span
                                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                                    style={{
                                        left: `${p.xA}%`,
                                        top: `${p.yPct}%`,
                                        width: sizeA,
                                        height: sizeA,
                                        backgroundColor: colorA.hex,
                                        opacity: 0.4 + 0.55 * p.va,
                                        zIndex: 20,
                                        boxShadow: `0 0 ${4 + p.va * 14}px rgba(${colorA.rgb},${0.3 + p.va * 0.5})`,
                                    }}
                                />
                                {/* צומת גדיל B (משפט ההשוואה) */}
                                {compare && (
                                    <span
                                        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                                        style={{
                                            left: `${p.xB}%`,
                                            top: `${p.yPct}%`,
                                            width: sizeB,
                                            height: sizeB,
                                            backgroundColor: colorB.hex,
                                            opacity: 0.4 + 0.55 * p.vb,
                                            zIndex: 20,
                                            boxShadow: `0 0 ${4 + p.vb * 14}px rgba(${colorB.rgb},${0.3 + p.vb * 0.5})`,
                                        }}
                                    />
                                )}
                                {/* קשר זוהר במרכז (זוג בסיסים שנקשר) - פועם כשמשותף */}
                                {p.shared && compare && (
                                    <span
                                        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300"
                                        style={{
                                            left: '50%',
                                            top: `${p.yPct}%`,
                                            width: bondSize,
                                            height: bondSize,
                                            zIndex: 25,
                                            opacity: still ? 1 : 0.78 + 0.22 * bondPulse,
                                            boxShadow: `0 0 ${still ? 12 : 9 + bondPulse * 8}px 2px rgba(52,211,153,0.85)`,
                                        }}
                                    />
                                )}
                                {/* הבהוב "מה השתנה": טבעת שמתפשטת על הרכיב שהקשר שלו השתנה */}
                                {p.flashed && (
                                    <span
                                        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full"
                                        style={{
                                            left: '50%',
                                            top: `${p.yPct}%`,
                                            width: 26,
                                            height: 26,
                                            zIndex: 24,
                                            border: `2px solid ${p.shared ? 'rgba(52,211,153,0.9)' : 'rgba(148,163,184,0.85)'}`,
                                        }}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* עמודת התוויות: שורה לכל רכיב, מיושרת לגובה השורה בהליקס. כיוון לפי השפה */}
                <div className="flex flex-1 flex-col">
                    {rows.map((p) => (
                        <div key={`label-${p.d}`} className="flex items-center" style={{ height: LANE }}>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                <span className="text-[13px] font-bold leading-tight text-[var(--bts-text-bright)]">{geneLabels[p.d]}</span>
                                {p.shared && (
                                    <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-emerald-900)] [--t-l:var(--color-emerald-500)] px-1.5 py-0.5 text-[9px] font-bold text-emerald-200">
                                        <Check size={9} /> {dna.sharedBadge}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* מדריך קריאה קצר: איך לפענח את הסולם */}
            <div className="mt-3 space-y-1.5 rounded-xl border border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-700))_40%,transparent)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-3">
                <p className="flex items-center gap-2 text-[12px] leading-relaxed text-[var(--bts-text-muted)]">
                    {/* מפתח גודל ויזואלי: עיגול גדול מול קטן, מראה שגודל = עוצמה */}
                    <span className="flex shrink-0 items-center gap-1">
                        <span className="h-3.5 w-3.5 rounded-full bg-[color-mix(in_oklab,var(--bts-text-body)_var(--bts-tint-mix),var(--color-slate-200))]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--bts-text-faint)]" />
                    </span>
                    {dna.guideSize}
                </p>
                {/* קווי ההנחיה על קשר/כריכה בין שני משפטים רלוונטיים רק כשיש משפט השוואה */}
                {compare && (
                    <>
                        <p className="flex items-start gap-2 text-[12px] leading-relaxed text-[var(--bts-text-muted)]">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[color-mix(in_oklab,var(--color-emerald-500)_var(--bts-tint-mix),var(--color-emerald-300))] shadow-[0_0_6px_1px_rgba(52,211,153,0.7)]" />
                            {dna.guideBond}
                        </p>
                        <p className="flex items-start gap-2 text-[12px] leading-relaxed text-[var(--bts-text-muted)]">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[color-mix(in_oklab,var(--color-violet-500)_var(--bts-tint-mix),var(--color-violet-300))]" />
                            {dna.twistMeaning}
                        </p>
                    </>
                )}
            </div>

            {/* פסיקה אחת ברורה */}
            {compare && (
                <div className="mt-3">
                    <span
                        className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-bold transition-colors duration-500 ${
                            stayedClose
                                ? 'border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-900)] [--t-l:var(--color-emerald-500)] text-emerald-200'
                                : 'border-amber-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-amber-900)] [--t-l:var(--color-amber-500)] text-amber-200'
                        }`}
                    >
                        {verdict}
                    </span>
                </div>
            )}

            {/* הבהרה קבועה: הצירים הם תוויות לימודיות, לא ממדי embedding קריאים לאדם */}
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--bts-text-muted)]">{dna.axesNote}</p>

            {/* סיכום מוסתר להקראה */}
            <p className="sr-only" aria-live="polite">
                {active.ttsLine}
                {compare ? ` ${compare.ttsLine} ${lead} ${verdict}.` : ''}
            </p>
        </div>
    );
};
