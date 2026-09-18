"use client";

// components/ThemeProvider.tsx
//
// ספק ערכת-הנושא של הלומדה. מימוש מקומי קטן, בלי תלות חיצונית.
//
// שלושה מצבי-משתמש (mode): system | light | dark.
// שתי ערכות נפתרות (resolvedTheme): light | dark.
//
// חלוקת האחריות:
//   * סקריפט הטרום-ציור (app/layout.tsx) קובע את data-theme ואת color-scheme על
//     <html> עוד לפני הציור הראשון, כדי שלא תהיה הבזקה.
//   * הספק הזה מחזיק את המצב אחרי ה-hydration, מסנכרן אותו חזרה ל-DOM, ושומר את
//     בחירת המשתמש. הוא אינו מרנדר שום סימון שתלוי בהעדפה, ולכן הרינדור הראשון
//     בשרת ובלקוח זהה.
//
// הרכיבים אינם אמורים להישען על ה-state הזה לצורך עיצוב. העיצוב מגיע מאסימוני
// ה-CSS ב-globals.css, שנפתרים לפי data-theme.
//
// T2A: אין עדיין בורר ערכה. setMode נחשף לשימוש עתידי בלבד.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/** מפתח האחסון היחיד של העדפת הערכה. אינו משותף עם אחסון ההתקדמות בלמידה. */
export const THEME_STORAGE_KEY = 'bts-theme';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const isMode = (v: unknown): v is ThemeMode => v === 'system' || v === 'light' || v === 'dark';

/** קריאה בטוחה: אחסון חסום, ערך לא תקין או היעדר ערך נופלים כולם ל-system. */
function readStoredMode(): ThemeMode {
    try {
        const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
        return isMode(raw) ? raw : 'system';
    } catch {
        return 'system';
    }
}

/** פתרון מצב system מהעדפת מערכת ההפעלה. אם matchMedia אינו זמין, נשארים ב-dark. */
function resolveSystem(): ResolvedTheme {
    try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
        return 'dark';
    }
}

/** חותם את הערכה הנפתרת על <html>: data-theme ל-CSS, color-scheme לממשק הדפדפן. */
function applyTheme(theme: ResolvedTheme) {
    const el = document.documentElement;
    // כתיבה רק כשיש שינוי אמיתי. סקריפט הטרום-ציור כבר חתם את הערך הנכון, ובלי
    // הבדיקה הזו הספק היה כותב אותו שוב אחרי ה-hydration - כתיבה מיותרת שמקשה
    // להוכיח שאין היפוך ערכה.
    if (el.getAttribute('data-theme') !== theme) el.setAttribute('data-theme', theme);
    if (el.style.colorScheme !== theme) el.style.colorScheme = theme;
}

interface ThemeContextValue {
    mode: ThemeMode;
    resolvedTheme: ResolvedTheme;
    setMode: (m: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // ה-state ההתחלתי זהה בשרת ובלקוח (system/dark). ההעדפה האמיתית כבר הוחלה על
    // ה-DOM על ידי סקריפט הטרום-ציור, ונקראת לתוך ה-state רק אחרי mount.
    const [mode, setModeState] = useState<ThemeMode>('system');
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
    // ready מונע הבהוב: בלעדיו אפקט ההחלה היה רץ פעם אחת עם ברירת המחדל (system)
    // ורק אחר כך עם ההעדפה השמורה, כלומר data-theme היה יכול להתהפך אחרי ה-hydration.
    // שתי קביעות ה-state שלמטה נארזות יחד, ולכן אפקט ההחלה רץ פעם אחת, עם הערך הנכון.
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- אחסון זמין רק בצד הלקוח, אחרי mount
        setModeState(readStoredMode());
        setReady(true);
    }, []);

    // החלת הערכה על ה-DOM. במצב system עוקבים אחרי העדפת מערכת ההפעלה; בחירה
    // מפורשת של light/dark מנתקת את הקשר הזה, ושינוי במערכת ההפעלה כבר לא משפיע.
    useEffect(() => {
        // עד שההעדפה נקראה, הערכה שקבע סקריפט הטרום-ציור נשארת כפי שהיא.
        if (!ready) return;
        if (mode !== 'system') {
            applyTheme(mode);
            // eslint-disable-next-line react-hooks/set-state-in-effect -- סנכרון הערכה הנפתרת עם ה-DOM
            setResolvedTheme(mode);
            return;
        }
        const sync = () => {
            const next = resolveSystem();
            applyTheme(next);
            setResolvedTheme(next);
        };
        sync();
        let mq: MediaQueryList | null = null;
        try {
            mq = window.matchMedia('(prefers-color-scheme: dark)');
            mq.addEventListener('change', sync);
        } catch {
            mq = null;
        }
        return () => mq?.removeEventListener('change', sync);
    }, [mode, ready]);

    const setMode = useCallback((m: ThemeMode) => {
        setModeState(m);
        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, m);
        } catch {
            // אחסון חסום: הבחירה תקפה לסשן הנוכחי ולא נשמרת. אין שבירה של העמוד.
        }
    }, []);

    const value = useMemo<ThemeContextValue>(
        () => ({ mode, resolvedTheme, setMode }),
        [mode, resolvedTheme, setMode],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** הקשר הערכה. זמין לשימוש עתידי (בורר ערכה); אינו נדרש לעיצוב. */
export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
    return ctx;
}
