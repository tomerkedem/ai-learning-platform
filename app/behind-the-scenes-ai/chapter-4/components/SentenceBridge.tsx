"use client";

// SentenceBridge - הגשר המושגי של פרק 4, בין מעבדה 1 למעבדה 2.
// ──────────────────────────────────────────────────────────────────────────
// מעבדה 1 מלמדת "שורה אחת לכל טוקן". מעבדה 2 מציגה ייצוג אחד למשפט שלם. בלי הגשר הזה
// הלומד מסיק שגם למשפט יש שורה בטבלה. לכן המעבר מוצג כשלושה שלבים גלויים:
//   טוקן -> וקטור לכל טוקן  ->  עיבוד משותף בהקשר  ->  ייצוג לימודי אחד למשפט
// ואחריהם הבהרה מפורשת שלמשפט אין שורה משלו בטבלה.
//
// זרימה אחת, לא ערימת כרטיסים: משטח יחיד לכל המקטע, והשלבים בתוכו הם שלבים "קלים"
// (מספור, ריווח ומחברים) בלי מסגרת או רקע מוגבה משלהם. ההבהרה היא שורת הסיום של אותה
// זרימה, מופרדת בקו דק בלבד.
//
// הרצף נקרא במלואו מהטקסט עצמו: החצים והדיאגרמות הקטנות הן aria-hidden ואינן נושאות
// מידע בלעדי. אנימציית הכניסה מדורגת בלבד ולא נדרשת להבנה (reduced-motion: ללא תנועה).
// גדלי הגופן הם גדלי גוף הלומדה (15px ומעלה), לא הערת שוליים. RTL/LTR בטוח.

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, Info, Layers } from 'lucide-react';

import { SpeakButton } from '@/components/ai-internals/SpeakButton';
import { useT } from '@/i18n/useT';

/* ── דיאגרמות מיניאטוריות: המחשה בלבד, לא נושאות מידע. תמיד aria-hidden. ── */

const VectorBars: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <span className="flex items-end gap-0.5">
        {Array.from({ length: count }).map((_, i) => (
            <span
                key={i}
                className="w-1 rounded-sm bg-violet-400/80"
                style={{ height: `${5 + ((i * 4) % 8)}px` }}
            />
        ))}
    </span>
);

// שלב 1: כל טוקן, ומתחתיו הווקטור שנשלף עבורו
const DiagramTokens: React.FC = () => (
    <span className="flex items-end gap-2">
        {['1042', '17', '883'].map((id) => (
            <span key={id} className="flex flex-col items-center gap-1">
                <span className="rounded border border-cyan-400/40 bg-cyan-500/10 px-1.5 py-px font-mono text-[10px] font-bold text-cyan-200">
                    {id}
                </span>
                <VectorBars />
            </span>
        ))}
    </span>
);

// שלב 2: אותם וקטורים, אבל כל אחד מושפע מהשכנים (קווי הקשר ביניהם)
const DiagramContext: React.FC = () => (
    <span className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
            <React.Fragment key={i}>
                {i > 0 && <span className="h-px w-2.5 bg-violet-400/50" />}
                <span className="rounded border border-violet-400/40 bg-violet-500/10 px-1 py-1">
                    <VectorBars />
                </span>
            </React.Fragment>
        ))}
    </span>
);

// שלב 3: ייצוג לימודי אחד למשפט כולו
const DiagramSummary: React.FC = () => (
    <span className="rounded border border-fuchsia-400/40 bg-fuchsia-500/10 px-2 py-1">
        <VectorBars count={7} />
    </span>
);

const DIAGRAMS = [DiagramTokens, DiagramContext, DiagramSummary];

/* ── מחבר בין שלבים: חץ מטה במובייל, חץ לפי כיוון הקריאה בדסקטופ. דקורטיבי בלבד. ── */

const Connector: React.FC<{ isRtl: boolean }> = ({ isRtl }) => (
    <span aria-hidden className="flex shrink-0 items-center justify-center text-slate-600 md:px-1">
        <ChevronDown size={14} className="md:hidden" />
        {isRtl ? (
            <ChevronLeft size={16} className="hidden md:block" />
        ) : (
            <ChevronRight size={16} className="hidden md:block" />
        )}
    </span>
);

export const SentenceBridge: React.FC = () => {
    const { t, dir } = useT();
    const s = t.behindAi.chapter4.sequence;
    const reduce = useReducedMotion();
    const isRtl = dir === 'rtl';

    // הקראה: כותרת, מבוא, שלושת השלבים לפי סדר התצוגה, ואז ההבהרה. זהה לסדר הנקרא בעין.
    const speakText = [
        s.title,
        s.intro,
        ...s.steps.map((st, i) => `${i + 1}. ${st.title}. ${st.body}`),
        s.clarify,
    ].join(' ');

    return (
        <section dir={dir} className="rounded-[2rem] border border-slate-700/50 bg-slate-900/50 p-5 backdrop-blur-xl md:p-7">
            <div className="flex items-start justify-between gap-2.5">
                <div>
                    <span className="mb-1.5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-300">
                        <Layers size={14} /> {s.eyebrow}
                    </span>
                    <h3 className="text-xl font-black text-white md:text-2xl">{s.title}</h3>
                </div>
                <SpeakButton text={speakText} className="mt-0.5" />
            </div>

            <p className="mt-1.5 text-[15px] leading-relaxed text-slate-300">{s.intro}</p>

            {/* שלושת השלבים כזרימה אחת: בלי מסגרת או רקע לכל שלב. במובייל נערמים עם חץ מטה,
                בדסקטופ בשורה עם חץ לפי כיוון הקריאה. הטקסט מיושר תחת הכותרת (ps במובייל). */}
            <ol className="mt-4 flex list-none flex-col gap-1.5 md:flex-row md:items-start md:gap-1">
                {s.steps.map((step, i) => {
                    const Diagram = DIAGRAMS[i];
                    return (
                        <React.Fragment key={step.title}>
                            {i > 0 && <Connector isRtl={isRtl} />}
                            <motion.li
                                initial={reduce ? false : { opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={reduce ? { duration: 0 } : { duration: 0.35, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className="flex-1"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-violet-500/40 bg-violet-500/15 font-mono text-[12px] font-black text-violet-200">
                                        {i + 1}
                                    </span>
                                    <span className="text-base font-bold leading-tight text-white">{step.title}</span>
                                </div>

                                {/* המחשה חזותית בלבד: הרצף מוסבר במלואו בטקסט שמתחתיה */}
                                <span aria-hidden className="mt-2 flex ps-[2.125rem] md:ps-0">
                                    <Diagram />
                                </span>

                                <p className="mt-1.5 ps-[2.125rem] text-[15px] leading-relaxed text-slate-300 md:ps-0">
                                    {step.body}
                                </p>
                            </motion.li>
                        </React.Fragment>
                    );
                })}
            </ol>

            {/* שורת הסיום של אותה זרימה: קו דק מפריד, לא כרטיס נפרד */}
            <div className="mt-4 flex items-start gap-2.5 border-t border-slate-700/50 pt-3.5">
                <Info size={17} className="mt-0.5 shrink-0 text-violet-300" />
                <p className="text-[15px] leading-relaxed text-slate-300">{s.clarify}</p>
            </div>
        </section>
    );
};
