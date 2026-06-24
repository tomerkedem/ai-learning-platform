// API route לספירת טוקנים אמיתית בפרק 1: מחזיר את מספר הטוקנים ש-Claude סופר עבור
// הקלט, דרך נקודת הקצה הרשמית count_tokens. רץ אך ורק בצד שרת - ANTHROPIC_API_KEY
// לעולם לא מגיע לדפדפן.
//
// חשוב: ה-API מחזיר מספר בלבד, לא את החלוקה עצמה. Claude לא חושף את גבולות
// הטוקנים (אין tokenizer ציבורי), ולכן אפשר להציג כמה טוקנים יש - אבל לא היכן
// כל אחד מתחיל ומסתיים. הלוח השקוף נשאר המחשה לימודית מבוססת-מילים.

import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

// אותו מודל כמו הצ'אט החי, כדי שהספירה תשקף את המודל שבאמת מייצר את התשובה.
// count_tokens תלוי-מודל: אותו טקסט נספר אחרת בכל מודל.
const MODEL = process.env.WORD_ENGINE_MODEL ?? 'claude-haiku-4-5-20251001';

/** האם הוגדר מפתח אמיתי (לא הפלייסהולדר). קובע אם הספירה החיה זמינה. */
function hasApiKey(): boolean {
    const k = process.env.ANTHROPIC_API_KEY;
    return !!k && !k.includes('REPLACE-WITH');
}

// GET קל לזיהוי יכולת, בלי לחשוף את המפתח.
export function GET() {
    return NextResponse.json({ live: hasApiKey() });
}

export async function POST(req: Request) {
    const limited = rateLimit(req);
    if (limited) return limited;

    if (!hasApiKey()) {
        return NextResponse.json({ error: 'missing_api_key' }, { status: 503 });
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
        const res = await client.messages.countTokens({
            model: MODEL,
            messages: [{ role: 'user', content: text }],
        });
        return NextResponse.json({ tokens: res.input_tokens, model: MODEL });
    } catch {
        // בכשל הלקוח פשוט לא יציג את הספירה החיה - אין נפילה קריטית.
        return NextResponse.json({ error: 'count_failed' }, { status: 502 });
    }
}
