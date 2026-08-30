"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Dices, MousePointerClick, Scale, Percent, Lightbulb, MessageSquare, ListChecks, CheckCircle2, XCircle, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine, type ReviewLink } from '@/components/content/AssessmentEngine';
import { ExpandableLab } from '@/components/ai-internals/ExpandableLab';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';

import { AttentionGuess, type AttentionGuessCard, type AttentionGuessContent, type Cue, type StatusTone } from '@/components/ai-internals/AttentionGuess';
import { LogitsSoftmaxLab } from '@/components/ai-internals/LogitsSoftmaxLab';
import type { MentorPose } from '@/components/ai-internals/Mentor';
import { SpeakButton } from '@/components/ai-internals/SpeakButton';
import { FloatingReadAloud } from '@/components/ai-internals/FloatingReadAloud';
import { ReadAloudControls, type ReadAloudMode } from '@/components/ai-internals/ReadAloudControls';
import type { ReadAloudSegment } from '@/components/ai-internals/useReadAloud';
import { LOCALE_SPEECH_LANG } from '@/components/ai-internals/readAloudLang';
import { useT } from '@/i18n/useT';
import type { LogitsSoftmaxQuizId } from '@/i18n/locales/he/behind-ai/logitsSoftmaxQuiz';

/* ════════════════════ מטא-דאטה מבני של כרטיסי הניחוש (לא ניתן לתרגום) ════════════════════ */
// הטקסט מגיע מהמילון (guess.cards[id]); כאן רק המבנה: אייקון (cue), גוון הסטטוס ופוזת
// המנטור, שאינם תלויי שפה. הכרטיסים הם ארבעת ההמשכים; "delayed" הוא המוביל בברירת המחדל.
type GuessCardId = 'delayed' | 'delivered' | 'pickup' | 'lost';
const GUESS_CARD_META: { id: GuessCardId; cue: Cue; tone: StatusTone; pose: MentorPose }[] = [
    { id: 'delayed', cue: 'nodes', tone: 'close', pose: 'correct' },
    { id: 'delivered', cue: 'spotlight', tone: 'partial', pose: 'think' },
    { id: 'pickup', cue: 'highlighter', tone: 'layer', pose: 'headsup' },
    { id: 'lost', cue: 'factcheck', tone: 'common', pose: 'reassure' },
];

/* ════════════════════════ בדיקת הבנה: מה מותר להסיק מהסתברות גבוהה ════════════════════════ */
// התשובה הנכונה מבנית: "בהינתן ההקשר הנוכחי, זה ההמשך הסביר ביותר" הוא האפשרות השלישית (אינדקס 2).
const LOCK_CORRECT = 2;

const UnderstandingLock: React.FC = () => {
    const { t, dir } = useT();
    const c8 = t.behindAi.logitsSoftmax;
    const lock = c8.lock;
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;
    const correct = choice === LOCK_CORRECT;

    return (
        <div dir={dir} className="text-start">
            <div className="mb-4 flex items-center gap-2">
                <p className="text-sm font-bold text-slate-200">{lock.question}</p>
                <SpeakButton text={lock.question} speechLocale={c8.contentLocale} />
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

export default function BehindTheScenesChapter8() {
    const { t, dir } = useT();
    const reduce = useReducedMotion();
    const isRtl = dir === 'rtl';
    const c8 = t.behindAi.logitsSoftmax;
    const raLabels = t.behindAi.aiInternals.readAloud;

    // שפת ההקראה נגזרת מ-contentLocale של הפרק: כל עוד השפה היא fallback לעברית,
    // ההקראה מדברת עברית ולא מנסה להקריא עברית בקול של שפת הממשק. הכיוון (RTL/LTR)
    // של הפריסה מגיע מ-dir של שפת הממשק.
    const speechLocale = c8.contentLocale;

    // ── ניחוש הפתיחה: תוכן + כרטיסים ממוזגים מהמילון עם המטא-דאטה המבני ──
    const guessContent: AttentionGuessContent = {
        eyebrow: c8.guess.eyebrow,
        title: c8.guess.title,
        subtitle: c8.guess.subtitle,
        invite: c8.guess.invite,
        getsRightLabel: c8.guess.getsRightLabel,
        revealButton: c8.guess.revealButton,
        resetButton: c8.guess.resetButton,
        revealTitle: c8.guess.revealTitle,
        revealCopy: c8.guess.revealCopy,
        cta: c8.guess.cta,
    };
    const guessCards: AttentionGuessCard[] = GUESS_CARD_META.map((meta) => {
        const card = c8.guess.cards[meta.id];
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
    const primerText = `${c8.primer.title}. ${c8.primer.lead} ${c8.primer.points.map((p) => `${p.title}. ${p.body}`).join(' ')}`;

    // ── דוק האזנה מודרכת: מקטעי הקראה יציבים בלבד. לא נכללים: מצב חי של המעבדה,
    // כפתורים, מנטורים וחידון. התוכן נקרא בשפת contentLocale. ──
    const sHero: ReadAloudSegment = { id: 'hero', label: c8.hero.titleHighlight, text: `${c8.hero.titleLead} ${c8.hero.titleHighlight}. ${c8.hero.lede}` };
    const sGuess: ReadAloudSegment = { id: 'guess', label: c8.guess.eyebrow, text: `${c8.guess.title} ${c8.guess.subtitle}` };
    const sPrimer: ReadAloudSegment = { id: 'primer', label: c8.primer.title, text: primerText };
    const sSee: ReadAloudSegment = { id: 'see', label: c8.see.title, text: `${c8.see.title}. ${c8.see.steps.join(', ')}. ${c8.see.caption}` };
    const sLab: ReadAloudSegment = { id: 'lab', label: c8.lab.sectionTitle, text: `${c8.lab.sectionTitle}. ${c8.lab.sectionIntro}` };
    const sWow: ReadAloudSegment = { id: 'wow', label: c8.wow.title, text: `${c8.wow.title}. ${c8.wow.lead} ${c8.wow.body}` };
    const sEveryday: ReadAloudSegment = { id: 'everyday', label: c8.everyday.title, text: `${c8.everyday.title}. ${c8.everyday.body}` };
    const sMistake: ReadAloudSegment = { id: 'mistake', label: c8.mistake.rightTitle, text: `${c8.mistake.rightTitle}. ${c8.mistake.right}` };
    const sHow: ReadAloudSegment = { id: 'how', label: c8.how.title, text: `${c8.how.title}. ${c8.how.body}` };
    const sLock: ReadAloudSegment = { id: 'lock', label: c8.lock.title, text: c8.lock.question };
    const sPractical: ReadAloudSegment = { id: 'practical', label: c8.practical.title, text: `${c8.practical.title}. ${c8.practical.lead} ${c8.practical.uses.join(' ')}` };
    const sCaveat: ReadAloudSegment = { id: 'caveat', label: c8.practical.title, text: c8.practical.caveat };
    const sBridge: ReadAloudSegment = { id: 'bridge', label: t.behindAi.chapterQuiz.nextQuestionLabel, text: t.behindAi.chapterQuiz.transitions[8] };

    const readAloudByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
        short: [sHero, sPrimer, sLab, sPractical, sCaveat],
        regular: [sHero, sGuess, sPrimer, sLab, sWow, sLock, sPractical, sCaveat, sBridge],
        full: [sHero, sGuess, sPrimer, sSee, sLab, sWow, sEveryday, sMistake, sHow, sLock, sPractical, sCaveat, sBridge],
    };

    // ── מבדק הפרק: המנגנון המשותף נשמר מ-quizData, וטקסט התצוגה ממוזג לפי מזהה. ──
    const cq = t.behindAi.chapterQuiz;
    const baseQuiz = behindAiChapterQuizzes[8];
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
        title: c8.quiz.title,
        subtitle: c8.quiz.subtitle,
        startLabel: c8.quiz.startLabel,
        submitLabel: c8.quiz.submitLabel,
        completedTitle: c8.quiz.completedTitle,
        getReviewLinks,
        questions: baseQuiz.questions.map((q) => ({ ...q, ...c8.quiz.byId[q.id as LogitsSoftmaxQuizId] })),
    };

    const FlowArrow = isRtl ? ArrowLeft : ArrowRight;

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={8}>

            {/* ══════════ HERO ══════════ */}
            <div className="relative">
                <motion.section
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 text-start"
                    dir={dir}
                >
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-purple-500/30 mb-5">
                            <Dices size={14} className="text-purple-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-purple-300" dir="ltr">{c8.hero.badge}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                            {c8.hero.titleLead}{' '}
                            <span className={`${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-purple-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent`}>
                                {c8.hero.titleHighlight}
                            </span>
                        </h1>

                        <div className="flex items-start gap-2.5 max-w-3xl">
                            <p className="text-lg text-slate-300 leading-relaxed">{c8.hero.lede}</p>
                            <SpeakButton text={`${c8.hero.titleLead} ${c8.hero.titleHighlight}. ${c8.hero.lede}`} className="mt-1" speechLocale={speechLocale} />
                        </div>

                        <div className="mt-6 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4">
                            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <Percent size={13} className="text-purple-400" /> {c8.hero.promptEyebrow}
                            </div>
                            <p className="text-base font-bold text-slate-100">{c8.prompt}</p>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-purple-400" /> {c8.hero.chipEdit}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Scale size={14} className="text-emerald-400" /> {c8.hero.chipSee}
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

                {/* M9: מנטור ההירו הוסר. הבועה ("ציונים הופכים לאחוזים כאן") היא בדיוק המסקנה של
                    הניחוש שמופיע מיד אחריו, והיא הופיעה רק מ-xl ומעלה, כך שלומד בטלפון ממילא לא
                    ראה אותה. הכותרת והלד של ההירו נשארים כפי שהם. */}
            </div>

            {/* ══════════ ניחוש לפני הסבר: איזה המשך מוביל ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                {/* M9 F3 SELECTIVE RESPOND: מנטור ההזמנה, מנטור ההשערה ומנטור כרטיס התובנה הוסרו,
                    ומשפט ההזמנה נשאר כטקסט גוף וגלוי גם בטלפון. אחרי הבחירה כל ארבע ההשערות מקבלות
                    בדיוק אותה שורת תגובה אנושית, וצ׳יפ הסטטוס נשאר הערוץ היחיד שאומר עד כמה ההשערה
                    קרובה. זה רגע הדמות היחיד בפרק. */}
                <AttentionGuess
                    content={guessContent}
                    cards={guessCards}
                    prompt={c8.prompt}
                    dir={dir}
                    speechLocale={speechLocale}
                    labTargetId="logits-softmax-lab"
                    mentorMode="respond"
                    mentorResponse={{ correct: c8.mentorRespond.guessCorrect, wrong: c8.mentorRespond.guessWrong }}
                />
            </section>

            {/* ══════════ רגע לפני המעבדה: Logits ו-Softmax ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-[2rem] border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-xl md:p-8">
                    <div className="mb-4 flex items-start justify-between gap-2.5">
                        <div>
                            <span className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-purple-300">
                                <Sparkles size={14} /> {c8.primer.eyebrow}
                            </span>
                            <h3 className="text-xl font-black text-white md:text-2xl">{c8.primer.title}</h3>
                        </div>
                        <SpeakButton text={primerText} speechLocale={speechLocale} />
                    </div>

                    <p className="text-[15px] leading-relaxed text-slate-300 md:text-base">{c8.primer.lead}</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {c8.primer.points.map((pt) => (
                            <div key={pt.title} className="rounded-2xl border border-slate-700/50 bg-slate-950/30 p-4">
                                <div className="mb-1.5 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                                    <div className="text-sm font-bold text-slate-100">{pt.title}</div>
                                </div>
                                <p className="text-[15px] leading-relaxed text-slate-300">{pt.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ See: מהמשפט לאחוזים ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="text-sm font-bold text-slate-100">{c8.see.title}</div>
                        <SpeakButton text={`${c8.see.title}. ${c8.see.steps.join(', ')}. ${c8.see.caption}`} speechLocale={speechLocale} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {c8.see.steps.map((step, i) => (
                            <React.Fragment key={step}>
                                <span className={`rounded-full border px-3 py-1.5 text-sm font-bold ${
                                    i === c8.see.steps.length - 1
                                        ? 'border-emerald-400/50 bg-emerald-900/20 text-emerald-200'
                                        : 'border-slate-700/60 bg-slate-950/40 text-slate-300'
                                }`}>
                                    {step}
                                </span>
                                {i < c8.see.steps.length - 1 && <FlowArrow size={15} className="text-purple-400" aria-hidden />}
                            </React.Fragment>
                        ))}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{c8.see.caption}</p>
                </div>
            </section>

            {/* ══════════ מעבדת Logits ו-Softmax ══════════ */}
            <section id="logits-softmax-lab" className="mt-12 space-y-5 text-start scroll-mt-24" dir={dir}>
                <div className="flex items-center gap-3">
                    <Percent size={24} className="text-purple-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-purple-400" dir="ltr">{c8.lab.sectionEyebrow}</div>
                        <h3 className="text-2xl font-bold text-white">{c8.lab.sectionTitle}</h3>
                    </div>
                </div>

                <div className="flex items-start gap-2.5">
                    <p className="text-base leading-relaxed text-slate-300">{c8.lab.sectionIntro}</p>
                    <SpeakButton text={`${c8.lab.sectionTitle}. ${c8.lab.sectionIntro}`} className="mt-1" speechLocale={speechLocale} />
                </div>

                <LogitsSoftmaxLab data={c8.lab} dir={dir} speechLocale={speechLocale} />

                {/* M9: המנטור "שנו נתון, והאחוזים זזים" הוסר. sectionIntro שמעל המעבדה כבר אומר
                    את זה, ובאופן קונקרטי יותר. */}
            </section>

            {/* ══════════ רגע ה-wow ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <InsightBox type="intuition" title={c8.wow.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block text-lg font-bold text-purple-200">{c8.wow.lead}</span>
                        <SpeakButton text={`${c8.wow.title}. ${c8.wow.lead} ${c8.wow.body}`} speechLocale={speechLocale} />
                    </div>
                    <span className="mt-2 block">{c8.wow.body}</span>
                </InsightBox>
            </section>

            {/* ══════════ דוגמה יומיומית ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Lightbulb size={18} className="text-amber-300" />
                            <div className="text-sm font-bold text-slate-100">{c8.everyday.title}</div>
                        </div>
                        <SpeakButton text={`${c8.everyday.title}. ${c8.everyday.body}`} speechLocale={speechLocale} />
                    </div>
                    <p>{c8.everyday.body}</p>
                </div>
            </section>

            {/* ══════════ תיקון טעות נפוצה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-rose-200">
                            <XCircle size={18} />
                            <span className="text-sm font-bold">{c8.mistake.wrongTitle}</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">{c8.mistake.wrong}</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5">
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-emerald-200">
                                <CheckCircle2 size={18} />
                                <span className="text-sm font-bold">{c8.mistake.rightTitle}</span>
                            </div>
                            <SpeakButton text={`${c8.mistake.rightTitle}. ${c8.mistake.right}`} speechLocale={speechLocale} />
                        </div>
                        <p className="leading-relaxed text-slate-300">{c8.mistake.right}</p>
                    </div>
                </div>
            </section>

            {/* ══════════ איך Softmax עובד ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-purple-500/30 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <MessageSquare size={18} className="text-purple-300" />
                            <div className="leading-tight">
                                <div className="text-sm font-bold text-slate-100">{c8.how.title}</div>
                                <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">{c8.how.sub}</div>
                            </div>
                        </div>
                        <SpeakButton text={`${c8.how.title}. ${c8.how.body}`} speechLocale={speechLocale} />
                    </div>
                    <p>{c8.how.body}</p>
                </div>
            </section>

            {/* ══════════ בדיקת הבנה ══════════ */}
            {/* M9: המנטור שלפני השאלה הוסר. הוא היה בפוזת celebrate ואמר "תפסתם את הרעיון",
                כלומר חגג הבנה לפני שהלומד ענה. תוכן הבדיקה נשאר זהה. */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-purple-500/40 bg-slate-900/60 p-6">
                    <div className="mb-5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <ListChecks size={20} className="text-purple-300" />
                            <h3 className="text-xl font-bold text-white">{c8.lock.title}</h3>
                        </div>
                        <SpeakButton text={`${c8.lock.title}. ${c8.lock.trueLabel}: ${c8.lock.trueText} ${c8.lock.falseLabel}: ${c8.lock.falseText}`} speechLocale={speechLocale} />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">{c8.lock.trueLabel}</div>
                            <p className="text-sm leading-relaxed text-slate-200">{c8.lock.trueText}</p>
                        </div>
                        <div className="rounded-xl border border-rose-500/30 bg-rose-950/10 p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-rose-300">{c8.lock.falseLabel}</div>
                            <p className="text-sm leading-relaxed text-slate-200">{c8.lock.falseText}</p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-700/50 bg-slate-950/30 p-4">
                        <UnderstandingLock />
                    </div>
                </div>
            </section>

            {/* ══════════ תובנה מעשית ══════════ */}
            {/* M9: המנטור "ככה מכוונים את ההתפלגות" הוסר. זו כותרת התובנה המעשית עצמה,
                והרשימה שמתחתיה כבר מפרטת בדיוק איך. */}
            <section className="mt-12 text-start" dir={dir}>
                <InsightBox type="intuition" title={c8.practical.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block">{c8.practical.lead}</span>
                        <SpeakButton text={`${c8.practical.title}. ${c8.practical.lead} ${c8.practical.uses.join(' ')} ${c8.practical.caveat}`} speechLocale={speechLocale} />
                    </div>
                    <ul className="mt-3 space-y-2">
                        {c8.practical.uses.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                                <span className="text-sm">{line}</span>
                            </li>
                        ))}
                    </ul>
                    <span className="mt-3 block text-sm text-slate-400">{c8.practical.caveat}</span>
                </InsightBox>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-10 rounded-2xl border border-indigo-500/30 bg-indigo-950/15 p-5 text-start" dir={dir}><div className="text-xs font-bold text-indigo-300">{cq.nextQuestionLabel}</div><p className="mt-2 text-base leading-relaxed text-slate-200">{cq.transitions[8]}</p></section>
            <section className="mt-12 mb-4" dir={dir}>
                <ExpandableLab title={localizedQuiz.title}>
                    {/* M9 F3 SELECTIVE RESPOND: המבדק חסר-דמות לחלוטין. אייקון הסטטוס נשאר בראש
                        כרטיס התוצאה בשתי התוצאות, ומשפט התגובה הספציפי לפרק מופיע מתחתיו
                        כטקסט בלבד. */}
                    <AssessmentEngine
                        {...localizedQuiz}
                        conceptDisplayMap={t.behindAi.conceptLabels}
                        mentorScope="respond"
                        mentorResponse={{ pass: c8.mentorRespond.quizPass, fail: c8.mentorRespond.quizFail }}
                    />
                </ExpandableLab>
            </section>
        </ChapterLayout>
    );
}
