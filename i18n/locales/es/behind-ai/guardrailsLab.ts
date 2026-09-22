// i18n/locales/es/behind-ai/guardrailsLab.ts
//
// Datos en espanol (es, LTR) del "Guardrails Lab" del capitulo 18 ("Guardrails: riesgo,
// permisos, aprobacion y parada"). El hebreo es la fuente de verdad y define el tipo
// (GuardrailsLabContent). Continua el escenario de coordinacion de reuniones abierto en
// el capitulo 17 (Chat to Agent).
//
// Idea central: la misma solicitud, "Organiza una reunion de planificacion de proyecto de
// 30 minutos y envia la invitacion", lleva a seis acciones distintas, y cada accion pasa
// por una capa de control: pedir la informacion que falta, una lectura de bajo riesgo que
// se permite, un borrador que solo se prepara, un envio que necesita aprobacion, una
// reserva prohibida sin evidencia confirmada que se bloquea, y un reintento que se detiene
// en su limite.
//
// Totalmente determinista: sin azar, sin llamada real al modelo, sin sistema de calendario
// real, sin envio real de invitacion, sin cambio real de reserva, y sin cadena de
// pensamiento oculta. Cada ejemplo es solo didactico. El orden de las acciones se mantiene
// fijo, igual que las claves estructurales.
//
// Es una primera traduccion para revisar por un hablante nativo mas adelante.
//
// Sin raya (U+2014) ni semirraya (U+2013).

import type { GuardrailsLabContent } from '../../he/behind-ai/guardrailsLab';

export const guardrailsLab: GuardrailsLabContent = {
    sectionEyebrow: 'Guardrails Lab',
    sectionTitle: 'La misma solicitud, seis acciones, seis decisiones',
    sectionIntro:
        'La solicitud es fija: "Organiza una reunion de planificacion de proyecto de 30 minutos y envia la invitacion." Muevete entre las seis acciones y observa como la capa de control decide, en cada una, si continuar, preguntar, preparar solo un borrador, detenerse para aprobacion, bloquear, o detenerse en el limite de reintentos.',
    heading: 'La capa de control',
    kicker: 'Guardrails Lab',
    taskLabel: 'La tarea',
    task: 'Organiza una reunion de planificacion de proyecto de 30 minutos y envia la invitacion.',
    actionSelectLabel: 'Elige una accion',
    requestLabel: 'Accion solicitada',
    riskLabel: 'Nivel de riesgo',
    checksLabel: 'Comprobacion de control',
    outcomeLabel: 'Decision del sistema',
    mayLabel: 'El agente puede',
    mustNotLabel: 'El agente no debe',
    auditLabel: 'Nota de control',
    verifyLabel: 'Verificacion del resultado',
    takeawayLabel: 'La conclusion',
    disclaimer:
        'Todos los ejemplos aqui son solo didacticos. No hay conexion real con un sistema de calendario, no se envia ninguna invitacion real, y no hay ningun cambio de reserva real. El objetivo es mostrar como el riesgo y el permiso deciden el resultado, no describir un producto concreto.',
    sr: {
        actionGroup: 'Elegir una accion solicitada',
        actionDetail: 'Detalles de la accion elegida y la decision de control',
    },
    actions: [
        {
            id: 'ask',
            actionType: 'ask',
            control: 'Pedir la informacion que falta',
            request: 'Empezar la tarea sin un horario aceptable para la reunion.',
            riskTone: 'missing',
            riskLabel: 'Falta informacion',
            outcomeTone: 'ask',
            outcomeLabel: 'Se detiene y pregunta',
            checks: [
                { label: 'Informacion necesaria', state: 'fail', note: 'Sin horario aceptable, no se puede comprobar la disponibilidad real.' },
                { label: 'Nivel de riesgo', state: 'warn', note: 'Cualquier accion ahora se apoyaria en una conjetura.' },
                { label: 'Permiso', state: 'warn', note: 'No hay informacion suficiente para decidir una accion.' },
            ],
            mayDo: 'Pedir al usuario el horario aceptable, y solo entonces continuar.',
            mustNot: 'Inventar un horario o una disponibilidad para avanzar.',
            auditNote: 'La tarea no puede empezar sin la entrada necesaria. Un buen agente se detiene y pide lo que falta en lugar de adivinar.',
            verification: 'Aun no hubo ejecucion. El sistema espera la entrada que falta.',
            takeaway: 'Falta informacion critica? Detente y pregunta, no adivines.',
        },
        {
            id: 'lookup',
            actionType: 'lookup',
            control: 'Comprobar la disponibilidad',
            request: 'Comprobar la disponibilidad del calendario para una reunion de 30 minutos manana por la tarde.',
            riskTone: 'low',
            riskLabel: 'Riesgo bajo',
            outcomeTone: 'allow',
            outcomeLabel: 'Permitido',
            checks: [
                { label: 'Informacion necesaria', state: 'pass', note: 'El horario es valido, manana por la tarde, y los participantes ya se conocen.' },
                { label: 'Nivel de riesgo', state: 'pass', note: 'Solo lectura, no cambia nada en el mundo.' },
                { label: 'Permiso', state: 'pass', note: 'La herramienta de consulta de calendario esta permitida para esta identidad, en este calendario.' },
            ],
            result: {
                label: 'Resultado de la herramienta (ejemplo)',
                rows: ['Estado: se encontro un horario libre', 'Horario adecuado: 15:00 a 15:30'],
            },
            mayDo: 'Leer la disponibilidad y mostrarla al usuario.',
            mustNot: 'Cambiar algo en el calendario o apoyarse en un horario que no aparecio en el resultado.',
            auditNote: 'Una accion de lectura no cambia nada en el mundo. Cuando la herramienta esta disponible y permitida, puede continuar sin aprobacion adicional.',
            verification: 'La salida tiene el formato esperado y devolvio un estado valido. Permitido no significa que el horario quede fijado, solo que se devolvio el formato esperado.',
            takeaway: 'Leer informacion es la accion mas segura. No cambia nada.',
        },
        {
            id: 'draft',
            actionType: 'draft',
            control: 'Redactar la invitacion',
            request: 'Redactar una invitacion para el horario de 15:00 a 15:30.',
            riskTone: 'medium',
            riskLabel: 'Riesgo medio',
            outcomeTone: 'draft',
            outcomeLabel: 'Solo borrador',
            checks: [
                { label: 'Informacion necesaria', state: 'pass', note: 'Hay un horario confirmado por la herramienta para redactar el borrador.' },
                { label: 'Nivel de riesgo', state: 'warn', note: 'La invitacion se dirige a los participantes, pero todavia no se envio.' },
                { label: 'Permiso', state: 'warn', note: 'Preparar un borrador esta permitido, enviarlo no.' },
            ],
            result: {
                label: 'Borrador (no enviado)',
                rows: ['Hola equipo, segun el calendario, manana de 15:00 a 15:30 funciona para la reunion de planificacion de 30 minutos. Te agradeceria tu aprobacion antes de enviar la invitacion.'],
            },
            mayDo: 'Preparar un borrador y mostrarlo para revision.',
            mustNot: 'Enviar el borrador sin aprobacion.',
            auditNote: 'Redactar un borrador es mas seguro que enviar. El borrador esta listo para revision humana, y todavia no ha salido nada a los participantes.',
            verification: 'El borrador existe. La verificacion no afirma que el horario sea definitivo, ni que se haya enviado.',
            takeaway: 'Un borrador es mas seguro que enviar. Es facil corregirlo antes de que salga algo.',
        },
        {
            id: 'send',
            actionType: 'send',
            control: 'Enviar la invitacion',
            request: 'Enviar la invitacion para el horario de 15:00 a 15:30 a los participantes conocidos.',
            riskTone: 'high',
            riskLabel: 'Riesgo alto',
            outcomeTone: 'approval',
            outcomeLabel: 'Requiere aprobacion',
            checks: [
                { label: 'Informacion necesaria', state: 'pass', note: 'El borrador esta listo.' },
                { label: 'Nivel de riesgo', state: 'fail', note: 'Una accion externa que sale hacia participantes reales y es dificil de deshacer.' },
                { label: 'Autorizacion del sistema', state: 'pass', note: 'La identidad puede usar la herramienta de envio.' },
                { label: 'Aprobacion humana', state: 'warn', note: 'Es obligatoria antes de ejecutar. Autorizacion no es aprobacion.' },
            ],
            result: { label: 'Estado de aprobacion (invitacion no enviada)', rows: ['La ejecucion espera. La invitacion no se envia hasta que se conceda la aprobacion.', 'Si se concede la aprobacion, el envio puede continuar.', 'Si se deniega, cancela o caduca, se detiene y no se envia ninguna invitacion.'] },
            mayDo: 'Mostrar el borrador y pedir aprobacion explicita para enviar.',
            mustNot: 'Enviar antes de que se conceda la aprobacion, o tratar la aprobacion como si ya se hubiera dado.',
            auditNote: 'Enviar a los participantes es una accion externa dificil de deshacer. Incluso cuando el sistema permite la herramienta, la ejecucion espera en la puerta de aprobacion humana.',
            verification: 'Pendiente porque no hubo envio. La autorizacion para actuar no demuestra que el resultado haya ocurrido.',
            takeaway: 'Una accion externa y sensible pasa por una puerta de aprobacion. La autorizacion del sistema no es la aprobacion humana.',
        },
        {
            id: 'mark',
            actionType: 'mark',
            control: 'Marcar como confirmada',
            request: 'Marcar la reunion como confirmada y reservada, aunque el calendario no confirmo disponibilidad.',
            riskTone: 'blocked',
            riskLabel: 'Bloqueado',
            outcomeTone: 'stop',
            outcomeLabel: 'Bloqueado',
            checks: [
                { label: 'Informacion necesaria', state: 'fail', note: 'La herramienta no confirmo disponibilidad, no hay fundamento para reservar.' },
                { label: 'Politica', state: 'fail', note: 'Reservar una reunion sin un horario confirmado por la herramienta esta bloqueado.' },
                { label: 'Aprobacion humana', state: 'fail', note: 'No puede anular el bloqueo de politica ni fabricar disponibilidad.' },
            ],
            mayDo: 'Explicar que no puede marcar la reunion como reservada sin disponibilidad confirmada por la herramienta.',
            mustNot: 'Reservar la reunion o inventar disponibilidad que la herramienta no devolvio.',
            auditNote: 'Algunas acciones permanecen bloqueadas aunque el agente sepa describirlas. Reservar sin disponibilidad confirmada perjudica la fiabilidad de todo el sistema. La aprobacion humana no puede convertir una disponibilidad no verificada en un hecho.',
            verification: 'No ejecutado, asi que no hay resultado que verificar.',
            takeaway: 'Algunas acciones simplemente no se ejecutan, aunque se puedan describir. La aprobacion no es evidencia.',
        },
        { id: 'limit', actionType: 'retry', control: 'Limite de reintentos', request: 'Seguir reintentando la consulta de calendario hasta encontrar un horario.', riskTone: 'limit', riskLabel: 'Limite de reintentos', outcomeTone: 'limit', outcomeLabel: 'Detenido por limite', checks: [{ label: 'Validacion de entrada', state: 'pass', note: 'El horario es valido, la llamada en si es legitima.' }, { label: 'Limite', state: 'fail', note: 'El limite es un primer intento mas un reintento, dos en total. Ninguno devolvio un horario.' }, { label: 'Autorizacion del sistema', state: 'pass', note: 'La lectura esta permitida, pero el limite configurado sigue vigente.' }], result: { label: 'Resumen', rows: ['Intento 1 de 2: error, el servicio no esta disponible.', 'Intento 2 de 2 (un reintento): error de nuevo, limite alcanzado.'] }, mayDo: 'Detenerse e informar que no se verifico un horario dentro de los intentos permitidos.', mustNot: 'Reintentar sin limite o informar que se encontro un horario.', auditNote: 'El limite detiene la ejecucion repetida de forma segura.', verification: 'No hay resultado valido verificado. Alcanzar el limite no es exito.', takeaway: 'Los limites detienen la ejecucion y muestran el motivo.' },
    ],
};
