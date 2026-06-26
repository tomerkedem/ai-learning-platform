// נתוני "מעבדת השוואת קלט" של פרק 2 (מה באמת נכנס למודל).
// נתון דקלרטיבי טהור: אין כאן מנוע, חישוב או קריאת כלי. אותו עולם תוכן (חבילה),
// חמישה ניסוחים, וכל ניסוח מכניס למודל חומר אחר לעבוד איתו.
//
// חשוב: הפרק הזה לא מלמד טוקניזציה לעומק. אנחנו מסתכלים רק על מה הקלט מכיל,
// לפני שהוא מפורק לטוקנים. אין כאן מקף ארוך, מקף בינוני או נקודה-פסיק בעברית.

export type Ambiguity = 'low' | 'medium' | 'high';
export type Tendency = 'chat' | 'chat-agent' | 'agent';

export interface InputVariation {
    id: string;
    /** תווית קצרה ללשונית הבורר. */
    label: string;
    /** הפרומפט המלא. */
    prompt: string;
    /** מה מפורש בטקסט. */
    explicit: string[];
    /** מה חסר. */
    missing: string[];
    /** מה השתנה לעומת ניסוח הבסיס. ריק עבור הבסיס עצמו. */
    changed: string;
    ambiguity: Ambiguity;
    /** מה מצופה מהמודל. */
    expectation: string;
    /** האם דרוש מידע חיצוני. */
    externalData: boolean;
    externalNote?: string;
    /** לאן זה נוטה: Chat, Agent, או ביניהם. */
    tendency: Tendency;
    /** הערת הוראה אופציונלית (למשל הקשר מול אימון). */
    note?: string;
}

export const BASE_ID = 'base';

export const INPUT_VARIATIONS: InputVariation[] = [
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
];
