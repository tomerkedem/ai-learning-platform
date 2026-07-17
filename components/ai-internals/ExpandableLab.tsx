"use client";

// ExpandableLab - עוטף כל מעבדה ומאפשר להגדיל אותה למסך מלא ולחזור לתצוגה בתוך הפרק.
// ──────────────────────────────────────────────────────────────────────────
// מטרה: להקל על הלומד (בלי לאמץ עיניים). כפתור "מסך מלא" יושב בשורה קטנה מעל המעבדה,
// כדי שלעולם לא ידרוס טקסט. מצב מסך מלא מוצג דרך Portal אל document.body, כדי לצאת
// מכל stacking context של הורה (סקשנים עם transform, סרגל הצד של הפרק וכו') ולכסות
// באמת את כל המסך. ESC לסגירה + נעילת גלילת רקע.
//
// הערה: מעבר למסך מלא טוען מחדש את המעבדה (Portal), ולכן היא חוזרת למצב ההתחלתי.
// זה מקובל עבור "להגדיל כדי לראות טוב יותר". נגיש (aria), תואם RTL/LTR, בלי מקף ארוך.

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Minimize2 } from 'lucide-react';

import { useT } from '@/i18n/useT';

// אלמנטים שאפשר למקד עליהם. משמש למלכודת הפוקוס במסך מלא.
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ExpandableLabProps {
    children: React.ReactNode;
    /** כותרת קצרה שתוצג בסרגל העליון במצב מסך מלא (אופציונלי). */
    title?: string;
}

// מאפשר לילדים לדעת אם הם מוצגים כרגע במסך מלא, כדי לסדר את הפריסה אחרת (רוחב,
// מספר עמודות, גדלים). ברירת מחדל false (תצוגה רגילה). ילדים שלא צורכים - מתעלמים.
export const ExpandableLabContext = React.createContext(false);

// מאפשר לילד במסך מלא לסגור את התצוגה המוגדלת ולחזור לתוכן הפרק (למשל קישור "חזרה לפרק"
// במסך תוצאות המבדק). null בתצוגה רגילה, ואז הילד שומר על התנהגותו הרגילה. נפרד מ-
// ExpandableLabContext כדי לא לשנות את הצורה הבוליאנית שכבר נצרכת ברכיבים אחרים.
export const ExpandableLabExitContext = React.createContext<(() => void) | null>(null);

// מיכל הגלילה האמיתי של הפרק: ChapterLayout גולל במיכל פנימי (overflow-y-auto), לא ב-window.
const findScroller = (from: HTMLElement | null): HTMLElement | null => {
    let node = from;
    while (node) {
        const oy = getComputedStyle(node).overflowY;
        if ((oy === 'auto' || oy === 'scroll') && node.scrollHeight > node.clientHeight) return node;
        node = node.parentElement;
    }
    return null;
};

export const ExpandableLab: React.FC<ExpandableLabProps> = ({ children, title }) => {
    const { t, dir } = useT();
    const z = t.behindAi.aiInternals.labZoom;
    const [expanded, setExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);
    // העוגן במקום המקורי בעמוד. נשאר מרונדר גם במסך מלא, ולכן ממנו אפשר לאתר את מיכל
    // הגלילה של הפרק (מתוך ה-Portal אי אפשר: הוא תלוי ישירות מ-document.body).
    const rootRef = useRef<HTMLDivElement>(null);
    // מסך מלא הוא דיאלוג מודאלי: הפוקוס נכנס אליו, נלכד בתוכו, וחוזר לכפתור שפתח אותו.
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);
    const openerRef = useRef<HTMLButtonElement>(null);
    const titleId = useId();

    // יציאה ממסך מלא + גלילה לראש הפרק. שקול ללחיצה על "חזרה לפרק" ואז לחיצה על הקישור
    // בתצוגה הרגילה. הגלילה נדחית בפריים אחד, אחרי שה-Portal נסגר והמעבדה חזרה להירנדר
    // בתוך העמוד, כדי שהיא תפעל על מיכל הגלילה של הפרק ולא על המיכל שבתוך ה-Portal.
    const exitToChapter = useCallback(() => {
        setExpanded(false);
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
        const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
        const scroller = findScroller(rootRef.current?.parentElement ?? null);
        requestAnimationFrame(() => {
            if (scroller) scroller.scrollTo({ top: 0, behavior });
            else window.scrollTo({ top: 0, behavior });
        });
    }, []);

    // Portal זמין רק בצד הלקוח (document.body לא קיים ב-SSR).
    useEffect(() => setMounted(true), []);

    // מסך מלא: ESC לסגירה, מלכודת פוקוס (Tab מסתובב בתוך הדיאלוג בלבד), נעילת גלילת הרקע,
    // והחזרת הפוקוס לכפתור שפתח. מתנקה ביציאה או בסגירה.
    useEffect(() => {
        if (!expanded) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setExpanded(false);
                return;
            }
            if (e.key !== 'Tab') return;

            // מלכודת פוקוס: בלעדיה Tab בורח אל התוכן שמאחורי ה-overlay, שמוסתר חזותית.
            const dialog = dialogRef.current;
            if (!dialog) return;
            const items = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
                (el) => el.offsetParent !== null || getComputedStyle(el).position === 'fixed',
            );
            if (items.length === 0) return;

            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement;

            if (e.shiftKey && (active === first || !dialog.contains(active))) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        // הפוקוס נכנס לדיאלוג. כפתור החזרה הוא דרך היציאה, ולכן הוא נקודת הכניסה הטבעית.
        const opener = openerRef.current;
        closeBtnRef.current?.focus();

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
            // חזרה לכפתור שפתח, כדי שלומד מקלדת לא יאבד את מקומו בפרק.
            opener?.focus();
        };
    }, [expanded]);

    // כפתור ההגדלה (compact) הוא אייקון-בלבד עם tooltip מקורי, לעיצוב נקי מעל המעבדה.
    // כפתור החזרה (במסך מלא) נשאר עם כיתוב "חזרה לפרק" - זו דרך היציאה של הלומד וכדאי
    // שתישאר מפורשת. שניהם שומרים aria-label לנגישות.
    // compact = כפתור ההגדלה שיושב בעמוד. אחרת = כפתור החזרה שבתוך מסך מלא.
    // שניהם יעד מגע מלא (44px) וכיתוב קריא, כמו בשאר פקדי הלומדה.
    const button = (compact: boolean) => (
        <button
            type="button"
            ref={compact ? openerRef : closeBtnRef}
            onClick={() => setExpanded((v) => !v)}
            aria-label={compact ? z.expandAria : z.collapseAria}
            title={compact ? z.expand : undefined}
            aria-expanded={expanded}
            className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-slate-600/60 bg-slate-900/85 ${compact ? 'min-w-[44px] px-2' : 'px-3'} text-sm font-bold text-slate-200 backdrop-blur transition-colors hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60`}
        >
            {compact ? <Maximize2 size={16} /> : <Minimize2 size={14} />}
            {!compact && z.collapse}
        </button>
    );

    return (
        <div dir={dir} ref={rootRef}>
            {/* שורה קטנה מעל המעבדה עם כפתור ההגדלה, מיושרת לקצה, בלי לדרוס תוכן.
                max-md:me-5 - מסילת-הקצה הצפה (EdgeRail) יושבת בקצה החלון וממורכזת אנכית,
                וגם במנוחה היא מבצבצת עד x=44 (left-2) או x=48 (sm:left-3). מתחת ל-md עמודת
                התוכן מתחילה ב-32px בלבד (main px-8), ולכן כפתור ההגדלה, שמיושר לקצה, נחתך
                תחתיה. מרווח לוגי בקצה ההתחלה מזיז אותו פנימה מעבר למסילה בשני הכיוונים.
                מ-md ומעלה main הוא px-12 (48px), רחב מהמסילה, ולכן המרווח מיותר ומבוטל. */}
            <div className="mb-2 flex justify-end max-md:me-5">{button(true)}</div>
            {!expanded && <ExpandableLabContext.Provider value={false}>{children}</ExpandableLabContext.Provider>}

            {/* מסך מלא: Portal אל body, מעל הכל */}
            {expanded && mounted &&
                createPortal(
                    <div
                        dir={dir}
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? titleId : undefined}
                        aria-label={title ? undefined : z.expandAria}
                        className="fixed inset-0 z-[9999] flex flex-col bg-slate-950/96 backdrop-blur-sm"
                    >
                        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-800/70 px-3 py-2.5 sm:px-5">
                            <span id={titleId} className="truncate text-sm font-bold text-slate-200">{title}</span>
                            {button(false)}
                        </div>
                        {/* overscroll-contain: גלילה בקצה המעבדה לא נשפכת לעמוד שמאחורי ה-overlay */}
                        <div className="min-h-0 flex-1 overflow-auto overscroll-contain p-3 sm:p-5">
                            <div className="mx-auto max-w-6xl">
                                <ExpandableLabContext.Provider value={true}>
                                    <ExpandableLabExitContext.Provider value={exitToChapter}>
                                        {children}
                                    </ExpandableLabExitContext.Provider>
                                </ExpandableLabContext.Provider>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </div>
    );
};
