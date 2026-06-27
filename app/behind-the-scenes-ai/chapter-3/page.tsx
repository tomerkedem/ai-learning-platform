"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Scissors, MousePointerClick, SplitSquareHorizontal, Layers, Lightbulb, Lock,
    CheckCircle2, Info, Type, Boxes, Brain, Filter,
} from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { ChapterQuiz } from '../ChapterQuiz';
import { InsightBox } from '@/components/content/InsightBox';

import { DiscoveryGuess, type DiscoveryGuessContent, type DiscoveryGuessCard } from '@/components/ai-internals/DiscoveryGuess';
import { TokenizationLab } from '@/components/ai-internals/TokenizationLab';
import { TokenizationRoadmap } from '@/components/ai-internals/TokenizationRoadmap';
import { Mentor } from '@/components/ai-internals/Mentor';

/* ════════════════════════ ניחוש הפתיחה ════════════════════════ */

const GUESS_CONTENT: DiscoveryGuessContent = {
    eyebrow: 'ניחוש מהיר · מה קורה לטקסט',
    title: 'מה קורה לטקסט מיד אחרי שהוא נשלח, עוד לפני שמחושבת משמעות?',
    subtitle: 'בחרו את ההסבר שנראה לכם הכי קרוב. זו לא בחינה, אבל יש כיוון אחד שמקרב אותנו למה שבאמת קורה.',
    invite: 'לפני שנפתח את זה, נסו לנחש: מה הדבר הראשון שקורה לטקסט?',
    invitePose: 'guessThinking',
    getsRightLabel: 'מה זה תופס נכון',
    revealButton: 'חשפו את הרעיון המרכזי',
    revealTitle: 'אז מה באמת קורה?',
    revealCopy:
        'המשפט שכתבתם לא נכנס למודל כמקשה אחת. הוא מתפרק ליחידות עבודה שנקראות טוקנים. טוקן יכול להיות מילה, חלק ממילה, סימן פיסוק, מספר או רצף תווים, תלוי בטוקנייזר. רק מהיחידות האלה מתחיל כל עיבוד.',
    revealPose: 'pointdown',
    cta: 'בואו נראה איך משפט מתפרק',
    ctaTargetId: 'token-lab',
    resetButton: 'בחרו מחדש',
    exploreHint: 'אפשר לבחור גם אפשרות אחרת ולראות איך היא נשמעת.',
};

const GUESS_CARDS: DiscoveryGuessCard[] = [
    {
        id: 'as-is',
        title: 'הטקסט נכנס כמו שהוא',
        desc: 'המודל מקבל את המשפט השלם ומתחיל להבין אותו ישר.',
        icon: Type,
        statusLabel: 'טעות נפוצה',
        statusTone: 'common',
        mentorPose: 'reassure',
        getsRight: 'טבעי לחשוב כך, כי ככה אנחנו קוראים משפט.',
        missesLabel: 'מה זה מפספס',
        misses: 'אבל לפני כל הבנה, המשפט מתפרק ליחידות קטנות יותר. המודל לא מתחיל מהמשפט השלם.',
        bridge: 'הפירוק הזה הוא נקודת הכניסה לכל מה שקורה אחר כך.',
    },
    {
        id: 'tokens',
        title: 'הטקסט מתפרק ליחידות (טוקנים)',
        desc: 'המשפט נשבר לחלקים קטנים, ורק מהם מתחיל עיבוד.',
        icon: Boxes,
        statusLabel: 'בחרת נכון',
        statusTone: 'precise',
        mentorPose: 'correct',
        getsRight: 'בדיוק. השלב הראשון הוא פירוק לטוקנים, עוד לפני חישוב משמעות.',
        missesLabel: 'מה נשאר לראות',
        misses: 'נראה שטוקן הוא לא תמיד מילה שלמה, ושפיסוק, מספרים ורווחים משנים את הפירוק.',
        bridge: 'מהיחידות האלה ייבנה כל מה שבא בהמשך.',
    },
    {
        id: 'meaning',
        title: 'המודל קופץ ישר למשמעות',
        desc: 'המודל מבין את הכוונה לפני שהוא עושה משהו עם המילים.',
        icon: Brain,
        statusLabel: 'לא השלב הזה',
        statusTone: 'layer',
        mentorPose: 'headsup',
        getsRight: 'נכון שבסוף נבנית משמעות.',
        missesLabel: 'מה זה מפספס',
        misses: 'אבל המשמעות מגיעה אחרי הפירוק, היא לא הצעד הראשון. קודם צריך יחידות לעבוד איתן.',
        bridge: 'המשמעות נבנית על גבי הטוקנים, לא במקומם.',
    },
    {
        id: 'important',
        title: 'רק המילים החשובות נשמרות',
        desc: 'המודל מסנן מראש ומשאיר את מה שחשוב.',
        icon: Filter,
        statusLabel: 'נכון חלקית',
        statusTone: 'partial',
        mentorPose: 'think',
        getsRight: 'באמת לא כל יחידה תשפיע באותה מידה בהמשך.',
        missesLabel: 'מה זה מפספס',
        misses: 'אבל בשלב הפירוק כל הטקסט הופך ליחידות, שום דבר לא נזרק. שקלול החשיבות קורה הרבה אחר כך.',
        bridge: 'קודם הכול הופך ליחידות, ורק בהמשך נקבע למה לשים לב.',
    },
];

/* ════════════════════════ נעילת הבנה: שאלת סיווג פעילה ════════════════════════ */

const LOCK_OPTIONS = [
    'הוספת פיסוק, למשל סימני קריאה',
    'הוספת מספר, למשל מספר מעקב',
    'הסרת הרווחים בין המילים',
    'מעבר משפה אחת לאחרת',
    'כל התשובות נכונות',
];
const LOCK_CORRECT = 4;

const LockQuestion: React.FC = () => {
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;
    const correct = choice === LOCK_CORRECT;

    return (
        <div dir="rtl" className="text-right">
            <p className="mb-3 text-sm font-bold text-slate-200">איזה שינוי בטקסט צפוי להשפיע על הפירוק לטוקנים?</p>

            <div className="grid gap-2 sm:grid-cols-2">
                {LOCK_OPTIONS.map((opt, i) => {
                    const isCorrect = i === LOCK_CORRECT;
                    const isChosen = i === choice;
                    let cls = 'border-slate-700/50 bg-slate-950/30 text-slate-300 hover:border-slate-600';
                    if (answered && isChosen && isCorrect) cls = 'border-emerald-400/70 bg-emerald-900/25 text-emerald-100';
                    else if (answered && isChosen && !isCorrect) cls = 'border-amber-400/70 bg-amber-900/20 text-amber-100';
                    else if (answered && isCorrect) cls = 'border-emerald-400/50 bg-emerald-900/15 text-emerald-100';
                    return (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setChoice(i)}
                            className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${cls} ${i === LOCK_CORRECT ? 'sm:col-span-2' : ''}`}
                        >
                            <span dir="rtl">{opt}</span>
                            {answered && isCorrect && <CheckCircle2 size={16} className="shrink-0 text-emerald-300" />}
                            {answered && isChosen && !isCorrect && <Info size={16} className="shrink-0 text-amber-300" />}
                        </button>
                    );
                })}
            </div>

            {answered && (
                <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`mt-4 rounded-xl border p-3 text-sm leading-relaxed text-slate-200 ${correct ? 'border-emerald-500/30 bg-emerald-950/15' : 'border-amber-500/30 bg-amber-950/15'}`}
                >
                    {correct
                        ? 'נכון. פיסוק, מספרים, רווחים והשפה שבה כתבנו, כולם משנים את אופן הפירוק לטוקנים. הפירוק רגיש לצורת הכתיבה, לא רק למשמעות.'
                        : 'זה באמת משפיע, אבל זו לא התשובה השלמה. גם פיסוק, גם מספרים, גם הסרת רווחים וגם מעבר שפה משנים את הפירוק. הבחירה המדויקת היא שכל התשובות נכונות.'}
                </motion.p>
            )}
        </div>
    );
};

export default function BehindTheScenesChapter3() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={3}>

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
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 03</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        המשפט לא נכנס כמקשה אחת.{' '}
                        <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                            הוא מתפרק ליחידות.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        מה שנראה לנו כמו משפט שלם, נכנס למודל כרצף של יחידות עבודה. לפני שמתחיל חישוב של משמעות,
                        הטקסט מתפרק לחלקים קטנים שנקראים טוקנים. הקלידו משפט, וראו אותו נשבר ליחידות שנכנסות למנוע בזו אחר זו.
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
              <Mentor pose="token" line="קודם מפרקים, אז מבינים" width={165} />
            </div>
            </div>

            {/* ══════════ ניחוש פתיחה ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <DiscoveryGuess content={GUESS_CONTENT} cards={GUESS_CARDS} />
            </section>

            {/* ══════════ רגע ה-wow ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <InsightBox type="intuition" title="הנקודה המפתיעה">
                    <span className="block text-lg font-bold text-violet-200">
                        בעיניים שלנו זה משפט אחד. למודל זו שרשרת של יחידות.
                    </span>
                    אותו רעיון יכול להפוך למספר שונה של יחידות עבודה. רווחים, פיסוק, מספרים והשפה שבה כתבנו משנים את הפירוק.
                    הפירוק הזה אינו הבנה, הוא רק ההמרה הראשונה מטקסט למשהו שאפשר לעבד.
                </InsightBox>
            </section>

            {/* ══════════ Tokenization Lab ══════════ */}
            <section id="token-lab" className="relative mt-12 space-y-5 text-right scroll-mt-24" dir="rtl">
                <div className="flex items-center gap-3">
                    <Layers size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Tokenization Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת הפירוק לטוקנים</h3>
                    </div>
                </div>

                {/* פתיחה לימודית לפני המעבדה */}
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    נראה את השלב שקורה עוד לפני כל חישוב: פירוק הטקסט ליחידות. בחרו ניסוי מהיר או הקלידו משפט משלכם,
                    ושימו לב מה משתנה כשמוסיפים סימן קריאה, מספר מעקב, מורידים רווחים או עוברים לאנגלית. כל יחידה מקבלת
                    תפקיד וצבע, וגם סימני פיסוק ומספרים נחשבים יחידות בפני עצמן.
                </div>

                <TokenizationLab />
                {/* מנטור מעבדת הטוקנים: מסדר רצועת טוקנים (xl+, משמאל) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="tokenRibbon" line="כל טוקן - יחידת עבודה" width={160} />
                </div>
            </section>

            {/* ══════════ מפת דרכים ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <TokenizationRoadmap />
            </section>

            {/* ══════════ דוגמה יומיומית ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 flex items-center gap-2">
                        <Lightbulb size={18} className="text-amber-300" />
                        <div className="text-sm font-bold text-slate-100">רגע מהחיים</div>
                    </div>
                    <p>
                        משפט שנכנס למערכת דומה לרצף מדבקות שמוזן למכונה. לפני שקוראים משהו, הרצף נחתך קודם למדבקות נפרדות,
                        ורק אז אפשר לטפל בכל חלק בנפרד. החיתוך אינו ההבנה, הוא רק מה שמאפשר להתחיל לעבוד.
                    </p>
                </div>
            </section>

            {/* ══════════ תיקון טעות נפוצה ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-rose-200">
                            <Info size={18} />
                            <span className="text-sm font-bold">טעות נפוצה</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">&quot;המודל קורא מילים בדיוק כמונו.&quot;</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-emerald-200">
                            <CheckCircle2 size={18} />
                            <span className="text-sm font-bold">איך זה באמת עובד</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">
                            המודל עובד עם יחידות שנקראות טוקנים. לפעמים טוקן הוא מילה שלמה, לפעמים חלק ממילה, ולפעמים סימן או מספר.
                            הפירוק נקבע על ידי הטוקנייזר, ויכול להשתנות בין מודלים.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════ הסבר פשוט ════════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="rounded-2xl border border-violet-500/30 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 text-sm font-bold text-slate-100">מה כדאי לקחת מהפרק</div>
                    <ul className="space-y-2">
                        {[
                            'טוקניזציה היא השלב שמפרק טקסט ליחידות שאפשר לעבד.',
                            'טוקן יכול להיות מילה, חלק ממילה, סימן פיסוק, מספר או רצף תווים.',
                            'הפירוק תלוי בטוקנייזר, ולכן אותו טקסט יכול להתפרק אחרת במודלים שונים.',
                            'הפירוק משפיע על אורך הקלט, על העלות, על ניצול חלון ההקשר ועל מה שייכנס לשלבים הבאים.',
                            'טוקניזציה אינה הבנה. היא רק ההמרה הראשונה מטקסט למשהו שהמערכת יכולה לעבד.',
                        ].map((line) => (
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

                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">אמת</div>
                            <p className="text-sm leading-relaxed text-slate-200">המשפט מתפרק ליחידות לפני עיבוד עמוק.</p>
                        </div>
                        <div className="rounded-xl border border-rose-500/30 bg-rose-950/10 p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-rose-300">טעות</div>
                            <p className="text-sm leading-relaxed text-slate-200">המשפט נכנס למודל כמקשה אחת, והמודל קורא אותו כמונו.</p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-700/50 bg-slate-950/30 p-4">
                        <LockQuestion />
                    </div>
                </div>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-12 mb-4" dir="rtl">
                <ChapterQuiz chapterId={3} />
            </section>
        </ChapterLayout>
    );
}
