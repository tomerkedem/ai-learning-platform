"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Terminal, ScanSearch, ArrowDown, ScanLine, GitCompare, X, Layers, ChevronDown, Eye, ListChecks } from 'lucide-react';

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
import type { ReadAloudSegment } from '@/components/ai-internals/useReadAloud';
import { LOCALE_SPEECH_LANG } from '@/components/ai-internals/readAloudLang';
import type { Accent, ChatMessage, FlowMode } from '@/components/ai-internals/types';

import { runChatEngine, runAgentEngine } from './mockEngine';
import { traceChatEngine, traceAgentEngine } from './engineTrace';
import { GlassEnginePanel } from './GlassEnginePanel';
import { HoloFrame } from './HoloFrame';
import { ReadHeadLab } from './ReadHeadLab';
import { ExpandableLab } from '@/components/ai-internals/ExpandableLab';
import { PredictDecision } from './PredictDecision';
import { CounterfactualDiff } from './CounterfactualDiff';
// גשר-זיהוי: אותם צבעי 14 התחנות של מפת המבוא, כדי לקשר את המעבדה החיה למפה.
import { STATION_PALETTE } from '@/components/ai-internals/IntroStationViz';

export default function BehindTheScenesChapter1() {
    const reduce = useReducedMotion();
    const { t, dir, locale } = useT();
    const isRtl = dir === 'rtl';
    const c1 = t.behindAi.chapter1;
    const viz = c1.visuals;

    // ── דוק האזנה מודרכת: מקטעי הקראה לפי מצב היקף, מאותם מפתחות מילון (ללא שכפול
    // קופי). לא נכללים: חידון, כפתורים/ניווט, צ׳יפים/באדג׳ים, משפטי מנטור, קופי coach,
    // הערות live/demo, ופלט חי של ארבע המעבדות. תוויות הדוק מ-aiInternals.readAloud.
    const ra = t.behindAi.aiInternals.readAloud;
    const c1Lede = `${c1.hero.ledeLead}${c1.hero.ledeHighlight}${c1.hero.ledeRest}`;
    const c1Deep2 = `${c1.deep.intro2Lead}Chat${c1.deep.intro2Mid}Agent${c1.deep.intro2Tail}`;
    const sTitle: ReadAloudSegment = { id: 'title', label: c1.hero.titleLead, text: `${c1.hero.titleLead} ${c1.hero.titleHighlight}. ${c1Lede}` };
    const sLabIntro: ReadAloudSegment = { id: 'lab-intro', label: c1.lab.title, text: `${c1.lab.title}. ${c1.lab.intro}` };
    const sFocus: ReadAloudSegment = { id: 'focus', label: c1.lab.focusHighlight, text: `${c1.lab.focusLead}${c1.lab.focusHighlight}${c1.lab.focusRest}` };
    const sInsight: ReadAloudSegment = { id: 'insight', label: c1.insightIdea.title, text: c1.insightIdea.body };
    const sDeep1: ReadAloudSegment = { id: 'deep-1', label: c1.deep.intro1, text: c1.deep.intro1 };
    const sDeep2: ReadAloudSegment = { id: 'deep-2', label: c1Deep2, text: c1Deep2 };
    const sLabs: ReadAloudSegment[] = [c1.labs.readHead, c1.labs.causality].map((lab, i) => ({ id: `lab-${i}`, label: lab.title, text: lab.title }));
    const sUnderstand: ReadAloudSegment = { id: 'understand', label: c1.summary.understandTitle, text: c1.summary.understandBody };
    const sRule: ReadAloudSegment = { id: 'rule', label: c1.summary.ruleTitle, text: c1.summary.ruleBody };
    const sBq1: ReadAloudSegment = { id: 'bq-1', label: c1.beforeQuiz.point1Lead, text: `${c1.beforeQuiz.point1Lead}${c1.beforeQuiz.point1Body}` };
    const sBq2: ReadAloudSegment = { id: 'bq-2', label: c1.beforeQuiz.point2Lead, text: `${c1.beforeQuiz.point2Lead}${c1.beforeQuiz.point2BeforeChat}Chat${c1.beforeQuiz.point2AfterChat}Agent${c1.beforeQuiz.point2AfterAgent}` };
    const sBq3: ReadAloudSegment = { id: 'bq-3', label: c1.beforeQuiz.point3Lead, text: `${c1.beforeQuiz.point3Lead}${c1.beforeQuiz.point3Body}` };

    const readAloudByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
        short: [sTitle, sLabIntro, sInsight, sRule],
        regular: [sTitle, sLabIntro, sFocus, sInsight, sDeep1, ...sLabs, sUnderstand, sRule],
        full: [sTitle, sLabIntro, sFocus, sInsight, sDeep1, sDeep2, ...sLabs, sUnderstand, sRule, sBq1, sBq2, sBq3],
    };

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
    // חשיפה הדרגתית: שכבת העומק (קריאה חיה, חוגת ביטחון, סיבתיות, פיצול) סגורה
    // כברירת מחדל. פרק 1 נפתח נקי - התשובה והדרך שמאחוריה בלבד - והפרטים נפתחים בבחירה.
    const [deepOpen, setDeepOpen] = useState(false);
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

    const commit = (text: string) => {
        const next = text.trim();
        if (!next) return;
        setIsTyping(true);
        setConversationText(next);
        setLiveText(next); // עדכון מיידי כדי שהמנוע יהיה עקבי עם השליחה, בלי המתנה ל-debounce
        setSendCount((c) => c + 1);
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
        generateReply(conversationText, m); // החלפת מצב מייצרת תשובה מתאימה מחדש
    };
    // פתיחה/סגירה של שכבת העומק. מתג ה-Chat/Agent זמין ישירות במסך הראשי, לכן
    // סגירת שכבת העומק אינה מאפסת את המצב שהלומד בחר.
    const toggleDeep = () => setDeepOpen((open) => !open);

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

                    <p className="text-lg text-slate-300 leading-relaxed">
                        {c1.hero.ledeLead}
                        <span className="text-white font-semibold">{c1.hero.ledeHighlight}</span>{c1.hero.ledeRest}
                    </p>

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
                            <Mentor pose="think" width={92} float={false} glow={false} flip={!isRtl} />
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

                <p className="flex items-start gap-2.5 text-base leading-relaxed text-slate-200">
                    <Eye size={18} className="mt-0.5 shrink-0 text-cyan-400" />
                    {c1.lab.intro}
                </p>

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

            {/* ══════════ התובנה המרכזית של הפרק ══════════ */}
            <section className="mt-12 text-start" dir={dir}>
                <InsightBox type="intuition" title={c1.insightIdea.title}>
                    {c1.insightIdea.body}
                </InsightBox>
            </section>

            {/* ══════════ חשיפה הדרגתית: שער אל שכבת העומק ══════════ */}
            <section className="mt-10 text-center" dir={dir}>
                <button
                    type="button"
                    onClick={toggleDeep}
                    aria-expanded={deepOpen}
                    className="group inline-flex items-center gap-3 rounded-2xl border border-cyan-500/40 bg-cyan-900/15 px-6 py-3.5 text-base font-bold text-cyan-200 transition-colors hover:border-cyan-400/60 hover:bg-cyan-900/25"
                >
                    <Layers size={18} className="text-cyan-300" />
                    {deepOpen ? c1.deep.toggleOpen : c1.deep.toggleClosed}
                    <ChevronDown
                        size={18}
                        className={`text-cyan-300 transition-transform ${deepOpen ? 'rotate-180' : ''}`}
                    />
                </button>
                {!deepOpen && (
                    <p className="mt-3 text-base text-slate-300">
                        {c1.deep.hint}
                    </p>
                )}
            </section>

            {/* ══════════ שכבת העומק (חשיפה הדרגתית) ══════════ */}
            <AnimatePresence initial={false}>
            {deepOpen && (
            <motion.div
                key="deep-layer"
                initial={reduce ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
            >
            <p className="mt-8 flex items-start gap-2.5 text-lg leading-relaxed text-slate-200" dir={dir}>
                <ScanSearch size={20} className="mt-1 shrink-0 text-cyan-400" />
                {c1.deep.intro1}
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-300" dir={dir}>
                {c1.deep.intro2Lead}<span className="text-cyan-300 font-semibold">Chat Mode</span>{c1.deep.intro2Mid}<span className="text-purple-300 font-semibold">Agent Mode</span>{c1.deep.intro2Tail}
            </p>

            {/* ══════════ מעבדה 1 · Read Head ══════════ */}
            <section className="mt-12 space-y-5 text-start" dir={dir}>
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-600/50 bg-slate-800/60 font-mono text-base font-black text-slate-200">1</span>
                    <ScanLine size={24} className={isChat ? 'text-cyan-400' : 'text-purple-400'} />
                    <div>
                        <div className={`text-xs font-bold uppercase tracking-[0.25em] ${isChat ? 'text-cyan-400' : 'text-purple-400'}`}>{c1.labs.readHead.eyebrow}</div>
                        <h3 className="text-2xl font-bold text-white">{c1.labs.readHead.title}</h3>
                    </div>
                </div>

                <PredictDecision key={`predict:${mode}`} mode={mode} />

                <ExpandableLab>
                    <ReadHeadLab key={`${mode}:${conversationText}`} text={conversationText} mode={mode} accent={accent} />
                </ExpandableLab>
            </section>

            {/* ══════════ מעבדה 2 · Causality (Counterfactual) ══════════ */}
            <section className="mt-12 space-y-5 text-start" dir={dir}>
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-600/50 bg-slate-800/60 font-mono text-base font-black text-slate-200">2</span>
                    <GitCompare size={24} className={isChat ? 'text-cyan-400' : 'text-purple-400'} />
                    <div>
                        <div className={`text-xs font-bold uppercase tracking-[0.25em] ${isChat ? 'text-cyan-400' : 'text-purple-400'}`}>{c1.labs.causality.eyebrow}</div>
                        <h3 className="text-2xl font-bold text-white">{c1.labs.causality.title}</h3>
                    </div>
                </div>

                <CounterfactualDiff key={`cf:${mode}`} mode={mode} accent={accent} />
            </section>

            {/* ══════════ סיכום ══════════ */}
            <section className="mt-12 space-y-4 text-start" dir={dir}>
                <InsightBox type="intuition" title={c1.summary.understandTitle}>
                    {c1.summary.understandBody}
                </InsightBox>
                <InsightBox type="warning" title={c1.summary.ruleTitle}>
                    {c1.summary.ruleBody}
                </InsightBox>
            </section>
            </motion.div>
            )}
            </AnimatePresence>

            {/* ══════════ לפני המבדק: עיגון מושגי הליבה בזרימה הראשית ══════════ */}
            {/* גם מי שלא פתח את שכבת העומק רואה כאן את שלושת הרעיונות שהמבדק בודק. */}
            <section className="mt-16 text-start" dir={dir}>
                <div className="rounded-[1.75rem] border border-cyan-500/30 bg-gradient-to-b from-slate-900/70 to-slate-950/60 p-6 md:p-7">
                    <div className="mb-4 flex items-center gap-2.5">
                        <ListChecks size={20} className="text-cyan-300" />
                        <h3 className="text-xl font-bold text-white">{c1.beforeQuiz.title}</h3>
                    </div>
                    <ul className="space-y-3.5">
                        <li className="flex gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 font-bold text-cyan-300">1</span>
                            <p className="text-base leading-relaxed text-slate-200">
                                <span className="font-bold text-white">{c1.beforeQuiz.point1Lead}</span>{c1.beforeQuiz.point1Body}
                            </p>
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 font-bold text-cyan-300">2</span>
                            <p className="text-base leading-relaxed text-slate-200">
                                <span className="font-bold text-white">{c1.beforeQuiz.point2Lead}</span>{c1.beforeQuiz.point2BeforeChat}<span className="font-semibold text-cyan-300">Chat</span>{c1.beforeQuiz.point2AfterChat}<span className="font-semibold text-purple-300">Agent</span>{c1.beforeQuiz.point2AfterAgent}
                            </p>
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 font-bold text-cyan-300">3</span>
                            <p className="text-base leading-relaxed text-slate-200">
                                <span className="font-bold text-white">{c1.beforeQuiz.point3Lead}</span>{c1.beforeQuiz.point3Body}
                            </p>
                        </li>
                    </ul>
                    {!deepOpen && (
                        <p className="mt-4 text-sm leading-relaxed text-slate-400">
                            {c1.beforeQuiz.footnoteLead}<span className="font-semibold text-cyan-300">{c1.beforeQuiz.footnoteHighlight}</span>{c1.beforeQuiz.footnoteTail}
                        </p>
                    )}
                </div>
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
