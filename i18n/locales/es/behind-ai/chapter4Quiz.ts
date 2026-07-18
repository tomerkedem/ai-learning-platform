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
            question: '¿Qué es cierto sobre la frase "el paquete no llegó" en la etapa del embedding?',
            options: [
                'La frase se divide en tokens, y cada token tiene su propio Token ID y su propia fila en la tabla',
                'La frase entera recibe un solo Token ID, y con él se saca una sola fila de la tabla',
                'Solo el primer token recibe una fila en la tabla, y esa fila representa toda la frase',
                'Todos los Token ID se fusionan en un único ID fijo, y con ese ID se accede a la tabla',
            ],
            explanation:
                'La frase no entra en la tabla como una sola unidad. Se divide en tokens, cada token tiene su propio Token ID, y cada Token ID apunta a su propia fila en la tabla de embeddings. No hay una fila para una frase entera, ni un único ID que represente toda la frase. Lo que se saca en esta etapa es una secuencia de filas, una por token.',
        },
        2: {
            question: 'El Token ID de una palabra tiene los dígitos 4, 1, 7. ¿El modelo calcula el vector a partir de esos dígitos?',
            options: [
                'No. 417 es una dirección. El vector se consulta en la fila 417 de la tabla, y los dígitos en sí no forman parte del cálculo',
                'Sí. El modelo hace un cálculo con los dígitos 4, 1 y 7 para construir el vector',
                'Sí. El tamaño del número 417 decide qué tan importante es la palabra en la frase',
                'No. No hay relación entre el ID y el vector, el modelo construye un vector nuevo en cada chat',
            ],
            explanation:
                'Un Token ID es una dirección, no una entrada de un cálculo. El número 417 solo selecciona la fila 417 en la tabla de embeddings, y de ahí el modelo consulta el vector aprendido. Los dígitos 4, 1 y 7 no forman parte de ningún cálculo, el tamaño del número no dice nada sobre la importancia, y el modelo no construye un vector nuevo en cada chat, consulta lo que ya se aprendió.',
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
            question: 'En el laboratorio viste una fila de números sin nombre en ninguna dimensión. ¿Qué puedes concluir sobre el vector?',
            options: [
                'El significado se aprende del patrón completo de valores, y normalmente ninguna dimensión tiene una etiqueta legible fija',
                'Cada posición del vector tiene un concepto claro y fijo que podrías nombrar',
                'El vector es una lista aleatoria de números sin significado aprendido',
                'Los dígitos del Token ID son los que fijan los valores del vector',
            ],
            explanation:
                'El vector contiene muchos números aprendidos, y el significado se reparte por todo el patrón, no está en un solo número. Normalmente ninguna dimensión tiene un nombre que una persona pueda leer. Los valores se aprendieron durante el entrenamiento para representar significado, no son aleatorios, y no se derivan de los dígitos del Token ID. El ID solo selecciona la fila.',
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
        'לכל טוקן שורה משלו': 'Cada token tiene su propia fila',
        'Token ID ככתובת': 'Token ID como dirección',
        'מכתובת לווקטור': 'De la dirección al vector',
        'ממדים אינם קריאים': 'Las dimensiones no son legibles',
        'נלמד מול אקראי': 'Aprendido frente a aleatorio',
    } as Record<string, string>,
};
