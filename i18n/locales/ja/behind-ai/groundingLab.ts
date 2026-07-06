// i18n/locales/ja/behind-ai/groundingLab.ts
//
// 第12章「Grounding Lab」（RAG & Grounding：AI はどう出典につながるか）の日本語
// （ja, LTR）データ。ヘブライ語が真実の源で、型（GroundingLabContent）を定義する。
//
// 中心となる考え：まったく同じ顧客の質問と、四つの出典状態。学習者はそれらを切り替え、
// 出典なし、出典あり、不完全な出典、矛盾する出典を試し、出典が答えの言えることをどう
// 変えるかを見る。何に基づき、何を言ってよく、何をでっち上げてはいけないか。
//
// これはネイティブによる後日レビューを前提とした初回訳です。
// emダッシュ（U+2014）もenダッシュ（U+2013）も使わない。

import type { GroundingLabContent } from '../../he/behind-ai/groundingLab';

export const groundingLab: GroundingLabContent = {
    sectionEyebrow: 'Grounding Lab',
    sectionTitle: '同じ質問、四つの出典状態：答えは何を言える？',
    sectionIntro:
        '顧客が荷物の場所を尋ねる。出典の状態、つまり出典なし、出典あり、不完全な出典、矛盾する出典を切り替えて、同じ質問が違う答えになる様子を見てみよう。よい出典は答えを分かっていることに結びつけ、分かっていないことには印をつける。',
    heading: '根拠ある答えの裏側',
    kicker: 'Grounding Lab',
    questionLabel: '顧客の質問',
    question: '私の荷物は昨日届くはずでした。どこにありますか？',
    modeLabel: '出典の状態を選ぶ',
    answerLabel: '返ってきた答え',
    groundingCheckLabel: '根拠チェック',
    maySayLabel: '答えが言ってよいこと',
    mustNotInventLabel: 'でっち上げてはいけないこと',
    takeawayLabel: '要点',
    noSourceLabel: '出典なし',
    noSourceNote: '出典は提供されていません。答えは言語の続きだけに頼り、照合できるデータがありません。',
    disclaimer:
        'ここでの答えと出典はすべて教育用の例であり、追跡システムからの実際の照会ではありません。出典が答えの言えることをどう変えるかを示すためのものです。根拠ある答えはより強いですが、その強さは背後にある出典次第です。',
    sr: {
        modeGroup: '出典の状態の選択',
        checks: '選択した答えの根拠チェック',
    },
    modes: [
        {
            id: 'none',
            control: '出典なし',
            badge: 'ungrounded',
            badgeLabel: '根拠なし',
            summary: '出典がないと、答えは親切に聞こえても、言語の続きだけに頼っている。',
            answer: 'あなたの荷物はおそらく明日届きます。',
            answerSummary: '流暢で安心させるが、「明日」を裏付けるデータはない。',
            checks: [
                { id: 'based', state: 'fail', label: '出典に基づく？', note: 'いいえ。追跡データは提供されておらず、頼るものが何もない。' },
                { id: 'invents', state: 'fail', label: '日付をでっち上げている？', note: 'はい。「明日」はもっともらしい推測であって、出典で確認された細部ではない。' },
                { id: 'limits', state: 'warn', label: '何が足りないかを示している？', note: 'いいえ。答えは、そもそもデータが何もないことを明らかにしていない。' },
            ],
            maySay: '出典がなければ、答えはせいぜいデータがないと述べ、追跡番号を求めることくらいだ。',
            mustNotInvent: '「明日」でも他のどれでも、配達日を示してはいけない。それを裏付けるデータがないからだ。',
            takeaway: '出典がないと、流暢な答えは最も重要な細部をでっち上げることがある。',
        },
        {
            id: 'grounded',
            control: '出典あり',
            badge: 'grounded',
            badgeLabel: '根拠あり',
            summary: '文脈にステータスカードがあれば、すべての主張が実際のデータに基づく。',
            source: {
                label: '追跡ステータス（サンプルデータ）',
                caption: '説明のためのサンプルカードです。実際のデータではありません。',
                rows: [
                    { label: 'バーコード', value: 'RR123456789IL' },
                    { label: '最終スキャン', value: '仕分けセンター' },
                    { label: 'ステータス', value: '遅延' },
                    { label: '配達予定', value: '不明', missing: true },
                ],
                note: '注意：出典は「遅延」と言っていますが、配達日は示していません。よい答えはそれをでっち上げません。',
            },
            answer: 'ここに示された追跡データによると、荷物は仕分けセンターで遅延しています。現在、確認された配達日はないため、日付を約束することはできません。',
            answerSummary: '劇的ではないが、その中のすべての主張が出典に基づく。',
            checks: [
                { id: 'based', state: 'pass', label: '出典に基づく？', note: 'はい。遅延と場所はステータスカードからそのまま取っている。' },
                { id: 'invents', state: 'pass', label: '日付をでっち上げている？', note: 'いいえ。出典は「不明」と言い、答えはそれを開いたままにしている。' },
                { id: 'limits', state: 'pass', label: '何が足りないかを示している？', note: 'はい。確認された配達日がないことをはっきり述べている。' },
            ],
            maySay: '答えは出典からステータスと場所を伝え、確認された配達日はないと述べることができる。',
            mustNotInvent: '配達日を加えてはいけない。出典がそれを「不明」と記しているからだ。',
            takeaway: '根拠ある答えは劇的ではないが、はるかに信頼できる。力は根拠にあり、言い回しにはない。',
        },
        {
            id: 'incomplete',
            control: '不完全な出典',
            badge: 'incomplete',
            badgeLabel: '不完全な出典',
            summary: '出典はあるが、ほぼ空っぽだ。根拠づけは、何が欠けているかをそのまま明らかにする。',
            source: {
                label: '追跡ステータス（サンプルデータ）',
                caption: '説明のためのサンプルカードです。実際のデータではありません。',
                rows: [
                    { label: 'バーコード', value: 'RR123456789IL' },
                    { label: '最終スキャン', value: '不明', missing: true },
                    { label: 'ステータス', value: '不明', missing: true },
                    { label: '配達予定', value: '不明', missing: true },
                ],
                note: '出典はほぼ空っぽです。バーコードはありますが、ステータスも、スキャンも、日付もありません。',
            },
            answer: '今は荷物がどこにあるかを知るのに十分なデータがありません。バーコードはありますが、現在のステータスはありません。答える前に、より新しい出典を確認する必要があります。',
            answerSummary: '根拠づけは欠けたデータをでっち上げず、それを明らかにする。',
            checks: [
                { id: 'based', state: 'warn', label: '出典に基づく？', note: '出典はあるが、重要な項目が空だ。' },
                { id: 'invents', state: 'pass', label: 'ステータスをでっち上げている？', note: 'いいえ。答えはデータが足りないとはっきり述べている。' },
                { id: 'limits', state: 'pass', label: '何が足りないかを示している？', note: 'はい。何が欠けていて、何を確認すべきかを述べている。' },
            ],
            maySay: '答えはデータが足りないと述べ、より新しい出典を求めることができる。',
            mustNotInvent: '完全に聞こえさせるためだけに、ステータスや日付をでっち上げてはいけない。',
            takeaway: '根拠づけは欠けている情報を明らかにできる。ときには正しい答えは、立ち止まってデータを求めることだ。',
        },
        {
            id: 'contradiction',
            control: '矛盾する出典',
            badge: 'contradiction',
            badgeLabel: '矛盾する出典',
            summary: '顧客は荷物が届かなかったと言うが、出典は配達済みと記している。',
            source: {
                label: '追跡ステータス（サンプルデータ）',
                caption: '説明のためのサンプルカードです。実際のデータではありません。',
                rows: [
                    { label: 'バーコード', value: 'RR123456789IL' },
                    { label: 'ステータス', value: '配達済み' },
                    { label: '配達時刻', value: '10:32' },
                    { label: '配達地点', value: '配達センター' },
                ],
                note: '顧客は受け取っていないと言いますが、出典は「配達済み」と記しています。これは慎重に扱うべき矛盾です。',
            },
            answer: 'ここに示された追跡データによると、荷物は10:32に配達センターで配達済みと記されています。もし受け取っていないと感じられる場合は、何が起きたかを調べるために調査を開始します。',
            answerSummary: '答えは出典に忠実であり、非難せずに矛盾を扱う。',
            checks: [
                { id: 'based', state: 'pass', label: '出典に基づく？', note: 'はい。ステータス、時刻、場所は出典から取っている。' },
                { id: 'invents', state: 'pass', label: '細部をでっち上げている？', note: 'いいえ。答えは出典にない理由や非難を加えていない。' },
                { id: 'limits', state: 'warn', label: '矛盾を扱っている？', note: 'はい、慎重に。出典が言うことを示し、顧客を退けずに調査を申し出ている。' },
            ],
            maySay: '答えは出典が言うことを伝え、矛盾についての調査開始を申し出ることができる。',
            mustNotInvent: '顧客を非難したり、ステータスと現実が食い違う理由をでっち上げたりしてはいけない。',
            takeaway: '出典が顧客と矛盾するときは、それが言うことを慎重に示し、非難せずに調査を開始しよう。',
        },
    ],
};
