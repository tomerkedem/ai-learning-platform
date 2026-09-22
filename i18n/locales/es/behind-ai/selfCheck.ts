// i18n/locales/es/behind-ai/selfCheck.ts
//
// Cadenas en español (es, LTR) del capítulo Self-Check (capítulo 13, "la autocomprobación al
// responder") del curso "Behind the Scenes of AI". El hebreo es la fuente de la verdad y define
// el tipo (SelfCheckDict).
//
// La idea: una buena respuesta no solo se escribe, se comprueba. La autocomprobación es un paso
// visible después del borrador, que compara cada afirmación con la pregunta y la fuente antes de
// que la respuesta salga. Ayuda, pero no garantiza la verdad ni verifica hechos que no están en
// la fuente. La comprobación es visible, sin revelar pensamientos internos.
//
// Traducción de primera pasada, pendiente de revisión por un hablante nativo.
//
// Sin raya (U+2014) ni guion largo (U+2013), sin referencias a años.

import type { Locale } from '@/i18n/config';
import { selfCheckLab } from './selfCheckLab';
import { selfCheckQuiz } from './selfCheckQuiz';

export const selfCheck = {
    contentLocale: 'es' as Locale,

    hero: {
        badge: 'Behind the Scenes · 13 · Self-Check',
        titleLead: 'Una buena respuesta',
        titleHighlight: 'se comprueba a sí misma',
        lede: 'En el capítulo anterior conectamos la respuesta a una fuente. Pero incluso cuando hay una fuente, el modelo sigue redactando la respuesta por su cuenta, y puede decir más de lo que la fuente dice. La autocomprobación es un paso antes del final: se toma el borrador y se compara con la pregunta y con la fuente, antes de que salga al cliente.',
        hook: 'El modelo escribió "La biblioteca abre de 10:00 a 14:00 en el feriado". ¿Qué debe pasar antes de que esta respuesta salga?',
        chipTry: 'Muévete entre los borradores',
        chipCompare: 'Compara una afirmación con respaldo y una inventada',
    },

    // F3 RESPOND (M9): la capa de respuesta humana del capitulo. El estado sigue
    // siendo independiente; aqui solo esta lo que dice el mentor despues, en ambos casos.
    mentorRespond: {
        guessCorrect:
            'Elegiste revisar el borrador en vez de mejorar cómo suena. Esa separación es todo el capítulo: una buena redacción y una afirmación respaldada son dos cosas completamente distintas.',
        guessWrong:
            'El paso que elegiste atiende la calidad de la escritura, y esa es una consideración real. El problema de este borrador está en otro sitio. Vale la pena volver a la fuente y marcar qué dato de la respuesta aparece allí y cuál no.',
        quizPass:
            'Estás contrastando una afirmación con una fuente y no con una impresión. Ese es justo el trabajo que separa una respuesta que se puede enviar de una que solo suena bien.',
        quizFail:
            'Es fácil leer una respuesta entera y pasar por alto el único dato que no tiene respaldo. Vuelve al laboratorio, toma un borrador y marca cada afirmación por separado contra la fuente.',
    },

    primer: {
        eyebrow: 'Una buena respuesta no solo se escribe, se comprueba',
        title: 'Antes del laboratorio: ¿qué es la autocomprobación?',
        subtitle: 'No basta con redactar una respuesta. Hay que comprobar qué entra en ella.',
        lead:
            'El modelo no solo genera una respuesta. También se le puede pedir que la compruebe: tomar el borrador, comparar cada afirmación con la pregunta y la fuente, y corregir antes de enviarlo. Es una comprobación visible y práctica, no un vistazo a pensamientos internos.',
        points: [
            {
                title: 'Qué es la autocomprobación',
                body: 'Un paso visible después del borrador. En lugar de enviar de inmediato, el modelo repasa la respuesta y se pregunta si es fiel a la pregunta y a la fuente. Esto es distinto de "volver a preguntar": otra respuesta es una nueva redacción, no una comprobación del borrador ya existente.',
            },
            {
                title: 'Qué comprueba',
                body: 'Si la respuesta contesta a la pregunta, si cada afirmación se apoya en la fuente, si se contradice a sí misma, si inventa información que falta, si el nivel de confianza es adecuado, y si se dice con claridad lo que no se sabe.',
            },
            {
                title: 'Por qué esto importa después de una fuente',
                body: 'Incluso cuando hay una fuente en el contexto, la respuesta todavía la redacta el modelo y puede ir más allá de lo que la fuente dice. La comprobación detecta justamente esa desviación.',
            },
            {
                title: 'Qué puede hacer la autocomprobación',
                body: 'Señalar una afirmación sin respaldo, indicar una fecha o un detalle inventado, detectar una contradicción con la fuente, recomendar una corrección, y mejorar la cautela y la estructura.',
            },
            {
                title: 'Qué no puede hacer',
                body: 'Garantizar la verdad, verificar hechos que no están en la fuente, sustituir una comprobación real en el sistema, o demostrar que una fuente equivocada es correcta.',
            },
            {
                title: 'El límite de este capítulo',
                body: 'Aquí hablamos de una comprobación visible: una lista de control, la comparación con la fuente, y la verificación de afirmaciones. No le pedimos al modelo que revele pensamientos internos ni una cadena de razonamiento oculta.',
            },
        ],
    },

    see: {
        title: 'Cómo funciona la autocomprobación, paso a paso',
        steps: ['Borrador de respuesta', 'Criterios explícitos', 'Detectar debilidades', 'Corrección interna', 'Comprobación externa cuando hace falta'],
        caption:
            'Primero escribes un borrador, y luego lo pasas por criterios claros: ¿respondió a la pregunta, se contradice a sí mismo, falta algo, y cada afirmación tiene respaldo? Lo que se puede corregir se corrige en el momento. Lo que necesita evidencia de hechos y no tiene fuente pasa a una comprobación externa, y el vacío se dice de forma explícita. No todo problema se resuelve con la autocomprobación. Esta es una ilustración didáctica, no la comprobación de un sistema real.',
    },

    guess: {
        eyebrow: 'Adivina rápido · antes de que la respuesta salga',
        title: 'El modelo redactó: "La biblioteca abre de 10:00 a 14:00 en el feriado". ¿Qué debe pasar ahora?',
        subtitle: 'En la fuente solo pone: horario regular de 09:00 a 18:00, horario de feriado no disponible. Elige el paso correcto. Aquí no hay nota, hay una dirección que describe una buena comprobación.',
        invite: 'Antes de abrir esto, intenta adivinar qué debe pasarle al borrador antes de enviarlo.',
        correctTitle: '¡Exacto!',
        wrongTitle: '¡Casi!',
        getsRightLabel: 'Qué acierta',
        revealButton: 'Revela la idea principal',
        revealTitle: '¿Y qué debe pasar en realidad?',
        revealCopy:
            'Antes de que la respuesta salga, se comprueba: qué partes se apoyan en la fuente y cuáles no. "De 09:00 a 18:00" tiene respaldo, "de 10:00 a 14:00" no, porque la fuente no da un horario de feriado. La afirmación sin respaldo se quita, y el vacío se dice de forma explícita.',
        cta: 'Veámoslo en el laboratorio',
        resetButton: 'Elegir de nuevo',
        exploreHint: 'También puedes elegir otra opción y ver cómo suena.',

        cards: {
            check: {
                title: 'Comprobar qué partes se apoyan en la fuente y cuáles no',
                desc: 'Repasar el borrador, y separar una afirmación con respaldo de una que no tiene fuente.',
                statusLabel: 'Elegiste bien',
                getsRight: 'Exacto. La autocomprobación compara cada afirmación con la fuente, y señala lo que no tiene respaldo.',
                missesLabel: 'Qué queda por ver',
                misses: 'En el laboratorio veremos cómo "de 10:00 a 14:00" se señala, se quita, y la respuesta indica que el horario de feriado no está disponible en la fuente.',
                bridge: 'Se comprueba antes de enviar.',
            },
            send: {
                title: 'Enviarla, porque la respuesta suena servicial',
                desc: 'La redacción es segura y agradable, así que se puede pasar tal cual.',
                statusLabel: 'Error común',
                getsRight: 'Es comprensible pensarlo, porque la respuesta suena de verdad bien.',
                missesLabel: 'Qué se pierde',
                misses: '"Suena bien" no es "tiene respaldo en la fuente". "De 10:00 a 14:00" suena servicial, pero ningún dato lo respalda.',
                bridge: 'La fluidez no es respaldo.',
            },
            add: {
                title: 'Añadir más detalles para que suene profesional',
                desc: 'Más información hará que la respuesta parezca más seria y completa.',
                statusLabel: 'Otra capa',
                getsRight: 'Es cierto que una respuesta completa a veces ayuda al cliente.',
                missesLabel: 'Qué se pierde',
                misses: 'Añadir detalles sin fuente solo aumenta el riesgo de inventar. El problema aquí no es la falta de detalles, sino un detalle sin respaldo.',
                bridge: 'Más detalles no son más fundamento.',
            },
            replace: {
                title: 'Cambiarla por una respuesta corta sin comprobar',
                desc: 'Simplemente acortarlo todo, y será más seguro.',
                statusLabel: 'Parcialmente cierto',
                getsRight: 'Es cierto que una respuesta corta y cauta es mejor que una suposición segura.',
                missesLabel: 'Qué se pierde',
                misses: 'Pero acortar sin comprobar puede tirar también "de 09:00 a 18:00", que sí tiene respaldo. El objetivo es comprobar, no solo acortar.',
                bridge: 'Comprobar, no solo recortar.',
            },
        },
    },

    insight: {
        title: 'Lo clave que hay que entender aquí',
        lead: 'La comprobación no pregunta "¿suena bien la respuesta?".',
        body: 'Pregunta otra cosa: qué afirmación tiene aquí de verdad respaldo, cuál se añadió sin fuente, y qué hay que borrar, suavizar o señalar como ausente. Una respuesta corregida puede ser menos impresionante, y más correcta.',
    },

    analogy: {
        title: 'Un momento de la vida real',
        body: 'Un buen editor no publica un artículo solo porque esté bien escrito. Va frase por frase y se pregunta de dónde sale cada dato. Si una frase no tiene fuente, la marca antes de publicar. La autocomprobación hace exactamente eso con el modelo: lee el borrador otra vez, y señala lo que no tiene en qué apoyarse.',
    },

    misconception: {
        wrongLabel: 'Error común',
        wrongQuote: '"Si el modelo se comprueba a sí mismo, se puede confiar en que la respuesta es correcta."',
        rightLabel: 'Cómo funciona en realidad',
        rightBody: 'La autocomprobación compara la respuesta con la fuente y con la petición, no con el mundo. Detecta una afirmación sin respaldo en la fuente, pero no puede verificar un hecho que la fuente ni siquiera contiene. Si la fuente está equivocada o incompleta, incluso una respuesta que pasó la comprobación puede fallar. Y es importante recordar: la propia comprobación la escribe el mismo modelo, no una parte independiente, así que puede compartir los mismos puntos ciegos e incluso repetir el mismo error que se supone que debe atrapar. La comprobación es un paso de control útil, no una garantía de verdad.',
    },

    lock: {
        title: 'Comprueba tu comprensión',
        question: 'La fuente dice: horario regular de 09:00 a 18:00, horario de feriado no disponible. El borrador: "La biblioteca abre de 09:00 a 18:00 en días regulares, y de 10:00 a 14:00 en el feriado." ¿Qué parte debe señalar la comprobación?',
        options: [
            '"Abre de 09:00 a 18:00 en días regulares", porque aparece en la fuente.',
            '"Abre de 10:00 a 14:00 en el feriado", porque la fuente no da un horario de feriado.',
            'Toda la respuesta, porque la IA no debería responder.',
            'Nada, porque la respuesta suena segura.',
        ],
        success:
            'La autocomprobación separa una afirmación con respaldo de una sin respaldo. "De 09:00 a 18:00" tiene respaldo en la fuente y se mantiene, "de 10:00 a 14:00" no está en la fuente y por eso se señala. La respuesta corregida quita el horario de feriado inventado e indica que el horario de feriado no está disponible en la fuente.',
    },

    practical: {
        title: 'Idea práctica',
        lead:
            'Para una respuesta importante, no pidas solo "responde al cliente". Pídele al modelo que compruebe la respuesta frente a la fuente antes de darla por definitiva. En lugar de "responde al cliente", apunta así:',
        uses: [
            'Pide una comprobación frente a la fuente: "Redacta una respuesta basándote solo en la fuente, y luego comprueba si contiene alguna afirmación que no aparezca en la fuente."',
            'Trabaja en tres pasos: "Escribe un borrador corto, comprueba cada afirmación frente a la fuente, y devuelve solo la respuesta corregida."',
            'Pide que señale los vacíos: "Si falta información, dilo de forma explícita y no la inventes."',
            'Conserva las afirmaciones con respaldo: "No borres un detalle que sí aparece en la fuente solo por acortar."',
            'Quédate en lo visible: "Pide una lista de control y una respuesta corregida, no pensamientos internos."',
        ],
        caveat:
            'La autocomprobación mejora la calidad de la respuesta, pero no garantiza la verdad ni verifica hechos que no están en la fuente. Es un paso de control útil: un borrador, la comparación con la fuente, y una respuesta corregida que es honesta sobre lo que no se sabe. Una regla sencilla: usa la autocomprobación para la estructura, la completitud, la coherencia y para señalar afirmaciones sin respaldo. Cuando la exactitud de los hechos es crítica y la evidencia falta o es incierta, recurre a una fuente fiable, una herramienta o una persona. La comprobación sigue ayudando antes, pero no sustituye a la verificación.',
    },

    lab: selfCheckLab,
    quiz: selfCheckQuiz,
};
