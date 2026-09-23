import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
    buildCanonicalChatPipeline,
    runAgentEngine,
    selectChatReplyKey,
    softmax,
    type ProbabilityCandidate,
} from './mockEngine.ts';
import { chapter1Visuals } from '../../../../i18n/locales/he/behind-ai/chapter1Visuals.ts';
import { chapter1Visuals as enVisuals } from '../../../../i18n/locales/en/behind-ai/chapter1Visuals.ts';
import { chapter1Visuals as esVisuals } from '../../../../i18n/locales/es/behind-ai/chapter1Visuals.ts';
import { chapter1Visuals as ruVisuals } from '../../../../i18n/locales/ru/behind-ai/chapter1Visuals.ts';
import { chapter1Visuals as arVisuals } from '../../../../i18n/locales/ar/behind-ai/chapter1Visuals.ts';
import { chapter1Visuals as jaVisuals } from '../../../../i18n/locales/ja/behind-ai/chapter1Visuals.ts';
import { chapter1Quiz as heQuiz } from '../../../../i18n/locales/he/behind-ai/chapter1Quiz.ts';
import { chapter1Quiz as enQuiz } from '../../../../i18n/locales/en/behind-ai/chapter1Quiz.ts';
import { chapter1Quiz as esQuiz } from '../../../../i18n/locales/es/behind-ai/chapter1Quiz.ts';
import { chapter1Quiz as ruQuiz } from '../../../../i18n/locales/ru/behind-ai/chapter1Quiz.ts';
import { chapter1Quiz as arQuiz } from '../../../../i18n/locales/ar/behind-ai/chapter1Quiz.ts';
import { chapter1Quiz as jaQuiz } from '../../../../i18n/locales/ja/behind-ai/chapter1Quiz.ts';

const REQUEST = 'השיר לא מתנגן.';
const RESPONSE = 'נראה שיש בעיית ניגון בשיר.';
const VISUALS = [chapter1Visuals, enVisuals, esVisuals, ruVisuals, arVisuals, jaVisuals];
const QUIZZES = [heQuiz, enQuiz, esQuiz, ruQuiz, arQuiz, jaQuiz];

test('canonical pipeline is deterministic and aligned at every sequence stage', () => {
    const a = buildCanonicalChatPipeline(REQUEST, { scriptedResponse: RESPONSE });
    const b = buildCanonicalChatPipeline(REQUEST, { scriptedResponse: RESPONSE });
    assert.deepEqual(a, b);
    assert.equal(a.tokenBoundaries.length, a.tokenIds.length);
    assert.equal(a.tokenIds.length, a.embeddings.length);
    assert.equal(a.embeddings.length, a.positionAwareRepresentations.length);
    assert.equal(a.attention.output.length, a.contextWindow.included.length);
    assert.equal(a.feedForward.input.length, a.feedForward.output.length);
    assert.equal(a.finalRepresentations.length, a.feedForward.output.length);
    assert.deepEqual(a.embeddings.map((item) => item.tokenId), a.tokenIds.map((item) => item.id));
    assert.deepEqual(
        a.positionAwareRepresentations.map((item) => item.tokenId),
        a.embeddings.map((item) => item.tokenId),
    );
});

test('Chat trace exposes exactly fourteen unique, fully taught stations', () => {
    const source = readFileSync(new URL('./engineTrace.ts', import.meta.url), 'utf8');
    const ids = Array.from(source.matchAll(/base\('(s\d+)'/g), (match) => match[1]);
    assert.equal(ids.length, 14);
    assert.deepEqual(ids, Array.from({ length: 14 }, (_, index) => `s${index + 1}`));
    assert.equal(new Set(ids).size, 14);
    for (const station of Object.values(chapter1Visuals.journey.stations)) {
        assert.ok(station.input.trim());
        assert.ok(station.transformation.trim());
        assert.ok(station.output.trim());
        assert.ok(station.conclusion.trim());
        assert.ok(station.limitation.trim());
    }
    const localizedResponse = chapter1Visuals.mockEngine.chatReplies.notDelivered;
    const localizedPipeline = buildCanonicalChatPipeline(REQUEST, { scriptedResponse: localizedResponse });
    assert.equal(localizedPipeline.finalScriptedResponse, localizedResponse);
});

test('all six locales expose the same fourteen-station and five-question contracts', () => {
    const teachingFields = ['input', 'transformation', 'output', 'conclusion', 'limitation'] as const;
    for (const visuals of VISUALS) {
        const stations = Object.values(visuals.journey.stations);
        assert.equal(stations.length, 14);
        for (const station of stations) {
            for (const field of teachingFields) assert.ok(station[field].trim());
        }
        assert.ok(visuals.enginePanel.stationNavLabel.trim());
        assert.ok(visuals.enginePanel.productEnvelope.modelInput.trim());
    }
    for (const quiz of QUIZZES) {
        const questions = Object.values(quiz.byId);
        assert.equal(questions.length, 5);
        assert.ok(questions.every((question) => question.options.length === 4));
    }
    const quizData = readFileSync(new URL('../quizData.ts', import.meta.url), 'utf8');
    const chapterOneBlock = quizData.slice(quizData.indexOf('// ===== CHAPTER 1 ====='), quizData.indexOf('// ===== CHAPTER 2 ====='));
    const correctIndices = Array.from(chapterOneBlock.matchAll(/correctAnswer:\s*(\d+)/g), (match) => Number(match[1]));
    assert.deepEqual(correctIndices, [0, 1, 2, 0, 1]);
});

test('scripted tokenizer preserves punctuation and leading-space behavior', () => {
    const pipeline = buildCanonicalChatPipeline(REQUEST, { scriptedResponse: RESPONSE });
    const requestTokens = pipeline.tokenBoundaries.filter((token) => token.role === 'user' && !token.special);
    assert.equal(requestTokens.map((token) => token.surface).join(''), REQUEST);
    assert.ok(requestTokens.some((token) => token.leadingSpace));
    assert.equal(requestTokens.at(-1)?.surface, '.');
    assert.ok(pipeline.tokenIds.every((token) => Number.isInteger(token.id)));

    const longPipeline = buildCanonicalChatPipeline(Array.from({ length: 90 }, (_, index) => `token${index}`).join(' '), { scriptedResponse: RESPONSE });
    assert.equal(longPipeline.contextWindow.included.length, longPipeline.contextWindow.capacity);
    assert.ok(longPipeline.contextWindow.omitted[0].length > 0);
});

test('attention and Softmax are normalized deterministic transformations', () => {
    const pipeline = buildCanonicalChatPipeline(REQUEST, { scriptedResponse: RESPONSE });
    const attentionTotal = pipeline.attention.weights.reduce((sum, item) => sum + item.weight, 0);
    const probabilityTotal = pipeline.probabilities.reduce((sum, item) => sum + item.probability, 0);
    assert.ok(Math.abs(attentionTotal - 1) < 1e-12);
    assert.ok(Math.abs(probabilityTotal - 1) < 1e-12);

    const recalculated: ProbabilityCandidate[] = softmax(pipeline.logits);
    assert.deepEqual(recalculated, pipeline.probabilities);
    assert.ok(pipeline.logits.some((candidate) => candidate.logit < 0));
});

test('greedy and deterministic sampling select tokens according to their strategies', () => {
    const greedy = buildCanonicalChatPipeline(REQUEST, { scriptedResponse: RESPONSE, decodingStrategy: 'greedy' });
    assert.equal(greedy.decoding.selectedIndex, 0);
    assert.equal(greedy.decoding.selectedToken, greedy.decoding.topToken);

    const sampling = buildCanonicalChatPipeline(REQUEST, { scriptedResponse: RESPONSE, decodingStrategy: 'sampling' });
    assert.notEqual(sampling.decoding.selectedToken, sampling.decoding.topToken);
    assert.notEqual(sampling.decoding.samplePoint, null);
    const draw = sampling.decoding.samplePoint ?? 0;
    let cumulative = 0;
    const selectedByDraw = sampling.probabilities.find((candidate) => {
        cumulative += candidate.probability;
        return draw <= cumulative;
    });
    assert.equal(selectedByDraw?.token, sampling.decoding.selectedToken);
});

test('generation appends two coherent tokens and updates the second distribution', () => {
    const pipeline = buildCanonicalChatPipeline(REQUEST, { scriptedResponse: RESPONSE });
    assert.equal(pipeline.generationSteps.length, 2);
    assert.equal(
        pipeline.appendedTextFragment,
        pipeline.generationSteps.map((step) => step.appendedFragment).join(''),
    );
    assert.ok(RESPONSE.startsWith(pipeline.appendedTextFragment));
    assert.notDeepEqual(pipeline.generationSteps[0].logits, pipeline.generationSteps[1].logits);
    assert.deepEqual(pipeline.nextStepCandidateUpdate, pipeline.generationSteps[1].logits);
});

test('Agent ask, stop and denied-approval branches never execute a tool', () => {
    const ask = runAgentEngine('תבדוק את הפלייליסט');
    assert.equal(ask.decision.kind, 'ask');
    assert.equal(ask.execution.toolCalled, false);
    assert.equal(ask.execution.observation, null);

    const stop = runAgentEngine('תמחק את הפלייליסט של המשתמש');
    assert.equal(stop.decision.kind, 'stop');
    assert.equal(stop.approval.status, 'pending');
    assert.equal(stop.execution.toolCalled, false);

    const denied = runAgentEngine('תמחק את הפלייליסט 123456789', { approval: 'denied' });
    assert.equal(denied.approval.status, 'denied');
    assert.equal(denied.execution.toolCalled, false);
    assert.equal(denied.execution.observation, null);

    const unauthorized = runAgentEngine('בדוק פלייליסט 123456789', { authorized: false });
    assert.equal(unauthorized.authorization.status, 'unauthorized');
    assert.equal(unauthorized.execution.toolCalled, false);
});

const LIVE_STATE_SAMPLES: Record<string, string> = {
    he: 'איזה שיר מתנגן עכשיו?',
    en: 'What song is playing now?',
    es: '¿Qué canción está sonando ahora?',
    ru: 'Какая песня сейчас играет?',
    ar: 'أي أغنية تعمل الآن؟',
    ja: '今の曲は何ですか',
};
const ALL_VISUALS = { he: chapter1Visuals, en: enVisuals, es: esVisuals, ru: ruVisuals, ar: arVisuals, ja: jaVisuals };

test('live-state sample needs a read-only tool lookup in every locale (no approval, no direct answer)', () => {
    for (const [locale, text] of Object.entries(LIVE_STATE_SAMPLES)) {
        const agent = runAgentEngine(text);
        assert.equal(agent.toolNeed.needed, true, locale);
        assert.equal(agent.toolNeed.tool, 'Playlist API', locale);
        assert.equal(agent.decision.kind, 'tool', locale);
        assert.equal(agent.risk, 'Low', locale);
        assert.equal(agent.approval.required, false, locale);
        assert.equal(agent.execution.toolCalled, true, locale);
        assert.equal(agent.replyKey, 'liveLookup', locale);
        assert.equal(selectChatReplyKey(text), 'tracking', locale);

        const visuals = ALL_VISUALS[locale as keyof typeof ALL_VISUALS];
        assert.ok(visuals.mockEngine.agentReplies.liveLookup, locale);
        assert.ok((visuals.trace.labels.task as Record<string, string>)[agent.task], locale);
    }
});

test('live-state lookup without tool authorization stops and never calls the tool', () => {
    const unauthorized = runAgentEngine(LIVE_STATE_SAMPLES.en, { authorized: false });
    assert.equal(unauthorized.decision.kind, 'stop');
    assert.equal(unauthorized.execution.toolCalled, false);
});
