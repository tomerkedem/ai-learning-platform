// i18n/locales/he/behind-ai/chapter4Lab.ts
// תוכן עברי למעבדת ה-Embeddings של פרק 4 (Chapter4LabDict).
// מקור הצורה: app/behind-the-scenes-ai/chapter-4/labContent (Chapter4LabDict הוא הקנוני).
//
// זהו מודול נתונים בלבד (import של טיפוס בלבד, נמחק בבנייה). הוא נטען דרך מרשם תוכן
// המעבדה בצד הלקוח, ולא דרך מילון ה-i18n, כדי לשמור על גבול שרת/לקוח נקי.
//
// מפתחות מבניים אינם מתורגמים: sentence ids, chip ids, magnet ids וממדים נשארים יציבים.
// הטוקנים מחברים ידנית ולעולם לא מפיצול לפי רווחים. אין שימוש בתו מקף ארוך או מקף בינוני.

import type { Chapter4LabDict } from '@/app/behind-the-scenes-ai/chapter-4/labContent';

export const chapter4Lab: Chapter4LabDict = {
    sentences: {
        'pkg-not-arrived': {
            text: 'החבילה לא הגיעה',
            tokens: ['החבילה', 'לא', 'הגיעה'],
            ttsLine: 'החבילה לא הגיעה. תלונה על כשל במסירה, גבוה בכיוון הכשל.',
            swaps: {
                'to-arrived': { label: 'הגיעה', from: 'לא הגיעה' },
            },
        },
        'delivery-not-handed': {
            text: 'המשלוח לא נמסר',
            tokens: ['המשלוח', 'לא', 'נמסר'],
            ttsLine: 'המשלוח לא נמסר. מילים אחרות לגמרי, אבל אותו כיוון משמעות.',
        },
        'pkg-arrived': {
            text: 'החבילה הגיעה',
            tokens: ['החבילה', 'הגיעה'],
            ttsLine: 'החבילה הגיעה. אותו תחום משלוח, אבל בלי כשל, ולכן הנקודה זזה.',
        },
        'system-not-showing': {
            text: 'המערכת לא מציגה את החבילה',
            tokens: ['המערכת', 'לא', 'מציגה', 'את', 'החבילה'],
            ttsLine: 'המערכת לא מציגה את החבילה. תקלת מערכת, לא בעיית מסירה.',
        },
        'billing-address-update': {
            text: 'עדכנו את כתובת החיוב',
            tokens: ['עדכנו', 'את', 'כתובת', 'החיוב'],
            ttsLine: 'עדכנו את כתובת החיוב. נושא רחוק מהמשלוח, ולכן נוחת רחוק על המפה.',
        },
        'agent-investigate-delay': {
            text: 'בדוק למה החבילה לא הגיעה',
            tokens: ['בדוק', 'למה', 'החבילה', 'לא', 'הגיעה'],
            ttsLine: 'בדוק למה החבילה לא הגיעה. בקשת חקירה בטוחה, סיכון נמוך.',
        },
        'agent-notify-lost': {
            text: 'שלח הודעה ללקוח שהחבילה אבדה',
            tokens: ['שלח', 'הודעה', 'ללקוח', 'שהחבילה', 'אבדה'],
            ttsLine: 'שלח הודעה ללקוח שהחבילה אבדה. פעולה מול לקוח שדורשת אישור.',
        },
    },

    map: {
        closestTag: 'הכי קרוב',
        honest: 'Embedding עוזר להשוות משמעות. הוא לא מוכיח מה קרה באמת.',

        visualTitle: 'קודם נראה קרבה פשוטה',
        visualSubtitle: 'דברים דומים במשמעות מופיעים קרוב יותר. בחרו אובייקט וראו מי הכי קרוב אליו.',
        ruleLine: 'דברים דומים במשמעות נמצאים קרוב יותר.',
        objects: {
            dog: 'כלב',
            cat: 'חתול',
            apple: 'תפוח',
            cucumber: 'מלפפון',
            computer: 'מחשב',
        },
        objectExplain: {
            dog: 'כלב וחתול קרובים כי שניהם בעלי חיים.',
            cat: 'כלב וחתול קרובים כי שניהם בעלי חיים.',
            apple: 'תפוח ומלפפון קרובים כי שניהם אוכל.',
            cucumber: 'תפוח ומלפפון קרובים כי שניהם אוכל.',
            computer: 'מחשב רחוק יותר כי הוא שייך לעולם הטכנולוגיה.',
        },
        objectSelected: 'האובייקט שנבחר',
        objectClosest: 'הכי קרוב',
        objectNoClose: 'רחוק מכל השאר',
        numericTitle: 'ייצוג מספרי',
        numericNote: 'אובייקטים דומים במשמעות מקבלים מספרים דומים, ולכן הם קרובים במפה. וקטור אקראי לא היה מקבץ אותם.',
        numericDisclaimer: 'המספרים להמחשה בלבד. במרחב אמיתי יש מאות ממדים שאינם קריאים לאדם.',

        packageTitle: 'קרבה במשמעות בין משפטים',
        packageSubtitle: 'משפטים שונים יכולים להיות קרובים אם הם מתארים רעיון דומה.',
        centerLabel: 'המשפט שנבחר',
        closestLabel: 'הכי קרוב במשמעות',
        packageRule: 'המודל לא מחפש רק מילים זהות. הוא משווה קרבה במשמעות.',
        cards: {
            'pkg-not-arrived': { shortLabel: 'לא הגיעה', chips: ['בעיית מסירה', 'סטטוס חבילה'] },
            'delivery-not-handed': { shortLabel: 'לא נמסר', chips: ['בעיית מסירה', 'סטטוס חבילה'] },
            'pkg-arrived': { shortLabel: 'הגיעה', chips: ['סטטוס חבילה'] },
            'system-not-showing': { shortLabel: 'לא מוצגת', chips: ['סטטוס חבילה'] },
            'billing-address-update': { shortLabel: 'כתובת חיוב', chips: ['חיוב'] },
            'agent-investigate-delay': { shortLabel: 'בדיקת סטטוס', chips: ['בירור', 'סטטוס חבילה'] },
            'agent-notify-lost': { shortLabel: 'חבילה אבדה', chips: ['פעולה', 'חריג'] },
        },

        proofTitle: 'הוכחה והסבר',
        proofLead: 'אחרי שראינו מה קרוב למה, אפשר לראות למה: אילו רכיבי משמעות משותפים, ואילו כוחות עיצבו את הייצוג.',

        relationTitle: 'מה קרוב למה?',
        coreRule: 'קרוב יותר פירושו דומה יותר במשמעות. רחוק יותר פירושו פחות דומה.',
        relClosest: 'הכי קרוב',
        relRelated: 'קשור אבל שונה',
        relFar: 'רחוק יותר',
        objectRows: [
            { pair: 'כלב קרוב לחתול', reason: 'כי שניהם בעלי חיים.' },
            { pair: 'תפוח קרוב למלפפון', reason: 'כי שניהם אוכל.' },
            { pair: 'מחשב רחוק מהם', reason: 'כי הוא שייך לעולם הטכנולוגיה.' },
        ],
        relations: {
            'pkg-not-arrived': {
                closestId: 'delivery-not-handed',
                relatedId: 'agent-notify-lost',
                farId: 'billing-address-update',
                reasonClosest: 'שניהם מתארים בעיית מסירה.',
                reasonRelated: 'עדיין קשור לבעיה בחבילה, אבל כבר מדובר בפעולה בעקבות הבעיה.',
                reasonFar: 'עוסק בפרטי חיוב, לא בבעיית מסירה.',
            },
            'delivery-not-handed': {
                closestId: 'pkg-not-arrived',
                relatedId: 'agent-notify-lost',
                farId: 'billing-address-update',
                reasonClosest: 'שניהם מתארים בעיית מסירה.',
                reasonRelated: 'קשור לאותה בעיה, אבל זו כבר פעולה מול הלקוח.',
                reasonFar: 'עוסק בפרטי חיוב, לא במסירה.',
            },
            'pkg-arrived': {
                closestId: 'delivery-not-handed',
                relatedId: 'agent-investigate-delay',
                farId: 'billing-address-update',
                reasonClosest: 'אותו עולם של מסירת חבילה.',
                reasonRelated: 'אותו תחום, אבל זו בקשה לבדוק ולא תיאור מצב.',
                reasonFar: 'עוסק בחיוב, נושא אחר לגמרי.',
            },
            'system-not-showing': {
                closestId: 'pkg-not-arrived',
                relatedId: 'agent-investigate-delay',
                farId: 'billing-address-update',
                reasonClosest: 'שניהם על חבילה שמשהו בה השתבש.',
                reasonRelated: 'קשור, אבל זו בקשת פעולה לבדוק.',
                reasonFar: 'עוסק בחיוב, לא בבעיית חבילה.',
            },
            'billing-address-update': {
                closestId: 'system-not-showing',
                relatedId: 'pkg-not-arrived',
                farId: 'agent-notify-lost',
                reasonClosest: 'שניהם נוגעים לפרטים במערכת, לא למסירה עצמה.',
                reasonRelated: 'גם זה משלוח, אבל מדובר בבעיית מסירה ולא בחיוב.',
                reasonFar: 'זו פעולה מול לקוח על חבילה שאבדה, רחוק מחיוב.',
            },
            'agent-investigate-delay': {
                closestId: 'pkg-not-arrived',
                relatedId: 'agent-notify-lost',
                farId: 'billing-address-update',
                reasonClosest: 'שניהם על חבילה שלא הגיעה, כאן כבקשה לבדוק.',
                reasonRelated: 'שתיהן פעולות, אבל זו דיווח ללקוח.',
                reasonFar: 'עוסק בחיוב, לא בבדיקת מסירה.',
            },
            'agent-notify-lost': {
                closestId: 'agent-investigate-delay',
                relatedId: 'pkg-not-arrived',
                farId: 'billing-address-update',
                reasonClosest: 'שתיהן פעולות סביב חבילה שהשתבשה.',
                reasonRelated: 'קשור לבעיה עצמה, אבל זה רק תיאור הבעיה ולא פעולה.',
                reasonFar: 'עוסק בחיוב, נושא אחר.',
            },
        },
        howto: {
            title: 'איך קוראים את התצוגה?',
            rowPoint: 'כרטיס = משפט',
            rowClose: 'קרוב = משמעות דומה',
            rowFar: 'רחוק = פחות דומה',
            rowSwap: 'החלפת מילה יכולה לקרב או לרחק',
            legendWhy: 'למה הם קרובים או רחוקים? ראו את ה-DNA ואת כוחות המשמעות.',
        },
    },

    magnets: {
        delivery: 'משלוח',
        delay: 'עיכוב',
        complaint: 'תלונה',
        tracking: 'מעקב',
        refund: 'החזר כספי',
        risk: 'סיכון',
    },

    genes: {
        delivery: 'משלוח',
        system: 'מערכת',
        address: 'כתובת',
        payment: 'תשלום',
        urgency: 'דחיפות',
        failure: 'כשל',
        action: 'פעולה',
        risk: 'סיכון',
        customer: 'לקוח',
        permission: 'אישור',
    },

    dna: {
        title: 'המשמעות שבתוך הווקטור',
        intro: 'הווקטור אינו מספר אחד. הוא פרופיל של רכיבי משמעות שהמודל למד. כל שלב בסולם הוא רכיב משמעות אחד, וגובה הצומת מראה כמה הרכיב חזק במשפט.',
        roleActive: 'שבחרת',
        roleCompare: 'להשוואה',
        twistMeaning: 'ככל שהמשמעות של שני המשפטים קרובה יותר, הגדילים נכרכים הדוק יותר. כשהמשמעות נסחפת, הם נפרדים.',
        leadShared: (names) => `שני המשפטים חזקים באותם רכיבי משמעות: ${names}. לכן הם קרובים.`,
        leadNone: 'שני המשפטים מדליקים רכיבים שונים, ולכן הם רחוקים יותר.',
        sharedBadge: 'משותף',
        guideSize: 'צומת גדול יותר = הרכיב חזק יותר באותו משפט.',
        guideBond: 'קשר ירוק פועם = רכיב משותף לשני המשפטים, וזה מה שמקרב את המשמעות.',
        stayedClose: 'המשמעות נשארה קרובה',
        drifted: 'המשמעות נסחפה',
    },

    controls: {
        pickSentence: 'בחרו משפט',
        swapTitle: 'מה קורה אם מחליפים מילה?',
        swapHint: 'שינוי קטן בניסוח יכול לקרב או להרחיק את המשמעות.',
        resetSwap: 'חזרה למשפט המקורי',
    },

    fallback: {
        missingSentence: 'תוכן חסר',
    },

    ui: {
        magnetTitle: 'כוחות המשמעות',
    },

    explain: {
        title: 'מדריך מהיר',
        mapShadow: 'המפה היא צל שטוח של מרחב משמעות גדול בהרבה.',
        close: 'נקודות קרובות בדרך כלל מייצגות משמעות דומה.',
        far: 'נקודה רחוקה אינה שגויה, היא פשוט פחות דומה במשמעות.',
        regions: 'ההילות הצבעוניות הן שכונות משמעות, לא גבולות חדים.',
        forces: 'כוחות המשמעות מראים אילו אותות משכו את המשפט לכיוון הזה.',
        dna: 'ה-DNA מוכיח למה שני משפטים קרובים: אותם רכיבי משמעות נדלקים בעוצמה דומה.',
        notTruth: 'Embedding עוזר להשוות משמעות. הוא לא מוכיח מה קרה באמת.',
    },
};
