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
                'Un token ya tiene un Token ID. ¿Qué ocurre después?',
            options: [
                'El ID apunta a una fila de la tabla de embeddings, que contiene el vector aprendido del token',
                'El ID en sí ya contiene el significado del token, y no hace falta otro paso',
                'El modelo construye un vector nuevo desde cero para el token en cada conversación',
                'El tamaño del ID decide qué tan importante es el token en la frase',
            ],
            explanation:
                'Un Token ID es una dirección, no significado. Apunta a una fila fija de la tabla de embeddings, y el contenido de esa fila es el vector aprendido durante el entrenamiento. El modelo lo consulta al usarlo, no lo recalcula en cada conversación, y el tamaño del ID no dice nada sobre la importancia del token.',
        },
        4: {
            question: 'En el laboratorio viste barras con nombres como "Entrega", "Fallo" y "Urgencia". ¿Qué dice eso sobre las dimensiones de un vector real?',
            options: [
                'Los nombres se eligieron para la visualización. Una representación real tiene muchas más dimensiones y casi ninguna tiene un nombre legible',
                'Son las dimensiones reales del modelo, y se pueden leer exactamente así',
                'Cada dimensión tiene un nombre claro, pero solo los ingenieros pueden verlo',
                'Las dimensiones se renombran en cada conversación, según el tema',
            ],
            explanation:
                'Los nombres que ves en la visualización se eligieron para ilustrar. Una representación real tiene cientos de dimensiones o más, y la mayoría no tiene un nombre que una persona pueda leer, tampoco los ingenieros. La estructura de la representación se aprende durante el entrenamiento y no recibe nombres nuevos en cada conversación. Los valores, en cambio, sí pueden cambiar según la entrada y el contexto.',
        },
        5: {
            question:
                'En el laboratorio cambiamos la fila de una palabra del modo "aprendido" al modo "aleatorio". Se sigue mostrando una lista de números. ¿Qué es cierto?',
            options: [
                'Es un vector aleatorio, no un embedding. Sus valores nunca se aprendieron en el entrenamiento',
                'Sigue siendo un embedding, porque cualquier lista de números que representa una palabra lo es',
                'Es un embedding nuevo que el modelo entrena ahora mismo, solo para esta conversación',
                'Ya no es un vector, porque solo los valores aprendidos pueden formar un vector',
            ],
            explanation:
                'Las dos filas son vectores, pero solo una es un embedding. Lo que convierte un vector en embedding no es que contenga números, sino que sus valores se aprendieron durante el entrenamiento para representar significado. Los números aleatorios siguen siendo una lista de números sin significado aprendido. Y además: el modelo no entrena un vector nuevo en cada chat, consulta los valores que ya aprendió y los procesa en contexto.',
        },
    } satisfies Record<Chapter4QuizId, Chapter4QuizText>,

    conceptLabels: {
        'המנוע רואה מספרים': 'El motor ve números',
        'Token ID ככתובת': 'Token ID como dirección',
        'מכתובת לווקטור': 'De la dirección al vector',
        'ממדים אינם קריאים': 'Las dimensiones no son legibles',
        'נלמד מול אקראי': 'Aprendido frente a aleatorio',
    } as Record<string, string>,
};
