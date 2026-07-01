// i18n/locales/es/behind-ai/chapter5.ts
// Spanish Chapter 5 ("How AI builds an answer"). Shape source: ../../he/behind-ai/chapter5.
// contentLocale = 'es'. Natural Spanish prose uses "IA"; brand/chrome labels stay English.

import type { Locale } from '@/i18n/config';
import { chapter5Lab } from './chapter5Lab';
import { chapter5Quiz } from './chapter5Quiz';

export const chapter5 = {
    contentLocale: 'es' as Locale,

    hero: {
        badge: 'Behind the Scenes · 05',
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
        takeaways: 'Construir no es verificar',
        lock: 'Has fijado la idea',
    },

    sections: {
        labEyebrow: 'Answer Builder Lab',
        labTitle: 'Laboratorio de construcción de la respuesta',
        labIntro:
            'El mismo Prompt y un único bucle que construye la respuesta. Elige la primera parte, luego avanza y observa cómo cada parte elegida se suma al contexto y cómo el contexto actualizado cambia las opciones para la siguiente parte. Prueba los dos inicios y comprueba que el mismo Prompt lleva a dos respuestas distintas.',
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

    takeawaysTitle: 'Qué llevarte de este capítulo',
    takeaways: [
        'Generar la respuesta es un proceso que se repite, no una sola acción.',
        'En cada paso el modelo estima cuál es la siguiente parte adecuada, igual que vimos en el capítulo anterior.',
        'La parte creada se suma al contexto, y el contexto actualizado es la entrada para el siguiente paso.',
        'Las elecciones tempranas pueden orientar las posteriores, y de ahí viene la coherencia.',
        'La coherencia no es verificación de la verdad. Construir paso a paso no comprueba si el contenido es correcto en el mundo.',
        'Una comprobación real necesita una herramienta o una fuente externa, un tema para un capítulo posterior.',
    ],

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

    lab: chapter5Lab,
    quiz: chapter5Quiz,
};
