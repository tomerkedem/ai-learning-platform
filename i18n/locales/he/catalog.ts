// i18n/locales/he/catalog.ts
//
// מחרוזות עמוד הקטלוג (דף הבית) של "הליבה ההנדסית של AI". עברית = שפת המקור.
// טקסט הכרטיסים חי כאן כמקור האמת ל-i18n (במקום מערך מקומי בעמוד), כדי שיהיה
// ניתן לתרגום. אין מקף ארוך (U+2014). ערכים דינמיים = פונקציות (בלי שרשור).

export const catalog = {
    badge: 'Core Foundations v1.0',
    heroTitle: 'הליבה ההנדסית של AI',
    tagline: 'אינטואיציה קודם, נוסחאות אחר כך.',
    builtBy: 'נבנה על ידי',
    authorName: 'תומר קדם',
    startLearning: 'התחל ללמוד',
    /** מספר פרקים. למניעת שרשור (מספר + "פרקים"). */
    chaptersCount: (n: number) => `${n} פרקים`,

    /** כותרת ותיאור לכל כרטיס לומדה, לפי מזהה הלומדה. */
    cards: {
        python: {
            title: 'פייתון פרקטי למתכנתים',
            description: 'מעבר מכתיבת סקריפטים להנדסת מערכות AI יציבות (Production-Ready).',
        },
        mathIntuitive: {
            title: 'מתמטיקה אינטואיטיבית',
            description: 'בניית האינטואיציה הנדרשת כדי להבין את ה"קופסה השחורה" של ה-Embeddings.',
        },
        mathProbabilistic: {
            title: 'היגיון הסתברותי ל-AI',
            description: 'שליטה בלוגיקה שמניעה את האופטימיזציה וה-Gradient Descent.',
        },
        'behind-the-scenes-ai': {
            title: 'מאחורי הקלעים של AI',
            description: "מה קורה כשכותבים לצ'ט או ל-Agent: מטקסט להסתברות, החלטה ופעולה.",
        },
    } as Record<string, { title: string; description: string }>,
};
