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
            detail: {
                whatHappens: 'Tu solicitud se suma a las instrucciones del sistema y a todo lo que ya se dijo en la conversación.',
                whyItMatters: 'El modelo no ve solo la última frase, sino todo el contexto que la rodea.',
                whatNext: 'Más adelante veremos cómo todo este texto se convierte en unidades de trabajo.',
            },
        },
        tokenize: {
            title: 'División en tokens',
            explanation: 'El texto se descompone en unidades de trabajo que el modelo puede procesar.',
            detail: {
                whatHappens: 'El texto se corta en tokens: a veces una palabra entera, a veces parte de una palabra o un símbolo.',
                whyItMatters: 'Este es el lenguaje con el que el modelo trabaja en realidad, no letras ni necesariamente palabras.',
                whatNext: 'En el capítulo sobre tokenización veremos por qué una palabra y un token no siempre son lo mismo.',
            },
        },
        ids: {
            title: 'Un identificador para cada token',
            term: 'Token IDs',
            explanation: 'Cada token recibe un identificador numérico del vocabulario del modelo.',
            detail: {
                whatHappens: 'Cada token se asigna a un identificador numérico fijo del vocabulario del modelo.',
                whyItMatters: 'El número es una dirección dentro del vocabulario. Todavía no contiene significado.',
                whatNext: 'A continuación veremos cómo el identificador se convierte en una representación que codifica significado.',
            },
        },
        // Zona B - de tokens a representaciones
        embedding: {
            title: 'Representación numérica',
            term: 'Embedding',
            explanation: 'El identificador se convierte en un vector numérico sobre el que el modelo puede calcular.',
            detail: {
                whatHappens: 'El identificador se convierte en un vector: una lista de números sobre la que el modelo puede calcular.',
                whyItMatters: 'Los tokens con significados cercanos reciben números cercanos entre sí.',
                whatNext: 'En el capítulo sobre el significado veremos cómo la dirección del vector codifica relaciones entre palabras.',
            },
        },
        position: {
            title: 'Posición y orden',
            explanation: 'El modelo necesita saber dónde está cada token respecto a los demás.',
            detail: {
                whatHappens: 'Para cada token se guarda información sobre su posición respecto a los demás tokens.',
                whyItMatters: '"El perro muerde al hombre" es distinto de "el hombre muerde al perro", y el orden cambia el significado.',
                whatNext: 'Este orden acompaña al modelo a lo largo de todo el cálculo.',
            },
        },
        context: {
            title: 'Ventana de contexto',
            explanation: 'El modelo tiene en cuenta la conversación, las instrucciones y los tokens ya generados.',
            detail: {
                whatHappens: 'El modelo tiene en cuenta la conversación, las instrucciones y los tokens generados hasta ahora.',
                whyItMatters: 'Una misma palabra puede adquirir un significado distinto según lo que la rodea.',
                whatNext: 'Más adelante veremos cómo este contexto entra realmente en el cálculo.',
            },
        },
        // Zona C - el cálculo del contexto
        attention: {
            title: 'Atención al contexto',
            term: 'Attention',
            explanation: 'Los tokens revisan qué partes del contexto importan ahora.',
            detail: {
                whatHappens: 'Cada token revisa qué otros tokens le importan en este momento.',
                whyItMatters: 'Así se construye la comprensión: una palabra como "él" sabe a quién se refiere.',
                whatNext: 'En los próximos capítulos veremos cómo el contexto cambia la decisión del modelo.',
            },
        },
        mix: {
            title: 'Mezcla de información',
            explanation: 'La información del contexto se mezcla y actualiza las representaciones.',
            detail: {
                whatHappens: 'La información del contexto se mezcla y actualiza la representación de cada token.',
                whyItMatters: 'La representación deja de ser "una palabra suelta" y pasa a ser "una palabra dentro de un contexto".',
                whatNext: 'Este procesamiento se repite una y otra vez a través de las capas.',
            },
        },
        layers: {
            title: 'Capas de profundidad',
            term: 'Transformer',
            explanation: 'El procesamiento se repite a través de muchas capas, y cada capa afina la representación.',
            detail: {
                whatHappens: 'El mismo procesamiento se repite a través de muchas capas, una tras otra.',
                whyItMatters: 'Cada capa afina la representación y añade comprensión.',
                whatNext: 'Al final de las capas se forma una representación interna actualizada.',
            },
        },
        state: {
            title: 'Representación interna actualizada',
            explanation: 'Se forma un estado interno que resume el contexto en el momento actual.',
            detail: {
                whatHappens: 'Se forma un estado interno que resume todo el contexto en el momento actual.',
                whyItMatters: 'De este estado se derivará el siguiente token.',
                whatNext: 'Ahora el modelo está listo para puntuar las opciones.',
            },
        },
        // Zona D - de la representación a la respuesta
        logits: {
            title: 'Puntuaciones en bruto',
            term: 'Logits',
            explanation: 'El modelo asigna puntuaciones en bruto a los posibles siguientes tokens.',
            detail: {
                whatHappens: 'El modelo asigna una puntuación en bruto a cada token posible del vocabulario.',
                whyItMatters: 'Esta puntuación todavía no es un porcentaje, solo una medida de "cuánto encaja".',
                whatNext: 'A continuación las puntuaciones se convertirán en probabilidades.',
            },
        },
        softmax: {
            title: 'De la puntuación a la probabilidad',
            term: 'Softmax',
            explanation: 'Las puntuaciones se convierten en una distribución de probabilidad.',
            detail: {
                whatHappens: 'Las puntuaciones en bruto se convierten en una distribución que suma 100%.',
                whyItMatters: 'Ahora podemos hablar de "qué tan probable" es cada siguiente token.',
                whatNext: 'Las reglas de decodificación elegirán dentro de la distribución.',
            },
        },
        decoding: {
            title: 'Elección del siguiente token',
            term: 'Decoding',
            explanation: 'Las reglas de decodificación determinan qué siguiente token se elige en la práctica.',
            detail: {
                whatHappens: 'Las reglas de decodificación determinan cómo se elige el siguiente token a partir de las probabilidades.',
                whyItMatters: 'Una misma distribución puede llevar a una elección más previsible o más creativa.',
                whatNext: 'El token elegido se suma a la respuesta.',
            },
        },
        loop: {
            title: 'Un bucle hasta la respuesta',
            explanation: 'El token elegido se suma a la respuesta, y luego todo vuelve a ejecutarse.',
            detail: {
                whatHappens: 'El token elegido se suma a la respuesta, y luego todo el recorrido se ejecuta de nuevo para el siguiente token.',
                whyItMatters: 'Así se construye una respuesta completa, token tras token, hasta una señal de parada.',
                whatNext: 'En el primer capítulo verás este bucle funcionando con una solicitud real.',
            },
        },
    },
};
