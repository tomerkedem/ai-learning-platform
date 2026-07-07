// i18n/locales/es/behind-ai/evaluationQuiz.ts
//
// Texto de visualización en español (es, LTR) para el cuestionario del capítulo 15
// ("Evaluation & Generalization: ¿memorizó o entendió?"). El hebreo es la fuente de la verdad.
//
// Esto es solo texto de visualización. El mecanismo compartido (correctAnswer, difficulty,
// concept, onComplete, getReviewLinks, nextHref) vive en el quizData.ts compartido. La página
// del capítulo fusiona este texto sobre el esqueleto de preguntas compartido por id (byId),
// por eso el orden de las opciones debe ser idéntico entre idiomas.
//
// Esta es una primera traducción, para revisión posterior por un hablante nativo.
//
// Sin raya (U+2014) ni guion largo (U+2013).

import type { EvaluationQuizId, EvaluationQuizText } from '../../he/behind-ai/evaluationQuiz';

export const evaluationQuiz = {
    title: 'Comprobación de comprensión: ¿memorizó o entendió?',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en este capítulo',
    startLabel: 'Empezar la comprobación',
    submitLabel: 'Terminar la comprobación',
    completedTitle: 'Terminaste la comprobación',

    byId: {
        1: {
            question: '¿Qué significa decir que el modelo "generalizó" a un caso nuevo?',
            options: [
                'Que responde bien exactamente al ejemplo con el que fue corregido, y a nada más',
                'Que usa el principio que aprendió también en un caso nuevo, con otra formulación o detalles',
                'Que recuerda de antemano todos los casos posibles',
                'Que siempre da la misma respuesta sin importar la pregunta',
            ],
            explanation:
                'Generalizar es la capacidad de usar un principio aprendido en una situación nueva, parecida en el fondo pero distinta en la formulación o los detalles. Memorizar, en cambio, es acertar sobre todo cuando el caso se parece a algo conocido.',
        },
        2: {
            question: 'El modelo respondió bien a un ejemplo. ¿Por qué todavía no basta para decir que de verdad mejoró?',
            options: [
                'Porque un solo ejemplo puede acertar por azar, por coincidir con un patrón conocido, o por una formulación familiar',
                'Porque el modelo siempre falla la primera vez',
                'Porque hacen falta exactamente cinco preguntas en cada comprobación',
                'Porque un ejemplo correcto ya prueba que el modelo entiende',
            ],
            explanation:
                'Un solo acierto puede ser suerte, coincidencia con un patrón, o una formulación que parece conocida. Para saber que el modelo de verdad mantiene el principio hay que probarlo con casos variados, y no solo con un ejemplo.',
        },
        3: {
            question: 'Quieres construir un conjunto de prueba que de verdad revele si el modelo mejoró. ¿Qué conviene incluir?',
            options: [
                'La misma pregunta exacta, varias veces',
                'Casos variados: fácil, difícil, otra formulación, una fuente ausente, una contradicción y casos límite',
                'Solo casos que el modelo ya aprueba con facilidad',
                'Solo el caso más fácil, para ahorrar tiempo',
            ],
            explanation:
                'Un buen conjunto de prueba cubre variedad: casos fáciles y difíciles, distintas formulaciones, información ausente, contradicciones y casos límite, incluidos casos donde la respuesta correcta es "no lo sé" o "hace falta una fuente". La variedad revela debilidades que un solo ejemplo pasa por alto.',
        },
        4: {
            question: 'El modelo aprobó el caso conocido y el reformulado, pero falló cuando el cliente presionó por una fecha que no está en la fuente. ¿Qué revela este fallo?',
            options: [
                'Que el modelo es completamente inútil',
                'Que el modelo quizás aprendió el patrón conocido, pero no mantiene el principio bajo presión o contradicción',
                'Que la fuente es innecesaria',
                'Que conviene dejar de probar el modelo',
            ],
            explanation:
                'Un fallo en un caso límite señala un punto débil: el modelo quizás reconoció el patrón conocido, pero no mantuvo el principio cuando el cliente presionó en otra dirección. Justo por eso se corren muchos casos, y no solo uno.',
        },
        5: {
            question: 'Un colega muestra una demo impresionante y dice "funciona, podemos confiar". ¿Qué es lo más correcto antes de confiar?',
            options: [
                'Una buena demo basta, se puede confiar',
                'Construir un conjunto de prueba pequeño: otra formulación, una fuente ausente, una contradicción y un estado diferente, medir aciertos y fallos, y solo entonces decidir',
                'Si la demo suena segura, no hace falta probar más',
                'Correr la misma demo una y otra vez hasta convencerse',
            ],
            explanation:
                'Una demo no es una prueba. Cuando la precisión importa, se construye un conjunto de prueba pequeño con casos variados, se define de antemano la respuesta deseada, se mide cuántos aprobaron y se mejora según lo que falló. La evaluación reduce la incertidumbre, no demuestra que el modelo nunca vaya a fallar.',
        },
    } satisfies Record<EvaluationQuizId, EvaluationQuizText>,
};
