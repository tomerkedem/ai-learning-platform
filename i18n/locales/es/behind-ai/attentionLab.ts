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
        'Una buena respuesta empieza cuando el modelo pondera bien las relaciones entre las partes de la frase. Cambia algo pequeño: quita el "pero", cambia el estado o invierte la negación, y observa cómo el foco de la atención y el vínculo entre las partes se mueven al instante.',
    heading: 'Cambia algo en la frase y observa hacia dónde se mueve la atención',
    kicker: 'Attention sentence lab',
    pickHint: 'Elige una edición en la frase. Veremos cómo cambian la atención y el vínculo entre las partes.',
    nowLabel: 'La frase ahora',
    relationLabel: 'El vínculo ponderado:',
    disclaimer:
        'Esto es una ilustración didáctica simplificada, no un reflejo completo del mecanismo de Attention en un modelo real. Los números de aquí buscan mostrar la idea: un cambio pequeño en la frase mueve el foco de la atención y la fuerza del vínculo entre las partes.',
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
            sentence: 'El paquete figura como entregado, pero el cliente dice que nunca lo recibió.',
            tokens: ['El', 'paquete', 'figura', 'como', 'entregado', 'pero', 'el', 'cliente', 'dice', 'que', 'nunca', 'lo', 'recibió'],
            weights: [0.3, 0.55, 0.35, 0.3, 0.95, 0.6, 0.25, 0.3, 0.25, 0.2, 0.8, 0.35, 0.9],
            pair: [4, 12],
            pairStrength: 0.9,
            tension: 'high',
            caption:
                'La tensión principal está entre "entregado" y "recibió". Ahí la atención debe ser fuerte, porque esa es la contradicción que la respuesta tiene que atender, y no solo el hecho de que falte un paquete.',
        },
        {
            id: 'no-abal',
            control: 'Sin "pero"',
            sentence: 'El paquete figura como entregado. El cliente dice que nunca lo recibió.',
            tokens: ['El', 'paquete', 'figura', 'como', 'entregado', 'El', 'cliente', 'dice', 'que', 'nunca', 'lo', 'recibió'],
            weights: [0.3, 0.5, 0.35, 0.3, 0.75, 0.3, 0.3, 0.25, 0.2, 0.6, 0.35, 0.7],
            pair: [4, 11],
            pairStrength: 0.5,
            tension: 'medium',
            caption:
                'Quitamos el "pero". Las dos partes siguen aquí, pero solo quedan puestas una junto a otra. El "pero" es la señal que le dice al modelo que hay un contraste y que conviene ponderar el vínculo con más fuerza. Sin él, el vínculo queda menos marcado.',
        },
        {
            id: 'status',
            control: '"entregado" pasa a "en tránsito"',
            sentence: 'El paquete aún sigue en tránsito, pero el cliente dice que nunca lo recibió.',
            tokens: ['El', 'paquete', 'aún', 'sigue', 'en', 'tránsito', 'pero', 'el', 'cliente', 'dice', 'que', 'nunca', 'lo', 'recibió'],
            weights: [0.3, 0.5, 0.3, 0.3, 0.3, 0.45, 0.35, 0.25, 0.3, 0.25, 0.2, 0.4, 0.35, 0.45],
            pair: [5, 13],
            pairStrength: 0.2,
            tension: 'low',
            caption:
                'Cambiamos el estado a "en tránsito" y ahora no hay contradicción. Es lógico que un paquete que aún va en camino todavía no se haya recibido. No hay una tensión especial que ponderar, y la atención se reparte de forma más plana.',
        },
        {
            id: 'received-late',
            control: '"nunca lo recibió" pasa a "lo recibió tarde"',
            sentence: 'El paquete figura como entregado, pero el cliente dice que lo recibió tarde.',
            tokens: ['El', 'paquete', 'figura', 'como', 'entregado', 'pero', 'el', 'cliente', 'dice', 'que', 'lo', 'recibió', 'tarde'],
            weights: [0.3, 0.5, 0.3, 0.3, 0.6, 0.4, 0.25, 0.3, 0.25, 0.2, 0.35, 0.55, 0.9],
            pair: [4, 12],
            pairStrength: 0.4,
            tension: 'shifted',
            caption:
                'Invertimos la negación. Ahora el cliente sí lo recibió, solo que tarde. La contradicción desaparece y el peso pasa a "tarde", el dato nuevo que da forma a la respuesta. Una sola palabra de negación cambió todo el foco de la atención.',
        },
        {
            id: 'pronoun',
            control: 'El pronombre "lo"',
            sentence: 'El paquete figura como entregado, pero el cliente dice que nunca lo recibió.',
            tokens: ['El', 'paquete', 'figura', 'como', 'entregado', 'pero', 'el', 'cliente', 'dice', 'que', 'nunca', 'lo', 'recibió'],
            weights: [0.3, 0.85, 0.3, 0.3, 0.5, 0.35, 0.25, 0.35, 0.3, 0.2, 0.4, 0.9, 0.45],
            pair: [11, 1],
            pairStrength: 0.85,
            tension: 'high',
            caption:
                'La palabra "lo" no va sola. El modelo tiene que enlazarla de vuelta con "paquete", si no, no queda claro de qué habla el cliente. Esto también es atención: el vínculo entre una palabra y aquello a lo que sustituye.',
        },
    ],
};
