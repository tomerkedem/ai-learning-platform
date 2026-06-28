// i18n/locales/ru/behind-ai/chapterQuiz.ts
// Russian chapter-quiz chrome. Shape source: ../../he/behind-ai/chapterQuiz.
//
// Display text only. Quiz behavior stays in quizData.ts. Question content is out of
// scope here. "AI" is kept in Latin to match the catalog and the rest of the Russian
// course chrome. No em dash (U+2014) and no en dash (U+2013).

export const chapterQuiz = {
    subtitle: 'Пять вопросов, которые закрепляют материал главы',
    startLabel: 'Начать тест',
    submitLabel: 'Завершить тест',
    completedTitle: 'Тест завершён',

    title: (chapterName: string) => `Тест на понимание: ${chapterName}`,
    reviewLinkLabel: (chapterNumber: number, chapterName: string) =>
        `Назад к главе ${chapterNumber}: ${chapterName}`,

    chapterNames: {
        1: 'Прозрачный чат',
        2: 'Model Input',
        3: 'Tokenization',
        4: 'Embeddings',
        5: 'Геометрия смысла',
        6: 'Attention, что важно сейчас',
        7: 'Context Window',
        8: 'Logits & Softmax',
        9: 'Decoding',
        10: 'Как AI строит ответ',
        11: 'Выбор инструмента',
        12: 'Tool Call и цикл решения',
        13: 'Остановка, подтверждение и ответственность',
        14: 'Объединённая лаборатория',
        15: 'Учится ли AI на ошибках',
        16: 'Правильно работать с AI',
    } as Record<number, string>,
};
