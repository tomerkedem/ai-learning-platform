"use client";

// ────────────────────────────────────────────────────────────────────────
// AttentionContextDemo - המחשה קלה ואינטראקטיבית של Attention (קשב להקשר).
//
// המטרה: לפני שהמנוע מדרג דמיון ונותן ציונים, ההקשר מעדכן את משמעות כל מילה.
// הלומד בוחר "מילת מוקד" (ברירת מחדל: "הוא"), ורואה על אילו מילים אחרות היא
// מסתכלת הכי חזק. כך מודגם שהמנוע מחליט אילו טוקנים חשובים לטוקן הנוכחי, ושאותה
// מילה ("הוא") מקבלת משמעות שונה לפי ההקשר.
//
// זו המחשה לימודית מפושטת, לא שיקוף מלא של מנגנון Attention במודל אמיתי.
// המשקלים כתובים ידנית לצורך ההדגמה בלבד.
// אין בקובץ הזה תו "מקף ארוך" (em dash) ולא "מקף בינוני" (en dash).
// ────────────────────────────────────────────────────────────────────────

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MousePointerClick, Sparkles, Link2 } from 'lucide-react';

interface AttentionExample {
    id: string;
    /** תווית קצרה ללשונית. */
    label: string;
    /** המילים, בסדר קריאה. */
    tokens: string[];
    /** אינדקס מילת המוקד שמוצגת כברירת מחדל. */
    focusDefault: number;
    /** לכל מילת-מוקד אפשרית: על אילו מילים היא מסתכלת חזק (משקל 0..1). */
    relations: Record<number, { to: number; w: number }[]>;
}

const EXAMPLES: AttentionExample[] = [
    {
        id: 'dog',
        label: 'הכלב והחתול',
        tokens: ['הכלב', 'רדף', 'אחרי', 'החתול', 'כי', 'הוא', 'היה', 'רעב'],
        focusDefault: 5,
        relations: {
            5: [{ to: 0, w: 0.7 }, { to: 7, w: 0.18 }, { to: 6, w: 0.06 }],
            0: [{ to: 1, w: 0.4 }, { to: 7, w: 0.3 }, { to: 3, w: 0.12 }],
            3: [{ to: 1, w: 0.4 }, { to: 2, w: 0.2 }],
            7: [{ to: 0, w: 0.35 }, { to: 6, w: 0.29 }, { to: 5, w: 0.2 }],
        },
    },
    {
        id: 'driver',
        label: 'השוטר והנהג',
        tokens: ['השוטר', 'עצר', 'את', 'הנהג', 'כי', 'הוא', 'נסע', 'מהר'],
        focusDefault: 5,
        relations: {
            5: [{ to: 3, w: 0.66 }, { to: 7, w: 0.18 }, { to: 6, w: 0.08 }],
            3: [{ to: 1, w: 0.4 }, { to: 6, w: 0.2 }],
            0: [{ to: 1, w: 0.45 }],
            7: [{ to: 6, w: 0.4 }, { to: 3, w: 0.2 }],
        },
    },
];

/** משקלי הקשב ממילת המוקד לכל שאר המילים. ברירת מחדל עדינה לשכנים אם אין נתון. */
function weightsFor(ex: AttentionExample, focus: number): number[] {
    const n = ex.tokens.length;
    const w = new Array<number>(n).fill(0);
    const rel = ex.relations[focus];
    if (rel) {
        for (const r of rel) w[r.to] = r.w;
        for (let j = 0; j < n; j++) if (j !== focus && w[j] === 0) w[j] = 0.04;
    } else {
        for (let j = 0; j < n; j++) {
            if (j === focus) continue;
            const d = Math.abs(j - focus);
            w[j] = d === 1 ? 0.4 : d === 2 ? 0.15 : 0.04;
        }
    }
    return w;
}

export const AttentionContextDemo: React.FC = () => {
    const reduce = useReducedMotion();
    const [exId, setExId] = useState(EXAMPLES[0].id);
    const ex = EXAMPLES.find((e) => e.id === exId) ?? EXAMPLES[0];
    const [focus, setFocus] = useState(ex.focusDefault);

    const weights = useMemo(() => weightsFor(ex, focus), [ex, focus]);
    const maxW = useMemo(() => Math.max(...weights, 0.0001), [weights]);
    const topIndex = useMemo(() => weights.indexOf(Math.max(...weights)), [weights]);

    const focusWord = ex.tokens[focus];
    const topWord = ex.tokens[topIndex];

    const pickExample = (id: string) => {
        const next = EXAMPLES.find((e) => e.id === id) ?? EXAMPLES[0];
        setExId(id);
        setFocus(next.focusDefault);
    };

    return (
        <div className="rounded-2xl border border-violet-500/30 bg-slate-900/50 p-5 text-right" dir="rtl">
            {/* כותרת */}
            <div className="mb-4 flex items-center gap-2">
                <Link2 size={18} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-100">קשב להקשר: למי המילה מתייחסת</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Attention demo</div>
                </div>
            </div>

            {/* בורר דוגמה */}
            <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="בחירת משפט לדוגמה">
                {EXAMPLES.map((e) => {
                    const active = e.id === exId;
                    return (
                        <button
                            key={e.id}
                            type="button"
                            onClick={() => pickExample(e.id)}
                            aria-pressed={active}
                            className={`rounded-xl border px-3 py-1.5 text-sm font-bold transition-colors ${active
                                ? 'border-violet-400/60 bg-violet-900/30 text-violet-100'
                                : 'border-slate-700/50 bg-slate-950/30 text-slate-400 hover:border-slate-600'
                                }`}
                        >
                            {e.label}
                        </button>
                    );
                })}
            </div>

            <p className="mb-3 flex items-center gap-1.5 text-xs text-slate-400">
                <MousePointerClick size={13} className="text-violet-400" />
                בחרו מילת מוקד. נראה על אילו מילים היא מסתכלת הכי חזק.
            </p>

            {/* המשפט כמילים-כפתורים */}
            <div className="flex flex-wrap items-stretch gap-2" dir="rtl">
                {ex.tokens.map((tok, j) => {
                    const isFocus = j === focus;
                    const isTop = j === topIndex && !isFocus;
                    const intensity = weights[j] / maxW; // 0..1 ביחס למוביל
                    const pct = Math.round(weights[j] * 100);
                    const bg = isFocus
                        ? undefined
                        : `rgba(139, 92, 246, ${(0.1 + intensity * 0.55).toFixed(3)})`;
                    return (
                        <button
                            key={`${ex.id}-${j}`}
                            type="button"
                            onClick={() => setFocus(j)}
                            aria-pressed={isFocus}
                            aria-label={isFocus
                                ? `${tok}, מילת המוקד`
                                : `${tok}, עוצמת קשב ${pct} אחוז${isTop ? ', המילה המובילה' : ''}`}
                            className={`relative flex flex-col items-center gap-1 rounded-xl border px-3 py-2 text-center transition-colors ${isFocus
                                ? 'border-violet-300 bg-violet-600 text-white'
                                : isTop
                                    ? 'border-emerald-400/70 text-slate-100 ring-1 ring-emerald-400/50'
                                    : 'border-white/10 text-slate-200 hover:border-white/25'
                                }`}
                            style={isFocus ? undefined : { backgroundColor: bg }}
                        >
                            <span className="text-base font-bold leading-none">{tok}</span>
                            {isFocus ? (
                                <span className="text-[10px] font-medium text-violet-100">מילת מוקד</span>
                            ) : (
                                <span className="font-mono text-[10px] text-slate-300/80" dir="ltr">{pct}%</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* כיתוב דינמי */}
            <motion.p
                key={`${ex.id}-${focus}`}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-3 text-sm leading-relaxed text-slate-200"
            >
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-200">
                    <Sparkles size={14} /> {focusWord === 'הוא' ? 'למי מתייחס "הוא"?' : `מה חשוב ל"${focusWord}"?`}
                </span>{' '}
                המילה <span className="font-bold text-white">&quot;{focusWord}&quot;</span> מסתכלת הכי חזק על{' '}
                <span className="font-bold text-emerald-200">&quot;{topWord}&quot;</span>. כך המנוע מחליט אילו מילים חשובות
                למילה הנוכחית, ולכן הוא יודע למי היא מתייחסת.
            </motion.p>

            <p className="mt-3 text-xs leading-relaxed text-slate-500">
                זו המחשה לימודית מפושטת, לא שיקוף מלא של מנגנון Attention במודל אמיתי. המספרים כאן נועדו להראות את הרעיון:
                אותה מילה מקבלת משמעות אחרת לפי ההקשר שסביבה.
            </p>
        </div>
    );
};
