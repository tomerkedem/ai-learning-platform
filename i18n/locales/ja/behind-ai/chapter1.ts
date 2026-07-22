// i18n/locales/ja/behind-ai/chapter1.ts
// Japanese Chapter 1 ("What really happens between the question and the answer").
// Shape source: ../../he/behind-ai/chapter1. contentLocale = 'ja' (real translation).
//
// No em dash (U+2014) and no en dash (U+2013). Mentor bubble text carries no emoji.
// "Claude" and "ANTHROPIC_API_KEY" are kept literal. seed inputs are coupled to the
// Japanese detection vocabulary in chapter-1/mockEngine.ts.

import type { Locale } from '@/i18n/config';
import { chapter1Visuals } from './chapter1Visuals';
import { chapter1Quiz } from './chapter1Quiz';

export const chapter1 = {
    contentLocale: 'ja' as Locale,
    redesign: {
        hero: { badge: '舞台裏 · 01', title: '透明なチャット: 答えの背後にある経路', lede: 'チャットに見えるのは依頼と回答です。その間には製品とモデルからなる見えない経路があり、問題は複数の場所で始まりえます。' },
        mentor: '見えるのは回答です。理解するには経路を調べます。製品とモデルは別の層で、まだ全機構を知る必要はありません。',
        interaction: { title: 'この実験で見ること', instruction: '依頼を変え、製品が組み立てる入力、モデル出力、製品の判断のどこが変わりうるかを見てください。', examplesLabel: '依頼の例', selectedLabel: '選んだ依頼', resultLabel: '見える結果', visibleLabel: 'チャットに見えるもの', evidenceLabel: '観察から言えること' },
        examples: [{ request: '荷物はどこですか？', response: '確認には注文番号が必要です。', evidence: '依頼は一部明確ですが、モデルが具体的に答える前から必要情報が不足しています。' }, { request: '注文123456を確認して', response: '現在、配送状況を取得できませんでした。', evidence: '同じ結果でも、外部情報の欠落、ツール障害、権限不足が原因かもしれません。結果だけでは原因を証明できません。' }, { request: 'これを対応して', response: '何に対応すればよいですか？', evidence: '曖昧さは入力の問題かもしれず、モデル生成の誤りとは限りません。' }],
        path: { title: '高いレベルの経路', explanation: '層を選んで役割を読んでください。色や矢印だけでなく、ラベルが順序を示します。', semanticLabel: '利用者の依頼、製品による入力の組み立て、モデル、製品による出力処理、見える回答', requestTitle: '1. 利用者の依頼', requestBody: '利用者が見て送るテキストです。', productInputTitle: '2. 製品が入力を組み立てる', productInputBody: '製品は指示や選択した文脈を加えることがあります。見えるメッセージがモデル入力の全部とは限りません。', modelTitle: '3. モデル', modelBody: 'モデルは現在の入力を処理して出力を生成します。製品の一部であり、製品全体ではありません。', productOutputTitle: '4. 製品が出力を処理する', productOutputBody: '製品は整形、確認、検索、ツール利用、方針適用を行うことがあります。これらは任意の機能です。', responseTitle: '5. 見える回答', responseBody: '学習者がチャットで見る経路の終点です。', envelope: 'モデルが受け取る前に製品が何かを組み立てることが分かります。第2章でこの封筒を開きます。' },
        summary: { title: '覚える三つのこと', points: ['見える回答は、見えないシステム経路の終点です。', '製品とモデルは別の層です。', '問題は複数の場所で始まりうるため、回答だけでなく経路を調べます。'] },
    },

    // Hero
    hero: {
        badge: 'Behind the Scenes · 01',
        titleLead: '質問と答えのあいだで',
        titleHighlight: '本当に起きていること',
        ledeLead: '一文を書いてみてください。右側のチャットは、どのアプリとも同じ普通の見た目です。左側には、',
        ledeHighlight: '答えの裏にある道筋',
        ledeRest: 'が開きます。エンジンが文をどう読み、判断にどう至るかを見せます。今はただ見るだけでよく、すべての数字を理解する必要はありません。深い部分はあとから少しずつ開いていきます。',
        chips: [
            '右側: あなたが見る答え',
            '左側: 答えの裏にある道筋',
            'あとで: 各ステップを深く開く',
        ],
    },

    // Mentor speech bubbles (text only; pose and placement are structural in the page)
    mentor: {
        peek: 'エンジンの中を最初にのぞく',
        holographic: 'ここでエンジンが内側から開きます',
    },

    // Coach card (first-run guidance toward the lab)
    coach: {
        start: 'ここから始めましょう: ',
        body: '下のラボで自分の文を書くか、手早い例を選んでください。',
        closeAria: 'ガイドを閉じる',
    },

    // Transparent Chat Lab
    lab: {
        title: '透明なチャット',
        eyebrow: 'Transparent Chat Lab',
        intro: 'ここでは答えの裏に道筋があることが見えます: 右にはいつもどおりの答え、左にはそこへ至った道筋です。',
        panelTitle: 'Transparent Chat Lab',
        // Recognition bridge to the intro map (package anchor): same stations, now live.
        mapBridge: 'これは地図で見た駅そのものです。いま、あなたの荷物の問い合わせで動いています。',
        chatSubtitle: 'Chat Mode · 会話',
        agentSubtitle: 'Agent Mode · タスク',
        focusLead: 'まずは ',
        focusHighlight: '判断',
        focusRest: ' を見てください。すべての数字ではありません。左のエンジンは、質問と答えのあいだに丸ごとの道筋があることを示します。詳しい中身はコースのあとで開いていきます。',
        liveNote: 'チャットの返信は、実際のモデル(Claude)がリアルタイムに一語ずつ書いています - まさに自己回帰のループです。右の盤は教育用のイラストのままです: API はモデル内部の確率を公開しません。',
        demoNote: 'デモモード: チャットの返信は台本どおりで固定です。サーバーで ANTHROPIC_API_KEY を設定すると、返信を一語ずつライブで書く実際のモデルが有効になります。',
    },

    // Engine panel titles (GlassEnginePanel)
    panels: {
        answerEngineTitle: 'Answer Engine',
        actionEngineTitle: 'Action Decision Engine',
        chatEngineSubtitle: '返信の選択 · 主要なステーション',
        agentEngineSubtitle: '行動の判断 · 主要なステーション',
    },

    // Chapter insight
    insightIdea: {
        title: 'この章の考え',
        body: 'チャットの答えは、隠れたプロセスの見える先端にすぎません。どの答えの裏にも道筋が走り、その道筋は一段ずつ開けます。このコースがするのはまさにそれです: 答えの裏にある道筋を、少しずつ教えていきます。まだすべての仕組みを理解する必要はありません - 道筋が存在し、それを開けると分かれば十分です。',
    },

    // Depth-layer gate (progressive disclosure) + layer intro
    deep: {
        toggleOpen: '深層レイヤーを閉じる',
        toggleClosed: 'エンジン全体を開く',
        hint: 'ここで高度なツールが開きます: エンジンが読みながら考えを変える様子を示す、ライブな読み取りヘッドです。自分のペースで探れます。',
        intro1: '深層レイヤーをご覧ください: ここから少し技術的になります。同じ道筋の別の角度を見せる、ライブなラボが一つあります。自分のペースで探ってください。',
        intro2Lead: '',
        intro2Mid: ' ではシステムが返信を選びます。',
        intro2Tail: ' では正しい次の一歩を確かめます - 回答する、ツールを使う、または止まって情報を求める。チャット上部のトグルで切り替えます。',
    },

    // The four lab headers (eyebrow + title)
    labs: {
        readHead: { eyebrow: 'ライブな読み取り', title: 'エンジンは読みながら考えを変える' },
        confidence: { eyebrow: 'いつ信じ、いつ止まるか', title: '確信度ダイヤル' },
        causality: { eyebrow: '因果', title: 'どの語が判断を決めたか' },
        fork: { eyebrow: '分岐', title: '同じ文、二つのエンジン' },
    },

    // Summary (two insights inside the depth layer)
    summary: {
        understandTitle: '今わかること',
        understandBody: 'このデモは候補を順位付けし、スコア差を表示します。大きな差が示すのは合成デモ内での分離だけで、事実、信頼性、実行許可ではありません。Decoding は分布と規則に従って選択またはサンプリングします。',
        ruleTitle: '実践的なルール',
        ruleBody: 'デモの差は候補間の分離を示す一つの信号としてだけ使います。事実を信頼するには証拠が必要で、機微な操作には差に関係なく権限と承認が必要です。',
    },

    // "Before the quiz" card: anchoring the three core ideas in the main flow
    beforeQuiz: {
        title: 'クイズの前に: 覚えておきたい三つの点',
        point1Lead: '魔法ではなく道筋。',
        point1Body: ' どの答えの裏にもトークン、表現、スコア、decoding の経路があります。段階的入力ビューは、より完全な入力を使った別々の実行を比較する教育表示で、人間のような逐語読解ではありません。',
        point2Lead: '二つの異なる問い。',
        point2BeforeChat: ' ',
        point2AfterChat: ' ではエンジンは「答えは何か?」と問います。',
        point2AfterAgent: ' では「正しい次の一歩は何か?」と問います - 回答する、ツールを使う、または止まって情報を求める。',
        point3Lead: '確信が責任と出会う。',
        point3Body: ' 表示される差は合成デモの指標で、真実の確率でも許可でもありません。機微な操作には製品が定めた権限と承認規則が引き続き必要です。',
        footnoteLead: 'この道筋をライブで見たいですか?上の ',
        footnoteHighlight: 'エンジン全体',
        footnoteTail: ' を開いて、読み取りヘッドと「どの語が決めたか」のラボで遊んでみてください。',
    },

    lock: {
        eyebrow: '理解度チェック',
        question: 'エンジンは先頭の候補と次の候補の差が小さいと示しています。正しい一手は?',
        answerLabel: '自信を持って答える',
        askLabel: '止まって尋ねる',
        correctBody: 'つかめましたね。差が小さいことは不確かさを意味し、責任ある一手は推測せず、止まって尋ねることです。',
        wrongBody: '惜しい。差が小さいことはむしろ不確かさの合図です。ここでの責任ある一手は、止まって尋ねることです。',
        retry: 'もう一度',
    },

    // Chat seed inputs (default input + quick suggestions)
    // Note: these are demo inputs fed to the learning engine, coupled to the Japanese
    // detection vocabulary in chapter-1/mockEngine.ts.
    seed: {
        defaultInput: "荷物が届きません",
        suggestions: [
            "荷物が届きません",
            "私の荷物はどこですか",
            "荷物 123456789 を確認して",
            "荷物が紛失したと顧客に伝えて",
            "これを対応して",
        ],
    },

    quiz: chapter1Quiz,

    // Visuals and labs sub-namespace
    visuals: chapter1Visuals,
};
