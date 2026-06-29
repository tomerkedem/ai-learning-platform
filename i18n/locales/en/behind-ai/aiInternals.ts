// i18n/locales/en/behind-ai/aiInternals.ts
// English shared ai-internals chrome (ChatInterfacePanel, ConfidenceMeter).
// Shape source: ../../he/behind-ai/aiInternals. Real translation.
// No em dash (U+2014), no en dash (U+2013). "Claude" kept literal.

export const aiInternals = {
    chatInterface: {
        tryExample: 'Try a sample',
        demoBadge: 'Demo',
        aiTyping: 'AI typing',
        inputPlaceholder: 'Write a message...',
        liveTooltip: 'A real model (Claude) is connected',
        demoTooltip: 'Demo mode: scripted replies, no live model',
    },
    confidenceMeter: {
        levels: {
            high: 'High',
            medium: 'Medium',
            low: 'Low',
        },
    },
    stickyContextBar: {
        currentlyAnalyzed: 'Now analyzing',
    },
    // ReadAloudControls: read-aloud dock chrome (Web Speech API), shared across chapters.
    readAloud: {
        dock: 'Guided listening',
        play: 'Read aloud',
        pause: 'Pause',
        resume: 'Resume',
        stop: 'Stop',
        prev: 'Previous segment',
        next: 'Next segment',
        voice: 'Voice',
        browserDefault: 'Browser default voice',
        settings: 'Read-aloud options',
        nowReading: 'Now reading',
        unsupported: 'Read-aloud is not available in this browser.',
        scope: 'Scope',
        scopeShort: 'Short',
        scopeRegular: 'Regular',
        scopeFull: 'Full',
        speed: 'Speed',
    },
};
