"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
    motion, AnimatePresence, useMotionValue, useTransform, animate, useReducedMotion, type Variants,
} from 'framer-motion';
import {
    Cpu, CheckCircle2, XCircle, Hash, Scan, Trophy, Sparkles, Bot,
} from 'lucide-react';

import { useT } from '@/i18n/useT';
import { ACCENTS } from '@/components/ai-internals/accents';
import { ProbabilityBars } from '@/components/ai-internals/ProbabilityBars';
import { ConfidenceMeter } from '@/components/ai-internals/ConfidenceMeter';
import { DecisionCard } from '@/components/ai-internals/DecisionCard';
import type { Accent, DecisionKind, IntentProbability } from '@/components/ai-internals/types';

import { ExpandableLabContext } from '@/components/ai-internals/ExpandableLab';

import { STATION_PALETTE } from '@/components/ai-internals/IntroStationViz';
import type { EngineTraceStep } from './engineTrace';
import type { Confidence } from './mockEngine';
import { ProcessCheckpointNode } from './ProcessCheckpointNode';

// צבעי 14 התחנות של מפת המבוא, בסדר הצינור. ליבת כל צומת נצבעת בצבע-תחנה כדי
// שהמנוע ילבש את אותם צבעים שהלומד ראה במפה (זיהוי). לא 1:1 לתחנה ספציפית, אלא
// אותו רצף-צבעים של הרצועה. הטבעת/ההילה נשארות בגוון-המצב (Chat/Agent).
const STATION_DOTS = Object.values(STATION_PALETTE).map((s) => s.solid);

interface GlassEnginePanelProps {
    title: string;
    subtitle?: string;
    accent: Accent;
    replayKey: string | number;
    steps: EngineTraceStep[];
    /** ספירת טוקנים אמיתית מ-Claude (count_tokens) לקלט הנוכחי, במצב חי. null => לא זמין. */
    liveTokenCount?: number | null;
    /** טוקן מודגש כרגע (קישור חי בין הצ'אט למנוע). */
    highlightToken?: string | null;
    /** דיווח על ריחוף/נגיעה בטוקן בתוך המנוע, להדגשה הדדית. */
    onTokenHover?: (token: string | null) => void;
}

// גוון גל-השיא לפי סוג ההחלטה (climax sweep).
const CLIMAX_RGB: Record<DecisionKind, string> = {
    answer: '52,211,153',
    ask: '251,191,36',
    tool: '96,165,250',
    stop: '251,113,133',
};

/** האם השלב מושפע מהטוקן המודגש (לטבעת הדגשה ברמת הכרטיס). */
function stepLinked(step: EngineTraceStep, token: string | null | undefined): boolean {
    if (!token) return false;
    if (step.kind === 'tokens') return step.tokens.includes(token);
    if (step.kind === 'keywords') return step.groups.some((g) => g.matched.some((w) => w.includes(token)));
    if (step.kind === 'flag') return step.on && step.triggerToken === token;
    return false;
}

/* ════════════════════════ עזרים ויזואליים ════════════════════════════════ */

const AnimatedNumber: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
    const reduce = useReducedMotion();
    const mv = useMotionValue(reduce ? value : 0);
    const rounded = useTransform(mv, (v) => Math.round(v).toString());
    useEffect(() => {
        if (reduce) { mv.set(value); return; }
        const controls = animate(mv, value, { duration: 0.7, ease: 'easeOut' });
        return () => controls.stop();
    }, [value, mv, reduce]);
    return <motion.span className={className} dir="ltr">{rounded}</motion.span>;
};

/**
 * רגע-ההחלטה (Decoding): התמונה ההסתברותית הופכת לבחירה. החלופות מופיעות כפסי
 * הסתברות, ואז המוביל "ננעל" (spring + זוהר + ✓) בעוד השאר מתעמעמים, והפער והביטחון
 * נכנסים. visual-first: הטקסט מינימלי, ההבנה מגיעה מהתנועה ומסיבתיות ויזואלית.
 */
const DecisionMoment: React.FC<{ items: IntentProbability[]; margin: number; level: Confidence; accent: Accent; selectedLabel: string }> = ({ items, margin, level, accent, selectedLabel }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const [selected, setSelected] = useState(!!reduce);
    const top = items.slice(0, 4);

    // ה-state מאותחל ל-true כשהתנועה מצומצמת (מציג מיד את מצב-הבחירה), ול-false
    // אחרת; הבחירה "ננעלת" אחרי שהפסים מתמלאים. הרכיב נטען מחדש בכל replay של הפאנל.
    useEffect(() => {
        if (reduce) return;
        const t = setTimeout(() => setSelected(true), 250 + top.length * 130 + 450);
        return () => clearTimeout(t);
    }, [reduce, top.length]);

    const maxV = Math.max(1, top[0]?.value ?? 1);

    return (
        <div className="space-y-1.5" dir="auto">
            {top.map((it, i) => {
                const win = i === 0;
                const dim = selected && !win;
                const wpct = Math.max(6, (it.value / maxV) * 100);
                return (
                    <motion.div
                        key={it.label}
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: dim ? 0.4 : 1, y: 0, scale: selected && win ? 1.04 : dim ? 0.98 : 1 }}
                        transition={reduce ? { duration: 0 } : {
                            opacity: { duration: 0.35, delay: selected ? 0 : 0.15 + i * 0.13 },
                            y: { duration: 0.35, delay: 0.15 + i * 0.13 },
                            scale: { type: 'spring', stiffness: 320, damping: 16 },
                        }}
                        className={`relative flex items-center gap-2 overflow-hidden rounded-lg border px-2.5 py-1.5 transition-shadow ${selected && win ? `${a.border} ${a.bgSoft} ${a.glow}` : 'border-white/10 bg-slate-900/40'}`}
                    >
                        <motion.span
                            aria-hidden
                            className={`absolute inset-y-0 start-0 ${win ? a.barGradient : 'bg-slate-600/50'}`}
                            style={{ opacity: 0.22 }}
                            initial={reduce ? false : { width: 0 }}
                            animate={{ width: `${wpct}%` }}
                            transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.2 + i * 0.13, ease: 'easeOut' }}
                        />
                        <span className={`relative z-10 text-sm font-bold ${dim ? 'text-slate-400' : a.text}`}>{it.label}</span>
                        <span className={`relative z-10 ms-auto font-mono text-xs ${dim ? 'text-slate-500' : a.text}`} dir="ltr">{it.value}%</span>
                        <AnimatePresence>
                            {selected && win && (
                                <motion.span
                                    className={`relative z-10 inline-flex shrink-0 items-center gap-1 rounded-full ${a.solid} ${a.solidText} px-1.5 py-0.5 text-xs font-black`}
                                    initial={reduce ? false : { scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 480, damping: 12 }}
                                >
                                    <CheckCircle2 size={12} /> {selectedLabel}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: reduce ? 0 : 0.3 }}
                        className="flex items-center justify-between gap-2 pt-0.5"
                    >
                        <span className={`inline-flex items-center gap-1 rounded-md ${a.bgSoft} px-2 py-0.5 font-mono text-xs ${a.text}`} dir="ltr">gap {Math.round(margin)}%</span>
                        <ConfidenceMeter level={level} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const itemVar: Variants = {
    hidden: { opacity: 0, y: 14, scale: 0.98, filter: 'blur(5px)' },
    show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

/* ════════════════════════ ויזואל לכל סוג שלב ═════════════════════════════ */

interface StepVisualProps {
    step: EngineTraceStep;
    accent: Accent;
    reduce: boolean;
    highlightToken?: string | null;
    onTokenHover?: (token: string | null) => void;
}

const StepVisual: React.FC<StepVisualProps> = ({ step, accent, reduce, highlightToken, onTokenHover }) => {
    const a = ACCENTS[accent];
    const visuals = useT().t.behindAi.chapter1.visuals;
    const ep = visuals.enginePanel;

    switch (step.kind) {
        case 'raw':
            return (
                <div className="rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2">
                    <span className={`font-mono text-sm ${a.text}`} dir="auto">{step.value}</span>
                </div>
            );

        case 'normalize':
            return step.changed ? (
                <div className="space-y-1.5">
                    <div className="rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2">
                        <span className={`font-mono text-sm ${a.text}`} dir="auto">{step.normalized || '-'}</span>
                    </div>
                    <span className="text-xs text-slate-500">{ep.normalizeTrimmed}</span>
                </div>
            ) : (
                <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-900/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                    <CheckCircle2 size={14} /> {ep.inputClean}
                </div>
            );

        case 'tokens':
            if (!step.tokens.length) return <span className="text-xs text-slate-500">{ep.noTokens}</span>;
            // חתימת החיתוך של מפת המבוא: כל טוקן מתנפץ מהמשפט ונוחת מלמעלה עם
            // overshoot, סיבוב קל, spring והבזק-נחיתה. אותה שפה ויזואלית בדיוק,
            // מותאמת לצפיפות המנוע. reduced-motion => הופעה מיידית בלי תנועה/הבזק.
            return (
                <div className="flex flex-wrap gap-2" dir="auto">
                    {step.tokens.map((token, i) => {
                        const hl = highlightToken === token;
                        const dropDelay = reduce ? 0 : 0.1 + i * 0.09;
                        return (
                            <span key={`${token}-${i}`} className="relative inline-flex">
                                {/* הבזק-נחיתה מאחורי הטוקן ברגע שהוא מתייצב */}
                                {!reduce && (
                                    <motion.span
                                        aria-hidden
                                        className={`pointer-events-none absolute inset-0 rounded-lg ${a.solid}`}
                                        initial={{ scale: 0.6, opacity: 0 }}
                                        animate={{ scale: [0.6, 1.5], opacity: [0.5, 0] }}
                                        transition={{ duration: 0.45, delay: dropDelay + 0.05, ease: 'easeOut' }}
                                    />
                                )}
                                <motion.span
                                    initial={reduce ? false : { opacity: 0, y: -14, scale: 0.6, rotate: i % 2 === 0 ? -8 : 8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                                    transition={reduce ? { duration: 0 } : { delay: dropDelay, type: 'spring', stiffness: 360, damping: 15 }}
                                    onMouseEnter={() => onTokenHover?.(token)}
                                    onMouseLeave={() => onTokenHover?.(null)}
                                    onClick={() => onTokenHover?.(hl ? null : token)}
                                    className={`relative cursor-pointer rounded-lg border px-2.5 py-1 text-xs font-mono transition-colors
                                        ${hl ? `${a.solid} ${a.solidText} ${a.glow}` : `bg-slate-900/60 ${a.border} ${a.text}`}`}
                                >
                                    {token}
                                </motion.span>
                            </span>
                        );
                    })}
                </div>
            );

        case 'count':
            return (
                <div className="flex items-center gap-3">
                    <div className={`flex items-baseline gap-1 font-black ${a.text}`}>
                        <Hash size={14} className="opacity-70" />
                        <AnimatedNumber value={step.value} className={`text-4xl font-black tabular-nums ${a.barGradient} bg-clip-text text-transparent`} />
                        <span className="text-xs font-medium text-slate-400">{step.unit}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {Array.from({ length: Math.min(step.value, 12) }).map((_, i) => (
                            <motion.span
                                key={i}
                                initial={reduce ? false : { scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: reduce ? 0 : i * 0.04, type: 'spring', stiffness: 300, damping: 20 }}
                                className={`h-2 w-2 rounded-sm ${a.solid}`}
                            />
                        ))}
                    </div>
                </div>
            );

        case 'keywords':
            return (
                <div className="space-y-2">
                    {step.groups.map((g) => (
                        <div key={g.label} className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-400">{g.label}</span>
                            <span className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold ${g.matched.length ? `${a.bgSoft} ${a.text}` : 'bg-slate-800/60 text-slate-500'}`} dir="ltr">
                                {g.matched.length}/{g.total}
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {g.matched.length ? (
                                    g.matched.map((w, i) => {
                                        const hl = highlightToken != null && w.includes(highlightToken);
                                        return (
                                            <motion.span
                                                key={`${w}-${i}`}
                                                initial={reduce ? false : { scale: 0.7, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: reduce ? 0 : i * 0.05, type: 'spring', stiffness: 320, damping: 18 }}
                                                className={`rounded-md border px-2 py-0.5 font-mono text-xs transition-colors ${hl ? `${a.solid} ${a.solidText} ${a.glow}` : `${a.border} ${a.bgSoft} ${a.text}`}`}
                                            >
                                                {w}
                                            </motion.span>
                                        );
                                    })
                                ) : (
                                    <span className="text-xs text-slate-600">{ep.noMatch}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            );

        case 'flag': {
            const linked = step.on && step.triggerToken != null && highlightToken === step.triggerToken;
            return (
                <div className="flex flex-wrap items-center gap-2">
                    <motion.span
                        key={step.on ? 'on' : 'off'}
                        initial={reduce ? false : { scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition-shadow
                            ${step.on ? `${a.border} ${a.bgSoft} ${a.text}` : 'border-slate-700/60 bg-slate-800/40 text-slate-500'}
                            ${linked ? `ring-2 ${a.ringSoft} ${a.glow}` : ''}`}
                    >
                        {step.on ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        {step.on ? step.onLabel : step.offLabel}
                    </motion.span>
                    {step.detail && <span className="text-xs text-slate-500">{step.detail}</span>}
                </div>
            );
        }

        case 'candidates': {
            const maxHits = step.items.reduce((m, it) => Math.max(m, it.hits), 0);
            return (
                <div className="flex flex-wrap gap-1.5">
                    {step.items.map((it) => {
                        const lead = it.hits > 0 && it.hits === maxHits;
                        return (
                            <span
                                key={it.label}
                                className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs ${lead ? `${a.border} ${a.bgSoft} ${a.text} font-bold` : 'border-white/10 bg-slate-900/50 text-slate-400'}`}
                            >
                                {it.label}
                                <span className={`rounded px-1 font-mono text-[11px] ${lead ? a.solid + ' ' + a.solidText : 'bg-slate-800 text-slate-500'}`} dir="ltr">{it.hits}</span>
                            </span>
                        );
                    })}
                </div>
            );
        }

        case 'probabilities':
            return <ProbabilityBars items={step.items} accent={accent} />;

        case 'winner':
            return (
                <div className={`flex items-center justify-between rounded-lg border ${a.border} ${a.bgSoft} px-3 py-2`}>
                    <span className={`inline-flex items-center gap-2 font-bold ${a.text}`}>
                        <Trophy size={15} /> {step.label}
                    </span>
                    <span className="font-mono text-2xl font-black">
                        <AnimatedNumber value={step.value} className={`${a.barGradient} bg-clip-text text-transparent`} />
                        <span className={a.text}>%</span>
                    </span>
                </div>
            );

        case 'gap':
            return (
                <div dir="ltr" className="space-y-1.5">
                    <div className="relative h-7 w-full overflow-hidden rounded-lg border border-slate-700/50 bg-slate-800/50">
                        <motion.div
                            initial={reduce ? false : { width: 0 }}
                            animate={{ width: `${Math.max(0, Math.min(100, step.top))}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className={`absolute inset-y-0 left-0 ${a.barGradient} opacity-90`}
                        />
                        <div
                            className="absolute inset-y-0 z-10 border-l-2 border-dashed border-white/60"
                            style={{ left: `${Math.max(0, Math.min(100, step.second))}%` }}
                        />
                        <span className="absolute inset-y-0 left-2 flex items-center font-mono text-xs font-black text-slate-950/80">{step.top}%</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
                        <span>second {step.second}%</span>
                        <span className={`font-bold ${a.text}`}>gap = {step.margin}%</span>
                    </div>
                </div>
            );

        case 'confidence':
            return <ConfidenceMeter level={step.level} />;

        case 'decisionScene':
            return <DecisionMoment items={step.items} margin={step.margin} level={step.level} accent={accent} selectedLabel={visuals.journey.selectedLabel} />;

        case 'decision':
            return <DecisionCard decision={step.decision} />;

        case 'reply':
            return (
                <div className="flex items-start gap-2 rounded-2xl border border-white/10 bg-slate-800/70 px-3 py-2.5">
                    <Bot size={14} className="mt-0.5 shrink-0 text-slate-400" />
                    <span className="text-sm leading-relaxed text-slate-100">{step.text}</span>
                </div>
            );

        case 'station':
            // שלד שלב 1: עוגן טוקנים של המשפט הנבחר, לשמירת רציפות. סצנה קולנועית
            // ייעודית תולבש כאן בשלבים הבאים (חלון-הקשר, שכבות, וכו').
            if (!step.tokens.length) return <span className="text-xs text-slate-500">{ep.noTokens}</span>;
            return (
                <div className="flex flex-wrap gap-1.5" dir="auto">
                    {step.tokens.map((token, i) => (
                        <span
                            key={`${token}-${i}`}
                            className={`rounded-md border px-2 py-0.5 text-xs font-mono ${a.border} ${a.bgSoft} ${a.text}`}
                        >
                            {token}
                        </span>
                    ))}
                </div>
            );

        case 'embeddingScene': {
            // טוקני המשפט עפים מלמטה (טקסט) אל מרחב-משמעות דו-ממדי. המיקום נגזר
            // מ-hash יציב לכל טוקן (המחשה): כל טוקן הופך לנקודה במרחב, לא ערך במילון.
            const toks = step.tokens;
            if (!toks.length) return <span className="text-xs text-slate-500">{ep.noTokens}</span>;
            const posOf = (tok: string, i: number) => {
                let h = 0;
                for (let k = 0; k < tok.length; k++) h = (h * 31 + tok.charCodeAt(k)) % 997;
                return { x: 12 + (h % 76), y: 14 + ((h * 7 + i * 53) % 72) };
            };
            return (
                <div className="relative h-40 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950/50" dir="ltr">
                    <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                    {toks.map((tok, i) => {
                        const p = posOf(tok, i);
                        return (
                            <motion.span
                                key={`${tok}-${i}`}
                                dir="auto"
                                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-md border px-1.5 py-0.5 text-xs font-mono ${a.border} ${a.bgSoft} ${a.text}`}
                                initial={reduce ? false : { left: '50%', top: '112%', opacity: 0, scale: 0.6 }}
                                animate={{ left: `${p.x}%`, top: `${p.y}%`, opacity: 1, scale: 1 }}
                                transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.15 + i * 0.12, type: 'spring', stiffness: 120, damping: 16 }}
                            >
                                {tok}
                            </motion.span>
                        );
                    })}
                </div>
            );
        }

        case 'attentionScene': {
            // עמודת-שקילה מעל כל טוקן: כמה הטוקן המודגש (pivot, למשל שלילה) שוקל
            // אותו. השכנים גבוהים, הרחוקים נמוכים. זו שקילת-השפעה, לא ספירת מילים.
            const toks = step.tokens;
            if (!toks.length) return <span className="text-xs text-slate-500">{ep.noTokens}</span>;
            const f = Math.min(Math.max(0, step.pivot), toks.length - 1);
            const weightAt = (i: number) => (i === f ? 1 : Math.max(0.14, 1 - Math.abs(i - f) * 0.34));
            return (
                <div className="flex flex-wrap items-end justify-center gap-1.5" dir="auto">
                    {toks.map((tok, i) => {
                        const wi = weightAt(i);
                        const focus = i === f;
                        return (
                            <div key={`${tok}-${i}`} className="flex flex-col items-center gap-1">
                                <motion.span
                                    aria-hidden
                                    className={`w-6 rounded-t ${a.barGradient}`}
                                    initial={reduce ? false : { height: 0, opacity: 0 }}
                                    animate={{ height: 6 + wi * 34, opacity: focus ? 1 : 0.3 + wi * 0.5 }}
                                    transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.25 + i * 0.06, ease: 'easeOut' }}
                                />
                                <span className={`rounded-md border px-2 py-0.5 text-xs font-mono transition-colors ${focus ? `${a.solid} ${a.solidText} ${a.glow}` : `bg-slate-900/60 ${a.border} ${a.text}`}`}>
                                    {tok}
                                </span>
                            </div>
                        );
                    })}
                </div>
            );
        }

        case 'positionScene': {
            // הסדר הוא חלק מהמשמעות: כל טוקן מקבל תג-מיקום ומופיע ברצף (#1, #2...).
            const toks = step.tokens;
            if (!toks.length) return <span className="text-xs text-slate-500">{ep.noTokens}</span>;
            return (
                <div className="flex flex-wrap items-start justify-center gap-2" dir="auto">
                    {toks.map((tok, i) => (
                        <motion.div
                            key={`${tok}-${i}`}
                            initial={reduce ? false : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { delay: 0.1 + i * 0.13, type: 'spring', stiffness: 300, damping: 18 }}
                            className="flex flex-col items-center gap-1"
                        >
                            <span className={`rounded-md border px-2.5 py-1 text-xs font-mono ${a.border} ${a.bgSoft} ${a.text}`}>{tok}</span>
                            <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${a.solid} ${a.solidText} font-mono text-xs font-black`} dir="ltr">{i + 1}</span>
                        </motion.div>
                    ))}
                </div>
            );
        }

        case 'contextScene': {
            // מה שבחלון = מה שהמודל רואה עכשיו; מעבר לחלון עמום (לא נראה).
            const toks = step.tokens;
            if (!toks.length) return <span className="text-xs text-slate-500">{ep.noTokens}</span>;
            return (
                <div className="space-y-1.5" dir="auto">
                    <div className="flex items-center gap-1.5 opacity-30" aria-hidden>
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                        <span className="h-2 flex-1 rounded bg-slate-700/40" />
                    </div>
                    <motion.div
                        initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: reduce ? 0 : 0.4 }}
                        className={`relative overflow-hidden rounded-xl border-2 ${a.border} ${a.bgSoft} p-2.5 ${a.glow}`}
                    >
                        <div className="flex flex-wrap gap-1.5">
                            {toks.map((tok, i) => (
                                <motion.span
                                    key={`${tok}-${i}`}
                                    initial={reduce ? false : { opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : 0.2 + i * 0.08 }}
                                    className={`rounded-md border bg-slate-950/50 px-2 py-0.5 text-xs font-mono ${a.border} ${a.text}`}
                                >
                                    {tok}
                                </motion.span>
                            ))}
                        </div>
                        {!reduce && (
                            <motion.span
                                aria-hidden
                                className={`pointer-events-none absolute inset-y-0 w-10 ${a.bgSoft}`}
                                style={{ filter: 'blur(8px)' }}
                                initial={{ left: '-15%', opacity: 0 }}
                                animate={{ left: '115%', opacity: [0, 0.7, 0] }}
                                transition={{ duration: 1.1, delay: 0.5, ease: 'easeInOut' }}
                            />
                        )}
                    </motion.div>
                </div>
            );
        }

        case 'ffScene': {
            // feed-forward: הטוקנים עוברים בנק מומחים (רק כמה נדלקים) ויוצאים מועשרים.
            const toks = step.tokens;
            if (!toks.length) return <span className="text-xs text-slate-500">{ep.noTokens}</span>;
            const active = [1, 4];
            return (
                <div className="space-y-2" dir="auto">
                    <div className="flex items-center justify-center gap-1.5">
                        {Array.from({ length: 6 }).map((_, i) => {
                            const on = active.includes(i);
                            return (
                                <motion.span
                                    key={i}
                                    aria-hidden
                                    className={`h-6 w-6 rounded-md border ${on ? `${a.border} ${a.bgSoft} ${a.glow}` : 'border-white/10 bg-slate-950/50'}`}
                                    initial={reduce ? false : { opacity: on ? 0.4 : 0.3, scale: on ? 0.8 : 1 }}
                                    animate={on ? { opacity: 1, scale: [0.8, 1.1, 1] } : { opacity: 0.3, scale: 1 }}
                                    transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.2 + active.indexOf(i) * 0.15 }}
                                />
                            );
                        })}
                    </div>
                    <div className="flex flex-wrap justify-center gap-1.5">
                        {toks.map((tok, i) => (
                            <motion.span
                                key={`${tok}-${i}`}
                                initial={reduce ? false : { opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={reduce ? { duration: 0 } : { delay: 0.6 + i * 0.08, type: 'spring', stiffness: 300, damping: 18 }}
                                className={`rounded-md border px-2 py-0.5 text-xs font-mono ${a.border} ${a.bgSoft} ${a.text} ${a.glow}`}
                            >
                                {tok}
                            </motion.span>
                        ))}
                    </div>
                </div>
            );
        }

        case 'layersScene': {
            // מגדל עומק: אותו בלוק חוזר בשכבות רבות, וההבנה של המשפט מתחדדת.
            const toks = step.tokens;
            if (!toks.length) return <span className="text-xs text-slate-500">{ep.noTokens}</span>;
            const N = 8;
            return (
                <div className="flex items-center gap-3" dir="auto">
                    <div className="flex w-12 shrink-0 flex-col items-center">
                        <span aria-hidden className="mb-1 text-sm font-black leading-none text-slate-600">⋮</span>
                        <div className="flex flex-col-reverse gap-1">
                            {Array.from({ length: N }).map((_, i) => (
                                <motion.span
                                    key={i}
                                    aria-hidden
                                    className={`h-2 w-8 rounded-sm ${a.solid}`}
                                    initial={reduce ? false : { opacity: 0.2, scaleX: 0.6 }}
                                    animate={{ opacity: 0.35 + (i / N) * 0.65, scaleX: 1 }}
                                    transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : i * 0.08 }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-1 flex-wrap gap-1.5">
                        {toks.map((tok, i) => (
                            <motion.span
                                key={`${tok}-${i}`}
                                initial={reduce ? false : { opacity: 0.4 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.3 + i * 0.05 }}
                                className={`rounded-md border px-2 py-0.5 text-xs font-mono ${a.border} ${a.bgSoft} ${a.text}`}
                            >
                                {tok}
                            </motion.span>
                        ))}
                    </div>
                </div>
            );
        }

        case 'stateScene': {
            // המשפט נדחס לייצוג פנימי אחד: הטוקנים מתכנסים אל ליבה זוהרת אחת.
            const toks = step.tokens.slice(0, 8);
            if (!toks.length) return <span className="text-xs text-slate-500">{ep.noTokens}</span>;
            return (
                <div className="relative mx-auto h-32 w-full max-w-[16rem]" dir="auto">
                    {toks.map((tok, i) => {
                        // מעגל למספר שלם: float ארוך יוצר אי-התאמת hydration בין SSR ללקוח.
                        const ang = (i / toks.length) * Math.PI * 2;
                        const x = Math.round(50 + Math.cos(ang) * 36);
                        const y = Math.round(50 + Math.sin(ang) * 36);
                        return (
                            <motion.span
                                key={`${tok}-${i}`}
                                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-md border bg-slate-950/60 px-1.5 py-0.5 text-xs font-mono ${a.border} ${a.text}`}
                                initial={reduce ? { left: '50%', top: '50%', opacity: 0 } : { left: `${x}%`, top: `${y}%`, opacity: 1 }}
                                animate={reduce ? { opacity: 0 } : { left: '50%', top: '50%', opacity: [1, 1, 0], scale: 0.4 }}
                                transition={{ duration: reduce ? 0 : 0.85, delay: reduce ? 0 : 0.5 + i * 0.06, ease: 'easeIn' }}
                            >
                                {tok}
                            </motion.span>
                        );
                    })}
                    <motion.div
                        aria-hidden
                        className={`absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full ${a.barGradient} ${a.glow}`}
                        initial={reduce ? false : { scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={reduce ? { duration: 0 } : { delay: 1.2, type: 'spring', stiffness: 220, damping: 16 }}
                    />
                </div>
            );
        }

        case 'agentStub':
            // שלד Agent (Step 1): צ'יפים (כלים/כלי-נבחר), תג MCP וסמן-לולאה. יולבש
            // בסצנה קולנועית ייעודית בשלב 2 (בחירת-כלי, קריאת-MCP, לולאה).
            return (
                <div className="flex flex-wrap items-center gap-1.5" dir="auto">
                    {step.loop && (
                        <span aria-hidden className={`inline-flex h-6 w-6 items-center justify-center rounded-md ${a.bgSoft} text-base font-black ${a.text}`}>↻</span>
                    )}
                    {step.chips.map((c, i) => (
                        <span key={`${c}-${i}`} className={`rounded-md border px-2 py-0.5 text-xs font-mono ${a.border} ${a.bgSoft} ${a.text}`}>{c}</span>
                    ))}
                    {step.mcp && (
                        <span className={`inline-flex items-center rounded-md ${a.solid} ${a.solidText} px-2 py-0.5 font-mono text-xs font-black`}>MCP</span>
                    )}
                </div>
            );

        case 'loopScene': {
            // לולאת-הסוכן: 4 צמתים על מעגל, פולס שמסתובב = הלולאה חוזרת, ומתחת -
            // התוצאות האפשריות (המשך / שאל / עצור / סיים). זו החתימה של סוכן מול Chat.
            const nodes = step.nodes;
            const posN = [{ top: '3%', left: '50%' }, { top: '50%', left: '93%' }, { top: '93%', left: '50%' }, { top: '50%', left: '7%' }];
            return (
                <div dir="auto">
                    <div className="relative mx-auto h-44 w-44">
                        <div className={`absolute inset-5 rounded-full border-2 border-dashed ${a.border}`} aria-hidden />
                        {!reduce && (
                            <motion.div className="absolute inset-5" aria-hidden animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}>
                                <span className={`absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full ${a.solid} ${a.glow}`} />
                            </motion.div>
                        )}
                        {nodes.map((n, i) => (
                            <motion.span
                                key={`${n}-${i}`}
                                initial={reduce ? false : { scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={reduce ? { duration: 0 } : { delay: 0.15 + i * 0.15, type: 'spring', stiffness: 300, damping: 18 }}
                                style={posN[i]}
                                className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border bg-slate-950/85 px-2 py-0.5 text-xs font-bold ${a.border} ${a.text}`}
                            >
                                {n}
                            </motion.span>
                        ))}
                    </div>
                    <div className="mt-1 flex flex-wrap justify-center gap-1.5">
                        {step.outcomes.map((o, i) => (
                            <span key={`${o}-${i}`} className={`rounded-full border border-white/12 px-2.5 py-0.5 text-xs font-bold text-slate-300`}>{o}</span>
                        ))}
                    </div>
                </div>
            );
        }

        case 'mcpScene': {
            // גשר MCP: הסוכן קורא דרך שכבת MCP אל כלי חיצוני, והתוצאה חוזרת. MCP
            // מודגש כשכבת-החיבור. פולסים זורמים למטה (בקשה) ומעלה (תוצאה).
            const wire = (delay: number) => (
                <span className="relative h-4 w-0.5 overflow-hidden bg-white/15" aria-hidden>
                    {!reduce && (
                        <motion.span
                            className={`absolute inset-x-0 h-1.5 ${a.solid}`}
                            initial={{ top: '-50%', opacity: 0 }}
                            animate={{ top: '110%', opacity: [0, 1, 0] }}
                            transition={{ duration: 0.6, delay, repeat: Infinity, repeatDelay: 1.6, ease: 'easeIn' }}
                        />
                    )}
                </span>
            );
            return (
                <div className="flex flex-col items-center gap-1" dir="auto">
                    <span className={`rounded-lg border px-3 py-1 text-xs font-bold ${a.border} ${a.bgSoft} ${a.text}`}>{step.agentLabel}</span>
                    {wire(0.2)}
                    <span className={`rounded-lg border-2 px-3 py-1 font-mono text-xs font-black ${a.border} ${a.solid} ${a.solidText} ${a.glow}`}>{step.mcpLabel}</span>
                    {wire(0.5)}
                    <span className={`rounded-lg border px-3 py-1 text-xs font-bold ${a.border} ${a.bgSoft} ${a.text}`}>{step.toolLabel}</span>
                    <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="text-xs text-slate-500" dir="ltr">↩</span>
                        <span className={`rounded-md border bg-slate-900/50 px-2 py-0.5 text-xs font-mono ${a.border} ${a.text}`}>{step.resultLabel}</span>
                    </div>
                </div>
            );
        }

        case 'guardrailScene': {
            // שער-בקרה: פעולה רגישה נעצרת ודורשת אישור (אדום, רעד); בטוחה עוברת
            // (ירוק). מתחת - ארבע התוצאות האפשריות, המתאימה מודגשת. לא אוטומטי.
            const sensitive = step.sensitive;
            const outcomes = [step.safe, step.ask, step.approve, step.stop];
            const activeIdx = sensitive ? 2 : 0;
            return (
                <div className="space-y-2.5" dir="auto">
                    <div className="flex justify-center">
                        <motion.div
                            className={`inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-black ${sensitive ? 'border-rose-500/60 bg-rose-900/20 text-rose-300' : 'border-emerald-500/50 bg-emerald-900/15 text-emerald-300'}`}
                            initial={reduce ? false : { scale: 0.9, opacity: 0 }}
                            animate={reduce ? { opacity: 1 } : { scale: sensitive ? [0.9, 1.06, 1] : 1, opacity: 1, x: sensitive ? [0, -4, 4, -2, 0] : 0 }}
                            transition={{ delay: reduce ? 0 : 0.35, duration: 0.5 }}
                        >
                            {sensitive ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                            <span>{sensitive ? step.approve : step.safe}</span>
                        </motion.div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1.5">
                        {outcomes.map((o, i) => (
                            <span key={`${o}-${i}`} className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${i === activeIdx ? `${a.border} ${a.bgSoft} ${a.text}` : 'border-white/10 text-slate-500'}`}>{o}</span>
                        ))}
                    </div>
                </div>
            );
        }

        default:
            return null;
    }
};

/* ════════════════════════ הפאנל ══════════════════════════════════════════ */

export const GlassEnginePanel: React.FC<GlassEnginePanelProps> = ({ title, subtitle, accent, replayKey, steps, liveTokenCount, highlightToken, onTokenHover }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const { t, dir } = useT();
    const isRtl = dir === 'rtl';
    // גדל בגובה במסך מלא כדי לנצל את המסך (מ-lg ומעלה, כמו כרטיס הצ'אט הצמוד).
    const expanded = useContext(ExpandableLabContext);
    const panelHeight = expanded ? 'h-[640px] lg:h-[calc(100vh-6rem)]' : 'h-[640px]';
    const ep = t.behindAi.chapter1.visuals.enginePanel;
    const jr = t.behindAi.chapter1.visuals.journey;

    const actOrder = useMemo(() => {
        const seen: string[] = [];
        for (const s of steps) if (!seen.includes(s.act)) seen.push(s.act);
        return seen;
    }, [steps]);

    // גוון גל-השיא נגזר מסוג ההחלטה הסופית.
    const climaxRgb = useMemo(() => {
        const d = steps.find((s) => s.kind === 'decision');
        return d && d.kind === 'decision' ? CLIMAX_RGB[d.decision.kind] : null;
    }, [steps]);

    // הצומת ה"נוכחי" בצינור: שלב ההחלטה (השיא). אם אין שלב decision, ברירת המחדל
    // היא הצומת האחרון. שאר הצמתים נחשבים completed (חושבו). אין מצב pending בריצה
    // הזו - כל התחנות נגזרות יחד - אך הרכיב תומך בו לשימוש חוזר.
    const currentIdx = useMemo(() => {
        const d = steps.findIndex((s) => s.kind === 'decision');
        return d >= 0 ? d : steps.length - 1;
    }, [steps]);

    // עוגן קבוע: טוקני המשפט הנבחר, שנשארים גלויים בזמן גלילה דרך כל התחנות, כדי
    // שהלומד ירגיש שאותו משפט זורם דרך כל המנוע עד התשובה.
    const anchorTokens = useMemo(() => {
        const s = steps.find((x) => x.kind === 'tokens');
        return s && s.kind === 'tokens' ? s.tokens : [];
    }, [steps]);

    // גלילה חזרה לראש "מסע המשפט" בכל בחירת משפט חדש או החלפת מצב (Chat/Agent):
    // replayKey משתנה בשליחה ובהחלפת מצב, אז הלומד תמיד מתחיל מתחילת התחנות.
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }, [replayKey]);

    return (
        <div className={`relative flex ${panelHeight} flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80`} dir={dir}>
            {/* רקע גריד */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '22px 22px' }}
            />
            <div className={`pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full blur-[80px] ${a.bgSoft}`} />

            {/* סריקת x-ray הולוגרפית */}
            {!reduce && (
                <motion.div
                    key={`scan-${replayKey}`}
                    initial={{ y: '-20%', opacity: 0 }}
                    animate={{ y: '120%', opacity: [0, 0.6, 0] }}
                    transition={{ duration: 1.3, ease: 'easeInOut' }}
                    className={`pointer-events-none absolute inset-x-0 z-10 h-28 ${a.bgSoft} blur-2xl`}
                />
            )}

            {/* גל-שיא: כשההחלטה מתגבשת, בלום-אור רץ אחורה דרך הצינור, בגוון ההחלטה */}
            {!reduce && climaxRgb && (
                <motion.div
                    key={`climax-${replayKey}`}
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 z-20 h-44 blur-3xl"
                    style={{ background: `radial-gradient(ellipse at center, rgba(${climaxRgb},0.5), transparent 70%)` }}
                    initial={{ bottom: '-25%', opacity: 0 }}
                    animate={{ bottom: '120%', opacity: [0, 0.6, 0] }}
                    transition={{ duration: 1.0, delay: 1.05, ease: 'easeOut' }}
                />
            )}

            {/* כותרת: שורה עליונה (אייקון + eyebrow + תג התחנות), ואז הכותרת ברוחב
                מלא. כך כותרת ארוכה (למשל "Action Decision Engine" ב-Agent) לא נשברת
                לשלוש שורות צפופות ויש לה מקום. */}
            <div className="relative border-b border-white/10 p-5 shrink-0">
                {/* שורה עליונה: אייקון + תג התחנות. הכותרת (eyebrow + שם המנוע) יורדת
                    מתחת ברוחב מלא, כדי שכותרת ארוכה כמו "Action Decision Engine"
                    (Agent) לא תישבר לשלוש שורות צפופות. */}
                <div className="flex items-center justify-between gap-3">
                    {/* אייקון סטטי (בלי סיבוב אינסופי) - חלק מריסון התנועה המתמדת. */}
                    <div className={`shrink-0 rounded-xl border border-white/10 bg-slate-900 p-2 ${a.text}`}>
                        <Cpu size={18} />
                    </div>
                    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border ${a.border} ${a.bgSoft} px-2.5 py-1 font-mono text-xs font-bold ${a.text}`}>
                        <Sparkles size={11} /> {ep.stations}
                    </span>
                </div>
                <div className="mt-2 font-mono text-xs uppercase tracking-wide text-slate-500">Transparent Engine</div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={title}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className={`text-xl font-black leading-tight ${a.text}`}>{title}</div>
                        {subtitle && <div className="mt-0.5 text-xs text-slate-400">{subtitle}</div>}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* גוף הצינור */}
            <div ref={scrollRef} className="custom-scrollbar relative flex-1 overflow-y-auto p-5">
                {/* מסגור-אמת: התחנות הן המחשה של העקרונות האוניברסליים על המשפט האמיתי
                    שהוזן, לא פלט-פנים אמיתי של המודל. סטטי (בלי אנימציה) לרוגע ולנגישות. */}
                <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-white/10 bg-slate-900/40 px-3.5 py-3">
                    <Scan size={14} className={`mt-0.5 shrink-0 ${a.text} opacity-80`} />
                    <div className="min-w-0">
                        <div className={`text-sm font-black ${a.text}`}>{ep.illustrationTitle}</div>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-slate-400">{ep.illustrationBody}</p>
                    </div>
                </div>

                {/* עוגן קבוע: המשפט הנבחר כטוקנים, נדבק לראש בזמן גלילה כדי שהלומד
                    ירגיש שאותו משפט זורם דרך כל 14 התחנות עד התשובה. */}
                {anchorTokens.length > 0 && (
                    <div className="sticky top-0 z-20 -mx-1 mb-3 rounded-xl border border-white/10 bg-slate-950/90 px-3 py-2 backdrop-blur-sm">
                        <div className={`mb-1 flex items-center gap-1.5 text-[13px] font-bold ${a.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${a.solid}`} aria-hidden />
                            {jr.anchorLabel}
                        </div>
                        <div className="flex flex-wrap gap-1" dir="auto">
                            {anchorTokens.map((token, i) => (
                                <span
                                    key={`anchor-${token}-${i}`}
                                    className={`rounded border bg-slate-900/60 px-1.5 py-0.5 text-xs font-mono ${a.border} ${a.text}`}
                                >
                                    {token}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <motion.div
                    key={replayKey}
                    variants={container}
                    initial={reduce ? false : 'hidden'}
                    animate="show"
                >
                    {steps.map((step, i) => {
                        const showActHeader = step.act !== (i > 0 ? steps[i - 1].act : undefined);
                        const isLast = i === steps.length - 1;
                        return (
                            <React.Fragment key={step.id}>
                                {showActHeader && (
                                    <motion.div variants={reduce ? undefined : itemVar} className={`flex items-center gap-2.5 ${i === 0 ? 'pb-3' : 'pb-3 pt-5'}`}>
                                        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-black ${a.border} ${a.bgSoft} ${a.text}`}>
                                            <span>{ep.actLabel}</span>
                                            <span dir="ltr">{actOrder.indexOf(step.act) + 1}/{actOrder.length}</span>
                                        </span>
                                        <span className={`text-sm font-black tracking-wide ${a.text}`}>{step.act}</span>
                                        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-600" dir="ltr">{step.actEn}</span>
                                        <span className="h-px flex-1 bg-white/10" />
                                    </motion.div>
                                )}

                                <motion.div variants={reduce ? undefined : itemVar} className="flex gap-3">
                                    {/* צינור נקודות-ביקורת עצביות: צומת לכל שלב + spine כמוליך אנרגיה */}
                                    <div className="relative flex shrink-0 flex-col items-center">
                                        {/* מחבר אופקי זעיר: קו עדין מקצה הכרטיס אל הצומת, תלוי-כיוון */}
                                        <span
                                            aria-hidden
                                            className={`absolute top-3.5 ${isRtl ? 'right-full' : 'left-full'} h-px w-2.5 -translate-y-1/2 ${a.text}`}
                                            style={{ background: `linear-gradient(to ${isRtl ? 'right' : 'left'}, transparent, currentColor)`, opacity: 0.45 }}
                                        />
                                        <ProcessCheckpointNode
                                            state={i === currentIdx ? 'current' : 'completed'}
                                            accent={accent}
                                            reduce={!!reduce}
                                            index={i}
                                            label={step.title}
                                            coreClass={STATION_DOTS[i % STATION_DOTS.length]}
                                        />
                                        {!isLast && (
                                            // spine: מוליך נתונים דק עם גרדיאנט; הקטע שמוביל אל הצומת הנוכחי זוהר מעט
                                            <div
                                                aria-hidden
                                                className={`relative mt-1 w-0.5 flex-1 overflow-hidden rounded-full ${i + 1 === currentIdx ? a.text : ''}`}
                                                style={{
                                                    background: i + 1 === currentIdx
                                                        ? 'linear-gradient(to bottom, transparent, currentColor)'
                                                        : 'linear-gradient(to bottom, rgb(255 255 255 / 0.16), rgb(255 255 255 / 0.04))',
                                                    opacity: i + 1 === currentIdx ? 0.5 : 1,
                                                }}
                                            >
                                                {/* חבילת-נתונים זוהרת שזורמת במורד הצינור בין הצמתים, פעם אחת בכל
                                                    ריצה (ה-key על ההורה מנגן מחדש בכל שליחה/החלפה). מפל-זרימה יחיד
                                                    ואז הפאנל נח - במקום לולאה אינסופית שלא מרגיעה את המסך. */}
                                                {!reduce && (
                                                    <motion.span
                                                        className={`absolute inset-x-0 h-4 rounded-full ${a.barGradient}`}
                                                        style={{ filter: 'blur(0.4px)' }}
                                                        initial={{ top: '-25%', opacity: 0 }}
                                                        animate={{ top: '110%', opacity: [0, 0.9, 0.9, 0] }}
                                                        transition={{ duration: 1.3, ease: 'easeIn', delay: 0.25 + i * 0.16 }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* כרטיס השלב */}
                                    <div className="min-w-0 flex-1 pb-4">
                                        <div className={`group rounded-2xl border p-3.5 transition-colors
                                            ${stepLinked(step, highlightToken) ? `${a.border} ${a.bgSoft} ring-1 ${a.ringSoft}` : 'border-white/10 bg-slate-900/40 hover:border-white/20'}`}>
                                            <div className="mb-2 flex items-baseline justify-between gap-2">
                                                <span className="text-sm font-bold text-white">{step.title}</span>
                                                <span className="font-mono text-[11px] uppercase tracking-widest text-slate-500" dir="ltr">{step.titleEn}</span>
                                            </div>
                                            <StepVisual step={step} accent={accent} reduce={!!reduce} highlightToken={highlightToken} onTokenHover={onTokenHover} />
                                            {step.kind === 'count' && liveTokenCount != null && (
                                                <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-emerald-500/30 bg-emerald-900/10 px-2.5 py-1.5">
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                                                        <Sparkles size={12} /> {ep.claudeTokens(liveTokenCount)}
                                                    </span>
                                                    <span className="text-[11px] leading-relaxed text-slate-400">
                                                        {ep.claudeNote}
                                                    </span>
                                                </div>
                                            )}
                                            <p className="mt-2.5 flex items-start gap-1.5 text-xs leading-relaxed text-slate-400">
                                                <Scan size={11} className={`mt-0.5 shrink-0 ${a.text} opacity-70`} />
                                                <span>{step.note}</span>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </React.Fragment>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
};
