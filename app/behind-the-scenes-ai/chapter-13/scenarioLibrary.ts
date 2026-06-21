// ספריית התרחישים ה-offline של המעבדה המאוחדת (פרק 13).
//
// העיקרון: המנוע השקוף אינו "על החבילות" אלא על *כל* מצב. כדי להראות זאת גם
// בלי מפתח ובלי רשת, הקובץ הזה מחזיק תרחישים מוכנים (curated) בכמה תחומים,
// בתוך ה-bundle, בלי שום קריאת רשת.
//
// גארדריילים שנשמרים כאן:
//   * אלו *נתונים*, לא לוגיקה חדשה. אין כאן softmax/cosine ואין מנוע חדש —
//     התרחישים מחזיקים מספרים שנכתבו ביד (כמו פרקים 3–4), וה-presenter רק
//     ממפה אותם אל אותם מבני Stage/StagePayload שהמנוע השקוף כבר יודע לצייר.
//   * המנוע הדטרמיניסטי (traces.ts ופרקים 6–12) לא נוגעים בו. canonical עדיין
//     מחושב חי משם; הספרייה היא מסלול תצוגה מקביל לאותו X-Ray בדיוק.
//   * אותו pipeline, אותן שכבות, אותם הסברים — רק האילוסטרציה מתחלפת.

import type { Stage, StageState, Tone, Trace } from './traces';

// re-export כדי שצרכני הספרייה (כמו ה-route החי) לא יצטרכו לייבא ישירות מהמנוע.
export type { Tone } from './traces';

/* ════════════════════════ סכמה קנונית של תרחיש ═══════════════════════════ */

/** ציר משמעות (meaning dimension), ערך 0..1. */
export interface MeaningDim {
    he: string;
    en: string;
    value: number;
}

/** מועמד-משמעות עם הווקטור שלו: דמיון, ציון גולמי, והסתברות (0..100). */
export interface LibCandidate {
    labelHe: string;
    labelEn: string;
    similarity: number; // ~0..1.x
    score: number;      // ~0..1.x
    prob: number;       // 0..100, סכום ~100
}

/** כלי אפשרי וכמה הוא מתאים (match 0..100). */
export interface LibTool {
    nameEn: string;
    match: number;
}

export interface LibField {
    key: string;
    value: string;
}

export type LibChatBehavior = 'answer' | 'ask';
export type LibAgentBehavior = 'use-tool' | 'stop-approval' | 'ask-input' | 'answer-direct';

/** מקור התרחיש — קובע את תווית היושרה שמוצגת ללומד. */
export type ScenarioSource = 'canonical' | 'curated' | 'ai-generated';

export interface LibraryScenario {
    id: string;
    source: ScenarioSource;
    domainHe: string;
    domainEn: string;
    /** תיאור קצר לבורר התחומים. */
    blurbHe: string;
    /** ההודעה שהמשתמש "כתב". */
    prompt: string;

    tokens: string[];
    ids: (number | null)[];
    dims: MeaningDim[];
    /** ממוין יורד לפי prob; הראשון הוא המוביל. */
    candidates: LibCandidate[];
    confidence: { levelHe: string; levelEn: string };

    chat: {
        behavior: LibChatBehavior;
        responseHe: string;
        decisionHe: string;
        outcomeHe: string;
    };

    agent: {
        behavior: LibAgentBehavior;
        taskActionHe: string;
        requestHe: string;
        missing: { items: { he: string; present: boolean }[]; note: string };
        tools: LibTool[];
        selectedEn: string | null;
        call: { code: string; called: boolean };
        observation: { fields: LibField[]; available: boolean };
        risk: { actionHe: string; riskHe: string; approvalHe: string; tone: Tone };
        decision: { he: string; en: string; detail: string; tone: Tone };
        outcomeHe: string;
    };
}

/* ════════════════════════ מטא-נתוני שלבים (זהים לקנוני) ══════════════════ */
// אותם labels ואותם הסברים כמו ב-traceChat/traceAgent, כדי שהלומד יראה
// *פיזית* את אותו pipeline — רק המספרים שמתחת מתחלפים.

const round = (n: number) => Math.round(n);
const f2 = (n: number) => Number(n.toFixed(2));

const CHAT_META = [
    { id: 'input', he: 'קלט', en: 'Input', explainHe: 'מה שהמשתמש כתב. בחיים האמיתיים זו פשוט בקשה, לא הוראה טכנית.' },
    { id: 'tokens', he: 'טוקנים', en: 'Tokens', explainHe: 'הטקסט נשבר ליחידות עבודה. כל מילה הופכת לטוקן (פרק 5).' },
    { id: 'ids', he: 'מזהים', en: 'Token IDs', explainHe: 'כל טוקן מקבל מזהה מספרי מהמילון. ה-ID הוא כתובת, לא משמעות (פרק 6).' },
    { id: 'vector', he: 'וקטור', en: 'Vector', explainHe: 'מרצף המזהים נבנה וקטור משמעות: לאן המשפט מצביע (פרק 6).' },
    { id: 'similarity', he: 'דמיון', en: 'Similarity', explainHe: 'Cosine Similarity בין הווקטור לכל כוונה. זה ציון קרבה, לא הסתברות (פרק 7).' },
    { id: 'scores', he: 'ציונים', en: 'Scores', explainHe: 'score = similarity + word_impact + context_bonus. הציונים הגולמיים לא מסתכמים ל-100% (פרק 7).' },
    { id: 'probabilities', he: 'הסתברויות', en: 'Probabilities', explainHe: 'Softmax הופך את הציונים להסתברויות שמסתכמות ל-100% (פרק 7).' },
    { id: 'confidence', he: 'ביטחון', en: 'Confidence', explainHe: 'הפער בין הראשון לשני הוא שקובע אם בכלל לענות (פרק 8).' },
] as const;

const AGENT_META = [
    { id: 'input', he: 'קלט', en: 'Input', explainHe: 'הבקשה של המשתמש. אותו קלט בדיוק כמו ב-Chat, אבל כאן הוא מפעיל מנוע פעולה.' },
    { id: 'task', he: 'משימה', en: 'Task', explainHe: 'מילת פעולה הופכת שאלה למשימה. ה-Agent מזהה מה צריך לעשות (פרק 9).' },
    { id: 'missing', he: 'מידע חסר', en: 'Missing Info', explainHe: 'ה-Agent בודק מה עדיין חסר כדי לפעול. מידע חסר מוביל לבקשה, לא לניחוש (פרק 9).' },
    { id: 'tools', he: 'בחירת כלי', en: 'Tool Selection', explainHe: 'ה-Agent מדרג כמה כל כלי מתאים, ובוחר את המוביל (פרק 10).' },
    { id: 'call', he: 'הפעלת כלי', en: 'Tool Call', explainHe: 'קריאה מוגדרת לכלי, עם קלט מדויק. בלי קלט תקין או הרשאה, הקריאה לא מופעלת (פרק 11).' },
    { id: 'observation', he: 'תוצאה', en: 'Observation', explainHe: 'מה שהכלי החזיר. זה מידע חדש שהגיע מבחוץ, לא ידע שהיה למודל (פרק 11).' },
    { id: 'risk', he: 'בדיקת סיכון', en: 'Risk Check', explainHe: 'גם אחרי שהתוצאה חזרה, יש שער: סיכון והרשאה. סיכון גבוה דורש אישור (פרק 12).' },
    { id: 'decision', he: 'החלטה', en: 'Decision', explainHe: 'הצעד הסופי: תשובה, בקשת מידע, שימוש בכלי, או עצירה לאישור.' },
] as const;

/* ════════════════════════ presenter: תרחיש -> שני מסלולים ════════════════ */
// ממפה את הנתונים שנכתבו ביד אל אותם Stage/StagePayload בדיוק. זו שכבת
// *תצוגה*, לא מנוע: אין כאן חישוב מודל, רק חשבון תצוגה (top-second, מיון).

interface AgentReach {
    task: boolean; missing: boolean; tools: boolean; call: boolean; observation: boolean; risk: boolean;
}

function reachFor(behavior: LibAgentBehavior): AgentReach {
    switch (behavior) {
        case 'answer-direct':
            return { task: true, missing: false, tools: false, call: false, observation: false, risk: false };
        case 'ask-input':
            return { task: true, missing: true, tools: true, call: false, observation: false, risk: false };
        case 'stop-approval':
            return { task: true, missing: true, tools: true, call: false, observation: false, risk: true };
        case 'use-tool':
        default:
            return { task: true, missing: true, tools: true, call: true, observation: true, risk: true };
    }
}

function buildChatTrace(s: LibraryScenario): Trace {
    const cands = s.candidates;
    const top = cands[0];
    const second = cands[1] ?? { prob: 0 };
    const topProb = round(top?.prob ?? 0);
    const secondProb = round(second.prob ?? 0);
    const margin = Math.max(0, topProb - secondProb);

    const simSorted = [...cands].sort((a, b) => b.similarity - a.similarity).slice(0, 4);
    const top4 = cands.slice(0, 4);
    const tone: Tone = s.chat.behavior === 'answer' ? 'answer' : 'ask';

    const done: StageState = 'done';
    const stages: Stage[] = [
        { ...CHAT_META[0], state: done, payload: { kind: 'input', text: s.prompt || '...' } },
        { ...CHAT_META[1], state: done, payload: { kind: 'tokens', tokens: s.tokens } },
        { ...CHAT_META[2], state: done, payload: { kind: 'ids', pairs: s.tokens.map((t, i) => ({ token: t, id: s.ids[i] ?? null })) } },
        { ...CHAT_META[3], state: done, payload: { kind: 'vector', dims: s.dims.map((d) => ({ he: d.he, en: d.en, value: d.value })) } },
        { ...CHAT_META[4], state: done, payload: { kind: 'sim', items: simSorted.map((c) => ({ labelHe: c.labelHe, labelEn: c.labelEn, value: f2(c.similarity) })) } },
        { ...CHAT_META[5], state: done, payload: { kind: 'scores', items: top4.map((c) => ({ labelHe: c.labelHe, value: f2(c.score) })) } },
        { ...CHAT_META[6], state: done, payload: { kind: 'probs', items: top4.map((c, i) => ({ labelHe: c.labelHe, value: round(c.prob), lead: i === 0 })) } },
        { ...CHAT_META[7], state: done, payload: { kind: 'confidence', top: topProb, second: secondProb, margin, levelHe: s.confidence.levelHe, levelEn: s.confidence.levelEn } },
        {
            id: 'response', he: 'תגובה', en: 'Response', state: 'active',
            explainHe: s.chat.behavior === 'answer'
                ? 'הפער מספיק, אז המערכת עונה לפי הכוונה המובילה.'
                : 'הפער קטן מדי, אז במקום לנחש המערכת מבקשת הקשר נוסף.',
            payload: { kind: 'response', text: s.chat.responseHe, decisionHe: s.chat.decisionHe, tone },
        },
    ];

    return { mode: 'chat', text: s.prompt, stages, outcomeHe: s.chat.outcomeHe, outcomeTone: tone };
}

function buildAgentTrace(s: LibraryScenario): Trace {
    const a = s.agent;
    const reach = reachFor(a.behavior);

    const missingState: StageState = a.behavior === 'ask-input' ? 'active'
        : reach.missing ? 'done' : 'pending';
    const toolsState: StageState = reach.tools ? 'done' : 'pending';
    const callState: StageState = reach.call ? 'done' : (reach.tools ? 'blocked' : 'pending');
    const obsState: StageState = reach.observation ? 'done' : 'pending';
    const riskState: StageState = a.behavior === 'stop-approval' ? 'active'
        : reach.risk ? 'done' : 'pending';

    const stages: Stage[] = [
        { ...AGENT_META[0], state: 'done', payload: { kind: 'input', text: s.prompt || '...' } },
        { ...AGENT_META[1], state: 'done', payload: { kind: 'task', actionHe: a.taskActionHe, requestHe: a.requestHe } },
        { ...AGENT_META[2], state: missingState, payload: { kind: 'missing', items: a.missing.items, note: a.missing.note } },
        { ...AGENT_META[3], state: toolsState, payload: { kind: 'tools', items: a.tools.map((t) => ({ nameEn: t.nameEn, match: round(t.match) })), selectedEn: a.selectedEn } },
        { ...AGENT_META[4], state: callState, payload: { kind: 'call', code: a.call.code, called: a.call.called } },
        { ...AGENT_META[5], state: obsState, payload: { kind: 'observation', fields: a.observation.available ? a.observation.fields : [], available: a.observation.available } },
        { ...AGENT_META[6], state: riskState, payload: { kind: 'risk', actionHe: a.risk.actionHe, riskHe: a.risk.riskHe, approvalHe: a.risk.approvalHe, tone: a.risk.tone } },
        { ...AGENT_META[7], state: 'active', payload: { kind: 'decision', he: a.decision.he, en: a.decision.en, detail: a.decision.detail, tone: a.decision.tone } },
    ];

    return { mode: 'agent', text: s.prompt, stages, outcomeHe: a.outcomeHe, outcomeTone: a.decision.tone };
}

/** ממיר תרחיש קנוני-סכמה לשני המסלולים (Chat ו-Agent) של המנוע השקוף. */
export function scenarioToTraces(s: LibraryScenario): { chat: Trace; agent: Trace } {
    return { chat: buildChatTrace(s), agent: buildAgentTrace(s) };
}

/* ════════════════════════ הספרייה: ארבעה תחומים מעבר לחבילות ═════════════ */
// כל תרחיש מלא ותקין בסכמה הקנונית. ביחד הם מכסים את כל טווח ההתנהגויות:
// Chat answer / Chat ask · Agent use-tool / ask-input / stop-approval.

export const SCENARIO_LIBRARY: LibraryScenario[] = [
    /* ── 1. בריאות: תוצאת בדיקה שלא חזרה ─────────────────────────────────── */
    {
        id: 'lab-result',
        source: 'curated',
        domainHe: 'בריאות',
        domainEn: 'Healthcare',
        blurbHe: 'תוצאת בדיקת דם של מטופל עדיין לא חזרה מהמעבדה.',
        prompt: 'בדוק למה תוצאת בדיקת הדם של מטופל 48213 עדיין לא חזרה',
        tokens: ['בדוק', 'למה', 'תוצאת', 'בדיקת', 'הדם', 'מטופל', '48213', 'עדיין', 'לא', 'חזרה'],
        ids: [51, 88, 1471, 1209, 1330, 2055, 248213, 612, 17, 909],
        dims: [
            { he: 'בדיקה', en: 'Test', value: 0.92 },
            { he: 'מעבדה', en: 'Lab', value: 0.78 },
            { he: 'עיכוב', en: 'Delay', value: 0.66 },
            { he: 'מטופל', en: 'Patient', value: 0.55 },
            { he: 'הרשאה', en: 'Permission', value: 0.20 },
        ],
        candidates: [
            { labelHe: 'תוצאה מתעכבת', labelEn: 'Result delayed', similarity: 0.88, score: 1.42, prob: 64 },
            { labelHe: 'בדיקה לא בוצעה', labelEn: 'Test not run', similarity: 0.52, score: 0.71, prob: 18 },
            { labelHe: 'שאלת סטטוס', labelEn: 'Status question', similarity: 0.40, score: 0.55, prob: 11 },
            { labelHe: 'תקלה במעבדה', labelEn: 'Lab system issue', similarity: 0.28, score: 0.34, prob: 5 },
            { labelHe: 'אחר', labelEn: 'Other', similarity: 0.10, score: 0.12, prob: 2 },
        ],
        confidence: { levelHe: 'גבוה', levelEn: 'High' },
        chat: {
            behavior: 'answer',
            responseHe: 'נראה שתוצאת הבדיקה עדיין בעיבוד במעבדה. אפשר להסביר למטופל שהדגימה התקבלה ושהתוצאה ממתינה לאישור, ולבדוק סטטוס מעודכן.',
            decisionHe: 'מתן תשובה',
            outcomeHe: 'תשובה: תוצאה מתעכבת',
        },
        agent: {
            behavior: 'use-tool',
            taskActionHe: 'בדוק (Check)',
            requestHe: 'משימה',
            missing: {
                items: [
                    { he: 'מזהה מטופל', present: true },
                    { he: 'סוג בדיקה', present: true },
                ],
                note: 'כל המידע הנדרש קיים',
            },
            tools: [
                { nameEn: 'Lab Information System', match: 91 },
                { nameEn: 'Patient Record', match: 44 },
                { nameEn: 'Scheduling API', match: 18 },
            ],
            selectedEn: 'Lab Information System',
            call: { code: 'labSystem.getResultStatus({ patientId: "48213", panel: "CBC" })', called: true },
            observation: {
                available: true,
                fields: [
                    { key: 'Status', value: 'Pending' },
                    { key: 'Sample received', value: 'Yes (2026-06-19)' },
                    { key: 'Stage', value: 'Awaiting pathology review' },
                    { key: 'ETA', value: '~24h' },
                ],
            },
            risk: { actionHe: 'קריאת סטטוס', riskHe: 'סיכון נמוך', approvalHe: 'לא נדרש', tone: 'answer' },
            decision: {
                he: 'מתן תשובה', en: 'Answer',
                detail: 'הכלי קריא בלבד (קריאת סטטוס), הקלט קיים, הסיכון נמוך. אפשר לדווח שהתוצאה ממתינה לאישור פתולוג.',
                tone: 'answer',
            },
            outcomeHe: 'מתן תשובה',
        },
    },

    /* ── 2. שירות לקוחות / חיוב: ערעור על חיוב כפול ──────────────────────── */
    {
        id: 'billing-dispute',
        source: 'curated',
        domainHe: 'חיוב ושירות לקוחות',
        domainEn: 'Billing & Support',
        blurbHe: 'לקוח טוען שחויב פעמיים ומבקש זיכוי כספי.',
        prompt: 'שלח ללקוח זיכוי על החיוב הכפול בכרטיס האשראי',
        tokens: ['שלח', 'ללקוח', 'זיכוי', 'על', 'החיוב', 'הכפול', 'בכרטיס', 'האשראי'],
        ids: [73, 1190, 1820, 33, 1190, 1991, 2240, 2241],
        dims: [
            { he: 'חיוב', en: 'Billing', value: 0.90 },
            { he: 'כפילות', en: 'Duplicate', value: 0.74 },
            { he: 'כסף', en: 'Money', value: 0.83 },
            { he: 'לקוח', en: 'Customer', value: 0.61 },
            { he: 'הרשאה', en: 'Permission', value: 0.79 },
        ],
        candidates: [
            { labelHe: 'בקשת זיכוי', labelEn: 'Refund request', similarity: 0.81, score: 1.30, prob: 52 },
            { labelHe: 'חיוב כפול', labelEn: 'Duplicate charge', similarity: 0.70, score: 1.05, prob: 30 },
            { labelHe: 'ערעור חיוב', labelEn: 'Charge dispute', similarity: 0.48, score: 0.62, prob: 12 },
            { labelHe: 'שאלת חשבונית', labelEn: 'Invoice question', similarity: 0.26, score: 0.30, prob: 4 },
            { labelHe: 'אחר', labelEn: 'Other', similarity: 0.10, score: 0.11, prob: 2 },
        ],
        confidence: { levelHe: 'בינוני', levelEn: 'Medium' },
        chat: {
            behavior: 'ask',
            responseHe: 'כדי לבדוק את החיוב הכפול אני צריך את מספר החשבונית או ארבע ספרות אחרונות של הכרטיס. מדובר בזיכוי קיים בחשבון, או בבקשה חדשה?',
            decisionHe: 'בקשת הקשר נוסף',
            outcomeHe: 'בקשת הקשר נוסף',
        },
        agent: {
            behavior: 'stop-approval',
            taskActionHe: 'שלח (Send)',
            requestHe: 'משימה',
            missing: {
                items: [
                    { he: 'מזהה לקוח', present: true },
                    { he: 'אישור החזר כספי', present: false },
                ],
                note: 'חסר: אישור החזר כספי',
            },
            tools: [
                { nameEn: 'Refund API', match: 88 },
                { nameEn: 'Billing System', match: 63 },
                { nameEn: 'Email API', match: 41 },
            ],
            selectedEn: 'Refund API',
            call: { code: 'refundApi.issueCredit({ customerId: "…", amount: "…" }) // חסום עד אישור', called: false },
            observation: { available: false, fields: [] },
            risk: { actionHe: 'החזר כספי ללקוח', riskHe: 'סיכון גבוה – דורש אישור', approvalHe: 'נדרש', tone: 'stop' },
            decision: {
                he: 'עצירה לאישור אנושי', en: 'Stop for approval',
                detail: 'החזר כספי הוא פעולה רגישה (כסף יוצא ללקוח). הכלי מתאים, אבל עוצרים ומכינים טיוטת זיכוי לאישור אנושי, לא מבצעים.',
                tone: 'stop',
            },
            outcomeHe: 'עצירה לאישור אנושי',
        },
    },

    /* ── 3. תמיכת IT: תחנה לא מתחברת לרשת ────────────────────────────────── */
    {
        id: 'it-network',
        source: 'curated',
        domainHe: 'תמיכת IT',
        domainEn: 'IT Support',
        blurbHe: 'תחנת עבודה לא מתחברת לרשת מאז הבוקר.',
        prompt: 'בדוק למה התחנה לא מתחברת לרשת מהבוקר',
        tokens: ['בדוק', 'למה', 'התחנה', 'לא', 'מתחברת', 'לרשת', 'מהבוקר'],
        ids: [51, 88, 2610, 17, 2611, 2480, 2612],
        dims: [
            { he: 'רשת', en: 'Network', value: 0.89 },
            { he: 'חיבור', en: 'Connectivity', value: 0.81 },
            { he: 'תקלה', en: 'Failure', value: 0.72 },
            { he: 'תחנה', en: 'Asset', value: 0.58 },
            { he: 'דחיפות', en: 'Urgency', value: 0.44 },
        ],
        candidates: [
            { labelHe: 'תקלת רשת', labelEn: 'Network outage', similarity: 0.79, score: 1.22, prob: 47 },
            { labelHe: 'בעיית הזדהות', labelEn: 'Auth issue', similarity: 0.61, score: 0.90, prob: 27 },
            { labelHe: 'כבל מנותק', labelEn: 'Cable disconnected', similarity: 0.45, score: 0.58, prob: 16 },
            { labelHe: 'שאלת הגדרה', labelEn: 'Config question', similarity: 0.30, score: 0.36, prob: 7 },
            { labelHe: 'אחר', labelEn: 'Other', similarity: 0.12, score: 0.14, prob: 3 },
        ],
        confidence: { levelHe: 'בינוני', levelEn: 'Medium' },
        chat: {
            behavior: 'answer',
            responseHe: 'אם התחנה הפסיקה להתחבר מהבוקר, סביר שמדובר בתקלת רשת מקומית או בהזדהות. כדאי לבדוק חיבור פיזי, ואז סטטוס מתג/נקודת רשת. אפשר לפתוח קריאה למעקב.',
            decisionHe: 'מתן תשובה',
            outcomeHe: 'תשובה: תקלת רשת',
        },
        agent: {
            behavior: 'ask-input',
            taskActionHe: 'בדוק (Check)',
            requestHe: 'משימה',
            missing: {
                items: [
                    { he: 'שם/מספר תחנה (Asset Tag)', present: false },
                    { he: 'שם משתמש מחובר', present: false },
                ],
                note: 'חסר: שם/מספר תחנה (Asset Tag)',
            },
            tools: [
                { nameEn: 'Network Diagnostics', match: 86 },
                { nameEn: 'Asset Inventory', match: 52 },
                { nameEn: 'Ticket System', match: 38 },
            ],
            selectedEn: 'Network Diagnostics',
            call: { code: 'netDiag.ping({ assetTag: "???" }) // חסר Asset Tag', called: false },
            observation: { available: false, fields: [] },
            risk: { actionHe: 'אבחון רשת', riskHe: 'סיכון נמוך', approvalHe: 'לא נדרש', tone: 'ask' },
            decision: {
                he: 'בקשת מספר תחנה', en: 'Ask for input',
                detail: 'הכלי מתאים והסיכון נמוך, אבל אי אפשר להריץ אבחון בלי מזהה התחנה (Asset Tag). מבקשים אותו, לא מנחשים על איזו תחנה מדובר.',
                tone: 'ask',
            },
            outcomeHe: 'בקשת מספר תחנה',
        },
    },

    /* ── 4. משאבי אנוש: יתרת ימי חופשה ───────────────────────────────────── */
    {
        id: 'hr-leave',
        source: 'curated',
        domainHe: 'משאבי אנוש',
        domainEn: 'Human Resources',
        blurbHe: 'בקשה לבדוק כמה ימי חופשה נשארו לעובדת.',
        prompt: 'בדוק כמה ימי חופשה נשארו לדנה לוי השנה',
        tokens: ['בדוק', 'כמה', 'ימי', 'חופשה', 'נשארו', 'לדנה', 'לוי', 'השנה'],
        ids: [51, 305, 1740, 1741, 1602, 2700, 2701, 410],
        dims: [
            { he: 'חופשה', en: 'Leave', value: 0.90 },
            { he: 'יתרה', en: 'Balance', value: 0.80 },
            { he: 'עובד', en: 'Employee', value: 0.63 },
            { he: 'מדיניות', en: 'Policy', value: 0.41 },
            { he: 'הרשאה', en: 'Permission', value: 0.30 },
        ],
        candidates: [
            { labelHe: 'בדיקת יתרה', labelEn: 'Balance lookup', similarity: 0.85, score: 1.35, prob: 60 },
            { labelHe: 'בקשת חופשה', labelEn: 'Leave request', similarity: 0.50, score: 0.68, prob: 20 },
            { labelHe: 'שאלת מדיניות', labelEn: 'Policy question', similarity: 0.42, score: 0.54, prob: 13 },
            { labelHe: 'עדכון נתון', labelEn: 'Record update', similarity: 0.24, score: 0.28, prob: 5 },
            { labelHe: 'אחר', labelEn: 'Other', similarity: 0.10, score: 0.11, prob: 2 },
        ],
        confidence: { levelHe: 'גבוה', levelEn: 'High' },
        chat: {
            behavior: 'answer',
            responseHe: 'אפשר לבדוק את יתרת ימי החופשה של העובדת במערכת ה-HR. צריך להציג רק נתוני יתרה, בלי לשנות דבר, ולוודא שלשואל יש הרשאה לראות נתוני עובד.',
            decisionHe: 'מתן תשובה',
            outcomeHe: 'תשובה: בדיקת יתרה',
        },
        agent: {
            behavior: 'use-tool',
            taskActionHe: 'בדוק (Check)',
            requestHe: 'משימה',
            missing: {
                items: [
                    { he: 'שם עובד', present: true },
                    { he: 'שנה', present: true },
                ],
                note: 'כל המידע הנדרש קיים',
            },
            tools: [
                { nameEn: 'HR Information System', match: 90 },
                { nameEn: 'Time-Off Ledger', match: 58 },
                { nameEn: 'Org Directory', match: 33 },
            ],
            selectedEn: 'HR Information System',
            call: { code: 'hris.getLeaveBalance({ employee: "Dana Levi", year: 2026 })', called: true },
            observation: {
                available: true,
                fields: [
                    { key: 'Annual quota', value: '24 days' },
                    { key: 'Used', value: '15 days' },
                    { key: 'Pending', value: '2 days' },
                    { key: 'Remaining', value: '7 days' },
                ],
            },
            risk: { actionHe: 'קריאת נתון עובד', riskHe: 'סיכון נמוך', approvalHe: 'לא נדרש', tone: 'answer' },
            decision: {
                he: 'מתן תשובה', en: 'Answer',
                detail: 'קריאה בלבד של נתון קיים, ללא שינוי. הקלט מלא והסיכון נמוך, אז אפשר לדווח על היתרה: נשארו 7 ימים.',
                tone: 'answer',
            },
            outcomeHe: 'מתן תשובה',
        },
    },
];

export function getScenario(id: string): LibraryScenario | undefined {
    return SCENARIO_LIBRARY.find((s) => s.id === id);
}

/* ════════════════════════ קריינות בורר התחומים ══════════════════════════ */
// מסבירה את שלושת המצבים: אותו מנוע על כל תחום; ספרייה מוכנה offline; ובמצב
// live גם הקלדת מצב חופשי. בשני המקרים — אותן שכבות שקופות.

export const DOMAIN_SWITCHER_NARRATION = {
    eyebrow: 'Domain Switcher',
    titleHe: 'אותו מנוע, כל תחום',
    intro: 'המנוע השקוף אינו "על החבילות" — הוא על כל מצב. אפשר לבחור תחום מוכן מהספרייה (רפואה, חיוב, IT, משאבי אנוש), או, במצב live, להקליד מצב משלכם והמערכת תבנה לו תרחיש. בשני המקרים המנוע השקוף מציג בדיוק את אותן שכבות.',
    takeaway: 'האילוסטרציה מתחלפת בין תחומים, המנגנון נשאר. גם בלי חיבור חי, אפשר לראות את המנוע עובד על תחומים שונים — בזכות הספרייה המובנית.',
    tryThis: 'בחרו תחום מהספרייה שונה מחבילות (למשל בריאות), ועברו בין Chat ל-Agent כדי לראות את אותו pipeline שקוף מתאר אותו.',
} as const;
