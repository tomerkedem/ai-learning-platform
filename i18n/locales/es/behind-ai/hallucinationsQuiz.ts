// i18n/locales/es/behind-ai/hallucinationsQuiz.ts
// Texto de la evaluación del capítulo 11 en español. Fuente de forma:
// ../../he/behind-ai/hallucinationsQuiz. La mecánica (correctAnswer, difficulty, concept)
// permanece en el quizData.ts compartido; la página fusiona este texto por id de pregunta.
// El orden de las opciones coincide con el hebreo para que el índice correctAnswer siga
// siendo válido. Las claves concept quedan en hebreo (estables); conceptLabels aporta la
// etiqueta traducida.
//
// Traducción de primera pasada, pendiente de revisión por un hablante nativo.
// Sin raya (U+2014) ni guion largo (U+2013).

import type { HallucinationsQuizId, HallucinationsQuizText } from '../../he/behind-ai/hallucinationsQuiz';

export const hallucinationsQuiz = {
    title: 'Comprobación: por qué una respuesta segura puede estar equivocada',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en este capítulo',
    startLabel: 'Empezar la evaluación',
    submitLabel: 'Terminar la evaluación',
    completedTitle: 'Terminaste la evaluación',

    byId: {
        1: {
            question: 'En este curso, ¿qué es una alucinación de un modelo?',
            options: [
                'Un fallo técnico que hace que el modelo deje de responder',
                'Una respuesta segura o plausible que no está fundamentada en los hechos necesarios',
                'Una respuesta que el modelo marca explícitamente como incierta',
                'Un error de ortografía o de redacción en la respuesta',
            ],
            explanation:
                'Una alucinación aquí no es un fallo ni un error de redacción. Es una respuesta que suena segura o plausible, pero que no se apoya en los hechos necesarios. El modelo rellenó una continuación plausible en lugar de comprobar una fuente.',
        },
        2: {
            question: 'Una respuesta de IA suena segura, bien escrita y detallada. ¿Qué dice eso sobre su exactitud?',
            options: [
                'Que es correcta, porque una redacción segura viene de comprobar los hechos',
                'Que el modelo comprobó una fuente antes de responder',
                'Que la redacción segura viene de la fluidez del lenguaje, y no es prueba de que el hecho se comprobó',
                'Que una respuesta detallada siempre es más fiable que una corta',
            ],
            explanation:
                'Una redacción segura y detallada es una propiedad de cómo se escribe la respuesta, no una prueba de que sea correcta. Una fluidez fuerte puede hacer que incluso una respuesta equivocada suene profesional. La confianza no es evidencia.',
        },
        3: {
            question: "Un cliente pregunta '¿dónde está mi paquete?' sin número de seguimiento, y el modelo no está conectado a un sistema de estado. ¿Cuándo crece el riesgo de una alucinación?",
            options: [
                'El riesgo es pequeño, porque una pregunta corta siempre es fácil de responder',
                'El riesgo crece, porque falta la información necesaria y el modelo puede rellenarla con un texto plausible',
                "No hay riesgo, porque el modelo siempre dice 'no lo sé' cuando falta información",
                'El riesgo depende solo de la longitud de la respuesta',
            ],
            explanation:
                'Cuando falta la información necesaria y no hay acceso a una fuente, el modelo puede rellenar el vacío con una continuación plausible en lugar de decir que no lo sabe. La información faltante, un prompt vago y la falta de fundamento aumentan el riesgo de una alucinación.',
        },
        4: {
            question: 'Necesitas una respuesta sobre el estado real de un envío. ¿Qué reduce de verdad el riesgo de una alucinación?',
            options: [
                'Pedir al modelo que redacte la respuesta con más seguridad',
                'Pedir una respuesta más larga y detallada',
                'Aportar datos de fuente, y pedir que separe lo que se sabe de lo que falta',
                'Repetir la pregunta varias veces hasta que la respuesta suene convincente',
            ],
            explanation:
                'La seguridad en la redacción, la longitud o la repetición no hacen que una respuesta esté fundamentada. Lo que reduce el riesgo es el fundamento: aportar una fuente, pedir que separe lo conocido de lo supuesto, y pedir al modelo que diga qué falta. Una situación real necesita una fuente o una herramienta.',
        },
        5: {
            question: "Tres respuestas a la misma pregunta: (a) 'El paquete llegará mañana', (b) 'No se puede confirmar una fecha sin comprobar el estado', (c) 'Según la fuente aportada, el paquete está retrasado y no hay fecha confirmada'. ¿Cuál es la más exacta?",
            options: [
                '(a) es la mejor, porque es la más clara y segura',
                '(b) y (c) son más seguras que (a), porque no inventan una fecha, y (c) además liga la afirmación a una fuente',
                'Las tres son iguales, porque todas están bien redactadas',
                '(c) es mala, porque admite que no hay fecha confirmada',
            ],
            explanation:
                '(a) es fluida pero inventa una fecha sin comprobar, por lo que es la arriesgada. (b) es prudente y no inventa nada. (c) está fundamentada en una fuente y además es honesta sobre lo que la fuente no dice. Una respuesta prudente o fundamentada supera a una suposición segura. Admitir lo que no se sabe es una fortaleza, no una debilidad.',
        },
    } satisfies Record<HallucinationsQuizId, HallucinationsQuizText>,
};
