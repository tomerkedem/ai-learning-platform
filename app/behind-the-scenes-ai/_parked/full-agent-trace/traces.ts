// תזמור המעבדה המאוחדת של פרק 14: "Behind the Scenes Lab".
// זה פרק אינטגרציה, לא מושג חדש. העיקרון ההנדסי: reuse, לא rebuild, ומקור
// אמת אחד. הקובץ הזה אינו מחשב דבר בעצמו, הוא מתזמר את המנועים שכבר נבנו:
//   * Token IDs        -> פרק 6  (idForWord)
//   * Vector/Similarity/Scores/Probabilities -> פרק 8 (analyzeSentence)
//   * Confidence/Gate  -> פרק 9  (distributionForChat, evaluateGate)
//   * Task parsing     -> פרק 10  (parse)
//   * Tool selection   -> פרק 11 (selectFor)
//   * Tool call/Observation -> פרק 12 (TOOL_CALL, getObservation)
//   * Risk/Control     -> פרק 13 (evaluate)
// כל מספר שמוצג במעבדה מגיע מהמנועים האלה, בלי קידוד קשיח ובלי חישוב סותר.

import { idForWord } from '@/app/behind-the-scenes-ai/chapter-4/embeddingEngine';
import { analyzeSentence, DIMS, DIM_INFO } from '@/app/behind-the-scenes-ai/chapter-6/pipelineData';
import { INTENT_META, metaFor } from '@/app/behind-the-scenes-ai/_parked/confidence/gateData';
import { evaluateGate, buildClarifyingQuestion } from '@/app/behind-the-scenes-ai/_parked/confidence/gateLogic';
import { DEFAULT_THRESHOLD } from '@/app/behind-the-scenes-ai/_parked/confidence/gateData';
import { parse } from '@/app/behind-the-scenes-ai/_parked/chat-to-agent/taskData';
import { selectFor, getTool } from '@/app/behind-the-scenes-ai/_parked/tool-selection/toolData';
import { TOOL_CALL, getObservation } from '@/app/behind-the-scenes-ai/_parked/tool-call/observationData';
import { evaluate as evaluateControl } from '@/app/behind-the-scenes-ai/_parked/agent-control/controlEngine';
import { ACTION_META, RISK_META as CONTROL_RISK_META } from '@/app/behind-the-scenes-ai/_parked/agent-control/controlData';
import type { ConfidenceLevel } from '@/app/behind-the-scenes-ai/chapter-6/scoringEngine';

/* ════════════════════════ טיפוסי שלב במסלול ══════════════════════════════ */

export type StageState = 'done' | 'active' | 'blocked' | 'pending' | 'skipped';

/** מטען השלב, מסוג discriminated לפי kind, כדי שהרינדור יהיה בטוח. */
export type StagePayload =
    | { kind: 'input'; text: string }
    | { kind: 'tokens'; tokens: string[] }
    | { kind: 'ids'; pairs: { token: string; id: number | null }[] }
    | { kind: 'vector'; dims: { he: string; en: string; value: number }[] }
    | { kind: 'sim'; items: { labelHe: string; labelEn: string; value: number }[] }
    | { kind: 'scores'; items: { labelHe: string; value: number }[] }
    | { kind: 'probs'; items: { labelHe: string; value: number; lead: boolean }[] }
    | { kind: 'confidence'; top: number; second: number; margin: number; levelHe: string; levelEn: string }
    | { kind: 'response'; text: string; decisionHe: string; tone: Tone }
    | { kind: 'task'; actionHe: string; requestHe: string }
    | { kind: 'missing'; items: { he: string; present: boolean }[]; note: string }
    | { kind: 'tools'; items: { nameEn: string; match: number }[]; selectedEn: string | null }
    | { kind: 'call'; code: string; called: boolean }
    | { kind: 'observation'; fields: { key: string; value: string }[]; available: boolean }
    | { kind: 'risk'; actionHe: string; riskHe: string; approvalHe: string; tone: Tone }
    | { kind: 'decision'; he: string; en: string; detail: string; tone: Tone };

export type Tone = 'answer' | 'ask' | 'tool' | 'stop' | 'neutral';

export interface Stage {
    id: string;
    he: string;
    en: string;
    state: StageState;
    /** משפט שמסביר את השלב (גארדרייל: אין שלב בלי הסבר). */
    explainHe: string;
    payload: StagePayload;
}

export interface Trace {
    mode: 'chat' | 'agent';
    text: string;
    stages: Stage[];
    /** תקציר ההתנהגות, להשוואה. */
    outcomeHe: string;
    outcomeTone: Tone;
}

/* ════════════════════════ עזרי תצוגה ═════════════════════════════════════ */

const CONF_HE: Record<ConfidenceLevel, string> = {
    High: 'גבוה', Medium: 'בינוני', 'Medium-low': 'נמוך-בינוני', Low: 'נמוך',
};

const round = (n: number) => Math.round(n);
const f2 = (n: number) => Number(n.toFixed(2));

/* ════════════════════════ מסלול Chat (פרקים 6, 7, 8) ═════════════════════ */

/**
 * בונה את מסלול ה-Chat המלא מהמנועים. כל המספרים מגיעים מ-analyzeSentence
 * (פרק 8) ומשער הביטחון (פרק 9). אין כאן חישוב נוסף.
 */
export function traceChat(text: string): Trace {
    const r = analyzeSentence(text); // פרק 8: tokens, vector, items (sim/score/prob), margin, confidence
    const hasInput = r.hasInput;

    const ids = r.tokens.map((t) => idForWord(t)); // פרק 6
    const simSorted = [...r.items].sort((a, b) => b.similarity - a.similarity);
    const topItems = r.items.slice(0, 4);

    // שער הביטחון (פרק 9): האם הפער מספיק כדי לענות.
    const gate = evaluateGate(r.marginPct, DEFAULT_THRESHOLD, 'chat');
    const top = r.items[0];
    const second = r.items[1];
    const responseText = gate.open
        ? (INTENT_META[top?.id ?? '']?.answerHe ?? metaFor(top?.id ?? '').answerHe)
        : buildClarifyingQuestion(
              metaFor(top?.id ?? '', top?.labelHe).clarifyOptionHe,
              metaFor(second?.id ?? '', second?.labelHe).clarifyOptionHe,
          );
    const responseTone: Tone = gate.open ? 'answer' : 'ask';
    const decisionHe = gate.open ? 'מתן תשובה' : 'בקשת הקשר נוסף';

    const st = (i: number): StageState => (!hasInput ? (i === 0 ? 'active' : 'pending') : 'done');

    const stages: Stage[] = [
        {
            id: 'input', he: 'קלט', en: 'Input', state: hasInput ? 'done' : 'active',
            explainHe: 'מה שהמשתמש כתב. בחיים האמיתיים זו פשוט בקשה, לא הוראה טכנית.',
            payload: { kind: 'input', text: text || '...' },
        },
        {
            id: 'tokens', he: 'טוקנים', en: 'Tokens', state: st(1),
            explainHe: 'הטקסט נשבר ליחידות עבודה. כל מילה הופכת לטוקן (פרק 3).',
            payload: { kind: 'tokens', tokens: r.tokens },
        },
        {
            id: 'ids', he: 'מזהים', en: 'Token IDs', state: st(2),
            explainHe: 'כל טוקן מקבל מזהה מספרי מהמילון. ה-ID הוא כתובת, לא משמעות (פרק 6).',
            payload: { kind: 'ids', pairs: r.tokens.map((t, i) => ({ token: t, id: ids[i] })) },
        },
        {
            id: 'vector', he: 'וקטור', en: 'Vector', state: st(3),
            explainHe: 'מרצף המזהים נבנה וקטור משמעות: לאן המשפט מצביע (פרק 6).',
            payload: { kind: 'vector', dims: DIMS.map((key, i) => ({ he: DIM_INFO[key].he, en: DIM_INFO[key].en, value: r.vector[i] ?? 0 })) },
        },
        {
            id: 'similarity', he: 'דמיון', en: 'Similarity', state: st(4),
            explainHe: 'Cosine Similarity בין הווקטור לכל כוונה. זה ציון קרבה, לא הסתברות (פרק 8).',
            payload: { kind: 'sim', items: simSorted.slice(0, 4).map((it) => ({ labelHe: it.labelHe, labelEn: it.labelEn, value: f2(it.similarity) })) },
        },
        {
            id: 'scores', he: 'ציונים', en: 'Scores', state: st(5),
            explainHe: 'score = similarity + word_impact + context_bonus. הציונים הגולמיים לא מסתכמים ל-100% (פרק 8).',
            payload: { kind: 'scores', items: topItems.map((it) => ({ labelHe: it.labelHe, value: f2(it.score) })) },
        },
        {
            id: 'probabilities', he: 'הסתברויות', en: 'Probabilities', state: st(6),
            explainHe: 'Softmax הופך את הציונים להסתברויות שמסתכמות ל-100% (פרק 8).',
            payload: { kind: 'probs', items: topItems.map((it) => ({ labelHe: it.labelHe, value: round(it.prob * 100), lead: it.id === top?.id })) },
        },
        {
            id: 'confidence', he: 'ביטחון', en: 'Confidence', state: st(7),
            explainHe: 'הפער בין הראשון לשני הוא שקובע אם בכלל לענות (פרק 9).',
            payload: { kind: 'confidence', top: round((top?.prob ?? 0) * 100), second: round((second?.prob ?? 0) * 100), margin: round(r.marginPct), levelHe: CONF_HE[r.confidence], levelEn: r.confidence },
        },
        {
            id: 'response', he: 'תגובה', en: 'Response', state: hasInput ? 'active' : 'pending',
            explainHe: gate.open ? 'הפער מספיק, אז המערכת עונה לפי הכוונה המובילה.' : 'הפער קטן מדי, אז במקום לנחש המערכת מבקשת הקשר נוסף.',
            payload: { kind: 'response', text: hasInput ? responseText : '...', decisionHe, tone: responseTone },
        },
    ];

    return {
        mode: 'chat',
        text,
        stages,
        outcomeHe: gate.open ? `תשובה: ${top?.labelHe ?? ''}` : 'בקשת הקשר נוסף',
        outcomeTone: responseTone,
    };
}

/* ════════════════════════ מסלול Agent (פרקים 9 עד 12) ════════════════════ */

type AgentBehavior = 'answer' | 'ask-barcode' | 'stop-approval' | 'clarify' | 'answer-direct' | 'blocked';

interface AgentPlan {
    behavior: AgentBehavior;
    reached: { task: boolean; missing: boolean; tools: boolean; call: boolean; observation: boolean; risk: boolean };
    decisionHe: string;
    decisionEn: string;
    detailHe: string;
    tone: Tone;
}

function planAgent(text: string): AgentPlan {
    const task = parse(text); // פרק 10
    const sel = selectFor(text).selection; // פרק 11

    if (task.requestType === 'question') {
        return {
            behavior: 'answer-direct',
            reached: { task: true, missing: false, tools: false, call: false, observation: false, risk: false },
            decisionHe: 'מענה ישיר', decisionEn: 'Answer directly',
            detailHe: 'זו שאלה כללית, לא משימה. אפשר לענות ישירות בלי כלי.',
            tone: 'answer',
        };
    }
    if (!task.goalClear) {
        return {
            behavior: 'clarify',
            reached: { task: true, missing: false, tools: false, call: false, observation: false, risk: false },
            decisionHe: 'שאלה מבהירה', decisionEn: 'Ask to clarify',
            detailHe: 'היעד עמום. לפני בחירת כלי צריך להבהיר מה המטרה.',
            tone: 'ask',
        };
    }
    if (sel.decision === 'stop-approval') {
        return {
            behavior: 'stop-approval',
            reached: { task: true, missing: true, tools: true, call: false, observation: false, risk: true },
            decisionHe: 'עצירה לאישור אנושי', decisionEn: 'Stop for approval',
            detailHe: 'הפעולה רגישה (סיכון גבוה). עוצרים ומכינים טיוטה לאישור, לא שולחים.',
            tone: 'stop',
        };
    }
    if (sel.decision === 'cannot-use') {
        return {
            behavior: 'blocked',
            reached: { task: true, missing: true, tools: true, call: false, observation: false, risk: true },
            decisionHe: 'פעולה חסומה', decisionEn: 'Cannot use tool',
            detailHe: 'הכלי מתאים, אבל חסרה הרשאה להשתמש בו.',
            tone: 'stop',
        };
    }
    if (sel.decision === 'ask-input') {
        return {
            behavior: 'ask-barcode',
            reached: { task: true, missing: true, tools: true, call: false, observation: false, risk: false },
            decisionHe: `בקשת ${sel.missingInputHe ?? 'קלט'}`, decisionEn: 'Ask for input',
            detailHe: `הכלי רלוונטי אבל חסר לו הקלט (${sel.missingInputHe ?? 'קלט'}). מבקשים אותו, לא מנחשים.`,
            tone: 'ask',
        };
    }
    // ready: tool called -> observation -> control allows answer
    return {
        behavior: 'answer',
        reached: { task: true, missing: true, tools: true, call: true, observation: true, risk: true },
        decisionHe: 'מתן תשובה', decisionEn: 'Answer',
        detailHe: 'כל השערים ירוקים: כלי מתאים, קלט קיים, סיכון נסבל, אין צורך באישור. אפשר לענות לפי התוצאה.',
        tone: 'answer',
    };
}

/** בונה את מסלול ה-Agent המלא מהמנועים של פרקים 9 עד 12. */
export function traceAgent(text: string): Trace {
    const task = parse(text); // פרק 10
    const sel = selectFor(text).selection; // פרק 11
    const control = evaluateControl(text, { confidence: 'high', conflict: false, evidenceVerified: false }); // פרק 13
    const plan = planAgent(text);
    const obs = getObservation('clear'); // פרק 12: התוצאה כשהכלי מופעל

    const topTools = [...sel.evals].sort((a, b) => b.match - a.match).slice(0, 4);
    const selectedTool = sel.selectedToolId ? getTool(sel.selectedToolId) : (sel.topRelevantId ? getTool(sel.topRelevantId) : undefined);

    const stateFrom = (reached: boolean, isStop: boolean): StageState => (reached ? (isStop ? 'active' : 'done') : 'pending');

    const stages: Stage[] = [
        {
            id: 'input', he: 'קלט', en: 'Input', state: 'done',
            explainHe: 'הבקשה של המשתמש. אותו קלט בדיוק כמו ב-Chat, אבל כאן הוא מפעיל מנוע פעולה.',
            payload: { kind: 'input', text: text || '...' },
        },
        {
            id: 'task', he: 'משימה', en: 'Task', state: plan.reached.task ? 'done' : 'pending',
            explainHe: 'מילת פעולה הופכת שאלה למשימה. ה-Agent מזהה מה צריך לעשות (פרק 10).',
            payload: { kind: 'task', actionHe: task.action ? `${task.action.word} (${task.action.en})` : 'אין פעולה', requestHe: task.requestType === 'task' ? 'משימה' : 'שאלה' },
        },
        {
            id: 'missing', he: 'מידע חסר', en: 'Missing Info',
            state: plan.behavior === 'ask-barcode' ? 'active' : stateFrom(plan.reached.missing, false),
            explainHe: 'ה-Agent בודק מה עדיין חסר כדי לפעול. מידע חסר מוביל לבקשה, לא לניחוש (פרק 10).',
            payload: { kind: 'missing', items: task.requiredData.map((d) => ({ he: d.def.he, present: d.present })), note: task.missingData.length ? `חסר: ${task.missingData.map((d) => d.he).join(', ')}` : 'כל המידע הנדרש קיים' },
        },
        {
            id: 'tools', he: 'בחירת כלי', en: 'Tool Selection', state: stateFrom(plan.reached.tools, false),
            explainHe: 'ה-Agent מדרג כמה כל כלי מתאים, ובוחר את המוביל (פרק 11).',
            payload: { kind: 'tools', items: topTools.map((e) => ({ nameEn: e.tool.nameEn, match: round(e.match * 100) })), selectedEn: selectedTool?.nameEn ?? null },
        },
        {
            id: 'call', he: 'הפעלת כלי', en: 'Tool Call',
            state: plan.reached.call ? 'done' : (plan.reached.tools && !plan.reached.call ? 'blocked' : 'pending'),
            explainHe: 'קריאה מוגדרת לכלי, עם קלט מדויק. בלי קלט תקין או הרשאה, הקריאה לא מופעלת (פרק 12).',
            payload: { kind: 'call', code: `trackingApi.${TOOL_CALL.method}({ ${TOOL_CALL.inputKey}: "${TOOL_CALL.inputValue}" })`, called: plan.reached.call },
        },
        {
            id: 'observation', he: 'תוצאה', en: 'Observation', state: stateFrom(plan.reached.observation, false),
            explainHe: 'מה שהכלי החזיר. זה מידע חדש שהגיע מבחוץ, לא ידע שהיה למודל (פרק 12).',
            payload: { kind: 'observation', fields: plan.reached.observation ? obs.fields.map((fld) => ({ key: fld.key, value: fld.value })) : [], available: plan.reached.observation },
        },
        {
            id: 'risk', he: 'בדיקת סיכון', en: 'Risk Check',
            state: (plan.behavior === 'stop-approval' || plan.behavior === 'blocked') ? 'active' : stateFrom(plan.reached.risk, false),
            explainHe: 'גם אחרי שהתוצאה חזרה, יש שער: סיכון והרשאה. סיכון גבוה דורש אישור (פרק 13).',
            payload: { kind: 'risk', actionHe: control.action ? ACTION_META[control.action].he : 'הסבר סטטוס', riskHe: CONTROL_RISK_META[control.risk].he, approvalHe: control.gate === 'open' ? 'לא נדרש' : 'נדרש', tone: control.gate === 'open' ? 'answer' : 'stop' },
        },
        {
            id: 'decision', he: 'החלטה', en: 'Decision', state: 'active',
            explainHe: 'הצעד הסופי: תשובה, בקשת מידע, שימוש בכלי, או עצירה לאישור.',
            payload: { kind: 'decision', he: plan.decisionHe, en: plan.decisionEn, detail: plan.detailHe, tone: plan.tone },
        },
    ];

    return {
        mode: 'agent',
        text,
        stages,
        outcomeHe: plan.decisionHe,
        outcomeTone: plan.tone,
    };
}

/** בונה את המסלול לפי המצב. */
export function buildTrace(text: string, mode: 'chat' | 'agent'): Trace {
    return mode === 'chat' ? traceChat(text) : traceAgent(text);
}

/* ════════════════════════ נוסחאות הלומדה ══════════════════════════════════ */

export const FORMULAS: { he: string; en: string; chapter: string }[] = [
    { he: 'ציון', en: 'score = similarity + word_impact + context_bonus', chapter: 'פרק 8' },
    { he: 'הסתברויות', en: 'probabilities = softmax(scores)', chapter: 'פרק 8' },
    { he: 'פער ביטחון', en: 'confidence_margin = top - second', chapter: 'פרק 9' },
    { he: 'ציון כלי', en: 'tool_score = task_match + data_match - risk_penalty', chapter: 'פרק 11' },
    { he: 'אישור פעולה', en: 'action_allowed = confidence_high AND risk_low AND permission_granted', chapter: 'פרק 13' },
];

/* ════════════════════════ הניסוי המסכם ═══════════════════════════════════ */
// ארבעה תרחישים שמראים את כל טווח ההתנהגויות: Answer, Ask for context,
// Use tool, Stop for approval. כל אחד עובר במנועים, אז הפלט מחושב חי.

export interface SummaryScenario {
    id: string;
    mode: 'chat' | 'agent';
    text: string;
    labelHe: string;
    labelEn: string;
    behaviorHe: string;
}

export const SUMMARY_SCENARIOS: SummaryScenario[] = [
    { id: 'chat-clear', mode: 'chat', text: 'החבילה לא הגיעה', labelHe: 'צ׳אט ברור', labelEn: 'Clear chat', behaviorHe: 'תשובה' },
    { id: 'chat-ambiguous', mode: 'chat', text: 'החבילה לא מופיעה במערכת', labelHe: 'צ׳אט עמום', labelEn: 'Ambiguous chat', behaviorHe: 'בקשת הקשר' },
    { id: 'agent-investigate', mode: 'agent', text: 'בדוק למה החבילה 123456789 לא הגיעה', labelHe: 'Agent חוקר', labelEn: 'Agent investigate', behaviorHe: 'שימוש בכלי' },
    { id: 'agent-send', mode: 'agent', text: 'שלח ללקוח הודעה שהחבילה אבדה', labelHe: 'פעולה רגישה', labelEn: 'Risky action', behaviorHe: 'עצירה לאישור' },
];

/* ════════════════════════ קריינות לכל רכיב ═══════════════════════════════ */

export interface SectionNarration {
    eyebrow: string;
    titleHe: string;
    intro: string;
    takeaway: string;
    tryThis: string;
}

export const NARRATION: Record<string, SectionNarration> = {
    lab: {
        eyebrow: 'Full Behind the Scenes Lab',
        titleHe: 'המעבדה המלאה',
        intro: 'בחיים האמיתיים המשתמש לא כותב "עכשיו תבצע Tokenization". הוא פשוט כותב "בדוק למה החבילה לא הגיעה", ומצפה שהמערכת תבין מה לעשות. המעבדה מראה שהבקשה הפשוטה הזאת מפעילה תהליך שלם. בצד אחד אתם כותבים, בצד השני המנוע נפתח שלב אחר שלב. בבורר התחומים אפשר להחליף בין התרחיש המאומת, תחום מוכן מהספרייה, ובמצב חי גם מצב חופשי משלכם.',
        takeaway: 'בקשה אחת מפעילה מנוע שלם, ואותו מנוע עובד על כל תחום. גם בלי חיבור חי, הספרייה מראה אותו על רפואה, חיוב, IT ומשאבי אנוש. האילוסטרציה מתחלפת, המנגנון נשאר.',
        tryThis: 'בחרו תחום מהספרייה שונה מחבילות, ועברו בין Chat ל-Agent כדי לראות את אותו pipeline שקוף מתאר אותו. במצב חי אפשר גם להקליד מצב משלכם והמערכת תבנה לו תרחיש.',
    },
    chatReplay: {
        eyebrow: 'Chat Mode Replay',
        titleHe: 'ניגון מסלול הצ׳אט',
        intro: 'בלי Replay קל לפספס מה שקרה מהר מדי. כאן אפשר להריץ את כל מסלול ה-Chat לאט, מ-Input ועד Response, ולעצור בכל שלב.',
        takeaway: 'ב-Chat המערכת לא קפצה מטקסט לתשובה, היא עברה דרך ייצוג, דירוג, הסתברות וביטחון.',
        tryThis: 'לחצו Replay במצב Chat ועצרו בשלב Confidence, ושימו לב שזה מה שקובע אם בכלל לענות.',
    },
    agentReplay: {
        eyebrow: 'Agent Mode Replay',
        titleHe: 'ניגון מסלול ה-Agent',
        intro: 'מסלול ה-Agent ארוך יותר, ויש בו רגעים שבהם המערכת עוצרת. Replay מאפשר לראות שהיא לא רק מחזירה טקסט, היא מתקדמת בתהליך ולפעמים עוצרת לבקש מידע או אישור.',
        takeaway: 'ב-Agent יש לולאה, כלים, ושערי בקרה, לא רק תשובה.',
        tryThis: 'הריצו Replay במצב Agent ועצרו אחרי Observation, ושימו לב שה-Agent עדיין צריך להחליט אם מותר לפעול.',
    },
    compare: {
        eyebrow: 'Compare Chat vs Agent',
        titleHe: 'השוואה: צ׳אט מול Agent',
        intro: 'התצוגה החזקה ביותר במעבדה. ניקח את "בדוק למה החבילה לא הגיעה". ב-Chat המערכת מזהה בקשת הסבר ומסבירה. ב-Agent היא מזהה משימה, מגלה שחסר ברקוד, ומחליטה לבקש אותו לפני פעולה. אותו משפט, שני מנועים, שתי התנהגויות.',
        takeaway: 'אותו קלט יכול להוביל לתשובה כללית בצ׳אט ולתהליך פעולה ב-Agent. ההבדל הוא במנוע, לא במילים.',
        tryThis: 'כתבו "בדוק למה החבילה לא הגיעה" וראו את שני המסלולים זה לצד זה, איפה כל אחד מתפצל.',
    },
    formula: {
        eyebrow: 'Formula View',
        titleHe: 'תצוגת הנוסחאות',
        intro: 'למי שרוצה לראות את החישוב, Formula View חושף את המתמטיקה מאחורי התנועה. כל הנוסחאות שלמדנו, מהציון ועד אישור הפעולה, במקום אחד. זה לא חייב להיות פתוח כל הזמן, הוא כלי להעמקה.',
        takeaway: 'כל שלב חזותי במעבדה נשען על חישוב, ואפשר לפתוח ולראות אותו.',
        tryThis: 'פתחו Formula View וצפו איך softmax הופך את הציונים החיים להסתברויות שמסתכמות ל-100%.',
    },
    presentation: {
        eyebrow: 'Presentation Mode',
        titleHe: 'מצב הצגה',
        intro: 'מצב לימוד עצמי מציג פרטים, טבלאות וכפתורים. מצב הצגה צריך מסך נקי יותר: גדול, ברור, מעט טקסט, שלבים מודגשים, וכפתור Next. המטרה אינה להראות הכל בבת אחת, אלא לשלוט בקשב.',
        takeaway: 'אותה מעבדה, שני מצבי חשיפה. חקירה ללומד, הצגה מודרכת למרצה.',
        tryThis: 'עברו ל-Presentation Mode ולחצו Next, ושימו לב שבכל שלב נחשף רק החלק הרלוונטי לרגע.',
    },
};
