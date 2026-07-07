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
        4: 'Embeddings',
        5: 'Semantic Space: el mapa del significado',
        6: 'Attention: qué importa ahora',
        7: 'Context Window',
        8: 'Logits & Softmax',
        9: 'Decoding',
        10: 'Generation Loop',
        11: 'Hallucinations',
        12: 'RAG & Grounding',
        13: 'Self-Check',
        14: 'Learning from Mistakes',
        15: 'Evaluación y generalización',
        16: '¿La AI aprende de mí?',
        17: 'Chat to Agent',
    } as Record<number, string>,
};
