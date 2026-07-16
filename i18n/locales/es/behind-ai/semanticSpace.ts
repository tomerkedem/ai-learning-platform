// i18n/locales/es/behind-ai/semanticSpace.ts
// Spanish Chapter 5 ("Semantic Space").
// Narrow localization: the "in simple words" explanatory card (plain) is fully translated
// to neutral international Spanish. Every other field still falls back to the Hebrew source
// until Chapter 5 is translated in full, so we spread `he` and override only `plain`.
import { semanticSpace as he } from '../../he/behind-ai/semanticSpace';

export const semanticSpace = {
    ...he,
    plain: {
        eyebrow: 'En pocas palabras',
        title: 'Qué es un espacio de significado',
        paragraphs: [
            'En el capítulo anterior, cada frase se convirtió en una lista de números que el modelo aprendió, su embedding. Cada valor del vector describe la posición de la frase a lo largo de una dimensión, y todos los valores juntos deciden dónde se ubica en el espacio de significado. En ese espacio podemos comparar los embeddings y ver cuán cerca están dos representaciones entre sí. El mapa que ves aquí es solo una proyección simplificada en dos dimensiones, y un embedding real tiene muchas más dimensiones.',
            'El modelo coloca las frases de modo que las que comparten patrones que aprendió queden más cerca unas de otras. Eso es lo que le permite ordenar las frases y encontrar las más cercanas en significado, aunque no compartan ninguna palabra.',
            'Cerca significa que el modelo aprendió una relación entre las frases, y lejos significa que esa relación es débil. Pero la cercanía es solo una señal de una relación aprendida, no una prueba de que los dos significados sean idénticos.',
        ],
    },
    sections: {
        ...he.sections,
        dnaIntro:
            'Hasta aquí vimos dónde se ubica cada frase en el espacio. Ahora miraremos más de cerca el vector que la representa y veremos cómo su patrón de valores cambia de una frase a otra, y cómo ese patrón influye en la cercanía entre ellas.',
        dnaSelectorHint: 'Elige una frase en cada lado y compara cómo cambia el patrón de valores y de conexiones.',
    },
    lock: {
        title: 'Consolida la idea',
        question: 'Dos frases están cerca una de otra en el espacio de significado. ¿Qué puedes concluir con cautela de eso?',
        options: [
            'Que las dos frases tienen un significado idéntico.',
            'Que sus representaciones son similares según la medida que se usa, pero no necesariamente que su significado sea el mismo ni que la información que contienen sea correcta.',
            'Que las dos frases usan exactamente las mismas palabras.',
        ],
        explanationCorrect:
            'La cercanía en el espacio señala una similitud entre las representaciones según la medida de comparación, pero no prueba que el significado sea el mismo ni que la información sea correcta. Incluso una sola palabra de negación puede cambiar el significado de una frase y aun así dejar las representaciones cerca.',
        explanationWrong:
            'La cercanía en el espacio no garantiza un significado idéntico ni exige usar las mismas palabras. Solo señala una similitud entre las representaciones según la medida de comparación.',
    },
    lab: {
        ...he.lab,
        map: {
            ...he.lab.map,
            closestNow: 'La frase más cercana ahora es:',
        },
        negation: {
            ...he.lab.negation,
            bridge: 'Por eso no basta con mirar las palabras solas. Hay que entender cómo cada palabra cambia el significado de las demás, no solo qué palabras aparecieron.',
        },
    },
};
