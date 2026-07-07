// i18n/locales/es/behind-ai/doesAiLearn.ts
//
// Espanol (es, LTR) para el capitulo Does AI Learn From Me (Capitulo 16) del curso
// "Behind the Scenes of AI". El hebreo es la fuente de verdad y define el tipo
// (DoesAiLearnDict).
//
// La idea: cuando corriges el modelo en un chat, puede usar la correccion porque esta en el
// contexto. Eso no significa que el modelo base aprendiera de ti para siempre. Contexto,
// memoria (una funcion de producto), registros y comentarios, y entrenamiento son capas
// distintas. El capitulo se mantiene general y conceptual: no se afirma nada sobre la politica,
// la privacidad ni el entrenamiento de un producto concreto, ni que la AI "siempre recuerda" o
// "nunca recuerda".
//
// Traduccion de primera pasada, pendiente de revision por un hablante nativo.
//
// Sin raya (U+2014) ni semirraya (U+2013), sin referencias a anos.

import type { Locale } from '@/i18n/config';
import { doesAiLearnLab } from './doesAiLearnLab';
import { doesAiLearnQuiz } from './doesAiLearnQuiz';

export const doesAiLearn = {
    contentLocale: 'es' as Locale,

    hero: {
        badge: 'Behind the Scenes · 16 · Does AI Learn From Me',
        titleLead: 'Corregiste el modelo.',
        titleHighlight: 'De verdad aprendio de ti?',
        lede: 'En el capitulo anterior comprobamos si hubo una mejora real. Ahora hacemos la pregunta desde tu punto de vista: cuando corriges el modelo en un chat, aprendio de verdad de ti, o solo uso lo que escribiste ahora? Separamos contexto, memoria y entrenamiento.',
        hook: 'El modelo dijo "El paquete llegara manana", y tu respondiste "No, segun el seguimiento no hay fecha confirmada". Que pasa la proxima vez que abras un chat nuevo?',
        chipTry: 'Muevete entre cuatro capas de aprendizaje',
        chipCompare: 'Ve cuando ayuda la correccion y cuando desaparece',
    },

    mentor: {
        hero: 'Corregir ahora no es necesariamente aprender para siempre',
        labExplain: 'Muevete entre las capas y ve que cambia',
        misconception: 'Funciono, pero no necesariamente se aprendio',
        lock: 'Un chat nuevo empieza en una pagina limpia',
        practical: 'Aporta de nuevo la regla o la fuente',
    },

    primer: {
        eyebrow: 'Contexto, memoria y entrenamiento no son lo mismo',
        title: 'Antes del laboratorio: que significa que el modelo "aprende de mi"?',
        subtitle: 'Contexto, memoria y entrenamiento no son lo mismo.',
        lead:
            'Cuando corriges el modelo y se corrige a si mismo, es facil sentir que aprendio. Pero suele pasar algo mas sencillo: la correccion entro en el contexto que el modelo ve ahora. Separemos algunas capas que es facil confundir.',
        points: [
            {
                title: 'Contexto actual',
                body: 'Lo que escribes en la conversacion actual es parte del contexto. El modelo puede usarlo al redactar respuestas mas adelante en el mismo chat.',
            },
            {
                title: 'Conversacion nueva',
                body: 'Un chat nuevo no incluye necesariamente la correccion antigua, salvo que el producto guarde memoria o que aportes de nuevo el contexto.',
            },
            {
                title: 'Memoria del producto',
                body: 'Algunos productos ofrecen memoria o preferencias guardadas. Es una funcion de producto, no lo mismo que cambiar el modelo base.',
            },
            {
                title: 'Registros y comentarios',
                body: 'A veces los comentarios se pueden registrar o revisar, segun el producto y la configuracion. No se afirma nada aqui sobre un producto concreto.',
            },
            {
                title: 'Entrenamiento y actualizacion',
                body: 'Cambiar el modelo en si requiere un proceso aparte de entrenamiento o actualizacion. No ocurre al instante por una correccion en un chat.',
            },
            {
                title: 'La suposicion segura',
                body: 'No confies en un aprendizaje invisible. Si un dato importa, aporta de nuevo el contexto o usa una fuente fiable.',
            },
        ],
    },

    see: {
        title: 'De la correccion a la mejora duradera',
        steps: [
            'Una correccion en el chat actual',
            'El contexto actual cambia',
            'La respuesta mejora ahora',
            'Un chat nuevo quiza no lo incluya',
            'La mejora duradera necesita memoria o entrenamiento',
        ],
        caption:
            'Aqui hay varias capas distintas: contexto, memoria, registros y comentarios, y entrenamiento. Tu correccion vive en la capa de contexto, y no llega necesariamente a las capas mas profundas.',
    },

    guess: {
        eyebrow: 'Adivina rapido · antes de abrirlo',
        title: 'Corregiste el modelo, y en el mismo chat se corrigio a si mismo. Que pasa en un chat nuevo?',
        subtitle: 'Elige la suposicion mas segura. Aqui no hay puntuacion, hay una direccion que describe lo que de verdad pasa.',
        invite: 'Antes de comprobarlo en el laboratorio, intenta adivinar que le pasa a la correccion en el proximo chat.',
        correctTitle: 'Muy bien!',
        wrongTitle: 'Casi!',
        getsRightLabel: 'Que acierta',
        revealButton: 'Revela la idea principal',
        revealTitle: 'Entonces que pasa de verdad?',
        revealCopy:
            'La correccion puede ayudar dentro de la conversacion actual, porque esta en el contexto. Pero eso no significa que el modelo base cambiara, y en un chat nuevo no deberias suponer que la correccion sigue ahi. La mejora duradera requiere una memoria de producto o un proceso de entrenamiento aparte.',
        cta: 'Veamoslo en el laboratorio',
        resetButton: 'Elegir de nuevo',
        exploreHint: 'Tambien puedes elegir otra opcion y ver como suena.',

        cards: {
            contextNotPermanent: {
                title: 'Puede usar esto ahora, pero el modelo no cambio necesariamente',
                desc: 'La correccion ayuda en el chat actual porque esta en el contexto, no porque el modelo aprendiera para siempre.',
                statusLabel: 'Elegiste bien',
                getsRight: 'Exacto. La correccion vive en el contexto de la conversacion, asi que ayuda ahora sin cambiar el modelo base.',
                missesLabel: 'Que queda por ver',
                misses: 'En el laboratorio veremos que pasa en un chat nuevo, y la diferencia entre una memoria de producto y el entrenamiento.',
                bridge: 'Ayuda en el contexto, no necesariamente aprendido para siempre.',
            },
            alwaysRemembers: {
                title: 'Siempre lo recordara a partir de ahora',
                desc: 'La correccion entro en el modelo, asi que la recordara en cada chat.',
                statusLabel: 'Error comun',
                getsRight: 'Es logico sentirlo asi, porque dentro del chat la correccion de verdad funciono.',
                missesLabel: 'Que se pierde',
                misses: 'El modelo base no cambio por la correccion. En un chat nuevo, no supongas que la recuerda.',
                bridge: 'Funciono ahora, pero no se guardo para siempre.',
            },
            cantUseAtAll: {
                title: 'No puede usar la correccion en absoluto',
                desc: 'Una correccion en un chat no afecta a nada.',
                statusLabel: 'Otra capa',
                getsRight: 'Es cierto que la correccion no cambia el modelo base.',
                missesLabel: 'Que se pierde',
                misses: 'Pero dentro del mismo chat la correccion si ayuda, porque esta en el contexto que el modelo ve ahora.',
                bridge: 'En el contexto actual la correccion si funciona.',
            },
            everyoneGetsIt: {
                title: 'Todos los usuarios recibiran ahora la respuesta corregida',
                desc: 'Tu correccion actualiza el modelo para todos.',
                statusLabel: 'En parte cierto',
                getsRight: 'Es cierto que a veces los comentarios pueden alimentar una mejora futura.',
                missesLabel: 'Que se pierde',
                misses: 'Pero es un proceso aparte, lento y dependiente del producto. Una correccion no actualiza el modelo para todos los usuarios al instante.',
                bridge: 'La mejora para todos es un proceso aparte, no instantaneo.',
            },
        },
    },

    insight: {
        title: 'El punto clave del capitulo',
        lead: 'Lo confuso es que la correccion de verdad funciona dentro del chat.',
        body: 'El modelo responde mejor, y parece que aprendio. Pero en la mayoria de los casos lo que paso es mas sencillo: la correccion entro en el contexto que el modelo ve ahora. Eso no significa necesariamente que el modelo en si cambiara.',
    },

    misconception: {
        wrongLabel: 'Error comun',
        wrongQuote: '"Lo corregi una vez, asi que ahora ya lo sabe."',
        rightLabel: 'Como funciona de verdad',
        rightBody: 'La correccion ayuda mientras esta en el contexto de la conversacion. En un chat nuevo, no supongas que esta ahi, salvo que el producto guarde memoria o que aportes de nuevo la informacion. Un cambio duradero del modelo requiere un proceso aparte de entrenamiento o actualizacion, no un solo mensaje en un chat.',
    },

    lock: {
        title: 'Fija la comprension',
        question: 'Corregiste el modelo en un chat: "no escribas una fecha de llegada si no hay fuente". Luego abriste un chat nuevo. Cual es la suposicion mas segura?',
        options: [
            'El modelo base aprendio tu regla para siempre.',
            'El chat nuevo quiza no incluya la correccion, salvo que la memoria o el contexto la aporten.',
            'Todos los usuarios reciben ahora el comportamiento corregido.',
            'La correccion nunca ayudo en absoluto.',
        ],
        success:
            'Contexto, memoria y entrenamiento son capas separadas. Un chat nuevo empieza sin el contexto anterior, asi que si la regla importa, aportala de nuevo o usa la memoria del producto. No confies en un aprendizaje invisible.',
    },

    practical: {
        title: 'Idea practica',
        lead:
            'Cuando la exactitud importa, no confies en "el modelo ya lo sabe". En su lugar, apunta asi:',
        uses: [
            'Aporta de nuevo la regla o la fuente importante en cada chat nuevo, en vez de suponer que el modelo la recuerda.',
            'Formula la regla de forma explicita, por ejemplo: "No inventes una fecha de llegada si no hay fuente. Si no hay fecha en el seguimiento, escribe que no hay fecha confirmada."',
            'Si el producto ofrece memoria o preferencias guardadas, usalas para lo que deba repetirse.',
            'Para equipos que construyen sistemas: define la regla, agregala a las instrucciones del sistema, ancla la en una fuente, crea casos de prueba, y recopila fallos repetidos para una mejora controlada.',
            'Despues de cada cambio, comprueba de nuevo que el comportamiento mejoro de verdad.',
        ],
        caveat:
            'Distintos productos manejan los datos de forma diferente. Si un dato importa, aporta la fuente, la regla o el contexto guardado de forma explicita, y no confies en que el modelo "recuerda".',
    },

    finalExamCta: {
        title: 'Listo para el examen final del curso?',
        body: 'Un examen de resumen que repasa todo lo que hemos visto hasta aqui, desde la entrada hasta la decision responsable. Puedes volver a el cuando quieras, y tu progreso se guarda.',
        button: 'Ir al examen final del curso',
    },

    lab: doesAiLearnLab,
    quiz: doesAiLearnQuiz,
};
