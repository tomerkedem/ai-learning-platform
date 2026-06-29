// מנוע ה-Embedding הלימודי של פרק 4, Embeddings: "ממספר חסר משמעות למשמעות".
// זהו מודל לימודי דטרמיניסטי לחלוטין - אין כאן LLM אמיתי, קריאת API או רשת.
// הכל מילון Token IDs קבוע פלוס פרופילים מספריים קבועים לפי שלב הקלדה.
//
// שתי הבחנות מנחות שמופיעות בכל התצוגות:
//   1. Token ID הוא כתובת במילון, לא משמעות. 1042 מצביע על "החבילה",
//      הוא לא "אומר" חבילה. כמו ברקוד שאינו הטעם של המוצר.
//   2. ממדי המשמעות (Delivery, Failure...) הם צירים קריאים שבחרנו ללמידה.
//      בייצוגים אמיתיים הממדים אינם תוויות אנושיות אלא מאות ממדים נלמדים.
//
// ── איך להרחיב ────────────────────────────────────────────────────────────
//   להוסיף מילה למילון: שורה ב-TOKEN_DICTIONARY (מילה -> מספר).
//   להוסיף ממד משמעות: ערך ב-DimKey, סגנון ב-DIM_STYLE, תיאור ב-DIM_INFO,
//     והוספה ל-CHAT_DIMS או AGENT_EXTRA_DIMS.
//   להוסיף תרחיש: אובייקט ל-SCENARIOS עם steps עוקבים (כל step.text הוא
//     הרחבה של הקודם). ה-ids נגזרים אוטומטית מהמילון לפי ה-tokens.

import type { Accent } from '@/components/ai-internals/types';

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
};

/** מחזיר את ה-Token ID של מילה, או null אם אינה במילון. */
export function idForWord(word: string): number | null {
    return word in TOKEN_DICTIONARY ? TOKEN_DICTIONARY[word] : null;
}

/** ממיר רשימת מילים לרשימת Token IDs (null למילה שאינה במילון). */
export function idsForWords(words: string[]): (number | null)[] {
    return words.map(idForWord);
}

/* ════════════════════════════ ממדי המשמעות ═══════════════════════════════ */
// קבוצה סגורה כדי לשמור על מחלקות Tailwind סטטיות (literal בלבד).

export type DimKey =
    | 'delivery' | 'system' | 'address' | 'payment' | 'urgency' | 'failure'
    | 'action' | 'risk' | 'customer' | 'permission';

/** הממדים שמוצגים ב-Chat mode. */
export const CHAT_DIMS: DimKey[] = ['delivery', 'system', 'address', 'payment', 'urgency', 'failure'];

/** ממדי הפעולה והסיכון שמתווספים ב-Agent mode. */
export const AGENT_EXTRA_DIMS: DimKey[] = ['action', 'risk', 'customer', 'permission'];

/** סדר התצוגה המלא ב-Agent mode. */
export const AGENT_DIMS: DimKey[] = [...CHAT_DIMS, ...AGENT_EXTRA_DIMS];

export interface DimInfo {
    he: string;
    en: string;
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

export interface DimStyle {
    text: string;
    dot: string;
    bar: string;     // מילוי עמודה (גרדיאנט, זורם שמאלה ל-RTL)
    soft: string;    // רקע רך
    border: string;
}

/** פלטה נפרדת אך תואמת לפלטת הפרקים הקודמים. מחלקות literal בלבד. */
export const DIM_STYLE: Record<DimKey, DimStyle> = {
    delivery: { text: 'text-cyan-300', dot: 'bg-cyan-400', bar: 'bg-gradient-to-l from-cyan-400 to-cyan-500', soft: 'bg-cyan-900/15', border: 'border-cyan-500/40' },
    system: { text: 'text-indigo-300', dot: 'bg-indigo-400', bar: 'bg-gradient-to-l from-indigo-400 to-indigo-500', soft: 'bg-indigo-900/15', border: 'border-indigo-500/40' },
    address: { text: 'text-blue-300', dot: 'bg-blue-400', bar: 'bg-gradient-to-l from-blue-400 to-blue-500', soft: 'bg-blue-900/15', border: 'border-blue-500/40' },
    payment: { text: 'text-emerald-300', dot: 'bg-emerald-400', bar: 'bg-gradient-to-l from-emerald-400 to-emerald-500', soft: 'bg-emerald-900/15', border: 'border-emerald-500/40' },
    urgency: { text: 'text-amber-300', dot: 'bg-amber-400', bar: 'bg-gradient-to-l from-amber-400 to-amber-500', soft: 'bg-amber-900/15', border: 'border-amber-500/40' },
    failure: { text: 'text-rose-300', dot: 'bg-rose-400', bar: 'bg-gradient-to-l from-rose-400 to-rose-500', soft: 'bg-rose-900/15', border: 'border-rose-500/40' },
    action: { text: 'text-violet-300', dot: 'bg-violet-400', bar: 'bg-gradient-to-l from-violet-400 to-violet-500', soft: 'bg-violet-900/15', border: 'border-violet-500/40' },
    risk: { text: 'text-orange-300', dot: 'bg-orange-400', bar: 'bg-gradient-to-l from-orange-400 to-orange-500', soft: 'bg-orange-900/15', border: 'border-orange-500/40' },
    customer: { text: 'text-fuchsia-300', dot: 'bg-fuchsia-400', bar: 'bg-gradient-to-l from-fuchsia-400 to-fuchsia-500', soft: 'bg-fuchsia-900/15', border: 'border-fuchsia-500/40' },
    permission: { text: 'text-teal-300', dot: 'bg-teal-400', bar: 'bg-gradient-to-l from-teal-400 to-teal-500', soft: 'bg-teal-900/15', border: 'border-teal-500/40' },
};

/** פרופיל = ערך מנורמל 0..1 לכל ממד. ממד חסר נחשב 0. */
export type Profile = Partial<Record<DimKey, number>>;

/** ערך ממד בפרופיל (0 אם חסר). */
export function dimValue(profile: Profile, key: DimKey): number {
    return profile[key] ?? 0;
}

/* ════════════════════════════ תרחישים ════════════════════════════════════ */

export type EngineMode = 'chat' | 'agent';

/** היגיון Agent שמוצג בשלב מסוים (רק במצב Agent). */
export interface AgentNote {
    /** סטטוס המסלול: חקירה בטוחה מול פעולה שדורשת אישור. */
    status: 'safe' | 'approval';
    headlineHe: string;
    detailHe: string;
}

/** שלב הקלדה בודד: מצב מלא של המנוע אחרי שהוקלדה עוד מילה. */
export interface EngineStep {
    /** הטקסט המצטבר. כל step הוא prefix של הבא אחריו. */
    text: string;
    /** המילים שנדלקו עד שלב זה (לא כולל ה-ids - הם נגזרים מהמילון). */
    tokens: string[];
    /** הפרופיל המנורמל (0..1 לכל ממד) - מה ש-Meaning Vector Live מציג. */
    profile: Profile;
    /** תיאור עברי של השינוי המוביל בשלב זה. */
    mainChangeHe: string;
    /** הממד המוביל בשלב זה (לצורך הדגשה). */
    lead: DimKey;
    /** האם זוהתה מילת שלילה בשלב זה (מקפיצה Failure / Urgency). */
    negation?: boolean;
    /** היגיון Agent (מוצג רק במצב Agent). */
    agent?: AgentNote;
}

export interface EngineScenario {
    id: string;
    mode: EngineMode;
    labelHe: string;
    labelEn: string;
    prompt: string;
    accent: Accent;
    steps: EngineStep[];
}

export const SCENARIOS: EngineScenario[] = [
    /* ── תרחיש A: Chat, "החבילה לא הגיעה" ──────────────────────────────── */
    {
        id: 'chat-delivery',
        mode: 'chat',
        labelHe: 'אי מסירה',
        labelEn: 'Not delivered',
        prompt: 'החבילה לא הגיעה',
        accent: 'cyan',
        steps: [
            {
                text: 'החבילה',
                tokens: ['החבילה'],
                profile: { delivery: 0.80, system: 0.20, address: 0.10, payment: 0.05, urgency: 0.20, failure: 0.10 },
                mainChangeHe: 'המילה "החבילה" דוחפת חזק את ממד המשלוח.',
                lead: 'delivery',
            },
            {
                text: 'החבילה לא',
                tokens: ['החבילה', 'לא'],
                profile: { delivery: 0.85, system: 0.20, address: 0.10, payment: 0.05, urgency: 0.30, failure: 0.55 },
                mainChangeHe: 'המילה "לא" מקפיצה את הכשל ואת הדחיפות.',
                lead: 'delivery',
                negation: true,
            },
            {
                text: 'החבילה לא הגיעה',
                tokens: ['החבילה', 'לא', 'הגיעה'],
                profile: { delivery: 0.95, system: 0.20, address: 0.10, payment: 0.05, urgency: 0.40, failure: 0.85 },
                mainChangeHe: 'הצירוף "לא הגיעה" מקבע פרופיל של כשל במשלוח.',
                lead: 'delivery',
            },
        ],
    },

    /* ── תרחיש B: Chat, כיוון מנוגד "המערכת לא מציגה את החבילה" ─────────── */
    {
        id: 'chat-system',
        mode: 'chat',
        labelHe: 'תקלת מערכת',
        labelEn: 'System issue',
        prompt: 'המערכת לא מציגה את החבילה',
        accent: 'indigo',
        steps: [
            {
                text: 'המערכת',
                tokens: ['המערכת'],
                profile: { system: 0.70, delivery: 0.20, address: 0.10, payment: 0.05, urgency: 0.15, failure: 0.10 },
                mainChangeHe: 'המילה "המערכת" מסיטה את הכובד לממד המערכת.',
                lead: 'system',
            },
            {
                text: 'המערכת לא',
                tokens: ['המערכת', 'לא'],
                profile: { system: 0.78, delivery: 0.25, address: 0.10, payment: 0.05, urgency: 0.30, failure: 0.40 },
                mainChangeHe: 'המילה "לא" מוסיפה כשל, אך "מערכת" עדיין מובילה.',
                lead: 'system',
                negation: true,
            },
            {
                text: 'המערכת לא מציגה את החבילה',
                tokens: ['המערכת', 'לא', 'מציגה', 'את', 'החבילה'],
                profile: { system: 0.80, delivery: 0.45, address: 0.15, payment: 0.05, urgency: 0.30, failure: 0.45 },
                mainChangeHe: 'אותו תחום, כיוון אחר: הכובד עובר לתקלת תצוגה במערכת.',
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

/* ═══════════════════════ Vector Shift by Word ════════════════════════════ */
// כיוון ההשפעה של מילה על הפרופיל (אילו ממדים היא דוחפת מעלה).
// זה כיוון, לא אריתמטיקה מדויקת. label עם dim ידוע מקבל את צבע הממד.

export type ShiftDir = 'up-strong' | 'up' | 'up-slight';

export interface ShiftEntry {
    he: string;
    en: string;
    dir: ShiftDir;
    /** אם הכיוון מתאים לממד מוכר - הצבע נלקח מ-DIM_STYLE. */
    dim?: DimKey;
}

export const VECTOR_SHIFTS: Record<string, ShiftEntry[]> = {
    'החבילה': [{ he: 'משלוח', en: 'Delivery', dir: 'up-strong', dim: 'delivery' }],
    'לא': [
        { he: 'כשל', en: 'Failure', dir: 'up', dim: 'failure' },
        { he: 'שלילה', en: 'Negation', dir: 'up' },
        { he: 'משלוח', en: 'Delivery', dir: 'up-slight', dim: 'delivery' },
    ],
    'הגיעה': [
        { he: 'משלוח', en: 'Delivery', dir: 'up', dim: 'delivery' },
        { he: 'הגעה', en: 'Arrival', dir: 'up' },
    ],
    'המשלוח': [{ he: 'משלוח', en: 'Delivery', dir: 'up-strong', dim: 'delivery' }],
    'נמסר': [
        { he: 'משלוח', en: 'Delivery', dir: 'up', dim: 'delivery' },
        { he: 'מסירה', en: 'Delivery state', dir: 'up' },
    ],
    'המערכת': [{ he: 'מערכת', en: 'System', dir: 'up-strong', dim: 'system' }],
    'מציגה': [
        { he: 'מערכת', en: 'System', dir: 'up', dim: 'system' },
        { he: 'תצוגה', en: 'Display', dir: 'up' },
    ],
    'בדוק': [
        { he: 'פעולה', en: 'Action', dir: 'up-strong', dim: 'action' },
        { he: 'חקירה', en: 'Investigation', dir: 'up' },
    ],
    'למה': [{ he: 'חיפוש סיבה', en: 'Reason seeking', dir: 'up' }],
    'שלח': [
        { he: 'פעולה', en: 'Action', dir: 'up-strong', dim: 'action' },
        { he: 'סיכון', en: 'Risk', dir: 'up', dim: 'risk' },
        { he: 'אישור', en: 'Permission', dir: 'up', dim: 'permission' },
    ],
    'הודעה': [
        { he: 'תקשורת', en: 'Message', dir: 'up' },
        { he: 'לקוח', en: 'Customer', dir: 'up-slight', dim: 'customer' },
    ],
    'ללקוח': [
        { he: 'לקוח', en: 'Customer', dir: 'up-strong', dim: 'customer' },
        { he: 'סיכון', en: 'Risk', dir: 'up', dim: 'risk' },
        { he: 'אישור', en: 'Permission', dir: 'up', dim: 'permission' },
    ],
    'שהחבילה': [{ he: 'משלוח', en: 'Delivery', dir: 'up', dim: 'delivery' }],
    'אבדה': [
        { he: 'כשל', en: 'Failure', dir: 'up', dim: 'failure' },
        { he: 'סיכון', en: 'Risk', dir: 'up', dim: 'risk' },
    ],
    'את': [],
    'מציגה את': [],
};

/** מחזיר את כרטיס ה-shift של מילה (ריק אם אין נתון). */
export function shiftForWord(word: string): ShiftEntry[] {
    return VECTOR_SHIFTS[word] ?? [];
}

/* ═══════════════════════ Similar Meaning Preview ═════════════════════════ */
// טיזר לפרק 5: Token IDs שונים, Meaning Vector מתיישר.
// אנחנו לא מחשבים כאן דמיון אמיתי - רק מציגים שני פרופילים זה לצד זה.

export interface SimilarItem {
    prompt: string;
    tokens: string[];
    profile: Profile;
}

export interface SimilarPair {
    left: SimilarItem;
    right: SimilarItem;
    /** הממדים המשותפים שמודגשים בהשוואה. */
    sharedDims: DimKey[];
}

export const SIMILAR_PAIR: SimilarPair = {
    left: {
        prompt: 'החבילה לא הגיעה',
        tokens: ['החבילה', 'לא', 'הגיעה'],
        profile: { delivery: 0.95, failure: 0.85, system: 0.20, urgency: 0.40, address: 0.10, payment: 0.05 },
    },
    right: {
        prompt: 'המשלוח לא נמסר',
        tokens: ['המשלוח', 'לא', 'נמסר'],
        profile: { delivery: 0.90, failure: 0.80, system: 0.15, urgency: 0.38, address: 0.10, payment: 0.05 },
    },
    sharedDims: ['delivery', 'failure', 'system'],
};

/**
 * חיווי קרבה ויזואלי בלבד (0..1) על בסיס הממדים המשותפים.
 * זו אינה נוסחת הדמיון של פרק 8 - רק עזר תצוגה לטיזר.
 * 1 = פרופילים זהים, 0 = רחוקים. מחושב כ-1 פחות מרחק ממוצע על הצירים.
 */
export function visualCloseness(a: Profile, b: Profile, dims: DimKey[]): number {
    if (dims.length === 0) return 0;
    const avgDist = dims.reduce((sum, d) => sum + Math.abs(dimValue(a, d) - dimValue(b, d)), 0) / dims.length;
    return Math.max(0, 1 - avgDist);
}

/* ════════════════════════════ נוסחה לימודית ══════════════════════════════ */
// תצוגה נפרדת ומסומנת "לימודית". זו דוגמת סכימה (sum) שמגיעה ל-1.5,
// והיא איננה הפרופיל המנורמל (0..1) ש-Meaning Vector Live מציג. שתי תצוגות
// נפרדות בכוונה - אל תנסו לאחד את המספרים.

export interface FormulaRow {
    word: string;
    values: number[];
}

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

/* ════════════════════════════ מפת הדרכים ═════════════════════════════════ */
// פרק 4: ארבעת הצמתים הראשונים פעילים (Text, Tokens, Token IDs, Vectors),
// השאר נעולים כטיזר לפרק 5 ואילך.

export const ROADMAP_STEPS_6: { he: string; en: string; active: boolean }[] = [
    { he: 'טקסט', en: 'Text', active: true },
    { he: 'טוקנים', en: 'Tokens', active: true },
    { he: 'מזהי טוקן', en: 'Token IDs', active: true },
    { he: 'וקטורים', en: 'Vectors', active: true },
    { he: 'דמיון', en: 'Similarity', active: false },
    { he: 'ציונים', en: 'Scores', active: false },
    { he: 'הסתברויות', en: 'Probabilities', active: false },
];

/* ═══════════════════════ פונקציות עזר טהורות ═════════════════════════════ */

export function getScenario(id: string): EngineScenario | undefined {
    return SCENARIOS.find((s) => s.id === id);
}

export function defaultScenarioFor(mode: EngineMode): EngineScenario {
    return SCENARIOS.find((s) => s.mode === mode) ?? SCENARIOS[0];
}

export function scenariosFor(mode: EngineMode): EngineScenario[] {
    return SCENARIOS.filter((s) => s.mode === mode);
}

function normalize(text: string): string {
    return text.replace(/\s+/g, ' ').trimEnd();
}

/**
 * גוזר את אינדקס השלב הפעיל מתוך הטקסט שהוקלד.
 * מחזיר את השלב הגבוה ביותר שה-text שלו הוא prefix של מה שהוקלד,
 * או -1 אם עדיין לא הושלם אף שלב (מצב idle).
 */
export function activeStepIndex(scenario: EngineScenario, text: string): number {
    const norm = normalize(text);
    let idx = -1;
    scenario.steps.forEach((s, i) => {
        if (norm.length >= s.text.length && norm.startsWith(s.text)) idx = i;
    });
    return idx;
}

/** ממדי התצוגה לפי מצב. */
export function dimsForMode(mode: EngineMode): DimKey[] {
    return mode === 'agent' ? AGENT_DIMS : CHAT_DIMS;
}

/* ═══════════════════ שכבת מבנה לחוויית Embeddings העתידית ═══════════════════ */
// שכבה מבנית בלבד עבור החוויה ההיברידית העתידית: Live Meaning Map, Meaning Magnet
// ו-Meaning DNA. אין כאן UI, אין מחרוזות מתורגמות ואין טקסט גלוי. כל הנתונים מספריים
// ובלתי תלויי שפה, כך שמשפט נוחת באותו מקום בכל שש השפות. הטקסט המקומי יצורף בעתיד
// בנפרד לפי מזהה יציב. אף ייצוא קיים אינו משתנה, וצרכן פרק 6 (DIM_INFO, DIM_STYLE,
// DimKey) אינו מושפע.

/** אשכול משמעות יציב למשפט. מזהה מבני, לא טקסט תצוגה. */
export type ClusterId =
    | 'delivery-trouble'
    | 'system'
    | 'payment'
    | 'address'
    | 'agent-risk'
    | 'unrelated';

/** תפקיד המשפט בעוגן החבילות (מבני בלבד). */
export type AnchorRole = 'complaint' | 'status' | 'lost' | 'tracking' | 'refund';

/**
 * רשימת מזהי המשפטים היציבים. מקור אמת יחיד לזהויות. הוספת מזהה כאן מרחיבה את
 * SentenceId, וכך TypeScript יחייב להוסיף גם תוכן מקומי תואם (Record<SentenceId, ...>).
 */
export const SENTENCE_IDS = [
    'pkg-not-arrived',
    'delivery-not-handed',
    'pkg-arrived',
    'system-not-showing',
    'billing-address-update',
    'agent-investigate-delay',
    'agent-notify-lost',
] as const;

/** מזהה משפט יציב (איחוד ליטרלים), נגזר מ-SENTENCE_IDS. אינו מתורגם. */
export type SentenceId = typeof SENTENCE_IDS[number];

/**
 * צבע חתימה לכל משפט (מבני, לא מתורגם). hex לשרטוט וצמתים, rgb לזוהר (rgba).
 * נמנעים מגוונים ירוקים כדי שהקשר הירוק של "רכיב משותף" יישאר ייחודי ב-DNA.
 */
export const SENTENCE_COLORS: Record<SentenceId, { hex: string; rgb: string }> = {
    'pkg-not-arrived': { hex: '#22d3ee', rgb: '34,211,238' }, // ציאן
    'delivery-not-handed': { hex: '#a78bfa', rgb: '167,139,250' }, // סגול
    'pkg-arrived': { hex: '#38bdf8', rgb: '56,189,248' }, // תכלת
    'system-not-showing': { hex: '#818cf8', rgb: '129,140,248' }, // אינדיגו
    'billing-address-update': { hex: '#fbbf24', rgb: '251,191,36' }, // ענבר
    'agent-investigate-delay': { hex: '#e879f9', rgb: '232,121,249' }, // ורוד-פוקסיה
    'agent-notify-lost': { hex: '#fb7185', rgb: '251,113,133' }, // ורד
};

/** החלפת מילה: chipId ו-toId יציבים, ללא תווית מתורגמת (התווית תגיע מהמילון בעתיד). */
export interface WordSwap {
    chipId: string;
    toId: SentenceId;
}

/**
 * רשומת משפט מבנית עבור המפה, המגנט וה-DNA.
 * profile הוא וקטור מספרי בלתי תלוי שפה. אין כאן טקסט או טוקנים מקומיים.
 */
export interface SentenceStruct {
    id: SentenceId;
    profile: Profile;
    category: ClusterId;
    nearbyIds: SentenceId[];
    isAnchor: boolean;
    anchorRole?: AnchorRole;
    agent?: { mode: EngineMode; status: AgentNote['status'] };
    wordSwaps?: WordSwap[];
}

/**
 * רישום משפטים מבני קטן לשימוש עתידי. המספרים נגזרים מנתוני המנוע הקיימים
 * (SCENARIOS ו-SIMILAR_PAIR) כדי לשמור עקביות, פלוס משפט "זר" אחד רחוק להשוואה.
 * ה-id יציב ואינו מתורגם. הטקסט המקומי יצורף לפי id בקומיט נפרד.
 */
export const SENTENCE_STRUCTS: SentenceStruct[] = [
    {
        id: 'pkg-not-arrived',
        profile: { delivery: 0.95, failure: 0.85, system: 0.20, urgency: 0.40, address: 0.10, payment: 0.05 },
        category: 'delivery-trouble',
        nearbyIds: ['delivery-not-handed'],
        isAnchor: true,
        anchorRole: 'complaint',
        wordSwaps: [{ chipId: 'to-arrived', toId: 'pkg-arrived' }],
    },
    {
        id: 'delivery-not-handed',
        profile: { delivery: 0.90, failure: 0.80, system: 0.15, urgency: 0.38, address: 0.10, payment: 0.05 },
        category: 'delivery-trouble',
        nearbyIds: ['pkg-not-arrived'],
        isAnchor: true,
        anchorRole: 'status',
    },
    {
        id: 'pkg-arrived',
        profile: { delivery: 0.90, failure: 0.05, system: 0.15, urgency: 0.10, address: 0.10, payment: 0.05 },
        category: 'delivery-trouble',
        nearbyIds: [],
        isAnchor: true,
        anchorRole: 'status',
    },
    {
        id: 'system-not-showing',
        profile: { system: 0.80, delivery: 0.45, address: 0.15, payment: 0.05, urgency: 0.30, failure: 0.45 },
        category: 'system',
        nearbyIds: [],
        isAnchor: true,
        anchorRole: 'tracking',
    },
    {
        id: 'billing-address-update',
        profile: { address: 0.85, payment: 0.60, system: 0.20, delivery: 0.05, urgency: 0.10, failure: 0.05 },
        category: 'unrelated',
        nearbyIds: [],
        isAnchor: false,
    },
    {
        id: 'agent-investigate-delay',
        profile: { action: 0.85, delivery: 0.90, failure: 0.85, urgency: 0.45, risk: 0.15, system: 0.15, customer: 0.05, permission: 0.10 },
        category: 'agent-risk',
        nearbyIds: ['agent-notify-lost'],
        isAnchor: true,
        anchorRole: 'tracking',
        agent: { mode: 'agent', status: 'safe' },
    },
    {
        id: 'agent-notify-lost',
        profile: { action: 0.85, delivery: 0.80, customer: 0.90, risk: 0.85, permission: 0.90, failure: 0.70, urgency: 0.40, system: 0.05 },
        category: 'agent-risk',
        nearbyIds: ['agent-investigate-delay'],
        isAnchor: true,
        anchorRole: 'lost',
        agent: { mode: 'agent', status: 'approval' },
    },
];

/** חיפוש רשומת משפט מבנית לפי id. */
export function getSentenceStruct(id: string): SentenceStruct | undefined {
    return SENTENCE_STRUCTS.find((s) => s.id === id);
}

/* ─── Live Meaning Map: היטל קבוע מהפרופיל לקואורדינטות ──────────────────────── */
// היטל דטרמיניסטי וקבוע מפרופיל לשני צירים קריאים. תלוי אך ורק בפרופיל, ולכן יציב בין
// שפות ואינו זז כשאוסף המשפטים משתנה. הגבולות נגזרים ממשקלי הצירים (לא מאוסף המשפטים)
// כדי שקואורדינטות יישארו יציבות. זהו "צל" דו-ממדי של מרחב גדול הרבה יותר, לא המרחב האמיתי.

/** משקלי ציר X: ימין = עולם המשלוח, שמאל = מערכת ותשלום. */
export const MAP_AXIS_X: Partial<Record<DimKey, number>> = {
    delivery: 1, address: 0.6, payment: -0.7, system: -1,
};

/** משקלי ציר Y: ערך גבוה = יותר כשל וסיכון, ערך נמוך = רגוע. */
export const MAP_AXIS_Y: Partial<Record<DimKey, number>> = {
    failure: 1, urgency: 0.7, risk: 1, permission: 0.8, customer: 0.4,
};

/** ריווח שוליים ברירת מחדל בהיטל, שומר נקודות מעט בתוך הגבול. */
export const MAP_PADDING = 0.08;

/** נקודה דו-ממדית במרחב מתמטי 0..1 (ה-UI יכול להפוך את ציר Y לפי הצורך). */
export interface MapPoint2D {
    x: number;
    y: number;
}

/** טווח תיאורטי של סכום משוקלל לפי משקלי ציר (חיוביים מול שליליים). */
function axisBounds(weights: Partial<Record<DimKey, number>>): { min: number; max: number } {
    let min = 0;
    let max = 0;
    (Object.keys(weights) as DimKey[]).forEach((key) => {
        const w = weights[key] ?? 0;
        if (w > 0) max += w;
        else min += w;
    });
    return { min, max };
}

const MAP_X_BOUNDS = axisBounds(MAP_AXIS_X);
const MAP_Y_BOUNDS = axisBounds(MAP_AXIS_Y);

/** סכום משוקלל של פרופיל לפי משקלי ציר. */
function weightedAxis(profile: Profile, weights: Partial<Record<DimKey, number>>): number {
    return (Object.keys(weights) as DimKey[]).reduce(
        (sum, key) => sum + dimValue(profile, key) * (weights[key] ?? 0),
        0,
    );
}

/** מנרמל ערך גולמי לטווח [pad, 1-pad] לפי גבולות תיאורטיים קבועים. */
function normalizeAxis(raw: number, bounds: { min: number; max: number }, pad: number): number {
    const span = bounds.max - bounds.min;
    if (span <= 0) return 0.5;
    const t = Math.max(0, Math.min(1, (raw - bounds.min) / span));
    return pad + t * (1 - 2 * pad);
}

/**
 * היטל הפרופיל לנקודה דו-ממדית יציבה ב-[pad, 1-pad] על שני הצירים.
 * דטרמיניסטי, בלתי תלוי שפה, ויציב כשאוסף המשפטים משתנה.
 */
export function projectProfile(profile: Profile, pad: number = MAP_PADDING): MapPoint2D {
    return {
        x: normalizeAxis(weightedAxis(profile, MAP_AXIS_X), MAP_X_BOUNDS, pad),
        y: normalizeAxis(weightedAxis(profile, MAP_AXIS_Y), MAP_Y_BOUNDS, pad),
    };
}

/* ─── Meaning Magnet: משיכות ממדים ווקטור נטו ────────────────────────────────── */
// כל מגנט הוא ממד משמעות עם זווית קבועה בטבעת. עוצמת המשיכה היא ערך הממד בפרופיל.
// הזוויות נבחרו כך שכיוון הווקטור הנטו יהדהד בגסות את הרבע שאליו המפה ממקמת את המשפט.
// אלה מזהים יציבים, לא תוויות תצוגה.

/** מזהה מגנט יציב. */
export type MagnetId = 'delay' | 'delivery' | 'complaint' | 'tracking' | 'refund' | 'risk';

/** הגדרת מגנט: ממד מניע וזווית קבועה במעלות (0 = ימין, 90 = מעלה). */
export interface MagnetConfig {
    id: MagnetId;
    dim: DimKey;
    angle: number;
}

/** טבלת המגנטים הקבועה. id ו-dim יציבים. */
export const MAGNETS: MagnetConfig[] = [
    { id: 'delivery', dim: 'delivery', angle: 0 },
    { id: 'delay', dim: 'urgency', angle: 90 },
    { id: 'tracking', dim: 'system', angle: 180 },
    { id: 'risk', dim: 'risk', angle: 270 },
    { id: 'complaint', dim: 'customer', angle: 315 },
    { id: 'refund', dim: 'payment', angle: 225 },
];

/** עוצמת משיכת מגנט = ערך הממד שלו בפרופיל (0..1). */
export function magnetPull(profile: Profile, magnet: MagnetConfig): number {
    return dimValue(profile, magnet.dim);
}

/** וקטור נטו: רכיבי x ו-y, אורך וזווית במעלות. */
export interface NetVector {
    x: number;
    y: number;
    length: number;
    angle: number;
}

const DEG_TO_RAD = Math.PI / 180;

/**
 * סכום המשיכות כווקטור נטו. כל מגנט תורם pull בכיוון הזווית שלו.
 * דטרמיניסטי ובלתי תלוי שפה.
 */
export function netVector(profile: Profile, magnets: MagnetConfig[] = MAGNETS): NetVector {
    let x = 0;
    let y = 0;
    magnets.forEach((m) => {
        const pull = magnetPull(profile, m);
        x += pull * Math.cos(m.angle * DEG_TO_RAD);
        y += pull * Math.sin(m.angle * DEG_TO_RAD);
    });
    const length = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x) / DEG_TO_RAD;
    return { x, y, length, angle };
}

/* ─── Meaning DNA: גנים, סחיפה וגנים משותפים ─────────────────────────────────── */
// חתימת המשמעות כרצף ממדים. דמיון = גנים משותפים. drift = כמה המשמעות זזה.
// משתמש ב-visualCloseness הקיים כדי לשמור עקביות עם הטיזר הקיים.

/** הממדים שמוצגים כגנים ב-DNA. */
export const DNA_DIMS: DimKey[] = ['delivery', 'system', 'address', 'payment', 'urgency', 'failure'];

/** תוצאת השוואת DNA בין שני פרופילים. */
export interface DnaComparison {
    /** 0..1, 1 = כיוון זהה על הממדים המוצגים. */
    closeness: number;
    /** 0..1, 0 = זהה, משלים ל-closeness. */
    drift: number;
    /** מספר הגנים המשותפים (שניהם דולקים וקרובים זה לזה). */
    sharedGenes: number;
    /** סך הגנים שנבדקו. */
    totalGenes: number;
}

/**
 * משווה שני פרופילים על ממדי ה-DNA. גן נחשב משותף כששני הצדדים מעל סף הדלקה
 * וקרובים זה לזה. closeness מחושב מ-visualCloseness הקיים.
 */
export function compareDna(
    a: Profile,
    b: Profile,
    dims: DimKey[] = DNA_DIMS,
    litThreshold = 0.4,
    closeThreshold = 0.2,
): DnaComparison {
    let sharedGenes = 0;
    dims.forEach((d) => {
        const av = dimValue(a, d);
        const bv = dimValue(b, d);
        if (av >= litThreshold && bv >= litThreshold && Math.abs(av - bv) <= closeThreshold) {
            sharedGenes += 1;
        }
    });
    const closeness = visualCloseness(a, b, dims);
    return { closeness, drift: 1 - closeness, sharedGenes, totalGenes: dims.length };
}
