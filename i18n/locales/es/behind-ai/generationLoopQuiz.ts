// i18n/locales/es/behind-ai/generationLoopQuiz.ts
// Spanish Chapter 5 quiz display text. Shape source: ../../he/behind-ai/generationLoopQuiz.
// Option order matches the Hebrew source so the stored correctAnswer index stays valid.
// Uses "IA" in natural Spanish prose; concept keys stay Hebrew, conceptLabels translated.

export const generationLoopQuiz = {
    title: 'Comprobación: cómo construye una respuesta la IA',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en este capítulo',
    startLabel: 'Empezar la comprobación',
    submitLabel: 'Finalizar la comprobación',
    completedTitle: 'Has terminado la comprobación',

    byId: {
        1: {
            question: '¿Cómo llega el modelo a una respuesta larga?',
            options: [
                'Saca una respuesta completa guardada de antemano y la muestra',
                'La genera parte por parte, y cada parte se construye sobre lo que ya se escribió',
                'Escribe toda la respuesta de una vez, en un solo momento',
                'Traduce una respuesta existente de otro idioma',
            ],
            explanation:
                'La respuesta no nace de golpe ni se saca ya hecha. El modelo genera una parte pequeña, la suma al contexto y luego pasa a la siguiente parte. Es un bucle que se repite hasta que la respuesta está completa.',
        },
        2: {
            question: 'El modelo acaba de escribir la parte «Revisa cuánto tiempo la herviste». ¿Qué es cierto sobre esta parte ahora?',
            options: [
                'Queda apartada y no influye en lo que se escriba después',
                'Pasó a formar parte del contexto e influye en qué continuaciones reciben más peso en el siguiente paso',
                'Obligó al modelo a comprobar el tiempo de cocción en la realidad',
                'Reinicia el contexto y hace que el modelo empiece de nuevo',
            ],
            explanation:
                'Cada parte que se escribe vuelve hacia dentro y se suma al contexto. El contexto actualizado es lo que moldea la siguiente elección, por eso tras «Revisa cuánto tiempo la herviste» las continuaciones probables tratan de qué hacer con el resultado de la comprobación.',
        },
        3: {
            question:
                'El mismo Prompt exacto, «Siempre intento cocinar pasta y nunca me sale bien. ¿Qué hago?», se construye una vez desde el inicio «Revisa cuánto tiempo la herviste» y otra vez desde «Pide ayuda a alguien con experiencia». ¿Por qué salen respuestas completamente distintas?',
            options: [
                'Porque el modelo elige una respuesta al azar cada vez',
                'Porque la primera parte elegida cambió el contexto, así que toda la continuación se construyó de otra manera',
                'Porque el segundo Prompt en realidad era diferente',
                'Porque en una de las veces el modelo comprobó los hechos y en la otra no',
            ],
            explanation:
                'Una elección temprana no es solo una palabra más, es un marco para todo lo que sigue. El inicio entra en el contexto y lo orienta, por eso el mismo Prompt puede construirse en dos respuestas distintas según la parte elegida al principio.',
        },
        4: {
            question:
                'El modelo construyó una respuesta fluida y segura que afirmaba que cierto plato había salido perfecto. En realidad no fue así. ¿Dónde está el fallo en el razonamiento «si la construyó paso a paso, seguro que comprobó que era correcta»?',
            options: [
                'No hay fallo, construir paso a paso siempre comprueba los hechos',
                'Construir paso a paso arma una continuación que encaja con el contexto, no comprueba el mundo. La verificación necesita una herramienta o una fuente externa',
                'El fallo es que el modelo no debería construir respuestas largas',
                'El fallo es que el modelo construyó la respuesta demasiado rápido',
            ],
            explanation:
                'El bucle produce una continuación coherente a partir del contexto y los patrones aprendidos, pero la coherencia no es verificación. Construir paso a paso no acude a ninguna fuente externa, así que para saber si el plato realmente salió bien hay que comprobarlo tú mismo, no solo confiar en una respuesta fluida.',
        },
        5: {
            question:
                'Pediste una respuesta «en tres partes: empatía, lo que se sabe y lo que hay que comprobar», en lugar de solo «ayúdame». ¿Por qué la instrucción estructurada da una respuesta más estable?',
            options: [
                'Porque una instrucción estructurada hace que el modelo compruebe los hechos contra el mundo',
                'Porque cada parte de la instrucción entra en el contexto y limita los pasos siguientes, así el bucle se construye siguiendo la estructura que pediste',
                'Porque una respuesta larga siempre es más precisa que una corta',
                'Porque la estructura hace que el modelo saque una respuesta ya hecha de la memoria',
            ],
            explanation:
                'Una instrucción estructurada o una redacción prudente entra en el contexto desde el principio, y ese contexto limita las elecciones en cada paso. Así el bucle se construye siguiendo la estructura que pediste y se desvía menos. Una instrucción vaga deja más libertad y por eso es menos estable. Ten en cuenta que estabilidad no es verdad. Una buena estructura estabiliza la construcción, no verifica los hechos.',
        },
    },
};
