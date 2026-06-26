// i18n/locales/es/behind-ai/chapter5Lab.ts
// Spanish Answer Builder Lab strings. Shape source: ../../he/behind-ai/chapter5Lab.
// The first step's fragments are capitalized so the assembled answer reads cleanly
// after the opener. Uses the shorter "Contacta con atención al cliente" opener.

export const chapter5Lab = {
    loop: {
        contextSoFar: 'Contexto hasta ahora',
        candidates: 'Partes posibles',
        chosen: 'La parte elegida',
        backToContext: 'Vuelve hacia dentro',
    },

    contextLabel: 'El contexto hasta ahora',
    promptLabel: 'Prompt: ',
    leading: 'Lidera',

    howToOpen: '¿Cómo abrimos la respuesta?',
    openersNote: 'Los dos inicios son razonables. Fíjate en que la elección aquí no solo añade palabras, marca hacia dónde se construirá el resto de la respuesta.',

    changedPrefix: 'Qué cambió en el contexto: ',
    candidatesConsidered: 'Partes que se consideran ahora',

    builtAnswer: 'La respuesta que se construyó',
    builtAnswerNote: 'Cada parte aquí se eligió a partir de lo que ya estaba escrito antes. Cambia el inicio, y toda la continuación se construirá distinta.',

    nextStep: 'Siguiente paso',
    restart: 'Empezar de nuevo y elegir otro inicio',

    comparisonTitle: 'Mismo Prompt, dos inicios',

    transparencyNote:
        'Esta es una ilustración educativa simplificada. Los modelos reales generan la respuesta en unidades más pequeñas y sobre un vocabulario muy grande. Trabajamos a nivel de partes de frase para que el bucle quede claro. Las barras ilustran el grado de ajuste, no un cálculo real.',

    scenario: {
        prompt: 'Mi paquete no llegó. ¿Qué hago?',
        firstStepIntro:
            'El mismo Prompt exacto, pero hay varias formas razonables de abrir la respuesta. Elige la primera parte y observa cómo marca todo lo que se construye después.',
        branches: {
            'self-service': {
                label: 'Autoverificación',
                opener: 'Revisa el número de seguimiento',
                openerChanged:
                    'El inicio elegido marca en el contexto una dirección de autoverificación. A partir de aquí, las continuaciones que reciben más peso tratan de qué hacer con el resultado de esa comprobación.',
                summary: 'La respuesta se construye en torno a una autoverificación del estado, y solo acude a soporte si no hay novedad.',
                steps: [
                    {
                        changed:
                            'El contexto ya incluye revisar el número de seguimiento. Por eso la continuación natural hace que el siguiente paso dependa del resultado de la comprobación, en lugar de saltar directamente a la acción.',
                        candidates: ['Si no hay una novedad clara', 'Si el estado muestra entregado', 'Si el paquete sigue en camino'],
                    },
                    {
                        changed:
                            'Tras «Si no hay una novedad clara», el contexto apunta a un callejón sin salida en la autoverificación. Ahora contactar con soporte se vuelve la parte más probable.',
                        candidates: ['contacta con atención al cliente', 'espera un día más y vuelve a comprobar', 'revisa el buzón y la oficina local'],
                    },
                    {
                        changed:
                            'Una vez que el contexto trata de contactar con soporte, la continuación probable es equipar la solicitud con algo que la identifique. El número de pedido pasa al primer lugar.',
                        candidates: ['adjunta el número de pedido', 'indica la fecha del pedido', 'adjunta una captura del pedido'],
                    },
                    {
                        changed:
                            'Todo el contexto trata de averiguar dónde está el paquete. Por eso el cierre probable es pedir una comprobación de estado, no pedir una compensación o un nuevo envío.',
                        candidates: ['y pide una comprobación de estado', 'y pide un reembolso', 'y pide que envíen un paquete nuevo'],
                    },
                ],
            },
            support: {
                label: 'Contacto con soporte',
                opener: 'Contacta con atención al cliente',
                openerChanged:
                    'El inicio elegido marca una dirección de llegar a una persona en soporte. A partir de aquí, las continuaciones probables tratan de gestionar ese contacto, no de una autoverificación.',
                summary: 'La respuesta se construye en torno a gestionar un contacto con atención al cliente, hasta abrir una reclamación y guardar un número de caso.',
                steps: [
                    {
                        changed:
                            'El contexto ya incluye contactar con soporte. El paso probable es darle al agente lo que permite gestionarlo, es decir, los datos del pedido.',
                        candidates: ['Da los datos de tu pedido', 'Llama a la línea telefónica', 'Escribe un correo detallado'],
                    },
                    {
                        changed:
                            'Tras dar los datos del pedido, el contexto está listo para describir el problema en sí. Por eso la continuación probable es indicar con claridad que el paquete no llegó.',
                        candidates: ['indica que el paquete no llegó', 'pide que agilicen la gestión', 'pregunta por la política de devoluciones'],
                    },
                    {
                        changed:
                            'El contexto describe un problema reportado a soporte. El siguiente paso probable es una escalada ordenada, es decir, pedir que abran una reclamación con la empresa de mensajería.',
                        candidates: ['pide que abran una reclamación con la mensajería', 'pide hablar con un responsable', 'pide una compensación inmediata'],
                    },
                    {
                        changed:
                            'Una vez abierta la reclamación, el contexto apunta a un proceso que hay que seguir. Por eso el cierre probable es guardar el número de caso, no terminar sin registro.',
                        candidates: ['y guarda el número de caso para el seguimiento', 'y termina el contacto', 'y pide una confirmación por escrito'],
                    },
                ],
            },
        },
    },
};
