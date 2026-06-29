// i18n/locales/es/behind-ai/chapter1Quiz.ts
// Spanish Chapter 1 quiz display text. Shape source: ../../he/behind-ai/chapter1Quiz.
// Mechanics (correctAnswer, difficulty, concept) stay in the shared quizData.ts; the
// page merges this display text by question id. Option order matches the Hebrew source
// so the stored correctAnswer index stays valid. concept keys stay Hebrew (stable);
// conceptLabels provide the translated display label.
//
// No em dash (U+2014), no en dash (U+2013). "AI", "Chat", "Agent", "token", and
// "model" are kept as fixed terms.

export const chapter1Quiz = {
    title: 'Comprobación de conocimientos: el chat transparente',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en este capítulo',
    startLabel: 'Comenzar el cuestionario',
    submitLabel: 'Terminar el cuestionario',
    completedTitle: 'Terminaste el cuestionario',

    byId: {
        1: {
            question: 'Cuando recibes una respuesta de la AI, ¿cuál es la idea central que este capítulo quiere que entiendas sobre lo que ocurrió detrás de ella?',
            options: [
                'La respuesta se sacó ya hecha de un banco de respuestas escritas de antemano',
                'Detrás de la respuesta corre todo un recorrido: tokens, probabilidades, confianza y una decisión',
                'El motor eligió la primera respuesta que se le ocurrió sin sopesar otras opciones',
                'La respuesta se decidió solo por la última palabra de la frase que escribiste',
            ],
            explanation:
                'Desde fuera solo ves el resultado, pero entre la pregunta y la respuesta corre todo un proceso. El motor divide el texto en tokens, calcula probabilidades, comprueba cuánta confianza tiene y solo entonces decide. Todo el capítulo busca hacer visible ese recorrido.',
        },
        2: {
            question: '¿Cuál es la diferencia esencial entre el modo Chat y el modo Agent tal como se mostró en el capítulo?',
            options: [
                'Chat funciona más rápido y Agent más lento pero con más precisión',
                'Chat entiende un idioma y Agent entiende solo otro',
                'Chat elige una respuesta y Agent comprueba cuál es el siguiente paso correcto: responder, usar una herramienta, o detenerse y pedir información',
                'Chat usa tokens y Agent no los necesita',
            ],
            explanation:
                'La diferencia no está en la velocidad ni en el idioma. En Chat el sistema elige una respuesta de texto. En Agent primero se pregunta cuál es el siguiente paso correcto: quizá responder, quizá usar una herramienta, y quizá detenerse y pedir la información que falta.',
        },
        3: {
            question: 'Según el capítulo, ¿cuándo debe el motor detenerse y preguntar en lugar de responder con confianza?',
            options: [
                'Cuando la diferencia entre la opción líder y la siguiente es pequeña',
                'Cuando la diferencia entre la opción líder y la siguiente es grande',
                'Siempre, porque el motor nunca puede estar seguro',
                'Nunca, porque detenerse y pedir aclaración se considera un fallo del sistema',
            ],
            explanation:
                'El motor ordena las opciones y decide según la diferencia entre ellas. Diferencia grande significa confianza alta, así que puede responder. Diferencia pequeña significa incertidumbre, y entonces el paso correcto es detenerse y preguntar, no adivinar. Una pausa así no es un fallo, sino el paso responsable.',
        },
        4: {
            question:
                'Según el capítulo, el motor construye su estimación mientras lee la frase, palabra por palabra. ¿Qué enseña esto sobre cómo llega a una respuesta?',
            options: [
                'El motor espera al final de la frase y solo entonces empieza a calcular algo',
                'El motor fija la respuesta por la primera palabra y no la cambia después',
                'El motor construye una estimación mientras lee, y cada palabra añadida puede cambiar quién va en cabeza',
                'El motor lee todas las palabras a la vez, así que el orden no le importa',
            ],
            explanation:
                'La estimación no es fija, se construye mientras lee. A medida que entra más información, la suposición líder puede cambiar. El motor no "sabe" la respuesta de antemano, sino que actualiza una estimación a lo largo de la lectura. En la capa de profundidad puedes arrastrar el cabezal de lectura y ver tú mismo cómo cambia quién va en cabeza.',
        },
        5: {
            question:
                'Dato: dos usuarios envían una solicitud sensible. En el primero el motor muestra una diferencia grande entre la opción líder y la segunda; en el segundo la diferencia es muy pequeña. Según la regla práctica del capítulo, ¿qué es lo más correcto?',
            options: [
                'En ambos casos conviene que el motor responda de inmediato, porque siempre elige la opción con el número más alto',
                'En el primero puedes confiar más en la acción; en el segundo, cuando la diferencia es pequeña y la acción es sensible, conviene detenerse y pedir aclaración',
                'En el segundo puedes actuar con más confianza, porque una diferencia pequeña significa que todas las opciones son buenas',
                'En ambos casos hay que detenerse siempre, porque toda acción sensible le está prohibida al motor',
            ],
            explanation:
                'La regla práctica combina dos factores: el tamaño de la diferencia y el riesgo. Diferencia grande y riesgo bajo: puedes confiar. Diferencia pequeña o acción sensible: detenerse y pedir aclaración es el paso responsable, no un fallo. Una diferencia pequeña en realidad señala incertidumbre, no confianza.',
        },
    },

    conceptLabels: {
        'תהליך מול תשובה': 'Proceso frente a respuesta',
        'Chat מול Agent': 'Chat frente a Agent',
        'ביטחון לפי הפער': 'Confianza según la diferencia',
        'קריאה חיה': 'Lectura en vivo',
        'ביטחון פוגש אחריות': 'La confianza se encuentra con la responsabilidad',
    } as Record<string, string>,
};
