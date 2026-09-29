// נתוני הטקסט של מנוע פרק 4 (מילון Token IDs, תרחישי ההקלדה, תוויות הממדים, שורות
// הנוסחה ומפת הדרכים), בשרת בלבד (פרק 4 מוגן). wordLabContent.ts בונה מהם את נתוני
// המעבדה לכל שפה, והעמוד מעביר אותם לדפדפן רק אחרי בדיקת הרשאה. המתמטיקה, הטיפוסים
// והסגנונות נשארים ב-embeddingEngine.ts (צד לקוח).
// אין שימוש בתו מקף ארוך (em dash) או מקף בינוני (en dash).

import 'server-only';
import type { DimKey, DimInfo, EngineMode, EngineScenario, FormulaRow } from './embeddingEngine';

/* ════════════════════════════ מילון Token IDs ════════════════════════════ */
// טבלה דטרמיניסטית קבועה. ה-ID הוא כתובת במילון, לא משמעות.

export const TOKEN_DICTIONARY: Record<string, number> = {
    'החבילה': 1042,
    'לא': 17,
    'הגיעה': 883,
    'המשלוח': 1057,
    'נמסר': 904,
    'המערכת': 2310,
    'מציגה': 441,
    'את': 9,
    'בדוק': 51,
    'למה': 88,
    'שלח': 73,
    'הודעה': 612,
    'ללקוח': 1190,
    'שהחבילה': 1338,
    'אבדה': 770,
    'הקפה': 250,
    'חם': 460,
    'מדי': 530,
    'המוזיקה': 680,
    'חזקה': 815,
};

/** מחזיר את ה-Token ID של מילה, או null אם אינה במילון. */
export function idForWord(word: string): number | null {
    return word in TOKEN_DICTIONARY ? TOKEN_DICTIONARY[word] : null;
}

/** ממיר רשימת מילים לרשימת Token IDs (null למילה שאינה במילון). */
export function idsForWords(words: string[]): (number | null)[] {
    return words.map(idForWord);
}

export const DIM_INFO: Record<DimKey, DimInfo> = {
    delivery: { he: 'משלוח', en: 'Delivery' },
    system: { he: 'מערכת', en: 'System' },
    address: { he: 'כתובת', en: 'Address' },
    payment: { he: 'תשלום', en: 'Payment' },
    urgency: { he: 'דחיפות', en: 'Urgency' },
    failure: { he: 'כשל', en: 'Failure' },
    action: { he: 'פעולה', en: 'Action' },
    risk: { he: 'סיכון', en: 'Risk' },
    customer: { he: 'לקוח', en: 'Customer' },
    permission: { he: 'אישור', en: 'Permission' },
};

export const SCENARIOS: EngineScenario[] = [
    /* ── תרחיש A: Chat, "הקפה חם מדי" ──────────────────────────────── */
    {
        id: 'chat-delivery',
        mode: 'chat',
        labelHe: 'קפה חם',
        labelEn: 'Hot coffee',
        prompt: 'הקפה חם מדי',
        accent: 'cyan',
        steps: [
            {
                text: 'הקפה',
                tokens: ['הקפה'],
                profile: { delivery: 0.80, system: 0.20, address: 0.10, payment: 0.05, urgency: 0.20, failure: 0.10 },
                mainChangeHe: 'המילה "הקפה" הופכת לטוקן ולכתובת משלה בטבלה.',
                lead: 'delivery',
            },
            {
                text: 'הקפה חם',
                tokens: ['הקפה', 'חם'],
                profile: { delivery: 0.85, system: 0.20, address: 0.10, payment: 0.05, urgency: 0.30, failure: 0.55 },
                mainChangeHe: 'המילה "חם" מצטרפת כטוקן נפרד עם כתובת משלה.',
                lead: 'delivery',
            },
            {
                text: 'הקפה חם מדי',
                tokens: ['הקפה', 'חם', 'מדי'],
                profile: { delivery: 0.95, system: 0.20, address: 0.10, payment: 0.05, urgency: 0.40, failure: 0.85 },
                mainChangeHe: 'המשפט השלם הוא רצף של שלושה טוקנים, כל אחד עם ה-Token ID שלו.',
                lead: 'delivery',
            },
        ],
    },

    /* ── תרחיש B: Chat, "המוזיקה חזקה מדי" ─────────── */
    {
        id: 'chat-system',
        mode: 'chat',
        labelHe: 'מוזיקה חזקה',
        labelEn: 'Loud music',
        prompt: 'המוזיקה חזקה מדי',
        accent: 'indigo',
        steps: [
            {
                text: 'המוזיקה',
                tokens: ['המוזיקה'],
                profile: { system: 0.70, delivery: 0.20, address: 0.10, payment: 0.05, urgency: 0.15, failure: 0.10 },
                mainChangeHe: 'המילה "המוזיקה" הופכת לטוקן ולכתובת משלה בטבלה.',
                lead: 'system',
            },
            {
                text: 'המוזיקה חזקה',
                tokens: ['המוזיקה', 'חזקה'],
                profile: { system: 0.78, delivery: 0.25, address: 0.10, payment: 0.05, urgency: 0.30, failure: 0.40 },
                mainChangeHe: 'המילה "חזקה" מצטרפת כטוקן נפרד עם כתובת משלה.',
                lead: 'system',
            },
            {
                text: 'המוזיקה חזקה מדי',
                tokens: ['המוזיקה', 'חזקה', 'מדי'],
                profile: { system: 0.80, delivery: 0.45, address: 0.15, payment: 0.05, urgency: 0.30, failure: 0.45 },
                mainChangeHe: 'משפט שונה לגמרי, אותו עיקרון: רצף טוקנים, כל אחד עם השורה שלו.',
                lead: 'system',
            },
        ],
    },

    /* ── תרחיש C: Agent, חקירה בטוחה "בדוק למה החבילה לא הגיעה" ─────────── */
    {
        id: 'agent-investigate',
        mode: 'agent',
        labelHe: 'בקשת חקירה',
        labelEn: 'Investigation',
        prompt: 'בדוק למה החבילה לא הגיעה',
        accent: 'indigo',
        steps: [
            {
                text: 'בדוק',
                tokens: ['בדוק'],
                profile: { action: 0.80, delivery: 0.25, urgency: 0.30, risk: 0.15, system: 0.15, failure: 0.10, customer: 0.05, permission: 0.10 },
                mainChangeHe: 'המילה "בדוק" מדליקה את ממד הפעולה, סיכון נמוך.',
                lead: 'action',
                agent: {
                    status: 'safe',
                    headlineHe: 'זוהתה בקשת פעולה',
                    detailHe: 'אות פעולה ("בדוק") עם סיכון נמוך. נראה כמו חקירה, לא פעולה מול לקוח.',
                },
            },
            {
                text: 'בדוק למה החבילה',
                tokens: ['בדוק', 'למה', 'החבילה'],
                profile: { action: 0.82, delivery: 0.75, urgency: 0.35, risk: 0.15, system: 0.15, failure: 0.15, customer: 0.05, permission: 0.10 },
                mainChangeHe: 'נוסף תחום: משלוח. הסיכון נשאר נמוך.',
                lead: 'delivery',
                agent: {
                    status: 'safe',
                    headlineHe: 'מטרה: לחקור תחום משלוח',
                    detailHe: 'הפרופיל מצביע על חקירה פנימית. אין פנייה ללקוח, אין סיכון.',
                },
            },
            {
                text: 'בדוק למה החבילה לא הגיעה',
                tokens: ['בדוק', 'למה', 'החבילה', 'לא', 'הגיעה'],
                profile: { action: 0.85, delivery: 0.90, failure: 0.85, urgency: 0.45, risk: 0.15, system: 0.15, customer: 0.05, permission: 0.10 },
                mainChangeHe: 'פרופיל סופי: חקירת כשל במסירה, סיכון נמוך.',
                lead: 'delivery',
                negation: true,
                agent: {
                    status: 'safe',
                    headlineHe: 'בטוח לחקור, צריך ברקוד',
                    detailHe: 'סיכון נמוך ואין פעולה מול לקוח. הצעד הבא: להשתמש בכלי בדיקת סטטוס, ולבקש ברקוד.',
                },
            },
        ],
    },

    /* ── תרחיש D: Agent, פעולה מסוכנת "שלח הודעה ללקוח שהחבילה אבדה" ───── */
    {
        id: 'agent-notify',
        mode: 'agent',
        labelHe: 'פעולה מול לקוח',
        labelEn: 'Customer action',
        prompt: 'שלח הודעה ללקוח שהחבילה אבדה',
        accent: 'rose',
        steps: [
            {
                text: 'שלח',
                tokens: ['שלח'],
                profile: { action: 0.85, risk: 0.40, permission: 0.45, customer: 0.20, delivery: 0.15, urgency: 0.25, failure: 0.10, system: 0.05 },
                mainChangeHe: 'המילה "שלח" מדליקה פעולה, וגם סיכון ואישור מתחילים לטפס.',
                lead: 'action',
                agent: {
                    status: 'safe',
                    headlineHe: 'זוהתה פעולה יוצאת',
                    detailHe: 'אות פעולה ("שלח"). עדיין לא ברור אל מי, אבל הסיכון מתחיל לטפס.',
                },
            },
            {
                text: 'שלח הודעה ללקוח',
                tokens: ['שלח', 'הודעה', 'ללקוח'],
                profile: { action: 0.85, customer: 0.90, risk: 0.70, permission: 0.80, delivery: 0.30, urgency: 0.30, failure: 0.15, system: 0.05 },
                mainChangeHe: 'המילה "ללקוח" מקפיצה לקוח, סיכון ואישור.',
                lead: 'customer',
                agent: {
                    status: 'approval',
                    headlineHe: 'פעולה מול לקוח אמיתי',
                    detailHe: 'הפרופיל מצביע על פנייה ישירה ללקוח. סיכון ואישור גבוהים.',
                },
            },
            {
                text: 'שלח הודעה ללקוח שהחבילה אבדה',
                tokens: ['שלח', 'הודעה', 'ללקוח', 'שהחבילה', 'אבדה'],
                profile: { action: 0.85, delivery: 0.80, customer: 0.90, risk: 0.85, permission: 0.90, failure: 0.70, urgency: 0.40, system: 0.05 },
                mainChangeHe: 'פרופיל סופי: סיכון ואישור גבוהים. צריך לעצור ולבקש אישור.',
                lead: 'permission',
                agent: {
                    status: 'approval',
                    headlineHe: 'לעצור, נדרש אישור',
                    detailHe: 'אותו פרופיל מספרי מבדיל בין חקירה בטוחה לבין פעולה מסוכנת מול לקוח. הצעד הבא: לעצור ולבקש אישור אנושי.',
                },
            },
        ],
    },
];

export const FORMULA_DIMS = ['Delivery', 'System', 'Address', 'Failure'];

export const FORMULA_ROWS: FormulaRow[] = [
    { word: 'החבילה', values: [0.8, 0.1, 0.0, 0.1] },
    { word: 'לא', values: [0.1, 0.0, 0.0, 0.7] },
    { word: 'הגיעה', values: [0.6, 0.1, 0.0, 0.3] },
];

/** סכום העמודות (סכימת וקטורים). מחושב מהשורות כדי שיישאר עקבי. */
export const FORMULA_SUM: number[] = FORMULA_DIMS.map((_, col) =>
    Number(FORMULA_ROWS.reduce((s, r) => s + r.values[col], 0).toFixed(1)),
);

export const ROADMAP_STEPS_6: { he: string; en: string; active: boolean }[] = [
    { he: 'טקסט', en: 'Text', active: true },
    { he: 'טוקנים', en: 'Tokens', active: true },
    { he: 'מזהי טוקן', en: 'Token IDs', active: true },
    { he: 'וקטורים', en: 'Vectors', active: true },
    { he: 'דמיון', en: 'Similarity', active: false },
    { he: 'ציונים', en: 'Scores', active: false },
    { he: 'הסתברויות', en: 'Probabilities', active: false },
];

export function getScenario(id: string): EngineScenario | undefined {
    return SCENARIOS.find((s) => s.id === id);
}

export function defaultScenarioFor(mode: EngineMode): EngineScenario {
    return SCENARIOS.find((s) => s.mode === mode) ?? SCENARIOS[0];
}

export function scenariosFor(mode: EngineMode): EngineScenario[] {
    return SCENARIOS.filter((s) => s.mode === mode);
}
