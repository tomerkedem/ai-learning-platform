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
        intro: 'La misma tarea: el modelo te da un consejo para que la pasta te salga mejor. Cambia la instrucción y observa cómo entra en el contexto y da forma a toda la respuesta que se construye después. La instrucción está en el contexto en cada paso, así que sigue influyendo en la siguiente elección durante toda la construcción.',
        pickLabel: 'Elige una instrucción',
        promptLabel: 'La instrucción',
        buildsLabel: 'Cómo se construye la respuesta, parte a parte',
        finalLabel: 'La respuesta construida',
        cautionLabel: 'Atención:',
        disclaimer: 'Estas partes son una ilustración educativa simplificada de la generación paso a paso, no un rastro real de un modelo.',
        items: {
            vague: {
                label: 'Vaga',
                prompt: 'Ayúdame.',
                chunks: ['Qué pena que no te esté saliendo bien', 'vamos a resolverlo', 'y lo intentas de nuevo la próxima vez'],
                finalAnswer: 'Qué pena que no te esté saliendo bien. Vamos a resolverlo y lo intentas de nuevo la próxima vez.',
                outcomeLabel: 'Genérica',
                outcomeNote: 'La instrucción no dio dirección, así que el bucle construyó una respuesta genérica y segura que no te ayuda de verdad. Sin estructura, sin detalles y sin un paso práctico.',
            },
            confident: {
                label: 'Demasiado segura',
                prompt: 'Dime que esta vez me va a salir perfecta.',
                chunks: ['Esta pasta te va a salir perfecta', 'seguro que esta vez sí', 'no te preocupes', 'y felicidades por seguir intentándolo'],
                finalAnswer: 'Esta pasta te va a salir perfecta, seguro que esta vez sí. No te preocupes, y felicidades por seguir intentándolo.',
                outcomeLabel: 'Certeza no fundamentada',
                outcomeNote: 'La instrucción empujó al bucle a una apertura segura, y una vez escrita, el resto se construyó en torno a la certeza. La respuesta es fluida y convincente, pero promete un resultado que nunca se comprobó.',
                caution: 'Ningún paso del bucle comprobó tu cocina, tu olla ni tu receta. La fluidez no es verdad, y una respuesta así puede engañarte.',
            },
            careful: {
                label: 'Prudente',
                prompt: 'Escribe una respuesta breve y útil, sin adivinar un resultado que no se ha comprobado.',
                chunks: ['Lamentamos que no te esté saliendo como quieres', 'no podemos prometer un resultado perfecto', 'sin comprobar tu cocina y tu olla', 'pero con gusto te ayudamos a comprobarlo'],
                finalAnswer: 'Lamentamos que no te esté saliendo como quieres. No podemos prometer un resultado perfecto sin comprobar tu cocina y tu olla, pero con gusto te ayudamos a comprobarlo.',
                outcomeLabel: 'Prudente',
                outcomeNote: 'La instrucción pidió explícitamente no adivinar, y esa indicación entró en el contexto. Así el bucle evitó una promesa infundada y construyó una respuesta útil y precisa.',
            },
            structured: {
                label: 'Estructurada',
                prompt: 'Escribe la respuesta en tres partes: empatía, lo que se sabe y lo que hay que comprobar.',
                chunks: ['Empatía: lamentamos que no te esté saliendo como quieres', 'Lo que se sabe: la pasta necesita suficiente agua hirviendo y salada, y un tiempo de cocción preciso', 'Lo que hay que comprobar: cuánto tiempo exacto la herviste y a qué temperatura', 'y seguimos desde ahí en cuanto lo compruebes'],
                finalAnswer: 'Lamentamos que no te esté saliendo como quieres. Lo que se sabe: la pasta necesita suficiente agua hirviendo y salada, y un tiempo de cocción preciso. Lo que hay que comprobar: cuánto tiempo exacto la herviste y a qué temperatura. Seguimos desde ahí en cuanto lo compruebes.',
                outcomeLabel: 'Estructurada y estable',
                outcomeNote: 'La instrucción fijó una estructura de tres partes, y cada parte entró en el contexto y dio forma al siguiente paso. Así el bucle construyó una respuesta estable que mantiene la estructura que pediste y separa lo que se sabe de lo que hay que comprobar.',
            },
        },
    },

    scenario: {
        prompt: 'Siempre intento cocinar pasta y nunca me sale bien. ¿Qué hago?',
        firstStepIntro:
            'El mismo Prompt exacto, pero hay varias formas razonables de abrir la respuesta. Elige la primera parte y observa cómo marca todo lo que se construye después.',
        branches: {
            'self-service': {
                label: 'Autoverificación',
                opener: 'Revisa cuánto tiempo la herviste',
                openerChanged:
                    'El inicio elegido marca en el contexto una dirección de autoverificación. A partir de aquí, las continuaciones que reciben más peso tratan de qué hacer con el resultado de esa comprobación.',
                summary: 'La respuesta se construye en torno a una autoverificación de la cocción, y solo pasa a pedir ayuda si eso no lo soluciona.',
                steps: [
                    {
                        changed:
                            'El contexto ya incluye revisar el tiempo de cocción. Por eso la continuación natural hace que el siguiente paso dependa del resultado de la comprobación, en lugar de saltar directamente a la acción.',
                        candidates: ['Si todavía no te está saliendo bien', 'Si te salió perfecta', 'Si es difícil saberlo con certeza'],
                    },
                    {
                        changed:
                            'Tras «Si todavía no te está saliendo bien», el contexto apunta a un callejón sin salida en la autoverificación. Ahora pedir ayuda se vuelve la parte más probable.',
                        candidates: ['pide ayuda a alguien con experiencia', 'inténtalo de nuevo mañana por tu cuenta', 'busca una receta completamente distinta'],
                    },
                    {
                        changed:
                            'Una vez que el contexto trata de pedir ayuda, la continuación probable es equipar la petición con algo que identifique qué salió mal. Lo que falló exactamente pasa al primer lugar.',
                        candidates: ['indica exactamente qué salió mal', 'indica cuánto tiempo la cociste', 'adjunta una foto del resultado'],
                    },
                    {
                        changed:
                            'Todo el contexto trata de entender qué salió mal en la cocción. Por eso el cierre probable es pedir consejos concretos, no pedir una receta totalmente nueva.',
                        candidates: ['y pide consejos concretos para arreglarlo', 'y pide una receta completamente nueva', 'y pide que te la preparen ellos'],
                    },
                ],
            },
            support: {
                label: 'Pedir ayuda',
                opener: 'Pide ayuda a alguien con experiencia',
                openerChanged:
                    'El inicio elegido marca una dirección de pedir ayuda a otra persona. A partir de aquí, las continuaciones probables tratan de gestionar esa petición, no de una autoverificación.',
                summary: 'La respuesta se construye en torno a obtener ayuda de alguien con experiencia, hasta recibir una explicación ordenada y guardarla para la próxima vez.',
                steps: [
                    {
                        changed:
                            'El contexto ya incluye pedir ayuda a alguien. El paso probable es darle lo que le permite ayudar, es decir, describir el plato.',
                        candidates: ['Describe qué pasta intentas preparar', 'Llama a alguien de inmediato', 'Escribe un mensaje largo y detallado'],
                    },
                    {
                        changed:
                            'Tras describir el plato, el contexto está listo para describir el problema en sí. Por eso la continuación probable es indicar con claridad que siempre sale mal.',
                        candidates: ['indica que siempre te sale mal', 'pide que se dé prisa y explique rápido', 'pregunta si deberías rendirte con la pasta'],
                    },
                    {
                        changed:
                            'El contexto describe un problema compartido con alguien con experiencia. El siguiente paso probable es una petición ordenada de orientación, es decir, pedir repasar el proceso juntos paso a paso.',
                        candidates: ['pide repasar el proceso juntos paso a paso', 'pide hablar con un chef profesional', 'pide que te lo preparen ellos'],
                    },
                    {
                        changed:
                            'Una vez recibida la explicación, el contexto apunta a algo que vale la pena guardar para la próxima vez. Por eso el cierre probable es guardar los pasos, no terminar sin anotarlos.',
                        candidates: ['y guarda los pasos para la próxima vez', 'y termina la conversación', 'y pide que te lo escriban'],
                    },
                ],
            },
        },
    },
};
