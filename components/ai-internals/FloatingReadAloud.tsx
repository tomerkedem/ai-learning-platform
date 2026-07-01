"use client";

// components/ai-internals/FloatingReadAloud.tsx
//
// עוטף צף לדוק ההאזנה המודרכת: מצמיד אותו לקצה החיצוני של החלון (תלוי-כיוון) כך
// שהוא "צף תמיד" ונשאר נגיש תוך כדי גלילה, בלי לשבת על כרטיס ההירו. הדוק עצמו
// (ReadAloudControls) מצויר כ-children: כשהוא סגור הוא צ'יפ קטן, ובלחיצה הוא נפתח
// לפאנל המלא במקום.
//
// מצב "הצצה" (peek): במנוחה הדוק מוחלק אל הקצה כך שרק האוזניה מבצבצת, ומרחיב
// בהחלקה זורמת ב-hover / focus / כשהוא "נעוץ" (הקראה פעילה או מגירה פתוחה).
// כיוון ההחלקה נגזר מ-dir (RTL אל שמאל, LTR אל ימין), בטוח ב-i18n. ההצצה פעילה
// רק במכשירי hover עדינים (דסקטופ) וכשאין reduced-motion; במגע ובתנועה מופחתת
// הדוק נשאר כמות שהוא (הצ'יפ הקומפקטי הקיים).
//
// ממומש דרך portal ל-document.body כדי ש-position: fixed יתייחס לחלון התצוגה ולא
// יושפע מ-transform של אבות מונפשים (framer-motion על ההירו יוצר containing block).
// מרונדר רק אחרי mount (בטוח ל-SSR/hydration); הדוק הוא שכבת-שיפור, לא נדרש ב-SSR.

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import type { Direction } from '@/i18n/config';

// Context שדרכו הדוק הפנימי מדווח אם הוא "נעוץ" (הקראה פעילה או מגירה פתוחה),
// כדי שה-wrapper לא יכווץ אותו בזמן שימוש. ברירת המחדל היא no-op, כך שהדוק נשאר
// מנותק ועובד גם מחוץ ל-FloatingReadAloud.
const ReadAloudPinContext = createContext<(pinned: boolean) => void>(() => {});

/** הדוק הפנימי קורא לזה כדי לבקש שה-wrapper יישאר פתוח כל עוד pinned=true. */
export function useReadAloudPin(pinned: boolean) {
    const setPinned = useContext(ReadAloudPinContext);
    useEffect(() => {
        setPinned(pinned);
        return () => setPinned(false);
    }, [pinned, setPinned]);
}

interface FloatingReadAloudProps {
    dir: Direction;
    children: React.ReactNode;
}

export function FloatingReadAloud({ dir, children }: FloatingReadAloudProps) {
    const [mounted, setMounted] = useState(false);
    // הצצה פעילה רק בדסקטופ (hover עדין) וללא reduced-motion.
    const [peekEnabled, setPeekEnabled] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focusWithin, setFocusWithin] = useState(false);
    const [pinned, setPinned] = useState(false);
    const leaveTimer = useRef<number | null>(null);

    // setState ב-setTimeout (לא סינכרוני בגוף ה-effect) לכבוד ה-lint, כמו בשאר הפרויקט.
    useEffect(() => {
        const id = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(id);
    }, []);

    // יכולת הצצה: hover עדין + ללא העדפת תנועה מופחתת. מאזין לשינויים (רספונסיבי).
    useEffect(() => {
        const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)');
        const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setPeekEnabled(hoverMq.matches && !motionMq.matches);
        update();
        hoverMq.addEventListener('change', update);
        motionMq.addEventListener('change', update);
        return () => {
            hoverMq.removeEventListener('change', update);
            motionMq.removeEventListener('change', update);
        };
    }, []);

    // גלילה = "הלומד קורא, זוז הצידה": מכווץ בחזרה (אלא אם נעוץ / focus שומרים פתוח).
    useEffect(() => {
        if (!peekEnabled) return;
        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                setHovered(false);
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [peekEnabled]);

    // ניקוי טיימר עיכוב-היציאה בעת פירוק.
    useEffect(() => () => {
        if (leaveTimer.current) clearTimeout(leaveTimer.current);
    }, []);

    if (!mounted) return null;

    const isRtl = dir === 'rtl';
    const expanded = !peekEnabled || hovered || focusWithin || pinned;
    const collapsed = peekEnabled && !expanded;

    // במנוחה: מחליק אל הקצה הקרוב ומשאיר ~2.25rem מבצבצים - רק האוזניה, ללא כיתוב.
    // תלוי-כיוון ובלתי-תלוי-שפה (האוזניה תמיד בצד הפונה למרכז).
    const transform = collapsed
        ? isRtl
            ? 'translateX(calc(-100% + 2.25rem))'
            : 'translateX(calc(100% - 2.25rem))'
        : 'translateX(0)';

    const onEnter = () => {
        if (leaveTimer.current) {
            clearTimeout(leaveTimer.current);
            leaveTimer.current = null;
        }
        setHovered(true);
    };
    // עיכוב קצר ביציאה כדי שהדוק לא יקפוץ תוך כדי תנועת עכבר סמוכה.
    const onLeave = () => {
        if (leaveTimer.current) clearTimeout(leaveTimer.current);
        leaveTimer.current = window.setTimeout(() => setHovered(false), 400);
    };

    return createPortal(
        <ReadAloudPinContext.Provider value={setPinned}>
            <div
                // RTL: צמוד לשמאל (הצד הנגדי למנטור שצף מימין); LTR: צמוד לימין. ממורכז אנכית,
                // z מתחת ל-FAB הניווט (z-50) ומעל התוכן. pointer-events-none כדי שלא יחסום
                // קליקים מסביב לדוק, והדוק עצמו מחזיר pointer-events.
                className={`fixed top-1/2 z-40 -translate-y-1/2 ${isRtl ? 'left-2 sm:left-3' : 'right-2 sm:right-3'} pointer-events-none`}
            >
                <div
                    onPointerEnter={onEnter}
                    onPointerLeave={onLeave}
                    // שומר פתוח רק בפוקוס-מקלדת (:focus-visible). לחיצת עכבר משאירה פוקוס על
                    // כפתור אך לא נועלת פתוח, כך שאחרי שהעכבר עוזב הדוק גולש בחזרה.
                    onFocus={(e) => {
                        const t = e.target as HTMLElement;
                        if (typeof t.matches === 'function' && t.matches(':focus-visible')) setFocusWithin(true);
                    }}
                    onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
                    }}
                    style={{
                        transform,
                        opacity: collapsed ? 0.85 : 1,
                        transition: peekEnabled
                            ? 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease'
                            : undefined,
                        willChange: peekEnabled ? 'transform' : undefined,
                    }}
                    className="pointer-events-auto max-h-[80vh] max-w-[min(20rem,calc(100vw-1rem))] overflow-y-auto overscroll-contain"
                >
                    {children}
                </div>
            </div>
        </ReadAloudPinContext.Provider>,
        document.body,
    );
}
