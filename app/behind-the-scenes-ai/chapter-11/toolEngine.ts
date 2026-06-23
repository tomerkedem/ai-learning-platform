// מנוע בחירת הכלי של פרק 11: "בחירת Tool, מתי Agent צריך כלי".
// קובץ טהור לחלוטין: אין כאן React, אין נתוני תוכן, אין LLM, אין רשת, אין
// קריאת API אמיתית. זהו tool selector דטרמיניסטי ושקוף: הוא מדרג כלים לפי
// טבלת חוקים קבועה ומכריע אם כלי נבחר, נחסם, או לא נדרש כלל.
//
// הרעיון המרכזי: Agent לא רץ לכלי. הוא מדרג התאמה, בודק אם הקלט קיים, בודק
// סיכון, בודק הרשאה, ורק אז מחליט. כלי יכול להיות מתאים מאוד ועדיין חסום.
//
// השרשרת והנוסחה:
//   tool_score = task_match + data_match - risk_penalty
//   ארבעת השערים: Match high AND Input ready AND Risk acceptable AND Permission allowed
//   כלי נבחר רק כשכל הארבעה ירוקים.
//
// המנוע צורך את מצב המשימה של פרק 10 (TaskAnalysis) ואינו מחשב מחדש את הפירוק.
// כל הנתונים הניתנים לכוונון (לוח הכלים, חוקי ההתאמה) יושבים ב-toolData.ts.

import type { TaskAnalysis, ActionCategory } from '@/app/behind-the-scenes-ai/chapter-10/taskEngine';
import type { Accent } from '@/components/ai-internals/types';

/* ─────────────────────────────── טיפוסים ────────────────────────────────── */

/** רמת הסיכון של הכלי. read only = low, מול לקוח = high. */
export type ToolRisk = 'low' | 'medium' | 'high';

/**
 * מצב ההרשאה של הכלי:
 *  none     = לא נדרשת הרשאה (חיפוש ציבורי).
 *  required = נדרשת הרשאה, והיא קיימת בסביבה הזו (מותר).
 *  approval = נדרש אישור אנושי לפני הפעלה.
 *  missing  = נדרשת הרשאה, והיא חסרה (אסור).
 */
export type ToolPermission = 'none' | 'required' | 'approval' | 'missing';

/** קלט נדרש לכלי, עם regex לזיהוי נוכחותו בטקסט. */
export interface RequiredInput {
    he: string;
    en: string;
    /** מקור regex. הקלט "קיים" אם הביטוי מותאם בטקסט הגולמי. */
    pattern: string;
}

/**
 * חוק התאמה: כמה הכלי מתאים כשהתנאים מתקיימים.
 *  category   = קטגוריית הפעולה (investigate / notify / update / handle).
 *  anySignals = לפחות אחד מהגזעים מופיע בטקסט.
 *  allSignals = כל הגזעים מופיעים בטקסט.
 * הציון הסופי של הכלי הוא ה-max בין החוקים שמתקיימים, אחרת baseMatch.
 */
export interface MatchRule {
    category?: ActionCategory;
    anySignals?: string[];
    allSignals?: string[];
    score: number;
}

/** הגדרת כלי: יכולת מוגדרת עם גבולות, לא יכולת על. */
export interface ToolDef {
    id: string;
    nameEn: string;
    nameHe: string;
    /** מה הכלי יודע לעשות. */
    canDoHe: string;
    canDoEn: string;
    /** איזה מידע הוא מחזיר. */
    returnsHe: string;
    /** מה אסור לו (הגבול). */
    cannotHe: string;
    /** הקלט הנדרש (null אם אינו דורש קלט). */
    requiredInput: RequiredInput | null;
    risk: ToolRisk;
    permission: ToolPermission;
    accent: Accent;
    /** ציון התאמה בסיסי כשאף חוק לא מתקיים. */
    baseMatch: number;
    matchRules: MatchRule[];
}

/* ─────────────────────── עזרי התאמת גזע (כמו פרק 10) ─────────────────────── */

function hasAny(tokens: string[], stems: string[]): boolean {
    return stems.some((s) => tokens.some((t) => t.includes(s)));
}

function hasAll(tokens: string[], stems: string[]): boolean {
    return stems.every((s) => tokens.some((t) => t.includes(s)));
}

/** ציון ההתאמה של כלי למשימה (0..1). max על החוקים שמתקיימים. */
export function matchScore(tool: ToolDef, ctx: TaskAnalysis): number {
    const tokens = ctx.tokens;
    const category = ctx.action?.category ?? null;
    let best = tool.baseMatch;
    for (const r of tool.matchRules) {
        if (r.category && r.category !== category) continue;
        if (r.allSignals && !hasAll(tokens, r.allSignals)) continue;
        if (r.anySignals && !hasAny(tokens, r.anySignals)) continue;
        if (r.score > best) best = r.score;
    }
    return best;
}

/* ─────────────────────────── ניקוד וסיכון ───────────────────────────────── */

/** הסיכון מוריד מהציון. כלי מסוכן מתחיל בחיסרון מול כלי שקורא בלבד. */
export const RISK_PENALTY: Record<ToolRisk, number> = { low: 0.1, medium: 0.25, high: 0.55 };

/** סף ההתאמה שמעליו כלי נחשב "רלוונטי" (עובר את שער ה-Match). */
export const MATCH_THRESHOLD = 0.5;

/** האם ההרשאה מאפשרת הפעלה אוטונומית. */
export function permissionAllowed(p: ToolPermission): boolean {
    return p === 'none' || p === 'required';
}

/* ─────────────────────── הערכת כלי בודד ─────────────────────────────────── */

export interface ToolGates {
    matchPass: boolean;
    inputPass: boolean;
    riskPass: boolean;
    permPass: boolean;
}

export interface ToolEval {
    tool: ToolDef;
    match: number;       // 0..1
    dataReady: boolean;
    dataMatch: number;   // רכיב בנוסחה
    riskPenalty: number; // רכיב בנוסחה
    toolScore: number;   // task_match + data_match - risk_penalty
    gates: ToolGates;
    selectable: boolean; // כל ארבעת השערים ירוקים
}

/** מעריך כלי בודד מול מצב המשימה והטקסט הגולמי. */
export function evaluateTool(tool: ToolDef, ctx: TaskAnalysis, text: string): ToolEval {
    const match = matchScore(tool, ctx);
    const dataReady = tool.requiredInput ? new RegExp(tool.requiredInput.pattern).test(text) : true;
    // data_match: כלי שדורש קלט מקבל 0.80 כשהוא קיים, 0.20 כשחסר. כלי בלי קלט נדרש מקבל 0.50 ניטרלי.
    const dataMatch = tool.requiredInput ? (dataReady ? 0.8 : 0.2) : 0.5;
    const riskPenalty = RISK_PENALTY[tool.risk];
    const toolScore = match + dataMatch - riskPenalty;

    const gates: ToolGates = {
        matchPass: match >= MATCH_THRESHOLD,
        inputPass: dataReady,
        riskPass: tool.risk !== 'high',
        permPass: permissionAllowed(tool.permission),
    };
    const selectable = gates.matchPass && gates.inputPass && gates.riskPass && gates.permPass;

    return { tool, match, dataReady, dataMatch, riskPenalty, toolScore, gates, selectable };
}

/* ─────────────────────────── ההחלטה הכוללת ──────────────────────────────── */

export type ToolDecisionKind =
    | 'no-tool'        // אין צורך בכלי (שאלה) או אין כלי מתאים
    | 'clarify'        // יעד עמום, צריך הבהרה לפני בחירת כלי
    | 'ask-input'      // כלי רלוונטי אבל חסר קלט
    | 'stop-approval'  // כלי רלוונטי אבל סיכון גבוה / נדרש אישור
    | 'cannot-use'     // כלי רלוונטי, קלט קיים, אבל חסרה הרשאה
    | 'ready';         // כל השערים ירוקים, מוכן להפעלה

/** הסיבה לכך שאין צורך בכלי: שאלה שאפשר לענות עליה, מול אין כלי מתאים. */
export type NoToolReason = 'answerable' | 'no-match' | null;

export interface ToolSelection {
    evals: ToolEval[];          // ממוין לפי match יורד
    decision: ToolDecisionKind;
    selectedToolId: string | null;
    topRelevantId: string | null;
    noToolReason: NoToolReason;
    missingInputHe: string | null;
    reasonHe: string;
}

/**
 * מדרג את כל הכלים ומכריע את ההחלטה. זו הפונקציה היחידה שקובעת אם כלי נבחר,
 * נחסם, או שלא נדרש כלי. כל מספר במסך נגזר מכאן, אף אחד לא מקודד קשיח.
 */
export function selectTool(ctx: TaskAnalysis, text: string, tools: ToolDef[]): ToolSelection {
    const evals = tools.map((t) => evaluateTool(t, ctx, text)).sort((a, b) => b.match - a.match);
    const topRelevant = evals.find((e) => e.gates.matchPass) ?? null;
    const topRelevantId = topRelevant?.tool.id ?? null;

    let decision: ToolDecisionKind;
    let selectedToolId: string | null = null;
    let noToolReason: NoToolReason = null;
    let missingInputHe: string | null = null;
    let reasonHe = '';

    if (ctx.requestType === 'question') {
        decision = 'no-tool';
        noToolReason = 'answerable';
        reasonHe = 'זו שאלה כללית, לא משימה. אפשר לענות עליה ישירות בלי להפעיל כלי. שימוש בכלי כאן היה מיותר, וזה שיקול דעת, לא חוסר יכולת.';
    } else if (!ctx.goalClear) {
        decision = 'clarify';
        reasonHe = 'יש פעולה, אבל היעד עמום. לפני שבוחרים כלי צריך להבהיר מה בדיוק המטרה.';
    } else if (!topRelevant) {
        decision = 'no-tool';
        noToolReason = 'no-match';
        reasonHe = 'אף כלי לא מתאים מספיק למשימה הזו. הצעד הנכון הוא לענות או לבקש הבהרה, לא להפעיל כלי שלא מתאים.';
    } else {
        const t = topRelevant;
        if (!t.gates.inputPass) {
            decision = 'ask-input';
            missingInputHe = t.tool.requiredInput?.he ?? null;
            reasonHe = `הכלי ${t.tool.nameEn} מתאים למשימה, אבל חסר לו הקלט הנדרש (${t.tool.requiredInput?.he ?? 'קלט'}). הצעד הנכון הוא לבקש אותו, לא להפעיל את הכלי בלעדיו.`;
        } else if (!t.gates.riskPass) {
            decision = 'stop-approval';
            reasonHe = `הכלי ${t.tool.nameEn} מתאים והקלט קיים, אבל הסיכון שלו גבוה: זו פעולה שמשנה מצב מול גורם אמיתי. עוצרים לאישור אנושי לפני הפעלה.`;
        } else if (t.tool.permission === 'approval') {
            decision = 'stop-approval';
            reasonHe = `הכלי ${t.tool.nameEn} מתאים, אבל הוא דורש אישור אנושי לפני הפעלה.`;
        } else if (!t.gates.permPass) {
            decision = 'cannot-use';
            reasonHe = `הכלי ${t.tool.nameEn} מתאים והקלט קיים, אבל חסרה הרשאה להשתמש בו. הצעד הנכון הוא לבקש הרשאה או לעצור, לא לעקוף.`;
        } else {
            decision = 'ready';
            selectedToolId = t.tool.id;
            reasonHe = `הכלי ${t.tool.nameEn} עבר את כל ארבעת השערים: התאמה גבוהה, קלט קיים, סיכון נסבל, והרשאה קיימת. מוכן להפעלה.`;
        }
    }

    return { evals, decision, selectedToolId, topRelevantId, noToolReason, missingInputHe, reasonHe };
}
