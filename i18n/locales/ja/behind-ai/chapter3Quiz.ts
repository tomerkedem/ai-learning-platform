// i18n/locales/ja/behind-ai/chapter3Quiz.ts
// Japanese Chapter 3 quiz display text. Shape source: ../../he/behind-ai/chapter3Quiz.
// Mechanics (correctAnswer, difficulty, concept) stay in the shared quizData.ts; the
// page merges this display text by question id. Option order matches the Hebrew source
// so the stored correctAnswer index stays valid. concept keys stay Hebrew (stable);
// conceptLabels provide the translated display label.
//
// Japanese is space-free. Tokenization is NOT described as "splitting words separated
// by spaces". The "no spaces" variation in Q3 is replaced by a kanji/hiragana change,
// which genuinely changes the split in Japanese and needs no artificial spaces.
// No em dash (U+2014), no en dash (U+2013). Stable term kept: トークン, モデル.

export const chapter3Quiz = {
    title: '理解度チェック：トークン化',
    subtitle: 'この章で学んだことを確かめる5つの問題',
    startLabel: 'クイズを始める',
    submitLabel: 'クイズを終える',
    completedTitle: 'クイズが終わりました',

    byId: {
        1: {
            question: '送信した直後、モデルが意味を計算する前に、あなたの文章には何が起きますか？',
            options: [
                'モデルはすぐに最も確からしい答えを計算する',
                '文章はトークンと呼ばれる処理単位に分けられる',
                'モデルは文章を別の言語に翻訳する',
                'モデルは言葉を重要度で並べ替える',
            ],
            explanation:
                'トークンへの分割が入り口です。意味を計算する前に、文章は処理単位の並びになります。分割があって初めて処理が始まります。',
        },
        2: {
            question: 'ひとまとまりに見える言葉が、複数のトークンに分かれることがあります。ここからの学びは何ですか？',
            options: [
                'トークンの数はつねに言葉の数と同じになる',
                'トークンは処理単位であり、かならずしも一つの言葉ぜんたいではない',
                '一部の言語はトークンに分けられない',
                '一文字ごとに別のトークンになる',
            ],
            explanation:
                'トークンは処理単位であり、言葉そのものとはかぎりません。一つの言葉が複数の単位に分かれることがあるので、一つの言葉がつねに一つのトークンだとは考えないでください。',
        },
        3: {
            question:
                'ある人が「洗濯物が乾きませんでした」を取り上げ、いくつかの形を試します。感嘆符を三つ付けたもの、数字を入れたもの、漢字をひらがなに変えたものです。トークン化はどうなりますか？',
            options: [
                '意味は変わっていないので、分割は同じままになる',
                '分割に影響するのは意味だけで、書き方の形は関係ない',
                'これらの変化はどれも、分割や単位の数を変えうる',
                '記号や数字は取り除かれるので、影響はない',
            ],
            explanation:
                '分割は書き方に敏感です。記号や数字はそれぞれが一つの単位として数えられ、漢字かひらがなかでも切れ方は変わります。同じ意図でも、異なる数の単位になりえます。',
        },
        4: {
            question: '友人が「文章はもうトークンに分けられたのだから、モデルはもう理解した」と言います。この主張のどこが不正確ですか？',
            options: [
                '誤りはない。トークンへの分割こそが理解そのものだ',
                '分割は処理単位への変換にすぎず、理解は生じるとしても後の段階で来る',
                '誤りは、文章が実際には分割されていない点だ',
                '誤りは、トークンが意味とまったく関係ない点だ',
            ],
            explanation:
                'トークンへの分割は理解ではありません。処理できる単位へ変える最初の変換です。その単位の上に作られるものは後の段階で来るのであって、分割の瞬間ではありません。',
        },
        5: {
            question: 'まったく同じ文章を二つの異なるモデルで測ると、トークンの数が違って出ます。どうしてそんなことが起きるのですか？',
            options: [
                'どちらかのモデルが数え間違えたにちがいない',
                '異なるモデルは異なるトークナイザーを使うことがあり、同じ文章でも切れ方が変わる',
                'トークンの数は文章の長さだけで決まり、変わることはない',
                '二つ目のモデルが数える前に文章を翻訳した',
            ],
            explanation:
                'ここに誤りはありません。分割はトークナイザー次第で、異なるトークナイザーは同じ文章を違う形に切ります。だからトークンの数がモデル間で一定だとか、一つの言葉がつねに一つのトークンだとは考えないでください。',
        },
    },

    conceptLabels: {
        'פירוק לטוקנים': 'トークンへの分割',
        'טוקן מול מילה': 'トークンと言葉の違い',
        'צורה משנה פירוק': '書き方が分割を変える',
        'פירוק אינו הבנה': '分割は理解ではない',
        'טוקנייזרים נבדלים': 'トークナイザーは異なる',
    },
};
