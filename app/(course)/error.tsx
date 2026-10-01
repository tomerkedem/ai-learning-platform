"use client";

// גבול השגיאה של הלומדה: אותו רכיב כמו בשאר האתר (שש שפות, בלי תלות ב-layout), ובנוסף
// קישור "דיווח על הבעיה" לבקשת תמיכה חדשה. הקישור נושא רק את ה-pathname המנוקה של העמוד
// (או, בעמוד תמיכה, את עמוד המקור שהוא כבר נושא): לא את טקסט השגיאה, לא digest, לא stack
// ולא query או hash.
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useT } from "@/i18n/useT";
import SiteError from "../(site)/error";
import { supportNewHref, supportOrigin } from "./behind-the-scenes-ai/support/supportShared";

export default function CourseError(props: { error: Error & { digest?: string }; reset: () => void }) {
    const { t } = useT();
    const from = supportOrigin(usePathname(), useSearchParams().get("from"));
    return (
        <SiteError {...props}>
            {from && (
                <Link href={supportNewHref("problem", from)} className="rounded-lg border border-current px-5 py-2 font-semibold">
                    {t.chrome.support.reportProblem}
                </Link>
            )}
        </SiteError>
    );
}
