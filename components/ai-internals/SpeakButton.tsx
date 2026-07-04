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
// המדורג ראשון לפי אותם כללים (התאמה מלאה לתג השפה, ואז קול מקומי).
//
// SSR/hydration: תמיכת הדפדפן נבדקת רק אחרי mount. עד אז הכפתור מרונדר בלתי-נראה
// (תופס מקום, לא לחיץ) כדי שלא תהיה קפיצת פריסה, ובדפדפן ללא תמיכה הוא לא מופיע.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { useT } from '@/i18n/useT';
import { LOCALE_SPEECH_LANG } from './readAloudLang';
import { READ_ALOUD_EXCLUSIVE_EVENT } from './useReadAloud';

// ה-SpeakButton הפעיל כרגע (לכל היותר אחד): מצביע לעצירה שלו, לבלעדיות בין כפתורים.
let activeInlineStop: (() => void) | null = null;

export interface SpeakButtonProps {
    /** הטקסט שיוקרא בלחיצה. */
    text: string;
    /** עיצוב מיקום חיצוני (למשל absolute בפינת כרטיס תשובה). */
    className?: string;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({ text, className = '' }) => {
    const { t, locale } = useT();
    const labels = t.behindAi.aiInternals.readAloud;

    const [phase, setPhase] = useState<'boot' | 'ready' | 'unsupported'>('boot');
    const [speaking, setSpeaking] = useState(false);
    const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

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
        if (phase !== 'ready') return;

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

        const lang = LOCALE_SPEECH_LANG[locale];
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = lang;

        // בחירת קול: הקול השמור לשפה (אם עדיין זמין), אחרת הדירוג של useReadAloud.
        const base = lang.split('-')[0].toLowerCase();
        const matched = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith(base));
        let stored: string | null = null;
        try {
            stored = window.localStorage.getItem(`bts-readaloud-voice:${locale}`);
        } catch {
            stored = null;
        }
        const chosen =
            matched.find((v) => v.voiceURI === stored)
            ?? [...matched].sort((a, b) => {
                const aExact = a.lang.toLowerCase() === lang.toLowerCase() ? 0 : 1;
                const bExact = b.lang.toLowerCase() === lang.toLowerCase() ? 0 : 1;
                if (aExact !== bExact) return aExact - bExact;
                return (a.localService ? 0 : 1) - (b.localService ? 0 : 1);
            })[0];
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

    if (phase === 'unsupported') return null;

    const active = phase === 'ready' && speaking;
    const label = active ? labels.stop : labels.play;

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={label}
            title={label}
            aria-pressed={active}
            tabIndex={phase === 'ready' ? 0 : -1}
            aria-hidden={phase === 'boot' || undefined}
            className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                active
                    ? 'border-cyan-400/60 bg-cyan-500/15 text-cyan-300'
                    : 'border-white/10 bg-slate-950/60 text-slate-400 hover:border-cyan-400/40 hover:text-cyan-200'
            } ${phase === 'boot' ? 'invisible' : ''} ${className}`}
        >
            {active ? <Square size={12} aria-hidden /> : <Volume2 size={14} aria-hidden />}
        </button>
    );
};
