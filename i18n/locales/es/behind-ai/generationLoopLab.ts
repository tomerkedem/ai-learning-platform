// i18n/locales/es/behind-ai/generationLoopLab.ts
// Spanish Answer Builder Lab strings. Shape source: ../../he/behind-ai/generationLoopLab.
// The first step's fragments are capitalized so the assembled answer reads cleanly
// after the opener. Uses the shorter "Contacta con atención al cliente" opener.

export const generationLoopLab = {
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
    demoEndNote: 'La demostración se detuvo aquí porque su recorrido guionizado está completo. Un bucle real se detiene cuando llega una señal de fin, cuando se alcanza una longitud máxima, o cuando una regla de parada o una cancelación lo terminan.',

    nextStep: 'Siguiente paso',
    restart: 'Empezar de nuevo y elegir otro inicio',

    comparisonTitle: 'Mismo Prompt, dos inicios',

    transparencyNote:
        'Esta es una ilustración educativa simplificada. Los modelos reales generan la respuesta en unidades más pequeñas y sobre un vocabulario muy grande. Trabajamos a nivel de partes de frase para que el bucle quede claro. Las barras ilustran el grado de ajuste, no un cálculo real.',

    // ── selector de modo del laboratorio ──
    modeToggleLabel: 'Modo del laboratorio',
    modeA: 'Míralo construirse',
    modeB: 'Cambia la instrucción',

    // ── Modo B: cambia la instrucción (prompt variants) ──
    variants: {
        intro: 'La misma tarea: el modelo escribe una respuesta a un cliente sobre un paquete retrasado. Cambia la instrucción y observa cómo entra en el contexto y da forma a toda la respuesta que se construye después. La instrucción está en el contexto en cada paso, así que sigue influyendo en la siguiente elección durante toda la construcción.',
        pickLabel: 'Elige una instrucción',
        promptLabel: 'La instrucción',
        buildsLabel: 'Cómo se construye la respuesta, parte a parte',
        finalLabel: 'La respuesta construida',
        cautionLabel: 'Atención:',
        disclaimer: 'Estas partes son una ilustración educativa simplificada de la generación paso a paso, no un rastro real de un modelo.',
        items: {
            vague: {
                label: 'Vaga',
                prompt: 'Contéstale.',
                chunks: ['Lamentamos la espera', 'lo revisaremos', 'y te avisaremos pronto'],
                finalAnswer: 'Lamentamos la espera. Lo revisaremos y te avisaremos pronto.',
                outcomeLabel: 'Genérica',
                outcomeNote: 'La instrucción no dio dirección, así que el bucle construyó una respuesta genérica y segura que no ayuda de verdad al cliente. Sin estructura, sin detalles y sin un paso práctico.',
            },
            confident: {
                label: 'Demasiado segura',
                prompt: 'Dile que el paquete llegará mañana.',
                chunks: ['Tu paquete está en camino', 'llegará mañana', 'no te preocupes', 'y lamentamos el retraso'],
                finalAnswer: 'Tu paquete está en camino y llegará mañana. No te preocupes, y lamentamos el retraso.',
                outcomeLabel: 'Certeza no fundamentada',
                outcomeNote: 'La instrucción empujó al bucle a una apertura segura, y una vez escrita, el resto se construyó en torno a la certeza. La respuesta es fluida y convincente, pero promete una fecha que nunca se comprobó.',
                caution: 'Ningún paso del bucle comprobó el estado del paquete. La fluidez no es verdad, y una respuesta así puede engañar al cliente.',
            },
            careful: {
                label: 'Prudente',
                prompt: 'Escribe una respuesta breve y amable, sin adivinar un estado que no se ha comprobado.',
                chunks: ['Lamentamos el retraso', 'no podemos confirmar una fecha de llegada', 'sin comprobar el estado', 'y con gusto lo comprobamos por ti'],
                finalAnswer: 'Lamentamos el retraso. No podemos confirmar una fecha de llegada sin comprobar el estado, y con gusto lo comprobamos por ti.',
                outcomeLabel: 'Prudente',
                outcomeNote: 'La instrucción pidió explícitamente no adivinar, y esa indicación entró en el contexto. Así el bucle evitó una promesa infundada y construyó una respuesta útil y precisa.',
            },
            structured: {
                label: 'Estructurada',
                prompt: 'Escribe la respuesta en tres partes: empatía, lo que se sabe y lo que hay que comprobar.',
                chunks: ['Empatía: lamentamos el retraso', 'Lo que se sabe: el pedido se recibió y se envió', 'Lo que hay que comprobar: el estado actual con la empresa de transporte', 'y te avisaremos en cuanto sepamos'],
                finalAnswer: 'Lamentamos el retraso. Lo que se sabe: el pedido se recibió y se envió. Lo que hay que comprobar: el estado actual con la empresa de transporte. Te avisaremos en cuanto tengamos información.',
                outcomeLabel: 'Estructurada y estable',
                outcomeNote: 'La instrucción fijó una estructura de tres partes, y cada parte entró en el contexto y dio forma al siguiente paso. Así el bucle construyó una respuesta estable que mantiene la estructura que pediste y separa lo que se sabe de lo que hay que comprobar.',
            },
        },
    },

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
