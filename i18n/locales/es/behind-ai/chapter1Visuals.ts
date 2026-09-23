// i18n/locales/es/behind-ai/chapter1Visuals.ts
// Active visual copy for the canonical Transparent Chat and its conditional task-system preview.
// No em dash (U+2014) and no en dash (U+2013).

import type { Locale } from '@/i18n/config';

export const chapter1Visuals = {
    contentLocale: 'es' as Locale,

    // GlassEnginePanel: inner labels
    enginePanel: {
        stationNavLabel: 'Navegación entre estaciones',
        previousStation: 'Estación anterior',
        nextStation: 'Estación siguiente',
        replayStation: 'Repetir estación activa',
        resetJourney: 'Reiniciar recorrido',
        currentStationLabel: 'Estación actual',
        completedStationLabel: 'Estación completada',
        inputLabel: 'Entrada',
        transformationLabel: 'Transformación',
        outputLabel: 'Salida',
        conclusionLabel: 'Conclusión didáctica',
        limitationLabel: 'Límite de la ilustración',
        productEnvelope: {
            visibleRequest: 'Solicitud visible del usuario',
            systemInstruction: 'Instrucción de sistema añadida por el producto',
            selectedContext: 'Contexto actual seleccionado',
            modelInput: 'Entrada actual del modelo',
            insideWindow: 'Dentro de la ventana actual',
            omitted: 'No incluido en la entrada actual',
            systemInstructionExample: 'Responde brevemente en español a preguntas sobre reproducción de música.',
            selectedContextExample: 'Contexto elegido: soporte de la app de música; sin datos externos de reproducción.',
            omittedExample: 'Historial no seleccionado, memoria del producto, recuperación y herramientas.',
        },
        matrix: {
            token: 'Token', id: 'ID', embedding: 'Fragmento de embedding', position: 'Posición',
            positionAware: 'Representación con posición', attention: 'Después de Atención',
            feedForward: 'Después de feed-forward', checkpoint: 'Punto de control',
            predictionPosition: 'Posición de predicción',
        },
        scores: {
            candidate: 'Token candidato', logit: 'Logit bruto',
            total: 'Total', greedy: 'Greedy',
            sampling: 'Sampling', selectedToken: 'Token seleccionado',
        },
        generation: {
            step: 'Paso de generación', appended: 'Token añadido', updatedContext: 'Contexto actualizado',
            nextDistribution: 'Distribución del paso siguiente', stop: 'Condición de parada',
        },
        agent: {
            authorization: 'Autorización del sistema', authorized: 'Autorizado', unauthorized: 'No autorizado',
            humanApproval: 'Aprobación humana', approvalRequired: 'Se requiere aprobación',
            approvalGranted: 'Aprobación concedida', approvalDenied: 'Aprobación denegada',
            toolNotRun: 'No se llamó a ninguna herramienta', mcpOptional: 'MCP es una conexión posible, no un requisito',
        },
    },

    // "Sentence Journey" (Chat mode) strings.
    journey: {
        zones: {
            A: 'Del texto a unidades de trabajo',
            B: 'De tokens a representaciones',
            C: 'Calculando el contexto',
            D: 'De la representación a la respuesta',
        },
        pauseTag: 'Se detiene y pregunta',
        stations: {
            s1: { title: 'El producto arma la entrada', note: 'La solicitud visible entra en el producto, que añade una instrucción y contexto actual.', input: 'La solicitud visible del usuario.', transformation: 'El producto añade una instrucción de sistema guionizada y contexto actual seleccionado.', output: 'Una envoltura compacta de la entrada actual del modelo.', conclusion: 'Lo visible en el chat no es necesariamente todo lo que recibe el modelo.', limitation: 'Memoria, recuperación y herramientas no forman parte de esta ruta predeterminada.' },
            s2: { title: 'División en tokens', note: 'La entrada completa se divide en tokens ordenados, que no son necesariamente palabras.', input: 'La entrada actual armada por el producto.', transformation: 'Un ejemplo de tokenizer guionizado conserva los límites mostrados, incluida la puntuación o los espacios iniciales visibles.', output: 'Una secuencia ordenada de tokens.', conclusion: 'Los tokens son unidades de trabajo del modelo, no necesariamente palabras.', limitation: 'Los límites son un ejemplo didáctico guionizado, no el rastro de un tokenizer en vivo.' },
            s3: { title: 'Un ID por token', note: 'Cada token se asigna a una dirección entera y estable del vocabulario.', input: 'La secuencia ordenada de tokens.', transformation: 'Cada token se asigna a un Token ID.', output: 'Una tabla token-a-ID y una secuencia ordenada de IDs.', conclusion: 'Un Token ID es una dirección del vocabulario, no un significado.', limitation: 'IDs cercanos no implican significados similares y los IDs mostrados son guionizados.' },
            s4: { title: 'Vectores de embedding', note: 'Cada Token ID selecciona una fila vectorial aprendida; aquí solo se ven fragmentos.', input: 'Los Token IDs ordenados.', transformation: 'Cada ID selecciona una fila de una matriz de embedding aprendida.', output: 'Fragmentos de vectores apilados en orden de tokens.', conclusion: 'Los embeddings son representaciones numéricas asociadas a entradas del vocabulario.', limitation: 'Los fragmentos son guionizados; cualquier vista 2D es una proyección sintética, no el vector completo.' },
            s5: { title: 'Posición y orden', note: 'La información posicional se combina con cada embedding para conservar el orden.', input: 'La secuencia de vectores de embedding.', transformation: 'La información de posición se combina con la representación de cada token.', output: 'Una secuencia de representaciones con posición.', conclusion: 'El orden de los tokens cambia el cálculo.', limitation: 'Las arquitecturas combinan la información posicional de maneras distintas.' },
            s6: { title: 'Ventana de contexto', note: 'La ventana muestra qué está disponible ahora y qué queda fuera de la entrada.', input: 'La entrada armada y su secuencia con posición.', transformation: 'La ilustración marca qué cabe en la ventana actual y qué se omite.', output: 'El contexto disponible para el paso de generación actual.', conclusion: 'La ventana de contexto es el material que el modelo puede usar ahora.', limitation: 'No es todo el historial guardado ni implica memoria o retención del producto.' },
            s7: { title: 'Atención al contexto', note: 'Una captura sintética muestra influencia ponderada para una capa, una cabeza y una posición destino.', input: 'Las representaciones de posición en contexto.', transformation: 'Pesos normalizados combinan la influencia de posiciones origen en la posición destino.', output: 'Una representación contextual actualizada en la posición resaltada.', conclusion: 'Los pesos varían con contexto, posición, capa y paso de generación.', limitation: 'Los pesos de Atención por sí solos no explican por completo el comportamiento del modelo.' },
            s8: { title: 'Procesamiento feed-forward', note: 'La misma red feed-forward transforma cada vector de posición de forma independiente.', input: 'La secuencia de representaciones después de Atención.', transformation: 'Una red feed-forward cambia rasgos numéricos de forma independiente en cada posición.', output: 'Fragmentos de rasgos actualizados que vuelven a la secuencia.', conclusion: 'El proceso cambia la representación de cada posición; no fusiona la secuencia.', limitation: 'Solo algunos modelos MoE enrutan tokens por expertos elegidos; es una ampliación opcional, no una regla universal.' },
            s9: { title: 'Capas repetidas', note: 'Atención y feed-forward actualizan repetidamente la matriz de representaciones.', input: 'La secuencia de representaciones de la capa anterior.', transformation: 'Los mismos tipos de proceso se repiten y actualizan las representaciones en cada punto de control.', output: 'Matrices después de Capa 1, Capa 2 y la capa final.', conclusion: 'Las representaciones se actualizan y refinan entre capas.', limitation: 'Los puntos muestran fragmentos elegidos, no cada capa o rasgo.' },
            s10: { title: 'Representaciones contextuales finales', note: 'Queda una representación por posición; el vector de predicción pasa al cabezal de salida.', input: 'Representaciones finales para varias posiciones.', transformation: 'Se resalta la posición de predicción y su vector se envía al cabezal de salida.', output: 'El vector usado para puntuar el siguiente token.', conclusion: 'Permanecen varias representaciones y una relevante alimenta la puntuación siguiente.', limitation: 'Solo se muestra un fragmento breve del vector final.' },
            s11: { title: 'Logits brutos', note: 'El cabezal de salida asigna puntuaciones positivas o negativas a tokens candidatos.', input: 'La representación final en la posición de predicción.', transformation: 'El cabezal calcula un logit bruto para cada token del vocabulario.', output: 'Una muestra pequeña de candidatos en orden fijo.', conclusion: 'Los logits son puntuaciones brutas, no porcentajes.', limitation: 'No son verdad, confianza factual ni autorización; solo se ve una muestra de un vocabulario grande.' },
            s12: { title: 'Probabilidades Softmax', note: 'Softmax convierte los mismos logits en una distribución que suma aproximadamente 1.', input: 'Los logits mostrados en el mismo orden.', transformation: 'Softmax aplica exponentes y normaliza las puntuaciones.', output: 'Probabilidades de candidatos que suman aproximadamente 1.', conclusion: 'Softmax crea una distribución; no selecciona el token.', limitation: 'Un modelo real puntúa un vocabulario mucho mayor; los valores son guionizados.' },
            s13: { title: 'Decoding selecciona un token', note: 'Greedy elige el valor mayor; Sampling puede extraer otro candidato.', input: 'La distribución y la estrategia de Decoding activa.', transformation: 'Greedy elige al líder o Sampling usa una extracción guionizada y determinista.', output: 'Un token seleccionado que puede añadirse al texto.', conclusion: 'Decoding define cómo elegir de la distribución, no qué es verdadero.', limitation: 'La extracción es fija para que la repetición produzca el mismo resultado.' },
            s14: { title: 'Bucle de generación', note: 'Se añade un token, se actualiza el contexto y cambia la distribución siguiente.', input: 'El token elegido y el contexto actual.', transformation: 'Se añade el token, se actualiza el contexto, se calculan nuevas puntuaciones y se elige otro token o se alcanza una parada.', output: 'Dos pasos visibles y el fragmento guionizado mostrado en el Chat.', conclusion: 'La respuesta se construye token a token y las puntuaciones pueden cambiar tras cada adición.', limitation: 'Las implementaciones pueden reutilizar estado calculado en vez de empezar de cero; la ilustración es guionizada.' },
        },
        agent: {
            zones: {
                understand: 'Comprensión de la tarea',
                tools: 'Herramientas opcionales',
                control: 'Control y aprobación',
                exec: 'Ejecución y bucle',
                output: 'Salida',
            },
            stations: {
                a1: { title: 'Entra la solicitud', note: 'La tarea que pediste - aquí empieza la ronda del agente.' },
                a2: { title: 'Identificar una tarea posible', note: 'El sistema infiere una tarea posible de la solicitud y el contexto; no conoce directamente la intención.' },
                a3: { title: 'Herramientas disponibles', note: 'El producto puede exponer herramientas autorizadas, como buscar o eliminar una playlist. MCP es un protocolo posible, no un requisito.' },
                a4: { title: 'Plan condicional', note: 'Solo si una herramienta puede ayudar y están los datos necesarios se considera una herramienta autorizada.' },
                a5: { title: 'Comprobación de información faltante', note: '¿Falta un dato para actuar? El agente se detiene y pregunta, en lugar de adivinar.' },
                a6: { title: 'Autorización y aprobación', note: 'La autorización controla el acceso; la aprobación humana es una puerta distinta antes de una acción externa sensible.' },
                a7: { title: 'Llamada condicional', note: 'El producto llama a una herramienta solo con información, autorización y aprobación requeridas. MCP es solo una conexión posible.' },
                a8: { title: 'Observación si se ejecutó', note: 'Solo hay Observación después de una llamada real y puede ser un resultado o un error. Sin llamada no hay observación.' },
                a9: { title: 'Bucle condicional', note: 'Tras una observación real, el sistema puede continuar, preguntar, detenerse o terminar.' },
                a10: { title: 'Responder, actuar o parar', note: 'El sistema responde, pide información o aprobación, ejecuta una acción autorizada o se detiene.' },
            },
            toolNames: ['Buscar playlist', 'Eliminar una playlist'],
            mcp: 'MCP (opcional)',
            observation: 'Ejemplo tras una llamada: detalles de la playlist recibidos',
            missingOn: 'Falta identificador (Playlist ID)',
            missingOff: 'Están todos los datos',
            loopNodes: ['Planificar', 'Llamada a herramienta', 'Observación', 'Razonar'],
            loopOutcomes: ['Continuar', 'Preguntar', 'Detener', 'Terminar'],
            agentNode: 'Agente',
            resultLabel: 'Resultado',
            gate: {
                safe: 'Respuesta segura',
                ask: 'Pedir información',
                approve: 'Se requiere aprobación',
                stop: 'Detener',
            },
        },
    },

    // engineTrace: station names, titles, captions and labels
    trace: {
        labels: {
            task: {
                'Delete a playlist': 'Eliminar una playlist',
                'Look up a playlist': 'Buscar una playlist',
                'Unclear task': 'Tarea poco clara',
                'General request': 'Solicitud general',
            },
            decision: {
                'Stop for approval': 'Detenerse para aprobación',
                'Use the Playlist API': 'Usar la herramienta de la playlist',
                'Use the Playlist deletion tool': 'Usar la herramienta de eliminar la playlist',
                'Ask for the Playlist ID before acting': 'Pedir el Playlist ID antes de actuar',
                'Ask what to handle': 'Preguntar qué gestionar',
                'Answer directly': 'Responder directamente',
            },
        },
    },

    // mockEngine: demo replies (resolved by the replyKey the engine returns)
    mockEngine: {
        chatReplies: {
            notDelivered: 'Esto parece un problema de reproducción. Conviene revisar la conexión e intentar reproducir de nuevo.',
            tracking: 'Podemos revisar qué canción está sonando ahora. ¿Quieres que lo revise?',
            system: 'Puede que sea un fallo en la aplicación. Conviene cerrarla y volver a abrirla.',
            payment: 'Aquí tienes algunas recomendaciones de música que encajan con tu pedido.',
            other: 'No estoy seguro de haber entendido exactamente. ¿Podrías describir el problema?',
        },
        agentReplies: {
            sensitive: 'Esta es una acción que elimina una playlist. No la realizaré sin verificación y aprobación - puedo preparar un borrador para aprobación.',
            tool: 'Hay un Playlist ID. Estoy revisando los detalles en la herramienta de la playlist...',
            askBarcode: 'Para revisar esto realmente, necesito el Playlist ID.',
            vague: 'Necesito entender a qué se refiere esto - ¿qué tarea o playlist debo revisar?',
            general: 'Esto suena como una solicitud general. Se puede responder directamente, sin una herramienta externa.',
        },
    },
};
