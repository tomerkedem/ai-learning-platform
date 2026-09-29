import { InfoPage } from "../_info/InfoPage";
import { infoPageMetadata } from "../_info/infoMetadata";

export const generateMetadata = () => infoPageMetadata("about");

export default function AboutPage() {
    return <InfoPage page="about" />;
}
