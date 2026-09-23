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
        titleLead: 'La misma necesidad, dos formulaciones distintas.',
        titleHighlight: '¿El modelo las recibe igual?',
        lede: 'Cuando escribimos en un chat, sabemos exactamente qué queremos. Pero la misma necesidad se puede formular de varias maneras. En este capítulo compararemos varias formulaciones de la misma petición y veremos si el modelo las recibe todas exactamente igual.',
        question: 'Intenta adivinar antes de comprobarlo: ¿qué llega en realidad al modelo cuando envías un mensaje?',
        chipGuess: 'Adivina qué entra primero',
        chipCompare: 'Compara formulaciones y observa qué cambia',
    },

    // F3 RESPOND (M10): la capa de respuesta humana del capitulo. El estado sigue
    // siendo independiente; aqui solo esta lo que dice el mentor despues, en ambos casos.
    mentorRespond: {
        guessCorrect:
            'Te diste cuenta de que el modelo recibe una sola cosa: lo que realmente se escribió. Por eso un detalle pequeño, como un código de error, cambia tanto: ese dato sí entra, mientras que tu intención se queda contigo.',
        guessWrong:
            'Es una suposición natural, porque con una persona basta una insinuación y la otra parte completa el resto. Aquí hay una diferencia: lo que no se escribió simplemente no llegó. Vale la pena releer las líneas de arriba y preguntarte qué parte de lo que pensabas quedó escrita de verdad.',
        quizPass:
            'Lees una petición y ves también lo que le falta, no solo lo que dice. Ese hábito convierte una petición vaga en una que sí se puede responder.',
        quizFail:
            'La idea no es recordar qué partes tiene una entrada, sino separar lo que escribiste de lo que querías decir. Vuelve al laboratorio de comparación, cambia una sola formulación y observa qué gana el modelo y qué desaparece.',
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
        revealCopy: 'El modelo no recibe tu intención ni la respuesta de antemano. El punto de partida es el texto que escribiste: las palabras, el orden y la puntuación. Lo que no escribiste sigue faltando. A partir del texto y del contexto de la conversación, el modelo infiere la intención. Por eso la misma necesidad, en dos formulaciones, puede darle al modelo material distinto con el cual trabajar.',
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

    // Input Comparison Lab section header (the component itself lives in chapter2Visuals)
    inputLab: {
        eyebrow: 'Input Comparison Lab',
        title: 'Comparar lo que llega al modelo',
        intro: 'La misma petición, varias formulaciones distintas. Cada una le da al modelo material distinto para trabajar.',
    },

    // Visible message versus the full input (post-lab card, closes the chapter-title promise)
    fullInput: {
        title: 'Tu mensaje es parte de la entrada, no necesariamente toda',
        body: 'El mensaje que escribiste es parte de la entrada, pero no siempre toda. Una aplicación de IA puede añadir también instrucciones, partes anteriores de la conversación u otro contexto. Lo que no se escribió ni se adjuntó sigue faltando.',
        seen: 'Lo que ve el usuario',
        added: 'Lo que la aplicación puede añadir',
        total: 'La entrada que se pasa al modelo',
        caveat: 'Esto varía de una aplicación a otra. No es una fórmula fija.',
    },

    // Everyday example
    everyday: {
        title: 'Un momento de la vida real',
        body: 'Cuando le escribes a un amigo "no llegó", él ya sabe de qué hablas, por la conversación, el tono y la historia que tienen juntos. El modelo parte de lo que realmente se le escribe y del contexto que tiene en la conversación. Puede inferir bastante, pero no recibe lo que tienes en la cabeza.',
    },

    // What to take from the chapter
    takeaway: {
        title: 'Qué llevarte de este capítulo',
        points: [
            'La entrada es el texto que se escribió en la práctica, no la intención.',
            'La formulación, el orden y el contexto cambian lo que el modelo tiene para trabajar.',
            'Los detalles faltantes pueden obligar al modelo a adivinar, a preguntar o a responder en términos generales.',
            'Agregar un código de error convierte la solicitud en algo que se puede verificar.',
            'El mensaje que ves es parte de la entrada, y la aplicación puede añadir más.',
            'Una corrección a mitad de la conversación cambia el contexto actual, no lo que el modelo aprendió en el entrenamiento.',
        ],
    },

    // Check Your Understanding (true vs false) + the diagnosis question
    lock: {
        title: 'Comprueba tu comprensión',
        truthLabel: 'Verdadero',
        truthText: 'El modelo parte de lo que realmente se escribió.',
        mistakeLabel: 'Falso',
        mistakeText: 'El modelo recibe mi intención tal cual.',
    },

    // In-page diagnosis question (not part of the chapter quiz / quizData)
    diagnosis: {
        prompt: '¿Mi impresora no funciona?',
        question: 'El usuario escribió este mensaje. ¿Qué recibió realmente el modelo?',
        choosePrompt: 'Elige la respuesta que te parezca correcta y recibirás una breve explicación.',
        options: [
            'Un texto corto con un signo de interrogación, sin una solicitud explícita',
            'El problema completo, con todos los detalles',
            'La intención de abrir un ticket de soporte',
            'La respuesta que debe devolver',
        ],
        explanation: 'El modelo recibió exactamente este texto corto: unas pocas palabras y un signo de interrogación. No contiene ninguna solicitud explícita ni detalles. Todo lo demás es lo que nosotros suponemos, no lo que de verdad entró. Conviene que el modelo no asuma que ya se solicitó una acción específica.',
    },

    quiz: chapter2Quiz,

    // Visuals and lab sub-namespace
    visuals: chapter2Visuals,
};
