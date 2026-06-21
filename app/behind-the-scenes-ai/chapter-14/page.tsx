"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PenLine, MousePointerClick, GitFork, FlaskConical, Compass } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';

import { PromptCoachLab } from '@/components/ai-internals/PromptCoachLab';

export default function BehindTheScenesChapter14() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={14}>

            {/* ══════════ HERO ══════════ */}
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
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 14</span>
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
                        כל הקורס פתח את המנוע מבפנים. הפרק האחרון מחזיר את הכל אל המשתמש: אחרי שמבינים איך המנוע עובד, אפשר להשתמש בידע הזה כדי לכתוב בקשות טובות יותר.
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
            <section className="mt-12 space-y-5 text-right" dir="rtl">
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
            </section>

            {/* ══════════ סיכום הקורס (רגע האסימון) ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <InsightBox type="intuition" title="סוף הקורס: רגע האסימון">
                    <span className="block font-bold text-violet-200">כתיבה טובה ל-AI אינה קסם של מילים, אלא הגדרה.</span>
                    הגדרה ברורה של מטרה, הקשר, מידע חסר, תוצאה רצויה וגבולות פעולה. ככל שהמשתמש מגדיר טוב יותר את המשימה והגבולות, כך
                    ה-AI צריך לנחש פחות ולעבוד נכון יותר. שאלת הבהרה אינה כישלון, ולא כל בקשה צריכה Agent.
                    <span className="mt-3 block text-sm text-slate-400">
                        התחלנו את הקורס ברעיון אחד: AI הוא לא רק תשובה, מאחוריה יש תהליך. פתחנו את התהליך שכבה אחר שכבה, מ-Tokens ועד עצירה אחראית. וסיימנו ביכולת שלכם להשתמש בתהליך הזה לטובתכם. עכשיו, כשאתם כותבים ל-AI, אתם כבר יודעים מה קורה מאחורי הקלעים.
                    </span>
                </InsightBox>
            </section>

        </ChapterLayout>
    );
}
