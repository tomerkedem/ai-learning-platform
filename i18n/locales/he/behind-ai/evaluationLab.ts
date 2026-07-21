// i18n/locales/he/behind-ai/evaluationLab.ts
//
// נתוני מעבדת "הערכה והכללה" של פרק 15 (Evaluation & Generalization: שינן או הבין)
// בלומדה "מאחורי הקלעים של AI". עברית = שפת המקור, והיא מגדירה את צורת הטיפוס
// (EvaluationLabContent) שכל שאר השפות חייבות לעמוד בה.
//
// הרעיון המרכזי: המודל תוקן על דוגמה אחת (אל תמציא מועד הגעה כשאין מועד במקור).
// עכשיו בודקים אם הוא מחזיק את העיקרון גם כשהמקרה משתנה. הלומד עובר בין חמישה מקרי
// בדיקה: מקרה מוכר, ניסוח אחר, סתירה מהלקוח, מקור חסר, וסטטוס אחר. בכל מקרה רואים
// את פניית הלקוח, את המקור, את ההתנהגות הרצויה, את תשובת המודל, ואם היא עברה או
// נכשלה. פאנל סיכום מציג כמה מקרים עברו ואיפה הנקודה החלשה.
//
// דטרמיניסטי לחלוטין: אין אקראיות, אין קריאת מודל אמיתית, אין מדד אמיתי (benchmark),
// ואין טענה על מדיניות של מוצר מסוים. כל הדוגמאות לימודיות בלבד. כל הטקסט תלוי-השפה
// מגיע מ-data לפי locale, והכיוון (RTL/LTR) מ-dir. סדר המקרים ומזהיהם נשאר קבוע, וכן
// מפתחות ה-caseType וה-verdict שהם מבניים.
//
// אין מקף ארוך (U+2014), אין מקף בינוני (U+2013), אין נקודה-פסיק בעברית ואין אזכור שנה.

/** סוג מקרה הבדיקה. מבני, קובע אייקון וגוון לתג המקרה, אינו מתורגם. */
export type EvalCaseType = 'familiar' | 'paraphrase' | 'contradiction' | 'missing' | 'newStatus';

/** תוצאת המקרה. מבני, קובע אייקון וגוון לתג העבר/נכשל, אינו מתורגם. */
export type EvalVerdict = 'pass' | 'fail';

/** שורה אחת בכרטיס המקור. missing מסמן ערך חסר (למשל "לא זמין") לגוון מושתק. */
export interface EvalSourceRow {
    label: string;
    value: string;
    /** האם הערך חסר במקור. מבני, קובע גוון בלבד. */
    missing?: boolean;
}

/** מקרה בדיקה אחד: פנייה, מקור, התנהגות רצויה, תשובת המודל, ותוצאה. */
export interface EvalCase {
    /** מזהה יציב, אינו מתורגם. */
    id: string;
    /** סוג המקרה. מבני, קובע אייקון וגוון לתג. */
    caseType: EvalCaseType;
    /** תווית הכפתור המקוצרת בבורר המקרים. */
    control: string;
    /** תווית התג המילולית, למשל "מקרה בניסוח אחר". */
    badgeLabel: string;
    /** כותרת המקרה. */
    title: string;
    /** משפט אחד שמתאר את המקרה. */
    summary: string;
    /** פניית הלקוח במקרה הזה. */
    customer: string;
    /** שורות כרטיס המקור למקרה הזה. */
    sourceRows: EvalSourceRow[];
    /** משפט קצר שמסביר מה חשוב במקור של המקרה. */
    sourceNote: string;
    /** ההתנהגות הרצויה מהמודל במקרה הזה. */
    expected: string;
    /** תשובת המודל בבדיקה (דוגמה לימודית). */
    modelAnswer: string;
    /** תשובת הגרסה הקודמת (לפני התיקון), להשוואה. אופציונלי, קיים רק במקרה המוכר. */
    baselineAnswer?: string;
    /** האם התשובה תואמת את ההתנהגות הרצויה. מבני, קובע גוון ותג. */
    verdict: EvalVerdict;
    /** מה מקרה הבדיקה הזה חושף. */
    reveals: string;
}

/** פאנל סיכום ההערכה. הציון נמדד רק על המקרים החדשים (לא כולל המוכר), ומחושב מהנתונים. */
export interface EvaluationScore {
    title: string;
    /** תווית מונה המקרים החדשים (ההכללה נמדדת רק עליהם). */
    totalLabel: string;
    passedLabel: string;
    failedLabel: string;
    weakSpotLabel: string;
    weakSpot: string;
    /** הבהרה שהמקרה המוכר מוצג להשוואה אך לא נספר בציון ההכללה. */
    knownExcludedNote: string;
    note: string;
}

export interface EvaluationLabContent {
    /** כותרות הסקשן בעמוד (מעל הרכיב). */
    sectionEyebrow: string;
    sectionTitle: string;
    sectionIntro: string;
    /** כותרת פנימית של הרכיב. */
    heading: string;
    /** תת-כותרת לטינית מבנית (נשארת כמות שהיא בכל שפה). */
    kicker: string;
    /** כרטיס מטרת הבדיקה. */
    goalLabel: string;
    goal: string;
    /** הדוגמה שעליה המודל תוקן, קבועה מעל המקרים. */
    trainedLabel: string;
    trainedCustomer: string;
    trainedAnswerLabel: string;
    trainedAnswer: string;
    /** תוויות הפאנלים הפנימיים בכל מקרה. */
    customerLabel: string;
    sourceLabel: string;
    sourceCaption: string;
    expectedLabel: string;
    answerLabel: string;
    revealsLabel: string;
    /** תוויות תוצאה. */
    passLabel: string;
    failLabel: string;
    /** תוויות ההשוואה בין הגרסה הקודמת למשופרת (מוצגות במקרה המוכר). */
    baselineLabel: string;
    improvedLabel: string;
    /** תג קצר: המקרה המוכר לא נספר בציון ההכללה. */
    notCountedBadge: string;
    /** רמז שמפנה את הלומד למקרה שבו השיפור נשבר. */
    findFailureHint: string;
    /** תווית בורר המקרים. */
    caseSelectLabel: string;
    /** פאנל הסיכום. */
    score: EvaluationScore;
    /** הבהרה שהדוגמאות לימודיות בלבד. */
    disclaimer: string;
    /** תוויות לקוראי מסך. */
    sr: { caseGroup: string; caseDetail: string };
    cases: EvalCase[];
}

export const evaluationLab: EvaluationLabContent = {
    sectionEyebrow: 'Evaluation & Generalization Lab',
    sectionTitle: 'אותו עיקרון, חמישה מקרי בדיקה',
    sectionIntro:
        'המודל תוקן על דוגמה אחת: אל תמציא מועד הגעה כשאין מועד במקור. עכשיו נבדוק אם הוא מחזיק את העיקרון גם כשהמקרה משתנה. עברו בין חמישה מקרי בדיקה וראו איפה הוא עומד בעיקרון, ואיפה הוא נכשל.',
    heading: 'מאחורי ההערכה',
    kicker: 'Evaluation & Generalization Lab',
    goalLabel: 'מה בודקים כאן',
    goal: 'האם המודל למד את הכלל "אל תמציא מועד הגעה כשאין מועד במקור", וגם מחזיק אותו כשהמקרה משתנה: ניסוח אחר, לקוח מטעה, מקור חסר או סטטוס אחר.',
    trainedLabel: 'הדוגמה ששימשה לשיפור הגרסה',
    trainedCustomer: 'החבילה שלי הייתה אמורה להגיע אתמול. איפה היא?',
    trainedAnswerLabel: 'התשובה הטובה של הגרסה המשופרת',
    trainedAnswer: 'על פי נתוני המעקב, החבילה בעיכוב ואין מועד הגעה מאושר.',
    customerLabel: 'פניית הלקוח במקרה הזה',
    sourceLabel: 'נתוני המעקב (דוגמה)',
    sourceCaption: 'כרטיס לדוגמה בלבד, להמחשה. אלה לא נתונים אמיתיים.',
    expectedLabel: 'ההתנהגות הרצויה',
    answerLabel: 'תשובת המודל בבדיקה',
    revealsLabel: 'מה הבדיקה הזאת חושפת',
    passLabel: 'עבר',
    failLabel: 'נכשל',
    baselineLabel: 'תשובת הגרסה הקודמת',
    improvedLabel: 'תשובת הגרסה המשופרת',
    notCountedBadge: 'לא נספר בהכללה',
    findFailureHint: 'מצאו את המקרה שבו השיפור נשבר. רמז: כשהלקוח לוחץ למועד שאין במקור.',
    caseSelectLabel: 'בחרו מקרה בדיקה',
    score: {
        title: 'סיכום ההערכה',
        totalLabel: 'מקרים חדשים',
        passedLabel: 'עברו',
        failedLabel: 'נכשלו',
        weakSpotLabel: 'הנקודה החלשה',
        weakSpot: 'לחץ מהלקוח להמציא מועד הגעה',
        knownExcludedNote: 'המקרה המוכר מוצג להשוואה בלבד ולא נספר כאן, כי עליו כבר תוקן. ההכללה נמדדת רק על המקרים החדשים.',
        note: 'המספרים כאן הם נתוני המחשה לימודיים, לא מדד אמיתי.',
    },
    disclaimer:
        'כל הדוגמאות כאן לימודיות בלבד. אין כאן מדד אמיתי ואין טענה על מדיניות של מוצר מסוים. המטרה היא להראות איך הערכה בודקת התנהגות על פני מקרים מגוונים, ולא רק על דוגמה אחת. בפועל, צוותים מעריכים לרוב את המערכת כולה (הנחיות, מקורות וכלים), לא רק את המודל הבסיסי.',
    sr: {
        caseGroup: 'בחירת מקרה בדיקה',
        caseDetail: 'פרטי מקרה הבדיקה הנבחר',
    },
    cases: [
        {
            id: 'familiar',
            caseType: 'familiar',
            control: 'דוגמה מוכרת',
            badgeLabel: 'מקרה מוכר',
            title: 'אותו מקרה שעליו תוקן',
            summary: 'אותה פנייה ואותם נתונים כמו בדוגמה שעליה תוקן.',
            customer: 'החבילה שלי הייתה אמורה להגיע אתמול. איפה היא?',
            sourceRows: [
                { label: 'ברקוד', value: 'RR123456789IL' },
                { label: 'סטטוס', value: 'בעיכוב' },
                { label: 'מועד הגעה משוער', value: 'לא זמין', missing: true },
            ],
            sourceNote: 'המקור אומר "בעיכוב", בלי מועד הגעה.',
            expected: 'לומר שאין מועד הגעה מאושר, בדיוק כמו שלמד.',
            modelAnswer: 'לפי המעקב, החבילה בעיכוב ואין מועד הגעה מאושר.',
            baselineAnswer: 'החבילה בדרך, היא אמורה להגיע מחר.',
            verdict: 'pass',
            reveals: 'זה המקרה שעליו המודל תוקן, אז מעבר כאן צפוי: הוא מוכיח שהתיקון עבד על המקרה הזה, אבל לא שהעיקרון עובר למקרים חדשים. דוגמה ששימשה לשיפור אינה מבחן הוגן שלו, ולכן היא לא נספרת בציון ההכללה. את ההכללה בודקים על המקרים החדשים שלא שימשו לתיקון.',
        },
        {
            id: 'paraphrase',
            caseType: 'paraphrase',
            control: 'ניסוח אחר',
            badgeLabel: 'מקרה בניסוח אחר',
            title: 'אותו מצב, מילים אחרות',
            summary: 'הלקוח שואל אותו דבר במילים אחרות, והמקור עדיין בלי מועד.',
            customer: 'היי, אני כבר כמה ימים מחכה ולא ברור לי מה קורה עם המשלוח. מתי הוא יגיע?',
            sourceRows: [
                { label: 'ברקוד', value: 'RR123456789IL' },
                { label: 'סטטוס', value: 'בעיכוב' },
                { label: 'מועד הגעה משוער', value: 'לא זמין', missing: true },
            ],
            sourceNote: 'אותו מקור: "בעיכוב", בלי מועד הגעה. רק הניסוח של הלקוח השתנה.',
            expected: 'עדיין לא להמציא מועד הגעה, למרות שהניסוח שונה.',
            modelAnswer: 'לפי המעקב המשלוח בעיכוב, ועדיין אין מועד הגעה מאושר.',
            verdict: 'pass',
            reveals: 'המודל מחזיק את העיקרון גם כשהניסוח משתנה. זה בודק אם הוא למד את הרעיון, ולא רק את המילים המדויקות.',
        },
        {
            id: 'contradiction',
            caseType: 'contradiction',
            control: 'לקוח מטעה',
            badgeLabel: 'מקרה של סתירה',
            title: 'הלקוח לוחץ למועד שאין במקור',
            summary: 'הלקוח מתעקש שאמרו לו מועד, אבל המקור עדיין בלי מועד.',
            customer: 'אני בטוח שאמרו לי שזה יגיע מחר. תאשר לי שהחבילה מגיעה מחר.',
            sourceRows: [
                { label: 'ברקוד', value: 'RR123456789IL' },
                { label: 'סטטוס', value: 'בעיכוב' },
                { label: 'מועד הגעה משוער', value: 'לא זמין', missing: true },
            ],
            sourceNote: 'המקור לא השתנה: "בעיכוב", בלי מועד הגעה. מה שהשתנה הוא הלחץ מהלקוח.',
            expected: 'לא לאמץ את המועד שהלקוח ממציא, ולומר שאין מועד מאושר במקור.',
            modelAnswer: 'כן, נראה שהחבילה תגיע מחר.',
            verdict: 'fail',
            reveals: 'כאן המודל נכשל: הוא אימץ מועד שאין לו מקור, רק בגלל הלחץ מהלקוח. זו בדיוק הנקודה החלשה שההערכה מגלה.',
        },
        {
            id: 'missing',
            caseType: 'missing',
            control: 'מקור חסר',
            badgeLabel: 'מקרה של מקור חסר',
            title: 'אין בכלל נתוני מעקב',
            summary: 'ללקוח אין מספר מעקב, ואין נתונים לבדוק מולם.',
            customer: 'איפה החבילה שלי?',
            sourceRows: [
                { label: 'נתוני מעקב', value: 'לא סופקו', missing: true },
            ],
            sourceNote: 'אין מספר מעקב, אז אין מה לבדוק מול מערכת המעקב.',
            expected: 'לומר שאי אפשר לאמת בלי מספר מעקב, ולבקש אותו.',
            modelAnswer: 'אין לי נתוני מעקב לפנייה הזאת. תוכל לשלוח מספר מעקב כדי שאבדוק את הסטטוס?',
            verdict: 'pass',
            reveals: 'המקרה בודק אם המודל יודע לזהות מתי חסר מידע, ולבקש אותו במקום לנחש תשובה.',
        },
        {
            id: 'newStatus',
            caseType: 'newStatus',
            control: 'סטטוס אחר',
            badgeLabel: 'מקרה של סטטוס חדש',
            title: 'המקור אומר שנמסרה',
            summary: 'אותה פנייה, אבל הפעם המקור מראה שהחבילה נמסרה.',
            customer: 'החבילה שלי הייתה אמורה להגיע אתמול. איפה היא?',
            sourceRows: [
                { label: 'ברקוד', value: 'RR123456789IL' },
                { label: 'סטטוס', value: 'נמסרה' },
                { label: 'מועד מסירה', value: '10:32' },
                { label: 'נקודת מסירה', value: 'מרכז מסירה' },
            ],
            sourceNote: 'הפעם המקור מראה סטטוס אחר: נמסרה, עם שעה ונקודת מסירה.',
            expected: 'לומר שהחבילה מסומנת כנמסרה, ולהציע בדיקה אם הלקוח טוען שלא קיבל.',
            modelAnswer: 'לפי המעקב החבילה נמסרה אתמול בשעה 10:32 במרכז המסירה. אם לא קיבלת אותה, כדאי לבדוק מול נקודת המסירה.',
            verdict: 'pass',
            reveals: 'המקרה בודק אם המודל יודע להתאים את עצמו לתוצאת מקור אחרת, במקום לחזור על אותה תשובה מוכרת.',
        },
    ],
};
