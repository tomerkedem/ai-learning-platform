// נתוני "מעבדת ההסתברויות" (Probability Engine Lab) - פרק 3.
// נתון דקלרטיבי טהור: אין כאן מודל אמיתי, קריאת API או חישוב הסתברות חי.
// אותו עולם תוכן (חבילה), שלושה ניסוחים שמייצרים התפלגויות שונות לחלוטין.
//
// הרעיון המרכזי: המנוע לא "יודע" מה המשתמש מתכוון. הוא מדרג כמה פירושים
// אפשריים, ובודק כמה ברור המוביל. פער גדול -> אפשר לענות. פער קטן -> לבקש הבהרה.

import type { ProbabilityScenario } from '@/components/ai-internals/types';

export const PROBABILITY_SCENARIOS: ProbabilityScenario[] = [
    {
        id: 'clear-delivery-failure',
        prompt: 'החבילה לא הגיעה',
        labelHe: 'ניסוח ברור',
        labelEn: 'Clear prompt',
        candidates: [
            {
                id: 'not-delivered',
                labelHe: 'אי מסירה',
                labelEn: 'Package not delivered',
                probability: 88,
                reason: 'הביטוי "לא הגיעה" מצביע ישירות על כשל במסירה.',
            },
            {
                id: 'tracking',
                labelHe: 'שאלת מעקב',
                labelEn: 'Tracking question',
                probability: 7,
                reason: 'ייתכן שהמשתמש רק רוצה לדעת איפה החבילה, אך זה פחות סביר.',
            },
            {
                id: 'system',
                labelHe: 'תקלה במערכת',
                labelEn: 'System issue',
                probability: 3,
                reason: 'אין רמז לבעיה טכנית בתצוגה או במערכת.',
            },
            {
                id: 'other',
                labelHe: 'אחר',
                labelEn: 'Other',
                probability: 2,
                reason: 'שארית קטנה לפירושים נדירים שלא נשקלו במפורש.',
            },
        ],
        distributionShape: 'sharp',
        topProbability: 88,
        secondProbability: 7,
        margin: 81,
        confidence: 'high',
        decisionKind: 'answer',
        decisionHe: 'לענות בזהירות',
        decisionEn: 'Answer carefully (still an estimate)',
        decisionExplanation:
            'האפשרות הראשונה גבוהה בהרבה מהשנייה. יש כוונה מובילה ברורה, ולכן המנוע יכול לענות בזהירות יחסית. עדיין חשוב לזכור: זו הערכה, לא הוכחה.',
        signals: [
            {
                signal: 'לא הגיעה',
                effect: 'מעלה חזק את ההסתברות ל"אי מסירה" – ניסוח חד וברור.',
                strength: 'high',
            },
            {
                signal: 'החבילה',
                effect: 'ממקד את הנושא בחבילה ספציפית, לא בבעיה כללית.',
                strength: 'medium',
            },
        ],
        accent: 'emerald',
    },
    {
        id: 'ambiguous-visibility',
        prompt: 'החבילה לא מופיעה',
        labelHe: 'ניסוח עמום',
        labelEn: 'Ambiguous prompt',
        candidates: [
            {
                id: 'system',
                labelHe: 'תקלה במערכת',
                labelEn: 'System issue',
                probability: 48,
                reason: '"לא מופיעה" יכול להצביע על בעיה בתצוגה או במערכת המעקב.',
            },
            {
                id: 'not-delivered',
                labelHe: 'אי מסירה',
                labelEn: 'Package not delivered',
                probability: 43,
                reason: 'אותו ניסוח יכול לתאר גם חבילה שפשוט לא הגיעה.',
            },
            {
                id: 'tracking',
                labelHe: 'שאלת מעקב',
                labelEn: 'Tracking question',
                probability: 6,
                reason: 'ייתכן שזו שאלה על מצב המעקב, אך זה פחות סביר.',
            },
            {
                id: 'other',
                labelHe: 'אחר',
                labelEn: 'Other',
                probability: 3,
                reason: 'שארית קטנה לפירושים נדירים.',
            },
        ],
        distributionShape: 'close',
        topProbability: 48,
        secondProbability: 43,
        margin: 5,
        confidence: 'low',
        decisionKind: 'context',
        decisionHe: 'לבקש עוד הקשר',
        decisionEn: 'Ask for more context',
        decisionExplanation:
            'שתי האפשרויות הראשונות קרובות מדי. הפער ביניהן קטן, ולכן תשובה בטוחה תהיה מסוכנת. המנוע לא אמור להעמיד פנים שהוא בטוח, אלא לשאול למה המשתמש מתכוון.',
        signals: [
            {
                signal: 'לא מופיעה',
                effect: 'יכול להתפרש גם כבעיה במערכת וגם כבעיה במסירה – מפצל את ההסתברות.',
                strength: 'high',
            },
            {
                signal: 'מופיעה',
                effect: 'מילה שקשורה לתצוגה, ולכן מושכת הסתברות גם לכיוון תקלה טכנית.',
                strength: 'medium',
            },
        ],
        accent: 'amber',
    },
    {
        id: 'broad-package-problem',
        prompt: 'יש בעיה עם החבילה',
        labelHe: 'ניסוח כללי',
        labelEn: 'Broad prompt',
        candidates: [
            {
                id: 'delivery',
                labelHe: 'בעיית מסירה',
                labelEn: 'Delivery issue',
                probability: 38,
                reason: 'בעיה עם חבילה מתפרשת לעיתים קרובות ככשל במסירה.',
            },
            {
                id: 'system',
                labelHe: 'תקלה במערכת',
                labelEn: 'System issue',
                probability: 31,
                reason: '"בעיה" יכולה להיות גם תקלה טכנית במערכת.',
            },
            {
                id: 'tracking',
                labelHe: 'שאלת מעקב',
                labelEn: 'Tracking question',
                probability: 21,
                reason: 'ייתכן שהמשתמש רק רוצה הבהרה על מצב המעקב.',
            },
            {
                id: 'other',
                labelHe: 'אחר',
                labelEn: 'Other',
                probability: 10,
                reason: 'הניסוח כללי כל כך שנשארת שארית גדולה יחסית לפירושים אחרים.',
            },
        ],
        distributionShape: 'flat',
        topProbability: 38,
        secondProbability: 31,
        margin: 7,
        confidence: 'low',
        decisionKind: 'clarify',
        decisionHe: 'לשאול שאלת הבהרה',
        decisionEn: 'Ask a clarifying question',
        decisionExplanation:
            'הפרומט כללי מדי וההסתברות מתפזרת בין כמה פירושים סבירים. אין מוביל אמיתי, ולכן המנוע צריך לבקש הקשר לפני שהוא עונה. לפעמים התשובה המקצועית ביותר היא לא לענות מיד.',
        signals: [
            {
                signal: 'בעיה',
                effect: 'מילה כללית שמפזרת את ההסתברות בין כמה אפשרויות.',
                strength: 'high',
            },
            {
                signal: 'יש',
                effect: 'פתיחה מעורפלת שלא מצביעה על סוג הבעיה.',
                strength: 'medium',
            },
        ],
        accent: 'purple',
    },
];
