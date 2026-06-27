// i18n/locales/ja/behind-ai/introVisuals.ts
// Japanese introduction visual/UI strings. Shape source: ../../he/behind-ai/introVisuals.
//
// Display text only. Structural values (numbers, vectors, indices) stay in the
// components, and the attention token order is fixed (index 0 = noun, index 3 =
// pronoun, index 4 = state). Labels are kept short to fit the cards. "AI" and other
// Latin terms are kept on purpose. No em dash (U+2014), no en dash (U+2013), no Hebrew.

export const introVisuals = {
    roadmap: {
        peek: 'のぞく',
        zone: 'ゾーン',
        loopBadge: '経路の最初に戻る',
    },

    systems: {
        act: '幕',
        chapter: '章',
    },

    guess: {
        tokenCue: ['トー', 'クン'] as string[],
    },

    viz: {
        sharedNote: '数値は説明用で、実際のモデルの出力ではありません。',
        tokenize: {
            sentence: '私の荷物が届かない',
            tokens: ['私の', '荷物', 'が', '届かない'] as string[],
            caption: 'テキストは単位に分割されます。実際のモデルでは、分割が単語の途中に入ることもあります。',
        },
        embedding: {
            token: '荷物',
            caption: (note: string) =>
                `トークンは語彙のIDになり、次に意味を表す数値ベクトルになります。${note}`,
        },
        attention: {
            tokens: ['犬', '走った', 'なぜなら', 'それ', '嬉しい'] as string[],
            strongLabel: '強い関連',
            weakLabel: '弱い',
            caption: 'モデルは文脈から「それ」を「犬」に結びつけ、他のトークンとの関連は弱くなります。',
        },
        scores: {
            rowLabels: ['晴れ', '雨', '曇り'] as string[],
            caption: (note: string) =>
                `生のスコア（灰色）が合計100%の確率になります。${note}`,
        },
        loop: {
            steps: ['今日', '今日は', '今日は晴れ'] as string[],
            caption: 'そして次々と、トークンごとに、停止記号まで。',
        },
    },
};
