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

// העברית מגדירה את הצורה. כל שאר השפות מוטמעות אליה.
export type CatalogDict = typeof heCatalog;
export type ChromeDict = typeof heChrome;

export interface Dictionary {
    catalog: CatalogDict;
    chrome: ChromeDict;
}

const DICTS: Record<Locale, Dictionary> = {
    he: { catalog: heCatalog, chrome: heChrome },
    ar: { catalog: arCatalog, chrome: arChrome },
    ru: { catalog: ruCatalog, chrome: ruChrome },
    en: { catalog: enCatalog, chrome: enChrome },
    es: { catalog: esCatalog, chrome: esChrome },
    ja: { catalog: jaCatalog, chrome: jaChrome },
};

/** מחזיר את המילון לשפה, עם נפילה לעברית אם השפה לא נמצאה. */
export function getDictionary(locale: Locale): Dictionary {
    return DICTS[locale] ?? DICTS.he;
}
