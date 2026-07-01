"use client";

// components/ai-internals/EdgePeek.tsx
//
// פרימיטיבים למסילת-קצה צפה משותפת: כמה כפתורים צפים (דוק האזנה, מצב מיקוד) שיושבים
// בטור אנכי בקצה החלון, כל אחד "מציץ" כאייקון במנוחה ונפתח בהחלקה זורמת ב-hover.
//
// EdgeRail  - העמודה הצפה הממורכזת אנכית, תלוית-כיוון, עם slot ל-portal של הדוק (מעל)
//             ואז ה-children (כפתור המיקוד, מתחת).
// EdgePeekItem - מכונת ה-peek לפריט בודד: במנוחה מחליק אל הקצה ומשאיר רק את האייקון
//             (peekRem), נפתח ב-hover / פוקוס-מקלדת / כשהוא "נעוץ". ההצצה פעילה רק
//             במכשירי hover עדינים וללא reduced-motion; אחרת הפריט גלוי תמיד כמות שהוא.

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import type { Direction } from '@/i18n/config';

// useLayoutEffect בצד הלקוח (רץ לפני הצביעה), useEffect בשרת. כך הפריט נצמד לקצה עוד
// לפני ה-paint הראשון, ולא "יוצא ונכנס" בכל מעבר בין פרקים.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface EdgeRailProps {
    dir: Direction;
    children: React.ReactNode;
}

/**
 * מסילת-קצה צפה: עמודה אנכית ממורכזת בקצה החיצוני (RTL שמאל / LTR ימין). מכילה slot
 * (`#edge-dock-slot`) שאליו הדוק הצף מבצע portal כדי לשבת מעל שאר הפריטים, ואז את
 * ה-children. z מתחת ל-FAB הניווט (z-50). pointer-events-none על המסילה; כל פריט מחזיר.
 */
export function EdgeRail({ dir, children }: EdgeRailProps) {
    const isRtl = dir === 'rtl';
    return (
        <div
            // items-end = הקצה החיצוני הפיזי בשני הכיוונים (RTL: שמאל, LTR: ימין), כך שכל
            // פריט צמוד לקצה שהמסילה מעוגנת אליו וה-tuck מסתיר אותו כראוי גם כשהוא צר מהדוק.
            className={`fixed top-1/2 z-40 flex -translate-y-1/2 flex-col items-end gap-3 ${isRtl ? 'left-2 sm:left-3' : 'right-2 sm:right-3'} pointer-events-none`}
        >
            {/* יעד ה-portal לדוק ההאזנה (display:contents: תורם flex-item רק כשמלא, אחרת נעלם). */}
            <div id="edge-dock-slot" className="contents" />
            {children}
        </div>
    );
}

interface EdgePeekItemProps {
    dir: Direction;
    /** כשנעוץ (למשל הקראה פעילה / מגירה פתוחה) הפריט לא מתכווץ בחזרה. */
    pinned?: boolean;
    /** רוחב ההצצה במנוחה (rem) - בערך ריפוד+אייקון, מתחת לנקודה שבה הכיתוב מתחיל. */
    peekRem?: number;
    /** מחלקות נוספות לפריט (למשל max-w / overflow לדוק). */
    className?: string;
    children: React.ReactNode;
}

/**
 * פריט בודד במסילה עם התנהגות ה-peek. הטרנספורם (translateX) על העטיפה בלבד, כדי לא
 * להתנגש בטרנספורמים פנימיים (framer whileHover על כפתור פנימי).
 */
export function EdgePeekItem({ dir, pinned = false, peekRem = 2.25, className, children }: EdgePeekItemProps) {
    // הצצה פעילה רק בדסקטופ (hover עדין) וללא reduced-motion.
    const [peekEnabled, setPeekEnabled] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focusWithin, setFocusWithin] = useState(false);
    // מפעיל מעברים רק אחרי הצביעה הראשונה, כך שההיצמדות הראשונית לקצה מיידית (בלי החלקה).
    const [animateReady, setAnimateReady] = useState(false);
    const leaveTimer = useRef<number | null>(null);

    // זיהוי לפני paint (layout effect), כדי שהפריט יצויר מיד במצב הנכון בלי הבהוב.
    useIsoLayoutEffect(() => {
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

    // אחרי הפריים הראשון מפעילים מעברים, כך שרק אינטראקציית hover אמיתית מחליקה.
    useEffect(() => {
        const raf = requestAnimationFrame(() => setAnimateReady(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    // גלילה = "הלומד קורא, זוז הצידה": מכווץ בחזרה (אלא אם נעוץ / פוקוס-מקלדת שומרים פתוח).
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

    useEffect(() => () => {
        if (leaveTimer.current) clearTimeout(leaveTimer.current);
    }, []);

    const isRtl = dir === 'rtl';
    const expanded = !peekEnabled || hovered || focusWithin || pinned;
    const collapsed = peekEnabled && !expanded;

    // במנוחה: מחליק אל הקצה הקרוב ומשאיר ~peekRem מבצבצים (רק האייקון). תלוי-כיוון
    // ובלתי-תלוי-שפה (האייקון תמיד בצד הפונה למרכז).
    const transform = collapsed
        ? isRtl
            ? `translateX(calc(-100% + ${peekRem}rem))`
            : `translateX(calc(100% - ${peekRem}rem))`
        : 'translateX(0)';

    const onEnter = () => {
        if (leaveTimer.current) {
            clearTimeout(leaveTimer.current);
            leaveTimer.current = null;
        }
        setHovered(true);
    };
    // עיכוב קצר ביציאה כדי שהפריט לא יקפוץ תוך כדי תנועת עכבר סמוכה.
    const onLeave = () => {
        if (leaveTimer.current) clearTimeout(leaveTimer.current);
        leaveTimer.current = window.setTimeout(() => setHovered(false), 400);
    };

    return (
        <div
            onPointerEnter={onEnter}
            onPointerLeave={onLeave}
            // שומר פתוח רק בפוקוס-מקלדת (:focus-visible). לחיצת עכבר משאירה פוקוס על כפתור
            // אך לא נועלת פתוח, כך שאחרי שהעכבר עוזב הפריט גולש בחזרה.
            onFocus={(e) => {
                const el = e.target as HTMLElement;
                if (typeof el.matches === 'function' && el.matches(':focus-visible')) setFocusWithin(true);
            }}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
            }}
            style={{
                transform,
                opacity: collapsed ? 0.85 : 1,
                transition: peekEnabled && animateReady
                    ? 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease'
                    : undefined,
                willChange: peekEnabled ? 'transform' : undefined,
            }}
            className={`pointer-events-auto ${className ?? ''}`}
        >
            {children}
        </div>
    );
}
