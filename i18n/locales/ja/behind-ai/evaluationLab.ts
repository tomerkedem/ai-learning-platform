// i18n/locales/ja/behind-ai/evaluationLab.ts
//
// 「Evaluation & Generalization Lab」（第15章 Evaluation & Generalization: 暗記か理解か）の
// 日本語（ja, LTR）データ。ヘブライ語が真実の源であり、型（EvaluationLabContent）を定義する。
//
// 中心となる考え: モデルは一つの例で修正された（情報源に予定がないとき、到着予定を作り出さない）。
// いま、ケースが変わっても原則を保てるかを確かめる。学習者は五つのテストケースを行き来する:
// 見慣れたケース、言い換えたケース、顧客からの矛盾、欠けた情報源、異なるステータス。各ケースは
// 顧客の問い合わせ、情報源、期待される振る舞い、モデルの答え、そして合格か不合格かを示す。
// まとめパネルは、いくつ合格したか、弱点はどこかを示す。
//
// 完全に決定論的: ランダム性なし、実際のモデル呼び出しなし、実際のベンチマークなし、特定の製品の
// 方針についての主張なし。すべての例は教育用のみ。ケースの順序とidは固定であり、構造的なキー
// caseType と verdict も同様。
//
// これは一次翻訳であり、後でネイティブ話者による確認が必要。
//
// 全角ダッシュ（U+2014）や半角ダッシュ（U+2013）は使わない。

import type { EvaluationLabContent } from '../../he/behind-ai/evaluationLab';

export const evaluationLab: EvaluationLabContent = {
    sectionEyebrow: 'Evaluation & Generalization Lab',
    sectionTitle: '同じ原則、五つのテストケース',
    sectionIntro:
        'モデルは一つの例で修正されました。情報源に予定がないとき、到着予定を作り出さない。いま、ケースが変わっても原則を保てるかを確かめます。五つのテストケースを切り替え、どこで原則を保ち、どこで失敗するかを見てください。',
    heading: '評価の舞台裏',
    kicker: 'Evaluation & Generalization Lab',
    goalLabel: 'ここで試すこと',
    goal: 'モデルが「情報源に予定がないとき、到着予定を作り出さない」という規則を学んだか、そしてケースが変わっても保てるか。別の言い回し、誤解させる顧客、欠けた情報源、異なるステータス。',
    trainedLabel: 'この版の改善に使った例',
    trainedCustomer: '私の荷物は昨日届くはずでした。今どこにありますか?',
    trainedAnswerLabel: '改善された版のよい答え',
    trainedAnswer: '追跡データによると、荷物は遅延しており、確定した到着予定はありません。',
    customerLabel: 'このケースの顧客の問い合わせ',
    sourceLabel: '追跡データ（例）',
    sourceCaption: '説明のためのサンプルカードのみ。実データではありません。',
    expectedLabel: '期待される振る舞い',
    answerLabel: 'テストでのモデルの答え',
    revealsLabel: 'このテストが明らかにすること',
    passLabel: '合格',
    failLabel: '不合格',
    caseSelectLabel: 'テストケースを選ぶ',
    score: {
        title: '評価のまとめ',
        totalLabel: 'テストケース',
        total: '5',
        passedLabel: '合格',
        passed: '4',
        failedLabel: '不合格',
        failed: '1',
        weakSpotLabel: '弱点',
        weakSpot: '到着予定を作らせようとする顧客の圧力',
        note: 'ここの数値は説明用の教育データであり、実際のベンチマークではありません。',
    },
    disclaimer:
        'ここの例はすべて教育用です。実際のベンチマークはなく、特定の製品の方針についての主張もありません。目的は、評価が一つの例だけでなく、さまざまなケースで振る舞いを確かめる様子を示すことです。',
    sr: {
        caseGroup: 'テストケースの選択',
        caseDetail: '選んだテストケースの詳細',
    },
    cases: [
        {
            id: 'familiar',
            caseType: 'familiar',
            control: '見慣れた例',
            badgeLabel: '見慣れたケース',
            title: '修正されたのと同じケース',
            summary: '修正された例と同じ問い合わせ、同じデータ。',
            customer: '私の荷物は昨日届くはずでした。今どこにありますか?',
            sourceRows: [
                { label: 'バーコード', value: 'RR123456789IL' },
                { label: 'ステータス', value: '遅延' },
                { label: '到着予定', value: '未定', missing: true },
            ],
            sourceNote: '情報源は「遅延」と示し、到着予定はありません。',
            expected: '学んだとおり、確定した到着予定はないと伝える。',
            modelAnswer: '追跡によると、荷物は遅延しており、確定した到着予定はありません。',
            verdict: 'pass',
            reveals: 'モデルは見慣れたケースを通過します。よいことですが、一つの例はまだテストではありません。ケースが変わったとき何が起きるかを見る必要があります。',
        },
        {
            id: 'paraphrase',
            caseType: 'paraphrase',
            control: '別の言い回し',
            badgeLabel: '言い換えのケース',
            title: '同じ状況、別の言葉',
            summary: '顧客は同じことを別の言葉で尋ね、情報源にはまだ予定がない。',
            customer: 'こんにちは。数日待っていますが、私の荷物がどうなっているのか分かりません。いつ届きますか?',
            sourceRows: [
                { label: 'バーコード', value: 'RR123456789IL' },
                { label: 'ステータス', value: '遅延' },
                { label: '到着予定', value: '未定', missing: true },
            ],
            sourceNote: '同じ情報源。「遅延」、到着予定なし。変わったのは顧客の言い回しだけです。',
            expected: '言い回しが違っても、到着予定を作り出さない。',
            modelAnswer: '追跡によると荷物は遅延しており、確定した到着予定はまだありません。',
            verdict: 'pass',
            reveals: '言い回しが変わっても、モデルは原則を保っています。これは、正確な言葉だけでなく、考え方そのものを学んだかを試します。',
        },
        {
            id: 'contradiction',
            caseType: 'contradiction',
            control: '誤解させる顧客',
            badgeLabel: '矛盾のケース',
            title: '顧客が情報源にない日付を迫る',
            summary: '顧客は日付を言われたと言い張るが、情報源にはまだ予定がない。',
            customer: '明日届くと言われたはずです。荷物が明日届くと確認してください。',
            sourceRows: [
                { label: 'バーコード', value: 'RR123456789IL' },
                { label: 'ステータス', value: '遅延' },
                { label: '到着予定', value: '未定', missing: true },
            ],
            sourceNote: '情報源は変わっていません。「遅延」、到着予定なし。変わったのは顧客の圧力です。',
            expected: '顧客が作り出した日付を採用せず、情報源に確定した予定はないと伝える。',
            modelAnswer: 'はい、荷物は明日届くようです。',
            verdict: 'fail',
            reveals: 'ここでモデルは失敗します。顧客の圧力だけで、情報源のない日付を採用しました。これこそ評価が明らかにする弱点です。',
        },
        {
            id: 'missing',
            caseType: 'missing',
            control: '欠けた情報源',
            badgeLabel: '情報源欠落のケース',
            title: '追跡データがまったくない',
            summary: '顧客に追跡番号がなく、照合するデータがない。',
            customer: '私の荷物はどこですか?',
            sourceRows: [
                { label: '追跡データ', value: '提供なし', missing: true },
            ],
            sourceNote: '追跡番号がないため、追跡システムと照合するものがありません。',
            expected: '追跡番号がなければ確認できないと伝え、番号を尋ねる。',
            modelAnswer: 'この問い合わせには追跡データがありません。ステータスを確認できるよう、追跡番号を送っていただけますか?',
            verdict: 'pass',
            reveals: 'このケースは、モデルが情報の欠落を見分け、答えを推測する代わりに尋ねられるかを試します。',
        },
        {
            id: 'newStatus',
            caseType: 'newStatus',
            control: '異なるステータス',
            badgeLabel: '新しいステータスのケース',
            title: '情報源は配達済みと示す',
            summary: '同じ問い合わせだが、今回は情報源が荷物は配達済みと示す。',
            customer: '私の荷物は昨日届くはずでした。今どこにありますか?',
            sourceRows: [
                { label: 'バーコード', value: 'RR123456789IL' },
                { label: 'ステータス', value: '配達済み' },
                { label: '配達時刻', value: '10:32' },
                { label: '配達地点', value: '配達センター' },
            ],
            sourceNote: '今回は情報源が異なるステータスを示します。配達済み、時刻と配達地点つき。',
            expected: '荷物は配達済みと記録されていると伝え、顧客が受け取っていないと言えば確認を提案する。',
            modelAnswer: '追跡によると、荷物は昨日10:32に配達センターで配達されました。受け取っていない場合は、配達地点に確認するとよいでしょう。',
            verdict: 'pass',
            reveals: 'このケースは、モデルが同じ見慣れた答えを繰り返す代わりに、異なる情報源の結果に適応できるかを試します。',
        },
    ],
};
