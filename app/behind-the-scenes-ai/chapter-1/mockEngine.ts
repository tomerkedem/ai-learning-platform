// app/behind-the-scenes-ai/chapter-1/mockEngine.ts
//
// "מנוע לימודי" דטרמיניסטי לפרק 1 - לא NLP אמיתי ולא מודל.
// הוא מדרג קלט לפי כללי מילות-מפתח פשוטים, בדיוק ברוח הספר:
// המנוע לא "יודע" שפה, הוא מעריך מה הכי סביר מתוך מה שהוא מכיר.
//
// פונקציות טהורות בלבד (אין Date/Math.random/תופעות לוואי).
// לוגיקה ספציפית-לפרק - לכן יושבת ליד הפרק, לא בתוך ה-primitives הגנריים.

import type { DecisionState, IntentProbability } from '@/components/ai-internals/types';

export type Confidence = 'High' | 'Medium' | 'Low';
export type Risk = 'Low' | 'Medium' | 'High';

// מפתחות התשובה: המנוע נשאר טהור ומחזיר מזהה תשובה בלבד (לא טקסט). שכבת התצוגה
// פותרת אותו לטקסט הנכון מהמילון (chapter1Visuals.mockEngine), כדי שהפלט יהיה
// תלוי-שפה בלי להכניס תלות-מילון למודול הלוגי הזה.
export type ChatReplyKey = 'notDelivered' | 'tracking' | 'system' | 'payment' | 'other';
export type AgentReplyKey = 'sensitive' | 'tool' | 'askBarcode' | 'vague' | 'general';

export interface ChatEngineResult {
    tokens: string[];
    meaning: string;
    intents: IntentProbability[];
    confidence: Confidence;
    decision: DecisionState;
    output: string;
    replyKey: ChatReplyKey;
}

export interface AgentEngineResult {
    tokens: string[];
    task: string;
    missingInfo: string;
    toolNeed: { needed: boolean; tool: string };
    canActNow: boolean;
    risk: Risk;
    decision: DecisionState;
    output: string;
    replyKey: AgentReplyKey;
}

// --- עזרי טקסט ---

// יפנית נכתבת בלי רווחים, ולכן פיצול-רווח היה מחזיר טוקן יחיד (ראש הקריאה תקוע על 1/1).
// זיהוי כתב יפני (קאנה/קאנג'י) - אותו ביטוי בדיוק כמו ב-vocabFor.
const isJapanese = (text: string) => /[぀-ヿ一-鿿]/.test(text);

export function tokenize(text: string): string[] {
    const trimmed = text.trim();
    if (!trimmed) return [];
    if (isJapanese(trimmed)) return tokenizeJa(trimmed);
    return trimmed.split(/\s+/).filter(Boolean);
}

// מפת-override דטרמיניסטית לקלטי-ההדגמה היפניים של פרק 1. בחלק מהסביבות (למשל ICU
// מצומצם) Intl.Segmenter מפצל קאנה יתר על המידה (届/き/ま/せん במקום 届き/ません), ולכן
// לקלטים הידועים אנו קובעים חיתוך לימודי טבעי. זו טבלת-נתונים בלבד (אין מספרים/לוגיקה
// חדשים), מצומדת לקלט-ההדגמה ב-ja/behind-ai/chapter1*.ts (seed, forkView, counterfactual,
// confidenceDial). אם טקסט-הדגמה במילון משתנה, הקלט פשוט נופל ל-Segmenter (נפילה חיננית).
// ההתאמה דטרמיניסטית ולכן SSR וה-hydration זהים, בלי תלות בגרסת ה-ICU של הדפדפן.
const JA_DEMO_SEGMENTS: Record<string, string[]> = {
    '荷物が届きません': ['荷物', 'が', '届き', 'ません'],
    '私の荷物はどこですか': ['私', 'の', '荷物', 'は', 'どこ', 'です', 'か'],
    '荷物 123456789 を確認して': ['荷物', '123456789', 'を', '確認', 'して'],
    '荷物が紛失したと顧客に伝えて': ['荷物', 'が', '紛失', 'した', 'と', '顧客', 'に', '伝えて'],
    'これを対応して': ['これ', 'を', '対応', 'して'],
    '注文はどこ?システムに表示されません': ['注文', 'は', 'どこ', '?', 'システム', 'に', '表示され', 'ません'],
    '私の支払いはどこ?': ['私', 'の', '支払い', 'は', 'どこ', '?'],
    '荷物が届きました': ['荷物', 'が', '届き', 'ました'],
    '支払いに問題があります': ['支払い', 'に', '問題', 'が', 'あります'],
    'システムに問題があります': ['システム', 'に', '問題', 'が', 'あります'],
    '荷物を確認して': ['荷物', 'を', '確認', 'して'],
    '荷物が紛失したか確認して': ['荷物', 'が', '紛失', 'した', 'か', '確認', 'して'],
    '営業時間は何時ですか': ['営業', '時間', 'は', '何時', 'です', 'か'],
};

// פיצול יפני: קודם override דטרמיניסטי לקלטי-ההדגמה הידועים (חיתוך טבעי ולימודי); אחרת
// Intl.Segmenter ('ja', granularity 'word'); ואם אינו זמין או החזיר מקטע יחיד, נפילה
// לפיצול לפי מעבר-כתב (קאנג'י/היראגנה/קטקנה). בלי תלות חיצונית.
function tokenizeJa(text: string): string[] {
    const override = JA_DEMO_SEGMENTS[text];
    if (override) return [...override];
    if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
        try {
            const seg = new Intl.Segmenter('ja', { granularity: 'word' });
            const out: string[] = [];
            for (const part of seg.segment(text)) {
                const w = part.segment.trim();
                if (w) out.push(w);
            }
            if (out.length > 1) return out;
        } catch {
            // נפילה חיננית לפיצול לפי מעבר-כתב
        }
    }
    return chunkJaByScript(text);
}

// פיצול-גיבוי לפי מעבר בין מחלקות-כתב יפניות, כשאין Intl.Segmenter.
function chunkJaByScript(text: string): string[] {
    const classOf = (ch: string): string => {
        if (/\s/.test(ch)) return 'space';
        if (/[一-鿿]/.test(ch)) return 'kanji';
        if (/[぀-ゟ]/.test(ch)) return 'hira';
        if (/[゠-ヿ]/.test(ch)) return 'kata';
        return 'other';
    };
    const out: string[] = [];
    let cur = '';
    let curClass = '';
    for (const ch of text) {
        const cls = classOf(ch);
        if (cls === 'space') { if (cur) { out.push(cur); cur = ''; curClass = ''; } continue; }
        if (cur && cls !== curClass) { out.push(cur); cur = ''; }
        cur += ch;
        curClass = cls;
    }
    if (cur) out.push(cur);
    return out.filter(Boolean);
}

// מחבר טוקנים חזרה למחרוזת (לראש הקריאה, שמריץ את המנוע על תת-מחרוזת, ולתצוגת
// הנורמליזציה). יפנית מחוברת בלי רווחים כדי שזיהוי תת-המחרוזת של המנוע יישמר
// (届きません לא יישבר ל-"届き ません"); שאר השפות מחוברות ברווח כרגיל. כך פלט המנוע
// בראש הקריאה נשאר זהה להרצה הישירה, וההתנהגות ב-he/en/es/ru/ar אינה משתנה.
export function joinTokens(tokens: string[], text: string): string {
    return tokens.join(isJapanese(text) ? '' : ' ');
}

// עוזרים אלה מיוצאים (additive בלבד) כדי שטבלת ה-trace תוכל לחשוף את אותם
// בדיקות-מפתח שהמנוע כבר מבצע - מקור-אמת יחיד, בלי שכפול לוגיקה ובלי מספרים חדשים.
// ההשוואה היא חסרת-רגישות לאותיות גדולות/קטנות (אוצר-המילים באותיות קטנות), כדי
// שקלט אנגלי במשפט רגיל ("Where", "Check") יזוהה. בעברית אין אותיות גדולות, ולכן
// toLowerCase הוא זהותי וההתנהגות העברית נשארת זהה.
export const includesAny = (text: string, words: string[]) => { const t = text.toLowerCase(); return words.some((w) => t.includes(w)); };
export const countHits = (text: string, words: string[]) => { const t = text.toLowerCase(); return words.filter((w) => t.includes(w)).length; };
export const matchedWords = (text: string, words: string[]) => { const t = text.toLowerCase(); return words.filter((w) => t.includes(w)); };
export const hasBarcode = (text: string) => /\d{6,}/.test(text);

// ════════════════════ אוצר-מילים תלוי-שפה לזיהוי (C3/C4) ════════════════════
// המנוע מזהה כוונה/פעולה לפי התאמת תת-מחרוזות. אוצר-המילים מצומד לקלט-ההדגמה שבמילון
// (chapter1.seed, confidenceDial.samples, forkView.samples, counterfactual.variants),
// ולכן הוא תלוי-שפה: כל שפה מזוהה לפי האוצר שלה.
//
// בחירת האוצר נעשית לפי כתב הקלט (vocabFor): עברית / ערבית / קירילית / יפנית מזוהות
// לפי הכתב; כל השאר (לטיני) נופל לאוצר LATIN. אנגלית וספרדית חולקות כתב לטיני ולכן
// אינן ניתנות להפרדה לפי כתב - לכן LATIN_VOCAB מאחד את שתיהן (מילות en + es יחד).
// התאמת תת-מחרוזת מבטיחה שקלט אנגלי פוגע במילים האנגליות וקלט ספרדי במילים הספרדיות,
// בלי התנגשות (נבדק שאין מילה של שפה אחת שהיא תת-מחרוזת של קלט השפה האחרת).
// ההתנהגות העברית והאנגלית נשארות זהות לחלוטין.
//
// negation הוא מערך (כל שפה עשויה להזדקק לכמה סימני שלילה; לטיני מאחד en+es).
export interface Vocab {
    /** סימני שלילה (מחזקים את כוונת אי-המסירה). includesAny => חסר-רגישות לאותיות. */
    negation: string[];
    /** מילות-מפתח לכל כוונת Chat, לפי מפתח הכלל. */
    chatWords: Record<ChatRuleKey, string[]>;
    actionWords: string[];
    sensitiveWords: string[];
    deliveryWords: string[];
    vagueWords: string[];
}

const HE_VOCAB: Vocab = {
    negation: ['לא'],
    chatWords: {
        notDelivered: ['לא הגיע', 'לא הגיעה', 'לא קיבלתי', 'לא נמסר', 'אבד', 'אבדה', 'חסר', 'איחור', 'מתעכב', 'עיכוב'],
        tracking: ['איפה', 'היכן', 'מתי', 'סטטוס', 'מעקב', 'track', 'status'],
        system: ['מערכת', 'אתר', 'אפליקציה', 'לא מופיע', 'לא מופיעה', 'תקלה', 'שגיאה', 'התחבר'],
        payment: ['תשלום', 'חיוב', 'חשבונית', 'שילמתי', 'החזר', 'אשראי'],
    },
    actionWords: ['בדוק', 'תבדוק', 'מצא', 'שלוף', 'עדכן', 'תעדכן', 'שלח', 'תשלח', 'פתח', 'סגור', 'תטפל', 'טפל'],
    sensitiveWords: ['שלח', 'תשלח', 'עדכן', 'תעדכן', 'מחק', 'תמחק'],
    deliveryWords: ['חבילה', 'משלוח', 'הזמנה', 'מסירה'],
    vagueWords: ['תטפל בזה', 'תטפל', 'זה', 'אותו'],
};

// אוצר לטיני: אנגלית + ספרדית יחד (שני הכתבים לטיניים, אי אפשר להפריד לפי כתב).
// es: "no " עם רווח נבחר כסימן שלילה כדי לא להתנגש ב-"not" האנגלי (n-o-t).
const LATIN_VOCAB: Vocab = {
    negation: ["n't", 'no '],
    chatWords: {
        notDelivered: ["didn't arrive", 'did not arrive', "didn't receive", "hasn't arrived", 'never arrived', 'lost', 'missing', 'delayed', 'delay',
            'no llegó', 'no llego', 'se perdió', 'se perdio', 'perdido', 'perdida', 'no recibí', 'no recibi', 'extraviado', 'retraso'],
        tracking: ['where', 'when', 'status', 'track', 'tracking', 'dónde', 'donde', 'cuándo', 'cuando', 'estado', 'seguimiento', 'rastreo'],
        system: ['system', 'not working', 'error', 'glitch', 'down', 'crash', 'sistema', 'aplicación', 'aplicacion', 'no aparece', 'falla', 'no funciona'],
        payment: ['payment', 'charge', 'invoice', 'refund', 'billing', 'paid', 'pago', 'cobro', 'factura', 'reembolso', 'pagué', 'pague', 'tarjeta'],
    },
    actionWords: ['check', 'find', 'look up', 'update', 'send', 'tell', 'handle',
        'revisa', 'revisar', 'busca', 'encuentra', 'actualiza', 'envía', 'envia', 'avisa', 'encárgate', 'encargate', 'gestiona'],
    sensitiveWords: ['send', 'tell', 'email', 'notify', 'update', 'delete', 'remove', 'envía', 'envia', 'avisa', 'notifica', 'actualiza', 'elimina', 'borra'],
    deliveryWords: ['package', 'delivery', 'order', 'shipment', 'parcel', 'paquete', 'envío', 'envio', 'pedido', 'entrega', 'encomienda'],
    vagueWords: ['handle it', 'take care of it', 'sort it out', 'deal with it', 'just handle', 'encárgate de esto', 'encárgate', 'ocúpate', 'de esto'],
};

// אוצר ערבית (MSA). מצומד לקלט-ההדגמה ב-ar/chapter1*.ts.
const AR_VOCAB: Vocab = {
    negation: ['لم '],
    chatWords: {
        notDelivered: ['لم يصل', 'لم تصل', 'فُقد', 'فقد', 'ضاع', 'ضائع', 'مفقود', 'لم أستلم', 'تأخر', 'متأخر'],
        tracking: ['أين', 'متى', 'حالة', 'تتبع', 'تعقب'],
        system: ['النظام', 'نظام', 'الموقع', 'التطبيق', 'لا يظهر', 'خطأ', 'عطل', 'لا يعمل'],
        payment: ['دفع', 'الدفع', 'دفعة', 'دفعتي', 'فاتورة', 'استرداد', 'بطاقة'],
    },
    actionWords: ['تحقق', 'افحص', 'ابحث', 'حدّث', 'أرسل', 'أبلغ', 'تولَّ', 'تولى', 'عالج'],
    sensitiveWords: ['أرسل', 'أبلغ', 'حدّث', 'احذف', 'عدّل'],
    deliveryWords: ['طرد', 'الطرد', 'طردي', 'شحنة', 'طلب', 'توصيل'],
    vagueWords: ['تولَّ هذا', 'هذا الأمر', 'تولَّ', 'اعتنِ'],
};

// אוצר רוסית. מצומד לקלט-ההדגמה ב-ru/chapter1*.ts.
const RU_VOCAB: Vocab = {
    negation: ['не '],
    chatWords: {
        notDelivered: ['не пришла', 'не пришёл', 'не пришел', 'потерял', 'потеряна', 'потерян', 'пропал', 'пропала', 'не получил', 'задержка', 'задерживается'],
        tracking: ['где', 'когда', 'статус', 'отслеживание', 'трек'],
        system: ['систем', 'сайт', 'приложение', 'нет в системе', 'ошибка', 'сбой', 'не работает'],
        payment: ['платёж', 'платеж', 'оплата', 'счёт', 'счет', 'возврат', 'оплатил', 'карта'],
    },
    actionWords: ['проверь', 'проверить', 'найди', 'обнови', 'отправь', 'сообщи', 'разберись', 'займись'],
    sensitiveWords: ['отправь', 'сообщи', 'уведоми', 'обнови', 'удали'],
    deliveryWords: ['посылка', 'посылку', 'посылки', 'доставка', 'заказ', 'отправление'],
    vagueWords: ['разберись с этим', 'разберись', 'займись этим', 'с этим'],
};

// אוצר יפנית. מצומד לקלט-ההדגמה ב-ja/chapter1*.ts. זיהוי הכוונה הוא התאמת תת-מחרוזת
// על הטקסט הגולמי, והפיצול החזותי (ראש הקריאה, רצועת הטוקנים) משתמש ב-tokenizeJa
// (Intl.Segmenter עם נפילה לפיצול לפי מעבר-כתב), כך שהיפנית נחתכת ליחידות מרובות.
const JA_VOCAB: Vocab = {
    negation: ['ません', 'ない'],
    chatWords: {
        notDelivered: ['届きません', '届かない', '紛失', 'なくし', '失われ', '届いていません', '遅延', '遅れ'],
        tracking: ['どこ', 'いつ', '状況', '追跡', 'ステータス'],
        system: ['システム', 'サイト', 'アプリ', '表示されません', 'エラー', '不具合', '動かない'],
        payment: ['支払い', '支払', '請求', '返金', '決済', 'カード'],
    },
    actionWords: ['確認', '調べ', '探し', '更新', '送信', '伝え', '対応', '処理'],
    sensitiveWords: ['送信', '送って', '伝え', '通知', '更新', '削除'],
    deliveryWords: ['荷物', '小包', '配送', '注文', '発送'],
    vagueWords: ['これを対応', 'これを', '対応して', 'よろしく'],
};

/** בוחר אוצר-מילים לפי כתב הקלט. לטיני (en/es) מאוחד. */
export function vocabFor(text: string): Vocab {
    if (/[֐-׿]/.test(text)) return HE_VOCAB;                 // עברית
    if (/[؀-ۿ]/.test(text)) return AR_VOCAB;                 // ערבית
    if (/[Ѐ-ӿ]/.test(text)) return RU_VOCAB;                 // קירילית (רוסית)
    if (/[぀-ヿ一-鿿]/.test(text)) return JA_VOCAB;    // יפנית (קאנה/קאנג'י)
    return LATIN_VOCAB;                                                // לטיני (en + es)
}

// --- Chat Mode: דירוג כוונות ---

export type ChatRuleKey = 'notDelivered' | 'tracking' | 'system' | 'payment';

export interface ChatRule {
    key: ChatRuleKey;
    label: string;
    meaning: string;
}

// מבנה הכוונות (מפתח, תווית, משמעות) - לא תלוי-שפה. מילות-הזיהוי עברו ל-Vocab.
export const CHAT_RULES: ChatRule[] = [
    { key: 'notDelivered', label: 'Package not delivered', meaning: 'Delivery issue' },
    { key: 'tracking', label: 'Tracking question', meaning: 'Tracking request' },
    { key: 'system', label: 'System issue', meaning: 'System issue' },
    { key: 'payment', label: 'Payment issue', meaning: 'Payment issue' },
];

export const UNMATCHED_BASE = 0.15;
export const HIT_WEIGHT = 3.0;
export const NEGATION_BOOST = 1.5;
export const OTHER_BASE = 0.4;

/** ממיר ציונים גולמיים לאחוזים שמסתכמים ל-100, ממוין יורד. */
function normalize(raw: { label: string; score: number }[]): IntentProbability[] {
    const total = raw.reduce((s, x) => s + x.score, 0) || 1;
    const pcts = raw.map((x) => ({ label: x.label, value: Math.round((x.score / total) * 100) }));

    const sum = pcts.reduce((s, x) => s + x.value, 0);
    const diff = 100 - sum;
    if (diff !== 0 && pcts.length) {
        const topIdx = pcts.reduce((mi, x, i, arr) => (x.value > arr[mi].value ? i : mi), 0);
        pcts[topIdx] = { ...pcts[topIdx], value: pcts[topIdx].value + diff };
    }

    return pcts.sort((a, b) => b.value - a.value);
}

function confidenceFrom(intents: IntentProbability[]): Confidence {
    const top = intents[0]?.value ?? 0;
    const second = intents[1]?.value ?? 0;
    const margin = top - second;
    if (margin >= 40) return 'High';
    if (margin >= 15) return 'Medium';
    return 'Low';
}

export function runChatEngine(text: string): ChatEngineResult {
    const vocab = vocabFor(text);
    const tokens = tokenize(text);
    const hasNegation = includesAny(text, vocab.negation);

    const raw = CHAT_RULES.map((rule) => {
        const hits = countHits(text, vocab.chatWords[rule.key]);
        let score = UNMATCHED_BASE + hits * HIT_WEIGHT;
        if (rule.key === 'notDelivered' && hasNegation) score += NEGATION_BOOST;
        return { key: rule.key, label: rule.label, meaning: rule.meaning, score };
    });

    const scored = [
        ...raw.map((r) => ({ label: r.label, score: r.score })),
        { label: 'Other', score: OTHER_BASE },
    ];

    const intents = normalize(scored);
    const confidence = confidenceFrom(intents);

    // הכוונה המובילה -> משמעות + מפתח תשובה
    const topLabel = intents[0]?.label ?? 'Other';
    const topRule = raw.find((r) => r.label === topLabel);
    const meaning = topRule?.meaning ?? 'General request';

    const isConfident = confidence !== 'Low';
    const decision: DecisionState = isConfident
        ? { kind: 'answer', label: 'Generate response' }
        : { kind: 'ask', label: 'Ask for more context' };

    // כשהביטחון נמוך התשובה תמיד 'other' (בקשת הבהרה), בדיוק כמו קודם.
    const replyKey: ChatReplyKey = isConfident ? ((topRule?.key as ChatReplyKey) ?? 'other') : 'other';

    return {
        tokens,
        meaning,
        intents,
        confidence,
        decision,
        output: isConfident ? 'Response generated' : 'Clarifying question',
        replyKey,
    };
}

// --- Agent Mode: זיהוי משימה, מידע חסר, כלי, סיכון ---

export function runAgentEngine(text: string): AgentEngineResult {
    const vocab = vocabFor(text);
    const tokens = tokenize(text);

    const action = includesAny(text, vocab.actionWords);
    const sensitive = includesAny(text, vocab.sensitiveWords);
    const delivery = includesAny(text, vocab.deliveryWords);
    const barcode = hasBarcode(text);
    const vague = !delivery && !barcode && includesAny(text, vocab.vagueWords);

    // 1. פעולה רגישה (משפיעה על לקוח/מערכת) -> עצירה לאישור
    if (sensitive) {
        return {
            tokens,
            task: 'Send / update on customer record',
            missingInfo: 'Evidence: not verified',
            toolNeed: { needed: true, tool: 'Email / CRM' },
            canActNow: false,
            risk: 'High',
            decision: { kind: 'stop', label: 'Stop for approval' },
            output: 'Stop before action',
            replyKey: 'sensitive',
        };
    }

    // 2. בדיקת משלוח עם ברקוד -> שימוש בכלי
    if (action && (delivery || barcode) && barcode) {
        return {
            tokens,
            task: 'Check delivery failure',
            missingInfo: 'None',
            toolNeed: { needed: true, tool: 'Tracking API' },
            canActNow: true,
            risk: 'Low',
            decision: { kind: 'tool', label: 'Use Tracking API' },
            output: 'Call Tracking API',
            replyKey: 'tool',
        };
    }

    // 3. בדיקת משלוח בלי ברקוד -> בקשת מידע חסר
    if (action && delivery) {
        return {
            tokens,
            task: 'Check delivery failure',
            missingInfo: 'Barcode: missing',
            toolNeed: { needed: true, tool: 'Tracking API' },
            canActNow: false,
            risk: 'Medium',
            decision: { kind: 'ask', label: 'Ask for barcode before action' },
            output: 'Ask user for required information',
            replyKey: 'askBarcode',
        };
    }

    // 4. בקשה עמומה -> בקשת הבהרה
    if (vague) {
        return {
            tokens,
            task: 'Unclear task',
            missingInfo: 'Target unclear',
            toolNeed: { needed: false, tool: '-' },
            canActNow: false,
            risk: 'Low',
            decision: { kind: 'ask', label: 'Ask what to handle' },
            output: 'Ask for clarification',
            replyKey: 'vague',
        };
    }

    // 5. תיאור בעיה בלי מילת פעולה (משלוח) -> עדיין צריך מזהה
    if (delivery) {
        return {
            tokens,
            task: 'Check delivery failure',
            missingInfo: barcode ? 'None' : 'Barcode: missing',
            toolNeed: { needed: true, tool: 'Tracking API' },
            canActNow: barcode,
            risk: 'Medium',
            decision: barcode
                ? { kind: 'tool', label: 'Use Tracking API' }
                : { kind: 'ask', label: 'Ask for barcode before action' },
            output: barcode ? 'Call Tracking API' : 'Ask user for required information',
            replyKey: barcode ? 'tool' : 'askBarcode',
        };
    }

    // 6. ברירת מחדל: בקשה כללית -> מענה ישיר
    return {
        tokens,
        task: 'General request',
        missingInfo: 'None',
        toolNeed: { needed: false, tool: '-' },
        canActNow: true,
        risk: 'Low',
        decision: { kind: 'answer', label: 'Answer directly' },
        output: 'Generate explanation',
        replyKey: 'general',
    };
}
