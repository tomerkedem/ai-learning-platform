// i18n/locales/es/behind-ai/selfCheckQuiz.ts
//
// Texto de la evaluación del capítulo 13 en español ("Self-Check: la autocomprobación al
// responder"). El hebreo es la fuente de la verdad.
//
// Esto es solo texto de presentación. La mecánica compartida (correctAnswer, difficulty,
// concept, onComplete, getReviewLinks, nextHref) vive en el quizData.ts compartido. La página
// del capítulo fusiona este texto sobre el esqueleto de preguntas por id (byId), así que el
// orden de las opciones debe mantenerse idéntico en todos los idiomas.
//
// Traducción de primera pasada, pendiente de revisión por un hablante nativo.
//
// Sin raya (U+2014) ni guion largo (U+2013).

import type { SelfCheckQuizId, SelfCheckQuizText } from '../../he/behind-ai/selfCheckQuiz';

export const selfCheckQuiz = {
    title: 'Comprobación: la autocomprobación al responder',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en este capítulo',
    startLabel: 'Empezar la evaluación',
    submitLabel: 'Terminar la evaluación',
    completedTitle: 'Terminaste la evaluación',

    byId: {
        1: {
            question: '¿Qué es la autocomprobación (Self-Check) en este curso?',
            options: [
                'Pedirle al modelo que revele sus pensamientos internos',
                'Un paso en el que se comprueba el borrador frente a la pregunta y la fuente antes de enviarlo',
                'Una herramienta externa que verifica hechos en internet',
                'Pedirle al modelo una respuesta nueva, esperando que salga mejor',
            ],
            explanation:
                'La autocomprobación es un paso visible después del borrador: se compara cada afirmación con la pregunta y la fuente, se señala lo que no tiene respaldo o falta, y se corrige antes de que la respuesta salga. No es revelar pensamientos internos ni una verificación externa, y tampoco es pedir una respuesta nueva: la autocomprobación revisa el borrador ya existente frente a unos criterios, no produce una redacción distinta.',
        },
        2: {
            question: 'Después de conectar la respuesta a una fuente, ¿por qué sigue haciendo falta la autocomprobación?',
            options: [
                'Porque una fuente siempre está equivocada',
                'Porque incluso con una fuente en el contexto, la respuesta generada puede ir más allá de lo que la fuente dice',
                'Porque la autocomprobación sustituye a la fuente',
                'Porque sin comprobación el modelo no respondería en absoluto',
            ],
            explanation:
                'Una fuente reduce las suposiciones, pero la respuesta todavía la redacta el modelo y puede añadir un detalle que no aparece en la fuente. La autocomprobación compara el borrador con la fuente y detecta justamente esa desviación.',
        },
        3: {
            question: 'La fuente dice: estado retrasado, entrega estimada no disponible. El borrador: "El paquete está retrasado y llegará mañana." ¿Qué afirmación debe señalar la comprobación?',
            options: [
                '"El paquete está retrasado", porque aparece en la fuente',
                '"Llegará mañana", porque la fuente no da una fecha de entrega',
                'Toda la respuesta, porque la IA nunca debería responder',
                'Ninguna afirmación, porque la respuesta suena segura',
            ],
            explanation:
                '"Retrasado" tiene respaldo en la fuente, así que se mantiene. "Llegará mañana" es una fecha que la fuente marca como no disponible, así que es una afirmación sin respaldo que hay que quitar o suavizar. La autocomprobación separa una afirmación con respaldo de una inventada.',
        },
        4: {
            question: '¿Qué no puede garantizar la autocomprobación?',
            options: [
                'Que se pueda señalar una afirmación sin respaldo en la fuente',
                'Que la respuesta sea una verdad absoluta, incluso cuando la propia fuente está equivocada o incompleta',
                'Que la respuesta se quede dentro de lo que la fuente dice',
                'Que la respuesta señale lo que falta',
            ],
            explanation:
                'La autocomprobación revisa la respuesta frente a la fuente y la petición, no frente al mundo. Si la fuente está equivocada o incompleta, la comprobación no puede inventar la verdad. Es un paso de control útil, no un verificador de hechos absoluto.',
        },
        5: {
            question: 'Quieres una respuesta para el cliente en la que se pueda confiar. ¿Cuál es la mejor forma de pedirle al modelo una comprobación visible?',
            options: [
                '"Responde al cliente con seguridad y escribe una respuesta convincente."',
                '"Escribe un borrador, comprueba cada afirmación frente a la fuente aportada, y devuelve una respuesta corregida que señale lo que no se sabe."',
                '"Descríbeme tus pensamientos internos antes de responder."',
                '"Da una respuesta lo más larga y detallada posible."',
            ],
            explanation:
                'Una comprobación útil es visible y práctica: un borrador, la comparación de cada afirmación con la fuente, y una respuesta corregida que dice lo que no se sabe. No se piden pensamientos internos, ni longitud por longitud.',
        },
    } satisfies Record<SelfCheckQuizId, SelfCheckQuizText>,
};
