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
        'Todos los borradores y la fuente aquí son un ejemplo didáctico, no una consulta a un sistema de seguimiento real. La comprobación es visible: una lista de control y la comparación de cada afirmación con la fuente, sin revelar pensamientos internos. La autocomprobación mejora la respuesta, pero no garantiza la verdad, y a veces señala un problema que no se puede resolver sin una fuente externa.',
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
            summary: 'No inventa nada, pero tampoco le responde de verdad al cliente. Este problema se ve incluso antes de comparar con la fuente.',
            draft: 'No sé dónde está el paquete.',
            claims: [
                { id: 'noanswer', text: 'En realidad no responde a la pregunta', state: 'missing', note: 'Problema interno. "No sé" es un callejón sin salida, y eso se ve sin ninguna fuente.' },
                { id: 'unused', text: 'Ignora un dato que sí existe', state: 'missing', note: 'Se pasó por alto. La fuente dice "retrasado", y la respuesta no lo comunica.' },
            ],
            checks: [
                { id: 'question', state: 'fail', label: '¿Responde a la pregunta?', note: 'No. "No sé" no le da al cliente nada útil. Esto se ve sin comparar con la fuente.' },
                { id: 'source', state: 'fail', label: '¿Se apoya en la fuente?', note: 'No. Hay un dato que se podría haber comunicado, "retrasado", y la respuesta lo ignora.' },
                { id: 'invents', state: 'pass', label: '¿Inventa una fecha de entrega?', note: 'No. Y eso es bueno, aquí no hay ninguna invención.' },
                { id: 'missing', state: 'warn', label: '¿Señala lo que falta?', note: 'No del todo. Dice "no sé" sin separar lo que sí se sabe de lo que no.' },
                { id: 'confidence', state: 'warn', label: '¿Nivel de confianza adecuado?', note: 'Demasiado bajo. Hay un dato que se puede dar con una confianza razonable.' },
            ],
            issue: 'La comprobación encontró un problema interno: la respuesta en realidad no responde a la pregunta. "No sé" es un callejón sin salida que se ve incluso antes de comparar con la fuente. Además, se pasó por alto un dato que sí existe.',
            revised: 'Según la fuente, el paquete figura como retrasado. Todavía no hay una fecha de entrega confirmada, así que no me comprometeré a una fecha.',
            revisedNote: 'Ahora la respuesta sí le responde al cliente: comunica lo que se sabe en lugar de un callejón sin salida. La autocomprobación no solo borra, a veces también completa.',
            takeaway: 'La autocomprobación no solo compara con una fuente. También se hace preguntas internas: ¿respondimos a la pregunta, nos mantuvimos claros, evitamos contradecirnos? Aquí atrapa una respuesta que no cumple su función.',
        },
        {
            id: 'grounded',
            control: 'Equilibrada',
            badge: 'checked',
            badgeLabel: 'Pasó la lista de control',
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
            revisedNote: 'Cuando el borrador ya se apoya en la fuente, la comprobación simplemente lo confirma. No toda comprobación termina en una corrección. "Pasó la comprobación" significa que no se encontró ningún problema en la lista de control, no que la información se haya verificado frente al mundo.',
            takeaway: 'La autocomprobación es un paso de control, no siempre una reescritura. Un borrador bien fundamentado la pasa limpio.',
        },
        {
            id: 'external',
            control: 'Una afirmación que necesita una fuente',
            badge: 'needsSource',
            badgeLabel: 'Señalada por la comprobación, pero no se puede verificar',
            summary: 'El borrador añade una causa que suena razonable, pero no está en la fuente, y la autocomprobación por sí sola no puede saber si es cierta.',
            draft: 'Seguramente el paquete está atascado en el centro de clasificación y saldrá pronto.',
            claims: [
                { id: 'stuck', text: 'Atascado en el centro de clasificación', state: 'unsupported', note: 'Sin respaldo. La fuente dice "centro de clasificación" como último escaneo, pero no dice que esté atascado ahí. Eso es una interpretación añadida.' },
                { id: 'soon', text: 'Saldrá pronto', state: 'unsupported', note: 'Sin respaldo. La fuente no da ninguna hora, así que "pronto" es una suposición.' },
            ],
            checks: [
                { id: 'question', state: 'pass', label: '¿Responde a la pregunta?', note: 'Sí. Aborda la ubicación del paquete.' },
                { id: 'source', state: 'fail', label: '¿Se apoya en la fuente?', note: 'No. "Atascado" y "pronto" no aparecen en la fuente.' },
                { id: 'invents', state: 'fail', label: '¿Inventa un detalle?', note: 'Sí. Añadió una causa y una hora sin ninguna fuente.' },
                { id: 'missing', state: 'warn', label: '¿Señala lo que falta?', note: 'No. No dice que la causa no se puede confirmar con esta información.' },
                { id: 'confidence', state: 'fail', label: '¿Nivel de confianza adecuado?', note: 'No. Presenta una suposición como si fuera un hecho.' },
            ],
            issue: 'La comprobación señala que "atascado en el centro de clasificación" no se apoya en la fuente. Pero fíjate: no puede saber si es cierto o no. Para verificar una causa así necesitas una fuente externa, no una autocomprobación.',
            revised: 'Según los datos de seguimiento aportados aquí, el paquete está retrasado y el último escaneo fue en un centro de clasificación. No puedo confirmar con esta información por qué está retrasado ni cuándo saldrá. Para averiguar la causa, habría que consultarlo con el sistema de envíos o con un representante.',
            revisedNote: 'La comprobación detuvo una afirmación sin respaldo, pero no la convirtió en verdad. Lo que requiere una verificación de hechos pasa a una fuente externa, y el vacío se dice de forma explícita.',
            takeaway: 'La autocomprobación atrapa una afirmación que no tiene fuente, pero no puede verificarla. La verificación de hechos requiere una fuente, una herramienta o una persona.',
        },
    ],
};
