// i18n/locales/ja/behind-ai/introRoadmap.ts
// Japanese "map of the main stations" of the Introduction. Shape source: ../../he/behind-ai/introRoadmap.
// Only user-facing text is translated. Structure (station id, zone, viz kind) lives in the view layer.
// `term` keeps the conventional English technical term. No em dash (U+2014), no en dash (U+2013).

export const introRoadmap = {
    // ── 4つの学習ゾーン、テキストから回答まで（ゾーンIDごと） ──
    zones: {
        A: {
            title: 'テキストから処理単位へ',
            caption: 'リクエストが入り、モデルが処理できる単位に分解されます。',
        },
        B: {
            title: 'トークンから表現へ',
            caption: '各トークンは数値になり、文脈の中で自分の位置を得ます。',
        },
        C: {
            title: '文脈の計算',
            caption: 'トークンが互いに影響し合い、最新の内部表現が形づくられます。',
        },
        D: {
            title: '表現から回答へ',
            caption: '表現から次のトークンが導かれ、回答が完成するまで処理がくり返されます。',
        },
    },

    // ── 14の主要ステーション（ステーションIDごと） ──
    stations: {
        // ゾーンA - テキストから処理単位へ
        request: {
            title: '入力を組み立てる',
            term: 'Prompt',
            explanation: 'ユーザーがリクエストを書き、文脈とシステム指示とともに入ってきます。',
            detail: '製品は、ユーザーのリクエスト、システム指示、選択された現在の文脈から入力を組み立てます。履歴、メモリ、RAG、ツール結果は任意であり、保存情報のすべてがモデルに入るわけではありません。',
        },
        tokenize: {
            title: 'トークンへの分割',
            term: 'Tokenization',
            explanation: 'テキストは、モデルが処理できる処理単位に分解されます。',
        },
        ids: {
            title: 'トークンごとのID',
            term: 'Token IDs',
            explanation: '各トークンは、モデルの語彙から数値のIDを受け取ります。',
        },
        // ゾーンB - トークンから表現へ
        embedding: {
            title: '数値による表現',
            term: 'Embedding',
            explanation: 'IDは、モデルが計算できる数値ベクトルに変わります。',
        },
        position: {
            title: '位置と順序',
            term: 'Positional Encoding',
            explanation: 'モデルは、各トークンが他のトークンに対してどこにあるかを知る必要があります。',
        },
        context: {
            title: '文脈ウィンドウ',
            term: 'Context Window',
            detail: '文脈窓に入るのは現在の実行で利用できる内容だけです。保存された会話履歴、メモリ、保持情報のすべてではありません。',
            explanation: 'モデルは、会話、指示、そしてすでに生成されたトークンを考慮します。',
        },
        // ゾーンC - 文脈の計算
        attention: {
            title: '文脈への注意',
            term: 'Attention',
            detail: 'Attentionは現在の計算に対する動的な関連性を計算します。層、位置、生成ステップで変化し、単語の永続的な重要度ではありません。',
            explanation: 'トークンは、いま文脈のどの部分が重要かを確認します。',
        },
        mix: {
            title: '情報の混ぜ合わせ',
            term: 'Feed-Forward',
            detail: 'feed-forwardネットワークが各層の各位置を処理し、その表現の特徴を発展させます。',
            explanation: '各トークンはfeed-forwardネットワークで強化されます。大きなモデルでは、多くのうち数人の「専門家」だけがトークンごとに動きます。',
        },
        layers: {
            title: '深さの層',
            term: 'Transformer',
            explanation: '処理は多くの層を通してくり返され、各層が表現を磨き上げます。',
        },
        state: {
            title: '最新の内部表現',
            term: 'Hidden State',
            detail: '各位置には、関連する文脈を組み合わせた更新済みの内部表現があり、層を進むたびに変化します。',
            explanation: '現在の時点の文脈を要約する内部状態が形づくられます。',
        },
        // ゾーンD - 表現から回答へ
        logits: {
            title: '生のスコア',
            term: 'Logits',
            detail: 'Logitsは次のトークン候補に対する生のスコアであり、確率ではありません。',
            explanation: 'モデルは、次の候補となるトークンに生のスコアを与えます。',
        },
        softmax: {
            title: 'スコアから確率へ',
            term: 'Softmax',
            detail: 'Softmaxはスコアを確率分布へ変換しますが、トークンを選びません。',
            explanation: 'スコアは確率分布に変わります。',
        },
        decoding: {
            title: '次のトークンの選択',
            term: 'Decoding',
            detail: 'Decodingは分布と規則を使ってトークンを選択またはサンプリングします。最高確率の候補が常に選ばれるわけではありません。',
            explanation: 'デコーディングの規則が、実際にどの次のトークンを選ぶかを決めます。',
        },
        loop: {
            title: '回答までのループ',
            term: 'Autoregression',
            detail: '選ばれたトークンを追加し、次のトークンのステップへ進みます。実際の実装では、以前に計算した状態を再利用することがあります。',
            explanation: '選ばれたトークンが回答に加わり、そしてすべてがもう一度動きます。',
        },
    },
};
