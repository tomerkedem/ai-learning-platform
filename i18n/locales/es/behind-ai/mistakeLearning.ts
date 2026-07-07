// i18n/locales/es/behind-ai/mistakeLearning.ts
//
// Cadenas en español (es, LTR) del capítulo Learning from Mistakes (capítulo 14, "cómo un
// modelo mejora a partir de un error") del curso "Behind the Scenes of AI". El hebreo es la
// fuente de la verdad y define el tipo (MistakeLearningDict).
//
// La idea: cuando corriges una respuesta de una IA, la mejora no ocurre necesariamente de
// inmediato ni cambia necesariamente el modelo. Una corrección en la conversación vive en el
// contexto y ayuda ahora. Una mejora permanente ocurre en otros niveles: cambiar el sistema
// alrededor del modelo, entrenar o ajustar una versión futura, y todo se mide con una
// evaluación. Aquí no se afirma nada sobre la política de un producto concreto.
//
// Traducción de primera pasada, pendiente de revisión por un hablante nativo.
//
// Sin raya (U+2014) ni guion largo (U+2013), sin referencias a años.

import type { Locale } from '@/i18n/config';
import { mistakeLearningLab } from './mistakeLearningLab';
import { mistakeLearningQuiz } from './mistakeLearningQuiz';

export const mistakeLearning = {
    contentLocale: 'es' as Locale,

    // ── Hero ──
    hero: {
        badge: 'Behind the Scenes · 14 · Learning from Mistakes',
        titleLead: 'Corregiste a la IA.',
        titleHighlight: '¿Qué mejoró de verdad?',
        lede: 'En los capítulos anteriores vimos que una respuesta fluida puede equivocarse, que una fuente reduce las suposiciones, y que la autocomprobación detecta afirmaciones sin respaldo. Ahora hacemos otra pregunta: cuando corriges a la IA, ¿qué mejora en realidad, y cuándo?',
        hook: 'El modelo respondió "El paquete llegará mañana", y tú lo corregiste. ¿El modelo aprendió eso para siempre?',
        chipTry: 'Muévete entre los cuatro niveles de mejora',
        chipCompare: 'Compara qué mejoró frente a qué no',
    },

    // ── Llamadas del mentor (solo texto de la burbuja, sin emoji) ──
    mentor: {
        hero: 'Una corrección no es necesariamente un cambio en el modelo',
        labExplain: 'Dónde ocurre de verdad la mejora',
        misconception: 'Una corrección en la conversación no es entrenamiento',
        lock: 'Separa una mejora en la conversación de un cambio en el modelo',
        practical: 'Corrige de una forma que sirva para actuar',
    },

    // ── Antes del laboratorio (primer) ──
    primer: {
        eyebrow: 'Una corrección en la conversación no siempre es un cambio en el modelo',
        title: 'Antes del laboratorio: ¿qué es aprender de un error?',
        subtitle: 'Mejorar a partir de un error puede ocurrir en varios niveles distintos.',
        lead:
            'Cuando corriges una respuesta de una IA, es fácil pensar que el modelo "aprendió" de eso. Pero mejorar a partir de un error puede ocurrir en varios lugares distintos, y en la mayoría de los casos no ocurre de inmediato a partir de un solo mensaje. Vamos a separar los niveles.',
        points: [
            {
                title: 'Corrección dentro de la conversación',
                body: 'Cuando corriges, la corrección entra en el contexto de la conversación. El modelo puede usarla para redactar una respuesta mejor ahora.',
            },
            {
                title: 'El contexto no es entrenamiento',
                body: 'Usar la corrección en la conversación no es lo mismo que cambiar los pesos del modelo. El contexto ayuda ahora, no cambia el modelo para siempre.',
            },
            {
                title: 'Mejora a nivel de producto',
                body: 'Un sistema puede mejorar sin cambiar el modelo: una instrucción mejor, una fuente más precisa, una regla nueva, o una comprobación que evite el error.',
            },
            {
                title: 'Mejora a nivel de entrenamiento',
                body: 'Los errores que se revisaron y corrigieron pueden entrar en un conjunto de entrenamiento o de ajuste, y aportar a una versión futura. Es un proceso aparte y lento.',
            },
            {
                title: 'Por qué importan los errores que se repiten',
                body: 'Un error se corrige en la conversación. Un error que se repite una y otra vez es un patrón, y conviene corregirlo en el sistema, no solo una vez.',
            },
            {
                title: 'Qué no afirma este capítulo',
                body: 'No toda corrección en el Chat entrena al modelo, el modelo no lo recuerda todo, y esto no describe la política de un producto concreto. Nos quedamos en lo general y en lo conceptual.',
            },
        ],
    },

    // ── Transición See: dos ritmos de mejora ──
    see: {
        title: 'Dos ritmos de mejora',
        steps: ['Error', 'Corrección en la conversación', 'Respuesta corregida ahora', 'Patrón recogido y revisado', 'Mejora futura en el sistema o en el modelo'],
        caption:
            'Dos ritmos distintos: por un lado, una corrección inmediata dentro del contexto, por otro, una mejora lenta a través de cambiar el sistema o entrenar. El primero ayuda ahora, el segundo exige un proceso y una evaluación. Es una ilustración didáctica, no la descripción de un producto concreto.',
    },

    // ── Adivinanza de apertura (OpeningGuess) ──
    guess: {
        eyebrow: 'Adivina rápido · después de corregir',
        title: 'El modelo respondió "El paquete llegará mañana", y tú corregiste: "No hay una fecha de entrega en la fuente". ¿Qué mejoró de verdad ahora?',
        subtitle: 'Elige la interpretación más segura. Aquí no hay nota, hay una dirección que describe lo que pasó de verdad.',
        invite: 'Antes de abrir esto, intenta adivinar qué cambió exactamente en el momento en que corregiste.',
        correctTitle: '¡Exacto!',
        wrongTitle: '¡Casi!',
        getsRightLabel: 'Qué acierta',
        revealButton: 'Revela la idea principal',
        revealTitle: '¿Y qué mejoró de verdad?',
        revealCopy:
            'La corrección entró en el contexto de la conversación, así que el modelo puede corregir la respuesta ahora. Eso no quiere decir que el modelo base haya cambiado para siempre, ni que todos los usuarios reciban a partir de ahora esta respuesta. Un cambio así exige un proceso aparte.',
        cta: 'Veámoslo en el laboratorio',
        resetButton: 'Elegir de nuevo',
        exploreHint: 'También puedes elegir otra opción y ver cómo suena.',

        /** Texto de las cuatro tarjetas de hipótesis, por id de la tarjeta. */
        cards: {
            context: {
                title: 'El modelo puede usar la corrección dentro de la conversación actual',
                desc: 'La corrección ya está en el contexto, así que el modelo puede redactar una respuesta mejor aquí.',
                statusLabel: 'Elegiste bien',
                getsRight: 'Exacto. La corrección forma parte del contexto de la conversación, y por eso ayuda a la respuesta actual.',
                missesLabel: 'Qué queda por ver',
                misses: 'En el laboratorio veremos que la corrección ayuda ahora, pero no se guarda necesariamente en el modelo base para otras conversaciones.',
                bridge: 'Ayuda ahora, no cambia el modelo para siempre.',
            },
            permanent: {
                title: 'El modelo se cambió a sí mismo de forma permanente',
                desc: 'Ahora el modelo "sabe" la corrección y no volverá a equivocarse en ella.',
                statusLabel: 'Error común',
                getsRight: 'Es comprensible pensarlo, porque la respuesta de verdad mejoró ante tus ojos.',
                missesLabel: 'Qué se pierde',
                misses: 'La corrección vive en el contexto de esta conversación. Un cambio permanente del modelo es un proceso aparte, y no ocurre a partir de un solo mensaje.',
                bridge: 'Una mejora en la conversación no es un cambio en el modelo.',
            },
            everyone: {
                title: 'Todos los usuarios recibirán a partir de ahora la respuesta correcta',
                desc: 'Desde que corregiste, todos se benefician de la corrección.',
                statusLabel: 'Otra capa',
                getsRight: 'Es cierto que las correcciones repetidas pueden acabar mejorando el sistema para todos.',
                missesLabel: 'Qué se pierde',
                misses: 'Eso solo ocurre si un equipo recoge el error, cambia el sistema o entrena una versión nueva. No ocurre de forma automática a partir de tu única corrección.',
                bridge: 'Una mejora para todos necesita un proceso, no solo una corrección.',
            },
            nothing: {
                title: 'La corrección no sirve de nada, porque la IA no puede mejorar',
                desc: 'De todas formas el modelo está congelado, así que no tiene sentido corregir.',
                statusLabel: 'Parcialmente cierto',
                getsRight: 'Es cierto que el modelo no aprende de ti en vivo, y los pesos no cambian a partir de un mensaje.',
                missesLabel: 'Qué se pierde',
                misses: 'Pero la corrección sí tiene mucho sentido: mejora la respuesta en la conversación actual, y las correcciones repetidas pueden mejorar el sistema más adelante.',
                bridge: 'No aprende en vivo, pero la corrección sigue siendo importante.',
            },
        },
    },

    // ── Idea "wow" (InsightBox) ──
    insight: {
        title: 'Lo clave del capítulo',
        lead: 'Tu corrección no entra necesariamente en la mente del modelo.',
        body: 'Pero sí puede mejorar la conversación actual, porque está en el contexto. Y cuando muchas correcciones apuntan al mismo problema, pueden ayudar a mejorar el sistema, las comprobaciones, las fuentes, o una versión futura del modelo. Una mejora inmediata y una mejora permanente son dos cosas distintas.',
    },

    // ── Corrección de un error común ──
    misconception: {
        wrongLabel: 'Error común',
        wrongQuote: '"Corregí a la IA, así que ahora lo sabe para siempre."',
        rightLabel: 'Cómo funciona en realidad',
        rightBody: 'La corrección ayudó a la conversación actual porque entró en el contexto. Pero el modelo base no cambió necesariamente, y no recuerda de forma automática la corrección en una conversación nueva. Un cambio permanente exige un proceso aparte: cambiar el sistema, o entrenar una versión nueva con evaluación. Una mejora en la conversación es real, pero no es entrenamiento.',
    },

    // ── Fija la comprensión ──
    lock: {
        title: 'Fija la comprensión',
        question: 'Corregiste al modelo dentro de una conversación: "No escribas que el paquete llegará mañana. No hay una fecha de entrega en la fuente." ¿Cuál es la interpretación más segura?',
        options: [
            'El modelo base lo aprendió para siempre, para todos los usuarios.',
            'La corrección puede ayudar a la conversación actual, porque ahora forma parte del contexto.',
            'La corrección no tiene ningún efecto.',
            'La respuesta queda garantizada como correcta para siempre.',
        ],
        success:
            'Una corrección en el contexto puede mejorar la respuesta en la conversación actual. Una mejora permanente del modelo exige un proceso aparte: cambiar el sistema o entrenar una versión nueva, con evaluación.',
    },

    // ── Idea práctica ──
    practical: {
        title: 'Idea práctica',
        lead:
            'Una buena corrección no es solo "es incorrecto". Una corrección útil le dice al modelo exactamente qué cambiar, para que pueda corregir la respuesta ahora según el contexto. En lugar de "es incorrecto", apunta así:',
        uses: [
            'Di qué está mal: "No es correcto. No hay una fecha de entrega confirmada en la fuente."',
            'Señala la fuente: "La fuente dice que el paquete está retrasado, pero no indica una fecha."',
            'Pide el cambio: "Corrige la respuesta para que se apoye solo en la fuente, y quita la fecha de entrega inventada."',
            'Fija una regla para el resto de la conversación: "A partir de ahora, no añadas una fecha de entrega que no aparezca en la fuente."',
            'Para equipos que construyen sistemas: un error que se repite debe convertirse en un caso de prueba, en una mejora de la instrucción, en una corrección de la fuente o la herramienta, y en una métrica de la evaluación.',
        ],
        caveat:
            'Una corrección en el contexto mejora la conversación actual, pero una mejora permanente del modelo exige un proceso aparte. No supongas que una sola corrección en el Chat cambia el modelo para todos los usuarios.',
    },

    lab: mistakeLearningLab,
    quiz: mistakeLearningQuiz,
};
