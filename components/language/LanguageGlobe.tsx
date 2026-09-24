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
import type { InteractiveEarth } from './interactiveEarth';
import type { HeaderEarth } from './headerEarth';
import type { LatLon } from './earthRenderingCore';

// נקודות לדוגמה חזותית בלבד: לא דירוג פופולריות, לא גבולות ולא שיוך מלא של שפה למדינה.
// הנקודה הראשונה היא המבט הראשי של הכדור המוקטן בכפתור (נקודה אחת, לא כל האזורים).
const LANGUAGE_POINTS: Record<Locale, readonly LatLon[]> = {
    he: [[31.5, 34.9]],
    en: [[39, -98], [52.5, -1.5], [9, 8]],
    es: [[40, -3.7], [23, -102], [-34, -64]],
    ru: [[55.7, 37.6], [55, 83], [48, 67]],
    ar: [[27, 30], [32, -6], [24, 45]],
    ja: [[36, 138]],
};

// זמן קצר להבהרת הקרניים לפני שהחלון נסגר והשפה מתחלפת. בתנועה מופחתת אין השהיה.
const SELECT_FLASH_MS = 420;

// מעבר פתיחה/סגירה: הכדור הגדול יוצא מהכפתור וחוזר אליו. השפות נגלות אחריו (CSS).
const OPEN_MS = 400;
const CLOSE_MS = 300;
// הכדור הגדול צולם ממרחק 3.85 והמוקטן מ-3.55: באותו גודל מסגרת, הכדור הגדול קטן
// ב-~8%. תמונת הכדור המוקטן מוצגת ב-92% מהמסגרת כדי שהכדורים יחפפו (גם ב-CSS).
const MINI_SPHERE_SCALE = 0.92;
// כל מה שדוהה בסגירה: הרקע והתוכן שנגלה אחרי הכדור.
const FADE_SELECTOR = '.lgs-overlay-bg, .lgs-overlay-title, .lgs-overlay-row, .lgs-overlay-credit, .lgs-overlay-close, .lgs-overlay-beams';

// קשת המסלול של BookForge: y(t) = -APEX * cos(t * π/2), t מ-1- עד 1+. סימטרית, ולכן
// זהה ב-RTL וב-LTR. במובייל הקשת מבוטלת ב-CSS (--lgs-arc-scale: 0).
const APEX_LIFT_PX = 44;
const CENTER = (LOCALE_LIST.length - 1) / 2;
const ARC_Y = LOCALE_LIST.map((_, i) =>
    -Math.round(APEX_LIFT_PX * Math.cos((((i - CENTER) / CENTER) * Math.PI) / 2) * 10) / 10,
);

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** טרנספורם שמניח את הכדור הגדול (לפני טרנספורם) בדיוק על הכדור המוקטן בכפתור. */
const flightFrom = (earthEl: HTMLElement, miniEl: HTMLElement) => {
    const g = miniEl.getBoundingClientRect();
    const r = earthEl.getBoundingClientRect();
    const dx = g.left + g.width / 2 - (r.left + r.width / 2);
    const dy = g.top + g.height / 2 - (r.top + r.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${g.width / (r.width * MINI_SPHERE_SCALE)})`;
};

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
    const miniRef = useRef<HeaderEarth | null>(null);
    const homeRef = useRef<LatLon>(LANGUAGE_POINTS[locale][0]);
    const closingRef = useRef(false);
    const chooseTimerRef = useRef<number | undefined>(undefined);

    const aim = (el: HTMLElement | null) =>
        earthRef.current?.showBeams(el, el ? LANGUAGE_POINTS[el.dataset.locale as Locale] : []);

    // הכדור המוקטן פונה לשפה הפעילה, גם כשהיא מתחלפת בזמן שהסמן מעליו.
    useEffect(() => {
        homeRef.current = LANGUAGE_POINTS[locale][0];
        // בחירה מתוך החלון: הכדור המוקטן מוסתר, ולכן קופץ לאזור החדש לפני שהכדור הגדול חוזר אליו.
        miniRef.current?.setHome(homeRef.current, dialogRef.current?.open);
    }, [locale]);

    // כדור מוקטן בכפתור: מצויר לפי דרישה, ומונפש רק בגרירה ובחזרה לשפה.
    useEffect(() => {
        const el = miniEarthRef.current;
        const trigger = triggerRef.current;
        if (!el || !trigger) return;
        let cancelled = false;
        import('./headerEarth')
            .then(({ createHeaderEarth }) => {
                if (!cancelled) miniRef.current = createHeaderEarth(el, trigger, homeRef.current, prefersReducedMotion());
            })
            .catch(() => {});
        return () => {
            cancelled = true;
            miniRef.current?.destroy();
            miniRef.current = null;
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
                // כשהכדור האמיתי מוכן הוא מכסה את תמונת הכדור המוקטן; מסירים אותה.
                const earth = createInteractiveEarth(el, beams, prefersReducedMotion(), homeRef.current, () => {
                    el.style.backgroundImage = '';
                });
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
        // קליק שסוגר גרירה של הכדור המוקטן אינו בקשה לפתוח את החלון.
        if (!dialog || dialog.open || miniRef.current?.takeDrag()) return;
        dialog.showModal();
        setOpen(true);
        dialog.querySelector<HTMLButtonElement>('[aria-current="true"]')?.focus();
        const earthEl = stageEarthRef.current;
        const miniEl = miniEarthRef.current;
        if (!earthEl || !miniEl || prefersReducedMotion()) return;
        // עד שהכדור הגדול נטען, תמונת הכדור המוקטן היא שיוצאת מהכפתור.
        const shot = miniRef.current?.snapshot();
        if (shot) earthEl.style.backgroundImage = `url(${shot})`;
        earthEl.animate([{ transform: flightFrom(earthEl, miniEl) }, { transform: 'none' }], {
            duration: OPEN_MS,
            easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
        });
    };

    // סגירה מונפשת מכל מצב, גם באמצע הפתיחה: ממשיכה מהמיקום והשקיפות הנוכחיים.
    const closeDialog = useCallback(() => {
        const dialog = dialogRef.current;
        const earthEl = stageEarthRef.current;
        const miniEl = miniEarthRef.current;
        if (!dialog?.open || closingRef.current) return;
        if (!earthEl || !miniEl || prefersReducedMotion()) {
            dialog.close();
            return;
        }
        closingRef.current = true;
        dialog.classList.add('is-closing');
        const fade = { duration: CLOSE_MS, easing: 'ease', fill: 'forwards' } as const;
        dialog.querySelectorAll<HTMLElement>(FADE_SELECTOR).forEach((n) =>
            n.animate([{ opacity: getComputedStyle(n).opacity }, { opacity: 0 }], fade),
        );
        const from = getComputedStyle(earthEl).transform;
        earthEl.getAnimations().forEach((a) => a.cancel()); // מדידה בלי טרנספורם הפתיחה
        earthEl.animate([{ transform: from }, { transform: flightFrom(earthEl, miniEl) }], {
            ...fade,
            easing: 'cubic-bezier(0.4, 0, 0.7, 0.2)',
        }).onfinish = () => dialog.close();
    }, []);

    // הקשה במגע לא מרחפת לפני הבחירה, ולכן הבחירה עצמה גם מכוונת את הקרניים.
    const choose = (l: Locale, el: HTMLElement) => {
        if (chooseTimerRef.current !== undefined || closingRef.current) return;
        aim(el);
        earthRef.current?.flash();
        chooseTimerRef.current = window.setTimeout(() => {
            chooseTimerRef.current = undefined;
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
                // Escape עובר דרך הסגירה המונפשת. אם הדפדפן לא מאפשר לבטל, החלון נסגר מיד ו-onClose מנקה.
                onCancel={(e) => {
                    e.preventDefault();
                    closeDialog();
                }}
                // סגירה בכל דרך (Escape, בחירה, כפתור, רקע): מנקה את המעבר, והפוקוס חוזר לכפתור הפותח.
                // Escape בזמן הבהרת הבחירה מבטל אותה.
                onClose={(e) => {
                    const dialog = e.currentTarget;
                    window.clearTimeout(chooseTimerRef.current);
                    chooseTimerRef.current = undefined;
                    closingRef.current = false;
                    dialog.classList.remove('is-closing');
                    dialog.getAnimations({ subtree: true }).forEach((a) => a.cancel());
                    if (stageEarthRef.current) stageEarthRef.current.style.backgroundImage = '';
                    setOpen(false);
                    triggerRef.current?.focus();
                }}
                // הקשה על הרקע (לא על הבמה) סוגרת בלי לשנות שפה.
                onClick={(e) => {
                    if (e.target === e.currentTarget || (e.target as Element).classList.contains('lgs-overlay-bg')) closeDialog();
                }}
                // מקלדת בתוך החלון לא מגיעה למאזינים גלובליים (למשל מלכודת הפוקוס של מגירת
                // התפריט במובייל), כדי ש-Escape ו-Tab יפעלו על החלון בלבד.
                onKeyDown={(e) => e.stopPropagation()}
            >
                <div className="lgs-overlay-bg" aria-hidden="true" />
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
