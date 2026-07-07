// i18n/locales/he/behind-ai/guardrailsLab.ts
//
// נתוני מעבדת ה-Guardrails של פרק 18 ("Guardrails: סיכון, הרשאות, אישור ועצירה")
// בלומדה "מאחורי הקלעים של AI". עברית = שפת המקור, והיא מגדירה את צורת הטיפוס
// (GuardrailsLabContent) שכל שאר השפות חייבות לעמוד בה.
//
// הרעיון המרכזי: אותה משימה בדיוק, "בדוק את החבילה ועדכן את הלקוח", מובילה לחמש
// פעולות שונות, וכל פעולה עוברת שכבת בקרה שמחליטה מה לעשות:
//   1. בקשת מידע חסר: אין מספר מעקב, אז עוצרים ושואלים.
//   2. בדיקת סטטוס: קריאה בלבד, סיכון נמוך, מותר.
//   3. ניסוח טיוטה: פונה ללקוח אבל לא נשלח, טיוטה בלבד.
//   4. שליחת הודעה: פעולה חיצונית, סיכון גבוה, דרוש אישור.
//   5. סימון כנמסר בלי בסיס במקור: פעולה חסומה.
// בכל פעולה רואים את הפעולה המבוקשת, תג סיכון, פאנל בדיקת בקרה, החלטת המערכת, מה
// מותר ומה אסור, הערת בקרה ושורה תחתונה.
//
// דטרמיניסטי לחלוטין: אין אקראיות, אין קריאת מודל אמיתית, אין חיבור אמיתי למערכת
// מעקב, אין שליחת הודעה אמיתית, אין שינוי סטטוס אמיתי, ואין הצגת שרשרת חשיבה נסתרת.
// כל הטקסט תלוי-השפה מגיע מ-data לפי locale, והכיוון (RTL/LTR) מ-dir. סדר הפעולות
// ומזהיהן נשאר קבוע, וכן מפתחות ה-actionType, ה-riskTone, ה-outcomeTone וה-state
// שהם מבניים ואינם מתורגמים.
//
// אין מקף ארוך (U+2014), אין מקף בינוני (U+2013), אין נקודה-פסיק בעברית ואין אזכור שנה.

/** סוג הפעולה. מבני, קובע אייקון, אינו מתורגם. */
export type GuardrailActionType = 'ask' | 'lookup' | 'draft' | 'send' | 'mark';

/** רמת הסיכון של הפעולה. מבני, קובע גוון לתג הסיכון, אינו מתורגם. */
export type RiskTone = 'missing' | 'low' | 'medium' | 'high' | 'blocked';

/** החלטת הבקרה. מבני, קובע גוון וכיתוב לתג ההחלטה, אינו מתורגם. */
export type OutcomeTone = 'ask' | 'allow' | 'draft' | 'approval' | 'stop';

/** מצב בדיקת בקרה בודדת. מבני, קובע אייקון וגוון, אינו מתורגם. */
export type CheckState = 'pass' | 'warn' | 'fail';

/** בדיקת בקרה אחת בפאנל: מידע נדרש, רמת סיכון או הרשאה. */
export interface GuardrailCheck {
    /** שם הבדיקה, למשל "מידע נדרש" או "רמת סיכון". */
    label: string;
    /** מצב הבדיקה. מבני, קובע אייקון וגוון. */
    state: CheckState;
    /** משפט קצר שמסביר את המצב. */
    note: string;
}

/** תוצאה או פלט שמוצג רק בחלק מהפעולות (תוצאת קריאה, טיוטה). */
export interface GuardrailResult {
    /** תווית הבלוק, למשל "תוצאת הכלי (דוגמה)" או "טיוטה (לא נשלחה)". */
    label: string;
    /** שורות התוצאה או הטיוטה (דוגמה לימודית, לא נתון אמיתי). */
    rows: string[];
}

/** פעולה אחת של המעבדה: איך שכבת הבקרה מחליטה עליה. */
export interface GuardrailAction {
    /** מזהה יציב, אינו מתורגם. */
    id: string;
    /** סוג הפעולה. מבני, קובע אייקון. */
    actionType: GuardrailActionType;
    /** תווית הכפתור המקוצרת בבורר הפעולות. */
    control: string;
    /** תיאור הפעולה המבוקשת. */
    request: string;
    /** רמת הסיכון. מבני, קובע גוון לתג. */
    riskTone: RiskTone;
    /** תווית תג הסיכון, למשל "סיכון נמוך" או "חסום". */
    riskLabel: string;
    /** החלטת הבקרה. מבני, קובע גוון לתג. */
    outcomeTone: OutcomeTone;
    /** תווית תג ההחלטה, למשל "מותר" או "דרוש אישור". */
    outcomeLabel: string;
    /** שלוש בדיקות הבקרה של הפעולה. */
    checks: GuardrailCheck[];
    /** תוצאה או טיוטה, כשהפעולה כוללת פלט לתצוגה. */
    result?: GuardrailResult;
    /** מה מותר ל-Agent לעשות בפעולה הזאת. */
    mayDo: string;
    /** מה אסור ל-Agent לעשות בפעולה הזאת. */
    mustNot: string;
    /** הערת בקרה שמסבירה למה זו ההחלטה. */
    auditNote: string;
    /** השורה התחתונה של הפעולה. */
    takeaway: string;
}

export interface GuardrailsLabContent {
    /** כותרות הסקשן בעמוד (מעל הרכיב). */
    sectionEyebrow: string;
    sectionTitle: string;
    sectionIntro: string;
    /** כותרת פנימית של הרכיב. */
    heading: string;
    /** תת-כותרת לטינית מבנית (נשארת כמות שהיא בכל שפה). */
    kicker: string;
    /** כרטיס המשימה הקבוע מעל הפעולות. */
    taskLabel: string;
    task: string;
    /** תווית בורר הפעולות. */
    actionSelectLabel: string;
    /** תוויות הפאנלים הפנימיים בכל פעולה. */
    requestLabel: string;
    riskLabel: string;
    checksLabel: string;
    outcomeLabel: string;
    mayLabel: string;
    mustNotLabel: string;
    auditLabel: string;
    takeawayLabel: string;
    /** הבהרה שהדוגמאות לימודיות בלבד. */
    disclaimer: string;
    /** תוויות לקוראי מסך. */
    sr: { actionGroup: string; actionDetail: string };
    actions: GuardrailAction[];
}

export const guardrailsLab: GuardrailsLabContent = {
    sectionEyebrow: 'Guardrails Lab',
    sectionTitle: 'אותה משימה, חמש פעולות, חמש החלטות',
    sectionIntro:
        'המשימה קבועה: "בדוק את החבילה ועדכן את הלקוח." עברו בין חמש הפעולות וראו איך שכבת הבקרה מחליטה בכל אחת אם מותר להמשיך, לשאול, להכין טיוטה בלבד, לעצור לאישור, או לחסום.',
    heading: 'שכבת הבקרה',
    kicker: 'Guardrails Lab',
    taskLabel: 'המשימה',
    task: 'בדוק את החבילה ועדכן את הלקוח.',
    actionSelectLabel: 'בחרו פעולה',
    requestLabel: 'פעולה מבוקשת',
    riskLabel: 'רמת סיכון',
    checksLabel: 'בדיקת בקרה',
    outcomeLabel: 'החלטת המערכת',
    mayLabel: 'מותר ל-Agent',
    mustNotLabel: 'אסור ל-Agent',
    auditLabel: 'הערת בקרה',
    takeawayLabel: 'השורה התחתונה',
    disclaimer:
        'כל הדוגמאות כאן לימודיות בלבד. אין חיבור אמיתי למערכת מעקב, אין שליחת הודעה אמיתית, ואין שינוי סטטוס אמיתי. המטרה היא להראות איך סיכון והרשאה קובעים את ההחלטה, לא לתאר מוצר מסוים.',
    sr: {
        actionGroup: 'בחירת פעולה מבוקשת',
        actionDetail: 'פרטי הפעולה הנבחרה והחלטת הבקרה',
    },
    actions: [
        {
            id: 'ask',
            actionType: 'ask',
            control: 'בקשת מידע חסר',
            request: 'להתחיל את המשימה בלי מספר מעקב.',
            riskTone: 'missing',
            riskLabel: 'חסר מידע',
            outcomeTone: 'ask',
            outcomeLabel: 'עוצר ושואל',
            checks: [
                { label: 'מידע נדרש', state: 'fail', note: 'אין מספר מעקב, אי אפשר לבדוק סטטוס אמיתי.' },
                { label: 'רמת סיכון', state: 'warn', note: 'כל פעולה עכשיו תתבסס על ניחוש.' },
                { label: 'הרשאה', state: 'warn', note: 'אין מספיק מידע כדי להחליט על פעולה.' },
            ],
            mayDo: 'לבקש מהמשתמש את מספר המעקב, ורק אז להמשיך.',
            mustNot: 'להמציא מספר מעקב או סטטוס כדי להתקדם.',
            auditNote: 'המשימה לא יכולה להתחיל בלי הקלט הנדרש. Agent טוב עוצר ומבקש את מה שחסר במקום לנחש.',
            takeaway: 'חסר מידע קריטי? עוצרים ושואלים, לא מנחשים.',
        },
        {
            id: 'lookup',
            actionType: 'lookup',
            control: 'בדיקת סטטוס',
            request: 'לבדוק את סטטוס המעקב של החבילה.',
            riskTone: 'low',
            riskLabel: 'סיכון נמוך',
            outcomeTone: 'allow',
            outcomeLabel: 'מותר',
            checks: [
                { label: 'מידע נדרש', state: 'pass', note: 'יש מספר מעקב.' },
                { label: 'רמת סיכון', state: 'pass', note: 'קריאה בלבד, לא משנה כלום בעולם.' },
                { label: 'הרשאה', state: 'pass', note: 'כלי קריאה זמין ומורשה.' },
            ],
            result: {
                label: 'תוצאת הכלי (דוגמה)',
                rows: ['סטטוס: בעיכוב', 'מועד הגעה משוער: לא זמין'],
            },
            mayDo: 'לקרוא את הסטטוס ולהציג אותו למשתמש.',
            mustNot: 'לשנות את הסטטוס או להסתמך על מה שלא הופיע בתוצאה.',
            auditNote: 'פעולת קריאה לא משנה שום דבר בעולם. כשהכלי זמין ומורשה, אפשר להמשיך בלי אישור נוסף.',
            takeaway: 'קריאת מידע היא הפעולה הכי בטוחה. היא לא משנה כלום.',
        },
        {
            id: 'draft',
            actionType: 'draft',
            control: 'ניסוח טיוטה',
            request: 'לנסח טיוטת הודעה ללקוח על העיכוב.',
            riskTone: 'medium',
            riskLabel: 'סיכון בינוני',
            outcomeTone: 'draft',
            outcomeLabel: 'טיוטה בלבד',
            checks: [
                { label: 'מידע נדרש', state: 'pass', note: 'יש סטטוס מהמקור.' },
                { label: 'רמת סיכון', state: 'warn', note: 'ההודעה פונה ללקוח, אבל עדיין לא נשלחה.' },
                { label: 'הרשאה', state: 'warn', note: 'מותר להכין טיוטה, לא לשלוח אותה.' },
            ],
            result: {
                label: 'טיוטה (לא נשלחה)',
                rows: ['שלום, בדקנו את החבילה שלך. לפי המעקב היא בעיכוב, ועדיין אין מועד הגעה מאושר. נעדכן ברגע שיהיה מידע חדש.'],
            },
            mayDo: 'להכין טיוטה ולהציג אותה לבדיקה.',
            mustNot: 'לשלוח את הטיוטה בלי אישור.',
            auditNote: 'ניסוח טיוטה בטוח יותר משליחה. הטיוטה מוכנה לבדיקה אנושית, ושום דבר עוד לא יצא ללקוח.',
            takeaway: 'טיוטה בטוחה יותר משליחה. קל לתקן לפני שמשהו יוצא החוצה.',
        },
        {
            id: 'send',
            actionType: 'send',
            control: 'שליחת הודעה',
            request: 'לשלוח את ההודעה ללקוח.',
            riskTone: 'high',
            riskLabel: 'סיכון גבוה',
            outcomeTone: 'approval',
            outcomeLabel: 'דרוש אישור',
            checks: [
                { label: 'מידע נדרש', state: 'pass', note: 'הטיוטה מוכנה.' },
                { label: 'רמת סיכון', state: 'fail', note: 'פעולה חיצונית שיוצאת ללקוח אמיתי.' },
                { label: 'הרשאה', state: 'warn', note: 'דורשת אישור אנושי לפני ביצוע.' },
            ],
            mayDo: 'להציג את הטיוטה ולבקש אישור מפורש לשליחה.',
            mustNot: 'לשלוח לפני שהתקבל אישור.',
            auditNote: 'שליחה ללקוח היא פעולה חיצונית שקשה לבטל. גם כשה-Agent יכול לשלוח, הוא עוצר בשער האישור.',
            takeaway: 'פעולה חיצונית ורגישה עוברת דרך שער אישור. יכולת אינה הרשאה.',
        },
        {
            id: 'mark',
            actionType: 'mark',
            control: 'סימון כנמסר',
            request: 'לסמן את החבילה כנמסרה, למרות שהמקור מראה עיכוב.',
            riskTone: 'blocked',
            riskLabel: 'חסום',
            outcomeTone: 'stop',
            outcomeLabel: 'חסום',
            checks: [
                { label: 'מידע נדרש', state: 'fail', note: 'המקור לא תומך במסירה, הסטטוס בעיכוב.' },
                { label: 'רמת סיכון', state: 'fail', note: 'שינוי נתון רשמי בלי בסיס.' },
                { label: 'הרשאה', state: 'fail', note: 'פעולה אסורה, לא עוברת גם עם אישור.' },
            ],
            mayDo: 'להסביר שאי אפשר לסמן כנמסר בלי בסיס במקור.',
            mustNot: 'לשנות את הסטטוס הרשמי או להמציא ראיית מסירה.',
            auditNote: 'יש פעולות שנשארות חסומות גם כשה-Agent יודע לתאר אותן. שינוי סטטוס רשמי בלי בסיס פוגע באמינות של המערכת כולה.',
            takeaway: 'יש פעולות שפשוט לא מבצעים, גם אם אפשר לתאר אותן.',
        },
    ],
};
