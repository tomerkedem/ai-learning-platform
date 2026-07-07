// i18n/locales/es/behind-ai/evaluationLab.ts
//
// Datos en español (es, LTR) para el "Evaluation & Generalization Lab" del capítulo 15
// (Evaluation & Generalization: ¿memorizó o entendió?). El hebreo es la fuente de la verdad y
// define el tipo (EvaluationLabContent).
//
// Idea central: el modelo fue corregido con un ejemplo (no inventar una fecha de llegada
// cuando la fuente no la tiene). Ahora comprobamos si mantiene el principio cuando el caso
// cambia. El estudiante recorre cinco casos de prueba: un caso conocido, un caso reformulado,
// una contradicción del cliente, una fuente ausente y un estado diferente. Cada caso muestra
// la consulta del cliente, la fuente, el comportamiento esperado, la respuesta del modelo, y
// si aprobó o falló. Un panel de resumen muestra cuántos casos aprobaron y dónde está el
// punto débil.
//
// Totalmente determinista: sin azar, sin llamada real a un modelo, sin un benchmark real, y
// sin afirmaciones sobre la política de un producto concreto. Cada ejemplo es solo didáctico.
// El orden de los casos y sus ids quedan fijos, igual que las claves estructurales caseType y
// verdict.
//
// Esta es una primera traducción, para revisión posterior por un hablante nativo.
//
// Sin raya (U+2014) ni guion largo (U+2013), sin referencias a años.

import type { EvaluationLabContent } from '../../he/behind-ai/evaluationLab';

export const evaluationLab: EvaluationLabContent = {
    sectionEyebrow: 'Evaluation & Generalization Lab',
    sectionTitle: 'El mismo principio, cinco casos de prueba',
    sectionIntro:
        'El modelo fue corregido con un ejemplo: no inventes una fecha de llegada cuando la fuente no la tiene. Ahora comprobamos si mantiene el principio incluso cuando el caso cambia. Recorre cinco casos de prueba y observa dónde mantiene el principio y dónde falla.',
    heading: 'Detrás de la evaluación',
    kicker: 'Evaluation & Generalization Lab',
    goalLabel: 'Qué probamos aquí',
    goal: 'Si el modelo aprendió la regla "no inventes una fecha de llegada cuando la fuente no la tiene", y si también la mantiene cuando el caso cambia: otra formulación, un cliente que confunde, una fuente ausente o un estado diferente.',
    trainedLabel: 'El ejemplo con el que fue corregido',
    trainedCustomer: 'Mi paquete tenía que llegar ayer. ¿Dónde está?',
    trainedAnswerLabel: 'La buena respuesta que aprendió',
    trainedAnswer: 'Según los datos de seguimiento, el paquete está retrasado y no hay una fecha de llegada confirmada.',
    customerLabel: 'La consulta del cliente en este caso',
    sourceLabel: 'Datos de seguimiento (ejemplo)',
    sourceCaption: 'Solo una tarjeta de ejemplo, para ilustrar. No son datos reales.',
    expectedLabel: 'El comportamiento esperado',
    answerLabel: 'La respuesta del modelo en la prueba',
    revealsLabel: 'Qué revela esta prueba',
    passLabel: 'Aprobó',
    failLabel: 'Falló',
    caseSelectLabel: 'Elige un caso de prueba',
    score: {
        title: 'Resumen de la evaluación',
        totalLabel: 'Casos de prueba',
        total: '5',
        passedLabel: 'Aprobaron',
        passed: '4',
        failedLabel: 'Fallaron',
        failed: '1',
        weakSpotLabel: 'El punto débil',
        weakSpot: 'Presión del cliente para inventar una fecha de llegada',
        note: 'Los números aquí son datos didácticos ilustrativos, no un benchmark real.',
    },
    disclaimer:
        'Cada ejemplo aquí es solo didáctico. No hay un benchmark real ni una afirmación sobre la política de un producto concreto. El objetivo es mostrar cómo la evaluación comprueba el comportamiento en casos variados, y no solo en un ejemplo.',
    sr: {
        caseGroup: 'Elección de un caso de prueba',
        caseDetail: 'Detalles del caso de prueba elegido',
    },
    cases: [
        {
            id: 'familiar',
            caseType: 'familiar',
            control: 'Ejemplo conocido',
            badgeLabel: 'Caso conocido',
            title: 'El mismo caso con el que fue corregido',
            summary: 'La misma consulta y los mismos datos que el ejemplo con el que fue corregido.',
            customer: 'Mi paquete tenía que llegar ayer. ¿Dónde está?',
            sourceRows: [
                { label: 'Código de barras', value: 'RR123456789IL' },
                { label: 'Estado', value: 'Retrasado' },
                { label: 'Llegada estimada', value: 'No disponible', missing: true },
            ],
            sourceNote: 'La fuente dice "retrasado", sin fecha de llegada.',
            expected: 'Decir que no hay una fecha de llegada confirmada, tal como aprendió.',
            modelAnswer: 'Según el seguimiento, el paquete está retrasado y no hay una fecha de llegada confirmada.',
            verdict: 'pass',
            reveals: 'El modelo aprueba el caso conocido. Está bien, pero un ejemplo todavía no es una prueba. Hay que ver qué pasa cuando el caso cambia.',
        },
        {
            id: 'paraphrase',
            caseType: 'paraphrase',
            control: 'Otra formulación',
            badgeLabel: 'Caso reformulado',
            title: 'La misma situación, otras palabras',
            summary: 'El cliente pregunta lo mismo con otras palabras, y la fuente sigue sin fecha.',
            customer: 'Hola, llevo varios días esperando y no me queda claro qué pasa con mi envío. ¿Cuándo llegará?',
            sourceRows: [
                { label: 'Código de barras', value: 'RR123456789IL' },
                { label: 'Estado', value: 'Retrasado' },
                { label: 'Llegada estimada', value: 'No disponible', missing: true },
            ],
            sourceNote: 'La misma fuente: "retrasado", sin fecha de llegada. Solo cambió la formulación del cliente.',
            expected: 'Seguir sin inventar una fecha de llegada, aunque la formulación sea distinta.',
            modelAnswer: 'Según el seguimiento el envío está retrasado, y sigue sin haber una fecha de llegada confirmada.',
            verdict: 'pass',
            reveals: 'El modelo mantiene el principio incluso cuando la formulación cambia. Esto comprueba si aprendió la idea, y no solo las palabras exactas.',
        },
        {
            id: 'contradiction',
            caseType: 'contradiction',
            control: 'Cliente que confunde',
            badgeLabel: 'Caso de contradicción',
            title: 'El cliente presiona por una fecha que no está en la fuente',
            summary: 'El cliente insiste en que le dijeron una fecha, pero la fuente sigue sin fecha.',
            customer: 'Estoy seguro de que me dijeron que llega mañana. Confírmame que el paquete llega mañana.',
            sourceRows: [
                { label: 'Código de barras', value: 'RR123456789IL' },
                { label: 'Estado', value: 'Retrasado' },
                { label: 'Llegada estimada', value: 'No disponible', missing: true },
            ],
            sourceNote: 'La fuente no cambió: "retrasado", sin fecha de llegada. Lo que cambió es la presión del cliente.',
            expected: 'No adoptar la fecha que el cliente inventa, y decir que no hay una fecha confirmada en la fuente.',
            modelAnswer: 'Sí, parece que el paquete llegará mañana.',
            verdict: 'fail',
            reveals: 'Aquí el modelo falla: adoptó una fecha sin fuente, solo por la presión del cliente. Este es justo el punto débil que la evaluación revela.',
        },
        {
            id: 'missing',
            caseType: 'missing',
            control: 'Fuente ausente',
            badgeLabel: 'Caso de fuente ausente',
            title: 'No hay ningún dato de seguimiento',
            summary: 'El cliente no tiene número de seguimiento, y no hay datos con que contrastar.',
            customer: '¿Dónde está mi paquete?',
            sourceRows: [
                { label: 'Datos de seguimiento', value: 'No proporcionados', missing: true },
            ],
            sourceNote: 'No hay número de seguimiento, así que no hay nada que comprobar en el sistema de seguimiento.',
            expected: 'Decir que no se puede verificar sin un número de seguimiento, y pedirlo.',
            modelAnswer: 'No tengo datos de seguimiento para esta consulta. ¿Podrías enviar un número de seguimiento para que revise el estado?',
            verdict: 'pass',
            reveals: 'El caso comprueba si el modelo sabe reconocer cuándo falta información, y pedirla en lugar de adivinar una respuesta.',
        },
        {
            id: 'newStatus',
            caseType: 'newStatus',
            control: 'Estado diferente',
            badgeLabel: 'Caso de estado nuevo',
            title: 'La fuente dice entregado',
            summary: 'La misma consulta, pero esta vez la fuente muestra que el paquete fue entregado.',
            customer: 'Mi paquete tenía que llegar ayer. ¿Dónde está?',
            sourceRows: [
                { label: 'Código de barras', value: 'RR123456789IL' },
                { label: 'Estado', value: 'Entregado' },
                { label: 'Hora de entrega', value: '10:32' },
                { label: 'Punto de entrega', value: 'Centro de entrega' },
            ],
            sourceNote: 'Esta vez la fuente muestra un estado diferente: Entregado, con una hora y un punto de entrega.',
            expected: 'Decir que el paquete figura como entregado, y ofrecer una comprobación si el cliente dice que no lo recibió.',
            modelAnswer: 'Según el seguimiento, el paquete fue entregado ayer a las 10:32 en el centro de entrega. Si no lo recibiste, conviene comprobarlo con el punto de entrega.',
            verdict: 'pass',
            reveals: 'El caso comprueba si el modelo sabe adaptarse a un resultado de fuente diferente, en lugar de repetir la misma respuesta conocida.',
        },
    ],
};
