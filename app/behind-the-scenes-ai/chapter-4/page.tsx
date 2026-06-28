"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles, MousePointerClick, ArrowLeftRight, Lock, ArrowLeft, CheckCircle2, Info, ChevronDown, Wrench, Type, HelpCircle, ArrowDown, RotateCcw, type LucideIcon } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { ChapterQuiz } from '../ChapterQuiz';
import { InsightBox } from '@/components/content/InsightBox';
import { Mentor } from '@/components/ai-internals/Mentor';
import { WordToNumberLab } from '@/components/ai-internals/WordToNumberLab';
import { UniversalMeaningDemo } from './components/UniversalMeaningDemo';
import { EmbeddingExperienceLab } from './components/EmbeddingExperienceLab';

/* ════════════════════ טקסטים עבריים (פרק עברי בלבד בשלב זה) ════════════════════ */
// המחרוזות הארוכות יושבות כאן ומרונדרות דרך {} כדי לשמור JSX נקי ולמנוע אזהרות
// unescaped entities. אין שימוש בתו מקף ארוך או מקף בינוני.

const HERO_LEDE =
    'שני משפטים יכולים להשתמש במילים שונות לגמרי ובכל זאת להתכוון כמעט לאותו דבר. כדי לזהות את זה, המודל צריך דרך להשוות משמעות, לא רק להתאים מילים. Embedding הוא הייצוג המספרי שמאפשר למדוד עד כמה שני משפטים קרובים במשמעות.';

const BRIDGE =
    'עכשיו נשתמש באותו רעיון על משפטים: גם אם המילים שונות, המשמעות יכולה להיות קרובה.';

const LOCK_Q = 'שני משפטים יצאו קרובים מאוד במשמעות. מה זה אומר?';
const LOCK_OPTIONS = ['שהמשמעות שלהם קרובה', 'ששניהם נכונים במציאות', 'שהם בעצם אותו משפט'];
const LOCK_CORRECT = 0;
const LOCK_OK =
    'בדיוק. קרבה כאן אומרת שהמשמעות דומה, לא שמשהו נכון. Embedding משווה משמעות, הוא לא בודק מה קרה בעולם.';
const LOCK_NO =
    'כמעט. קרבה אומרת רק שהמשמעות דומה. היא לא מאמתת שמשהו נכון, וגם לא הופכת שני משפטים לאחד.';

const PRACTICAL_LEAD = 'קרבה במשמעות היא כלי עוצמתי, וזה בדיוק מה שמפעיל הרבה ממה שאתם כבר מכירים.';
const PRACTICAL_USES = [
    'חיפוש סמנטי ושליפת מקורות, הבסיס של RAG',
    'סיווג טקסט וזיהוי כוונה',
    'קיבוץ פניות דומות במוקד שירות',
    'החלטות של Agent לפי קרבת משמעות',
];
const PRACTICAL_CAVEAT =
    'אבל קרבה היא לא אמת. Embedding משווה משמעות, הוא לא בודק אם משהו נכון ולא מבין כמו אדם. לכן לפעולה רגישה צריך מקור או בדיקה, לא רק קרבה.';
const MATH_LINK =
    'רוצים את המתמטיקה של הקרבה הזו לעומק? הפרק וקטורים, הלב של כל מודל, בלומדת המתמטיקה האינטואיטיבית';

const HOOD_INTRO =
    'רוצים לראות את השלב הטכני שמתחת לקרבה? כל מילה מקבלת Token ID, ומרצף ה-IDs נבנה וקטור משמעות. זה הפרופיל המספרי שקובע כמה שני משפטים קרובים במשמעות.';

/* ════════════════════ נחש: חיזוי עם מצב הצלחה/טעות ברור (בהשראת דפוס פרק 3) ════════════════════ */

const GUESS_PROMPT = '"החבילה לא הגיעה" מול "המשלוח לא נמסר"';
const GUESS_INVITE = 'חשבו על המשמעות, לא על המילים, ואז בחרו.';
const GUESS_SUCCESS_EXPLAIN =
    'שתי הפניות משתמשות במילים שונות, אבל הן מתארות כמעט את אותה בעיה: חבילה שלא הגיעה או לא נמסרה. לכן Embedding מודד אותן כקרובות במשמעות.';
const GUESS_SUCCESS_INSIGHT = 'המודל לא מחפש רק מילים זהות. הוא מחפש דמיון במשמעות.';

interface GuessOption {
    id: string;
    title: string;
    desc: string;
    icon: LucideIcon;
    correct: boolean;
    /** הסבר תומך כשהבחירה שגויה. */
    why?: string;
}

const GUESS_OPTIONS: GuessOption[] = [
    {
        id: 'close',
        title: 'כן, קרובות',
        desc: 'אותה כוונה, גם בלי מילים משותפות',
        icon: Sparkles,
        correct: true,
    },
    {
        id: 'far',
        title: 'לא, רחוקות',
        desc: 'מילים שונות, אז משמעות שונה',
        icon: ArrowLeftRight,
        correct: false,
        why: 'הגיוני לחשוב כך, כי אין ביניהן אף מילה משותפת. אבל Embedding לא משווה מילים אלא משמעות, ואותה כוונה נשארת קרובה גם במילים אחרות.',
    },
    {
        id: 'letters',
        title: 'תלוי במילים המשותפות',
        desc: 'צריך מילים זהות כדי להיות קרוב',
        icon: Type,
        correct: false,
        why: 'זו אינטואיציה של חיפוש מילולי. אבל קרבה במשמעות לא נמדדת לפי מילים משותפות, אלא לפי המשמעות עצמה.',
    },
];

const scrollToProximity = (smooth: boolean) => {
    const el = typeof document !== 'undefined' ? document.getElementById('proximity-demo') : null;
    if (el) el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
};

const MeaningGuess: React.FC = () => {
    const reduce = useReducedMotion();
    const [chosenId, setChosenId] = useState<string | null>(null);
    const chosen = GUESS_OPTIONS.find((o) => o.id === chosenId) ?? null;
    const answered = chosen !== null;
    const correct = chosen?.correct ?? false;

    return (
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl md:p-8" dir="rtl">
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[80px]" />

            <div className="relative z-10">
                <div className="text-center">
                    <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400">
                        <HelpCircle size={14} /> ניחוש מהיר
                    </span>
                    <h3 className="mb-2 text-xl font-black text-white md:text-3xl">מילים שונות, אותה כוונה. האם הן קרובות במשמעות?</h3>
                    <p className="mx-auto mb-4 max-w-xl text-sm text-slate-400 md:text-base">שתי פניות למוקד בלי אף מילה משותפת. נחשו לפי המשמעות, לא לפי המילים.</p>
                    <p className="mx-auto mb-6 max-w-xl rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 text-sm font-bold text-slate-200">{GUESS_PROMPT}</p>
                </div>

                {/* מצב לפני בחירה: מנטור מהורהר מזמין + כרטיסים */}
                {!answered && (
                    <>
                        <div className="mb-5 hidden flex-col items-center sm:flex">
                            <Mentor pose="think" width={104} glow={false} />
                            <p className="mt-1 max-w-xs text-center text-[12px] font-medium leading-snug text-slate-400">{GUESS_INVITE}</p>
                        </div>

                        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
                            {GUESS_OPTIONS.map((o) => {
                                const Icon = o.icon;
                                return (
                                    <motion.button
                                        key={o.id}
                                        type="button"
                                        onClick={() => setChosenId(o.id)}
                                        aria-label={`${o.title}. ${o.desc}`}
                                        whileHover={reduce ? undefined : { scale: 1.015 }}
                                        whileTap={reduce ? undefined : { scale: 0.985 }}
                                        className="flex flex-col gap-2.5 rounded-2xl border border-slate-700/60 bg-slate-900/50 p-4 text-start transition-colors hover:border-violet-500/50 hover:bg-violet-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
                                    >
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950/50">
                                            <Icon size={18} className="text-violet-300" />
                                        </span>
                                        <div>
                                            <div className="text-base font-black text-white">{o.title}</div>
                                            <p className="mt-1 text-sm leading-relaxed text-slate-300">{o.desc}</p>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* מצב אחרי בחירה: הצלחה ירוקה ברורה או טעות תומכת בכתום */}
                <AnimatePresence mode="wait">
                    {answered && correct && (
                        <motion.div
                            key="correct"
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="mx-auto max-w-2xl rounded-2xl border border-emerald-400/50 bg-emerald-900/15 p-5 shadow-[0_0_40px_-12px_rgba(16,185,129,0.5)]"
                            role="status"
                            aria-live="polite"
                        >
                            <div className="flex items-start gap-4">
                                <div className="hidden shrink-0 self-center sm:block">
                                    <Mentor pose="celebrate" width={86} glow={false} float={false} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={22} className="text-emerald-300" />
                                        <span className="text-xl font-black text-emerald-200 md:text-2xl">נכון מאוד!</span>
                                    </div>
                                    <p className="mt-3 text-sm leading-relaxed text-slate-200">{GUESS_SUCCESS_EXPLAIN}</p>
                                    <p className="mt-2 border-s-2 border-emerald-400/60 ps-3 text-sm font-bold text-emerald-100">{GUESS_SUCCESS_INSIGHT}</p>
                                    <div className="mt-4 flex flex-wrap items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => scrollToProximity(!reduce)}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-900/25 px-5 py-2 text-sm font-bold text-emerald-100 transition-colors hover:bg-emerald-900/40"
                                        >
                                            המשיכו לתצוגה
                                            {reduce ? (
                                                <ArrowDown size={15} aria-hidden />
                                            ) : (
                                                <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} className="inline-flex" aria-hidden>
                                                    <ArrowDown size={15} />
                                                </motion.span>
                                            )}
                                        </button>
                                        <button type="button" onClick={() => setChosenId(null)} className="text-xs font-bold text-slate-400 transition-colors hover:text-slate-200">
                                            נחשו שוב
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {answered && !correct && (
                        <motion.div
                            key="wrong"
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                            className="mx-auto max-w-2xl rounded-2xl border border-amber-400/45 bg-amber-900/[0.12] p-5"
                            role="status"
                            aria-live="polite"
                        >
                            <div className="flex items-start gap-4">
                                <div className="hidden shrink-0 self-center sm:block">
                                    <Mentor pose="reassure" width={80} glow={false} float={false} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <RotateCcw size={20} className="text-amber-300" />
                                        <span className="text-lg font-black text-amber-200 md:text-xl">נסו שוב</span>
                                    </div>
                                    <p className="mt-3 text-sm leading-relaxed text-slate-200">{chosen?.why}</p>
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setChosenId(null)}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-900/25 px-5 py-2 text-sm font-bold text-amber-100 transition-colors hover:bg-amber-900/40"
                                        >
                                            <RotateCcw size={14} /> נסו שוב
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

/* ════════════════════ נעילת הבנה: קרבה אינה אמת ════════════════════ */

const LockQuestion: React.FC = () => {
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;
    const correct = choice === LOCK_CORRECT;

    return (
        <div dir="rtl" className="text-right">
            <p className="mb-3 text-sm font-bold text-slate-200">{LOCK_Q}</p>

            <div className="grid gap-2 sm:grid-cols-3">
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
                            className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${cls}`}
                        >
                            <span>{opt}</span>
                            {answered && isChosen && isCorrect && <CheckCircle2 size={16} className="shrink-0 text-emerald-300" />}
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
                    className={`mt-4 rounded-xl border p-3 text-sm leading-relaxed text-slate-200 ${
                        correct ? 'border-emerald-500/30 bg-emerald-950/15' : 'border-amber-500/30 bg-amber-950/15'
                    }`}
                >
                    {correct ? LOCK_OK : LOCK_NO}
                </motion.p>
            )}
        </div>
    );
};

/* ════════════════════ העמוד ════════════════════ */

export default function BehindTheScenesChapter4() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={4}>

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
                            <Sparkles size={14} className="text-violet-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 04</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                            איך AI יודע{' '}
                            <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                                ששני משפטים שונים מתכוונים לאותו דבר?
                            </span>
                        </h1>

                        <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">{HERO_LEDE}</p>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-violet-400" /> בחרו אובייקט או משפט וראו מה הכי קרוב אליו
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <ArrowLeftRight size={14} className="text-cyan-400" /> מילים שונות יכולות עדיין להיות קרובות במשמעות
                            </span>
                        </div>
                    </div>
                </motion.section>
                {/* המנטור מציג שהמנוע רואה מספרים (xl+, מימין) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="meaningSpace" line="המנוע רואה מספרים, לא מילים" width={165} />
                </div>
            </div>

            {/* ══════════ נחש ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <MeaningGuess />
            </section>

            {/* ══════════ שלב 1: דמו אובייקטים (הכותרת חיה בתוך הדמו) ══════════ */}
            <section id="proximity-demo" className="mt-12 space-y-5 text-right scroll-mt-[var(--bts-sticky-top,88px)]" dir="rtl">
                <UniversalMeaningDemo />

                {/* ══ שלב 2: גשר מעבר אל המשפטים ══ */}
                <div className="flex items-center gap-3 rounded-2xl border border-cyan-500/25 bg-cyan-900/10 p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-900/20">
                        <ArrowDown size={16} className="text-cyan-300" />
                    </span>
                    <p className="text-[15px] font-semibold leading-relaxed text-slate-100">{BRIDGE}</p>
                </div>
            </section>

            {/* ══════════ שלב 3+4: קרבה במשמעות בין משפטים (הכותרת חיה בתוך המעבדה) ══════════ */}
            <section id="meaning-space" className="mt-12 text-right scroll-mt-[var(--bts-sticky-top,88px)]" dir="rtl">
                <EmbeddingExperienceLab />
            </section>

            {/* ══════════ נעילת הבנה ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="happy" line="קרבה היא לא אמת" width={160} />
                </div>
                <div className="rounded-2xl border border-violet-500/40 bg-slate-900/60 p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <Lock size={20} className="text-violet-300" />
                        <h3 className="text-xl font-bold text-white">נעילת הבנה</h3>
                    </div>
                    <LockQuestion />
                </div>
            </section>

            {/* ══════════ תובנה מעשית ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="pointdown" line="קרוב במשמעות, לא בהכרח נכון" width={160} />
                </div>
                <InsightBox type="intuition" title="מתי Embeddings עוזרים, ומה הם לא">
                    <span className="block">{PRACTICAL_LEAD}</span>
                    <ul className="mt-3 space-y-2">
                        {PRACTICAL_USES.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                <span className="text-sm">{line}</span>
                            </li>
                        ))}
                    </ul>
                    <span className="mt-3 block text-sm text-slate-400">{PRACTICAL_CAVEAT}</span>
                    <Link
                        href="/math/mathIntuitive/chapter-5"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
                    >
                        {MATH_LINK}
                        <ArrowLeft size={14} />
                    </Link>
                </InsightBox>
            </section>

            {/* ══════════ מבט מתחת למכסה המנוע (משני) ══════════ */}
            <details className="group mt-12 overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-right" dir="rtl">
                    <span className="flex items-center gap-2">
                        <Wrench size={18} className="text-slate-400" />
                        <span className="leading-tight">
                            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Under the hood</span>
                            <span className="block text-base font-bold text-slate-200">מבט מתחת למכסה המנוע: ממילים למספרים</span>
                        </span>
                    </span>
                    <ChevronDown size={18} className="shrink-0 text-slate-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="space-y-4 border-t border-slate-700/50 p-5 text-right" dir="rtl">
                    <p className="text-sm leading-relaxed text-slate-400">{HOOD_INTRO}</p>
                    <WordToNumberLab />
                </div>
            </details>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir="rtl">
                <ChapterQuiz chapterId={4} />
            </section>
        </ChapterLayout>
    );
}
