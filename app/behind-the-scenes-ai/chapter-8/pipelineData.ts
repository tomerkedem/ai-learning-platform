// נתוני פרק 8: "דמיון, ציונים והסתברויות".
// כאן יושב כל מה שניתן לכוונן: וקטורי הכוונות, טבלאות המילים והצמדים,
// המשקלים w1/w2/w3, ה-temperature, ותרחישי ה-Agent. החישוב עצמו (cosine,
// score, softmax) חי בקובץ scoringEngine.ts הטהור. כאן רק הנתונים והרכבתם.
//
// ── איך לכוונן ולהרחיב ────────────────────────────────────────────────────
//   * להזיז את היעדים: שנו WEIGHTS (w1/w2/w3) ו-TEMPERATURE. T גבוה משטח את
//     ההתפלגות, T נמוך מחדד. w1 מגביר את משקל הדמיון, w2 את המילים, w3 את ההקשר.
//   * להוסיף כוונה: הוסיפו אובייקט ל-INTENTS (וקטור, מילים, צמדים, צבע).
//   * להוסיף מילה לווקטור המשפט: שורה ב-TOKEN_VECTORS (מילה -> תרומה ל-5 ממדים).
//   * אותות מילה לכוונה: keywords (word_impact), bigrams (context_bonus).
//   * תרחיש Agent: ערכו AGENT_STEPS / AGENT_WEIGHTS / AGENT_TEMPERATURE.
//   המספרים שהוגדרו כאן עברו calibration כדי לנחות קרוב ליעדי הספר, אבל כל
//   ערך שמוצג על המסך הוא תמיד החישוב החי של המנוע, לא קבוע מקודד.

import type { Accent } from '@/components/ai-internals/types';
import { DIM_INFO, DIM_STYLE, type DimKey } from '@/app/behind-the-scenes-ai/chapter-6/embeddingEngine';
import {
    type Vector,
    tokenize,
    buildVector,
    cosineSimilarity,
    clamp01,
    unigramSignal,
    bigramSignal,
    rawScore,
    toDistribution,
    confidenceFromMargin,
    type ConfidenceLevel,
    type ScoreTerm,
} from './scoringEngine';

export type { ConfidenceLevel };

/* ════════════════════════════ ממדי הווקטור ═══════════════════════════════ */
// 5 הממדים של פרק 8, בסדר הווקטור [Delivery, Failure, System, Payment, Address].
// משתמשים בצבעים ובתוויות של פרק 6 לשמירת רציפות ויזואלית.

export const DIMS: DimKey[] = ['delivery', 'failure', 'system', 'payment', 'address'];
export const DIM_COUNT = DIMS.length;
export { DIM_INFO, DIM_STYLE };
export type { DimKey };

/* ════════════════════════════ משקלים ו-Temperature ═══════════════════════ */
// score = w1*similarity + w2*word_impact + w3*context_bonus  ;  probs = softmax(scores / T)

export const WEIGHTS = {
    similarity: 1.4,   // w1
    wordImpact: 0.8,   // w2
    contextBonus: 0.4, // w3
};
export const TEMPERATURE = 0.72; // T

/* ════════════════════════════ וקטורי המילים ══════════════════════════════ */
// token -> תרומה ל-Sentence Vector (5 ממדים, סדר DIMS). הסכום (clamp 0..1)
// של "החבילה לא הגיעה" נוחת על [0.95, 0.85, 0.20, 0.05, 0.10].

export const TOKEN_VECTORS: Record<string, Vector> = {
    //          [Delivery, Failure, System, Payment, Address]
    'החבילה':   [0.80, 0.05, 0.15, 0.05, 0.10],
    'לא':       [0.05, 0.55, 0.05, 0.00, 0.00],
    'הגיעה':    [0.10, 0.25, 0.00, 0.00, 0.00],
    'מופיעה':   [0.05, 0.10, 0.45, 0.00, 0.00],
    'במערכת':   [0.00, 0.05, 0.70, 0.00, 0.00],
    'המערכת':   [0.00, 0.05, 0.70, 0.00, 0.00],
    'מציגה':    [0.05, 0.05, 0.30, 0.00, 0.00],
    'המשלוח':   [0.80, 0.05, 0.10, 0.05, 0.10],
    'נמסר':     [0.10, 0.30, 0.00, 0.00, 0.00],
};

/* ════════════════════════════ הכוונות ════════════════════════════════════ */
// מודל לימודי: לכל כוונה Intent Vector קבוע, טבלת מילים (word_impact) וטבלת
// צמדים (context_bonus). הווקטורים יכולים להכיל ערכים שליליים (ניגוד), כדי
// שה-Cosine Similarity יתפזר ויבדיל בין הכוונות.

export interface IntentDef {
    id: string;
    labelHe: string;
    labelEn: string;
    accent: Accent;
    vector: Vector;
    keywords: Record<string, number>;
    bigrams: Record<string, number>;
}

export const INTENTS: IntentDef[] = [
    {
        id: 'not-delivered',
        labelHe: 'החבילה לא נמסרה',
        labelEn: 'Package not delivered',
        accent: 'cyan',
        vector: [0.90, 0.90, 0.10, 0.00, 0.10],
        keywords: { 'לא': 0.35, 'הגיעה': 0.30, 'החבילה': 0.12, 'המשלוח': 0.12, 'נמסר': 0.30 },
        bigrams: { 'לא הגיעה': 0.45, 'לא נמסר': 0.45 },
    },
    {
        id: 'tracking',
        labelHe: 'שאלת מעקב',
        labelEn: 'Tracking question',
        accent: 'amber',
        vector: [0.60, -0.20, 0.20, 0.00, 0.08],
        keywords: { 'החבילה': 0.30, 'הגיעה': 0.25, 'המשלוח': 0.30, 'איפה': 0.60, 'מתי': 0.60, 'סטטוס': 0.50 },
        bigrams: {},
    },
    {
        id: 'system',
        labelHe: 'תקלת מערכת',
        labelEn: 'System issue',
        accent: 'indigo',
        vector: [0.20, -0.10, 0.95, 0.00, 0.05],
        keywords: { 'במערכת': 0.50, 'מופיעה': 0.35, 'המערכת': 0.50, 'מציגה': 0.35 },
        bigrams: { 'מופיעה במערכת': 0.45 },
    },
    {
        id: 'payment',
        labelHe: 'בעיית תשלום',
        labelEn: 'Payment problem',
        accent: 'emerald',
        vector: [0.05, -0.05, 0.05, 0.97, 0.00],
        keywords: { 'תשלום': 0.80, 'חיוב': 0.70, 'שילמתי': 0.60 },
        bigrams: {},
    },
    {
        id: 'address',
        labelHe: 'בעיית כתובת',
        labelEn: 'Address problem',
        accent: 'blue',
        vector: [0.10, -0.10, 0.05, 0.00, 0.96],
        keywords: { 'כתובת': 0.80, 'מען': 0.60, 'רחוב': 0.50 },
        bigrams: {},
    },
];

/* ════════════════════════ תרחישי הקלדה מהירים (Chat) ═════════════════════ */

export interface QuickPrompt {
    id: string;
    text: string;
    labelHe: string;
    labelEn: string;
}

export const QUICK_PROMPTS: QuickPrompt[] = [
    { id: 'clear', text: 'החבילה לא הגיעה', labelHe: 'אי מסירה', labelEn: 'Not delivered' },
    { id: 'system', text: 'החבילה לא מופיעה במערכת', labelHe: 'תקלת מערכת', labelEn: 'System issue' },
];

/** זוג מילים להחלפה בלחיצה אחת ("גל השינוי" במורד השרשרת). */
export const WORD_SWAP = { from: 'הגיעה', to: 'מופיעה במערכת' };

/* ════════════════════════════ תוצאת ניתוח ════════════════════════════════ */

export interface Breakdown {
    key: string;
    labelHe: string;
    labelEn: string;
    value: number;       // הערך הגולמי (0..1)
    weight: number;      // המשקל
    contribution: number; // value * weight
}

export interface RankItem {
    id: string;
    labelHe: string;
    labelEn: string;
    accent: Accent;
    /** המספר הכותרתי של הקרבה: cosine ב-Chat, relevance ב-Agent. */
    similarity: number;
    /** האם ה-similarity הוא Cosine אמיתי (Chat) - משפיע על תצוגת ה-hover. */
    similarityIsCosine: boolean;
    /** וקטור הכוונה (Chat) להצגה ב-hover. */
    vector?: Vector;
    breakdown: Breakdown[];
    score: number;
    prob: number; // 0..1
}

export interface DecisionInfo {
    kind: 'answer' | 'answer-careful' | 'clarify' | 'tool' | 'ask' | 'stop' | 'idle';
    he: string;
    en: string;
    detail: string;
}

export interface AgentState {
    hasBarcode: boolean;
    taskHe: string;
    taskEn: string;
    missingHe: string | null;
}

export interface AnalysisResult {
    mode: 'chat' | 'agent';
    inputText: string;
    tokens: string[];
    vector: Vector;
    hasInput: boolean;
    items: RankItem[]; // ממוין לפי prob יורד
    temperature: number;
    leaderId: string;
    marginPct: number;
    confidence: ConfidenceLevel;
    decision: DecisionInfo;
    agentState?: AgentState;
}

/* ════════════════════════════ ניתוח Chat ═════════════════════════════════ */

const SIM_LABEL = { he: 'דמיון', en: 'Similarity' };
const WI_LABEL = { he: 'השפעת מילה', en: 'Word impact' };
const CB_LABEL = { he: 'בונוס הקשר', en: 'Context bonus' };

function chatDecision(confidence: ConfidenceLevel, items: RankItem[]): DecisionInfo {
    const top = items[0];
    const second = items[1];
    if (!top) return { kind: 'idle', he: 'ממתין לקלט', en: 'Waiting', detail: 'התחילו להקליד כדי להפעיל את השרשרת.' };
    if (confidence === 'High') {
        return {
            kind: 'answer',
            he: 'לענות בביטחון',
            en: 'Answer with high confidence',
            detail: `המוביל "${top.labelHe}" בולט מעל השאר. אפשר לענות לפי הכיוון הזה, תוך ציון שזו הערכה מובילה.`,
        };
    }
    if (confidence === 'Medium') {
        return {
            kind: 'answer-careful',
            he: 'לענות בזהירות',
            en: 'Answer carefully',
            detail: `"${top.labelHe}" מוביל אבל לא בפער גדול. כדאי לענות בזהירות ולהשאיר פתח לאפשרות "${second?.labelHe ?? ''}".`,
        };
    }
    return {
        kind: 'clarify',
        he: 'לשאול שאלת הבהרה',
        en: 'Ask a clarifying question',
        detail: `שתי אפשרויות קרובות: "${top.labelHe}" מול "${second?.labelHe ?? ''}". הפער קטן מדי, עדיף לשאול שאלת הבהרה לפני שמתחייבים.`,
    };
}

/** מנתח משפט Chat דרך כל השרשרת. כל המספרים מחושבים חי. */
export function analyzeSentence(text: string): AnalysisResult {
    const tokens = tokenize(text);
    const hasInput = tokens.length > 0;
    const vector = buildVector(tokens, TOKEN_VECTORS, DIM_COUNT);

    const partial = INTENTS.map((intent) => {
        const cos = cosineSimilarity(vector, intent.vector);
        const simClamped = clamp01(cos); // לציון משתמשים בערך לא שלילי
        const wi = unigramSignal(tokens, intent.keywords);
        const cb = bigramSignal(tokens, intent.bigrams);

        const terms: ScoreTerm[] = [
            { key: 'similarity', value: simClamped, weight: WEIGHTS.similarity },
            { key: 'word_impact', value: wi, weight: WEIGHTS.wordImpact },
            { key: 'context_bonus', value: cb, weight: WEIGHTS.contextBonus },
        ];
        const score = rawScore(terms);

        const breakdown: Breakdown[] = [
            { key: 'similarity', labelHe: SIM_LABEL.he, labelEn: SIM_LABEL.en, value: simClamped, weight: WEIGHTS.similarity, contribution: simClamped * WEIGHTS.similarity },
            { key: 'word_impact', labelHe: WI_LABEL.he, labelEn: WI_LABEL.en, value: wi, weight: WEIGHTS.wordImpact, contribution: wi * WEIGHTS.wordImpact },
            { key: 'context_bonus', labelHe: CB_LABEL.he, labelEn: CB_LABEL.en, value: cb, weight: WEIGHTS.contextBonus, contribution: cb * WEIGHTS.contextBonus },
        ];

        return { intent, cosRaw: cos, simClamped, score, breakdown };
    });

    const { probs } = toDistribution(partial.map((p) => p.score), TEMPERATURE);

    let items: RankItem[] = partial.map((p, i) => ({
        id: p.intent.id,
        labelHe: p.intent.labelHe,
        labelEn: p.intent.labelEn,
        accent: p.intent.accent,
        similarity: p.cosRaw,
        similarityIsCosine: true,
        vector: p.intent.vector,
        breakdown: p.breakdown,
        score: p.score,
        prob: probs[i],
    }));

    items = items.sort((a, b) => b.prob - a.prob);
    const marginPct = ((items[0]?.prob ?? 0) - (items[1]?.prob ?? 0)) * 100;
    const confidence = hasInput ? confidenceFromMargin(marginPct) : 'Low';
    const decision = hasInput
        ? chatDecision(confidence, items)
        : { kind: 'idle' as const, he: 'ממתין לקלט', en: 'Waiting', detail: 'התחילו להקליד כדי להפעיל את השרשרת.' };

    return {
        mode: 'chat',
        inputText: text,
        tokens,
        vector,
        hasInput,
        items,
        temperature: TEMPERATURE,
        leaderId: items[0]?.id ?? '',
        marginPct,
        confidence,
        decision,
    };
}

/* ════════════════════════════ ניתוח Agent ════════════════════════════════ */
// אותה מכונת softmax, אבל הקלט הוא מצב (hasBarcode) והפריטים הם צעדים אפשריים.
// המסר: ה-Agent מדרג לפי מצב, לא לפי משפט בודד.

export const AGENT_PROMPT = 'בדוק למה החבילה לא הגיעה';

export const AGENT_WEIGHTS = {
    relevance: 1.2,   // wr
    missing: 0.9,     // wm (פעיל רק כשחסר מידע)
    toolReady: 0.7,   // wt (פעיל רק כשהמידע קיים)
};
export const AGENT_TEMPERATURE = 0.4;

export interface AgentStepDef {
    id: string;
    labelHe: string;
    labelEn: string;
    accent: Accent;
    /** רלוונטיות הצעד למשימה. */
    relevance: number;
    /** האם זהו צעד שמשיג מידע חסר (פעיל כשאין ברקוד). */
    needsMissing: number;
    /** האם זהו צעד שמשתמש בכלי (פעיל כשיש ברקוד). */
    usesTool: number;
}

export const AGENT_STEPS: AgentStepDef[] = [
    { id: 'ask-barcode', labelHe: 'לבקש ברקוד', labelEn: 'Ask for barcode', accent: 'amber', relevance: 0.60, needsMissing: 1, usesTool: 0 },
    { id: 'use-tool', labelHe: 'להשתמש בכלי מעקב', labelEn: 'Use tracking tool', accent: 'emerald', relevance: 0.82, needsMissing: 0, usesTool: 1 },
    { id: 'general', labelHe: 'לתת הסבר כללי', labelEn: 'Give general explanation', accent: 'slate', relevance: 0.33, needsMissing: 0, usesTool: 0 },
    { id: 'stop', labelHe: 'לעצור לאישור', labelEn: 'Stop for approval', accent: 'rose', relevance: 0.45, needsMissing: 0, usesTool: 0 },
];

const REL_LABEL = { he: 'רלוונטיות', en: 'Relevance' };
const MISS_LABEL = { he: 'מידע חסר', en: 'Missing info' };
const TOOL_LABEL = { he: 'כלי מוכן', en: 'Tool ready' };

function agentDecision(leaderId: string): DecisionInfo {
    if (leaderId === 'ask-barcode') {
        return { kind: 'ask', he: 'לבקש ברקוד מהמשתמש', en: 'Ask for barcode', detail: 'כדי לחקור את כשל המסירה דרוש מזהה חבילה. ה-Agent לא ממציא נתונים, אלא מבקש את הברקוד לפני שהוא משתמש בכלי.' };
    }
    if (leaderId === 'use-tool') {
        return { kind: 'tool', he: 'להפעיל כלי מעקב', en: 'Use tracking tool', detail: 'הברקוד התקבל, אז הצעד בעל ההסתברות הגבוהה הוא להפעיל את כלי בדיקת הסטטוס. אותה שרשרת חישוב, מצב קלט שונה, החלטה שונה.' };
    }
    if (leaderId === 'stop') {
        return { kind: 'stop', he: 'לעצור ולבקש אישור', en: 'Stop for approval', detail: 'הצעד המוביל דורש אישור אנושי לפני המשך.' };
    }
    return { kind: 'answer', he: 'לתת הסבר כללי', en: 'Give general explanation', detail: 'אין צעד מובהק, ההסבר הכללי מוביל.' };
}

/** מנתח את מצב ה-Agent דרך אותה מכונת softmax. */
export function analyzeAgent(hasBarcode: boolean): AnalysisResult {
    const tokens = tokenize(AGENT_PROMPT);
    const vector = buildVector(tokens, TOKEN_VECTORS, DIM_COUNT);

    const partial = AGENT_STEPS.map((stepDef) => {
        const relevance = stepDef.relevance;
        const missing = stepDef.needsMissing * (hasBarcode ? 0 : 1);
        const toolReady = stepDef.usesTool * (hasBarcode ? 1 : 0);

        const terms: ScoreTerm[] = [
            { key: 'relevance', value: relevance, weight: AGENT_WEIGHTS.relevance },
            { key: 'missing_info', value: missing, weight: AGENT_WEIGHTS.missing },
            { key: 'tool_ready', value: toolReady, weight: AGENT_WEIGHTS.toolReady },
        ];
        const score = rawScore(terms);

        const breakdown: Breakdown[] = [
            { key: 'relevance', labelHe: REL_LABEL.he, labelEn: REL_LABEL.en, value: relevance, weight: AGENT_WEIGHTS.relevance, contribution: relevance * AGENT_WEIGHTS.relevance },
            { key: 'missing_info', labelHe: MISS_LABEL.he, labelEn: MISS_LABEL.en, value: missing, weight: AGENT_WEIGHTS.missing, contribution: missing * AGENT_WEIGHTS.missing },
            { key: 'tool_ready', labelHe: TOOL_LABEL.he, labelEn: TOOL_LABEL.en, value: toolReady, weight: AGENT_WEIGHTS.toolReady, contribution: toolReady * AGENT_WEIGHTS.toolReady },
        ];

        return { stepDef, relevance, score, breakdown };
    });

    const { probs } = toDistribution(partial.map((p) => p.score), AGENT_TEMPERATURE);

    let items: RankItem[] = partial.map((p, i) => ({
        id: p.stepDef.id,
        labelHe: p.stepDef.labelHe,
        labelEn: p.stepDef.labelEn,
        accent: p.stepDef.accent,
        similarity: p.relevance,
        similarityIsCosine: false,
        breakdown: p.breakdown,
        score: p.score,
        prob: probs[i],
    }));

    items = items.sort((a, b) => b.prob - a.prob);
    const marginPct = ((items[0]?.prob ?? 0) - (items[1]?.prob ?? 0)) * 100;
    const confidence = confidenceFromMargin(marginPct);
    const leaderId = items[0]?.id ?? '';

    return {
        mode: 'agent',
        inputText: AGENT_PROMPT,
        tokens,
        vector,
        hasInput: true,
        items,
        temperature: AGENT_TEMPERATURE,
        leaderId,
        marginPct,
        confidence,
        decision: agentDecision(leaderId),
        agentState: {
            hasBarcode,
            taskHe: 'בדיקת כשל במסירה',
            taskEn: 'Check delivery failure',
            missingHe: hasBarcode ? null : 'ברקוד',
        },
    };
}

/* ════════════════════════════ מפת הדרכים ═════════════════════════════════ */
// פרק 8: כל הצמתים פעילים עד Probabilities (ועד Decision בהמשך).

export const ROADMAP_STEPS_7: { he: string; en: string; active: boolean }[] = [
    { he: 'טקסט', en: 'Text', active: true },
    { he: 'טוקנים', en: 'Tokens', active: true },
    { he: 'מזהי טוקן', en: 'Token IDs', active: true },
    { he: 'וקטורים', en: 'Vectors', active: true },
    { he: 'הקשר', en: 'Attention', active: true },
    { he: 'דמיון', en: 'Similarity', active: true },
    { he: 'ציונים', en: 'Scores', active: true },
    { he: 'הסתברויות', en: 'Probabilities', active: true },
];

/** שלבי שרשרת ה-Pipeline Cascade, בסדר הזרימה מלמעלה למטה. */
export const CASCADE_LAYERS: { id: string; he: string; en: string; accent: Accent }[] = [
    { id: 'vector', he: 'וקטור משמעות', en: 'Meaning Vector', accent: 'cyan' },
    { id: 'similarity', he: 'דירוג דמיון', en: 'Similarity Ranking', accent: 'amber' },
    { id: 'scores', he: 'ציונים גולמיים', en: 'Raw Scores', accent: 'indigo' },
    { id: 'softmax', he: 'Softmax', en: 'Softmax', accent: 'purple' },
    { id: 'probabilities', he: 'הסתברויות', en: 'Probabilities', accent: 'emerald' },
    { id: 'decision', he: 'החלטה', en: 'Decision', accent: 'rose' },
];
