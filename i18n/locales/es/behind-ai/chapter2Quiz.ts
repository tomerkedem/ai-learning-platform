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
                'El modelo ignorará el mensaje porque no tiene suficiente información',
                'Faltan detalles, así que es probable que el modelo adivine, pregunte o responda de forma general',
                'El modelo sacará la respuesta correcta de un banco de respuestas',
            ],
            explanation:
                'Lo que no se escribió es parte de la historia. Sin un número de seguimiento ni detalles, el modelo no tiene en qué apoyarse para comprobar un caso concreto. Por eso la conducta razonable es preguntar qué falta o responder de forma general, no inventar detalles.',
        },
        3: {
            question:
                '"Mi paquete no llegó. ¿Qué hago?" frente a "Mi paquete no llegó?". La misma intención, pero ¿cuál es la diferencia desde el punto de vista del modelo?',
            options: [
                'La primera formulación pide orientación de forma explícita, mientras que la segunda se queda en una duda sin una petición clara',
                'Ninguna diferencia, porque ambos mensajes tratan del mismo paquete',
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
                'Porque los números hacen que el modelo responda más rápido',
                'Porque el número le dice al modelo que es una solicitud urgente',
                'Porque ahora hay un identificador que permite comprobar un estado real, en lugar de adivinar',
            ],
            explanation:
                'El identificador no es solo más texto. Convierte una solicitud general en algo que se puede comprobar contra un sistema de seguimiento externo. La nueva entrada abre una opción de acción que antes no existía, y puede desplazar la conducta hacia una comprobación real.',
        },
        5: {
            question: 'En medio de una conversación sobre zapatos, el usuario escribe "No zapatos, pedí un libro". ¿Qué hace este mensaje?',
            options: [
                'Borra todo lo dicho antes en la conversación',
                'Actualiza el contexto actual, así que de aquí en adelante el modelo lo trata como un libro, no como zapatos',
                'No cambia nada, porque el modelo ya entendió zapatos',
                'Cambia el modelo mismo para siempre, en todas las conversaciones futuras',
            ],
            explanation:
                'La corrección entra como nueva entrada y actualiza el contexto de la conversación actual, así que las siguientes respuestas trabajan con el libro. No cambia el modelo mismo, solo lo que tiene delante en esta conversación.',
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
