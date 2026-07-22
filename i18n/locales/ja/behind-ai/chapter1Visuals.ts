// i18n/locales/ja/behind-ai/chapter1Visuals.ts
// Japanese Chapter 1 visuals. Shape source: ../../he/behind-ai/chapter1Visuals.
// contentLocale = 'ja' (real translation).
//
// No em dash (U+2014) and no en dash (U+2013). Mentor bubble text carries no emoji.

import type { Locale } from '@/i18n/config';

export const chapter1Visuals = {
    contentLocale: 'ja' as Locale,

    // GlassEnginePanel: inner labels
    enginePanel: {
        stations: '主要なステーション',
        actLabel: '工程',
        normalizeTrimmed: '元の入力と比べて余分なスペースが削除されました。',
        inputClean: '入力はすでにきれい - 直すものはありません',
        noTokens: 'まだトークンはありません。',
        noMatch: '- 一致なし',
        claudeTokens: (n: number) => `Claude (実際): ${n} トークン`,
        claudeNote: '上の数は単語単位の数え方です。実際の数は異なります。モデルはサブワードに分割するためで、分割そのものは公開されず、数だけが分かります。',
        illustrationTitle: '原理のイラスト',
        illustrationBody: 'モデルごとに方法は異なりますが、どれも同じ原理に基づいています。これはまさに、あなたの文がたどる道筋です。',
    },

    // "Sentence Journey" (Chat mode) strings.
    journey: {
        zones: {
            A: 'テキストから処理単位へ',
            B: 'トークンから表現へ',
            C: '文脈の計算',
            D: '表現から答えへ',
        },
        anchorLabel: 'あなたの文、各ステーションで',
        selectedLabel: '選択',
        pauseTag: '止まって尋ねる',
        pauseNudge: {
            start: '反対の側を試そう。',
            body: '自信のある回答を見ました。Agent モードに切り替えて、印のついた候補を試し、エンジンが推測せずに止まって尋ねる、または承認を求める様子を見てみましょう。',
        },
        stations: {
            s1: { title: 'リクエストが入る', note: '選んだ文。エンジンをたどる旅の出発点です。' },
            s2: { title: 'トークンに分割', note: '同じ文が処理単位に切られます。いまやトークンです。' },
            s3: { title: '各トークンにID', note: '各トークンは語彙から番号を受け取ります。ここから先は数字だけ。' },
            s4: { title: '数値表現', note: '文のトークンが意味空間へ飛び、位置が意味を符号化します。表示される単語は学ぶ人のためのラベルで、各ラベルの裏にはモデルが比較する数値ベクトルがあります。' },
            s5: { title: '位置と順序', note: '各トークンに位置タグがあります。順序は意味の一部で、単語の袋ではありません。' },
            s6: { title: '文脈ウィンドウ', note: 'エンジンはいまウィンドウにあるものだけで動きます。それが文について見えるすべてです。' },
            s7: { title: '文脈への注意', note: 'エンジンは単語を数えません。どのトークンが効くかを重み付けします。ここでは強調されたトークンが隣の意味を形づくります。' },
            s8: { title: '情報の混合', note: '各トークンは feed-forward ネットワークで変換されます。一部の Mixture-of-Experts モデルでのみ、専門家の一部が有効になります。' },
            s9: { title: '深さの層', note: '注意と feed-forward が何十もの層で繰り返され、文の理解が研ぎ澄まされます。' },
            s10: { title: '最新の内部状態', note: '文全体が一つの内部表現に圧縮され、次のトークンを予測します。' },
            s11: { title: '生のスコア', note: 'エンジンは次の各候補にスコアを与えます。確率で候補を順位付けし、キーワードを数えません。' },
            s12: { title: 'スコアから確率へ', note: 'スコアは合計100%になる確率に変わります。最も高いものが先頭に立ちます。' },
            s13: { title: '次のトークンを選ぶ', note: 'Decoding は分布と規則に従ってトークンを選択またはサンプリングします。' },
            s14: { title: '答え', note: '選ばれたトークンを追加して次のステップを計算します。実装では計算済みの状態を再利用する場合があります。' },
        },
        agent: {
            zones: {
                understand: 'タスクの理解',
                tools: 'MCP 経由のツール',
                control: '制御と承認',
                exec: '実行とループ',
                output: '出力',
            },
            stations: {
                a1: { title: 'リクエストが入る', note: '頼んだタスク。ここからエージェントのラウンドが始まります。' },
                a2: { title: '目標の理解', note: 'エージェントは言葉だけでなく、本当の目標をつかみます。' },
                a3: { title: '使えるツール', note: '製品は追跡やメッセージなど許可されたツールを公開できます。MCP は選択可能なプロトコルの一つで、必須ではありません。' },
                a4: { title: 'ツールの選択と計画', note: 'エージェントはいま目標を前へ進めるツールを選びます。' },
                a5: { title: '不足情報の確認', note: '実行に足りない情報がある?エージェントは推測せず、止まって尋ねます。' },
                a6: { title: 'リスクと許可', note: '顧客に影響する行動(送信、更新)は承認が必要で、自ら実行しません。' },
                a7: { title: 'ツールの呼び出し', note: '製品が追跡システムなど許可されたツールを呼びます。一部のシステムは接続に MCP を使うことがあります。' },
                a8: { title: 'ツールからの結果', note: 'ツールは観測を返します。世界からの本当のステータスです。' },
                a9: { title: '推論とループ', note: '結果を手にして、続ける、別のツールを呼ぶ、尋ねる、または終える。' },
                a10: { title: '行動か停止', note: 'エージェントは答えを返す、行動する、承認を待つ、または止まります。' },
            },
            toolNames: ['配送追跡', '顧客へメッセージ送信'],
            mcp: 'MCP',
            loopLabel: '考え直す',
            observation: 'ステータス: 荷物は仕分け中',
            missingOn: '識別子がない(バーコード)',
            missingOff: '必要な情報はそろっている',
            riskOn: '機微な行動: 承認が必要',
            riskOff: '安全な行動',
            loopNodes: ['計画', 'ツール呼び出し', '観測', '推論'],
            loopOutcomes: ['続ける', '尋ねる', '止める', '終える'],
            agentNode: 'エージェント',
            resultLabel: '結果',
            gate: {
                safe: '安全な回答',
                ask: '情報を尋ねる',
                approve: '承認が必要',
                stop: '停止',
            },
        },
    },

    // engineTrace: station names, titles, captions and labels
    trace: {
        unit: 'トークン',
        labels: {
            intent: {
                'Package not delivered': '荷物が未配達',
                'Tracking question': '追跡の質問',
                'System issue': 'システムの問題',
                'Payment issue': '支払いの問題',
                'Other': 'その他',
            },
            task: {
                'Send / update on customer record': '顧客レコードの送信または更新',
                'Check delivery failure': '配送失敗の確認',
                'Unclear task': '不明確なタスク',
                'General request': '一般的な依頼',
            },
            decision: {
                'Stop for approval': '承認のため停止',
                'Use Tracking API': '追跡ツールを使う',
                'Ask for barcode before action': '行動前にバーコードを尋ねる',
                'Ask what to handle': '何を扱うか尋ねる',
                'Answer directly': '直接答える',
            },
        },
    },

    // mockEngine: demo replies (resolved by the replyKey the engine returns)
    mockEngine: {
        chatReplies: {
            notDelivered: '未配達のケースのようです。バーコードで配送状況を確認するとよいでしょう。',
            tracking: '追跡番号で配送状況を確認できます。追跡番号は何番ですか?',
            system: 'システムの情報表示の不具合かもしれません。更新してもう一度お試しください。',
            payment: 'この質問は請求や支払いに関係していそうです。請求書の詳細を確認するとよいでしょう。',
            other: '正確に理解できているか自信がありません。問題を詳しく教えていただけますか?',
        },
        agentReplies: {
            sensitive: 'これは顧客に影響する行動です。確認と承認なしには実行しません - 承認用の下書きを用意できます。',
            tool: 'バーコードがあります。追跡システムで配送状況を確認しています...',
            askBarcode: '実際に確認するには、荷物のバーコード番号が必要です。',
            vague: '何を指しているのか理解する必要があります - どのタスクや荷物を確認しますか?',
            general: '一般的な依頼のようです。外部ツールなしで直接お答えできます。',
        },
    },

    // ReadHeadLab
    readHead: {
        emptyState: '読み取りヘッドが走査できるよう、チャットに文を書いてください。',
        title: '読み取りヘッド',
        subtitle: '文の上を一語ずつ移動するカーソル',
        introHeadLabel: '読み取りヘッド',
        introMid: ' は一語ごとに止まります。止まるたびに、それまで読んだ語に同じエンジンが走って先頭の推測を計算し直すので、モデルが',
        introEmph: '読みながら先頭の推測を更新する',
        introTail: '様子を見られます。例を選んでスキャナーを動かしましょう。',
        distinctNote: '上のマップは全体の流れを一度に見せます。読み取りヘッドは、それが見せられないものを見せます。先頭の推測が読みながらどう変わるか、一語ずつ、あなたのペースで。',
        examplesLabel: '例を選ぶ',
        yourSentence: 'あなたの文',
        play: '再生',
        pause: '停止',
        again: 'もう一度',
        back: '戻る',
        forward: '進む',
        restart: '最初から',
        wordCountAria: (i: number, n: number) => `${n} 語中 ${i} 語目`,
        scrubberAria: '読み取りヘッドの位置',
        flipMarkerAria: 'ここで先頭が入れ替わりました',
        leaderNow: '現在の先頭:',
        leaderTag: '先頭',
        confidence: '確信度',
        decisionNow: '現在の判断:',
        streamHint: '幅 = 確率。時間は読む方向に流れます。',
        readingNow: 'まだ読み取り中... 判断は文の終わりで落ち着きます。',
        insightTitle: 'ここで起きたこと',
        insightChanges: (n: number) =>
            n === 0
                ? 'モデルは文を通して先頭を一度も入れ替えませんでした。先頭の候補は変わらず、確信を強めただけです。'
                : n === 1
                    ? 'モデルは読みながら一度だけ先頭を入れ替えました。'
                    : `モデルは読みながら ${n} 回先頭を入れ替えました。`,
        insightPivot: (w: string) => `最終判断をひっくり返した語: 「${w}」。`,
        scriptedNote: 'ガイド付きの例: 各位置は、より長い入力接頭辞を使う別々の実行を比較します。合成スコアは教材であり、実モデルの内部出力でも人間のような逐語読解でもありません。',
        liveNote: 'これはあなたの文で、章の学習エンジンに通したものです。確率はキーワードが入ったときだけ動くことに注目してください。',
        examples: [],
    },

    // ConfidenceDial (Chat mode)
    confidenceDial: {
        title: '確信度ダイヤル',
        ideaLabel: '考え方:',
        ideaPart1: ' エンジンは回答する前に、同じ文のいくつかの解釈を比べます。先頭の解釈と2位との',
        ideaGap: '差',
        ideaPart2: ' が、その確信度です。あなたの問い:',
        ideaEmph: ' どれだけの確信を求めるか',
        ideaPart3: ' で自力で回答させ、どんなときは止まって確認させる方がよいか。',
        howTitle: '使い方',
        how1: ' 入力を選びます(自分のものか例)。マーカーがエンジンの確信度に動きます。',
        how2: ' しきい値を軸に沿ってドラッグするか、リスクレベルを選びます。',
        how3Lead: ' しきい値がマーカーを越えると、判断が ',
        how3Mid: ' と ',
        answerAlone: '自力で回答',
        stopAsk: '止まって確認',
        leadingLabel: '先頭の解釈',
        gapLabel: '差',
        competitorLabel: '次点',
        tryInput: '入力を試す:',
        yourMessage: 'あなたのメッセージ',
        // Demo input: coupled to JA_VOCAB in mockEngine (see header note).
        samples: [
            { input: '荷物が届きません', tag: '明確な入力' },
            { input: '注文はどこ?システムに表示されません', tag: '混在した入力' },
            { input: '私の支払いはどこ?', tag: '曖昧な入力' },
        ],
        analyzingLead: '分析中: 「',
        analyzingTail: '」',
        dragHint: 'しきい値を軸に沿ってドラッグ',
        engineMarker: (margin: number) => `エンジン ${margin}%`,
        thresholdMarker: (threshold: number) => `しきい値 ${threshold}%`,
        thresholdAria: '必要な確信度のしきい値',
        stakesTitle: 'ここでエンジンが間違えたらリスクは?',
        // he/sub/note are display; the field name 'he' is kept for shape parity.
        stakes: {
            low: { he: '低リスク', sub: '単純な情報質問', note: 'ここでの間違いは安く済みます。低い確信を求め、エンジンに自力で答えさせてよいでしょう。' },
            mid: { he: '中リスク', sub: '部分的な情報', note: '中程度のしきい値が適切です。エンジンが計算した差がそれより小さければ、止まって確認する方がよいでしょう。' },
            high: { he: '高リスク', sub: '顧客に影響する行動', note: 'ここでの間違いは高くつきます。高い確信を求め、なければ止まって承認を求めます。' },
        },
        recommendedThreshold: (rec: number) => `推奨しきい値 ${rec}%`,
        passLead: (margin: number) => `エンジンの確信度(差 ${margin}%)は`,
        passBold: 'しきい値より上',
        passTail: (threshold: number) => `です(設定 ${threshold}%)。自力で回答します。`,
        failLead: (threshold: number) => `設定したしきい値(${threshold}%)は`,
        failBold: '確信度より上',
        failTail: (margin: number) => `です(エンジンの差 ${margin}%)。責任ある一歩: 止まって確認する。`,
        integrityLead: 'しきい値をエンジンのマーカーを越えるまでドラッグしてください。ちょうどそこで判断が反転します。エンジンが出した数は何も変わらず、変わったのは ',
        integrityBold: 'あなたが選ぶ方針',
        integrityTail: ' だけです。こうして確率が責任になります。',
    },

    // ConfidenceDial (Agent mode)
    agentGate: {
        title: 'Agent の判断ゲート',
        bodyLead: 'Agent ではゲートは確率の差ではなく、',
        bodyEmph: 'リスクと不足情報',
        bodyTail: ' に基づきます: タスクが明確か、識別子が欠けていないか、行動が機微かどうか。だからここに差のダイヤルはなく、判断は下の要素で決まります。',
        footerLead: '',
        footerTail: ' に切り替えると、確信度ダイヤルを差の上でドラッグできます。Agent では承認のために止まることは失敗ではなく、顧客に影響する行動の前の責任あるコントロールです。',
    },

    // CounterfactualDiff
    counterfactual: {
        title: 'もしも',
        whyLabel: 'なぜ重要か: ',
        whyLead: ' エンジンの判断は決して偶然ではなく、いつも決め手となる一語があります。ここでは二つのことをします。まず判断を生んだ語を',
        whyFind: '見つけ',
        whyMid: '、次にそれが本当にその語だと',
        whyProve: '証明',
        whyTail: 'します。その語だけを変えて、判断が反転するのを見ます。',
        howTitle: '使い方',
        how1: ' 因果のレバーを選びます - どの語を試すか。',
        how2: ' 下で、現在の判断を決めた語を確認します。',
        how3: ' その語だけが違う二つの言い回しを切り替え、判断が反転するのを見ます。',
        tryLever: 'レバーを試す:',
        noPivot: '軸の語なし',
        attrChose: 'エンジンが選んだ',
        // 'the ' prefix before the bold "why"; kept in the dictionary so no text is hardcoded.
        attrWhyPrefix: '',
        attrWhy: '理由',
        attrWithPivotMid: ' は語 ',
        attrWithPivotTail: ' です。本当にこれが決め手か確かめたいですか?下でこれだけを変えてみてください。',
        attrNoPivotMid1: ' は、実はここで',
        attrNoPivotMissing: '欠けている',
        attrNoPivotMid2: ' のが語 ',
        attrNoPivotTail: ' だからです。語が無いこともまた原因です。下で戻して見てください。',
        flipped: '判断が反転しました:',
        sameDecision: '判断は同じままですが、その語が先頭の意図と生成される返答を変えました。',
        barsTitle: 'エンジンが各解釈をどれだけ信じているか',
        barsLegend: '各バーの横の緑または赤の数字 = 変えた語によってその解釈がどれだけ上がったか下がったか。',
        barReadWith: (word: string, before: number, after: number) => `「${word}」という語が、先頭の解釈を ${before}% から ${after}% へ跳ね上げました。`,
        barReadWithout: (word: string, after: number) => `「${word}」という語がないと、際立つ解釈がなく、先頭でも ${after}% にとどまります。`,
        ghostHint: '破線の輪郭 = 前回の実行(ゴースト)',
        replyToCreate: '生成される回答',
        beforeAfter: '前 / 後',
        // Experiments: chip/why are display; variants[].text/pivot are coupled demo input.
        experiments: {
            chat: [
                {
                    key: 'neg',
                    chip: '否定語',
                    why: '一つの否定語が「すべて順調」を「問題がある」に変えます。それがなければ解決すべきものがなく、先頭の意図と判断が変わります。',
                    variants: [
                        { text: '荷物が届きません', pivot: '届きません' },
                        { text: '荷物が届きました', pivot: '' },
                    ],
                },
                {
                    key: 'kw',
                    chip: 'キーワード',
                    why: 'まったく同じ文の構造で、キーワードが一つ違うだけ - 先頭の意図がまったく別のカテゴリへ跳びます。',
                    variants: [
                        { text: '支払いに問題があります', pivot: '支払い' },
                        { text: 'システムに問題があります', pivot: 'システム' },
                    ],
                },
            ],
            agent: [
                {
                    key: 'barcode',
                    chip: '識別子(バーコード)',
                    why: '識別子がなければエンジンは行動できません。止まって不足情報を求めます。バーコードが入った瞬間、追跡ツールに手を伸ばします。',
                    variants: [
                        { text: '荷物 123456789 を確認して', pivot: '123456789' },
                        { text: '荷物を確認して', pivot: '' },
                    ],
                },
                {
                    key: 'sensitive',
                    chip: '機微な行動',
                    why: '行動語がリスクを決めます。「確認」は安全な呼び出し、「伝える」は顧客に影響します - だからエンジンは行動せず承認のために止まります。',
                    variants: [
                        { text: '荷物が紛失したと顧客に伝えて', pivot: '伝えて' },
                        { text: '荷物が紛失したか確認して', pivot: '確認して' },
                    ],
                },
            ],
        },
    },

    // ForkView
    forkView: {
        title: '分岐: 同じ入力、二つのエンジン',
        ideaLabel: '考え方:',
        ideaLead: ' まったく同じ入力が二つのエンジンに入ります。事実で対立しているのではなく、',
        ideaEmph: 'それについて別の問いを立てる',
        ideaTail: ' のです - だから異なる判断に至ります。',
        howTitle: '使い方',
        how1: ' 入力を選びます(自分のものか例)。',
        how2: ' まったく同じトークンが両方のエンジンに入るのを見ます。',
        how3: ' 比べます: 一致することもあれば、分かれることもあります。下のバーが理由を説明します。',
        tryInput: '入力を試す:',
        yourMessage: 'あなたのメッセージ',
        // Demo input: coupled to JA_VOCAB in mockEngine (see header note).
        samples: [
            { input: '荷物が届きません', tag: '苦情' },
            { input: '荷物 123456789 を確認して', tag: 'ID付きのタスク' },
            { input: '荷物が紛失したと顧客に伝えて', tag: '機微な行動' },
            { input: '営業時間は何時ですか', tag: '一般的な質問' },
        ],
        analyzingLead: '分析中: 「',
        analyzingTail: '」',
        sameTokens: '同じトークンが両方のエンジンに入ります',
        divergeLead: 'ここで分かれます: Chat は「',
        divergeMid: '」を選び、Agent は「',
        divergeTail: '」を選びました。',
        agreeLead: 'ここで一致します: 両方とも「',
        agreeTail: '」に至りました。エンジンの問いが違っても、答えが同じになることがあります。',
        questionLabel: 'その問い:',
        chatQuestion: '答えは何か?',
        agentQuestion: '安全な次の一歩は何か?',
        footer: 'まったく同じトークンで、ときに二つの判断。違いは入力ではなく、各エンジンがそれについて立てる問いにあります。Chat はありそうな答えを選び、Agent は安全な次の一歩を比べます - 回答、ツール使用、または止まって情報を求める。',
    },

    // PredictDecision (next-word guess)
    predict: {
        eyebrow: 'クイック予想 · 言葉を完成',
        question: 'エンジンは次にどの言葉を選ぶでしょう?',
        subtitle: '読み取りヘッドを動かす前に - 次に最も来そうな言葉を予想してください。',
        sentenceLead: '私の荷物はまだ',
        sentenceTail: 'いません',
        words: {
            absurd: '踊って',
            arrived: '届いて',
            plausible: '発送されて',
        },
        correctTitle: '正解です！',
        correctBody: 'その通り。ここでは「届いて」が自然な続きなので、エンジンはこれに最も高い確率を与えます。',
        wrongTitle: 'おしい！',
        wrongBody: 'エンジンなら「届いて」をずっと上位に置きます。ここでは最も可能性の高い続きです。ほかの言葉はこの文脈ではめったに来ません。',
        rankingLabel: 'エンジンによる言葉の順位づけ',
        bridge: 'まさにこの順位を、下の読み取りヘッドがライブで見せてくれます',
        guessAgain: 'もう一度予想',
    },
};
