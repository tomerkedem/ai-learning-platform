// i18n/locales/es/behind-ai/logitsSoftmaxLab.ts
//
// Datos del laboratorio de Logits y Softmax del capítulo 8 (Logits & Softmax),
// traducción al español. El hebreo es la fuente de la verdad y define la forma del
// tipo (LogitsSoftmaxLabContent).
//
// La idea central: antes de que el modelo elija la continuación, le da a cada opción
// una puntuación en bruto (logit). Softmax convierte esas puntuaciones en una
// distribución de probabilidad: cada continuación recibe un porcentaje y todas suman
// 100. Cambiar un dato del contexto mueve las puntuaciones, y por tanto también los
// porcentajes. El aprendiz también puede ajustar cada puntuación a mano y ver cómo
// cambian las probabilidades al instante.
//
// Todas las puntuaciones y porcentajes son una ilustración didáctica, no una salida
// real de un modelo. Las continuaciones se muestran como frases completas para que sea
// cómodo leerlas, pero representan la competencia por el siguiente token, no una traza
// interna.
//
// Sin raya larga (U+2014) ni raya media (U+2013).

/** Una continuación posible entre varias que compiten. */
export interface LabContinuation {
    /** Identificador estable, no se traduce. */
    id: string;
    /** Etiqueta de la continuación, por ejemplo "se retrasó". */
    label: string;
}

/** Un dato de contexto que se puede elegir. Cada dato fija una puntuación en bruto distinta para cada continuación. */
export interface LabContext {
    /** Identificador estable, no se traduce. */
    id: string;
    /** Etiqueta del botón. */
    control: string;
    /** El añadido de contexto que entra en el prompt antes de "El paquete probablemente...". Vacío en el estado neutral. */
    promptExtra?: string;
    /** Explicación breve: por qué este dato mueve las puntuaciones. */
    note: string;
    /** Mapeo del id de continuación a su puntuación en bruto en este estado (ilustración didáctica). */
    scores: Record<string, number>;
}

export interface LogitsSoftmaxLabContent {
    /** Encabezados de la sección en la página (sobre el componente). */
    sectionEyebrow: string;
    sectionTitle: string;
    sectionIntro: string;
    /** Título interno del componente. */
    heading: string;
    /** Subtítulo latino estructural (se mantiene igual en todos los idiomas). */
    kicker: string;
    /** Inicio de la frase que el modelo completa. */
    promptBase: string;
    promptLabel: string;
    pickContextLabel: string;
    scoreLabel: string;
    probabilityLabel: string;
    topLabel: string;
    adjustTitle: string;
    adjustHint: string;
    resetScores: string;
    softmaxNoteTitle: string;
    softmaxNote: string;
    continuationNote: string;
    disclaimer: string;
    /** Etiquetas para lectores de pantalla. */
    sr: { increase: string; decrease: string; contextGroup: string };
    continuations: LabContinuation[];
    contexts: LabContext[];
}

export const logitsSoftmaxLab: LogitsSoftmaxLabContent = {
    sectionEyebrow: 'Logits & Softmax Lab',
    sectionTitle: 'Cambia el contexto o las puntuaciones y observa cómo se mueven las probabilidades',
    sectionIntro:
        'El mismo inicio de frase, varias continuaciones posibles. Cada continuación recibe una puntuación en bruto, y Softmax convierte esas puntuaciones en porcentajes que suman 100. Elige un dato de contexto, o ajusta tú mismo las puntuaciones, y observa quién va por delante y por cuánto.',
    heading: 'De puntuaciones en bruto a probabilidades',
    kicker: 'Logits & Softmax Lab',
    promptBase: 'El paquete probablemente...',
    promptLabel: 'El prompt completo',
    pickContextLabel: 'Elige un dato de contexto',
    scoreLabel: 'Puntuación en bruto',
    probabilityLabel: 'Probabilidad',
    topLabel: 'El líder ahora mismo',
    adjustTitle: 'Ajusta tú mismo las puntuaciones',
    adjustHint: 'Pulsa el más o el menos para cambiar la puntuación de una continuación. Fíjate en cómo reaccionan los porcentajes al instante.',
    resetScores: 'Volver a las puntuaciones del contexto',
    softmaxNoteTitle: 'Cómo las puntuaciones se convierten en porcentajes',
    softmaxNote:
        'Softmax reparte 100 por ciento entre las continuaciones según las puntuaciones: una puntuación más alta recibe una porción mayor. Una diferencia pequeña en la puntuación puede abrir una diferencia notable en los porcentajes, y por eso un cambio pequeño en el contexto ya mueve la imagen.',
    continuationNote:
        'Aquí las continuaciones se muestran como frases completas para que sea fácil leerlas. En la práctica el modelo puntúa el siguiente token paso a paso. Esto es una ilustración de esa misma competencia, no una traza interna exacta del modelo.',
    disclaimer:
        'Las puntuaciones y los porcentajes de aquí son una ilustración didáctica, no una salida real de un modelo. Sirven para mostrar cómo las puntuaciones se convierten en probabilidades, y cómo el contexto las mueve. Una puntuación alta significa que la continuación es más probable según el texto, no que sea verdadera en el mundo.',
    sr: {
        increase: 'Sube la puntuación de',
        decrease: 'Baja la puntuación de',
        contextGroup: 'Elección del dato de contexto',
    },
    continuations: [
        { id: 'delayed', label: 'se retrasó' },
        { id: 'delivered', label: 'se entregó' },
        { id: 'pickup', label: 'espera recogida' },
        { id: 'lost', label: 'se perdió' },
    ],
    contexts: [
        {
            id: 'neutral',
            control: 'Sin dato adicional',
            note: 'Sin ningún dato adicional, "se retrasó" recibe la puntuación más alta, pero la diferencia entre las continuaciones no es enorme. Sigue siendo una estimación, no un dato comprobado.',
            scores: { delayed: 4, delivered: 3, pickup: 2, lost: 1 },
        },
        {
            id: 'delay',
            control: 'Aún no escaneado',
            promptExtra: 'El paquete salió del centro ayer y aún no se ha escaneado.',
            note: 'La pista "aún no se ha escaneado" refuerza "se retrasó" y afina la distribución a su alrededor. Exactamente las mismas continuaciones, otras puntuaciones.',
            scores: { delayed: 5, delivered: 2, pickup: 2, lost: 3 },
        },
        {
            id: 'delivered',
            control: 'Confirmación de entrega',
            promptExtra: 'El sistema muestra una confirmación de entrega.',
            note: 'Una confirmación de entrega pasa el liderazgo a "se entregó". El modelo no comprobó la realidad, solo ponderó lo que dice el contexto.',
            scores: { delayed: 3, delivered: 5, pickup: 2, lost: 2 },
        },
        {
            id: 'pickup',
            control: 'Espera recogida',
            promptExtra: 'El último estado es "espera recogida".',
            note: 'El estado "espera recogida" sube al primer puesto la continuación correspondiente, sin cambiar el grupo de continuaciones. El contexto decide quién va por delante.',
            scores: { delayed: 2, delivered: 3, pickup: 5, lost: 2 },
        },
    ],
};
