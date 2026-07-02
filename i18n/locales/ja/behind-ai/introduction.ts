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
        correctTitle: '正解です！',
        correctLead: 'これがより正確なイメージです。',
        correctBody: 'モデルはトークンを扱い、文脈を計算し、次のトークンを選び、そしてこの流れをくり返します。',
        correctBridge: 'まさにそれを、これから下にある行程マップで開いていきます。',
        wrongLead: 'これはよくある思い違いですが、実際に起きていることとは違います。',
        retry: 'もう一度選ぶ',
        revealCorrect: '正確な説明を表示する',

        /** Text of the four hypotheses, by id. Structure (cue, correct) lives in the view layer. */
        hypotheses: {
            read: {
                title: '直接の読み取り',
                concept: 'モデルは人のように文を読み、回答を組み立てる。',
                whyTempting: '私たちはそう読むので、モデルも同じことをしていると考えるのは自然です。',
                whyWrong: 'モデルは人のように文字や単語を読みません。トークンと数値を扱います。',
            },
            rail: {
                title: '固定された経路',
                concept: 'モデルは常に同じ決まった数のステップを通る。製造ラインのように。',
                whyTempting: 'モデルを、ステップ数の決まった整然とした製造ラインと考えると気持ちがよいものです。',
                whyWrong: '決まったステップ数はありません。1回ごとに膨大な計算が走り、モデルと文脈によって変わります。',
            },
            tokens: {
                title: 'トークンのエンジン',
                concept: 'モデルはテキストをトークンに分け、文脈を計算し、トークンごとに回答を生成する。',
            },
            archive: {
                title: 'リポジトリからの取り出し',
                concept: 'モデルはあらかじめ用意された回答をリポジトリから取り出す。',
                whyTempting: '回答は仕上がって洗練されて聞こえるので、リポジトリから取り出したように思えます。',
                whyWrong: 'できあいの回答のリポジトリはありません。モデルはリアルタイムに、トークンごとに回答を生成します。',
            },
        },
    },

    // ── ステーションマップの見出しと開くためのヒント ──
    roadmapHeading: {
        eyebrow: 'エンジンを開く',
        title: 'テキストから回答までの道のりにある、主要ステーションのマップ',
        subtitle: '外から見える2つのステップの下では、一連の経路が動いています。これがその主要なステーション、リクエストから回答までです。',
        hint: 'ステーションをクリックして中をのぞいてください。短い説明と例があります。',
    },

    // ── マップの下にある誠実さの注記 ──
    truthNote:
        'これは学習のためのマップであり、すべての計算をそのまま写したものではありません。実際のモデルでは、各ステーションの中で多くの処理が並行して起こり、正確な数はモデル、文脈の長さ、実行のしかたによって変わります。',

    // ── ステーション展開時の3つの問いの固定ラベル ──
    stationDetailLabels: {
        whatHappens: 'ここで何が起きる?',
        whyItMatters: 'なぜ重要?',
        whatNext: 'このあと何を見る?',
    },

    // ── Agent の切り分け: カードのコピーとライブデモ (AgentLoop) ──
    agent: {
        // Forward-looking framing (the card now appears before the map) + transition to the map.
        intro: 'モデルを深く開く前に、Chat と Agent の違いを少し理解しておきましょう。',
        transition: 'では真ん中の箱を開きます。モデルの中で実際に何が起きているのか。',
        // Card copy, switches with the Chat/Agent toggle. "Agent" stays in English.
        card: {
            chat: {
                eyebrow: '基本の経路',
                title: 'Chat は入力、モデル、そして1つの回答',
                body: 'Chat モードでは、モデルはリクエストを受け取り、1つの回答を返します。ツールもなく、世界への働きかけもなく、あるのは入力、モデル、回答だけです。',
                closing: 'Chat は回答ができた瞬間に止まります。ツールを動かさず、会話の外側のものを変えることもありません。',
                note: 'これはまさに Transformer の層です。テキストが入り、テキストが出ます。',
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
            hintPrompt: 'カーソルを合わせるかステーションを選ぶと、そこで何が起きるか見えます。ループの実行もできます。',
            input: { label: 'リクエスト', text: 'メールを要約して返信を送って' },
            output: { label: '回答', agent: '要約ができました。送信の承認待ちです', chat: 'ご依頼の要約はこちらです' },
            consoleTitle: '判断コンソール',
            consoleLabels: { intent: '意図', tool: 'ツール', risk: 'リスク', next: '次のステップ' },
            consoleEmpty: '待機中',
            chatHint: '短い経路: 入力、モデル、回答。',
            agentHint: '完全なループ: 解釈、選択、リスク、行動。',
            agentStages: {
                in: { label: '入力', hint: 'あなたのリクエストがシステムに入り、ここからラウンドが始まります。' },
                task: { label: 'タスクを理解する', hint: 'このリクエストの本当の目的は?', intent: '要約して返信を送る' },
                tool: { label: 'ツールを選ぶ', hint: 'どのツールがタスクに役立つ?', tool: 'メール読み取り' },
                risk: { label: 'リスクを確認する', hint: 'その操作は慎重に扱うべきものですか? 承認が必要ですか?', risk: '中: システムの外への送信' },
                act: { label: '行動を実行する', hint: 'ツールを動かして結果を得る (Observation)。', next: 'ツールを実行中' },
                answer: { label: '回答を返す', hint: '要約し、送信前に承認を求めることもあります。', next: '承認待ち' },
            },
            chatStages: {
                in: { label: '入力', hint: 'あなたのリクエストが入ります。' },
                model: { label: 'モデル', hint: 'モデルがテキストの回答を生成します。' },
                out: { label: '回答', hint: '1つのテキストがあなたに返ります。世界への働きかけはありません。' },
            },
        },
    },

    // ── コースの構成: 19章、6つのシステム (CourseSystems) ──
    systems: {
        heading: {
            eyebrow: 'この先の道のり',
            title: 'エンジンを一歩ずつ開いていく19章',
            summary: '19章、6つのシステム、少しずつ開いていく1つのエンジン',
            subtitle: 'これは章のカタログではありません。旅です。各幕でエンジンの別の部分が開き、やがて全体像がつながります。',
        },
        labels: {
            purpose: '何がわかる?',
            stations: 'マップ上の関連ステーション',
            chapters: 'どの章につながる?',
            open: 'ゲートを開く',
            startHere: 'ここから始める',
        },
        // The six systems, by id. Chapter numbers (n) and display order stay in the view layer,
        // and chapter names (chapters) are a list of labels in the system's fixed order.
        items: {
            outside: {
                title: '外からの視点: 透明なチャットと入力',
                range: '第1章 - 第2章',
                teaser: '「リクエストと回答」の裏には、一連の経路が隠れています。ここでそれが見え始めます。',
                purpose: 'チャットは単なるリクエストと回答だという思い込みを崩し、モデルに実際に何が入るのかを見ます。',
                stationChips: ['リクエストが入る', 'コンテキストウィンドウ'],
                chapters: ['透明なチャット：答えの背後にある道のり', 'Model Input：モデルに実際に入るもの'],
            },
            representations: {
                title: 'テキストからトークン、そして表現へ',
                range: '第3章 - 第7章',
                teaser: 'テキストは、どうやって計算できるもの、そして意味に変わるのか? ここでそれが起きます。',
                purpose: 'テキストが、モデルが扱うトークン、数値表現、意味、文脈へどう変わるかを理解します。',
                stationChips: ['トークンへの分割', 'Embedding', 'Attention'],
                chapters: ['Tokenization：テキストがトークンに分かれるとき', 'Embeddings：意味のない数字から意味へ', 'Semantic Space：モデルの意味の地図', 'Attention：いま重要なのは何か', 'Context Window：モデルがいま実際に見ているもの'],
            },
            generation: {
                title: '回答はどう組み立てられるか',
                range: '第8章 - 第10章',
                teaser: '表現ができたあと、回答の一語一語はどう選ばれるのか? ここでそれが起きます。',
                purpose: 'スコアがどう確率に変わり、次のトークンがどう選ばれ、完全な回答がループでどう組み立てられるかを理解します。',
                stationChips: ['Logits', 'Softmax', 'Decoding', '回答までのループ'],
                chapters: ['Logits & Softmax：スコアから確率へ', 'Decoding：次のトークンを選ぶ', 'Generation Loop：回答が最後までどう組み立てられるか'],
            },
            reliability: {
                title: '信頼性、出典、チェック',
                range: '第11章 - 第13章',
                teaser: 'なぜ回答は自信ありげに聞こえても誤りうるのか、そして何が根拠づけを助けるのか?',
                purpose: 'なぜ自信は正しさではないのか、いつ外部の出典が必要か、自己チェックがどう回答を改善するかを理解します。',
                stationChips: ['根拠ある回答', 'RAG', '自己チェック'],
                chapters: ['Hallucinations：なぜ自信ありげな回答が誤りうるのか', 'RAG & Grounding：AI を出典につなぐ方法', 'Self-Check：回答しながらの自己チェック'],
            },
            learning: {
                title: 'モデルはどう学び、どう良くなるか',
                range: '第14章 - 第16章',
                teaser: 'モデルは失敗からどう良くなるのか、そしてあなたについて本当に何を覚えているのか?',
                purpose: 'モデルが失敗からどう学ぶか、丸暗記と理解の違い、そして訂正したとき本当に何が変わるかを理解します。',
                stationChips: ['失敗から学ぶ', '丸暗記と汎化'],
                chapters: ['Learning from Mistakes：モデルは失敗からどう良くなるか', 'Evaluation & Generalization：丸暗記か理解か', 'Does AI Learn From Me：AI は私から学ぶのか'],
            },
            agent: {
                title: 'Chat から Agent へ',
                range: '第17章 - 第19章',
                teaser: 'モデルが答えるだけでなく、行動もするようになると何が起きるのか?',
                purpose: 'モデルを取り巻くシステムが、ツールを選び、リスクを確認し、承認を求め、または止まるとき、何が変わるかを理解します。',
                stationChips: ['エンジンを取り巻く層', 'Guardrails'],
                chapters: ['Chat to Agent：問いがタスクになるとき', 'Guardrails：リスク、権限、承認、停止', 'Full Trace：1つのプロンプト、すべてのステーション'],
            },
        },
    },

    // ── 行動への呼びかけ (リンク先 href は表示層に残る) ──
    cta: {
        eyebrow: '次のステップ',
        title: '次のステップ: 透明なチャット',
        body: 'シンプルなリクエストを書いて、エンジンが解釈し、ランク付けし、判断し始める様子を見てみましょう。',
        button: '透明なチャットを始める',
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

    // ── メンターのセリフ (装飾的なマイクロコピー; ポーズは表示層にある) ──
    mentor: {
        hero: 'いっしょにフタを開けてみましょう',
        roadmap: 'エンジンのマップが開いていきます',
        cta: 'ここから始めます',
    },

    // ── サブ名前空間: 主要ステーションのマップ ──
    roadmap: introRoadmap,
};
