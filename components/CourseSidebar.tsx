"use client";

import React, { useState, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Circle, PlayCircle, Menu, X, Terminal, Sigma, BrainCircuit, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { courses } from "@/lib/courseData";
import { SidebarMastery } from "@/app/behind-the-scenes-ai/MasteryDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useT } from "@/i18n/useT";
import { tField } from "@/lib/localize";
import { formatChapterLabel } from "@/i18n/format";

export function CourseSidebar({ isFocusMode = false }: { isFocusMode?: boolean }) {
  const pathname = usePathname();
  const { locale, dir, t } = useT();
  const [isOpen, setIsOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // פתרון הריצוד: שימוש ב-useLayoutEffect לביצוע הגלילה לפני הציור על המסך
  // פתרון שגיאת ה-Lint: אנחנו מוותרים על ה-isReady state ומשתמשים במיקום ה-Scroll בלבד
  useLayoutEffect(() => {
    const savedScrollPos = sessionStorage.getItem('sidebar-scroll-pos');
    if (savedScrollPos && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = parseInt(savedScrollPos, 10);
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    sessionStorage.setItem('sidebar-scroll-pos', target.scrollTop.toString());
  };

  // הלוגיקה החדשה והחכמה יותר:
const segments = pathname?.split('/').filter(Boolean) || [];

// אם החלק הראשון הוא 'math', ניקח את החלק השני כ-ID של הלומדה
// אחרת, ניקח את החלק הראשון (עבור לומדות כמו 'python')
let courseIdFromPath = segments[0];

if (segments[0] === 'math' && segments[1]) {
  courseIdFromPath = segments[1];
}

const currentCourseId = courses[courseIdFromPath] ? courseIdFromPath : 'mathIntuitive';
  
  const course = courses[currentCourseId];
  if (!course) return null;

  // חישוב התקדמות - בשימוש בתוך ה-UI
  const currentChapterIndex = course.chapters.findIndex(c => c.href === pathname);
  const safeIndex = currentChapterIndex === -1 ? 0 : currentChapterIndex;
  const progress = Math.round(((safeIndex + 1) / course.chapters.length) * 100);

  // ראשי-התיבות של מחבר הלומדה, נגזרים מהשם המתורגם (chrome.authorName). כך הם
  // תלויי-שפה: he 'תומר קדם' => 'תק', en 'Tomer Kedem' => 'TK'. לא נדרש מפתח חדש.
  const authorInitials = t.chrome.authorName.split(/[\s・]+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2);

  const getCourseIcon = () => {
      switch(currentCourseId) {
          case 'python': return <Terminal size={20} />;
          case 'probability': return <BrainCircuit size={20} />;
          default: return <Sigma size={20} />; 
      }
  };

  const getCourseColor = () => {
      switch(currentCourseId) {
          case 'python': return 'text-yellow-400';
          case 'probability': return 'text-pink-400';
          default: return 'text-sky-400';
      }
  };

  // שם הלומדה בסרגל הוא ניווט/chrome. בלומדות עם hero משלהן (behind-the-scenes-ai) אסור
  // שיהיה h1, אחרת נוצר h1 שני לצד ה-hero. בלומדות אחרות (math) אין hero, ולכן הוא נשאר
  // הכותרת הראשית של המסמך.
  const SidebarTitleTag = currentCourseId === 'behind-the-scenes-ai' ? 'p' : 'h1';

  const sidebarContent = (
      <div className="flex flex-col h-full bg-[var(--bts-surface-elevated)]">
          {/* Header */}
          <div className="p-6 border-b border-[var(--bts-border)] shrink-0">
            <Link
                href="/"
                className="flex items-center gap-2 text-xs font-medium text-[var(--bts-text-muted)] hover:text-indigo-400 transition-colors mb-6 group"
            >
                {dir === 'rtl'
                    ? <ArrowRight size={14} className="group-hover:-translate-x-1 transition-transform" />
                    : <ArrowLeft size={14} className="group-hover:translate-x-1 transition-transform" />}
                <span>{t.chrome.backToCatalog}</span>
            </Link>

            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--bts-surface-inset)] flex items-center justify-center text-[var(--bts-text-primary)] font-bold shadow-lg shadow-black/20 border border-[var(--bts-border-emphasis)]">
                    <span className={getCourseColor()}>{getCourseIcon()}</span>
                </div>
                <div className="flex flex-col min-w-0">
                    <SidebarTitleTag className="font-bold text-[var(--bts-text-primary)] text-base truncate leading-tight">
                        {tField(course.title, locale)}
                    </SidebarTitleTag>
                    <span className="text-[var(--bts-text-muted)] text-[10px] mt-0.5 truncate">
                        {tField(course.description, locale)}
                    </span>
                </div>

                {isOpen && (
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded-full text-[var(--bts-text-muted)] hover:text-[var(--bts-text-primary)] ms-auto md:hidden"
                    >
                        <X size={24} />
                    </button>
                )}
            </div>

            {/* User Card */}
            <div className="flex items-center bg-[var(--bts-surface)] rounded-2xl p-3 gap-3 w-full shadow-lg border border-[var(--bts-border)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-blue-400">
                        {authorInitials}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[var(--bts-surface)] rounded-full"></div>
                </div>

                <div className="flex flex-col text-start min-w-0 relative z-10">
                    <span className="text-[var(--bts-text-primary)] font-bold text-md leading-tight">{t.chrome.authorName}</span>
                    <span className="text-[var(--bts-text-muted)] text-[12px]">{t.chrome.authorRole}</span>
                    <span className="text-[var(--bts-brand-secondary)] text-[14px] mt-0.5 font-medium">AI Developer Series</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-5">
                <div className="flex justify-between text-[10px] text-[var(--bts-text-muted)] mb-1.5 font-mono">
                    <span>{t.chrome.courseProgress}</span>
                    <span className={progress === 100 ? 'text-[var(--bts-status-positive)]' : ''}>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--bts-surface-inset)] rounded-full overflow-hidden border border-[var(--bts-border)]">
                    <div
                        className={`h-full transition-all duration-700 ease-out ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.max(2, progress)}%` }}
                    />
                </div>
            </div>

            {/* סיכום שליטה במבדקים - מוצג רק בלומדת "מאחורי הקלעים של AI" ורק כשיש נתונים */}
            {currentCourseId === 'behind-the-scenes-ai' && <SidebarMastery />}
          </div>

          {/* Navigation List */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-0.5"
          >
              <div className="text-[10px] font-bold text-[var(--bts-text-muted)] mb-2 px-2 uppercase tracking-widest opacity-70 mt-2">
                  {t.chrome.tableOfContents}
              </div>
              
              {course.chapters.map((chapter) => {
                  const isActive = pathname === chapter.href;
                  const activeTextColor = chapter.labelColor || "text-blue-400";
                  const Icon = isActive ? PlayCircle : Circle;

                  return (
                    <Link 
                        key={chapter.id} 
                        href={chapter.href || "#"}
                        onClick={() => setIsOpen(false)}
                    >
                        <div className={`
                            relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group mb-1
                            ${isActive
                                ? 'bg-[var(--bts-surface-inset)] text-[var(--bts-text-primary)] shadow-md shadow-black/10 border border-[var(--bts-border-emphasis)]'
                                : 'text-[var(--bts-text-muted)] hover:bg-[var(--bts-surface)] hover:text-[var(--bts-text-secondary)] border border-transparent'
                            }
                        `}>
                            {isActive && (
                                <div className={`absolute start-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-e-full bg-current ${activeTextColor} opacity-80`}></div>
                            )}

                            <Icon
                                size={isActive ? 18 : 14}
                                className={`shrink-0 transition-colors ${isActive ? activeTextColor : "text-[var(--bts-text-muted)] group-hover:text-[var(--bts-text-secondary)]"}`}
                            />

                            <div className="flex flex-col min-w-0">
                                <span className={`text-[10px] font-mono leading-none mb-0.5 opacity-80 ${isActive ? activeTextColor : ''}`}>
                                    {chapter.id === 0 ? t.chrome.intro : formatChapterLabel(locale, chapter.id)}
                                </span>
                                <span className={`line-clamp-2 leading-tight font-medium ${isActive ? 'text-[var(--bts-text-primary)]' : ''}`}>
                                    {tField(chapter.title, locale)}
                                </span>
                            </div>
                        </div>
                    </Link>
                  );
              })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--bts-border)] bg-[var(--bts-surface-inset)] text-[10px] text-[var(--bts-text-muted)] text-center shrink-0">
              {/* בורר ערכת-נושא: פקד-שירות שקט, לא תכונת-מוצר בולטת. גלובלי (חל על כל
                  הלומדות), אבל רק המבוא הצטרף בפועל לערכות - שאר הלומדה נשארת Dark. */}
              <div className="mb-3 flex justify-center">
                  <ThemeToggle />
              </div>
              <div className="flex justify-center items-center gap-2">
                  <span>v4.6</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--bts-border-emphasis)]"></span>
                  <span>AI Math Primer</span>
              </div>
          </div>
      </div>
  );

  return (
      <>
          <button
              onClick={() => setIsOpen(true)}
              className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-[var(--bts-surface-elevated)] text-[var(--bts-text-primary)] shadow-lg backdrop-blur-md border border-[var(--bts-border-emphasis)] md:hidden hover:scale-105 transition-transform"
          >
              <Menu size={20} />
          </button>

          {/* סרגל דסקטופ - מתקפל בתנועת spring חלקה במצב מיקוד, התוכן מתרחב לתוך המקום שהתפנה */}
          <motion.aside
              initial={false}
              animate={{ width: isFocusMode ? 0 : 320 }}
              transition={{ type: 'spring', stiffness: 300, damping: 34, mass: 0.9 }}
              className="hidden md:flex bg-[var(--bts-surface-elevated)] border-e border-[var(--bts-border)] flex-col h-screen shrink-0 sticky top-0 shadow-2xl z-30 overflow-hidden"
              dir={dir}
          >
              <motion.div
                  animate={{ opacity: isFocusMode ? 0 : 1, x: isFocusMode ? 28 : 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="w-80 shrink-0 h-full"
              >
                  {sidebarContent}
              </motion.div>
          </motion.aside>

          <AnimatePresence>
              {isOpen && (
                  <>
                      <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.6 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => setIsOpen(false)}
                          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-90 md:hidden"
                      />
                      
                      <motion.div
                          initial={{ x: '100%' }}
                          animate={{ x: 0 }}
                          exit={{ x: '100%' }}
                          transition={{ type: "spring", damping: 25, stiffness: 200 }}
                          className="fixed top-0 right-0 h-full w-[85%] max-w-xs z-100 border-l border-[var(--bts-border-emphasis)] shadow-2xl md:hidden bg-[var(--bts-surface-elevated)]"
                          dir={dir}
                      >
                          {sidebarContent}
                      </motion.div>
                  </>
              )}
          </AnimatePresence>
      </>
  );
}