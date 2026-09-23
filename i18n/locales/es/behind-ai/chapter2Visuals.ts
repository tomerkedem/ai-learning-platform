// i18n/locales/es/behind-ai/chapter2Visuals.ts
// Spanish Chapter 2 visuals: Input Comparison Lab chrome and the five input
// variations. Shape source: ../../he/behind-ai/chapter2Visuals (Hebrew is canonical).
//
// Real translation. No em dash (U+2014), no en dash (U+2013). Structural fields
// (id, ambiguity) are kept literal; only visible text is translated.

import type { Locale } from '@/i18n/config';
import type { InputVariation } from '@/app/(course)/behind-the-scenes-ai/chapter-2/inputVariations';

export const chapter2Visuals = {
    contentLocale: 'es' as Locale,

    // Input Comparison Lab chrome
    inputLab: {
        tokenizationHint: 'Una nota para más adelante: aquí solo miramos qué contiene la entrada. Dividir el texto en tokens llega en un capítulo aparte más adelante.',
        pickerHint: 'Elige al menos dos formulaciones y compáralas. Fíjate en qué se dice de forma explícita, qué queda faltando y qué cambió en la petición que recibió el modelo.',
        pickerAria: 'Elegir una formulación para comparar',
        ambiguityPrefix: 'Ambigüedad',
        outro: 'La misma necesidad, formulaciones distintas. Con cada una el modelo obtiene material distinto con el cual trabajar, antes de que comience cualquier procesamiento más profundo.',
        // Field titles in the reading panel
        fields: {
            explicit: 'Qué expresa el texto',
            missing: 'Qué falta',
            changed: 'Qué cambió respecto de la base',
            ambiguity: 'Nivel de ambigüedad',
            expectation: 'Qué le pide la petición al modelo',
        },
        baseComparison: 'Este es el punto base para la comparación.',
        noticeLabel: 'Vale la pena notar',
        // Ambiguity level labels (the chip and color are structural in the component)
        ambiguityLabels: {
            low: 'Baja',
            medium: 'Media',
            high: 'Alta',
        },
    },

    // The five input variations. Structural fields (id, ambiguity) mirror
    // inputVariations.ts; only the visible text is translated, in the same order.
    inputVariations: [
        {
            id: 'base',
            label: 'Solicitud básica',
            prompt: 'Mi impresora no funciona. ¿Qué hago?',
            explicit: ['Hay un problema: la impresora no funciona', 'Una petición de orientación: qué hacer'],
            missing: ['Código de error', 'Qué modelo de impresora', 'Cuándo empezó el problema'],
            changed: '',
            ambiguity: 'medium',
            expectation: 'Ofrecer orientación general, o preguntar qué falta para ayudar de verdad',
        },
        {
            id: 'question',
            label: 'Solo una pregunta',
            prompt: '¿Mi impresora no funciona?',
            explicit: ['La impresora no funciona, planteado como pregunta abierta'],
            missing: ['Qué quiere el usuario que ocurra', 'Una petición explícita de acción o de orientación'],
            changed: 'Se quitó el "qué hago" y se agregó un signo de interrogación. Queda como una pregunta abierta sin una petición clara.',
            ambiguity: 'high',
            expectation: 'Aclarar qué se necesita realmente antes de redactar una respuesta',
        },
        {
            id: 'contradiction',
            label: 'Contradicción',
            prompt: 'Mi impresora no funciona, pero la app dice que está conectada.',
            explicit: ['Problema: la impresora no funciona', 'Contraargumento: la app informa que está conectada'],
            missing: ['Una petición explícita', 'Un código de error para verificar'],
            changed: 'Se agregó una contradicción entre lo que vivió el usuario y lo que informa la app.',
            ambiguity: 'medium',
            expectation: 'Notar la contradicción, y quizás ofrecer revisar la conexión',
        },
        {
            id: 'tracking',
            label: 'Con un código de error',
            prompt: 'Mi impresora no funciona. El código de error es 12345.',
            explicit: ['Problema: la impresora no funciona', 'Identificador: código de error 12345'],
            missing: ['Cuál es exactamente la acción deseada'],
            changed: 'Se agregó un código de error. Ahora hay suficiente para verificar un estado real.',
            ambiguity: 'low',
            expectation: 'El problema se puede verificar usando el identificador',
        },
        {
            id: 'correction',
            label: 'Una corrección en el chat',
            prompt: 'No la impresora, quise decir el escáner.',
            explicit: ['Corrección: no la impresora sino el escáner'],
            missing: ['El contexto previo del chat, sin el cual no queda claro qué se está corrigiendo'],
            changed: 'Esto no es la descripción de un problema sino la corrección de algo dicho antes en el chat.',
            ambiguity: 'high',
            expectation: 'Actualizar el contexto actual del chat según la corrección',
            note: 'La corrección cambia el contexto actual del chat, no lo que el modelo aprendió en el entrenamiento.',
        },
    ] as InputVariation[],
};
