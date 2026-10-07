// components/ai-internals/readAloudLang.ts
//
// מיפוי locale -> תג שפה BCP-47 לדיבור (Web Speech API), משותף לכל הפרקים שמשתמשים
// ב-ReadAloudControls. מבני, לא ניתן לתרגום. ערבית נשארת בסיסית (ar) כי זמינות קולות
// אזוריים אינה עקבית בין דפדפנים. ההקראה עצמה רצה בדפדפן בלבד: אין קבצי שמע, אין
// backend, אין TTS חיצוני.

import type { Locale } from '@/i18n/config';

export const LOCALE_SPEECH_LANG: Record<Locale, string> = {
    he: 'he-IL',
    en: 'en-US',
    es: 'es-ES',
    ru: 'ru-RU',
    ar: 'ar',
    ja: 'ja-JP',
};

/** השדות שבחירת הקול נשענת עליהם (תת-קבוצה של SpeechSynthesisVoice, לבדיקות טהורות). */
export type VoiceLike = Pick<SpeechSynthesisVoice, 'lang' | 'localService' | 'voiceURI'>;

/** מצב זמינות קול לשפת הדיבור: עדיין לא ידוע / יש קול מתאים / אין קול מתאים. */
export type VoiceCapability = 'unknown' | 'available' | 'unavailable';

/**
 * חלון שקט אחרי טעינת הקולות האחרונה (voiceschanged) שאחריו רשימת הקולות נחשבת יציבה.
 * דפדפנים (למשל Edge) טוענים קולות בכמה מנות, ובלי חלון כזה הודעת "אין קול" הייתה מהבהבת.
 */
export const VOICE_SETTLE_MS = 1500;

/** תג שפה מנורמל להשוואה: אותיות קטנות, '_' כמו '-' (en_US = en-US). */
function normalizeTag(tag: string): string {
    return tag.toLowerCase().replace(/_/g, '-');
}

/**
 * הקולות התואמים לשפת הדיבור לפי בסיס השפה (he/en/es/ru/ar/ja). מקדימים התאמה מלאה
 * לתג השפה, ואחר כך קול מקומי (localService) על פני קול רשת.
 */
export function matchVoices<V extends VoiceLike>(all: readonly V[], lang: string): V[] {
    const tag = normalizeTag(lang);
    const base = tag.split('-')[0];
    const rank = (v: V) => (normalizeTag(v.lang) === tag ? 0 : 2) + (v.localService ? 0 : 1);
    return all.filter((v) => normalizeTag(v.lang).split('-')[0] === base).sort((a, b) => rank(a) - rank(b));
}

/** הקול השמור אם הוא עדיין בין התואמים, אחרת התואם המדורג ראשון, אחרת null. */
export function pickVoiceURI(matched: readonly VoiceLike[], storedURI: string | null): string | null {
    if (storedURI && matched.some((v) => v.voiceURI === storedURI)) return storedURI;
    return matched[0]?.voiceURI ?? null;
}

/**
 * זמינות קול: available ברגע שיש קול תואם. unavailable רק כשהרשימה יציבה (settled),
 * לא ריקה, ואין בה אף קול תואם. רשימה ריקה לעולם אינה unavailable: יש דפדפנים שמחזירים
 * רשימה ריקה ועדיין מדברים לפי utt.lang.
 */
export function voiceCapability(allCount: number, matchedCount: number, settled: boolean): VoiceCapability {
    if (matchedCount > 0) return 'available';
    if (!settled || allCount === 0) return 'unknown';
    return 'unavailable';
}

/**
 * האם ההקראה תיפול לקול בשפה שגויה ידועה: יש קולות ברשימה, אבל אף אחד לא מתאים.
 * במצב כזה לא קוראים ל-speak() (גם לפני שהרשימה התייצבה).
 */
export function knownWrongLanguage(allCount: number, matchedCount: number): boolean {
    return allCount > 0 && matchedCount === 0;
}
