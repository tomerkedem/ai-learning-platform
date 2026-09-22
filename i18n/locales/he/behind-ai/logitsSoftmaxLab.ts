// i18n/locales/he/behind-ai/logitsSoftmaxLab.ts
//
// נתוני מעבדת Logits ו-Softmax של פרק 8 (Logits & Softmax), עברית = שפת המקור.
//
// הרעיון המרכזי: לפני שהמודל בוחר את ההמשך, הוא נותן לכל אפשרות ציון גולמי (logit).
// Softmax הופך את הציונים האלה להתפלגות הסתברות: כל המשך מקבל אחוז, והם מסתכמים
// ל-100. שינוי נתון הקשר מזיז את הציונים, ולכן גם את האחוזים. הלומד יכול גם לכוון
// ידנית כל ציון ולראות את ההסתברויות משתנות מיד.
//
// כל הציונים והאחוזים הם המחשה לימודית בלבד, לא פלט אמיתי של מודל. ההמשכים מוצגים
// כביטויים שלמים לנוחות הקריאה, אבל הם מייצגים תחרות על הטוקן הבא, לא עקבה פנימית.
//
// i18n: כל הטקסט והנתונים תלויי-השפה (continuations, contexts, labels) מגיעים מ-data
// לפי locale. חישוב ה-Softmax, מיפוי הגוונים והכיוון (RTL/LTR) נשארים ברכיב.
//
// אין מקף ארוך (U+2014), אין מקף בינוני (U+2013) ואין נקודה-פסיק בעברית.

/** המשך אפשרי בודד מתוך כמה מתחרים. */
export interface LabContinuation {
    /** מזהה יציב, אינו מתורגם. */
    id: string;
    /** תווית ההמשך, למשל "מעונן". */
    label: string;
}

/** נתון הקשר שאפשר לבחור. כל נתון קובע ציון גולמי אחר לכל המשך. */
export interface LabContext {
    /** מזהה יציב, אינו מתורגם. */
    id: string;
    /** תווית הכפתור. */
    control: string;
    /** תוספת ההקשר שנכנסת לפרומפט לפני "מזג האוויר היום כנראה...". ריק במצב הנייטרלי. */
    promptExtra?: string;
    /** הסבר קצר: למה הנתון הזה מזיז את הציונים. */
    note: string;
    /** מיפוי מזהה המשך אל הציון הגולמי שלו במצב הזה (המחשה לימודית). */
    scores: Record<string, number>;
}

export interface LogitsSoftmaxLabContent {
    /** כותרות הסקשן בעמוד (מעל הרכיב). */
    sectionEyebrow: string;
    sectionTitle: string;
    sectionIntro: string;
    /** כותרת פנימית של הרכיב. */
    heading: string;
    /** תת-כותרת לטינית מבנית (נשארת כמות שהיא בכל שפה). */
    kicker: string;
    /** תחילת המשפט שהמודל משלים. */
    promptBase: string;
    promptLabel: string;
    pickContextLabel: string;
    scoreLabel: string;
    probabilityLabel: string;
    topLabel: string;
    adjustTitle: string;
    adjustHint: string;
    resetScores: string;
    softmaxNoteTitle: string;
    softmaxNote: string;
    continuationNote: string;
    disclaimer: string;
    /** תוויות לקוראי מסך. */
    sr: { increase: string; decrease: string; contextGroup: string };
    continuations: LabContinuation[];
    contexts: LabContext[];
}

export const logitsSoftmaxLab: LogitsSoftmaxLabContent = {
    sectionEyebrow: 'Logits & Softmax Lab',
    sectionTitle: 'שנו את ההקשר או את הציונים, וראו את ההסתברויות זזות',
    sectionIntro:
        'אותה תחילת משפט, כמה המשכים אפשריים. כל המשך מקבל ציון גולמי, ו-Softmax הופך את הציונים לאחוזים שמסתכמים ל-100. בחרו נתון הקשר, או כוונו את הציונים בעצמכם, וראו מי מוביל ובכמה.',
    heading: 'מציונים גולמיים להסתברויות',
    kicker: 'Logits & Softmax Lab',
    promptBase: 'מזג האוויר היום כנראה...',
    promptLabel: 'הפרומפט המלא',
    pickContextLabel: 'בחרו נתון הקשר',
    scoreLabel: 'ציון גולמי',
    probabilityLabel: 'הסתברות',
    topLabel: 'המוביל כרגע',
    adjustTitle: 'כוונו את הציונים בעצמכם',
    adjustHint: 'לחצו על הפלוס או המינוס כדי לשנות ציון של המשך. שימו לב איך האחוזים מגיבים מיד.',
    resetScores: 'החזירו לציוני ההקשר',
    softmaxNoteTitle: 'איך ציונים הופכים לאחוזים',
    softmaxNote:
        'החלוקה אינה יחס ישר של הציונים. ציונים 4, 3, 2, 1 לא הופכים ל-40, 30, 20, 10 אחוז, אלא בקירוב ל-64, 24, 9, 3. הסיבה: Softmax קודם מעביר כל ציון דרך פעולה מעריכית (אקספוננט) שהופכת אותו למשקל חיובי ומגדילה את הפערים היחסיים, ואז מחלק כל משקל בסכום הכולל. לכן פער קטן בציון יכול לפתוח פער ניכר באחוזים, ושינוי קטן בהקשר כבר מזיז את התמונה.',
    continuationNote:
        'ההמשכים מוצגים כאן כביטויים שלמים כדי שיהיה קל לקרוא. בפועל המודל מדרג את הטוקן הבא צעד אחר צעד. זו המחשה של אותה תחרות, לא עקבה פנימית מדויקת של המודל. וזכרו שאלה רק כמה המשכים אפשריים מתוך רבים. במודל אמיתי החישוב נעשה על אוצר מילים גדול בהרבה.',
    disclaimer:
        'הציונים והאחוזים כאן הם המחשה לימודית, לא פלט אמיתי של מודל. כאן הגבלנו את הציון לטווח נוח להשוואה, אבל ציון אמיתי יכול להיות כל מספר, גם שלילי. הם נועדו להראות איך ציונים הופכים להסתברויות, ואיך ההקשר מזיז אותן. ציון גבוה אומר שההמשך סביר יותר לפי הטקסט, לא שהוא נכון בעולם.',
    sr: {
        increase: 'העלו את הציון של',
        decrease: 'הורידו את הציון של',
        contextGroup: 'בחירת נתון הקשר',
    },
    continuations: [
        { id: 'delayed', label: 'מעונן' },
        { id: 'delivered', label: 'שמשי' },
        { id: 'pickup', label: 'גשום' },
        { id: 'lost', label: 'סוער' },
    ],
    contexts: [
        {
            id: 'neutral',
            control: 'בלי נתון נוסף',
            note: 'בלי נתון נוסף, "מעונן" מקבל את הציון הגבוה ביותר. הציונים קרובים זה לזה, אבל Softmax כבר פורש את ההסתברויות בפער ניכר. עדיין מדובר בהערכה, לא בידיעה.',
            scores: { delayed: 4, delivered: 3, pickup: 2, lost: 1 },
        },
        {
            id: 'delay',
            control: 'מעונן מהבוקר',
            promptExtra: 'השמיים אפורים ומעוננים כבר מהבוקר המוקדם.',
            note: 'הרמז "מעונן מהבוקר" מחזק את "מעונן" ומחדד את ההתפלגות סביבו. אותם המשכים בדיוק, ציונים אחרים.',
            scores: { delayed: 5, delivered: 2, pickup: 2, lost: 3 },
        },
        {
            id: 'delivered',
            control: 'תחזית שמיים בהירים',
            promptExtra: 'התחזית מציגה שמיים בהירים ולחות יורדת.',
            note: 'תחזית שמיים בהירים מעבירה את ההובלה ל"שמשי". המודל לא בדק את השמיים בפועל, הוא רק שקלל את מה שכתוב בהקשר.',
            scores: { delayed: 3, delivered: 5, pickup: 2, lost: 2 },
        },
        {
            id: 'pickup',
            control: 'גשם במכ"ם',
            promptExtra: 'המכ"ם האחרון מראה רצועת גשם מתקרבת.',
            note: 'פרט "גשם במכ"ם" מקפיץ את ההמשך המתאים לראש, בלי לשנות את קבוצת ההמשכים. ההקשר קובע מי מוביל.',
            scores: { delayed: 2, delivered: 3, pickup: 5, lost: 2 },
        },
    ],
};
