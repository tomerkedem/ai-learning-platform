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
            title: 'Preparación de la entrada',
            term: 'Prompt',
            explanation: 'La persona escribe una solicitud, que entra junto con el contexto y las instrucciones del sistema.',
            detail: 'El producto prepara la entrada actual con la solicitud, las instrucciones del sistema y el contexto seleccionado. El historial, la memoria, RAG y los resultados de herramientas son opcionales; no entra toda la información guardada.',
        },
        tokenize: {
            title: 'División en tokens',
            term: 'Tokenization',
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
            term: 'Positional Encoding',
            explanation: 'El modelo necesita saber dónde está cada token respecto a los demás.',
        },
        context: {
            title: 'Ventana de contexto',
            term: 'Context Window',
            detail: 'La ventana de contexto contiene solo lo disponible para la ejecución actual. No es necesariamente todo el historial guardado, la memoria ni la retención.',
            explanation: 'El modelo tiene en cuenta la conversación, las instrucciones y los tokens ya generados.',
        },
        // Zona C - el cálculo del contexto
        attention: {
            title: 'Atención al contexto',
            term: 'Attention',
            detail: 'Attention calcula una relevancia dinámica que puede cambiar según la capa, la posición y el paso de generación. No es una importancia permanente de las palabras.',
            explanation: 'Los tokens revisan qué partes del contexto importan ahora.',
        },
        mix: {
            title: 'Mezcla de información',
            term: 'Feed-Forward',
            detail: 'Una red feed-forward procesa cada posición en cada capa y desarrolla las características de su representación.',
            explanation: 'Cada token se enriquece con una red feed-forward. En los modelos grandes solo unos pocos "expertos" de entre muchos se ejecutan por token.',
        },
        layers: {
            title: 'Capas de profundidad',
            term: 'Transformer',
            explanation: 'El procesamiento se repite a través de muchas capas, y cada capa afina la representación.',
        },
        state: {
            title: 'Representación interna actualizada',
            term: 'Hidden State',
            detail: 'Cada posición tiene una representación interna actualizada que combina contexto relevante y sigue cambiando entre capas.',
            explanation: 'Se forma un estado interno que resume el contexto en el momento actual.',
        },
        // Zona D - de la representación a la respuesta
        logits: {
            title: 'Puntuaciones en bruto',
            term: 'Logits',
            detail: 'Los logits son puntuaciones brutas para los posibles tokens siguientes. No son probabilidades.',
            explanation: 'El modelo asigna puntuaciones en bruto a los posibles siguientes tokens.',
        },
        softmax: {
            title: 'De la puntuación a la probabilidad',
            term: 'Softmax',
            detail: 'Softmax convierte las puntuaciones en una distribución de probabilidad. No elige el token.',
            explanation: 'Las puntuaciones se convierten en una distribución de probabilidad.',
        },
        decoding: {
            title: 'Elección del siguiente token',
            term: 'Decoding',
            detail: 'La decodificación elige o muestrea un token usando la distribución y sus reglas. No siempre se selecciona el token de mayor probabilidad.',
            explanation: 'Las reglas de decodificación determinan qué siguiente token se elige en la práctica.',
        },
        loop: {
            title: 'Un bucle hasta la respuesta',
            term: 'Autoregression',
            detail: 'El token elegido se añade y el proceso avanza al siguiente paso. Las implementaciones prácticas pueden reutilizar estado ya calculado.',
            explanation: 'El token elegido se suma a la respuesta, y luego todo vuelve a ejecutarse.',
        },
    },
};
