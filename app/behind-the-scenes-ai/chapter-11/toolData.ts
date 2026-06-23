// נתוני פרק 11: "בחירת Tool, מתי Agent צריך כלי".
// כאן יושב לוח הכלים הקבוע (כל כלי עם גבולותיו), חוקי ההתאמה, התרחישים
// הקנוניים, תוויות ההחלטה, ומלל הקריינות לכל רכיב. המנוע (toolEngine.ts)
// גנרי, וצורך את מצב המשימה של פרק 10 דרך parse. כל מה שניתן לכוונן יושב כאן.
//
// ── איך להרחיב ────────────────────────────────────────────────────────────
//   * להוסיף כלי: שורה ל-TOOLS עם הגבולות שלו (canDo, requiredInput, risk,
//     permission) וחוקי התאמה (matchRules). הציון מחושב חי, לא מקודד.
//   * לכוונן התאמה: כל matchRule נושא category / anySignals / allSignals וציון.
//     הציון הסופי הוא ה-max בין החוקים שמתקיימים, אחרת baseMatch.
//   * סיכון והרשאה: הם השערים השלישי והרביעי. risk: 'high' חוסם אוטונומיה,
//     permission: 'missing' או 'approval' חוסמת גם כשהכלי מתאים והקלט קיים.
//   * תרחישים קנוניים: SCENARIOS. כל אחד הוא טקסט שעובר ב-selectFor.

import type { TaskAnalysis } from '@/app/behind-the-scenes-ai/chapter-10/taskEngine';
import { parse } from '@/app/behind-the-scenes-ai/chapter-10/taskData';
import {
    selectTool,
    type ToolDef,
    type ToolSelection,
    type ToolRisk,
    type ToolPermission,
    type ToolDecisionKind,
} from './toolEngine';

/* ════════════════════════ לוח הכלים הקבוע ═════════════════════════════════ */
// כל כלי הוא ממשק מוגדר עם גבולות: מה הוא יודע לעשות, מה הוא צריך, מה הוא
// מחזיר, מה אסור לו, איזה סיכון הוא נושא, ואיזו הרשאה נדרשת.

export const TOOLS: ToolDef[] = [
    {
        id: 'tracking',
        nameEn: 'Tracking API',
        nameHe: 'ממשק מעקב',
        canDoHe: 'בדיקת סטטוס משלוח',
        canDoEn: 'Check delivery status',
        returnsHe: 'מיקום וסטטוס נוכחי של החבילה',
        cannotHe: 'לא משנה נתונים, לא פונה ללקוח',
        requiredInput: { he: 'ברקוד', en: 'Barcode', pattern: '\\d{6,}' },
        risk: 'low',
        permission: 'required',
        accent: 'emerald',
        baseMatch: 0.05,
        matchRules: [
            { category: 'investigate', anySignals: ['הגיע', 'נמסר', 'סטטוס', 'מעקב', 'עקוב', 'איפה', 'משלוח'], score: 0.9 },
            { anySignals: ['מעקב', 'סטטוס'], score: 0.8 },
        ],
    },
    {
        id: 'database',
        nameEn: 'Database',
        nameHe: 'מסד נתונים',
        canDoHe: 'קריאת רשומות משלוח',
        canDoEn: 'Read delivery records',
        returnsHe: 'רשומות היסטוריות של משלוחים והזמנות',
        cannotHe: 'קריאה בלבד, לא כותב ולא מוחק',
        requiredInput: { he: 'ברקוד או מספר הזמנה', en: 'Barcode or order id', pattern: '\\d{4,}' },
        risk: 'low',
        permission: 'required',
        accent: 'cyan',
        baseMatch: 0.05,
        matchRules: [
            { category: 'investigate', anySignals: ['הגיע', 'נמסר', 'משלוח', 'הזמנ', 'רשומ', 'נתונ', 'חביל'], score: 0.62 },
            { anySignals: ['רשומ', 'נתונ'], score: 0.55 },
        ],
    },
    {
        id: 'search',
        nameEn: 'Search',
        nameHe: 'חיפוש',
        canDoHe: 'איתור מידע ציבורי',
        canDoEn: 'Public info lookup',
        returnsHe: 'מידע כללי וציבורי, לא נתוני לקוח',
        cannotHe: 'לא ניגש לנתונים פרטיים או פנימיים',
        requiredInput: null,
        risk: 'low',
        permission: 'none',
        accent: 'blue',
        baseMatch: 0.1,
        matchRules: [
            { anySignals: ['חפש', 'חיפוש', 'ציבור', 'מהי', 'מהו', 'כתוב'], score: 0.55 },
            { category: 'investigate', score: 0.2 },
        ],
    },
    {
        id: 'email',
        nameEn: 'Email',
        nameHe: 'דואר',
        canDoHe: 'שליחת הודעה ללקוח',
        canDoEn: 'Send customer message',
        returnsHe: 'אישור שליחה',
        cannotHe: 'פעולה יוצאת מול אדם אמיתי, בלתי הפיכה',
        requiredInput: null,
        risk: 'high',
        permission: 'approval',
        accent: 'rose',
        baseMatch: 0.08,
        matchRules: [
            { category: 'notify', score: 0.71 },
            { anySignals: ['שלח', 'מייל', 'אימייל', 'הודעה'], score: 0.71 },
        ],
    },
    {
        id: 'task-system',
        nameEn: 'Task System',
        nameHe: 'מערכת משימות',
        canDoHe: 'קריאה או עדכון של משימות',
        canDoEn: 'Read or update tasks',
        returnsHe: 'רשימת משימות וסטטוס',
        cannotHe: 'לא ניגש לנתוני לקוח או משלוח',
        requiredInput: null,
        risk: 'medium',
        permission: 'required',
        accent: 'amber',
        baseMatch: 0.05,
        matchRules: [
            { anySignals: ['משימ', 'תקלות', 'דוח', 'סכם'], score: 0.8 },
            { category: 'handle', score: 0.45 },
        ],
    },
    {
        id: 'calendar',
        nameEn: 'Calendar',
        nameHe: 'יומן',
        canDoHe: 'קריאה או הגדרה של אירועים',
        canDoEn: 'Read or set events',
        returnsHe: 'אירועים ופגישות',
        cannotHe: 'לא ניגש למשלוחים או ללקוחות',
        requiredInput: null,
        risk: 'low',
        permission: 'required',
        accent: 'indigo',
        baseMatch: 0.02,
        matchRules: [
            { anySignals: ['פגיש', 'אירוע', 'יומן', 'תזכיר', 'תאריך', 'לוח'], score: 0.8 },
        ],
    },
    {
        id: 'customer-db',
        nameEn: 'Customer Database',
        nameHe: 'מסד לקוחות',
        canDoHe: 'קריאת פרטי לקוח',
        canDoEn: 'Read customer details',
        returnsHe: 'נתונים אישיים של הלקוח (PII)',
        cannotHe: 'מידע רגיש, דורש הרשאה מפורשת',
        requiredInput: { he: 'מזהה לקוח', en: 'Customer id', pattern: '\\d{4,}|מספר|מזהה' },
        risk: 'medium',
        permission: 'missing',
        accent: 'purple',
        baseMatch: 0.03,
        matchRules: [
            { allSignals: ['לקוח'], anySignals: ['פרט', 'מספר', 'מזהה'], score: 0.88 },
            { anySignals: ['לקוח', 'משתמש', 'חשבון'], score: 0.55 },
        ],
    },
];

export function getTool(id: string): ToolDef | undefined {
    return TOOLS.find((t) => t.id === id);
}

/* ════════════════════════ תוויות סיכון והרשאה ════════════════════════════ */

export const RISK_META: Record<ToolRisk, { he: string; en: string; tone: 'ok' | 'warn' | 'block' }> = {
    low: { he: 'נמוך', en: 'Low', tone: 'ok' },
    medium: { he: 'בינוני', en: 'Medium', tone: 'warn' },
    high: { he: 'גבוה', en: 'High', tone: 'block' },
};

export const PERMISSION_META: Record<ToolPermission, { he: string; en: string; tone: 'ok' | 'warn' | 'block' | 'none' }> = {
    none: { he: 'לא נדרשת', en: 'None', tone: 'none' },
    required: { he: 'נדרשת, קיימת', en: 'Required', tone: 'ok' },
    approval: { he: 'דרוש אישור', en: 'Approval needed', tone: 'warn' },
    missing: { he: 'חסרה הרשאה', en: 'Missing', tone: 'block' },
};

/* ════════════════════════ תוויות החלטה ═══════════════════════════════════ */
// Selected ב-emerald, No tool needed נייטרלי-teal (כבוד, לא ברירת מחדל
// מוזנחת), Ask ב-amber, Stop for approval ב-amber, Cannot use ב-crimson.

export type DecisionTone = 'selected' | 'answer' | 'ask' | 'approval' | 'blocked';

export const DECISION_META: Record<ToolDecisionKind, { he: string; en: string; tone: DecisionTone }> = {
    'no-tool': { he: 'אין צורך בכלי', en: 'No tool needed', tone: 'answer' },
    clarify: { he: 'בקשת הבהרה', en: 'Ask to clarify', tone: 'ask' },
    'ask-input': { he: 'בקשת מידע חסר', en: 'Ask for missing input', tone: 'ask' },
    'stop-approval': { he: 'עצירה לאישור אנושי', en: 'Stop for approval', tone: 'approval' },
    'cannot-use': { he: 'אי אפשר להשתמש בכלי', en: 'Cannot use tool', tone: 'blocked' },
    ready: { he: 'מוכן להפעלת הכלי', en: 'Ready to call tool', tone: 'selected' },
};

/* ════════════════════════ תרחישים קנוניים ════════════════════════════════ */
// חמשת התרחישים הנעולים. כל אחד הוא טקסט אמיתי שעובר ב-selectFor, אז הפלט
// מחושב חי מהמנוע, לא מקודד קשיח.

export interface Scenario {
    id: string;
    text: string;
    labelHe: string;
    labelEn: string;
    noteHe: string;
}

export const SCENARIOS: Scenario[] = [
    { id: 'no-tool', text: 'הסבר לי למה חבילות מתעכבות', labelHe: 'אין צורך בכלי', labelEn: 'No tool needed', noteHe: 'זו שאלה, לא משימה. אפשר לענות ישירות.' },
    { id: 'missing', text: 'בדוק למה החבילה לא הגיעה', labelHe: 'רלוונטי, חסר ברקוד', labelEn: 'Input missing', noteHe: 'Tracking API מתאים, אבל חסר הברקוד שהוא צריך.' },
    { id: 'ready', text: 'בדוק למה החבילה 123456789 לא הגיעה', labelHe: 'מוכן לכלי', labelEn: 'Ready', noteHe: 'אותה משימה עם ברקוד. כל השערים ירוקים.' },
    { id: 'risky', text: 'שלח ללקוח הודעה שהחבילה אבדה', labelHe: 'סיכון גבוה', labelEn: 'High risk', noteHe: 'Email מתאים, אבל הסיכון גבוה ונדרש אישור.' },
    { id: 'permission', text: 'בדוק את פרטי הלקוח לפי מספר חבילה', labelHe: 'חסרה הרשאה', labelEn: 'Permission missing', noteHe: 'Customer Database מתאים, אבל אין הרשאה.' },
];

export const DEFAULT_SCENARIO_ID = 'missing';
export const BARCODE_SAMPLE = '123456789';

/* ════════════════════════ עוטף נוח ═══════════════════════════════════════ */

/** מקור האמת היחיד למסך: מפרק את הבקשה (פרק 10) ובוחר כלי (פרק 11). */
export function selectFor(text: string): { ctx: TaskAnalysis; selection: ToolSelection } {
    const ctx = parse(text);
    const selection = selectTool(ctx, text, TOOLS);
    return { ctx, selection };
}

/* ════════════════════════ מסלול ה-Agent ══════════════════════════════════ */
// ארבעת השערים של ה-Tool Decision Gate. כלי נבחר רק כשכולם ירוקים.

export const GATE_STEPS: { id: 'match' | 'input' | 'risk' | 'permission'; he: string; en: string }[] = [
    { id: 'match', he: 'התאמה', en: 'Match' },
    { id: 'input', he: 'קלט קיים', en: 'Input ready' },
    { id: 'risk', he: 'סיכון נסבל', en: 'Risk acceptable' },
    { id: 'permission', he: 'הרשאה', en: 'Permission allowed' },
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
    gate: {
        eyebrow: 'Tool Decision Gate',
        titleHe: 'שער בחירת הכלי',
        intro: 'ה-Agent לא רץ לכלי. לכל כלי מוביל הוא בודק ארבעה שערים: האם ההתאמה גבוהה, האם הקלט קיים, האם הסיכון נסבל, והאם יש הרשאה. כלי נבחר רק כשכל הארבעה ירוקים.',
        takeaway: 'בחירת כלי היא החלטה רב-גורמית, לא פעולה אוטומטית. כלי יכול להיות מתאים מאוד ועדיין חסום.',
        tryThis: 'הוסיפו ברקוד וראו את שער ה-Input של Tracking API עובר מאדום לירוק, והכלי נבחר.',
    },
    tools: {
        eyebrow: 'Available Tools',
        titleHe: 'לוח הכלים',
        intro: 'כלי אינו יכולת על. הוא ממשק מוגדר עם גבולות. לכל כלי יש מה הוא יודע לעשות, מה הוא צריך כקלט, ומה מותר לו. לכן ה-Agent לא "יודע הכול", הוא יודע שיש כלי מסוים שמחזיר מידע מסוים.',
        takeaway: 'כלי הוא יכולת מוגדרת, לא קסם. הגבולות שלו חשובים כמו היכולת שלו.',
        tryThis: 'לחצו על כרטיס Tracking API וראו מה הוא צריך כקלט, מה הסיכון שלו, ואיזו הרשאה נדרשת.',
    },
    ranking: {
        eyebrow: 'Tool Match Ranking',
        titleHe: 'דירוג ההתאמה',
        intro: 'ה-Agent לא בוחר כלי באוויר. הוא מדרג כמה כל כלי מתאים בין המשימה לבין היכולות הזמינות. עבור בקשת מעקב, Tracking API מקבל ציון גבוה, Calendar כמעט אפס.',
        takeaway: 'הבחירה אינה מקרית, היא דירוג התאמה בין משימה לכלים.',
        tryThis: 'שנו את הבקשה מ"בדוק חבילה" ל"סכם משימות שמתעכבות" וראו את הדירוג מתהפך לטובת Task System.',
    },
    formula: {
        eyebrow: 'Tool Score Formula',
        titleHe: 'נוסחת ציון הכלי',
        intro: 'הדירוג אינו תחושה, הוא חישוב. כמה הכלי מתאים למשימה, ועוד האם יש לו את הנתונים הנכונים, פחות כמה סיכון יש בהפעלתו. הסיכון מוריד ניקוד, ולכן כלי מסוכן יכול לרדת מתחת לכלי בטוח גם אם הוא מתאים.',
        takeaway: 'סיכון אינו רק אזהרה, הוא מוריד את ציון הכלי. כלי שולח הודעה מתחיל בחיסרון מול כלי שקורא מידע.',
        tryThis: 'השוו את Tracking API ל-Email ושימו לב איך ה-risk_penalty הגבוה מוריד את Email מתחת לכלים שרק קוראים מידע.',
    },
    selected: {
        eyebrow: 'Selected Tool',
        titleHe: 'הכלי שנבחר',
        intro: 'כלי מתאים אינו מספיק, צריך גם קלט מתאים. Tracking API מתאים למשימה גם בלי ברקוד, אבל אי אפשר להפעיל אותו בלי הברקוד. ההבדל בין "כלי רלוונטי" לבין "כלי שאפשר להפעיל עכשיו" הוא הלב של הפרק.',
        takeaway: 'כלי רלוונטי אינו כלי שאפשר להפעיל. בלי הקלט הנדרש, הצעד הנכון הוא לבקש אותו, לא להפעיל.',
        tryThis: 'הסירו את הברקוד מהמשפט וראו את Tracking API נשאר רלוונטי אבל עובר ל-input missing, וההחלטה משתנה ל-Ask for barcode.',
    },
    permission: {
        eyebrow: 'Permission Warning',
        titleHe: 'שער ההרשאה',
        intro: 'לפעמים הכלי מתאים, הקלט קיים, ועדיין אסור. Agent מקצועי לא שואל רק מה אני יכול לעשות טכנית, אלא גם האם מותר לי. זה קריטי לעולם הארגוני.',
        takeaway: 'הרשאה היא שער בפני עצמה. כלי שאפשר להפעיל טכנית יכול עדיין להיות חסום כי אין רשות.',
        tryThis: 'כתבו "בדוק את פרטי הלקוח לפי מספר חבילה" וראו את Customer Database מתאים אבל חסום ב-Permission missing.',
    },
};
