// i18n/locales/es/behind-ai/chapter4Lab.ts
// Contenido en español del laboratorio de Embeddings del capítulo 4 (Chapter4LabDict).
// Fuente de forma: app/behind-the-scenes-ai/chapter-4/labContent (Chapter4LabDict es canónico).
//
// Módulo de datos solamente (import de tipo, borrado en la build). Se carga por el
// registro de contenido del laboratorio en el cliente, no por el diccionario i18n, para
// mantener un límite servidor/cliente limpio.
//
// Las claves estructurales no se traducen: sentence ids, chip ids, magnet ids y dim keys
// permanecen estables. Los tokens se escriben a mano, nunca por división de espacios.
// Sin guion largo (U+2014) ni guion medio (U+2013).

import type { Chapter4LabDict } from '@/app/behind-the-scenes-ai/chapter-4/labContent';

export const chapter4Lab: Chapter4LabDict = {
    sentences: {
        'pkg-not-arrived': {
            text: 'El paquete no llegó',
            tokens: ['El', 'paquete', 'no', 'llegó'],
            ttsLine: 'El paquete no llegó. Una queja sobre un fallo de entrega, alto en la dirección de fallo.',
            swaps: {
                'to-arrived': { label: 'llegó', from: 'no llegó' },
            },
        },
        'delivery-not-handed': {
            text: 'El envío no fue entregado',
            tokens: ['El', 'envío', 'no', 'fue', 'entregado'],
            ttsLine: 'El envío no fue entregado. Palabras totalmente distintas, pero la misma dirección de significado.',
        },
        'pkg-arrived': {
            text: 'El paquete llegó',
            tokens: ['El', 'paquete', 'llegó'],
            ttsLine: 'El paquete llegó. El mismo dominio de entrega, pero sin fallo, así que el punto se mueve.',
        },
        'system-not-showing': {
            text: 'El sistema no muestra el paquete',
            tokens: ['El', 'sistema', 'no', 'muestra', 'el', 'paquete'],
            ttsLine: 'El sistema no muestra el paquete. Un fallo del sistema, no un problema de entrega.',
        },
        'billing-address-update': {
            text: 'Actualizamos la dirección de facturación',
            tokens: ['Actualizamos', 'la', 'dirección', 'de', 'facturación'],
            ttsLine: 'Actualizamos la dirección de facturación. Un tema lejano a la entrega, así que cae lejos en el mapa.',
        },
        'agent-investigate-delay': {
            text: 'Revisa por qué el paquete no llegó',
            tokens: ['Revisa', 'por', 'qué', 'el', 'paquete', 'no', 'llegó'],
            ttsLine: 'Revisa por qué el paquete no llegó. Una solicitud de investigación segura, riesgo bajo.',
        },
        'agent-notify-lost': {
            text: 'Envía un mensaje al cliente de que el paquete se perdió',
            tokens: ['Envía', 'un', 'mensaje', 'al', 'cliente', 'de', 'que', 'el', 'paquete', 'se', 'perdió'],
            ttsLine: 'Envía un mensaje al cliente de que el paquete se perdió. Una acción de cara al cliente que requiere aprobación.',
        },
    },

    map: {
        closestTag: 'Lo más cercano',
        honest: 'Un Embedding ayuda a comparar significado. No prueba qué pasó en realidad.',

        visualTitle: 'Primero, cercanía simple',
        visualSubtitle: 'Las cosas con significado similar aparecen más cerca. Elige un objeto y mira qué es lo más cercano.',
        ruleLine: 'Las cosas con significado similar están más cerca.',
        objects: {
            dog: 'Perro',
            cat: 'Gato',
            apple: 'Manzana',
            cucumber: 'Pepino',
            computer: 'Computadora',
        },
        objectExplain: {
            dog: 'Perro y gato están cerca porque ambos son animales.',
            cat: 'Perro y gato están cerca porque ambos son animales.',
            apple: 'Manzana y pepino están cerca porque ambos son comida.',
            cucumber: 'Manzana y pepino están cerca porque ambos son comida.',
            computer: 'La computadora está más lejos porque pertenece al mundo de la tecnología.',
        },
        objectSelected: 'Objeto seleccionado',
        objectClosest: 'Lo más cercano',
        objectNoClose: 'Lejos del resto',
        numericTitle: 'Representación numérica',
        numericNote: 'Los objetos parecidos en significado reciben números parecidos, por eso están cerca en el mapa. Un vector aleatorio no los agruparía.',
        numericDisclaimer: 'Los números son solo ilustrativos. Un espacio real tiene cientos de dimensiones no legibles para una persona.',

        packageTitle: 'Cercanía de significado entre frases',
        packageSubtitle: 'Frases distintas pueden estar cerca si describen una idea similar.',
        centerLabel: 'Frase seleccionada',
        closestLabel: 'Lo más cercano en significado',
        packageRule: 'El modelo no solo busca palabras idénticas. Compara cercanía de significado.',
        cards: {
            'pkg-not-arrived': { shortLabel: 'No llegó', chips: ['Problema de entrega', 'Estado del paquete'] },
            'delivery-not-handed': { shortLabel: 'No entregado', chips: ['Problema de entrega', 'Estado del paquete'] },
            'pkg-arrived': { shortLabel: 'Llegó', chips: ['Estado del paquete'] },
            'system-not-showing': { shortLabel: 'No se muestra', chips: ['Estado del paquete'] },
            'billing-address-update': { shortLabel: 'Dirección de facturación', chips: ['Facturación'] },
            'agent-investigate-delay': { shortLabel: 'Revisión de estado', chips: ['Consulta', 'Estado del paquete'] },
            'agent-notify-lost': { shortLabel: 'Paquete perdido', chips: ['Acción', 'Excepción'] },
        },

        proofTitle: 'Prueba y explicación',
        proofLead: 'Después de ver qué está cerca de qué, podemos ver por qué: qué componentes de significado se comparten, y qué fuerzas moldearon la representación.',

        relationTitle: '¿Qué está cerca de qué?',
        coreRule: 'Más cerca significa más similar en significado. Más lejos significa menos similar.',
        relClosest: 'Lo más cercano',
        relRelated: 'Relacionado pero distinto',
        relFar: 'Más lejos',
        objectRows: [
            { pair: 'Perro está cerca de gato', reason: 'porque ambos son animales.' },
            { pair: 'Manzana está cerca de pepino', reason: 'porque ambos son comida.' },
            { pair: 'La computadora está lejos de ellos', reason: 'porque pertenece al mundo de la tecnología.' },
        ],
        relations: {
            'pkg-not-arrived': {
                closestId: 'delivery-not-handed',
                relatedId: 'agent-notify-lost',
                farId: 'billing-address-update',
                reasonClosest: 'Ambos describen un problema de entrega.',
                reasonRelated: 'Todavía ligado al problema del paquete, pero ya es una acción que lo sigue.',
                reasonFar: 'Trata sobre detalles de facturación, no un problema de entrega.',
            },
            'delivery-not-handed': {
                closestId: 'pkg-not-arrived',
                relatedId: 'agent-notify-lost',
                farId: 'billing-address-update',
                reasonClosest: 'Ambos describen un problema de entrega.',
                reasonRelated: 'Ligado al mismo problema, pero ya es una acción de cara al cliente.',
                reasonFar: 'Trata sobre detalles de facturación, no la entrega.',
            },
            'pkg-arrived': {
                closestId: 'delivery-not-handed',
                relatedId: 'agent-investigate-delay',
                farId: 'billing-address-update',
                reasonClosest: 'El mismo mundo de la entrega de paquetes.',
                reasonRelated: 'El mismo dominio, pero es una solicitud para revisar, no una descripción de un estado.',
                reasonFar: 'Trata sobre facturación, un tema completamente distinto.',
            },
            'system-not-showing': {
                closestId: 'pkg-not-arrived',
                relatedId: 'agent-investigate-delay',
                farId: 'billing-address-update',
                reasonClosest: 'Ambos tratan sobre un paquete donde algo salió mal.',
                reasonRelated: 'Relacionado, pero es una solicitud de acción para revisar.',
                reasonFar: 'Trata sobre facturación, no un problema del paquete.',
            },
            'billing-address-update': {
                closestId: 'system-not-showing',
                relatedId: 'pkg-not-arrived',
                farId: 'agent-notify-lost',
                reasonClosest: 'Ambos tocan detalles en el sistema, no la entrega en sí.',
                reasonRelated: 'Esto también es envío, pero es un problema de entrega, no de facturación.',
                reasonFar: 'Esta es una acción de cara al cliente sobre un paquete perdido, lejos de la facturación.',
            },
            'agent-investigate-delay': {
                closestId: 'pkg-not-arrived',
                relatedId: 'agent-notify-lost',
                farId: 'billing-address-update',
                reasonClosest: 'Ambos tratan sobre un paquete que no llegó, aquí como una solicitud para revisar.',
                reasonRelated: 'Ambas son acciones, pero esta informa al cliente.',
                reasonFar: 'Trata sobre facturación, no revisar una entrega.',
            },
            'agent-notify-lost': {
                closestId: 'agent-investigate-delay',
                relatedId: 'pkg-not-arrived',
                farId: 'billing-address-update',
                reasonClosest: 'Ambas son acciones en torno a un paquete que salió mal.',
                reasonRelated: 'Ligado al problema en sí, pero esto es solo una descripción del problema, no una acción.',
                reasonFar: 'Trata sobre facturación, un tema distinto.',
            },
        },
        howto: {
            title: '¿Cómo se lee la vista?',
            rowPoint: 'Tarjeta = frase',
            rowClose: 'Cerca = significado similar',
            rowFar: 'Lejos = menos similar',
            rowSwap: 'Cambiar una palabra puede acercar o alejar',
            legendWhy: '¿Por qué están cerca o lejos? Mira el ADN y las fuerzas de significado.',
        },
    },

    magnets: {
        delivery: 'Entrega',
        delay: 'Retraso',
        complaint: 'Queja',
        tracking: 'Seguimiento',
        refund: 'Reembolso',
        risk: 'Riesgo',
    },

    genes: {
        delivery: 'Entrega',
        system: 'Sistema',
        address: 'Dirección',
        payment: 'Pago',
        urgency: 'Urgencia',
        failure: 'Fallo',
        action: 'Acción',
        risk: 'Riesgo',
        customer: 'Cliente',
        permission: 'Aprobación',
    },

    dna: {
        title: 'El significado dentro del vector',
        intro: 'El vector no es un solo número. Es un perfil de componentes de significado que el modelo aprendió. Cada peldaño es un componente de significado, y la altura del nodo muestra qué tan fuerte es ese componente en la frase.',
        roleActive: 'tu frase',
        roleCompare: 'comparada',
        twistMeaning: 'Cuanto más cercano es el significado de las dos frases, más se enrollan juntas las hebras. Cuando el significado deriva, se separan.',
        leadShared: (names) => `Las dos frases son fuertes en los mismos componentes de significado: ${names}. Por eso están cerca.`,
        leadNone: 'Las dos frases activan componentes distintos, así que están más lejos.',
        sharedBadge: 'compartido',
        guideSize: 'Un nodo más grande significa que el componente es más fuerte en esa frase.',
        guideBond: 'Un enlace verde que late indica un componente compartido, y eso es lo que acerca el significado.',
        stayedClose: 'El significado se mantuvo cerca',
        drifted: 'El significado derivó',
        axesNote: 'Los ejes aquí son etiquetas educativas. En un modelo real el vector tiene cientos o miles de dimensiones numéricas que no se leen como rasgos humanos.',
    },

    controls: {
        pickSentence: 'Elige una frase',
        swapTitle: '¿Qué pasa si cambiamos una palabra?',
        swapHint: 'Un pequeño cambio en la redacción puede acercar o alejar el significado.',
        resetSwap: 'Volver a la frase original',
    },

    fallback: {
        missingSentence: 'Contenido faltante',
    },

    ui: {
        magnetTitle: 'Fuerzas de significado',
    },

    explain: {
        title: 'Guía rápida',
        mapShadow: 'El mapa es una sombra plana de un espacio de significado mucho más grande.',
        close: 'Los puntos cercanos suelen representar significado similar.',
        far: 'Un punto lejano no está mal, solo es menos similar en significado.',
        regions: 'Los halos de color son vecindarios de significado, no fronteras nítidas.',
        forces: 'Las fuerzas de significado muestran qué señales atrajeron la frase en esta dirección.',
        dna: 'El ADN prueba por qué dos frases están cerca: los mismos componentes de significado se encienden con una fuerza similar.',
        notTruth: 'Un Embedding ayuda a comparar significado. No prueba qué pasó en realidad.',
    },
};
