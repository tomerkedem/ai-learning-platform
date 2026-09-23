// i18n/locales/es/behind-ai/chapter3Quiz.ts
// Spanish Chapter 3 quiz display text. Shape source: ../../he/behind-ai/chapter3Quiz.
// Mechanics (correctAnswer, difficulty, concept) stay in the shared quizData.ts; the
// page merges this display text by question id. Option order matches the Hebrew source
// so the stored correctAnswer index stays valid. concept keys stay Hebrew (stable);
// conceptLabels provide the translated display label.
//
// No em dash (U+2014), no en dash (U+2013). Stable terms kept: token, modelo, prompt,
// contexto.

export const chapter3Quiz = {
    title: 'Comprobación de conocimientos: Tokenización',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en este capítulo',
    startLabel: 'Comenzar el cuestionario',
    submitLabel: 'Terminar el cuestionario',
    completedTitle: 'Terminaste el cuestionario',

    byId: {
        1: {
            question: '¿Qué le pasa a tu texto justo después de enviarlo, antes de que el modelo calcule cualquier significado?',
            options: [
                'El modelo calcula de inmediato la respuesta más probable',
                'El texto se divide en unidades de trabajo llamadas tokens',
                'El modelo traduce la frase a otro idioma',
                'El modelo ordena las palabras por importancia',
            ],
            explanation:
                'Dividir en tokens es el punto de entrada. Antes de calcular cualquier significado, el texto se convierte en una secuencia de unidades de trabajo. Solo después de la división puede empezar el procesamiento.',
        },
        2: {
            question: 'Una sola palabra puede dividirse en varios tokens. ¿Cuál es la lección?',
            options: [
                'El número de tokens siempre es igual al número de palabras',
                'Un token es una unidad de trabajo, no necesariamente una palabra entera',
                'Algunos idiomas no se pueden dividir en tokens',
                'Cada letra es un token aparte',
            ],
            explanation:
                'Un token es una unidad de trabajo, no necesariamente una palabra. Una palabra puede dividirse en varias unidades, así que no asumas que una palabra siempre equivale a un token.',
        },
        3: {
            question:
                'Una persona toma "La ropa no se secó" y prueba varias versiones: con tres signos de exclamación, con un número y sin espacios. ¿Qué le pasa a la tokenización?',
            options: [
                'La división queda igual, porque el significado no cambió',
                'Solo un cambio de significado afecta la división, no la forma',
                'Cada uno de estos cambios puede alterar la división y el número de unidades',
                'La puntuación y los números se eliminan, así que no influyen',
            ],
            explanation:
                'La división es sensible a cómo escribes. La puntuación y los números cuentan como unidades propias, y quitar los espacios cambia por completo cómo se corta el texto. La misma intención puede convertirse en un número distinto de unidades.',
        },
        4: {
            question: 'Un amigo dice: "La frase ya se dividió en tokens, así que el modelo ya la entendió". ¿Qué es inexacto en esa afirmación?',
            options: [
                'Nada, dividir en tokens es la comprensión misma',
                'La división es solo una conversión en unidades de trabajo, y la comprensión, si se forma, llega en etapas posteriores',
                'El error es que la frase no se dividió de verdad',
                'El error es que los tokens no tienen nada que ver con el significado',
            ],
            explanation:
                'Dividir en tokens no es comprender. Es la primera conversión del texto en unidades que se pueden procesar. Lo que se construye sobre esas unidades llega en etapas posteriores, no en el momento de la división.',
        },
        5: {
            question: 'La misma frase exacta se mide en dos modelos distintos y el número de tokens sale diferente. ¿Cómo es posible?',
            options: [
                'Seguro que uno de los modelos contó mal',
                'Modelos distintos pueden usar tokenizadores distintos, así que el mismo texto se divide de otra forma',
                'El número de tokens depende solo del largo de la frase y no puede cambiar',
                'El segundo modelo tradujo la frase antes de contar',
            ],
            explanation:
                'No hay ningún error. La división depende del tokenizador, y tokenizadores distintos cortan el mismo texto de otra forma. Por eso no puedes asumir que el número de tokens sea fijo entre modelos, ni que una palabra siempre equivalga a un token.',
        },
    },

    conceptLabels: {
        'פירוק לטוקנים': 'División en tokens',
        'טוקן מול מילה': 'Token frente a palabra',
        'צורה משנה פירוק': 'La forma cambia la división',
        'פירוק אינו הבנה': 'Dividir no es comprender',
        'טוקנייזרים נבדלים': 'Los tokenizadores difieren',
    },
};
