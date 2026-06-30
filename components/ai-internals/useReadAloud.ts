"use client";

// components/ai-internals/useReadAloud.ts
//
// הוק הקראה (Read-aloud) מבוסס דפדפן בלבד: Web Speech API (window.speechSynthesis).
// אין כאן קבצי שמע, אין backend, אין TTS חיצוני. ההוק מנגן רשימת מקטעי-טקסט
// (segments) בזה אחר זה, מנהל מצב (idle/speaking/paused/unsupported), בורר קולות
// לפי ה-locale הפעיל, וזוכר את הקול הנבחר ל-locale ב-localStorage כשאפשר.
//
// השימוש ב-window.speechSynthesis קורה רק בתוך effects / event handlers, לעולם לא
// בזמן רינדור, כדי לשמור על בטיחות SSR ו-hydration.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type ReadAloudStatus = 'unsupported' | 'idle' | 'speaking' | 'paused';

/** מקטע הקראה בודד: מזהה יציב + הטקסט שיוקרא. */
export interface ReadAloudSegment {
    id: string;
    /** תווית קצרה לתצוגת "המקטע הנוכחי" (לרוב כותרת או תחילת המשפט). */
    label: string;
    /** הטקסט המלא שיוקרא בקול. */
    text: string;
}

export interface UseReadAloudParams {
    segments: ReadAloudSegment[];
    /** תג שפה BCP-47 לדיבור, למשל he-IL / en-US. */
    lang: string;
    /** ה-locale הפעיל, לשמירת הקול הנבחר בנפרד לכל שפה. */
    locale: string;
    /**
     * חתימה יציבה שמשתנה כשצריך לעצור הקראה פעילה: locale, שפת דיבור, או מצב היקף
     * (scope mode). שינוי בערך הזה עוצר מיד את ההקראה, כדי שלא יקראו מקטעים מהשפה /
     * הרשימה הישנה. ברירת מחדל: מחרוזת קבועה (אין איפוס).
     */
    resetSignal?: string;
}

export interface UseReadAloud {
    status: ReadAloudStatus;
    supported: boolean;
    /** האם בוצעה כבר בדיקת תמיכה בצד הלקוח (למניעת הבהוב/אי-התאמת hydration). */
    ready: boolean;
    pauseSupported: boolean;
    /** הקולות התואמים ל-locale הפעיל (אם יש). */
    voices: SpeechSynthesisVoice[];
    selectedVoiceURI: string | null;
    selectVoice: (voiceURI: string | null) => void;
    /** מהירות הקריאה (speechSynthesis rate). ברירת מחדל 1. */
    rate: number;
    /** קביעת מהירות. אם מקריאים כעת, המקטע הנוכחי מתחיל מחדש במהירות החדשה. */
    setRate: (rate: number) => void;
    /** מדד המקטע הנוכחי (0-based); 1- כשאין הקראה פעילה. */
    currentIndex: number;
    /**
     * טווח התווים של המילה שנאמרת כרגע בתוך text של המקטע הנוכחי (להדגשת קריוקי).
     * null כשאין הקראה פעילה, או כשמנוע הדיבור אינו משדר אירועי boundary (נפילה חיננית).
     */
    wordRange: { start: number; end: number } | null;
    total: number;
    start: (fromIndex?: number) => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    next: () => void;
    prev: () => void;
}

/** מפתח localStorage לקול שנבחר עבור locale נתון. */
function voiceStorageKey(locale: string): string {
    return `bts-readaloud-voice:${locale}`;
}

function readStoredVoice(locale: string): string | null {
    try {
        return window.localStorage.getItem(voiceStorageKey(locale));
    } catch {
        return null;
    }
}

function writeStoredVoice(locale: string, voiceURI: string | null): void {
    try {
        if (voiceURI) window.localStorage.setItem(voiceStorageKey(locale), voiceURI);
        else window.localStorage.removeItem(voiceStorageKey(locale));
    } catch {
        // localStorage חסום (מצב פרטי וכו') - מתעלמים בשקט, הזיכרון פשוט לא יישמר.
    }
}

export function useReadAloud({ segments, lang, locale, resetSignal = '' }: UseReadAloudParams): UseReadAloud {
    const [ready, setReady] = useState(false);
    const [supported, setSupported] = useState(false);
    const [status, setStatus] = useState<ReadAloudStatus>('idle');
    const [pauseSupported, setPauseSupported] = useState(true);
    const [allVoices, setAllVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [wordRange, setWordRange] = useState<{ start: number; end: number } | null>(null);
    const [rate, setRateState] = useState(1);

    // המהירות נקראת בזמן בניית כל utterance. ref כדי שה-handler יראה ערך עדכני מיד.
    const rateRef = useRef(1);

    // ref-ים לבקרת זרימה: מונעים מ-onend לקדם מקטע אחרי עצירה ידנית / החלפה.
    // העדכון נעשה ב-effect (ולא בזמן רינדור) כי הם נקראים רק בתוך handlers / onend.
    const runRef = useRef({ stopped: false, index: -1 });
    const segmentsRef = useRef(segments);
    const langRef = useRef(lang);
    const selectedVoiceRef = useRef<string | null>(selectedVoiceURI);
    useEffect(() => { segmentsRef.current = segments; }, [segments]);
    useEffect(() => { langRef.current = lang; }, [lang]);
    useEffect(() => { selectedVoiceRef.current = selectedVoiceURI; }, [selectedVoiceURI]);

    // בדיקת תמיכה בצד הלקוח בלבד (אחרי mount), כדי לא לשבור SSR/hydration.
    useEffect(() => {
        const ok = typeof window !== 'undefined' && 'speechSynthesis' in window;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- סנכרון יכולת דפדפן חיצונית אחרי mount (בטיחות SSR/hydration)
        setSupported(ok);
        setReady(true);
        if (!ok) setStatus('unsupported');
    }, []);

    // טעינת קולות. ב-Chrome getVoices ריק בקריאה הראשונה ומתמלא דרך voiceschanged.
    useEffect(() => {
        if (!supported) return;
        const synth = window.speechSynthesis;
        const load = () => setAllVoices(synth.getVoices());
        load();
        synth.addEventListener('voiceschanged', load);
        return () => synth.removeEventListener('voiceschanged', load);
    }, [supported]);

    // ניקוי: עצירת כל הקראה כשהרכיב יורד מהעץ.
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                runRef.current.stopped = true;
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const base = useMemo(() => lang.split('-')[0].toLowerCase(), [lang]);

    // הקולות התואמים ל-locale: לפי בסיס השפה (he/en/es/ru/ar/ja). מקדימים קול מקומי
    // (localService) ותאמה מלאה לתג השפה, אחר כך השאר.
    const voices = useMemo(() => {
        const matched = allVoices.filter((v) => v.lang.toLowerCase().startsWith(base));
        return [...matched].sort((a, b) => {
            const aExact = a.lang.toLowerCase() === lang.toLowerCase() ? 0 : 1;
            const bExact = b.lang.toLowerCase() === lang.toLowerCase() ? 0 : 1;
            if (aExact !== bExact) return aExact - bExact;
            const aLocal = a.localService ? 0 : 1;
            const bLocal = b.localService ? 0 : 1;
            return aLocal - bLocal;
        });
    }, [allVoices, base, lang]);

    // בחירת קול ברירת מחדל כש-locale או רשימת הקולות משתנים:
    // 1) קול שמור ל-locale אם הוא עדיין זמין.
    // 2) אם יש קול תואם אחד או יותר - הראשון (המדורג הכי גבוה).
    // 3) אחרת null = קול ברירת המחדל של הדפדפן.
    useEffect(() => {
        if (!supported) return;
        const stored = readStoredVoice(locale);
        const nextVoice = stored && voices.some((v) => v.voiceURI === stored)
            ? stored
            : (voices.length > 0 ? voices[0].voiceURI : null);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- סנכרון בחירת קול מרשימת הקולות החיצונית (speechSynthesis) וה-locale הפעיל
        setSelectedVoiceURI(nextVoice);
    }, [supported, locale, voices]);

    const selectVoice = useCallback(
        (voiceURI: string | null) => {
            setSelectedVoiceURI(voiceURI);
            writeStoredVoice(locale, voiceURI);
        },
        [locale],
    );

    // ref לפונקציית ההקראה, כדי ש-onend יוכל לקרוא למקטע הבא בלי תלות-עצמית (lint).
    const speakIndexRef = useRef<(index: number) => void>(() => {});

    // הקראת מקטע בודד לפי מדד, ושרשור אוטומטי למקטע הבא ב-onend.
    const speakIndex = useCallback(
        (index: number) => {
            if (!('speechSynthesis' in window)) return;
            const list = segmentsRef.current;
            if (index < 0 || index >= list.length) {
                setStatus('idle');
                setCurrentIndex(-1);
                return;
            }
            const synth = window.speechSynthesis;
            runRef.current.stopped = true; // לבטל onend של אמירה קודמת
            synth.cancel();
            runRef.current = { stopped: false, index };

            const text = list[index].text;
            const utt = new SpeechSynthesisUtterance(text);
            utt.lang = langRef.current;
            utt.rate = rateRef.current;
            const chosen = voices.find((v) => v.voiceURI === selectedVoiceRef.current);
            if (chosen) utt.voice = chosen;

            // הדגשת קריוקי: כל אירוע boundary של מילה מעדכן את טווח התווים הנוכחי.
            // charLength לא תמיד נתמך - אז נופלים לסריקת המילה מנקודת ההתחלה. setState
            // בתוך handler (לא ב-effect) - מותר. מנועים שלא משדרים boundary פשוט לא יסמנו.
            utt.onboundary = (e) => {
                if (runRef.current.stopped || runRef.current.index !== index) return;
                if (e.name && e.name !== 'word') return;
                const start = Math.min(Math.max(0, e.charIndex), text.length);
                const len = e.charLength || (/\S+/.exec(text.slice(start))?.[0].length ?? 0);
                if (len > 0) setWordRange({ start, end: start + len });
            };

            utt.onend = () => {
                if (runRef.current.stopped || runRef.current.index !== index) return;
                const nextIndex = index + 1;
                if (nextIndex < segmentsRef.current.length) {
                    speakIndexRef.current(nextIndex);
                } else {
                    setStatus('idle');
                    setCurrentIndex(-1);
                    setWordRange(null);
                    runRef.current.stopped = true;
                }
            };
            utt.onerror = () => {
                if (runRef.current.stopped || runRef.current.index !== index) return;
                setStatus('idle');
                setCurrentIndex(-1);
                setWordRange(null);
                runRef.current.stopped = true;
            };

            setWordRange(null);
            setCurrentIndex(index);
            setStatus('speaking');
            synth.speak(utt);
        },
        [voices],
    );
    useEffect(() => { speakIndexRef.current = speakIndex; }, [speakIndex]);

    const start = useCallback(
        (fromIndex = 0) => {
            if (!supported) return;
            speakIndex(fromIndex);
        },
        [supported, speakIndex],
    );

    const pause = useCallback(() => {
        if (!supported) return;
        const synth = window.speechSynthesis;
        synth.pause();
        setStatus('paused');
        // זיהוי תמיכה: חלק ממנועי המובייל לא מכבדים pause(). בודקים מעט אחרי הקריאה,
        // ואם הדיבור לא נעצר באמת - מסמנים שאין תמיכה ומסתירים pause/resume בהמשך.
        window.setTimeout(() => {
            if (runRef.current.stopped) return;
            if (!window.speechSynthesis.paused) {
                setPauseSupported(false);
                setStatus('speaking');
            }
        }, 250);
    }, [supported]);

    const resume = useCallback(() => {
        if (!supported) return;
        window.speechSynthesis.resume();
        setStatus('speaking');
    }, [supported]);

    const stop = useCallback(() => {
        if (!supported) return;
        runRef.current.stopped = true;
        window.speechSynthesis.cancel();
        setStatus('idle');
        setCurrentIndex(-1);
        setWordRange(null);
    }, [supported]);

    // תיקון נכונות: עצירת הקראה כשמשתנים locale / שפת דיבור / מצב היקף (resetSignal).
    // מדלגים על הריצה הראשונה (mount) כדי לא לעצור לפני שבכלל התחילה הקראה.
    const resetSkipRef = useRef(true);
    useEffect(() => {
        if (resetSkipRef.current) {
            resetSkipRef.current = false;
            return;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect -- עצירת מנוע הדיבור החיצוני (speechSynthesis) כשמשתנה locale/שפה/מצב היקף
        stop();
    }, [resetSignal, stop]);

    // שינוי מהירות תוך כדי הקראה: מתחילים את המקטע הנוכחי מחדש במהירות החדשה.
    // מקטעים עתידיים ממילא ייקראו במהירות העדכנית (rateRef נקרא בבניית כל utterance).
    const setRate = useCallback((value: number) => {
        setRateState(value);
        rateRef.current = value;
        if (!runRef.current.stopped && runRef.current.index >= 0) {
            speakIndexRef.current(runRef.current.index);
        }
    }, []);

    const next = useCallback(() => {
        if (!supported) return;
        const target = (runRef.current.index < 0 ? 0 : runRef.current.index + 1);
        if (target < segmentsRef.current.length) speakIndex(target);
        else stop();
    }, [supported, speakIndex, stop]);

    const prev = useCallback(() => {
        if (!supported) return;
        const target = Math.max(0, (runRef.current.index < 0 ? 0 : runRef.current.index - 1));
        speakIndex(target);
    }, [supported, speakIndex]);

    return {
        status,
        supported,
        ready,
        pauseSupported,
        voices,
        selectedVoiceURI,
        selectVoice,
        rate,
        setRate,
        currentIndex,
        wordRange,
        total: segments.length,
        start,
        pause,
        resume,
        stop,
        next,
        prev,
    };
}
