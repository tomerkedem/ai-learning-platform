"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Compass, MousePointerClick, Move3d, FlaskConical, MapPin, Navigation, Sigma, BookOpen } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';
import { SemanticSpaceLab } from '@/components/ai-internals/SemanticSpaceLab';

/** שלוש אבני היסוד של הפרק, מסומנות לפני שנכנסים למעבדה. */
const CONCEPTS = [
    {
        icon: MapPin,
        he: 'מילה היא נקודה',
        en: 'A word is a point',
        desc: 'כל מילה יושבת במקום קבוע במרחב המשמעות. מילים בעלות משמעות דומה שוכנות באותו אזור.',
    },
    {
        icon: Navigation,
        he: 'כיוון לפני מרחק',
        en: 'Direction before distance',
        desc: 'מה שקובע קרבה במשמעות הוא הכיוון שאליו המילה מצביעה מהראשית, לא כמה היא רחוקה.',
    },
    {
        icon: Sigma,
        he: 'יחסים הם חשבון',
        en: 'Relations are arithmetic',
        desc: 'כשמשמעות הופכת לכיוון, יחסים בין מילים הופכים לחיבור וחיסור של חצים. מלך פחות גבר ועוד אישה מוביל אל מלכה.',
    },
];

const ConceptCards: React.FC = () => {
    const reduce = useReducedMotion();
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {CONCEPTS.map((c, i) => {
                const Icon = c.icon;
                return (
                    <motion.div
                        key={c.en}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.07 }}
                        className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4 text-right"
                        dir="rtl"
                    >
                        <div className="mb-2 flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                                <Icon size={16} />
                            </span>
                            <div className="leading-tight">
                                <div className="text-sm font-bold text-slate-200">{c.he}</div>
                                <div className="text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{c.en}</div>
                            </div>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-400">{c.desc}</p>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default function BehindTheScenesChapter7() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={7}>

            {/* ══════════ HERO ══════════ */}
            <motion.section
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 text-right"
                dir="rtl"
            >
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-fuchsia-500/10 blur-[90px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-violet-500/30 mb-5">
                        <Move3d size={14} className="text-violet-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 07</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        משמעות יש לה{' '}
                        <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                            כיוון במרחב
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        בפרק הקודם ראינו שכל משפט הופך לווקטור משמעות, רצף מספרים. אבל מהו וקטור באמת? הוא נקודה וחץ במרחב. בפרק הזה
                        ניכנס למרחב הזה ונראה אותו בעיניים: מילים קרובות במשמעות שוכנות באותו אזור, הכיוון חשוב יותר מהמרחק, ואפשר
                        אפילו לחבר ולחסר משמעויות. עדיין לא נחשב כאן אחוזים, רק נבנה את האינטואיציה הגיאומטרית.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-violet-400" /> לחצו על מילה וראו מה קרוב אליה
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Compass size={14} className="text-cyan-400" /> גלו את הקרבה לפי כיוון, לא לפי מרחק
                        </span>
                    </div>
                </div>
            </motion.section>

            {/* ══════════ אבני יסוד ══════════ */}
            <section className="mt-12 space-y-4 text-right" dir="rtl">
                <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-violet-300" />
                    <h3 className="text-lg font-bold text-slate-200">שלושה רעיונות לפני שנכנסים למרחב</h3>
                </div>
                <ConceptCards />
            </section>

            {/* ══════════ Semantic Space Lab ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Semantic Space Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת מרחב המשמעות</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    כאן אפשר לגעת במרחב המשמעות. בניסוי הראשון, &quot;קרבה במרחב&quot;, כל מילה היא חץ מהראשית. לחצו על מילה, וכל השאר
                    ידורגו לפי קרבת הכיוון אליה: &quot;חתול&quot; קרוב ל&quot;כלב&quot; ורחוק מ&quot;מכונית&quot;. בניסוי השני, &quot;אנלוגיית וקטורים&quot;, נראה
                    איך אותו כיוון בדיוק מחבר בין &quot;גבר&quot; ל&quot;אישה&quot; ובין &quot;מלך&quot; ל&quot;מלכה&quot;.
                </div>

                <SemanticSpaceLab />
            </section>

            {/* ══════════ סיכום + גשר לפרק 8 ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <InsightBox type="intuition" title="הנקודה החשובה בפרק">
                    <span className="block font-bold text-violet-200">משמעות אינה מספר בודד, היא כיוון במרחב. קרבה במשמעות היא קרבה בכיוון, לא במרחק.</span>
                    ראינו שמילים בעלות משמעות דומה מצביעות לאותו כיוון, ולכן &quot;אריה&quot; ו&quot;חתול&quot; נשארים קרובים גם כשאחד מהם רחוק
                    יותר מהראשית. ראינו ש&quot;קרבת כיוון&quot;, שנקראת Cosine Similarity, היא הדרך הטבעית למדוד את זה. ואפילו ראינו שיחסים
                    בין מילים הם חשבון של חצים: מלך פחות גבר ועוד אישה נוחת על מלכה.
                    <span className="mt-3 block text-sm text-slate-400">
                        גשר לפרק הבא: כאן ראינו את הקרבה בעיניים, כצורה ומיקום. בפרק הבא ניקח את אותה קרבת כיוון ונהפוך אותה למספרים:
                        איך מחשבים דמיון, איך הוא הופך לציונים, ואיך הציונים הופכים להסתברויות ולהחלטה.
                    </span>
                </InsightBox>
            </section>

        </ChapterLayout>
    );
}
