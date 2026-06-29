// i18n/locales/es/behind-ai/chapter4Quiz.ts
// Cadenas de la comprobación de conocimientos del capítulo 4 ("Embeddings").
// Fuente de forma: ../../he/behind-ai/chapter4Quiz (el hebreo es canónico).
//
// Solo texto visible. El esqueleto numérico (correctAnswer, difficulty, concept,
// onComplete, getReviewLinks, nextHref) permanece en quizData.ts (chapter6Quiz, la
// ruta del capítulo 4). La página fusiona este texto sobre el esqueleto por id de
// pregunta (byId), así que quizData.ts no se toca.
//
// El orden de las opciones debe coincidir con el esqueleto, ya que correctAnswer es un
// índice numérico. concept es una clave interna estable (no se traduce); conceptLabels
// da la etiqueta visible. Sin guion largo (U+2014) ni guion medio (U+2013).

import type { Chapter4QuizId, Chapter4QuizText } from '@/i18n/locales/he/behind-ai/chapter4Quiz';

export const chapter4Quiz = {
    title: 'Comprobación de conocimientos: Embeddings',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en este capítulo',
    startLabel: 'Comenzar la prueba',
    submitLabel: 'Finalizar la prueba',
    completedTitle: 'Terminaste la prueba',

    byId: {
        1: {
            question: "¿Qué 've' realmente el motor cuando recibe palabras?",
            options: [
                'Las palabras exactamente como las leemos',
                'Números, porque no puede trabajar con palabras directamente',
                'Imágenes de las letras',
                'El sonido de las palabras',
            ],
            explanation:
                'El motor no puede trabajar con las palabras como las leemos. Para calcular y comparar significado, primero convierte el texto en números. Nosotros vemos palabras, él ve números.',
        },
        2: {
            question: '¿Qué es un Token ID?',
            options: [
                'El significado numérico de la palabra',
                'Una dirección fija del token en el vocabulario',
                'Una puntuación de similitud entre dos palabras',
                'Cuántas veces aparece la palabra en el texto',
            ],
            explanation:
                'Un Token ID es una dirección fija en el vocabulario, no un significado. Solo marca qué token es. El significado llega en el paso siguiente, cuando se construye un vector de significado a partir de la secuencia de IDs.',
        },
        3: {
            question:
                '"El paquete no llegó" y "El envío no fue entregado" reciben Token IDs completamente distintos, pero un vector de significado casi idéntico. ¿Qué nos enseña esto?',
            options: [
                'Que el modelo debe ver exactamente las mismas palabras para reconocer la intención',
                'Que el modelo detecta una dirección de significado similar incluso con palabras distintas',
                'Que un Token ID es en realidad el significado de la palabra',
                'Que las dos frases son en realidad la misma frase',
            ],
            explanation:
                'Este es el momento sorprendente del capítulo. A pesar de IDs completamente distintos, el vector de significado es casi idéntico. El modelo no necesita las mismas palabras para detectar una dirección similar, porque trabaja sobre el significado, no sobre las palabras en sí.',
        },
        4: {
            question: '¿Qué es el vector de significado (Meaning Vector) que vimos en este capítulo?',
            options: [
                'Una sola palabra que resume la frase',
                'Una lista de números que describe hacia dónde apunta la frase',
                'Una única dirección en el vocabulario',
                'El porcentaje de confianza del motor en su respuesta',
            ],
            explanation:
                'Un vector es una lista de números que representa significado, un perfil que describe hacia dónde apunta la frase. Es la forma central de representación en todo modelo de IA, no un único Token ID ni una palabra.',
        },
        5: {
            question:
                'En el modo Agent vimos que el mismo perfil numérico separa una investigación segura de una acción arriesgada hacia un cliente. ¿Qué suposición es errónea aquí?',
            options: [
                'Que el vector también afecta a las decisiones de acción, no solo a las respuestas',
                'Que la misma representación numérica puede llevar a distintos niveles de riesgo',
                'Que los números describen significado, no solo la identidad de las palabras',
                'Que el vector es solo decoración visual, sin efecto real en la decisión',
            ],
            explanation:
                'El vector no es decoración. El mismo perfil numérico no solo responde, también moldea decisiones de acción y separa una investigación segura de una acción arriesgada que requiere aprobación. Las demás afirmaciones son correctas.',
        },
    } satisfies Record<Chapter4QuizId, Chapter4QuizText>,

    conceptLabels: {
        'המנוע רואה מספרים': 'El motor ve números',
        'Token ID ככתובת': 'Token ID como dirección',
        'כיוון משמעות משותף': 'Dirección de significado compartida',
        'וקטור משמעות': 'Vector de significado',
        'וקטור והחלטות': 'Vectores y decisiones',
    } as Record<string, string>,
};
