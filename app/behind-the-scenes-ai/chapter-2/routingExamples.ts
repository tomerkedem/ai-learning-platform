// נתוני שלושת הניסוחים של "מעבדת ניתוב בקשות" (Request Routing Lab).
// נתון דקלרטיבי טהור: אין כאן מנוע, חישוב או קריאת כלי אמיתית.
// אותו עולם תוכן (חבילה שמתעכבת), שלושה ניסוחים, מסלולי ניתוב שונים.

import type { RoutingExample } from '@/components/ai-internals/types';

export const ROUTING_EXAMPLES: RoutingExample[] = [
    {
        id: 'general',
        label: 'שאלה כללית',
        requestType: 'General question',
        requestText: 'למה חבילות מתעכבות?',
        typeScores: [
            { label: 'שאלה כללית', value: 82 },
            { label: 'בקשת בדיקה ספציפית', value: 13 },
            { label: 'בקשת פעולה', value: 5 },
        ],
        selectedRoute: 'answer',
        intentStage: 'question',
        riskLevel: 'low',
        toolNeed: { needed: false },
        approvalRequired: false,
        decision: {
            kind: 'answer',
            label: 'לענות',
            detail: 'שאלה כללית - אפשר לענות מיד מתוך ידע קיים, בלי מידע נוסף ובלי פעולה.',
        },
        explanation: 'אין כאן חבילה מסוימת ואין פעולה מבוקשת, לכן המנוע מנתב ישירות למסלול של תשובה.',
        promptExplanation: `הרמז "למה" מצביע על שאלה כללית, ואין בפרומט חבילה מסוימת או בקשת פעולה. לכן המסלול הנכון הוא לענות (Answer).`,
        decisionSignals: [
            { signal: 'למה', meaning: 'מילת שאלה כללית', effect: 'המנוע מזהה בקשה להסבר', strength: 'high' },
            { signal: 'חבילות', meaning: 'נושא כללי, לא חבילה מסוימת', effect: 'אין צורך במזהה אישי או בכלי חיצוני', strength: 'medium' },
            { signal: 'אין בקשת פעולה', meaning: 'לא התבקשה בדיקה או שליחה', effect: 'המסלול המתאים הוא לענות (Answer)', strength: 'medium' },
        ],
        accent: 'cyan',
    },
    {
        id: 'investigation',
        label: 'בדיקה ספציפית',
        requestType: 'Specific investigation',
        requestText: 'בדוק למה החבילה שלי מתעכבת.',
        typeScores: [
            { label: 'שאלה כללית', value: 18 },
            { label: 'בקשת בדיקה ספציפית', value: 70 },
            { label: 'בקשת פעולה', value: 12 },
        ],
        selectedRoute: 'ask',
        nextRoute: 'tool',
        intentStage: 'investigation',
        riskLevel: 'medium',
        missingInfo: 'Barcode',
        missingInfoLabel: 'חסר ברקוד',
        missingInfoNote: 'בלי מזהה חבילה אי אפשר לבדוק סטטוס אמיתי.',
        toolNeed: { needed: true, tool: 'שליפת סטטוס משלוח לפי ברקוד' },
        approvalRequired: false,
        decision: {
            kind: 'ask',
            label: 'לבקש מידע',
            detail: 'חסר מספר ברקוד כדי לבדוק חבילה ספציפית. המנוע מבקש את המידע לפני שהוא ממשיך.',
        },
        explanation: 'הבקשה ספציפית אך חסר מזהה. אחרי שיתקבל הברקוד, המסלול הבא האפשרי הוא הכנה לשימוש בכלי.',
        promptExplanation: `הרמזים "בדוק" ו"שלי" מצביעים על בדיקה ספציפית, אבל חסר ברקוד. לכן המנוע מבקש מידע (Ask for info) לפני המשך, והכנה לכלי יכולה לבוא אחר כך.`,
        decisionSignals: [
            { signal: 'בדוק', meaning: 'בקשה לבצע בדיקה', effect: 'המנוע מסווג את הבקשה כמשימה, לא כשאלה', strength: 'high' },
            { signal: 'שלי', meaning: 'מקרה ספציפי של המשתמש', effect: 'נדרש מידע מזהה כדי לבדוק בפועל', strength: 'high' },
            { signal: 'חסר ברקוד', meaning: 'אין מזהה חבילה בפרומט', effect: 'המנוע לא ימציא סטטוס, אלא יבקש מידע', strength: 'high' },
            { signal: 'בדיקת סטטוס', meaning: 'ייתכן צורך במערכת חיצונית', effect: 'בהמחשה שלנו, הכנה לכלי יכולה להיות המסלול הבא אחרי קבלת ברקוד', strength: 'medium' },
        ],
        accent: 'indigo',
    },
    {
        id: 'action',
        label: 'בקשת פעולה',
        requestType: 'Action request',
        requestText: 'שלח ללקוח הודעה שהחבילה מתעכבת.',
        typeScores: [
            { label: 'שאלה כללית', value: 8 },
            { label: 'בקשת בדיקה ספציפית', value: 14 },
            { label: 'בקשת פעולה', value: 78 },
        ],
        selectedRoute: 'stop',
        intentStage: 'action',
        riskLevel: 'high',
        toolNeed: { needed: true, tool: 'שליחת הודעה ללקוח' },
        approvalRequired: true,
        decision: {
            kind: 'stop',
            label: 'לעצור לאישור',
            detail: 'פעולה עם השלכה כלפי לקוח אמיתי - המנוע עוצר ומבקש אישור לפני ביצוע.',
        },
        explanation: 'יש כאן פעולה כלפי העולם החיצוני, לכן הסיכון גבוה והמנוע עוצר לאישור במקום לבצע מיד.',
        promptExplanation: `הרמזים "שלח" ו"ללקוח" מצביעים על פעולה שמשפיעה על אדם אמיתי, ואין אישור מפורש. לכן המנוע עוצר לאישור (Stop for approval) לפני ביצוע.`,
        decisionSignals: [
            { signal: 'שלח', meaning: 'בקשת פעולה, לא רק תשובה', effect: 'המנוע מזהה פעולה בעולם האמיתי', strength: 'high' },
            { signal: 'ללקוח', meaning: 'הפעולה משפיעה על אדם אמיתי', effect: 'רמת האחריות עולה', strength: 'high' },
            { signal: 'החבילה מתעכבת', meaning: 'טענה שצריך לאמת לפני שליחה', effect: 'צריך לבדוק נתונים לפני ניסוח או שליחה', strength: 'medium' },
            { signal: 'אין אישור מפורש', meaning: 'אין אישור סופי לפעולה רגישה', effect: 'המסלול המתאים הוא לעצור לאישור (Stop for approval)', strength: 'high' },
        ],
        accent: 'rose',
    },
];
