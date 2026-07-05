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
        'Un cliente pregunta dónde está su paquete. Elige un estilo de respuesta y observa qué hay detrás de cada una: si se consultó una fuente, qué afirmaciones están respaldadas y el riesgo de enviarla tal cual. La misma pregunta puede recibir una respuesta segura que inventa una fecha, o una respuesta prudente que dice qué falta.',
    heading: 'Detrás de la respuesta',
    kicker: 'Hallucination Lab',
    questionLabel: 'Pregunta del cliente',
    question: 'Mi paquete tenía que llegar ayer. ¿Dónde está?',
    modeLabel: 'Elige un estilo de respuesta',
    answerLabel: 'La respuesta dada',
    riskLabel: 'Nivel de riesgo',
    factCheckLabel: 'Verificación de hechos',
    missingLabel: '¿Qué falta?',
    takeawayLabel: 'En resumen',
    source: {
        label: 'Estado de seguimiento (datos de ejemplo)',
        caption: 'Una tarjeta de ejemplo solo para ilustrar. No son datos reales.',
        rows: [
            { label: 'Código de barras', value: 'RR123456789IL' },
            { label: 'Último escaneo', value: 'Centro de clasificación' },
            { label: 'Estado', value: 'Retrasado' },
            { label: 'Entrega estimada', value: 'No disponible' },
        ],
        note: 'Nota: la fuente misma no da una fecha de entrega. Una buena respuesta no inventará una.',
    },
    disclaimer:
        'Todas las respuestas, las verificaciones y la fuente aquí son un ejemplo didáctico, no la salida real de un modelo. Sirven para mostrar la diferencia entre una respuesta fluida y una fundamentada. Una respuesta que suena segura no es prueba de que el hecho se comprobó.',
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
            riskNote: 'La respuesta afirma un hecho, una fecha de entrega, que no se comprobó en ninguna fuente.',
            answer: 'El paquete está retrasado y llegará mañana.',
            answerSummary: 'Suena servicial, breve y segura, y da una fecha exacta.',
            checks: [
                { id: 'source', state: 'fail', label: '¿Se consultó la fuente?', note: 'No se consultó ningún sistema de seguimiento antes de responder.' },
                { id: 'claim', state: 'warn', label: '¿Hay una afirmación precisa?', note: "Sí, 'mañana'. Pero ¿de dónde salió esa fecha?" },
                { id: 'backed', state: 'fail', label: '¿La afirmación está respaldada?', note: "Nada respalda 'mañana'. Es un relleno plausible, no un hecho." },
            ],
            missing: "Falta el estado real. 'Mañana' es una continuación lingüísticamente plausible, no un dato comprobado. El paso seguro es comprobar el seguimiento o decir que no se puede confirmar la fecha.",
            takeaway: 'Una respuesta puede sonar segura y precisa y aun así inventar el dato más importante.',
        },
        {
            id: 'careful',
            control: 'Respuesta prudente',
            risk: 'low',
            riskLabel: 'Riesgo bajo',
            riskNote: 'La respuesta no hace ninguna afirmación que pueda resultar falsa. Pide comprobar.',
            answer: 'No puedo confirmar cuándo llegará el paquete sin comprobar su estado. ¿Tienes un número de seguimiento para comprobarlo?',
            answerSummary: 'Menos dramática, pero separa con claridad lo que se sabe de lo que no.',
            checks: [
                { id: 'source', state: 'warn', label: '¿Se consultó la fuente?', note: 'Todavía no, pero la respuesta no pretende saber sin comprobar.' },
                { id: 'separates', state: 'pass', label: '¿Separa lo conocido de lo desconocido?', note: 'Sí. Dice de forma explícita que no se puede confirmar una fecha sin comprobar.' },
                { id: 'invents', state: 'pass', label: '¿Inventa una fecha?', note: 'No. No se le da al cliente ninguna fecha sin comprobar.' },
            ],
            missing: 'Todavía falta el estado en sí, pero la respuesta lo pide en lugar de inventar. Eso ya es mucho más seguro que adivinar.',
            takeaway: 'Una respuesta prudente que dice "no estoy seguro, comprobémoslo" supera a una respuesta segura que adivina.',
        },
        {
            id: 'grounded',
            control: 'Fundamentada en una fuente',
            risk: 'low',
            riskLabel: 'Riesgo bajo',
            riskNote: 'Cada afirmación de la respuesta se apoya en un valor que aparece en la fuente mostrada aquí.',
            showSource: true,
            answer: 'Según el estado de seguimiento mostrado aquí, el paquete está retrasado en el centro de clasificación. Ahora mismo no hay una fecha de entrega confirmada, así que no puedo comprometerme a una fecha.',
            answerSummary: 'Cada afirmación se apoya en un valor de la fuente. Sin fecha inventada.',
            checks: [
                { id: 'source', state: 'pass', label: '¿Se consultó la fuente?', note: 'Sí, la respuesta se apoya en la tarjeta de estado mostrada arriba.' },
                { id: 'backed', state: 'pass', label: '¿Cada afirmación está respaldada?', note: 'El retraso y la ubicación se toman directamente de la fuente.' },
                { id: 'invents', state: 'pass', label: '¿Inventa una fecha?', note: "No. La fuente dice 'no disponible', y la respuesta lo deja abierto." },
            ],
            missing: 'La fuente misma no da una fecha de entrega, y la respuesta lo refleja con honestidad en lugar de rellenar el vacío. La incertidumbre se queda justo donde la fuente calla.',
            takeaway: 'Una respuesta ligada a una fuente es más fuerte que una bien redactada. La fuerza está en el fundamento, no en la redacción.',
        },
        {
            id: 'missing',
            control: 'Información faltante',
            risk: 'medium',
            riskLabel: 'Riesgo medio',
            riskNote: 'El paso es correcto, pero este es justo el momento en que es fácil inventar. El riesgo vive en la tentación de rellenar.',
            answer: 'No tengo un número de seguimiento para este paquete, y sin él no puedo comprobar dónde está. ¿Podrías enviar el número de seguimiento y compruebo el estado?',
            answerSummary: 'Cuando falta la información básica, el paso correcto es pedirla, no inventar un estado.',
            checks: [
                { id: 'identifier', state: 'fail', label: '¿Hay un identificador para comprobar?', note: 'No hay número de seguimiento, así que ahora no hay nada que comprobar.' },
                { id: 'invents', state: 'pass', label: '¿Inventa un estado?', note: 'No. La respuesta se detiene y pide el dato que falta.' },
                { id: 'explains', state: 'pass', label: '¿Explica por qué se detiene?', note: 'Sí. Dice exactamente qué falta y cómo continuar.' },
            ],
            missing: 'Falta el número de seguimiento, que es la clave de cualquier comprobación. En lugar de adivinar, la respuesta lo pide. A veces la mejor respuesta es una pregunta.',
            takeaway: 'Cuando falta información crítica, detenerse a preguntar supera a rellenarla con una suposición que suena bien.',
        },
    ],
};
