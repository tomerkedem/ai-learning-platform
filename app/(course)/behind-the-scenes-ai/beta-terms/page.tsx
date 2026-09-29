import { InfoPage } from "../_info/InfoPage";
import { infoPageMetadata } from "../_info/infoMetadata";

export const generateMetadata = () => infoPageMetadata("betaTerms");

export default function BetaTermsPage() {
    return <InfoPage page="betaTerms" />;
}
