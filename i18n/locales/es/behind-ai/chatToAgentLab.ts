// i18n/locales/es/behind-ai/chatToAgentLab.ts
//
// Datos en espanol (es, LTR) del "Chat to Agent Lab" del capitulo 17 (Chat to Agent).
// El hebreo es la fuente de verdad y define el tipo (ChatToAgentLabContent).
//
// Idea central: la misma solicitud, "Organiza una reunion de planificacion de proyecto de 30
// minutos y envia la invitacion", se responde en cinco modos. Los participantes ya se conocen
// para el sistema y no son la informacion que falta:
// un chat (solo respuesta), un agente al que le falta informacion (pregunta en lugar de
// adivinar), un agente que usa una herramienta (se apoya en el resultado), un agente que
// necesita aprobacion (prepara un borrador y se detiene), y un agente cuya herramienta falla
// (informa del fallo en lugar de inventar).
//
// Totalmente determinista: sin azar, sin llamada real al modelo, sin sistema de calendario
// real, sin envio real de invitacion, y sin cadena de pensamiento oculta. Cada ejemplo es solo
// didactico. El orden de los modos se mantiene fijo, igual que las claves estructurales
// modeType.
//
// Es una primera traduccion para revisar por un hablante nativo mas adelante.
//
// Sin raya (U+2014) ni semirraya (U+2013).

import type { ChatToAgentLabContent } from '../../he/behind-ai/chatToAgentLab';

export const chatToAgentLab: ChatToAgentLabContent = {
    sectionEyebrow: 'Chat to Agent Lab',
    sectionTitle: 'La misma solicitud, cinco modos',
    sectionIntro:
        'La solicitud es fija: "Organiza una reunion de planificacion de proyecto de 30 minutos y envia la invitacion." Muevete entre los cinco modos y observa como la misma solicitud se responde una vez como texto, una vez como peticion de informacion, una vez con una herramienta, una vez como un borrador que se detiene para aprobacion, y una vez como una herramienta que falla, donde el agente informa en lugar de inventar.',
    heading: 'Del chat al agente',
    kicker: 'Chat to Agent Lab',
    requestLabel: 'La solicitud',
    request: 'Organiza una reunion de planificacion de proyecto de 30 minutos y envia la invitacion.',
    modeSelectLabel: 'Elige un modo',
    stepsLabel: 'Ruta de pasos',
    permissionLabel: 'Permiso',
    takeawayLabel: 'La conclusion',
    verificationLabel: 'Verificacion',
    verificationStatusLabels: { passed: 'Confirmado', pending: 'Pendiente', failed: 'Fallido' },
    disclaimer:
        'Cada ejemplo aqui es solo didactico. No hay conexion real con un sistema de calendario, no se envia ninguna invitacion real, y no se muestra ninguna cadena de pensamiento oculta. El objetivo es mostrar la diferencia entre una respuesta y una ruta de tarea controlada, no describir un producto concreto.',
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
            title: 'El chat puede redactar lo que no necesita datos reales',
            summary: 'El chat recibe la solicitud y puede ayudar con las partes que no dependen de datos reales del calendario, como una agenda breve. No puede comprobar disponibilidad real ni enviar nada.',
            steps: ['Leer la solicitud', 'Redactar lo que no necesita datos reales'],
            outputLabel: 'La respuesta',
            output: 'No puedo comprobar disponibilidad real en el calendario ni enviar nada por mi cuenta. Aqui tienes una agenda breve para la reunion: revisar hitos, confirmar responsables, acordar los proximos pasos. Para el horario real y la invitacion necesitaras un agente con acceso al calendario.',
            takeaway: 'El chat puede producir texto util, pero no puede determinar un horario real ni enviar nada por si mismo.',
        },
        {
            id: 'askInfo',
            modeType: 'askInfo',
            control: 'Agente · falta info',
            badgeLabel: 'Necesita informacion',
            title: 'El agente detecta que falta y pregunta',
            summary: 'Los participantes ya se conocen, pero el agente no sabe cuando puede tener lugar la reunion. En lugar de adivinar, se detiene y pide el horario aceptable.',
            steps: ['Entender el objetivo', 'Comprobar la informacion que falta', 'Pedir el horario aceptable'],
            outputLabel: 'El agente pregunta',
            output: 'El equipo del proyecto ya esta definido. Cuando puede tener lugar la reunion, para que pueda comprobar la disponibilidad del calendario para 30 minutos?',
            takeaway: 'Un buen agente no inventa un horario. Lo pide antes de actuar.',
        },
        {
            id: 'toolLookup',
            modeType: 'toolLookup',
            control: 'Agente · herramienta',
            badgeLabel: 'Uso de herramienta',
            title: 'El agente usa una herramienta y se apoya en el resultado',
            summary: 'Ahora hay un horario aceptable: manana por la tarde. El agente elige una herramienta de consulta de calendario, lee el resultado y redacta a partir de el.',
            steps: ['Entender el objetivo', 'Elegir una herramienta de calendario', 'Leer el resultado', 'Redactar segun los datos'],
            tool: {
                name: 'Consulta de disponibilidad en el calendario',
                inputLabel: 'Entrada',
                input: 'Equipo del proyecto, 30 minutos, manana por la tarde',
                resultLabel: 'Resultado (ejemplo)',
                result: ['Estado: se encontro un horario libre', 'Horario adecuado: 15:00 a 15:30'],
            },
            outputLabel: 'El agente redacta',
            output: 'Segun el calendario, manana de 15:00 a 15:30 funciona para el equipo del proyecto.',
            verification: {
                status: 'passed',
                text: 'Se obtuvo un resultado de calendario valido, asi que la redaccion puede apoyarse en el.',
            },
            takeaway: 'La llamada a la herramienta funciono, pero eso es solo un paso. La tarea tambien incluye enviar la invitacion, asi que todavia no esta completa.',
        },
        {
            id: 'approval',
            modeType: 'approval',
            control: 'Agente · aprobacion',
            badgeLabel: 'Requiere aprobacion antes de enviar',
            title: 'El agente prepara un borrador y se detiene para aprobacion',
            summary: 'El siguiente paso es enviar la invitacion para manana de 15:00 a 15:30. Esa es una accion sensible, asi que el agente prepara solo un borrador y se detiene.',
            steps: ['Redactar la invitacion', 'Detectar una accion sensible', 'Detenerse para aprobacion'],
            outputLabel: 'Borrador de invitacion (no enviada)',
            output: 'Hola equipo, segun el calendario, manana de 15:00 a 15:30 funciona para la reunion de planificacion de 30 minutos. Te agradeceria tu aprobacion antes de enviar la invitacion.',
            note: 'El borrador esta listo, pero no se envio. El patron completo es redactar, pedir aprobacion, ejecutar solo despues de la aprobacion, y luego verificar el resultado. Si la aprobacion se deniega, el agente se detiene y no envia.',
            verification: {
                status: 'pending',
                text: 'Todavia no hay resultado que verificar, porque la invitacion no se envio. La verificacion espera hasta despues de la aprobacion y el envio.',
            },
            takeaway: 'Un agente puede preparar una accion, pero una accion real y sensible se detiene para aprobacion. Poder no es permiso.',
        },
        {
            id: 'toolError',
            modeType: 'toolError',
            control: 'Agente · fallo de herramienta',
            badgeLabel: 'Herramienta fallida, sin verificar',
            title: 'La herramienta falla, y el agente no inventa',
            summary: 'La herramienta de calendario devuelve un error temporal. Un buen agente no presenta disponibilidad que nunca recibio.',
            steps: ['Elegir una herramienta de calendario', 'Leer un error', 'Un reintento limitado', 'Detenerse e informar'],
            tool: {
                name: 'Consulta de disponibilidad en el calendario',
                inputLabel: 'Entrada',
                input: 'Equipo del proyecto, 30 minutos, manana por la tarde',
                resultLabel: 'Resultado',
                result: ['Error: el servicio de calendario no esta disponible ahora mismo'],
            },
            retry: {
                attemptsLabel: 'Reintento y limite',
                attempts: ['Primer intento: error, el servicio no esta disponible.', 'Un reintento: error de nuevo.'],
                limitNote: 'Limite: un solo reintento, no intentos sin fin.',
                stopReason: 'Se alcanzo el limite y el error persiste, asi que el agente se detiene en lugar de seguir reintentando.',
            },
            outputLabel: 'El agente informa',
            output: 'No pude comprobar la disponibilidad en el calendario ahora mismo, porque la herramienta de calendario devuelve un error. No voy a inventar un horario. Puedes intentarlo de nuevo mas tarde, o confirmar el horario aceptable.',
            note: 'Esto es un fallo de herramienta, la decision de planificacion es detenerse, y el resultado final es que la tarea no esta completa. El agente no finge lo contrario.',
            verification: {
                status: 'failed',
                text: 'No se obtuvo un resultado de calendario valido tras el reintento, asi que no se puede verificar un horario.',
            },
            takeaway: 'Un fallo de herramienta no es un fallo del agente, pero desde luego no es un exito. Un buen agente informa de que nada se verifico en lugar de inventar.',
        },
    ],
};
