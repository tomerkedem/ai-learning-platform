"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GitCompare, ArrowUp, ArrowDown, Minus, Zap, RotateCcw } from 'lucide-react';

import { ACCENTS } from '@/components/ai-internals/accents';
import { DecisionCard } from '@/components/ai-internals/DecisionCard';
import { EngineMetricCard } from '@/components/ai-internals/EngineMetricCard';
import type { Accent, FlowMode } from '@/components/ai-internals/types';

import {
    tokenize,
    runChatEngine,
    runAgentEngine,
    type ChatEngineResult,
    type AgentEngineResult,
} from './mockEngine';

interface CounterfactualDiffProps {
    mode: FlowMode;
    accent: Accent;
}

interface Preset {
    /** המשפט שמכיל את מילת-הציר. */
    textWith: string;
    /** אותו משפט בלי מילת-הציר. */
    textWithout: string;
    /** המילה היחידה שמשתנה. */
    pivotWord: string;
    /** מה המילה אומרת, לכיתוב. */
    pivotMeaning: string;
}

const PRESETS: Record<FlowMode, Preset> = {
    chat: {
        textWith: 'החבילה לא הגיעה',
        textWithout: 'החבילה הגיעה',
        pivotWord: 'לא',
        pivotMeaning: 'מילת שלילה',
    },
    agent: {
        textWith: 'בדוק את החבילה 123456789',
        textWithout: 'בדוק את החבילה',
        pivotWord: '123456789',
        pivotMeaning: 'מספר ברקוד',
    },
};

/**
 * "מה-אם": החלפת מילה אחת בלבד, ולצדה רוח-רפאים של הריצה הקודמת. חיצי ↑/↓ על כל
 * כוונה והבזק על ההחלטה שהתהפכה. שתי הריצות אמיתיות (אותו mockEngine על שני
 * משפטים שנבדלים במילה אחת) - כך הסיבתיות נראית, לא מסופרת.
 */
export const CounterfactualDiff: React.FC<CounterfactualDiffProps> = ({ mode, accent }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const isChat = mode === 'chat';
    const preset = PRESETS[mode];

    const [included, setIncluded] = useState(true);
    const activeText = included ? preset.textWith : preset.textWithout;
    const ghostText = included ? preset.textWithout : preset.textWith;

    const active = isChat ? runChatEngine(activeText) : runAgentEngine(activeText);
    const ghost = isChat ? runChatEngine(ghostText) : runAgentEngine(ghostText);

    const flipped = active.decision.kind !== ghost.decision.kind;

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <GitCompare size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">מה-אם</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Counterfactual Diff</div>
                </div>
            </div>

            <p className="mb-4 text-xs leading-relaxed text-slate-400">
                שנו מילה אחת בלבד (<span className={`font-bold ${a.text}`}>{preset.pivotWord}</span> - {preset.pivotMeaning})
                וראו את הריצה הקודמת הופכת ל&quot;רוח רפאים&quot; לצד החדשה. החיצים מראים מה עלה ומה ירד, וההבזק מסמן אם
                ההחלטה עצמה התהפכה.
            </p>

            {/* המשפט + כפתור החלפה */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700/50 bg-slate-950/50 p-3">
                <div className="flex flex-wrap items-center gap-1.5">
                    {tokenize(activeText).map((tk, i) => {
                        const isPivot = tk === preset.pivotWord;
                        return (
                            <span
                                key={`${tk}-${i}`}
                                className={`rounded-lg px-2.5 py-1 text-sm font-mono border ${isPivot ? `${a.border} ${a.bgSoft} ${a.text} font-bold` : 'border-white/10 bg-slate-900/60 text-slate-300'}`}
                            >
                                {tk}
                            </span>
                        );
                    })}
                </div>
                <button
                    type="button"
                    onClick={() => setIncluded((v) => !v)}
                    aria-pressed={included}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${a.border} ${a.bgSoft} ${a.text} hover:brightness-125`}
                >
                    <RotateCcw size={13} />
                    {included ? `הסר את "${preset.pivotWord}"` : `הוסף את "${preset.pivotWord}"`}
                </button>
            </div>

            {/* ההבזק על החלטה שהתהפכה */}
            {flipped && (
                <motion.div
                    key={`${active.decision.kind}-${included}`}
                    initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 18 }}
                    className="mb-4 inline-flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-900/20 px-3 py-1.5 text-xs font-bold text-amber-200"
                    role="status"
                    aria-live="polite"
                >
                    <Zap size={13} />
                    ההחלטה התהפכה: {ghost.decision.label} → {active.decision.label}
                </motion.div>
            )}

            {/* גוף ההשוואה */}
            {isChat ? (
                <ChatDiff active={active as ChatEngineResult} ghost={ghost as ChatEngineResult} accent={accent} reduce={!!reduce} />
            ) : (
                <AgentDiff active={active as AgentEngineResult} ghost={ghost as AgentEngineResult} />
            )}
        </div>
    );
};

/* ── דיף Chat: עמודות הסתברות עם דלתא ──────────────────────────────────────── */

const ChatDiff: React.FC<{ active: ChatEngineResult; ghost: ChatEngineResult; accent: Accent; reduce: boolean }> = ({ active, ghost, accent, reduce }) => {
    const a = ACCENTS[accent];
    const ghostMap = new Map(ghost.intents.map((i) => [i.label, i.value]));
    const max = active.intents.reduce((m, it) => Math.max(m, it.value), 0);

    return (
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="space-y-2.5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Intent probabilities</div>
                {active.intents.map((item) => {
                    const before = ghostMap.get(item.label) ?? 0;
                    const delta = item.value - before;
                    const isTop = item.value === max;
                    return (
                        <div key={item.label}>
                            <div className="mb-1 flex items-center justify-between text-xs">
                                <span className={isTop ? `font-bold ${a.text}` : 'text-slate-400'}>{item.label}</span>
                                <span className="flex items-center gap-2">
                                    <DeltaTag delta={delta} />
                                    <span className={`font-mono ${isTop ? `font-bold ${a.text}` : 'text-slate-500'}`} dir="ltr">{item.value}%</span>
                                </span>
                            </div>
                            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80">
                                {/* רוח רפאים: הערך הקודם */}
                                <div
                                    className="absolute inset-y-0 right-0 rounded-full border border-dashed border-slate-500/50"
                                    style={{ width: `${Math.max(0, Math.min(100, before))}%` }}
                                    aria-hidden
                                />
                                <motion.div
                                    initial={false}
                                    animate={{ width: `${Math.max(0, Math.min(100, item.value))}%` }}
                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 130, damping: 19 }}
                                    className={`relative h-full rounded-full ${isTop ? `${a.barGradient} ${a.glow}` : 'bg-slate-600'}`}
                                />
                            </div>
                        </div>
                    );
                })}
                <p className="flex items-center gap-1.5 pt-1 text-[10px] text-slate-500">
                    <span className="inline-block h-2 w-3 rounded-sm border border-dashed border-slate-500/60" />
                    המתאר המקווקו = הריצה הקודמת (רוח הרפאים)
                </p>
            </div>

            <div className="md:w-56">
                <DecisionCard decision={active.decision} />
            </div>
        </div>
    );
};

const DeltaTag: React.FC<{ delta: number }> = ({ delta }) => {
    if (delta > 0) {
        return (
            <span className="inline-flex items-center gap-0.5 font-mono text-[10px] font-bold text-emerald-300" dir="ltr">
                <ArrowUp size={11} /> {delta}
            </span>
        );
    }
    if (delta < 0) {
        return (
            <span className="inline-flex items-center gap-0.5 font-mono text-[10px] font-bold text-rose-300" dir="ltr">
                <ArrowDown size={11} /> {delta}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-0.5 font-mono text-[10px] font-bold text-slate-500" dir="ltr">
            <Minus size={11} /> 0
        </span>
    );
};

/* ── דיף Agent: השוואת החלטה ומידע חסר ─────────────────────────────────────── */

const AgentDiff: React.FC<{ active: AgentEngineResult; ghost: AgentEngineResult }> = ({ active, ghost }) => (
    <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">לפני / אחרי</div>
            <DiffRow label="Missing information" before={ghost.missingInfo} after={active.missingInfo} />
            <DiffRow label="Can act now" before={ghost.canActNow ? 'Yes' : 'No'} after={active.canActNow ? 'Yes' : 'No'} />
            <DiffRow label="Tool" before={ghost.toolNeed.needed ? ghost.toolNeed.tool : '-'} after={active.toolNeed.needed ? active.toolNeed.tool : '-'} />
            <EngineMetricCard label="Task detected" value={active.task} tone="purple" />
        </div>
        <DecisionCard decision={active.decision} />
    </div>
);

const DiffRow: React.FC<{ label: string; before: string; after: string }> = ({ label, before, after }) => {
    const changed = before !== after;
    return (
        <div className={`rounded-xl border p-3 ${changed ? 'border-amber-500/40 bg-amber-900/10' : 'border-white/10 bg-slate-900/40'}`}>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</div>
            <div className="flex items-center gap-2 text-sm" dir="ltr">
                <span className={`font-mono ${changed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{before}</span>
                {changed && <ArrowDown size={13} className="-rotate-90 text-amber-300" />}
                {changed && <span className="font-mono font-bold text-amber-200">{after}</span>}
            </div>
        </div>
    );
};
