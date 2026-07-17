"use client";

// components/ai-internals/EdgePeek.tsx
//
// פרימיטיבים למסילת-קצה צפה משותפת: כמה כפתורים צפים (דוק האזנה, מצב מיקוד) שיושבים
// בטור אנכי בקצה החלון, כל אחד "מציץ" כאייקון במנוחה ונפתח בהחלקה זורמת ב-hover.
//
// EdgeRail  - העמודה הצפה הממורכזת אנכית, תלוית-כיוון, עם slot ל-portal של הדוק (מעל)
//             ואז ה-children (כפתור המיקוד, מתחת).
// EdgePeekItem - מכונת ה-peek לפריט בודד: במנוחה מחליק אל הקצה ומשאיר רק את האייקון
//             (peekRem), נפתח ב-hover / פוקוס-מקלדת / כשהוא "נעוץ". ההצצה פעילה בכל
//             מכשיר, כולל מגע: המסילה יושבת בקצה החלון, ובמובייל אין שם שוליים פנויים,
//             ולכן פריט שאינו מצומצם למנוחה מכסה פקדים בעמודת התוכן. במגע אין hover,
//             ולכן הפתיחה מגיעה מ"נעוץ" (למשל הקראה פעילה). reduced-motion מבטל את
//             ההחלקה בלבד, לא את ההצמדה.

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
    // ההצצה פעילה בכל מכשיר. קודם היא הותנתה ב-hover, ולכן במגע הפריט נשאר פרוס תמיד
    // ודרס את עמודת התוכן: המסילה מעוגנת לקצה החלון בהנחה שיש שוליים פנויים בינו לבין
    // התוכן, וזה נכון רק בדסקטופ (main הוא max-w-4xl ממורכז). במובייל main ממלא את החלון
    // ושוליו הם px-8 בלבד (32px), צרים מהפריט (60px), ולכן הוא כיסה פקדים.
    // מכאן: תמיד מצמידים לקצה במנוחה, ורק *המעבר* מותנה בהעדפת התנועה.
    const [reduceMotion, setReduceMotion] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focusWithin, setFocusWithin] = useState(false);
    // מפעיל מעברים רק אחרי הצביעה הראשונה, כך שההיצמדות הראשונית לקצה מיידית (בלי החלקה).
    const [animateReady, setAnimateReady] = useState(false);
    const leaveTimer = useRef<number | null>(null);

    // זיהוי לפני paint (layout effect), כדי שהפריט יצויר מיד במצב הנכון בלי הבהוב.
    useIsoLayoutEffect(() => {
        const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduceMotion(motionMq.matches);
        update();
        motionMq.addEventListener('change', update);
        return () => motionMq.removeEventListener('change', update);
    }, []);

    // אחרי הפריים הראשון מפעילים מעברים, כך שרק אינטראקציית hover אמיתית מחליקה.
    useEffect(() => {
        const raf = requestAnimationFrame(() => setAnimateReady(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    // גלילה = "הלומד קורא, זוז הצידה": מכווץ בחזרה (אלא אם נעוץ / פוקוס-מקלדת שומרים פתוח).
    useEffect(() => {
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
    }, []);

    useEffect(() => () => {
        if (leaveTimer.current) clearTimeout(leaveTimer.current);
    }, []);

    const isRtl = dir === 'rtl';
    // במגע אין hover, ולכן הפתיחה מגיעה מ-pinned: האייקון המבצבץ *הוא* כפתור ההפעלה,
    // ולחיצה עליו מתחילה הקראה, מה שנועץ את הפריט פתוח (useReadAloudPin) עד לעצירה.
    const expanded = hovered || focusWithin || pinned;
    const collapsed = !expanded;

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
                // ההצמדה עצמה אינה מותנית בהעדפת התנועה (אחרת הפריט היה דורס תוכן במובייל
                // כשהיא פעילה). רק ההחלקה מבוטלת, והמעבר נעשה מיידי.
                transition: animateReady && !reduceMotion
                    ? 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease'
                    : undefined,
                willChange: 'transform',
            }}
            className={`pointer-events-auto ${className ?? ''}`}
        >
            {children}
        </div>
    );
}
