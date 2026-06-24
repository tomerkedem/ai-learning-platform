"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GitBranch, MousePointerClick, Waves, FlaskConical, Map, ArrowLeft, BookOpen, ListChecks } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';

import { PipelineCascadeLab } from '@/components/ai-internals/PipelineCascadeLab';
import { Mentor } from '@/components/ai-internals/Mentor';
import { ROADMAP_STEPS_7 } from './pipelineData';

/** השרשרת המלאה כפס עליון, עמוד השדרה הוויזואלי של הפרק. */
const CHAIN = [
    { he: 'וקטור משמעות', en: 'Meaning Vector' },
    { he: 'דמיון', en: 'Similarity' },
    { he: 'ציונים גולמיים', en: 'Raw Scores' },
    { he: 'Softmax', en: 'Softmax' },
    { he: 'הסתברויות', en: 'Probabilities' },
    { he: 'החלטה', en: 'Decision' },
];

const ChainStrip: React.FC = () => {
    const reduce = useReducedMotion();
    return (
        <div className="flex flex-wrap items-center gap-2" dir="ltr">
            {CHAIN.map((step, i) => (
                <React.Fragment key={step.en}>
                    {i > 0 && <ArrowLeft size={14} className="rotate-180 text-violet-500/60" />}
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.07 }}
                        className="rounded-xl border border-violet-500/30 bg-violet-900/15 px-3 py-1.5 text-center leading-tight"
                    >
                        <span className="block text-xs font-bold text-violet-200">
                            <span className="font-mono text-violet-400">{i + 1}.</span> {step.he}
                        </span>
                        <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{step.en}</span>
                    </motion.div>
                </React.Fragment>
            ))}
        </div>
    );
};

/** ששת השלבים של השרשרת, באותו מספור ובאותו סדר שבו הם מופיעים במעבדה. */
const READING_STEPS = [
    { num: '1', he: 'וקטור משמעות', en: 'Meaning Vector', desc: 'הפרופיל המספרי של המשפט, נקודת הפתיחה' },
    { num: '2', he: 'דמיון', en: 'Similarity', desc: 'בודק למה המשפט הכי קרוב' },
    { num: '3', he: 'ציון גולמי', en: 'Score', desc: 'נותן לכל אפשרות ציון אחד' },
    { num: '4', he: 'Softmax', en: 'Softmax', desc: 'הופך ציונים להסתברויות שמסתכמות ל-100%' },
    { num: '5', he: 'הסתברויות', en: 'Probabilities', desc: 'ההתפלגות הסופית שעליה מחליטים' },
    { num: '6', he: 'החלטה', en: 'Decision', desc: 'בוחר לפי ההתפלגות' },
];

/** מסלול קריאה: מספר את כל השרשרת במילים, לפני שמראים אותה בתנועה. */
const ReadingPath: React.FC = () => (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 text-right leading-relaxed text-slate-300" dir="rtl">
        <div className="mb-4 flex items-center gap-2">
            <BookOpen size={16} className="text-violet-300" />
            <div className="leading-tight">
                <div className="text-sm font-bold text-slate-200">לפני שנכנסים למפל</div>
                <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Read this first</div>
            </div>
        </div>
        <p className="text-sm">
            עד עכשיו ראינו איך משפט הופך לפרופיל מספרי. בפרק הזה נראה מה המנוע עושה עם הפרופיל. הוא לא קופץ ממנו ישר לתשובה,
            אלא עובר שרשרת ממוספרת: מתחיל מווקטור המשמעות, בודק למה המשפט דומה, נותן לכל אפשרות ציון גולמי, מפעיל Softmax שהופך
            את הציונים להסתברויות שמסתכמות ל-100 אחוז, ורק אז בוחר. ששת השלבים למטה ממוספרים באותו סדר ובאותם מספרים שתראו
            במעבדה, כדי שתמיד תדעו באיזה שלב אתם. דבר אחד שכדאי לזכור כבר עכשיו, כל מספר שתראו הוא תוצאה של חישוב, לא ניחוש.
        </p>
        <ol className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {READING_STEPS.map((s) => (
                <li key={s.en} className="flex items-start gap-2.5 rounded-xl border border-slate-700/40 bg-slate-950/30 p-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 font-mono text-xs font-bold text-violet-200" dir="ltr">{s.num}</span>
                    <span className="leading-tight">
                        <span className="text-sm font-bold text-slate-100">{s.he} </span>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500" dir="ltr">{s.en}</span>
                        <span className="mt-0.5 block text-[13px] text-slate-300">{s.desc}</span>
                    </span>
                </li>
            ))}
        </ol>
    </div>
);

/** מפת הדרכים: בפרק 8 כל הצמתים פעילים עד Probabilities. */
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
                {ROADMAP_STEPS_7.map((s, i) => (
                    <React.Fragment key={s.en}>
                        {i > 0 && <ArrowLeft size={15} className="rotate-180 text-slate-600" />}
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.05 }}
                            className="relative rounded-xl border border-violet-500/50 bg-violet-900/25 px-3 py-1.5 text-center leading-tight"
                        >
                            <span className="block text-xs font-bold text-violet-200">{s.he}</span>
                            <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{s.en}</span>
                        </motion.div>
                    </React.Fragment>
                ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
                כל הצמתים פעילים עכשיו. מהטקסט ועד ההסתברויות, ראינו את כל השרשרת רצה. זה סוף המחצית הראשונה: הבנו איך הקלט הופך לפלט מספרי. מכאן והלאה נפתח איך המנוע לומד את הייצוגים האלה מלכתחילה.
            </p>
        </div>
    );
};

/** שלוש נקודות שמכינות בדיוק למושגים שהמבדק בודק, ממש לפני המבדק. */
const BEFORE_QUIZ_POINTS = [
    {
        he: 'דמיון אינו הסתברות',
        desc: 'הדמיון (Cosine Similarity) מודד קרבת כיוון בין שני וקטורים, כמו שני חצים: אותו כיוון נותן דמיון גבוה. הוא רק השלב הראשון בשרשרת, ולא אומר באיזו הסתברות המנוע יבחר.',
    },
    {
        he: 'ציון גולמי אינו אחוז',
        desc: 'כל אפשרות מקבלת ציון אחד, אבל הציונים הגולמיים לא מסתכמים ל-100%. רק Softmax הופך אותם להסתברויות שמסתכמות ל-100%.',
    },
    {
        he: 'שרשרת, לא קפיצה',
        desc: 'המנוע עובר דמיון, ציון, הסתברות, החלטה. שינוי מילה אחת שולח גל שינוי במורד כל השכבות ויכול להפוך את ההחלטה.',
    },
];

const BeforeQuizCard: React.FC = () => (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5 text-right" dir="rtl">
        <div className="mb-4 flex items-center gap-2">
            <ListChecks size={18} className="text-emerald-300" />
            <div className="leading-tight">
                <div className="text-sm font-bold text-slate-100">שלוש נקודות שכדאי לזכור</div>
                <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Before the quiz</div>
            </div>
        </div>
        <ol className="space-y-2.5">
            {BEFORE_QUIZ_POINTS.map((p, i) => (
                <li key={p.he} className="flex items-start gap-3 rounded-xl border border-slate-700/40 bg-slate-950/30 p-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 font-mono text-xs font-bold text-emerald-200" dir="ltr">{i + 1}</span>
                    <span className="leading-relaxed">
                        <span className="block text-base font-bold text-emerald-100">{p.he}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-slate-300">{p.desc}</span>
                    </span>
                </li>
            ))}
        </ol>
    </div>
);

export default function BehindTheScenesChapter7() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={8}>

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
                        <GitBranch size={14} className="text-violet-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 08</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        האחוזים אינם קסם.{' '}
                        <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent">
                            הם השלב האחרון בשרשרת
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        בפרק הזה נראה איך משפט אחד הופך בהדרגה להחלטה. המנוע לא קופץ מהטקסט לתשובה, אלא עובר שרשרת שלבים: וקטור משמעות,
                        דמיון, ציונים גולמיים, Softmax, ואז הסתברויות. המטרה היא להבין שדמיון אינו הסתברות וציון גולמי אינו אחוז. רק בסוף
                        השרשרת מתקבלת התפלגות שאפשר להחליט לפיה.
                    </p>

                    <div className="mt-6">
                        <ChainStrip />
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-violet-400" /> הקלידו או בחרו ניסוי מהיר
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Waves size={14} className="text-emerald-400" /> לחצו &quot;החלפת מילה&quot; וראו את כל השלבים מתעדכנים
                        </span>
                    </div>
                </div>
            </motion.section>
            {/* המנטור: האחוזים אינם קסם (xl+, מימין) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
              <Mentor pose="chart" line="האחוזים אינם קסם 📊" width={165} />
            </div>
            </div>

            {/* ══════════ מסלול קריאה ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <ReadingPath />
            </section>

            {/* ══════════ Pipeline Cascade Lab ══════════ */}
            <section className="relative mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Pipeline Cascade Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת מפל החישוב</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    נתחיל ממסלול ממוקד: הקלידו משפט, וראו אותו עובר שלוש תחנות, דמיון, ציון גולמי, ואז הסתברות. המטרה כאן היא לראות שרשרת,
                    לא קפיצה: אותה אפשרות מובילה מקבלת שלושה מספרים שונים, ושום אחוז לא מופיע משום מקום. החליפו מילה אחת וצפו בגל השינוי
                    עובר דרך שלוש התחנות בבת אחת.
                    <span className="mt-3 block text-sm text-slate-400">
                        זה כל מה שצריך כדי לתפוס את הרעיון: <span className="font-bold text-violet-200">דמיון אינו הסתברות, וגם ציון גולמי אינו הסתברות</span>. מי שרוצה לראות את החישוב המלא, את כל שש השכבות, את מכונת ה-Softmax צעד-אחר-צעד ואת Agent Mode, יכול לפתוח את <span className="font-bold text-violet-200">שכבת העומק</span> בכפתור שבראש המעבדה.
                    </span>
                </div>

                <PipelineCascadeLab />
                {/* המנטור: שרשרת, לא קפיצה (xl+, משמאל) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="inspect" line="שרשרת, לא קפיצה" width={160} />
                </div>
            </section>

            {/* ══════════ מפת דרכים ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <Roadmap />
            </section>

            {/* ══════════ סיכום ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                {/* המנטור חוגג סוף מחצית (xl+, מימין) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="celebrate" line="סוף המחצית הראשונה 🎉" width={160} />
                </div>
                <InsightBox type="intuition" title="הנקודה החשובה בפרק">
                    <span className="block font-bold text-violet-200">המערכת לא קופצת ממשפט לתשובה. היא הופכת משמעות לדמיון, דמיון לציון, ציון להסתברות, והסתברות להחלטה. האחוזים הם השלב האחרון בשרשרת חישובים, לא קסם.</span>
                    ראינו ארבעה שלבים נפרדים: וקטור המשמעות, דמיון (Cosine Similarity, שהוא קרבת כיוון ולא הסתברות), ציונים גולמיים
                    (שלא מסתכמים ל-100%), ורק אחרי Softmax, הסתברויות אמיתיות. שינוי מילה אחת שלח גל שינוי במורד כל השרשרת והפך את
                    המוביל. וב-Agent Mode ראינו שאותה מכונת חישוב מדרגת צעדים לפי מצב: מסירת ברקוד הפכה את הדירוג מ-&quot;לבקש ברקוד&quot; ל-&quot;להשתמש בכלי מעקב&quot;.
                    <span className="mt-3 block text-sm text-slate-400">
                        זכרו: דירוג הכוונות הוא ההפשטה הלימודית שלנו. מודל אמיתי מדרג בכל צעד את ה-token הבא, לא כוונות שלמות, אבל העיקרון זהה: השוואה, ציון, Softmax, החלטה. כאן נסגרת המחצית הראשונה של הלומדה.
                    </span>
                </InsightBox>
            </section>


            {/* ══════════ שלוש נקודות לפני המבדק ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <BeforeQuizCard />
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-12 mb-4" dir="rtl">
                <AssessmentEngine {...behindAiChapterQuizzes[8]} />
            </section>
        </ChapterLayout>
    );
}
