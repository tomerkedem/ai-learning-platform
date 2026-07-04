"use client";

// ────────────────────────────────────────────────────────────────────────
// AttentionSentenceLab - מעבדת הקשב של פרק 6 (Attention).
//
// הרעיון המרכזי: Attention הוא לא טוש שמסמן "מילים חשובות" פעם אחת. הוא שקלול
// יחסים בין חלקי המשפט. הלומד עורך את המשפט (מסיר מילת ניגוד, מחליף סטטוס, הופך
// שלילה, בוחן כינוי) ורואה איך הקשב והקשר בין החלקים משתנים מיד.
//
// i18n: כל הטקסט והנתונים תלויי-השפה (variants, tokens, weights, pair, captions,
// labels) מגיעים מ-data (מילון attentionLab לפי locale). מיפוי הגוונים (tension ->
// צבע) הוא היחיד שנשאר כאן, כי הוא מבני ואינו תלוי שפה. הכיוון (RTL/LTR) מגיע מ-dir.
//
// זו המחשה לימודית מפושטת, לא שיקוף מלא של מנגנון Attention במודל אמיתי. אין בקובץ
// הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link2, Pencil, Sparkles, ArrowLeftRight } from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import type { AttentionLabContent, LabTension } from '@/i18n/locales/he/behind-ai/attentionLab';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

/** מיפוי גוון הקשר -> צבעי המד. מבני, אינו תלוי שפה (התוויות מגיעות מהמילון). */
const TENSION_COLORS: Record<LabTension, { bar: string; text: string }> = {
    high: { bar: 'bg-emerald-400', text: 'text-emerald-200' },
    medium: { bar: 'bg-amber-400', text: 'text-amber-200' },
    low: { bar: 'bg-slate-500', text: 'text-slate-300' },
    shifted: { bar: 'bg-sky-400', text: 'text-sky-200' },
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

    const maxW = useMemo(() => Math.max(...v.weights, 0.0001), [v]);
    const [pairA, pairB] = v.pair;
    const tone = TENSION_COLORS[v.tension];
    const toneLabel = data.tensionLabels[v.tension];
    const pairPct = Math.round(v.pairStrength * 100);

    return (
        <div className="rounded-2xl border border-violet-500/30 bg-slate-900/50 p-5 text-start" dir={dir}>
            {/* כותרת */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Link2 size={18} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-100">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={speakJoin(v.sentence, v.caption)} speechLocale={speechLocale} />
            </div>

            {/* בורר עריכות */}
            <p className="mb-2 flex items-center gap-1.5 text-[13px] text-slate-400">
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
                                ? 'border-violet-400/60 bg-violet-900/30 text-violet-100'
                                : 'border-slate-700/50 bg-slate-950/30 text-slate-300 hover:border-slate-600'
                                }`}
                        >
                            {item.control}
                        </button>
                    );
                })}
            </div>

            {/* המשפט כמילים, עוצמת רקע לפי המשקל, טבעת על זוג הקשר */}
            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">{data.nowLabel}</div>
            <div className="flex flex-wrap items-stretch gap-2" dir={dir}>
                {v.tokens.map((tok, j) => {
                    const inPair = j === pairA || j === pairB;
                    const intensity = v.weights[j] / maxW; // 0..1 ביחס למוביל
                    const pct = Math.round(v.weights[j] * 100);
                    const bg = `rgba(139, 92, 246, ${(0.08 + intensity * 0.55).toFixed(3)})`;
                    return (
                        <motion.div
                            key={tok + j}
                            layout={!reduce}
                            animate={reduce ? undefined : { scale: inPair ? 1.04 : 1 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                            aria-label={`${tok}, ${data.sr.attention} ${pct} ${data.sr.percent}${inPair ? `, ${data.sr.inPair}` : ''}`}
                            className={`relative flex flex-col items-center gap-1 rounded-xl border px-3 py-2 text-center ${inPair ? 'border-emerald-400/70 ring-1 ring-emerald-400/50' : 'border-white/10'
                                }`}
                            style={{ backgroundColor: bg }}
                        >
                            <span className="text-base font-bold leading-none text-slate-100">{tok}</span>
                            <span className="font-mono text-[13px] leading-none text-slate-300/80" dir="ltr">{pct}%</span>
                        </motion.div>
                    );
                })}
            </div>

            {/* מד עוצמת הקשר בין שני החלקים המרכזיים */}
            <div className="mt-5 rounded-xl border border-slate-700/50 bg-slate-950/30 p-3.5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[13px] font-bold text-slate-300">
                        <ArrowLeftRight size={14} className="text-violet-300" />
                        {data.relationLabel}
                        <span className="text-slate-100">&quot;{v.tokens[pairA]}&quot;</span>
                        <span className="text-slate-500">↔</span>
                        <span className="text-slate-100">&quot;{v.tokens[pairB]}&quot;</span>
                    </span>
                    <span className={`text-[13px] font-bold ${tone.text}`}>{toneLabel}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10" role="img" aria-label={`${data.sr.strength} ${pairPct} ${data.sr.percent}, ${toneLabel}`}>
                    <motion.div
                        className={`h-full rounded-full ${tone.bar}`}
                        initial={false}
                        animate={{ width: `${pairPct}%` }}
                        transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                </div>
            </div>

            {/* כיתוב דינמי למצב הנבחר */}
            <motion.p
                key={v.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-3 text-[15px] leading-relaxed text-slate-200"
            >
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-200">
                    <Sparkles size={14} /> {v.control}
                </span>{' '}
                {v.caption}
            </motion.p>

            <p className="mt-3 text-[13px] leading-relaxed text-slate-500">{data.disclaimer}</p>
        </div>
    );
};
