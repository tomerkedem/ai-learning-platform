"use client";

// i18n/LocaleProvider.tsx
//
// ספק ה-locale הגלובלי. עוטף את כל האפליקציה (ב-app/layout.tsx).
//
// פתרון ה-locale:
//   1. ה-state ההתחלתי הוא תמיד DEFAULT_LOCALE ('he'), ולכן ה-SSR מרנדר עברית.
//      כך התנהגות ברירת המחדל בעברית נשמרת ואין אי-התאמת hydration.
//   2. אחרי mount בצד הלקוח קוראים את ?lang= מה-URL ומעדכנים אם הוא locale תקין.
//
// הכיוון (dir) תמיד נגזר מהרישום (dirOf), לעולם לא מ-locale === 'he'.
// אין שימוש ב-localStorage כמנגנון השפה הראשי, ואין ניתוב [locale] בשלב זה.

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { LOCALES, DEFAULT_LOCALE, isLocale, dirOf, type Locale, type Direction } from './config';
import { DevLocaleToggle } from './DevLocaleToggle';

interface LocaleContextValue {
    locale: Locale;
    dir: Direction;
    htmlLang: string;
    setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

    // קריאת ?lang= בצד הלקוח בלבד (אחרי mount), כדי לא לדרוש Suspense ולא לשבור
    // את הרינדור הסטטי. ברירת המחדל (he) ללא ?lang נשארת זהה ל-SSR.
    useEffect(() => {
        const param = new URLSearchParams(window.location.search).get('lang');
        if (isLocale(param) && param !== locale) {
            setLocaleState(param);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- ריצה פעם אחת בעלייה
    }, []);

    // סנכרון אלמנט ה-<html>: lang, dir ו-data-locale. כך CSS תלוי-שפה (גלישת CJK,
    // גופנים) וטכנולוגיות מסייעות רואים את השפה והכיוון הפעילים. הכיוון מהרישום.
    useEffect(() => {
        const el = document.documentElement;
        el.lang = LOCALES[locale].htmlLang;
        el.dir = dirOf(locale);
        el.dataset.locale = locale;
    }, [locale]);

    const setLocale = useCallback((l: Locale) => {
        setLocaleState(l);
        // משקפים את הבחירה ב-?lang= (בלי ניווט מלא). ברירת המחדל מנקה את הפרמטר.
        const url = new URL(window.location.href);
        if (l === DEFAULT_LOCALE) url.searchParams.delete('lang');
        else url.searchParams.set('lang', l);
        window.history.replaceState(null, '', url.toString());
    }, []);

    const value = useMemo<LocaleContextValue>(
        () => ({ locale, dir: dirOf(locale), htmlLang: LOCALES[locale].htmlLang, setLocale }),
        [locale, setLocale],
    );

    return (
        <LocaleContext.Provider value={value}>
            {children}
            <DevLocaleToggle locale={locale} setLocale={setLocale} />
        </LocaleContext.Provider>
    );
}

/** הוק פנימי: הקשר ה-locale. נצרך דרך useT. */
export function useLocaleContext(): LocaleContextValue {
    const ctx = useContext(LocaleContext);
    if (!ctx) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return ctx;
}
