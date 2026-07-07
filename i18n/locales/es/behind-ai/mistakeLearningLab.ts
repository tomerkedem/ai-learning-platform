// i18n/locales/es/behind-ai/mistakeLearningLab.ts
//
// Datos en español (es, LTR) del "Learning from Mistakes Lab" del capítulo 14
// (Learning from Mistakes: cómo un modelo mejora a partir de un error). El hebreo es la
// fuente de la verdad y define el tipo (MistakeLearningLabContent).
//
// Idea central: la misma consulta del cliente, la misma tarjeta de fuente, la misma
// primera respuesta equivocada y la misma corrección, fijas en todos los modos. El
// aprendiz se mueve entre los cuatro niveles en los que una mejora a partir de un error
// puede ocurrir:
//   context    = corrección dentro de la conversación actual (ayuda ahora, no cambia el modelo).
//   system     = cambiar el sistema alrededor del modelo (instrucción, fuente, reglas, comprobaciones).
//   training   = aportar al entrenamiento o al ajuste de una versión futura (proceso aparte y lento).
//   evaluation = medir que la mejora de verdad ocurrió, antes de anunciarla.
//
// Totalmente determinista: sin azar, sin una llamada real a un modelo, y sin afirmar nada
// sobre la política de un producto concreto, sobre la retención de datos o sobre el
// entrenamiento de un sistema específico. Todos los ejemplos son solo didácticos. Todo el
// texto dependiente del idioma viene de data por locale, y la dirección (RTL/LTR) de dir.
// El orden de los modos, los pasos y sus identificadores se mantiene fijo, igual que las
// claves level y tone, que son estructurales.
//
// Traducción de primera pasada, pendiente de revisión por un hablante nativo.
//
// Sin raya (U+2014) ni guion largo (U+2013), sin referencias a años.

import type { MistakeLearningLabContent } from '../../he/behind-ai/mistakeLearningLab';

export const mistakeLearningLab: MistakeLearningLabContent = {
    sectionEyebrow: 'Learning from Mistakes Lab',
    sectionTitle: 'El mismo error, cuatro niveles de mejora',
    sectionIntro:
        'Un cliente pregunta dónde está el paquete. El modelo dio una respuesta equivocada, y tú lo corregiste. Muévete entre los cuatro niveles y observa dónde ocurre de verdad la mejora: en la conversación actual, en el sistema alrededor del modelo, en el entrenamiento de una versión futura, o en la comprobación de que la mejora es real.',
    heading: 'Detrás de la mejora a partir de un error',
    kicker: 'Learning from Mistakes Lab',
    scenarioLabel: 'La consulta del cliente',
    scenario: 'Mi paquete tenía que llegar ayer. ¿Dónde está?',
    sourceLabel: 'Datos de seguimiento (ejemplo)',
    sourceCaption: 'Solo una tarjeta de ejemplo, para ilustrar. No son datos reales.',
    sourceNote: 'Fíjate: la fuente dice "retrasado", pero no da una fecha de entrega. Una buena respuesta no inventará una.',
    sourceRows: [
        { label: 'Código de barras', value: 'RR123456789IL' },
        { label: 'Estado', value: 'Retrasado' },
        { label: 'Entrega estimada', value: 'No disponible', missing: true },
    ],
    initialLabel: 'La primera respuesta del modelo',
    initialAnswer: 'El paquete llegará mañana.',
    correctionLabel: 'Tu corrección',
    correction: 'Eso no es correcto. En el seguimiento pone que no hay una fecha de entrega confirmada.',
    modeLabel: '¿Dónde puede ocurrir la mejora?',
    flowLabel: 'Qué pasa en realidad',
    improvedLabel: 'Qué mejoró',
    notImprovedLabel: 'Qué no mejoró necesariamente',
    takeawayLabel: 'En resumen',
    disclaimer:
        'Todos los ejemplos aquí son solo didácticos. No hay ninguna afirmación sobre la política de un producto concreto, sobre la retención de datos o sobre el entrenamiento de un sistema específico. El objetivo es mostrar en general dónde puede ocurrir una mejora a partir de un error.',
    sr: {
        modeGroup: 'Elección del nivel de mejora',
        steps: 'Pasos del proceso en el nivel de mejora seleccionado',
    },
    modes: [
        {
            id: 'context',
            level: 'context',
            control: 'En la conversación actual',
            badgeLabel: 'Corrección en el contexto',
            title: 'El modelo corrige la respuesta dentro de la conversación',
            summary: 'La corrección entra en el contexto de la conversación, y el modelo redacta una respuesta nueva ahora.',
            steps: [
                { id: 'context-1', label: 'Primera respuesta', text: 'El modelo responde: "El paquete llegará mañana." Es una afirmación sin fuente.', tone: 'wrong' },
                { id: 'context-2', label: 'Tu corrección', text: 'Tú escribes: "Eso no es correcto. No hay una fecha de entrega confirmada en la fuente."', tone: 'context' },
                { id: 'context-3', label: 'El contexto se actualiza', text: 'La corrección pasa a formar parte del contexto de esta conversación.', tone: 'context' },
                { id: 'context-4', label: 'Respuesta corregida', text: 'El modelo responde de nuevo: "Cierto. Según el seguimiento, el paquete está retrasado y no hay una fecha de entrega confirmada."', tone: 'good' },
            ],
            beforeAfter: {
                beforeLabel: 'Antes de la corrección',
                before: 'El paquete llegará mañana.',
                afterLabel: 'Después de la corrección',
                after: 'Según el seguimiento, el paquete está retrasado. No hay una fecha de entrega confirmada.',
            },
            improved: 'La conversación actual. El modelo usó la corrección para redactar una respuesta mejor aquí y ahora.',
            notImproved: 'El modelo base. La corrección vive solo en el contexto de esta conversación, y no entra en él de forma automática.',
            takeaway: 'Una corrección en la conversación ayuda de inmediato, porque está dentro del contexto. No es lo mismo que un cambio permanente en el modelo.',
        },
        {
            id: 'system',
            level: 'system',
            control: 'En el sistema alrededor del modelo',
            badgeLabel: 'Mejora del sistema',
            title: 'El mismo error se repite, el equipo cambia el sistema',
            summary: 'Cuando muchas respuestas inventan una fecha de entrega, se puede corregir el sistema que envuelve al modelo.',
            steps: [
                { id: 'system-1', label: 'Patrón repetido', text: 'El sistema inventa una fecha de entrega cuando no hay fecha en la fuente, una y otra vez.', tone: 'wrong' },
                { id: 'system-2', label: 'Mejorar la instrucción', text: 'Se añade una regla a la instrucción: no inventes una fecha de entrega que no aparezca en la fuente.', tone: 'system' },
                { id: 'system-3', label: 'Mejorar la fuente', text: 'Se mejora la tarjeta de fuente para que marque de forma explícita "fecha no disponible".', tone: 'system' },
                { id: 'system-4', label: 'Añadir una comprobación', text: 'Se añade un paso de autocomprobación y una prueba fija para este caso.', tone: 'eval' },
            ],
            improved: 'El producto. La instrucción, la fuente, las reglas y las comprobaciones alrededor del modelo mejoraron.',
            notImproved: 'Los pesos del modelo base. Aquí no cambiaron. Lo que cambió es el sistema de alrededor.',
            takeaway: 'Se puede mejorar el producto sin tocar el modelo base, mediante instrucciones, fuentes, reglas y comprobaciones.',
        },
        {
            id: 'training',
            level: 'training',
            control: 'En el entrenamiento del modelo',
            badgeLabel: 'Mejora en el entrenamiento',
            title: 'De errores repetidos a una versión futura',
            summary: 'Los errores repetidos pueden convertirse en ejemplos para un entrenamiento futuro, en un proceso aparte y lento.',
            steps: [
                { id: 'training-1', label: 'Recoger ejemplos', text: 'Se recogen casos en los que la respuesta inventó una fecha de entrega.', tone: 'wrong' },
                { id: 'training-2', label: 'Revisar y corregir', text: 'Personas revisan los ejemplos y los corrigen hasta una respuesta correcta.', tone: 'training' },
                { id: 'training-3', label: 'Conjunto de entrenamiento', text: 'Los ejemplos corregidos entran en un conjunto de entrenamiento o de ajuste (fine-tuning).', tone: 'training' },
                { id: 'training-4', label: 'Evaluación', text: 'Se comprueba si la versión nueva de verdad mejora, sin romper otras cosas.', tone: 'eval' },
                { id: 'training-5', label: 'Versión nueva', text: 'Si la evaluación pasa, sale una versión actualizada del modelo.', tone: 'good' },
            ],
            improved: 'Una versión futura del modelo, si este proceso de verdad se lleva a cabo y pasa la evaluación.',
            notImproved: 'Esta conversación y el modelo actual. Esto no ocurre de forma automática por una corrección en el chat.',
            takeaway: 'Los errores pueden aportar a un entrenamiento futuro, pero es un proceso aparte con personas, datos y evaluación. Ni inmediato ni automático.',
        },
        {
            id: 'evaluation',
            level: 'evaluation',
            control: 'En la comprobación de la mejora',
            badgeLabel: 'Evaluación',
            title: '¿El sistema mejoró de verdad?',
            summary: 'Antes de decir "lo arreglamos", se prueban las dos versiones con los mismos casos.',
            steps: [
                { id: 'eval-1', label: 'Caso de prueba', text: 'Se toma exactamente la misma consulta, y se ejecuta en las dos versiones.', tone: 'eval' },
                { id: 'eval-2', label: 'Versión anterior', text: 'Respondió "llegará mañana". Falló, porque inventó una fecha que no está en la fuente.', tone: 'wrong' },
                { id: 'eval-3', label: 'Versión nueva', text: 'Respondió "no hay una fecha confirmada". Pasó, porque se apoyó en la fuente.', tone: 'good' },
                { id: 'eval-4', label: 'Muchos casos', text: 'Se prueban decenas de casos parecidos, no solo uno, y se mide cuántos pasan.', tone: 'eval' },
            ],
            beforeAfter: {
                beforeLabel: 'Versión anterior',
                before: 'Inventa una fecha de entrega cuando no hay fecha en la fuente.',
                afterLabel: 'Versión nueva',
                after: 'Dice que no hay una fecha de entrega confirmada.',
            },
            improved: 'La confianza en que el cambio de verdad ayuda. Ahora hay una medición, no solo una sensación.',
            notImproved: 'Nada está garantizado. La evaluación muestra si mejoramos, no convierte cada caso concreto en correcto.',
            takeaway: 'Una mejora hay que medirla, no darla por sentada. Sin evaluación, "lo arreglamos" es solo una esperanza.',
        },
    ],
};
