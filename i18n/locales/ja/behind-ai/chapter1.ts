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
        hint: 'ここで高度なツールが開きます: ライブな読み取りヘッドと、どの語が決めたかを示すテストです。自分のペースで探れます。',
        intro1: '深層レイヤーをご覧ください: ここから少し技術的になります。番号付きのラボが二つあり、それぞれが同じ道筋の別の角度を見せます。一度ですべて終える必要はありません。',
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
        understandBody: 'AI エンジンは答えを「知っている」わけではありません - 選択肢を順位づけし、その差で判断します。差が大きければ確信して答え、差が小さければ正しい一歩は、推測ではなく止まって尋ねることです。あなた自身がそれを見ました: 読み取りヘッドは読みながら先頭が入れ替わるのを示し、入れ替えた一語が判断全体をひっくり返しました。',
        ruleTitle: '実践的なルール',
        ruleBody: '差が大きくリスクが低いときはエンジンを信じましょう。差が小さい、または行動が機微なとき - 止まって確認を求めることは失敗ではなく、責任ある一歩です。まさにここから、確率と責任のつながりが始まります。',
    },

    // "Before the quiz" card: anchoring the three core ideas in the main flow
    beforeQuiz: {
        title: 'クイズの前に: 覚えておきたい三つの点',
        point1Lead: '魔法ではなく道筋。',
        point1Body: ' どの答えの裏にも道筋が走ります: エンジンは文をトークンに分け、選択肢を確率で順位づけし、どれだけ確信があるかを確かめ、それから判断します。見積もりは読みながら作られ、追加の一語ごとに先頭の選択肢が変わりえます。',
        point2Lead: '二つの異なる問い。',
        point2BeforeChat: ' ',
        point2AfterChat: ' ではエンジンは「答えは何か?」と問います。',
        point2AfterAgent: ' では「正しい次の一歩は何か?」と問います - 回答する、ツールを使う、または止まって情報を求める。',
        point3Lead: '確信が責任と出会う。',
        point3Body: ' 確信は、先頭の選択肢と次のものとの差で測られます。差が大きくリスクが低ければ、エンジンに答えさせてよいでしょう。差が小さい、または行動が機微なら、責任ある一歩は推測ではなく止まって尋ねることです。',
        footnoteLead: 'この道筋をライブで見たいですか?上の ',
        footnoteHighlight: 'エンジン全体',
        footnoteTail: ' を開いて、読み取りヘッドと「どの語が決めたか」のラボで遊んでみてください。',
    },

    lock: {
        eyebrow: '理解の固定',
        question: 'エンジンは先頭の候補と次の候補の差が小さいと示しています。正しい一手は?',
        answerLabel: '自信を持って答える',
        askLabel: '止まって尋ねる',
        correctBody: '固定できました。差が小さいことは不確かさを意味し、責任ある一手は推測せず、止まって尋ねることです。',
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
