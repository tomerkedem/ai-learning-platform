// i18n/locales/es/behind-ai/attentionLab.ts
//
// Datos del laboratorio de la frase del capítulo 6 (Attention), traducción al español.
// El hebreo es la fuente de la verdad y define la forma del tipo (AttentionLabContent).
//
// Importante: aquí vive todo el texto y los datos dependientes del idioma de
// AttentionSentenceLab. Los tokens, los pesos y los índices del par (pair) dependen del
// idioma porque se derivan del orden de las palabras en la frase. En cada idioma la frase
// es distinta y el número de palabras cambia, por eso los variants se definen por separado
// para cada idioma. El mapeo de tonos (tension -> color) queda en el componente.
//
// Sin raya larga (U+2014) ni raya media (U+2013).

import type { AttentionLabContent } from '../../he/behind-ai/attentionLab';

export const attentionLab: AttentionLabContent = {
    sectionEyebrow: 'Attention Lab',
    sectionTitle: 'Cambia la frase y descubre quién importa ahora',
    sectionIntro:
        'Una buena respuesta empieza cuando el modelo pondera bien las relaciones entre las partes de la frase. Cambia algo pequeño: quita el "pero", cambia el estado o sustituye la afirmación contradictoria, y observa cómo el foco de la atención y el vínculo entre las partes se mueven al instante.',
    heading: 'Cambia algo en la frase y observa hacia dónde se mueve la atención',
    kicker: 'Attention sentence lab',
    pickHint: 'Elige una edición en la frase. Veremos cómo cambian la atención y el vínculo entre las partes.',
    nowLabel: 'La frase ahora',
    relationLabel: 'El vínculo ponderado:',
    disclaimer:
        'Esto es una ilustración didáctica simplificada, no un reflejo completo del mecanismo de Attention en un modelo real. Los números de aquí buscan mostrar la idea: un cambio pequeño en la frase mueve el foco de la atención y la fuerza del vínculo entre las partes. El porcentaje junto a cada palabra es un peso en este momento, no una puntuación de importancia fija de la palabra.',
    tensionLabels: {
        high: 'vínculo fuerte',
        medium: 'vínculo medio',
        low: 'vínculo débil',
        shifted: 'el foco se movió',
    },
    sr: {
        attention: 'fuerza de atención',
        percent: 'por ciento',
        inPair: 'parte del vínculo principal',
        strength: 'fuerza del vínculo',
        group: 'selección de edición en la frase',
    },
    variants: [
        {
            id: 'base',
            control: 'El original',
            sentence: 'La luz está apagada, pero la vecina dice que la vio encendida.',
            tokens: ['La', 'luz', 'está', 'apagada', 'pero', 'la', 'vecina', 'dice', 'que', 'la', 'vio', 'encendida'],
            weights: [0.3, 0.5, 0.25, 0.95, 0.6, 0.25, 0.3, 0.25, 0.2, 0.35, 0.3, 0.9],
            pair: [3, 11],
            pairStrength: 0.9,
            tension: 'high',
            caption:
                'La tensión principal está entre "apagada" y "encendida". Ahí la atención debe ser fuerte, porque esa es la contradicción que la respuesta tiene que atender.',
        },
        {
            id: 'no-abal',
            control: 'Sin "pero"',
            sentence: 'La luz está apagada. La vecina dice que la vio encendida.',
            tokens: ['La', 'luz', 'está', 'apagada', 'La', 'vecina', 'dice', 'que', 'la', 'vio', 'encendida'],
            weights: [0.3, 0.5, 0.25, 0.75, 0.3, 0.3, 0.25, 0.2, 0.55, 0.3, 0.7],
            pair: [3, 10],
            pairStrength: 0.5,
            tension: 'medium',
            caption:
                'Quitamos el "pero". Las dos afirmaciones siguen aquí, pero solo quedan puestas una junto a otra. El "pero" es la señal que le dice al modelo que hay un contraste y que conviene ponderar el vínculo con más fuerza. Sin él, el vínculo queda menos marcado.',
        },
        {
            id: 'status',
            control: '"apagada" pasa a "parpadeando"',
            sentence: 'La luz está parpadeando, pero la vecina dice que la vio encendida.',
            tokens: ['La', 'luz', 'está', 'parpadeando', 'pero', 'la', 'vecina', 'dice', 'que', 'la', 'vio', 'encendida'],
            weights: [0.35, 0.5, 0.3, 0.45, 0.35, 0.3, 0.25, 0.25, 0.2, 0.4, 0.3, 0.45],
            pair: [3, 11],
            pairStrength: 0.2,
            tension: 'low',
            caption:
                'Cambiamos el estado a "parpadeando" y ahora no hay una contradicción real. Una luz que parpadea puede describirse razonablemente como encendida. No hay una tensión especial que ponderar, y la atención se reparte de forma más plana.',
        },
        {
            id: 'broken',
            control: '"encendida" pasa a "rota"',
            sentence: 'La luz está apagada, pero la vecina dice que está rota.',
            tokens: ['La', 'luz', 'está', 'apagada', 'pero', 'la', 'vecina', 'dice', 'que', 'está', 'rota'],
            weights: [0.3, 0.5, 0.25, 0.6, 0.4, 0.25, 0.3, 0.25, 0.2, 0.3, 0.9],
            pair: [3, 10],
            pairStrength: 0.4,
            tension: 'shifted',
            caption:
                'Sustituimos la afirmación contradictoria por un dato nuevo que encaja con "apagada". La contradicción desaparece, y el peso pasa a "rota", el dato nuevo que da forma a la respuesta. Una sola palabra cambió todo el foco de la atención.',
        },
        {
            id: 'pronoun',
            control: 'El pronombre "la"',
            sentence: 'La luz está apagada, pero la vecina dice que la vio encendida.',
            tokens: ['La', 'luz', 'está', 'apagada', 'pero', 'la', 'vecina', 'dice', 'que', 'la', 'vio', 'encendida'],
            weights: [0.3, 0.9, 0.25, 0.5, 0.3, 0.25, 0.3, 0.25, 0.2, 0.9, 0.3, 0.45],
            pair: [9, 1],
            pairStrength: 0.85,
            tension: 'high',
            caption:
                'La palabra "la" no va sola. El modelo tiene que enlazarla de vuelta con "luz", si no, no queda claro de qué habla la vecina. Esto también es atención: el vínculo entre una palabra y aquello a lo que sustituye.',
        },
    ],
    focus: {
        title: 'La misma frase, otro foco',
        intro:
            'Hasta ahora cambiamos la frase. Pero la atención también se mueve sin cambiar ni una palabra. Todo depende de lo que el modelo procesa en este momento. La misma frase exacta: elige qué procesa ahora y observa hacia dónde se mueve la atención.',
        axisChangedLabel: 'Cambiar la frase ⟶ otra atención',
        axisSameLabel: 'La misma frase, otro foco ⟶ otra atención',
        prompt: '¿Qué está procesando el modelo ahora?',
        nowFocusLabel: 'El modelo procesa ahora:',
        sentence: 'La luz está apagada, pero la vecina dice que la vio encendida.',
        tokens: ['La', 'luz', 'está', 'apagada', 'pero', 'la', 'vecina', 'dice', 'que', 'la', 'vio', 'encendida'],
        srGroup: 'elegir el foco de procesamiento actual',
        states: [
            {
                id: 'contradiction',
                label: 'la contradicción',
                weights: [0.3, 0.5, 0.25, 0.95, 0.6, 0.25, 0.3, 0.25, 0.2, 0.35, 0.3, 0.9],
                pair: [3, 11],
                pairStrength: 0.9,
                tension: 'high',
                caption:
                    'No cambiamos ni una palabra. Ahora mismo el modelo procesa la contradicción en el centro de la frase, por eso el vínculo fuerte está entre "apagada" y "encendida".',
            },
            {
                id: 'pronoun',
                label: 'la palabra "la"',
                weights: [0.3, 0.9, 0.25, 0.5, 0.3, 0.25, 0.3, 0.25, 0.2, 0.9, 0.3, 0.45],
                pair: [9, 1],
                pairStrength: 0.85,
                tension: 'shifted',
                caption:
                    'La misma frase exacta. Ahora el modelo procesa la palabra "la" y necesita saber a qué se refiere, por eso el vínculo fuerte pasa a "luz". Las palabras no se movieron, solo el foco de procesamiento.',
            },
        ],
    },
};
