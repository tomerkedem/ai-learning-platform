"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FlaskConical, Info } from 'lucide-react';
import { TokenChip } from './TokenChip';
import { HEBREW_SPLITS } from '@/app/behind-the-scenes-ai/chapter-5/hebrewSplitRules';
import { roleForWord } from '@/app/behind-the-scenes-ai/chapter-5/tokenRoles';

type SplitMode = 'simple' | 'educational';

/**
 * Hebrew Token Lab: אזור משחק לפירוק אותיות שימוש מחוברות. toggle בין פירוק
 * פשוט (מילה שלמה) לפירוק לימודי (אות שימוש נפרדת). תמיד מסומן Educational -
 * זה ההמחשה, לא הפירוק של מודל מסחרי.
 */
export const HebrewTokenLab: React.FC = () => {
    const reduce = useReducedMotion();
    const [mode, setMode] = useState<SplitMode>('simple');

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <FlaskConical size={16} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">מעבדת הטוקנים העברית</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Hebrew Token Lab</div>
                    </div>
                </div>

                {/* תווית Educational קבועה */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-900/20 px-2.5 py-1 text-[10px] font-bold text-amber-300">
                    <Info size={11} />
                    Educational split
                    <span className="opacity-70" dir="ltr">Learning tokenizer view</span>
                </span>
            </div>

            {/* toggle */}
            <div className="mb-4 inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-slate-950/60 p-1" dir="ltr">
                {(['simple', 'educational'] as SplitMode[]).map((m) => {
                    const active = mode === m;
                    return (
                        <button
                            key={m}
                            type="button"
                            onClick={() => setMode(m)}
                            aria-pressed={active}
                            className={`relative rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${active ? 'text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            {active && (
                                <motion.span layoutId="hebrew-split-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-xl bg-violet-400" />
                            )}
                            <span className="relative z-10">{m === 'simple' ? 'Simple split' : 'Educational split'}</span>
                        </button>
                    );
                })}
            </div>

            <div className="space-y-2.5">
                {HEBREW_SPLITS.map((row) => {
                    const parts = mode === 'simple' ? row.simple : row.educational;
                    return (
                        <div key={row.word} className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <AnimatePresence mode="popLayout">
                                        {parts.map((part, i) => (
                                            <motion.div
                                                key={`${mode}-${part}-${i}`}
                                                layout
                                                initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={reduce ? undefined : { opacity: 0, scale: 0.7 }}
                                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 24, delay: i * 0.05 }}
                                            >
                                                <TokenChip text={part} role={roleForWord(part)} size="sm" />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                                <span className="leading-tight text-left">
                                    <span className="block text-xs font-bold text-slate-300">{row.roleHe}</span>
                                    <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{row.roleEn}</span>
                                </span>
                            </div>
                            {mode === 'educational' && (
                                <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{row.noteHe}</p>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 text-[11px] leading-relaxed text-slate-500">
                <Info size={13} className="mt-0.5 shrink-0" />
                <span>
                    זהו פירוק לימודי בלבד. טוקנייזר מסחרי אמיתי לא מפצל לפי אותיות שימוש אלא לפי סטטיסטיקת תת-מילים שנלמדה מהמון טקסט. כאן אנחנו ממחישים את הרעיון שמילה אחת יכולה להתפרק לכמה יחידות.
                </span>
            </div>
        </div>
    );
};
