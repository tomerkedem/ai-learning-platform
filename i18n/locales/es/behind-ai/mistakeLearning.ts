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
        titleLead: 'El mismo error vuelve una y otra vez.',
        titleHighlight: '¿Cómo se convierte en una mejora?',
        lede: 'En los capítulos anteriores vimos que una respuesta fluida puede equivocarse, que una fuente reduce las suposiciones, y que la autocomprobación detecta afirmaciones sin respaldo. Ahora hacemos otra pregunta: cuando el mismo error se repite una y otra vez, ¿cómo lo convierte un equipo en una mejora real, y cómo se sabe que la mejora funcionó de verdad?',
        hook: 'El modelo inventa una fecha de entrega que no tiene fuente, una y otra vez. Una corrección ayuda ahora, pero ¿qué tiene que pasar para que ese error se detenga de verdad?',
        chipTry: 'Muévete entre los cuatro niveles de mejora',
        chipCompare: 'Compara qué mejoró frente a qué no',
    },

    // ── Llamadas del mentor (solo texto de la burbuja, sin emoji) ──
    mentor: {
        hero: 'La mejora real es un proceso, no magia',
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
                title: 'El contexto y la memoria no son entrenamiento',
                body: 'Usar la corrección en la conversación no es lo mismo que cambiar los pesos del modelo, y solo ayuda aquí y ahora. La memoria guardada, cuando un producto la admite, conserva información seleccionada para conversaciones posteriores, pero aun así no entrena el modelo en sí. La memoria guardada se trata a fondo más adelante en el curso.',
            },
            {
                title: 'Mejora a nivel de producto',
                body: 'Un sistema puede mejorar sin cambiar el modelo: una instrucción mejor, una fuente más precisa, una regla nueva, o una comprobación que evite el error.',
            },
            {
                title: 'Mejora a nivel de entrenamiento',
                body: 'Los errores que se revisaron y corrigieron pueden entrar en un conjunto de entrenamiento o de ajuste y aportar a una versión futura, en un proceso aparte y lento. El feedback es una entrada, no una verdad garantizada, así que los ejemplos se revisan y el feedback confuso o incorrecto se filtra antes de usarlos.',
            },
            {
                title: 'El proceso solo ve lo que se recogió',
                body: 'El proceso de mejora solo puede trabajar con los ejemplos que se recogieron y se revisaron. Un error que nunca se informó, o que nunca se recogió, sencillamente no llega al proceso. Así que lo que se recoge también determina qué puede intentar mejorar el sistema. Si cierto tipo de problema casi nunca se informa, puede que no se atienda en esta ronda. Eso no significa que el equipo fuera descuidado, ni que el sistema vaya a fallar necesariamente en esos casos.',
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
        steps: ['Se observa un error', 'Se da una corrección', 'La mejora puede ocurrir en varios niveles', 'La evaluación muestra si funcionó'],
        caption:
            'La corrección ayuda de inmediato, pero la mejora real se mide después: el error se recoge y se revisa, la corrección se hace en uno de los niveles, y solo una evaluación muestra si funcionó de verdad. Es una ilustración didáctica, no la descripción de un producto concreto.',
    },

    // ── Adivinanza de apertura (OpeningGuess) ──
    guess: {
        eyebrow: 'Adivina rápido · un error que se repite',
        title: 'El modelo inventa una fecha de entrega que no tiene fuente, y tú lo corriges. ¿Qué hace de verdad esa corrección?',
        subtitle: 'Elige la interpretación más segura. Aquí no hay nota, hay una dirección que describe lo que pasó de verdad.',
        invite: 'Antes de abrir esto, intenta adivinar qué hace exactamente una sola corrección así.',
        correctTitle: '¡Exacto!',
        wrongTitle: '¡Casi!',
        getsRightLabel: 'Qué acierta',
        revealButton: 'Revela la idea principal',
        revealTitle: '¿Y qué lleva de verdad a la mejora?',
        revealCopy:
            'Una corrección ayuda ahora, porque entra en el contexto de la conversación. Pero sobre todo es una señal: si el mismo error se repite, se puede recoger como ejemplo, revisarlo, corregir el sistema o entrenar una versión nueva, y medir con una evaluación si la mejora funcionó de verdad. La mejora real es un proceso, no el resultado de un solo mensaje.',
        cta: 'Veámoslo en el laboratorio',
        resetButton: 'Elegir de nuevo',
        exploreHint: 'También puedes elegir otra opción y ver cómo suena.',

        /** Texto de las cuatro tarjetas de hipótesis, por id de la tarjeta. */
        cards: {
            context: {
                title: 'Ayuda ahora, y además es una señal para mejorar después',
                desc: 'La corrección entra en el contexto, así que el modelo arregla la respuesta aquí. Y si el error se repite, la corrección es una señal sobre la que se puede actuar.',
                statusLabel: 'Elegiste bien',
                getsRight: 'Exacto. La corrección ayuda a la conversación actual, y además es una señal: un error que se repite se puede convertir en una mejora controlada.',
                missesLabel: 'Qué queda por ver',
                misses: 'En el laboratorio veremos cómo una señal así se convierte en un ejemplo, en una revisión, en una corrección del sistema o del entrenamiento, y en una comprobación que mide si la mejora funcionó.',
                bridge: 'Ayuda ahora, y es una señal para una mejora controlada después.',
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
        lead: 'Una corrección aislada es una señal, no una actualización del modelo.',
        body: 'Ayuda a la conversación actual, pero la mejora real empieza cuando muchas correcciones apuntan al mismo problema. Entonces se pueden recoger como ejemplos, revisar, cambiar una instrucción, una fuente, una regla, una comprobación o el entrenamiento, y medir con una evaluación si mejoramos de verdad. La mejora es un proceso controlado, no magia que ocurre por un solo mensaje.',
    },

    // ── Corrección de un error común ──
    misconception: {
        wrongLabel: 'Error común',
        wrongQuote: '"Corregí a la IA una vez, así que el sistema ya mejoró."',
        rightLabel: 'Cómo funciona en realidad',
        rightBody: 'Una corrección aislada ayuda a la conversación actual, y es una señal a la que conviene prestar atención. Pero mejorar el sistema exige un proceso aparte: recoger el error como ejemplo, revisarlo, cambiar una instrucción, una fuente, una regla, una comprobación o el entrenamiento, y medir con una evaluación que el cambio ayudó de verdad y no rompió otra cosa. Sin medición, "mejoramos" es una esperanza, no conocimiento.',
    },

    // ── Fija la comprensión ──
    lock: {
        title: 'Comprueba tu comprensión',
        question: 'El mismo error ("El paquete llegará mañana" sin fuente) se repite con muchos usuarios. ¿Qué es lo correcto para que mejore de verdad?',
        options: [
            'La corrección de un solo usuario ya cambió el modelo para todos los usuarios.',
            'Recoger el error como ejemplo, revisar, corregir en el sistema o en el entrenamiento, y medir con una evaluación antes de publicar.',
            'Esperar a que el modelo se corrija solo con el tiempo.',
            'No hay nada que hacer, porque el modelo está congelado y no puede mejorar en absoluto.',
        ],
        success:
            'Un error que se repite es una señal. La mejora real es un proceso controlado: se recogen ejemplos, se revisan, se corrige el sistema o se entrena una versión nueva, y se mide con una evaluación que el cambio ayudó de verdad. Una corrección en la conversación ayuda ahora, pero no sustituye al proceso.',
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
