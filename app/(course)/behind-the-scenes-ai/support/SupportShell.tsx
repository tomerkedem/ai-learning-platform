"use client";

// ════════════════════════════════════════════════════════════════════════
// מעטפת עמודי התמיכה: אותו סרגל צד, קישור דילוג ועמודת קריאה כמו בדפי המידע. מי שלא יכול
// להשתמש בתמיכה (אורח, מייל לא מאומת, חשבון מושעה, תקלה בבדיקה) רואה הסבר במקום התוכן.
// גישה ללומדה אינה נדרשת. ההחלטה כאן לתצוגה בלבד: המסד בודק בכל פעולה.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import type React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CourseSidebar } from "@/components/CourseSidebar";
import { useT } from "@/i18n/useT";
import { AccountPanel } from "../AccountPanel";
import type { CourseAccess } from "../_access/access";
import { canUseSupport } from "./supportShared";
import { FOCUS, SECONDARY_LINK } from "./supportParts";

function SupportGate({ access }: { access: CourseAccess }) {
    const { t } = useT();
    const s = t.chrome.support;
    const body = access.status === "signed-out" ? s.signInBody
        : access.status === "unconfirmed" ? t.chrome.access.unconfirmed
        : access.status === "suspended" ? s.suspended
        : t.chrome.access.unavailable;
    return (
        <section aria-labelledby="support-gate-title" className="space-y-4">
            <h1 id="support-gate-title" className="text-2xl md:text-3xl font-black leading-tight">
                {access.status === "signed-out" ? s.signInTitle : s.title}
            </h1>
            <p role="status" className="text-[15px] md:text-base leading-7 text-[var(--bts-text-secondary)]">{body}</p>
            {access.status === "signed-out" && <AccountPanel defaultOpen />}
        </section>
    );
}

export function SupportShell({ access, children }: { access: CourseAccess; children?: React.ReactNode }) {
    const { dir, t } = useT();
    const Back = dir === "rtl" ? ArrowRight : ArrowLeft;
    return (
        <div className="flex min-h-[100dvh] bg-[var(--bts-page)] text-[var(--bts-text-primary)]" dir={dir}>
            <a
                href="#support-main"
                className={`sr-only focus:not-sr-only focus:fixed focus:top-4 focus:inset-x-0 focus:mx-auto focus:w-fit focus:z-[200] focus:rounded-full focus:bg-[var(--bts-surface-elevated)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--bts-text-primary)] focus:shadow-lg ${FOCUS}`}
            >
                {t.behindAi.infoPages.skipToContent}
            </a>
            <CourseSidebar />
            {/* min-w-0: בלי זה העמודה לא מתכווצת מתחת לרוחב התוכן, ובנייד נוצרת גלילה אופקית. */}
            <div className="flex-1 min-w-0 relative h-[100dvh] overflow-y-auto custom-scrollbar">
                {/* pt-20 בנייד: התוכן מתחיל מתחת לכפתור התפריט הקבוע. */}
                <main id="support-main" tabIndex={-1} className="mx-auto w-full max-w-2xl px-4 sm:px-8 pt-20 md:pt-12 pb-24 text-start focus:outline-none">
                    <Link href="/behind-the-scenes-ai/introduction" className={SECONDARY_LINK}>
                        <Back size={16} aria-hidden className="shrink-0" />
                        {t.behindAi.infoPages.backToCourse}
                    </Link>
                    <div className="mt-6">
                        {canUseSupport(access.status) ? children : <SupportGate access={access} />}
                    </div>
                </main>
            </div>
        </div>
    );
}
