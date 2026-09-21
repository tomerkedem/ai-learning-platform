// i18n/locales/es/behind-ai/chapter3.ts
// Spanish Chapter 3 ("Tokenización: cuando el texto se divide en tokens").
// Shape source: ../../he/behind-ai/chapter3 (Hebrew is canonical).
//
// Real translation, natural educational Spanish (not literal). Phone-first and
// TTS-ready: short sentences, no dense paragraphs. Examples must preserve the
// tokenization behavior each exercise teaches. Stable terms kept: token, modelo, prompt, contexto. No em dash
// (U+2014) and no en dash (U+2013). Mentor bubble text carries no emoji.
//
// The lab strings (TokenizationLab and friends) come from labContent, so they are
// not repeated here.

import type { Locale } from '@/i18n/config';
import { chapter3Quiz } from './chapter3Quiz';

export const chapter3 = {
    contentLocale: 'es' as Locale,

    hero: {
        badge: 'Behind the Scenes · 03',
        titleLead: 'Tu frase no entra como un solo bloque.',
        titleHighlight: 'Se divide en unidades.',
        lede: 'Lo que para nosotros parece una frase entera entra al modelo como una secuencia de unidades de trabajo. Antes de calcular cualquier significado, el texto se corta en piezas pequeñas llamadas tokens.',
        question: 'Si para mí es una sola frase, ¿por qué el modelo ve varias unidades?',
        chipGuess: 'Adivina qué le pasa primero al texto',
        chipTouch: 'Escribe y mira cómo se corta la frase',
    },

    // F3 RESPOND (M10): la capa de respuesta humana del capitulo. El estado sigue
    // siendo independiente; aqui solo esta lo que dice el mentor despues, en ambos casos.
    mentorRespond: {
        guessCorrect:
            'Viste que la división ocurre antes de la comprensión, no después. Por eso cosas que a nosotros nos parecen idénticas, como un cambio de puntuación o un número de seguimiento, pueden verse muy distintas para el modelo.',
        guessWrong:
            'Un error razonable, porque cuando leemos una frase la percibimos como un todo y no como piezas. Para el modelo el orden es el inverso: primero el corte en unidades y solo después el significado. Vale la pena mirar de nuevo las líneas de arriba y preguntarte qué se corta antes que qué.',
        quizPass:
            'Miras un texto y ya te preguntas en cuántas unidades se dividirá. Esa mirada explica por qué contar palabras no es contar tokens, y por qué un idioma cuesta más que otro.',
        quizFail:
            'La idea no es recordar cómo se corta cada palabra, sino que el corte ocurre antes que todo lo demás. Vuelve al laboratorio de tokens, escribe la misma frase de dos maneras y observa dónde se mueven los límites de las unidades.',
    },

    guess: {
        eyebrow: 'Adivinanza rápida · qué le pasa al texto',
        title: '¿Qué le pasa al texto justo después de enviarlo, antes de calcular cualquier significado?',
        subtitle: 'Elige la explicación que te parezca más cercana. No es un examen, pero hay una dirección que nos acerca a lo que de verdad pasa.',
        invite: 'Antes de abrir esto, intenta adivinar: ¿qué es lo primero que le pasa al texto?',
        correctTitle: '¡Exacto!',
        wrongTitle: '¡Casi!',
        getsRightLabel: 'Qué acierta esto',
        revealButton: 'Revelar la idea principal',
        revealTitle: 'Entonces, ¿qué pasa de verdad?',
        revealCopy:
            'La frase que escribiste no entra al modelo como un solo bloque. Se divide en unidades de trabajo llamadas tokens. Un token puede ser una palabra, parte de una palabra, un signo de puntuación o un número, según el tokenizador. Todo el procesamiento empieza desde estas unidades.',
        cta: 'Veamos cómo se divide una frase',
        resetButton: 'Elegir de nuevo',
        exploreHint: 'También puedes elegir otra opción y ver cómo suena.',
        cards: {
            'as-is': {
                title: 'El texto entra tal cual',
                desc: 'El modelo recibe la frase entera y empieza a entenderla de inmediato.',
                statusLabel: 'Error común',
                getsRight: 'Es natural pensarlo, porque así leemos una frase.',
                missesLabel: 'Qué se le escapa',
                misses: 'Pero antes de cualquier comprensión, la frase se divide en unidades más pequeñas. El modelo no parte de la frase entera.',
                bridge: 'Esta división es el punto de entrada de todo lo que viene después.',
            },
            tokens: {
                title: 'El texto se divide en unidades (tokens)',
                desc: 'La frase se rompe en piezas pequeñas, y solo desde ellas empieza el procesamiento.',
                statusLabel: 'Elegiste bien',
                getsRight: 'Exacto. El primer paso es dividir en tokens, antes de calcular cualquier significado.',
                missesLabel: 'Qué queda por ver',
                misses: 'Veremos que un token no siempre es una palabra entera, y que la puntuación, los números y los espacios cambian la división.',
                bridge: 'Todo lo que sigue se construye a partir de estas unidades.',
            },
            meaning: {
                title: 'El modelo salta directo al significado',
                desc: 'El modelo capta la intención antes de hacer nada con las palabras.',
                statusLabel: 'No es este paso',
                getsRight: 'Es cierto que al final se construye el significado.',
                missesLabel: 'Qué se le escapa',
                misses: 'Pero el significado llega después de la división, no como primer paso. Primero hacen falta unidades con las que trabajar.',
                bridge: 'El significado se construye sobre los tokens, no en su lugar.',
            },
            important: {
                title: 'Solo se guardan las palabras importantes',
                desc: 'El modelo filtra de antemano y se queda con lo que importa.',
                statusLabel: 'En parte cierto',
                getsRight: 'Es cierto que no toda unidad pesará igual más adelante.',
                missesLabel: 'Qué se le escapa',
                misses: 'Pero en la fase de división todo el texto se vuelve unidades, no se descarta nada. Sopesar la importancia ocurre mucho después.',
                bridge: 'Primero todo se vuelve unidades, y solo después el modelo decide en qué fijarse.',
            },
        },
    },

    insight: {
        title: '¿Qué hace realmente el modelo con tu texto?',
        lead: 'Antes que nada, el modelo corta el texto en piezas pequeñas llamadas tokens.',
        body: 'Un token es a veces una palabra entera, a veces solo parte de una palabra, y a veces un signo o un espacio. El modelo no lee una frase como nosotros, trabaja sobre esa secuencia de piezas y solo sobre ella. Esta es la primera conversión del texto en algo que se puede contar, y todavía no es comprensión.',
    },

    lab: {
        eyebrow: 'Tokenization Lab',
        title: 'Divide una frase en tokens',
        intro: 'Elige un experimento rápido o escribe tu propia frase, por ejemplo "Mi paquete no llegó". Fíjate en qué cambia cuando añades un signo de exclamación, un número de seguimiento, quitas los espacios o cambias de idioma. Cada unidad recibe un color, y la puntuación y los números cuentan como unidades propias.',
    },

    lock: {
        title: 'Comprueba tu comprensión',
        truthLabel: 'Verdadero',
        truthText: 'La frase se divide en unidades antes de cualquier procesamiento profundo.',
        mistakeLabel: 'Falso',
        mistakeText: 'La frase entra al modelo como un solo bloque, y el modelo la lee como nosotros.',
        question: '¿Qué cambio en el texto puede afectar la tokenización?',
        options: [
            'Añadir puntuación, como signos de exclamación',
            'Añadir un número, como un número de seguimiento',
            'Quitar los espacios entre palabras',
            'Cambiar de un idioma a otro',
            'Todas las anteriores',
        ],
        explanationCorrect:
            'Correcto. La puntuación, los números, los espacios y el idioma en que escribimos cambian cómo se divide el texto en tokens. La división es sensible a cómo escribimos, no solo al significado.',
        explanationWrong:
            'Eso sí influye, pero no es la respuesta completa. La puntuación, los números, quitar los espacios y cambiar de idioma cambian la división. La opción precisa es que todas las anteriores son correctas.',
    },

    practical: {
        title: 'Conclusión práctica',
        intro: 'La tokenización afecta directamente a cómo conviene escribir al modelo:',
        points: [
            'Una palabra no siempre es un token, así que no midas el largo ni el costo por el número de palabras.',
            'La misma petición puede volverse un número distinto de unidades según la puntuación, los números, los espacios y el idioma. Una redacción limpia tiende a ahorrar unidades.',
            'Cuando importan el largo, el costo o la ventana de contexto, por ejemplo en un hilo largo sobre un paquete que no llegó, piensa en unidades, no en palabras.',
            'Una división limpia no significa que el modelo haya entendido. Es solo la primera conversión antes de cualquier procesamiento.',
        ],
    },

    quiz: chapter3Quiz,
};
