"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ScanLine, MousePointerClick, ArrowLeftRight, FlaskConical, Layers } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { ChapterQuiz } from '../ChapterQuiz';
import { InsightBox } from '@/components/content/InsightBox';

import { BehindScenesLab } from '@/components/ai-internals/BehindScenesLab';
import { Mentor } from '@/components/ai-internals/Mentor';

export default function BehindTheScenesChapter13() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={14}>

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
                <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-violet-500/30 mb-5">
                        <ScanLine size={14} className="text-violet-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 14</span>
                    </div>

                    <div className="mb-5 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-slate-300 leading-relaxed">
                        עד עכשיו פתחנו את המנוע שכבה אחר שכבה, מ-Tokens ועד עצירה אחראית.
                        <br />
                        עכשיו הגיע הזמן לחבר הכל למעבדה אחת, שבה רואים את כל הדרך מהקלט ועד תשובה, פעולה או עצירה. זה לא שני מסכים, אלה שתי צורות חשיבה.
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        לא ראינו רק תשובה,{' '}
                        <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                            ראינו איך היא נבנתה
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        אותה תיבת טקסט יכולה להפעיל מנוע תשובה, מנוע פעולה, או מנגנון עצירה. ההבדל נמצא במה שקורה מאחורי הקלעים. כל מספר
                        כאן מגיע מאותם מנועים בדיוק שבנינו בפרקים 6 עד 12, מקור אמת אחד, בלי קסם.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-violet-400" /> כתבו בקשה ועברו בין Chat ל-Agent
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <ArrowLeftRight size={14} className="text-cyan-400" /> ראו אותה בקשה מובילה לשתי התנהגויות
                        </span>
                    </div>
                </div>
            </motion.section>
            {/* המנטור: X-Ray של המנוע (xl+, מימין) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
              <Mentor pose="inspect" line="X-Ray של המנוע" width={248} />
            </div>
            </div>

            {/* ══════════ מסלול קריאה ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="space-y-3 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 leading-relaxed text-slate-300">
                    <div className="flex items-center gap-2">
                        <Layers size={18} className="text-violet-300" />
                        <div className="leading-tight">
                            <div className="text-sm font-bold text-slate-200">מה נלמד בפרק הזה</div>
                            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Reading path</div>
                        </div>
                    </div>
                    <p>
                        עד עכשיו פתחנו את המנוע שכבה אחר שכבה, מ-Tokens ועד עצירה אחראית. כל פרק חשף חלק אחד. עכשיו נחבר הכל למעבדה אחת.
                    </p>
                    <p>
                        במעבדה הזאת אותו קלט יכול להפעיל <span className="font-bold text-violet-200">מנוע תשובה</span> (Chat) או <span className="font-bold text-violet-200">מנוע פעולה</span> (Agent), על אותו מסך. רואים את כל הדרך מהקלט ועד תשובה, פעולה, או עצירה. המעבדה לא מציגה שני מסכים, אלא <span className="font-bold text-violet-200">שתי צורות חשיבה</span>.
                    </p>
                    <p className="font-bold text-violet-200">
                        המסר: לא ראינו רק תשובה, ראינו את הדרך שבה התשובה או הפעולה נבנתה.
                    </p>
                </div>
            </section>

            {/* ══════════ Behind the Scenes Lab ══════════ */}
            <section className="relative mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Behind the Scenes Lab</div>
                        <h3 className="text-2xl font-bold text-white">המעבדה המאוחדת</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    זו מעבדת X-Ray של AI, לא לוח בקרה של מטוס. המידע נחשף בזמן הנכון, לא הכל בבת אחת. כתבו בקשה, החליפו מצב, נגנו את
                    המסלול שלב אחר שלב, השוו צ׳אט מול Agent, ופתחו את הנוסחאות מאחורי התנועה. כל המספרים מגיעים מהמנועים של הפרקים הקודמים.
                </div>

                <BehindScenesLab />
                {/* המנטור: אותו קלט, שתי צורות חשיבה (xl+, משמאל) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="explain-opposite" line="אותו קלט, שתי צורות חשיבה" width={160} />
                </div>
            </section>

            {/* ══════════ סיכום (רגע הוואו) ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                {/* המנטור: ראינו איך התשובה נבנתה (xl+, מימין) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="happy" line="ראינו איך התשובה נבנתה" width={160} />
                </div>
                <InsightBox type="intuition" title="הנקודה החשובה בפרק">
                    <span className="block font-bold text-violet-200">המעבר בין שתי רמות הבנה.</span>
                    בהתחלה ראינו &quot;אני כותב, AI עונה&quot;. עכשיו אנחנו רואים &quot;אני כותב, והמערכת מפרקת, מייצגת, מדרגת, מעריכה ביטחון,
                    מחליטה אם לענות, ואם זה Agent גם בודקת אם צריך כלי, פעולה או אישור&quot;. אותה תיבת טקסט, ארבע התנהגויות אפשריות:
                    תשובה, בקשת הקשר, שימוש בכלי, או עצירה אחראית.
                    <span className="mt-3 block text-sm text-slate-400">
                        AI הוא לא רק תשובה. לפעמים הוא חישוב, לפעמים החלטה, לפעמים Tool Call, ולפעמים עצירה אחראית. כל החוטים מהפרקים הקודמים נשמרים: דמיון אינו הסתברות, זיהוי משימה אינו אישור לפעול, יכולת אינה הרשאה, ועצירה אינה כישלון.
                    </span>
                </InsightBox>
            </section>


            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir="rtl">
                <ChapterQuiz chapterId={14} />
            </section>
        </ChapterLayout>
    );
}
