"use client";

// ────────────────────────────────────────────────────────────────────────
// OpeningGuess - מנגנון "ניחוש הפתיחה" מסוג בורר-כרטיסים (רשת 2x2), בשימוש פרקים
// 2 ו-3. הלומד בוחר השערה אחת; הכרטיס המדויק מזוהה לפי statusTone === 'precise'.
//
// זהו ה-body הייחודי של הפרק בלבד. מנטור ההזמנה והתגובה שאחרי הבחירה מגיעים
// מהרכיבים המשותפים GuessInvite ו-GuessVerdict, כדי שההתנהגות הזו תהיה זהה בכל
// הלומדה (אחידות חלקית: אותו מנטור, אותן תגובות, מנגנון ניחוש גמיש לכל פרק).
//
// אינו עורך את DiscoveryGuess המשותף. בלי בועת דיבור למנטור. אין מקף ארוך, מקף
// בינוני או נקודה-פסיק בטקסט עברית.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HelpCircle, Check } from 'lucide-react';
import { GuessInvite, GuessVerdict } from './GuessVerdict';
import type { DiscoveryGuessCard, DiscoveryGuessContent } from './DiscoveryGuess';

export interface OpeningGuessContent extends DiscoveryGuessContent {
    /** כותרת הכרעה מפורשת לבחירה הנכונה, למשל "נכון מאוד!". */
    correctTitle: string;
    /** כותרת תומכת לבחירה שאינה המדויקת, למשל "כמעט!". */
    wrongTitle: string;
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
    const [revealed, setRevealed] = useState(false);

    const chosen = cards.find((c) => c.id === chosenId) ?? null;
    const correct = chosen?.statusTone === 'precise';
    const preciseCard = cards.find((c) => c.statusTone === 'precise') ?? null;

    const choose = (id: string) => { setChosenId(id); setRevealed(false); };
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
                {!chosen && <GuessInvite pose={content.invitePose} line={content.invite} />}

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
                                onClick={() => choose(card.id)}
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

                {/* התגובה המשותפת: הצלחה מפורשת או טעות תומכת */}
                {chosen && (
                    <GuessVerdict
                        key={chosenId ?? undefined}
                        correct={correct}
                        reduce={!!reduce}
                        correctTitle={content.correctTitle}
                        correctExplain={chosen.getsRight}
                        correctInsight={content.revealCopy}
                        continueCta={content.ctaTargetId ? { label: content.cta, onClick: goToTarget } : undefined}
                        wrongTitle={content.wrongTitle}
                        wrongExplain={chosen.getsRight}
                        wrongExplainMore={chosen.misses}
                        reveal={preciseCard ? { button: content.revealButton, title: `${content.revealTitle} ${preciseCard.title}`, body: content.revealCopy, revealed, onReveal: () => setRevealed(true) } : undefined}
                        onRetry={reset}
                        retryLabel={content.resetButton}
                    />
                )}
            </div>
        </div>
    );
};
