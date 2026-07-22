// app/behind-the-scenes-ai/chapter-1/engineTrace.ts
//
// Presentation trace for Chapter 1. The Chat trace is a projection of one canonical
// deterministic dataset. No station recomputes unrelated values from the raw request.

import type { DecisionState, IntentProbability } from '@/components/ai-internals/types';
import type { Chapter1VisualsDict } from '@/i18n/locales/he/behind-ai/chapter1Visuals';

import {
    buildCanonicalChatPipeline,
    hasBarcode,
    matchedWords,
    runAgentEngine,
    selectChatReplyKey,
    vocabFor,
    type AgentApprovalStatus,
    type AgentAuthorizationStatus,
    type AttentionSnapshot,
    type CanonicalChatPipeline,
    type ContextWindowState,
    type DecodingState,
    type FeedForwardSnapshot,
    type GenerationStep,
    type LayerCheckpoint,
    type LogitCandidate,
    type PositionAwareRepresentation,
    type ProbabilityCandidate,
    type ProductInputEnvelope,
    type TokenBoundary,
    type TokenWithId,
    type VectorRepresentation,
} from './mockEngine';

export interface StationTeaching {
    input: string;
    transformation: string;
    output: string;
    conclusion: string;
    limitation: string;
}

export interface TraceBase {
    id: string;
    act: string;
    actEn: string;
    title: string;
    titleEn: string;
    note: string;
    teaching: StationTeaching;
}

export type EngineTraceStep = TraceBase & (
    | { kind: 'productInput'; envelope: ProductInputEnvelope }
    | { kind: 'tokens'; tokens: string[]; boundaries: TokenBoundary[] }
    | { kind: 'tokenIds'; tokens: TokenWithId[]; ids: TokenWithId[]; idSequence: number[] }
    | { kind: 'embeddingScene'; tokens: string[]; embeddings: VectorRepresentation[] }
    | { kind: 'positionScene'; tokens: string[]; representations: PositionAwareRepresentation[] }
    | { kind: 'contextScene'; tokens: string[]; window: ContextWindowState; modelInput: string }
    | { kind: 'attentionScene'; tokens: string[]; snapshot: AttentionSnapshot; pivot: number }
    | { kind: 'ffScene'; tokens: string[]; snapshot: FeedForwardSnapshot }
    | { kind: 'layersScene'; tokens: string[]; checkpoints: LayerCheckpoint[] }
    | { kind: 'stateScene'; tokens: string[]; representations: VectorRepresentation[]; predictionPosition: number }
    | { kind: 'logits'; candidates: LogitCandidate[] }
    | { kind: 'probabilities'; candidates: ProbabilityCandidate[]; items: IntentProbability[]; total: number }
    | { kind: 'decisionScene'; candidates: ProbabilityCandidate[]; items: IntentProbability[]; decoding: DecodingState; selectedToken: string }
    | { kind: 'generationScene'; steps: GenerationStep[]; appendedTextFragment: string; nextStepCandidates: LogitCandidate[]; finalResponse: string }
    // Shared and Agent-only variants retained for the rich conditional teaser.
    | { kind: 'raw'; value: string }
    | { kind: 'normalize'; original: string; normalized: string; changed: boolean }
    | { kind: 'count'; value: number; unit: string }
    | { kind: 'keywords'; groups: { label: string; matched: string[]; total: number }[] }
    | { kind: 'flag'; on: boolean; onLabel: string; offLabel: string; detail?: string; triggerToken?: string }
    | { kind: 'candidates'; items: { label: string; hits: number }[] }
    | { kind: 'winner'; label: string; value: number }
    | { kind: 'gap'; top: number; second: number; margin: number }
    | { kind: 'confidence'; level: 'High' | 'Medium' | 'Low' }
    | { kind: 'decision'; decision: DecisionState }
    | { kind: 'station'; tokens: string[] }
    | { kind: 'agentStub'; chips: string[]; mcp?: boolean; loop?: boolean; optionalProtocol?: boolean }
    | { kind: 'loopScene'; nodes: string[]; outcomes: string[] }
    | {
        kind: 'toolCallScene';
        agentLabel: string;
        toolLabel: string;
        transport: 'direct' | 'mcp';
        mcpLabel?: string;
        resultLabel: string;
    }
    | {
        kind: 'mcpScene';
        agentLabel: string;
        mcpLabel: string;
        toolLabel: string;
        resultLabel: string;
    }
    | {
        kind: 'guardrailScene';
        sensitive: boolean;
        safe: string;
        ask: string;
        approve: string;
        stop: string;
        authorizationStatus: AgentAuthorizationStatus;
        approvalStatus: AgentApprovalStatus;
        toolCallAllowed: boolean;
    }
    | { kind: 'reply'; text: string }
);

type StationCopy = {
    title: string;
    note: string;
    input?: string;
    transformation?: string;
    output?: string;
    conclusion?: string;
    limitation?: string;
};

function teachingFor(station: StationCopy): StationTeaching {
    return {
        input: station.input ?? station.note,
        transformation: station.transformation ?? station.note,
        output: station.output ?? station.note,
        conclusion: station.conclusion ?? station.note,
        limitation: station.limitation ?? station.note,
    };
}

function base(
    id: string,
    act: string,
    actEn: string,
    titleEn: string,
    station: StationCopy,
): TraceBase {
    return {
        id,
        act,
        actEn,
        title: station.title,
        titleEn,
        note: station.note,
        teaching: teachingFor(station),
    };
}

type ProductEnvelopeCopy = {
    systemInstructionExample?: string;
    selectedContextExample?: string;
    omittedExample?: string;
};

/** Builds the localized canonical dataset used by Chat, station 14 and narration. */
export function buildCanonicalPipeline(text: string, viz: Chapter1VisualsDict): CanonicalChatPipeline {
    const replyKey = selectChatReplyKey(text);
    const response = viz.mockEngine.chatReplies[replyKey];
    const productCopy = (viz.enginePanel as typeof viz.enginePanel & { productEnvelope?: ProductEnvelopeCopy }).productEnvelope;
    const stations = viz.journey.stations as typeof viz.journey.stations & Record<string, StationCopy>;
    return buildCanonicalChatPipeline(text, {
        scriptedResponse: response,
        systemInstruction: productCopy?.systemInstructionExample ?? stations.s1.note,
        selectedContext: productCopy?.selectedContextExample ?? stations.s6.note,
        omittedContext: productCopy?.omittedExample ?? teachingFor(stations.s6).limitation,
    });
}

export function traceChatEngine(text: string, viz: Chapter1VisualsDict): EngineTraceStep[] {
    const pipeline = buildCanonicalPipeline(text, viz);
    const st = viz.journey.stations as typeof viz.journey.stations & Record<string, StationCopy>;
    const { A: ZA, B: ZB, C: ZC, D: ZD } = viz.journey.zones;
    const surfaces = pipeline.tokenBoundaries.map((token) => token.surface);
    const probabilityItems = pipeline.probabilities.map<IntentProbability>((candidate) => ({
        label: candidate.token,
        value: candidate.probability * 100,
    }));

    return [
        { ...base('s1', ZA, 'Text to units', 'Product input', st.s1), kind: 'productInput', envelope: pipeline.productInput },
        { ...base('s2', ZA, 'Text to units', 'Tokenization', st.s2), kind: 'tokens', tokens: surfaces, boundaries: pipeline.tokenBoundaries },
        { ...base('s3', ZA, 'Text to units', 'Token IDs', st.s3), kind: 'tokenIds', tokens: pipeline.tokenIds, ids: pipeline.tokenIds, idSequence: pipeline.tokenIds.map((token) => token.id) },

        { ...base('s4', ZB, 'To representations', 'Embedding', st.s4), kind: 'embeddingScene', tokens: surfaces, embeddings: pipeline.embeddings },
        { ...base('s5', ZB, 'To representations', 'Positional information', st.s5), kind: 'positionScene', tokens: surfaces, representations: pipeline.positionAwareRepresentations },
        { ...base('s6', ZB, 'To representations', 'Context window', st.s6), kind: 'contextScene', tokens: surfaces, window: pipeline.contextWindow, modelInput: pipeline.productInput.serialized },

        { ...base('s7', ZC, 'Computing context', 'Attention', st.s7), kind: 'attentionScene', tokens: surfaces, snapshot: pipeline.attention, pivot: pipeline.attention.destinationIndex },
        { ...base('s8', ZC, 'Computing context', 'Feed-forward', st.s8), kind: 'ffScene', tokens: surfaces, snapshot: pipeline.feedForward },
        { ...base('s9', ZC, 'Computing context', 'Repeated layers', st.s9), kind: 'layersScene', tokens: surfaces, checkpoints: pipeline.layerCheckpoints },
        { ...base('s10', ZC, 'Computing context', 'Final contextual representations', st.s10), kind: 'stateScene', tokens: surfaces, representations: pipeline.finalRepresentations, predictionPosition: pipeline.predictionPosition },

        { ...base('s11', ZD, 'To the answer', 'Logits', st.s11), kind: 'logits', candidates: pipeline.logits },
        { ...base('s12', ZD, 'To the answer', 'Softmax', st.s12), kind: 'probabilities', candidates: pipeline.probabilities, items: probabilityItems, total: pipeline.probabilities.reduce((sum, candidate) => sum + candidate.probability, 0) },
        { ...base('s13', ZD, 'To the answer', 'Decoding', st.s13), kind: 'decisionScene', candidates: pipeline.probabilities, items: probabilityItems, decoding: pipeline.decoding, selectedToken: pipeline.decoding.selectedToken },
        { ...base('s14', ZD, 'To the answer', 'Generation loop', st.s14), kind: 'generationScene', steps: pipeline.generationSteps, appendedTextFragment: pipeline.appendedTextFragment, nextStepCandidates: pipeline.nextStepCandidateUpdate, finalResponse: pipeline.finalScriptedResponse },
    ];
}

export function traceAgentEngine(text: string, viz: Chapter1VisualsDict): EngineTraceStep[] {
    const result = runAgentEngine(text);
    const agent = viz.journey.agent;
    const stations = agent.stations as typeof agent.stations & Record<string, StationCopy>;
    const vocab = vocabFor(text);
    const barcode = hasBarcode(text);
    const sensitive = matchedWords(text, vocab.sensitiveWords).length > 0;
    const taskMap = viz.trace.labels.task as Record<string, string>;
    const decisionMap = viz.trace.labels.decision as Record<string, string>;
    const goalText = taskMap[result.task] ?? result.task;
    const finalDecision: DecisionState = {
        ...result.decision,
        label: decisionMap[result.decision.label] ?? result.decision.label,
    };
    const { understand: ZU, tools: ZT, control: ZG, exec: ZE, output: ZO } = agent.zones;
    const selectedTool = result.toolNeed.needed ? result.toolNeed.tool : '';

    const steps: EngineTraceStep[] = [
        { ...base('a1', ZU, 'Understand', 'Request', stations.a1), kind: 'raw', value: text || '-' },
        { ...base('a2', ZU, 'Understand', 'Goal', stations.a2), kind: 'raw', value: goalText },
        { ...base('a3', ZT, 'Tools and optional protocols', 'Available tools', stations.a3), kind: 'agentStub', chips: agent.toolNames, mcp: false, optionalProtocol: true },
    ];

    if (result.toolNeed.needed) {
        steps.push({ ...base('a4', ZT, 'Tools and optional protocols', 'Conditional tool selection', stations.a4), kind: 'agentStub', chips: [selectedTool], mcp: false });
    }
    steps.push(
        { ...base('a5', ZT, 'Tools and optional protocols', 'Missing information', stations.a5), kind: 'flag', on: result.missingInfo !== 'None', onLabel: agent.missingOn, offLabel: agent.missingOff, detail: barcode ? undefined : result.missingInfo },
        {
            ...base('a6', ZG, 'Controls', 'Authorization and approval', stations.a6),
            kind: 'guardrailScene',
            sensitive,
            safe: agent.gate.safe,
            ask: agent.gate.ask,
            approve: agent.gate.approve,
            stop: agent.gate.stop,
            authorizationStatus: result.authorization.status,
            approvalStatus: result.approval.status,
            toolCallAllowed: result.execution.toolCalled,
        },
    );

    // Execution stages exist only when execution actually occurred. Ask/stop branches never
    // fabricate a tool call, protocol bridge, observation or loop result.
    if (result.execution.toolCalled && result.execution.tool && result.execution.transport) {
        steps.push({
            ...base('a7', ZE, 'Execute and loop', 'Conditional tool call', stations.a7),
            kind: 'toolCallScene',
            agentLabel: agent.agentNode,
            toolLabel: result.execution.tool,
            transport: result.execution.transport,
            mcpLabel: result.execution.transport === 'mcp' ? agent.mcp : undefined,
            resultLabel: agent.resultLabel,
        });
        if (result.execution.observation) {
            steps.push({ ...base('a8', ZE, 'Execute and loop', 'Observation', stations.a8), kind: 'raw', value: agent.observation });
            steps.push({ ...base('a9', ZE, 'Execute and loop', 'Reasoning loop', stations.a9), kind: 'loopScene', nodes: agent.loopNodes, outcomes: agent.loopOutcomes });
        }
    }

    steps.push({ ...base('a10', ZO, 'Action or stop', 'Final', stations.a10), kind: 'decision', decision: finalDecision });
    return steps;
}
