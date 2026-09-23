// i18n/locales/es/behind-ai/chapter2Quiz.ts
// Spanish Chapter 2 quiz display text. Shape source: ../../he/behind-ai/chapter2Quiz.
// Mechanics (correctAnswer, difficulty, concept) stay in the shared quizData.ts; the
// page merges this display text by question id. Option order matches the Hebrew source
// so the stored correctAnswer index stays valid. concept keys stay Hebrew (stable);
// conceptLabels provide the translated display label.
//
// No em dash (U+2014), no en dash (U+2013). "Model Input", "model", and the error
// code wording are kept consistent with the chapter body.

export const chapter2Quiz = {
    title: 'Comprobación de conocimientos: Model Input',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en este capítulo',
    startLabel: 'Comenzar el cuestionario',
    submitLabel: 'Terminar el cuestionario',
    completedTitle: 'Terminaste el cuestionario',

    byId: {
        1: {
            question: '¿El mensaje que el usuario ve en el chat es siempre toda la entrada que se pasa al modelo?',
            options: [
                'Sí. Al modelo solo se le puede pasar el texto visible, sin ningún añadido.',
                'No. Es parte de la entrada, pero la aplicación también puede añadir instrucciones, historial de la conversación u otro contexto.',
                'No. El modelo también conoce automáticamente lo que el usuario omitió.',
                'Sí. El contexto oculto solo existe después de que el texto se divide en tokens.',
            ],
            explanation:
                'El mensaje visible es parte de la entrada, pero no necesariamente toda. Una aplicación de IA puede añadir instrucciones, partes anteriores de la conversación u otro contexto, y esto varía de una aplicación a otra. El modelo no recibe automáticamente lo que no se escribió ni se adjuntó, y lo que falta sigue faltando.',
        },
        2: {
            question: 'Un usuario escribe "¿Mi impresora no funciona?" sin ningún otro detalle. ¿Qué dice esto sobre lo que el modelo puede hacer?',
            options: [
                'El modelo sabe exactamente qué impresora y cuándo se averió, porque la intención es clara',
                'El modelo ignorará el mensaje porque no tiene suficiente información',
                'Faltan detalles, así que es probable que el modelo adivine, pregunte o responda de forma general',
                'El modelo sacará la respuesta correcta de un banco de respuestas',
            ],
            explanation:
                'Lo que no se escribió es parte de la historia. Sin un código de error ni detalles, el modelo no tiene en qué apoyarse para comprobar un caso concreto. Por eso la conducta razonable es preguntar qué falta o responder de forma general, no inventar detalles.',
        },
        3: {
            question:
                '"Mi impresora no funciona. ¿Qué hago?" frente a "¿Mi impresora no funciona?". La misma intención, pero ¿cuál es la diferencia desde el punto de vista del modelo?',
            options: [
                'La primera formulación pide orientación de forma explícita, mientras que la segunda se queda en una duda sin una petición clara',
                'Ninguna diferencia, porque ambos mensajes tratan de la misma impresora',
                'La diferencia es solo de longitud, y eso no influye',
                'La segunda es más clara porque tiene un signo de interrogación',
            ],
            explanation:
                'Mismo tema, pero la formulación decide lo que el modelo recibe. "Qué hago" es una petición explícita de orientación, mientras que una pregunta corta sin petición deja ambigüedad. Un pequeño cambio de formulación cambia la tarea que el modelo enfrenta.',
        },
        4: {
            question: 'El usuario añade "El código de error es 12345". ¿Por qué cambia esto lo que el modelo puede hacer?',
            options: [
                'Porque un número largo siempre tiene prioridad para el modelo',
                'Porque los números hacen que el modelo responda más rápido',
                'Porque el número le dice al modelo que es una solicitud urgente',
                'Porque ahora hay un identificador que permite comprobar un estado real, en lugar de adivinar',
            ],
            explanation:
                'El identificador no es solo más texto. Convierte una solicitud general en algo que se puede comprobar contra un sistema de diagnóstico externo. La nueva entrada abre una opción de acción que antes no existía, y puede desplazar la conducta hacia una comprobación real.',
        },
        5: {
            question: 'En medio de una conversación sobre una impresora, el usuario escribe "No la impresora, quise decir el escáner". ¿Qué hace este mensaje?',
            options: [
                'Borra todo lo dicho antes en la conversación',
                'Actualiza el contexto actual, así que de aquí en adelante el modelo lo trata como el escáner, no como la impresora',
                'No cambia nada, porque el modelo ya entendió impresora',
                'Cambia el modelo mismo para siempre, en todas las conversaciones futuras',
            ],
            explanation:
                'La corrección entra como nueva entrada y actualiza el contexto de la conversación actual, así que las siguientes respuestas trabajan con el escáner. No cambia el modelo mismo, solo lo que tiene delante en esta conversación.',
        },
    },

    conceptLabels: {
        'הודעה גלויה אינה כל הקלט': 'El mensaje visible no es toda la entrada',
        'מה שחסר משנה': 'Lo que falta importa',
        'ניסוח משנה משימה': 'La formulación cambia la tarea',
        'מזהה פותח אפשרות': 'Un identificador abre una opción',
        'תיקון משנה הקשר לא אימון': 'Una corrección cambia el contexto, no el entrenamiento',
    } as Record<string, string>,
};
