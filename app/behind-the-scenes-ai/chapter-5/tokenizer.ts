// הטוקנייזר הלימודי הדטרמיניסטי - פרק 5.
// אין כאן LLM, tokenizer מסחרי, קריאת API או רשת. הפלט זהה בכל הרצה.
//
// המנוע מבצע: (1) פיצול לפי רווחים, (2) קילוף פיסוק לטוקנים נפרדים,
// (3) שיוך תפקיד מתוך WORD_ROLES, (4) ספירה. המקף אינו מפצל, ולכן הוא
// מדגים איך הצורה משנה את הפירוק ("לא-הגיעה" הופך ליחידה אחת).

import { roleForWord, type TokenRole } from './tokenRoles';

export type TokenizationMode = 'chat' | 'agent';

export interface Token {
    /** מפתח יציב לרינדור ולאנימציה. */
    id: string;
    text: string;
    role: TokenRole;
    /** האם זהו טוקן פיסוק (signal). */
    isPunct: boolean;
}

const PUNCT = new Set(['?', '.', '!', ',']);

function punctRole(p: string): TokenRole {
    if (p === '?') return 'question-signal';
    return 'statement-signal';
}

/**
 * tokenize(text) = [token1, token2, token3, ...]
 * פיצול לפי רווחים, קילוף פיסוק נגרר לטוקנים נפרדים, ושיוך תפקיד לכל טוקן.
 */
export function tokenize(text: string): Token[] {
    const out: { text: string; role: TokenRole; isPunct: boolean }[] = [];
    const raw = text.trim().split(/\s+/).filter(Boolean);

    raw.forEach((word) => {
        let core = word;
        const trailing: string[] = [];
        // קילוף פיסוק מהסוף (סדר נשמר)
        while (core.length > 0 && PUNCT.has(core[core.length - 1])) {
            trailing.unshift(core[core.length - 1]);
            core = core.slice(0, -1);
        }
        if (core.length > 0) {
            out.push({ text: core, role: roleForWord(core), isPunct: false });
        }
        trailing.forEach((p) => {
            out.push({ text: p, role: punctRole(p), isPunct: true });
        });
    });

    return out.map((t, i) => ({ ...t, id: `${i}-${t.text}` }));
}

/** האם הקלט מכיל את צירוף ההקשר "מרכז המיון" (Sorting center). */
export function hasSortingCenter(tokens: Token[]): boolean {
    const texts = tokens.map((t) => t.text);
    const i = texts.findIndex((t) => t === 'מרכז' || t === 'למרכז' || t === 'במרכז');
    return i >= 0 && texts.slice(i + 1).includes('המיון');
}

/** האם יש צירוף "לא" ואז "הגיעה" (Delivery failure signal). */
export function hasDeliveryFailure(tokens: Token[]): boolean {
    const texts = tokens.map((t) => t.text);
    const i = texts.indexOf('לא');
    return i >= 0 && texts.slice(i + 1).includes('הגיעה');
}

/** האם יש אות פעולה (Action signal) בקלט. */
export function hasActionSignal(tokens: Token[]): boolean {
    return tokens.some((t) => t.role === 'action-signal');
}

export interface TokenExample {
    labelHe: string;
    labelEn: string;
    text: string;
}

export interface TokenScenario {
    id: string;
    mode: TokenizationMode;
    labelHe: string;
    labelEn: string;
    prompt: string;
    accent: 'purple' | 'emerald' | 'amber' | 'cyan' | 'indigo';
    /** תווית המסלול: לאן הפירוק מזין. */
    routeHe: string;
    routeEn: string;
    examples: TokenExample[];
}

export const TOKEN_SCENARIOS: TokenScenario[] = [
    {
        id: 'chat-delivery',
        mode: 'chat',
        labelHe: 'מצב צ׳אט',
        labelEn: 'Chat mode',
        prompt: 'החבילה לא הגיעה',
        accent: 'emerald',
        routeHe: 'בניית תשובה',
        routeEn: 'Build answer',
        examples: [
            { labelHe: 'בסיס', labelEn: 'Base', text: 'החבילה לא הגיעה' },
            { labelHe: 'עם הקשר', labelEn: 'With context', text: 'החבילה לא הגיעה למרכז המיון' },
            { labelHe: 'עם שאלה', labelEn: 'With question', text: 'החבילה לא הגיעה?' },
            { labelHe: 'עם נקודה', labelEn: 'With period', text: 'החבילה לא הגיעה.' },
            { labelHe: 'עם מקף', labelEn: 'With hyphen', text: 'החבילה לא-הגיעה' },
        ],
    },
    {
        id: 'agent-investigate',
        mode: 'agent',
        labelHe: 'מצב Agent',
        labelEn: 'Agent mode',
        prompt: 'בדוק למה החבילה לא הגיעה',
        accent: 'purple',
        routeHe: 'הבנת משימה',
        routeEn: 'Understand task',
        examples: [
            { labelHe: 'בקשת בדיקה', labelEn: 'Investigation', text: 'בדוק למה החבילה לא הגיעה' },
            { labelHe: 'בדיקה לנמען', labelEn: 'To recipient', text: 'בדוק למה החבילה לא הגיעה ללקוח' },
        ],
    },
];

export function getScenario(id: string): TokenScenario | undefined {
    return TOKEN_SCENARIOS.find((s) => s.id === id);
}

export function defaultScenarioFor(mode: TokenizationMode): TokenScenario {
    return TOKEN_SCENARIOS.find((s) => s.mode === mode) ?? TOKEN_SCENARIOS[0];
}

/** שלבי מפת הדרכים: רק הראשון פעיל, השאר נעולים כטיזר לפרקים הבאים. */
export const ROADMAP_STEPS: { he: string; en: string; active: boolean }[] = [
    { he: 'טקסט', en: 'Text', active: true },
    { he: 'טוקנים', en: 'Tokens', active: true },
    { he: 'מזהי טוקן', en: 'Token IDs', active: false },
    { he: 'וקטורים', en: 'Vectors', active: false },
    { he: 'דמיון', en: 'Similarity', active: false },
    { he: 'ציונים', en: 'Scores', active: false },
    { he: 'הסתברויות', en: 'Probabilities', active: false },
];
