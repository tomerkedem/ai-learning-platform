// i18n/locales/es/behind-ai/mistakeLearningQuiz.ts
//
// Texto de la evaluación del capítulo 14 en español ("Learning from Mistakes: cómo un modelo
// mejora a partir de un error"). El hebreo es la fuente de la verdad.
//
// Esto es solo texto de presentación. La mecánica compartida (correctAnswer, difficulty,
// concept, onComplete, getReviewLinks, nextHref) vive en el quizData.ts compartido. La página
// del capítulo fusiona este texto sobre el esqueleto de preguntas por id (byId), así que el
// orden de las opciones debe mantenerse idéntico en todos los idiomas.
//
// Traducción de primera pasada, pendiente de revisión por un hablante nativo.
//
// Sin raya (U+2014) ni guion largo (U+2013), sin referencias a años.

import type { MistakeLearningQuizId, MistakeLearningQuizText } from '../../he/behind-ai/mistakeLearningQuiz';

export const mistakeLearningQuiz = {
    title: 'Comprobación: cómo un modelo mejora a partir de un error',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en este capítulo',
    startLabel: 'Empezar la evaluación',
    submitLabel: 'Terminar la evaluación',
    completedTitle: 'Terminaste la evaluación',

    byId: {
        1: {
            question: 'El mismo error se repite una y otra vez con muchos usuarios. ¿Qué lo convierte en una mejora real?',
            options: [
                'La corrección en la conversación ya mejoró por sí sola el modelo para todos los usuarios',
                'Recoger el error como ejemplo, revisarlo, probar una corrección candidata, y publicarla solo si la evaluación muestra que ayuda',
                'Esperar a que el modelo aprenda solo después de suficientes veces',
                'Pedir a los usuarios que formulen la pregunta de otra manera',
            ],
            explanation:
                'Una corrección aislada es una señal, no una actualización del modelo. La mejora real es un proceso controlado: se recoge el error como ejemplo, se revisa, se prueba una corrección candidata en el sistema o en el entrenamiento, y se mide con una evaluación si el cambio ayudó de verdad antes de publicarlo.',
        },
        2: {
            question: '¿Por qué una corrección en el chat no cambia de forma automática el modelo base?',
            options: [
                'Porque usar la corrección dentro del contexto no es lo mismo que entrenar o cambiar los pesos',
                'Porque el modelo ni siquiera lee la corrección',
                'Porque las correcciones solo se guardan después de tres veces',
                'Porque el modelo siempre tiene razón y en realidad no hay nada que corregir',
            ],
            explanation:
                'Usar la corrección dentro de la conversación ocurre en el contexto. Entrenar o cambiar el modelo de forma permanente es un proceso totalmente distinto, aparte y lento, que no ocurre por sí solo a partir de un mensaje.',
        },
        3: {
            question: 'Un equipo nota que el modelo inventa una y otra vez un horario de feriado sin fuente. ¿Cómo puede mejorar el sistema sin cambiar el modelo base?',
            options: [
                'Esperar a que el modelo se corrija a sí mismo solo',
                'Cambiar la instrucción, mejorar la fuente, añadir una regla y añadir una comprobación',
                'Borrar todas las conversaciones de los usuarios',
                'Pedir a los usuarios que formulen la pregunta de otra manera',
            ],
            explanation:
                'Un error que se repite es un patrón. Se puede corregir en el sistema que envuelve al modelo: una instrucción mejor, una fuente más precisa, una regla que evite el error, y una comprobación que lo detecte. Todo esto sin cambiar el modelo base.',
        },
        4: {
            question: 'Un equipo cambió la instrucción para corregir un error. ¿Por qué todavía hace falta una evaluación antes de anunciar que mejoraron?',
            options: [
                'Porque la evaluación ralentiza el sistema y por eso es obligatoria',
                'Para confirmar con una medición que el cambio de verdad ayuda, y no rompió otra cosa',
                'Porque sin evaluación el modelo no respondería en absoluto',
                'Porque la evaluación sustituye la necesidad de corregir',
            ],
            explanation:
                'Un cambio puede corregir un caso y romper otro. La evaluación prueba muchos casos y mide si de verdad mejoramos. Sin medición, "lo arreglamos" es una sensación, no un dato.',
        },
        5: {
            question: 'Quieres que el modelo corrija la respuesta de la forma más útil. ¿Qué corrección es mejor?',
            options: [
                '"No es correcto."',
                '"No es correcto. La fuente da el horario regular, pero no indica un horario de feriado. Corrige para que te apoyes solo en la fuente."',
                '"Escribe una respuesta más bonita."',
                '"Borra todo y empieza de nuevo."',
            ],
            explanation:
                'Una corrección útil dice qué está mal, qué dice de verdad la fuente, y qué cambiar. Así el modelo puede corregir la respuesta ahora según el contexto, en lugar de adivinar qué querías decir.',
        },
    } satisfies Record<MistakeLearningQuizId, MistakeLearningQuizText>,
};
