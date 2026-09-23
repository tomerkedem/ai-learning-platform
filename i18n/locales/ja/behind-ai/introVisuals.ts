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
        demo: {
            start: 'プレゼンモード',
            exit: 'プレゼンを終了',
            prev: '前へ',
            next: '次へ',
            counter: (n: number, total: number) => `ステーション ${n} / ${total}`,
        },
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
            userText: '夕食に何を作れますか?',
            systemLabel: 'システム指示',
            systemText: 'あなたは料理アシスタントです。実用的で簡潔な提案をしてください。',
            historyLabel: 'これまでの会話',
            historyText: '以前、家にパスタとトマトがあると伝えました。',
            stripLabel: 'すべてが一つの列として入る',
            caption: '指示、履歴、依頼が一つの長い列につながるので、そのすべてが答えを左右します。',
        },

        tokenize: {
            sentence: '私の猫が眠っています',
            tokens: ['私の', '猫', 'が', '眠っています'] as string[],
            caption: '実際のモデルでは、分割は単語の間だけでなく、単語の途中に入ることもあります。',
            altSentence: '再確認をお願いします',
            altTokens: ['再', '確認', 'を', 'お願い', 'します'] as string[],
            // Maps each piece to its original word (same-word pieces share a color).
            altGroups: [0, 0, 1, 2, 2] as number[],
            altCaption: '同じ色のかけらは、もとは一つの言葉でした。モデルは言葉のかけらでも動きます。',
            variantA: 'シンプルな文',
            variantB: '長い言葉',
        },

        ids: {
            hint: 'カードをタップすると裏返ります',
            caption: 'IDは語彙の中の住所であって、意味ではありません。',
        },

        embedding: {
            token: '猫',
            caption: (note: string) =>
                `トークンは語彙のIDになり、次に意味を表す数値ベクトルになります。${note}`,
            // Fixed order across locales (vector numbers are mapped by index): 0 cat, 1 dog, 2 car, 3 bicycle.
            mapWords: ['猫', '犬', '車', '自転車'] as string[],
            mapHint: '地図の言葉をタップ',
            nearLabel: '一番近いペア',
            mapCaption: '意味が近い表現は、空間の中で近くに位置することがあります。',
        },

        position: {
            tokens: ['まず', '雨', 'それから', '晴れ'] as string[],
            swapLabel: '順番を入れ替える',
            meaningA: '最初に雨が降り、あとで晴れます。',
            meaningB: '最初は晴れていて、あとで雨が降ります。',
            caption: '位置タグが、ここで「前」と「後」を分けています。',
        },

        context: {
            windowLabel: 'コンテキストウィンドウ',
            outLabel: 'ウィンドウの外',
            addLabel: '新しいメッセージが届く',
            messages: [
                '友達の誕生日は土曜日です',
                'なるほど、覚えておきます!',
                '何をプレゼントすればいいですか?',
                '本か植物はどうでしょう',
                'まだ決めていません',
                'ところで、友達の誕生日は何曜日でしたか?',
            ] as string[],
            caption: 'ウィンドウは大きくなりません。新しいメッセージが入るたび、古いものが押し出されます。',
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
            caption: 'それぞれの言葉は異なる強さで他の言葉に注意を向けます。',
        },

        // Station 8: two different tokens, each routed to different experts.
        mix: {
            tokenA: 'レシピ',
            tokenB: '天気',
            routerLabel: 'ルーターが選ぶ',
            activeNote: (k: number, n: number) => `${n}人中${k}人の専門家が動く`,
            outLabel: '強化済み',
            hint: 'トークンを切り替えて、どの専門家が点灯するか見て',
            caption: 'アテンションのあと、各トークンはfeed-forwardネットワークを通って強化されます。大きなモデルでは、これがMixture-of-Expertsとして働き、膨大な知識を持ちながら、トークンごとにごく一部だけが動きます。「専門家」は人間の分野別専門家ではありません。振り分けは学習で得られた純粋に数値的なもので、人がそのまま読めるものではありません。',
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
            caption: '理解する層が一つあるわけではありません。同じブロックが繰り返され、理解は少しずつ積み上がります。',
        },

        state: {
            orbLabel: '文脈全体のひとつの表現',
            insideBtn: '中に何が詰まっている?',
            caption: '文脈そのものが消えるわけではなく、生成のたびにモデルは文脈をもう一度見直します。',
        },

        logits: {
            prompt: '明日は...',
            words: ['晴れ', '雨', '曇り', '暑い', '涼しい', '快適', '嵐', '快晴'] as string[],
            note: '一度に検討される数万の候補のうちの8つです。',
            caption: (note: string) =>
                `スコアが高いことは「より起こりそう」だけを表し、「どれだけ」は表しません。${note}`,
        },

        scores: {
            rowLabels: ['晴れ', '雨', '曇り'] as string[],
            rawHeader: '生スコア',
            probHeader: '確率',
            totalLabel: '合計',
            caption: (note: string) =>
                `変換したあとでも、これはまだ分布であって決定ではありません。${note}`,
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
            caption: 'だからチャットの答えは目の前で言葉ずつ組み上がるのです。',
        },
    },
};
