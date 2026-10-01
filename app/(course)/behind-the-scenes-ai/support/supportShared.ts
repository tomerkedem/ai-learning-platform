// ════════════════════════════════════════════════════════════════════════
// תמיכה בתוך הלומדה: הגדרות משותפות לשרת וללקוח (בלי סודות ובלי גישה למסד).
// ────────────────────────────────────────────────────────────────────────
// המסד (migration 20261002110000_support_tickets) הוא מקור האמת: הוא בודק זהות, השעיה,
// מגבלות, את נתיב המקור ואת הסטטוס שהלומד רואה (private.support_learner_status). כאן רק
// הטיפוסים שהוא מחזיר וניקוי מוקדם של נתיב המקור, כדי שנתיב לא תקין יושמט ולא יחסום בקשה.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import type { AccessStatus } from "../_access/access";

export const SUPPORT_KINDS = ["problem", "help", "feedback"] as const;
export type SupportKind = (typeof SUPPORT_KINDS)[number];

/** הסטטוס שהלומד רואה, כפי שהמסד מחזיר אותו. לעולם לא הסטטוס הפנימי. */
export type SupportStatus = "open" | "waiting_for_you" | "resolved" | "closed";

/** אותה מגבלה כמו private.support_limits() במסד. */
export const SUPPORT_MAX_CHARS = 4000;

export const SUPPORT_HOME = "/behind-the-scenes-ai/support";

/** שורה מ-list_my_support_tickets. */
export interface SupportRequestSummary {
    id: string;
    kind: SupportKind;
    status: SupportStatus;
    created_at: string;
    last_activity_at: string;
    excerpt: string | null;
    has_unread: boolean;
    /** העמוד בלומדה שממנו הבקשה נשלחה, כפי שנשמר בה (או null). */
    route: string | null;
}

/** שורה מ-get_my_support_ticket. */
export interface SupportRequestDetail {
    id: string;
    kind: SupportKind;
    status: SupportStatus;
    created_at: string;
    last_activity_at: string;
    can_reply: boolean;
    /** העמוד בלומדה שממנו הבקשה נשלחה, כפי שנשמר בה (או null). */
    route: string | null;
}

export interface SupportOriginLabels {
    originIntro: string;
    originChapter: (chapterLabel: string, title: string) => string;
}

/**
 * "נשלחה מתוך..." לבקשה, רק מה-route שנשמר בבקשה עצמה (לעולם לא מהעמוד הנוכחי או מ-?from=).
 * המיקום נמצא ברשימת הפרקים של הלומדה עצמה (lib/courseData, שבה המבוא הוא פרק 0), והכותרת
 * והתווית בשפה הנוכחית מגיעות מהפונקציות שהקורא מעביר (tField, formatChapterLabel). בלי
 * route, או עם עמוד שאינו המבוא או פרק, מוחזר null: אין מקור מומצא.
 */
export function supportOriginText<C extends { id: number; href?: string }>(
    route: string | null | undefined,
    chapters: readonly C[],
    labels: SupportOriginLabels,
    chapterLabel: (n: number) => string,
    chapterTitle: (chapter: C) => string,
): string | null {
    if (!route) return null;
    const chapter = chapters.find((c) => c.href === route);
    if (!chapter) return null;
    return chapter.id === 0 ? labels.originIntro : labels.originChapter(chapterLabel(chapter.id), chapterTitle(chapter));
}

/** שורה מ-list_my_support_messages. team = צוות הלומדה (בלי זהות המנהל). */
export interface SupportMessage {
    id: string;
    author: "you" | "team";
    body: string;
    created_at: string;
}

export function isSupportKind(value: unknown): value is SupportKind {
    return typeof value === "string" && (SUPPORT_KINDS as readonly string[]).includes(value);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
    return typeof value === "string" && UUID.test(value);
}

/**
 * מי יכול להשתמש בתמיכה: מחובר, מייל מאומת, לא מושעה. גישה ללומדה אינה נדרשת.
 * תצוגה בלבד: המסד בודק את אותו כלל בכל פעולה.
 */
export function canUseSupport(status: AccessStatus): boolean {
    return status === "active" || status === "no-grant" || status === "expired" || status === "revoked";
}

// אותו כלל כמו private.support_route_ok במסד: עד שלושה מקטעים באותיות קטנות, ספרות ומקף.
const SUPPORT_ROUTE = /^\/behind-the-scenes-ai(\/[a-z0-9-]{1,64}){0,3}$/;
const MAX_ROUTE = 200;
// בסיס פיקטיבי לפענוח כתובת יחסית. כתובת שמפוענחת למקור אחר אינה נתיב של הלומדה.
const BASE = "https://route.invalid";

const isSupportPage = (path: string) => path === SUPPORT_HOME || path.startsWith(`${SUPPORT_HOME}/`);

/**
 * נתיב המקור של בקשת תמיכה: רק ה-pathname של עמוד בלומדה, או null.
 * לעולם לא נשמרים query, hash (שעלול להכיל access token מקישור מייל), מקור או כתובת מלאה.
 * הפענוח נעשה כמו בדפדפן (URL), כך שמקטעי ".." ו-"%2e%2e" מתפרקים לפני הבדיקה, וקידוד
 * אחר (%xx) נדחה. עמודי התמיכה עצמם אינם מקור (הם רק הדרך אליו). נתיב לא תקין מושמט,
 * והבקשה עצמה נשלחת בלעדיו.
 */
export function normalizeSupportFrom(input: unknown): string | null {
    if (typeof input !== "string" || !input.startsWith("/") || input.length > 2048) return null;
    let url: URL;
    try {
        url = new URL(input, BASE);
    } catch {
        return null;
    }
    if (url.origin !== BASE) return null;
    const path = url.pathname;
    return path.length <= MAX_ROUTE && SUPPORT_ROUTE.test(path) && !isSupportPage(path) ? path : null;
}

/**
 * המקור לקישור לתמיכה מהעמוד הנוכחי: העמוד עצמו כשהוא עמוד בלומדה, ובעמוד תמיכה, המקור
 * שהעמוד כבר נושא (?from=). כך המעבר בין עמודי התמיכה אינו מחליף את המקור.
 */
export function supportOrigin(pathname: unknown, carriedFrom: unknown): string | null {
    return normalizeSupportFrom(pathname) ?? normalizeSupportFrom(carriedFrom);
}

/** ערך ראשון של פרמטר בכתובת (searchParams של Next יכול להחזיר מערך). */
export function firstParam(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

/** קישור לעמוד הבית של התמיכה, עם נתיב המקור כשיש. */
export function supportHomeHref(from?: string | null): string {
    const route = normalizeSupportFrom(from);
    return route ? `${SUPPORT_HOME}?${new URLSearchParams({ from: route })}` : SUPPORT_HOME;
}

export type SupportAction = { label: "chapter" | "intro" | "generic"; href: string };

/**
 * פעולת העזרה בפאנל החשבון. עם גישה פעילה (active), בעמוד המבוא או בעמוד פרק (לפי רשימת הפרקים
 * של הלומדה): בקשת עזרה חדשה שהעמוד הוא המקור שלה. בכל עמוד או מצב אחר: עמוד הבית של התמיכה,
 * עם המקור שנשמר (העמוד הנוכחי, או ?from= שעמוד תמיכה כבר נושא).
 */
export function supportAction<C extends { id: number; href?: string }>(
    pathname: string | null,
    carriedFrom: string | null,
    chapters: readonly C[],
    active: boolean,
): SupportAction {
    const origin = supportOrigin(pathname, carriedFrom);
    const chapter = active ? chapters.find((c) => c.href === pathname) : undefined;
    if (chapter && origin === pathname) return { label: chapter.id === 0 ? "intro" : "chapter", href: supportNewHref("help", origin) };
    return { label: "generic", href: supportHomeHref(origin) };
}

/** קישור לבקשה חדשה, עם סוג ונתיב מקור אופציונליים (שניהם מנוקים שוב בעמוד). */
export function supportNewHref(kind?: SupportKind, from?: string | null): string {
    const params = new URLSearchParams();
    if (kind) params.set("kind", kind);
    const route = normalizeSupportFrom(from);
    if (route) params.set("from", route);
    const query = params.toString();
    return `${SUPPORT_HOME}/new${query ? `?${query}` : ""}`;
}
