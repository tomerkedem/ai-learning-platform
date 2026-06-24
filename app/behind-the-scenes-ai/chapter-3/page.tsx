"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Dices, SlidersHorizontal, MousePointerClick, Scale } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';

import { ProbabilityEngineLab } from '@/components/ai-internals/ProbabilityEngineLab';
import { Mentor } from '@/components/ai-internals/Mentor';
import { PROBABILITY_SCENARIOS } from './probabilityScenarios';

// "נוסחה" מנטלית - שלוש שורות שמראות איך הפער קובע את ההחלטה.
const FORMULA_ROWS = [
    {
        condition: 'פער גדול בין הראשון לשני (התפלגות חדה)',
        routeHe: 'לענות בזהירות',
        routeEn: 'Answer carefully (still an estimate)',
        color: 'text-emerald-300',
    },
    {
        condition: 'פער קטן, שתי אפשרויות קרובות (התפלגות קרובה)',
        routeHe: 'לבקש עוד הקשר',
        routeEn: 'Ask for more context',
        color: 'text-amber-300',
    },
    {
        condition: 'אין מוביל ברור, ההסתברות מפוזרת (התפלגות מפוזרת)',
        routeHe: 'לשאול שאלת הבהרה',
        routeEn: 'Ask a clarifying question',
        color: 'text-purple-300',
    },
];

export default function BehindTheScenesChapter3() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={3}>

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
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-purple-500/30 mb-5">
                        <Dices size={14} className="text-purple-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-purple-300">Behind the Scenes · 03</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        AI לא יודע.{' '}
                        <span className="bg-gradient-to-l from-purple-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                            AI מעריך מה הכי סביר
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        תשובה שנשמעת בטוחה אינה הוכחה. מאחורי כל תשובה יש תחרות בין כמה פירושים אפשריים, וכל אחד
                        מקבל ציון הסתברות. בחרו ניסוח, וראו מתי יש מוביל ברור שמאפשר לענות, ומתי האפשרויות קרובות
                        מדי – ואז הצעד המקצועי הוא דווקא לא לענות מיד, אלא לבקש הבהרה.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-purple-400" /> בחרו בין שלושת הניסוחים
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Scale size={14} className="text-emerald-400" /> שימו לב לפער בין האפשרות הראשונה לשנייה
                        </span>
                    </div>
                </div>
            </motion.section>
            {/* המנטור מציג שזו הערכה הסתברותית (xl+, מימין) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
              <Mentor pose="chart" line="AI לא יודע - הוא מעריך 📊" width={165} />
            </div>
            </div>

            {/* ══════════ Probability Engine Lab ══════════ */}
            <section className="relative mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <SlidersHorizontal size={24} className="text-purple-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-purple-400">Probability Engine Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת ההסתברויות</h3>
                    </div>
                </div>

                {/* פתיחה לימודית לפני המעבדה */}
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    בפרקים הקודמים ראינו שהמנוע מקבל החלטות. עכשיו נראה ממה ההחלטות האלה נולדות:
                    לא מידע ודאי, אלא דירוג של אפשרויות. המנוע לא &quot;יודע&quot; מה התכוונתם - הוא משווה כמה פירושים
                    אפשריים ובוחר את מה שנראה הכי סביר.
                </div>

                <ProbabilityEngineLab scenarios={PROBABILITY_SCENARIOS} defaultId="clear-delivery-failure" />
                {/* המנטור מזהיר על פער קטן (xl+, משמאל) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="headsup" line="פער קטן? עדיף לשאול" width={160} />
                </div>
            </section>

            {/* ══════════ נוסחה מנטלית ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6">
                    <div className="mb-4 leading-tight">
                        <div className="text-sm font-bold text-slate-200">מודל מנטלי</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Mental model</div>
                    </div>
                    <div className="mb-4 leading-tight">
                        <div className="text-base font-bold text-slate-200">הפער בין האפשרות הראשונה לשנייה ← רמת הביטחון</div>
                        <div className="font-mono text-xs text-slate-500" dir="ltr">confidence_margin = top_probability - second_probability</div>
                    </div>
                    <div className="space-y-2">
                        {FORMULA_ROWS.map((row) => (
                            <div
                                key={row.routeEn}
                                className="flex flex-col gap-1 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 md:flex-row md:items-center md:justify-between"
                            >
                                <span className="text-sm text-slate-300">{row.condition}</span>
                                <span className={`leading-tight ${row.color}`}>
                                    <span className="block text-sm font-bold">{row.routeHe}</span>
                                    <span className="block font-mono text-[10px] opacity-70" dir="ltr">{row.routeEn}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ סיכום ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                {/* המנטור מסכם בעידוד (xl+, מימין) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="reassure" line="לפעמים לא לענות זו התשובה" width={160} />
                </div>
                <InsightBox type="intuition" title="הנקודה החשובה בפרק">
                    <span className="block font-bold text-purple-200">AI לא יודע. AI מעריך מה הכי סביר.</span>
                    הנקודה החשובה היא לא ש-AI בחר את האפשרות עם המספר הגבוה ביותר. הנקודה היא שהוא לא מחזיק אמת מוחלטת.
                    הוא מדרג אפשרויות, מעריך סבירות, ואז מחליט אם לענות או לעצור. כשההתפלגות חדה – אפשר לענות בזהירות.
                    כשהיא קרובה או מפוזרת – לפעמים התשובה המקצועית ביותר היא לא לענות מיד, אלא לבקש הבהרה.
                </InsightBox>
            </section>


            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir="rtl">
                <AssessmentEngine {...behindAiChapterQuizzes[3]} />
            </section>
        </ChapterLayout>
    );
}
