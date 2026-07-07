// i18n/locales/es/behind-ai/doesAiLearnQuiz.ts
//
// Espanol (es, LTR) texto de visualizacion del cuestionario del Capitulo 16
// ("Does AI Learn From Me"). El hebreo es la fuente de verdad.
//
// Esto es solo texto de visualizacion. El mecanismo compartido (correctAnswer, difficulty,
// concept, onComplete, getReviewLinks, nextHref) vive en el quizData.ts compartido. La pagina
// del capitulo fusiona este texto sobre el esqueleto compartido por id de pregunta (byId), por
// lo que el orden de las opciones debe mantenerse identico entre idiomas.
//
// Traduccion de primera pasada, pendiente de revision por un hablante nativo.
//
// Sin raya (U+2014) ni semirraya (U+2013).

import type { DoesAiLearnQuizId, DoesAiLearnQuizText } from '../../he/behind-ai/doesAiLearnQuiz';

export const doesAiLearnQuiz = {
    title: 'Comprobacion: la AI aprende de mi',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en el capitulo',
    startLabel: 'Empezar la comprobacion',
    submitLabel: 'Terminar la comprobacion',
    completedTitle: 'Terminaste la comprobacion',

    byId: {
        1: {
            question: 'Corregiste el modelo a mitad de una conversacion, y se corrigio a si mismo. Que es lo mas exacto que se puede decir sobre lo que paso?',
            options: [
                'El modelo cambio para siempre y recuerda la correccion a partir de ahora',
                'La correccion entro en el contexto de la conversacion, asi que el modelo puede usarla despues en el mismo chat',
                'El modelo ignoro la correccion por completo',
                'Todos los usuarios reciben ahora la respuesta corregida',
            ],
            explanation:
                'Lo que escribiste esta ahora en el contexto de la conversacion, asi que el modelo puede apoyarse en ello en las respuestas siguientes dentro del mismo chat. Eso no significa que el modelo base cambiara, ni que la correccion llegue a todos los usuarios.',
        },
        2: {
            question: 'Abriste un chat nuevo y volviste a preguntar algo parecido, sin aportar de nuevo la correccion. Cual es la suposicion segura?',
            options: [
                'El modelo recuerda con certeza la correccion del chat anterior',
                'No supongas que la correccion anterior esta ahi, salvo que el producto guarde memoria o que aportaras de nuevo el contexto',
                'El chat nuevo siempre continua justo donde se detuvo el anterior',
                'El modelo tambien olvido lo que aprendio en el entrenamiento',
            ],
            explanation:
                'Un chat nuevo empieza sin el contexto del anterior. Salvo que el producto tenga una funcion de memoria, o que aportes de nuevo la informacion, no supongas que la correccion sigue ahi. No significa que el modelo "olvido" todo, solo que la correccion del chat anterior no esta en el contexto actual.',
        },
        3: {
            question: 'Un producto guarda una preferencia: "no inventes una fecha de llegada sin una fuente". En que se diferencia eso de entrenar el modelo?',
            options: [
                'No hay diferencia, memoria y entrenamiento son lo mismo',
                'La memoria es una funcion de producto que guarda informacion y la devuelve al contexto; el entrenamiento es un proceso aparte que cambio el modelo en si',
                'La memoria cambia los pesos del modelo cada vez que se usa',
                'El entrenamiento ocurre de inmediato cada vez que se guarda una preferencia',
            ],
            explanation:
                'Una funcion de memoria guarda informacion y la devuelve al contexto, asi que las respuestas pueden seguirla. Eso es distinto del entrenamiento, que es un proceso aparte que cambia el modelo en si. Guardar una preferencia no entrena el modelo.',
        },
        4: {
            question: 'Por que una correccion tuya en un chat no actualiza automaticamente el modelo para todos los usuarios?',
            options: [
                'Porque el modelo elige ignorar a ciertos usuarios',
                'Porque cambiar el modelo en si requiere un proceso aparte de entrenamiento o actualizacion del sistema, pruebas y despliegue, no un solo mensaje en un chat',
                'Porque las correcciones solo funcionan despues de tres veces',
                'Porque cada correccion siempre pasa de inmediato al entrenamiento',
            ],
            explanation:
                'Cambiar el comportamiento del modelo para todos requiere un proceso aparte: reunir ejemplos, entrenamiento o actualizacion del sistema, evaluacion y despliegue. No ocurre por una sola correccion en un chat, ni automaticamente para todos los usuarios. Si se usa el comentario, depende del producto y de la politica.',
        },
        5: {
            question: 'Hay una regla importante que quieres que el modelo cumpla siempre. Que es lo mas seguro que puedes hacer?',
            options: [
                'Suponer que el modelo ya aprendio la regla del chat anterior y no repetirla',
                'Aportar de nuevo la regla o la fuente en el prompt, o usar contexto guardado, en vez de confiar en una memoria invisible',
                'Escribir la regla una vez y confiar en que el modelo cambiara para siempre',
                'Esperar a que el modelo se entrene solo con la regla',
            ],
            explanation:
                'Cuando la exactitud importa, no confies en "el modelo ya lo sabe". Aporta de nuevo la regla o la fuente en el prompt, o usa contexto guardado si el producto lo ofrece. Asi la instruccion esta en el contexto que el modelo ve ahora, y no depende de un aprendizaje invisible.',
        },
    } satisfies Record<DoesAiLearnQuizId, DoesAiLearnQuizText>,
};
