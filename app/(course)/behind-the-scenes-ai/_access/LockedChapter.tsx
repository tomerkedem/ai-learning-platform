"use client";

// ════════════════════════════════════════════════════════════════════════
// מסך נעילה לפרק מוגן. השרת מרנדר אותו במקום תוכן הפרק כשאין הרשאה פעילה, ולכן
// התשובה מכילה רק מטא-דאטה ציבורי (מספר ושם הפרק, שכבר מופיעים בתוכן העניינים).
// כל הפרקים (כולל פרק 1) ומבחן הסיום דורשים הרשאה פעילה, והמסר מסביר שהרשמה או אימות
// מייל אינם נותנים אותה.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Lock } from "lucide-react";
import { CourseSidebar } from "@/components/CourseSidebar";
import { useT } from "@/i18n/useT";
import { LOCALES, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { formatChapterLabel } from "@/i18n/format";
import { courses } from "@/lib/courseData";
import { tField } from "@/lib/localize";
import { AccountPanel } from "../AccountPanel";
import { BetaAccessRequest } from "./BetaAccessRequest";
import { SpeakButton } from "@/components/ai-internals/SpeakButton";
import type { CourseAccess } from "./access";

const course = courses["behind-the-scenes-ai"];

/** הסיבה שהתוכן נעול, לפי מצב הגישה (גם לתצוגה המקדימה של המבוא). */
export function lockReason(access: CourseAccess, x: Dictionary["chrome"]["access"], locale: Locale): string {
    const date = access.expiresAt
        ? new Date(access.expiresAt).toLocaleDateString(LOCALES[locale].htmlLang, { dateStyle: "long" })
        : "";
    return access.status === "no-grant" ? x.noGrant
        : access.status === "expired" ? x.expired(date)
        : access.status === "revoked" ? x.revoked
        : access.status === "suspended" ? x.suspended
        : access.status === "unconfirmed" ? x.unconfirmed
        : access.status === "unavailable" ? x.unavailable
        : x.signedOut;
}

export function LockedChapter({ access, chapter }: { access: CourseAccess; chapter: number | "final" }) {
    const { dir, locale, t } = useT();
    const x = t.chrome.access;
    const reason = lockReason(access, x, locale);
    const title = x.title;
    const body = x.body;

    const meta = chapter === "final" ? null : course.chapters.find((c) => c.id === chapter);
    const eyebrow = chapter === "final" ? t.chrome.progress.finalExam : formatChapterLabel(locale, chapter);
    const name = meta ? tField(meta.title, locale) : null;

    return (
        <div className="flex min-h-screen bg-[var(--bts-page)] text-[var(--bts-text-primary)]" dir={dir}>
            {/* דילוג לתוכן: כמו ב-ChapterLayout, מעל הסרגל. */}
            <a
                href="#locked-main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:inset-x-0 focus:mx-auto focus:w-fit focus:z-[200] focus:rounded-full focus:bg-[var(--bts-surface-elevated)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--bts-text-primary)] focus:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bts-focus-ring)]"
            >
                {t.behindAi.infoPages.skipToContent}
            </a>
            <CourseSidebar />
            <div className="flex-1 relative h-screen overflow-y-auto custom-scrollbar">
                <main id="locked-main" tabIndex={-1} className="mx-auto max-w-xl focus:outline-none px-6 md:px-10 py-20">
                    <section
                        aria-labelledby="locked-title"
                        className="rounded-3xl border border-[var(--bts-divider-soft)] bg-[color-mix(in_oklab,var(--bts-panel-from)_60%,transparent)] p-6 md:p-8 text-start space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--bts-border)] bg-[var(--bts-fill-soft)]">
                                <Lock size={18} aria-hidden className="text-[var(--bts-text-secondary)]" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-xs font-mono text-[var(--bts-text-muted)]">{eyebrow}</p>
                                {name && <p className="text-sm font-bold text-[var(--bts-text-secondary)] leading-tight">{name}</p>}
                            </div>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                            <h1 id="locked-title" className="text-xl md:text-2xl font-black leading-tight">{title}</h1>
                            {/* הקראה: רק הכותרת, ההסבר ומצב הגישה של מסך הנעילה, לפי הסדר. מתחילה רק
                                בלחיצה. key לפי שפה ופרק: החלפת שפה או ניווט מרכיבים את הכפתור מחדש,
                                וההרכבה מחדש עוצרת הקראה פעילה. */}
                            <SpeakButton key={`${locale}-${chapter}`} text={`${title}. ${body} ${reason}`} className="mt-0.5" />
                        </div>
                        <p className="text-[15px] md:text-base text-[var(--bts-text-body)] leading-relaxed">{body}</p>
                        <p role="status" className="flex items-start gap-2 rounded-xl border border-[var(--bts-border-emphasis)] bg-[var(--bts-fill-soft)] p-3 text-[15px] md:text-base font-bold text-[var(--bts-text-primary)] leading-relaxed">
                            <Lock size={16} aria-hidden className="mt-1 shrink-0 text-[var(--bts-brand-primary-strong)]" />
                            {reason}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                            <Link href="/behind-the-scenes-ai/introduction" className="rounded-lg border border-[var(--bts-border)] bg-[var(--bts-sub-fill-soft)] hover:bg-[var(--bts-sub-fill-hover)] px-3 py-2 text-xs font-bold text-[var(--bts-text-secondary)] no-underline">
                                {x.toIntro}
                            </Link>
                        </div>
                        {access.status === "signed-out" ? <AccountPanel /> : <BetaAccessRequest />}
                    </section>
                </main>
            </div>
        </div>
    );
}
