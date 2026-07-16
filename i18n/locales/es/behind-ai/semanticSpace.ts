// i18n/locales/es/behind-ai/semanticSpace.ts
//
// Capítulo 5 ("Semantic Space") en español internacional neutro. Traducción completa: no
// queda ningún campo con respaldo en hebreo, y contentLocale es 'es', de modo que el
// capítulo se muestra y se lee en voz alta en español.
//
// Campos heredados del hebreo a propósito:
//   hero.badge          - la línea de marca "Behind the Scenes . 05", idéntica en todos los idiomas.
//   sections.labEyebrow - el nombre de producto del laboratorio ("Semantic Space Lab"), que
//                         se mantiene en inglés en todos los idiomas, incluido el hebreo.
//   mentor.hero / guess / negation / practical - el capítulo no los muestra; solo se ven
//                         mentor.lab y mentor.lock. Se heredan en lugar de inventar una
//                         traducción para texto que ningún estudiante llega a leer.
//
// Sin raya ni semirraya, según las reglas de texto del proyecto.

import type { Locale } from '@/i18n/config';
import { semanticSpace as he } from '../../he/behind-ai/semanticSpace';
import { semanticSpaceLab } from './semanticSpaceLab';
import { semanticSpaceQuiz } from './semanticSpaceQuiz';

export const semanticSpace: typeof he = {
    contentLocale: 'es' as Locale,

    hero: {
        badge: he.hero.badge,
        titleLead: 'Cada significado',
        titleHighlight: 'tiene un lugar en el mapa',
        lede: 'En el capítulo anterior vimos cómo una frase se convierte en un vector de significado, una lista de números. Ahora veremos dónde se ubica ese vector respecto a los demás. Cada frase es un punto en un espacio, y las frases cercanas en significado se ubican cerca una de otra. Así el modelo conecta "El paquete no llegó" con "El envío viene con retraso", aunque las palabras sean distintas.',
        chipMap: 'Arrastra una frase y mira quién está cerca',
        chipNeighbors: 'Descubre por qué una negación lo cambia todo',
    },

    mentor: {
        ...he.mentor,
        lab: 'Fíjate en la distancia, no en las palabras.',
        lock: 'Aquí hay una respuesta tentadora. Tómate un momento antes de elegir.',
    },

    plain: {
        eyebrow: 'En pocas palabras',
        title: 'Qué es un espacio de significado',
        paragraphs: [
            'En el capítulo anterior, cada frase se convirtió en una lista de números que el modelo aprendió, su embedding. Cada valor del vector describe la posición de la frase a lo largo de una dimensión, y todos los valores juntos deciden dónde se ubica en el espacio de significado. En ese espacio podemos comparar los embeddings y ver cuán cerca están dos representaciones entre sí. El mapa que ves aquí es solo una proyección simplificada en dos dimensiones, y un embedding real tiene muchas más dimensiones.',
            'El modelo coloca las frases de modo que las que comparten patrones que aprendió queden más cerca unas de otras. Eso es lo que le permite ordenar las frases y encontrar las más cercanas en significado, aunque no compartan ninguna palabra.',
            'Cerca significa que el modelo aprendió una relación entre las frases, y lejos significa que esa relación es débil. Pero la cercanía es solo una señal de una relación aprendida, no una prueba de que los dos significados sean idénticos.',
        ],
    },

    guess: {
        eyebrow: 'Adivinanza rápida . cercanía en el significado',
        title: '¿Qué frase es la más cercana en significado a "El paquete no llegó"?',
        subtitle: 'Elige la que te parezca más cercana. No hay puntaje, solo una dirección que muestra cómo el modelo entiende la cercanía.',
        prompt: '"El paquete no llegó"',
        invite: 'Antes de abrir esto, intenta adivinar qué frase verá el modelo como la más cercana en significado.',
        correctTitle: '¡Muy bien!',
        wrongTitle: '¡Casi!',
        getsRightLabel: 'Qué acierta esta opción',
        revealButton: 'Revela la idea central',
        revealTitle: '¿Y qué pasa en realidad?',
        revealCopy:
            'El modelo no cuenta palabras compartidas. Ubica cada frase en un espacio según su significado y mide quién está cerca. "El envío viene con retraso" es lo más cercano a "El paquete no llegó", aunque casi no comparten palabras, porque el significado es parecido. "El paquete llegó" en cambio está lejos en significado, aunque las palabras sean casi idénticas.',
        cta: 'Vamos a verlo en el laboratorio',
        resetButton: 'Elegir de nuevo',
        exploreHint: 'También puedes elegir otra opción y leer su explicación.',

        cards: {
            delayed: {
                title: 'El envío viene con retraso',
                desc: 'Palabras totalmente distintas, pero la misma idea: el paquete no está aquí a tiempo.',
                statusLabel: 'La más cercana en significado',
                getsRight: 'Exacto. Casi no comparten palabras y aun así el significado es casi el mismo. Las dos hablan de un paquete que se retrasa.',
                missesLabel: 'Qué queda por ver',
                misses: 'En el laboratorio veremos que esta frase es la que se ubica más cerca del ancla en el mapa del significado, a pesar de las palabras distintas.',
                bridge: 'La cercanía en el significado no depende de palabras idénticas.',
            },
            arrived: {
                title: 'El paquete llegó',
                desc: 'Casi las mismas palabras que la frase original, solo que sin el "no".',
                statusLabel: 'Una trampa frecuente',
                getsRight: 'Es tentador elegirla, porque las palabras son casi idénticas y la frase parece la más parecida.',
                missesLabel: 'Qué se le escapa',
                misses: 'Una palabra, "no", invierte el significado. Es exactamente lo contrario de "El paquete no llegó", no lo más cercano.',
                bridge: 'Compartir palabras no es compartir significado.',
            },
            checking: {
                title: 'Soporte está revisando el caso',
                desc: 'Del mismo mundo de los paquetes, pero describe una acción de servicio.',
                statusLabel: 'Mismo mundo, otro significado',
                getsRight: 'Es cierto que pertenece al mismo ámbito de paquetes y servicio.',
                missesLabel: 'Qué se le escapa',
                misses: 'Es una acción del equipo de soporte, no un estado del paquete. Cerca en el tema, pero no lo más cercano en significado a "no llegó".',
                bridge: 'El mismo ámbito no implica el mismo significado.',
            },
            recipe: {
                title: 'Una receta de pastel de chocolate',
                desc: 'Una frase de un mundo completamente distinto.',
                statusLabel: 'Sin relación',
                getsRight: 'Es fácil descartarla, y está bien que así sea.',
                missesLabel: 'Qué se le escapa',
                misses: 'Aquí no hay ninguna relación con los paquetes. En el mapa del significado se ubica muy lejos del ancla.',
                bridge: 'Las frases sin relación se ubican lejos en el espacio.',
            },
        },
    },

    sections: {
        labEyebrow: he.sections.labEyebrow,
        labTitle: 'Laboratorio del espacio de significado',
        labIntro:
            'Aquí no solo se mira, se actúa. En el primer experimento elige o arrastra una frase y observa qué vecinos son los más cercanos en significado. En el segundo revelaremos la trampa de la negación: dos frases que comparten casi las mismas palabras, pero dicen exactamente lo contrario.',
        dnaIntro:
            'Hasta aquí vimos dónde se ubica cada frase en el espacio. Ahora miraremos más de cerca el vector que la representa y veremos cómo su patrón de valores cambia de una frase a otra, y cómo ese patrón influye en la cercanía entre ellas.',
        dnaSelectorHint: 'Elige una frase en cada lado y compara cómo cambia el patrón de valores y de conexiones.',
    },

    explain: {
        title: 'Qué enseña el mapa',
        paragraphs: [
            'Cada frase recibió un lugar en el espacio según su significado. Las frases que el modelo ve como relacionadas se agruparon en zonas: los reclamos de clientes en una, los estados en otra, las acciones de servicio en una tercera, y las frases sin relación lejos, a un costado.',
            'La distancia es el significado. "Cerca" quiere decir que el modelo ve una relación, "lejos" quiere decir que la relación es débil. Por eso "El paquete no llegó" y "El envío viene con retraso" quedan pegados, incluso sin palabras en común.',
            'Y una palabra sobre el mapa mismo: es una ilustración didáctica, no el espacio en el que el modelo trabaja realmente. Lo mostramos en dos dimensiones para que la idea se pudiera ver, pero el espacio real tiene cientos o miles de dimensiones. Las dimensiones aisladas normalmente no tienen un nombre simple que una persona pueda leer como una "propiedad". Por eso el mapa ayuda a entender la idea de cercanía, pero no hay que tomar las distancias dibujadas en él como una medición exacta ni absoluta del espacio real.',
        ],
    },

    lock: {
        title: 'Consolida la idea',
        question: 'Dos frases están cerca una de otra en el espacio de significado. ¿Qué puedes concluir con cautela de eso?',
        options: [
            'Que las dos frases tienen un significado idéntico.',
            'Que sus representaciones son similares según la medida que se usa, pero no necesariamente que su significado sea el mismo ni que la información que contienen sea correcta.',
            'Que las dos frases usan exactamente las mismas palabras.',
        ],
        explanationCorrect:
            'La cercanía en el espacio señala una similitud entre las representaciones según la medida de comparación, pero no prueba que el significado sea el mismo ni que la información sea correcta. Incluso una sola palabra de negación puede cambiar el significado de una frase y aun así dejar las representaciones cerca.',
        explanationWrong:
            'La cercanía en el espacio no garantiza un significado idéntico ni exige usar las mismas palabras. Solo señala una similitud entre las representaciones según la medida de comparación.',
    },

    practical: {
        title: 'Cómo te ayuda esto a escribir un prompt mejor',
        lead: 'El modelo se apoya en la cercanía de significado, así que conviene ayudarlo a ubicar bien tu pedido.',
        uses: [
            'Da contexto. Un prompt demasiado corto puede aterrizar en la zona equivocada del mapa.',
            'Evita una redacción corta y vaga cuando el significado depende de los detalles.',
            'Di explícitamente qué relación te importa, por ejemplo "compara el significado" y no solo "compara".',
            'Pídele al modelo que compare el significado, no que solo repita palabras.',
        ],
        caveat: 'Y recuerda: la cercanía en el espacio ayuda a relacionar, pero no es una prueba de que algo sea correcto. Una negación, un matiz o un detalle pequeño pueden invertir el significado.',
        bridge: 'En el próximo capítulo, Attention, veremos cómo el modelo decide qué palabras importan en este momento, y así entiende cómo un pequeño "no" cambia toda la frase.',
    },

    lab: semanticSpaceLab,
    quiz: semanticSpaceQuiz,
};
