import { InfoPage } from "../_info/InfoPage";
import { infoPageMetadata } from "../_info/infoMetadata";

export const generateMetadata = () => infoPageMetadata("accessibility");

export default function AccessibilityPage() {
    return <InfoPage page="accessibility" />;
}
