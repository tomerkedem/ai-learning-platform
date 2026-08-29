"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, MousePointerClick, ArrowLeftRight, ListChecks, ArrowLeft, ArrowRight, CheckCircle2, Info, Hash, TrendingUp, HelpCircle, Table2, GraduationCap } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine, type ReviewLink } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';
import { GuessButton } from '@/components/ai-internals/GuessButton';
import { GuessVerdict } from '@/components/ai-internals/GuessVerdict';
import { SpeakButton } from '@/components/ai-internals/SpeakButton';
import { WordToNumberLab } from '@/components/ai-internals/WordToNumberLab';
import { ReadAloudControls, type ReadAloudMode } from '@/components/ai-internals/ReadAloudControls';
import { FloatingReadAloud } from '@/components/ai-internals/FloatingReadAloud';
import type { ReadAloudSegment } from '@/components/ai-internals/useReadAloud';
import { LOCALE_SPEECH_LANG } from '@/components/ai-internals/readAloudLang';
import { EmbeddingLookupLab } from './components/EmbeddingLookupLab';
import { SentenceBridge } from './components/SentenceBridge';
import { ExpandableLab } from '@/components/ai-internals/ExpandableLab';
import { useT } from '@/i18n/useT';
import type { Chapter4QuizId } from '@/i18n/locales/he/behind-ai/chapter4Quiz';

/* ════════════════════ מטא-דאטה מבני (לא ניתן לתרגום) ════════════════════ */
// טקסט הניחוש מגיע מהמילון (t.behindAi.chapter4.guess.options) לפי מזהה; כאן נשאר רק
// המבנה: אייקון והאם זו התשובה הנכונה, שאינם תלויי שפה. התשובה הנכונה היא "address"
// (ה-Token ID הוא כתובת, לא משמעות).
const GUESS_CARD_META = [
    { id: 'address', icon: Hash, correct: true },
    { id: 'meaning', icon: Sparkles, correct: false },
    { id: 'importance', icon: TrendingUp, correct: false },
] as const;

type GuessId = (typeof GUESS_CARD_META)[number]['id'];

/* ════════════════════ בדיקת הבנה: התשובה הנכונה מבנית ════════════════════ */
const LOCK_CORRECT = 0;

const scrollToSee = (smooth: boolean) => {
    const el = typeof document !== 'undefined' ? document.getElementById('embedding-see') : null;
    if (el) el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
};

/* ════════════════════ ניחוש מהיר: חיזוי עם מצב הצלחה/טעות ברור ════════════════════ */

const MeaningGuess: React.FC = () => {
    const { t, dir } = useT();
    const g = t.behindAi.chapter4.guess;
    // שכבת התגובה האנושית של הפרק (M8, מודל C). ספציפית לפרק בכוונה.
    const mr = t.behindAi.chapter4.mentorRespond;
    const reduce = useReducedMotion();
    const [chosenId, setChosenId] = useState<GuessId | null>(null);
    const chosenMeta = GUESS_CARD_META.find((o) => o.id === chosenId) ?? null;
    const answered = chosenMeta !== null;
    const correct = chosenMeta?.correct ?? false;
    const chosenOpt = chosenId ? g.options[chosenId] : null;
    const chosenWhy: string | undefined = chosenOpt && 'why' in chosenOpt ? (chosenOpt.why as string) : undefined;

    return (
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl md:p-8" dir={dir}>
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[80px]" />

            <div className="relative z-10">
                <div className="text-center">
                    <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400">
                        <HelpCircle size={14} /> {g.eyebrow}
                    </span>
                    <div className="mb-2 flex items-center justify-center gap-2.5">
                        <h3 className="text-xl font-black text-white md:text-3xl">{g.title}</h3>
                        {/* הקראה אחת לשאלה יחד עם שורת ההסבר שמתחתיה */}
                        <SpeakButton text={`${g.title} ${g.subtitle}`} />
                    </div>
                    <p className="mx-auto mb-4 max-w-xl text-sm text-slate-400 md:text-base">{g.subtitle}</p>
                    <p className="mx-auto mb-6 max-w-xl rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 text-sm font-bold text-slate-200" dir="ltr">{g.prompt}</p>
                </div>

                {/* מצב לפני בחירה: הזמנה לנחש + כרטיסים.
                    M8 F3 SELECTIVE RESPOND: דמות ההזמנה הוסרה, ומשפט ההזמנה עצמו נשאר מילה
                    במילה כטקסט גוף. כמו בפרקי הפיילוט, הוא גם מפסיק להיות מוסתר מתחת ל-sm:
                    "מה לדעתכם המספר הזה מייצג" הוא תוכן לימודי ולא קישוט, ואין סיבה שלומד
                    בטלפון לא יקבל אותו. הטיפוגרפיה זהה לענף חסר-הדמות של GuessInvite. */}
                {!answered && (
                    <>
                        <p className="mx-auto mb-5 max-w-md text-center text-[13px] font-medium leading-snug text-slate-400">{g.invite}</p>

                        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
                            {GUESS_CARD_META.map((meta) => {
                                const Icon = meta.icon;
                                const opt = g.options[meta.id];
                                return (
                                    <div key={meta.id} className="relative">
                                        <motion.button
                                            type="button"
                                            onClick={() => setChosenId(meta.id)}
                                            aria-label={`${opt.title}. ${opt.desc}`}
                                            whileHover={reduce ? undefined : { scale: 1.015 }}
                                            whileTap={reduce ? undefined : { scale: 0.985 }}
                                            className="flex h-full w-full flex-col gap-2.5 rounded-2xl border border-slate-700/60 bg-slate-900/50 p-4 text-start transition-colors hover:border-violet-500/50 hover:bg-violet-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
                                        >
                                            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950/50">
                                                <Icon size={18} className="text-violet-300" />
                                            </span>
                                            <div>
                                                <div className="text-base font-black text-white">{opt.title}</div>
                                                <p className="mt-1 text-sm leading-relaxed text-slate-300">{opt.desc}</p>
                                            </div>
                                        </motion.button>
                                        {/* הקראת הכרטיס: אח של כפתור-הכרטיס (button בתוך button אסור) */}
                                        <SpeakButton text={`${opt.title}. ${opt.desc}`} className="absolute end-2 top-2 z-10" />
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* מצב אחרי בחירה: התגובה המשותפת (הצלחה מפורשת או טעות תומכת).
                    M8 F3 SELECTIVE RESPOND: זה רגע הדמות היחיד בפרק. אותה פוזה, אותו גודל
                    ואותו מיקום בשתי התוצאות, כך שנוכחות הדמות אינה מסגירה אם צדקתם. הסטטוס
                    (הוי או הנורה, הכותרת, ההסבר) נשאר הערוץ היחיד שאומר את התוצאה. */}
                {answered && (
                    <GuessVerdict
                        key={chosenId ?? undefined}
                        correct={correct}
                        reduce={!!reduce}
                        correctTitle={g.successTitle}
                        correctExplain={g.successExplain}
                        correctInsight={g.successInsight}
                        continueCta={{ label: g.continueCta, onClick: () => scrollToSee(!reduce) }}
                        wrongTitle={g.wrongTitle}
                        wrongExplain={chosenWhy ?? ''}
                        onRetry={() => setChosenId(null)}
                        retryLabel={correct ? g.retryLink : g.retryButton}
                        mentorMode="respond"
                        mentorResponse={{ correct: mr.guessCorrect, wrong: mr.guessWrong }}
                    />
                )}
            </div>
        </div>
    );
};

/* ════════════════════ בדיקת הבנה: מאיפה הגיעו מספרי הווקטור ════════════════════ */

const LockQuestion: React.FC = () => {
    const { t, dir } = useT();
    const lock = t.behindAi.chapter4.lock;
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;
    const correct = choice === LOCK_CORRECT;

    return (
        <div dir={dir} className="text-start">
            <div className="mb-3 flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-slate-200">{lock.question}</p>
                <SpeakButton text={lock.question} />
            </div>

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
                            className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-start text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${cls}`}
                        >
                            <span>{opt}</span>
                            {/* התשובה הנכונה מקבלת סימן ✓ גם כשלא נבחרה, כדי ש"מה נכון" לא יימסר בצבע בלבד */}
                            {answered && isCorrect && <CheckCircle2 size={16} className="shrink-0 text-emerald-300" />}
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

export default function BehindTheScenesChapter4() {
    const { t, dir, locale } = useT();
    const reduce = useReducedMotion();
    const isRtl = dir === 'rtl';
    const c4 = t.behindAi.chapter4;

    // ── דוק האזנה מודרכת: מקטעי הקראה יציבים סביב שדרת הפרק (טקסט -> טוקנים -> Token IDs
    // -> שורה בטבלה -> וקטור -> נלמד/נשלף). לא נכללים: חידון, כפתורים, צ׳יפים, מנטורים,
    // ומצב חי של המעבדה (בחירה, ערכי וקטור, מתגים). הקראה רק מטקסט יציב.
    const ra = t.behindAi.aiInternals.readAloud;
    const el = c4.embeddingLookup;
    const sTitle: ReadAloudSegment = { id: 'title', label: c4.hero.titleLead, text: `${c4.hero.titleLead} ${c4.hero.titleHighlight}. ${c4.hero.lede}` };
    const sGuessInsight: ReadAloudSegment = { id: 'guess-insight', label: c4.guess.successInsight, text: c4.guess.successInsight };
    const sLookup: ReadAloudSegment = { id: 'lookup', label: el.title, text: `${el.title}. ${el.intro}` };
    const sLookupLearned: ReadAloudSegment = { id: 'lookup-learned', label: el.vectorTitle, text: `${el.vectorNote} ${el.learnedNote}` };
    const sLookupView: ReadAloudSegment = { id: 'lookup-view', label: el.viewNumbers, text: el.viewNote };
    const sTable: ReadAloudSegment = { id: 'embedding-table', label: c4.embeddingTable.title, text: `${c4.embeddingTable.title} ${c4.embeddingTable.lines.join(' ')} ${c4.embeddingTable.note}` };
    // הגשר מטוקנים למשפט: נקרא לפי סדר התצוגה (כותרת, מבוא, שלושת השלבים, ואז ההבהרה).
    const sSequence: ReadAloudSegment = {
        id: 'sequence',
        label: c4.sequence.title,
        text: [
            c4.sequence.title,
            c4.sequence.intro,
            ...c4.sequence.steps.map((st, i) => `${i + 1}. ${st.title}. ${st.body}`),
            c4.sequence.clarify,
        ].join(' '),
    };
    const sTraining: ReadAloudSegment = { id: 'training', label: c4.trainingInference.title, text: `${c4.trainingInference.title}. ${c4.trainingInference.body}` };
    // סיכום מעבדה 2: סגירה קצרה בלבד, בלי ההשוואה שהוסרה
    const sLabConclusion: ReadAloudSegment = { id: 'lab-conclusion', label: c4.labConclusion.title, text: `${c4.labConclusion.title} ${c4.labConclusion.body}` };
    const sPracticalFull: ReadAloudSegment = { id: 'practical', label: c4.practical.title, text: `${c4.practical.title}. ${c4.practical.lead} ${c4.practical.uses.join('. ')}` };
    const sCaveat: ReadAloudSegment = { id: 'caveat', label: c4.practical.title, text: c4.practical.caveat };
    const sBridge: ReadAloudSegment = { id: 'bridge', label: c4.bridge, text: c4.bridge };

    const readAloudByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
        short: [sTitle, sTable, sSequence, sLabConclusion, sTraining, sBridge],
        regular: [sTitle, sGuessInsight, sLookup, sLookupLearned, sTable, sSequence, sLabConclusion, sTraining, sPracticalFull, sBridge],
        full: [sTitle, sGuessInsight, sLookup, sLookupLearned, sLookupView, sTable, sSequence, sLabConclusion, sTraining, sPracticalFull, sCaveat, sBridge],
    };

    // מבדק הפרק: המנגנון המשותף (onComplete, getReviewLinks, nextHref...) נשמר מ-quizData,
    // וטקסט התצוגה ממוזג מהמילון לפי מזהה השאלה. quizData.ts עצמו לא משתנה.
    const cq = t.behindAi.chapterQuiz;
    const baseQuiz = behindAiChapterQuizzes[4];

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
        title: c4.quiz.title,
        subtitle: c4.quiz.subtitle,
        startLabel: c4.quiz.startLabel,
        submitLabel: c4.quiz.submitLabel,
        completedTitle: c4.quiz.completedTitle,
        getReviewLinks,
        questions: baseQuiz.questions.map((q) => ({ ...q, ...c4.quiz.byId[q.id as Chapter4QuizId] })),
    };

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={4}>

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
                            <Sparkles size={14} className="text-violet-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">{c4.hero.badge}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                            {c4.hero.titleLead}{' '}
                            <span className={`${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent`}>
                                {c4.hero.titleHighlight}
                            </span>
                        </h1>

                        <div className="flex items-start gap-2.5">
                            <p className="text-lg text-slate-300 leading-relaxed">{c4.hero.lede}</p>
                            <SpeakButton text={`${c4.hero.titleLead} ${c4.hero.titleHighlight}. ${c4.hero.lede}`} className="mt-1" />
                        </div>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-violet-400" /> {c4.hero.chipObject}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <ArrowLeftRight size={14} className="text-cyan-400" /> {c4.hero.chipMeaning}
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
                {/* M8: מנטור ההירו הוסר. הבועה ("המנוע רואה מספרים, לא מילים") נתנה את
                    מסקנת הניחוש לפני שהלומד ניחש, ובנוסף הופיעה רק מ-xl ומעלה, כך שלומד
                    בטלפון ממילא לא ראה אותה. הכותרת והלד של ההירו נשארים כפי שהם. */}
            </div>

            {/* ══════════ ניחוש מהיר ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <MeaningGuess />
            </section>

            {/* ══════════ הכרטיס המסביר היחיד: איך Token ID הופך ל-Embedding (אחרי הניחוש, לפני מעבדה 1) ══════════ */}
            {/* מיזוג שני כרטיסי הפתיחה לכרטיס אחד: מנגנון ה-lookup במקום אחד, בלי חזרה. */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-[2rem] border border-cyan-500/25 bg-slate-900/50 p-6 backdrop-blur-xl md:p-8">
                    <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-2.5">
                            <Table2 size={20} className="shrink-0 text-cyan-300" />
                            <h3 className="text-xl font-black text-white md:text-2xl">{c4.embeddingTable.title}</h3>
                        </div>
                        <SpeakButton text={`${c4.embeddingTable.title} ${c4.embeddingTable.lines.join(' ')} ${c4.embeddingTable.note}`} className="mt-0.5" />
                    </div>
                    <ul className="mt-4 space-y-3">
                        {c4.embeddingTable.lines.map((line) => (
                            <li key={line} className="flex items-start gap-3">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                                <span className="text-[15px] leading-relaxed text-slate-200">{line}</span>
                            </li>
                        ))}
                    </ul>
                    {/* רצף קומפקטי: Token ID -> שורה בטבלה -> וקטור. מחזק את המנגנון לפני מעבדה 1. */}
                    <div className="mt-4 flex flex-wrap items-center gap-2.5 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-3.5" dir={dir}>
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-900/15 px-2.5 py-1.5 text-sm font-bold text-cyan-200" dir="ltr">
                            <Hash size={14} /> Token ID
                        </span>
                        {isRtl ? <ArrowLeft size={16} className="shrink-0 text-slate-500" /> : <ArrowRight size={16} className="shrink-0 text-slate-500" />}
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600/40 bg-slate-800/40 px-2.5 py-1.5 text-sm font-bold text-slate-200">
                            <Table2 size={14} className="text-cyan-300" /> {c4.embeddingLookup.tableTitle}
                        </span>
                        {isRtl ? <ArrowLeft size={16} className="shrink-0 text-slate-500" /> : <ArrowRight size={16} className="shrink-0 text-slate-500" />}
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-900/15 px-2.5 py-1.5 text-sm font-bold text-violet-200">
                            <Sparkles size={14} /> {c4.embeddingLookup.vectorTitle}
                        </span>
                    </div>
                    {/* הפישוט הלימודי: לא הערת שוליים, אלא חלק מההסבר */}
                    <p className="mt-4 flex items-start gap-2.5 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[15px] leading-relaxed text-slate-300">
                        <Info size={17} className="mt-0.5 shrink-0 text-cyan-300" />
                        {c4.embeddingTable.note}
                    </p>
                </div>
            </section>

            {/* ══════════ See + Touch: המעבדה המרכזית, ממילה למספרים ══════════ */}
            {/* ההנחיה של המעבדה יושבת בתוך EmbeddingLookupLab (c.intro), ליד בורר המילים,
                ולכן היא נשארת גלויה גם בתצוגה רגילה וגם במסך מלא. */}
            <section id="embedding-see" className="mt-12 text-start scroll-mt-[var(--bts-sticky-top,88px)]" dir={dir}>
                <ExpandableLab title={c4.embeddingLookup.title}>
                    <EmbeddingLookupLab dir={dir} labNumber={1} />
                </ExpandableLab>
            </section>

            {/* ══════════ Reveal: המסלול המלא של משפט (טוקניזציה -> Token IDs -> וקטור) ══════════ */}
            <section id="word-lab" className="mt-12 space-y-5 text-start scroll-mt-[var(--bts-sticky-top,88px)]" dir={dir}>
                {/* מקטע מעבר (לא מעבדה, בלי מספר): מטוקנים למשפט. מכין למעבדה 2. */}
                <SentenceBridge />

                {/* מעבדה 2: המספר 2 והכותרת יושבים בתוך הרכיב, בתחילת האינטראקציה האמיתית.
                    כל השלבים והסיכום נמצאים בתוך גבול אחד של המעבדה. */}
                <ExpandableLab title={`${c4.lab2.eyebrow}: ${c4.lab2.title}`}>
                    <WordToNumberLab />
                </ExpandableLab>

                {/* ── סוף מעבדה 2. מכאן חוזרים לנרטיב הפרק. ── */}

                {/* תוכן פרק: נלמד פעם אחת באימון, נשלף בכל שיחה. לא שלב במעבדה. */}
                <div className="mt-10 flex items-start gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-900/10 p-5">
                    <GraduationCap size={18} className="mt-0.5 shrink-0 text-emerald-300" />
                    <div className="flex-1">
                        <div className="mb-1 text-sm font-bold text-emerald-100">{c4.trainingInference.title}</div>
                        <p className="text-[15px] leading-relaxed text-slate-200">{c4.trainingInference.body}</p>
                    </div>
                    <SpeakButton text={`${c4.trainingInference.title}. ${c4.trainingInference.body}`} className="mt-0.5" />
                </div>
            </section>

            {/* ══════════ בדיקת הבנה ══════════ */}
            {/* בלי מנטור: כל רמז מושגי כאן מסגיר את התשובה. בדיקת ההבנה נשארת בדיקה עצמאית. */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-violet-500/40 bg-slate-900/60 p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <ListChecks size={20} className="text-violet-300" />
                        <h3 className="text-xl font-bold text-white">{c4.lock.title}</h3>
                    </div>
                    <LockQuestion />
                </div>
            </section>

            {/* ══════════ תובנה מעשית + גשר לפרק 5 ══════════ */}
            {/* M8: המנטור "טקסט הפך למספר, עכשיו אפשר לחשב" הוסר. זו בדיוק התובנה שהכרטיס
                שמתחתיו כבר אומר, ובאופן מפורט יותר. */}
            <section className="mt-12 text-start" dir={dir}>
                <InsightBox type="intuition" title={c4.practical.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block">{c4.practical.lead}</span>
                        <SpeakButton text={`${c4.practical.title}. ${c4.practical.lead} ${c4.practical.uses.join('. ')} ${c4.practical.caveat}`} />
                    </div>
                    <ul className="mt-3 space-y-2">
                        {c4.practical.uses.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                <span className="text-sm">{line}</span>
                            </li>
                        ))}
                    </ul>
                    <span className="mt-3 block text-sm text-slate-400">{c4.practical.caveat}</span>
                    <span className="mt-4 block text-xs font-bold text-cyan-300">{c4.practical.mathOptionalLabel}</span>
                    <GuessButton
                        href="/math/mathIntuitive/chapter-5"
                        variant="ghost"
                        rgb="34,211,238"
                        className="mt-2"
                        trailingIcon={isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                    >
                        {c4.practical.mathLink}
                    </GuessButton>
                    <span className="mt-4 flex items-start gap-2 border-s-2 border-violet-400/50 ps-3 text-sm font-bold text-violet-100">
                        {isRtl ? <ArrowLeft size={15} className="mt-0.5 shrink-0" /> : <ArrowRight size={15} className="mt-0.5 shrink-0" />}
                        {c4.bridge}
                    </span>
                </InsightBox>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir={dir}>
                <ExpandableLab title={localizedQuiz.title}>
                    {/* M8 F3 SELECTIVE RESPOND: המבדק חסר-דמות לחלוטין. אייקון הסטטוס נשאר בראש
                        כרטיס התוצאה בשתי התוצאות, ומשפט התגובה הספציפי לפרק מופיע מתחתיו
                        כטקסט בלבד. */}
                    <AssessmentEngine
                        {...localizedQuiz}
                        conceptDisplayMap={c4.quiz.conceptLabels}
                        mentorScope="respond"
                        mentorResponse={{ pass: c4.mentorRespond.quizPass, fail: c4.mentorRespond.quizFail }}
                    />
                </ExpandableLab>
            </section>
        </ChapterLayout>
    );
}
