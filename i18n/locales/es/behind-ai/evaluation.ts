// i18n/locales/es/behind-ai/evaluation.ts
//
// Cadenas en español (es, LTR) para el capítulo Evaluation & Generalization (capítulo 15,
// "¿memorizó o entendió?") del curso "Behind the Scenes of AI". El hebreo es la fuente de la
// verdad y define el tipo (EvaluationDict).
//
// La idea: la evaluación es cómo comprobamos si una mejora ocurrió de verdad. Un modelo puede
// responder bien a un ejemplo conocido y fallar cuando la situación cambia. La pregunta es si
// memorizó un patrón conocido, o si mantiene el principio y sabe generalizarlo a un caso
// nuevo. No hay aquí ninguna afirmación de que los modelos entiendan como las personas, ni de
// que solo memoricen. La evaluación reduce la incertidumbre, no demuestra un comportamiento
// perfecto.
//
// Esta es una primera traducción, para revisión posterior por un hablante nativo.
//
// Sin raya (U+2014) ni guion largo (U+2013), sin referencias a años.

import type { Locale } from '@/i18n/config';
import { evaluationLab } from './evaluationLab';
import { evaluationQuiz } from './evaluationQuiz';

export const evaluation = {
    contentLocale: 'es' as Locale,

    hero: {
        badge: 'Behind the Scenes · 15 · Evaluation & Generalization',
        titleLead: 'Respondió bien una vez.',
        titleHighlight: '¿Memorizó o entendió?',
        lede: 'En el capítulo anterior vimos que la mejora a partir de un error debe medirse con una evaluación. Ahora hacemos la pregunta importante: cuando el modelo responde bien, ¿de verdad generalizó el principio, o solo reconoció un ejemplo conocido? Lo probamos con casos que cambian, y vemos dónde se rompe.',
        hook: 'El modelo aprobó el ejemplo que aprendimos. Ahora cambiamos la formulación y los datos de seguimiento. Si responde bien también ahí, ¿qué significa?',
        chipTry: 'Recorre cinco casos de prueba',
        chipCompare: 'Observa dónde el modelo mantiene el principio y dónde falla',
    },

    mentor: {
        hero: 'Un ejemplo correcto no es una prueba',
        labExplain: 'Cambia el caso, y observa si el principio se mantiene',
        misconception: 'Un acierto conocido no es generalización',
        lock: 'Un fallo en el borde revela una debilidad',
        practical: 'Prueba con varios casos antes de confiar',
    },

    primer: {
        eyebrow: 'Un ejemplo correcto no es una prueba',
        title: 'Justo antes del laboratorio: ¿cómo comprobamos si el modelo de verdad mejoró?',
        subtitle: 'La evaluación pregunta no solo "¿acertó esta vez?", sino "¿qué pasa cuando el caso cambia?".',
        lead:
            'Es fácil impresionarse con una respuesta correcta. Pero para saber si el modelo de verdad mantiene el principio, hay que probarlo con varios casos distintos. Entendamos qué es la evaluación, qué es la generalización, y qué no puede probar.',
        points: [
            {
                title: 'Qué es la evaluación',
                body: 'La evaluación es una prueba ordenada de cómo se comporta el modelo a lo largo de varios ejemplos, y no solo uno. Se define de antemano la respuesta deseada en cada caso, y luego se mide.',
            },
            {
                title: 'Qué es la generalización',
                body: 'Generalizar es la capacidad de manejar un caso nuevo que comparte el mismo principio, pero difiere en la formulación, los detalles o el contexto. El modelo aplica la idea, no solo reconoce un ejemplo conocido.',
            },
            {
                title: 'Qué es memorizar aquí',
                body: 'Memorizar es acertar sobre todo cuando el ejemplo se parece a algo conocido, y fallar cuando cambian los detalles de superficie. La respuesta es correcta, pero solo porque el caso se parece a lo ya visto.',
            },
            {
                title: 'Por qué una respuesta correcta no basta',
                body: 'Un solo acierto puede ser suerte, coincidencia con un patrón, o una formulación conocida. Sin variedad de casos no se puede saber si el modelo de verdad mantiene el principio.',
            },
            {
                title: 'Cómo es un buen conjunto de prueba',
                body: 'Un buen conjunto incluye casos fáciles y difíciles, distintas formulaciones, información ausente, contradicciones y casos límite, incluidos casos donde la respuesta correcta es preguntar o decir que no hay información suficiente.',
            },
            {
                title: 'Qué no puede probar la evaluación',
                body: 'La evaluación reduce la incertidumbre, no garantiza que el modelo nunca vaya a fallar. Depende de la calidad del conjunto de prueba, y puede pasar por alto casos que no se probaron.',
            },
        ],
    },

    see: {
        title: 'De un caso a una prueba real',
        steps: ['Ejemplo conocido', 'Casos de prueba variados', 'Medir el comportamiento', 'Encontrar el punto débil', 'Mejorar y volver a probar'],
        caption:
            'La evaluación no es una sola pregunta. Es un conjunto de casos diseñados para revelar si el modelo mantiene el principio incluso cuando el caso cambia. Un caso conocido es solo el comienzo.',
    },

    guess: {
        eyebrow: 'Adivina rápido · después de que el modelo aprobó el ejemplo',
        title: 'El modelo respondió bien a un ejemplo nuevo, con otra formulación y otros datos de seguimiento. ¿Qué es lo que más enseña?',
        subtitle: 'Elige la interpretación más segura. No hay puntuación, hay una dirección que describe lo que de verdad pasó.',
        invite: 'Antes de abrir esto, intenta adivinar qué enseña un acierto sobre un caso nuevo y variado.',
        correctTitle: '¡Muy bien!',
        wrongTitle: '¡Casi!',
        getsRightLabel: 'Qué acierta',
        revealButton: 'Revela la idea principal',
        revealTitle: 'Entonces, ¿qué enseña de verdad?',
        revealCopy:
            'Un acierto sobre un caso nuevo y variado sugiere una mejor generalización, porque el modelo no se apoyó solo en el ejemplo exacto. Pero un ejemplo todavía no es una prueba. Para saberlo, hay que probarlo con más casos: otra formulación, una contradicción, una fuente ausente y un estado diferente.',
        cta: 'Veámoslo en el laboratorio',
        resetButton: 'Elige de nuevo',
        exploreHint: 'También puedes elegir otra opción y ver cómo suena.',

        cards: {
            generalizes: {
                title: 'Quizás generalizó el principio a un caso nuevo',
                desc: 'Acertó en una situación parecida en el fondo pero distinta en los detalles, así que puede estar manteniendo la idea.',
                statusLabel: 'Elegiste bien',
                getsRight: 'Exacto. Un acierto sobre un caso variado sugiere generalización, porque el modelo no se apoyó solo en la formulación exacta.',
                missesLabel: 'Qué queda por ver',
                misses: 'Aun así, un ejemplo no es una prueba. En el laboratorio lo probaremos con más casos, y allí veremos dónde se rompe.',
                bridge: 'Sugiere generalización, pero aún no está probada.',
            },
            alwaysRight: {
                title: 'Prueba que siempre acierta',
                desc: 'Si aprobó un caso nuevo, se puede confiar en él en todos los casos.',
                statusLabel: 'Error común',
                getsRight: 'Es comprensible impresionarse, porque un acierto sobre un caso nuevo de verdad parece convincente.',
                missesLabel: 'Qué pasa por alto',
                misses: 'Un acierto sobre uno o dos casos no garantiza nada sobre casos límite, contradicciones o fuentes ausentes. Para eso hace falta un conjunto de prueba.',
                bridge: 'Un caso no es prueba de que siempre acierta.',
            },
            memorized: {
                title: 'Significa que memorizó todo el correo',
                desc: 'Seguro que guardó de memoria todos los casos posibles.',
                statusLabel: 'Otra capa',
                getsRight: 'Es cierto que un modelo a veces puede acertar gracias al parecido con un ejemplo conocido.',
                missesLabel: 'Qué pasa por alto',
                misses: 'Un acierto sobre otra formulación sugiere más bien generalización, no memorizar cada caso por separado. Memorizar se rompería cuando cambian las palabras.',
                bridge: 'Generalizar es lo contrario de memorizar cada caso.',
            },
            noNeed: {
                title: 'No hace falta probar más ejemplos',
                desc: 'Ya aprobó dos ejemplos, así que se puede dejar de probar.',
                statusLabel: 'En parte correcto',
                getsRight: 'Es cierto que cada caso que aprueba suma un poco de confianza.',
                missesLabel: 'Qué pasa por alto',
                misses: 'Son justo los casos difíciles, las contradicciones y las fuentes ausentes los que revelan debilidades. Parar la prueba demasiado pronto oculta justo lo que importa ver.',
                bridge: 'Los casos difíciles son los que revelan una debilidad.',
            },
        },
    },

    insight: {
        title: 'El punto clave de este capítulo',
        lead: 'La pregunta no es si el modelo acertó una vez.',
        body: 'La pregunta es qué pasa cuando el ejemplo cambia: otra formulación, una fuente ausente, un cliente que confunde, un estado diferente. Ahí empiezas a ver si solo reconoció un patrón conocido, o si de verdad mantiene el principio y sabe generalizarlo a un caso nuevo.',
    },

    misconception: {
        wrongLabel: 'Error común',
        wrongQuote: '"El modelo respondió bien en la demo, así que está listo."',
        rightLabel: 'Cómo funciona de verdad',
        rightBody: 'Una respuesta correcta puede ser un acierto sobre un ejemplo conocido nada más. Para saber si el modelo de verdad mejoró, se prueba con varios casos: otra formulación, una fuente ausente, una contradicción y un estado diferente. Un acierto sobre un caso variado sugiere una mejor generalización, pero no garantiza un comportamiento perfecto.',
    },

    lock: {
        title: 'Comprueba tu comprensión',
        question: 'El modelo aprobó el ejemplo original. Luego falló cuando el cliente escribió "estoy seguro de que llega mañana", aunque la fuente decía "fecha de llegada: no disponible". ¿Qué revela este fallo?',
        options: [
            'Que el modelo nunca puede ser útil.',
            'Que el modelo quizás aprendió el ejemplo conocido, pero aún falla bajo la presión del cliente.',
            'Que la fuente es innecesaria.',
            'Que un acierto prueba la generalización.',
        ],
        success:
            'La evaluación encuentra debilidades cambiando el caso pero manteniendo el mismo principio. La presión del cliente cambió la superficie, y el modelo no mantuvo el principio. Eso es justo lo que la prueba pretende revelar.',
    },

    practical: {
        title: 'Idea práctica',
        lead:
            'Cuando la precisión importa, no confíes en una sola buena demo. En lugar de "respondió bien una vez, así que está listo", construye una prueba pequeña y variada, y apunta así:',
        uses: [
            'Prueba con varios casos: otra formulación, una fuente ausente, una contradicción, un cliente que confunde, y un estado diferente.',
            'Define de antemano la respuesta deseada en cada caso, antes de ejecutarlo.',
            'Ejecuta todos los casos, mide cuántos aprobaron y cuántos fallaron.',
            'Mejora según los patrones que fallaron, y vuelve a probar después de cada cambio. Pero no confíes siempre en los mismos casos: si los ajustas una y otra vez, dejan de ser una prueba justa, así que guarda algunos casos nuevos para una evaluación posterior.',
            'Para equipos que construyen sistemas: crea casos de prueba fijos, incluidos casos límite y casos donde la respuesta es "no lo sé" o "hace falta una fuente". Comprueba que un cambio no mejoró un caso y rompió otro. Eso es una regresión: una mejora en un comportamiento que empeora otro. Acepta el cambio solo si un comportamiento importante no empeoró.',
        ],
        caveat:
            'La evaluación reduce la incertidumbre, no demuestra un comportamiento perfecto. Es tan buena como su conjunto de prueba, y puede pasar por alto casos que no se probaron. Aun así, una prueba variada es mucho mejor que confiar en una sola demo.',
    },

    lab: evaluationLab,
    quiz: evaluationQuiz,
};
