// i18n/locales/es/behind-ai/groundingLab.ts
//
// Datos en español (es, LTR) del "Grounding Lab" del capítulo 12 (RAG & Grounding: cómo la
// IA se conecta a fuentes). El hebreo es la fuente de la verdad y define el tipo
// (GroundingLabContent).
//
// Idea central: exactamente la misma pregunta del cliente, y cuatro estados de fuente. El
// aprendiz se mueve entre ellos, sin fuente, con una fuente, una fuente incompleta y una
// fuente contradictoria, y ve cómo una fuente cambia lo que la respuesta puede decir: en qué
// se apoya, qué puede decir y qué no debe inventar.
//
// Totalmente determinista: sin azar, sin una llamada real a un modelo y sin afirmar que la
// recuperación viene de un sistema de seguimiento real. Cada ejemplo aquí es solo un ejemplo
// didáctico.
//
// Traducción de primera pasada, pendiente de revisión por un hablante nativo.
//
// Sin raya (U+2014) ni guion largo (U+2013).

import type { GroundingLabContent } from '../../he/behind-ai/groundingLab';

export const groundingLab: GroundingLabContent = {
    sectionEyebrow: 'Grounding Lab',
    sectionTitle: 'La misma pregunta, cuatro estados de fuente: ¿qué puede decir la respuesta?',
    sectionIntro:
        'Un cliente pregunta dónde está su paquete. Muévete entre los estados de fuente, sin fuente, con una fuente, una fuente incompleta y una fuente contradictoria, y observa cómo la misma pregunta recibe una respuesta distinta. Una buena fuente mantiene la respuesta ligada a lo que se conoce, y señala lo que no.',
    heading: 'Detrás de la respuesta fundamentada',
    kicker: 'Grounding Lab',
    questionLabel: 'Pregunta del cliente',
    question: 'Mi paquete tenía que llegar ayer. ¿Dónde está?',
    modeLabel: 'Elige un estado de fuente',
    answerLabel: 'La respuesta generada',
    groundingCheckLabel: 'Comprobación de fundamento',
    maySayLabel: 'Qué puede decir la respuesta',
    mustNotInventLabel: 'Qué no debe inventar',
    takeawayLabel: 'En resumen',
    noSourceLabel: 'Sin fuente',
    noSourceNote: 'No se aportó ninguna fuente. La respuesta se apoya solo en la continuación del lenguaje, sin datos con los que contrastar.',
    disclaimer:
        'Todas las respuestas y fuentes aquí son un ejemplo didáctico, no una consulta real a un sistema de seguimiento. Sirven para mostrar cómo una fuente cambia lo que la respuesta puede decir. Una respuesta fundamentada es más fuerte, pero solo es tan buena como la fuente que la respalda.',
    sr: {
        modeGroup: 'Elección del estado de fuente',
        checks: 'Comprobación de fundamento de la respuesta seleccionada',
    },
    modes: [
        {
            id: 'none',
            control: 'Sin fuente',
            badge: 'ungrounded',
            badgeLabel: 'Sin fundamento',
            summary: 'Sin fuente, la respuesta suena servicial pero se apoya solo en la continuación del lenguaje.',
            answer: 'Tu paquete probablemente llegue mañana.',
            answerSummary: 'Fluida y tranquilizadora, pero ningún dato respalda "mañana".',
            checks: [
                { id: 'based', state: 'fail', label: '¿Se apoya en una fuente?', note: 'No. No se aportaron datos de seguimiento, así que no hay nada en qué apoyarse.' },
                { id: 'invents', state: 'fail', label: '¿Inventa una fecha?', note: 'Sí. "Mañana" es una suposición plausible, no un dato comprobado en una fuente.' },
                { id: 'limits', state: 'warn', label: '¿Señala lo que falta?', note: 'No. La respuesta no deja claro que no tiene ningún dato.' },
            ],
            maySay: 'Sin fuente, la respuesta como mucho puede decir que no tiene datos, y pedir un número de seguimiento.',
            mustNotInvent: 'No debe dar una fecha de entrega, ni "mañana" ni ninguna otra, porque ningún dato la respalda.',
            takeaway: 'Sin fuente, una respuesta fluida puede inventar el dato más importante.',
        },
        {
            id: 'grounded',
            control: 'Con una fuente',
            badge: 'grounded',
            badgeLabel: 'Fundamentada',
            summary: 'Con una tarjeta de estado en el contexto, cada afirmación se apoya en datos reales.',
            source: {
                label: 'Estado de seguimiento (datos de ejemplo)',
                caption: 'Solo una tarjeta de ejemplo, para ilustrar. No son datos reales.',
                rows: [
                    { label: 'Código de barras', value: 'RR123456789IL' },
                    { label: 'Último escaneo', value: 'Centro de clasificación' },
                    { label: 'Estado', value: 'Retrasado' },
                    { label: 'Entrega estimada', value: 'No disponible', missing: true },
                ],
                note: 'Nota: la fuente dice "Retrasado", pero no da una fecha de entrega. Una buena respuesta no inventará una.',
            },
            answer: 'Según los datos de seguimiento mostrados aquí, el paquete está retrasado en el centro de clasificación. Ahora mismo no hay una fecha de entrega confirmada, así que no me comprometeré a una fecha.',
            answerSummary: 'Menos dramática, pero cada afirmación se apoya en la fuente.',
            checks: [
                { id: 'based', state: 'pass', label: '¿Se apoya en una fuente?', note: 'Sí. El retraso y la ubicación se toman directamente de la tarjeta de estado.' },
                { id: 'invents', state: 'pass', label: '¿Inventa una fecha?', note: 'No. La fuente dice "No disponible", y la respuesta lo deja abierto.' },
                { id: 'limits', state: 'pass', label: '¿Señala lo que falta?', note: 'Sí. Dice con claridad que no hay una fecha de entrega confirmada.' },
            ],
            maySay: 'La respuesta puede informar del estado y la ubicación que aparecen en la fuente, y decir que no hay una fecha de entrega confirmada.',
            mustNotInvent: 'No debe añadir una fecha de entrega, porque la fuente la marca como "No disponible".',
            takeaway: 'Una respuesta fundamentada es menos dramática, pero mucho más fiable. La fuerza está en el fundamento, no en la redacción.',
        },
        {
            id: 'incomplete',
            control: 'Fuente incompleta',
            badge: 'incomplete',
            badgeLabel: 'Fuente incompleta',
            summary: 'La fuente existe pero está casi vacía. El fundamento revela exactamente lo que falta.',
            source: {
                label: 'Estado de seguimiento (datos de ejemplo)',
                caption: 'Solo una tarjeta de ejemplo, para ilustrar. No son datos reales.',
                rows: [
                    { label: 'Código de barras', value: 'RR123456789IL' },
                    { label: 'Último escaneo', value: 'No disponible', missing: true },
                    { label: 'Estado', value: 'No disponible', missing: true },
                    { label: 'Entrega estimada', value: 'No disponible', missing: true },
                ],
                note: 'La fuente está casi vacía. Hay un código de barras, pero ningún estado, ningún escaneo y ninguna fecha.',
            },
            answer: 'Ahora mismo no hay datos suficientes para saber dónde está el paquete. Hay un código de barras, pero ningún estado actual. Hay que consultar una fuente más actualizada antes de responder.',
            answerSummary: 'El fundamento no inventa los datos que faltan, los revela.',
            checks: [
                { id: 'based', state: 'warn', label: '¿Se apoya en una fuente?', note: 'La fuente existe, pero sus campos importantes están vacíos.' },
                { id: 'invents', state: 'pass', label: '¿Inventa un estado?', note: 'No. La respuesta dice claramente que no hay datos suficientes.' },
                { id: 'limits', state: 'pass', label: '¿Señala lo que falta?', note: 'Sí. Dice qué falta y qué hay que comprobar.' },
            ],
            maySay: 'La respuesta puede decir que no hay datos suficientes, y pedir una fuente más actualizada.',
            mustNotInvent: 'No debe inventar un estado ni una fecha solo para sonar completa.',
            takeaway: 'El fundamento puede revelar la información que falta. A veces la respuesta correcta es detenerse y pedir datos.',
        },
        {
            id: 'contradiction',
            control: 'Fuente contradictoria',
            badge: 'contradiction',
            badgeLabel: 'Fuente contradictoria',
            summary: 'El cliente dice que el paquete no llegó, pero la fuente lo marca como entregado.',
            source: {
                label: 'Estado de seguimiento (datos de ejemplo)',
                caption: 'Solo una tarjeta de ejemplo, para ilustrar. No son datos reales.',
                rows: [
                    { label: 'Código de barras', value: 'RR123456789IL' },
                    { label: 'Estado', value: 'Entregado' },
                    { label: 'Hora de entrega', value: '10:32' },
                    { label: 'Punto de entrega', value: 'Centro de entrega' },
                ],
                note: 'El cliente dice que no lo recibió, pero la fuente lo marca como "Entregado". Es un conflicto que hay que manejar con cuidado.',
            },
            answer: 'Según los datos de seguimiento mostrados aquí, el paquete figura como entregado a las 10:32 en el centro de entrega. Si sientes que no lo recibiste, abriremos una investigación para averiguar qué pasó.',
            answerSummary: 'La respuesta se mantiene fiel a la fuente, y maneja el conflicto sin culpar a nadie.',
            checks: [
                { id: 'based', state: 'pass', label: '¿Se apoya en una fuente?', note: 'Sí. El estado, la hora y el lugar se toman de la fuente.' },
                { id: 'invents', state: 'pass', label: '¿Inventa detalles?', note: 'No. La respuesta no añade ninguna razón ni culpa que no esté en la fuente.' },
                { id: 'limits', state: 'warn', label: '¿Maneja el conflicto?', note: 'Sí, con cuidado. Muestra lo que dice la fuente y ofrece una investigación, sin desestimar al cliente.' },
            ],
            maySay: 'La respuesta puede informar de lo que dice la fuente, y ofrecer abrir una investigación sobre el conflicto.',
            mustNotInvent: 'No debe culpar al cliente, ni inventar una razón de por qué el estado y la realidad no coinciden.',
            takeaway: 'Cuando la fuente entra en conflicto con el cliente, muestra con cuidado lo que dice y abre una investigación, sin culpar a nadie.',
        },
    ],
};
