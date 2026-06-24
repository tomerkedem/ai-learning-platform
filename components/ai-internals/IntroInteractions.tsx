"use client";

// components/ai-internals/IntroInteractions.tsx
// שני רגעים אינטראקטיביים ייעודיים למבוא של "מאחורי הקלעים של AI".
//
// ── למה הם קיימים ────────────────────────────────────────────────────────────
// המבוא היה פוסטר יפה אך פסיבי: הכול autoplay, הלומד רק צופה. שני הרכיבים כאן
// הופכים אותו ל"מכשיר": (1) רגע ניחוש שמייצר הפתעה רגשית לפני חשיפת 15 השלבים,
// (2) טעימת טוקניזציה חיה על המשפט של הלומד עצמו.
//
// ── כלל היושרה ───────────────────────────────────────────────────────────────
// ערך הליבה של הלומדה הוא ש"כל המספרים מחושבים חי". לכן הרכיבים כאן לא מזייפים
// שום חישוב מודל: הטוקניזציה היא פיצול-טקסט אמיתי בצד-לקוח (ומסויג בכך מפורשות),
// ואין כאן הסתברויות מומצאות. החישוב האמיתי במורד הצינור חי בלאב של פרק 8.

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Sparkles, Check, ArrowDown, RotateCcw, Scissors, Keyboard, Info } from 'lucide-react';

import { Mentor } from './Mentor';

/* ════════════════════════ רגע "נחש לפני שתחשוף" ══════════════════════════ */

// האמת (actual=15) נמצאת בין האפשרויות כדי שאפשר יהיה לנחש אותה ולצדוק. מצורף
// מסיח גבוה ממנה (25) כך שבחירת המספר הגבוה ביותר אינה ניצחון מובטח - צריך לכוון.
const GUESS_OPTIONS = [2, 8, 15, 25];

export const GuessRevealGate: React.FC<{ reduce: boolean; actual?: number }> = ({ reduce, actual = 15 }) => {
    const [guess, setGuess] = useState<number | null>(null);
    const revealed = guess !== null;
    const correct = guess === actual;

    // פידבק מדורג: צדקתם / ניחשתם נמוך מדי / ניחשתם גבוה מדי.
    const subFeedback = correct
        ? 'רוב האנשים מנחשים שניים-שלושה. אתם כבר חושבים כמו מהנדסי מנוע.'
        : guess !== null && guess > actual
          ? `ניחשתם גבוה - מרשים שזיהיתם כמה זה מורכב. המספר המדויק הוא ${actual}.`
          : `רוב האנשים מנחשים נמוך, וזו בדיוק ההפתעה. כל ${actual} השלבים מחכים לכם בהמשך.`;

    return (
        <div
            dir="rtl"
            className="relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-900/60 p-6 text-center backdrop-blur-xl md:p-8"
        >
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[80px]" />

            {/* מנטור מגיב מושתל בכרטיס: think לפני ניחוש → celebrate אם צדק, headsup אם טעה */}
            <div className="pointer-events-none absolute bottom-0 left-4 z-0 hidden lg:block">
                <Mentor pose={!revealed ? 'think' : correct ? 'celebrate' : 'headsup'} width={130} glow={false} />
            </div>

            <div className="relative">
                <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                    <HelpCircle size={14} /> ניחוש מהיר
                </span>
                <h3 className="mb-2 text-xl font-black text-white md:text-3xl">
                    כמה שלבים מתרחשים בין הקלט לתשובה?
                </h3>
                <p className="mx-auto mb-6 max-w-xl text-sm text-slate-400 md:text-base">
                    מבחוץ ראינו שני שלבים: (כתבנו, קיבלנו). כמה באמת קורים מאחורי הקלעים? נחשו לפני שנפתח את המכסה.
                </p>

                <div className="flex flex-wrap items-end justify-center gap-3">
                    {GUESS_OPTIONS.map((opt) => {
                        const isGuess = guess === opt;
                        const isAnswer = opt === actual;
                        const state = !revealed ? 'idle' : isAnswer ? 'answer' : isGuess ? 'wrong' : 'dim';
                        return (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => !revealed && setGuess(opt)}
                                disabled={revealed}
                                aria-label={`ניחוש: ${opt} שלבים`}
                                className={[
                                    'relative min-w-[5rem] rounded-2xl border px-6 py-4 text-2xl font-black transition-all',
                                    state === 'idle' && 'cursor-pointer border-slate-700/60 bg-slate-800/40 text-slate-200 hover:scale-105 hover:border-cyan-500/50 hover:bg-cyan-900/15',
                                    state === 'answer' && 'scale-110 border-cyan-400/70 bg-cyan-900/30 text-cyan-200 shadow-[0_0_30px_-6px_rgba(34,211,238,0.6)]',
                                    state === 'wrong' && 'border-rose-500/50 bg-rose-900/20 text-rose-300/80',
                                    state === 'dim' && 'border-slate-700/40 bg-slate-800/20 text-slate-600',
                                ].filter(Boolean).join(' ')}
                            >
                                {opt}
                                {revealed && isAnswer && (
                                    <motion.span
                                        initial={reduce ? false : { scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 15 }}
                                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-slate-950"
                                    >
                                        <Check size={14} strokeWidth={3} />
                                    </motion.span>
                                )}
                                {revealed && isGuess && !isAnswer && (
                                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-rose-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
                                        {guess !== null && guess > actual ? 'גבוה מדי' : 'נמוך מדי'}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence>
                    {revealed && (
                        <motion.div
                            initial={reduce ? false : { opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                        >
                            <div className="mt-8 flex flex-col items-center gap-1.5" role="status" aria-live="polite">
                                <p className="inline-flex items-center gap-2 text-base font-bold text-cyan-300 md:text-lg">
                                    <Sparkles size={16} />
                                    {correct ? `בול! ${actual} שלבים בדיוק.` : `התשובה: ${actual} שלבים.`}
                                </p>
                                <p className="max-w-md text-sm text-slate-400">{subFeedback}</p>

                                <button
                                    type="button"
                                    onClick={() => setGuess(null)}
                                    className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/40 px-4 py-1.5 text-xs font-bold text-slate-300 transition-colors hover:border-cyan-500/50 hover:bg-cyan-900/15 hover:text-cyan-200"
                                >
                                    <RotateCcw size={13} /> נסו שוב
                                </button>

                                {!reduce && <ArrowDown size={18} className="mt-3 animate-bounce text-cyan-400/60" />}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

/* ════════════════════════ טעימת טוקניזציה חיה ════════════════════════════ */

const SAMPLE_SENTENCES = [
    'מה מזג האוויר בתל-אביב?',
    'תכתוב לי שיר קצר על הים',
    'כמה זה 17 כפול 23?',
];

/**
 * פיצול ראשוני להמחשה: לפי רווחים, עם ניתוק סימני פיסוק נגררים לטוקן נפרד.
 * זה *לא* מתיימר להיות הטוקנייזר האמיתי (שחותך גם בתוך מילים) - וזה מסויג בתצוגה.
 */
function tokenize(text: string): string[] {
    const trimmed = text.trim();
    if (!trimmed) return [];
    return trimmed.split(/\s+/).flatMap((word) => {
        const m = word.match(/^(.+?)([?!.,:;]+)$/u);
        return m ? [m[1], m[2]] : [word];
    });
}

export const LiveTokenizeTaste: React.FC<{ reduce: boolean }> = ({ reduce }) => {
    const [text, setText] = useState(SAMPLE_SENTENCES[0]);
    const tokens = useMemo(() => tokenize(text), [text]);

    return (
        <div
            dir="rtl"
            className="rounded-[2rem] border border-cyan-500/30 bg-slate-900/60 p-6 backdrop-blur-xl shadow-[0_0_40px_-12px_rgba(34,211,238,0.35)] md:p-8"
        >
            <div className="mb-5 flex items-center gap-2.5">
                <div className="rounded-xl border border-cyan-500/30 bg-slate-800 p-2">
                    <Scissors className="text-cyan-400" size={18} />
                </div>
                <div>
                    <div className="text-sm font-bold text-white">המשפט שלכם, רגע אחרי שנכנס למנוע</div>
                    <div className="text-xs text-cyan-400/80">טוקניזציה חיה - מחושבת על מה שתכתבו, כאן ועכשיו</div>
                </div>
            </div>

            <div className="relative flex items-center rounded-2xl border border-slate-700/60 bg-slate-950/60 transition-colors focus-within:border-cyan-500/60">
                <Keyboard size={18} className="mr-4 shrink-0 text-cyan-400/70" />
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="כתבו כאן משפט משלכם…"
                    dir="rtl"
                    aria-label="שדה הקלדה לטוקניזציה חיה"
                    className="w-full bg-transparent px-3 py-3.5 text-lg font-medium text-white placeholder:text-slate-600 focus:outline-none"
                />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                {SAMPLE_SENTENCES.map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setText(s)}
                        className="rounded-xl border border-cyan-500/30 bg-cyan-900/10 px-3 py-1.5 text-xs font-bold text-cyan-200/90 transition-colors hover:bg-cyan-900/25"
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">הטוקנים שלכם</span>
                    <span
                        role="status"
                        aria-live="polite"
                        aria-label={`${tokens.length} טוקנים`}
                        className="font-mono text-xs font-bold text-cyan-300"
                        dir="ltr"
                    >
                        {tokens.length} tokens
                    </span>
                </div>
                <div className="flex min-h-[3rem] flex-wrap gap-2">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {tokens.map((tok, i) => (
                            <motion.span
                                key={i}
                                layout
                                initial={reduce ? false : { opacity: 0, scale: 0.6, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 22, delay: Math.min(i * 0.025, 0.3) }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-slate-950/60 px-2.5 py-1.5"
                            >
                                <span className="font-mono text-[9px] text-slate-600">{i + 1}</span>
                                <span className="text-sm font-bold text-cyan-100">{tok}</span>
                            </motion.span>
                        ))}
                    </AnimatePresence>
                    {tokens.length === 0 && (
                        <span className="self-center text-sm text-slate-600">כתבו משהו כדי לראות את הפיצול…</span>
                    )}
                </div>
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-xl border border-white/5 bg-slate-950/40 p-3 text-[11px] leading-relaxed text-slate-400">
                <Info size={13} className="mt-0.5 shrink-0 text-slate-500" />
                <span>
                    זה פיצול ראשוני להמחשה. מודל אמיתי חותך לפעמים גם <span className="font-bold text-slate-300">בתוך</span> מילה
                    (למשל <code dir="ltr" className="text-cyan-300">&quot;תל-אביב&quot; → [&quot;תל&quot;,&quot;-&quot;,&quot;אביב&quot;]</code>), ולכל טוקן נותן מספר מזהה.
                    זה רק <span className="font-bold text-cyan-300">שלב 2 מתוך 15</span> - כל השאר מחכה בהמשך.
                </span>
            </div>
        </div>
    );
};
