"use client";

import { useEffect, type RefObject } from "react";
import { markUnitReached } from "./account";
import { LEARNING_UNITS } from "./learningProgress";

// כלל ההגעה: יחידה נחשבת "הגיעו אליה" כשהחלק הגלוי שלה הוא לפחות חצי מהיחידה, או לפחות חצי
// מגובה אזור הגלילה (ליחידה ארוכה ממסך אחד, כמו מעבדה). נגיעה בקצה אינה נספרת. זו נראוּת, לא
// קריאה: אין מדידת זמן. הכותרת הצפה של הפרק אינה מנוכה מהאזור (פישוט מכוון).
const REACHED_SHARE = 0.5;
// ספים בצעדים של 5%: הקריאה החוזרת מגיעה בזמן גם ליחידה גבוהה עד פי עשרה מהמסך (מעבר לזה
// כבר הסף הראשון מכסה חצי מסך).
const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

/**
 * מסמן יחידות למידה של הפרק (data-learning-unit) כשהן נראות באזור הגלילה של ChapterLayout.
 * ה-root הוא מיכל הגלילה של הפרק, לא חלון הדפדפן. הגעה היא חד-כיוונית: אחרי שנרשמה, היחידה
 * יוצאת מהמעקב, וגלילה אחורה לא מבטלת אותה. chapterId null = לא פרק 1-19 (מבוא, לומדות אחרות).
 */
export function useLearningUnitTracking(rootRef: RefObject<HTMLElement | null>, chapterId: number | null): void {
    useEffect(() => {
        const root = rootRef.current;
        const units = chapterId === null ? undefined : LEARNING_UNITS[chapterId];
        if (!root || !units || chapterId === null || typeof IntersectionObserver === "undefined") return;
        const observer = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (!e.isIntersecting || !e.rootBounds || !e.intersectionRect.height) continue;
                const needed = Math.min(e.boundingClientRect.height, e.rootBounds.height) * REACHED_SHARE;
                if (e.intersectionRect.height < needed) continue;
                observer.unobserve(e.target);
                markUnitReached(chapterId, (e.target as HTMLElement).dataset.learningUnit ?? "");
            }
        }, { root, threshold: THRESHOLDS });
        for (const el of root.querySelectorAll<HTMLElement>("[data-learning-unit]")) {
            if (units.includes(el.dataset.learningUnit ?? "")) observer.observe(el);
        }
        return () => observer.disconnect();
    }, [rootRef, chapterId]);
}
