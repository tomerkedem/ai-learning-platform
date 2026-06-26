"use client";

// i18n/useT.ts
//
// הוק הגישה המרכזי לרכיבים. מחזיר את ה-locale הפעיל, כיוון הכתיבה (מהרישום),
// פונקציית setLocale (לבורר הפיתוח), ואת מילון המחרוזות לשפה הנוכחית (t).

import { useMemo } from 'react';
import { useLocaleContext } from './LocaleProvider';
import { getDictionary, type Dictionary } from './dictionary';
import type { Locale, Direction } from './config';

export interface UseT {
    locale: Locale;
    dir: Direction;
    setLocale: (l: Locale) => void;
    t: Dictionary;
}

export function useT(): UseT {
    const { locale, dir, setLocale } = useLocaleContext();
    const t = useMemo(() => getDictionary(locale), [locale]);
    return { locale, dir, setLocale, t };
}
