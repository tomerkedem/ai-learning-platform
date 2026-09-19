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
        moreComingTitle: 'Has llegado al final de los capítulos disponibles por ahora',
        moreComingSub: 'Los próximos capítulos continuarán el curso',
    },

    focus: {
        toggleTitle: 'Ocultar la navegación y ampliar el área de aprendizaje',
        enter: 'Modo concentración',
        exit: 'Salir del modo concentración',
        activeBadge: 'Modo concentración activo',
        press: 'Pulsa',
        toExit: 'para salir',
    },

    theme: {
        label: 'Tema',
        system: 'Sistema',
        light: 'Claro',
        dark: 'Oscuro',
    },

    footer: {
        defaultLabel: 'Cursos interactivos para desarrolladores de IA',
        copyright: '© 2026 Tomer Kedem. Todos los derechos reservados.',
    },

    assessment: {
        // Anuncio para lectores de pantalla: el resultado solo se transmite por icono y color.
        verdictCorrect: 'Respuesta correcta.',
        verdictWrong: 'Respuesta incorrecta.',
        start: 'Empezar el test',
        mentorStart: '¿Listo? Veamos qué quedó',
        questionsLabel: 'Preguntas',
        recommendedTimeLabel: 'Tiempo recomendado',
        recommendedTime: (min) => `${min} min`,
        submit: 'Finalizar el test',
        completed: '¡Test completado!',
        next: 'Continuar al siguiente capítulo',
        review: 'Volver a un repaso rápido',
        mentorPassHigh: '¡Excelente, dominio total!',
        mentorPass: '¡Bien, aprobaste!',
        mentorFail: 'Todavía no. Repasa los puntos débiles e inténtalo de nuevo.',
        failNote: 'Tu comprensión aún no basta para avanzar con confianza. Repasa los puntos débiles e inténtalo de nuevo.',
        correctSummary: (correct, total) => `${correct} de ${total} respuestas correctas`,
        timeLabel: 'Tiempo',
        strongConcepts: 'Tus fortalezas',
        weakConcepts: 'Conviene reforzar',
        recommendedReview: 'Repaso recomendado',
        reviewAnswers: 'Revisar respuestas',
        retry: 'Intentar de nuevo',
        tiers: [
            { label: '¡Excelente!', sub: 'Dominio total del material' },
            { label: 'Muy bien', sub: 'Muy buena comprensión' },
            { label: 'Casi lo logras', sub: 'Cerca de la nota de aprobado' },
            { label: 'Aún no apruebas', sub: 'Por debajo de la nota de aprobado' },
        ],
        questionCounter: (current, total) => `Pregunta ${current} de ${total}`,
        streak: (n) => `Racha ${n}`,
        mute: 'Silenciar sonidos',
        unmute: 'Activar sonidos',
        prev: 'Anterior',
        continue: 'Continuar',
    },

    progress: {
        title: 'Tu progreso en el curso',
        sidebarTitle: 'Dominio de los tests',
        emptyTitle: 'Tu progreso',
        emptyBody: 'Completa la breve comprobación de comprensión al final de cada capítulo y aquí verás qué conceptos ya dominas y cuáles conviene reforzar. Tu progreso se guarda en tu dispositivo.',
        completed: 'Completados',
        passed: 'Aprobados',
        average: 'Promedio',
        finalExam: 'Examen final',
        strongHeader: 'Tus fortalezas',
        weakHeader: 'Conceptos que conviene reforzar',
        weakHeaderShort: 'Conviene reforzar',
        finalExamCta: 'Ir al examen final del curso',
        status: {
            passed: 'Aprobado',
            needsReview: 'Requiere repaso',
            notTaken: 'Sin realizar',
        },
    },
};
