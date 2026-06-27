"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GitCompare, ArrowUp, ArrowDown, Minus, Zap, Lightbulb, Target } from 'lucide-react';

import { ACCENTS } from '@/components/ai-internals/accents';
import { DecisionCard } from '@/components/ai-internals/DecisionCard';
import { EngineMetricCard } from '@/components/ai-internals/EngineMetricCard';
import type { Accent, FlowMode } from '@/components/ai-internals/types';
import { useT } from '@/i18n/useT';

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

// כל ניסוי מבודד "מנוף" סיבתי אחד: מילה יחידה שמשנה את ההחלטה. שתי הריצות אמיתיות
// (אותו mockEngine על שני משפטים שנבדלים במילה אחת) - כך הסיבתיות נראית, לא מסופרת.
// תוכן הניסויים (צ'יפ, הסבר, ניסוחים) מגיע מהמילון (cf.experiments). הניסוחים הם
// קלט-הדגמה המצומד לאוצר-המילים של mockEngine (ראו chapter1Visuals).

/**
 * "מה-אם": מעבדת ניסויים סיבתיים. הלומד בוחר מנוף (איזו מילה לשנות) ובוחר בין שני
 * ניסוחים שנבדלים במילה אחת. שתי הריצות אמיתיות, ולצד החדשה מוצגת "רוח רפאים" של
 * הקודמת עם דלתות והבזק כשההחלטה מתהפכת - כך רואים שמילה אחת מזיזה החלטה שלמה.
 */
export const CounterfactualDiff: React.FC<CounterfactualDiffProps> = ({ mode, accent }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const isChat = mode === 'chat';
    const cf = useT().t.behindAi.chapter1.visuals.counterfactual;
    const experiments = cf.experiments[mode];

    const [expKey, setExpKey] = useState(experiments[0].key);
    const [selected, setSelected] = useState(0);

    const exp = experiments.find((e) => e.key === expKey) ?? experiments[0];
    const activeVariant = exp.variants[selected] ?? exp.variants[0];
    const ghostVariant = exp.variants[selected === 0 ? 1 : 0];

    const active = isChat ? runChatEngine(activeVariant.text) : runAgentEngine(activeVariant.text);
    const ghost = isChat ? runChatEngine(ghostVariant.text) : runAgentEngine(ghostVariant.text);

    const flipped = active.decision.kind !== ghost.decision.kind;

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <GitCompare size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">{cf.title}</div>
                    <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Counterfactual Diff</div>
                </div>
            </div>

            <p className="mb-3 text-sm leading-relaxed text-slate-300">
                <span className="font-bold text-white">{cf.whyLabel}</span>{cf.whyLead}<span className={`font-bold ${a.text}`}>{cf.whyFind}</span>{cf.whyMid}<span className={`font-bold ${a.text}`}>{cf.whyProve}</span>{cf.whyTail}
            </p>
            <div className="mb-4 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">{cf.howTitle}</div>
                <ol className="space-y-1 text-xs leading-relaxed text-slate-400">
                    <li><span className={`font-bold ${a.text}`}>1.</span>{cf.how1}</li>
                    <li><span className={`font-bold ${a.text}`}>2.</span>{cf.how2}</li>
                    <li><span className={`font-bold ${a.text}`}>3.</span>{cf.how3}</li>
                </ol>
            </div>

            {/* בורר הניסוי */}
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500">{cf.tryLever}</span>
                {experiments.map((e) => (
                    <button
                        key={e.key}
                        type="button"
                        onClick={() => { setExpKey(e.key); setSelected(0); }}
                        className={`rounded-full border px-2.5 py-1 text-xs font-bold transition-colors ${e.key === expKey ? `${a.border} ${a.bgSoft} ${a.text}` : 'border-slate-700/60 bg-slate-800/40 text-slate-400 hover:border-slate-600'}`}
                    >
                        {e.chip}
                    </button>
                ))}
            </div>

            {/* בחירת ניסוח: שני משפטים שנבדלים במילה אחת */}
            <div className="mb-4 grid grid-cols-2 gap-2">
                {exp.variants.map((v, idx) => {
                    const isActive = selected === idx;
                    return (
                        <button
                            key={v.text}
                            type="button"
                            onClick={() => setSelected(idx)}
                            aria-pressed={isActive}
                            className={`rounded-xl border p-3 transition-colors ${isActive ? `${a.border} ${a.bgSoft}` : 'border-slate-700/60 bg-slate-900/40 hover:border-slate-600'}`}
                        >
                            <div className="flex flex-wrap items-center justify-center gap-1.5">
                                {tokenize(v.text).map((tk, i) => {
                                    const isPivot = !!v.pivot && tk === v.pivot;
                                    return (
                                        <span
                                            key={`${tk}-${i}`}
                                            className={`rounded-md border px-2 py-0.5 text-sm font-mono ${isPivot ? `${a.border} ${a.bgSoft} ${a.text} font-bold` : isActive ? 'border-white/10 bg-slate-900/60 text-slate-200' : 'border-transparent text-slate-400'}`}
                                        >
                                            {tk}
                                        </span>
                                    );
                                })}
                            </div>
                            {!v.pivot && <div className="mt-1.5 text-[10px] text-slate-500">{cf.noPivot}</div>}
                        </button>
                    );
                })}
            </div>

            {/* ייחוס: המילה שהכריעה את ההחלטה הנוכחית (ה"למה" שמאחורי ההחלטה) */}
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 text-xs leading-relaxed text-slate-300">
                <Target size={14} className={`mt-0.5 shrink-0 ${a.text}`} />
                <span>
                    {cf.attrChose} <span className="font-mono font-bold text-slate-100">{active.decision.label}</span>.{' '}
                    {activeVariant.pivot ? (
                        <>
                            {cf.attrWhyPrefix}<span className="font-bold text-white">{cf.attrWhy}</span>{cf.attrWithPivotMid}
                            <span className={`mx-0.5 inline-block rounded-md border px-1.5 py-0.5 align-middle font-mono text-[13px] font-bold ${a.border} ${a.bgSoft} ${a.text}`}>{activeVariant.pivot}</span>{cf.attrWithPivotTail}
                        </>
                    ) : (
                        <>
                            {cf.attrWhyPrefix}<span className="font-bold text-white">{cf.attrWhy}</span>{cf.attrNoPivotMid1}<span className="font-bold text-white">{cf.attrNoPivotMissing}</span>{cf.attrNoPivotMid2}
                            <span className={`mx-0.5 inline-block rounded-md border px-1.5 py-0.5 align-middle font-mono text-[13px] font-bold ${a.border} ${a.bgSoft} ${a.text}`}>{ghostVariant.pivot}</span>{cf.attrNoPivotTail}
                        </>
                    )}
                </span>
            </div>

            {/* ההבזק על החלטה שהתהפכה */}
            {flipped && (
                <motion.div
                    key={`${active.decision.kind}-${expKey}-${selected}`}
                    initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 18 }}
                    className="mb-4 inline-flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-900/20 px-3 py-1.5 text-xs font-bold text-amber-200"
                    role="status"
                    aria-live="polite"
                >
                    <Zap size={13} />
                    {cf.flipped} {ghost.decision.label} -&gt; {active.decision.label}
                </motion.div>
            )}

            {/* גוף ההשוואה */}
            {isChat ? (
                <ChatDiff active={active as ChatEngineResult} ghost={ghost as ChatEngineResult} accent={accent} reduce={!!reduce} />
            ) : (
                <AgentDiff active={active as AgentEngineResult} ghost={ghost as AgentEngineResult} />
            )}

            {/* ההסבר הסיבתי של הניסוי הנבחר */}
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 text-xs leading-relaxed text-slate-400">
                <Lightbulb size={14} className={`mt-0.5 shrink-0 ${a.text}`} />
                <span>{exp.why}</span>
            </div>
        </div>
    );
};

/* ── דיף Chat: עמודות הסתברות עם דלתא ──────────────────────────────────────── */

const ChatDiff: React.FC<{ active: ChatEngineResult; ghost: ChatEngineResult; accent: Accent; reduce: boolean }> = ({ active, ghost, accent, reduce }) => {
    const a = ACCENTS[accent];
    const v = useT().t.behindAi.chapter1.visuals;
    const cf = v.counterfactual;
    const activeReply = v.mockEngine.chatReplies[active.replyKey];
    const ghostMap = new Map(ghost.intents.map((i) => [i.label, i.value]));
    const max = active.intents.reduce((m, it) => Math.max(m, it.value), 0);

    return (
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Intent probabilities</div>
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
                <p className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                    <span className="inline-block h-2 w-3 rounded-sm border border-dashed border-slate-500/60" />
                    {cf.ghostHint}
                </p>
            </div>

            <div className="space-y-3 md:w-56">
                <DecisionCard decision={active.decision} />
                {/* התשובה שתיווצר משתנה עם המילה - כך "החלטה אחרת" מורגשת גם כשסוג ההחלטה זהה. */}
                <div className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
                    <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">{cf.replyToCreate}</div>
                    <motion.p
                        key={activeReply}
                        initial={reduce ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                        className="text-xs leading-relaxed text-slate-300"
                    >
                        {activeReply}
                    </motion.p>
                </div>
            </div>
        </div>
    );
};

const DeltaTag: React.FC<{ delta: number }> = ({ delta }) => {
    if (delta > 0) {
        return (
            <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-bold text-emerald-300" dir="ltr">
                <ArrowUp size={11} /> {delta}
            </span>
        );
    }
    if (delta < 0) {
        return (
            <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-bold text-rose-300" dir="ltr">
                <ArrowDown size={11} /> {delta}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-bold text-slate-500" dir="ltr">
            <Minus size={11} /> 0
        </span>
    );
};

/* ── דיף Agent: השוואת החלטה ומידע חסר ─────────────────────────────────────── */

const AgentDiff: React.FC<{ active: AgentEngineResult; ghost: AgentEngineResult }> = ({ active, ghost }) => {
    const cf = useT().t.behindAi.chapter1.visuals.counterfactual;
    return (
    <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{cf.beforeAfter}</div>
            <DiffRow label="Missing information" before={ghost.missingInfo} after={active.missingInfo} />
            <DiffRow label="Can act now" before={ghost.canActNow ? 'Yes' : 'No'} after={active.canActNow ? 'Yes' : 'No'} />
            <DiffRow label="Tool" before={ghost.toolNeed.needed ? ghost.toolNeed.tool : '-'} after={active.toolNeed.needed ? active.toolNeed.tool : '-'} />
            <EngineMetricCard label="Task detected" value={active.task} tone="purple" />
        </div>
        <DecisionCard decision={active.decision} />
    </div>
    );
};

const DiffRow: React.FC<{ label: string; before: string; after: string }> = ({ label, before, after }) => {
    const changed = before !== after;
    return (
        <div className={`rounded-xl border p-3 ${changed ? 'border-amber-500/40 bg-amber-900/10' : 'border-white/10 bg-slate-900/40'}`}>
            <div className="mb-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</div>
            <div className="flex items-center gap-2 text-sm" dir="ltr">
                <span className={`font-mono ${changed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{before}</span>
                {changed && <ArrowDown size={13} className="-rotate-90 text-amber-300" />}
                {changed && <span className="font-mono font-bold text-amber-200">{after}</span>}
            </div>
        </div>
    );
};
