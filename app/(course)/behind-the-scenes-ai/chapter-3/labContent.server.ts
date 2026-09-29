// תוכן מעבדת ה-Tokenization לכל שפה, בשרת בלבד (פרק 3 מוגן).
// 'server-only' שובר את הבנייה אם רכיב לקוח מייבא את הקובץ. עמוד פרק 3 קורא ל-getLabContent
// רק אחרי בדיקת הרשאה ומעביר את התוצאה ל-Chapter3LabProvider.
// אין שימוש בתו מקף ארוך (em dash) או מקף בינוני (en dash).

import 'server-only';
import type { Locale } from '@/i18n/config';
import {
    TOKEN_SCENARIOS,
    ROADMAP_STEPS,
    HE_SORTING_CENTER,
    HE_DELIVERY_FAILURE,
    WORD_ROLES,
    ROLE_INFO,
} from './labData.server';
import type { TokenRole } from './tokenRoles';
import { HEBREW_SPLITS } from './hebrewSplitRules';

import { chapter3Lab as EN_LAB_CONTENT } from '@/i18n/locales/en/behind-ai/chapter3Lab';
import { chapter3Lab as ES_LAB_CONTENT } from '@/i18n/locales/es/behind-ai/chapter3Lab';
import { chapter3Lab as RU_LAB_CONTENT } from '@/i18n/locales/ru/behind-ai/chapter3Lab';
import { chapter3Lab as AR_LAB_CONTENT } from '@/i18n/locales/ar/behind-ai/chapter3Lab';
import { chapter3Lab as JA_LAB_CONTENT } from '@/i18n/locales/ja/behind-ai/chapter3Lab';

import type { Chapter3LabContent, RoleInfoText, SubwordSplit } from './labContent';

/* ════════════════════════ ברירת מחדל עברית ════════════════════════ */

const HE_ROLE_INFO = Object.fromEntries(
    (Object.keys(ROLE_INFO) as TokenRole[]).map((role) => [
        role,
        { label: ROLE_INFO[role].he, en: ROLE_INFO[role].en, why: ROLE_INFO[role].whyHe },
    ]),
) as Record<TokenRole, RoleInfoText>;

const HE_SUBWORD_SPLITS: SubwordSplit[] = HEBREW_SPLITS.map((s) => ({
    word: s.word,
    whole: s.simple,
    units: s.educational,
    roleLabel: s.roleHe,
    roleEn: s.roleEn,
    note: s.noteHe,
}));

const HE_LAB_CONTENT: Chapter3LabContent = {
    modeLabel: 'מצב:',

    splitter: {
        hint: 'הקלידו משפט, והוא יתפרק לטוקנים בזמן אמת.',
        placeholder: 'לדוגמה: הכביסה לא התייבשה',
        aria: 'שדה הקלדה לפירוק טוקנים',
        quickLabel: 'ניסויים מהירים:',
        resetLabel: 'איפוס',
    },

    stream: {
        title: 'זרם הטוקנים',
        titleEn: 'Token Stream',
        empty: 'הקלידו טקסט, והוא יתפרק כאן לטוקנים.',
        hint: 'לחצו על טוקן כדי לראות את התפקיד שלו.',
        rail: {
            input: { label: 'טקסט קלט', en: 'Input Text' },
            tokenizer: { label: 'טוקנייזר', en: 'Tokenizer' },
            stream: { label: 'זרם טוקנים', en: 'Token Stream' },
        },
    },

    legend: {
        title: 'מפת צבעי התפקידים',
        titleEn: 'Token Color Map',
    },

    count: {
        title: 'מד טוקנים',
        titleEn: 'Token Count',
        note: 'המספר הזה יתחבר בהמשך ל-Context Window: כמה טוקנים מודל יכול להחזיק בבת אחת. כאן רק נזרע הרעיון.',
    },

    roleCard: {
        closeAria: 'סגירת כרטיס התפקיד',
    },

    signals: {
        number: { label: 'טוקן מספר', en: 'Number token' },
        action: { label: 'אות פעולה', en: 'Action signal' },
        deliveryFailure: { label: 'צירוף שלילה ופעולה', en: 'Negation signal' },
        sortingCenter: { label: 'צירוף הקשר: כוס קפה', en: 'Coffee cup phrase' },
    },

    noSpaceNote:
        'בלי רווחים, הטוקנייזר הלימודי הזה רואה יחידה אחת ארוכה. טוקנייזר אמיתי היה מפרק אותה בכל זאת לתת-מילים, כי הוא לא נשען רק על רווחים. זו בדיוק הסיבה שטוקן אינו בהכרח מילה.',

    educational: {
        badge: 'Educational',
        note: 'זהו טוקנייזר לימודי, לא של מודל מסחרי. השלב הזה הוא הכנה בלבד: המערכת עוד לא מחשבת הסתברות מלאה ולא עונה, היא רק מפרקת את הטקסט ליחידות עבודה. צביעת התפקידים היא עזר לימודי - מודלים אמיתיים מפרקים לפי סטטיסטיקה, לא לפי תפקיד לשוני.',
    },

    subword: {
        title: 'מעבדת הטוקנים העברית',
        titleEn: 'Hebrew Token Lab',
        badge: 'פירוק לימודי',
        hint: 'לחצו על מילה כדי לפצל אותה: אות השימוש (ל, מ, ש, ב, ה) נפרדת מהמילה הבסיסית. שימו לב איך מספר הטוקנים עולה עם כל פיצול.',
        wordsLabel: 'מילים:',
        tokensLabel: 'טוקנים:',
        splitAll: 'פצל הכול',
        mergeAll: 'אחד הכול',
        splitHint: 'לחצו לפיצול',
        mergeHint: 'לחצו לאיחוד',
        ariaWhole: 'שלם, לחצו לפיצול',
        ariaSplit: 'מפוצל, לחצו לאיחוד',
        note: 'זהו פירוק לימודי בלבד. טוקנייזר מסחרי אמיתי לא מפצל לפי אותיות שימוש אלא לפי סטטיסטיקת תת-מילים שנלמדה מהמון טקסט. כאן אנחנו ממחישים את הרעיון שמילה אחת יכולה להתפרק לכמה יחידות.',
        splits: HE_SUBWORD_SPLITS,
    },

    roadmap: {
        title: 'מפת הדרכים של המנוע',
        titleEn: 'From Text to Probabilities',
        note: 'כרגע אנחנו רק בשלב הראשון: טקסט הופך לטוקנים. השלבים הבאים (מזהי טוקן, וקטורים) הם המקום שבו מודלים אמיתיים עושים את החישוב הסטטיסטי. בלי הפירוק הזה, אין בכלל התחלה למסלול.',
        steps: ROADMAP_STEPS,
    },

    scenarios: TOKEN_SCENARIOS,
    roleWords: WORD_ROLES,
    roleInfo: HE_ROLE_INFO,
    sortingCenter: HE_SORTING_CENTER,
    deliveryFailure: HE_DELIVERY_FAILURE,
};

/* ════════════════════════ מרשם תוכן לפי שפה ════════════════════════ */

// העברית היא ברירת המחדל. שאר השפות מספקות חבילה מלאה ומקומית. כל מי שלא נמצא
// במפה נופל בבטחה לעברית.
const LAB_CONTENT_BY_LOCALE: Record<Locale, Chapter3LabContent> = {
    he: HE_LAB_CONTENT,
    en: EN_LAB_CONTENT,
    es: ES_LAB_CONTENT,
    ru: RU_LAB_CONTENT,
    ar: AR_LAB_CONTENT,
    ja: JA_LAB_CONTENT,
};

/** מחזיר את תוכן המעבדה לשפה, עם נפילה לעברית אם השפה לא נמצאה. */
export function getLabContent(locale: Locale): Chapter3LabContent {
    return LAB_CONTENT_BY_LOCALE[locale] ?? HE_LAB_CONTENT;
}
