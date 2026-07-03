"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, ScanLine, Repeat, Lock, Scale, MessageSquare } from 'lucide-react';

import { ACCENTS } from '@/components/ai-internals/accents';
import { DecisionCard } from '@/components/ai-internals/DecisionCard';
import { DecisionPill } from '@/components/ai-internals/DecisionPill';
import { EngineMetricCard } from '@/components/ai-internals/EngineMetricCard';
import type { Accent, DecisionState, FlowMode } from '@/components/ai-internals/types';
import { useT } from '@/i18n/useT';

import {
    BeliefStream,
    summarizeDist,
    LANE_LABEL,
    LABEL_TO_LANE,
    type BeliefStep,
    type LaneKey,
    type Confidence,
} from './BeliefStream';

import {
    tokenize,
    joinTokens,
    runChatEngine,
    runAgentEngine,
    type ChatEngineResult,
    type AgentEngineResult,
} from './mockEngine';

interface ReadHeadLabProps {
    /** הטקסט המלא שנשלח לצ'אט - משמש כמסלול "המשפט שלך" (מנוע אמיתי). */
    text: string;
    mode: FlowMode;
    accent: Accent;
}

const STEP_MS = 780;

// memoization לפי מחרוזת-prefix: אותו prefix לעולם לא מחושב פעמיים. המנוע טהור.
const chatCache = new Map<string, ChatEngineResult>();
const agentCache = new Map<string, AgentEngineResult>();
const cachedChat = (s: string): ChatEngineResult => {
    let v = chatCache.get(s);
    if (!v) { v = runChatEngine(s); chatCache.set(s, v); }
    return v;
};
const cachedAgent = (s: string): AgentEngineResult => {
    let v = agentCache.get(s);
    if (!v) { v = runAgentEngine(s); agentCache.set(s, v); }
    return v;
};

// צבע ה-thumb של ה-slider לכל גוון.
const RANGE_COLOR: Record<Accent, string> = {
    cyan: '#22d3ee', sky: '#38bdf8', teal: '#2dd4bf', blue: '#60a5fa',
    indigo: '#818cf8', violet: '#a78bfa', purple: '#c084fc', fuchsia: '#e879f9',
    pink: '#f472b6', rose: '#fb7185', orange: '#fb923c', amber: '#fbbf24',
    lime: '#a3e635', emerald: '#34d399', slate: '#94a3b8',
};

// אייקון לכל דוגמה מתוסרטת, לפי id (תלוי-מבנה, לא תלוי-שפה).
const EXAMPLE_ICON: Record<string, React.ComponentType<{ size?: number }>> = {
    flip: Repeat, lock: Lock, torn: Scale,
};

// גוון צ'יפ הביטחון.
const CONF_TONE: Record<Confidence, string> = {
    High: 'text-emerald-300 border-emerald-500/40 bg-emerald-900/20',
    Medium: 'text-amber-300 border-amber-500/40 bg-amber-900/20',
    Low: 'text-rose-300 border-rose-500/40 bg-rose-900/20',
};

const EMPTY_DIST: Record<LaneKey, number> = { notDelivered: 0, tracking: 0, system: 0, payment: 0, other: 0 };

/**
 * "ראש הקריאה": playhead שסורק משפט מילה-אחר-מילה, וכל מילה מזיזה את "נהר הזמן" -
 * גרף השטח שמצייר את מסע האמונה. הדוגמאות המודרכות נושאות התפלגות מתוסרטת פר-מילה
 * (המחשה לימודית, כמו PredictDecision), כדי שכל מילה תזיז משהו והמוביל יתהפך באמת;
 * "המשפט שלך" רץ דרך המנוע הלימודי האמיתי. הביטחון, ההחלטה, מונה ההתהפכויות והתובנה
 * כולם נגזרים מאותה התפלגות - אין כאן שום אלמנט ללא תפקיד.
 */
export const ReadHeadLab: React.FC<ReadHeadLabProps> = ({ text, mode, accent }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const isChat = mode === 'chat';
    const { t, dir } = useT();
    const rh = t.behindAi.chapter1.visuals.readHead;
    const examples = rh.examples;

    // --- מסלול Chat: דוגמה מתוסרטת או "המשפט שלך" (מנוע חי) ---
    const [selectedId, setSelectedId] = useState<string | null>(
        () => (isChat && examples.length ? examples[0].id : null),
    );
    const selectedExample = isChat ? examples.find((e) => e.id === selectedId) ?? null : null;

    const tokens = useMemo(() => tokenize(text), [text]);

    const liveChatSteps = useMemo<BeliefStep[]>(() => {
        if (!isChat) return [];
        return tokens.map((_, i) => {
            const r = cachedChat(joinTokens(tokens.slice(0, i + 1), text));
            const dist: Record<LaneKey, number> = { ...EMPTY_DIST };
            r.intents.forEach((it) => { const k = LABEL_TO_LANE[it.label]; if (k) dist[k] = it.value; });
            return { word: tokens[i], dist };
        });
    }, [tokens, isChat, text]);

    const chatSteps: BeliefStep[] = selectedExample ? selectedExample.steps : liveChatSteps;
    const isScripted = !!selectedExample;

    // --- מסלול Agent: התנהגות קודמת (משימה / מידע חסר / החלטה), בלי נהר ---
    const agentRuns = useMemo<AgentEngineResult[]>(() => {
        if (isChat) return [];
        return tokens.map((_, i) => cachedAgent(joinTokens(tokens.slice(0, i + 1), text)));
    }, [tokens, isChat, text]);

    const n = isChat ? chatSteps.length : agentRuns.length;
    const words = isChat ? chatSteps.map((s) => s.word) : tokens;

    // ניתוח Chat: סיכום פר-מילה, התהפכויות, החלטה.
    const summaries = useMemo(() => chatSteps.map((s) => summarizeDist(s.dist)), [chatSteps]);
    const flipAt = useMemo(
        () => chatSteps.map((_, i) => i > 0 && summaries[i].leader !== summaries[i - 1].leader),
        [chatSteps, summaries],
    );
    const flipCount = flipAt.filter(Boolean).length;
    const lastFlipIndex = flipAt.lastIndexOf(true);

    const [head, setHead] = useState(Math.max(0, n - 1));
    const [playing, setPlaying] = useState(false);

    const clampedHead = Math.min(Math.max(0, head), Math.max(0, n - 1));
    const atEnd = clampedHead >= n - 1;
    const isRunning = playing && !atEnd;

    // הפעלה אוטומטית מהמילה הראשונה (אלא אם יש העדפת תנועה מופחתת).
    useEffect(() => {
        if (reduce || n <= 1) return;
        const id = setTimeout(() => { setHead(0); setPlaying(true); }, 0);
        return () => clearTimeout(id);
    }, [reduce, n, selectedId]);

    // לולאת הסורק. נעצרת מעצמה בסוף.
    useEffect(() => {
        if (!playing || atEnd) return;
        const id = setInterval(() => setHead((h) => Math.min(n - 1, h + 1)), STEP_MS);
        return () => clearInterval(id);
    }, [playing, atEnd, n]);

    const pickExample = (id: string | null) => { setSelectedId(id); setHead(0); if (!reduce) setPlaying(true); };
    const stepBack = () => { setPlaying(false); setHead((h) => Math.max(0, h - 1)); };
    const stepForward = () => { setPlaying(false); setHead((h) => Math.min(n - 1, h + 1)); };
    const restart = () => { setHead(0); if (!reduce) setPlaying(true); };
    const togglePlay = () => {
        if (head >= n - 1) { setHead(0); setPlaying(true); return; }
        setPlaying((p) => !p);
    };
    const seek = (i: number) => { setPlaying(false); setHead(i); };

    if (n === 0) {
        return (
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-center text-sm text-slate-500" dir={dir}>
                {rh.emptyState}
            </div>
        );
    }

    const curSummary = isChat ? summaries[clampedHead] : undefined;
    const agentCurrent = !isChat ? agentRuns[clampedHead] : undefined;
    const chatDecision: DecisionState =
        curSummary?.confidence === 'Low'
            ? { kind: 'ask', label: 'Ask for more context' }
            : { kind: 'answer', label: 'Generate response' };

    return (
        <div className={`rounded-2xl border ${a.border} bg-slate-950/70 ${a.glow} overflow-hidden`} dir={dir}>
            {/* כותרת */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <div className={`p-1.5 rounded-lg bg-slate-900 border border-white/10 ${a.text}`}>
                    <ScanLine size={16} />
                </div>
                <div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500">Read Head</div>
                    <div className={`font-black text-base ${a.text}`}>{rh.title}</div>
                    <div className="text-xs text-slate-400">{rh.subtitle}</div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                    <span className={`font-semibold ${a.text}`}>{rh.introHeadLabel}</span>{rh.introMid}<span className="text-white font-semibold">{rh.introEmph}</span>{rh.introTail}
                </p>

                {/* מסגור מנגיד: הדבר האחד שראש הקריאה נותן ומפת המנוע לא (Chat בלבד, שם יש נהר) */}
                {isChat && (
                    <p className={`flex items-start gap-2 rounded-lg border ${a.border} ${a.bgSoft} px-3 py-2.5 text-sm leading-relaxed text-slate-200`}>
                        <ScanLine size={15} className={`mt-0.5 shrink-0 ${a.text}`} aria-hidden />
                        <span>{rh.distinctNote}</span>
                    </p>
                )}

                {/* שבבי הדוגמאות (Chat בלבד) */}
                {isChat && examples.length > 0 && (
                    <div className="space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{rh.examplesLabel}</div>
                        <div className="flex flex-wrap gap-2">
                            {examples.map((ex) => {
                                const Icon = EXAMPLE_ICON[ex.id] ?? Repeat;
                                const active = selectedId === ex.id;
                                return (
                                    <button
                                        key={ex.id}
                                        type="button"
                                        onClick={() => pickExample(ex.id)}
                                        aria-pressed={active}
                                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors
                                            ${active ? `${a.border} ${a.bgSoft} ${a.text}` : 'border-slate-700/60 bg-slate-800/40 text-slate-300 hover:border-slate-600'}`}
                                    >
                                        <Icon size={13} /> {ex.tag}
                                    </button>
                                );
                            })}
                            <button
                                type="button"
                                onClick={() => pickExample(null)}
                                aria-pressed={selectedId === null}
                                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors
                                    ${selectedId === null ? `${a.border} ${a.bgSoft} ${a.text}` : 'border-slate-700/60 bg-slate-800/40 text-slate-300 hover:border-slate-600'}`}
                            >
                                <MessageSquare size={13} /> {rh.yourSentence}
                            </button>
                        </div>
                    </div>
                )}

                {/* פס בקרה */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-700/50 bg-slate-950/50 px-3 py-2">
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={togglePlay}
                            aria-pressed={isRunning}
                            disabled={n <= 1}
                            className={`inline-flex items-center gap-1.5 rounded-lg border ${a.border} ${a.bgSoft} px-2.5 py-1 text-xs font-bold ${a.text} transition-colors hover:brightness-125 disabled:opacity-40`}
                        >
                            {isRunning ? <Pause size={13} /> : <Play size={13} />}
                            {isRunning ? rh.pause : atEnd ? rh.again : rh.play}
                        </button>
                        <button
                            type="button"
                            onClick={stepBack}
                            disabled={clampedHead <= 0}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 px-2.5 py-1 text-xs font-bold text-slate-300 transition-colors hover:border-slate-600 disabled:opacity-40"
                        >
                            <SkipBack size={13} /> {rh.back}
                        </button>
                        <button
                            type="button"
                            onClick={stepForward}
                            disabled={atEnd}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 px-2.5 py-1 text-xs font-bold text-slate-300 transition-colors hover:border-slate-600 disabled:opacity-40"
                        >
                            <SkipForward size={13} /> {rh.forward}
                        </button>
                        <button
                            type="button"
                            onClick={restart}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 px-2.5 py-1 text-xs font-bold text-slate-300 transition-colors hover:border-slate-600"
                        >
                            <RotateCcw size={13} /> {rh.restart}
                        </button>
                    </div>
                    <span
                        role="status"
                        aria-live="polite"
                        aria-label={rh.wordCountAria(clampedHead + 1, n)}
                        className="font-mono text-xs font-bold text-slate-500"
                        dir="ltr"
                    >
                        {clampedHead + 1}/{n}
                    </span>
                </div>

                {/* רצועת המילים + סורק. סימן התהפכות מעל מילה שבה המוביל התחלף. */}
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                        {words.map((tk, i) => {
                            const read = i <= clampedHead;
                            const isHead = i === clampedHead;
                            const flipped = isChat && flipAt[i];
                            return (
                                <button
                                    key={`${tk}-${i}`}
                                    type="button"
                                    onClick={() => seek(i)}
                                    aria-current={isHead ? 'true' : undefined}
                                    className={`relative rounded-lg px-2.5 py-1 text-sm font-mono border transition-colors
                                        ${read ? `${a.border} ${a.bgSoft} ${a.text}` : 'border-white/5 bg-slate-900/40 text-slate-600'}
                                        ${isHead ? `ring-2 ${a.ringSoft}` : ''}`}
                                >
                                    {flipped && (
                                        <span
                                            className="pointer-events-none absolute -top-1.5 left-1/2 -translate-x-1/2 text-[10px] font-black text-amber-300"
                                            aria-label={rh.flipMarkerAria}
                                            title={rh.flipMarkerAria}
                                        >
                                            ⟲
                                        </span>
                                    )}
                                    {tk}
                                    {isHead && !reduce && (
                                        <motion.span
                                            layoutId={`readhead-${mode}`}
                                            className={`pointer-events-none absolute -bottom-1 inset-x-1 h-0.5 rounded-full ${a.solid}`}
                                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <input
                        type="range"
                        min={0}
                        max={Math.max(0, n - 1)}
                        step={1}
                        value={clampedHead}
                        onChange={(e) => seek(Number(e.target.value))}
                        aria-label={rh.scrubberAria}
                        disabled={n <= 1}
                        style={{ accentColor: RANGE_COLOR[accent] }}
                        className="w-full cursor-pointer disabled:opacity-40"
                    />
                </div>

                {/* ════════ מסלול Chat: נהר הזמן + מצב חי + החלטה ════════ */}
                {isChat && curSummary ? (
                    <div className="space-y-3">
                        {/* כותרת מצב חיה: מוביל + ביטחון (צ'יפ קומפקטי, בלי כפילות) */}
                        <div
                            role="status"
                            aria-live="polite"
                            className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-slate-900/40 px-4 py-2.5 text-sm"
                        >
                            <span className="text-slate-300">
                                {rh.leaderNow}{' '}
                                <strong className={a.text}>{LANE_LABEL[curSummary.leader]}</strong>{' '}
                                <span className="font-mono text-slate-500" dir="ltr">({curSummary.top}%)</span>
                            </span>
                            <span className={`ms-auto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${CONF_TONE[curSummary.confidence]}`}>
                                {rh.confidence}: {curSummary.confidence}
                            </span>
                        </div>

                        {/* נהר הזמן */}
                        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
                            <BeliefStream
                                steps={chatSteps}
                                head={clampedHead}
                                dir={dir}
                                reduce={!!reduce}
                                labels={{ streamHint: rh.streamHint, leader: rh.leaderTag }}
                            />
                        </div>

                        {/* החלטה: שורה קומפקטית, מופיעה רק בסוף (ההחלטה היא תוצר התהליך) */}
                        {atEnd ? (
                            <DecisionPill decision={chatDecision} />
                        ) : (
                            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/30 px-4 py-2.5 text-sm text-slate-500">
                                <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${a.dot}`} />
                                {rh.readingNow}
                            </div>
                        )}

                        {/* תובנת-סיום: מונה ההתהפכויות + המילה שהפכה. מודגמת, לא מוצהרת. */}
                        {atEnd && (
                            <div className={`rounded-xl border ${a.border} ${a.bgSoft} p-4`}>
                                <div className={`mb-1 text-xs font-bold uppercase tracking-widest ${a.text}`}>{rh.insightTitle}</div>
                                <p className="text-sm leading-relaxed text-slate-200">
                                    {rh.insightChanges(flipCount)}
                                    {lastFlipIndex >= 0 && <>{' '}{rh.insightPivot(words[lastFlipIndex])}</>}
                                </p>
                            </div>
                        )}

                        {/* כיתוב יושרה: מודרך (מתוסרט) מול חי */}
                        <p className="flex items-start gap-1.5 text-xs leading-relaxed text-slate-500">
                            <span className={`mt-[5px] h-1 w-1 shrink-0 rounded-full ${a.dot}`} />
                            <span>{isScripted ? rh.scriptedNote : rh.liveNote}</span>
                        </p>
                    </div>
                ) : null}

                {/* ════════ מסלול Agent: התנהגות קודמת ════════ */}
                {!isChat && agentCurrent ? (
                    <div className="space-y-3">
                        <div role="status" aria-live="polite" className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-2.5 text-sm">
                            <span className="text-slate-300">
                                {rh.decisionNow} <strong className={a.text}>{agentCurrent.decision.label}</strong>
                            </span>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2 md:items-start">
                            <div className="space-y-3">
                                <EngineMetricCard label="Task detected" value={agentCurrent.task} tone={accent} />
                                <EngineMetricCard
                                    label="Missing information"
                                    value={agentCurrent.missingInfo}
                                    tone={agentCurrent.missingInfo === 'None' ? 'emerald' : 'amber'}
                                />
                            </div>
                            <DecisionCard decision={agentCurrent.decision} />
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
