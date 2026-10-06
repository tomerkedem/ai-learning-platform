"use client";

// חלקים קטנים שמשותפים לעמודי התמיכה: תווית סטטוס, אייקון לסוג הבקשה, זמן מקומי וסגנונות.
// אין שימוש בתו "מקף ארוך" (em dash).

import { useSyncExternalStore } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, CircleHelp, Hourglass, Lock, MapPin, MessageSquare, type LucideIcon } from "lucide-react";
import { useT } from "@/i18n/useT";
import { LOCALES } from "@/i18n/config";
import { formatChapterLabel } from "@/i18n/format";
import { courses } from "@/lib/courseData";
import { tField } from "@/lib/localize";
import { supportOriginText, type SupportKind, type SupportStatus } from "./supportShared";

const COURSE_CHAPTERS = courses["behind-the-scenes-ai"].chapters;

/** מאיזה עמוד בלומדה הבקשה נשלחה, מה-route שנשמר בה. בלי מקור ידוע לא מוצג דבר. */
export function SupportOrigin({ route, className = "" }: { route: string | null; className?: string }) {
    const { locale, t } = useT();
    const text = supportOriginText(route, COURSE_CHAPTERS, t.chrome.support, (n) => formatChapterLabel(locale, n), (c) => tField(c.title, locale));
    if (!text) return null;
    return (
        <span className={`flex items-start gap-1.5 ${className}`}>
            <MapPin size={13} aria-hidden className="mt-[0.2rem] shrink-0" />
            <span className="min-w-0 [overflow-wrap:anywhere]">{text}</span>
        </span>
    );
}

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bts-focus-ring)]";

export const PRIMARY_BUTTON = `inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[var(--bts-brand-primary)] bg-[color-mix(in_oklab,var(--bts-brand-primary)_14%,transparent)] px-4 py-2 text-sm font-bold text-[var(--bts-text-primary)] no-underline transition-colors hover:bg-[color-mix(in_oklab,var(--bts-brand-primary)_24%,transparent)] disabled:opacity-60 motion-reduce:transition-none ${FOCUS}`;

export const SECONDARY_LINK = `inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[var(--bts-text-muted)] underline underline-offset-2 hover:text-[var(--bts-text-primary)] ${FOCUS}`;

export const KIND_ICON: Record<SupportKind, LucideIcon> = {
    problem: AlertTriangle,
    help: CircleHelp,
    feedback: MessageSquare,
};

/**
 * צבע סמנטי לסוג הבקשה (לפי מזהה הסוג, לעולם לא לפי הטקסט המתורגם): בעיה = ענבר, עזרה = cyan, שיחה = סגול.
 * מגדיר --kind; הרכיב צובע בו את האייקון (KIND_ICON_COLOR) ובטופס גם עיגול ומסגרת בבחירה. נפרד מצבעי הסטטוס.
 */
export const KIND_TONE: Record<SupportKind, string> = {
    problem: "[--kind:var(--color-amber-400)] light:[--kind:var(--color-amber-700)]",
    help: "[--kind:var(--bts-brand-primary-strong)]",
    feedback: "[--kind:var(--color-violet-400)] light:[--kind:var(--color-violet-600)]",
};
export const KIND_ICON_COLOR = "text-[var(--kind)] forced-colors:text-[CanvasText]";

// הסטטוס תמיד כתוב בטקסט, עם אייקון; הצבע רק מחזק.
const STATUS_STYLE: Record<SupportStatus, { Icon: LucideIcon; className: string }> = {
    open: { Icon: CircleDot, className: "border-[color-mix(in_oklab,var(--bts-brand-primary)_55%,transparent)] text-[var(--bts-brand-primary-strong)]" },
    waiting_for_you: { Icon: Hourglass, className: "border-amber-500/50 bts-tier-amber" },
    resolved: { Icon: CheckCircle2, className: "border-emerald-500/40 text-[var(--bts-status-positive)]" },
    closed: { Icon: Lock, className: "border-[var(--bts-border)] text-[var(--bts-text-muted)]" },
};

export function StatusBadge({ status }: { status: SupportStatus }) {
    const { t } = useT();
    const s = t.chrome.support;
    const { Icon, className } = STATUS_STYLE[status];
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-bold ${className}`}>
            <Icon size={13} aria-hidden className="shrink-0" />
            <span className="sr-only">{s.statusLabel}: </span>
            {s.statuses[status]}
        </span>
    );
}

const noSubscribe = () => () => {};

/**
 * תאריך ושעה באזור הזמן של הדפדפן. השרת אינו יודע את אזור הזמן של הלומד, ולכן הטקסט מוצג
 * רק אחרי ה-hydration (אותו דפוס useSyncExternalStore כמו בפרק 4), וה-HTML הראשוני זהה בשרת
 * ובלקוח. <time dateTime> נושא את הערך המדויק מההתחלה.
 */
export function LocalTime({ iso, format = (text) => text }: { iso: string; format?: (text: string) => string }) {
    const { locale } = useT();
    const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);
    const text = mounted
        ? new Date(iso).toLocaleString(LOCALES[locale].htmlLang, { dateStyle: "medium", timeStyle: "short" })
        : "";
    return <time dateTime={iso}>{mounted ? format(text) : " "}</time>;
}
