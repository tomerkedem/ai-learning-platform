// מנוע המילים של פרק 4: "כל מילה מזיזה את המנוע".
// זהו מודל לימודי דטרמיניסטי - אין כאן LLM אמיתי, קריאת API או רשת.
// כל תרחיש הוא טבלה קבועה של שלבי הקלדה. המספרים נעולים כדי שכל הרצה תהיה
// זהה ותואמת לספר. המעבדה מבצעת אינטרפולציה מונפשת בין שלב לשלב.
//
// ── איך להרחיב ──────────────────────────────────────────────────────────
// כל תרחיש הוא WordScenario עם רשימת steps. כל step הוא מצב מלא של המנוע
// אחרי שהוקלדה עוד מילה: הטקסט המצטבר, ה-tokens, התפלגות על אותם candidates
// קבועים, וקטור המשמעות, רמת הביטחון, המילה שגרמה לשינוי ודגל negation.
// כדי להוסיף תרחיש: הוסיפו אובייקט ל-WORD_SCENARIOS עם steps עוקבים שבהם
// כל step.text הוא הרחבה (prefix) של הקודם. הפונקציות שלמטה גוזרות לבד את
// השלב הפעיל ואת ההשפעה של כל מילה מתוך ההפרש בין שלבים.

import type { Accent } from '@/components/ai-internals/types';

/** חמש האפשרויות הקבועות לכל הפרק. */
export type CandidateId = 'delivered' | 'not-delivered' | 'tracking' | 'system' | 'other';

export interface Candidate {
    id: CandidateId;
    he: string;
    en: string;
}

export const CANDIDATES: Candidate[] = [
    { id: 'delivered', he: 'החבילה נמסרה', en: 'Package delivered' },
    { id: 'not-delivered', he: 'אי מסירה', en: 'Package not delivered' },
    { id: 'tracking', he: 'שאלת מעקב', en: 'Tracking question' },
    { id: 'system', he: 'תקלה במערכת', en: 'System issue' },
    { id: 'other', he: 'אחר', en: 'Other' },
];

/** מצב התהליך: שיחה רגילה מול Agent שמנהל משימה. תואם ל-FlowMode. */
export type WordMode = 'chat' | 'agent';

/** רמת ביטחון בארבע דרגות (הקלדה חיה דורשת יותר ניואנס מ-high/low). */
export type WordConfidence = 'low' | 'medium-low' | 'medium' | 'high';

/** מדדי וקטור המשמעות (Meaning Vector). 0-100 לכל ציר. */
export type VectorKey = 'delivery' | 'system' | 'payment' | 'address' | 'urgency';

export const VECTOR_LABELS: { key: VectorKey; he: string; en: string }[] = [
    { key: 'delivery', he: 'משלוח', en: 'Delivery' },
    { key: 'system', he: 'מערכת', en: 'System' },
    { key: 'payment', he: 'תשלום', en: 'Payment' },
    { key: 'address', he: 'כתובת', en: 'Address' },
    { key: 'urgency', he: 'דחיפות', en: 'Urgency' },
];

/** רשימת מילות השלילה שהמנוע מזהה (להמחשה לימודית). */
export const NEGATION_WORDS = ['לא', 'אין', 'בלי', 'אינו', 'לא ניתן'];

/** היגיון Agent שמוצג בשלב מסוים (רק במצב Agent). */
export interface AgentReasoning {
    signalHe?: string;
    signalEn?: string;
    goalHe?: string;
    goalEn?: string;
    needsExternalData?: 'yes' | 'likely-yes' | 'no';
    missingInfoHe?: string;
    missingInfoEn?: string;
    nextStepHe?: string;
    nextStepEn?: string;
}

/** שלב הקלדה בודד: מצב מלא של המנוע אחרי שהוקלדה עוד מילה. */
export interface TypingStep {
    /** הטקסט המצטבר עד כה. כל step הוא prefix של הבא אחריו. */
    text: string;
    /** רשימת ה-tokens שנדלקו עד שלב זה. */
    tokens: string[];
    /** התפלגות על חמשת ה-candidates (0-100). */
    probabilities: Record<CandidateId, number>;
    /** וקטור המשמעות (0-100 לכל ציר). */
    vector: Record<VectorKey, number>;
    confidence: WordConfidence;
    /** תיאור עברי של השינוי המוביל בשלב זה. */
    mainChangeHe: string;
    /** האם זוהתה מילת שלילה בשלב זה. */
    negation: boolean;
    /** מילת השלילה עצמה (אם negation). */
    negationWord?: string;
    /** היגיון Agent (מוצג רק במצב Agent). */
    agent?: AgentReasoning;
}

/** סוג ההחלטה הסופית אחרי Send. */
export type WordDecisionKind = 'answer' | 'context' | 'clarify' | 'tool' | 'approval';

export interface WordFinal {
    kind: WordDecisionKind;
    he: string;
    en: string;
    /** מה התוצאה אומרת: ב-Chat זו תשובה, ב-Agent זה הצעד הבא. */
    detail: string;
    /** תווית עברית לסוג התוצאה: "התשובה" מול "הצעד הבא". */
    outcomeLabelHe: string;
    outcomeLabelEn: string;
}

/** תרחיש מלא: רצף שלבי הקלדה + ההחלטה הסופית. */
export interface WordScenario {
    id: string;
    mode: WordMode;
    labelHe: string;
    labelEn: string;
    prompt: string;
    accent: Accent;
    steps: TypingStep[];
    /** שתי האפשרויות שה-Movement Trail מצייר (העולה והיורדת). */
    trail: [CandidateId, CandidateId];
    final: WordFinal;
}

export const WORD_SCENARIOS: WordScenario[] = [
    // ── תרחיש A: Chat Mode, ניסוח ברור ─────────────────────────────────
    {
        id: 'clear-chat',
        mode: 'chat',
        labelHe: 'ניסוח ברור',
        labelEn: 'Clear prompt',
        prompt: 'החבילה לא הגיעה',
        accent: 'emerald',
        trail: ['not-delivered', 'delivered'],
        steps: [
            {
                text: 'החבילה',
                tokens: ['החבילה'],
                probabilities: { delivered: 72, 'not-delivered': 18, tracking: 6, system: 3, other: 1 },
                vector: { delivery: 68, system: 12, payment: 4, address: 18, urgency: 14 },
                confidence: 'low',
                mainChangeHe: 'זוהה תחום: משלוח. עדיין אין כוונה ברורה.',
                negation: false,
            },
            {
                text: 'החבילה לא',
                tokens: ['החבילה', 'לא'],
                probabilities: { delivered: 22, 'not-delivered': 58, tracking: 12, system: 5, other: 3 },
                vector: { delivery: 74, system: 14, payment: 4, address: 16, urgency: 30 },
                confidence: 'medium-low',
                mainChangeHe: 'המילה "לא" הפכה את הכיוון.',
                negation: true,
                negationWord: 'לא',
            },
            {
                text: 'החבילה לא הגיעה',
                tokens: ['החבילה', 'לא', 'הגיעה'],
                probabilities: { delivered: 4, 'not-delivered': 88, tracking: 5, system: 2, other: 1 },
                vector: { delivery: 90, system: 10, payment: 3, address: 20, urgency: 44 },
                confidence: 'high',
                mainChangeHe: 'הצירוף "לא הגיעה" חידד את ההחלטה.',
                negation: false,
            },
        ],
        final: {
            kind: 'answer',
            he: 'לענות בזהירות',
            en: 'Answer',
            outcomeLabelHe: 'התשובה',
            outcomeLabelEn: 'Response',
            detail: 'נראה שהחבילה לא הגיעה. כדאי לבדוק את סטטוס המשלוח ולהציע פתרון, תוך ציון שזו הערכה מובילה ולא ודאות.',
        },
    },

    // ── תרחיש B: Agent Mode ────────────────────────────────────────────
    {
        id: 'investigate-agent',
        mode: 'agent',
        labelHe: 'בקשת פעולה',
        labelEn: 'Action request',
        prompt: 'בדוק למה החבילה לא הגיעה',
        accent: 'purple',
        trail: ['not-delivered', 'delivered'],
        steps: [
            {
                text: 'בדוק',
                tokens: ['בדוק'],
                probabilities: { delivered: 30, 'not-delivered': 30, tracking: 28, system: 9, other: 3 },
                vector: { delivery: 35, system: 18, payment: 6, address: 10, urgency: 30 },
                confidence: 'low',
                mainChangeHe: 'המילה "בדוק" מסמנת בקשת פעולה, לא שאלה.',
                negation: false,
                agent: {
                    signalHe: 'זוהה אות פעולה',
                    signalEn: 'Action signal detected',
                    goalHe: 'לבדוק / לחקור',
                    goalEn: 'Check / investigate',
                },
            },
            {
                text: 'בדוק למה החבילה',
                tokens: ['בדוק', 'למה', 'החבילה'],
                probabilities: { delivered: 42, 'not-delivered': 33, tracking: 16, system: 7, other: 2 },
                vector: { delivery: 70, system: 14, payment: 5, address: 16, urgency: 34 },
                confidence: 'medium-low',
                mainChangeHe: 'זוהה תחום: משלוח.',
                negation: false,
                agent: {
                    goalHe: 'תחום: משלוח',
                    goalEn: 'Domain: Delivery',
                },
            },
            {
                text: 'בדוק למה החבילה לא הגיעה',
                tokens: ['בדוק', 'למה', 'החבילה', 'לא', 'הגיעה'],
                probabilities: { delivered: 7, 'not-delivered': 80, tracking: 8, system: 3, other: 2 },
                vector: { delivery: 88, system: 12, payment: 4, address: 18, urgency: 40 },
                confidence: 'high',
                mainChangeHe: 'המטרה: לחקור כשל במסירה. חסר מידע: ברקוד.',
                negation: true,
                negationWord: 'לא',
                agent: {
                    goalHe: 'לחקור כשל במסירה',
                    goalEn: 'Investigate delivery failure',
                    needsExternalData: 'likely-yes',
                    missingInfoHe: 'ברקוד',
                    missingInfoEn: 'Barcode',
                    nextStepHe: 'לבקש מהמשתמש ברקוד',
                    nextStepEn: 'Ask user for barcode',
                },
            },
        ],
        final: {
            kind: 'context',
            he: 'לבקש ברקוד',
            en: 'Ask for barcode',
            outcomeLabelHe: 'הצעד הבא',
            outcomeLabelEn: 'Next step',
            detail: 'כדי לחקור את כשל המסירה דרוש מזהה חבילה. המנוע לא ממציא נתונים, אלא מבקש את הברקוד לפני שהוא משתמש בכלי.',
        },
    },

    // ── תרחיש C: ניסוי חלופי, אותו תחום מילים שונות ─────────────────────
    {
        id: 'system-chat',
        mode: 'chat',
        labelHe: 'ניסוי חלופי',
        labelEn: 'Alternative phrasing',
        prompt: 'המערכת לא מציגה את החבילה',
        accent: 'amber',
        trail: ['system', 'delivered'],
        steps: [
            {
                text: 'המערכת',
                tokens: ['המערכת'],
                probabilities: { delivered: 16, 'not-delivered': 14, tracking: 19, system: 46, other: 5 },
                vector: { delivery: 22, system: 70, payment: 8, address: 14, urgency: 16 },
                confidence: 'low',
                mainChangeHe: 'המילה "מערכת" מושכת לכיוון תקלת מערכת.',
                negation: false,
            },
            {
                text: 'המערכת לא',
                tokens: ['המערכת', 'לא'],
                probabilities: { delivered: 8, 'not-delivered': 27, tracking: 10, system: 50, other: 5 },
                vector: { delivery: 16, system: 76, payment: 6, address: 12, urgency: 28 },
                confidence: 'medium-low',
                mainChangeHe: 'המילה "לא" מוסיפה משקל, אך "מערכת" עדיין מובילה.',
                negation: true,
                negationWord: 'לא',
            },
            {
                text: 'המערכת לא מציגה את החבילה',
                tokens: ['המערכת', 'לא', 'מציגה', 'את', 'החבילה'],
                probabilities: { delivered: 3, 'not-delivered': 23, tracking: 9, system: 62, other: 3 },
                vector: { delivery: 30, system: 82, payment: 6, address: 20, urgency: 24 },
                confidence: 'medium',
                mainChangeHe: 'הניסוח כולו מצביע על תקלת תצוגה במערכת, לא על אי מסירה.',
                negation: false,
            },
        ],
        final: {
            kind: 'clarify',
            he: 'להפנות לתקלת מערכת',
            en: 'Route to system issue',
            outcomeLabelHe: 'התשובה',
            outcomeLabelEn: 'Response',
            detail: 'אותן מילים סביב חבילה, אבל "מערכת" הזיזה את המנוע לכיוון אחר. כדאי לבדוק את תצוגת המערכת לפני שמניחים שהחבילה לא נמסרה.',
        },
    },
];

/* ── פונקציות עזר טהורות (גוזרות מצב מהטבלה, בלי תופעות לוואי) ──────────── */

/** מאתר את התרחיש לפי מזהה. */
export function getScenario(id: string): WordScenario | undefined {
    return WORD_SCENARIOS.find((s) => s.id === id);
}

/** התרחיש הראשון המתאים למצב הנתון (Chat/Agent). */
export function defaultScenarioFor(mode: WordMode): WordScenario {
    return WORD_SCENARIOS.find((s) => s.mode === mode) ?? WORD_SCENARIOS[0];
}

/** מנרמל רווחים כדי להשוות טקסט מוקלד לטקסט של שלב. */
function normalize(text: string): string {
    return text.replace(/\s+/g, ' ').trimEnd();
}

/**
 * גוזר את אינדקס השלב הפעיל מתוך הטקסט שהוקלד.
 * מחזיר את השלב הגבוה ביותר שה-text שלו הוא prefix של מה שהוקלד.
 * אם עדיין לא הושלמה אף מילת-שלב, מחזיר -1 (מצב idle / בנייה).
 */
export function activeStepIndex(scenario: WordScenario, text: string): number {
    const norm = normalize(text);
    let idx = -1;
    scenario.steps.forEach((s, i) => {
        if (norm.length >= s.text.length && norm.startsWith(s.text)) idx = i;
    });
    return idx;
}

/** האם הוקלד המשפט המלא (השלב האחרון הושלם). */
export function isComplete(scenario: WordScenario, text: string): boolean {
    return activeStepIndex(scenario, text) === scenario.steps.length - 1;
}

/** השפעת מילה (word_impact) על candidate בודד בין שני שלבים: after - before. */
export function wordImpact(
    prev: TypingStep | null,
    next: TypingStep,
    id: CandidateId,
): number {
    const before = prev ? prev.probabilities[id] : 0;
    return next.probabilities[id] - before;
}

/** ה-candidate המוביל בשלב נתון. */
export function leadingCandidate(step: TypingStep): CandidateId {
    return (Object.keys(step.probabilities) as CandidateId[]).reduce((best, id) =>
        step.probabilities[id] > step.probabilities[best] ? id : best,
    );
}

/** מחזיר את ה-candidate שעלה הכי הרבה ואת זה שירד הכי הרבה בין שני שלבים. */
export function biggestMovers(
    prev: TypingStep | null,
    next: TypingStep,
): { riser: { id: CandidateId; delta: number }; faller: { id: CandidateId; delta: number } } {
    const ids = Object.keys(next.probabilities) as CandidateId[];
    let riser = { id: ids[0], delta: -Infinity };
    let faller = { id: ids[0], delta: Infinity };
    ids.forEach((id) => {
        const delta = wordImpact(prev, next, id);
        if (delta > riser.delta) riser = { id, delta };
        if (delta < faller.delta) faller = { id, delta };
    });
    return { riser, faller };
}

/** מאתר Candidate לפי מזהה (לתצוגת תוויות). */
export function candidateById(id: CandidateId): Candidate {
    return CANDIDATES.find((c) => c.id === id) ?? CANDIDATES[CANDIDATES.length - 1];
}
