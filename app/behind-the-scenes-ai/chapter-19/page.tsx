"use client";

// ────────────────────────────────────────────────────────────────────────
// פרק 19: Full Trace (פרומפט אחד, כל התחנות). פרק הסיכום (capstone) של הלומדה.
//
// הרעיון: חוויית AI אמיתית אינה תשובה קסומה אחת, אלא רצף של המרות ובדיקות. פרומפט
// אחד עובר מהקלט, דרך משמעות, ייצור, אמינות ושכבת ה-Agent, ועד ההחלטה המבוקרת.
// הפרק מחבר את כל תחנות הקורס למסלול אחד גלוי, ומסתיים במעבר למבחן הסיום.
//
// הפרק אינו טוען ש-AI מסוכן, שאסור ל-Agent לפעול, שהוא תמיד פועל לבד, או ש-Full Trace
// הוא הצצה למחשבה פרטית. Full Trace הוא תיעוד חינוכי של שלבים גלויים, לא chain-of-thought.
//
// i18n-first: כל הטקסט הגלוי מגיע מ-t.behindAi.fullTrace (6 שפות אמיתיות). המבנה
// (אייקונים, גוונים, פוזות מנטור, מזהי אלמנטים) נשאר כאן. פרק 19 הוא הפרק האחרון
// בתוכנית, ולכן הוא מסתיים ב-CTA למבחן הסיום, בלי מסך "עוד פרקים בקרוב".
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Route, MessageSquareText, Send, Search, MousePointerClick, Layers, FlaskConical,
    ListChecks, CheckCircle2, XCircle, Sparkles, GraduationCap, ArrowLeft, ArrowRight,
} from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine, type ReviewLink } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';

import { OpeningGuess, type OpeningGuessContent, type DiscoveryGuessCard } from '@/components/ai-internals/OpeningGuess';
import { FullTraceLab } from '@/components/ai-internals/FullTraceLab';
import { Mentor } from '@/components/ai-internals/Mentor';
import { ExpandableLab } from '@/components/ai-internals/ExpandableLab';
import { SpeakButton } from '@/components/ai-internals/SpeakButton';
import { FloatingReadAloud } from '@/components/ai-internals/FloatingReadAloud';
import { ReadAloudControls, type ReadAloudMode } from '@/components/ai-internals/ReadAloudControls';
import type { ReadAloudSegment } from '@/components/ai-internals/useReadAloud';
import { LOCALE_SPEECH_LANG } from '@/components/ai-internals/readAloudLang';
import { useT } from '@/i18n/useT';
import type { FullTraceQuizId } from '@/i18n/locales/he/behind-ai/fullTraceQuiz';

// טקסט הכרטיסים מגיע מהמילון (t.behindAi.fullTrace.guess.cards) לפי מזהה. כאן נשאר
// רק המבנה: אייקון, גוון הסטטוס ופוזת המנטור, שאינם תלויי שפה. הכרטיס עם
// statusTone === 'precise' הוא הבחירה הנכונה (מסלול שלם, לא תשובה אחת).
const GUESS_CARD_META = [
    { id: 'fullRoute', icon: Route, statusTone: 'precise', mentorPose: 'correct' },
    { id: 'oneAnswer', icon: MessageSquareText, statusTone: 'common', mentorPose: 'reassure' },
    { id: 'agentSends', icon: Send, statusTone: 'layer', mentorPose: 'headsup' },
    { id: 'noChecks', icon: Search, statusTone: 'partial', mentorPose: 'think' },
] as const;

/* ════════════════ בדיקת הבנה: מה המערכת תוציא כשהמקור בעיכוב וההנחיה היא לא לשלוח ════════════════ */
// התשובה הנכונה: "טיוטה בלי תאריך שהומצא, ולחכות לאישור" (אינדקס 1).
const LOCK_CORRECT = 1;

const UnderstandingLock: React.FC = () => {
    const { t, dir } = useT();
    const c19 = t.behindAi.fullTrace;
    const lock = c19.lock;
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;

    return (
        <div dir={dir} className="text-start">
            <div className="mb-3 flex items-center gap-2">
                <p className="text-sm font-bold text-slate-200">{lock.question}</p>
                <SpeakButton text={lock.question} speechLocale={c19.contentLocale} />
            </div>

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
                            className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-start text-sm font-bold transition-colors ${cls}`}
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

export default function BehindTheScenesChapter19() {
    const reduce = useReducedMotion();
    const { t, dir } = useT();
    const isRtl = dir === 'rtl';
    const c19 = t.behindAi.fullTrace;
    const raLabels = t.behindAi.aiInternals.readAloud;

    // שפת ההקראה נגזרת מ-contentLocale של הפרק, כדי שההקראה תדבר בשפת התוכן ולא בשפת
    // הממשק. הכיוון (RTL/LTR) של הפריסה מגיע מ-dir של שפת הממשק.
    const speechLocale = c19.contentLocale;
    const FlowArrow = isRtl ? ArrowLeft : ArrowRight;
    const [activeTraceNarration, setActiveTraceNarration] = useState('');

    // ניחוש הפתיחה: טקסט מהמילון, מבנה (אייקון/גוון/פוזה) מהמטא־דאטה.
    const guessContent: OpeningGuessContent = {
        eyebrow: c19.guess.eyebrow,
        title: c19.guess.title,
        subtitle: c19.guess.subtitle,
        invite: c19.guess.invite,
        invitePose: 'think',
        correctTitle: c19.guess.correctTitle,
        wrongTitle: c19.guess.wrongTitle,
        getsRightLabel: c19.guess.getsRightLabel,
        revealButton: c19.guess.revealButton,
        revealTitle: c19.guess.revealTitle,
        revealCopy: c19.guess.revealCopy,
        revealPose: 'pointdown',
        cta: c19.guess.cta,
        ctaTargetId: 'full-trace-lab',
        resetButton: c19.guess.resetButton,
        exploreHint: c19.guess.exploreHint,
    };
    const guessCards: DiscoveryGuessCard[] = GUESS_CARD_META.map((m) => ({
        id: m.id,
        icon: m.icon,
        statusTone: m.statusTone,
        mentorPose: m.mentorPose,
        ...c19.guess.cards[m.id],
    }));

    // ── טקסט "רגע לפני המעבדה" להקראה: כותרת, תת-כותרת, פתיח וכל הנקודות. מקור אחד. ──
    const primerText = `${c19.primer.title}. ${c19.primer.subtitle}. ${c19.primer.lead} ${c19.primer.points.map((p) => `${p.title}. ${p.body}`).join(' ')}`;
    const seeText = `${c19.see.title}. ${c19.see.intro} ${c19.see.groups.map((g) => `${g.title}: ${g.stations.join(', ')}`).join('. ')}. ${c19.see.caption}`;

    // ── דוק האזנה מודרכת: מקטעי הקראה יציבים בלבד (בלי מצב חי של המעבדה). התוכן
    // נקרא בשפת contentLocale. ──
    const sHero: ReadAloudSegment = { id: 'hero', label: c19.hero.titleHighlight, text: `${c19.hero.titleLead} ${c19.hero.titleHighlight}. ${c19.hero.lede}` };
    const sGuess: ReadAloudSegment = { id: 'guess', label: c19.guess.eyebrow, text: `${c19.guess.title} ${c19.guess.subtitle}` };
    const sPrimer: ReadAloudSegment = { id: 'primer', label: c19.primer.title, text: primerText };
    const sSee: ReadAloudSegment = { id: 'see', label: c19.see.title, text: seeText };
    const sLab: ReadAloudSegment = {
        id: 'lab',
        label: c19.lab.sectionTitle,
        text: `${c19.lab.sectionTitle}. ${c19.lab.sectionIntro}. ${activeTraceNarration}`,
    };
    const sWow: ReadAloudSegment = { id: 'wow', label: c19.insight.title, text: `${c19.insight.title}. ${c19.insight.lead} ${c19.insight.body}` };
    const sMisconception: ReadAloudSegment = { id: 'misconception', label: c19.misconception.rightLabel, text: `${c19.misconception.rightLabel}. ${c19.misconception.rightBody}` };
    const sLock: ReadAloudSegment = { id: 'lock', label: c19.lock.title, text: c19.lock.question };
    const sPractical: ReadAloudSegment = { id: 'practical', label: c19.practical.title, text: `${c19.practical.title}. ${c19.practical.lead} ${c19.practical.uses.join(' ')}` };
    const sCaveat: ReadAloudSegment = { id: 'caveat', label: c19.practical.title, text: c19.practical.caveat };
    const sFinalCta: ReadAloudSegment = { id: 'finalCta', label: c19.finalCta.title, text: `${c19.finalCta.title}. ${c19.finalCta.body}` };

    const readAloudByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
        short: [sHero, sPrimer, sLab, sPractical, sFinalCta],
        regular: [sHero, sGuess, sPrimer, sSee, sLab, sWow, sLock, sPractical, sCaveat, sFinalCta],
        full: [sHero, sGuess, sPrimer, sSee, sLab, sWow, sMisconception, sLock, sPractical, sCaveat, sFinalCta],
    };

    // ── מבדק הפרק: המנגנון המשותף נשמר מ-quizData, וטקסט התצוגה ממוזג לפי מזהה.
    // קישורי החזרה הממוקדים מתורגמים דרך chapterQuiz, בדיוק כמו בפרקים הקודמים. ──
    const cq = t.behindAi.chapterQuiz;
    const baseQuiz = behindAiChapterQuizzes[19];
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
        title: c19.quiz.title,
        subtitle: c19.quiz.subtitle,
        startLabel: c19.quiz.startLabel,
        submitLabel: c19.quiz.submitLabel,
        completedTitle: c19.quiz.completedTitle,
        getReviewLinks,
        questions: baseQuiz.questions.map((q) => ({ ...q, ...c19.quiz.byId[q.id as FullTraceQuizId] })),
    };

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={19}>

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
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-indigo-500/30 mb-5">
                            <Route size={14} className="text-indigo-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-indigo-300" dir="ltr">{c19.hero.badge}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                            {c19.hero.titleLead}{' '}
                            <span className={`${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent`}>
                                {c19.hero.titleHighlight}
                            </span>
                        </h1>

                        <div className="flex items-start gap-2.5 max-w-3xl">
                            <p className="text-lg text-slate-300 leading-relaxed">{c19.hero.lede}</p>
                            <SpeakButton text={`${c19.hero.titleLead} ${c19.hero.titleHighlight}. ${c19.hero.lede}`} className="mt-1" speechLocale={speechLocale} />
                        </div>

                        <p className="mt-4 text-base font-bold text-indigo-200">
                            {c19.hero.hook}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-indigo-400" /> {c19.hero.chipTry}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Layers size={14} className="text-emerald-400" /> {c19.hero.chipCompare}
                            </span>
                        </div>

                        {/* דוק ההאזנה המודרכת: אותו רכיב של המבוא ושאר הפרקים */}
                        <FloatingReadAloud dir={dir}>
                            <ReadAloudControls
                                segmentsByMode={readAloudByMode}
                                lang={LOCALE_SPEECH_LANG[speechLocale]}
                                locale={speechLocale}
                                dir={dir}
                                labels={raLabels}
                                reduce={!!reduce}
                                compact
                            />
                        </FloatingReadAloud>
                    </div>
                </motion.section>

                {/* המנטור: לא רק התשובה, כל הדרך אליה. ממוקם בצד החיצוני לפי כיוון הקריאה. */}
                <div className={`pointer-events-none absolute top-1/2 z-20 hidden w-[248px] -translate-y-1/2 xl:block ${isRtl ? 'left-full ml-3 2xl:ml-6' : 'right-full mr-3 2xl:mr-6'}`}>
                    <Mentor pose="explain-opposite" line={c19.mentor.hero} width={248} flip={!isRtl} />
                </div>
            </div>

            {/* ══════════ ניחוש פתיחה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <OpeningGuess content={guessContent} cards={guessCards} speechLocale={speechLocale} />
            </section>

            {/* ══════════ רגע לפני המעבדה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-[2rem] border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-xl md:p-8">
                    <div className="mb-4 flex items-start justify-between gap-2.5">
                        <div>
                            <span className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-300">
                                <Sparkles size={14} /> {c19.primer.eyebrow}
                            </span>
                            <h3 className="text-xl font-black text-white md:text-2xl">{c19.primer.title}</h3>
                            <p className="mt-1 text-sm font-medium text-slate-400">{c19.primer.subtitle}</p>
                        </div>
                        <SpeakButton text={primerText} speechLocale={speechLocale} />
                    </div>

                    <p className="text-[15px] leading-relaxed text-slate-300 md:text-base">{c19.primer.lead}</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {c19.primer.points.map((pt) => (
                            <div key={pt.title} className="rounded-2xl border border-slate-700/50 bg-slate-950/30 p-4">
                                <div className="mb-1.5 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                                    <div className="text-sm font-bold text-slate-100">{pt.title}</div>
                                </div>
                                <p className="text-[15px] leading-relaxed text-slate-300">{pt.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ See: המסלול המלא בקבוצות ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="text-sm font-bold text-slate-100">{c19.see.title}</div>
                        <SpeakButton text={seeText} speechLocale={speechLocale} />
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-slate-400">{c19.see.intro}</p>

                    <ol className="space-y-2.5">
                        {c19.see.groups.map((group, gi) => (
                            <li key={group.title} className="rounded-xl border border-indigo-500/25 bg-slate-950/40 p-3.5">
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-900/50 text-[11px] font-bold text-indigo-200" aria-hidden>{gi + 1}</span>
                                    <span className="text-[13px] font-bold text-indigo-100">{group.title}</span>
                                </div>
                                <ol className="flex flex-wrap items-center gap-1.5">
                                    {group.stations.map((station, si) => (
                                        <React.Fragment key={station}>
                                            <li className="rounded-lg border border-slate-700/50 bg-slate-900/60 px-2 py-1 text-[13px] font-bold leading-tight text-slate-200">
                                                {station}
                                            </li>
                                            {si < group.stations.length - 1 && <FlowArrow size={12} className="shrink-0 text-indigo-400/70" aria-hidden />}
                                        </React.Fragment>
                                    ))}
                                </ol>
                            </li>
                        ))}
                    </ol>

                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{c19.see.caption}</p>
                </div>
            </section>

            {/* ══════════ מעבדת ה-Full Trace ══════════ */}
            <section id="full-trace-lab" className="relative mt-12 space-y-5 text-start scroll-mt-24" dir={dir}>
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-indigo-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-400" dir="ltr">{c19.lab.sectionEyebrow}</div>
                        <h3 className="text-2xl font-bold text-white">{c19.lab.sectionTitle}</h3>
                    </div>
                </div>

                <div className="flex items-start gap-2.5">
                    <p className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                        {c19.lab.sectionIntro}
                    </p>
                    <SpeakButton text={`${c19.lab.sectionTitle}. ${c19.lab.sectionIntro}`} className="mt-1" speechLocale={speechLocale} />
                </div>

                <FullTraceLab
                    data={c19.lab}
                    dir={dir}
                    speechLocale={speechLocale}
                    onNarrationChange={setActiveTraceNarration}
                />

                {/* המנטור: עברו שלב אחר שלב וראו את המסלול */}
                <div className={`absolute top-1/2 -translate-y-1/2 z-20 hidden xl:block pointer-events-none ${isRtl ? 'right-full mr-3 2xl:mr-6' : 'left-full ml-3 2xl:ml-6'}`}>
                    <Mentor pose="inspect" line={c19.mentor.labExplain} width={160} flip={!isRtl} />
                </div>
            </section>

            {/* ══════════ רגע ה-wow ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <InsightBox type="intuition" title={c19.insight.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block text-lg font-bold text-indigo-200">{c19.insight.lead}</span>
                        <SpeakButton text={`${c19.insight.title}. ${c19.insight.lead} ${c19.insight.body}`} speechLocale={speechLocale} />
                    </div>
                    <span className="mt-2 block">{c19.insight.body}</span>
                </InsightBox>
            </section>

            {/* ══════════ תיקון טעות נפוצה ══════════ */}
            <section className="relative mt-12 text-start" dir={dir}>
                <div className={`absolute top-1/2 -translate-y-1/2 z-20 hidden xl:block pointer-events-none ${isRtl ? 'left-full ml-3 2xl:ml-6' : 'right-full mr-3 2xl:mr-6'}`}>
                    <Mentor pose="reassure" line={c19.mentor.misconception} width={160} flip={!isRtl} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-rose-200">
                            <XCircle size={18} />
                            <span className="text-sm font-bold">{c19.misconception.wrongLabel}</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">{c19.misconception.wrongQuote}</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5">
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-emerald-200">
                                <CheckCircle2 size={18} />
                                <span className="text-sm font-bold">{c19.misconception.rightLabel}</span>
                            </div>
                            <SpeakButton text={`${c19.misconception.rightLabel}. ${c19.misconception.rightBody}`} speechLocale={speechLocale} />
                        </div>
                        <p className="leading-relaxed text-slate-300">
                            {c19.misconception.rightBody}
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════ בדיקת הבנה ══════════ */}
            <section className="relative mt-12 text-start" dir={dir}>
                <div className={`absolute top-1/2 -translate-y-1/2 z-20 hidden xl:block pointer-events-none ${isRtl ? 'right-full mr-3 2xl:mr-6' : 'left-full ml-3 2xl:ml-6'}`}>
                    <Mentor pose="happy" line={c19.mentor.lock} width={160} flip={!isRtl} />
                </div>
                <div className="rounded-2xl border border-indigo-500/40 bg-slate-900/60 p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <ListChecks size={20} className="text-indigo-300" />
                        <h3 className="text-xl font-bold text-white">{c19.lock.title}</h3>
                    </div>

                    <div className="rounded-xl border border-slate-700/50 bg-slate-950/30 p-4">
                        <UnderstandingLock />
                    </div>
                </div>
            </section>

            {/* ══════════ תובנה מעשית ══════════ */}
            <section className="relative mt-12 text-start" dir={dir}>
                <div className={`absolute top-1/2 -translate-y-1/2 z-20 hidden xl:block pointer-events-none ${isRtl ? 'left-full ml-3 2xl:ml-6' : 'right-full mr-3 2xl:mr-6'}`}>
                    <Mentor pose="pointdown" line={c19.mentor.practical} width={160} flip={!isRtl} />
                </div>
                <InsightBox type="intuition" title={c19.practical.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block">{c19.practical.lead}</span>
                        <SpeakButton text={`${c19.practical.title}. ${c19.practical.lead} ${c19.practical.uses.join(' ')} ${c19.practical.caveat}`} speechLocale={speechLocale} />
                    </div>
                    <ul className="mt-3 space-y-2">
                        {c19.practical.uses.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                                <span className="text-sm">{line}</span>
                            </li>
                        ))}
                    </ul>
                    <span className="mt-3 block text-sm text-slate-400">{c19.practical.caveat}</span>
                </InsightBox>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir={dir}>
                <ExpandableLab title={localizedQuiz.title}>
                    <AssessmentEngine {...localizedQuiz} conceptDisplayMap={t.behindAi.conceptLabels} />
                </ExpandableLab>
            </section>

            {/* ══════════ קריאה למבחן הסיום (סוף המסלול). פרק 19 הוא הפרק האחרון בתוכנית,
                ולכן ה-CTA למבחן הסיום חוזר כאן. ══════════ */}
            <section className="mt-16 mb-4 text-start" dir={dir}>
                <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-900/15 to-slate-900/40 p-7">
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                        <GraduationCap size={14} /> {c19.finalCta.eyebrow}
                    </span>
                    <div className="mt-2 flex items-start justify-between gap-2.5">
                        <h3 className="text-xl font-black text-white md:text-2xl">{c19.finalCta.title}</h3>
                        <SpeakButton text={`${c19.finalCta.title}. ${c19.finalCta.body}`} speechLocale={speechLocale} />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{c19.finalCta.body}</p>
                    <Link
                        href="/behind-the-scenes-ai/final-exam"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-2.5 text-sm font-bold text-emerald-100 no-underline transition-colors hover:border-emerald-400 hover:bg-emerald-900/30"
                    >
                        <GraduationCap size={16} />
                        {c19.finalCta.button}
                        <FlowArrow size={15} aria-hidden />
                    </Link>
                    <p className="mt-3 text-xs font-medium text-slate-500">{c19.finalCta.note}</p>
                </div>
            </section>
        </ChapterLayout>
    );
}
