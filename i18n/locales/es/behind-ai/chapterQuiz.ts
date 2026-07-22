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
    nextQuestionLabel: 'La siguiente pregunta',
    transitions: {
        2: 'Ya sabemos qué prepara el producto. ¿Cómo divide el modelo esa entrada en unidades que pueda procesar?', 3: 'Un Token ID identifica un token, pero el número no tiene significado. ¿Cómo se convierte en una representación útil?',
        6: 'Attention solo puede ponderar información disponible ahora. ¿Qué contiene realmente la ventana actual?', 7: 'El contexto está listo. ¿Cómo lo convierte el modelo en puntuaciones para los siguientes tokens?', 8: 'Softmax produce una distribución, pero todavía no una elección. ¿Cómo se selecciona el siguiente token?', 9: 'Se ha elegido un token. ¿Cómo se convierte esa elección en una respuesta completa?',
        10: 'Una respuesta puede ser fluida y aun así ser incorrecta. ¿Por qué ocurre?', 11: 'Si la fluidez no basta, ¿cómo conecta el sistema la respuesta con evidencia externa?', 12: 'Una fuente mejora el respaldo, pero el borrador aún puede usarla mal. ¿Cómo se comprueba contra la evidencia?', 13: 'Una revisión puede detectar un problema. ¿Qué ocurre cuando el fallo se repite y el sistema debe mejorar?',
        14: 'Un cambio puede mejorar ejemplos conocidos. ¿Cómo comprobamos que también funciona en casos nuevos?', 15: 'Ya sabemos cómo se evalúan las actualizaciones. Pero ¿una corrección en mi chat cambia el modelo?', 16: 'Hasta ahora, el sistema principalmente devolvía respuestas. ¿Qué cambia cuando persigue una meta mediante varios pasos y acciones?',
    } as Record<number, string>,

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
        18: 'Guardrails',
        19: 'Full Trace',
    } as Record<number, string>,
};
