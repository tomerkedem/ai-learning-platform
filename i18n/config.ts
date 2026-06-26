// i18n/config.ts
//
// מקור האמת היחיד לשפות הנתמכות ולכיוון הכתיבה שלהן. כל החלטת RTL/LTR במערכת
// חייבת לנבוע מכאן (LOCALES[locale].dir), ולא מבדיקת locale === 'he'.
//
// עברית היא שפת המקור וברירת המחדל. הוספת שפה עתידית (de, fr, ko, it, nl, pt)
// = הוספת רשומה כאן + תיקיית locale תואמת. שום דבר בארכיטקטורה לא חוסם זאת.

export type Direction = 'rtl' | 'ltr';

export interface LocaleMeta {
    /** כיוון הכתיבה. he/ar = rtl, השאר = ltr. */
    dir: Direction;
    /** ערך עבור מאפיין lang ב-<html>. */
    htmlLang: string;
    /** שם השפה בשפת עצמה, לבורר הפיתוח. */
    label: string;
    /** האם השפה זמינה לבחירה. */
    enabled: boolean;
}

// שש שפות הבסיס המאושרות. עברית ראשונה (ברירת המחדל).
export const LOCALES = {
    he: { dir: 'rtl', htmlLang: 'he', label: 'עברית', enabled: true },
    ar: { dir: 'rtl', htmlLang: 'ar', label: 'العربية', enabled: true },
    ru: { dir: 'ltr', htmlLang: 'ru', label: 'Русский', enabled: true },
    en: { dir: 'ltr', htmlLang: 'en', label: 'English', enabled: true },
    es: { dir: 'ltr', htmlLang: 'es', label: 'Español', enabled: true },
    ja: { dir: 'ltr', htmlLang: 'ja', label: '日本語', enabled: true },
    // שפות עתידיות (לא פעילות עדיין): de, fr, ko, it, nl, pt.
} as const satisfies Record<string, LocaleMeta>;

export type Locale = keyof typeof LOCALES;

/** שפת המקור וברירת המחדל. */
export const DEFAULT_LOCALE: Locale = 'he';

/** כל השפות לפי סדר ההגדרה. */
export const LOCALE_LIST = Object.keys(LOCALES) as Locale[];

/** type guard: האם המחרוזת היא locale פעיל ומוכר. */
export function isLocale(value: string | null | undefined): value is Locale {
    return (
        !!value &&
        Object.prototype.hasOwnProperty.call(LOCALES, value) &&
        LOCALES[value as Locale].enabled
    );
}

/** כיוון הכתיבה של שפה. מקור האמת היחיד ל-RTL/LTR. */
export function dirOf(locale: Locale): Direction {
    return LOCALES[locale].dir;
}
