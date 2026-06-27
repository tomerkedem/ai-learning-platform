"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Repeat, MousePointerClick, Eye, FlaskConical, ArrowLeft, Lock, Workflow } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { ChapterQuiz } from '../ChapterQuiz';
import { InsightBox } from '@/components/content/InsightBox';

import { ObservationLoopLab } from '@/components/ai-internals/ObservationLoopLab';
import { Mentor } from '@/components/ai-internals/Mentor';

/** מיקום הפרק במסלול ה-Agent: בחירת הכלי מאחורינו, הפעלת הכלי כאן. */
const AGENT_FLOW: { he: string; en: string; state: 'done' | 'active' | 'locked' }[] = [
    { he: 'הבנת המשימה', en: 'Understand task', state: 'done' },
    { he: 'בחירת כלי', en: 'Select tool', state: 'done' },
    { he: 'הפעלת כלי וקריאת תוצאה', en: 'Call tool, read result', state: 'active' },
    { he: 'עצירה לאישור', en: 'Stop for approval', state: 'locked' },
];

const AgentFlowStrip: React.FC = () => {
    const reduce = useReducedMotion();
    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <Workflow size={16} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">מסלול ה-Agent</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Understand to Act</div>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2" dir="ltr">
                {AGENT_FLOW.map((s, i) => (
                    <React.Fragment key={s.en}>
                        {i > 0 && <ArrowLeft size={15} className="rotate-180 text-slate-600" />}
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.05 }}
                            className={`relative rounded-xl border px-3 py-1.5 text-center leading-tight ${
                                s.state === 'active' ? 'border-violet-500/50 bg-violet-900/25' : s.state === 'done' ? 'border-emerald-500/40 bg-emerald-900/15' : 'border-slate-700/40 bg-slate-950/30'
                            }`}
                        >
                            <span className={`flex items-center gap-1 text-[11px] font-bold ${s.state === 'active' ? 'text-violet-200' : s.state === 'done' ? 'text-emerald-200' : 'text-slate-500'}`}>
                                {s.state === 'locked' && <Lock size={9} />}
                                {s.he}
                            </span>
                            <span className="block text-[8px] uppercase tracking-wider text-slate-500" dir="ltr">{s.en}</span>
                        </motion.div>
                    </React.Fragment>
                ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
השלב הפעיל כאן הוא הפעלת הכלי וקריאת התוצאה: בחירת הכלי כבר מאחורינו, ואישור הפעולה הרגישה מחכה לפרק 13.
            </p>
        </div>
    );
};

export default function BehindTheScenesChapter11() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={12}>

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
                        <Repeat size={14} className="text-violet-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 12</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        Agent פועל בלולאה,{' '}
                        <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-teal-400 bg-clip-text text-transparent">
                            לא בקו ישר
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        Tool Call אינו סוף הסיפור, הוא רק דרך להביא Observation חדשה. ה-Agent לא ידע את התוצאה מראש, הוא ביקש אותה מכלי,
                        קרא אותה, והחליט מחדש לפיה. ואותה משימה יכולה להוביל לשלוש החלטות שונות לגמרי, תלוי במה הכלי החזיר.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-violet-400" /> עברו בין שלוש התוצאות
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Eye size={14} className="text-teal-400" /> הריצו את הלולאה שוב, שלב אחר שלב
                        </span>
                    </div>
                </div>
            </motion.section>
            {/* המנטור: ה-Agent פועל בלולאה (xl+, מימין) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
              <Mentor pose="explain-opposite" line="ה-Agent פועל בלולאה 🔁" width={165} />
            </div>
            </div>

            {/* ══════════ מסלול קריאה ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="space-y-3 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 leading-relaxed text-slate-300">
                    <div className="flex items-center gap-2">
                        <Repeat size={18} className="text-violet-300" />
                        <div className="leading-tight">
                            <div className="text-sm font-bold text-slate-200">מה נלמד בפרק הזה</div>
                            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Reading path</div>
                        </div>
                    </div>
                    <p>
                        בפרק הקודם ה-Agent בחר כלי מתאים. עכשיו נראה מה קורה כשהוא מפעיל אותו, דרך שלושה מושגים שמרכיבים את לולאת הפעולה.
                    </p>
                    <p>
                        <span className="font-bold text-violet-200">Tool Call</span> הוא הרגע שבו ה-Agent מפעיל את הכלי. <span className="font-bold text-violet-200">Observation</span> היא התוצאה שהכלי מחזיר, מידע חדש שהגיע מבחוץ. ו-<span className="font-bold text-violet-200">Next Decision</span> הוא מה שה-Agent בוחר אחרי שהוא קורא את התוצאה ומשווה אותה להקשר.
                    </p>
                    <p className="font-bold text-violet-200">
                        המסר: Agent פועל בלולאה, לא בקו ישר. הוא מחליט, מפעיל, קורא, ומחליט שוב.
                    </p>
                </div>
            </section>

            {/* ══════════ מסלול ה-Agent ══════════ */}
            <section className="mt-8 text-right" dir="rtl">
                <AgentFlowStrip />
            </section>

            {/* ══════════ Observation Loop Lab ══════════ */}
            <section className="relative mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Agent Loop Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת לולאת ה-Agent</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    כל רכיב כאן מלווה בהקדמה, בשורת מסקנה, ובהנחיית Try this. עברו בין שלוש התוצאות, ברורה, חלקית וסותרת, וראו איך אותו כלי
                    מוביל לשלוש החלטות שונות. הסירו את הברקוד וראו ש-Tool selected אינו Tool called. ובסוף, הריצו את כל הלולאה שוב, שלב
                    אחר שלב, ועצרו בכל נקודה. כל שדה תוצאה והחלטה מחושבים חי ממודל לימודי שקוף.
                </div>

                <ObservationLoopLab />
                {/* המנטור: אותו כלי, שלוש החלטות (xl+, משמאל) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="inspect" line="אותו כלי, שלוש החלטות" width={160} />
                </div>
            </section>

            {/* ══════════ סיכום ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                {/* המנטור: מחליט, מפעיל, קורא, שוב (xl+, מימין) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="happy" line="מחליט, מפעיל, קורא, שוב" width={160} />
                </div>
                <InsightBox type="intuition" title="הנקודה החשובה בפרק">
                    <span className="block font-bold text-violet-200">Tool Call הוא לא סוף הסיפור, הוא רק דרך להביא Observation חדשה.</span>
                    ראינו שאחרי שהמידע חוזר, ה-Agent מחליט מחדש מה נכון לעשות. תוצאה ברורה הובילה לתשובה, תוצאה חלקית לצעד אחר בלי המצאת
                    סיבה, ותוצאה סותרת להצפת הסתירה במקום לפסול את המשתמש. וראינו שגם אחרי תוצאה טובה, שער הסיכון נשאר: פעולה רגישה
                    עוצרת לאישור גם כשהתשובה ברורה.
                    <span className="mt-3 block text-sm text-slate-400">
                        גשר לפרק 13: גם כשיש תשובה אפשרית, לפעמים הצעד הנכון הוא לעצור ולבקש אישור. מתי עוצרים, ולמה, זה נושא הפרק הבא.
                    </span>
                </InsightBox>
            </section>


            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir="rtl">
                <ChapterQuiz chapterId={12} />
            </section>
        </ChapterLayout>
    );
}
