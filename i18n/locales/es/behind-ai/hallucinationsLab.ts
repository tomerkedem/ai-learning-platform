// i18n/locales/es/behind-ai/hallucinationsLab.ts
//
// Datos en español (es, LTR) del "Hallucination Lab" del capítulo 11 (Hallucinations: por
// qué una respuesta segura puede estar equivocada). El hebreo es la fuente de la verdad y
// define el tipo (HallucinationsLabContent).
//
// Traducción de primera pasada, pendiente de revisión por un hablante nativo.
// Sin raya (U+2014) ni guion largo (U+2013).

import type { HallucinationsLabContent } from '../../he/behind-ai/hallucinationsLab';

export const hallucinationsLab: HallucinationsLabContent = {
    sectionEyebrow: 'Hallucination Lab',
    sectionTitle: 'La misma pregunta, cuatro estilos de respuesta: ¿cuál está fundamentada y cuál adivina?',
    sectionIntro:
        'Un visitante pregunta cuál es el horario de la biblioteca en el feriado. Elige un estilo de respuesta y compara: una respuesta segura que inventa un horario frente a una respuesta prudente que dice qué falta. Detrás de cada respuesta verás qué afirmaciones están respaldadas, qué falta y el riesgo de enviarla tal cual.',
    heading: 'Detrás de la respuesta',
    kicker: 'Hallucination Lab',
    questionLabel: 'Pregunta del visitante',
    question: '¿Cuál es el horario de la biblioteca en el feriado?',
    modeLabel: 'Elige un estilo de respuesta',
    answerLabel: 'La respuesta dada',
    riskLabel: 'Nivel de riesgo',
    factCheckLabel: 'Verificación de hechos',
    missingLabel: '¿Qué falta?',
    takeawayLabel: 'En resumen',
    source: {
        label: 'Pista de una fuente (un vistazo)',
        caption: 'Solo dos filas de información de ejemplo, no son datos reales.',
        rows: [
            { label: 'Horario regular', value: '09:00-18:00' },
            { label: 'Horario de feriado', value: 'No disponible' },
        ],
        note: 'Ni siquiera esta pista da un horario de feriado. Cómo entra una fuente completa en la respuesta, lo veremos en el próximo capítulo.',
    },
    disclaimer:
        'Todas las respuestas, las verificaciones y la fuente aquí son un ejemplo didáctico, no la salida real de un modelo. Sirven para mostrar la diferencia entre una respuesta fluida y una fundamentada. Una respuesta que suena segura no es prueba de que el hecho se comprobó.',
    evidenceNote:
        'La confianza y la evidencia son dos dimensiones distintas. Tanto "Segura pero sin fundamento" como "¿Y si hubiera una fuente?" responden con seguridad, pero solo en la segunda la seguridad coincide con lo que la fuente realmente dice. La primera está segura de un horario de feriado que nunca se comprobó, la segunda está segura solo del horario regular que aparece en la pista. El mismo tono seguro, distinto fundamento. Lo que las diferencia es la evidencia, no el estilo.',
    sr: {
        modeGroup: 'Elección del estilo de respuesta',
        checks: 'Verificación de hechos de la respuesta seleccionada',
    },
    modes: [
        {
            id: 'confident',
            control: 'Segura pero sin fundamento',
            risk: 'high',
            riskLabel: 'Riesgo alto',
            riskNote: 'La respuesta afirma un hecho, un horario de feriado, que no se comprobó en ninguna fuente.',
            answer: 'La biblioteca abre de 10:00 a 14:00 en el feriado.',
            answerSummary: 'Suena servicial, breve y segura, y da un horario exacto.',
            checks: [
                { id: 'source', state: 'fail', label: '¿Se consultó la fuente?', note: 'No se consultó ningún horario oficial antes de responder.' },
                { id: 'claim', state: 'warn', label: '¿Hay una afirmación precisa?', note: "Sí, 'de 10:00 a 14:00'. Pero ¿de dónde salió ese horario?" },
                { id: 'backed', state: 'fail', label: '¿La afirmación está respaldada?', note: "Nada respalda ese horario. Es un relleno plausible, no un hecho." },
            ],
            missing: "Falta el horario real del feriado. 'De 10:00 a 14:00' es una continuación lingüísticamente plausible, no un dato comprobado. El paso seguro es comprobar el horario oficial o decir que no se puede confirmar.",
            takeaway: 'Una respuesta puede sonar segura y precisa y aun así inventar el dato más importante.',
        },
        {
            id: 'careful',
            control: 'Respuesta prudente',
            risk: 'low',
            riskLabel: 'Riesgo bajo',
            riskNote: 'La respuesta no hace ninguna afirmación que pueda resultar falsa. Pide comprobar.',
            answer: 'No puedo confirmar el horario del feriado sin comprobar el horario oficial. ¿Tienes acceso a un horario actualizado?',
            answerSummary: 'Menos dramática, pero separa con claridad lo que se sabe de lo que no.',
            checks: [
                { id: 'source', state: 'warn', label: '¿Se consultó la fuente?', note: 'Todavía no, pero la respuesta no pretende saber sin comprobar.' },
                { id: 'separates', state: 'pass', label: '¿Separa lo conocido de lo desconocido?', note: 'Sí. Dice de forma explícita que no se puede confirmar el horario sin comprobar.' },
                { id: 'invents', state: 'pass', label: '¿Inventa un horario?', note: 'No. No se le da al visitante ningún horario sin comprobar.' },
            ],
            missing: 'Todavía falta el horario en sí, pero la respuesta lo pide en lugar de inventar. Eso ya es mucho más seguro que adivinar.',
            takeaway: 'Una respuesta prudente que dice "no estoy seguro, comprobémoslo" supera a una respuesta segura que adivina.',
        },
        {
            id: 'grounded',
            control: '¿Y si hubiera una fuente?',
            risk: 'low',
            riskLabel: 'Riesgo bajo',
            riskNote: 'Solo un vistazo: con una pista de una fuente, la respuesta tiene en qué apoyarse, y la tentación de rellenar detalles se reduce.',
            showSource: true,
            answer: 'Según la pista mostrada aquí, el horario regular es de 09:00 a 18:00. El horario de feriado no aparece, así que no tengo un horario de feriado que dar.',
            answerSummary: 'Con una pista de una fuente, la respuesta ya no necesita adivinar. Solo afirma con seguridad lo que tiene respaldo.',
            checks: [
                { id: 'source', state: 'pass', label: '¿Hay en qué apoyarse?', note: 'Sí. Esta vez hay una pista de una fuente, no solo una continuación del lenguaje.' },
                { id: 'backed', state: 'pass', label: '¿La seguridad coincide con el respaldo?', note: 'Sí. La respuesta afirma con seguridad el horario regular que aparece en la pista, y es prudente con todo lo que no aparece en ella.' },
                { id: 'invents', state: 'pass', label: '¿Inventa un horario de feriado?', note: "No. La pista dice 'no disponible', y la respuesta no rellena el vacío." },
            ],
            missing: 'Todavía falta el horario de feriado, y la pista no lo da. Y sobre todo falta el mecanismo en sí: cómo entra una fuente completa en la respuesta, y qué pasa cuando falta o se contradice. Eso lo abrimos en el próximo capítulo.',
            takeaway: 'Una fuente puede ayudar, pero es un mecanismo en sí mismo. Aquí solo echamos un vistazo, y en el próximo capítulo lo abrimos.',
        },
        {
            id: 'missing',
            control: 'Información faltante',
            risk: 'medium',
            riskLabel: 'Riesgo medio',
            riskNote: 'El paso es correcto, pero este es justo el momento en que es fácil inventar. El riesgo vive en la tentación de rellenar.',
            answer: 'No tengo acceso al horario de la biblioteca, y sin él no puedo saber si está abierta en el feriado. ¿Podrías enviarme el horario oficial?',
            answerSummary: 'Cuando falta la información básica, el paso correcto es pedirla, no inventar un horario.',
            checks: [
                { id: 'identifier', state: 'fail', label: '¿Hay una fuente para comprobar?', note: 'No hay acceso al horario, así que ahora no hay nada que comprobar.' },
                { id: 'invents', state: 'pass', label: '¿Inventa un horario?', note: 'No. La respuesta se detiene y pide el dato que falta.' },
                { id: 'explains', state: 'pass', label: '¿Explica por qué se detiene?', note: 'Sí. Dice exactamente qué falta y cómo continuar.' },
            ],
            missing: 'Falta el horario en sí, que es la clave de cualquier comprobación. En lugar de adivinar, la respuesta lo pide. A veces la mejor respuesta es una pregunta.',
            takeaway: 'Cuando falta información crítica, detenerse a preguntar supera a rellenarla con una suposición que suena bien.',
        },
    ],
};
