"use client";

// ────────────────────────────────────────────────────────────────────────
// AttentionSentenceLab - מעבדת הקשב של פרק 6 (Attention).
//
// הרעיון המרכזי: Attention הוא לא טוש שמסמן "מילים חשובות" פעם אחת. הוא שקלול
// יחסים בין חלקי המשפט. הלומד עורך את המשפט (מסיר מילת ניגוד, מחליף סטטוס, הופך
// שלילה, בוחן כינוי) ורואה איך הקשב והקשר בין החלקים משתנים מיד.
//
// שני צירים סיבתיים נפרדים:
//   1. שינוי במשפט -> קשב אחר (בורר הווריאנטים).
//   2. אותו משפט בדיוק, מוקד עיבוד אחר -> קשב אחר (תת-האינטראקציה FocusPanel).
//
// i18n: כל הטקסט והנתונים תלויי-השפה (variants, focus, tokens, weights, pair,
// captions, labels) מגיעים מ-data (מילון attentionLab לפי locale). מיפוי הגוונים
// (tension -> צבע) הוא היחיד שנשאר כאן, כי הוא מבני ואינו תלוי שפה. הכיוון (RTL/LTR)
// מגיע מ-dir.
//
// TokenChips ו-RelationMeter הם עוזרים מקומיים לפרק הזה בלבד (לא הפשטה משותפת),
// כדי שציר העריכה וציר מוקד-העיבוד יציגו את אותו ויזואל בלי כפילות.
//
// זו המחשה לימודית מפושטת, לא שיקוף מלא של מנגנון Attention במודל אמיתי. אין בקובץ
// הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link2, Pencil, Sparkles, ArrowLeftRight, Crosshair } from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import type { AttentionLabContent, LabTension, AttentionLabFocus } from '@/i18n/locales/he/behind-ai/attentionLab';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

/** מיפוי גוון הקשר -> צבעי המד. מבני, אינו תלוי שפה (התוויות מגיעות מהמילון). */
const TENSION_COLORS: Record<LabTension, { bar: string; text: string }> = {
    high: { bar: 'bg-emerald-400', text: 'text-emerald-200' },
    medium: { bar: 'bg-amber-400', text: 'text-amber-200' },
    low: { bar: 'bg-[color-mix(in_oklab,var(--bts-text-muted)_var(--bts-tint-mix),var(--color-slate-500))]', text: 'text-[var(--bts-text-secondary)]' },
    shifted: { bar: 'bg-sky-400', text: 'text-sky-200' },
};

/** עוזר מקומי: שורת המילים עם עוצמת רקע לפי המשקל וטבעת על זוג הקשר. */
const TokenChips: React.FC<{
    tokens: string[];
    weights: number[];
    pair: [number, number];
    dir: Direction;
    reduce: boolean | null;
    sr: AttentionLabContent['sr'];
}> = ({ tokens, weights, pair, dir, reduce, sr }) => {
    const maxW = Math.max(...weights, 0.0001);
    const [pairA, pairB] = pair;
    return (
        <div className="flex flex-wrap items-stretch gap-2" dir={dir}>
            {tokens.map((tok, j) => {
                const inPair = j === pairA || j === pairB;
                const intensity = weights[j] / maxW; // 0..1 ביחס למוביל
                const pct = Math.round(weights[j] * 100);
                const bg = `rgba(139, 92, 246, ${(0.08 + intensity * 0.55).toFixed(3)})`;
                return (
                    <motion.div
                        key={tok + j}
                        layout={!reduce}
                        animate={reduce ? undefined : { scale: inPair ? 1.04 : 1 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                        aria-label={`${tok}, ${sr.attention} ${pct} ${sr.percent}${inPair ? `, ${sr.inPair}` : ''}`}
                        className={`relative flex flex-col items-center gap-1 rounded-xl border px-3 py-2 text-center ${inPair ? 'border-emerald-400/70 ring-1 ring-emerald-400/50' : 'border-[var(--bts-divider-soft)]'
                            }`}
                        style={{ backgroundColor: bg }}
                    >
                        <span className="text-base font-bold leading-none text-[var(--bts-text-bright)]">{tok}</span>
                        <span className="font-mono text-[13px] leading-none text-[color-mix(in_oklab,var(--bts-text-secondary)_80%,transparent)]" dir="ltr">{pct}%</span>
                    </motion.div>
                );
            })}
        </div>
    );
};

/** עוזר מקומי: מד עוצמת הקשר בין שני החלקים המרכזיים. */
const RelationMeter: React.FC<{
    tokens: string[];
    pair: [number, number];
    pairStrength: number;
    tension: LabTension;
    data: AttentionLabContent;
    reduce: boolean | null;
}> = ({ tokens, pair, pairStrength, tension, data, reduce }) => {
    const [pairA, pairB] = pair;
    const tone = TENSION_COLORS[tension];
    const toneLabel = data.tensionLabels[tension];
    const pairPct = Math.round(pairStrength * 100);
    return (
        <div className="mt-5 rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-3.5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] font-bold text-[var(--bts-text-secondary)]">
                    <ArrowLeftRight size={14} className="shrink-0 text-violet-300" />
                    {data.relationLabel}
                    <span className="text-[var(--bts-text-bright)]">&quot;{tokens[pairA]}&quot;</span>
                    <span className="text-[var(--bts-text-faint)]">↔</span>
                    <span className="text-[var(--bts-text-bright)]">&quot;{tokens[pairB]}&quot;</span>
                </span>
                <span className={`text-[13px] font-bold ${tone.text}`}>{toneLabel}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bts-fill-track)]" role="img" aria-label={`${data.sr.strength} ${pairPct} ${data.sr.percent}, ${toneLabel}`}>
                <motion.div
                    className={`h-full rounded-full ${tone.bar}`}
                    initial={false}
                    animate={{ width: `${pairPct}%` }}
                    transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
            </div>
        </div>
    );
};

/**
 * תת-אינטראקציה "מוקד עיבוד": אותו משפט בדיוק, ובוחרים מה המודל מעבד עכשיו.
 * ציר סיבתי שני, נבדל מציר עריכת-הקלט, בגוון sky כדי להבחין ויזואלית.
 */
const FocusPanel: React.FC<{
    focus: AttentionLabFocus;
    data: AttentionLabContent;
    dir: Direction;
    reduce: boolean | null;
    speechLocale?: Locale;
}> = ({ focus, data, dir, reduce, speechLocale }) => {
    const [stateId, setStateId] = useState(focus.states[0].id);
    const s = focus.states.find((x) => x.id === stateId) ?? focus.states[0];

    return (
        <div className="mt-5 rounded-2xl border border-sky-500/30 bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
            <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Crosshair size={18} className="text-sky-300" />
                    <div className="text-sm font-bold text-[var(--bts-text-bright)]">{focus.title}</div>
                </div>
                <SpeakButton text={speakJoin(focus.sentence, s.caption)} speechLocale={speechLocale} />
            </div>

            <p className="text-[15px] leading-relaxed text-[var(--bts-text-secondary)]">{focus.intro}</p>

            {/* שני הצירים הסיבתיים במפורש: תזכורת מול הציר החדש */}
            <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                <div className="rounded-lg border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] px-3 py-2 text-[13px] text-[var(--bts-text-muted)]">{focus.axisChangedLabel}</div>
                <div className="rounded-lg border border-sky-500/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-sky-950)] [--t-l:var(--color-sky-500)] px-3 py-2 text-[13px] font-bold text-sky-200">{focus.axisSameLabel}</div>
            </div>

            <p className="mt-4 mb-2 flex items-center gap-1.5 text-[13px] font-bold text-[var(--bts-text-secondary)]">
                <Crosshair size={13} className="text-sky-400" />
                {focus.prompt}
            </p>
            <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label={focus.srGroup}>
                {focus.states.map((item) => {
                    const active = item.id === stateId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setStateId(item.id)}
                            aria-pressed={active}
                            className={`rounded-xl border px-3 py-1.5 text-sm font-bold transition-colors ${active
                                ? 'border-sky-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(30%_-_var(--bts-tint-mix)_*_0.15),transparent)] [--t-d:var(--color-sky-900)] [--t-l:var(--color-sky-500)] text-sky-100'
                                : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
                                }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* המוקד הנוכחי מוצג במפורש, גם לפני החלפה */}
            <div className="mb-3 flex flex-wrap items-center gap-2 text-[13px] text-[var(--bts-text-muted)]">
                <span>{focus.nowFocusLabel}</span>
                <span className="rounded-full border border-sky-500/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(30%_-_var(--bts-tint-mix)_*_0.15),transparent)] [--t-d:var(--color-sky-950)] [--t-l:var(--color-sky-500)] px-2.5 py-0.5 font-bold text-sky-200">{s.label}</span>
            </div>

            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-faint)]">{data.nowLabel}</div>
            <TokenChips tokens={focus.tokens} weights={s.weights} pair={s.pair} dir={dir} reduce={reduce} sr={data.sr} />

            <RelationMeter tokens={focus.tokens} pair={s.pair} pairStrength={s.pairStrength} tension={s.tension} data={data} reduce={reduce} />

            <motion.p
                key={s.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                className="mt-4 rounded-xl border border-sky-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-sky-950)] [--t-l:var(--color-sky-500)] p-3 text-[15px] leading-relaxed text-[var(--bts-text-body)]"
            >
                <span className="inline-flex items-center gap-1.5 font-bold text-sky-200">
                    <Sparkles size={14} /> {s.label}
                </span>{' '}
                {s.caption}
            </motion.p>
        </div>
    );
};

interface AttentionSentenceLabProps {
    data: AttentionLabContent;
    dir: Direction;
    /** שפת ההקראה של התוכן (contentLocale). ברירת מחדל: שפת הממשק. */
    speechLocale?: Locale;
}

export const AttentionSentenceLab: React.FC<AttentionSentenceLabProps> = ({ data, dir, speechLocale }) => {
    const reduce = useReducedMotion();
    const [variantId, setVariantId] = useState(data.variants[0].id);
    const v = data.variants.find((x) => x.id === variantId) ?? data.variants[0];

    return (
        <div className="rounded-2xl border border-violet-500/30 bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
            {/* כותרת */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Link2 size={18} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-[var(--bts-text-bright)]">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--bts-text-faint)]" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={speakJoin(v.sentence, v.caption)} speechLocale={speechLocale} />
            </div>

            {/* ציר 1: בורר עריכות - שינוי במשפט משנה קשב */}
            <p className="mb-2 flex items-center gap-1.5 text-[13px] text-[var(--bts-text-muted)]">
                <Pencil size={13} className="text-violet-400" />
                {data.pickHint}
            </p>
            <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label={data.sr.group}>
                {data.variants.map((item) => {
                    const active = item.id === variantId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setVariantId(item.id)}
                            aria-pressed={active}
                            className={`rounded-xl border px-3 py-1.5 text-sm font-bold transition-colors ${active
                                ? 'border-violet-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(30%_-_var(--bts-tint-mix)_*_0.15),transparent)] [--t-d:var(--color-violet-900)] [--t-l:var(--color-violet-500)] text-violet-100'
                                : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
                                }`}
                        >
                            {item.control}
                        </button>
                    );
                })}
            </div>

            {/* המשפט כמילים, עוצמת רקע לפי המשקל, טבעת על זוג הקשר */}
            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-faint)]">{data.nowLabel}</div>
            <TokenChips tokens={v.tokens} weights={v.weights} pair={v.pair} dir={dir} reduce={reduce} sr={data.sr} />

            {/* מד עוצמת הקשר בין שני החלקים המרכזיים */}
            <RelationMeter tokens={v.tokens} pair={v.pair} pairStrength={v.pairStrength} tension={v.tension} data={data} reduce={reduce} />

            {/* כיתוב דינמי למצב הנבחר */}
            <motion.p
                key={v.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                className="mt-4 rounded-xl border border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] p-3 text-[15px] leading-relaxed text-[var(--bts-text-body)]"
            >
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-200">
                    <Sparkles size={14} /> {v.control}
                </span>{' '}
                {v.caption}
            </motion.p>

            {/* ציר 2: מוקד עיבוד - אותו משפט בדיוק, קשב אחר */}
            <FocusPanel focus={data.focus} data={data} dir={dir} reduce={reduce} speechLocale={speechLocale} />

            <p className="mt-3 text-[13px] leading-relaxed text-[var(--bts-text-faint)]">{data.disclaimer}</p>
        </div>
    );
};
