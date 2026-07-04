"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { HelpCircle, Lightbulb, ArrowDown, RotateCcw } from 'lucide-react';

import { Mentor } from '@/components/ai-internals/Mentor';
import { GuessInvite, GuessButton, ShimmerFrame, AuroraBloom, SparkleBurst, DrawCheck } from '@/components/ai-internals/GuessVerdict';
import { SpeakButton } from '@/components/ai-internals/SpeakButton';
import type { FlowMode } from '@/components/ai-internals/types';
import { useT } from '@/i18n/useT';

interface PredictDecisionProps {
    mode: FlowMode;
}

// מטא-דאטה מבני של מילות הניחוש: המזהה (מפתח למילון), ההסתברות להמחשה, וסימון
// המילה הנכונה. הטקסט עצמו מגיע מהמילון לפי id (pd.words), כדי שהוא יהיה טבעי בכל שפה.
// ההסתברויות הן המחשה לימודית בלבד (כמו שאר הלוח בפרק 1), לא פלט מודל אמיתי.
const WORD_META: { id: string; prob: number; correct?: boolean }[] = [
    { id: 'absurd', prob: 3 },
    { id: 'arrived', prob: 88, correct: true },
    { id: 'plausible', prob: 9 },
];

/**
 * רגע ניחוש לפני ראש הקריאה: "נחשו את המילה הבאה". הלומד משלים מילה אחת במשפט
 * (עוגן החבילות), בוחר מתוך שלוש מילים, ומגלה שהמנוע מדרג מילים לפי הסתברות ובוחר
 * את הסבירה ביותר - בדיוק מה שראש הקריאה שמתחת מראה חי, מילה אחר מילה. אין כאן
 * חישוב מודל אמיתי: זה רגע מעורבות "ניחוש -> גילוי" שמכין את הקרקע למעבדה שאחריו.
 *
 * מנגנון הניחוש (משחק המילה + פסי הדירוג) ייחודי לפרק, אבל התגובה שאחרי הבחירה
 * משתמשת באותן אבני-בניין פרימיום של שאר הלומדה (ShimmerFrame, AuroraBloom,
 * DrawCheck, SparkleBurst), כדי שהרגע ירגיש זהה ומרשים בכל מקום.
 */
export const PredictDecision: React.FC<PredictDecisionProps> = ({ mode }) => {
    const reduce = useReducedMotion();
    const isChat = mode === 'chat';
    const { t, dir } = useT();
    const isRtl = dir === 'rtl';
    const pd = t.behindAi.chapter1.visuals.predict;

    const [guessId, setGuessId] = useState<string | null>(null);
    const answered = guessId !== null;
    const chosen = WORD_META.find((w) => w.id === guessId) ?? null;
    const correct = !!chosen?.correct;

    // המילים מדורגות לפי הסתברות (יורד) להמחשת הדירוג בגילוי.
    const ranked = [...WORD_META].sort((a, b) => b.prob - a.prob);
    const wordText = (id: string) => (pd.words as Record<string, string>)[id] ?? '';

    // צבעי ההדגשה לפי המצב (Chat ציאן, Agent סגול). מחרוזות מלאות כדי ש-Tailwind יזהה אותן.
    const accentText = isChat ? 'text-cyan-300' : 'text-purple-300';
    const accentTitle = isChat ? 'text-cyan-100' : 'text-purple-100';
    const accentBorder = isChat ? 'border-cyan-500/50' : 'border-purple-500/50';
    const accentBg = isChat ? 'bg-cyan-900/25' : 'bg-purple-900/25';
    const accentGlow = isChat ? 'bg-cyan-500/10' : 'bg-purple-500/10';
    const accentBar = isChat ? 'bg-cyan-400' : 'bg-purple-400';
    const accentRgb = isChat ? '34,211,238' : '168,85,247';
    const innerBg = isChat
        ? 'bg-gradient-to-b from-cyan-950 to-slate-950'
        : 'bg-gradient-to-b from-purple-950 to-slate-950';
    const optionHover = isChat
        ? 'hover:border-cyan-500/60 hover:bg-cyan-900/15'
        : 'hover:border-purple-500/60 hover:bg-purple-900/15';

    // המנטור הפנימי מגיב לתוצאה: אחרי ניחוש נכון חוגג, אחרי טעות מרגיע. ללא בועת דיבור.
    const mentorPose = correct ? ('celebrate' as const) : ('reassure' as const);

    // גוף פאנל הגילוי: זהה בשני המצבים חוץ מהאייקון והכותרת. מכיל את פסי הדירוג
    // (הגשר לראש הקריאה) ואת שורת הגשר, שמופיעים בין אם הניחוש נכון ובין אם לא.
    const panelBody = (
        <div className="relative flex items-start gap-4">
            <div className="hidden shrink-0 self-center sm:block">
                <Mentor key={mentorPose} pose={mentorPose} width={correct ? 176 : 172} float={false} glow={false} flip={!isRtl} />
            </div>
            <div className="flex-1 text-start">
                <div className="flex items-center gap-2">
                    {correct ? (
                        <DrawCheck colorClass={accentText} reduce={!!reduce} size={24} />
                    ) : (
                        <motion.span
                            aria-hidden
                            animate={reduce ? {} : { scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }}
                            transition={reduce ? {} : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                            className="inline-flex"
                        >
                            <Lightbulb size={20} className="shrink-0 text-amber-300" />
                        </motion.span>
                    )}
                    {correct ? (
                        <motion.span
                            initial={reduce ? false : { opacity: 0, y: 6, filter: 'blur(6px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.12, ease: 'easeOut' }}
                            className={`text-lg font-black md:text-xl ${accentTitle}`}
                        >
                            {pd.correctTitle}
                        </motion.span>
                    ) : (
                        <span className="text-lg font-black text-amber-200 md:text-xl">{pd.wrongTitle}</span>
                    )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">{correct ? pd.correctBody : pd.wrongBody}</p>

                {/* דירוג המילים: בר לכל מילה לפי הסתברות (המחשה), הנכונה מודגשת */}
                <div className="mt-4">
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">{pd.rankingLabel}</p>
                    <div className="flex flex-col gap-1.5">
                        {ranked.map((w, i) => (
                            <div key={w.id} className="flex items-center gap-2.5">
                                <span className={`w-20 shrink-0 truncate text-sm font-bold ${w.correct ? accentText : 'text-slate-300'}`}>
                                    {wordText(w.id)}
                                </span>
                                <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800/70">
                                    <motion.span
                                        className={`absolute inset-y-0 rounded-full ${w.correct ? accentBar : 'bg-slate-500/55'} ${isRtl ? 'right-0' : 'left-0'}`}
                                        initial={reduce ? false : { width: 0 }}
                                        animate={{ width: `${w.prob}%` }}
                                        transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.1 + i * 0.1, ease: 'easeOut' }}
                                    />
                                </div>
                                <span className="w-9 shrink-0 text-end text-xs font-bold text-slate-400">{w.prob}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2.5">
                    <span className={`inline-flex items-center gap-1.5 border-s-2 ps-3 text-sm font-bold ${accentBorder} ${accentTitle}`}>
                        {pd.bridge}
                        {!reduce ? (
                            <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} className="inline-flex" aria-hidden>
                                <ArrowDown size={15} />
                            </motion.span>
                        ) : (
                            <ArrowDown size={15} aria-hidden />
                        )}
                    </span>
                    <GuessButton variant="ghost" onClick={() => setGuessId(null)} leadingIcon={<RotateCcw size={13} />}>
                        {pd.guessAgain}
                    </GuessButton>
                </div>
            </div>
        </div>
    );

    return (
        <div
            dir={dir}
            className="relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl md:p-8"
        >
            <div className={`pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full ${accentGlow} blur-[80px]`} />

            <div className="relative">
                {/* מנטור הזמנה: משותף לכל הפרקים - דמות חושבת ממורכזת, נעלמת אחרי הניחוש */}
                {!answered && <GuessInvite pose="think" width={156} />}

                <div className="text-center">
                    <span className={`mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] ${accentText}`}>
                        <HelpCircle size={14} /> {pd.eyebrow}
                    </span>
                    <div className="mb-2 flex items-center justify-center gap-2.5">
                        <h3 className="text-xl font-black text-white md:text-2xl">{pd.question}</h3>
                        {/* הקראה אחת לשאלה יחד עם שורת ההסבר שמתחתיה */}
                        <SpeakButton text={`${pd.question} ${pd.subtitle}`} />
                    </div>
                    <p className="mx-auto mb-6 max-w-xl text-sm text-slate-400">{pd.subtitle}</p>
                </div>

                {/* המשפט עם החסר: סמן מהבהב לפני הבחירה, מילה ש"נשתלת" פנימה אחרי הבחירה */}
                <div
                    className={`mx-auto mb-6 max-w-xl rounded-2xl border bg-slate-950/50 px-5 py-5 text-center transition-colors ${
                        answered ? (correct ? accentBorder : 'border-amber-400/45') : 'border-slate-700/60'
                    }`}
                >
                    <p className="text-lg font-bold leading-relaxed text-slate-100 md:text-xl">
                        {pd.sentenceLead}
                        {!answered ? (
                            <span className={`mx-1 inline-flex min-w-[3.5rem] items-center justify-center rounded-md border-b-2 px-2 align-baseline ${accentBorder}`}>
                                <span className={`font-black ${accentText} ${reduce ? '' : 'animate-pulse'}`} aria-hidden>▌</span>
                            </span>
                        ) : (
                            <motion.span
                                initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 16 }}
                                className={`mx-1.5 inline-block rounded-lg px-2.5 py-0.5 font-black ${correct ? `${accentBg} ${accentText}` : 'bg-amber-900/30 text-amber-200'}`}
                            >
                                {wordText(guessId)}
                            </motion.span>
                        )}
                        {pd.sentenceTail}
                    </p>
                </div>

                {/* מילים לבחירה (לפני הגילוי) */}
                {!answered && (
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {WORD_META.map((w) => (
                            <span key={w.id} className="relative inline-flex">
                                <motion.button
                                    type="button"
                                    onClick={() => setGuessId(w.id)}
                                    aria-label={wordText(w.id)}
                                    whileHover={reduce ? undefined : { scale: 1.04 }}
                                    whileTap={reduce ? undefined : { scale: 0.97 }}
                                    className={`rounded-2xl border border-slate-700/60 bg-slate-800/40 ps-5 pe-12 py-3 text-base font-black text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${optionHover}`}
                                >
                                    {wordText(w.id)}
                                </motion.button>
                                {/* הקראת המילה: אח של כפתור-הבחירה (button בתוך button אסור) */}
                                <SpeakButton text={wordText(w.id)} className="absolute end-2 top-1/2 z-10 -translate-y-1/2" />
                            </span>
                        ))}
                    </div>
                )}

                {/* גילוי: מסגרת-אור פרימיום (הצלחה) או תיבה חמה ורגועה (טעות), עם דירוג המילים בפנים */}
                <AnimatePresence>
                    {answered && (
                        <motion.div
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="mx-auto max-w-2xl"
                            role="status"
                            aria-live="polite"
                        >
                            {correct ? (
                                <ShimmerFrame rgb={accentRgb} reduce={!!reduce} innerClassName={`p-5 md:p-6 ${innerBg}`}>
                                    {!reduce && <AuroraBloom rgb={accentRgb} />}
                                    {!reduce && <SparkleBurst colorClass={accentText} />}
                                    {panelBody}
                                </ShimmerFrame>
                            ) : (
                                <div className="relative overflow-hidden rounded-2xl border border-amber-400/45 bg-gradient-to-b from-amber-900/[0.16] to-slate-950/60 p-5 md:p-6">
                                    {!reduce && (
                                        <motion.div
                                            aria-hidden
                                            className="pointer-events-none absolute -start-6 -top-8 h-36 w-36 rounded-full blur-2xl"
                                            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, rgba(245,158,11,0) 70%)' }}
                                            initial={{ scale: 0.6, opacity: 0 }}
                                            animate={{ scale: 1.1, opacity: 0.5 }}
                                            transition={{ duration: 0.9, ease: 'easeOut' }}
                                        />
                                    )}
                                    {panelBody}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
