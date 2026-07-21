// i18n/locales/ja/behind-ai/mistakeLearningLab.ts
//
// 第14章「Learning from Mistakes Lab」（Learning from Mistakes：モデルは間違いから
// どう改善するか）の日本語（ja, LTR）データ。ヘブライ語が真実の源で、型
// （MistakeLearningLabContent）を定義する。
//
// 中心となる考え：まったく同じ顧客の問い合わせ、同じ出典カード、同じ最初の間違った
// 答え、同じ修正を、すべてのモードで固定する。学習者は、間違いからの改善が起きうる
// 四つのレベルを切り替える。
//   context    = 今の会話の中での修正（今は役立つが、モデルは変わらない）。
//   system     = モデルを囲むシステムの変更（指示、出典、ルール、チェック）。
//   training   = 将来のバージョンの訓練やfine-tuningへの貢献（別の遅いプロセス）。
//   evaluation = 改善が本当に起きたと、公表の前に測ること。
//
// これはネイティブによる後日レビューを前提とした初回訳です。
// emダッシュ（U+2014）もenダッシュ（U+2013）も使わず、年号にも触れない。

import type { MistakeLearningLabContent } from '../../he/behind-ai/mistakeLearningLab';

export const mistakeLearningLab: MistakeLearningLabContent = {
    sectionEyebrow: 'Learning from Mistakes Lab',
    sectionTitle: '同じ間違い、四つの改善のレベル',
    sectionIntro:
        '顧客が荷物はどこかと尋ねる。モデルは間違った答えを返し、あなたはそれを直した。四つのレベルを切り替えて、改善が本当にどこで起きるかを見てみよう。今の会話の中か、モデルを囲むシステムか、将来のバージョンの訓練か、それとも改善が本物だと確かめる検証か。',
    heading: '間違いからの改善、その裏側',
    kicker: 'Learning from Mistakes Lab',
    scenarioLabel: '顧客の問い合わせ',
    scenario: '私の荷物は昨日届くはずでした。どこにありますか？',
    sourceLabel: '追跡データ（サンプル）',
    sourceCaption: '説明のためのサンプルカードにすぎません。実際のデータではありません。',
    sourceNote: '注意：出典は「遅延」と言っていますが、配達日は示していません。よい答えは日付をでっち上げません。',
    sourceRows: [
        { label: 'バーコード', value: 'RR123456789IL' },
        { label: 'ステータス', value: '遅延' },
        { label: '配達予定', value: '不明', missing: true },
    ],
    initialLabel: 'モデルの最初の答え',
    initialAnswer: '荷物は明日届きます。',
    correctionLabel: 'あなたの修正',
    correction: 'それは正しくありません。追跡には、確認された配達日はないと書かれています。',
    modeLabel: '改善はどこで起きうる？',
    flowLabel: '実際に何が起きるか',
    improvedLabel: '何がよくなったか',
    notImprovedLabel: '何が必ずしもよくなっていないか',
    takeawayLabel: '要点',
    disclaimer:
        'ここでの例はすべて教育用にすぎません。特定の製品の方針、データの保存、特定システムの訓練について主張するものではありません。目的は、間違いからの改善がどこで起きうるかを、一般的に示すことです。',
    sr: {
        modeGroup: '改善レベルの選択',
        steps: '選択した改善レベルのプロセスの各段階',
    },
    modes: [
        {
            id: 'context',
            level: 'context',
            control: '今の会話の中で',
            badgeLabel: '文脈での修正',
            title: 'モデルが会話の中で答えを直す',
            summary: '修正は会話の文脈に入り、モデルは今、新しい答えを組み立てる。',
            steps: [
                { id: 'context-1', label: '最初の答え', text: 'モデルはこう答える。「荷物は明日届きます」。これは出典のない主張だ。', tone: 'wrong' },
                { id: 'context-2', label: 'あなたの修正', text: 'あなたはこう書く。「それは正しくない。出典に確認された配達日はない」。', tone: 'context' },
                { id: 'context-3', label: '文脈が更新される', text: '修正は、この会話の文脈の一部になる。', tone: 'context' },
                { id: 'context-4', label: '直した答え', text: 'モデルは答え直す。「その通りです。追跡によると、荷物は遅延しており、確認された配達日はありません」。', tone: 'good' },
            ],
            beforeAfter: {
                beforeLabel: '修正の前',
                before: '荷物は明日届きます。',
                afterLabel: '修正の後',
                after: '追跡によると、荷物は遅延しています。確認された配達日はありません。',
            },
            improved: '今の会話。モデルは修正を使って、ここで今、よりよい答えを組み立てた。',
            notImproved: '土台となるモデル。修正はこの会話の文脈の中だけにあり、モデルに自動で入るわけではない。',
            takeaway: '会話での修正はすぐ役立つ。文脈の中にあるからだ。それはモデルの恒久的な変更とは別物だ。',
        },
        {
            id: 'system',
            level: 'system',
            control: 'モデルを囲むシステムで',
            badgeLabel: 'システムの改善',
            title: '同じ間違いが繰り返され、チームがシステムを変える',
            summary: '多くの答えが配達日をでっち上げるとき、モデルを包むシステムを直せる。',
            steps: [
                { id: 'system-1', label: '繰り返すパターン', text: '出典に日付がないのに、システムが配達日を何度もでっち上げる。', tone: 'wrong' },
                { id: 'system-2', label: '指示の改善', text: '指示にルールを加える。出典にない配達日をでっち上げないこと。', tone: 'system' },
                { id: 'system-3', label: '出典の改善', text: '出典カードを改善し、「配達日は不明」とはっきり示すようにする。', tone: 'system' },
                { id: 'system-4', label: 'チェックの追加', text: 'セルフチェックの一歩と、この場合のための定型テストを加える。', tone: 'eval' },
            ],
            improved: '製品。モデルの周りの指示、出典、ルール、チェックがよくなった。',
            notImproved: '土台となるモデルの重み。ここでは変わっていない。変わったのは周りのシステムだ。',
            takeaway: '土台のモデルに触れずに、指示、出典、ルール、チェックを通じて製品を改善できる。',
        },
        {
            id: 'training',
            level: 'training',
            control: 'モデルの訓練で',
            badgeLabel: '訓練での改善',
            title: '繰り返す間違いから、将来のバージョンへ',
            summary: '繰り返す間違いは、別の遅いプロセスを経て、将来の訓練の例になりうる。',
            steps: [
                { id: 'training-1', label: '例を集める', text: '答えが配達日をでっち上げた事例を集める。', tone: 'wrong' },
                { id: 'training-2', label: '確認と修正', text: '人が例を確認し、あいまいなフィードバックや誤ったフィードバックをふるい落とし、残りを正しい答えに直す。', tone: 'training' },
                { id: 'training-3', label: '訓練データ', text: '直した例が、訓練やfine-tuningのデータに入る。', tone: 'training' },
                { id: 'training-4', label: '評価', text: '新しいバージョンが本当によくなり、ほかを壊していないかを確かめる。', tone: 'eval' },
                { id: 'training-5', label: '新しいバージョン', text: '評価を通れば、更新されたモデルのバージョンが出る。', tone: 'good' },
            ],
            improved: 'モデルの将来のバージョン。このプロセスが実際に行われ、評価を通ればの話だ。',
            notImproved: 'この会話と今のモデル。Chatでの一度の修正から、自動で起きることではない。',
            takeaway: '間違いは将来の訓練に役立ちうるが、それは人、データ、評価を伴う別のプロセスだ。すぐでも自動でもない。',
        },
        {
            id: 'evaluation',
            level: 'evaluation',
            control: '改善の検証で',
            badgeLabel: '評価',
            title: 'システムは本当によくなった？',
            summary: '「直した」と言う前に、同じ事例で二つのバージョンを検証する。',
            steps: [
                { id: 'eval-1', label: 'テスト事例', text: 'まったく同じ問い合わせを取り、二つのバージョンで走らせる。', tone: 'eval' },
                { id: 'eval-2', label: '前のバージョン', text: '「明日届く」と答えた。失敗。出典にない配達日をでっち上げたからだ。', tone: 'wrong' },
                { id: 'eval-3', label: '新しいバージョン', text: '「確認された配達日はない」と答えた。合格。出典に基づいたからだ。', tone: 'good' },
                { id: 'eval-4', label: '多くの事例', text: '一つだけでなく、似た事例を何十も検証し、いくつ合格したかを測る。', tone: 'eval' },
            ],
            beforeAfter: {
                beforeLabel: '前のバージョン',
                before: '出典に日付がないのに、配達日をでっち上げる。',
                afterLabel: '新しいバージョン',
                after: '確認された配達日はないと言う。',
            },
            improved: '変更が本当に役立つという確かさ。今は感覚だけでなく、測定がある。',
            notImproved: '何も保証されない。評価はよくなったかを示すが、一つ一つの事例を正しくするわけではない。',
            takeaway: '改善は当たり前と決めつけず、測るべきだ。評価がなければ、「直した」はただの願いにすぎない。',
        },
    ],
};
