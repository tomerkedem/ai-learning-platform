"use client";

// components/ai-internals/usePortalTheme.ts
//
// נעילת-היקף (data-theme) לתוכן שמפורטל אל document.body: document.body עצמו
// אינו נושא data-theme, ולכן בלעדי זה כל portal היה נופל לערכה הגלובלית של html,
// גם כשמקורו בפרק נעול-Dark. משותף לכל צרכני ה-portal (ExpandableLab, IntroRoadmap
// דוק ההדגמה, FloatingReadAloud נתיב ה-fallback) כדי שלא תהיה לוגיקה כפולה, ובעיקר
// כדי שהתנהגות תהיה זהה: אם המקור נעול (יש אב data-theme שאינו html) - הערכה שלו
// קבועה; אחרת (יורש מ-html) - הערכה עוקבת חי אחרי useTheme().resolvedTheme, כך
// שהחלפת System/Light/Dark חיה בזמן שה-portal כבר פתוח לא משאירה אותו תקוע בערכה
// הישנה.
//
// שימוש: usePortalTheme(anchorRef, active) - anchorRef מצביע לאלמנט שנשאר בעץ
// המקורי (לא מפורטל) הכי קרוב לנקודת המקור; active הוא התנאי שבו ה-portal בכלל
// מרונדר (כדי לא לגלול DOM כשאין בו צורך).

import { useLayoutEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

export function usePortalTheme(anchorRef: React.RefObject<HTMLElement | null>, active: boolean): string | undefined {
    const { resolvedTheme } = useTheme();
    // undefined = עדיין לא נבדק; null = נבדק ואין נעילה (יורש מ-html, לכן עוקב אחרי resolvedTheme).
    const [lockedTheme, setLockedTheme] = useState<string | null | undefined>(undefined);

    useLayoutEffect(() => {
        if (!active) return;
        const found = anchorRef.current?.closest<HTMLElement>('[data-theme]');
        // closest עשוי למצוא את html עצמו (כשאין נעילה קרובה יותר) - זה לא "נעילה",
        // אלא בדיוק מה ש-resolvedTheme כבר נותן, חי. רק אב שאינו html הוא נעילה אמיתית.
        // eslint-disable-next-line react-hooks/set-state-in-effect -- תלוי במדידת DOM (closest), לא ניתן לחישוב בזמן רינדור
        setLockedTheme(found && found.tagName !== 'HTML' ? (found.getAttribute('data-theme') ?? null) : null);
    }, [active, anchorRef]);

    if (!active || lockedTheme === undefined) return undefined;
    return lockedTheme ?? resolvedTheme;
}
