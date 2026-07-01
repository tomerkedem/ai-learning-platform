"use client";

// ────────────────────────────────────────────────────────────────────────
// DiscoveryGuess - רכיב ניחוש-פתיחה גנרי, מונחה-תוכן, ללומדה "מאחורי הקלעים".
//
// זהו הכללה של דפוס הניחוש שהוכיח את עצמו בפרק 8 (AttentionGuess), כך שפרקים
// נוספים יוכלו להשתמש בו בלי העתקה. כל התוכן (כותרות, כרטיסים, משוב, מנטורים)
// מגיע דרך props, והרכיב מספק את ההתנהגות: בחירה מחייבת אחת, משוב מובנה עם
// סטטוס פדגוגי, חקירת אפשרויות אחרות, חשיפת תובנה מדורגת, ואיפוס.
//
// לא מבחן ולא חלק מהניקוד. אין צבעי הצלחה/כישלון על הכרטיסים (כולם זוהרים בסגול
// אחיד). הסטטוס מובחן רק בצ׳יפ קטן. כל פוזת מנטור נבחרת לפי משמעות המצב.
//
// פרק 8 הקפוא אינו נוגע בקובץ הזה ואינו עובר אליו במשימה זו.
// אין מקף ארוך, מקף בינוני או נקודה-פסיק בתוך טקסט עברית.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { HelpCircle, Sparkles, ArrowDown, RotateCcw, type LucideIcon } from 'lucide-react';
import { Mentor, type MentorPose } from './Mentor';
import { GuessButton } from './GuessButton';

/** גוון הצ׳יפ של הסטטוס. precise=הצלחה, partial=חלקי, common=טעות נפוצה, layer=שכבה אחרת. */
export type GuessTone = 'precise' | 'partial' | 'common' | 'layer';

export interface DiscoveryGuessCard {
    id: string;
    title: string;
    desc: string;
    /** אייקון lucide לתג הכרטיס. אם חסר, מוצג מספר סידורי. */
    icon?: LucideIcon;
    statusLabel: string;
    statusTone: GuessTone;
    mentorPose: MentorPose;
    getsRight: string;
    /** תווית השורה השנייה: לרוב "מה זה מפספס", ולכרטיס הנכון "מה נשאר לראות". */
    missesLabel: string;
    misses: string;
    bridge: string;
}

export interface DiscoveryGuessContent {
    eyebrow: string;
    title: string;
    subtitle: string;
    /** משפט מנטור ההזמנה שלפני הבחירה. */
    invite: string;
    invitePose: MentorPose;
    /** פרומפט עוגן אופציונלי שמוצג בכותרת. */
    prompt?: string;
    getsRightLabel: string;
    revealButton: string;
    revealTitle: string;
    revealCopy: string;
    revealPose: MentorPose;
    cta: string;
    /** id של אלמנט שאליו גוללים בלחיצת ה-CTA (למשל המעבדה). */
    ctaTargetId?: string;
    resetButton: string;
    exploreHint: string;
}

const TONE_CHIP: Record<GuessTone, string> = {
    precise: 'border-emerald-400/40 bg-emerald-900/20 text-emerald-200',
    partial: 'border-sky-400/40 bg-sky-900/20 text-sky-200',
    common: 'border-amber-400/40 bg-amber-900/20 text-amber-200',
    layer: 'border-indigo-400/40 bg-indigo-900/20 text-indigo-200',
};

// גוון הכרטיס הנבחר לפי סטטוס: רקע שקוף-רך, מסגרת עדינה, וזוהר עדין. רק הכרטיס
// שנבחר מקבל גוון. ההבדלי-עוצמה קטנים בכוונה, כדי שהבהירות לא תיראה כמו סולם ציון.
const TONE_SELECTED: Record<GuessTone, { base: string; glow: string }> = {
    precise: { base: 'border-emerald-400/60 bg-emerald-900/20', glow: 'shadow-[0_0_36px_-10px_rgba(16,185,129,0.50)]' },
    common: { base: 'border-amber-400/55 bg-amber-900/[0.18]', glow: 'shadow-[0_0_32px_-11px_rgba(245,158,11,0.45)]' },
    partial: { base: 'border-sky-400/55 bg-sky-900/15', glow: 'shadow-[0_0_30px_-12px_rgba(56,189,248,0.40)]' },
    layer: { base: 'border-indigo-400/55 bg-indigo-900/15', glow: 'shadow-[0_0_30px_-12px_rgba(129,140,248,0.40)]' },
};

// פאנל המשוב תואם לאותה משפחת גוון כמו הכרטיס הנבחר, באטימות נמוכה עוד יותר.
const TONE_PANEL: Record<GuessTone, string> = {
    precise: 'border-emerald-400/30 bg-emerald-900/[0.12]',
    common: 'border-amber-400/30 bg-amber-900/10',
    partial: 'border-sky-400/30 bg-sky-900/[0.12]',
    layer: 'border-indigo-400/30 bg-indigo-900/[0.12]',
};

export const DiscoveryGuess: React.FC<{ content: DiscoveryGuessContent; cards: DiscoveryGuessCard[] }> = ({ content, cards }) => {
    const reduce = useReducedMotion();
    const [chosenId, setChosenId] = useState<string | null>(null);
    const [revealed, setRevealed] = useState(false);

    const chosen = cards.find((c) => c.id === chosenId) ?? null;
    const choiceMade = chosenId !== null;

    const goToTarget = () => {
        if (!content.ctaTargetId) return;
        const el = typeof document !== 'undefined' ? document.getElementById(content.ctaTargetId) : null;
        if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };

    const resetGuess = () => {
        setChosenId(null);
        setRevealed(false);
    };

    const cardClasses = (card: DiscoveryGuessCard): string => {
        if (card.id === chosenId) {
            const t = TONE_SELECTED[card.statusTone];
            return `${t.base} ${reduce ? '' : t.glow}`;
        }
        if (choiceMade) return 'border-white/5 bg-slate-900/40 opacity-70';
        return 'border-slate-700/60 bg-slate-900/50 hover:border-violet-500/50 hover:bg-violet-900/10';
    };

    return (
        <div
            className="relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl md:p-8"
        >
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[80px]" />

            <div className="relative z-10">
                {/* מנטור הזמנה: דמות-צד תומכת, ממורכזת מעל הכותרת ומעל רשת התשובות,
                    כך שלעולם אינה חופפת כרטיס או טקסט. נעלמת ברגע שנבחרת אפשרות. */}
                {!choiceMade && (
                    <div className="mb-5 hidden flex-col items-center sm:flex">
                        <Mentor pose={content.invitePose} width={108} glow={false} />
                        <p className="mt-1 max-w-xs text-center text-[12px] font-medium leading-snug text-slate-400">
                            {content.invite}
                        </p>
                    </div>
                )}

                <div className="text-center">
                    <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400">
                        <HelpCircle size={14} /> {content.eyebrow}
                    </span>
                    <h3 className="mb-2 text-xl font-black text-white md:text-3xl">{content.title}</h3>
                    <p className="mx-auto mb-4 max-w-xl text-sm text-slate-400 md:text-base">{content.subtitle}</p>
                    {content.prompt && (
                        <p className="mx-auto mb-7 max-w-xl rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 text-sm font-bold text-slate-200">
                            {content.prompt}
                        </p>
                    )}
                </div>

                {/* רשת 2x2 של כרטיסי ההשערה */}
                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {cards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <motion.button
                                key={card.id}
                                type="button"
                                onClick={() => { setChosenId(card.id); setRevealed(false); }}
                                aria-pressed={card.id === chosenId}
                                aria-label={`${card.title}. ${card.desc}`}
                                whileHover={reduce ? undefined : { scale: 1.015 }}
                                whileTap={reduce ? undefined : { scale: 0.985 }}
                                className={`relative flex flex-col gap-2.5 rounded-2xl border p-4 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${cardClasses(card)}`}
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950/50">
                                    {Icon ? (
                                        <Icon size={18} className="text-violet-300" />
                                    ) : (
                                        <span className="font-mono text-sm font-bold text-violet-300" dir="ltr">{i + 1}</span>
                                    )}
                                </span>
                                <div>
                                    <div className="text-base font-black text-white">{card.title}</div>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-300">{card.desc}</p>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* משוב מובנה: סטטוס, מה תופס נכון, מה מפספס, גשר, ומנטור מגיב לפי הסטטוס */}
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
                            <div className={`rounded-2xl border p-5 ${TONE_PANEL[chosen.statusTone]}`}>
                                <div className="flex items-start gap-4">
                                    <div className="hidden shrink-0 self-center sm:block">
                                        <Mentor pose={chosen.mentorPose} width={68} glow={false} float={false} />
                                    </div>

                                    <div className="flex-1">
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${TONE_CHIP[chosen.statusTone]}`}>
                                            {chosen.statusLabel}
                                        </span>

                                        <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-200">
                                            <p>
                                                <span className="font-bold text-emerald-300">{content.getsRightLabel}: </span>
                                                {chosen.getsRight}
                                            </p>
                                            <p>
                                                <span className={`font-bold ${chosen.statusTone === 'precise' ? 'text-sky-300' : 'text-amber-300'}`}>{chosen.missesLabel}: </span>
                                                {chosen.misses}
                                            </p>
                                            <p className="border-s-2 border-violet-400/50 ps-3 font-medium text-slate-100">
                                                {chosen.bridge}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center gap-3">
                                            {!revealed && (
                                                <GuessButton
                                                    onClick={() => setRevealed(true)}
                                                    variant="primary"
                                                    rgb="16,185,129"
                                                    reduce={!!reduce}
                                                    leadingIcon={<Sparkles size={14} />}
                                                >
                                                    {content.revealButton}
                                                </GuessButton>
                                            )}
                                            <GuessButton
                                                onClick={resetGuess}
                                                variant="ghost"
                                                reduce={!!reduce}
                                                leadingIcon={<RotateCcw size={13} />}
                                            >
                                                {content.resetButton}
                                            </GuessButton>
                                            {!revealed && content.exploreHint && (
                                                <span className="text-xs text-slate-500">{content.exploreHint}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* התובנה הגדולה: נפתחת בלחיצה, מנטור מוביל אל היעד (למשל המעבדה) */}
                <AnimatePresence initial={false}>
                    {revealed && (
                        <motion.div
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.35 }}
                            className="mx-auto mt-4 max-w-2xl"
                        >
                            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-5 text-center">
                                <p className="inline-flex items-center gap-2 text-base font-bold text-emerald-200 md:text-lg">
                                    <Sparkles size={16} /> {content.revealTitle}
                                </p>
                                <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-300">{content.revealCopy}</p>

                                <div className="mt-4 flex flex-col items-center gap-2">
                                    <div className="hidden sm:block">
                                        <Mentor pose={content.revealPose} width={72} glow={false} float={false} />
                                    </div>
                                    {content.ctaTargetId && (
                                        <GuessButton
                                            onClick={goToTarget}
                                            variant="primary"
                                            rgb="168,85,247"
                                            reduce={!!reduce}
                                            sheen
                                            trailingIcon={reduce ? (
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
                                        >
                                            {content.cta}
                                        </GuessButton>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
