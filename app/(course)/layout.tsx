import type { Metadata } from "next";
import { RootDocument } from "@/components/RootDocument";
import { getRequestLocale } from "@/i18n/requestLocale";
import { courses } from "@/lib/courseData";
import { tField } from "@/lib/localize";
import { AccountSync, AuthLinkErrorDialog, PasswordResetDialog } from "./behind-the-scenes-ai/AccountPanel";
import { getCourseAccess, sharedCourseContent } from "./behind-the-scenes-ai/_access/courseAccess";
import { ProtectedContentProvider } from "@/i18n/ProtectedContent";
import { CourseAccessProvider } from "./behind-the-scenes-ai/_access/CourseAccessContext";

// Root layout של מאחורי הקלעים של AI. השפה נפתרת בשרת בכל בקשה (עוגיית בחירה, שפת
// דפדפן, רמז מדינה אמין, אנגלית), ולכן ה-HTML הראשוני כבר מגיע עם lang/dir ותוכן בשפה
// הנכונה, בלי הבזק. כתובות הלומדה זהות בכל השפות; כתובת משותפת אינה קובעת את שפת הצופה.
// קריאת העוגייה הופכת את המסלולים כאן לדינמיים - ורק אותם: שאר האתר ב-app/(site).

const course = courses["behind-the-scenes-ai"];
const siteUrl = process.env.SITE_URL?.replace(/\/$/, "");

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const title = tField(course.title, locale);
  const description = tField(course.description, locale);
  return {
    title,
    description,
    robots: { index: true, follow: true },
    // canonical נגזר מהנתיב בלבד (./ = הנתיב הנוכחי), ולכן זהה לכל שפה. רק כשיש דומיין ייצור.
    ...(siteUrl && { metadataBase: new URL(siteUrl), alternates: { canonical: "./" } }),
    openGraph: { title, description, type: "website", ...(siteUrl && { url: "./" }) },
    twitter: { card: "summary", title, description },
  };
}

// מצב הגישה כאן הוא לתצוגה בלבד (נעילה בסרגל, סטטוס בפאנל החשבון). layout אינו
// מתרנדר מחדש בניווט, ולכן האכיפה נעשית בכל עמוד מוגן בנפרד (openCourseContent).
export default async function CourseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [locale, access] = await Promise.all([getRequestLocale(), getCourseAccess()]);
  // תמיד אותו מבנה עץ (תוכן ריק בלי הרשאה), כדי שכניסה לא תרכיב מחדש את העמוד.
  const shared = await sharedCourseContent(access);
  return (
    <RootDocument locale={locale} serverResolved footer={false}>
      <CourseAccessProvider value={access}>
        <ProtectedContentProvider value={shared}>
          <AccountSync />
          <PasswordResetDialog />
          <AuthLinkErrorDialog />
          {children}
        </ProtectedContentProvider>
      </CourseAccessProvider>
    </RootDocument>
  );
}
