// i18n/locales/es/behind-ai/attention.ts
//
// Cadenas del capítulo 6 ("Attention: quién importa ahora") de la lumada interactiva
// "Behind the Scenes of AI". Traducción al español. El hebreo es la fuente de la verdad
// y define la forma del tipo (AttentionDict) que todos los idiomas deben cumplir.
//
// El archivo reúne todo el texto traducible del capítulo: hero, la explicación previa al
// laboratorio, título del laboratorio, el momento wow, un ejemplo cotidiano, corrección de
// un error común, explicación de Q/K/V, el bloqueo de comprensión, la conclusión práctica,
// las llamadas del mentor, la conjetura inicial (guess) y los subespacios sentenceLab
// (laboratorio de la frase) y quiz.
//
// Sin raya larga (U+2014) ni raya media (U+2013).

import type { Locale } from '@/i18n/config';
import { attentionLab } from './attentionLab';
import { attentionQuiz } from './attentionQuiz';

export const attention = {
    // Idioma en el que está escrito el contenido del capítulo.
    contentLocale: 'es' as Locale,

    // El prompt ancla, compartido por el hero, la conjetura y el bloqueo de comprensión.
    prompt: 'El paquete figura como entregado, pero el cliente dice que nunca lo recibió.',

    // ── Hero ──
    hero: {
        badge: 'Behind the Scenes · 06 · Attention',
        titleLead: 'La misma frase,',
        titleHighlight: 'pero no todas las palabras importan igual',
        lede:
            'La frase entera está frente al modelo de una sola vez. Entonces, ¿por qué no atiende a todas las palabras con la misma fuerza? En este capítulo descubriremos cómo el modelo decide, en cada momento, qué partes del contexto le importan ahora. Ese mecanismo se llama Attention.',
        promptEyebrow: 'El prompt del capítulo',
        chipEdit: 'Cambia algo en la frase',
        chipSee: 'y observa hacia dónde se mueve la atención',
        mentorAlt: 'El mentor de la lumada',
    },

    // ── Justo antes del laboratorio ──
    primer: {
        eyebrow: 'Qué es Attention',
        title: 'Justo antes del laboratorio: ¿qué es Attention?',
        lead:
            'Antes de empezar a jugar con la frase, entendamos qué hace en realidad el mecanismo de atención. Cuando el modelo lee una frase, no atiende a todas las palabras con la misma fuerza. En cada momento pondera qué partes del texto se relacionan entre sí ahora, y con cuánta fuerza. Esa es toda la idea de Attention.',
        points: [
            {
                title: 'Relaciones, no una sola palabra importante',
                body: 'La atención no elige una palabra ganadora y se aferra a ella. Para cada parte que procesa se pregunta qué otras partes le importan ahora. Por eso la importancia no es una propiedad fija de una palabra, sino que surge del vínculo entre las partes.',
            },
            {
                title: 'La tensión de nuestra frase',
                body: 'En la frase "El paquete figura como entregado, pero el cliente dice que nunca lo recibió", lo esencial no es una palabra suelta, sino la tensión entre "entregado" y "nunca lo recibió". Ahí la atención debe ser fuerte, porque esa es la contradicción que la respuesta tiene que atender.',
            },
            {
                title: 'Palabras pequeñas que mueven el vínculo',
                body: 'Palabras como "pero", la negación ("no"), las condiciones ("solo si"), las excepciones y los pronombres ("lo") cambian qué vínculos se vuelven importantes. Un cambio pequeño así puede mover por completo el foco de la atención.',
            },
            {
                title: 'Qué no es Attention',
                body: 'La atención no es conciencia ni comprensión humana. El modelo no tiene un momento de "lo entendí". Y tampoco es una verificación de hechos: un peso de atención alto en "entregado" no dice que el paquete se haya entregado de verdad, solo que la palabra es importante para procesar el contexto.',
            },
        ],
    },

    // ── El momento wow ──
    wow: {
        title: 'El punto sorprendente',
        lead: 'La misma frase. El mismo modelo. Pero en cuanto cambias una palabra, otra parte de la frase atrae más peso.',
        body:
            'No hay una sola palabra que sea "la más importante". La importancia no es una propiedad fija de una palabra, sino el resultado de los vínculos dentro de la frase. Y esa es la diferencia entre una lista fija de palabras resaltadas y un mecanismo que pondera relaciones y cambia según lo que esté escrito.',
    },

    // ── Ejemplo cotidiano ──
    everyday: {
        title: 'Un momento de la vida real',
        body:
            'Cuando una persona lee "El paquete figura como entregado, pero el cliente dice que nunca lo recibió", se detiene un instante en el "pero". Esa palabra cambia cómo se lee todo lo que sigue. Es importante recordar: el modelo no se detiene ni entiende como una persona. No tiene un momento de "comprensión". El mecanismo de atención solo le da una forma matemática de ponderar qué partes del texto se relacionan entre sí con más fuerza, y a partir de eso mezclar la información.',
    },

    // ── Corrección de un error común ──
    mistake: {
        wrongTitle: 'Error común',
        wrong:
            '"Attention es cuando el modelo marca las palabras importantes y luego responde según ellas." Según esto, la atención sería una especie de resaltador que marca una sola vez lo que importa.',
        rightTitle: 'Cómo funciona de verdad',
        right:
            'Attention no es un resaltador. Es un mecanismo de relaciones. En cada momento se pregunta, en el fondo: cuando proceso esta parte, ¿qué otras partes del contexto deben influir más en ella? La respuesta cambia según lo que esté escrito en la frase.',
    },

    // ── Explicación suave de Q/K/V ──
    qkv: {
        title: 'Cómo funciona el mecanismo de relaciones, sin fórmulas',
        sub: 'Query · Key · Value',
        body:
            'El mecanismo le da a cada palabra tres papeles, y todos son numéricos, sin conciencia. Query, ¿qué estoy buscando ahora?: cada palabra guarda una marca de lo que le resulta relevante en este momento. Key, ¿qué señal indica que esta información podría encajar?: cada palabra ofrece una señal de coincidencia. Value, ¿qué información se transmite cuando hay coincidencia?: cuando un Query y una Key encajan con fuerza, el Value de esa palabra se transmite y se mezcla. Fíjate en que la Key es la señal de coincidencia, mientras que el Value es la información misma que se entrega. Son dos papeles distintos. Ninguna palabra pregunta de verdad. Son solo nombres de operaciones numéricas que actualizan el significado de cada palabra según el contexto que la rodea, sin matemáticas.',
    },

    // ── Bloqueo de comprensión ──
    lock: {
        title: 'Comprueba tu comprensión',
        trueLabel: 'Verdadero',
        trueText: 'Attention no dice que una palabra sea siempre importante. La importancia cambia según lo que esté escrito en la frase y según los vínculos dentro de ella.',
        falseLabel: 'Falso',
        falseText: '"El modelo marcó las palabras importantes y luego respondió."',
        question: 'Aquí está el prompt otra vez. Cuando el modelo prepara una respuesta prudente, ¿qué vínculo es especialmente importante?',
        options: [
            'El paquete → figura',
            'entregado → nunca lo recibió',
            'el cliente → dice',
            'figura → el cliente',
        ],
        explanationLead: 'El vínculo fuerte es',
        explanationPair: '"entregado" frente a "nunca lo recibió"',
        explanationRest:
            '. Lo esencial no es solo que falte un paquete, sino la contradicción entre lo que el sistema marca y lo que el cliente reporta. Ahí la atención debe ser fuerte para que la respuesta no dé por hecho algo que todavía no se ha comprobado.',
    },

    // ── Conclusión práctica ──
    practical: {
        title: 'Conclusión práctica',
        lead: 'La atención sabe ponderar vínculos dentro de lo que escribiste, pero solo si los vínculos están de verdad ahí.',
        uses: [
            'Si en el prompt hay una condición, una excepción, una contradicción o una negación, escríbelas de forma explícita. Palabras como "pero", "no" y "solo si" son las señales que orientan la atención hacia el vínculo correcto.',
            'Si te importa el vínculo entre dos cosas, ponlas juntas y escribe con claridad a qué se refiere cada pronombre. No confíes en que el modelo "entienda solo" qué se relaciona con qué.',
        ],
        caveat:
            'Y recuerda: un peso de atención alto en una palabra no dice que la información sea correcta. Attention conecta partes de texto entre sí, no verifica hechos en el mundo. Para verificar hace falta una fuente externa o una herramienta.',
    },

    // ── Llamadas del mentor ──
    mentor: {
        hero: 'El modelo elige en qué palabras fijarse',
        lab: 'Cambia una palabra y el peso se mueve',
        lock: 'Entendiste la atención',
        practical: 'Así se escribe un prompt que la atención entiende',
    },

    // ── Conjetura inicial ──
    guess: {
        eyebrow: 'Conjetura rápida · cuatro hipótesis sobre Attention',
        title: '¿Cómo decide el modelo a qué atender ahora?',
        subtitle:
            'Elige la explicación que te parezca más cercana a lo que ocurre cuando el modelo procesa la frase. Esto no es un examen. Elige la hipótesis que te parezca más cercana y enseguida veremos qué revela.',
        invite: 'Aquí hay varias hipótesis tentadoras. Justo antes de la explicación, elijamos una y pongámosla a prueba.',
        getsRightLabel: 'Qué acierta',
        revealButton: 'Revela la idea central',
        resetButton: 'Elige de nuevo',
        revealTitle: 'Entonces, ¿qué pasa de verdad?',
        revealCopy:
            'Attention no busca una sola palabra ganadora ni comprueba qué es cierto en el mundo. Pondera el vínculo entre las partes de la frase. Cuando hay que identificar el problema, "entregado" recibe peso. Cuando hay que identificar la contradicción, el vínculo entre "entregado" y "nunca lo recibió" se vuelve importante. Y en cuanto cambias una palabra en la frase, como quitar el "pero" o invertir la negación, la atención se mueve al instante.',
        cta: 'Veamos cómo se mueve el peso',
        cards: {
            'one-word': {
                title: 'Una sola palabra manda',
                desc: 'El modelo encuentra la palabra más importante de la frase y se aferra a ella durante toda la respuesta.',
                statusLabel: 'Parcialmente cierto',
                getsRight: 'En un momento dado, una palabra como "entregado" o "nunca lo recibió" sí puede recibir mucho peso.',
                missesLabel: 'Qué se le escapa',
                misses: 'Attention no elige una palabra ganadora y se aferra a ella durante toda la respuesta.',
                bridge: 'En otro momento de la respuesta, otro vínculo de la frase puede volverse más importante.',
            },
            'highlight': {
                title: 'Marcar las palabras importantes',
                desc: 'El modelo marca las palabras que destacan y luego construye con ellas la respuesta.',
                statusLabel: 'Error común',
                getsRight: 'Desde fuera, Attention a veces parece un resaltado, así que la hipótesis se entiende.',
                missesLabel: 'Qué se le escapa',
                misses: 'No es un resaltador que marca palabras una sola vez.',
                bridge: 'Pondera vínculos entre partes de la frase: qué influye en qué, y en qué momento.',
            },
            'dynamic': {
                title: 'El peso cambia según el momento',
                desc: 'En cada paso de la respuesta, otra parte de la frase puede influir más en lo que el modelo hace ahora.',
                statusLabel: 'Elegiste bien',
                getsRight: 'Captaste lo esencial. El peso se mueve según el momento y no se queda en una sola palabra.',
                missesLabel: 'Qué queda por ver',
                misses: 'Lo veremos ocurrir sobre nuestra propia frase, momento a momento.',
                bridge: 'En cada momento, otra parte de la frase puede recibir más peso según lo que el modelo procesa ahora.',
            },
            'factcheck': {
                title: 'Verificar hechos en el mundo',
                desc: 'El modelo se centra en las palabras que le ayudarán a comprobar si el paquete se entregó de verdad.',
                statusLabel: 'Importante, pero no es Attention',
                getsRight: 'La distinción es importante. De verdad hay que comprobar si el paquete se entregó.',
                missesLabel: 'Qué se le escapa',
                misses: 'Pero ese no es el trabajo de Attention. No comprueba si algo es cierto en el mundo.',
                bridge: 'Attention puede identificar la tensión entre "entregado" y "nunca lo recibió", pero una verificación real necesita una fuente de información externa o una herramienta.',
            },
        },
    },

    // Subespacios
    sentenceLab: attentionLab,
    quiz: attentionQuiz,
};
