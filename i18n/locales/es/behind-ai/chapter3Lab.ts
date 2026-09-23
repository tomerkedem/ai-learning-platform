// i18n/locales/es/behind-ai/chapter3Lab.ts
// Spanish content for the chapter 3 tokenization lab (Chapter3LabContent).
// Shape source: app/behind-the-scenes-ai/chapter-3/labContent (HE_LAB_CONTENT is canonical).
//
// Plain data module (type-only imports). Wired through the client labContent registry,
// not the i18n dictionary. Structural keys (scenario ids, modes, accents, role keys,
// roadmap active flags) are NOT translated. English secondary captions stay English.
// No em dash (U+2014), no en dash (U+2013).

import type { Chapter3LabContent } from '@/app/behind-the-scenes-ai/chapter-3/labContent';

export const chapter3Lab: Chapter3LabContent = {
    modeLabel: 'Modo:',

    splitter: {
        hint: 'Escribe una frase y se dividirá en tokens en tiempo real.',
        placeholder: 'Por ejemplo: La ropa no se seco',
        aria: 'Campo de texto para dividir en tokens',
        quickLabel: 'Experimentos rápidos:',
        resetLabel: 'Reiniciar',
    },

    stream: {
        title: 'Flujo de tokens',
        titleEn: 'Token Stream',
        empty: 'Escribe algo de texto y se dividirá en tokens aquí.',
        hint: 'Toca un token para ver su rol.',
        rail: {
            input: { label: 'Texto de entrada', en: 'Input Text' },
            tokenizer: { label: 'Tokenizador', en: 'Tokenizer' },
            stream: { label: 'Flujo de tokens', en: 'Token Stream' },
        },
    },

    legend: {
        title: 'Mapa de colores de tokens',
        titleEn: 'Token Color Map',
    },

    count: {
        title: 'Contador de tokens',
        titleEn: 'Token Count',
        note: 'Este número se conecta más adelante con la ventana de contexto: cuántos tokens puede sostener un modelo a la vez. Aquí solo plantamos la idea.',
    },

    roleCard: {
        closeAria: 'Cerrar la tarjeta de rol',
    },

    signals: {
        number: { label: 'Token numérico', en: 'Number token' },
        action: { label: 'Señal de acción', en: 'Action signal' },
        deliveryFailure: { label: 'Señal de negación', en: 'Negation signal' },
        sortingCenter: { label: 'Taza de café', en: 'Coffee cup phrase' },
    },

    noSpaceNote:
        'Sin espacios, este tokenizador educativo ve una sola unidad larga. Un tokenizador real la dividiría igualmente en subpalabras, porque no depende solo de los espacios. Por eso un token no es necesariamente una palabra.',

    educational: {
        badge: 'Educational',
        note: 'Este es un tokenizador educativo, no un modelo comercial. Este paso es solo preparación: el sistema todavía no calcula la probabilidad completa ni responde, solo divide el texto en unidades de trabajo. El coloreado de roles es una ayuda didáctica, ya que los modelos reales dividen por estadística, no por rol lingüístico.',
    },

    subword: {
        title: 'Laboratorio de subpalabras',
        titleEn: 'Sub-word Lab',
        badge: 'División educativa',
        hint: 'Toca una palabra para dividirla: un afijo se separa de la base. Fíjate en cómo sube el número de tokens con cada división.',
        wordsLabel: 'Palabras:',
        tokensLabel: 'Tokens:',
        splitAll: 'Dividir todo',
        mergeAll: 'Unir todo',
        splitHint: 'toca para dividir',
        mergeHint: 'toca para unir',
        ariaWhole: 'entera, toca para dividir',
        ariaSplit: 'dividida, toca para unir',
        note: 'Esta es solo una división educativa. Un tokenizador real no divide por afijos sino por estadísticas de subpalabras aprendidas de mucho texto. Aquí mostramos la idea de que una palabra puede dividirse en varias unidades.',
        splits: [
            { word: 'recalentar', whole: ['recalentar'], units: ['re', 'calentar'], roleLabel: 'Prefijo', roleEn: 'Prefix', note: 'El prefijo "re", que indica de nuevo, puede separarse de la base "calentar".' },
            { word: 'deshacer', whole: ['deshacer'], units: ['des', 'hacer'], roleLabel: 'Prefijo', roleEn: 'Prefix', note: 'El prefijo "des" puede separarse de la base "hacer".' },
            { word: 'imposible', whole: ['imposible'], units: ['im', 'posible'], roleLabel: 'Prefijo', roleEn: 'Prefix', note: 'El prefijo "im" puede separarse de la base "posible".' },
            { word: 'reabrir', whole: ['reabrir'], units: ['re', 'abrir'], roleLabel: 'Prefijo', roleEn: 'Prefix', note: 'El prefijo "re" puede separarse de la base "abrir".' },
            { word: 'precalentar', whole: ['precalentar'], units: ['pre', 'calentar'], roleLabel: 'Prefijo', roleEn: 'Prefix', note: 'El prefijo "pre" puede separarse de la base "calentar".' },
        ],
    },

    roadmap: {
        title: 'El mapa del motor',
        titleEn: 'From Text to Probabilities',
        note: 'Ahora mismo estamos solo en el primer paso: el texto se vuelve tokens. Los siguientes pasos (IDs de token, vectores) son donde los modelos reales hacen el cálculo estadístico. Sin esta división no hay inicio del recorrido.',
        steps: [
            { he: 'Texto', en: 'Text', active: true },
            { he: 'Tokens', en: 'Tokens', active: true },
            { he: 'IDs de token', en: 'Token IDs', active: false },
            { he: 'Vectores', en: 'Vectors', active: false },
            { he: 'Similitud', en: 'Similarity', active: false },
            { he: 'Puntuaciones', en: 'Scores', active: false },
            { he: 'Probabilidades', en: 'Probabilities', active: false },
        ],
    },

    scenarios: [
        {
            id: 'chat-basics',
            mode: 'chat',
            labelHe: 'Modo Chat',
            labelEn: 'Chat mode',
            prompt: 'La ropa no se seco',
            accent: 'emerald',
            routeHe: 'Construir respuesta',
            routeEn: 'Build answer',
            examples: [
                { labelHe: 'Base', labelEn: 'Base', text: 'La ropa no se seco' },
                { labelHe: 'Con pregunta', labelEn: 'With question', text: 'La ropa no se seco?' },
                { labelHe: 'Con énfasis', labelEn: 'With emphasis', text: 'Mi ropa no se seco!!!' },
                { labelHe: 'Cantidad de receta', labelEn: 'Recipe quantity', text: 'La receta necesita 250 gramos de harina' },
                { labelHe: 'Sin espacios', labelEn: 'No spaces', text: 'Laroponoseseco' },
                { labelHe: 'En inglés', labelEn: 'In English', text: 'The laundry did not dry' },
                { labelHe: 'Corrección', labelEn: 'Correction', text: 'No son galletas, hornee un pastel' },
            ],
        },
        {
            id: 'agent-check',
            mode: 'agent',
            labelHe: 'Modo Agent',
            labelEn: 'Agent mode',
            prompt: 'Revisa por que el gato no volvio',
            accent: 'purple',
            routeHe: 'Entender la tarea',
            routeEn: 'Understand task',
            examples: [
                { labelHe: 'Investigación', labelEn: 'Investigation', text: 'Revisa por que el gato no volvio' },
                { labelHe: 'Al niño', labelEn: 'To recipient', text: 'Revisa por que el gato no volvio al niño' },
            ],
        },
    ],

    roleWords: {
        ropa: 'object',
        laundry: 'object',
        gato: 'object',
        no: 'negation',
        No: 'negation',
        not: 'negation',
        seco: 'action',
        dry: 'action',
        volvio: 'action',
        Revisa: 'action-signal',
        revisa: 'action-signal',
        taza: 'context',
        café: 'context',
        niño: 'recipient',
        quizas: 'noise',
    },

    roleInfo: {
        object: { label: 'Objeto', en: 'Object', why: 'Es aquello de lo que trata la frase. La etiqueta marca el sujeto, antes de procesar el resto de la frase.' },
        negation: { label: 'Negación', en: 'Negation', why: 'Esta palabra puede invertir la dirección de la frase. Sin ella el significado es el opuesto.' },
        action: { label: 'Acción', en: 'Action', why: 'Lo que le pasó al objeto. El verbo fija el estado real de las cosas.' },
        'action-signal': { label: 'Señal de acción', en: 'Action signal', why: 'Esta palabra cambia la entrada de una descripción a una petición de acción. Cambia todo el recorrido.' },
        context: { label: 'Contexto', en: 'Context / Location', why: 'Añade un lugar o contexto que afina la imagen, como dónde te tomaste el café.' },
        system: { label: 'Sistema', en: 'System', why: 'Apunta a un sistema más amplio, no al objeto en sí. La misma área, pero otra dirección.' },
        recipient: { label: 'Destinatario', en: 'Recipient', why: 'Quién recibe la acción. Relevante sobre todo cuando se trata de una persona real.' },
        'question-signal': { label: 'Señal de pregunta', en: 'Question signal', why: 'El signo de interrogación es un token por sí mismo. Cambia la forma de la frase de afirmación a pregunta.' },
        'statement-signal': { label: 'Señal de afirmación', en: 'Statement signal', why: 'El punto es un token aparte que marca el final de una afirmación. La puntuación también cuenta como unidad de trabajo.' },
        number: { label: 'Número', en: 'Number', why: 'Una serie de dígitos es una unidad por sí misma. Una cantidad de receta, por ejemplo, convierte una petición general en algo preciso y medible.' },
        noise: { label: 'Ruido', en: 'Noise', why: 'Una palabra general que aporta muy poca información. Aun así se vuelve un token, aunque su peso sea bajo.' },
        other: { label: 'General', en: 'Token', why: 'Una palabra no asignada a un rol especial en este tokenizador educativo. Aun así cuenta como unidad de trabajo.' },
    },

    sortingCenter: { leads: ['taza'], follow: 'café' },
    deliveryFailure: { first: 'no', second: 'comer' },
};
