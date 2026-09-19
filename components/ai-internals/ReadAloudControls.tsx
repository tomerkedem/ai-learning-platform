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

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Volume2, Pause, Play, Square, ChevronLeft, ChevronRight, SlidersHorizontal, ListMusic } from 'lucide-react';
import type { Direction } from '@/i18n/config';
import { DUR, EASE, withReduced } from './motionTokens';
import { useReadAloud, type ReadAloudSegment } from './useReadAloud';
import { useReadAloudPin } from './FloatingReadAloud';

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
    /** כותרת מגירת הקטעים / בורר נקודת ההתחלה. */
    sections: string;
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
    /** מצב צף: כשסגור, מתכווץ לאייקון בלבד במובייל (תווית וגלגל ההגדרות מוסתרים מתחת ל-sm). */
    compact?: boolean;
    /** חתימת איפוס נוספת למסכים שבהם התוכן הפעיל משתנה בלי שינוי locale או mode. */
    resetSignal?: string;
    /** מזהה מקטע שאפשר להפעיל ישירות מפעולת למידה חיצונית, למשל Replay לתחנה. */
    playSegmentId?: string;
    /** שינוי החתימה מפעיל את playSegmentId. יש לשנותה רק בעקבות פעולת משתמש. */
    playSignal?: string;
}

export function ReadAloudControls({
    segmentsByMode,
    lang,
    locale,
    dir,
    labels,
    reduce,
    compact = false,
    resetSignal: externalResetSignal = '',
    playSegmentId,
    playSignal = '',
}: ReadAloudControlsProps) {
    const [mode, setMode] = useState<ReadAloudMode>('regular');
    const [showSettings, setShowSettings] = useState(false);
    const [showSections, setShowSections] = useState(false);
    const isRtl = dir === 'rtl';

    const segments = segmentsByMode[mode];
    // חתימת איפוס: שינוי ב-locale / שפת דיבור / מצב היקף עוצר הקראה פעילה (תיקון נכונות).
    const resetSignal = `${locale}|${lang}|${mode}|${externalResetSignal}`;
    const ra = useReadAloud({ segments, lang, locale, resetSignal });
    const { startSingle } = ra;
    const previousPlaySignalRef = useRef(playSignal);

    useEffect(() => {
        if (previousPlaySignalRef.current === playSignal) return;
        previousPlaySignalRef.current = playSignal;
        if (!playSignal) return;
        const index = playSegmentId ? segments.findIndex((segment) => segment.id === playSegmentId) : -1;
        if (index >= 0) startSingle(index);
    }, [playSegmentId, playSignal, segments, startSingle]);

    const isActive = ra.status === 'speaking' || ra.status === 'paused';
    const current = ra.currentIndex >= 0 ? segments[ra.currentIndex] : null;
    const progressPct = ra.total > 0 && ra.currentIndex >= 0 ? ((ra.currentIndex + 1) / ra.total) * 100 : 0;

    // מבקש מה-wrapper הצף להישאר פתוח כל עוד יש הקראה פעילה או מגירה פתוחה (no-op מחוץ אליו).
    useReadAloudPin(isActive || showSettings || showSections);

    // הדגשת קריוקי: טווח התווים של המילה הנאמרת כרגע בתוך טקסט המקטע. נופלים לתווית
    // הקצרה כשאין boundary (מנוע לא תומך / טרם נאמרה מילה).
    const wr = ra.wordRange;
    const karaoke = current && wr && wr.start < current.text.length;

    // גלילה אוטומטית למילה הפעילה בתוך פאנל הקריאה (block:'nearest' מזיז רק את הפאנל).
    const activeWordRef = useRef<HTMLElement | null>(null);
    useEffect(() => {
        activeWordRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    }, [wr?.start, reduce]);

    const modeLabel: Record<ReadAloudMode, string> = {
        short: labels.scopeShort,
        regular: labels.scopeRegular,
        full: labels.scopeFull,
    };

    // לפני סיום בדיקת התמיכה בצד הלקוח: שומרים על מבנה זהה ל-SSR (דוק ניטרלי קומפקטי).
    if (!ra.ready) {
        return (
            <div dir={dir} className="inline-flex items-center gap-2 rounded-2xl border border-[var(--bts-border)] bg-[var(--bts-surface)] px-3 py-1.5 text-sm font-bold text-[var(--bts-text-secondary)] backdrop-blur-xl">
                <Headphones size={16} className="text-[var(--bts-brand-primary-strong)]/80" aria-hidden />
                <span className={compact ? 'max-sm:hidden' : undefined}>{labels.dock}</span>
            </div>
        );
    }

    // אין תמיכה ב-speechSynthesis: הודעת נפילה עדינה במקום הפקד.
    if (!ra.supported) {
        return (
            <div dir={dir} className="inline-flex items-center gap-2 rounded-2xl border border-[var(--bts-border)] bg-[var(--bts-surface-inset)] px-4 py-2.5 text-xs font-medium text-[var(--bts-text-muted)] backdrop-blur-xl">
                <Volume2 size={15} aria-hidden className="text-[var(--bts-text-muted)]" />
                <span>{labels.unsupported}</span>
            </div>
        );
    }

    const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
    const NextIcon = isRtl ? ChevronLeft : ChevronRight;

    const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bts-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bts-focus-ring-offset)]';

    const iconBtn =
        `inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--bts-border)] bg-[var(--bts-surface-inset)] text-[var(--bts-text-secondary)] transition-colors hover:border-[var(--bts-brand-primary-strong)]/40 hover:text-[var(--bts-text-primary)] disabled:opacity-40 disabled:hover:border-[var(--bts-border)] disabled:hover:text-[var(--bts-text-secondary)] ${focusRing}`;

    // צ׳יפ נבחר/לא-נבחר למקטעי בקרה (מצב היקף, מהירות).
    const chip = (selected: boolean) =>
        `rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${focusRing} ${
            selected
                ? 'bg-[var(--bts-brand-primary)] text-slate-950'
                : 'border border-[var(--bts-border)] bg-[var(--bts-surface-inset)] text-[var(--bts-text-secondary)] hover:border-[var(--bts-brand-primary-strong)]/40 hover:text-[var(--bts-text-primary)]'
        }`;

    return (
        <div
            dir={dir}
            className={`inline-flex max-w-full flex-col gap-3 rounded-2xl border border-[var(--bts-border)] bg-[var(--bts-surface)] text-start shadow-[0_8px_30px_rgba(2,6,23,0.5)] [html[data-theme=light]_&]:shadow-none backdrop-blur-xl ${compact && !isActive ? 'p-2 sm:p-3' : 'p-3'}`}
        >
            {/* שורת הפקדים הראשית */}
            <div className="flex flex-wrap items-center gap-2">
                {!isActive ? (
                    <button
                        type="button"
                        onClick={() => ra.start(0)}
                        aria-label={labels.play}
                        title={labels.play}
                        className={`group inline-flex items-center gap-2 rounded-xl border border-[var(--bts-border)] bg-[var(--bts-surface-inset)] px-3 py-1.5 text-sm font-bold text-[var(--bts-text-secondary)] transition-colors hover:border-[var(--bts-brand-primary-strong)]/40 hover:text-[var(--bts-text-primary)] active:scale-95 ${focusRing}`}
                    >
                        <Headphones size={16} className="text-[var(--bts-brand-primary-strong)] transition-transform group-hover:scale-110" aria-hidden />
                        <span className={compact ? 'max-sm:hidden' : undefined}>{labels.dock}</span>
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
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-400/30 bg-rose-500/10 text-[var(--bts-status-danger)] transition-colors hover:border-rose-400/60 hover:text-[var(--bts-status-danger)]"
                        >
                            <Square size={14} aria-hidden />
                        </button>
                        <span className="ms-1 font-mono text-xs tabular-nums text-[var(--bts-text-muted)]" aria-hidden>
                            {ra.currentIndex + 1}/{ra.total}
                        </span>
                    </>
                )}

                {/* בורר קטעים: מאיפה תתחיל ההקראה (גם כשעדיין לא מתנגנת) */}
                <button
                    type="button"
                    onClick={() => { setShowSections((s) => !s); setShowSettings(false); }}
                    aria-label={labels.sections}
                    aria-expanded={showSections}
                    className={`${iconBtn} ms-auto ${showSections ? 'border-[var(--bts-brand-primary-strong)]/40 text-[var(--bts-text-primary)]' : ''} ${compact && !isActive ? 'max-sm:hidden' : ''}`}
                >
                    <ListMusic size={15} aria-hidden />
                </button>

                {/* מגירת האפשרויות זמינה תמיד: היקף ומהירות שימושיים גם כשיש קול אחד */}
                <button
                    type="button"
                    onClick={() => { setShowSettings((s) => !s); setShowSections(false); }}
                    aria-label={labels.settings}
                    aria-expanded={showSettings}
                    className={`${iconBtn} ${showSettings ? 'border-[var(--bts-brand-primary-strong)]/40 text-[var(--bts-text-primary)]' : ''} ${compact && !isActive ? 'max-sm:hidden' : ''}`}
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
                        <div className="rounded-xl border border-[var(--bts-brand-primary)]/20 bg-[var(--bts-surface)] p-2.5">
                            <div className="mb-1.5 h-1 w-full overflow-hidden rounded-full bg-[var(--bts-surface-inset)]">
                                <motion.div
                                    className="h-full rounded-full bg-[var(--bts-brand-primary-strong)]"
                                    initial={false}
                                    animate={{ width: `${progressPct}%` }}
                                    transition={withReduced(reduce, { duration: DUR.base, ease: EASE.inter })}
                                />
                            </div>
                            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--bts-brand-primary-strong)]/70">
                                {labels.nowReading}
                            </span>
                            {karaoke && current ? (
                                <p dir={dir} className="mt-1 max-h-24 overflow-y-auto overscroll-contain text-[13px] leading-relaxed text-start">
                                    <span className="text-[var(--bts-text-muted)]">{current.text.slice(0, wr!.start)}</span>
                                    <motion.span
                                        key={wr!.start}
                                        ref={activeWordRef}
                                        initial={reduce ? false : { opacity: 0.55, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={reduce ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }}
                                        className="mx-[1px] inline-block rounded-md bg-[var(--bts-brand-primary)]/25 px-1 font-bold text-[var(--bts-brand-primary-strong)] shadow-[0_0_14px_rgba(34,211,238,0.5)]"
                                    >
                                        {current.text.slice(wr!.start, wr!.end)}
                                    </motion.span>
                                    <span className="text-[var(--bts-text-secondary)]">{current.text.slice(wr!.end)}</span>
                                </p>
                            ) : (
                                <p className="mt-0.5 text-[13px] leading-snug text-[var(--bts-text-secondary)] line-clamp-2">{current.label}</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* מגירת קטעים: בחירת נקודת ההתחלה. לחיצה מתחילה הקראה מאותו קטע. */}
            <AnimatePresence initial={false}>
                {showSections && (
                    <motion.div
                        initial={reduce ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                        transition={withReduced(reduce, { duration: DUR.quick, ease: EASE.out })}
                        className="overflow-hidden"
                    >
                        <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--bts-text-muted)]">{labels.sections}</span>
                        <div className="flex max-h-48 flex-col gap-1 overflow-y-auto overscroll-contain" role="group" aria-label={labels.sections}>
                            {segments.map((s, i) => {
                                const isCur = i === ra.currentIndex;
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => { ra.start(i); setShowSections(false); }}
                                        aria-current={isCur ? 'true' : undefined}
                                        className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-start text-xs transition-colors ${focusRing} ${isCur ? 'bg-[var(--bts-brand-primary)]/15 font-bold text-[var(--bts-brand-primary-strong)]' : 'text-[var(--bts-text-secondary)] hover:bg-[var(--bts-surface-inset)]'}`}
                                    >
                                        <span className="w-5 shrink-0 font-mono text-[10px] tabular-nums text-[var(--bts-text-muted)]">{i + 1}</span>
                                        <span className="truncate">{s.label}</span>
                                    </button>
                                );
                            })}
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
                                <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--bts-text-muted)]">{labels.scope}</span>
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
                                <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--bts-text-muted)]">{labels.speed}</span>
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
                                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--bts-text-muted)]">{labels.voice}</span>
                                    <select
                                        value={ra.selectedVoiceURI ?? ''}
                                        onChange={(e) => ra.selectVoice(e.target.value || null)}
                                        className="w-full max-w-full rounded-xl border border-[var(--bts-border)] bg-[var(--bts-surface-inset)] px-3 py-2 text-sm text-[var(--bts-text-primary)] outline-none transition-colors focus:border-[var(--bts-brand-primary-strong)]/50"
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
