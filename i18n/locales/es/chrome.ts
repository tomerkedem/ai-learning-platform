// i18n/locales/es/chrome.ts
// Spanish (neutral international) chrome strings. Source shape: ../he/chrome.
import { chrome as heChrome } from '../he/chrome';

export const chrome: typeof heChrome = {
    backToCatalog: 'Volver al catálogo de cursos',
    tableOfContents: 'Contenido',
    courseProgress: 'Progreso del curso',
    authorName: 'Tomer Kedem',
    authorRole: 'Autor del curso',
    intro: 'Introducción',

    header: {
        readTime: 'Tiempo de lectura',
        progress: 'Progreso',
    },

    nav: {
        next: 'Siguiente',
        prev: 'Anterior',
        finishedTitle: '¡Completaste todos los capítulos!',
        finishedSub: 'Bien hecho, llegaste hasta el final.',
    },

    focus: {
        toggleTitle: 'Ocultar la navegación y ampliar el área de aprendizaje',
        enter: 'Modo concentración',
        exit: 'Salir del modo concentración',
        activeBadge: 'Modo concentración activo',
        press: 'Pulsa',
        toExit: 'para salir',
    },

    footer: {
        defaultLabel: 'Cursos interactivos para desarrolladores de IA',
        copyright: '© 2026 Tomer Kedem. Todos los derechos reservados.',
    },
};
