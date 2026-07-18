// i18n/locales/es/behind-ai/semanticSpace.ts
//
// Capítulo 5 ("Semantic Space") en español internacional neutro. Traducción completa: no
// queda ningún campo con respaldo en hebreo, y contentLocale es 'es', de modo que el
// capítulo se muestra y se lee en voz alta en español.
//
// Campos heredados del hebreo a propósito:
//   hero.badge          - la línea de marca "Behind the Scenes · 05", idéntica en todos los idiomas.
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
        lede: '"El paquete no llegó" y "El envío viene con retraso" casi no comparten palabras y, aun así, el modelo entiende que dicen casi lo mismo. ¿Cómo consigue acercar dos frases redactadas de forma tan distinta? Para responderlo, tendremos que ver dónde se ubica cada frase y en qué espacio se mide.',
        chipMap: 'Elige una frase y mira quién está cerca',
        chipNeighbors: 'Descubre por qué una negación lo cambia todo',
    },

    mentor: {
        ...he.mentor,
        lab: 'Fíjate en la distancia, no en las palabras.',
        lock: 'Aquí hay una respuesta tentadora. Tómate un momento antes de elegir.',
    },

    plain: {
        eyebrow: 'En pocas palabras',
        title: 'Del embedding al espacio de significado',
        paragraphs: [
            'En el capítulo anterior, cada frase se convirtió en un embedding: la lista de números que el modelo aprendió para ella. Puedes pensar en esa lista como una dirección. Cada número es una coordenada, y todos juntos deciden a qué punto apunta la frase.',
            'El espacio de significado es el espacio compartido donde conviven todas esas direcciones. Allí puedes comparar los embeddings de frases distintas y ver quién está cerca de quién. Cuando el modelo coloca dos embeddings cerca, suele significar que sus representaciones son parecidas.',
            'En pantalla dibujamos cada frase como un solo punto en un mapa plano, y eso es solo una simplificación didáctica: un embedding real tiene muchas más de dos dimensiones. El mapa ayuda a ver la idea de cercanía, pero no es el espacio en el que el modelo trabaja realmente.',
        ],
    },

    guess: {
        eyebrow: 'Adivinanza rápida · cercanía en el significado',
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
            'El modelo no cuenta palabras compartidas. Ubica cada frase en un espacio según su significado y mide quién está cerca. "El envío viene con retraso" es lo más cercano a "El paquete no llegó", aunque casi no comparten palabras, porque el significado es parecido. "El paquete llegó" comparte casi las mismas palabras, pero invierte el significado, así que no es la más cercana.',
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
            'Aquí no solo se mira, se actúa. En el primer experimento elige una frase y observa qué vecinos son los más cercanos en significado. En el segundo revelaremos la trampa de la negación: dos frases que comparten casi las mismas palabras, pero dicen exactamente lo contrario.',
        dnaTitle: 'Por qué dos frases aparecen cerca',
        dnaStripTitle: 'El patrón de valores de cada frase',
        dnaIntro:
            'Vimos dónde se ubica cada frase, pero ¿por qué aparecen cerca dos frases redactadas de forma tan distinta? Aquí abrimos el embedding de cada frase y comparamos su patrón de valores con el de otra. Cuando los patrones generales son parecidos, los dos embeddings reciben posiciones cercanas en el espacio, y esa es la cercanía de significado que vimos en el mapa. Las tiras aquí son una ilustración del patrón, no una lista de rasgos con un nombre fijo para cada dimensión.',
        dnaSelectorHint: 'Elige una frase en cada lado y observa cuánto comparten del patrón de valores, y cómo eso coincide con su cercanía en el mapa.',
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
