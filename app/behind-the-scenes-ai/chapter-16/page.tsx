"use client";

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { PenLine, MousePointerClick, GitFork, FlaskConical, Compass, GraduationCap, ArrowLeft } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';

import { PromptCoachLab } from '@/components/ai-internals/PromptCoachLab';
import { Mentor } from '@/components/ai-internals/Mentor';

export default function BehindTheScenesChapter15() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={16}>

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
                        <PenLine size={14} className="text-violet-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 16</span>
                    </div>

                    <div className="mb-5 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-slate-300 leading-relaxed">
                        עד עכשיו הסתכלנו על AI מבפנים, איך טקסט הופך ל-Tokens, למספרים, לייצוג, להחלטות, ואיך Agent מזהה משימה ובוחר אם להמשיך או לעצור.
                        <br />
                        עכשיו חוזרים אל המשתמש: השאלה המעשית היא איך כותבים ל-AI טוב יותר. לא כדי לרמות את המודל, אלא כדי לעבוד איתו מקצועית.
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        מי שמבין מה קורה מאחורי הקלעים{' '}
                        <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-teal-400 bg-clip-text text-transparent">
                            יודע לכתוב טוב יותר
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        כתיבה טובה ל-AI אינה קסם של מילים, היא הגדרה ברורה של מטרה, הקשר, מידע חסר, תוצאה רצויה וגבולות פעולה. ככל
                        שמגדירים טוב יותר, כך המערכת צריכה לנחש פחות. הכלים כאן הם כלי אימון, לא הצצה למנוע.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-violet-400" /> כתבו בקשה וקבלו הצעת שיפור
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <GitFork size={14} className="text-teal-400" /> בדקו אם זה מתאים ל-Chat או ל-Agent
                        </span>
                    </div>
                </div>
            </motion.section>
            {/* המנטור: כתיבה טובה היא הגדרה (xl+, מימין) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
              <Mentor pose="type" line="כתיבה טובה היא הגדרה ⌨️" width={165} />
            </div>
            </div>

            {/* ══════════ מסלול קריאה ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="space-y-3 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 leading-relaxed text-slate-300">
                    <div className="flex items-center gap-2">
                        <Compass size={18} className="text-violet-300" />
                        <div className="leading-tight">
                            <div className="text-sm font-bold text-slate-200">מה נלמד בפרק הזה</div>
                            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Reading path</div>
                        </div>
                    </div>
                    <p>
                        כל הלומדה פתחה את המנוע מבפנים. הפרק האחרון מחזיר את הכל אל המשתמש: אחרי שמבינים איך המנוע עובד, אפשר להשתמש בידע הזה כדי לכתוב בקשות טובות יותר.
                    </p>
                    <p>
                        נכיר שלושה כלי אימון: <span className="font-bold text-violet-200">מאמן הבקשות</span> שמראה מה חסר ואיך לשפר, <span className="font-bold text-violet-200">מד איכות</span> שבודק חמישה ממדים, ו<span className="font-bold text-violet-200">בורר</span> שממליץ בין Chat ל-Agent. כל אחד מחבר מושג שכבר למדנו אל הבקשה שלכם.
                    </p>
                    <p className="font-bold text-violet-200">
                        המסר: זה לא פרק על טריקים, זה פרק על שיתוף פעולה מדויק עם המערכת.
                    </p>
                </div>
            </section>

            {/* ══════════ Prompt Coach Lab ══════════ */}
            <section className="relative mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Prompt Coach Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת האימון</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    כתבו בקשה, וראו אותה דרך העיניים של המערכת: מה זוהה, מה חסר, ואיך לשפר. כל כלי כאן מלווה בהקדמה, בשורת מסקנה,
                    ובהנחיית Try this. זכרו: המטרה אינה Prompt ארוך, אלא Prompt ברור, בטוח ומתאים לסוג העבודה.
                </div>

                <PromptCoachLab />
                {/* המנטור: מה חסר ואיך לשפר (xl+, משמאל) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="explain" line="מה חסר, ואיך לשפר" width={160} />
                </div>
            </section>

            {/* ══════════ סיכום הלומדה (רגע האסימון) ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                {/* המנטור חוגג את סיום הלומדה (xl+, מימין) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="celebrate" line="סיימתם את הלומדה! 🎉" width={165} />
                </div>
                <InsightBox type="intuition" title="סוף הלומדה: רגע האסימון">
                    <span className="block font-bold text-violet-200">כתיבה טובה ל-AI אינה קסם של מילים, אלא הגדרה.</span>
                    הגדרה ברורה של מטרה, הקשר, מידע חסר, תוצאה רצויה וגבולות פעולה. ככל שהמשתמש מגדיר טוב יותר את המשימה והגבולות, כך
                    ה-AI צריך לנחש פחות ולעבוד נכון יותר. שאלת הבהרה אינה כישלון, ולא כל בקשה צריכה Agent.
                    <span className="mt-3 block text-sm text-slate-400">
                        התחלנו את הלומדה ברעיון אחד: AI הוא לא רק תשובה, מאחוריה יש תהליך. פתחנו את התהליך שכבה אחר שכבה, מ-Tokens ועד עצירה אחראית. וסיימנו ביכולת שלכם להשתמש בתהליך הזה לטובתכם. עכשיו, כשאתם כותבים ל-AI, אתם כבר יודעים מה קורה מאחורי הקלעים.
                    </span>
                </InsightBox>
            </section>


            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir="rtl">
                <AssessmentEngine {...behindAiChapterQuizzes[16]} />
            </section>

            {/* ══════════ מעבר למבחן סיום הלומדה ══════════ */}
            <section className="mt-16 mb-4" dir="rtl">
                <Link
                    href="/behind-the-scenes-ai/final-exam"
                    className="group block max-w-md mx-auto rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-slate-900/40 p-8 text-center transition-all hover:border-blue-400/50 hover:from-blue-900/30 no-underline"
                >
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-blue-500/20">
                        <GraduationCap size={32} className="text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">מוכנים למבחן סיום הלומדה?</h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                        שמונה עשרה שאלות שמסכמות את כל המסלול, מהקלט ועד ההחלטה האחראית. אפשר לחזור אליו בכל עת, וההתקדמות נשמרת.
                    </p>
                    <span className="inline-flex items-center gap-2 bg-blue-600 group-hover:bg-blue-500 text-white font-black py-3 px-8 rounded-2xl transition-colors">
                        מעבר למבחן סיום הלומדה
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </span>
                </Link>
            </section>
        </ChapterLayout>
    );
}
