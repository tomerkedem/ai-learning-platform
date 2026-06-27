// i18n/locales/ja/behind-ai/aiInternals.ts
// Japanese shared ai-internals chrome (ChatInterfacePanel, ConfidenceMeter).
// Shape source: ../../he/behind-ai/aiInternals. Real translation (concise Japanese).
// No em dash (U+2014), no en dash (U+2013). "Claude" kept literal. No emoji.

export const aiInternals = {
    chatInterface: {
        tryExample: '例を試す',
        demoBadge: 'デモ',
        aiTyping: 'AI が入力中',
        inputPlaceholder: 'メッセージを入力...',
        liveTooltip: '実際のモデル(Claude)が接続されています',
        demoTooltip: 'デモモード: 台本どおりの返信、ライブモデルなし',
    },
    confidenceMeter: {
        levels: {
            high: '高',
            medium: '中',
            low: '低',
        },
    },
    stickyContextBar: {
        currentlyAnalyzed: '分析中',
    },
};
