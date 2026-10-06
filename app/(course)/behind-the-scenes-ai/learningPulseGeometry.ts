// ════════════════════════════════════════════════════════════════════════
// גאומטריית Learning Pulse: 19 עלי כותרת, עלה אחד לכל פרק 1-19. פונקציות טהורות בלבד:
// בלי React, בלי דפדפן, בלי נתונים ובלי עיצוב.
//
// מערכת הצירים: viewBox ממורכז (PULSE_VIEWBOX), המרכז ב-(0,0), y למטה (כמו SVG).
// עלה מצויר בקואורדינטות מקומיות כשהוא מצביע למעלה (y שלילי), ומסובב לפי מספר הפרק.
// פרק 1 בשעה 12, והפרקים מתקדמים עם כיוון השעון. המיקום הפיזי זהה בכל שפה: הגאומטריה
// אינה מקבלת שפה או כיוון, ואינה משתקפת ב-RTL.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

export const PETAL_COUNT = 19;
/** הזווית בין עלים סמוכים, במעלות. */
export const PETAL_STEP_DEG = 360 / PETAL_COUNT;
/** חצי רוחב ה-viewBox: כל הגאומטריה (כולל הדגשה) נכנסת ברדיוס הזה. */
export const PULSE_HALF = 120;
export const PULSE_VIEWBOX = `${-PULSE_HALF} ${-PULSE_HALF} ${PULSE_HALF * 2} ${PULSE_HALF * 2}`;

/**
 * צורת עלה: קפסולה מתחדדת. מרכז הקצה הפנימי ברדיוס innerRadius (חצי רוחב innerHalfWidth), מרכז
 * הקצה החיצוני ברדיוס outerRadius (חצי רוחב outerHalfWidth). צומת השליטה יושב במרכז הקצה החיצוני.
 */
export interface PetalShape {
    innerRadius: number;
    innerHalfWidth: number;
    outerRadius: number;
    outerHalfWidth: number;
    nodeRadius: number;
    /** רווח בין קצה המילוי המלא לבין צומת השליטה. */
    fillGap: number;
}

/**
 * הצורה של התמונה המאושרת: עלי זכוכית רחבים, צרים בפנים ומעוגלים ורחבים בחוץ, עם רווח ברור בין
 * עלים (בשני הקצוות) ומקום למרכז. ב-viewBox של PULSE_HALF = 120.
 */
export const PETAL: PetalShape = {
    innerRadius: 36,
    innerHalfWidth: 4.2,
    outerRadius: 95,
    outerHalfWidth: 11.3,
    nodeRadius: 4.2,
    fillGap: 2.2,
};

const round = (n: number) => +n.toFixed(3);

/** מספר פרק תקין (1-19). */
export const isPetalChapter = (chapterId: number): boolean =>
    Number.isInteger(chapterId) && chapterId >= 1 && chapterId <= PETAL_COUNT;

/** זווית הפרק במעלות, עם כיוון השעון מהשעה 12. פרק 1 = 0. */
export function petalAngle(chapterId: number): number {
    if (!isPetalChapter(chapterId)) throw new RangeError(`chapter ${chapterId} is not 1-${PETAL_COUNT}`);
    return (chapterId - 1) * PETAL_STEP_DEG;
}

/** הסיבוב של עלה הפרק, לשימוש כ-transform של קבוצת SVG. */
export const petalTransform = (chapterId: number): string => `rotate(${round(petalAngle(chapterId))})`;

/** נקודה על ציר הפרק ברדיוס r, בקואורדינטות ה-viewBox (למיקום רכיבים שאינם בתוך הקבוצה המסובבת). */
export function petalPoint(chapterId: number, r: number): { x: number; y: number } {
    const rad = (petalAngle(chapterId) * Math.PI) / 180;
    return { x: round(r * Math.sin(rad)), y: round(-r * Math.cos(rad)) };
}

/**
 * מסלול הקפסולה בקואורדינטות מקומיות (מצביעה למעלה). offset מרחיב (חיובי) או מצמצם (שלילי) את
 * הרוחב ואת שני הקצוות באותו מרחק: offset שלילי = מילוי פנימי, חיובי = קו הדגשה סביב העלה.
 */
export function petalPath(offset = 0, shape: PetalShape = PETAL): string {
    return capsulePath(shape.innerRadius, shape.innerHalfWidth + offset, shape.outerRadius, shape.outerHalfWidth + offset);
}

/**
 * קפסולה מתחדדת כללית לאורך הציר (מצביעה למעלה): מרכז קצה פנימי ברדיוס r0 (חצי רוחב a), מרכז קצה
 * חיצוני ברדיוס r1 (חצי רוחב b). הצלעות הן משיקים חיצוניים אמיתיים, בלי פינה בקצוות.
 */
export function capsulePath(r0: number, aIn: number, r1: number, bIn: number): string {
    const a = Math.max(0, aIn);
    const b = Math.max(0, bIn);
    if (r1 - r0 < 1e-6) {
        const r = round(Math.max(a, b));
        return `M${r} ${round(-r0)}A${r} ${r} 0 1 0 ${-r} ${round(-r0)}A${r} ${r} 0 1 0 ${r} ${round(-r0)}Z`;
    }
    // משיקים חיצוניים אמיתיים בין שני העיגולים: הצלעות פוגשות את הקצוות בלי פינה.
    const sin = Math.max(-1, Math.min(1, (b - a) / (r1 - r0)));
    const cos = Math.sqrt(Math.max(0, 1 - sin * sin));
    const [ax, ay] = [round(a * cos), round(-(r0 - a * sin))];
    const [bx, by] = [round(b * cos), round(-(r1 - b * sin))];
    const [ra, rb] = [round(a), round(b)];
    return `M${ax} ${ay}L${bx} ${by}A${rb} ${rb} 0 1 0 ${-bx} ${by}L${-ax} ${ay}A${ra} ${ra} 0 0 0 ${ax} ${ay}Z`;
}

/** הקצה הפנימי והחיצוני של העלה, מהמרכז (לגבולות הדגשה ולחישובי מיקום). */
export const petalExtent = (offset = 0, shape: PetalShape = PETAL) => ({
    inner: round(shape.innerRadius - shape.innerHalfWidth - offset),
    outer: round(shape.outerRadius + shape.outerHalfWidth + offset),
});

/**
 * אזור הלחיצה של עלה (בלתי נראה), בקואורדינטות מקומיות (מצביע למעלה): טריז מרדיוס r0 עד r1 ברוחב
 * זווית של עלה אחד בדיוק, כך שטריזים סמוכים נוגעים זה בזה בלי חפיפה ובלי רווח.
 */
export function wedgePath(r0: number, r1: number): string {
    const h = (PETAL_STEP_DEG / 2) * (Math.PI / 180);
    const [s, c] = [Math.sin(h), Math.cos(h)];
    const p = (r: number, side: number) => `${round(side * r * s)} ${round(-r * c)}`;
    return `M${p(r0, -1)}L${p(r1, -1)}A${r1} ${r1} 0 0 1 ${p(r1, 1)}L${p(r0, 1)}A${r0} ${r0} 0 0 0 ${p(r0, -1)}Z`;
}

/**
 * הקצה החיצוני הגדול ביותר שעלה מצויר אליו: קו ההדגשה (offset 1.6, חצי עובי 0.75) על העלה המוגדל
 * של הפרק הנוכחי (scale 1.05). כלל אחד לכל העלים ולכל המצבים.
 */
export const PETAL_DRAWN_EXTENT = round((PETAL.outerRadius + PETAL.outerHalfWidth + 1.6 + 0.75) * 1.05);
/** רווח הביטחון בין הקצה המצויר של העלים לבין מספר פרק (מעבר לזוהר הרך). */
export const MARKER_GAP = 4;

export interface MarkerPlacement {
    x: number;
    y: number;
    anchor: "start" | "middle" | "end";
    baseline: "alphabetic" | "central" | "hanging";
    /** תיבת הטקסט המשוערת, בקואורדינטות ה-viewBox. */
    box: { x0: number; y0: number; x1: number; y1: number };
}

/**
 * מיקום מספר פרק מחוץ לעלה שלו, על אותו ציר: הטקסט מעוגן כך שהוא נמתח הלאה מהעלה (מימין: start,
 * משמאל: end, למעלה ולמטה: middle; מעל, מתחת או במרכז אנכית), והרדיוס גדל עד שכל תיבת הטקסט נמצאת
 * מחוץ למעגל PETAL_DRAWN_EXTENT + MARKER_GAP. הספרות זקופות; בלי תלות בשפה או בכיוון.
 */
export function markerPlacement(chapterId: number, fontSize: number, text: string): MarkerPlacement {
    const rad = (petalAngle(chapterId) * Math.PI) / 180;
    const [s, c] = [Math.sin(rad), Math.cos(rad)];
    // ספרות טבלאיות: כ-0.62em רוחב לספרה, וכ-0.74em גובה (ספרות בלי יורדים), מעט בנדיבות.
    const w = 0.62 * fontSize * text.length;
    const h = 0.74 * fontSize;
    const anchor = s > 0.3 ? "start" : s < -0.3 ? "end" : "middle";
    const baseline = c > 0.3 ? "alphabetic" : c < -0.3 ? "hanging" : "central";
    const clear = PETAL_DRAWN_EXTENT + MARKER_GAP;
    const boxAt = (x: number, y: number) => ({
        x0: anchor === "start" ? x : anchor === "end" ? x - w : x - w / 2,
        x1: anchor === "start" ? x + w : anchor === "end" ? x : x + w / 2,
        y0: baseline === "alphabetic" ? y - h : baseline === "hanging" ? y : y - h / 2,
        y1: baseline === "alphabetic" ? y : baseline === "hanging" ? y + h : y + h / 2,
    });
    const nearest = (b: MarkerPlacement["box"]) =>
        Math.hypot(b.x0 > 0 ? b.x0 : b.x1 < 0 ? -b.x1 : 0, b.y0 > 0 ? b.y0 : b.y1 < 0 ? -b.y1 : 0);
    let r = clear;
    while (nearest(boxAt(r * s, -r * c)) < clear) r += 0.25;
    const [x, y] = [round(r * s), round(-r * c)];
    const b = boxAt(x, y);
    return { x, y, anchor, baseline, box: { x0: round(b.x0), y0: round(b.y0), x1: round(b.x1), y1: round(b.y1) } };
}

/** מרכז צומת השליטה, בקואורדינטות מקומיות. */
export const nodeCenter = (shape: PetalShape = PETAL) => ({ x: 0, y: -shape.outerRadius });

/**
 * חומר ההתקדמות בתוך העלה: קפסולה מתחדדת באותה צורה, פנימה ב-inset, שהחזית המעוגלת שלה מגיעה
 * לרדיוס front. front = 0 (או פחות מהקצה הפנימי) = אין מילוי.
 */
export function fillPath(front: number, inset: number, shape: PetalShape = PETAL): string {
    const r0 = shape.innerRadius;
    const a = shape.innerHalfWidth - inset;
    const widthAt = (r: number) => a + ((shape.outerHalfWidth - inset - a) * (r - r0)) / (shape.outerRadius - r0);
    // מרכז החזית כך שהקצה המעוגל נוגע ב-front; לא לפני הקצה הפנימי.
    let r1 = front - widthAt(front);
    r1 = Math.max(r0, front - widthAt(r1));
    return capsulePath(r0, a, r1, Math.min(widthAt(r1), front - r1));
}

/**
 * רדיוס מעגל החיתוך של מילוי ההתקדמות (מעגל ממורכז). 0 = אין מילוי. היחס נחתך ל-0..1, וערך לא
 * תקין נחשב 0. ב-1 המילוי נעצר ממש לפני צומת השליטה, כך שהמילוי והשליטה לעולם אינם מתמזגים.
 */
export function fillRadius(ratio: number, shape: PetalShape = PETAL): number {
    if (!(ratio > 0)) return 0;
    const t = Math.min(1, ratio);
    const start = shape.innerRadius - shape.innerHalfWidth;
    const end = shape.outerRadius - shape.nodeRadius - shape.fillGap;
    return round(start + t * (end - start));
}
