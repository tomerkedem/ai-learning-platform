// app/behind-the-scenes-ai/chapter-1/engineTrace.ts
//
// פירוק "המנוע השקוף" ל-15 תהליכים מוצגים, מקובצים ל-4 מערכות (acts).
// כל שלב הוא חשיפה כנה של מה שהמנוע כבר עושה: הערכים הסופיים (הסתברויות, ביטחון,
// החלטה) מגיעים ישירות מ-runChatEngine/runAgentEngine, והשלבים הביניים (טוקנים,
// התאמות מילות-מפתח, ספירות, דגלים) מחושבים עם אותם קבועים/עוזרים בדיוק שמייצא
// המנוע. אין כאן מספר חדש, אין שכפול נוסחה - רק שיקוף של הצינור הקיים.

import type { DecisionState, IntentProbability } from '@/components/ai-internals/types';

import {
    runChatEngine,
    runAgentEngine,
    CHAT_RULES,
    ACTION_WORDS,
    SENSITIVE_WORDS,
    DELIVERY_WORDS,
    matchedWords,
    countHits,
    hasBarcode,
    NEGATION_TOKEN,
    type Confidence,
} from './mockEngine';

export interface TraceBase {
    id: string;
    /** מערכה (קיבוץ-על) להצגת overview-first. */
    act: string;
    actEn: string;
    title: string;
    titleEn: string;
    /** כיתוב כן וקצר לשלב. */
    note: string;
}

export type EngineTraceStep =
    | (TraceBase & { kind: 'raw'; value: string })
    | (TraceBase & { kind: 'normalize'; original: string; normalized: string; changed: boolean })
    | (TraceBase & { kind: 'tokens'; tokens: string[] })
    | (TraceBase & { kind: 'count'; value: number; unit: string })
    | (TraceBase & { kind: 'keywords'; groups: { label: string; matched: string[]; total: number }[] })
    | (TraceBase & { kind: 'flag'; on: boolean; onLabel: string; offLabel: string; detail?: string; triggerToken?: string })
    | (TraceBase & { kind: 'candidates'; items: { label: string; hits: number }[] })
    | (TraceBase & { kind: 'probabilities'; items: IntentProbability[] })
    | (TraceBase & { kind: 'winner'; label: string; value: number })
    | (TraceBase & { kind: 'gap'; top: number; second: number; margin: number })
    | (TraceBase & { kind: 'confidence'; level: Confidence })
    | (TraceBase & { kind: 'decision'; decision: DecisionState })
    | (TraceBase & { kind: 'reply'; text: string });

const ACT = {
    intake: { he: 'קליטה', en: 'Intake' },
    analyze: { he: 'ניתוח', en: 'Analysis' },
    decide: { he: 'הכרעה', en: 'Decision' },
    output: { he: 'פלט', en: 'Output' },
    task: { he: 'זיהוי משימה', en: 'Task detection' },
    risk: { he: 'אחריות וסיכון', en: 'Risk & responsibility' },
    act: { he: 'הכרעה ופלט', en: 'Decision & output' },
};

/* ════════════════════════ Chat: 15 שלבים ═════════════════════════════════ */

export function traceChatEngine(text: string): EngineTraceStep[] {
    const r = runChatEngine(text);
    const tokens = r.tokens;
    const hasNeg = text.includes(NEGATION_TOKEN);

    const groups = CHAT_RULES.map((rule) => ({
        label: rule.label,
        matched: matchedWords(text, rule.words),
        total: rule.words.length,
    }));
    const candidates = [
        ...CHAT_RULES.map((rule) => ({ label: rule.label, hits: countHits(text, rule.words) })),
        { label: 'Other', hits: 0 },
    ];
    const top = r.intents[0];
    const second = r.intents[1];
    const margin = Math.max(0, (top?.value ?? 0) - (second?.value ?? 0));

    return [
        { id: 'c1', act: ACT.intake.he, actEn: ACT.intake.en, title: 'קלט גולמי', titleEn: 'Raw input', note: 'הטקסט שכתבתם, בדיוק כפי שהגיע.', kind: 'raw', value: text || '-' },
        { id: 'c2', act: ACT.intake.he, actEn: ACT.intake.en, title: 'ניקוי וניקוד', titleEn: 'Normalize', note: 'רווחים מיותרים נחתכים, הטקסט מיושר לעיבוד.', kind: 'normalize', original: text, normalized: tokens.join(' '), changed: text !== tokens.join(' ') },
        { id: 'c3', act: ACT.intake.he, actEn: ACT.intake.en, title: 'טוקניזציה', titleEn: 'Tokenize', note: 'פיצול ליחידות. הפשטה לימודית: לפי מילים, לא טוקנייזר אמיתי.', kind: 'tokens', tokens },
        { id: 'c4', act: ACT.intake.he, actEn: ACT.intake.en, title: 'אורך הקלט', titleEn: 'Token count', note: 'כמה יחידות יש לעבד. אות ראשון לגודל הבקשה.', kind: 'count', value: tokens.length, unit: 'טוקנים' },

        { id: 'c5', act: ACT.analyze.he, actEn: ACT.analyze.en, title: 'סריקת מילות-מפתח', titleEn: 'Keyword scan', note: 'אילו מילים מהקלט מפעילות איזו כוונה. אלה הרמזים שמזיזים את הדירוג.', kind: 'keywords', groups },
        { id: 'c6', act: ACT.analyze.he, actEn: ACT.analyze.en, title: 'זיהוי שלילה', titleEn: 'Negation', note: 'המילה "לא" הופכת בעיה לתלונה, ומחזקת את כוונת אי-המסירה.', kind: 'flag', on: hasNeg, onLabel: 'נמצאה שלילה', offLabel: 'אין שלילה', detail: hasNeg ? 'מחזק את "Package not delivered"' : undefined, triggerToken: NEGATION_TOKEN },
        { id: 'c7', act: ACT.analyze.he, actEn: ACT.analyze.en, title: 'מועמדות מתחרות', titleEn: 'Candidate intents', note: 'כל הכוונות האפשריות עולות לזירה, עם מספר ההתאמות לכל אחת.', kind: 'candidates', items: candidates },

        { id: 'c8', act: ACT.decide.he, actEn: ACT.decide.en, title: 'התפלגות הסתברות', titleEn: 'Probabilities', note: 'ההתאמות הופכות להסתברויות שמסתכמות ל-100%. הגבוהה מובילה.', kind: 'probabilities', items: r.intents },
        { id: 'c9', act: ACT.decide.he, actEn: ACT.decide.en, title: 'בחירת המוביל', titleEn: 'Top selection', note: 'הכוונה עם ההסתברות הגבוהה ביותר נבחרת כמובילה.', kind: 'winner', label: top?.label ?? '-', value: top?.value ?? 0 },
        { id: 'c10', act: ACT.decide.he, actEn: ACT.decide.en, title: 'הפער', titleEn: 'Margin', note: 'הפער בין הראשונה לשנייה. לא רק מי מוביל, אלא בכמה.', kind: 'gap', top: top?.value ?? 0, second: second?.value ?? 0, margin },
        { id: 'c11', act: ACT.decide.he, actEn: ACT.decide.en, title: 'רמת ביטחון', titleEn: 'Confidence', note: 'הפער מתורגם לרמת ביטחון: גבוה, בינוני או נמוך.', kind: 'confidence', level: r.confidence },
        { id: 'c12', act: ACT.decide.he, actEn: ACT.decide.en, title: 'תחום משמעות', titleEn: 'Meaning', note: 'הכוונה המובילה ממופה לתחום המשמעות שינחה את התשובה.', kind: 'raw', value: r.meaning },

        { id: 'c13', act: ACT.output.he, actEn: ACT.output.en, title: 'ההחלטה', titleEn: 'Decision', note: 'לענות כשהביטחון מספיק, אחרת לעצור ולבקש הבהרה.', kind: 'decision', decision: r.decision },
        { id: 'c14', act: ACT.output.he, actEn: ACT.output.en, title: 'מצב הפלט', titleEn: 'Output state', note: 'מה המנוע עומד להחזיר בפועל בעקבות ההחלטה.', kind: 'raw', value: r.output },
        { id: 'c15', act: ACT.output.he, actEn: ACT.output.en, title: 'התשובה', titleEn: 'Reply', note: 'הניסוח הסופי שיוצג למשתמש.', kind: 'reply', text: r.reply },
    ];
}

/* ════════════════════════ Agent: 15 שלבים ════════════════════════════════ */

export function traceAgentEngine(text: string): EngineTraceStep[] {
    const r = runAgentEngine(text);
    const tokens = r.tokens;
    const actionMatched = matchedWords(text, ACTION_WORDS);
    const deliveryMatched = matchedWords(text, DELIVERY_WORDS);
    const sensitiveMatched = matchedWords(text, SENSITIVE_WORDS);
    const barcode = hasBarcode(text);
    const barcodeToken = text.match(/\d{6,}/)?.[0];

    return [
        { id: 'a1', act: ACT.intake.he, actEn: ACT.intake.en, title: 'קלט גולמי', titleEn: 'Raw input', note: 'הבקשה שכתבתם, נקודת הכניסה למנוע הפעולה.', kind: 'raw', value: text || '-' },
        { id: 'a2', act: ACT.intake.he, actEn: ACT.intake.en, title: 'ניקוי וניקוד', titleEn: 'Normalize', note: 'רווחים מיותרים נחתכים, הטקסט מיושר לעיבוד.', kind: 'normalize', original: text, normalized: tokens.join(' '), changed: text !== tokens.join(' ') },
        { id: 'a3', act: ACT.intake.he, actEn: ACT.intake.en, title: 'טוקניזציה', titleEn: 'Tokenize', note: 'פיצול ליחידות. הפשטה לימודית: לפי מילים, לא טוקנייזר אמיתי.', kind: 'tokens', tokens },
        { id: 'a4', act: ACT.intake.he, actEn: ACT.intake.en, title: 'אורך הקלט', titleEn: 'Token count', note: 'כמה יחידות יש לעבד.', kind: 'count', value: tokens.length, unit: 'טוקנים' },

        { id: 'a5', act: ACT.task.he, actEn: ACT.task.en, title: 'סריקת מילות-פעולה', titleEn: 'Action words', note: 'מילים כמו "בדוק" או "שלח" מסמנות שזו משימה, לא שאלה.', kind: 'keywords', groups: [{ label: 'מילות פעולה', matched: actionMatched, total: ACTION_WORDS.length }] },
        { id: 'a6', act: ACT.task.he, actEn: ACT.task.en, title: 'זיהוי תחום', titleEn: 'Domain scan', note: 'האם הבקשה נוגעת למשלוח/חבילה, התחום שהמנוע יודע לטפל בו.', kind: 'keywords', groups: [{ label: 'תחום משלוח', matched: deliveryMatched, total: DELIVERY_WORDS.length }] },
        { id: 'a7', act: ACT.task.he, actEn: ACT.task.en, title: 'איתור מזהה', titleEn: 'Identifier', note: 'רצף ספרות ארוך = ברקוד. בלעדיו אי אפשר לפעול בפועל.', kind: 'flag', on: barcode, onLabel: 'נמצא ברקוד', offLabel: 'אין מזהה', detail: barcode ? 'אפשר לקרוא ל-Tracking API' : 'יחסר מידע לביצוע', triggerToken: barcodeToken },
        { id: 'a8', act: ACT.task.he, actEn: ACT.task.en, title: 'המשימה שזוהתה', titleEn: 'Task detected', note: 'מכל הרמזים, המנוע מסכם מהי המשימה שעל הפרק.', kind: 'raw', value: r.task },

        { id: 'a9', act: ACT.risk.he, actEn: ACT.risk.en, title: 'מידע חסר', titleEn: 'Missing info', note: 'מה צריך כדי לבצע, ועדיין לא נמצא בבקשה.', kind: 'raw', value: r.missingInfo },
        { id: 'a10', act: ACT.risk.he, actEn: ACT.risk.en, title: 'צורך בכלי', titleEn: 'Tool need', note: 'האם נדרש מקור חיצוני (כמו מערכת מעקב) כדי להשלים.', kind: 'flag', on: r.toolNeed.needed, onLabel: `נדרש כלי: ${r.toolNeed.tool}`, offLabel: 'ללא כלי חיצוני' },
        { id: 'a11', act: ACT.risk.he, actEn: ACT.risk.en, title: 'סריקת רגישות', titleEn: 'Sensitivity', note: 'פעולות כמו "שלח" או "עדכן" משפיעות על לקוח ומחייבות זהירות.', kind: 'keywords', groups: [{ label: 'פעולה רגישה', matched: sensitiveMatched, total: SENSITIVE_WORDS.length }] },
        { id: 'a12', act: ACT.risk.he, actEn: ACT.risk.en, title: 'כשירות לפעולה', titleEn: 'Action readiness', note: 'בהינתן המידע והסיכון: האם מותר ואפשר לפעול עכשיו.', kind: 'flag', on: r.canActNow, onLabel: 'אפשר לפעול עכשיו', offLabel: 'לא לפעול עדיין', detail: `סיכון: ${r.risk}` },

        { id: 'a13', act: ACT.act.he, actEn: ACT.act.en, title: 'ההחלטה', titleEn: 'Decision', note: 'הצעד הנכון הבא: לענות, להשתמש בכלי, לבקש מידע, או לעצור.', kind: 'decision', decision: r.decision },
        { id: 'a14', act: ACT.act.he, actEn: ACT.act.en, title: 'מצב הפלט', titleEn: 'Output state', note: 'מה יקרה בפועל בעקבות ההחלטה.', kind: 'raw', value: r.output },
        { id: 'a15', act: ACT.act.he, actEn: ACT.act.en, title: 'התשובה', titleEn: 'Reply', note: 'הניסוח הסופי שיוצג למשתמש.', kind: 'reply', text: r.reply },
    ];
}
