// טבלת הפירוק הלימודי לעברית (Hebrew Token Lab) - פרק 3.
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
        word: 'לחבר',
        simple: ['לחבר'],
        educational: ['ל', 'חבר'],
        roleHe: 'הקשר נמען',
        roleEn: 'Recipient context',
        noteHe: 'אות השימוש "ל" מסמנת כיוון: אל מי. המילה הבסיסית היא "חבר".',
    },
    {
        word: 'מהבית',
        simple: ['מהבית'],
        educational: ['מ', 'הבית'],
        roleHe: 'מקור מהבית',
        roleEn: 'Source',
        noteHe: 'אות השימוש "מ" מסמנת מקור: מאיפה. המילה הבסיסית היא "הבית".',
    },
    {
        word: 'שהעוגה',
        simple: ['שהעוגה'],
        educational: ['ש', 'העוגה'],
        roleHe: 'עוגה עם מילת חיבור',
        roleEn: 'Object with conjunction',
        noteHe: 'אות השימוש "ש" היא מילת חיבור. המילה הבסיסית היא "העוגה".',
    },
    {
        word: 'בבית',
        simple: ['בבית'],
        educational: ['ב', 'בית'],
        roleHe: 'מיקום',
        roleEn: 'Location',
        noteHe: 'אות השימוש "ב" מסמנת מיקום: היכן. המילה הבסיסית היא "בית".',
    },
    {
        word: 'החתול',
        simple: ['החתול'],
        educational: ['ה', 'חתול'],
        roleHe: 'אובייקט עם יידוע',
        roleEn: 'Object with article',
        noteHe: 'אות השימוש "ה" מסמנת יידוע: איזה חתול. המילה הבסיסית היא "חתול".',
    },
];
