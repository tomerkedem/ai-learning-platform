"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Network, Split, MousePointerClick, ArrowLeftRight } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';

import { RequestRoutingLab } from '@/components/ai-internals/RequestRoutingLab';
import { Mentor } from '@/components/ai-internals/Mentor';
import { ROUTING_EXAMPLES } from './routingExamples';

// "נוסחה" מנטלית - שלוש שורות שמראות איך הקלט מנותב למסלול.
const FORMULA_ROWS = [
    {
        condition: 'שאלה כללית, סיכון נמוך, אין מידע חסר',
        routeHe: 'לענות',
        routeEn: 'Answer',
        color: 'text-cyan-300',
    },
    {
        condition: 'בקשה ספציפית, חסר מידע (ברקוד)',
        routeHe: 'לבקש מידע ואז להכין כלי',
        routeEn: 'Ask for info → Prepare tool use',
        color: 'text-indigo-300',
    },
    {
        condition: 'בקשת פעולה, סיכון גבוה, דרוש אישור',
        routeHe: 'לעצור לאישור',
        routeEn: 'Stop for approval',
        color: 'text-rose-300',
    },
];

export default function BehindTheScenesChapter2() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={2}>

            {/* ══════════ HERO ══════════ */}
            {/* עטיפת relative בלי overflow כדי שהמנטור יוכל לחרוג מגבול הכרטיס */}
            <div className="relative">
            <motion.section
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 text-right"
                dir="rtl"
            >
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-rose-500/10 blur-[90px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-indigo-500/30 mb-5">
                        <Network size={14} className="text-indigo-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-indigo-300">Behind the Scenes · 02</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        אותו נושא,{' '}
                        <span className="bg-gradient-to-l from-cyan-400 via-indigo-400 to-rose-400 bg-clip-text text-transparent">
                            מסלולים שונים לגמרי
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        שלושה ניסוחים סביב אותה חבילה שמתעכבת. בחרו ניסוח, וראו איך המנוע מנתב את הבקשה
                        למסלול אחר: לענות, לבקש מידע, להתכונן לכלי, או לעצור לאישור. הנושא זהה – הכוונה משנה הכול.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-indigo-400" /> בחרו בין שלושת הניסוחים
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <ArrowLeftRight size={14} className="text-rose-400" /> כל בחירה מזיזה את כל הלוח
                        </span>
                    </div>
                </div>
            </motion.section>
            {/* המנטור מקדם בברכה מימין לכרטיס (xl+) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
              <Mentor pose="hello" line="כל ניסוח - מסלול אחר 👋" width={170} />
            </div>
            </div>

            {/* ══════════ Request Routing Lab ══════════ */}
            <section className="relative mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <Split size={24} className="text-indigo-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-400">Request Routing Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת ניתוב בקשות</h3>
                    </div>
                </div>

                {/* פתיחה לימודית לפני המעבדה */}
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    כאן מתחיל ההבדל האמיתי בין צ&apos;אט רגיל לבין Agent.
                    המנוע לא מסתכל רק על הנושא של המשפט, אלא על הכוונה שמסתתרת בניסוח.
                    שינוי קטן בפרומט יכול להפוך שאלה פשוטה לבקשת בדיקה, ובקשת בדיקה לפעולה שדורשת אישור.
                </div>

                <RequestRoutingLab examples={ROUTING_EXAMPLES} defaultId="general" />
                {/* המנטור מסביר את הניתוב (xl+, משמאל) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="explain" line="אותה חבילה, החלטות שונות" width={160} />
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
                        <div className="text-base font-bold text-slate-200">כוונה + סיכון + מידע חסר ← מסלול</div>
                        <div className="font-mono text-xs text-slate-500" dir="ltr">intent + risk + missing info → route</div>
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
                  <Mentor pose="reassure" line="זאת הנקודה החשובה" width={160} />
                </div>
                <InsightBox type="intuition" title="הנקודה החשובה בפרק">
                    <span className="block font-bold text-indigo-200">הפרומט לא רק מבקש תשובה. הוא מכוון את המנוע למסלול.</span>
                    אותו נושא יכול להוביל לתשובה, לבדיקה, להכנה לשימוש בכלי או לעצירה לאישור. ההבדל מתחיל בכוונה שהפרומט משדר.
                    זה ההבדל בין מערכת שרק עונה לבין Agent שמנסה לבחור את הצעד הנכון הבא.
                </InsightBox>
            </section>

        </ChapterLayout>
    );
}
