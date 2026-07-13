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

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Minimize2 } from 'lucide-react';

import { useT } from '@/i18n/useT';

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

    // מסך מלא: ESC לסגירה + נעילת גלילת הרקע. מתנקה ביציאה או בסגירה.
    useEffect(() => {
        if (!expanded) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setExpanded(false);
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [expanded]);

    // כפתור ההגדלה (compact) הוא אייקון-בלבד עם tooltip מקורי, לעיצוב נקי מעל המעבדה.
    // כפתור החזרה (במסך מלא) נשאר עם כיתוב "חזרה לפרק" - זו דרך היציאה של הלומד וכדאי
    // שתישאר מפורשת. שניהם שומרים aria-label לנגישות.
    const button = (compact: boolean) => (
        <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-label={compact ? z.expandAria : z.collapseAria}
            title={compact ? z.expand : undefined}
            aria-expanded={!compact}
            className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-600/60 bg-slate-900/85 ${compact ? 'p-2' : 'px-2.5 py-1.5'} text-xs font-bold text-slate-200 backdrop-blur transition-colors hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60`}
        >
            {compact ? <Maximize2 size={16} /> : <Minimize2 size={14} />}
            {!compact && z.collapse}
        </button>
    );

    return (
        <div dir={dir} ref={rootRef}>
            {/* שורה קטנה מעל המעבדה עם כפתור ההגדלה, מיושרת לקצה, בלי לדרוס תוכן */}
            <div className="mb-2 flex justify-end">{button(true)}</div>
            {!expanded && <ExpandableLabContext.Provider value={false}>{children}</ExpandableLabContext.Provider>}

            {/* מסך מלא: Portal אל body, מעל הכל */}
            {expanded && mounted &&
                createPortal(
                    <div dir={dir} className="fixed inset-0 z-[9999] flex flex-col bg-slate-950/96 backdrop-blur-sm">
                        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-800/70 px-3 py-2.5 sm:px-5">
                            <span className="truncate text-sm font-bold text-slate-200">{title}</span>
                            {button(false)}
                        </div>
                        <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-5">
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
