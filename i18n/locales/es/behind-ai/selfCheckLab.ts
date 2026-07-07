// i18n/locales/es/behind-ai/selfCheckLab.ts
//
// Datos en español (es, LTR) del "Self-Check Lab" del capítulo 13 (Self-Check: la
// autocomprobación al responder). El hebreo es la fuente de la verdad y define el tipo
// (SelfCheckLabContent).
//
// Idea central: la misma pregunta del cliente y una sola tarjeta de fuente fija, con tres
// borradores de respuesta. El aprendiz se mueve entre los borradores, demasiado seguro en la
// redacción, demasiado cauto y equilibrado, y ve cómo la misma autocomprobación señala qué se
// apoya en la fuente, qué está inventado y qué falta, antes de que la respuesta salga. La
// comprobación es visible: una lista de control y la comparación de cada afirmación con la
// fuente, sin revelar pensamientos internos.
//
// Totalmente determinista: sin azar, sin una llamada real a un modelo y sin afirmar que la
// fuente viene de un sistema de seguimiento real. Cada ejemplo aquí es solo un ejemplo
// didáctico.
//
// Traducción de primera pasada, pendiente de revisión por un hablante nativo.
//
// Sin raya (U+2014) ni guion largo (U+2013).

import type { SelfCheckLabContent } from '../../he/behind-ai/selfCheckLab';

export const selfCheckLab: SelfCheckLabContent = {
    sectionEyebrow: 'Self-Check Lab',
    sectionTitle: 'La misma pregunta, tres borradores: ¿qué encuentra la comprobación?',
    sectionIntro:
        'Un cliente pregunta dónde está el paquete. Hay una tarjeta de fuente y tres borradores de respuesta. Muévete entre ellos, y observa cómo la misma autocomprobación señala qué se apoya en la fuente, qué está inventado y qué falta, antes de que la respuesta salga al cliente.',
    heading: 'Detrás de la autocomprobación',
    kicker: 'Self-Check Lab',
    questionLabel: 'Pregunta del cliente',
    question: 'Mi paquete tenía que llegar ayer. ¿Dónde está?',
    sourceLabel: 'La fuente aportada (dato de ejemplo)',
    sourceCaption: 'Solo una tarjeta de ejemplo, para ilustrar. No son datos reales.',
    sourceNote: 'Fíjate: la fuente dice "retrasado", pero no da una fecha de entrega. Una buena respuesta no inventará una.',
    sourceRows: [
        { label: 'Código de barras', value: 'RR123456789IL' },
        { label: 'Último escaneo', value: 'Centro de clasificación' },
        { label: 'Estado', value: 'Retrasado' },
        { label: 'Entrega estimada', value: 'No disponible', missing: true },
    ],
    draftLabel: 'Elige un borrador',
    claimsLabel: 'Afirmaciones del borrador',
    checklistLabel: 'Autocomprobación',
    issueLabel: 'Qué encontró la comprobación',
    revisedLabel: 'Respuesta corregida',
    takeawayLabel: 'En resumen',
    disclaimer:
        'Todos los borradores y la fuente aquí son un ejemplo didáctico, no una consulta a un sistema de seguimiento real. La comprobación es visible: una lista de control y la comparación de cada afirmación con la fuente, sin revelar pensamientos internos. La autocomprobación mejora la respuesta, pero no garantiza la verdad.',
    sr: {
        draftGroup: 'Elección del borrador',
        checks: 'Lista de autocomprobación del borrador seleccionado',
    },
    modes: [
        {
            id: 'confident',
            control: 'Segura en la redacción',
            badge: 'overclaim',
            badgeLabel: 'Afirmación sin respaldo',
            summary: 'Suena servicial, pero una parte no aparece en la fuente.',
            draft: 'El paquete está retrasado y llegará mañana.',
            claims: [
                { id: 'delay', text: 'El paquete está retrasado', state: 'supported', note: 'Con respaldo. Aparece en la fuente: estado retrasado.' },
                { id: 'tomorrow', text: 'Llegará mañana', state: 'unsupported', note: 'Sin respaldo. La fuente dice que la entrega estimada no está disponible, así que "mañana" es una suposición.' },
            ],
            checks: [
                { id: 'question', state: 'pass', label: '¿Responde a la pregunta?', note: 'Sí. El cliente preguntó dónde está el paquete, y la respuesta lo aborda.' },
                { id: 'source', state: 'warn', label: '¿Se apoya en la fuente?', note: 'Parcialmente. "Retrasado" se toma de la fuente, pero "mañana" no.' },
                { id: 'invents', state: 'fail', label: '¿Inventa una fecha de entrega?', note: 'Sí. "Llegará mañana" es una fecha que la fuente marca como no disponible.' },
                { id: 'missing', state: 'fail', label: '¿Señala lo que falta?', note: 'No. La respuesta no dice que no hay una fecha de entrega confirmada.' },
                { id: 'confidence', state: 'fail', label: '¿Nivel de confianza adecuado?', note: 'No. La redacción es demasiado segura para lo que la fuente dice en realidad.' },
            ],
            issue: 'La comprobación encontró una afirmación sin respaldo: la fuente no da una fecha de entrega, así que "llegará mañana" es una suposición que hay que quitar.',
            revised: 'Según los datos de seguimiento aportados aquí, el paquete está retrasado. Ahora mismo no hay una fecha de entrega confirmada.',
            revisedNote: 'La afirmación con respaldo (retrasado) se mantiene, la fecha inventada se quitó, y el vacío se dice de forma explícita.',
            takeaway: 'Una respuesta puede contener a la vez una afirmación con respaldo y una inventada. La comprobación las separa.',
        },
        {
            id: 'vague',
            control: 'Demasiado cauta',
            badge: 'overcautious',
            badgeLabel: 'Demasiado cauta',
            summary: 'No inventa nada, pero tampoco usa la información que sí existe en la fuente.',
            draft: 'No sé dónde está el paquete.',
            claims: [
                { id: 'unused', text: 'No usa un dato que sí existe', state: 'missing', note: 'Se pasó por alto. La fuente dice "retrasado", y la respuesta lo ignora.' },
            ],
            checks: [
                { id: 'question', state: 'warn', label: '¿Responde a la pregunta?', note: 'Parcialmente. No le da al cliente ninguna información útil.' },
                { id: 'source', state: 'fail', label: '¿Se apoya en la fuente?', note: 'No. La fuente dice "retrasado", y la respuesta no lo usa.' },
                { id: 'invents', state: 'pass', label: '¿Inventa una fecha de entrega?', note: 'No. Y eso es bueno, aquí no hay ninguna invención.' },
                { id: 'missing', state: 'warn', label: '¿Señala lo que falta?', note: 'No del todo. Dice "no sé" sin separar lo que sí se sabe de lo que no.' },
                { id: 'confidence', state: 'warn', label: '¿Nivel de confianza adecuado?', note: 'Demasiado bajo. Hay un dato que se puede dar con una confianza razonable.' },
            ],
            issue: 'La comprobación encontró que la respuesta es segura, pero desperdicia información: la fuente sí dice "retrasado", y eso se puede comunicar.',
            revised: 'Según la fuente, el paquete figura como retrasado. Todavía no hay una fecha de entrega confirmada, así que no me comprometeré a una fecha.',
            revisedNote: 'La comprobación también funciona en el otro sentido: recuperó el dato con respaldo que se había pasado por alto.',
            takeaway: 'La autocomprobación no solo borra afirmaciones. A veces añade información con respaldo que se había pasado por alto.',
        },
        {
            id: 'grounded',
            control: 'Equilibrada',
            badge: 'checked',
            badgeLabel: 'Pasó la comprobación',
            summary: 'Usa el dato de la fuente, y admite de forma explícita lo que falta.',
            draft: 'Según los datos de seguimiento, el paquete está retrasado. Todavía no hay una fecha de entrega confirmada.',
            claims: [
                { id: 'delay', text: 'El paquete está retrasado', state: 'supported', note: 'Con respaldo. Aparece en la fuente: estado retrasado.' },
                { id: 'nodate', text: 'No hay una fecha de entrega confirmada', state: 'supported', note: 'Con respaldo. Aparece en la fuente: entrega estimada no disponible.' },
            ],
            checks: [
                { id: 'question', state: 'pass', label: '¿Responde a la pregunta?', note: 'Sí. Comunica lo que se sabe sobre el estado del paquete.' },
                { id: 'source', state: 'pass', label: '¿Se apoya en la fuente?', note: 'Sí. Cada afirmación de la respuesta aparece en la fuente.' },
                { id: 'invents', state: 'pass', label: '¿Inventa una fecha de entrega?', note: 'No. No se añadió ninguna fecha.' },
                { id: 'missing', state: 'pass', label: '¿Señala lo que falta?', note: 'Sí. Dice de forma explícita que no hay una fecha confirmada.' },
                { id: 'confidence', state: 'pass', label: '¿Nivel de confianza adecuado?', note: 'Sí. Segura con el retraso, cauta con la fecha.' },
            ],
            issue: 'La comprobación pasó sin ninguna afirmación sin respaldo. No hay nada que borrar ni nada que añadir.',
            revised: 'Según los datos de seguimiento, el paquete está retrasado. Todavía no hay una fecha de entrega confirmada.',
            revisedNote: 'Cuando el borrador ya se apoya en la fuente, la comprobación simplemente lo confirma. No toda comprobación termina en una corrección.',
            takeaway: 'La autocomprobación es un paso de control, no siempre una reescritura. Un borrador bien fundamentado la pasa limpio.',
        },
    ],
};
