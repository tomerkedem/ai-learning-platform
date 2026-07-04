"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Frame, MousePointerClick, MessageSquare, Lightbulb, ScanSearch, Lock, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine, type ReviewLink } from '@/components/content/AssessmentEngine';
import { ExpandableLab } from '@/components/ai-internals/ExpandableLab';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';

import { AttentionGuess, type AttentionGuessCard, type AttentionGuessContent, type Cue, type StatusTone } from '@/components/ai-internals/AttentionGuess';
import { ContextWindowLab } from '@/components/ai-internals/ContextWindowLab';
import { Mentor, type MentorPose } from '@/components/ai-internals/Mentor';
import { SpeakButton } from '@/components/ai-internals/SpeakButton';
import { FloatingReadAloud } from '@/components/ai-internals/FloatingReadAloud';
import { ReadAloudControls, type ReadAloudMode } from '@/components/ai-internals/ReadAloudControls';
import type { ReadAloudSegment } from '@/components/ai-internals/useReadAloud';
import { LOCALE_SPEECH_LANG } from '@/components/ai-internals/readAloudLang';
import { useT } from '@/i18n/useT';
import type { ContextWindowQuizId } from '@/i18n/locales/he/behind-ai/contextWindowQuiz';

/* ════════════════════ מטא-דאטה מבני של כרטיסי הניחוש (לא ניתן לתרגום) ════════════════════ */
// הטקסט מגיע מהמילון (guess.cards[id]); כאן רק המבנה: אייקון (cue), גוון הסטטוס
// ופוזת המנטור, שאינם תלויי שפה. הכרטיס הנכון הוא "in-window".
type GuessCardId = 'remembers-all' | 'in-window' | 'first-message' | 'saved-memory';
const GUESS_CARD_META: { id: GuessCardId; cue: Cue; tone: StatusTone; pose: MentorPose }[] = [
    { id: 'remembers-all', cue: 'highlighter', tone: 'common', pose: 'reassure' },
    { id: 'in-window', cue: 'nodes', tone: 'close', pose: 'correct' },
    { id: 'first-message', cue: 'spotlight', tone: 'partial', pose: 'think' },
    { id: 'saved-memory', cue: 'factcheck', tone: 'layer', pose: 'headsup' },
];

/* ════════════════════════ נעילת הבנה: איזה פרומפט עומד בפני עצמו ════════════════════════ */
// התשובה הנכונה מבנית: הפרומפט העצמאי הוא האפשרות השלישית (אינדקס 2).
const LOCK_CORRECT = 2;

const SelfContainedQuestion: React.FC = () => {
    const { t, dir } = useT();
    const c7 = t.behindAi.contextWindow;
    const lock = c7.lock;
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;
    const correct = choice === LOCK_CORRECT;

    return (
        <div dir={dir} className="text-start">
            <div className="mb-3 flex items-center gap-2">
                <p className="text-sm font-bold text-slate-200">{lock.question}</p>
                <SpeakButton text={lock.question} speechLocale={c7.contentLocale} />
            </div>
            <p className="mb-4 rounded-lg border border-slate-700/50 bg-slate-950/40 p-3 text-sm text-slate-300">{c7.criticalFact}</p>

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
                            <span>{opt}</span>
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
                    className={`mt-4 rounded-xl border p-3 text-sm leading-relaxed text-slate-200 ${
                        correct ? 'border-emerald-500/30 bg-emerald-950/15' : 'border-rose-500/30 bg-rose-950/15'
                    }`}
                >
                    {lock.explanationLead} <span className="font-bold text-emerald-200">{lock.explanationPair}</span>
                    {lock.explanationRest}
                </motion.p>
            )}
        </div>
    );
};

export default function BehindTheScenesChapter7() {
    const { t, dir } = useT();
    const reduce = useReducedMotion();
    const isRtl = dir === 'rtl';
    const c7 = t.behindAi.contextWindow;
    const raLabels = t.behindAi.aiInternals.readAloud;

    // שפת ההקראה נגזרת מ-contentLocale של הפרק: כל עוד השפה היא fallback לעברית,
    // ההקראה מדברת עברית ולא מנסה להקריא עברית בקול של שפת הממשק. הכיוון (RTL/LTR)
    // של הפריסה מגיע מ-dir של שפת הממשק, כדי לאמת את מבנה ה-LTR/RTL.
    const speechLocale = c7.contentLocale;

    // ── ניחוש הפתיחה: תוכן + כרטיסים ממוזגים מהמילון עם המטא-דאטה המבני ──
    const guessContent: AttentionGuessContent = {
        eyebrow: c7.guess.eyebrow,
        title: c7.guess.title,
        subtitle: c7.guess.subtitle,
        invite: c7.guess.invite,
        getsRightLabel: c7.guess.getsRightLabel,
        revealButton: c7.guess.revealButton,
        resetButton: c7.guess.resetButton,
        revealTitle: c7.guess.revealTitle,
        revealCopy: c7.guess.revealCopy,
        cta: c7.guess.cta,
    };
    const guessCards: AttentionGuessCard[] = GUESS_CARD_META.map((meta) => {
        const card = c7.guess.cards[meta.id];
        return {
            id: meta.id,
            cue: meta.cue,
            statusTone: meta.tone,
            mentorPose: meta.pose,
            title: card.title,
            desc: card.desc,
            statusLabel: card.statusLabel,
            getsRight: card.getsRight,
            missesLabel: card.missesLabel,
            misses: card.misses,
            bridge: card.bridge,
        };
    });

    // ── טקסט "רגע לפני המעבדה" להקראה: כותרת + פתיח + כל הנקודות. מקור אחד לכפתור ולדוק. ──
    const primerText = `${c7.primer.title}. ${c7.primer.lead} ${c7.primer.points.map((p) => `${p.title}. ${p.body}`).join(' ')}`;

    // ── דוק האזנה מודרכת: מקטעי הקראה יציבים בלבד. לא נכללים: ניחוש, מצב חי של
    // המעבדה, כפתורים, מנטורים וחידון. התוכן נקרא בשפת contentLocale. ──
    const sHero: ReadAloudSegment = { id: 'hero', label: c7.hero.titleHighlight, text: `${c7.hero.titleLead} ${c7.hero.titleHighlight}. ${c7.hero.lede}` };
    const sPrimer: ReadAloudSegment = { id: 'primer', label: c7.primer.title, text: primerText };
    const sLab: ReadAloudSegment = { id: 'lab', label: c7.lab.sectionTitle, text: `${c7.lab.sectionTitle}. ${c7.lab.sectionIntro}` };
    const sWow: ReadAloudSegment = { id: 'wow', label: c7.wow.title, text: `${c7.wow.title}. ${c7.wow.lead} ${c7.wow.body}` };
    const sEveryday: ReadAloudSegment = { id: 'everyday', label: c7.everyday.title, text: `${c7.everyday.title}. ${c7.everyday.body}` };
    const sMistake: ReadAloudSegment = { id: 'mistake', label: c7.mistake.rightTitle, text: `${c7.mistake.rightTitle}. ${c7.mistake.right}` };
    const sHow: ReadAloudSegment = { id: 'how', label: c7.how.title, text: `${c7.how.title}. ${c7.how.body}` };
    const sLock: ReadAloudSegment = { id: 'lock', label: c7.lock.title, text: c7.lock.question };
    const sPractical: ReadAloudSegment = { id: 'practical', label: c7.practical.title, text: `${c7.practical.title}. ${c7.practical.lead} ${c7.practical.uses.join(' ')}` };
    const sCaveat: ReadAloudSegment = { id: 'caveat', label: c7.practical.title, text: c7.practical.caveat };

    const readAloudByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
        short: [sHero, sPrimer, sPractical, sCaveat],
        regular: [sHero, sPrimer, sLab, sWow, sMistake, sPractical, sCaveat],
        full: [sHero, sPrimer, sLab, sWow, sEveryday, sMistake, sHow, sLock, sPractical, sCaveat],
    };

    // ── מבדק הפרק: המנגנון המשותף נשמר מ-quizData, וטקסט התצוגה ממוזג לפי מזהה. ──
    const cq = t.behindAi.chapterQuiz;
    const baseQuiz = behindAiChapterQuizzes[7];
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
        title: c7.quiz.title,
        subtitle: c7.quiz.subtitle,
        startLabel: c7.quiz.startLabel,
        submitLabel: c7.quiz.submitLabel,
        completedTitle: c7.quiz.completedTitle,
        getReviewLinks,
        questions: baseQuiz.questions.map((q) => ({ ...q, ...c7.quiz.byId[q.id as ContextWindowQuizId] })),
    };

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={7}>

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
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-sky-500/10 blur-[90px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-violet-500/30 mb-5">
                            <Frame size={14} className="text-violet-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300" dir="ltr">{c7.hero.badge}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                            {c7.hero.titleLead}{' '}
                            <span className={`${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-violet-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent`}>
                                {c7.hero.titleHighlight}
                            </span>
                        </h1>

                        <div className="flex items-start gap-2.5 max-w-3xl">
                            <p className="text-lg text-slate-300 leading-relaxed">{c7.hero.lede}</p>
                            <SpeakButton text={`${c7.hero.titleLead} ${c7.hero.titleHighlight}. ${c7.hero.lede}`} className="mt-1" speechLocale={speechLocale} />
                        </div>

                        <div className="mt-6 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4">
                            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <ScanSearch size={13} className="text-violet-400" /> {c7.hero.promptEyebrow}
                            </div>
                            <p className="text-base font-bold text-slate-100">{c7.prompt}</p>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-violet-400" /> {c7.hero.chipEdit}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Frame size={14} className="text-emerald-400" /> {c7.hero.chipSee}
                            </span>
                        </div>

                        {/* דוק ההאזנה המודרכת: אותו רכיב של המבוא ושאר הפרקים. הכיוון לפי שפת הממשק,
                            שפת הדיבור לפי contentLocale (עברית כל עוד השאר fallback). */}
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

                {/* מנטור הירו: רכיב מבוסס-פוזה (בלי נכס ייעודי). ממוקם בצד החיצוני לפי כיוון
                    הקריאה, בלי שיקוף תמונה. מוצג רק מ-xl ומעלה. */}
                <div className={`pointer-events-none absolute top-1/2 z-20 hidden w-[150px] -translate-y-1/2 xl:block ${isRtl ? 'left-full ml-3 2xl:ml-6' : 'right-full mr-3 2xl:mr-6'}`}>
                    <Mentor pose="explain" width={150} flip={!isRtl} />
                </div>
            </div>

            {/* ══════════ ניחוש לפני הסבר: ארבע השערות על חלון ההקשר ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <AttentionGuess content={guessContent} cards={guessCards} prompt={c7.guess.title} dir={dir} speechLocale={speechLocale} labTargetId="context-window-lab" />
            </section>

            {/* ══════════ רגע לפני המעבדה: הסבר חלון ההקשר ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-[2rem] border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-xl md:p-8">
                    <div className="mb-4 flex items-start justify-between gap-2.5">
                        <div>
                            <span className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-300">
                                <Sparkles size={14} /> {c7.primer.eyebrow}
                            </span>
                            <h3 className="text-xl font-black text-white md:text-2xl">{c7.primer.title}</h3>
                        </div>
                        <SpeakButton text={primerText} speechLocale={speechLocale} />
                    </div>

                    <p className="text-[15px] leading-relaxed text-slate-300 md:text-base">{c7.primer.lead}</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {c7.primer.points.map((pt) => (
                            <div key={pt.title} className="rounded-2xl border border-slate-700/50 bg-slate-950/30 p-4">
                                <div className="mb-1.5 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                    <div className="text-sm font-bold text-slate-100">{pt.title}</div>
                                </div>
                                <p className="text-[15px] leading-relaxed text-slate-300">{pt.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ מעבדת חלון ההקשר ══════════ */}
            <section id="context-window-lab" className="relative mt-12 space-y-5 text-start scroll-mt-24" dir={dir}>
                <div className="flex items-center gap-3">
                    <Frame size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400" dir="ltr">{c7.lab.sectionEyebrow}</div>
                        <h3 className="text-2xl font-bold text-white">{c7.lab.sectionTitle}</h3>
                    </div>
                </div>

                <div className="flex items-start gap-2.5">
                    <p className="text-base leading-relaxed text-slate-300">{c7.lab.sectionIntro}</p>
                    <SpeakButton text={`${c7.lab.sectionTitle}. ${c7.lab.sectionIntro}`} className="mt-1" speechLocale={speechLocale} />
                </div>

                <ContextWindowLab data={c7.lab} dir={dir} speechLocale={speechLocale} />

                <div className={`absolute top-1/2 -translate-y-1/2 z-20 hidden xl:block pointer-events-none ${isRtl ? 'right-full mr-3 2xl:mr-6' : 'left-full ml-3 2xl:ml-6'}`}>
                    <Mentor pose="explain" line={c7.mentor.lab} width={160} flip={!isRtl} />
                </div>
            </section>

            {/* ══════════ רגע ה-wow ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <InsightBox type="intuition" title={c7.wow.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block text-lg font-bold text-violet-200">{c7.wow.lead}</span>
                        <SpeakButton text={`${c7.wow.title}. ${c7.wow.lead} ${c7.wow.body}`} speechLocale={speechLocale} />
                    </div>
                    <span className="mt-2 block">{c7.wow.body}</span>
                </InsightBox>
            </section>

            {/* ══════════ דוגמה יומיומית ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Lightbulb size={18} className="text-amber-300" />
                            <div className="text-sm font-bold text-slate-100">{c7.everyday.title}</div>
                        </div>
                        <SpeakButton text={`${c7.everyday.title}. ${c7.everyday.body}`} speechLocale={speechLocale} />
                    </div>
                    <p>{c7.everyday.body}</p>
                </div>
            </section>

            {/* ══════════ תיקון טעות נפוצה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-rose-200">
                            <XCircle size={18} />
                            <span className="text-sm font-bold">{c7.mistake.wrongTitle}</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">{c7.mistake.wrong}</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5">
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-emerald-200">
                                <CheckCircle2 size={18} />
                                <span className="text-sm font-bold">{c7.mistake.rightTitle}</span>
                            </div>
                            <SpeakButton text={`${c7.mistake.rightTitle}. ${c7.mistake.right}`} speechLocale={speechLocale} />
                        </div>
                        <p className="leading-relaxed text-slate-300">{c7.mistake.right}</p>
                    </div>
                </div>
            </section>

            {/* ══════════ איך החלון עובד ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-violet-500/30 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <MessageSquare size={18} className="text-violet-300" />
                            <div className="leading-tight">
                                <div className="text-sm font-bold text-slate-100">{c7.how.title}</div>
                                <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">{c7.how.sub}</div>
                            </div>
                        </div>
                        <SpeakButton text={`${c7.how.title}. ${c7.how.body}`} speechLocale={speechLocale} />
                    </div>
                    <p>{c7.how.body}</p>
                </div>
            </section>

            {/* ══════════ נעילת הבנה ══════════ */}
            <section className="relative mt-12 text-start" dir={dir}>
                <div className={`absolute top-1/2 -translate-y-1/2 z-20 hidden xl:block pointer-events-none ${isRtl ? 'left-full ml-3 2xl:ml-6' : 'right-full mr-3 2xl:mr-6'}`}>
                    <Mentor pose="celebrate" line={c7.mentor.lock} width={160} flip={!isRtl} />
                </div>
                <div className="rounded-2xl border border-violet-500/40 bg-slate-900/60 p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <Lock size={20} className="text-violet-300" />
                        <h3 className="text-xl font-bold text-white">{c7.lock.title}</h3>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">{c7.lock.trueLabel}</div>
                            <p className="text-sm leading-relaxed text-slate-200">{c7.lock.trueText}</p>
                        </div>
                        <div className="rounded-xl border border-rose-500/30 bg-rose-950/10 p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-rose-300">{c7.lock.falseLabel}</div>
                            <p className="text-sm leading-relaxed text-slate-200">{c7.lock.falseText}</p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-700/50 bg-slate-950/30 p-4">
                        <SelfContainedQuestion />
                    </div>
                </div>
            </section>

            {/* ══════════ תובנה מעשית ══════════ */}
            <section className="relative mt-12 text-start" dir={dir}>
                <div className={`absolute top-1/2 -translate-y-1/2 z-20 hidden xl:block pointer-events-none ${isRtl ? 'right-full mr-3 2xl:mr-6' : 'left-full ml-3 2xl:ml-6'}`}>
                    <Mentor pose="pointdown" line={c7.mentor.practical} width={160} flip={!isRtl} />
                </div>
                <InsightBox type="intuition" title={c7.practical.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block">{c7.practical.lead}</span>
                        <SpeakButton text={`${c7.practical.title}. ${c7.practical.lead} ${c7.practical.uses.join(' ')} ${c7.practical.caveat}`} speechLocale={speechLocale} />
                    </div>
                    <ul className="mt-3 space-y-2">
                        {c7.practical.uses.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                <span className="text-sm">{line}</span>
                            </li>
                        ))}
                    </ul>
                    <span className="mt-3 block text-sm text-slate-400">{c7.practical.caveat}</span>
                </InsightBox>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-12 mb-4" dir={dir}>
                <ExpandableLab title={localizedQuiz.title}>
                    <AssessmentEngine {...localizedQuiz} conceptDisplayMap={t.behindAi.conceptLabels} />
                </ExpandableLab>
            </section>
        </ChapterLayout>
    );
}
