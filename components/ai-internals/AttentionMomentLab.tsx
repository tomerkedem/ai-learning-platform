"use client";

// ────────────────────────────────────────────────────────────────────────
// AttentionMomentLab - מעבדת הקשב של פרק 8.
//
// הרעיון המרכזי: Attention הוא לא טוש שמסמן "מילים חשובות" פעם אחת. הוא שקלול
// יחסים שמשתנה לפי מה שהמודל מעבד באותו רגע. הלומד בוחר "רגע בתשובה" (מבין את
// הבעיה, שם לב לסתירה, מחליט לא להניח, מציע מעקב, מציע תמיכה), ורואה אילו חלקים
// בפרומפט מקבלים יותר משקל באותו רגע. אותו משפט, אותו מודל, אבל המילה החזקה
// מתחלפת מרגע לרגע.
//
// זו המחשה לימודית מפושטת, לא שיקוף מלא של מנגנון Attention במודל אמיתי.
// המשקלים כתובים ידנית לצורך ההדגמה בלבד. אין בקובץ הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MousePointerClick, Link2, Sparkles } from 'lucide-react';

/** המילים של הפרומפט העוגן, בסדר קריאה (RTL). */
const TOKENS = [
    'החבילה', 'שלי', 'לא', 'הגיעה', 'אבל',
    'קיבלתי', 'הודעה', 'שהיא', 'נמסרה', 'מה', 'לעשות',
];

interface Moment {
    id: string;
    /** מה המודל עושה ברגע הזה. */
    label: string;
    /** הסבר קצר על הרגע. */
    hint: string;
    /** משקל קשב לכל אינדקס טוקן שרלוונטי לרגע (0..1). שאר הטוקנים מקבלים בסיס נמוך. */
    weights: Record<number, number>;
    /** משפט שמסביר את הקשר החזק ברגע הזה (עברית טבעית, בלי לתבנת). */
    caption: string;
}

const MOMENTS: Moment[] = [
    {
        id: 'understand',
        label: 'מבין את הבעיה',
        hint: 'מה המשתמש בכלל מתאר?',
        weights: { 3: 0.92, 2: 0.84, 0: 0.6 },
        caption: 'כדי להבין מה קרה, המשקל נופל על "לא הגיעה". זה מה שמגדיר את הבעיה של המשתמש, עוד לפני שמחפשים פתרון.',
    },
    {
        id: 'contradiction',
        label: 'שם לב לסתירה',
        hint: 'יש כאן שני דברים שלא מסתדרים יחד.',
        weights: { 4: 0.95, 8: 0.86, 3: 0.5 },
        caption: 'עכשיו "אבל" ו"נמסרה" מושכים את רוב המשקל. המודל משקלל את הניגוד בין מה שהמשתמש חווה לבין מה שההודעה טוענת.',
    },
    {
        id: 'no-assume',
        label: 'לא מניח שהחבילה נמסרה',
        hint: 'האם אפשר לסמוך על הודעת המסירה?',
        weights: { 8: 0.95, 6: 0.72, 4: 0.45 },
        caption: 'הקשר מתהדק בין "הודעה" ל"נמסרה". המודל לא קובע שהחבילה באמת נמסרה, הוא רק מזהה שזו טענה שצריך לבדוק.',
    },
    {
        id: 'tracking',
        label: 'מציע לבדוק מעקב',
        hint: 'מה הצעד המעשי הראשון?',
        weights: { 0: 0.86, 8: 0.7, 3: 0.42 },
        caption: 'כשהמודל בונה הצעה מעשית, "החבילה" ו"נמסרה" חוזרים לבלוט. אלה החלקים שצריך כדי להציע בדיקת סטטוס משלוח.',
    },
    {
        id: 'support',
        label: 'מציע לפנות לתמיכה',
        hint: 'מה לעשות אם המעקב לא עוזר?',
        weights: { 10: 0.9, 9: 0.62, 2: 0.5 },
        caption: 'בסיום המשקל עובר ל"מה לעשות". המודל בונה את ההמלצה לפעולה הבאה, מתוך הבקשה המקורית של המשתמש להכוונה.',
    },
];

const BASE_WEIGHT = 0.05;

/** משקלי הקשב לכל הטוקנים ברגע נתון. ערכים שלא הוגדרו מקבלים בסיס נמוך. */
function weightsForMoment(moment: Moment): number[] {
    return TOKENS.map((_, i) => moment.weights[i] ?? BASE_WEIGHT);
}

export const AttentionMomentLab: React.FC = () => {
    const reduce = useReducedMotion();
    const [momentId, setMomentId] = useState(MOMENTS[0].id);
    const moment = MOMENTS.find((m) => m.id === momentId) ?? MOMENTS[0];

    const weights = useMemo(() => weightsForMoment(moment), [moment]);
    const maxW = useMemo(() => Math.max(...weights, 0.0001), [weights]);
    const topIndex = useMemo(() => weights.indexOf(Math.max(...weights)), [weights]);

    return (
        <div className="rounded-2xl border border-violet-500/30 bg-slate-900/50 p-5 text-right" dir="rtl">
            {/* כותרת */}
            <div className="mb-4 flex items-center gap-2">
                <Link2 size={18} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-100">בכל רגע, חלק אחר במשפט מושך יותר משקל</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Attention moment lab</div>
                </div>
            </div>

            {/* בורר רגע */}
            <p className="mb-2 flex items-center gap-1.5 text-xs text-slate-400">
                <MousePointerClick size={13} className="text-violet-400" />
                בחרו רגע בתשובה. נראה אילו מילים מקבלות יותר משקל באותו רגע.
            </p>
            <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="בחירת רגע בתשובה">
                {MOMENTS.map((m, i) => {
                    const active = m.id === momentId;
                    return (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => setMomentId(m.id)}
                            aria-pressed={active}
                            className={`rounded-xl border px-3 py-1.5 text-sm font-bold transition-colors ${active
                                ? 'border-violet-400/60 bg-violet-900/30 text-violet-100'
                                : 'border-slate-700/50 bg-slate-950/30 text-slate-400 hover:border-slate-600'
                                }`}
                        >
                            <span className="ms-1 font-mono text-[10px] text-violet-400/70" dir="ltr">{i + 1}</span>
                            {m.label}
                        </button>
                    );
                })}
            </div>

            <p className="mb-3 text-xs text-slate-400">{moment.hint}</p>

            {/* המשפט כמילים, עוצמת רקע לפי משקל הרגע */}
            <div className="flex flex-wrap items-stretch gap-2" dir="rtl">
                {TOKENS.map((tok, j) => {
                    const isTop = j === topIndex;
                    const intensity = weights[j] / maxW; // 0..1 ביחס למוביל
                    const pct = Math.round(weights[j] * 100);
                    const bg = `rgba(139, 92, 246, ${(0.08 + intensity * 0.55).toFixed(3)})`;
                    return (
                        <motion.div
                            key={tok + j}
                            animate={reduce ? undefined : { scale: isTop ? 1.04 : 1 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                            aria-label={`${tok}, עוצמת קשב ${pct} אחוז${isTop ? ', המילה המובילה ברגע הזה' : ''}`}
                            className={`relative flex flex-col items-center gap-1 rounded-xl border px-3 py-2 text-center ${isTop
                                ? 'border-emerald-400/70 ring-1 ring-emerald-400/50'
                                : 'border-white/10'
                                }`}
                            style={{ backgroundColor: bg }}
                        >
                            <span className="text-base font-bold leading-none text-slate-100">{tok}</span>
                            <span className="font-mono text-[10px] text-slate-300/80" dir="ltr">{pct}%</span>
                        </motion.div>
                    );
                })}
            </div>

            {/* כיתוב דינמי לרגע הנבחר */}
            <motion.p
                key={moment.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-3 text-sm leading-relaxed text-slate-200"
            >
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-200">
                    <Sparkles size={14} /> {moment.label}
                </span>{' '}
                {moment.caption}
            </motion.p>

            <p className="mt-3 text-xs leading-relaxed text-slate-500">
                זו המחשה לימודית מפושטת, לא שיקוף מלא של מנגנון Attention במודל אמיתי. המספרים כאן נועדו להראות את הרעיון:
                אותו משפט, אבל המשקל עובר ממילה למילה לפי מה שהמודל מעבד עכשיו.
            </p>
        </div>
    );
};
