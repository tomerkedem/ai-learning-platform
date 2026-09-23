"use client";

// components/ai-internals/NextTokenGuess.tsx
//
// בונוס "היו אתם המנוע": ניחוש הטוקן הבא. הלומד בוחר מועמד, ואז נחשפת ההתפלגות
// האמיתית (מדורגת) עם ההמשך שהמנוע היה בוחר. הרעיון הנלמד: המנוע לא בוחר את האמת
// אלא את הטוקן הכי סביר לפי ההקשר. אמיתי לקהל חושב, מרובה-סבבים, phone-first,
// RTL/LTR, reduced-motion. אין מקף ארוך/בינוני או נקודה-פסיק בעברית.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';
import { useT } from '@/i18n/useT';
import type { NextTokenContent } from '@/app/(course)/behind-the-scenes-ai/introduction/introContent';
import type { Direction } from '@/i18n/config';

export const NextTokenGuess: React.FC<{ content: NextTokenContent; reduce: boolean; dir: Direction }> = ({ content, reduce, dir }) => {
    // פונט וגדלים אחידים בכל המצבים (רגיל/מסך מלא/מיקוד). במסך מלא הבונוס מתרחב
    // מעצמו כי הכרטיס רחב יותר, בלי לשנות גדלי טקסט.
    const [roundIdx, setRoundIdx] = useState(0);
    const [pick, setPick] = useState<string | null>(null);
    // הערת היושרה המשותפת של סצנות המבוא (מפתח מילון קיים, תרגום זהה בכל השפות):
    // ההתפלגות שנחשפת כאן היא להמחשה בלבד, לא פלט אמיתי של מודל.
    const sharedNote = useT().t.behindAi.introVisuals.viz.sharedNote;

    const round = content.rounds[roundIdx];
    const revealed = pick !== null;
    // דירוג יורד לחשיפה. הכפתורים נשארים בסדר המקורי כדי לא לחשוף את התשובה מראש.
    const sorted = [...round.options].sort((a, b) => b.p - a.p);
    const top = sorted[0];
    const matched = pick === top.token;
    const isLast = roundIdx === content.rounds.length - 1;
    const Next = dir === 'rtl' ? ChevronLeft : ChevronRight;

    const advance = () => { setRoundIdx((i) => i + 1); setPick(null); };
    const restart = () => { setRoundIdx(0); setPick(null); };

    return (
        <div dir={dir} className="relative mt-5 overflow-hidden rounded-3xl border border-amber-400/25 bg-slate-950/50 p-5 md:p-6">
            <div className="pointer-events-none absolute -top-14 end-6 h-28 w-52 rounded-full bg-amber-500/10 blur-[70px]" />

            <div className="relative">
                {/* כותרת הבונוס + מונה הסבבים */}
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <span className="inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-[0.12em] text-amber-300">
                            <Sparkles size={15} /> {content.eyebrow}
                        </span>
                        <h4 className="mt-1.5 text-lg font-black text-white md:text-2xl">{content.title}</h4>
                        <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">{content.subtitle}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-slate-600/60 bg-slate-900/60 px-3 py-1 text-sm font-bold text-slate-300">
                        {content.roundLabel} {roundIdx + 1} {content.ofLabel} {content.rounds.length}
                    </span>
                </div>

                {/* פאנל הפרומפט: הקשר + המשפט החתוך + סמן מהבהב (לפני), הטוקן הנבחר (אחרי) */}
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="rounded-md border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 text-[13px] font-bold text-cyan-200">
                            {round.context}
                        </span>
                        {/* הקראת שאלת הסבב: ההקשר + המשפט החתוך. הטקסט מתחלף עם הסבב. */}
                        <SpeakButton text={`${round.context}. ${round.prefix}`} />
                    </div>
                    <p className="text-lg font-bold leading-relaxed text-slate-100 md:text-xl">
                        {round.prefix}{' '}
                        {revealed ? (
                            <motion.span
                                initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 16 }}
                                className="rounded-md bg-emerald-500/20 px-1.5 text-emerald-200"
                            >
                                {top.token}
                            </motion.span>
                        ) : (
                            <span aria-hidden className={`inline-block h-5 w-[3px] translate-y-0.5 rounded-full bg-cyan-300 md:h-6 ${reduce ? '' : 'animate-pulse'}`} />
                        )}
                    </p>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                    {!revealed ? (
                        <motion.div
                            key="guess"
                            initial={reduce ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                        >
                            <p className="mb-2.5 mt-4 text-sm font-bold text-slate-400">{content.guessLabel}</p>
                            <div className="flex flex-wrap gap-2.5">
                                {round.options.map((o) => (
                                    <span key={o.token} className="relative inline-flex">
                                        <button
                                            type="button"
                                            onClick={() => setPick(o.token)}
                                            className="rounded-xl border border-slate-600/60 bg-slate-900/60 ps-4 pe-11 py-2.5 text-base font-bold text-slate-100 transition-colors hover:border-cyan-400/60 hover:bg-cyan-900/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                                        >
                                            {o.token}
                                        </button>
                                        {/* הקראת המועמד: אח של כפתור-הבחירה (button בתוך button אסור) */}
                                        <SpeakButton text={o.token} className="absolute end-1.5 top-1/2 z-10 -translate-y-1/2" />
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="reveal"
                            initial={reduce ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                        >
                            {/* ההתפלגות האמיתית, מדורגת. עמודה = הסתברות אמיתית (רוחב = p%). */}
                            <div className="mt-4 space-y-2">
                                {sorted.map((o) => {
                                    const isTop = o.token === top.token;
                                    const isPick = o.token === pick;
                                    // תגי "בחירת המנוע"/"הניחוש שלכם". במסך רחב הם צפים על העמודה,
                                    // במסך צר הם יורדים לשורה נפרדת מתחת לעמודה כדי לא לכסות את האחוז.
                                    const badges = (
                                        <>
                                            {isTop && <span className="rounded bg-emerald-950/70 px-1.5 py-0.5 text-[11px] font-bold text-emerald-200">{content.modelTop}</span>}
                                            {isPick && <span className="rounded border border-white/40 bg-slate-950/40 px-1.5 py-0.5 text-[11px] font-bold text-white">{content.yourPick}</span>}
                                        </>
                                    );
                                    return (
                                        <div key={o.token} className="flex items-center gap-3">
                                            <span className={`w-16 shrink-0 text-sm font-bold md:w-20 ${isTop ? 'text-emerald-200' : 'text-slate-200'}`}>{o.token}</span>
                                            <div className="min-w-0 flex-1">
                                                <div className={`relative h-8 overflow-hidden rounded-lg bg-slate-800/50 ${isPick ? 'ring-2 ring-white/40' : ''}`}>
                                                    <motion.div
                                                        className={`h-full rounded-lg ${isTop ? 'bg-gradient-to-l from-emerald-400 to-emerald-500' : 'bg-gradient-to-l from-cyan-500/70 to-cyan-700/50'}`}
                                                        initial={reduce ? false : { width: 0 }}
                                                        animate={{ width: `${o.p}%` }}
                                                        transition={reduce ? { duration: 0 } : { duration: 0.7, ease: 'easeOut' }}
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-between px-2.5">
                                                        <span className="hidden items-center gap-1.5 md:flex">{badges}</span>
                                                        <span className="text-sm font-black text-white" dir="ltr">{o.p}%</span>
                                                    </div>
                                                </div>
                                                {(isTop || isPick) && (
                                                    <div className="mt-1 flex flex-wrap gap-1 md:hidden">{badges}</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* כל שאר הטוקנים שהמנוע שקל, כמסה אחת */}
                                <div className="flex items-center gap-3 opacity-70">
                                    <span className="w-16 shrink-0 text-sm font-bold text-slate-400 md:w-20">{content.otherLabel}</span>
                                    <div className="relative h-8 flex-1 overflow-hidden rounded-lg bg-slate-800/40">
                                        <motion.div
                                            className="h-full rounded-lg bg-slate-600/40"
                                            initial={reduce ? false : { width: 0 }}
                                            animate={{ width: `${round.otherP}%` }}
                                            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: 'easeOut' }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-end px-2.5">
                                            <span className="text-sm font-bold text-slate-400" dir="ltr">{round.otherP}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{sharedNote}</p>

                            {/* הכרעה: צדקתם כמו המנוע, או שהמנוע העדיף אחרת */}
                            <div className={`relative mt-4 overflow-hidden rounded-xl border px-4 py-3 ${matched ? 'border-emerald-400/40 bg-emerald-900/20' : 'border-slate-600/50 bg-slate-900/50'}`}>
                                {matched && !reduce && (
                                    <motion.span
                                        aria-hidden
                                        className="pointer-events-none absolute inset-0"
                                        style={{ background: 'radial-gradient(closest-side, rgba(52,211,153,0.35), transparent)' }}
                                        initial={{ opacity: 0.9, scale: 0.7 }}
                                        animate={{ opacity: 0, scale: 1.5 }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                    />
                                )}
                                <p className="relative flex items-center gap-2 text-base font-black text-white">
                                    {matched && (
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
                                            <Check size={14} strokeWidth={3} />
                                        </span>
                                    )}
                                    {matched ? content.matchTitle : `${content.missTitle} "${top.token}"`}
                                    {/* הקראת ההכרעה והתובנה של הסבב הנוכחי (ובסבב האחרון גם הפאנץ') */}
                                    <SpeakButton
                                        text={speakJoin(
                                            matched ? content.matchTitle : `${content.missTitle} "${top.token}"`,
                                            round.insight,
                                            isLast && content.closing,
                                        )}
                                        className="ms-auto"
                                    />
                                </p>
                            </div>
                            <p className="mt-2.5 text-sm leading-relaxed text-slate-300 md:text-base">{round.insight}</p>

                            {/* ניווט: סבב הבא, או פאנץ' סיום + התחלה מחדש */}
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                <p className="text-sm font-bold text-amber-200 md:text-base">{isLast ? content.closing : ''}</p>
                                {isLast ? (
                                    <button
                                        type="button"
                                        onClick={restart}
                                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-600/60 px-4 py-2 text-sm font-bold text-slate-200 transition-colors hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60"
                                    >
                                        <RotateCcw size={15} /> {content.restart}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={advance}
                                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/15 px-5 py-2 text-sm font-black text-amber-100 transition-colors hover:bg-amber-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
                                    >
                                        {content.nextRound} <Next size={16} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
