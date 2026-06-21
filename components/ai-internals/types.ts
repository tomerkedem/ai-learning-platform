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

/** סוג הבקשה כפי שהמנוע מזהה אותו - נפרד לחלוטין מהחלטת הניתוב. */
export type RequestType = 'General question' | 'Specific investigation' | 'Action request';

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

/** דוגמת ניסוח אחת ל-Request Routing Lab. נתון דקלרטיבי טהור, ללא לוגיקת מנוע. */
export interface RoutingExample {
    id: string;
    label: string;
    /** סוג הבקשה (Request Type Detector) - לא החלטת ניתוב. */
    requestType: RequestType;
    requestText: string;
    /** הסתברויות סוג הבקשה ל-ProbabilityBars. */
    typeScores: IntentProbability[];
    /** המסלול הפעיל ב-switchboard (Route Decision). */
    selectedRoute: RouteKind;
    /** מסלול אפשרי הבא (למשל הכנה לכלי אחרי קבלת מידע). תצוגה בלבד. */
    nextRoute?: RouteKind;
    intentStage: IntentStage;
    riskLevel: RiskLevel;
    missingInfo?: string;
    /** כותרת עברית למידע החסר (למשל "חסר ברקוד"). */
    missingInfoLabel?: string;
    /** הסבר עברי קצר למה המידע חסר. */
    missingInfoNote?: string;
    toolNeed?: { needed: boolean; tool?: string };
    approvalRequired: boolean;
    decision: DecisionState;
    explanation: string;
    /** הסבר דינמי שמחבר את מילות הפרומט להחלטת הניתוב, נשען על הרמזים. */
    promptExplanation: string;
    /** רמזי החלטה: הסימנים בפרומט שהובילו לזיהוי הכוונה ולמסלול. */
    decisionSignals: DecisionSignal[];
    accent: Accent;
}

/* ────────────────────────────────────────────────────────────────────────
   טיפוסי פרק 3: "AI כמנוע הסתברותי" (Probability Engine Lab).
   המודל לא "יודע" - הוא מדרג פירושים אפשריים ובוחר את מה שנראה הכי סביר.
   כל הנתונים דקלרטיביים: אין כאן מודל אמיתי או חישוב הסתברות חי.
   ──────────────────────────────────────────────────────────────────────── */

/** רמת ביטחון בהחלטה (נגזרת מהפער בין האפשרות הראשונה לשנייה). */
export type ConfidenceLevel = 'high' | 'medium' | 'low';

/** צורת ההתפלגות: חדה (מוביל ברור), קרובה (שתי מובילות), מפוזרת (כללי). */
export type DistributionShape = 'sharp' | 'close' | 'flat';

/** סוג ההחלטה ההסתברותית: לענות, לבקש הקשר, או לשאול שאלת הבהרה. */
export type ProbabilityDecisionKind = 'answer' | 'context' | 'clarify';

/** אפשרות פירוש בודדת מתוך מספר מתחרות, עם ההסתברות שלה (0-100). */
export interface ProbabilityCandidate {
    id: string;
    labelHe: string;
    labelEn: string;
    /** ההסתברות היחסית (0-100), כפי שהמנוע מעריך אותה בהמחשה. */
    probability: number;
    /** נימוק עברי קצר: למה האפשרות הזו קיבלה את הציון. */
    reason: string;
}

/** רמז הסתברותי: מילה בפרומט והשפעתה על פיזור ההסתברות. */
export interface ProbabilitySignal {
    signal: string;
    effect: string;
    strength?: SignalStrength;
}

/** תרחיש בודד ב-Probability Engine Lab. נתון דקלרטיבי טהור. */
export interface ProbabilityScenario {
    id: string;
    /** הפרומט המקורי שהמשתמש כתב. */
    prompt: string;
    /** תווית עברית קצרה לכרטיס הבחירה (למשל "ניסוח ברור"). */
    labelHe: string;
    /** תווית אנגלית משנית (למשל "Clear prompt"). */
    labelEn: string;
    /** האפשרויות המתחרות, מסודרות מהגבוהה לנמוכה. */
    candidates: ProbabilityCandidate[];
    distributionShape: DistributionShape;
    /** ההסתברות של האפשרות המובילה (0-100). */
    topProbability: number;
    /** ההסתברות של האפשרות השנייה (0-100). */
    secondProbability: number;
    /** הפער: confidence_margin = top_probability - second_probability. */
    margin: number;
    confidence: ConfidenceLevel;
    decisionKind: ProbabilityDecisionKind;
    /** תווית ההחלטה בעברית (למשל "לענות בזהירות"). */
    decisionHe: string;
    /** תווית ההחלטה באנגלית (למשל "Answer with high confidence"). */
    decisionEn: string;
    /** הסבר עברי: למה זו ההחלטה הנכונה לאור ההתפלגות והפער. */
    decisionExplanation: string;
    signals: ProbabilitySignal[];
    accent: Accent;
}
