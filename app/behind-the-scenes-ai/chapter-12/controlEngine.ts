// מנוע שכבת הבקרה של פרק 12: "עצירה, אישור ואחריות".
// קובץ טהור לחלוטין: אין כאן React, אין נתוני תוכן, אין LLM, אין רשת, ואין
// פעולה אמיתית. אף הודעה לא נשלחת, אף מערכת לא מתעדכנת. הכל מדומה.
//
// זהו האיחוד של כל חצי ה-Agent: שער הביטחון (פרק 8), ההרשאות (פרק 10),
// ושער הסיכון (פרק 11) מתאחדים לנוסחה לוגית אחת:
//
//   action_allowed = confidence_high AND risk_low AND permission_granted
//
// אם אחד התנאים נכשל, הפעולה לא מתבצעת אוטומטית. עיקרון מנחה: עצירה אינה
// כישלון, היא אפשרות חוקית ושווה. ה-Agent מוגבל בכוונה, לא חסר יכולת.

/* ─────────────────────────────── טיפוסים ────────────────────────────────── */

/** סוג הפעולה. ככל שהיא משפיעה יותר על העולם, כך עולה הסיכון. */
export type ActionType = 'read' | 'summarize' | 'analyze' | 'suggest' | 'draft' | 'send' | 'update' | 'delete' | 'close';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * הרשאה:
 *   allowed           = מותר, פועל אוטומטית.
 *   requires-approval = מותר רק אחרי אישור אנושי.
 *   blocked           = חסום, לא מתבצע כלל.
 */
export type Permission = 'allowed' | 'requires-approval' | 'blocked';

export type Confidence = 'high' | 'low';

/** מצב שער האישור. */
export type GateState = 'open' | 'approval' | 'blocked';

/** ההחלטה של שכבת הבקרה. Stop הוא אפשרות חוקית ושווה, לא שגיאה. */
export type ControlDecision =
    | 'answer'         // סיכון נמוך, מותר: לענות / להמשיך
    | 'draft'          // סיכון בינוני: להכין טיוטה
    | 'stop-approval'  // פעולה רגישה: לעצור, להכין טיוטה לאישור
    | 'stop-conflict'  // סתירה בין הבקשה לתוצאה: לעצור ולהציף
    | 'ask-clarify'    // עמימות: לשאול שאלה מבהירה
    | 'blocked';       // פעולה חסומה לחלוטין

/* ─────────────────────── סולם הסיכון לפי סוג פעולה ──────────────────────── */
// Read Low, Analyze/Suggest/Draft Medium, Send/Update High, Delete/Close Critical.

export const RISK_BY_ACTION: Record<ActionType, RiskLevel> = {
    read: 'low',
    summarize: 'low',
    analyze: 'medium',
    suggest: 'medium',
    draft: 'medium',
    send: 'high',
    update: 'high',
    delete: 'critical',
    close: 'critical',
};

/* ─────────────────────── גבולות הרשאה לפי סוג פעולה ─────────────────────── */
// Allowed: קריאה, סיכום, טיוטה. Requires approval: שליחה, עדכון.
// Blocked: מחיקה, שינוי תוצאה רשמית (סגירה).

export const PERMISSION_BY_ACTION: Record<ActionType, Permission> = {
    read: 'allowed',
    summarize: 'allowed',
    analyze: 'allowed',
    suggest: 'allowed',
    draft: 'allowed',
    send: 'requires-approval',
    update: 'requires-approval',
    delete: 'blocked',
    close: 'blocked',
};

/* ─────────────────────── זיהוי פעולה ועמימות ────────────────────────────── */

const PUNCT = /[?.!,;:"'()־]/g;

export function tokenize(text: string): string[] {
    return text.replace(PUNCT, ' ').trim().split(/\s+/).filter(Boolean);
}

interface ActionSignal {
    stems: string[];
    action: ActionType;
}

/** טבלת זיהוי הפעולה. הסדר קובע עדיפות (הראשון שמתאים נבחר). */
export const ACTION_SIGNALS: ActionSignal[] = [
    { stems: ['מחק'], action: 'delete' },
    { stems: ['סגור', 'תסגור'], action: 'close' },
    { stems: ['שלח'], action: 'send' },
    { stems: ['עדכן'], action: 'update' },
    { stems: ['הכן', 'נסח', 'טיוט'], action: 'draft' },
    { stems: ['סכם', 'סיכום'], action: 'summarize' },
    { stems: ['נתח'], action: 'analyze' },
    { stems: ['הצע'], action: 'suggest' },
    { stems: ['בדוק', 'קרא', 'שלוף'], action: 'read' },
];

/** הפניות עמומות שמסמנות עמימות. */
const VAGUE_STEMS = ['אותו', 'אותה', 'אותם', 'עליו', 'איתו', 'זה'];
/** עוגנים קונקרטיים שמבטלים עמימות. */
const ANCHOR_STEMS = ['חביל', 'הודע', 'לקוח', 'משלוח', 'סטטוס', 'תשלום', 'הזמנ', 'מייל'];

const hasAny = (tokens: string[], stems: string[]) => stems.some((s) => tokens.some((t) => t.includes(s)));

/** מזהה את הפעולה הראשונה בטקסט (null אם אין). */
export function detectAction(tokens: string[]): ActionType | null {
    for (const sig of ACTION_SIGNALS) {
        if (hasAny(tokens, sig.stems)) return sig.action;
    }
    return null;
}

/** עמימות: יש הפניה עמומה ואין עוגן קונקרטי. */
export function detectAmbiguous(tokens: string[]): boolean {
    return hasAny(tokens, VAGUE_STEMS) && !hasAny(tokens, ANCHOR_STEMS);
}

/* ─────────────────────── שער האישור וההחלטה ─────────────────────────────── */

export function gateState(risk: RiskLevel, permission: Permission): GateState {
    if (permission === 'blocked' || risk === 'critical') return 'blocked';
    if (permission === 'requires-approval' || risk === 'high') return 'approval';
    return 'open';
}

/* ─────────────────────── הקשר ומצב הבקרה ────────────────────────────────── */

export interface ControlContext {
    confidence: Confidence;
    /** האם הבקשה סותרת את ה-Observation. */
    conflict: boolean;
    /** האם הראיות אומתו (Evidence verified). */
    evidenceVerified: boolean;
}

export interface ControlCheck {
    id: string;
    labelHe: string;
    labelEn: string;
    pass: boolean;
}

export interface ControlState {
    text: string;
    tokens: string[];
    action: ActionType | null;
    risk: RiskLevel;
    permission: Permission;
    ambiguous: boolean;
    conflict: boolean;
    evidenceVerified: boolean;
    confidence: Confidence;
    gate: GateState;
    /** action_allowed = confidence_high AND risk_low AND permission_granted. */
    actionAllowed: boolean;
    decision: ControlDecision;
    /** שלוש הבדיקות של Stop Before Action. */
    checks: ControlCheck[];
}

/** סדר העדיפויות מקודד את היושרה: עמימות וסתירה עוצרות לפני שמגיעים לסיכון. */
function decide(s: { ambiguous: boolean; conflict: boolean; permission: Permission; risk: RiskLevel; confidence: Confidence }): ControlDecision {
    if (s.ambiguous) return 'ask-clarify';
    if (s.conflict) return 'stop-conflict';
    if (s.permission === 'blocked' || s.risk === 'critical') return 'blocked';
    if (s.confidence === 'high' && s.risk === 'low' && s.permission === 'allowed') return 'answer';
    if (s.permission === 'requires-approval' || s.risk === 'high') return 'stop-approval';
    return 'draft'; // סיכון בינוני, הרשאה קיימת
}

/**
 * הפונקציה היחידה שמכריעה את שכבת הבקרה. מקבלת טקסט והקשר, ומחזירה את כל
 * מצב הבקרה: סיכון, הרשאה, שער אישור, action_allowed, וההחלטה.
 */
export function evaluate(text: string, ctx: ControlContext): ControlState {
    const tokens = tokenize(text);
    const action = detectAction(tokens);
    const risk: RiskLevel = action ? RISK_BY_ACTION[action] : 'low';
    const permission: Permission = action ? PERMISSION_BY_ACTION[action] : 'allowed';
    const ambiguous = detectAmbiguous(tokens);

    const actionAllowed =
        ctx.confidence === 'high' && risk === 'low' && permission === 'allowed' && !ctx.conflict && !ambiguous;

    const decision = decide({ ambiguous, conflict: ctx.conflict, permission, risk, confidence: ctx.confidence });

    const checks: ControlCheck[] = [
        { id: 'evidence', labelHe: 'הראיות אומתו', labelEn: 'Evidence verified', pass: ctx.evidenceVerified },
        { id: 'risk', labelHe: 'סיכון נמוך', labelEn: 'Risk low', pass: risk === 'low' },
        { id: 'permission', labelHe: 'הרשאה קיימת', labelEn: 'Permission granted', pass: permission === 'allowed' },
    ];

    return {
        text,
        tokens,
        action,
        risk,
        permission,
        ambiguous,
        conflict: ctx.conflict,
        evidenceVerified: ctx.evidenceVerified,
        confidence: ctx.confidence,
        gate: gateState(risk, permission),
        actionAllowed,
        decision,
        checks,
    };
}
