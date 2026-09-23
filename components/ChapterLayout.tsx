"use client";

import React, { useState, ReactNode, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CourseHeader } from "@/components/CourseHeader";
import { CourseSidebar } from "@/components/CourseSidebar";
import { courses, type Language } from "@/lib/courseData";
import { useT } from "@/i18n/useT";
import { getDictionary } from "@/i18n/dictionary";
import { dirOf } from "@/i18n/config";
import { tField } from "@/lib/localize";
import { formatChapterLabel, formatNextChapterLabel, formatReadTime, parseReadTimeMinutes } from "@/i18n/format";
import { ChevronRight, ChevronLeft, BookOpen, Trophy, Maximize2, Minimize2, Milestone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EdgeRail, EdgePeekItem } from "@/components/ai-internals/EdgePeek";

// מצב המיקוד נחשף ל-children (למשל כדי לגדל את מנטור ההירו במבוא כשנכנסים למיקוד).
// ברירת המחדל false, כך שצרכנים מחוץ לפריסה מקבלים ערך בטוח.
export const FocusModeContext = React.createContext(false);

// מפת צבעי-מבטא סטטית לפי שם הצבע של הפרק (נגזר מ-colorFrom, למשל "from-violet-400" -> "violet").
// חובה שהמחלקות יהיו מחרוזות literal: Tailwind v4 סורק את קוד המקור ויוצר רק מחלקות שהוא רואה
// כטקסט. מחלקות שנבנו בזמן ריצה (bg-${color}-600/10) לא נמצאות בסריקה ולכן לא נוצרות ב-CSS,
// וכך ההילה התחתונה וגרדיאנט הריחוף של כרטיס הפרק הבא רונדרו שקופים. המפה מחזירה את אותן
// המחלקות המדויקות, אך כטקסט קבוע שהסורק מזהה. כל 18 הצבעים שמופיעים ב-courseData (colorFrom).
const CHAPTER_ACCENT: Record<string, { glowTop: string; glowBottom: string; card: string; grad: string; label: string; kbd: string }> = {
    amber: { glowTop: "bg-amber-500/20", glowBottom: "bg-amber-600/10", card: "border-amber-500/30 hover:border-amber-500/50 [--nx-d:var(--color-amber-900)] [--nx-l:var(--color-amber-500)]", grad: "via-amber-500/5 to-amber-500/10", label: "[--nx:var(--color-amber-400)] [--nxh:var(--color-amber-300)]", kbd: "border-amber-500/40" },
    blue: { glowTop: "bg-blue-500/20", glowBottom: "bg-blue-600/10", card: "border-blue-500/30 hover:border-blue-500/50 [--nx-d:var(--color-blue-900)] [--nx-l:var(--color-blue-500)]", grad: "via-blue-500/5 to-blue-500/10", label: "[--nx:var(--color-blue-400)] [--nxh:var(--color-blue-300)]", kbd: "border-blue-500/40" },
    cyan: { glowTop: "bg-cyan-500/20", glowBottom: "bg-cyan-600/10", card: "border-cyan-500/30 hover:border-cyan-500/50 [--nx-d:var(--color-cyan-900)] [--nx-l:var(--color-cyan-500)]", grad: "via-cyan-500/5 to-cyan-500/10", label: "[--nx:var(--color-cyan-400)] [--nxh:var(--color-cyan-300)]", kbd: "border-cyan-500/40" },
    emerald: { glowTop: "bg-emerald-500/20", glowBottom: "bg-emerald-600/10", card: "border-emerald-500/30 hover:border-emerald-500/50 [--nx-d:var(--color-emerald-900)] [--nx-l:var(--color-emerald-500)]", grad: "via-emerald-500/5 to-emerald-500/10", label: "[--nx:var(--color-emerald-400)] [--nxh:var(--color-emerald-300)]", kbd: "border-emerald-500/40" },
    fuchsia: { glowTop: "bg-fuchsia-500/20", glowBottom: "bg-fuchsia-600/10", card: "border-fuchsia-500/30 hover:border-fuchsia-500/50 [--nx-d:var(--color-fuchsia-900)] [--nx-l:var(--color-fuchsia-500)]", grad: "via-fuchsia-500/5 to-fuchsia-500/10", label: "[--nx:var(--color-fuchsia-400)] [--nxh:var(--color-fuchsia-300)]", kbd: "border-fuchsia-500/40" },
    green: { glowTop: "bg-green-500/20", glowBottom: "bg-green-600/10", card: "border-green-500/30 hover:border-green-500/50 [--nx-d:var(--color-green-900)] [--nx-l:var(--color-green-500)]", grad: "via-green-500/5 to-green-500/10", label: "[--nx:var(--color-green-400)] [--nxh:var(--color-green-300)]", kbd: "border-green-500/40" },
    indigo: { glowTop: "bg-indigo-500/20", glowBottom: "bg-indigo-600/10", card: "border-indigo-500/30 hover:border-indigo-500/50 [--nx-d:var(--color-indigo-900)] [--nx-l:var(--color-indigo-500)]", grad: "via-indigo-500/5 to-indigo-500/10", label: "[--nx:var(--color-indigo-400)] [--nxh:var(--color-indigo-300)]", kbd: "border-indigo-500/40" },
    lime: { glowTop: "bg-lime-500/20", glowBottom: "bg-lime-600/10", card: "border-lime-500/30 hover:border-lime-500/50 [--nx-d:var(--color-lime-900)] [--nx-l:var(--color-lime-500)]", grad: "via-lime-500/5 to-lime-500/10", label: "[--nx:var(--color-lime-400)] [--nxh:var(--color-lime-300)]", kbd: "border-lime-500/40" },
    orange: { glowTop: "bg-orange-500/20", glowBottom: "bg-orange-600/10", card: "border-orange-500/30 hover:border-orange-500/50 [--nx-d:var(--color-orange-900)] [--nx-l:var(--color-orange-500)]", grad: "via-orange-500/5 to-orange-500/10", label: "[--nx:var(--color-orange-400)] [--nxh:var(--color-orange-300)]", kbd: "border-orange-500/40" },
    pink: { glowTop: "bg-pink-500/20", glowBottom: "bg-pink-600/10", card: "border-pink-500/30 hover:border-pink-500/50 [--nx-d:var(--color-pink-900)] [--nx-l:var(--color-pink-500)]", grad: "via-pink-500/5 to-pink-500/10", label: "[--nx:var(--color-pink-400)] [--nxh:var(--color-pink-300)]", kbd: "border-pink-500/40" },
    purple: { glowTop: "bg-purple-500/20", glowBottom: "bg-purple-600/10", card: "border-purple-500/30 hover:border-purple-500/50 [--nx-d:var(--color-purple-900)] [--nx-l:var(--color-purple-500)]", grad: "via-purple-500/5 to-purple-500/10", label: "[--nx:var(--color-purple-400)] [--nxh:var(--color-purple-300)]", kbd: "border-purple-500/40" },
    red: { glowTop: "bg-red-500/20", glowBottom: "bg-red-600/10", card: "border-red-500/30 hover:border-red-500/50 [--nx-d:var(--color-red-900)] [--nx-l:var(--color-red-500)]", grad: "via-red-500/5 to-red-500/10", label: "[--nx:var(--color-red-400)] [--nxh:var(--color-red-300)]", kbd: "border-red-500/40" },
    rose: { glowTop: "bg-rose-500/20", glowBottom: "bg-rose-600/10", card: "border-rose-500/30 hover:border-rose-500/50 [--nx-d:var(--color-rose-900)] [--nx-l:var(--color-rose-500)]", grad: "via-rose-500/5 to-rose-500/10", label: "[--nx:var(--color-rose-400)] [--nxh:var(--color-rose-300)]", kbd: "border-rose-500/40" },
    sky: { glowTop: "bg-sky-500/20", glowBottom: "bg-sky-600/10", card: "border-sky-500/30 hover:border-sky-500/50 [--nx-d:var(--color-sky-900)] [--nx-l:var(--color-sky-500)]", grad: "via-sky-500/5 to-sky-500/10", label: "[--nx:var(--color-sky-400)] [--nxh:var(--color-sky-300)]", kbd: "border-sky-500/40" },
    slate: { glowTop: "bg-slate-500/20", glowBottom: "bg-slate-600/10", card: "border-slate-500/30 hover:border-slate-500/50 [--nx-d:var(--color-slate-900)] [--nx-l:var(--color-slate-500)]", grad: "via-slate-500/5 to-slate-500/10", label: "[--nx:var(--color-slate-400)] [--nxh:var(--color-slate-300)]", kbd: "border-slate-500/40" },
    teal: { glowTop: "bg-teal-500/20", glowBottom: "bg-teal-600/10", card: "border-teal-500/30 hover:border-teal-500/50 [--nx-d:var(--color-teal-900)] [--nx-l:var(--color-teal-500)]", grad: "via-teal-500/5 to-teal-500/10", label: "[--nx:var(--color-teal-400)] [--nxh:var(--color-teal-300)]", kbd: "border-teal-500/40" },
    violet: { glowTop: "bg-violet-500/20", glowBottom: "bg-violet-600/10", card: "border-violet-500/30 hover:border-violet-500/50 [--nx-d:var(--color-violet-900)] [--nx-l:var(--color-violet-500)]", grad: "via-violet-500/5 to-violet-500/10", label: "[--nx:var(--color-violet-400)] [--nxh:var(--color-violet-300)]", kbd: "border-violet-500/40" },
    yellow: { glowTop: "bg-yellow-500/20", glowBottom: "bg-yellow-600/10", card: "border-yellow-500/30 hover:border-yellow-500/50 [--nx-d:var(--color-yellow-900)] [--nx-l:var(--color-yellow-500)]", grad: "via-yellow-500/5 to-yellow-500/10", label: "[--nx:var(--color-yellow-400)] [--nxh:var(--color-yellow-300)]", kbd: "border-yellow-500/40" },
};

// label/kbd: הטקסט נקבע בשימוש (NEXT_INK) מתוך שני משתנים, כדי שיוכהה ב-Light דרך
// --bts-ink-darken (0% ב-Dark = אותו צבע בדיוק) בלי 18 x 2 מחלקות ארוכות.
const NEXT_INK = "text-[color-mix(in_oklab,var(--nx)_calc(100%_-_var(--bts-ink-darken)),black)] group-hover:text-[color-mix(in_oklab,var(--nxh)_calc(100%_-_var(--bts-ink-darken)),black)]";
// רקע הכרטיס/הקיבורד: Dark = הגוון -900 בשקיפות (זהה למקור); Light = הגוון -500 (--bts-tint-mix),
// כדי שהכרטיס לא ייראה כתם אפרפר על רקע בהיר.
const NEXT_BG = "bg-[color-mix(in_oklab,color-mix(in_oklab,var(--nx-l)_var(--bts-tint-mix),var(--nx-d))_10%,transparent)] hover:bg-[color-mix(in_oklab,color-mix(in_oklab,var(--nx-l)_var(--bts-tint-mix),var(--nx-d))_20%,transparent)]";
const NEXT_TINT_10 = "bg-[color-mix(in_oklab,color-mix(in_oklab,var(--nx-l)_var(--bts-tint-mix),var(--nx-d))_10%,transparent)]";
const NEXT_KBD_BG = "bg-[color-mix(in_oklab,color-mix(in_oklab,var(--nx-l)_var(--bts-tint-mix),var(--nx-d))_20%,transparent)]";
const NEXT_KBD_INK = "text-[color-mix(in_oklab,var(--nxh)_calc(100%_-_var(--bts-ink-darken)),black)]";

// שם צבע -> ערכת מבטא. נופל ל-slate אם הצבע לא מוכר (זהה לברירת המחדל של activeChapter).
const accentFor = (colorName: string) => CHAPTER_ACCENT[colorName] ?? CHAPTER_ACCENT.slate;

interface ChapterLayoutProps {
    children: ReactNode;
    courseId: string;
    currentChapterId: number;
    lang?: Language;
    /**
     * הצטרפות מפורשת לערכת הנושא הגלובלית. ברירת המחדל (false) נועלת את תת-העץ
     * של הפרק ל-Dark: השורש חותם data-theme="dark", ולכן אסימוני הערכה נפתרים
     * ל-Dark גם כאשר <html> נפתר ל-light. כך כל המסלולים שלא הצטרפו (פרקים 1-19,
     * המבדק, Python, מתמטיקה) נשארים בדיוק כפי שהם, בלי לגעת בקבצים שלהם.
     * כשהערך true לא נחתם מאפיין כלל, והערכה יורשת מ-<html> בקסקדה.
     */
    themeAware?: boolean;
}

export const ChapterLayout: React.FC<ChapterLayoutProps> = ({
    children,
    courseId,
    currentChapterId,
    lang,
    themeAware = false
}) => {
    // השפה הפעילה מגיעה מה-LocaleProvider. ה-prop lang נשאר כ-override אופציונלי
    // (לא בשימוש כיום). הכיוון תמיד נגזר מהרישום (dirOf), לא מ-lang === 'he'.
    const { locale: ctxLocale } = useT();
    const locale = lang ?? ctxLocale;
    const dir = dirOf(locale);
    const t = getDictionary(locale);

    // --- 1. Hooks & Refs ---
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [showFocusHint, setShowFocusHint] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    // הכותרת הדביקה היא overlay אטום ב-z גבוה; הגובה שלה משתנה (כותרת ארוכה נשברת
    // לשתי שורות, מובייל, שינוי רוחב). פסים דביקים (StickyContextBar/StickyInputDock)
    // חייבים להיצמד *מתחת* לכותרת ולא להסתתר מאחוריה - לכן מודדים את הגובה האמיתי
    // וחושפים אותו כמשתנה CSS שיורש לכל העץ, במקום offset קשיח של 88px.
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState<number | null>(null);
    // הריפוד העליון של התוכן נגזר מגובה הכותרת *במנוחה*, ולא מהגובה הנוכחי: הכותרת
    // מתכווצת בגלילה, ולכן ריפוד שעוקב אחרי הגובה החי היה מקפיץ את התוכן באמצע הגלילה.
    // headerHeight (הדינמי) נשאר לפסים דביקים ול-scroll-mt, שדווקא צריכים את הגובה הנוכחי.
    const [headerRestHeight, setHeaderRestHeight] = useState<number | null>(null);
    const isScrolledRef = useRef(false);
    const router = useRouter();

    useEffect(() => {
        const el = headerRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return;
        const update = () => {
            const h = el.offsetHeight;
            setHeaderHeight(h);
            // רק במנוחה: זהו הגובה המלא שהתוכן צריך להתפנות מפניו.
            if (!isScrolledRef.current) setHeaderRestHeight(h);
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // מצב מיקוד: שחזור ההעדפה לאורך ה-session. נטען רק אחרי mount בצד הלקוח (ולא ב-initial state)
    // כדי למנוע אי-התאמת hydration - השרת תמיד מרנדר מצב רגיל.
    useEffect(() => {
        try {
            if (sessionStorage.getItem('lesson-focus-mode') === '1') {
                // eslint-disable-next-line react-hooks/set-state-in-effect -- הסנכרון עם sessionStorage חייב לקרות אחרי mount בצד הלקוח
                setIsFocusMode(true);
            }
        } catch {
            // אחסון חסום: נשארים במצב רגיל.
        }
    }, []);

    useEffect(() => {
        try {
            sessionStorage.setItem('lesson-focus-mode', isFocusMode ? '1' : '0');
        } catch {
            // אחסון חסום או מלא: ההעדפה תקפה לעמוד הנוכחי בלבד.
        }
    }, [isFocusMode]);

    // קיצורי מקלדת למצב מיקוד: Esc יוצא, F מחליף מצב.
    // לא חוטפים מקשים בזמן הקלדה בשדה/סליידר וכשיש מקש החזקה - כדי לא לשבור מעבדות אינטראקטיביות.
    useEffect(() => {
        const handleFocusKeys = (e: KeyboardEvent) => {
            if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;

            const target = e.target as HTMLElement | null;
            if (target) {
                const tag = target.tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) return;
            }

            if (e.key === 'Escape') {
                setIsFocusMode((prev) => (prev ? false : prev));
            } else if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                setIsFocusMode((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleFocusKeys);
        return () => window.removeEventListener('keydown', handleFocusKeys);
    }, []);

    // רמז כניסה אלגנטי: בכל פעם שנכנסים למצב מיקוד מציגים תזכורת חולפת ("Esc ליציאה") שנעלמת לבד.
    useEffect(() => {
        if (!isFocusMode) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- הצגת הרמז היא תגובת UI חולפת למעבר מצב
        setShowFocusHint(true);
        const t = setTimeout(() => setShowFocusHint(false), 2800);
        return () => {
            clearTimeout(t);
            setShowFocusHint(false);
        };
    }, [isFocusMode]);

    // פתרון לבעיית הגלילה בפרק 16: איפוס מיקום הגלילה בכל מעבר פרק
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [currentChapterId, courseId]);

    // ניווט בין פרקים בעזרת מקשי החצים. ב-RTL: שמאלה=הבא, ימינה=הקודם (תואם לחיצים בפוטר).
    // לא חוטפים מקשים כשהמשתמש מקליד בשדה או מזיז סליידר, וכשיש מקש החזקה (Ctrl/Cmd/Alt).
    useEffect(() => {
        const handleKeyNav = (e: KeyboardEvent) => {
            if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

            const target = e.target as HTMLElement | null;
            if (target) {
                const tag = target.tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) return;
            }

            const course = courses[courseId];
            if (!course) return;
            const idx = course.chapters.findIndex(c => c.id === currentChapterId);
            if (idx === -1) return;

            const isRtl = dir === 'rtl';
            const goNext = isRtl ? e.key === 'ArrowLeft' : e.key === 'ArrowRight';
            const destination = goNext ? course.chapters[idx + 1] : course.chapters[idx - 1];
            if (destination?.href) {
                e.preventDefault();
                router.push(destination.href);
            }
        };

        window.addEventListener('keydown', handleKeyNav);
        return () => window.removeEventListener('keydown', handleKeyNav);
    }, [courseId, currentChapterId, dir, router]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        
        // עדכון מצב Scrolled לצורך עיצוב ה-Header
        if (!isScrolled && scrollTop > 50) {
            isScrolledRef.current = true;
            setIsScrolled(true);
        } else if (isScrolled && scrollTop < 30) {
            // חזרנו למנוחה. אין למדוד כאן: הכותרת עדיין מכווצת בפריים הזה. ה-ResizeObserver
            // יירה כשהיא תתרחב, ואז isScrolledRef כבר false ו-headerRestHeight יתעדכן נכון.
            isScrolledRef.current = false;
            setIsScrolled(false);
        }

        // חישוב התקדמות גלילה
        const totalScroll = scrollHeight - clientHeight;
        if (totalScroll <= 0) { 
            setScrollProgress(0); 
            return; 
        }
        setScrollProgress((scrollTop / totalScroll) * 100);
    };

    // --- 2. שליפת נתונים ---
    const currentCourse = courses[courseId];
    
    if (!currentCourse) {
        return <div className="text-white p-10">Error: Course &quot;{courseId}&quot; not found.</div>;
    }

    const chapters = currentCourse.chapters;
    const chapterIndex = chapters.findIndex(c => c.id === currentChapterId);
    
    const activeChapter = chapters[chapterIndex] || {
        id: -1,
        num: `0`,
        label: { he: "", en: "" },
        title: { he: "פרק לא נמצא", en: "Chapter not found" },
        readTime: "0 דקות",
        labelColor: "text-slate-400",
        colorFrom: "from-slate-400",
        colorTo: "to-slate-600",
        href: "#"
    };

    const prevChapter = chapters[chapterIndex - 1];
    const nextChapter = chapters[chapterIndex + 1];
    const isIntro = currentChapterId === 0;
    const isBtsAi = courseId === 'behind-the-scenes-ai';

    const isRTL = dir === 'rtl';

    const chapterNumDisplay = activeChapter.id === 0 ? t.chrome.intro : formatChapterLabel(locale, activeChapter.id);
    const chapterTitle = tField(activeChapter.title, locale);
    const chapterLabel = tField(activeChapter.label, locale);

    const extractColorName = (fullClass: string) => {
        return fullClass.replace('from-', '').split('-')[0];
    };
    
    const themeAccent = accentFor(extractColorName(activeChapter.colorFrom));

    return (
        <div
            className="flex min-h-[100dvh] bg-[var(--bts-page)] font-sans text-[var(--bts-text-primary)] selection:bg-indigo-500/30 overflow-hidden relative"
            dir={dir}
            // נעילת-היקף: ראה themeAware למעלה.
            data-theme={themeAware ? undefined : 'dark'}
            // --bts-sticky-top: נקודת העגינה לפסים הדביקים - גובה הכותרת *הנוכחי* + מרווח קטן.
            // --bts-content-top: הריפוד העליון של התוכן - גובה הכותרת *במנוחה* + מרווח קטן, כדי
            // שהתוכן לא יתחיל מתחת לכותרת האטומה. נפרד מהראשון כי הכותרת מתכווצת בגלילה.
            // עד שנמדדו (SSR / לפני mount) נופלים חזרה ל-fallback שבצרכן.
            style={
                {
                    ...(headerHeight != null ? { ['--bts-sticky-top']: `${headerHeight + 8}px` } : {}),
                    ...(headerRestHeight != null ? { ['--bts-content-top']: `${headerRestHeight + 8}px` } : {}),
                } as React.CSSProperties
            }
        >
            {/* --- רקע גלובלי --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                 <div className="absolute inset-0 bg-[var(--bts-page)]"></div>
                 <div className="absolute inset-0 opacity-40"> 
                    <div className="absolute inset-0" 
                        style={{ 
                            backgroundImage: `radial-gradient(var(--bts-dot) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px' 
                        }}
                    ></div>
                 </div>

                 {/* motion-reduce:animate-none - ההילה הסביבתית פועמת ברציפות; מכובה כשהמשתמש
                     ביקש הפחתת תנועה. וריאנט CSS בלבד, בלי JS ובלי סיכון hydration.
                     צבע ההילה מגיע מהמפה הסטטית (themeAccent), לא מאינטרפולציה. */}
                 <div className={`absolute top-[-20%] ${isRTL ? 'right-[-10%]' : 'left-[-10%]'} w-150 h-150 ${themeAccent.glowTop} blur-[120px] rounded-full [mix-blend-mode:var(--bts-ambient-blend)] animate-pulse motion-reduce:animate-none`}></div>
                 <div className={`absolute bottom-[-20%] ${isRTL ? 'left-[-10%]' : 'right-[-10%]'} w-125 h-125 ${themeAccent.glowBottom} blur-[100px] rounded-full [mix-blend-mode:var(--bts-ambient-blend)]`}></div>
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--bts-page)_120%)]"></div>
            </div>

            {/* מצב מיקוד: וינייטה אווירתית שמכהה את הקצוות וממקדת את העין במרכז הקריאה */}
            <motion.div
                aria-hidden
                initial={false}
                animate={{ opacity: isFocusMode ? 1 : 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="fixed inset-0 z-[5] pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_center,transparent_55%,var(--bts-vignette)_100%)]"
            />

            <CourseSidebar isFocusMode={isFocusMode} />

            {/* מצב מיקוד: כפתור זכוכית צף (דסקטופ בלבד) בתוך מסילת-הקצה המשותפת, מתחת לדוק
                ההאזנה (כשקיים). מיקום תלוי-כיוון: RTL שמאל (הרחק מהסרגל מימין), LTR ימין.
                האייקון בצד הפונה למרכז כדי שרק הוא יבצבץ במצב ההצצה. */}
            <EdgeRail dir={dir}>
                <EdgePeekItem dir={dir} peekRem={1.75} className="hidden md:block">
                    <motion.button
                        onClick={() => setIsFocusMode((prev) => !prev)}
                        title={t.chrome.focus.toggleTitle}
                        aria-pressed={isFocusMode}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 26 }}
                        className={`group relative flex items-center gap-2.5 rounded-2xl border border-[var(--bts-divider-soft)] bg-[var(--bts-surface-elevated)] px-4 py-3 text-sm font-semibold text-[var(--bts-text-bright)] shadow-[0_8px_32px_var(--bts-shadow-float)] backdrop-blur-xl transition-colors hover:border-indigo-400/40 hover:text-[var(--bts-text-primary)]`}
                    >
                        {/* הילה רכה בריחוף */}
                        <span className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-cyan-500/0 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />

                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={isFocusMode ? "min" : "max"}
                                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                                className="flex"
                            >
                                {isFocusMode
                                    ? <Minimize2 size={16} className="text-cyan-300" />
                                    : <Maximize2 size={16} className="text-indigo-300" />}
                            </motion.span>
                        </AnimatePresence>

                        <span>{isFocusMode ? t.chrome.focus.exit : t.chrome.focus.enter}</span>

                        <kbd className="ms-1 rounded-md border border-[var(--bts-divider-soft)] bg-[var(--bts-fill-soft)] px-1.5 py-0.5 font-mono text-[10px] leading-none text-[var(--bts-text-muted)] transition-colors group-hover:text-[var(--bts-text-body)]">F</kbd>
                    </motion.button>
                </EdgePeekItem>
            </EdgeRail>

            {/* מצב מיקוד: רמז כניסה חולף ממורכז למעלה */}
            <div className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                <AnimatePresence>
                    {showFocusHint && (
                        <motion.div
                            initial={{ opacity: 0, y: -16, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -16, scale: 0.96 }}
                            transition={{ type: "spring", stiffness: 300, damping: 26 }}
                            className="flex items-center gap-2.5 rounded-full border border-[var(--bts-divider-soft)] bg-[color-mix(in_oklab,var(--bts-panel-from)_80%,transparent)] px-4 py-2 text-xs font-medium text-[var(--bts-text-body)] shadow-[0_8px_30px_var(--bts-shadow-float)] backdrop-blur-xl"
                        >
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                            <span>{t.chrome.focus.activeBadge}</span>
                            <span className="text-[var(--bts-text-subtle)]">·</span>
                            <span className="flex items-center gap-1.5 text-[var(--bts-text-muted)]">
                                {t.chrome.focus.press}
                                <kbd className="rounded border border-[var(--bts-divider-soft)] bg-[var(--bts-fill-soft)] px-1.5 py-0.5 font-mono text-[10px] leading-none">Esc</kbd>
                                {t.chrome.focus.toExit}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* h-[100dvh] ולא h-screen: במובייל 100vh כולל את שטח סרגל הכתובת, ולכן תחתית
                מיכל הגלילה (והניווט הדביק של המבדק) נחתכה מתחתיו. dvh עוקב אחרי הגובה הגלוי. */}
            <div className="flex-1 relative h-[100dvh] flex flex-col z-10">
                
                {/* Header */}
                <div ref={headerRef} className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
                    <div className="pointer-events-auto">
                        <CourseHeader 
                            chapterLable={chapterLabel}
                            labelColor={activeChapter.labelColor} 
                            chapterNum={chapterNumDisplay}
                            title={chapterTitle}
                            readTime={formatReadTime(locale, parseReadTimeMinutes(activeChapter.readTime))}
                            isScrolled={isScrolled}
                            scrollProgress={scrollProgress}
                            colorFrom={activeChapter.colorFrom}
                            colorTo={activeChapter.colorTo}
                            // ב-behind-the-scenes-ai ה-hero של הפרק הוא ה-h1; לומדות אחרות (math)
                            // נשענות על כותרת הסרגל ככותרת הראשית, ולכן שם היא נשארת h1.
                            titleAsHeading={courseId !== 'behind-the-scenes-ai'}
                        />
                    </div>
                </div>

                {/* תוכן גלילה - כאן נוסף ה-Ref המטפל באיפוס הגלילה */}
                <div 
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth"
                    onScroll={handleScroll}
                >
                    {/* קנה-מידה נזיל בדסקטופ/טאבלט: הריפוד האופקי ומרווחי המקטעים מתכווצים
                        בהדרגה עם רוחב החלון (clamp) במקום לקפוץ בנקודות-שבירה. במובייל נשמר הריפוד
                        הקיים (px-8). המחלקה bts-fluid מפעילה גם את קנה-המידה הנזיל של כותרת ההירו
                        (globals.css). מוגבל ל-behind-the-scenes-ai כדי לא לגעת בלומדות אחרות. */}
                    <main className={`mx-auto pb-32 transition-[max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                        ${isBtsAi
                            ? 'bts-fluid px-8 md:px-[clamp(1.75rem,0.3rem+2.8vw,3rem)] space-y-[clamp(3.5rem,2.2rem+3.5vw,6rem)]'
                            : 'px-8 md:px-12 space-y-24'}
                        ${isFocusMode ? 'max-w-5xl' : 'max-w-4xl'}
                        ${isIntro ? 'pt-12' : 'pt-[var(--bts-content-top,13rem)] py-12'}
                    `}>
                        
                        <div className="min-h-[50vh]">
                            <FocusModeContext.Provider value={isFocusMode}>
                                {children}
                            </FocusModeContext.Provider>
                        </div>

                        {/* --- Footer ניווט --- */}
                        <div className="border-t border-[var(--bts-border)] pt-12 mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* אחורה */}
                            {prevChapter ? (
                                <Link href={prevChapter.href || "#"} className="group relative overflow-hidden rounded-2xl border border-[var(--bts-border)] bg-[var(--bts-surface)] p-6 transition-all hover:bg-[var(--bts-surface-elevated)] hover:border-[var(--bts-border-emphasis)]">
                                    <div className="flex flex-col items-start gap-2 relative z-10">
                                        <span className="text-xs font-mono text-[var(--bts-text-muted)] group-hover:text-[var(--bts-text-secondary)] transition-colors flex items-center gap-2">
                                            {isRTL ? <ChevronRight size={14} /> : <ChevronLeft size={14} />} {t.chrome.nav.prev}
                                            <kbd className="rounded border border-[var(--bts-border-emphasis)] bg-[var(--bts-surface-elevated)] px-1.5 py-0.5 text-[10px] leading-none text-[var(--bts-text-muted)]">{isRTL ? '→' : '←'}</kbd>
                                        </span>
                                        <div className="font-bold text-lg text-[var(--bts-text-secondary)] group-hover:text-[var(--bts-text-primary)] transition-colors">
                                            {tField(prevChapter.title, locale)}
                                        </div>
                                    </div>
                                </Link>
                            ) : (<div></div>)}

                            {/* קדימה */}
                            {nextChapter ? (
                                (() => {
                                    const nextAccent = accentFor(extractColorName(nextChapter.colorFrom));
                                    return (
                                        <Link href={nextChapter.href || "#"} className={`group relative overflow-hidden rounded-2xl border ${nextAccent.card} ${NEXT_BG} p-6 transition-all text-start`}>
                                            <div className={`absolute inset-0 bg-linear-to-r from-transparent ${nextAccent.grad} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                                            <div className={`flex flex-col ${isRTL ? 'items-start' : 'items-end'} gap-2 relative z-10`}>
                                                <span className={`text-xs font-mono font-bold ${nextAccent.label} ${NEXT_INK} transition-colors flex items-center gap-2`}>
                                                    {formatNextChapterLabel(locale, nextChapter.id)}
                                                    {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                                                    <kbd className={`rounded border ${nextAccent.kbd} ${NEXT_KBD_BG} ${NEXT_KBD_INK} px-1.5 py-0.5 text-[10px] leading-none`}>{isRTL ? '←' : '→'}</kbd>
                                                </span>
                                                <div className={`font-bold text-xl text-[var(--bts-text-primary)] group-hover:scale-[1.02] transition-transform ${isRTL ? 'origin-right' : 'origin-left'}`}>
                                                    {tField(nextChapter.title, locale)}
                                                </div>
                                                <div className="text-xs text-[var(--bts-text-muted)] mt-1 flex items-center gap-1.5">
                                                    <BookOpen size={12} />
                                                    {formatReadTime(locale, parseReadTimeMinutes(nextChapter.readTime))}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })()
                            ) : currentCourse.hasUpcomingChapters ? (
                                // הפרק האחרון הבנוי אינו הפרק האחרון בתוכנית: ניסוח ניטרלי שלא
                                // מרמז שהלומדה הסתיימה (למשל "מאחורי הקלעים של AI", שבה מחכים
                                // עוד פרקים באזור ה-Agent).
                                <div className={`p-6 rounded-2xl border border-indigo-500/30 ${NEXT_TINT_10} [--nx-d:var(--color-indigo-900)] [--nx-l:var(--color-indigo-500)] flex flex-col items-center justify-center text-center gap-2`}>
                                    <Milestone size={28} className="text-indigo-400" />
                                    <span className="font-bold text-lg text-[var(--bts-text-primary)]">{t.chrome.nav.moreComingTitle}</span>
                                    <span className="text-sm text-[var(--bts-text-muted)]">{t.chrome.nav.moreComingSub}</span>
                                </div>
                            ) : (
                                <div className={`p-6 rounded-2xl border border-amber-500/30 ${NEXT_TINT_10} [--nx-d:var(--color-amber-900)] [--nx-l:var(--color-amber-500)] flex flex-col items-center justify-center text-center gap-2`}>
                                    <Trophy size={28} className="text-amber-400" />
                                    <span className="font-bold text-lg text-[var(--bts-text-primary)]">{t.chrome.nav.finishedTitle}</span>
                                    <span className="text-sm text-[var(--bts-text-muted)]">{t.chrome.nav.finishedSub}</span>
                                </div>
                            )}

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};