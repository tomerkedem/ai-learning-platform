// i18n/locales/he/behind-ai/semanticSpaceDna.ts
//
// תוכן מקומי למקטע ה-DNA הסמנטי של פרק 5. עברית = שפת המקור, מגדירה את הצורה
// (SemanticSpaceDnaDict) שכל שאר השפות חייבות לעמוד בה. המבנה (מזהים, פרופילים,
// ממדים) חי ב-app/behind-the-scenes-ai/chapter-5/dnaModel.ts.
//
// זהו סט תוכן עצמאי של פרק 5, ואינו תלוי ב-chapter4Lab או ב-SENTENCE_STRUCTS של פרק 4.
//
// אין מקף ארוך (U+2014), אין מקף בינוני (U+2013) ואין נקודה-פסיק בעברית.

import type { SemanticSpaceDnaDict } from '@/app/(course)/behind-the-scenes-ai/chapter-5/dnaModel';

export const semanticSpaceDna: SemanticSpaceDnaDict = {
    sentences: {
        'window-not-open': { text: 'החלון לא פתוח', ttsLine: 'החלון לא פתוח. תלונה על מצב החדר, גבוה בכיוון הסגירות.' },
        'window-shut': { text: 'החלון סגור', ttsLine: 'החלון סגור. מילה אחרת, אבל אותו כיוון משמעות.' },
        'window-is-open': { text: 'החלון פתוח', ttsLine: 'החלון פתוח. אותו נושא, אבל בלי סגירות, ולכן הדפוס זז.' },
        'room-is-cold': { text: 'קר בחדר', ttsLine: 'קר בחדר. אי נוחות דומה, אבל לא על סגירות החלון.' },
        'cat-on-couch': { text: 'החתול ישן על הספה', ttsLine: 'החתול ישן על הספה. משפט מעולם אחר, לא קשור לחדר.' },
    },

    genes: {
        roomRelevance: 'זיקה לחדר',
        closedness: 'סגירות החלון',
        discomfort: 'אי נוחות',
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
        axesNote: 'הצירים כאן הם תוויות לימודיות. במודל אמיתי הווקטור כולל מאות או אלפי ממדים מספריים שאינם קריאים כתכונות אנושיות.',
    },
};
