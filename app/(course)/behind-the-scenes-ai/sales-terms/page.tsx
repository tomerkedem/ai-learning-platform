import { InfoPage } from "../_info/InfoPage";
import { infoPageMetadata } from "../_info/infoMetadata";

export const generateMetadata = () => infoPageMetadata("salesTerms");

export default function SalesTermsPage() {
    return <InfoPage page="salesTerms" />;
}
