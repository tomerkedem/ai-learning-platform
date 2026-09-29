// ════════════════════════════════════════════════════════════════════════
// גישה ללומדה: הגדרות משותפות לשרת וללקוח (בלי סודות ובלי לוגיקת הרשאה).
// ────────────────────────────────────────────────────────────────────────
// המבוא ופרק 1 פתוחים לכולם. פרקים 2-19, המבדקים שלהם ומבחן הסיום דורשים הרשאת בטא
// פעילה שאושרה במפורש. הרשמה או אימות מייל אינם נותנים גישה.
// ההחלטה עצמה מתקבלת רק בשרת (courseAccess.ts), בכל בקשה. מצב נעילה בסרגל הצד הוא תצוגה
// בלבד, ואינו מקור הרשאה.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

/** עוגייה שבה הדפדפן משקף את ה-access token של Supabase, כדי שהשרת יוכל לזהות את הלומד. */
export const ACCESS_TOKEN_COOKIE = 'bts-access-token';

/**
 * signed-out: אין משתמש מחובר (או שהטוקן פג/לא תקף).
 * no-grant: מחובר בלי הרשאה (ברירת המחדל לכל משתמש חדש, גם אחרי אימות מייל).
 * unavailable: לא ניתן היה לבדוק כרגע (תקלה); נכשלים סגור.
 */
export type AccessStatus = 'signed-out' | 'no-grant' | 'expired' | 'revoked' | 'active' | 'unavailable';

export interface CourseAccess {
    status: AccessStatus;
    /** מועד סיום ההרשאה (ISO), כשידוע: פעילה או שפגה. */
    expiresAt: string | null;
}

/** האם כתובת בלומדה דורשת הרשאה: פרקים 2-19 ומבחן הסיום. */
export function isProtectedCoursePath(href: string | undefined | null): boolean {
    if (!href) return false;
    if (href === '/behind-the-scenes-ai/final-exam') return true;
    const m = href.match(/^\/behind-the-scenes-ai\/chapter-(\d+)$/);
    return !!m && Number(m[1]) >= 2;
}
