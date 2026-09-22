// i18n/locales/he/behind-ai/decodingLab.ts
//
// נתוני מעבדת Decoding של פרק 9 (Decoding: בחירת הטוקן הבא), עברית = שפת המקור.
//
// הרעיון המרכזי: ההסתברויות כבר קיימות (זה היה פרק 8). כאן הן קבועות, והלומד משנה רק
// את סגנון הבחירה. אותה התפלגות בדיוק יכולה להוביל לטוקנים שונים: סגנון שמרני נשאר על
// האפשרות הסבירה ביותר, סגנון פתוח נותן סיכוי גם לאפשרויות נמוכות יותר. כפתור "נסה
// בחירה נוספת" מציג עוד בחירה באותו סגנון.
//
// הבחירות אינן אקראיות: לכל סגנון יש רצף בחירות קבוע (picks) כדי שהלומד יראה גיוון בלי
// שהבדיקות יהפכו לא יציבות. ההסתברויות והבחירות הן המחשה לימודית בלבד, לא פלט אמיתי של
// מודל, ושום סגנון אינו בודק אם ההמשך נכון בעולם.
//
// i18n: כל הטקסט והנתונים תלויי-השפה (continuations, styles, labels) מגיעים מ-data לפי
// locale. סדר ההמשכים, מיפוי הגוונים והכיוון (RTL/LTR) נשארים ברכיב.
//
// אין מקף ארוך (U+2014), אין מקף בינוני (U+2013) ואין נקודה-פסיק בעברית.

/** המשך אפשרי בודד בתוך ההתפלגות הקבועה. */
export interface LabContinuation {
    /** מזהה יציב, אינו מתורגם. */
    id: string;
    /** תווית ההמשך, למשל "התעכבה". */
    label: string;
    /** הסתברות להמחשה באחוזים. כל ההמשכים יחד מסתכמים ל-100. */
    prob: number;
}

/** סגנון בחירה (Decoding) אחד: שמרני, מאוזן או פתוח. */
export interface DecodingStyle {
    /** מזהה יציב, אינו מתורגם. */
    id: string;
    /** תווית הכפתור המקוצרת. */
    control: string;
    /** משפט קצר שמסביר איך הסגנון מתנהג. מוצג מתחת לכפתור הפעיל. */
    summary: string;
    /** רמת יציבות להמחשה, 1 עד 3 (מספר משבצות מלאות). מבני, אינו מתורגם. */
    stability: number;
    /** רמת גיוון להמחשה, 1 עד 3. מבני, אינו מתורגם. */
    variety: number;
    /** רצף בחירות קבוע (מזהי המשכים) לכפתור "נסה בחירה נוספת". דטרמיניסטי. */
    picks: string[];
    /** הסבר קצר כשההמשך שנבחר הוא המוביל (ההסתברות הגבוהה ביותר). */
    whenTop: string;
    /** הסבר קצר כשההמשך שנבחר אינו המוביל (אפשרות פחות סבירה). */
    whenLower: string;
}

export interface DecodingLabContent {
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
    distributionLabel: string;
    probabilityLabel: string;
    styleLabel: string;
    stabilityLabel: string;
    varietyLabel: string;
    selectedLabel: string;
    whyLabel: string;
    replayButton: string;
    continuationNote: string;
    disclaimer: string;
    /** תוויות לקוראי מסך. */
    sr: { styleGroup: string; replay: string; distribution: string };
    continuations: LabContinuation[];
    styles: DecodingStyle[];
}

export const decodingLab: DecodingLabContent = {
    sectionEyebrow: 'Decoding Lab',
    sectionTitle: 'אותה התפלגות, סגנון בחירה אחר: מי נבחר?',
    sectionIntro:
        'ההסתברויות כאן קבועות ולא משתנות. שנו רק את סגנון הבחירה, ולחצו "נסו בחירה נוספת". הרעיון המרכזי: אותה התפלגות בדיוק, סגנון בחירה אחר, ולכן טוקן אחר עשוי להיבחר. סגנון שמרני נשאר על הסביר ביותר, סגנון פתוח נותן סיכוי גם לאפשרויות נמוכות יותר.',
    heading: 'בחירת הטוקן הבא',
    kicker: 'Decoding Lab',
    promptBase: 'הדלת הישנה...',
    promptLabel: 'המשפט שממשיכים',
    distributionLabel: 'ההתפלגות הקבועה',
    probabilityLabel: 'הסתברות',
    styleLabel: 'בחרו סגנון בחירה',
    stabilityLabel: 'יציבות',
    varietyLabel: 'מגוון',
    selectedLabel: 'הטוקן שנבחר',
    whyLabel: 'למה זה נבחר',
    replayButton: 'נסו בחירה נוספת',
    continuationNote:
        'ההמשכים מוצגים כאן כביטויים שלמים כדי שיהיה קל לקרוא. בפועל המודל בוחר את הטוקן הבא צעד אחר צעד. זו המחשה של הבחירה, לא עקבה פנימית מדויקת של המודל.',
    disclaimer:
        'ההסתברויות והבחירות כאן הן המחשה לימודית, לא פלט אמיתי של מודל. הן נועדו להראות איך סגנון הבחירה קובע מי נבחר מתוך אותה התפלגות. שום סגנון לא בודק אם ההמשך נכון בעולם.',
    sr: {
        styleGroup: 'בחירת סגנון הבחירה',
        replay: 'הציגו בחירה נוספת באותו סגנון',
        distribution: 'התפלגות ההסתברויות של ההמשכים',
    },
    continuations: [
        { id: 'creak', label: 'נפתחה בחריקה', prob: 52 },
        { id: 'locked', label: 'נשארה נעולה', prob: 24 },
        { id: 'fell', label: 'נפלה מהצירים', prob: 16 },
        { id: 'secretRoom', label: 'הובילה לחדר סודי', prob: 8 },
    ],
    styles: [
        {
            id: 'conservative',
            control: 'שמרני',
            summary: 'נשאר על האפשרות הכי סבירה. פלט צפוי ויציב.',
            stability: 3,
            variety: 1,
            picks: ['creak', 'creak', 'creak', 'creak'],
            whenTop: 'הסגנון השמרני כמעט תמיד נשאר על האפשרות עם ההסתברות הגבוהה ביותר, ולכן הפלט צפוי ויציב.',
            whenLower: 'גם כשמתפנה מקום לאפשרות אחרת, הסגנון השמרני נוטה לחזור לאפשרות המובילה.',
        },
        {
            id: 'balanced',
            control: 'מאוזן',
            summary: 'בוחר לרוב מבין האפשרויות הסבירות, עם קצת גיוון.',
            stability: 2,
            variety: 2,
            picks: ['creak', 'locked', 'creak', 'fell'],
            whenTop: 'הסגנון המאוזן בוחר לרוב מבין האפשרויות הסבירות, וכאן נבחרה המובילה.',
            whenLower: 'הסגנון המאוזן נתן סיכוי לאפשרות סבירה אחרת, לא הכי גבוהה אבל עדיין קרובה.',
        },
        {
            id: 'creative',
            control: 'פתוח',
            summary: 'נותן סיכוי גם לאפשרויות פחות סבירות. יותר גיוון, פחות יציבות.',
            stability: 1,
            variety: 3,
            picks: ['locked', 'creak', 'fell', 'secretRoom', 'creak'],
            whenTop: 'גם בסגנון פתוח האפשרות המובילה עדיין הכי סבירה, ולכן היא נבחרת חלק מהזמן.',
            whenLower: 'הסגנון הפתוח נתן סיכוי לאפשרות פחות סבירה. זה מוסיף גיוון, אבל לא הופך אותה לנכונה.',
        },
    ],
};
