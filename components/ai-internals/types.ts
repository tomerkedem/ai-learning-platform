// components/ai-internals/types.ts
// טיפוסי ליבה לקומפוננטות "מאחורי הקלעים של AI".
// אלו primitives גנריים: הם לא יודעים דבר על פרק מסוים, על Chat/Agent אמיתיים
// או על מנוע הסתברות. כל הנתונים מגיעים מבחוץ דרך props.

/** מצב התהליך: שיחה רגילה מול Agent שמנהל משימה. */
export type FlowMode = 'chat' | 'agent';

/** מצב תצוגה: מה שהמשתמש רגיל לראות מול מה שמתרחש מאחורי הקלעים. */
export type ViewMode = 'regular' | 'behind';

/** סוג ההחלטה הסופית שהמערכת מגיעה אליה. */
export type DecisionKind = 'answer' | 'ask' | 'tool' | 'stop';

/** גוון ויזואלי מתוך קבוצה סגורה (כדי להישאר בטוח מול Tailwind JIT). */
export type Accent =
    | 'cyan'
    | 'blue'
    | 'indigo'
    | 'purple'
    | 'amber'
    | 'emerald'
    | 'rose'
    | 'slate';

/** שלב בודד במסלול עיבוד. ניטרלי לחלוטין לתוכן. */
export interface FlowStep {
    id: string;
    title: string;
    detail?: string;
}

/** תיאור ההחלטה הסופית להצגה ב-DecisionCard. */
export interface DecisionState {
    kind: DecisionKind;
    label: string;
    detail?: string;
}

/** הודעה בודדת בממשק הצ'אט. */
export interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    text: string;
}

/** כוונה בודדת עם הסתברות (0-100) לתצוגת ProbabilityBars. */
export interface IntentProbability {
    label: string;
    value: number;
}

/** רמת סיכון של בקשה (Risk and Responsibility Meter). */
export type RiskLevel = 'low' | 'medium' | 'high';

/** מסלול ניתוב אפשרי ב-Route Switchboard. תת-קבוצה תואמת ל-DecisionKind. */
export type RouteKind = 'answer' | 'ask' | 'tool' | 'stop';

/** שלב כוונה ב-Intent Shift: שאלה -> בדיקה -> פעולה. */
export type IntentStage = 'question' | 'investigation' | 'action';

/** עוצמת ההשפעה של רמז על ההחלטה (להמחשה לימודית בלבד). */
export type SignalStrength = 'low' | 'medium' | 'high';

/**
 * רמז החלטה: סימן בפרומט שמשפיע על זיהוי הכוונה והמסלול.
 * זו המחשה לימודית - לא chain of thought אמיתי של המודל.
 */
export interface DecisionSignal {
    /** המילה או הסימן בפרומט (למשל "בדוק"). */
    signal: string;
    /** מה הרמז אומר. */
    meaning: string;
    /** איך הרמז משפיע על ההחלטה בהמחשה שלנו. */
    effect: string;
    strength?: SignalStrength;
}

/* ────────────────────────────────────────────────────────────────────────
   טיפוסי פרק 4: "הלב ההסתברותי" (מעבדת ההמשכים הסבירים).
   המודל לא שולף תשובה מוכנה. הוא מעריך כמה המשכים אפשריים, נותן לכל אחד משקל
   סבירות לפי הקלט וההקשר, ובוחר את מה שנראה מתאים. הוספת הקשר מזיזה את המשקלים.
   כל הנתונים דקלרטיביים: אין כאן מודל אמיתי או חישוב הסתברות חי. הפער כמדד
   ביטחון ושער ההחלטה שייכים לפרק 9, לא לכאן.
   ──────────────────────────────────────────────────────────────────────── */

/** המשך אפשרי בודד מתוך מספר מתחרים, עם משקל הסבירות שלו (0-100). */
export interface ProbabilityCandidate {
    id: string;
    labelHe: string;
    labelEn: string;
    /** משקל הסבירות הבסיסי (0-100), כפי שהמנוע מעריך אותו בהמחשה. */
    probability: number;
    /** נימוק עברי קצר: למה ההמשך הזה קיבל את המשקל. */
    reason: string;
}

/** רמז הסתברותי: מילה בפרומט והשפעתה על פיזור המשקל בין ההמשכים. */
export interface ProbabilitySignal {
    signal: string;
    effect: string;
    strength?: SignalStrength;
}

/**
 * פריט הקשר שאפשר להוסיף לפרומט. כשהוא פעיל, המשקלים בין אותם המשכים זזים.
 * זה מה שממחיש שההקשר משנה מה נעשה סביר, בלי לשנות את קבוצת ההמשכים.
 */
export interface ContextToggle {
    id: string;
    /** התוספת לפרומט, למשל "אבל קיבלתי הודעה שהיא נמסרה". */
    labelHe: string;
    labelEn: string;
    /** הסבר קצר: למה התוספת מזיזה את המשקלים. */
    note: string;
    /** מיפוי מ-id של המשך אל המשקל החדש שלו (0-100) כשהתוספת פעילה. */
    weights: Record<string, number>;
    /** הרמזים שמוצגים כשהתוספת פעילה. */
    signals: ProbabilitySignal[];
    accent: Accent;
}

/** תרחיש בודד במעבדת ההמשכים הסבירים. נתון דקלרטיבי טהור. */
export interface ContinuationScenario {
    id: string;
    /** הפרומט שהמשתמש כתב. */
    prompt: string;
    /** תווית עברית קצרה לכרטיס הבחירה (למשל "בקשת הכוונה"). */
    labelHe: string;
    /** תווית אנגלית משנית (למשל "Action request"). */
    labelEn: string;
    /** ההמשכים האפשריים עם המשקל הבסיסי, בלי תוספות הקשר. */
    continuations: ProbabilityCandidate[];
    /** הרמזים הבסיסיים שהזיזו את המשקל. */
    signals: ProbabilitySignal[];
    /** פריטי הקשר שאפשר להוסיף כדי לראות את ההתפלגות זזה. */
    contextToggles: ContextToggle[];
    accent: Accent;
}
