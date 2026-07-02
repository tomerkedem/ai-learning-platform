// i18n/locales/es/behind-ai/introRoadmap.ts
// Spanish "mapa de las estaciones principales" of the Introduction. Shape source: ../../he/behind-ai/introRoadmap.
// Only user-facing text is translated. Structure (station id, zone, viz kind) lives in the view layer.
// `term` keeps the conventional English technical term. No em dash (U+2014), no en dash (U+2013).

export const introRoadmap = {
    // ── Cuatro zonas de aprendizaje, del texto a la respuesta (por id de zona) ──
    zones: {
        A: {
            title: 'Del texto a unidades de trabajo',
            caption: 'La solicitud entra y se descompone en unidades que el modelo puede procesar.',
        },
        B: {
            title: 'De tokens a representaciones',
            caption: 'Cada token se convierte en números y ocupa su lugar dentro del contexto.',
        },
        C: {
            title: 'El cálculo del contexto',
            caption: 'Los tokens se influyen entre sí hasta que se forma una representación interna actualizada.',
        },
        D: {
            title: 'De la representación a la respuesta',
            caption: 'El siguiente token se deriva de la representación, y el proceso se repite hasta completar la respuesta.',
        },
    },

    // ── Las 14 estaciones principales (por id de estación) ──
    stations: {
        // Zona A - del texto a unidades de trabajo
        request: {
            title: 'Entra la solicitud',
            explanation: 'La persona escribe una solicitud, que entra junto con el contexto y las instrucciones del sistema.',
        },
        tokenize: {
            title: 'División en tokens',
            explanation: 'El texto se descompone en unidades de trabajo que el modelo puede procesar.',
        },
        ids: {
            title: 'Un identificador para cada token',
            term: 'Token IDs',
            explanation: 'Cada token recibe un identificador numérico del vocabulario del modelo.',
        },
        // Zona B - de tokens a representaciones
        embedding: {
            title: 'Representación numérica',
            term: 'Embedding',
            explanation: 'El identificador se convierte en un vector numérico sobre el que el modelo puede calcular.',
        },
        position: {
            title: 'Posición y orden',
            explanation: 'El modelo necesita saber dónde está cada token respecto a los demás.',
        },
        context: {
            title: 'Ventana de contexto',
            explanation: 'El modelo tiene en cuenta la conversación, las instrucciones y los tokens ya generados.',
        },
        // Zona C - el cálculo del contexto
        attention: {
            title: 'Atención al contexto',
            term: 'Attention',
            explanation: 'Los tokens revisan qué partes del contexto importan ahora.',
        },
        mix: {
            title: 'Mezcla de información',
            explanation: 'La información del contexto se mezcla y actualiza las representaciones.',
        },
        layers: {
            title: 'Capas de profundidad',
            term: 'Transformer',
            explanation: 'El procesamiento se repite a través de muchas capas, y cada capa afina la representación.',
        },
        state: {
            title: 'Representación interna actualizada',
            explanation: 'Se forma un estado interno que resume el contexto en el momento actual.',
        },
        // Zona D - de la representación a la respuesta
        logits: {
            title: 'Puntuaciones en bruto',
            term: 'Logits',
            explanation: 'El modelo asigna puntuaciones en bruto a los posibles siguientes tokens.',
        },
        softmax: {
            title: 'De la puntuación a la probabilidad',
            term: 'Softmax',
            explanation: 'Las puntuaciones se convierten en una distribución de probabilidad.',
        },
        decoding: {
            title: 'Elección del siguiente token',
            term: 'Decoding',
            explanation: 'Las reglas de decodificación determinan qué siguiente token se elige en la práctica.',
        },
        loop: {
            title: 'Un bucle hasta la respuesta',
            explanation: 'El token elegido se suma a la respuesta, y luego todo vuelve a ejecutarse.',
        },
    },
};
