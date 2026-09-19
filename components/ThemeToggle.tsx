"use client";

// components/ThemeToggle.tsx
//
// בורר ערכת-הנושא: System / Light / Dark. פקד-שירות שקט, לא תכונת-מוצר. שלושה
// כפתורי-אייקון בקבוצה אחת (role="radiogroup"), עם aria-label נגיש לכל אחד ותג
// מצב-נבחר (aria-checked, לא צבע בלבד). עובד ב-RTL וב-LTR דרך flex+gap רגילים
// (בלי מרווחים כיווניים קשיחים). יעד-מגע 44px בלי לשנות את הגודל הנראה - אותה
// טכניקת פסאודו-שקוף שב-SpeakButton (after:absolute), כי הפקד יושב בפוטר צר.
//
// ההעדפה גלובלית (ThemeProvider, data-theme על html), אבל רק המבוא הצטרף כרגע
// לערכות בפועל (themeAware) - שאר הלומדה נשארת Dark בלי קשר לבחירה כאן.

import React from 'react';
import { Monitor, Sun, Moon } from 'lucide-react';
import { useTheme, type ThemeMode } from '@/components/ThemeProvider';
import { useT } from '@/i18n/useT';

const MODES: { mode: ThemeMode; Icon: typeof Monitor }[] = [
    { mode: 'system', Icon: Monitor },
    { mode: 'light', Icon: Sun },
    { mode: 'dark', Icon: Moon },
];

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { mode, setMode } = useTheme();
    const { t } = useT();
    const labels = t.chrome.theme;

    return (
        <div
            role="radiogroup"
            aria-label={labels.label}
            className={`inline-flex items-center gap-1 rounded-full border border-[var(--bts-border)] bg-[var(--bts-surface-inset)] p-0.5 ${className}`}
        >
            {MODES.map(({ mode: m, Icon }) => {
                const active = mode === m;
                return (
                    <button
                        key={m}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        aria-label={labels[m]}
                        title={labels[m]}
                        onClick={() => setMode(m)}
                        className={`relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors after:absolute after:-inset-2.5 after:content-[''] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bts-focus-ring)] ${
                            active
                                ? 'bg-[var(--bts-brand-primary)] text-slate-950'
                                : 'text-[var(--bts-text-muted)] hover:text-[var(--bts-text-secondary)]'
                        }`}
                    >
                        <Icon size={14} aria-hidden />
                    </button>
                );
            })}
        </div>
    );
};
