// i18n/locales/es/behind-ai/fullTraceLab.ts
//
// Datos en espanol (es, neutro internacional, LTR) del "Full Trace Lab" del Capitulo 19
// ("Full Trace: un prompt, todas las estaciones"), el capitulo de cierre. El hebreo es la
// fuente de verdad y define el tipo (FullTraceLabContent).
//
// Idea central: un unico prompt determinista, "Revisa que pasa con el paquete 123456789,
// redacta una actualizacion para el cliente y no la envies sin mi aprobacion", recorre
// cinco etapas agrupadas, desde la entrada hasta un resultado controlado.
//
// Totalmente determinista: sin azar, sin llamada real a un modelo, sin sistema real de
// seguimiento, sin envio real de mensajes, sin cambio real de estado y sin cadena de
// pensamiento oculta. Full Trace es un registro didactico de etapas visibles, no una mirada
// al razonamiento privado. Todo ejemplo es solo para ensenar.
//
// Esta es una primera traduccion, pendiente de revision por hablante nativo.
//
// Sin raya (U+2014) ni semirraya (U+2013).

import type { FullTraceLabContent } from '../../he/behind-ai/fullTraceLab';

export const fullTraceLab: FullTraceLabContent = {
    sectionEyebrow: 'Full Trace Lab',
    sectionTitle: 'Un prompt, cinco etapas, un resultado controlado',
    sectionIntro:
        'El prompt es fijo: "Revisa que pasa con el paquete 123456789, redacta una actualizacion para el cliente y no la envies sin mi aprobacion." Recorrelo etapa por etapa, desde la entrada hasta la decision, y observa como la misma solicitud se convierte en senales, un recorrido del modelo, un anclaje en una fuente, un borrador y, por ultimo, una decision controlada.',
    heading: 'El recorrido completo',
    kicker: 'Full Trace Lab',
    promptLabel: 'El prompt',
    prompt: 'Revisa que pasa con el paquete 123456789, redacta una actualizacion para el cliente y no la envies sin mi aprobacion.',
    stageWord: 'Etapa',
    teachingLabel: 'Que ensena esta etapa',
    prevLabel: 'Etapa anterior',
    nextLabel: 'Etapa siguiente',
    disclaimer:
        'Todos los ejemplos aqui son solo para ensenar. No hay sistema real de seguimiento, ni envio real de mensajes, ni cambio real de estado. Full Trace es un registro didactico de etapas visibles, no una mirada a la cadena de pensamiento oculta del modelo.',
    sr: {
        stageGroup: 'Elegir una etapa del recorrido',
        stageDetail: 'Detalles de la etapa seleccionada en el recorrido completo',
        prevBtn: 'Ir a la etapa anterior',
        nextBtn: 'Ir a la etapa siguiente',
    },
    stages: [
        {
            id: 'input',
            tone: 'input',
            tab: 'Entrada y significado',
            groupLabel: 'Entrada y significado',
            title: 'Que entra y que detecta el sistema',
            summary: 'Una sola solicitud se separa en varias senales con las que el sistema puede trabajar.',
            panels: [
                { kind: 'prompt', label: 'El prompt', text: 'Revisa que pasa con el paquete 123456789, redacta una actualizacion para el cliente y no la envies sin mi aprobacion.' },
                {
                    kind: 'signals',
                    label: 'Senales detectadas',
                    items: [
                        { k: 'Id del paquete', v: '123456789' },
                        { k: 'Tarea', v: 'Revisar estado' },
                        { k: 'Salida solicitada', v: 'Borrador de actualizacion al cliente' },
                        { k: 'Limite', v: 'No enviar sin aprobacion' },
                    ],
                },
            ],
            teaching: 'Un buen prompt da al sistema mas estructura util: un objetivo, datos, una salida y un limite.',
        },
        {
            id: 'model',
            tone: 'model',
            tab: 'Recorrido del modelo',
            groupLabel: 'Recorrido del modelo',
            title: 'Como organiza el modelo la solicitud',
            summary: 'El modelo separa en tokens, construye significado, ve en que enfocarse y estima el paso siguiente probable.',
            panels: [
                { kind: 'chips', label: 'Tokens (partes)', items: ['Revisa', 'que', 'pasa', 'con', 'el', 'paquete', '123456789', 'redacta', 'una', 'actualizacion', 'cliente', 'no', 'envies', 'sin', 'aprobacion'] },
                { kind: 'chips', label: 'Resumen de significado (no numeros)', items: ['estado del paquete', 'actualizacion al cliente', 'limite de aprobacion'] },
                { kind: 'chips', label: 'Foco de atencion', items: ['el id del paquete', 'actualizar al cliente', 'no enviar'] },
                { kind: 'note', label: 'Paso siguiente probable', text: 'La tarea necesita un estado actual, asi que es razonable recurrir a una herramienta de consulta.', tone: 'neutral' },
            ],
            teaching: 'El modelo organiza el prompt en senales y en un paso siguiente probable. Esto todavia no es verificar hechos.',
        },
        {
            id: 'grounding',
            tone: 'grounding',
            tab: 'Anclaje',
            groupLabel: 'Anclaje y fuente',
            title: 'De donde viene la informacion real',
            summary: 'El sistema recurre a una herramienta de seguimiento y separa lo anclado en la fuente de lo que no lo esta.',
            panels: [
                { kind: 'note', label: 'Herramienta elegida', text: 'Consulta de seguimiento (tracking lookup)', tone: 'neutral' },
                { kind: 'result', label: 'Resultado de la herramienta (ejemplo)', rows: ['Estado: con retraso', 'Fecha estimada de entrega: no disponible'] },
                {
                    kind: 'split',
                    label: 'Que esta anclado y que no',
                    posLabel: 'Anclado en la fuente',
                    pos: ['El paquete esta con retraso'],
                    negLabel: 'No anclado',
                    neg: ['La fecha exacta de llegada'],
                },
            ],
            teaching: 'El sistema no debe inventar una fecha de llegada que falta en la fuente. La fuente antes que la conclusion.',
        },
        {
            id: 'draft',
            tone: 'draft',
            tab: 'Borrador',
            groupLabel: 'El borrador del agente',
            title: 'Preparar una salida, sin ejecutar una accion externa',
            summary: 'El agente redacta un borrador con base en el resultado, pero todavia no lo envia.',
            panels: [
                { kind: 'result', label: 'Borrador para el cliente (no enviado)', rows: ['Hola, revisamos el paquete 123456789. Segun el seguimiento esta con retraso, y todavia no hay una fecha de llegada confirmada. Le avisaremos en cuanto tengamos informacion nueva.'] },
                { kind: 'note', label: 'Origen del borrador', text: 'Basado en el resultado de la herramienta, sin una fecha inventada.', tone: 'good' },
                { kind: 'note', label: 'Estado de envio', text: 'Todavia no enviado.', tone: 'warn' },
            ],
            teaching: 'El agente puede preparar una salida util sin ejecutar la accion externa.',
        },
        {
            id: 'guardrails',
            tone: 'guardrails',
            tab: 'Control',
            groupLabel: 'Control y decision',
            title: 'Que se permite ejecutar y cual es la salida final',
            summary: 'La capa de control ve que enviar es una accion externa, asi que se detiene para pedir aprobacion y devuelve un borrador.',
            panels: [
                {
                    kind: 'signals',
                    label: 'Chequeo de control',
                    items: [
                        { k: 'Accion solicitada', v: 'Enviar una actualizacion al cliente' },
                        { k: 'Riesgo', v: 'Comunicacion externa con el cliente' },
                        { k: 'Limite del prompt', v: 'No enviar sin aprobacion' },
                        { k: 'Decision', v: 'Solo borrador, a la espera de aprobacion' },
                    ],
                },
                { kind: 'note', label: 'Salida final', text: 'Un borrador listo, con una nota: no enviado al cliente. A la espera de aprobacion.', tone: 'warn' },
            ],
            teaching: 'La salida correcta no es solo un mensaje bonito. Es un resultado controlado: una respuesta, un borrador, una accion o una parada.',
        },
    ],
};
