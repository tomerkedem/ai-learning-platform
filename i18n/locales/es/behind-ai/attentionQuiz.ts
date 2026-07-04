// i18n/locales/es/behind-ai/attentionQuiz.ts
//
// Cadenas del cuestionario de comprensión del capítulo 6 (Attention), traducción al español.
// El hebreo es la fuente de la verdad y define la forma del tipo.
//
// Importante: esto es solo el texto de la interfaz. El mecanismo compartido (correctAnswer,
// difficulty, concept, onComplete, getReviewLinks, nextHref) queda en quizData.ts compartido
// y no se toca aquí. La página del capítulo mezcla el texto sobre el esqueleto de preguntas
// según el id de la pregunta (byId).
//
// El orden de las options debe mantenerse idéntico al esqueleto compartido, porque
// correctAnswer es un índice numérico.
//
// Sin raya larga (U+2014) ni raya media (U+2013).

import type { AttentionQuizText, AttentionQuizId } from '../../he/behind-ai/attentionQuiz';

export const attentionQuiz = {
    title: 'Prueba de comprensión: Attention',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en el capítulo',
    startLabel: 'Empieza la prueba',
    submitLabel: 'Finalizar la prueba',
    completedTitle: 'Terminaste la prueba',

    /** Texto de la interfaz para cada pregunta, según el id en el esqueleto compartido. */
    byId: {
        1: {
            question: '¿En esa misma frase, hay una única palabra que siempre será la más importante para el modelo?',
            options: [
                'Sí, cada frase tiene una palabra clave que el modelo marca y de la que sale la respuesta',
                'No, la palabra que atrae más peso cambia según lo que el modelo procesa en ese momento',
                'Sí, siempre la primera palabra de la frase',
                'Sí, siempre la última palabra de la frase',
            ],
            explanation:
                'La importancia no es una propiedad fija de una palabra. En el laboratorio vimos que al quitar el "pero" o cambiar el estado, el foco de la atención se movió. El mismo modelo, pero el peso pasa de una palabra a otra según lo que dice la frase.',
        },
        2: {
            question: '¿Qué descripción se acerca más a lo que Attention realmente hace?',
            options: [
                'Una especie de resaltador que marca una sola vez las palabras importantes',
                'Un mecanismo de relaciones que decide, para cada parte que procesa, qué otras partes del contexto la influyen',
                'Comprueba en bases de datos externas si lo escrito es correcto',
                'Traduce la frase al inglés para que sea más fácil procesarla',
            ],
            explanation:
                'Attention no es un resaltador que marca palabras una sola vez. Es un mecanismo de relaciones: en cada momento se pregunta, en el fondo, qué otras partes del contexto deben influir en la parte que se procesa ahora. La respuesta cambia de un momento a otro.',
        },
        3: {
            question: 'Cuando se dice que el modelo "presta atención" a cierta palabra, ¿cuál es el significado exacto?',
            options: [
                'El modelo es consciente de la palabra y siente que es importante, como una persona que lee',
                'El modelo se detiene un momento en la palabra y la entiende a fondo antes de seguir',
                'Es una ponderación computacional de vínculos entre partes del texto, sin conciencia y sin emoción',
                'El modelo marca la palabra para recordarla en las siguientes conversaciones',
            ],
            explanation:
                '"Presta atención" es una metáfora cómoda, pero aquí no hay conciencia, emoción ni una pausa como la de una persona. Attention es un cálculo que pondera cuánto se relacionan entre sí las partes del texto, y así mezcla la información. Es un mecanismo, no una conciencia.',
        },
        4: {
            question: 'En el laboratorio quitamos el "pero" y luego cambiamos "nunca lo recibió" por "lo recibió tarde". ¿Qué nos enseña esto sobre la atención?',
            options: [
                'Las palabras de enlace y de negación son adorno, no cambian lo que el modelo pondera',
                'Palabras como "pero" y "no" orientan la atención hacia el vínculo correcto, y cambiarlas mueve el foco de la atención',
                'La atención siempre se queda en la misma palabra, sin importar lo que diga la frase',
                'Quitar el "pero" hace que el modelo deje de procesar la frase',
            ],
            explanation:
                'Las palabras de contraste y de negación son señales de camino. El "pero" indica que hay tensión entre dos partes, y el "no" invierte el significado. Al quitar el "pero", el vínculo entre las partes queda menos marcado, y al cambiar la negación por "lo recibió tarde", la contradicción desaparece y el peso pasa a otro lugar. Palabras pequeñas, un gran cambio en el foco de la atención.',
        },
        5: {
            question: 'El modelo pone mucho peso en "entregado". Un usuario deduce: "entonces el modelo comprobó la realidad y el paquete sí se entregó". ¿Qué es impreciso en esa deducción?',
            options: [
                'No hay error, un peso de atención alto prueba que la información es correcta',
                'Attention pondera vínculos dentro del texto, no comprueba hechos en el mundo. Un peso alto en "entregado" solo dice que esa palabra es importante para procesar el contexto',
                'El error es que el modelo en realidad no puso peso en "entregado"',
                'El error es que "entregado" nunca puede recibir un peso alto',
            ],
            explanation:
                'Un peso de atención alto dice que la palabra es relevante para procesar el contexto interno, no que sea cierta en la realidad. Attention conecta partes del texto entre sí, no verifica si el paquete se entregó de verdad. Para eso hace falta una fuente externa, como una herramienta de seguimiento, y no el mecanismo de atención.',
        },
    } satisfies Record<AttentionQuizId, AttentionQuizText>,
};
