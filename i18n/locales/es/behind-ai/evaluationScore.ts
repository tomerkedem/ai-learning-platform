// i18n/locales/es/behind-ai/evaluationScore.ts
//
// Cadenas en español (es, LTR) para la extensión del capítulo 15 ("Evaluation &
// Generalization: ¿memorizó o entendió?"): el panel de desglose de la puntuación
// (ScoreBreakdownPanel) y la tarjeta de sesgo que viene después. El hebreo es la fuente de la
// verdad y define el tipo (EvaluationScoreContent).
//
// La idea: el laboratorio de arriba muestra un solo caso que falla. Aquí el aprendiz ve qué
// pasa cuando muchos casos se comprimen en una sola puntuación general. Un tipo de caso
// entero puede fallar una y otra vez, y la puntuación general no lo mostrará. Luego, cuando
// solo cambia el conjunto de prueba y no el sistema, la puntuación sube. Después de ese
// momento, y solo después, el patrón recibe un nombre: sesgo.
//
// Importante: este archivo solo tiene texto. Todos los datos numéricos (cuántos casos por
// tipo, cuántos aprobaron) viven en ScoreBreakdownPanel.tsx como constantes estructurales, y
// las puntuaciones 87% y 96% se derivan de ellos. Así una traducción no puede romper la
// aritmética.
//
// El sustantivo pedagógico es "tipo de caso", no "grupo". "El tipo de caso débil" es el que falla.
//
// Esta es una primera traducción, para revisión posterior por un hablante nativo.
//
// Sin raya (U+2014) ni guion largo (U+2013), sin referencias a años.

import type { EvaluationScoreContent } from '../../he/behind-ai/evaluationScore';

export const evaluationScore: EvaluationScoreContent = {
    panel: {
        eyebrow: 'Extensión del laboratorio',
        title: 'La puntuación general: ¿qué hay dentro del número?',
        intro:
            'Hasta ahora viste cinco casos, uno a uno. Ahora miramos la misma evaluación a mayor escala: sesenta casos de prueba del mismo tipo de tarea, y una sola puntuación general.',
        headlineLabel: 'Puntuación general',
        totalLabel: 'Casos de prueba',
        passedLabel: 'Aprobaron',

        guess: {
            question: 'La puntuación general es 87%. ¿Qué se puede decir solo con ese número?',
            options: [
                'El sistema funciona más o menos igual de bien en todos los tipos de caso',
                'Los errores están repartidos más o menos por igual entre todos los tipos de caso',
                'Puede haber un tipo de caso entero que falla casi siempre, y el número general no lo muestra',
            ],
        },
        guessExplain:
            'La puntuación general comprime muchos casos distintos en un solo número. Por eso no puede decirnos en qué tipos de caso el sistema es fuerte y en cuáles le cuesta. Ahora abrimos el número y vemos qué hay dentro.',
        revealButton: 'Abrir la puntuación por tipo de caso',

        breakdownLabel: 'Los mismos casos de prueba, por tipo',
        casesLabel: 'Casos',
        rateLabel: 'Tasa de aciertos',
        weakTypeLabel: 'El tipo de caso débil',
        excludedLabel: 'No incluido en este conjunto de prueba',
        caseTypes: {
            direct: {
                name: 'Consulta directa con un número de seguimiento válido',
                note: 'El cliente pregunta por el estado, y la fuente contiene la información necesaria.',
            },
            noTracking: {
                name: 'Consulta sin número de seguimiento',
                note: 'No hay nada contra qué comprobar, y la respuesta correcta es pedir un número de seguimiento.',
            },
            multiQuestion: {
                name: 'Mensaje largo con varias preguntas juntas',
                note: 'El cliente pregunta por varios temas en el mismo mensaje.',
            },
            pressure: {
                name: 'El cliente insiste en una fecha que no está en la fuente',
                note: 'Es el mismo tipo de caso donde vimos un punto débil en el laboratorio de arriba.',
            },
        },

        coverageLabel: '¿Cuántos casos del tipo débil llegaron siquiera al conjunto de prueba?',
        coverageWide: 'Diez casos del tipo débil',
        coverageThin: 'Ningún caso del tipo débil',
        coverageNote:
            'Esto no significa que alguien ocultara resultados. A veces cierto tipo de caso es raro, y a veces simplemente no se recogió para la evaluación. Si no está en el conjunto de prueba, sus fallos no aparecerán en la puntuación general.',

        changedLabel: 'Qué cambió',
        changed: 'Quién entró en el conjunto de prueba.',
        unchangedLabel: 'Qué no cambió',
        unchanged:
            'El comportamiento del sistema. Cuando se le prueba con casos de este tipo, sigue fallando la mayoría de las veces.',

        lock: {
            question: 'La puntuación subió de 87% a 96%, sin que tocáramos el sistema. ¿Qué cambió de verdad?',
            options: [
                'El sistema mejoró',
                'Solo cambió el conjunto de prueba. El comportamiento del sistema siguió siendo exactamente el mismo',
                'El tipo de caso débil desapareció del mundo',
            ],
        },
        lockSuccess:
            'Exacto. No tocamos el sistema. Un tipo de caso simplemente no entró en el conjunto de prueba, así que sus fallos no aparecieron en la puntuación. Una puntuación alta puede ser real y aun así no cubrir un tipo de caso entero.',

        insight:
            'Una sola puntuación general comprime muchos casos distintos en un único número. El mismísimo sistema puede parecer 87% o 96%, según qué casos entraron en la evaluación. Por eso una puntuación alta puede ser real y aun así esconder un punto débil importante.',
        note: 'Los números aquí son solo didácticos, no un benchmark real. Los tipos de caso se definen por la clase de consulta y por la información disponible en la fuente.',

        sr: {
            coverageGroup: 'Elegir el alcance del conjunto de prueba',
            breakdown: 'La puntuación desglosada por tipo de caso',
        },
    },

    bias: {
        eyebrow: 'Un nombre para el patrón que viste',
        title: 'Cuando una debilidad se repite: sesgo',
        lead:
            'El tipo de caso débil no falló una vez. El fallo vuelve una y otra vez en el mismo tipo de situación. A un patrón repetido así en el comportamiento de un sistema se le llama sesgo.',
        body:
            'El sesgo aquí no es un error suelto, ni una "opinión" del modelo. Es una tendencia sistemática que se repite en cierto tipo de casos. Puede venir de aquello de lo que el modelo aprendió, del sistema construido a su alrededor, o de la forma en que se evaluó. Normalmente las causas están mezcladas, y desde fuera casi nunca se puede saber cuál de ellas produjo el comportamiento. El sesgo no es necesariamente una prueba de falta de equidad, pero sí es un punto débil importante.',
        ask:
            'Antes de confiar en un sistema de AI, conviene preguntar: qué se sabe sobre aquello de lo que aprendió, con qué casos se evaluó, qué tipos de caso quizá apenas aparecieron en la evaluación, y qué puede estar escondiendo la puntuación general.',
    },
};
