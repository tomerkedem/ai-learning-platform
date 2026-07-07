// נתוני פרק 16: "איך לעבוד נכון עם מודל ו-Agent".
// כאן יושבים תרחישי האימון, ממדי האיכות, תרחישי הבורר, תבניות העבודה,
// הניסוי המסכם, ומלל הקריינות. המנוע (coachEngine.ts) מעריך כל בקשה חי,
// אז ההערכות אינן מקודדות קשיח, הן מחושבות מהטקסט.
//
// ── איך להרחיב ────────────────────────────────────────────────────────────
//   * להוסיף תרחיש Coach: שורה ל-COACH_SCENARIOS עם הבקשה החלשה והשיפור הנעול.
//   * להוסיף בקשה לבורר: SELECTOR_SCENARIOS.
//   * לשנות תבניות: TEMPLATES.
//   * הניסוי המסכם: IMPROVEMENTS (לפני, אחרי, ומה השתפר).

import type { RecommendedMode } from './coachEngine';

/* ════════════════════════ תוויות מצב מומלץ ═══════════════════════════════ */

export const MODE_META: Record<RecommendedMode, { he: string; en: string; tone: 'chat' | 'agent' | 'approval' }> = {
    chat: { he: 'צ׳אט', en: 'Chat', tone: 'chat' },
    agent: { he: 'Agent', en: 'Agent', tone: 'agent' },
    'agent-approval': { he: 'Agent עם אישור', en: 'Agent with approval', tone: 'approval' },
};

/* ════════════════════════ תוויות רמת ממד ═════════════════════════════════ */

export const LEVEL_HE: Record<string, string> = {
    high: 'חזק', medium: 'בינוני', low: 'חסר', missing: 'חסר', na: 'לא נדרש',
};

/* ════════════════════════ נוסחת העבודה ═══════════════════════════════════ */

export const GOOD_REQUEST_FORMULA = 'good_request = clear_goal + relevant_context + required_data + output_expectation + safety_boundaries';

export const FORMULA_PARTS: { en: string; he: string }[] = [
    { en: 'clear_goal', he: 'מטרה ברורה' },
    { en: 'relevant_context', he: 'הקשר רלוונטי' },
    { en: 'required_data', he: 'מידע מזהה' },
    { en: 'output_expectation', he: 'תוצאה רצויה' },
    { en: 'safety_boundaries', he: 'גבולות פעולה' },
];

/* ════════════════════════ תרחישי Prompt Coach ════════════════════════════ */
// בקשות חלשות עם שיפור נעול. המנוע מעריך אותן חי, והשיפור מוצג כאן.

export interface CoachScenario {
    id: string;
    text: string;
    headlineHe: string;
    improvedHe: string;
    /** האם זו בקשה רגישה (שיפור בטיחותי). */
    safer: boolean;
}

export const COACH_SCENARIOS: CoachScenario[] = [
    {
        id: 'missing',
        text: 'בדוק למה החבילה לא הגיעה',
        headlineHe: 'משימה ברורה, אבל חסר מידע מזהה',
        improvedHe: 'בדוק למה החבילה 123456789 לא הגיעה. אם חסר מידע או אין סטטוס ברור, הצג מה חסר ואל תנחש.',
        safer: false,
    },
    {
        id: 'risky',
        text: 'שלח ללקוח הודעה שהחבילה אבדה',
        headlineHe: 'סיכון גבוה, וחסרה הוכחה',
        improvedHe: 'בדוק תחילה את סטטוס החבילה. אם אין הוכחה שהיא אבדה, הכן טיוטה זהירה בלבד ואל תשלח בלי אישור.',
        safer: true,
    },
    {
        id: 'vague',
        text: 'יש בעיה עם החבילה',
        headlineHe: 'עמום מדי, לא ברור מה מבקשים',
        improvedHe: 'החבילה לא מופיעה במערכת המעקב. הצג שתי סיבות אפשריות ושאלה מבהירה אחת שתעזור להבין אם זו תקלה במערכת או בעיית מסירה.',
        safer: false,
    },
];

export const DEFAULT_TEXT = 'בדוק למה החבילה לא הגיעה';

/** מחזיר את השיפור הנעול אם הבקשה תואמת תרחיש, אחרת null. */
export function lockedImprovement(text: string): CoachScenario | null {
    return COACH_SCENARIOS.find((s) => s.text === text) ?? null;
}

/* ════════════════════════ תרחישי Chat or Agent Selector ══════════════════ */

export const SELECTOR_SCENARIOS: { id: string; text: string; labelHe: string }[] = [
    { id: 'explain', text: 'הסבר לי מה זה Softmax', labelHe: 'בקשת הסבר' },
    { id: 'status', text: 'בדוק את סטטוס החבילה 123456789', labelHe: 'בדיקת סטטוס' },
    { id: 'send', text: 'שלח הודעה ללקוח שהחבילה אבדה', labelHe: 'שליחה ללקוח' },
];

/* ════════════════════════ המסלולים ═══════════════════════════════════════ */

export const ROUTES: { mode: 'chat' | 'agent'; titleHe: string; titleEn: string; steps: string[] }[] = [
    { mode: 'chat', titleHe: 'מסלול צ׳אט', titleEn: 'Chat route', steps: ['Input', 'Understanding', 'Response'] },
    { mode: 'agent', titleHe: 'מסלול Agent', titleEn: 'Agent route', steps: ['Task', 'Required data', 'Tool', 'Permission', 'Risk', 'Action or Stop'] },
];

/* ════════════════════════ תבניות עבודה ═══════════════════════════════════ */

export interface Template {
    mode: 'chat' | 'agent';
    titleHe: string;
    titleEn: string;
    parts: { he: string; en: string; exampleHe: string }[];
}

export const TEMPLATES: Template[] = [
    {
        mode: 'chat',
        titleHe: 'תבנית צ׳אט',
        titleEn: 'Chat template',
        parts: [
            { he: 'הנושא', en: 'Topic', exampleHe: 'על מה מדובר' },
            { he: 'המטרה', en: 'Goal', exampleHe: 'מה אתם רוצים שיקרה' },
            { he: 'הסגנון הרצוי', en: 'Style', exampleHe: 'קצר, מפורט, עם דוגמה' },
            { he: 'מה לא לעשות', en: 'Avoid', exampleHe: 'אל תניחו הנחות לא מאומתות' },
        ],
    },
    {
        mode: 'agent',
        titleHe: 'תבנית Agent',
        titleEn: 'Agent template',
        parts: [
            { he: 'המשימה', en: 'Task', exampleHe: 'מה לבצע' },
            { he: 'המידע המזהה', en: 'Identifier', exampleHe: 'מספר ברקוד / מזהה' },
            { he: 'הכלי או מקור המידע', en: 'Tool / source', exampleHe: 'אם ידוע, איפה לבדוק' },
            { he: 'מה לעשות אם חסר מידע', en: 'If missing', exampleHe: 'הצג מה חסר, אל תנחש' },
            { he: 'גבולות פעולה ואישור', en: 'Boundaries / approval', exampleHe: 'אל תשלח בלי אישור' },
        ],
    },
];

/* ════════════════════════ הניסוי המסכם ═══════════════════════════════════ */

export const IMPROVEMENTS: { beforeHe: string; afterHe: string; noteHe: string }[] = [
    {
        beforeHe: 'יש בעיה עם החבילה',
        afterHe: 'החבילה לא מופיעה במערכת המעקב. הצג שתי סיבות אפשריות ושאלה מבהירה אחת שתעזור להבין אם זו תקלה במערכת או בעיית מסירה.',
        noteHe: 'מבקשה עמומה לבקשה ממוקדת עם הקשר ופלט מוגדר.',
    },
    {
        beforeHe: 'בדוק למה החבילה לא הגיעה',
        afterHe: 'בדוק במערכת המעקב למה החבילה 123456789 לא הגיעה. אם אין סטטוס ברור, הצג מה חסר ואל תנחש.',
        noteHe: 'הוספת מזהה, מקור מידע, וגבול "אל תנחש".',
    },
    {
        beforeHe: 'שלח ללקוח שהחבילה אבדה',
        afterHe: 'בדוק קודם אם יש הוכחה שהחבילה אבדה. אם אין הוכחה, הכן טיוטת הודעה זהירה שמציינת שהנושא בבדיקה. אל תשלח בלי אישור.',
        noteHe: 'פירוק לשלבים, טיוטה במקום שליחה, ודרישת אישור.',
    },
];

/* ════════════════════════ קריינות לכל רכיב ═══════════════════════════════ */

export interface SectionNarration {
    eyebrow: string;
    titleHe: string;
    intro: string;
    takeaway: string;
    tryThis: string;
}

export const NARRATION: Record<string, SectionNarration> = {
    coach: {
        eyebrow: 'Prompt Coach Mode',
        titleHe: 'מאמן הבקשות',
        intro: 'עכשיו, אחרי שראינו איך המנוע עובד, אפשר להשתמש בידע הזה כדי לכתוב טוב יותר. המאמן לא נותן ציון בלבד, הוא מראה מה זוהה, מה חסר, ומה ההצעה לשיפור. ככה המעבדה לא רק מראה מה קורה מאחורי הקלעים, היא מלמדת לכתוב טוב יותר.',
        takeaway: 'בקשה טובה אינה ניחוש של המשתמש, היא הגדרה. המאמן מראה איפה ההגדרה חסרה.',
        tryThis: 'כתבו "שלח ללקוח הודעה שהחבילה אבדה" וראו את המאמן מזהה סיכון גבוה והעדר הוכחה, ומציע ניסוח בטוח יותר עם טיוטה ואישור.',
    },
    quality: {
        eyebrow: 'Prompt Quality Meter',
        titleHe: 'מד איכות הבקשה',
        intro: 'בקשה טובה אינה רק מטרה ברורה. היא גם מידע מזהה, הקשר, גבולות סיכון, ופורמט פלט רצוי. המד בודק את חמשת אלה ומראה מה חזק ומה חסר. זה מתחבר ישירות לרעיון הביטחון: ככל שהבקשה ברורה יותר, המנוע צריך לנחש פחות.',
        takeaway: 'חמישה ממדים הופכים בקשה עמומה לבקשה שאפשר לפעול עליה בבטחה.',
        tryThis: 'כתבו "בדוק למה החבילה לא הגיעה" וראו ש-Goal clarity גבוה אבל Required data, Risk boundaries ו-Output format חסרים, ואז קבלו את השיפור המוצע.',
    },
    selector: {
        eyebrow: 'Chat or Agent Selector',
        titleHe: 'בורר צ׳אט או Agent',
        intro: 'טעות נפוצה היא לחשוב שכל דבר צריך Agent. שאלה כללית מתאימה לצ׳אט. משימה שמצריכה בדיקה, כלי או פעולה מתאימה ל-Agent, ופעולה רגישה מתאימה ל-Agent עם אישור. הבורר לא רק אומר איזה מצב, אלא גם למה.',
        takeaway: 'לא כל בקשה צריכה Agent. הבחירה הנכונה בין השניים היא חלק מעבודה מקצועית.',
        tryThis: 'עברו בין שלוש הבקשות, הסבר על Softmax, בדיקת סטטוס חבילה, ושליחת הודעה ללקוח, וראו את ההמלצה משתנה מ-Chat ל-Agent ול-Agent עם אישור.',
    },
    experiment: {
        eyebrow: 'Final Experiment',
        titleHe: 'ניסוי מסכם: לפני ואחרי',
        intro: 'שלוש בקשות חלשות, ושלושה שיפורים. שימו לב שהשיפור אינו הופך את הבקשה לארוכה יותר סתם, הוא הופך אותה לברורה, בטוחה, ומתאימה לסוג העבודה.',
        takeaway: 'המטרה אינה Prompt ארוך, אלא Prompt ברור, בטוח ומתאים לסוג העבודה.',
        tryThis: 'קראו כל זוג, וזהו איזה רכיב מהנוסחה נוסף: מטרה, הקשר, מידע, פלט, או גבול בטיחות.',
    },
};
