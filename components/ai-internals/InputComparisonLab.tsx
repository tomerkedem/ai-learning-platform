"use client";

// ────────────────────────────────────────────────────────────────────────
// InputComparisonLab - מעבדת השוואת הקלט של פרק 2 (מה באמת נכנס למודל).
//
// הלומד בוחר אחד מכמה ניסוחים של אותו צורך, ורואה מה נכנס למודל בפועל: מה מפורש,
// מה חסר, מה השתנה, רמת העמימות, מה מצופה, האם דרוש מידע חיצוני, ולאן זה נוטה
// (Chat או Agent). המסר: אותו רצון, מנוסח אחרת, מכניס למודל חומר אחר לעבוד איתו.
//
// הפרק לא מלמד טוקניזציה לעומק. יש רק רמיזה אחת קצרה. אין מקף ארוך, מקף בינוני
// או נקודה-פסיק בתוך טקסט עברית.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, MinusCircle, ArrowLeftRight, Gauge, Target, Database, Split, Info, MousePointerClick } from 'lucide-react';

import { StickyContextBar, type ContextTone } from './StickyContextBar';
import { INPUT_VARIATIONS, BASE_ID, type Ambiguity, type Tendency } from '@/app/behind-the-scenes-ai/chapter-2/inputVariations';

const AMBIGUITY: Record<Ambiguity, { he: string; chip: string }> = {
    low: { he: 'נמוכה', chip: 'border-emerald-400/40 bg-emerald-900/20 text-emerald-200' },
    medium: { he: 'בינונית', chip: 'border-amber-400/40 bg-amber-900/20 text-amber-200' },
    high: { he: 'גבוהה', chip: 'border-rose-400/40 bg-rose-900/20 text-rose-200' },
};

const TENDENCY: Record<Tendency, { he: string; chip: string; tone: ContextTone }> = {
    chat: { he: 'נוטה ל-Chat', chip: 'border-sky-400/40 bg-sky-900/20 text-sky-200', tone: 'neutral' },
    'chat-agent': { he: 'בין Chat ל-Agent', chip: 'border-indigo-400/40 bg-indigo-900/20 text-indigo-200', tone: 'caution' },
    agent: { he: 'נוטה ל-Agent', chip: 'border-violet-400/40 bg-violet-900/20 text-violet-200', tone: 'caution' },
};

/** כרטיס שדה בודד בלוח הקריאה. */
const Field: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="rounded-xl border border-slate-700/50 bg-slate-950/30 p-3.5">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {icon} {title}
        </div>
        <div className="text-sm leading-relaxed text-slate-200">{children}</div>
    </div>
);

export const InputComparisonLab: React.FC = () => {
    const reduce = useReducedMotion();
    const [id, setId] = useState(BASE_ID);
    const v = INPUT_VARIATIONS.find((x) => x.id === id) ?? INPUT_VARIATIONS[0];
    const isBase = v.id === BASE_ID;
    const tnd = TENDENCY[v.tendency];
    const amb = AMBIGUITY[v.ambiguity];

    return (
        <div className="rounded-2xl border border-violet-500/30 bg-slate-900/50 p-5 text-right" dir="rtl">
            {/* רמיזה קצרה לטוקניזציה, בלי ללמד אותה כאן */}
            <p className="mb-4 rounded-xl border border-slate-700/40 bg-slate-950/30 p-3 text-xs leading-relaxed text-slate-400">
                בהמשך הלומדה הטקסט יפורק לטוקנים. עכשיו אנחנו מסתכלים רק על מה הקלט מכיל, עוד לפני הפירוק.
            </p>

            {/* בורר ניסוחים */}
            <p className="mb-2 flex items-center gap-1.5 text-xs text-slate-400">
                <MousePointerClick size={13} className="text-violet-400" />
                בחרו ניסוח, וראו מה נכנס למודל בפועל.
            </p>
            <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="בחירת ניסוח להשוואה">
                {INPUT_VARIATIONS.map((item) => {
                    const active = item.id === id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setId(item.id)}
                            aria-pressed={active}
                            className={`rounded-xl border px-3 py-1.5 text-sm font-bold transition-colors ${active
                                ? 'border-violet-400/60 bg-violet-900/30 text-violet-100'
                                : 'border-slate-700/50 bg-slate-950/30 text-slate-400 hover:border-slate-600'
                                }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* פס הקשר דביק: הניסוח הפעיל והנטייה שלו, נשאר גלוי תוך כדי קריאת הלוח */}
            <StickyContextBar
                inputText={v.prompt}
                labelHe={v.label}
                decisionHe={tnd.he}
                tone={tnd.tone}
                metricHe={`עמימות ${amb.he}`}
                reduce={!!reduce}
            />

            {/* לוח הקריאה */}
            <motion.div
                key={v.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
                <Field icon={<Check size={13} className="text-emerald-300" />} title="מה מפורש בטקסט">
                    <ul className="space-y-1">
                        {v.explicit.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                </Field>

                <Field icon={<MinusCircle size={13} className="text-amber-300" />} title="מה חסר">
                    <ul className="space-y-1">
                        {v.missing.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                </Field>

                <Field icon={<ArrowLeftRight size={13} className="text-violet-300" />} title="מה השתנה לעומת הבסיס">
                    {isBase ? <span className="text-slate-400">זו נקודת הבסיס להשוואה.</span> : v.changed}
                </Field>

                <Field icon={<Gauge size={13} className="text-slate-300" />} title="רמת עמימות">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${amb.chip}`}>{amb.he}</span>
                </Field>

                <Field icon={<Target size={13} className="text-cyan-300" />} title="מה מצופה מהמודל">
                    {v.expectation}
                </Field>

                <Field icon={<Database size={13} className="text-slate-300" />} title="דרוש מידע חיצוני">
                    {v.externalData ? (
                        <span>
                            <span className="font-bold text-violet-200">כן.</span> {v.externalNote}
                        </span>
                    ) : (
                        <span className="text-slate-400">לא נדרש בשלב הזה.</span>
                    )}
                </Field>

                <Field icon={<Split size={13} className="text-slate-300" />} title="לאן זה נוטה">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${tnd.chip}`}>{tnd.he}</span>
                </Field>

                {v.note && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-3.5 sm:col-span-2">
                        <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                            <Info size={13} /> שווה לשים לב
                        </div>
                        <div className="text-sm leading-relaxed text-slate-200">{v.note}</div>
                    </div>
                )}
            </motion.div>

            <p className="mt-4 text-xs leading-relaxed text-slate-500">
                אותו צורך, ניסוחים שונים. בכל ניסוח המודל מקבל חומר אחר לעבוד איתו, עוד לפני שמתחיל עיבוד עמוק יותר.
            </p>
        </div>
    );
};
