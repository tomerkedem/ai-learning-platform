"use server";

// ════════════════════════════════════════════════════════════════════════
// בקשת גישת בטא (שרת). הבקשה אינה נותנת גישה; רק אישור מנהל נותן.
// ────────────────────────────────────────────────────────────────────────
// השרת שולח את סוג המסמך, השפה וטביעת האצבע של גוף תנאי הבטא כפי שהוא מוצג בשפה הזו
// (legalDocuments.ts). המסד (request_beta_access) מאתר בעצמו את הגרסה ומהדורת התרגום הנוכחיות,
// דוחה טביעה שאינה תואמת, ורושם הסכמה ובקשה יחד, בטרנזקציה אחת. הוא גם בודק זהות, אימות
// מייל, השעיה, הסכמה, גישה פעילה ובקשה ממתינה. אין כאן קבוע גרסה: המסד קובע.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import { isLocale, type Locale } from "@/i18n/config";
import type { InfoPageContent } from "@/i18n/locales/he/behind-ai/infoPages";
import { infoPages as he } from "@/i18n/locales/he/behind-ai/infoPages";
import { infoPages as en } from "@/i18n/locales/en/behind-ai/infoPages";
import { infoPages as es } from "@/i18n/locales/es/behind-ai/infoPages";
import { infoPages as ru } from "@/i18n/locales/ru/behind-ai/infoPages";
import { infoPages as ar } from "@/i18n/locales/ar/behind-ai/infoPages";
import { infoPages as ja } from "@/i18n/locales/ja/behind-ai/infoPages";
import { requestClient } from "./courseAccess";
import { hasPlaceholder, legalBodySha256 } from "./legalDocuments";

const BETA_TERMS: Record<Locale, InfoPageContent> = {
    he: he.pages.betaTerms,
    en: en.pages.betaTerms,
    es: es.pages.betaTerms,
    ru: ru.pages.betaTerms,
    ar: ar.pages.betaTerms,
    ja: ja.pages.betaTerms,
};

export interface BetaTermsState {
    /** true רק כשבמסד יש גרסה נוכחית ומהדורת התרגום הנוכחית לשפה זהה לטקסט שמוצג כאן. */
    ready: boolean;
    version: string | null;
    /** true כשלבקשה הממתינה של הלומד צריך הסכמה מחודשת (פורסמה גרסה מהותית חדשה). */
    reaccept: boolean;
}

export async function getBetaTermsState(locale: string): Promise<BetaTermsState> {
    const none = { ready: false, version: null, reaccept: false };
    if (!isLocale(locale) || hasPlaceholder(BETA_TERMS[locale])) return none;
    const db = await requestClient();
    if (!db) return none;
    try {
        const { data, error } = await db
            .from("legal_document_versions")
            .select("version, legal_document_translations!inner(content_sha256)")
            .eq("document_type", "beta_terms")
            .eq("is_current", true)
            .eq("legal_document_translations.locale", locale)
            .eq("legal_document_translations.is_current", true)
            .maybeSingle<{ version: string; legal_document_translations: { content_sha256: string }[] }>();
        const sha = legalBodySha256(BETA_TERMS[locale]);
        if (error || !data?.legal_document_translations.some((t) => t.content_sha256 === sha)) return none;
        const { data: reaccept } = await db.rpc("beta_request_needs_reacceptance");
        return { ready: true, version: data.version, reaccept: reaccept === true };
    } catch {
        return none;
    }
}

export type BetaRequestOutcome =
    | "submitted" | "duplicate" | "not_allowed" | "has_access" | "consent" | "terms_unavailable" | "failed";

export async function submitBetaRequest(consent: boolean, locale: string): Promise<BetaRequestOutcome> {
    if (consent !== true) return "consent";
    if (!isLocale(locale)) return "failed";
    if (hasPlaceholder(BETA_TERMS[locale])) return "terms_unavailable";
    const db = await requestClient();
    if (!db) return "not_allowed";
    try {
        const { error } = await db.rpc("request_beta_access", {
            p_document_type: "beta_terms", p_locale: locale, p_body_sha256: legalBodySha256(BETA_TERMS[locale]), p_consent: true,
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
