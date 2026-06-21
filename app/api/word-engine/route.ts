// API route של "מעבדת המילים" (פרק 4): מנתחת טקסט חופשי בעזרת Claude אמיתי.
// רץ אך ורק בצד שרת — המפתח (ANTHROPIC_API_KEY) לעולם לא מגיע לדפדפן ולא ל-git.
//
// המודל מחזיר ניתוח מובנה (structured output) דרך קריאת-כלי כפויה, כך שהתשובה
// תמיד תואמת בדיוק למבנה ה-TypingStep + WordFinal שהפאנלים של המעבדה מצפים לו.
import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

import {
    CANDIDATES,
    VECTOR_LABELS,
    NEGATION_WORDS,
    type WordMode,
} from '@/app/behind-the-scenes-ai/chapter-4/wordEngine';

export const runtime = 'nodejs';

// ברירת המחדל: Haiku 4.5 (מזהה דָּטֶה יציב) — מהיר (~2-3 שניות) ומתאים לחוויית
// הקלדה אינטראקטיבית. ניתן לעקוף ב-.env.local דרך WORD_ENGINE_MODEL,
// למשל claude-opus-4-8 לניתוח איכותי יותר אך איטי בהרבה (~20 שניות).
const MODEL = process.env.WORD_ENGINE_MODEL ?? 'claude-haiku-4-5-20251001';

/** האם הוגדר מפתח אמיתי (לא הפלייסהולדר). קובע אם המעבדה במצב חי או דמו. */
function hasApiKey(): boolean {
    const k = process.env.ANTHROPIC_API_KEY;
    return !!k && !k.includes('REPLACE-WITH');
}

// GET קל: הלקוח שואל אם המנוע החי זמין, בלי לחשוף את המפתח.
export function GET() {
    return NextResponse.json({ live: hasApiKey() });
}

const CANDIDATE_IDS = CANDIDATES.map((c) => c.id);
const VECTOR_KEYS = VECTOR_LABELS.map((v) => v.key);

// סכֵמת ה-JSON שהמנוע מחויב להחזיר. structured outputs לא תומך ב-min/max,
// לכן הטווחים (0-100, סכום 100) נאכפים דרך ההנחיה ולא דרך הסכמה.
const ANALYSIS_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    properties: {
        tokens: {
            type: 'array',
            items: { type: 'string' },
            description: 'הטקסט מפורק למילים/טוקנים משמעותיים, לפי סדר ההופעה.',
        },
        probabilities: {
            type: 'object',
            additionalProperties: false,
            properties: Object.fromEntries(
                CANDIDATE_IDS.map((id) => [id, { type: 'integer' }]),
            ),
            required: CANDIDATE_IDS,
            description: 'התפלגות על חמש האפשרויות הקבועות, מספרים שלמים שסכומם 100.',
        },
        vector: {
            type: 'object',
            additionalProperties: false,
            properties: Object.fromEntries(
                VECTOR_KEYS.map((k) => [k, { type: 'integer' }]),
            ),
            required: VECTOR_KEYS,
            description: 'וקטור המשמעות, ערך 0-100 לכל ציר.',
        },
        confidence: { type: 'string', enum: ['low', 'medium-low', 'medium', 'high'] },
        mainChangeHe: { type: 'string', description: 'משפט עברי קצר על השינוי/הסיגנל המוביל.' },
        negation: { type: 'boolean' },
        negationWord: { type: 'string', description: 'מילת השלילה שזוהתה, או מחרוזת ריקה.' },
        final: {
            type: 'object',
            additionalProperties: false,
            properties: {
                kind: { type: 'string', enum: ['answer', 'context', 'clarify', 'tool', 'approval'] },
                he: { type: 'string' },
                en: { type: 'string' },
                detail: { type: 'string' },
                outcomeLabelHe: { type: 'string' },
                outcomeLabelEn: { type: 'string' },
            },
            required: ['kind', 'he', 'en', 'detail', 'outcomeLabelHe', 'outcomeLabelEn'],
        },
        agent: {
            type: 'object',
            additionalProperties: false,
            properties: {
                signalHe: { type: 'string' },
                signalEn: { type: 'string' },
                goalHe: { type: 'string' },
                goalEn: { type: 'string' },
                needsExternalData: { type: 'string', enum: ['yes', 'likely-yes', 'no'] },
                missingInfoHe: { type: 'string' },
                missingInfoEn: { type: 'string' },
                nextStepHe: { type: 'string' },
                nextStepEn: { type: 'string' },
            },
            required: [
                'signalHe', 'signalEn', 'goalHe', 'goalEn', 'needsExternalData',
                'missingInfoHe', 'missingInfoEn', 'nextStepHe', 'nextStepEn',
            ],
        },
    },
    required: ['tokens', 'probabilities', 'vector', 'confidence', 'mainChangeHe', 'negation', 'negationWord', 'final', 'agent'],
} as const;

function buildSystemPrompt(mode: WordMode): string {
    const candidates = CANDIDATES.map((c) => `- ${c.id}: ${c.he} (${c.en})`).join('\n');
    const axes = VECTOR_LABELS.map((v) => `- ${v.key}: ${v.he} (${v.en})`).join('\n');

    return `אתה "מנוע המילים" הלימודי של קורס AI, בהקשר של מוקד שירות לחברת משלוחים.
המשתמש מקליד הודעה בעברית, ואתה מנתח אותה כפי שמנוע שפה היה מדרג כוונות.

עליך לדרג את ההודעה על פני חמש האפשרויות הקבועות (probabilities, מספרים שלמים שסכומם בדיוק 100):
${candidates}

בנוסף הפק וקטור משמעות (vector), ערך 0-100 לכל ציר:
${axes}

כללים:
- tokens: פרק את הטקסט למילים/טוקנים משמעותיים לפי סדר ההופעה.
- confidence: low / medium-low / medium / high לפי כמה ההתפלגות חד-משמעית.
- negation: true אם יש מילת שלילה (${NEGATION_WORDS.join(', ')} וכד'); אם כן, מלא negationWord, אחרת מחרוזת ריקה.
- mainChangeHe: משפט עברי אחד וקצר על הסיגנל המוביל בהודעה.
- final: ההחלטה הסופית של המנוע. kind=answer/context/clarify/tool/approval. he/en = תווית קצרה, detail = משפט הסבר בעברית, outcomeLabelHe/En = "התשובה"/"Response" בצ'אט או "הצעד הבא"/"Next step" ב-Agent.
- אם ההודעה כלל לא קשורה למשלוחים/מוקד שירות, תן משקל גבוה ל-other, confidence נמוך, וב-final הסבר בעדינות שזה מחוץ לתחום.
${mode === 'agent'
            ? '- מצב Agent: מלא את כל שדות agent (signal/goal/needsExternalData/missingInfo/nextStep) בעברית ובאנגלית. ב-final השתמש בתוויות "הצעד הבא"/"Next step".'
            : '- מצב Chat: החזר את כל שדות agent כמחרוזות ריקות (ו-needsExternalData="no"). ב-final השתמש בתוויות "התשובה"/"Response".'}

החזר אך ורק דרך הכלי emit_analysis. כל הטקסט החופשי בעברית טבעית.`;
}

export async function POST(req: Request) {
    if (!hasApiKey()) {
        return NextResponse.json(
            { error: 'missing_api_key', message: 'לא הוגדר ANTHROPIC_API_KEY ב-.env.local.' },
            { status: 503 },
        );
    }

    let body: { text?: string; mode?: WordMode };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'bad_json' }, { status: 400 });
    }

    const text = (body.text ?? '').trim();
    const mode: WordMode = body.mode === 'agent' ? 'agent' : 'chat';
    if (!text) return NextResponse.json({ error: 'empty_text' }, { status: 400 });
    if (text.length > 400) return NextResponse.json({ error: 'text_too_long' }, { status: 400 });

    const client = new Anthropic(); // קורא את ANTHROPIC_API_KEY מהסביבה

    try {
        const message = await client.messages.create({
            model: MODEL,
            max_tokens: 1500,
            system: buildSystemPrompt(mode),
            tools: [
                {
                    name: 'emit_analysis',
                    description: 'מחזיר את הניתוח המובנה של ההודעה.',
                    // structured output מובטח: הסכמה נאכפת בצד השרת של ה-API.
                    strict: true,
                    input_schema: ANALYSIS_SCHEMA as unknown as Anthropic.Tool['input_schema'],
                },
            ],
            tool_choice: { type: 'tool', name: 'emit_analysis' },
            messages: [{ role: 'user', content: text }],
        });

        const toolUse = message.content.find((b) => b.type === 'tool_use');
        if (!toolUse || toolUse.type !== 'tool_use') {
            return NextResponse.json({ error: 'no_tool_use' }, { status: 502 });
        }

        // הוספת ה-text כדי שהשלב יתאים למבנה TypingStep המלא בצד הלקוח.
        return NextResponse.json({ text, ...(toolUse.input as object) });
    } catch (err) {
        const status = err instanceof Anthropic.APIError ? (err.status ?? 502) : 502;
        const msg = err instanceof Error ? err.message : 'unknown error';
        return NextResponse.json({ error: 'anthropic_error', message: msg }, { status });
    }
}
