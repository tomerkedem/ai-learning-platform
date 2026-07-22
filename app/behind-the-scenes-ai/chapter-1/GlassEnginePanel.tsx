"use client";

import React, { useContext } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Circle,
    Cpu,
    RefreshCcw,
    RotateCcw,
    Sparkles,
} from 'lucide-react';

import { ACCENTS } from '@/components/ai-internals/accents';
import { ExpandableLabContext } from '@/components/ai-internals/ExpandableLab';
import { STATION_PALETTE } from '@/components/ai-internals/IntroStationViz';
import type { Accent } from '@/components/ai-internals/types';
import { useT } from '@/i18n/useT';

import type { EngineTraceStep } from './engineTrace';

interface GlassEnginePanelProps {
    title: string;
    subtitle?: string;
    accent: Accent;
    replayKey: string | number;
    steps: EngineTraceStep[];
    activeIndex: number;
    onActiveIndexChange: (index: number) => void;
    onReplayActive: () => void;
    onResetJourney: () => void;
    highlightToken?: string | null;
    onTokenHover?: (token: string | null) => void;
}

const STATION_DOTS = Object.values(STATION_PALETTE).map((station) => station.solid);

const normalizeToken = (token: string | null | undefined) => token?.trim().normalize('NFC') ?? '';
const formatNumber = (value: number, digits = 3) => {
    const rounded = value.toFixed(digits);
    return value > 0 ? `+${rounded}` : rounded;
};
const formatVector = (vector: number[]) => `[${vector.map((value) => formatNumber(value, 2)).join(', ')}]`;
const tokenText = (surface: string) => surface.replace(/^\s+/, (spaces) => '␠'.repeat(spaces.length));

const TokenButton: React.FC<{
    token: string;
    display?: string;
    active?: boolean;
    accent: Accent;
    onTokenHover?: (token: string | null) => void;
}> = ({ token, display, active = false, accent, onTokenHover }) => {
    const a = ACCENTS[accent];
    const interactive = !!onTokenHover;
    const classes = `rounded-lg border px-2 py-1 font-mono text-xs ${
        active ? `${a.border} ${a.bgSoft} ${a.text} ring-1 ${a.ringSoft}` : 'border-white/10 bg-slate-900/70 text-slate-300'
    }`;

    if (!interactive) return <span className={classes} dir="auto">{display ?? tokenText(token)}</span>;

    return (
        <button
            type="button"
            aria-pressed={active}
            onMouseEnter={() => onTokenHover(token)}
            onMouseLeave={() => onTokenHover(null)}
            onFocus={() => onTokenHover(token)}
            onBlur={() => onTokenHover(null)}
            onClick={() => onTokenHover(active ? null : token)}
            className={`${classes} focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80`}
            dir="auto"
        >
            {display ?? tokenText(token)}
        </button>
    );
};

const VectorCode: React.FC<{ vector: number[] }> = ({ vector }) => (
    <code className="whitespace-nowrap font-mono text-[11px] text-cyan-200" dir="ltr">
        {formatVector(vector)}
    </code>
);

const ScrollTable: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => (
    <div className="max-h-80 overflow-auto rounded-xl border border-white/10" role="region" aria-label={label} tabIndex={0}>
        <table className="w-full min-w-[34rem] border-collapse text-start text-xs">{children}</table>
    </div>
);

const ProbabilityRows: React.FC<{
    candidates: { token: string; tokenId: number; logit: number; probability: number }[];
    accent: Accent;
    reduce: boolean;
}> = ({ candidates, accent, reduce }) => {
    const a = ACCENTS[accent];
    return (
        <div className="space-y-2">
            {candidates.map((candidate) => (
                <div key={`${candidate.tokenId}-${candidate.token}`} className="rounded-xl border border-white/10 bg-slate-950/40 p-2.5">
                    <div className="mb-1.5 flex items-center gap-2">
                        <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-100" dir="auto">
                            {tokenText(candidate.token)}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500" dir="ltr">{formatNumber(candidate.logit, 2)}</span>
                        <span className={`font-mono text-xs font-bold ${a.text}`} dir="ltr">
                            {(candidate.probability * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <motion.div
                            className={`h-full rounded-full ${a.barGradient}`}
                            initial={reduce ? false : { width: 0 }}
                            animate={{ width: `${candidate.probability * 100}%` }}
                            transition={{ duration: reduce ? 0 : 0.5, ease: 'easeOut' }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

const ProcessCard: React.FC<{ label: string; value: string; accent: Accent; marker: string }> = ({ label, value, accent, marker }) => {
    const a = ACCENTS[accent];
    return (
        <div className="rounded-xl border border-white/10 bg-slate-950/45 p-3">
            <div className={`mb-1 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider ${a.text}`}>
                <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${a.solid} ${a.solidText}`} dir="ltr">{marker}</span>
                {label}
            </div>
            <p className="text-sm leading-relaxed text-slate-200">{value}</p>
        </div>
    );
};

const TeachingBlock: React.FC<{ step: EngineTraceStep; accent: Accent }> = ({ step, accent }) => {
    const { t } = useT();
    const ep = t.behindAi.chapter1.visuals.enginePanel;
    const a = ACCENTS[accent];
    return (
        <div className="mt-4 space-y-3">
            <div className="grid gap-2 md:grid-cols-3">
                <ProcessCard label={ep.inputLabel} value={step.teaching.input} accent={accent} marker="1" />
                <ProcessCard label={ep.transformationLabel} value={step.teaching.transformation} accent={accent} marker="2" />
                <ProcessCard label={ep.outputLabel} value={step.teaching.output} accent={accent} marker="3" />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
                <div className="rounded-xl border border-emerald-400/25 bg-emerald-950/20 p-3">
                    <div className="mb-1 flex items-center gap-2 text-xs font-black text-emerald-300">
                        <CheckCircle2 size={14} /> {ep.conclusionLabel}
                    </div>
                    <p className="text-sm leading-relaxed text-slate-200">{step.teaching.conclusion}</p>
                </div>
                <div className={`rounded-xl border ${a.border} ${a.bgSoft} p-3`}>
                    <div className={`mb-1 text-xs font-black ${a.text}`}>{ep.limitationLabel}</div>
                    <p className="text-sm leading-relaxed text-slate-300">{step.teaching.limitation}</p>
                </div>
            </div>
        </div>
    );
};

const StepVisual: React.FC<{
    step: EngineTraceStep;
    accent: Accent;
    highlightToken?: string | null;
    onTokenHover?: (token: string | null) => void;
}> = ({ step, accent, highlightToken, onTokenHover }) => {
    const { t } = useT();
    const ep = t.behindAi.chapter1.visuals.enginePanel;
    const a = ACCENTS[accent];
    const reduce = !!useReducedMotion();
    const highlighted = normalizeToken(highlightToken);

    switch (step.kind) {
        case 'productInput': {
            const envelope = step.envelope;
            return (
                <div className="space-y-2">
                    <div className="rounded-xl border border-cyan-400/25 bg-cyan-950/20 p-3">
                        <div className="text-[11px] font-black uppercase tracking-wider text-cyan-300">{ep.productEnvelope.visibleRequest}</div>
                        <p className="mt-1 text-sm text-white" dir="auto">{envelope.visibleRequest}</p>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                        <div className="rounded-xl border border-purple-400/20 bg-purple-950/15 p-3">
                            <div className="text-[11px] font-black uppercase tracking-wider text-purple-300">{ep.productEnvelope.systemInstruction}</div>
                            <p className="mt-1 text-xs leading-relaxed text-slate-200" dir="auto">{envelope.systemInstruction}</p>
                        </div>
                        <div className="rounded-xl border border-blue-400/20 bg-blue-950/15 p-3">
                            <div className="text-[11px] font-black uppercase tracking-wider text-blue-300">{ep.productEnvelope.selectedContext}</div>
                            <p className="mt-1 text-xs leading-relaxed text-slate-200" dir="auto">{envelope.selectedContext}</p>
                        </div>
                    </div>
                    <div className={`rounded-xl border ${a.border} ${a.bgSoft} p-3`}>
                        <div className={`text-[11px] font-black uppercase tracking-wider ${a.text}`}>{ep.productEnvelope.modelInput}</div>
                        <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-slate-200" dir="auto">
                            {envelope.serialized}
                        </pre>
                    </div>
                    <div className="rounded-xl border border-dashed border-slate-600 bg-slate-900/30 p-3">
                        <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">{ep.productEnvelope.omitted}</div>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400" dir="auto">{envelope.omittedContext}</p>
                    </div>
                </div>
            );
        }

        case 'tokens':
            return (
                <div className="flex flex-wrap gap-2" aria-label={step.boundaries.map((token) => token.display).join(' | ')}>
                    {step.boundaries.map((token) => (
                        <TokenButton
                            key={`${token.index}-${token.surface}`}
                            token={token.surface}
                            display={token.display}
                            active={highlighted === normalizeToken(token.surface)}
                            accent={accent}
                            onTokenHover={onTokenHover}
                        />
                    ))}
                </div>
            );

        case 'tokenIds':
            return (
                <div className="space-y-3">
                    <ScrollTable label={step.title}>
                        <thead className="sticky top-0 bg-slate-950 text-slate-400">
                            <tr><th className="p-2">{ep.matrix.token}</th><th className="p-2" dir="ltr">{ep.matrix.id}</th></tr>
                        </thead>
                        <tbody>
                            {step.ids.map((token) => (
                                <tr key={`${token.index}-${token.id}`} className="border-t border-white/5">
                                    <td className="p-2 font-mono text-slate-100" dir="auto">{token.display}</td>
                                    <td className="p-2 font-mono text-cyan-300" dir="ltr">{token.id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </ScrollTable>
                    <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-slate-950/40 p-3" dir="ltr">
                        {step.idSequence.map((id, index) => (
                            <React.Fragment key={`${id}-${index}`}>
                                <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-cyan-200">{id}</code>
                                {index < step.idSequence.length - 1 && <span className="text-slate-600">→</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            );

        case 'embeddingScene':
            return (
                <ScrollTable label={step.title}>
                    <thead className="sticky top-0 bg-slate-950 text-slate-400">
                        <tr>
                            <th className="p-2">{ep.matrix.token}</th><th className="p-2">{ep.matrix.id}</th><th className="p-2">{ep.matrix.embedding}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {step.embeddings.map((item) => (
                            <tr key={`${item.tokenIndex}-${item.tokenId}`} className="border-t border-white/5">
                                <td className="p-2 font-mono text-slate-100" dir="auto">{tokenText(item.token)}</td>
                                <td className="p-2 font-mono text-slate-400" dir="ltr">{item.tokenId} → E[{item.embeddingRow}]</td>
                                <td className="p-2"><VectorCode vector={item.vector} /></td>
                            </tr>
                        ))}
                    </tbody>
                </ScrollTable>
            );

        case 'positionScene':
            return (
                <ScrollTable label={step.title}>
                    <thead className="sticky top-0 bg-slate-950 text-slate-400">
                        <tr>
                            <th className="p-2">{ep.matrix.token}</th><th className="p-2">{ep.matrix.embedding}</th><th className="p-2">{ep.matrix.position}</th><th className="p-2">{ep.matrix.positionAware}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {step.representations.map((item) => (
                            <tr key={`${item.position}-${item.tokenId}`} className="border-t border-white/5">
                                <td className="p-2 font-mono text-slate-100" dir="auto">{tokenText(item.token)}</td>
                                <td className="p-2"><VectorCode vector={item.embeddingVector} /></td>
                                <td className="p-2"><span className="me-2 font-mono text-slate-400" dir="ltr">p{item.position}</span><VectorCode vector={item.positionVector} /></td>
                                <td className="p-2"><VectorCode vector={item.vector} /></td>
                            </tr>
                        ))}
                    </tbody>
                </ScrollTable>
            );

        case 'contextScene':
            return (
                <div className="space-y-3">
                    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                        <div className={`mb-2 text-[11px] font-black uppercase tracking-wider ${a.text}`}>{ep.productEnvelope.modelInput}</div>
                        <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-slate-300" dir="auto">{step.modelInput}</pre>
                    </div>
                    <div className="rounded-xl border border-emerald-400/20 bg-emerald-950/15 p-3">
                        <div className="mb-2 text-xs font-black text-emerald-300">{ep.productEnvelope.insideWindow}</div>
                        <div className="flex flex-wrap gap-1.5">
                            {step.window.included.map((item) => (
                                <TokenButton key={`${item.position}-${item.tokenId}`} token={item.token} accent={accent} />
                            ))}
                        </div>
                    </div>
                    <div className="rounded-xl border border-dashed border-slate-600 bg-slate-900/30 p-3">
                        <div className="mb-1 text-xs font-black text-slate-400">{ep.productEnvelope.omitted}</div>
                        {step.window.omitted.map((item, index) => <p key={index} className="text-xs leading-relaxed text-slate-400" dir="auto">{item}</p>)}
                    </div>
                </div>
            );

        case 'attentionScene': {
            const snapshot = step.snapshot;
            const textAlternative = snapshot.weights
                .map((weight) => `${tokenText(weight.sourceToken)} ${(weight.weight * 100).toFixed(1)}%`)
                .join(', ');
            return (
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 p-3 font-mono text-xs" dir="ltr">
                        <span className={`rounded-lg ${a.bgSoft} px-2 py-1 ${a.text}`}>L{snapshot.layer}</span>
                        <span className={`rounded-lg ${a.bgSoft} px-2 py-1 ${a.text}`}>H{snapshot.head}</span>
                        <span className="text-slate-400">p{snapshot.destinationIndex}</span>
                        <span className="text-white" dir="auto">{tokenText(snapshot.destinationToken)}</span>
                    </div>
                    <div className="max-h-72 space-y-2 overflow-auto rounded-xl border border-white/10 p-3" aria-label={textAlternative} tabIndex={0}>
                        {snapshot.weights.map((weight) => (
                            <div key={`${weight.sourceIndex}-${weight.sourceToken}`} className="grid grid-cols-[minmax(5rem,1fr)_3fr_3.5rem] items-center gap-2 text-xs">
                                <span className="truncate font-mono text-slate-200" dir="auto">{tokenText(weight.sourceToken)}</span>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                                    <motion.div
                                        className={`h-full rounded-full ${a.barGradient}`}
                                        initial={reduce ? false : { width: 0 }}
                                        animate={{ width: `${weight.weight * 100}%` }}
                                        transition={{ duration: reduce ? 0 : 0.45 }}
                                    />
                                </div>
                                <span className="text-end font-mono text-slate-300" dir="ltr">{(weight.weight * 100).toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                    {snapshot.output[snapshot.destinationIndex] && (
                        <div className={`rounded-xl border ${a.border} ${a.bgSoft} p-3`}>
                            <span className={`me-2 text-xs font-black ${a.text}`}>{ep.matrix.attention}</span>
                            <VectorCode vector={snapshot.output[snapshot.destinationIndex].vector} />
                        </div>
                    )}
                </div>
            );
        }

        case 'ffScene':
            return (
                <ScrollTable label={step.title}>
                    <thead className="sticky top-0 bg-slate-950 text-slate-400"><tr><th className="p-2">{ep.matrix.position}</th><th className="p-2">{ep.inputLabel}</th><th className="p-2">{ep.matrix.feedForward}</th></tr></thead>
                    <tbody>
                        {step.snapshot.output.map((output, index) => (
                            <tr key={`${output.tokenIndex}-${output.tokenId}`} className="border-t border-white/5">
                                <td className="p-2 font-mono text-slate-300" dir="ltr">p{output.tokenIndex}</td>
                                <td className="p-2"><VectorCode vector={step.snapshot.input[index]?.vector ?? []} /></td>
                                <td className="p-2"><VectorCode vector={output.vector} /></td>
                            </tr>
                        ))}
                    </tbody>
                </ScrollTable>
            );

        case 'layersScene':
            return (
                <div className="grid gap-2 sm:grid-cols-2">
                    {step.checkpoints.map((checkpoint) => (
                        <div key={checkpoint.label} className="rounded-xl border border-white/10 bg-slate-950/45 p-3">
                            <div className={`mb-2 flex items-center justify-between gap-2 text-xs font-black ${a.text}`}>
                                <span>{ep.matrix.checkpoint}</span><span className="font-mono" dir="ltr">{checkpoint.label}</span>
                            </div>
                            <div className="space-y-1 overflow-x-auto">
                                {checkpoint.representations.slice(-4).map((item) => (
                                    <div key={`${checkpoint.label}-${item.tokenIndex}`} className="flex min-w-max items-center gap-2">
                                        <span className="w-8 font-mono text-[10px] text-slate-500" dir="ltr">p{item.tokenIndex}</span>
                                        <VectorCode vector={item.vector} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            );

        case 'stateScene':
            return (() => {
                const prediction = step.representations.find((item) => item.tokenIndex === step.predictionPosition);
                return (
                <div className="space-y-2">
                    {step.representations.slice(-6).map((item) => {
                        const selected = item.tokenIndex === step.predictionPosition;
                        return (
                            <div key={`${item.tokenIndex}-${item.tokenId}`} className={`flex min-w-0 items-center gap-2 rounded-xl border p-2.5 ${selected ? `${a.border} ${a.bgSoft} ring-1 ${a.ringSoft}` : 'border-white/10 bg-slate-950/40'}`}>
                                <span className="w-10 shrink-0 font-mono text-xs text-slate-400" dir="ltr">p{item.tokenIndex}</span>
                                <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-200" dir="auto">{tokenText(item.token)}</span>
                                <span className="overflow-x-auto"><VectorCode vector={item.vector} /></span>
                                {selected && <span className={`shrink-0 rounded-full ${a.solid} ${a.solidText} px-2 py-0.5 text-[10px] font-black`}>{ep.matrix.predictionPosition}</span>}
                            </div>
                        );
                    })}
                    {prediction && (
                        <div className={`flex flex-wrap items-center gap-2 rounded-xl border ${a.border} ${a.bgSoft} p-3`}>
                            <VectorCode vector={prediction.vector} />
                            <span className={`font-bold ${a.text}`} aria-hidden>→</span>
                            <span className="text-xs leading-relaxed text-slate-200">{step.teaching.transformation}</span>
                        </div>
                    )}
                </div>
                );
            })();

        case 'logits':
            return (
                <ScrollTable label={step.title}>
                    <thead className="sticky top-0 bg-slate-950 text-slate-400"><tr><th className="p-2">{ep.scores.candidate}</th><th className="p-2">{ep.matrix.id}</th><th className="p-2">{ep.scores.logit}</th></tr></thead>
                    <tbody>
                        {step.candidates.map((candidate) => (
                            <tr key={`${candidate.tokenId}-${candidate.token}`} className="border-t border-white/5">
                                <td className="p-2 font-mono text-slate-100" dir="auto">{tokenText(candidate.token)}</td>
                                <td className="p-2 font-mono text-slate-400" dir="ltr">{candidate.tokenId}</td>
                                <td className={`p-2 font-mono font-bold ${candidate.logit >= 0 ? 'text-emerald-300' : 'text-rose-300'}`} dir="ltr">{formatNumber(candidate.logit)}</td>
                            </tr>
                        ))}
                    </tbody>
                </ScrollTable>
            );

        case 'probabilities':
            return (
                <div className="space-y-3">
                    <ProbabilityRows candidates={step.candidates} accent={accent} reduce={reduce} />
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-xs">
                        <span className="font-bold text-slate-300">{ep.scores.total}</span>
                        <span className={`font-mono font-black ${a.text}`} dir="ltr">{step.total.toFixed(4)} ≈ 1</span>
                    </div>
                </div>
            );

        case 'decisionScene':
            return (
                <div className="space-y-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                        {step.decoding.availableStrategies.map((strategy) => {
                            const active = strategy === step.decoding.activeStrategy;
                            return (
                                <div key={strategy} className={`rounded-xl border p-3 ${active ? `${a.border} ${a.bgSoft} ring-1 ${a.ringSoft}` : 'border-white/10 bg-slate-950/35'}`}>
                                    <div className="flex items-center gap-2 text-sm font-black text-slate-100">
                                        {active ? <CheckCircle2 size={15} className={a.text} /> : <Circle size={15} className="text-slate-600" />}
                                        {strategy === 'greedy' ? ep.scores.greedy : ep.scores.sampling}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <ProbabilityRows candidates={step.candidates} accent={accent} reduce={reduce} />
                    <div className={`rounded-xl border ${a.border} ${a.bgSoft} p-3`}>
                        <div className={`text-xs font-black ${a.text}`}>{ep.scores.selectedToken}</div>
                        <div className="mt-1 flex items-center gap-2"><Check size={16} className={a.text} /><code className="font-mono text-base font-black text-white" dir="auto">{tokenText(step.selectedToken)}</code></div>
                    </div>
                </div>
            );

        case 'generationScene':
            return (
                <div className="space-y-3">
                    {step.steps.map((generationStep) => (
                        <div key={generationStep.step} className="rounded-xl border border-white/10 bg-slate-950/45 p-3">
                            <div className={`mb-2 flex items-center justify-between gap-2 text-xs font-black ${a.text}`}>
                                <span>{ep.generation.step}</span><span dir="ltr">{generationStep.step}/2</span>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div className="rounded-lg bg-slate-900/70 p-2">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{ep.generation.appended}</div>
                                    <code className="mt-1 block font-mono text-sm text-white" dir="auto">{tokenText(generationStep.appendedFragment)}</code>
                                </div>
                                <div className="rounded-lg bg-slate-900/70 p-2">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{ep.generation.updatedContext}</div>
                                    <code className="mt-1 block truncate font-mono text-[11px] text-slate-300" dir="auto">{generationStep.contextAfter.slice(-120)}</code>
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{ep.generation.nextDistribution}</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {generationStep.probabilities.map((candidate) => (
                                        <span key={`${generationStep.step}-${candidate.tokenId}`} className="rounded-md border border-white/10 bg-slate-900 px-2 py-1 font-mono text-[11px] text-slate-300" dir="auto">
                                            {tokenText(candidate.token)} {(candidate.probability * 100).toFixed(1)}%
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-2 text-[11px] text-slate-400">{ep.generation.stop}: {generationStep.stopReached ? '✓' : '…'}</div>
                        </div>
                    ))}
                    <div className={`rounded-xl border ${a.border} ${a.bgSoft} p-3`}>
                        <div className={`mb-1 text-xs font-black ${a.text}`}>{ep.outputLabel}</div>
                        <p className="text-sm font-semibold leading-relaxed text-white" dir="auto">{step.finalResponse}</p>
                    </div>
                </div>
            );

        case 'raw':
            return <div className={`rounded-xl border ${a.border} ${a.bgSoft} p-4 text-sm font-semibold text-white`} dir="auto">{step.value}</div>;

        case 'flag':
            return (
                <div className={`rounded-xl border p-4 ${step.on ? 'border-amber-400/30 bg-amber-950/20 text-amber-200' : 'border-emerald-400/30 bg-emerald-950/20 text-emerald-200'}`}>
                    <div className="flex items-center gap-2">
                        {step.on ? <Circle size={16} /> : <CheckCircle2 size={16} />}
                        <span className="text-sm font-bold">{step.on ? step.onLabel : step.offLabel}</span>
                    </div>
                    {step.detail && <p className="mt-1 text-xs leading-relaxed text-slate-300" dir="auto">{step.detail}</p>}
                </div>
            );

        case 'agentStub':
            return (
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">{step.chips.map((chip) => <span key={chip} className={`rounded-lg border ${a.border} ${a.bgSoft} px-2.5 py-1 text-xs font-bold ${a.text}`}>{chip}</span>)}</div>
                    {(step.mcp || step.optionalProtocol) && <p className="text-xs leading-relaxed text-slate-400">{ep.agent.mcpOptional}</p>}
                </div>
            );

        case 'guardrailScene':
            return (
                <div className="space-y-2">
                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">{ep.agent.authorization}</div>
                            <div className={`mt-1 text-sm font-bold ${step.authorizationStatus === 'authorized' ? 'text-emerald-300' : 'text-rose-300'}`}>
                                {step.authorizationStatus === 'authorized' ? ep.agent.authorized : ep.agent.unauthorized}
                            </div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">{ep.agent.humanApproval}</div>
                            <div className="mt-1 text-sm font-bold text-slate-200">
                                {step.approvalStatus === 'approved'
                                    ? ep.agent.approvalGranted
                                    : step.approvalStatus === 'denied'
                                        ? ep.agent.approvalDenied
                                        : step.approvalStatus === 'pending'
                                            ? ep.agent.approvalRequired
                                            : step.safe}
                            </div>
                        </div>
                    </div>
                    <div className={`rounded-xl border p-3 text-sm font-bold ${step.toolCallAllowed ? 'border-emerald-400/30 bg-emerald-950/20 text-emerald-200' : 'border-amber-400/30 bg-amber-950/20 text-amber-200'}`}>
                        {step.toolCallAllowed ? step.approve : ep.agent.toolNotRun}
                    </div>
                </div>
            );

        case 'toolCallScene':
        case 'mcpScene':
            return (
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 p-4">
                    <span className={`rounded-lg border ${a.border} ${a.bgSoft} px-2 py-1 text-xs font-bold ${a.text}`}>{step.agentLabel}</span>
                    <span className="text-slate-600">→</span>
                    {'transport' in step && step.transport === 'mcp' && step.mcpLabel && (
                        <><span className="rounded-lg border border-violet-400/25 bg-violet-950/20 px-2 py-1 text-xs font-bold text-violet-300">{step.mcpLabel}</span><span className="text-slate-600">→</span></>
                    )}
                    {'kind' in step && step.kind === 'mcpScene' && (
                        <><span className="rounded-lg border border-violet-400/25 bg-violet-950/20 px-2 py-1 text-xs font-bold text-violet-300">{step.mcpLabel}</span><span className="text-slate-600">→</span></>
                    )}
                    <span className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs font-bold text-slate-200">{step.toolLabel}</span>
                    <span className="text-slate-600">→</span>
                    <span className="rounded-lg border border-emerald-400/25 bg-emerald-950/20 px-2 py-1 text-xs font-bold text-emerald-300">{step.resultLabel}</span>
                </div>
            );

        case 'loopScene':
            return (
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        {step.nodes.map((node, index) => <React.Fragment key={node}><span className={`rounded-lg border ${a.border} ${a.bgSoft} px-2 py-1 text-xs font-bold ${a.text}`}>{node}</span>{index < step.nodes.length - 1 && <span className="text-slate-600">→</span>}</React.Fragment>)}
                    </div>
                    <div className="flex flex-wrap gap-2">{step.outcomes.map((outcome) => <span key={outcome} className="rounded-lg border border-white/10 bg-slate-950/40 px-2 py-1 text-xs text-slate-300">{outcome}</span>)}</div>
                </div>
            );

        case 'decision':
            return (
                <div className={`rounded-xl border ${a.border} ${a.bgSoft} p-4`}>
                    <div className={`flex items-center gap-2 text-sm font-black ${a.text}`}><CheckCircle2 size={16} /> {step.decision.label}</div>
                </div>
            );

        default:
            return <p className="text-sm leading-relaxed text-slate-300">{step.note}</p>;
    }
};

export const GlassEnginePanel: React.FC<GlassEnginePanelProps> = ({
    title,
    subtitle,
    accent,
    replayKey,
    steps,
    activeIndex,
    onActiveIndexChange,
    onReplayActive,
    onResetJourney,
    highlightToken,
    onTokenHover,
}) => {
    const { t, dir } = useT();
    const reduce = !!useReducedMotion();
    const expanded = useContext(ExpandableLabContext);
    const a = ACCENTS[accent];
    const ep = t.behindAi.chapter1.visuals.enginePanel;
    const safeIndex = Math.max(0, Math.min(activeIndex, Math.max(0, steps.length - 1)));
    const activeStep = steps[safeIndex];
    const panelHeight = expanded
        ? 'h-auto min-h-0 lg:h-[calc(100dvh-6rem)]'
        : 'h-auto min-h-0 lg:h-[640px]';

    if (!activeStep) return null;

    const previousStep = safeIndex > 0 ? steps[safeIndex - 1] : null;
    const completedAnnouncement = previousStep
        ? `${ep.completedStationLabel}: ${previousStep.title}. ${previousStep.teaching.output}. `
        : '';
    const activeAnnouncement = `${completedAnnouncement}${ep.currentStationLabel}: ${safeIndex + 1}, ${activeStep.title}`;

    return (
        <div className={`relative flex ${panelHeight} flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80`} dir={dir}>
            <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
            <div className={`pointer-events-none absolute -top-20 start-0 h-56 w-56 rounded-full blur-[80px] ${a.bgSoft}`} />

            <header className="relative shrink-0 border-b border-white/10 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                    <div className={`shrink-0 rounded-xl border border-white/10 bg-slate-900 p-2 ${a.text}`}><Cpu size={18} /></div>
                    <div className="min-w-0 flex-1">
                        <div className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Transparent Engine</div>
                        <h3 className={`text-lg font-black leading-tight ${a.text}`}>{title}</h3>
                        {subtitle && <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{subtitle}</p>}
                    </div>
                    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border ${a.border} ${a.bgSoft} px-2.5 py-1 font-mono text-xs font-bold ${a.text}`}>
                        <Sparkles size={11} /> <span dir="ltr">{safeIndex + 1}/{steps.length}</span>
                    </span>
                </div>
            </header>

            <div className="custom-scrollbar relative flex-1 overflow-visible p-4 lg:min-h-0 lg:overflow-y-auto sm:p-5">
                <div className="mb-4 rounded-2xl border border-white/10 bg-slate-900/55 p-3 backdrop-blur-sm lg:sticky lg:top-0 lg:z-30">
                    <nav aria-label={ep.stationNavLabel}>
                        <ol className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
                            {steps.map((step, index) => {
                                const current = index === safeIndex;
                                const completed = index < safeIndex;
                                const stateLabel = current ? ep.currentStationLabel : completed ? ep.completedStationLabel : '';
                                return (
                                    <li key={step.id}>
                                        <button
                                            type="button"
                                            onClick={() => onActiveIndexChange(index)}
                                            aria-current={current ? 'step' : undefined}
                                            aria-label={`${index + 1}. ${step.title}${stateLabel ? `. ${stateLabel}` : ''}`}
                                            title={step.title}
                                            className={`flex min-h-9 w-full items-center justify-center gap-1 rounded-lg border px-1.5 py-1 text-xs font-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                                                current ? `${a.border} ${a.bgSoft} ${a.text} ring-1 ${a.ringSoft}` : completed ? 'border-emerald-400/25 bg-emerald-950/20 text-emerald-300' : 'border-white/10 bg-slate-950/60 text-slate-500 hover:border-white/25 hover:text-slate-300'
                                            }`}
                                        >
                                            <span className={`h-2 w-2 shrink-0 rounded-full ${STATION_DOTS[index % STATION_DOTS.length]}`} aria-hidden />
                                            <span dir="ltr">{index + 1}</span>
                                            {completed && <Check size={11} aria-hidden />}
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>

                    <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                        <button type="button" disabled={safeIndex === 0} onClick={() => onActiveIndexChange(safeIndex - 1)} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/60 px-2 py-1.5 text-xs font-bold text-slate-200 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
                            <ChevronLeft size={14} className={dir === 'rtl' ? 'rotate-180' : ''} aria-hidden /> {ep.previousStation}
                        </button>
                        <button type="button" disabled={safeIndex === steps.length - 1} onClick={() => onActiveIndexChange(safeIndex + 1)} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/60 px-2 py-1.5 text-xs font-bold text-slate-200 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
                            {ep.nextStation} <ChevronRight size={14} className={dir === 'rtl' ? 'rotate-180' : ''} aria-hidden />
                        </button>
                        <button type="button" onClick={onReplayActive} className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border ${a.border} ${a.bgSoft} px-2 py-1.5 text-xs font-bold ${a.text} focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80`}>
                            <RotateCcw size={13} aria-hidden /> {ep.replayStation}
                        </button>
                        <button type="button" onClick={onResetJourney} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/60 px-2 py-1.5 text-xs font-bold text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
                            <RefreshCcw size={13} aria-hidden /> {ep.resetJourney}
                        </button>
                    </div>
                </div>

                <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{activeAnnouncement}</div>

                <AnimatePresence mode="wait" initial={false}>
                    <motion.section
                        key={`${activeStep.id}:${replayKey}`}
                        initial={reduce ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -6 }}
                        transition={{ duration: reduce ? 0 : 0.24 }}
                        aria-labelledby={`engine-station-${activeStep.id}`}
                        className="relative"
                    >
                        <div className="mb-3 flex items-start gap-3">
                            <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${a.solid} ${a.solidText} font-mono text-sm font-black`} dir="ltr">{safeIndex + 1}</div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                    <h4 id={`engine-station-${activeStep.id}`} className="text-base font-black text-white">{activeStep.title}</h4>
                                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500" dir="ltr">{activeStep.titleEn}</span>
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-slate-400">{activeStep.note}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-slate-900/45 p-3.5">
                            <StepVisual step={activeStep} accent={accent} highlightToken={highlightToken} onTokenHover={onTokenHover} />
                        </div>
                        <TeachingBlock step={activeStep} accent={accent} />
                    </motion.section>
                </AnimatePresence>
            </div>
        </div>
    );
};
