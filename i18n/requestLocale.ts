// i18n/requestLocale.ts
//
// פתרון השפה של בקשה נכנסת, בצד השרת בלבד (root layout של הלומדה ו-generateMetadata).
// הלוגיקה עצמה ב-resolveLocale (config.ts); כאן רק קריאת העוגייה והכותרות.
//
// רמז מדינה: רק כשהפריסה מגדירה LOCALE_COUNTRY_HEADER לשם כותרת שפלטפורמת האירוח
// קובעת בעצמה ודורסת (למשל x-vercel-ip-country או cf-ipcountry). כותרת שהלקוח יכול
// לשלוח בעצמו אינה אמינה, ולכן בלי המשתנה השלב הזה מדולג. אין geolocation ואין שירות חיצוני.

import { cookies, headers } from 'next/headers';
import { LOCALE_COOKIE, resolveLocale, type Locale } from './config';

export async function getRequestLocale(): Promise<Locale> {
    const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
    const countryHeader = process.env.LOCALE_COUNTRY_HEADER;
    return resolveLocale({
        cookie: cookieStore.get(LOCALE_COOKIE)?.value,
        acceptLanguage: headerStore.get('accept-language'),
        country: countryHeader ? headerStore.get(countryHeader) : null,
    });
}
