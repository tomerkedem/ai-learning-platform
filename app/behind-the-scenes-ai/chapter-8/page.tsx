"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link2, MousePointerClick, FlaskConical, Lightbulb, ScanSearch, Lock, CheckCircle2, XCircle } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { ChapterQuiz } from '../ChapterQuiz';
import { InsightBox } from '@/components/content/InsightBox';

import { AttentionGuess } from '@/components/ai-internals/AttentionGuess';
import { AttentionMomentLab } from '@/components/ai-internals/AttentionMomentLab';
import { StickyContextBar } from '@/components/ai-internals/StickyContextBar';
import { Mentor } from '@/components/ai-internals/Mentor';

/** הפרומפט העוגן של הפרק. */
const PROMPT = 'החבילה שלי לא הגיעה, אבל קיבלתי הודעה שהיא נמסרה. מה לעשות?';

/* ════════════════════════ נעילת הבנה: שאלת אבחון ════════════════════════ */

const DIAGNOSIS_OPTIONS = [
    'החבילה ⟵ שלי',
    'לא הגיעה ⟵ נמסרה',
    'הודעה ⟵ מה',
    'לעשות ⟵ חבילה',
];
const DIAGNOSIS_CORRECT = 1;

const DiagnosisQuestion: React.FC = () => {
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;

    return (
        <div dir="rtl" className="text-right">
            <p className="mb-3 text-sm font-bold text-slate-200">
                הנה הפרומפט שוב. כשהמודל מכין תשובה זהירה, איזה קשר חשוב במיוחד?
            </p>
            <p className="mb-4 rounded-lg border border-slate-700/50 bg-slate-950/40 p-3 text-sm text-slate-300">{PROMPT}</p>

            <div className="grid gap-2 sm:grid-cols-2">
                {DIAGNOSIS_OPTIONS.map((opt, i) => {
                    const isCorrect = i === DIAGNOSIS_CORRECT;
                    const isChosen = i === choice;
                    let cls = 'border-slate-700/50 bg-slate-950/30 text-slate-300 hover:border-slate-600';
                    if (answered && isCorrect) cls = 'border-emerald-400/70 bg-emerald-900/25 text-emerald-100';
                    else if (answered && isChosen && !isCorrect) cls = 'border-rose-400/70 bg-rose-900/20 text-rose-100';
                    return (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setChoice(i)}
                            className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${cls}`}
                        >
                            <span dir="rtl">{opt}</span>
                            {answered && isCorrect && <CheckCircle2 size={16} className="shrink-0 text-emerald-300" />}
                            {answered && isChosen && !isCorrect && <XCircle size={16} className="shrink-0 text-rose-300" />}
                        </button>
                    );
                })}
            </div>

            {answered && (
                <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-3 text-sm leading-relaxed text-slate-200"
                >
                    הקשר החזק הוא <span className="font-bold text-emerald-200">&quot;לא הגיעה&quot; מול &quot;נמסרה&quot;</span>. העיקר הוא לא רק
                    שהחבילה חסרה, אלא הסתירה בין מה שהמשתמש חווה לבין הודעת המסירה. שם הקשב צריך להיות חזק כדי שהתשובה לא
                    תניח דבר שעוד לא נבדק.
                </motion.p>
            )}
        </div>
    );
};

export default function BehindTheScenesChapter8() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={8}>

            {/* ══════════ HERO ══════════ */}
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
                            <Link2 size={14} className="text-violet-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 08 · Attention</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                            אותו משפט,{' '}
                            <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent">
                                אבל לא כל מילה חשובה באותה מידה
                            </span>
                        </h1>

                        <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                            המשפט כולו נמצא מול המודל בבת אחת. אז למה הוא לא מתייחס לכל המילים בעוצמה זהה? בפרק הזה נגלה איך
                            המודל מחליט, בכל רגע, אילו חלקים בהקשר חשובים לו עכשיו. המנגנון הזה נקרא Attention.
                        </p>

                        <div className="mt-6 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4">
                            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <ScanSearch size={13} className="text-violet-400" /> הפרומפט של הפרק
                            </div>
                            <p className="text-base font-bold text-slate-100">{PROMPT}</p>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-violet-400" /> בחרו רגע בתשובה
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Link2 size={14} className="text-emerald-400" /> וראו איזו מילה מושכת משקל
                            </span>
                        </div>
                    </div>
                </motion.section>

                {/* מנטור הירו של פרק 8: נכס ייעודי עם אלפא שקוף. בלי בועת דיבור, כדי
                    שלא ישכפל את כותרת הפרק ולא יתחרה בה. מוצג רק מ-xl ומעלה. */}
                <div className="pointer-events-none absolute top-1/2 left-full ml-3 2xl:ml-6 z-20 hidden w-[170px] -translate-y-1/2 xl:block">
                    <motion.img
                        src="/assets/chapter-08-attention-mentor-hero-alpha.png"
                        alt="המנטור של הלומדה"
                        initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                        animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, -10, 0] }}
                        transition={reduce ? { duration: 0 } : { y: { repeat: Infinity, duration: 4, ease: 'easeInOut' }, opacity: { duration: 0.4 } }}
                        className="block h-auto w-full object-contain drop-shadow-[0_15px_35px_rgba(34,211,238,0.30)]"
                        draggable={false}
                    />
                </div>
            </div>

            {/* ══════════ ניחוש לפני הסבר: ארבע השערות על Attention ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <AttentionGuess />
            </section>

            {/* ══════════ פס הקשר דביק ══════════ */}
            {/* מתחיל רק מאזור המעבדה ואילך, לא ישירות מתחת להירו, כדי שהפרומפט לא יוצג
                פעמיים כשההירו גלוי. משם והלאה הוא נשאר דביק כהקשר לאורך אזור הניתוח. */}
            <div className="mt-12">
                <StickyContextBar
                    inputText={PROMPT}
                    labelHe="הפרומפט של הפרק"
                    decisionHe="קשב להקשר"
                    decisionEn="Attention"
                    tone="neutral"
                    reduce={!!reduce}
                />
            </div>

            {/* ══════════ מעבדת הקשב ══════════ */}
            <section id="attention-lab" className="relative mt-8 space-y-5 text-right scroll-mt-24" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Attention Lab</div>
                        <h3 className="text-2xl font-bold text-white">בחרו רגע, וראו מי חשוב עכשיו</h3>
                    </div>
                </div>

                <p className="text-base leading-relaxed text-slate-300">
                    תשובה טובה לא נבנית במכה אחת. המודל עובר רגעים: קודם הוא מבין את הבעיה, אחר כך שם לב לסתירה, ובהמשך בונה
                    הצעה לפעולה. בכל רגע כזה חלק אחר במשפט נעשה רלוונטי יותר. בחרו רגע ותראו את המשקל עובר.
                </p>

                <AttentionMomentLab />

                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="explain" line="המשקל זז לפי הרגע" width={160} />
                </div>
            </section>

            {/* ══════════ רגע ה-wow ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <InsightBox type="intuition" title="הנקודה המפתיעה">
                    <span className="block text-lg font-bold text-violet-200">
                        אותו משפט. אותו מודל. אבל בכל רגע חלק אחר במשפט מושך יותר משקל.
                    </span>
                    אין מילה אחת שהיא &quot;החשובה ביותר&quot;. החשיבות אינה תכונה קבועה של מילה, אלא תוצאה של מה שהמודל מעבד באותו רגע.
                    וזה ההבדל בין רשימה קבועה של מילים מודגשות לבין מנגנון דינמי שמשנה את המשקל לפי הרגע שבו המודל נמצא.
                </InsightBox>
            </section>

            {/* ══════════ דוגמה יומיומית ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 flex items-center gap-2">
                        <Lightbulb size={18} className="text-amber-300" />
                        <div className="text-sm font-bold text-slate-100">רגע מהחיים</div>
                    </div>
                    <p>
                        כשאדם קורא &quot;החבילה לא הגיעה, אבל קיבלתי הודעה שהיא נמסרה&quot;, הוא נעצר רגע ב&quot;אבל&quot;. המילה הזו משנה איך
                        קוראים את כל ההמשך. חשוב לזכור: המודל לא נעצר ולא מבין כמו אדם. אין לו רגע של &quot;הבנה&quot;. מנגנון הקשב רק
                        נותן לו דרך מתמטית לשקלל אילו חלקים בטקסט קשורים זה לזה חזק יותר, ולפי זה לערבב את המידע.
                    </p>
                </div>
            </section>

            {/* ══════════ תיקון טעות נפוצה ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-rose-200">
                            <XCircle size={18} />
                            <span className="text-sm font-bold">טעות נפוצה</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">
                            &quot;Attention זה כשהמודל מסמן את המילים החשובות, ואז עונה לפיהן.&quot; לפי זה הקשב הוא מעין טוש מדגיש
                            שמסמן פעם אחת מה חשוב.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-emerald-200">
                            <CheckCircle2 size={18} />
                            <span className="text-sm font-bold">איך זה באמת עובד</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">
                            Attention הוא לא טוש מדגיש. הוא מנגנון של יחסים. בכל רגע הוא שואל, בעצם: כשאני מעבד את החלק הזה,
                            אילו חלקים אחרים בהקשר צריכים להשפיע עליו הכי הרבה? התשובה משתנה מרגע לרגע.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════ הסבר Q/K/V עדין ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="rounded-2xl border border-violet-500/30 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 flex items-center gap-2">
                        <Link2 size={18} className="text-violet-300" />
                        <div className="leading-tight">
                            <div className="text-sm font-bold text-slate-100">איך מנגנון היחסים עובד, בלי נוסחאות</div>
                            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Query · Key · Value</div>
                        </div>
                    </div>
                    <p>
                        כל מילה שולחת מעין שאלה: על מה כדאי לי להסתכל עכשיו? מילים אחרות חושפות אותות: איזה מידע אני מכילה?
                        המודל מחשב אילו זוגות של שאלה ואות מתאימים חזק יותר, ואז מערבב את המידע לפי עוצמת ההתאמה. ככה
                        המשמעות של כל מילה מתעדכנת לפי ההקשר שסביבה. זה כל הרעיון, בלי מתמטיקה.
                    </p>
                </div>
            </section>

            {/* ══════════ נעילת הבנה ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="celebrate" line="נעלתם את הקשב" width={160} />
                </div>
                <div className="rounded-2xl border border-violet-500/40 bg-slate-900/60 p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <Lock size={20} className="text-violet-300" />
                        <h3 className="text-xl font-bold text-white">נעילת הבנה</h3>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">אמת</div>
                            <p className="text-sm leading-relaxed text-slate-200">
                                Attention לא אומר שמילה אחת תמיד חשובה. החשיבות משתנה לפי הרגע שהמודל מעבד.
                            </p>
                        </div>
                        <div className="rounded-xl border border-rose-500/30 bg-rose-950/10 p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-rose-300">טעות</div>
                            <p className="text-sm leading-relaxed text-slate-200">
                                &quot;המודל סימן את המילים החשובות ואז ענה.&quot;
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-700/50 bg-slate-950/30 p-4">
                        <DiagnosisQuestion />
                    </div>
                </div>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-12 mb-4" dir="rtl">
                <ChapterQuiz chapterId={8} />
            </section>
        </ChapterLayout>
    );
}
