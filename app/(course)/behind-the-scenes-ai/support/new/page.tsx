// בקשת תמיכה חדשה. ?kind= בוחר סוג מראש, ?from= הוא נתיב העמוד שממנו הגיעו. שניהם קלט
// לא מהימן: הסוג נבדק מול הרשימה, והנתיב מנוקה ל-pathname של הלומדה או מושמט (והמסד בודק שוב).
import { getCourseAccess } from "../../_access/courseAccess";
import { canUseSupport, firstParam, isSupportKind, normalizeSupportFrom } from "../supportShared";
import { supportMetadata } from "../supportMetadata";
import { SupportShell } from "../SupportShell";
import { NewRequestForm } from "./NewRequestForm";

export const generateMetadata = supportMetadata;

export default async function NewSupportRequestPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const access = await getCourseAccess();
    if (!canUseSupport(access.status)) return <SupportShell access={access} />;
    const query = await searchParams;
    const kind = firstParam(query.kind);
    return (
        <SupportShell access={access}>
            <NewRequestForm initialKind={isSupportKind(kind) ? kind : null} from={normalizeSupportFrom(firstParam(query.from))} />
        </SupportShell>
    );
}
