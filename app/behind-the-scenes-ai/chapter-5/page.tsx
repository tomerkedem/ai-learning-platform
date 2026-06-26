"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Repeat, Repeat2, MousePointerClick, Layers, FlaskConical, Lightbulb, Lock, CheckCircle2, XCircle, Database, Globe, ArrowLeft } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';

import { DiscoveryGuess, type DiscoveryGuessContent, type DiscoveryGuessCard } from '@/components/ai-internals/DiscoveryGuess';
import { AnswerBuilderLab } from '@/components/ai-internals/AnswerBuilderLab';
import { Mentor } from '@/components/ai-internals/Mentor';

/* ════════════════════════ ניחוש הפתיחה ════════════════════════ */

const GUESS_CONTENT: DiscoveryGuessContent = {
    eyebrow: 'ניחוש מהיר · בניית התשובה',
    title: 'מה קורה אחרי שהמודל בוחר את ההמשך הראשון?',
    subtitle: 'בחרו את המודל המנטלי שנראה לכם הכי קרוב. אין כאן ציון, יש כיוון אחד שמתאר מה באמת קורה.',
    invite: 'לפני שנפתח את זה, נסו לנחש מה קורה בין צעד אחד לצעד הבא בזמן שהתשובה נבנית.',
    invitePose: 'guessThinking',
    getsRightLabel: 'מה זה תופס נכון',
    revealButton: 'חשפו את הרעיון המרכזי',
    revealTitle: 'אז מה באמת קורה?',
    revealCopy:
        'המודל לא מחזיק את התשובה השלמה ואז מציג אותה. הוא מייצר חלק קטן, מצרף אותו למה שכבר נכתב, ומסתכל שוב על ההקשר המעודכן כדי לבחור את החלק הבא. כך כל צעד מעצב את הצעד שאחריו, והתשובה נבנית בלולאה.',
    revealPose: 'pointdown',
    cta: 'בואו נראה את זה במעבדה',
    ctaTargetId: 'answer-builder-lab',
    resetButton: 'בחרו מחדש',
    exploreHint: 'אפשר לבחור גם אפשרות אחרת ולראות איך היא נשמעת.',
};

const GUESS_CARDS: DiscoveryGuessCard[] = [
    {
        id: 'ready',
        title: 'כל התשובה כבר מוכנה',
        desc: 'התשובה השלמה קיימת אצלו, והוא רק מציג אותה החוצה.',
        icon: Database,
        statusLabel: 'טעות נפוצה',
        statusTone: 'common',
        mentorPose: 'reassure',
        getsRight: 'מובן לחשוב כך, כי התשובה זורמת בצורה חלקה כאילו תוכננה מראש.',
        missesLabel: 'מה זה מפספס',
        misses: 'אין תשובה שלמה ששמורה מראש. המודל מייצר חלק, מצרף אותו, ורק אז ניגש לחלק הבא.',
        bridge: 'בגלל זה אותה שאלה יכולה להיבנות מעט אחרת בכל פעם.',
    },
    {
        id: 'loop',
        title: 'כל צעד מצטרף להקשר ומשפיע על הצעד הבא',
        desc: 'כל חלק שנכתב הופך לחלק מההקשר, וההקשר המעודכן מעצב את הבחירה הבאה.',
        icon: Repeat2,
        statusLabel: 'בחרת נכון',
        statusTone: 'precise',
        mentorPose: 'correct',
        getsRight: 'בדיוק. הייצור הוא לולאה. החלק שנכתב חוזר פנימה והופך לחלק מהשאלה על הצעד הבא.',
        missesLabel: 'מה נשאר לראות',
        misses: 'במעבדה נראה איך החלפת החלק הראשון משנה את כל שאר התשובה.',
        bridge: 'צעד מוקדם הוא לא רק עוד מילה, הוא מסגרת לכל מה שבא אחריו.',
    },
    {
        id: 'verify',
        title: 'המודל בודק בכל צעד אם התשובה אמיתית',
        desc: 'לפני כל חלק הוא מאמת מול העולם שזה נכון.',
        icon: Globe,
        statusLabel: 'לא השלב הזה',
        statusTone: 'layer',
        mentorPose: 'headsup',
        getsRight: 'נכון שלפעמים חשוב לאמת מול העולם.',
        missesLabel: 'מה זה מפספס',
        misses: 'אימות הוא שכבה אחרת, של כלים ומקורות. בלולאת הייצור עצמה המודל נשען על ההקשר והדפוסים שלמד, לא על בדיקה במציאות.',
        bridge: 'בנייה צעד אחר צעד מייצרת המשך מתאים, היא לא מאמתת עובדות.',
    },
    {
        id: 'last-word',
        title: 'המודל ממשיך רק לפי המילה האחרונה שכתב',
        desc: 'רק החלק האחרון קובע מה יבוא, כל השאר כבר לא משנה.',
        icon: ArrowLeft,
        statusLabel: 'נכון חלקית',
        statusTone: 'partial',
        mentorPose: 'think',
        getsRight: 'יש בזה גרעין אמת, החלק האחרון שנכתב באמת משפיע חזק על מה שבא אחריו.',
        missesLabel: 'מה זה מפספס',
        misses: 'אבל לא רק הוא. המודל מסתכל על כל ההקשר שנצבר, לא רק על המילה האחרונה. גם הפתיחה הרחוקה עדיין מכוונת.',
        bridge: 'ההשפעה היא של ההקשר כולו, ולכן בחירות מוקדמות נשארות חשובות עד הסוף.',
    },
];

/* ════════════════════════ נעילת הבנה: שאלת סיווג ════════════════════════ */

const LOCK_FRAGMENT = 'בדקו את מספר המעקב';
const LOCK_OPTIONS = [
    'כלום לא משתנה, המודל ממשיך מאותו מקום',
    'החלק הזה מצטרף להקשר ומשנה את האפשרויות לצעד הבא',
    'המודל בדק עכשיו את סטטוס החבילה במציאות',
    'המודל מתחיל מחדש מהשאלה המקורית בלבד',
];
const LOCK_CORRECT = 1;

const UnderstandingLock: React.FC = () => {
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;

    return (
        <div dir="rtl" className="text-right">
            <p className="mb-3 text-sm font-bold text-slate-200">
                המודל כתב כרגע את החלק &quot;{LOCK_FRAGMENT}...&quot;. מה משתנה עכשיו, לקראת הצעד הבא?
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
                {LOCK_OPTIONS.map((opt, i) => {
                    const isCorrect = i === LOCK_CORRECT;
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
                    החלק שנכתב מצטרף מיד להקשר, וההקשר המעודכן הוא שמשנה אילו המשכים יקבלו משקל גבוה בצעד הבא. זו לא
                    בדיקה במציאות ולא התחלה מחדש. בנייה צעד אחר צעד מרכיבה המשך מתאים, היא לא מאמתת אם הוא נכון בעולם.
                </motion.p>
            )}
        </div>
    );
};

/* ════════════════════════ הסבר מקצועי פשוט ════════════════════════ */

const TAKEAWAYS = [
    'ייצור התשובה הוא תהליך חוזר, לא פעולה אחת.',
    'בכל צעד המודל מעריך מה החלק הבא המתאים, בדיוק כמו שראינו בפרק הקודם.',
    'החלק שנוצר מצורף להקשר, וההקשר המעודכן הוא הקלט לצעד הבא.',
    'בחירות מוקדמות יכולות לכוון בחירות מאוחרות, ומכאן נובעת הקוהרנטיות.',
    'קוהרנטיות אינה אימות אמת. בנייה צעד אחר צעד לא בודקת אם התוכן נכון בעולם.',
    'בדיקה אמיתית דורשת כלי או מקור חיצוני, נושא לפרק מאוחר יותר.',
];

export default function BehindTheScenesChapter5() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={5}>

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
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-fuchsia-500/10 blur-[90px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-violet-500/30 mb-5">
                            <Repeat size={14} className="text-violet-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 05</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                            כל מילה שהמודל כותב{' '}
                            <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
                                חוזרת פנימה
                            </span>
                        </h1>

                        <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                            ראינו שהמודל בוחר המשך שנראה סביר. אבל הוא לא עוצר אחרי בחירה אחת. הוא חוזר על הבחירה שוב ושוב,
                            וכל חלק שנכתב מצטרף להקשר ומשפיע על הבחירה הבאה. התשובה לא נולדת בבת אחת, היא נבנית בלולאה.
                        </p>

                        <p className="mt-4 text-base font-bold text-violet-200">
                            אם המודל בונה תשובה צעד אחר צעד, איך מילה אחת משנה את כל מה שבא אחריה?
                        </p>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-violet-400" /> בחרו פתיחה וצעדו בלולאה
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Layers size={14} className="text-fuchsia-400" /> ראו את ההקשר גדל בכל צעד
                            </span>
                        </div>
                    </div>
                </motion.section>

                {/* המנטור בונה תשובה צעד אחר צעד מחלקים והקשר (xl+, מימין) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="answerBuilder" line="כל צעד בונה את הבא" width={165} />
                </div>
            </div>

            {/* ══════════ ניחוש פתיחה ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <DiscoveryGuess content={GUESS_CONTENT} cards={GUESS_CARDS} />
            </section>

            {/* ══════════ מעבדת בניית התשובה ══════════ */}
            <section id="answer-builder-lab" className="relative mt-12 space-y-5 text-right scroll-mt-24" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Answer Builder Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת בניית התשובה</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    אותו פרומפט, ולולאה אחת שבונה את התשובה. בחרו את החלק הראשון, ואז צעדו קדימה וראו איך כל חלק שנבחר
                    מצטרף להקשר, ואיך ההקשר המעודכן משנה את האפשרויות לחלק הבא. נסו את שתי הפתיחות, וראו שאותו פרומפט מוביל
                    לשתי תשובות שונות.
                </div>

                <AnswerBuilderLab />

                {/* המנטור מסביר שהפלט חוזר פנימה (xl+, משמאל) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="explain" line="כל חלק חוזר פנימה" width={160} />
                </div>
            </section>

            {/* ══════════ רגע ה-wow ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <InsightBox type="intuition" title="הנקודה המפתיעה">
                    <span className="block text-lg font-bold text-violet-200">
                        כל חלק שהמודל כותב הופך מיד לחלק מהשאלה הבאה.
                    </span>
                    התשובה לא רק יוצאת מהמנוע, היא גם משנה את מה שהמנוע רואה בצעד הבא. לכן המילים הראשונות שנבחרו יכולות
                    לכוון את כל ההמשך, ואותו פרומפט יכול להיבנות לשתי תשובות שונות לגמרי לפי החלק שנבחר בהתחלה.
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
                        כשכותבים משפט, אחרי המילים הראשונות כבר מרגישים מה מתאים להמשיך. הן מצמצמות את האפשרויות הטבעיות.
                        אצל המודל זה דומה, רק שהחלק שנכתב הופך מיד לחלק מהשאלה על הצעד הבא, ולא נשאר רק תחושה.
                    </p>
                </div>
            </section>

            {/* ══════════ תיקון טעות נפוצה ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="reassure" line="אין תשובה שמחכה מוכנה" width={155} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-rose-200">
                            <XCircle size={18} />
                            <span className="text-sm font-bold">טעות נפוצה</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">&quot;המודל יודע מראש את כל התשובה ואז מציג אותה.&quot;</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-emerald-200">
                            <CheckCircle2 size={18} />
                            <span className="text-sm font-bold">איך זה באמת עובד</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">
                            המודל בונה את התשובה בהדרגה. כל חלק שנוצר מצטרף להקשר ומשפיע על מה שייווצר אחריו. אין תשובה
                            שלמה ששמורה וממתינה.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════ הסבר פשוט ════════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="headsup" line="בנייה היא לא אימות" width={155} flip />
                </div>
                <div className="rounded-2xl border border-violet-500/30 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 text-sm font-bold text-slate-100">מה כדאי לקחת מהפרק</div>
                    <ul className="space-y-2">
                        {TAKEAWAYS.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
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
                <div className="rounded-2xl border border-violet-500/40 bg-slate-900/60 p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <Lock size={20} className="text-violet-300" />
                        <h3 className="text-xl font-bold text-white">נעילת הבנה</h3>
                    </div>

                    <div className="rounded-xl border border-slate-700/50 bg-slate-950/30 p-4">
                        <UnderstandingLock />
                    </div>
                </div>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir="rtl">
                <AssessmentEngine {...behindAiChapterQuizzes[5]} />
            </section>
        </ChapterLayout>
    );
}
