"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Terminal, ScanSearch, ArrowDown, ScanLine, SlidersHorizontal, GitCompare, Split, X, Layers, ChevronDown, Eye, ListChecks } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { ChapterQuiz } from '../ChapterQuiz';
import { InsightBox } from '@/components/content/InsightBox';

import { TransparentLabLayout } from '@/components/ai-internals/TransparentLabLayout';
import { ChatInterfacePanel } from '@/components/ai-internals/ChatInterfacePanel';
import { Mentor } from '@/components/ai-internals/Mentor';
import type { Accent, ChatMessage, FlowMode } from '@/components/ai-internals/types';

import { runChatEngine, runAgentEngine } from './mockEngine';
import { traceChatEngine, traceAgentEngine } from './engineTrace';
import { GlassEnginePanel } from './GlassEnginePanel';
import { HoloFrame } from './HoloFrame';
import { ReadHeadLab } from './ReadHeadLab';
import { PredictDecision } from './PredictDecision';
import { ConfidenceDial } from './ConfidenceDial';
import { CounterfactualDiff } from './CounterfactualDiff';
import { ForkView } from './ForkView';

const DEFAULT_INPUT = 'החבילה לא הגיעה';

const SUGGESTIONS = [
    'החבילה לא הגיעה',
    'איפה החבילה שלי?',
    'בדוק את החבילה 123456789',
    'שלח ללקוח שהחבילה אבדה',
    'תטפל בזה',
];

export default function BehindTheScenesChapter1() {
    const reduce = useReducedMotion();

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
                body: JSON.stringify({ text: t, mode: m }),
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
    }, [live]);

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
        () => (isChat ? traceChatEngine(liveText) : traceAgentEngine(liveText)),
        [isChat, liveText],
    );

    // מפתח הפעלה: כל שליחה / החלפת מצב מנגנת מחדש את רצף ההידלקות.
    const replayKey = `${mode}:${conversationText}:${sendCount}`;

    // אינדיקטור הקלדה: כל שינוי מתחיל "הקלדה" (ב-handlers) שמתפוגגת אחרי רגע.
    useEffect(() => {
        const t = setTimeout(() => setIsTyping(false), 850);
        return () => clearTimeout(t);
    }, [conversationText, mode, sendCount]);

    // תשובת ה-AI: התשובה החיה (אם קיימת) גוברת על תשובת ה-mock.
    const mockReply = isChat ? chat.reply : agent.reply;
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
    // פתיחה/סגירה של שכבת העומק. סגירה מחזירה את המעבדה ל-Chat נקי (מתג ה-Agent
    // חי רק בתוך שכבת העומק), כדי שהמסך הראשי יישאר ממוקד.
    const toggleDeep = () => {
        if (deepOpen && mode !== 'chat') {
            setMode('chat');
            generateReply(conversationText, 'chat');
        }
        setDeepOpen((open) => !open);
    };

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={1}>

            {/* ══════════ HERO ══════════ */}
            <div className="relative">
            <motion.section
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 text-right"
                dir="rtl"
            >
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-purple-500/10 blur-[90px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-cyan-500/30 mb-5">
                        <Terminal size={14} className="text-cyan-400" />
                        <span className="font-mono text-xs tracking-widest uppercase text-cyan-300">Behind the Scenes · 01</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        מה באמת קורה בין{' '}
                        <span className="bg-gradient-to-l from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                            השאלה לתשובה
                        </span>
                        ?
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        כתבו משפט אחד. מימין הצ&apos;אט נראה רגיל, בדיוק כמו בכל אפליקציה. משמאל נפתחת
                        <span className="text-white font-semibold"> הדרך שמאחורי התשובה</span>: המנוע מראה איך הוא
                        קורא את המשפט ומגיע להחלטה. לעת עתה רק תסתכלו, אין צורך להבין כל מספר. את העומק
                        נפתח בהמשך, שלב אחר שלב.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <Terminal size={14} className="text-cyan-400" /> מימין: התשובה שאתם רואים
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <ScanSearch size={14} className="text-cyan-400" /> משמאל: הדרך שמאחורי התשובה
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Layers size={14} className="text-purple-400" /> בהמשך: נפתח כל שלב לעומק
                        </span>
                    </div>
                </div>
            </motion.section>
            {/* המנטור מזמין להציץ פנימה - תלוי מימין לכרטיס (xl+) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
              <Mentor pose="peek" line="הצצה ראשונה אל תוך המנוע 👀" width={175} />
            </div>
            </div>

            {/* ══════════ מנטור מלווה + first-run: הכוונה אופרטיבית אל המעבדה שמתחת ══════════ */}
            <AnimatePresence>
                {coachOpen && (
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 flex items-center gap-4 overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-900/10 p-4"
                        dir="rtl"
                    >
                        <div className="-my-2 shrink-0">
                            <Mentor pose="think" width={92} float={false} glow={false} />
                        </div>
                        <div className="flex-1 text-sm leading-relaxed text-slate-200">
                            <span className="font-bold text-emerald-300">התחילו כאן: </span>
                            כתבו משפט משלכם במעבדה שמתחת, או בחרו דוגמה מהירה.
                        </div>
                        <ArrowDown size={18} className="hidden shrink-0 animate-bounce text-emerald-300 sm:block" aria-hidden />
                        <button
                            type="button"
                            onClick={() => setCoachOpen(false)}
                            aria-label="סגירת ההדרכה"
                            className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            <X size={15} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══════════ Transparent Chat Lab ══════════ */}
            <section className="relative mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <ScanSearch size={24} className="text-cyan-400" />
                    <div>
                        <h3 className="text-2xl font-bold text-white">הצ&apos;ט השקוף</h3>
                        <div className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Transparent Chat Lab</div>
                    </div>
                </div>

                <p className="flex items-start gap-2.5 text-base leading-relaxed text-slate-200">
                    <Eye size={18} className="mt-0.5 shrink-0 text-cyan-400" />
                    כאן רואים שיש דרך מאחורי התשובה: מימין התשובה כרגיל, ומשמאל הדרך שהובילה אליה.
                </p>

                <div className="relative">
                {/* aurora אמביינטי מאחורי שני החלונות - סטטי כדי להשאיר את המסך הראשי רגוע */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-12 right-1/4 -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[110px]"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-12 left-1/4 -z-10 h-72 w-72 rounded-full bg-purple-500/10 blur-[110px]"
                />
                <TransparentLabLayout
                    accent={accent}
                    tokens={isChat ? chat.tokens : agent.tokens}
                    chat={
                        <HoloFrame accent={accent}>
                            <ChatInterfacePanel
                                title="Transparent Chat Lab"
                                subtitle={isChat ? 'Chat Mode · שיחה' : 'Agent Mode · משימה'}
                                mode={mode}
                                onModeChange={handleModeChange}
                                messages={messages}
                                inputValue={inputValue}
                                onInputChange={setInputValue}
                                onSend={handleSend}
                                showModeToggle={deepOpen}
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
                                title={isChat ? 'Answer Engine' : 'Action Decision Engine'}
                                subtitle={isChat ? 'בחירת תשובה · תחנות מרכזיות' : 'החלטת פעולה · תחנות מרכזיות'}
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
                </div>

                <p className="text-slate-300 text-base leading-relaxed">
                    הסתכלו קודם על <span className="text-white font-semibold">ההחלטה</span>, לא על כל המספרים.
                    המנוע משמאל מראה שיש מסלול שלם בין השאלה לתשובה. הפרטים המלאים ייפתחו בהמשך הלומדה.
                </p>

                <p className="text-xs leading-relaxed text-slate-500">
                    {live
                        ? 'התשובה בצ׳אט נכתבת על ידי מודל אמיתי (Claude) בזמן אמת, מילה אחר מילה - בדיוק הלולאה האוטו-רגרסיבית. הלוח מימין נשאר המחשה לימודית: ה-API לא חושף את ההסתברויות הפנימיות של המודל.'
                        : 'מצב דמו: התשובות בצ׳אט מתוסרטות וקבועות. הגדרת ANTHROPIC_API_KEY בשרת מפעילה מודל אמיתי שכותב את התשובה חי, מילה אחר מילה.'}
                </p>
                {/* מנטור פרק 1 צמוד לכרטיס הצ'אט השקוף (2xl בלבד - רק שם יש מרווח בין הלוח
                    לסרגל הניווט מימין; ב-xl הסרגל מכסה את הדמות): חושף את המנוע מבפנים */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-4 z-20 hidden 2xl:block pointer-events-none">
                  <Mentor pose="holographic" line="כאן נפתח המנוע מבפנים" width={200} fallbackSrc="/assets/mentor-inspect.png" />
                </div>
            </section>

            {/* ══════════ התובנה המרכזית של הפרק ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <InsightBox type="intuition" title="הרעיון של הפרק">
                    תשובה בצ&apos;אט היא רק הקצה הגלוי של תהליך נסתר. מאחורי כל תשובה רץ מסלול,
                    ואת המסלול הזה אפשר לפתוח שלב אחר שלב. זה בדיוק מה שהלומדה הזו תעשה: תלמד את הדרך
                    שמאחורי התשובה, בהדרגה. עדיין לא צריך להבין כל מנגנון - מספיק להבין שהדרך קיימת, ושאפשר לפתוח אותה.
                </InsightBox>
            </section>

            {/* ══════════ חשיפה הדרגתית: שער אל שכבת העומק ══════════ */}
            <section className="mt-10 text-center" dir="rtl">
                <button
                    type="button"
                    onClick={toggleDeep}
                    aria-expanded={deepOpen}
                    className="group inline-flex items-center gap-3 rounded-2xl border border-cyan-500/40 bg-cyan-900/15 px-6 py-3.5 text-base font-bold text-cyan-200 transition-colors hover:border-cyan-400/60 hover:bg-cyan-900/25"
                >
                    <Layers size={18} className="text-cyan-300" />
                    {deepOpen ? 'סגרו את שכבת העומק' : 'פתחו את המנוע המלא'}
                    <ChevronDown
                        size={18}
                        className={`text-cyan-300 transition-transform ${deepOpen ? 'rotate-180' : ''}`}
                    />
                </button>
                {!deepOpen && (
                    <p className="mt-3 text-base text-slate-300">
                        כאן נפתחים הכלים המתקדמים: קריאה חיה, חוגת ביטחון, סיבתיות והשוואת מנועים. אפשר לחקור בקצב שלכם.
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
            <p className="mt-8 flex items-start gap-2.5 text-lg leading-relaxed text-slate-200" dir="rtl">
                <ScanSearch size={20} className="mt-1 shrink-0 text-cyan-400" />
                ראו שכבת עומק: מכאן זה נעשה טכני יותר. לפניכם ארבע מעבדות ממוספרות, כל אחת מראה זווית אחרת של אותו מסלול. אין צורך לסיים הכול ברצף.
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-300" dir="rtl">
                ב-<span className="text-cyan-300 font-semibold">Chat Mode</span> המערכת בוחרת תשובה.
                ב-<span className="text-purple-300 font-semibold">Agent Mode</span> היא בודקת מה הצעד הנכון הבא -
                לענות, להשתמש בכלי, או לעצור ולבקש מידע. החליפו ביניהם במתג שבראש הצ&apos;אט.
            </p>

            {/* ══════════ מעבדה 1 · Read Head ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-600/50 bg-slate-800/60 font-mono text-base font-black text-slate-200">1</span>
                    <ScanLine size={24} className={isChat ? 'text-cyan-400' : 'text-purple-400'} />
                    <div>
                        <div className={`text-xs font-bold uppercase tracking-[0.25em] ${isChat ? 'text-cyan-400' : 'text-purple-400'}`}>קריאה חיה</div>
                        <h3 className="text-2xl font-bold text-white">המנוע משנה את דעתו תוך כדי קריאה</h3>
                    </div>
                </div>

                <PredictDecision key={`predict:${mode}:${conversationText}`} text={conversationText} mode={mode} />

                <ReadHeadLab key={`${mode}:${conversationText}`} text={conversationText} mode={mode} accent={accent} />
            </section>

            {/* ══════════ מעבדה 2 · Confidence Dial ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-600/50 bg-slate-800/60 font-mono text-base font-black text-slate-200">2</span>
                    <SlidersHorizontal size={24} className={isChat ? 'text-cyan-400' : 'text-purple-400'} />
                    <div>
                        <div className={`text-xs font-bold uppercase tracking-[0.25em] ${isChat ? 'text-cyan-400' : 'text-purple-400'}`}>מתי לסמוך, מתי לעצור</div>
                        <h3 className="text-2xl font-bold text-white">חוגת הביטחון</h3>
                    </div>
                </div>

                <ConfidenceDial key={`dial:${mode}:${conversationText}`} text={conversationText} mode={mode} />
            </section>

            {/* ══════════ מעבדה 3 · Causality (Counterfactual) ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-600/50 bg-slate-800/60 font-mono text-base font-black text-slate-200">3</span>
                    <GitCompare size={24} className={isChat ? 'text-cyan-400' : 'text-purple-400'} />
                    <div>
                        <div className={`text-xs font-bold uppercase tracking-[0.25em] ${isChat ? 'text-cyan-400' : 'text-purple-400'}`}>סיבתיות</div>
                        <h3 className="text-2xl font-bold text-white">איזו מילה הכריעה את ההחלטה</h3>
                    </div>
                </div>

                <CounterfactualDiff key={`cf:${mode}`} mode={mode} accent={accent} />
            </section>

            {/* ══════════ מעבדה 4 · Fork View ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-600/50 bg-slate-800/60 font-mono text-base font-black text-slate-200">4</span>
                    <Split size={24} className="text-slate-300" />
                    <div>
                        <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">פיצול</div>
                        <h3 className="text-2xl font-bold text-white">אותו משפט, שני מנועים</h3>
                    </div>
                </div>

                <ForkView key={`fork:${conversationText}`} text={conversationText} />
            </section>

            {/* ══════════ סיכום ══════════ */}
            <section className="mt-12 space-y-4 text-right" dir="rtl">
                <InsightBox type="intuition" title="מה אתם מבינים עכשיו">
                    מנוע ה-AI לא &quot;יודע&quot; את התשובה - הוא מדרג אפשרויות, ומחליט לפי הפער ביניהן.
                    כשהפער גדול הוא עונה בביטחון; כשהפער קטן, הצעד הנכון הוא לעצור ולשאול, לא לנחש.
                    ראיתם זאת בעצמכם: ראש הקריאה הראה את המוביל מתחלף תוך כדי קריאה, חוגת הביטחון הפכה את אותו קלט בין ענה לשאל,
                    ומילה אחת שהוחלפה הפכה החלטה שלמה.
                </InsightBox>
                <InsightBox type="warning" title="הכלל המעשי">
                    סמכו על המנוע כשהפער גדול והסיכון נמוך. כשהפער קטן או הפעולה רגישה - עצירה ובקשת הבהרה אינן כשל,
                    אלא הצעד האחראי. בדיוק כאן מתחיל החיבור בין הסתברות לאחריות.
                </InsightBox>
            </section>
            </motion.div>
            )}
            </AnimatePresence>

            {/* ══════════ לפני המבדק: עיגון מושגי הליבה בזרימה הראשית ══════════ */}
            {/* גם מי שלא פתח את שכבת העומק רואה כאן את שלושת הרעיונות שהמבדק בודק. */}
            <section className="mt-16 text-right" dir="rtl">
                <div className="rounded-[1.75rem] border border-cyan-500/30 bg-gradient-to-b from-slate-900/70 to-slate-950/60 p-6 md:p-7">
                    <div className="mb-4 flex items-center gap-2.5">
                        <ListChecks size={20} className="text-cyan-300" />
                        <h3 className="text-xl font-bold text-white">לפני המבדק: שלוש נקודות שכדאי לזכור</h3>
                    </div>
                    <ul className="space-y-3.5">
                        <li className="flex gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 font-bold text-cyan-300">1</span>
                            <p className="text-base leading-relaxed text-slate-200">
                                <span className="font-bold text-white">מסלול, לא קסם.</span> מאחורי כל תשובה רץ מסלול: המנוע מפרק את המשפט לטוקנים,
                                מדרג אפשרויות לפי הסתברות, בודק כמה הוא בטוח, ורק אז מחליט. ההערכה נבנית תוך כדי קריאה, וכל מילה נוספת יכולה לשנות את האפשרות המובילה.
                            </p>
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 font-bold text-cyan-300">2</span>
                            <p className="text-base leading-relaxed text-slate-200">
                                <span className="font-bold text-white">שתי שאלות שונות.</span> ב-<span className="font-semibold text-cyan-300">Chat</span> המנוע שואל &quot;מה התשובה?&quot;.
                                ב-<span className="font-semibold text-purple-300">Agent</span> הוא שואל &quot;מה הצעד הנכון הבא?&quot; - לענות, להשתמש בכלי, או לעצור ולבקש מידע.
                            </p>
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 font-bold text-cyan-300">3</span>
                            <p className="text-base leading-relaxed text-slate-200">
                                <span className="font-bold text-white">ביטחון פוגש אחריות.</span> הביטחון נמדד לפי הפער בין האפשרות המובילה לבאה אחריה.
                                פער גדול וסיכון נמוך, אפשר לתת למנוע לענות. פער קטן או פעולה רגישה, הצעד האחראי הוא לעצור ולשאול, לא לנחש.
                            </p>
                        </li>
                    </ul>
                    {!deepOpen && (
                        <p className="mt-4 text-sm leading-relaxed text-slate-400">
                            רוצים לראות את שלושת אלה חיים? פתחו למעלה את <span className="font-semibold text-cyan-300">המנוע המלא</span> ושחקו עם ראש הקריאה, חוגת הביטחון והשוואת המנועים.
                        </p>
                    )}
                </div>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-10 mb-4" dir="rtl">
                <ChapterQuiz chapterId={1} />
            </section>
        </ChapterLayout>
    );
}
