"use client";

// ────────────────────────────────────────────────────────────────────────
// פרק 16: Does AI Learn From Me (האם AI לומד ממני).
//
// הרעיון: כשמתקנים את המודל בשיחה, הוא יכול להשתמש בתיקון כי הוא בהקשר. זה לא אומר
// שהמודל הבסיסי למד לתמיד. הקשר, זיכרון (תכונת מוצר), לוגים ומשוב, ואימון הם שכבות
// שונות. הפרק כללי ומושגי, בלי טענות על מדיניות/פרטיות/אימון של מוצר מסוים.
//
// i18n-first: כל הטקסט הגלוי מגיע מ-t.behindAi.doesAiLearn (6 שפות אמיתיות). המבנה
// (אייקונים, גוונים, מזהי אלמנטים) נשאר כאן. פרק 16 הוא הפרק הבנוי
// האחרון בשלב הנוכחי, ולכן הוא שומר על מעבר למבחן סיום הלומדה.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    BrainCircuit, RotateCcw, Layers, FlaskConical, ListChecks,
    CheckCircle2, XCircle, Sparkles, MessageSquare, Ban, Users,
    ArrowLeft, ArrowRight,
} from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine, type ReviewLink } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';

import { OpeningGuess, type OpeningGuessContent, type DiscoveryGuessCard } from '@/components/ai-internals/OpeningGuess';
import { DoesAiLearnLab } from '@/components/ai-internals/DoesAiLearnLab';
import { ExpandableLab } from '@/components/ai-internals/ExpandableLab';
import { SpeakButton } from '@/components/ai-internals/SpeakButton';
import { FloatingReadAloud } from '@/components/ai-internals/FloatingReadAloud';
import { ReadAloudControls, type ReadAloudMode } from '@/components/ai-internals/ReadAloudControls';
import type { ReadAloudSegment } from '@/components/ai-internals/useReadAloud';
import { LOCALE_SPEECH_LANG } from '@/components/ai-internals/readAloudLang';
import { useT } from '@/i18n/useT';
import type { DoesAiLearnQuizId } from '@/i18n/locales/he/behind-ai/doesAiLearnQuiz';

// טקסט הכרטיסים מגיע מהמילון (t.behindAi.doesAiLearn.guess.cards) לפי מזהה. כאן נשאר
// רק המבנה: אייקון וגוון הסטטוס, שאינם תלויי שפה. הכרטיס עם
// statusTone === 'precise' הוא הבחירה הנכונה (התיקון עוזר בהקשר, לא בהכרח נלמד לתמיד).
const GUESS_CARD_META = [
    { id: 'alwaysRemembers', icon: RotateCcw, statusTone: 'common' },
    { id: 'contextNotPermanent', icon: MessageSquare, statusTone: 'precise' },
    { id: 'cantUseAtAll', icon: Ban, statusTone: 'layer' },
    { id: 'everyoneGetsIt', icon: Users, statusTone: 'partial' },
] as const;

/* ════════════════════════ בדיקת הבנה: מה ההנחה הבטוחה בשיחה חדשה ════════════════════════ */
// התשובה הנכונה: "ייתכן שהשיחה החדשה לא כוללת את התיקון, אלא אם זיכרון או הקשר מספקים אותו" (אינדקס 1).
const LOCK_CORRECT = 1;

const UnderstandingLock: React.FC = () => {
    const { t, dir } = useT();
    const c16 = t.behindAi.doesAiLearn;
    const lock = c16.lock;
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;

    return (
        <div dir={dir} className="text-start">
            <div className="mb-3 flex items-center gap-2">
                <p className="text-sm font-bold text-[var(--bts-text-body)]">{lock.question}</p>
                <SpeakButton text={lock.question} speechLocale={c16.contentLocale} />
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

export default function BehindTheScenesChapter16() {
    const reduce = useReducedMotion();
    const { t, dir } = useT();
    const isRtl = dir === 'rtl';
    const c16 = t.behindAi.doesAiLearn;
    const raLabels = t.behindAi.aiInternals.readAloud;

    // שפת ההקראה נגזרת מ-contentLocale של הפרק, כדי שההקראה תדבר בשפת התוכן ולא בשפת
    // הממשק. הכיוון (RTL/LTR) של הפריסה מגיע מ-dir של שפת הממשק.
    const speechLocale = c16.contentLocale;
    const FlowArrow = isRtl ? ArrowLeft : ArrowRight;

    // ניחוש הפתיחה: טקסט מהמילון, מבנה (אייקון/גוון) מהמטא־דאטה.
    const guessContent: OpeningGuessContent = {
        eyebrow: c16.guess.eyebrow,
        title: c16.guess.title,
        subtitle: c16.guess.subtitle,
        invite: c16.guess.invite,
        correctTitle: c16.guess.correctTitle,
        wrongTitle: c16.guess.wrongTitle,
        getsRightLabel: c16.guess.getsRightLabel,
        revealButton: c16.guess.revealButton,
        revealTitle: c16.guess.revealTitle,
        revealCopy: c16.guess.revealCopy,
        cta: c16.guess.cta,
        ctaTargetId: 'does-ai-learn-lab',
        resetButton: c16.guess.resetButton,
        exploreHint: c16.guess.exploreHint,
    };
    const guessCards: DiscoveryGuessCard[] = GUESS_CARD_META.map((m) => ({
        id: m.id,
        icon: m.icon,
        statusTone: m.statusTone,
        ...c16.guess.cards[m.id],
    }));

    // ── טקסט "רגע לפני המעבדה" להקראה: כותרת, תת-כותרת, פתיח וכל הנקודות. מקור אחד. ──
    const primerText = `${c16.primer.title}. ${c16.primer.subtitle}. ${c16.primer.lead} ${c16.primer.points.map((p) => `${p.title}. ${p.body}`).join(' ')}`;

    // ── דוק האזנה מודרכת: מקטעי הקראה יציבים בלבד (בלי מצב חי של המעבדה, כפתורים,
    // מנטורים או חידון). התוכן נקרא בשפת contentLocale. ──
    const sHero: ReadAloudSegment = { id: 'hero', label: c16.hero.titleHighlight, text: `${c16.hero.titleLead} ${c16.hero.titleHighlight}. ${c16.hero.lede}` };
    const sGuess: ReadAloudSegment = { id: 'guess', label: c16.guess.eyebrow, text: `${c16.guess.title} ${c16.guess.subtitle}` };
    const sPrimer: ReadAloudSegment = { id: 'primer', label: c16.primer.title, text: primerText };
    const sSee: ReadAloudSegment = { id: 'see', label: c16.see.title, text: `${c16.see.title}. ${c16.see.steps.join(', ')}. ${c16.see.caption}` };
    const sLab: ReadAloudSegment = { id: 'lab', label: c16.lab.sectionTitle, text: `${c16.lab.sectionTitle}. ${c16.lab.sectionIntro}` };
    const sWow: ReadAloudSegment = { id: 'wow', label: c16.insight.title, text: `${c16.insight.title}. ${c16.insight.lead} ${c16.insight.body}` };
    const sMisconception: ReadAloudSegment = { id: 'misconception', label: c16.misconception.rightLabel, text: `${c16.misconception.rightLabel}. ${c16.misconception.rightBody}` };
    const sLock: ReadAloudSegment = { id: 'lock', label: c16.lock.title, text: c16.lock.question };
    const sPractical: ReadAloudSegment = { id: 'practical', label: c16.practical.title, text: `${c16.practical.title}. ${c16.practical.lead} ${c16.practical.uses.join(' ')}` };
    const sCaveat: ReadAloudSegment = { id: 'caveat', label: c16.practical.title, text: c16.practical.caveat };
    const sBridge: ReadAloudSegment = { id: 'bridge', label: t.behindAi.chapterQuiz.nextQuestionLabel, text: t.behindAi.chapterQuiz.transitions[16] };

    const readAloudByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
        short: [sHero, sPrimer, sLab, sPractical, sCaveat],
        regular: [sHero, sGuess, sPrimer, sLab, sWow, sLock, sPractical, sCaveat, sBridge],
        full: [sHero, sGuess, sPrimer, sSee, sLab, sWow, sMisconception, sLock, sPractical, sCaveat, sBridge],
    };

    // ── מבדק הפרק: המנגנון המשותף נשמר מ-quizData, וטקסט התצוגה ממוזג לפי מזהה.
    // קישורי החזרה הממוקדים מתורגמים דרך chapterQuiz, בדיוק כמו בפרקים הקודמים. ──
    const cq = t.behindAi.chapterQuiz;
    const baseQuiz = behindAiChapterQuizzes[16];
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
        title: c16.quiz.title,
        subtitle: c16.quiz.subtitle,
        startLabel: c16.quiz.startLabel,
        submitLabel: c16.quiz.submitLabel,
        completedTitle: c16.quiz.completedTitle,
        getReviewLinks,
        questions: baseQuiz.questions.map((q) => ({ ...q, ...c16.quiz.byId[q.id as DoesAiLearnQuizId] })),
    };

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={16} themeAware>

            {/* ══════════ HERO ══════════ */}
            <div className="relative">
                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-[var(--bts-border)] bg-[var(--bts-surface)] backdrop-blur-xl p-8 md:p-10 text-start"
                    dir={dir}
                >
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-fuchsia-500/10 blur-[90px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-surface-elevated)_var(--bts-tint-mix),var(--color-slate-800))_70%,transparent)] border border-violet-500/30 mb-5">
                            <BrainCircuit size={14} className="text-violet-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300" dir="ltr">{c16.hero.badge}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-[var(--bts-text-primary)] leading-[1.1] mb-4">
                            {c16.hero.titleLead}{' '}
                            <span className={`${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[color-mix(in_oklab,var(--color-violet-400)_calc(100%_-_var(--bts-tint-mix)_*_0.4),black)] via-[color-mix(in_oklab,var(--color-fuchsia-400)_calc(100%_-_var(--bts-tint-mix)_*_0.4),black)] to-[color-mix(in_oklab,var(--color-indigo-400)_calc(100%_-_var(--bts-tint-mix)_*_0.4),black)] bg-clip-text text-transparent`}>
                                {c16.hero.titleHighlight}
                            </span>
                        </h1>

                        <div className="flex items-start gap-2.5 max-w-3xl">
                            <p className="text-lg text-[var(--bts-text-secondary)] leading-relaxed">{c16.hero.lede}</p>
                            <SpeakButton text={`${c16.hero.titleLead} ${c16.hero.titleHighlight}. ${c16.hero.lede}`} className="mt-1" speechLocale={speechLocale} />
                        </div>

                        <p className="mt-4 text-base font-bold text-violet-200">
                            {c16.hero.hook}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-[var(--bts-text-muted)]">
                            <span className="inline-flex items-center gap-1.5">
                                <RotateCcw size={14} className="text-violet-400" /> {c16.hero.chipTry}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Layers size={14} className="text-fuchsia-400" /> {c16.hero.chipCompare}
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

                {/* M10: מנטור ההירו הוסר. הבועה (תיקון עכשיו הוא לא בהכרח למידה לתמיד) חוזרת על
                    כותרת ההירו והלד שמעליה, והיא הופיעה רק מ-xl ומעלה, כך שלומד בטלפון ממילא
                    לא ראה אותה. הכותרת, הלד וההוק נשארים כפי שהם. */}
            </div>

            {/* ══════════ ניחוש פתיחה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                {/* M10 F3 SELECTIVE RESPOND: מנטור ההזמנה ומנטור כרטיס ההכרעה הוסרו, ומשפט ההזמנה
                    נשאר כטקסט גוף וגלוי גם בטלפון. אחרי הבחירה שתי התוצאות מקבלות בדיוק אותה שורת
                    תגובה אנושית: אותה פוזה, אותו גודל, אותו מיקום. זה רגע הדמות היחיד בפרק. */}
                <OpeningGuess
                    content={guessContent}
                    cards={guessCards}
                    speechLocale={speechLocale}
                    mentorResponse={{ correct: c16.mentorRespond.guessCorrect, wrong: c16.mentorRespond.guessWrong }}
                />
            </section>

            {/* ══════════ רגע לפני המעבדה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-[2rem] border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-6 backdrop-blur-xl md:p-8">
                    <div className="mb-4 flex items-start justify-between gap-2.5">
                        <div>
                            <span className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-300">
                                <Sparkles size={14} /> {c16.primer.eyebrow}
                            </span>
                            <h3 className="text-xl font-black text-[var(--bts-text-primary)] md:text-2xl">{c16.primer.title}</h3>
                            <p className="mt-1 text-sm font-medium text-[var(--bts-text-muted)]">{c16.primer.subtitle}</p>
                        </div>
                        <SpeakButton text={primerText} speechLocale={speechLocale} />
                    </div>

                    <p className="text-[15px] leading-relaxed text-[var(--bts-text-secondary)] md:text-base">{c16.primer.lead}</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {c16.primer.points.map((pt) => (
                            <div key={pt.title} className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-4">
                                <div className="mb-1.5 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                    <div className="text-sm font-bold text-[var(--bts-text-bright)]">{pt.title}</div>
                                </div>
                                <p className="text-[15px] leading-relaxed text-[var(--bts-text-secondary)]">{pt.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ See: מהתיקון ועד שיפור קבוע ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="text-sm font-bold text-[var(--bts-text-bright)]">{c16.see.title}</div>
                        <SpeakButton text={`${c16.see.title}. ${c16.see.steps.join(', ')}. ${c16.see.caption}`} speechLocale={speechLocale} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {c16.see.steps.map((step, i) => (
                            <React.Fragment key={step}>
                                <span className={`rounded-full border px-3 py-1.5 text-sm font-bold ${
                                    i === c16.see.steps.length - 1
                                        ? 'border-violet-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-violet-900)] [--t-l:var(--color-violet-500)] text-violet-200'
                                        : 'border-[var(--bts-border-mid)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] text-[var(--bts-text-secondary)]'
                                }`}>
                                    {step}
                                </span>
                                {i < c16.see.steps.length - 1 && <FlowArrow size={15} className="text-fuchsia-400" aria-hidden />}
                            </React.Fragment>
                        ))}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--bts-text-muted)]">{c16.see.caption}</p>
                </div>
            </section>

            {/* ══════════ מעבדת האם AI לומד ממני ══════════ */}
            <section id="does-ai-learn-lab" className="mt-12 space-y-5 text-start scroll-mt-24" dir={dir}>
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400" dir="ltr">{c16.lab.sectionEyebrow}</div>
                        <h3 className="text-2xl font-bold text-[var(--bts-text-primary)]">{c16.lab.sectionTitle}</h3>
                    </div>
                </div>

                <div className="flex items-start gap-2.5">
                    <p className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-5 leading-relaxed text-[var(--bts-text-secondary)]">
                        {c16.lab.sectionIntro}
                    </p>
                    <SpeakButton text={`${c16.lab.sectionTitle}. ${c16.lab.sectionIntro}`} className="mt-1" speechLocale={speechLocale} />
                </div>

                <DoesAiLearnLab data={c16.lab} dir={dir} speechLocale={speechLocale} />

                {/* M10: המנטור "עברו בין השכבות וראו מה משתנה" הוסר. מבוא המעבדה שמעליו
                    כבר אומר את זה, ובאופן קונקרטי יותר. */}
            </section>

            {/* ══════════ רגע ה-wow ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <InsightBox type="intuition" title={c16.insight.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block text-lg font-bold text-violet-200">{c16.insight.lead}</span>
                        <SpeakButton text={`${c16.insight.title}. ${c16.insight.lead} ${c16.insight.body}`} speechLocale={speechLocale} />
                    </div>
                    <span className="mt-2 block">{c16.insight.body}</span>
                </InsightBox>
            </section>

            {/* ══════════ תיקון טעות נפוצה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                {/* M10: המנטור "זה עבד, אבל לא בהכרח נלמד" הוסר. שני הכרטיסים שמתחתיו
                אומרים בדיוק את אותה הבחנה, ובניסוח מלא יותר. */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-rose-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(10%_-_var(--bts-tint-mix)_*_0.05),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)] p-5">
                        <div className="mb-2 flex items-center gap-2 text-rose-200">
                            <XCircle size={18} />
                            <span className="text-sm font-bold">{c16.misconception.wrongLabel}</span>
                        </div>
                        <p className="leading-relaxed text-[var(--bts-text-secondary)]">{c16.misconception.wrongQuote}</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(10%_-_var(--bts-tint-mix)_*_0.05),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] p-5">
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-emerald-200">
                                <CheckCircle2 size={18} />
                                <span className="text-sm font-bold">{c16.misconception.rightLabel}</span>
                            </div>
                            <SpeakButton text={`${c16.misconception.rightLabel}. ${c16.misconception.rightBody}`} speechLocale={speechLocale} />
                        </div>
                        <p className="leading-relaxed text-[var(--bts-text-secondary)]">
                            {c16.misconception.rightBody}
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════ בדיקת הבנה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                {/* M10: המנטור שלפני השאלה הוסר. "שיחה חדשה מתחילה מדף חדש" הוא בדיוק
                התשובה שהשאלה מבקשת מהלומד להגיע אליה בעצמו. תוכן הבדיקה נשאר זהה. */}
                <div className="rounded-2xl border border-violet-500/40 bg-[var(--bts-surface)] p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <ListChecks size={20} className="text-violet-300" />
                        <h3 className="text-xl font-bold text-[var(--bts-text-primary)]">{c16.lock.title}</h3>
                    </div>

                    <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-4">
                        <UnderstandingLock />
                    </div>
                </div>
            </section>

            {/* ══════════ תובנה מעשית ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                {/* M10: המנטור "ספקו שוב את הכלל או המקור" הוסר. זו התובנה המעשית עצמה,
                והרשימה שמתחתיה כבר מפרטת בדיוק איך. */}
                <InsightBox type="intuition" title={c16.practical.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block">{c16.practical.lead}</span>
                        <SpeakButton text={`${c16.practical.title}. ${c16.practical.lead} ${c16.practical.uses.join(' ')} ${c16.practical.caveat}`} speechLocale={speechLocale} />
                    </div>
                    <ul className="mt-3 space-y-2">
                        {c16.practical.uses.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                <span className="text-sm">{line}</span>
                            </li>
                        ))}
                    </ul>
                    <span className="mt-3 block text-sm text-[var(--bts-text-muted)]">{c16.practical.caveat}</span>
                </InsightBox>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-10 rounded-2xl border border-indigo-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-indigo-950)] [--t-l:var(--color-indigo-500)] p-5 text-start" dir={dir}><div className="text-xs font-bold text-indigo-300">{cq.nextQuestionLabel}</div><p className="mt-2 text-base leading-relaxed text-[var(--bts-text-body)]">{cq.transitions[16]}</p></section>
            <section className="mt-16 mb-4" dir={dir}>
                <ExpandableLab title={localizedQuiz.title}>
                    {/* M10 F3 SELECTIVE RESPOND: המבדק חסר-דמות לחלוטין. אייקון הסטטוס נשאר בראש
                        כרטיס התוצאה בשתי התוצאות, ומשפט התגובה הספציפי לפרק מופיע מתחתיו
                        כטקסט בלבד. */}
                    <AssessmentEngine
                        {...localizedQuiz}
                        conceptDisplayMap={t.behindAi.conceptLabels}
                        mentorResponse={{ pass: c16.mentorRespond.quizPass, fail: c16.mentorRespond.quizFail }}
                    />
                </ExpandableLab>
            </section>

            {/* המעבר הקדימה מטופל ע"י ניווט הפוטר המשותף של ChapterLayout: פרק 16 זורם
                לפרק 17 (Chat to Agent). מבחן הסיום אינו מוצג כאן, כי פרק 16 כבר אינו
                הפרק האחרון בתוכנית. ה-CTA למבחן הסיום יחזור בסוף המסלול, אחרי פרק 19. */}
        </ChapterLayout>
    );
}
