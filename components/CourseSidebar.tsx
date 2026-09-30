"use client";

import React, { useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Circle, PlayCircle, Menu, X, ArrowRight, ArrowLeft, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { courses } from "@/lib/courseData";
import { SidebarMastery } from "@/app/(course)/behind-the-scenes-ai/MasteryDashboard";
import { AccountPanel } from "@/app/(course)/behind-the-scenes-ai/AccountPanel";
import { useCourseAccess } from "@/app/(course)/behind-the-scenes-ai/_access/CourseAccessContext";
import { coursePathLevel, meetsAccessLevel } from "@/app/(course)/behind-the-scenes-ai/_access/access";
import { INFO_PAGES } from "@/app/(course)/behind-the-scenes-ai/_info/infoRoutes";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DisplaySettings } from "@/components/DisplaySettings";
import { LanguageGlobe } from "@/components/language/LanguageGlobe";
import { useT } from "@/i18n/useT";
import { tField } from "@/lib/localize";
import { formatChapterLabel } from "@/i18n/format";

export function CourseSidebar({ isFocusMode = false }: { isFocusMode?: boolean }) {
  const pathname = usePathname();
  const { locale, dir, t } = useT();
  // תצוגה בלבד: מצב הגישה שהשרת חישב. האכיפה בשרת, בכל עמוד מוגן.
  const access = useCourseAccess();
  const [isOpen, setIsOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // סגירת מגירת המובייל: מחזירה את הפוקוס לכפתור התפריט (Esc, כפתור X ושכבת הרקע).
  const closeMenu = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  // מגירה פתוחה: הפוקוס נכנס אליה, Tab / Shift+Tab נשארים בתוכה, ו-Esc סוגר.
  useEffect(() => {
    if (!isOpen) return;
    const focusables = () =>
      Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])') ?? [],
      ).filter((el) => el.getClientRects().length > 0);
    focusables()[0]?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      // חלון <dialog> מודאלי שנפתח מתוך המגירה (שפה, נגישות ותצוגה) מנהל בעצמו Escape ו-Tab.
      if (document.querySelector('dialog[open]')) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !drawerRef.current?.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeMenu]);

  // פתרון הריצוד: שימוש ב-useLayoutEffect לביצוע הגלילה לפני הציור על המסך
  // פתרון שגיאת ה-Lint: אנחנו מוותרים על ה-isReady state ומשתמשים במיקום ה-Scroll בלבד
  useLayoutEffect(() => {
    try {
      const savedScrollPos = sessionStorage.getItem('sidebar-scroll-pos');
      if (savedScrollPos && scrollContainerRef.current) {
        const pos = parseInt(savedScrollPos, 10);
        if (Number.isFinite(pos)) scrollContainerRef.current.scrollTop = pos;
      }
    } catch {
      // אחסון חסום: מתחילים מראש הרשימה.
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    try {
      sessionStorage.setItem('sidebar-scroll-pos', target.scrollTop.toString());
    } catch {
      // אחסון חסום או מלא: מיקום הגלילה פשוט לא נשמר.
    }
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

  // שם הלומדה בסרגל הוא ניווט/chrome. בלומדות עם hero משלהן (behind-the-scenes-ai) אסור
  // שיהיה h1, אחרת נוצר h1 שני לצד ה-hero. בלומדות אחרות (math) אין hero, ולכן הוא נשאר
  // הכותרת הראשית של המסמך.
  const SidebarTitleTag = currentCourseId === 'behind-the-scenes-ai' ? 'p' : 'h1';

  const sidebarContent = (
      <div className="flex flex-col h-full bg-[var(--bts-surface-elevated)]">
          {/* Header */}
          <div className="px-3 pt-2 pb-2 border-b border-[var(--bts-border)] shrink-0">
            <div className="flex items-center gap-1">
                {/* חזרה לקטלוג: קישור-אייקון, השם הנגיש מגיע מהמחרוזת המתורגמת */}
                <Link
                    href="/"
                    aria-label={t.chrome.backToCatalog}
                    title={t.chrome.backToCatalog}
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-[var(--bts-text-muted)] hover:text-[var(--bts-text-primary)] hover:bg-[var(--bts-surface)] transition-colors"
                >
                    {dir === 'rtl' ? <ArrowRight size={16} aria-hidden /> : <ArrowLeft size={16} aria-hidden />}
                </Link>
                <SidebarTitleTag className="min-w-0 flex-1 font-bold text-[var(--bts-text-primary)] text-base truncate leading-tight">
                    {tField(course.title, locale)}
                </SidebarTitleTag>

                {isOpen && (
                    <button
                        onClick={closeMenu}
                        aria-label={t.chrome.nav.closeMenu}
                        className="shrink-0 p-1 rounded-full text-[var(--bts-text-muted)] hover:text-[var(--bts-text-primary)] md:hidden"
                    >
                        <X size={24} />
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            <div className="mt-1.5 px-1 flex items-center gap-2 text-[11px] text-[var(--bts-text-muted)] font-mono">
                <span className="shrink-0">{t.chrome.courseProgress}</span>
                <div aria-hidden className="h-1 flex-1 bg-[var(--bts-surface-inset)] rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-700 ease-out ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.max(2, progress)}%` }}
                    />
                </div>
                <span className={`shrink-0 ${progress === 100 ? 'text-[var(--bts-status-positive)]' : ''}`}>{progress}%</span>
            </div>

            {/* סיכום שליטה במבדקים - מוצג רק בלומדת "מאחורי הקלעים של AI" ורק כשיש נתונים */}
            {currentCourseId === 'behind-the-scenes-ai' && <SidebarMastery />}
            {currentCourseId === 'behind-the-scenes-ai' && <AccountPanel />}
          </div>

          {/* Navigation List */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-0.5"
          >
              <div className="text-[10px] font-bold text-[var(--bts-text-muted)] mb-2 px-2 uppercase tracking-widest mt-2">
                  {t.chrome.tableOfContents}
              </div>
              
              {course.chapters.map((chapter) => {
                  const isActive = pathname === chapter.href;
                  const activeTextColor = chapter.labelColor || "text-blue-400";
                  const Icon = isActive ? PlayCircle : Circle;
                  const level = currentCourseId === 'behind-the-scenes-ai' ? coursePathLevel(chapter.href) : null;
                  const locked = !!level && !meetsAccessLevel(access.status, level);

                  return (
                    <Link 
                        key={chapter.id} 
                        href={chapter.href || "#"}
                        onClick={() => setIsOpen(false)}
                        title={locked ? (level === 'learner' ? t.chrome.access.lockedHintLearner : t.chrome.access.lockedHint) : undefined}
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
                            {locked && (
                                <span className="ms-auto shrink-0 flex items-center text-[var(--bts-text-faint)]">
                                    <Lock size={13} aria-hidden />
                                    <span className="sr-only">{t.chrome.access.lockedLabel}</span>
                                </span>
                            )}
                        </div>
                    </Link>
                  );
              })}

              {/* דפי המידע של הלומדה: בסוף הרשימה, כך שהם זמינים גם במגירת המובייל. */}
              {currentCourseId === 'behind-the-scenes-ai' && (
                  <nav aria-label={t.behindAi.infoPages.navLabel} className="mt-4 border-t border-[var(--bts-border)] pt-4">
                      <p aria-hidden className="text-[10px] font-bold text-[var(--bts-text-muted)] mb-2 px-2 uppercase tracking-widest">
                          {t.behindAi.infoPages.navLabel}
                      </p>
                      <ul className="space-y-0.5">
                          {INFO_PAGES.map(({ key, href, Icon }) => {
                              const isActive = pathname === href;
                              return (
                                  <li key={key}>
                                      <Link
                                          href={href}
                                          onClick={() => setIsOpen(false)}
                                          aria-current={isActive ? 'page' : undefined}
                                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${isActive
                                              ? 'bg-[var(--bts-surface-inset)] text-[var(--bts-text-primary)] border border-[var(--bts-border-emphasis)]'
                                              : 'text-[var(--bts-text-muted)] hover:bg-[var(--bts-surface)] hover:text-[var(--bts-text-secondary)] border border-transparent'}`}
                                      >
                                          <Icon size={14} aria-hidden className={`shrink-0 ${isActive ? 'text-[var(--bts-brand-primary-strong)]' : ''}`} />
                                          <span className="leading-tight">{t.behindAi.infoPages.pages[key].navTitle}</span>
                                      </Link>
                                  </li>
                              );
                          })}
                      </ul>
                  </nav>
              )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--bts-border)] bg-[var(--bts-surface-inset)] text-[10px] text-[var(--bts-text-muted)] text-center shrink-0">
              {/* בורר ערכת-נושא: פקד-שירות שקט, לא תכונת-מוצר בולטת. גלובלי (חל על כל
                  הלומדות), אבל רק המבוא הצטרף בפועל לערכות - שאר הלומדה נשארת Dark. */}
              {/* בורר השפה רק בלומדה מאחורי הקלעים של AI: רק היא פותרת שפה בשרת. */}
              <div className="mb-3 flex items-center justify-center gap-3">
                  <ThemeToggle />
                  <DisplaySettings />
                  {pathname?.startsWith('/behind-the-scenes-ai') && <LanguageGlobe />}
              </div>
              <p className="text-xs">{t.chrome.byAuthor}</p>
          </div>
      </div>
  );

  return (
      <>
          <button
              ref={triggerRef}
              onClick={() => setIsOpen(true)}
              aria-label={t.chrome.nav.menu}
              aria-expanded={isOpen}
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
                          onClick={closeMenu}
                          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-90 md:hidden"
                      />
                      
                      <motion.div
                          ref={drawerRef}
                          role="dialog"
                          aria-modal="true"
                          aria-label={t.chrome.nav.menu}
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