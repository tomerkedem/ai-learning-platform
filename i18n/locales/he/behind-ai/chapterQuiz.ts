// i18n/locales/he/behind-ai/chapterQuiz.ts
//
// כרום מבדקי הפרקים של הלומדה "מאחורי הקלעים של AI", עברית = שפת המקור.
// ────────────────────────────────────────────────────────────────────────
// זהו טקסט תצוגה בלבד. ההתנהגות (questions, passScore, onComplete, getReviewLinks,
// nextHref) נשארת ב-quizData.ts ואינה נוגעת כאן. רכיב העטיפה ChapterQuiz ממזג את
// מחרוזות התצוגה האלה על שלד המבדק המשותף לפי מספר הפרק.
//
// ערכים דינמיים הם פונקציות (בלי שרשור במילון). שמות הפרקים מועתקים כאן במדויק
// מ-CHAPTER_LABELS שב-quizData.ts כדי לשמור על העברית הנראית זהה, ומבלי לייבא מ-
// quizData (המילון נשאר עצמאי).
//
// אין מקף ארוך (U+2014) בקובץ הזה.

export const chapterQuiz = {
    subtitle: 'חמש שאלות שמחדדות את מה שלמדתם בפרק',
    startLabel: 'התחילו את המבדק',
    submitLabel: 'סיום המבדק',
    completedTitle: 'סיימתם את המבדק',

    /** כותרת המבדק: "מבדק הבנה: {שם הפרק}". */
    title: (chapterName: string) => `מבדק הבנה: ${chapterName}`,

    /** תווית קישור חזרה ממוקד: "חזרה לפרק {n}: {שם הפרק}". */
    reviewLinkLabel: (chapterNumber: number, chapterName: string) =>
        `חזרה לפרק ${chapterNumber}: ${chapterName}`,

    /** שמות הפרקים (1..16), זהים ל-CHAPTER_LABELS שב-quizData.ts. */
    chapterNames: {
        1: "הצ'אט השקוף",
        2: 'Model Input',
        3: 'Tokenization',
        4: 'Embeddings',
        5: 'Semantic Space: מפת המשמעות',
        6: 'Attention: מי חשוב עכשיו',
        7: 'Context Window',
        8: 'Logits & Softmax',
        9: 'Decoding',
        10: 'Generation Loop',
        11: 'בחירת כלי',
        12: 'Tool Call ולולאת ההחלטה',
        13: 'עצירה, אישור ואחריות',
        14: 'המעבדה המאוחדת',
        15: 'האם AI לומד מטעויות',
        16: 'לעבוד נכון עם AI',
    } as Record<number, string>,
};
