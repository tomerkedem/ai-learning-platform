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
import { ChevronRight, ChevronLeft, BookOpen, Trophy, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChapterLayoutProps {
    children: ReactNode;
    courseId: string;
    currentChapterId: number;
    lang?: Language;
}

export const ChapterLayout: React.FC<ChapterLayoutProps> = ({
    children,
    courseId,
    currentChapterId,
    lang
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
    const router = useRouter();

    useEffect(() => {
        const el = headerRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return;
        const update = () => setHeaderHeight(el.offsetHeight);
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
        if (!isScrolled && scrollTop > 50) setIsScrolled(true);
        else if (isScrolled && scrollTop < 30) setIsScrolled(false);

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
        description: { he: "לא נמצא מידע.", en: "No data found." },
        readTime: "0 דקות",
        labelColor: "text-slate-400",
        colorFrom: "from-slate-400",
        colorTo: "to-slate-600",
        href: "#"
    };

    const prevChapter = chapters[chapterIndex - 1];
    const nextChapter = chapters[chapterIndex + 1];
    const isIntro = currentChapterId === 0;

    const isRTL = dir === 'rtl';

    const chapterNumDisplay = activeChapter.id === 0 ? t.chrome.intro : formatChapterLabel(locale, activeChapter.id);
    const chapterTitle = tField(activeChapter.title, locale);
    const chapterDesc = tField(activeChapter.description, locale);
    const chapterLabel = tField(activeChapter.label, locale);

    const extractColorName = (fullClass: string) => {
        return fullClass.replace('from-', '').split('-')[0];
    };
    
    const themeColorName = extractColorName(activeChapter.colorFrom); 

    return (
        <div
            className="flex min-h-screen bg-[#050B14] font-sans text-slate-100 selection:bg-indigo-500/30 overflow-hidden relative"
            dir={dir}
            // נקודת העגינה לפסים הדביקים: גובה הכותרת בפועל + מרווח קטן. עד שנמדד
            // (SSR / לפני mount) נופלים חזרה ל-88px דרך ה-fallback שב-StickyContextBar.
            style={headerHeight != null ? ({ ['--bts-sticky-top']: `${headerHeight + 8}px` } as React.CSSProperties) : undefined}
        >
            {/* --- רקע גלובלי --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                 <div className="absolute inset-0 bg-[#050B14]"></div>
                 <div className="absolute inset-0 opacity-40"> 
                    <div className="absolute inset-0" 
                        style={{ 
                            backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`,
                            backgroundSize: '40px 40px' 
                        }}
                    ></div>
                 </div>

                 <div className={`absolute top-[-20%] ${isRTL ? 'right-[-10%]' : 'left-[-10%]'} w-150 h-150 bg-${themeColorName}-500/20 blur-[120px] rounded-full mix-blend-screen animate-pulse`}></div>
                 <div className={`absolute bottom-[-20%] ${isRTL ? 'left-[-10%]' : 'right-[-10%]'} w-125 h-125 bg-${themeColorName}-600/10 blur-[100px] rounded-full mix-blend-screen`}></div>
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050B14_120%)]"></div>
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

            {/* מצב מיקוד: כפתור זכוכית צף (דסקטופ בלבד) - לא מתנגש עם ה-Header או הסרגל */}
            <motion.button
                onClick={() => setIsFocusMode((prev) => !prev)}
                title={t.chrome.focus.toggleTitle}
                aria-pressed={isFocusMode}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className="group hidden md:flex fixed bottom-6 left-6 z-50 items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-slate-100 shadow-[0_8px_32px_rgba(2,6,23,0.6)] backdrop-blur-xl transition-colors hover:border-indigo-400/40 hover:text-white"
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

            <div className="flex-1 relative h-screen flex flex-col z-10">
                
                {/* Header */}
                <div ref={headerRef} className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
                    <div className="pointer-events-auto">
                        <CourseHeader 
                            chapterLable={chapterLabel}
                            labelColor={activeChapter.labelColor} 
                            chapterNum={chapterNumDisplay}
                            title={chapterTitle}
                            description={chapterDesc}
                            readTime={formatReadTime(locale, parseReadTimeMinutes(activeChapter.readTime))}
                            isScrolled={isScrolled}
                            scrollProgress={scrollProgress}
                            colorFrom={activeChapter.colorFrom} 
                            colorTo={activeChapter.colorTo}
                        />
                    </div>
                </div>

                {/* תוכן גלילה - כאן נוסף ה-Ref המטפל באיפוס הגלילה */}
                <div 
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth"
                    onScroll={handleScroll}
                >
                    <main className={`mx-auto px-8 md:px-12 pb-32 space-y-24 transition-[max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                        ${isFocusMode ? 'max-w-5xl' : 'max-w-4xl'}
                        ${isIntro ? 'pt-12' : 'pt-52 py-12'}
                    `}>
                        
                        <div className="min-h-[50vh]">
                            {children}
                        </div>

                        {/* --- Footer ניווט --- */}
                        <div className="border-t border-slate-800/60 pt-12 mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* אחורה */}
                            {prevChapter ? (
                                <Link href={prevChapter.href || "#"} className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:bg-slate-800 hover:border-slate-700">
                                    <div className={`flex flex-col ${isRTL ? 'items-start' : 'items-end'} gap-2 relative z-10`}>
                                        <span className="text-xs font-mono text-slate-500 group-hover:text-slate-400 transition-colors flex items-center gap-2">
                                            {isRTL ? <ChevronRight size={14} /> : null} {t.chrome.nav.prev} {!isRTL ? <ChevronRight size={14} /> : null}
                                            <kbd className="rounded border border-slate-700 bg-slate-800/80 px-1.5 py-0.5 text-[10px] leading-none text-slate-400">{isRTL ? '→' : '←'}</kbd>
                                        </span>
                                        <div className="font-bold text-lg text-slate-300 group-hover:text-white transition-colors">
                                            {tField(prevChapter.title, locale)}
                                        </div>
                                    </div>
                                </Link>
                            ) : (<div></div>)}

                            {/* קדימה */}
                            {nextChapter ? (
                                (() => {
                                    const nextColor = extractColorName(nextChapter.colorFrom);
                                    return (
                                        <Link href={nextChapter.href || "#"} className={`group relative overflow-hidden rounded-2xl border border-${nextColor}-500/30 bg-${nextColor}-900/10 p-6 transition-all hover:bg-${nextColor}-900/20 hover:border-${nextColor}-500/50 text-start`}>
                                            <div className={`absolute inset-0 bg-linear-to-r from-transparent via-${nextColor}-500/5 to-${nextColor}-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                            
                                            <div className={`flex flex-col ${isRTL ? 'items-start' : 'items-end'} gap-2 relative z-10`}>
                                                <span className={`text-xs font-mono font-bold text-${nextColor}-400 group-hover:text-${nextColor}-300 transition-colors flex items-center gap-2`}>
                                                    {!isRTL ? <ChevronLeft size={14} /> : null}
                                                    {formatNextChapterLabel(locale, nextChapter.id)}
                                                    {isRTL ? <ChevronLeft size={14} /> : null}
                                                    <kbd className={`rounded border border-${nextColor}-500/40 bg-${nextColor}-900/20 px-1.5 py-0.5 text-[10px] leading-none text-${nextColor}-300`}>{isRTL ? '←' : '→'}</kbd>
                                                </span>
                                                <div className={`font-bold text-xl text-white group-hover:scale-[1.02] transition-transform ${isRTL ? 'origin-right' : 'origin-left'}`}>
                                                    {tField(nextChapter.title, locale)}
                                                </div>
                                                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                                                    <BookOpen size={12} />
                                                    {formatReadTime(locale, parseReadTimeMinutes(nextChapter.readTime))}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })()
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