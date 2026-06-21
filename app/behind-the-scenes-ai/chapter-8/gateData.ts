// נתוני פרק 8: "Confidence - מתי לענות ומתי לעצור".
// כל ההתפלגויות מגיעות ממנוע פרק 7 (analyzeSentence / analyzeAgent / softmax).
// פרק 8 לא מחשב הסתברויות בדרך אחרת, הוא צורך את הפלט של פרק 7 ובונה מעליו
// את שכבת השער. כאן יושבים רק נתוני השער: ספים, טבלת רמות סיכון, מטא של
// התשובות ושאלות ההבהרה, ותרחישי ה-Agent.
//
// ── איך לכוונן ולהרחיב ────────────────────────────────────────────────────
//   * ספים: THRESHOLD_PRESETS / DEFAULT_THRESHOLD.
//   * דרישת ביטחון לפי פעולה ואישור אנושי: RISK_ACTIONS (requiredConfidence,
//     humanApproval). פעולה רגישה = סף גבוה יותר ולעיתים אישור.
//   * ניסוחי תשובה ושאלת הבהרה לכל כוונה: INTENT_META.
//   * תרחישי Chat: CHAT_SCENARIOS (טקסט שעובר ב-analyzeSentence של פרק 7).
//   * תרחישי Agent: AGENT_SCENARIOS. ה"בקשה העמומה" מחושבת דרך אותו softmax
//     של פרק 7 על ציוני VAGUE_STEPS.

import type { Accent } from '@/components/ai-internals/types';
import { analyzeSentence, analyzeAgent, AGENT_TEMPERATURE } from '@/app/behind-the-scenes-ai/chapter-7/pipelineData';
import { softmax, confidenceFromMargin, type ConfidenceLevel } from '@/app/behind-the-scenes-ai/chapter-7/scoringEngine';
import type { RiskLevel } from './gateLogic';

/* ════════════════════════════ ספים ═══════════════════════════════════════ */

export const THRESHOLD_PRESETS = [20, 50, 80];
export const DEFAULT_THRESHOLD = 20;

/* ════════════════════════════ טבלת הסיכון ════════════════════════════════ */
// הגורם השני בשער. פעולה רגישה דורשת ביטחון גבוה יותר, ולעיתים אישור אנושי.

export interface RiskActionDef {
    id: string;
    he: string;
    en: string;
    risk: RiskLevel;
    riskHe: string;
    requiredConfidence: number; // סף הביטחון שהפעולה דורשת (0..100)
    requiredHe: string;
    humanApproval: boolean;
    accent: Accent;
}

export const RISK_ACTIONS: RiskActionDef[] = [
    { id: 'explain', he: 'הסבר מושג', en: 'Explain concept', risk: 'low', riskHe: 'נמוך', requiredConfidence: 30, requiredHe: 'בינוני', humanApproval: false, accent: 'emerald' },
    { id: 'tracking-status', he: 'בדיקת סטטוס משלוח', en: 'Ask for tracking status', risk: 'low-medium', riskHe: 'נמוך עד בינוני', requiredConfidence: 40, requiredHe: 'בינוני', humanApproval: false, accent: 'amber' },
    { id: 'send-customer', he: 'שליחת הודעה ללקוח', en: 'Send message to customer', risk: 'high', riskHe: 'גבוה', requiredConfidence: 80, requiredHe: 'גבוה מאוד + אישור אנושי', humanApproval: true, accent: 'rose' },
];

export const DEFAULT_RISK_ACTION_ID = 'explain';

export function getRiskAction(id: string): RiskActionDef {
    return RISK_ACTIONS.find((r) => r.id === id) ?? RISK_ACTIONS[0];
}

/* ════════════════════════════ מטא לכוונות ════════════════════════════════ */
// ניסוח התשובה (ל-Answer Suppression) ואופציית ההבהרה (ל-Clarifying Question)
// לכל כוונה של פרק 7. שאלת ההבהרה נבנית מהאופציות, היא לא גנרית.

export interface IntentMeta {
    answerHe: string;
    clarifyOptionHe: string;
}

export const INTENT_META: Record<string, IntentMeta> = {
    'not-delivered': { answerHe: 'נראה שהחבילה לא נמסרה, כדאי לבדוק את סטטוס המשלוח.', clarifyOptionHe: 'שהחבילה לא נמסרה' },
    'system': { answerHe: 'נראה שמדובר בתקלה בתצוגת המערכת.', clarifyOptionHe: 'שיש תקלה בתצוגת המערכת' },
    'tracking': { answerHe: 'נראה שזו שאלת מעקב על מיקום החבילה.', clarifyOptionHe: 'שזו שאלת מעקב על מיקום החבילה' },
    'payment': { answerHe: 'נראה שמדובר בבעיית תשלום.', clarifyOptionHe: 'שמדובר בבעיית תשלום' },
    'address': { answerHe: 'נראה שמדובר בבעיית כתובת.', clarifyOptionHe: 'שמדובר בבעיית כתובת' },
};

const FALLBACK_META: IntentMeta = { answerHe: 'נראה שזו הכוונה המובילה.', clarifyOptionHe: 'שזו הכוונה' };

export function metaFor(id: string, fallbackLabel?: string): IntentMeta {
    if (INTENT_META[id]) return INTENT_META[id];
    if (fallbackLabel) return { answerHe: `נראה שמדובר ב${fallbackLabel}.`, clarifyOptionHe: `שמדובר ב${fallbackLabel}` };
    return FALLBACK_META;
}

/* ════════════════════════════ תוצאת התפלגות ══════════════════════════════ */

export interface DistItem {
    id: string;
    labelHe: string;
    labelEn: string;
    accent: Accent;
    prob: number; // 0..1
    answerHe: string;
    clarifyOptionHe: string;
}

export interface Distribution {
    items: DistItem[]; // ממוין לפי prob יורד
    margin: number;    // 0..100
    confidence: ConfidenceLevel;
    topId: string;
}

/* ════════════════════════════ תרחישי Chat ════════════════════════════════ */

export interface ChatScenario {
    id: string;
    text: string;
    labelHe: string;
    labelEn: string;
}

export const CHAT_SCENARIOS: ChatScenario[] = [
    { id: 'sharp', text: 'החבילה לא הגיעה', labelHe: 'ניסוח חד', labelEn: 'Sharp' },
    { id: 'ambiguous', text: 'החבילה לא מופיעה במערכת', labelHe: 'ניסוח עמום', labelEn: 'Ambiguous' },
];

/** התפלגות Chat ממנוע פרק 7, עטופה למבנה השער. */
export function distributionForChat(text: string): Distribution {
    const r = analyzeSentence(text);
    const items: DistItem[] = r.items.map((it) => {
        const m = metaFor(it.id, it.labelHe);
        return { id: it.id, labelHe: it.labelHe, labelEn: it.labelEn, accent: it.accent, prob: it.prob, answerHe: m.answerHe, clarifyOptionHe: m.clarifyOptionHe };
    });
    return { items, margin: r.marginPct, confidence: r.confidence, topId: r.leaderId };
}

/* ════════════════════════════ תרחישי Agent ═══════════════════════════════ */

export type AgentScenarioKind = 'barcode' | 'vague';

export interface AgentScenario {
    id: string;
    kind: AgentScenarioKind;
    labelHe: string;
    labelEn: string;
    promptHe: string;
    taskHe: string;
    taskEn: string;
}

export const AGENT_SCENARIOS: AgentScenario[] = [
    { id: 'barcode', kind: 'barcode', labelHe: 'חקירת משלוח', labelEn: 'Investigation', promptHe: 'בדוק למה החבילה לא הגיעה', taskHe: 'בדיקת כשל במסירה', taskEn: 'Check delivery failure' },
    { id: 'vague', kind: 'vague', labelHe: 'בקשה עמומה', labelEn: 'Vague request', promptHe: 'תטפל בזה', taskHe: 'לא זוהתה משימה ברורה', taskEn: 'No clear task' },
];

/** צעדי ה"בקשה העמומה". הציונים עוברים דרך softmax של פרק 7 (אותו מנוע). */
export interface VagueStep {
    id: string;
    labelHe: string;
    labelEn: string;
    accent: Accent;
    score: number;
    clarifyOptionHe: string;
    answerHe: string;
}

export const VAGUE_STEPS: VagueStep[] = [
    { id: 'possible-task', labelHe: 'משימה אפשרית', labelEn: 'Possible task', accent: 'amber', score: 0.71, clarifyOptionHe: 'להתייחס לזה כמשימה לביצוע', answerHe: 'נתחיל לטפל בפנייה.' },
    { id: 'unknown-ref', labelHe: 'הפניה לא ידועה', labelEn: 'Unknown reference', accent: 'slate', score: 0.67, clarifyOptionHe: 'שחסר הקשר למה "זה" מתייחס', answerHe: 'לא ברור למה מתייחס "זה".' },
    { id: 'general-request', labelHe: 'בקשה כללית', labelEn: 'General request', accent: 'blue', score: 0.31, clarifyOptionHe: 'שזו בקשה כללית', answerHe: 'זו אולי בקשה כללית.' },
    { id: 'other', labelHe: 'אחר', labelEn: 'Other', accent: 'slate', score: 0.0, clarifyOptionHe: 'משהו אחר', answerHe: 'משהו אחר.' },
];

/** התפלגות ה"בקשה העמומה" דרך softmax של פרק 7. ביטחון נמוך שמונע פעולה. */
export function distributionForVague(): Distribution {
    const probs = softmax(VAGUE_STEPS.map((s) => s.score), AGENT_TEMPERATURE);
    const items: DistItem[] = VAGUE_STEPS
        .map((s, i) => ({ id: s.id, labelHe: s.labelHe, labelEn: s.labelEn, accent: s.accent, prob: probs[i], answerHe: s.answerHe, clarifyOptionHe: s.clarifyOptionHe }))
        .sort((a, b) => b.prob - a.prob);
    const margin = ((items[0]?.prob ?? 0) - (items[1]?.prob ?? 0)) * 100;
    return { items, margin, confidence: confidenceFromMargin(margin), topId: items[0]?.id ?? '' };
}

/** התפלגות תרחיש החקירה ממנוע פרק 7 (דירוג הצעדים). */
export function distributionForBarcode(hasBarcode: boolean): Distribution {
    const r = analyzeAgent(hasBarcode);
    const items: DistItem[] = r.items.map((it) => {
        const m = metaFor(it.id, it.labelHe);
        return { id: it.id, labelHe: it.labelHe, labelEn: it.labelEn, accent: it.accent, prob: it.prob, answerHe: m.answerHe, clarifyOptionHe: m.clarifyOptionHe };
    });
    return { items, margin: r.marginPct, confidence: r.confidence, topId: r.leaderId };
}

/* ════════════════════════════ מפת הדרכים ═════════════════════════════════ */
// פרק 8: מגיעים עד צומת ההחלטה (Decision), והשער הוא מה שמכריע אם פועלים עליה.

export const ROADMAP_STEPS_8: { he: string; en: string; active: boolean }[] = [
    { he: 'טקסט', en: 'Text', active: true },
    { he: 'טוקנים', en: 'Tokens', active: true },
    { he: 'מזהי טוקן', en: 'Token IDs', active: true },
    { he: 'וקטורים', en: 'Vectors', active: true },
    { he: 'דמיון', en: 'Similarity', active: true },
    { he: 'ציונים', en: 'Scores', active: true },
    { he: 'הסתברויות', en: 'Probabilities', active: true },
    { he: 'החלטה', en: 'Decision', active: true },
];
