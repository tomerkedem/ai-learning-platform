// i18n/locales/ru/chrome.ts
// Russian chrome strings. Source shape: ../he/chrome.
import { chrome as heChrome } from '../he/chrome';

export const chrome: typeof heChrome = {
    backToCatalog: 'Назад к каталогу курсов',
    tableOfContents: 'Содержание',
    courseProgress: 'Прогресс курса',
    authorName: 'Томер Кедем',
    authorRole: 'Автор курса',
    intro: 'Введение',

    header: {
        readTime: 'Время чтения',
        progress: 'Прогресс',
    },

    nav: {


        menu: 'Меню курса',



        closeMenu: 'Закрыть меню',
        next: 'Далее',
        prev: 'Назад',
        finishedTitle: 'Вы прошли все главы!',
        finishedSub: 'Отлично - вы дошли до конца.',
        moreComingTitle: 'Вы дошли до конца доступных сейчас глав',
        moreComingSub: 'Следующие главы продолжат курс',
    },

    focus: {
        toggleTitle: 'Скрыть навигацию и расширить область обучения',
        enter: 'Режим фокуса',
        exit: 'Выйти из режима фокуса',
        activeBadge: 'Режим фокуса включён',
        press: 'Нажмите',
        toExit: 'для выхода',
    },

    theme: {
        label: 'Тема',
        system: 'Системная',
        light: 'Светлая',
        dark: 'Тёмная',
    },

    footer: {
        defaultLabel: 'Интерактивные курсы для разработчиков ИИ',
        copyright: '© 2026 Томер Кедем. Все права защищены.',
    },

    assessment: {
        // Объявление для скринридеров: иначе результат передаётся только значком и цветом.
        verdictCorrect: 'Правильный ответ.',
        verdictWrong: 'Неправильный ответ.',
        start: 'Начать тест',
        mentorStart: 'Готовы? Посмотрим, что усвоилось',
        questionsLabel: 'Вопросы',
        recommendedTimeLabel: 'Рекомендуемое время',
        recommendedTime: (min) => `${min} мин`,
        submit: 'Завершить тест',
        completed: 'Тест завершён!',
        next: 'Перейти к следующей главе',
        review: 'Вернуться к краткому повторению',
        mentorPassHigh: 'Отлично, полное владение!',
        mentorPass: 'Хорошо, вы прошли!',
        mentorFail: 'Пока нет. Повторите слабые места и попробуйте снова.',
        failNote: 'Понимания пока недостаточно, чтобы уверенно двигаться дальше. Повторите слабые места и попробуйте снова.',
        correctSummary: (correct, total) => `${correct} из ${total} ответов верны`,
        timeLabel: 'Время',
        strongConcepts: 'Сильные стороны',
        weakConcepts: 'Стоит подтянуть',
        recommendedReview: 'Рекомендуемое повторение',
        reviewAnswers: 'Просмотр ответов',
        retry: 'Ещё раз',
        tiers: [
            { label: 'Отлично!', sub: 'Полное владение материалом' },
            { label: 'Очень хорошо', sub: 'Очень хорошее понимание' },
            { label: 'Почти получилось', sub: 'Близко к проходному баллу' },
            { label: 'Пока не пройдено', sub: 'Ниже проходного балла' },
        ],
        questionCounter: (current, total) => `Вопрос ${current} из ${total}`,
        streak: (n) => `Серия ${n}`,
        mute: 'Выключить звук',
        unmute: 'Включить звук',
        prev: 'Назад',
        continue: 'Далее',
    },

    progress: {
        title: 'Ваш прогресс в курсе',
        sidebarTitle: 'Освоение тестов',
        emptyTitle: 'Ваш прогресс',
        emptyBody: 'Проходите короткую проверку понимания в конце каждой главы, и здесь вы увидите, какие понятия уже усвоены, а какие стоит подтянуть. Прогресс сохраняется на вашем устройстве.',
        completed: 'Завершено',
        passed: 'Сдано',
        average: 'Среднее',
        finalExam: 'Итоговый экзамен',
        strongHeader: 'Сильные стороны',
        weakHeader: 'Понятия, которые стоит подтянуть',
        weakHeaderShort: 'Стоит подтянуть',
        finalExamCta: 'Перейти к итоговому экзамену курса',
        status: {
            passed: 'Сдан',
            needsReview: 'Требует повторения',
            notTaken: 'Не пройден',
        },
    },
};
