"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Terminal, ScanSearch, Sparkles, MousePointerClick, ScanLine, SlidersHorizontal, GitCompare, Route, Split, X } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';

import { TransparentLabLayout } from '@/components/ai-internals/TransparentLabLayout';
import { ChatInterfacePanel } from '@/components/ai-internals/ChatInterfacePanel';
import type { Accent, ChatMessage, FlowMode } from '@/components/ai-internals/types';

import { runChatEngine, runAgentEngine } from './mockEngine';
import { traceChatEngine, traceAgentEngine } from './engineTrace';
import { GlassEnginePanel } from './GlassEnginePanel';
import { HoloFrame } from './HoloFrame';
import { ReadHeadLab } from './ReadHeadLab';
import { PredictDecision } from './PredictDecision';
import { ConfidenceDial } from './ConfidenceDial';
import { CounterfactualDiff } from './CounterfactualDiff';
import { DecisionTrace } from './DecisionTrace';
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
    // חישוב חי: המנוע מנתח את מה שמקלידים (debounced), לא רק את מה שנשלח.
    const [liveText, setLiveText] = useState(DEFAULT_INPUT);
    // קישור חי: הטוקן שמרחפים עליו (בצ'אט או במנוע), להדגשה הדדית.
    const [hoverToken, setHoverToken] = useState<string | null>(null);

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

    // 15 שלבי המנוע השקוף - שיקוף כן של אותה ריצה (חיה), מקובץ ל-4 מערכות.
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

    const messages = useMemo<ChatMessage[]>(() => [
        { id: 'user', role: 'user', text: conversationText },
        { id: 'ai', role: 'ai', text: isChat ? chat.reply : agent.reply },
    ], [conversationText, isChat, chat.reply, agent.reply]);

    const commit = (text: string) => {
        const next = text.trim();
        if (!next) return;
        setIsTyping(true);
        setConversationText(next);
        setLiveText(next); // עדכון מיידי כדי שהמנוע יהיה עקבי עם השליחה, בלי המתנה ל-debounce
        setSendCount((c) => c + 1);
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
    };

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={1}>

            {/* ══════════ HERO ══════════ */}
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
                        <span className="font-mono text-[11px] tracking-widest uppercase text-cyan-300">Behind the Scenes · 01</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        מה באמת קורה בין{' '}
                        <span className="bg-gradient-to-l from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                            השאלה לתשובה
                        </span>
                        ?
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        כתבו משפט אחד, ומימין הצ&apos;אט נראה רגיל. משמאל המנוע נפתח וחושב מולכם בזמן אמת:
                        טוקנים, הסתברויות, ביטחון והחלטה. כאן לא רק רואים את התוצאה, אלא צופים במנוע
                        <span className="text-white font-semibold"> משנה את דעתו תוך כדי קריאה</span> - ואפשר להתערב:
                        לגרור את ראש הקריאה, להזיז את סף הביטחון, ולהחליף מילה אחת כדי להפוך החלטה.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <ScanLine size={14} className="text-cyan-400" /> גררו את ראש הקריאה וראו את המוביל מתחלף
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <SlidersHorizontal size={14} className="text-cyan-400" /> הזיזו את סף הביטחון בין ענה לשאל
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Sparkles size={14} className="text-purple-400" /> החליפו בין Chat ל-Agent וראו איך הכול משתנה
                        </span>
                    </div>
                </div>
            </motion.section>

            {/* ══════════ מנטור מלווה + first-run ══════════ */}
            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-900/10 p-4" dir="rtl">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500/60 bg-slate-950">
                    <Image src="/assets/mentor-think.png" alt="המנטור" fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 text-sm leading-relaxed text-slate-200">
                    <span className="font-bold text-emerald-300">שנייה לפני שמתחילים: </span>
                    כל מספר בלוח הזה מחושב חי על המשפט שלכם. אל תאמינו לי - גררו את הסורק וראו את המנוע מתלבט בעצמכם.
                    <AnimatePresence>
                        {coachOpen && (
                            <motion.div
                                initial={reduce ? false : { opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={reduce ? undefined : { opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-3 flex items-start justify-between gap-2 rounded-xl border border-emerald-500/30 bg-slate-950/40 p-3">
                                    <span className="flex items-start gap-2 text-[13px] text-emerald-100/90">
                                        <MousePointerClick size={14} className="mt-0.5 shrink-0 text-emerald-300" />
                                        <span><span className="font-bold text-emerald-200">התחילו כאן: </span>כתבו משפט או בחרו דוגמה מהירה, ואז גללו אל &quot;ראש הקריאה&quot; והפעילו אותו.</span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setCoachOpen(false)}
                                        aria-label="סגירת ההדרכה"
                                        className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                                    >
                                        <X size={15} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ══════════ Transparent Chat Lab ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <ScanSearch size={24} className="text-cyan-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">המעבדה השקופה</div>
                        <h3 className="text-2xl font-bold text-white">Transparent Chat Lab</h3>
                    </div>
                </div>

                <div className="relative">
                {/* aurora אמביינטי מאחורי שני החלונות */}
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -top-12 right-1/4 -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[110px]"
                    animate={reduce ? undefined : { x: [0, 40, 0], y: [0, 28, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-12 left-1/4 -z-10 h-72 w-72 rounded-full bg-purple-500/10 blur-[110px]"
                    animate={reduce ? undefined : { x: [0, -32, 0], y: [0, -22, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
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
                                isTyping={isTyping}
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
                                subtitle={isChat ? 'בחירת תשובה · 15 שלבים' : 'החלטת פעולה · 15 שלבים'}
                                accent={accent}
                                replayKey={replayKey}
                                steps={engineSteps}
                                highlightToken={hoverToken}
                                onTokenHover={setHoverToken}
                            />
                        </HoloFrame>
                    }
                />
                </div>

                <p className="text-slate-400 text-sm leading-relaxed">
                    ב-<span className="text-cyan-300 font-semibold">Chat Mode</span> המערכת בוחרת תשובה.
                    ב-<span className="text-purple-300 font-semibold">Agent Mode</span> היא בודקת מה הצעד הנכון הבא –
                    לענות, להשתמש בכלי, או לעצור ולבקש מידע.
                </p>
            </section>

            {/* ══════════ Read Head ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <ScanLine size={24} className={isChat ? 'text-cyan-400' : 'text-purple-400'} />
                    <div>
                        <div className={`text-[11px] font-bold uppercase tracking-[0.25em] ${isChat ? 'text-cyan-400' : 'text-purple-400'}`}>קריאה חיה</div>
                        <h3 className="text-2xl font-bold text-white">המנוע משנה את דעתו תוך כדי קריאה</h3>
                    </div>
                </div>

                <PredictDecision key={`predict:${mode}:${conversationText}`} text={conversationText} mode={mode} />

                <ReadHeadLab key={`${mode}:${conversationText}`} text={conversationText} mode={mode} accent={accent} />
            </section>

            {/* ══════════ Confidence Dial ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <SlidersHorizontal size={24} className={isChat ? 'text-cyan-400' : 'text-purple-400'} />
                    <div>
                        <div className={`text-[11px] font-bold uppercase tracking-[0.25em] ${isChat ? 'text-cyan-400' : 'text-purple-400'}`}>מתי לסמוך, מתי לעצור</div>
                        <h3 className="text-2xl font-bold text-white">חוגת הביטחון</h3>
                    </div>
                </div>

                <ConfidenceDial key={`dial:${mode}:${conversationText}`} text={conversationText} mode={mode} accent={accent} />
            </section>

            {/* ══════════ Counterfactual + Trace ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <GitCompare size={24} className={isChat ? 'text-cyan-400' : 'text-purple-400'} />
                    <div>
                        <div className={`text-[11px] font-bold uppercase tracking-[0.25em] ${isChat ? 'text-cyan-400' : 'text-purple-400'}`}>סיבתיות</div>
                        <h3 className="text-2xl font-bold text-white">מילה אחת, החלטה אחרת</h3>
                    </div>
                </div>

                <CounterfactualDiff key={`cf:${mode}`} mode={mode} accent={accent} />

                <div className="flex items-center gap-3 pt-2">
                    <Route size={24} className={isChat ? 'text-cyan-400' : 'text-purple-400'} />
                    <div>
                        <div className={`text-[11px] font-bold uppercase tracking-[0.25em] ${isChat ? 'text-cyan-400' : 'text-purple-400'}`}>למה זה?</div>
                        <h3 className="text-2xl font-bold text-white">עקבו אחורה מההחלטה אל הסיבות</h3>
                    </div>
                </div>

                <DecisionTrace key={`trace:${mode}:${conversationText}`} text={conversationText} mode={mode} accent={accent} />
            </section>

            {/* ══════════ Fork View ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <Split size={24} className="text-slate-300" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">פיצול</div>
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

        </ChapterLayout>
    );
}
