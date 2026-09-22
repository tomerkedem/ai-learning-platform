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
        prompt: 'Voy a tener amigos a cenar. ¿Qué podría preparar?',
        inputPlaceholder: 'Escribe un mensaje...',
        answerRole: 'La respuesta',
        answer: 'Podrías hacer pasta con una ensalada sencilla. Si me dices qué les gusta, puedo sugerirte un menú más concreto.',
        outsideLine: 'Desde fuera parece que son dos pasos: escribiste una solicitud y recibiste una respuesta.',
        curiosityLine: 'Pero la verdadera pregunta es qué ocurrió en el medio.',
        gateLead: 'Ahora abrimos la caja y vemos el recorrido por dentro.',
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
        question: 'Volvamos a nuestro chat. ¿Qué crees que hace el LLM entre la solicitud y la respuesta?',
        hint: 'Elige la explicación que te parezca más cercana a la realidad. Aquí no hay puntuación, solo la elección de un modelo mental.',
        correctTitle: 'La explicación más cercana',
        correctLead: 'Es el mapa de aprendizaje más cercano, aunque sigue siendo una simplificación.',
        correctBody: 'El modelo trabaja con tokens y representaciones numéricas, calcula el contexto y luego elige o muestrea el siguiente token según la distribución y las reglas de decodificación.',
        correctBridge: '',
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
        subtitle: 'Un mapa de aprendizaje de un modelo de lenguaje autorregresivo, desde la entrada preparada hasta la respuesta generada. No necesitas recordar las 14 estaciones ahora. Es el mapa del viaje que haremos juntos, paso a paso.',
        hint: 'Haz clic en una estación para mirar dentro: una explicación breve y un ejemplo.',
    },

    // ── La nota de honestidad bajo el mapa ──
    truthNote:
        'Este es un mapa simplificado de un modelo de lenguaje autorregresivo, no un registro completo ni una arquitectura universal. La recuperación, la memoria, las herramientas, la autoverificación y los guardrails son capacidades opcionales del sistema.',


    // ── Separación del Agent: el texto de la tarjeta y la demo en vivo (AgentLoop) ──
    agent: {
        // Forward-looking framing (the card now appears before the map) + transition to the map.
        intro: 'Un vistazo al futuro: ¿qué cambia cuando un Chat que responde se convierte en un Agent que puede actuar?',
        // Card copy, switches with the Chat/Agent toggle. narration = the spoken story of the mode.
        card: {
            chat: {
                eyebrow: 'Recorrido básico',
                title: 'Chat: sugiere opciones, sin comprobar ni reservar',
                body: 'La solicitud llega al modelo, que devuelve texto. No ve qué hay libre esta noche.',
                closing: 'Chat puede ayudarte a pensar la cena, pero la mesa aún no está reservada.',
                narration: 'La misma solicitud a Chat: encuéntrame un sitio para cenar esta noche para dos. Chat puede sugerir opciones, pero no comprobar la disponibilidad en vivo ni reservar una mesa.',
            },
            agent: {
                eyebrow: 'La misma solicitud',
                title: 'La misma solicitud. Esta vez el sistema puede avanzar con ella.',
                body: 'Comprueba con herramientas qué hay libre y se detiene a pedir tu aprobación antes de reservar.',
                closing: 'La mesa se reservó solo después de tu aprobación.',
                narration: 'La misma solicitud, pero esta vez el sistema puede avanzar con ella. Entiende el objetivo, usa herramientas para buscar y comprobar la disponibilidad, y encuentra una mesa libre para dos a las 19:30. Antes de reservar, pide tu aprobación para esa reserva concreta. Solo después de tu aprobación reserva la mesa y devuelve una confirmación.',
            },
        },
        // The live demo. Mode labels (Chat/Agent/LLM) stay as product terms. Loop stages by id.
        demo: {
            modeChat: 'Chat',
            modeAgent: 'Agent',
            coreLabel: 'LLM',
            idleCore: 'Listo',
            run: 'Ejecutar un ciclo',
            running: 'Ejecutando...',
            replay: 'Ejecutar de nuevo',
            hintPrompt: 'Ejecuta un ciclo para ver el motor en acción, paso a paso.',
            input: { label: 'Solicitud', text: 'Encuéntrame un sitio para cenar esta noche para dos, revisa la disponibilidad y resérvalo solo cuando yo lo apruebe' },
            output: { label: 'Respuesta', agent: 'Mesa para 2 reservada a las 19:30, tras la aprobación', chat: 'Puedo sugerir opciones, pero no comprobar la disponibilidad en vivo ni reservar una mesa.' },
            agentStages: {
                in: { label: 'Entrada', hint: 'Tu solicitud entra en el sistema, y aquí empieza la ronda.' },
                task: { label: 'Entiende el objetivo', hint: 'Cena esta noche para dos, y reservar solo con aprobación.', intent: 'Cena para dos, esta noche' },
                tool: { label: 'Usa herramientas', hint: 'Búsqueda y disponibilidad: información en vivo que el modelo solo no ve.', tool: 'Búsqueda + Disponibilidad' },
                act: { label: 'Recibe un resultado', hint: 'Hay una mesa libre. Todo está listo para reservar, pero todavía no se ha reservado nada.', next: 'Libre esta noche a las 19:30' },
                risk: { label: 'Pide aprobación', hint: 'La acción externa espera hasta que la apruebes.', risk: '¿Reservar mesa para 2 a las 19:30?' },
                answer: { label: 'Hace la reserva', hint: 'Solo tras la aprobación, la herramienta de reserva guarda la mesa y devuelve una confirmación.', next: 'Mesa reservada a las 19:30' },
            },
            chatStages: {
                in: { label: 'Entrada', hint: 'Tu solicitud entra.' },
                model: { label: 'Modelo', hint: 'El modelo genera una respuesta de texto.' },
                out: { label: 'Respuesta', hint: 'Un solo texto vuelve a ti, sin comprobación en vivo y sin acción en el mundo.' },
            },
        },
    },

    // ── Llamado a la acción (el destino del enlace href queda en la capa de vista) ──
    scopeSentence: 'Durante el curso seguiremos el camino desde la solicitud y la generación de la respuesta hasta la fiabilidad, la mejora y la acción controlada con herramientas.',

    cta: {
        eyebrow: 'Siguiente paso',
        title: 'Ahora empezamos por el primer paso',
        body: 'Ya viste la imagen general. En el capítulo 1 abriremos juntos el chat transparente.',
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

    // ── El mapa de la IA: el recorrido automático antes de abrir el motor. beats[i] es el momento conceptual i (subtítulos y lectura en voz alta) ──
    landscape: {
        intro: [
            'IA es un nombre amplio para todo un mundo de tecnologías y enfoques, no una sola cosa.',
            'Dentro de ese mundo encontrarás términos como Machine Learning, Neural Networks, Deep Learning, Generative AI y LLM.',
            'Antes de abrir el LLM y ver cómo funciona, pondremos un poco de orden y veremos cómo se conectan estos términos.',
        ],
        readAloud: 'Leer en voz alta',
        eyebrow: 'Antes de abrir el motor: ¿dónde encaja el LLM?',
        regionLabel: 'Un mapa breve del mundo de la IA',
        progressLabel: 'Progreso en el mapa de la IA',
        navLabel: 'Navegación por el recorrido de la IA',
        pauseLabel: 'Pausar la presentación automática',
        resumeLabel: 'Reanudar la presentación automática',
        paused: 'En pausa',
        next: 'Siguiente en {time}',
        seconds: {
            zero: '{n} segundos', one: '1 segundo', two: '{n} segundos',
            few: '{n} segundos', many: '{n} segundos', other: '{n} segundos',
        },
        waitingNarration: 'Esperando el final de la lectura',
        nodes: ['IA', 'Aprendizaje automático', 'Redes neuronales', 'Aprendizaje profundo', 'IA generativa', 'LLM', 'Agent', 'Fin'],
        beats: [
            { t: 'Inteligencia artificial (IA)', b: 'El campo amplio: sistemas que realizan tareas que nos parecen inteligentes.' },
            { t: 'Aprendizaje automático (Machine Learning)', b: 'Solo un enfoque entre varios: el sistema aprende patrones a partir de ejemplos.' },
            { t: 'Redes neuronales (Neural Networks)', b: 'Una familia de modelos de aprendizaje automático que aprenden patrones a través de capas de cálculo.' },
            { t: 'Aprendizaje profundo (Deep Learning)', b: 'Es la misma red neuronal, pero con muchas capas. No es una etapa posterior.' },
            { t: 'Ahora, otra pregunta: ¿qué hace el sistema?', b: 'Algunos sistemas reconocen o predicen, y otros crean.' },
            { t: 'IA generativa (Generative AI)', b: 'Sistemas diseñados para crear contenido nuevo: texto, imágenes, audio y más. No es un nivel por encima del aprendizaje profundo.' },
            { t: '¿Qué camino es la experiencia del chat?', b: 'Puedes tocar cada camino y comprobar qué tipo de contenido crea nuestro chat.' },
            { t: 'LLM - Large Language Model (modelo de lenguaje grande)', b: 'Una red neuronal que aprendió patrones del lenguaje y puede trabajar con contexto y generar texto. Es el tipo de modelo que está en el corazón de nuestro chat.' },
            { t: 'Un Agent no es un LLM más grande.', b: 'Un Agent es un sistema construido alrededor de un modelo: trabaja hacia un objetivo y, a veces, usa herramientas y sus resultados.' },
            { t: 'Ahora sabemos dónde encaja el LLM.', b: 'Antes de abrirlo, ¿qué crees que ocurre dentro?' },
        ],
        agentNote: 'Agentic AI es un término amplio para sistemas de IA que actúan para lograr objetivos con cierto grado de autonomía, y no todos lo definen exactamente igual.',
        textFocus: { t: 'Nuestro chat crea texto', b: 'Por eso seguimos por el camino del texto, y desde allí llegamos al LLM.' },
        hintImage: 'Aquí se crean imágenes. En el chat recibes palabras.',
        hintAudio: 'Aquí se crea audio. En el chat recibes palabras.',
        tileText: 'Texto',
        tileImage: 'Imagen',
        tileAudio: 'Audio',
        llmSub: 'Modelo de lenguaje',
        manyLayers: 'Muchas capas',
        recognize: 'Reconoce o predice',
        create: 'Crea',
        cat: 'Gato',
        goal: 'Objetivo',
        tools: 'Herramientas',
        results: 'Resultados',
        openLlm: 'Una predicción rápida',
        replay: 'Ver de nuevo desde el principio',
    },

    // ── Subespacio: el mapa de las estaciones principales ──
    roadmap: introRoadmap,
};
