// i18n/locales/ja/behind-ai/semanticSpaceLab.ts
//
// 第5章「Semantic Space」のラボ文字列（日本語）。
//
// キー（フレーズ id、クラスタキー）は構造上のもので翻訳しません。値のみ翻訳します。
// 座標は app/behind-the-scenes-ai/chapter-5/semanticSpace.ts にあります。
//
// 否定ペアは base='not-arrived' と opposite='arrived'。
// 重要な言語上の注意: 日本語の否定は独立した単語を1つ足すのではなく、助動詞の活用そのものを
// 変えます（「います」→「いません」）。動詞の語幹「開いて」はどちらの文でも変わりません。
// したがってこの言語の文言では「単語を1つ足した」とは書かず、「語尾が変わる」と正確に
// 述べています。
//
// 表示の分割について: Intl.Segmenter は日本語の否定を正しく切り出せません。自動比較に
// 任せると動詞の語幹が割れてしまうため、下の negationVisual で表示用の分割と強調位置を
// 明示しています。強調するのは否定を担う「いません」だけです。
//
// negationVisual は見た目の分割だけです。読み上げ・sr-only・aria-label には phrases の
// 自然な一文がそのまま渡るので、ここに人工的な空白を入れてはいけません。
//
// フレーズ id（not-arrived/delayed/arrived など）は、その先の翻訳された意味が完全に
// 変わった後も（古い郵便物のドメインから、窓/部屋という日常のドメインへ）、不透明な内部
// キーのまま残しています。id を付け替えても学習者にとっての価値はなく、
// semanticSpace.test.ts、ANCHOR_ID、NEGATION_PAIR への変更が必要になるだけです。
//
// ダッシュ（em dash / en dash）は使いません。プロジェクトの文章ルールに従います。

import type { SemanticSpaceLabDict } from '../../he/behind-ai/semanticSpaceLab';

export const semanticSpaceLab: SemanticSpaceLabDict = {
    selector: {
        label: '実験を選ぶ',
        map: '空間のご近所',
        negation: '否定のわな',
    },

    map: {
        title: '意味の地図',
        subtitle: '文を選んでください',
        legendTitle: '意味の領域',
        neighborsTitle: '最も近い文',
        neighborsSubtitle: '空間での近さ順',
        closenessTo: '基準の文',
        closest: '最も近い',
        toneNear: '地図の上で近い',
        toneMid: '地図の上で中くらいの距離',
        toneFar: '地図の上で遠い',
        closestNow: '今いちばん近い文は:',
        selectHint: '地図の文を選ぶと、最も近い文のリストがすぐに変わります。',
        note: '地図の距離が意味です。近い文とは、言葉が違ってもモデルが関連づけている文のこと。遠い文とは、その関連が弱い文のことです。',
    },

    negation: {
        title: '言葉は近く、意味は正反対',
        subtitle: '2つの文、ほとんど同じ言葉',
        baseLabel: 'もとの文',
        oppositeLabel: '否定のない形',
        sharedChip: 'ほとんど同じ言葉',
        oppositeChip: '正反対の意味',
        revealButton: 'ここから分かること',
        explanation: '2つの文はほとんど同じ言葉でできているので、近く見えます。しかし否定が意味を端から端までひっくり返します。日本語では独立した単語が1つ増えるのではなく、「います」の部分だけが「いません」に変わり、動詞の語幹「開いて」は変わりません。一方は窓が開いていると言い、もう一方は開いていないと言っています。言葉が近いことは、意味が同じである保証にはなりません。',
        bridge: 'これは地図のルールと矛盾しません。空間での近さは学習された便利な手がかりですが、完全ではありません。ほとんど同じ言い回しでも、意味が正反対に隠れていることがあります。だからモデルは、どの言葉が現れたかだけでなく、文脈と言葉どうしの関係も考える必要があります。',
    },

    clusters: {
        complaint: '不快感',
        status: '部屋の状態',
        action: '日常の活動',
        unrelated: '無関係',
    },

    phrases: {
        'not-arrived': '窓が開いていません',
        'customer-waiting': '暑すぎます',
        'not-received': '空気がこもっています',
        'delayed': '朝からずっと閉めたままです',
        'status-not-updated': 'エアコンが切れています',
        'courier-on-way': '部屋の換気が必要です',
        'arrived': '窓が開いています',
        'center-checking': '彼女は植物に水をやっています',
        'agent-contacted': '彼はすべての明かりを消しました',
        'draft-update': '彼らは台所を掃除しています',
        'recipe': 'チョコレートケーキのレシピ',
        'weather': '明日の天気予報',
    },

    disclaimer: 'これは2次元だけの学習用の地図です。近さという考え方を示すためのもので、描かれた距離が本当の空間の正確な写しというわけではありません。',

    // 表示用の明示的な分割。「窓が」「開いて」「いません」は日本語の教え方どおりの区切りで、
    // 否定を担う「いません」だけを強調します（動詞の語幹「開いて」はどちらの文でも同じ）。
    // 各配列を join('') すると phrases の一文と完全に一致します。空白は入れません。
    negationVisual: {
        base: ['窓が', '開いて', 'いません'],
        opposite: ['窓が', '開いて', 'います'],
        pivot: ['いません'],
    },
};
