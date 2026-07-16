// i18n/locales/ja/behind-ai/semanticSpace.ts
// Japanese Chapter 5 ("Semantic Space").
// Narrow localization: the "in simple words" explanatory card (plain) is fully translated
// to natural, concise Japanese for educational UI. Every other field still falls back to the
// Hebrew source until Chapter 5 is translated in full, so we spread `he` and override `plain`.
import { semanticSpace as he } from '../../he/behind-ai/semanticSpace';

export const semanticSpace = {
    ...he,
    plain: {
        eyebrow: 'かんたんに言うと',
        title: '意味空間とは',
        paragraphs: [
            '前の章で、どの文もモデルが学習した数字のリスト、その Embedding になりました。ベクトルの各値は、文の位置を一つの次元に沿って表し、すべての値が合わさって、その文が意味空間のどこに位置するかを決めます。この空間では、Embedding どうしを比べて、二つの表現がどれくらい近いかを調べられます。ここに見える地図は単純化した二次元の投影にすぎず、本物の Embedding にはもっと多くの次元があります。',
            'モデルは、学習した共通のパターンを持つ文どうしが近くに来るように文を並べます。こうして、共通する単語がまったくなくても、意味の近い文を順位づけしたり見つけたりできるのです。',
            '近いとは、モデルが文と文の関係を学習したという意味で、遠いとはその関係が弱いという意味です。ただし近さは学習した関係の手がかりにすぎず、二つの意味が同じだと証明するものではありません。',
        ],
    },
    // 第5章が実際に表示するメンターのせりふは次の2つだけ: ラボの吹き出しと、
    // 理解の確認カードの見出しにある回答前のヒント。
    mentor: {
        ...he.mentor,
        lab: '言葉ではなく、距離に注目してください。',
        lock: 'ここには魅力的な答えがあります。選ぶ前に少し考えてみてください。',
    },
    sections: {
        ...he.sections,
        dnaIntro:
            'ここまでは、それぞれの文が空間のどこに位置するかを見てきました。次は、その文を表すベクトルをより近くで見て、値のパターンが文によってどう変わるか、そしてそのパターンが文どうしの近さにどう影響するかを見ていきます。',
        dnaSelectorHint: '左右から文を一つずつ選び、値とつながりのパターンがどう変わるかを比べてみましょう。',
    },
    lock: {
        title: '理解を固める',
        question: '二つの文が意味空間で互いに近くにあります。そこから慎重に何が言えるでしょうか。',
        options: [
            '二つの文の意味が同じである。',
            '使っている尺度のうえで表現が似ているということ。ただし、意味が同じだとも、含まれる情報が正しいとも限らない。',
            '二つの文がまったく同じ単語を使っている。',
        ],
        explanationCorrect:
            '空間での近さは、比較の尺度のうえで表現どうしが似ていることを示しますが、意味が同じだとも情報が正しいとも証明しません。たった一つの否定語でも文の意味は変わり、それでも表現は近いままになり得ます。',
        explanationWrong:
            '空間での近さは、意味が同じであることを保証せず、同じ単語を使うことも求めません。それは比較の尺度のうえで表現どうしが似ていることを示すだけです。',
    },
    lab: {
        ...he.lab,
        map: {
            ...he.lab.map,
            closestNow: 'いま最も近い文は:',
        },
        negation: {
            ...he.lab.negation,
            bridge: 'だからこそ、単語だけを見ても十分ではありません。どの単語が現れたかだけでなく、それぞれの単語が残りの意味をどう変えるかを理解する必要があります。',
        },
    },
};
