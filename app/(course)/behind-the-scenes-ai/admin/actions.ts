"use server";

// ════════════════════════════════════════════════════════════════════════
// השעיית חשבון והחזרתו (שרת בלבד). שונה מביטול גישה: השעיה חוסמת גם כניסה.
// ────────────────────────────────────────────────────────────────────────
// סדר הפעולות מבטיח שכשל חלקי נשאר תמיד בצד המגביל, ולעולם לא מדווח כהצלחה:
//   השעיה  = המסד חוסם גישה מיד -> חסימת כניסה ב-Auth -> רישום התוצאה בפועל ביומן
//   החזרה  = המסד מאשר שמותר -> שחרור כניסה ב-Auth -> רק אז המסד משחרר גישה
// כל שלב אידמפוטנטי, ולכן ניסיון חוזר בטוח. המסד בודק בכל קריאה שהקורא מנהל ושהיעד
// אינו מנהל (כולל הקורא עצמו), עוד לפני כל קריאה ל-Auth.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import { requestClient } from "../_access/courseAccess";
import { isAuthAdminConfigured, setSignInBlocked } from "../_access/authAdmin.server";

export type AccountActionResult =
    | { outcome: "done" }
    /** Auth נכשל. השעיה: הגישה חסומה אבל הכניסה לא. החזרה: החשבון נשאר מושעה. */
    | { outcome: "auth_failed"; detail: string }
    /** Auth הצליח אבל רישום התוצאה במסד נכשל. ניסיון חוזר ישלים. */
    | { outcome: "record_failed" }
    | { outcome: "not_allowed" }
    | { outcome: "not_configured" }
    | { outcome: "failed" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const refused = (code?: string) => code === "42501" || code === "22023";

export async function suspendAccount(userId: string): Promise<AccountActionResult> {
    if (typeof userId !== "string" || !UUID.test(userId)) return { outcome: "not_allowed" };
    // לא מתחילים פעולה שלא יכולה להסתיים: בלי מפתח שרת, שום דבר לא משתנה.
    if (!isAuthAdminConfigured()) return { outcome: "not_configured" };
    const db = await requestClient();
    if (!db) return { outcome: "not_allowed" };

    // 1. חסימת גישה מיידית (וגם בדיקת הרשאה: מנהל בלבד, לא על מנהל).
    const begin = await db.rpc("admin_begin_suspension", { p_user_id: userId });
    if (begin.error) return { outcome: refused(begin.error.code) ? "not_allowed" : "failed" };

    // 2. חסימת כניסה ב-Supabase Auth.
    const ban = await setSignInBlocked(userId, true);

    // 3. רישום התוצאה בפועל (ביומן ובמצב ההשעיה).
    const finish = await db.rpc("admin_finish_account_action", {
        p_user_id: userId, p_action: "suspend", p_auth_ok: ban.ok, p_error: ban.ok ? null : ban.error,
    });
    if (!ban.ok) return { outcome: "auth_failed", detail: ban.error };
    if (finish.error) return { outcome: "record_failed" };
    return { outcome: "done" };
}

export async function reactivateAccount(userId: string): Promise<AccountActionResult> {
    if (typeof userId !== "string" || !UUID.test(userId)) return { outcome: "not_allowed" };
    if (!isAuthAdminConfigured()) return { outcome: "not_configured" };
    const db = await requestClient();
    if (!db) return { outcome: "not_allowed" };

    // 1. בדיקת הרשאה בלבד, כדי שלא נקרא ל-Auth עבור יעד אסור.
    const check = await db.rpc("admin_check_account_target", { p_user_id: userId });
    if (check.error) return { outcome: refused(check.error.code) ? "not_allowed" : "failed" };

    // 2. שחרור הכניסה. אם נכשל, החשבון נשאר מושעה במסד (גם הגישה חסומה).
    const unban = await setSignInBlocked(userId, false);

    // 3. רק אחרי הצלחה ב-Auth המסד משחרר את הגישה; בכל מקרה נרשמת התוצאה בפועל.
    const finish = await db.rpc("admin_finish_account_action", {
        p_user_id: userId, p_action: "reactivate", p_auth_ok: unban.ok, p_error: unban.ok ? null : unban.error,
    });
    if (!unban.ok) return { outcome: "auth_failed", detail: unban.error };
    if (finish.error) return { outcome: "record_failed" };
    return { outcome: "done" };
}
