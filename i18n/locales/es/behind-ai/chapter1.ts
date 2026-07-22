// i18n/locales/es/behind-ai/chapter1.ts
// Spanish Chapter 1 ("What really happens between the question and the answer").
// Shape source: ../../he/behind-ai/chapter1. contentLocale = 'es' (real translation).
//
// No em dash (U+2014) and no en dash (U+2013). Mentor bubble text carries no emoji.
// "Claude" and "ANTHROPIC_API_KEY" are kept literal. seed inputs are coupled to the
// Spanish detection vocabulary in chapter-1/mockEngine.ts.

import type { Locale } from '@/i18n/config';
import { chapter1Visuals } from './chapter1Visuals';
import { chapter1Quiz } from './chapter1Quiz';

export const chapter1 = {
    contentLocale: 'es' as Locale,
    redesign: {
        summary: { title: 'Dos capas para recordar', points: ['Ruta del modelo: el texto se convierte en tokens y representaciones numéricas.', 'Las representaciones se convierten en puntuaciones del siguiente token y Softmax las transforma en probabilidades.', 'Decoding selecciona un token, se añade al texto y la generación se repite.', 'Envoltura del producto: el producto puede armar la entrada y tratar la salida alrededor del modelo.'] },
    },

    // Hero
    hero: {
        badge: 'Behind the Scenes · 01',
        titleLead: 'Lo que realmente ocurre entre',
        titleHighlight: 'la pregunta y la respuesta',
        ledeLead: 'Escribe una frase. El panel de Chat resulta familiar, como cualquier app. A su lado,',
        ledeHighlight: ' el panel del Motor abre el camino detrás de la respuesta',
        ledeRest: ': presenta una ilustración didáctica de la ruta desde el texto hasta el siguiente token. Por ahora observa; abriremos cada mecanismo más adelante.',
        chips: [
            'Panel de Chat: solicitud y respuesta visibles',
            'Panel del Motor: ilustración del camino interno',
            'Más adelante: abrimos cada paso en profundidad',
        ],
    },

    // Standalone mentor guidance before the Transparent Chat
    mentorGuide: {
        title: 'Ves una respuesta. Detrás hay todo un recorrido.',
        body: 'En el Chat Transparente verás cómo la misma solicitud cambia paso a paso hasta convertirse en una respuesta. Todavía no necesitas recordar cada número ni cada término. En cada estación, pregúntate: ¿qué entró, qué cambió y qué salió?',
    },

    // Transparent Chat Lab
    lab: {
        title: 'El Chat Transparente',
        eyebrow: 'Transparent Chat Lab',
        intro: 'El panel de Chat muestra la solicitud y la respuesta. El panel del Motor abre una ilustración del camino entre ambas.',
        panelTitle: 'Transparent Chat Lab',
        // Recognition bridge to the intro map (package anchor): same stations, now live.
        mapBridge: 'Las mismas 14 estaciones del mapa operan ahora sobre la solicitud que enviaste.',
        chatSubtitle: 'Chat Mode · conversación',
        agentSubtitle: 'Agent Mode · tarea',
        observationInstruction: 'No intentes recordar cada número. En cada estación, pregunta: ¿qué entró, qué cambió y qué salió?',
        simulationDisclosure: 'Esta es una ilustración didáctica determinista de ideas comunes de los modelos de lenguaje, no un registro directo del cálculo oculto de un modelo.',
        inputAriaLabel: 'Mensaje para analizar',
        sendAriaLabel: 'Enviar solicitud',
        activeRequestLabel: 'Solicitud seleccionada',
        visibleResponseLabel: 'Respuesta visible',
    },

    // Engine panel titles (GlassEnginePanel)
    panels: {
        answerEngineTitle: 'Answer Engine',
        actionEngineTitle: 'Vista previa del sistema de tareas',
        chatEngineSubtitle: 'Elegir una respuesta · estaciones clave',
        agentEngineSubtitle: 'Sistema alrededor del modelo · vista condicional',
    },

    // Chapter insight
    insightIdea: {
        title: 'La idea del capítulo',
        body: 'La respuesta visible en el chat es solo el final de un recorrido en el que el producto arma la entrada y el modelo convierte tokens y representaciones en una respuesta, paso a paso.',
    },
    // Chat seed inputs (default input + quick suggestions)
    // Note: these are demo inputs fed to the learning engine, coupled to the Spanish
    // detection vocabulary in chapter-1/mockEngine.ts.
    seed: {
        defaultInput: 'Mi paquete no llegó',
        suggestions: [
            'Mi paquete no llegó',
            '¿Dónde está mi paquete?',
            'Revisa el paquete 123456789',
            'Avisa al cliente que el paquete se perdió',
            'Encárgate de esto',
        ],
    },

    quiz: chapter1Quiz,

    // Visuals sub-namespace
    visuals: chapter1Visuals,
};
