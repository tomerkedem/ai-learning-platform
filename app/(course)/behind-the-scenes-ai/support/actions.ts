"use server";

// ════════════════════════════════════════════════════════════════════════
// פעולות תמיכה של הלומד (שרת). כל פעולה רצה עם ה-token של הלומד מהעוגייה, והמסד בודק
// זהות, אימות מייל, השעיה, בעלות על הבקשה ומגבלות (create_support_ticket,
// add_support_message). קודי המסד ממופים לתוצאות מוגדרות; קוד גולמי לא מגיע ללומד.
// השפה נלקחת מהבקשה בשרת, ונתיב המקור מנוקה שוב כאן לפני השליחה.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import { refresh } from "next/cache";
import { getRequestLocale } from "@/i18n/requestLocale";
import { requestClient } from "../_access/courseAccess";
import { isSupportKind, isUuid, normalizeSupportFrom, SUPPORT_MAX_CHARS } from "./supportShared";

export type SupportOutcome = "too_many_open" | "daily_limit" | "closed" | "not_found" | "invalid" | "not_allowed" | "failed";
export type CreateSupportResult = { ok: true; id: string } | { ok: false; outcome: SupportOutcome };
export type ReplySupportResult = { ok: true } | { ok: false; outcome: SupportOutcome };

function outcomeOf(code: string | undefined): SupportOutcome {
    switch (code) {
        case "BT101": return "too_many_open";
        case "BT102": return "daily_limit";
        case "BT103": return "closed";
        case "BT104": return "not_found";
        case "22023": return "invalid";
        case "42501": case "PGRST301": return "not_allowed";
        default: return "failed";
    }
}

// גבול גס לגודל הקלט לפני הקריאה למסד (המסד אוכף 4000 תווים אחרי נרמול).
const tooLarge = (body: string) => body.length > SUPPORT_MAX_CHARS * 2;

export async function createSupportRequest(kind: unknown, body: unknown, from: unknown): Promise<CreateSupportResult> {
    if (!isSupportKind(kind) || typeof body !== "string" || tooLarge(body)) return { ok: false, outcome: "invalid" };
    const db = await requestClient();
    if (!db) return { ok: false, outcome: "not_allowed" };
    try {
        const { data, error } = await db.rpc("create_support_ticket", {
            p_kind: kind,
            p_body: body,
            p_locale: await getRequestLocale(),
            p_route: normalizeSupportFrom(from),
        });
        if (error) return { ok: false, outcome: outcomeOf(error.code) };
        return isUuid(data) ? { ok: true, id: data } : { ok: false, outcome: "failed" };
    } catch {
        return { ok: false, outcome: "failed" };
    }
}

export async function sendSupportReply(requestId: unknown, body: unknown): Promise<ReplySupportResult> {
    if (!isUuid(requestId) || typeof body !== "string" || tooLarge(body)) return { ok: false, outcome: "invalid" };
    const db = await requestClient();
    if (!db) return { ok: false, outcome: "not_allowed" };
    try {
        const { error } = await db.rpc("add_support_message", { p_ticket_id: requestId, p_body: body });
        if (error) return { ok: false, outcome: outcomeOf(error.code) };
    } catch {
        return { ok: false, outcome: "failed" };
    }
    // השיחה והסטטוס (פתיחה מחדש) מגיעים מהמסד ברענון העמוד.
    refresh();
    return { ok: true };
}

/** פתיחת בקשה מסמנת את ההתראות שלה כנקראו. כשל אינו משפיע על התצוגה. */
export async function markSupportRequestRead(requestId: unknown): Promise<void> {
    if (!isUuid(requestId)) return;
    const db = await requestClient();
    if (!db) return;
    try {
        await db.rpc("mark_notifications_read", { p_subject_id: requestId });
    } catch {
        // התעלמות: אין כאן מצב לשחזר.
    }
}
