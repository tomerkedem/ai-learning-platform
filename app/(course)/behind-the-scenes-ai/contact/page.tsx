import { InfoPage } from "../_info/InfoPage";
import { infoPageMetadata } from "../_info/infoMetadata";

export const generateMetadata = () => infoPageMetadata("contact");

export default function ContactPage() {
    return <InfoPage page="contact" />;
}
