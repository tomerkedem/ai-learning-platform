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

    // La capa de respuesta humana de la tarjeta de veredicto. El estado (la marca o la
    // bombilla, el titulo, la explicacion) sigue siendo una capa independiente; aqui solo
    // esta lo que se dice despues, con la misma forma en ambos resultados. Especifico de
    // la introduccion a proposito.
    mentorRespond: {
        guessCorrect:
            'Lo que te trajo hasta aquí es la idea de que la respuesta se construye en lugar de encontrarse. Esa idea no es evidente, porque desde fuera la respuesta llega entera y pulida, sin ninguna señal del proceso que la precedió.',
        guessWrong:
            'Esta suposición no nació de la confusión. Las cuatro opciones suenan razonables desde fuera, porque desde fuera solo se ven una solicitud y una respuesta. Lo que ayuda ahora no es buscar la explicación correcta, sino preguntarse qué le ocurre al texto mismo entre una y otra.',
    },

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
        answer: 'Lamento lo ocurrido. Conviene revisar el estado del envío para ver si hay alguna actualización del centro logístico.',
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
        hint: 'Elige la explicación que te parezca más cercana a la realidad. Aquí no hay puntuación, solo la elección de un modelo mental.',
        correctTitle: 'La explicación más cercana',
        correctLead: 'Es el mapa de aprendizaje más cercano, aunque sigue siendo una simplificación.',
        correctBody: 'El modelo trabaja con tokens y representaciones numéricas, calcula el contexto y luego elige o muestrea el siguiente token según la distribución y las reglas de decodificación.',
        correctBridge: 'Eso es exactamente lo que vamos a abrir ahora, en el mapa de estaciones que está justo abajo.',
        wrongLead: 'Es un error de razonamiento común, pero no es lo que ocurre en realidad.',
        retry: 'Elegir de nuevo',
        revealCorrect: 'Mostrar la explicación precisa',

        /** Text of the four hypotheses, by id. Structure (cue, correct) lives in the view layer. */
        hypotheses: {
            read: {
                title: 'Lectura directa',
                concept: 'El modelo lee la frase como una persona y arma una respuesta.',
                status: 'Metáfora tentadora, pero incompleta',
                whyTempting: 'Así leemos nosotros, por eso es natural suponer que el modelo también lo hace.',
                whyWrong: 'El modelo no lee letras ni palabras como una persona. Trabaja con tokens y con números.',
            },
            rail: {
                title: 'Un recorrido fijo',
                concept: 'El modelo siempre pasa por el mismo número fijo de pasos, como una línea de montaje.',
                status: 'Parcialmente correcto',
                whyTempting: 'Resulta cómodo pensar en el modelo como una línea de montaje ordenada con un número de pasos conocido.',
                whyWrong: 'La arquitectura tiene una estructura de cálculo repetida, pero el contenido generado y el flujo del producto no son una ruta fija escrita de antemano.',
            },
            tokens: {
                title: 'Un motor de tokens',
                concept: 'El modelo divide el texto en tokens, calcula el contexto y genera una respuesta token tras token.',
                status: 'La explicación más cercana',
                whyTempting: 'Capta la idea central: la respuesta se genera de forma progresiva a partir de tokens y contexto.',
            },
            archive: {
                title: 'Búsqueda en un repositorio',
                concept: 'El modelo extrae una respuesta ya hecha de un repositorio.',
                status: 'Incorrecto para explicar el modelo base',
                whyTempting: 'Las respuestas suenan terminadas y pulidas, como si se hubieran extraído de un repositorio.',
                whyWrong: 'El modelo base normalmente no recupera una respuesta completa ya preparada. La genera de forma progresiva, aunque un producto puede añadir recuperación externa.',
            },
        },
    },

    // ── Título del mapa de estaciones y la pista de apertura ──
    roadmapHeading: {
        eyebrow: '14 estaciones dentro de la generación de una respuesta',
        title: 'Un mapa de las estaciones principales en el camino del texto a la respuesta',
        subtitle: 'Un mapa de aprendizaje de un modelo de lenguaje autorregresivo, desde la entrada preparada hasta la respuesta generada.',
        hint: 'Haz clic en una estación para mirar dentro: una explicación breve y un ejemplo.',
    },

    // ── La nota de honestidad bajo el mapa ──
    truthNote:
        'Este es un mapa simplificado de un modelo de lenguaje autorregresivo, no un registro completo ni una arquitectura universal. La recuperación, la memoria, las herramientas, la autoverificación y los guardrails son capacidades opcionales del sistema.',


    // ── Separación del Agent: el texto de la tarjeta y la demo en vivo (AgentLoop) ──
    agent: {
        // Forward-looking framing (the card now appears before the map) + transition to the map.
        intro: 'Un vistazo al futuro: ¿qué cambia cuando un Chat que responde se convierte en un Agent que puede actuar?',
        // Card copy, switches with the Chat/Agent toggle. "Agent" stays in English.
        card: {
            chat: {
                eyebrow: 'Recorrido básico',
                title: 'Ruta básica de Chat: solicitud, modelo y respuesta',
                body: 'En este ejemplo simplificado, la solicitud pasa al modelo y este devuelve una respuesta sin ejecutar una acción externa.',
                closing: 'Algunos productos de Chat añaden recuperación, memoria, herramientas, filtros u orquestación alrededor del modelo.',
                note: 'Es una ruta simplificada, no una definición de todo producto Chat.',
            },
            agent: {
                eyebrow: 'Una capa adicional',
                title: 'Un Agent no es una respuesta más inteligente. Es un ciclo de acción completo',
                body: 'En modo Agent el modelo no solo responde. Puede decidir, elegir una herramienta, ejecutar una acción, verificar el resultado y luego devolver una respuesta.',
                closing: 'Un Agent no solo predice texto. Envuelve al modelo en un sistema que decide si actuar, qué herramienta usar y qué está permitido.',
                note: 'Esta no es una capa interna del Transformer, sino un sistema alrededor del modelo.',
            },
        },
        // The live demo. Mode labels (Chat/Agent/LLM) stay as product terms. Loop stages by id.
        demo: {
            layerLabel: 'Capa del Agent · un sistema alrededor del modelo',
            layerLabelChat: 'Ruta básica · entrada, modelo, respuesta',
            modeChat: 'Chat',
            modeAgent: 'Agent',
            coreLabel: 'LLM',
            coreText: 'El modelo genera texto y propuestas de acción',
            idleCore: 'Listo',
            run: 'Ejecutar un ciclo',
            running: 'Ejecutando...',
            replay: 'Ejecutar de nuevo',
            hintPrompt: 'Ejecuta un ciclo para ver el motor en acción, paso a paso.',
            input: { label: 'Solicitud', text: 'Resume el correo que pegué y envía una respuesta' },
            output: { label: 'Respuesta', agent: 'Resumen listo, esperando aprobación para enviar', chat: 'Aquí está el resumen. No puedo enviarlo por ti.' },
            consoleTitle: 'Consola de decisión',
            consoleLabels: { intent: 'Intención', tool: 'Herramienta', risk: 'Riesgo', next: 'Siguiente paso' },
            consoleEmpty: 'Esperando',
            chatHint: 'Recorrido corto: entrada, modelo, respuesta.',
            agentHint: 'Ciclo completo: interpretar, elegir, riesgo, actuar.',
            agentStages: {
                in: { label: 'Entrada', hint: 'Tu solicitud entra en el sistema, y aquí empieza la ronda.' },
                task: { label: 'Entiende la tarea', hint: '¿Cuál es el objetivo real de la solicitud?', intent: 'Resumir y enviar una respuesta' },
                tool: { label: 'Elige una herramienta', hint: '¿Qué herramienta puede ayudar con la tarea?', tool: 'Lector de correo' },
                risk: { label: 'Pide aprobación', hint: 'Una acción externa se pausa para pedir aprobación cuando hace falta.' },
                act: { label: 'Ejecuta la acción', hint: 'Ejecuta la herramienta y obtiene un resultado.', next: 'Ejecutando la herramienta' },
                answer: { label: 'Devuelve una respuesta', hint: 'Resume, y a veces pide aprobación antes de enviar.', next: 'Esperando aprobación' },
            },
            chatStages: {
                in: { label: 'Entrada', hint: 'Tu solicitud entra.' },
                model: { label: 'Modelo', hint: 'El modelo genera una respuesta de texto.' },
                out: { label: 'Respuesta', hint: 'Un solo texto vuelve a ti, sin acción en el mundo.' },
            },
        },
    },

    // ── Llamado a la acción (el destino del enlace href queda en la capa de vista) ──
    scopeSentence: 'Durante el curso seguiremos el camino desde la solicitud y la generación de la respuesta hasta la fiabilidad, la mejora y la acción controlada con herramientas.',

    cta: {
        eyebrow: 'Siguiente paso',
        title: 'Ahora empezamos por el primer paso',
        body: 'Ya viste la imagen general. Todavía no necesitas recordar todas las estaciones. En el capítulo 1 abriremos juntos el chat transparente.',
        button: 'Empezar el capítulo 1',
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
        sections: 'Secciones',
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
