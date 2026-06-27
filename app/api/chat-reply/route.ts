// API route של "הצ'אט החי" בפרק 1: מייצר תשובת צ'אט אמיתית מ-Claude ומזרים אותה
// טוקן-אחר-טוקן (streaming) - כדי שהלומד יראה את הלולאה האוטו-רגרסיבית קורית בפועל.
//
// רץ אך ורק בצד שרת - ANTHROPIC_API_KEY לעולם לא מגיע לדפדפן ולא ל-git.
//
// גארדריילים (שהלומד לא "ישתולל"): system prompt שממסגר את המודל לדמות מוקד-שירות
// לימודית, תקרת max_tokens, הגבלת אורך קלט. בלי מפתח -> 503 והלקוח נופל בחן
// לתשובות ה-mock הדטרמיניסטיות (mockEngine). הלוח הפנימי (הסתברויות/ראש קריאה/
// ביטחון) נשאר מודל המחשה לימודי - ה-API לא חושף logits אמיתיים.

import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

import { rateLimit } from '@/lib/rateLimit';
import type { FlowMode } from '@/components/ai-internals/types';
import { isLocale, DEFAULT_LOCALE, type Locale } from '@/i18n/config';

export const runtime = 'nodejs';

// ברירת מחדל: Haiku 4.5 - מהיר (~2-3 שניות), מתאים להזרמה אינטראקטיבית.
// ניתן לעקוף ב-.env.local דרך WORD_ENGINE_MODEL (אותו משתנה כמו שאר ה-routes).
const MODEL = process.env.WORD_ENGINE_MODEL ?? 'claude-haiku-4-5-20251001';

/** האם הוגדר מפתח אמיתי (לא הפלייסהולדר). קובע אם הצ'אט במצב חי או דמו. */
function hasApiKey(): boolean {
    const k = process.env.ANTHROPIC_API_KEY;
    return !!k && !k.includes('REPLACE-WITH');
}

// GET קל לזיהוי יכולת: האם הצ'אט החי זמין, בלי לחשוף את המפתח.
export function GET() {
    return NextResponse.json({ live: hasApiKey() });
}

// תפקיד המודל (framing + גארדריילים). שפת התשובה לא נקבעת כאן אלא בהנחיית-השפה
// הנפרדת (languageDirective), כדי שתמיד תיגזר מה-locale הנבחר ולא מהקלט של המשתמש.
const SYSTEM_CHAT = `אתה עוזר שירות לקוחות לימודי של חברת משלוחים, בתוך לומדה שמדגימה איך מודל שפה עונה.
ענה קצר (1-3 משפטים), ענייני ומנומס.
אל תמציא פרטי הזמנה, ברקוד או מספרי מעקב אמיתיים - אם חסר מידע, בקש אותו.
אם הבקשה כלל לא קשורה למשלוחים או לשירות לקוחות, החזר בעדינות את השיחה להקשר הזה במשפט אחד.
אל תבצע פעולות אמיתיות ואל תבטיח התחייבויות - זו הדגמה לימודית.`;

const SYSTEM_AGENT = `אתה Agent לימודי של חברת משלוחים, בתוך לומדה שמדגימה איך סוכן AI מחליט על הצעד הבא.
במקום רק לענות, נסח בקצרה (1-3 משפטים) מהו הצעד הנכון הבא: לענות ישירות, לבקש מידע חסר,
להשתמש בכלי (כמו מערכת מעקב משלוחים), או לעצור ולבקש אישור אם הפעולה רגישה (שליחה/עדכון/מחיקה).
אם חסר מידע הכרחי (למשל ברקוד) - אמור זאת מפורשות במקום לנחש.
אל תבצע פעולות אמיתיות ואל תבטיח התחייבויות - זו הדגמה לימודית.`;

// מיפוי locale -> שם השפה (באנגלית, חד-משמעי למודל). מקור האמת לשפת התשובה הוא
// ה-locale של הממשק, ולא זיהוי שפת הקלט של המשתמש.
const LANGUAGE_NAMES: Record<Locale, string> = {
    he: 'Hebrew',
    en: 'English',
    es: 'Spanish',
    ru: 'Russian',
    ar: 'Arabic',
    ja: 'Japanese',
};

// הנחיית-שפה נוקשה שנאכפת על-ידי האפליקציה: המודל חייב לענות בשפת הממשק הנבחרת,
// ולא לעבור שפה לפי שפת הקלט. נוסחה באנגלית כדי להישאר חד-משמעית בכל locale.
function languageDirective(locale: Locale): string {
    const name = LANGUAGE_NAMES[locale];
    return `You must answer in the selected interface language: ${name}. Do not switch languages based on the user's input. If the user writes in another language, still answer in ${name}. Keep technical labels only if they are fixed product terms.`;
}

export async function POST(req: Request) {
    const limited = rateLimit(req);
    if (limited) return limited;

    if (!hasApiKey()) {
        return NextResponse.json(
            { error: 'missing_api_key', message: 'הצ\'אט החי לא זמין (לא הוגדר ANTHROPIC_API_KEY).' },
            { status: 503 },
        );
    }

    let body: { text?: string; mode?: FlowMode; locale?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'bad_json' }, { status: 400 });
    }

    const text = (body.text ?? '').trim();
    const mode: FlowMode = body.mode === 'agent' ? 'agent' : 'chat';
    // שפת התשובה נגזרת מה-locale של הממשק (מקור האמת). locale לא תקין/חסר -> ברירת המחדל.
    const locale: Locale = isLocale(body.locale) ? body.locale : DEFAULT_LOCALE;
    if (!text) return NextResponse.json({ error: 'empty_text' }, { status: 400 });
    if (text.length > 400) return NextResponse.json({ error: 'text_too_long' }, { status: 400 });

    // ההנחיה הנפרדת על השפה נספחת לתפקיד, כך שהיא תמיד גוברת ונאכפת ברמת האפליקציה.
    const system = `${mode === 'agent' ? SYSTEM_AGENT : SYSTEM_CHAT}\n\n${languageDirective(locale)}`;

    const client = new Anthropic(); // קורא את ANTHROPIC_API_KEY מהסביבה
    const aborter = new AbortController();
    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            try {
                const llm = client.messages.stream(
                    {
                        model: MODEL,
                        max_tokens: 320,
                        system,
                        messages: [{ role: 'user', content: text }],
                    },
                    { signal: aborter.signal },
                );

                for await (const event of llm) {
                    if (
                        event.type === 'content_block_delta' &&
                        event.delta.type === 'text_delta' &&
                        event.delta.text
                    ) {
                        controller.enqueue(encoder.encode(event.delta.text));
                    }
                }
                controller.close();
            } catch (err) {
                // הלקוח מזהה stream שנקטע ונופל לתשובת ה-mock; כאן רק סוגרים בשגיאה.
                controller.error(err);
            }
        },
        cancel() {
            aborter.abort();
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-store',
            'X-Accel-Buffering': 'no',
        },
    });
}
