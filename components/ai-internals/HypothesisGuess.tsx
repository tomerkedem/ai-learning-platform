"use client";

// components/ai-internals/HypothesisGuess.tsx
//
// "ארבעה הסברים מתחרים": לא שאלון אמריקאי, אלא בחירת מודל חשיבה. הלומד בוחר איזה
// הסבר הכי קרוב למה שקורה באמצע, מתוך ארבעה כרטיסי השערה ברשת 2x2. המשוב מרגיש
// כמו גילוי, לא כמו ציון: בחירה שגויה מוצגת כטעות חשיבה מפתה (גוון ענבר רך, לא
// אדום מאיים), עם הסבר למה היא מפתה ולמה אינה מדויקת, וההסבר המדויק נשאר זמין
// לחשיפה. בחירה נכונה זוהרת ומתחברת אל פתיחת המנוע שלמטה.
//
// לא מבחן ולא חלק מהמאסטרי. אין שמירת ניקוד.
//
// נגישות: כל כרטיס הוא <button> עם aria-pressed, תווית מלאה לקורא-מסך, תמיכת
// מקלדת מובנית וטבעת פוקוס גלויה. reduced-motion: בלי זוהר מונפש, רק מעבר מיידי.

import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Eye, Lock, Database, Check } from 'lucide-react';
import { GuessVerdict } from './GuessVerdict';
import { SpeakButton } from './SpeakButton';
import { ExpandableLabContext } from './ExpandableLab';
import { useT } from '@/i18n/useT';
import type { Hypothesis, HypothesisCue, QuickGuessContent } from '@/app/behind-the-scenes-ai/introduction/introContent';
import type { Direction } from '@/i18n/config';

/* ── איור-מיקרו לכל השערה ── */
function CueIllustration({ cue }: { cue: HypothesisCue }) {
    // שברי הטוקן ("טו"/"קן") מהמילון (introVisuals.guess.tokenCue).
    const tokenCue = useT().t.behindAi.introVisuals.guess.tokenCue;
    if (cue === 'read') {
        return (
            <div className="flex items-center gap-2">
                <Eye size={18} className="text-slate-300" aria-hidden />
                <div className="flex flex-col gap-1" aria-hidden>
                    <span className="block h-1 w-8 rounded-full bg-slate-500/70" />
                    <span className="block h-1 w-5 rounded-full bg-slate-600/70" />
                </div>
            </div>
        );
    }
    if (cue === 'rail') {
        return (
            <div className="flex items-center gap-1.5" aria-hidden>
                <Lock size={16} className="text-slate-300" />
                <div className="flex items-center gap-1">
                    {[0, 1, 2, 3].map((i) => (
                        <span key={i} className="h-1.5 w-3 rounded-sm bg-slate-500/70" />
                    ))}
                </div>
            </div>
        );
    }
    if (cue === 'tokens') {
        return (
            <div className="flex items-center gap-1" aria-hidden>
                {tokenCue.map((t, i) => (
                    <React.Fragment key={i}>
                        <span className="rounded-md border border-cyan-500/40 bg-cyan-950/40 px-1.5 py-0.5 text-[9px] font-bold text-cyan-200">{t}</span>
                        <span className="h-1 w-1 rounded-full bg-cyan-400/70" />
                    </React.Fragment>
                ))}
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            </div>
        );
    }
    // archive
    return (
        <div className="flex items-center gap-2" aria-hidden>
            <Database size={18} className="text-slate-300" />
            <div className="flex flex-col gap-0.5">
                <span className="block h-1 w-6 rounded-sm bg-slate-500/70" />
                <span className="block h-1 w-6 rounded-sm bg-slate-600/70" />
            </div>
        </div>
    );
}

type CardState = 'idle' | 'correct' | 'wrong' | 'revealed' | 'dim';

// אחרי הבחירה, כרטיס-הבחירה מוסר את ההילה הרחבה ונשאר עם מסגרת ורקע בלבד. הסיבה:
// אחרי שהתוצאה מופיעה, פאנל ההסבר הוא משטח הקריאה הראשי, ושני משטחים מוארים במקביל
// חילקו את המבט. ההבחנה הסמנטית בין נכון (תכלת) לשגוי (ענבר) נשמרת במלואה.
function stateClasses(state: CardState, reduce: boolean): string {
    switch (state) {
        case 'correct':
            return `border-cyan-400/60 bg-cyan-900/20 ${reduce ? '' : 'shadow-[0_0_20px_-14px_rgba(34,211,238,0.5)]'}`;
        case 'wrong':
            return 'border-amber-400/45 bg-amber-900/12';
        case 'revealed':
            return 'border-cyan-400/45 bg-cyan-900/12';
        case 'dim':
            return 'border-white/5 bg-slate-900/40 opacity-60';
        default:
            return 'border-slate-700/60 bg-slate-900/50 hover:border-cyan-500/50 hover:bg-cyan-900/10';
    }
}

export const HypothesisGuess: React.FC<{
    reduce: boolean;
    content: QuickGuessContent;
    dir: Direction;
    /** משפטי התגובה האנושית של כרטיס ההכרעה, אחד לכל תוצאה. ספציפיים למבוא בכוונה. */
    mentorResponse: { correct: string; wrong: string };
    onFeedbackNarration?: (text: string | null) => void;
}> = ({ reduce, content, dir, mentorResponse, onFeedbackNarration }) => {
    // במסך מלא יש רוחב: ארבע ההשערות עוברות לשורה אחת, הכרטיס מתרחב, והכותרת גדלה.
    const expanded = useContext(ExpandableLabContext);
    const [chosenId, setChosenId] = useState<string | null>(null);
    const [revealed, setRevealed] = useState(false); // נחשף ההסבר המדויק אחרי בחירה שגויה

    const chosen = content.hypotheses.find((h) => h.id === chosenId) ?? null;
    const chosenCorrect = !!chosen?.correct;
    const correctCard = content.hypotheses.find((h) => h.correct);

    const cardStateFor = (h: Hypothesis): CardState => {
        if (!chosen) return 'idle';
        if (h.id === chosenId) return h.correct ? 'correct' : 'wrong';
        if (h.correct && (chosenCorrect || revealed)) return chosenCorrect ? 'idle' : 'revealed';
        return 'dim';
    };

    const announce = (h: Hypothesis) => {
        const correction = h.correct ? content.correctBody : h.whyWrong;
        onFeedbackNarration?.([h.title, h.concept, h.status ?? content.wrongLead, h.whyTempting, correction]
            .filter(Boolean).join('. '));
    };
    const reset = () => {
        setChosenId(null); setRevealed(false);
        onFeedbackNarration?.(null);
    };

    return (
        <div
            dir={dir}
            className="relative overflow-hidden rounded-[2rem] border border-[var(--bts-border)] bg-[var(--bts-surface)] p-6 backdrop-blur-xl md:p-8"
        >
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[80px]" />

            <div className="relative">
                <div className="text-center">
                    <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--bts-brand-primary-strong)]">
                        <HelpCircle size={14} /> {content.eyebrow}
                    </span>
                    <div className="mb-2 flex items-center justify-center gap-2.5">
                        <h3 className="text-xl font-black text-[var(--bts-text-primary)] md:text-3xl">{content.question}</h3>
                        {/* הקראה אחת לשאלה יחד עם שורת ההסבר שמתחתיה */}
                        <SpeakButton text={`${content.question} ${content.hint}`} />
                    </div>
                    <p className={`mx-auto mb-7 text-sm text-[var(--bts-text-muted)] md:text-base ${expanded ? 'max-w-2xl' : 'max-w-xl'}`}>{content.hint}</p>
                </div>

                {/* רשת ההשערות: 2x2 בתצוגה רגילה, שורה אחת (4 עמודות) במסך מלא. */}
                <div className={`mx-auto grid grid-cols-1 gap-3.5 sm:grid-cols-2 ${expanded ? 'max-w-6xl lg:grid-cols-4' : 'max-w-3xl'}`}>
                    {content.hypotheses.map((h) => {
                        const state = cardStateFor(h);
                        const selected = h.id === chosenId;
                        return (
                            <div key={h.id} className="relative">
                            <motion.button
                                type="button"
                                onClick={() => {
                                    setChosenId(h.id); setRevealed(false); announce(h);
                                }}
                                aria-pressed={selected}
                                aria-label={`${h.title}. ${h.concept}`}
                                whileHover={reduce ? undefined : { scale: 1.015 }}
                                whileTap={reduce ? undefined : { scale: 0.985 }}
                                className={`relative flex h-full w-full flex-col gap-2.5 rounded-2xl border p-4 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bts-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bts-focus-ring-offset)] ${stateClasses(state, reduce)}`}
                            >
                                {/* פעימת-אישור חד-פעמית בבחירה נכונה */}
                                {!reduce && state === 'correct' && (
                                    <motion.span
                                        aria-hidden
                                        className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-cyan-400/60"
                                        initial={{ opacity: 0.85, scale: 1 }}
                                        animate={{ opacity: 0, scale: 1.04 }}
                                        transition={{ duration: 0.7, ease: 'easeOut' }}
                                    />
                                )}
                                {/* pe-8 שומר את הפינה לכפתור ההקראה (אח של הכרטיס, ממוקם absolute) */}
                                <div className="flex items-center justify-between gap-2 pe-8">
                                    <span className="rounded-xl border border-white/10 bg-slate-950/50 px-2.5 py-2">
                                        <CueIllustration cue={h.cue} />
                                    </span>
                                    {(state === 'correct' || state === 'revealed') && (
                                        <motion.span
                                            initial={reduce ? false : { scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 15 }}
                                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-slate-950"
                                        >
                                            <Check size={14} strokeWidth={3} />
                                        </motion.span>
                                    )}
                                </div>
                                <div>
                                    <div className="text-base font-black text-white">{h.title}</div>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-300">{h.concept}</p>
                                    {selected && <span className="mt-2 inline-flex rounded-full border border-current/30 px-2 py-0.5 text-xs font-black text-current">{h.status ?? content.wrongLead}</span>}
                                </div>
                            </motion.button>
                            {/* הקראת הכרטיס: אח של כפתור-הכרטיס (button בתוך button אסור) */}
                            <SpeakButton text={`${h.title}. ${h.concept}`} className="absolute end-2 top-2 z-10" />
                            </div>
                        );
                    })}
                </div>

                {/* התגובה המשותפת: ההסבר הקרוב ביותר או משוב תומך עם חשיפה ובחירה מחדש. */}
                {chosen && (
                    <GuessVerdict
                        key={chosenId ?? undefined}
                        correct={chosenCorrect}
                        reduce={reduce}
                        accent="cyan"
                        correctTitle={content.correctTitle}
                        correctLead={content.correctLead}
                        correctExplain={content.correctBody}
                        correctInsight={content.correctBridge}
                        wrongTitle={chosen.status ?? content.wrongLead}
                        wrongExplain={chosen.whyTempting ?? ''}
                        wrongExplainMore={chosen.whyWrong}
                        reveal={correctCard ? { button: content.revealCorrect, title: `${correctCard.title}: ${content.correctLead}`, body: content.correctBody, revealed, onReveal: () => setRevealed(true) } : undefined}
                        onRetry={reset}
                        retryLabel={content.retry}
                        // הכרעת הניחוש עובדת במודל התגובה של הפרקים: בלי דמות בהצלחה ובלי
                        // דמות בטעות (שתי דמויות שונות הפכו את התוצאה לנראית לפני שקוראים),
                        // ובמקומן שורת תגובה אנושית באותו מבנה בדיוק בשתי התוצאות. מ-M13 זו
                        // ההתנהגות היחידה של GuessVerdict ואינה תלויה יותר ב-prop של הקורא.
                        mentorResponse={mentorResponse}
                    />
                )}
            </div>
        </div>
    );
};
