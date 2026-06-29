// app/behind-the-scenes-ai/chapter-4/wordLabContent.ts
//
// שכבת תוכן locale-aware ל-WordToNumberLab ("Under the hood" של פרק 4).
// ────────────────────────────────────────────────────────────────────────
// embeddingEngine.ts לא משתנה. כאן מוגדרת שכבת נתונים אנגלית מקבילה (משפטי דוגמה,
// tokens, מזהי token להמחשה, ודחיפות ממד) שמשתמשת מחדש בפרופילים המספריים של המנוע
// (בלתי תלויי שפה), פלוס מילון מחרוזות chrome לעברית ולאנגלית.
//
// הנתיב העברי (HE_WORD_DATASET / HE_WORD_TEXT) משקף בדיוק את המנוע ואת המחרוזות
// הנוכחיות, כך שפלט העברית נשאר זהה. אין מקף ארוך או מקף בינוני בטקסט גלוי.

import type { Locale } from '@/i18n/config';
import {
    SCENARIOS,
    getScenario,
    idForWord,
    shiftForWord,
    SIMILAR_PAIR,
    type EngineScenario,
    type EngineStep,
    type ShiftEntry,
    type SimilarPair,
    type DimKey,
} from './embeddingEngine';

/* ════════════════════════ נתונים: dataset לפי שפה ════════════════════════ */

export interface WordLabDataset {
    scenarios: EngineScenario[];
    tokenId: (w: string) => number | null;
    shift: (w: string) => ShiftEntry[];
    similar: SimilarPair;
}

/** הנתיב העברי: ישירות מהמנוע (ללא שינוי). */
export const HE_WORD_DATASET: WordLabDataset = {
    scenarios: SCENARIOS,
    tokenId: idForWord,
    shift: shiftForWord,
    similar: SIMILAR_PAIR,
};

/* ── שכבת נתונים אנגלית מקבילה (משתמשת מחדש בפרופילים המספריים של המנוע) ── */

// מילון Token IDs להמחשה למילים האנגליות. ה-ID הוא כתובת, לא משמעות, בדיוק כמו בעברית.
const EN_TOKEN_DICTIONARY: Record<string, number> = {
    The: 204, the: 9, package: 1042, did: 320, not: 17, arrive: 883,
    system: 2310, is: 58, showing: 441, a: 12,
    Check: 51, why: 88,
    Send: 73, customer: 1190, message: 612, that: 145, was: 61, lost: 770,
    delivery: 1057, handed: 904, over: 210,
};

function enTokenId(word: string): number | null {
    return word in EN_TOKEN_DICTIONARY ? EN_TOKEN_DICTIONARY[word] : null;
}

// כיווני דחיפה אנגליים, מקבילים ל-VECTOR_SHIFTS של המנוע. he מוגדר שווה ל-en כי הנתיב
// האנגלי מציג רק את שדה ה-en. dim שומר על צבע הממד.
const en = (label: string, dir: ShiftEntry['dir'], dim?: ShiftEntry['dim']): ShiftEntry =>
    dim ? { he: label, en: label, dir, dim } : { he: label, en: label, dir };

const EN_VECTOR_SHIFTS: Record<string, ShiftEntry[]> = {
    package: [en('Delivery', 'up-strong', 'delivery')],
    not: [en('Failure', 'up', 'failure'), en('Negation', 'up'), en('Delivery', 'up-slight', 'delivery')],
    arrive: [en('Delivery', 'up', 'delivery'), en('Arrival', 'up')],
    delivery: [en('Delivery', 'up-strong', 'delivery')],
    handed: [en('Delivery', 'up', 'delivery'), en('Delivery state', 'up')],
    system: [en('System', 'up-strong', 'system')],
    showing: [en('System', 'up', 'system'), en('Display', 'up')],
    Check: [en('Action', 'up-strong', 'action'), en('Investigation', 'up')],
    why: [en('Reason seeking', 'up')],
    Send: [en('Action', 'up-strong', 'action'), en('Risk', 'up', 'risk'), en('Approval', 'up', 'permission')],
    message: [en('Message', 'up'), en('Customer', 'up-slight', 'customer')],
    customer: [en('Customer', 'up-strong', 'customer'), en('Risk', 'up', 'risk'), en('Approval', 'up', 'permission')],
    lost: [en('Failure', 'up', 'failure'), en('Risk', 'up', 'risk')],
};

function enShift(word: string): ShiftEntry[] {
    return EN_VECTOR_SHIFTS[word] ?? [];
}

// בונה שלב אנגלי שמשתמש מחדש בפרופיל/lead/negation/agent.status של שלב המנוע המקביל,
// ומחליף רק את הטקסט והטוקנים (ואת טקסט ה-Agent אם קיים).
function enStep(
    base: EngineStep,
    over: { text: string; tokens: string[]; main: string; head?: string; det?: string },
): EngineStep {
    return {
        ...base,
        text: over.text,
        tokens: over.tokens,
        mainChangeHe: over.main,
        agent: base.agent
            ? { ...base.agent, headlineHe: over.head ?? base.agent.headlineHe, detailHe: over.det ?? base.agent.detailHe }
            : base.agent,
    };
}

const scOf = (id: string): EngineScenario => getScenario(id) ?? SCENARIOS[0];

const enScenario = (id: string, prompt: string, steps: EngineStep[]): EngineScenario => ({
    ...scOf(id),
    prompt,
    steps,
});

const EN_SCENARIOS: EngineScenario[] = [
    enScenario('chat-delivery', 'The package did not arrive', [
        enStep(scOf('chat-delivery').steps[0], {
            text: 'The package',
            tokens: ['The', 'package'],
            main: 'The word "package" pushes the Delivery dimension hard.',
        }),
        enStep(scOf('chat-delivery').steps[1], {
            text: 'The package did not',
            tokens: ['The', 'package', 'did', 'not'],
            main: 'The word "not" spikes Failure and Urgency.',
        }),
        enStep(scOf('chat-delivery').steps[2], {
            text: 'The package did not arrive',
            tokens: ['The', 'package', 'did', 'not', 'arrive'],
            main: '"did not arrive" locks in a delivery failure profile.',
        }),
    ]),
    enScenario('chat-system', 'The system is not showing the package', [
        enStep(scOf('chat-system').steps[0], {
            text: 'The system',
            tokens: ['The', 'system'],
            main: 'The word "system" shifts the weight to the System dimension.',
        }),
        enStep(scOf('chat-system').steps[1], {
            text: 'The system is not',
            tokens: ['The', 'system', 'is', 'not'],
            main: 'The word "not" adds Failure, but "system" still leads.',
        }),
        enStep(scOf('chat-system').steps[2], {
            text: 'The system is not showing the package',
            tokens: ['The', 'system', 'is', 'not', 'showing', 'the', 'package'],
            main: 'Same domain, different direction: the weight moves to a display glitch in the system.',
        }),
    ]),
    enScenario('agent-investigate', 'Check why the package did not arrive', [
        enStep(scOf('agent-investigate').steps[0], {
            text: 'Check',
            tokens: ['Check'],
            main: 'The word "check" lights up the Action dimension, low risk.',
            head: 'Action request detected',
            det: 'An action signal ("check") with low risk. Looks like an investigation, not a customer action.',
        }),
        enStep(scOf('agent-investigate').steps[1], {
            text: 'Check why the package',
            tokens: ['Check', 'why', 'the', 'package'],
            main: 'A domain is added: delivery. The risk stays low.',
            head: 'Goal: investigate the delivery domain',
            det: 'The profile points to an internal investigation. No customer contact, no risk.',
        }),
        enStep(scOf('agent-investigate').steps[2], {
            text: 'Check why the package did not arrive',
            tokens: ['Check', 'why', 'the', 'package', 'did', 'not', 'arrive'],
            main: 'Final profile: investigating a delivery failure, low risk.',
            head: 'Safe to investigate, needs a tracking number',
            det: 'Low risk and no customer action. Next step: use the status check tool and ask for a tracking number.',
        }),
    ]),
    enScenario('agent-notify', 'Send the customer a message that the package was lost', [
        enStep(scOf('agent-notify').steps[0], {
            text: 'Send',
            tokens: ['Send'],
            main: 'The word "send" lights up Action, and Risk and Approval start to climb.',
            head: 'Outgoing action detected',
            det: 'An action signal ("send"). Not clear to whom yet, but the risk starts to climb.',
        }),
        enStep(scOf('agent-notify').steps[1], {
            text: 'Send the customer a message',
            tokens: ['Send', 'the', 'customer', 'a', 'message'],
            main: 'The word "customer" spikes Customer, Risk and Approval.',
            head: 'Action toward a real customer',
            det: 'The profile points to direct customer contact. Risk and approval are high.',
        }),
        enStep(scOf('agent-notify').steps[2], {
            text: 'Send the customer a message that the package was lost',
            tokens: ['Send', 'the', 'customer', 'a', 'message', 'that', 'the', 'package', 'was', 'lost'],
            main: 'Final profile: high Risk and Approval. We must stop and ask for approval.',
            head: 'Stop, approval required',
            det: 'The same numeric profile separates a safe investigation from a risky customer action. Next step: stop and ask for human approval.',
        }),
    ]),
];

const EN_SIMILAR: SimilarPair = {
    left: {
        prompt: 'The package did not arrive',
        tokens: ['The', 'package', 'did', 'not', 'arrive'],
        profile: SIMILAR_PAIR.left.profile,
    },
    right: {
        prompt: 'The delivery was not handed over',
        tokens: ['The', 'delivery', 'was', 'not', 'handed', 'over'],
        profile: SIMILAR_PAIR.right.profile,
    },
    sharedDims: SIMILAR_PAIR.sharedDims,
};

export const EN_WORD_DATASET: WordLabDataset = {
    scenarios: EN_SCENARIOS,
    tokenId: enTokenId,
    shift: enShift,
    similar: EN_SIMILAR,
};

/* ── שכבת נתונים ספרדית מקבילה (משתמשת מחדש בפרופילים המספריים של המנוע) ── */

const ES_TOKEN_DICTIONARY: Record<string, number> = {
    El: 204, el: 9, paquete: 1042, no: 17, llegó: 883,
    sistema: 2310, muestra: 441,
    Revisa: 51, por: 90, qué: 88,
    Envía: 73, un: 12, mensaje: 612, al: 15, cliente: 1190, de: 20, que: 145, se: 30, perdió: 770,
    envío: 1057, fue: 61, entregado: 904,
};

function esTokenId(word: string): number | null {
    return word in ES_TOKEN_DICTIONARY ? ES_TOKEN_DICTIONARY[word] : null;
}

const ES_VECTOR_SHIFTS: Record<string, ShiftEntry[]> = {
    paquete: [en('Entrega', 'up-strong', 'delivery')],
    no: [en('Fallo', 'up', 'failure'), en('Negación', 'up'), en('Entrega', 'up-slight', 'delivery')],
    llegó: [en('Entrega', 'up', 'delivery'), en('Llegada', 'up')],
    envío: [en('Entrega', 'up-strong', 'delivery')],
    entregado: [en('Entrega', 'up', 'delivery'), en('Estado de entrega', 'up')],
    sistema: [en('Sistema', 'up-strong', 'system')],
    muestra: [en('Sistema', 'up', 'system'), en('Visualización', 'up')],
    Revisa: [en('Acción', 'up-strong', 'action'), en('Investigación', 'up')],
    qué: [en('Búsqueda de causa', 'up')],
    Envía: [en('Acción', 'up-strong', 'action'), en('Riesgo', 'up', 'risk'), en('Aprobación', 'up', 'permission')],
    mensaje: [en('Mensaje', 'up'), en('Cliente', 'up-slight', 'customer')],
    cliente: [en('Cliente', 'up-strong', 'customer'), en('Riesgo', 'up', 'risk'), en('Aprobación', 'up', 'permission')],
    perdió: [en('Fallo', 'up', 'failure'), en('Riesgo', 'up', 'risk')],
};

function esShift(word: string): ShiftEntry[] {
    return ES_VECTOR_SHIFTS[word] ?? [];
}

const esScenario = (id: string, prompt: string, steps: EngineStep[]): EngineScenario => ({
    ...scOf(id),
    labelEn: ES_SCENARIO_LABEL[id] ?? scOf(id).labelEn,
    prompt,
    steps,
});

const ES_SCENARIO_LABEL: Record<string, string> = {
    'chat-delivery': 'Sin entrega',
    'chat-system': 'Fallo del sistema',
    'agent-investigate': 'Investigación',
    'agent-notify': 'Acción con cliente',
};

const ES_SCENARIOS: EngineScenario[] = [
    esScenario('chat-delivery', 'El paquete no llegó', [
        enStep(scOf('chat-delivery').steps[0], {
            text: 'El paquete',
            tokens: ['El', 'paquete'],
            main: 'La palabra "paquete" empuja con fuerza la dimensión de Entrega.',
        }),
        enStep(scOf('chat-delivery').steps[1], {
            text: 'El paquete no',
            tokens: ['El', 'paquete', 'no'],
            main: 'La palabra "no" dispara Fallo y Urgencia.',
        }),
        enStep(scOf('chat-delivery').steps[2], {
            text: 'El paquete no llegó',
            tokens: ['El', 'paquete', 'no', 'llegó'],
            main: '"no llegó" fija un perfil de fallo de entrega.',
        }),
    ]),
    esScenario('chat-system', 'El sistema no muestra el paquete', [
        enStep(scOf('chat-system').steps[0], {
            text: 'El sistema',
            tokens: ['El', 'sistema'],
            main: 'La palabra "sistema" desplaza el peso a la dimensión de Sistema.',
        }),
        enStep(scOf('chat-system').steps[1], {
            text: 'El sistema no',
            tokens: ['El', 'sistema', 'no'],
            main: 'La palabra "no" añade Fallo, pero "sistema" sigue liderando.',
        }),
        enStep(scOf('chat-system').steps[2], {
            text: 'El sistema no muestra el paquete',
            tokens: ['El', 'sistema', 'no', 'muestra', 'el', 'paquete'],
            main: 'Mismo dominio, dirección distinta: el peso se mueve a un fallo de visualización en el sistema.',
        }),
    ]),
    esScenario('agent-investigate', 'Revisa por qué el paquete no llegó', [
        enStep(scOf('agent-investigate').steps[0], {
            text: 'Revisa',
            tokens: ['Revisa'],
            main: 'La palabra "revisa" enciende la dimensión de Acción, riesgo bajo.',
            head: 'Solicitud de acción detectada',
            det: 'Una señal de acción ("revisa") con riesgo bajo. Parece una investigación, no una acción hacia el cliente.',
        }),
        enStep(scOf('agent-investigate').steps[1], {
            text: 'Revisa por qué el paquete',
            tokens: ['Revisa', 'por', 'qué', 'el', 'paquete'],
            main: 'Se añade un dominio: entrega. El riesgo se mantiene bajo.',
            head: 'Objetivo: investigar el dominio de entrega',
            det: 'El perfil apunta a una investigación interna. Sin contacto con el cliente, sin riesgo.',
        }),
        enStep(scOf('agent-investigate').steps[2], {
            text: 'Revisa por qué el paquete no llegó',
            tokens: ['Revisa', 'por', 'qué', 'el', 'paquete', 'no', 'llegó'],
            main: 'Perfil final: investigar un fallo de entrega, riesgo bajo.',
            head: 'Seguro para investigar, necesita un número de seguimiento',
            det: 'Riesgo bajo y sin acción hacia el cliente. Siguiente paso: usar la herramienta de revisión de estado y pedir un número de seguimiento.',
        }),
    ]),
    esScenario('agent-notify', 'Envía un mensaje al cliente de que el paquete se perdió', [
        enStep(scOf('agent-notify').steps[0], {
            text: 'Envía',
            tokens: ['Envía'],
            main: 'La palabra "envía" enciende Acción, y Riesgo y Aprobación empiezan a subir.',
            head: 'Acción saliente detectada',
            det: 'Una señal de acción ("envía"). Aún no está claro a quién, pero el riesgo empieza a subir.',
        }),
        enStep(scOf('agent-notify').steps[1], {
            text: 'Envía un mensaje al cliente',
            tokens: ['Envía', 'un', 'mensaje', 'al', 'cliente'],
            main: 'La palabra "cliente" dispara Cliente, Riesgo y Aprobación.',
            head: 'Acción hacia un cliente real',
            det: 'El perfil apunta a un contacto directo con el cliente. Riesgo y aprobación altos.',
        }),
        enStep(scOf('agent-notify').steps[2], {
            text: 'Envía un mensaje al cliente de que el paquete se perdió',
            tokens: ['Envía', 'un', 'mensaje', 'al', 'cliente', 'de', 'que', 'el', 'paquete', 'se', 'perdió'],
            main: 'Perfil final: Riesgo y Aprobación altos. Hay que detenerse y pedir aprobación.',
            head: 'Detente, se requiere aprobación',
            det: 'El mismo perfil numérico separa una investigación segura de una acción arriesgada hacia el cliente. Siguiente paso: detenerse y pedir aprobación humana.',
        }),
    ]),
];

const ES_SIMILAR: SimilarPair = {
    left: {
        prompt: 'El paquete no llegó',
        tokens: ['El', 'paquete', 'no', 'llegó'],
        profile: SIMILAR_PAIR.left.profile,
    },
    right: {
        prompt: 'El envío no fue entregado',
        tokens: ['El', 'envío', 'no', 'fue', 'entregado'],
        profile: SIMILAR_PAIR.right.profile,
    },
    sharedDims: SIMILAR_PAIR.sharedDims,
};

export const ES_WORD_DATASET: WordLabDataset = {
    scenarios: ES_SCENARIOS,
    tokenId: esTokenId,
    shift: esShift,
    similar: ES_SIMILAR,
};

export function getWordDataset(locale: Locale): WordLabDataset {
    if (locale === 'he') return HE_WORD_DATASET;
    if (locale === 'es') return ES_WORD_DATASET;
    return EN_WORD_DATASET;
}

/* ════════════════════════ מחרוזות chrome לפי שפה ════════════════════════ */

export interface WordLabText {
    modeLabel: string;
    /** תוויות בורר המצב (Chat/Agent). מועברות ל-ModeToggle. */
    modeLabels: { chat: string; agent: string };
    scenarioLabel: string;
    typing: {
        suggested: string;
        typeSlow: string;
        placeholder: string;
        aria: string;
        autoType: string;
        autoTypeLatin: string;
        reset: string;
        resetLatin: string;
    };
    unrecognizedHint: string;
    mainChangeLabel: string;
    idSeq: {
        title: string;
        sub: string;
        words: string;
        ids: string;
        empty: string;
        pointsTo: string;
        addressNote: string;
        selectHint: string;
    };
    table: {
        title: string;
        sub: string;
        colWord: string;
        colId: string;
        note: string;
        fallbackTokens: string[];
    };
    vector: { title: string; sub: string; note: string };
    shift: { title: string; sub: string; idleHint: string; pushesUp: string; tiny: string; note: string };
    dirLabels: Record<ShiftEntry['dir'], string>;
    similar: { title: string; sub: string; aligns: string; overlap: (pct: number) => string; note: string };
    agent: { needsApproval: string; note: string };
    disclaimer: { lead: string; idIsAddress: string; idTail: string; dimsReadable: string; dimsTail: string };
    /** תוויות ממד מקומיות. אם חסר, נופלים ל-DIM_INFO (he/en) של המנוע. שפות שאינן he/en
     *  מספקות כאן את תוויות הממד שלהן (DIM_INFO מוגן ואינו משתנה). */
    dimLabel?: Partial<Record<DimKey, string>>;
}

export const HE_WORD_TEXT: WordLabText = {
    modeLabel: 'מצב:',
    modeLabels: { chat: 'Chat Mode', agent: 'Agent Mode' },
    scenarioLabel: 'תרחיש:',
    typing: {
        suggested: 'תרחיש מוצע:',
        typeSlow: 'Type it slowly',
        placeholder: 'הקלידו את המשפט המוצע, או לחצו "הקלידו עבורי"',
        aria: 'שדה הקלדה למעבדת המילים למספרים',
        autoType: 'הקלידו עבורי',
        autoTypeLatin: 'Auto type',
        reset: 'איפוס',
        resetLatin: 'Reset',
    },
    unrecognizedHint:
        'המעבדה מדגימה משפטים נבחרים מראש, היא לא מנתחת כל טקסט חופשי. כדי לראות את הפירוק למספרים, הקלידו את המשפט המוצע למעלה או לחצו "הקלידו עבורי".',
    mainChangeLabel: 'שינוי מוביל: ',
    idSeq: {
        title: 'רצף ה-IDs',
        sub: 'ID Sequence Viewer',
        words: 'מילים',
        ids: 'IDs',
        empty: 'התחילו להקליד (או לחצו "הקלידו עבורי"), והמשפט יהפוך לרצף מספרים.',
        pointsTo: 'points to',
        addressNote: '(כתובת במילון, לא משמעות)',
        selectHint:
            'לחצו על מילה כדי לראות לאיזה Token ID היא מצביעה. ה-ID הוא כתובת במילון, כמו ברקוד שאינו הטעם של המוצר.',
    },
    table: {
        title: 'לוח תרגום',
        sub: 'Human text to Model IDs',
        colWord: 'מילה / Token',
        colId: 'Token ID',
        note: 'כל מילה מצביעה על כתובת קבועה במילון. ה-ID הוא מזהה, לא משמעות.',
        fallbackTokens: ['החבילה', 'לא', 'הגיעה'],
    },
    vector: {
        title: 'וקטור המשמעות החי',
        sub: 'Meaning Vector Live',
        note: 'ערכים מנורמלים בין 0 ל-1. שימו לב איך המילה "לא" מקפיצה את הכשל ואת הדחיפות. זהו פרופיל המשמעות, נפרד מנוסחת הסכימה הלימודית.',
    },
    shift: {
        title: 'השפעת המילה',
        sub: 'Vector Shift by Word',
        idleHint: 'לחצו על מילה כדי לראות לאן היא דוחפת את הפרופיל.',
        pushesUp: 'דוחפת מעלה את הממדים:',
        tiny: 'תורמת מעט מאוד לפרופיל. עדיין הופכת ל-Token ID ונכנסת לחישוב.',
        note: 'כיוון השפעה, לא אריתמטיקה מדויקת. כל מילה תורמת משהו לפרופיל המספרי.',
    },
    dirLabels: { 'up-strong': 'עלייה חזקה', up: 'עלייה', 'up-slight': 'עלייה קלה' },
    similar: {
        title: 'כיוון דומה',
        sub: 'Similar Meaning Preview',
        aligns: 'Token IDs שונים, Meaning Vector מתיישר',
        overlap: (pct) => `~${pct}% direction overlap`,
        note: 'שני המשפטים לא חולקים אף Token ID (1042,17,883 מול 1057,17,904), אבל הם מצביעים לאותו כיוון משמעות. זו טעימה ויזואלית בלבד. את הגיאומטריה של הכיוון הזה נפתח בפרק הבא, ואת חישוב הדמיון המלא בפרק 8.',
    },
    agent: {
        needsApproval: 'Needs approval',
        note: 'אותו פרופיל מספרי מבדיל בין חקירה בטוחה לבין פעולה מסוכנת מול לקוח. ייצוג המשמעות לא רק עונה, הוא משפיע על החלטות פעולה.',
    },
    disclaimer: {
        lead: 'שתי הבהרות:',
        idIsAddress: 'Token ID הוא כתובת במילון, לא משמעות',
        idTail: '- המספר 1042 מצביע על המילה "החבילה", הוא לא "אומר" חבילה.',
        dimsReadable: "ממדי המשמעות (Delivery, Failure וכו') הם צירים קריאים שבחרנו ללמידה",
        dimsTail:
            '- בייצוגים אמיתיים הממדים אינם תוויות אנושיות אלא מאות או אלפי ממדים נלמדים שאינם קריאים לאדם. עדיין לא מחשבים כאן דמיון או הסתברות, רק בונים פרופיל שאפשר יהיה להשוות בפרקים הבאים.',
    },
};

export const EN_WORD_TEXT: WordLabText = {
    modeLabel: 'Mode:',
    modeLabels: { chat: 'Chat Mode', agent: 'Agent Mode' },
    scenarioLabel: 'Scenario:',
    typing: {
        suggested: 'Suggested scenario:',
        typeSlow: 'Type it slowly',
        placeholder: 'Type the suggested sentence, or click "Type it for me"',
        aria: 'Input field for the words to numbers lab',
        autoType: 'Type it for me',
        autoTypeLatin: 'Auto type',
        reset: 'Reset',
        resetLatin: 'Reset',
    },
    unrecognizedHint:
        'This lab demonstrates preset sentences, it does not analyze free text. To see the breakdown into numbers, type the suggested sentence above or click "Type it for me".',
    mainChangeLabel: 'Main change: ',
    idSeq: {
        title: 'The ID sequence',
        sub: 'ID Sequence Viewer',
        words: 'Words',
        ids: 'IDs',
        empty: 'Start typing (or click "Type it for me") and the sentence turns into a sequence of numbers.',
        pointsTo: 'points to',
        addressNote: '(an address in the vocabulary, not meaning)',
        selectHint:
            'Click a word to see which Token ID it points to. The ID is an address in the vocabulary, like a barcode that is not the taste of the product.',
    },
    table: {
        title: 'Translation table',
        sub: 'Human text to Model IDs',
        colWord: 'Word / Token',
        colId: 'Token ID',
        note: 'Every word points to a fixed address in the vocabulary. The ID is an identifier, not meaning.',
        fallbackTokens: ['The', 'package', 'did', 'not', 'arrive'],
    },
    vector: {
        title: 'The live meaning vector',
        sub: 'Meaning Vector Live',
        note: 'Values normalized between 0 and 1. Notice how the word "not" spikes Failure and Urgency. This is the meaning profile, separate from the teaching sum formula.',
    },
    shift: {
        title: 'Word impact',
        sub: 'Vector Shift by Word',
        idleHint: 'Click a word to see where it pushes the profile.',
        pushesUp: 'pushes these dimensions up:',
        tiny: 'Contributes very little to the profile. It still becomes a Token ID and enters the computation.',
        note: 'Direction of influence, not exact arithmetic. Every word contributes something to the numeric profile.',
    },
    dirLabels: { 'up-strong': 'Strong rise', up: 'Rise', 'up-slight': 'Slight rise' },
    similar: {
        title: 'Similar direction',
        sub: 'Similar Meaning Preview',
        aligns: 'Different Token IDs, the Meaning Vector aligns',
        overlap: (pct) => `~${pct}% direction overlap`,
        note: 'The two sentences share almost no Token IDs (204,1042,320,17,883 vs 204,1057,61,17,904,210), yet they point to the same meaning direction. This is a visual taste only. We open the geometry of this direction in the next chapter, and the full similarity computation in chapter 8.',
    },
    agent: {
        needsApproval: 'Needs approval',
        note: 'The same numeric profile separates a safe investigation from a risky customer action. The meaning representation does not only answer, it shapes action decisions.',
    },
    disclaimer: {
        lead: 'Two clarifications:',
        idIsAddress: 'A Token ID is an address in the vocabulary, not meaning',
        idTail: '- the number 1042 points to the word "package", it does not "say" package.',
        dimsReadable: 'The meaning dimensions (Delivery, Failure, etc.) are readable axes we chose for learning',
        dimsTail:
            '- in real representations the dimensions are not human labels but hundreds or thousands of learned dimensions that are not human-readable. We are not computing similarity or probability here yet, just building a profile we can compare in later chapters.',
    },
};

export const ES_WORD_TEXT: WordLabText = {
    modeLabel: 'Modo:',
    modeLabels: { chat: 'Modo chat', agent: 'Modo Agent' },
    scenarioLabel: 'Escenario:',
    typing: {
        suggested: 'Escenario sugerido:',
        typeSlow: 'Escríbelo despacio',
        placeholder: 'Escribe la frase sugerida, o pulsa "Escríbelo por mí"',
        aria: 'Campo de entrada para el laboratorio de palabras a números',
        autoType: 'Escríbelo por mí',
        autoTypeLatin: 'Automático',
        reset: 'Reiniciar',
        resetLatin: 'Reiniciar',
    },
    unrecognizedHint:
        'Este laboratorio demuestra frases predefinidas, no analiza texto libre. Para ver el desglose en números, escribe la frase sugerida arriba o pulsa "Escríbelo por mí".',
    mainChangeLabel: 'Cambio principal: ',
    idSeq: {
        title: 'La secuencia de IDs',
        sub: 'Visor de secuencia de IDs',
        words: 'Palabras',
        ids: 'IDs',
        empty: 'Empieza a escribir (o pulsa "Escríbelo por mí") y la frase se convierte en una secuencia de números.',
        pointsTo: 'apunta a',
        addressNote: '(una dirección en el vocabulario, no significado)',
        selectHint:
            'Pulsa una palabra para ver a qué Token ID apunta. El ID es una dirección en el vocabulario, como un código de barras que no es el sabor del producto.',
    },
    table: {
        title: 'Tabla de traducción',
        sub: 'Texto humano a IDs del modelo',
        colWord: 'Palabra / Token',
        colId: 'Token ID',
        note: 'Cada palabra apunta a una dirección fija en el vocabulario. El ID es un identificador, no significado.',
        fallbackTokens: ['El', 'paquete', 'no', 'llegó'],
    },
    vector: {
        title: 'El vector de significado en vivo',
        sub: 'Vector de significado en vivo',
        note: 'Valores normalizados entre 0 y 1. Fíjate cómo la palabra "no" dispara Fallo y Urgencia. Este es el perfil de significado, separado de la fórmula de suma didáctica.',
    },
    shift: {
        title: 'Impacto de la palabra',
        sub: 'Cambio del vector por palabra',
        idleHint: 'Pulsa una palabra para ver hacia dónde empuja el perfil.',
        pushesUp: 'empuja hacia arriba estas dimensiones:',
        tiny: 'Aporta muy poco al perfil. Aun así se convierte en un Token ID y entra en el cálculo.',
        note: 'Dirección de influencia, no aritmética exacta. Cada palabra aporta algo al perfil numérico.',
    },
    dirLabels: { 'up-strong': 'Subida fuerte', up: 'Subida', 'up-slight': 'Subida leve' },
    similar: {
        title: 'Dirección similar',
        sub: 'Vista previa de significado similar',
        aligns: 'Token IDs distintos, el vector de significado se alinea',
        overlap: (pct) => `~${pct}% de solapamiento de dirección`,
        note: 'Las dos frases casi no comparten Token IDs (204,1042,17,883 vs 204,1057,17,61,904), pero apuntan a la misma dirección de significado. Esto es solo una muestra visual. Abrimos la geometría de esta dirección en el próximo capítulo, y el cálculo completo de similitud en el capítulo 8.',
    },
    agent: {
        needsApproval: 'Requiere aprobación',
        note: 'El mismo perfil numérico separa una investigación segura de una acción arriesgada hacia el cliente. La representación de significado no solo responde, también moldea decisiones de acción.',
    },
    disclaimer: {
        lead: 'Dos aclaraciones:',
        idIsAddress: 'Un Token ID es una dirección en el vocabulario, no significado',
        idTail: '- el número 1042 apunta a la palabra "paquete", no "dice" paquete.',
        dimsReadable: 'Las dimensiones de significado (Entrega, Fallo, etc.) son ejes legibles que elegimos para aprender',
        dimsTail:
            '- en representaciones reales las dimensiones no son etiquetas humanas sino cientos o miles de dimensiones aprendidas que no son legibles para una persona. Aún no calculamos similitud ni probabilidad aquí, solo construimos un perfil que podremos comparar en capítulos posteriores.',
    },
    dimLabel: {
        delivery: 'Entrega',
        system: 'Sistema',
        address: 'Dirección',
        payment: 'Pago',
        urgency: 'Urgencia',
        failure: 'Fallo',
        action: 'Acción',
        risk: 'Riesgo',
        customer: 'Cliente',
        permission: 'Aprobación',
    },
};

export function getWordText(locale: Locale): WordLabText {
    if (locale === 'he') return HE_WORD_TEXT;
    if (locale === 'es') return ES_WORD_TEXT;
    return EN_WORD_TEXT;
}
