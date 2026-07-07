"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Gauge, MousePointerClick, Scale, FlaskConical, Lock, CheckCircle2, XCircle, Sparkles, BadgeCheck, BookMarked, Ban, ArrowLeft, ArrowRight } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine, type ReviewLink } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';

import { OpeningGuess, type OpeningGuessContent, type DiscoveryGuessCard } from '@/components/ai-internals/OpeningGuess';
import { EvaluationLab } from '@/components/ai-internals/EvaluationLab';
import { Mentor } from '@/components/ai-internals/Mentor';
import { ExpandableLab } from '@/components/ai-internals/ExpandableLab';
import { SpeakButton } from '@/components/ai-internals/SpeakButton';
import { FloatingReadAloud } from '@/components/ai-internals/FloatingReadAloud';
import { ReadAloudControls, type ReadAloudMode } from '@/components/ai-internals/ReadAloudControls';
import type { ReadAloudSegment } from '@/components/ai-internals/useReadAloud';
import { LOCALE_SPEECH_LANG } from '@/components/ai-internals/readAloudLang';
import { useT } from '@/i18n/useT';
import type { EvaluationQuizId } from '@/i18n/locales/he/behind-ai/evaluationQuiz';

// טקסט הכרטיסים מגיע מהמילון (t.behindAi.evaluation.guess.cards) לפי מזהה. כאן נשאר
// רק המבנה: אייקון, גוון הסטטוס ופוזת המנטור, שאינם תלויי שפה. הכרטיס עם
// statusTone === 'precise' הוא הבחירה הנכונה (הצלחה על מקרה מגוון מרמזת על הכללה).
const GUESS_CARD_META = [
    { id: 'alwaysRight', icon: BadgeCheck, statusTone: 'common', mentorPose: 'reassure' },
    { id: 'generalizes', icon: Sparkles, statusTone: 'precise', mentorPose: 'correct' },
    { id: 'memorized', icon: BookMarked, statusTone: 'layer', mentorPose: 'headsup' },
    { id: 'noNeed', icon: Ban, statusTone: 'partial', mentorPose: 'think' },
] as const;

/* ════════════════════════ נעילת הבנה: מה חושף כישלון בקצה ════════════════════════ */
// התשובה הנכונה מבנית: "המודל אולי למד את הדוגמה המוכרת אך נכשל תחת לחץ" (אינדקס 1).
const LOCK_CORRECT = 1;

const UnderstandingLock: React.FC = () => {
    const { t, dir } = useT();
    const c15 = t.behindAi.evaluation;
    const lock = c15.lock;
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;

    return (
        <div dir={dir} className="text-start">
            <div className="mb-3 flex items-center gap-2">
                <p className="text-sm font-bold text-slate-200">{lock.question}</p>
                <SpeakButton text={lock.question} speechLocale={c15.contentLocale} />
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

export default function BehindTheScenesChapter15() {
    const reduce = useReducedMotion();
    const { t, dir } = useT();
    const isRtl = dir === 'rtl';
    const c15 = t.behindAi.evaluation;
    const raLabels = t.behindAi.aiInternals.readAloud;

    // שפת ההקראה נגזרת מ-contentLocale של הפרק, כדי שההקראה תדבר בשפת התוכן ולא בשפת
    // הממשק. הכיוון (RTL/LTR) של הפריסה מגיע מ-dir של שפת הממשק.
    const speechLocale = c15.contentLocale;
    const FlowArrow = isRtl ? ArrowLeft : ArrowRight;

    // ניחוש הפתיחה: טקסט מהמילון, מבנה (אייקון/גוון/פוזה) מהמטא־דאטה.
    const guessContent: OpeningGuessContent = {
        eyebrow: c15.guess.eyebrow,
        title: c15.guess.title,
        subtitle: c15.guess.subtitle,
        invite: c15.guess.invite,
        invitePose: 'think',
        correctTitle: c15.guess.correctTitle,
        wrongTitle: c15.guess.wrongTitle,
        getsRightLabel: c15.guess.getsRightLabel,
        revealButton: c15.guess.revealButton,
        revealTitle: c15.guess.revealTitle,
        revealCopy: c15.guess.revealCopy,
        revealPose: 'pointdown',
        cta: c15.guess.cta,
        ctaTargetId: 'evaluation-lab',
        resetButton: c15.guess.resetButton,
        exploreHint: c15.guess.exploreHint,
    };
    const guessCards: DiscoveryGuessCard[] = GUESS_CARD_META.map((m) => ({
        id: m.id,
        icon: m.icon,
        statusTone: m.statusTone,
        mentorPose: m.mentorPose,
        ...c15.guess.cards[m.id],
    }));

    // ── טקסט "רגע לפני המעבדה" להקראה: כותרת, תת-כותרת, פתיח וכל הנקודות. מקור אחד. ──
    const primerText = `${c15.primer.title}. ${c15.primer.subtitle}. ${c15.primer.lead} ${c15.primer.points.map((p) => `${p.title}. ${p.body}`).join(' ')}`;

    // ── דוק האזנה מודרכת: מקטעי הקראה יציבים בלבד (בלי מצב חי של המעבדה, כפתורים,
    // מנטורים או חידון). התוכן נקרא בשפת contentLocale. ──
    const sHero: ReadAloudSegment = { id: 'hero', label: c15.hero.titleHighlight, text: `${c15.hero.titleLead} ${c15.hero.titleHighlight}. ${c15.hero.lede}` };
    const sGuess: ReadAloudSegment = { id: 'guess', label: c15.guess.eyebrow, text: `${c15.guess.title} ${c15.guess.subtitle}` };
    const sPrimer: ReadAloudSegment = { id: 'primer', label: c15.primer.title, text: primerText };
    const sSee: ReadAloudSegment = { id: 'see', label: c15.see.title, text: `${c15.see.title}. ${c15.see.steps.join(', ')}. ${c15.see.caption}` };
    const sLab: ReadAloudSegment = { id: 'lab', label: c15.lab.sectionTitle, text: `${c15.lab.sectionTitle}. ${c15.lab.sectionIntro}` };
    const sWow: ReadAloudSegment = { id: 'wow', label: c15.insight.title, text: `${c15.insight.title}. ${c15.insight.lead} ${c15.insight.body}` };
    const sMisconception: ReadAloudSegment = { id: 'misconception', label: c15.misconception.rightLabel, text: `${c15.misconception.rightLabel}. ${c15.misconception.rightBody}` };
    const sLock: ReadAloudSegment = { id: 'lock', label: c15.lock.title, text: c15.lock.question };
    const sPractical: ReadAloudSegment = { id: 'practical', label: c15.practical.title, text: `${c15.practical.title}. ${c15.practical.lead} ${c15.practical.uses.join(' ')}` };
    const sCaveat: ReadAloudSegment = { id: 'caveat', label: c15.practical.title, text: c15.practical.caveat };

    const readAloudByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
        short: [sHero, sPrimer, sLab, sPractical, sCaveat],
        regular: [sHero, sGuess, sPrimer, sLab, sWow, sLock, sPractical, sCaveat],
        full: [sHero, sGuess, sPrimer, sSee, sLab, sWow, sMisconception, sLock, sPractical, sCaveat],
    };

    // ── מבדק הפרק: המנגנון המשותף נשמר מ-quizData, וטקסט התצוגה ממוזג לפי מזהה.
    // קישורי החזרה הממוקדים מתורגמים דרך chapterQuiz, בדיוק כמו בפרקים הקודמים. ──
    const cq = t.behindAi.chapterQuiz;
    const baseQuiz = behindAiChapterQuizzes[15];
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
        title: c15.quiz.title,
        subtitle: c15.quiz.subtitle,
        startLabel: c15.quiz.startLabel,
        submitLabel: c15.quiz.submitLabel,
        completedTitle: c15.quiz.completedTitle,
        getReviewLinks,
        questions: baseQuiz.questions.map((q) => ({ ...q, ...c15.quiz.byId[q.id as EvaluationQuizId] })),
    };

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={15}>

            {/* ══════════ HERO ══════════ */}
            <div className="relative">
                <motion.section
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 text-start"
                    dir={dir}
                >
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-emerald-500/30 mb-5">
                            <Gauge size={14} className="text-emerald-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-emerald-300" dir="ltr">{c15.hero.badge}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                            {c15.hero.titleLead}{' '}
                            <span className={`${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent`}>
                                {c15.hero.titleHighlight}
                            </span>
                        </h1>

                        <div className="flex items-start gap-2.5 max-w-3xl">
                            <p className="text-lg text-slate-300 leading-relaxed">{c15.hero.lede}</p>
                            <SpeakButton text={`${c15.hero.titleLead} ${c15.hero.titleHighlight}. ${c15.hero.lede}`} className="mt-1" speechLocale={speechLocale} />
                        </div>

                        <p className="mt-4 text-base font-bold text-emerald-200">
                            {c15.hero.hook}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-emerald-400" /> {c15.hero.chipTry}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Scale size={14} className="text-teal-400" /> {c15.hero.chipCompare}
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

                {/* המנטור: דוגמה אחת נכונה היא לא מבחן. ממוקם בצד החיצוני לפי כיוון הקריאה. */}
                <div className={`pointer-events-none absolute top-1/2 z-20 hidden w-[248px] -translate-y-1/2 xl:block ${isRtl ? 'left-full ml-3 2xl:ml-6' : 'right-full mr-3 2xl:mr-6'}`}>
                    <Mentor pose="headsup" line={c15.mentor.hero} width={248} flip={!isRtl} />
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
                            <span className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                                <Sparkles size={14} /> {c15.primer.eyebrow}
                            </span>
                            <h3 className="text-xl font-black text-white md:text-2xl">{c15.primer.title}</h3>
                            <p className="mt-1 text-sm font-medium text-slate-400">{c15.primer.subtitle}</p>
                        </div>
                        <SpeakButton text={primerText} speechLocale={speechLocale} />
                    </div>

                    <p className="text-[15px] leading-relaxed text-slate-300 md:text-base">{c15.primer.lead}</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {c15.primer.points.map((pt) => (
                            <div key={pt.title} className="rounded-2xl border border-slate-700/50 bg-slate-950/30 p-4">
                                <div className="mb-1.5 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                                    <div className="text-sm font-bold text-slate-100">{pt.title}</div>
                                </div>
                                <p className="text-[15px] leading-relaxed text-slate-300">{pt.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ See: ממקרה אחד למבחן אמיתי ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="text-sm font-bold text-slate-100">{c15.see.title}</div>
                        <SpeakButton text={`${c15.see.title}. ${c15.see.steps.join(', ')}. ${c15.see.caption}`} speechLocale={speechLocale} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {c15.see.steps.map((step, i) => (
                            <React.Fragment key={step}>
                                <span className={`rounded-full border px-3 py-1.5 text-sm font-bold ${
                                    i === c15.see.steps.length - 1
                                        ? 'border-emerald-400/50 bg-emerald-900/20 text-emerald-200'
                                        : 'border-slate-700/60 bg-slate-950/40 text-slate-300'
                                }`}>
                                    {step}
                                </span>
                                {i < c15.see.steps.length - 1 && <FlowArrow size={15} className="text-teal-400" aria-hidden />}
                            </React.Fragment>
                        ))}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{c15.see.caption}</p>
                </div>
            </section>

            {/* ══════════ מעבדת הערכה והכללה ══════════ */}
            <section id="evaluation-lab" className="relative mt-12 space-y-5 text-start scroll-mt-24" dir={dir}>
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-emerald-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400" dir="ltr">{c15.lab.sectionEyebrow}</div>
                        <h3 className="text-2xl font-bold text-white">{c15.lab.sectionTitle}</h3>
                    </div>
                </div>

                <div className="flex items-start gap-2.5">
                    <p className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                        {c15.lab.sectionIntro}
                    </p>
                    <SpeakButton text={`${c15.lab.sectionTitle}. ${c15.lab.sectionIntro}`} className="mt-1" speechLocale={speechLocale} />
                </div>

                <EvaluationLab data={c15.lab} dir={dir} speechLocale={speechLocale} />

                {/* המנטור: שנו את המקרה, וראו אם העיקרון מחזיק */}
                <div className={`absolute top-1/2 -translate-y-1/2 z-20 hidden xl:block pointer-events-none ${isRtl ? 'right-full mr-3 2xl:mr-6' : 'left-full ml-3 2xl:ml-6'}`}>
                    <Mentor pose="inspect" line={c15.mentor.labExplain} width={160} flip={!isRtl} />
                </div>
            </section>

            {/* ══════════ רגע ה-wow ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <InsightBox type="intuition" title={c15.insight.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block text-lg font-bold text-emerald-200">{c15.insight.lead}</span>
                        <SpeakButton text={`${c15.insight.title}. ${c15.insight.lead} ${c15.insight.body}`} speechLocale={speechLocale} />
                    </div>
                    <span className="mt-2 block">{c15.insight.body}</span>
                </InsightBox>
            </section>

            {/* ══════════ תיקון טעות נפוצה ══════════ */}
            <section className="relative mt-12 text-start" dir={dir}>
                <div className={`absolute top-1/2 -translate-y-1/2 z-20 hidden xl:block pointer-events-none ${isRtl ? 'left-full ml-3 2xl:ml-6' : 'right-full mr-3 2xl:mr-6'}`}>
                    <Mentor pose="reassure" line={c15.mentor.misconception} width={155} flip={!isRtl} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-rose-200">
                            <XCircle size={18} />
                            <span className="text-sm font-bold">{c15.misconception.wrongLabel}</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">{c15.misconception.wrongQuote}</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5">
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-emerald-200">
                                <CheckCircle2 size={18} />
                                <span className="text-sm font-bold">{c15.misconception.rightLabel}</span>
                            </div>
                            <SpeakButton text={`${c15.misconception.rightLabel}. ${c15.misconception.rightBody}`} speechLocale={speechLocale} />
                        </div>
                        <p className="leading-relaxed text-slate-300">
                            {c15.misconception.rightBody}
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════ נעילת הבנה ══════════ */}
            <section className="relative mt-12 text-start" dir={dir}>
                <div className={`absolute top-1/2 -translate-y-1/2 z-20 hidden xl:block pointer-events-none ${isRtl ? 'right-full mr-3 2xl:mr-6' : 'left-full ml-3 2xl:ml-6'}`}>
                    <Mentor pose="happy" line={c15.mentor.lock} width={160} flip={!isRtl} />
                </div>
                <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/60 p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <Lock size={20} className="text-emerald-300" />
                        <h3 className="text-xl font-bold text-white">{c15.lock.title}</h3>
                    </div>

                    <div className="rounded-xl border border-slate-700/50 bg-slate-950/30 p-4">
                        <UnderstandingLock />
                    </div>
                </div>
            </section>

            {/* ══════════ תובנה מעשית ══════════ */}
            <section className="relative mt-12 text-start" dir={dir}>
                <div className={`absolute top-1/2 -translate-y-1/2 z-20 hidden xl:block pointer-events-none ${isRtl ? 'left-full ml-3 2xl:ml-6' : 'right-full mr-3 2xl:mr-6'}`}>
                    <Mentor pose="pointdown" line={c15.mentor.practical} width={160} flip={!isRtl} />
                </div>
                <InsightBox type="intuition" title={c15.practical.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block">{c15.practical.lead}</span>
                        <SpeakButton text={`${c15.practical.title}. ${c15.practical.lead} ${c15.practical.uses.join(' ')} ${c15.practical.caveat}`} speechLocale={speechLocale} />
                    </div>
                    <ul className="mt-3 space-y-2">
                        {c15.practical.uses.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                                <span className="text-sm">{line}</span>
                            </li>
                        ))}
                    </ul>
                    <span className="mt-3 block text-sm text-slate-400">{c15.practical.caveat}</span>
                </InsightBox>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir={dir}>
                <ExpandableLab title={localizedQuiz.title}>
                    <AssessmentEngine {...localizedQuiz} conceptDisplayMap={t.behindAi.conceptLabels} />
                </ExpandableLab>
            </section>
        </ChapterLayout>
    );
}
