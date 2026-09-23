// i18n/config.ts
//
// מקור האמת היחיד לשפות הנתמכות ולכיוון הכתיבה שלהן. כל החלטת RTL/LTR במערכת
// חייבת לנבוע מכאן (LOCALES[locale].dir), ולא מבדיקת locale === 'he'.
//
// עברית היא שפת המקור וברירת המחדל של התוכן. הוספת שפה עתידית (de, fr, ko, it, nl, pt)
// = הוספת רשומה כאן + תיקיית locale תואמת. שום דבר בארכיטקטורה לא חוסם זאת.
//
// הקובץ ללא imports בכוונה: הוא נטען גם בשרת (פתרון השפה), גם בלקוח וגם בבדיקות node.

export type Direction = 'rtl' | 'ltr';

export interface LocaleMeta {
    /** כיוון הכתיבה. he/ar = rtl, השאר = ltr. */
    dir: Direction;
    /** ערך עבור מאפיין lang ב-<html>. */
    htmlLang: string;
    /** שם השפה בשפת עצמה (לבורר השפה). */
    label: string;
    /** האם השפה זמינה לבחירה. */
    enabled: boolean;
}

// שש שפות הבסיס המאושרות, בסדר התצוגה של בורר השפה.
export const LOCALES = {
    he: { dir: 'rtl', htmlLang: 'he', label: 'עברית', enabled: true },
    en: { dir: 'ltr', htmlLang: 'en', label: 'English', enabled: true },
    es: { dir: 'ltr', htmlLang: 'es', label: 'Español', enabled: true },
    ru: { dir: 'ltr', htmlLang: 'ru', label: 'Русский', enabled: true },
    ar: { dir: 'rtl', htmlLang: 'ar', label: 'العربية', enabled: true },
    ja: { dir: 'ltr', htmlLang: 'ja', label: '日本語', enabled: true },
    // שפות עתידיות (לא פעילות עדיין): de, fr, ko, it, nl, pt.
} as const satisfies Record<string, LocaleMeta>;

export type Locale = keyof typeof LOCALES;

/** שפת המקור של התוכן (fallback לשדות שלא תורגמו) ושפת המסלולים שאינם הלומדה. */
export const DEFAULT_LOCALE: Locale = 'he';

/** שפת הלומדה כשאין בחירה, אין שפת דפדפן נתמכת ואין רמז מדינה. */
export const FALLBACK_LOCALE: Locale = 'en';

/** עוגייה פונקציונלית שמחזיקה רק את השפה שהלומד בחר במפורש. */
export const LOCALE_COOKIE = 'bts-locale';

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

// רמז מדינה אופציונלי (רק מכותרת פריסה אמינה, ראו i18n/requestLocale.ts). משמש רק כשאין
// בחירה ואין שפת דפדפן נתמכת. מדינה אינה שפה, ולכן זהו שלב אחרון לפני האנגלית.
const COUNTRY_LOCALE: Record<string, Locale> = {
    IL: 'he',
    JP: 'ja',
    RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru',
    ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es', EC: 'es', GT: 'es',
    CU: 'es', BO: 'es', DO: 'es', HN: 'es', PY: 'es', SV: 'es', NI: 'es', CR: 'es', PA: 'es', UY: 'es',
    SA: 'ar', AE: 'ar', EG: 'ar', JO: 'ar', LB: 'ar', SY: 'ar', IQ: 'ar', KW: 'ar', QA: 'ar', BH: 'ar',
    OM: 'ar', YE: 'ar', MA: 'ar', DZ: 'ar', TN: 'ar', LY: 'ar', SD: 'ar', PS: 'ar',
};

/** השפה הנתמכת המועדפת לפי כותרת Accept-Language (לפי משקל q), או null. */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale | null {
    if (!header) return null;
    const ranked = header
        .split(',')
        .map((part, i) => {
            const [tag, ...params] = part.trim().split(';');
            const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
            const weight = q ? Number(q.slice(2)) : 1;
            return { tag: tag.trim().toLowerCase(), weight: Number.isFinite(weight) ? weight : 0, i };
        })
        .filter((e) => e.tag && e.tag !== '*' && e.weight > 0)
        .sort((a, b) => b.weight - a.weight || a.i - b.i);
    for (const { tag } of ranked) {
        const primary = tag.split('-')[0];
        const code = primary === 'iw' ? 'he' : primary; // iw = קוד עברית היסטורי
        if (isLocale(code)) return code;
    }
    return null;
}

/**
 * פתרון השפה ההתחלתית של הלומדה, לפי הסדר: בחירה מפורשת תקינה (עוגייה), שפת
 * דפדפן נתמכת, רמז מדינה אמין (אם הוגדר), ואחרת אנגלית. פונקציה טהורה.
 */
export function resolveLocale(input: {
    cookie?: string | null;
    acceptLanguage?: string | null;
    country?: string | null;
}): Locale {
    if (isLocale(input.cookie)) return input.cookie;
    const fromBrowser = localeFromAcceptLanguage(input.acceptLanguage);
    if (fromBrowser) return fromBrowser;
    const fromCountry = input.country ? COUNTRY_LOCALE[input.country.trim().toUpperCase()] : undefined;
    return fromCountry ?? FALLBACK_LOCALE;
}
