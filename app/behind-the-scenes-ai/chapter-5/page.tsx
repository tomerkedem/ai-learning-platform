"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Map, Sparkles, ArrowLeftRight, MousePointerClick, Lock, ArrowLeft, ArrowRight,
    FlaskConical, ChefHat, Wrench, CheckCircle2, Info,
} from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine, type ReviewLink } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';
import { Mentor } from '@/components/ai-internals/Mentor';
import { DiscoveryGuess, type DiscoveryGuessContent, type DiscoveryGuessCard, type GuessTone } from '@/components/ai-internals/DiscoveryGuess';
import { SemanticSpaceLab } from '@/components/ai-internals/SemanticSpaceLab';
import { ReadAloudControls, type ReadAloudMode } from '@/components/ai-internals/ReadAloudControls';
import { FloatingReadAloud } from '@/components/ai-internals/FloatingReadAloud';
import type { ReadAloudSegment } from '@/components/ai-internals/useReadAloud';
import { LOCALE_SPEECH_LANG } from '@/components/ai-internals/readAloudLang';
import { useT } from '@/i18n/useT';
import type { MentorPose } from '@/components/ai-internals/Mentor';
import type { SemanticSpaceQuizId } from '@/i18n/locales/he/behind-ai/semanticSpaceQuiz';

/* ════════════════════ מטא-דאטה מבני של כרטיסי הניחוש (לא ניתן לתרגום) ════════════════════ */
// הטקסט מגיע מהמילון (guess.cards[id]); כאן רק המבנה: מזהה, אייקון, גוון הסטטוס
// ופוזת המנטור, שאינם תלויי שפה. הכרטיס הנכון הוא "delayed" (precise).
const GUESS_CARD_META: { id: 'arrived' | 'delayed' | 'checking' | 'recipe'; tone: GuessTone; pose: MentorPose; icon: DiscoveryGuessCard['icon'] }[] = [
    { id: 'arrived', tone: 'common', pose: 'reassure', icon: ArrowLeftRight },
    { id: 'delayed', tone: 'precise', pose: 'celebrate', icon: Sparkles },
    { id: 'checking', tone: 'partial', pose: 'think', icon: Wrench },
    { id: 'recipe', tone: 'layer', pose: 'think', icon: ChefHat },
];

/* ════════════════════ נעילת הבנה: התשובה הנכונה מבנית ════════════════════ */
const LOCK_CORRECT = 1;

const LockQuestion: React.FC = () => {
    const { t, dir } = useT();
    const lock = t.behindAi.semanticSpace.lock;
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;
    const correct = choice === LOCK_CORRECT;

    return (
        <div dir={dir} className="text-start">
            <p className="mb-3 text-sm font-bold text-slate-200">{lock.question}</p>

            <div className="grid gap-2 sm:grid-cols-3">
                {lock.options.map((opt, i) => {
                    const isCorrect = i === LOCK_CORRECT;
                    const isChosen = i === choice;
                    let cls = 'border-slate-700/50 bg-slate-950/30 text-slate-300 hover:border-slate-600';
                    if (answered && isChosen && isCorrect) cls = 'border-emerald-400/70 bg-emerald-900/25 text-emerald-100';
                    else if (answered && isChosen && !isCorrect) cls = 'border-amber-400/70 bg-amber-900/20 text-amber-100';
                    else if (answered && isCorrect) cls = 'border-emerald-400/50 bg-emerald-900/15 text-emerald-100';
                    return (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setChoice(i)}
                            className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-start text-sm font-bold transition-colors ${cls}`}
                        >
                            <span>{opt}</span>
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
                    className={`mt-4 rounded-xl border p-3 text-sm leading-relaxed text-slate-200 ${
                        correct ? 'border-emerald-500/30 bg-emerald-950/15' : 'border-amber-500/30 bg-amber-950/15'
                    }`}
                >
                    {correct ? lock.explanationCorrect : lock.explanationWrong}
                </motion.p>
            )}
        </div>
    );
};

/* ════════════════════ העמוד ════════════════════ */

export default function BehindTheScenesChapter5() {
    const { t, dir, locale } = useT();
    const reduce = useReducedMotion();
    const isRtl = dir === 'rtl';
    const c5 = t.behindAi.semanticSpace;

    // ── ניחוש הפתיחה: תוכן + כרטיסים ממוזגים מהמילון עם המטא-דאטה המבני ──
    const g = c5.guess;
    const guessContent: DiscoveryGuessContent = {
        eyebrow: g.eyebrow,
        title: g.title,
        subtitle: g.subtitle,
        prompt: g.prompt,
        invite: g.invite,
        invitePose: 'think',
        getsRightLabel: g.getsRightLabel,
        revealButton: g.revealButton,
        revealTitle: g.revealTitle,
        revealCopy: g.revealCopy,
        revealPose: 'celebrate',
        cta: g.cta,
        ctaTargetId: 'semantic-lab',
        resetButton: g.resetButton,
        exploreHint: g.exploreHint,
    };
    const guessCards: DiscoveryGuessCard[] = GUESS_CARD_META.map((meta) => {
        const card = g.cards[meta.id];
        return {
            id: meta.id,
            title: card.title,
            desc: card.desc,
            icon: meta.icon,
            statusLabel: card.statusLabel,
            statusTone: meta.tone,
            mentorPose: meta.pose,
            getsRight: card.getsRight,
            missesLabel: card.missesLabel,
            misses: card.misses,
            bridge: card.bridge,
        };
    });

    // ── דוק האזנה מודרכת: מקטעי הקראה יציבים בלבד. לא נכללים: ניחוש, מצב חי של
    // המעבדה (בחירה, גרירה, שכנים, אחוזים), כפתורים, מנטורים וחידון. תוויות מ-aiInternals. ──
    const ra = t.behindAi.aiInternals.readAloud;
    const sTitle: ReadAloudSegment = { id: 'title', label: c5.hero.titleLead, text: `${c5.hero.titleLead} ${c5.hero.titleHighlight}. ${c5.hero.lede}` };
    const sPlain: ReadAloudSegment = { id: 'plain', label: c5.plain.title, text: `${c5.plain.title}. ${c5.plain.lines.join(' ')}` };
    const sExplainAll: ReadAloudSegment = { id: 'explain', label: c5.explain.title, text: `${c5.explain.title}. ${c5.explain.paragraphs.join(' ')}` };
    const sExplainEach: ReadAloudSegment[] = c5.explain.paragraphs.map((p, i) => ({ id: `explain-${i}`, label: c5.explain.title, text: p }));
    const sNegation: ReadAloudSegment = { id: 'negation', label: c5.lab.negation.title, text: `${c5.lab.negation.explanation} ${c5.lab.negation.bridge}` };
    const sPracticalShort: ReadAloudSegment = { id: 'practical', label: c5.practical.title, text: `${c5.practical.title}. ${c5.practical.lead}` };
    const sPracticalFull: ReadAloudSegment = { id: 'practical', label: c5.practical.title, text: `${c5.practical.title}. ${c5.practical.lead} ${c5.practical.uses.join(' ')}` };
    const sCaveat: ReadAloudSegment = { id: 'caveat', label: c5.practical.title, text: c5.practical.caveat };
    const sBridge: ReadAloudSegment = { id: 'bridge', label: c5.practical.title, text: c5.practical.bridge };

    const readAloudByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
        short: [sTitle, sPlain, sPracticalShort, sCaveat],
        regular: [sTitle, sPlain, sExplainAll, sNegation, sPracticalFull, sCaveat],
        full: [sTitle, sPlain, ...sExplainEach, sNegation, sPracticalFull, sCaveat, sBridge],
    };

    // ── מבדק הפרק: המנגנון המשותף נשמר מ-quizData, וטקסט התצוגה ממוזג לפי מזהה. ──
    const cq = t.behindAi.chapterQuiz;
    const baseQuiz = behindAiChapterQuizzes[5];
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
        title: c5.quiz.title,
        subtitle: c5.quiz.subtitle,
        startLabel: c5.quiz.startLabel,
        submitLabel: c5.quiz.submitLabel,
        completedTitle: c5.quiz.completedTitle,
        getReviewLinks,
        questions: baseQuiz.questions.map((q) => ({ ...q, ...c5.quiz.byId[q.id as SemanticSpaceQuizId] })),
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
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-violet-500/30 mb-5">
                            <Map size={14} className="text-violet-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">{c5.hero.badge}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                            {c5.hero.titleLead}{' '}
                            <span className={`${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent`}>
                                {c5.hero.titleHighlight}
                            </span>
                        </h1>

                        <p className="text-lg text-slate-300 leading-relaxed">{c5.hero.lede}</p>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-violet-400" /> {c5.hero.chipMap}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <ArrowLeftRight size={14} className="text-cyan-400" /> {c5.hero.chipNeighbors}
                            </span>
                        </div>

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
                {/* מנטור: כל משפט מקבל מקום במפה (xl+, צד חיצוני לפי כיוון) */}
                <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-full ml-3 2xl:ml-6' : 'right-full mr-3 2xl:mr-6'} z-20 hidden xl:block pointer-events-none`}>
                    <Mentor pose="meaningSpace" line={c5.mentor.hero} width={165} flip={!isRtl} />
                </div>
            </div>

            {/* ══════════ במילים פשוטות ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-[2rem] border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-xl md:p-8">
                    <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                        <Sparkles size={14} /> {c5.plain.eyebrow}
                    </span>
                    <h3 className="mb-4 text-xl font-black text-white md:text-2xl">{c5.plain.title}</h3>
                    <ul className="space-y-3">
                        {c5.plain.lines.map((line) => (
                            <li key={line} className="flex items-start gap-3">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                                <span className="text-[15px] leading-relaxed text-slate-200">{line}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ══════════ ניחוש מהיר ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <DiscoveryGuess content={guessContent} cards={guessCards} mentorScale={2} />
            </section>

            {/* ══════════ Semantic Space Lab ══════════ */}
            <section id="semantic-lab" className="relative mt-12 space-y-5 text-start scroll-mt-[var(--bts-sticky-top,88px)]" dir={dir}>
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

                <SemanticSpaceLab content={c5.lab} dir={dir} />

                {/* מנטור: קרוב במרחב, קרוב במשמעות (xl+, צד פנימי לפי כיוון) */}
                <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-full mr-3 2xl:mr-6' : 'left-full ml-3 2xl:ml-6'} z-20 hidden xl:block pointer-events-none`}>
                    <Mentor pose="think" line={c5.mentor.lab} width={160} flip={!isRtl} />
                </div>
            </section>

            {/* ══════════ מה המפה מלמדת ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-6">
                    <h3 className="mb-4 text-lg font-bold text-slate-200">{c5.explain.title}</h3>
                    <div className="space-y-3">
                        {c5.explain.paragraphs.map((p, i) => (
                            <p key={i} className="text-[15px] leading-relaxed text-slate-300">{p}</p>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ נעילת הבנה ══════════ */}
            <section className="relative mt-12 text-start" dir={dir}>
                <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-full ml-3 2xl:ml-6' : 'right-full mr-3 2xl:mr-6'} z-20 hidden xl:block pointer-events-none`}>
                    <Mentor pose="happy" line={c5.mentor.lock} width={160} flip={!isRtl} />
                </div>
                <div className="rounded-2xl border border-violet-500/40 bg-slate-900/60 p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <Lock size={20} className="text-violet-300" />
                        <h3 className="text-xl font-bold text-white">{c5.lock.title}</h3>
                    </div>
                    <LockQuestion />
                </div>
            </section>

            {/* ══════════ תובנה מעשית ══════════ */}
            <section className="relative mt-12 text-start" dir={dir}>
                <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-full mr-3 2xl:mr-6' : 'left-full ml-3 2xl:ml-6'} z-20 hidden xl:block pointer-events-none`}>
                    <Mentor pose="pointdown" line={c5.mentor.practical} width={160} flip={!isRtl} />
                </div>
                <InsightBox type="intuition" title={c5.practical.title}>
                    <span className="block">{c5.practical.lead}</span>
                    <ul className="mt-3 space-y-2">
                        {c5.practical.uses.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                <span className="text-sm">{line}</span>
                            </li>
                        ))}
                    </ul>
                    <span className="mt-3 block text-sm text-slate-400">{c5.practical.caveat}</span>
                    <span className="mt-3 flex items-start gap-2 border-s-2 border-violet-400/50 ps-3 text-sm font-bold text-violet-100">
                        {isRtl ? <ArrowLeft size={15} className="mt-0.5 shrink-0" /> : <ArrowRight size={15} className="mt-0.5 shrink-0" />}
                        {c5.practical.bridge}
                    </span>
                </InsightBox>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir={dir}>
                <AssessmentEngine {...localizedQuiz} conceptDisplayMap={c5.quiz.conceptLabels} />
            </section>
        </ChapterLayout>
    );
}
