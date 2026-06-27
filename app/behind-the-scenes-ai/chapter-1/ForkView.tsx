"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Split, MessageSquare, Workflow, Zap, Check } from 'lucide-react';

import { TokenPreview } from '@/components/ai-internals/TokenPreview';
import { DecisionCard } from '@/components/ai-internals/DecisionCard';
import { EngineMetricCard } from '@/components/ai-internals/EngineMetricCard';
import { useT } from '@/i18n/useT';

import { tokenize, runChatEngine, runAgentEngine } from './mockEngine';

interface ForkViewProps {
    text: string;
}

/**
 * Fork View: אותו משפט, שני מנועים בו-זמנית. אותם טוקנים בדיוק נכנסים ל-Chat
 * ול-Agent, ורואים מתי הם מתפצלים ומתי מסכימים - כי כל מנוע שואל שאלה אחרת על
 * אותו קלט. שתי הריצות אמיתיות, מאותו mockEngine.
 */
export const ForkView: React.FC<ForkViewProps> = ({ text }) => {
    const reduce = useReducedMotion();
    const fv = useT().t.behindAi.chapter1.visuals.forkView;

    const [sampleText, setSampleText] = useState<string | null>(null);
    const activeText = sampleText ?? text;

    const tokens = tokenize(activeText);
    const chat = runChatEngine(activeText);
    const agent = runAgentEngine(activeText);

    const diverges = chat.decision.kind !== agent.decision.kind;
    const shown = activeText.length > 42 ? activeText.slice(0, 42) + '...' : activeText;

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-1 flex items-center gap-2">
                <Split size={16} className="text-slate-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">{fv.title}</div>
                    <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Fork View</div>
                </div>
            </div>

            {/* הרעיון + איך מפעילים */}
            <p className="mb-3 text-sm leading-relaxed text-slate-300">
                <span className="font-bold text-white">{fv.ideaLabel}</span>{fv.ideaLead}<span className="font-bold text-white">{fv.ideaEmph}</span>{fv.ideaTail}
            </p>
            <div className="mb-4 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">{fv.howTitle}</div>
                <ol className="space-y-1 text-xs leading-relaxed text-slate-400">
                    <li><span className="font-bold text-slate-300">1.</span>{fv.how1}</li>
                    <li><span className="font-bold text-slate-300">2.</span>{fv.how2}</li>
                    <li><span className="font-bold text-slate-300">3.</span>{fv.how3}</li>
                </ol>
            </div>

            {/* בורר קלטים */}
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500"><MessageSquare size={12} /> {fv.tryInput}</span>
                <button
                    type="button"
                    onClick={() => setSampleText(null)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-bold transition-colors ${sampleText === null ? 'border-slate-400/50 bg-slate-700/40 text-slate-100' : 'border-slate-700/60 bg-slate-800/40 text-slate-400 hover:border-slate-600'}`}
                >
                    {fv.yourMessage}
                </button>
                {fv.samples.map((s) => (
                    <button
                        key={s.input}
                        type="button"
                        onClick={() => setSampleText(s.input)}
                        className={`rounded-full border px-2.5 py-1 text-xs font-bold transition-colors ${sampleText === s.input ? 'border-slate-400/50 bg-slate-700/40 text-slate-100' : 'border-slate-700/60 bg-slate-800/40 text-slate-400 hover:border-slate-600'}`}
                    >
                        {s.tag}
                    </button>
                ))}
            </div>
            <div className="mb-4 truncate text-xs text-slate-500">{fv.analyzingLead}{shown}{fv.analyzingTail}</div>

            {/* טוקנים משותפים */}
            <div className="mb-4 rounded-xl border border-white/10 bg-slate-950/50 p-3">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">{fv.sameTokens}</div>
                <TokenPreview tokens={tokens} accent="slate" />
            </div>

            {/* פסק דין: מתפצלים או מסכימים */}
            <motion.div
                key={`${diverges}-${activeText}`}
                initial={reduce ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs font-bold ${diverges ? 'border-amber-500/50 bg-amber-900/20 text-amber-200' : 'border-emerald-500/50 bg-emerald-900/20 text-emerald-200'}`}
                role="status"
                aria-live="polite"
            >
                {diverges ? <Zap size={14} className="mt-0.5 shrink-0" /> : <Check size={14} className="mt-0.5 shrink-0" />}
                <span>
                    {diverges
                        ? <>{fv.divergeLead}{chat.decision.label}{fv.divergeMid}{agent.decision.label}{fv.divergeTail}</>
                        : <>{fv.agreeLead}{chat.decision.label}{fv.agreeTail}</>}
                </span>
            </motion.div>

            {/* שני המנועים */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Chat */}
                <div className="rounded-2xl border border-cyan-500/40 bg-cyan-900/10 p-4">
                    <div className="mb-1 flex items-center gap-2 text-cyan-300">
                        <MessageSquare size={15} />
                        <span className="text-sm font-bold">Chat</span>
                    </div>
                    <div className="mb-3 rounded-lg border border-cyan-500/20 bg-cyan-950/30 px-2.5 py-1.5 text-xs text-cyan-100">
                        {fv.questionLabel} <span className="font-bold">{fv.chatQuestion}</span>
                    </div>
                    <div className="space-y-3">
                        <EngineMetricCard label="Leading intent" value={`${chat.intents[0]?.label ?? '-'} (${chat.intents[0]?.value ?? 0}%)`} tone="cyan" />
                        <DecisionCard decision={chat.decision} />
                    </div>
                </div>

                {/* Agent */}
                <div className="rounded-2xl border border-purple-500/40 bg-purple-900/10 p-4">
                    <div className="mb-1 flex items-center gap-2 text-purple-300">
                        <Workflow size={15} />
                        <span className="text-sm font-bold">Agent</span>
                    </div>
                    <div className="mb-3 rounded-lg border border-purple-500/20 bg-purple-950/30 px-2.5 py-1.5 text-xs text-purple-100">
                        {fv.questionLabel} <span className="font-bold">{fv.agentQuestion}</span>
                    </div>
                    <div className="space-y-3">
                        <EngineMetricCard label="Task detected" value={agent.task} tone="purple" />
                        <DecisionCard decision={agent.decision} />
                    </div>
                </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-500">
                {fv.footer}
            </p>
        </div>
    );
};
