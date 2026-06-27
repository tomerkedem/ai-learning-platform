"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DoorClosed, MousePointerClick, SlidersHorizontal, FlaskConical, Map, ArrowLeft, ShieldCheck } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { ChapterQuiz } from '../ChapterQuiz';
import { InsightBox } from '@/components/content/InsightBox';

import { ConfidenceGateLab } from '@/components/ai-internals/ConfidenceGateLab';
import { Mentor } from '@/components/ai-internals/Mentor';
import { ROADMAP_STEPS_8 } from './gateData';

/** מפת הדרכים: בפרק 9 מגיעים עד צומת ההחלטה, והשער מכריע אם פועלים עליה. */
const Roadmap: React.FC = () => {
    const reduce = useReducedMotion();
    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <Map size={16} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">מפת הדרכים של המנוע</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">From Text to Decision</div>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2" dir="ltr">
                {ROADMAP_STEPS_8.map((s, i) => (
                    <React.Fragment key={s.en}>
                        {i > 0 && <ArrowLeft size={15} className="rotate-180 text-slate-600" />}
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.05 }}
                            className={`relative rounded-xl border px-3 py-1.5 text-center leading-tight ${
                                s.en === 'Decision' ? 'border-emerald-500/50 bg-emerald-900/25' : 'border-violet-500/50 bg-violet-900/25'
                            }`}
                        >
                            <span className={`block text-[11px] font-bold ${s.en === 'Decision' ? 'text-emerald-200' : 'text-violet-200'}`}>{s.he}</span>
                            <span className="block text-[8px] uppercase tracking-wider text-slate-500" dir="ltr">{s.en}</span>
                        </motion.div>
                    </React.Fragment>
                ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
                כל השרשרת רצה עד ההחלטה. אבל ההחלטה לבדה אינה מספיקה: שכבת השער מכריעה אם מותר בכלל לפעול עליה, לפי הפער, הסף והסיכון.
            </p>
        </div>
    );
};

/** פאנל הנוסחה: השער כמדיניות החלטה. */
const FormulaPanel: React.FC = () => (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 text-right" dir="rtl">
        <div className="mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-violet-300" />
            <div className="leading-tight">
                <div className="text-sm font-bold text-slate-200">השער</div>
                <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">The decision gate</div>
            </div>
        </div>
        <div className="space-y-2 font-mono text-sm text-slate-300" dir="ltr">
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">confidence_margin = top_probability - second_probability</div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 leading-relaxed">
                if confidence_margin &lt; threshold: ask for more context<br />
                else: continue
            </div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 leading-relaxed">
                if risk is high: require higher threshold or human approval
            </div>
            <div className="rounded-xl border border-violet-500/40 bg-violet-900/15 p-3 font-bold text-violet-100">
                Decision allowed = (margin &gt;= threshold) AND (risk is acceptable)
            </div>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
            הנוסחה פשוטה בכוונה. המטרה אינה להוכיח מודל מתמטי, אלא להראות איך ביטחון הופך לשער החלטה: הפער הוא הקלט, הסף הוא הכוונון, והסיכון הוא הגורם השני.
        </p>
    </div>
);

export default function BehindTheScenesChapter8() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={9}>

            {/* ══════════ HERO ══════════ */}
            {/* עטיפת relative בלי overflow כדי שהמנטור יוכל לחרוג מגבול הכרטיס */}
            <div className="relative">
            <motion.section
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 text-right"
                dir="rtl"
            >
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-violet-500/30 mb-5">
                        <DoorClosed size={14} className="text-violet-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 09</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        מודל טוב לא רק יודע לענות.{' '}
                        <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent">
                            הוא יודע מתי לא לענות
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        הבחירה המובילה לבדה אינה מספיקה. צריך לדעת אם הפער בין האפשרויות גדול מספיק כדי לפעול עליו. גררו את סף הביטחון,
                        וראו איך אותה התפלגות בדיוק עוברת מ-Answer ל-Ask for more context בזמן אמת. הביטחון אינו רק מספר, הוא מדיניות פעולה.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-violet-400" /> בחרו תרחיש חד מול עמום
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <SlidersHorizontal size={14} className="text-emerald-400" /> גררו את הסף וצפו בשער נפתח ונסגר
                        </span>
                    </div>
                </div>
            </motion.section>
            {/* המנטור: לפעמים לא לענות זה מקצועי (xl+, מימין) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
              <Mentor pose="headsup" line="לפעמים לא לענות זה מקצועי ☝️" width={165} />
            </div>
            </div>

            {/* ══════════ מסלול קריאה ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="space-y-3 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 leading-relaxed text-slate-300">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-violet-300" />
                        <div className="leading-tight">
                            <div className="text-sm font-bold text-slate-200">מה נלמד בפרק הזה</div>
                            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Reading path</div>
                        </div>
                    </div>
                    <p>
                        בפרק הקודם הגענו להתפלגות הסתברויות: המנוע מדרג אפשרויות ויודע מי מוביל. עכשיו נשאל שאלה של אחריות, מתי בכלל מותר להשתמש בהחלטה הזאת.
                    </p>
                    <p>
                        הרעיון המרכזי: לא מספיק לדעת מי מוביל, צריך לדעת בכמה. נכיר את <span className="font-bold text-violet-200">פער הביטחון</span> (ההפרש בין האפשרות הראשונה לשנייה), <span className="font-bold text-violet-200">שער</span> שנפתח או נסגר לפיו, ו<span className="font-bold text-violet-200">סף וסיכון</span> שיכולים לשנות את ההחלטה על אותה התפלגות בדיוק.
                    </p>
                    <p className="font-bold text-violet-200">
                        המסר: מודל טוב לא רק יודע לענות, הוא יודע מתי לא לענות. עצירה ובקשת הקשר אינן כישלון, הן הצעד המקצועי.
                    </p>
                </div>
            </section>

            {/* ══════════ Confidence Gate Lab ══════════ */}
            <section className="relative mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Confidence Gate Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת שער הביטחון</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    ההתפלגויות כאן מגיעות ישירות ממנוע פרק 8. מעליהן יושב השער: הפער בין המוביל לשני נפגש עם סף הביטחון, וברגע שהם
                    מצטלבים השער נפתח או נסגר. החליפו ל-<span className="font-bold text-violet-200">Agent Mode</span> כדי להוסיף את גורם הסיכון: פעולה רגישה דורשת ביטחון
                    גבוה יותר, ויכולה לסגור שער שהיה פתוח על סמך הפער לבדו.
                </div>

                <ConfidenceGateLab />
                {/* המנטור מסביר את השער (xl+, משמאל) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="explain" line="גררו את הסף - השער זז" width={160} />
                </div>
            </section>

            {/* ══════════ נוסחה + מפת דרכים ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <FormulaPanel />
                <Roadmap />
            </section>

            {/* ══════════ סיכום ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                {/* המנטור: עצירה היא צעד מקצועי (xl+, מימין) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="reassure" line="עצירה היא צעד מקצועי" width={160} />
                </div>
                <InsightBox type="intuition" title="הנקודה החשובה בפרק">
                    <span className="block font-bold text-violet-200">מודל טוב לא רק יודע לענות, הוא יודע מתי לא לענות.</span>
                    ראינו שאותה התפלגות בדיוק יכולה להוביל לשתי החלטות הפוכות, תלוי בסף ובסיכון. הפער הוא הקלט, הסף הוא הכוונון, והסיכון
                    הוא הגורם השני. כשהביטחון נמוך, המערכת לא ממציאה תשובה, היא משהה אותה ובונה שאלת הבהרה משתי האפשרויות המתחרות.
                    וב-Agent Mode ראינו שביטחון נמוך לא רק משנה ניסוח, הוא מונע פעולה: על &quot;תטפל בזה&quot; ה-Agent מסרב לפעול ומבקש להבהיר מה זה &quot;זה&quot;.
                    <span className="mt-3 block text-sm text-slate-400">
                        עצירה ובקשת הקשר הן הצעד המקצועי, לא כישלון. כאן מתחיל החיבור בין הסתברות לאחריות, וזה זורע את פרק 13: ככל שהפעולה רגישה יותר, נדרש ביטחון גבוה יותר, ולעיתים אישור אדם.
                    </span>
                </InsightBox>
            </section>


            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir="rtl">
                <ChapterQuiz chapterId={9} />
            </section>
        </ChapterLayout>
    );
}
