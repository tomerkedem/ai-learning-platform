// components/ai-internals/motionTokens.ts
// מקור אמת יחיד לשפת התנועה של הלומדה "מאחורי הקלעים של AI".
// שכבת הצגה בלבד — אינו נוגע בלוגיקה, בנתונים או בערכים מוצגים.
//
// ── למה הקובץ הזה קיים ───────────────────────────────────────────────────────
// לפני האיחוד היו במאגר 29 צמדי (stiffness, damping) שונים, 8 ערכי duration
// ו-7 מכפילי stagger — רובם רעש, לא כוונה עיצובית. כאן הם מתאחדים למערכת אחת
// כדי שכל הפרקים ירגישו מאותו מוצר. תחושת הפרימיום מגיעה מהעקביות הזו.
//
// ── אסטרטגיה: היברידי (ליבה מאוחדת + חריגים מתועדים) ─────────────────────────
// * SPRING / DUR / EASE / STAGGER מגדירים ליבה קטנה שרוב הקומפוננטות צורכות.
// * ערכי הליבה נבחרו כך שיתלכדו עם הערכים הנפוצים ביותר שכבר היו בקוד, כדי
//   שרוב ההגירה תהיה זהה-ויזואלית (zero-regression).
// * חריגים מוצדקים (hero, "bumped" chevrons וכו') נשמרים כטוקנים נפרדים עם
//   הערה למה הם חורגים — לא מומצאים מחדש מקומית.
//
// ── כללי ברזל ────────────────────────────────────────────────────────────────
// 1. כל אנימציה חייבת לכבד useReducedMotion ולנחות במצב סטטי סופי קריא.
// 2. שלוש משפחות spring ליבה (data / reflow / pop) + pill ל-layoutId.
// 3. stagger אחיד עם תקרה — השתמשו ב-staggerDelay() במקום i*const חשוף.

/* ════════════════════════════ Spring ═══════════════════════════════════════ */
// משפחות ליבה. ערכי הליבה תואמים את האשכולות הנפוצים שכבר היו בקוד.
export const SPRING = {
    /** מילוי בר/וקטור, מספרים שמשתנים. אשכול 110–140 / 18–20. */
    data:   { type: 'spring', stiffness: 130, damping: 19 },
    /** סידור מחדש (layout / דירוג / reflow). אשכול 300–380 / 24–34. */
    reflow: { type: 'spring', stiffness: 380, damping: 32 },
    /** כניסה/הדגשה דרמטית. אשכול 200–320 / 20–22. */
    pop:    { type: 'spring', stiffness: 260, damping: 20 },
    /** גלולת layoutId (ModeToggle / מתגים). תואם 420/34 שכבר היה הנפוץ בתפקיד. */
    pill:   { type: 'spring', stiffness: 420, damping: 34 },

    // ── חריגים מתועדים (לא ליבה — שמורים בכוונה) ──
    /** "bumped" — קפיצה חדה ובועטת לאינדיקטור עלייה (chevron). damping נמוך בכוונה. */
    bump:   { type: 'spring', stiffness: 320, damping: 16 },
    /** המנטור ב-hero של ה-Intro. כניסה רכה וגדולה. */
    heroPop:{ type: 'spring', stiffness: 220, damping: 17 },
    /** reflow איטי/עדין יותר להקשרים נרחבים (לולאה/בקרה). */
    gentle: { type: 'spring', stiffness: 200, damping: 22 },
} as const;

/* ════════════════════════════ Duration ═════════════════════════════════════ */
// משכי כניסה/מעבר. הליבה תואמת את האשכולות (0.25 ו-0.3 הם הנפוצים ביותר).
export const DUR = {
    micro:    0.18, // hover / tap / החלפת badge
    quick:    0.25, // מעבר מהיר בין מצבים, כניסת שורה
    base:     0.30, // כניסת אלמנט בודד (ברירת מחדל)
    mid:      0.40, // מעבר בינוני
    entrance: 0.50, // כניסת section / כרטיס גדול
    data:     0.70, // מילוי בר, ספירת מספר
} as const;

// משכי לולאות אמביינט — ארוכים ומכוונים, לא חלק מסולם הכניסות.
export const AMBIENT = {
    pulse:   1.1, // ping / pulse
    cursor:  0.8, // הבהוב סמן הקלדה
    float:   4.0, // ריחוף עדין (מנטור)
    shimmer: 5.0, // נצנוץ סורק
} as const;

/* ════════════════════════════ Easing ═══════════════════════════════════════ */
export const EASE = {
    /** עקומת הכניסה הסטנדרטית של הלומדה (הייתה בשימוש ב-22 מקומות). */
    out:   [0.22, 1, 0.36, 1] as [number, number, number, number],
    /** אינטרפולציה של ערכים (מילוי בר, ספירה). */
    inter: 'easeOut' as const,
    /** לולאות אמביינט דו-כיווניות. */
    inOut: 'easeInOut' as const,
};

/* ════════════════════════════ Stagger ══════════════════════════════════════ */
export const STAGGER = {
    tight: 0.03, // רשימות צפופות (chips רבים)
    base:  0.05, // ברירת מחדל
    cap:   0.5,  // תקרה כוללת לרשימה שלמה
} as const;

/**
 * דיליי מדורג עם תקרה — מונע מרשימות ארוכות "להיגרר" יותר מדי.
 * דוגמה: staggerDelay(i)  ⇒  Math.min(i * 0.05, 0.5)
 */
export function staggerDelay(index: number, step: number = STAGGER.base, cap: number = STAGGER.cap): number {
    return Math.min(index * step, cap);
}

/* ════════════════════════════ עוזרי reduced-motion ════════════════════════ */

/**
 * עוטף transition כך שיכבד reduced-motion: כשהמשתמש ביקש פחות תנועה,
 * המעבר הופך מיידי (duration 0) והאלמנט נוחת ישר במצב הסופי.
 * שימוש: transition={withReduced(reduce, SPRING.data)}
 */
export function withReduced<T extends object>(reduce: boolean | null, transition: T): T | { duration: 0 } {
    return reduce ? { duration: 0 } : transition;
}
