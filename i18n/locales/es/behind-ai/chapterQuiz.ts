// i18n/locales/es/behind-ai/chapterQuiz.ts
// Spanish (neutral international) chapter-quiz chrome.
// Shape source: ../../he/behind-ai/chapterQuiz.
//
// Display text only. Quiz behavior stays in quizData.ts. Question content is out of
// scope here. "IA" is used in Spanish prose. No em dash (U+2014) and no en dash
// (U+2013). Latin terms (Attention, Tool Call, Tokenization, prompt) are kept.

export const chapterQuiz = {
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en este capítulo',
    startLabel: 'Comenzar el cuestionario',
    submitLabel: 'Finalizar el cuestionario',
    completedTitle: 'Cuestionario completado',

    title: (chapterName: string) => `Cuestionario de comprensión: ${chapterName}`,
    reviewLinkLabel: (chapterNumber: number, chapterName: string) =>
        `Volver al capítulo ${chapterNumber}: ${chapterName}`,

    chapterNames: {
        1: 'El chat transparente',
        2: 'Model Input',
        3: 'Tokenization',
        4: 'De palabras a números',
        5: 'La geometría del significado',
        6: 'Attention, qué importa ahora',
        7: 'Context Window',
        8: 'Logits & Softmax',
        9: 'Decoding',
        10: 'Cómo construye una respuesta la IA',
        11: 'Elegir una herramienta',
        12: 'Tool Call y el bucle de decisión',
        13: 'Detenerse, aprobar y responsabilidad',
        14: 'El laboratorio unificado',
        15: '¿Aprende la IA de los errores?',
        16: 'Trabajar bien con la IA',
    } as Record<number, string>,
};
