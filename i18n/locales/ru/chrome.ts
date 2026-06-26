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
        next: 'Далее',
        prev: 'Назад',
        finishedTitle: 'Вы прошли все главы!',
        finishedSub: 'Отлично - вы дошли до конца.',
    },

    focus: {
        toggleTitle: 'Скрыть навигацию и расширить область обучения',
        enter: 'Режим фокуса',
        exit: 'Выйти из режима фокуса',
        activeBadge: 'Режим фокуса включён',
        press: 'Нажмите',
        toExit: 'для выхода',
    },

    footer: {
        defaultLabel: 'Интерактивные курсы для разработчиков ИИ',
        copyright: '© 2026 Томер Кедем. Все права защищены.',
    },
};
