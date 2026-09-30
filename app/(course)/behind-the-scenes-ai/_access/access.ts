// ════════════════════════════════════════════════════════════════════════
// גישה ללומדה: הגדרות משותפות לשרת וללקוח (בלי סודות ובלי לוגיקת הרשאה).
// ────────────────────────────────────────────────────────────────────────
// אורחים רואים רק תצוגה מקדימה של המבוא (ההירו ודוגמת הצ'אט). המבוא המלא ופרק 1 פתוחים
// ללומד מחובר עם מייל מאומת שאינו מושעה. פרקים 2-19, המבדקים שלהם ומבחן הסיום דורשים
// הרשאת בטא פעילה שאושרה במפורש; הרשמה או אימות מייל אינם נותנים אותה.
// ההחלטה עצמה מתקבלת רק בשרת (courseAccess.ts), בכל בקשה. מצב נעילה בסרגל הצד הוא תצוגה
// בלבד, ואינו מקור הרשאה.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

/** עוגייה שבה הדפדפן משקף את ה-access token של Supabase, כדי שהשרת יוכל לזהות את הלומד. */
export const ACCESS_TOKEN_COOKIE = 'bts-access-token';

/**
 * signed-out: אין משתמש מחובר (או שהטוקן פג/לא תקף).
 * unconfirmed: מחובר, אבל כתובת המייל עוד לא אומתה.
 * no-grant: מחובר בלי הרשאה (ברירת המחדל לכל משתמש חדש, גם אחרי אימות מייל).
 * unavailable: לא ניתן היה לבדוק כרגע (תקלה); נכשלים סגור.
 */
export type AccessStatus = 'signed-out' | 'unconfirmed' | 'no-grant' | 'expired' | 'revoked' | 'active' | 'unavailable' | 'suspended';

export interface CourseAccess {
    status: AccessStatus;
    /** מועד סיום ההרשאה (ISO), כשידוע: פעילה או שפגה. */
    expiresAt: string | null;
}

/**
 * גרסת תנאי הבטא שהלומד מסכים לה בבקשת גישה, כפי שנרשמה ב-public.beta_terms_versions
 * (scripts/beta-terms-version.mjs). null = אין עדיין גרסה מאושרת (בדף התנאים יש טיוטות),
 * ולכן שליחת בקשות חסומה. המסד אוכף זאת בנפרד.
 */
export const BETA_TERMS_VERSION: string | null = null;

/**
 * רמת הגישה שתוכן דורש: learner = לומד מחובר, מאומת ולא מושעה (המבוא המלא ופרק 1);
 * grant = הרשאת בטא פעילה (פרקים 2-19 ומבחן הסיום).
 */
export type AccessLevel = 'learner' | 'grant';

/** האם מצב הגישה פותח תוכן ברמה הנדרשת. */
export function meetsAccessLevel(status: AccessStatus, level: AccessLevel): boolean {
    if (level === 'grant') return status === 'active';
    return status === 'no-grant' || status === 'expired' || status === 'revoked' || status === 'active';
}

/** רמת הגישה של כתובת בלומדה, לנעילה בסרגל. null = פתוחה (גם המבוא, שיש לו תצוגה מקדימה). */
export function coursePathLevel(href: string | undefined | null): AccessLevel | null {
    if (!href) return null;
    if (href === '/behind-the-scenes-ai/final-exam') return 'grant';
    const m = href.match(/^\/behind-the-scenes-ai\/chapter-(\d+)$/);
    if (!m) return null;
    return Number(m[1]) >= 2 ? 'grant' : 'learner';
}
