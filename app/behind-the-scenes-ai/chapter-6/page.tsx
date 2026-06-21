"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Binary, MousePointerClick, ArrowLeftRight, FlaskConical, Sigma, Map, ArrowLeft, Lock } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';

import { WordToNumberLab } from '@/components/ai-internals/WordToNumberLab';
import {
    FORMULA_DIMS,
    FORMULA_ROWS,
    FORMULA_SUM,
    ROADMAP_STEPS_6,
    idForWord,
} from './embeddingEngine';

/** מפת הדרכים של פרק 6: ארבעת הצמתים הראשונים פעילים, השאר נעולים. */
const Roadmap: React.FC = () => {
    const reduce = useReducedMotion();
    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <Map size={16} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">מפת הדרכים של המנוע</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">From Text to Probabilities</div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2" dir="ltr">
                {ROADMAP_STEPS_6.map((stepItem, i) => (
                    <React.Fragment key={stepItem.en}>
                        {i > 0 && <ArrowLeft size={15} className="rotate-180 text-slate-600" />}
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.05 }}
                            className={`relative rounded-xl border px-3 py-1.5 text-center leading-tight ${
                                stepItem.active ? 'border-violet-500/50 bg-violet-900/25' : 'border-slate-700/40 bg-slate-950/30'
                            }`}
                        >
                            <span className={`flex items-center gap-1 text-[11px] font-bold ${stepItem.active ? 'text-violet-200' : 'text-slate-500'}`}>
                                {!stepItem.active && <Lock size={9} />}
                                {stepItem.he}
                            </span>
                            <span className="block text-[8px] uppercase tracking-wider text-slate-500" dir="ltr">{stepItem.en}</span>
                        </motion.div>
                    </React.Fragment>
                ))}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-400">
                בפרק הזה עברנו שני שלבים בבת אחת: כל טוקן קיבל Token ID, ומהרצף הזה נבנה וקטור משמעות. שני השלבים הבאים, דמיון וציונים, הם שם נחשב כמה שני ייצוגים קרובים ואיך מדרגים. את החישוב המלא של הדמיון נפתח בפרק 7.
            </p>
        </div>
    );
};

/** פאנל הנוסחה: דוגמת סכימת וקטורים לימודית, נפרדת מהפרופיל המנורמל. */
const FormulaPanel: React.FC = () => (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 text-right" dir="rtl">
        <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                <Sigma size={18} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">הנוסחה</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">The formula</div>
                </div>
            </div>
            <span className="rounded-md border border-amber-500/40 bg-amber-900/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                נוסחה לימודית
            </span>
        </div>

        <div className="mb-4 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 font-mono text-sm text-slate-300" dir="ltr">
            sentence_vector = sum(token_vectors)
        </div>

        {/* דוגמת סכימה קטנה ועצמאית, ממדים [Delivery, System, Address, Failure] */}
        <div className="overflow-x-auto">
            <div className="min-w-[22rem] font-mono text-xs" dir="ltr">
                <div className="grid grid-cols-[5.5rem_1fr] gap-2 border-b border-slate-700/50 pb-2 text-[10px] uppercase tracking-wider text-slate-500">
                    <span>token</span>
                    <span>[{FORMULA_DIMS.join(', ')}]</span>
                </div>
                {FORMULA_ROWS.map((row) => (
                    <div key={row.word} className="grid grid-cols-[5.5rem_1fr] items-center gap-2 py-1.5 text-slate-300">
                        <span className="text-slate-200" dir="rtl">{row.word}</span>
                        <span>[{row.values.map((v) => v.toFixed(1)).join(', ')}]</span>
                    </div>
                ))}
                <div className="mt-1 grid grid-cols-[5.5rem_1fr] items-center gap-2 border-t border-slate-700/50 pt-2 font-bold text-violet-200">
                    <span dir="rtl">משפט</span>
                    <span>[{FORMULA_SUM.map((v) => v.toFixed(1)).join(', ')}]</span>
                </div>
            </div>
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
            זו תצוגת סכימה לימודית: סכום הווקטורים מגיע ל-1.5 בממד המשלוח. שימו לב, זו אינה אותה תצוגה כמו הפרופיל המנורמל (0 עד 1) שב-Meaning Vector Live. הפרדנו אותן בכוונה, כדי שלא יתבלבלו: האחת מדגימה את הרעיון של סכימה, השנייה נוחה יותר להשוואה ויזואלית.
        </p>
    </div>
);

export default function BehindTheScenesChapter6() {
    const reduce = useReducedMotion();
    const idsA = ['החבילה', 'לא', 'הגיעה'].map(idForWord).join(', ');
    const idsB = ['המשלוח', 'לא', 'נמסר'].map(idForWord).join(', ');

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={6}>

            {/* ══════════ HERO ══════════ */}
            <motion.section
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 text-right"
                dir="rtl"
            >
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-violet-500/30 mb-5">
                        <Binary size={14} className="text-violet-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 06</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        המנוע לא רואה מילים.{' '}
                        <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                            הוא רואה מספרים
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        לפני שאפשר לחשב, להשוות או לדרג, הטקסט הופך ל-Token IDs ואז ל-Meaning Vector. הקלידו משפט, וראו אותו נהפך לרצף
                        מספרים ואז לפרופיל משמעות חי. ושימו לב לרגע המפתיע: שני משפטים עם מילים שונות לגמרי יכולים להצביע לאותו כיוון.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-violet-400" /> הקלידו או לחצו &quot;הקלידו עבורי&quot;
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <ArrowLeftRight size={14} className="text-cyan-400" /> צפו בשני משפטים שונים שמתיישרים לאותו כיוון
                        </span>
                    </div>
                </div>
            </motion.section>

            {/* ══════════ Word To Number Lab ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Word To Number Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת המילים למספרים</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    כאן נראה את שני השלבים שקורים אחרי הפירוק לטוקנים: כל טוקן מקבל Token ID (כתובת קבועה במילון), ומרצף ה-IDs נבנה
                    וקטור משמעות, פרופיל מספרי שמתאר לאן המשפט &quot;מצביע&quot;. החליפו בין Chat Mode ל-Agent Mode כדי לראות איך אותו ייצוג
                    מספרי לא רק עונה, אלא גם משפיע על החלטות פעולה.
                </div>

                <WordToNumberLab />
            </section>

            {/* ══════════ נוסחה + מפת דרכים ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <FormulaPanel />
                <Roadmap />
            </section>

            {/* ══════════ סיכום + גשר לפרק 7 ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <InsightBox type="intuition" title="הנקודה החשובה בפרק">
                    <span className="block font-bold text-violet-200">המנוע לא עובד עם מילים, הוא עובד עם ייצוגים מספריים.</span>
                    כל מילה מקבלת Token ID, שהוא כתובת במילון ולא משמעות, ומרצף ה-IDs נבנה וקטור משמעות. ראינו את הרגע המפתיע:
                    &quot;החבילה לא הגיעה&quot; ({idsA}) ו-&quot;המשלוח לא נמסר&quot; ({idsB}) מקבלים Token IDs שונים לגמרי, אבל וקטור משמעות כמעט
                    זהה. המודל לא צריך לראות בדיוק אותן מילים כדי לזהות כיוון דומה. וב-Agent Mode ראינו שאותו פרופיל מספרי מבדיל בין
                    חקירה בטוחה לבין פעולה מסוכנת מול לקוח שדורשת אישור.
                    <span className="mt-3 block text-sm text-slate-400">
                        גשר לפרק הבא: אם שני וקטורים יכולים להיות קרובים, צריך דרך למדוד כמה. זה בדיוק מה שנפתח בפרק 7, חישוב הדמיון בין ייצוגים. כאן רק הצגנו את הקרבה ויזואלית, שם נחשב אותה.
                    </span>
                </InsightBox>
            </section>

        </ChapterLayout>
    );
}
