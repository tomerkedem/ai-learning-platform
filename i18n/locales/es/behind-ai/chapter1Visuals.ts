// i18n/locales/es/behind-ai/chapter1Visuals.ts
// Spanish Chapter 1 visuals. Shape source: ../../he/behind-ai/chapter1Visuals.
// contentLocale = 'es' (real translation).
//
// Demo-input coupling: the demo inputs below (confidenceDial.samples[].input,
// forkView.samples[].input, counterfactual.experiments.*[].variants[].text + .pivot)
// are fed into the learning engine and must match the Spanish detection vocabulary
// in app/behind-the-scenes-ai/chapter-1/mockEngine.ts.
//
// No em dash (U+2014) and no en dash (U+2013). Mentor bubble text carries no emoji.

import type { Locale } from '@/i18n/config';
import { chapter1Visuals as heChapter1Visuals } from '../../he/behind-ai/chapter1Visuals';

export const chapter1Visuals = {
    contentLocale: 'es' as Locale,

    // GlassEnginePanel: inner labels
    enginePanel: {
        stations: 'Estaciones clave',
        actLabel: 'Acto',
        normalizeTrimmed: 'Espacios extra recortados respecto a la entrada original.',
        inputClean: 'La entrada ya está limpia - nada que corregir',
        noTokens: 'Aún no hay tokens.',
        noMatch: '- sin coincidencia',
        claudeTokens: (n: number) => `Claude (real): ${n} tokens`,
        claudeNote: 'Arriba, el conteo es por palabras. El número real difiere porque el modelo divide en sub-palabras - y no revela la división en sí, solo el conteo.',
        illustrationTitle: 'Una ilustración de los principios',
        illustrationBody: 'Cada modelo tiene su propio método, pero todos se basan en los mismos principios. Este es exactamente el camino que recorre tu frase.',
    },

    // "Sentence Journey" (Chat mode) strings. TODO(i18n): translate from the Hebrew source.
    journey: heChapter1Visuals.journey,

    // engineTrace: station names, titles, captions and labels
    trace: {
        acts: {
            intake: 'Recepción',
            analyze: 'Análisis',
            decide: 'Decisión',
            output: 'Salida',
            task: 'Detección de tarea',
            risk: 'Riesgo y responsabilidad',
            act: 'Decisión y salida',
        },
        unit: 'tokens',

        chat: {
            c1: { title: 'Entrada bruta', note: 'El texto que escribiste, exactamente como llegó.' },
            c2: { title: 'Normalizar', note: 'Se recortan los espacios extra, el texto se alinea para el procesamiento.' },
            c3: { title: 'Tokenizar', note: 'El texto se divide en unidades. Aquí la división es por palabras enteras, a modo de ilustración. Un modelo real divide en sub-palabras (subword), y la división en sí varía de modelo a modelo, por lo que la misma frase se rompe en un número distinto de tokens en cada modelo.' },
            c4: { title: 'Conteo de tokens', note: 'Cuántas unidades hay que procesar. Una primera señal del tamaño de la solicitud.' },
            c5: { title: 'Escaneo de palabras clave', note: 'Qué palabras de la entrada activan qué intención. Estas son las pistas que mueven la clasificación.' },
            c6: { title: 'Negación', note: 'Una palabra de negación convierte un asunto en una queja, y refuerza la intención de no entregado.' },
            c7: { title: 'Intenciones candidatas', note: 'Todas las intenciones posibles entran al ruedo, cada una con su número de coincidencias.' },
            c8: { title: 'Probabilidades', note: 'Las coincidencias se convierten en probabilidades que suman 100%. La más alta lidera.' },
            c9: { title: 'Selección del líder', note: 'La intención con la probabilidad más alta se elige como líder.' },
            c10: { title: 'Diferencia', note: 'La diferencia entre la primera y la segunda. No solo quién lidera, sino por cuánto.' },
            c11: { title: 'Confianza', note: 'La diferencia se traduce en un nivel de confianza: alto, medio o bajo.' },
            c12: { title: 'Significado', note: 'La intención líder se asigna al dominio de significado que guiará la respuesta.' },
            c13: { title: 'Decisión', note: 'Responder cuando la confianza es suficiente, de lo contrario detenerse y pedir una aclaración.' },
            c14: { title: 'Estado de salida', note: 'Lo que el motor está a punto de devolver en la práctica tras la decisión.' },
            c15: { title: 'Respuesta', note: 'La redacción final que se muestra al usuario.' },
        },
        negationOn: 'Negación encontrada',
        negationOff: 'Sin negación',
        negationDetail: 'Refuerza "Package not delivered"',

        agent: {
            a1: { title: 'Entrada bruta', note: 'La solicitud que escribiste, el punto de entrada al motor de acción.' },
            a2: { title: 'Normalizar', note: 'Se recortan los espacios extra, el texto se alinea para el procesamiento.' },
            a3: { title: 'Tokenizar', note: 'El texto se divide en unidades. Aquí la división es por palabras enteras, a modo de ilustración. Un modelo real divide en sub-palabras (subword), y la división en sí varía de modelo a modelo, por lo que la misma frase se rompe en un número distinto de tokens en cada modelo.' },
            a4: { title: 'Conteo de tokens', note: 'Cuántas unidades hay que procesar.' },
            a5: { title: 'Palabras de acción', note: 'Palabras como "revisar" o "enviar" indican que esto es una tarea, no una pregunta.' },
            a6: { title: 'Escaneo de dominio', note: 'Si la solicitud toca la entrega o un paquete, el dominio que el motor sabe manejar.' },
            a7: { title: 'Identificador', note: 'Una secuencia larga de dígitos = un código de barras. Sin él, una acción real es imposible.' },
            a8: { title: 'Tarea detectada', note: 'De todas las pistas, el motor resume cuál es la tarea en cuestión.' },
            a9: { title: 'Información faltante', note: 'Lo que se necesita para actuar, y aún no está en la solicitud.' },
            a10: { title: 'Necesidad de herramienta', note: 'Si se necesita una fuente externa (como un sistema de seguimiento) para completarla.' },
            a11: { title: 'Sensibilidad', note: 'Acciones como "enviar" o "actualizar" afectan a un cliente y requieren cuidado.' },
            a12: { title: 'Preparación para actuar', note: 'Dada la información y el riesgo: si está permitido y es posible actuar ahora.' },
            a13: { title: 'Decisión', note: 'El paso correcto siguiente: responder, usar una herramienta, pedir información, o detenerse.' },
            a14: { title: 'Estado de salida', note: 'Lo que ocurrirá en la práctica tras la decisión.' },
            a15: { title: 'Respuesta', note: 'La redacción final que se muestra al usuario.' },
        },
        actionWordsLabel: 'Palabras de acción',
        deliveryDomainLabel: 'Dominio de entrega',
        sensitiveLabel: 'Acción sensible',
        barcodeOn: 'Código de barras encontrado',
        barcodeOff: 'Sin identificador',
        barcodeOnDetail: 'Se puede llamar a la Tracking API',
        barcodeOffDetail: 'Faltará información para actuar',
        toolNeed: (tool: string) => `Herramienta necesaria: ${tool}`,
        noTool: 'Sin herramienta externa',
        canActNow: 'Se puede actuar ahora',
        cannotActYet: 'No actuar todavía',
        riskDetail: (risk: string) => `Riesgo: ${risk}`,
    },

    // mockEngine: demo replies (resolved by the replyKey the engine returns)
    mockEngine: {
        chatReplies: {
            notDelivered: 'Esto parece un caso de no entrega. Conviene revisar el estado del envío por código de barras.',
            tracking: 'Podemos revisar el estado del envío por número de seguimiento. ¿Cuál es el número de seguimiento?',
            system: 'Puede que sea un fallo al mostrar la información en el sistema. Conviene actualizar e intentar de nuevo.',
            payment: 'Esta pregunta parece relacionada con un cobro o un pago. Conviene revisar los datos de la factura.',
            other: 'No estoy seguro de haber entendido exactamente. ¿Podrías describir el problema?',
        },
        agentReplies: {
            sensitive: 'Esta es una acción que afecta a un cliente. No la realizaré sin verificación y aprobación - puedo preparar un borrador para aprobación.',
            tool: 'Hay un código de barras. Estoy revisando el estado del envío en el sistema de seguimiento...',
            askBarcode: 'Para revisar esto realmente, necesito el número de código de barras del paquete.',
            vague: 'Necesito entender a qué se refiere esto - ¿qué tarea o paquete debo revisar?',
            general: 'Esto suena como una solicitud general. Se puede responder directamente, sin una herramienta externa.',
        },
    },

    // ReadHeadLab
    readHead: {
        emptyState: 'Escribe una frase en el chat para que el cabezal de lectura pueda escanearla.',
        title: 'Cabezal de lectura',
        subtitle: 'El cursor que se mueve sobre la frase palabra por palabra',
        introHeadLabel: 'El cabezal de lectura',
        introMid: ' es el cursor que se mueve sobre la frase palabra por palabra, como un dedo que sigue el texto al leer. En cada parada se ejecuta el mismo motor sobre las palabras leídas hasta ahora, así puedes observar al modelo ',
        introEmph: 'cambiar de opinión mientras lee',
        introTail: '. Elige un ejemplo y ejecuta el escáner.',
        examplesLabel: 'Elige un ejemplo',
        yourSentence: 'Tu frase',
        play: 'Reproducir',
        pause: 'Pausar',
        again: 'Otra vez',
        back: 'Atrás',
        forward: 'Adelante',
        restart: 'Reiniciar',
        wordCountAria: (i: number, n: number) => `Palabra ${i} de ${n}`,
        scrubberAria: 'Posición del cabezal de lectura',
        flipMarkerAria: 'Aquí cambió el líder',
        leaderNow: 'Líder ahora:',
        leaderTag: 'líder',
        confidence: 'confianza',
        decisionNow: 'Decisión ahora:',
        streamHint: 'El ancho = la probabilidad. El tiempo fluye con la dirección de lectura.',
        readingNow: 'Aún leyendo... la decisión se asienta al final de la frase.',
        insightTitle: 'Qué pasó aquí',
        insightChanges: (n: number) =>
            n === 0
                ? 'El modelo no cambió de líder en toda la frase - leyó sin cambiar de opinión, solo ganó más confianza.'
                : n === 1
                    ? 'El modelo cambió de opinión una vez mientras leía.'
                    : `El modelo cambió de opinión ${n} veces mientras leía.`,
        insightPivot: (w: string) => `La palabra que volteó la decisión final: "${w}".`,
        scriptedNote: 'Ejemplo guiado: las probabilidades aquí son una ilustración didáctica de cómo se acumula la creencia palabra por palabra, no la salida de un modelo real.',
        liveNote: 'Esta es tu frase, ejecutada con el motor didáctico del capítulo. Fíjate en que las probabilidades solo se mueven cuando entra una palabra clave.',
        examples: [],
    },

    // ConfidenceDial (Chat mode)
    confidenceDial: {
        title: 'Dial de confianza',
        ideaLabel: 'La idea:',
        ideaPart1: ' antes de que el motor responda, sopesa varias interpretaciones de la misma frase. La ',
        ideaGap: 'diferencia',
        ideaPart2: ' entre la interpretación líder y la segunda es su nivel de confianza. Tu pregunta:',
        ideaEmph: ' cuánta confianza exigir',
        ideaPart3: ' antes de dejar que responda por sí solo, y cuándo es mejor que se detenga y pregunte.',
        howTitle: 'Cómo usarlo',
        how1: ' Elige una entrada (la tuya o un ejemplo). El marcador se moverá a la confianza del motor.',
        how2: ' Arrastra el umbral a lo largo del eje, o elige un nivel de riesgo.',
        how3Lead: ' Cuando el umbral cruza el marcador, la decisión cambia entre ',
        how3Mid: ' y ',
        answerAlone: 'responder solo',
        stopAsk: 'detenerse y preguntar',
        leadingLabel: 'Interpretación líder',
        gapLabel: 'diferencia',
        competitorLabel: 'Segundo lugar',
        tryInput: 'Prueba una entrada:',
        yourMessage: 'Tu mensaje',
        // Demo input: coupled to the Spanish vocabulary in mockEngine (see header note).
        samples: [
            { input: 'Mi paquete no llegó', tag: 'Entrada clara' },
            { input: '¿Dónde está mi pedido? No aparece en el sistema', tag: 'Entrada mixta' },
            { input: '¿Dónde está mi pago?', tag: 'Entrada ambigua' },
        ],
        analyzingLead: 'Analizando: "',
        analyzingTail: '"',
        dragHint: 'Arrastra el umbral a lo largo del eje',
        engineMarker: (margin: number) => `Motor ${margin}%`,
        thresholdMarker: (threshold: number) => `Umbral ${threshold}%`,
        thresholdAria: 'Umbral de confianza requerido',
        stakesTitle: '¿Cuál es el riesgo si el motor se equivoca aquí?',
        // he/sub/note are display; the field name 'he' is kept for shape parity.
        stakes: {
            low: { he: 'Riesgo bajo', sub: 'Una pregunta de información simple', note: 'Un error aquí es barato. Puedes exigir poca confianza y dejar que el motor responda por sí solo.' },
            mid: { he: 'Riesgo medio', sub: 'Información parcial', note: 'Vale la pena un umbral medio. Si la diferencia que calculó el motor es menor que él, mejor detenerse y preguntar.' },
            high: { he: 'Riesgo alto', sub: 'Una acción que afecta a un cliente', note: 'Un error aquí es caro. Exige alta confianza, y si no la hay, detente y pide aprobación.' },
        },
        recommendedThreshold: (rec: number) => `Umbral recomendado ${rec}%`,
        passLead: (margin: number) => `La confianza del motor (diferencia ${margin}%) `,
        passBold: 'está por encima del umbral',
        passTail: (threshold: number) => ` que estableciste (${threshold}%). Responderá por sí solo.`,
        failLead: (threshold: number) => `El umbral que estableciste (${threshold}%) `,
        failBold: 'está por encima de la confianza',
        failTail: (margin: number) => ` del motor (diferencia ${margin}%). El paso responsable: detenerse y preguntar.`,
        integrityLead: 'Arrastra el umbral hasta que cruce el marcador del motor - ahí es exactamente donde la decisión cambia. Ningún número que produjo el motor cambió, solo ',
        integrityBold: 'la política que eliges',
        integrityTail: '. Así es como la probabilidad se convierte en responsabilidad.',
    },

    // ConfidenceDial (Agent mode)
    agentGate: {
        title: 'La puerta de decisión en Agent',
        bodyLead: 'En Agent la puerta no se apoya en una diferencia entre probabilidades sino en ',
        bodyEmph: 'riesgo e información faltante',
        bodyTail: ': si la tarea es clara, si falta un identificador, y si la acción es sensible. Por eso aquí no hay dial de diferencia - la decisión la fijan los factores de abajo.',
        footerLead: 'Cambia a ',
        footerTail: ' para arrastrar el dial de confianza sobre la diferencia. En Agent, detenerse para aprobación no es un fallo - es un control responsable antes de una acción que afecta a un cliente.',
    },

    // CounterfactualDiff
    counterfactual: {
        title: 'Qué pasaría si',
        whyLabel: 'Por qué importa: ',
        whyLead: 'La decisión del motor nunca es aleatoria - siempre hay una palabra que decide. Aquí hacemos dos cosas: primero ',
        whyFind: 'encontramos',
        whyMid: ' la palabra que causó la decisión, y luego ',
        whyProve: 'demostramos',
        whyTail: ' que es esa - cambiamos solo ella y observamos cómo la decisión cambia.',
        howTitle: 'Cómo usarlo',
        how1: ' Elige una palanca causal - qué palabra probar.',
        how2: ' Mira abajo qué palabra decidió la decisión actual.',
        how3: ' Cambia entre las dos redacciones que difieren solo en esa palabra, y observa cómo la decisión cambia.',
        tryLever: 'Prueba una palanca:',
        noPivot: 'sin la palabra pivote',
        attrChose: 'El motor eligió',
        // 'the ' prefix before the bold "why"; kept in the dictionary so no text is hardcoded.
        attrWhyPrefix: 'el ',
        attrWhy: 'porqué',
        attrWithPivotMid: ' es la palabra ',
        attrWithPivotTail: '. ¿Quieres asegurarte de que es realmente la que decide? Cambia solo ella abajo.',
        attrNoPivotMid1: ' es en realidad que lo que ',
        attrNoPivotMissing: 'falta',
        attrNoPivotMid2: ' aquí es la palabra ',
        attrNoPivotTail: '. La ausencia de una palabra también es una causa. Vuelve a ponerla abajo y observa.',
        flipped: 'La decisión cambió:',
        sameDecision: 'La decisión siguió igual, pero la palabra cambió la intención líder y la respuesta que se genera.',
        barsTitle: 'Cuánto cree el motor en cada interpretación',
        barsLegend: 'El número verde o rojo junto a cada barra = cuánto subió o bajó esa interpretación por la palabra que cambiaste.',
        barReadWith: (word: string, before: number, after: number) => `La palabra "${word}" disparó la interpretación líder del ${before}% al ${after}%.`,
        barReadWithout: (word: string, after: number) => `Sin la palabra "${word}" ninguna interpretación destaca: la líder llega solo al ${after}%.`,
        ghostHint: 'El contorno punteado = la ejecución anterior (el fantasma)',
        replyToCreate: 'La respuesta que se crearía',
        beforeAfter: 'Antes / después',
        // Experiments: chip/why are display; variants[].text/pivot are coupled demo input.
        experiments: {
            chat: [
                {
                    key: 'neg',
                    chip: 'Palabra de negación',
                    why: 'Una palabra de negación convierte "todo está bien" en "hay un problema". Sin ella no hay nada que resolver, por lo que la intención líder y la decisión cambian.',
                    variants: [
                        { text: 'Mi paquete no llegó', pivot: 'no' },
                        { text: 'Mi paquete llegó', pivot: '' },
                    ],
                },
                {
                    key: 'kw',
                    chip: 'Palabra clave',
                    why: 'Exactamente la misma estructura de frase, una palabra clave distinta - y la intención líder salta a una categoría completamente diferente.',
                    variants: [
                        { text: 'Hay un problema con el pago', pivot: 'pago' },
                        { text: 'Hay un problema con el sistema', pivot: 'sistema' },
                    ],
                },
            ],
            agent: [
                {
                    key: 'barcode',
                    chip: 'Identificador (código de barras)',
                    why: 'Sin un identificador el motor no puede actuar: se detiene y pide la información faltante. En el momento en que entra el código de barras, recurre a la herramienta de seguimiento.',
                    variants: [
                        { text: 'Revisa el paquete 123456789', pivot: '123456789' },
                        { text: 'Revisa el paquete', pivot: '' },
                    ],
                },
                {
                    key: 'sensitive',
                    chip: 'Acción sensible',
                    why: 'La palabra de acción fija el riesgo: "revisar" es una llamada segura, "avisar" afecta a un cliente - por eso el motor se detiene para aprobación en lugar de actuar.',
                    variants: [
                        { text: 'Avisa al cliente que el paquete se perdió', pivot: 'Avisa' },
                        { text: 'Revisa si el paquete se perdió', pivot: 'Revisa' },
                    ],
                },
            ],
        },
    },

    // ForkView
    forkView: {
        title: 'Bifurcación: misma entrada, dos motores',
        ideaLabel: 'La idea:',
        ideaLead: ' exactamente la misma entrada entra en dos motores. No están en desacuerdo sobre los hechos, sino que ',
        ideaEmph: 'hacen una pregunta distinta sobre ella',
        ideaTail: ' - y por eso llegan a decisiones distintas.',
        howTitle: 'Cómo usarlo',
        how1: ' Elige una entrada (la tuya o un ejemplo).',
        how2: ' Mira cómo exactamente los mismos tokens entran en ambos motores.',
        how3: ' Compara: a veces coinciden, a veces se dividen. La barra de abajo explica por qué.',
        tryInput: 'Prueba una entrada:',
        yourMessage: 'Tu mensaje',
        // Demo input: coupled to the Spanish vocabulary in mockEngine (see header note).
        samples: [
            { input: 'Mi paquete no llegó', tag: 'Queja' },
            { input: 'Revisa el paquete 123456789', tag: 'Tarea con un ID' },
            { input: 'Avisa al cliente que el paquete se perdió', tag: 'Acción sensible' },
            { input: '¿Cuál es su horario de atención?', tag: 'Pregunta general' },
        ],
        analyzingLead: 'Analizando: "',
        analyzingTail: '"',
        sameTokens: 'Los mismos tokens entran en ambos motores',
        divergeLead: 'Aquí se dividen: Chat eligió "',
        divergeMid: '", y Agent eligió "',
        divergeTail: '".',
        agreeLead: 'Aquí coinciden: ambos llegaron a "',
        agreeTail: '". Incluso cuando los motores hacen una pregunta distinta, a veces la respuesta es la misma.',
        questionLabel: 'Su pregunta:',
        chatQuestion: '¿Cuál es la respuesta?',
        agentQuestion: '¿Cuál es el paso seguro siguiente?',
        footer: 'Exactamente los mismos tokens, y a veces dos decisiones. La diferencia no está en la entrada sino en la pregunta que cada motor hace sobre ella: Chat elige la respuesta probable, y Agent sopesa el paso seguro siguiente - responder, usar una herramienta, o detenerse y pedir información.',
    },

    // PredictDecision (next-word guess)
    predict: {
        eyebrow: 'Adivina rápido · Completa la palabra',
        question: '¿Qué palabra elegirá el motor a continuación?',
        subtitle: 'Antes de ejecutar el cabezal de lectura - adivina cuál es la palabra más probable a continuación.',
        sentenceLead: 'Mi paquete todavía no ha ',
        sentenceTail: '',
        words: {
            absurd: 'bailado',
            arrived: 'llegado',
            plausible: 'salido',
        },
        correctTitle: '¡Exacto!',
        correctBody: 'Correcto. "llegado" es la continuación natural aquí, así que el motor le da la probabilidad más alta.',
        wrongTitle: '¡Casi!',
        wrongBody: 'El motor habría puesto "llegado" mucho más arriba - es con diferencia la continuación más probable aquí. Las otras palabras son simplemente raras en este contexto.',
        rankingLabel: 'Así ordena el motor las palabras',
        bridge: 'Justo este orden es el que el cabezal de lectura de abajo muestra en vivo',
        guessAgain: 'Adivina otra vez',
    },
};
