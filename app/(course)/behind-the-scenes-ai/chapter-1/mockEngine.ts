// app/behind-the-scenes-ai/chapter-1/mockEngine.ts
//
// "מנוע לימודי" דטרמיניסטי לפרק 1 - לא NLP אמיתי ולא מודל.
// מסלול ה-Chat הראשי הוא dataset לימודי מתוסרט וקוהרנטי: כל שלב נגזר מפלט השלב
// שלפניו. כללי מילות-המפתח נשמרים רק לבחירת תרחיש ותשובה מתוסרטת, ולא מוצגים
// עוד כ-logits או כפעילות פנימית של מודל שפה.
//
// פונקציות טהורות בלבד (אין זמן, אקראיות או תופעות לוואי).
// לוגיקה ספציפית-לפרק - לכן יושבת ליד הפרק, לא בתוך ה-primitives הגנריים.

import type { DecisionState, IntentProbability } from '@/components/ai-internals/types';

export type Confidence = 'High' | 'Medium' | 'Low';
export type Risk = 'Low' | 'Medium' | 'High';
export type ModelInputRole = 'system' | 'context' | 'user' | 'assistant';
export type DecodingStrategy = 'greedy' | 'sampling';
export type AgentApprovalStatus = 'not-required' | 'pending' | 'approved' | 'denied';
export type AgentAuthorizationStatus = 'authorized' | 'unauthorized';

export type VectorExcerpt = number[];

export interface ModelInputSegment {
    role: Exclude<ModelInputRole, 'assistant'>;
    text: string;
}

export interface ProductInputEnvelope {
    visibleRequest: string;
    systemInstruction: string;
    selectedContext: string;
    omittedContext: string;
    segments: ModelInputSegment[];
    /** A compact educational serialization, not a provider-specific wire format. */
    serialized: string;
}

export interface TokenBoundary {
    index: number;
    surface: string;
    display: string;
    role: ModelInputRole;
    start: number;
    end: number;
    leadingSpace: boolean;
    special: boolean;
}

export interface TokenWithId extends TokenBoundary {
    /** Scripted educational vocabulary address, never a provider token ID. */
    id: number;
}

export interface VectorRepresentation {
    tokenIndex: number;
    tokenId: number;
    token: string;
    role: ModelInputRole;
    vector: VectorExcerpt;
    /** Row in the fixed scripted learned-vector stand-in table. */
    embeddingRow?: number;
}

export interface PositionAwareRepresentation extends VectorRepresentation {
    position: number;
    positionVector: VectorExcerpt;
    embeddingVector: VectorExcerpt;
}

export interface ContextWindowState {
    capacity: number;
    included: PositionAwareRepresentation[];
    omitted: string[];
    predictionPosition: number;
}

export interface AttentionWeight {
    sourceIndex: number;
    sourceToken: string;
    weight: number;
}

export interface AttentionSnapshot {
    layer: number;
    head: number;
    destinationIndex: number;
    destinationToken: string;
    weights: AttentionWeight[];
    output: VectorRepresentation[];
}

export interface FeedForwardSnapshot {
    input: VectorRepresentation[];
    output: VectorRepresentation[];
}

export interface LayerCheckpoint {
    label: 'input' | 'layer-1' | 'layer-2' | 'final-layer';
    layer: number;
    representations: VectorRepresentation[];
}

export interface LogitCandidate {
    token: string;
    tokenId: number;
    logit: number;
}

export interface ProbabilityCandidate extends LogitCandidate {
    /** Canonical probability in the 0..1 range. */
    probability: number;
}

export interface DecodingState {
    availableStrategies: DecodingStrategy[];
    activeStrategy: DecodingStrategy;
    selectedIndex: number;
    selectedToken: string;
    selectedTokenId: number;
    topToken: string;
    /** Fixed educational draw used only for deterministic sampling. */
    samplePoint: number | null;
}

export interface GenerationStep {
    step: 1 | 2;
    contextBefore: string;
    logits: LogitCandidate[];
    probabilities: ProbabilityCandidate[];
    decoding: DecodingState;
    appendedFragment: string;
    contextAfter: string;
    stopReached: boolean;
}

export interface CanonicalChatPipeline {
    visibleRequest: string;
    productInput: ProductInputEnvelope;
    tokenBoundaries: TokenBoundary[];
    tokenIds: TokenWithId[];
    embeddings: VectorRepresentation[];
    positionAwareRepresentations: PositionAwareRepresentation[];
    contextWindow: ContextWindowState;
    attention: AttentionSnapshot;
    feedForward: FeedForwardSnapshot;
    layerCheckpoints: LayerCheckpoint[];
    finalRepresentations: VectorRepresentation[];
    predictionPosition: number;
    logits: LogitCandidate[];
    probabilities: ProbabilityCandidate[];
    decoding: DecodingState;
    generationSteps: GenerationStep[];
    appendedTextFragment: string;
    nextStepCandidateUpdate: LogitCandidate[];
    finalScriptedResponse: string;
    replyKey: ChatReplyKey;
}

export interface CanonicalPipelineOptions {
    systemInstruction?: string;
    selectedContext?: string;
    omittedContext?: string;
    scriptedResponse?: string;
    decodingStrategy?: DecodingStrategy;
}

export interface AgentRunOptions {
    approval?: 'pending' | 'approved' | 'denied';
    authorized?: boolean;
    transport?: 'direct' | 'mcp';
}

// מפתחות התשובה: המנוע נשאר טהור ומחזיר מזהה תשובה בלבד (לא טקסט). שכבת התצוגה
// פותרת אותו לטקסט הנכון מהמילון (chapter1Visuals.mockEngine), כדי שהפלט יהיה
// תלוי-שפה בלי להכניס תלות-מילון למודול הלוגי הזה.
export type ChatReplyKey = 'notDelivered' | 'tracking' | 'system' | 'payment' | 'other';
export type AgentReplyKey = 'sensitive' | 'tool' | 'liveLookup' | 'askBarcode' | 'vague' | 'general';

export interface ChatEngineResult {
    tokens: string[];
    meaning: string;
    intents: IntentProbability[];
    confidence: Confidence;
    decision: DecisionState;
    output: string;
    replyKey: ChatReplyKey;
    pipeline: CanonicalChatPipeline;
}

export interface AgentEngineResult {
    tokens: string[];
    task: string;
    missingInfo: string;
    toolNeed: { needed: boolean; tool: string };
    canActNow: boolean;
    risk: Risk;
    decision: DecisionState;
    output: string;
    replyKey: AgentReplyKey;
    authorization: {
        required: boolean;
        status: AgentAuthorizationStatus;
        tool: string | null;
    };
    approval: {
        required: boolean;
        status: AgentApprovalStatus;
    };
    execution: {
        attempted: boolean;
        toolCalled: boolean;
        tool: string | null;
        transport: 'direct' | 'mcp' | null;
        observation: string | null;
    };
}

// --- עזרי טקסט ---

// יפנית נכתבת בלי רווחים, ולכן פיצול-רווח היה מחזיר טוקן יחיד (ראש הקריאה תקוע על 1/1).
// זיהוי כתב יפני (קאנה/קאנג'י) - אותו ביטוי בדיוק כמו ב-vocabFor.
const isJapanese = (text: string) => /[぀-ヿ一-鿿]/.test(text);

export function tokenize(text: string): string[] {
    const trimmed = text.trim();
    if (!trimmed) return [];
    return scriptedBoundariesForText(trimmed, 'user', 0).map((token) => token.surface);
}

// מפת-override דטרמיניסטית לקלטי-ההדגמה היפניים של פרק 1. לקלטים הידועים נקבע
// חיתוך לימודי טבעי; קלט אחר נופל לחיתוך מתוסרט לפי מעבר-כתב. זו טבלת-נתונים בלבד,
// מצומדת לקלט-ההדגמה ב-ja/behind-ai/chapter1*.ts. ההתאמה דטרמיניסטית ולכן SSR
// וה-hydration זהים, בלי תלות בגרסת ICU של הדפדפן.
const JA_DEMO_SEGMENTS: Record<string, string[]> = {
    '曲が再生されません': ['曲', 'が', '再生', 'されません'],
    '今の曲は何ですか': ['今', 'の', '曲', 'は', '何', 'です', 'か'],
    'プレイリスト 123456 を見せて': ['プレイリスト', '123456', 'を', '見せて'],
    'プレイリスト 123456 を削除して': ['プレイリスト', '123456', 'を', '削除', 'して'],
    'これを対応して': ['これ', 'を', '対応', 'して'],
};

// פיצול מתוסרט לפי מעבר בין מחלקות-כתב יפניות. איננו תלוי בגרסת ICU בדפדפן,
// ולכן אותם קלטים מפיקים אותם גבולות גם ב-SSR וגם ב-hydration.
function chunkJaByScript(text: string): string[] {
    const classOf = (ch: string): string => {
        if (/\s/.test(ch)) return 'space';
        if (/[一-鿿]/.test(ch)) return 'kanji';
        if (/[぀-ゟ]/.test(ch)) return 'hira';
        if (/[゠-ヿ]/.test(ch)) return 'kata';
        return 'other';
    };
    const out: string[] = [];
    let cur = '';
    let curClass = '';
    for (const ch of text) {
        const cls = classOf(ch);
        if (cls === 'space') { if (cur) { out.push(cur); cur = ''; curClass = ''; } continue; }
        if (cur && cls !== curClass) { out.push(cur); cur = ''; }
        cur += ch;
        curClass = cls;
    }
    if (cur) out.push(cur);
    return out.filter(Boolean);
}

// מחבר טוקנים חזרה למחרוזת (לראש הקריאה, שמריץ את המנוע על תת-מחרוזת, ולתצוגת
// הנורמליזציה). יפנית מחוברת בלי רווחים כדי שזיהוי תת-המחרוזת של המנוע יישמר
// (届きません לא יישבר ל-"届き ません"); שאר השפות מחוברות ברווח כרגיל. כך פלט המנוע
// בראש הקריאה נשאר זהה להרצה הישירה, וההתנהגות ב-he/en/es/ru/ar אינה משתנה.
export function joinTokens(tokens: string[], text: string): string {
    // The scripted tokenizer keeps leading spaces on the following token.
    // The Japanese fallback has no spaces, so concatenation reconstructs both forms.
    const carriesSpacing = tokens.some((token) => /^\s/.test(token));
    return tokens.join(carriesSpacing || isJapanese(text) ? '' : ' ');
}

const VECTOR_WIDTH = 4;
const SPECIAL_TOKEN_IDS: Record<ModelInputRole, number> = {
    system: 101,
    context: 102,
    user: 103,
    assistant: 104,
};

const SPECIAL_TOKEN_SURFACES: Record<ModelInputRole, string> = {
    system: '<|system|>',
    context: '<|context|>',
    user: '<|user|>',
    assistant: '<|assistant|>',
};

const round = (value: number, digits = 4): number => Number(value.toFixed(digits));
const addVectors = (a: VectorExcerpt, b: VectorExcerpt): VectorExcerpt =>
    Array.from({ length: VECTOR_WIDTH }, (_, i) => round((a[i] ?? 0) + (b[i] ?? 0)));
const scaleVector = (vector: VectorExcerpt, scale: number): VectorExcerpt => vector.map((value) => round(value * scale));
const dot = (a: VectorExcerpt, b: VectorExcerpt): number => a.reduce((sum, value, i) => sum + value * (b[i] ?? 0), 0);

function scriptedBoundariesForText(text: string, role: ModelInputRole, indexOffset: number): TokenBoundary[] {
    if (!text) return [];

    const pieces: { surface: string; start: number; end: number }[] = [];
    if (isJapanese(text)) {
        let cursor = 0;
        const scriptedParts = JA_DEMO_SEGMENTS[text] ?? chunkJaByScript(text);
        for (const part of scriptedParts) {
            const found = text.indexOf(part, cursor);
            const tokenStart = found >= 0 ? found : cursor;
            const start = cursor;
            const end = tokenStart + part.length;
            pieces.push({ surface: text.slice(start, end), start, end });
            cursor = end;
        }
    } else {
        const expression = /\s*(?:[\p{L}\p{M}\p{N}]+|[^\s\p{L}\p{M}\p{N}])/gu;
        for (const match of text.matchAll(expression)) {
            const start = match.index ?? 0;
            pieces.push({ surface: match[0], start, end: start + match[0].length });
        }
    }

    return pieces.filter((piece) => piece.surface.trim().length > 0).map((piece, localIndex) => ({
        index: indexOffset + localIndex,
        surface: piece.surface,
        display: piece.surface.replace(/^\s+/, (space) => '␠'.repeat(space.length)),
        role,
        start: piece.start,
        end: piece.end,
        leadingSpace: /^\s/.test(piece.surface),
        special: false,
    }));
}

function roleBoundary(role: ModelInputRole, index: number): TokenBoundary {
    return {
        index,
        surface: SPECIAL_TOKEN_SURFACES[role],
        display: SPECIAL_TOKEN_SURFACES[role],
        role,
        start: -1,
        end: -1,
        leadingSpace: false,
        special: true,
    };
}

/** Stable educational tokenizer example for the complete simplified model input. */
export function tokenizeModelInput(envelope: ProductInputEnvelope): TokenBoundary[] {
    const tokens: TokenBoundary[] = [];
    for (const segment of envelope.segments) {
        tokens.push(roleBoundary(segment.role, tokens.length));
        tokens.push(...scriptedBoundariesForText(segment.text, segment.role, tokens.length));
    }
    tokens.push(roleBoundary('assistant', tokens.length));
    return tokens;
}

/** Scripted vocabulary address. It is stable but is not an ID from any provider tokenizer. */
export function scriptedTokenId(surface: string, role: ModelInputRole, special = false): number {
    if (special) return SPECIAL_TOKEN_IDS[role];
    let value = 2166136261;
    for (const character of surface.normalize('NFC')) {
        value ^= character.codePointAt(0) ?? 0;
        value = Math.imul(value, 16777619) >>> 0;
    }
    return 1000 + (value % 50000);
}

function attachTokenIds(boundaries: TokenBoundary[]): TokenWithId[] {
    return boundaries.map((token) => ({
        ...token,
        id: scriptedTokenId(token.surface, token.role, token.special),
    }));
}

// Explicit fixed table: IDs select rows, but no coordinate is generated from a hash.
// These are scripted excerpts standing in for rows that a real model learned in training.
const SCRIPTED_LEARNED_ROWS: VectorExcerpt[] = [
    [0.42, -0.18, 0.73, 0.09], [-0.61, 0.34, 0.12, 0.81], [0.07, 0.92, -0.44, 0.25],
    [0.68, 0.11, -0.57, 0.36], [-0.24, -0.76, 0.48, 0.63], [0.83, -0.31, 0.06, -0.52],
    [-0.15, 0.57, 0.79, -0.28], [0.31, -0.64, -0.09, 0.88], [-0.72, 0.22, 0.51, 0.14],
    [0.55, 0.47, -0.33, -0.69], [-0.08, -0.41, 0.94, 0.27], [0.76, -0.53, 0.21, 0.05],
    [-0.39, 0.85, -0.16, 0.43], [0.18, 0.26, 0.67, -0.74], [-0.87, -0.04, 0.35, 0.58],
    [0.49, -0.82, 0.29, 0.17], [0.02, 0.69, -0.78, 0.46], [-0.53, 0.13, 0.84, -0.32],
    [0.91, 0.24, -0.11, -0.37], [-0.27, -0.58, 0.62, 0.71], [0.64, -0.07, 0.39, -0.86],
    [-0.46, 0.75, 0.03, 0.52], [0.36, 0.16, -0.92, 0.41], [-0.79, 0.45, 0.28, -0.06],
];

function learnedRowIndex(tokenId: number): number {
    return tokenId % SCRIPTED_LEARNED_ROWS.length;
}

function learnedRowExcerpt(token: Pick<TokenWithId, 'id'>): VectorExcerpt {
    return [...SCRIPTED_LEARNED_ROWS[learnedRowIndex(token.id)]];
}

function embeddingSequence(tokens: TokenWithId[]): VectorRepresentation[] {
    return tokens.map((token) => ({
        tokenIndex: token.index,
        tokenId: token.id,
        token: token.surface,
        role: token.role,
        vector: learnedRowExcerpt(token),
        embeddingRow: learnedRowIndex(token.id),
    }));
}

function positionalExcerpt(position: number): VectorExcerpt {
    return [
        round(Math.sin(position)),
        round(Math.cos(position)),
        round(Math.sin(position / 10)),
        round(Math.cos(position / 10)),
    ];
}

function addPositions(embeddings: VectorRepresentation[]): PositionAwareRepresentation[] {
    return embeddings.map((embedding, position) => {
        const positionVector = positionalExcerpt(position);
        return {
            ...embedding,
            position,
            embeddingVector: [...embedding.vector],
            positionVector,
            vector: addVectors(embedding.vector, positionVector),
        };
    });
}

export function softmax(logits: LogitCandidate[]): ProbabilityCandidate[] {
    if (!logits.length) return [];
    const maxLogit = Math.max(...logits.map((candidate) => candidate.logit));
    const exponentials = logits.map((candidate) => Math.exp(candidate.logit - maxLogit));
    const total = exponentials.reduce((sum, value) => sum + value, 0);
    return logits.map((candidate, index) => ({
        ...candidate,
        probability: exponentials[index] / total,
    }));
}

function contextualize(sequence: PositionAwareRepresentation[]): AttentionSnapshot {
    const output = sequence.map<VectorRepresentation>((destination, destinationIndex) => {
        const available = sequence.slice(0, destinationIndex + 1);
        const rawScores = available.map((source) => dot(destination.vector, source.vector) / Math.sqrt(VECTOR_WIDTH));
        const maxScore = Math.max(...rawScores);
        const exponentials = rawScores.map((score) => Math.exp(score - maxScore));
        const total = exponentials.reduce((sum, value) => sum + value, 0);
        const weights = exponentials.map((value) => value / total);
        const mixed = Array.from({ length: VECTOR_WIDTH }, (_, component) => round(
            available.reduce((sum, source, sourceIndex) => sum + weights[sourceIndex] * source.vector[component], 0),
        ));
        return {
            tokenIndex: destination.tokenIndex,
            tokenId: destination.tokenId,
            token: destination.token,
            role: destination.role,
            vector: addVectors(scaleVector(destination.vector, 0.7), scaleVector(mixed, 0.3)),
        };
    });

    const destinationIndex = Math.max(0, sequence.length - 1);
    const destination = sequence[destinationIndex];
    const available = sequence.slice(0, destinationIndex + 1);
    const rawScores = available.map((source) => dot(destination.vector, source.vector) / Math.sqrt(VECTOR_WIDTH));
    const maxScore = Math.max(...rawScores);
    const exponentials = rawScores.map((score) => Math.exp(score - maxScore));
    const total = exponentials.reduce((sum, value) => sum + value, 0);
    return {
        layer: 1,
        head: 1,
        destinationIndex,
        destinationToken: destination?.token ?? SPECIAL_TOKEN_SURFACES.assistant,
        weights: available.map((source, index) => ({
            sourceIndex: source.tokenIndex,
            sourceToken: source.token,
            weight: exponentials[index] / total,
        })),
        output,
    };
}

function feedForward(sequence: VectorRepresentation[]): FeedForwardSnapshot {
    const output = sequence.map<VectorRepresentation>((item) => {
        const hidden = item.vector.map((value, index) => Math.max(0, value * (1.15 + index * 0.08) + (index - 1.5) * 0.07));
        const transformed = hidden.map((value, index) => round(value * (0.45 + index * 0.05) - 0.08));
        return { ...item, vector: addVectors(item.vector, transformed) };
    });
    return { input: sequence.map((item) => ({ ...item, vector: [...item.vector] })), output };
}

function refineLayer(sequence: VectorRepresentation[], layer: number): VectorRepresentation[] {
    return sequence.map((item, index) => {
        const previous = sequence[Math.max(0, index - 1)].vector;
        const blended = item.vector.map((value, component) => (
            value * 0.82 + previous[component] * 0.12 + (layer + 1) * (component + 1) * 0.006
        ));
        return { ...item, vector: blended.map((value) => round(Math.tanh(value))) };
    });
}

function layerCheckpoints(sequence: VectorRepresentation[]): LayerCheckpoint[] {
    const layer1 = refineLayer(sequence, 1);
    const layer2 = refineLayer(layer1, 2);
    const finalLayer = refineLayer(layer2, 3);
    return [
        { label: 'input', layer: 0, representations: sequence },
        { label: 'layer-1', layer: 1, representations: layer1 },
        { label: 'layer-2', layer: 2, representations: layer2 },
        { label: 'final-layer', layer: 3, representations: finalLayer },
    ];
}

function candidateTokens(responseTokens: TokenBoundary[], step: 0 | 1): string[] {
    const selected = responseTokens[step]?.surface ?? (step === 0 ? 'OK' : '.');
    const alternate = responseTokens[step + 1]?.surface ?? (step === 0 ? ' ...' : '.');
    const punctuation = /[.!?؟。]/u.test(selected) ? ' ...' : '.';
    return Array.from(new Set([selected, alternate, punctuation, '<stop>'])).slice(0, 4);
}

function buildLogits(
    candidates: string[],
    selectedToken: string,
    strategy: DecodingStrategy,
    predictionVector: VectorExcerpt,
    step: 0 | 1,
): LogitCandidate[] {
    const ordered = strategy === 'sampling'
        ? [candidates.find((token) => token !== selectedToken) ?? selectedToken, selectedToken, ...candidates.filter((token) => token !== selectedToken).slice(1)]
        : [selectedToken, ...candidates.filter((token) => token !== selectedToken)];
    const bases = strategy === 'sampling' ? [2.6, 2.2, 0.4, -1.2] : [3.1, 1.2, 0.1, -1.4];
    return ordered.slice(0, 4).map((token, index) => {
        const headSignal = predictionVector.reduce((sum, value, component) => sum + value * ((index + 1) * (component + 2)) * 0.004, 0);
        return {
            token,
            tokenId: scriptedTokenId(token, 'assistant'),
            logit: round((bases[index] ?? -2) + headSignal + step * (0.11 - index * 0.04)),
        };
    });
}

function decode(probabilities: ProbabilityCandidate[], strategy: DecodingStrategy, selectedToken: string): DecodingState {
    const selectedIndex = Math.max(0, probabilities.findIndex((candidate) => candidate.token === selectedToken));
    let samplePoint: number | null = null;
    if (strategy === 'sampling') {
        const before = probabilities.slice(0, selectedIndex).reduce((sum, item) => sum + item.probability, 0);
        samplePoint = before + probabilities[selectedIndex].probability / 2;
    }
    return {
        availableStrategies: ['greedy', 'sampling'],
        activeStrategy: strategy,
        selectedIndex,
        selectedToken: probabilities[selectedIndex]?.token ?? '',
        selectedTokenId: probabilities[selectedIndex]?.tokenId ?? 0,
        topToken: probabilities[0]?.token ?? '',
        samplePoint,
    };
}

function defaultResponse(replyKey: ChatReplyKey): string {
    const responses: Record<ChatReplyKey, string> = {
        notDelivered: 'This looks like a playback problem. Try restarting the song.',
        tracking: 'I cannot see what is playing right now. Checking it needs access to the live playback source, for example through a tool.',
        system: 'This may be a glitch in the app. Try refreshing and playing again.',
        payment: 'Here is a recommendation based on what you asked.',
        other: 'Please add a little more context.',
    };
    return responses[replyKey];
}

// עוזרים אלה מיוצאים (additive בלבד) כדי שטבלת ה-trace תוכל לחשוף את אותם
// בדיקות-מפתח שהמנוע כבר מבצע - מקור-אמת יחיד, בלי שכפול לוגיקה ובלי מספרים חדשים.
// ההשוואה היא חסרת-רגישות לאותיות גדולות/קטנות (אוצר-המילים באותיות קטנות), כדי
// שקלט אנגלי במשפט רגיל ("Where", "Check") יזוהה. בעברית אין אותיות גדולות, ולכן
// toLowerCase הוא זהותי וההתנהגות העברית נשארת זהה.
export const includesAny = (text: string, words: string[]) => { const t = text.toLowerCase(); return words.some((w) => t.includes(w)); };
export const countHits = (text: string, words: string[]) => { const t = text.toLowerCase(); return words.filter((w) => t.includes(w)).length; };
export const matchedWords = (text: string, words: string[]) => { const t = text.toLowerCase(); return words.filter((w) => t.includes(w)); };
export const hasBarcode = (text: string) => /\d{6,}/.test(text);

// ════════════════════ אוצר-מילים תלוי-שפה לזיהוי (C3/C4) ════════════════════
// המנוע מזהה כוונה/פעולה לפי התאמת תת-מחרוזות. אוצר-המילים מצומד לקלטי-ההדגמה
// הפעילים שב-chapter1.seed, ולכן הוא תלוי-שפה: כל שפה מזוהה לפי האוצר שלה.
//
// בחירת האוצר נעשית לפי כתב הקלט (vocabFor): עברית / ערבית / קירילית / יפנית מזוהות
// לפי הכתב; כל השאר (לטיני) נופל לאוצר LATIN. אנגלית וספרדית חולקות כתב לטיני ולכן
// אינן ניתנות להפרדה לפי כתב - לכן LATIN_VOCAB מאחד את שתיהן (מילות en + es יחד).
// התאמת תת-מחרוזת מבטיחה שקלט אנגלי פוגע במילים האנגליות וקלט ספרדי במילים הספרדיות,
// בלי התנגשות (נבדק שאין מילה של שפה אחת שהיא תת-מחרוזת של קלט השפה האחרת).
// ההתנהגות העברית והאנגלית נשארות זהות לחלוטין.
//
// negation הוא מערך (כל שפה עשויה להזדקק לכמה סימני שלילה; לטיני מאחד en+es).
export interface Vocab {
    /** סימני שלילה (מחזקים את כוונת בעיית הניגון). includesAny => חסר-רגישות לאותיות. */
    negation: string[];
    /** מילות-מפתח לכל כוונת Chat, לפי מפתח הכלל. */
    chatWords: Record<ChatRuleKey, string[]>;
    actionWords: string[];
    sensitiveWords: string[];
    deliveryWords: string[];
    vagueWords: string[];
}

const HE_VOCAB: Vocab = {
    negation: ['לא'],
    chatWords: {
        notDelivered: ['לא מתנגן', 'לא מתנגנת', 'נתקע', 'נתקעה', 'מדלג', 'קופץ', 'הפסיק לנגן'],
        tracking: ['איזה שיר', 'מה מתנגן', 'עכשיו מתנגן', 'מה מנגן'],
        system: ['אפליקציה', 'קורסת', 'נתקעת', 'קפואה', 'לא נפתחת', 'תקלה', 'קורס'],
        payment: ['המלץ', 'תמליץ', 'המלצה', 'הצע לי', 'שיר טוב ל', 'תציע'],
    },
    actionWords: ['בדוק', 'תבדוק', 'מצא', 'שלוף', 'עדכן', 'תעדכן', 'שלח', 'תשלח', 'פתח', 'סגור', 'תטפל', 'טפל'],
    sensitiveWords: ['שלח', 'תשלח', 'עדכן', 'תעדכן', 'מחק', 'תמחק'],
    deliveryWords: ['פלייליסט', 'רשימת השמעה', 'רשימת ההשמעה'],
    vagueWords: ['תטפל בזה', 'תטפל', 'זה', 'אותו'],
};

// אוצר לטיני: אנגלית + ספרדית יחד (שני הכתבים לטיניים, אי אפשר להפריד לפי כתב).
// es: "no " עם רווח נבחר כסימן שלילה כדי לא להתנגש ב-"not" האנגלי (n-o-t).
const LATIN_VOCAB: Vocab = {
    negation: ["n't", 'no '],
    chatWords: {
        notDelivered: ["isn't playing", "won't play", 'not playing', 'stopped playing', 'keeps stopping', "won't start", "doesn't play",
            'no suena', 'no está sonando', 'no esta sonando', 'no se reproduce', 'dejó de sonar', 'dejo de sonar', 'no reproduce', 'no arranca'],
        tracking: ['what song', 'now playing', "what's playing", 'what is playing', 'which song',
            'qué canción', 'que cancion', 'qué está sonando', 'que esta sonando', 'qué suena', 'que suena'],
        system: ['app', 'freezing', 'freezes', 'crashing', 'crashes', 'app keeps', 'not working', 'glitch',
            'aplicación', 'aplicacion', 'se congela', 'se cuelga', 'no funciona', 'falla', 'se traba'],
        payment: ['recommend', 'suggest', 'suggestion', 'recommendation', 'what should i listen',
            'recomienda', 'recomiéndame', 'recomiendame', 'sugiere', 'sugerencia', 'recomendación', 'recomendacion'],
    },
    actionWords: ['check', 'find', 'look up', 'update', 'send', 'tell', 'handle',
        'revisa', 'revisar', 'busca', 'encuentra', 'actualiza', 'envía', 'envia', 'avisa', 'encárgate', 'encargate', 'gestiona'],
    sensitiveWords: ['send', 'tell', 'email', 'notify', 'update', 'delete', 'remove', 'envía', 'envia', 'avisa', 'notifica', 'actualiza', 'elimina', 'borra'],
    deliveryWords: ['playlist', 'playlists', 'lista de reproducción', 'listas de reproducción'],
    vagueWords: ['handle it', 'take care of it', 'sort it out', 'deal with it', 'just handle', 'encárgate de esto', 'encárgate', 'ocúpate', 'de esto'],
};

// אוצר ערבית (MSA). מצומד לקלט-ההדגמה ב-ar/chapter1*.ts.
const AR_VOCAB: Vocab = {
    negation: ['لا '],
    chatWords: {
        notDelivered: ['لا تعمل', 'لا تشتغل', 'توقفت عن العمل', 'متوقفة'],
        tracking: ['أي أغنية', 'ما الأغنية', 'ماذا يشتغل الآن', 'أي أغنية تعمل الآن'],
        system: ['التطبيق', 'يتجمد', 'يتعطل', 'عطل', 'يتوقف فجأة'],
        payment: ['اقترح', 'رشح لي', 'أوصي', 'توصية', 'اقتراح', 'ماذا أستمع'],
    },
    actionWords: ['تحقق', 'افحص', 'ابحث', 'حدّث', 'أرسل', 'أبلغ', 'تولَّ', 'تولى', 'عالج'],
    sensitiveWords: ['أرسل', 'أبلغ', 'حدّث', 'احذف', 'عدّل'],
    deliveryWords: ['قائمة التشغيل', 'قائمة تشغيل', 'بلاي ليست'],
    vagueWords: ['تولَّ هذا', 'هذا الأمر', 'تولَّ', 'اعتنِ'],
};

// אוצר רוסית. מצומד לקלט-ההדגמה ב-ru/chapter1*.ts.
const RU_VOCAB: Vocab = {
    negation: ['не '],
    chatWords: {
        notDelivered: ['не играет', 'не воспроизводится', 'перестала играть', 'перестал играть', 'не звучит', 'не запускается'],
        tracking: ['какая песня', 'что играет', 'что сейчас играет', 'какая сейчас песня'],
        system: ['приложение', 'зависает', 'вылетает', 'глючит', 'зависло'],
        payment: ['посоветуй', 'порекомендуй', 'рекомендация', 'предложи', 'что послушать'],
    },
    actionWords: ['проверь', 'проверить', 'найди', 'обнови', 'отправь', 'сообщи', 'разберись', 'займись'],
    sensitiveWords: ['отправь', 'сообщи', 'уведоми', 'обнови', 'удали'],
    deliveryWords: ['плейлист', 'плейлисты', 'плей-лист'],
    vagueWords: ['разберись с этим', 'разберись', 'займись этим', 'с этим'],
};

// אוצר יפנית. מצומד לקלט-ההדגמה ב-ja/chapter1*.ts. זיהוי הכוונה הוא התאמת תת-מחרוזת
// על הטקסט הגולמי, והפיצול החזותי משתמש בטבלת הדוגמאות ובמעברי כתב מתוסרטים,
// כך שהיפנית נחתכת ליחידות מרובות ובאופן יציב בין סביבות.
const JA_VOCAB: Vocab = {
    negation: ['ません', 'ない'],
    chatWords: {
        notDelivered: ['再生されません', '再生されない', '止まってしまいます', '流れません'],
        tracking: ['今の曲', '今何の曲', '流れている曲', '何の曲が流れている'],
        system: ['アプリ', 'フリーズ', '固まる', 'クラッシュ', '動かない', 'アプリが落ちる'],
        payment: ['おすすめ', 'お勧め', '提案して', '何を聴けば', 'レコメンド'],
    },
    actionWords: ['確認', '調べ', '探し', '更新', '送信', '伝え', '対応', '処理'],
    sensitiveWords: ['送信', '送って', '伝え', '通知', '更新', '削除'],
    deliveryWords: ['プレイリスト'],
    vagueWords: ['これを対応', 'これを', '対応して', 'よろしく'],
};

/** בוחר אוצר-מילים לפי כתב הקלט. לטיני (en/es) מאוחד. */
export function vocabFor(text: string): Vocab {
    if (/[֐-׿]/.test(text)) return HE_VOCAB;                 // עברית
    if (/[؀-ۿ]/.test(text)) return AR_VOCAB;                 // ערבית
    if (/[Ѐ-ӿ]/.test(text)) return RU_VOCAB;                 // קירילית (רוסית)
    if (/[぀-ヿ一-鿿]/.test(text)) return JA_VOCAB;    // יפנית (קאנה/קאנג'י)
    return LATIN_VOCAB;                                                // לטיני (en + es)
}

// --- Chat Mode: דירוג כוונות ---

export type ChatRuleKey = 'notDelivered' | 'tracking' | 'system' | 'payment';

export interface ChatRule {
    key: ChatRuleKey;
    label: string;
    meaning: string;
}

// מבנה הכוונות (מפתח, תווית, משמעות) - לא תלוי-שפה. מילות-הזיהוי עברו ל-Vocab.
export const CHAT_RULES: ChatRule[] = [
    { key: 'notDelivered', label: 'Playback problem', meaning: 'Playback issue' },
    { key: 'tracking', label: 'Now-playing question', meaning: 'Now-playing request' },
    { key: 'system', label: 'App problem', meaning: 'App issue' },
    { key: 'payment', label: 'Recommendation request', meaning: 'Recommendation request' },
];

export const UNMATCHED_BASE = 0.15;
export const HIT_WEIGHT = 3.0;
export const NEGATION_BOOST = 1.5;
export const OTHER_BASE = 0.4;

/** ממיר ציונים גולמיים לאחוזים שמסתכמים ל-100, ממוין יורד. */
function normalize(raw: { label: string; score: number }[]): IntentProbability[] {
    const total = raw.reduce((s, x) => s + x.score, 0) || 1;
    const pcts = raw.map((x) => ({ label: x.label, value: Math.round((x.score / total) * 100) }));

    const sum = pcts.reduce((s, x) => s + x.value, 0);
    const diff = 100 - sum;
    if (diff !== 0 && pcts.length) {
        const topIdx = pcts.reduce((mi, x, i, arr) => (x.value > arr[mi].value ? i : mi), 0);
        pcts[topIdx] = { ...pcts[topIdx], value: pcts[topIdx].value + diff };
    }

    return pcts.sort((a, b) => b.value - a.value);
}

function confidenceFrom(intents: IntentProbability[]): Confidence {
    const top = intents[0]?.value ?? 0;
    const second = intents[1]?.value ?? 0;
    const margin = top - second;
    if (margin >= 40) return 'High';
    if (margin >= 15) return 'Medium';
    return 'Low';
}

function classifyChat(text: string): Omit<ChatEngineResult, 'pipeline'> {
    const vocab = vocabFor(text);
    const tokens = tokenize(text);
    const hasNegation = includesAny(text, vocab.negation);

    const raw = CHAT_RULES.map((rule) => {
        const hits = countHits(text, vocab.chatWords[rule.key]);
        let score = UNMATCHED_BASE + hits * HIT_WEIGHT;
        if (rule.key === 'notDelivered' && hasNegation) score += NEGATION_BOOST;
        return { key: rule.key, label: rule.label, meaning: rule.meaning, score };
    });

    const scored = [
        ...raw.map((r) => ({ label: r.label, score: r.score })),
        { label: 'Other', score: OTHER_BASE },
    ];

    const intents = normalize(scored);
    const confidence = confidenceFrom(intents);

    // הכוונה המובילה -> משמעות + מפתח תשובה
    const topLabel = intents[0]?.label ?? 'Other';
    const topRule = raw.find((r) => r.label === topLabel);
    const meaning = topRule?.meaning ?? 'General request';

    const isConfident = confidence !== 'Low';
    const decision: DecisionState = isConfident
        ? { kind: 'answer', label: 'Generate response' }
        : { kind: 'ask', label: 'Ask for more context' };

    // כשהביטחון נמוך התשובה תמיד 'other' (בקשת הבהרה), בדיוק כמו קודם.
    const replyKey: ChatReplyKey = isConfident ? ((topRule?.key as ChatReplyKey) ?? 'other') : 'other';

    return {
        tokens,
        meaning,
        intents,
        confidence,
        decision,
        output: isConfident ? 'Response generated' : 'Clarifying question',
        replyKey,
    };
}

/** Scenario selection is separate from the educational model trace. */
export function selectChatReplyKey(text: string): ChatReplyKey {
    return classifyChat(text).replyKey;
}

/** Builds the single canonical educational dataset consumed by all 14 Chat stations. */
export function buildCanonicalChatPipeline(
    text: string,
    options: CanonicalPipelineOptions = {},
): CanonicalChatPipeline {
    const classification = classifyChat(text);
    const visibleRequest = text.trim();
    const systemInstruction = options.systemInstruction ?? 'Answer briefly and clearly as a support assistant.';
    const selectedContext = options.selectedContext ?? 'Selected context: delivery and account support.';
    const omittedContext = options.omittedContext ?? 'Older conversation and product memory are not included in this example.';
    const segments: ModelInputSegment[] = [
        { role: 'system', text: systemInstruction },
        { role: 'context', text: selectedContext },
        { role: 'user', text: visibleRequest },
    ];
    const productInput: ProductInputEnvelope = {
        visibleRequest,
        systemInstruction,
        selectedContext,
        omittedContext,
        segments,
        serialized: segments.map((segment) => `<|${segment.role}|>\n${segment.text}`).join('\n'),
    };

    const tokenBoundaries = tokenizeModelInput(productInput);
    const tokenIds = attachTokenIds(tokenBoundaries);
    const embeddings = embeddingSequence(tokenIds);
    const positionAwareRepresentations = addPositions(embeddings);
    const contextCapacity = 64;
    const windowStart = Math.max(0, positionAwareRepresentations.length - contextCapacity);
    const includedRepresentations = positionAwareRepresentations.slice(windowStart);
    const outsideWindow = positionAwareRepresentations
        .slice(0, windowStart)
        .map((item) => item.token)
        .join('');
    const predictionPosition = includedRepresentations[includedRepresentations.length - 1]?.tokenIndex ?? 0;
    const contextWindow: ContextWindowState = {
        capacity: contextCapacity,
        included: includedRepresentations,
        omitted: [outsideWindow, omittedContext].filter(Boolean),
        predictionPosition,
    };
    const attention = contextualize(contextWindow.included);
    const feedForwardResult = feedForward(attention.output);
    const checkpoints = layerCheckpoints(feedForwardResult.output);
    const finalRepresentations = checkpoints[checkpoints.length - 1].representations;
    const predictionRepresentation = finalRepresentations[finalRepresentations.length - 1];

    const finalScriptedResponse = options.scriptedResponse ?? defaultResponse(classification.replyKey);
    const responseTokens = scriptedBoundariesForText(finalScriptedResponse, 'assistant', 0);
    const firstSelected = responseTokens[0]?.surface ?? finalScriptedResponse;
    const secondSelected = responseTokens[1]?.surface ?? '<stop>';
    const strategy = options.decodingStrategy
        ?? (scriptedTokenId(visibleRequest || '-', 'user') % 2 === 0 ? 'greedy' : 'sampling');

    const firstLogits = buildLogits(
        candidateTokens(responseTokens, 0),
        firstSelected,
        strategy,
        predictionRepresentation?.vector ?? [0, 0, 0, 0],
        0,
    );
    const firstProbabilities = softmax(firstLogits);
    const firstDecoding = decode(firstProbabilities, strategy, firstSelected);
    const firstContextBefore = `${productInput.serialized}\n${SPECIAL_TOKEN_SURFACES.assistant}`;
    const firstContextAfter = firstContextBefore + firstDecoding.selectedToken;

    const selectedEmbedding = learnedRowExcerpt({ id: firstDecoding.selectedTokenId });
    const nextPredictionVector = addVectors(
        scaleVector(predictionRepresentation?.vector ?? [0, 0, 0, 0], 0.72),
        scaleVector(addVectors(selectedEmbedding, positionalExcerpt(finalRepresentations.length)), 0.28),
    );
    const secondLogits = buildLogits(
        candidateTokens(responseTokens, 1),
        secondSelected,
        strategy,
        nextPredictionVector,
        1,
    );
    const secondProbabilities = softmax(secondLogits);
    const secondDecoding = decode(secondProbabilities, strategy, secondSelected);
    const secondContextAfter = firstContextAfter + secondDecoding.selectedToken;

    const generationSteps: GenerationStep[] = [
        {
            step: 1,
            contextBefore: firstContextBefore,
            logits: firstLogits,
            probabilities: firstProbabilities,
            decoding: firstDecoding,
            appendedFragment: firstDecoding.selectedToken,
            contextAfter: firstContextAfter,
            stopReached: false,
        },
        {
            step: 2,
            contextBefore: firstContextAfter,
            logits: secondLogits,
            probabilities: secondProbabilities,
            decoding: secondDecoding,
            appendedFragment: secondDecoding.selectedToken,
            contextAfter: secondContextAfter,
            stopReached: secondDecoding.selectedToken === '<stop>',
        },
    ];

    return {
        visibleRequest,
        productInput,
        tokenBoundaries,
        tokenIds,
        embeddings,
        positionAwareRepresentations,
        contextWindow,
        attention,
        feedForward: feedForwardResult,
        layerCheckpoints: checkpoints,
        finalRepresentations,
        predictionPosition,
        logits: firstLogits,
        probabilities: firstProbabilities,
        decoding: firstDecoding,
        generationSteps,
        appendedTextFragment: firstDecoding.selectedToken + secondDecoding.selectedToken,
        nextStepCandidateUpdate: secondLogits,
        finalScriptedResponse,
        replyKey: classification.replyKey,
    };
}

export function runChatEngine(
    text: string,
    options: CanonicalPipelineOptions | string = {},
): ChatEngineResult {
    const normalizedOptions = typeof options === 'string' ? { scriptedResponse: options } : options;
    const classification = classifyChat(text);
    return {
        ...classification,
        pipeline: buildCanonicalChatPipeline(text, normalizedOptions),
    };
}

// --- Agent Mode: זיהוי משימה, מידע חסר, כלי, סיכון ---

export function runAgentEngine(text: string, options: AgentRunOptions = {}): AgentEngineResult {
    const vocab = vocabFor(text);
    const tokens = tokenize(text);

    const action = includesAny(text, vocab.actionWords);
    const sensitive = includesAny(text, vocab.sensitiveWords);
    const delivery = includesAny(text, vocab.deliveryWords);
    const barcode = hasBarcode(text);
    const vague = !delivery && !barcode && includesAny(text, vocab.vagueWords);
    const authorized = options.authorized ?? true;
    const transport = options.transport ?? 'direct';
    const noExecution: AgentEngineResult['execution'] = {
        attempted: false,
        toolCalled: false,
        tool: null,
        transport: null,
        observation: null,
    };

    // 1. פעולה רגישה (משפיעה על הפלייליסט) -> עצירה לאישור
    if (sensitive) {
        const approvalStatus: AgentApprovalStatus = options.approval ?? 'pending';
        const mayExecute = authorized && approvalStatus === 'approved' && barcode;
        return {
            tokens,
            task: 'Delete a playlist',
            missingInfo: barcode ? 'None' : 'Playlist ID: not confirmed',
            toolNeed: { needed: true, tool: 'Playlist deletion tool' },
            canActNow: mayExecute,
            risk: 'High',
            decision: mayExecute
                ? { kind: 'tool', label: 'Use the Playlist deletion tool' }
                : { kind: 'stop', label: 'Stop for approval' },
            output: mayExecute ? 'Execute approved action' : 'Stop before action',
            replyKey: 'sensitive',
            authorization: {
                required: true,
                status: authorized ? 'authorized' : 'unauthorized',
                tool: 'Playlist deletion tool',
            },
            approval: { required: true, status: approvalStatus },
            execution: mayExecute ? {
                attempted: true,
                toolCalled: true,
                tool: 'Playlist deletion tool',
                transport,
                observation: 'Playlist deleted',
            } : noExecution,
        };
    }

    // 1b. שאלת מצב חי ("מה מתנגן עכשיו"): המידע קיים רק במקור חי, ולכן נדרש כלי.
    // חיפוש בקריאה בלבד: אין צורך באישור, אבל עדיין נדרשת הרשאת מערכת לכלי.
    if (includesAny(text, vocab.chatWords.tracking)) {
        const mayExecute = authorized;
        return {
            tokens,
            task: 'Look up the current song',
            missingInfo: 'None',
            toolNeed: { needed: true, tool: 'Playlist API' },
            canActNow: mayExecute,
            risk: 'Low',
            decision: mayExecute
                ? { kind: 'tool', label: 'Use the Playlist API' }
                : { kind: 'stop', label: 'Tool is not authorized' },
            output: mayExecute ? 'Call the Playlist API' : 'Stop before unauthorized tool call',
            replyKey: 'liveLookup',
            authorization: {
                required: true,
                status: authorized ? 'authorized' : 'unauthorized',
                tool: 'Playlist API',
            },
            approval: { required: false, status: 'not-required' },
            execution: mayExecute ? {
                attempted: true,
                toolCalled: true,
                tool: 'Playlist API',
                transport,
                observation: 'Current song details received',
            } : noExecution,
        };
    }

    // 2. בדיקת פלייליסט עם מזהה -> שימוש בכלי
    if (action && (delivery || barcode) && barcode) {
        const mayExecute = authorized;
        return {
            tokens,
            task: 'Look up a playlist',
            missingInfo: 'None',
            toolNeed: { needed: true, tool: 'Playlist API' },
            canActNow: mayExecute,
            risk: 'Low',
            decision: mayExecute
                ? { kind: 'tool', label: 'Use the Playlist API' }
                : { kind: 'stop', label: 'Tool is not authorized' },
            output: mayExecute ? 'Call the Playlist API' : 'Stop before unauthorized tool call',
            replyKey: 'tool',
            authorization: {
                required: true,
                status: authorized ? 'authorized' : 'unauthorized',
                tool: 'Playlist API',
            },
            approval: { required: false, status: 'not-required' },
            execution: mayExecute ? {
                attempted: true,
                toolCalled: true,
                tool: 'Playlist API',
                transport,
                observation: 'Playlist details received',
            } : noExecution,
        };
    }

    // 3. בדיקת פלייליסט בלי מזהה -> בקשת מידע חסר
    if (action && delivery) {
        return {
            tokens,
            task: 'Look up a playlist',
            missingInfo: 'Playlist ID: missing',
            toolNeed: { needed: true, tool: 'Playlist API' },
            canActNow: false,
            risk: 'Medium',
            decision: { kind: 'ask', label: 'Ask for the Playlist ID before acting' },
            output: 'Ask user for required information',
            replyKey: 'askBarcode',
            authorization: { required: true, status: authorized ? 'authorized' : 'unauthorized', tool: 'Playlist API' },
            approval: { required: false, status: 'not-required' },
            execution: noExecution,
        };
    }

    // 4. בקשה עמומה -> בקשת הבהרה
    if (vague) {
        return {
            tokens,
            task: 'Unclear task',
            missingInfo: 'Target unclear',
            toolNeed: { needed: false, tool: '-' },
            canActNow: false,
            risk: 'Low',
            decision: { kind: 'ask', label: 'Ask what to handle' },
            output: 'Ask for clarification',
            replyKey: 'vague',
            authorization: { required: false, status: 'authorized', tool: null },
            approval: { required: false, status: 'not-required' },
            execution: noExecution,
        };
    }

    // 5. תיאור בעיה בלי מילת פעולה (פלייליסט) -> עדיין צריך מזהה
    if (delivery) {
        const mayExecute = barcode && authorized;
        return {
            tokens,
            task: 'Look up a playlist',
            missingInfo: barcode ? 'None' : 'Playlist ID: missing',
            toolNeed: { needed: true, tool: 'Playlist API' },
            canActNow: mayExecute,
            risk: 'Medium',
            decision: mayExecute
                ? { kind: 'tool', label: 'Use the Playlist API' }
                : barcode
                    ? { kind: 'stop', label: 'Tool is not authorized' }
                    : { kind: 'ask', label: 'Ask for the Playlist ID before acting' },
            output: mayExecute ? 'Call the Playlist API' : barcode ? 'Stop before unauthorized tool call' : 'Ask user for required information',
            replyKey: barcode ? 'tool' : 'askBarcode',
            authorization: { required: true, status: authorized ? 'authorized' : 'unauthorized', tool: 'Playlist API' },
            approval: { required: false, status: 'not-required' },
            execution: mayExecute ? {
                attempted: true,
                toolCalled: true,
                tool: 'Playlist API',
                transport,
                observation: 'Playlist details received',
            } : noExecution,
        };
    }

    // 6. ברירת מחדל: בקשה כללית -> מענה ישיר
    return {
        tokens,
        task: 'General request',
        missingInfo: 'None',
        toolNeed: { needed: false, tool: '-' },
        canActNow: true,
        risk: 'Low',
        decision: { kind: 'answer', label: 'Answer directly' },
        output: 'Generate explanation',
        replyKey: 'general',
        authorization: { required: false, status: 'authorized', tool: null },
        approval: { required: false, status: 'not-required' },
        execution: noExecution,
    };
}
