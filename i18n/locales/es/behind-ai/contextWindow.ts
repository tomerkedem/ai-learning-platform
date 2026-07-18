// i18n/locales/es/behind-ai/contextWindow.ts
//
// Cadenas del capítulo 7 ("Context Window: qué ve realmente el modelo ahora") de la
// lumada interactiva "Behind the Scenes of AI". Traducción al español. El hebreo es la
// fuente de la verdad y define la forma del tipo (ContextWindowDict) que todos los
// idiomas deben cumplir.
//
// El archivo reúne todo el texto traducible del capítulo: hero, la explicación previa al
// laboratorio, el momento wow, un ejemplo cotidiano, la corrección de un error común, la
// explicación de cómo funciona la ventana, el bloqueo de comprensión, la conclusión
// práctica, las llamadas del mentor, la conjetura inicial (guess), y los subespacios lab
// (laboratorio de la ventana de contexto) y quiz.
//
// Sin raya larga (U+2014) ni raya media (U+2013).

import type { Locale } from '@/i18n/config';
import { contextWindowLab } from './contextWindowLab';
import { contextWindowQuiz } from './contextWindowQuiz';

export const contextWindow = {
    // Idioma en el que está escrito el contenido del capítulo.
    contentLocale: 'es' as Locale,

    // La pregunta ancla, compartida por el hero, la conjetura y el bloqueo de comprensión.
    prompt: '¿Qué conviene responderle?',

    // El dato crítico que se dijo al principio de la conversación, y en torno al cual se
    // construye todo el capítulo.
    criticalFact: 'El paquete está destinado a recogida en la sucursal de Jerusalén.',

    // ── Hero ──
    hero: {
        badge: 'Behind the Scenes · 07 · Context Window',
        titleLead: 'El modelo responde según',
        titleHighlight: 'lo que hay ahora en la ventana',
        lede:
            'En una conversación larga, datos importantes dichos al principio pueden quedar fuera de la imagen. En este capítulo descubriremos qué ve realmente el modelo cuando responde, por qué eso no es lo mismo que memoria, y cómo lograr que el dato crítico siga dentro de lo que el modelo procesa ahora.',
        promptEyebrow: 'La pregunta del capítulo',
        chipEdit: 'Mueve la ventana de contexto',
        chipSee: 'y observa qué más ve el modelo',
    },

    // ── Justo antes del laboratorio ──
    primer: {
        eyebrow: 'Qué es la ventana de contexto',
        title: 'Justo antes del laboratorio: ¿qué es la ventana de contexto?',
        lead:
            'Antes de jugar con la conversación, entendamos un concepto. En cada momento, el modelo trabaja con una cantidad limitada de texto, lo que se llama la ventana de contexto. Es todo lo que ve cuando redacta la respuesta ahora. Lo que está dentro de la ventana influye. Lo que se cayó de ella, simplemente no está ahí.',
        points: [
            {
                title: 'La ventana de contexto no es memoria',
                body: 'El modelo no te recuerda como una persona. No conserva todo lo que se dijo alguna vez. Trabaja con lo que hay en el input actual, y ya está.',
            },
            {
                title: 'Una conversación larga empuja datos hacia afuera',
                body: 'Cuanto más se alarga la conversación, más pueden salir de la ventana de contexto los datos tempranos. Depende del sistema y de cómo se gestione la conversación, pero la idea es constante: hay un límite a lo que entra.',
            },
            {
                title: 'Existe en el historial, no siempre en uso',
                body: 'Aunque un dato se haya dicho en algún punto anterior, el modelo no se apoyará necesariamente en él. Para que influya, tiene que estar presente, claro y relevante en el input actual.',
            },
            {
                title: 'La memoria de producto es otra cosa',
                body: 'Hay diferencia entre la ventana de contexto de la conversación y una memoria de producto o instrucciones guardadas que el sistema vuelve a inyectar. Son cosas distintas, y es fácil confundirlas.',
            },
        ],
    },

    // ── El momento wow ──
    wow: {
        title: 'El punto sorprendente',
        lead: 'El mismo modelo, la misma pregunta, pero dos respuestas distintas. La diferencia es solo si el dato crítico está dentro de la ventana o fuera de ella.',
        body:
            'El modelo no se volvió más tonto ni olvidó a propósito. Simplemente, cuando el dato sobre la sucursal de Jerusalén ya no está en la ventana, no tiene en qué apoyarse, así que responde de forma genérica. La información no desapareció del mundo, solo salió de lo que el modelo procesa ahora.',
    },

    // ── Ejemplo cotidiano ──
    everyday: {
        title: 'Un momento de la vida real',
        body:
            'Es un poco como pedirle a un amigo que continúe una conversación que empezó hace una hora, cuando él solo oyó los últimos cinco minutos. No es malicioso ni olvidadizo, simplemente no estuvo presente en la parte importante. Si quieres una respuesta precisa, dale otra vez el dato importante. Con un modelo es exactamente igual, solo que la parte que él "oyó" es lo que hay en la ventana de contexto.',
    },

    // ── Corrección de un error común ──
    mistake: {
        wrongTitle: 'Error común',
        wrong:
            '"Se lo dije al principio, así que lo sabe." Según esto, todo lo que se escribió una vez en la conversación queda disponible para el modelo para siempre.',
        rightTitle: 'Cómo funciona de verdad',
        right:
            'El modelo responde según lo que hay en la ventana de contexto ahora. Un dato dicho al principio de una conversación larga puede ya no estar ahí. Si es crítico, conviene devolverlo al prompt actual, y no suponer que el modelo aún lo conserva.',
    },

    // ── Cómo funciona la ventana, sin números ──
    how: {
        title: 'Cómo funciona la ventana, sin números',
        sub: 'Context Window',
        body:
            'Piensa en la ventana como un marco que ve una parte de la conversación. Cuando llega texto nuevo, el marco avanza para contenerlo, y lo que está en el borde lejano puede quedar fuera. El modelo siempre trabaja con lo que hay dentro del marco ahora. Aquí no hay decisión ni emoción, solo un límite a cuánto texto entra de una vez.',
    },

    // ── Bloqueo de comprensión ──
    lock: {
        title: 'Comprueba tu comprensión',
        trueLabel: 'Verdadero',
        trueText: 'El modelo responde según lo que hay en la ventana de contexto ahora. Un dato que salió de la ventana ya no influye, aunque se haya dicho antes.',
        falseLabel: 'Falso',
        falseText: '"Todo lo que se escribió una vez en la conversación queda disponible para el modelo para siempre."',
        question: '¿Qué prompt es el más seguro para una tarea importante, porque se sostiene por sí mismo y no depende de lo que se dijo antes?',
        options: [
            '¿Qué responderle?',
            'Siguiendo con lo que escribí antes, redacta una respuesta.',
            'El paquete está esperando para recogida en la sucursal de Jerusalén. El cliente pregunta qué hacer. Redacta una respuesta corta y clara.',
            'Encárgate de esto.',
        ],
        explanationLead: 'El prompt independiente es',
        explanationPair: '"El paquete está esperando para recogida en la sucursal de Jerusalén. El cliente pregunta qué hacer..."',
        explanationRest:
            '. Lleva dentro de sí el dato crítico y el objetivo, y por eso no depende de lo que quizá ya salió de la ventana de contexto. Las demás formulaciones se apoyan en una conversación anterior que quizá ya no está ahí.',
    },

    // ── Conclusión práctica ──
    practical: {
        title: 'Conclusión práctica',
        lead: 'Para tareas importantes, no confíes en que el modelo recuerda. Devuelve el contexto crítico dentro del prompt.',
        uses: [
            'El objetivo: qué quieres que ocurra al final.',
            'Los datos críticos: hechos como la sucursal de recogida, el estado o el número de seguimiento.',
            'Qué se decidió ya antes, y qué no se debe cambiar.',
            'El formato deseado para la respuesta, y una fuente o un estado si hace falta.',
        ],
        caveat:
            'Y recuerda: meter un dato en el prompt no lo vuelve correcto. La ventana de contexto determina qué ve el modelo, no si es verdad. Para verificar sigues necesitando una fuente externa o una herramienta.',
    },

    // ── Llamadas del mentor ──
    mentor: {
        hero: 'Lo que entra en la ventana es lo que el modelo ve',
        lab: 'Mueve la ventana, y la respuesta se mueve',
        lock: 'Entendiste la ventana de contexto',
        practical: 'Así mantienes el dato crítico en la imagen',
    },

    // ── Conjetura inicial ──
    guess: {
        eyebrow: 'Conjetura rápida · cuatro hipótesis sobre la ventana de contexto',
        title: 'Si un dato importante se dijo al principio de una conversación larga, ¿el modelo lo seguirá usando?',
        subtitle:
            'Elige la explicación que te parezca más cercana a lo que ocurre. Esto no es un examen. Elige una hipótesis, y enseguida la comprobamos juntos.',
        invite: 'Aquí hay varias hipótesis razonables. Justo antes de la explicación, elijamos una.',
        getsRightLabel: 'Qué capta bien',
        revealButton: 'Revela la idea central',
        resetButton: 'Elegir de nuevo',
        revealTitle: 'Entonces, ¿qué ocurre de verdad?',
        revealCopy:
            'El modelo no recuerda como una persona ni conserva todo lo que se dijo alguna vez. Responde según lo que hay en la ventana de contexto ahora. Un dato dicho al principio de una conversación larga puede haber salido ya de la ventana, y entonces el modelo no se apoya en él. La solución es simple: si el dato es crítico, lo devuelves al prompt actual.',
        cta: 'Veámoslo suceder',
        cards: {
            'remembers-all': {
                title: 'El modelo lo recuerda todo',
                desc: 'En cuanto se dice algo en la conversación, el modelo lo conserva y lo usará en cualquier paso posterior.',
                statusLabel: 'Error común',
                getsRight: 'Da esa sensación, porque a veces el modelo sí continúa un dato dicho al principio.',
                missesLabel: 'Qué se le escapa',
                misses: 'No hay memoria humana. En una conversación larga, los datos tempranos pueden salir de la ventana de contexto.',
                bridge: 'Lo que decide no es si un dato se dijo una vez, sino si está dentro de la ventana ahora.',
            },
            'in-window': {
                title: 'Solo lo que está en la ventana ahora',
                desc: 'El modelo responde según la información que hay ahora mismo en la ventana de contexto, y no según todo el historial.',
                statusLabel: 'Elegiste bien',
                getsRight: 'Captaste lo esencial. Lo que decide es lo que hay en la ventana en el momento de la respuesta.',
                missesLabel: 'Qué queda por ver',
                misses: 'Lo veremos directamente sobre nuestra conversación: el mismo dato, una vez dentro y otra fuera.',
                bridge: 'Cuando el dato crítico sale de la ventana, la respuesta se vuelve más genérica.',
            },
            'first-message': {
                title: 'El principio sigue siendo lo más fuerte',
                desc: 'Lo que se dice primero recibe un ancla fija, y por eso el modelo siempre lo pondera con fuerza.',
                statusLabel: 'Parcialmente correcto',
                getsRight: 'A veces una apertura sí orienta toda la conversación, así que la hipótesis se entiende.',
                missesLabel: 'Qué se le escapa',
                misses: 'No hay garantía de que la apertura permanezca. Justamente ella puede ser la primera en salir de la ventana.',
                bridge: 'La importancia no se decide por quién se dijo primero, sino por lo que hay en la ventana ahora.',
            },
            'saved-memory': {
                title: 'Hay una memoria guardada',
                desc: 'El sistema tiene una memoria de producto que guarda el dato de forma automática y está siempre disponible.',
                statusLabel: 'Importante, pero no es la ventana de contexto',
                getsRight: 'La distinción es importante. De verdad existen sistemas con memoria de producto.',
                missesLabel: 'Qué se le escapa',
                misses: 'La memoria de producto es un mecanismo aparte. La ventana de contexto de la conversación sigue siendo limitada, y es fácil confundir las dos.',
                bridge: 'Incluso cuando hay memoria, lo que influye en la respuesta ahora es lo que hay en la ventana ahora.',
            },
        },
    },

    // Subespacios
    lab: contextWindowLab,
    quiz: contextWindowQuiz,
};
