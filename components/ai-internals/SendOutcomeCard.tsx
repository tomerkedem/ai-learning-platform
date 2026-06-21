"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, MessageCircleQuestion, HelpCircle, Wrench, Hand, Lock, Unlock } from 'lucide-react';
import type { WordDecisionKind, WordFinal } from '@/app/behind-the-scenes-ai/chapter-4/wordEngine';

interface SendOutcomeCardProps {
    final: WordFinal;
    sent: boolean;
}

// מיפוי סטטי של סוג ההחלטה לעיצוב ולאייקון.
const KIND_STYLE: Record<WordDecisionKind, {
    icon: React.ReactNode; border: string; grad: string; text: string; dot: string; glow: string;
}> = {
    answer: {
        icon: <CheckCircle2 size={22} />,
        border: 'border-emerald-500/50', grad: 'from-emerald-500/20 to-emerald-900/5',
        text: 'text-emerald-300', dot: 'bg-emerald-400', glow: 'shadow-[0_0_40px_-8px_rgba(52,211,153,0.5)]',
    },
    context: {
        icon: <MessageCircleQuestion size={22} />,
        border: 'border-amber-500/50', grad: 'from-amber-500/20 to-amber-900/5',
        text: 'text-amber-300', dot: 'bg-amber-400', glow: 'shadow-[0_0_40px_-8px_rgba(251,191,36,0.5)]',
    },
    clarify: {
        icon: <HelpCircle size={22} />,
        border: 'border-purple-500/50', grad: 'from-purple-500/20 to-purple-900/5',
        text: 'text-purple-300', dot: 'bg-purple-400', glow: 'shadow-[0_0_40px_-8px_rgba(192,132,252,0.55)]',
    },
    tool: {
        icon: <Wrench size={22} />,
        border: 'border-blue-500/50', grad: 'from-blue-500/20 to-blue-900/5',
        text: 'text-blue-300', dot: 'bg-blue-400', glow: 'shadow-[0_0_40px_-8px_rgba(96,165,250,0.5)]',
    },
    approval: {
        icon: <Hand size={22} />,
        border: 'border-rose-500/50', grad: 'from-rose-500/20 to-rose-900/5',
        text: 'text-rose-300', dot: 'bg-rose-400', glow: 'shadow-[0_0_40px_-8px_rgba(251,113,133,0.55)]',
    },
};

/**
 * Final Send Lock: עד Send הכול זמני. אחרי Send ההחלטה ננעלת ומוצגת התוצאה
 * הסופית (תשובה ב-Chat, הצעד הבא ב-Agent). המעבר מזמני לסופי הוא רגע ויזואלי.
 */
export const SendOutcomeCard: React.FC<SendOutcomeCardProps> = ({ final, sent }) => {
    const reduce = useReducedMotion();

    if (!sent) {
        return (
            <div
                className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-600/60 bg-slate-900/30 p-5 text-right"
                dir="rtl"
            >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-600/50 bg-slate-950/50 text-slate-400">
                    <Unlock size={18} />
                </span>
                <div>
                    <div className="text-sm font-bold text-slate-300">
                        טרם נשלח · ההחלטה עדיין זמנית
                        <span className="ms-2 text-[10px] font-medium uppercase tracking-wider text-slate-500" dir="ltr">Temporary</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        כל עוד לא לחצתם Send, המנוע מציג כיוון בלבד. ההחלטה הסופית נקבעת רק כשהמשפט נשלח במלואו.
                    </p>
                </div>
            </div>
        );
    }

    const s = KIND_STYLE[final.kind];

    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 20 }}
            className={`relative overflow-hidden rounded-2xl border bg-gradient-to-bl p-5 text-right ${s.border} ${s.grad} ${s.glow}`}
            dir="rtl"
        >
            <div className="mb-3 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        {!reduce && <span className={`absolute inline-flex h-full w-full rounded-full ${s.dot} opacity-75 animate-ping`} />}
                        <span className={`relative inline-flex h-2 w-2 rounded-full ${s.dot}`} />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        {final.outcomeLabelHe}
                        <span className="ms-1.5 opacity-70" dir="ltr">{final.outcomeLabelEn}</span>
                    </span>
                </span>
                <motion.span
                    initial={reduce ? false : { rotate: -25, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                    className={`inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/50 px-2.5 py-1 text-[10px] font-bold ${s.text}`}
                >
                    <Lock size={11} /> נעול
                    <span className="opacity-70" dir="ltr">Locked</span>
                </motion.span>
            </div>

            <div className="flex items-start gap-3">
                <motion.div
                    initial={reduce ? false : { scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 16, delay: 0.05 }}
                    className={`shrink-0 rounded-xl border border-white/10 bg-slate-950/50 p-2.5 ${s.text}`}
                >
                    {s.icon}
                </motion.div>
                <div className="min-w-0">
                    <div className={`text-xl font-black leading-tight ${s.text}`}>{final.he}</div>
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-500" dir="ltr">{final.en}</div>
                    <p className="text-sm leading-relaxed text-slate-200">{final.detail}</p>
                </div>
            </div>
        </motion.div>
    );
};
