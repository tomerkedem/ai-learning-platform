"use client";

// components/ai-internals/SpeakButton.tsx
//
// כפתור הקראה נקודתי: אייקון רמקול קטן שמקריא טקסט בודד (שאלה, כרטיס תשובה) בקול,
// דרך Web Speech API בלבד - אין קבצי שמע, אין backend, אין TTS חיצוני. משלים את דוק
// "האזנה מודרכת": הדוק מקריא את רצף הפרק, והכפתור הזה נותן ללומד לשמוע פריט בודד
// בהקשר, בלי לאבד את מקומו.
//
// בלעדיות הקראה: לפני כל הקראה משודר אירוע גלובלי שעוצר את הדוק הצף (useReadAloud
// מאזין לו), וכל SpeakButton פעיל אחר נעצר דרך מצביע מודול משותף. לחיצה שנייה עוצרת.
//
// בחירת קול: אותו קול שנשמר לשפה בדוק ההקראה (localStorage), אחרת הקול התואם
// המדורג ראשון לפי אותם כללים (matchVoices / pickVoiceURI המשותפים).
//
// SSR/hydration: תמיכת הדפדפן נבדקת רק אחרי mount. עד אז, וגם בזמן גילוי הקולות כשעוד
// אין קול תואם, הכפתור מרונדר בלתי-נראה (תופס מקום, לא לחיץ) כדי שלא תהיה קפיצת פריסה
// ולא קול בשפה שגויה. בדפדפן ללא תמיכה, או כשאין קול לשפת הדיבור, הוא לא מופיע
// (ההסבר מוצג בדוק ההקראה).

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { useT } from '@/i18n/useT';
import type { Locale } from '@/i18n/config';
import { LOCALE_SPEECH_LANG, matchVoices, pickVoiceURI, voiceCapability } from './readAloudLang';
import { READ_ALOUD_EXCLUSIVE_EVENT, useSpeechVoices } from './useReadAloud';

// ה-SpeakButton הפעיל כרגע (לכל היותר אחד): מצביע לעצירה שלו, לבלעדיות בין כפתורים.
let activeInlineStop: (() => void) | null = null;

export interface SpeakButtonProps {
    /** הטקסט שיוקרא בלחיצה. */
    text: string;
    /** עיצוב מיקום חיצוני (למשל absolute בפינת כרטיס תשובה). */
    className?: string;
    /**
     * שפת הדיבור לטקסט הזה, כשהיא שונה משפת הממשק. שימושי בפרק שהתוכן שלו עדיין
     * fallback לעברית בזמן שהממשק בשפה אחרת: מעבירים כאן את contentLocale כדי
     * שההקראה תדבר בשפת התוכן, לא בשפת הממשק. ברירת מחדל: שפת הממשק הפעילה.
     */
    speechLocale?: Locale;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({ text, className = '', speechLocale }) => {
    const { t, locale } = useT();
    const labels = t.behindAi.aiInternals.readAloud;
    // שפת הדיבור ובחירת הקול נגזרות מ-speechLocale אם הועבר, אחרת משפת הממשק.
    const effectiveLocale = speechLocale ?? locale;

    const [phase, setPhase] = useState<'boot' | 'ready' | 'unsupported'>('boot');
    const [speaking, setSpeaking] = useState(false);
    const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

    // קולות הדפדפן (מתעדכנים דרך voiceschanged) וזמינות קול לשפת הדיבור.
    const { allVoices, settled } = useSpeechVoices(phase === 'ready');
    const lang = LOCALE_SPEECH_LANG[effectiveLocale];
    const matched = matchVoices(allVoices, lang);
    const capability = voiceCapability(allVoices.length, matched.length, settled);
    // ממתינים לגילוי הקולות כשעוד אין קול תואם (רשימה לא יציבה).
    const discovering = capability === 'unknown' && !settled;

    // בדיקת תמיכה בצד הלקוח בלבד (אחרי mount), כדי לא לשבור SSR/hydration.
    useEffect(() => {
        const ok = typeof window !== 'undefined' && 'speechSynthesis' in window;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- סנכרון יכולת דפדפן חיצונית אחרי mount (בטיחות SSR/hydration)
        setPhase(ok ? 'ready' : 'unsupported');
    }, []);

    // עצירת ההקראה של הכפתור הזה בלבד. יציב (deps ריקים) כדי לשמש כמצביע הבלעדיות.
    const stopSpeaking = useCallback(() => {
        if (uttRef.current) {
            uttRef.current = null;
            window.speechSynthesis.cancel();
        }
        setSpeaking(false);
    }, []);

    // ניקוי: אם הכפתור יורד מהעץ באמצע הקראה - עוצרים ומשחררים את הבלעדיות.
    useEffect(() => {
        return () => {
            if (activeInlineStop === stopSpeaking) activeInlineStop = null;
            if (uttRef.current && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                uttRef.current = null;
                window.speechSynthesis.cancel();
            }
        };
    }, [stopSpeaking]);

    const toggle = () => {
        if (phase !== 'ready' || discovering || capability === 'unavailable') return;

        if (speaking) {
            stopSpeaking();
            if (activeInlineStop === stopSpeaking) activeInlineStop = null;
            return;
        }

        // בלעדיות: עוצרים את הדוק הצף (דרך האירוע) וכל כפתור נקודתי אחר לפני שמתחילים.
        window.dispatchEvent(new Event(READ_ALOUD_EXCLUSIVE_EVENT));
        activeInlineStop?.();
        activeInlineStop = stopSpeaking;

        const synth = window.speechSynthesis;
        synth.cancel();

        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = lang;

        // בחירת קול: הקול השמור לשפה (אם עדיין זמין), אחרת התואם המדורג ראשון.
        let stored: string | null = null;
        try {
            stored = window.localStorage.getItem(`bts-readaloud-voice:${effectiveLocale}`);
        } catch {
            stored = null;
        }
        const chosenURI = pickVoiceURI(matched, stored);
        const chosen = matched.find((v) => v.voiceURI === chosenURI);
        if (chosen) utt.voice = chosen;

        // סיום או ביטול (גם ביטול חיצוני ע"י הדוק / כפתור אחר): איפוס, רק אם זו עדיין
        // האמירה שלנו. onerror מכסה דפדפנים שמדווחים ביטול כשגיאה (canceled/interrupted).
        const done = () => {
            if (uttRef.current !== utt) return;
            uttRef.current = null;
            setSpeaking(false);
            if (activeInlineStop === stopSpeaking) activeInlineStop = null;
        };
        utt.onend = done;
        utt.onerror = done;

        uttRef.current = utt;
        setSpeaking(true);
        synth.speak(utt);
    };

    if (phase === 'unsupported' || capability === 'unavailable') return null;

    // boot או גילוי קולות: הכפתור תופס מקום אבל בלתי-נראה ולא לחיץ.
    const waiting = phase === 'boot' || discovering;
    const active = phase === 'ready' && speaking;
    const label = active ? labels.stop : labels.play;

    // יעד מגע 44px בלי לשנות את הגודל הנראה: הכפתור יושב inline ליד כותרות בעשרות מקומות,
    // והגדלת הריבוע עצמו הייתה מזיזה פריסות. לכן שטח ההקשה מורחב בפסאודו שקוף (28+8+8=44).
    // הפסאודו זקוק לאב מוצב. חלק מהקוראים כבר מציבים את הכפתור בעצמם (absolute end-2 top-2),
    // ואסור לדרוס אותם: ב-Tailwind המחלקה relative נוצרת *אחרי* absolute ולכן הייתה מנצחת.
    // לכן relative נוסף רק כשהקורא לא הציב את הכפתור בעצמו.
    const callerPositions = /\b(absolute|fixed|sticky)\b/.test(className);
    const hitArea = `${callerPositions ? '' : 'relative '}after:absolute after:-inset-2 after:content-['']`;

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={label}
            title={label}
            aria-pressed={active}
            tabIndex={waiting ? -1 : 0}
            aria-hidden={waiting || undefined}
            className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bts-focus-ring)] ${hitArea} ${
                active
                    ? 'border-[var(--bts-brand-primary-strong)]/60 bg-[var(--bts-brand-primary)]/15 text-[var(--bts-brand-primary-strong)]'
                    : 'border-[var(--bts-border)] bg-[var(--bts-surface-inset)] text-[var(--bts-text-muted)] hover:border-[var(--bts-brand-primary-strong)]/40 hover:text-[var(--bts-brand-primary-strong)]'
            } ${waiting ? 'invisible' : ''} ${className}`}
        >
            {active ? <Square size={12} aria-hidden /> : <Volume2 size={14} aria-hidden />}
        </button>
    );
};
