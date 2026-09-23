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
        demo: {
            start: 'Modo presentación',
            exit: 'Salir de la presentación',
            prev: 'Anterior',
            next: 'Siguiente',
            counter: (n: number, total: number) => `Estación ${n} de ${total}`,
        },
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

        // Una frase de mentor por estación: un ángulo que suma a la explicación de la tarjeta.
        mentorHints: {
            request: 'Fíjate: el modelo nunca te ve solo a ti. Todo entra junto.',
            tokenize: 'Mira cómo se corta la frase. Ya no es lenguaje, son trozos.',
            ids: 'De aquí en adelante no hay palabras dentro, solo números.',
            embedding: 'Los números no son al azar: palabras parecidas reciben números parecidos.',
            position: 'Las mismas palabras en otro orden lo cambian todo. Por eso se guarda el orden.',
            context: 'Lo que sale de la ventana se olvida. Así una charla larga pierde su inicio.',
            attention: 'Cada palabra escucha a las demás. Toca una palabra y mira a quién atiende.',
            mix: 'Cada token se envía a expertos. Solo unos pocos de muchos se encienden - así un modelo enorme sigue siendo rápido.',
            layers: 'Cada capa vuelve a ejecutar atención y feed-forward, y afina un poco más. Un modelo real tiene decenas.',
            state: 'Todo el contexto se comprime en un punto. De ahí nace la próxima palabra.',
            logits: 'El modelo sopesa muchas palabras a la vez y puntúa cada una.',
            softmax: 'Las puntuaciones se vuelven porcentajes que suman cien.',
            decoding: 'Misma distribución, otra elección. Por eso a veces la respuesta sorprende.',
            loop: 'Se elige un token y todo vuelve a correr. Así se construye una respuesta completa.',
        },

        request: {
            youTab: 'Lo que ves',
            modelTab: 'Lo que recibe el modelo',
            userLabel: 'Tu mensaje',
            userText: '¿Qué puedo preparar para cenar?',
            systemLabel: 'Instrucciones del sistema',
            systemText: 'Eres un asistente de cocina. Da sugerencias prácticas y breves.',
            historyLabel: 'La conversación hasta ahora',
            historyText: 'Antes mencioné que tengo pasta y tomates en casa.',
            stripLabel: 'Todo entra como una sola secuencia',
            caption: 'Las instrucciones, el historial y tu petición se pegan en una sola secuencia larga, así que todas moldean la respuesta.',
        },

        tokenize: {
            sentence: 'El gato está durmiendo',
            tokens: ['El', 'gato', 'está', 'durmiendo'] as string[],
            caption: 'En un modelo real, a veces el corte cae dentro de una palabra, no solo entre palabras.',
            altSentence: 'Los hallazgos son impresionantes',
            altTokens: ['Los', 'hallazg', 'os', 'son', 'impresion', 'antes'] as string[],
            // Maps each piece to its original word (same-word pieces share a color).
            altGroups: [0, 1, 1, 2, 3, 3] as number[],
            altCaption: 'Los pedazos del mismo color eran una sola palabra. El modelo también trabaja con pedazos de palabras.',
            variantA: 'Frase simple',
            variantB: 'Palabras largas',
        },

        ids: {
            hint: 'Toca una tarjeta para girarla',
            caption: 'El ID es una dirección en el vocabulario, no un significado.',
        },

        embedding: {
            token: 'gato',
            caption: (note: string) =>
                `El token se convierte en un ID del vocabulario y luego en un vector de números que codifica significado. ${note}`,
            // Fixed order across locales (vector numbers are mapped by index): 0 cat, 1 dog, 2 car, 3 bicycle.
            mapWords: ['gato', 'perro', 'coche', 'bicicleta'] as string[],
            mapHint: 'Toca una palabra en el mapa',
            nearLabel: 'Par más cercano',
            mapCaption: 'Las representaciones con significado parecido pueden quedar cerca unas de otras en el espacio.',
        },

        position: {
            tokens: ['Primero', 'lluvia', 'luego', 'sol'] as string[],
            swapLabel: 'Cambia el orden',
            meaningA: 'Primero llueve, y después se despeja el cielo.',
            meaningB: 'Primero hace sol, y después llueve.',
            caption: 'La etiqueta de posición es lo que separa aquí el "antes" del "después".',
        },

        context: {
            windowLabel: 'Ventana de contexto',
            outLabel: 'Fuera de la ventana',
            addLabel: 'Llega un mensaje nuevo',
            messages: [
                'El cumpleaños de mi amigo es el sábado',
                '¡Entendido, bueno saberlo!',
                '¿Qué le puedo regalar?',
                'Quizás un libro o una planta',
                'Todavía no decido',
                '¿Qué día era el cumpleaños de mi amigo?',
            ] as string[],
            caption: 'La ventana no crece: cada mensaje nuevo que entra empuja uno viejo hacia fuera.',
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
            caption: 'Cada palabra atiende a las demás con distinta intensidad.',
        },

        // Station 8: two different tokens, each routed to different experts.
        mix: {
            tokenA: 'receta',
            tokenB: 'clima',
            routerLabel: 'El router elige',
            activeNote: (k: number, n: number) => `${k} de ${n} expertos se ejecutan`,
            outLabel: 'enriquecido',
            hint: 'Cambia de token y mira qué expertos se encienden',
            caption: 'Tras la atención, cada token pasa por una red feed-forward que lo enriquece. En los modelos grandes esto funciona como Mixture-of-Experts: conocimiento enorme, pero solo una parte pequeña se ejecuta por token. Los "expertos" no son expertos humanos en temas: el enrutamiento se aprende en el entrenamiento, es puramente numérico y no es legible de forma directa para las personas.',
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
            blockLabel: 'Cada capa: atención + feed-forward',
            hint: 'Toca un piso para saltar allí',
            caption: 'Ninguna capa entiende por sí sola: el mismo bloque se repite y la comprensión se construye poco a poco.',
        },

        state: {
            orbLabel: 'Una sola representación de todo el contexto',
            insideBtn: '¿Qué hay comprimido dentro?',
            caption: 'El contexto en sí no se borra: en cada vuelta el modelo vuelve a mirarlo.',
        },

        logits: {
            prompt: 'Mañana estará...',
            words: ['soleado', 'lluvioso', 'nublado', 'caluroso', 'fresco', 'agradable', 'tormentoso', 'despejado'] as string[],
            note: 'Ocho candidatos de las decenas de miles que se evalúan a la vez.',
            caption: (note: string) =>
                `Una puntuación más alta solo dice "más probable", no "cuánto más". ${note}`,
        },

        scores: {
            rowLabels: ['Sol', 'Lluvia', 'Nube'] as string[],
            rawHeader: 'Puntuación',
            probHeader: 'Probabilidad',
            totalLabel: 'En total',
            caption: (note: string) =>
                `Incluso después de la conversión esto sigue siendo una distribución, no una decisión. ${note}`,
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
            caption: 'Por eso la respuesta del chat se construye ante tus ojos, palabra a palabra.',
        },
    },
};
