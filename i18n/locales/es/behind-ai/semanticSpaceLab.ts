// i18n/locales/es/behind-ai/semanticSpaceLab.ts
//
// Cadenas del laboratorio del capítulo 5 ("Semantic Space") en español internacional
// neutro. Trato de tú, consistente con el resto del capítulo.
//
// Las claves (ids de frases, claves de grupo) son estructurales y no se traducen; solo
// los valores. Las coordenadas viven en app/behind-the-scenes-ai/chapter-5/semanticSpace.ts.
//
// El par de negación es base='not-arrived' frente a opposite='arrived'. Las dos frases se
// mantienen lo más parecidas posible ("no llegó" frente a "llegó") para que un solo token,
// "no", sea exclusivo de la frase base y se resalte como el eje de la negación.
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
        explanation: 'Las dos frases comparten casi todas las palabras, por eso parecen cercanas. Pero una palabra, "no", invierte el significado por completo. Una dice que el paquete llegó y la otra que no llegó. La cercanía en palabras no garantiza el mismo significado.',
        bridge: 'Esto no contradice la regla del mapa. La cercanía en el espacio es una señal aprendida y útil, pero no perfecta: a veces una redacción casi idéntica esconde un significado opuesto. Por eso el modelo también debe considerar el contexto y las relaciones entre las palabras, no solo qué palabras aparecieron.',
    },

    clusters: {
        complaint: 'Reclamo del cliente',
        status: 'Estado del envío',
        action: 'Acción de servicio',
        unrelated: 'Sin relación',
    },

    phrases: {
        'not-arrived': 'El paquete no llegó',
        'customer-waiting': 'El cliente lleva una semana esperando',
        'not-received': 'No recibí mi pedido',
        'delayed': 'El envío viene con retraso',
        'status-not-updated': 'El estado no se actualizó',
        'courier-on-way': 'El repartidor va en camino',
        'arrived': 'El paquete llegó',
        'center-checking': 'Soporte está revisando el caso',
        'agent-contacted': 'Un agente contactó al cliente',
        'draft-update': 'Redacta un aviso para el cliente',
        'recipe': 'Una receta de pastel de chocolate',
        'weather': 'El pronóstico del tiempo de mañana',
    },

    disclaimer: 'Un mapa didáctico de solo dos dimensiones. Ilustra la idea de cercanía, pero las distancias dibujadas no son una copia exacta del espacio real.',
};
