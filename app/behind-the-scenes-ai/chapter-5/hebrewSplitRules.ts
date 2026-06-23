// טבלת הפירוק הלימודי לעברית (Hebrew Token Lab) - פרק 5.
// מילים עבריות רבות מחברות אות שימוש (ה, ל, מ, ש, ב, ו) למילה. הטוקנייזר
// הלימודי יכול להציג אותן נפרד כדי להמחיש את הרעיון.
//
// חשוב: זהו פירוק לימודי בלבד (Educational split / Learning tokenizer view).
// טוקנייזר מסחרי אמיתי מפרק לפי סטטיסטיקת תת-מילים, לא לפי אותיות שימוש.
//
// ── איך להרחיב ──────────────────────────────────────────────────────────
// הוסיפו שורה ל-HEBREW_SPLITS עם המילה, הפירוק הפשוט (simple), הפירוק
// הלימודי (educational), ותווית התפקיד בעברית ובאנגלית.

export interface HebrewSplit {
    word: string;
    /** פירוק פשוט: המילה כיחידה אחת. */
    simple: string[];
    /** פירוק לימודי: אות השימוש נפרדת מהמילה הבסיסית. */
    educational: string[];
    roleHe: string;
    roleEn: string;
    /** הסבר עברי קצר על אות השימוש שהופרדה. */
    noteHe: string;
}

export const HEBREW_SPLITS: HebrewSplit[] = [
    {
        word: 'ללקוח',
        simple: ['ללקוח'],
        educational: ['ל', 'לקוח'],
        roleHe: 'הקשר נמען',
        roleEn: 'Recipient context',
        noteHe: 'אות השימוש "ל" מסמנת כיוון: אל מי. המילה הבסיסית היא "לקוח".',
    },
    {
        word: 'מהמערכת',
        simple: ['מהמערכת'],
        educational: ['מ', 'המערכת'],
        roleHe: 'מקור מהמערכת',
        roleEn: 'System source',
        noteHe: 'אות השימוש "מ" מסמנת מקור: מאיפה. המילה הבסיסית היא "המערכת".',
    },
    {
        word: 'שהמשלוח',
        simple: ['שהמשלוח'],
        educational: ['ש', 'המשלוח'],
        roleHe: 'משלוח עם מילת חיבור',
        roleEn: 'Shipment with conjunction',
        noteHe: 'אות השימוש "ש" היא מילת חיבור. המילה הבסיסית היא "המשלוח".',
    },
    {
        word: 'במרכז',
        simple: ['במרכז'],
        educational: ['ב', 'מרכז'],
        roleHe: 'מיקום',
        roleEn: 'Location',
        noteHe: 'אות השימוש "ב" מסמנת מיקום: היכן. המילה הבסיסית היא "מרכז".',
    },
    {
        word: 'החבילה',
        simple: ['החבילה'],
        educational: ['ה', 'חבילה'],
        roleHe: 'אובייקט עם יידוע',
        roleEn: 'Object with article',
        noteHe: 'אות השימוש "ה" מסמנת יידוע: איזו חבילה. המילה הבסיסית היא "חבילה".',
    },
];
