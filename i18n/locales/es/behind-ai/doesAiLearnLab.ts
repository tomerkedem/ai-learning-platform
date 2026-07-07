// i18n/locales/es/behind-ai/doesAiLearnLab.ts
//
// Espanol (es, LTR) para el "Does AI Learn Lab" del Capitulo 16 (Does AI Learn From Me).
// El hebreo es la fuente de verdad y define el tipo (DoesAiLearnLabContent).
//
// Idea central: el modelo dijo "El paquete llegara manana", y el usuario lo corrigio: "No.
// Segun el seguimiento, no hay fecha de llegada confirmada." El laboratorio muestra cuatro
// capas donde la correccion se comporta distinto: el mismo chat (contexto actual), un chat
// nuevo (el contexto empieza vacio), una funcion de memoria (ejemplo de producto), y
// entrenamiento o actualizacion (un proceso aparte).
//
// Traduccion de primera pasada, pendiente de revision por un hablante nativo.
//
// Sin raya (U+2014) ni semirraya (U+2013).

import type { DoesAiLearnLabContent } from '../../he/behind-ai/doesAiLearnLab';

export const doesAiLearnLab: DoesAiLearnLabContent = {
    sectionEyebrow: 'Does AI Learn Lab',
    sectionTitle: 'La misma correccion, cuatro capas',
    sectionIntro:
        'El modelo dijo "El paquete llegara manana", y tu lo corregiste. Muevete entre las cuatro capas y ve cuando ayuda la correccion, cuando desaparece, y la diferencia entre contexto, memoria y entrenamiento.',
    heading: 'Detras del aprendizaje',
    kicker: 'Does AI Learn Lab',
    scenario: {
        label: 'El escenario',
        aiSaidLabel: 'El modelo dijo',
        aiSaid: 'El paquete llegara manana.',
        userCorrectionLabel: 'Tu corriges',
        userCorrection: 'No. Segun el seguimiento, no hay fecha de llegada confirmada.',
        aiRevisedLabel: 'En el mismo chat, el modelo se corrige',
        aiRevised: 'Correcto. Segun el seguimiento, no hay fecha de llegada confirmada.',
    },
    layerSelectLabel: 'Elige una capa',
    seesLabel: 'Lo que el modelo ve ahora',
    answerLabel: 'Respuesta del modelo',
    changedLabel: 'Que cambio',
    unchangedLabel: 'Que no cambio',
    takeawayLabel: 'Conclusion',
    disclaimer:
        'Todos los ejemplos aqui son solo con fines didacticos. Distintos productos manejan los datos de forma diferente, y no se afirma nada aqui sobre la politica, la privacidad o el entrenamiento de un producto concreto. El objetivo es mostrar la diferencia entre contexto, memoria y entrenamiento, no describir un producto concreto.',
    sr: {
        layerGroup: 'Elegir una capa de aprendizaje',
        layerDetail: 'Detalles de la capa seleccionada',
    },
    layers: [
        {
            id: 'sameChat',
            layerType: 'sameChat',
            control: 'Mismo chat',
            badgeLabel: 'Contexto actual',
            title: 'Lo corregiste, y el modelo sigue la correccion',
            summary: 'En el mismo chat volviste a preguntar algo parecido. La correccion sigue en el contexto, asi que el modelo puede apoyarse en ella.',
            sees: [
                'El mensaje inicial del modelo: El paquete llegara manana.',
                'Tu correccion: No. Segun el seguimiento, no hay fecha de llegada confirmada.',
                'Tu pregunta de seguimiento, en el mismo chat.',
            ],
            answer: 'Segun el seguimiento, no hay fecha de llegada confirmada. Te avisare en cuanto la haya.',
            changed: 'La respuesta ahora sigue la correccion, porque esta en el contexto de la conversacion.',
            unchanged: 'El modelo base no cambio. La correccion vive solo en este chat.',
            takeaway: 'Lo que esta escrito en la conversacion actual puede influir en la respuesta actual.',
        },
        {
            id: 'newChat',
            layerType: 'newChat',
            control: 'Chat nuevo',
            badgeLabel: 'Chat nuevo',
            title: 'Un chat nuevo empieza sin la correccion',
            summary: 'Abriste un chat nuevo y volviste a preguntar, sin aportar de nuevo la correccion ni la fuente.',
            sees: [
                'Un chat nuevo, y el contexto empieza vacio.',
                'Tu pregunta ahora.',
                'La correccion del chat anterior no esta aqui.',
            ],
            answer: 'Segun la estimacion habitual, el paquete deberia llegar manana.',
            changed: 'Sin la correccion en el contexto, el modelo puede volver a la respuesta original. No supongas que recuerda la correccion.',
            unchanged: 'El modelo no olvido a proposito. El chat nuevo simplemente no contiene lo que escribiste antes.',
            takeaway: 'Un chat nuevo no incluye automaticamente correcciones anteriores, salvo que el producto guarde memoria o que aportes de nuevo el contexto.',
        },
        {
            id: 'memory',
            layerType: 'memory',
            control: 'Funcion de memoria',
            badgeLabel: 'Funcion de memoria',
            title: 'Una preferencia guardada puede volver al contexto',
            summary: 'Algunos productos permiten guardar una preferencia. Es un ejemplo de una funcion de producto, no una regla que se cumpla siempre.',
            sees: [
                'Preferencia guardada (ejemplo de funcion de producto): no inventes una fecha de llegada sin una fuente.',
                'Tu pregunta ahora.',
                'La preferencia se carga en el contexto junto con la pregunta.',
            ],
            answer: 'Por la preferencia guardada, no inventare una fecha. Segun el seguimiento, no hay fecha de llegada confirmada.',
            changed: 'Cuando el producto ofrece memoria, la preferencia vuelve al contexto, asi que las respuestas pueden seguirla incluso en un chat nuevo.',
            unchanged: 'Tambien aqui el modelo base no cambio. La memoria es una capa que devuelve informacion al contexto, no un entrenamiento.',
            takeaway: 'La memoria es una funcion de producto que guarda y devuelve informacion. Es distinta de entrenar el modelo en si.',
        },
        {
            id: 'training',
            layerType: 'training',
            control: 'Entrenamiento o actualizacion',
            badgeLabel: 'Entrenamiento o actualizacion',
            title: 'Una mejora duradera requiere un proceso aparte',
            summary: 'Para cambiar el comportamiento del modelo con el tiempo hace falta un proceso aparte, no un solo mensaje en un chat.',
            sees: [
                'Muchos ejemplos y comentarios a lo largo del tiempo.',
                'Revision del equipo que construye el sistema.',
                'Entrenamiento o actualizacion del sistema.',
                'Evaluacion que comprueba si la mejora es real.',
                'Comportamiento futuro que quiza mejore.',
            ],
            answer: 'Si llega una actualizacion, y cuando llegue, el comportamiento futuro podria mejorar. No ocurre de inmediato por una sola correccion.',
            changed: 'Tras un proceso asi, una version futura del sistema podria comportarse de otra manera.',
            unchanged: 'El proceso es lento y aparte de tu conversacion, y depende del producto y de la politica. Una sola correccion no lo activa automaticamente.',
            takeaway: 'La mejora duradera del modelo es un proceso de entrenamiento o actualizacion en si mismo, no un aprendizaje en vivo desde la conversacion.',
        },
    ],
};
