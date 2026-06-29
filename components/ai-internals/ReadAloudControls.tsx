"use client";

// components/ai-internals/ReadAloudControls.tsx
//
// פקד הקראה קומפקטי בסגנון זכוכית למבוא ("מאחורי הקלעים של AI"). מבוסס דפדפן בלבד
// (Web Speech API דרך useReadAloud) - אין קבצי שמע, אין backend, אין TTS חיצוני.
//
// הפקד נשען על useReadAloud לכל הלוגיקה, ומציג: כפתור הקראה ראשי, ובזמן הקראה גם
// השהיה/המשך (אם נתמך), עצירה, מעבר בין מקטעים, מד התקדמות, פס "המקטע הנוכחי",
// ומגירת אפשרויות נפתחת עם: מצב היקף (Short/Regular/Full), מהירות קריאה, ובורר קולות
// (כשיש יותר מקול תואם אחד). אין autoplay - הכל ביוזמת המשתמש בלבד.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Volume2, Pause, Play, Square, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import type { Direction } from '@/i18n/config';
import { DUR, EASE, withReduced } from './motionTokens';
import { useReadAloud, type ReadAloudSegment } from './useReadAloud';

/** מצב היקף ההקראה: קצר / רגיל / מלא. רגיל = ה-Core spine (ברירת מחדל). */
export type ReadAloudMode = 'short' | 'regular' | 'full';

/** מהירויות הקריאה הזמינות (speechSynthesis rate). ברירת המחדל היא 1. */
const SPEED_OPTIONS = [0.85, 1, 1.15, 1.3] as const;

const MODE_ORDER: ReadAloudMode[] = ['short', 'regular', 'full'];

export interface ReadAloudLabels {
    /** כותרת הדוק במצב סגור ("האזנה מודרכת"). */
    dock: string;
    play: string;
    pause: string;
    resume: string;
    stop: string;
    prev: string;
    next: string;
    voice: string;
    browserDefault: string;
    settings: string;
    nowReading: string;
    unsupported: string;
    scope: string;
    scopeShort: string;
    scopeRegular: string;
    scopeFull: string;
    speed: string;
}

interface ReadAloudControlsProps {
    /** רשימות המקטעים לכל מצב היקף. המצב הפעיל נבחר בתוך הפקד. */
    segmentsByMode: Record<ReadAloudMode, ReadAloudSegment[]>;
    /** תג שפה BCP-47 לדיבור, למשל he-IL / en-US. */
    lang: string;
    /** ה-locale הפעיל (לזיכרון הקול לכל שפה). */
    locale: string;
    dir: Direction;
    labels: ReadAloudLabels;
    reduce: boolean;
}

export function ReadAloudControls({ segmentsByMode, lang, locale, dir, labels, reduce }: ReadAloudControlsProps) {
    const [mode, setMode] = useState<ReadAloudMode>('regular');
    const [showSettings, setShowSettings] = useState(false);
    const isRtl = dir === 'rtl';

    const segments = segmentsByMode[mode];
    // חתימת איפוס: שינוי ב-locale / שפת דיבור / מצב היקף עוצר הקראה פעילה (תיקון נכונות).
    const resetSignal = `${locale}|${lang}|${mode}`;
    const ra = useReadAloud({ segments, lang, locale, resetSignal });

    const isActive = ra.status === 'speaking' || ra.status === 'paused';
    const current = ra.currentIndex >= 0 ? segments[ra.currentIndex] : null;
    const progressPct = ra.total > 0 && ra.currentIndex >= 0 ? ((ra.currentIndex + 1) / ra.total) * 100 : 0;

    const modeLabel: Record<ReadAloudMode, string> = {
        short: labels.scopeShort,
        regular: labels.scopeRegular,
        full: labels.scopeFull,
    };

    // לפני סיום בדיקת התמיכה בצד הלקוח: שומרים על מבנה זהה ל-SSR (דוק ניטרלי קומפקטי).
    if (!ra.ready) {
        return (
            <div dir={dir} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-1.5 text-sm font-bold text-slate-300 backdrop-blur-xl">
                <Headphones size={16} className="text-cyan-300/80" aria-hidden />
                <span>{labels.dock}</span>
            </div>
        );
    }

    // אין תמיכה ב-speechSynthesis: הודעת נפילה עדינה במקום הפקד.
    if (!ra.supported) {
        return (
            <div dir={dir} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-2.5 text-xs font-medium text-slate-400 backdrop-blur-xl">
                <Volume2 size={15} aria-hidden className="text-slate-500" />
                <span>{labels.unsupported}</span>
            </div>
        );
    }

    const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
    const NextIcon = isRtl ? ChevronLeft : ChevronRight;

    const iconBtn =
        'inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition-colors hover:border-cyan-400/40 hover:text-white disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-slate-200';

    // צ׳יפ נבחר/לא-נבחר למקטעי בקרה (מצב היקף, מהירות).
    const chip = (selected: boolean) =>
        `rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
            selected
                ? 'bg-cyan-500 text-slate-950'
                : 'border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40 hover:text-white'
        }`;

    return (
        <div
            dir={dir}
            className="inline-flex max-w-full flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-start shadow-[0_8px_30px_rgba(2,6,23,0.5)] backdrop-blur-xl"
        >
            {/* שורת הפקדים הראשית */}
            <div className="flex flex-wrap items-center gap-2">
                {!isActive ? (
                    <button
                        type="button"
                        onClick={() => ra.start(0)}
                        aria-label={labels.play}
                        title={labels.play}
                        className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-bold text-slate-200 transition-colors hover:border-cyan-400/40 hover:text-white active:scale-95"
                    >
                        <Headphones size={16} className="text-cyan-300 transition-transform group-hover:scale-110" aria-hidden />
                        {labels.dock}
                    </button>
                ) : (
                    <>
                        {ra.pauseSupported && (
                            ra.status === 'paused' ? (
                                <button type="button" onClick={ra.resume} aria-label={labels.resume} className={iconBtn}>
                                    <Play size={16} aria-hidden />
                                </button>
                            ) : (
                                <button type="button" onClick={ra.pause} aria-label={labels.pause} className={iconBtn}>
                                    <Pause size={16} aria-hidden />
                                </button>
                            )
                        )}
                        <button type="button" onClick={ra.prev} aria-label={labels.prev} disabled={ra.currentIndex <= 0} className={iconBtn}>
                            <PrevIcon size={16} aria-hidden />
                        </button>
                        <button type="button" onClick={ra.next} aria-label={labels.next} disabled={ra.currentIndex >= ra.total - 1} className={iconBtn}>
                            <NextIcon size={16} aria-hidden />
                        </button>
                        <button
                            type="button"
                            onClick={ra.stop}
                            aria-label={labels.stop}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-400/30 bg-rose-500/10 text-rose-200 transition-colors hover:border-rose-400/60 hover:text-rose-100"
                        >
                            <Square size={14} aria-hidden />
                        </button>
                        <span className="ms-1 font-mono text-xs tabular-nums text-slate-400" aria-hidden>
                            {ra.currentIndex + 1}/{ra.total}
                        </span>
                    </>
                )}

                {/* מגירת האפשרויות זמינה תמיד: היקף ומהירות שימושיים גם כשיש קול אחד */}
                <button
                    type="button"
                    onClick={() => setShowSettings((s) => !s)}
                    aria-label={labels.settings}
                    aria-expanded={showSettings}
                    className={`${iconBtn} ms-auto ${showSettings ? 'border-cyan-400/40 text-white' : ''}`}
                >
                    <SlidersHorizontal size={15} aria-hidden />
                </button>
            </div>

            {/* פס המקטע הנוכחי + מד התקדמות (תצוגת "קריאה פעילה") */}
            <AnimatePresence initial={false}>
                {isActive && current && (
                    <motion.div
                        initial={reduce ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                        transition={withReduced(reduce, { duration: DUR.quick, ease: EASE.out })}
                        className="overflow-hidden"
                    >
                        <div className="rounded-xl border border-cyan-500/20 bg-cyan-900/10 p-2.5">
                            <div className="mb-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
                                <motion.div
                                    className="h-full rounded-full bg-cyan-400"
                                    initial={false}
                                    animate={{ width: `${progressPct}%` }}
                                    transition={withReduced(reduce, { duration: DUR.base, ease: EASE.inter })}
                                />
                            </div>
                            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300/70">
                                {labels.nowReading}
                            </span>
                            <p className="mt-0.5 text-[13px] leading-snug text-slate-200 line-clamp-2">{current.label}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* מגירת אפשרויות: היקף, מהירות, ובורר קול (כשיש כמה קולות) */}
            <AnimatePresence initial={false}>
                {showSettings && (
                    <motion.div
                        initial={reduce ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                        transition={withReduced(reduce, { duration: DUR.quick, ease: EASE.out })}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-col gap-3">
                            {/* מצב היקף */}
                            <div>
                                <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{labels.scope}</span>
                                <div className="flex flex-wrap gap-1.5" role="group" aria-label={labels.scope}>
                                    {MODE_ORDER.map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => setMode(m)}
                                            aria-pressed={mode === m}
                                            className={chip(mode === m)}
                                        >
                                            {modeLabel[m]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* מהירות קריאה */}
                            <div>
                                <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{labels.speed}</span>
                                <div className="flex flex-wrap gap-1.5" role="group" aria-label={labels.speed}>
                                    {SPEED_OPTIONS.map((v) => (
                                        <button
                                            key={v}
                                            type="button"
                                            onClick={() => ra.setRate(v)}
                                            aria-pressed={ra.rate === v}
                                            className={`${chip(ra.rate === v)} tabular-nums`}
                                        >
                                            {v}x
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* בורר קול - רק כשיש יותר מקול תואם אחד */}
                            {ra.voices.length > 1 && (
                                <label className="block">
                                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{labels.voice}</span>
                                    <select
                                        value={ra.selectedVoiceURI ?? ''}
                                        onChange={(e) => ra.selectVoice(e.target.value || null)}
                                        className="w-full max-w-full rounded-xl border border-white/10 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 outline-none transition-colors focus:border-cyan-400/50"
                                    >
                                        <option value="">{labels.browserDefault}</option>
                                        {ra.voices.map((v) => (
                                            <option key={v.voiceURI} value={v.voiceURI}>
                                                {v.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* אזור חי לקוראי מסך: מכריז על המקטע הנוכחי */}
            <span className="sr-only" aria-live="polite">
                {isActive && current ? `${labels.nowReading}: ${current.label}` : ''}
            </span>
        </div>
    );
}
