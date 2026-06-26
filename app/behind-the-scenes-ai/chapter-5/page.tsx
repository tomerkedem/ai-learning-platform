"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Repeat, Repeat2, MousePointerClick, Layers, FlaskConical, Lightbulb, Lock, CheckCircle2, XCircle, Database, Globe, ArrowLeft } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';

import { DiscoveryGuess, type DiscoveryGuessContent, type DiscoveryGuessCard } from '@/components/ai-internals/DiscoveryGuess';
import { AnswerBuilderLab } from '@/components/ai-internals/AnswerBuilderLab';
import { Mentor } from '@/components/ai-internals/Mentor';
import { useT } from '@/i18n/useT';
import type { Chapter5QuizId } from '@/i18n/locales/he/behind-ai/chapter5Quiz';

/* ════════════════════════ מטא־דאטה מבני (לא ניתן לתרגום) ════════════════════════ */
// טקסט הכרטיסים מגיע מהמילון (t.behindAi.chapter5.guess.cards) לפי מזהה; כאן נשאר רק
// המבנה: אייקון, גוון הסטטוס ופוזת המנטור, שאינם תלויי שפה.
const GUESS_CARD_META = [
    { id: 'ready', icon: Database, statusTone: 'common', mentorPose: 'reassure' },
    { id: 'loop', icon: Repeat2, statusTone: 'precise', mentorPose: 'correct' },
    { id: 'verify', icon: Globe, statusTone: 'layer', mentorPose: 'headsup' },
    { id: 'last-word', icon: ArrowLeft, statusTone: 'partial', mentorPose: 'think' },
] as const;

/* ════════════════════════ נעילת הבנה: שאלת סיווג ════════════════════════ */

const LOCK_CORRECT = 1;

const UnderstandingLock: React.FC = () => {
    const { t, dir } = useT();
    const lock = t.behindAi.chapter5.lock;
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;

    return (
        <div dir={dir} className="text-start">
            <p className="mb-3 text-sm font-bold text-slate-200">{lock.question}</p>

            <div className="grid gap-2 sm:grid-cols-2">
                {lock.options.map((opt, i) => {
                    const isCorrect = i === LOCK_CORRECT;
                    const isChosen = i === choice;
                    let cls = 'border-slate-700/50 bg-slate-950/30 text-slate-300 hover:border-slate-600';
                    if (answered && isCorrect) cls = 'border-emerald-400/70 bg-emerald-900/25 text-emerald-100';
                    else if (answered && isChosen && !isCorrect) cls = 'border-rose-400/70 bg-rose-900/20 text-rose-100';
                    return (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setChoice(i)}
                            className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${cls}`}
                        >
                            <span dir={dir}>{opt}</span>
                            {answered && isCorrect && <CheckCircle2 size={16} className="shrink-0 text-emerald-300" />}
                            {answered && isChosen && !isCorrect && <XCircle size={16} className="shrink-0 text-rose-300" />}
                        </button>
                    );
                })}
            </div>

            {answered && (
                <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-3 text-sm leading-relaxed text-slate-200"
                >
                    {lock.success}
                </motion.p>
            )}
        </div>
    );
};

export default function BehindTheScenesChapter5() {
    const reduce = useReducedMotion();
    const { t, dir } = useT();
    const c5 = t.behindAi.chapter5;

    // ניחוש הפתיחה: טקסט מהמילון, מבנה (אייקון/גוון/פוזה) מהמטא־דאטה.
    const guessContent: DiscoveryGuessContent = {
        eyebrow: c5.guess.eyebrow,
        title: c5.guess.title,
        subtitle: c5.guess.subtitle,
        invite: c5.guess.invite,
        invitePose: 'guessThinking',
        getsRightLabel: c5.guess.getsRightLabel,
        revealButton: c5.guess.revealButton,
        revealTitle: c5.guess.revealTitle,
        revealCopy: c5.guess.revealCopy,
        revealPose: 'pointdown',
        cta: c5.guess.cta,
        ctaTargetId: 'answer-builder-lab',
        resetButton: c5.guess.resetButton,
        exploreHint: c5.guess.exploreHint,
    };
    const guessCards: DiscoveryGuessCard[] = GUESS_CARD_META.map((m) => ({
        id: m.id,
        icon: m.icon,
        statusTone: m.statusTone,
        mentorPose: m.mentorPose,
        ...c5.guess.cards[m.id],
    }));

    // מבדק הפרק: מנגנון משותף (onComplete, getReviewLinks, nextHref...) נשמר מ-quizData,
    // וטקסט התצוגה ממוזג מהמילון לפי מזהה השאלה. quizData.ts עצמו לא משתנה.
    const baseQuiz = behindAiChapterQuizzes[5];
    const localizedQuiz = {
        ...baseQuiz,
        title: c5.quiz.title,
        subtitle: c5.quiz.subtitle,
        startLabel: c5.quiz.startLabel,
        submitLabel: c5.quiz.submitLabel,
        completedTitle: c5.quiz.completedTitle,
        questions: baseQuiz.questions.map((q) => ({ ...q, ...c5.quiz.byId[q.id as Chapter5QuizId] })),
    };

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={5}>

            {/* ══════════ HERO ══════════ */}
            <div className="relative">
                <motion.section
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 text-start"
                    dir={dir}
                >
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-fuchsia-500/10 blur-[90px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-violet-500/30 mb-5">
                            <Repeat size={14} className="text-violet-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">{c5.hero.badge}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                            {c5.hero.titleLead}{' '}
                            <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
                                {c5.hero.titleHighlight}
                            </span>
                        </h1>

                        <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                            {c5.hero.lede}
                        </p>

                        <p className="mt-4 text-base font-bold text-violet-200">
                            {c5.hero.hook}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-violet-400" /> {c5.hero.chipLoop}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Layers size={14} className="text-fuchsia-400" /> {c5.hero.chipContext}
                            </span>
                        </div>
                    </div>
                </motion.section>

                {/* המנטור בונה תשובה צעד אחר צעד מחלקים והקשר (xl+, מימין) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="answerBuilder" line={c5.mentor.hero} width={165} />
                </div>
            </div>

            {/* ══════════ ניחוש פתיחה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <DiscoveryGuess content={guessContent} cards={guessCards} />
            </section>

            {/* ══════════ מעבדת בניית התשובה ══════════ */}
            <section id="answer-builder-lab" className="relative mt-12 space-y-5 text-start scroll-mt-24" dir={dir}>
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">{c5.sections.labEyebrow}</div>
                        <h3 className="text-2xl font-bold text-white">{c5.sections.labTitle}</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    {c5.sections.labIntro}
                </div>

                <AnswerBuilderLab />

                {/* המנטור מסביר שהפלט חוזר פנימה (xl+, משמאל) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="explain" line={c5.mentor.labExplain} width={160} />
                </div>
            </section>

            {/* ══════════ רגע ה-wow ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <InsightBox type="intuition" title={c5.insight.title}>
                    <span className="block text-lg font-bold text-violet-200">
                        {c5.insight.lead}
                    </span>
                    {c5.insight.body}
                </InsightBox>
            </section>

            {/* ══════════ דוגמה יומיומית ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 flex items-center gap-2">
                        <Lightbulb size={18} className="text-amber-300" />
                        <div className="text-sm font-bold text-slate-100">{c5.analogy.title}</div>
                    </div>
                    <p>
                        {c5.analogy.body}
                    </p>
                </div>
            </section>

            {/* ══════════ תיקון טעות נפוצה ══════════ */}
            <section className="relative mt-12 text-start" dir={dir}>
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="reassure" line={c5.mentor.misconception} width={155} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-rose-200">
                            <XCircle size={18} />
                            <span className="text-sm font-bold">{c5.misconception.wrongLabel}</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">{c5.misconception.wrongQuote}</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-emerald-200">
                            <CheckCircle2 size={18} />
                            <span className="text-sm font-bold">{c5.misconception.rightLabel}</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">
                            {c5.misconception.rightBody}
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════ הסבר פשוט ════════════ */}
            <section className="relative mt-12 text-start" dir={dir}>
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="headsup" line={c5.mentor.takeaways} width={155} flip />
                </div>
                <div className="rounded-2xl border border-violet-500/30 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 text-sm font-bold text-slate-100">{c5.takeawaysTitle}</div>
                    <ul className="space-y-2">
                        {c5.takeaways.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                <span className="text-sm">{line}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ══════════ נעילת הבנה ══════════ */}
            <section className="relative mt-12 text-start" dir={dir}>
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="happy" line={c5.mentor.lock} width={160} />
                </div>
                <div className="rounded-2xl border border-violet-500/40 bg-slate-900/60 p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <Lock size={20} className="text-violet-300" />
                        <h3 className="text-xl font-bold text-white">{c5.lock.title}</h3>
                    </div>

                    <div className="rounded-xl border border-slate-700/50 bg-slate-950/30 p-4">
                        <UnderstandingLock />
                    </div>
                </div>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir={dir}>
                <AssessmentEngine {...localizedQuiz} />
            </section>
        </ChapterLayout>
    );
}
