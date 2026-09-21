// i18n/locales/es/behind-ai/contextWindowQuiz.ts
//
// Cadenas del cuestionario de comprensión del capítulo 7 (Context Window),
// traducción al español. El hebreo es la fuente de la verdad y define la forma del tipo.
//
// Importante: esto es solo el texto de la interfaz. El mecanismo compartido (correctAnswer,
// difficulty, concept, onComplete, getReviewLinks, nextHref) queda en quizData.ts compartido
// (contextWindowQuiz, ruta del capítulo 7) y no se toca aquí. La página del capítulo mezcla
// el texto sobre el esqueleto de preguntas según el id de la pregunta (byId).
//
// El orden de las options debe mantenerse idéntico al esqueleto compartido, porque
// correctAnswer es un índice numérico.
//
// Sin raya larga (U+2014) ni raya media (U+2013).

import type { ContextWindowQuizText, ContextWindowQuizId } from '../../he/behind-ai/contextWindowQuiz';

export const contextWindowQuiz = {
    title: 'Prueba de comprensión: Context Window',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en el capítulo',
    startLabel: 'Empieza la prueba',
    submitLabel: 'Finalizar la prueba',
    completedTitle: 'Terminaste la prueba',

    /** Texto de la interfaz para cada pregunta, según el id en el esqueleto compartido. */
    byId: {
        1: {
            question: '¿Qué es la ventana de contexto (Context Window) del modelo?',
            options: [
                'Todo lo que el usuario escribió alguna vez, en todas las conversaciones',
                'La información que hay ahora mismo en el input que el modelo procesa, y solo según ella responde',
                'Una memoria permanente donde el modelo guarda datos sobre el usuario',
                'El banco de respuestas ya preparadas del modelo',
            ],
            explanation:
                'La ventana de contexto es la información que hay ahora mismo en el input que el modelo procesa. El modelo responde según lo que hay dentro de la ventana ahora, no según todo lo que se dijo alguna vez ni según una memoria personal permanente.',
        },
        2: {
            question: 'En una conversación larga, ¿por qué un dato dicho al principio puede dejar de influir en la respuesta?',
            options: [
                'Porque el modelo decide a propósito ignorar los datos anteriores',
                'Porque en una conversación larga los datos anteriores pueden salir de la ventana de contexto, y el modelo ya no los ve',
                'Porque los datos anteriores siempre son menos importantes que los datos nuevos',
                'Porque el modelo se cansa y olvida como una persona',
            ],
            explanation:
                'En una conversación larga, lo que se dijo al principio puede salir de la ventana de contexto. No es un olvido humano ni una decisión intencionada, sino simplemente que el dato ya no está dentro de lo que el modelo procesa ahora.',
        },
        3: {
            question:
                'Al principio de una conversación larga se escribió "la reunión es el jueves a las 18:00". Después de muchos mensajes el usuario pregunta qué responder, y el modelo responde de forma genérica. ¿Qué es lo más correcto?',
            options: [
                'El modelo recuerda el dato, pero eligió a propósito no usarlo',
                'El dato probablemente salió de la ventana de contexto, y por eso el modelo ya no se apoya en él',
                'El modelo nunca llegó a leer el dato en primer lugar',
                'El modelo necesita que se lo recordemos con enfado para que lo recuerde',
            ],
            explanation:
                'La ventana de contexto no es una memoria humana. El dato se dijo, pero en una conversación larga puede salir de la ventana. Si no está dentro de lo que el modelo procesa ahora, el modelo no se apoyará en él, aunque exista en algún punto del historial.',
        },
        4: {
            question: '¿Por qué un prompt independiente es más seguro para una tarea importante?',
            options: [
                'Porque un prompt largo siempre impresiona más al modelo',
                'Porque un prompt independiente lleva los datos críticos dentro de sí mismo, y no depende de lo que quizá ya salió de la ventana',
                'Porque el modelo prefiere las instrucciones educadas',
                'Porque hace que el modelo recuerde la conversación para siempre',
            ],
            explanation:
                'Un prompt independiente incluye dentro de sí el objetivo y los datos críticos. Así la tarea no depende de lo que se dijo antes y quizá ya salió de la ventana de contexto. Para tareas importantes esto es más seguro que apoyarse en algo que quizá ya no está.',
        },
        5: {
            question:
                'El modelo "olvidó" un dato importante que le diste antes en una conversación larga. ¿Cuál es el paso más útil?',
            options: [
                'Repetir exactamente la misma pregunta y esperar que esta vez lo recuerde',
                'Suponer que hay un fallo y abrir una solicitud a soporte',
                'Volver a poner el dato crítico dentro del prompt actual, de forma explícita',
                'Escribirle al modelo que tiene que recordarlo todo',
            ],
            explanation:
                'Si el modelo "olvidó", lo más probable es que el dato haya salido de la ventana de contexto. La solución práctica no es pelear con el modelo, sino devolver el dato crítico al prompt actual, de forma explícita, junto con el objetivo y lo que ya se decidió. Así la información vuelve a estar dentro de lo que el modelo procesa ahora.',
        },
    } satisfies Record<ContextWindowQuizId, ContextWindowQuizText>,
};
