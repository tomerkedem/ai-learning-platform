"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ClipboardCheck, MousePointerClick, ListChecks, FlaskConical, Lightbulb, CheckCircle2, XCircle, Sparkles, Send, FilePlus2, Scissors, ArrowLeft, ArrowRight } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine, type ReviewLink } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';

import { OpeningGuess, type OpeningGuessContent, type DiscoveryGuessCard } from '@/components/ai-internals/OpeningGuess';
import { SelfCheckLab } from '@/components/ai-internals/SelfCheckLab';
import { ExpandableLab } from '@/components/ai-internals/ExpandableLab';
import { SpeakButton } from '@/components/ai-internals/SpeakButton';
import { FloatingReadAloud } from '@/components/ai-internals/FloatingReadAloud';
import { ReadAloudControls, type ReadAloudMode } from '@/components/ai-internals/ReadAloudControls';
import type { ReadAloudSegment } from '@/components/ai-internals/useReadAloud';
import { LOCALE_SPEECH_LANG } from '@/components/ai-internals/readAloudLang';
import { useT } from '@/i18n/useT';
import type { SelfCheckQuizId } from '@/i18n/locales/he/behind-ai/selfCheckQuiz';

// טקסט הכרטיסים מגיע מהמילון (t.behindAi.selfCheck.guess.cards) לפי מזהה. כאן נשאר רק
// המבנה: אייקון וגוון הסטטוס, שאינם תלויי שפה. הכרטיס עם
// statusTone === 'precise' הוא הבחירה הנכונה (לבדוק אילו חלקים נתמכים במקור).
const GUESS_CARD_META = [
    { id: 'check', icon: ClipboardCheck, statusTone: 'precise' },
    { id: 'send', icon: Send, statusTone: 'common' },
    { id: 'add', icon: FilePlus2, statusTone: 'layer' },
    { id: 'replace', icon: Scissors, statusTone: 'partial' },
] as const;

/* ════════════════════════ בדיקת הבנה: איזו טענה לסמן ════════════════════════ */
// התשובה הנכונה מבנית: "תגיע מחר" (אינדקס 1), כי המקור לא נותן מועד הגעה.
const LOCK_CORRECT = 1;

const UnderstandingLock: React.FC = () => {
    const { t, dir } = useT();
    const c13 = t.behindAi.selfCheck;
    const lock = c13.lock;
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;

    return (
        <div dir={dir} className="text-start">
            <div className="mb-3 flex items-center gap-2">
                <p className="text-sm font-bold text-[var(--bts-text-body)]">{lock.question}</p>
                <SpeakButton text={lock.question} speechLocale={c13.contentLocale} />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
                {lock.options.map((opt, i) => {
                    const isCorrect = i === LOCK_CORRECT;
                    const isChosen = i === choice;
                    let cls = 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]';
                    if (answered && isCorrect) cls = 'border-emerald-400/70 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-emerald-900)] [--t-l:var(--color-emerald-500)] text-emerald-100';
                    else if (answered && isChosen && !isCorrect) cls = 'border-rose-400/70 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-rose-900)] [--t-l:var(--color-rose-500)] text-rose-100';
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
                    className="mt-4 rounded-xl border border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] p-3 text-sm leading-relaxed text-[var(--bts-text-body)]"
                >
                    {lock.success}
                </motion.p>
            )}
        </div>
    );
};

export default function BehindTheScenesChapter13() {
    const reduce = useReducedMotion();
    const { t, dir } = useT();
    const isRtl = dir === 'rtl';
    const c13 = t.behindAi.selfCheck;
    const raLabels = t.behindAi.aiInternals.readAloud;

    // שפת ההקראה נגזרת מ-contentLocale של הפרק, כדי שההקראה תדבר בשפת התוכן ולא בשפת
    // הממשק. הכיוון (RTL/LTR) של הפריסה מגיע מ-dir של שפת הממשק.
    const speechLocale = c13.contentLocale;
    const FlowArrow = isRtl ? ArrowLeft : ArrowRight;

    // ניחוש הפתיחה: טקסט מהמילון, מבנה (אייקון/גוון) מהמטא־דאטה.
    const guessContent: OpeningGuessContent = {
        eyebrow: c13.guess.eyebrow,
        title: c13.guess.title,
        subtitle: c13.guess.subtitle,
        invite: c13.guess.invite,
        correctTitle: c13.guess.correctTitle,
        wrongTitle: c13.guess.wrongTitle,
        getsRightLabel: c13.guess.getsRightLabel,
        revealButton: c13.guess.revealButton,
        revealTitle: c13.guess.revealTitle,
        revealCopy: c13.guess.revealCopy,
        cta: c13.guess.cta,
        ctaTargetId: 'self-check-lab',
        resetButton: c13.guess.resetButton,
        exploreHint: c13.guess.exploreHint,
    };
    const guessCards: DiscoveryGuessCard[] = GUESS_CARD_META.map((m) => ({
        id: m.id,
        icon: m.icon,
        statusTone: m.statusTone,
        ...c13.guess.cards[m.id],
    }));

    // ── טקסט "רגע לפני המעבדה" להקראה: כותרת, תת-כותרת, פתיח וכל הנקודות. מקור אחד. ──
    const primerText = `${c13.primer.title}. ${c13.primer.subtitle}. ${c13.primer.lead} ${c13.primer.points.map((p) => `${p.title}. ${p.body}`).join(' ')}`;

    // ── דוק האזנה מודרכת: מקטעי הקראה יציבים בלבד (בלי מצב חי של המעבדה, כפתורים,
    // מנטורים או חידון). התוכן נקרא בשפת contentLocale. ──
    const sHero: ReadAloudSegment = { id: 'hero', label: c13.hero.titleHighlight, text: `${c13.hero.titleLead} ${c13.hero.titleHighlight}. ${c13.hero.lede}` };
    const sGuess: ReadAloudSegment = { id: 'guess', label: c13.guess.eyebrow, text: `${c13.guess.title} ${c13.guess.subtitle}` };
    const sPrimer: ReadAloudSegment = { id: 'primer', label: c13.primer.title, text: primerText };
    const sSee: ReadAloudSegment = { id: 'see', label: c13.see.title, text: `${c13.see.title}. ${c13.see.steps.join(', ')}. ${c13.see.caption}` };
    const sLab: ReadAloudSegment = { id: 'lab', label: c13.lab.sectionTitle, text: `${c13.lab.sectionTitle}. ${c13.lab.sectionIntro}` };
    const sWow: ReadAloudSegment = { id: 'wow', label: c13.insight.title, text: `${c13.insight.title}. ${c13.insight.lead} ${c13.insight.body}` };
    const sEveryday: ReadAloudSegment = { id: 'everyday', label: c13.analogy.title, text: `${c13.analogy.title}. ${c13.analogy.body}` };
    const sMisconception: ReadAloudSegment = { id: 'misconception', label: c13.misconception.rightLabel, text: `${c13.misconception.rightLabel}. ${c13.misconception.rightBody}` };
    const sLock: ReadAloudSegment = { id: 'lock', label: c13.lock.title, text: c13.lock.question };
    const sPractical: ReadAloudSegment = { id: 'practical', label: c13.practical.title, text: `${c13.practical.title}. ${c13.practical.lead} ${c13.practical.uses.join(' ')}` };
    const sCaveat: ReadAloudSegment = { id: 'caveat', label: c13.practical.title, text: c13.practical.caveat };
    const sBridge: ReadAloudSegment = { id: 'bridge', label: t.behindAi.chapterQuiz.nextQuestionLabel, text: t.behindAi.chapterQuiz.transitions[13] };

    const readAloudByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
        short: [sHero, sPrimer, sLab, sPractical, sCaveat],
        regular: [sHero, sGuess, sPrimer, sLab, sWow, sLock, sPractical, sCaveat, sBridge],
        full: [sHero, sGuess, sPrimer, sSee, sLab, sWow, sEveryday, sMisconception, sLock, sPractical, sCaveat, sBridge],
    };

    // ── מבדק הפרק: המנגנון המשותף נשמר מ-quizData, וטקסט התצוגה ממוזג לפי מזהה.
    // קישורי החזרה הממוקדים מתורגמים דרך chapterQuiz, בדיוק כמו בפרקים הקודמים. ──
    const cq = t.behindAi.chapterQuiz;
    const baseQuiz = behindAiChapterQuizzes[13];
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
        title: c13.quiz.title,
        subtitle: c13.quiz.subtitle,
        startLabel: c13.quiz.startLabel,
        submitLabel: c13.quiz.submitLabel,
        completedTitle: c13.quiz.completedTitle,
        getReviewLinks,
        questions: baseQuiz.questions.map((q) => ({ ...q, ...c13.quiz.byId[q.id as SelfCheckQuizId] })),
    };

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={13} themeAware>

            {/* ══════════ HERO ══════════ */}
            <div className="relative">
                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-[var(--bts-border)] bg-[var(--bts-surface)] backdrop-blur-xl p-8 md:p-10 text-start"
                    dir={dir}
                >
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-sky-500/10 blur-[90px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-surface-elevated)_var(--bts-tint-mix),var(--color-slate-800))_70%,transparent)] border border-indigo-500/30 mb-5">
                            <ClipboardCheck size={14} className="text-indigo-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-indigo-300" dir="ltr">{c13.hero.badge}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-[var(--bts-text-primary)] leading-[1.1] mb-4">
                            {c13.hero.titleLead}{' '}
                            <span className={`${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[color-mix(in_oklab,var(--color-indigo-400)_calc(100%_-_var(--bts-tint-mix)_*_0.4),black)] via-[color-mix(in_oklab,var(--color-violet-400)_calc(100%_-_var(--bts-tint-mix)_*_0.4),black)] to-[color-mix(in_oklab,var(--color-sky-400)_calc(100%_-_var(--bts-tint-mix)_*_0.4),black)] bg-clip-text text-transparent`}>
                                {c13.hero.titleHighlight}
                            </span>
                        </h1>

                        <div className="flex items-start gap-2.5 max-w-3xl">
                            <p className="text-lg text-[var(--bts-text-secondary)] leading-relaxed">{c13.hero.lede}</p>
                            <SpeakButton text={`${c13.hero.titleLead} ${c13.hero.titleHighlight}. ${c13.hero.lede}`} className="mt-1" speechLocale={speechLocale} />
                        </div>

                        <p className="mt-4 text-base font-bold text-indigo-200">
                            {c13.hero.hook}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-[var(--bts-text-muted)]">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-indigo-400" /> {c13.hero.chipTry}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <ListChecks size={14} className="text-sky-400" /> {c13.hero.chipCompare}
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

                {/* M9: מנטור ההירו הוסר. הבועה ("בדקו את הטיוטה לפני שהיא יוצאת") היא בדיוק
                    המסקנה של הניחוש שמופיע מיד אחריו, והיא הופיעה רק מ-xl ומעלה, כך שלומד בטלפון
                    ממילא לא ראה אותה. הכותרת והלד של ההירו נשארים כפי שהם. */}
            </div>

            {/* ══════════ ניחוש פתיחה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                {/* M9 F3 SELECTIVE RESPOND: מנטור ההזמנה ומנטור כרטיס ההכרעה הוסרו, ומשפט ההזמנה
                    נשאר כטקסט גוף וגלוי גם בטלפון. אחרי הבחירה שתי התוצאות מקבלות בדיוק אותה שורת
                    תגובה אנושית: אותה פוזה, אותו גודל, אותו מיקום. זה רגע הדמות היחיד בפרק. */}
                <OpeningGuess
                    content={guessContent}
                    cards={guessCards}
                    speechLocale={speechLocale}
                    mentorResponse={{ correct: c13.mentorRespond.guessCorrect, wrong: c13.mentorRespond.guessWrong }}
                />
            </section>

            {/* ══════════ רגע לפני המעבדה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-[2rem] border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-6 backdrop-blur-xl md:p-8">
                    <div className="mb-4 flex items-start justify-between gap-2.5">
                        <div>
                            <span className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-300">
                                <Sparkles size={14} /> {c13.primer.eyebrow}
                            </span>
                            <h3 className="text-xl font-black text-[var(--bts-text-primary)] md:text-2xl">{c13.primer.title}</h3>
                            <p className="mt-1 text-sm font-medium text-[var(--bts-text-muted)]">{c13.primer.subtitle}</p>
                        </div>
                        <SpeakButton text={primerText} speechLocale={speechLocale} />
                    </div>

                    <p className="text-[15px] leading-relaxed text-[var(--bts-text-secondary)] md:text-base">{c13.primer.lead}</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {c13.primer.points.map((pt) => (
                            <div key={pt.title} className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-4">
                                <div className="mb-1.5 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                                    <div className="text-sm font-bold text-[var(--bts-text-bright)]">{pt.title}</div>
                                </div>
                                <p className="text-[15px] leading-relaxed text-[var(--bts-text-secondary)]">{pt.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ See: איך בדיקה עצמית עובדת ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="text-sm font-bold text-[var(--bts-text-bright)]">{c13.see.title}</div>
                        <SpeakButton text={`${c13.see.title}. ${c13.see.steps.join(', ')}. ${c13.see.caption}`} speechLocale={speechLocale} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {c13.see.steps.map((step, i) => (
                            <React.Fragment key={step}>
                                <span className={`rounded-full border px-3 py-1.5 text-sm font-bold ${
                                    i === c13.see.steps.length - 1
                                        ? 'border-indigo-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-indigo-900)] [--t-l:var(--color-indigo-500)] text-indigo-200'
                                        : 'border-[var(--bts-border-mid)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] text-[var(--bts-text-secondary)]'
                                }`}>
                                    {step}
                                </span>
                                {i < c13.see.steps.length - 1 && <FlowArrow size={15} className="text-sky-400" aria-hidden />}
                            </React.Fragment>
                        ))}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--bts-text-muted)]">{c13.see.caption}</p>
                </div>
            </section>

            {/* ══════════ מעבדת הבדיקה העצמית ══════════ */}
            <section id="self-check-lab" className="mt-12 space-y-5 text-start scroll-mt-24" dir={dir}>
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-indigo-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-400" dir="ltr">{c13.lab.sectionEyebrow}</div>
                        <h3 className="text-2xl font-bold text-[var(--bts-text-primary)]">{c13.lab.sectionTitle}</h3>
                    </div>
                </div>

                <div className="flex items-start gap-2.5">
                    <p className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-5 leading-relaxed text-[var(--bts-text-secondary)]">
                        {c13.lab.sectionIntro}
                    </p>
                    <SpeakButton text={`${c13.lab.sectionTitle}. ${c13.lab.sectionIntro}`} className="mt-1" speechLocale={speechLocale} />
                </div>

                <SelfCheckLab data={c13.lab} dir={dir} speechLocale={speechLocale} />

                {/* M9: המנטור "איזו טענה כאן באמת נתמכת" הוסר. מבוא המעבדה שמעליו כבר אומר
                    את זה, ובאופן קונקרטי יותר. */}
            </section>

            {/* ══════════ רגע ה-wow ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <InsightBox type="intuition" title={c13.insight.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block text-lg font-bold text-indigo-200">{c13.insight.lead}</span>
                        <SpeakButton text={`${c13.insight.title}. ${c13.insight.lead} ${c13.insight.body}`} speechLocale={speechLocale} />
                    </div>
                    <span className="mt-2 block">{c13.insight.body}</span>
                </InsightBox>
            </section>

            {/* ══════════ דוגמה יומיומית ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-5 leading-relaxed text-[var(--bts-text-secondary)]">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Lightbulb size={18} className="text-indigo-300" />
                            <div className="text-sm font-bold text-[var(--bts-text-bright)]">{c13.analogy.title}</div>
                        </div>
                        <SpeakButton text={`${c13.analogy.title}. ${c13.analogy.body}`} speechLocale={speechLocale} />
                    </div>
                    <p>{c13.analogy.body}</p>
                </div>
            </section>

            {/* ══════════ תיקון טעות נפוצה ══════════ */}
            {/* M9: המנטור "בדיקה עוזרת, לא מבטיחה אמת" הוסר. שני הכרטיסים שמתחתיו
                אומרים בדיוק את אותה הבחנה, ובניסוח מלא יותר. */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-rose-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(10%_-_var(--bts-tint-mix)_*_0.05),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)] p-5">
                        <div className="mb-2 flex items-center gap-2 text-rose-200">
                            <XCircle size={18} />
                            <span className="text-sm font-bold">{c13.misconception.wrongLabel}</span>
                        </div>
                        <p className="leading-relaxed text-[var(--bts-text-secondary)]">{c13.misconception.wrongQuote}</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(10%_-_var(--bts-tint-mix)_*_0.05),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] p-5">
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-emerald-200">
                                <CheckCircle2 size={18} />
                                <span className="text-sm font-bold">{c13.misconception.rightLabel}</span>
                            </div>
                            <SpeakButton text={`${c13.misconception.rightLabel}. ${c13.misconception.rightBody}`} speechLocale={speechLocale} />
                        </div>
                        <p className="leading-relaxed text-[var(--bts-text-secondary)]">
                            {c13.misconception.rightBody}
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════ בדיקת הבנה ══════════ */}
            {/* M9: המנטור שלפני השאלה הוסר. "הפרידו נתמך ממומצא" הוא בדיוק הקריטריון
                שהשאלה מבקשת מהלומד להפעיל בעצמו. תוכן הבדיקה נשאר זהה. */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-indigo-500/40 bg-[var(--bts-surface)] p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <ListChecks size={20} className="text-indigo-300" />
                        <h3 className="text-xl font-bold text-[var(--bts-text-primary)]">{c13.lock.title}</h3>
                    </div>

                    <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-4">
                        <UnderstandingLock />
                    </div>
                </div>
            </section>

            {/* ══════════ תובנה מעשית ══════════ */}
            {/* M9: המנטור "בקשו בדיקה, לא רק תשובה" הוסר. זו כותרת התובנה המעשית עצמה,
                והרשימה שמתחתיה כבר מפרטת בדיוק איך. */}
            <section className="mt-12 text-start" dir={dir}>
                <InsightBox type="intuition" title={c13.practical.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block">{c13.practical.lead}</span>
                        <SpeakButton text={`${c13.practical.title}. ${c13.practical.lead} ${c13.practical.uses.join(' ')} ${c13.practical.caveat}`} speechLocale={speechLocale} />
                    </div>
                    <ul className="mt-3 space-y-2">
                        {c13.practical.uses.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                                <span className="text-sm">{line}</span>
                            </li>
                        ))}
                    </ul>
                    <span className="mt-3 block text-sm text-[var(--bts-text-muted)]">{c13.practical.caveat}</span>
                </InsightBox>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-10 rounded-2xl border border-indigo-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-indigo-950)] [--t-l:var(--color-indigo-500)] p-5 text-start" dir={dir}><div className="text-xs font-bold text-indigo-300">{cq.nextQuestionLabel}</div><p className="mt-2 text-base leading-relaxed text-[var(--bts-text-body)]">{cq.transitions[13]}</p></section>
            <section className="mt-16 mb-4" dir={dir}>
                <ExpandableLab title={localizedQuiz.title}>
                    {/* M9 F3 SELECTIVE RESPOND: המבדק חסר-דמות לחלוטין. אייקון הסטטוס נשאר בראש
                        כרטיס התוצאה בשתי התוצאות, ומשפט התגובה הספציפי לפרק מופיע מתחתיו
                        כטקסט בלבד. */}
                    <AssessmentEngine
                        {...localizedQuiz}
                        conceptDisplayMap={t.behindAi.conceptLabels}
                        mentorResponse={{ pass: c13.mentorRespond.quizPass, fail: c13.mentorRespond.quizFail }}
                    />
                </ExpandableLab>
            </section>
        </ChapterLayout>
    );
}
