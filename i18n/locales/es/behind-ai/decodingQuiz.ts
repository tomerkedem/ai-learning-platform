// i18n/locales/es/behind-ai/decodingQuiz.ts
//
// Cadenas en espanol (es) de la comprobacion de comprension del Capitulo 9 (Decoding). El
// hebreo es la fuente de verdad. Esto es solo texto de visualizacion: el mecanismo
// compartido (correctAnswer, difficulty, concept, onComplete, getReviewLinks, nextHref)
// vive en quizData.ts. La pagina del capitulo fusiona este texto sobre el esqueleto de
// preguntas por id de pregunta.
//
// El orden de las opciones debe coincidir con el esqueleto compartido, ya que correctAnswer
// es un indice numerico.
//
// Esta es una primera traduccion, pendiente de revision por un hablante nativo.
//
// Sin raya (U+2014) ni semirraya (U+2013).

import type { DecodingQuizId, DecodingQuizText } from '../../he/behind-ai/decodingQuiz';

export const decodingQuiz = {
    title: 'Comprobacion de comprension: Decoding',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en este capitulo',
    startLabel: 'Comenzar la comprobacion',
    submitLabel: 'Terminar la comprobacion',
    completedTitle: 'Terminaste la comprobacion',

    byId: {
        1: {
            question: 'Que es la decodificacion, el paso de elegir el token?',
            options: [
                'El paso donde las puntuaciones en bruto se convierten en probabilidades',
                'El paso donde el modelo elige el siguiente token de la distribucion de probabilidad',
                'Una comprobacion de los hechos contra una fuente externa',
                'Traducir la respuesta a otro idioma',
            ],
            explanation:
                'La decodificacion es el paso de elegir: de la distribucion de probabilidad que ya existe, el modelo elige el siguiente token. Convertir puntuaciones en probabilidades ocurrio antes, en Softmax. La eleccion en si no comprueba hechos ni traduce.',
        },
        2: {
            question: 'Por que el paso de elegir viene despues de que las probabilidades ya existen?',
            options: [
                'Porque no se puede elegir un token antes de que haya una distribucion de la que elegir',
                'Porque la eleccion es lo que crea las probabilidades',
                'Porque la eleccion borra las probabilidades',
                'Porque el modelo elige toda la respuesta final de una sola vez',
            ],
            explanation:
                'Primero se forma la distribucion, y solo entonces se puede elegir un token de ella. La eleccion no crea ni borra las probabilidades, se apoya en ellas. Y el modelo construye una respuesta token a token, no elige toda la respuesta de una vez.',
        },
        3: {
            question: 'Cual es la diferencia entre una eleccion conservadora y una eleccion abierta?',
            options: [
                'La conservadora elige totalmente al azar, y la abierta elige siempre la mas alta',
                'La conservadora se inclina hacia la opcion mas probable y es mas estable, y la abierta puede elegir tambien una opcion menos probable y es mas variada',
                'Ambas eligen siempre exactamente el mismo token',
                'La abierta comprueba hechos, y la conservadora no',
            ],
            explanation:
                'Una eleccion conservadora se inclina hacia la opcion con la probabilidad mas alta, por eso la salida es mas previsible y estable. Una eleccion abierta da una oportunidad tambien a las opciones mas bajas, por eso es mas variada pero menos estable. Ninguna de las dos comprueba hechos.',
        },
        4: {
            question: 'En un estilo abierto se eligio una continuacion con una probabilidad relativamente baja. Por que ocurrio eso?',
            options: [
                'Porque un estilo abierto da una oportunidad tambien a las opciones mas bajas de la distribucion',
                'Porque la opcion baja es en realidad la correcta',
                'Porque el modelo comprobo y la encontro preferible',
                'Porque las probabilidades se invirtieron en el momento de la eleccion',
            ],
            explanation:
                'Un estilo abierto no ignora las probabilidades, pero da una oportunidad tambien a las opciones menos probables. Por eso a veces se elige una opcion mas baja. Eso anade variedad, pero no significa que el modelo la comprobara ni que las probabilidades cambiaran.',
        },
        5: {
            question: 'El modelo eligio una continuacion que suena convincente, pero en realidad es incorrecta. Donde esta el fallo al concluir que "si fue elegida, entonces es verdadera"?',
            options: [
                'No hay fallo, lo que se elige siempre es verdadero',
                'El estilo de decodificacion decide como se elige de las probabilidades, no comprueba el mundo. Verificar necesita una fuente o una herramienta',
                'El fallo es que el modelo no deberia elegir tokens en absoluto',
                'El fallo es que la continuacion no obtuvo una probabilidad suficientemente alta',
            ],
            explanation:
                'El acto de elegir no verifica nada. El estilo de decodificacion solo decide como se elige de las probabilidades existentes, no acude a ninguna fuente externa. Para saber si el paquete de verdad se retraso o se entrego necesitas una herramienta de seguimiento o una fuente verificada, no el acto de elegir.',
        },
    } satisfies Record<DecodingQuizId, DecodingQuizText>,
};
