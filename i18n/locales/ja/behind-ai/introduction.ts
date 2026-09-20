// i18n/locales/ja/behind-ai/introduction.ts
// Japanese Introduction ("Behind the Scenes of AI"). Shape source: ../../he/behind-ai/introduction.
// contentLocale = 'ja' (real translation). Only user-facing text is translated; ids and structural keys
// are unchanged. Technical labels (Token IDs, Embedding, Attention, Transformer, Logits, Softmax,
// Decoding) and product terms (Agent, Chat, LLM, AI) stay in English by design; in lesson prose the
// word "prompt" is written as プロンプト. The station map lives in introRoadmap.ts.
// No em dash (U+2014), no en dash (U+2013).

import type { Locale } from '@/i18n/config';
import { introRoadmap } from './introRoadmap';

export const introduction = {
    contentLocale: 'ja' as Locale,

    // 判定カードの人間的な応答レイヤー。ステータス (チェックまたは電球、見出し、説明) は
    // 独立したレイヤーのまま残り、ここにあるのはその後に語られる一文だけで、正解と不正解で
    // まったく同じ形をとる。イントロダクション固有の文面。
    mentorRespond: {
        guessCorrect:
            'ここにたどり着いた理由は、答えは探し出されるものではなく組み立てられるものだ、という見方です。この見方は当たり前ではありません。外から見ると答えは最初から完成した形で届き、その前にあった過程の痕跡はどこにも残らないからです。',
        guessWrong:
            'この推測は勘違いから出たものではありません。四つの選択肢はどれも、外から見れば筋が通っています。外から見えるのはリクエストと回答だけだからです。いま役に立つのは、正しい説明を探すことではなく、その間でテキスト自体に何が起きているのかを問うことです。',
    },

    // ── Hero ──
    hero: {
        badge: '透明なラボ · Behind the Scenes',
        titleLead: 'あなたが送るメッセージと',
        titleAccent: '受け取る回答の間で、実際には何が起きているのか?',
        intro: 'チャットにメッセージを送った瞬間に何が起きているかをのぞいてみます。',
    },

    // ── チャットの例とエンジンへのゲート (EngineReveal + EngineGate) ──
    chat: {
        promptRole: 'あなたのリクエスト',
        prompt: '荷物が届きませんでした。どうすればいいですか?',
        inputPlaceholder: 'メッセージを入力...',
        answerRole: '回答',
        answer: 'それは残念です。配送状況を確認して、物流センターからの更新があるか見てみるとよいでしょう。',
        outsideLine: '外から見ると2つのステップに見えます。リクエストを書いて、回答を受け取った、という流れです。',
        curiosityLine: 'しかし本当の問いは、その間に何が起きたのか、です。',
        gateLead: 'ここで、リクエストと回答の間にあるものを開いてみましょう。',
        revealLabel: '質問と回答の間にあるエンジンを開く',
        closeLabel: '表示を閉じる',
        revealedLabel: 'エンジンの内側はこう見えます',
        bridge: '外から見える2つのステップの下では、一連の経路が動いています。これがその主要なステーションです。',
        downCue: '全体マップはすぐ下にあります',
    },

    // ── エンジンのゲートを開くと現れる、4つの抽象的なスーパーステーション ──
    engineTeaser: ['トークン', '数値', '文脈', '選択'],

    // ── クイック推測: 競い合う4つの説明 (HypothesisGuess) ──
    quickGuess: {
        eyebrow: 'クイック推測 · 競い合う4つの説明',
        question: 'その間に起きていることに、もっとも近い説明はどれでしょう?',
        hint: 'もっとも現実に近いと感じる説明を選んでください。ここに点数はなく、考え方のモデルを選ぶだけです。',
        correctTitle: '最も近い説明',
        correctLead: '最も近い学習用マップですが、これも単純化されています。',
        correctBody: 'モデルはトークンと数値表現を扱い、文脈を計算し、分布とデコード規則に従って次のトークンを選択またはサンプリングします。',
        correctBridge: 'まさにそれを、これから下にある行程マップで開いていきます。',
        wrongLead: 'これはよくある思い違いですが、実際に起きていることとは違います。',
        retry: 'もう一度選ぶ',
        revealCorrect: '正確な説明を表示する',

        /** Text of the four hypotheses, by id. Structure (cue, correct) lives in the view layer. */
        hypotheses: {
            read: {
                title: '直接の読み取り',
                concept: 'モデルは人のように文を読み、回答を組み立てる。',
                status: '魅力的だが不完全な比喩',
                whyTempting: '私たちはそう読むので、モデルも同じことをしていると考えるのは自然です。',
                whyWrong: 'モデルは人のように文字や単語を読みません。トークンと数値を扱います。',
            },
            rail: {
                title: '固定された経路',
                concept: 'モデルは常に同じ決まった数のステップを通る。製造ラインのように。',
                status: '一部は正しい',
                whyTempting: 'モデルを、ステップ数の決まった整然とした製造ラインと考えると気持ちがよいものです。',
                whyWrong: 'アーキテクチャには反復する計算構造がありますが、生成内容や製品の流れは、あらかじめ書かれた一つの固定経路ではありません。',
            },
            tokens: {
                title: 'トークンのエンジン',
                concept: 'モデルはテキストをトークンに分け、文脈を計算し、トークンごとに回答を生成する。',
                status: '最も近い説明',
                whyTempting: '回答がトークンと文脈から段階的に生成されるという中心的な考えを捉えています。',
            },
            archive: {
                title: 'リポジトリからの取り出し',
                concept: 'モデルはあらかじめ用意された回答をリポジトリから取り出す。',
                status: '基本モデルの説明としては誤り',
                whyTempting: '回答は仕上がって洗練されて聞こえるので、リポジトリから取り出したように思えます。',
                whyWrong: '基本モデルは通常、完成済みの回答を丸ごと取り出しません。回答を段階的に生成しますが、製品が外部検索を追加する場合はあります。',
            },
        },
    },

    // ── ステーションマップの見出しと開くためのヒント ──
    roadmapHeading: {
        eyebrow: '回答生成の中にある14のステーション',
        title: 'テキストから回答までの道のりにある、主要ステーションのマップ',
        subtitle: '組み立てられた入力から回答生成までを示す、自己回帰型言語モデルの学習用マップです。',
        hint: 'ステーションをクリックして中をのぞいてください。短い説明と例があります。',
    },

    // ── マップの下にある誠実さの注記 ──
    truthNote:
        'これは自己回帰型言語モデルの単純化した学習用マップであり、完全な記録でも、すべてのAI製品に共通する構造でもありません。検索、メモリ、ツール、自己確認、Guardrailsは任意のシステム機能です。',


    // ── Agent の切り分け: カードのコピーとライブデモ (AgentLoop) ──
    agent: {
        // Forward-looking framing (the card now appears before the map) + transition to the map.
        intro: 'この先を先取りします。答えるChatが、行動できるAgentになると何が変わるのでしょうか。',
        // Card copy, switches with the Chat/Agent toggle. "Agent" stays in English.
        card: {
            chat: {
                eyebrow: '基本の経路',
                title: '基本のChat経路：リクエスト、モデル、回答',
                body: 'この単純化した例では、リクエストがモデルに渡り、外部の操作を行わずに回答を返します。',
                closing: 'Chat製品によっては、検索、メモリ、ツール、フィルタリング、オーケストレーションをモデルの周囲に追加します。',
                note: 'これは単純化した経路であり、すべてのChat製品の定義ではありません。',
            },
            agent: {
                eyebrow: '追加の層',
                title: 'Agent はより賢い回答ではありません。完全な行動のループです',
                body: 'Agent モードでは、モデルは答えるだけではありません。判断し、ツールを選び、実行し、結果を確認し、そして回答を返すことができます。',
                closing: 'Agent はただテキストを予測するだけではありません。モデルを、行動するかどうか、どのツールを使うか、何が許されるかを決めるシステムで包みます。',
                note: 'これは Transformer の内部の層ではなく、モデルを取り巻くシステムです。',
            },
        },
        // The live demo. Mode labels (Chat/Agent/LLM) stay as product terms. Loop stages by id.
        demo: {
            layerLabel: 'Agent の層 · モデルを取り巻くシステム',
            layerLabelChat: '基本ルート · 入力・モデル・応答',
            modeChat: 'Chat',
            modeAgent: 'Agent',
            coreLabel: 'LLM',
            coreText: 'モデルがテキストと行動の提案を生成する',
            idleCore: '準備完了',
            run: 'ループを実行',
            running: '実行中...',
            replay: 'もう一度実行',
            hintPrompt: 'ループを実行すると、エンジンの動きを一歩ずつ見られます。',
            input: { label: 'リクエスト', text: '貼り付けたメールを要約して返信を送って' },
            output: { label: '回答', agent: '要約ができました。送信の承認待ちです', chat: '要約はこちらです。送信は私にはできません。' },
            consoleTitle: '判断コンソール',
            consoleLabels: { intent: '意図', tool: 'ツール', risk: 'リスク', next: '次のステップ' },
            consoleEmpty: '待機中',
            chatHint: '短い経路: 入力、モデル、回答。',
            agentHint: '完全なループ: 解釈、選択、リスク、行動。',
            agentStages: {
                in: { label: '入力', hint: 'あなたのリクエストがシステムに入り、ここからラウンドが始まります。' },
                task: { label: 'タスクを理解する', hint: 'このリクエストの本当の目的は?', intent: '要約して返信を送る' },
                tool: { label: 'ツールを選ぶ', hint: 'どのツールがタスクに役立つ?', tool: 'メール読み取り' },
                risk: { label: '承認を求める', hint: '必要な場合、外部操作は承認のために停止します。' },
                act: { label: '行動を実行する', hint: 'ツールを動かして結果を得ます。', next: 'ツールを実行中' },
                answer: { label: '回答を返す', hint: '要約し、送信前に承認を求めることもあります。', next: '承認待ち' },
            },
            chatStages: {
                in: { label: '入力', hint: 'あなたのリクエストが入ります。' },
                model: { label: 'モデル', hint: 'モデルがテキストの回答を生成します。' },
                out: { label: '回答', hint: '1つのテキストがあなたに返ります。世界への働きかけはありません。' },
            },
        },
    },

    // ── 行動への呼びかけ (リンク先 href は表示層に残る) ──
    scopeSentence: 'このコースでは、リクエストと回答生成から、信頼性、改善、ツールを使った制御された行動までをたどります。',

    cta: {
        eyebrow: '次のステップ',
        title: 'ここから最初の一歩です',
        body: '全体像を見ました。まだすべてのステーションを覚える必要はありません。第1章で透明なチャットを一緒に開きます。',
        button: '第1章を始める',
    },

    // ── 読み上げコントロール (Web Speech API)。ラベルのみ、ユーザー操作で開始。 ──
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

    // ── AIマップ: エンジンを開ける前の自動ジャーニー。beats[i] は概念上の i 番目の場面 (字幕と読み上げの両方) ──
    landscape: {
        intro: [
            'AIは、多くの技術やアプローチを含む幅広い世界の総称で、ひとつのものではありません。',
            'その中には、Machine Learning、Neural Networks、Deep Learning、Generative AI、LLM といった用語が出てきます。',
            'LLMを開いて仕組みを見る前に、まずこれらの用語がどうつながっているかを、簡単に整理しましょう。',
        ],
        readAloud: '読み上げ',
        eyebrow: 'エンジンを開ける前に: LLMはどこにいるのか?',
        regionLabel: 'AIの世界の短い地図',
        progressLabel: 'AIマップの進行状況',
        navLabel: 'AIの旅のナビゲーション',
        pauseLabel: '自動再生を一時停止',
        resumeLabel: '自動再生を再開',
        paused: '一時停止中',
        next: '次まで {time}',
        seconds: {
            zero: '{n}秒', one: '{n}秒', two: '{n}秒',
            few: '{n}秒', many: '{n}秒', other: '{n}秒',
        },
        waitingNarration: '読み上げの終了を待っています',
        nodes: ['AI', '機械学習', 'ニューラルネットワーク', 'ディープラーニング', '生成AI', 'LLM', 'Agent', '終了'],
        beats: [
            { t: '人工知能(AI)', b: '幅広い分野で、人が知的だと感じる作業を行うシステムを指します。' },
            { t: '機械学習(Machine Learning)', b: '複数あるアプローチのうちの一つにすぎません。システムが例からパターンを学びます。' },
            { t: 'ニューラルネットワーク', b: '機械学習のモデルの一群で、計算の層を通してパターンを学びます。' },
            { t: 'ディープラーニング(Deep Learning)', b: '同じニューラルネットワークに、多くの層があるものです。その後に続く別の段階ではありません。' },
            { t: 'ここで別の問い: システムは何をするのか?', b: '認識したり予測したりするシステムもあれば、作り出すシステムもあります。' },
            { t: '生成AI(Generative AI)', b: '新しいコンテンツを作り出すために設計されたシステムです。テキスト、画像、音声などが含まれます。ディープラーニングの次の段階ではありません。' },
            { t: 'チャットはどの道すじ?', b: '各道すじをタップして、私たちのチャットがどんなコンテンツを作るか確かめられます。' },
            { t: 'LLM - Large Language Model (大規模言語モデル)', b: '言語のパターンを学習し、文脈を扱ってテキストを生成できるニューラルネットワークです。私たちのチャットの中心にあるのが、この種類のモデルです。' },
            { t: 'Agent は大きな LLM ではありません。', b: 'Agent はモデルを中心に組み立てられたシステムです。目標に向かって動き、ときにはツールとその結果を使います。' },
            { t: 'これでLLMの位置がわかりました。', b: '次はLLMを開いて、内部で何が起きているかを見ます。' },
        ],
        agentNote: 'Agentic AI は、ある程度の自律性をもって目標の達成に向けて動くAIシステムを指す広い用語で、定義は人や資料によって少しずつ異なります。',
        textFocus: { t: 'このチャットはテキストを作ります', b: 'そのためテキストの道すじを進み、そこからLLMにたどり着きます。' },
        hintImage: 'ここでは画像が作られます。チャットで得られるのは言葉です。',
        hintAudio: 'ここでは音声が作られます。チャットで得られるのは言葉です。',
        tileText: 'テキスト',
        tileImage: '画像',
        tileAudio: '音声',
        llmSub: '言語モデル',
        manyLayers: '多くの層',
        recognize: '認識・予測',
        create: '作る',
        cat: 'ネコ',
        goal: '目標',
        tools: 'ツール',
        results: '結果',
        openLlm: 'LLMを開く',
        replay: '最初から見直す',
    },

    // ── サブ名前空間: 主要ステーションのマップ ──
    roadmap: introRoadmap,
};
