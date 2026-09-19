"use client";

// ────────────────────────────────────────────────────────────────────────
// GuessButton - הכפתור הקנוני של לומדת "מאחורי הקלעים של AI".
//
// זהו סטנדרט קורסי: כל כפתור פעולה בקורס צריך להשתמש ברכיב הזה, כדי שכל הכפתורים
// יראו וירגישו זהה. שפת עיצוב "gradient-border glass" שמהדהדת את המסגרת החיה של
// פאנל המשוב (ShimmerFrame): מלבן עם פינות רכות מתונות, מסגרת גרדיאנט accent דקה
// ושלמה (טכניקת padding), מילוי זכוכיתי כהה עם רמז accent, הבהקה עליונה, זוהר
// חיצוני, הרמה בהובר, לחיצה מיקרו וסריקת-אור אופציונלית.
//
// variant='primary' - פעולה ראשית (המשך, בדקו, נסו, התחילו).
// variant='ghost'   - קישור עדין עם קו-תחתון שנפתח בהובר (נסו שוב, דלגו).
// href              - אם מועבר, מרונדר כ-Link של next עם אותו עיצוב (לניווט פרקים).
// rgb קובע את גוון ה-accent (ברירת מחדל אמרלד). דוגמאות: אמרלד '16,185,129',
// ציאן '34,211,238', סגול '168,85,247', כתום '245,158,11'.
//
// נגישות: טבעת פוקוס דרך outline (לא נחתכת). reduced-motion: בלי הרמה, זוהר-דינמי
// וסריקה. אין מקף ארוך, מקף בינוני או נקודה-פסיק בטקסט עברית.
// ────────────────────────────────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export type GuessButtonVariant = 'primary' | 'ghost';

export interface GuessButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    variant?: GuessButtonVariant;
    /** אם מועבר, הכפתור מרונדר כ-Link של next (ניווט) במקום button. */
    href?: string;
    /** גוון ה-accent כמחרוזת RGB, למשל '34,211,238'. משמש ל-primary בלבד. */
    rgb?: string;
    reduce?: boolean;
    /** סריקת-אור חד-פעמית בהופעה (primary בלבד). */
    sheen?: boolean;
    /** מצב מנוטרל: מעומעם, ללא הובר/זוהר, לא לחיץ. */
    disabled?: boolean;
    /** כפתור ברוחב מלא. */
    fullWidth?: boolean;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    /** תווית נגישות אם התוכן אינו טקסט. */
    ariaLabel?: string;
    type?: 'button' | 'submit';
    className?: string;
}

export const GuessButton: React.FC<GuessButtonProps> = ({
    onClick,
    children,
    variant = 'primary',
    href,
    rgb = '16,185,129',
    reduce = false,
    sheen = false,
    disabled = false,
    fullWidth = false,
    leadingIcon,
    trailingIcon,
    ariaLabel,
    type = 'button',
    className = '',
}) => {
    const widthCls = fullWidth ? 'w-full' : '';

    // ── ghost: קישור עדין עם קו-תחתון שנפתח בהובר ──
    if (variant === 'ghost') {
        const ghostInner = (
            <>
                {leadingIcon}
                <span className="relative">
                    {children}
                    <span
                        aria-hidden
                        className="absolute -bottom-0.5 left-0 h-px w-full origin-center scale-x-0 bg-current transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                </span>
            </>
        );
        const ghostCls = `group inline-flex items-center justify-center gap-1.5 px-1 py-1 text-xs font-bold text-[var(--bts-text-muted)] no-underline transition-colors hover:text-[var(--bts-text-bright)] focus:outline-none focus-visible:text-[var(--bts-text-bright)] ${widthCls} ${className}`;
        return href ? (
            <Link href={href} aria-label={ariaLabel} className={ghostCls}>{ghostInner}</Link>
        ) : (
            <button type={type} onClick={onClick} aria-label={ariaLabel} className={ghostCls}>{ghostInner}</button>
        );
    }

    // ── primary: שבב זכוכית עם מסגרת גרדיאנט ──
    const outerStyle: React.CSSProperties = {
        background: `linear-gradient(180deg, rgba(${rgb},0.9), rgba(${rgb},0.3))`,
        filter: reduce || disabled ? undefined : `drop-shadow(0 8px 20px rgba(${rgb},0.4))`,
    };
    const outerCls = `group relative rounded-xl p-px no-underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_oklab,var(--bts-focus-ring)_var(--bts-tint-mix),color-mix(in_oklab,white_40%,transparent))] ${disabled ? 'pointer-events-none opacity-40 grayscale' : ''} ${widthCls} ${className}`;

    const inner = (
        <span
            className="relative flex items-center justify-center gap-2 overflow-hidden rounded-[11px] px-5 py-2.5 text-sm font-bold text-white"
            style={{
                background: `linear-gradient(180deg, rgba(${rgb},0.20), rgba(${rgb},0.05)), linear-gradient(180deg, #0b1220, #020617)`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14)',
            }}
        >
            {/* הבהרה בהובר */}
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-white/0 transition-colors duration-200 group-hover:bg-white/[0.08]" />
            {sheen && !reduce && (
                <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    initial={{ x: 0, opacity: 0 }}
                    animate={{ x: '380%', opacity: [0, 1, 0] }}
                    transition={{ duration: 0.9, delay: 0.5, ease: 'easeInOut' }}
                />
            )}
            {leadingIcon && <span className="relative inline-flex">{leadingIcon}</span>}
            <span className="relative">{children}</span>
            {trailingIcon && <span className="relative inline-flex">{trailingIcon}</span>}
        </span>
    );

    // גרסת Link: הרמה בהובר דרך CSS (במקום framer), כדי לשמור מראש זהה.
    if (href) {
        return (
            <Link
                href={href}
                aria-label={ariaLabel}
                style={outerStyle}
                className={`${outerCls} inline-block transition-transform ${reduce ? '' : 'hover:-translate-y-0.5 active:translate-y-0'}`}
            >
                {inner}
            </Link>
        );
    }

    return (
        <motion.button
            type={type}
            onClick={onClick}
            aria-label={ariaLabel}
            disabled={disabled}
            whileHover={reduce || disabled ? undefined : { y: -2 }}
            whileTap={reduce || disabled ? undefined : { scale: 0.97 }}
            style={outerStyle}
            className={outerCls}
        >
            {inner}
        </motion.button>
    );
};
