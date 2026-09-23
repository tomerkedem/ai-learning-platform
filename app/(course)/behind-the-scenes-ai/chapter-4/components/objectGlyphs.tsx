"use client";

// objectGlyphs - צלליות וקטוריות לאובייקטים של דמו "קרבה במשמעות" (פרק 4).
// ──────────────────────────────────────────────────────────────────────────
// כלב, חתול ומחשב משתמשים בצלליות קו מוכנות (lucide), והמלפפון מצויר ידנית כ-SVG
// stroke בסגנון תואם (24px). הרכיב מוכן-נכס: אם מסופק assetSrc (PNG שקוף בעתיד),
// הוא יוצג במקום הצללית בלי לשנות לוגיקה. ללא emoji, ללא clip-art.

import React from 'react';
import { Dog, Cat, Apple, Monitor } from 'lucide-react';

export type ObjectGlyphKey = 'dog' | 'cat' | 'apple' | 'cucumber' | 'computer';

interface GlyphProps {
    size?: number;
    className?: string;
}

/** מלפפון: צללית stroke מצוירת ביד, קפסולה מוטה עם גבעול ורכסים עדינים. */
const CucumberGlyph: React.FC<GlyphProps> = ({ size = 34, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden
    >
        <g transform="rotate(-35 12 12)">
            <rect x="8.5" y="3" width="7" height="18" rx="3.5" />
            <line x1="12" y1="3" x2="12" y2="1.5" />
            <line x1="10.6" y1="7.5" x2="11.1" y2="9" />
            <line x1="13" y1="11" x2="13.5" y2="12.5" />
            <line x1="10.8" y1="14.5" x2="11.3" y2="16" />
        </g>
    </svg>
);

const GLYPHS: Record<ObjectGlyphKey, React.FC<GlyphProps>> = {
    dog: ({ size = 34, className }) => <Dog size={size} className={className} aria-hidden />,
    cat: ({ size = 34, className }) => <Cat size={size} className={className} aria-hidden />,
    apple: ({ size = 34, className }) => <Apple size={size} className={className} aria-hidden />,
    computer: ({ size = 34, className }) => <Monitor size={size} className={className} aria-hidden />,
    cucumber: CucumberGlyph,
};

export interface ObjectGlyphProps {
    /** צללית גיבוי. אם יש assetSrc, התמונה גוברת והצללית משמשת רק כשהנכס חסר. */
    glyph?: ObjectGlyphKey;
    /** נתיב נכס PNG (ראשי). אם קיים, מוצג במקום הצללית. */
    assetSrc?: string;
    size?: number;
    className?: string;
    alt?: string;
}

export const ObjectGlyph: React.FC<ObjectGlyphProps> = ({ glyph, assetSrc, size = 34, className, alt = '' }) => {
    if (assetSrc) {
        // הגודל נשלט דרך className (h/w) כדי לאפשר התאמה רספונסיבית בתוך הצומת.
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={assetSrc} alt={alt} className={className} draggable={false} />;
    }
    if (!glyph) return null;
    const Glyph = GLYPHS[glyph];
    return <Glyph size={size} className={className} />;
};
