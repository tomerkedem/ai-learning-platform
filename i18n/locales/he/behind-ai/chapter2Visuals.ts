// i18n/locales/he/behind-ai/chapter2Visuals.ts
// המחשות ותוויות של פרק 2: כרום מעבדת השוואת הקלט (InputComparisonLab) ונתוני
// חמשת הניסוחים. העברית היא מקור-הצורה.
//
// שלב C1: חילוץ בלבד. הטקסט זהה למה שהוצג קודם בקוד. אין מקף ארוך (U+2014) ואין
// מקף בינוני (U+2013).

import type { Locale } from '@/i18n/config';
import type { InputVariation } from '@/app/behind-the-scenes-ai/chapter-2/inputVariations';

export const chapter2Visuals = {
    contentLocale: 'he' as Locale,

    // מעבדת השוואת קלט (InputComparisonLab): כיתובי chrome
    inputLab: {
        tokenizationHint: 'בהמשך הלומדה הטקסט יפורק לטוקנים. עכשיו אנחנו מסתכלים רק על מה הקלט מכיל, עוד לפני הפירוק.',
        pickerHint: 'בחרו ניסוח, וראו מה נכנס למודל בפועל.',
        pickerAria: 'בחירת ניסוח להשוואה',
        ambiguityPrefix: 'עמימות',
        outro: 'אותו צורך, ניסוחים שונים. בכל ניסוח המודל מקבל חומר אחר לעבוד איתו, עוד לפני שמתחיל עיבוד עמוק יותר.',
        // כותרות השדות בלוח הקריאה
        fields: {
            explicit: 'מה מפורש בטקסט',
            missing: 'מה חסר',
            changed: 'מה השתנה לעומת הבסיס',
            ambiguity: 'רמת עמימות',
            expectation: 'מה מצופה מהמודל',
            external: 'דרוש מידע חיצוני',
            tendency: 'לאן זה נוטה',
        },
        baseComparison: 'זו נקודת הבסיס להשוואה.',
        externalYes: 'כן.',
        externalNo: 'לא נדרש בשלב הזה.',
        noticeLabel: 'שווה לשים לב',
        // תוויות רמת העמימות (הצ׳יפ והגוון מבניים ברכיב)
        ambiguityLabels: {
            low: 'נמוכה',
            medium: 'בינונית',
            high: 'גבוהה',
        },
        // תוויות הנטייה (הצ׳יפ והגוון מבניים ברכיב)
        tendencyLabels: {
            chat: 'נוטה ל-Chat',
            'chat-agent': 'בין Chat ל-Agent',
            agent: 'נוטה ל-Agent',
        },
    },

    // נתוני חמשת הניסוחים. השדות המבניים (id, ambiguity, tendency, externalData)
    // נשארים ב-inputVariations.ts; כאן הטקסט הגלוי בלבד, באותו סדר ובאותם ערכים.
    inputVariations: [
        {
            id: 'base',
            label: 'בקשה בסיסית',
            prompt: 'החבילה שלי לא הגיעה. מה לעשות?',
            explicit: ['יש בעיה: החבילה לא הגיעה', 'בקשה להכוונה: מה לעשות'],
            missing: ['מספר מעקב', 'מתי ההזמנה בוצעה', 'מי חברת המשלוחים'],
            changed: '',
            ambiguity: 'medium',
            expectation: 'לתת הכוונה כללית, או לשאול מה חסר כדי לעזור באמת',
            externalData: false,
            tendency: 'chat',
        },
        {
            id: 'question',
            label: 'רק שאלה',
            prompt: 'החבילה שלי לא הגיעה?',
            explicit: ['החבילה לא הגיעה, מנוסח כתהייה'],
            missing: ['מה המשתמש רוצה שיקרה', 'בקשה מפורשת לפעולה או להכוונה'],
            changed: 'הוסר "מה לעשות" ונוסף סימן שאלה. נשארה תהייה בלי בקשה ברורה.',
            ambiguity: 'high',
            expectation: 'לברר מה בעצם נדרש לפני שמנסחים תשובה',
            externalData: false,
            tendency: 'chat',
        },
        {
            id: 'contradiction',
            label: 'סתירה',
            prompt: 'החבילה שלי לא הגיעה, אבל קיבלתי הודעה שהיא נמסרה.',
            explicit: ['בעיה: החבילה לא הגיעה', 'טענה נגדית: התקבלה הודעת מסירה'],
            missing: ['בקשה מפורשת', 'מספר מעקב לאימות'],
            changed: 'נוספה סתירה בין מה שהמשתמש חווה לבין הודעת המסירה.',
            ambiguity: 'medium',
            expectation: 'לזהות את הסתירה, ואולי להציע לבדוק את הסטטוס',
            externalData: true,
            externalNote: 'כדי ליישב את הסתירה כדאי לבדוק נתוני מעקב אמיתיים.',
            tendency: 'chat-agent',
        },
        {
            id: 'tracking',
            label: 'עם מספר מעקב',
            prompt: 'החבילה שלי לא הגיעה. מספר המעקב הוא 12345.',
            explicit: ['בעיה: החבילה לא הגיעה', 'מזהה: מספר מעקב 12345'],
            missing: ['מהי הפעולה הרצויה במדויק'],
            changed: 'נוסף מזהה מעקב. עכשיו יש מספיק כדי לבדוק סטטוס אמיתי.',
            ambiguity: 'low',
            expectation: 'אפשר לבדוק את סטטוס המשלוח לפי המזהה',
            externalData: true,
            externalNote: 'המזהה מאפשר פנייה למערכת מעקב חיצונית.',
            tendency: 'agent',
        },
        {
            id: 'correction',
            label: 'תיקון בשיחה',
            prompt: 'לא נעליים, הזמנתי ספר.',
            explicit: ['תיקון: לא נעליים אלא ספר'],
            missing: ['ההקשר הקודם בשיחה, שבלעדיו לא ברור על מה מתקנים'],
            changed: 'זה לא תיאור בעיה אלא תיקון של משהו שנאמר קודם בשיחה.',
            ambiguity: 'high',
            expectation: 'לעדכן את ההקשר הנוכחי של השיחה לפי התיקון',
            externalData: false,
            tendency: 'chat',
            note: 'התיקון משנה את ההקשר הנוכחי של השיחה, לא את מה שהמודל למד באימון.',
        },
    ] as InputVariation[],
};
