// i18n/locales/es/behind-ai/contextWindowLab.ts
//
// Datos del laboratorio de la ventana de contexto del capítulo 7 (Context Window),
// traducción al español. El hebreo es la fuente de la verdad y define la forma del
// tipo (ContextWindowLabContent).
//
// Importante: aquí vive todo el texto y los datos dependientes del idioma de
// ContextWindowLab. Los mensajes de la conversación, el dato crítico, las respuestas
// del modelo y el prompt independiente dependen del idioma porque la redacción, el
// orden y el largo de las líneas cambian en cada idioma, y la dirección de lectura
// también cambia (RTL frente a LTR). Por eso messages y states se definen por separado
// para cada idioma. El mapeo de tonos (tone -> color) queda en el componente.
//
// Esto es una ilustración didáctica de la idea, no una medición exacta del límite de
// tokens.
//
// Sin raya larga (U+2014) ni raya media (U+2013).

import type { ContextWindowLabContent } from '../../he/behind-ai/contextWindowLab';

export const contextWindowLab: ContextWindowLabContent = {
    sectionEyebrow: 'Context Window Lab',
    sectionTitle: 'Mueve la ventana de contexto y descubre qué más ve el modelo',
    sectionIntro:
        'Al principio de la conversación se dijo que la reunión es el jueves a las 18:00. Ahora, después de muchos mensajes, un participante vuelve a preguntar. Cambia el estado de la ventana y observa cómo cambia la respuesta del modelo cuando el dato crítico está dentro, cuando queda fuera, y cuando lo devuelves al prompt.',
    heading: 'Qué hay ahora dentro de la ventana de contexto',
    kicker: 'Context window lab',
    pickHint: 'Elige un estado. Veremos qué entra en la ventana y qué se queda fuera.',
    conversationLabel: 'La conversación hasta ahora',
    outsideLabel: 'Fuera de la ventana de contexto',
    insideLabel: 'Dentro de la ventana de contexto',
    earlierMessages: 'Mensajes anteriores de la conversación',
    modelSeesLabel: 'Qué ve el modelo ahora',
    standaloneLabel: 'El prompt independiente que escribiste',
    answerLabel: 'La respuesta del modelo',
    criticalTag: 'Dato crítico',
    disclaimer:
        'Esto es una ilustración didáctica de la idea, no una medición exacta del límite de tokens. Distintos sistemas y modelos gestionan la ventana de otra manera. Aquí el objetivo es mostrar un solo principio: el modelo responde según lo que hay dentro de la ventana de contexto ahora, no según todo lo que se dijo alguna vez.',
    toneLabels: {
        specific: 'Respuesta concreta',
        generic: 'Respuesta genérica',
        restored: 'Buena respuesta otra vez',
    },
    roleLabels: {
        user: 'Agente',
        agent: 'El modelo',
    },
    sr: {
        group: 'Elección del estado de la ventana de contexto',
        inside: 'Dentro de la ventana',
        outside: 'Fuera de la ventana',
    },
    messages: [
        { id: 'm1', role: 'user', critical: true, text: 'La reunión es el jueves a las 18:00.' },
        { id: 'm2', role: 'user', text: 'Uno de los participantes escribió que está organizando su semana en torno a ella.' },
        { id: 'm3', role: 'agent', text: 'Entendido. Reviso la solicitud y vuelvo contigo.' },
        { id: 'm4', role: 'user', text: 'Ahora envió otro mensaje y pide una respuesta.' },
        { id: 'm5', role: 'user', text: '¿Qué conviene responderle?' },
    ],
    states: [
        {
            id: 'inside',
            control: 'El dato dentro de la ventana',
            visibleIds: ['m1', 'm2', 'm3', 'm4', 'm5'],
            answer:
                'Avísale de que la reunión es el jueves a las 18:00, y de que puede incorporarse unos minutos antes.',
            answerTone: 'specific',
            caption:
                'El dato crítico, que la reunión es el jueves a las 18:00, se encuentra dentro de la ventana. El modelo lo ve ahora, así que puede dar una respuesta concreta que indica al participante el día y la hora correctos.',
        },
        {
            id: 'grew',
            control: 'La conversación se alargó',
            visibleIds: ['m3', 'm4', 'm5'],
            answer:
                'Me falta información sobre el día o la hora de la reunión, así que solo puedo responder de forma general. Conviene comprobar cuándo está fijada la reunión antes de redactar una respuesta precisa.',
            answerTone: 'generic',
            caption:
                'La conversación se alargó, y el mensaje con el dato crítico ya salió de la ventana de contexto. El mensaje antiguo quizá siga visible en la pantalla, en el hilo de la conversación, pero no necesariamente se incluye en el input que se envía al modelo en este turno. El modelo no lo ve ahora, así que se ve obligado a responder de forma genérica o a pedir la información que falta. El dato existe en el historial, pero no dentro de lo que el modelo procesa en este momento.',
        },
        {
            id: 'restored',
            control: 'Prompt independiente',
            visibleIds: [],
            standalonePrompt:
                'La reunión es el jueves a las 18:00. Un participante pregunta qué conviene responderle. Redacta una respuesta corta y clara.',
            answer:
                'Como la reunión es el jueves a las 18:00, puedes responderle al participante: la reunión es el jueves a las 18:00, y puedes incorporarte unos minutos antes.',
            answerTone: 'restored',
            caption:
                'En lugar de apoyarnos en una conversación larga y desordenada, escribimos un único prompt independiente que incluye el dato crítico. Ahora el modelo vuelve a ver el día y la hora dentro del input actual, y puede dar una buena respuesta, sin depender de lo que se dijo antes.',
        },
    ],
};
