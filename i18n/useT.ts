"use client";

// i18n/useT.ts
//
// הוק הגישה המרכזי לרכיבים. מחזיר את ה-locale הפעיל, כיוון הכתיבה (מהרישום),
// פונקציית setLocale (לבורר הפיתוח), ואת מילון המחרוזות לשפה הנוכחית (t).

import { useMemo } from 'react';
import { useLocaleContext } from './LocaleProvider';
import { getDictionary, type Dictionary } from './dictionary';
import { useProtectedContent } from './ProtectedContent';
import type { Locale, Direction } from './config';

export interface UseT {
    locale: Locale;
    dir: Direction;
    setLocale: (l: Locale) => void;
    t: Dictionary;
}

export function useT(): UseT {
    const { locale, dir, setLocale } = useLocaleContext();
    // בתוך עמוד מוגן: מרחבי-השמות של הפרק שהשרת העביר אחרי בדיקת הרשאה.
    const extra = useProtectedContent()?.dict;
    const t = useMemo(() => {
        const base = getDictionary(locale);
        return extra ? { ...base, behindAi: { ...base.behindAi, ...extra } } : base;
    }, [locale, extra]);
    return { locale, dir, setLocale, t };
}
