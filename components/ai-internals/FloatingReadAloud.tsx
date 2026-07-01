"use client";

// components/ai-internals/FloatingReadAloud.tsx
//
// עוטף צף לדוק ההאזנה המודרכת. מבצע portal אל מסילת-הקצה המשותפת (`#edge-dock-slot`
// שמרנדר ChapterLayout) כך שהדוק יושב מעל כפתור מצב המיקוד באותה מסילה, עם אותה
// התנהגות peek. אם המסילה חסרה (עמוד ללא ChapterLayout) נופלים ל-portal ל-body עם
// מיקום צף ממורכז משלנו, כמו קודם.
//
// ה-portal נחוץ כי ההירו הוא motion.section שה-transform שלו יוצר containing block
// ששובר position: fixed ומחתוך תחת overflow-hidden. מרונדר רק אחרי mount (בטוח
// ל-SSR/hydration); הדוק הוא שכבת-שיפור, לא נדרש ב-SSR.
//
// מצב "הצצה" (peek) ממומש ב-EdgePeekItem המשותף. הדוק מדווח דרך ReadAloudPinContext
// אם הוא "נעוץ" (הקראה פעילה / מגירה פתוחה) כדי שלא יכווץ בזמן שימוש.

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import type { Direction } from '@/i18n/config';
import { EdgePeekItem } from './EdgePeek';

// Context שדרכו הדוק הפנימי מדווח אם הוא "נעוץ". ברירת המחדל no-op, כך שהדוק נשאר
// מנותק ועובד גם מחוץ ל-FloatingReadAloud.
const ReadAloudPinContext = createContext<(pinned: boolean) => void>(() => {});

/** הדוק הפנימי קורא לזה כדי לבקש שהפריט הצף יישאר פתוח כל עוד pinned=true. */
export function useReadAloudPin(pinned: boolean) {
    const setPinned = useContext(ReadAloudPinContext);
    useEffect(() => {
        setPinned(pinned);
        return () => setPinned(false);
    }, [pinned, setPinned]);
}

interface FloatingReadAloudProps {
    dir: Direction;
    children: React.ReactNode;
}

export function FloatingReadAloud({ dir, children }: FloatingReadAloudProps) {
    const [host, setHost] = useState<HTMLElement | null>(null);
    const [fallback, setFallback] = useState(false);
    const [pinned, setPinned] = useState(false);

    // setState ב-setTimeout (לא סינכרוני בגוף ה-effect) לכבוד ה-lint, כמו בשאר הפרויקט.
    // מחפשים את slot המסילה; אם אין - נופלים ל-body עם מיקום צף משלנו.
    useEffect(() => {
        const id = setTimeout(() => {
            const slot = document.getElementById('edge-dock-slot');
            if (slot) {
                setHost(slot);
            } else {
                setHost(document.body);
                setFallback(true);
            }
        }, 0);
        return () => clearTimeout(id);
    }, []);

    if (!host) return null;

    const isRtl = dir === 'rtl';

    const item = (
        <ReadAloudPinContext.Provider value={setPinned}>
            <EdgePeekItem
                dir={dir}
                pinned={pinned}
                className="max-h-[80vh] max-w-[min(20rem,calc(100vw-1rem))] overflow-y-auto overscroll-contain"
            >
                {children}
            </EdgePeekItem>
        </ReadAloudPinContext.Provider>
    );

    // נתיב מסילה: מוסיפים את הדוק ל-slot; המסילה מטפלת במיקום ובמרכוז.
    if (!fallback) {
        return createPortal(item, host);
    }

    // נתיב fallback: מיקום צף ממורכז עצמאי (אותה התנהגות כמו לפני המסילה).
    return createPortal(
        <div
            className={`fixed top-1/2 z-40 flex -translate-y-1/2 flex-col items-end ${isRtl ? 'left-2 sm:left-3' : 'right-2 sm:right-3'} pointer-events-none`}
        >
            {item}
        </div>,
        host,
    );
}
