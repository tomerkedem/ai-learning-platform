// i18n/locales/ja/behind-ai/chapter3.ts
// Japanese Chapter 3 ("トークン化：文章がトークンに分かれるとき").
// Shape source: ../../he/behind-ai/chapter3 (Hebrew is canonical).
//
// Real translation, natural Japanese (not literal). Phone-first and TTS-ready: short
// sentences, no dense paragraphs. The package and delivery anchor is preserved.
//
// IMPORTANT (Japanese is space-free): tokenization is never described as "splitting
// words separated by spaces". Where the Hebrew/English copy mentions removing spaces,
// the Japanese copy uses a space-free idea instead (kanji vs hiragana, "how it is
// written", visible text units). No artificial spaces are inserted. The page stays
// pedagogically correct even though Japanese sentences have no spaces.
//
// Stable terms kept: トークン, モデル, プロンプト, コンテキスト. No em dash (U+2014)
// and no en dash (U+2013). Mentor bubble text carries no emoji.
//
// The lab strings (TokenizationLab and friends) come from labContent, so they are
// not repeated here.

import type { Locale } from '@/i18n/config';
import { chapter3Quiz } from './chapter3Quiz';

export const chapter3 = {
    contentLocale: 'ja' as Locale,

    hero: {
        badge: 'Behind the Scenes · 03',
        titleLead: 'あなたの文章は、ひとかたまりのまま入るわけではありません。',
        titleHighlight: '単位に分かれます。',
        lede: 'わたしたちには一つの文章に見えても、モデルには処理単位の並びとして入ります。意味が計算される前に、文章はトークンと呼ばれる小さな部分に切り分けられます。',
        question: 'わたしには一つの文章なのに、なぜモデルは複数の単位として見るのでしょうか？',
        chipGuess: 'まず文章に何が起きるか当ててみる',
        chipTouch: '入力して、文章が切れる様子を見る',
    },

    // F3 RESPOND (M10): この章の人間的な応答レイヤー。ステータスは独立したまま、
    // ここにあるのは正解時も不正解時もメンターが続けて言う一文だけ。
    mentorRespond: {
        guessCorrect:
            '分割が理解の後ではなく前に起きることを見抜きました。だからこそ、句読点の違いや追跡番号のように、私たちには同じに見えるものが、モデルにはまったく別物に見えることがあります。',
        guessWrong:
            '無理のない間違いです。人は文を読むとき、断片ではなくひとまとまりとして受け取ります。モデルでは順序が逆で、まず単位への切り分けがあり、意味はその後です。上の行をもう一度見て、何が何より先に切られるのかを確かめてみてください。',
        quizPass:
            'テキストを見た時点で、いくつの単位に分かれるかを考えられています。この視点が、単語数はトークン数ではないこと、言語によってコストが変わることを説明します。',
        quizFail:
            '狙いは各単語の切り方を覚えることではなく、切り分けが何よりも先に起きると理解することです。トークンラボに戻り、同じ文を二通りに入力して、単位の境界がどこで動くかを見てください。',
    },

    guess: {
        eyebrow: 'クイック予想 · 文章に何が起きるか',
        title: '送信した直後、意味が計算される前に、文章には何が起きますか？',
        subtitle: '一番近いと思う説明を選んでください。試験ではありませんが、本当に起きていることに近づく方向が一つあります。',
        invite: '開く前に当ててみましょう。文章にまず起きることは何でしょうか？',
        correctTitle: '正解です！',
        wrongTitle: 'おしい！',
        getsRightLabel: 'この考えの正しい点',
        revealButton: '中心となる考えを見る',
        revealTitle: 'では、本当は何が起きるのか',
        revealCopy:
            'あなたが書いた文章は、ひとかたまりのままモデルに入るわけではありません。トークンと呼ばれる処理単位に分かれます。トークンは、トークナイザーによって、言葉や言葉の一部、記号、数字になります。すべての処理はこの単位から始まります。',
        cta: '文章がどう分かれるか見てみよう',
        resetButton: '選び直す',
        exploreHint: '別の選択肢を選んで、どう聞こえるか見ることもできます。',
        cards: {
            'as-is': {
                title: '文章はそのまま入る',
                desc: 'モデルは文章ぜんたいを受け取り、すぐに理解し始める。',
                statusLabel: 'よくある誤解',
                getsRight: 'そう考えるのは自然です。わたしたちはそうやって文章を読むからです。',
                missesLabel: '見落としている点',
                misses: 'でも理解の前に、文章はより小さな単位に分かれます。モデルは文章ぜんたいから始めるわけではありません。',
                bridge: 'この分割が、あとに続くすべての入り口です。',
            },
            tokens: {
                title: '文章は単位（トークン）に分かれる',
                desc: '文章は小さな部分に分かれ、そこからだけ処理が始まる。',
                statusLabel: '正解です',
                getsRight: 'そのとおり。最初の段階は、意味を計算する前のトークンへの分割です。',
                missesLabel: 'これから見ること',
                misses: 'トークンがつねに言葉ぜんたいではないこと、そして記号や数字や書き方が分割を変えることを見ていきます。',
                bridge: 'あとに続くものはすべて、この単位から作られます。',
            },
            meaning: {
                title: 'モデルはすぐに意味へ飛ぶ',
                desc: 'モデルは言葉を扱う前に意図をつかむ。',
                statusLabel: 'この段階ではない',
                getsRight: '最後に意味が作られるのは確かです。',
                missesLabel: '見落としている点',
                misses: 'でも意味は分割のあとに来るもので、最初の段階ではありません。まず、扱うための単位が必要です。',
                bridge: '意味はトークンの上に作られるのであって、その代わりではありません。',
            },
            important: {
                title: '大事な言葉だけが残る',
                desc: 'モデルはあらかじめより分けて、大事なものを残す。',
                statusLabel: '部分的に正しい',
                getsRight: 'あとの段階で、どの単位も同じだけ効くわけではないのは確かです。',
                missesLabel: '見落としている点',
                misses: 'でも分割の段階では、文章ぜんたいが単位になり、何も捨てられません。重要度の重みづけはずっとあとで起きます。',
                bridge: 'まずすべてが単位になり、そのあとでモデルがどこに注目するかを決めます。',
            },
        },
    },

    insight: {
        title: 'モデルはあなたの文に実際に何をするのか？',
        lead: 'まず何よりも、モデルは文をトークンと呼ばれる小さな断片に切り分けます。',
        body: 'トークンは、あるときは一つの単語、あるときは単語の一部、あるときは記号や空白です。モデルは私たちのように文を読むのではなく、その断片の並びだけを扱います。これは文を数えられる形に変える最初の変換であり、まだ理解ではありません。',
    },

    lab: {
        eyebrow: 'Tokenization Lab',
        title: '文章をトークンに分ける',
        intro: 'クイックな実験を選ぶか、自分の文章を入力してみましょう。たとえば「荷物が届きませんでした」です。感嘆符や追跡番号を加えたり、別の言語に切り替えたりすると、分割がどう変わるかに注目してください。各単位には色がつき、記号や数字もそれぞれ一つの単位として数えられます。',
    },

    lock: {
        title: '理解度チェック',
        truthLabel: '正しい',
        truthText: '深い処理の前に、文章は単位に分かれる。',
        mistakeLabel: '誤り',
        mistakeText: '文章はひとかたまりでモデルに入り、モデルはわたしたちのように読む。',
        question: '次のうち、トークン化に影響しそうな変更はどれですか？',
        options: [
            '記号を加える。たとえば感嘆符',
            '数字を加える。たとえば追跡番号',
            '同じ言葉を漢字からひらがなに変える',
            'ある言語から別の言語に切り替える',
            '上のすべて',
        ],
        explanationCorrect:
            '正しいです。記号、数字、書き方、そして書く言語は、どれも文章がトークンに分かれる形を変えます。分割は意味だけでなく、書き方に敏感です。',
        explanationWrong:
            'それも影響しますが、完全な答えではありません。記号も数字も、漢字かひらがなかも、言語の切り替えも、分割を変えます。正確な選択は「上のすべて」です。',
    },

    practical: {
        title: '実践的なまとめ',
        intro: 'トークン化は、モデルへの書き方に直接かかわります。',
        points: [
            '一つの言葉がつねに一つのトークンとはかぎりません。長さやコストを言葉の数で測らないでください。',
            '同じ依頼でも、記号や数字、書き方や言語によって、異なる数の単位になりえます。すっきりした書き方は単位を節約しがちです。',
            '長さやコスト、コンテキストウィンドウが大事なとき、たとえば届かない荷物についての長いやり取りでは、言葉ではなく単位で考えてください。',
            'きれいに分割できても、モデルが理解したわけではありません。どんな処理よりも前の、最初の変換にすぎません。',
        ],
    },

    quiz: chapter3Quiz,
};
