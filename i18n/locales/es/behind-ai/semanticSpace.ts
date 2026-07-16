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
            'Una vez que cada frase se ha convertido en una lista de números, podemos comparar las frases por sus números en lugar de por sus palabras. El modelo mide cuánto se parecen dos de esas listas y coloca las frases de modo que las que comparten patrones que aprendió queden más cerca unas de otras. Eso es lo que le permite ordenar las frases y encontrar las más cercanas en significado, aunque no compartan ninguna palabra.',
            'Cerca significa que el modelo aprendió una relación entre las frases, y lejos significa que esa relación es débil. Pero la cercanía es solo una señal de una relación aprendida, no una prueba de que los dos significados sean idénticos. Además, el mapa que ves aquí es solo una imagen simplificada en dos dimensiones de un espacio con muchos más ejes, dibujada para que podamos verlo con los ojos.',
        ],
    },
};
