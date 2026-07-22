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
    nextQuestionLabel: 'Следующий вопрос',
    transitions: {
        2: 'Теперь понятно, что собирает продукт. Как модель делит ввод на единицы, которые может обработать?', 3: 'Token ID определяет токен, но само число ничего не значит. Как оно превращается в полезное представление?',
        6: 'Attention может взвешивать только доступную сейчас информацию. Что находится в текущем окне?', 7: 'Контекст готов. Как модель превращает его в оценки возможных следующих токенов?', 8: 'Softmax создаёт распределение, но это ещё не выбор. Как выбирается следующий токен?', 9: 'Один токен выбран. Как этот выбор превращается в полный ответ?',
        10: 'Ответ может быть связным и всё же ошибочным. Почему так происходит?', 11: 'Если связности недостаточно, как система связывает ответ с внешними данными?', 12: 'Источник улучшает обоснованность, но черновик может использовать его неверно. Как сверить черновик с данными?', 13: 'Проверка выявляет одну проблему. Что делать, если сбой повторяется и систему нужно улучшить?',
        14: 'Изменение может улучшить знакомые примеры. Как проверить его на новых случаях?', 15: 'Мы знаем, как оценивают обновления. Но меняет ли одна поправка в моём чате саму модель?', 16: 'До сих пор система в основном возвращала ответы. Что меняется, когда она идёт к цели через несколько шагов и действий?',
    } as Record<number, string>,

    title: (chapterName: string) => `Тест на понимание: ${chapterName}`,
    reviewLinkLabel: (chapterNumber: number, chapterName: string) =>
        `Назад к главе ${chapterNumber}: ${chapterName}`,

    chapterNames: {
        1: 'Прозрачный чат',
        2: 'Model Input',
        3: 'Tokenization',
        4: 'Embeddings',
        5: 'Semantic Space: карта смысла',
        6: 'Attention: что важно сейчас',
        7: 'Context Window',
        8: 'Logits & Softmax',
        9: 'Decoding',
        10: 'Generation Loop',
        11: 'Hallucinations',
        12: 'RAG & Grounding',
        13: 'Self-Check',
        14: 'Learning from Mistakes',
        15: 'Оценка и обобщение',
        16: 'Учится ли AI у меня',
        17: 'Chat to Agent',
        18: 'Guardrails',
        19: 'Full Trace',
    } as Record<number, string>,
};
