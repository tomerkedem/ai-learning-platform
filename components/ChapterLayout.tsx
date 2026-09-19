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
    amber: { glowTop: "bg-amber-500/20", glowBottom: "bg-amber-600/10", card: "border-amber-500/30 bg-amber-900/10 hover:bg-amber-900/20 hover:border-amber-500/50", grad: "via-amber-500/5 to-amber-500/10", label: "text-amber-400 group-hover:text-amber-300", kbd: "border-amber-500/40 bg-amber-900/20 text-amber-300" },
    blue: { glowTop: "bg-blue-500/20", glowBottom: "bg-blue-600/10", card: "border-blue-500/30 bg-blue-900/10 hover:bg-blue-900/20 hover:border-blue-500/50", grad: "via-blue-500/5 to-blue-500/10", label: "text-blue-400 group-hover:text-blue-300", kbd: "border-blue-500/40 bg-blue-900/20 text-blue-300" },
    cyan: { glowTop: "bg-cyan-500/20", glowBottom: "bg-cyan-600/10", card: "border-cyan-500/30 bg-cyan-900/10 hover:bg-cyan-900/20 hover:border-cyan-500/50", grad: "via-cyan-500/5 to-cyan-500/10", label: "text-cyan-400 group-hover:text-cyan-300", kbd: "border-cyan-500/40 bg-cyan-900/20 text-cyan-300" },
    emerald: { glowTop: "bg-emerald-500/20", glowBottom: "bg-emerald-600/10", card: "border-emerald-500/30 bg-emerald-900/10 hover:bg-emerald-900/20 hover:border-emerald-500/50", grad: "via-emerald-500/5 to-emerald-500/10", label: "text-emerald-400 group-hover:text-emerald-300", kbd: "border-emerald-500/40 bg-emerald-900/20 text-emerald-300" },
    fuchsia: { glowTop: "bg-fuchsia-500/20", glowBottom: "bg-fuchsia-600/10", card: "border-fuchsia-500/30 bg-fuchsia-900/10 hover:bg-fuchsia-900/20 hover:border-fuchsia-500/50", grad: "via-fuchsia-500/5 to-fuchsia-500/10", label: "text-fuchsia-400 group-hover:text-fuchsia-300", kbd: "border-fuchsia-500/40 bg-fuchsia-900/20 text-fuchsia-300" },
    green: { glowTop: "bg-green-500/20", glowBottom: "bg-green-600/10", card: "border-green-500/30 bg-green-900/10 hover:bg-green-900/20 hover:border-green-500/50", grad: "via-green-500/5 to-green-500/10", label: "text-green-400 group-hover:text-green-300", kbd: "border-green-500/40 bg-green-900/20 text-green-300" },
    indigo: { glowTop: "bg-indigo-500/20", glowBottom: "bg-indigo-600/10", card: "border-indigo-500/30 bg-indigo-900/10 hover:bg-indigo-900/20 hover:border-indigo-500/50", grad: "via-indigo-500/5 to-indigo-500/10", label: "text-indigo-400 group-hover:text-indigo-300", kbd: "border-indigo-500/40 bg-indigo-900/20 text-indigo-300" },
    lime: { glowTop: "bg-lime-500/20", glowBottom: "bg-lime-600/10", card: "border-lime-500/30 bg-lime-900/10 hover:bg-lime-900/20 hover:border-lime-500/50", grad: "via-lime-500/5 to-lime-500/10", label: "text-lime-400 group-hover:text-lime-300", kbd: "border-lime-500/40 bg-lime-900/20 text-lime-300" },
    orange: { glowTop: "bg-orange-500/20", glowBottom: "bg-orange-600/10", card: "border-orange-500/30 bg-orange-900/10 hover:bg-orange-900/20 hover:border-orange-500/50", grad: "via-orange-500/5 to-orange-500/10", label: "text-orange-400 group-hover:text-orange-300", kbd: "border-orange-500/40 bg-orange-900/20 text-orange-300" },
    pink: { glowTop: "bg-pink-500/20", glowBottom: "bg-pink-600/10", card: "border-pink-500/30 bg-pink-900/10 hover:bg-pink-900/20 hover:border-pink-500/50", grad: "via-pink-500/5 to-pink-500/10", label: "text-pink-400 group-hover:text-pink-300", kbd: "border-pink-500/40 bg-pink-900/20 text-pink-300" },
    purple: { glowTop: "bg-purple-500/20", glowBottom: "bg-purple-600/10", card: "border-purple-500/30 bg-purple-900/10 hover:bg-purple-900/20 hover:border-purple-500/50", grad: "via-purple-500/5 to-purple-500/10", label: "text-purple-400 group-hover:text-purple-300", kbd: "border-purple-500/40 bg-purple-900/20 text-purple-300" },
    red: { glowTop: "bg-red-500/20", glowBottom: "bg-red-600/10", card: "border-red-500/30 bg-red-900/10 hover:bg-red-900/20 hover:border-red-500/50", grad: "via-red-500/5 to-red-500/10", label: "text-red-400 group-hover:text-red-300", kbd: "border-red-500/40 bg-red-900/20 text-red-300" },
    rose: { glowTop: "bg-rose-500/20", glowBottom: "bg-rose-600/10", card: "border-rose-500/30 bg-rose-900/10 hover:bg-rose-900/20 hover:border-rose-500/50", grad: "via-rose-500/5 to-rose-500/10", label: "text-rose-400 group-hover:text-rose-300", kbd: "border-rose-500/40 bg-rose-900/20 text-rose-300" },
    sky: { glowTop: "bg-sky-500/20", glowBottom: "bg-sky-600/10", card: "border-sky-500/30 bg-sky-900/10 hover:bg-sky-900/20 hover:border-sky-500/50", grad: "via-sky-500/5 to-sky-500/10", label: "text-sky-400 group-hover:text-sky-300", kbd: "border-sky-500/40 bg-sky-900/20 text-sky-300" },
    slate: { glowTop: "bg-slate-500/20", glowBottom: "bg-slate-600/10", card: "border-slate-500/30 bg-slate-900/10 hover:bg-slate-900/20 hover:border-slate-500/50", grad: "via-slate-500/5 to-slate-500/10", label: "text-slate-400 group-hover:text-slate-300", kbd: "border-slate-500/40 bg-slate-900/20 text-slate-300" },
    teal: { glowTop: "bg-teal-500/20", glowBottom: "bg-teal-600/10", card: "border-teal-500/30 bg-teal-900/10 hover:bg-teal-900/20 hover:border-teal-500/50", grad: "via-teal-500/5 to-teal-500/10", label: "text-teal-400 group-hover:text-teal-300", kbd: "border-teal-500/40 bg-teal-900/20 text-teal-300" },
    violet: { glowTop: "bg-violet-500/20", glowBottom: "bg-violet-600/10", card: "border-violet-500/30 bg-violet-900/10 hover:bg-violet-900/20 hover:border-violet-500/50", grad: "via-violet-500/5 to-violet-500/10", label: "text-violet-400 group-hover:text-violet-300", kbd: "border-violet-500/40 bg-violet-900/20 text-violet-300" },
    yellow: { glowTop: "bg-yellow-500/20", glowBottom: "bg-yellow-600/10", card: "border-yellow-500/30 bg-yellow-900/10 hover:bg-yellow-900/20 hover:border-yellow-500/50", grad: "via-yellow-500/5 to-yellow-500/10", label: "text-yellow-400 group-hover:text-yellow-300", kbd: "border-yellow-500/40 bg-yellow-900/20 text-yellow-300" },
};

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
        if (sessionStorage.getItem('lesson-focus-mode') === '1') {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- הסנכרון עם sessionStorage חייב לקרות אחרי mount בצד הלקוח
            setIsFocusMode(true);
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem('lesson-focus-mode', isFocusMode ? '1' : '0');
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
                            backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`,
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
                className="fixed inset-0 z-[5] pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_center,transparent_55%,rgba(2,4,10,0.85)_100%)]"
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
                        className={`group relative flex items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-slate-100 shadow-[0_8px_32px_rgba(2,6,23,0.6)] backdrop-blur-xl transition-colors hover:border-indigo-400/40 hover:text-white`}
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

                        <kbd className="ms-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] leading-none text-slate-400 transition-colors group-hover:text-slate-200">F</kbd>
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
                            className="flex items-center gap-2.5 rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-xs font-medium text-slate-200 shadow-[0_8px_30px_rgba(2,6,23,0.6)] backdrop-blur-xl"
                        >
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                            <span>{t.chrome.focus.activeBadge}</span>
                            <span className="text-slate-600">·</span>
                            <span className="flex items-center gap-1.5 text-slate-400">
                                {t.chrome.focus.press}
                                <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] leading-none">Esc</kbd>
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
                                        <Link href={nextChapter.href || "#"} className={`group relative overflow-hidden rounded-2xl border ${nextAccent.card} p-6 transition-all text-start`}>
                                            <div className={`absolute inset-0 bg-linear-to-r from-transparent ${nextAccent.grad} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                                            <div className={`flex flex-col ${isRTL ? 'items-start' : 'items-end'} gap-2 relative z-10`}>
                                                <span className={`text-xs font-mono font-bold ${nextAccent.label} transition-colors flex items-center gap-2`}>
                                                    {formatNextChapterLabel(locale, nextChapter.id)}
                                                    {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                                                    <kbd className={`rounded border ${nextAccent.kbd} px-1.5 py-0.5 text-[10px] leading-none`}>{isRTL ? '←' : '→'}</kbd>
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
                                <div className="p-6 rounded-2xl border border-indigo-500/30 bg-indigo-900/10 flex flex-col items-center justify-center text-center gap-2">
                                    <Milestone size={28} className="text-indigo-400" />
                                    <span className="font-bold text-lg text-white">{t.chrome.nav.moreComingTitle}</span>
                                    <span className="text-sm text-slate-400">{t.chrome.nav.moreComingSub}</span>
                                </div>
                            ) : (
                                <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-900/10 flex flex-col items-center justify-center text-center gap-2">
                                    <Trophy size={28} className="text-amber-400" />
                                    <span className="font-bold text-lg text-white">{t.chrome.nav.finishedTitle}</span>
                                    <span className="text-sm text-slate-400">{t.chrome.nav.finishedSub}</span>
                                </div>
                            )}

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};