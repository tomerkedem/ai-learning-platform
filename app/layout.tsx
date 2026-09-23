import type { Metadata } from "next";
import { Geist, Geist_Mono, Heebo } from "next/font/google";
import "./globals.css";
import { CourseFooter } from "@/components/CourseFooter";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// גופן אחיד מבוקר (Heebo, variable) לכל הטקסט הרגיל - עברית וגם לטינית. Heebo מכסה את
// שני הכתבים ומספק משקלים אמיתיים 100-900, כך שכותרות ותיאורים, וגם מילים לועזיות כמו
// Chat / Agent בתוך משפט עברי, נראים באותו גופן. Geist נשאר רק כרשת-ביטחון (fallback),
// ו-Geist Mono נשמר בנפרד לתגים טכניים (LLM, מספרים, מזהי-טוקן) שרוצים רוחב-אותיות קבוע.
const heebo = Heebo({
  variable: "--font-hebrew",
  subsets: ["hebrew", "latin"],
});

// סקריפט טרום-ציור לערכת הנושא. הלומדה מרונדרת סטטית מראש, ולכן ההעדפה נפתרת
// בצד הלקוח - וחייבת להיפתר *לפני* הציור הראשון, אחרת תיראה הבזקת ערכה.
// הסקריפט קורא את bts-theme, מקבל רק system/light/dark, פותר system מהעדפת מערכת
// ההפעלה, וחותם data-theme (ל-CSS) ו-color-scheme (לממשק הדפדפן) על <html>.
// כל כשל נבלע: אחסון חסום נופל ל-system, וכשל ב-matchMedia נופל ל-dark.
//
// המחרוזת 'bts-theme' כתובה כאן פשוטה בכוונה (לא THEME_STORAGE_KEY מיובא מ-
// ThemeProvider): layout.tsx הוא Server Component, ו-ThemeProvider הוא "use client".
// ב-Next.js, import של ערך מקובץ "use client" לתוך קוד שמופעל בצד השרת מוחלף
// ב-client reference (stub) ולא בערך האמיתי - הניסיון הקודם לעשות זאת ריסק את
// הסקריפט הזה (client reference stringify-ל-JS שבור, SyntaxError בדפדפן, והבזקת
// ערכה כי data-theme מעולם לא נחתם לפני הציור). bts-theme מופיע גם ב-ThemeProvider.tsx
// כ-THEME_STORAGE_KEY; אם המפתח משתנה אי-פעם יש לעדכן את שני המקומות.
const THEME_INIT = `(function(){var e=document.documentElement,m='system';try{var s=localStorage.getItem('bts-theme');if(s==='light'||s==='dark'||s==='system'){m=s;}}catch(x){}var t;try{t=m==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):m;}catch(x){t=m==='system'?'dark':m;}e.setAttribute('data-theme',t);e.style.colorScheme=t;})();`;

// כותרת ותיאור בעברית (שפת ברירת המחדל של ה-SSR). כתובות תלויות-דומיין
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ברירת המחדל ב-SSR היא עברית/RTL (התנהגות נשמרת). ה-LocaleProvider מסנכרן
    // את lang/dir/data-locale על <html> אחרי mount כשנבחרת שפה אחרת (?lang=).
    // משתני הגופן (next/font) חייבים לשבת על <html>, לא על <body>: Tailwind מחיל את
    // font-family דרך var(--default-font-family) על html, וכל טקסט תוכן יורש משם. אם
    // המשתנים על body בלבד, html נופל ל-ui-sans-serif (גופן המערכת) וכל התוכן איתו.
    // suppressHydrationWarning על <html> בלבד: סקריפט הטרום-ציור מוסיף data-theme
    // ו-color-scheme לאלמנט הזה עוד לפני ש-React עושה hydration, ולכן ההשוואה
    // לסימון מהשרת תמיד תראה מאפיינים "עודפים". ההשתקה ב-React חלה על רמה אחת
    // בלבד - על <html> עצמו - ולכן אי-התאמות אמיתיות בתוך העץ ממשיכות להתריע.
    <html
      lang="he"
      dir="rtl"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${heebo.variable}`}
    >
      <body className="antialiased">
        {/* חייב להיות האלמנט הראשון ב-body: הוא רץ סינכרונית בזמן פענוח ה-HTML,
            לפני שהתוכן שאחריו מפוענח ולפני הציור הראשון. אלמנט <head> ידני אינו
            נתמך ב-App Router של Next ונשמט מהפלט, ולכן זה המיקום הנכון. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <ThemeProvider>
          <LocaleProvider>
                {children}
           <CourseFooter />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
