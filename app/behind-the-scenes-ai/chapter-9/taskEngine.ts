// מנוע פירוק המשימה של פרק 9: "מ-Prompt למשימה".
// קובץ טהור לחלוטין: אין כאן React, אין נתוני תוכן, אין LLM, אין רשת.
// זהו task parser דטרמיניסטי ושקוף: הוא מפרק בקשה לרכיבים לפי טבלת חוקים
// קבועה, ומכל פירוק נגזרת החלטה. אותו קלט תמיד נותן אותו פלט.
//
// הרעיון המרכזי של הפרק: Agent מתחיל בלזהות מה המשתמש רוצה שיקרה. לפני
// שהוא פועל הוא צריך לדעת מה המשימה, מה חסר, ומה מותר. זיהוי משימה אינו
// אישור לפעול: task_score גבוה יכול לדור בכפיפה אחת עם Ready to act = No.
//
// השרשרת:
//   Action signal -> Goal -> Domain -> Required data -> Missing data -> Risk
//   task_score = action_signal + goal_clarity + required_data_presence
//   decision   = נגזרת מהפירוק (Answer / Ask / Use tool / Stop for approval)
//
// המנוע גנרי: הוא מקבל את טבלאות החוקים (פעולות, תחומים, הפניות עמומות)
// מבחוץ דרך EngineTables. כל הנתונים הניתנים לכוונון יושבים ב-taskData.ts.

/* ─────────────────────────────── טיפוסים ────────────────────────────────── */

/** עוצמת ה-Action signal. high = פעולה מובהקת, low = רמז חלש. */
export type ActionStrength = 'high' | 'low';

/** רמת הסיכון של הפעולה. גבוה = פעולה רגישה שדורשת אישור. */
export type RiskLevel = 'low' | 'high';

/** קטגוריית הפעולה. קובעת איזה מידע נדרש ואיזו מטרה נבנית. */
export type ActionCategory = 'investigate' | 'notify' | 'update' | 'handle';

/** סוג הבקשה: שאלה (להסביר) מול משימה (לבצע). */
export type RequestType = 'question' | 'task';

/** בהירות המשימה. */
export type ClarityLevel = 'low' | 'medium' | 'high';

/** סוג ההחלטה שיוצאת מהפירוק. ארבע אפשרויות, כמו ב-Answer or Act Panel. */
export type TaskDecisionKind = 'answer' | 'ask-info' | 'use-tool' | 'stop-approval';

/** האם נדרש כלי. */
export type ToolNeed = 'no' | 'likely' | 'yes';

/** הגדרת מילת Action signal בטבלה. */
export interface ActionDef {
    /** הצורה כפי שהיא מופיעה בבקשה (למשל "בדוק"). */
    word: string;
    /** תרגום אנגלי קצר של הפעולה. */
    en: string;
    /** תבנית עברית לבניית המטרה (למשל "בדיקת"). */
    goalVerbHe: string;
    /** תבנית אנגלית לבניית המטרה (למשל "Check"). */
    goalVerbEn: string;
    strength: ActionStrength;
    category: ActionCategory;
    risk: RiskLevel;
}

/** הגדרת פריט מידע נדרש (למשל ברקוד). */
export interface DataReqDef {
    id: string;
    he: string;   // "ברקוד"
    en: string;   // "Barcode"
    /** מקור regex לזיהוי נוכחות הפריט בטקסט הגולמי. */
    pattern: string;
}

/** חוק תחום (Domain): מילות מפתח, שם המטרה, והמידע שנדרש בתחום הזה. */
export interface DomainRule {
    id: string;
    he: string;   // "משלוחים"
    en: string;   // "Delivery"
    /** גזעי מילים לזיהוי (התאמת תת-מחרוזת, כדי לעקוף תחיליות עבריות). */
    keywords: string[];
    goalNounHe: string;  // "כשל במסירה"
    goalNounEn: string;  // "delivery failure"
    /** מידע שנדרש כשפעולת investigate מכוונת לתחום הזה. */
    requires: DataReqDef[];
}

/** טבלאות החוקים שהמנוע צורך. כולן ניתנות לכוונון מבחוץ. */
export interface EngineTables {
    actions: ActionDef[];
    domains: DomainRule[];
    /** הפניות עמומות ("זה", "בזה") שמסמנות יעד לא ברור. */
    vagueRefs: string[];
}

/** סטטוס פריט מידע נדרש: מה נדרש והאם הוא קיים. */
export interface DataStatus {
    def: DataReqDef;
    present: boolean;
}

/** פירוק הציון לשלושת הרכיבים שבנוסחה. */
export interface ScoreBreakdown {
    action: number; // action_signal
    goal: number;   // goal_clarity
    data: number;   // required_data_presence
    total: number;
}

/** הפלט המלא של המנוע: תמונת מצב של המשימה. */
export interface TaskAnalysis {
    text: string;
    tokens: string[];
    requestType: RequestType;
    action: ActionDef | null;
    domain: DomainRule | null;
    vagueReference: boolean;
    goalClear: boolean;
    goalHe: string;  // '' כשהמטרה לא ברורה
    goalEn: string;
    requiredData: DataStatus[];
    missingData: DataReqDef[];
    risk: RiskLevel;
    toolNeed: ToolNeed;
    decision: TaskDecisionKind;
    decisionDetailHe: string;
    decisionDetailEn: string;
    /** ביטחון/בהירות המשימה. null עבור שאלה (לא משימה). */
    clarity: ClarityLevel | null;
    clarityReasonHe: string;
    score: ScoreBreakdown;
    /** עוצמת זיהוי המשימה (להבדיל מ-Ready to act). */
    taskDetected: 'none' | 'low' | 'high';
    /** האם מוכן לפעול. high task_score יכול עדיין להיות false. */
    readyToAct: boolean;
}

/* ─────────────────────────── עזרי טוקניזציה ─────────────────────────────── */

const PUNCT = /[?.!,;:"'()־]/g;

/** מפצל טקסט לטוקנים, מקלף פיסוק. דטרמיניסטי. */
export function tokenize(text: string): string[] {
    return text.replace(PUNCT, ' ').trim().split(/\s+/).filter(Boolean);
}

/** התאמת גזע: טוקן מכיל את הגזע כתת-מחרוזת (עוקף תחיליות כמו ה, ב, ל). */
function tokenMatches(token: string, stem: string): boolean {
    return token.includes(stem);
}

/* ─────────────────────────── שלבי הפירוק ────────────────────────────────── */

/** מאתר את מילת ה-Action הראשונה בטקסט (אם יש). */
export function detectAction(tokens: string[], actions: ActionDef[]): ActionDef | null {
    for (const a of actions) {
        if (tokens.some((t) => tokenMatches(t, a.word))) return a;
    }
    return null;
}

/** מאתר את התחום הראשון שמילות המפתח שלו מופיעות בטקסט. */
export function detectDomain(tokens: string[], domains: DomainRule[]): DomainRule | null {
    for (const d of domains) {
        if (tokens.some((t) => d.keywords.some((k) => tokenMatches(t, k)))) return d;
    }
    return null;
}

/** האם הטקסט מכיל הפניה עמומה ("זה", "בזה") ללא עוגן. */
export function detectVague(tokens: string[], vagueRefs: string[]): boolean {
    return tokens.some((t) => vagueRefs.includes(t));
}

/* ─────────────────────────── המנוע הראשי ────────────────────────────────── */

/**
 * מפרק בקשה לתמונת מצב מלאה של משימה, וגוזר ממנה החלטה.
 * זו הפונקציה היחידה שמכריעה את סוג הבקשה, המטרה, המידע החסר וההחלטה.
 */
export function analyzeTask(text: string, tables: EngineTables): TaskAnalysis {
    const tokens = tokenize(text);

    const action = detectAction(tokens, tables.actions);
    const domain = detectDomain(tokens, tables.domains);
    const vagueReference = detectVague(tokens, tables.vagueRefs);

    // סוג הבקשה: נוכחות פעולה הופכת שאלה למשימה. זו נקודת המפנה של הפרק.
    const requestType: RequestType = action ? 'task' : 'question';

    // מטרה אופרטיבית: ברורה רק כשזוהה תחום. הפניה עמומה ללא תחום נשארת לא ברורה.
    const goalClear = requestType === 'task' && domain !== null;
    const goalHe = goalClear && action && domain ? `${action.goalVerbHe} ${domain.goalNounHe}` : '';
    const goalEn = goalClear && action && domain ? `${action.goalVerbEn} ${domain.goalNounEn}` : '';

    // מידע נדרש: רק כשפעולת investigate מכוונת לתחום שדורש מידע.
    const requiredDefs: DataReqDef[] =
        action && action.category === 'investigate' && domain ? domain.requires : [];
    const requiredData: DataStatus[] = requiredDefs.map((def) => ({
        def,
        present: new RegExp(def.pattern).test(text),
    }));
    const missingData = requiredData.filter((d) => !d.present).map((d) => d.def);

    const risk: RiskLevel = action ? action.risk : 'low';

    // ── ההחלטה: נגזרת מהפירוק, לפי סדר עדיפויות ברור ──────────────────────
    let decision: TaskDecisionKind;
    if (requestType === 'question') {
        decision = 'answer';
    } else if (!goalClear) {
        decision = 'ask-info'; // מטרה לא ברורה: לבקש הבהרה לפני הכל
    } else if (risk === 'high') {
        decision = 'stop-approval'; // פעולה רגישה: לעצור לאישור, גם אם הכל ברור
    } else if (missingData.length > 0) {
        decision = 'ask-info'; // חסר מידע: לבקש אותו. זה הצעד המקצועי, לא תקלה
    } else {
        decision = 'use-tool'; // מטרה ברורה, מידע מלא, סיכון נסבל: מוכן לכלי
    }

    // צורך בכלי
    let toolNeed: ToolNeed;
    if (requestType === 'question' || !goalClear) toolNeed = 'no';
    else if (action && action.category === 'investigate') toolNeed = missingData.length > 0 ? 'likely' : 'yes';
    else toolNeed = 'yes';

    // בהירות המשימה
    let clarity: ClarityLevel | null;
    let clarityReasonHe: string;
    if (requestType === 'question') {
        clarity = null;
        clarityReasonHe = 'זו שאלה, לא משימה. המסלול הוא הסבר, לא ביצוע.';
    } else if (!goalClear) {
        clarity = 'low';
        clarityReasonHe = vagueReference
            ? 'היעד עמום: לא ברור למה "זה" מתייחס.'
            : 'לא זוהתה מטרה אופרטיבית מהבקשה.';
    } else if (missingData.length > 0) {
        clarity = 'medium';
        clarityReasonHe = `המטרה ברורה, אבל חסר מידע נדרש (${missingData.map((d) => d.he).join(', ')}).`;
    } else {
        clarity = 'high';
        clarityReasonHe = 'המטרה ברורה וכל המידע הנדרש קיים.';
    }

    // ── task_score = action_signal + goal_clarity + required_data_presence ──
    const actionScore = action ? (action.strength === 'high' ? 1 : 0.5) : 0;
    const goalScore = goalClear ? 1 : 0;
    const dataScore = requiredData.length === 0
        ? 1
        : requiredData.filter((d) => d.present).length / requiredData.length;
    const score: ScoreBreakdown = {
        action: actionScore,
        goal: goalScore,
        data: dataScore,
        total: actionScore + goalScore + dataScore,
    };

    const taskDetected: TaskAnalysis['taskDetected'] =
        requestType === 'question' ? 'none' : action && action.strength === 'high' ? 'high' : 'low';

    const readyToAct = decision === 'use-tool';

    // פרטי ההחלטה (טקסט דו-לשוני)
    const { he: decisionDetailHe, en: decisionDetailEn } = decisionDetail(
        decision,
        vagueReference,
        missingData[0] ?? null,
    );

    return {
        text,
        tokens,
        requestType,
        action,
        domain,
        vagueReference,
        goalClear,
        goalHe,
        goalEn,
        requiredData,
        missingData,
        risk,
        toolNeed,
        decision,
        decisionDetailHe,
        decisionDetailEn,
        clarity,
        clarityReasonHe,
        score,
        taskDetected,
        readyToAct,
    };
}

/** בונה את הניסוח המדויק של ההחלטה לפי ההקשר (מה חסר, האם היעד עמום). */
function decisionDetail(
    kind: TaskDecisionKind,
    vague: boolean,
    firstMissing: DataReqDef | null,
): { he: string; en: string } {
    switch (kind) {
        case 'answer':
            return { he: 'מתן תשובה', en: 'Answer' };
        case 'use-tool':
            return { he: 'מוכן לבחירת כלי', en: 'Ready for tool selection' };
        case 'stop-approval':
            return { he: 'עצירה לאישור אנושי', en: 'Stop for approval' };
        case 'ask-info':
            if (firstMissing) return { he: `בקשת ${firstMissing.he}`, en: `Ask for ${firstMissing.en.toLowerCase()}` };
            if (vague) return { he: 'בקשת הבהרה: למה מתייחס "זה"?', en: 'Ask what "this" refers to' };
            return { he: 'בקשת הבהרה על המטרה', en: 'Ask to clarify the goal' };
    }
}

/* ─────────────────────────── תוויות החלטה ───────────────────────────────── */

/** ארבע ההחלטות של Answer or Act, עם הטון הצבעוני שלהן. */
export const DECISION_META: Record<
    TaskDecisionKind,
    { he: string; en: string; tone: 'answer' | 'ask' | 'tool' | 'stop' }
> = {
    answer: { he: 'מתן תשובה', en: 'Answer', tone: 'answer' },
    'ask-info': { he: 'בקשת מידע נוסף', en: 'Ask for more information', tone: 'ask' },
    'use-tool': { he: 'הפעלת כלי', en: 'Use tool', tone: 'tool' },
    'stop-approval': { he: 'עצירה לאישור', en: 'Stop for approval', tone: 'stop' },
};
