"use client";

// components/ai-internals/FloatingReadAloud.tsx
//
// עוטף צף לדוק ההאזנה המודרכת: מצמיד אותו לקצה החיצוני של החלון (תלוי-כיוון) כך
// שהוא "צף תמיד" ונשאר נגיש תוך כדי גלילה, בלי לשבת על כרטיס ההירו. הדוק עצמו
// (ReadAloudControls) מצויר כ-children: כשהוא סגור הוא צ'יפ קטן, ובלחיצה הוא נפתח
// לפאנל המלא במקום.
//
// ממומש דרך portal ל-document.body כדי ש-position: fixed יתייחס לחלון התצוגה ולא
// יושפע מ-transform של אבות מונפשים (framer-motion על ההירו יוצר containing block).
// מרונדר רק אחרי mount (בטוח ל-SSR/hydration); הדוק הוא שכבת-שיפור, לא נדרש ב-SSR.

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import type { Direction } from '@/i18n/config';

interface FloatingReadAloudProps {
    dir: Direction;
    children: React.ReactNode;
}

export function FloatingReadAloud({ dir, children }: FloatingReadAloudProps) {
    const [mounted, setMounted] = useState(false);
    // setState ב-setTimeout (לא סינכרוני בגוף ה-effect) לכבוד ה-lint, כמו בשאר הפרויקט.
    useEffect(() => {
        const id = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(id);
    }, []);
    if (!mounted) return null;

    const isRtl = dir === 'rtl';

    return createPortal(
        <div
            // RTL: צמוד לשמאל (הצד הנגדי למנטור שצף מימין); LTR: צמוד לימין. ממורכז אנכית,
            // z מתחת ל-FAB הניווט (z-50) ומעל התוכן. pointer-events-none כדי שלא יחסום
            // קליקים מסביב לדוק, והדוק עצמו מחזיר pointer-events.
            className={`fixed top-1/2 z-40 -translate-y-1/2 ${isRtl ? 'left-2 sm:left-3' : 'right-2 sm:right-3'} pointer-events-none`}
        >
            <div className="pointer-events-auto max-h-[80vh] max-w-[min(20rem,calc(100vw-1rem))] overflow-y-auto overscroll-contain">
                {children}
            </div>
        </div>,
        document.body,
    );
}
