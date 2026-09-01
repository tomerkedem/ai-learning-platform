"use client";

// ────────────────────────────────────────────────────────────────────────
// פרק 18: Guardrails (סיכון, הרשאות, אישור ועצירה). ממשיך את מקטע ה-Agent.
//
// הרעיון: Agent טוב לא רק מתקדם למשימה בעזרת כלים ולולאת עבודה. הוא גם עובר שכבת
// בקרה שמחליטה מה מותר בצעד הבא: פעולה בטוחה ממשיכה, מידע חסר עוצר ושואל, פעולה
// רגישה מכינה טיוטה או עוצרת לאישור, ופעולה אסורה נחסמת. יכולת לבצע אינה הרשאה
// לבצע. הפרק אינו טוען ש-AI מסוכן, שאסור ל-Agent לפעול, שהוא תמיד פועל לבד, או
// שיכולת פירושה הרשאה. בקרה היא תכנון מקצועי, לא פחד.
//
// i18n-first: כל הטקסט הגלוי מגיע מ-t.behindAi.guardrails (6 שפות אמיתיות). המבנה
// (אייקונים, גוונים, מזהי אלמנטים) נשאר כאן. פרק 18 אינו הפרק האחרון
// בתוכנית (עוד מחכה 19 Full Trace), ולכן הוא מסתיים כפרק רגיל עם גשר מושגי לפרק 19,
// בלי מעבר למבחן הסיום. מבחן הסיום יחזור אחרי פרק 19.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    ShieldCheck, ShieldAlert, Ban, Send, MousePointerClick, Layers, FlaskConical,
    ListChecks, CheckCircle2, XCircle, Sparkles, Route, ArrowLeft, ArrowRight,
} from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine, type ReviewLink } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';

import { OpeningGuess, type OpeningGuessContent, type DiscoveryGuessCard } from '@/components/ai-internals/OpeningGuess';
import { GuardrailsLab } from '@/components/ai-internals/GuardrailsLab';
import { ExpandableLab } from '@/components/ai-internals/ExpandableLab';
import { SpeakButton } from '@/components/ai-internals/SpeakButton';
import { FloatingReadAloud } from '@/components/ai-internals/FloatingReadAloud';
import { ReadAloudControls, type ReadAloudMode } from '@/components/ai-internals/ReadAloudControls';
import type { ReadAloudSegment } from '@/components/ai-internals/useReadAloud';
import { LOCALE_SPEECH_LANG } from '@/components/ai-internals/readAloudLang';
import { useT } from '@/i18n/useT';
import type { GuardrailsQuizId } from '@/i18n/locales/he/behind-ai/guardrailsQuiz';

// טקסט הכרטיסים מגיע מהמילון (t.behindAi.guardrails.guess.cards) לפי מזהה. כאן נשאר
// רק המבנה: אייקון וגוון הסטטוס, שאינם תלויי שפה. הכרטיס עם
// statusTone === 'precise' הוא הבחירה הנכונה (שליחה יכולה לדרוש אישור).
const GUESS_CARD_META = [
    { id: 'needsApproval', icon: ShieldCheck, statusTone: 'precise' },
    { id: 'canSend', icon: Send, statusTone: 'common' },
    { id: 'alwaysAlone', icon: ShieldAlert, statusTone: 'layer' },
    { id: 'neverTools', icon: Ban, statusTone: 'partial' },
] as const;

/* ════════════════ בדיקת הבנה: מה Agent טוב יעשה עם טיוטה מוכנה בלי אישור שליחה ════════════════ */
// התשובה הנכונה: "להכין טיוטה ולבקש אישור לפני שליחה" (אינדקס 1).
const LOCK_CORRECT = 1;

const UnderstandingLock: React.FC = () => {
    const { t, dir } = useT();
    const c18 = t.behindAi.guardrails;
    const lock = c18.lock;
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;

    return (
        <div dir={dir} className="text-start">
            <div className="mb-3 flex items-center gap-2">
                <p className="text-sm font-bold text-slate-200">{lock.question}</p>
                <SpeakButton text={lock.question} speechLocale={c18.contentLocale} />
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

export default function BehindTheScenesChapter18() {
    const reduce = useReducedMotion();
    const { t, dir } = useT();
    const isRtl = dir === 'rtl';
    const c18 = t.behindAi.guardrails;
    const raLabels = t.behindAi.aiInternals.readAloud;

    // שפת ההקראה נגזרת מ-contentLocale של הפרק, כדי שההקראה תדבר בשפת התוכן ולא בשפת
    // הממשק. הכיוון (RTL/LTR) של הפריסה מגיע מ-dir של שפת הממשק.
    const speechLocale = c18.contentLocale;
    const FlowArrow = isRtl ? ArrowLeft : ArrowRight;

    // ניחוש הפתיחה: טקסט מהמילון, מבנה (אייקון/גוון) מהמטא־דאטה.
    const guessContent: OpeningGuessContent = {
        eyebrow: c18.guess.eyebrow,
        title: c18.guess.title,
        subtitle: c18.guess.subtitle,
        invite: c18.guess.invite,
        correctTitle: c18.guess.correctTitle,
        wrongTitle: c18.guess.wrongTitle,
        getsRightLabel: c18.guess.getsRightLabel,
        revealButton: c18.guess.revealButton,
        revealTitle: c18.guess.revealTitle,
        revealCopy: c18.guess.revealCopy,
        cta: c18.guess.cta,
        ctaTargetId: 'guardrails-lab',
        resetButton: c18.guess.resetButton,
        exploreHint: c18.guess.exploreHint,
    };
    const guessCards: DiscoveryGuessCard[] = GUESS_CARD_META.map((m) => ({
        id: m.id,
        icon: m.icon,
        statusTone: m.statusTone,
        ...c18.guess.cards[m.id],
    }));

    // ── טקסט "רגע לפני המעבדה" להקראה: כותרת, תת-כותרת, פתיח וכל הנקודות. מקור אחד. ──
    const primerText = `${c18.primer.title}. ${c18.primer.subtitle}. ${c18.primer.lead} ${c18.primer.points.map((p) => `${p.title}. ${p.body}`).join(' ')}`;

    // ── דוק האזנה מודרכת: מקטעי הקראה יציבים בלבד (בלי מצב חי של המעבדה, כפתורים,
    // מנטורים או חידון). התוכן נקרא בשפת contentLocale. ──
    const sHero: ReadAloudSegment = { id: 'hero', label: c18.hero.titleHighlight, text: `${c18.hero.titleLead} ${c18.hero.titleHighlight}. ${c18.hero.lede}` };
    const sGuess: ReadAloudSegment = { id: 'guess', label: c18.guess.eyebrow, text: `${c18.guess.title} ${c18.guess.subtitle}` };
    const sPrimer: ReadAloudSegment = { id: 'primer', label: c18.primer.title, text: primerText };
    const sSee: ReadAloudSegment = { id: 'see', label: c18.see.title, text: `${c18.see.title}. ${c18.see.goalLabel}: ${c18.see.goal}. ${c18.see.flowLabel}: ${c18.see.flow.join(', ')}. ${c18.see.outcomesLabel}: ${c18.see.outcomes.join(', ')}. ${c18.see.caption}` };
    const sLab: ReadAloudSegment = { id: 'lab', label: c18.lab.sectionTitle, text: `${c18.lab.sectionTitle}. ${c18.lab.sectionIntro}` };
    const sWow: ReadAloudSegment = { id: 'wow', label: c18.insight.title, text: `${c18.insight.title}. ${c18.insight.lead} ${c18.insight.body}` };
    const sMisconception: ReadAloudSegment = { id: 'misconception', label: c18.misconception.rightLabel, text: `${c18.misconception.rightLabel}. ${c18.misconception.rightBody}` };
    const sLock: ReadAloudSegment = { id: 'lock', label: c18.lock.title, text: c18.lock.question };
    const sPractical: ReadAloudSegment = { id: 'practical', label: c18.practical.title, text: `${c18.practical.title}. ${c18.practical.lead} ${c18.practical.uses.join(' ')}` };
    const sCaveat: ReadAloudSegment = { id: 'caveat', label: c18.practical.title, text: c18.practical.caveat };

    const readAloudByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
        short: [sHero, sPrimer, sLab, sPractical, sCaveat],
        regular: [sHero, sGuess, sPrimer, sLab, sWow, sLock, sPractical, sCaveat],
        full: [sHero, sGuess, sPrimer, sSee, sLab, sWow, sMisconception, sLock, sPractical, sCaveat],
    };

    // ── מבדק הפרק: המנגנון המשותף נשמר מ-quizData, וטקסט התצוגה ממוזג לפי מזהה.
    // קישורי החזרה הממוקדים מתורגמים דרך chapterQuiz, בדיוק כמו בפרקים הקודמים. ──
    const cq = t.behindAi.chapterQuiz;
    const baseQuiz = behindAiChapterQuizzes[18];
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
        title: c18.quiz.title,
        subtitle: c18.quiz.subtitle,
        startLabel: c18.quiz.startLabel,
        submitLabel: c18.quiz.submitLabel,
        completedTitle: c18.quiz.completedTitle,
        getReviewLinks,
        questions: baseQuiz.questions.map((q) => ({ ...q, ...c18.quiz.byId[q.id as GuardrailsQuizId] })),
    };

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={18}>

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
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-sky-500/10 blur-[90px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-indigo-500/30 mb-5">
                            <ShieldCheck size={14} className="text-indigo-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-indigo-300" dir="ltr">{c18.hero.badge}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                            {c18.hero.titleLead}{' '}
                            <span className={`${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-indigo-400 via-sky-400 to-violet-400 bg-clip-text text-transparent`}>
                                {c18.hero.titleHighlight}
                            </span>
                        </h1>

                        <div className="flex items-start gap-2.5 max-w-3xl">
                            <p className="text-lg text-slate-300 leading-relaxed">{c18.hero.lede}</p>
                            <SpeakButton text={`${c18.hero.titleLead} ${c18.hero.titleHighlight}. ${c18.hero.lede}`} className="mt-1" speechLocale={speechLocale} />
                        </div>

                        <p className="mt-4 text-base font-bold text-indigo-200">
                            {c18.hero.hook}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-indigo-400" /> {c18.hero.chipTry}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Layers size={14} className="text-sky-400" /> {c18.hero.chipCompare}
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

                {/* M10: מנטור ההירו הוסר. הבועה (יכול לבצע? עוד לא אומר שמותר) היא כותרת
                    ההירו שמעליה במילים אחרות, והיא הופיעה רק מ-xl ומעלה, כך שלומד בטלפון ממילא
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
                    mentorResponse={{ correct: c18.mentorRespond.guessCorrect, wrong: c18.mentorRespond.guessWrong }}
                />
            </section>

            {/* ══════════ רגע לפני המעבדה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-[2rem] border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-xl md:p-8">
                    <div className="mb-4 flex items-start justify-between gap-2.5">
                        <div>
                            <span className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-300">
                                <Sparkles size={14} /> {c18.primer.eyebrow}
                            </span>
                            <h3 className="text-xl font-black text-white md:text-2xl">{c18.primer.title}</h3>
                            <p className="mt-1 text-sm font-medium text-slate-400">{c18.primer.subtitle}</p>
                        </div>
                        <SpeakButton text={primerText} speechLocale={speechLocale} />
                    </div>

                    <p className="text-[15px] leading-relaxed text-slate-300 md:text-base">{c18.primer.lead}</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {c18.primer.points.map((pt) => (
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

            {/* ══════════ See: שכבת הבקרה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="text-sm font-bold text-slate-100">{c18.see.title}</div>
                        <SpeakButton text={`${c18.see.title}. ${c18.see.goalLabel}: ${c18.see.goal}. ${c18.see.flowLabel}: ${c18.see.flow.join(', ')}. ${c18.see.outcomesLabel}: ${c18.see.outcomes.join(', ')}. ${c18.see.caption}`} speechLocale={speechLocale} />
                    </div>

                    {/* המטרה */}
                    <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3.5">
                        <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">{c18.see.goalLabel}</div>
                        <p className="text-[15px] font-bold leading-relaxed text-slate-100">{c18.see.goal}</p>
                    </div>

                    {/* שכבת הבקרה: שרשרת הצעדים */}
                    <div className="mt-3 rounded-xl border border-indigo-500/30 bg-indigo-950/15 p-4">
                        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                            <ShieldCheck size={13} aria-hidden /> {c18.see.flowLabel}
                        </div>
                        <ol className="flex flex-wrap items-center gap-1.5">
                            {c18.see.flow.map((step, i) => (
                                <React.Fragment key={step}>
                                    <li className="rounded-lg border border-indigo-500/30 bg-slate-950/40 px-2 py-1 text-[13px] font-bold leading-tight text-indigo-100">
                                        {step}
                                    </li>
                                    {i < c18.see.flow.length - 1 && <FlowArrow size={12} className="shrink-0 text-indigo-400/70" aria-hidden />}
                                </React.Fragment>
                            ))}
                        </ol>
                    </div>

                    {/* התוצאות האפשריות */}
                    <div className="mt-3 rounded-xl border border-slate-700/50 bg-slate-950/30 p-4">
                        <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{c18.see.outcomesLabel}</div>
                        <div className="flex flex-wrap gap-1.5">
                            {c18.see.outcomes.map((out) => (
                                <span key={out} className="rounded-lg border border-slate-700/50 bg-slate-900/60 px-2 py-1 text-[13px] font-bold leading-tight text-slate-200">
                                    {out}
                                </span>
                            ))}
                        </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{c18.see.caption}</p>
                </div>
            </section>

            {/* ══════════ מעבדת ה-Guardrails ══════════ */}
            <section id="guardrails-lab" className="mt-12 space-y-5 text-start scroll-mt-24" dir={dir}>
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-indigo-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-400" dir="ltr">{c18.lab.sectionEyebrow}</div>
                        <h3 className="text-2xl font-bold text-white">{c18.lab.sectionTitle}</h3>
                    </div>
                </div>

                <div className="flex items-start gap-2.5">
                    <p className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                        {c18.lab.sectionIntro}
                    </p>
                    <SpeakButton text={`${c18.lab.sectionTitle}. ${c18.lab.sectionIntro}`} className="mt-1" speechLocale={speechLocale} />
                </div>

                <GuardrailsLab data={c18.lab} dir={dir} speechLocale={speechLocale} />

                {/* M10: המנטור "עברו בין הפעולות וראו מה משתנה" הוסר. מבוא המעבדה שמעליו
                    כבר אומר את זה, ובאופן קונקרטי יותר. */}
            </section>

            {/* ══════════ רגע ה-wow ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <InsightBox type="intuition" title={c18.insight.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block text-lg font-bold text-indigo-200">{c18.insight.lead}</span>
                        <SpeakButton text={`${c18.insight.title}. ${c18.insight.lead} ${c18.insight.body}`} speechLocale={speechLocale} />
                    </div>
                    <span className="mt-2 block">{c18.insight.body}</span>
                </InsightBox>
            </section>

            {/* ══════════ תיקון טעות נפוצה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                {/* M10: המנטור "בקרה היא תכנון, לא פחד" הוסר. שני הכרטיסים שמתחתיו
                אומרים בדיוק את אותה הבחנה, ובניסוח מלא יותר. */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-rose-200">
                            <XCircle size={18} />
                            <span className="text-sm font-bold">{c18.misconception.wrongLabel}</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">{c18.misconception.wrongQuote}</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5">
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-emerald-200">
                                <CheckCircle2 size={18} />
                                <span className="text-sm font-bold">{c18.misconception.rightLabel}</span>
                            </div>
                            <SpeakButton text={`${c18.misconception.rightLabel}. ${c18.misconception.rightBody}`} speechLocale={speechLocale} />
                        </div>
                        <p className="leading-relaxed text-slate-300">
                            {c18.misconception.rightBody}
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════ בדיקת הבנה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                {/* M10: המנטור שלפני השאלה הוסר. "טיוטה ואישור לפני שליחה" הוא בדיוק התשובה
                הנכונה של השאלה שמתחתיו. תוכן הבדיקה נשאר זהה. */}
                <div className="rounded-2xl border border-indigo-500/40 bg-slate-900/60 p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <ListChecks size={20} className="text-indigo-300" />
                        <h3 className="text-xl font-bold text-white">{c18.lock.title}</h3>
                    </div>

                    <div className="rounded-xl border border-slate-700/50 bg-slate-950/30 p-4">
                        <UnderstandingLock />
                    </div>
                </div>
            </section>

            {/* ══════════ תובנה מעשית ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                {/* M10: המנטור "הגדירו מותר, אסור ואישור" הוסר. זו התובנה המעשית עצמה,
                והרשימה שמתחתיה כבר מפרטת בדיוק איך. */}
                <InsightBox type="intuition" title={c18.practical.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block">{c18.practical.lead}</span>
                        <SpeakButton text={`${c18.practical.title}. ${c18.practical.lead} ${c18.practical.uses.join(' ')} ${c18.practical.caveat}`} speechLocale={speechLocale} />
                    </div>
                    <ul className="mt-3 space-y-2">
                        {c18.practical.uses.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                                <span className="text-sm">{line}</span>
                            </li>
                        ))}
                    </ul>
                    <span className="mt-3 block text-sm text-slate-400">{c18.practical.caveat}</span>
                </InsightBox>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir={dir}>
                <ExpandableLab title={localizedQuiz.title}>
                    {/* M10 F3 SELECTIVE RESPOND: המבדק חסר-דמות לחלוטין. אייקון הסטטוס נשאר בראש
                        כרטיס התוצאה בשתי התוצאות, ומשפט התגובה הספציפי לפרק מופיע מתחתיו
                        כטקסט בלבד. */}
                    <AssessmentEngine
                        {...localizedQuiz}
                        conceptDisplayMap={t.behindAi.conceptLabels}
                        mentorResponse={{ pass: c18.mentorRespond.quizPass, fail: c18.mentorRespond.quizFail }}
                    />
                </ExpandableLab>
            </section>

            {/* ══════════ גשר לפרק הבא (פרק 19 Full Trace). תצוגה מקדימה מושגית, לא קישור
                פעיל. הניווט בין הפרקים מטופל על ידי ChapterLayout. ══════════ */}
            <section className="mt-16 mb-4 text-start" dir={dir}>
                <div className="mx-auto max-w-2xl rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-indigo-900/15 to-slate-900/40 p-7">
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-300">
                        <Route size={14} /> {c18.bridge.eyebrow}
                    </span>
                    <div className="mt-2 flex items-start justify-between gap-2.5">
                        <h3 className="text-xl font-black text-white md:text-2xl">{c18.bridge.title}</h3>
                        <SpeakButton text={`${c18.bridge.title}. ${c18.bridge.body}`} speechLocale={speechLocale} />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{c18.bridge.body}</p>
                </div>
            </section>
        </ChapterLayout>
    );
}
