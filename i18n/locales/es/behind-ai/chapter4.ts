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
        titleLead: 'Cómo se convierte el texto',
        titleHighlight: 'en un número con significado?',
        lede: 'El motor no ve palabras. Cada palabra se convierte en un token, cada token recibe un número identificador, y el número apunta a una fila en una tabla enorme. Esa fila es un vector, una lista de números que el modelo aprendió para representar el significado. Eso es el embedding.',
        chipObject: 'Sigue una palabra mientras se convierte en un número',
        chipMeaning: 'Mira cómo se construye el vector de significado',
    },

    // Burbujas del mentor (solo texto; la pose y la ubicación son estructurales en la página)
    mentor: {
        hero: 'El motor ve números, no palabras',
        lock: 'Aprendido en el entrenamiento, consultado en un chat',
        practical: 'El texto se volvió número, ahora podemos calcular',
    },

    // Adivinanza rápida: solo texto; el icono, la respuesta correcta y las poses son estructurales.
    // Los ids de opción (address/meaning/importance) son claves estables de la página, no se traducen.
    // address = la respuesta correcta, meaning/importance = incorrectas, con un why.
    guess: {
        eyebrow: 'Adivinanza rápida',
        title: 'La palabra "no" recibe el número 17. ¿Qué es ese número?',
        subtitle: 'Adivina por lo que ya sabes sobre tokens.',
        prompt: '"no" → 17',
        invite: 'Piensa un segundo: ¿ese número ya es el significado, o solo una dirección?',
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

    // En palabras simples: qué es de verdad un embedding (tras la adivinanza, antes de la demo)
    plain: {
        eyebrow: 'En palabras simples',
        title: '¿Entonces qué es de verdad un embedding?',
        lines: [
            'Cada token recibe un número identificador, y el número apunta a una fila fija en una tabla.',
            'La fila es un vector: una lista de números, no un solo número.',
            'Estos números se aprendieron en el entrenamiento, para que el vector represente el significado del token. Un vector así se llama embedding.',
            'Todo embedding es un vector, pero no todo vector es un embedding. Un embedding es un vector que el modelo aprendió para representar significado.',
        ],
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
        title: 'De una tabla a un vector',
        body: 'La tabla de embeddings es una lista enorme de filas, una fila por cada token del vocabulario. El Token ID es el número de fila. El modelo va a esa fila, y su contenido es el vector. Así una dirección se convierte en una lista de números que representa significado.',
    },

    // Entrenamiento vs inferencia: los valores se aprendieron una vez y se consultan en cada chat
    trainingInference: {
        title: 'Aprendido una vez, consultado en cada chat',
        body: 'Los valores del vector se aprendieron una vez, durante el entrenamiento. En un chat el modelo no entrena un vector nuevo desde cero. Solo consulta el vector que ya aprendió, y luego las capas del modelo lo procesan según el contexto de la frase.',
    },

    // Laboratorio de búsqueda: de una palabra a números (Token ID -> fila de la tabla -> vector). La estructura vive en el componente.
    embeddingLookup: {
        eyebrow: 'Laboratorio: de una palabra a números',
        title: 'La máquina de Embedding',
        intro: 'Elige una palabra y síguela mientras se convierte en un número identificador y luego en una fila de números en una tabla. Eso es lo que el motor recibe de verdad.',
        pickWord: 'Elige una palabra',
        idNote: 'una dirección, no significado',
        tableTitle: 'La tabla de embeddings',
        tableHint: 'Una fila por token. El Token ID es el número de fila.',
        vectorTitle: 'El vector',
        vectorNote: 'Una lista de números. Este es el embedding de la palabra, y sobre esto calcula el motor.',
        learnedLabel: 'Aprendido',
        randomLabel: 'Aleatorio',
        learnedNote: 'Estos valores se aprendieron en el entrenamiento. Una fila así es un embedding: un vector con significado aprendido.',
        randomNote: 'Los números aleatorios son un vector, pero no un embedding. Nada en ellos se aprendió. Por eso todo embedding es un vector, pero no todo vector es un embedding.',
        viewWords: 'Lo que ves tú',
        viewNumbers: 'Lo que ve el motor',
        viewNote: 'El motor nunca ve palabras. Solo estos números.',
        disclaimer: 'Estos números son solo ilustrativos. Un vector real tiene cientos o miles de dimensiones no legibles para una persona.',
        words: {
            pkg: 'el paquete',
            not: 'no',
            arrived: 'llegó',
            shipment: 'el envío',
            lost: 'perdido',
            tracking: 'seguimiento',
        },
    },

    // Bloqueo de comprensión: de dónde vienen los números del vector (entrenamiento vs inferencia). Correcta es índice 0.
    lock: {
        title: 'Bloqueo de comprensión',
        question: 'La palabra "paquete" recibió un Token ID, y de él se consultó un vector. ¿De dónde vienen los números del vector?',
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
