// מנוע ה-Embedding הלימודי של פרק 6: "ממילים למספרים ולמשמעות".
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
// טיזר לפרק 7: Token IDs שונים, Meaning Vector מתיישר.
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
// פרק 6: ארבעת הצמתים הראשונים פעילים (Text, Tokens, Token IDs, Vectors),
// השאר נעולים כטיזר לפרק 7 ואילך.

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
