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

// נתוני חמשת הניסוחים (כולל הטקסט הגלוי) עברו למילון הפרק (chapter2Visuals.inputVariations)
// בשלב ה-i18n. כאן נשארים רק הטיפוסים והקבוע המבני BASE_ID. הרכיב קורא את הנתונים מהמילון.
