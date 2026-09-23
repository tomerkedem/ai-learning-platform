import type { Metadata } from "next";
import { RootDocument } from "@/components/RootDocument";
import { DEFAULT_LOCALE } from "@/i18n/config";

// Root layout סטטי לדף הבית, פייתון ומתמטיקה. אינו קורא עוגיות או כותרות, ולכן המסלולים
// האלה נשארים מרונדרים מראש (static) בעברית, כמו קודם. הלומדה מאחורי הקלעים של AI יושבת
// ב-app/(course) עם root layout משלה; מעבר בין השניים הוא טעינת עמוד מלאה (התנהגות Next).

// כותרת ותיאור בעברית (שפת ה-SSR של המסלולים האלה). כתובות תלויות-דומיין
// (metadataBase, canonical, og:url) הושמטו בכוונה עד שיוגדר דומיין ייצור.
const SITE_TITLE = "הליבה ההנדסית של AI";
const SITE_DESCRIPTION =
  "לומדות אינטראקטיביות ללמידה עצמית: מאחורי הקלעים של AI, פייתון למפתחים ומתמטיקה לבינה מלאכותית. אינטואיציה קודם, נוסחאות אחר כך.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  robots: { index: true, follow: true },
  openGraph: { title: SITE_TITLE, description: SITE_DESCRIPTION, type: "website", locale: "he_IL" },
  twitter: { card: "summary", title: SITE_TITLE, description: SITE_DESCRIPTION },
};

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale={DEFAULT_LOCALE}>{children}</RootDocument>;
}
