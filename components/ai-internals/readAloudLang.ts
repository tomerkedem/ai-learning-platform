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
