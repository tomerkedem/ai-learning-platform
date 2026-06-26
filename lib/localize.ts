// lib/localize.ts
//
// עזר לשדות טקסט מרובי-שפות שחיים בתוך נתונים מובְנים (למשל courseData).
// המבנה: עברית תמיד קיימת (שפת המקור), שאר השפות אופציונליות. כל שפה שחסרה
// נופלת בחזרה לעברית. כך אפשר להרחיב את טיפוס השפות בלי לשבור נתונים קיימים
// שיש בהם he בלבד (או he+en).

import type { Locale } from '@/i18n/config';

/** שדה טקסט שתורגם לשפה אחת או יותר. he חובה ומשמש כ-fallback. */
export type LocalizedText = { he: string } & Partial<Record<Locale, string>>;

/** מחזיר את הטקסט בשפה המבוקשת, או בעברית אם השפה חסרה. */
export function tField(field: LocalizedText, locale: Locale): string {
    return field[locale] ?? field.he;
}
