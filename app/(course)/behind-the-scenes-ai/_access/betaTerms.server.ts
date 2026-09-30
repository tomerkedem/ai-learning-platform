// ════════════════════════════════════════════════════════════════════════
// טביעת האצבע של תנאי הבטא כפי שהם מוצגים כרגע. שרת בלבד.
// ────────────────────────────────────────────────────────────────────────
// SHA-256 של דף תנאי הבטא בכל שש השפות. בשליחת בקשה המסד משווה אותו לגרסה הנוכחית
// (public.beta_terms_versions), כך שבקשה לעולם לא נרשמת לגרסה שהטקסט שלה שונה ממה שמוצג.
// חייב להתאים ל-scripts/beta-terms-version.mjs (אותו סדר שפות, אותו JSON).
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import 'server-only';
import { createHash } from 'node:crypto';
import { infoPages as he } from '@/i18n/locales/he/behind-ai/infoPages';
import { infoPages as en } from '@/i18n/locales/en/behind-ai/infoPages';
import { infoPages as es } from '@/i18n/locales/es/behind-ai/infoPages';
import { infoPages as ru } from '@/i18n/locales/ru/behind-ai/infoPages';
import { infoPages as ar } from '@/i18n/locales/ar/behind-ai/infoPages';
import { infoPages as ja } from '@/i18n/locales/ja/behind-ai/infoPages';

const pages = {
    he: he.pages.betaTerms,
    en: en.pages.betaTerms,
    es: es.pages.betaTerms,
    ru: ru.pages.betaTerms,
    ar: ar.pages.betaTerms,
    ja: ja.pages.betaTerms,
};

/** true כשבאחת השפות נשאר בלוק טיוטה: אז אין גרסת הסכמה, והשליחה חסומה. */
export const BETA_TERMS_HAVE_PLACEHOLDERS = Object.values(pages).some((p) => p.blocks.some((b) => b.kind === 'placeholder'));

export const BETA_TERMS_SHA256 = createHash('sha256').update(JSON.stringify(pages)).digest('hex');
