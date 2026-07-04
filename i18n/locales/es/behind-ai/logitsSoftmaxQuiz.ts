// i18n/locales/es/behind-ai/logitsSoftmaxQuiz.ts
//
// Cadenas del cuestionario de comprensión del capítulo 8 (Logits & Softmax),
// traducción al español. El hebreo es la fuente de la verdad y define la forma del tipo.
//
// Importante: esto es solo el texto de la interfaz. El mecanismo compartido (correctAnswer,
// difficulty, concept, onComplete, getReviewLinks, nextHref) queda en quizData.ts compartido
// (logitsSoftmaxQuiz, ruta del capítulo 8) y no se toca aquí. La página del capítulo mezcla
// el texto sobre el esqueleto de preguntas según el id de la pregunta (byId).
//
// El orden de las options debe mantenerse idéntico al esqueleto compartido, porque
// correctAnswer es un índice numérico.
//
// Sin raya larga (U+2014) ni raya media (U+2013).

export interface LogitsSoftmaxQuizText {
    question: string;
    options: string[];
    explanation: string;
}

/** Identificadores de las preguntas del capítulo 8. byId debe incluirlos todos. */
export type LogitsSoftmaxQuizId = 1 | 2 | 3 | 4 | 5;

export const logitsSoftmaxQuiz = {
    title: 'Prueba de comprensión: Logits & Softmax',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en el capítulo',
    startLabel: 'Empieza la prueba',
    submitLabel: 'Finalizar la prueba',
    completedTitle: 'Terminaste la prueba',

    /** Texto de la interfaz para cada pregunta, según el id en el esqueleto compartido (logitsSoftmaxQuiz). */
    byId: {
        1: {
            question: '¿Qué son los Logits, las puntuaciones en bruto del modelo?',
            options: [
                'La respuesta final que el modelo ya eligió',
                'Puntuaciones internas que el modelo da a cada continuación posible, antes de que se conviertan en probabilidades',
                'La lista de hechos que el modelo verificó contra el mundo',
                'El grado de confianza humana del modelo en la respuesta',
            ],
            explanation:
                'Los Logits son puntuaciones en bruto que el modelo da a cada continuación posible, según el input y el contexto. Es una etapa anterior a las probabilidades, no la respuesta final ni una verificación de hechos, y tampoco una emoción o una confianza humana.',
        },
        2: {
            question: '¿Qué hace Softmax con las puntuaciones en bruto?',
            options: [
                'Busca en internet qué continuación es correcta',
                'Borra las continuaciones con la puntuación más baja',
                'Convierte las puntuaciones en una distribución de probabilidad, de modo que todas las continuaciones juntas suman 100 por ciento',
                'Guarda las puntuaciones para las próximas conversaciones',
            ],
            explanation:
                'Softmax toma las puntuaciones en bruto y las convierte en una distribución de probabilidad, un porcentaje para cada continuación, sumando todas 100. No verifica hechos ni borra opciones, solo convierte puntuaciones en porcentajes que se pueden comparar.',
        },
        3: {
            question: 'Una continuación obtuvo la probabilidad más alta. ¿Qué significa eso?',
            options: [
                'Que la continuación es correcta con certeza',
                'Que el modelo comprobó la realidad y la confirmó',
                'Que, según el contexto y los patrones que aprendió, es la continuación más probable entre las mostradas',
                'Que Softmax la verificó contra una fuente externa',
            ],
            explanation:
                'Una probabilidad alta significa que la continuación es la más probable según el input, el contexto y los patrones que el modelo aprendió. No es una prueba de que sea verdadera en el mundo. Softmax ordena puntuaciones en porcentajes, no comprueba si la continuación es real.',
        },
        4: {
            question: 'Añadiste al contexto "confirmación de entrega", y la probabilidad de "se entregó" saltó. ¿Por qué ocurrió?',
            options: [
                'Porque el modelo consultó el sistema de seguimiento y comprobó que el paquete se entregó',
                'Porque el nuevo contexto cambió las puntuaciones en bruto, y por eso también se movieron las probabilidades',
                'Porque "se entregó" siempre recibe la puntuación más alta',
                'Porque Softmax elige la continuación más positiva',
            ],
            explanation:
                'Las probabilidades se derivan de las puntuaciones, y las puntuaciones dependen del contexto. Cuando se añade "confirmación de entrega", la puntuación de "se entregó" sube, y por eso también su porcentaje. El modelo no comprobó la realidad, solo volvió a ponderar lo que está escrito.',
        },
        5: {
            question: 'El modelo le dio a "se entregó" una probabilidad alta, pero en la práctica el paquete no se entregó. ¿Dónde está el fallo en deducir que "probabilidad alta significa que se comprobó"?',
            options: [
                'No hay fallo, una probabilidad alta siempre significa que la información se verificó',
                'El fallo es que el modelo no debería dar probabilidades en absoluto',
                'Una probabilidad alta mide el ajuste al texto y al contexto, no comprobó el mundo. Para verificar hace falta una fuente o una herramienta',
                'El fallo es que "se entregó" no puede recibir una probabilidad alta',
            ],
            explanation:
                'Una probabilidad alta significa que la continuación encaja con lo que se escribió, no que sea correcta. El modelo no consultó ninguna fuente externa. Para saber si el paquete se entregó de verdad hace falta una herramienta de seguimiento o una fuente verificada, no la probabilidad por sí sola.',
        },
    } satisfies Record<LogitsSoftmaxQuizId, LogitsSoftmaxQuizText>,
};
