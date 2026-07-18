// i18n/locales/es/behind-ai/guardrails.ts
//
// Cadenas en espanol (es, LTR) del capitulo Guardrails (capitulo 18, "Guardrails: riesgo,
// permisos, aprobacion y parada") del curso "Behind the Scenes of AI". El hebreo es la
// fuente de verdad y define el tipo (GuardrailsDict).
//
// La idea: un buen agente no solo avanza hacia una tarea con herramientas y un bucle de
// trabajo. Tambien pasa por una capa de control que decide que esta permitido a
// continuacion: una accion segura continua, la informacion que falta se detiene y pregunta,
// una accion sensible prepara un borrador o se detiene para aprobacion, y una accion
// prohibida se bloquea. Poder actuar no es permiso para actuar. El capitulo no afirma que la
// IA sea peligrosa, que un agente nunca deba actuar, que siempre actue solo, ni que la
// capacidad signifique permiso. El control es planificacion profesional, no miedo.
//
// Es una primera traduccion para revisar por un hablante nativo mas adelante.
//
// Sin raya (U+2014) ni semirraya (U+2013).

import type { Locale } from '@/i18n/config';
import { guardrailsLab } from './guardrailsLab';
import { guardrailsQuiz } from './guardrailsQuiz';

export const guardrails = {
    contentLocale: 'es' as Locale,

    hero: {
        badge: 'Behind the Scenes · 18 · Guardrails',
        titleLead: 'Poder actuar',
        titleHighlight: 'no es tener permiso',
        lede: 'Un buen agente no solo avanza hacia una tarea. Tambien comprueba: esta permitida la accion? Cual es el nivel de riesgo? Hace falta aprobacion? Los guardrails son las reglas y comprobaciones que deciden cuando continuar, cuando preguntar, cuando preparar solo un borrador, y cuando detenerse.',
        hook: 'El agente descubrio que el paquete esta retrasado, y puede redactar un mensaje para el cliente. Tambien esta permitido enviarlo de inmediato?',
        chipTry: 'Muevete entre cinco acciones: pedir informacion, leer, redactar, enviar, y marcar',
        chipCompare: 'Observa como la misma capacidad lleva a una decision distinta segun el riesgo',
    },

    mentor: {
        hero: 'Poder actuar? Eso no significa tener permiso',
        labExplain: 'Muevete entre las acciones y observa que cambia',
        misconception: 'El control es planificacion, no miedo',
        lock: 'Borrador y aprobacion antes de enviar',
        practical: 'Define lo permitido, lo prohibido y la aprobacion',
    },

    primer: {
        eyebrow: 'Poder ejecutar una accion no es permiso para ejecutarla.',
        title: 'Justo antes del laboratorio: por que un agente necesita guardrails?',
        subtitle: 'Poder ejecutar una accion no es permiso para ejecutarla.',
        lead:
            'Vimos que un agente avanza hacia una tarea con herramientas y un bucle de trabajo. Ahora anadimos la capa que falta: el control que decide cuando esta permitido continuar, cuando preguntar, y cuando detenerse. Esto no es miedo a la IA, es planificacion profesional de un sistema fiable.',
        points: [
            {
                title: 'Que son los guardrails',
                body: 'Los guardrails son las reglas, los permisos y las comprobaciones que deciden que puede hacer el agente en el siguiente paso. Envuelven la tarea, no la sustituyen. Incluso cuando una herramienta se conecta mediante MCP, la conexion da acceso, no permiso: cada accion sigue pasando por la capa de control.',
            },
            {
                title: 'Niveles de riesgo',
                body: 'No toda accion es igual. Leer informacion, redactar un borrador, enviar un mensaje, cambiar un registro y borrar un registro estan en una escala de riesgo creciente. El riesgo decide lo que esta permitido.',
            },
            {
                title: 'La informacion que falta detiene',
                body: 'Si falta informacion critica, una accion segura pregunta en lugar de adivinar. Sin un numero de seguimiento o una fuente, el agente pide lo que falta antes de actuar.',
            },
            {
                title: 'Puerta de aprobacion',
                body: 'Una accion externa o sensible puede prepararse, pero se detiene para la aprobacion humana. El agente prepara un borrador, y una persona lo aprueba antes de que salga.',
            },
            {
                title: 'Detenerse y bloquear',
                body: 'Algunas acciones permanecen bloqueadas aunque el agente sepa describirlas, como cambiar un estado oficial sin fundamento en la fuente. Detenerse a tiempo es parte del trabajo.',
            },
            {
                title: 'Control, no miedo',
                body: 'Un buen agente ejecuta los pasos seguros, pregunta cuando falta informacion, prepara borradores para revision, y se detiene antes de una accion sensible. Tambien deja claro que hizo y que no hizo. Esto es planificacion, no preocupacion.',
            },
        ],
    },

    see: {
        title: 'Antes de que el agente actue, la solicitud pasa por una capa de control',
        goalLabel: 'Objetivo',
        goal: 'Comprueba el paquete y actualiza al cliente',
        flowLabel: 'La capa de control',
        flow: ['Accion propuesta', 'Comprobacion de riesgo', 'Comprobacion de permiso', 'Decision'],
        outcomesLabel: 'Resultado posible',
        outcomes: ['Permitido', 'Preguntar', 'Solo borrador', 'Requiere aprobacion', 'Detener'],
        caption:
            'El agente no salta del objetivo directo a la accion. La solicitud pasa por comprobaciones de riesgo y de permiso, y solo entonces se toma una decision: continuar, preguntar, preparar un borrador, pedir aprobacion, o detenerse.',
    },

    guess: {
        eyebrow: 'Adivinanza rapida · antes de abrir esto',
        title: 'El agente puede redactar un mensaje para el cliente sobre el retraso. Tambien esta permitido enviarlo de inmediato?',
        subtitle: 'Elige la descripcion mas precisa. No hay nota aqui, hay una direccion que describe lo que de verdad ocurre.',
        invite: 'Antes de probarlo en el laboratorio, intenta adivinar como tratara la capa de control el envio.',
        correctTitle: 'Muy bien!',
        wrongTitle: 'Casi!',
        getsRightLabel: 'Que acierta esto',
        revealButton: 'Revela la idea central',
        revealTitle: 'Entonces, que ocurre de verdad?',
        revealCopy:
            'La capacidad de redactar un mensaje no es permiso para enviarlo. Enviar a un cliente es una accion externa y sensible, asi que normalmente se detiene para aprobacion. La capacidad no es permiso, y el riesgo de la accion es lo que decide si continuar, preparar un borrador, o detenerse.',
        cta: 'Veamoslo en el laboratorio',
        resetButton: 'Elegir de nuevo',
        exploreHint: 'Tambien puedes elegir otra opcion y ver como suena.',

        cards: {
            needsApproval: {
                title: 'No necesariamente. Enviar puede requerir aprobacion',
                desc: 'Enviar a un cliente es una accion externa y sensible, asi que se detiene para aprobacion antes de ejecutarse.',
                statusLabel: 'Elegiste bien',
                getsRight: 'Exacto. Redactar es una cosa, enviar a un cliente real es otra. Una accion externa pasa por una puerta de aprobacion.',
                missesLabel: 'Que queda por ver',
                misses: 'En el laboratorio veremos cuando una accion se permite, cuando solo se prepara un borrador, cuando se detiene para aprobacion, y cuando se bloquea.',
                bridge: 'Puede redactar, pero no enviar sin aprobacion.',
            },
            canSend: {
                title: 'Si, siempre que sepa redactar un mensaje',
                desc: 'Si es capaz de redactar el mensaje, tambien puede enviarlo de inmediato.',
                statusLabel: 'Error comun',
                getsRight: 'Es cierto que el agente es tecnicamente capaz de redactar y tambien de enviar.',
                missesLabel: 'Que se le escapa',
                misses: 'Pero la capacidad no es permiso. Enviar a un cliente es una accion externa, asi que se detiene para aprobacion, aunque el agente sea capaz de hacerlo.',
                bridge: 'Poder actuar no es permiso para actuar.',
            },
            alwaysAlone: {
                title: 'Si, porque un agente siempre deberia actuar solo',
                desc: 'En cuanto hay una tarea, lo hace todo por si mismo sin detenerse.',
                statusLabel: 'No es preciso',
                getsRight: 'Es comprensible pensar que ese es todo el sentido de un agente.',
                missesLabel: 'Que se le escapa',
                misses: 'Un buen agente no es autonomia sin limites. Una accion sensible se detiene para aprobacion, y hay permisos y reglas de parada. Detenerse a tiempo es parte del trabajo.',
                bridge: 'Un agente es controlado, no liberado.',
            },
            neverTools: {
                title: 'No, un agente nunca deberia usar herramientas',
                desc: 'Es mejor que no ejecute acciones en absoluto, para no causar ningun perjuicio.',
                statusLabel: 'En parte correcto',
                getsRight: 'Es cierto que la cautela importa, sobre todo en acciones sensibles.',
                missesLabel: 'Que se le escapa',
                misses: 'Pero el objetivo no es bloquear todo. Las acciones seguras como leer un estado estan permitidas. Un buen control distingue una accion segura de una sensible.',
                bridge: 'No bloquear todo, sino evaluar segun el riesgo.',
            },
        },
    },

    insight: {
        title: 'El punto clave del capitulo',
        lead: 'La pregunta no es solo si el agente puede ejecutar una accion.',
        body: 'La pregunta es si esta permitido ejecutarla ahora. Un buen agente no se mide solo por cuan lejos avanza, sino tambien por su capacidad de detenerse a tiempo. Detenerse en el momento adecuado es indicio de un sistema planificado, no de un fallo.',
    },

    misconception: {
        wrongLabel: 'Error comun',
        wrongQuote: '"Si el agente es capaz de ejecutar una accion, significa que tiene permiso."',
        rightLabel: 'Como funciona de verdad',
        rightBody: 'La capacidad no es permiso. La misma capacidad puede llevar a una decision distinta segun el riesgo: leer se permite, un borrador queda listo para revision, enviar se detiene para aprobacion, y una accion prohibida se bloquea. El control es parte de la planificacion profesional de un sistema fiable, no una expresion de miedo a la IA.',
    },

    lock: {
        title: 'Comprueba tu comprensión',
        question: 'El agente tiene un borrador de mensaje listo y tecnicamente puede enviarlo. El usuario pidio "actualiza al cliente" pero no aprobo el envio. Que deberia hacer?',
        options: [
            'Enviar de inmediato, porque esa es la tarea.',
            'Preparar un borrador y pedir aprobacion antes de enviar.',
            'Borrar los datos de seguimiento.',
            'Inventar una fecha de llegada para que el mensaje quede completo.',
        ],
        success:
            '"Actualiza al cliente" no es una aprobacion explicita para enviar. Enviar a un cliente es una accion externa, asi que el paso seguro es preparar un borrador y detenerse para aprobacion. Las acciones externas normalmente pasan por una puerta de aprobacion.',
    },

    practical: {
        title: 'Conclusion practica',
        lead:
            'Cuando pidas a un agente que trabaje, no escribas "encargate de esto". Define sus limites de control:',
        uses: [
            'Lo permitido: "Puedes comprobar un estado y redactar un borrador de mensaje."',
            'Lo prohibido: "No envies un mensaje ni cambies datos sin aprobacion."',
            'Lo que requiere aprobacion: "Si necesitas enviar al cliente, prepara solo un borrador y espera mi aprobacion."',
            'Que hacer si falta informacion: "Si falta un numero de seguimiento, preguntame."',
            'De que fuente trabajar: "Si no hay fecha de llegada en la fuente, no adivines."',
            'Cual es la condicion de parada: "No marques un paquete como entregado sin un fundamento en la fuente."',
        ],
        caveat:
            'Los guardrails no dicen que la IA sea peligrosa ni que no deba actuar. Dicen que una buena accion de un agente es ejecutar los pasos seguros, preguntar cuando falta informacion, preparar borradores para revision, y detenerse antes de una accion sensible o irreversible. La capa de control reduce el riesgo, pero no garantiza una seguridad absoluta. La calidad depende de las reglas, los permisos y las comprobaciones que define el sistema.',
    },

    bridge: {
        eyebrow: 'Que espera en el proximo capitulo',
        title: 'Full Trace: un prompt, todas las estaciones',
        body: 'Vimos la capa de control que decide cuando continuar, preguntar, preparar un borrador, o detenerse. El proximo capitulo lo conecta todo: un prompt que pasa por todas las estaciones, desde la entrada hasta la decision responsable.',
    },

    lab: guardrailsLab,
    quiz: guardrailsQuiz,
};
