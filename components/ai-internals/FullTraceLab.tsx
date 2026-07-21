'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    AppWindow, BrainCircuit, CheckCircle2, ChevronLeft, ChevronRight, CircleStop,
    ExternalLink, History, UserRound, Info, RefreshCcw, RotateCcw, ShieldCheck, Wrench,
} from 'lucide-react';
import type { FullTraceLabContent, TraceLayer } from '@/i18n/locales/he/behind-ai/fullTraceLab';
import type { Locale } from '@/i18n/config';
import { SpeakButton } from './SpeakButton';

interface FullTraceLabProps {
    data: FullTraceLabContent;
    dir: 'rtl' | 'ltr';
    speechLocale: Locale;
    onNarrationChange?: (text: string) => void;
}

type ApprovalState = 'pending' | 'denied' | 'approved' | 'accepted' | 'rejected';
type ToolErrorState = 'idle' | 'first' | 'exhausted';

const LAYER_STYLE: Record<TraceLayer, { Icon: React.ComponentType<{ size?: number; className?: string }>; cls: string }> = {
    model: { Icon: BrainCircuit, cls: 'border-violet-400/45 bg-violet-950/25 text-violet-100' },
    product: { Icon: AppWindow, cls: 'border-sky-400/45 bg-sky-950/25 text-sky-100' },
    tool: { Icon: Wrench, cls: 'border-amber-400/45 bg-amber-950/25 text-amber-100' },
    human: { Icon: UserRound, cls: 'border-emerald-400/45 bg-emerald-950/25 text-emerald-100' },
    offline: { Icon: History, cls: 'border-slate-400/45 bg-slate-800/45 text-slate-100' },
};

const joinSpeech = (...parts: Array<string | undefined>) => parts.filter(Boolean).join('. ');

export const FullTraceLab: React.FC<FullTraceLabProps> = ({ data, dir, speechLocale, onNarrationChange }) => {
    const reduce = useReducedMotion();
    const isRtl = dir === 'rtl';
    const [index, setIndex] = useState(0);
    const [toolError, setToolError] = useState<ToolErrorState>('idle');
    const [approval, setApproval] = useState<ApprovalState>('pending');
    const active = data.stages[index];
    const layer = data.layers[active.layer];
    const layerStyle = LAYER_STYLE[active.layer];
    const LayerIcon = layerStyle.Icon;
    const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
    const NextIcon = isRtl ? ChevronLeft : ChevronRight;

    const finalStatus = approval === 'accepted' ? data.finalStatuses.success
        : approval === 'rejected' || toolError === 'exhausted' ? data.finalStatuses.failed
            : approval === 'denied' ? data.finalStatuses.denied : data.finalStatuses.waiting;

    const branchNarration = useMemo(() => {
        const toolText = toolError === 'first' ? data.branches.toolError.first : toolError === 'exhausted' ? data.branches.toolError.exhausted : undefined;
        const approvalText = approval === 'denied' ? data.branches.approval.denied
            : approval === 'approved' ? data.branches.approval.approved
                : approval === 'accepted' ? data.branches.approval.verifyAccepted
                    : approval === 'rejected' ? data.branches.approval.verifyRejected : data.branches.approval.pending;
        return joinSpeech(toolText, approvalText, `${data.labels.output}: ${finalStatus}`);
    }, [approval, data, finalStatus, toolError]);

    const stageNarration = useMemo(() => joinSpeech(
        `${data.layerHeading}: ${layer.label}, ${layer.description}`,
        `${data.labels.stage}: ${active.title}`,
        `${data.labels.input}: ${active.input}`,
        `${data.labels.process}: ${active.process}`,
        `${data.labels.output}: ${active.output}`,
        active.branchReason ? `${data.labels.branchReason}: ${active.branchReason}` : undefined,
        active.stopReason ? `${data.labels.stopReason}: ${active.stopReason}` : undefined,
        active.id === 'verification' ? branchNarration : undefined,
    ), [active, branchNarration, data, layer]);

    useEffect(() => onNarrationChange?.(stageNarration), [onNarrationChange, stageNarration]);

    const go = (next: number) => setIndex(Math.max(0, Math.min(data.stages.length - 1, next)));
    const reset = () => { setIndex(0); setToolError('idle'); setApproval('pending'); };
    const selectBranchStage = (id: string) => { const next = data.stages.findIndex((stage) => stage.id === id); if (next >= 0) setIndex(next); };
    const visibleStatus = (stageId: string, fallback: keyof FullTraceLabContent['statusLabels']) =>
        stageId === 'verification' && (approval === 'pending' || approval === 'denied') ? 'skipped' : fallback;

    return (
        <div className="rounded-2xl border border-indigo-500/25 bg-slate-900/55 p-4 text-start sm:p-5" dir={dir}>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 text-sm font-black text-white"><ShieldCheck size={18} />{data.heading}</div>
                    <div className="mt-1 text-[11px] font-bold tracking-[0.16em] text-slate-500" dir="ltr">{data.kicker}</div>
                </div>
                <div className="flex items-center gap-2">
                    <SpeakButton text={stageNarration} speechLocale={speechLocale} />
                    <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-600/60 px-3 py-2 text-xs font-bold text-slate-200 hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
                        <RotateCcw size={14} aria-hidden />{data.labels.reset}
                    </button>
                </div>
            </div>

            <div className="mb-4 rounded-xl border border-slate-700/60 bg-slate-950/45 p-3.5">
                <div className="text-xs font-bold text-slate-400">{data.promptLabel}</div>
                <p className="mt-1 text-sm font-bold leading-relaxed text-slate-100">{data.prompt}</p>
            </div>

            <div className="mb-4 rounded-xl border border-indigo-400/25 bg-indigo-950/15 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-black text-indigo-100"><Info size={14} />{data.layerHeading}</div>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
                    {(Object.keys(data.layers) as TraceLayer[]).map((key) => {
                        const item = data.layers[key]; const st = LAYER_STYLE[key]; const Icon = st.Icon; const selected = key === active.layer;
                        return <div key={key} className={`rounded-lg border px-2.5 py-2 ${selected ? st.cls : 'border-slate-700/45 bg-slate-950/30 text-slate-400'}`} aria-current={selected ? 'true' : undefined}>
                            <div className="flex items-center gap-1.5 text-[11px] font-black"><Icon size={13} aria-hidden />{item.label}</div>
                            {selected && <div className="mt-1 text-[11px] leading-snug">{item.description}</div>}
                        </div>;
                    })}
                </div>
            </div>

            <p className="mb-4 rounded-xl border border-slate-700/50 bg-slate-950/30 p-3 text-xs leading-relaxed text-slate-300">{data.variabilityNote}</p>

            <div className="grid gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]">
                <nav className="min-w-0" aria-label={data.sr.stageGroup}>
                    <div className="mb-2 text-xs font-bold text-slate-400">{data.labels.selectStage}</div>
                    <div className="flex snap-x gap-2 overflow-x-auto pb-2 lg:grid lg:max-h-[36rem] lg:grid-cols-1 lg:overflow-y-auto lg:overflow-x-hidden">
                        {data.stages.map((stage, i) => {
                            const selected = i === index; const st = LAYER_STYLE[stage.layer]; const stageStatus = visibleStatus(stage.id, stage.status);
                            return <button key={stage.id} type="button" onClick={() => go(i)} aria-pressed={selected} aria-current={selected ? 'step' : undefined}
                                className={`min-w-[12rem] snap-start rounded-xl border p-2.5 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 lg:min-w-0 ${selected ? st.cls : 'border-slate-700/50 bg-slate-950/35 text-slate-300 hover:border-slate-500'}`}>
                                <span className="flex items-center justify-between gap-2"><span className="text-xs font-black">{i + 1}. {stage.tab}</span><span className="rounded-md border border-current/25 px-1.5 py-0.5 text-[10px]">{data.statusLabels[stageStatus]}</span></span>
                                <span className="mt-1 block text-[10px] opacity-75">{data.layers[stage.layer].label}</span>
                            </button>;
                        })}
                    </div>
                </nav>

                <motion.section key={active.id} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={reduce ? { duration: 0 } : { duration: 0.2 }} aria-label={data.sr.stageDetail} className="min-w-0 space-y-3">
                    <div className={`rounded-xl border p-4 ${layerStyle.cls}`}>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-black"><span className="inline-flex items-center gap-1.5"><LayerIcon size={15} />{layer.label}</span><span>{data.statusLabels[visibleStatus(active.id, active.status)]}</span></div>
                        <h3 className="mt-2 text-xl font-black text-white">{active.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed opacity-90">{active.refresher}</p>
                    </div>
                    {[[data.labels.input, active.input], [data.labels.process, active.process], [data.labels.output, active.output]].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-700/50 bg-slate-950/35 p-3.5"><div className="text-[11px] font-black uppercase tracking-wider text-indigo-300">{label}</div><p className="mt-1 break-words text-sm leading-relaxed text-slate-200">{value}</p></div>)}
                    {active.facts && <dl className="grid gap-2 sm:grid-cols-2">{active.facts.map((fact) => <div key={fact.label} className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-3"><dt className="text-xs font-black text-slate-300">{fact.label}</dt><dd className="mt-1 text-xs leading-relaxed text-slate-400">{fact.value}</dd></div>)}</dl>}
                    {active.details && <details className="rounded-xl border border-slate-600/50 bg-slate-950/40 p-3 open:border-indigo-400/40"><summary className="cursor-pointer text-sm font-black text-indigo-200">{active.details.label}</summary><ul className="mt-3 space-y-2">{active.details.items.map((item) => <li key={item} className="text-sm leading-relaxed text-slate-300">• {item}</li>)}</ul></details>}
                    {active.branchReason && <div className="rounded-xl border border-amber-400/35 bg-amber-950/15 p-3 text-sm text-amber-100"><b>{data.labels.branchReason}:</b> {active.branchReason}</div>}
                    {active.stopReason && <div className="rounded-xl border border-rose-400/35 bg-rose-950/15 p-3 text-sm text-rose-100"><b>{data.labels.stopReason}:</b> {active.stopReason}</div>}
                </motion.section>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-700/50 pt-4">
                <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-slate-200 disabled:opacity-35"><PrevIcon size={16} />{data.labels.previous}</button>
                <span className="text-center text-xs font-bold text-slate-400" aria-live="polite">{data.labels.progress(index + 1, data.stages.length)}</span>
                <button type="button" onClick={() => go(index + 1)} disabled={index === data.stages.length - 1} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-slate-200 disabled:opacity-35">{data.labels.next}<NextIcon size={16} /></button>
            </div>

            <section className="mt-6 rounded-2xl border border-amber-400/25 bg-slate-950/35 p-4" aria-label={data.sr.branchGroup}>
                <h3 className="text-base font-black text-white">{data.branches.title}</h3><p className="mt-1 text-xs text-slate-400">{data.branches.intro}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    <button type="button" onClick={() => selectBranchStage('context')} className="rounded-xl border border-slate-600/50 p-3 text-start text-xs text-slate-200"><b>{data.branches.missingInfo.label}</b><span className="mt-1 block text-slate-400">{data.branches.missingInfo.outcome}</span></button>
                    <button type="button" onClick={() => selectBranchStage('grounding-choice')} className="rounded-xl border border-slate-600/50 p-3 text-start text-xs text-slate-200"><b>{data.branches.knowledge.label}</b><span className="mt-1 block text-slate-400">{data.branches.knowledge.outcome}</span></button>
                    <button type="button" onClick={() => selectBranchStage('agent-tool')} className="rounded-xl border border-indigo-500/50 p-3 text-start text-xs text-indigo-100"><b>{data.branches.toolNeeded.label}</b><span className="mt-1 block text-slate-400">{data.branches.toolNeeded.outcome}</span></button>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-rose-400/30 p-3">
                        <div className="flex items-center gap-2 text-sm font-black text-rose-100"><RefreshCcw size={15} />{data.branches.toolError.label}</div>
                        <p className="mt-2 text-xs text-slate-300" role="status">{toolError === 'idle' ? data.branches.toolError.label : toolError === 'first' ? data.branches.toolError.first : data.branches.toolError.exhausted}</p>
                        <button type="button" disabled={toolError === 'exhausted'} onClick={() => { setApproval('pending'); setToolError(toolError === 'idle' ? 'first' : 'exhausted'); }} className="mt-3 rounded-lg border border-rose-400/40 px-3 py-1.5 text-xs font-bold text-rose-100 disabled:opacity-40">{toolError === 'idle' ? data.branches.toolError.label : data.branches.toolError.retry}</button>
                    </div>
                    <div className="rounded-xl border border-emerald-400/30 p-3">
                        <div className="flex items-center gap-2 text-sm font-black text-emerald-100"><UserRound size={15} />{data.branches.approval.title}</div>
                        <p className="mt-2 text-xs text-slate-300" role="status">{approval === 'pending' ? data.branches.approval.pending : approval === 'denied' ? data.branches.approval.denied : approval === 'approved' ? data.branches.approval.approved : approval === 'accepted' ? data.branches.approval.verifyAccepted : data.branches.approval.verifyRejected}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {approval === 'pending' && <><button type="button" onClick={() => { setToolError('idle'); setApproval('denied'); }} className="rounded-lg border border-slate-500 px-3 py-1.5 text-xs font-bold text-slate-200">{data.branches.approval.deny}</button><button type="button" onClick={() => { setToolError('idle'); setApproval('approved'); }} className="rounded-lg border border-emerald-400/50 px-3 py-1.5 text-xs font-bold text-emerald-100">{data.branches.approval.approve}</button></>}
                            {approval === 'approved' && <><button type="button" onClick={() => setApproval('accepted')} className="rounded-lg border border-emerald-400/50 px-3 py-1.5 text-xs font-bold text-emerald-100">{data.branches.approval.accepted}</button><button type="button" onClick={() => setApproval('rejected')} className="rounded-lg border border-rose-400/50 px-3 py-1.5 text-xs font-bold text-rose-100">{data.branches.approval.rejected}</button></>}
                            {approval !== 'pending' && <button type="button" onClick={() => setApproval('pending')} className="rounded-lg border border-slate-500 px-3 py-1.5 text-xs font-bold text-slate-200">{data.branches.restart}</button>}
                        </div>
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 p-3 text-sm font-black text-white"><CheckCircle2 size={16} aria-hidden />{data.labels.output}: <span dir="ltr">{finalStatus}</span>{(approval === 'denied' || approval === 'rejected' || toolError === 'exhausted') && <CircleStop size={16} className="text-rose-300" aria-hidden />}</div>
            </section>

            <p className="mt-4 text-xs leading-relaxed text-slate-500"><ExternalLink size={12} className="me-1 inline" aria-hidden />{data.disclosure}</p>
        </div>
    );
};
