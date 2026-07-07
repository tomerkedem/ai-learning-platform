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

    // כותרת עליונה
    header: {
        readTime: 'זמן קריאה',
        progress: 'התקדמות',
    },

    // ניווט בין פרקים (פוטר הפרק)
    nav: {
        next: 'הבא',
        prev: 'הקודם',
        finishedTitle: 'סיימת את כל הפרקים!',
        finishedSub: 'כל הכבוד - הגעת עד הסוף.',
        // מוצג במקום מסך הסיום כשהפרק האחרון הבנוי אינו הפרק האחרון בתוכנית
        // (למשל בלומדת "מאחורי הקלעים של AI", שבה עוד מחכים פרקים). ניסוח ניטרלי
        // שלא מרמז שהלומדה הסתיימה.
        moreComingTitle: 'הגעת לסוף הפרקים הזמינים כרגע',
        moreComingSub: 'הפרקים הבאים ימשיכו את הלומדה',
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

    // מנוע המבדק (AssessmentEngine): כרום פנימי של מסכי הפתיחה, השאלה והתוצאות.
    // ערכי ברירת המחדל כאן זהים לטקסט שהיה מקודד קשיח ברכיב, כך שהעברית לא משתנה.
    // ערכים דינמיים הם פונקציות (בלי שרשור). props שמועברים מבחוץ גוברים על אלה.
    assessment: {
        // מסך פתיחה
        start: 'התחל בחינה',
        mentorStart: 'מוכן? בוא נראה מה קלטת',
        questionsLabel: 'שאלות',
        recommendedTimeLabel: 'זמן מומלץ',
        recommendedTime: (min: number) => `${min} דק'`,
        // מסך תוצאות
        submit: 'סיום בחינה',
        completed: 'הבחינה הושלמה!',
        next: 'המשך לפרק הבא',
        review: 'חזרה לחזרה קצרה',
        mentorPassHigh: 'מצוין, שליטה מלאה!',
        mentorPass: 'יפה, עברת!',
        mentorFail: 'עוד לא עברתם. חזרו על הנקודות החלשות ונסו שוב.',
        failNote: 'ההבנה עדיין לא מספיקה כדי להתקדם בביטחון. חזרו על הנקודות החלשות ונסו שוב.',
        correctSummary: (correct: number, total: number) => `${correct} מתוך ${total} תשובות נכונות`,
        timeLabel: 'זמן',
        strongConcepts: 'חזק אצלך',
        weakConcepts: 'כדאי לחזק',
        recommendedReview: 'חזרה מומלצת',
        reviewAnswers: 'סקירת תשובות',
        retry: 'ניסיון חוזר',
        // דרגות ציון ברירת מחדל (התווית והכותרת בלבד; הסף והצבע נשארים מבניים ברכיב)
        tiers: [
            { label: 'מצוין!', sub: 'שליטה מלאה בחומר' },
            { label: 'טוב מאוד', sub: 'הבנה טובה מאוד' },
            { label: 'כמעט עברת', sub: 'קרוב לסף ההצלחה' },
            { label: 'לא עברת עדיין', sub: 'מתחת לסף ההצלחה' },
        ],
        // מסך השאלה
        questionCounter: (current: number, total: number) => `שאלה ${current} מתוך ${total}`,
        streak: (n: number) => `${n} רצף`,
        mute: 'השתקת צלילים',
        unmute: 'הפעלת צלילים',
        prev: 'הקודם',
        continue: 'המשך',
    },

    // לוח ההתקדמות (MasteryDashboard / SidebarMastery): סיכום שליטה במבדקים.
    progress: {
        title: 'ההתקדמות שלכם בלומדה',
        sidebarTitle: 'שליטה במבדקים',
        emptyTitle: 'ההתקדמות שלכם',
        emptyBody: 'השלימו מבדק הבנה קצר בסוף כל פרק, וכאן תראו אילו מושגים כבר חזקים אצלכם ואילו כדאי לחזק. ההתקדמות נשמרת במכשיר שלכם.',
        completed: 'הושלמו',
        passed: 'עברו',
        average: 'ממוצע',
        finalExam: 'מבחן סיום',
        strongHeader: 'חזק אצלכם',
        weakHeader: 'מושגים שכדאי לחזק',
        weakHeaderShort: 'כדאי לחזק',
        finalExamCta: 'מעבר למבחן סיום הלומדה',
        status: {
            passed: 'עבר',
            needsReview: 'דורש חזרה',
            notTaken: 'לא בוצע',
        },
    },
};
