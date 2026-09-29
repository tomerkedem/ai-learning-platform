// נתוני מעבדת ה-Tokenization בעברית (תרחישים, צירופי הקשר, מפת הדרכים, הסברי התפקידים
// ומילון מילה -> תפקיד), בשרת בלבד (פרק 3 מוגן). labContent.server.ts בונה מהם את
// תוכן המעבדה, והעמוד מעביר אותו לדפדפן רק אחרי בדיקת הרשאה. הלוגיקה (tokenize וכו')
// נשארת בצד הלקוח ומקבלת את הנתונים כפרמטר.
// אין שימוש בתו מקף ארוך (em dash) או מקף בינוני (en dash).

import 'server-only';
import type { PhraseAfterSignal, PairSignal, TokenScenario, RoadmapStep } from './tokenizer';
import type { RoleInfo, RoleWordMap, TokenRole } from './tokenRoles';

/** ברירת המחדל העברית: צירוף ההקשר "כוס קפה". */
export const HE_SORTING_CENTER: PhraseAfterSignal = {
    leads: ['כוס', 'לכוס', 'בכוס'],
    follow: 'קפה',
};

/** ברירת המחדל העברית: צירוף שלילה ופעולה "לא ... לאכול". */
export const HE_DELIVERY_FAILURE: PairSignal = {
    first: 'לא',
    second: 'לאכול',
};

export const TOKEN_SCENARIOS: TokenScenario[] = [
    {
        id: 'chat-basics',
        mode: 'chat',
        labelHe: 'מצב צ׳אט',
        labelEn: 'Chat mode',
        prompt: 'הכביסה לא התייבשה',
        accent: 'emerald',
        routeHe: 'בניית תשובה',
        routeEn: 'Build answer',
        examples: [
            { labelHe: 'בסיס', labelEn: 'Base', text: 'הכביסה לא התייבשה' },
            { labelHe: 'עם שאלה', labelEn: 'With question', text: 'הכביסה לא התייבשה?' },
            { labelHe: 'עם דגש', labelEn: 'With emphasis', text: 'הכביסה שלי לא התייבשה!!!' },
            { labelHe: 'כמות במתכון', labelEn: 'Recipe quantity', text: 'המתכון דורש 250 גרם קמח' },
            { labelHe: 'בלי רווחים', labelEn: 'No spaces', text: 'הכביסהלאהתייבשה' },
            { labelHe: 'באנגלית', labelEn: 'In English', text: 'The laundry did not dry. What should I do?' },
            { labelHe: 'תיקון בשיחה', labelEn: 'Correction', text: 'לא עוגיות, אפיתי עוגה' },
        ],
    },
    {
        id: 'agent-check',
        mode: 'agent',
        labelHe: 'מצב Agent',
        labelEn: 'Agent mode',
        prompt: 'בדוק למה החתול לא חזר',
        accent: 'purple',
        routeHe: 'הבנת משימה',
        routeEn: 'Understand task',
        examples: [
            { labelHe: 'בקשת בדיקה', labelEn: 'Investigation', text: 'בדוק למה החתול לא חזר' },
            { labelHe: 'בדיקה לנמען', labelEn: 'To recipient', text: 'בדוק למה החתול לא חזר לילד' },
        ],
    },
];

/** שלבי מפת הדרכים: רק הראשון פעיל, השאר נעולים כטיזר לפרקים הבאים. */
export const ROADMAP_STEPS: RoadmapStep[] = [
    { he: 'טקסט', en: 'Text', active: true },
    { he: 'טוקנים', en: 'Tokens', active: true },
    { he: 'מזהי טוקן', en: 'Token IDs', active: false },
    { he: 'וקטורים', en: 'Vectors', active: false },
    { he: 'דמיון', en: 'Similarity', active: false },
    { he: 'ציונים', en: 'Scores', active: false },
    { he: 'הסתברויות', en: 'Probabilities', active: false },
];

export const ROLE_INFO: Record<TokenRole, RoleInfo> = {
    object: { he: 'אובייקט', en: 'Object', whyHe: 'זה הדבר שהמשפט מדבר עליו. התווית מסמנת על מה מדובר, עוד לפני שמעבדים את שאר המשפט.' },
    negation: { he: 'שלילה', en: 'Negation', whyHe: 'המילה הזאת יכולה להפוך את כיוון המשפט. בלעדיה המשמעות הפוכה לגמרי.' },
    action: { he: 'פעולה', en: 'Action', whyHe: 'מה קרה לאובייקט. הפועל קובע את מצב הדברים בפועל.' },
    'action-signal': { he: 'אות פעולה', en: 'Action signal', whyHe: 'המילה הזאת מסיטה את הקלט ממשפט תיאורי לבקשת פעולה. היא משנה את כל המסלול.' },
    context: { he: 'הקשר', en: 'Context / Location', whyHe: 'מוסיף מיקום או הקשר שעוזר לדייק את התמונה, למשל איפה שתית את הקפה שלך.' },
    system: { he: 'מערכת', en: 'System', whyHe: 'מצביע על מערכת רחבה יותר ולא על האובייקט עצמו. אותו תחום, אבל כיוון אחר לגמרי.' },
    recipient: { he: 'נמען', en: 'Recipient', whyHe: 'מי מקבל את הפעולה. רלוונטי במיוחד כשמדובר בפעולה כלפי אדם אמיתי.' },
    'question-signal': { he: 'סימן שאלה', en: 'Question signal', whyHe: 'סימן השאלה הוא token בפני עצמו. הוא משנה את הצורה של המשפט משאלה לקביעה.' },
    'statement-signal': { he: 'סימן קביעה', en: 'Statement signal', whyHe: 'הנקודה היא token נפרד שמסמן סוף קביעה. גם הפיסוק נחשב יחידת עבודה.' },
    number: { he: 'מספר', en: 'Number', whyHe: 'רצף ספרות הוא יחידה בפני עצמה. כמות במתכון, למשל, הופכת בקשה כללית למשהו מדויק וניתן למדידה.' },
    noise: { he: 'רעש', en: 'Noise', whyHe: 'מילה כללית שמוסיפה מעט מאוד מידע. עדיין הופכת ל-token, גם אם משקלה נמוך.' },
    other: { he: 'כללי', en: 'Token', whyHe: 'מילה שלא מופתה לתפקיד מיוחד בטוקנייזר הלימודי הזה. עדיין נספרת כיחידת עבודה.' },
};

/** מילה -> תפקיד. טבלה דטרמיניסטית קבועה (ברירת המחדל העברית). */
export const WORD_ROLES: RoleWordMap = {
    // Object
    'הכביסה': 'object', 'כביסה': 'object', 'החתול': 'object', 'חתול': 'object',
    // Negation
    'לא': 'negation', 'אין': 'negation', 'בלי': 'negation', 'אינו': 'negation',
    // Action
    'התייבשה': 'action', 'התייבש': 'action', 'חזר': 'action', 'חזרה': 'action',
    // Action signal
    'בדוק': 'action-signal', 'תבדוק': 'action-signal', 'בדקי': 'action-signal',
    // Context / Location (גם צירוף הדטקטור: "כוס קפה")
    'כוס': 'context', 'לכוס': 'context', 'בכוס': 'context', 'קפה': 'context',
    // System
    'הרשת': 'system', 'רשת': 'system',
    // Recipient
    'לילד': 'recipient', 'ילד': 'recipient',
    // Noise
    'אולי': 'noise', 'קצת': 'noise', 'משהו': 'noise',
};
