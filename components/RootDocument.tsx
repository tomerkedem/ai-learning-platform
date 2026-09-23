import { Geist, Geist_Mono, Heebo } from "next/font/google";
import "@/app/globals.css";
import { CourseFooter } from "@/components/CourseFooter";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LOCALES, dirOf, type Locale } from "@/i18n/config";

// המסמך (<html>/<body>) המשותף לשני ה-root layouts: app/(site) הסטטי (בית, פייתון, מתמטיקה)
// ו-app/(course) של מאחורי הקלעים של AI, שפותר את השפה בצד השרת בכל בקשה. ההבדל היחיד
// ביניהם הוא ה-locale שמתקבל כאן; lang/dir/data-locale נכתבים כבר ב-HTML הראשוני.

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

// סקריפט טרום-ציור לערכת הנושא. ההעדפה נשמרת בדפדפן ולכן נפתרת בצד הלקוח - וחייבת
// להיפתר *לפני* הציור הראשון, אחרת תיראה הבזקת ערכה.
// הסקריפט קורא את bts-theme, מקבל רק system/light/dark, פותר system מהעדפת מערכת
// ההפעלה, וחותם data-theme (ל-CSS) ו-color-scheme (לממשק הדפדפן) על <html>.
// כל כשל נבלע: אחסון חסום נופל ל-system, וכשל ב-matchMedia נופל ל-dark.
//
// המחרוזת 'bts-theme' כתובה כאן פשוטה בכוונה (לא THEME_STORAGE_KEY מיובא מ-
// ThemeProvider): זהו Server Component, ו-ThemeProvider הוא "use client".
// ב-Next.js, import של ערך מקובץ "use client" לתוך קוד שמופעל בצד השרת מוחלף
// ב-client reference (stub) ולא בערך האמיתי - הניסיון הקודם לעשות זאת ריסק את
// הסקריפט הזה (client reference stringify-ל-JS שבור, SyntaxError בדפדפן, והבזקת
// ערכה כי data-theme מעולם לא נחתם לפני הציור). bts-theme מופיע גם ב-ThemeProvider.tsx
// כ-THEME_STORAGE_KEY; אם המפתח משתנה אי-פעם יש לעדכן את שני המקומות.
const THEME_INIT = `(function(){var e=document.documentElement,m='system';try{var s=localStorage.getItem('bts-theme');if(s==='light'||s==='dark'||s==='system'){m=s;}}catch(x){}var t;try{t=m==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):m;}catch(x){t=m==='system'?'dark':m;}e.setAttribute('data-theme',t);e.style.colorScheme=t;})();`;

export function RootDocument({
  locale,
  serverResolved = false,
  children,
}: {
  locale: Locale;
  serverResolved?: boolean;
  children: React.ReactNode;
}) {
  return (
    // משתני הגופן (next/font) חייבים לשבת על <html>, לא על <body>: Tailwind מחיל את
    // font-family דרך var(--default-font-family) על html, וכל טקסט תוכן יורש משם. אם
    // המשתנים על body בלבד, html נופל ל-ui-sans-serif (גופן המערכת) וכל התוכן איתו.
    // suppressHydrationWarning על <html> בלבד: סקריפט הטרום-ציור מוסיף data-theme
    // ו-color-scheme לאלמנט הזה עוד לפני ש-React עושה hydration, ולכן ההשוואה
    // לסימון מהשרת תמיד תראה מאפיינים "עודפים". ההשתקה ב-React חלה על רמה אחת
    // בלבד - על <html> עצמו - ולכן אי-התאמות אמיתיות בתוך העץ ממשיכות להתריע.
    <html
      lang={LOCALES[locale].htmlLang}
      dir={dirOf(locale)}
      data-locale={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${heebo.variable}`}
    >
      <body className="antialiased">
        {/* חייב להיות האלמנט הראשון ב-body: הוא רץ סינכרונית בזמן פענוח ה-HTML,
            לפני שהתוכן שאחריו מפוענח ולפני הציור הראשון. אלמנט <head> ידני אינו
            נתמך ב-App Router של Next ונשמט מהפלט, ולכן זה המיקום הנכון. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <ThemeProvider>
          <LocaleProvider initialLocale={locale} serverResolved={serverResolved}>
            {children}
            <CourseFooter />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
