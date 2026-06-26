// i18n/locales/es/behind-ai/chapter5Quiz.ts
// Spanish Chapter 5 quiz display text. Shape source: ../../he/behind-ai/chapter5Quiz.
// Option order matches the Hebrew source so the stored correctAnswer index stays valid.
// Uses "IA" in natural Spanish prose; concept keys stay Hebrew, conceptLabels translated.

export const chapter5Quiz = {
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
            question: 'El modelo acaba de escribir la parte «Revisa el número de seguimiento». ¿Qué es cierto sobre esta parte ahora?',
            options: [
                'Queda apartada y no influye en lo que se escriba después',
                'Pasó a formar parte del contexto e influye en qué continuaciones reciben más peso en el siguiente paso',
                'Obligó al modelo a comprobar el estado del paquete en la realidad',
                'Reinicia el contexto y hace que el modelo empiece de nuevo',
            ],
            explanation:
                'Cada parte que se escribe vuelve hacia dentro y se suma al contexto. El contexto actualizado es lo que moldea la siguiente elección, por eso tras «Revisa el número de seguimiento» las continuaciones probables tratan de qué hacer con el resultado de la comprobación.',
        },
        3: {
            question:
                'El mismo Prompt exacto, «Mi paquete no llegó. ¿Qué hago?», se construye una vez desde el inicio «Revisa el número de seguimiento» y otra vez desde «Contacta con atención al cliente». ¿Por qué salen respuestas completamente distintas?',
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
                'El modelo construyó una respuesta fluida y segura que afirmaba que cierto paquete fue entregado. En realidad no lo fue. ¿Dónde está el fallo en el razonamiento «si la construyó paso a paso, seguro que comprobó que era correcta»?',
            options: [
                'No hay fallo, construir paso a paso siempre comprueba los hechos',
                'Construir paso a paso arma una continuación que encaja con el contexto, no comprueba el mundo. La verificación necesita una herramienta o una fuente externa',
                'El fallo es que el modelo no debería construir respuestas largas',
                'El fallo es que el modelo construyó la respuesta demasiado rápido',
            ],
            explanation:
                'El bucle produce una continuación coherente a partir del contexto y los patrones aprendidos, pero la coherencia no es verificación. Construir paso a paso no acude a ninguna fuente externa, así que para saber si el paquete se entregó de verdad hace falta una herramienta de seguimiento o una fuente verificada.',
        },
        5: {
            question:
                'Un amigo dice: «El modelo ya tiene toda la respuesta en la cabeza y simplemente la escribe». ¿Qué es inexacto en esa afirmación?',
            options: [
                'No hay error, la respuesta completa de verdad está guardada y se muestra tal cual',
                'No hay una respuesta completa guardada de antemano. Se construye de forma gradual, y cada parte depende de lo que se escribió antes',
                'El error es que el modelo no escribe, sino que habla',
                'El error es que el modelo tiene varias respuestas completas y elige una',
            ],
            explanation:
                'No hay una respuesta completa esperando ya hecha. El modelo la construye parte por parte, y cada parte se crea a partir del contexto ya escrito. Por eso la misma pregunta puede construirse un poco distinta cada vez, en lugar de repetirse como una cita fija.',
        },
    },

    conceptLabels: {
        'בנייה צעד אחר צעד': 'Construcción paso a paso',
        'פלט הופך לקלט': 'La salida se vuelve entrada',
        'צעד מוקדם מכוון': 'Un paso temprano marca el rumbo',
        'ייצור אינו אימות': 'Generar no es verificar',
        'אין תשובה מוכנה': 'No hay respuesta ya hecha',
    },
};
