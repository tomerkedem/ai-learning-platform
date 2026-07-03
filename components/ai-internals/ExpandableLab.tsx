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

import React, { useEffect, useState } from 'react';
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

export const ExpandableLab: React.FC<ExpandableLabProps> = ({ children, title }) => {
    const { t, dir } = useT();
    const z = t.behindAi.aiInternals.labZoom;
    const [expanded, setExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);

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
        <div dir={dir}>
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
                                <ExpandableLabContext.Provider value={true}>{children}</ExpandableLabContext.Provider>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </div>
    );
};
