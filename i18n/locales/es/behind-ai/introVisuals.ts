// i18n/locales/es/behind-ai/introVisuals.ts
// Spanish (neutral international) introduction visual/UI strings.
// Shape source: ../../he/behind-ai/introVisuals.
//
// Display text only. Structural values (numbers, vectors, indices) stay in the
// components, and the attention token order is fixed (index 0 = noun, index 3 =
// pronoun, index 4 = state). "IA" is used in Spanish prose. No em dash (U+2014),
// no en dash (U+2013), no Hebrew characters.

export const introVisuals = {
    roadmap: {
        peek: 'Vistazo',
        zone: 'Zona',
        loopBadge: 'Vuelve al inicio del recorrido',
    },

    systems: {
        act: 'Acto',
        chapter: 'Capítulo',
    },

    guess: {
        tokenCue: ['to', 'ken'] as string[],
    },

    viz: {
        sharedNote: 'Los números son solo ilustrativos, no una salida real del modelo.',
        tokenize: {
            sentence: 'Mi paquete no llegó',
            tokens: ['Mi', 'paquete', 'no', 'llegó'] as string[],
            caption: 'El texto se divide en unidades. En un modelo real, a veces el corte cae dentro de una palabra.',
        },
        embedding: {
            token: 'paquete',
            caption: (note: string) =>
                `El token se convierte en un ID del vocabulario y luego en un vector de números que codifica significado. ${note}`,
        },
        attention: {
            tokens: ['El perro', 'corrió', 'porque', 'él', 'estaba feliz'] as string[],
            strongLabel: 'Vínculo fuerte',
            weakLabel: 'Débil',
            caption: 'El modelo relaciona "él" con "el perro" según el contexto, con un vínculo más débil con los demás tokens.',
        },
        scores: {
            rowLabels: ['Sol', 'Lluvia', 'Nube'] as string[],
            caption: (note: string) =>
                `Las puntuaciones brutas (gris) se convierten en probabilidades que suman 100%. ${note}`,
        },
        loop: {
            steps: ['Hoy', 'Hoy hace', 'Hoy hace sol'] as string[],
            caption: 'Y así sucesivamente, token tras token, hasta una señal de parada.',
        },
    },
};
