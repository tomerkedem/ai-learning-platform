"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Dices, MousePointerClick, Scale, FlaskConical, Lightbulb, Lock, CheckCircle2, XCircle, Database, Globe, Copy } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { ChapterQuiz } from '../ChapterQuiz';
import { InsightBox } from '@/components/content/InsightBox';

import { DiscoveryGuess, type DiscoveryGuessContent, type DiscoveryGuessCard } from '@/components/ai-internals/DiscoveryGuess';
import { ContinuationLab } from '@/components/ai-internals/ContinuationLab';
import { Mentor } from '@/components/ai-internals/Mentor';
import { CONTINUATION_SCENARIOS } from './continuationScenarios';

/* ════════════════════════ ניחוש הפתיחה ════════════════════════ */

const GUESS_CONTENT: DiscoveryGuessContent = {
    eyebrow: 'ניחוש מהיר · הלב ההסתברותי',
    title: 'מה המודל עושה ברגע שהוא צריך להמשיך תשובה?',
    subtitle: 'בחרו את ההסבר שנראה לכם הקרוב ביותר. אין כאן ציון, יש כיוון אחד שמתאר מה באמת קורה.',
    invite: 'לפני שנפתח את זה, נסו לנחש מה קורה רגע לפני שהמודל כותב את ההמשך.',
    invitePose: 'think',
    getsRightLabel: 'מה זה תופס נכון',
    revealButton: 'חשפו את הרעיון המרכזי',
    revealTitle: 'אז מה באמת קורה?',
    revealCopy:
        'המודל לא שולף תשובה מוכנה. הוא מעריך כמה המשכים אפשריים, נותן לכל אחד משקל סבירות לפי הקלט, ההקשר והדפוסים שלמד, ובוחר את מה שנראה מתאים. הדבר החשוב: המשך עם משקל גבוה הוא הסביר ביותר בעיני המודל, לא בהכרח הנכון בעולם.',
    revealPose: 'pointdown',
    cta: 'בואו נראה את זה במעבדה',
    ctaTargetId: 'continuations-lab',
    resetButton: 'בחרו מחדש',
    exploreHint: 'אפשר לבחור גם אפשרות אחרת ולראות איך היא נשמעת.',
};

const GUESS_CARDS: DiscoveryGuessCard[] = [
    {
        id: 'shelf',
        title: 'שולף תשובה מוכנה',
        desc: 'יש לו מאגר תשובות, והוא מוציא משם את המתאימה.',
        icon: Database,
        statusLabel: 'טעות נפוצה',
        statusTone: 'common',
        mentorPose: 'reassure',
        getsRight: 'ההרגשה הזו טבעית, כי התשובה חוזרת מהר ובביטחון.',
        missesLabel: 'מה זה מפספס',
        misses: 'אין מדף תשובות. המודל בונה את ההמשך תוך הערכת אפשרויות, ולא מאחזר משפט שמור.',
        bridge: 'לכן אותה שאלה יכולה לקבל ניסוח מעט שונה בכל פעם.',
    },
    {
        id: 'plausible',
        title: 'בוחר המשך שנראה סביר',
        desc: 'מעריך כמה אפשרויות ונותן לכל אחת משקל לפי הקלט וההקשר.',
        icon: Scale,
        statusLabel: 'בחרת נכון',
        statusTone: 'precise',
        mentorPose: 'correct',
        getsRight: 'בדיוק. המודל לא מחזיק תשובה אחת מוכנה, אלא מעריך כמה המשכים ונותן לכל אחד משקל סבירות.',
        missesLabel: 'מה נשאר לראות',
        misses: 'נראה במעבדה איך שינוי קטן בקלט מזיז את המשקלים בין ההמשכים.',
        bridge: 'המשקל נקבע מהקלט וההקשר, ולכן אותו צורך מנוסח אחרת יכול להוביל להמשך אחר.',
    },
    {
        id: 'web',
        title: 'בודק באינטרנט מה נכון',
        desc: 'מאמת מול מקור חיצוני לפני שהוא עונה.',
        icon: Globe,
        statusLabel: 'לא השלב הזה',
        statusTone: 'layer',
        mentorPose: 'headsup',
        getsRight: 'נכון שלפעמים צריך לאמת מול העולם.',
        missesLabel: 'מה זה מפספס',
        misses: 'בדיקה במקור חיצוני היא שכבה אחרת, של כלים. בשלב ההמשך עצמו המודל נשען על הקלט, ההקשר והדפוסים שלמד.',
        bridge: 'אימות חיצוני נכנס לתמונה רק כשהמערכת מחוברת לכלי שמחזיר מידע.',
    },
    {
        id: 'copy',
        title: 'מעתיק את המשפטים הדומים מהאימון',
        desc: 'מוצא את הדוגמה הכי דומה ומשכפל אותה.',
        icon: Copy,
        statusLabel: 'נכון חלקית',
        statusTone: 'partial',
        mentorPose: 'think',
        getsRight: 'יש בזה גרעין אמת, המודל אכן נשען על דפוסים שלמד מהרבה טקסט.',
        missesLabel: 'מה זה מפספס',
        misses: 'זה לא העתק הדבק של משפט קיים. הדפוסים מאפשרים לו להרכיב המשך חדש, לא לשלוף ציטוט.',
        bridge: 'דפוסים שנלמדו הם לא מאגר ציטוטים, הם תחושת סבירות.',
    },
];

/* ════════════════════════ נעילת הבנה: שאלת סיווג ════════════════════════ */

const LOCK_CONTINUATION = 'בדקו את מספר המעקב';
const LOCK_OPTIONS = [
    'שהוא בוודאי נכון',
    'שהוא הסביר ביותר לפי הקלט וההקשר',
    'שהוא הועתק מהאינטרנט',
    'שהוא הגיע מבדיקה בכלי חיצוני',
];
const LOCK_CORRECT = 1;

const UnderstandingLock: React.FC = () => {
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;

    return (
        <div dir="rtl" className="text-right">
            <p className="mb-3 text-sm font-bold text-slate-200">
                במעבדה, ההמשך &quot;{LOCK_CONTINUATION}&quot; קיבל את המשקל הגבוה ביותר. מה נכון לזכור עליו?
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
                    משקל גבוה אומר שההמשך הוא הסביר ביותר בעיני המודל לפי מה שנכתב. זו לא הבטחה שהוא נכון, לא ציטוט
                    מהאינטרנט ולא תוצאה של בדיקה חיצונית. כדי לאמת מול העולם צריך מקור או כלי.
                </motion.p>
            )}
        </div>
    );
};

export default function BehindTheScenesChapter4() {
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
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-purple-500/30 mb-5">
                            <Dices size={14} className="text-purple-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-purple-300">Behind the Scenes · 08</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                            המודל לא שולף תשובה.{' '}
                            <span className="bg-gradient-to-l from-purple-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                                הוא בונה אותה צעד אחר צעד.
                            </span>
                        </h1>

                        <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                            קל לחשוב שהמודל יודע את התשובה ושולף אותה מוכנה. בפועל הוא מעריך כמה המשכים אפשריים, נותן לכל
                            אחד משקל סבירות לפי הקלט וההקשר, ובוחר את מה שנראה מתאים. בפרק הזה נראה איך נראית ההערכה הזו,
                            ולמה המשך סביר הוא לא בהכרח המשך נכון.
                        </p>

                        <p className="mt-4 text-base font-bold text-purple-200">אם אפשר להמשיך בכמה דרכים, למה המודל בוחר דווקא בזו?</p>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-purple-400" /> בחרו ניסוח וראו את ההמשכים
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Scale size={14} className="text-emerald-400" /> הוסיפו הקשר וראו את המשקלים זזים
                            </span>
                        </div>
                    </div>
                </motion.section>

                {/* המנטור מציג שזו הערכה הסתברותית (xl+, מימין) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="plausiblePaths" line="המודל מעריך, לא יודע" width={165} />
                </div>
            </div>

            {/* ══════════ ניחוש פתיחה ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <DiscoveryGuess content={GUESS_CONTENT} cards={GUESS_CARDS} />
            </section>

            {/* ══════════ רגע ה-wow ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <InsightBox type="intuition" title="הנקודה המפתיעה">
                    <span className="block text-lg font-bold text-purple-200">
                        המשך סביר הוא לא המשך נכון. הוא רק האפשרות שהמודל מעריך כמתאימה ביותר כרגע.
                    </span>
                    המודל מדרג המשכים לפי הקלט, ההקשר והדפוסים שלמד, ובוחר את הסביר ביותר. סבירות גבוהה אומרת שההמשך
                    מתאים למה שנכתב, היא לא בודקת אם הוא נכון בעולם. לכן תשובה יכולה להישמע בטוחה לחלוטין ועדיין להחמיץ
                    את המציאות.
                </InsightBox>
            </section>

            {/* ══════════ מעבדת ההמשכים הסבירים ══════════ */}
            <section id="continuations-lab" className="relative mt-12 space-y-5 text-right scroll-mt-24" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-purple-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-purple-400">Continuation Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת ההמשכים הסבירים</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    אותה בקשה, כמה המשכים אפשריים. כל המשך מקבל משקל סבירות לפי מה שכתוב. הוסיפו פרט הקשר אחד, וראו איך
                    המשקלים זזים. שימו לב: ההמשך עם המשקל הגבוה ביותר הוא הסביר ביותר, לא בהכרח הנכון.
                </div>

                <ContinuationLab scenarios={CONTINUATION_SCENARIOS} defaultId="action-request" />

                {/* המנטור מסביר שהמשקל זז עם ההקשר (xl+, משמאל) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="explain" line="אותו צורך, משקל אחר" width={160} />
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
                        כששומעים חצי משפט, אפשר לנחש לאן הוא הולך. ההמשך שעולה לנו בראש הוא הסביר, אבל לא תמיד הנכון. אצל
                        המודל זה דומה, רק בקנה מידה ענק ולפי דפוסים שלמד מהרבה טקסט.
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
                        <p className="leading-relaxed text-slate-300">&quot;המודל בוחר את התשובה הזו כי היא הנכונה.&quot;</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-emerald-200">
                            <CheckCircle2 size={18} />
                            <span className="text-sm font-bold">איך זה באמת עובד</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">
                            המודל בוחר המשך שנראה מתאים לפי הקלט וההקשר. משקל סבירות גבוה הוא לא הוכחת אמת.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════ הסבר פשוט ════════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="rounded-2xl border border-purple-500/30 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 text-sm font-bold text-slate-100">מה כדאי לקחת מהפרק</div>
                    <ul className="space-y-2">
                        {[
                            'המודל מעריך כמה המשכים אפשריים, הוא לא שולף תשובה מוכנה.',
                            'הקלט וההקשר מזיזים את המשקל בין ההמשכים.',
                            'המשך סביר הוא לא בהכרח המשך נכון.',
                            'הדפוסים שנלמדו עוזרים להרכיב תשובה קוהרנטית, אבל הם לא מאגר ציטוטים להעתקה.',
                            'אימות מול העולם דורש כלי או מקור חיצוני, לא רק את ההערכה הפנימית.',
                            'ההסתברות היא חלק מהתהליך, לא כל הסיפור.',
                        ].map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
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
                <div className="rounded-2xl border border-purple-500/40 bg-slate-900/60 p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <Lock size={20} className="text-purple-300" />
                        <h3 className="text-xl font-bold text-white">נעילת הבנה</h3>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">אמת</div>
                            <p className="text-sm leading-relaxed text-slate-200">המודל מעריך המשכים ובוחר את הסביר ביותר.</p>
                        </div>
                        <div className="rounded-xl border border-rose-500/30 bg-rose-950/10 p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-rose-300">טעות</div>
                            <p className="text-sm leading-relaxed text-slate-200">המשקל הגבוה ביותר מוכיח שההמשך נכון.</p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-700/50 bg-slate-950/30 p-4">
                        <UnderstandingLock />
                    </div>
                </div>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir="rtl">
                <ChapterQuiz chapterId={8} />
            </section>
        </ChapterLayout>
    );
}
