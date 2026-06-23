// נתוני פרק 12: "Tool Call, Observation והחלטה הבאה".
// כאן יושבות שלוש ה-Observations הקנוניות, הגדרת קריאת הכלי, תוויות ההחלטה
// והאיכות, ומלל הקריינות לכל רכיב. המנוע (loopEngine.ts) גנרי. הכלי וה-
// Observation הם מודל לימודי מקומי, אין כאן קריאה לשום שירות חיצוני.
//
// פרק 12 צורך את מצב בחירת הכלי מפרק 11 (selectFor) כדי לדעת איזה כלי נבחר.
//
// ── איך להרחיב ────────────────────────────────────────────────────────────
//   * להוסיף תרחיש תוצאה: שורה ל-OBSERVATIONS עם השדות שהכלי מחזיר, איכות
//     התוצאה (quality), הביטחון (confidence), ודגלי conflict / hasStatus.
//     ההחלטה הבאה מחושבת חי מ-decideNext, היא לא מקודדת קשיח.
//   * לשנות את הקריאה: TOOL_CALL (method, inputKey). הכלי עצמו מגיע מפרק 11.

import { selectFor, getTool, BARCODE_SAMPLE } from '@/app/behind-the-scenes-ai/chapter-11/toolData';
import {
    decideNext, canAnswer, TIMELINE_STEPS,
    type ObservationQuality, type Confidence, type RiskLevel,
    type NextDecision, type DecisionInput,
} from './loopEngine';

export { TIMELINE_STEPS };
export type { ObservationQuality, Confidence, RiskLevel, NextDecision };

/* ════════════════════════ הבקשה והכלי שנבחר ══════════════════════════════ */
// הבקשה הקנונית של הפרק. פרק 11 בוחר עבורה את Tracking API. אנחנו צורכים את
// הבחירה הזו, לא מחשבים אותה מחדש.

export const REQUEST = 'בדוק למה החבילה 123456789 לא הגיעה';

const baseSelection = selectFor(REQUEST);
const selectedTool = baseSelection.selection.selectedToolId
    ? getTool(baseSelection.selection.selectedToolId)
    : undefined;

/** קריאת הכלי המוגדרת: שם, מתודה, ושדה הקלט. */
export const TOOL_CALL = {
    toolEn: selectedTool?.nameEn ?? 'Tracking API',
    toolHe: selectedTool?.nameHe ?? 'ממשק מעקב',
    method: 'checkStatus',
    inputKey: 'barcode',
    inputValue: BARCODE_SAMPLE,
    inputLabelHe: selectedTool?.requiredInput?.he ?? 'ברקוד',
};

/* ════════════════════════ שלוש ה-Observations ════════════════════════════ */

export interface ObsField {
    key: string;
    value: string;
    /** שדה חלש (חסר / Unknown), מסומן ויזואלית. */
    weak?: boolean;
}

export interface Observation {
    id: string;
    labelHe: string;
    labelEn: string;
    fields: ObsField[];
    quality: ObservationQuality;
    confidence: Confidence;
    conflict: boolean;
    /** האם הכלי החזיר סטטוס כלשהו (false עבור Unknown). */
    hasStatus: boolean;
    /** משפט שמסביר מה הכלי החזיר. */
    summaryHe: string;
    /** משפט ההחלטה: למה זה הצעד הבא. */
    decisionDetailHe: string;
    /** הקשר משתמש (לתרחיש הסותר). */
    userClaimHe?: string;
    /** תיאור הסתירה (לתרחיש הסותר). */
    conflictHe?: string;
    /** צעדים חלופיים (לתרחיש החלקי). */
    alternativesHe?: string[];
}

export const OBSERVATIONS: Observation[] = [
    {
        id: 'clear',
        labelHe: 'תוצאה ברורה',
        labelEn: 'Clear',
        fields: [
            { key: 'Status', value: 'Not delivered' },
            { key: 'Last scan', value: 'Sorting center' },
            { key: 'Last scan time', value: '2026-06-18 14:20' },
            { key: 'Reason', value: 'Missing final delivery scan' },
        ],
        quality: 'high',
        confidence: 'high',
        conflict: false,
        hasStatus: true,
        summaryHe: 'הכלי החזיר סטטוס מלא: החבילה לא נמסרה, והסריקה האחרונה הייתה במרכז המיון.',
        decisionDetailHe: 'התוצאה ברורה ואיכותית. אפשר להסביר למשתמש את הסטטוס: החבילה נתקעה אחרי מרכז המיון, חסרה סריקת מסירה סופית.',
    },
    {
        id: 'partial',
        labelHe: 'תוצאה חלקית',
        labelEn: 'Partial',
        fields: [
            { key: 'Status', value: 'Unknown', weak: true },
            { key: 'Last scan', value: 'Not available', weak: true },
            { key: 'Timestamp', value: 'missing', weak: true },
            { key: 'Reason code', value: 'missing', weak: true },
        ],
        quality: 'low',
        confidence: 'low',
        conflict: false,
        hasStatus: false,
        summaryHe: 'הכלי לא מצא סטטוס נוכחי. כל השדות חזרו ריקים.',
        decisionDetailHe: 'התוצאה חלשה מדי. ה-Agent לא ממציא סיבה. הצעד הנכון הוא צעד אחר, לא תשובה.',
        alternativesHe: ['לנסות כלי אחר (מסד הנתונים)', 'לשאול את המשתמש', 'להסביר שלמערכת אין סטטוס נוכחי'],
    },
    {
        id: 'conflict',
        labelHe: 'תוצאה סותרת',
        labelEn: 'Conflicting',
        fields: [
            { key: 'Status', value: 'Delivered' },
            { key: 'Delivery time', value: '2026-06-18 10:42' },
            { key: 'Recipient', value: 'Signed' },
        ],
        quality: 'high',
        confidence: 'medium',
        conflict: true,
        hasStatus: true,
        userClaimHe: 'המשתמש טוען שלא קיבל את החבילה',
        conflictHe: 'הכלי מדווח "נמסר", המשתמש טוען שלא קיבל. יש סתירה.',
        summaryHe: 'הכלי מדווח שהחבילה נמסרה ונחתמה, אבל זה סותר את מה שהמשתמש אמר.',
        decisionDetailHe: 'ה-Agent לא פוסל את המשתמש ולא אומר "נמסר, אין בעיה". הוא משווה את התוצאה להקשר, מציף את הסתירה, ומציע בדיקה נוספת: פרטי מסירה או חתימת המקבל.',
    },
];

export const OUTCOMES = OBSERVATIONS.map((o) => ({ id: o.id, labelHe: o.labelHe, labelEn: o.labelEn }));
export const DEFAULT_OUTCOME_ID = 'clear';

export function getObservation(id: string): Observation {
    return OBSERVATIONS.find((o) => o.id === id) ?? OBSERVATIONS[0];
}

/* ════════════════════════ תוויות איכות, ביטחון, סיכון ════════════════════ */

export type MeterTone = 'high' | 'mid' | 'low';

export const QUALITY_META: Record<ObservationQuality, { he: string; en: string; tone: MeterTone; fill: number }> = {
    high: { he: 'גבוהה', en: 'High', tone: 'high', fill: 3 },
    medium: { he: 'בינונית', en: 'Medium', tone: 'mid', fill: 2 },
    low: { he: 'נמוכה', en: 'Low', tone: 'low', fill: 1 },
};

export const CONFIDENCE_META: Record<Confidence, { he: string; en: string }> = {
    high: { he: 'גבוה', en: 'High' },
    medium: { he: 'בינוני', en: 'Medium' },
    low: { he: 'נמוך', en: 'Low' },
};

export const RISK_META: Record<RiskLevel, { he: string; en: string }> = {
    low: { he: 'נמוך', en: 'Low' },
    medium: { he: 'בינוני', en: 'Medium' },
    high: { he: 'גבוה', en: 'High' },
};

/* ════════════════════════ תוויות ההחלטה הבאה ═════════════════════════════ */
// Answer ב-teal, Use another tool ב-violet, Ask ב-amber, Stop ב-crimson.

export type DecisionTone = 'answer' | 'tool' | 'ask' | 'stop';

/** ארבעת המסלולים שמוצגים ב-Next Decision Panel. */
export type PanelSlot = 'answer' | 'another-tool' | 'ask' | 'stop-approval';

export const DECISION_META: Record<NextDecision, { he: string; en: string; tone: DecisionTone; slot: PanelSlot }> = {
    answer: { he: 'מתן תשובה', en: 'Answer', tone: 'answer', slot: 'answer' },
    'another-tool': { he: 'שימוש בכלי אחר', en: 'Use another tool', tone: 'tool', slot: 'another-tool' },
    ask: { he: 'בקשת מידע נוסף', en: 'Ask for more information', tone: 'ask', slot: 'ask' },
    'flag-conflict': { he: 'הצפת סתירה', en: 'Flag conflict', tone: 'ask', slot: 'ask' },
    'explain-limitation': { he: 'הסבר על מגבלה', en: 'Explain limitation', tone: 'ask', slot: 'ask' },
    'stop-approval': { he: 'עצירה לאישור אנושי', en: 'Stop for approval', tone: 'stop', slot: 'stop-approval' },
    'ask-input': { he: 'בקשת קלט חסר', en: 'Ask for missing input', tone: 'ask', slot: 'ask' },
};

/** ארבעת המסלולים בלוח ההחלטות, בסדר התצוגה. */
export const PANEL_SLOTS: { slot: PanelSlot; he: string; en: string; tone: DecisionTone }[] = [
    { slot: 'answer', he: 'מתן תשובה', en: 'Answer', tone: 'answer' },
    { slot: 'another-tool', he: 'שימוש בכלי אחר', en: 'Use another tool', tone: 'tool' },
    { slot: 'ask', he: 'בקשת מידע נוסף', en: 'Ask for more information', tone: 'ask' },
    { slot: 'stop-approval', he: 'עצירה לאישור', en: 'Stop for approval', tone: 'stop' },
];

/* ════════════════════════ לולאת ה-Agent (תרשים) ══════════════════════════ */

export const LOOP_NODES: { id: string; he: string; en: string }[] = [
    { id: 'task', he: 'משימה', en: 'Task' },
    { id: 'tool', he: 'כלי', en: 'Tool' },
    { id: 'observation', he: 'תוצאה', en: 'Observation' },
    { id: 'decision', he: 'החלטה', en: 'Decision' },
    { id: 'response', he: 'תשובה סופית', en: 'Final Response' },
];

/* ════════════════════════ עוטף נוח: בניית הלולאה ═════════════════════════ */

export interface LoopState {
    observation: Observation;
    toolCalled: boolean;
    risk: RiskLevel;
    input: DecisionInput;
    decision: NextDecision;
    canAnswer: boolean;
}

/** מקור האמת היחיד למסך: בונה את מצב הלולאה מהבחירות. */
export function buildLoop(outcomeId: string, hasBarcode: boolean, riskHigh: boolean): LoopState {
    const observation = getObservation(outcomeId);
    const toolCalled = hasBarcode;
    const risk: RiskLevel = riskHigh ? 'high' : 'low';
    const input: DecisionInput = {
        toolCalled,
        quality: observation.quality,
        confidence: observation.confidence,
        risk,
        conflict: observation.conflict,
        hasStatus: observation.hasStatus,
    };
    return {
        observation,
        toolCalled,
        risk,
        input,
        decision: decideNext(input),
        canAnswer: canAnswer(input),
    };
}

/* ════════════════════════ קריינות לכל רכיב ═══════════════════════════════ */
// כל רכיב אינטראקטיבי נולד עם שלושה: פסקת הקדמה (intro), שורת takeaway,
// והנחיית try this. אין רכיב בלי שלושתם.

export interface SectionNarration {
    eyebrow: string;
    titleHe: string;
    intro: string;
    takeaway: string;
    tryThis: string;
}

export const NARRATION: Record<string, SectionNarration> = {
    timeline: {
        eyebrow: 'Tool Call Timeline',
        titleHe: 'ציר הזמן של הקריאה',
        intro: 'עד עכשיו ה-Agent בעיקר ניתח. עכשיו הוא מבצע. ה-Timeline מראה שהפעולה אינה קפיצה, היא רצף שלבים, ויש רגע שבו ה-Agent יוצא מהטקסט הפנימי וקורא לכלי חיצוני.',
        takeaway: 'הפעלת כלי היא תהליך, לא רגע. רואים את ה-Agent מתקדם שלב אחר שלב.',
        tryThis: 'הריצו את הבקשה וצפו בשלבים נדלקים, מ-Understand Task ועד Decide Next Step.',
    },
    input: {
        eyebrow: 'Tool Input Viewer',
        titleHe: 'מציג קלט הכלי',
        intro: 'ה-Agent לא שולח "כוונה כללית" לכלי, הוא שולח קריאה מוגדרת עם קלט מדויק. וזה גם הגבול: Tool selected אינו אומר Tool called, בלי קלט תקין הקריאה לא תופעל.',
        takeaway: 'קריאה לכלי היא הגדרה מדויקת, לא בקשה כללית. בלי קלט תקין, אין קריאה.',
        tryThis: 'הסירו את הברקוד וראו את ה-Input Viewer מציג barcode missing, וה-Tool Call לא מופעל.',
    },
    observation: {
        eyebrow: 'Observation Card',
        titleHe: 'כרטיס התוצאה',
        intro: 'התוצאה שחוזרת מהכלי נקראת Observation. זה מה שה-Agent רואה אחרי הפעולה. שימו לב, ה-Agent לא ידע את זה מראש, הוא ביקש את זה מכלי.',
        takeaway: 'Observation היא מידע חדש שהגיע מבחוץ, לא משהו שהמודל ידע.',
        tryThis: 'עברו בין שלוש התוצאות, ברורה, חלקית וסותרת, וראו איך אותו כלי יכול להחזיר מצבים שונים מאוד.',
    },
    quality: {
        eyebrow: 'Observation Quality Meter',
        titleHe: 'מד איכות התוצאה',
        intro: 'לא כל תוצאה מכלי היא באותה איכות. גם כלי חיצוני לא תמיד מחזיר אמת מלאה. תוצאה איכותית מאפשרת לענות, תוצאה חלשה מובילה לבקש, לנסות שוב, או להסביר מגבלה. הנקודה הקריטית: תוצאה חלשה מובילה לזהירות, לא להמצאה.',
        takeaway: 'איכות התוצאה קובעת אם בכלל אפשר לענות. כשהיא נמוכה, לא ממציאים.',
        tryThis: 'בחרו את התוצאה החלקית וראו את המד יורד ל-Low, ואת ההחלטה עוברת מ-Answer לצעד אחר (כלי נוסף, שאלה, או הסבר מגבלה).',
    },
    decision: {
        eyebrow: 'Next Decision Panel',
        titleHe: 'לוח ההחלטה הבאה',
        intro: 'Observation אינה סוף התהליך, היא קלט חדש להחלטה הבאה. ה-Agent קורא את התוצאה, משווה אותה להקשר, ובוחר צעד. תוצאה ברורה מובילה לתשובה, תוצאה חלקית לצעד אחר, תוצאה סותרת להצפת הסתירה, ופעולה מסוכנת לעצירה לאישור.',
        takeaway: 'התוצאה מהכלי לא סוגרת את הסיפור, היא פותחת החלטה חדשה.',
        tryThis: 'בחרו את התוצאה הסותרת וראו שה-Agent לא פוסל את המשתמש, אלא מציף Conflict detected ומציע בדיקה נוספת.',
    },
    replay: {
        eyebrow: 'Agent Loop Replay',
        titleHe: 'ניגון חוזר של הלולאה',
        intro: 'כדי להבין שזו לולאה ולא קו ישר, אפשר להריץ את כל התהליך שוב לאט. בכל שלב אפשר לעצור ולראות מה הוביל לבא.',
        takeaway: 'ה-Agent עובד בלולאה, ואפשר לפרק אותה שלב אחר שלב.',
        tryThis: 'לחצו Replay, ועצרו בשלב Receive Observation, ושימו לב איך הוא הופך לקלט של Decide Next Step.',
    },
};
