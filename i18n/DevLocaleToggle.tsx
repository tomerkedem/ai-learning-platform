"use client";

// i18n/DevLocaleToggle.tsx
//
// בורר שפה לפיתוח/בדיקות בלבד. מוצג רק כש-NODE_ENV === 'development', ולכן
// אינו קיים בפרודקשן. אינו אמור להיראות כמו מחליף שפה רשמי: פקד קטן ומסומן
// DEV בפינה. מקבל את ה-locale וה-setter כ-props (בלי context) כדי למנוע
// תלות מעגלית עם ה-Provider.

import React from 'react';
import { LOCALE_LIST, LOCALES, type Locale } from './config';

interface DevLocaleToggleProps {
    locale: Locale;
    setLocale: (l: Locale) => void;
}

export function DevLocaleToggle({ locale, setLocale }: DevLocaleToggleProps) {
    if (process.env.NODE_ENV !== 'development') return null;

    return (
        <div
            dir="ltr"
            style={{
                position: 'fixed',
                bottom: 6,
                left: 6,
                zIndex: 2147483647,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 6px',
                borderRadius: 6,
                background: 'rgba(2,6,23,0.85)',
                border: '1px solid rgba(148,163,184,0.35)',
                font: '10px/1.2 monospace',
                color: '#94a3b8',
                opacity: 0.65,
                pointerEvents: 'auto',
            }}
            title="Dev-only locale switcher (not shown in production)"
        >
            <span style={{ letterSpacing: '0.08em' }}>DEV i18n</span>
            <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                style={{ background: 'transparent', color: '#e2e8f0', border: 'none', font: 'inherit', cursor: 'pointer' }}
            >
                {LOCALE_LIST.map((l) => (
                    <option key={l} value={l} style={{ color: '#000' }}>
                        {l} · {LOCALES[l].label}
                    </option>
                ))}
            </select>
        </div>
    );
}
