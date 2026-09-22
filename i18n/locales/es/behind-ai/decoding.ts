// i18n/locales/es/behind-ai/decoding.ts
//
// Cadenas en espanol (es, LTR) del Capitulo 9 ("Decoding: elegir el siguiente token") del
// curso interactivo de autoaprendizaje "Behind the Scenes of AI". El hebreo es la fuente
// de verdad y define la forma del tipo (DecodingDict) a la que se ajusta este archivo.
//
// Limite con el Capitulo 8: el Capitulo 8 convirtio puntuaciones en probabilidades. El
// Capitulo 9 empieza despues de que las probabilidades ya existen, y pregunta como se elige
// de ellas el siguiente token. Un estilo conservador se inclina hacia lo mas probable, un
// estilo abierto puede muestrear una opcion mas baja. Elegir no es verificar hechos, y un
// token elegido no es necesariamente verdadero.
//
// Precision: las probabilidades, elecciones y estilos son una ilustracion didactica. Sin
// referencia a ningun ano en este archivo.
//
// Esta es una primera traduccion, pendiente de revision por un hablante nativo.
//
// Sin raya (U+2014) ni semirraya (U+2013).

import type { Locale } from '@/i18n/config';
import { decodingLab } from './decodingLab';
import { decodingQuiz } from './decodingQuiz';

export const decoding = {
    contentLocale: 'es' as Locale,

    prompt: 'La puerta vieja...',

    // -- Hero --
    hero: {
        badge: 'Behind the Scenes · 09 · Decoding',
        titleLead: 'Las probabilidades estan listas. Ahora el modelo',
        titleHighlight: 'elige el siguiente token',
        lede:
            'En el capitulo anterior vimos como se forman las probabilidades. Pero una distribucion no es todavia una respuesta. El modelo necesita un estilo de decodificacion para elegir un token de ella. Una eleccion conservadora se inclina hacia la opcion mas probable y da una salida previsible, y una eleccion abierta puede muestrear tambien una opcion mas baja y anadir variedad. En cualquier caso, elegir un token no es comprobar que sea correcto.',
        promptEyebrow: 'La frase que se continua',
        chipEdit: 'Elige un estilo de decodificacion',
        chipSee: 'y ve que token se elige',
    },

    // -- Adivinanza inicial --
    guess: {
        eyebrow: 'Adivinanza rapida · como se elige el token',
        title: 'El modelo ya calculo probabilidades para "La puerta vieja...". Tiene que elegir siempre la opcion con la probabilidad mas alta?',
        subtitle:
            'Elige la interpretacion que te parezca correcta. Esto no es un examen, y aqui no hay una unica respuesta perfecta. Elige una suposicion, y en un momento veremos que pasa por debajo.',
        invite: 'Las probabilidades ya existen. Justo antes de la explicacion, adivina como se elige de ellas el siguiente token.',
        getsRightLabel: 'Que acierta',
        revealButton: 'Revela la idea principal',
        resetButton: 'Elegir de nuevo',
        revealTitle: 'Entonces, que pasa de verdad?',
        revealCopy:
            'El modelo no siempre tiene que elegir la opcion mas alta. Hay un paso llamado Decoding, y el estilo de decodificacion es lo que decide. Un estilo conservador se inclina hacia la opcion mas probable, un estilo abierto puede muestrear tambien una mas baja y anadir variedad. Y lo mas importante: el token elegido no es automaticamente el correcto. La eleccion decide como eliges, no si es verdad.',
        cta: 'Veamoslo en el laboratorio',
        cards: {
            alwaysTop: {
                title: 'Siempre la mas alta',
                desc: 'El modelo tiene que elegir la opcion con la probabilidad mas alta, cada vez.',
                statusLabel: 'Cerca, pero demasiado fuerte',
                getsRight: 'Hay un grano de verdad en esto. En un estilo de decodificacion conservador el modelo casi siempre elige, de hecho, la opcion lider.',
                missesLabel: 'Que queda por ver',
                misses: 'La palabra "siempre" es demasiado fuerte. Un estilo de decodificacion mas abierto puede a veces elegir otra opcion de la misma distribucion.',
                bridge: 'En un momento veremos que la eleccion depende del estilo, no solo de la probabilidad mas alta.',
            },
            conservative: {
                title: 'Normalmente la mas alta, en un estilo conservador',
                desc: 'Cuando la eleccion es conservadora, el modelo se inclina hacia la opcion con la probabilidad mas alta.',
                statusLabel: 'Una descripcion precisa de un estilo',
                getsRight: 'Una suposicion excelente. Asi se comporta exactamente un estilo de decodificacion conservador: se inclina hacia lo mas probable y da una salida previsible.',
                missesLabel: 'Que queda por ver',
                misses: 'Este es un estilo de entre varios. Un estilo mas abierto puede comportarse distinto y elegir tambien una opcion mas baja.',
                bridge: 'En el laboratorio cambiaremos entre conservador, equilibrado y abierto y veremos como cambia la eleccion.',
            },
            sampled: {
                title: 'A veces se muestrea otra opcion',
                desc: 'El modelo puede elegir tambien una continuacion que no es la mas probable, para anadir variedad.',
                statusLabel: 'Capta el estilo abierto',
                getsRight: 'Correcto. En un estilo de decodificacion mas abierto, a veces se puede elegir una opcion con una probabilidad mas baja.',
                missesLabel: 'Que queda por ver',
                misses: 'Fijate: sigue saliendo de la misma distribucion. Elegir una opcion mas baja no la hace correcta.',
                bridge: 'En el laboratorio veremos como un estilo abierto da una oportunidad tambien a las opciones menos probables.',
            },
            autoTrue: {
                title: 'Lo que se elige es automaticamente correcto',
                desc: 'Una vez que el modelo eligio un token, eso significa que comprobo que es correcto.',
                statusLabel: 'Un error comun',
                getsRight: 'Es tentador pensarlo, porque la eleccion suena decidida.',
                missesLabel: 'Que queda por ver',
                misses: 'La eleccion decide como eliges de las probabilidades, no comprueba el mundo. Un token elegido puede estar equivocado, sin duda.',
                bridge: 'A lo largo del capitulo volveremos a este punto: elegir no es verificar.',
            },
        },
    },

    // -- Justo antes del laboratorio --
    primer: {
        eyebrow: 'De la probabilidad a la eleccion',
        title: 'Justo antes del laboratorio: que es la decodificacion?',
        subtitle: 'No solo que es probable, sino que se elige de verdad',
        lead:
            'Antes de jugar con el estilo de decodificacion, entendamos que pasa aqui. Las probabilidades ya existen del paso anterior. Ahora hay que decidir como se elige un token de ellas. La forma de elegir se llama Decoding, y tiene varios estilos.',
        points: [
            {
                title: 'Que es la decodificacion',
                body: 'La decodificacion es el paso donde el modelo elige el siguiente token de la distribucion de probabilidad. Ya hay opciones con distintas oportunidades, y aqui se decide cual de ellas se elige de verdad.',
            },
            {
                title: 'Por que viene despues del capitulo anterior',
                body: 'En el capitulo anterior las puntuaciones se convirtieron en probabilidades. Este capitulo empieza justo en ese punto y hace otra pregunta: ahora que hay una distribucion, como se elige de ella?',
            },
            {
                title: 'Una eleccion conservadora',
                body: 'Un estilo conservador se inclina a elegir la opcion con la probabilidad mas alta. El resultado es mas previsible y estable, por eso encaja cuando quieres una respuesta consistente.',
            },
            {
                title: 'Una eleccion abierta, muestreo',
                body: 'Un estilo abierto puede elegir a veces tambien una opcion con una probabilidad mas baja. El muestreo no es azar uniforme: un token con mayor probabilidad sigue teniendo mas posibilidades de ser elegido. Eso anade variedad y frases alternativas, a costa de un poco de estabilidad.',
            },
            {
                title: 'El compromiso entre apertura y estabilidad',
                body: 'Mas apertura puede ayudar con las ideas y las formulaciones, pero encaja menos con tareas factuales que necesitan estabilidad. Hay un mando aparte llamado temperatura que ajusta cuanta apertura hay en la eleccion, y lo veremos brevemente mas abajo. Es un mando de estilo, no de verdad ni de inteligencia.',
            },
            {
                title: 'Que no es la decodificacion',
                body: 'La decodificacion no es comprobacion de hechos. No demuestra que el token elegido sea correcto. Solo describe como se elige un token de las probabilidades que ya existen.',
            },
            {
                title: 'En el laboratorio controlaras el estilo',
                body: 'En un momento usaras esta misma distribucion, cambiaras el estilo de decodificacion, y veras como cambia la continuacion elegida. Asi se siente lo que hace el estilo de decodificacion.',
            },
        ],
    },

    // -- Transicion See: de la distribucion al token --
    see: {
        title: 'De la distribucion al token, en cuatro pasos',
        steps: ['Distribucion de probabilidad', 'Estilo de decodificacion', 'El token elegido', 'La respuesta se actualiza'],
        caption:
            'Esta misma distribucion entra en un estilo de decodificacion, y de el sale un token que se une a la respuesta. Un estilo distinto puede elegir un token distinto. La eleccion se hace desde las probabilidades, no desde comprobar el mundo.',
    },

    // -- El momento wow --
    wow: {
        title: 'El punto sorprendente',
        lead: 'Esta misma distribucion puede llevar a tokens distintos, solo por el estilo de decodificacion.',
        body:
            'El estilo de decodificacion no cambia las probabilidades, solo decide como se elige de ellas. Por eso un token menos probable elegido en un estilo abierto no es mas correcto, simplemente fue elegido. La eleccion decide estilo, no verdad.',
    },

    // -- Ejemplo cotidiano --
    everyday: {
        title: 'Un momento de la vida',
        body:
            'Cuando respondes a un amigo, hay varias maneras naturales de continuar una frase. A veces eliges la segura y esperada, y a veces una formulacion mas sorprendente. La misma intencion, y el estilo de decodificacion decide como suena la continuacion. Con el modelo es parecido: la misma distribucion, y el estilo de decodificacion decide que sale.',
    },

    // -- Corregir un error comun --
    mistake: {
        wrongTitle: 'Un error comun',
        wrong: '"Si el modelo eligio este token, significa que es correcto." Segun esto, el acto de elegir prueba la verdad.',
        rightTitle: 'Como funciona de verdad',
        right:
            'El estilo de decodificacion solo decide como se elige de las probabilidades existentes. Conservador da una salida previsible, abierto anade variedad, pero ninguno comprueba el mundo. Un token elegido puede estar equivocado.',
    },

    // -- Conservador vs abierto, sin terminos complicados --
    how: {
        title: 'Temperatura: afilar o aplanar la distribucion',
        sub: 'Temperature',
        body:
            'En el laboratorio mantuvimos esta misma distribucion y cambiamos solo el estilo de eleccion. La temperatura es un mando aparte que si cambia la forma de la distribucion misma, antes de elegir. Temperatura baja afila la distribucion: la opcion lider destaca mas, y la eleccion se inclina hacia ella. Temperatura alta la aplana: las opciones mas bajas reciben tambien una oportunidad real, y la eleccion es mas variada. La temperatura cambia las probabilidades, no la verdad ni el conocimiento del modelo.',
    },

    // -- Fijar la comprension --
    lock: {
        title: 'Comprueba tu comprensión',
        trueLabel: 'Verdadero',
        trueText: 'El estilo de decodificacion decide como se elige de las probabilidades. Un estilo abierto puede elegir tambien una opcion menos probable.',
        falseLabel: 'Falso',
        falseText: '"Si se eligio una opcion menos probable, significa que el modelo comprobo que es correcta."',
        question: 'En un modo de eleccion mas abierto, el modelo eligio una continuacion con una probabilidad relativamente baja. Que puedes concluir con seguridad?',
        options: [
            'Que la continuacion menos probable se volvio correcta de hecho',
            'Que el modelo comprobo que esta continuacion es correcta',
            'Que el estilo de decodificacion permitio elegir una opcion menos probable',
            'Que Softmax dejo de funcionar',
        ],
        explanationLead: 'La respuesta correcta es',
        explanationPair: '"El estilo de decodificacion permitio elegir una opcion menos probable."',
        explanationRest:
            '. Un estilo abierto simplemente da una oportunidad tambien a las opciones mas bajas de la distribucion. Eso no es verificacion ni una promesa de que la continuacion sea correcta. La decodificacion decide como eliges, no si es verdad. Verificar todavia necesita una fuente o una herramienta.',
    },

    // -- Idea practica --
    practical: {
        title: 'Idea practica',
        lead:
            'Hay dos maneras distintas de influir en la salida. Una es el estilo de decodificacion y la temperatura, que son controles de configuracion del modelo o del producto. La otra es como formulas la peticion, que cambia el contexto y puede cambiar la propia distribucion de probabilidad. Como usuario, la formulacion suele ser la herramienta en tus manos. Asi que si quieres precision y estabilidad, pide una respuesta enfocada, acotada y respaldada por fuentes, y si quieres ideas o alternativas, pide varias opciones o una redaccion mas abierta:',
        uses: [
            'Para una tarea factual: "No adivines. Si no hay fuente de seguimiento, di que hay que comprobar el estado."',
            'Para redaccion: "Dame tres inicios distintos para un relato corto sobre una puerta vieja."',
            'Para una tarea estable: pide una sola respuesta enfocada, no varias alternativas abiertas.',
            'Para una tarea creativa: pide varias opciones o una redaccion mas variada.',
        ],
        caveat:
            'Y recuerda: ningun estilo de decodificacion verifica hechos. Conservador da estabilidad, abierto da variedad, pero verificar contra el mundo necesita una fuente externa o una herramienta.',
    },

    // F3 RESPOND (M9): la capa de respuesta humana del capitulo. El estado sigue
    // siendo independiente; aqui solo esta lo que dice el mentor despues, en ambos casos.
    mentorRespond: {
        guessCorrect:
            'No dijiste siempre. Ataste el comportamiento al estilo de selección y no a la distribución en sí, y sobre esa separación se apoya todo el capítulo. La misma distribución exacta puede llevar a tokens distintos.',
        guessWrong:
            'La dirección que elegiste se apoya en algo real, pero mezcla dos preguntas: qué es probable y qué se elige de hecho. Vale la pena releer las líneas de arriba y preguntar qué cambia cuando la distribución sigue idéntica y solo se cambia el estilo de selección.',
        quizPass:
            'Estás separando la distribución de la elección hecha a partir de ella. Esa separación explica cómo una misma pregunta puede recibir dos respuestas distintas sin que ninguna haya sido verificada.',
        quizFail:
            'Aquí es fácil mezclar elegido con correcto. Vuelve al laboratorio, deja la misma frase y cambia solo el estilo de selección. Lo que se mueve es la salida, no los hechos.',
    },

    // Subespacios
    lab: decodingLab,
    quiz: decodingQuiz,
};
