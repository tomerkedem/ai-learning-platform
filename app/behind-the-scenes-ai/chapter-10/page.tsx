"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Target, MousePointerClick, ScanLine, FlaskConical, BookOpen, ArrowLeft, MessageCircle, Workflow } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';

import { TaskUnderstandingLab } from '@/components/ai-internals/TaskUnderstandingLab';
import { Mentor } from '@/components/ai-internals/Mentor';
import { PIPELINE_STEPS } from './taskData';

/** מסלול ה-Agent כפס עליון, עמוד השדרה הוויזואלי של הפרק. */
const PipelineStrip: React.FC = () => {
    const reduce = useReducedMotion();
    return (
        <div className="flex flex-wrap items-center gap-2" dir="ltr">
            {PIPELINE_STEPS.map((step, i) => (
                <React.Fragment key={step.id}>
                    {i > 0 && <ArrowLeft size={14} className="rotate-180 text-violet-500/60" />}
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.07 }}
                        className={`rounded-xl border px-3 py-1.5 text-center leading-tight ${
                            step.id === 'decide' ? 'border-teal-500/40 bg-teal-900/20' : 'border-violet-500/30 bg-violet-900/15'
                        }`}
                    >
                        <span className={`block text-[11px] font-bold ${step.id === 'decide' ? 'text-teal-200' : 'text-violet-200'}`}>{step.he}</span>
                        <span className="block text-[8px] uppercase tracking-wider text-slate-500" dir="ltr">{step.en}</span>
                    </motion.div>
                </React.Fragment>
            ))}
        </div>
    );
};

/** מסלול קריאה: מספר את מסלול ה-Agent במילים לפני שמראים אותו בתנועה. */
const READING_STEPS = [
    { num: '1', he: 'הבנת המשימה', en: 'Task Understanding', desc: 'שאלה או משימה? מה הפעולה?' },
    { num: '2', he: 'זיהוי מטרה', en: 'Goal Detection', desc: 'מה המטרה האופרטיבית, או שהיא עמומה' },
    { num: '3', he: 'מידע חסר', en: 'Missing Information', desc: 'מה נדרש כדי לפעול, ומה עדיין חסר' },
    { num: '4', he: 'תשובה או פעולה', en: 'Answer or Act', desc: 'מה הצעד הנכון לאור כל מה שלמעלה' },
];

const ReadingPath: React.FC = () => (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 text-right leading-relaxed text-slate-300" dir="rtl">
        <div className="mb-4 flex items-center gap-2">
            <BookOpen size={16} className="text-violet-300" />
            <div className="leading-tight">
                <div className="text-sm font-bold text-slate-200">לפני שמתחילים</div>
                <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Read this first</div>
            </div>
        </div>
        <p className="text-sm">
            עד עכשיו עסקנו במה שקורה כשמשתמש שואל. עכשיו אנחנו עוברים למה שקורה כשהוא מבקש שהמערכת תעשה משהו. כאן נפתח החצי
            השני של הלומדה, חצי ה-Agent. ה-Agent לא מתחיל מלהפעיל כלי, הוא מתחיל מלהבין את המשימה: מה המטרה, מה חסר, והאם בכלל
            מותר לפעול. נעבור על ארבעת שלבי המסלול אחד אחד, וכל הזמן נראה אותם מתעדכנים יחד בזמן אמת. דבר אחד שכדאי לקחת כבר
            עכשיו, <span className="font-bold text-violet-200">זיהוי משימה אינו אישור לפעול</span>.
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

/** רגע הוואו: מילה אחת מהפכת את סוג התהליך. */
const WowCard: React.FC = () => (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 text-right" dir="rtl">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-4">
                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">
                    <MessageCircle size={13} className="text-teal-300" /> Question
                </div>
                <p className="text-base font-bold text-slate-100">למה החבילה לא הגיעה?</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">שאלה. התשובה היא הסבר.</p>
            </div>
            <div className="rounded-xl border border-violet-500/40 bg-violet-900/15 p-4">
                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">
                    <Workflow size={13} className="text-violet-300" /> Task
                </div>
                <p className="text-base font-bold text-slate-100">
                    <span className="rounded-md bg-violet-500/25 px-1.5 py-0.5 text-violet-100">בדוק</span> למה החבילה לא הגיעה
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">משימה. התשובה היא בניית תמונת מצב ובקשת מידע חסר.</p>
            </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
            שני המשפטים נראים כמעט זהים, מילה אחת ביניהם. אבל המילה <span className="font-bold text-violet-200">בדוק</span> משנה את כל סוג התהליך.
            בלעדיה זו שאלה, והמערכת יכולה פשוט להסביר. איתה זו משימה, והמערכת צריכה לזהות מטרה, לבדוק איזה מידע חסר, ולהחליט אם
            בכלל אפשר להתקדם. שימו לב, גם כשהמערכת מזהה משימה, היא לא בהכרח מוכנה לבצע אותה.
        </p>
    </div>
);

export default function BehindTheScenesChapter9() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={10}>

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
                <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-teal-500/10 blur-[90px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-violet-500/30 mb-5">
                        <Target size={14} className="text-violet-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 10</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        מילה אחת{' '}
                        <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-teal-400 bg-clip-text text-transparent">
                            מהפכת שאלה למשימה
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        Agent מתחיל בלזהות מה המשתמש רוצה שיקרה. לפני שהוא פועל, הוא מפרק את הבקשה: מה המטרה, מה חסר, ומה מותר.
                        כתבו בקשה וראו את מסלול ה-Agent נדלק בזמן אמת. והמסר שכדאי לקחת כבר עכשיו, זיהוי משימה אינו אישור לפעול.
                    </p>

                    <div className="mt-6">
                        <PipelineStrip />
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-violet-400" /> החליפו &quot;למה&quot; ב&quot;בדוק&quot; וראו את המסלול מתהפך
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <ScanLine size={14} className="text-teal-400" /> הוסיפו ברקוד וצפו במידע החסר נסגר
                        </span>
                    </div>
                </div>
            </motion.section>
            {/* המנטור: מילה אחת - שאלה או משימה (xl+, מימין) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
              <Mentor pose="explain-opposite" line="מילה אחת - שאלה או משימה" width={165} />
            </div>
            </div>

            {/* ══════════ מסלול קריאה ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <ReadingPath />
            </section>

            {/* ══════════ רגע הוואו ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <WowCard />
            </section>

            {/* ══════════ Task Understanding Lab ══════════ */}
            <section className="relative mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Task Understanding Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת הבנת המשימה</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    כאן יושב כל מסלול ה-Agent במקום אחד, מעל מנוע פירוק שקוף ודטרמיניסטי. כל רכיב מלווה בהקדמה משלו, בשורת מסקנה
                    ובהנחיית ניסוי, אז אפשר לקרוא אותו מלמעלה למטה כמו סיפור. שנו בקשה אחת, וכל הרכיבים והמסלול יתעדכנו יחד.
                    שימו לב במיוחד שבקשת מידע חסר אינה תקלה, היא ההתנהגות המקצועית: המנוע בדק מה חסר והגיע למסקנה הנכונה.
                </div>

                <TaskUnderstandingLab />
                {/* המנטור: זיהוי משימה אינו אישור (xl+, משמאל) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="headsup" line="זיהוי משימה אינו אישור לפעול" width={160} />
                </div>
            </section>

            {/* ══════════ סיכום ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                {/* המנטור: קודם להבין, אז לפעול (xl+, מימין) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="reassure" line="קודם להבין, אז לפעול" width={160} />
                </div>
                <InsightBox type="intuition" title="הנקודה החשובה בפרק">
                    <span className="block font-bold text-violet-200">Agent לא מתחיל מלהפעיל כלי. הוא מתחיל מלהבין את המשימה, לבדוק מה חסר, ורק אז להחליט מה הצעד הבא.</span>
                    ראינו שאותו נושא בדיוק מתפצל לשני מסלולים: &quot;למה החבילה לא הגיעה&quot; היא שאלה שמובילה לתשובה, ו&quot;בדוק למה החבילה
                    לא הגיעה&quot; היא משימה שמובילה לבניית תמונת מצב. מילה אחת הספיקה. ראינו גם שזיהוי משימה אינו אישור לפעול: על
                    &quot;תטפל בזה&quot; המנוע עוצר ומבקש להבהיר, ועל &quot;שלח ללקוח הודעה&quot; הוא עוצר לאישור בגלל הסיכון. ובקשת מידע חסר,
                    כמו הברקוד, היא לאורך כל הדרך הצעד המקצועי, לא תקלה.
                    <span className="mt-3 block text-sm text-slate-400">
                        שינוי קטן בקלט מספיק כדי להעביר את ה-Agent בין מצבים. וכש&quot;Ready for tool selection&quot; מופיע, השלב הבא הוא בחירת הכלי המתאים, וזה בדיוק מה שנפתח בפרק 11.
                    </span>
                </InsightBox>
            </section>


            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir="rtl">
                <AssessmentEngine {...behindAiChapterQuizzes[10]} />
            </section>
        </ChapterLayout>
    );
}
