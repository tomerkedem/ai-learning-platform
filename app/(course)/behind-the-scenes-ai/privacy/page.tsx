import { InfoPage } from "../_info/InfoPage";
import { infoPageMetadata } from "../_info/infoMetadata";

export const generateMetadata = () => infoPageMetadata("privacy");

export default function PrivacyPage() {
    return <InfoPage page="privacy" />;
}
