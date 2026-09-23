// מוקפא (parked): מחולל התרחיש החי (השכבה החיה, layer 2) של המעבדה המאוחדת הישנה.
// נשמר תחת _parked/full-agent-trace לשימוש עתידי בפרקי ה-Agent (17-19). מכיוון שהקובץ
// יושב בתיקיית _parked (תיקייה פרטית שאינה מנותבת), הוא כבר אינו endpoint פעיל.
//
// תפקידו המקורי: להפוך טקסט חופשי שהלומד מקליד לתרחיש בסכמה הקנונית, כדי שהמנוע
// השקוף יציג אותו דרך אותו pipeline בדיוק. רץ אך ורק בצד שרת -
// ANTHROPIC_API_KEY לעולם לא מגיע לדפדפן.
//
// גארדריילים:
//   * structured output כפוי + ולידציה בצד שרת, כדי שהפלט תמיד תואם לסכמה
//     שה-presenter (scenarioLibrary.ts) יודע לצייר.

import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

import { rateLimit } from '@/lib/rateLimit';
import type { LibraryScenario, Tone, LibAgentBehavior, LibChatBehavior } from './scenarioLibrary';

export const runtime = 'nodejs';

const MODEL = process.env.WORD_ENGINE_MODEL ?? 'claude-haiku-4-5-20251001';

/** האם הוגדר מפתח אמיתי (לא הפלייסהולדר). קובע אם השכבה החיה זמינה. */
function hasApiKey(): boolean {
    const k = process.env.ANTHROPIC_API_KEY;
    return !!k && !k.includes('REPLACE-WITH');
}

// GET קל לזיהוי יכולת (capability detection): האם השכבה החיה זמינה, בלי לחשוף
// את המפתח.
export function GET() {
    return NextResponse.json({ live: hasApiKey() });
}

/* ════════════════════════ סכמת הפלט הכפויה ═══════════════════════════════ */
// structured outputs לא תומך ב-min/max; הטווחים (0-100) נאכפים בהנחיה ונאכפים
// שוב בולידציה בצד שרת (clamp).

const DIM = {
    type: 'object', additionalProperties: false,
    properties: { he: { type: 'string' }, en: { type: 'string' }, value: { type: 'integer' } },
    required: ['he', 'en', 'value'],
};
const CANDIDATE = {
    type: 'object', additionalProperties: false,
    properties: {
        labelHe: { type: 'string' }, labelEn: { type: 'string' },
        similarity: { type: 'integer' }, score: { type: 'integer' }, prob: { type: 'integer' },
    },
    required: ['labelHe', 'labelEn', 'similarity', 'score', 'prob'],
};
const TOOL = {
    type: 'object', additionalProperties: false,
    properties: { nameEn: { type: 'string' }, match: { type: 'integer' } },
    required: ['nameEn', 'match'],
};
const TONES = ['answer', 'ask', 'tool', 'stop', 'neutral'];

const SCENARIO_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    properties: {
        domainHe: { type: 'string' },
        domainEn: { type: 'string' },
        tokens: { type: 'array', items: { type: 'string' } },
        dims: { type: 'array', items: DIM },
        candidates: { type: 'array', items: CANDIDATE },
        confidenceLevelHe: { type: 'string' },
        confidenceLevelEn: { type: 'string' },
        chat: {
            type: 'object', additionalProperties: false,
            properties: {
                behavior: { type: 'string', enum: ['answer', 'ask'] },
                responseHe: { type: 'string' },
                decisionHe: { type: 'string' },
                outcomeHe: { type: 'string' },
            },
            required: ['behavior', 'responseHe', 'decisionHe', 'outcomeHe'],
        },
        agent: {
            type: 'object', additionalProperties: false,
            properties: {
                behavior: { type: 'string', enum: ['use-tool', 'ask-input', 'stop-approval', 'answer-direct'] },
                taskActionHe: { type: 'string' },
                requestHe: { type: 'string' },
                missingItems: {
                    type: 'array',
                    items: {
                        type: 'object', additionalProperties: false,
                        properties: { he: { type: 'string' }, present: { type: 'boolean' } },
                        required: ['he', 'present'],
                    },
                },
                missingNote: { type: 'string' },
                tools: { type: 'array', items: TOOL },
                selectedEn: { type: 'string' },
                callCode: { type: 'string' },
                callCalled: { type: 'boolean' },
                observationAvailable: { type: 'boolean' },
                observationFields: {
                    type: 'array',
                    items: {
                        type: 'object', additionalProperties: false,
                        properties: { key: { type: 'string' }, value: { type: 'string' } },
                        required: ['key', 'value'],
                    },
                },
                riskActionHe: { type: 'string' },
                riskHe: { type: 'string' },
                approvalHe: { type: 'string' },
                riskTone: { type: 'string', enum: TONES },
                decisionHe: { type: 'string' },
                decisionEn: { type: 'string' },
                decisionDetail: { type: 'string' },
                decisionTone: { type: 'string', enum: TONES },
                outcomeHe: { type: 'string' },
            },
            required: [
                'behavior', 'taskActionHe', 'requestHe', 'missingItems', 'missingNote', 'tools',
                'selectedEn', 'callCode', 'callCalled', 'observationAvailable', 'observationFields',
                'riskActionHe', 'riskHe', 'approvalHe', 'riskTone',
                'decisionHe', 'decisionEn', 'decisionDetail', 'decisionTone', 'outcomeHe',
            ],
        },
    },
    required: ['domainHe', 'domainEn', 'tokens', 'dims', 'candidates', 'confidenceLevelHe', 'confidenceLevelEn', 'chat', 'agent'],
} as const;

const SYSTEM_PROMPT = `אתה "מחולל התרחיש" של מעבדת AI שקופה. הלומד מקליד מצב חופשי מכל תחום
(רפואה, IT, משפט, חינוך, פיננסים, וכו'), ואתה בונה לו תרחיש מובנה שמראה איך מנוע
שפה היה מנתח אותו - גם כמנוע תשובה (Chat) וגם כמנוע פעולה (Agent).

עליך להפיק (דרך הכלי emit_scenario בלבד):
- domainHe/domainEn: שם התחום שזיהית מהטקסט.
- tokens: פירוק הטקסט למילים/טוקנים משמעותיים לפי הסדר.
- dims: 4-5 צירי משמעות רלוונטיים לתחום, כל value שלם 0-100.
- candidates: 4-5 פרשנויות אפשריות של ההודעה, ממוין יורד לפי prob. לכל אחת
  similarity (0-100, ציון קרבה), score (0-100, ציון גולמי), prob (0-100). סכום ה-prob = 100.
  המוביל ראשון. כלול תמיד "אחר/Other" אחרון עם prob נמוך.
- confidenceLevelHe/En: "גבוה/High", "בינוני/Medium", "נמוך-בינוני/Medium-low", או "נמוך/Low".
- chat: behavior=answer אם הפער ברור, או ask אם עמום (אז responseHe = שאלה מבהירה).
- agent: בחר behavior לפי המצב:
    use-tool      = כלי קריא בלבד, מידע קיים, סיכון נמוך → אפשר לפעול ולענות.
    ask-input     = הכלי מתאים אבל חסר קלט הכרחי → לבקש אותו (callCalled=false).
    stop-approval = הפעולה רגישה/סיכון גבוה (שולחת, מוחקת, מחייבת כסף) → לעצור לאישור אנושי (callCalled=false).
    answer-direct = שאלת ידע כללית, לא משימה, בלי כלי.
  מלא בהתאם: missingItems (מה נדרש ומה קיים), tools (2-4 כלים עם match 0-100), selectedEn,
  callCode (קוד קריאה לדוגמה; אם לא הופעל, ציין בהערה שהוא חסום/חסר קלט), observationAvailable
  (true רק ב-use-tool), observationFields (תוצאת הכלי, או ריק), risk (action/risk/approval/tone),
  decision (he/en/detail/tone), outcomeHe.

עקרונות יושרה לשמור: דמיון אינו הסתברות; זיהוי משימה אינו אישור לפעול; יכולת אינה
הרשאה; עצירה אינה כישלון. פעולות שמשנות מצב או שולחות החוצה → סיכון גבוה ואישור.
כל הטקסט בעברית טבעית. החזר אך ורק דרך הכלי.`;

/* ════════════════════════ עזרי ולידציה ═══════════════════════════════════ */

const clamp = (n: unknown, lo: number, hi: number, fallback: number): number => {
    const x = typeof n === 'number' && Number.isFinite(n) ? n : fallback;
    return Math.min(hi, Math.max(lo, Math.round(x)));
};
const str = (s: unknown, fallback = ''): string => (typeof s === 'string' && s.trim() ? s : fallback);
const asTone = (t: unknown): Tone => (TONES.includes(t as string) ? (t as Tone) : 'neutral');

// מזהה דטרמיניסטי יציב לכל טוקן (כתובת במילון, לא משמעות). נגזר משם הטוקן כדי
// שלא נדרוש מהמודל להמציא IDs ולא ניצור אי-התאמת אורך מול tokens.
function idForToken(tok: string): number {
    let h = 0;
    for (let i = 0; i < tok.length; i++) h = (h * 31 + tok.charCodeAt(i)) % 9000;
    return h + 1000; // 1000..9999
}

/** ממיר את פלט המודל ל-LibraryScenario תקין, עם clamp לכל הטווחים. זורק אם חסר ליבה. */
function toScenario(raw: Record<string, unknown>, prompt: string): LibraryScenario {
    const tokens = Array.isArray(raw.tokens) ? (raw.tokens as unknown[]).map((t) => str(t)).filter(Boolean) : [];
    if (tokens.length === 0) throw new Error('no tokens');

    const dimsRaw = Array.isArray(raw.dims) ? (raw.dims as Record<string, unknown>[]) : [];
    const dims = dimsRaw.slice(0, 6).map((d) => ({ he: str(d.he, '-'), en: str(d.en, '-'), value: clamp(d.value, 0, 100, 0) / 100 }));
    if (dims.length === 0) throw new Error('no dims');

    const candRaw = Array.isArray(raw.candidates) ? (raw.candidates as Record<string, unknown>[]) : [];
    const candidates = candRaw.slice(0, 6).map((c) => ({
        labelHe: str(c.labelHe, '-'),
        labelEn: str(c.labelEn, '-'),
        similarity: clamp(c.similarity, 0, 130, 0) / 100,
        score: clamp(c.score, 0, 200, 0) / 100,
        prob: clamp(c.prob, 0, 100, 0),
    })).sort((a, b) => b.prob - a.prob);
    if (candidates.length < 2) throw new Error('need >= 2 candidates');

    const chat = raw.chat as Record<string, unknown>;
    const agent = raw.agent as Record<string, unknown>;
    if (!chat || !agent) throw new Error('missing chat/agent');

    const chatBehavior: LibChatBehavior = chat.behavior === 'ask' ? 'ask' : 'answer';
    const agentBehaviorRaw = str(agent.behavior, 'answer-direct');
    const agentBehavior: LibAgentBehavior = (['use-tool', 'ask-input', 'stop-approval', 'answer-direct'] as const)
        .includes(agentBehaviorRaw as LibAgentBehavior) ? (agentBehaviorRaw as LibAgentBehavior) : 'answer-direct';

    const missingItems = Array.isArray(agent.missingItems)
        ? (agent.missingItems as Record<string, unknown>[]).slice(0, 6).map((m) => ({ he: str(m.he, '-'), present: !!m.present }))
        : [];
    const tools = Array.isArray(agent.tools)
        ? (agent.tools as Record<string, unknown>[]).slice(0, 5).map((t) => ({ nameEn: str(t.nameEn, '-'), match: clamp(t.match, 0, 100, 0) }))
        : [];
    const obsFields = Array.isArray(agent.observationFields)
        ? (agent.observationFields as Record<string, unknown>[]).slice(0, 8).map((f) => ({ key: str(f.key, '-'), value: str(f.value, '-') }))
        : [];

    return {
        id: 'ai-generated',
        source: 'ai-generated',
        domainHe: str(raw.domainHe, 'תחום חופשי'),
        domainEn: str(raw.domainEn, 'Custom domain'),
        blurbHe: prompt,
        prompt,
        tokens,
        ids: tokens.map(idForToken),
        dims,
        candidates,
        confidence: { levelHe: str(raw.confidenceLevelHe, 'בינוני'), levelEn: str(raw.confidenceLevelEn, 'Medium') },
        chat: {
            behavior: chatBehavior,
            responseHe: str(chat.responseHe, '-'),
            decisionHe: str(chat.decisionHe, chatBehavior === 'answer' ? 'מתן תשובה' : 'בקשת הקשר נוסף'),
            outcomeHe: str(chat.outcomeHe, chatBehavior === 'answer' ? 'תשובה' : 'בקשת הקשר נוסף'),
        },
        agent: {
            behavior: agentBehavior,
            taskActionHe: str(agent.taskActionHe, '-'),
            requestHe: str(agent.requestHe, 'משימה'),
            missing: { items: missingItems, note: str(agent.missingNote, missingItems.some((m) => !m.present) ? 'יש מידע חסר' : 'כל המידע הנדרש קיים') },
            tools,
            selectedEn: str(agent.selectedEn) || (tools[0]?.nameEn ?? null),
            call: { code: str(agent.callCode, '-'), called: !!agent.callCalled },
            observation: { available: !!agent.observationAvailable, fields: obsFields },
            risk: {
                actionHe: str(agent.riskActionHe, '-'),
                riskHe: str(agent.riskHe, 'סיכון נמוך'),
                approvalHe: str(agent.approvalHe, 'לא נדרש'),
                tone: asTone(agent.riskTone),
            },
            decision: {
                he: str(agent.decisionHe, '-'),
                en: str(agent.decisionEn, '-'),
                detail: str(agent.decisionDetail, '-'),
                tone: asTone(agent.decisionTone),
            },
            outcomeHe: str(agent.outcomeHe, '-'),
        },
    };
}

export async function POST(req: Request) {
    const limited = rateLimit(req);
    if (limited) return limited;

    if (!hasApiKey()) {
        return NextResponse.json(
            { error: 'missing_api_key', message: 'השכבה החיה לא זמינה (לא הוגדר ANTHROPIC_API_KEY).' },
            { status: 503 },
        );
    }

    let body: { text?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'bad_json' }, { status: 400 });
    }

    const text = (body.text ?? '').trim();
    if (!text) return NextResponse.json({ error: 'empty_text' }, { status: 400 });
    if (text.length > 400) return NextResponse.json({ error: 'text_too_long' }, { status: 400 });

    const client = new Anthropic(); // קורא את ANTHROPIC_API_KEY מהסביבה

    try {
        const message = await client.messages.create({
            model: MODEL,
            max_tokens: 2200,
            system: SYSTEM_PROMPT,
            tools: [
                {
                    name: 'emit_scenario',
                    description: 'מחזיר את התרחיש המובנה בסכמה הקנונית.',
                    strict: true,
                    input_schema: SCENARIO_SCHEMA as unknown as Anthropic.Tool['input_schema'],
                },
            ],
            tool_choice: { type: 'tool', name: 'emit_scenario' },
            messages: [{ role: 'user', content: text }],
        });

        const toolUse = message.content.find((b) => b.type === 'tool_use');
        if (!toolUse || toolUse.type !== 'tool_use') {
            return NextResponse.json({ error: 'no_tool_use' }, { status: 502 });
        }

        const scenario = toScenario(toolUse.input as Record<string, unknown>, text);
        return NextResponse.json({ scenario });
    } catch (err) {
        const status = err instanceof Anthropic.APIError ? (err.status ?? 502) : 502;
        const msg = err instanceof Error ? err.message : 'unknown error';
        return NextResponse.json({ error: 'generation_failed', message: msg }, { status });
    }
}
