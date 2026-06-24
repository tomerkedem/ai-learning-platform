"use client";

import React, { useEffect, useMemo } from 'react';
import {
    motion, AnimatePresence, useMotionValue, useTransform, animate, useReducedMotion, type Variants,
} from 'framer-motion';
import {
    Cpu, CheckCircle2, XCircle, Hash, Scan, Trophy, Sparkles, Bot,
} from 'lucide-react';

import { ACCENTS } from '@/components/ai-internals/accents';
import { ProbabilityBars } from '@/components/ai-internals/ProbabilityBars';
import { ConfidenceMeter } from '@/components/ai-internals/ConfidenceMeter';
import { DecisionCard } from '@/components/ai-internals/DecisionCard';
import type { Accent, DecisionKind } from '@/components/ai-internals/types';

import type { EngineTraceStep } from './engineTrace';

interface GlassEnginePanelProps {
    title: string;
    subtitle?: string;
    accent: Accent;
    replayKey: string | number;
    steps: EngineTraceStep[];
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
                    <span className="text-xs text-slate-500">רווחים מיותרים נחתכו לעומת הקלט המקורי.</span>
                </div>
            ) : (
                <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-900/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                    <CheckCircle2 size={14} /> הקלט כבר נקי - אין מה לתקן
                </div>
            );

        case 'tokens':
            if (!step.tokens.length) return <span className="text-xs text-slate-500">אין טוקנים עדיין.</span>;
            return (
                <div className="flex flex-wrap gap-2" dir="rtl">
                    {step.tokens.map((token, i) => {
                        const hl = highlightToken === token;
                        return (
                            <motion.span
                                key={`${token}-${i}`}
                                initial={reduce ? false : { opacity: 0, y: 8, scale: 0.85 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3, delay: reduce ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                onMouseEnter={() => onTokenHover?.(token)}
                                onMouseLeave={() => onTokenHover?.(null)}
                                onClick={() => onTokenHover?.(hl ? null : token)}
                                className={`cursor-pointer rounded-lg border px-2.5 py-1 text-xs font-mono transition-colors
                                    ${hl ? `${a.solid} ${a.solidText} ${a.glow}` : `bg-slate-900/60 ${a.border} ${a.text}`}`}
                            >
                                {token}
                            </motion.span>
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
                                    <span className="text-xs text-slate-600">- אין התאמה</span>
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

        case 'decision':
            return <DecisionCard decision={step.decision} />;

        case 'reply':
            return (
                <div className="flex items-start gap-2 rounded-2xl border border-white/10 bg-slate-800/70 px-3 py-2.5">
                    <Bot size={14} className="mt-0.5 shrink-0 text-slate-400" />
                    <span className="text-sm leading-relaxed text-slate-100">{step.text}</span>
                </div>
            );

        default:
            return null;
    }
};

/* ════════════════════════ הפאנל ══════════════════════════════════════════ */

export const GlassEnginePanel: React.FC<GlassEnginePanelProps> = ({ title, subtitle, accent, replayKey, steps, highlightToken, onTokenHover }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];

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

    return (
        <div className="relative flex h-[640px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80" dir="rtl">
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

            {/* כותרת */}
            <div className="relative flex items-center justify-between gap-3 border-b border-white/10 p-5 shrink-0">
                <div className="flex items-center gap-3">
                    <div className={`rounded-xl border border-white/10 bg-slate-900 p-2 ${a.text}`}>
                        <motion.div animate={reduce ? undefined : { rotate: [0, 8, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
                            <Cpu size={18} />
                        </motion.div>
                    </div>
                    <div className="overflow-hidden">
                        <div className="font-mono text-[11px] uppercase tracking-widest text-slate-500">Transparent Engine</div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={title}
                                initial={reduce ? false : { opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                                transition={{ duration: 0.25 }}
                            >
                                <div className={`text-lg font-black ${a.text}`}>{title}</div>
                                {subtitle && <div className="text-xs text-slate-400">{subtitle}</div>}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border ${a.border} ${a.bgSoft} px-2.5 py-1 font-mono text-[11px] font-bold ${a.text}`}>
                    <Sparkles size={11} /> {steps.length} שלבים
                </span>
            </div>

            {/* גוף הצינור */}
            <div className="custom-scrollbar relative flex-1 overflow-y-auto p-5">
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
                                            <span>מערכה</span>
                                            <span dir="ltr">{actOrder.indexOf(step.act) + 1}/{actOrder.length}</span>
                                        </span>
                                        <span className={`text-sm font-black tracking-wide ${a.text}`}>{step.act}</span>
                                        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-600" dir="ltr">{step.actEn}</span>
                                        <span className="h-px flex-1 bg-white/10" />
                                    </motion.div>
                                )}

                                <motion.div variants={reduce ? undefined : itemVar} className="flex gap-3">
                                    {/* רכבת מספור + connector */}
                                    <div className="flex shrink-0 flex-col items-center">
                                        <div className={`relative flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${a.solid} ${a.solidText}`}>
                                            {i + 1}
                                            {!reduce && (
                                                <motion.span
                                                    className={`absolute inset-0 rounded-full ${a.solid}`}
                                                    initial={{ opacity: 0.4, scale: 1 }}
                                                    animate={{ opacity: 0, scale: 1.8 }}
                                                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: i * 0.08 }}
                                                />
                                            )}
                                        </div>
                                        {!isLast && (
                                            <div className="relative mt-1 w-0.5 flex-1 overflow-hidden rounded-full bg-white/10">
                                                {/* פולס אנרגיה שזורם במורד הצינור */}
                                                {!reduce && (
                                                    <motion.div
                                                        className={`absolute inset-x-0 h-6 rounded-full ${a.barGradient}`}
                                                        initial={{ y: '-140%' }}
                                                        animate={{ y: '700%' }}
                                                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeIn', delay: i * 0.16 }}
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
