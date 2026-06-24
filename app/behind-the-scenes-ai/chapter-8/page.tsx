"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GitBranch, MousePointerClick, Waves, FlaskConical, Map, ArrowLeft, BookOpen } from 'lucide-react';

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
                        <span className="block text-[11px] font-bold text-violet-200">{step.he}</span>
                        <span className="block text-[8px] uppercase tracking-wider text-slate-500" dir="ltr">{step.en}</span>
                    </motion.div>
                </React.Fragment>
            ))}
        </div>
    );
};

/** ארבעת השלבים של השרשרת, לטובת מסלול הקריאה בראש הפרק. */
const READING_STEPS = [
    { num: '1', he: 'דמיון', en: 'Similarity', desc: 'בודק למה המשפט הכי קרוב' },
    { num: '2', he: 'ציון גולמי', en: 'Score', desc: 'נותן לכל אפשרות ציון אחד' },
    { num: '3', he: 'Softmax', en: 'Softmax', desc: 'הופך ציונים להסתברויות שמסתכמות ל-100%' },
    { num: '4', he: 'החלטה', en: 'Decision', desc: 'בוחר לפי ההתפלגות' },
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
            אלא עובר שרשרת של ארבעה שלבים: קודם בודק למה המשפט דומה, אחר כך נותן לכל אפשרות ציון גולמי, אחר כך הופך את הציונים
            להסתברויות שמסתכמות ל-100 אחוז, ורק אז בוחר. נעבור על כל שלב בנפרד, ובסוף נראה את כולם זזים יחד. דבר אחד שכדאי
            לזכור כבר עכשיו, כל מספר שתראו הוא תוצאה של חישוב, לא ניחוש.
        </p>
        <ol className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {READING_STEPS.map((s) => (
                <li key={s.en} className="flex items-start gap-2.5 rounded-xl border border-slate-700/40 bg-slate-950/30 p-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 font-mono text-[11px] font-bold text-violet-200" dir="ltr">{s.num}</span>
                    <span className="leading-tight">
                        <span className="text-xs font-bold text-slate-200">{s.he} </span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{s.en}</span>
                        <span className="mt-0.5 block text-[11px] text-slate-400">{s.desc}</span>
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
                            <span className="block text-[11px] font-bold text-violet-200">{s.he}</span>
                            <span className="block text-[8px] uppercase tracking-wider text-slate-500" dir="ltr">{s.en}</span>
                        </motion.div>
                    </React.Fragment>
                ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
                כל הצמתים פעילים עכשיו. מהטקסט ועד ההסתברויות, ראינו את כל השרשרת רצה. זה סוף המחצית הראשונה: הבנו איך הקלט הופך לפלט מספרי. מכאן והלאה נפתח איך המנוע לומד את הייצוגים האלה מלכתחילה.
            </p>
        </div>
    );
};

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
                        מווקטור משמעות, דרך דמיון וציונים גולמיים, ועד הסתברויות והחלטה. הקלידו משפט וראו את כל השרשרת רצה כמפל. ואז שנו
                        מילה אחת, וצפו בגל שינוי שמתפשט במורד כל השכבות ומהפך את ההחלטה. כל מספר על המסך מחושב חי.
                    </p>

                    <div className="mt-6">
                        <ChainStrip />
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-violet-400" /> הקלידו או בחרו ניסוי מהיר
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Waves size={14} className="text-emerald-400" /> לחצו &quot;החלפת מילה&quot; וצפו בגל השינוי
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
                    זו השרשרת המלאה במקום אחד. כל שכבה מזינה את הבאה אחריה: וקטור המשמעות הופך לדמיון, הדמיון לציונים גולמיים, הציונים
                    עוברים דרך Softmax להסתברויות, ומשם נגזרת ההחלטה. המטרה כאן היא לראות שרשרת, לא קפיצה: שום מספר לא מופיע משום מקום,
                    כל אחד הוא תוצאה של השלב שלפניו. כל שלב במפל מלווה בהסבר משלו, אז אפשר לקרוא אותו מלמעלה למטה כמו סיפור.
                    <span className="mt-3 block text-sm text-slate-400">
                        הפעילו את <span className="font-bold text-violet-200">תצוגת הנוסחה</span> כדי לראות שכל מספר על המסך הוא חישוב חי, והחליפו ל-<span className="font-bold text-violet-200">Agent Mode</span> כדי לראות שאותה שרשרת מדרגת צעדים לפי מצב, לא רק כוונות.
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


            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir="rtl">
                <AssessmentEngine {...behindAiChapterQuizzes[8]} />
            </section>
        </ChapterLayout>
    );
}
