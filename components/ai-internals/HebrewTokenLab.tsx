"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FlaskConical, Info, Layers, Scissors, Combine } from 'lucide-react';
import { TokenChip } from './TokenChip';
import { roleForWord } from '@/app/behind-the-scenes-ai/chapter-3/tokenRoles';
import { useChapter3Lab } from '@/app/behind-the-scenes-ai/chapter-3/labContent';
import { useT } from '@/i18n/useT';

/**
 * Sub-word Lab (מעבדת תת-מילים): מעבדה אקטיבית שמראה שיחידת טקסט אחת יכולה
 * להתפרק לכמה יחידות עבודה. הלומד לוחץ על כל שורה וצופה בפירוק, או מפצל/מאחד
 * את כולן בבת אחת. מונה הטוקנים החי מראה את העיקרון. הנתונים והטקסט מגיעים
 * מתוכן המעבדה (locale-aware), כך שלכל שפה יש דוגמה מתאימה משלה.
 *
 * זהו פירוק לימודי בלבד - טוקנייזר מסחרי מפצל לפי סטטיסטיקת תת-מילים.
 */
export const HebrewTokenLab: React.FC = () => {
    const reduce = useReducedMotion();
    const { subword, roleWords } = useChapter3Lab();
    const { dir } = useT();
    const splits = subword.splits;
    // מצב פיצול נפרד לכל שורה: false = יחידה שלמה, true = פורקה לתת-יחידות.
    const [split, setSplit] = useState<boolean[]>(() => splits.map(() => false));

    const toggleRow = (i: number) =>
        setSplit((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
    const splitAll = () => setSplit(splits.map(() => true));
    const mergeAll = () => setSplit(splits.map(() => false));

    const wordCount = splits.length;
    const tokenCount = useMemo(
        () => split.reduce((n, isSplit) => n + (isSplit ? 2 : 1), 0),
        [split],
    );
    const allSplit = split.every(Boolean);
    const allWhole = split.every((v) => !v);

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-start" dir={dir}>
            {/* כותרת + תווית לימודית */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <FlaskConical size={16} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">{subword.title}</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">{subword.titleEn}</div>
                    </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-900/20 px-2.5 py-1 text-[10px] font-bold text-amber-300">
                    <Info size={11} />
                    {subword.badge}
                </span>
            </div>

            {/* הנחיה */}
            <p className="mb-4 text-xs leading-relaxed text-slate-400">
                {subword.hint}
            </p>

            {/* מונה חי + כפתורי "פצל הכול / אחד הכול" */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/50 bg-slate-950/50 p-3">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Layers size={15} className="text-cyan-300" />
                        <span className="text-xs text-slate-400">
                            {subword.wordsLabel} <span className="font-bold text-slate-200">{wordCount}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{subword.tokensLabel}</span>
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                                key={tokenCount}
                                initial={reduce ? false : { opacity: 0, y: -8, scale: 0.6 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={reduce ? undefined : { opacity: 0, y: 8, scale: 0.6, position: 'absolute' }}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 26 }}
                                className={`inline-block min-w-[1.5rem] text-center text-base font-black tabular-nums ${
                                    tokenCount > wordCount ? 'text-cyan-300' : 'text-slate-200'
                                }`}
                            >
                                {tokenCount}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-slate-950/60 p-1">
                    <button
                        type="button"
                        onClick={splitAll}
                        disabled={allSplit}
                        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-violet-200 transition-colors hover:bg-violet-500/15 disabled:cursor-default disabled:text-slate-600 disabled:hover:bg-transparent"
                    >
                        <Scissors size={13} />
                        {subword.splitAll}
                    </button>
                    <button
                        type="button"
                        onClick={mergeAll}
                        disabled={allWhole}
                        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-300 transition-colors hover:bg-white/10 disabled:cursor-default disabled:text-slate-600 disabled:hover:bg-transparent"
                    >
                        <Combine size={13} />
                        {subword.mergeAll}
                    </button>
                </div>
            </div>

            {/* השורות - לחיצה על כל אחת מפצלת/מאחדת */}
            <div className="space-y-2.5">
                {splits.map((row, i) => {
                    const isSplit = split[i] ?? false;
                    const prefix = row.units[0];
                    const core = row.units[row.units.length - 1];
                    // צובעים את המילה לפי תפקיד המילה הבסיסית, כך שהצבע נשמר כשהיחידה נפרדת.
                    const coreRole = roleForWord(core, roleWords);

                    return (
                        <div key={row.word} className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={() => toggleRow(i)}
                                    aria-pressed={isSplit}
                                    aria-label={`${row.word} - ${isSplit ? subword.ariaSplit : subword.ariaWhole}`}
                                    className="group flex flex-wrap items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
                                    dir={dir}
                                >
                                    <motion.div layout className="flex flex-wrap items-center gap-2">
                                        <AnimatePresence mode="popLayout" initial={false}>
                                            {isSplit && (
                                                <motion.span
                                                    key="prefix"
                                                    layout
                                                    initial={reduce ? false : { opacity: 0, x: 22, rotate: -14, scale: 0.5 }}
                                                    animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                                                    exit={reduce ? undefined : { opacity: 0, x: 22, rotate: -14, scale: 0.5 }}
                                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 22 }}
                                                    className="inline-flex items-center rounded-lg border border-amber-500/55 bg-amber-900/25 px-2.5 py-1.5 font-mono text-sm font-bold text-amber-300 shadow-[0_0_18px_-6px] shadow-amber-500/50"
                                                >
                                                    {prefix}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>

                                        <motion.div layout key="core" className="transition-transform group-hover:scale-[1.03]">
                                            <TokenChip text={isSplit ? core : row.word} role={coreRole} size="md" />
                                        </motion.div>
                                    </motion.div>

                                    <span className="text-[10px] font-medium text-slate-500 transition-colors group-hover:text-slate-300">
                                        {isSplit ? subword.mergeHint : subword.splitHint}
                                    </span>
                                </button>

                                <span className="leading-tight text-end">
                                    <span className="block text-xs font-bold text-slate-300">{row.roleLabel}</span>
                                    <span className="block text-[9px] tracking-wider text-slate-500" dir="ltr">{row.roleEn}</span>
                                </span>
                            </div>

                            <AnimatePresence initial={false}>
                                {isSplit && (
                                    <motion.p
                                        key="note"
                                        initial={reduce ? false : { opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={reduce ? undefined : { opacity: 0, height: 0 }}
                                        transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                                        className="overflow-hidden"
                                    >
                                        <span className="mt-2 block text-[11px] leading-relaxed text-slate-400">{row.note}</span>
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {/* הערת שקיפות */}
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 text-[11px] leading-relaxed text-slate-500">
                <Info size={13} className="mt-0.5 shrink-0" />
                <span>
                    {subword.note}
                </span>
            </div>
        </div>
    );
};
