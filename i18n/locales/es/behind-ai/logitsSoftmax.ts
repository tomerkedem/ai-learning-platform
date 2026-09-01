// i18n/locales/es/behind-ai/logitsSoftmax.ts
//
// Cadenas del capítulo 8 ("Logits & Softmax: de puntuaciones a probabilidades") de la
// lumada interactiva "Behind the Scenes of AI". Traducción al español. El hebreo es la
// fuente de la verdad y define la forma del tipo (LogitsSoftmaxDict) que todos los
// idiomas deben cumplir.
//
// El archivo reúne todo el texto traducible del capítulo: hero, la conjetura inicial
// (guess), la explicación previa al laboratorio (primer), la transición "See", el
// momento wow, un ejemplo cotidiano, la corrección de un error común, la explicación de
// cómo funciona Softmax, el bloqueo de comprensión, la conclusión práctica, las llamadas
// del mentor, y los subespacios lab (laboratorio de Logits y Softmax) y quiz.
//
// Precisión: las puntuaciones y las probabilidades son solo una ilustración didáctica.
// Softmax no verifica hechos, una puntuación alta no es verdad, y el modelo no saca una
// respuesta ya lista. No hay ninguna referencia a un año en el archivo.
//
// Sin raya larga (U+2014) ni raya media (U+2013).

import type { Locale } from '@/i18n/config';
import { logitsSoftmaxLab } from './logitsSoftmaxLab';
import { logitsSoftmaxQuiz } from './logitsSoftmaxQuiz';

export const logitsSoftmax = {
    // Idioma en el que está escrito el contenido del capítulo.
    contentLocale: 'es' as Locale,

    // El inicio de la frase que el modelo completa, compartido por el hero, la conjetura y el laboratorio.
    prompt: 'El paquete probablemente...',

    // ── Hero ──
    hero: {
        badge: 'Behind the Scenes · 08 · Logits & Softmax',
        titleLead: 'Antes de elegir una palabra, el modelo da',
        titleHighlight: 'una puntuación a cada opción',
        lede:
            'El modelo no saca una respuesta ya lista ni devuelve una verdad absoluta. A cada continuación posible le da una puntuación interna, y luego una etapa llamada Softmax convierte las puntuaciones en probabilidades. En este capítulo veremos cómo las puntuaciones se convierten en porcentajes, y por qué la continuación con el porcentaje más alto es la más probable, no necesariamente la correcta.',
        promptEyebrow: 'La continuación que examinamos',
        chipEdit: 'Cambia el contexto o las puntuaciones',
        chipSee: 'y observa cómo se mueven las probabilidades',
    },

    // ── Conjetura inicial ──
    guess: {
        eyebrow: 'Conjetura rápida · qué continuación va por delante',
        title: '¿Qué continuación de "El paquete probablemente..." recibirá la mayor probabilidad?',
        subtitle:
            'Elige la continuación que te parezca la líder. Esto no es un examen, y aquí no hay una única continuación correcta en el mundo. Elige una conjetura, y enseguida veremos qué ocurre por debajo.',
        invite: 'Varias continuaciones compiten por la misma frase. Justo antes de la explicación, adivina cuál va por delante.',
        getsRightLabel: 'Qué capta bien',
        revealButton: 'Revela la idea central',
        resetButton: 'Elegir de nuevo',
        revealTitle: 'Entonces, ¿qué ocurre de verdad?',
        revealCopy:
            'No hay una única continuación "correcta". El modelo le da a cada continuación una puntuación en bruto según el input y el contexto, y Softmax convierte las puntuaciones en probabilidades. En una formulación sin contexto, "se retrasó" suele recibir la puntuación más alta, pero un solo detalle de contexto puede pasar el liderazgo a otra continuación. Una probabilidad alta significa más probable según el texto, no más correcta en el mundo.',
        cta: 'Veámoslo en el laboratorio',
        cards: {
            delayed: {
                title: 'se retrasó',
                desc: 'El paquete va en camino, solo llega con retraso.',
                statusLabel: 'Suele ir por delante',
                getsRight: 'Buena conjetura. En una formulación sin contexto, "se retrasó" de verdad suele recibir la puntuación más alta.',
                missesLabel: 'Qué queda por ver',
                misses: 'Es el líder por defecto, no la verdad. Las puntuaciones en bruto están cerca, pero Softmax ya separa las probabilidades de forma notable, y el modelo no comprobó el paquete.',
                bridge: 'Enseguida veremos que un solo detalle de contexto puede pasar el liderazgo a otra continuación.',
            },
            delivered: {
                title: 'se entregó',
                desc: 'El paquete ya llegó a su destino.',
                statusLabel: 'Depende del contexto',
                getsRight: 'Una continuación totalmente razonable. Si hay una pista de entrega, su puntuación puede subir e incluso ir por delante.',
                missesLabel: 'Qué queda por ver',
                misses: 'Sin una pista así, "se entregó" recibe una puntuación más baja que "se retrasó". Es el contexto el que decide.',
                bridge: 'En el laboratorio añadiremos "confirmación de entrega" y veremos su puntuación saltar.',
            },
            pickup: {
                title: 'espera recogida',
                desc: 'El paquete está en un punto de recogida y espera a que lo vengan a buscar.',
                statusLabel: 'Depende del contexto',
                getsRight: 'Una conjetura sensata. Con el estado adecuado, esta continuación puede recibir la puntuación más alta.',
                missesLabel: 'Qué queda por ver',
                misses: 'Sin un estado de recogida en el contexto, su puntuación se mantiene baja respecto a las demás.',
                bridge: 'En el laboratorio elegiremos el estado "espera recogida" y lo veremos subir al primer puesto.',
            },
            lost: {
                title: 'se perdió',
                desc: 'El paquete desapareció y no está claro dónde está.',
                statusLabel: 'Menos probable',
                getsRight: 'Una opción que viene a la mente, porque un paquete que no llegó despierta el temor de que se haya perdido.',
                missesLabel: 'Qué queda por ver',
                misses: 'Suele ser la continuación menos probable. Recibe una puntuación baja a menos que el contexto apunte de verdad hacia ahí.',
                bridge: 'Fíjate en cómo la puntuación baja se convierte en un porcentaje pequeño, pero no en cero.',
            },
        },
    },

    // ── Justo antes del laboratorio ──
    primer: {
        eyebrow: 'Puntuaciones internas que se convierten en probabilidades',
        title: 'Justo antes del laboratorio: ¿qué son Logits y Softmax?',
        lead:
            'Antes de jugar con las puntuaciones, entendamos dos conceptos. El modelo no salta del texto a la respuesta final. En cierto punto compara varias continuaciones posibles, le da a cada una una puntuación, y luego convierte las puntuaciones en probabilidades.',
        points: [
            {
                title: 'Los Logits son puntuaciones en bruto',
                body: 'A cada continuación posible el modelo le da una puntuación interna según el input, el contexto y los patrones que aprendió. Todavía no es un porcentaje, solo una puntuación en bruto que dice cuánto encaja la continuación. Una puntuación puede ser positiva, negativa o cero, y cobra sentido sobre todo al compararla con las puntuaciones de las demás continuaciones, no por sí sola.',
            },
            {
                title: 'Softmax convierte puntuaciones en probabilidades',
                body: 'No se pueden leer las puntuaciones en bruto directamente como probabilidades: pueden estar en cualquier rango, incluso negativas, y no suman 100. Por eso Softmax primero convierte cada puntuación en un peso positivo, y luego divide cada peso por el total. Así cada continuación recibe un porcentaje, todo junto suma 100, y se pueden comparar las continuaciones.',
            },
            {
                title: 'Hay varias continuaciones razonables, no una mágica',
                body: 'Normalmente varias continuaciones encajan con la frase, y cada una recibe una parte de la probabilidad. El modelo elige dentro de esa distribución, no saca una única respuesta ya lista.',
            },
            {
                title: 'Una probabilidad no es una verdad',
                body: 'Una continuación puede recibir un porcentaje alto porque encaja con el patrón del texto. "El paquete probablemente se retrasó" puede sonar razonable, pero el modelo no consultó el sistema de seguimiento. Probable no es correcto.',
            },
            {
                title: 'En el laboratorio controlarás las puntuaciones',
                body: 'Enseguida elegirás un dato de contexto, o ajustarás tú mismo las puntuaciones, y verás cómo se mueven las probabilidades. Así se siente cómo una puntuación se convierte en un porcentaje.',
            },
        ],
    },

    // ── Transición See: del contexto a los porcentajes ──
    see: {
        title: 'De la frase a los porcentajes, en cuatro pasos',
        steps: ['Contexto', 'Continuaciones posibles', 'Puntuaciones en bruto', 'Barras de probabilidad'],
        caption:
            'El contexto fija una puntuación para cada continuación, y Softmax convierte las puntuaciones en barras de porcentaje que suman 100. Una puntuación en bruto todavía no es una probabilidad, es solo la etapa anterior.',
    },

    // ── El momento wow ──
    wow: {
        title: 'El punto sorprendente',
        lead: 'La continuación con el porcentaje más alto es la más probable según el texto, no la más correcta en el mundo.',
        body:
            'Softmax solo ordena las puntuaciones en porcentajes y construye la distribución, no elige por sí mismo qué token sale. La elección real llega en el próximo capítulo. De todos modos, nadie comprobó si el paquete de verdad se retrasó o se entregó, y por eso una respuesta puede sonar del todo segura y aun así errar la realidad.',
    },

    // ── Ejemplo cotidiano ──
    everyday: {
        title: 'Un momento de la vida real',
        body:
            'Cuando oyes media frase, la continuación que se te viene a la mente se siente natural. Con el modelo es parecido: cada continuación recibe una puntuación, y la de puntuación alta sube al primer puesto de la distribución. Eso es lo probable según el texto, no necesariamente lo que ocurrió.',
    },

    // ── Corrección de un error común ──
    mistake: {
        wrongTitle: 'Error común',
        wrong: '"El modelo elige esta continuación porque es la correcta." Según esto, el porcentaje alto prueba que la continuación es verdad.',
        rightTitle: 'Cómo funciona de verdad',
        right:
            'El modelo elige una continuación con una puntuación relativamente alta según el input y el contexto. Softmax convierte la puntuación en un porcentaje, pero no comprueba el mundo. Un porcentaje alto no es una prueba de verdad.',
    },

    // ── Cómo funciona Softmax, sin matemáticas pesadas ──
    how: {
        title: 'Cómo funciona Softmax, sin matemáticas pesadas',
        sub: 'Softmax',
        body:
            'Piensa en Softmax como repartir un pastel entre las continuaciones. Cuanto más alta es la puntuación de una continuación, mayor es la porción que recibe del 100 por ciento, pero todas juntas siempre suman un único pastel entero. Una diferencia pequeña en la puntuación puede abrir una diferencia notable en los porcentajes, y por eso un cambio pequeño en el contexto ya mueve la imagen.',
    },

    // ── Bloqueo de comprensión ──
    lock: {
        title: 'Comprueba tu comprensión',
        trueLabel: 'Verdadero',
        trueText: 'Una probabilidad alta significa que la continuación es la más probable según el contexto, entre las mostradas. No es una prueba de que sea correcta en el mundo.',
        falseLabel: 'Falso',
        falseText: '"El porcentaje más alto prueba que la continuación es correcta o que se comprobó."',
        question: 'En el laboratorio, la continuación "se retrasó" recibió la probabilidad más alta. ¿Qué se puede deducir?',
        options: [
            'Que el paquete seguro que se retrasó',
            'Que el modelo comprobó y confirmó que el paquete se retrasó',
            'Que, dado el contexto actual, es la continuación más probable entre las mostradas',
            'Que Softmax consultó el sistema de seguimiento',
        ],
        explanationLead: 'La respuesta correcta es',
        explanationPair: '"Dado el contexto actual, es la continuación más probable entre las mostradas."',
        explanationRest:
            '. Una probabilidad alta se deriva de las puntuaciones y del contexto, no es una comprobación de la realidad ni una promesa. Softmax ordena puntuaciones en porcentajes, no consulta ninguna fuente externa. Para verificar sigues necesitando una herramienta o una fuente.',
    },

    // ── Conclusión práctica ──
    practical: {
        title: 'Conclusión práctica',
        lead:
            'Tu formulación y tu contexto fijan las puntuaciones, y las puntuaciones fijan toda la distribución. Una formulación clara refuerza la dirección deseada y debilita las continuaciones no deseadas. Y recuerda que el porcentaje es relativo, solo frente al grupo actual de continuaciones. Para tareas importantes, pídele al modelo:',
        uses: [
            'Que separe la suposición del hecho.',
            'Que diga qué le falta para responder con confianza.',
            'Que no fije el estado de un paquete sin una fuente.',
            'Que indique su grado de incertidumbre.',
            'Que pida datos de seguimiento o una fuente sólida cuando haga falta precisión factual.',
        ],
        caveat:
            'Y recuerda: incluso la continuación líder no es una prueba. Para verificar contra el mundo sigue haciendo falta una fuente externa o una herramienta.',
    },

    // F3 RESPOND (M9): la capa de respuesta humana del capitulo. El estado sigue
    // siendo independiente; aqui solo esta lo que dice el mentor despues, en ambos casos.
    mentorRespond: {
        guessCorrect:
            'Clasificaste el ajuste a la frase, no lo que de verdad le pasó al paquete. Esa es justo la separación sobre la que se apoya este capítulo. Fíjate en lo frágil que es esa ventaja: un solo dato de contexto basta para cedérsela a otra continuación.',
        guessWrong:
            'Esa elección es del todo razonable, porque preguntaste qué le pudo pasar al paquete. El modelo hace una pregunta más estrecha: qué encaja con la frase que ya existe. Vale la pena releer las líneas de arriba preguntando hacia dónde tira el contexto actual, no qué es cierto en el mundo.',
        quizPass:
            'Estás leyendo un porcentaje como una clasificación de ajuste, no como un grado de certeza. Esa lectura es la que te sostendrá en el próximo capítulo, cuando la misma distribución se enfrente a otra pregunta: cuál de las opciones se elige.',
        quizFail:
            'La confusión habitual aquí es entre lo más alto y lo correcto. Vuelve al laboratorio, añade un solo dato de contexto y observa qué continuación pasa a liderar. Cuando el liderazgo se mueve y el paquete no, la diferencia se ve.',
    },

    // Subespacios
    lab: logitsSoftmaxLab,
    quiz: logitsSoftmaxQuiz,
};
