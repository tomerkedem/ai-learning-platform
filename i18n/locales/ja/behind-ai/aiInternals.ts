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
    // ReadAloudControls: 読み上げドックの表示文言 (Web Speech API)、全章で共有。
    labZoom: {
        expand: '全画面',
        collapse: '章に戻る',
        expandAria: 'ラボを全画面に拡大',
        collapseAria: '章内の通常表示に戻る',
    },

    readAloud: {
        dock: '音声ガイド',
        play: '読み上げ',
        pause: '一時停止',
        resume: '再開',
        stop: '停止',
        prev: '前のセグメント',
        next: '次のセグメント',
        voice: '音声',
        browserDefault: 'ブラウザーの既定の音声',
        settings: '読み上げオプション',
        sections: 'セクション',
        nowReading: '読み上げ中',
        unsupported: 'このブラウザーでは読み上げを利用できません。',
        scope: '範囲',
        scopeShort: '短め',
        scopeRegular: '標準',
        scopeFull: '詳細',
        speed: '速度',
    },
};
