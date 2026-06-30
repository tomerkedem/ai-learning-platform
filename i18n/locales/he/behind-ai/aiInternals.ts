// i18n/locales/he/behind-ai/aiInternals.ts
//
// מחרוזות chrome משותפות של רכיבי ai-internals (ChatInterfacePanel, ConfidenceMeter)
// בלומדה "מאחורי הקלעים של AI". עברית = שפת המקור, והיא מגדירה את צורת הטיפוס שכל
// שאר השפות חייבות לעמוד בה.
//
// מרחב צר בכוונה: רק המחרוזות הגלויות כיום בפרק 1 באנגלית. רכיבי ai-internals אחרים
// יתווספו בהמשך לפי הצורך. אין מקף ארוך (U+2014) ואין מקף קצר (U+2013).

export const aiInternals = {
    // ChatInterfacePanel: כיתובי ה-chrome של ממשק הצ'אט (הכותרת/תת-כותרת מגיעות מההורה).
    chatInterface: {
        tryExample: 'נסו דוגמה',
        demoBadge: 'דמו',
        aiTyping: 'AI מקליד',
        inputPlaceholder: 'כתוב הודעה...',
        liveTooltip: 'מודל אמיתי (Claude) מחובר',
        demoTooltip: 'מצב דמו: תשובות מתוסרטות, בלי מודל חי',
    },
    // ConfidenceMeter: תוויות רמת הביטחון (לצד שם המונח באנגלית, שנשאר ברכיב).
    confidenceMeter: {
        levels: {
            high: 'גבוה',
            medium: 'בינוני',
            low: 'נמוך',
        },
    },
    // StickyContextBar: כיתוב הקבוע "מה מנותח כעת" (פס ההקשר הדביק בפרקים מבוססי-בורר).
    stickyContextBar: {
        currentlyAnalyzed: 'מנותח כעת',
    },
    // ReadAloudControls: כיתובי דוק ההקראה (Web Speech API), משותפים לכל הפרקים.
    readAloud: {
        dock: 'האזנה מודרכת',
        play: 'הקראה',
        pause: 'השהיה',
        resume: 'המשך',
        stop: 'עצירה',
        prev: 'המקטע הקודם',
        next: 'המקטע הבא',
        voice: 'קול',
        browserDefault: 'קול ברירת המחדל של הדפדפן',
        settings: 'אפשרויות הקראה',
        sections: 'קטעים',
        nowReading: 'קורא כעת',
        unsupported: 'ההקראה אינה זמינה בדפדפן הזה.',
        scope: 'היקף',
        scopeShort: 'קצר',
        scopeRegular: 'רגיל',
        scopeFull: 'מלא',
        speed: 'מהירות',
    },
};

/** צורת מילון ה-ai-internals המשותף, נגזרת מהעברית (מקור הצורה). */
export type AiInternalsDict = typeof aiInternals;
