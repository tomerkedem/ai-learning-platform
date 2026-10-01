// בקשת תמיכה אחת והשיחה שלה. המסד מחזיר שורה רק לבעלי הבקשה (get_my_support_ticket),
// והודעות רק של בקשה שלהם (list_my_support_messages), עם הסטטוס שהלומד רואה ו"you"/"team".
// מזהה לא תקין, בקשה של מישהו אחר או בקשה שלא קיימת נראים אותו דבר: "לא נמצאה".
import { getCourseAccess, requestClient } from "../../_access/courseAccess";
import { canUseSupport, isUuid, type SupportMessage, type SupportRequestDetail } from "../supportShared";
import { supportMetadata } from "../supportMetadata";
import { SupportShell } from "../SupportShell";
import { SupportRequestView } from "./SupportRequestView";

export const generateMetadata = supportMetadata;

interface Loaded {
    request: SupportRequestDetail | null;
    messages: SupportMessage[];
    failed: boolean;
}

async function loadRequest(id: string): Promise<Loaded> {
    const none: Loaded = { request: null, messages: [], failed: false };
    if (!isUuid(id)) return none;
    const db = await requestClient();
    if (!db) return { ...none, failed: true };
    try {
        const [ticket, messages] = await Promise.all([
            db.rpc("get_my_support_ticket", { p_ticket_id: id }),
            db.rpc("list_my_support_messages", { p_ticket_id: id }),
        ]);
        if (ticket.error || messages.error) return { ...none, failed: true };
        const request = (ticket.data as SupportRequestDetail[])[0] ?? null;
        return { request, messages: request ? (messages.data as SupportMessage[]) : [], failed: false };
    } catch {
        return { ...none, failed: true };
    }
}

export default async function SupportRequestPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const access = await getCourseAccess();
    if (!canUseSupport(access.status)) return <SupportShell access={access} />;
    const [{ id }, query] = await Promise.all([params, searchParams]);
    const loaded = await loadRequest(id);
    return (
        <SupportShell access={access}>
            <SupportRequestView
                key={id}
                request={loaded.request}
                messages={loaded.messages}
                loadFailed={loaded.failed}
                justCreated={query.sent === "1" && !!loaded.request}
            />
        </SupportShell>
    );
}
