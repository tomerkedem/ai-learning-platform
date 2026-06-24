"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { HelpCircle, CheckCircle2, Wrench, Hand, Sparkles, ArrowDown } from 'lucide-react';

import { DecisionCard } from '@/components/ai-internals/DecisionCard';
import type { DecisionKind, FlowMode } from '@/components/ai-internals/types';

import { runChatEngine, runAgentEngine } from './mockEngine';

interface PredictDecisionProps {
    text: string;
    mode: FlowMode;
}

interface Option {
    kind: DecisionKind;
    he: string;
    icon: React.ReactNode;
}

// ב-Chat המנוע מפיק רק answer/ask. "לעצור לאישור" היא מסיח לגיטימי מעולם ההחלטות
// של המערכת (קיים ב-Agent), והחשיפה מנצלת אותו כדי ללמד את הגבול בין Chat ל-Agent.
const CHAT_OPTIONS: Option[] = [
    { kind: 'answer', he: 'לענות', icon: <CheckCircle2 size={18} /> },
    { kind: 'ask', he: 'לבקש הבהרה', icon: <HelpCircle size={18} /> },
    { kind: 'stop', he: 'לעצור לאישור', icon: <Hand size={18} /> },
];

// סוגי ההחלטה שאפשריים בכל מצב (השאר מוצגים כמסיחים מלמדים).
const POSSIBLE_KINDS: Record<'chat' | 'agent', DecisionKind[]> = {
    chat: ['answer', 'ask'],
    agent: ['answer', 'tool', 'ask', 'stop'],
};

const AGENT_OPTIONS: Option[] = [
    { kind: 'answer', he: 'לענות', icon: <CheckCircle2 size={18} /> },
    { kind: 'tool', he: 'להשתמש בכלי', icon: <Wrench size={18} /> },
    { kind: 'ask', he: 'לבקש מידע', icon: <HelpCircle size={18} /> },
    { kind: 'stop', he: 'לעצור לאישור', icon: <Hand size={18} /> },
];

/**
 * רגע ניחוש לפני חשיפה (בהשראת GuessRevealGate): הלומד מנחש מה המנוע יחליט,
 * ואז נחשפת ההחלטה האמיתית שמורץ עליה אותו mockEngine. אין חישוב חדש - רק
 * הסתרה זמנית של תוצאה שכבר קיימת, כדי לייצר רגע של מעורבות לפני ההסבר.
 */
export const PredictDecision: React.FC<PredictDecisionProps> = ({ text, mode }) => {
    const reduce = useReducedMotion();
    const isChat = mode === 'chat';

    const result = isChat ? runChatEngine(text) : runAgentEngine(text);
    const actualKind = result.decision.kind;
    const options = isChat ? CHAT_OPTIONS : AGENT_OPTIONS;

    const [guess, setGuess] = useState<DecisionKind | null>(null);
    const revealed = guess !== null;
    const correct = guess === actualKind;
    // האם הניחוש הוא סוג-החלטה שהמצב הנוכחי כלל לא מפיק (מסיח מלמד).
    const guessedImpossible = revealed && guess !== null && !POSSIBLE_KINDS[mode].includes(guess);

    const accentText = isChat ? 'text-cyan-300' : 'text-purple-300';
    const accentBorder = isChat ? 'border-cyan-500/50' : 'border-purple-500/50';
    const accentBg = isChat ? 'bg-cyan-900/25' : 'bg-purple-900/25';
    const accentGlow = isChat ? 'bg-cyan-500/10' : 'bg-purple-500/10';

    return (
        <div
            dir="rtl"
            className="relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-900/60 p-6 text-center backdrop-blur-xl md:p-8"
        >
            <div className={`pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full ${accentGlow} blur-[80px]`} />
            <div className="relative">
                <span className={`mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] ${accentText}`}>
                    <HelpCircle size={14} /> ניחוש מהיר
                </span>
                <h3 className="mb-2 text-xl font-black text-white md:text-2xl">
                    מה המנוע יחליט על &quot;{text}&quot;?
                </h3>
                <p className="mx-auto mb-6 max-w-xl text-sm text-slate-400">
                    {isChat
                        ? 'לפני שתפעילו את הסורק - נחשו: המנוע יענה ישר, או יעצור ויבקש הבהרה?'
                        : 'לפני שתפעילו את הסורק - נחשו את הצעד הבא: לענות, להשתמש בכלי, לבקש מידע, או לעצור לאישור?'}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    {options.map((opt) => {
                        const isGuess = guess === opt.kind;
                        const isAnswer = opt.kind === actualKind;
                        const state = !revealed ? 'idle' : isAnswer ? 'answer' : isGuess ? 'wrong' : 'dim';
                        return (
                            <button
                                key={opt.kind}
                                type="button"
                                onClick={() => !revealed && setGuess(opt.kind)}
                                disabled={revealed}
                                aria-label={`ניחוש: ${opt.he}`}
                                className={[
                                    'relative inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-base font-black transition-all',
                                    state === 'idle' && `cursor-pointer border-slate-700/60 bg-slate-800/40 text-slate-200 hover:scale-105 hover:${accentBorder} hover:${accentBg}`,
                                    state === 'answer' && `scale-105 ${accentBorder} ${accentBg} ${accentText}`,
                                    state === 'wrong' && 'border-rose-500/50 bg-rose-900/20 text-rose-300/80',
                                    state === 'dim' && 'border-slate-700/40 bg-slate-800/20 text-slate-600',
                                ].filter(Boolean).join(' ')}
                            >
                                <span className={state === 'answer' ? accentText : ''}>{opt.icon}</span>
                                {opt.he}
                                {revealed && isAnswer && (
                                    <motion.span
                                        initial={reduce ? false : { scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 15 }}
                                        className={`absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full ${isChat ? 'bg-cyan-400' : 'bg-purple-400'} text-slate-950`}
                                    >
                                        <CheckCircle2 size={12} strokeWidth={3} />
                                    </motion.span>
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
                            <div className="mt-6 flex flex-col items-center gap-2" role="status" aria-live="polite">
                                <p className={`inline-flex items-center gap-2 text-base font-bold ${accentText}`}>
                                    <Sparkles size={16} />
                                    {correct ? 'בול! זיהיתם את ההחלטה.' : 'לא בדיוק - וזה החלק המעניין.'}
                                </p>
                                <p className="max-w-md text-sm text-slate-400">
                                    הפעילו עכשיו את הסורק שלמטה כדי לראות איך המנוע הגיע להחלטה הזו, מילה-אחר-מילה.
                                </p>
                                {guessedImpossible && (
                                    <p className="max-w-md rounded-xl border border-amber-500/30 bg-amber-900/10 px-3 py-2 text-[13px] leading-relaxed text-amber-100/90">
                                        {isChat
                                            ? 'שימו לב: ב-Chat ההכרעה היא תמיד אחת משתיים - לענות או לבקש הבהרה. לעצור או להשתמש בכלי שמורים ל-Agent. בדיוק כאן עובר הגבול בין השניים.'
                                            : 'הפעולה הזו לא רלוונטית למשימה הנוכחית, אבל היא חלק מארגז ההחלטות של ה-Agent בתרחישים אחרים.'}
                                    </p>
                                )}
                                <div className="mt-2 w-full max-w-sm text-right">
                                    <DecisionCard decision={result.decision} />
                                </div>
                                {!reduce && <ArrowDown size={18} className={`mt-1 animate-bounce ${accentText} opacity-60`} />}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
