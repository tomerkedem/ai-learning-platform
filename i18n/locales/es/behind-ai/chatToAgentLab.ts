// i18n/locales/es/behind-ai/chatToAgentLab.ts
//
// Datos en espanol (es, LTR) del "Chat to Agent Lab" del capitulo 17 (Chat to Agent).
// El hebreo es la fuente de verdad y define el tipo (ChatToAgentLabContent).
//
// Idea central: la misma solicitud, "Comprueba que pasa con el paquete y actualiza al
// cliente", se responde en cuatro modos: un chat (solo respuesta), un agente al que le falta
// informacion (pregunta en lugar de adivinar), un agente que usa una herramienta (se apoya en
// el resultado), y un agente que necesita aprobacion (prepara un borrador y se detiene).
//
// Totalmente determinista: sin azar, sin llamada real al modelo, sin sistema de seguimiento
// real, sin envio real de mensaje, y sin cadena de pensamiento oculta. Cada ejemplo es solo
// didactico. El orden de los modos se mantiene fijo, igual que las claves estructurales
// modeType.
//
// Es una primera traduccion para revisar por un hablante nativo mas adelante.
//
// Sin raya (U+2014) ni semirraya (U+2013).

import type { ChatToAgentLabContent } from '../../he/behind-ai/chatToAgentLab';

export const chatToAgentLab: ChatToAgentLabContent = {
    sectionEyebrow: 'Chat to Agent Lab',
    sectionTitle: 'La misma solicitud, cuatro modos',
    sectionIntro:
        'La solicitud es fija: "Comprueba que pasa con el paquete y actualiza al cliente." Muevete entre los cuatro modos y observa como la misma solicitud se responde una vez como texto, una vez como peticion de informacion, una vez con una herramienta, y una vez como un borrador que se detiene para aprobacion.',
    heading: 'Del chat al agente',
    kicker: 'Chat to Agent Lab',
    requestLabel: 'La solicitud',
    request: 'Comprueba que pasa con el paquete y actualiza al cliente.',
    modeSelectLabel: 'Elige un modo',
    stepsLabel: 'Ruta de pasos',
    permissionLabel: 'Permiso',
    takeawayLabel: 'La conclusion',
    disclaimer:
        'Cada ejemplo aqui es solo didactico. No hay conexion real con un sistema de seguimiento, no se envia ningun mensaje real, y no se muestra ninguna cadena de pensamiento oculta. El objetivo es mostrar la diferencia entre una respuesta y una ruta de tarea controlada, no describir un producto concreto.',
    sr: {
        modeGroup: 'Elegir un modo de respuesta',
        modeDetail: 'Detalles del modo seleccionado',
    },
    modes: [
        {
            id: 'chat',
            modeType: 'chat',
            control: 'Chat',
            badgeLabel: 'Solo respuesta',
            title: 'El chat explica que conviene hacer',
            summary: 'El chat recibe la solicitud y devuelve una respuesta. No usa una herramienta ni actua en el mundo.',
            steps: ['Leer la solicitud', 'Redactar una respuesta'],
            outputLabel: 'La respuesta',
            output: 'Para actualizar al cliente, hay que comprobar el estado de seguimiento y luego redactar un mensaje adecuado.',
            takeaway: 'El chat explica que conviene hacer. No actua por si mismo.',
        },
        {
            id: 'askInfo',
            modeType: 'askInfo',
            control: 'Agente · falta info',
            badgeLabel: 'Necesita informacion',
            title: 'El agente detecta que falta y pregunta',
            summary: 'El agente no tiene numero de seguimiento. En lugar de adivinar un estado, se detiene y pide lo que falta.',
            steps: ['Entender el objetivo', 'Comprobar la informacion que falta', 'Pedir el numero de seguimiento'],
            outputLabel: 'El agente pregunta',
            output: 'Cual es el numero de seguimiento del paquete? Sin el no puedo comprobar un estado real.',
            takeaway: 'Un buen agente no inventa informacion que falta. La pide antes de actuar.',
        },
        {
            id: 'toolLookup',
            modeType: 'toolLookup',
            control: 'Agente · herramienta',
            badgeLabel: 'Uso de herramienta',
            title: 'El agente usa una herramienta y se apoya en el resultado',
            summary: 'Ahora hay un numero de seguimiento. El agente elige una herramienta de consulta de seguimiento, lee el resultado y redacta a partir de el.',
            steps: ['Entender el objetivo', 'Elegir una herramienta de seguimiento', 'Leer el resultado', 'Redactar segun los datos'],
            tool: {
                name: 'Herramienta de consulta de seguimiento',
                inputLabel: 'Entrada',
                input: 'Numero de seguimiento 123456789',
                resultLabel: 'Resultado (ejemplo)',
                result: ['Estado: retrasado', 'Llegada estimada: no disponible'],
            },
            outputLabel: 'El agente redacta',
            output: 'Segun los datos de seguimiento, el paquete esta retrasado y no hay fecha de llegada confirmada.',
            takeaway: 'El agente usa el resultado de la herramienta para avanzar. No adivina el estado.',
        },
        {
            id: 'approval',
            modeType: 'approval',
            control: 'Agente · aprobacion',
            badgeLabel: 'Requiere aprobacion antes de enviar',
            title: 'El agente prepara un borrador y se detiene para aprobacion',
            summary: 'El siguiente paso es enviar un mensaje al cliente. Esa es una accion sensible, asi que el agente prepara solo un borrador y se detiene.',
            steps: ['Redactar un borrador para el cliente', 'Detectar una accion sensible', 'Detenerse para aprobacion'],
            outputLabel: 'Borrador para el cliente (no enviado)',
            output: 'Hola, hemos comprobado tu paquete. Segun el seguimiento esta retrasado, y todavia no hay fecha de llegada confirmada. Te avisaremos en cuanto haya informacion nueva.',
            note: 'El borrador esta listo, pero no se envio. Una accion hacia un cliente real espera tu aprobacion.',
            takeaway: 'Un agente puede preparar una accion, pero una accion real y sensible se detiene para aprobacion. Poder no es permiso.',
        },
    ],
};
