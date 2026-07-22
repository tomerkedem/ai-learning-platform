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
    redesign: {
        hero: { badge: 'Tras bambalinas · 01', title: 'El chat transparente: el camino detrás de la respuesta', lede: 'El chat muestra una solicitud y una respuesta. Entre ambas hay un camino oculto de producto y modelo, y un fallo puede comenzar en distintos lugares.' },
        mentor: 'Vemos la respuesta. Para entenderla, revisamos el camino. Producto y modelo son capas distintas, y todavía no hace falta conocer cada mecanismo.',
        interaction: { title: 'Qué observar en este experimento', instruction: 'Cambia la solicitud y observa qué puede cambiar: la entrada que arma el producto, la salida del modelo o la decisión del producto.', examplesLabel: 'Ejemplos de solicitud', selectedLabel: 'Solicitud elegida', resultLabel: 'Resultado visible', visibleLabel: 'Lo que muestra el chat', evidenceLabel: 'Lo que indica la evidencia' },
        examples: [{ request: '¿Dónde está mi paquete?', response: 'Necesito un número de pedido para comprobarlo.', evidence: 'La solicitud es parcialmente clara, pero falta información antes de que el modelo pueda dar una respuesta concreta.' }, { request: 'Revisa el pedido 123456', response: 'No pude obtener el estado del envío ahora.', evidence: 'El mismo resultado puede venir de datos externos ausentes, una herramienta fallida o falta de permiso. La respuesta no prueba la causa.' }, { request: 'Encárgate de esto', response: '¿De qué quieres que me encargue?', evidence: 'La ambigüedad puede ser un problema de entrada, no necesariamente un error de generación.' }],
        path: { title: 'El camino a alto nivel', explanation: 'Selecciona una capa para leer su función. Las etiquetas, no solo colores y flechas, describen el orden.', semanticLabel: 'Solicitud, ensamblaje del producto, modelo, tratamiento de salida, respuesta visible', requestTitle: '1. Solicitud del usuario', requestBody: 'Es el texto que el usuario ve y envía.', productInputTitle: '2. El producto arma la entrada', productInputBody: 'El producto puede añadir instrucciones o contexto seleccionado. El mensaje visible no es necesariamente toda la entrada.', modelTitle: '3. Modelo', modelBody: 'El modelo procesa la entrada actual y genera una salida. Es parte del producto, no todo el producto.', productOutputTitle: '4. El producto trata la salida', productOutputBody: 'El producto puede dar formato, comprobar, recuperar datos, usar herramientas o aplicar políticas. Son capacidades opcionales.', responseTitle: '5. Respuesta visible', responseBody: 'Es el extremo del camino que se ve en el chat.', envelope: 'Vemos que el producto arma algo antes de que el modelo lo reciba. El capítulo 2 abrirá ese sobre.' },
        summary: { title: 'Tres ideas para recordar', points: ['La respuesta visible es el final de un camino oculto.', 'El producto y el modelo son capas distintas.', 'Un fallo puede comenzar en distintos lugares, así que revisa el camino y no solo la respuesta.'] },
    },

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
        // Recognition bridge to the intro map (package anchor): same stations, now live.
        mapBridge: 'Estas son exactamente las estaciones del mapa, ahora en vivo, sobre tu consulta del paquete.',
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
        hint: 'Aquí se abre la herramienta avanzada: un cabezal de lectura en vivo que muestra cómo el motor cambia de opinión mientras lee. Puedes explorar a tu propio ritmo.',
        intro1: 'Mira una capa de profundidad: a partir de aquí se vuelve más técnico. Tienes delante un laboratorio en vivo que revela otro ángulo del mismo camino. Explóralo a tu propio ritmo.',
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
        understandBody: 'La demostración clasifica candidatos y muestra su margen de puntuación. Un margen mayor solo indica más separación dentro de esta demostración sintética, no verdad factual, fiabilidad ni permiso para actuar. El decoding puede elegir o muestrear según la distribución y sus reglas.',
        ruleTitle: 'La regla práctica',
        ruleBody: 'Usa el margen de la demostración solo como señal de separación entre candidatos. La confianza factual requiere evidencia, y las acciones sensibles siguen sujetas a permisos y aprobación.',
    },

    // "Before the quiz" card: anchoring the three core ideas in the main flow
    beforeQuiz: {
        title: 'Antes del examen: tres puntos que conviene recordar',
        point1Lead: 'Un camino, no magia.',
        point1Body: ' Detrás de cada respuesta hay un recorrido por tokens, representaciones, puntuaciones y decoding. La vista de entrada progresiva compara ejecuciones separadas con entradas cada vez más completas; no es una lectura humana literal.',
        point2Lead: 'Dos preguntas distintas.',
        point2BeforeChat: ' En ',
        point2AfterChat: ' el motor pregunta "¿Cuál es la respuesta?". En ',
        point2AfterAgent: ' pregunta "¿Cuál es el paso correcto siguiente?" - responder, usar una herramienta, o detenerse y pedir información.',
        point3Lead: 'La confianza se encuentra con la responsabilidad.',
        point3Body: ' El margen mostrado es una métrica sintética de la demostración, no una probabilidad de verdad ni una autorización. Las acciones sensibles aún requieren los permisos y reglas de aprobación del producto.',
        footnoteLead: '¿Quieres ver este recorrido en vivo? Abre arriba el ',
        footnoteHighlight: 'motor completo',
        footnoteTail: ' y juega con el cabezal de lectura y el laboratorio "qué palabra decidió".',
    },

    lock: {
        eyebrow: 'Comprueba tu comprensión',
        question: 'El motor muestra una diferencia pequeña entre la opción líder y la siguiente. ¿Cuál es el paso correcto?',
        answerLabel: 'Responder con confianza',
        askLabel: 'Detenerse y preguntar',
        correctBody: 'Lo captaste. Una diferencia pequeña significa incertidumbre, y el paso responsable es detenerse y preguntar, no adivinar.',
        wrongBody: 'Casi. Una diferencia pequeña en realidad señala incertidumbre. El paso responsable aquí es detenerse y preguntar.',
        retry: 'Intentar de nuevo',
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
