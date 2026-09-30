"use server";

// ════════════════════════════════════════════════════════════════════════
// שליחת בקשת גישת בטא (שרת). הבקשה אינה נותנת גישה; רק אישור מנהל נותן.
// ────────────────────────────────────────────────────────────────────────
// השרת מצרף את גרסת התנאים וטביעת האצבע של הטקסט שמוצג כרגע. המסד (request_beta_access)
// בודק בעצמו זהות, אימות מייל, השעיה, הסכמה, שהגרסה נוכחית ושאין בקשה ממתינה. כל עוד בדף
// התנאים יש טיוטות אין גרסה נוכחית, והשליחה נחסמת כאן וגם במסד.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import { isLocale } from "@/i18n/config";
import { requestClient } from "./courseAccess";
import { BETA_TERMS_VERSION } from "./access";
import { BETA_TERMS_HAVE_PLACEHOLDERS, BETA_TERMS_SHA256 } from "./betaTerms.server";

export type BetaRequestOutcome =
    | "submitted" | "duplicate" | "not_allowed" | "has_access" | "consent" | "terms_unavailable" | "failed";

export async function submitBetaRequest(consent: boolean, locale: string): Promise<BetaRequestOutcome> {
    if (consent !== true) return "consent";
    if (!BETA_TERMS_VERSION || BETA_TERMS_HAVE_PLACEHOLDERS) return "terms_unavailable";
    if (!isLocale(locale)) return "failed";
    const db = await requestClient();
    if (!db) return "not_allowed";
    try {
        const { error } = await db.rpc("request_beta_access", {
            p_terms_version: BETA_TERMS_VERSION, p_terms_sha256: BETA_TERMS_SHA256, p_locale: locale, p_consent: true,
        });
        if (!error) return "submitted";
        switch (error.code) {
            case "23505": return "duplicate";
            case "42501": case "PGRST301": return "not_allowed";
            case "BT001": return "consent";
            case "BT002": return "terms_unavailable";
            case "BT003": return "has_access";
            default: return "failed";
        }
    } catch {
        return "failed";
    }
}
