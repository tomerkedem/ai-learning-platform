// i18n/locales/ja/behind-ai/chapter2Visuals.ts
// Japanese Chapter 2 visuals: Input Comparison Lab chrome and the five input
// variations. Shape source: ../../he/behind-ai/chapter2Visuals (Hebrew is canonical).
//
// Real translation. No em dash (U+2014), no en dash (U+2013). Structural fields
// (id, ambiguity, tendency, externalData) are kept literal; only visible text is translated.

import type { Locale } from '@/i18n/config';
import type { InputVariation } from '@/app/behind-the-scenes-ai/chapter-2/inputVariations';

export const chapter2Visuals = {
    contentLocale: 'ja' as Locale,

    // Input Comparison Lab chrome
    inputLab: {
        tokenizationHint: 'この後の学習で、文章はトークンに分割されます。今は分割の前に、入力が何を含んでいるかだけを見ています。',
        pickerHint: '言い回しを選んで、実際にモデルに何が届くか見てみましょう。',
        pickerAria: '比較する言い回しを選ぶ',
        ambiguityPrefix: '曖昧さ',
        outro: '同じ目的、違う言い回し。それぞれで、より深い処理が始まる前に、モデルが扱う材料が変わります。',
        // Field titles in the reading panel
        fields: {
            explicit: '文章が明示していること',
            missing: '欠けていること',
            changed: '基本からの変化',
            ambiguity: '曖昧さのレベル',
            expectation: 'モデルに期待されること',
            external: '外部データの必要性',
            tendency: 'どこに寄るか',
        },
        baseComparison: 'これが比較の基準点です。',
        externalYes: 'はい。',
        externalNo: 'この段階では不要です。',
        noticeLabel: '注目したい点',
        // Ambiguity level labels (the chip and color are structural in the component)
        ambiguityLabels: {
            low: '低',
            medium: '中',
            high: '高',
        },
        // Tendency labels (the chip and color are structural in the component)
        tendencyLabels: {
            chat: 'Chat 寄り',
            'chat-agent': 'Chat と Agent の中間',
            agent: 'Agent 寄り',
        },
    },

    // The five input variations. Structural fields (id, ambiguity, tendency, externalData)
    // mirror inputVariations.ts; only the visible text is translated, in the same order.
    inputVariations: [
        {
            id: 'base',
            label: '基本の依頼',
            prompt: '荷物が届きません。どうすればいいですか?',
            explicit: ['問題がある: 荷物が届いていない', '案内の依頼: どうすればよいか'],
            missing: ['追跡番号', '注文した時期', 'どの配送会社か'],
            changed: '',
            ambiguity: 'medium',
            expectation: '一般的な案内をするか、本当に助けるために何が欠けているかを尋ねる',
            externalData: false,
            tendency: 'chat',
        },
        {
            id: 'question',
            label: '質問だけ',
            prompt: '荷物が届いていない?',
            explicit: ['荷物が届いていない、と問いかけの形で表現'],
            missing: ['ユーザーが何を起こしてほしいか', '行動や案内を求める明示的な依頼'],
            changed: '「どうすればいいか」が外れ、疑問符が加わりました。明確な依頼のない問いかけのまま残っています。',
            ambiguity: 'high',
            expectation: '答えをまとめる前に、実際に何が必要かを確かめる',
            externalData: false,
            tendency: 'chat',
        },
        {
            id: 'contradiction',
            label: '矛盾',
            prompt: '荷物が届いていないのに、配達されたという通知を受け取りました。',
            explicit: ['問題: 荷物が届いていない', '反対の主張: 配達通知を受け取った'],
            missing: ['明示的な依頼', '確認用の追跡番号'],
            changed: 'ユーザーの体験と配達通知との間に矛盾が加わりました。',
            ambiguity: 'medium',
            expectation: '矛盾に気づき、状況の確認を提案するかもしれない',
            externalData: true,
            externalNote: '矛盾を解消するには、実際の追跡データを確認するのがよいでしょう。',
            tendency: 'chat-agent',
        },
        {
            id: 'tracking',
            label: '追跡番号つき',
            prompt: '荷物が届きません。追跡番号は 12345 です。',
            explicit: ['問題: 荷物が届いていない', '識別子: 追跡番号 12345'],
            missing: ['望ましい行動が正確には何か'],
            changed: '追跡用の識別子が加わりました。これで実際の状況を確認するのに十分です。',
            ambiguity: 'low',
            expectation: '識別子を使って配送状況を確認できる',
            externalData: true,
            externalNote: '識別子があれば、外部の追跡システムに問い合わせられます。',
            tendency: 'agent',
        },
        {
            id: 'correction',
            label: '会話の中での訂正',
            prompt: '靴ではなく、本を注文しました。',
            explicit: ['訂正: 靴ではなく本'],
            missing: ['会話の前の文脈。それがないと何を訂正しているのか分からない'],
            changed: 'これは問題の説明ではなく、会話の前に言われたことの訂正です。',
            ambiguity: 'high',
            expectation: '訂正に合わせて、会話の現在の文脈を更新する',
            externalData: false,
            tendency: 'chat',
            note: '訂正は会話の現在の文脈を変えるものであり、モデルが学習で身につけたものを変えるわけではありません。',
        },
    ] as InputVariation[],
};
