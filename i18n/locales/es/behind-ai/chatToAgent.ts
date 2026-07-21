// i18n/locales/es/behind-ai/chatToAgent.ts
//
// Cadenas en espanol (es, LTR) del capitulo Chat to Agent (capitulo 17, "cuando una pregunta
// se convierte en tarea") del curso "Behind the Scenes of AI". El hebreo es la fuente de
// verdad y define el tipo (ChatToAgentDict).
//
// La idea: un chat recibe una entrada y devuelve una respuesta. Un agente recibe un objetivo
// y avanza hacia el: detecta lo que falta, puede elegir una herramienta, revisa un resultado
// y decide si continuar, detenerse o pedir aprobacion. La misma solicitud puede responderse
// como texto o gestionarse como una tarea controlada. El capitulo no afirma que todo chat sea
// un agente, que el agente sea mas inteligente, que las herramientas sean siempre seguras, ni
// que un agente actue solo sin limites.
//
// Es una primera traduccion para revisar por un hablante nativo mas adelante.
//
// Sin raya (U+2014) ni semirraya (U+2013).

import type { Locale } from '@/i18n/config';
import { chatToAgentLab } from './chatToAgentLab';
import { chatToAgentQuiz } from './chatToAgentQuiz';

export const chatToAgent = {
    contentLocale: 'es' as Locale,

    hero: {
        badge: 'Behind the Scenes · 17 · Chat to Agent',
        titleLead: 'Cuando una pregunta',
        titleHighlight: 'se convierte en tarea',
        lede: 'Un chat recibe una entrada y devuelve una respuesta. Un agente recibe un objetivo y empieza a trabajar hacia el: detecta lo que falta, puede elegir una herramienta, revisa un resultado y decide si continuar, detenerse o pedir aprobacion. La misma solicitud puede responderse como texto, o gestionarse como una tarea.',
        hook: 'Escribiste: "Comprueba que pasa con el paquete y actualiza al cliente." Es una pregunta para un chat, o una tarea para un agente?',
        chipTry: 'Muevete entre cuatro modos: respuesta, pedir informacion, usar una herramienta, y aprobacion',
        chipCompare: 'Observa como la misma solicitud se responde una vez como texto y una vez como tarea',
    },

    mentor: {
        hero: 'El chat responde. El agente avanza hacia una tarea',
        labExplain: 'Muevete entre los modos y observa que cambia',
        misconception: 'No mas inteligente. Tiene una ruta de trabajo',
        lock: 'Preguntar primero, no inventar',
        practical: 'Define objetivo, limites y aprobacion',
    },

    primer: {
        eyebrow: 'El chat explica. El agente avanza hacia la accion.',
        title: 'Justo antes del laboratorio: cuando una pregunta se convierte en tarea?',
        subtitle: 'El chat explica. El agente avanza hacia la accion.',
        lead:
            'La misma solicitud puede responderse de dos maneras muy distintas. Antes de probarlo en el laboratorio, separamos lo que hace un chat de lo que anade un agente, y vemos por que reconocer una tarea todavia no es permiso para actuar.',
        points: [
            {
                title: 'Que hace un chat',
                body: 'Un chat recibe una entrada y devuelve una respuesta. Explica que conviene hacer, pero no actua en el mundo.',
            },
            {
                title: 'Que anade un agente',
                body: 'Un agente envuelve al modelo en un bucle de tarea: objetivo, plan, elegir una herramienta, actuar o preguntar, revisar el resultado, y decidir el siguiente paso segun lo que regreso. Puede cambiar el plan segun el resultado, no solo ejecutar una lista fija.',
            },
            {
                title: 'Herramientas',
                body: 'Un agente puede usar herramientas solo cuando estan disponibles y permitidas: consulta de seguimiento, busqueda en documentos, redactar un borrador, enviar un mensaje y mas. Una herramienta tiene entradas, salidas y permisos, y tambien puede fallar. Una herramienta amplia la capacidad, no hace al modelo mas inteligente. La forma estructurada de conectar un agente con herramientas externas se llama MCP, y da acceso controlado, no permiso para hacer todo. No todo agente usa MCP.',
            },
            {
                title: 'Informacion que falta',
                body: 'Un buen agente no finge tener lo que falta. Si falta un numero de seguimiento, un permiso o una fuente, los pide en lugar de adivinar.',
            },
            {
                title: 'Estado de la tarea',
                body: 'El estado de la tarea sigue el avance: que pasos se ejecutaron, que devolvieron las herramientas, que espera aprobacion, y que sigue abierto. Esto no es memoria duradera. El estado de la tarea no se convierte automaticamente en memoria que se guarde mas alla de la conversacion actual.',
            },
            {
                title: 'Reintento y limite',
                body: 'Si una herramienta falla por un error temporal, se puede intentar de nuevo, pero con un limite. Un buen agente se detiene cuando se alcanza el limite, cuando falta informacion o permiso, cuando la herramienta devuelve un error definitivo, o cuando el resultado ya esta verificado. No reintenta sin fin.',
            },
            {
                title: 'Permiso, riesgo y limite',
                body: 'No toda accion es igual. Comprobar un estado es distinto de enviar un mensaje o borrar datos. Una accion de alto riesgo se detiene para aprobacion, y si la aprobacion se deniega el agente se detiene y no actua. Poder actuar no es permiso para actuar, y una alta confianza tampoco es permiso.',
            },
        ],
    },

    see: {
        title: 'La misma solicitud, dos rutas',
        goalLabel: 'La solicitud',
        goal: 'Comprueba que pasa con el paquete y actualiza al cliente',
        chatLabel: 'Ruta de chat',
        chat: 'Conviene comprobar el estado de seguimiento y luego redactar al cliente una actualizacion adecuada.',
        agentLabel: 'Ruta de agente',
        agent: ['Entender el objetivo', 'Comprobar informacion y permisos', 'Decidir el siguiente paso', 'Herramienta o pregunta', 'Resultado o error', 'Actualizar el estado de la tarea', 'Verificar e informar'],
        caption:
            'Los pasos no son un guion fijo. Un flujo fijo sigue una secuencia predefinida, mientras que un agente puede cambiar el siguiente paso segun el resultado, el estado de la tarea o la respuesta del usuario: continuar, reintentar dentro de un limite, pedir aprobacion, o detenerse. Usar una herramienta por si solo no convierte un sistema en agente, y una accion sensible aun se detiene para aprobacion.',
    },

    guess: {
        eyebrow: 'Adivinanza rapida · antes de abrir esto',
        title: 'Escribiste: "Comprueba que pasa con el paquete y actualiza al cliente." Es una pregunta para un chat, o una tarea para un agente?',
        subtitle: 'Elige la descripcion mas precisa. No hay nota aqui, hay una direccion que describe lo que de verdad ocurre.',
        invite: 'Antes de probarlo en el laboratorio, intenta adivinar como tratara el sistema esta solicitud.',
        correctTitle: 'Muy bien!',
        wrongTitle: 'Casi!',
        getsRightLabel: 'Que acierta esto',
        revealButton: 'Revela la idea central',
        revealTitle: 'Entonces, que ocurre de verdad?',
        revealCopy:
            'La misma solicitud puede responderse como texto en un chat, o gestionarse como una tarea con un agente. Lo que decide no es cuan inteligente es el sistema, sino si tiene herramientas, permisos y un estado de tarea. Y aun cuando se reconoce una tarea, eso todavia no es permiso para actuar.',
        cta: 'Veamoslo en el laboratorio',
        resetButton: 'Elegir de nuevo',
        exploreHint: 'Tambien puedes elegir otra opcion y ver como suena.',

        cards: {
            becomesTask: {
                title: 'Empieza como un chat, pero puede convertirse en tarea',
                desc: 'Si hay herramientas, permisos y un estado de tarea, el sistema puede detectar un objetivo y avanzar hacia el.',
                statusLabel: 'Elegiste bien',
                getsRight: 'Exacto. La misma solicitud se responde como texto en un chat, o se gestiona como tarea con un agente, segun lo que el sistema tenga alrededor del modelo.',
                missesLabel: 'Que queda por ver',
                misses: 'En el laboratorio veremos cuando un agente pide informacion, cuando usa una herramienta, y cuando se detiene para aprobacion.',
                bridge: 'Empieza como pregunta, puede volverse tarea.',
            },
            alwaysChat: {
                title: 'Siempre es solo un chat, porque la IA devuelve texto',
                desc: 'El sistema simplemente explicara que conviene hacer, sin actuar.',
                statusLabel: 'Error comun',
                getsRight: 'Es cierto que por defecto muchos sistemas devuelven texto.',
                missesLabel: 'Que se le escapa',
                misses: 'Pero cuando hay herramientas y permisos, la misma solicitud puede volverse una tarea que ejecuta pasos, no solo explica.',
                bridge: 'El texto es un valor por defecto, no el limite.',
            },
            justLonger: {
                title: 'Un agente simplemente da una respuesta mas larga',
                desc: 'Es la misma respuesta, solo con mas palabras.',
                statusLabel: 'En parte correcto',
                getsRight: 'Es cierto que un agente puede escribir mas.',
                missesLabel: 'Que se le escapa',
                misses: 'Pero la diferencia no es la longitud. Un agente avanza por pasos: elige una herramienta, revisa un resultado y decide que sigue.',
                bridge: 'La diferencia es una ruta de trabajo, no la longitud.',
            },
            alwaysAutonomous: {
                title: 'Un agente siempre actua solo sin aprobacion',
                desc: 'En cuanto hay una tarea, lo hace todo por si mismo.',
                statusLabel: 'No es preciso',
                getsRight: 'Es comprensible preocuparse por esto.',
                missesLabel: 'Que se le escapa',
                misses: 'Un buen agente no es autonomia sin limites. Una accion sensible se detiene para aprobacion, y hay permisos y reglas de parada.',
                bridge: 'Un agente es controlado, no liberado.',
            },
        },
    },

    insight: {
        title: 'El punto clave del capitulo',
        lead: 'La diferencia no es que el agente sea mas inteligente.',
        body: 'La diferencia es que el sistema alrededor del modelo le da una ruta de trabajo: herramientas, permisos, un estado de tarea y comprobaciones de parada. Sin eso, incluso una respuesta muy larga sigue siendo solo una respuesta.',
    },

    misconception: {
        wrongLabel: 'Error comun',
        wrongQuote: '"Un agente es simplemente un modelo mas inteligente que lo hace todo por si mismo."',
        rightLabel: 'Como funciona de verdad',
        rightBody: 'Un agente es el mismo tipo de modelo, con una ruta de trabajo a su alrededor: un objetivo, herramientas permitidas, una comprobacion de informacion que falta, y puertas de aprobacion para una accion sensible. No actua solo sin limites, y la capacidad de usar una herramienta no es permiso para usarla.',
    },

    lock: {
        title: 'Comprueba tu comprensión',
        question: 'Un usuario escribe: "Comprueba el estado y envia un mensaje al cliente." El sistema no tiene numero de seguimiento. Que deberia hacer primero un buen agente?',
        options: [
            'Inventar un estado para avanzar.',
            'Preguntar cual es el numero de seguimiento, o pedir la fuente.',
            'Enviar de inmediato un mensaje generico al cliente.',
            'Explicar que es un agente.',
        ],
        success:
            'Un agente debe hacer avanzar la tarea, pero no inventando informacion que falta. El paso profesional es pedir el numero de seguimiento o la fuente. Y aun cuando la informacion este completa, enviar un mensaje al cliente es una accion sensible que se detiene para aprobacion.',
    },

    practical: {
        title: 'Conclusion practica',
        lead:
            'Cuando pidas a un agente que trabaje, no escribas "encargate de esto". Define la tarea asi:',
        uses: [
            'Objetivo: que debe pasar exactamente al final. Por ejemplo: "Comprueba el estado del paquete con este numero de seguimiento y redacta al cliente una actualizacion."',
            'Informacion disponible: da el numero de seguimiento, el pedido o la fuente, para que no tenga que adivinar.',
            'Herramientas permitidas: deja claro que puede hacer y que no.',
            'Que hacer si falta informacion: "Si falta informacion, preguntame. No adivines una fecha de llegada sin una fuente."',
            'Que requiere aprobacion: "Si necesitas enviar un mensaje al cliente, prepara solo un borrador y espera mi aprobacion."',
            'Salida esperada: di en que formato quieres el resultado.',
        ],
        caveat:
            'Un agente no actua solo sin limites. Una llamada a una herramienta que funciono solo significa que un paso termino, no que toda la tarea este hecha. Si el objetivo incluye actualizar al cliente, la tarea termina solo despues de la aprobacion, el envio, y la verificacion de que el envio funciono. Si la aprobacion se deniega, el agente se detiene. Una definicion clara de objetivo, limites y aprobacion es lo que hace segura una tarea para un agente.',
    },

    bridge: {
        eyebrow: 'Que espera en el proximo capitulo',
        title: 'Guardrails: riesgo, permisos, aprobacion y parada',
        body: 'Vimos que un buen agente puede detenerse para aprobacion antes de una accion sensible. El proximo capitulo se centra justo en esa capa: como se define el riesgo, los permisos, y cuando el sistema debe detenerse o pedir aprobacion antes de actuar.',
    },

    lab: chatToAgentLab,
    quiz: chatToAgentQuiz,
};
