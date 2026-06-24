// app/behind-the-scenes-ai/chapter-1/mockEngine.ts
//
// "מנוע לימודי" דטרמיניסטי לפרק 1 - לא NLP אמיתי ולא מודל.
// הוא מדרג קלט לפי כללי מילות-מפתח פשוטים, בדיוק ברוח הספר:
// המנוע לא "יודע" שפה, הוא מעריך מה הכי סביר מתוך מה שהוא מכיר.
//
// פונקציות טהורות בלבד (אין Date/Math.random/תופעות לוואי).
// לוגיקה ספציפית-לפרק - לכן יושבת ליד הפרק, לא בתוך ה-primitives הגנריים.

import type { DecisionState, IntentProbability } from '@/components/ai-internals/types';

export type Confidence = 'High' | 'Medium' | 'Low';
export type Risk = 'Low' | 'Medium' | 'High';

export interface ChatEngineResult {
    tokens: string[];
    meaning: string;
    intents: IntentProbability[];
    confidence: Confidence;
    decision: DecisionState;
    output: string;
    reply: string;
}

export interface AgentEngineResult {
    tokens: string[];
    task: string;
    missingInfo: string;
    toolNeed: { needed: boolean; tool: string };
    canActNow: boolean;
    risk: Risk;
    decision: DecisionState;
    output: string;
    reply: string;
}

// --- עזרי טקסט ---

export function tokenize(text: string): string[] {
    return text.trim().split(/\s+/).filter(Boolean);
}

// עוזרים אלה מיוצאים (additive בלבד) כדי שטבלת ה-trace תוכל לחשוף את אותם
// בדיקות-מפתח שהמנוע כבר מבצע - מקור-אמת יחיד, בלי שכפול לוגיקה ובלי מספרים חדשים.
export const includesAny = (text: string, words: string[]) => words.some((w) => text.includes(w));
export const countHits = (text: string, words: string[]) => words.filter((w) => text.includes(w)).length;
export const matchedWords = (text: string, words: string[]) => words.filter((w) => text.includes(w));
export const hasBarcode = (text: string) => /\d{6,}/.test(text);
export const NEGATION_TOKEN = 'לא';

// --- Chat Mode: דירוג כוונות ---

export interface ChatRule {
    key: string;
    label: string;
    meaning: string;
    words: string[];
}

export const CHAT_RULES: ChatRule[] = [
    {
        key: 'notDelivered',
        label: 'Package not delivered',
        meaning: 'Delivery issue',
        words: ['לא הגיע', 'לא הגיעה', 'לא קיבלתי', 'לא נמסר', 'אבד', 'אבדה', 'חסר', 'איחור', 'מתעכב', 'עיכוב'],
    },
    {
        key: 'tracking',
        label: 'Tracking question',
        meaning: 'Tracking request',
        words: ['איפה', 'היכן', 'מתי', 'סטטוס', 'מעקב', 'track', 'status'],
    },
    {
        key: 'system',
        label: 'System issue',
        meaning: 'System issue',
        words: ['מערכת', 'אתר', 'אפליקציה', 'לא מופיע', 'לא מופיעה', 'תקלה', 'שגיאה', 'התחבר'],
    },
    {
        key: 'payment',
        label: 'Payment issue',
        meaning: 'Payment issue',
        words: ['תשלום', 'חיוב', 'חשבונית', 'שילמתי', 'החזר', 'אשראי'],
    },
];

export const UNMATCHED_BASE = 0.15;
export const HIT_WEIGHT = 3.0;
export const NEGATION_BOOST = 1.5;
export const OTHER_BASE = 0.4;

const REPLIES: Record<string, string> = {
    notDelivered: 'נראה שמדובר במקרה של אי מסירה. כדאי לבדוק את סטטוס המשלוח לפי ברקוד.',
    tracking: 'אפשר לבדוק את מצב המשלוח לפי מספר המעקב. מה מספר המעקב?',
    system: 'ייתכן שמדובר בתקלה בהצגת המידע במערכת. כדאי לרענן ולנסות שוב.',
    payment: 'נראה שהשאלה קשורה לחיוב או לתשלום. כדאי לבדוק את פרטי החשבונית.',
    other: 'לא בטוח שהבנתי במדויק. תוכל לפרט מה הבעיה?',
};

/** ממיר ציונים גולמיים לאחוזים שמסתכמים ל-100, ממוין יורד. */
function normalize(raw: { label: string; score: number }[]): IntentProbability[] {
    const total = raw.reduce((s, x) => s + x.score, 0) || 1;
    const pcts = raw.map((x) => ({ label: x.label, value: Math.round((x.score / total) * 100) }));

    const sum = pcts.reduce((s, x) => s + x.value, 0);
    const diff = 100 - sum;
    if (diff !== 0 && pcts.length) {
        const topIdx = pcts.reduce((mi, x, i, arr) => (x.value > arr[mi].value ? i : mi), 0);
        pcts[topIdx] = { ...pcts[topIdx], value: pcts[topIdx].value + diff };
    }

    return pcts.sort((a, b) => b.value - a.value);
}

function confidenceFrom(intents: IntentProbability[]): Confidence {
    const top = intents[0]?.value ?? 0;
    const second = intents[1]?.value ?? 0;
    const margin = top - second;
    if (margin >= 40) return 'High';
    if (margin >= 15) return 'Medium';
    return 'Low';
}

export function runChatEngine(text: string): ChatEngineResult {
    const tokens = tokenize(text);
    const hasNegation = text.includes('לא');

    const raw = CHAT_RULES.map((rule) => {
        const hits = countHits(text, rule.words);
        let score = UNMATCHED_BASE + hits * HIT_WEIGHT;
        if (rule.key === 'notDelivered' && hasNegation) score += NEGATION_BOOST;
        return { key: rule.key, label: rule.label, meaning: rule.meaning, score };
    });

    const scored = [
        ...raw.map((r) => ({ label: r.label, score: r.score })),
        { label: 'Other', score: OTHER_BASE },
    ];

    const intents = normalize(scored);
    const confidence = confidenceFrom(intents);

    // הכוונה המובילה -> משמעות + תשובה
    const topLabel = intents[0]?.label ?? 'Other';
    const topRule = raw.find((r) => r.label === topLabel);
    const meaning = topRule?.meaning ?? 'General request';
    const replyKey = topRule?.key ?? 'other';

    const isConfident = confidence !== 'Low';
    const decision: DecisionState = isConfident
        ? { kind: 'answer', label: 'Generate response' }
        : { kind: 'ask', label: 'Ask for more context' };

    return {
        tokens,
        meaning,
        intents,
        confidence,
        decision,
        output: isConfident ? 'Response generated' : 'Clarifying question',
        reply: isConfident ? REPLIES[replyKey] ?? REPLIES.other : REPLIES.other,
    };
}

// --- Agent Mode: זיהוי משימה, מידע חסר, כלי, סיכון ---

export const ACTION_WORDS = ['בדוק', 'תבדוק', 'מצא', 'שלוף', 'עדכן', 'תעדכן', 'שלח', 'תשלח', 'פתח', 'סגור', 'תטפל', 'טפל'];
export const SENSITIVE_WORDS = ['שלח', 'תשלח', 'עדכן', 'תעדכן', 'מחק', 'תמחק'];
export const DELIVERY_WORDS = ['חבילה', 'משלוח', 'הזמנה', 'מסירה'];
export const VAGUE_WORDS = ['תטפל בזה', 'תטפל', 'זה', 'אותו'];

export function runAgentEngine(text: string): AgentEngineResult {
    const tokens = tokenize(text);

    const action = includesAny(text, ACTION_WORDS);
    const sensitive = includesAny(text, SENSITIVE_WORDS);
    const delivery = includesAny(text, DELIVERY_WORDS);
    const barcode = hasBarcode(text);
    const vague = !delivery && !barcode && includesAny(text, VAGUE_WORDS);

    // 1. פעולה רגישה (משפיעה על לקוח/מערכת) -> עצירה לאישור
    if (sensitive) {
        return {
            tokens,
            task: 'Send / update on customer record',
            missingInfo: 'Evidence: not verified',
            toolNeed: { needed: true, tool: 'Email / CRM' },
            canActNow: false,
            risk: 'High',
            decision: { kind: 'stop', label: 'Stop for approval' },
            output: 'Stop before action',
            reply: 'זו פעולה שמשפיעה על לקוח. לא אבצע אותה ללא אימות ואישור - אפשר להכין טיוטה לאישור.',
        };
    }

    // 2. בדיקת משלוח עם ברקוד -> שימוש בכלי
    if (action && (delivery || barcode) && barcode) {
        return {
            tokens,
            task: 'Check delivery failure',
            missingInfo: 'None',
            toolNeed: { needed: true, tool: 'Tracking API' },
            canActNow: true,
            risk: 'Low',
            decision: { kind: 'tool', label: 'Use Tracking API' },
            output: 'Call Tracking API',
            reply: 'יש ברקוד. אני בודק את סטטוס המשלוח במערכת המעקב...',
        };
    }

    // 3. בדיקת משלוח בלי ברקוד -> בקשת מידע חסר
    if (action && delivery) {
        return {
            tokens,
            task: 'Check delivery failure',
            missingInfo: 'Barcode: missing',
            toolNeed: { needed: true, tool: 'Tracking API' },
            canActNow: false,
            risk: 'Medium',
            decision: { kind: 'ask', label: 'Ask for barcode before action' },
            output: 'Ask user for required information',
            reply: 'כדי לבדוק את זה בפועל, אני צריך מספר ברקוד של החבילה.',
        };
    }

    // 4. בקשה עמומה -> בקשת הבהרה
    if (vague) {
        return {
            tokens,
            task: 'Unclear task',
            missingInfo: 'Target unclear',
            toolNeed: { needed: false, tool: '-' },
            canActNow: false,
            risk: 'Low',
            decision: { kind: 'ask', label: 'Ask what to handle' },
            output: 'Ask for clarification',
            reply: 'אני צריך להבין למה הכוונה - איזו משימה או חבילה לבדוק?',
        };
    }

    // 5. תיאור בעיה בלי מילת פעולה (משלוח) -> עדיין צריך מזהה
    if (delivery) {
        return {
            tokens,
            task: 'Check delivery failure',
            missingInfo: barcode ? 'None' : 'Barcode: missing',
            toolNeed: { needed: true, tool: 'Tracking API' },
            canActNow: barcode,
            risk: 'Medium',
            decision: barcode
                ? { kind: 'tool', label: 'Use Tracking API' }
                : { kind: 'ask', label: 'Ask for barcode before action' },
            output: barcode ? 'Call Tracking API' : 'Ask user for required information',
            reply: barcode
                ? 'יש ברקוד. אני בודק את סטטוס המשלוח במערכת המעקב...'
                : 'כדי לבדוק את זה בפועל, אני צריך מספר ברקוד של החבילה.',
        };
    }

    // 6. ברירת מחדל: בקשה כללית -> מענה ישיר
    return {
        tokens,
        task: 'General request',
        missingInfo: 'None',
        toolNeed: { needed: false, tool: '-' },
        canActNow: true,
        risk: 'Low',
        decision: { kind: 'answer', label: 'Answer directly' },
        output: 'Generate explanation',
        reply: 'זו נשמעת כמו בקשה כללית. אפשר לענות עליה ישירות, בלי כלי חיצוני.',
    };
}
