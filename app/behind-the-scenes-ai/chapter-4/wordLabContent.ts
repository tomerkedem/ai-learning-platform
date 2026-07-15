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
    type EngineScenario,
    type EngineStep,
} from './embeddingEngine';

/* ════════════════════════ נתונים: dataset לפי שפה ════════════════════════ */

export interface WordLabDataset {
    scenarios: EngineScenario[];
    tokenId: (w: string) => number | null;
}

/** הנתיב העברי: ישירות מהמנוע (ללא שינוי). */
export const HE_WORD_DATASET: WordLabDataset = {
    scenarios: SCENARIOS,
    tokenId: idForWord,
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

export const EN_WORD_DATASET: WordLabDataset = {
    scenarios: EN_SCENARIOS,
    tokenId: enTokenId,
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

export const ES_WORD_DATASET: WordLabDataset = {
    scenarios: ES_SCENARIOS,
    tokenId: esTokenId,
};

/* ── Параллельный русский слой данных (повторно использует числовые профили движка) ── */

const RU_TOKEN_DICTIONARY: Record<string, number> = {
    Посылка: 1042, посылка: 1045, посылку: 1043, не: 17, пришла: 883,
    Система: 2310, показывает: 441,
    Проверь: 51, почему: 88,
    Отправь: 73, клиенту: 1190, сообщение: 612, что: 145, потеряна: 770,
    Доставка: 1057, выполнена: 904,
};

function ruTokenId(word: string): number | null {
    return word in RU_TOKEN_DICTIONARY ? RU_TOKEN_DICTIONARY[word] : null;
}

const RU_SCENARIO_LABEL: Record<string, string> = {
    'chat-delivery': 'Не доставлено',
    'chat-system': 'Сбой системы',
    'agent-investigate': 'Расследование',
    'agent-notify': 'Письмо клиенту',
};

const ruScenario = (id: string, prompt: string, steps: EngineStep[]): EngineScenario => ({
    ...scOf(id),
    labelEn: RU_SCENARIO_LABEL[id] ?? scOf(id).labelEn,
    prompt,
    steps,
});

const RU_SCENARIOS: EngineScenario[] = [
    ruScenario('chat-delivery', 'Посылка не пришла', [
        enStep(scOf('chat-delivery').steps[0], {
            text: 'Посылка',
            tokens: ['Посылка'],
            main: 'Слово "Посылка" сильно поднимает измерение Доставка.',
        }),
        enStep(scOf('chat-delivery').steps[1], {
            text: 'Посылка не',
            tokens: ['Посылка', 'не'],
            main: 'Слово "не" резко поднимает Сбой и Срочность.',
        }),
        enStep(scOf('chat-delivery').steps[2], {
            text: 'Посылка не пришла',
            tokens: ['Посылка', 'не', 'пришла'],
            main: '"не пришла" закрепляет профиль сбоя доставки.',
        }),
    ]),
    ruScenario('chat-system', 'Система не показывает посылку', [
        enStep(scOf('chat-system').steps[0], {
            text: 'Система',
            tokens: ['Система'],
            main: 'Слово "Система" смещает вес к измерению Система.',
        }),
        enStep(scOf('chat-system').steps[1], {
            text: 'Система не',
            tokens: ['Система', 'не'],
            main: 'Слово "не" добавляет Сбой, но "Система" всё ещё ведёт.',
        }),
        enStep(scOf('chat-system').steps[2], {
            text: 'Система не показывает посылку',
            tokens: ['Система', 'не', 'показывает', 'посылку'],
            main: 'Та же область, другое направление: вес уходит к сбою отображения в системе.',
        }),
    ]),
    ruScenario('agent-investigate', 'Проверь, почему посылка не пришла', [
        enStep(scOf('agent-investigate').steps[0], {
            text: 'Проверь',
            tokens: ['Проверь'],
            main: 'Слово "проверь" зажигает измерение Действие, низкий риск.',
            head: 'Обнаружен запрос на действие',
            det: 'Сигнал действия ("проверь") с низким риском. Похоже на расследование, а не на действие с клиентом.',
        }),
        enStep(scOf('agent-investigate').steps[1], {
            text: 'Проверь, почему посылка',
            tokens: ['Проверь', 'почему', 'посылка'],
            main: 'Добавляется область: доставка. Риск остаётся низким.',
            head: 'Цель: расследовать область доставки',
            det: 'Профиль указывает на внутреннее расследование. Нет контакта с клиентом, нет риска.',
        }),
        enStep(scOf('agent-investigate').steps[2], {
            text: 'Проверь, почему посылка не пришла',
            tokens: ['Проверь', 'почему', 'посылка', 'не', 'пришла'],
            main: 'Итоговый профиль: расследование сбоя доставки, низкий риск.',
            head: 'Безопасно расследовать, нужен трек-номер',
            det: 'Низкий риск и нет действия с клиентом. Следующий шаг: использовать инструмент проверки статуса и запросить трек-номер.',
        }),
    ]),
    ruScenario('agent-notify', 'Отправь клиенту сообщение, что посылка потеряна', [
        enStep(scOf('agent-notify').steps[0], {
            text: 'Отправь',
            tokens: ['Отправь'],
            main: 'Слово "отправь" зажигает Действие, а Риск и Одобрение начинают расти.',
            head: 'Обнаружено исходящее действие',
            det: 'Сигнал действия ("отправь"). Пока неясно кому, но риск начинает расти.',
        }),
        enStep(scOf('agent-notify').steps[1], {
            text: 'Отправь клиенту сообщение',
            tokens: ['Отправь', 'клиенту', 'сообщение'],
            main: 'Слово "клиенту" резко поднимает Клиент, Риск и Одобрение.',
            head: 'Действие с реальным клиентом',
            det: 'Профиль указывает на прямой контакт с клиентом. Риск и одобрение высокие.',
        }),
        enStep(scOf('agent-notify').steps[2], {
            text: 'Отправь клиенту сообщение, что посылка потеряна',
            tokens: ['Отправь', 'клиенту', 'сообщение', 'что', 'посылка', 'потеряна'],
            main: 'Итоговый профиль: высокие Риск и Одобрение. Нужно остановиться и запросить одобрение.',
            head: 'Остановиться, нужно одобрение',
            det: 'Тот же числовой профиль отличает безопасное расследование от рискованного действия с клиентом. Следующий шаг: остановиться и запросить одобрение человека.',
        }),
    ]),
];

export const RU_WORD_DATASET: WordLabDataset = {
    scenarios: RU_SCENARIOS,
    tokenId: ruTokenId,
};

/* ── طبقة بيانات عربية موازية (تعيد استخدام الملفات الرقمية للمحرّك) ── */

const AR_TOKEN_DICTIONARY: Record<string, number> = {
    // "لا" = 17 ثابت في الفصل كله (guess و Lab 1 والشرح). صيغة النفي الأخرى "لم" توكن مختلف،
    // فلها معرّف مختلف (18). الخلط بينهما يناقض ما يتعلّمه المستخدم.
    الطرد: 1042, لم: 18, يصل: 883, لا: 17, يعرض: 441,
    النظام: 2310, تحقّق: 51, لماذا: 88,
    أرسل: 73, للعميل: 1190, رسالة: 612, بأن: 145, ضاع: 770,
    الشحنة: 1057, 'تُسلَّم': 904,
};

function arTokenId(word: string): number | null {
    return word in AR_TOKEN_DICTIONARY ? AR_TOKEN_DICTIONARY[word] : null;
}

const AR_SCENARIO_LABEL: Record<string, string> = {
    'chat-delivery': 'لم يُسلَّم',
    'chat-system': 'خلل النظام',
    'agent-investigate': 'تحقيق',
    'agent-notify': 'رسالة للعميل',
};

const arScenario = (id: string, prompt: string, steps: EngineStep[]): EngineScenario => ({
    ...scOf(id),
    labelEn: AR_SCENARIO_LABEL[id] ?? scOf(id).labelEn,
    prompt,
    steps,
});

const AR_SCENARIOS: EngineScenario[] = [
    arScenario('chat-delivery', 'الطرد لم يصل', [
        enStep(scOf('chat-delivery').steps[0], {
            text: 'الطرد',
            tokens: ['الطرد'],
            main: 'كلمة "الطرد" تدفع بقوة بُعد التسليم.',
        }),
        enStep(scOf('chat-delivery').steps[1], {
            text: 'الطرد لم',
            tokens: ['الطرد', 'لم'],
            main: 'كلمة "لم" ترفع الفشل والإلحاح.',
        }),
        enStep(scOf('chat-delivery').steps[2], {
            text: 'الطرد لم يصل',
            tokens: ['الطرد', 'لم', 'يصل'],
            main: '"لم يصل" يثبّت ملف فشل التسليم.',
        }),
    ]),
    arScenario('chat-system', 'النظام لا يعرض الطرد', [
        enStep(scOf('chat-system').steps[0], {
            text: 'النظام',
            tokens: ['النظام'],
            main: 'كلمة "النظام" تنقل الثقل إلى بُعد النظام.',
        }),
        enStep(scOf('chat-system').steps[1], {
            text: 'النظام لا',
            tokens: ['النظام', 'لا'],
            main: 'كلمة "لا" تضيف الفشل، لكن "النظام" ما زال يقود.',
        }),
        enStep(scOf('chat-system').steps[2], {
            text: 'النظام لا يعرض الطرد',
            tokens: ['النظام', 'لا', 'يعرض', 'الطرد'],
            main: 'المجال نفسه، اتجاه آخر: ينتقل الثقل إلى خلل عرض في النظام.',
        }),
    ]),
    arScenario('agent-investigate', 'تحقّق لماذا لم يصل الطرد', [
        enStep(scOf('agent-investigate').steps[0], {
            text: 'تحقّق',
            tokens: ['تحقّق'],
            main: 'كلمة "تحقّق" تُضيء بُعد الإجراء، مخاطرة منخفضة.',
            head: 'تم رصد طلب إجراء',
            det: 'إشارة إجراء ("تحقّق") بمخاطرة منخفضة. يبدو كتحقيق، لا كإجراء تجاه العميل.',
        }),
        enStep(scOf('agent-investigate').steps[1], {
            text: 'تحقّق لماذا لم يصل',
            tokens: ['تحقّق', 'لماذا', 'لم', 'يصل'],
            main: 'يُضاف مجال: التسليم. تبقى المخاطرة منخفضة.',
            head: 'الهدف: التحقيق في مجال التسليم',
            det: 'الملف يشير إلى تحقيق داخلي. لا تواصل مع العميل، لا مخاطرة.',
        }),
        enStep(scOf('agent-investigate').steps[2], {
            text: 'تحقّق لماذا لم يصل الطرد',
            tokens: ['تحقّق', 'لماذا', 'لم', 'يصل', 'الطرد'],
            main: 'الملف النهائي: التحقيق في فشل تسليم، مخاطرة منخفضة.',
            head: 'آمن للتحقيق، يلزم رقم تتبّع',
            det: 'مخاطرة منخفضة ولا إجراء تجاه العميل. الخطوة التالية: استخدام أداة فحص الحالة وطلب رقم تتبّع.',
        }),
    ]),
    arScenario('agent-notify', 'أرسل للعميل رسالة بأن الطرد ضاع', [
        enStep(scOf('agent-notify').steps[0], {
            text: 'أرسل',
            tokens: ['أرسل'],
            main: 'كلمة "أرسل" تُضيء الإجراء، وتبدأ المخاطرة والموافقة بالارتفاع.',
            head: 'تم رصد إجراء صادر',
            det: 'إشارة إجراء ("أرسل"). غير واضح بعد إلى من، لكن المخاطرة تبدأ بالارتفاع.',
        }),
        enStep(scOf('agent-notify').steps[1], {
            text: 'أرسل للعميل رسالة',
            tokens: ['أرسل', 'للعميل', 'رسالة'],
            main: 'كلمة "للعميل" ترفع بقوة العميل والمخاطرة والموافقة.',
            head: 'إجراء تجاه عميل حقيقي',
            det: 'الملف يشير إلى تواصل مباشر مع العميل. المخاطرة والموافقة مرتفعتان.',
        }),
        enStep(scOf('agent-notify').steps[2], {
            text: 'أرسل للعميل رسالة بأن الطرد ضاع',
            tokens: ['أرسل', 'للعميل', 'رسالة', 'بأن', 'الطرد', 'ضاع'],
            main: 'الملف النهائي: مخاطرة وموافقة مرتفعتان. يجب التوقف وطلب الموافقة.',
            head: 'توقّف، يلزم موافقة',
            det: 'الملف الرقمي نفسه يميّز بين تحقيق آمن وإجراء محفوف بالمخاطر تجاه العميل. الخطوة التالية: التوقف وطلب موافقة بشرية.',
        }),
    ]),
];

export const AR_WORD_DATASET: WordLabDataset = {
    scenarios: AR_SCENARIOS,
    tokenId: arTokenId,
};

/* ── 並行する日本語データ層（エンジンの数値プロファイルを再利用） ── */
// 日本語には単語間の空白がないため、トークンは手作業の明示的な意味のまとまり。
// 各 step.text はプロンプトの接頭辞（自動入力中に prefix で一致する）。

const JA_TOKEN_DICTIONARY: Record<string, number> = {
    // 「ない」= 17 はチャプター全体（guess・Lab 1・解説）で固定されたアンカー。もう一つの
    // 否定形「なかった」は別トークンなので別 ID（18）。両者を取り違えると学習内容と矛盾する。
    荷物: 1042, が: 15, 届か: 883, なかった: 18,
    システム: 2310, を: 9, 表示し: 441, ない: 17,
    調べて: 51, '、': 5, なぜ: 88, か: 90,
    連絡して: 73, 顧客: 1190, に: 12, 紛失し: 770, た: 61, と: 145,
    配送: 1057, 完了し: 904,
};

function jaTokenId(word: string): number | null {
    return word in JA_TOKEN_DICTIONARY ? JA_TOKEN_DICTIONARY[word] : null;
}

const JA_SCENARIO_LABEL: Record<string, string> = {
    'chat-delivery': '未配達',
    'chat-system': 'システム不具合',
    'agent-investigate': '調査',
    'agent-notify': '顧客への連絡',
};

const jaScenario = (id: string, prompt: string, steps: EngineStep[]): EngineScenario => ({
    ...scOf(id),
    labelEn: JA_SCENARIO_LABEL[id] ?? scOf(id).labelEn,
    prompt,
    steps,
});

const JA_SCENARIOS: EngineScenario[] = [
    jaScenario('chat-delivery', '荷物が届かなかった', [
        enStep(scOf('chat-delivery').steps[0], {
            text: '荷物',
            tokens: ['荷物'],
            main: '「荷物」が配送の次元を強く押し上げます。',
        }),
        enStep(scOf('chat-delivery').steps[1], {
            text: '荷物が届か',
            tokens: ['荷物', 'が', '届か'],
            main: '語幹「届か」が現れ、否定の気配で失敗と緊急度が上がり始めます。',
        }),
        enStep(scOf('chat-delivery').steps[2], {
            text: '荷物が届かなかった',
            tokens: ['荷物', 'が', '届か', 'なかった'],
            main: '「なかった」で否定が確定し、配送失敗のプロファイルが固まります。',
        }),
    ]),
    jaScenario('chat-system', 'システムが荷物を表示しない', [
        enStep(scOf('chat-system').steps[0], {
            text: 'システム',
            tokens: ['システム'],
            main: '「システム」が重心をシステムの次元へ移します。',
        }),
        enStep(scOf('chat-system').steps[1], {
            text: 'システムが荷物を表示し',
            tokens: ['システム', 'が', '荷物', 'を', '表示し'],
            main: '語幹「表示し」が現れ、否定の気配で失敗が少し上がります。ただし「システム」が主導。',
        }),
        enStep(scOf('chat-system').steps[2], {
            text: 'システムが荷物を表示しない',
            tokens: ['システム', 'が', '荷物', 'を', '表示し', 'ない'],
            main: '同じ領域でも方向が違い、重心はシステムの表示不具合へ移ります。',
        }),
    ]),
    jaScenario('agent-investigate', '調べて、なぜ荷物が届かなかったか', [
        enStep(scOf('agent-investigate').steps[0], {
            text: '調べて',
            tokens: ['調べて'],
            main: '「調べて」が行動の次元を点灯。リスクは低い。',
            head: '行動の要求を検出',
            det: '行動のシグナル（「調べて」）、リスクは低い。顧客への行動ではなく調査に見えます。',
        }),
        enStep(scOf('agent-investigate').steps[1], {
            text: '調べて、なぜ荷物が届か',
            tokens: ['調べて', '、', 'なぜ', '荷物', 'が', '届か'],
            main: '配送の領域が加わる。リスクは低いまま。',
            head: '目的: 配送の領域を調査',
            det: 'プロファイルは内部の調査を示します。顧客との接触なし、リスクなし。',
        }),
        enStep(scOf('agent-investigate').steps[2], {
            text: '調べて、なぜ荷物が届かなかったか',
            tokens: ['調べて', '、', 'なぜ', '荷物', 'が', '届か', 'なかった', 'か'],
            main: '最終プロファイル: 配送失敗の調査、リスクは低い。',
            head: '調査は安全、追跡番号が必要',
            det: 'リスクは低く顧客への行動なし。次の一歩: 状態確認ツールを使い、追跡番号を求める。',
        }),
    ]),
    jaScenario('agent-notify', '連絡して、顧客に、荷物が紛失したと', [
        enStep(scOf('agent-notify').steps[0], {
            text: '連絡して',
            tokens: ['連絡して'],
            main: '「連絡して」が行動を点灯し、リスクと承認が上がり始めます。',
            head: '送信アクションを検出',
            det: '行動のシグナル（「連絡して」）。相手はまだ不明だが、リスクが上がり始めます。',
        }),
        enStep(scOf('agent-notify').steps[1], {
            text: '連絡して、顧客に',
            tokens: ['連絡して', '、', '顧客', 'に'],
            main: '「顧客」が顧客・リスク・承認を強く押し上げます。',
            head: '実在の顧客への行動',
            det: 'プロファイルは顧客への直接連絡を示します。リスクと承認が高い。',
        }),
        enStep(scOf('agent-notify').steps[2], {
            text: '連絡して、顧客に、荷物が紛失したと',
            tokens: ['連絡して', '、', '顧客', 'に', '、', '荷物', 'が', '紛失し', 'た', 'と'],
            main: '最終プロファイル: リスクと承認が高い。停止して承認を求めるべき。',
            head: '停止、承認が必要',
            det: '同じ数値プロファイルが、安全な調査と顧客へのリスクの高い行動を区別します。次の一歩: 停止して人間の承認を求める。',
        }),
    ]),
];

export const JA_WORD_DATASET: WordLabDataset = {
    scenarios: JA_SCENARIOS,
    tokenId: jaTokenId,
};

export function getWordDataset(locale: Locale): WordLabDataset {
    if (locale === 'he') return HE_WORD_DATASET;
    if (locale === 'es') return ES_WORD_DATASET;
    if (locale === 'ru') return RU_WORD_DATASET;
    if (locale === 'ar') return AR_WORD_DATASET;
    if (locale === 'ja') return JA_WORD_DATASET;
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
    idSeq: {
        title: string;
        sub: string;
        words: string;
        ids: string;
        empty: string;
        pointsTo: string;
        addressNote: string;
        /** רמז תפעולי תלוי-מצב: מילים -> "לחצו על מילה", IDs -> "לחצו על Token ID".
         *  קצר ותפעולי בלבד. הרעיון (כתובת, שורה בטבלה) כבר בהסבר של שלב 2 וב-addressNote. */
        selectHintWords: string;
        selectHintIds: string;
        /** הכרזת בחירת טוקן לקורא מסך: יחס השורה בטבלה. משלים "טוקן, Token ID" ל-liveMessage. */
        rowAria: string;
    };
    agent: { needsApproval: string; note: string };
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
        autoType: 'נגן וצפו',
        autoTypeLatin: 'Play',
        reset: 'איפוס',
        resetLatin: 'Reset',
    },
    unrecognizedHint:
        'המעבדה מדגימה משפטים נבחרים מראש, היא לא מנתחת כל טקסט חופשי. כדי לראות את הפירוק למספרים, הקלידו את המשפט המוצע למעלה או לחצו "הקלידו עבורי".',
    idSeq: {
        title: 'רצף ה-IDs',
        sub: 'ID Sequence Viewer',
        words: 'מילים',
        ids: 'IDs',
        empty: 'התחילו להקליד (או לחצו "הקלידו עבורי"), והמשפט יהפוך לרצף מספרים.',
        pointsTo: 'points to',
        addressNote: '(כתובת במילון, לא משמעות)',
        selectHintWords: 'לחצו על מילה כדי לראות את ה-Token ID שלה.',
        selectHintIds: 'לחצו על Token ID כדי לראות על איזו מילה הוא מצביע.',
        rowAria: 'הוא מצביע על השורה המתאימה בטבלת ה-embedding.',
    },
    agent: {
        needsApproval: 'Needs approval',
        note: 'אותו פרופיל מספרי מבדיל בין חקירה בטוחה לבין פעולה מסוכנת מול לקוח. ייצוג המשמעות לא רק עונה, הוא משפיע על החלטות פעולה.',
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
        autoType: 'Play it',
        autoTypeLatin: 'Play',
        reset: 'Reset',
        resetLatin: 'Reset',
    },
    unrecognizedHint:
        'This lab demonstrates preset sentences, it does not analyze free text. To see the breakdown into numbers, type the suggested sentence above or click "Type it for me".',
    idSeq: {
        title: 'The ID sequence',
        sub: 'ID Sequence Viewer',
        words: 'Words',
        ids: 'IDs',
        empty: 'Start typing (or click "Type it for me") and the sentence turns into a sequence of numbers.',
        pointsTo: 'points to',
        addressNote: '(an address in the vocabulary, not meaning)',
        selectHintWords: 'Click a word to see its Token ID.',
        selectHintIds: 'Click a Token ID to see which word it points to.',
        rowAria: 'It points to the matching row in the embedding table.',
    },
    agent: {
        needsApproval: 'Needs approval',
        note: 'The same numeric profile separates a safe investigation from a risky customer action. The meaning representation does not only answer, it shapes action decisions.',
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
        autoType: 'Reprodúcelo',
        autoTypeLatin: 'Play',
        reset: 'Reiniciar',
        resetLatin: 'Reiniciar',
    },
    unrecognizedHint:
        'Este laboratorio demuestra frases predefinidas, no analiza texto libre. Para ver el desglose en números, escribe la frase sugerida arriba o pulsa "Escríbelo por mí".',
    idSeq: {
        title: 'La secuencia de IDs',
        sub: 'Visor de secuencia de IDs',
        words: 'Palabras',
        ids: 'IDs',
        empty: 'Empieza a escribir (o pulsa "Escríbelo por mí") y la frase se convierte en una secuencia de números.',
        pointsTo: 'apunta a',
        addressNote: '(una dirección en el vocabulario, no significado)',
        selectHintWords: 'Pulsa una palabra para ver su Token ID.',
        selectHintIds: 'Pulsa un Token ID para ver a qué palabra apunta.',
        rowAria: 'Apunta a la fila correspondiente en la tabla de embeddings.',
    },
    agent: {
        needsApproval: 'Requiere aprobación',
        note: 'El mismo perfil numérico separa una investigación segura de una acción arriesgada hacia el cliente. La representación de significado no solo responde, también moldea decisiones de acción.',
    },
};

export const RU_WORD_TEXT: WordLabText = {
    modeLabel: 'Режим:',
    modeLabels: { chat: 'Режим чата', agent: 'Режим Agent' },
    scenarioLabel: 'Сценарий:',
    typing: {
        suggested: 'Предлагаемый сценарий:',
        typeSlow: 'Печатайте медленно',
        placeholder: 'Введите предложенную фразу или нажмите "Напечатать за меня"',
        aria: 'Поле ввода для лаборатории слов в числа',
        autoType: 'Воспроизвести',
        autoTypeLatin: 'Play',
        reset: 'Сброс',
        resetLatin: 'Сброс',
    },
    unrecognizedHint:
        'Эта лаборатория показывает заранее заданные фразы, она не анализирует произвольный текст. Чтобы увидеть разбиение на числа, введите предложенную фразу выше или нажмите "Напечатать за меня".',
    idSeq: {
        title: 'Последовательность ID',
        sub: 'Просмотр последовательности ID',
        words: 'Слова',
        ids: 'IDs',
        empty: 'Начните печатать (или нажмите "Напечатать за меня"), и фраза превратится в последовательность чисел.',
        pointsTo: 'указывает на',
        addressNote: '(адрес в словаре, не смысл)',
        selectHintWords: 'Нажмите на слово, чтобы увидеть его Token ID.',
        selectHintIds: 'Нажмите на Token ID, чтобы увидеть, на какое слово он указывает.',
        rowAria: 'Он указывает на соответствующую строку в таблице embedding.',
    },
    agent: {
        needsApproval: 'Нужно одобрение',
        note: 'Тот же числовой профиль отличает безопасное расследование от рискованного действия с клиентом. Представление смысла не только отвечает, оно влияет на решения о действиях.',
    },
};

export const AR_WORD_TEXT: WordLabText = {
    modeLabel: 'الوضع:',
    modeLabels: { chat: 'وضع المحادثة', agent: 'وضع Agent' },
    scenarioLabel: 'السيناريو:',
    typing: {
        suggested: 'السيناريو المقترح:',
        typeSlow: 'اكتب ببطء',
        placeholder: 'اكتب الجملة المقترحة، أو اضغط "اكتب نيابةً عني"',
        aria: 'حقل إدخال لمختبر الكلمات إلى الأرقام',
        autoType: 'شغّله',
        autoTypeLatin: 'Play',
        reset: 'إعادة',
        resetLatin: 'إعادة',
    },
    unrecognizedHint:
        'يعرض هذا المختبر جملًا محدّدة مسبقًا، ولا يحلّل نصًا حرًا. لرؤية التقسيم إلى أرقام، اكتب الجملة المقترحة أعلاه أو اضغط "اكتب نيابةً عني".',
    idSeq: {
        title: 'تسلسل الـ IDs',
        sub: 'عارض تسلسل الـ IDs',
        words: 'كلمات',
        ids: 'IDs',
        empty: 'ابدأ الكتابة (أو اضغط "اكتب نيابةً عني")، وتتحوّل الجملة إلى تسلسل أرقام.',
        pointsTo: 'يشير إلى',
        addressNote: '(عنوان في القاموس، لا معنى)',
        selectHintWords: 'اضغط على كلمة لترى الـ Token ID الخاص بها.',
        selectHintIds: 'اضغط على Token ID لترى إلى أي كلمة يشير.',
        rowAria: 'يشير إلى الصف المقابل في جدول الـ embedding.',
    },
    agent: {
        needsApproval: 'يلزم موافقة',
        note: 'الملف الرقمي نفسه يميّز بين تحقيق آمن وإجراء محفوف بالمخاطر تجاه العميل. تمثيل المعنى لا يجيب فقط، بل يؤثّر على قرارات الإجراء.',
    },
};

export const JA_WORD_TEXT: WordLabText = {
    modeLabel: 'モード：',
    modeLabels: { chat: 'チャットモード', agent: 'Agentモード' },
    scenarioLabel: 'シナリオ：',
    typing: {
        suggested: '推奨シナリオ：',
        typeSlow: 'ゆっくり入力',
        placeholder: '推奨の文を入力するか、「自動入力」を押してください',
        aria: '単語から数値へのラボの入力欄',
        autoType: '再生',
        autoTypeLatin: 'Play',
        reset: 'リセット',
        resetLatin: 'リセット',
    },
    unrecognizedHint:
        'このラボはあらかじめ用意した文を示します。自由なテキストは解析しません。数値への分解を見るには、上の推奨の文を入力するか「自動入力」を押してください。',
    idSeq: {
        title: 'IDの並び',
        sub: 'IDシーケンス表示',
        words: '単語',
        ids: 'IDs',
        empty: '入力を始めると（または「自動入力」を押すと）、文が数値の並びに変わります。',
        pointsTo: 'が指す語：',
        addressNote: '（辞書内のアドレス、意味ではない）',
        selectHintWords: '単語を押すと、その Token ID が分かります。',
        selectHintIds: 'Token ID を押すと、それがどの単語を指すか分かります。',
        rowAria: 'それは embedding テーブルの該当する行を指します。',
    },
    agent: {
        needsApproval: '承認が必要',
        note: '同じ数値プロファイルが、安全な調査と顧客へのリスクの高い行動を区別します。意味の表現は答えるだけでなく、行動の判断にも影響します。',
    },
};

export function getWordText(locale: Locale): WordLabText {
    if (locale === 'he') return HE_WORD_TEXT;
    if (locale === 'es') return ES_WORD_TEXT;
    if (locale === 'ru') return RU_WORD_TEXT;
    if (locale === 'ar') return AR_WORD_TEXT;
    if (locale === 'ja') return JA_WORD_TEXT;
    return EN_WORD_TEXT;
}
