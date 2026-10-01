import { InfoPage } from "../_info/InfoPage";
import { infoPageMetadata } from "../_info/infoMetadata";
import { SupportContactEntry } from "../support/SupportContactEntry";

export const generateMetadata = () => infoPageMetadata("contact");

export default function ContactPage() {
    return (
        <InfoPage page="contact">
            <SupportContactEntry />
        </InfoPage>
    );
}
