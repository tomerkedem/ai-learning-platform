"use client";

// components/ai-internals/HypothesisGuess.tsx
//
// "ארבעה הסברים מתחרים": לא שאלון אמריקאי, אלא בחירת מודל חשיבה. הלומד בוחר איזה
// הסבר הכי קרוב למה שקורה באמצע, מתוך ארבעה כרטיסי השערה ברשת 2x2. המשוב מרגיש
// כמו גילוי, לא כמו ציון: בחירה שגויה מוצגת כטעות חשיבה מפתה (גוון ענבר רך, לא
// אדום מאיים), עם הסבר למה היא מפתה ולמה אינה מדויקת, וההסבר המדויק נשאר זמין
// לחשיפה. בחירה נכונה זוהרת ומתחברת אל פתיחת המנוע שלמטה.
//
// לא מבחן ולא חלק מהמאסטרי. אין שמירת ניקוד.
//
// נגישות: כל כרטיס הוא <button> עם aria-pressed, תווית מלאה לקורא-מסך, תמיכת
// מקלדת מובנית וטבעת פוקוס גלויה. reduced-motion: בלי זוהר מונפש, רק מעבר מיידי.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Sparkles, RotateCcw, ArrowDown, Eye, Lock, Database, Check, CheckCircle2, Info } from 'lucide-react';
import { Mentor } from './Mentor';
import { useT } from '@/i18n/useT';
import type { Hypothesis, HypothesisCue, QuickGuessContent } from '@/app/behind-the-scenes-ai/introduction/introContent';
import type { Direction } from '@/i18n/config';

/* ── איור-מיקרו לכל השערה ── */
function CueIllustration({ cue }: { cue: HypothesisCue }) {
    // שברי הטוקן ("טו"/"קן") מהמילון (introVisuals.guess.tokenCue).
    const tokenCue = useT().t.behindAi.introVisuals.guess.tokenCue;
    if (cue === 'read') {
        return (
            <div className="flex items-center gap-2">
                <Eye size={18} className="text-slate-300" aria-hidden />
                <div className="flex flex-col gap-1" aria-hidden>
                    <span className="block h-1 w-8 rounded-full bg-slate-500/70" />
                    <span className="block h-1 w-5 rounded-full bg-slate-600/70" />
                </div>
            </div>
        );
    }
    if (cue === 'rail') {
        return (
            <div className="flex items-center gap-1.5" aria-hidden>
                <Lock size={16} className="text-slate-300" />
                <div className="flex items-center gap-1">
                    {[0, 1, 2, 3].map((i) => (
                        <span key={i} className="h-1.5 w-3 rounded-sm bg-slate-500/70" />
                    ))}
                </div>
            </div>
        );
    }
    if (cue === 'tokens') {
        return (
            <div className="flex items-center gap-1" aria-hidden>
                {tokenCue.map((t, i) => (
                    <React.Fragment key={i}>
                        <span className="rounded-md border border-cyan-500/40 bg-cyan-950/40 px-1.5 py-0.5 text-[9px] font-bold text-cyan-200">{t}</span>
                        <span className="h-1 w-1 rounded-full bg-cyan-400/70" />
                    </React.Fragment>
                ))}
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            </div>
        );
    }
    // archive
    return (
        <div className="flex items-center gap-2" aria-hidden>
            <Database size={18} className="text-slate-300" />
            <div className="flex flex-col gap-0.5">
                <span className="block h-1 w-6 rounded-sm bg-slate-500/70" />
                <span className="block h-1 w-6 rounded-sm bg-slate-600/70" />
            </div>
        </div>
    );
}

/* ── פעימת ניצוצות חד-פעמית לרגע ההצלחה (מונפש בלבד; ההורה לא מרנדר ב-reduced-motion) ── */
function SparkleBurst() {
    // ניצוצות מתפרצים החוצה מהפינה העליונה של תיבת ההצלחה, נדעכים פעם אחת.
    const bits = [
        { x: -54, y: -8, s: 13, d: 0 },
        { x: -28, y: -34, s: 10, d: 0.05 },
        { x: 6, y: -40, s: 15, d: 0.02 },
        { x: 40, y: -30, s: 10, d: 0.08 },
        { x: 64, y: -6, s: 12, d: 0.04 },
        { x: 22, y: 8, s: 9, d: 0.1 },
    ];
    return (
        <div className="pointer-events-none absolute start-10 top-6 z-20" aria-hidden>
            {bits.map((b, i) => (
                <motion.span
                    key={i}
                    className="absolute text-cyan-300"
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

type CardState = 'idle' | 'correct' | 'wrong' | 'revealed' | 'dim';

function stateClasses(state: CardState, reduce: boolean): string {
    switch (state) {
        case 'correct':
            return `border-cyan-400/70 bg-cyan-900/25 ${reduce ? '' : 'shadow-[0_0_40px_-10px_rgba(34,211,238,0.6)]'}`;
        case 'wrong':
            return 'border-amber-400/50 bg-amber-900/15';
        case 'revealed':
            return 'border-cyan-400/60 bg-cyan-900/15';
        case 'dim':
            return 'border-white/5 bg-slate-900/40 opacity-60';
        default:
            return 'border-slate-700/60 bg-slate-900/50 hover:border-cyan-500/50 hover:bg-cyan-900/10';
    }
}

export const HypothesisGuess: React.FC<{ reduce: boolean; content: QuickGuessContent; dir: Direction }> = ({ reduce, content, dir }) => {
    const [chosenId, setChosenId] = useState<string | null>(null);
    const [revealed, setRevealed] = useState(false); // נחשף ההסבר המדויק אחרי בחירה שגויה

    const chosen = content.hypotheses.find((h) => h.id === chosenId) ?? null;
    const chosenCorrect = !!chosen?.correct;
    const correctCard = content.hypotheses.find((h) => h.correct);

    const cardStateFor = (h: Hypothesis): CardState => {
        if (!chosen) return 'idle';
        if (h.id === chosenId) return h.correct ? 'correct' : 'wrong';
        if (h.correct && (chosenCorrect || revealed)) return chosenCorrect ? 'idle' : 'revealed';
        return 'dim';
    };

    const reset = () => { setChosenId(null); setRevealed(false); };

    return (
        <div
            dir={dir}
            className="relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl md:p-8"
        >
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[80px]" />

            <div className="relative">
                {/* מנטור הזמנה: דמות חושבת ממורכזת מעל הכרטיסים, נעלמת אחרי הבחירה - כמו בכל הפרקים. */}
                {!chosen && (
                    <div className="mb-5 hidden flex-col items-center sm:flex">
                        <Mentor pose="think" width={108} glow={false} />
                    </div>
                )}
                <div className="text-center">
                    <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                        <HelpCircle size={14} /> {content.eyebrow}
                    </span>
                    <h3 className="mb-2 text-xl font-black text-white md:text-3xl">{content.question}</h3>
                    <p className="mx-auto mb-7 max-w-xl text-sm text-slate-400 md:text-base">{content.hint}</p>
                </div>

                {/* רשת 2x2 של כרטיסי השערה */}
                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {content.hypotheses.map((h) => {
                        const state = cardStateFor(h);
                        const selected = h.id === chosenId;
                        return (
                            <motion.button
                                key={h.id}
                                type="button"
                                onClick={() => { setChosenId(h.id); setRevealed(false); }}
                                aria-pressed={selected}
                                aria-label={`${h.title}. ${h.concept}`}
                                whileHover={reduce ? undefined : { scale: 1.015 }}
                                whileTap={reduce ? undefined : { scale: 0.985 }}
                                className={`relative flex flex-col gap-2.5 rounded-2xl border p-4 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${stateClasses(state, reduce)}`}
                            >
                                {/* פעימת-אישור חד-פעמית בבחירה נכונה */}
                                {!reduce && state === 'correct' && (
                                    <motion.span
                                        aria-hidden
                                        className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-cyan-400/60"
                                        initial={{ opacity: 0.85, scale: 1 }}
                                        animate={{ opacity: 0, scale: 1.04 }}
                                        transition={{ duration: 0.7, ease: 'easeOut' }}
                                    />
                                )}
                                <div className="flex items-center justify-between gap-2">
                                    <span className="rounded-xl border border-white/10 bg-slate-950/50 px-2.5 py-2">
                                        <CueIllustration cue={h.cue} />
                                    </span>
                                    {(state === 'correct' || state === 'revealed') && (
                                        <motion.span
                                            initial={reduce ? false : { scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 15 }}
                                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-slate-950"
                                        >
                                            <Check size={14} strokeWidth={3} />
                                        </motion.span>
                                    )}
                                </div>
                                <div>
                                    <div className="text-base font-black text-white">{h.title}</div>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-300">{h.concept}</p>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* משוב: גילוי, לא ציון */}
                <AnimatePresence initial={false}>
                    {chosen && (
                        <motion.div
                            key={chosenCorrect ? 'correct' : 'wrong'}
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.35 }}
                            className="mx-auto mt-7 max-w-2xl"
                            role="status"
                            aria-live="polite"
                        >
                            {chosenCorrect ? (
                                <div className="relative overflow-hidden rounded-2xl border border-cyan-400/55 bg-gradient-to-b from-cyan-900/30 to-cyan-950/10 p-5 md:p-6 shadow-[0_0_55px_-12px_rgba(34,211,238,0.55)]">
                                    {!reduce && <SparkleBurst />}
                                    <div className="relative flex items-start gap-4">
                                        <div className="hidden shrink-0 self-center sm:block">
                                            <Mentor pose="correct" width={92} glow={false} float={false} />
                                        </div>
                                        <div className="flex-1 text-start">
                                            <div className="flex items-center gap-2">
                                                <motion.span
                                                    initial={reduce ? false : { scale: 0, rotate: -25 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 14 }}
                                                    className="inline-flex"
                                                >
                                                    <CheckCircle2 size={24} className="text-cyan-300" />
                                                </motion.span>
                                                <span className="text-xl font-black text-cyan-100 md:text-2xl">{content.correctTitle}</span>
                                            </div>
                                            <p className="mt-2 text-sm font-bold text-cyan-200 md:text-base">{content.correctLead}</p>
                                            <p className="mt-2 text-sm leading-relaxed text-slate-200">{content.correctBody}</p>
                                            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2.5">
                                                <span className="inline-flex items-center gap-1.5 border-s-2 border-cyan-400/60 ps-3 text-sm font-bold text-cyan-100">
                                                    {content.correctBridge}
                                                    {!reduce ? (
                                                        <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} className="inline-flex" aria-hidden>
                                                            <ArrowDown size={15} />
                                                        </motion.span>
                                                    ) : (
                                                        <ArrowDown size={15} aria-hidden />
                                                    )}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={reset}
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 transition-colors hover:text-cyan-200"
                                                >
                                                    <RotateCcw size={13} /> {content.retry}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-amber-400/45 bg-amber-900/[0.12] p-5 md:p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="hidden shrink-0 self-center sm:block">
                                            <Mentor pose="reassure" width={84} glow={false} float={false} />
                                        </div>
                                        <div className="flex-1 text-start">
                                            <div className="flex items-center gap-2">
                                                <Info size={20} className="shrink-0 text-amber-300" />
                                                <span className="text-base font-black text-amber-200 md:text-lg">{content.wrongLead}</span>
                                            </div>
                                            {chosen.whyTempting && (
                                                <p className="mt-2.5 text-sm leading-relaxed text-slate-200">{chosen.whyTempting}</p>
                                            )}
                                            {chosen.whyWrong && (
                                                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{chosen.whyWrong}</p>
                                            )}

                                            {revealed && correctCard && (
                                                <motion.div
                                                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                                                    className="mt-4 rounded-xl border border-cyan-400/35 bg-cyan-900/15 p-3.5"
                                                >
                                                    <p className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-200">
                                                        <CheckCircle2 size={15} className="text-cyan-300" /> {correctCard.title}: {content.correctLead}
                                                    </p>
                                                    <p className="mt-1 text-sm leading-relaxed text-slate-300">{content.correctBody}</p>
                                                </motion.div>
                                            )}

                                            <div className="mt-4 flex flex-wrap items-center gap-2.5">
                                                <button
                                                    type="button"
                                                    onClick={reset}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-900/25 px-5 py-2 text-sm font-bold text-amber-100 transition-colors hover:bg-amber-900/40"
                                                >
                                                    <RotateCcw size={14} /> {content.retry}
                                                </button>
                                                {!revealed && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setRevealed(true)}
                                                        className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/50 bg-cyan-900/20 px-4 py-2 text-sm font-bold text-cyan-200 transition-colors hover:bg-cyan-900/35"
                                                    >
                                                        <Sparkles size={14} /> {content.revealCorrect}
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
