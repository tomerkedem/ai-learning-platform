// ════════════════════════════════════════════════════════════════════════
// לוגיקה טהורה של טופס החשבון (AccountPanel): בדיקת שדות לפני שליחה, כלל השם לפי שפה, מיפוי
// שגיאות Supabase Auth למפתחות הודעה מתורגמים, וקריאה וניקוי של חזרה מקישור מייל (טוקנים או
// שגיאה). בלי תלות ב-React או בלקוח Supabase, כדי שאפשר
// לבדוק אותה ב-node --test (authForm.test.ts).
// הודעה גולמית מהשרת לעולם לא מוצגת ללומד: כל שגיאה ממופה למפתח ידוע, וכל השאר ל-"generic".
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

export type AuthMode = "signin" | "signup" | "reset";
export type AuthField = "fullName" | "email" | "password";
export type FieldErrorKey = "nameInvalid" | "emailRequired" | "emailInvalid" | "passwordRequired" | "passwordShort";
export type FieldErrors = Partial<Record<AuthField, FieldErrorKey>>;

/** מינימום האורך שהשרת מקבל (ברירת המחדל של Supabase Auth). שינוי בהגדרות הפרויקט מחייב עדכון כאן. */
export const PASSWORD_MIN = 6;

// בדיקת צורה בלבד (משהו@משהו.סיומת, בלי רווחים). השרת נשאר הבודק הסופי.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * שגיאות שדה לפי מצב הטופס, בסדר השדות בטופס (הראשון מקבל פוקוס).
 * nameOk: תוצאת normalizeFullName (אותו כלל שהמסד אוכף).
 * בהתחברות בודקים רק שהסיסמה לא ריקה: סיסמה ישנה לא נחסמת לפי הכלל הנוכחי.
 */
export function validateAuth(mode: AuthMode, v: { nameOk: boolean; email: string; password: string }): FieldErrors {
    const errors: FieldErrors = {};
    if (mode === "signup" && !v.nameOk) errors.fullName = "nameInvalid";
    const email = v.email.trim();
    if (!email) errors.email = "emailRequired";
    else if (!EMAIL_RE.test(email)) errors.email = "emailInvalid";
    if (mode !== "reset") {
        if (!v.password) errors.password = "passwordRequired";
        else if (mode === "signup" && v.password.length < PASSWORD_MIN) errors.password = "passwordShort";
    }
    return errors;
}

/**
 * מנרמל ובודק שם מלא בהרשמה. אותו כלל אוכף טריגר ההרשמה במסד (create_profile_for_new_user),
 * כך שהלקוח והשרת לא סותרים: רווחים בקצוות נחתכים ורצף רווחים (כל רווח Unicode) הופך לרווח
 * אחד; עד 100 תווים (נקודות קוד, כמו char_length); בלי תווי בקרה.
 * ja: שמות יפניים נכתבים בדרך כלל בלי רווח (山田太郎), ולכן מספיקים 2 תווים.
 * שאר השפות: לפחות שני חלקים מופרדים ברווח ולפחות 5 תווים.
 * locale null: עריכת מנהל, שחל עליה רק כלל הבסיס של המסד (profiles_full_name_valid, 2 עד 100).
 * מחזיר null כשהשם לא תקין.
 */
export function normalizeFullName(raw: string, locale: string | null): string | null {
    const name = raw.trim().replace(/\s+/g, " ");
    const length = [...name].length;
    if (length > 100 || /\p{Cc}/u.test(name)) return null;
    if (locale === "ja" || locale === null) return length >= 2 ? name : null;
    return length >= 5 && name.includes(" ") ? name : null;
}

/** יעד קבוע לאחר אישור הרשמה במייל: המבוא. אימות מייל אינו נותן גישה, ולכן לא חוזרים לפרק מוגן. */
export const SIGNUP_CONFIRM_PATH = "/behind-the-scenes-ai/introduction";

export function signupRedirectUrl(origin: string): string {
    return new URL(SIGNUP_CONFIRM_PATH, origin).href;
}

// פרמטרים ש-Supabase מוסיף לכתובת החזרה של קישור מייל שנכשל (פג תוקף, כבר נוצל, לא תקין),
// ב-hash (זרימת implicit, ברירת המחדל כאן) או ב-query.
const LINK_ERROR_PARAMS = ["error", "error_code", "error_description", "sb"];
// פרמטרי session ש-Supabase מצרף ל-hash אחרי קישור מייל שהצליח (זרימת implicit).
const SESSION_HASH_PARAMS = [
    "access_token", "refresh_token", "expires_at", "expires_in", "token_type", "type",
    "provider_token", "provider_refresh_token",
];

export interface AuthRedirect {
    /** הכתובת בלי שום פרמטר אימות. עוגן רגיל (#intro-more) ופרמטרים אחרים נשמרים. */
    cleanUrl: string;
    /** הטוקנים לביסוס ה-session (רק מקישור שהצליח). לעולם לא נשמרים בכתובת או ביומן. */
    tokens: { access_token: string; refresh_token: string } | null;
    /** קישור איפוס סיסמה. */
    recovery: boolean;
    /** קישור שנכשל (פג תוקף, נוצל, לא תקין): מוצגת הודעה. */
    linkError: boolean;
}

/**
 * מזהה חזרה מקישור מייל של Supabase (הצלחה או שגיאה) ומחזיר את מה שצריך כדי לבסס session,
 * יחד עם כתובת נקייה להחלפה מיידית בשורת הכתובת. null = אין בכתובת שום פרמטר אימות.
 */
export function readAuthRedirect(href: string): AuthRedirect | null {
    const url = new URL(href);
    const hash = new URLSearchParams(url.hash.slice(1));
    const isError = (p: URLSearchParams) => p.has("error_code") || (p.has("error") && p.has("error_description"));
    const queryError = isError(url.searchParams);
    const hashError = isError(hash);
    const hasSession = hash.has("access_token") || hash.has("refresh_token");
    if (!queryError && !hashError && !hasSession) return null;
    const access = hash.get("access_token");
    const refresh = hash.get("refresh_token");
    const recovery = hash.get("type") === "recovery";
    if (queryError) for (const key of LINK_ERROR_PARAMS) url.searchParams.delete(key);
    if (hashError || hasSession) for (const key of [...SESSION_HASH_PARAMS, ...LINK_ERROR_PARAMS]) hash.delete(key);
    url.hash = hash.toString();
    return {
        cleanUrl: url.toString(),
        tokens: access && refresh && !hashError ? { access_token: access, refresh_token: refresh } : null,
        recovery,
        linkError: queryError || hashError,
    };
}

export type AuthErrorKey =
    | "invalid" | "unconfirmed" | "weakPassword" | "samePassword" | "suspended"
    | "emailRateLimit" | "rateLimit" | "accountExists" | "emailInvalid" | "network" | "generic";

/**
 * ממפה שגיאה מ-supabase-js (AuthError עם code/status/name) או חריגה שנזרקה למפתח הודעה.
 * user_already_exists מוחזר רק כשאישור מייל כבוי; ההודעה עליו ניטרלית (התחברו או אפסו
 * סיסמה) ואינה מאשרת שהחשבון קיים. עם אישור מייל פעיל Supabase מחזיר הצלחה מדומה, ולכן
 * ההרשמה לכתובת קיימת נראית זהה להרשמה חדשה.
 */
export function authErrorKey(error: unknown): AuthErrorKey {
    const e = (error ?? {}) as { code?: unknown; status?: unknown; name?: unknown };
    switch (e.code) {
        case "invalid_credentials": return "invalid";
        case "email_not_confirmed": return "unconfirmed";
        case "weak_password": return "weakPassword";
        case "same_password": return "samePassword";
        case "user_banned": return "suspended";
        case "over_email_send_rate_limit": return "emailRateLimit";
        case "over_request_rate_limit": return "rateLimit";
        case "user_already_exists":
        case "email_exists": return "accountExists";
        case "email_address_invalid": return "emailInvalid";
    }
    if (e.status === 429) return "rateLimit";
    // רשת רק כשהבקשה לא הגיעה לשרת: AuthRetryableFetchError עם status 0, או fetch שנזרק
    // (TypeError). supabase-js מחזיר את אותו AuthRetryableFetchError גם לכל 5xx, וזו תקלת
    // שרת, לא חיבור: הודעה כללית, ולא "בדקו את החיבור לאינטרנט".
    if ((e.name === "AuthRetryableFetchError" && !e.status) || e.name === "TypeError") return "network";
    return "generic";
}
