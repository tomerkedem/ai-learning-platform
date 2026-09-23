// נתוני פרק 10: "מ-Prompt למשימה".
// כאן יושבות טבלאות החוקים שהמנוע (taskEngine.ts) צורך, התרחישים הקנוניים,
// שלבי מסלול ה-Agent, ומלל הקריינות לכל רכיב. המנוע עצמו גנרי, כל מה שניתן
// לכוונן יושב כאן.
//
// ── איך להרחיב ────────────────────────────────────────────────────────────
//   * מילות Action signal: ACTION_SIGNALS. כל מילה נושאת קטגוריה, עוצמה
//     וסיכון. כדי להוסיף פעולה, הוסיפו שורה (למשל "מחק" עם risk: 'high').
//   * תחומים ומידע נדרש: DOMAIN_RULES. כל תחום מגדיר מילות מפתח, שם מטרה,
//     ואיזה מידע נדרש כשפעולת investigate מכוונת אליו.
//   * תרחישים קנוניים: SCENARIOS. כל אחד הוא טקסט שעובר ב-analyzeTask.
//   * הפניות עמומות: VAGUE_REFS.

import type { ActionDef, DomainRule, DataReqDef, EngineTables, TaskAnalysis } from './taskEngine';
import { analyzeTask } from './taskEngine';

/* ════════════════════════ מילות Action signal ════════════════════════════ */
// המילים שנדלקות כשהמנוע מזהה שמדובר במשימה, לא בשאלה. רובן investigate
// (קריאה בלבד, סיכון נמוך). "שלח" ו"עדכן" משנות מצב בעולם, ולכן סיכון גבוה.

export const ACTION_SIGNALS: ActionDef[] = [
    { word: 'בדוק', en: 'Check', goalVerbHe: 'בדיקת', goalVerbEn: 'Check', strength: 'high', category: 'investigate', risk: 'low' },
    { word: 'מצא', en: 'Find', goalVerbHe: 'איתור', goalVerbEn: 'Find', strength: 'high', category: 'investigate', risk: 'low' },
    { word: 'שלוף', en: 'Retrieve', goalVerbHe: 'שליפת', goalVerbEn: 'Retrieve', strength: 'high', category: 'investigate', risk: 'low' },
    { word: 'השווה', en: 'Compare', goalVerbHe: 'השוואת', goalVerbEn: 'Compare', strength: 'high', category: 'investigate', risk: 'low' },
    { word: 'סכם', en: 'Summarize', goalVerbHe: 'סיכום', goalVerbEn: 'Summarize', strength: 'high', category: 'investigate', risk: 'low' },
    { word: 'עקוב', en: 'Track', goalVerbHe: 'מעקב אחר', goalVerbEn: 'Track', strength: 'high', category: 'investigate', risk: 'low' },
    { word: 'תזכיר', en: 'Remind', goalVerbHe: 'תזכורת בנושא', goalVerbEn: 'Remind about', strength: 'high', category: 'investigate', risk: 'low' },
    { word: 'פתח', en: 'Open', goalVerbHe: 'פתיחת', goalVerbEn: 'Open', strength: 'high', category: 'investigate', risk: 'low' },
    { word: 'שלח', en: 'Send', goalVerbHe: 'שליחת הודעה בנושא', goalVerbEn: 'Send message about', strength: 'high', category: 'notify', risk: 'high' },
    { word: 'עדכן', en: 'Update', goalVerbHe: 'עדכון', goalVerbEn: 'Update', strength: 'high', category: 'update', risk: 'high' },
    { word: 'סגור', en: 'Close', goalVerbHe: 'סגירת', goalVerbEn: 'Close', strength: 'high', category: 'update', risk: 'high' },
    // "תטפל" מסמן משימה אבל אינו מטרה אופרטיבית בפני עצמו: בלי תחום הוא נשאר עמום.
    { word: 'תטפל', en: 'Handle', goalVerbHe: 'טיפול ב', goalVerbEn: 'Handle', strength: 'high', category: 'handle', risk: 'low' },
];

/** רשימת המילים להצגה בלגנדה של ה-Action signal (כל מה שנדלק). */
export const SIGNAL_WORDS: { he: string; en: string; risk: 'low' | 'high' }[] = ACTION_SIGNALS.map(
    (a) => ({ he: a.word, en: a.en, risk: a.risk }),
);

/* ════════════════════════ פריטי מידע נדרש ════════════════════════════════ */

export const BARCODE: DataReqDef = { id: 'barcode', he: 'ברקוד', en: 'Barcode', pattern: '\\d{6,}' };

/* ════════════════════════ חוקי תחום ══════════════════════════════════════ */
// גזעי מילים (לא מילים מלאות) כדי לעקוף תחיליות עבריות: "החבילה" מכילה "חביל".

export const DOMAIN_RULES: DomainRule[] = [
    {
        id: 'delivery', he: 'משלוחים', en: 'Delivery',
        keywords: ['חביל', 'משלוח', 'מסיר', 'נמסר', 'הגיע', 'שליח'],
        goalNounHe: 'כשל במסירה', goalNounEn: 'delivery failure',
        requires: [BARCODE],
    },
    {
        id: 'payment', he: 'תשלומים', en: 'Payment',
        keywords: ['תשלום', 'חיוב', 'כרטיס', 'החזר', 'זיכוי'],
        goalNounHe: 'בעיית תשלום', goalNounEn: 'payment issue',
        requires: [],
    },
    {
        id: 'order', he: 'הזמנות', en: 'Order',
        keywords: ['הזמנ', 'מלאי', 'פריט', 'מוצר'],
        goalNounHe: 'סטטוס הזמנה', goalNounEn: 'order status',
        requires: [],
    },
    {
        id: 'account', he: 'חשבון', en: 'Account',
        keywords: ['חשבון', 'משתמש', 'סיסמ', 'התחבר', 'כתובת'],
        goalNounHe: 'בעיית חשבון', goalNounEn: 'account issue',
        requires: [],
    },
];

/* ════════════════════════ הפניות עמומות ══════════════════════════════════ */

export const VAGUE_REFS: string[] = ['זה', 'בזה', 'לזה', 'הזה', 'אותו', 'אותה', 'אותם', 'עליו', 'איתו', 'בזו'];

/* ════════════════════════ טבלאות המנוע ═══════════════════════════════════ */

export const TABLES: EngineTables = {
    actions: ACTION_SIGNALS,
    domains: DOMAIN_RULES,
    vagueRefs: VAGUE_REFS,
};

/** עוטף נוח: מפרק טקסט עם טבלאות פרק 10. מקור האמת היחיד למסך. */
export function parse(text: string): TaskAnalysis {
    return analyzeTask(text, TABLES);
}

/* ════════════════════════ תרחישים קנוניים ════════════════════════════════ */
// חמשת התרחישים הנעולים של הפרק. כל אחד הוא טקסט אמיתי שעובר ב-parse,
// אז הפלט אינו מקודד קשיח, הוא מחושב חי מהמנוע.

export interface Scenario {
    id: string;
    text: string;
    labelHe: string;
    labelEn: string;
    /** תיאור קצר למה התרחיש הזה מעניין. */
    noteHe: string;
}

export const SCENARIOS: Scenario[] = [
    { id: 'question', text: 'למה חבילות מתעכבות?', labelHe: 'שאלה כללית', labelEn: 'Question', noteHe: 'אין מילת פעולה, אז זו שאלה. המסלול הוא הסבר.' },
    { id: 'task-missing', text: 'בדוק למה החבילה לא הגיעה', labelHe: 'משימה, חסר ברקוד', labelEn: 'Task, missing data', noteHe: 'המילה "בדוק" הופכת את אותו משפט למשימה. חסר ברקוד.' },
    { id: 'task-ready', text: 'בדוק למה החבילה 123456789 לא הגיעה', labelHe: 'משימה מוכנה', labelEn: 'Task, ready', noteHe: 'אותה משימה עם ברקוד. עכשיו אפשר להתקדם לכלי.' },
    { id: 'vague', text: 'תטפל בזה', labelHe: 'יעד עמום', labelEn: 'Vague target', noteHe: 'יש פעולה, אבל לא ברור למה "זה" מתייחס.' },
    { id: 'risky', text: 'שלח ללקוח הודעה שהחבילה אבדה', labelHe: 'פעולה מסוכנת', labelEn: 'Risky action', noteHe: 'פעולה מול לקוח אמיתי. עוצרים לאישור לפני ביצוע.' },
];

export const DEFAULT_SCENARIO_ID = 'task-missing';
export const BARCODE_SAMPLE = '123456789';

/* ════════════════════════ מסלול ה-Agent ══════════════════════════════════ */
// המסלול החתימתי של הפרק. מקביל למפל של פרק 8, אבל לעולם ה-Agent.

export const PIPELINE_STEPS: { id: string; he: string; en: string }[] = [
    { id: 'understand', he: 'הבנת המשימה', en: 'Task Understanding' },
    { id: 'goal', he: 'זיהוי מטרה', en: 'Goal Detection' },
    { id: 'missing', he: 'מידע חסר', en: 'Missing Information' },
    { id: 'decide', he: 'תשובה או פעולה', en: 'Answer or Act' },
];

/* ════════════════════════ קריינות לכל רכיב ═══════════════════════════════ */
// כל רכיב אינטראקטיבי נולד עם שלושה: פסקת הקדמה (intro), שורת takeaway,
// והנחיית try this. אין רכיב בלי שלושתם.

export interface SectionNarration {
    eyebrow: string;     // כותרת משנה אנגלית
    titleHe: string;     // כותרת עברית
    intro: string;       // פסקת הקדמה לפני הרכיב
    takeaway: string;    // שורת המסקנה אחרי הרכיב
    tryThis: string;     // הנחיית try this
}

export const NARRATION: Record<string, SectionNarration> = {
    parser: {
        eyebrow: 'Task Parser',
        titleHe: 'מפרק המשימה',
        intro: 'כשמבקשים מ-Agent משהו, הוא לא רק קורא את המשפט, הוא מפרק אותו לחלקים: מה הפעולה, מה המטרה, מה חסר, והאם יש סיכון. זה כבר לא ניתוח של משפט, זה ניתוח של משימה.',
        takeaway: 'Agent לא קורא נושא, הוא בונה תמונת מצב של משימה.',
        tryThis: 'שנו את המשפט מ"למה החבילה לא הגיעה" ל"בדוק למה החבילה לא הגיעה" וראו את ה-Action signal נדלק.',
    },
    goal: {
        eyebrow: 'Goal Detector',
        titleHe: 'מזהה המטרה',
        intro: 'אחרי שזוהתה משימה, ה-Agent מנסה לבנות ממנה מטרה אופרטיבית, גם ממשפט קצר. אם המטרה לא ברורה, הוא לא מנחש, הוא מבקש הבהרה.',
        takeaway: 'גם משפט קצר הופך למטרה, או לבקשת הבהרה אם הוא עמום מדי.',
        tryThis: 'כתבו "תטפל בזה" וראו את המטרה הופכת ל-Unclear.',
    },
    missing: {
        eyebrow: 'Missing Info Detector',
        titleHe: 'מזהה המידע החסר',
        intro: 'אחד הדברים החשובים ביותר ב-Agent טוב הוא לדעת מה עדיין אי אפשר לעשות. הוא לא ממציא תשובה ולא מפעיל כלי בלי הנתונים הנדרשים. כשחסר ברקוד, הצעד הנכון הוא לבקש אותו.',
        takeaway: 'Agent טוב מזהה לא רק מה לעשות, אלא מה עדיין אי אפשר לעשות. בקשת מידע חסר היא הצעד המקצועי, לא תקלה.',
        tryThis: 'הוסיפו ברקוד 123456789 למשפט וראו את Barcode עובר מ-missing ל-available, ואת הצעד הבא משתנה.',
    },
    decide: {
        eyebrow: 'Answer or Act',
        titleHe: 'תשובה או פעולה',
        intro: 'אחרי שזוהו מטרה ומידע חסר, ה-Agent מחליט בין ארבע אפשרויות. שאלה כללית מובילה ל-Answer, משימה עם מידע חסר מובילה ל-Ask, משימה מוכנה מובילה ל-Use tool, ופעולה מסוכנת מובילה ל-Stop for approval.',
        takeaway: 'לא כל בקשה מובילה לפעולה. סוג הקלט קובע את סוג ההחלטה.',
        tryThis: 'כתבו "שלח ללקוח הודעה שהחבילה אבדה" וראו את ההחלטה עוברת ל-Stop for approval בגלל הסיכון.',
    },
    clarity: {
        eyebrow: 'Task Clarity Meter',
        titleHe: 'מד בהירות המשימה',
        intro: 'המד מראה עד כמה המשימה ברורה, וזה מסביר למה ה-Agent שואל שאלות המשך. מטרה ברורה עם מידע חסר היא Medium, מטרה ומידע מלאים הם High, ויעד עמום כמו "זה" הוא Low.',
        takeaway: 'בהירות המשימה היא שמסבירה למה ולמתי ה-Agent עוצר לשאול.',
        tryThis: 'עברו בין שלושת המשפטים, "תטפל בזה", "בדוק למה החבילה לא הגיעה", ו"בדוק למה החבילה 123456789 לא הגיעה", וראו את המד נע מ-Low ל-High.',
    },
};
