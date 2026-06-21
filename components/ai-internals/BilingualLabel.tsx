"use client";

import React from 'react';
import { ACCENTS } from './accents';
import type { Accent } from './types';

type BilingualVariant = 'badge' | 'stacked' | 'inline';
type BilingualSize = 'sm' | 'md';

interface BilingualLabelProps {
    /** הטקסט העברי - תמיד הראשי והבולט. */
    he: string;
    /** הטקסט האנגלי - משני, קטן ומעומעם. אופציונלי. */
    en?: string;
    /**
     * badge   - גלולה צבעונית עם עברית מעל ואנגלית קטנה מתחת (מפרידה RTL/LTR).
     * stacked - עברית מעל, אנגלית מתחת, ללא מסגרת (ברירת מחדל).
     * inline  - עברית ואנגלית זו לצד זו עם מרווח, כשני אלמנטים נפרדים.
     */
    variant?: BilingualVariant;
    /** גוון מתוך הקבוצה הסגורה. משפיע על badge ועל צבע העברית. */
    accent?: Accent;
    size?: BilingualSize;
    className?: string;
}

// מיפוי גדלים סטטי (אין בניית מחלקות דינמית).
const HE_SIZE: Record<BilingualSize, string> = {
    sm: 'text-[11px]',
    md: 'text-sm',
};
const EN_SIZE: Record<BilingualSize, string> = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
};

/**
 * תווית דו-לשונית: עברית ראשית, אנגלית משנית - בלי לדחוס את שתי השפות
 * לאותו רצף טקסט בתוך גלולה צרה. RTL ו-LTR מופרדים לשתי שורות/אלמנטים.
 * כל המחלקות סטטיות (literal) כדי לשמור על תאימות ל-Tailwind JIT.
 */
export const BilingualLabel: React.FC<BilingualLabelProps> = ({
    he,
    en,
    variant = 'stacked',
    accent,
    size = 'sm',
    className = '',
}) => {
    const a = accent ? ACCENTS[accent] : undefined;
    const heText = a ? a.text : 'text-slate-200';
    const heSize = HE_SIZE[size];
    const enSize = EN_SIZE[size];

    // האנגלית תמיד LTR, קטנה ומעומעמת, עם ניגודיות מספקת על רקע כהה.
    const enNode = en ? (
        <span className={`font-medium uppercase tracking-wider text-slate-400 ${enSize}`} dir="ltr">
            {en}
        </span>
    ) : null;

    if (variant === 'badge') {
        const border = a ? a.border : 'border-slate-600/50';
        const bg = a ? a.bgSoft : 'bg-slate-800/50';
        return (
            <span
                className={`inline-flex shrink-0 flex-col items-center rounded-full border px-3 py-1 text-center leading-tight ${border} ${bg} ${className}`}
            >
                <span className={`font-bold ${heSize} ${heText}`}>{he}</span>
                {enNode}
            </span>
        );
    }

    if (variant === 'inline') {
        return (
            <span className={`inline-flex items-baseline gap-2 ${className}`}>
                <span className={`font-bold ${heSize} ${heText}`}>{he}</span>
                {enNode}
            </span>
        );
    }

    // stacked (ברירת מחדל): שתי שורות, יישור לפי הקונטקסט (RTL = ימין).
    return (
        <span className={`inline-flex flex-col leading-tight ${className}`}>
            <span className={`font-bold ${heSize} ${heText}`}>{he}</span>
            {enNode}
        </span>
    );
};
