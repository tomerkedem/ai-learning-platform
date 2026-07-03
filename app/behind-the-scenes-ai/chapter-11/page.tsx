"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Wrench, MousePointerClick, ScanLine, FlaskConical, ArrowLeft, Lock, Workflow } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { ChapterQuiz } from '../ChapterQuiz';
import { InsightBox } from '@/components/content/InsightBox';

import { ToolSelectionLab } from '@/components/ai-internals/ToolSelectionLab';
import { Mentor } from '@/components/ai-internals/Mentor';

/** מיקום הפרק במסלול ה-Agent: הבנת המשימה כבר מאחורינו, בחירת הכלי כאן. */
const AGENT_FLOW: { he: string; en: string; state: 'done' | 'active' | 'locked' }[] = [
    { he: 'הבנת המשימה', en: 'Understand task', state: 'done' },
    { he: 'בחירת כלי', en: 'Select tool', state: 'active' },
    { he: 'הפעלת כלי', en: 'Call tool', state: 'locked' },
    { he: 'שימוש בתוצאה', en: 'Use result', state: 'locked' },
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
השלב הפעיל כאן הוא בחירת הכלי: הבנת המשימה כבר מאחורינו, והפעלת הכלי בפועל מחכה לפרק 12.
            </p>
        </div>
    );
};

export default function BehindTheScenesChapter10() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={11}>

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
                        <Wrench size={14} className="text-violet-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 11</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        בחירת כלי היא החלטה,{' '}
                        <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent">
                            לא כפתור
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        Agent לא אמור לנחש מידע שאפשר לבדוק בכלי, אבל גם לא להשתמש בכלי כשלא צריך. הוא מדרג התאמה, בודק אם הקלט קיים,
                        בודק סיכון, בודק הרשאה, ורק אז מחליט. כלי יכול להיות מתאים מאוד, ועדיין חסום.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-violet-400" /> בחרו תרחיש או כתבו בקשה
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <ScanLine size={14} className="text-emerald-400" /> הוסיפו ברקוד וראו שער נפתח והכלי נבחר
                        </span>
                    </div>
                </div>
            </motion.section>
            {/* המנטור: כלי הוא החלטה, לא כפתור (xl+, מימין) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
              <Mentor pose="explain-opposite" line="כלי הוא החלטה, לא כפתור" width={248} />
            </div>
            </div>

            {/* ══════════ מסלול קריאה ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="space-y-3 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 leading-relaxed text-slate-300">
                    <div className="flex items-center gap-2">
                        <Wrench size={18} className="text-violet-300" />
                        <div className="leading-tight">
                            <div className="text-sm font-bold text-slate-200">מה נלמד בפרק הזה</div>
                            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Reading path</div>
                        </div>
                    </div>
                    <p>
                        אחרי שה-Agent הבין את המשימה, הוא ניצב בצומת: לענות בעצמו, או להיעזר בכלי חיצוני. זו לא שאלה טכנית בלבד, היא שאלה של שיקול דעת.
                    </p>
                    <p>
                        Agent שלא משתמש בכלי כשצריך עלול <span className="font-bold text-violet-200">לנחש</span> מידע שאפשר היה לבדוק. Agent שמשתמש בכלי כשלא צריך עלול <span className="font-bold text-violet-200">לבזבז זמן, כסף, או לסכן פרטיות</span>. נכיר את לוח הכלים וגבולותיהם, את דירוג ההתאמה, ואת ארבעת השערים שכלי חייב לעבור כדי להיבחר: התאמה, קלט, סיכון, והרשאה.
                    </p>
                    <p className="font-bold text-violet-200">
                        המסר: Tool Selection הוא החלטה, לא כפתור. כלי הוא ממשק מוגדר עם גבולות, לא יכולת על.
                    </p>
                </div>
            </section>

            {/* ══════════ מסלול ה-Agent ══════════ */}
            <section className="mt-8 text-right" dir="rtl">
                <AgentFlowStrip />
            </section>

            {/* ══════════ Tool Selection Lab ══════════ */}
            <section className="relative mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Tool Selection Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת בחירת הכלי</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    כל רכיב כאן מלווה בהקדמה, בשורת מסקנה, ובהנחיית Try this, כדי שאפשר יהיה ללמוד אותו לבד. שנו את הבקשה, הוסיפו או הסירו
                    ברקוד, ועברו בין התרחישים, וראו איך הדירוג, ארבעת השערים, וההחלטה משתנים יחד. כל מספר במסך מחושב חי מטבלת חוקים שקופה.
                </div>

                <ToolSelectionLab />
                {/* המנטור: ארבעה שערים לכל כלי (xl+, משמאל) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="inspect" line="ארבעה שערים לכל כלי" width={160} />
                </div>
            </section>

            {/* ══════════ סיכום ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                {/* המנטור: גם לא להשתמש זה צעד נכון (xl+, מימין) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="reassure" line="גם לא להשתמש זה צעד נכון" width={160} />
                </div>
                <InsightBox type="intuition" title="הנקודה החשובה בפרק">
                    <span className="block font-bold text-violet-200">Tool Selection הוא החלטה, לא כפתור. כלי הוא ממשק מוגדר עם גבולות, לא יכולת על.</span>
                    ראינו ש-Agent משתמש בכלי רק כשכל ארבעת השערים ירוקים: המשימה דורשת אותו, הנתונים קיימים, הסיכון מתאים, וההרשאה
                    מאפשרת. כלי יכול להיות מתאים מאוד ועדיין חסום, כי חסר קלט, כי הסיכון גבוה, או כי אין הרשאה. וראינו שגם אי-שימוש בכלי
                    הוא לעיתים הצעד הנכון: שימוש מיותר הוא כשל תכנון, לא הצלחה.
                    <span className="mt-3 block text-sm text-slate-400">
                        הפרק עוצר רגע לפני הפעלת הכלי. גשר לפרק 12: הפעלת הכלי בפועל, הקלט שנשלח אליו, והתוצאה שחוזרת, ומה ה-Agent עושה איתה.
                    </span>
                </InsightBox>
            </section>


            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir="rtl">
                <ChapterQuiz chapterId={11} />
            </section>
        </ChapterLayout>
    );
}
