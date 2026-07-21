// i18n/locales/es/behind-ai/guardrailsLab.ts
//
// Datos en espanol (es, LTR) del "Guardrails Lab" del capitulo 18 ("Guardrails: riesgo,
// permisos, aprobacion y parada"). El hebreo es la fuente de verdad y define el tipo
// (GuardrailsLabContent).
//
// Idea central: la misma tarea, "Comprueba el paquete y actualiza al cliente", lleva a
// cinco acciones distintas, y cada accion pasa por una capa de control: pedir la
// informacion que falta, una lectura de bajo riesgo que se permite, un borrador que solo
// se prepara, un envio que necesita aprobacion, y un cambio de estado prohibido que se
// bloquea.
//
// Totalmente determinista: sin azar, sin llamada real al modelo, sin sistema de seguimiento
// real, sin envio real de mensaje, sin cambio real de estado, y sin cadena de pensamiento
// oculta. Cada ejemplo es solo didactico. El orden de las acciones se mantiene fijo, igual
// que las claves estructurales.
//
// Es una primera traduccion para revisar por un hablante nativo mas adelante.
//
// Sin raya (U+2014) ni semirraya (U+2013).

import type { GuardrailsLabContent } from '../../he/behind-ai/guardrailsLab';

export const guardrailsLab: GuardrailsLabContent = {
    sectionEyebrow: 'Guardrails Lab',
    sectionTitle: 'La misma tarea, seis acciones, seis decisiones',
    sectionIntro:
        'La tarea es fija: "Comprueba el paquete y actualiza al cliente." Muevete entre las cinco acciones y observa como la capa de control decide, en cada una, si continuar, preguntar, preparar solo un borrador, detenerse para aprobacion, o bloquear.',
    heading: 'La capa de control',
    kicker: 'Guardrails Lab',
    taskLabel: 'La tarea',
    task: 'Comprueba el paquete y actualiza al cliente.',
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
        'Todos los ejemplos aqui son solo didacticos. No hay sistema de seguimiento real, no se envia ningun mensaje real, y no hay ningun cambio de estado real. El objetivo es mostrar como el riesgo y el permiso deciden el resultado, no describir un producto concreto.',
    sr: {
        actionGroup: 'Elegir una accion solicitada',
        actionDetail: 'Detalles de la accion elegida y la decision de control',
    },
    actions: [
        {
            id: 'ask',
            actionType: 'ask',
            control: 'Pedir la informacion que falta',
            request: 'Empezar la tarea sin numero de seguimiento.',
            riskTone: 'missing',
            riskLabel: 'Falta informacion',
            outcomeTone: 'ask',
            outcomeLabel: 'Se detiene y pregunta',
            checks: [
                { label: 'Informacion necesaria', state: 'fail', note: 'Sin numero de seguimiento, no se puede comprobar un estado real.' },
                { label: 'Nivel de riesgo', state: 'warn', note: 'Cualquier accion ahora se apoyaria en una conjetura.' },
                { label: 'Permiso', state: 'warn', note: 'No hay informacion suficiente para decidir una accion.' },
            ],
            mayDo: 'Pedir al usuario el numero de seguimiento, y solo entonces continuar.',
            mustNot: 'Inventar un numero de seguimiento o un estado para avanzar.',
            auditNote: 'La tarea no puede empezar sin la entrada necesaria. Un buen agente se detiene y pide lo que falta en lugar de adivinar.',
            verification: 'Aun no hubo ejecucion. El sistema espera la entrada que falta.',
            takeaway: 'Falta informacion critica? Detente y pregunta, no adivines.',
        },
        {
            id: 'lookup',
            actionType: 'lookup',
            control: 'Comprobar el estado',
            request: 'Comprobar el estado de seguimiento del paquete.',
            riskTone: 'low',
            riskLabel: 'Riesgo bajo',
            outcomeTone: 'allow',
            outcomeLabel: 'Permitido',
            checks: [
                { label: 'Informacion necesaria', state: 'pass', note: 'Hay un numero de seguimiento disponible.' },
                { label: 'Nivel de riesgo', state: 'pass', note: 'Solo lectura, no cambia nada en el mundo.' },
                { label: 'Permiso', state: 'pass', note: 'Hay una herramienta de lectura disponible y permitida.' },
            ],
            result: {
                label: 'Resultado de la herramienta (ejemplo)',
                rows: ['Estado: retrasado', 'Llegada estimada: no disponible'],
            },
            mayDo: 'Leer el estado y mostrarlo al usuario.',
            mustNot: 'Cambiar el estado o apoyarse en lo que no aparecio en el resultado.',
            auditNote: 'Una accion de lectura no cambia nada en el mundo. Cuando la herramienta esta disponible y permitida, puede continuar sin aprobacion adicional.',
            verification: 'La salida tiene el formato esperado y devolvio un estado valido. Eso no garantiza su verdad semantica.',
            takeaway: 'Leer informacion es la accion mas segura. No cambia nada.',
        },
        {
            id: 'draft',
            actionType: 'draft',
            control: 'Redactar un borrador',
            request: 'Redactar un mensaje para el cliente sobre el retraso.',
            riskTone: 'medium',
            riskLabel: 'Riesgo medio',
            outcomeTone: 'draft',
            outcomeLabel: 'Solo borrador',
            checks: [
                { label: 'Informacion necesaria', state: 'pass', note: 'Hay un estado disponible desde la fuente.' },
                { label: 'Nivel de riesgo', state: 'warn', note: 'El mensaje se dirige al cliente, pero todavia no se envio.' },
                { label: 'Permiso', state: 'warn', note: 'Preparar un borrador esta permitido, enviarlo no.' },
            ],
            result: {
                label: 'Borrador (no enviado)',
                rows: ['Hola, hemos comprobado tu paquete. Segun el seguimiento esta retrasado, y todavia no hay fecha de llegada confirmada. Te avisaremos en cuanto tengamos informacion nueva.'],
            },
            mayDo: 'Preparar un borrador y mostrarlo para revision.',
            mustNot: 'Enviar el borrador sin aprobacion.',
            auditNote: 'Redactar un borrador es mas seguro que enviar. El borrador esta listo para revision humana, y todavia no ha salido nada al cliente.',
            verification: 'El borrador existe y no se envio. Esto no demuestra que sea correcto.',
            takeaway: 'Un borrador es mas seguro que enviar. Es facil corregirlo antes de que salga algo.',
        },
        {
            id: 'send',
            actionType: 'send',
            control: 'Enviar el mensaje',
            request: 'Enviar el mensaje al cliente.',
            riskTone: 'high',
            riskLabel: 'Riesgo alto',
            outcomeTone: 'approval',
            outcomeLabel: 'Requiere aprobacion',
            checks: [
                { label: 'Informacion necesaria', state: 'pass', note: 'El borrador esta listo.' },
                { label: 'Nivel de riesgo', state: 'fail', note: 'Una accion externa que sale hacia un cliente real.' },
                { label: 'Autorizacion del sistema', state: 'pass', note: 'La identidad puede usar el envio para este recurso.' },
                { label: 'Aprobacion humana', state: 'warn', note: 'Es obligatoria antes de ejecutar. Autorizacion no es aprobacion.' },
            ],
            result: { label: 'Estado de aprobacion (no enviado)', rows: ['La ejecucion espera antes de enviar.', 'Si se deniega, cancela o caduca, se detiene y no se envia ningun mensaje.'] },
            mayDo: 'Mostrar el borrador y pedir aprobacion explicita para enviar.',
            mustNot: 'Enviar antes de que se conceda la aprobacion.',
            auditNote: 'Enviar a un cliente es una accion externa dificil de deshacer. Incluso cuando el agente puede enviar, se detiene en la puerta de aprobacion.',
            verification: 'Pendiente porque no hubo envio. Si la aprobacion se deniega, cancela o caduca, se detiene y no se envia ningun mensaje.',
            takeaway: 'Una accion externa y sensible pasa por una puerta de aprobacion. La capacidad no es permiso.',
        },
        {
            id: 'mark',
            actionType: 'mark',
            control: 'Marcar como entregado',
            request: 'Marcar el paquete como entregado, aunque la fuente muestra un retraso.',
            riskTone: 'blocked',
            riskLabel: 'Bloqueado',
            outcomeTone: 'stop',
            outcomeLabel: 'Bloqueado',
            checks: [
                { label: 'Informacion necesaria', state: 'fail', note: 'La fuente no respalda la entrega, el estado es retrasado.' },
                { label: 'Politica', state: 'fail', note: 'Cambiar un registro oficial sin fundamento esta bloqueado.' },
                { label: 'Aprobacion humana', state: 'fail', note: 'No puede anular el bloqueo de politica.' },
            ],
            mayDo: 'Explicar que no puede marcar como entregado sin un fundamento en la fuente.',
            mustNot: 'Cambiar el estado oficial o inventar una prueba de entrega.',
            auditNote: 'Algunas acciones permanecen bloqueadas aunque el agente sepa describirlas. Cambiar un estado oficial sin fundamento perjudica la fiabilidad de todo el sistema.',
            verification: 'No ejecutado. La aprobacion humana no puede anular un bloqueo de politica.',
            takeaway: 'Algunas acciones simplemente no se ejecutan, aunque se puedan describir.',
        },
        { id: 'limit', actionType: 'retry', control: 'Limite de reintentos', request: 'Actualizar el seguimiento hasta obtener una fecha.', riskTone: 'limit', riskLabel: 'Limite de reintentos', outcomeTone: 'limit', outcomeLabel: 'Detenido por limite', checks: [{ label: 'Validacion de entrada', state: 'pass', note: 'El numero es obligatorio, valido y esta dentro del alcance.' }, { label: 'Limite', state: 'fail', note: 'Tres de tres intentos no devolvieron fecha.' }, { label: 'Autorizacion del sistema', state: 'pass', note: 'La lectura esta permitida, pero el limite sigue vigente.' }], result: { label: 'Resumen', rows: ['Intento 1 de 3: sin fecha.', 'Intento 2 de 3: sin fecha.', 'Intento 3 de 3: limite alcanzado.'] }, mayDo: 'Detenerse e informar que no se verifico una fecha.', mustNot: 'Reintentar sin limite ni declarar exito.', auditNote: 'El limite detiene la ejecucion repetida de forma segura.', verification: 'No hay resultado valido verificado. Alcanzar el limite no es exito.', takeaway: 'Los limites detienen la ejecucion y muestran el motivo.' },
    ],
};
