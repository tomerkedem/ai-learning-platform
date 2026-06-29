"use client";

// ────────────────────────────────────────────────────────────────────────
// OpeningGuess - וריאנט ניחוש-פתיחה עם הכרעה מפורשת (תשובה נכונה / כמעט), באותו
// סטנדרט של ה"ניחוש מהיר" במבוא ובפרק 1: כשבוחרים את הכרטיס המדויק מופיע "נכון
// מאוד!" ברור עם מנטור חוגג, זוהר ופעימת ניצוצות; בבחירה אחרת מופיע משוב תומך
// בכתום עם מנטור מרגיע, מה הבחירה תופסת ומה היא מפספסת, ובחירה מחדש.
//
// הרכיב צורך את אותו מבנה תוכן של DiscoveryGuess (DiscoveryGuessCard), בתוספת שתי
// כותרות הכרעה (correctTitle, wrongTitle), כדי שפרקים שכבר השתמשו ב-DiscoveryGuess
// יוכלו לעבור אליו בלי לשכתב תוכן. הכרטיס המדויק מזוהה לפי statusTone === 'precise'.
//
// אינו עורך את DiscoveryGuess המשותף (שעדיין משמש פרקים אחרים). בלי בועת דיבור
// למנטור. אין מקף ארוך, מקף בינוני או נקודה-פסיק בטקסט עברית.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { HelpCircle, Sparkles, ArrowDown, RotateCcw, CheckCircle2, Check, Lightbulb } from 'lucide-react';
import { Mentor } from './Mentor';
import type { DiscoveryGuessCard, DiscoveryGuessContent } from './DiscoveryGuess';

export interface OpeningGuessContent extends DiscoveryGuessContent {
    /** כותרת הכרעה מפורשת לבחירה הנכונה, למשל "נכון מאוד!". */
    correctTitle: string;
    /** כותרת תומכת לבחירה שאינה המדויקת, למשל "כמעט!". */
    wrongTitle: string;
}

/* פעימת ניצוצות חד-פעמית לרגע ההצלחה (מונפש בלבד; ההורה לא מרנדר ב-reduced-motion). */
function SparkleBurst() {
    const bits = [
        { x: -54, y: -8, s: 13, d: 0 },
        { x: -28, y: -34, s: 10, d: 0.05 },
        { x: 6, y: -40, s: 15, d: 0.02 },
        { x: 40, y: -30, s: 10, d: 0.08 },
        { x: 64, y: -6, s: 12, d: 0.04 },
        { x: 22, y: 8, s: 9, d: 0.1 },
    ];
    return (
        <div className="pointer-events-none absolute start-10 top-6 z-20 text-emerald-300" aria-hidden>
            {bits.map((b, i) => (
                <motion.span
                    key={i}
                    className="absolute"
                    initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.2, 1, 0.6], x: b.x, y: b.y }}
                    transition={{ duration: 0.9, delay: b.d, ease: 'easeOut' }}
                >
                    <Sparkles size={b.s} strokeWidth={2.5} />
                </motion.span>
            ))}
        </div>
    );
}

type CardState = 'idle' | 'correct' | 'wrong' | 'dim';

function cardClasses(state: CardState, reduce: boolean): string {
    switch (state) {
        case 'correct':
            return `border-emerald-400/70 bg-emerald-900/25 ${reduce ? '' : 'shadow-[0_0_40px_-10px_rgba(16,185,129,0.55)]'}`;
        case 'wrong':
            return 'border-amber-400/55 bg-amber-900/[0.18]';
        case 'dim':
            return 'border-white/5 bg-slate-900/40 opacity-60';
        default:
            return 'border-slate-700/60 bg-slate-900/50 hover:border-violet-500/50 hover:bg-violet-900/10';
    }
}

export const OpeningGuess: React.FC<{ content: OpeningGuessContent; cards: DiscoveryGuessCard[] }> = ({ content, cards }) => {
    const reduce = useReducedMotion();
    const [chosenId, setChosenId] = useState<string | null>(null);
    const [revealed, setRevealed] = useState(false); // חשיפת ההסבר המדויק אחרי בחירה שגויה

    const chosen = cards.find((c) => c.id === chosenId) ?? null;
    const correct = chosen?.statusTone === 'precise';
    const preciseCard = cards.find((c) => c.statusTone === 'precise') ?? null;

    const reset = () => { setChosenId(null); setRevealed(false); };

    const goToTarget = () => {
        if (!content.ctaTargetId) return;
        const el = typeof document !== 'undefined' ? document.getElementById(content.ctaTargetId) : null;
        if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };

    const stateFor = (card: DiscoveryGuessCard): CardState => {
        if (!chosen) return 'idle';
        if (card.id === chosenId) return correct ? 'correct' : 'wrong';
        return 'dim';
    };

    return (
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl md:p-8">
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[80px]" />

            <div className="relative z-10">
                {/* מנטור הזמנה: דמות תומכת ממורכזת מעל הכרטיסים, נעלמת אחרי הבחירה */}
                {!chosen && (
                    <div className="mb-5 hidden flex-col items-center sm:flex">
                        <Mentor pose={content.invitePose} width={108} glow={false} />
                        <p className="mt-1 max-w-xs text-center text-[12px] font-medium leading-snug text-slate-400">{content.invite}</p>
                    </div>
                )}

                <div className="text-center">
                    <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400">
                        <HelpCircle size={14} /> {content.eyebrow}
                    </span>
                    <h3 className="mb-2 text-xl font-black text-white md:text-3xl">{content.title}</h3>
                    <p className="mx-auto mb-4 max-w-xl text-sm text-slate-400 md:text-base">{content.subtitle}</p>
                    {content.prompt && (
                        <p className="mx-auto mb-7 max-w-xl rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 text-sm font-bold text-slate-200">{content.prompt}</p>
                    )}
                </div>

                {/* רשת 2x2 של כרטיסי ההשערה */}
                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {cards.map((card, i) => {
                        const state = stateFor(card);
                        const Icon = card.icon;
                        return (
                            <motion.button
                                key={card.id}
                                type="button"
                                onClick={() => { setChosenId(card.id); setRevealed(false); }}
                                aria-pressed={card.id === chosenId}
                                aria-label={`${card.title}. ${card.desc}`}
                                whileHover={reduce ? undefined : { scale: 1.015 }}
                                whileTap={reduce ? undefined : { scale: 0.985 }}
                                className={`relative flex flex-col gap-2.5 rounded-2xl border p-4 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${cardClasses(state, !!reduce)}`}
                            >
                                {!reduce && state === 'correct' && (
                                    <motion.span
                                        aria-hidden
                                        className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-emerald-400/60"
                                        initial={{ opacity: 0.85, scale: 1 }}
                                        animate={{ opacity: 0, scale: 1.04 }}
                                        transition={{ duration: 0.7, ease: 'easeOut' }}
                                    />
                                )}
                                <div className="flex items-center justify-between gap-2">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950/50">
                                        {Icon ? (
                                            <Icon size={18} className="text-violet-300" />
                                        ) : (
                                            <span className="font-mono text-sm font-bold text-violet-300" dir="ltr">{i + 1}</span>
                                        )}
                                    </span>
                                    {state === 'correct' && (
                                        <motion.span
                                            initial={reduce ? false : { scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 15 }}
                                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-slate-950"
                                        >
                                            <Check size={14} strokeWidth={3} />
                                        </motion.span>
                                    )}
                                </div>
                                <div>
                                    <div className="text-base font-black text-white">{card.title}</div>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-300">{card.desc}</p>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* משוב מפורש: הצלחה ירוקה ברורה או טעות תומכת בכתום */}
                <AnimatePresence initial={false}>
                    {chosen && (
                        <motion.div
                            key={correct ? 'correct' : 'wrong'}
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.35 }}
                            className="mx-auto mt-7 max-w-2xl"
                            role="status"
                            aria-live="polite"
                        >
                            {correct ? (
                                <div className={`relative overflow-hidden rounded-2xl border border-emerald-400/55 bg-gradient-to-b from-emerald-900/30 to-emerald-950/10 p-5 md:p-6 ${reduce ? '' : 'shadow-[0_0_55px_-12px_rgba(16,185,129,0.55)]'}`}>
                                    {!reduce && <SparkleBurst />}
                                    <div className="relative flex items-start gap-4">
                                        <div className="hidden shrink-0 self-center sm:block">
                                            <Mentor key={chosen.mentorPose} pose={chosen.mentorPose} width={88} glow={false} float={false} />
                                        </div>
                                        <div className="flex-1 text-start">
                                            <div className="flex items-center gap-2">
                                                <motion.span
                                                    initial={reduce ? false : { scale: 0, rotate: -25 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 14 }}
                                                    className="inline-flex"
                                                >
                                                    <CheckCircle2 size={24} className="text-emerald-300" />
                                                </motion.span>
                                                <span className="text-xl font-black text-emerald-100 md:text-2xl">{content.correctTitle}</span>
                                            </div>
                                            <p className="mt-2 text-sm leading-relaxed text-slate-200">{chosen.getsRight}</p>
                                            <p className="mt-3 border-s-2 border-emerald-400/60 ps-3 text-sm font-bold text-emerald-100">{content.revealCopy}</p>
                                            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2.5">
                                                {content.ctaTargetId && (
                                                    <button
                                                        type="button"
                                                        onClick={goToTarget}
                                                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-900/25 px-5 py-2 text-sm font-bold text-emerald-100 transition-colors hover:bg-emerald-900/40"
                                                    >
                                                        {content.cta}
                                                        {reduce ? (
                                                            <ArrowDown size={15} aria-hidden />
                                                        ) : (
                                                            <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} className="inline-flex" aria-hidden>
                                                                <ArrowDown size={15} />
                                                            </motion.span>
                                                        )}
                                                    </button>
                                                )}
                                                <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 transition-colors hover:text-emerald-200">
                                                    <RotateCcw size={13} /> {content.resetButton}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-amber-400/45 bg-amber-900/[0.12] p-5 md:p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="hidden shrink-0 self-center sm:block">
                                            <Mentor key={chosen.mentorPose} pose={chosen.mentorPose} width={84} glow={false} float={false} />
                                        </div>
                                        <div className="flex-1 text-start">
                                            <div className="flex items-center gap-2">
                                                <Lightbulb size={20} className="shrink-0 text-amber-300" />
                                                <span className="text-lg font-black text-amber-200 md:text-xl">{content.wrongTitle}</span>
                                            </div>
                                            <p className="mt-2.5 text-sm leading-relaxed text-slate-200">{chosen.getsRight}</p>
                                            {chosen.misses && (
                                                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{chosen.misses}</p>
                                            )}

                                            {revealed && preciseCard && (
                                                <motion.div
                                                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                                                    className="mt-4 rounded-xl border border-emerald-400/35 bg-emerald-900/15 p-3.5"
                                                >
                                                    <p className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-200">
                                                        <CheckCircle2 size={15} className="text-emerald-300" /> {content.revealTitle} {preciseCard.title}
                                                    </p>
                                                    <p className="mt-1 text-sm leading-relaxed text-slate-300">{content.revealCopy}</p>
                                                </motion.div>
                                            )}

                                            <div className="mt-4 flex flex-wrap items-center gap-2.5">
                                                <button
                                                    type="button"
                                                    onClick={reset}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-900/25 px-5 py-2 text-sm font-bold text-amber-100 transition-colors hover:bg-amber-900/40"
                                                >
                                                    <RotateCcw size={14} /> {content.resetButton}
                                                </button>
                                                {!revealed && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setRevealed(true)}
                                                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-900/20 px-4 py-2 text-sm font-bold text-emerald-200 transition-colors hover:bg-emerald-900/35"
                                                    >
                                                        <Sparkles size={14} /> {content.revealButton}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
