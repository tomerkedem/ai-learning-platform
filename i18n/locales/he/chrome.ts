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

        menu: 'תפריט הלומדה',


        closeMenu: 'סגירת התפריט',
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

    // בורר ערכת-נושא (System/Light/Dark). ראה components/ThemeProvider.tsx.
    theme: {
        label: 'ערכת נושא',
        system: 'מערכת',
        light: 'בהיר',
        dark: 'כהה',
    },
    language: {
        label: 'שפה',
        change: 'החלפת שפה',
        dialogTitle: 'בחירת שפה',
        close: 'סגירה',
        imageCredit: 'תמונת כדור הארץ: NASA',
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
        // הכרזה לקוראי מסך: התוצאה עצמה מועברת חזותית באייקון ובצבע בלבד, ולכן בלי
        // המחרוזות האלה לומד שמשתמש בקורא מסך שומע רק את ההסבר, ולא נאמר לו אם צדק.
        verdictCorrect: 'תשובה נכונה.',
        verdictWrong: 'תשובה שגויה.',
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

    // חשבון לומד (Supabase). ראה app/(course)/behind-the-scenes-ai/AccountPanel.tsx.
    account: {
        title: 'חשבון',
        intro: 'התחברו כדי לשמור את ההתקדמות ואת השפה שלכם בכל מכשיר.',
        email: 'אימייל',
        password: 'סיסמה',
        signIn: 'התחברות',
        signUp: 'יצירת חשבון',
        signOut: 'התנתקות',
        signedInAs: 'מחוברים בתור',
        working: 'רגע...',
        checkEmail: 'שלחנו אליכם מייל לאישור הכתובת. אחרי האישור אפשר להתחבר.',
        errorInvalid: 'האימייל או הסיסמה שגויים.',
        errorUnconfirmed: 'צריך קודם לאשר את הכתובת דרך המייל ששלחנו אליכם.',
        errorWeakPassword: 'הסיסמה קצרה או חלשה מדי. נסו סיסמה ארוכה יותר.',
        errorGeneric: 'משהו השתבש. נסו שוב בעוד רגע.',
        forgotPassword: 'שכחתם את הסיסמה?',
        resetSent: 'אם קיים חשבון עם הכתובת הזו, שלחנו אליה קישור לאיפוס הסיסמה.',
        newPassword: 'סיסמה חדשה',
        savePassword: 'שמירת הסיסמה החדשה',
        passwordUpdated: 'הסיסמה עודכנה.',
        errorSamePassword: 'זו כבר הסיסמה הנוכחית. בחרו סיסמה אחרת.',
        newPasswordTitle: 'בחירת סיסמה חדשה',
        close: 'סגירה',
        offlineCached: (time: string) => `אין חיבור. מוצגת ההתקדמות מהחשבון כפי שנטענה לאחרונה (${time}).`,
        offlineNoCache: 'אין חיבור, ועדיין לא נטענה התקדמות מהחשבון במכשיר הזה.',
        unsyncedTitle: (n: number) => `עוד לא נשלחו לחשבון: ${n}`,
        unsyncedHint: 'הן כבר כלולות בהתקדמות שמוצגת כאן, ויישלחו אוטומטית כשהחיבור יחזור.',
        rejectedTitle: (n: number) => `לא נשמרו בחשבון: ${n}`,
        rejectedHint: 'החשבון לא קיבל את התוצאות האלה, ולכן הן לא נכללות בהתקדמות. הן נשמרות במכשיר עד שתסירו אותן.',
        retry: 'לנסות שוב',
        remove: 'הסרה',
        importTitle: 'תרגול בלי חשבון במכשיר הזה',
        importBody: (n: number) => `תוצאות מבדקים שנשמרו במכשיר הזה בלי חשבון: ${n}. להוסיף אותן לחשבון הזה? תוצאות שכבר נמצאות בחשבון יישארו כפי שהן.`,
        importAction: 'הוספה לחשבון',
        importSkip: 'בלי ייבוא',
        importDone: (added: number, kept: number) => `נוספו לחשבון: ${added}. כבר היו בחשבון ונשארו כפי שהן: ${kept}.`,
    },

    // גישה לפרקים המוגנים (בטא מאושרת). ראו app/(course)/behind-the-scenes-ai/_access.
    access: {
        lockedLabel: 'נעול',
        lockedHint: 'דורש הרשאת בטא מאושרת',
        title: 'הפרק הזה פתוח לבודקי בטא מאושרים',
        body: 'המבוא ופרק 1 פתוחים לכולם. פרקים 2 עד 19, המבדקים שלהם ומבחן הסיום זמינים רק לבודקי בטא שהחשבון שלהם אושר.',
        signedOut: 'התחברו עם חשבון שאושר לבטא כדי להמשיך.',
        noGrant: 'אתם מחוברים, אבל החשבון עוד לא אושר לבטא. יצירת חשבון ואימות המייל לא נותנים גישה בפני עצמם; האישור ניתן בנפרד.',
        expired: (date: string) => `הרשאת הבטא שלכם הסתיימה ב-${date}.`,
        revoked: 'הרשאת הבטא של החשבון הזה אינה פעילה עוד.',
        unavailable: 'לא הצלחנו לבדוק את ההרשאה כרגע. נסו לרענן את העמוד בעוד רגע.',
        toChapter1: 'לפרק 1',
        toIntro: 'למבוא',
        accessActive: (date: string) => `גישת בטא פעילה עד ${date}`,
        accessNone: 'החשבון הזה לא אושר לבטא (פרקים 2 עד 19 נעולים).',
        accessExpired: (date: string) => `גישת הבטא הסתיימה ב-${date}.`,
        accessRevoked: 'גישת הבטא של החשבון הזה בוטלה.',
    },
};
