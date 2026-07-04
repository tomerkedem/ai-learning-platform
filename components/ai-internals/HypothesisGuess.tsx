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

import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Eye, Lock, Database, Check, CheckCircle2 } from 'lucide-react';
import { GuessInvite, GuessVerdict } from './GuessVerdict';
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

function stateClasses(state: CardState, reduce: boolean): string {
    switch (state) {
        case 'correct':
            return `border-cyan-400/70 bg-cyan-900/25 ${reduce ? '' : 'shadow-[0_0_40px_-10px_rgba(34,211,238,0.6)]'}`;
        case 'wrong':
            return 'border-amber-400/50 bg-amber-900/15';
        case 'revealed':
            return 'border-cyan-400/60 bg-cyan-900/15';
        case 'dim':
            return 'border-white/5 bg-slate-900/40 opacity-60';
        default:
            return 'border-slate-700/60 bg-slate-900/50 hover:border-cyan-500/50 hover:bg-cyan-900/10';
    }
}

export const HypothesisGuess: React.FC<{ reduce: boolean; content: QuickGuessContent; dir: Direction; bonus?: React.ReactNode }> = ({ reduce, content, dir, bonus }) => {
    // במסך מלא יש רוחב: ארבע ההשערות עוברות לשורה אחת, הכרטיס מתרחב, והכותרת גדלה.
    const expanded = useContext(ExpandableLabContext);
    const [chosenId, setChosenId] = useState<string | null>(null);
    const [revealed, setRevealed] = useState(false); // נחשף ההסבר המדויק אחרי בחירה שגויה
    const [bonusAccepted, setBonusAccepted] = useState(false); // הבונוס נפתח רק אחרי שהלומד מאשר
    const [bannerVisible, setBannerVisible] = useState(true); // באנר האישור מתפוגג אחרי 5 שניות

    const chosen = content.hypotheses.find((h) => h.id === chosenId) ?? null;
    const chosenCorrect = !!chosen?.correct;
    const correctCard = content.hypotheses.find((h) => h.correct);

    // אחרי אישור הבונוס באנר "נכון מאוד" מילא את תפקידו: הוא נעלם אחרי 5 שניות ומשאיר את הבונוס לבדו.
    // איפוס הבאנר קורה בבחירה עצמה, כאן רק מתוזמן ההיעלמות.
    useEffect(() => {
        if (!bonusAccepted) return;
        const id = setTimeout(() => setBannerVisible(false), 5000);
        return () => clearTimeout(id);
    }, [bonusAccepted]);

    const cardStateFor = (h: Hypothesis): CardState => {
        if (!chosen) return 'idle';
        if (h.id === chosenId) return h.correct ? 'correct' : 'wrong';
        if (h.correct && (chosenCorrect || revealed)) return chosenCorrect ? 'idle' : 'revealed';
        return 'dim';
    };

    const reset = () => { setChosenId(null); setRevealed(false); setBannerVisible(true); setBonusAccepted(false); };

    return (
        <div
            dir={dir}
            className="relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl md:p-8"
        >
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[80px]" />

            <div className="relative">
                {/* מנטור הזמנה: משותף לכל הפרקים - דמות חושבת ממורכזת, נעלמת אחרי הבחירה. */}
                {!chosen && <GuessInvite pose="think" width={162} />}

                {/* רק אחרי שהלומד מאשר את הבונוס הוא מחליף את הניחוש הראשוני *במיקומו* (לא מתחתיו). */}
                <AnimatePresence mode="wait" initial={false}>
                {chosenCorrect && bonusAccepted ? (
                    <motion.div
                        key="bonus"
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* אישור הצלחה קומפקטי, במקום כרטיס-ההכרעה הגדול. מתפוגג אחרי 5 שניות ומשאיר את הבונוס לבדו. */}
                        <AnimatePresence initial={false}>
                            {bannerVisible && (
                                <motion.div
                                    key="banner"
                                    initial={false}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                                    transition={reduce ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="mb-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-2xl border border-emerald-400/40 bg-emerald-900/15 px-4 py-3">
                                        <CheckCircle2 size={20} className="shrink-0 text-emerald-300" aria-hidden />
                                        <span className="text-lg font-black text-emerald-100 md:text-xl">{content.correctTitle}</span>
                                        <span className="text-sm font-bold text-emerald-200/90 md:text-base">{content.correctLead}</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {bonus}
                    </motion.div>
                ) : (
                    <motion.div key="guess" initial={false} exit={{ opacity: 0 }} transition={reduce ? { duration: 0 } : { duration: 0.25 }}>
                <div className="text-center">
                    <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                        <HelpCircle size={14} /> {content.eyebrow}
                    </span>
                    <div className="mb-2 flex items-center justify-center gap-2.5">
                        <h3 className="text-xl font-black text-white md:text-3xl">{content.question}</h3>
                        {/* הקראה אחת לשאלה יחד עם שורת ההסבר שמתחתיה */}
                        <SpeakButton text={`${content.question} ${content.hint}`} />
                    </div>
                    <p className={`mx-auto mb-7 text-sm text-slate-400 md:text-base ${expanded ? 'max-w-2xl' : 'max-w-xl'}`}>{content.hint}</p>
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
                                onClick={() => { setChosenId(h.id); setRevealed(false); setBannerVisible(true); setBonusAccepted(false); }}
                                aria-pressed={selected}
                                aria-label={`${h.title}. ${h.concept}`}
                                whileHover={reduce ? undefined : { scale: 1.015 }}
                                whileTap={reduce ? undefined : { scale: 0.985 }}
                                className={`relative flex h-full w-full flex-col gap-2.5 rounded-2xl border p-4 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${stateClasses(state, reduce)}`}
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
                                </div>
                            </motion.button>
                            {/* הקראת הכרטיס: אח של כפתור-הכרטיס (button בתוך button אסור) */}
                            <SpeakButton text={`${h.title}. ${h.concept}`} className="absolute end-2 top-2 z-10" />
                            </div>
                        );
                    })}
                </div>

                {/* התגובה המשותפת: הצלחה חוגגת עם הזמנה לבונוס (אישור מפורש), או טעות תומכת עם חשיפה ובחירה מחדש. */}
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
                        continueCta={chosenCorrect ? { label: content.bonusStart, onClick: () => setBonusAccepted(true) } : undefined}
                        wrongTitle={content.wrongLead}
                        wrongExplain={chosen.whyTempting ?? ''}
                        wrongExplainMore={chosen.whyWrong}
                        reveal={correctCard ? { button: content.revealCorrect, title: `${correctCard.title}: ${content.correctLead}`, body: content.correctBody, revealed, onReveal: () => setRevealed(true) } : undefined}
                        onRetry={reset}
                        retryLabel={content.retry}
                    />
                )}
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
};
