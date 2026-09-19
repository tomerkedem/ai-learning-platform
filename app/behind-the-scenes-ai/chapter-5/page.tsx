"use client";

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Map, Sparkles, ArrowLeftRight, MousePointerClick, ListChecks, ArrowLeft, ArrowRight,
    FlaskConical, ChefHat, Wrench, CheckCircle2, Info,
} from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine, type ReviewLink } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';
import { OpeningGuess, type OpeningGuessContent, type DiscoveryGuessCard, type GuessTone } from '@/components/ai-internals/OpeningGuess';
import { SemanticSpaceLab } from '@/components/ai-internals/SemanticSpaceLab';
import { ExpandableLab } from '@/components/ai-internals/ExpandableLab';
// רכיב ה-DNA מפרק 4 שמקומו האמיתי כאן, במרחב המשמעות: הוא מראה למה שני Embeddings
// שונים יכולים להופיע קרובים. התוכן מגיע ממילון פרק 4 (chapter4Lab), מתורגם ב-6 השפות.
import { getLabContent, joinSentences } from '../chapter-4/labContent';
import { MeaningDnaStrip } from '../chapter-4/components/MeaningDnaStrip';
import type { SentenceId } from '../chapter-4/embeddingEngine';

// משפטים ל-DNA ההשוואתי: משתרעים על טווח הקרבה, מזהים-כמעט (שני כשלי מסירה) ועד רחוקים
// לגמרי (בעיית מסירה מול עדכון חיוב). כך הלומד בוחר זוג ורואה כמה רכיבי משמעות משותפים.
const DNA_COMPARE_IDS: SentenceId[] = [
    'pkg-not-arrived',
    'delivery-not-handed',
    'pkg-arrived',
    'system-not-showing',
    'billing-address-update',
];
import { ReadAloudControls, type ReadAloudMode } from '@/components/ai-internals/ReadAloudControls';
import { FloatingReadAloud } from '@/components/ai-internals/FloatingReadAloud';
import { SpeakButton } from '@/components/ai-internals/SpeakButton';
import type { ReadAloudSegment } from '@/components/ai-internals/useReadAloud';
import { LOCALE_SPEECH_LANG } from '@/components/ai-internals/readAloudLang';
import { useT } from '@/i18n/useT';
import type { SemanticSpaceQuizId } from '@/i18n/locales/he/behind-ai/semanticSpaceQuiz';

/* ════════════════════ מטא-דאטה מבני של כרטיסי הניחוש (לא ניתן לתרגום) ════════════════════ */
// הטקסט מגיע מהמילון (guess.cards[id]); כאן רק המבנה: מזהה, אייקון וגוון הסטטוס,
// שאינם תלויי שפה. הכרטיס הנכון הוא "delayed" (precise).
const GUESS_CARD_META: { id: 'arrived' | 'delayed' | 'checking' | 'recipe'; tone: GuessTone; icon: DiscoveryGuessCard['icon'] }[] = [
    { id: 'arrived', tone: 'common', icon: ArrowLeftRight },
    { id: 'delayed', tone: 'precise', icon: Sparkles },
    { id: 'checking', tone: 'partial', icon: Wrench },
    { id: 'recipe', tone: 'layer', icon: ChefHat },
];

/* ════════════════════ בדיקת הבנה: התשובה הנכונה מבנית ════════════════════ */
const LOCK_CORRECT = 1;

const LockQuestion: React.FC = () => {
    const { t, dir } = useT();
    const lock = t.behindAi.semanticSpace.lock;
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;
    const correct = choice === LOCK_CORRECT;

    return (
        <div dir={dir} className="text-start">
            <div className="mb-3 flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-[var(--bts-text-body)]">{lock.question}</p>
                <SpeakButton text={lock.question} />
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
                {lock.options.map((opt, i) => {
                    const isCorrect = i === LOCK_CORRECT;
                    const isChosen = i === choice;
                    let cls = 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]';
                    if (answered && isChosen && isCorrect) cls = 'border-emerald-400/70 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-emerald-900)] [--t-l:var(--color-emerald-500)] text-emerald-100';
                    else if (answered && isChosen && !isCorrect) cls = 'border-amber-400/70 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-amber-900)] [--t-l:var(--color-amber-500)] text-amber-100';
                    else if (answered && isCorrect) cls = 'border-emerald-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-900)] [--t-l:var(--color-emerald-500)] text-emerald-100';
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
                    className={`mt-4 rounded-xl border p-3 text-sm leading-relaxed text-[var(--bts-text-body)] ${
                        correct ? 'border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)]' : 'border-amber-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-amber-950)] [--t-l:var(--color-amber-500)]'
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

    // ── כותרת ההירו: מחרוזת נגזרת אחת לתצוגה ולהקראה ──
    // הכותרת מורכבת משני חלקים כדי לצבוע את השני בגרדיאנט. ביפנית אין רווחים בין
    // מילים, ולכן חיבור ברווח שתל רווח מלאכותי באמצע משפט טבעי, גם ב-h1 וגם באמירת
    // ה-TTS. המפריד נגזר מהשפה, והמחרוזת המחוברת משמשת את שני המקומות בלי לשכפל לוגיקה.
    const heroTitleSep = locale === 'ja' ? '' : ' ';
    const heroTitle = `${c5.hero.titleLead}${heroTitleSep}${c5.hero.titleHighlight}`;
    const heroSpeech = `${heroTitle}. ${c5.hero.lede}`;

    // ── ניחוש הפתיחה: תוכן + כרטיסים ממוזגים מהמילון עם המטא-דאטה המבני ──
    const g = c5.guess;
    const guessContent: OpeningGuessContent = {
        eyebrow: g.eyebrow,
        title: g.title,
        subtitle: g.subtitle,
        prompt: g.prompt,
        invite: g.invite,
        correctTitle: g.correctTitle,
        wrongTitle: g.wrongTitle,
        getsRightLabel: g.getsRightLabel,
        revealButton: g.revealButton,
        revealTitle: g.revealTitle,
        revealCopy: g.revealCopy,
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
            getsRight: card.getsRight,
            missesLabel: card.missesLabel,
            misses: card.misses,
            bridge: card.bridge,
        };
    });

    // ── דוק האזנה מודרכת: מקטעי הקראה יציבים בלבד. לא נכללים: ניחוש, מצב חי של
    // המעבדה (בחירה, גרירה, שכנים, אחוזים), כפתורים, מנטורים וחידון. תוויות מ-aiInternals.
    // פרק 5 מתורגם במלואו בשש השפות, ולכן כל המקטעים נכללים תמיד ונקראים בשפת הממשק. ──
    const ra = t.behindAi.aiInternals.readAloud;
    const sTitle: ReadAloudSegment = { id: 'title', label: c5.hero.titleLead, text: heroSpeech };
    const sPlain: ReadAloudSegment = { id: 'plain', label: c5.plain.title, text: `${c5.plain.title}. ${c5.plain.paragraphs.join(' ')}` };
    const sExplainAll: ReadAloudSegment = { id: 'explain', label: c5.explain.title, text: `${c5.explain.title}. ${c5.explain.paragraphs.join(' ')}` };
    const sExplainEach: ReadAloudSegment[] = c5.explain.paragraphs.map((p, i) => ({ id: `explain-${i}`, label: c5.explain.title, text: p }));
    const sNegation: ReadAloudSegment = {
        id: 'negation',
        label: c5.lab.negation.title,
        text: `${c5.lab.negation.explanation} ${c5.lab.negation.bridge}`,
    };
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

    // תוכן מעבדת פרק 4 (locale-aware) עבור דמו האובייקטים וה-DNA שהובאו לכאן.
    const c4Lab = getLabContent(locale);
    const c4Sentences = useMemo(() => joinSentences(c4Lab), [c4Lab]);
    const [dnaAId, setDnaAId] = useState<SentenceId>('pkg-not-arrived');
    const [dnaBId, setDnaBId] = useState<SentenceId>('delivery-not-handed');
    const dnaA = c4Sentences.find((s) => s.id === dnaAId) ?? c4Sentences[0];
    const dnaB = c4Sentences.find((s) => s.id === dnaBId) ?? null;

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={5} themeAware>

            {/* ══════════ HERO ══════════ */}
            {/* M4: מנטור ההירו הוסר. הוא היה דמות שותקת (בלי בועה ובלי טקסט) בשש עטיפות
                רספונסיביות, ולא לימד דבר. הכותרת, הפתיח והצ'יפים נושאים את ההירו לבדם. */}
            <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[2.5rem] border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_60%,transparent)] backdrop-blur-xl p-8 md:p-10 text-start"
                dir={dir}
            >
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(70%_+_var(--bts-tint-mix)_*_0.3),transparent)] border border-violet-500/30 mb-5">
                        <Map size={14} className="text-violet-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">{c5.hero.badge}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-[var(--bts-text-primary)] leading-[1.1] mb-4">
                        {c5.hero.titleLead}{heroTitleSep}
                        <span className={`${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[color-mix(in_oklab,var(--color-violet-400)_calc(100%_-_var(--bts-tint-mix)_*_0.4),black)] via-[color-mix(in_oklab,var(--color-fuchsia-400)_calc(100%_-_var(--bts-tint-mix)_*_0.4),black)] to-[color-mix(in_oklab,var(--color-cyan-400)_calc(100%_-_var(--bts-tint-mix)_*_0.4),black)] bg-clip-text text-transparent`}>
                            {c5.hero.titleHighlight}
                        </span>
                    </h1>

                    <div className="flex items-start gap-2.5">
                        <p className="text-lg text-[var(--bts-text-secondary)] leading-relaxed">{c5.hero.lede}</p>
                        <SpeakButton text={heroSpeech} className="mt-1" />
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-[var(--bts-text-muted)]">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-violet-400" /> {c5.hero.chipMap}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <ArrowLeftRight size={14} className="text-cyan-400" /> {c5.hero.chipNeighbors}
                        </span>
                    </div>

                    <FloatingReadAloud dir={dir}>
                        {/* הדוק מקריא תוכן עברי, ולכן גם lang וגם locale נגזרים משפת
                            התוכן. locale אינו רק תווית: הוא מפתח זיכרון הקול ב-
                            localStorage, וחייב להתאים ל-SpeakButton כדי שבחירת הקול
                            של הלומד תשותף ביניהם. */}
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


            {/* ══════════ במילים פשוטות ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-[2rem] border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-6 backdrop-blur-xl md:p-8">
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                            <Sparkles size={14} /> {c5.plain.eyebrow}
                        </span>
                        <SpeakButton text={`${c5.plain.title} ${c5.plain.paragraphs.join(' ')}`} />
                    </div>
                    <h2 className="mb-4 text-xl font-black text-[var(--bts-text-primary)] md:text-2xl">{c5.plain.title}</h2>
                    <div className="space-y-3">
                        {c5.plain.paragraphs.map((p, i) => (
                            <p key={i} className="text-[15px] leading-relaxed text-[var(--bts-text-body)]">{p}</p>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ ניחוש מהיר ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                {/* M7 F3 SELECTIVE RESPOND: אין מנטור לפני הבחירה (משפט ההזמנה נשאר כטקסט גוף
                    וגלוי גם בטלפון), ואחרי הבחירה שתי התוצאות מקבלות בדיוק אותה שורת תגובה
                    אנושית: אותה פוזה, אותו גודל, אותו מיקום. זה רגע הדמות היחיד בפרק. */}
                <OpeningGuess
                    content={guessContent}
                    cards={guessCards}
                    headingLevel={2}
                    mentorResponse={{ correct: c5.mentorRespond.guessCorrect, wrong: c5.mentorRespond.guessWrong }}
                />
            </section>

            {/* ══════════ Semantic Space Lab ══════════ */}
            <section id="semantic-lab" className="mt-12 space-y-5 text-start scroll-mt-[var(--bts-sticky-top,88px)]" dir={dir}>
                <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))_50%,transparent)] bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(60%_+_var(--bts-tint-mix)_*_0.4),transparent)] font-mono text-sm font-black text-[var(--bts-text-body)]">1</span>
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">{c5.sections.labEyebrow}</div>
                        <h2 className="text-2xl font-bold text-[var(--bts-text-primary)]">{c5.sections.labTitle}</h2>
                    </div>
                </div>

                {/* עדשת המעבדה: המשפט היחיד בפרק שאומר משהו שהטקסט הקיים אינו אומר.
                    labIntro מסביר מה לעשות במעבדה, והשורה שאחריו מסבירה על מה להסתכל בזמן
                    שעושים. M12: הפורטרט ירד (אין דמות בלומדה הזאת), והדגש עבר כולו
                    לטיפוגרפיה: קו-צד סגול, משקל בולט וגוון בהיר מגוף הטקסט. כך העדשה
                    נשארת נבדלת בבירור מהפסקה שמעליה בכל רוחב מסך, ולא רק מ-sm ומעלה. */}
                <div className="flex items-start justify-between gap-2.5 rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-5 leading-relaxed text-[var(--bts-text-secondary)]">
                    <div className="flex-1">
                        <span className="block">{c5.sections.labIntro}</span>
                        <span className="mt-3 block border-s-2 border-violet-400/60 ps-3.5 text-[15px] font-bold text-violet-100">
                            {c5.mentor.lab}
                        </span>
                    </div>
                    <SpeakButton text={`${c5.sections.labTitle}. ${c5.sections.labIntro} ${c5.mentor.lab}`} className="mt-0.5" />
                </div>

                <ExpandableLab title={c5.sections.labTitle}>
                    <SemanticSpaceLab content={c5.lab} dir={dir} locale={locale} />
                </ExpandableLab>
            </section>

            {/* ══════════ מה המפה מלמדת ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-6">
                    <div className="mb-4 flex items-start justify-between gap-2.5">
                        <h2 className="text-lg font-bold text-[var(--bts-text-body)]">{c5.explain.title}</h2>
                        <SpeakButton text={`${c5.explain.title}. ${c5.explain.paragraphs.join(' ')}`} />
                    </div>
                    <div className="space-y-3">
                        {c5.explain.paragraphs.map((p, i) => (
                            <p key={i} className="text-[15px] leading-relaxed text-[var(--bts-text-secondary)]">{p}</p>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ למה שני Embeddings מופיעים קרובים: השוואת דפוס הערכים (הובא מפרק 4) ══════════ */}
            {/* שני משפטים שנוסחו אחרת יכולים להופיע קרובים כשדפוס הערכים הכולל שלהם דומה.
                הפסים מראים כמה מהדפוס משותף, וזה מה שמזכה אותם במיקומים קרובים במרחב. */}
            {dnaA && (
                <section className="mt-12 text-start" dir={dir}>
                  <div className="mb-4 flex items-start justify-between gap-2.5 rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-5 leading-relaxed text-[var(--bts-text-secondary)]">
                    <span>{c5.sections.dnaIntro}</span>
                    <SpeakButton text={c5.sections.dnaIntro} className="mt-0.5" />
                  </div>
                  <ExpandableLab title={c5.sections.dnaTitle}>
                    <div className="space-y-4 rounded-2xl border border-violet-500/30 bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-5 sm:p-6">
                        {/* שני בוררים: בחרו שני משפטים וראו כמה רכיבי משמעות משותפים להם.
                            זהים כמעט (שני כשלי מסירה) => הרבה קשרים ירוקים. רחוקים (מסירה מול חיוב)
                            => כמעט בלי קשרים, הגדילים נפרדים. */}
                        {/* הנחיית פעולה קצרה, צמודה לבוררים, כדי שברור שזו השוואת זוג ולא רק תוויות */}
                        <p className="text-[13px] font-semibold leading-relaxed text-[var(--bts-text-body)]">{c5.sections.dnaSelectorHint}</p>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-cyan-300">{c4Lab.dna.roleActive}</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {DNA_COMPARE_IDS.map((id) => {
                                        const s = c4Sentences.find((x) => x.id === id);
                                        if (!s) return null;
                                        const on = id === dnaAId;
                                        return (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => setDnaAId(id)}
                                                aria-pressed={on}
                                                className={`inline-flex min-h-[44px] items-center rounded-lg border px-2.5 py-1 text-sm font-bold transition-colors ${
                                                    on ? 'border-cyan-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-cyan-900)] [--t-l:var(--color-cyan-500)] text-cyan-100' : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(30%_+_var(--bts-tint-mix)_*_0.7),transparent)] text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
                                                }`}
                                            >
                                                {s.text}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-violet-300">{c4Lab.dna.roleCompare}</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {DNA_COMPARE_IDS.map((id) => {
                                        const s = c4Sentences.find((x) => x.id === id);
                                        if (!s) return null;
                                        const on = id === dnaBId;
                                        return (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => setDnaBId(id)}
                                                aria-pressed={on}
                                                className={`inline-flex min-h-[44px] items-center rounded-lg border px-2.5 py-1 text-sm font-bold transition-colors ${
                                                    on ? 'border-violet-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-violet-900)] [--t-l:var(--color-violet-500)] text-violet-100' : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(30%_+_var(--bts-tint-mix)_*_0.7),transparent)] text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
                                                }`}
                                            >
                                                {s.text}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-4">
                            {/* משפט מקשר צמוד לתצוגה: מבהיר שכל גדיל הוא משפט אחד ולא קו דקורטיבי,
                                ושדמיון הדפוסים הוא הסיבה לקרבה במרחב. נמצא ממש מעל הסולם כדי שהקישור ברור. */}
                            <div className="mb-3 flex items-start justify-between gap-2.5">
                                <p className="text-[13px] font-semibold leading-relaxed text-[var(--bts-text-body)]">{c5.sections.dnaStrandNote}</p>
                                {/* ההקראה כוללת גם את הבהרת המטאפורה שמתחת לסולם, כדי שהיא נמצאת
                                    בנתיב הקראה בלי כפתור נוסף גלוי. */}
                                <SpeakButton text={`${c5.sections.dnaStrandNote} ${c5.sections.dnaDisclaimer}`} className="mt-0.5" />
                            </div>
                            {/* דריסת המסגור של פרק 4: כותרת פרק-5 קצרה (דפוס הערכים) ובלי המבוא
                            הפנימי, שכבר נאמר בכרטיס המסגור מעל ה-ExpandableLab. כך אין חזרה על
                            "מה יש בתוך הווקטור" של פרק 4 ואין מבוא כפול. */}
                        <MeaningDnaStrip active={dnaA} compare={dnaB} geneLabels={c4Lab.genes} dna={c4Lab.dna} dir={dir} labNumber={2} title={c5.sections.dnaStripTitle} showIntro={false} />
                            {/* הבהרת מטאפורה, משנית וקצרה: ה-DNA הוא המחשה, לא חוט ביולוגי. משלימה את
                                axesNote המשותף (שמדבר על הצירים) בלי לגעת בטקסט פרק 4. */}
                            <p className="mt-3 text-[12px] leading-relaxed text-[var(--bts-text-faint)]">{c5.sections.dnaDisclaimer}</p>
                        </div>
                    </div>
                  </ExpandableLab>
                </section>
            )}

            {/* ══════════ בדיקת הבנה ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <div className="rounded-2xl border border-violet-500/40 bg-[color-mix(in_oklab,var(--bts-panel-from)_60%,transparent)] p-6">
                    {/* הרמז הוא טקסט ולא בועה, כדי שישרוד גם ב-390 שבו התמונה מוסתרת.
                        הוא נאמר לפני התשובה בכוונה, ולכן אינו זקוק ל-state של LockQuestion. */}
                    {/* M4: דמות ה-happy הוסרה. היא הייתה שותקת, וחגגה לפני שהלומד ענה.
                        הרמז הנייטרלי עצמו כבר היה טקסט גוף והוא נשאר בדיוק כפי שהיה. */}
                    <div className="mb-5">
                        <div className="flex items-center gap-2">
                            <ListChecks size={20} className="text-violet-300" />
                            <h2 className="text-xl font-bold text-[var(--bts-text-primary)]">{c5.lock.title}</h2>
                        </div>
                        <p className="mt-2 text-[13px] font-semibold leading-relaxed text-violet-200">{c5.mentor.lock}</p>
                    </div>
                    <LockQuestion />
                </div>
            </section>

            {/* ══════════ תובנה מעשית ══════════ */}
            {/* בכוונה בלי בועה: הקודמת רק חזרה על התבליט הראשון. */}
            <section className="mt-12 text-start" dir={dir}>
                <InsightBox type="intuition" title={c5.practical.title} headingLevel={2}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block">{c5.practical.lead}</span>
                        <SpeakButton text={`${c5.practical.title}. ${c5.practical.lead} ${c5.practical.uses.join(' ')} ${c5.practical.caveat}`} />
                    </div>
                    <ul className="mt-3 space-y-2">
                        {c5.practical.uses.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                <span className="text-sm">{line}</span>
                            </li>
                        ))}
                    </ul>
                    <span className="mt-3 block text-sm text-[var(--bts-text-muted)]">{c5.practical.caveat}</span>
                    <span className="mt-3 flex items-start gap-2 border-s-2 border-violet-400/50 ps-3 text-sm font-bold text-violet-100">
                        {isRtl ? <ArrowLeft size={15} className="mt-0.5 shrink-0" /> : <ArrowRight size={15} className="mt-0.5 shrink-0" />}
                        {c5.practical.bridge}
                    </span>
                </InsightBox>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir={dir}>
                <ExpandableLab title={localizedQuiz.title}>
                    {/* M7 F3 SELECTIVE RESPOND: המבדק חסר-דמות לחלוטין. אייקון הסטטוס נשאר בראש
                        כרטיס התוצאה בשתי התוצאות, ומשפט התגובה הספציפי לפרק מופיע מתחתיו
                        כטקסט בלבד. */}
                    <AssessmentEngine
                        {...localizedQuiz}
                        conceptDisplayMap={c5.quiz.conceptLabels}
                        mentorResponse={{ pass: c5.mentorRespond.quizPass, fail: c5.mentorRespond.quizFail }}
                    />
                </ExpandableLab>
            </section>
        </ChapterLayout>
    );
}
