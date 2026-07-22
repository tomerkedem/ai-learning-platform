"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Terminal, ScanSearch, ArrowDown, X, Layers, Eye, CircleAlert, CheckCircle2 } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine, type ReviewLink } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';
import { useT } from '@/i18n/useT';
import type { Chapter1QuizId } from '@/i18n/locales/he/behind-ai/chapter1Quiz';

import { TransparentLabLayout } from '@/components/ai-internals/TransparentLabLayout';
import { ChatInterfacePanel } from '@/components/ai-internals/ChatInterfacePanel';
import { Mentor } from '@/components/ai-internals/Mentor';
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

    // ── דוק האזנה מודרכת: מקטעי הקראה לפי מצב היקף, מאותם מפתחות מילון (ללא שכפול
    // קופי). לא נכללים: חידון, כפתורים/ניווט, צ׳יפים/באדג׳ים, משפטי מנטור, קופי coach,
    // הערות live/demo, ופלט חי של ארבע המעבדות. תוויות הדוק מ-aiInternals.readAloud.
    const ra = t.behindAi.aiInternals.readAloud;
    const c1Lede = `${c1.hero.ledeLead}${c1.hero.ledeHighlight}${c1.hero.ledeRest}`;
    const sTitle: ReadAloudSegment = { id: 'title', label: c1.hero.titleLead, text: `${c1.hero.titleLead} ${c1.hero.titleHighlight}. ${c1Lede}` };
    const sLabIntro: ReadAloudSegment = { id: 'lab-intro', label: c1.lab.title, text: `${c1.lab.title}. ${c1.lab.intro}` };
    const sFocus: ReadAloudSegment = { id: 'focus', label: c1.lab.focusHighlight, text: `${c1.lab.focusLead}${c1.lab.focusHighlight}${c1.lab.focusRest}` };
    // מבדק הפרק: המנגנון המשותף (correctAnswer, onComplete, getReviewLinks, nextHref...)
    // נשמר מ-quizData, וטקסט התצוגה ממוזג מהמילון לפי מזהה השאלה. quizData.ts לא משתנה.
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
    // הדרכת first-run: רמז עדין מאיפה להתחיל, נסגר בלחיצה כדי לא להפריע לחזרות.
    const [coachOpen, setCoachOpen] = useState(true);
    // חישוב חי: המנוע מנתח את מה שמקלידים (debounced), לא רק את מה שנשלח.
    const [liveText, setLiveText] = useState(DEFAULT_INPUT);
    // קישור חי: הטוקן שמרחפים עליו (בצ'אט או במנוע), להדגשה הדדית.
    const [hoverToken, setHoverToken] = useState<string | null>(null);

    // צ'אט חי: תשובת Claude אמיתית מוזרמת מהשרת. liveReply===null => משתמשים
    // בתשובת ה-mock הדטרמיניסטית. live = האם המנוע החי בכלל זמין (יש מפתח).
    const [live, setLive] = useState(false);
    const [liveReply, setLiveReply] = useState<string | null>(null);
    // ספירת טוקנים אמיתית מ-Claude (count_tokens) עבור הטקסט הנוכחי. null => לא זמין
    // (אין מפתח / כשל / אין טקסט). Claude לא חושף את החלוקה עצמה, רק את המספר.
    const [liveTokens, setLiveTokens] = useState<number | null>(null);
    const [streaming, setStreaming] = useState(false);
    const replyAbortRef = useRef<AbortController | null>(null);

    const isChat = mode === 'chat';
    const accent: Accent = isChat ? 'cyan' : 'purple';

    // המנוע הלימודי: תוצאה נגזרת מהטקסט שנשלח.
    const chat = useMemo(() => runChatEngine(conversationText), [conversationText]);
    const agent = useMemo(() => runAgentEngine(conversationText), [conversationText]);

    // רגע "עצור ושאל": ההצעות שגורמות למנוע לעצור (בכל אחד מהמצבים) מסומנות, ואחרי
    // ריצה בטוחה מנטור דוחף לנסות אותן. seenPause נדלק ברגע שהלומד חווה עצירה בפועל.
    // תלוי-מצב: מסומנות ההצעות שיגרמו לעצירה במצב הנוכחי. ב-Chat זו בעיקר בקשה עמומה,
    // ב-Agent גם פעולה רגישה ומידע חסר. הסימון "חי" ומתחלף עם המצב, ומראה שהם שונים.
    const pauseSuggestions = useMemo(
        () => SUGGESTIONS.filter((s) => isPauseOutcome(mode === 'chat' ? runChatEngine(s) : runAgentEngine(s), mode)),
        [SUGGESTIONS, mode],
    );
    const [seenPause, setSeenPause] = useState(false);
    const currentPause = isPauseOutcome(isChat ? chat : agent, mode);
    // הדחיפה מופיעה רק ב-Chat (שם המנוע עונה בביטחון), ומפנה למצב Agent - שם המנוע
    // עוצר ושואל או מבקש אישור. מעבר ל-Agent מדליק seenPause ומעלים אותה.
    const showPauseNudge = isChat && sendCount >= 1 && !currentPause && !seenPause;

    // חישוב חי (debounced): המנוע מנתח את מה שמקלידים כרגע, ובהיעדר הקלדה - את
    // המשפט האחרון שנשלח. setState ב-setTimeout (לא סינכרוני ב-effect) לכבוד ה-lint.
    useEffect(() => {
        const v = inputValue.trim();
        const id = setTimeout(() => setLiveText(v || conversationText), 220);
        return () => clearTimeout(id);
    }, [inputValue, conversationText]);

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
            setLiveText((cur) => (cur === prev ? DEFAULT_INPUT : cur));
        }, 0);
        return () => clearTimeout(id);
    }, [DEFAULT_INPUT]);

    // זיהוי יכולת פעם אחת: האם הצ'אט החי זמין (יש ANTHROPIC_API_KEY בשרת).
    useEffect(() => {
        let cancelled = false;
        fetch('/api/chat-reply')
            .then((r) => (r.ok ? r.json() : { live: false }))
            .then((d) => { if (!cancelled) setLive(!!d.live); })
            .catch(() => { if (!cancelled) setLive(false); });
        return () => { cancelled = true; };
    }, []);

    // מייצר את תשובת הצ'אט. במצב חי: מזרים תשובת Claude אמיתית טוקן-אחר-טוקן.
    // אחרת (או בכשל/קטיעה): liveReply=null והתצוגה נופלת לתשובת ה-mock.
    const generateReply = useCallback(async (text: string, m: FlowMode) => {
        replyAbortRef.current?.abort(); // קטע זרם קודם אם עוד רץ

        const t = text.trim();
        if (!live || !t) {
            setStreaming(false);
            setLiveReply(null);
            return;
        }

        const ac = new AbortController();
        replyAbortRef.current = ac;
        setStreaming(true);
        setLiveReply('');

        try {
            const res = await fetch('/api/chat-reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // ה-locale הפעיל נשלח לשרת כך שהמודל החי עונה בשפת הממשק הנבחרת,
                // ולא לפי שפת הקלט של המשתמש.
                body: JSON.stringify({ text: t, mode: m, locale }),
                signal: ac.signal,
            });
            if (!res.ok || !res.body) throw new Error('chat-reply unavailable');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let acc = '';
            for (;;) {
                const { done, value } = await reader.read();
                if (done) break;
                acc += decoder.decode(value, { stream: true });
                setLiveReply(acc);
            }
            setStreaming(false);
        } catch (err) {
            if ((err as Error).name === 'AbortError') return; // זרם הוחלף - אל תיגע במצב
            setStreaming(false);
            setLiveReply(null); // נפילה חיננית לתשובת ה-mock
        }
    }, [live, locale]);

    // ספירת טוקנים אמיתית מ-Claude עבור אותו טקסט שהמנוע מציג. רק במצב חי, ו-debounced
    // כדי לא להציף את ה-API בכל הקלדה. הספירה היא מספר אמיתי; את החלוקה עצמה Claude
    // לא חושף, ולכן הלוח נשאר מבוסס-מילים והמספר הזה מוצג לצדו כהשוואה.
    useEffect(() => {
        const t = liveText.trim();
        if (!live || !t) { setLiveTokens(null); return; }
        let cancelled = false;
        const ac = new AbortController();
        const id = setTimeout(() => {
            fetch('/api/count-tokens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: t }),
                signal: ac.signal,
            })
                .then((r) => (r.ok ? r.json() : null))
                .then((d) => { if (!cancelled && d && typeof d.tokens === 'number') setLiveTokens(d.tokens); })
                .catch(() => { /* כשל/קטיעה: פשוט לא מציגים ספירה חיה */ });
        }, 280);
        return () => { cancelled = true; ac.abort(); clearTimeout(id); };
    }, [live, liveText]);

    // התחנות המרכזיות של המנוע השקוף - שיקוף כן של אותה ריצה (חיה), מקובץ למערכות.
    const engineSteps = useMemo(
        () => (isChat ? traceChatEngine(liveText, viz) : traceAgentEngine(liveText, viz)),
        [isChat, liveText, viz],
    );

    // מפתח הפעלה: כל שליחה / החלפת מצב מנגנת מחדש את רצף ההידלקות.
    const replayKey = `${mode}:${conversationText}:${sendCount}`;

    // אינדיקטור הקלדה: כל שינוי מתחיל "הקלדה" (ב-handlers) שמתפוגגת אחרי רגע.
    useEffect(() => {
        const t = setTimeout(() => setIsTyping(false), 850);
        return () => clearTimeout(t);
    }, [conversationText, mode, sendCount]);

    // תשובת ה-AI: התשובה החיה (אם קיימת) גוברת על תשובת ה-mock. תשובת ה-mock נפתרת
    // מהמילון לפי מפתח התשובה שהמנוע הטהור החזיר.
    const mockReply = isChat ? viz.mockEngine.chatReplies[chat.replyKey] : viz.mockEngine.agentReplies[agent.replyKey];
    const replyText = liveReply !== null ? liveReply : mockReply;
    // אינדיקטור ההקלדה: במצב חי (streaming) מציגים נקודות רק עד שמגיע הטוקן הראשון,
    // בלי תלות בטיימר ה-850ms של ה-mock. במצב mock: לפי הטיימר הרגיל.
    const showTyping = streaming
        ? liveReply === ''
        : liveReply === null
            ? isTyping
            : false;

    // id כולל את sendCount כדי שכל שליחה חדשה תנפיש כניסה, אבל צמיחת טוקנים
    // באותה שליחה לא תרמאונט את הבועה (הזרמה חלקה).
    const messages = useMemo<ChatMessage[]>(() => [
        { id: `user-${sendCount}`, role: 'user', text: conversationText },
        { id: `ai-${sendCount}`, role: 'ai', text: replyText },
    ], [conversationText, sendCount, replyText]);

    const sMentor: ReadAloudSegment = { id: 'mentor', label: c1.mentor.peek, text: `${c1.mentor.peek} ${c1.coach.start}${c1.coach.body}` };
    const sRequest: ReadAloudSegment = { id: 'active-request', label: c.interaction.selectedLabel, text: `${c.interaction.selectedLabel}: ${conversationText}. ${c.interaction.resultLabel}: ${replyText}` };
    const sJourney: ReadAloudSegment = { id: 'journey', label: c1.lab.mapBridge, text: engineSteps.map((step) => `${step.title}. ${step.note}`).join(' ') };
    const sTakeaway: ReadAloudSegment = { id: 'takeaway', label: c1.insightIdea.title, text: c1.insightIdea.body };
    const sThreePointSummary: ReadAloudSegment = { id: 'three-point-summary', label: c.summary.title, text: `${c.summary.title}. ${c.summary.points.join(' ')}` };
    const sQuizIntro: ReadAloudSegment = { id: 'quiz-intro', label: quizText.title, text: `${quizText.title}. ${quizText.subtitle}` };
    const readAloudByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
        short: [sTitle, sMentor, sRequest, sTakeaway, sThreePointSummary, sQuizIntro],
        regular: [sTitle, sMentor, sLabIntro, sRequest, sJourney, sTakeaway, sThreePointSummary, sQuizIntro],
        full: [sTitle, sMentor, sLabIntro, sFocus, sRequest, sJourney, sTakeaway, sThreePointSummary, sQuizIntro],
    };

    const commit = (text: string) => {
        const next = text.trim();
        if (!next) return;
        setIsTyping(true);
        setConversationText(next);
        setLiveText(next); // עדכון מיידי כדי שהמנוע יהיה עקבי עם השליחה, בלי המתנה ל-debounce
        setSendCount((c) => c + 1);
        setCoachOpen(false); // אחרי האינטראקציה הראשונה, הדרכת ה-first-run מסתיימת
        if (isPauseOutcome(mode === 'chat' ? runChatEngine(next) : runAgentEngine(next), mode)) setSeenPause(true);
        generateReply(next, mode); // תשובה חיה (או נפילה ל-mock)
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
        if (isPauseOutcome(m === 'chat' ? runChatEngine(conversationText) : runAgentEngine(conversationText), m)) setSeenPause(true);
        generateReply(conversationText, m); // החלפת מצב מייצרת תשובה מתאימה מחדש
    };

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={1}>

            {/* ══════════ HERO ══════════ */}
            <div className="relative">
            <motion.section
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
            {/* המנטור מזמין להציץ פנימה - צמוד לקצה החיצוני של הכרטיס (xl+), תלוי-כיוון */}
            <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-full ml-3 2xl:ml-6' : 'right-full mr-3 2xl:mr-6'} z-20 hidden xl:block pointer-events-none`}>
              <Mentor pose="peek" line={c1.mentor.peek} width={263} flip={!isRtl} />
            </div>
            </div>

            {/* דוק האזנה מודרכת צף: מצמיד לקצה החיצוני (תלוי-כיוון) ונשאר נגיש תוך כדי גלילה */}
            <FloatingReadAloud dir={dir}>
                <ReadAloudControls
                    key={`${locale}:${mode}:${conversationText}`}
                    segmentsByMode={readAloudByMode}
                    lang={LOCALE_SPEECH_LANG[locale]}
                    locale={locale}
                    dir={dir}
                    labels={ra}
                    reduce={!!reduce}
                    compact
                />
            </FloatingReadAloud>

            {/* ══════════ מנטור מלווה + first-run: הכוונה אופרטיבית אל המעבדה שמתחת ══════════ */}
            <AnimatePresence>
                {coachOpen && (
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 flex items-center gap-4 overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-900/10 p-4"
                        dir={dir}
                    >
                        <div className="-my-2 shrink-0">
                            <Mentor pose="think" width={138} float={false} glow={false} flip={!isRtl} />
                        </div>
                        <div className="flex-1 text-sm leading-relaxed text-slate-200">
                            <span className="font-bold text-emerald-300">{c1.coach.start}</span>
                            {c1.coach.body}
                        </div>
                        <ArrowDown size={18} className="hidden shrink-0 animate-bounce text-emerald-300 sm:block" aria-hidden />
                        <button
                            type="button"
                            onClick={() => setCoachOpen(false)}
                            aria-label={c1.coach.closeAria}
                            className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            <X size={15} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══════════ Transparent Chat Lab ══════════ */}
            <section className="relative mt-12 space-y-5 text-start" dir={dir}>
                <div className="flex items-center gap-3">
                    <ScanSearch size={24} className="text-cyan-400" />
                    <div>
                        <h3 className="text-2xl font-bold text-white">{c1.lab.title}</h3>
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
                                showModeToggle
                                isTyping={showTyping}
                                streaming={streaming}
                                live={live}
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
                                title={isChat ? c1.panels.answerEngineTitle : c1.panels.actionEngineTitle}
                                subtitle={isChat ? c1.panels.chatEngineSubtitle : c1.panels.agentEngineSubtitle}
                                accent={accent}
                                replayKey={replayKey}
                                steps={engineSteps}
                                liveTokenCount={live ? liveTokens : null}
                                highlightToken={hoverToken}
                                onTokenHover={setHoverToken}
                            />
                        </HoloFrame>
                    }
                />
                </ExpandableLab>
                </div>

                <p className="text-slate-300 text-base leading-relaxed">
                    {c1.lab.focusLead}<span className="text-white font-semibold">{c1.lab.focusHighlight}</span>{c1.lab.focusRest}
                </p>

                <p className="text-xs leading-relaxed text-slate-500">
                    {live ? c1.lab.liveNote : c1.lab.demoNote}
                </p>
                {/* מנטור פרק 1 צמוד לקצה החיצוני של כרטיס הצ'אט השקוף (2xl בלבד - רק שם יש
                    מרווח בין הלוח לסרגל הניווט); תלוי-כיוון: חושף את המנוע מבפנים */}
                <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-full ml-4' : 'right-full mr-4'} z-20 hidden 2xl:block pointer-events-none`}>
                  <Mentor pose="holographic" line={c1.mentor.holographic} width={400} fallbackSrc="/assets/mentor-inspect.png" flip={!isRtl} />
                </div>
            </section>

            {/* ══════════ דחיפת "עצור ושאל": שיא הפרק, מאופציונלי לנחווה ══════════ */}
            {/* אחרי ריצה בטוחה, המנטור מזמין לנסות בקשה שגורמת למנוע לעצור ולשאול או */}
            {/* לבקש אישור. נעלם ברגע שהלומד חווה עצירה בפועל (seenPause). */}
            <AnimatePresence>
                {showPauseNudge && (
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-8 flex items-center gap-4 overflow-hidden rounded-2xl border border-amber-500/30 bg-amber-900/10 p-4"
                        dir={dir}
                    >
                        <div className="-my-2 shrink-0">
                            <Mentor pose="think" width={138} float={false} glow={false} flip={!isRtl} />
                        </div>
                        <div className="flex-1 text-sm leading-relaxed text-slate-200">
                            <span className="font-bold text-amber-300">{viz.journey.pauseNudge.start}</span>{' '}
                            {viz.journey.pauseNudge.body}
                        </div>
                        <CircleAlert size={18} className="hidden shrink-0 text-amber-300 sm:block" aria-hidden />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══════════ התובנה המרכזית של הפרק ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <InsightBox type="intuition" title={c1.insightIdea.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block">{c1.insightIdea.body}</span>
                        <SpeakButton text={`${c1.insightIdea.title}. ${c1.insightIdea.body}`} />
                    </div>
                </InsightBox>
            </section>

            <section className="mt-12 rounded-3xl border border-emerald-400/25 bg-emerald-950/15 p-6 text-start md:p-8" dir={dir}>
                <h2 className="text-2xl font-black text-white">{c.summary.title}</h2>
                <ol className="mt-5 space-y-3">
                    {c.summary.points.map((point, index) => (
                        <li key={point} className="flex gap-3 text-slate-200"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={19} aria-hidden /><span><span className="sr-only">{index + 1}. </span>{point}</span></li>
                    ))}
                </ol>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-10 mb-4" dir={dir}>
                <ExpandableLab title={localizedQuiz.title}>
                    <AssessmentEngine {...localizedQuiz} conceptDisplayMap={quizText.conceptLabels} />
                </ExpandableLab>
            </section>
        </ChapterLayout>
    );
}
