// i18n/locales/es/behind-ai/chapter2Visuals.ts
// Spanish Chapter 2 visuals: Input Comparison Lab chrome and the five input
// variations. Shape source: ../../he/behind-ai/chapter2Visuals (Hebrew is canonical).
//
// Real translation. No em dash (U+2014), no en dash (U+2013). Structural fields
// (id, ambiguity, tendency, externalData) are kept literal; only visible text is translated.

import type { Locale } from '@/i18n/config';
import type { InputVariation } from '@/app/behind-the-scenes-ai/chapter-2/inputVariations';

export const chapter2Visuals = {
    contentLocale: 'es' as Locale,

    // Input Comparison Lab chrome
    inputLab: {
        tokenizationHint: 'Una nota para más adelante: aquí solo miramos qué contiene la entrada. Dividir el texto en tokens llega en un capítulo aparte más adelante.',
        pickerHint: 'Los botones de abajo son cinco formulaciones de la misma solicitud. Elige uno y el panel de abajo se actualiza según lo que recibe el modelo.',
        pickerAria: 'Elegir una formulación para comparar',
        ambiguityPrefix: 'Ambigüedad',
        outro: 'La misma necesidad, formulaciones distintas. Con cada una el modelo obtiene material distinto con el cual trabajar, antes de que comience cualquier procesamiento más profundo.',
        // Field titles in the reading panel
        fields: {
            explicit: 'Qué expresa el texto',
            missing: 'Qué falta',
            changed: 'Qué cambió respecto de la base',
            ambiguity: 'Nivel de ambigüedad',
            expectation: 'Qué se espera del modelo',
            external: 'Se necesita información externa',
            tendency: 'Hacia dónde se inclina',
        },
        baseComparison: 'Este es el punto base para la comparación.',
        externalYes: 'Sí.',
        externalNo: 'No se necesita en esta etapa.',
        noticeLabel: 'Vale la pena notar',
        // Ambiguity level labels (the chip and color are structural in the component)
        ambiguityLabels: {
            low: 'Baja',
            medium: 'Media',
            high: 'Alta',
        },
        // Tendency labels (the chip and color are structural in the component)
        tendencyLabels: {
            chat: 'Tiende a Chat',
            'chat-agent': 'Entre Chat y Agent',
            agent: 'Tiende a Agent',
        },
    },

    // The five input variations. Structural fields (id, ambiguity, tendency, externalData)
    // mirror inputVariations.ts; only the visible text is translated, in the same order.
    inputVariations: [
        {
            id: 'base',
            label: 'Solicitud básica',
            prompt: 'Mi paquete no llegó. ¿Qué hago?',
            explicit: ['Hay un problema: el paquete no llegó', 'Una petición de orientación: qué hacer'],
            missing: ['Número de seguimiento', 'Cuándo se hizo el pedido', 'Qué empresa de mensajería'],
            changed: '',
            ambiguity: 'medium',
            expectation: 'Ofrecer orientación general, o preguntar qué falta para ayudar de verdad',
            externalData: false,
            tendency: 'chat',
        },
        {
            id: 'question',
            label: 'Solo una pregunta',
            prompt: '¿No llegó mi paquete?',
            explicit: ['El paquete no llegó, planteado como pregunta abierta'],
            missing: ['Qué quiere el usuario que ocurra', 'Una petición explícita de acción o de orientación'],
            changed: 'Se quitó el "qué hacer" y se agregó un signo de interrogación. Queda como una pregunta abierta sin una petición clara.',
            ambiguity: 'high',
            expectation: 'Aclarar qué se necesita realmente antes de redactar una respuesta',
            externalData: false,
            tendency: 'chat',
        },
        {
            id: 'contradiction',
            label: 'Contradicción',
            prompt: 'Mi paquete no llegó, pero recibí un aviso de que fue entregado.',
            explicit: ['Problema: el paquete no llegó', 'Contraargumento: se recibió un aviso de entrega'],
            missing: ['Una petición explícita', 'Un número de seguimiento para verificar'],
            changed: 'Se agregó una contradicción entre lo que vivió el usuario y el aviso de entrega.',
            ambiguity: 'medium',
            expectation: 'Notar la contradicción, y quizás ofrecer revisar el estado',
            externalData: true,
            externalNote: 'Resolver la contradicción exige consultar datos de seguimiento reales.',
            tendency: 'chat-agent',
        },
        {
            id: 'tracking',
            label: 'Con un número de seguimiento',
            prompt: 'Mi paquete no llegó. El número de seguimiento es 12345.',
            explicit: ['Problema: el paquete no llegó', 'Identificador: número de seguimiento 12345'],
            missing: ['Cuál es exactamente la acción deseada'],
            changed: 'Se agregó un identificador de seguimiento. Ahora hay suficiente para verificar un estado real.',
            ambiguity: 'low',
            expectation: 'El estado del envío se puede verificar usando el identificador',
            externalData: true,
            externalNote: 'El identificador permite consultar un sistema de seguimiento externo.',
            tendency: 'agent',
        },
        {
            id: 'correction',
            label: 'Una corrección en el chat',
            prompt: 'No zapatos, pedí un libro.',
            explicit: ['Corrección: no zapatos sino un libro'],
            missing: ['El contexto previo del chat, sin el cual no queda claro qué se está corrigiendo'],
            changed: 'Esto no es la descripción de un problema sino la corrección de algo dicho antes en el chat.',
            ambiguity: 'high',
            expectation: 'Actualizar el contexto actual del chat según la corrección',
            externalData: false,
            tendency: 'chat',
            note: 'La corrección cambia el contexto actual del chat, no lo que el modelo aprendió en el entrenamiento.',
        },
    ] as InputVariation[],
};
