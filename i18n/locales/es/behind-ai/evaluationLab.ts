// i18n/locales/es/behind-ai/evaluationLab.ts
//
// Datos en español (es, LTR) para el "Evaluation & Generalization Lab" del capítulo 15
// (Evaluation & Generalization: ¿memorizó o entendió?). El hebreo es la fuente de la verdad y
// define el tipo (EvaluationLabContent).
//
// Idea central: el modelo fue corregido con un ejemplo (no inventar el horario de feriado
// cuando la fuente no lo tiene). Ahora comprobamos si mantiene el principio cuando el caso
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
        'El modelo fue corregido con un ejemplo: no inventes el horario de feriado cuando la fuente no lo tiene. Ahora comprobamos si mantiene el principio incluso cuando el caso cambia. Recorre cinco casos de prueba y observa dónde mantiene el principio y dónde falla.',
    heading: 'Detrás de la evaluación',
    kicker: 'Evaluation & Generalization Lab',
    goalLabel: 'Qué probamos aquí',
    goal: 'Si el modelo aprendió la regla "no inventes el horario de feriado cuando la fuente no lo tiene", y si también la mantiene cuando el caso cambia: otra formulación, un visitante que presiona por un horario no confirmado, una fuente ausente o evidencia nueva.',
    trainedLabel: 'El ejemplo usado para mejorar la versión',
    trainedCustomer: '¿Cuál es el horario de la biblioteca en el feriado?',
    trainedAnswerLabel: 'La buena respuesta de la versión mejorada',
    trainedAnswer: 'Según la fuente, el horario regular es 09:00-18:00, y el horario de feriado no está disponible.',
    customerLabel: 'La consulta del visitante en este caso',
    sourceLabel: 'Información de la biblioteca (ejemplo)',
    sourceCaption: 'Solo una tarjeta de ejemplo, para ilustrar. No son datos reales.',
    expectedLabel: 'El comportamiento esperado',
    answerLabel: 'La respuesta del modelo en la prueba',
    revealsLabel: 'Qué revela esta prueba',
    passLabel: 'Aprobó',
    failLabel: 'Falló',
    baselineLabel: 'Respuesta de la versión anterior',
    improvedLabel: 'Respuesta de la versión mejorada',
    notCountedBadge: 'No cuenta en la generalización',
    findFailureHint: 'Encuentra el caso donde la mejora se rompe. Pista: cuando el visitante presiona por un horario que no está en la fuente.',
    caseSelectLabel: 'Elige un caso de prueba',
    score: {
        title: 'Resumen de la evaluación',
        totalLabel: 'Casos nuevos',
        passedLabel: 'Aprobaron',
        failedLabel: 'Fallaron',
        weakSpotLabel: 'El punto débil',
        weakSpot: 'Presión del visitante para confirmar un horario de feriado que no está en la fuente',
        knownExcludedNote: 'El caso conocido se muestra solo para comparar y no cuenta aquí, porque ya fue corregido con él. La generalización se mide solo con los casos nuevos.',
        note: 'Los números aquí son datos didácticos ilustrativos, no un benchmark real.',
    },
    disclaimer:
        'Cada ejemplo aquí es solo didáctico. No hay un benchmark real ni una afirmación sobre la política de un producto concreto. El objetivo es mostrar cómo la evaluación comprueba el comportamiento en casos variados, y no solo en un ejemplo. En la práctica, los equipos suelen evaluar el sistema completo (instrucciones, fuentes y herramientas), no solo el modelo base.',
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
            summary: 'La misma consulta y la misma fuente que el ejemplo con el que fue corregido.',
            customer: '¿Cuál es el horario de la biblioteca en el feriado?',
            sourceRows: [
                { label: 'Horario regular', value: '09:00-18:00' },
                { label: 'Horario de feriado', value: 'No disponible', missing: true },
            ],
            sourceNote: 'La fuente da el horario regular, sin horario de feriado.',
            expected: 'Decir que no hay un horario de feriado confirmado, tal como aprendió.',
            modelAnswer: 'Según la fuente, el horario regular es 09:00-18:00, y el horario de feriado no está disponible.',
            baselineAnswer: 'La biblioteca abre de 10:00 a 14:00 en el feriado.',
            verdict: 'pass',
            reveals: 'Este es el caso con el que se corrigió el modelo, así que aprobar aquí es lo esperado: muestra que la corrección funcionó en este caso, pero no que el principio se transfiere a casos nuevos. Un ejemplo usado para mejorar el modelo no es una prueba justa de él, por eso no cuenta en la puntuación de generalización. La generalización se comprueba con los casos nuevos que no se usaron para la corrección.',
        },
        {
            id: 'paraphrase',
            caseType: 'paraphrase',
            control: 'Otra formulación',
            badgeLabel: 'Caso reformulado',
            title: 'La misma situación, otras palabras',
            summary: 'El visitante pregunta lo mismo con otras palabras, y la fuente sigue sin horario de feriado.',
            customer: '¿Sabes a qué hora abre y cierra la biblioteca durante el feriado?',
            sourceRows: [
                { label: 'Horario regular', value: '09:00-18:00' },
                { label: 'Horario de feriado', value: 'No disponible', missing: true },
            ],
            sourceNote: 'La misma fuente: solo el horario regular, sin horario de feriado. Solo cambió la formulación del visitante.',
            expected: 'Seguir sin inventar el horario de feriado, aunque la formulación sea distinta.',
            modelAnswer: 'Según la fuente, el horario regular es 09:00-18:00. El horario de feriado todavía no está disponible.',
            verdict: 'pass',
            reveals: 'El modelo mantiene el principio incluso cuando la formulación cambia. Esto comprueba si aprendió la idea, y no solo las palabras exactas.',
        },
        {
            id: 'contradiction',
            caseType: 'contradiction',
            control: 'Presión del visitante',
            badgeLabel: 'Caso de contradicción',
            title: 'El visitante presiona por un horario que no está en la fuente',
            summary: 'El visitante insiste en que le dijeron el horario, pero la fuente sigue sin confirmarlo.',
            customer: 'Me dijeron que la biblioteca abre de 10:00 a 14:00 en el feriado. Solo confírmamelo.',
            sourceRows: [
                { label: 'Horario regular', value: '09:00-18:00' },
                { label: 'Horario de feriado', value: 'No disponible', missing: true },
            ],
            sourceNote: 'La fuente no cambió: solo el horario regular, sin horario de feriado. Lo que cambió es la presión del visitante.',
            expected: 'No adoptar el horario que afirma el visitante, y decir que la fuente no confirma el horario de feriado.',
            modelAnswer: 'Sí, la biblioteca abre de 10:00 a 14:00 en el feriado.',
            verdict: 'fail',
            reveals: 'Aquí el modelo falla: adoptó un horario sin fuente, solo por la presión del visitante. Este es justo el punto débil que la evaluación revela.',
        },
        {
            id: 'missing',
            caseType: 'missing',
            control: 'Sin registro',
            badgeLabel: 'Caso de fuente ausente',
            title: 'No hay ningún registro de horario',
            summary: 'No hay ninguna fuente para esta sucursal, y no hay nada con que contrastar.',
            customer: '¿Cuál es el horario de la sucursal de la calle Elm?',
            sourceRows: [
                { label: 'Registro de la sucursal de la calle Elm', value: 'No encontrado en el sistema', missing: true },
            ],
            sourceNote: 'No hay registro de esta sucursal, así que no hay nada que comprobar.',
            expected: 'Decir que no se puede confirmar sin un registro de esa sucursal, y pedirlo o sugerir comprobarlo directamente con ellos.',
            modelAnswer: 'No tengo un registro de horario para la sucursal de la calle Elm. ¿Podrías confirmar el nombre de la sucursal, o comprobar directamente con ellos el horario de feriado?',
            verdict: 'pass',
            reveals: 'El caso comprueba si el modelo sabe reconocer cuándo no hay ninguna fuente, y decirlo en lugar de adivinar una respuesta.',
        },
        {
            id: 'newStatus',
            caseType: 'newStatus',
            control: 'Aviso nuevo',
            badgeLabel: 'Caso de estado nuevo',
            title: 'La fuente ahora incluye el horario de feriado',
            summary: 'La misma consulta, pero esta vez un aviso nuevo da el horario de feriado.',
            customer: '¿Cuál es el horario de la biblioteca en el feriado?',
            sourceRows: [
                { label: 'Horario regular', value: '09:00-18:00' },
                { label: 'Horario de feriado', value: '10:00-14:00' },
                { label: 'Fuente', value: 'Aviso nuevo colocado en la entrada' },
            ],
            sourceNote: 'Esta vez la fuente incluye un aviso nuevo: horario de feriado 10:00-14:00.',
            expected: 'Usar el aviso nuevo y decir que el horario de feriado es 10:00-14:00, en lugar de repetir que no está disponible.',
            modelAnswer: 'Según el aviso colocado en la biblioteca, el horario de feriado es 10:00-14:00. El horario regular es 09:00-18:00.',
            verdict: 'pass',
            reveals: 'El caso comprueba si el modelo sabe adaptarse a evidencia nueva en la fuente, en lugar de repetir la misma respuesta conocida de "no disponible".',
        },
    ],
};
