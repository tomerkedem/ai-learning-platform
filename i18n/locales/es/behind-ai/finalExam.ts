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
    questionOverrides: {
        1: {
            question: 'De la entrada a la respuesta, ¿cuál es el orden correcto de lo que ocurre entre bastidores?',
            options: [
                'Respuesta, luego tokens, luego números, luego probabilidades',
                'Tokens, luego números y vectores, luego similitud y puntuaciones, luego probabilidades, luego una decisión',
                'Probabilidades, luego tokens, luego una decisión, luego números',
                'El modelo salta directo de la pregunta a la respuesta, sin etapas',
            ],
            explanation: 'El camino se construye capa sobre capa: primero la división en tokens, luego la conversión a números y vectores de significado, luego la similitud y las puntuaciones, luego las probabilidades (tras Softmax) y solo al final una decisión. Ninguna etapa aparece por sí sola.',
        },
        2: {
            question: '¿Por qué el motor divide el texto en tokens antes de calcular el significado?',
            options: [
                'Para acortar el texto y ahorrar memoria',
                'Porque necesita unidades de trabajo uniformes que se puedan convertir en números y sobre las que se pueda calcular',
                'Para traducir el texto al inglés',
                'Porque los tokens ya son la respuesta final',
            ],
            explanation: 'La IA no empieza por entender, sino por dividir. Los tokens son unidades de trabajo que pueden convertirse en Token IDs y luego en vectores, y esa es la condición para todo cálculo de significado y de probabilidad posterior.',
        },
        3: {
            question: '¿Por qué los números son tan centrales en la IA?',
            options: [
                'Porque los números suenan más profesionales que las palabras',
                'Porque sin una representación numérica no se puede calcular la similitud, ordenar opciones ni comparar significados',
                'Porque el modelo no sabe leer inglés',
                'Porque los números ocupan menos almacenamiento que las palabras',
            ],
            explanation: 'El motor trabaja con números, no con palabras. Solo cuando el significado se convierte en un vector de números se puede medir la dirección, calcular la similitud y convertir puntuaciones en probabilidades. Los números son el idioma en el que el motor realmente calcula.',
        },
        4: {
            question: 'El modelo devolvió una respuesta con una probabilidad muy alta. ¿Qué significa?',
            options: [
                'Que la respuesta es seguramente correcta y se puede confiar en ella sin comprobarla',
                'Que es la opción que el modelo clasificó como más probable, pero una probabilidad alta no es verdad',
                'Que el modelo comprobó el dato en una fuente externa antes de responder',
                'Que no había otras opciones que el modelo considerara',
            ],
            explanation: 'Una probabilidad alta significa que esta opción encabezó la clasificación, no que sea verdadera. El motor estima verosimilitud, no verifica hechos. Una respuesta muy probable aún puede ser incorrecta.',
        },
        5: {
            question: 'El modelo acaba de escribir la primera parte de una respuesta. ¿Qué pasa con esa parte antes de que el modelo elija la siguiente?',
            options: [
                'Se deja de lado y no influye en lo que sigue',
                'Pasa a formar parte del contexto, y la siguiente elección se calcula con ella ya dentro',
                'El modelo la comprueba en una fuente externa y solo entonces continúa',
                'El modelo reinicia la respuesta desde la pregunta original únicamente',
            ],
            explanation: 'La generación es un bucle: cada parte elegida se suma al contexto, y el contexto actualizado fija las probabilidades del siguiente paso. Aquí no hay comprobación contra el mundo ni reinicio.',
        },
        6: {
            question: '¿Cuál es la relación correcta entre la similitud (Cosine Similarity) y la probabilidad?',
            options: [
                'Similitud y probabilidad son dos nombres para lo mismo',
                'Primero se calcula la probabilidad y de ella se deriva la similitud',
                'La similitud es cercanía de dirección y solo una etapa temprana; la probabilidad llega al final, después de Softmax',
                'No hay ninguna relación entre ellas, pertenecen a motores distintos',
            ],
            explanation: 'Es fácil confundirlas, pero no son lo mismo. La similitud mide cuán cerca está la dirección de dos vectores, y es una etapa temprana. Solo al final de la cadena, cuando las puntuaciones en bruto pasan por Softmax, aparecen las probabilidades. Leer la similitud como si fuera probabilidad es saltarse la mitad del camino.',
        },
        7: {
            question: '¿Cuál es la diferencia esencial entre un Chat y un Agent?',
            options: [
                'Un Agent es más rápido y un Chat es más lento',
                'Un Chat elige una respuesta, y un Agent elige el siguiente paso correcto: responder, usar una herramienta o detenerse',
                'Un Chat no usa tokens en absoluto y un Agent sí',
                'Un Agent no puede equivocarse y un Chat sí',
            ],
            explanation: 'Un Chat es un motor de respuestas: produce una respuesta de texto. Un Agent es un motor de acción: primero se pregunta cuál es el siguiente paso correcto, así que también puede comprobar, usar una herramienta o detenerse a pedir aprobación. Ambos pueden equivocarse.',
        },
        8: {
            question: 'Un Agent tiene una herramienta de correo, acceso a los datos del cliente y un mensaje redactado. ¿Por qué aun así es correcto que se detenga a pedir aprobación antes de enviar?',
            options: [
                'Porque en realidad no sabe enviar correos',
                'Porque la capacidad no es permiso, y una acción real y sensible en el mundo requiere aprobación y control',
                'Porque su confianza en el contenido del mensaje siempre es demasiado baja',
                'Porque no tiene acceso a los datos necesarios',
            ],
            explanation: 'Poder hacer algo no es aprobación para hacerlo. Cuanto más cerca del mundo real y más sensible es una acción, más control, permiso y responsabilidad necesita. Detenerse a pedir aprobación es el paso profesional, no una falta de capacidad.',
        },
        9: {
            question: '¿Cuándo el uso de una herramienta se vuelve peligroso o innecesario?',
            options: [
                'Solo cuando la herramienta es lenta y retrasa la respuesta',
                'Cuando la acción cambia algo en el mundo o expone información sensible, o cuando se puede responder correctamente sin adivinar',
                'Todo uso de una herramienta es igual de peligroso',
                'Las herramientas nunca son peligrosas, solo aceleran la respuesta',
            ],
            explanation: 'Una herramienta es una decisión con varios factores, no un botón. El uso innecesario gasta recursos y puede poner en riesgo la privacidad, y una acción que cambia el mundo exige cuidado. Por otro lado, adivinar cuando se podría comprobar en una fuente también es un error. El equilibrio es lo importante.',
        },
        10: {
            question: '¿Por qué un Agent necesita puertas de control como el riesgo, el permiso y la aprobación?',
            options: [
                'Para frenar el sistema a propósito y dar una sensación de control',
                'Porque cuanto más se acerca a una acción real en el mundo, más control y responsabilidad necesita',
                'Porque el modelo nunca está seguro de nada',
                'Para ahorrar costes de cómputo del motor',
            ],
            explanation: 'Las puertas de control no son un retraso artificial. Expresan un principio: una acción que afecta al mundo exige comprobar si es segura, si está permitida y si hace falta aprobación humana. La cercanía a una acción real es lo que eleva el listón del control.',
        },
        11: {
            question: 'Un usuario le escribe a un Agent \'Encárgate de esto\' sin más contexto. ¿Qué es lo más correcto que debe hacer?',
            options: [
                'Adivinar la interpretación más probable y actuar de inmediato',
                'Detenerse y preguntar qué se quiere decir, porque el objetivo es ambiguo y las interpretaciones están muy distantes',
                'Ejecutar todas las interpretaciones posibles a la vez para cubrirlo todo',
                'Ignorar la petición porque no es lo bastante clara',
            ],
            explanation: '\'Encárgate de esto\' es una petición ambigua. Cuando las interpretaciones difieren mucho y la confianza es baja, lo correcto antes de actuar es detenerse y pedir contexto. Adivinar inicia una acción sobre una base inestable, y hacerlo todo solo multiplica el riesgo.',
        },
        12: {
            question: '¿Cuál es la mejor manera de explicar a una persona no técnica qué hace la IA cuando responde?',
            options: [
                'Saca la respuesta correcta de una base de datos ordenada de hechos',
                'Hace una conjetura calculada: ordena las opciones por probabilidad y elige la que lidera, sin poseer una verdad absoluta',
                'Piensa como una persona y entiende exactamente lo que quisiste decir',
                'Busca la respuesta en internet cada vez',
            ],
            explanation: 'La explicación precisa y accesible es \'una conjetura calculada\': el modelo ordena las continuaciones posibles por probabilidad y elige la que lidera. No extrae un hecho seguro, no \'entiende\' como una persona y no necesariamente busca en internet. Esa distinción es lo que evita la confianza ciega.',
        },
        13: {
            question: '¿Qué indica una gran diferencia de probabilidad entre la continuación líder y las alternativas mostradas?',
            options: [
                'Es solo decoración',
                'El modelo prefiere con fuerza la opción líder dentro de esa distribución, no que sea verdadera, esté respaldada o autorizada',
                'Ralentiza el modelo',
                'Sustituye la respuesta',
            ],
            explanation: 'Una gran diferencia muestra una preferencia fuerte dentro de la distribución. No demuestra verdad, respaldo ni permiso para actuar. La confianza factual requiere contexto, evidencia, Grounding o verificación.',
        },
        14: {
            question: 'Las probabilidades del siguiente token son exactamente las mismas, pero dos ejecuciones de decodificación de estilo abierto producen continuaciones distintas. ¿Qué lo explica?',
            options: [
                'Las probabilidades cambiaron entre las dos ejecuciones',
                'La decodificación abierta elige a partir de la distribución, así que a veces puede salir una opción menos probable',
                'El modelo comprobó en cada ejecución cuál opción era más correcta',
                'Softmax eligió una opción distinta en cada ejecución',
            ],
            explanation: 'Las probabilidades se fijan antes de la elección. En un estilo abierto la elección muestrea de la distribución, así que las opciones más bajas también tienen una oportunidad, y eso añade variedad. La elección no es una comprobación de verdad y no cambia las probabilidades.',
        },
        15: {
            question: 'Un Agent reconoció que la petición es una tarea de acción y no una pregunta. ¿Qué es cierto sobre el siguiente paso?',
            options: [
                'Puede ejecutarla de inmediato, porque ya la reconoció correctamente',
                'Reconocer una tarea no es aprobación para actuar; puede faltar información o hacer falta aprobación',
                'Devolverá solo una respuesta de texto, sin ninguna acción',
                'Le pedirá al usuario que reformule la petición como pregunta',
            ],
            explanation: 'Reconocer una tarea es solo el comienzo. Incluso después de entender que se trata de una acción, el sistema comprueba qué falta y si el riesgo exige aprobación. Reconocer no es aprobar, y esta es una de las distinciones centrales del curso.',
        },
        16: {
            question: '¿Qué es una Tool Call en el bucle de trabajo del Agent?',
            options: [
                'La respuesta final que el Agent devuelve al usuario',
                'Una forma de traer una nueva Observation, tras la cual el Agent lee el resultado y decide de nuevo',
                'Una aprobación humana dada para una acción sensible',
                'El final del proceso, después del cual ya no hay más decisiones',
            ],
            explanation: 'Una Tool Call no es el final de la historia, es una forma de traer información nueva. El Agent trabaja en bucle: decide, ejecuta una herramienta, lee la Observation y vuelve a decidir a partir de ella. Un resultado claro, parcial o contradictorio lleva cada uno a una decisión distinta.',
        },
        17: {
            question: 'Corregiste una respuesta en un chat. ¿Qué es lo más preciso sobre usar esa corrección ahora y después?',
            options: [
                'El modelo tiene una memoria corta que se llena',
                'Puede influir en el contexto actual; no aparece automáticamente en un chat nuevo salvo que el producto la guarde o recupere, y eso no es entrenamiento inmediato',
                'Solo aprende de otros usuarios',
                'Decide ignorar tu corrección',
            ],
            explanation: 'La corrección puede influir en el contexto actual. Un producto puede guardar información seleccionada sin cambiar los parámetros. También pueden mejorar prompts, reglas, workflows, fuentes o herramientas; entrenar el modelo es otro proceso. Una corrección no reentrena al instante el modelo global.',
        },
        18: {
            question: 'Un Agent informa de una confianza muy alta en que una acción es correcta, pero la acción es de alto riesgo. ¿Qué es lo más correcto?',
            options: [
                'Ejecutarla de inmediato, porque una confianza alta justifica actuar',
                'Detenerse a pedir aprobación, porque una confianza alta no cancela la puerta de riesgo',
                'Cancelar la tarea por completo, porque el riesgo alto siempre está prohibido',
                'Ignorar el riesgo, porque el modelo ya está seguro de sí mismo',
            ],
            explanation: 'La confianza es una estimación interna del modelo y no sustituye la puerta de aprobación. Cuando la acción es sensible, incluso una confianza alta no elimina la necesidad de aprobación humana. Por otro lado, un riesgo alto no significa \'siempre prohibido\', significa \'detenerse y pedir aprobación\'. Ese es el núcleo de combinar confianza, riesgo y control.',
        },
    },
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
