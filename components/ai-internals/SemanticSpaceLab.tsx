"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Compass, MousePointerClick, Sparkles, Map, Info, ArrowLeftRight, Check } from 'lucide-react';

import type { Direction, Locale } from '@/i18n/config';
import { GuessButton } from './GuessButton';

import {
    PHRASES,
    CLUSTER_STYLE,
    ANCHOR_ID,
    NEGATION_PAIR,
    distance,
    closeness,
    closenessTone,
    proximityScore,
    rankNeighbors,
    TONE_STYLE,
    type ClusterKey,
    type PhraseId,
    type Vec,
} from '@/app/(course)/behind-the-scenes-ai/chapter-5/semanticSpace';
import type { SemanticSpaceLabDict } from '@/i18n/locales/he/behind-ai/semanticSpaceLab';

/**
 * SemanticSpaceLab - מעבדת פרק 5: "Semantic Space: מפת המשמעות של המודל".
 * רכיב עצמאי ודטרמיניסטי, בנוי סביב פעולה של הלומד, לא רק צפייה.
 *   1. map      - בוחרים משפט (הנקודות קבועות במקומן), ורשימת השכנים מתעדכנת מיד. הלקח:
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

// רוחב משוער של תווית המשפט ב-SVG. אי אפשר להסתפק ב-length קבוע לכל תו: תווי CJK
// (יפנית) רחבים כמעט em מלא, בעוד תווי לטינית/עברית/קירילית צרים בהרבה. ההערכה הישנה
// (7px לכל תו) התאימה ללטינית ולעברית, אך ביפנית הטקסט גלש מהגלולה שמאחוריו.
// fontSize של התווית הוא 11.5, ומכאן הקבועים.
const CJK = /[　-ヿ㐀-䶿一-鿿豈-﫿＀-￯]/;
const estimateTextWidth = (s: string) =>
    [...s].reduce((w, ch) => w + (CJK.test(ch) ? 11.5 : 6.4), 0);

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

export const SemanticSpaceLab: React.FC<{ content: SemanticSpaceLabDict; dir: Direction; locale: Locale }> = ({ content, dir, locale }) => {
    const [experiment, setExperiment] = useState<Experiment>('map');

    return (
        <div className="space-y-4">
            {/* ── בורר הניסוי ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-4 sm:flex-row sm:items-center sm:justify-between" dir={dir}>
                <div className="flex items-center gap-2 text-sm text-[var(--bts-text-secondary)]">
                    <Map size={16} className="text-violet-300" />
                    <span className="font-bold text-[var(--bts-text-body)]">{content.selector.label}</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-xl border border-[var(--bts-divider-soft)] bg-[color-mix(in_oklab,var(--bts-panel-from)_80%,transparent)] p-1" dir={dir}>
                    {([['map', content.selector.map], ['negation', content.selector.negation]] as const).map(([key, label]) => {
                        const active = experiment === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setExperiment(key)}
                                aria-pressed={active}
                                className={`inline-flex min-h-[44px] items-center rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                                    active ? 'bg-violet-500 text-white' : 'text-[var(--bts-text-muted)] hover:text-[var(--bts-text-body)]'
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
                        <NegationExperiment content={content} dir={dir} locale={locale} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* disclaimer */}
            <div className="flex items-start gap-2 rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-4 text-[13px] leading-relaxed text-[var(--bts-text-muted)]" dir={dir}>
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>{content.disclaimer}</span>
            </div>
        </div>
    );
};

/* ═══════════════════════ ניסוי 1: שכנים במרחב ════════════════════════════ */

const MapExperiment: React.FC<{ content: SemanticSpaceLabDict; dir: Direction }> = ({ content, dir }) => {
    const reduce = useReducedMotion();
    const m = content.map;

    // הנקודות קבועות במיקומן הלימודי המקורי. אין גרירה: רק בחירה (קליק/הקשה/Enter/Space)
    // משנה את המשפט הפעיל, וחישוב השכנים נגזר תמיד מהקואורדינטות הקבועות של PHRASES.
    const [selectedId, setSelectedId] = useState<PhraseId>(ANCHOR_ID);
    // מיקוד מקלדת נוכחי, לציור טבעת פוקוס נראית על הנקודה הממוקדת.
    const [focusedId, setFocusedId] = useState<PhraseId | null>(null);
    // רמז חד-פעמי: פעימה עדינה על הנקודה הנבחרת, שמראה שאפשר לבחור. לא משנה מצב, רץ פעם
    // אחת, מכובה ברגע שהלומד בוחר, ומכובד ל-reduced-motion.
    const [hintOn, setHintOn] = useState(true);
    useEffect(() => {
        if (reduce) return;
        const id = setTimeout(() => setHintOn(false), 4500);
        return () => clearTimeout(id);
    }, [reduce]);

    const selPhrase = PHRASES.find((p) => p.id === selectedId)!;

    // בחירה בלבד: קליק/הקשה או Enter/Space בוחרים את הנקודה, בלי להזיז אותה. אותו state
    // ואותו חישוב שכנים למשתמשי עכבר, מגע ומקלדת.
    const select = (id: PhraseId) => { setSelectedId(id); setHintOn(false); };
    const onPointKey = (id: PhraseId) => (e: React.KeyboardEvent<SVGGElement>) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            select(id);
        }
    };

    // דירוג שכנים לפי הקואורדינטות הקבועות. rankNeighbors מקבל רק את המזהה הפעיל ואינו
    // יכול לקבל מיקום שהמשתמש הזיז, ולכן המפה וכרטיס השכנים לעולם אינם סותרים זה את זה.
    const neighbors = rankNeighbors(selectedId);
    const nearestId = neighbors.length ? neighbors[0].phrase.id : null;

    const selScreen = mapPoint(selPhrase);

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* ── המפה ─────────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
                <div className="mb-3 flex items-center gap-2">
                    <Compass size={16} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-[var(--bts-text-body)]">{m.title}</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">{m.subtitle}</div>
                    </div>
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

                <div className="relative overflow-hidden rounded-xl border border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-700))_40%,transparent)] bg-[color-mix(in_oklab,var(--bts-panel-to)_50%,transparent)]">
                    <svg
                        viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
                        className="w-full select-none"
                        role="group"
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
                                // Dark: 7% כמו קודם. Light: 14%, כי אזור רך על משטח בהיר נעלם בעוצמה נמוכה.
                                style={{ opacity: 'calc(7% + var(--bts-tint-mix) * 0.07)' }}
                            />
                        ))}

                        {/* נקודות קבועות. רק צבע האשכול; המשפט נחשף בריחוף (title). בחירה בלבד. */}
                        {PHRASES.map((p) => {
                            const pos = mapPoint(p);
                            const c = CLUSTER_STYLE[p.cluster];
                            const isSel = selectedId === p.id;
                            const isFocused = focusedId === p.id;
                            const dist = distance(selPhrase, p);
                            const near = closeness(dist);
                            const dim = !isSel ? 0.35 + 0.65 * near : 1;
                            return (
                                <g
                                    key={p.id}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={content.phrases[p.id]}
                                    aria-pressed={isSel}
                                    onClick={() => select(p.id)}
                                    onKeyDown={onPointKey(p.id)}
                                    onFocus={() => setFocusedId(p.id)}
                                    onBlur={() => setFocusedId((f) => (f === p.id ? null : f))}
                                    style={{ cursor: 'pointer', opacity: isFocused ? 1 : dim, outline: 'none' }}
                                    className="transition-opacity duration-300"
                                >
                                    <title>{content.phrases[p.id]}</title>
                                    {/* פעימת רמז חד-פעמית על הנקודה הנבחרת (לא משנה מצב, מכובד ל-reduced-motion) */}
                                    {hintOn && isSel && (
                                        <motion.circle
                                            // DOM יציב בין שרת ללקוח; ב-reduced-motion הרמז מוסתר ב-CSS (בלי הבהוב בציור הראשון).
                                            className="motion-reduce:hidden"
                                            cx={pos.cx}
                                            cy={pos.cy}
                                            fill="none"
                                            stroke={c.hex}
                                            strokeWidth={2}
                                            pointerEvents="none"
                                            initial={{ r: 10, opacity: 0.7 }}
                                            animate={{ r: [10, 22], opacity: [0.7, 0] }}
                                            transition={{ duration: 1.4, repeat: 2, ease: 'easeOut' }}
                                        />
                                    )}
                                    {isSel && <circle cx={pos.cx} cy={pos.cy} r={14} fill="none" stroke={c.hex} strokeWidth={1.5} strokeOpacity={0.6} />}
                                    <circle cx={pos.cx} cy={pos.cy} r={isSel ? 8 : 6} fill={c.hex} stroke="#0b1220" strokeWidth={isSel ? 0 : 1.5} />
                                    {/* Light בלבד: מתאר כהה לנקודה הנבחרת, כדי שגוון בהיר (ציאן/ענבר) לא יימוס במשטח בהיר. ב-Dark שקוף לגמרי. */}
                                    {isSel && <circle cx={pos.cx} cy={pos.cy} r={8} fill="none" stroke="#0b1220" strokeWidth={1.5} style={{ opacity: 'var(--bts-tint-mix)' }} />}
                                    {/* טבעת פוקוס מקלדת נראית, בניגודיות גבוהה, מעל הנקודה */}
                                    {isFocused && (
                                        <circle cx={pos.cx} cy={pos.cy} r={16} fill="none" stroke="color-mix(in oklab, #0f172a var(--bts-tint-mix), #f8fafc)" strokeWidth={2} strokeDasharray="3 3" pointerEvents="none" />
                                    )}
                                    {/* אזור בחירה נדיב ללמס/קליק */}
                                    <circle cx={pos.cx} cy={pos.cy} r={20} fill="transparent" />
                                </g>
                            );
                        })}

                        {/* תווית המשפט הנבחר בלבד, כגלולה קריאה מעל הנקודה (על גבי כל השאר) */}
                        {(() => {
                            const text = content.phrases[selectedId];
                            const labelW = Math.min(estimateTextWidth(text) + 18, MAP_SIZE - 2 * (MAP_PAD - 12));
                            const lx = clamp(selScreen.cx, MAP_PAD - 12 + labelW / 2, MAP_SIZE - (MAP_PAD - 12) - labelW / 2);
                            const ly = clamp(selScreen.cy - 30, 6, MAP_SIZE - 26);
                            const selHex = CLUSTER_STYLE[selPhrase.cluster].hex;
                            return (
                                <g pointerEvents="none">
                                    <rect x={lx - labelW / 2} y={ly} width={labelW} height={21} rx={7} fill="#0b1220" stroke={selHex} strokeOpacity={0.7} />
                                    <text x={lx} y={ly + 14.5} fill="#f8fafc" fontSize={11.5} fontWeight={700} textAnchor="middle">{text}</text>
                                </g>
                            );
                        })()}
                    </svg>
                </div>

                {/* הנחיה: בחירה מעדכנת את רשימת השכנים הקרובים */}
                <div className="mt-3 min-h-[3rem]">
                    <p className="flex items-start gap-2 text-xs leading-relaxed text-violet-200">
                        <MousePointerClick size={14} className="mt-0.5 shrink-0" /> {m.selectHint}
                    </p>
                </div>
            </div>

            {/* ── שכנים קרובים ─────────────────────────────────────────── */}
            <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
                <div className="mb-3 flex items-center gap-2">
                    <Sparkles size={16} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-[var(--bts-text-body)]">{m.neighborsTitle}</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">{m.neighborsSubtitle}</div>
                    </div>
                </div>

                <div className="mb-3 flex items-center gap-2 text-sm">
                    <span className="text-[var(--bts-text-muted)]">{m.closenessTo}</span>
                    <span className={`rounded-md border px-2 py-0.5 font-bold ${CLUSTER_STYLE[selPhrase.cluster].chip} ${CLUSTER_STYLE[selPhrase.cluster].text}`}>
                        {content.phrases[selPhrase.id]}
                    </span>
                </div>

                {/* סיכום קצר להקראה: רק המשפט הקרוב ביותר כרגע, מתעדכן בכל בחירה (עכבר או מקלדת) */}
                <p className="sr-only" aria-live="polite">
                    {neighbors.length ? `${m.closestNow} ${content.phrases[neighbors[0].phrase.id]}` : ''}
                </p>

                <div className="space-y-2">
                    {neighbors.slice(0, 6).map(({ phrase: p, dist }) => {
                        const tone = closenessTone(dist);
                        const toneStyle = TONE_STYLE[tone];
                        const pct = proximityScore(dist);
                        const isClosest = p.id === nearestId;
                        const toneLabel = tone === 'near' ? m.toneNear : tone === 'mid' ? m.toneMid : m.toneFar;
                        return (
                            <div key={p.id} className={`rounded-xl border px-3 py-2 ${toneStyle.chip}`}>
                                <div className="mb-1.5 flex items-center justify-between gap-2">
                                    <span className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-bold text-[var(--bts-text-bright)]">{content.phrases[p.id]}</span>
                                        {isClosest && (
                                            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300">{m.closest}</span>
                                        )}
                                        <span className={`text-[10px] font-bold ${toneStyle.text}`}>{toneLabel}</span>
                                    </span>
                                    <span className={`font-mono text-[11px] ${toneStyle.text}`} dir="ltr">{pct}%</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(80%_+_var(--bts-tint-mix)_*_0.2),transparent)]">
                                    <div
                                        className={`h-full rounded-full transition-[width] duration-100 ease-out ${toneStyle.bar}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-[var(--bts-text-faint)]">{m.note}</p>
            </div>
        </div>
    );
};

/* ═══════════════════════ ניסוי 2: מלכודת השלילה ══════════════════════════ */

const NegationExperiment: React.FC<{ content: SemanticSpaceLabDict; dir: Direction; locale: Locale }> = ({ content, dir, locale }) => {
    const reduce = useReducedMotion();
    const n = content.negation;
    const [revealed, setRevealed] = useState(false);

    const baseText = content.phrases[NEGATION_PAIR.base];
    const oppositeText = content.phrases[NEGATION_PAIR.opposite];

    // פילוח מפורש מהמילון, אם השפה סיפקה אותו. משמש רק כשהפילוח האוטומטי אינו מזהה נכון
    // את השלילה (כרגע יפנית בלבד, ראו semanticSpaceLab של ja).
    //
    // הפילוח החזותי חייב להרכיב בחזרה בדיוק את המשפט הטבעי. אימות ה-join מונע שני
    // כשלים: מילון שיצא מסנכרון מול phrases אחרי עריכה, ורווחים מלאכותיים שנשתלו
    // בפילוח. אם האימות נכשל נופלים לפילוח האוטומטי במקום להציג ללומד משפט שגוי.
    const explicit = useMemo(() => {
        const v = content.negationVisual;
        if (!v) return null;
        if (v.base.join('') !== baseText || v.opposite.join('') !== oppositeText) return null;
        // הדגשה שאינה קיימת בפילוח לא תסמן כלום, ומעידה על מילון שגוי. עדיף אוטומטי.
        if (!v.pivot.length || !v.pivot.every((w) => v.base.includes(w))) return null;
        return v;
    }, [content.negationVisual, baseText, oppositeText]);

    // פילוח מילים תלוי-שפה. פיצול על רווחים לבדו נכשל ביפנית, שאין בה רווחים: המשפט
    // כולו היה חוזר כאסימון אחד, ולכן נצבע כולו כציר השלילה, כאילו כל המשפט הוא ה"לא".
    // Intl.Segmenter הוא API מובנה בדפדפן (בלי תלות חדשה) ומפלח את השפות עם הרווחים
    // בדיוק כמו הפיצול הקודם, כי isWordLike מסנן ממילא רווחים וסימני פיסוק. ביפנית הוא
    // אינו מספיק (הוא קורע את גזע הפועל), ולכן יפנית עוברת דרך explicit ולא לכאן.
    const words = useMemo(() => {
        if (explicit) return { base: explicit.base, opposite: explicit.opposite };
        const split = (s: string) => {
            // try/catch ולא רק בדיקת typeof: הבנייה לא תיפול אם locale לא תקין או אם
            // המימוש חסר. הנפילה לאחור לרווחים יציבה לשפות עם רווחים (he/en/es/ru/ar),
            // ובטוחה ב-SSR כי אין כאן גישה ל-window או ל-document.
            if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
                try {
                    const seg = new Intl.Segmenter(locale, { granularity: 'word' });
                    // isWordLike מסנן רווחים וסימני פיסוק, כדי שלא ייווצר שבב פיסוק בודד.
                    return [...seg.segment(s)].filter((x) => x.isWordLike).map((x) => x.segment);
                } catch {
                    /* נופלים לפיצול הרווחים */
                }
            }
            return s.split(/\s+/).filter(Boolean);
        };
        return { base: split(baseText), opposite: split(oppositeText) };
    }, [explicit, baseText, oppositeText, locale]);

    const baseWords = words.base;
    const oppWords = words.opposite;
    // האסימונים הייחודיים למשפט המקורי הם ציר השלילה. בערבית אלה שניים ("لم" וגם צורת
    // הפועל שהשתנתה), וזה נכון: שניהם באמת השתנו, וטקסט המילון מסביר את שניהם.
    //
    // שני מקרים שבהם אי אפשר לבודד את השלילה: אסימון יחיד (שפה בלי רווחים כשאין
    // Intl.Segmenter), או שכל האסימונים שונים. אז לא מדגישים כלום. הדגשת המשפט כולו
    // הייתה משקרת ללומד ומלמדת שכל המשפט הוא ה"לא", וזה גרוע מהעדר הדגשה.
    const pivotWords = useMemo(() => {
        if (explicit) return explicit.pivot;
        if (baseWords.length <= 1) return [];
        const uniq = baseWords.filter((w) => !oppWords.includes(w));
        return uniq.length === baseWords.length ? [] : uniq;
    }, [explicit, baseWords, oppWords]);

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* ── שני המשפטים ─────────────────────────────────────────── */}
            <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
                <div className="mb-4 flex items-center gap-2">
                    <ArrowLeftRight size={16} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-[var(--bts-text-body)]">{n.title}</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">{n.subtitle}</div>
                    </div>
                </div>

                {/* משפט מקורי, עם הדגשת מילת השלילה.
                    שורת השבבים היא פילוח *חזותי* בלבד. כל שבב הוא אלמנט נפרד, ולכן ה-
                    innerText שלה נשבר בין שבב לשבב ("荷物 / が / 届..."), וזה מה שקורא מסך
                    מקריא ומה שהלומד מעתיק. לכן השורה מוסתרת מעץ הנגישות, והמשפט הטבעי
                    והרציף נמסר לידה פעם אחת ב-sr-only. הפיצול נשאר לעין בלבד. */}
                <div className="mb-3 rounded-xl border border-cyan-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(10%_-_var(--bts-tint-mix)_*_0.05),transparent)] [--t-d:var(--color-cyan-900)] [--t-l:var(--color-cyan-500)] p-3">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-cyan-300">{n.baseLabel}</div>
                    <div className="flex flex-wrap gap-1.5" aria-hidden="true">
                        {baseWords.map((w, i) => {
                            const isPivot = pivotWords.includes(w);
                            return (
                                <span
                                    key={`${w}-${i}`}
                                    className={`rounded-md px-2 py-1 text-sm font-bold ${
                                        isPivot ? 'bg-rose-500/25 text-rose-200 ring-1 ring-rose-400/50' : 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(60%_+_var(--bts-tint-mix)_*_0.4),transparent)] text-[var(--bts-text-body)]'
                                    }`}
                                >
                                    {w}
                                </span>
                            );
                        })}
                    </div>
                    <span className="sr-only">{baseText}</span>
                </div>

                {/* משפט הנגד. אותו עיקרון: שבבים לעין, משפט רציף לקורא מסך. */}
                <div className="rounded-xl border border-amber-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(10%_-_var(--bts-tint-mix)_*_0.05),transparent)] [--t-d:var(--color-amber-900)] [--t-l:var(--color-amber-500)] p-3">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-300">{n.oppositeLabel}</div>
                    <div className="flex flex-wrap gap-1.5" aria-hidden="true">
                        {oppWords.map((w, i) => (
                            <span key={`${w}-${i}`} className="rounded-md bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(60%_+_var(--bts-tint-mix)_*_0.4),transparent)] px-2 py-1 text-sm font-bold text-[var(--bts-text-body)]">
                                {w}
                            </span>
                        ))}
                    </div>
                    <span className="sr-only">{oppositeText}</span>
                </div>

                {/* שני צ'יפים: אותן מילים, משמעות הפוכה */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-cyan-900)] [--t-l:var(--color-cyan-500)] px-2.5 py-1 text-[11px] font-bold text-cyan-200">
                        <Check size={12} /> {n.sharedChip}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-rose-900)] [--t-l:var(--color-rose-500)] px-2.5 py-1 text-[11px] font-bold text-rose-200">
                        <ArrowLeftRight size={12} /> {n.oppositeChip}
                    </span>
                </div>
            </div>

            {/* ── ההסבר ────────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
                {/* מיני-מפה: שתי נקודות קרובות מאוד, עם קו ביניהן */}
                <div className="mb-4 overflow-hidden rounded-xl border border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-700))_40%,transparent)] bg-[color-mix(in_oklab,var(--bts-panel-to)_50%,transparent)]">
                    <svg viewBox={`0 0 ${MAP_SIZE} 150`} className="w-full" role="img" aria-label={n.title}>
                        {/* שתי נקודות קרובות מאוד במרחב, אבל צבע שונה: קרוב במילים, הפוך במשמעות */}
                        <line x1={150} y1={92} x2={214} y2={70} stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="4 4" strokeOpacity={0.6} />
                        <circle cx={150} cy={92} r={7} fill="#22d3ee" />
                        <text x={150} y={116} fill="var(--bts-text-body)" fontSize={11} fontWeight={700} textAnchor="middle">{baseText}</text>
                        <circle cx={214} cy={70} r={7} fill="#fbbf24" />
                        <text x={214} y={54} fill="var(--bts-text-body)" fontSize={11} fontWeight={700} textAnchor="middle">{oppositeText}</text>
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
                            <p className="rounded-xl border border-rose-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)] p-3 text-sm leading-relaxed text-[var(--bts-text-body)]">
                                {n.explanation}
                            </p>
                            <p className="mt-3 border-s-2 border-violet-400/50 ps-3 text-sm font-bold leading-relaxed text-violet-100">
                                {n.bridge}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div key="hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={reduce ? { duration: 0 } : undefined}>
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
