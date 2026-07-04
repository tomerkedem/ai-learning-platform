// i18n/locales/es/behind-ai/generationLoop.ts
// Spanish Chapter 5 ("How AI builds an answer"). Shape source: ../../he/behind-ai/generationLoop.
// contentLocale = 'es'. Natural Spanish prose uses "IA"; brand/chrome labels stay English.

import type { Locale } from '@/i18n/config';
import { generationLoopLab } from './generationLoopLab';
import { generationLoopQuiz } from './generationLoopQuiz';

export const generationLoop = {
    contentLocale: 'es' as Locale,

    hero: {
        badge: 'Behind the Scenes · 10 · Generation Loop',
        titleLead: 'Cada palabra que el modelo escribe',
        titleHighlight: 'vuelve hacia dentro',
        lede: 'Vimos que el modelo elige una continuación que parece razonable. Pero no se detiene después de una sola elección. Repite esa elección una y otra vez, y cada parte que escribe se suma al contexto e influye en la siguiente elección. La respuesta no nace de golpe, se construye en un bucle.',
        hook: 'Si el modelo construye una respuesta paso a paso, ¿cómo puede una sola palabra cambiar todo lo que viene después?',
        chipLoop: 'Elige un inicio y recorre el bucle',
        chipContext: 'Observa cómo el contexto crece en cada paso',
    },

    mentor: {
        hero: 'Cada paso construye el siguiente',
        labExplain: 'Cada parte vuelve hacia dentro',
        misconception: 'Ninguna respuesta espera ya hecha',
        lock: 'Has fijado la idea',
        practical: 'Orienta el bucle desde el inicio',
    },

    sections: {
        labEyebrow: 'Answer Builder Lab',
        labTitle: 'Laboratorio de construcción de la respuesta',
        labIntro:
            'El mismo Prompt y un único bucle que construye la respuesta. Elige la primera parte, luego avanza y observa cómo cada parte elegida se suma al contexto y cómo el contexto actualizado cambia las opciones para la siguiente parte. Prueba los dos inicios y comprueba que el mismo Prompt lleva a dos respuestas distintas.',
    },

    primer: {
        eyebrow: 'De un solo paso a un bucle completo',
        title: 'Antes del laboratorio: ¿qué es el Generation Loop?',
        subtitle: 'Una respuesta completa se construye paso a paso',
        lead:
            'Antes de ver cómo se construye la respuesta, veamos qué ocurre aquí. El modelo no escribe un párrafo entero de golpe. Elige una parte pequeña, la suma al texto ya escrito y luego elige la siguiente parte según el contexto actualizado. Ese bucle se repite hasta que la respuesta está completa o llega una señal de parada.',
        points: [
            {
                title: 'Qué es el bucle de generación',
                body: 'Después de que el modelo elige un token o un fragmento pequeño, esa parte se suma al texto escrito hasta ahora. El contexto crece, y el modelo elige la siguiente parte según el texto actualizado. Elegir, sumar, elegir otra vez, y así sucesivamente.',
            },
            {
                title: 'Por qué viene después del capítulo anterior',
                body: 'El capítulo anterior mostró cómo se elige un token entre las probabilidades. Aquí esa misma elección se repite una y otra vez. Este capítulo no trata de una sola elección, sino de lo que ocurre cuando sucede decenas de veces seguidas.',
            },
            {
                title: 'Cada parte elegida actualiza el contexto',
                body: 'La parte que se escribe no solo sale hacia fuera, también vuelve hacia dentro y pasa a formar parte de la entrada del siguiente paso. Por eso cada elección cambia un poco lo que el modelo sopesa al elegir la continuación.',
            },
            {
                title: 'Por qué importan las primeras palabras',
                body: 'Las primeras partes fijan el tono, el nivel de cautela y la estructura. Si la respuesta empezó con un tono demasiado seguro, el resto tiende a seguir demasiado seguro. Una apertura prudente invita a una continuación prudente. Un paso temprano es un marco para todo lo que sigue.',
            },
            {
                title: 'Por qué la respuesta se siente continua',
                body: 'El bucle corre muy rápido, así que desde fuera parece una sola respuesta fluida. Pero por debajo se armó parte tras parte, no apareció ya hecha.',
            },
            {
                title: 'La fluidez no es verdad',
                body: 'Una respuesta suave y convincente puede ser igualmente errónea. El bucle arma una continuación que encaja con el contexto y con los patrones que el modelo aprendió, no comprueba si el contenido es cierto en el mundo. Si el estado importa, hace falta una fuente o una herramienta, o decir qué falta.',
            },
            {
                title: 'Qué verás en el laboratorio',
                body: 'En un momento verás una respuesta que se construye paso a paso, y cambiarás la apertura y la instrucción para ver cómo cambia todo lo demás con ellas.',
            },
        ],
    },

    see: {
        title: 'Del Prompt a una respuesta completa, paso a paso',
        steps: ['El Prompt', 'La parte elegida', 'La respuesta se actualiza', 'La siguiente elección', 'La respuesta completa'],
        caption:
            'Cada parte elegida se suma a la respuesta, y la respuesta que crece se convierte en el contexto de la siguiente elección. Así avanza el bucle hasta que la respuesta está completa. Es una ilustración educativa de la generación paso a paso, no un rastro real de un modelo, y el bucle construye la continuación, no comprueba hechos.',
    },

    guess: {
        eyebrow: 'Adivinanza rápida · Construir la respuesta',
        title: '¿Qué ocurre después de que el modelo elige la primera continuación?',
        subtitle: 'Elige el modelo mental que sientas más cercano. Aquí no hay nota, hay una dirección que describe lo que de verdad ocurre.',
        invite: 'Antes de abrir esto, intenta adivinar qué ocurre entre un paso y el siguiente mientras se construye la respuesta.',
        correctTitle: '¡Exacto!',
        wrongTitle: '¡Casi!',
        getsRightLabel: 'Qué acierta esto',
        revealButton: 'Revelar la idea central',
        revealTitle: 'Entonces, ¿qué ocurre de verdad?',
        revealCopy:
            'El modelo no guarda la respuesta completa para luego mostrarla. Genera una parte pequeña, la suma a lo que ya está escrito y vuelve a mirar el contexto actualizado para elegir la siguiente parte. Así cada paso moldea el siguiente, y la respuesta se construye en un bucle.',
        cta: 'Veámoslo en el laboratorio',
        resetButton: 'Elegir de nuevo',
        exploreHint: 'También puedes elegir otra opción y ver cómo suena.',

        cards: {
            ready: {
                title: 'La respuesta completa ya está lista',
                desc: 'La respuesta completa existe dentro de él, y solo la muestra hacia fuera.',
                statusLabel: 'Error común',
                getsRight: 'Es comprensible pensarlo así, porque la respuesta fluye con suavidad como si estuviera planificada de antemano.',
                missesLabel: 'Qué se le escapa',
                misses: 'No hay una respuesta completa guardada de antemano. El modelo genera una parte, la suma y solo entonces pasa a la siguiente parte.',
                bridge: 'Por eso la misma pregunta puede construirse un poco distinta cada vez.',
            },
            loop: {
                title: 'Cada paso se suma al contexto e influye en el paso siguiente',
                desc: 'Cada parte que se escribe pasa a formar parte del contexto, y el contexto actualizado moldea la siguiente elección.',
                statusLabel: 'Elegiste bien',
                getsRight: 'Exacto. La generación es un bucle. La parte escrita vuelve hacia dentro y pasa a formar parte de la pregunta sobre el siguiente paso.',
                missesLabel: 'Qué queda por ver',
                misses: 'En el laboratorio veremos cómo cambiar la primera parte cambia todo el resto de la respuesta.',
                bridge: 'Un paso temprano no es solo una palabra más, es un marco para todo lo que sigue.',
            },
            verify: {
                title: 'En cada paso el modelo comprueba si la respuesta es verdadera',
                desc: 'Antes de cada parte verifica contra el mundo que es correcta.',
                statusLabel: 'No es esta etapa',
                getsRight: 'Es cierto que a veces importa verificar contra el mundo.',
                missesLabel: 'Qué se le escapa',
                misses: 'La verificación es otra capa, de herramientas y fuentes. En el propio bucle de generación el modelo se apoya en el contexto y en los patrones que aprendió, no en una comprobación con la realidad.',
                bridge: 'Construir paso a paso produce una continuación adecuada, no verifica hechos.',
            },
            'last-word': {
                title: 'El modelo continúa solo a partir de la última palabra que escribió',
                desc: 'Solo la última parte decide qué viene, todo lo demás ya no importa.',
                statusLabel: 'En parte cierto',
                getsRight: 'Hay algo de verdad aquí, la última parte escrita sí influye con fuerza en lo que viene después.',
                missesLabel: 'Qué se le escapa',
                misses: 'Pero no solo ella. El modelo mira todo el contexto acumulado, no solo la última palabra. Incluso el inicio lejano sigue orientando.',
                bridge: 'La influencia es de todo el contexto, por eso las elecciones tempranas siguen siendo importantes hasta el final.',
            },
        },
    },

    insight: {
        title: 'El punto sorprendente',
        lead: 'Cada parte que el modelo escribe se convierte de inmediato en parte de la siguiente pregunta.',
        body: 'La respuesta no solo sale del motor, también cambia lo que el motor ve en el siguiente paso. Por eso las primeras palabras elegidas pueden orientar toda la continuación, y el mismo Prompt puede construirse en dos respuestas completamente distintas según la parte elegida al principio.',
    },

    analogy: {
        title: 'Un momento de la vida',
        body: 'Cuando escribes una frase, después de las primeras palabras ya sientes qué encaja para continuar. Reducen las opciones naturales. Con el modelo es parecido, solo que la parte escrita pasa de inmediato a formar parte de la pregunta sobre el siguiente paso, y no se queda solo en una sensación.',
    },

    misconception: {
        wrongLabel: 'Error común',
        wrongQuote: '«El modelo conoce toda la respuesta de antemano y luego la muestra.»',
        rightLabel: 'Cómo funciona en realidad',
        rightBody: 'El modelo construye la respuesta de forma gradual. Cada parte que crea se suma al contexto e influye en lo que vendrá después. No hay una respuesta completa guardada y esperando.',
    },

    practical: {
        title: 'Idea práctica',
        lead:
            'Si quieres una respuesta estable y útil, ayuda orientar el bucle de generación antes incluso de que empiece. La apertura, la estructura y la redacción de tu petición moldean todo lo que se construye después. Para una tarea importante, pide de forma explícita:',
        uses: [
            'Una estructura clara: «Escribe la respuesta en tres partes: empatía, lo que se sabe y lo que hay que comprobar.»',
            'Una redacción prudente: «No adivines una fecha de llegada que no se ha comprobado. Si falta el número de seguimiento, pídelo.»',
            'Una separación entre lo conocido y lo supuesto: pídele que marque qué es un hecho y qué es una suposición.',
            'Una comprobación de fuente cuando el estado importa: «Si no se puede confirmar el estado, dilo en lugar de adivinar.»',
        ],
        caveat:
            'Aun así, ninguna redacción convierte la fluidez en verdad. Un buen Prompt no solo elige un tema, moldea cómo se construirá la respuesta. Pero para verificar contra el mundo sigues necesitando una fuente externa o una herramienta.',
    },

    lock: {
        title: 'Fijar la comprensión',
        question: 'El modelo acaba de escribir la parte «Revisa el número de seguimiento...». ¿Qué cambia ahora, de cara al siguiente paso?',
        options: [
            'No cambia nada, el modelo continúa desde el mismo lugar',
            'Esta parte se suma al contexto y cambia las opciones para el siguiente paso',
            'El modelo acaba de comprobar el estado del paquete en la realidad',
            'El modelo empieza de nuevo solo desde la pregunta original',
        ],
        success:
            'La parte escrita se suma al contexto de inmediato, y el contexto actualizado es lo que cambia qué continuaciones reciben más peso en el siguiente paso. Esto no es una comprobación con la realidad ni un reinicio. Construir paso a paso arma una continuación adecuada, no verifica si es correcta en el mundo.',
    },

    lab: generationLoopLab,
    quiz: generationLoopQuiz,
};
