// i18n/locales/es/behind-ai/finalExam.ts
// Spanish (neutral international) final-exam chrome.
// Shape source: ../../he/behind-ai/finalExam.
//
// Display text only. Behavior (questions, passScore, onComplete, getReviewLinks)
// and the structural tier data (min/color) stay in quizData.ts. Tier order must
// stay identical to the Hebrew source, since label/sub overlay min/color by index.
// The course name matches the Spanish catalog title ("Entre bastidores de AI").
//
// No em dash (U+2014) and no en dash (U+2013) in this file.

export const finalExam = {
    backToChapter: 'Volver al capítulo 19',
    pageTitle: 'Examen final del curso',
    pageSubtitle:
        'El examen final de "Entre bastidores de la IA". Evalúa todo el recorrido: desde la entrada hasta la decisión responsable, y las conexiones entre los conceptos. Puedes volver a él en cualquier momento, y tu progreso se guarda en tu dispositivo.',

    examTitle: 'Examen final del curso: Entre bastidores de la IA',
    examSubtitle: 'Dieciocho preguntas que resumen todo el curso, desde la entrada hasta la decisión responsable.',
    startLabel: 'Comenzar el examen final',
    submitLabel: 'Finalizar el examen final',
    completedTitle: 'Examen final completado',
    reviewLabel: 'Volver al inicio del curso',
    nextLabel: 'Listo: volver al catálogo de cursos',

    tiers: [
        { label: 'Excelente', sub: 'Entiendes el flujo interno de la IA y sabes explicarlo' },
        { label: 'Muy bien', sub: 'Las ideas principales están claras, conviene repasar algunos puntos' },
        { label: 'Comprensión parcial', sub: 'Conviene repasar los capítulos en los que fallaste' },
        { label: 'Conviene repetir el curso', sub: 'Vale la pena repasar el material antes de continuar' },
    ],
};
