// i18n/locales/he/chrome.ts
//
// מחרוזות "מסגרת הניווט" (chrome) של האתר: סרגל צד, כותרת, פוטר ו-ChapterLayout.
// עברית היא שפת המקור. המבנה כאן מגדיר את טיפוס ChromeDict שכל שאר השפות חייבות
// לעמוד בו. אין מקף ארוך (U+2014). אין שרשור מחרוזות: ערכים דינמיים הם פונקציות.

export const chrome = {
    // סרגל צד
    backToCatalog: 'חזרה לקטלוג הלומדות',
    tableOfContents: 'תוכן העניינים',
    courseProgress: 'התקדמות בלומדה',
    authorName: 'תומר קדם',
    authorRole: 'מחבר הלומדה',
    intro: 'מבוא',
    /** תווית פרק לפי מספר. למניעת שרשור (פרק + מספר). */
    chapterLabel: (n: number) => `פרק ${n}`,

    // כותרת עליונה
    header: {
        readTime: 'זמן קריאה',
        progress: 'התקדמות',
    },

    // ניווט בין פרקים (פוטר הפרק)
    nav: {
        next: 'הבא',
        prev: 'הקודם',
        /** "הבא: פרק N" כיחידה אחת, בלי לשרשר חלקים. */
        nextChapterLabel: (n: number) => `הבא: פרק ${n}`,
        finishedTitle: 'סיימת את כל הפרקים!',
        finishedSub: 'כל הכבוד - הגעת עד הסוף.',
    },

    // מצב מיקוד
    focus: {
        toggleTitle: 'הסתר ניווט והרחב את אזור הלמידה',
        enter: 'מצב מיקוד',
        exit: 'יציאה ממצב מיקוד',
        activeBadge: 'מצב מיקוד פעיל',
        press: 'הקש',
        toExit: 'ליציאה',
    },

    // פוטר
    footer: {
        defaultLabel: 'לומדות אינטראקטיביות למפתחי AI',
        copyright: '© 2026 תומר קדם. כל הזכויות שמורות.',
    },
};
