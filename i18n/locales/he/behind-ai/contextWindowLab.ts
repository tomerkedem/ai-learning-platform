// i18n/locales/he/behind-ai/contextWindowLab.ts
//
// נתוני מעבדת חלון ההקשר של פרק 7 (Context Window), עברית = שפת המקור.
//
// חשוב: כאן יושב כל הטקסט וכל הנתונים תלויי-השפה של ContextWindowLab. הודעות
// השיחה, הפרט הקריטי, התשובות של המודל והפרומפט העצמאי תלויים בשפה כי הניסוח,
// הסדר ואורך השורות שונים בכל שפה, וכיוון הקריאה שונה (RTL מול LTR). לכן messages
// ו-states חייבים להיות מוגדרים לכל שפה בנפרד. מיפוי הגוונים (tone -> צבע) נשאר ברכיב.
//
// זו המחשה לימודית של הרעיון, לא מדידה מדויקת של גבול הטוקנים.
//
// אין מקף ארוך (U+2014), אין מקף בינוני (U+2013) ואין נקודה-פסיק בעברית.

/** גוון התשובה של המודל במצב נתון. מבני, אינו תלוי שפה (התוויות מהמילון). */
export type AnswerTone = 'specific' | 'generic' | 'restored';

export interface LabMessage {
    /** מזהה יציב, אינו מתורגם. */
    id: string;
    role: 'user' | 'agent';
    /** טקסט ההודעה. */
    text: string;
    /** האם זו ההודעה עם הפרט הקריטי (יום ושעת הפגישה). */
    critical?: boolean;
}

export interface LabState {
    /** מזהה יציב, אינו מתורגם. */
    id: string;
    /** תווית הכפתור: מצב החלון. */
    control: string;
    /** מזהי ההודעות שנמצאות כרגע בתוך חלון ההקשר, בסדר קריאה. */
    visibleIds: string[];
    /** פרומפט עצמאי שנכתב במצב הזה (מצב C בלבד). */
    standalonePrompt?: string;
    /** התשובה של המודל במצב הזה. */
    answer: string;
    answerTone: AnswerTone;
    /** כיתוב שמסביר מה השתנה ולמה התשובה זזה. */
    caption: string;
}

export interface ContextWindowLabContent {
    /** כותרות הסקשן בעמוד (מעל הרכיב). */
    sectionEyebrow: string;
    sectionTitle: string;
    sectionIntro: string;
    /** כותרת פנימית של הרכיב. */
    heading: string;
    /** תת-כותרת לטינית מבנית (נשארת כמות שהיא בכל שפה). */
    kicker: string;
    pickHint: string;
    conversationLabel: string;
    outsideLabel: string;
    insideLabel: string;
    earlierMessages: string;
    modelSeesLabel: string;
    standaloneLabel: string;
    answerLabel: string;
    criticalTag: string;
    disclaimer: string;
    toneLabels: Record<AnswerTone, string>;
    /** תוויות התפקידים בשיחה (מי מדבר). */
    roleLabels: { user: string; agent: string };
    /** תוויות לקוראי מסך. */
    sr: { group: string; inside: string; outside: string };
    messages: LabMessage[];
    states: LabState[];
}

export const contextWindowLab: ContextWindowLabContent = {
    sectionEyebrow: 'Context Window Lab',
    sectionTitle: 'הזיזו את חלון ההקשר, וראו מה המודל עוד רואה',
    sectionIntro:
        'בתחילת השיחה נכתב שהפגישה תתקיים ביום חמישי בשעה 18:00. עכשיו, אחרי הרבה הודעות, אחד המשתתפים שואל שוב. שנו את מצב החלון וראו איך התשובה של המודל משתנה כשהפרט הקריטי בפנים, כשהוא בחוץ, וכשמחזירים אותו לפרומפט.',
    heading: 'מה נמצא עכשיו בתוך חלון ההקשר',
    kicker: 'Context window lab',
    pickHint: 'בחרו מצב. נראה מה נכנס לחלון ומה נופל ממנו.',
    conversationLabel: 'השיחה עד עכשיו',
    outsideLabel: 'מחוץ לחלון ההקשר',
    insideLabel: 'בתוך חלון ההקשר',
    earlierMessages: 'הודעות קודמות בשיחה',
    modelSeesLabel: 'מה המודל רואה עכשיו',
    standaloneLabel: 'הפרומפט העצמאי שכתבתם',
    answerLabel: 'התשובה של המודל',
    criticalTag: 'פרט קריטי',
    disclaimer:
        'זו המחשה לימודית של הרעיון, לא מדידה מדויקת של גבול הטוקנים. מערכות ומודלים שונים מנהלים את החלון אחרת. המטרה כאן להראות עיקרון אחד: המודל עונה לפי מה שנמצא בחלון ההקשר עכשיו, לא לפי כל מה שנאמר אי פעם.',
    toneLabels: {
        specific: 'תשובה ממוקדת',
        generic: 'תשובה כללית',
        restored: 'תשובה טובה שוב',
    },
    roleLabels: {
        user: 'נציג',
        agent: 'המודל',
    },
    sr: {
        group: 'בחירת מצב חלון ההקשר',
        inside: 'בתוך החלון',
        outside: 'מחוץ לחלון',
    },
    messages: [
        { id: 'm1', role: 'user', critical: true, text: 'הפגישה תתקיים ביום חמישי בשעה 18:00.' },
        { id: 'm2', role: 'user', text: 'אחד המשתתפים כתב שהוא בונה סביבה את השבוע שלו.' },
        { id: 'm3', role: 'agent', text: 'הבנתי. אני בודק את הפנייה וחוזר אליך.' },
        { id: 'm4', role: 'user', text: 'עכשיו הוא שלח הודעה נוספת ומבקש תשובה.' },
        { id: 'm5', role: 'user', text: 'מה כדאי לענות לו?' },
    ],
    states: [
        {
            id: 'inside',
            control: 'הפרט בתוך החלון',
            visibleIds: ['m1', 'm2', 'm3', 'm4', 'm5'],
            answer:
                'עדכן אותו שהפגישה תתקיים ביום חמישי בשעה 18:00, ושהוא מוזמן להצטרף כמה דקות מוקדם יותר.',
            answerTone: 'specific',
            caption:
                'הפרט הקריטי, שהפגישה תתקיים ביום חמישי בשעה 18:00, נמצא בתוך החלון. המודל רואה אותו עכשיו, ולכן הוא יכול לענות תשובה ממוקדת שמציינת למשתתף את היום והשעה הנכונים.',
        },
        {
            id: 'grew',
            control: 'השיחה התארכה',
            visibleIds: ['m3', 'm4', 'm5'],
            answer:
                'חסר לי מידע על היום או על השעה של הפגישה, אז אני יכול לענות רק באופן כללי. כדאי לבדוק מתי הפגישה נקבעה לפני שמנסחים תשובה מדויקת.',
            answerTone: 'generic',
            caption:
                'השיחה התארכה, וההודעה עם הפרט הקריטי כבר יצאה מחלון ההקשר. ההודעה הישנה אולי עדיין מופיעה על המסך בגלילת השיחה, אבל היא כבר לא בהכרח נכללת בקלט שנשלח למודל בתור הזה. המודל לא רואה אותה עכשיו, ולכן הוא נאלץ לענות בכלליות או לבקש את המידע החסר. הפרט קיים בהיסטוריה, אבל לא בתוך מה שהמודל מעבד ברגע הזה.',
        },
        {
            id: 'restored',
            control: 'פרומפט עצמאי',
            visibleIds: [],
            standalonePrompt:
                'הפגישה תתקיים ביום חמישי בשעה 18:00. אחד המשתתפים שואל מה כדאי לענות לו. נסח תשובה קצרה וברורה.',
            answer:
                'מאחר שהפגישה תתקיים ביום חמישי בשעה 18:00, אפשר לענות למשתתף: הפגישה תתקיים ביום חמישי בשעה 18:00, ואפשר להצטרף כמה דקות מוקדם יותר.',
            answerTone: 'restored',
            caption:
                'במקום להסתמך על שיחה ארוכה ומבולגנת, כתבנו פרומפט אחד עצמאי שכולל את הפרט הקריטי. עכשיו המודל רואה שוב את היום והשעה בתוך הקלט הנוכחי, ויכול לענות תשובה טובה, בלי תלות במה שנאמר קודם.',
        },
    ],
};
