"use client";

// ════════════════════════════════════════════════════════════════════════
// מסך נעילה לפרק מוגן. השרת מרנדר אותו במקום תוכן הפרק כשאין הרשאה פעילה, ולכן
// התשובה מכילה רק מטא-דאטה ציבורי (מספר ושם הפרק, שכבר מופיעים בתוכן העניינים).
// המסר מסביר שנדרש אישור בטא, ושהרשמה או אימות מייל אינם נותנים גישה.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Lock } from "lucide-react";
import { CourseSidebar } from "@/components/CourseSidebar";
import { useT } from "@/i18n/useT";
import { LOCALES } from "@/i18n/config";
import { formatChapterLabel } from "@/i18n/format";
import { courses } from "@/lib/courseData";
import { tField } from "@/lib/localize";
import { AccountPanel } from "../AccountPanel";
import type { CourseAccess } from "./access";

const course = courses["behind-the-scenes-ai"];

export function LockedChapter({ access, chapter }: { access: CourseAccess; chapter: number | "final" }) {
    const { dir, locale, t } = useT();
    const x = t.chrome.access;
    const date = access.expiresAt
        ? new Date(access.expiresAt).toLocaleDateString(LOCALES[locale].htmlLang, { dateStyle: "long" })
        : "";
    const reason =
        access.status === "no-grant" ? x.noGrant
        : access.status === "expired" ? x.expired(date)
        : access.status === "revoked" ? x.revoked
        : access.status === "unavailable" ? x.unavailable
        : x.signedOut;

    const meta = chapter === "final" ? null : course.chapters.find((c) => c.id === chapter);
    const eyebrow = chapter === "final" ? t.chrome.progress.finalExam : formatChapterLabel(locale, chapter);
    const name = meta ? tField(meta.title, locale) : null;

    return (
        <div className="flex min-h-screen bg-[var(--bts-page)] text-[var(--bts-text-primary)]" dir={dir}>
            <CourseSidebar />
            <div className="flex-1 relative h-screen overflow-y-auto custom-scrollbar">
                <main className="mx-auto max-w-xl px-6 md:px-10 py-20">
                    <section
                        aria-labelledby="locked-title"
                        className="rounded-3xl border border-[var(--bts-divider-soft)] bg-[color-mix(in_oklab,var(--bts-panel-from)_60%,transparent)] p-6 md:p-8 text-start space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--bts-border)] bg-[var(--bts-fill-soft)]">
                                <Lock size={18} aria-hidden className="text-[var(--bts-text-secondary)]" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[11px] font-mono text-[var(--bts-text-faint)]">{eyebrow}</p>
                                {name && <p className="text-sm font-bold text-[var(--bts-text-secondary)] leading-tight">{name}</p>}
                            </div>
                        </div>
                        <h1 id="locked-title" className="text-xl md:text-2xl font-black leading-tight">{x.title}</h1>
                        <p className="text-sm text-[var(--bts-text-muted)] leading-relaxed">{x.body}</p>
                        <p role="status" className="text-sm font-bold text-[var(--bts-text-secondary)] leading-relaxed">{reason}</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                            <Link href="/behind-the-scenes-ai/chapter-1" className="rounded-lg border border-[var(--bts-border)] bg-[var(--bts-sub-fill-soft)] hover:bg-[var(--bts-sub-fill-hover)] px-3 py-2 text-xs font-bold text-[var(--bts-text-secondary)] no-underline">
                                {x.toChapter1}
                            </Link>
                            <Link href="/behind-the-scenes-ai/introduction" className="rounded-lg border border-[var(--bts-border)] bg-[var(--bts-sub-fill-soft)] hover:bg-[var(--bts-sub-fill-hover)] px-3 py-2 text-xs font-bold text-[var(--bts-text-secondary)] no-underline">
                                {x.toIntro}
                            </Link>
                        </div>
                        {access.status === "signed-out" && <AccountPanel />}
                    </section>
                </main>
            </div>
        </div>
    );
}
