// נתוני "מעבדת ההמשכים הסבירים" (Continuation Lab) - פרק 4, הלב ההסתברותי.
// נתון דקלרטיבי טהור: אין כאן מודל אמיתי, קריאת API או חישוב הסתברות חי.
//
// הרעיון המרכזי: המודל לא שולף תשובה מוכנה. הוא מעריך כמה המשכים אפשריים, נותן
// לכל אחד משקל סבירות לפי הקלט וההקשר, ובוחר את מה שנראה מתאים. כשמוסיפים פרט
// הקשר, אותם המשכים בדיוק מקבלים משקלים אחרים. משקל גבוה אינו הוכחת אמת.
//
// המספרים הם המחשה לימודית בלבד. הפער כמדד ביטחון ושער ההחלטה שייכים לפרק 9.

import type { ContinuationScenario } from '@/components/ai-internals/types';

export const CONTINUATION_SCENARIOS: ContinuationScenario[] = [
    {
        id: 'action-request',
        prompt: 'החבילה שלי לא הגיעה. מה לעשות?',
        labelHe: 'בקשת הכוונה',
        labelEn: 'Action request',
        continuations: [
            {
                id: 'check-tracking',
                labelHe: 'בדקו את מספר המעקב',
                labelEn: 'Check the tracking number',
                probability: 32,
                reason: 'בקשת הכוונה על חבילה שלא הגיעה מובילה לרוב לבדיקת מצב המשלוח.',
            },
            {
                id: 'contact-support',
                labelHe: 'פנו לשירות הלקוחות',
                labelEn: 'Contact customer support',
                probability: 27,
                reason: 'פנייה לשירות היא צעד מעשי מקובל כשחבילה לא הגיעה.',
            },
            {
                id: 'check-delivery-note',
                labelHe: 'בדקו אם יש הודעת מסירה',
                labelEn: 'Check for a delivery notice',
                probability: 18,
                reason: 'לעיתים יש הודעת מסירה שלא נראתה, ולכן זה המשך סביר.',
            },
            {
                id: 'wait-day',
                labelHe: 'המתינו עוד יום עסקים',
                labelEn: 'Wait another business day',
                probability: 14,
                reason: 'לפעמים החבילה מתעכבת יום, וזה המשך אפשרי אך פחות פעיל.',
            },
            {
                id: 'open-case',
                labelHe: 'פתחו פנייה רשמית',
                labelEn: 'Open a formal case',
                probability: 9,
                reason: 'פנייה רשמית מתאימה יותר כשצעדים פשוטים כבר לא עזרו.',
            },
        ],
        signals: [
            {
                signal: 'לא הגיעה',
                effect: 'מצביע על בעיה במסירה, ומחזק המשכים של בדיקה ופנייה.',
                strength: 'high',
            },
            {
                signal: 'מה לעשות',
                effect: 'בקשה מפורשת להכוונה, ולכן ההמשכים הם צעדים מעשיים.',
                strength: 'medium',
            },
        ],
        contextToggles: [
            {
                id: 'delivered-notice',
                labelHe: 'אבל קיבלתי הודעה שהיא נמסרה',
                labelEn: 'But I got a delivered notice',
                note: 'עכשיו יש סתירה בין החוויה להודעת המסירה. בדיקת הודעת המסירה הופכת לצעד המוביל, והמתנה פסיבית פחות הגיונית.',
                weights: {
                    'check-delivery-note': 38,
                    'contact-support': 24,
                    'check-tracking': 22,
                    'open-case': 10,
                    'wait-day': 6,
                },
                signals: [
                    {
                        signal: 'נמסרה',
                        effect: 'סתירה בין מה שחווה המשתמש לבין הודעת המסירה מקפיצה את בדיקת המסירה.',
                        strength: 'high',
                    },
                    {
                        signal: 'אבל',
                        effect: 'מסמן ניגוד, ומחליש המשכים של המתנה פסיבית.',
                        strength: 'medium',
                    },
                ],
                accent: 'purple',
            },
            {
                id: 'tracking-id',
                labelHe: 'מספר המעקב הוא 12345',
                labelEn: 'The tracking number is 12345',
                note: 'מזהה המעקב הופך בדיקה ממשית לאפשרית, ולכן בדיקת המעקב קופצת למוביל ברור על פני שאר ההמשכים.',
                weights: {
                    'check-tracking': 52,
                    'contact-support': 18,
                    'check-delivery-note': 14,
                    'open-case': 10,
                    'wait-day': 6,
                },
                signals: [
                    {
                        signal: 'מספר המעקב',
                        effect: 'מזהה ספציפי מאפשר בדיקה ישירה, ומרכז את המשקל סביב בדיקת המעקב.',
                        strength: 'high',
                    },
                    {
                        signal: '12345',
                        effect: 'פרט קונקרטי שמחזק את כיוון הבדיקה הממשית.',
                        strength: 'medium',
                    },
                ],
                accent: 'cyan',
            },
        ],
        accent: 'emerald',
    },
    {
        id: 'timing-question',
        prompt: 'מתי החבילה שלי תגיע?',
        labelHe: 'שאלת זמן',
        labelEn: 'Timing question',
        continuations: [
            {
                id: 'check-tracking',
                labelHe: 'בדקו את מספר המעקב',
                labelEn: 'Check the tracking number',
                probability: 38,
                reason: 'שאלת זמן נענית לרוב מתוך מצב המשלוח העדכני.',
            },
            {
                id: 'check-eta',
                labelHe: 'בדקו זמן אספקה משוער',
                labelEn: 'Check the estimated delivery time',
                probability: 30,
                reason: 'זמן אספקה משוער עונה ישירות על השאלה מתי.',
            },
            {
                id: 'contact-support',
                labelHe: 'פנו לשירות הלקוחות',
                labelEn: 'Contact customer support',
                probability: 16,
                reason: 'פנייה לשירות מתאימה אם אין מידע זמין על המועד.',
            },
            {
                id: 'check-delivery-note',
                labelHe: 'בדקו אם כבר נמסרה',
                labelEn: 'Check if it was already delivered',
                probability: 9,
                reason: 'ייתכן שהחבילה כבר נמסרה, אך זה פחות סביר לשאלת זמן.',
            },
            {
                id: 'wait-update',
                labelHe: 'המתינו לעדכון מהשליח',
                labelEn: 'Wait for a courier update',
                probability: 7,
                reason: 'המתנה לעדכון היא המשך אפשרי אך פסיבי.',
            },
        ],
        signals: [
            {
                signal: 'מתי',
                effect: 'שאלת זמן, ולכן המשקל נוטה לבדיקת מצב וזמן אספקה ולא לכשל.',
                strength: 'high',
            },
            {
                signal: 'תגיע',
                effect: 'מתמקד בהגעה עתידית, ולכן פתיחת תלונה פחות סבירה.',
                strength: 'medium',
            },
        ],
        contextToggles: [
            {
                id: 'two-weeks',
                labelHe: 'הזמנתי לפני שבועיים',
                labelEn: 'I ordered two weeks ago',
                note: 'פרק הזמן שחלף חורג מהצפוי, ולכן פנייה לשירות ובדיקת עיכוב עולות מול בדיקה רגילה של מצב.',
                weights: {
                    'contact-support': 30,
                    'check-eta': 28,
                    'check-tracking': 22,
                    'check-delivery-note': 12,
                    'wait-update': 8,
                },
                signals: [
                    {
                        signal: 'לפני שבועיים',
                        effect: 'פרק זמן חריג שמחזק פנייה לשירות ובדיקת עיכוב.',
                        strength: 'high',
                    },
                    {
                        signal: 'הזמנתי',
                        effect: 'מבסס שכבר בוצעה הזמנה, ולכן המשקל נשאר על מעקב אחר משלוח קיים.',
                        strength: 'medium',
                    },
                ],
                accent: 'amber',
            },
        ],
        accent: 'blue',
    },
    {
        id: 'vague-phrasing',
        prompt: 'יש בעיה עם החבילה',
        labelHe: 'ניסוח כללי',
        labelEn: 'Vague phrasing',
        continuations: [
            {
                id: 'contact-support',
                labelHe: 'פנו לשירות הלקוחות',
                labelEn: 'Contact customer support',
                probability: 26,
                reason: 'בעיה כללית בלי פירוט מובילה לרוב לפנייה לשירות.',
            },
            {
                id: 'check-tracking',
                labelHe: 'בדקו את מספר המעקב',
                labelEn: 'Check the tracking number',
                probability: 24,
                reason: 'בדיקת מצב היא המשך סביר גם כשהבעיה לא ברורה.',
            },
            {
                id: 'describe-problem',
                labelHe: 'תארו מה הבעיה בדיוק',
                labelEn: 'Describe the exact problem',
                probability: 22,
                reason: 'כשאין פירוט, בקשת תיאור מדויק היא המשך הגיוני.',
            },
            {
                id: 'check-delivery-note',
                labelHe: 'בדקו אם יש הודעת מסירה',
                labelEn: 'Check for a delivery notice',
                probability: 16,
                reason: 'ייתכן שהבעיה קשורה למסירה, ולכן זה המשך אפשרי.',
            },
            {
                id: 'open-case',
                labelHe: 'פתחו פנייה רשמית',
                labelEn: 'Open a formal case',
                probability: 12,
                reason: 'פנייה רשמית אפשרית, אך מוקדם לפתוח אותה בלי פרטים.',
            },
        ],
        signals: [
            {
                signal: 'בעיה',
                effect: 'מילה כללית שמפזרת את המשקל בין כמה המשכים, בלי מוביל חד.',
                strength: 'high',
            },
            {
                signal: 'יש',
                effect: 'פתיחה מעורפלת שלא ממקדת את סוג הבעיה.',
                strength: 'low',
            },
        ],
        contextToggles: [
            {
                id: 'arrived-broken',
                labelHe: 'היא הגיעה שבורה',
                labelEn: 'It arrived broken',
                note: 'נזק פיזי ממקד את הבעיה. פנייה לשירות ופתיחת תלונה הופכות לצעדים הסבירים, ובדיקת מעקב פחות רלוונטית.',
                weights: {
                    'contact-support': 34,
                    'open-case': 30,
                    'describe-problem': 18,
                    'check-delivery-note': 10,
                    'check-tracking': 8,
                },
                signals: [
                    {
                        signal: 'שבורה',
                        effect: 'נזק פיזי ממקד את המשקל סביב פנייה לשירות ופתיחת תלונה.',
                        strength: 'high',
                    },
                    {
                        signal: 'הגיעה',
                        effect: 'מבהיר שהחבילה כבר במסירה, ולכן בדיקת מעקב כבר לא הצעד המרכזי.',
                        strength: 'medium',
                    },
                ],
                accent: 'rose',
            },
        ],
        accent: 'amber',
    },
];
