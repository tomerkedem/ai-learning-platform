"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Route, ChevronDown, ArrowUp, RotateCcw, Sparkles } from 'lucide-react';

import { ACCENTS } from '@/components/ai-internals/accents';
import { DecisionCard } from '@/components/ai-internals/DecisionCard';
import type { Accent, DecisionState, FlowMode } from '@/components/ai-internals/types';

import {
    tokenize,
    runChatEngine,
    runAgentEngine,
    matchedWords,
    CHAT_RULES,
    ACTION_WORDS,
    SENSITIVE_WORDS,
    DELIVERY_WORDS,
} from './mockEngine';

interface DecisionTraceProps {
    text: string;
    mode: FlowMode;
    accent: Accent;
}

interface Factor {
    id: string;
    label: string;
    value: React.ReactNode;
    /** הקישור הסיבתי: למה השלב הזה הוביל לשלב שמתחתיו. */
    because: string;
}

/**
 * "עקוב אחר ההחלטה": מסע סיבתי. מתחילים מההחלטה ועוקבים אחורה, סיבה אחת בכל צעד,
 * עד לטוקנים המקוריים. כל קישור מסביר "כי...", והמילים שבאמת הפעילו את הכוונה מודגשות.
 * הכול נקרא מתוך אותה ריצת mockEngine - אין כאן חישוב או מספר חדש.
 */
export const DecisionTrace: React.FC<DecisionTraceProps> = ({ text, mode, accent }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const isChat = mode === 'chat';

    const tokens = tokenize(text);

    let factors: Factor[];
    let decision: DecisionState;

    if (isChat) {
        const r = runChatEngine(text);
        const top = r.intents[0];
        const second = r.intents[1];
        const margin = Math.max(0, (top?.value ?? 0) - (second?.value ?? 0));
        const topRule = CHAT_RULES.find((rr) => rr.label === top?.label);
        const matched = topRule ? matchedWords(text, topRule.words) : [];
        const isHot = (tk: string) => matched.some((m) => m === tk || m.includes(tk) || tk.includes(m));

        factors = [
            {
                id: 'tokens',
                label: 'הטוקנים שנקראו',
                value: <TokenChips tokens={tokens} isHot={isHot} accent={accent} />,
                because: matched.length
                    ? `המילים ${matched.join(', ')} בלטו והפעילו דפוס מתאים, וכך נקבעה הכוונה המובילה.`
                    : 'אף מילת-מפתח לא בלטה, ולכן נבחר הפירוש הכללי.',
            },
            {
                id: 'intent',
                label: 'הכוונה המובילה',
                value: <span className="font-mono">{top?.label ?? '-'} ({top?.value ?? 0}%)</span>,
                because: `המרחק מהאפשרות הבאה (${second?.label ?? '-'}, ${second?.value ?? 0}%) הוא שקובע כמה המנוע בטוח.`,
            },
            {
                id: 'margin',
                label: 'הפער והביטחון',
                value: <span className="font-mono">פער {margin}% · ביטחון {r.confidence}</span>,
                because: r.confidence === 'Low'
                    ? 'הפער קטן, הביטחון נמוך, ולכן הצעד האחראי הוא לעצור ולשאול במקום לנחש.'
                    : 'הפער גדול, הביטחון גבוה מספיק, ולכן המנוע עונה במקום לשאול.',
            },
        ];
        decision = r.decision;
    } else {
        const r = runAgentEngine(text);
        const hotWords = [...ACTION_WORDS, ...SENSITIVE_WORDS, ...DELIVERY_WORDS];
        const isHot = (tk: string) => hotWords.some((w) => tk.includes(w)) || /\d{6,}/.test(tk);

        factors = [
            {
                id: 'tokens',
                label: 'הטוקנים שנקראו',
                value: <TokenChips tokens={tokens} isHot={isHot} accent={accent} />,
                because: 'מילות הפעולה והמזהים בקלט הם שקבעו את סוג המשימה.',
            },
            {
                id: 'task',
                label: 'המשימה שזוהתה',
                value: <span className="font-mono">{r.task}</span>,
                because: 'סוג המשימה קובע איזה מידע נדרש כדי לפעול, ומה הסיכון.',
            },
            {
                id: 'gate',
                label: 'מידע חסר וסיכון',
                value: <span className="font-mono">{r.missingInfo} · סיכון {r.risk}</span>,
                because: r.canActNow
                    ? 'יש מספיק מידע והסיכון נמוך, ולכן אפשר לפעול.'
                    : 'חסר מידע או שהפעולה רגישה, ולכן עוצרים לפני פעולה.',
            },
        ];
        decision = r.decision;
    }

    const n = factors.length;
    // step: כמה סיבות נחשפו במעלה הזרם מההחלטה. 0 = רק ההחלטה. n = השרשרת המלאה.
    const [step, setStep] = useState(0);
    const revealed = (i: number) => step >= n - i;
    const next = () => setStep((s) => Math.min(n, s + 1));

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-1 flex items-center gap-2">
                <Route size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">עקוב אחר ההחלטה</div>
                    <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Trace the decision</div>
                </div>
            </div>

            {/* הרעיון + איך מפעילים */}
            <p className="mb-3 text-sm leading-relaxed text-slate-300">
                <span className="font-bold text-white">הרעיון:</span> כל החלטה של המנוע היא הסוף של שרשרת סיבות.
                כאן עוקבים <span className={`font-bold ${a.text}`}>אחורה</span> מההחלטה אל מה שגרם לה, שלב אחר שלב.
            </p>
            <div className="mb-4 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">איך מפעילים</div>
                <ol className="space-y-1 text-xs leading-relaxed text-slate-400">
                    <li><span className={`font-bold ${a.text}`}>1.</span> מתחילים מההחלטה שלמטה.</li>
                    <li><span className={`font-bold ${a.text}`}>2.</span> לוחצים &quot;עקבו צעד אחורה&quot; כדי לחשוף סיבה אחת בכל פעם.</li>
                    <li><span className={`font-bold ${a.text}`}>3.</span> כל צעד מסביר <span className={`font-bold ${a.text}`}>כי...</span> - למה השלב הזה הוביל לשלב שמתחתיו.</li>
                </ol>
            </div>

            {/* פס בקרה */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
                {step < n ? (
                    <button
                        type="button"
                        onClick={next}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${a.border} ${a.bgSoft} ${a.text} hover:brightness-125`}
                    >
                        <ArrowUp size={13} /> עקבו צעד אחורה
                    </button>
                ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                        <Sparkles size={13} /> עקבתם עד השורש: מהטוקנים ועד ההחלטה
                    </span>
                )}
                {step > 0 && (
                    <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-xs font-bold text-slate-300 transition-colors hover:border-slate-600"
                    >
                        <RotateCcw size={13} /> אפס
                    </button>
                )}
                {step < n && (
                    <button
                        type="button"
                        onClick={() => setStep(n)}
                        className="rounded-lg border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-xs font-bold text-slate-400 transition-colors hover:border-slate-600"
                    >
                        גלו הכול
                    </button>
                )}
                <span className="ms-auto font-mono text-xs text-slate-500" dir="ltr">{step}/{n}</span>
            </div>

            {/* השרשרת */}
            <div className="flex flex-col items-stretch gap-0">
                {factors.map((f, i) => {
                    const shown = revealed(i);
                    return (
                        <React.Fragment key={f.id}>
                            <motion.div
                                animate={{ opacity: shown ? 1 : 0.35 }}
                                transition={{ duration: reduce ? 0 : 0.3 }}
                                className={`rounded-xl border p-3 transition-colors duration-300 ${shown ? `${a.border} ${a.bgSoft}` : 'border-white/10 bg-slate-950/40'}`}
                            >
                                <div className={`text-[11px] font-bold uppercase tracking-widest ${shown ? a.text : 'text-slate-500'}`}>{f.label}</div>
                                <div className="mt-1.5 text-sm text-slate-200" dir="auto">{f.value}</div>
                            </motion.div>

                            {/* הקישור הסיבתי אל השלב שמתחת */}
                            <div className="flex flex-col items-center py-1.5" aria-hidden={!shown}>
                                <ChevronDown size={15} className={`transition-colors duration-300 ${shown ? a.text : 'text-slate-700'}`} />
                                {shown && (
                                    <motion.div
                                        initial={reduce ? false : { opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-1 max-w-md rounded-lg border border-white/10 bg-slate-950/60 px-3 py-1.5 text-center text-xs leading-relaxed text-slate-300"
                                    >
                                        <span className={`font-bold ${a.text}`}>כי </span>{f.because}
                                    </motion.div>
                                )}
                            </div>
                        </React.Fragment>
                    );
                })}

                {/* ההחלטה - נקודת ההתחלה של המסע */}
                <div
                    role="button"
                    tabIndex={0}
                    aria-label="עקוב אחר הגורמים שהובילו להחלטה"
                    onClick={next}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); } }}
                    className={`cursor-pointer rounded-2xl outline-none transition-shadow ${step > 0 ? `ring-2 ${a.ringSoft}` : ''}`}
                >
                    <DecisionCard decision={decision} />
                    {step === 0 && (
                        <div className="mt-1.5 text-center text-[11px] text-slate-500">לחצו כאן, או על הכפתור למעלה, כדי להתחיל לעקוב אחורה</div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── רצועת טוקנים עם הדגשת המילים שבאמת הפעילו את ההחלטה ────────────────────── */

const TokenChips: React.FC<{ tokens: string[]; isHot: (tk: string) => boolean; accent: Accent }> = ({ tokens, isHot, accent }) => {
    const a = ACCENTS[accent];
    if (tokens.length === 0) return <span className="text-slate-500">-</span>;
    return (
        <div className="flex flex-wrap gap-1.5">
            {tokens.map((tk, i) => {
                const hot = isHot(tk);
                return (
                    <span
                        key={`${tk}-${i}`}
                        className={`rounded-md border px-2 py-0.5 text-sm font-mono ${hot ? `${a.border} ${a.bgSoft} ${a.text} font-bold` : 'border-white/10 bg-slate-900/60 text-slate-300'}`}
                    >
                        {tk}
                    </span>
                );
            })}
        </div>
    );
};
