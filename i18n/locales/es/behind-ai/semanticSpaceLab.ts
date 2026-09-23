// i18n/locales/es/behind-ai/semanticSpaceLab.ts
//
// Cadenas del laboratorio del capítulo 5 ("Semantic Space") en español internacional
// neutro. Trato de tú, consistente con el resto del capítulo.
//
// Las claves (ids de frases, claves de grupo) son estructurales y no se traducen; solo
// los valores. Las coordenadas viven en app/behind-the-scenes-ai/chapter-5/semanticSpace.ts.
//
// El par de negación es base='not-arrived' frente a opposite='arrived'. Las dos frases se
// mantienen lo más parecidas posible ("no está abierta" frente a "está abierta") para que
// un solo token, "no", sea exclusivo de la frase base y se resalte como el eje de la
// negación.
//
// Los ids de las frases (not-arrived/delayed/arrived/etc.) se mantienen como claves
// internas opacas aunque el significado traducido detrás de ellas cambió por completo
// (del antiguo dominio postal a un dominio cotidiano de ventana/habitación). Renombrarlos
// no aportaba valor al alumno y habría exigido tocar semanticSpace.test.ts, ANCHOR_ID y
// NEGATION_PAIR.
//
// Sin raya ni semirraya, según las reglas de texto del proyecto.

import type { SemanticSpaceLabDict } from '../../he/behind-ai/semanticSpaceLab';

export const semanticSpaceLab: SemanticSpaceLabDict = {
    selector: {
        label: 'Elige un experimento',
        map: 'Vecinos en el espacio',
        negation: 'La trampa de la negación',
    },

    map: {
        title: 'El mapa del significado',
        subtitle: 'Elige una frase',
        legendTitle: 'Zonas de significado',
        neighborsTitle: 'Los vecinos más cercanos',
        neighborsSubtitle: 'Por cercanía en el espacio',
        closenessTo: 'Cercanía a',
        closest: 'La más cercana',
        toneNear: 'Cerca en el mapa',
        toneMid: 'Distancia media en el mapa',
        toneFar: 'Lejos en el mapa',
        closestNow: 'La frase más cercana ahora es:',
        selectHint: 'Elige una frase en el mapa y observa cómo la lista de vecinos cercanos se actualiza de inmediato.',
        note: 'La distancia en el mapa es el significado. Una frase cercana es una que el modelo considera relacionada, aunque las palabras sean distintas. Una frase lejana tiene una relación débil.',
    },

    negation: {
        title: 'Cerca en palabras, opuesto en significado',
        subtitle: 'Dos frases, casi las mismas palabras',
        baseLabel: 'La frase original',
        oppositeLabel: 'Sin la palabra de negación',
        sharedChip: 'Casi las mismas palabras',
        oppositeChip: 'Significado opuesto',
        revealButton: 'Qué nos enseña esto',
        explanation: 'Las dos frases comparten casi todas las palabras, por eso parecen cercanas. Pero una palabra, "no", invierte el significado por completo. Una dice que la ventana está abierta y la otra que no lo está. La cercanía en palabras no garantiza el mismo significado.',
        bridge: 'Esto no contradice la regla del mapa. La cercanía en el espacio es una señal aprendida y útil, pero no perfecta: a veces una redacción casi idéntica esconde un significado opuesto. Por eso el modelo también debe considerar el contexto y las relaciones entre las palabras, no solo qué palabras aparecieron.',
    },

    clusters: {
        complaint: 'Malestar',
        status: 'Estado de la habitación',
        action: 'Actividad cotidiana',
        unrelated: 'Sin relación',
    },

    phrases: {
        'not-arrived': 'La ventana no está abierta',
        'customer-waiting': 'Tengo demasiado calor',
        'not-received': 'Aquí hace bochorno',
        'delayed': 'Lo dejaron cerrado desde la mañana',
        'status-not-updated': 'El aire acondicionado está apagado',
        'courier-on-way': 'Hay que ventilar la habitación',
        'arrived': 'La ventana está abierta',
        'center-checking': 'Ella está regando las plantas',
        'agent-contacted': 'Él apagó todas las luces',
        'draft-update': 'Ellos están limpiando la cocina',
        'recipe': 'Una receta de pastel de chocolate',
        'weather': 'El pronóstico del tiempo de mañana',
    },

    disclaimer: 'Un mapa didáctico de solo dos dimensiones. Ilustra la idea de cercanía, pero las distancias dibujadas no son una copia exacta del espacio real.',
};
