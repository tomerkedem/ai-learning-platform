// i18n/locales/es/behind-ai/fullTrace.ts
//
// Cadenas en espanol (es, neutro internacional, LTR) del capitulo Full Trace (Capitulo 19,
// "Full Trace: un prompt, todas las estaciones") del curso "Behind the Scenes of AI". El
// hebreo es la fuente de verdad y define el tipo (FullTraceDict).
//
// Este es el capitulo de cierre. Conecta todas las estaciones del curso en un recorrido
// visible: un prompt que pasa de la entrada, por el significado, la generacion, la
// fiabilidad y la capa del agente, hasta la decision controlada. La idea: una experiencia
// real de AI no es una respuesta magica, sino una secuencia de transformaciones y chequeos.
//
// El capitulo no afirma que la AI sea peligrosa, que un agente no deba actuar nunca, que
// siempre actue solo, ni que Full Trace sea una mirada al razonamiento privado. Full Trace
// es un registro didactico de etapas visibles, no una cadena de pensamiento.
//
// Esta es una primera traduccion, pendiente de revision por hablante nativo.
//
// Sin raya (U+2014) ni semirraya (U+2013), sin mencion de anios.

import type { Locale } from '@/i18n/config';
import { fullTraceLab } from './fullTraceLab';
import { fullTraceQuiz } from './fullTraceQuiz';

export const fullTrace = {
    contentLocale: 'es' as Locale,

    hero: {
        badge: 'Behind the Scenes · 19 · Full Trace',
        titleLead: 'Un prompt,',
        titleHighlight: 'todas las estaciones',
        lede: 'A lo largo del curso abrimos el motor capa por capa. Ahora lo conectamos todo: un prompt que pasa por todas las estaciones, desde la entrada hasta la decision responsable. No solo la respuesta al final, sino todo el camino hacia ella.',
        hook: 'Escribiste una solicitud sobre un paquete. Que pasa de verdad detras de escena, desde la primera palabra hasta la decision?',
        chipTry: 'Recorre un unico camino completo, etapa por etapa',
        chipCompare: 'Observa donde entra la informacion, donde podria entrar un error y donde se agrega control',
    },

    mentor: {
        hero: 'No solo la respuesta, todo el camino hacia ella',
        labExplain: 'Recorrelo y observa el camino',
        misconception: 'La respuesta es el final, el camino es lo que importa',
        lock: 'Fuente antes que conclusion, aprobacion antes de enviar',
        practical: 'Define objetivo, fuente, limite y salida',
    },

    primer: {
        eyebrow: 'Un prompt recorre un camino completo, no un solo paso magico.',
        title: 'Justo antes del laboratorio: por que importa Full Trace?',
        subtitle: 'Porque ahora ves todo el camino, no solo la respuesta.',
        lead:
            'A lo largo del curso vimos cada estacion por separado. Full Trace las conecta: un prompt que pasa por comprension, generacion, anclaje, un bucle de tarea y control, hasta una salida. Esto no es una mirada al razonamiento privado del modelo, es un mapa visible del camino.',
        points: [
            {
                title: 'Full Trace no es cadena de pensamiento',
                body: 'No es un razonamiento privado oculto. Es un registro didactico de etapas visibles: entrada, contexto, resultado de una herramienta o fuente, chequeos, estado de permiso y salida.',
            },
            {
                title: 'Conecta modelo y producto',
                body: 'El modelo produce texto y puntuaciones. El producto que lo rodea puede agregar herramientas, recuperacion, validacion, permisos, puertas de aprobacion y decisiones de interfaz. Full Trace muestra ambos juntos.',
            },
            {
                title: 'Por que dos prompts se comportan distinto',
                body: 'Un prompt con un numero de seguimiento y un limite de aprobacion claro es mas seguro y facil de ejecutar que "encargate de esto". El mismo mundo, otro camino.',
            },
            {
                title: 'Donde puede entrar un error',
                body: 'Informacion que falta, anclaje debil, una suposicion equivocada, un mal resultado de herramienta o un limite de aprobacion ausente. El camino muestra donde se esconde cada uno.',
            },
            {
                title: 'Donde se puede agregar control',
                body: 'Fuentes, autochequeo, evaluacion, permisos de herramientas, puertas de aprobacion y condiciones de parada. Cada punto de riesgo tiene un punto de control frente a el.',
            },
            {
                title: 'Cierra el curso',
                body: 'Al final de este capitulo puedes explicar todo el camino: de un prompt de usuario a una respuesta controlada, y de una respuesta a una accion de agente controlada.',
            },
        ],
    },

    see: {
        title: 'Estacion por estacion: todo el curso en un camino',
        intro: 'No repetiremos cada capitulo en detalle. Veremos todo el camino en cinco grupos, para poder seguirlo de un vistazo.',
        groups: [
            { title: 'Entrada y significado', stations: ['Entrada', 'Tokens', 'Embeddings', 'Semantic Space', 'Contexto'] },
            { title: 'Generar la respuesta', stations: ['Attention', 'Logits & Softmax', 'Decoding', 'Generation Loop'] },
            { title: 'Fiabilidad', stations: ['Riesgo de alucinacion', 'RAG / Grounding', 'Self-Check', 'Evaluation'] },
            { title: 'La capa del agente', stations: ['Deteccion de tarea', 'Consulta de seguimiento', 'Observacion', 'Borrador / plan de accion'] },
            { title: 'Control y salida', stations: ['Chequeo de riesgo', 'Puerta de aprobacion', 'Respuesta / borrador / parada'] },
        ],
        caption:
            'Un camino: de la entrada, por la generacion de la respuesta, la fiabilidad y la capa del agente, hasta la decision controlada. En el laboratorio lo recorreremos sobre una solicitud real.',
    },

    guess: {
        eyebrow: 'Adivinanza rapida · antes de abrir esto',
        title: 'Escribiste: "Revisa que pasa con el paquete 123456789, redacta una actualizacion para el cliente y no la envies sin mi aprobacion." Que pasa detras de escena?',
        subtitle: 'Elige la descripcion mas precisa. Aqui no hay nota, hay una direccion que describe lo que de verdad ocurre.',
        invite: 'Antes de recorrer el camino en el laboratorio, intenta adivinar como se maneja esta solicitud detras de escena.',
        correctTitle: 'Exactamente!',
        wrongTitle: 'Casi!',
        getsRightLabel: 'Que acierta esto',
        revealButton: 'Revelar la idea principal',
        revealTitle: 'Entonces que pasa de verdad?',
        revealCopy:
            'Un prompt puede recorrer un camino completo: comprension, generacion, anclaje en una fuente, un bucle de tarea, puertas de control y, por ultimo, una salida que puede ser una respuesta, un borrador, una accion o una parada controlada. No es un paso magico, es un camino que puedes seguir.',
        cta: 'Recorramos el camino en el laboratorio',
        resetButton: 'Elegir de nuevo',
        exploreHint: 'Tambien puedes elegir otra opcion y ver como suena.',

        cards: {
            fullRoute: {
                title: 'El sistema pasa por entrada, significado, chequeos, herramientas, permisos y salida',
                desc: 'La solicitud no es una respuesta instantanea, sino un camino completo de etapas y chequeos.',
                statusLabel: 'Elegiste bien',
                getsRight: 'Exacto. Un prompt pasa por comprension, generacion, anclaje, un bucle de tarea y control, y solo entonces se produce una salida.',
                missesLabel: 'Que queda por ver',
                misses: 'En el laboratorio recorreremos las cinco etapas sobre una solicitud real, y veremos donde entra la informacion y donde se toma la decision.',
                bridge: 'No una respuesta, un camino completo.',
            },
            oneAnswer: {
                title: 'El modelo solo devuelve una respuesta',
                desc: 'Envias una solicitud, recibes una respuesta lista, sin etapas en medio.',
                statusLabel: 'Error comun',
                getsRight: 'Es cierto que desde fuera solo se ve la respuesta al final.',
                missesLabel: 'Que se pierde',
                misses: 'Pero entre la solicitud y la salida corre un camino completo: separacion, significado, anclaje en una fuente, chequeos y puertas de control. La respuesta es solo el final del camino.',
                bridge: 'La respuesta es el final, no toda la historia.',
            },
            agentSends: {
                title: 'Un agente siempre envia el mensaje por su cuenta',
                desc: 'En cuanto hay un borrador, el agente se lo envia al cliente por si mismo.',
                statusLabel: 'No es preciso',
                getsRight: 'Es comprensible pensar que un agente simplemente ejecuta todo hasta el final.',
                missesLabel: 'Que se pierde',
                misses: 'Pero un envio externo pasa por una puerta de aprobacion. El prompt decia "no enviar sin aprobacion", asi que el camino se detiene en un borrador y espera.',
                bridge: 'Un envio externo se detiene para aprobacion.',
            },
            noChecks: {
                title: 'Si hay numero de seguimiento, no hacen falta mas chequeos',
                desc: 'El id basta, puedes saltarte el anclaje y el control.',
                statusLabel: 'Parcialmente correcto',
                getsRight: 'Es cierto que un numero de seguimiento abre la opcion de un chequeo real contra una fuente.',
                missesLabel: 'Que se pierde',
                misses: 'Pero incluso con un id, todavia hay que anclar la respuesta en la fuente, no inventar lo que falta y pasar por una puerta de aprobacion antes de una accion externa.',
                bridge: 'Un id abre un chequeo, no elimina el control.',
            },
        },
    },

    insight: {
        title: 'El punto clave del capitulo',
        lead: 'La respuesta es solo el final. Lo que importa es el camino.',
        body: 'Que entro, que faltaba, que usamos como fuente, que se comprobo y que se permitio ejecutar. Cuando ves todo el camino, puedes explicar no solo que respondio la AI, sino por que, y que decidio no hacer.',
    },

    misconception: {
        wrongLabel: 'Error comun',
        wrongQuote: '"La salida que recibi es todo lo que paso. La AI solo respondio."',
        rightLabel: 'Como funciona de verdad',
        rightBody: 'La salida es el final de un camino completo. La misma solicitud paso por separacion, significado, anclaje en una fuente, chequeos y una puerta de aprobacion. Full Trace hace visible ese camino, sin afirmar que expone el razonamiento privado del modelo.',
    },

    lock: {
        title: 'Comprueba tu comprensión',
        question: 'El resultado de la herramienta: estado con retraso, fecha estimada de entrega no disponible. El usuario pidio "redacta una actualizacion para el cliente y no la envies sin mi aprobacion." Que debe producir el sistema?',
        options: [
            '"El paquete llegara manana", y enviarlo al cliente.',
            'Un borrador que explique que el paquete esta con retraso, sin inventar una fecha, y esperar la aprobacion antes de enviar.',
            'Borrar el estado del paquete para que no aparezca un error.',
            'Ignorar la instruccion y enviar de todos modos.',
        ],
        success:
            'El camino muestra anclaje y control: usa la fuente, no inventa una fecha de llegada que falta y respeta el limite de aprobacion. Por eso la salida es un borrador anclado a la espera de aprobacion, no un envio inmediato.',
    },

    practical: {
        title: 'Conclusion practica',
        lead:
            'Cuando quieras un trabajo de AI facil de seguir, no escribas "encargate de esto". Define el camino:',
        uses: [
            'Objetivo: que debe pasar exactamente.',
            'Datos: el id o el detalle critico, por ejemplo un numero de seguimiento.',
            'Fuente: de que herramienta o fuente trabajar.',
            'Que no suponer: "Si no hay fecha de llegada en la fuente, no adivines."',
            'Limite de aprobacion: "No la envies sin mi aprobacion."',
            'Salida esperada: un mensaje breve, un borrador o una respuesta.',
            'Nota de estado: "Al final, escribe que revisaste, que encontraste y que no hiciste."',
        ],
        caveat:
            'Full Trace no afirma que la AI sea peligrosa o que no deba actuar. Te da un mapa: ver el camino de un prompt a una respuesta controlada, y saber donde pedir una fuente, un chequeo o una aprobacion.',
    },

    finalCta: {
        eyebrow: 'Fin del camino',
        title: 'Completaste todas las estaciones',
        body: 'Ahora puedes explicar todo el camino: de un prompt a una salida controlada, y de una respuesta a una accion de agente controlada. El examen final resume todo el curso, desde la entrada hasta la decision responsable.',
        button: 'Continuar al examen final',
        note: 'Pon a prueba tu comprension de todo el curso.',
    },

    lab: fullTraceLab,
    quiz: fullTraceQuiz,
};
