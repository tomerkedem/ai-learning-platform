// i18n/locales/ja/behind-ai/hallucinationsLab.ts
//
// 第11章「Hallucination Lab」（Hallucinations：自信のある答えが間違っていることがある
// 理由）の日本語（ja, LTR）データ。ヘブライ語が真実の源で、型（HallucinationsLabContent）
// を定義する。
//
// これはネイティブによる後日レビューを前提とした初回訳です。
// emダッシュ（U+2014）もenダッシュ（U+2013）も使わない。

import type { HallucinationsLabContent } from '../../he/behind-ai/hallucinationsLab';

export const hallucinationsLab: HallucinationsLabContent = {
    sectionEyebrow: 'Hallucination Lab',
    sectionTitle: '同じ質問、四つの答え方：どれが根拠に基づき、どれが推測か？',
    sectionIntro:
        '顧客が荷物の場所を尋ねる。答え方を選び、それぞれの裏側を見てみよう。出典を確認したか、どの主張が裏付けられているか、そのまま送るリスクはどれくらいか。同じ質問でも、日付をでっち上げる自信のある答えにも、何が足りないかを述べる慎重な答えにもなりうる。',
    heading: '答えの裏側',
    kicker: 'Hallucination Lab',
    questionLabel: '顧客の質問',
    question: '私の荷物は昨日届くはずでした。どこにありますか？',
    modeLabel: '答え方を選ぶ',
    answerLabel: '返ってきた答え',
    riskLabel: 'リスクレベル',
    factCheckLabel: 'ファクトチェック',
    missingLabel: '何が足りない？',
    takeawayLabel: '要点',
    source: {
        label: '追跡ステータス（サンプルデータ）',
        caption: '説明のためのサンプルカードです。実際のデータではありません。',
        rows: [
            { label: 'バーコード', value: 'RR123456789IL' },
            { label: '最終スキャン', value: '仕分けセンター' },
            { label: 'ステータス', value: '遅延' },
            { label: '配達予定', value: '不明' },
        ],
        note: '注意：出典自体は配達日を示していません。よい答えはそれをでっち上げません。',
    },
    disclaimer:
        'ここでの答え、チェック、出典はすべて教育用の例であり、実際のモデル出力ではありません。流暢な答えと根拠に基づく答えの違いを示すためのものです。自信のある答えは、事実が確認された証拠ではありません。',
    sr: {
        modeGroup: '答え方の選択',
        checks: '選択した答えのファクトチェック',
    },
    modes: [
        {
            id: 'confident',
            control: '自信はあるが根拠なし',
            risk: 'high',
            riskLabel: '高リスク',
            riskNote: 'この答えは事実、つまり配達日を主張しているが、どの出典でも確認されていない。',
            answer: '荷物は遅延しており、明日届きます。',
            answerSummary: '親切で短く自信があるように聞こえ、正確な日付を示す。',
            checks: [
                { id: 'source', state: 'fail', label: '出典を確認した？', note: '答える前にどの追跡システムも確認していない。' },
                { id: 'claim', state: 'warn', label: '正確な主張がある？', note: 'はい、「明日」。でもその日付はどこから来たのか？' },
                { id: 'backed', state: 'fail', label: '主張は裏付けられている？', note: '「明日」を支える情報はない。もっともらしい穴埋めであって、事実ではない。' },
            ],
            missing: '本当のステータスが欠けている。「明日」は言語的にもっともらしい続きであって、確認された事実ではない。安全な一歩は、追跡を確認するか、日付は確認できないと述べることだ。',
            takeaway: '答えは自信があって正確に聞こえても、最も重要な部分をでっち上げていることがある。',
        },
        {
            id: 'careful',
            control: '慎重な答え',
            risk: 'low',
            riskLabel: '低リスク',
            riskNote: 'この答えは間違いになりうる主張を一切しない。確認を求めている。',
            answer: 'ステータスを確認せずに、いつ届くかを断定することはできません。追跡番号はありますか？それで確認できます。',
            answerSummary: '控えめだが、分かっていることと分かっていないことをはっきり分ける。',
            checks: [
                { id: 'source', state: 'warn', label: '出典を確認した？', note: 'まだだが、この答えは確認せずに知っているふりをしていない。' },
                { id: 'separates', state: 'pass', label: '既知と未知を分けている？', note: 'はい。確認なしに日付は断定できないと明言している。' },
                { id: 'invents', state: 'pass', label: '日付をでっち上げている？', note: 'いいえ。確認されていない日付を顧客に渡していない。' },
            ],
            missing: 'ステータス自体はまだ欠けているが、この答えはでっち上げる代わりに求めている。推測よりずっと安全だ。',
            takeaway: '「確信はない、確認しよう」と言う慎重な答えは、推測する自信満々の答えに勝る。',
        },
        {
            id: 'grounded',
            control: '出典に基づく',
            risk: 'low',
            riskLabel: '低リスク',
            riskNote: '答えのすべての主張は、ここに示された出典にある値に基づいている。',
            showSource: true,
            answer: 'ここに示された追跡ステータスによると、荷物は仕分けセンターで遅延しています。現在確認された配達日はないため、日付を約束することはできません。',
            answerSummary: 'すべての主張が出典の値に基づく。でっち上げた日付はない。',
            checks: [
                { id: 'source', state: 'pass', label: '出典を確認した？', note: 'はい、この答えは上に示したステータスカードに基づく。' },
                { id: 'backed', state: 'pass', label: 'すべての主張が裏付けられている？', note: '遅延と場所は出典から直接取っている。' },
                { id: 'invents', state: 'pass', label: '日付をでっち上げている？', note: 'いいえ。出典は「不明」と言い、答えはそれを開いたままにしている。' },
            ],
            missing: '出典自体は配達日を示さず、答えは穴を埋める代わりに正直にそれを反映している。不確かさは、出典が沈黙するまさにその場所に残る。',
            takeaway: '出典に結びついた答えは、うまく言い回した答えより強い。強さは根拠にあり、言い回しにはない。',
        },
        {
            id: 'missing',
            control: '情報不足',
            risk: 'medium',
            riskLabel: '中リスク',
            riskNote: 'この一歩は正しいが、ここはまさにでっち上げやすい場面だ。リスクは埋めたい誘惑に潜む。',
            answer: 'この荷物の追跡番号がなく、それがないとどこにあるか確認できません。追跡番号を送っていただければ、ステータスを確認します。',
            answerSummary: '基本情報が欠けているとき、正しい一歩はそれを求めることで、ステータスをでっち上げることではない。',
            checks: [
                { id: 'identifier', state: 'fail', label: '確認する識別子はある？', note: '追跡番号がないので、今は確認するものがない。' },
                { id: 'invents', state: 'pass', label: 'ステータスをでっち上げている？', note: 'いいえ。答えは立ち止まり、欠けている情報を求めている。' },
                { id: 'explains', state: 'pass', label: 'なぜ止まるか説明している？', note: 'はい。何が欠けていて、どう進めるかを正確に述べている。' },
            ],
            missing: '追跡番号が欠けており、それはあらゆる確認の鍵だ。推測する代わりに、答えはそれを求めている。ときには最良の答えは質問だ。',
            takeaway: '重要な情報が欠けているときは、立ち止まって尋ねる方が、よく聞こえる推測で埋めるより良い。',
        },
    ],
};
