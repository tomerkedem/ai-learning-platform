// ════════════════════════════════════════════════════════════════════════
// Learner Pulse: גאומטריית הסימן של הלומד בפאנל החשבון (AccountPanel).
// מקטע = מבדק פרק. מספר המקטעים שעברו מגיע מסיכום ההתקדמות (masteryProgress), לעולם לא
// מהמיקום בסרגל או מהעמוד הנוכחי, ומצב הגישה אינו משנה אותם: ידע שנצבר נשאר גם כשהגישה הסתיימה.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

const CENTER = 20;
const RADIUS = 16.5;
// הרווח בין מקטעים, במעלות: מספיק כדי שכל מקטע ייקרא כיחידה נפרדת גם ב-32px.
const GAP = 6;

const point = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return `${(CENTER + RADIUS * Math.cos(rad)).toFixed(3)} ${(CENTER + RADIUS * Math.sin(rad)).toFixed(3)}`;
};

/**
 * מקטע אחד לכל מבדק פרק (total), בתיבת 40x40. המקטעים הראשונים, בכיוון השעון מלמעלה, מסומנים
 * כעברו לפי ספירת המבדקים שעברו (passed). זו ספירה: המקטע השלישי אינו "פרק 3".
 */
export function pulseSegments(passed: number, total: number): { d: string; passed: boolean }[] {
    const count = Math.max(0, Math.floor(total));
    const done = Math.min(count, Math.max(0, Math.floor(passed)));
    const step = 360 / count;
    return Array.from({ length: count }, (_, i) => {
        const start = -90 + i * step + GAP / 2;
        return { d: `M ${point(start)} A ${RADIUS} ${RADIUS} 0 0 1 ${point(start + step - GAP)}`, passed: i < done };
    });
}
