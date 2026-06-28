"use client";

// ────────────────────────────────────────────────────────────────────────
// AttentionGuess - ניחוש הפתיחה של פרק 8 (Attention).
//
// לא מבחן ולא חלק מהניקוד. הלומד בוחר מודל חשיבה אחד מתוך ארבע השערות על איך
// המודל מחליט למה להתייחס. כל בחירה מקבלת סטטוס פדגוגי (קרוב מאוד / נכון חלקית /
// טעות נפוצה / חשוב אבל לא Attention) ומשוב מובנה: מה זה תופס נכון, מה זה מפספס,
// ומשפט גשר. לכל סטטוס פוזת מנטור משלו, שמגיבה למשמעות הבחירה ופונה אל הטקסט.
// אחרי הבחירה נפתחת התובנה הגדולה (בלחיצה), שמובילה אל מעבדת הקשב.
//
// המנטור: פוזה לפי סטטוס, בגודל קטן בתוך פאנל המשוב, פונה אל הטקסט (לא ממנו).
// אין שימוש ב-scaleX flip. אין שינוי בהתנהגות ה-Mentor המשותף.
//
// העיצוב מבוסס על רוח ה-HypothesisGuess של המבוא, אבל זהו רכיב נפרד ועצמאי. אין
// בקובץ הזה מקף ארוך, מקף בינוני או נקודה-פסיק בתוך טקסט עברית.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { HelpCircle, Sparkles, Highlighter, Globe, Check, ArrowDown, RotateCcw } from 'lucide-react';
import { Mentor, type MentorPose } from './Mentor';

type Cue = 'spotlight' | 'highlighter' | 'nodes' | 'factcheck';
type StatusTone = 'close' | 'partial' | 'common' | 'layer';

interface GuessCard {
    id: string;
    title: string;
    desc: string;
    cue: Cue;
    statusLabel: string;
    statusTone: StatusTone;
    mentorPose: MentorPose;
    getsRight: string;
    missesLabel: string;
    misses: string;
    bridge: string;
}

const PROMPT = 'החבילה שלי לא הגיעה, אבל קיבלתי הודעה שהיא נמסרה. מה לעשות?';

const CONTENT = {
    eyebrow: 'ניחוש מהיר · ארבע השערות על Attention',
    title: 'איך המודל מחליט למה להתייחס עכשיו?',
    subtitle:
        'בחרו את ההסבר שנראה לכם הכי קרוב למה שקורה כשהמודל מעבד את המשפט. זו לא בחינה. בחרו את ההשערה שנראית לכם הכי קרובה, ותכף נראה מה היא מגלה.',
    invite: 'יש כאן כמה השערות מפתות. רגע לפני ההסבר, בואו נבחר אחת ונבדוק אותה.',
    getsRightLabel: 'מה זה תופס נכון',
    revealButton: 'חשפו את הרעיון המרכזי',
    resetButton: 'בחרו מחדש',
    revealTitle: 'אז מה באמת קורה?',
    revealCopy:
        'Attention לא מחפש מילה אחת מנצחת, ולא בודק מה נכון בעולם. הוא משנה משקלים בין חלקי המשפט לפי הרגע שבו המודל נמצא. כשצריך לזהות את הבעיה, "לא הגיעה" מקבלת משקל. כשצריך לזהות סתירה, הקשר בין "לא הגיעה" לבין "נמסרה" נהיה חשוב. וכשצריך להציע פעולה, גם "מה לעשות" נכנס חזק יותר לתמונה.',
    cta: 'בואו נראה איך המשקל זז',
} as const;

const STATUS_TONE: Record<StatusTone, string> = {
    close: 'border-emerald-400/40 bg-emerald-900/20 text-emerald-200',
    partial: 'border-sky-400/40 bg-sky-900/20 text-sky-200',
    common: 'border-amber-400/40 bg-amber-900/20 text-amber-200',
    layer: 'border-indigo-400/40 bg-indigo-900/20 text-indigo-200',
};

const CARDS: GuessCard[] = [
    {
        id: 'one-word',
        title: 'מילה אחת מובילה',
        desc: 'המודל מוצא את המילה הכי חשובה במשפט, ונצמד אליה לאורך כל התשובה.',
        cue: 'spotlight',
        statusLabel: 'נכון חלקית',
        statusTone: 'partial',
        mentorPose: 'think',
        getsRight: 'ברגע מסוים מילה כמו "לא הגיעה" או "נמסרה" באמת יכולה לקבל הרבה משקל.',
        missesLabel: 'מה זה מפספס',
        misses: 'Attention לא בוחר מילה מנצחת ונצמד אליה לאורך כל התשובה.',
        bridge: 'ברגע אחר בתשובה, קשר אחר במשפט יכול להפוך לחשוב יותר.',
    },
    {
        id: 'highlight',
        title: 'סימון מילים חשובות',
        desc: 'המודל מסמן את המילים הבולטות, ואז בונה מהן את התשובה.',
        cue: 'highlighter',
        statusLabel: 'טעות נפוצה',
        statusTone: 'common',
        mentorPose: 'reassure',
        getsRight: 'מבחוץ Attention באמת נראה לפעמים כמו הדגשה, אז ההשערה מובנת.',
        missesLabel: 'מה זה מפספס',
        misses: 'הוא לא טוש מדגיש שמסמן מילים פעם אחת.',
        bridge: 'הוא שוקל קשרים בין חלקים במשפט: מה משפיע על מה, ובאיזה רגע.',
    },
    {
        id: 'dynamic',
        title: 'המשקל משתנה לפי הרגע',
        desc: 'בכל שלב בתשובה, חלק אחר במשפט יכול להשפיע יותר על מה שהמודל עושה עכשיו.',
        cue: 'nodes',
        statusLabel: 'בחרת נכון',
        statusTone: 'close',
        mentorPose: 'correct',
        getsRight: 'תפסתם את העיקר. המשקל זז לפי הרגע, ולא נשאר על מילה אחת.',
        missesLabel: 'מה נשאר לראות',
        misses: 'נראה את זה קורה ממש על המשפט שלנו, רגע אחרי רגע.',
        bridge: 'בכל רגע, חלק אחר במשפט יכול לקבל יותר משקל לפי מה שהמודל מעבד עכשיו.',
    },
    {
        id: 'factcheck',
        title: 'בדיקת אמת בעולם',
        desc: 'המודל מתמקד במילים שיעזרו לו לבדוק אם החבילה באמת נמסרה.',
        cue: 'factcheck',
        statusLabel: 'חשוב, אבל לא Attention',
        statusTone: 'layer',
        mentorPose: 'headsup',
        getsRight: 'ההבחנה חשובה. באמת צריך לבדוק אם החבילה נמסרה.',
        missesLabel: 'מה זה מפספס',
        misses: 'אבל זו לא עבודת ה-Attention. הוא לא בודק אם משהו נכון בעולם.',
        bridge: 'Attention יכול לזהות את המתח בין "לא הגיעה" לבין "נמסרה", אבל בדיקה אמיתית דורשת מקור מידע חיצוני או כלי.',
    },
];

/* ── איור-מיקרו לכל השערה. דקורטיבי בלבד (aria-hidden). ── */
function CueIllustration({ cue }: { cue: Cue }) {
    if (cue === 'spotlight') {
        return (
            <div className="flex items-center gap-1" aria-hidden>
                <span className="h-1.5 w-4 rounded-sm bg-slate-600/70" />
                <span className="h-1.5 w-4 rounded-sm bg-slate-600/70" />
                <span className="h-2.5 w-5 rounded-sm bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
            </div>
        );
    }
    if (cue === 'highlighter') {
        return (
            <div className="flex items-center gap-2" aria-hidden>
                <Highlighter size={16} className="text-violet-300" />
                <div className="flex flex-col gap-1">
                    <span className="block h-1.5 w-8 rounded-full bg-violet-500/60" />
                    <span className="block h-1.5 w-5 rounded-full bg-violet-500/40" />
                </div>
            </div>
        );
    }
    if (cue === 'nodes') {
        return (
            <div className="flex items-center" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-slate-500/70" />
                <span className="h-px w-3 bg-slate-600" />
                <span className="h-3 w-3 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.75)]" />
                <span className="h-px w-3 bg-violet-400/70" />
                <span className="h-2 w-2 rounded-full bg-violet-300" />
            </div>
        );
    }
    // factcheck
    return (
        <div className="flex items-center gap-2" aria-hidden>
            <Globe size={18} className="text-slate-300" />
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-500/80">
                <Check size={11} strokeWidth={3} className="text-white" />
            </span>
        </div>
    );
}

export const AttentionGuess: React.FC = () => {
    const reduce = useReducedMotion();
    const [chosenId, setChosenId] = useState<string | null>(null);
    const [revealed, setRevealed] = useState(false);

    const chosen = CARDS.find((c) => c.id === chosenId) ?? null;
    const choiceMade = chosenId !== null;

    const goToLab = () => {
        const el = typeof document !== 'undefined' ? document.getElementById('attention-lab') : null;
        if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };

    // איפוס הניחוש בלבד: מנקה את הבחירה ואת התובנה, ומחזיר למצב שלפני הבחירה
    // (הכרטיסים נשארים, ומנטור ההזמנה חוזר). לא נוגע במעבדה, במבדק או בגלילה.
    const resetGuess = () => {
        setChosenId(null);
        setRevealed(false);
    };

    const cardClasses = (id: string): string => {
        if (id === chosenId) {
            return `border-violet-400/70 bg-violet-900/25 ${reduce ? '' : 'shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)]'}`;
        }
        if (choiceMade) return 'border-white/5 bg-slate-900/40 opacity-70';
        return 'border-slate-700/60 bg-slate-900/50 hover:border-violet-500/50 hover:bg-violet-900/10';
    };

    return (
        <div
            dir="rtl"
            className="relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl md:p-8"
        >
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[80px]" />

            <div className="relative z-10">
                {/* מנטור הזמנה: דמות-צד תומכת, ממורכזת מעל הכותרת ומעל רשת התשובות,
                    כך שלעולם אינה חופפת כרטיס או טקסט. מציגה את האתגר לפני הבחירה
                    ונעלמת ברגע שנבחרת השערה. */}
                {!choiceMade && (
                    <div className="mb-5 hidden flex-col items-center sm:flex">
                        <Mentor pose="think" width={108} glow={false} />
                        <p className="mt-1 max-w-xs text-center text-[12px] font-medium leading-snug text-slate-400">
                            {CONTENT.invite}
                        </p>
                    </div>
                )}
                <div className="text-center">
                    <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400">
                        <HelpCircle size={14} /> {CONTENT.eyebrow}
                    </span>
                    <h3 className="mb-2 text-xl font-black text-white md:text-3xl">{CONTENT.title}</h3>
                    <p className="mx-auto mb-4 max-w-xl text-sm text-slate-400 md:text-base">{CONTENT.subtitle}</p>
                    <p className="mx-auto mb-7 max-w-xl rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 text-sm font-bold text-slate-200">
                        {PROMPT}
                    </p>
                </div>

                {/* רשת 2x2 של כרטיסי השערה */}
                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {CARDS.map((card) => (
                        <motion.button
                            key={card.id}
                            type="button"
                            onClick={() => { setChosenId(card.id); setRevealed(false); }}
                            aria-pressed={card.id === chosenId}
                            aria-label={`${card.title}. ${card.desc}`}
                            whileHover={reduce ? undefined : { scale: 1.015 }}
                            whileTap={reduce ? undefined : { scale: 0.985 }}
                            className={`relative flex flex-col gap-2.5 rounded-2xl border p-4 text-right transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${cardClasses(card.id)}`}
                        >
                            <span className="w-fit rounded-xl border border-white/10 bg-slate-950/50 px-2.5 py-2">
                                <CueIllustration cue={card.cue} />
                            </span>
                            <div>
                                <div className="text-base font-black text-white">{card.title}</div>
                                <p className="mt-1 text-sm leading-relaxed text-slate-300">{card.desc}</p>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* משוב מובנה: סטטוס, מה תופס נכון, מה מפספס, גשר, ומנטור מגיב לפי הסטטוס */}
                <AnimatePresence initial={false}>
                    {chosen && (
                        <motion.div
                            key={chosen.id}
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                            className="mx-auto mt-7 max-w-2xl"
                            role="status"
                            aria-live="polite"
                        >
                            <div className="rounded-2xl border border-violet-400/30 bg-violet-900/15 p-5">
                                <div className="flex items-start gap-4">
                                    {/* המנטור יושב בצד ההתחלה (ימין ב-RTL) ופונה אל הטקסט שמשמאלו */}
                                    <div className="hidden shrink-0 self-center sm:block">
                                        <Mentor pose={chosen.mentorPose} width={68} glow={false} float={false} />
                                    </div>

                                    <div className="flex-1">
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${STATUS_TONE[chosen.statusTone]}`}>
                                            {chosen.statusLabel}
                                        </span>

                                        <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-200">
                                            <p>
                                                <span className="font-bold text-emerald-300">{CONTENT.getsRightLabel}: </span>
                                                {chosen.getsRight}
                                            </p>
                                            <p>
                                                <span className={`font-bold ${chosen.statusTone === 'close' ? 'text-sky-300' : 'text-amber-300'}`}>{chosen.missesLabel}: </span>
                                                {chosen.misses}
                                            </p>
                                            <p className="border-r-2 border-violet-400/50 pr-3 font-medium text-slate-100">
                                                {chosen.bridge}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center gap-3">
                                            {!revealed && (
                                                <button
                                                    type="button"
                                                    onClick={() => setRevealed(true)}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-900/20 px-4 py-1.5 text-sm font-bold text-emerald-200 transition-colors hover:bg-emerald-900/35"
                                                >
                                                    <Sparkles size={14} /> {CONTENT.revealButton}
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={resetGuess}
                                                className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/40 px-4 py-1.5 text-sm font-bold text-slate-300 transition-colors hover:border-violet-500/40 hover:text-violet-200"
                                            >
                                                <RotateCcw size={13} /> {CONTENT.resetButton}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* התובנה הגדולה: נפתחת בלחיצה, מנטור pointdown מוביל אל המעבדה */}
                <AnimatePresence initial={false}>
                    {revealed && (
                        <motion.div
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.35 }}
                            className="mx-auto mt-4 max-w-2xl"
                        >
                            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-5 text-center">
                                <p className="inline-flex items-center gap-2 text-base font-bold text-emerald-200 md:text-lg">
                                    <Sparkles size={16} /> {CONTENT.revealTitle}
                                </p>
                                <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-300">{CONTENT.revealCopy}</p>

                                <div className="mt-4 flex flex-col items-center gap-2">
                                    <div className="hidden sm:block">
                                        <Mentor pose="pointdown" width={72} glow={false} float={false} />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={goToLab}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/50 bg-violet-900/25 px-5 py-2 text-sm font-bold text-violet-100 transition-colors hover:bg-violet-900/40"
                                    >
                                        {CONTENT.cta}
                                        {reduce ? (
                                            <ArrowDown size={15} aria-hidden />
                                        ) : (
                                            <motion.span
                                                animate={{ y: [0, 3, 0] }}
                                                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                                                className="inline-flex"
                                                aria-hidden
                                            >
                                                <ArrowDown size={15} />
                                            </motion.span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
