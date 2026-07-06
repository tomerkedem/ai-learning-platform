// i18n/locales/es/behind-ai/groundingQuiz.ts
//
// Texto de la evaluación del capítulo 12 en español ("RAG & Grounding: cómo la IA se conecta
// a fuentes"). El hebreo es la fuente de la verdad.
//
// Esto es solo texto de presentación. La mecánica compartida (correctAnswer, difficulty,
// concept, onComplete, getReviewLinks, nextHref) vive en el quizData.ts compartido. La página
// del capítulo fusiona este texto sobre el esqueleto de preguntas por id (byId), así que el
// orden de las opciones debe mantenerse idéntico en todos los idiomas.
//
// Traducción de primera pasada, pendiente de revisión por un hablante nativo.
//
// Sin raya (U+2014) ni guion largo (U+2013).

import type { GroundingQuizId, GroundingQuizText } from '../../he/behind-ai/groundingQuiz';

export const groundingQuiz = {
    title: 'Comprobación: cómo la IA se conecta a fuentes',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en este capítulo',
    startLabel: 'Empezar la evaluación',
    submitLabel: 'Terminar la evaluación',
    completedTitle: 'Terminaste la evaluación',

    byId: {
        1: {
            question: 'En este curso, ¿qué significa una respuesta fundamentada?',
            options: [
                'Una respuesta que suena segura y profesional',
                'Una respuesta que se apoya en información aportada o recuperada, no solo en la continuación del lenguaje',
                'Una respuesta más larga y detallada',
                'Una respuesta que el modelo guardó en la memoria de su entrenamiento previo',
            ],
            explanation:
                'Fundamentar significa que la respuesta está ligada a información concreta que se aportó o se recuperó, como una tarjeta de estado o un documento. No se apoya solo en un texto que suena plausible. Una redacción segura no es fundamento.',
        },
        2: {
            question: 'En resumen, ¿qué hace RAG?',
            options: [
                'Reentrena el modelo para que sepa más de forma permanente',
                'Recupera información relevante, la añade al contexto, y luego redacta una respuesta basada en ella',
                'Borra todo aquello de lo que el modelo no está seguro',
                'Garantiza que cada respuesta sea correcta',
            ],
            explanation:
                'RAG es, en resumen: recuperar información relevante, añadirla al contexto y redactar una respuesta fundamentada en ella. No reentrena el modelo y no lo vuelve omnisciente. Le da al modelo una fuente en la que apoyarse en el momento de responder.',
        },
        3: {
            question: 'Después del capítulo de las alucinaciones, ¿por qué conectar una fuente reduce el riesgo de una respuesta inventada?',
            options: [
                'Porque una fuente hace que el modelo formule las cosas con más seguridad',
                'Porque cuando el hecho está en el contexto, el modelo tiene algo en qué apoyarse en lugar de rellenar con una suposición plausible',
                'Porque una fuente impide que el modelo escriba respuestas largas',
                'Porque una fuente elimina por completo la necesidad de comprobar los hechos',
            ],
            explanation:
                'En el capítulo anterior vimos que, cuando falta un hecho, el modelo puede rellenarlo con una continuación plausible. Una fuente pone el hecho en el contexto, así que el modelo tiene algo en qué apoyarse. Eso reduce las suposiciones, pero no elimina la necesidad de comprobar que la fuente misma sea correcta.',
        },
        4: {
            question: 'El modelo recibió una tarjeta de estado y redactó una respuesta fundamentada en ella. ¿Qué sigue siendo cierto?',
            options: [
                'La respuesta es correcta con seguridad, porque se basa en una fuente',
                'Si la fuente misma está equivocada o desactualizada, incluso una respuesta fundamentada puede estar equivocada',
                'El modelo ahora siempre conoce el estado real',
                'Ya no hace falta el juicio humano',
            ],
            explanation:
                'El fundamento liga la respuesta a una fuente, pero no comprueba si la fuente es correcta. Una fuente equivocada, desactualizada o irrelevante lleva a una respuesta fundamentada y equivocada a la vez. Una fuente no es magia, y no sustituye al juicio.',
        },
        5: {
            question: 'La fuente aportada está incompleta, o entra en conflicto con lo que dijo el cliente. ¿Cuál es la mejor respuesta?',
            options: [
                'Rellenar el vacío con una suposición para dar una respuesta completa',
                'Decir lo que la fuente sí afirma, señalar lo que falta o está en conflicto, y ofrecer un paso para comprobar',
                'Ignorar la fuente y dar una respuesta genérica',
                'Culpar al cliente por tener información equivocada',
            ],
            explanation:
                'Cuando la fuente está incompleta, la respuesta debería decir que no hay información suficiente y pedir datos. Cuando la fuente entra en conflicto, la respuesta debería reflejar lo que dice la fuente, señalar el conflicto con cuidado, y ofrecer abrir una investigación. Un buen fundamento no inventa, y no oculta lo que la fuente deja fuera.',
        },
    } satisfies Record<GroundingQuizId, GroundingQuizText>,
};
