// i18n/locales/ja/behind-ai/introVisuals.ts
// Japanese introduction visual/UI strings. Shape source: ../../he/behind-ai/introVisuals.
//
// Display text only. Structural values (numbers, vectors, indices, map positions)
// stay in the components. Fixed index contracts: attention tokens (0 = noun,
// 3 = pronoun, 4 = state), position tokens (indices 1 and 3 swap), embedding
// mapWords (0+1 close pair, 2+3 close pair), context messages (chronological).
// Labels are kept short to fit the cards. "AI" and other Latin terms are kept on
// purpose. No em dash (U+2014), no en dash (U+2013), no Hebrew.

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
        replay: 'もう一度',
        soundOn: '音を出す',
        soundOff: '音を消す',

        // 各駅ごとの短いメンター一言: カードの説明に角度を加える（繰り返さない）。
        mentorHints: {
            request: '注目: モデルはあなただけを見ることはありません。すべてが一緒に入ります。',
            tokenize: '文が切られる様子を見て。これはもう言葉ではなく、かけらです。',
            ids: 'ここから先、中に言葉はありません。数字だけです。',
            embedding: '数字はでたらめではありません。似た言葉は似た数字になります。',
            position: '同じ言葉でも順番が変われば意味も変わります。だから順番が保たれます。',
            context: '窓から出たものは忘れられます。だから長い会話は最初を失います。',
            attention: 'どの言葉も他の言葉に耳を傾けます。言葉をタップして、つながりを見て。',
            mix: '各トークンは専門家に送られます。多くのうち数人だけが点灯し、巨大なモデルでも速く保てます。',
            layers: '層ごとにアテンションとfeed-forwardをもう一度行い、少しずつ研ぎ澄まされます。実際のモデルには何十もあります。',
            state: '文脈全体が一つの点に凝縮されます。そこから次の言葉が生まれます。',
            logits: 'モデルは多くの言葉を一度に比べ、それぞれに点をつけます。',
            softmax: '点数は合計100になる割合に変わります。',
            decoding: '同じ分布でも選び方が違います。だから答えは時々意外です。',
            loop: 'トークンが選ばれ、また全部が動きます。こうして完全な答えができます。',
        },

        request: {
            youTab: 'あなたに見えるもの',
            modelTab: 'モデルが受け取るもの',
            userLabel: 'あなたのメッセージ',
            userText: '私の荷物はどこ?',
            systemLabel: 'システム指示',
            systemText: 'あなたはサポート担当です。回答の前に配送状況を確認してください。',
            historyLabel: 'これまでの会話',
            historyText: '昨日注文して、追跡番号を受け取りました。',
            stripLabel: 'すべてが一つの列として入る',
            caption: 'モデルは最後のメッセージだけを受け取るのではありません。指示、履歴、依頼が一つの長い列につながります。',
        },

        tokenize: {
            sentence: '私の荷物が届かない',
            tokens: ['私の', '荷物', 'が', '届かない'] as string[],
            caption: 'テキストは単位に分割されます。実際のモデルでは、分割が単語の途中に入ることもあります。',
            altSentence: '再配達をお願いします',
            altTokens: ['再', '配達', 'を', 'お願い', 'します'] as string[],
            // Maps each piece to its original word (same-word pieces share a color).
            altGroups: [0, 0, 1, 2, 2] as number[],
            altCaption: '同じ色のかけらは、もとは一つの言葉でした。モデルは言葉のかけらでも動きます。',
            variantA: 'シンプルな文',
            variantB: '長い言葉',
        },

        ids: {
            hint: 'カードをタップすると裏返ります',
            caption: 'ここから先、中に言葉はありません。数字だけです。',
        },

        embedding: {
            token: '荷物',
            caption: (note: string) =>
                `トークンは語彙のIDになり、次に意味を表す数値ベクトルになります。${note}`,
            // Fixed order across locales (vector numbers are mapped by index): 0 package, 1 delivery, 2 cat, 3 dog.
            mapWords: ['荷物', '配達', '猫', '犬'] as string[],
            mapHint: '地図の言葉をタップ',
            nearLabel: '一番近いペア',
            mapCaption: '意味が近い言葉は近い数値になり、近くに並びます。',
        },

        position: {
            tokens: ['まず', '支払い', 'それから', '配達'] as string[],
            swapLabel: '順番を入れ替える',
            meaningA: '荷物が出る前に支払います。',
            meaningB: '荷物が届いてから支払います。',
            caption: 'まったく同じ言葉でも、順番が変われば取引も変わります。だから各トークンに位置タグが付きます。',
        },

        context: {
            windowLabel: 'コンテキストウィンドウ',
            outLabel: 'ウィンドウの外',
            addLabel: '新しいメッセージが届く',
            messages: [
                'コードレス掃除機を注文しました',
                'ご注文を受け付けました',
                'いつ届きますか?',
                '本日発送します',
                '荷物がまだ届きません',
                '何をご注文でしたか?',
            ] as string[],
            caption: 'ウィンドウから出たものは、モデルにとって存在しません。だから長い会話は最初を忘れることがあります。',
        },

        // stories order must match the tokens order (index for index).
        attention: {
            tokens: ['犬', '走った', 'なぜなら', 'それ', '嬉しい'] as string[],
            strongLabel: '強い関連',
            weakLabel: '弱い',
            stories: [
                '「犬」は主に「走った」とつながります。動作の主です。',
                '「走った」は誰が走ったかを探し、「犬」とつながります。',
                '「なぜなら」は理由をつなぎ、「嬉しい」と結びつきます。',
                '「それ」とは何?モデルは「犬」と結びつけます。',
                '誰が嬉しい?「嬉しい」は「それ」、つまり犬とつながります。',
            ] as string[],
            caption: '言葉をタップすると焦点が変わります。それぞれの言葉は異なる強さで他の言葉に注意を向けます。',
        },

        // Station 8: one ambiguous word, two contexts, the meaning flips.
        mix: {
            tokenA: '配達',
            tokenB: '支払い',
            routerLabel: 'ルーターが選ぶ',
            activeNote: (k: number, n: number) => `${n}人中${k}人の専門家が動く`,
            outLabel: '強化済み',
            hint: 'トークンを切り替えて、どの専門家が点灯するか見て',
            caption: 'アテンションのあと、各トークンはfeed-forwardネットワークを通って強化されます。大きなモデルでは、ルーターが多くのうちほんの数人の専門家だけを点灯させます。これがMixture-of-Experts、膨大な知識を持ちながら、トークンごとにごく一部だけが動きます。',
        },

        layers: {
            sentence: '犬は嬉しかったので走った',
            floors: ['言葉と文法', '何が何を指すか', '意図と意味'] as string[],
            notes: [
                'モデルは構造をつかみます: 誰が何をするか。',
                'モデルはつなげます:「それ」は犬。',
                'モデルは理由を捉えます: 嬉しさが走った理由。',
            ] as string[],
            floorLabel: '階',
            blockLabel: '各層：アテンション + feed-forward',
            hint: '階をタップすると移動します',
            caption: '実際のモデルには何十もの階があり、それぞれが理解を少しずつ磨きます。',
        },

        state: {
            orbLabel: '文脈全体のひとつの表現',
            insideBtn: '中に何が詰まっている?',
            caption: '文脈全体がひとつの点に圧縮されました。次の言葉はここから生まれます。',
        },

        logits: {
            prompt: '明日は...',
            words: ['晴れ', '雨', '曇り', '暑い', '涼しい', '快適', '嵐', '快晴'] as string[],
            note: '一度に検討される数万の候補のうちの8つです。',
            caption: (note: string) =>
                `各候補が生スコアを受け取り、リストはトップ順に並びます。${note}`,
        },

        scores: {
            rowLabels: ['晴れ', '雨', '曇り'] as string[],
            rawHeader: '生スコア',
            probHeader: '確率',
            totalLabel: '合計',
            caption: (note: string) =>
                `生のスコア（灰色）が合計100%の確率になります。${note}`,
        },

        decoding: {
            prompt: '明日は',
            sure: '安全モード',
            surprise: 'サプライズモード',
            roll: '次の言葉を選ぶ',
            tally: 'これまでの結果',
            sureNote: '安全モードでは常にトップの言葉が選ばれます。同じ質問、同じ答え。',
            surpriseNote: 'サプライズモードでは、可能性の低い言葉が選ばれることもあります。だから同じ質問でも答えが変わるのです。',
        },

        loop: {
            words: ['今日', 'は', '晴れ', 'で', '過ごし', 'やすい'] as string[],
            play: '再開',
            pause: '一時停止',
            tokenLabel: 'トークン',
            stopLabel: '停止記号',
            caption: '一周ごとに答えへトークンが1つ加わります。だからチャットの答えは目の前で言葉ずつ組み上がるのです。',
        },
    },
};
