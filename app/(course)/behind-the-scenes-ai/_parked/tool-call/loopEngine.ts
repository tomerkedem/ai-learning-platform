// מנוע לולאת ה-Agent של פרק 12: "Tool Call, Observation והחלטה הבאה".
// קובץ טהור לחלוטין: אין כאן React, אין נתוני תוכן, אין LLM, אין רשת, אין
// קריאת API אמיתית. הכלי מדומה וה-Observation מגיעה מטבלת תרחישים קבועה.
//
// הרעיון המרכזי: Agent פועל בלולאה, לא בקו ישר. הוא מחליט, מפעיל כלי, קורא
// תוצאה (Observation), ומחליט שוב לפיה. Tool Call אינו סוף הסיפור, הוא רק
// דרך להביא Observation חדשה.
//
// הנוסחה:
//   next_decision = f(observation_quality, confidence, risk_level)
//   can_answer    = observation_quality high AND confidence high AND risk acceptable AND no conflict
//
// עקרונות יושרה שהמנוע אוכף:
//   * Observation חלשה מובילה לזהירות, לא להמצאה.
//   * Observation סותרת לא פוסלת את המשתמש, אלא מציפה את הסתירה.
//   * גם אחרי תוצאה טובה, שער הסיכון נשאר: סיכון גבוה מוביל לאישור.
//   * Tool selected אינו Tool called: בלי קלט תקין הקריאה לא מופעלת.

/* ─────────────────────────────── טיפוסים ────────────────────────────────── */

export type ObservationQuality = 'high' | 'medium' | 'low';
export type Confidence = 'high' | 'medium' | 'low';
export type RiskLevel = 'low' | 'medium' | 'high';

/** ההחלטה הבאה אחרי קריאת התוצאה. */
export type NextDecision =
    | 'answer'             // תוצאה ברורה, אפשר לענות
    | 'another-tool'       // תוצאה חלשה, לנסות צעד אחר
    | 'ask'                // לבקש מידע נוסף
    | 'flag-conflict'      // תוצאה סותרת, להציף את הסתירה
    | 'explain-limitation' // להסביר שאין סטטוס נוכחי
    | 'stop-approval'      // סיכון גבוה, לעצור לאישור
    | 'ask-input';         // הכלי לא הופעל, חסר קלט

/** מצב שלב בציר הזמן. */
export type StepState = 'done' | 'active' | 'blocked' | 'pending';

export interface TimelineStepDef {
    id: string;
    he: string;
    en: string;
}

/** ששת שלבי לולאת ה-Agent, בסדר הביצוע. */
export const TIMELINE_STEPS: TimelineStepDef[] = [
    { id: 'understand', he: 'הבנת המשימה', en: 'Understand Task' },
    { id: 'select', he: 'בחירת כלי', en: 'Select Tool' },
    { id: 'prepare', he: 'הכנת קלט', en: 'Prepare Tool Input' },
    { id: 'call', he: 'הפעלת כלי', en: 'Call Tool' },
    { id: 'observe', he: 'קבלת תוצאה', en: 'Receive Observation' },
    { id: 'decide', he: 'החלטת הצעד הבא', en: 'Decide Next Step' },
];

/** האינדקס של שלב ה-Call Tool (נחסם כשאין קלט). */
export const CALL_STEP_INDEX = 3;

/* ─────────────────────── מצבי ציר הזמן ──────────────────────────────────── */

/**
 * מחשב את מצב כל שלב בציר הזמן.
 *   toolCalled = false: השלבים 0..2 הושלמו, Call Tool נחסם, השאר ממתינים.
 *   replayStep >= 0: מצב ניגון חוזר. שלבים לפני הסמן = done, הסמן = active,
 *     אחריו = pending. כך אפשר לעצור בכל שלב ולראות מה הוביל לבא.
 */
export function timelineStates(toolCalled: boolean, replayStep: number): StepState[] {
    const maxReachable = toolCalled ? TIMELINE_STEPS.length - 1 : CALL_STEP_INDEX;
    const cursor = replayStep >= 0 ? replayStep : maxReachable;

    return TIMELINE_STEPS.map((_, i) => {
        if (!toolCalled && i === CALL_STEP_INDEX) {
            return i <= cursor ? 'blocked' : 'pending';
        }
        if (!toolCalled && i > CALL_STEP_INDEX) return 'pending';
        if (i < cursor) return 'done';
        if (i === cursor) {
            // במצב סטטי, השלב האחרון שהגענו אליו הוא ה"חי"; שלבים קודמים done.
            if (replayStep < 0 && i !== maxReachable) return 'done';
            return 'active';
        }
        return 'pending';
    });
}

/** מספר השלבים שניתן לנגן (תלוי אם הכלי הופעל). */
export function maxReplayStep(toolCalled: boolean): number {
    return toolCalled ? TIMELINE_STEPS.length - 1 : CALL_STEP_INDEX;
}

/* ─────────────────────── ההחלטה הבאה ────────────────────────────────────── */

export interface DecisionInput {
    /** האם הכלי הופעל בפועל (קלט תקין קיים). */
    toolCalled: boolean;
    quality: ObservationQuality;
    confidence: Confidence;
    risk: RiskLevel;
    /** האם התוצאה סותרת את מה שהמשתמש אמר. */
    conflict: boolean;
    /** האם הכלי החזיר סטטוס כלשהו (false עבור Unknown). */
    hasStatus: boolean;
}

/**
 * can_answer: רק תוצאה איכותית, עם ביטחון גבוה, סיכון נסבל, ובלי סתירה,
 * מאפשרת לענות. כל חריגה מובילה לזהירות, לא להמצאה.
 */
export function canAnswer(input: DecisionInput): boolean {
    return (
        input.toolCalled &&
        input.quality === 'high' &&
        input.confidence === 'high' &&
        input.risk !== 'high' &&
        !input.conflict
    );
}

/**
 * הפונקציה היחידה שמכריעה את הצעד הבא. סדר העדיפויות מקודד את היושרה:
 * קודם בודקים שהכלי הופעל, אז את שער הסיכון (שנשאר גם אחרי תוצאה טובה),
 * אז סתירה, ורק אז איכות התוצאה.
 */
export function decideNext(input: DecisionInput): NextDecision {
    if (!input.toolCalled) return 'ask-input';      // Tool selected אינו Tool called
    if (input.risk === 'high') return 'stop-approval'; // שער הסיכון נשאר
    if (input.conflict) return 'flag-conflict';      // להציף, לא לפסול את המשתמש
    if (input.quality === 'high' && input.confidence === 'high') return 'answer';
    // תוצאה חלשה: צעד אחר (כלי אחר / שאלה / הסבר מגבלה), לעולם לא המצאת סיבה.
    if (input.quality === 'low') return 'another-tool';
    return 'ask'; // medium
}
