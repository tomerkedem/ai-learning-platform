// i18n/locales/es/behind-ai/hallucinations.ts
// Capítulo 11 en español ("Hallucinations: por qué una respuesta segura puede estar
// equivocada"). Fuente de forma: ../../he/behind-ai/hallucinations. contentLocale = 'es'
// (traducción real). "AI" se conserva como término de producto; las etiquetas de marca
// (badge, Hallucination Lab, RAG, Grounding) se mantienen en inglés a propósito.
//
// Traducción de primera pasada, pendiente de revisión por un hablante nativo.
// Sin raya (U+2014) ni guion largo (U+2013), sin referencias a años.

import type { Locale } from '@/i18n/config';
import { hallucinationsLab } from './hallucinationsLab';
import { hallucinationsQuiz } from './hallucinationsQuiz';

export const hallucinations = {
    contentLocale: 'es' as Locale,

    hero: {
        badge: 'Behind the Scenes · 11 · Hallucinations',
        titleLead: 'Una respuesta segura',
        titleHighlight: 'puede estar equivocada',
        lede: 'Vimos al modelo construir una respuesta fluida paso a paso. Pero la fluidez no es comprobar los hechos. El modelo puede redactar una respuesta plausible y convincente aunque no tenga la información real, y simplemente rellena el vacío con un texto que suena correcto.',
        hook: 'Si la respuesta suena segura, ordenada y servicial, ¿cómo sabemos si de verdad se comprobó?',
        chipTry: 'Elige un estilo de respuesta',
        chipCompare: 'Compara segura frente a prudente',
    },

    mentor: {
        hero: 'La fluidez no es comprobar',
        labExplain: 'Misma pregunta, distinto riesgo',
        misconception: 'El problema no es la redacción',
        lock: 'Sin fuente, no está fundamentada',
        practical: 'Sabe cuándo verificar',
    },

    primer: {
        eyebrow: 'La fluidez del lenguaje no es comprobar los hechos',
        title: 'Antes del laboratorio: ¿por qué una respuesta segura puede estar equivocada?',
        subtitle: 'Una alucinación es una respuesta convincente que no se fundamentó en los hechos necesarios',
        lead:
            'Antes de verlo en el laboratorio, entendamos qué ocurre aquí. El modelo continúa un patrón de lenguaje. Cuando el hecho necesario está en el contexto, puede apoyarse en él. Cuando falta y no hay acceso a una fuente, el modelo aún puede producir una continuación que suena correcta, en lugar de decir que no lo sabe. A eso lo llamamos aquí una alucinación.',
        points: [
            {
                title: 'Qué es una alucinación aquí',
                body: 'Una alucinación es una respuesta segura o plausible que no está fundamentada en los hechos necesarios. El modelo no miente a propósito, continúa un patrón de lenguaje. Cuando falta el hecho, puede producir una continuación que suena correcta en lugar de decir que no lo sabe.',
            },
            {
                title: 'Por qué ocurre',
                body: 'El modelo continúa los patrones del prompt y del contexto. Si el dato necesario no está ahí y no hay acceso a una fuente, la continuación más plausible se escribe igual, aunque nadie la haya verificado.',
            },
            {
                title: 'Por qué la confianza engaña',
                body: 'Una frase pulida y segura puede venir de la fluidez del lenguaje, no de comprobar los hechos. La redacción mide cuánto encaja la continuación con el lenguaje, no cuán verdadera es en el mundo.',
            },
            {
                title: 'Qué aumenta el riesgo',
                body: 'Información faltante, un prompt vago, pedir una respuesta precisa sin una fuente, la presión por responder en lugar de decir "no lo sé", y la falta de conexión con un seguimiento o una base de datos en vivo. Todo eso empuja al modelo a rellenar detalles.',
            },
            {
                title: 'Qué reduce el riesgo',
                body: 'Aportar datos de fuente, pedir que separe el hecho de la suposición, pedir que diga qué falta, redactar con cuidado, y conectar a una herramienta o fuente cuando el estado real importa.',
            },
            {
                title: 'El límite de este capítulo',
                body: 'Aquí solo identificamos el problema y la necesidad de verificar. Cómo conectar la IA a fuentes de verdad, lo que se llama Grounding o RAG, es el siguiente paso. El mensaje no es "nunca confíes", sino "sabe cuándo verificar".',
            },
        ],
    },

    see: {
        title: 'Cómo una respuesta fluida puede quedar sin fundamento, paso a paso',
        steps: ['El prompt', 'Continuación fluida', 'Hecho que falta', 'Ilusión de confianza', 'Hace falta verificar'],
        caption:
            'La respuesta puede ser fluida porque el texto es plausible, no porque el hecho se comprobó. Cuando falta un hecho, el modelo puede rellenarlo con una continuación que suena correcta, y así se crea una ilusión de confianza. Esta es una ilustración didáctica, no una traza real de un modelo.',
    },

    guess: {
        eyebrow: 'Adivina rápido · una respuesta segura',
        title: 'Un cliente pregunta dónde está el paquete, y el modelo responde de inmediato "llega mañana". ¿Cuál es el problema?',
        subtitle: 'Elige el modelo mental que te parezca más cercano. Aquí no hay nota, hay una dirección que describe lo que de verdad ocurre.',
        invite: 'Antes de abrir esto, intenta adivinar por qué una respuesta que suena segura y servicial puede aun así estar equivocada.',
        correctTitle: '¡Exacto!',
        wrongTitle: '¡Casi!',
        getsRightLabel: 'Qué acierta',
        revealButton: 'Revela la idea principal',
        revealTitle: '¿Y qué ocurre en realidad?',
        revealCopy:
            'El modelo puede redactar una respuesta plausible y convincente sin conocer el estado real. Continúa un patrón de lenguaje, así que "llega mañana" puede ser solo una continuación plausible, no un dato comprobado en un sistema. La confianza en la redacción no es prueba de que el hecho se verificó.',
        cta: 'Veámoslo en el laboratorio',
        resetButton: 'Elegir de nuevo',
        exploreHint: 'También puedes elegir otra opción y ver cómo suena.',

        cards: {
            plausible: {
                title: 'El modelo puede redactar una respuesta plausible aun sin conocer el estado real',
                desc: 'Continúa un patrón de lenguaje, y así se construye una respuesta que suena correcta aunque no se haya comprobado nada.',
                statusLabel: 'Elegiste bien',
                getsRight: 'Exacto. La fluidez del lenguaje basta para producir una respuesta convincente. No exige que el hecho se compruebe.',
                missesLabel: 'Qué queda por ver',
                misses: 'En el laboratorio veremos cómo la misma pregunta recibe una respuesta que inventa una fecha, y cómo reconocer que esa seguridad no se apoya en nada.',
                bridge: 'La confianza en la redacción no es prueba de que la información sea correcta.',
            },
            confidentTrue: {
                title: 'Si la respuesta es segura, probablemente es correcta',
                desc: 'Cuanto más segura suena la respuesta, más fiable es.',
                statusLabel: 'Error común',
                getsRight: 'Es natural pensarlo, porque estamos acostumbrados a que una persona segura suele saber de qué habla.',
                missesLabel: 'Qué se pierde',
                misses: 'En un modelo, la confianza en la redacción viene de la fluidez del lenguaje, no de comprobar los hechos. Una respuesta segura puede ser solo una continuación plausible.',
                bridge: 'La confianza no es evidencia.',
            },
            dateChecked: {
                title: 'Si hay una fecha en la respuesta, el modelo seguro consultó un sistema',
                desc: 'Un dato preciso como una fecha demuestra que el modelo fue a una fuente real.',
                statusLabel: 'Otra capa',
                getsRight: 'Es cierto que una fecha real puede venir de una fuente o una herramienta.',
                missesLabel: 'Qué se pierde',
                misses: 'Pero sin conexión a una fuente, incluso una fecha precisa puede ser un relleno plausible. Comprobar una fuente es una capa aparte de la redacción.',
                bridge: 'Un dato preciso no es necesariamente un dato comprobado.',
            },
            longerBetter: {
                title: 'Una respuesta larga siempre es más fiable que una corta',
                desc: 'Cuanto más detallada es la respuesta, más se puede confiar en ella.',
                statusLabel: 'Parcialmente cierto',
                getsRight: 'A veces el detalle ayuda a aclarar, y eso es cierto.',
                missesLabel: 'Qué se pierde',
                misses: 'Pero la longitud y el detalle son propiedades de la redacción, no del fundamento. Una respuesta larga puede ser detallada y equivocada a la vez.',
                bridge: 'La longitud no es fiabilidad.',
            },
        },
    },

    insight: {
        title: 'Lo que confunde aquí',
        lead: 'La respuesta equivocada no parece rota.',
        body: 'Puede ser educada, clara e incluso sonar profesional. El problema no está en la redacción. El problema es que la redacción no prueba que el hecho se comprobó.',
    },

    analogy: {
        title: 'Un momento de la vida',
        body: 'Alguien puede darte indicaciones con total seguridad, con voz firme y con detalle, aunque no conozca de verdad el camino. Su tono seguro no significa que consultó el mapa. Con el modelo es parecido: una redacción segura no significa que el hecho se comprobó.',
    },

    misconception: {
        wrongLabel: 'Error común',
        wrongQuote: '"Si la respuesta es detallada, segura y está bien escrita, probablemente es correcta."',
        rightLabel: 'Cómo funciona en realidad',
        rightBody: 'La redacción segura viene de la fluidez del lenguaje, no de comprobar los hechos. Una respuesta puede ser completa y convincente porque el patrón de lenguaje es fuerte, no porque la información se verificó. Para hechos importantes hace falta una fuente, una herramienta o datos del sistema.',
    },

    lock: {
        title: 'Fija la comprensión',
        question: 'El modelo dice "el paquete llegará mañana", pero no se aportó ninguna fuente de seguimiento. ¿Cuál es la interpretación más segura?',
        options: [
            'El modelo comprobó el sistema de entregas real',
            'La respuesta es fluida, pero la fecha de entrega no está respaldada',
            'La respuesta es correcta porque suena segura',
            'El modelo siempre sabe el estado actual del paquete',
        ],
        success:
            'Una respuesta generada puede sonar completa aunque falte un dato clave. "Mañana" aquí es una continuación plausible, no un hecho comprobado. Sin una fuente, la fecha de entrega no está respaldada.',
    },

    practical: {
        title: 'Idea práctica',
        lead:
            'La IA es muy útil, pero para afirmaciones de hecho conviene saber si la respuesta está fundamentada. En lugar de "dime dónde está el paquete", orienta la petición para que separe lo que se sabe de lo que no, y pide una fuente cuando el estado importa:',
        uses: [
            'Separa hecho de suposición: "Indica qué se sabe, qué falta y qué hay que comprobar, y no adivines."',
            'Pide que diga qué falta: "Si no hay datos de seguimiento, no inventes un estado, pide el número de seguimiento."',
            'Detente en cada dato preciso: una fecha, una hora o un estado en la respuesta, y pregunta dónde se comprobó antes de confiar en él.',
            'Exige una redacción prudente: "Si no hay fecha de entrega confirmada, dilo de forma explícita."',
            'Verifica los hechos importantes antes de actuar, y usa una herramienta o fuente para el estado operativo real.',
        ],
        caveat:
            'Conectar a fuentes de verdad, lo que se llama Grounding o RAG, es el tema del siguiente paso. Aquí solo identificamos el problema y la necesidad de verificar. El mensaje no es "nunca confíes en la IA", sino "sabe cuándo verificar".',
    },

    lab: hallucinationsLab,
    quiz: hallucinationsQuiz,
};
