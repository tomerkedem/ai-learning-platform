"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BrainCircuit, RotateCcw, Layers, FlaskConical, Compass } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';

import { LearnsFromMistakesLab } from '@/components/ai-internals/LearnsFromMistakesLab';

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
                <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-amber-500/10 blur-[90px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-violet-500/30 mb-5">
                        <BrainCircuit size={14} className="text-violet-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 14</span>
                    </div>

                    <div className="mb-5 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-slate-300 leading-relaxed">
                        ראינו את כל המנגנון מבפנים, מ-Tokens ועד החלטה ועצירה אחראית. עכשיו, לפני שנדבר על איך כותבים למודל, צריך
                        לתקן אמונה נפוצה אחת: רבים חושבים שכשהם מתקנים את המודל, הוא לומד מהם וזוכר אותם.
                        <br />
                        בפרק הזה נראה שזה לא מדויק, ולמה זה חשוב דווקא כשניגשים לכתוב.
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        כשאתה מדבר עם המודל,{' '}
                        <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent">
                            הוא לא לומד ממך
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        המשקלים שלו קפואים, והתיקון שלך חי רק כל עוד הוא נמצא בהקשר, ונעלם כשהשיחה נגמרת. אבל זו לא כל התמונה,
                        ודווקא כאן צריך דיוק: יש שלוש שכבות למידה שונות, ואף אחת מהן אינה &quot;המודל לומד ממך חי&quot;.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <RotateCcw size={14} className="text-amber-400" /> תקנו את המודל, ואז פתחו שיחה חדשה
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Layers size={14} className="text-violet-400" /> הכירו את שלוש שכבות הלמידה
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
                        רבים מאמינים שה-AI לומד מהשיחה איתם, שכל תיקון משפר אותו, ושהוא זוכר אותם מפעם לפעם. בפרק הזה נראה שזה לא
                        מדויק, ושהתמונה האמיתית מורכבת משלוש שכבות שונות.
                    </p>
                    <p>
                        נתחיל מ<span className="font-bold text-violet-200">משקלים קפואים</span> שלא משתנים כשמתקנים אותם, נעבור ל<span className="font-bold text-violet-200">תיקון שנעלם</span> בשיחה חדשה,
                        נפרוס את <span className="font-bold text-violet-200">שלוש שכבות הלמידה</span>, נהפוך כמה <span className="font-bold text-violet-200">מיתוסים</span> לגרסה המדויקת, ונבין למה המודל בכלל שוכח.
                    </p>
                    <p className="font-bold text-violet-200">
                        המסר: כשאתה מדבר עם המודל, הוא לא לומד ממך, הוא מתאים את עצמו זמנית בתוך השיחה.
                    </p>
                </div>
            </section>

            {/* ══════════ Learns From Mistakes Lab ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Learning Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת הלמידה</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    חמישה כלים קצרים, כל אחד מתקן חלק אחר באמונה ש&quot;המודל לומד ממני&quot;. כל כלי מלווה בהקדמה, בשורת מסקנה,
                    ובהנחיית Try this. זה לא מנוע שעוקבים אחריו צעד צעד, אלא המחשה שמראה מה באמת קורה כשמתקנים מודל.
                </div>

                <LearnsFromMistakesLab />
            </section>

            {/* ══════════ סיכום + גשר לפרק הכתיבה ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <InsightBox type="intuition" title="הנקודה החשובה בפרק">
                    <span className="block font-bold text-violet-200">המודל לא לומד ממך חי, אבל זו לא אומרת שהוא בכלל לא לומד.</span>
                    למידה אמיתית קרתה באימון, שעכשיו קפוא. בתוך השיחה יש התאמה זמנית שנעלמת ברגע שההקשר נמחק. ואם המודל משתפר,
                    זה דרך גרסה חדשה שהספק מאמן ומשחרר, בתהליך איטי ונפרד, לא חי מהשיחה שלך.
                    <span className="mt-3 block text-sm text-slate-400">
                        גשר לפרק הבא: כיוון שהמודל לא זוכר תיקונים קודמים בין שיחות, כשכותבים לו צריך לספק את ההקשר מחדש בכל פעם,
                        ולא להניח שהוא &quot;כבר יודע&quot;. זה בדיוק מה שהופך כתיבה טובה להגדרה ברורה, ולא לקסם, והוא הנושא של פרק הסיום.
                    </span>
                </InsightBox>
            </section>

        </ChapterLayout>
    );
}
