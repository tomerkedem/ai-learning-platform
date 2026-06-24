"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Scissors, MousePointerClick, Layers, SplitSquareHorizontal } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';

import { TokenizationLab } from '@/components/ai-internals/TokenizationLab';
import { TokenizationRoadmap } from '@/components/ai-internals/TokenizationRoadmap';
import { Mentor } from '@/components/ai-internals/Mentor';

export default function BehindTheScenesChapter5() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={5}>

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
                        <Scissors size={14} className="text-violet-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 05</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        AI לא מתחיל בלהבין.{' '}
                        <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                            הוא מתחיל בלפרק
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        לפני שהמנוע מחשב משמעות, הוא הופך את הטקסט ליחידות עבודה שנקראות Tokens. מה שנראה לנו כמו משפט,
                        נראה למנוע כמו רצף יחידות. הקלידו משפט, וראו אותו נשבר לכרטיסים חיים שנכנסים למנוע בזה אחר זה.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-violet-400" /> הקלידו או בחרו ניסוי מהיר
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <SplitSquareHorizontal size={14} className="text-cyan-400" /> לחצו על טוקן כדי לראות את תפקידו
                        </span>
                    </div>
                </div>
            </motion.section>
            {/* המנטור מחזיק טוקן - קודם מפרקים (xl+, מימין) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
              <Mentor pose="token" line="קודם מפרקים, אז מבינים 🧊" width={165} />
            </div>
            </div>

            {/* ══════════ Tokenization Lab ══════════ */}
            <section className="relative mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <Layers size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Tokenization Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת הפירוק לטוקנים</h3>
                    </div>
                </div>

                {/* פתיחה לימודית לפני המעבדה */}
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    כאן נראה את השלב שקורה עוד לפני כל חישוב: פירוק הטקסט ליחידות. כל מילה הופכת ל-token, מקבלת תפקיד וצבע,
                    וסימני פיסוק נחשבים גם הם יחידות נפרדות. זהו טוקנייזר לימודי שמדגים את הרעיון, לא הפירוק המדויק של מודל מסחרי.
                </div>

                <TokenizationLab />
                {/* המנטור בוחן כל טוקן (xl+, משמאל) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="inspect" line="כל טוקן - יחידת עבודה" width={160} />
                </div>
            </section>

            {/* ══════════ נוסחה + מפת דרכים ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6">
                    <div className="mb-4 leading-tight">
                        <div className="text-sm font-bold text-slate-200">הנוסחה</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">The formula</div>
                    </div>
                    <div className="space-y-2">
                        <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 font-mono text-sm text-slate-300" dir="ltr">
                            tokenize(text) = [token1, token2, token3, ...]
                        </div>
                        <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 font-mono text-sm text-slate-300" dir="ltr">
                            tokenize(&quot;החבילה לא הגיעה&quot;) = [&quot;החבילה&quot;, &quot;לא&quot;, &quot;הגיעה&quot;]
                        </div>
                    </div>
                </div>

                <TokenizationRoadmap />
            </section>

            {/* ══════════ סיכום + גשר לפרקים הבאים ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                {/* המנטור מסכם בעידוד (xl+, מימין) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="happy" line="זאת נקודת הכניסה למסלול" width={160} />
                </div>
                <InsightBox type="intuition" title="הנקודה החשובה בפרק">
                    <span className="block font-bold text-violet-200">AI לא מתחיל בלהבין. הוא מתחיל בלפרק.</span>
                    מה שנראה לנו כמו משפט שלם, נראה למנוע כמו רצף של יחידות עבודה. הפירוק הזה הוא נקודת הכניסה: בלעדיו אין בכלל
                    התחלה למסלול. ראינו שגם הצורה והפיסוק משפיעים, שאותו פירוק ראשוני מזין שני מסלולים שונים (בניית תשובה מול הבנת
                    משימה), ושמילה אחת בעברית יכולה להתפרק לכמה יחידות.
                    <span className="mt-3 block text-sm text-slate-400">
                        גשר לפרקים הבאים: אחרי שהטקסט הפך לטוקנים, השלב הבא הוא להפוך כל טוקן למספר (Token ID) ואז לווקטור. שם מתחיל החישוב הסטטיסטי האמיתי. הצביעה לפי תפקידים כאן היא עזר לימודי בלבד.
                    </span>
                </InsightBox>
            </section>

        </ChapterLayout>
    );
}
