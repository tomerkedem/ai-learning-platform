// מנוע כלי האימון של פרק 16: "איך לעבוד נכון עם מודל ו-Agent".
// קובץ טהור: אין כאן React, אין LLM, אין רשת, אין פעולה אמיתית. אלה כלי
// אימון לימודיים. המנוע צורך את ה-task parser של פרק 10 כדי לזהות משימה,
// מטרה, מידע חסר וסיכון, ובונה מעליו הערכת איכות בקשה והמלצת מצב.
//
// זה לא פרק על "לרמות" את המודל. זה שיתוף פעולה מקצועי. נוסחת העבודה:
//   good_request = clear_goal + relevant_context + required_data
//                 + output_expectation + safety_boundaries

import { parse } from '@/app/behind-the-scenes-ai/chapter-10/taskData';
import type { TaskAnalysis } from '@/app/behind-the-scenes-ai/chapter-10/taskEngine';

export type { TaskAnalysis };

/* ─────────────────────────────── טיפוסים ────────────────────────────────── */

export type DimKey = 'goal' | 'data' | 'context' | 'risk' | 'output';
export type DimLevel = 'high' | 'medium' | 'low' | 'missing' | 'na';
export type DimTone = 'ok' | 'warn' | 'bad';
export type RecommendedMode = 'chat' | 'agent' | 'agent-approval';

export interface DimEval {
    key: DimKey;
    he: string;
    en: string;
    level: DimLevel;
    tone: DimTone;
    note: string;
}

/* ─────────────────────── אותות מילוליים לזיהוי איכות ────────────────────── */

const has = (text: string, words: string[]) => words.some((w) => text.includes(w));

const CONTEXT_SIGNALS = ['מערכת', 'מעקב', 'סטטוס', 'מרכז', 'מיון', 'מסיר', 'עיכוב', 'תצוג', 'חביל', 'משלוח', 'הזמנ', 'לקוח'];
const BOUNDARY_SIGNALS = ['אישור', 'טיוט', 'אל תשלח', 'בלי אישור', 'אל תנחש', 'בדוק קודם', 'בדוק תחיל', 'הוכח', 'אימות', 'זהיר'];
const OUTPUT_SIGNALS = ['הצג', 'רשימ', 'סיב', 'פורמט', 'טבל', 'שאלה מבהיר', 'מה חסר', 'סכם', 'שתי '];
const EXPLAIN_SIGNALS = ['הסבר', 'מה זה', 'מהו', 'מהי'];

/* ─────────────────────── הערכת חמשת הממדים ──────────────────────────────── */

function evalGoal(p: TaskAnalysis, text: string): DimEval {
    let level: DimLevel;
    let note: string;
    if (p.requestType === 'question' && has(text, EXPLAIN_SIGNALS)) { level = 'high'; note = 'בקשת הסבר ברורה על נושא מוגדר.'; }
    else if (p.vagueReference) { level = 'low'; note = 'היעד עמום, לא ברור למה הבקשה מתייחסת.'; }
    else if (p.requestType === 'task' && p.goalClear) { level = 'high'; note = `המטרה ברורה: ${p.goalHe || 'משימה מוגדרת'}.`; }
    else if (p.requestType === 'question') { level = 'medium'; note = 'יש נושא, אבל לא ברור מה בדיוק מבקשים שיקרה.'; }
    else { level = 'medium'; note = 'המטרה חלקית.'; }
    return { key: 'goal', he: 'בהירות מטרה', en: 'Goal clarity', level, tone: level === 'high' ? 'ok' : 'warn', note };
}

function evalData(p: TaskAnalysis): DimEval {
    let level: DimLevel;
    let note: string;
    if (p.requestType === 'question') { level = 'na'; note = 'שאלה כללית אינה דורשת מידע מזהה.'; }
    else if (p.requiredData.length === 0) { level = 'na'; note = 'לבקשה לא נדרש מידע מזהה נוסף.'; }
    else if (p.missingData.length > 0) { level = 'missing'; note = `חסר ${p.missingData.map((d) => d.he).join(', ')}.`; }
    else { level = 'high'; note = 'המידע המזהה קיים.'; }
    return { key: 'data', he: 'מידע מזהה', en: 'Required data', level, tone: level === 'missing' ? 'warn' : 'ok', note };
}

function evalContext(text: string): DimEval {
    const n = CONTEXT_SIGNALS.filter((s) => text.includes(s)).length;
    const level: DimLevel = n >= 2 ? 'high' : n === 1 ? 'medium' : 'low';
    const note = n >= 2 ? 'יש הקשר טוב: ברור על איזו מערכת או מצב מדובר.' : n === 1 ? 'יש רמז להקשר, אפשר להוסיף עוד.' : 'חסר הקשר: על איזו מערכת או מקור מדובר.';
    return { key: 'context', he: 'הקשר', en: 'Context', level, tone: level === 'high' ? 'ok' : 'warn', note };
}

function evalRisk(p: TaskAnalysis, text: string): DimEval {
    const bounded = has(text, BOUNDARY_SIGNALS);
    if (bounded) return { key: 'risk', he: 'גבולות סיכון', en: 'Risk boundaries', level: 'high', tone: 'ok', note: 'הבקשה מגדירה גבולות פעולה (אישור, טיוטה, או "אל תנחש").' };
    if (p.risk === 'high') return { key: 'risk', he: 'גבולות סיכון', en: 'Risk boundaries', level: 'missing', tone: 'bad', note: 'פעולה רגישה בלי גבולות. כדאי לדרוש אישור או טיוטה לפני שליחה.' };
    return { key: 'risk', he: 'גבולות סיכון', en: 'Risk boundaries', level: 'low', tone: 'warn', note: 'לא הוגדרו גבולות, אבל הסיכון כאן נמוך.' };
}

function evalOutput(text: string): DimEval {
    const specified = has(text, OUTPUT_SIGNALS);
    const level: DimLevel = specified ? 'high' : 'low';
    return { key: 'output', he: 'פורמט פלט', en: 'Output format', level, tone: specified ? 'ok' : 'warn', note: specified ? 'הוגדר מה להציג ואיך.' : 'לא הוגדר פורמט פלט. אפשר לבקש מה להציג, למשל "הצג מה חסר" או "שתי סיבות אפשריות".' };
}

/* ─────────────────────── תוצאת איכות הבקשה ──────────────────────────────── */

export interface QualityResult {
    dims: DimEval[];
    goodCount: number;
    scorePct: number;
    levelHe: string;
    levelEn: string;
}

export interface CoachResult {
    text: string;
    parse: TaskAnalysis;
    quality: QualityResult;
    recommendation: { mode: RecommendedMode; reasonHe: string; reasonEn: string };
    /** הצעה כללית שנבנית מהממדים החסרים (אם אין שיפור נעול לתרחיש). */
    composedSuggestionHe: string;
    /** האם הבקשה רגישה (סיכון גבוה בלי גבולות). */
    sensitive: boolean;
}

/** מעריך בקשה דרך כל הממדים. מקור האמת היחיד למסך. */
export function coach(text: string): CoachResult {
    const p = parse(text); // פרק 10
    const dims = [evalGoal(p, text), evalData(p), evalContext(text), evalRisk(p, text), evalOutput(text)];
    const goodCount = dims.filter((d) => d.level === 'high' || d.level === 'na').length;
    const scorePct = Math.round((goodCount / dims.length) * 100);
    const levelHe = goodCount >= 4 ? 'חזק' : goodCount >= 2 ? 'בינוני' : 'חלש';
    const levelEn = goodCount >= 4 ? 'Strong' : goodCount >= 2 ? 'Medium' : 'Weak';
    const sensitive = dims.find((d) => d.key === 'risk')?.tone === 'bad';

    return {
        text,
        parse: p,
        quality: { dims, goodCount, scorePct, levelHe, levelEn },
        recommendation: recommendMode(p),
        composedSuggestionHe: composeSuggestion(text, dims, sensitive),
        sensitive,
    };
}

/* ─────────────────────── Chat or Agent Selector ─────────────────────────── */

function recommendMode(p: TaskAnalysis): { mode: RecommendedMode; reasonHe: string; reasonEn: string } {
    if (p.requestType === 'question') {
        return { mode: 'chat', reasonHe: 'זו בקשת הסבר כללית. אין צורך בכלי או בפעולה, צ׳אט מספיק.', reasonEn: 'General explanation request' };
    }
    if (p.risk === 'high') {
        return { mode: 'agent-approval', reasonHe: 'זו פעולה חיצונית עם השפעה על לקוח. מתאים ל-Agent, אבל עם אישור אנושי.', reasonEn: 'External action with customer impact' };
    }
    return { mode: 'agent', reasonHe: 'זו משימה שדורשת בדיקה, מידע חיצוני או כלי. מתאימה ל-Agent.', reasonEn: 'Requires external data and tool access' };
}

export function recommendModeForText(text: string) {
    return recommendMode(parse(text));
}

/* ─────────────────────── בניית הצעת שיפור ───────────────────────────────── */

/** בונה הצעת שיפור כללית מהממדים החסרים (כשאין שיפור נעול לתרחיש). */
export function composeSuggestion(text: string, dims: DimEval[], sensitive: boolean): string {
    const adds: string[] = [];
    const get = (k: DimKey) => dims.find((d) => d.key === k);
    if (sensitive) {
        adds.push('בדקו תחילה אם יש הוכחה');
        adds.push('הכינו טיוטה זהירה ואל תשלחו בלי אישור');
    } else {
        if (get('data')?.level === 'missing') adds.push('הוסיפו את המזהה (למשל מספר ברקוד)');
        if (get('context')?.level === 'low') adds.push('ציינו על איזו מערכת או מקור מדובר');
        if (get('output')?.level === 'low') adds.push('בקשו מה להציג, ואם חסר מידע, שיציג מה חסר ולא ינחש');
    }
    if (adds.length === 0) return text;
    const base = text.replace(/[.\s]+$/, '');
    return `${base}. ${adds.join(', ')}.`;
}
