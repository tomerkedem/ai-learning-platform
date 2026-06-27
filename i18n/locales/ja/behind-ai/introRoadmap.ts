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
            title: 'リクエストが入る',
            explanation: 'ユーザーがリクエストを書き、文脈とシステム指示とともに入ってきます。',
            detail: {
                whatHappens: 'あなたのリクエストは、システム指示と、会話ですでに語られた内容すべてに加わります。',
                whyItMatters: 'モデルは最後の文だけでなく、その周りの文脈すべてを見ています。',
                whatNext: 'このテキスト全体がどのように処理単位になるかを、このあと見ていきます。',
            },
        },
        tokenize: {
            title: 'トークンへの分割',
            explanation: 'テキストは、モデルが処理できる処理単位に分解されます。',
            detail: {
                whatHappens: 'テキストはトークンに切り分けられます。1語まるごとのこともあれば、語の一部や記号のこともあります。',
                whyItMatters: 'これがモデルが実際に扱う言語であり、文字でも、必ずしも単語でもありません。',
                whatNext: 'トークン化の章で、単語とトークンが常に同じではない理由を見ていきます。',
            },
        },
        ids: {
            title: 'トークンごとのID',
            term: 'Token IDs',
            explanation: '各トークンは、モデルの語彙から数値のIDを受け取ります。',
            detail: {
                whatHappens: '各トークンは、モデルの語彙にある固定の数値IDに対応づけられます。',
                whyItMatters: 'この数値は語彙の中の住所であり、まだ意味は持ちません。',
                whatNext: 'IDが意味を符号化する表現へとどう変わるかを、このあと見ていきます。',
            },
        },
        // ゾーンB - トークンから表現へ
        embedding: {
            title: '数値による表現',
            term: 'Embedding',
            explanation: 'IDは、モデルが計算できる数値ベクトルに変わります。',
            detail: {
                whatHappens: 'IDはベクトルに変わります。モデルが計算できる数値のリストです。',
                whyItMatters: '意味が近いトークンは、互いに近い数値を受け取ります。',
                whatNext: '意味の章で、ベクトルの向きが単語どうしの関係をどう符号化するかを見ていきます。',
            },
        },
        position: {
            title: '位置と順序',
            explanation: 'モデルは、各トークンが他のトークンに対してどこにあるかを知る必要があります。',
            detail: {
                whatHappens: '各トークンについて、他のトークンに対する位置の情報が保持されます。',
                whyItMatters: '「犬が人をかむ」と「人が犬をかむ」は別であり、順序が意味を変えます。',
                whatNext: 'この順序は、計算全体を通してモデルに付き添います。',
            },
        },
        context: {
            title: '文脈ウィンドウ',
            explanation: 'モデルは、会話、指示、そしてすでに生成されたトークンを考慮します。',
            detail: {
                whatHappens: 'モデルは、会話、指示、そしてここまでに生成されたトークンを考慮します。',
                whyItMatters: '同じ単語でも、周りにあるものによって別の意味になり得ます。',
                whatNext: 'この文脈が実際に計算へどう入るかを、このあと見ていきます。',
            },
        },
        // ゾーンC - 文脈の計算
        attention: {
            title: '文脈への注意',
            term: 'Attention',
            explanation: 'トークンは、いま文脈のどの部分が重要かを確認します。',
            detail: {
                whatHappens: '各トークンは、いま自分にとってどの他のトークンが重要かを確認します。',
                whyItMatters: 'こうして理解が築かれます。たとえば「彼」という語が、誰を指すかを知ります。',
                whatNext: '次の章で、文脈がモデルの判断をどう変えるかを見ていきます。',
            },
        },
        mix: {
            title: '情報の混ぜ合わせ',
            explanation: '文脈の情報が混ざり合い、表現を更新します。',
            detail: {
                whatHappens: '文脈の情報が混ざり合い、各トークンの表現を更新します。',
                whyItMatters: '表現は「単独の単語」であることをやめ、「文脈の中の単語」になります。',
                whatNext: 'この処理は、層を通して何度もくり返されます。',
            },
        },
        layers: {
            title: '深さの層',
            term: 'Transformer',
            explanation: '処理は多くの層を通してくり返され、各層が表現を磨き上げます。',
            detail: {
                whatHappens: '同じ処理が、多くの層を通して一つずつくり返されます。',
                whyItMatters: '各層が表現を磨き上げ、理解を加えます。',
                whatNext: '層の終わりで、最新の内部表現が形づくられます。',
            },
        },
        state: {
            title: '最新の内部表現',
            explanation: '現在の時点の文脈を要約する内部状態が形づくられます。',
            detail: {
                whatHappens: '現在の時点の文脈すべてを要約する内部状態が形づくられます。',
                whyItMatters: 'この状態から、次のトークンが導かれます。',
                whatNext: 'これでモデルは、候補に順位をつける準備が整います。',
            },
        },
        // ゾーンD - 表現から回答へ
        logits: {
            title: '生のスコア',
            term: 'Logits',
            explanation: 'モデルは、次の候補となるトークンに生のスコアを与えます。',
            detail: {
                whatHappens: 'モデルは、語彙にあるすべての候補トークンに生のスコアを与えます。',
                whyItMatters: 'このスコアはまだ割合ではなく、「どれだけ合うか」の尺度にすぎません。',
                whatNext: 'このあとスコアは確率に変わります。',
            },
        },
        softmax: {
            title: 'スコアから確率へ',
            term: 'Softmax',
            explanation: 'スコアは確率分布に変わります。',
            detail: {
                whatHappens: '生のスコアは、合計が100%になる分布に変わります。',
                whyItMatters: 'これで、次の各トークンが「どれだけありそうか」を語れます。',
                whatNext: 'デコーディングの規則が、分布の中から選びます。',
            },
        },
        decoding: {
            title: '次のトークンの選択',
            term: 'Decoding',
            explanation: 'デコーディングの規則が、実際にどの次のトークンを選ぶかを決めます。',
            detail: {
                whatHappens: 'デコーディングの規則が、確率の中から次のトークンをどう選ぶかを決めます。',
                whyItMatters: '同じ分布でも、より予測しやすい選択にも、より創造的な選択にもつながり得ます。',
                whatNext: '選ばれたトークンが回答に加わります。',
            },
        },
        loop: {
            title: '回答までのループ',
            explanation: '選ばれたトークンが回答に加わり、そしてすべてがもう一度動きます。',
            detail: {
                whatHappens: '選ばれたトークンが回答に加わり、そして次のトークンのために経路全体がもう一度動きます。',
                whyItMatters: 'こうして完全な回答が、トークンごとに、停止の合図まで築かれます。',
                whatNext: '最初の章で、このループが実際のリクエストで動くのを見ていきます。',
            },
        },
    },
};
