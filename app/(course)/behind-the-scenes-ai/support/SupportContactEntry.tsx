"use client";

// כניסה לתמיכה מדף "יצירת קשר". לומד שיכול להשתמש בתמיכה מקבל קישור; אחרים מקבלים הסבר
// (התחברות, אימות מייל, השעיה). זה אינו הערוץ היחיד: ערוץ חיצוני עתידי מסומן בדף כטיוטה.
// אין שימוש בתו "מקף ארוך" (em dash).

import Link from "next/link";
import { LifeBuoy } from "lucide-react";
import { useT } from "@/i18n/useT";
import { useCourseAccess } from "../_access/CourseAccessContext";
import { canUseSupport, SUPPORT_HOME } from "./supportShared";
import { PRIMARY_BUTTON } from "./supportParts";

export function SupportContactEntry() {
    const { t } = useT();
    const s = t.chrome.support;
    const { status } = useCourseAccess();
    const allowed = canUseSupport(status);
    const text = allowed ? s.contactSignedIn
        : status === "suspended" ? s.suspended
        : status === "unconfirmed" ? t.chrome.access.unconfirmed
        : status === "unavailable" ? t.chrome.access.unavailable
        : s.contactSignedOut;
    return (
        <section aria-labelledby="contact-support" className="rounded-2xl border border-cyan-500/30 bg-[var(--bts-surface)] p-5 md:p-6 shadow-[var(--bts-shadow-elevation)]">
            <h2 id="contact-support" className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tight text-[var(--bts-text-primary)]">
                <LifeBuoy size={20} aria-hidden className="shrink-0 text-[var(--bts-brand-primary-strong)]" />
                {s.contactHeading}
            </h2>
            <p className="mt-3 max-w-[65ch] leading-7 text-[var(--bts-text-body)]">{text}</p>
            {allowed && (
                <Link href={SUPPORT_HOME} className={`${PRIMARY_BUTTON} mt-4`}>{s.contactOpen}</Link>
            )}
        </section>
    );
}
