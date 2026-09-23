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
        summary: { title: '覚える二つの層', points: ['モデル経路: テキストはトークンと数値表現になります。', '表現は次トークンのスコアになり、Softmaxが確率へ変換します。', 'Decodingがトークンを選び、それが追加されて生成が繰り返されます。', '製品の枠組み: 製品はモデルの周りで入力を組み立て、出力を処理することがあります。'] },
    },

    // Hero
    hero: {
        badge: 'Behind the Scenes · 01',
        titleLead: '質問と答えのあいだで',
        titleHighlight: '本当に起きていること',
        ledeLead: '一文を書いてください。チャットパネルは普通のアプリのように見えます。その隣で、',
        ledeHighlight: 'エンジンパネルが回答の背後の経路を開きます',
        ledeRest: '。テキストから次トークンまでの学習用イラストです。今は観察するだけでよく、各機構は後で順に開きます。',
        chips: [
            'チャットパネル: 見える依頼と回答',
            'エンジンパネル: 内部経路のイラスト',
            'あとで: 各ステップを深く開く',
        ],
    },

    // Standalone mentor guidance before the Transparent Chat
    mentorGuide: {
        title: '見えている答えは一つ。その背後には一連の道のりがあります。',
        body: '透明チャットでは、同じリクエストが答えになるまでに、段階ごとにどう変わるかを見ていきます。今は、すべての数値や用語を覚える必要はありません。各ステーションで「何が入り、何が変わり、何が出たか」を確かめてください。',
    },

    // M10: 第1章には推測も判定の瞬間もないため、F3 RESPOND もメンターの人物画像も持たない。
    // 残るのはテスト結果の応答レイヤーのみで、両方の結果でテキストとして表示される。
    mentorRespond: {
        quizPass:
            '見えている答えは道のりの終点であり、その途中で何が起きたのかを問う視点がもう身についています。この問いは、これ以降の各章でも、ステーションの名前を変えながら繰り返し戻ってきます。',
        quizFail:
            'この章は用語を覚えることを求めていません。質問と答えのあいだに道のりがあると気づくことが目的です。透明チャットに戻り、一文だけ送って、ひとつのステーションだけを追ってください。何が入り、何が出たかを見てみましょう。',
    },

    // Transparent Chat Lab
    lab: {
        title: '透明なチャット',
        eyebrow: 'Transparent Chat Lab',
        intro: 'チャットパネルは依頼と回答を示します。エンジンパネルはその間の経路を学習用に示します。',
        panelTitle: 'Transparent Chat Lab',
        // Recognition bridge to the intro map: same stations, now live.
        mapBridge: 'マップの同じ14ステーションが、送信したリクエストに対して動きます。',
        chatSubtitle: 'Chat Mode · 会話',
        agentSubtitle: 'Agent Mode · タスク',
        observationInstruction: 'すべての数字を覚えようとしないでください。各駅で、何が入り、何が変わり、何が出たかを問いましょう。',
        simulationDisclosure: 'これは言語モデルに共通する考え方を示す決定論的な学習用イラストであり、モデルの隠れた計算を直接記録したものではありません。',
        inputAriaLabel: '分析するメッセージ',
        sendAriaLabel: '依頼を送信',
        activeRequestLabel: '選択したリクエスト',
        visibleResponseLabel: '表示される回答',
    },

    // Engine panel titles (GlassEnginePanel)
    panels: {
        answerEngineTitle: 'Answer Engine',
        actionEngineTitle: 'タスクシステムのプレビュー',
        chatEngineSubtitle: '返信の選択 · 主要なステーション',
        agentEngineSubtitle: 'モデルを囲むシステム · 条件付きプレビュー',
    },

    // Chapter insight
    insightIdea: {
        title: 'この章の考え',
        body: 'チャットに見える答えは、製品が入力を組み立て、モデルがトークンと表現から一段ずつ回答を作る道のりの終点にすぎません。',
    },
    // Chat seed inputs (default input + quick suggestions)
    // Note: these are demo inputs fed to the learning engine, coupled to the Japanese
    // detection vocabulary in chapter-1/mockEngine.ts.
    seed: {
        defaultInput: "曲が再生されません",
        suggestions: [
            "曲が再生されません",
            "今の曲は何ですか",
            "プレイリスト 123456 を見せて",
            "プレイリスト 123456 を削除して",
            "これを対応して",
        ],
    },

    quiz: chapter1Quiz,

    // Visuals sub-namespace
    visuals: chapter1Visuals,
};
