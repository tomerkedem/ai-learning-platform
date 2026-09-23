// i18n/locales/ja/behind-ai/semanticSpaceDna.ts
//
// 第5章の意味的DNA比較セクションの日本語コンテンツ。第5章が独自に持つデータセットで、
// chapter4Lab や第4章の SENTENCE_STRUCTS には依存しません。
//
// ダッシュ（em dash / en dash）は使いません。プロジェクトの文章ルールに従います。

import type { semanticSpaceDna as HeDna } from '../../he/behind-ai/semanticSpaceDna';

export const semanticSpaceDna: typeof HeDna = {
    sentences: {
        'window-not-open': { text: '窓が開いていません', ttsLine: '窓が開いていません。部屋についての訴え、閉まり度が高い。' },
        'window-shut': { text: '窓が閉まっています', ttsLine: '窓が閉まっています。言葉は違いますが、同じ向きの意味です。' },
        'window-is-open': { text: '窓が開いています', ttsLine: '窓が開いています。同じ話題ですが、閉まり度がなく、パターンが変わりました。' },
        'room-is-cold': { text: '部屋が寒いです', ttsLine: '部屋が寒いです。似た不快感ですが、窓が閉まっているかどうかの話ではありません。' },
        'cat-on-couch': { text: '猫がソファで眠っています', ttsLine: '猫がソファで眠っています。別の世界の文で、部屋とは関係ありません。' },
    },

    genes: {
        roomRelevance: '部屋との関連度',
        closedness: '窓の閉まり度',
        discomfort: '不快感',
    },

    dna: {
        title: 'ベクトルの中の意味',
        intro: 'ベクトルは1つの数字ではありません。モデルが学習した意味の要素のプロファイルです。はしごの各段が1つの意味要素で、ノードの大きさはその文でその要素がどれだけ強いかを示します。',
        roleActive: '選んだ文',
        roleCompare: '比較する文',
        twistMeaning: '2つの文の意味が近いほど、2本の鎖はきつく絡み合います。意味が離れると、鎖もほどけていきます。',
        leadShared: (names) => `2つの文は同じ意味の要素で強く光っています: ${names}。だから近いのです。`,
        leadNone: '2つの文は違う要素を光らせているので、より離れています。',
        sharedBadge: '共通',
        guideSize: 'ノードが大きいほど、その文でその要素が強いことを示します。',
        guideBond: '脈打つ緑の結びつきは、2つの文に共通する要素を示し、それが意味を近づけています。',
        stayedClose: '意味は近いままでした',
        drifted: '意味は離れました',
        axesNote: 'ここでの軸は学習用のラベルです。実際のモデルでは、ベクトルは人が読める特徴としては表せない、数百から数千の数値の次元を含みます。',
    },
};
