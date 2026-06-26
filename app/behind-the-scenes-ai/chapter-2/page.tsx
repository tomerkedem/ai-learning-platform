"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Type, MousePointerClick, ArrowLeftRight, FlaskConical, Lightbulb, Lock, CheckCircle2, XCircle, Brain, FileText, MessageSquare, Filter } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';

import { DiscoveryGuess, type DiscoveryGuessContent, type DiscoveryGuessCard } from '@/components/ai-internals/DiscoveryGuess';
import { InputComparisonLab } from '@/components/ai-internals/InputComparisonLab';
import { Mentor } from '@/components/ai-internals/Mentor';

/* ════════════════════════ ניחוש הפתיחה ════════════════════════ */

const GUESS_CONTENT: DiscoveryGuessContent = {
    eyebrow: 'ניחוש מהיר · מה נכנס למודל',
    title: 'מה המודל באמת מקבל קודם כול, ברגע ששולחים הודעה?',
    subtitle: 'בחרו את ההסבר שנראה לכם הכי קרוב. זו לא בחינה, אבל יש כיוון אחד שמקרב אותנו למה שבאמת קורה.',
    invite: 'לפני שנפתח את זה, נסו לנחש: מה בעצם מגיע למודל ראשון?',
    invitePose: 'guessThinking',
    getsRightLabel: 'מה זה תופס נכון',
    revealButton: 'חשפו את הרעיון המרכזי',
    revealTitle: 'אז מה באמת נכנס?',
    revealCopy:
        'המודל לא מקבל את הכוונה שלכם ולא את התשובה מראש. נקודת הפתיחה היא הטקסט שכתבתם: המילים, הסדר, הפיסוק, ומה שלא נכתב. מכאן הוא מתחיל להסיק. לכן אותו רצון, בשני ניסוחים, יכול להכניס למודל חומר אחר לעבוד איתו.',
    revealPose: 'pointdown',
    cta: 'בואו נשווה כמה ניסוחים',
    ctaTargetId: 'input-lab',
    resetButton: 'בחרו מחדש',
    exploreHint: 'אפשר לבחור גם אפשרות אחרת ולראות איך היא נשמעת.',
};

const GUESS_CARDS: DiscoveryGuessCard[] = [
    {
        id: 'intention',
        title: 'את הכוונה שלי',
        desc: 'המודל מבין ישירות מה רציתי, עוד לפני המילים.',
        icon: Brain,
        statusLabel: 'טעות נפוצה',
        statusTone: 'common',
        mentorPose: 'reassure',
        getsRight: 'זו ההרגשה הטבעית, כי בין בני אדם אנחנו באמת מנחשים כוונה.',
        missesLabel: 'מה זה מפספס',
        misses: 'המודל לא מקבל כוונה כקלט. הוא מקבל את הטקסט ומנסה להסיק ממנו.',
        bridge: 'לכן אותו רצון, מנוסח אחרת, יכול להוביל למשהו אחר.',
    },
    {
        id: 'text',
        title: 'את הטקסט כפי שנכתב',
        desc: 'המילים, הסדר והפיסוק שהקלדתי, בדיוק כפי שהם.',
        icon: FileText,
        statusLabel: 'בחרת נכון',
        statusTone: 'precise',
        mentorPose: 'correct',
        getsRight: 'בדיוק. נקודת הפתיחה היא הטקסט עצמו, על כל מה שיש בו ומה שאין.',
        missesLabel: 'מה נשאר לראות',
        misses: 'נראה איך שינוי קטן בניסוח משנה את החומר שהמודל מקבל.',
        bridge: 'כל מה שקורה אחר כך מתחיל מהטקסט הזה.',
    },
    {
        id: 'answer',
        title: 'את התשובה שהוא צריך לתת',
        desc: 'המודל כבר יודע לאן להגיע, ורק מנסח יפה.',
        icon: MessageSquare,
        statusLabel: 'לא השלב הזה',
        statusTone: 'layer',
        mentorPose: 'headsup',
        getsRight: 'נכון שבסוף תהיה תשובה.',
        missesLabel: 'מה זה מפספס',
        misses: 'אבל התשובה נבנית בהמשך, היא לא משהו שהמודל מקבל בהתחלה.',
        bridge: 'בהתחלה יש רק את הקלט, והתשובה נבנית ממנו צעד אחר צעד.',
    },
    {
        id: 'important',
        title: 'רק את המילים החשובות',
        desc: 'המודל מסנן מראש ומשאיר את מה שחשוב.',
        icon: Filter,
        statusLabel: 'נכון חלקית',
        statusTone: 'partial',
        mentorPose: 'think',
        getsRight: 'באמת לא כל מילה תשפיע באותה מידה בהמשך.',
        missesLabel: 'מה זה מפספס',
        misses: 'אבל בשלב הקלט נכנס כל הטקסט, לא רק חלקים נבחרים. שקלול החשיבות קורה אחר כך.',
        bridge: 'קודם נכנס הכול, ורק בהמשך נקבע למה לשים לב.',
    },
];

/* ════════════════════════ נעילת הבנה: שאלת אבחון ════════════════════════ */

const DIAG_PROMPT = 'החבילה שלי לא הגיעה?';
const DIAG_OPTIONS = [
    'את הבעיה המלאה, עם כל הפרטים',
    'טקסט קצר עם סימן שאלה, בלי בקשה מפורשת',
    'את הכוונה לפתוח פנייה לתמיכה',
    'את התשובה שצריך להחזיר',
];
const DIAG_CORRECT = 1;

const DiagnosisQuestion: React.FC = () => {
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;

    return (
        <div dir="rtl" className="text-right">
            <p className="mb-3 text-sm font-bold text-slate-200">המשתמש כתב את ההודעה הזו. מה המודל באמת קיבל?</p>
            <p className="mb-4 rounded-lg border border-slate-700/50 bg-slate-950/40 p-3 text-sm text-slate-300">{DIAG_PROMPT}</p>

            <div className="grid gap-2 sm:grid-cols-2">
                {DIAG_OPTIONS.map((opt, i) => {
                    const isCorrect = i === DIAG_CORRECT;
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
                    המודל קיבל בדיוק את הטקסט הקצר הזה: כמה מילים וסימן שאלה. אין בו בקשה מפורשת ואין פרטים. כל היתר הוא מה
                    שאנחנו מניחים, לא מה שבאמת נכנס. כדאי שהמודל לא יניח שכבר התבקשה פעולה מסוימת.
                </motion.p>
            )}
        </div>
    );
};

export default function BehindTheScenesChapter2() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={2}>

            {/* ══════════ HERO ══════════ */}
            <div className="relative">
                <motion.section
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 text-right"
                    dir="rtl"
                >
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-indigo-500/30 mb-5">
                            <Type size={14} className="text-indigo-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-indigo-300">Behind the Scenes · 02</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                            המודל לא מקבל את הכוונה שלכם.{' '}
                            <span className="bg-gradient-to-l from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                                הוא מקבל את מה שכתבתם.
                            </span>
                        </h1>

                        <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                            כשאנחנו כותבים לצ׳אט, קל להניח שהמודל פשוט מבין למה התכוונו. אבל עוד לפני כל הבנה, מה שנכנס פנימה
                            הוא הטקסט עצמו: המילים, הסדר, הפיסוק, ומה שלא נכתב. בפרק הזה נגלה איך אותו רצון בדיוק, מנוסח אחרת,
                            מכניס למודל חומר אחר לעבוד איתו.
                        </p>

                        <p className="mt-4 text-base font-bold text-indigo-200">אם הכוונה שלי ברורה לי, למה הניסוח עדיין משנה?</p>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-indigo-400" /> נחשו מה נכנס ראשון
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <ArrowLeftRight size={14} className="text-cyan-400" /> השוו ניסוחים וראו מה משתנה
                            </span>
                        </div>
                    </div>
                </motion.section>

                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="inputClarity" line="נתחיל ממה שבאמת נכתב" width={165} />
                </div>
            </div>

            {/* ══════════ ניחוש פתיחה ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <DiscoveryGuess content={GUESS_CONTENT} cards={GUESS_CARDS} />
            </section>

            {/* ══════════ רגע ה-wow ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <InsightBox type="intuition" title="הנקודה המפתיעה">
                    <span className="block text-lg font-bold text-indigo-200">
                        שתי בקשות יכולות להגיע מאותה כוונה, אבל להכניס למודל חומר אחר לגמרי.
                    </span>
                    הכוונה נשארת בראש שלנו. מה שהמודל מקבל הוא הניסוח: המילים שבחרנו, הסדר שלהן, הפיסוק, ומה שהשארנו בחוץ.
                    שינוי קטן בקלט יכול לשנות את מה שיש למודל לעבוד איתו.
                </InsightBox>
            </section>

            {/* ══════════ מעבדת השוואת קלט ══════════ */}
            <section id="input-lab" className="relative mt-12 space-y-5 text-right scroll-mt-24" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-indigo-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-400">Input Comparison Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת השוואת קלט</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    אותו צורך, חמישה ניסוחים. בחרו ניסוח וראו מה נכנס למודל בפועל: מה מפורש, מה חסר, מה השתנה, ולאן זה נוטה.
                    המטרה היא לראות שהקלט עצמו כבר קובע הרבה, עוד לפני שמתחיל עיבוד עמוק יותר.
                </div>

                <InputComparisonLab />

                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="explain" line="אותו צורך, חומר אחר" width={160} />
                </div>
            </section>

            {/* ══════════ דוגמה יומיומית ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 flex items-center gap-2">
                        <Lightbulb size={18} className="text-amber-300" />
                        <div className="text-sm font-bold text-slate-100">רגע מהחיים</div>
                    </div>
                    <p>
                        כשכותבים לחבר &quot;לא הגיעה&quot;, הוא כבר יודע על מה מדובר, מהשיחה, מהטון ומההיסטוריה ביניכם. המודל מתחיל ממה
                        שבאמת כתוב לו ומההקשר שיש לו בשיחה. הוא יכול להסיק לא מעט, אבל הוא לא מקבל את מה שיש לכם בראש.
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
                        <p className="leading-relaxed text-slate-300">&quot;המודל יודע למה התכוונתי.&quot;</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-emerald-200">
                            <CheckCircle2 size={18} />
                            <span className="text-sm font-bold">איך זה באמת עובד</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">
                            המודל יכול להסיק כוונה מתוך הטקסט וההקשר, אבל הוא לא מקבל את הכוונה עצמה כקלט ישיר.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════ הסבר פשוט ════════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 text-sm font-bold text-slate-100">מה כדאי לקחת מהפרק</div>
                    <ul className="space-y-2">
                        {[
                            'הקלט הוא הטקסט שנכתב בפועל, לא הכוונה.',
                            'ניסוח, סדר והקשר משנים את מה שיש למודל לעבוד איתו.',
                            'פרטים חסרים יכולים לאלץ את המודל לנחש, לשאול, או לענות בכלליות.',
                            'הוספת מספר מעקב הופכת את הבקשה למשהו שאפשר לבדוק.',
                            'בקשת פעולה מפורשת מעלה את הסיכון ויכולה להזיז את ההתנהגות לכיוון Agent.',
                            'תיקון באמצע שיחה משנה את ההקשר הנוכחי, לא את מה שהמודל למד באימון.',
                        ].map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                                <span className="text-sm">{line}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ══════════ נעילת הבנה ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="happy" line="נעלתם את הרעיון" width={160} />
                </div>
                <div className="rounded-2xl border border-indigo-500/40 bg-slate-900/60 p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <Lock size={20} className="text-indigo-300" />
                        <h3 className="text-xl font-bold text-white">נעילת הבנה</h3>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">אמת</div>
                            <p className="text-sm leading-relaxed text-slate-200">המודל מתחיל ממה שנכתב בפועל.</p>
                        </div>
                        <div className="rounded-xl border border-rose-500/30 bg-rose-950/10 p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-rose-300">טעות</div>
                            <p className="text-sm leading-relaxed text-slate-200">המודל מקבל את הכוונה שלי כמו שהיא.</p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-700/50 bg-slate-950/30 p-4">
                        <DiagnosisQuestion />
                    </div>
                </div>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-12 mb-4" dir="rtl">
                <AssessmentEngine {...behindAiChapterQuizzes[2]} />
            </section>
        </ChapterLayout>
    );
}
