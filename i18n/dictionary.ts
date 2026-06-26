// i18n/dictionary.ts
//
// מאחד את מרחבי-השמות (catalog, chrome) לכל שפה, וגוזר את טיפוס המילון מהעברית.
// כך כל שפה אחרת חייבת לעמוד במבנה של העברית (בדיקת קומפילציה לשלמות התרגום).
// כל ה-stubs מייצאים מחדש את העברית, ולכן fallback לעברית מובטח גם ברמת המילון.

import type { Locale } from './config';

import { catalog as heCatalog } from './locales/he/catalog';
import { chrome as heChrome } from './locales/he/chrome';
import { catalog as arCatalog } from './locales/ar/catalog';
import { chrome as arChrome } from './locales/ar/chrome';
import { catalog as ruCatalog } from './locales/ru/catalog';
import { chrome as ruChrome } from './locales/ru/chrome';
import { catalog as enCatalog } from './locales/en/catalog';
import { chrome as enChrome } from './locales/en/chrome';
import { catalog as esCatalog } from './locales/es/catalog';
import { chrome as esChrome } from './locales/es/chrome';
import { catalog as jaCatalog } from './locales/ja/catalog';
import { chrome as jaChrome } from './locales/ja/chrome';

// פרק 5 (פיילוט i18n של הפרקים). העברית היא המקור; שאר השפות הן stubs שמייצאים מחדש
// את העברית (fallback בטוח) עד שיתורגמו בשלב מאוחר יותר.
import { chapter5 as heChapter5 } from './locales/he/behind-ai/chapter5';
import { chapter5 as arChapter5 } from './locales/ar/behind-ai/chapter5';
import { chapter5 as ruChapter5 } from './locales/ru/behind-ai/chapter5';
import { chapter5 as enChapter5 } from './locales/en/behind-ai/chapter5';
import { chapter5 as esChapter5 } from './locales/es/behind-ai/chapter5';
import { chapter5 as jaChapter5 } from './locales/ja/behind-ai/chapter5';

// העברית מגדירה את הצורה. כל שאר השפות מוטמעות אליה.
export type CatalogDict = typeof heCatalog;
export type ChromeDict = typeof heChrome;
export type Chapter5Dict = typeof heChapter5;

/** מרחב הלומדה "מאחורי הקלעים של AI". מתרחב עם כל פרק שעובר i18n. */
export interface BehindAiDict {
    chapter5: Chapter5Dict;
}

export interface Dictionary {
    catalog: CatalogDict;
    chrome: ChromeDict;
    behindAi: BehindAiDict;
}

const DICTS: Record<Locale, Dictionary> = {
    he: { catalog: heCatalog, chrome: heChrome, behindAi: { chapter5: heChapter5 } },
    ar: { catalog: arCatalog, chrome: arChrome, behindAi: { chapter5: arChapter5 } },
    ru: { catalog: ruCatalog, chrome: ruChrome, behindAi: { chapter5: ruChapter5 } },
    en: { catalog: enCatalog, chrome: enChrome, behindAi: { chapter5: enChapter5 } },
    es: { catalog: esCatalog, chrome: esChrome, behindAi: { chapter5: esChapter5 } },
    ja: { catalog: jaCatalog, chrome: jaChrome, behindAi: { chapter5: jaChapter5 } },
};

/** מחזיר את המילון לשפה, עם נפילה לעברית אם השפה לא נמצאה. */
export function getDictionary(locale: Locale): Dictionary {
    return DICTS[locale] ?? DICTS.he;
}
