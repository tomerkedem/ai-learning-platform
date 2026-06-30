// i18n/locales/es/behind-ai/aiInternals.ts
// Spanish shared ai-internals chrome (ChatInterfacePanel, ConfidenceMeter).
// Shape source: ../../he/behind-ai/aiInternals. Real translation (neutral international Spanish).
// No em dash (U+2014), no en dash (U+2013). "Claude" kept literal. No emoji.

export const aiInternals = {
    chatInterface: {
        tryExample: 'Prueba un ejemplo',
        demoBadge: 'Demo',
        aiTyping: 'La IA escribe',
        inputPlaceholder: 'Escribe un mensaje...',
        liveTooltip: 'Un modelo real (Claude) está conectado',
        demoTooltip: 'Modo demo: respuestas guionizadas, sin modelo en vivo',
    },
    confidenceMeter: {
        levels: {
            high: 'Alto',
            medium: 'Medio',
            low: 'Bajo',
        },
    },
    stickyContextBar: {
        currentlyAnalyzed: 'Analizando ahora',
    },
    // ReadAloudControls: chrome del lector en voz alta (Web Speech API), compartido entre capítulos.
    readAloud: {
        dock: 'Escucha guiada',
        play: 'Leer en voz alta',
        pause: 'Pausar',
        resume: 'Reanudar',
        stop: 'Detener',
        prev: 'Segmento anterior',
        next: 'Segmento siguiente',
        voice: 'Voz',
        browserDefault: 'Voz predeterminada del navegador',
        settings: 'Opciones de lectura',
        sections: 'Secciones',
        nowReading: 'Leyendo ahora',
        unsupported: 'La lectura en voz alta no está disponible en este navegador.',
        scope: 'Alcance',
        scopeShort: 'Breve',
        scopeRegular: 'Normal',
        scopeFull: 'Completo',
        speed: 'Velocidad',
    },
};
