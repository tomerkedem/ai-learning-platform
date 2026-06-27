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

// מפתחות התשובה: המנוע נשאר טהור ומחזיר מזהה תשובה בלבד (לא טקסט). שכבת התצוגה
// פותרת אותו לטקסט הנכון מהמילון (chapter1Visuals.mockEngine), כדי שהפלט יהיה
// תלוי-שפה בלי להכניס תלות-מילון למודול הלוגי הזה.
export type ChatReplyKey = 'notDelivered' | 'tracking' | 'system' | 'payment' | 'other';
export type AgentReplyKey = 'sensitive' | 'tool' | 'askBarcode' | 'vague' | 'general';

export interface ChatEngineResult {
    tokens: string[];
    meaning: string;
    intents: IntentProbability[];
    confidence: Confidence;
    decision: DecisionState;
    output: string;
    replyKey: ChatReplyKey;
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
    replyKey: AgentReplyKey;
}

// --- עזרי טקסט ---

export function tokenize(text: string): string[] {
    return text.trim().split(/\s+/).filter(Boolean);
}

// עוזרים אלה מיוצאים (additive בלבד) כדי שטבלת ה-trace תוכל לחשוף את אותם
// בדיקות-מפתח שהמנוע כבר מבצע - מקור-אמת יחיד, בלי שכפול לוגיקה ובלי מספרים חדשים.
// ההשוואה היא חסרת-רגישות לאותיות גדולות/קטנות (אוצר-המילים באותיות קטנות), כדי
// שקלט אנגלי במשפט רגיל ("Where", "Check") יזוהה. בעברית אין אותיות גדולות, ולכן
// toLowerCase הוא זהותי וההתנהגות העברית נשארת זהה.
export const includesAny = (text: string, words: string[]) => { const t = text.toLowerCase(); return words.some((w) => t.includes(w)); };
export const countHits = (text: string, words: string[]) => { const t = text.toLowerCase(); return words.filter((w) => t.includes(w)).length; };
export const matchedWords = (text: string, words: string[]) => { const t = text.toLowerCase(); return words.filter((w) => t.includes(w)); };
export const hasBarcode = (text: string) => /\d{6,}/.test(text);

// ════════════════════ אוצר-מילים תלוי-שפה לזיהוי (C3) ════════════════════
// המנוע מזהה כוונה/פעולה לפי התאמת תת-מחרוזות. אוצר-המילים הזה מצומד לקלט-ההדגמה
// שבמילון (chapter1.seed, confidenceDial.samples, forkView.samples,
// counterfactual.experiments[].variants), ולכן הוא חייב להיות תלוי-שפה: קלט עברי
// מזוהה לפי אוצר עברי, קלט אנגלי לפי אוצר אנגלי.
//
// בחירת האוצר נעשית לפי הכתב של הקלט עצמו (vocabFor): טקסט עם אותיות עבריות => עברית,
// אחרת => אנגלית. כך אין צורך להעביר locale דרך כל הקוראים, וגם קלט חופשי שהמשתמש
// מקליד מזוהה לפי שפתו בפועל. ההתנהגות העברית נשארת זהה לחלוטין (אוצר HE זהה לקודם).
//
// מגבלת C4: זיהוי-לפי-כתב מבחין בין עברית/אנגלית (וגם ערבית/קירילית/CJK), אבל אינו
// מבחין בין שתי שפות באותו כתב לטיני (en מול es). כשתתווסף es יידרש לאוצר מנגנון
// תלוי-locale מפורש (העברת contentLocale פנימה), לא רק זיהוי-כתב.
export interface Vocab {
    /** מילת/סימן שלילה (מחזק את כוונת אי-המסירה). */
    negation: string;
    /** מילות-מפתח לכל כוונת Chat, לפי מפתח הכלל. */
    chatWords: Record<ChatRuleKey, string[]>;
    actionWords: string[];
    sensitiveWords: string[];
    deliveryWords: string[];
    vagueWords: string[];
}

const HE_VOCAB: Vocab = {
    negation: 'לא',
    chatWords: {
        notDelivered: ['לא הגיע', 'לא הגיעה', 'לא קיבלתי', 'לא נמסר', 'אבד', 'אבדה', 'חסר', 'איחור', 'מתעכב', 'עיכוב'],
        tracking: ['איפה', 'היכן', 'מתי', 'סטטוס', 'מעקב', 'track', 'status'],
        system: ['מערכת', 'אתר', 'אפליקציה', 'לא מופיע', 'לא מופיעה', 'תקלה', 'שגיאה', 'התחבר'],
        payment: ['תשלום', 'חיוב', 'חשבונית', 'שילמתי', 'החזר', 'אשראי'],
    },
    actionWords: ['בדוק', 'תבדוק', 'מצא', 'שלוף', 'עדכן', 'תעדכן', 'שלח', 'תשלח', 'פתח', 'סגור', 'תטפל', 'טפל'],
    sensitiveWords: ['שלח', 'תשלח', 'עדכן', 'תעדכן', 'מחק', 'תמחק'],
    deliveryWords: ['חבילה', 'משלוח', 'הזמנה', 'מסירה'],
    vagueWords: ['תטפל בזה', 'תטפל', 'זה', 'אותו'],
};

// אוצר אנגלי, מצומד לקלט-ההדגמה האנגלי שב-en/chapter1.ts ו-en/chapter1Visuals.ts.
// נבחרו צירופים שמונעים התנגשויות תת-מחרוזת בקלטי הדמו (למשל "open" נמנע כי הוא
// תת-מחרוזת של "opening"; כינויי-גוף בודדים כמו "it" נמנעים, מעדיפים "handle it").
const EN_VOCAB: Vocab = {
    negation: "n't",
    chatWords: {
        notDelivered: ["didn't arrive", 'did not arrive', "didn't receive", "hasn't arrived", 'never arrived', 'lost', 'missing', 'delayed', 'delay'],
        tracking: ['where', 'when', 'status', 'track', 'tracking'],
        system: ['system', 'not working', 'error', 'glitch', 'down', 'crash'],
        payment: ['payment', 'charge', 'invoice', 'refund', 'billing', 'paid'],
    },
    actionWords: ['check', 'find', 'look up', 'update', 'send', 'tell', 'handle'],
    sensitiveWords: ['send', 'tell', 'email', 'notify', 'update', 'delete', 'remove'],
    deliveryWords: ['package', 'delivery', 'order', 'shipment', 'parcel'],
    vagueWords: ['handle it', 'take care of it', 'sort it out', 'deal with it', 'just handle'],
};

/** בוחר אוצר-מילים לפי כתב הקלט: אותיות עבריות => עברית, אחרת => אנגלית. */
export function vocabFor(text: string): Vocab {
    return /[֐-׿]/.test(text) ? HE_VOCAB : EN_VOCAB;
}

// --- Chat Mode: דירוג כוונות ---

export type ChatRuleKey = 'notDelivered' | 'tracking' | 'system' | 'payment';

export interface ChatRule {
    key: ChatRuleKey;
    label: string;
    meaning: string;
}

// מבנה הכוונות (מפתח, תווית, משמעות) - לא תלוי-שפה. מילות-הזיהוי עברו ל-Vocab.
export const CHAT_RULES: ChatRule[] = [
    { key: 'notDelivered', label: 'Package not delivered', meaning: 'Delivery issue' },
    { key: 'tracking', label: 'Tracking question', meaning: 'Tracking request' },
    { key: 'system', label: 'System issue', meaning: 'System issue' },
    { key: 'payment', label: 'Payment issue', meaning: 'Payment issue' },
];

export const UNMATCHED_BASE = 0.15;
export const HIT_WEIGHT = 3.0;
export const NEGATION_BOOST = 1.5;
export const OTHER_BASE = 0.4;

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
    const vocab = vocabFor(text);
    const tokens = tokenize(text);
    const hasNegation = text.toLowerCase().includes(vocab.negation);

    const raw = CHAT_RULES.map((rule) => {
        const hits = countHits(text, vocab.chatWords[rule.key]);
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

    // הכוונה המובילה -> משמעות + מפתח תשובה
    const topLabel = intents[0]?.label ?? 'Other';
    const topRule = raw.find((r) => r.label === topLabel);
    const meaning = topRule?.meaning ?? 'General request';

    const isConfident = confidence !== 'Low';
    const decision: DecisionState = isConfident
        ? { kind: 'answer', label: 'Generate response' }
        : { kind: 'ask', label: 'Ask for more context' };

    // כשהביטחון נמוך התשובה תמיד 'other' (בקשת הבהרה), בדיוק כמו קודם.
    const replyKey: ChatReplyKey = isConfident ? ((topRule?.key as ChatReplyKey) ?? 'other') : 'other';

    return {
        tokens,
        meaning,
        intents,
        confidence,
        decision,
        output: isConfident ? 'Response generated' : 'Clarifying question',
        replyKey,
    };
}

// --- Agent Mode: זיהוי משימה, מידע חסר, כלי, סיכון ---

export function runAgentEngine(text: string): AgentEngineResult {
    const vocab = vocabFor(text);
    const tokens = tokenize(text);

    const action = includesAny(text, vocab.actionWords);
    const sensitive = includesAny(text, vocab.sensitiveWords);
    const delivery = includesAny(text, vocab.deliveryWords);
    const barcode = hasBarcode(text);
    const vague = !delivery && !barcode && includesAny(text, vocab.vagueWords);

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
            replyKey: 'sensitive',
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
            replyKey: 'tool',
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
            replyKey: 'askBarcode',
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
            replyKey: 'vague',
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
            replyKey: barcode ? 'tool' : 'askBarcode',
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
        replyKey: 'general',
    };
}
