// i18n/locales/ja/behind-ai/doesAiLearnLab.ts
//
// Nihongo (ja, LTR) no "Does AI Learn Lab" (dai 16 sho: Does AI Learn From Me) no data.
// Hepburu-go ga shinjitsu no gensen de, kata (DoesAiLearnLabContent) o teigi suru.
//
// Chushin no aidea: model wa "kozutsumi wa ashita todokimasu" to itte, user ga "iie. tsuiseki
// ni yoreba kakutei shita touchaku bi wa arimasen" to teisei shita. Lab wa teisei no furumai ga
// kotonaru yottsu no soo o shimesu: onaji chat (genzai no bunmyaku), atarashii chat (bunmyaku
// wa kara kara hajimaru), memory kino (product no rei), soshite kunren mata wa koushin (betsu
// no process).
//
// Kore wa native speaker ni yoru kakunin ga hitsuyou na first-pass yaku desu.
//
// Em dash (U+2014) mo en dash (U+2013) mo tsukawanai.

import type { DoesAiLearnLabContent } from '../../he/behind-ai/doesAiLearnLab';

export const doesAiLearnLab: DoesAiLearnLabContent = {
    sectionEyebrow: 'Does AI Learn Lab',
    sectionTitle: '同じ訂正、四つの層',
    sectionIntro:
        'モデルは「荷物は明日届きます」と言い、あなたは訂正した。四つの層を切り替えて、訂正がいつ役立ち、いつ消えるのか、そして文脈・記憶・訓練の違いを見てみよう。',
    heading: '学習の裏側',
    kicker: 'Does AI Learn Lab',
    scenario: {
        label: 'シナリオ',
        aiSaidLabel: 'モデルが言った',
        aiSaid: '荷物は明日届きます。',
        userCorrectionLabel: 'あなたが訂正する',
        userCorrection: 'いいえ。追跡によれば、確定した到着予定はありません。',
        aiRevisedLabel: '同じチャットでモデルが訂正する',
        aiRevised: 'その通りです。追跡によれば、確定した到着予定はありません。',
    },
    layerSelectLabel: '層を選ぶ',
    seesLabel: 'モデルが今見ているもの',
    answerLabel: 'モデルの答え',
    changedLabel: '変わったこと',
    unchangedLabel: '変わらなかったこと',
    takeawayLabel: '要点',
    disclaimer:
        'ここでの例はすべて学習用です。製品によってデータの扱いは異なり、特定の製品の方針・プライバシー・訓練についての主張はここにはありません。目的は文脈・記憶・訓練の違いを示すことであって、特定の製品を説明することではありません。',
    sr: {
        layerGroup: '学習の層を選ぶ',
        layerDetail: '選択した層の詳細',
    },
    layers: [
        {
            id: 'sameChat',
            layerType: 'sameChat',
            control: '同じチャット',
            badgeLabel: '現在の文脈',
            title: '訂正すると、モデルは訂正に従う',
            summary: '同じチャットで似た質問をもう一度した。訂正はまだ文脈の中にあるので、モデルはそれに頼れる。',
            sees: [
                'モデルの最初のメッセージ：荷物は明日届きます。',
                'あなたの訂正：いいえ。追跡によれば、確定した到着予定はありません。',
                '同じチャットでの、あなたの続きの質問。',
            ],
            answer: '追跡によれば、確定した到着予定はありません。分かり次第お知らせします。',
            changed: '答えは今、訂正に従っている。訂正が会話の文脈の中にあるからだ。',
            unchanged: '基盤モデルは変わっていない。訂正はこのチャットの中だけで生きている。',
            takeaway: '現在の会話に書かれていることは、現在の答えに影響しうる。',
        },
        {
            id: 'newChat',
            layerType: 'newChat',
            control: '新しいチャット',
            badgeLabel: '新しいチャット',
            title: '新しいチャットは訂正なしで始まる',
            summary: '新しいチャットを開き、訂正も情報源も再び渡さずに、もう一度たずねた。',
            sees: [
                '新しいチャットで、文脈は空から始まる。',
                '今のあなたの質問。',
                '前のチャットの訂正はここにはない。',
            ],
            answer: '通常の見込みでは、荷物は明日届くはずです。',
            changed: '訂正が文脈にないと、モデルは元の答えに戻りうる。訂正を覚えていると決めつけないこと。',
            unchanged: 'モデルはわざと忘れたのではない。新しいチャットには、以前あなたが書いたものが単に含まれていないだけだ。',
            takeaway: '新しいチャットは以前の訂正を自動的には含まない。製品が記憶を保持するか、あなたが文脈を再び渡さない限り。',
        },
        {
            id: 'memory',
            layerType: 'memory',
            control: '記憶機能',
            badgeLabel: '記憶機能',
            title: '保存された設定は文脈に戻りうる',
            summary: '一部の製品では設定を保存できる。これは製品機能の一例であって、常に成り立つ規則ではない。',
            sees: [
                '保存された設定（製品機能の一例）：情報源なしに到着予定を作らない。',
                '今のあなたの質問。',
                '設定は質問とともに文脈に読み込まれる。',
            ],
            answer: '保存された設定により、予定を作りません。追跡によれば、確定した到着予定はありません。',
            changed: '製品が記憶を提供すると、設定は文脈に戻るので、新しいチャットでも答えがそれに従える。',
            unchanged: 'ここでも基盤モデルは変わっていない。記憶は情報を文脈に戻す層であって、訓練ではない。',
            takeaway: '記憶は情報を保存して戻す製品機能だ。モデル自体を訓練することとは異なる。',
        },
        {
            id: 'training',
            layerType: 'training',
            control: '訓練または更新',
            badgeLabel: '訓練または更新',
            title: '持続的な改善には別のプロセスが必要',
            summary: 'モデルの振る舞いを時間をかけて変えるには、チャットの一つのメッセージではなく、別のプロセスが必要だ。',
            sees: [
                '時間をかけた多くの例とフィードバック。',
                'システムを作るチームによるレビュー。',
                '訓練またはシステム更新。',
                '改善が本物かを確かめる評価。',
                '将来の振る舞いが改善するかもしれない。',
            ],
            answer: 'もし更新が来れば、そのときに将来の振る舞いは改善しうる。一つの訂正からすぐに起きるわけではない。',
            changed: 'そのようなプロセスの後、システムの将来のバージョンは違う振る舞いをするかもしれない。',
            unchanged: 'プロセスは遅く、あなたの会話とは別で、製品と方針に依存する。一つの訂正がそれを自動で起動することはない。',
            takeaway: 'モデルの持続的な改善は、それ自体が訓練または更新のプロセスであって、会話からのライブ学習ではない。',
        },
    ],
};
