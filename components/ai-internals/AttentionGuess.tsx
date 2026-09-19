"use client";

// ────────────────────────────────────────────────────────────────────────
// AttentionGuess - ניחוש הפתיחה של פרק 6 (Attention).
//
// לא מבחן ולא חלק מהניקוד. הלומד בוחר מודל חשיבה אחד מתוך ארבע השערות על איך
// המודל מחליט למה להתייחס. כל בחירה מקבלת סטטוס פדגוגי ומשוב מובנה: מה זה תופס
// נכון, מה זה מפספס, ומשפט גשר.
//
// i18n: כל הטקסט מגיע דרך props (content, cards, prompt) מהמילון לפי locale. המבנה
// (cue, statusTone) נשאר מטא-דאטה בעמוד. הכיוון (RTL/LTR) מגיע מ-dir.
//
// M13: אין כאן פורטרט מנטור ואין mentorMode. הרכיב אינו מייבא את Mentor, ולכן שום
// prop חסר אינו יכול להחזיר דמות. הקול האנושי הוא ResponseNote בלבד: שורת טקסט אחת
// באותו מבנה בדיוק בשתי התוצאות. אין בקובץ הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { HelpCircle, Sparkles, Highlighter, Globe, Check, ArrowDown, RotateCcw } from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import { ResponseNote } from './ResponseNote';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

export type Cue = 'spotlight' | 'highlighter' | 'nodes' | 'factcheck';
export type StatusTone = 'close' | 'partial' | 'common' | 'layer';

/** כרטיס השערה: טקסט מהמילון + מטא-דאטה מבני (cue, statusTone). */
export interface AttentionGuessCard {
    id: string;
    title: string;
    desc: string;
    cue: Cue;
    statusTone: StatusTone;
    statusLabel: string;
    getsRight: string;
    missesLabel: string;
    misses: string;
    bridge: string;
}

export interface AttentionGuessContent {
    eyebrow: string;
    title: string;
    subtitle: string;
    invite: string;
    getsRightLabel: string;
    revealButton: string;
    resetButton: string;
    revealTitle: string;
    revealCopy: string;
    cta: string;
}

interface AttentionGuessProps {
    content: AttentionGuessContent;
    cards: AttentionGuessCard[];
    prompt: string;
    dir: Direction;
    /** שפת ההקראה של התוכן (contentLocale). ברירת מחדל: שפת הממשק. */
    speechLocale?: Locale;
    /**
     * מזהה סקשן המעבדה שאליו כפתור ה-CTA גולל. ברירת המחדל 'attention-lab'
     * שומרת על התנהגות פרק 6 בדיוק. פרקים אחרים שמשתמשים באותו ניחוש מעבירים
     * את מזהה המעבדה שלהם (למשל 'context-window-lab' בפרק 7).
     */
    labTargetId?: string;
    /**
     * משפטי התגובה האנושית הספציפיים לפרק, אחד לכל תוצאה. פאנל המשוב מקבל שורת תגובה
     * אחידה בשתי התוצאות, וצ׳יפ הסטטוס נשאר שכבת הסטטוס העצמאית לצידה.
     */
    mentorResponse: { correct: string; wrong: string };
}

const STATUS_TONE: Record<StatusTone, string> = {
    close: 'border-emerald-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--at-l)_var(--bts-tint-mix),var(--at-d))_20%,transparent)] [--at-d:var(--color-emerald-900)] [--at-l:var(--color-emerald-500)] text-emerald-200',
    partial: 'border-sky-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--at-l)_var(--bts-tint-mix),var(--at-d))_20%,transparent)] [--at-d:var(--color-sky-900)] [--at-l:var(--color-sky-500)] text-sky-200',
    common: 'border-amber-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--at-l)_var(--bts-tint-mix),var(--at-d))_20%,transparent)] [--at-d:var(--color-amber-900)] [--at-l:var(--color-amber-500)] text-amber-200',
    layer: 'border-indigo-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--at-l)_var(--bts-tint-mix),var(--at-d))_20%,transparent)] [--at-d:var(--color-indigo-900)] [--at-l:var(--color-indigo-500)] text-indigo-200',
};

/* ── איור-מיקרו לכל השערה. דקורטיבי בלבד (aria-hidden). ── */
function CueIllustration({ cue }: { cue: Cue }) {
    if (cue === 'spotlight') {
        return (
            <div className="flex items-center gap-1" aria-hidden>
                <span className="h-1.5 w-4 rounded-sm bg-slate-600/70" />
                <span className="h-1.5 w-4 rounded-sm bg-slate-600/70" />
                <span className="h-2.5 w-5 rounded-sm bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
            </div>
        );
    }
    if (cue === 'highlighter') {
        return (
            <div className="flex items-center gap-2" aria-hidden>
                <Highlighter size={16} className="text-violet-300" />
                <div className="flex flex-col gap-1">
                    <span className="block h-1.5 w-8 rounded-full bg-violet-500/60" />
                    <span className="block h-1.5 w-5 rounded-full bg-violet-500/40" />
                </div>
            </div>
        );
    }
    if (cue === 'nodes') {
        return (
            <div className="flex items-center" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-slate-500/70" />
                <span className="h-px w-3 bg-slate-600" />
                <span className="h-3 w-3 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.75)]" />
                <span className="h-px w-3 bg-violet-400/70" />
                <span className="h-2 w-2 rounded-full bg-violet-300" />
            </div>
        );
    }
    // factcheck
    return (
        <div className="flex items-center gap-2" aria-hidden>
            <Globe size={18} className="text-[var(--bts-text-secondary)]" />
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-500/80">
                <Check size={11} strokeWidth={3} className="text-white" />
            </span>
        </div>
    );
}

export const AttentionGuess: React.FC<AttentionGuessProps> = ({ content, cards, prompt, dir, speechLocale, labTargetId = 'attention-lab', mentorResponse }) => {
    const reduce = useReducedMotion();
    const [chosenId, setChosenId] = useState<string | null>(null);
    const [revealed, setRevealed] = useState(false);

    const chosen = cards.find((c) => c.id === chosenId) ?? null;
    const choiceMade = chosenId !== null;
    // ההשערה הקרובה היא תוצאת ההצלחה של הניחוש הזה; כל שאר הגוונים הם תוצאת הטעות.
    const respondLine = !chosen
        ? undefined
        : chosen.statusTone === 'close' ? mentorResponse.correct : mentorResponse.wrong;

    const goToLab = () => {
        const el = typeof document !== 'undefined' ? document.getElementById(labTargetId) : null;
        if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };

    // איפוס הניחוש בלבד: מנקה בחירה ותובנה, ומחזיר למצב שלפני הבחירה.
    const resetGuess = () => {
        setChosenId(null);
        setRevealed(false);
    };

    const cardClasses = (id: string): string => {
        if (id === chosenId) {
            return `border-violet-400/70 bg-[var(--bts-state-selected-bg)] ${reduce ? '' : 'shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)]'}`;
        }
        if (choiceMade) return 'border-[var(--bts-fill-soft)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] opacity-70';
        return 'border-[var(--bts-border-mid)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] hover:border-violet-500/50 hover:bg-[color-mix(in_oklab,color-mix(in_oklab,var(--at-l)_var(--bts-tint-mix),var(--at-d))_10%,transparent)] [--at-d:var(--color-violet-900)] [--at-l:var(--color-violet-500)]';
    };

    return (
        <div
            dir={dir}
            className="relative overflow-hidden rounded-[2rem] border border-[var(--bts-border)] bg-[var(--bts-surface)] p-6 backdrop-blur-xl md:p-8"
        >
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[80px]" />

            <div className="relative z-10">
                {/* ההזמנה לנחש לפני הבחירה: טקסט גוף בלבד, גלוי גם בטלפון. */}
                {!choiceMade && (
                    <p className="mx-auto mb-5 max-w-md text-center text-[13px] font-medium leading-snug text-[var(--bts-text-muted)]">
                        {content.invite}
                    </p>
                )}
                <div className="text-center">
                    <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400">
                        <HelpCircle size={14} /> {content.eyebrow}
                    </span>
                    <div className="mb-2 flex items-center justify-center gap-2.5">
                        <h3 className="text-xl font-black text-[var(--bts-text-primary)] md:text-3xl">{content.title}</h3>
                        {/* הקראה אחת לשאלה יחד עם שורת ההסבר שמתחתיה */}
                        <SpeakButton text={`${content.title} ${content.subtitle}`} speechLocale={speechLocale} />
                    </div>
                    <p className="mx-auto mb-4 max-w-xl text-sm text-[var(--bts-text-muted)] md:text-base">{content.subtitle}</p>
                    <p className="mx-auto mb-7 max-w-xl rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3 text-sm font-bold text-[var(--bts-text-body)]">
                        {prompt}
                    </p>
                </div>

                {/* רשת 2x2 של כרטיסי השערה */}
                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {cards.map((card) => (
                        <div key={card.id} className="relative">
                            <motion.button
                                type="button"
                                onClick={() => { setChosenId(card.id); setRevealed(false); }}
                                aria-pressed={card.id === chosenId}
                                aria-label={`${card.title}. ${card.desc}`}
                                whileHover={{ scale: reduce ? 1 : 1.015 }}
                                whileTap={{ scale: reduce ? 1 : 0.985 }}
                                className={`relative flex h-full w-full flex-col gap-2.5 rounded-2xl border p-4 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--bts-focus-ring)_var(--bts-tint-mix),color-mix(in_oklab,var(--color-violet-400)_60%,transparent))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bts-focus-ring-offset)] ${cardClasses(card.id)}`}
                            >
                                <span className="w-fit rounded-xl border border-[var(--bts-divider-soft)] bg-[color-mix(in_oklab,var(--bts-panel-to)_50%,transparent)] px-2.5 py-2">
                                    <CueIllustration cue={card.cue} />
                                </span>
                                <div>
                                    <div className="text-base font-black text-[var(--bts-text-primary)]">{card.title}</div>
                                    <p className="mt-1 text-sm leading-relaxed text-[var(--bts-text-secondary)]">{card.desc}</p>
                                </div>
                            </motion.button>
                            {/* הקראת הכרטיס: אח של כפתור-הכרטיס (button בתוך button אסור) */}
                            <SpeakButton text={`${card.title}. ${card.desc}`} className="absolute end-2 top-2 z-10" speechLocale={speechLocale} />
                        </div>
                    ))}
                </div>

                {/* משוב מובנה: סטטוס, מה תופס נכון, מה מפספס, גשר, ושורת התגובה האנושית */}
                <AnimatePresence initial={false}>
                    {chosen && (
                        <motion.div
                            key={chosen.id}
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                            className="mx-auto mt-7 max-w-2xl"
                            role="status"
                            aria-live="polite"
                        >
                            <div className="rounded-2xl border border-violet-400/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--at-l)_var(--bts-tint-mix),var(--at-d))_15%,transparent)] [--at-d:var(--color-violet-900)] [--at-l:var(--color-violet-500)] p-5">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${STATUS_TONE[chosen.statusTone]}`}>
                                                {chosen.statusLabel}
                                            </span>
                                            {/* הקראת כל תכולת פאנל המשוב של הבחירה הנוכחית */}
                                            <SpeakButton
                                                text={speakJoin(
                                                    chosen.statusLabel,
                                                    `${content.getsRightLabel}: ${chosen.getsRight}`,
                                                    `${chosen.missesLabel}: ${chosen.misses}`,
                                                    chosen.bridge,
                                                    respondLine,
                                                )}
                                                speechLocale={speechLocale}
                                            />
                                        </div>

                                        <div className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--bts-text-body)]">
                                            <p>
                                                <span className="font-bold text-emerald-300">{content.getsRightLabel}: </span>
                                                {chosen.getsRight}
                                            </p>
                                            <p>
                                                <span className={`font-bold ${chosen.statusTone === 'close' ? 'text-sky-300' : 'text-amber-300'}`}>{chosen.missesLabel}: </span>
                                                {chosen.misses}
                                            </p>
                                            <p className="border-s-2 border-violet-400/50 ps-3 font-medium text-[var(--bts-text-bright)]">
                                                {chosen.bridge}
                                            </p>
                                        </div>

                                        <ResponseNote line={respondLine} />

                                        <div className="mt-4 flex flex-wrap items-center gap-3">
                                            {!revealed && (
                                                <button
                                                    type="button"
                                                    onClick={() => setRevealed(true)}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--at-l)_var(--bts-tint-mix),var(--at-d))_20%,transparent)] [--at-d:var(--color-emerald-900)] [--at-l:var(--color-emerald-500)] px-4 py-1.5 text-sm font-bold text-emerald-200 transition-colors hover:bg-[color-mix(in_oklab,color-mix(in_oklab,var(--at-l)_var(--bts-tint-mix),var(--at-d))_35%,transparent)]"
                                                >
                                                    <Sparkles size={14} /> {content.revealButton}
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={resetGuess}
                                                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--bts-border-mid)] bg-[var(--bts-sub-fill-soft)] px-4 py-1.5 text-sm font-bold text-[var(--bts-text-secondary)] transition-colors hover:border-violet-500/40 hover:text-violet-200"
                                            >
                                                <RotateCcw size={13} /> {content.resetButton}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* התובנה הגדולה: נפתחת בלחיצה ומובילה אל המעבדה */}
                <AnimatePresence initial={false}>
                    {revealed && (
                        <motion.div
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.35 }}
                            className="mx-auto mt-4 max-w-2xl"
                        >
                            <div className="rounded-2xl border border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--at-l)_var(--bts-tint-mix),var(--at-d))_15%,transparent)] [--at-d:var(--color-emerald-950)] [--at-l:var(--color-emerald-500)] p-5 text-center">
                                <div className="flex items-center justify-center gap-2.5">
                                    <p className="inline-flex items-center gap-2 text-base font-bold text-emerald-200 md:text-lg">
                                        <Sparkles size={16} /> {content.revealTitle}
                                    </p>
                                    {/* הקראת התובנה הגדולה הנחשפת */}
                                    <SpeakButton text={speakJoin(content.revealTitle, content.revealCopy)} speechLocale={speechLocale} />
                                </div>
                                <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[var(--bts-text-secondary)]">{content.revealCopy}</p>

                                <div className="mt-4 flex flex-col items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={goToLab}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--at-l)_var(--bts-tint-mix),var(--at-d))_25%,transparent)] [--at-d:var(--color-violet-900)] [--at-l:var(--color-violet-500)] px-5 py-2 text-sm font-bold text-violet-100 transition-colors hover:bg-[color-mix(in_oklab,color-mix(in_oklab,var(--at-l)_var(--bts-tint-mix),var(--at-d))_40%,transparent)]"
                                    >
                                        {content.cta}
                                        {reduce ? (
                                            <ArrowDown size={15} aria-hidden />
                                        ) : (
                                            <motion.span
                                                animate={{ y: [0, 3, 0] }}
                                                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                                                className="inline-flex"
                                                aria-hidden
                                            >
                                                <ArrowDown size={15} />
                                            </motion.span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
