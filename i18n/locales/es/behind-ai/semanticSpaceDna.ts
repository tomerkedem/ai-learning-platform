// i18n/locales/es/behind-ai/semanticSpaceDna.ts
//
// Contenido en español para la sección de comparación de ADN semántico del capítulo 5.
// Es un conjunto de datos independiente del capítulo 5, no depende de chapter4Lab ni de
// los SENTENCE_STRUCTS del capítulo 4.
//
// Sin raya ni semirraya, según las reglas de texto del proyecto.

import type { semanticSpaceDna as HeDna } from '../../he/behind-ai/semanticSpaceDna';

export const semanticSpaceDna: typeof HeDna = {
    sentences: {
        'window-not-open': { text: 'La ventana no está abierta', ttsLine: 'La ventana no está abierta. Una queja sobre la habitación, alta en cierre.' },
        'window-shut': { text: 'La ventana está cerrada', ttsLine: 'La ventana está cerrada. Otras palabras, pero el mismo sentido.' },
        'window-is-open': { text: 'La ventana está abierta', ttsLine: 'La ventana está abierta. Mismo tema, pero sin cierre, así que el patrón cambió.' },
        'room-is-cold': { text: 'La habitación está fría', ttsLine: 'La habitación está fría. Malestar parecido, pero no sobre si la ventana está cerrada.' },
        'cat-on-couch': { text: 'El gato está durmiendo en el sofá', ttsLine: 'El gato está durmiendo en el sofá. Una frase de otro mundo, sin relación con la habitación.' },
    },

    genes: {
        roomRelevance: 'Relación con la habitación',
        closedness: 'Cierre de la ventana',
        discomfort: 'Malestar',
    },

    dna: {
        title: 'El significado dentro del vector',
        intro: 'El vector no es un solo número. Es un perfil de componentes de significado que el modelo aprendió. Cada peldaño de la escalera es un componente de significado, y el tamaño del nodo muestra cuán fuerte es ese componente en la frase.',
        roleActive: 'Elegiste',
        roleCompare: 'Comparado con',
        twistMeaning: 'Cuanto más cercano es el significado de las dos frases, más ajustadas se enroscan las hebras. Cuando el significado se aleja, se separan.',
        leadShared: (names) => `Las dos frases son fuertes en los mismos componentes de significado: ${names}. Por eso están cerca.`,
        leadNone: 'Las dos frases activan componentes distintos, así que están más alejadas.',
        sharedBadge: 'Compartido',
        guideSize: 'Un nodo más grande significa que el componente es más fuerte en esa frase.',
        guideBond: 'Un vínculo verde pulsante significa un componente compartido por ambas frases, y eso es lo que acerca el significado.',
        stayedClose: 'El significado se mantuvo cercano',
        drifted: 'El significado se alejó',
        axesNote: 'Los ejes aquí son etiquetas didácticas. En un modelo real el vector contiene cientos o miles de dimensiones numéricas que no se leen como rasgos humanos.',
    },
};
