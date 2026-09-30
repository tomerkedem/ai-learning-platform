// components/reducedMotion.ts
//
// החלטה אחת להפחתת תנועה: העדפת מערכת ההפעלה או הבחירה של הלומד בחלון "נגישות ותצוגה"
// (data-reduce-motion על <html>, נקבע בסקריפט הטרום-ציור וב-DisplaySettings).
//
// useReducedMotion כאן מחליף את זה של framer-motion, שקורא את ההעדפה פעם אחת כשהרכיב נטען
// ולא מגיב לשינויים. זה מבוסס useSyncExternalStore: כל רכיב שכבר מוצג מתעדכן מיד כשההחלטה
// משתנה, בלי טעינה מחדש ובלי לאבד מצב של מבדק או מעבדה. בזמן ה-hydration הערך הוא false,
// כמו בשרת, ולכן אין אי-התאמה.
//
// MotionGlobalConfig.skipAnimations (הגדרה גלובלית מיוצאת של Motion) מדלג כל אנימציה חדשה של
// framer-motion למצב הסופי שלה, גם ברכיבים שלא קוראים את ה-hook. המודול נטען מ-ThemeProvider,
// ולכן רץ בכל עמוד לפני הרינדור הראשון בלקוח.

import { useSyncExternalStore } from 'react';
import { MotionGlobalConfig } from 'framer-motion';

const QUERY = '(prefers-reduced-motion: reduce)';
const listeners = new Set<() => void>();

/** קריאה חיה של ההחלטה. בשרת תמיד false. */
export function reducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return document.documentElement.hasAttribute('data-reduce-motion') || !!window.matchMedia?.(QUERY).matches;
}

/** להפעיל אחרי כל שינוי בהעדפה: מעדכן את framer-motion ואת כל הרכיבים שמנויים. */
export function syncReducedMotion() {
    MotionGlobalConfig.skipAnimations = reducedMotion();
    listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function useReducedMotion(): boolean {
    return useSyncExternalStore(subscribe, reducedMotion, () => false);
}

if (typeof window !== 'undefined') {
    MotionGlobalConfig.skipAnimations = reducedMotion();
    window.matchMedia?.(QUERY).addEventListener('change', syncReducedMotion);
}
