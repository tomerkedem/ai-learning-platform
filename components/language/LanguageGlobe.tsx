"use client";

// components/language/LanguageGlobe.tsx
//
// בורר השפה של הלומדה: כפתור עם כדור ארץ מוקטן, ושכבה עם כדור ארץ גדול ושש שפות בשמן
// המקורי. העיצוב הועתק מ-LanguageGlobeSelector של BookForge (רקע חלל מטושטש, גלולות זכוכית
// בזהב/שמנת על קשת מסלול, נקודת זהב מתחת לשפה הנוכחית). אין דגלים, שמות מדינות או תוויות אזור.
// בריחוף, בפוקוס או בהקשה יוצאות קרני אור מהשפה לנקודות לדוגמה על הכדור (LANGUAGE_POINTS).
//
// הרכיב מציג בלבד ובוחר דרך setLocale; פתרון השפה נמצא ב-i18n/config.ts וב-requestLocale.ts.
// נגישות: <dialog> מודאלי מקורי (showModal) מספק מלכודת פוקוס, inert לשאר הדף ו-Escape.
// הפוקוס נכנס לשפה הנוכחית ונחזר לכפתור בסגירה. כל שם שפה נושא lang ו-dir משלו.
// three.js נטען בדינמיות (צ'אנק נפרד) ורק בדפדפן; כשל WebGL משאיר דיסק כהה ניטרלי.

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { useT } from '@/i18n/useT';
import { LOCALES, LOCALE_LIST, type Locale } from '@/i18n/config';
import type { InteractiveEarth, LatLon } from './interactiveEarth';

// נקודות לדוגמה חזותית בלבד: לא דירוג פופולריות, לא גבולות ולא שיוך מלא של שפה למדינה.
const LANGUAGE_POINTS: Record<Locale, readonly LatLon[]> = {
    he: [[31.5, 34.9]],
    en: [[39, -98], [52.5, -1.5], [9, 8]],
    es: [[40, -3.7], [23, -102], [-34, -64]],
    ru: [[55.7, 37.6], [55, 83], [48, 67]],
    ar: [[32, -6], [27, 30], [24, 45]],
    ja: [[36, 138]],
};

// זמן קצר להבהרת הקרניים לפני שהחלון נסגר והשפה מתחלפת. בתנועה מופחתת אין השהיה.
const SELECT_FLASH_MS = 420;

// קשת המסלול של BookForge: y(t) = -APEX * cos(t * π/2), t מ-1- עד 1+. סימטרית, ולכן
// זהה ב-RTL וב-LTR. במובייל הקשת מבוטלת ב-CSS (--lgs-arc-scale: 0).
const APEX_LIFT_PX = 44;
const CENTER = (LOCALE_LIST.length - 1) / 2;
const ARC_Y = LOCALE_LIST.map((_, i) =>
    -Math.round(APEX_LIFT_PX * Math.cos((((i - CENTER) / CENTER) * Math.PI) / 2) * 10) / 10,
);

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function LanguageGlobe() {
    const { locale, dir, setLocale, t } = useT();
    const copy = t.chrome.language;
    const [open, setOpen] = useState(false);
    const titleId = useId();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const miniEarthRef = useRef<HTMLSpanElement>(null);
    const stageEarthRef = useRef<HTMLDivElement>(null);
    const beamsRef = useRef<SVGSVGElement>(null);
    const earthRef = useRef<InteractiveEarth | null>(null);

    const aim = (el: HTMLElement | null) =>
        earthRef.current?.showBeams(el, el ? LANGUAGE_POINTS[el.dataset.locale as Locale] : []);

    // כדור מוקטן בכפתור: מצויר פעם אחת (אין לולאה), ולכן אין תנועה ואין מה לכבות.
    useEffect(() => {
        const el = miniEarthRef.current;
        if (!el) return;
        let destroy: (() => void) | undefined;
        let cancelled = false;
        import('./headerEarth')
            .then(({ createHeaderEarth }) => {
                if (!cancelled) destroy = createHeaderEarth(el);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
            destroy?.();
        };
    }, []);

    // כדור גדול: קיים רק כשהחלון פתוח, ומשוחרר (WebGL, לולאה, מאזינים) בסגירה.
    useEffect(() => {
        const el = stageEarthRef.current;
        const beams = beamsRef.current;
        if (!open || !el || !beams) return;
        let cancelled = false;
        import('./interactiveEarth')
            .then(({ createInteractiveEarth }) => {
                if (cancelled) return;
                const earth = createInteractiveEarth(el, beams, prefersReducedMotion());
                earthRef.current = earth;
                // הפוקוס כבר בשפה הנוכחית כשהכדור נטען: הקרניים מתחילות ממנה.
                const focused = beams.parentElement?.querySelector<HTMLElement>('.lgs-overlay-option:focus');
                if (focused) earth.showBeams(focused, LANGUAGE_POINTS[focused.dataset.locale as Locale]);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
            earthRef.current?.destroy();
            earthRef.current = null;
        };
    }, [open]);

    const openDialog = () => {
        const dialog = dialogRef.current;
        if (!dialog || dialog.open) return;
        dialog.showModal();
        setOpen(true);
        dialog.querySelector<HTMLButtonElement>('[aria-current="true"]')?.focus();
    };

    const closeDialog = useCallback(() => dialogRef.current?.close(), []);

    // הקשה במגע לא מרחפת לפני הבחירה, ולכן הבחירה עצמה גם מכוונת את הקרניים.
    const choose = (l: Locale, el: HTMLElement) => {
        aim(el);
        earthRef.current?.flash();
        window.setTimeout(() => {
            if (l !== locale) setLocale(l);
            closeDialog();
        }, prefersReducedMotion() ? 0 : SELECT_FLASH_MS);
    };

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                className="lgs-trigger"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-label={`${copy.label}: ${LOCALES[locale].label}`}
                title={copy.change}
                onClick={openDialog}
            >
                <span ref={miniEarthRef} className="lgs-globe" aria-hidden="true" />
            </button>

            <dialog
                ref={dialogRef}
                className="lgs-overlay"
                dir={dir}
                aria-labelledby={titleId}
                // סגירה בכל דרך (Escape, בחירה, כפתור, רקע): הפוקוס חוזר לכפתור הפותח.
                onClose={() => {
                    setOpen(false);
                    triggerRef.current?.focus();
                }}
                // הקשה על הרקע (האלמנט עצמו, לא הבמה) סוגרת בלי לשנות שפה.
                onClick={(e) => {
                    if (e.target === e.currentTarget) closeDialog();
                }}
                // מקלדת בתוך החלון לא מגיעה למאזינים גלובליים (למשל מלכודת הפוקוס של מגירת
                // התפריט במובייל), כדי ש-Escape ו-Tab יפעלו על החלון בלבד.
                onKeyDown={(e) => e.stopPropagation()}
            >
                <div className="lgs-overlay-stage">
                    <h2 id={titleId} className="lgs-overlay-title">{copy.dialogTitle}</h2>

                    <div className="lgs-overlay-row">
                        <svg className="lgs-overlay-orbit" aria-hidden="true" viewBox="0 0 1000 100" preserveAspectRatio="none" focusable="false">
                            <path
                                d="M 0 100 Q 500 0 1000 100"
                                fill="none"
                                stroke="rgba(244, 226, 170, 0.32)"
                                strokeWidth="1.1"
                                strokeLinecap="round"
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>
                        <ul className="lgs-overlay-list">
                            {LOCALE_LIST.map((l, i) => {
                                const active = l === locale;
                                return (
                                    <li key={l} className="lgs-overlay-item">
                                        <button
                                            type="button"
                                            lang={LOCALES[l].htmlLang}
                                            dir={LOCALES[l].dir}
                                            aria-current={active ? 'true' : undefined}
                                            className={`lgs-overlay-option${active ? ' is-active' : ''}`}
                                            style={{ '--lgs-arc-y': `${ARC_Y[i]}px` } as React.CSSProperties}
                                            data-locale={l}
                                            onPointerOver={(e) => aim(e.currentTarget)}
                                            onPointerLeave={() =>
                                                aim(document.activeElement?.matches('.lgs-overlay-option') ? (document.activeElement as HTMLElement) : null)
                                            }
                                            onFocus={(e) => aim(e.currentTarget)}
                                            onBlur={() => aim(null)}
                                            onClick={(e) => choose(l, e.currentTarget)}
                                        >
                                            <span className="lgs-overlay-native">{LOCALES[l].label}</span>
                                            {active && (
                                                <span className="lgs-overlay-check" aria-hidden="true">
                                                    <Check size={9} strokeWidth={4} />
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div ref={stageEarthRef} className="lgs-overlay-earth" aria-hidden="true" />
                    <p className="lgs-overlay-credit">{copy.imageCredit}</p>
                </div>

                {/* אחרי הבמה: מעל הכדור (contain: paint יוצר שכבה משלו) ומתחת לשורת השפות. */}
                <svg ref={beamsRef} className="lgs-overlay-beams" aria-hidden="true" focusable="false" />

                <button type="button" className="lgs-overlay-close" aria-label={copy.close} title={copy.close} onClick={closeDialog}>
                    <X size={18} aria-hidden="true" />
                </button>
            </dialog>
        </>
    );
}
