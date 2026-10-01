// ════════════════════════════════════════════════════════════════════════
// מסמכים משפטיים: איזה דף מידע הוא מקור הנוסח של כל סוג מסמך, ומה בדיוק נכנס לטביעת האצבע.
// ────────────────────────────────────────────────────────────────────────
// הנוסח נכתב במילוני השפות במאגר. המסד (public.legal_document_versions ו-
// legal_document_translations) הוא שקובע איזו גרסה ואיזו מהדורת תרגום נוכחיות; אין כאן קבוע גרסה.
// גוף המסמך המשפטי = title, lead ו-blocks של הדף. navTitle ו-summary הם טקסט ניווט, ואינם
// נכנסים לטביעה. אותו כלל משמש את השרת (betaActions.ts), את scripts/legal-document-version.mjs
// ואת הבדיקות, ולכן הקובץ בלי 'server-only' ובלי ייבוא בזמן ריצה מלבד node:crypto. לא לייבא
// מרכיב לקוח.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import { createHash } from 'node:crypto';
import type { InfoPageContent, InfoPageKey } from '@/i18n/locales/he/behind-ai/infoPages';

/** סוג מסמך במסד ← דף המידע שהוא מקור הנוסח. null = אין עדיין נוסח במאגר. */
export const LEGAL_DOCUMENT_PAGES = {
    beta_terms: 'betaTerms',
    privacy_policy: 'privacy',
    // תשתית בלבד: נוסח תנאי השימוש המסחריים ממתין לבדיקה משפטית, והסכמה להם אינה פעילה.
    terms_of_service: null,
} as const satisfies Record<string, InfoPageKey | null>;

export type LegalDocumentType = keyof typeof LEGAL_DOCUMENT_PAGES;

/** הטקסט המדויק שנשמר במסד כמהדורת תרגום: JSON של גוף המסמך בלבד. */
export function legalBody(page: InfoPageContent): string {
    return JSON.stringify({ title: page.title, lead: page.lead, blocks: page.blocks });
}

export function legalBodySha256(page: InfoPageContent): string {
    return createHash('sha256').update(legalBody(page)).digest('hex');
}

/** בלוק טיוטה בגוף המסמך: אסור לפרסם או לקבל הסכמה לנוסח כזה (המסד מסרב גם כן). */
export function hasPlaceholder(page: InfoPageContent): boolean {
    return page.blocks.some((b) => b.kind === 'placeholder');
}
