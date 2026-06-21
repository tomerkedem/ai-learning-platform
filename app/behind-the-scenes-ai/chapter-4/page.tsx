"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Type, MousePointerClick, Zap, FlaskConical } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';

import { WordEngineLab } from '@/components/ai-internals/WordEngineLab';

// "נוסחה" מנטלית - איך כל מילה מעדכנת את הציון.
const FORMULA_ROWS = [
    {
        condition: 'מילה ניטרלית נכנסת (למשל "החבילה")',
        routeHe: 'זיהוי תחום, ביטחון נמוך',
        routeEn: 'Domain only, low confidence',
        color: 'text-slate-300',
    },
    {
        condition: 'מילת שלילה נכנסת (למשל "לא")',
        routeHe: 'היפוך כיוון, ההסתברות זזה חזק',
        routeEn: 'Direction flips, big impact',
        color: 'text-rose-300',
    },
    {
        condition: 'הצירוף מתחדד (למשל "לא הגיעה")',
        routeHe: 'מוביל ברור, ביטחון גבוה',
        routeEn: 'Clear leader, high confidence',
        color: 'text-emerald-300',
    },
];

export default function BehindTheScenesChapter4() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={4}>

            {/* ══════════ HERO ══════════ */}
            <motion.section
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 text-right"
                dir="rtl"
            >
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-rose-500/10 blur-[90px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-violet-500/30 mb-5">
                        <Type size={14} className="text-violet-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 04</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        כל מילה{' '}
                        <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
                            מזיזה את המנוע
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        משפט לא נכנס למנוע בבת אחת. הוא נבנה מילה אחר מילה, וכל מילה יכולה להזיז את ההסתברות, את הביטחון ואת ההחלטה.
                        הקלידו לאט, וראו בעיניים איך המילה &quot;לא&quot; הופכת את הכיוון בזמן אמת. שימו לב: עד השליחה המנוע מציג כיוון זמני בלבד, לא החלטה.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-violet-400" /> הקלידו או לחצו &quot;הקלידו עבורי&quot;
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Zap size={14} className="text-rose-400" /> צפו במילה &quot;לא&quot; מזיזה את העמודות
                        </span>
                    </div>
                </div>
            </motion.section>

            {/* ══════════ Word Engine Lab ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Word Engine Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת המילים</h3>
                    </div>
                </div>

                {/* פתיחה לימודית לפני המעבדה */}
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    כאן נראה את מה שקורה בין הקשה להקשה. כל מילה שמתווספת נכנסת כ-token, מזיזה את וקטור המשמעות,
                    ומשנה את ההתפלגות בין האפשרויות. כל עוד לא נשלח המשפט, מה שאתם רואים הוא כיוון זמני (Temporary) ולא החלטה.
                    רק לחיצת Send נועלת החלטה סופית (Final).
                </div>

                <WordEngineLab />
            </section>

            {/* ══════════ נוסחה מנטלית ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6">
                    <div className="mb-4 leading-tight">
                        <div className="text-sm font-bold text-slate-200">מודל מנטלי</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Mental model</div>
                    </div>
                    <div className="mb-4 leading-tight">
                        <div className="text-base font-bold text-slate-200">כל מילה מוסיפה או מורידה משקל ← הציון מתעדכן</div>
                        <div className="font-mono text-xs text-slate-500" dir="ltr">new_score = previous_score + word_impact</div>
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

            {/* ══════════ סיכום + גשר לפרק 5 ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <InsightBox type="intuition" title="הנקודה החשובה בפרק">
                    <span className="block font-bold text-violet-200">משפט אינו נכנס כגוש אחד. הוא נבנה מילה אחר מילה.</span>
                    כל מילה מזיזה את ההסתברות, את הביטחון ואת ההחלטה. ראינו שגם אותו תחום בדיוק יכול לנוע לכיוונים שונים לפי המילים
                    שנבחרו, ושהמילה הראשונה (&quot;בדוק&quot;) יכולה לשנות את סוג התהליך כולו. וחשוב מכל: עד השליחה הכול זמני בלבד. המנוע לא
                    &quot;יודע&quot; באמצע המשפט, הוא מעריך כיוון שמתעדכן עם כל מילה.
                    <span className="mt-3 block text-sm text-slate-400">
                        גשר לפרק הבא: ההתפלגות האמיתית שמודל מחשב היא על המילה הבאה, לא על כוונות שלמות. הדירוג לפי כוונות כאן הוא ייצוג של אותו עיקרון, ובפרק הבא נפתח את עולם ה-Tokenization.
                    </span>
                </InsightBox>
            </section>

        </ChapterLayout>
    );
}
