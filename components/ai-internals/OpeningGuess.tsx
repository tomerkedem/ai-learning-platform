"use client";

// ────────────────────────────────────────────────────────────────────────
// OpeningGuess - רכיב ניחוש הפתיחה המשותף בלומדה, מסוג בורר-כרטיסים. הלומד בוחר
// השערה אחת; הכרטיס המדויק מזוהה לפי statusTone === 'precise'. בשימוש כל הפרקים
// עם ניחוש פתיחה מסוג כרטיסים (2, 3, 5, 8, 10).
//
// זהו ה-body הייחודי של הניחוש בלבד. משפט ההזמנה והתגובה שאחרי הבחירה מגיעים
// מהרכיבים המשותפים GuessInvite ו-GuessVerdict, כדי שההתנהגות והמראה יהיו זהים בכל
// הלומדה (אותה הזמנה, אותה תגובת הצלחה/טעות, מנגנון ניחוש גמיש לכל פרק).
//
// M13: אין כאן פורטרט מנטור ואין mentorMode. הרכיב אינו יכול לרנדר דמות בשום מסלול,
// ולכן פרק חדש שישכח prop יקבל את ההתנהגות הנכונה בלי לדעת עליה.
//
// גם טיפוסי הכרטיס והתוכן (GuessTone, DiscoveryGuessCard, DiscoveryGuessContent)
// מוגדרים כאן ומיוצאים, כבית המשותף שלהם. בלי בועת דיבור למנטור. אין מקף ארוך, מקף
// בינוני או נקודה-פסיק בטקסט עברית.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HelpCircle, Check, type LucideIcon } from 'lucide-react';
import { GuessInvite, GuessVerdict } from './GuessVerdict';
import { SpeakButton } from './SpeakButton';
import type { Locale } from '@/i18n/config';

/** גוון הצ׳יפ של הסטטוס. precise=הצלחה, partial=חלקי, common=טעות נפוצה, layer=שכבה אחרת. */
export type GuessTone = 'precise' | 'partial' | 'common' | 'layer';

/** כרטיס השערה בודד בבורר הניחוש. הטקסט מגיע מהמילון, המבנה (אייקון/גוון/פוזה) מהפרק. */
export interface DiscoveryGuessCard {
    id: string;
    title: string;
    desc: string;
    /** אייקון lucide לתג הכרטיס. אם חסר, מוצג מספר סידורי. */
    icon?: LucideIcon;
    statusLabel: string;
    statusTone: GuessTone;
    getsRight: string;
    /** תווית השורה השנייה: לרוב "מה זה מפספס", ולכרטיס הנכון "מה נשאר לראות". */
    missesLabel: string;
    misses: string;
    bridge: string;
}

/** תוכן בורר הניחוש המשותף (כותרות, הזמנה לנחש, חשיפה מדורגת, CTA). */
export interface DiscoveryGuessContent {
    eyebrow: string;
    title: string;
    subtitle: string;
    /** משפט ההזמנה לנחש שלפני הבחירה. */
    invite: string;
    /** פרומפט עוגן אופציונלי שמוצג בכותרת. */
    prompt?: string;
    getsRightLabel: string;
    revealButton: string;
    revealTitle: string;
    revealCopy: string;
    cta: string;
    /** id של אלמנט שאליו גוללים בלחיצת ה-CTA (למשל המעבדה). */
    ctaTargetId?: string;
    resetButton: string;
    exploreHint: string;
}

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
            return `border-emerald-400/70 bg-[var(--bts-state-correct-bg)] ${reduce ? '' : 'shadow-[0_0_40px_-10px_rgba(16,185,129,0.55)]'}`;
        case 'wrong':
            return 'border-amber-400/55 bg-[var(--bts-state-wrong-bg)]';
        case 'dim':
            return 'border-[var(--bts-fill-soft)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] opacity-60';
        default:
            return 'border-[var(--bts-border-mid)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] hover:border-violet-500/50 hover:bg-[color-mix(in_oklab,color-mix(in_oklab,var(--og-l)_var(--bts-tint-mix),var(--og-d))_10%,transparent)] [--og-d:var(--color-violet-900)] [--og-l:var(--color-violet-500)]';
    }
}

// speechLocale (אופציונלי): שפת ההקראה של כפתורי ה-SpeakButton כשהיא שונה משפת הממשק
// (למשל contentLocale של הפרק). כשאינו מועבר, ההקראה נופלת לשפת הממשק כברירת מחדל,
// כך שכל הצרכנים הקיימים מתנהגים בדיוק כמקודם.
//
// headingLevel (אופציונלי): דרגת הכותרת הסמנטית של שאלת הניחוש. ברירת המחדל 3 משמרת
// את ההתנהגות הקיימת בכל הצרכנים. פרק שבו הניחוש הוא מקטע עליון מעביר 2, כדי שמתאר
// הכותרות לא ידלג על דרגה. העיצוב אינו משתנה.
//
// mentorResponse: משפטי התגובה האנושית הספציפיים לפרק, אחד לכל תוצאה. נדרש, כדי
// שהשכבה האנושית של הניחוש תהיה החלטה מפורשת של הפרק ולא ברירת מחדל גנרית.
export const OpeningGuess: React.FC<{
    content: OpeningGuessContent;
    cards: DiscoveryGuessCard[];
    speechLocale?: Locale;
    headingLevel?: 2 | 3;
    mentorResponse: { correct: string; wrong: string };
}> = ({ content, cards, speechLocale, headingLevel = 3, mentorResponse }) => {
    const Heading = `h${headingLevel}` as const;
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
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--bts-border)] bg-[var(--bts-surface)] p-6 backdrop-blur-xl md:p-8">
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[80px]" />

            <div className="relative z-10">
                {!chosen && <GuessInvite line={content.invite} />}

                <div className="text-center">
                    <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400">
                        <HelpCircle size={14} /> {content.eyebrow}
                    </span>
                    <div className="mb-2 flex items-center justify-center gap-2.5">
                        <Heading className="text-xl font-black text-[var(--bts-text-primary)] md:text-3xl">{content.title}</Heading>
                        {/* הקראה אחת לשאלה יחד עם שורת ההסבר שמתחתיה */}
                        <SpeakButton text={`${content.title} ${content.subtitle}`} speechLocale={speechLocale} />
                    </div>
                    <p className="mx-auto mb-4 max-w-xl text-sm text-[var(--bts-text-muted)] md:text-base">{content.subtitle}</p>
                    {content.prompt && (
                        <p className="mx-auto mb-7 max-w-xl rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3 text-sm font-bold text-[var(--bts-text-body)]">{content.prompt}</p>
                    )}
                </div>

                {/* רשת 2x2 של כרטיסי ההשערה */}
                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {cards.map((card, i) => {
                        const state = stateFor(card);
                        const Icon = card.icon;
                        return (
                            <div key={card.id} className="relative">
                            <motion.button
                                type="button"
                                onClick={() => choose(card.id)}
                                aria-pressed={card.id === chosenId}
                                aria-label={`${card.title}. ${card.desc}`}
                                whileHover={{ scale: reduce ? 1 : 1.015 }}
                                whileTap={{ scale: reduce ? 1 : 0.985 }}
                                className={`relative flex h-full w-full flex-col gap-2.5 rounded-2xl border p-4 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--bts-focus-ring)_var(--bts-tint-mix),color-mix(in_oklab,var(--color-violet-400)_60%,transparent))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bts-focus-ring-offset)] ${cardClasses(state, !!reduce)}`}
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
                                {/* pe-8 שומר את הפינה לכפתור ההקראה (אח של הכרטיס, ממוקם absolute) */}
                                <div className="flex items-center justify-between gap-2 pe-8">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--bts-divider-soft)] bg-[color-mix(in_oklab,var(--bts-panel-to)_50%,transparent)]">
                                        {Icon ? (
                                            <Icon size={18} className="text-violet-300" />
                                        ) : (
                                            <span className="font-mono text-sm font-bold text-violet-300" dir="ltr">{i + 1}</span>
                                        )}
                                    </span>
                                    {state === 'correct' && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 15 }}
                                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-slate-950"
                                        >
                                            <Check size={14} strokeWidth={3} />
                                        </motion.span>
                                    )}
                                </div>
                                <div>
                                    <div className="text-base font-black text-[var(--bts-text-primary)]">{card.title}</div>
                                    <p className="mt-1 text-sm leading-relaxed text-[var(--bts-text-secondary)]">{card.desc}</p>
                                </div>
                            </motion.button>
                            {/* הקראת הכרטיס: אח של כפתור-הכרטיס (button בתוך button אסור) */}
                            <SpeakButton text={`${card.title}. ${card.desc}`} speechLocale={speechLocale} className="absolute end-2 top-2 z-10" />
                            </div>
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
                        mentorResponse={mentorResponse}
                    />
                )}
            </div>
        </div>
    );
};
