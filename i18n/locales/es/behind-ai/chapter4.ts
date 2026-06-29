// i18n/locales/es/behind-ai/chapter4.ts
// Capítulo 4 en español ("Embeddings: de un número sin sentido al significado").
// Fuente de forma: ../../he/behind-ai/chapter4 (el hebreo es canónico).
//
// Traducción real, español natural (no literal). Phone-first y listo para lectura en
// voz alta: frases cortas, sin párrafos densos. Se conserva el ancla de paquetes y
// envíos. Términos fijos: Embedding, Token ID, RAG, Agent, modelo. Sin guion largo
// (U+2014) ni guion medio (U+2013). Las burbujas del mentor no llevan emoji.
//
// Las cadenas del laboratorio (UniversalMeaningDemo, EmbeddingExperienceLab) vienen de
// chapter4Lab por el registro de contenido del laboratorio, así que no se repiten aquí.
// El esqueleto numérico de la prueba permanece en quizData.ts; aquí solo el texto
// visible (quiz.byId).

import type { Locale } from '@/i18n/config';
import { chapter4Quiz } from './chapter4Quiz';

export const chapter4 = {
    contentLocale: 'es' as Locale,

    // Hero
    hero: {
        badge: 'Behind the Scenes · 04',
        titleLead: '¿Cómo sabe la IA',
        titleHighlight: 'que dos frases diferentes significan lo mismo?',
        lede: 'Dos frases pueden usar palabras completamente distintas y aun así significar casi lo mismo. Para detectarlo, el modelo necesita una forma de comparar significado, no solo coincidir palabras. Un Embedding es la representación numérica que le permite medir qué tan cerca están dos frases en significado.',
        chipObject: 'Elige un objeto o una frase y mira qué es lo más cercano',
        chipMeaning: 'Palabras distintas pueden seguir estando cerca en significado',
    },

    // Burbujas de diálogo del mentor (solo texto; la pose y la ubicación son estructurales)
    mentor: {
        hero: 'El motor ve números, no palabras',
        lock: 'La cercanía no es verdad',
        practical: 'Cerca en significado, no necesariamente verdadero',
    },

    // Adivinanza rápida: solo texto; el icono, la respuesta correcta y las poses son estructurales
    guess: {
        eyebrow: 'Adivinanza rápida',
        title: 'Palabras distintas, misma intención. ¿Están cerca en significado?',
        subtitle: 'Dos mensajes de soporte sin una sola palabra en común. Adivina por el significado, no por las palabras.',
        prompt: '"El paquete no llegó" vs "El envío no fue entregado"',
        invite: 'Piensa en el significado, no en las palabras, y luego elige.',
        // Opciones por id estable (close es la correcta, far/letters son erróneas con un porqué)
        options: {
            close: {
                title: 'Sí, cerca',
                desc: 'Misma intención, aunque sin palabras compartidas',
            },
            far: {
                title: 'No, lejos',
                desc: 'Palabras distintas, así que significado distinto',
                why: 'Tiene sentido pensarlo, porque no comparten ninguna palabra. Pero un Embedding no compara palabras, compara significado, y la misma intención sigue cerca aunque sea con otras palabras.',
            },
            letters: {
                title: 'Depende de las palabras compartidas',
                desc: 'Necesitas palabras idénticas para estar cerca',
                why: 'Esa es la intuición de la búsqueda literal. Pero la cercanía en significado no se mide por palabras compartidas, sino por el significado mismo.',
            },
        },
        successTitle: '¡Exacto!',
        successExplain:
            'Los dos mensajes usan palabras distintas, pero describen casi el mismo problema: un paquete que no llegó o que no fue entregado. Por eso un Embedding los mide como cercanos en significado.',
        successInsight: 'El modelo no solo busca palabras idénticas. Busca significado similar.',
        continueCta: 'Continúa a la vista',
        retryLink: 'Adivina otra vez',
        wrongTitle: 'Inténtalo de nuevo',
        retryButton: 'Inténtalo de nuevo',
    },

    // Puente de los objetos a las frases
    bridge: 'Ahora usamos la misma idea con frases: aunque las palabras cambien, el significado puede seguir cerca.',

    // Asegura la idea: la cercanía no es verdad
    lock: {
        title: 'Asegura la idea',
        question: 'Dos frases salieron muy cerca en significado. ¿Qué significa eso?',
        options: ['Que su significado es cercano', 'Que ambas son verdaderas en la realidad', 'Que son en realidad la misma frase'],
        explanationCorrect:
            'Exacto. Aquí la cercanía significa que el significado es similar, no que algo sea verdadero. Un Embedding compara significado, no verifica qué pasó en el mundo.',
        explanationWrong:
            'Casi. La cercanía solo dice que el significado es similar. No verifica que algo sea verdadero, y no convierte dos frases en una.',
    },

    // Conclusión práctica
    practical: {
        title: 'Cuándo ayudan los Embeddings, y qué no hacen',
        lead: 'La cercanía en significado es una herramienta poderosa, y es justo lo que impulsa mucho de lo que ya usas.',
        uses: [
            'Búsqueda semántica y recuperación de fuentes, la base de RAG',
            'Clasificación de texto y detección de intención',
            'Agrupar mensajes similares en un centro de soporte',
            'Decisiones de un Agent según la cercanía de significado',
        ],
        caveat:
            'Pero la cercanía no es verdad. Un Embedding compara significado, no verifica si algo es verdadero y no entiende como una persona. Por eso una acción sensible necesita una fuente o una verificación, no solo cercanía.',
        mathLink:
            '¿Quieres las matemáticas de esta cercanía en profundidad? El capítulo Vectores, el corazón de todo modelo, en el curso de Matemática Intuitiva',
    },

    // Under the hood (secundario)
    hood: {
        eyebrow: 'Under the hood',
        title: 'De las palabras a los números',
        helper: 'Abre los laboratorios para ver cómo el texto se convierte en tokens, números y significado.',
        labsCount: '3 laboratorios interactivos dentro',
        intro: '¿Quieres ver el paso técnico bajo la cercanía? Cada palabra recibe un Token ID, y de la secuencia de IDs se construye un vector de significado. Ese es el perfil numérico que decide qué tan cerca están dos frases en significado.',
    },

    // La comprobación de conocimientos (texto visible; el esqueleto numérico está en quizData)
    quiz: chapter4Quiz,
};
