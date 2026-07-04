"use client";

// ────────────────────────────────────────────────────────────────────────
// AttentionSentenceLab - מעבדת הקשב של פרק 6 (Attention).
//
// הרעיון המרכזי: Attention הוא לא טוש שמסמן "מילים חשובות" פעם אחת. הוא שקלול
// יחסים בין חלקי המשפט. הלומד עורך את המשפט (מסיר מילת ניגוד, מחליף סטטוס, הופך
// שלילה, בוחן כינוי) ורואה איך הקשב והקשר בין החלקים משתנים מיד. אותו מנגנון,
// משפט אחר, מוקד קשב אחר.
//
// זו המחשה לימודית מפושטת, לא שיקוף מלא של מנגנון Attention במודל אמיתי. המשקלים
// כתובים ידנית לצורך ההדגמה בלבד. אין בקובץ הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link2, Pencil, Sparkles, ArrowLeftRight } from 'lucide-react';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

/** עוצמת הקשר בין שני החלקים: חזק, בינוני, חלש, או מוסט (המוקד עבר למקום אחר). */
type Tension = 'high' | 'medium' | 'low' | 'shifted';

interface Variant {
    id: string;
    /** תווית הכפתור: העריכה עצמה. */
    control: string;
    /** המשפט המלא במצב הזה (לתצוגה ולהקראה). */
    sentence: string;
    /** מילות המשפט בסדר קריאה (RTL). */
    tokens: string[];
    /** משקל קשב לכל טוקן (0..1), כתוב ידנית להמחשה. */
    weights: number[];
    /** שני האינדקסים שמרכיבים את הקשר המרכזי במצב הזה. */
    pair: [number, number];
    /** עוצמת הקשר בין החלקים (0..1). */
    pairStrength: number;
    tension: Tension;
    /** כיתוב שמסביר מה השתנה ולמה הקשב זז. */
    caption: string;
}

const VARIANTS: Variant[] = [
    {
        id: 'base',
        control: 'המקור',
        sentence: 'החבילה סומנה כנמסרה, אבל הלקוח אומר שלא קיבל אותה.',
        tokens: ['החבילה', 'סומנה', 'כנמסרה', 'אבל', 'הלקוח', 'אומר', 'שלא', 'קיבל', 'אותה'],
        weights: [0.55, 0.35, 0.95, 0.6, 0.3, 0.25, 0.8, 0.9, 0.3],
        pair: [2, 7],
        pairStrength: 0.9,
        tension: 'high',
        caption:
            'המתח המרכזי הוא בין "כנמסרה" לבין "שלא קיבל". שם הקשב חייב להיות חזק, כי זו הסתירה שהתשובה צריכה לטפל בה, ולא רק העובדה שחסרה חבילה.',
    },
    {
        id: 'no-abal',
        control: 'בלי "אבל"',
        sentence: 'החבילה סומנה כנמסרה. הלקוח אומר שלא קיבל אותה.',
        tokens: ['החבילה', 'סומנה', 'כנמסרה', 'הלקוח', 'אומר', 'שלא', 'קיבל', 'אותה'],
        weights: [0.5, 0.35, 0.75, 0.3, 0.25, 0.6, 0.7, 0.3],
        pair: [2, 6],
        pairStrength: 0.5,
        tension: 'medium',
        caption:
            'הורדנו את "אבל". שני החלקים עדיין כאן, אבל הם רק מונחים זה לצד זה. "אבל" הוא הסימן שאומר למודל שיש כאן ניגוד ושכדאי לשקלל את הקשר חזק יותר. בלעדיו הקשר פחות מסומן.',
    },
    {
        id: 'status',
        control: '"כנמסרה" נהיה "בדרך"',
        sentence: 'החבילה עדיין בדרך, אבל הלקוח אומר שלא קיבל אותה.',
        tokens: ['החבילה', 'עדיין', 'בדרך', 'אבל', 'הלקוח', 'אומר', 'שלא', 'קיבל', 'אותה'],
        weights: [0.5, 0.3, 0.45, 0.35, 0.3, 0.25, 0.4, 0.45, 0.3],
        pair: [2, 7],
        pairStrength: 0.2,
        tension: 'low',
        caption:
            'שינינו את הסטטוס ל"בדרך", ועכשיו אין סתירה. ברור שחבילה שעדיין בדרך לא התקבלה. אין מתח מיוחד לשקלל, והקשב מתפזר בצורה שטוחה יותר.',
    },
    {
        id: 'received-late',
        control: '"שלא קיבל" נהיה "קיבל באיחור"',
        sentence: 'החבילה סומנה כנמסרה, אבל הלקוח אומר שקיבל אותה באיחור.',
        tokens: ['החבילה', 'סומנה', 'כנמסרה', 'אבל', 'הלקוח', 'אומר', 'שקיבל', 'אותה', 'באיחור'],
        weights: [0.5, 0.3, 0.6, 0.4, 0.25, 0.25, 0.55, 0.3, 0.9],
        pair: [2, 8],
        pairStrength: 0.4,
        tension: 'shifted',
        caption:
            'הפכנו את השלילה. עכשיו הלקוח כן קיבל, רק באיחור. הסתירה נעלמה, והמשקל עובר אל "באיחור", הפרט החדש שמעצב את התשובה. מילת שלילה אחת שינתה את כל מוקד הקשב.',
    },
    {
        id: 'pronoun',
        control: 'הכינוי "אותה"',
        sentence: 'החבילה סומנה כנמסרה, אבל הלקוח אומר שלא קיבל אותה.',
        tokens: ['החבילה', 'סומנה', 'כנמסרה', 'אבל', 'הלקוח', 'אומר', 'שלא', 'קיבל', 'אותה'],
        weights: [0.85, 0.3, 0.5, 0.35, 0.35, 0.3, 0.4, 0.45, 0.9],
        pair: [8, 0],
        pairStrength: 0.85,
        tension: 'high',
        caption:
            'המילה "אותה" לא עומדת לבד. המודל צריך לחבר אותה חזרה ל"החבילה", אחרת לא ברור על מה הלקוח מדבר. גם זה קשב: קשר בין מילה לבין מה שהיא מחליפה.',
    },
];

const TENSION_META: Record<Tension, { label: string; bar: string; text: string }> = {
    high: { label: 'קשר חזק', bar: 'bg-emerald-400', text: 'text-emerald-200' },
    medium: { label: 'קשר בינוני', bar: 'bg-amber-400', text: 'text-amber-200' },
    low: { label: 'קשר חלש', bar: 'bg-slate-500', text: 'text-slate-300' },
    shifted: { label: 'המוקד עבר', bar: 'bg-sky-400', text: 'text-sky-200' },
};

export const AttentionSentenceLab: React.FC = () => {
    const reduce = useReducedMotion();
    const [variantId, setVariantId] = useState(VARIANTS[0].id);
    const v = VARIANTS.find((x) => x.id === variantId) ?? VARIANTS[0];

    const maxW = useMemo(() => Math.max(...v.weights, 0.0001), [v]);
    const [pairA, pairB] = v.pair;
    const tone = TENSION_META[v.tension];

    return (
        <div className="rounded-2xl border border-violet-500/30 bg-slate-900/50 p-5 text-right" dir="rtl">
            {/* כותרת */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Link2 size={18} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-100">שנו משהו במשפט, וראו לאן הקשב זז</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Attention sentence lab</div>
                    </div>
                </div>
                <SpeakButton text={speakJoin(`המשפט: ${v.sentence}`, v.caption)} />
            </div>

            {/* בורר עריכות */}
            <p className="mb-2 flex items-center gap-1.5 text-[13px] text-slate-400">
                <Pencil size={13} className="text-violet-400" />
                בחרו עריכה במשפט. נראה איך הקשב והקשר בין החלקים משתנים.
            </p>
            <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="בחירת עריכה במשפט">
                {VARIANTS.map((item) => {
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
            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">המשפט עכשיו</div>
            <div className="flex flex-wrap items-stretch gap-2" dir="rtl">
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
                            aria-label={`${tok}, עוצמת קשב ${pct} אחוז${inPair ? ', חלק מהקשר המרכזי' : ''}`}
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
                        הקשר הנשקל:
                        <span className="text-slate-100">&quot;{v.tokens[pairA]}&quot;</span>
                        <span className="text-slate-500">↔</span>
                        <span className="text-slate-100">&quot;{v.tokens[pairB]}&quot;</span>
                    </span>
                    <span className={`text-[13px] font-bold ${tone.text}`}>{tone.label}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10" role="img" aria-label={`עוצמת הקשר ${Math.round(v.pairStrength * 100)} אחוז, ${tone.label}`}>
                    <motion.div
                        className={`h-full rounded-full ${tone.bar}`}
                        initial={false}
                        animate={{ width: `${Math.round(v.pairStrength * 100)}%` }}
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

            <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
                זו המחשה לימודית מפושטת, לא שיקוף מלא של מנגנון Attention במודל אמיתי. המספרים כאן נועדו להראות את הרעיון:
                שינוי קטן במשפט מזיז את מוקד הקשב ואת עוצמת הקשר בין החלקים.
            </p>
        </div>
    );
};
