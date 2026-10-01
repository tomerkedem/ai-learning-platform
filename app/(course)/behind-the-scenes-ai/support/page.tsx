// עזרה ותמיכה: הבקשות של הלומד. לא עמוד מוגן של הלומדה (לא דרך openCourseContent):
// מספיק חשבון מחובר, מאומת ולא מושעה. הנתונים מהמסד עם ה-token של הלומד (RLS ופונקציות
// שבודקות זהות), בכל בקשה. noindex, ולא במפת האתר.
// ?from= הוא נתיב העמוד בלומדה שממנו הגיעו (קלט לא מהימן: מנוקה, או מושמט). הוא עובר הלאה
// לבקשה חדשה, כדי שהבקשה תישמר עם העמוד המקורי ולא עם עמוד התמיכה.
import { getCourseAccess, requestClient } from "../_access/courseAccess";
import { canUseSupport, firstParam, normalizeSupportFrom, type SupportRequestSummary } from "./supportShared";
import { supportMetadata } from "./supportMetadata";
import { SupportShell } from "./SupportShell";
import { SupportHome } from "./SupportHome";

export const generateMetadata = supportMetadata;

async function loadRequests(): Promise<SupportRequestSummary[] | null> {
    const db = await requestClient();
    if (!db) return null;
    try {
        const { data, error } = await db.rpc("list_my_support_tickets", { p_limit: 100 });
        return error ? null : (data as SupportRequestSummary[]);
    } catch {
        return null;
    }
}

export default async function SupportPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const access = await getCourseAccess();
    if (!canUseSupport(access.status)) return <SupportShell access={access} />;
    const from = normalizeSupportFrom(firstParam((await searchParams).from));
    return (
        <SupportShell access={access}>
            <SupportHome requests={await loadRequests()} from={from} />
        </SupportShell>
    );
}
