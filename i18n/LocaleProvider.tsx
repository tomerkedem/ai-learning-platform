"use client";

// i18n/LocaleProvider.tsx
//
// ספק ה-locale הגלובלי. עוטף את כל האפליקציה (components/RootDocument.tsx).
//
// פתרון ה-locale:
//   1. ה-state ההתחלתי הוא initialLocale שנפתר בשרת (בלומדה: עוגייה / שפת דפדפן / אנגלית;
//      בשאר האתר: עברית). ה-SSR וה-hydration מרנדרים אותה שפה, ולכן אין הבזק שפה.
//   2. בחירה (setLocale) מעדכנת מיד את הממשק ואת <html>, ושומרת רק את קוד השפה
//      בעוגייה פונקציונלית. ריענון וניווט פנימי נפתרים בשרת מאותה עוגייה.
//      ה-state יושב ב-root layout, ולכן החלפת שפה אינה מאפסת מבדקים או מעבדות פתוחים.
//
// הכתובת אינה נושאת שפה (אין ?lang ואין ניתוב [locale]). הכיוון תמיד מהרישום (dirOf).

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LOCALES, LOCALE_COOKIE, dirOf, type Locale, type Direction } from './config';
import { DevLocaleToggle } from './DevLocaleToggle';

interface LocaleContextValue {
    locale: Locale;
    dir: Direction;
    htmlLang: string;
    setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function LocaleProvider({
    initialLocale,
    serverResolved,
    children,
}: {
    initialLocale: Locale;
    /** true כשהשרת פותר את השפה מהבקשה (הלומדה). במסלולים הסטטיים אין מה לרענן. */
    serverResolved: boolean;
    children: React.ReactNode;
}) {
    const [locale, setLocaleState] = useState<Locale>(initialLocale);
    const router = useRouter();

    const setLocale = useCallback((l: Locale) => {
        setLocaleState(l);
        // <html> מתעדכן מיד (לא אחרי render), כך שקוראי מסך, TTS ו-CSS תלוי-שפה רואים את
        // השפה החדשה באותו רגע. lang/dir/data-locale כבר נכתבו בשרת לשפה ההתחלתית.
        const el = document.documentElement;
        el.lang = LOCALES[l].htmlLang;
        el.dir = dirOf(l);
        el.dataset.locale = l;
        const secure = window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `${LOCALE_COOKIE}=${l}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax${secure}`;
        // רענון רכיבי השרת (כותרת המסמך, מטמון הניתוב) מול העוגייה החדשה. refresh שומר את
        // ה-state של רכיבי הלקוח, ולכן מבדק או מעבדה באמצע נשארים כפי שהם.
        if (serverResolved) router.refresh();
    }, [router, serverResolved]);

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
