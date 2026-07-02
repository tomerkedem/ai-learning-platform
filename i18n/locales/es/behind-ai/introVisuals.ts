// i18n/locales/es/behind-ai/introVisuals.ts
// Spanish (neutral international) introduction visual/UI strings.
// Shape source: ../../he/behind-ai/introVisuals.
//
// Display text only. Structural values (numbers, vectors, indices, map positions)
// stay in the components. Fixed index contracts: attention tokens (0 = noun,
// 3 = pronoun, 4 = state), position tokens (indices 1 and 3 swap), embedding
// mapWords (0+1 close pair, 2+3 close pair), context messages (chronological).
// "IA" is used in Spanish prose. No em dash (U+2014), no en dash (U+2013),
// no Hebrew characters.

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
        replay: 'Repetir',
        soundOn: 'Activar sonidos',
        soundOff: 'Silenciar sonidos',

        request: {
            youTab: 'Lo que ves',
            modelTab: 'Lo que recibe el modelo',
            userLabel: 'Tu mensaje',
            userText: '¿Dónde está mi paquete?',
            systemLabel: 'Instrucciones del sistema',
            systemText: 'Eres un agente de soporte. Revisa el estado del envío antes de responder.',
            historyLabel: 'La conversación hasta ahora',
            historyText: 'Pedí ayer y recibí un número de seguimiento.',
            stripLabel: 'Todo entra como una sola secuencia',
            caption: 'El modelo nunca recibe solo tu último mensaje: las instrucciones, el historial y tu petición se pegan en una sola secuencia larga.',
        },

        tokenize: {
            sentence: 'Mi paquete no llegó',
            tokens: ['Mi', 'paquete', 'no', 'llegó'] as string[],
            caption: 'El texto se divide en unidades. En un modelo real, a veces el corte cae dentro de una palabra.',
            altSentence: 'Las entregas son impresionantes',
            altTokens: ['Las', 'entreg', 'as', 'son', 'impresion', 'antes'] as string[],
            // Maps each piece to its original word (same-word pieces share a color).
            altGroups: [0, 1, 1, 2, 3, 3] as number[],
            altCaption: 'Los pedazos del mismo color eran una sola palabra. El modelo también trabaja con pedazos de palabras.',
            variantA: 'Frase simple',
            variantB: 'Palabras largas',
        },

        ids: {
            hint: 'Toca una tarjeta para girarla',
            caption: 'A partir de aquí no hay palabras dentro. Solo números.',
        },

        embedding: {
            token: 'paquete',
            caption: (note: string) =>
                `El token se convierte en un ID del vocabulario y luego en un vector de números que codifica significado. ${note}`,
            // Fixed order across locales (vector numbers are mapped by index): 0 package, 1 delivery, 2 cat, 3 dog.
            mapWords: ['paquete', 'entrega', 'gato', 'perro'] as string[],
            mapHint: 'Toca una palabra en el mapa',
            nearLabel: 'Par más cercano',
            mapCaption: 'Las palabras con significado parecido reciben números parecidos y caen cerca unas de otras.',
        },

        position: {
            tokens: ['Primero', 'el pago', 'luego', 'la entrega'] as string[],
            swapLabel: 'Cambia el orden',
            meaningA: 'Pagas antes de que salga el paquete.',
            meaningB: 'Pagas solo cuando llega el paquete.',
            caption: 'Las mismas palabras, otro orden, otro trato. Por eso cada token recibe una etiqueta de posición.',
        },

        context: {
            windowLabel: 'Ventana de contexto',
            outLabel: 'Fuera de la ventana',
            addLabel: 'Llega un mensaje nuevo',
            messages: [
                'Pedí una aspiradora inalámbrica',
                'Pedido recibido, ¡gracias!',
                '¿Cuándo llega?',
                'Tu envío sale hoy',
                'El paquete todavía no llegó',
                '¿Qué habías pedido exactamente?',
            ] as string[],
            caption: 'Lo que sale de la ventana deja de existir para el modelo. Por eso una conversación larga puede olvidar su propio comienzo.',
        },

        // stories order must match the tokens order (index for index).
        attention: {
            tokens: ['El perro', 'corrió', 'porque', 'él', 'estaba feliz'] as string[],
            strongLabel: 'Vínculo fuerte',
            weakLabel: 'Débil',
            stories: [
                '"El perro" se une sobre todo a "corrió": quién hace la acción.',
                '"corrió" busca quién corrió, así que se une a "el perro".',
                '"porque" conecta la causa: se une a "estaba feliz".',
                '¿Quién es "él"? El modelo lo une a "el perro".',
                '¿Quién estaba feliz? "estaba feliz" se une a "él", el perro.',
            ] as string[],
            caption: 'Toca una palabra para cambiar el foco. Cada palabra atiende a las demás con distinta intensidad.',
        },

        // Station 8: one ambiguous word, two contexts, the meaning flips.
        mix: {
            word: 'orden',
            aLabel: 'Mi orden llegó de la tienda',
            aSource: 'tienda',
            aMeaning: 'un pedido que compraste',
            bLabel: 'El capitán dio una orden',
            bSource: 'capitán',
            bMeaning: 'un mando que cumplir',
            caption: 'La palabra entró idéntica en ambas frases. La información de sus vecinas se mezcló en su representación y salió con otro significado.',
        },

        layers: {
            sentence: 'El perro corrió porque él estaba feliz',
            floors: ['Palabras y gramática', 'Quién se refiere a quién', 'Intención y significado'] as string[],
            notes: [
                'El modelo detecta la estructura: quién hace qué.',
                'El modelo conecta: "él" es el perro.',
                'El modelo capta la causa: la alegría explica la carrera.',
            ] as string[],
            floorLabel: 'Piso',
            hint: 'Toca un piso para saltar allí',
            caption: 'Un modelo real tiene decenas de pisos como estos, y cada uno pule la comprensión un poco más.',
        },

        state: {
            orbLabel: 'Una sola representación de todo el contexto',
            insideBtn: '¿Qué hay comprimido dentro?',
            caption: 'Todo el contexto queda comprimido en un punto. De ahí nacerá la próxima palabra.',
        },

        logits: {
            prompt: 'Mañana estará...',
            words: ['soleado', 'lluvioso', 'nublado', 'caluroso', 'fresco', 'agradable', 'tormentoso', 'despejado'] as string[],
            note: 'Ocho candidatos de las decenas de miles que se evalúan a la vez.',
            caption: (note: string) =>
                `Cada candidato recibe una puntuación bruta y la lista se ordena según quién lidera. ${note}`,
        },

        scores: {
            rowLabels: ['Sol', 'Lluvia', 'Nube'] as string[],
            rawHeader: 'Puntuación',
            probHeader: 'Probabilidad',
            totalLabel: 'En total',
            caption: (note: string) =>
                `Las puntuaciones brutas (gris) se convierten en probabilidades que suman 100%. ${note}`,
        },

        decoding: {
            prompt: 'Mañana habrá',
            sure: 'Modo seguro',
            surprise: 'Modo sorpresa',
            roll: 'Elige la próxima palabra',
            tally: 'Resultados hasta ahora',
            sureNote: 'En modo seguro siempre gana la palabra líder. Misma pregunta, misma respuesta.',
            surpriseNote: 'En modo sorpresa a veces gana una palabra menos probable. Por eso la misma pregunta puede recibir respuestas distintas.',
        },

        loop: {
            words: ['Hoy', 'hará', 'un', 'día', 'de', 'sol'] as string[],
            play: 'Continuar',
            pause: 'Pausar',
            tokenLabel: 'Token',
            stopLabel: 'Señal de parada',
            caption: 'Cada vuelta añade un token a la respuesta. Por eso la respuesta del chat se construye ante tus ojos, palabra a palabra.',
        },
    },
};
