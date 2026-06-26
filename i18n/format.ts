// i18n/format.ts
//
// פורמטרים תלויי-locale למספרים שמופיעים ב-catalog וב-chrome: מספר פרקים, תווית
// פרק, וזמן קריאה. במקום שרשור מחרוזות פר-שפה, ריבוי (plural) מטופל דרך
// Intl.PluralRules, והמספרים מוצגים בספרות מערביות (latn) בכל השפות, עקבי עם
// שאר ה-UI. עברית נשארת זהה חזותית למה שהיה ("8 דקות", "פרק 3" וכו').

import type { Locale } from './config';

/** מספר בספרות מערביות (latn) בכל שפה, גם ב-ar/he. */
function fmtNum(locale: Locale, n: number): string {
    return new Intl.NumberFormat(locale, { numberingSystem: 'latn' }).format(n);
}

// ───────────── מספר פרקים (עם ריבוי) ─────────────
const CHAPTER_WORDS: Record<Locale, Partial<Record<Intl.LDMLPluralRule, string>>> = {
    he: { one: 'פרק', two: 'פרקים', many: 'פרקים', other: 'פרקים' },
    en: { one: 'chapter', other: 'chapters' },
    es: { one: 'capítulo', other: 'capítulos' },
    ru: { one: 'глава', few: 'главы', many: 'глав', other: 'глав' },
    ar: { zero: 'فصل', one: 'فصل', two: 'فصلان', few: 'فصول', many: 'فصلًا', other: 'فصل' },
    ja: {}, // יפנית: סיומת 章 ללא ריבוי, מטופל בנפרד
};

export function formatChapterCount(locale: Locale, n: number): string {
    const num = fmtNum(locale, n);
    if (locale === 'ja') return `${num}章`;
    const cat = new Intl.PluralRules(locale).select(n);
    const words = CHAPTER_WORDS[locale];
    return `${num} ${words[cat] ?? words.other ?? ''}`;
}

// ───────────── זמן קריאה בדקות ─────────────
// en/es/ru משתמשים בקיצור קבוע (אינו מתאם לריבוי). he/ar מתאימים את היחידה לריבוי.
const MIN_INVARIANT: Partial<Record<Locale, string>> = { en: 'min', es: 'min', ru: 'мин' };
const MIN_WORDS: Partial<Record<Locale, Partial<Record<Intl.LDMLPluralRule, string>>>> = {
    he: { one: 'דקה', two: 'דקות', many: 'דקות', other: 'דקות' },
    ar: { zero: 'دقيقة', one: 'دقيقة', two: 'دقيقتان', few: 'دقائق', many: 'دقيقة', other: 'دقيقة' },
};

export function formatReadTime(locale: Locale, minutes: number): string {
    const num = fmtNum(locale, minutes);
    if (locale === 'ja') return `${num}分`;
    const inv = MIN_INVARIANT[locale];
    if (inv) return `${num} ${inv}`;
    const words = MIN_WORDS[locale];
    if (words) {
        const cat = new Intl.PluralRules(locale).select(minutes);
        return `${num} ${words[cat] ?? words.other ?? ''}`;
    }
    return num;
}

/** מחלץ מספר דקות ממחרוזת readTime כמו "8 דקות". fallback ל-0 אם אין מספר. */
export function parseReadTimeMinutes(value: string): number {
    const m = value.match(/\d+/);
    return m ? parseInt(m[0], 10) : 0;
}

// ───────────── תוויות פרק (סודר, ללא ריבוי) ─────────────
const CHAPTER_LABEL: Record<Locale, (num: string) => string> = {
    he: (n) => `פרק ${n}`,
    en: (n) => `Chapter ${n}`,
    es: (n) => `Capítulo ${n}`,
    ru: (n) => `Глава ${n}`,
    ar: (n) => `الفصل ${n}`,
    ja: (n) => `第${n}章`,
};
const NEXT_CHAPTER_LABEL: Record<Locale, (num: string) => string> = {
    he: (n) => `הבא: פרק ${n}`,
    en: (n) => `Next: Chapter ${n}`,
    es: (n) => `Siguiente: capítulo ${n}`,
    ru: (n) => `Далее: глава ${n}`,
    ar: (n) => `التالي: الفصل ${n}`,
    ja: (n) => `次へ：第${n}章`,
};

export function formatChapterLabel(locale: Locale, n: number): string {
    return CHAPTER_LABEL[locale](fmtNum(locale, n));
}
export function formatNextChapterLabel(locale: Locale, n: number): string {
    return NEXT_CHAPTER_LABEL[locale](fmtNum(locale, n));
}

// ───────────── מונה צעדים (מעבדת פרק 5) ─────────────
// פר-locale, עברית מאוכלסת. שאר השפות יתווספו ב-Phase 3, וכרגע נופלות לעברית יחד עם
// תוכן הפרק שעדיין לא תורגם. המספרים בספרות מערביות (latn) בכל שפה, עקבי עם שאר ה-UI.
const STEP_COUNTER: Partial<Record<Locale, (step: string, total: string) => string>> = {
    he: (s, t) => `צעד ${s} מתוך ${t}`,
};
export function formatStepCounter(locale: Locale, step: number, total: number): string {
    const fn = STEP_COUNTER[locale] ?? STEP_COUNTER.he!;
    return fn(fmtNum(locale, step), fmtNum(locale, total));
}

// ───────────── הרכבת התשובה שנבנתה (מעבדת פרק 5) ─────────────
// מצרף את חלקי התשובה למשפט אחד עם פיסוק תלוי-locale, בלי שרשור קשיח-לתרגום בתוך
// הרכיב. עברית זהה לפלט הקודם ("first. a, b."). יפנית מוכנה עם פיסוק יפני (。、). שאר
// השפות נופלות לברירת המחדל (זהה לעברית, מתאים ל-en/es/ru); ערבית תכוונן ב-Phase 3.
interface AnswerPunctuation {
    /** מפריד בין הפתיחה לשאר החלקים. */
    afterFirst: string;
    /** מפריד בין החלקים שאחרי הפתיחה. */
    betweenRest: string;
    /** סימן הסיום. */
    terminal: string;
    /**
     * מפריד לפני החלק האחרון. ברירת מחדל: betweenRest. בשפות שבהן החלק האחרון נפתח
     * בוו החיבור (y/и), נגדיר רווח בלבד כדי להימנע מפסיק לפני וו החיבור.
     */
    beforeLast?: string;
}
const ANSWER_PUNCTUATION: Partial<Record<Locale, AnswerPunctuation>> = {
    he: { afterFirst: '. ', betweenRest: ', ', terminal: '.' },
    ja: { afterFirst: '。', betweenRest: '、', terminal: '。' },
    // ערבית: פסיק ערבי (،) בין החלקים, נקודה רגילה לסיום.
    ar: { afterFirst: '. ', betweenRest: '، ', terminal: '.' },
    // ספרדית/רוסית: בלי פסיק לפני וו החיבור הסופי (y/и), רק רווח. en נשאר עם פסיק
    // אוקספורד דרך ברירת המחדל.
    es: { afterFirst: '. ', betweenRest: ', ', terminal: '.', beforeLast: ' ' },
    ru: { afterFirst: '. ', betweenRest: ', ', terminal: '.', beforeLast: ' ' },
};
const DEFAULT_ANSWER_PUNCTUATION: AnswerPunctuation = ANSWER_PUNCTUATION.he!;

export function assembleLocalizedAnswer(locale: Locale, fragments: string[]): string {
    if (fragments.length === 0) return '';
    const p = ANSWER_PUNCTUATION[locale] ?? DEFAULT_ANSWER_PUNCTUATION;
    const [first, ...rest] = fragments;
    if (rest.length === 0) return `${first}${p.terminal}`;
    if (rest.length === 1) return `${first}${p.afterFirst}${rest[0]}${p.terminal}`;
    // ההפרדה לפני החלק האחרון נפרדת, כדי לאפשר השמטת פסיק לפני וו החיבור (es/ru).
    const beforeLast = p.beforeLast ?? p.betweenRest;
    const head = rest.slice(0, -1).join(p.betweenRest);
    const last = rest[rest.length - 1];
    return `${first}${p.afterFirst}${head}${beforeLast}${last}${p.terminal}`;
}
