"use client";

// components/language/LanguageGlobe.tsx
//
// בורר השפה של הלומדה: כפתור עם כדור ארץ מוקטן, ושכבה עם כדור ארץ גדול ושש שפות בשמן
// המקורי. העיצוב הועתק מ-LanguageGlobeSelector של BookForge (רקע חלל מטושטש, גלולות זכוכית
// בזהב/שמנת על קשת מסלול, נקודת זהב מתחת לשפה הנוכחית). אין דגלים, סיכות מדינה, קואורדינטות
// או תוויות אזור: הכדור מייצג עולם רב-לשוני, לא שיוך של שפה למדינה.
//
// הרכיב מציג בלבד ובוחר דרך setLocale; פתרון השפה נמצא ב-i18n/config.ts וב-requestLocale.ts.
// נגישות: <dialog> מודאלי מקורי (showModal) מספק מלכודת פוקוס, inert לשאר הדף ו-Escape.
// הפוקוס נכנס לשפה הנוכחית ונחזר לכפתור בסגירה. כל שם שפה נושא lang ו-dir משלו.
// three.js נטען בדינמיות (צ'אנק נפרד) ורק בדפדפן; כשל WebGL משאיר דיסק כהה ניטרלי.

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { useT } from '@/i18n/useT';
import { LOCALES, LOCALE_LIST, type Locale } from '@/i18n/config';

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
        if (!open || !el) return;
        let destroy: (() => void) | undefined;
        let cancelled = false;
        import('./interactiveEarth')
            .then(({ createInteractiveEarth }) => {
                if (!cancelled) destroy = createInteractiveEarth(el, prefersReducedMotion());
            })
            .catch(() => {});
        return () => {
            cancelled = true;
            destroy?.();
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

    const choose = (l: Locale) => {
        if (l !== locale) setLocale(l);
        closeDialog();
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
                                            onClick={() => choose(l)}
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

                <button type="button" className="lgs-overlay-close" aria-label={copy.close} title={copy.close} onClick={closeDialog}>
                    <X size={18} aria-hidden="true" />
                </button>
            </dialog>
        </>
    );
}
