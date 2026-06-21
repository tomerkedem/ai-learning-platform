"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Terminal, ScanSearch, Sparkles, MousePointerClick } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';

import { TransparentLabLayout } from '@/components/ai-internals/TransparentLabLayout';
import { ChatInterfacePanel } from '@/components/ai-internals/ChatInterfacePanel';
import { EnginePanel } from '@/components/ai-internals/EnginePanel';
import { EngineMetricCard } from '@/components/ai-internals/EngineMetricCard';
import { EngineStep } from '@/components/ai-internals/EngineStep';
import { ProbabilityBars } from '@/components/ai-internals/ProbabilityBars';
import { TokenPreview } from '@/components/ai-internals/TokenPreview';
import { ConfidenceMeter } from '@/components/ai-internals/ConfidenceMeter';
import { DecisionCard } from '@/components/ai-internals/DecisionCard';
import type { Accent, ChatMessage, FlowMode } from '@/components/ai-internals/types';

import { runChatEngine, runAgentEngine } from './mockEngine';

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

    const isChat = mode === 'chat';
    const accent: Accent = isChat ? 'cyan' : 'purple';

    // המנוע הלימודי: תוצאה נגזרת מהטקסט שנשלח.
    const chat = useMemo(() => runChatEngine(conversationText), [conversationText]);
    const agent = useMemo(() => runAgentEngine(conversationText), [conversationText]);

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
                        כתבו משפט אחד. מימין - צ&apos;אט רגיל. משמאל המנוע נפתח וחושב מולכם בזמן אמת:
                        טוקנים, הסתברויות, ביטחון והחלטה. כל מילה מזיזה את המנוע מחדש.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-cyan-400" /> נסו את הדוגמאות המהירות
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Sparkles size={14} className="text-purple-400" /> החליפו בין Chat ל-Agent וראו איך הכול משתנה
                        </span>
                    </div>
                </div>
            </motion.section>

            {/* ══════════ Transparent Chat Lab ══════════ */}
            <section className="mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <ScanSearch size={24} className="text-cyan-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">המעבדה השקופה</div>
                        <h3 className="text-2xl font-bold text-white">Transparent Chat Lab</h3>
                    </div>
                </div>

                <TransparentLabLayout
                    accent={accent}
                    chat={
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
                        />
                    }
                    engine={
                        <EnginePanel
                            title={isChat ? 'Answer Engine' : 'Action Decision Engine'}
                            subtitle={isChat ? 'בחירת תשובה' : 'החלטת פעולה'}
                            accent={accent}
                            replayKey={replayKey}
                        >
                            {isChat ? (
                                <>
                                    <EngineStep note="הקלט הגולמי שכתבתם - נקודת הכניסה למנוע.">
                                        <EngineMetricCard label="Input" value={conversationText} tone="cyan" />
                                    </EngineStep>
                                    <EngineStep note="הטקסט מתפרק ליחידות קטנות (טוקנים) שאיתן המנוע עובד.">
                                        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Token preview</div>
                                            <TokenPreview tokens={chat.tokens} accent="cyan" />
                                        </div>
                                    </EngineStep>
                                    <EngineStep note="המנוע מזהה לאיזה תחום משמעות הבקשה שייכת.">
                                        <EngineMetricCard label="Meaning" value={chat.meaning} hint="Detected meaning" tone="cyan" />
                                    </EngineStep>
                                    <EngineStep note="כל כוונה אפשרית מקבלת הסתברות. הגבוהה ביותר מובילה.">
                                        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
                                            <ProbabilityBars title="Intent probabilities" items={chat.intents} accent="cyan" />
                                        </div>
                                    </EngineStep>
                                    <EngineStep note="כמה המנוע בטוח, לפי הפער בין האפשרות הראשונה לשנייה.">
                                        <ConfidenceMeter level={chat.confidence} />
                                    </EngineStep>
                                    <EngineStep note="ההחלטה שנבחרה על סמך כל השלבים שמעליה.">
                                        <DecisionCard decision={chat.decision} />
                                    </EngineStep>
                                    <EngineStep note="מה שיוחזר למשתמש בפועל בעקבות ההחלטה.">
                                        <EngineMetricCard label="Output" value={chat.output} tone="cyan" />
                                    </EngineStep>
                                </>
                            ) : (
                                <>
                                    <EngineStep note="הקלט הגולמי שכתבתם - נקודת הכניסה למנוע.">
                                        <EngineMetricCard label="Input" value={conversationText} tone="purple" />
                                    </EngineStep>
                                    <EngineStep note="הטקסט מתפרק ליחידות קטנות (טוקנים) שאיתן המנוע עובד.">
                                        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Token preview</div>
                                            <TokenPreview tokens={agent.tokens} accent="purple" />
                                        </div>
                                    </EngineStep>
                                    <EngineStep note="המנוע מזהה שמדובר במשימה, ומה המטרה שלה.">
                                        <EngineMetricCard label="Task detected" value={agent.task} tone="purple" />
                                    </EngineStep>
                                    <EngineStep note="איזה מידע חסר כדי לבצע את המשימה בפועל.">
                                        <EngineMetricCard
                                            label="Missing information"
                                            value={agent.missingInfo}
                                            tone={agent.missingInfo === 'None' ? 'emerald' : 'amber'}
                                        />
                                    </EngineStep>
                                    <EngineStep note="האם נדרש כלי חיצוני כדי להשלים את המשימה.">
                                        <EngineMetricCard
                                            label="Tool need"
                                            value={agent.toolNeed.needed ? 'External data needed: Yes' : 'External data needed: No'}
                                            hint={agent.toolNeed.needed ? `Possible tool: ${agent.toolNeed.tool}` : undefined}
                                            tone="purple"
                                        />
                                    </EngineStep>
                                    <EngineStep note="האם מותר ואפשר לפעול עכשיו, ומה רמת הסיכון.">
                                        <EngineMetricCard
                                            label="Action readiness"
                                            value={agent.canActNow ? 'Can act now: Yes' : 'Can act now: No'}
                                            hint={`Risk: ${agent.risk}`}
                                            tone={agent.canActNow ? 'emerald' : 'rose'}
                                        />
                                    </EngineStep>
                                    <EngineStep note="הצעד הנכון הבא שנבחר - לענות, לפעול או לעצור.">
                                        <DecisionCard decision={agent.decision} />
                                    </EngineStep>
                                    <EngineStep note="מה יקרה בפועל בעקבות ההחלטה.">
                                        <EngineMetricCard label="Output" value={agent.output} tone="purple" />
                                    </EngineStep>
                                </>
                            )}
                        </EnginePanel>
                    }
                />

                <p className="text-slate-400 text-sm leading-relaxed">
                    ב-<span className="text-cyan-300 font-semibold">Chat Mode</span> המערכת בוחרת תשובה.
                    ב-<span className="text-purple-300 font-semibold">Agent Mode</span> היא בודקת מה הצעד הנכון הבא -
                    לענות, להשתמש בכלי, או לעצור ולבקש מידע.
                </p>
            </section>

            {/* ══════════ סיכום ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <InsightBox type="math" title="הרגע שבו המנוע נפתח">
                    בצד ימין רואים את הצ&apos;אט כמו שהמשתמש רגיל לראות אותו.
                    בצד שמאל נפתחת השכבה הפנימית: איך הקלט מתפרש, אילו אפשרויות נשקלות, ומה גורם למערכת לענות, לבקש מידע או לעצור.
                </InsightBox>
            </section>

        </ChapterLayout>
    );
}
