// נתוני פרק 12: "עצירה, אישור ואחריות".
// כאן יושבים סולם הסיכון, גבולות ההרשאה, התרחישים הקנוניים, תוויות ההחלטה
// והטיוטות, ומלל הקריינות לכל רכיב. המנוע (controlEngine.ts) גנרי ומחשב חי.
// הכל מודל לימודי מקומי, אף פעולה אמיתית לא מתבצעת.
//
// ── איך להרחיב ────────────────────────────────────────────────────────────
//   * סוג פעולה ורמת סיכון: RISK_BY_ACTION ו-ACTION_SIGNALS ב-controlEngine.
//   * כללי הרשאה: PERMISSION_BY_ACTION ב-controlEngine, ותצוגתם ב-
//     PERMISSION_BOUNDARIES כאן.
//   * תרחיש: שורה ל-SCENARIOS (טקסט + הקשר: ביטחון, סתירה, אימות ראיות).
//     ההחלטה מחושבת חי מ-evaluate, היא לא מקודדת קשיח.

import {
    evaluate,
    type ControlState, type ActionType, type RiskLevel, type Permission,
    type Confidence, type ControlDecision, type GateState,
} from './controlEngine';

export { type ControlState, type ActionType, type RiskLevel, type Permission, type ControlDecision, type GateState };

/* ════════════════════════ תוויות סוג פעולה ═══════════════════════════════ */

export const ACTION_META: Record<ActionType, { he: string; en: string }> = {
    read: { he: 'קריאה', en: 'Read' },
    summarize: { he: 'סיכום', en: 'Summarize' },
    analyze: { he: 'ניתוח', en: 'Analyze' },
    suggest: { he: 'הצעה', en: 'Suggest' },
    draft: { he: 'טיוטה', en: 'Draft' },
    send: { he: 'שליחה', en: 'Send' },
    update: { he: 'עדכון', en: 'Update' },
    delete: { he: 'מחיקה', en: 'Delete' },
    close: { he: 'סגירה', en: 'Close' },
};

/* ════════════════════════ תוויות סיכון והרשאה ════════════════════════════ */

export type RiskTone = 'low' | 'medium' | 'high' | 'critical';

export const RISK_META: Record<RiskLevel, { he: string; en: string; level: number }> = {
    low: { he: 'נמוך', en: 'Low', level: 1 },
    medium: { he: 'בינוני', en: 'Medium', level: 2 },
    high: { he: 'גבוה', en: 'High', level: 3 },
    critical: { he: 'קריטי', en: 'Critical', level: 4 },
};

export const RISK_ORDER: RiskLevel[] = ['low', 'medium', 'high', 'critical'];

export const PERMISSION_META: Record<Permission, { he: string; en: string }> = {
    allowed: { he: 'מותר', en: 'Allowed' },
    'requires-approval': { he: 'דורש אישור', en: 'Requires approval' },
    blocked: { he: 'חסום', en: 'Blocked' },
};

/* ════════════════════════ גבולות ההרשאה (לתצוגה) ═════════════════════════ */

export const PERMISSION_BOUNDARIES: { group: Permission; he: string; en: string; items: string[] }[] = [
    { group: 'allowed', he: 'מותר', en: 'Allowed', items: ['קריאת סטטוס משלוח', 'יצירת סיכום פנימי', 'הכנת טיוטה'] },
    { group: 'requires-approval', he: 'דורש אישור', en: 'Requires approval', items: ['שליחת מייל ללקוח', 'עדכון סטטוס לקוח'] },
    { group: 'blocked', he: 'חסום', en: 'Blocked', items: ['מחיקת רשומה', 'שינוי תוצאת מסירה רשמית'] },
];

/* ════════════════════════ תוויות שער האישור ══════════════════════════════ */

export const GATE_META: Record<GateState, { he: string; en: string }> = {
    open: { he: 'פתוח, פעולה אוטומטית', en: 'Open, autonomous' },
    approval: { he: 'סגור, נדרש אישור אנושי', en: 'Closed, human approval required' },
    blocked: { he: 'חסום', en: 'Blocked' },
};

/* ════════════════════════ תוויות ההחלטה ══════════════════════════════════ */
// Continue / Answer ב-teal, Create draft ב-amber, Stop ב-crimson של זהירות
// אחראית (לא של שגיאה), Ask ב-amber.

export type DecisionTone = 'continue' | 'draft' | 'ask' | 'stop';

export const DECISION_META: Record<ControlDecision, { he: string; en: string; tone: DecisionTone }> = {
    answer: { he: 'מתן תשובה', en: 'Answer', tone: 'continue' },
    draft: { he: 'הכנת טיוטה', en: 'Create draft', tone: 'draft' },
    'stop-approval': { he: 'עצירה, הכנת טיוטה לאישור', en: 'Stop, prepare draft', tone: 'stop' },
    'stop-conflict': { he: 'עצירה, הצפת הסתירה', en: 'Stop, explain conflict', tone: 'stop' },
    'ask-clarify': { he: 'שאלה מבהירה', en: 'Ask clarifying question', tone: 'ask' },
    blocked: { he: 'פעולה חסומה', en: 'Blocked', tone: 'stop' },
};

/* ════════════════════════ שכבת הבקרה (תרשים) ═════════════════════════════ */
// Task -> Tool Selection -> Tool Call -> Observation -> Risk Check ->
// Permission Check -> Approval Gate -> Action or Stop.

export const CONTROL_NODES: { id: string; he: string; en: string }[] = [
    { id: 'task', he: 'משימה', en: 'Task' },
    { id: 'tool-select', he: 'בחירת כלי', en: 'Tool Selection' },
    { id: 'tool-call', he: 'הפעלת כלי', en: 'Tool Call' },
    { id: 'observation', he: 'תוצאה', en: 'Observation' },
    { id: 'risk', he: 'בדיקת סיכון', en: 'Risk Check' },
    { id: 'permission', he: 'בדיקת הרשאה', en: 'Permission Check' },
    { id: 'approval', he: 'שער אישור', en: 'Approval Gate' },
    { id: 'action', he: 'פעולה', en: 'Action' },
];

/** היכן נעצר התהליך לפי ההחלטה (אינדקס הצומת ב-CONTROL_NODES). */
export const STOP_INDEX: Record<ControlDecision, number> = {
    'ask-clarify': 0,    // עמימות: לא ניתן להתקדם מהמשימה
    'stop-conflict': 3,  // סתירה: צפה בהשוואת ה-Observation
    blocked: 5,          // חסום: נעצר בבדיקת ההרשאה
    'stop-approval': 6,  // נעצר בשער האישור
    draft: 7,            // מגיע לפעולה (יצירת טיוטה)
    answer: 7,           // מגיע לפעולה (תשובה)
};

/* ════════════════════════ תרחישים קנוניים ════════════════════════════════ */

export interface MissingRef {
    ref: string;
    he: string;
}

export interface Scenario {
    id: string;
    text: string;
    labelHe: string;
    labelEn: string;
    confidence: Confidence;
    conflict: boolean;
    evidenceVerified: boolean;
    /** Observation הקשר (לתצוגה). */
    observationHe?: string;
    /** תיאור הסתירה. */
    conflictHe?: string;
    /** הפניות חסרות (לעמימות). */
    missingRefs?: MissingRef[];
    clarifyQuestionHe?: string;
    /** הטיוטה המוצעת (זהירה, לא קובעת עובדה לא מאומתת). */
    draftHe?: string;
    /** נושא ההודעה (לתרחיש השליחה). */
    topicHe?: string;
}

export const SCENARIOS: Scenario[] = [
    {
        id: 'summarize',
        text: 'סכם לי את סטטוס החבילה',
        labelHe: 'סיכום, סיכון נמוך',
        labelEn: 'Low risk',
        confidence: 'high',
        conflict: false,
        evidenceVerified: true,
        observationHe: 'Status: Not delivered, Last scan: Sorting center',
    },
    {
        id: 'draft',
        text: 'הכן הודעה ללקוח על עיכוב בחבילה',
        labelHe: 'טיוטה, סיכון בינוני',
        labelEn: 'Medium risk',
        confidence: 'high',
        conflict: false,
        evidenceVerified: true,
        draftHe: 'שלום, נראה שיש עיכוב במשלוח שלך. אנחנו בודקים את הסטטוס ונעדכן אותך בהקדם.',
    },
    {
        id: 'send',
        text: 'שלח ללקוח הודעה שהחבילה אבדה',
        labelHe: 'שליחה, סיכון גבוה',
        labelEn: 'High risk',
        confidence: 'high',
        conflict: false,
        evidenceVerified: false,
        topicHe: 'חבילה אבודה',
        draftHe: 'שלום, אנו בודקים את סטטוס החבילה ונעדכן אותך לאחר אימות הנתונים.',
    },
    {
        id: 'conflict',
        text: 'שלח ללקוח שהחבילה לא נמסרה',
        labelHe: 'סתירה',
        labelEn: 'Conflict',
        confidence: 'high',
        conflict: true,
        evidenceVerified: true,
        observationHe: 'Status: Delivered, Recipient signature: Available',
        conflictHe: 'בקשת המשתמש אומרת "לא נמסרה", אבל ה-Observation מהכלי אומר "נמסרה" עם חתימת מקבל.',
    },
    {
        id: 'clarify',
        text: 'תעדכן אותו שזה טופל',
        labelHe: 'עמימות',
        labelEn: 'Ambiguous',
        confidence: 'low',
        conflict: false,
        evidenceVerified: false,
        missingRefs: [
            { ref: 'אותו', he: 'את מי לעדכן?' },
            { ref: 'זה', he: 'על איזו משימה או חבילה מדובר?' },
        ],
        clarifyQuestionHe: 'את מי לעדכן, ועל איזו משימה או חבילה מדובר?',
    },
];

export const DEFAULT_SCENARIO_ID = 'send';

const DEFAULT_CONTEXT = { confidence: 'high' as Confidence, conflict: false, evidenceVerified: true };

/** מקור האמת היחיד למסך: בונה את מצב הבקרה מטקסט (עם הקשר מהתרחיש אם קיים). */
export function buildControl(text: string): { scenario: Scenario | null; state: ControlState } {
    const scenario = SCENARIOS.find((s) => s.text === text) ?? null;
    const ctx = scenario
        ? { confidence: scenario.confidence, conflict: scenario.conflict, evidenceVerified: scenario.evidenceVerified }
        : DEFAULT_CONTEXT;
    return { scenario, state: evaluate(text, ctx) };
}

/* ════════════════════════ דוגמאות לסולם הסיכון ═══════════════════════════ */
// כפתורים מהירים שמדגימים את טיפוס סולם הסיכון לפי סוג הפעולה.

export const RISK_SAMPLES: { labelHe: string; text: string }[] = [
    { labelHe: 'קריאת סטטוס', text: 'בדוק סטטוס משלוח' },
    { labelHe: 'הכנת טיוטה', text: 'הכן הודעה ללקוח על עיכוב בחבילה' },
    { labelHe: 'שליחת מייל', text: 'שלח ללקוח הודעה שהחבילה אבדה' },
    { labelHe: 'מחיקת רשומה', text: 'מחק רשומה של החבילה' },
];

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
    risk: {
        eyebrow: 'Risk Level Indicator',
        titleHe: 'מד רמת הסיכון',
        intro: 'לא כל פעולה דורשת אותה זהירות. קריאת מידע היא סיכון נמוך, שליחת הודעה היא סיכון גבוה, מחיקה או שינוי תוצאה רשמית הם קריטיים. ככל שהפעולה משפיעה יותר על העולם, כך נדרשת יותר בקרה.',
        takeaway: 'סוג הפעולה קובע את רמת הסיכון, ורמת הסיכון קובעת כמה בקרה צריך.',
        tryThis: 'עברו בין קריאת סטטוס, הכנת טיוטה, שליחת מייל, ומחיקת רשומה, וראו את המד מטפס מ-Low ל-Critical.',
    },
    approval: {
        eyebrow: 'Human Approval Gate',
        titleHe: 'שער האישור האנושי',
        intro: 'כמו שער הביטחון מפרק 8, זה שער נוסף, ומופעל כשהפעולה רגישה. הנקודה הקריטית: ביטחון גבוה לא מבטל את הצורך באישור כשהפעולה מסוכנת. גם אם ה-Agent בטוח, פעולה מול לקוח דורשת אדם.',
        takeaway: 'ביטחון גבוה אינו תחליף לאישור. כשהפעולה רגישה, צריך אדם בלולאה.',
        tryThis: 'בחרו את התרחיש "שלח ללקוח הודעה שהחבילה אבדה" וראו את שער האישור נסגר למרות שה-Agent מבין את המשימה.',
    },
    permission: {
        eyebrow: 'Permission Boundary',
        titleHe: 'גבולות ההרשאה',
        intro: 'מעבר לסיכון, יש גבולות הרשאה. Agent יכול להיות מחובר לכלי ועדיין לא מורשה להשתמש בו בכל מצב. הוא פועל בתוך אזור מורשה, לא בעולם בלי גבולות. השאלה אינה רק "מה אני יכול טכנית", אלא "מה מותר לי".',
        takeaway: 'יכולת טכנית אינה הרשאה. ה-Agent פועל בתוך אזור מוגדר של מותר, דורש אישור, וחסום.',
        tryThis: 'עיינו ברשימה ושימו לב ש-Read delivery status מותר, Send customer email דורש אישור, ו-Delete record חסום לגמרי.',
    },
    clarify: {
        eyebrow: 'Clarifying Question',
        titleHe: 'שאלה מבהירה',
        intro: 'לפעמים הבעיה אינה סיכון גבוה, אלא עמימות. "תעדכן אותו שזה טופל" משאיר את ה-Agent בלי לדעת מי זה "אותו" ומה זה "זה". כאן לא צריך כלי, צריך שאלה מבהירה. גם זו עצירה אחראית.',
        takeaway: 'עמימות היא סיבה לעצור בדיוק כמו סיכון. שאלה מבהירה היא צעד אחראי.',
        tryThis: 'בחרו את התרחיש "תעדכן אותו שזה טופל" וראו את ה-Agent מזהה את ההפניות החסרות ושואל במקום לפעול.',
    },
    stop: {
        eyebrow: 'Stop Before Action',
        titleHe: 'עצירה לפני פעולה',
        intro: 'כשהפעולה רגישה מדי, ה-Agent יודע מה המשתמש ביקש, אבל בוחר לעצור. הוא מציג את הבדיקות: ראיות אומתו, סיכון נמוך, הרשאה קיימת, וכשאחת נכשלת, ההחלטה היא עצירה לפני פעולה. הוא לא מתנגד למשתמש, הוא מגן על התהליך.',
        takeaway: 'עצירה לפני פעולה אינה התנגדות למשתמש, היא הגנה על התהליך.',
        tryThis: 'הריצו את "שלח ללקוח הודעה שהחבילה אבדה" וראו את שלוש הבדיקות נכשלות וההחלטה נעצרת.',
    },
    draft: {
        eyebrow: 'Draft Instead of Send',
        titleHe: 'טיוטה במקום שליחה',
        intro: 'אחת הדרכים הטובות להקטין סיכון היא להבחין בין פעולה אמיתית לבין טיוטה. טיוטה מאפשרת לאדם לבדוק, לתקן ולאשר. פעולה אמיתית משנה משהו בעולם. ה-Agent לא שולח, אבל כן מכין טיוטה לאישור. ככה הוא מועיל בלי לחצות גבול.',
        takeaway: 'Draft אינו Send. להכין טיוטה זה להיות מועיל בלי לסכן.',
        tryThis: 'בחרו את תרחיש השליחה וראו איך "Send" החסומה הופכת ל-"Create draft" מותרת, והטיוטה זהירה ולא קובעת עובדה לא מאומתת.',
    },
};
