"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Scissors, MousePointerClick, SplitSquareHorizontal, FlaskConical, Lightbulb, ListChecks,
    CheckCircle2, Info, Type, Boxes, Brain, Filter,
} from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';

import { OpeningGuess, type OpeningGuessContent, type DiscoveryGuessCard } from '@/components/ai-internals/OpeningGuess';
import { TokenizationLab } from '@/components/ai-internals/TokenizationLab';
import { ExpandableLab } from '@/components/ai-internals/ExpandableLab';
import { TokenizationRoadmap } from '@/components/ai-internals/TokenizationRoadmap';
import { ReadAloudControls, type ReadAloudMode } from '@/components/ai-internals/ReadAloudControls';
import { FloatingReadAloud } from '@/components/ai-internals/FloatingReadAloud';
import { SpeakButton } from '@/components/ai-internals/SpeakButton';
import type { ReadAloudSegment } from '@/components/ai-internals/useReadAloud';
import { LOCALE_SPEECH_LANG } from '@/components/ai-internals/readAloudLang';
import { Chapter3LabProvider, getLabContent } from '@/app/(course)/behind-the-scenes-ai/chapter-3/labContent';
import { useT } from '@/i18n/useT';
import type { Chapter3QuizId } from '@/i18n/locales/he/behind-ai/chapter3Quiz';

/* ════════════════════════ מטא-דאטה מבני (לא ניתן לתרגום) ════════════════════════ */
// טקסט הכרטיסים מגיע מהמילון (t.behindAi.chapter3.guess.cards) לפי מזהה; כאן נשאר רק
// המבנה: אייקון וגוון הסטטוס, שאינם תלויי שפה.
const GUESS_CARD_META = [
    { id: 'as-is', icon: Type, statusTone: 'common' },
    { id: 'tokens', icon: Boxes, statusTone: 'precise' },
    { id: 'meaning', icon: Brain, statusTone: 'layer' },
    { id: 'important', icon: Filter, statusTone: 'partial' },
] as const;

/* ════════════════════════ בדיקת הבנה: שאלת סיווג פעילה ════════════════════════ */
// התשובה הנכונה מבנית; הטקסט (שאלה, אפשרויות, הסברים) מגיע מהמילון.
const LOCK_CORRECT = 4;

const LockQuestion: React.FC = () => {
    const { t, dir } = useT();
    const lock = t.behindAi.chapter3.lock;
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;
    const correct = choice === LOCK_CORRECT;

    return (
        <div dir={dir} className="text-start">
            <div className="mb-3 flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-[var(--bts-text-body)]">{lock.question}</p>
                <SpeakButton text={lock.question} />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
                {lock.options.map((opt, i) => {
                    const isCorrect = i === LOCK_CORRECT;
                    const isChosen = i === choice;
                    let cls = 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]';
                    if (answered && isChosen && isCorrect) cls = 'border-emerald-400/70 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-emerald-900)] [--t-l:var(--color-emerald-500)] text-emerald-100';
                    else if (answered && isChosen && !isCorrect) cls = 'border-amber-400/70 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-amber-900)] [--t-l:var(--color-amber-500)] text-amber-100';
                    else if (answered && isCorrect) cls = 'border-emerald-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-900)] [--t-l:var(--color-emerald-500)] text-emerald-100';
                    return (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setChoice(i)}
                            className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${cls} ${i === LOCK_CORRECT ? 'sm:col-span-2' : ''}`}
                        >
                            <span dir={dir}>{opt}</span>
                            {answered && isChosen && isCorrect && <CheckCircle2 size={16} className="shrink-0 text-emerald-300" />}
                            {answered && isChosen && !isCorrect && <Info size={16} className="shrink-0 text-amber-300" />}
                        </button>
                    );
                })}
            </div>

            {answered && (
                <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`mt-4 rounded-xl border p-3 text-sm leading-relaxed text-[var(--bts-text-body)] ${correct ? 'border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)]' : 'border-amber-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-amber-950)] [--t-l:var(--color-amber-500)]'}`}
                >
                    {correct ? lock.explanationCorrect : lock.explanationWrong}
                </motion.p>
            )}
        </div>
    );
};

export default function BehindTheScenesChapter3() {
    const reduce = useReducedMotion();
    const { t, dir, locale } = useT();
    const isRtl = dir === 'rtl';
    const c3 = t.behindAi.chapter3;
    const labContent = getLabContent(locale);

    // ── דוק האזנה מודרכת: מקטעי הקראה לפי מצב היקף, מאותם מפתחות מילון (ללא שכפול
    // קופי). לא נכללים: חידון, כפתורים/ניווט, צ׳יפים/באדג׳ים, משפטי מנטור, ופלט חי של
    // מעבדת הפירוק (טוקנים, צבעים, ספירות). הקראה רק מטקסט יציב של chapter3.
    const ra = t.behindAi.aiInternals.readAloud;
    const c3CardIds = ['as-is', 'tokens', 'meaning', 'important'] as const;
    const sTitle: ReadAloudSegment = { id: 'title', label: c3.hero.titleLead, text: `${c3.hero.titleLead} ${c3.hero.titleHighlight}. ${c3.hero.lede}` };
    const sGuessQ: ReadAloudSegment = { id: 'guess-q', label: c3.guess.title, text: `${c3.guess.title} ${c3.guess.subtitle}` };
    const sCards: ReadAloudSegment[] = c3CardIds.map((id) => ({ id: `card-${id}`, label: c3.guess.cards[id].title, text: `${c3.guess.cards[id].title}. ${c3.guess.cards[id].desc}` }));
    const sGuessReveal: ReadAloudSegment = { id: 'guess-reveal', label: c3.guess.revealTitle, text: `${c3.guess.revealTitle} ${c3.guess.revealCopy}` };
    const sInsight: ReadAloudSegment = { id: 'insight', label: c3.insight.title, text: `${c3.insight.lead} ${c3.insight.body}` };
    const sLab: ReadAloudSegment = { id: 'lab', label: c3.lab.title, text: `${c3.lab.title}. ${c3.lab.intro}` };
    const sLock: ReadAloudSegment = { id: 'lock', label: c3.lock.title, text: `${c3.lock.title}. ${c3.lock.truthLabel}: ${c3.lock.truthText} ${c3.lock.mistakeLabel}: ${c3.lock.mistakeText}` };
    const sPracticalShort: ReadAloudSegment = { id: 'practical', label: c3.practical.title, text: `${c3.practical.title}. ${c3.practical.intro}` };
    const sPracticalFull: ReadAloudSegment = { id: 'practical', label: c3.practical.title, text: `${c3.practical.title}. ${c3.practical.intro} ${c3.practical.points.join(' ')}` };
    const sBridge: ReadAloudSegment = { id: 'bridge', label: t.behindAi.chapterQuiz.nextQuestionLabel, text: t.behindAi.chapterQuiz.transitions[3] };

    const readAloudByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
        short: [sTitle, sGuessReveal, sInsight, sPracticalShort],
        regular: [sTitle, sGuessQ, sGuessReveal, sInsight, sLab, sLock, sPracticalFull, sBridge],
        full: [sTitle, sGuessQ, ...sCards, sGuessReveal, sInsight, sLab, sLock, sPracticalFull, sBridge],
    };

    // ניחוש הפתיחה: טקסט מהמילון, מבנה (אייקון/גוון) מהמטא-דאטה.
    const guessContent: OpeningGuessContent = {
        eyebrow: c3.guess.eyebrow,
        title: c3.guess.title,
        subtitle: c3.guess.subtitle,
        invite: c3.guess.invite,
        correctTitle: c3.guess.correctTitle,
        wrongTitle: c3.guess.wrongTitle,
        getsRightLabel: c3.guess.getsRightLabel,
        revealButton: c3.guess.revealButton,
        revealTitle: c3.guess.revealTitle,
        revealCopy: c3.guess.revealCopy,
        cta: c3.guess.cta,
        ctaTargetId: 'token-lab',
        resetButton: c3.guess.resetButton,
        exploreHint: c3.guess.exploreHint,
    };
    const guessCards: DiscoveryGuessCard[] = GUESS_CARD_META.map((m) => ({
        id: m.id,
        icon: m.icon,
        statusTone: m.statusTone,
        ...c3.guess.cards[m.id],
    }));

    // מבדק הפרק: המנגנון המשותף (onComplete, getReviewLinks, nextHref...) נשמר מ-quizData,
    // וטקסט התצוגה ממוזג מהמילון לפי מזהה השאלה. quizData.ts עצמו לא משתנה.
    const baseQuiz = behindAiChapterQuizzes[3];
    const localizedQuiz = {
        ...baseQuiz,
        title: c3.quiz.title,
        subtitle: c3.quiz.subtitle,
        startLabel: c3.quiz.startLabel,
        submitLabel: c3.quiz.submitLabel,
        completedTitle: c3.quiz.completedTitle,
        questions: baseQuiz.questions.map((q) => ({ ...q, ...c3.quiz.byId[q.id as Chapter3QuizId] })),
    };

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={3} themeAware>

            {/* ══════════ HERO ══════════ */}
            <div className="relative">
                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_60%,transparent)] backdrop-blur-xl p-8 md:p-10 text-start"
                    dir={dir}
                >
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

                    {/* ב-lg+ דוק ההאזנה מעוגן בפינה מעל הכותרת; הכותרת וה-lede מתפזרים לרוחב מלא מתחתיו */}
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(70%_+_var(--bts-tint-mix)_*_0.3),transparent)] border border-violet-500/30 mb-5">
                            <Scissors size={14} className="text-violet-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">{c3.hero.badge}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-[var(--bts-text-primary)] leading-[1.1] mb-4">
                            {c3.hero.titleLead}{' '}
                            <span className={`${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[color-mix(in_oklab,var(--color-violet-400)_calc(100%_-_var(--bts-tint-mix)_*_0.4),black)] via-[color-mix(in_oklab,var(--color-fuchsia-400)_calc(100%_-_var(--bts-tint-mix)_*_0.4),black)] to-[color-mix(in_oklab,var(--color-cyan-400)_calc(100%_-_var(--bts-tint-mix)_*_0.4),black)] bg-clip-text text-transparent`}>
                                {c3.hero.titleHighlight}
                            </span>
                        </h1>

                        <div className="flex items-start gap-2.5">
                            <p className="text-lg text-[var(--bts-text-secondary)] leading-relaxed">
                                {c3.hero.lede}
                            </p>
                            <SpeakButton text={`${c3.hero.titleLead} ${c3.hero.titleHighlight}. ${c3.hero.lede}`} className="mt-1" />
                        </div>

                        <p className="mt-4 text-base font-bold text-violet-200">{c3.hero.question}</p>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-[var(--bts-text-muted)]">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-violet-400" /> {c3.hero.chipGuess}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <SplitSquareHorizontal size={14} className="text-cyan-400" /> {c3.hero.chipTouch}
                            </span>
                        </div>

                        {/* דוק האזנה מודרכת צף: מצמיד לקצה (תלוי-כיוון), נגיש תוך כדי גלילה, אייקון במובייל */}
                        <FloatingReadAloud dir={dir}>
                            <ReadAloudControls
                                segmentsByMode={readAloudByMode}
                                lang={LOCALE_SPEECH_LANG[locale]}
                                locale={locale}
                                dir={dir}
                                labels={ra}
                                reduce={!!reduce}
                                compact
                            />
                        </FloatingReadAloud>
                    </div>
                </motion.section>

                {/* M10: מנטור ההירו הוסר. הבועה ("קודם מפרקים, אז מבינים") היא בדיוק התשובה
                    של הניחוש שמופיע מיד אחריה, והיא הופיעה רק מ-xl ומעלה, כך שלומד בטלפון ממילא
                    לא ראה אותה. הכותרת והלד של ההירו נשארים כפי שהם. */}
            </div>

            {/* ══════════ נחש ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                {/* M10 F3 SELECTIVE RESPOND: מנטור ההזמנה ומנטור כרטיס ההכרעה הוסרו, ומשפט ההזמנה
                    נשאר כטקסט גוף וגלוי גם בטלפון. אחרי הבחירה שתי התוצאות מקבלות בדיוק אותה שורת
                    תגובה אנושית: אותה פוזה, אותו גודל, אותו מיקום. זה רגע הדמות היחיד בפרק. */}
                <OpeningGuess
                    content={guessContent}
                    cards={guessCards}
                    mentorResponse={{ correct: c3.mentorRespond.guessCorrect, wrong: c3.mentorRespond.guessWrong }}
                />
            </section>

            {/* ══════════ הסבר פשוט: מה באמת קורה כאן (במקום "הנקודה המפתיעה") ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-[2rem] border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-6 backdrop-blur-xl md:p-8">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Lightbulb size={18} className="text-violet-300" />
                            <h3 className="text-xl font-black text-[var(--bts-text-primary)] md:text-2xl">{c3.insight.title}</h3>
                        </div>
                        <SpeakButton text={`${c3.insight.title}. ${c3.insight.lead} ${c3.insight.body}`} />
                    </div>
                    <p className="mb-2.5 text-lg font-bold text-violet-200">{c3.insight.lead}</p>
                    <p className="text-[15px] leading-relaxed text-[var(--bts-text-secondary)]">{c3.insight.body}</p>
                </div>
            </section>

            {/* ══════════ גע: מעבדת הפירוק ══════════ */}
            <Chapter3LabProvider value={labContent}>
                <section id="token-lab" className="mt-12 space-y-5 text-start scroll-mt-24" dir={dir}>
                    <div className="flex items-center gap-3">
                        <FlaskConical size={24} className="text-violet-400" />
                        <div>
                            <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">{c3.lab.eyebrow}</div>
                            <h3 className="text-2xl font-bold text-[var(--bts-text-primary)]">{c3.lab.title}</h3>
                        </div>
                    </div>

                    <div className="flex items-start justify-between gap-2.5 rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-5 leading-relaxed text-[var(--bts-text-secondary)]">
                        <span>{c3.lab.intro}</span>
                        <SpeakButton text={`${c3.lab.title}. ${c3.lab.intro}`} className="mt-0.5" />
                    </div>

                    <ExpandableLab>
                        <TokenizationLab key={locale} />
                    </ExpandableLab>
                    <TokenizationRoadmap />

                    {/* M10: המנטור "כל טוקן הוא יחידת עבודה" הוסר. מבוא המעבדה ורצועת הטוקנים
                        שמתחתיו מראים את זה ישירות, במקום לומר את זה. */}
                </section>
            </Chapter3LabProvider>

            {/* ══════════ בדיקת הבנה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                {/* M10: המנטור שלפני הבדיקה הוסר. "תפסתם את הרעיון" הוא שבח שניתן לפני
                    שהלומד ענה בכלל, ולכן הוא גם לא מדויק וגם מרוקן את הבדיקה. תוכן הבדיקה נשאר זהה. */}
                <div className="rounded-2xl border border-violet-500/40 bg-[color-mix(in_oklab,var(--bts-panel-from)_60%,transparent)] p-6">
                    <div className="mb-5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <ListChecks size={20} className="text-violet-300" />
                            <h3 className="text-xl font-bold text-[var(--bts-text-primary)]">{c3.lock.title}</h3>
                        </div>
                        <SpeakButton text={`${c3.lock.title}. ${c3.lock.truthLabel}: ${c3.lock.truthText} ${c3.lock.mistakeLabel}: ${c3.lock.mistakeText}`} />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(10%_-_var(--bts-tint-mix)_*_0.05),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">{c3.lock.truthLabel}</div>
                            <p className="text-sm leading-relaxed text-[var(--bts-text-body)]">{c3.lock.truthText}</p>
                        </div>
                        <div className="rounded-xl border border-rose-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(10%_-_var(--bts-tint-mix)_*_0.05),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)] p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-rose-300">{c3.lock.mistakeLabel}</div>
                            <p className="text-sm leading-relaxed text-[var(--bts-text-body)]">{c3.lock.mistakeText}</p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-4">
                        <LockQuestion />
                    </div>
                </div>
            </section>

            {/* ══════════ תובנה מעשית ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                {/* M10: המנטור "ככה כותבים למודל חכם יותר" הוסר. זו כותרת התובנה המעשית עצמה,
                    והרשימה שמתחתיה כבר מפרטת בדיוק איך. */}
                <div className="rounded-2xl border border-violet-500/30 bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-5 leading-relaxed text-[var(--bts-text-secondary)]">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Lightbulb size={18} className="text-amber-300" />
                            <div className="text-sm font-bold text-[var(--bts-text-bright)]">{c3.practical.title}</div>
                        </div>
                        <SpeakButton text={`${c3.practical.title}. ${c3.practical.intro} ${c3.practical.points.join(' ')}`} />
                    </div>
                    <p className="mb-3 text-sm">{c3.practical.intro}</p>
                    <ul className="space-y-2">
                        {c3.practical.points.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                <span className="text-sm">{line}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-10 rounded-2xl border border-indigo-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-indigo-950)] [--t-l:var(--color-indigo-500)] p-5 text-start" dir={dir}><div className="text-xs font-bold text-indigo-300">{t.behindAi.chapterQuiz.nextQuestionLabel}</div><p className="mt-2 text-base leading-relaxed text-[var(--bts-text-body)]">{t.behindAi.chapterQuiz.transitions[3]}</p></section>
            <section className="mt-16 mb-4" dir={dir}>
                <ExpandableLab title={localizedQuiz.title}>
                    {/* M10 F3 SELECTIVE RESPOND: המבדק חסר-דמות לחלוטין. אייקון הסטטוס נשאר בראש
                        כרטיס התוצאה בשתי התוצאות, ומשפט התגובה הספציפי לפרק מופיע מתחתיו
                        כטקסט בלבד. */}
                    <AssessmentEngine
                        {...localizedQuiz}
                        conceptDisplayMap={c3.quiz.conceptLabels}
                        mentorResponse={{ pass: c3.mentorRespond.quizPass, fail: c3.mentorRespond.quizFail }}
                    />
                </ExpandableLab>
            </section>
        </ChapterLayout>
    );
}
