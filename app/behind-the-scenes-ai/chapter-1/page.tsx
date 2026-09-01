"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Terminal, ScanSearch, Layers, Eye, Lightbulb, CheckCircle2 } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine, type ReviewLink } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { useT } from '@/i18n/useT';
import type { Chapter1QuizId } from '@/i18n/locales/he/behind-ai/chapter1Quiz';

import { TransparentLabLayout } from '@/components/ai-internals/TransparentLabLayout';
import { ChatInterfacePanel } from '@/components/ai-internals/ChatInterfacePanel';
import { ReadAloudControls, type ReadAloudMode } from '@/components/ai-internals/ReadAloudControls';
import { FloatingReadAloud } from '@/components/ai-internals/FloatingReadAloud';
import { SpeakButton } from '@/components/ai-internals/SpeakButton';
import type { ReadAloudSegment } from '@/components/ai-internals/useReadAloud';
import { LOCALE_SPEECH_LANG } from '@/components/ai-internals/readAloudLang';
import type { Accent, ChatMessage, FlowMode } from '@/components/ai-internals/types';

import { runChatEngine, runAgentEngine, type Confidence } from './mockEngine';
import { traceChatEngine, traceAgentEngine } from './engineTrace';
import { GlassEnginePanel } from './GlassEnginePanel';
import { HoloFrame } from './HoloFrame';
import { ExpandableLab } from '@/components/ai-internals/ExpandableLab';
// גשר-זיהוי: אותם צבעי 14 התחנות של מפת המבוא, כדי לקשר את המעבדה החיה למפה.
import { STATION_PALETTE } from '@/components/ai-internals/IntroStationViz';

// רגע "עצור ושאל" (שיא הפרק): פלט שבו המנוע עוצר במקום לענות בביטחון - בקשת הבהרה,
// בקשת אישור, או ביטחון נמוך. משמש גם לסימון ההצעות וגם לזיהוי שהלומד כבר חווה זאת.
// מוגדר במודול (יציב) כדי לא לשבור תלויות של hooks.
const isPauseOutcome = (
    res: { decision: { kind: string }; confidence?: Confidence },
    m: FlowMode,
): boolean => res.decision.kind === 'ask' || res.decision.kind === 'stop' || (m === 'chat' && res.confidence === 'Low');

export default function BehindTheScenesChapter1() {
    const reduce = useReducedMotion();
    const { t, dir, locale } = useT();
    const isRtl = dir === 'rtl';
    const c1 = t.behindAi.chapter1;
    const c = c1.redesign;
    const viz = c1.visuals;

    // דוק האזנה מודרכת: מקטעים מהתוכן הפעיל בלבד, עם תחנה דינמית שמתחלפת לפי הבחירה.
    const ra = t.behindAi.aiInternals.readAloud;
    const c1Lede = `${c1.hero.ledeLead}${c1.hero.ledeHighlight}${c1.hero.ledeRest}`;
    const sTitle: ReadAloudSegment = { id: 'title', label: c1.hero.titleLead, text: `${c1.hero.titleLead} ${c1.hero.titleHighlight}. ${c1Lede}` };
    const sLabIntro: ReadAloudSegment = { id: 'lab-intro', label: c1.lab.title, text: `${c1.lab.title}. ${c1.lab.intro}` };
    const sFocus: ReadAloudSegment = { id: 'focus', label: c1.lab.title, text: c1.lab.observationInstruction };
    // מבדק הפרק: המנגנון המשותף (correctAnswer, onComplete, getReviewLinks, nextHref...)
    // מגיע מ-quizData, וטקסט התצוגה ממוזג מהמילון לפי מזהה השאלה.
    // קישורי החזרה שומרים על ה-href, ורק התווית מתורגמת מתוך t.behindAi.chapterQuiz.
    const cq = t.behindAi.chapterQuiz;
    const quizText = c1.quiz;
    const baseQuiz = behindAiChapterQuizzes[1];
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
        title: quizText.title,
        subtitle: quizText.subtitle,
        startLabel: quizText.startLabel,
        submitLabel: quizText.submitLabel,
        completedTitle: quizText.completedTitle,
        questions: baseQuiz.questions.map((q) => ({ ...q, ...quizText.byId[q.id as Chapter1QuizId] })),
        getReviewLinks,
    };

    // קלטי-הזרע של הצ'אט מגיעים מהמילון (seed). קלט ברירת המחדל משמש לאתחול ה-state.
    const DEFAULT_INPUT = c1.seed.defaultInput;
    const SUGGESTIONS = c1.seed.suggestions;
    // קלט-הזרע הקודם, לזיהוי החלפת שפה. ה-SSR מרנדר עברית, ולכן ה-state ההתחלתי עברי
    // עד שהלקוח מחליף ל-?lang אחרי mount; אז מאפסים את קלט-ההדגמה לברירת המחדל החדשה.
    const prevSeedRef = useRef(DEFAULT_INPUT);

    const [mode, setMode] = useState<FlowMode>('chat');
    const [inputValue, setInputValue] = useState(DEFAULT_INPUT);
    const [conversationText, setConversationText] = useState(DEFAULT_INPUT);
    const [sendCount, setSendCount] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [activeStationIndex, setActiveStationIndex] = useState(0);
    const [stationReplayCount, setStationReplayCount] = useState(0);
    const [journeyResetCount, setJourneyResetCount] = useState(0);
    const [stationNarrationPlayCount, setStationNarrationPlayCount] = useState(0);
    // קישור חי: הטוקן שמרחפים עליו (בצ'אט או במנוע), להדגשה הדדית.
    const [hoverToken, setHoverToken] = useState<string | null>(null);

    const isChat = mode === 'chat';
    const accent: Accent = isChat ? 'cyan' : 'purple';

    // המנוע הלימודי: תוצאה נגזרת מהטקסט שנשלח.
    const chat = useMemo(() => runChatEngine(conversationText), [conversationText]);
    const agent = useMemo(() => runAgentEngine(conversationText), [conversationText]);

    // ההצעות שמפעילות עצירה או בקשת הבהרה מסומנות בתוך Transparent Chat עצמו.
    const pauseSuggestions = useMemo(
        () => SUGGESTIONS.filter((s) => isPauseOutcome(mode === 'chat' ? runChatEngine(s) : runAgentEngine(s), mode)),
        [SUGGESTIONS, mode],
    );

    // איפוס קלט-ההדגמה ההתחלתי כשמילון השפה מתחלף (he בעת SSR -> השפה שנבחרה אחרי mount).
    // מאפסים רק אם הקלט עדיין שווה לברירת המחדל הקודמת, כדי לא לדרוס הקלדה/שליחה של המשתמש.
    // רץ רק כשברירת המחדל משתנה (deps), ולכן בלי לולאה ובלי איפוס בכל render. ה-setState
    // ב-setTimeout (לא סינכרוני ב-effect) לכבוד ה-lint. בעברית בלבד אין שינוי (אין החלפה).
    useEffect(() => {
        const prev = prevSeedRef.current;
        if (prev === DEFAULT_INPUT) return;
        prevSeedRef.current = DEFAULT_INPUT;
        const id = setTimeout(() => {
            setConversationText((cur) => (cur === prev ? DEFAULT_INPUT : cur));
            setInputValue((cur) => (cur === prev ? DEFAULT_INPUT : cur));
            setActiveStationIndex(0);
            setJourneyResetCount((count) => count + 1);
            setHoverToken(null);
        }, 0);
        return () => clearTimeout(id);
    }, [DEFAULT_INPUT]);

    // התחנות נגזרות רק מהבקשה שנשלחה. הטיוטה נשארת בשדה הקלט עד שליחה מפורשת.
    const engineSteps = useMemo(
        () => (isChat ? traceChatEngine(conversationText, viz) : traceAgentEngine(conversationText, viz)),
        [conversationText, isChat, viz],
    );

    const safeActiveStationIndex = Math.min(activeStationIndex, Math.max(0, engineSteps.length - 1));
    const activeStep = engineSteps[safeActiveStationIndex];
    const journeyKey = `${mode}:${conversationText}:${sendCount}:${journeyResetCount}`;
    const replayKey = `${journeyKey}:${safeActiveStationIndex}:${stationReplayCount}`;

    // אינדיקטור הקלדה: כל שינוי מתחיל "הקלדה" (ב-handlers) שמתפוגגת אחרי רגע.
    useEffect(() => {
        const t = setTimeout(() => setIsTyping(false), 850);
        return () => clearTimeout(t);
    }, [conversationText, mode, sendCount]);

    // הצ'אט השקוף והתחנה האחרונה משתמשים באותה תשובה מתוסרטת, כדי לשמור על עקבה עקבית.
    const mockReply = isChat ? viz.mockEngine.chatReplies[chat.replyKey] : viz.mockEngine.agentReplies[agent.replyKey];
    const replyText = mockReply;
    const showTyping = isTyping;

    // id כולל את sendCount כדי שכל שליחה חדשה תנפיש כניסה, אבל צמיחת טוקנים
    // באותה שליחה לא תרמאונט את הבועה (הזרמה חלקה).
    const messages = useMemo<ChatMessage[]>(() => [
        { id: `user-${sendCount}`, role: 'user', text: conversationText },
        { id: `ai-${sendCount}`, role: 'ai', text: replyText },
    ], [conversationText, sendCount, replyText]);

    const sMentor: ReadAloudSegment = { id: 'mentor', label: c1.mentorGuide.title, text: `${c1.mentorGuide.title}. ${c1.mentorGuide.body}` };
    const sDisclosure: ReadAloudSegment = { id: 'simulation-disclosure', label: c1.lab.title, text: c1.lab.simulationDisclosure };
    const sRequest: ReadAloudSegment = { id: 'active-request', label: c1.lab.activeRequestLabel, text: `${c1.lab.activeRequestLabel}: ${conversationText}. ${c1.lab.visibleResponseLabel}: ${replyText}` };
    const activeTeaching = activeStep?.teaching;
    const sJourney: ReadAloudSegment = {
        id: 'active-station',
        label: activeStep?.title ?? c1.lab.mapBridge,
        text: activeStep && activeTeaching
            ? `${c1.lab.simulationDisclosure} ${activeStep.title}. ${viz.enginePanel.inputLabel}: ${activeTeaching.input}. ${viz.enginePanel.transformationLabel}: ${activeTeaching.transformation}. ${viz.enginePanel.outputLabel}: ${activeTeaching.output}. ${viz.enginePanel.conclusionLabel}: ${activeTeaching.conclusion}. ${viz.enginePanel.limitationLabel}: ${activeTeaching.limitation}.`
            : c1.lab.simulationDisclosure,
    };
    const sTakeaway: ReadAloudSegment = { id: 'takeaway', label: c1.insightIdea.title, text: c1.insightIdea.body };
    const sThreePointSummary: ReadAloudSegment = { id: 'three-point-summary', label: c.summary.title, text: `${c.summary.title}. ${c.summary.points.join(' ')}` };
    const sQuizIntro: ReadAloudSegment = { id: 'quiz-intro', label: quizText.title, text: `${quizText.title}. ${quizText.subtitle}` };
    const readAloudByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
        short: [sTitle, sMentor, sDisclosure, sRequest, sJourney, sTakeaway, sThreePointSummary, sQuizIntro],
        regular: [sTitle, sMentor, sLabIntro, sDisclosure, sRequest, sJourney, sTakeaway, sThreePointSummary, sQuizIntro],
        full: [sTitle, sMentor, sLabIntro, sFocus, sDisclosure, sRequest, sJourney, sTakeaway, sThreePointSummary, sQuizIntro],
    };

    const commit = (text: string) => {
        const next = text.trim();
        if (!next) return;
        setIsTyping(true);
        setConversationText(next);
        setSendCount((c) => c + 1);
        setActiveStationIndex(0);
        setJourneyResetCount((count) => count + 1);
        setHoverToken(null);
    };

    const handleSend = () => {
        commit(inputValue);
        setInputValue('');
    };
    const handleSuggestion = (text: string) => {
        setInputValue(text);
        commit(text);
    };
    const handleModeChange = (m: FlowMode) => {
        setIsTyping(true);
        setMode(m);
        setActiveStationIndex(0);
        setJourneyResetCount((count) => count + 1);
        setHoverToken(null);
    };

    const handleStationChange = (index: number) => {
        setActiveStationIndex(Math.max(0, Math.min(index, engineSteps.length - 1)));
        setHoverToken(null);
    };

    const handleReplayStation = () => {
        setStationReplayCount((count) => count + 1);
        setStationNarrationPlayCount((count) => count + 1);
    };

    const handleResetJourney = () => {
        setActiveStationIndex(0);
        setStationReplayCount((count) => count + 1);
        setJourneyResetCount((count) => count + 1);
        setHoverToken(null);
    };

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={1}>

            {/* ══════════ HERO ══════════ */}
            <motion.section
                data-chapter1-hero
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 text-start"
                dir={dir}
            >
                <div className={`absolute -top-16 ${isRtl ? '-right-16' : '-left-16'} w-56 h-56 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none`} />
                <div className={`absolute -bottom-20 ${isRtl ? '-left-10' : '-right-10'} w-64 h-64 bg-purple-500/10 blur-[90px] rounded-full pointer-events-none`} />

                {/* ב-lg+ דוק ההאזנה מעוגן בפינה מעל הכותרת; הכותרת וה-lede מתפזרים לרוחב מלא מתחתיו */}
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-cyan-500/30 mb-5">
                        <Terminal size={14} className="text-cyan-400" />
                        <span className="font-mono text-xs tracking-widest uppercase text-cyan-300">{c1.hero.badge}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        {c1.hero.titleLead}{' '}
                        <span className={`${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent`}>
                            {c1.hero.titleHighlight}
                        </span>
                        ?
                    </h1>

                    <div className="flex items-start gap-2.5">
                        <p className="text-lg text-slate-300 leading-relaxed">
                            {c1.hero.ledeLead}
                            <span className="text-white font-semibold">{c1.hero.ledeHighlight}</span>{c1.hero.ledeRest}
                        </p>
                        <SpeakButton text={`${c1.hero.titleLead} ${c1.hero.titleHighlight}. ${c1Lede}`} className="mt-1" />
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <Terminal size={14} className="text-cyan-400" /> {c1.hero.chips[0]}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <ScanSearch size={14} className="text-cyan-400" /> {c1.hero.chips[1]}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Layers size={14} className="text-purple-400" /> {c1.hero.chips[2]}
                        </span>
                    </div>

                </div>
            </motion.section>

            {/* דוק האזנה מודרכת צף: מצמיד לקצה החיצוני (תלוי-כיוון) ונשאר נגיש תוך כדי גלילה */}
            <FloatingReadAloud dir={dir}>
                <ReadAloudControls
                    key={locale}
                    segmentsByMode={readAloudByMode}
                    lang={LOCALE_SPEECH_LANG[locale]}
                    locale={locale}
                    dir={dir}
                    labels={ra}
                    reduce={!!reduce}
                    compact
                    resetSignal={`${mode}:${conversationText}:${sendCount}:${safeActiveStationIndex}:${stationReplayCount}`}
                    playSegmentId="active-station"
                    playSignal={String(stationNarrationPlayCount)}
                />
            </FloatingReadAloud>

            {/* הכנה קצרה לפני Transparent Chat, ללא מעטפת של כרטיס לימודי.

                M10: שתי דמויות המנטור הוסרו מכאן. לפרק 1 אין ניחוש ואין רגע מחויבות של הלומד,
                ולכן אין בו נקודת הכרעה שבה F3 RESPOND שייך. הדמות שישבה כאן הייתה נוכחות
                קבועה במנוחה, בדיוק מה שהמודל הנבחר מבקש להסיר, והיא לא לימדה דבר מעבר לטקסט
                שלצדה. הטקסט עצמו נשאר במלואו: הוא מסביר על מה להסתכל במעבדה, וזה תוכן לימודי
                שאינו קיים במקום אחר. גם מקטע ההקראה (id 'mentor') נשאר כפי שהוא. */}
            <section
                data-chapter1-mentor-guide
                className="mt-8 text-start md:mt-10"
                dir={dir}
            >
                <div className="min-w-0 max-w-3xl">
                    <div className="flex items-start gap-2.5">
                        <div>
                            <h2 className="text-[22px] font-black leading-tight text-white md:text-[28px]">
                                {c1.mentorGuide.title}
                            </h2>
                            <p className="mt-2 text-base leading-[1.7] text-slate-200 md:text-[18px]">
                                {c1.mentorGuide.body}
                            </p>
                        </div>
                        <SpeakButton text={`${c1.mentorGuide.title}. ${c1.mentorGuide.body}`} className="mt-1 shrink-0" />
                    </div>
                </div>
            </section>

            {/* ══════════ Transparent Chat Lab ══════════ */}
            <section data-chapter1-transparent-chat className="relative mt-8 space-y-5 text-start md:mt-10" dir={dir}>
                <div className="flex items-center gap-3">
                    <ScanSearch size={24} className="text-cyan-400" />
                    <div>
                        <h2 className="text-2xl font-bold text-white">{c1.lab.title}</h2>
                        <div className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">{c1.lab.eyebrow}</div>
                    </div>
                </div>

                <div className="flex items-start gap-2.5">
                    <p className="flex items-start gap-2.5 text-base leading-relaxed text-slate-200">
                        <Eye size={18} className="mt-0.5 shrink-0 text-cyan-400" />
                        {c1.lab.intro}
                    </p>
                    <SpeakButton text={`${c1.lab.title}. ${c1.lab.intro}`} className="mt-1" />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <p className="rounded-2xl border border-cyan-400/20 bg-cyan-950/15 px-4 py-3 text-base leading-[1.65] text-slate-100">
                        {c1.lab.observationInstruction}
                    </p>
                    <p className="rounded-2xl border border-amber-400/20 bg-amber-950/10 px-4 py-3 text-base leading-[1.65] text-slate-200">
                        {c1.lab.simulationDisclosure}
                    </p>
                </div>

                {/* גשר-זיהוי אל מפת המבוא: רצועת 14 התחנות בדיוק בצבעי המפה, כדי שהלומד
                    יזהה "אלה התחנות שראיתי, עכשיו חיות". הרצועה נושאת משמעות (המשפט), לא
                    דקורציה בלבד. aria-hidden על הנקודות; המשמעות בטקסט. */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                    <span className="flex items-center gap-1" dir="ltr" aria-hidden>
                        {Object.values(STATION_PALETTE).map((s, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <span className="h-px w-1.5 bg-white/15" />}
                                <span className={`h-2 w-2 rounded-full ${s.solid}`} />
                            </React.Fragment>
                        ))}
                    </span>
                    <span className="text-sm font-bold text-slate-200 md:text-base">{c1.lab.mapBridge}</span>
                </div>

                <div className="relative">
                {/* aurora אמביינטי מאחורי שני החלונות - סטטי כדי להשאיר את המסך הראשי רגוע */}
                <div
                    aria-hidden
                    className={`pointer-events-none absolute -top-12 ${isRtl ? 'right-1/4' : 'left-1/4'} -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[110px]`}
                />
                <div
                    aria-hidden
                    className={`pointer-events-none absolute -bottom-12 ${isRtl ? 'left-1/4' : 'right-1/4'} -z-10 h-72 w-72 rounded-full bg-purple-500/10 blur-[110px]`}
                />
                <ExpandableLab title={c1.lab.panelTitle}>
                <TransparentLabLayout
                    accent={accent}
                    dir={dir}
                    tokens={isChat ? chat.tokens : agent.tokens}
                    chat={
                        <HoloFrame accent={accent}>
                            <ChatInterfacePanel
                                title={c1.lab.panelTitle}
                                subtitle={isChat ? c1.lab.chatSubtitle : c1.lab.agentSubtitle}
                                mode={mode}
                                onModeChange={handleModeChange}
                                messages={messages}
                                inputValue={inputValue}
                                onInputChange={setInputValue}
                                onSend={handleSend}
                                inputLabel={c1.lab.inputAriaLabel}
                                sendLabel={c1.lab.sendAriaLabel}
                                showModeToggle
                                isTyping={showTyping}
                                streaming={false}
                                live={false}
                                suggestions={SUGGESTIONS}
                                onSuggestion={handleSuggestion}
                                markedSuggestions={pauseSuggestions}
                                markLabel={viz.journey.pauseTag}
                                accent={accent}
                                highlightToken={hoverToken}
                                onTokenHover={setHoverToken}
                            />
                        </HoloFrame>
                    }
                    engine={
                        <HoloFrame accent={accent}>
                            <GlassEnginePanel
                                key={journeyKey}
                                title={isChat ? c1.panels.answerEngineTitle : c1.panels.actionEngineTitle}
                                subtitle={isChat ? c1.panels.chatEngineSubtitle : c1.panels.agentEngineSubtitle}
                                accent={accent}
                                replayKey={replayKey}
                                steps={engineSteps}
                                activeIndex={safeActiveStationIndex}
                                onActiveIndexChange={handleStationChange}
                                onReplayActive={handleReplayStation}
                                onResetJourney={handleResetJourney}
                                highlightToken={hoverToken}
                                onTokenHover={setHoverToken}
                            />
                        </HoloFrame>
                    }
                />
                </ExpandableLab>
                </div>

            </section>

            {/* ══════════ התובנה המרכזית של הפרק ══════════ */}
            <section data-chapter1-takeaway className="mt-10 rounded-2xl border border-indigo-400/25 bg-indigo-950/15 px-5 py-5 text-start md:px-7 md:py-6" dir={dir}>
                <div className="flex items-start gap-3">
                    <Lightbulb className="mt-1 shrink-0 text-indigo-300" size={22} aria-hidden />
                    <div className="min-w-0 max-w-4xl flex-1">
                        <div className="flex items-start justify-between gap-2.5">
                            <div>
                                <h2 className="text-[22px] font-black leading-tight text-indigo-200 md:text-[26px]">
                                    {c1.insightIdea.title}
                                </h2>
                                <p className="mt-2 text-base leading-[1.7] text-slate-100 md:text-[18px]">
                                    {c1.insightIdea.body}
                                </p>
                            </div>
                            <SpeakButton text={`${c1.insightIdea.title}. ${c1.insightIdea.body}`} className="shrink-0" />
                        </div>
                    </div>
                </div>
            </section>

            <section data-chapter1-summary className="mt-8 rounded-3xl border border-emerald-400/25 bg-emerald-950/15 p-6 text-start md:p-8" dir={dir}>
                <h2 className="text-[22px] font-black leading-tight text-white md:text-[26px]">{c.summary.title}</h2>
                <ol className="mt-5 max-w-4xl space-y-3 text-base leading-[1.7] text-slate-100 md:text-[17px]">
                    {c.summary.points.map((point, index) => (
                        <li key={point} className="flex gap-3"><CheckCircle2 className="mt-1 shrink-0 text-emerald-300" size={19} aria-hidden /><span><span className="sr-only">{index + 1}. </span>{point}</span></li>
                    ))}
                </ol>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section data-chapter1-quiz className="mt-10 mb-4" dir={dir}>
                <ExpandableLab title={localizedQuiz.title}>
                    {/* M10 F3 SELECTIVE RESPOND: המבדק חסר-דמות לחלוטין, כמו בכל 19 הפרקים.
                        אייקון הסטטוס נשאר בראש כרטיס התוצאה בשתי התוצאות, ומשפט התגובה
                        הספציפי לפרק מופיע מתחתיו כטקסט בלבד. */}
                    <AssessmentEngine
                        {...localizedQuiz}
                        conceptDisplayMap={quizText.conceptLabels}
                        mentorResponse={{ pass: c1.mentorRespond.quizPass, fail: c1.mentorRespond.quizFail }}
                    />
                </ExpandableLab>
            </section>
        </ChapterLayout>
    );
}
