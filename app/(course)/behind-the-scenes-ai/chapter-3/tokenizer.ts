// הטוקנייזר הלימודי הדטרמיניסטי - פרק 3.
// אין כאן LLM, tokenizer מסחרי, קריאת API או רשת. הפלט זהה בכל הרצה.
//
// המנוע מבצע: (1) פיצול לפי רווחים, (2) קילוף פיסוק לטוקנים נפרדים,
// (3) שיוך תפקיד מתוך WORD_ROLES, (4) ספירה. המקף אינו מפצל, ולכן הוא
// מדגים איך הצורה משנה את הפירוק ("לא-חזר" הופך ליחידה אחת).

import { roleForWord, type TokenRole, type RoleWordMap } from './tokenRoles';

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
const DIGITS = /^\d+$/;

function punctRole(p: string): TokenRole {
    if (p === '?') return 'question-signal';
    return 'statement-signal';
}

/** תפקיד לליבת הטוקן: רצף ספרות נחשב מספר, אחרת לפי טבלת התפקידים (locale-aware). */
function coreRole(core: string, roleWords: RoleWordMap): TokenRole {
    return DIGITS.test(core) ? 'number' : roleForWord(core, roleWords);
}

/**
 * tokenize(text) = [token1, token2, token3, ...]
 * פיצול לפי רווחים, קילוף פיסוק נגרר לטוקנים נפרדים, ושיוך תפקיד לכל טוקן.
 * מפת התפקידים אופציונלית כדי לאפשר זיהוי לפי שפה; ללא ארגומנט נשמרת התנהגות
 * העברית הקיימת.
 */
export function tokenize(text: string, roleWords: RoleWordMap): Token[] {
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
            out.push({ text: core, role: coreRole(core, roleWords), isPunct: false });
        }
        trailing.forEach((p) => {
            out.push({ text: p, role: punctRole(p), isPunct: true });
        });
    });

    return out.map((t, i) => ({ ...t, id: `${i}-${t.text}` }));
}

/**
 * הגדרת צירוף "מילה מובילה ואז מילת המשך" (למשל "מרכז" ואז "המיון").
 * ניתנת להחלפה לפי שפה; ברירת המחדל היא עברית.
 */
export interface PhraseAfterSignal {
    /** מילים מובילות אפשריות (כל אחת תקפה). */
    leads: string[];
    /** מילת ההמשך שצריכה להופיע אחרי המילה המובילה. */
    follow: string;
}

/** הגדרת צירוף של שתי מילים בסדר (למשל "לא" ואז "הגיעה"). */
export interface PairSignal {
    first: string;
    second: string;
}


/** האם הקלט מכיל את צירוף ההקשר (כוס קפה). ברירת מחדל עברית. */
export function hasSortingCenter(tokens: Token[], cfg: PhraseAfterSignal): boolean {
    const texts = tokens.map((t) => t.text);
    const i = texts.findIndex((t) => cfg.leads.includes(t));
    return i >= 0 && texts.slice(i + 1).includes(cfg.follow);
}

/** האם יש צירוף שלילה ופעולה (Negation + action signal). ברירת מחדל עברית. */
export function hasDeliveryFailure(tokens: Token[], cfg: PairSignal): boolean {
    const texts = tokens.map((t) => t.text);
    const i = texts.indexOf(cfg.first);
    return i >= 0 && texts.slice(i + 1).includes(cfg.second);
}

/** האם יש אות פעולה (Action signal) בקלט. */
export function hasActionSignal(tokens: Token[]): boolean {
    return tokens.some((t) => t.role === 'action-signal');
}

/** האם יש טוקן מספר (Number) בקלט, למשל כמות במתכון. */
export function hasNumber(tokens: Token[]): boolean {
    return tokens.some((t) => t.role === 'number');
}

/**
 * האם הקלט נראה כמו רצף בלי רווחים: יחידה אחת ארוכה.
 * הטוקנייזר הלימודי מפצל לפי רווחים, ולכן טקסט בלי רווחים נראה לו כיחידה אחת.
 * טוקנייזר אמיתי עדיין יפרק אותו לתת-מילים. משמש להמחשה לימודית בלבד.
 */
export function looksLikeNoSpaceClump(tokens: Token[]): boolean {
    const words = tokens.filter((t) => !t.isPunct);
    return words.length === 1 && words[0].text.length >= 8;
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


/** איתור תרחיש לפי מזהה. מקבל רשימת תרחישים אופציונלית (locale-aware). */
export function getScenario(id: string, scenarios: TokenScenario[]): TokenScenario | undefined {
    return scenarios.find((s) => s.id === id);
}

/** ברירת המחדל של תרחיש לפי מצב. מקבל רשימת תרחישים אופציונלית (locale-aware). */
export function defaultScenarioFor(mode: TokenizationMode, scenarios: TokenScenario[]): TokenScenario {
    return scenarios.find((s) => s.mode === mode) ?? scenarios[0];
}

/** שלב במפת הדרכים. he היא התווית הראשית, en התווית המשנית. */
export interface RoadmapStep {
    he: string;
    en: string;
    active: boolean;
}
