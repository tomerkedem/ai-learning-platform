// i18n/locales/es/behind-ai/chapter4.ts
// Capítulo 4 en español ("Embeddings: de un número sin sentido al significado").
// Fuente de forma: ../../he/behind-ai/chapter4 (el hebreo es canónico).
//
// Enfoque: cómo el texto se convierte en una representación numérica aprendida. Texto ->
// tokens -> Token IDs -> una fila en la tabla de embeddings -> un vector -> procesado en
// contexto. Los valores se aprendieron en el entrenamiento y se consultan en la inferencia.
// El mapa semántico (cercanía, vecinos) pertenece al capítulo 5, no aquí.
//
// Traducción real, español natural (no literal). Sin guion largo (U+2014) ni guion medio
// (U+2013). El texto de las burbujas del mentor no lleva emoji.

import type { Locale } from '@/i18n/config';
import { chapter4Quiz } from './chapter4Quiz';

export const chapter4 = {
    contentLocale: 'es' as Locale,

    // Hero
    hero: {
        badge: 'Behind the Scenes · 04',
        titleLead: '¿De dónde salen los números',
        titleHighlight: 'que representan cada token?',
        lede: 'En el capítulo anterior vimos cómo el texto se divide en tokens, y cada token recibe un Token ID. Pero un número como el 17 por sí solo no le dice al modelo nada sobre lo que significa el token.',
        chipObject: 'Del texto a los tokens y a los números',
        chipMeaning: '¿Entonces de dónde viene el significado?',
    },

    // F3 RESPOND (M8): la capa de respuesta humana del capitulo. El estado sigue
    // siendo independiente; aqui solo esta lo que dice el mentor despues, en ambos casos.
    mentorRespond: {
        guessCorrect:
            'Separaste lo que señala de lo que contiene. Esa separación se pasa por alto con facilidad, porque un número casi siempre nos dice algo sobre cantidad o sobre orden. Aquí solo indica adónde ir.',
        guessWrong:
            'Esa elección no vino de la confusión. Vino de un supuesto muy razonable: que si el modelo recibe un número, el número mismo lleva información. Vale la pena releer las líneas de arriba preguntando no qué dice el número, sino adónde te envía.',
        quizPass:
            'Ya distingues el identificador del vector que ese identificador trae. Esa es la distinción que te sostendrá en el próximo capítulo, cuando empecemos a hablar de cercanía entre significados.',
        quizFail:
            'Esta idea se aclara actuando, no leyendo una definición. Vuelve al laboratorio de búsqueda, elige una palabra y observa qué cambia en la fila que aparece y qué se mantiene igual.',
    },

    // Adivinanza rápida: solo texto; el icono, la respuesta correcta y las poses son estructurales.
    // Los ids de opción (address/meaning/importance) son claves estables de la página, no se traducen.
    // address = la respuesta correcta, meaning/importance = incorrectas, con un why.
    guess: {
        eyebrow: 'Adivinanza rápida',
        title: 'La palabra "no" recibe el número 17. ¿Qué es ese número?',
        subtitle: 'Adivina por lo que ya sabes sobre tokens.',
        prompt: '"no" → 17',
        invite: 'Párate un momento: ¿qué crees que representa este número dentro del modelo?',
        options: {
            address: {
                title: 'Una dirección en el vocabulario',
                desc: 'El número solo indica qué token es',
            },
            meaning: {
                title: 'El significado de "no"',
                desc: 'El número en sí ya dice negación',
                why: 'Tienta pensar así, pero el número por sí solo no lleva significado. Es una dirección fija en el vocabulario. El significado viene de la fila a la que apunta la dirección, y ese es el vector que veremos enseguida.',
            },
            importance: {
                title: 'Qué tan importante es la palabra',
                desc: 'Un número pequeño significa una palabra menos importante',
                why: 'No. El tamaño del número es arbitrario, es solo un identificador. Qué tan importante es una palabra en contexto se decide en una etapa posterior, en el capítulo de Attention.',
            },
        },
        successTitle: 'Exacto',
        successExplain:
            'El Token ID es una dirección, no significado. El número 17 solo dice qué token es. El significado está en la fila a la que apunta la dirección en la tabla de embeddings, y eso es justo lo que se abre ahora.',
        successInsight: 'El número del token es una dirección. El significado es el vector al que lleva la dirección.',
        continueCta: 'Continúa a la demo',
        retryLink: 'Adivina otra vez',
        wrongTitle: 'Inténtalo de nuevo',
        retryButton: 'Inténtalo de nuevo',
    },

    // Puente al capítulo 5 (Semantic Space): tenemos un vector por frase, qué pasa al juntarlos
    bridge: 'Ahora tenemos un vector para cada frase. En el próximo capítulo veremos qué pasa cuando ponemos muchos de estos vectores juntos en un mismo espacio.',

    // Intuición perro/gato: vector aprendido vs aleatorio (See #1). Un ejemplo corto, no un mapa.
    dogCat: {
        eyebrow: 'Por qué "aprendido"',
        title: '¿Qué diferencia hay entre un vector aleatorio y uno aprendido?',
        body: 'El modelo aprendió que perro y gato aparecen en contextos parecidos, así que sus vectores pueden salir parecidos. Un vector aleatorio no sabría hacer eso, son solo números sin relación. Eso es lo que convierte un vector en un embedding: sus valores se aprendieron, no son aleatorios.',
        labelDog: 'Perro',
        labelCat: 'Gato',
        learnedTag: 'Aprendido de contextos parecidos',
        randomTag: 'Aleatorio, sin relación',
    },

    // De una tabla a un vector: el puente explícito del Token ID (dirección) al vector (contenido de la fila)
    embeddingTable: {
        title: '¿Cómo se convierte un Token ID en un Embedding?',
        lines: [
            'En el capítulo anterior cada token recibió un Token ID. El ID es una dirección: solo dice qué token es, no lo que significa.',
            'El modelo contiene una tabla de embeddings, una tabla grande de filas de números aprendidas durante el entrenamiento. El Token ID es el número de fila, y selecciona una fila de la tabla.',
            'Esa fila contiene una lista ordenada de números, el vector. Este es el embedding inicial del token. El modelo lo consulta en la tabla, no lo calcula a partir de los dígitos del ID.',
            'Todo embedding es un vector, pero no todo vector es un embedding. Un embedding es un vector cuyos valores se aprendieron para representar significado.',
            '¿Y de dónde se aprendieron esos valores? De los datos de entrenamiento, los textos con los que el modelo aprendió antes de tu conversación. Lo que apareció allí, y en qué contextos, influyó en lo que el modelo pudo aprender. Cuando un tema apareció poco, o solo en contextos limitados, el modelo tuvo menos información de la que poder aprender sobre él.',
        ],
        note: 'La mayoría de los números de una fila no tienen un nombre que una persona pueda leer. La tabla que se muestra aquí es una ilustración pequeña, con pocas filas y pocos valores. Una tabla real tiene muchos más tokens y muchas más dimensiones.',
    },

    // Entrenamiento vs inferencia: los valores se aprendieron una vez y se consultan en cada chat
    sequence: {
        eyebrow: 'De los tokens a la frase',
        title: '¿Y qué pasa con una frase entera?',
        intro: 'Una frase son varios tokens en fila, y cada token recorre el mismo camino por su cuenta.',
        steps: [
            {
                title: 'Cada token tiene su propio Token ID',
                body: 'La frase se divide en tokens, y cada token recibe su propio Token ID.',
            },
            {
                title: 'Cada Token ID consulta su propio Embedding',
                body: 'Cada Token ID apunta a su propia fila en la tabla y consulta de ella un vector aprendido. Así la frase empieza como una secuencia de embeddings, uno por token.',
            },
            {
                title: 'No hay una sola fila para la frase',
                body: 'No hay una sola fila en la tabla de embeddings que represente toda la frase. Hay una secuencia de filas, una por token.',
            },
        ],
        clarify: 'El Embedding que se consulta en la tabla es el punto de partida. Después las capas del modelo actualizarán la representación según el contexto y las palabras que la rodean.',
    },

    lab2: {
        eyebrow: 'Laboratorio 2',
        title: 'De la frase a una secuencia de Embeddings',
        goal: 'La frase llega como una secuencia de tokens. Aquí verás que cada token recibe su propio Token ID y consulta su propio Embedding, así que la frase empieza como una secuencia de embeddings, no una sola fila.',
        stepLabel: 'Paso',
        steps: [
            {
                title: 'Elige una frase y ejecútala',
                hint: 'Elige un escenario y pulsa "Reprodúcelo". La frase llega ya dividida en tokens, lista para inspeccionar.',
            },
            {
                title: 'Mira la secuencia de Token IDs',
                hint: 'Pulsa "Palabras / IDs" para ver todos los tokens como una secuencia de IDs. Cada token recibe su propio Token ID, y cada uno tiene su propia fila en la tabla. Pulsa un token para ver su dirección.',
            },
        ],
        conclusionLabel: 'Conclusión del laboratorio',
        waiting: {
            step2: 'Empieza por el Paso 1 y pulsa "Reprodúcelo". Después verás todos los tokens como una secuencia, cada uno con su propio Token ID.',
        },
    },

    labConclusion: {
        title: '¿Qué hemos visto?',
        body: 'Cada token de la frase tiene su propio Token ID, y cada Token ID consulta su propia fila en la tabla de embeddings. Viste una secuencia de Embeddings, no un solo Embedding consultado para toda la frase.',
    },

    trainingInference: {
        title: 'Aprendido una vez, consultado en cada chat',
        body: 'Los valores del vector se aprendieron una vez, durante el entrenamiento. En un chat el modelo no entrena un vector nuevo desde cero. Solo consulta el vector que ya aprendió, y luego las capas del modelo lo procesan según el contexto de la frase.',
    },

    // Laboratorio de búsqueda: de una palabra a números (Token ID -> fila de la tabla -> vector). La estructura vive en el componente.
    embeddingLookup: {
        eyebrow: 'Laboratorio: de una palabra a números',
        title: 'La máquina de Embedding',
        intro: 'Elige una palabra, mira su Token ID y sigue la fila que se resalta en la tabla de embedding. Eso es lo que el motor recibe de verdad.',
        pickWord: 'Elige una palabra',
        idNote: 'una dirección, no significado',
        tableTitle: 'La tabla de embeddings',
        tableHint: 'Una fila por token. El Token ID es el número de fila.',
        vectorTitle: 'El vector',
        vectorNote: 'Una lista de números. Este es el embedding de la palabra, y sobre esto calcula el motor.',
        rowShown: 'Ahora se muestra su fila aprendida.',
        switchHint: 'Cambia entre "Aprendido" y "Aleatorio" y descubre por qué no toda lista de números es un embedding.',
        learnedLabel: 'Aprendido',
        randomLabel: 'Aleatorio',
        learnedNote: 'Estos valores se aprendieron en el entrenamiento. Una fila así es un embedding: una representación numérica aprendida del token.',
        randomNote: 'Los números aleatorios son un vector, pero no un embedding. Nada en ellos se aprendió. Por eso todo embedding es un vector, pero no todo vector es un embedding. El estado aleatorio es solo un contraste didáctico, no lo que hace un modelo real.',
        viewWords: 'Lo que ves tú',
        viewNumbers: 'Lo que ve el motor',
        viewNote: 'El motor nunca ve palabras. Solo estos números.',
        disclaimer: 'Estos números son solo ilustrativos. Un vector real tiene cientos o miles de dimensiones no legibles para una persona.',
        words: {
            cat: 'el gato',
            dog: 'el perro',
            rain: 'la lluvia',
            music: 'la música',
            book: 'el libro',
            running: 'correr',
        },
    },

    // Bloqueo de comprensión: de dónde vienen los números del vector (entrenamiento vs inferencia). Correcta es índice 0.
    lock: {
        title: 'Comprueba tu comprensión',
        question: 'La palabra "gato" recibió un Token ID, y de él se consultó un vector. ¿De dónde vienen los números del vector?',
        options: [
            'Se aprendieron en el entrenamiento, y el modelo solo los consulta ahora',
            'El modelo los calculó ahora desde cero, solo para este chat',
            'Son la dirección de la palabra en el vocabulario',
        ],
        explanationCorrect:
            'Exacto. Los valores del vector se aprendieron en el entrenamiento. Durante un chat el modelo consulta el vector aprendido y lo procesa en contexto, no entrena un vector nuevo.',
        explanationWrong:
            'Casi. Los números no se calculan desde cero en cada chat, y no son la dirección. La dirección es el Token ID. Los valores del vector se aprendieron en el entrenamiento, y el modelo los consulta y los procesa en contexto.',
    },

    // Idea práctica
    practical: {
        title: 'Qué ganamos ahora que el texto es un vector',
        lead: 'Una vez que cada texto es un vector aprendido, podemos comparar y calcular sobre él. Eso impulsa mucho de lo que ya conoces.',
        uses: [
            'Búsqueda semántica y recuperación de fuentes, la base de RAG',
            'Clasificación de texto y detección de intención',
            'Agrupar consultas parecidas en un centro de soporte',
            'Decisiones de Agent según el perfil de significado',
        ],
        caveat:
            'Pero el vector representa significado, no comprueba si algo es verdad en el mundo. Cómo comparamos vectores, y cuándo la cercanía engaña, es justo el próximo capítulo.',
        mathOptionalLabel: 'Ampliación matemática opcional - no es necesaria para continuar el curso',
        mathLink:
            '¿Quieres las matemáticas de esta cercanía a fondo? El capítulo de Vectores, el corazón de todo modelo, en el curso de Matemática Intuitiva',
    },

    // Bajo el capó (se mantiene por forma; ya no es el envoltorio del laboratorio principal)
    hood: {
        eyebrow: 'Under the hood',
        title: 'Bajo el capó: de las palabras a los números',
        helper: 'Abre los laboratorios para ver cómo el texto se convierte en tokens, números y significado.',
        labsCount: '3 laboratorios interactivos dentro',
        intro: '¿Quieres ver el paso técnico bajo el significado? Cada palabra recibe un Token ID, y de la secuencia de IDs se construye un vector de significado. Ese es el perfil numérico que decide qué tan cerca están dos frases en significado.',
    },

    // La comprobación de conocimientos (texto visible; el esqueleto numérico está en quizData)
    quiz: chapter4Quiz,
};
