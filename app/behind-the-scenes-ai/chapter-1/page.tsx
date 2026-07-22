"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import { AlertTriangle, ArrowDown, Bot, Box, CheckCircle2, ChevronLeft, ChevronRight, Eye, Package, UserRound } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine, type ReviewLink } from '@/components/content/AssessmentEngine';
import { ExpandableLab } from '@/components/ai-internals/ExpandableLab';
import { FloatingReadAloud } from '@/components/ai-internals/FloatingReadAloud';
import { Mentor } from '@/components/ai-internals/Mentor';
import { ReadAloudControls, type ReadAloudMode } from '@/components/ai-internals/ReadAloudControls';
import type { ReadAloudSegment } from '@/components/ai-internals/useReadAloud';
import { LOCALE_SPEECH_LANG } from '@/components/ai-internals/readAloudLang';
import { useT } from '@/i18n/useT';
import type { Chapter1QuizId } from '@/i18n/locales/he/behind-ai/chapter1Quiz';
import { behindAiChapterQuizzes } from '../quizData';

type PathStep = 'request' | 'assembly' | 'model' | 'handling' | 'response';

export default function BehindTheScenesChapter1() {
    const reduce = useReducedMotion();
    const { t, dir, locale } = useT();
    const isRtl = dir === 'rtl';
    const c = t.behindAi.chapter1.redesign;
    const ra = t.behindAi.aiInternals.readAloud;
    const [example, setExample] = useState(0);
    const [activeStep, setActiveStep] = useState<PathStep>('request');
    const [failure, setFailure] = useState(0);

    const quizText = t.behindAi.chapter1.quiz;
    const baseQuiz = behindAiChapterQuizzes[1];
    const cq = t.behindAi.chapterQuiz;
    const baseGetReviewLinks = baseQuiz.getReviewLinks;
    const localizedQuiz = {
        ...baseQuiz,
        title: quizText.title,
        subtitle: quizText.subtitle,
        startLabel: quizText.startLabel,
        submitLabel: quizText.submitLabel,
        completedTitle: quizText.completedTitle,
        questions: baseQuiz.questions.map((q) => ({ ...q, ...quizText.byId[q.id as Chapter1QuizId] })),
        getReviewLinks: baseGetReviewLinks
            ? (weak: string[]): ReviewLink[] => baseGetReviewLinks(weak).map((link) => {
                const match = link.href.match(/chapter-(\d+)/);
                const n = match ? Number(match[1]) : null;
                const name = n == null ? undefined : cq.chapterNames[n];
                return n != null && name ? { ...link, label: cq.reviewLinkLabel(n, name) } : link;
            })
            : undefined,
    };

    const path = useMemo<Array<{ id: PathStep; title: string; body: string; icon: React.ReactNode }>>(() => [
        { id: 'request', title: c.path.requestTitle, body: c.path.requestBody, icon: <UserRound size={20} /> },
        { id: 'assembly', title: c.path.productInputTitle, body: c.path.productInputBody, icon: <Box size={20} /> },
        { id: 'model', title: c.path.modelTitle, body: c.path.modelBody, icon: <Bot size={20} /> },
        { id: 'handling', title: c.path.productOutputTitle, body: c.path.productOutputBody, icon: <Package size={20} /> },
        { id: 'response', title: c.path.responseTitle, body: c.path.responseBody, icon: <Eye size={20} /> },
    ], [c.path]);
    const selected = c.examples[example];
    const active = path.find((step) => step.id === activeStep) ?? path[0];
    const currentFailure = c.failures.items[failure];

    const dynamicText = `${c.interaction.selectedLabel}: ${selected.request}. ${c.interaction.resultLabel}: ${selected.response}. ${selected.evidence}`;
    const segments = useMemo<ReadAloudSegment[]>(() => [
        { id: 'opening', label: c.hero.title, text: `${c.hero.title}. ${c.hero.lede}` },
        { id: 'instruction', label: c.interaction.title, text: `${c.interaction.instruction} ${dynamicText}` },
        { id: 'path', label: c.path.title, text: `${c.path.explanation} ${path.map((s) => `${s.title}. ${s.body}`).join(' ')}` },
        { id: 'failure', label: c.failures.title, text: `${c.failures.intro} ${currentFailure.title}. ${currentFailure.body}. ${c.failures.conclusion}` },
        { id: 'summary', label: c.summary.title, text: `${c.summary.title}. ${c.summary.points.join(' ')}` },
        { id: 'bridge', label: c.bridge.title, text: `${c.bridge.question} ${c.bridge.body}` },
    ], [c, dynamicText, currentFailure, path]);
    const segmentsByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
        short: [segments[0], segments[4], segments[5]],
        regular: segments,
        full: segments,
    };

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={1}>
            <main dir={dir} className="mx-auto w-full min-w-0 max-w-6xl overflow-x-clip pb-16 text-start">
                <section className="relative overflow-hidden rounded-[2rem] border border-cyan-500/25 bg-slate-950/70 p-6 md:p-10">
                    <div className="max-w-3xl">
                        <div className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">{c.hero.badge}</div>
                        <h1 className="mt-3 break-words text-2xl font-black text-white sm:text-3xl md:text-5xl">{c.hero.title}</h1>
                        <p className="mt-5 text-lg leading-relaxed text-slate-200">{c.hero.lede}</p>
                    </div>
                    <p className="mt-5 rounded-xl border border-cyan-400/25 bg-cyan-950/20 p-4 text-sm leading-relaxed text-cyan-100 sm:hidden">{c.mentor}</p>
                    <div className={`mt-6 hidden sm:block ${isRtl ? 'md:ms-auto' : ''} w-fit`}>
                        <Mentor pose="peek" line={c.mentor} width={220} flip={!isRtl} />
                    </div>
                </section>

                <FloatingReadAloud dir={dir}>
                    <ReadAloudControls
                        key={`${locale}:${example}:${failure}`}
                        segmentsByMode={segmentsByMode}
                        lang={LOCALE_SPEECH_LANG[locale]}
                        locale={locale}
                        dir={dir}
                        labels={ra}
                        reduce={!!reduce}
                        compact
                    />
                </FloatingReadAloud>

                <section className="mt-10 rounded-3xl border border-white/10 bg-slate-900/55 p-5 md:p-8">
                    <h2 className="text-2xl font-black text-white">{c.interaction.title}</h2>
                    <p className="mt-2 max-w-3xl leading-relaxed text-cyan-100">{c.interaction.instruction}</p>
                    <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={c.interaction.examplesLabel}>
                        {c.examples.map((item, index) => (
                            <button key={item.request} type="button" onClick={() => { setExample(index); setActiveStep('request'); }} aria-pressed={example === index}
                                className={`rounded-xl border px-4 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${example === index ? 'border-cyan-300 bg-cyan-900/30 text-white' : 'border-white/15 bg-slate-950/50 text-slate-300'}`}>
                                {item.request}
                            </button>
                        ))}
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2" aria-live="polite">
                        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                            <div className="text-xs font-bold text-slate-400">{c.interaction.visibleLabel}</div>
                            <p className="mt-2 font-bold text-white">{selected.response}</p>
                        </div>
                        <div className="rounded-2xl border border-amber-400/30 bg-amber-950/15 p-4">
                            <div className="text-xs font-bold text-amber-300">{c.interaction.evidenceLabel}</div>
                            <p className="mt-2 text-sm leading-relaxed text-slate-200">{selected.evidence}</p>
                        </div>
                    </div>
                </section>

                <section className="mt-10">
                    <h2 className="text-2xl font-black text-white">{c.path.title}</h2>
                    <p className="mt-2 max-w-3xl text-slate-300">{c.path.explanation}</p>
                    <div className="mt-6 grid gap-3" aria-label={c.path.semanticLabel}>
                        {path.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <button type="button" onClick={() => setActiveStep(step.id)} aria-pressed={activeStep === step.id}
                                    className={`grid w-full grid-cols-[auto_1fr] gap-3 rounded-2xl border p-4 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${activeStep === step.id ? 'border-cyan-300/70 bg-cyan-950/25' : 'border-white/10 bg-slate-900/60'}`}>
                                    <span className="mt-0.5 text-cyan-300" aria-hidden>{step.icon}</span>
                                    <span><span className="block font-black text-white">{step.title}</span><span className="mt-1 block text-sm leading-relaxed text-slate-300">{step.body}</span></span>
                                </button>
                                {index < path.length - 1 && <ArrowDown className="mx-auto text-slate-500" size={18} aria-hidden />}
                            </React.Fragment>
                        ))}
                    </div>
                    <div role="status" aria-live="polite" className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-950/15 p-4 text-sm text-cyan-100">
                        <strong>{active.title}:</strong> {active.body}
                    </div>
                    <p className="mt-4 rounded-xl border border-indigo-400/25 bg-indigo-950/20 p-4 text-indigo-100">{c.path.envelope}</p>
                </section>

                <section className="mt-12">
                    <h2 className="text-2xl font-black text-white">{c.failures.title}</h2>
                    <p className="mt-2 max-w-3xl text-slate-300">{c.failures.intro}</p>
                    <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label={c.failures.groupLabel}>
                        {c.failures.items.map((item, index) => (
                            <button key={item.title} type="button" onClick={() => setFailure(index)} aria-pressed={failure === index}
                                className={`flex items-start gap-3 rounded-xl border p-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${failure === index ? 'border-amber-300/70 bg-amber-950/25' : 'border-white/10 bg-slate-900/50'}`}>
                                <AlertTriangle size={17} className="mt-0.5 shrink-0 text-amber-300" aria-hidden />
                                <span><span className="block text-sm font-bold text-white">{item.title}</span><span className="mt-1 block text-xs leading-relaxed text-slate-400">{item.body}</span></span>
                            </button>
                        ))}
                    </div>
                    <p role="status" aria-live="polite" className="mt-4 rounded-xl border border-amber-400/25 bg-amber-950/15 p-4 text-amber-100">{currentFailure.title}: {currentFailure.body}</p>
                    <p className="mt-4 font-bold text-white">{c.failures.conclusion}</p>
                </section>

                <section className="mt-12 rounded-3xl border border-emerald-400/25 bg-emerald-950/15 p-6 md:p-8">
                    <h2 className="text-2xl font-black text-white">{c.summary.title}</h2>
                    <ol className="mt-5 space-y-3">
                        {c.summary.points.map((point, index) => <li key={point} className="flex gap-3 text-slate-200"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={19} aria-hidden /><span><span className="sr-only">{index + 1}. </span>{point}</span></li>)}
                    </ol>
                </section>

                <section className="mt-10 rounded-3xl border border-indigo-400/30 bg-gradient-to-br from-indigo-950/35 to-slate-950/60 p-6 text-center md:p-9">
                    <h2 className="text-2xl font-black text-white">{c.bridge.title}</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-lg text-indigo-100">{c.bridge.question}</p>
                    <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-300">{c.bridge.body}</p>
                    <Link href="/behind-the-scenes-ai/chapter-2" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-400 px-5 py-3 font-black text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                        {c.bridge.cta} {isRtl ? <ChevronLeft size={18} aria-hidden /> : <ChevronRight size={18} aria-hidden />}
                    </Link>
                </section>

                <section className="mt-10">
                    <ExpandableLab title={localizedQuiz.title}>
                        <AssessmentEngine {...localizedQuiz} conceptDisplayMap={quizText.conceptLabels} />
                    </ExpandableLab>
                </section>
            </main>
        </ChapterLayout>
    );
}
