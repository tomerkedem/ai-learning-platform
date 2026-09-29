import { InfoPage } from "../_info/InfoPage";
import { infoPageMetadata } from "../_info/infoMetadata";

export const generateMetadata = () => infoPageMetadata("faq");

export default function FaqPage() {
    return <InfoPage page="faq" />;
}
