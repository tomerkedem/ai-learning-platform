"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Split, MessageSquare, Workflow, Zap } from 'lucide-react';

import { TokenPreview } from '@/components/ai-internals/TokenPreview';
import { DecisionCard } from '@/components/ai-internals/DecisionCard';
import { EngineMetricCard } from '@/components/ai-internals/EngineMetricCard';

import { tokenize, runChatEngine, runAgentEngine } from './mockEngine';

interface ForkViewProps {
    text: string;
}

/**
 * Fork View: אותו משפט, שני מנועים בו-זמנית. אותם טוקנים בדיוק נכנסים ל-Chat
 * ול-Agent, ורואים את הרגע שבו הם מתפצלים להחלטות שונות - כי כל מנוע שואל שאלה
 * אחרת על אותו קלט. שתי הריצות אמיתיות, מאותו mockEngine.
 */
export const ForkView: React.FC<ForkViewProps> = ({ text }) => {
    const reduce = useReducedMotion();
    const tokens = tokenize(text);
    const chat = runChatEngine(text);
    const agent = runAgentEngine(text);

    const diverges = chat.decision.kind !== agent.decision.kind;

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <Split size={16} className="text-slate-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">פיצול: אותו קלט, שני מנועים</div>
                    <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Fork View</div>
                </div>
            </div>

            {/* טוקנים משותפים */}
            <div className="mb-4 rounded-xl border border-white/10 bg-slate-950/50 p-3">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">אותם טוקנים נכנסים לשני המנועים</div>
                <TokenPreview tokens={tokens} accent="slate" />
            </div>

            {diverges && (
                <motion.div
                    initial={reduce ? false : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 inline-flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-900/20 px-3 py-1.5 text-xs font-bold text-amber-200"
                    role="status"
                    aria-live="polite"
                >
                    <Zap size={13} /> כאן הם מתפצלים: Chat בחר &quot;{chat.decision.label}&quot;, Agent בחר &quot;{agent.decision.label}&quot;
                </motion.div>
            )}

            {/* שני המנועים */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Chat */}
                <div className="rounded-2xl border border-cyan-500/40 bg-cyan-900/10 p-4">
                    <div className="mb-3 flex items-center gap-2 text-cyan-300">
                        <MessageSquare size={15} />
                        <span className="text-sm font-bold">Chat</span>
                        <span className="text-[11px] uppercase tracking-widest text-slate-500">בחירת תשובה</span>
                    </div>
                    <div className="space-y-3">
                        <EngineMetricCard label="Leading intent" value={`${chat.intents[0]?.label ?? '-'} (${chat.intents[0]?.value ?? 0}%)`} tone="cyan" />
                        <DecisionCard decision={chat.decision} />
                    </div>
                </div>

                {/* Agent */}
                <div className="rounded-2xl border border-purple-500/40 bg-purple-900/10 p-4">
                    <div className="mb-3 flex items-center gap-2 text-purple-300">
                        <Workflow size={15} />
                        <span className="text-sm font-bold">Agent</span>
                        <span className="text-[11px] uppercase tracking-widest text-slate-500">החלטת פעולה</span>
                    </div>
                    <div className="space-y-3">
                        <EngineMetricCard label="Task detected" value={agent.task} tone="purple" />
                        <DecisionCard decision={agent.decision} />
                    </div>
                </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-500">
                אותם טוקנים בדיוק, שתי החלטות. ההבדל אינו בקלט אלא בשאלה שכל מנוע שואל עליו: Chat שואל &quot;מה התשובה?&quot;,
                Agent שואל &quot;מה הצעד הבטוח הבא?&quot;.
            </p>
        </div>
    );
};
