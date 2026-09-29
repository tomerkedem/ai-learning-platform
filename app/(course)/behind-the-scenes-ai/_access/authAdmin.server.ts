// ════════════════════════════════════════════════════════════════════════
// גישה ל-Supabase Auth Admin API (חסימת כניסה בהשעיית חשבון). שרת בלבד.
// ────────────────────────────────────────────────────────────────────────
// מפתח ה-service role נקרא רק כאן, מ-SUPABASE_SERVICE_ROLE_KEY (בלי קידומת NEXT_PUBLIC_,
// ולכן Next לעולם לא מכניס אותו לחבילת לקוח). 'server-only' שובר את הבנייה אם רכיב לקוח
// מייבא את הקובץ. המפתח לא נרשם ביומנים ולא מוחזר בשום תשובה.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import 'server-only';
import { createClient } from '@supabase/supabase-js';

/** חסימה "לתמיד" (כ-100 שנה) לפי תחביר ban_duration של Supabase Auth. */
const BAN_FOREVER = '876000h';

export type AuthBanResult = { ok: true } | { ok: false; error: string };

function adminAuth() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
    }).auth.admin;
}

/** האם השרת מוגדר לחסימת כניסה (יש מפתח). בודקים לפני כל שינוי, כדי לא להתחיל פעולה שלא תושלם. */
export function isAuthAdminConfigured(): boolean {
    return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

/** חוסם (true) או משחרר (false) כניסה. אידמפוטנטי. מחזיר את התוצאה בפועל, בלי לזרוק. */
export async function setSignInBlocked(userId: string, blocked: boolean): Promise<AuthBanResult> {
    const admin = adminAuth();
    if (!admin) return { ok: false, error: 'not_configured' };
    try {
        const { error } = await admin.updateUserById(userId, { ban_duration: blocked ? BAN_FOREVER : 'none' });
        if (error) return { ok: false, error: `${error.status ?? ''} ${error.code ?? error.name}`.trim() };
        return { ok: true };
    } catch (e) {
        return { ok: false, error: e instanceof Error ? e.name : 'network_error' };
    }
}
