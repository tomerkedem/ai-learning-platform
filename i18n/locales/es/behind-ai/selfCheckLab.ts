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
// fuente viene de un horario real de biblioteca. Cada ejemplo aquí es solo un ejemplo
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
        'Un visitante pregunta cuál es el horario de la biblioteca en el feriado. Hay una tarjeta de fuente y tres borradores de respuesta. Muévete entre ellos, y observa cómo la misma autocomprobación señala qué se apoya en la fuente, qué está inventado y qué falta, antes de que la respuesta salga al visitante.',
    heading: 'Detrás de la autocomprobación',
    kicker: 'Self-Check Lab',
    questionLabel: 'Pregunta del visitante',
    question: '¿Cuál es el horario de la biblioteca en el feriado?',
    sourceLabel: 'Información de la biblioteca (dato de ejemplo)',
    sourceCaption: 'Solo una tarjeta de ejemplo, para ilustrar. No son datos reales.',
    sourceNote: 'Fíjate: la fuente da el horario regular, pero no da un horario de feriado. Una buena respuesta no inventará uno.',
    sourceRows: [
        { label: 'Horario regular', value: '09:00-18:00' },
        { label: 'Horario de feriado', value: 'No disponible', missing: true },
    ],
    draftLabel: 'Elige un borrador',
    claimsLabel: 'Afirmaciones del borrador',
    checklistLabel: 'Autocomprobación',
    issueLabel: 'Qué encontró la comprobación',
    revisedLabel: 'Respuesta corregida',
    takeawayLabel: 'En resumen',
    disclaimer:
        'Todos los borradores y la fuente aquí son un ejemplo didáctico, no una consulta a una biblioteca real. La comprobación es visible: una lista de control y la comparación de cada afirmación con la fuente, sin revelar pensamientos internos. La autocomprobación mejora la respuesta, pero no garantiza la verdad, y a veces señala un problema que no se puede resolver sin una fuente externa.',
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
            draft: 'La biblioteca abre de 09:00 a 18:00 en días regulares, y de 10:00 a 14:00 en el feriado.',
            claims: [
                { id: 'regular', text: 'Abre de 09:00 a 18:00 en días regulares', state: 'supported', note: 'Con respaldo. Aparece en la fuente: horario regular 09:00-18:00.' },
                { id: 'holiday', text: 'Abre de 10:00 a 14:00 en el feriado', state: 'unsupported', note: 'Sin respaldo. La fuente dice que el horario de feriado no está disponible, así que "10:00 a 14:00" es una suposición.' },
            ],
            checks: [
                { id: 'question', state: 'pass', label: '¿Responde a la pregunta?', note: 'Sí. El visitante preguntó por el horario de feriado, y la respuesta lo aborda.' },
                { id: 'source', state: 'warn', label: '¿Se apoya en la fuente?', note: 'Parcialmente. "09:00-18:00" se toma de la fuente, pero "10:00 a 14:00" no.' },
                { id: 'invents', state: 'fail', label: '¿Inventa un horario de feriado?', note: 'Sí. "10:00 a 14:00" es un horario que la fuente marca como no disponible.' },
                { id: 'missing', state: 'fail', label: '¿Señala lo que falta?', note: 'No. La respuesta no dice que el horario de feriado no está confirmado.' },
                { id: 'confidence', state: 'fail', label: '¿Nivel de confianza adecuado?', note: 'No. La redacción es demasiado segura para lo que la fuente dice en realidad.' },
            ],
            issue: 'La comprobación encontró una afirmación sin respaldo: la fuente no da un horario de feriado, así que "10:00 a 14:00" es una suposición que hay que quitar.',
            revised: 'Según la fuente aportada aquí, el horario regular es de 09:00 a 18:00. El horario de feriado no está disponible en la fuente.',
            revisedNote: 'La afirmación con respaldo (el horario regular) se mantiene, el horario de feriado inventado se quitó, y el vacío se dice de forma explícita.',
            takeaway: 'Una respuesta puede contener a la vez una afirmación con respaldo y una inventada. La comprobación las separa.',
        },
        {
            id: 'vague',
            control: 'Demasiado cauta',
            badge: 'overcautious',
            badgeLabel: 'Demasiado cauta',
            summary: 'No inventa nada, pero tampoco le responde de verdad al cliente. Este problema se ve incluso antes de comparar con la fuente.',
            draft: 'No sé cuál es el horario de la biblioteca.',
            claims: [
                { id: 'noanswer', text: 'En realidad no responde a la pregunta', state: 'missing', note: 'Problema interno. "No sé" es un callejón sin salida, y eso se ve sin ninguna fuente.' },
                { id: 'unused', text: 'Ignora un dato que sí existe', state: 'missing', note: 'Se pasó por alto. La fuente dice horario regular 09:00-18:00, y la respuesta no lo comunica.' },
            ],
            checks: [
                { id: 'question', state: 'fail', label: '¿Responde a la pregunta?', note: 'No. "No sé" no le da al visitante nada útil. Esto se ve sin comparar con la fuente.' },
                { id: 'source', state: 'fail', label: '¿Se apoya en la fuente?', note: 'No. Hay un dato que se podría haber comunicado, horario regular 09:00-18:00, y la respuesta lo ignora.' },
                { id: 'invents', state: 'pass', label: '¿Inventa un horario de feriado?', note: 'No. Y eso es bueno, aquí no hay ninguna invención.' },
                { id: 'missing', state: 'warn', label: '¿Señala lo que falta?', note: 'No del todo. Dice "no sé" sin separar lo que sí se sabe de lo que no.' },
                { id: 'confidence', state: 'warn', label: '¿Nivel de confianza adecuado?', note: 'Demasiado bajo. Hay un dato que se puede dar con una confianza razonable.' },
            ],
            issue: 'La comprobación encontró un problema interno: la respuesta en realidad no responde a la pregunta. "No sé" es un callejón sin salida que se ve incluso antes de comparar con la fuente. Además, se pasó por alto un dato que sí existe: el horario regular.',
            revised: 'Según la fuente, el horario regular es de 09:00 a 18:00. El horario de feriado no está disponible en la fuente, así que no me comprometeré a una hora exacta.',
            revisedNote: 'Ahora la respuesta sí le responde al cliente: comunica lo que se sabe en lugar de un callejón sin salida. La autocomprobación no solo borra, a veces también completa.',
            takeaway: 'La autocomprobación no solo compara con una fuente. También se hace preguntas internas: ¿respondimos a la pregunta, nos mantuvimos claros, evitamos contradecirnos? Aquí atrapa una respuesta que no cumple su función.',
        },
        {
            id: 'grounded',
            control: 'Equilibrada',
            badge: 'checked',
            badgeLabel: 'Pasó la lista de control',
            summary: 'Usa el dato de la fuente, y admite de forma explícita lo que falta.',
            draft: 'Según la fuente, el horario regular es de 09:00 a 18:00. El horario de feriado todavía no está disponible.',
            claims: [
                { id: 'regular', text: 'Horario regular de 09:00 a 18:00', state: 'supported', note: 'Con respaldo. Aparece en la fuente: horario regular 09:00-18:00.' },
                { id: 'noholiday', text: 'El horario de feriado no está disponible', state: 'supported', note: 'Con respaldo. Aparece en la fuente: horario de feriado no disponible.' },
            ],
            checks: [
                { id: 'question', state: 'pass', label: '¿Responde a la pregunta?', note: 'Sí. Comunica lo que se sabe sobre el horario.' },
                { id: 'source', state: 'pass', label: '¿Se apoya en la fuente?', note: 'Sí. Cada afirmación de la respuesta aparece en la fuente.' },
                { id: 'invents', state: 'pass', label: '¿Inventa un horario de feriado?', note: 'No. No se añadió ningún horario.' },
                { id: 'missing', state: 'pass', label: '¿Señala lo que falta?', note: 'Sí. Dice de forma explícita que el horario de feriado no está disponible.' },
                { id: 'confidence', state: 'pass', label: '¿Nivel de confianza adecuado?', note: 'Sí. Segura con el horario regular, cauta con el horario de feriado.' },
            ],
            issue: 'La comprobación pasó sin ninguna afirmación sin respaldo. No hay nada que borrar ni nada que añadir.',
            revised: 'Según la fuente, el horario regular es de 09:00 a 18:00. El horario de feriado todavía no está disponible.',
            revisedNote: 'Cuando el borrador ya se apoya en la fuente, la comprobación simplemente lo confirma. No toda comprobación termina en una corrección. "Pasó la comprobación" significa que no se encontró ningún problema en la lista de control, no que la información se haya verificado frente al mundo.',
            takeaway: 'La autocomprobación es un paso de control, no siempre una reescritura. Un borrador bien fundamentado la pasa limpio.',
        },
        {
            id: 'external',
            control: 'Una afirmación que necesita una fuente',
            badge: 'needsSource',
            badgeLabel: 'Señalada por la comprobación, pero no se puede verificar',
            summary: 'El borrador añade una suposición que suena razonable, pero no está en la fuente, y la autocomprobación por sí sola no puede saber si es cierta.',
            draft: 'Seguramente la biblioteca abre con horario reducido en el feriado, como la mayoría de las bibliotecas del barrio.',
            claims: [
                { id: 'shortened', text: 'Abre con horario reducido en el feriado', state: 'unsupported', note: 'Sin respaldo. La fuente marca el horario de feriado como no disponible, y no dice que haya un horario reducido. Eso es una generalización añadida.' },
                { id: 'likeothers', text: 'Como la mayoría de las bibliotecas del barrio', state: 'unsupported', note: 'Sin respaldo. No hay ninguna comparación con otras bibliotecas en la fuente, así que es una suposición que no se puede verificar con ella.' },
            ],
            checks: [
                { id: 'question', state: 'pass', label: '¿Responde a la pregunta?', note: 'Sí. Aborda el horario de feriado.' },
                { id: 'source', state: 'fail', label: '¿Se apoya en la fuente?', note: 'No. "Reducido" y "como la mayoría de las bibliotecas" no aparecen en la fuente.' },
                { id: 'invents', state: 'fail', label: '¿Inventa un detalle?', note: 'Sí. Añadió una generalización y un patrón sin ninguna fuente.' },
                { id: 'missing', state: 'warn', label: '¿Señala lo que falta?', note: 'No. No dice que la generalización no se puede confirmar con esta información.' },
                { id: 'confidence', state: 'fail', label: '¿Nivel de confianza adecuado?', note: 'No. Presenta una suposición como si fuera un hecho.' },
            ],
            issue: 'La comprobación señala que "abre con horario reducido" no se apoya en la fuente. Pero fíjate: no puede saber si es cierto o no. Para verificar una suposición así necesitas una fuente externa, no una autocomprobación.',
            revised: 'Según la fuente aportada aquí, el horario regular es de 09:00 a 18:00. No puedo confirmar con esta información si hay un horario reducido en el feriado. Para averiguar el horario de feriado real, habría que consultarlo con la propia biblioteca o con un aviso oficial.',
            revisedNote: 'La comprobación detuvo una afirmación sin respaldo, pero no la convirtió en verdad. Lo que requiere una verificación de hechos pasa a una fuente externa, y el vacío se dice de forma explícita.',
            takeaway: 'La autocomprobación atrapa una afirmación que no tiene fuente, pero no puede verificarla. La verificación de hechos requiere una fuente, una herramienta o una persona.',
        },
    ],
};
