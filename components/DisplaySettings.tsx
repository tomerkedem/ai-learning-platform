"use client";

// components/DisplaySettings.tsx
//
// חלון "נגישות ותצוגה": גודל טקסט, ריווח קריאה, ניגודיות גבוהה יותר, הפחתת תנועה וקו
// תחתון לקישורים. פקד-שירות שקט בפוטר הסרגל, לצד בורר הערכה והשפה. לא נפתח לבד ולא מקריא.
//
// ההעדפות נשמרות במכשיר בלבד (localStorage, bts-display) ומוחלות כמאפייני data-* על <html>.
// העיצוב עצמו ב-globals.css. בלי מאפיין אין שום שינוי, ולכן ברירת המחדל זהה למראה הקיים.
// סקריפט הטרום-ציור ב-RootDocument.tsx מחיל את אותם מאפיינים לפני הציור הראשון; אם
// המבנה משתנה, יש לעדכן את שני המקומות.
//
// נגישות: <dialog> מקורי (showModal) כמו ב-LanguageGlobe: מלכודת פוקוס, inert ו-Escape
// מהדפדפן. הפוקוס חוזר לכפתור בסגירה. מלכודת המקלדת של מגירת המובייל מדלגת כשחלון פתוח.

import React, { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Accessibility, Check, RotateCcw, X } from 'lucide-react';
import { syncReducedMotion } from '@/components/reducedMotion';
import { useT } from '@/i18n/useT';

const STORAGE_KEY = 'bts-display';

type Size = 'default' | 'lg' | 'xl';
interface Prefs {
    size: Size;
    spacing: boolean;
    contrast: boolean;
    motion: boolean;
    underline: boolean;
}
const DEFAULTS: Prefs = { size: 'default', spacing: false, contrast: false, motion: false, underline: false };

/** קריאה בטוחה: אחסון חסום או ערך לא תקין נופלים לברירת המחדל. */
function readPrefs(): Prefs {
    try {
        const p = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}');
        return {
            size: p.size === 'lg' || p.size === 'xl' ? p.size : 'default',
            spacing: p.spacing === true,
            contrast: p.contrast === true,
            motion: p.motion === true,
            underline: p.underline === true,
        };
    } catch {
        return DEFAULTS;
    }
}

function applyPrefs(p: Prefs) {
    const el = document.documentElement;
    const set = (name: string, value: string | false) => (value ? el.setAttribute(name, value) : el.removeAttribute(name));
    set('data-text-size', p.size !== 'default' && p.size);
    set('data-reading-spacing', p.spacing && 'on');
    set('data-contrast', p.contrast && 'more');
    set('data-reduce-motion', p.motion && 'on');
    set('data-underline-links', p.underline && 'on');
    // החלטת התנועה המשותפת (מערכת ההפעלה או הבחירה כאן). ראו components/reducedMotion.ts.
    syncReducedMotion();
}

const SIZES: Size[] = ['default', 'lg', 'xl'];
const TOGGLES = ['spacing', 'contrast', 'motion', 'underline'] as const;

export function DisplaySettings() {
    const { dir, t } = useT();
    const d = t.chrome.display;
    const pathname = usePathname();
    const id = useId();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
    const [osReducesMotion, setOsReducesMotion] = useState(false);

    const openDialog = () => {
        setPrefs(readPrefs());
        setOsReducesMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        dialogRef.current?.showModal();
    };
    const closeDialog = () => dialogRef.current?.close();

    const update = (patch: Partial<Prefs>) => {
        const next = { ...prefs, ...patch };
        setPrefs(next);
        applyPrefs(next);
        try {
            const changed = Object.fromEntries(Object.entries(next).filter(([k, v]) => v !== DEFAULTS[k as keyof Prefs]));
            if (Object.keys(changed).length) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(changed));
            else window.localStorage.removeItem(STORAGE_KEY);
        } catch {
            // אחסון חסום: ההעדפה תקפה לעמוד הנוכחי בלבד.
        }
    };

    const sizeLabel = { default: d.sizeDefault, lg: d.sizeLarge, xl: d.sizeLarger };
    const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bts-focus-ring)]';

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                aria-haspopup="dialog"
                aria-label={d.open}
                title={d.open}
                onClick={openDialog}
                // מזוהה בלי לתפוס את מקום הפעולה הראשית: אייקון הנגישות האוניברסלי (הסימן שאינו צבע),
                // מסגרת מלאה בצבע המותג (3:1 לפחות מול המשטח בשתי הערכות) ומילוי עדין בלבד.
                // ריחוף ולחיצה מעמיקים את המילוי; הפוקוס נשאר טבעת focusRing.
                className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--bts-brand-primary)] bg-[color-mix(in_oklab,var(--bts-brand-primary)_12%,transparent)] text-[var(--bts-brand-primary-strong)] transition-colors hover:bg-[color-mix(in_oklab,var(--bts-brand-primary)_22%,transparent)] hover:text-[var(--bts-text-primary)] active:bg-[color-mix(in_oklab,var(--bts-brand-primary)_32%,transparent)] after:absolute after:-inset-1 after:content-[''] ${focusRing} focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bts-focus-ring-offset)]`}
            >
                <Accessibility size={23} strokeWidth={2.1} aria-hidden />
            </button>

            <dialog
                ref={dialogRef}
                dir={dir}
                aria-labelledby={`${id}-title`}
                onClose={() => triggerRef.current?.focus()}
                // הקשה על הרקע (מחוץ לכרטיס) סוגרת.
                onClick={(e) => e.target === e.currentTarget && closeDialog()}
                className="m-auto w-[min(92vw,24rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-[var(--bts-border-emphasis)] bg-[var(--bts-page)] p-0 text-start text-[var(--bts-text-primary)] shadow-2xl backdrop:bg-black/60"
            >
                <div className="bg-[var(--bts-surface-elevated)] p-5">
                    <div className="flex items-center justify-between gap-3">
                        <h2 id={`${id}-title`} className="text-base font-black">{d.title}</h2>
                        <button
                            type="button"
                            onClick={closeDialog}
                            aria-label={d.close}
                            title={d.close}
                            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--bts-text-muted)] hover:text-[var(--bts-text-primary)] ${focusRing}`}
                        >
                            <X size={18} aria-hidden />
                        </button>
                    </div>

                    <fieldset className="mt-4">
                        <legend className="text-xs font-bold text-[var(--bts-text-secondary)]">{d.textSize}</legend>
                        <div className="mt-2 grid grid-cols-3 gap-1.5">
                            {SIZES.map((s) => (
                                <label key={s} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`${id}-size`}
                                        value={s}
                                        checked={prefs.size === s}
                                        onChange={() => update({ size: s })}
                                        className="peer sr-only"
                                    />
                                    <span className="flex min-h-10 items-center justify-center gap-1 rounded-lg border border-[var(--bts-border)] px-2 py-1.5 text-center text-xs font-bold text-[var(--bts-text-secondary)] peer-checked:border-[var(--bts-brand-primary)] peer-checked:bg-[var(--bts-sub-fill)] peer-checked:text-[var(--bts-text-primary)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--bts-focus-ring)]">
                                        {prefs.size === s && <Check size={13} aria-hidden className="shrink-0" />}
                                        {sizeLabel[s]}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <div className="mt-4 space-y-1">
                        {TOGGLES.map((k) => (
                            <div key={k}>
                                <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-[var(--bts-fill-soft)]">
                                    <input
                                        type="checkbox"
                                        checked={prefs[k]}
                                        onChange={(e) => update({ [k]: e.target.checked })}
                                        aria-describedby={k === 'motion' && osReducesMotion ? `${id}-motion-note` : undefined}
                                        className="h-4 w-4 shrink-0 accent-[var(--bts-brand-primary)]"
                                    />
                                    <span className="text-sm text-[var(--bts-text-secondary)]">{d[k]}</span>
                                </label>
                                {k === 'motion' && osReducesMotion && (
                                    <p id={`${id}-motion-note`} className="ps-9 pe-2 text-xs leading-relaxed text-[var(--bts-text-muted)]">
                                        {d.motionSystem}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--bts-border)] pt-4">
                        <button
                            type="button"
                            onClick={() => update(DEFAULTS)}
                            className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[var(--bts-border)] bg-[var(--bts-sub-fill-soft)] px-3 py-1.5 text-xs font-bold text-[var(--bts-text-secondary)] hover:bg-[var(--bts-sub-fill-hover)] ${focusRing}`}
                        >
                            <RotateCcw size={13} aria-hidden />
                            {d.reset}
                        </button>
                        {pathname?.startsWith('/behind-the-scenes-ai') && (
                            <Link
                                href="/behind-the-scenes-ai/accessibility"
                                onClick={closeDialog}
                                className={`text-xs font-bold text-[var(--bts-brand-primary-strong)] underline underline-offset-4 ${focusRing}`}
                            >
                                {d.statement}
                            </Link>
                        )}
                    </div>
                </div>
            </dialog>
        </>
    );
}
