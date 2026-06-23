"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, ScanLine } from 'lucide-react';

import { ACCENTS } from '@/components/ai-internals/accents';
import { ProbabilityBars } from '@/components/ai-internals/ProbabilityBars';
import { ConfidenceMeter } from '@/components/ai-internals/ConfidenceMeter';
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

interface ReadHeadLabProps {
    /** הטקסט המלא שנשלח לצ'אט - הסורק רץ עליו מילה-אחר-מילה. */
    text: string;
    mode: FlowMode;
    accent: Accent;
}

type Run = ChatEngineResult | AgentEngineResult;
const isChatRun = (r: Run): r is ChatEngineResult => 'intents' in r;

const STEP_MS = 780;

// צבע ה-thumb של ה-slider לכל גוון (accent-color דורש ערך, לא מחלקת Tailwind דינמית).
const RANGE_COLOR: Record<Accent, string> = {
    cyan: '#22d3ee', blue: '#60a5fa', indigo: '#818cf8', purple: '#c084fc',
    amber: '#fbbf24', emerald: '#34d399', rose: '#fb7185', slate: '#94a3b8',
};

/**
 * "ראש הקריאה": playhead שסורק את המשפט מילה-אחר-מילה. לכל prefix (המילים עד
 * נקודת הסורק) מורץ אותו מנוע לימודי, וההסתברויות מתעדכנות בזמן אמת - כך שהמוביל
 * יכול להתחלף באמצע המשפט. זו שכבת-הצגה מעל ה-mockEngine: אין כאן מספרים חדשים,
 * רק הרצה כנה של אותו מנוע על תת-מחרוזות.
 */
export const ReadHeadLab: React.FC<ReadHeadLabProps> = ({ text, mode, accent }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const isChat = mode === 'chat';

    const tokens = useMemo(() => tokenize(text), [text]);
    const n = tokens.length;

    // ריצה לכל prefix. כל מילה עד ראש הסורק מריצה מחדש את אותו מנוע על תת-המחרוזת.
    const runs = useMemo<Run[]>(
        () =>
            tokens.map((_, i) => {
                const prefix = tokens.slice(0, i + 1).join(' ');
                return isChat ? runChatEngine(prefix) : runAgentEngine(prefix);
            }),
        [tokens, isChat],
    );

    const [head, setHead] = useState(Math.max(0, n - 1));
    const [playing, setPlaying] = useState(false);

    // טקסט/מצב חדש: התחל לקרוא מהמילה הראשונה. ב-reduced-motion נוחתים סטטית על הסוף.
    useEffect(() => {
        if (reduce || n <= 1) {
            setHead(Math.max(0, n - 1));
            setPlaying(false);
            return;
        }
        setHead(0);
        setPlaying(true);
    }, [text, isChat, n, reduce]);

    // לולאת הסורק.
    useEffect(() => {
        if (!playing) return;
        const id = setInterval(() => setHead((h) => Math.min(n - 1, h + 1)), STEP_MS);
        return () => clearInterval(id);
    }, [playing, n]);

    // עצירה בסוף המשפט.
    useEffect(() => {
        if (head >= n - 1) setPlaying(false);
    }, [head, n]);

    const clampedHead = Math.min(Math.max(0, head), Math.max(0, n - 1));
    const current = runs[clampedHead];

    const stepBack = () => { setPlaying(false); setHead((h) => Math.max(0, h - 1)); };
    const stepForward = () => { setPlaying(false); setHead((h) => Math.min(n - 1, h + 1)); };
    const restart = () => { setHead(0); if (!reduce) setPlaying(true); };
    const togglePlay = () => {
        if (head >= n - 1) { setHead(0); setPlaying(true); return; }
        setPlaying((p) => !p);
    };
    const seek = (i: number) => { setPlaying(false); setHead(i); };

    const atEnd = clampedHead >= n - 1;

    if (n === 0 || !current) {
        return (
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-center text-sm text-slate-500" dir="rtl">
                כתבו משפט בצ&apos;אט כדי שראש הקריאה יסרוק אותו.
            </div>
        );
    }

    const prefixText = tokens.slice(0, clampedHead + 1).join(' ');

    return (
        <div className={`rounded-[2rem] border ${a.border} bg-slate-950/70 ${a.glow} overflow-hidden`} dir="rtl">
            {/* כותרת */}
            <div className="flex items-center gap-3 p-5 border-b border-white/10">
                <div className={`p-2 rounded-xl bg-slate-900 border border-white/10 ${a.text}`}>
                    <ScanLine size={18} />
                </div>
                <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Read Head</div>
                    <div className={`font-black text-lg ${a.text}`}>ראש הקריאה</div>
                </div>
            </div>

            <div className="p-5 space-y-5">
                <p className="text-sm text-slate-300 leading-relaxed">
                    הסורק קורא מילה-אחר-מילה. בכל עצירה מורץ <span className={a.text}>אותו מנוע</span> על
                    המילים שנקראו עד כה - כך אפשר לראות את המודל <span className="text-white font-semibold">משנה את דעתו תוך כדי קריאה</span>.
                </p>

                {/* פס בקרה */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-700/50 bg-slate-950/50 px-3 py-2">
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={togglePlay}
                            aria-pressed={playing}
                            disabled={n <= 1}
                            className={`inline-flex items-center gap-1.5 rounded-lg border ${a.border} ${a.bgSoft} px-2.5 py-1 text-xs font-bold ${a.text} transition-colors hover:brightness-125 disabled:opacity-40`}
                        >
                            {playing ? <Pause size={13} /> : <Play size={13} />}
                            {playing ? 'השהה' : atEnd ? 'שוב' : 'הרץ'}
                        </button>
                        <button
                            type="button"
                            onClick={stepBack}
                            disabled={clampedHead <= 0}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 px-2.5 py-1 text-xs font-bold text-slate-300 transition-colors hover:border-slate-600 disabled:opacity-40"
                        >
                            <SkipBack size={13} /> אחורה
                        </button>
                        <button
                            type="button"
                            onClick={stepForward}
                            disabled={atEnd}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 px-2.5 py-1 text-xs font-bold text-slate-300 transition-colors hover:border-slate-600 disabled:opacity-40"
                        >
                            <SkipForward size={13} /> קדימה
                        </button>
                        <button
                            type="button"
                            onClick={restart}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 px-2.5 py-1 text-xs font-bold text-slate-300 transition-colors hover:border-slate-600"
                        >
                            <RotateCcw size={13} /> מהתחלה
                        </button>
                    </div>
                    <span
                        role="status"
                        aria-live="polite"
                        aria-label={`מילה ${clampedHead + 1} מתוך ${n}`}
                        className="font-mono text-[11px] font-bold text-slate-500"
                        dir="ltr"
                    >
                        {clampedHead + 1}/{n}
                    </span>
                </div>

                {/* רצועת המילים + סורק */}
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                        {tokens.map((tk, i) => {
                            const read = i <= clampedHead;
                            const isHead = i === clampedHead;
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

                    {/* סקראבר: גרירה + מקשי חצים */}
                    <input
                        type="range"
                        min={0}
                        max={Math.max(0, n - 1)}
                        step={1}
                        value={clampedHead}
                        onChange={(e) => seek(Number(e.target.value))}
                        aria-label="מיקום ראש הקריאה"
                        disabled={n <= 1}
                        style={{ accentColor: RANGE_COLOR[accent] }}
                        className="w-full cursor-pointer disabled:opacity-40"
                    />
                </div>

                {/* כותרת מצב חיה */}
                <div
                    role="status"
                    aria-live="polite"
                    className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-2.5 text-sm"
                >
                    {isChatRun(current) ? (
                        <span className="text-slate-300">
                            המוביל כעת:{' '}
                            <strong className={a.text}>{current.intents[0]?.label}</strong>{' '}
                            <span className="font-mono text-slate-500" dir="ltr">({current.intents[0]?.value}%)</span>
                            {' · '}
                            ביטחון <strong className="text-slate-200">{current.confidence}</strong>
                        </span>
                    ) : (
                        <span className="text-slate-300">
                            ההחלטה כעת: <strong className={a.text}>{current.decision.label}</strong>
                        </span>
                    )}
                </div>

                {/* פאנלים */}
                {isChatRun(current) ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
                            <ProbabilityBars title="Intent probabilities" items={current.intents} accent={accent} />
                        </div>
                        <div className="space-y-4">
                            <ConfidenceMeter level={current.confidence} />
                            <DecisionCard decision={current.decision} />
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-4">
                            <EngineMetricCard label="Task detected" value={current.task} tone={accent} />
                            <EngineMetricCard
                                label="Missing information"
                                value={current.missingInfo}
                                tone={current.missingInfo === 'None' ? 'emerald' : 'amber'}
                            />
                        </div>
                        <DecisionCard decision={current.decision} />
                    </div>
                )}

                {/* כיתוב יושרה: קפיצות בדידות הן תקינות */}
                <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-500">
                    <span className={`mt-[5px] h-1 w-1 shrink-0 rounded-full ${a.dot}`} />
                    <span>
                        לפעמים העמודות קופצות בבת אחת כשמילת-מפתח נכנסת (למשל &quot;{prefixText}&quot;). זה לא באג:
                        ככה אמונה משתנה ברגע שמגיעה הראיה המכריעה.
                    </span>
                </p>
            </div>
        </div>
    );
};
