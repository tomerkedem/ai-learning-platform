"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Type, MousePointerClick, ArrowLeftRight, FlaskConical, Lightbulb, Lock, CheckCircle2, XCircle, Brain, FileText, MessageSquare, Filter } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine, type ReviewLink } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import type { Chapter2QuizId } from '@/i18n/locales/he/behind-ai/chapter2Quiz';

import { OpeningGuess, type OpeningGuessContent, type DiscoveryGuessCard } from '@/components/ai-internals/OpeningGuess';
import { InputComparisonLab } from '@/components/ai-internals/InputComparisonLab';
import { Mentor } from '@/components/ai-internals/Mentor';
import { ReadAloudControls, type ReadAloudMode } from '@/components/ai-internals/ReadAloudControls';
import { FloatingReadAloud } from '@/components/ai-internals/FloatingReadAloud';
import type { ReadAloudSegment } from '@/components/ai-internals/useReadAloud';
import { LOCALE_SPEECH_LANG } from '@/components/ai-internals/readAloudLang';
import { useT } from '@/i18n/useT';

/* ════════════════════════ מטא-דאטה מבני של ניחוש הפתיחה ════════════════════════ */
// id, אייקון, גוון סטטוס ופוזת מנטור הם מבניים (לא טקסט). הטקסט מגיע מהמילון, באותו סדר.
const GUESS_CARD_META = [
    { id: 'intention', icon: Brain, statusTone: 'common', mentorPose: 'reassure' },
    { id: 'text', icon: FileText, statusTone: 'precise', mentorPose: 'correct' },
    { id: 'answer', icon: MessageSquare, statusTone: 'layer', mentorPose: 'headsup' },
    { id: 'important', icon: Filter, statusTone: 'partial', mentorPose: 'think' },
] as const;

/* ════════════════════════ נעילת הבנה: שאלת אבחון ════════════════════════ */
// התשובה הנכונה מבנית; הטקסט (שאלה, פרומפט, אפשרויות, הסבר) מגיע מהמילון.
const DIAG_CORRECT = 1;

const DiagnosisQuestion: React.FC = () => {
    const { t, dir } = useT();
    const d = t.behindAi.chapter2.diagnosis;
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;

    return (
        <div dir={dir} className="text-start">
            <p className="mb-3 text-sm font-bold text-slate-200">{d.question}</p>
            <p className="mb-4 rounded-lg border border-slate-700/50 bg-slate-950/40 p-3 text-sm text-slate-300">{d.prompt}</p>

            <div className="grid gap-2 sm:grid-cols-2">
                {d.options.map((opt, i) => {
                    const isCorrect = i === DIAG_CORRECT;
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
                    {d.explanation}
                </motion.p>
            )}
        </div>
    );
};

export default function BehindTheScenesChapter2() {
    const reduce = useReducedMotion();
    const { t, dir, locale } = useT();
    const isRtl = dir === 'rtl';
    const c2 = t.behindAi.chapter2;

    // ── דוק האזנה מודרכת: מקטעי הקראה לפי מצב היקף, מאותם מפתחות מילון (ללא שכפול
    // קופי). לא נכללים: חידון, כפתורים, ניווט, צ׳יפים/באדג׳ים, משפטי מנטור, ופלט חי
    // של מעבדת השוואת הקלט. תוויות הדוק משותפות מ-aiInternals.readAloud.
    const ra = t.behindAi.aiInternals.readAloud;
    const sTitle: ReadAloudSegment = { id: 'title', label: c2.hero.titleLead, text: `${c2.hero.titleLead} ${c2.hero.titleHighlight}. ${c2.hero.lede}` };
    const sQuestion: ReadAloudSegment = { id: 'question', label: c2.hero.question, text: c2.hero.question };
    const sGuessQ: ReadAloudSegment = { id: 'guess-q', label: c2.guess.title, text: `${c2.guess.title} ${c2.guess.subtitle}` };
    const sCards: ReadAloudSegment[] = c2.guess.cards.map((card, i) => ({ id: `guess-card-${i}`, label: card.title, text: `${card.title}. ${card.desc}` }));
    const sGuessReveal: ReadAloudSegment = { id: 'guess-reveal', label: c2.guess.revealTitle, text: `${c2.guess.revealTitle} ${c2.guess.revealCopy}` };
    const sInsight: ReadAloudSegment = { id: 'insight', label: c2.insight.title, text: `${c2.insight.lead} ${c2.insight.body}` };
    const sLab: ReadAloudSegment = { id: 'lab', label: c2.inputLab.title, text: `${c2.inputLab.title}. ${c2.inputLab.intro}` };
    const sEveryday: ReadAloudSegment = { id: 'everyday', label: c2.everyday.title, text: `${c2.everyday.title}. ${c2.everyday.body}` };
    const sMistake: ReadAloudSegment = { id: 'mistake', label: c2.mistake.rightLabel, text: `${c2.mistake.wrongLabel}: ${c2.mistake.wrongText} ${c2.mistake.rightLabel}: ${c2.mistake.rightText}` };
    const sTakeaway: ReadAloudSegment = { id: 'takeaway', label: c2.takeaway.title, text: `${c2.takeaway.title}. ${c2.takeaway.points.join(' ')}` };
    const sLock: ReadAloudSegment = { id: 'lock', label: c2.lock.title, text: `${c2.lock.title}. ${c2.lock.truthLabel}: ${c2.lock.truthText} ${c2.lock.mistakeLabel}: ${c2.lock.mistakeText}` };

    const readAloudByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
        short: [sTitle, sQuestion, sInsight, sTakeaway],
        regular: [sTitle, sQuestion, sGuessQ, sGuessReveal, sInsight, sLab, sEveryday, sMistake, sTakeaway, sLock],
        full: [sTitle, sQuestion, sGuessQ, ...sCards, sGuessReveal, sInsight, sLab, sEveryday, sMistake, sTakeaway, sLock],
    };

    // מבדק הפרק: המנגנון המשותף (correctAnswer, onComplete, getReviewLinks, nextHref...)
    // נשמר מ-quizData, וטקסט התצוגה ממוזג מהמילון לפי מזהה השאלה. quizData.ts לא משתנה.
    // קישורי החזרה שומרים על ה-href, ורק התווית מתורגמת מתוך t.behindAi.chapterQuiz.
    const cq = t.behindAi.chapterQuiz;
    const quizText = c2.quiz;
    const baseQuiz = behindAiChapterQuizzes[2];
    const baseGetReviewLinks = baseQuiz.getReviewLinks;
    const getReviewLinks = baseGetReviewLinks
        ? (weakConcepts: string[]): ReviewLink[] =>
              baseGetReviewLinks(weakConcepts).map((link) => {
                  const match = link.href.match(/chapter-(\d+)/);
                  const n = match ? Number(match[1]) : null;
                  const name = n != null ? cq.chapterNames[n] : undefined;
                  if (n == null || !name) return link;
                  return { ...link, label: cq.reviewLinkLabel(n, name) };
              })
        : undefined;
    const localizedQuiz = {
        ...baseQuiz,
        title: quizText.title,
        subtitle: quizText.subtitle,
        startLabel: quizText.startLabel,
        submitLabel: quizText.submitLabel,
        completedTitle: quizText.completedTitle,
        questions: baseQuiz.questions.map((q) => ({ ...q, ...quizText.byId[q.id as Chapter2QuizId] })),
        getReviewLinks,
    };

    // תוכן ניחוש הפתיחה: טקסט מהמילון, פוזות ויעד מבניים בעמוד.
    const guessContent: OpeningGuessContent = {
        eyebrow: c2.guess.eyebrow,
        title: c2.guess.title,
        subtitle: c2.guess.subtitle,
        invite: c2.guess.invite,
        invitePose: 'think',
        correctTitle: c2.guess.correctTitle,
        wrongTitle: c2.guess.wrongTitle,
        getsRightLabel: c2.guess.getsRightLabel,
        revealButton: c2.guess.revealButton,
        revealTitle: c2.guess.revealTitle,
        revealCopy: c2.guess.revealCopy,
        revealPose: 'pointdown',
        cta: c2.guess.cta,
        ctaTargetId: 'input-lab',
        resetButton: c2.guess.resetButton,
        exploreHint: c2.guess.exploreHint,
    };
    const guessCards: DiscoveryGuessCard[] = GUESS_CARD_META.map((m, i) => {
        const card = c2.guess.cards[i];
        return {
            id: m.id,
            icon: m.icon,
            statusTone: m.statusTone,
            mentorPose: m.mentorPose,
            title: card.title,
            desc: card.desc,
            statusLabel: card.statusLabel,
            getsRight: card.getsRight,
            missesLabel: card.missesLabel,
            misses: card.misses,
            bridge: card.bridge,
        };
    });

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={2}>

            {/* ══════════ HERO ══════════ */}
            <div className="relative">
                <motion.section
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 text-start"
                    dir={dir}
                >
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

                    {/* ב-lg+ דוק ההאזנה מעוגן בפינה מעל הכותרת; הכותרת וה-lede מתפזרים לרוחב מלא מתחתיו */}
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-indigo-500/30 mb-5">
                            <Type size={14} className="text-indigo-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-indigo-300">{c2.hero.badge}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                            {c2.hero.titleLead}{' '}
                            <span className={`${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent`}>
                                {c2.hero.titleHighlight}
                            </span>
                        </h1>

                        <p className="text-lg text-slate-300 leading-relaxed">
                            {c2.hero.lede}
                        </p>

                        <p className="mt-4 text-base font-bold text-indigo-200">{c2.hero.question}</p>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-indigo-400" /> {c2.hero.chipGuess}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <ArrowLeftRight size={14} className="text-cyan-400" /> {c2.hero.chipCompare}
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

                <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-full ml-3 2xl:ml-6' : 'right-full mr-3 2xl:mr-6'} z-20 hidden xl:block pointer-events-none`}>
                    <Mentor pose="inputClarity" line={c2.mentor.hero} width={165} flip={!isRtl} />
                </div>
            </div>

            {/* ══════════ ניחוש פתיחה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <OpeningGuess content={guessContent} cards={guessCards} />
            </section>

            {/* ══════════ הסבר פשוט: מה באמת קורה כאן (במקום "הנקודה המפתיעה") ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-[2rem] border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-xl md:p-8">
                    <div className="mb-3 flex items-center gap-2">
                        <Lightbulb size={18} className="text-indigo-300" />
                        <h3 className="text-xl font-black text-white md:text-2xl">{c2.insight.title}</h3>
                    </div>
                    <p className="mb-2.5 text-lg font-bold text-indigo-200">{c2.insight.lead}</p>
                    <p className="text-[15px] leading-relaxed text-slate-300">{c2.insight.body}</p>
                </div>
            </section>

            {/* ══════════ מעבדת השוואת קלט ══════════ */}
            <section id="input-lab" className="relative mt-12 space-y-5 text-start scroll-mt-24" dir={dir}>
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-indigo-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-400">{c2.inputLab.eyebrow}</div>
                        <h3 className="text-2xl font-bold text-white">{c2.inputLab.title}</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    {c2.inputLab.intro}
                </div>

                <InputComparisonLab />

                <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-full mr-3 2xl:mr-6' : 'left-full ml-3 2xl:ml-6'} z-20 hidden xl:block pointer-events-none`}>
                    <Mentor pose="explain" line={c2.mentor.lab} width={160} flip={!isRtl} />
                </div>
            </section>

            {/* ══════════ דוגמה יומיומית ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 flex items-center gap-2">
                        <Lightbulb size={18} className="text-amber-300" />
                        <div className="text-sm font-bold text-slate-100">{c2.everyday.title}</div>
                    </div>
                    <p>
                        {c2.everyday.body}
                    </p>
                </div>
            </section>

            {/* ══════════ תיקון טעות נפוצה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-rose-200">
                            <XCircle size={18} />
                            <span className="text-sm font-bold">{c2.mistake.wrongLabel}</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">{c2.mistake.wrongText}</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-emerald-200">
                            <CheckCircle2 size={18} />
                            <span className="text-sm font-bold">{c2.mistake.rightLabel}</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">
                            {c2.mistake.rightText}
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════ הסבר פשוט ════════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 text-sm font-bold text-slate-100">{c2.takeaway.title}</div>
                    <ul className="space-y-2">
                        {c2.takeaway.points.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                                <span className="text-sm">{line}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ══════════ נעילת הבנה ══════════ */}
            <section className="relative mt-12 text-start" dir={dir}>
                <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-full ml-3 2xl:ml-6' : 'right-full mr-3 2xl:mr-6'} z-20 hidden xl:block pointer-events-none`}>
                    <Mentor pose="happy" line={c2.mentor.lock} width={160} flip={!isRtl} />
                </div>
                <div className="rounded-2xl border border-indigo-500/40 bg-slate-900/60 p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <Lock size={20} className="text-indigo-300" />
                        <h3 className="text-xl font-bold text-white">{c2.lock.title}</h3>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">{c2.lock.truthLabel}</div>
                            <p className="text-sm leading-relaxed text-slate-200">{c2.lock.truthText}</p>
                        </div>
                        <div className="rounded-xl border border-rose-500/30 bg-rose-950/10 p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-rose-300">{c2.lock.mistakeLabel}</div>
                            <p className="text-sm leading-relaxed text-slate-200">{c2.lock.mistakeText}</p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-700/50 bg-slate-950/30 p-4">
                        <DiagnosisQuestion />
                    </div>
                </div>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-12 mb-4" dir={dir}>
                <AssessmentEngine {...localizedQuiz} conceptDisplayMap={quizText.conceptLabels} />
            </section>
        </ChapterLayout>
    );
}
