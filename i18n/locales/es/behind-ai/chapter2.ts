// i18n/locales/es/behind-ai/chapter2.ts
// Spanish Chapter 2 ("The model receives what you wrote, not your intent").
// Shape source: ../../he/behind-ai/chapter2 (Hebrew is canonical).
//
// Real translation. No em dash (U+2014), no en dash (U+2013). Mentor bubble text
// carries no emoji. "Chat" and "Agent" are kept as fixed product-style terms.

import type { Locale } from '@/i18n/config';
import { chapter2Visuals } from './chapter2Visuals';
import { chapter2Quiz } from './chapter2Quiz';

export const chapter2 = {
    contentLocale: 'es' as Locale,

    // Hero
    hero: {
        badge: 'Behind the Scenes · 02',
        titleLead: 'El modelo no recibe tu intención.',
        titleHighlight: 'Recibe lo que escribiste.',
        lede: 'Cuando escribimos en un chat, es fácil suponer que el modelo simplemente entiende lo que quisimos decir. Pero antes de cualquier comprensión, lo que entra es el texto en sí: las palabras, el orden, la puntuación y lo que quedó sin decir. En este capítulo veremos cómo una misma intención, formulada de otra manera, le da al modelo material distinto con el cual trabajar.',
        question: 'Si mi intención me resulta clara, ¿por qué sigue importando la forma de redactarla?',
        chipGuess: 'Adivina qué entra primero',
        chipCompare: 'Compara formulaciones y observa qué cambia',
    },

    // Mentor speech bubbles (text only; pose and placement are structural in the page)
    mentor: {
        hero: 'Empecemos por lo que realmente se escribió',
        lab: 'La misma necesidad, material distinto',
        lock: 'Fijaste la idea',
    },

    // Opening guess (DiscoveryGuess): text only; poses and target are structural in the page
    guess: {
        eyebrow: 'Adivinanza rápida · qué entra al modelo',
        title: '¿Qué recibe el modelo realmente primero, en el momento en que envías un mensaje?',
        subtitle: 'Elige la explicación que te parezca más cercana. Esto no es un examen, pero hay una dirección que nos acerca a lo que de verdad sucede.',
        invite: 'Antes de abrir esto, intenta adivinar: ¿qué llega al modelo primero en realidad?',
        correctTitle: '¡Exacto!',
        wrongTitle: '¡Casi!',
        getsRightLabel: 'Qué acierta esta opción',
        revealButton: 'Revela la idea central',
        revealTitle: 'Entonces, ¿qué entra realmente?',
        revealCopy: 'El modelo no recibe tu intención ni la respuesta de antemano. El punto de partida es el texto que escribiste: las palabras, el orden, la puntuación y lo que quedó sin decir. A partir de ahí empieza a inferir. Por eso la misma intención, en dos formulaciones, puede darle al modelo material distinto con el cual trabajar.',
        cta: 'Comparemos algunas formulaciones',
        resetButton: 'Elegir de nuevo',
        exploreHint: 'También puedes elegir otra opción y ver cómo suena.',
        cards: [
            {
                title: 'Mi intención',
                desc: 'El modelo entiende directamente lo que yo quería, incluso antes de las palabras.',
                statusLabel: 'Error común',
                getsRight: 'Es la sensación natural, porque entre personas de verdad adivinamos la intención.',
                missesLabel: 'Qué pasa por alto',
                misses: 'El modelo no recibe la intención como entrada. Recibe el texto e intenta inferir a partir de él.',
                bridge: 'Por eso el mismo deseo, formulado de otra manera, puede llevar a otra cosa.',
            },
            {
                title: 'El texto tal como se escribió',
                desc: 'Las palabras, el orden y la puntuación que escribí, exactamente como están.',
                statusLabel: 'Elegiste bien',
                getsRight: 'Exacto. El punto de partida es el texto en sí, con todo lo que contiene y todo lo que no.',
                missesLabel: 'Qué queda por ver',
                misses: 'Veremos cómo un pequeño cambio en la formulación cambia el material que recibe el modelo.',
                bridge: 'Todo lo que sucede después parte de este texto.',
            },
            {
                title: 'La respuesta que debe dar',
                desc: 'El modelo ya sabe a dónde llegar, y solo lo formula de forma elegante.',
                statusLabel: 'No es esta etapa',
                getsRight: 'Es cierto que al final habrá una respuesta.',
                missesLabel: 'Qué pasa por alto',
                misses: 'Pero la respuesta se construye después, no es algo que el modelo reciba al principio.',
                bridge: 'Al principio solo está la entrada, y la respuesta se construye a partir de ella paso a paso.',
            },
            {
                title: 'Solo las palabras importantes',
                desc: 'El modelo filtra de antemano y conserva lo que importa.',
                statusLabel: 'Parcialmente correcto',
                getsRight: 'Es cierto que no toda palabra pesará igual más adelante.',
                missesLabel: 'Qué pasa por alto',
                misses: 'Pero en la etapa de entrada entra todo el texto, no solo partes seleccionadas. La ponderación de la importancia ocurre después.',
                bridge: 'Primero entra todo, y solo después se decide en qué fijarse.',
            },
        ],
    },

    // The wow moment (InsightBox)
    insight: {
        title: '¿Qué recibe realmente el modelo de ti?',
        lead: 'El modelo no sabe qué quisiste decir. Solo recibe el texto que escribiste.',
        body: 'Las palabras que elegiste, su orden, la puntuación y lo que dejaste fuera son todo lo que el modelo tiene para trabajar. La misma intención, formulada de otra manera, entra al modelo como materia prima distinta. Por eso tu formulación no es un adorno, es la entrada misma.',
    },

    // Input Comparison Lab section header (the component itself lives in chapter2Visuals)
    inputLab: {
        eyebrow: 'Input Comparison Lab',
        title: 'Comparar lo que llega al modelo',
        intro: 'La misma necesidad, cinco formulaciones. Elige una y observa qué llega realmente al modelo: qué es explícito, qué falta, qué cambió y hacia dónde se inclina. El objetivo es ver que la entrada en sí ya decide mucho, antes de que comience cualquier procesamiento más profundo.',
    },

    // Everyday example
    everyday: {
        title: 'Un momento de la vida real',
        body: 'Cuando le escribes a un amigo "no llegó", él ya sabe de qué hablas, por la conversación, el tono y la historia que tienen juntos. El modelo parte de lo que realmente se le escribe y del contexto que tiene en la conversación. Puede inferir bastante, pero no recibe lo que tienes en la cabeza.',
    },

    // Correcting a common mistake (two cards)
    mistake: {
        wrongLabel: 'Error común',
        wrongText: '"El modelo sabe lo que quise decir."',
        rightLabel: 'Cómo funciona en realidad',
        rightText: 'El modelo puede inferir la intención a partir del texto y el contexto, pero no recibe la intención en sí como entrada directa.',
    },

    // What to take from the chapter
    takeaway: {
        title: 'Qué llevarte de este capítulo',
        points: [
            'La entrada es el texto que se escribió en la práctica, no la intención.',
            'La formulación, el orden y el contexto cambian lo que el modelo tiene para trabajar.',
            'Los detalles faltantes pueden obligar al modelo a adivinar, a preguntar o a responder en términos generales.',
            'Agregar un número de seguimiento convierte la solicitud en algo que se puede verificar.',
            'Una solicitud explícita de acción eleva el riesgo y puede desplazar el comportamiento hacia Agent.',
            'Una corrección a mitad de la conversación cambia el contexto actual, no lo que el modelo aprendió en el entrenamiento.',
        ],
    },

    // Lock in the idea (true vs false) + the diagnosis question
    lock: {
        title: 'Fijar la idea',
        truthLabel: 'Verdadero',
        truthText: 'El modelo parte de lo que realmente se escribió.',
        mistakeLabel: 'Falso',
        mistakeText: 'El modelo recibe mi intención tal cual.',
    },

    // In-page diagnosis question (not part of the chapter quiz / quizData)
    diagnosis: {
        prompt: '¿No llegó mi paquete?',
        question: 'El usuario escribió este mensaje. ¿Qué recibió realmente el modelo?',
        options: [
            'El problema completo, con todos los detalles',
            'Un texto corto con un signo de interrogación, sin una solicitud explícita',
            'La intención de abrir un ticket de soporte',
            'La respuesta que debe devolver',
        ],
        explanation: 'El modelo recibió exactamente este texto corto: unas pocas palabras y un signo de interrogación. No contiene ninguna solicitud explícita ni detalles. Todo lo demás es lo que nosotros suponemos, no lo que de verdad entró. Conviene que el modelo no asuma que ya se solicitó una acción específica.',
    },

    quiz: chapter2Quiz,

    // Visuals and lab sub-namespace
    visuals: chapter2Visuals,
};
