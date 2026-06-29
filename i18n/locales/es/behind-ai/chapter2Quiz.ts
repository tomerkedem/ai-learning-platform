// i18n/locales/es/behind-ai/chapter2Quiz.ts
// Spanish Chapter 2 quiz display text. Shape source: ../../he/behind-ai/chapter2Quiz.
// Mechanics (correctAnswer, difficulty, concept) stay in the shared quizData.ts; the
// page merges this display text by question id. Option order matches the Hebrew source
// so the stored correctAnswer index stays valid. concept keys stay Hebrew (stable);
// conceptLabels provide the translated display label.
//
// No em dash (U+2014), no en dash (U+2013). "Model Input", "model", and the tracking
// number wording are kept consistent with the chapter body.

export const chapter2Quiz = {
    title: 'Comprobación de conocimientos: Model Input',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en este capítulo',
    startLabel: 'Comenzar el cuestionario',
    submitLabel: 'Terminar el cuestionario',
    completedTitle: 'Terminaste el cuestionario',

    byId: {
        1: {
            question: 'Cuando envías un mensaje al chat, ¿qué recibe el modelo antes que nada?',
            options: [
                'Tu intención, incluso antes de las palabras',
                'El texto que escribiste de verdad, y a partir de él el modelo deduce',
                'La respuesta final que debe devolver',
                'Solo las palabras que el sistema marcó como importantes',
            ],
            explanation:
                'El modelo no recibe la intención como entrada directa ni una respuesta ya hecha. El punto de partida es el texto escrito: las palabras, el orden y la puntuación. A partir de ahí deduce, y todas las demás etapas empiezan con esta entrada.',
        },
        2: {
            question: 'Un usuario escribe "Mi paquete no llegó?" sin ningún otro detalle. ¿Qué dice esto sobre lo que el modelo puede hacer?',
            options: [
                'El modelo sabe exactamente qué paquete y cuándo, porque la intención es clara',
                'Faltan detalles, así que es probable que el modelo adivine, pregunte o responda de forma general',
                'El modelo ignorará el mensaje porque no tiene suficiente información',
                'El modelo sacará la respuesta correcta de un banco de respuestas',
            ],
            explanation:
                'Lo que no se escribió es parte de la historia. Sin un número de seguimiento ni detalles, el modelo no tiene en qué apoyarse para comprobar un caso concreto. Por eso la conducta razonable es preguntar qué falta o responder de forma general, no inventar detalles.',
        },
        3: {
            question:
                '"Mi paquete no llegó. ¿Qué hago?" frente a "Mi paquete no llegó?". La misma intención, pero ¿cuál es la diferencia desde el punto de vista del modelo?',
            options: [
                'Ninguna diferencia, porque ambos mensajes tratan del mismo paquete',
                'La primera formulación pide orientación de forma explícita, mientras que la segunda se queda en una duda sin una petición clara',
                'La diferencia es solo de longitud, y eso no influye',
                'La segunda es más clara porque tiene un signo de interrogación',
            ],
            explanation:
                'Mismo tema, pero la formulación decide lo que el modelo recibe. "Qué hago" es una petición explícita de orientación, mientras que una pregunta corta sin petición deja ambigüedad. Un pequeño cambio de formulación cambia la tarea que el modelo enfrenta.',
        },
        4: {
            question: 'El usuario añade "El número de seguimiento es 12345". ¿Por qué cambia esto lo que el modelo puede hacer?',
            options: [
                'Porque un número largo siempre tiene prioridad para el modelo',
                'Porque ahora hay un identificador que permite comprobar un estado real, en lugar de adivinar',
                'Porque el número le dice al modelo que es una solicitud urgente',
                'Porque los números hacen que el modelo responda más rápido',
            ],
            explanation:
                'El identificador no es solo más texto. Convierte una solicitud general en algo que se puede comprobar contra un sistema de seguimiento externo. La nueva entrada abre una opción de acción que antes no existía, y puede desplazar la conducta hacia una comprobación real.',
        },
        5: {
            question: 'En medio de una conversación el usuario escribe "No zapatos, pedí un libro". ¿Qué cambia esto de verdad?',
            options: [
                'Reentrena el modelo para que lo recuerde en todas las conversaciones futuras',
                'Actualiza el contexto actual de la conversación, pero no cambia lo que el modelo aprendió en el entrenamiento',
                'No cambia nada, porque el modelo ya respondió',
                'Borra todo lo dicho antes en la conversación',
            ],
            explanation:
                'Una corrección en la conversación cambia el contexto con el que el modelo trabaja ahora, así que las siguientes respuestas de la conversación lo tendrán en cuenta. Pero esto no es entrenamiento: los pesos del modelo no cambian, y en cuanto la conversación termina, la corrección no se guarda. Esta distinción se desarrolla en profundidad en el capítulo sobre aprendizaje y memoria.',
        },
    },

    conceptLabels: {
        'קלט הוא טקסט': 'La entrada es texto',
        'מה שחסר משנה': 'Lo que falta importa',
        'ניסוח משנה משימה': 'La formulación cambia la tarea',
        'מזהה פותח אפשרות': 'Un identificador abre una opción',
        'תיקון משנה הקשר לא אימון': 'Una corrección cambia el contexto, no el entrenamiento',
    } as Record<string, string>,
};
