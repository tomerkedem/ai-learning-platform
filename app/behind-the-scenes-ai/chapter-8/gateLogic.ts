// לוגיקת השער של פרק 8: "Confidence - מתי לענות ומתי לעצור".
// קובץ טהור לחלוטין: אין כאן React, אין נתוני תוכן, אין קריאת רשת, ולא
// מחושבות כאן הסתברויות. ההתפלגויות מגיעות ממנוע פרק 7. כאן יושבת רק שכבת
// השער שמעל ההתפלגות:
//
//   confidence_margin = top_probability - second_probability
//   if confidence_margin < threshold: ask for more context
//   else: continue
//   if risk is high: require higher threshold or human approval
//   Decision allowed = (margin >= threshold) AND (risk is acceptable)
//
// המטרה אינה מודל מתמטי, אלא להראות איך ביטחון הופך לשער החלטה. עצירה ובקשת
// הקשר אינן שגיאה, הן הצעד המקצועי.

/** רמת הסיכון של הפעולה שמנסים לבצע. */
export type RiskLevel = 'low' | 'low-medium' | 'high';

/** סוג ההחלטה שיוצאת מהשער. */
export type GateDecisionKind = 'answer' | 'use-tool' | 'ask-context' | 'stop-approval';

/** פעולה אפשרית עם דרישת הביטחון שלה. הגורם השני בשער (מעבר ל-margin). */
export interface RiskAction {
    id: string;
    /** סף הביטחון המינimal שהפעולה דורשת (0..100). פעולה רגישה דורשת יותר. */
    requiredConfidence: number;
    /** האם הפעולה מחייבת אישור אנושי לפני ביצוע אוטונומי. */
    humanApproval: boolean;
}

export interface GateResult {
    /** הסף האפקטיבי: המקסימום בין סף המשתמש לבין דרישת הסיכון (Agent). */
    effectiveThreshold: number;
    /** האם הפער עובר את הסף האפקטיבי. */
    marginPasses: boolean;
    /** האם נדרש אישור אנושי (פעולה רגישה). */
    needsApproval: boolean;
    /** האם השער פתוח לפעולה אוטונומית. */
    open: boolean;
    /** ההחלטה הנגזרת. */
    kind: GateDecisionKind;
}

/**
 * הסף האפקטיבי. ב-Chat זהו סף המשתמש בלבד (הגרירה היא שולטת מלאה).
 * ב-Agent הסיכון מוסיף רצפה: לא ניתן לרדת מתחת לדרישת הפעולה.
 */
export function effectiveThreshold(userThreshold: number, mode: 'chat' | 'agent', action?: RiskAction): number {
    if (mode === 'agent' && action) return Math.max(userThreshold, action.requiredConfidence);
    return userThreshold;
}

/**
 * מעריך את השער. הקלט: הפער (margin), סף המשתמש, המצב, והפעולה (ב-Agent).
 * זו הפונקציה היחידה שמכריעה אם מותר לפעול.
 */
export function evaluateGate(
    margin: number,
    userThreshold: number,
    mode: 'chat' | 'agent',
    action?: RiskAction,
): GateResult {
    const eff = effectiveThreshold(userThreshold, mode, action);
    const marginPasses = margin >= eff;
    const needsApproval = mode === 'agent' && !!action?.humanApproval;

    let kind: GateDecisionKind;
    let open: boolean;

    if (needsApproval) {
        // פעולה רגישה מול לקוח: לעולם לא אוטונומית, תמיד עוצרים לאישור.
        kind = 'stop-approval';
        open = false;
    } else if (!marginPasses) {
        // הפער קטן מהסף: לבקש הקשר נוסף. זה הצעד המקצועי, לא שגיאה.
        kind = 'ask-context';
        open = false;
    } else if (mode === 'agent' && action?.id === 'tracking-status') {
        kind = 'use-tool';
        open = true;
    } else {
        kind = 'answer';
        open = true;
    }

    return { effectiveThreshold: eff, marginPasses, needsApproval, open, kind };
}

/* ─────────────────────────── תוויות החלטה ───────────────────────────────── */

export const GATE_KIND_META: Record<GateDecisionKind, { he: string; en: string; tone: 'open' | 'caution' | 'stop' }> = {
    answer: { he: 'מתן תשובה', en: 'Answer', tone: 'open' },
    'use-tool': { he: 'הפעלת כלי', en: 'Use tool', tone: 'open' },
    'ask-context': { he: 'בקשת הקשר נוסף', en: 'Ask for more context', tone: 'caution' },
    'stop-approval': { he: 'עצירה לאישור אנושי', en: 'Stop for human approval', tone: 'stop' },
};

/* ─────────────────────── בניית שאלת ההבהרה ──────────────────────────────── */

/**
 * שאלת ההבהרה נבנית מתוך שתי האפשרויות המתחרות, לא משאלה גנרית.
 * המנגנון גלוי: המתלבט בין A ל-B מקבל שאלה שמורכבת מ-A ו-B.
 */
export function buildClarifyingQuestion(optionAHe: string, optionBHe: string): string {
    return `האם הכוונה ${optionAHe}, או ${optionBHe}?`;
}
