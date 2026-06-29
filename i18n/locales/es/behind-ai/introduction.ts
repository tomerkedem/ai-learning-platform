// i18n/locales/es/behind-ai/introduction.ts
// Spanish Introduction ("Detrás de escena de la IA"). Shape source: ../../he/behind-ai/introduction.
// contentLocale = 'es' (real translation). Only user-facing text is translated; ids and structural
// keys are unchanged. In lesson prose "IA" is used; "AI" is kept in product/brand chrome (the badge).
// Technical terms (Token IDs, Embedding, Attention, Transformer, Logits, Softmax, Decoding) stay in
// English by design. The station map lives in introRoadmap.ts. No em dash (U+2014), no en dash (U+2013).

import type { Locale } from '@/i18n/config';
import { introRoadmap } from './introRoadmap';

export const introduction = {
    contentLocale: 'es' as Locale,

    // ── Hero ──
    hero: {
        badge: 'El laboratorio transparente · Behind the Scenes',
        titleLead: '¿Qué ocurre en realidad entre el mensaje que envías',
        titleAccent: 'y la respuesta que recibes?',
        intro: 'Una mirada a lo que ocurre en el momento en que envías un mensaje a un chat.',
    },

    // ── El ejemplo de chat y la puerta hacia el motor (EngineReveal + EngineGate) ──
    chat: {
        promptRole: 'Tu solicitud',
        prompt: 'Mi paquete no llegó. ¿Qué hago?',
        inputPlaceholder: 'Escribe un mensaje...',
        answerRole: 'La respuesta',
        answer: 'Lamento escuchar eso. Conviene revisar el estado del envío para ver si hay alguna actualización del centro logístico.',
        outsideLine: 'Desde fuera parece que son dos pasos: escribiste una solicitud y recibiste una respuesta.',
        curiosityLine: 'Pero la verdadera pregunta es qué ocurrió en el medio.',
        gateLead: 'Ahora vamos a abrir lo que ocurrió entre la solicitud y la respuesta.',
        revealLabel: 'Abre el motor entre la pregunta y la respuesta',
        closeLabel: 'Cerrar la vista',
        revealedLabel: 'Así se ve el motor por dentro',
        bridge: 'Bajo los dos pasos que se ven desde fuera funciona un recorrido completo. Estas son sus estaciones principales.',
        downCue: 'El mapa completo está justo abajo',
    },

    // ── Cuatro superestaciones abstractas que aparecen al abrir la puerta del motor ──
    engineTeaser: ['Tokens', 'Números', 'Contexto', 'Elección'],

    // ── Adivinanza rápida: cuatro explicaciones que compiten (HypothesisGuess) ──
    quickGuess: {
        eyebrow: 'Adivinanza rápida · Cuatro explicaciones que compiten',
        question: '¿Qué explicación está más cerca de lo que ocurre en el medio?',
        hint: 'Elige la explicación que te parezca más cercana a la realidad. Aquí no hay puntaje, solo la elección de un modelo mental.',
        correctTitle: '¡Exacto!',
        correctLead: 'Esta es la imagen más precisa.',
        correctBody: 'El modelo trabaja con tokens, calcula el contexto, elige el siguiente token y luego repite el proceso.',
        correctBridge: 'Eso es exactamente lo que vamos a abrir ahora. Abre el motor entre la pregunta y la respuesta más abajo.',
        wrongLead: 'Es un error de razonamiento común, pero no es lo que ocurre en realidad.',
        retry: 'Elegir de nuevo',
        revealCorrect: 'Mostrar la explicación precisa',

        /** Text of the four hypotheses, by id. Structure (cue, correct) lives in the view layer. */
        hypotheses: {
            read: {
                title: 'Lectura directa',
                concept: 'El modelo lee la frase como una persona y arma una respuesta.',
                whyTempting: 'Así leemos nosotros, por eso es natural suponer que el modelo también lo hace.',
                whyWrong: 'El modelo no lee letras ni palabras como una persona. Trabaja con tokens y con números.',
            },
            rail: {
                title: 'Un recorrido fijo',
                concept: 'El modelo siempre pasa por el mismo número fijo de pasos, como una línea de montaje.',
                whyTempting: 'Resulta cómodo pensar en el modelo como una línea de montaje ordenada con un número de pasos conocido.',
                whyWrong: 'No hay un número fijo de pasos. En cada pasada se ejecutan muchísimos cálculos, y eso varía según el modelo y el contexto.',
            },
            tokens: {
                title: 'Un motor de tokens',
                concept: 'El modelo divide el texto en tokens, calcula el contexto y genera una respuesta token tras token.',
            },
            archive: {
                title: 'Búsqueda en un repositorio',
                concept: 'El modelo extrae una respuesta ya hecha de un repositorio.',
                whyTempting: 'Las respuestas suenan terminadas y pulidas, como si se hubieran extraído de un repositorio.',
                whyWrong: 'No hay un repositorio de respuestas ya hechas. El modelo genera la respuesta token tras token en tiempo real.',
            },
        },
    },

    // ── Título del mapa de estaciones y la pista de apertura ──
    roadmapHeading: {
        eyebrow: 'Abrimos el motor',
        title: 'Un mapa de las estaciones principales en el camino del texto a la respuesta',
        subtitle: 'Bajo los dos pasos que se ven desde fuera funciona un recorrido completo. Estas son sus estaciones principales, de la solicitud a la respuesta.',
        hint: 'Haz clic en una estación para mirar dentro: una explicación breve y un ejemplo.',
    },

    // ── La nota de honestidad bajo el mapa ──
    truthNote:
        'Este es un mapa de aprendizaje, no una foto completa de cada cálculo. En un modelo real, dentro de cada estación ocurren muchas operaciones en paralelo, y el número exacto varía según el modelo, la longitud del contexto y la forma en que se ejecuta.',

    // ── Las etiquetas fijas de las tres preguntas en la expansión de una estación ──
    stationDetailLabels: {
        whatHappens: '¿Qué ocurre aquí?',
        whyItMatters: '¿Por qué importa?',
        whatNext: '¿Qué veremos a continuación?',
    },

    // ── Separación del Agent: el texto de la tarjeta y la demo en vivo (AgentLoop) ──
    agent: {
        // Card copy, switches with the Chat/Agent toggle. "Agent" stays in English.
        card: {
            chat: {
                eyebrow: 'Recorrido básico',
                title: 'El Chat es entrada, modelo y una respuesta',
                body: 'En modo Chat el modelo recibe la solicitud y devuelve un solo texto. No hay herramientas ni acción en el mundo - solo entrada, modelo y respuesta.',
                closing: 'El Chat se detiene en el momento en que la respuesta está lista. No ejecuta herramientas ni cambia nada fuera de la conversación.',
                note: 'Esta es exactamente la capa del Transformer: entra texto, sale texto.',
            },
            agent: {
                eyebrow: 'Una capa adicional',
                title: 'Un Agent no es una respuesta más inteligente. Es un ciclo de acción completo',
                body: 'Hasta ahora vimos un modelo que recibe entrada y devuelve una respuesta. Un Agent añade una capa nueva: interpreta la tarea, elige un curso de acción, ejecuta una herramienta si hace falta y revisa qué hacer a continuación.',
                closing: 'Un Agent no solo predice texto. Envuelve al modelo en un sistema que decide si actuar, qué herramienta usar y qué está permitido.',
                note: 'Esta no es una capa interna del Transformer, sino un sistema alrededor del modelo.',
            },
        },
        // The live demo. Mode labels (Chat/Agent/LLM) stay as product terms. Loop stages by id.
        demo: {
            layerLabel: 'Capa del Agent · un sistema alrededor del modelo',
            modeChat: 'Chat',
            modeAgent: 'Agent',
            coreLabel: 'LLM',
            coreText: 'El modelo genera texto y propuestas de acción',
            idleCore: 'Listo',
            run: 'Ejecutar un ciclo',
            running: 'Ejecutando...',
            replay: 'Ejecutar de nuevo',
            hintPrompt: 'Pasa el cursor o elige una estación para ver qué ocurre allí, o ejecuta un ciclo.',
            input: { label: 'Solicitud', text: 'Resume el correo y envía una respuesta' },
            output: { label: 'Respuesta', agent: 'Resumen listo, esperando aprobación para enviar', chat: 'Aquí está el resumen que pediste' },
            consoleTitle: 'Consola de decisión',
            consoleLabels: { intent: 'Intención', tool: 'Herramienta', risk: 'Riesgo', next: 'Siguiente paso' },
            consoleEmpty: 'Esperando',
            chatHint: 'Recorrido corto: entrada, modelo, respuesta.',
            agentHint: 'Ciclo completo: interpretar, elegir, riesgo, actuar.',
            agentStages: {
                task: { label: 'Entiende la tarea', hint: '¿Cuál es el objetivo real de la solicitud?', intent: 'Resumir y enviar una respuesta' },
                tool: { label: 'Elige una herramienta', hint: '¿Qué herramienta puede ayudar con la tarea?', tool: 'Lector de correo' },
                risk: { label: 'Revisa el riesgo', hint: '¿La acción es sensible o necesita aprobación?', risk: 'Medio: enviar fuera del sistema' },
                act: { label: 'Ejecuta la acción', hint: 'Ejecuta la herramienta y obtiene un resultado (Observation).', next: 'Ejecutando la herramienta' },
                answer: { label: 'Devuelve una respuesta', hint: 'Resume, y a veces pide aprobación antes de enviar.', next: 'Esperando aprobación' },
            },
            chatStages: {
                in: { label: 'Entrada', hint: 'Tu solicitud entra.' },
                model: { label: 'Modelo', hint: 'El modelo genera una respuesta de texto.' },
                out: { label: 'Respuesta', hint: 'Un solo texto vuelve a ti, sin acción en el mundo.' },
            },
        },
    },

    // ── Estructura del curso: 19 capítulos, 6 sistemas (CourseSystems) ──
    systems: {
        heading: {
            eyebrow: 'El camino que sigue',
            title: '19 capítulos que abren el motor, paso a paso',
            summary: '19 capítulos, 6 sistemas, un motor que se abre de forma gradual',
            subtitle: 'Esto no es un catálogo de capítulos. Es un recorrido: cada acto abre una parte distinta del motor, hasta que la imagen se conecta.',
        },
        labels: {
            purpose: '¿Qué vas a descubrir?',
            stations: 'Estaciones relacionadas en el mapa',
            chapters: '¿A qué capítulos lleva esto?',
            open: 'Abre la puerta',
            startHere: 'Empieza aquí',
        },
        // The six systems, by id. Chapter numbers (n) and display order stay in the view layer,
        // and chapter names (chapters) are a list of labels in the system's fixed order.
        items: {
            outside: {
                title: 'La vista desde fuera: chat transparente y entrada',
                range: 'Capítulos 1-2',
                teaser: 'Detrás de "solicitud y respuesta" se esconde un recorrido completo. Aquí empiezas a verlo.',
                purpose: 'Romper la ilusión de que el chat es solo solicitud y respuesta, y ver qué entra realmente en el modelo.',
                stationChips: ['Entra la solicitud', 'Ventana de contexto'],
                chapters: ['El chat transparente: el camino detrás de la respuesta', 'Model Input: qué entra realmente en el modelo'],
            },
            representations: {
                title: 'Del texto a tokens y representaciones',
                range: 'Capítulos 3-7',
                teaser: '¿Cómo se convierte el texto en algo sobre lo que se puede calcular, y en significado? Aquí ocurre.',
                purpose: 'Entender cómo el texto se convierte en tokens, representaciones numéricas, significado y el contexto con el que trabaja el modelo.',
                stationChips: ['División en tokens', 'Embedding', 'Attention'],
                chapters: ['Tokenization: cuando el texto se divide en tokens', 'Embeddings: de un número sin significado al significado', 'Semantic Space: el mapa de significado del modelo', 'Attention: qué importa ahora', 'Context Window: qué ve realmente el modelo ahora'],
            },
            generation: {
                title: 'Cómo se construye una respuesta',
                range: 'Capítulos 8-10',
                teaser: 'Una vez que hay una representación, ¿cómo se elige cada palabra de la respuesta? Aquí ocurre.',
                purpose: 'Entender cómo las puntuaciones se convierten en probabilidades, cómo se elige el siguiente token y cómo se construye una respuesta completa en un bucle.',
                stationChips: ['Logits', 'Softmax', 'Decoding', 'Un bucle hasta la respuesta'],
                chapters: ['Logits & Softmax: de puntuaciones a probabilidades', 'Decoding: elegir el siguiente token', 'Generation Loop: cómo se construye una respuesta hasta el final'],
            },
            reliability: {
                title: 'Fiabilidad, fuentes y verificación',
                range: 'Capítulos 11-13',
                teaser: '¿Por qué una respuesta puede sonar segura y aun así estar equivocada, y qué ayuda a fundamentarla?',
                purpose: 'Entender por qué la seguridad no es exactitud, cuándo hace falta una fuente externa y cómo una autoverificación mejora una respuesta.',
                stationChips: ['Una respuesta fundamentada', 'RAG', 'Autoverificación'],
                chapters: ['Hallucinations: por qué una respuesta segura puede estar equivocada', 'RAG & Grounding: cómo conectar la AI a fuentes', 'Self-Check: verificación propia mientras responde'],
            },
            learning: {
                title: 'Cómo aprende y mejora un modelo',
                range: 'Capítulos 14-16',
                teaser: '¿Cómo mejora un modelo a partir de un error, y qué recuerda realmente de ti?',
                purpose: 'Entender cómo un modelo aprende de un error, la diferencia entre memorizar y comprender, y qué cambia realmente cuando lo corriges.',
                stationChips: ['Aprender de un error', 'Memorizar frente a generalizar'],
                chapters: ['Learning from Mistakes: cómo mejora un modelo a partir de un error', 'Evaluation & Generalization: memorizar o comprender', 'Does AI Learn From Me: ¿aprende la AI de mí?'],
            },
            agent: {
                title: 'Del Chat al Agent',
                range: 'Capítulos 17-19',
                teaser: '¿Qué ocurre cuando el modelo no solo responde, sino que también actúa?',
                purpose: 'Entender qué cambia cuando un sistema alrededor del modelo elige una herramienta, revisa el riesgo, pide aprobación o se detiene.',
                stationChips: ['Una capa alrededor del motor', 'Guardrails'],
                chapters: ['Chat to Agent: cuando una pregunta se vuelve tarea', 'Guardrails: riesgo, permisos, aprobación y detención', 'Full Trace: un prompt, todas las estaciones'],
            },
        },
    },

    // ── Llamado a la acción (el destino del enlace href queda en la capa de vista) ──
    cta: {
        eyebrow: 'Siguiente paso',
        title: 'Siguiente paso: el chat transparente',
        body: 'Escribe una solicitud simple y observa cómo el motor empieza a interpretar, puntuar y decidir.',
        button: 'Empieza el chat transparente',
    },

    // ── Control de lectura en voz alta (Web Speech API). Solo etiquetas, iniciado por el usuario. ──
    readAloud: {
        dock: 'Escucha guiada',
        play: 'Leer en voz alta',
        pause: 'Pausar',
        resume: 'Reanudar',
        stop: 'Detener',
        prev: 'Segmento anterior',
        next: 'Segmento siguiente',
        voice: 'Voz',
        browserDefault: 'Voz predeterminada del navegador',
        settings: 'Opciones de lectura',
        nowReading: 'Leyendo ahora',
        unsupported: 'La lectura en voz alta no está disponible en este navegador.',
        scope: 'Alcance',
        scopeShort: 'Breve',
        scopeRegular: 'Normal',
        scopeFull: 'Completo',
        speed: 'Velocidad',
    },

    // ── Líneas del mentor (microtexto decorativo; la pose vive en la capa de vista) ──
    mentor: {
        hero: 'Levantemos la tapa juntos',
        roadmap: 'El mapa del motor se está abriendo',
        cta: 'Aquí es donde empezamos',
    },

    // ── Subespacio: el mapa de las estaciones principales ──
    roadmap: introRoadmap,
};
