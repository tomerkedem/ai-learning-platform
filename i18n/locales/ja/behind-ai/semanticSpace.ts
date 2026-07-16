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
            'どの文も数字のリストになったあとは、言葉ではなく数字で文どうしを比べられます。モデルは二つのリストがどれくらい似ているかを測り、学習した共通のパターンを持つ文どうしが近くに来るように並べます。こうして、共通する単語がまったくなくても、意味の近い文を順位づけしたり見つけたりできるのです。',
            '近いとは、モデルが文と文の関係を学習したという意味で、遠いとはその関係が弱いという意味です。ただし近さは学習した関係の手がかりにすぎず、二つの意味が同じだと証明するものではありません。そして、ここに見える地図は、もっと多くの軸を持つ空間を目で見えるように単純化した二次元の図にすぎません。',
        ],
    },
};
