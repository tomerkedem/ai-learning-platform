// i18n/locales/ru/behind-ai/finalExam.ts
// Russian final-exam chrome. Shape source: ../../he/behind-ai/finalExam.
//
// Display text only. Behavior (questions, passScore, onComplete, getReviewLinks)
// and the structural tier data (min/color) stay in quizData.ts. Tier order must
// stay identical to the Hebrew source, since label/sub overlay min/color by index.
// The course name matches the Russian catalog title ("AI за кулисами").
//
// No em dash (U+2014) and no en dash (U+2013) in this file.

export const finalExam = {
    backToChapter: 'Назад к главе 19',
    pageTitle: 'Итоговый экзамен курса',
    pageSubtitle:
        'Итоговый экзамен курса "AI за кулисами". Он проверяет весь путь: от ввода до ответственного решения, и связи между понятиями. Вернуться к нему можно в любой момент, прогресс сохраняется на вашем устройстве.',

    examTitle: 'Итоговый экзамен курса: AI за кулисами',
    examSubtitle: 'Восемнадцать вопросов, охватывающих весь курс: от ввода до ответственного решения.',
    startLabel: 'Начать итоговый экзамен',
    submitLabel: 'Завершить итоговый экзамен',
    completedTitle: 'Итоговый экзамен завершён',
    reviewLabel: 'Вернуться к началу курса',
    nextLabel: 'Готово: вернуться к каталогу курсов',

    tiers: [
        { label: 'Отлично', sub: 'Вы понимаете внутренний поток AI и умеете его объяснить' },
        { label: 'Очень хорошо', sub: 'Главные идеи ясны, стоит освежить несколько моментов' },
        { label: 'Частичное понимание', sub: 'Рекомендуем повторить главы, где были ошибки' },
        { label: 'Стоит пройти курс заново', sub: 'Перед тем как двигаться дальше, лучше повторить материал' },
    ],
};
