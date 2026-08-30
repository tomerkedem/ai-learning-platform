// i18n/locales/es/behind-ai/grounding.ts
//
// Cadenas en español (es, LTR) del capítulo RAG & Grounding (capítulo 12, "cómo la IA se
// conecta a fuentes") del curso "Behind the Scenes of AI". El hebreo es la fuente de la
// verdad y define el tipo (GroundingDict).
//
// Traducción de primera pasada, pendiente de revisión por un hablante nativo.
//
// Sin raya (U+2014) ni guion largo (U+2013), sin referencias a años.

import type { Locale } from '@/i18n/config';
import { groundingLab } from './groundingLab';
import { groundingQuiz } from './groundingQuiz';

export const grounding = {
    contentLocale: 'es' as Locale,

    hero: {
        badge: 'Behind the Scenes · 12 · RAG & Grounding',
        titleLead: 'Una respuesta mejor',
        titleHighlight: 'empieza con una fuente',
        lede: 'En el capítulo anterior vimos que una respuesta puede sonar segura y aun así estar equivocada. La forma de bajar ese riesgo es conectar la respuesta a una fuente: una tarjeta de estado, un documento o el resultado de una comprobación. En lugar de apoyarse solo en la continuación del lenguaje, el modelo se apoya en información que se le dio.',
        hook: '¿Qué le pasa a la respuesta cuando le añadimos al modelo datos reales de seguimiento?',
        chipTry: 'Muévete entre los estados de fuente',
        chipCompare: 'Compara una respuesta sin fuente y con una fuente',
    },

    mentor: {
        hero: 'Dale al modelo algo en qué apoyarse',
        labExplain: 'La misma pregunta, la fuente lo cambia todo',
        misconception: 'Una fuente no es magia',
        lock: 'Mantén la respuesta ligada a la fuente',
        practical: 'Pide una respuesta a partir de una fuente',
    },

    // F3 RESPOND (M9): la capa de respuesta humana del capitulo. El estado sigue
    // siendo independiente; aqui solo esta lo que dice el mentor despues, en ambos casos.
    mentorRespond: {
        guessCorrect:
            'Separaste apoyarse en una fuente de saber más. Esa distinción es fácil de pasar por alto, porque ambas mejoran la respuesta. Solo una la mantiene dentro de límites que puedes comprobar.',
        guessWrong:
            'La suposición aquí es razonable: si el modelo recibió información, algo cambió en él. Vale la pena releer las líneas de arriba y preguntar qué cambió exactamente, el contexto de esta conversación o el modelo en sí.',
        quizPass:
            'No preguntas solo si hay una fuente, sino qué dice esa fuente en realidad. Esa pregunta te sostendrá en el próximo capítulo, cuando empecemos a contrastar respuestas con la fuente que las respalda.',
        quizFail:
            'El punto aquí no es que una fuente ayude, sino hasta dónde ayuda. Vuelve al laboratorio, haz la misma pregunta con fuente y sin ella, y lee qué queda en la respuesta cuando la fuente no cubre ese dato.',
    },

    primer: {
        eyebrow: 'Una respuesta mejor empieza con una fuente clara',
        title: 'Antes del laboratorio: ¿qué es RAG y qué es Grounding?',
        subtitle: 'Fundamentar significa que la respuesta se apoya en información, no solo en la redacción',
        lead:
            'Antes de verlo en el laboratorio, entendamos la idea. En lugar de dejar que el modelo redacte una respuesta solo de memoria, le traemos una fuente: una tarjeta de estado, un documento o el resultado de una comprobación, y le pedimos que responda según lo que dice la fuente. Así la respuesta se mantiene ligada a información real.',
        points: [
            {
                title: 'Qué significa Grounding',
                body: 'Fundamentar significa que la respuesta está anclada a información que se aportó o se recuperó, no solo a lo que suena plausible. Es la misma idea que en el capítulo anterior llamamos una respuesta fundamentada: conectar la respuesta con una fuente. Si la fuente dice algo, la respuesta se apoya en ello. Si la fuente calla, la respuesta no inventa.',
            },
            {
                title: 'Qué significa RAG',
                body: 'RAG es, en resumen, tres pasos. Primero un sistema de recuperación, no el modelo en sí, busca en la colección de fuentes disponible y devuelve varios pasajes candidatos. Después se elige el relevante de entre los candidatos y se añade al contexto actual del modelo. Por último el modelo redacta una respuesta a partir de la pregunta y de la evidencia seleccionada. Recuperar, añadir, responder con fundamento. La búsqueda en la web es solo un método de recuperación posible, no un requisito.',
            },
            {
                title: 'Por qué esto importa después de las alucinaciones',
                body: 'Vimos que, cuando falta un hecho, el modelo puede rellenarlo con una continuación plausible. Una fuente le da algo concreto en qué apoyarse, así que queda menos espacio para adivinar. Fíjate en la distinción: una alucinación es cuando la respuesta misma inventa contenido sin respaldo, mientras que un fallo de recuperación es cuando el sistema no aportó la evidencia adecuada desde el principio. Una recuperación fallida aumenta el riesgo de alucinación, pero no son el mismo fallo.',
            },
            {
                title: 'Qué puede hacer una respuesta fundamentada en una fuente',
                body: 'Citar o resumir la información encontrada en la fuente, responder a partir de una tarjeta de estado o un documento, evitar inventar detalles que faltan, y decir con claridad cuándo la fuente no está completa.',
            },
            {
                title: 'Qué no hace por sí sola',
                body: 'No garantiza la verdad si la fuente misma está equivocada, no responde más allá de la fuente, no sustituye al juicio humano, y no comprueba un estado en vivo salvo que esté de verdad conectada al sistema.',
            },
            {
                title: 'La fuente recuperada no siempre es la correcta',
                body: 'La recuperación puede devolver varios pasajes candidatos, y el pasaje mejor clasificado no es necesariamente el correcto. A veces se recupera una fuente que existe pero se refiere a otro paquete o a un suceso que no viene al caso. Por eso hay que elegir la evidencia que de verdad encaja con la pregunta, y no dar por hecho que toda fuente recuperada encaja.',
            },
        ],
    },

    see: {
        title: 'Cómo entra una fuente en la respuesta, paso a paso',
        steps: ['Pregunta del usuario', 'Recuperar candidatos', 'Elegir el relevante', 'Añadir al contexto', 'Redactar desde la fuente', 'Responder con límites'],
        caption:
            'El sistema de recuperación, no el modelo en sí, puede devolver varios pasajes candidatos, y el sistema selecciona el relevante. El pasaje mejor clasificado no es necesariamente el correcto. La evidencia seleccionada entra en el contexto, y una buena respuesta se queda dentro de los límites de la fuente. Esta es una ilustración didáctica, no una recuperación real de un sistema.',
    },

    guess: {
        eyebrow: 'Adivina rápido · añadir una fuente',
        title: 'Le añadimos al modelo datos reales de seguimiento. ¿Qué cambia en la respuesta?',
        subtitle: 'Elige el modelo mental que te parezca más cercano. Aquí no hay nota, hay una dirección que describe lo que de verdad ocurre.',
        invite: 'Antes de abrir esto, intenta adivinar qué le hace una fuente a la respuesta del modelo.',
        correctTitle: '¡Exacto!',
        wrongTitle: '¡Casi!',
        getsRightLabel: 'Qué acierta',
        revealButton: 'Revela la idea principal',
        revealTitle: '¿Y qué ocurre en realidad?',
        revealCopy:
            'El modelo puede responder según la información que aportamos, pero solo dentro de lo que la fuente dice en realidad. Una fuente le da algo en qué apoyarse, así que la respuesta adivina menos. No vuelve al modelo omnisciente, y no garantiza que cada respuesta sea correcta.',
        cta: 'Veámoslo en el laboratorio',
        resetButton: 'Elegir de nuevo',
        exploreHint: 'También puedes elegir otra opción y ver cómo suena.',

        cards: {
            grounded: {
                title: 'El modelo puede responder según la información que aportamos',
                desc: 'Cuando hay una fuente en el contexto, la respuesta se apoya en ella en lugar de adivinar.',
                statusLabel: 'Elegiste bien',
                getsRight: 'Exacto. Una fuente le da al modelo algo en qué apoyarse, y la respuesta se mantiene ligada a lo que esta dice.',
                missesLabel: 'Qué queda por ver',
                misses: 'En el laboratorio veremos cómo la respuesta se queda dentro de los límites de la fuente, y no inventa lo que la fuente no dice.',
                bridge: 'Una respuesta se apoya en una fuente, no en una suposición.',
            },
            smarter: {
                title: 'El modelo se vuelve más inteligente de forma permanente',
                desc: 'Añadir una fuente enseña al modelo y lo mejora para cada pregunta futura.',
                statusLabel: 'Error común',
                getsRight: 'Es comprensible pensarlo, porque añadir información se siente como aprender.',
                missesLabel: 'Qué se pierde',
                misses: 'La fuente entra solo en el contexto de esta conversación. No reentrena el modelo y no se guarda para la siguiente pregunta.',
                bridge: 'Una fuente ayuda ahora, no de forma permanente.',
            },
            knowsAll: {
                title: 'El modelo ya conoce todos los sistemas postales',
                desc: 'El modelo ya tiene todos los estados, así que una fuente es innecesaria.',
                statusLabel: 'Otra capa',
                getsRight: 'Es cierto que el modelo ha visto mucho texto sobre envíos y correo.',
                missesLabel: 'Qué se pierde',
                misses: 'El conocimiento general sobre el correo no es el estado en vivo de un paquete concreto. Eso necesita una fuente o un sistema real, no la memoria del entrenamiento.',
                bridge: 'El conocimiento general no es un estado actual.',
            },
            autoTrue: {
                title: 'Si hay una fuente, cada respuesta es automáticamente correcta',
                desc: 'Una vez que hay una fuente, puedes confiar en la respuesta sin comprobar.',
                statusLabel: 'Parcialmente cierto',
                getsRight: 'Es cierto que una fuente reduce las suposiciones y refuerza la respuesta.',
                missesLabel: 'Qué se pierde',
                misses: 'Pero si la fuente misma está equivocada o desactualizada, incluso una respuesta fundamentada estará equivocada. Una fuente reduce el riesgo, no es magia.',
                bridge: 'Una fuente ayuda, pero también hay que comprobarla.',
            },
        },
    },

    insight: {
        title: 'Lo clave que hay que entender aquí',
        lead: 'La fuente no convierte al modelo en un mago.',
        body: 'Simplemente le da algo en qué apoyarse. Si la fuente dice poco, la respuesta también debería decir poco. Si la fuente no da una fecha de entrega, la respuesta no debería inventar una.',
    },

    analogy: {
        title: 'Un momento de la vida real',
        body: 'Un buen agente de atención no se inventa dónde está tu paquete. Abre la pantalla de seguimiento, lee lo que hay, y te dice exactamente eso. Si la pantalla no tiene una fecha de entrega, no la inventará. Una fuente funciona para el modelo igual que esa pantalla funciona para el agente.',
    },

    misconception: {
        wrongLabel: 'Error común',
        wrongQuote: '"Si conecté una fuente, cada respuesta que salga será correcta."',
        rightLabel: 'Cómo funciona en realidad',
        rightBody: 'Una fuente reduce las suposiciones y le da a la respuesta algo en qué apoyarse, pero no se comprueba a sí misma. La mera presencia de una fuente no basta: la fuente tiene que respaldar exactamente la afirmación de la respuesta, y a veces solo respalda una parte. Si la fuente misma está equivocada, desactualizada o es irrelevante, incluso una respuesta fundamentada estará equivocada. El fundamento refuerza la respuesta, no garantiza la verdad.',
    },

    lock: {
        title: 'Comprueba tu comprensión',
        question: 'La fuente dice: estado retrasado, entrega estimada no disponible. ¿Qué respuesta está mejor fundamentada en la fuente?',
        options: [
            'El paquete llegará mañana.',
            'El paquete está retrasado, y no hay una fecha de entrega confirmada en la fuente aportada.',
            'El paquete está perdido.',
            'El paquete ya se ha entregado.',
        ],
        success:
            'Una respuesta fundamentada usa lo que dice la fuente, y también señala lo que la fuente no dice. La fuente dice retrasado y no da una fecha, así que la respuesta dice exactamente eso sin inventar una fecha.',
    },

    practical: {
        title: 'Idea práctica',
        lead:
            'Cuando la exactitud importa, no pidas solo una respuesta. Pide una respuesta a partir de una fuente, y pide al modelo que muestre los límites de esa fuente. En lugar de "dime dónde está el paquete", apunta así:',
        uses: [
            'Fundaméntala en una fuente: "Basándote solo en los siguientes datos de seguimiento, redacta una respuesta para el cliente."',
            'Pide que señale los vacíos: "Si no hay una fecha de entrega confirmada, dilo de forma explícita y no inventes una fecha."',
            'Separa lo conocido de lo desconocido: "Escribe qué se sabe a partir de la fuente, qué no se sabe, y qué hay que comprobar ahora."',
            'No vayas más allá de la fuente: "No añadas información que no aparezca en los datos aportados."',
            'Recuerda que la fuente también se comprueba: para un estado real, asegúrate de que la fuente misma esté actualizada y sea fiable.',
        ],
        caveat:
            'Este es un capítulo que presenta la idea, no una guía completa de ingeniería de RAG. El mensaje simple: recuperar, añadir al contexto y responder con fundamento, siendo honestos sobre lo que la fuente no dice. Y recuerda que una referencia a una fuente solo sirve si apunta a una fuente real que de verdad respalda la afirmación; no toda mención es prueba por sí sola.',
    },

    lab: groundingLab,
    quiz: groundingQuiz,
};
