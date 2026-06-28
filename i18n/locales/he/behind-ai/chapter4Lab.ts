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
                'to-arrived': { label: 'הגיעה' },
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
        axisXStart: 'עולם המשלוח',
        axisXEnd: 'מערכת ותשלום',
        axisYStart: 'רגוע',
        axisYEnd: 'כשל וסיכון',
        shadowNote:
            'המפה הזו היא צל דו-ממדי של מרחב משמעות גדול בהרבה. המרחב האמיתי כולל מאות ממדים, וכאן שיטחנו אותו לשני צירים כדי שאפשר יהיה לראות. קרבה כאן בדרך כלל אומרת משמעות קרובה, אבל זו הקרבה, לא האמת בעולם.',
        legendTitle: 'מפת המשמעות',
        emptyState: 'בחרו משפט כדי לראות איפה הוא נוחת במרחב המשמעות.',
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
        title: 'DNA המשמעות',
        sharedGenes: (shared, total) => `${shared} מתוך ${total} גנים משותפים`,
        drift: (pct) => `סחיפה ${pct}%`,
        stayedClose: 'המשמעות נשארה קרובה',
        drifted: 'המשמעות נסחפה',
    },

    controls: {
        pickSentence: 'בחרו משפט',
        swapWord: 'שנו מילה',
        reset: 'איפוס',
        compareWith: 'השוו מול',
    },

    fallback: {
        missingSentence: 'תוכן חסר',
    },
};
