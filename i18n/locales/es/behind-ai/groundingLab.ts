// i18n/locales/es/behind-ai/groundingLab.ts
//
// Datos en español (es, LTR) del "Grounding Lab" del capítulo 12 (RAG & Grounding: cómo la
// IA se conecta a fuentes). El hebreo es la fuente de la verdad y define el tipo
// (GroundingLabContent).
//
// Idea central: exactamente la misma pregunta del visitante, y cinco estados de fuente. El
// aprendiz se mueve entre ellos, sin fuente, con una fuente, una fuente incompleta, una
// fuente que no coincide y una fuente contradictoria, y ve cómo una fuente cambia lo que la
// respuesta puede decir: en qué se apoya, qué puede decir y qué no debe inventar.
//
// Totalmente determinista: sin azar, sin una llamada real a un modelo y sin afirmar que la
// recuperación viene de un horario real. Cada ejemplo aquí es solo un ejemplo
// didáctico.
//
// Traducción de primera pasada, pendiente de revisión por un hablante nativo.
//
// Sin raya (U+2014) ni guion largo (U+2013).

import type { GroundingLabContent } from '../../he/behind-ai/groundingLab';

export const groundingLab: GroundingLabContent = {
    sectionEyebrow: 'Grounding Lab',
    sectionTitle: 'La misma pregunta, cinco estados de fuente: ¿qué puede decir la respuesta?',
    sectionIntro:
        'Un visitante pregunta cuál es el horario de la biblioteca en el feriado. Muévete entre los estados de fuente, sin fuente, con una fuente, una fuente incompleta, una fuente que no coincide y una fuente contradictoria, y observa cómo la misma pregunta recibe una respuesta distinta. Una buena fuente mantiene la respuesta ligada a lo que se conoce, y señala lo que no.',
    heading: 'Detrás de la respuesta fundamentada',
    kicker: 'Grounding Lab',
    questionLabel: 'Pregunta del visitante',
    question: '¿Cuál es el horario de la biblioteca en el feriado?',
    modeLabel: 'Elige un estado de fuente',
    answerLabel: 'La respuesta generada',
    groundingCheckLabel: 'Comprobación de fundamento',
    maySayLabel: 'Qué puede decir la respuesta',
    mustNotInventLabel: 'Qué no debe inventar',
    takeawayLabel: 'En resumen',
    noSourceLabel: 'Sin fuente',
    noSourceNote: 'No se aportó ninguna fuente. La respuesta se apoya solo en la continuación del lenguaje, sin datos con los que contrastar.',
    disclaimer:
        'Todas las respuestas y fuentes aquí son un ejemplo didáctico, no una consulta real a un horario. Sirven para mostrar cómo una fuente cambia lo que la respuesta puede decir. Una respuesta fundamentada es más fuerte, pero solo es tan buena como la fuente que la respalda.',
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
            answer: 'La biblioteca probablemente abre de 10:00 a 14:00 en el feriado.',
            answerSummary: 'Fluida y tranquilizadora, pero ningún dato respalda ese horario.',
            checks: [
                { id: 'based', state: 'fail', label: '¿Se apoya en una fuente?', note: 'No. No se aportó ningún horario, así que no hay nada en qué apoyarse.' },
                { id: 'invents', state: 'fail', label: '¿Inventa un horario?', note: 'Sí. Ese horario es una suposición plausible, no un dato comprobado en una fuente.' },
                { id: 'limits', state: 'warn', label: '¿Señala lo que falta?', note: 'No. La respuesta no deja claro que no tiene ningún dato.' },
            ],
            maySay: 'Sin fuente, la respuesta como mucho puede decir que no tiene datos, y sugerir comprobar el horario oficial.',
            mustNotInvent: 'No debe dar un horario de feriado, ni este ni ningún otro, porque ningún dato lo respalda.',
            takeaway: 'Sin fuente, una respuesta fluida puede inventar el dato más importante.',
        },
        {
            id: 'grounded',
            control: 'Con una fuente',
            badge: 'grounded',
            badgeLabel: 'Fundamentada',
            summary: 'Con una tarjeta de información en el contexto, cada afirmación se apoya en datos reales.',
            source: {
                label: 'Información de la biblioteca (datos de ejemplo)',
                caption: 'Solo una tarjeta de ejemplo, para ilustrar. No son datos reales.',
                rows: [
                    { label: 'Horario regular', value: '09:00-18:00' },
                    { label: 'Horario de feriado', value: 'No disponible', missing: true },
                ],
                note: 'Nota: la fuente da el horario regular, pero no da un horario de feriado. Una buena respuesta no inventará uno.',
            },
            answer: 'Según la información disponible, el horario regular es de 09:00 a 18:00, pero el horario de feriado no aparece en la fuente.',
            answerSummary: 'Menos dramática, pero cada afirmación se apoya en la fuente.',
            checks: [
                { id: 'based', state: 'pass', label: '¿Se apoya en una fuente?', note: 'Sí. El horario regular se toma directamente de la tarjeta de información.' },
                { id: 'invents', state: 'pass', label: '¿Inventa un horario de feriado?', note: 'No. La fuente dice "No disponible", y la respuesta lo deja abierto.' },
                { id: 'limits', state: 'pass', label: '¿Señala lo que falta?', note: 'Sí. Dice con claridad que no hay un horario de feriado confirmado.' },
            ],
            maySay: 'La respuesta puede informar del horario regular que aparece en la fuente, y decir que no hay un horario de feriado confirmado.',
            mustNotInvent: 'No debe añadir un horario de feriado, porque la fuente lo marca como "No disponible".',
            takeaway: 'Una respuesta fundamentada es menos dramática, pero mucho más fiable. La fuerza está en el fundamento, no en la redacción.',
        },
        {
            id: 'incomplete',
            control: 'Fuente incompleta',
            badge: 'incomplete',
            badgeLabel: 'Fuente incompleta',
            summary: 'La fuente existe pero está casi vacía. El fundamento revela exactamente lo que falta.',
            source: {
                label: 'Información de la biblioteca (datos de ejemplo)',
                caption: 'Solo una tarjeta de ejemplo, para ilustrar. No son datos reales.',
                rows: [
                    { label: 'Dirección', value: 'Calle Biblioteca 5' },
                    { label: 'Horario regular', value: 'No disponible', missing: true },
                    { label: 'Horario de feriado', value: 'No disponible', missing: true },
                ],
                note: 'La fuente está casi vacía. Hay una dirección, pero ningún horario regular y ningún horario de feriado.',
            },
            answer: 'Ahora mismo no hay datos suficientes para saber cuándo abre la biblioteca en el feriado. Hay una dirección, pero ningún horario. Hay que consultar una fuente más actualizada antes de responder.',
            answerSummary: 'El fundamento no inventa los datos que faltan, los revela.',
            checks: [
                { id: 'based', state: 'warn', label: '¿Se apoya en una fuente?', note: 'La fuente existe, pero sus campos importantes están vacíos.' },
                { id: 'invents', state: 'pass', label: '¿Inventa un horario?', note: 'No. La respuesta dice claramente que no hay datos suficientes.' },
                { id: 'limits', state: 'pass', label: '¿Señala lo que falta?', note: 'Sí. Dice qué falta y qué hay que comprobar.' },
            ],
            maySay: 'La respuesta puede decir que no hay datos suficientes, y pedir una fuente más actualizada.',
            mustNotInvent: 'No debe inventar un horario solo para sonar completa.',
            takeaway: 'El fundamento puede revelar la información que falta. A veces la respuesta correcta es detenerse y pedir datos.',
        },
        {
            id: 'mismatch',
            control: 'Fuente que no coincide',
            badge: 'ungrounded',
            badgeLabel: 'Fuente que no coincide',
            summary: 'La fuente se recuperó y parece correcta, pero se refiere a otra biblioteca. No responde a la pregunta del visitante.',
            source: {
                label: 'Información de la biblioteca, sucursal 9 (datos de ejemplo)',
                caption: 'Solo una tarjeta de ejemplo, para ilustrar. No son datos reales.',
                rows: [
                    { label: 'Horario regular', value: '08:00-16:00' },
                    { label: 'Horario de feriado', value: 'Cerrado' },
                ],
                note: 'Nota: esta es la sucursal 9, no la biblioteca del barrio del visitante (sucursal 14). La fuente se recuperó, pero es de otra biblioteca.',
            },
            answer: 'La fuente recuperada se refiere a la sucursal 9, no a la sucursal 14 sobre la que preguntaste, así que no responde a tu pregunta. Necesito la información de la biblioteca correcta antes de poder responder.',
            answerSummary: 'La fuente existe pero no encaja, así que no se usa como base de la respuesta.',
            checks: [
                { id: 'based', state: 'fail', label: '¿Se apoya en una fuente que coincide?', note: 'No. La fuente recuperada es de otra sucursal, así que no puede fundamentar una respuesta a esta pregunta.' },
                { id: 'invents', state: 'pass', label: '¿Inventa un horario?', note: 'No. La respuesta no atribuye al visitante el horario de la otra sucursal.' },
                { id: 'limits', state: 'pass', label: '¿Señala que la fuente no coincide?', note: 'Sí. Dice de forma explícita que la fuente recuperada no encaja, y pide los datos correctos.' },
            ],
            maySay: 'La respuesta puede decir que la fuente recuperada pertenece a otra sucursal, y pedir la información correcta de la sucursal del visitante.',
            mustNotInvent: 'No debe usar el horario de la otra sucursal como si fuera el de la sucursal consultada.',
            takeaway: 'A veces la recuperación devuelve una fuente que existe pero no encaja. Una fuente recuperada no es necesariamente la fuente correcta.',
        },
        {
            id: 'contradiction',
            control: 'Fuente contradictoria',
            badge: 'contradiction',
            badgeLabel: 'Fuente contradictoria',
            summary: 'El visitante dice que escuchó que la biblioteca abre en el feriado, pero la fuente la marca como cerrada.',
            source: {
                label: 'Información de la biblioteca (datos de ejemplo)',
                caption: 'Solo una tarjeta de ejemplo, para ilustrar. No son datos reales.',
                rows: [
                    { label: 'Horario regular', value: '09:00-18:00' },
                    { label: 'Horario de feriado', value: 'Cerrado' },
                ],
                note: 'El visitante afirma que escuchó que la biblioteca abre en el feriado, pero la fuente la marca como "Cerrado". Es un conflicto que hay que manejar con cuidado.',
            },
            answer: 'Según la información mostrada aquí, la biblioteca figura como cerrada en el feriado. Si escuchaste que está abierta, lo averiguaremos para entender qué pasó.',
            answerSummary: 'La respuesta se mantiene fiel a la fuente, y maneja el conflicto sin culpar a nadie.',
            checks: [
                { id: 'based', state: 'pass', label: '¿Se apoya en una fuente?', note: 'Sí. El horario regular y el de feriado se toman de la fuente.' },
                { id: 'invents', state: 'pass', label: '¿Inventa detalles?', note: 'No. La respuesta no añade ninguna razón ni culpa que no esté en la fuente.' },
                { id: 'limits', state: 'warn', label: '¿Maneja el conflicto?', note: 'Sí, con cuidado. Muestra lo que dice la fuente y ofrece averiguarlo, sin desestimar al visitante.' },
            ],
            maySay: 'La respuesta puede informar de lo que dice la fuente, y ofrecer averiguar sobre el conflicto.',
            mustNotInvent: 'No debe culpar al visitante, ni inventar una razón de por qué la fuente y lo que escuchó no coinciden.',
            takeaway: 'Cuando la fuente entra en conflicto con el visitante, muestra con cuidado lo que dice y ofrece averiguarlo, sin culpar a nadie.',
        },
    ],
};
