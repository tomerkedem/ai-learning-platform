// i18n/locales/es/behind-ai/chapter1.ts
// Spanish Chapter 1 ("What really happens between the question and the answer").
// Shape source: ../../he/behind-ai/chapter1. contentLocale = 'es' (real translation).
//
// No em dash (U+2014) and no en dash (U+2013). Mentor bubble text carries no emoji.
// "Claude" and "ANTHROPIC_API_KEY" are kept literal. seed inputs are coupled to the
// Spanish detection vocabulary in chapter-1/mockEngine.ts.

import type { Locale } from '@/i18n/config';
import { chapter1Visuals } from './chapter1Visuals';
import { chapter1Quiz } from './chapter1Quiz';

export const chapter1 = {
    contentLocale: 'es' as Locale,

    // Hero
    hero: {
        badge: 'Behind the Scenes · 01',
        titleLead: 'Lo que realmente ocurre entre',
        titleHighlight: 'la pregunta y la respuesta',
        ledeLead: 'Escribe una sola frase. A la derecha, el chat se ve normal, igual que en cualquier app. A la izquierda se abre',
        ledeHighlight: ' el camino detrás de la respuesta',
        ledeRest: ': el motor muestra cómo lee la frase y llega a una decisión. Por ahora solo observa, no necesitas entender cada número. La profundidad la abriremos más adelante, paso a paso.',
        chips: [
            'A la derecha: la respuesta que ves',
            'A la izquierda: el camino detrás de la respuesta',
            'Más adelante: abrimos cada paso en profundidad',
        ],
    },

    // Mentor speech bubbles (text only; pose and placement are structural in the page)
    mentor: {
        peek: 'Un primer vistazo dentro del motor',
        holographic: 'Aquí el motor se abre desde dentro',
    },

    // Coach card (first-run guidance toward the lab)
    coach: {
        start: 'Empieza aquí: ',
        body: 'Escribe tu propia frase en el laboratorio de abajo, o elige un ejemplo rápido.',
        closeAria: 'Cerrar la guía',
    },

    // Transparent Chat Lab
    lab: {
        title: 'El Chat Transparente',
        eyebrow: 'Transparent Chat Lab',
        intro: 'Aquí ves que hay un camino detrás de la respuesta: a la derecha la respuesta como siempre, y a la izquierda el camino que llevó a ella.',
        panelTitle: 'Transparent Chat Lab',
        chatSubtitle: 'Chat Mode · conversación',
        agentSubtitle: 'Agent Mode · tarea',
        focusLead: 'Mira primero ',
        focusHighlight: 'la decisión',
        focusRest: ', no cada número. El motor de la izquierda muestra que hay todo un recorrido entre la pregunta y la respuesta. Los detalles completos se abrirán más adelante en el curso.',
        liveNote: 'La respuesta del chat la escribe un modelo real (Claude) en tiempo real, palabra por palabra - exactamente el bucle autorregresivo. El tablero de la derecha sigue siendo una ilustración didáctica: la API no expone las probabilidades internas del modelo.',
        demoNote: 'Modo demo: las respuestas del chat son guionizadas y fijas. Definir ANTHROPIC_API_KEY en el servidor activa un modelo real que escribe la respuesta en vivo, palabra por palabra.',
    },

    // Engine panel titles (GlassEnginePanel)
    panels: {
        answerEngineTitle: 'Answer Engine',
        actionEngineTitle: 'Action Decision Engine',
        chatEngineSubtitle: 'Elegir una respuesta · estaciones clave',
        agentEngineSubtitle: 'Decisión de acción · estaciones clave',
    },

    // Chapter insight
    insightIdea: {
        title: 'La idea del capítulo',
        body: 'Una respuesta de chat es solo la punta visible de un proceso oculto. Detrás de cada respuesta corre un camino, y ese camino puede abrirse paso a paso. Eso es exactamente lo que hará este curso: enseñará el camino detrás de la respuesta, de forma gradual. Todavía no necesitas entender cada mecanismo - basta con entender que el camino existe, y que se puede abrir.',
    },

    // Depth-layer gate (progressive disclosure) + layer intro
    deep: {
        toggleOpen: 'Cerrar la capa de profundidad',
        toggleClosed: 'Abrir el motor completo',
        hint: 'Aquí se abren las herramientas avanzadas: un cabezal de lectura en vivo y una prueba que muestra qué palabra decidió. Puedes explorar a tu propio ritmo.',
        intro1: 'Mira una capa de profundidad: a partir de aquí se vuelve más técnico. Tienes delante dos laboratorios numerados, cada uno muestra un ángulo distinto del mismo camino. No hace falta terminar todo de una vez.',
        intro2Lead: 'En ',
        intro2Mid: ' el sistema elige una respuesta. En ',
        intro2Tail: ' comprueba cuál es el paso correcto siguiente - responder, usar una herramienta, o detenerse y pedir información. Cambia entre ambos con el interruptor en la parte superior del chat.',
    },

    // The four lab headers (eyebrow + title)
    labs: {
        readHead: { eyebrow: 'Lectura en vivo', title: 'El motor cambia de opinión mientras lee' },
        confidence: { eyebrow: 'Cuándo confiar, cuándo detenerse', title: 'El dial de confianza' },
        causality: { eyebrow: 'Causalidad', title: 'Qué palabra decidió' },
        fork: { eyebrow: 'Bifurcación', title: 'Misma frase, dos motores' },
    },

    // Summary (two insights inside the depth layer)
    summary: {
        understandTitle: 'Lo que entiendes ahora',
        understandBody: 'El motor de IA no "sabe" la respuesta - clasifica opciones, y decide según la diferencia entre ellas. Cuando la diferencia es grande responde con confianza; cuando la diferencia es pequeña, el paso correcto es detenerse y preguntar, no adivinar. Lo viste tú mismo: el cabezal de lectura mostró cómo el líder cambiaba mientras leía, y una sola palabra que se cambió volteó toda una decisión.',
        ruleTitle: 'La regla práctica',
        ruleBody: 'Confía en el motor cuando la diferencia es grande y el riesgo es bajo. Cuando la diferencia es pequeña o la acción es sensible - detenerse y pedir una aclaración no es un fallo, es el paso responsable. Aquí es exactamente donde empieza el vínculo entre probabilidad y responsabilidad.',
    },

    // "Before the quiz" card: anchoring the three core ideas in the main flow
    beforeQuiz: {
        title: 'Antes del examen: tres puntos que conviene recordar',
        point1Lead: 'Un camino, no magia.',
        point1Body: ' Detrás de cada respuesta corre un camino: el motor descompone la frase en tokens, clasifica opciones por probabilidad, comprueba cuánta confianza tiene, y solo entonces decide. La estimación se construye mientras lee, y cada palabra adicional puede cambiar la opción líder.',
        point2Lead: 'Dos preguntas distintas.',
        point2BeforeChat: ' En ',
        point2AfterChat: ' el motor pregunta "¿Cuál es la respuesta?". En ',
        point2AfterAgent: ' pregunta "¿Cuál es el paso correcto siguiente?" - responder, usar una herramienta, o detenerse y pedir información.',
        point3Lead: 'La confianza se encuentra con la responsabilidad.',
        point3Body: ' La confianza se mide por la diferencia entre la opción líder y la siguiente. Una diferencia grande y riesgo bajo, puedes dejar que el motor responda. Una diferencia pequeña o una acción sensible, el paso responsable es detenerse y preguntar, no adivinar.',
        footnoteLead: '¿Quieres ver este recorrido en vivo? Abre arriba el ',
        footnoteHighlight: 'motor completo',
        footnoteTail: ' y juega con el cabezal de lectura y el laboratorio "qué palabra decidió".',
    },

    // Chat seed inputs (default input + quick suggestions)
    // Note: these are demo inputs fed to the learning engine, coupled to the Spanish
    // detection vocabulary in chapter-1/mockEngine.ts.
    seed: {
        defaultInput: 'Mi paquete no llegó',
        suggestions: [
            'Mi paquete no llegó',
            '¿Dónde está mi paquete?',
            'Revisa el paquete 123456789',
            'Avisa al cliente que el paquete se perdió',
            'Encárgate de esto',
        ],
    },

    quiz: chapter1Quiz,

    // Visuals and labs sub-namespace
    visuals: chapter1Visuals,
};
