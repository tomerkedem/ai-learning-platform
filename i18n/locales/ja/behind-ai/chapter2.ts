// i18n/locales/ja/behind-ai/chapter2.ts
// Japanese Chapter 2 ("The model receives what you wrote, not your intent").
// Shape source: ../../he/behind-ai/chapter2 (Hebrew is canonical).
//
// Real translation. No em dash (U+2014), no en dash (U+2013). Mentor bubble text
// carries no emoji. "Chat" and "Agent" are kept as fixed product-style terms.

import type { Locale } from '@/i18n/config';
import { chapter2Visuals } from './chapter2Visuals';
import { chapter2Quiz } from './chapter2Quiz';

export const chapter2 = {
    contentLocale: 'ja' as Locale,

    // Hero
    hero: {
        badge: 'Behind the Scenes · 02',
        titleLead: '同じ要望でも、言い回しは二通り。',
        titleHighlight: 'モデルは同じものを受け取る？',
        lede: 'チャットに入力するとき、私たちは自分が何を求めているかを正確に分かっています。しかし同じ要望でも、いくつかの言い回しができます。この章では、同じ依頼のいくつかの言い回しを比べ、モデルがそれらをまったく同じように受け取るのかを確かめます。',
        question: '確かめる前に予想してみましょう。メッセージを送ると、実際にモデルには何が届くのでしょうか。',
        chipGuess: '最初に入るものを当ててみよう',
        chipCompare: '言い回しを比べて何が変わるか見てみよう',
    },

    // Mentor speech bubbles (text only; pose and placement are structural in the page)
    mentor: {
        hero: 'いくつかの言い回しを比べて、何が変わるか見てみましょう',
        lab: '同じ目的、違う材料',
        lock: '少し止まって、答えを選びましょう。そうすれば、この章の考え方をつかめたか分かります。',
    },

    // Opening guess (DiscoveryGuess): text only; poses and target are structural in the page
    guess: {
        eyebrow: 'クイック推測 · モデルに入るもの',
        title: 'メッセージを送った瞬間、モデルが本当に最初に受け取るのは何でしょうか。',
        subtitle: '一番近いと思う説明を選んでください。これはテストではありませんが、実際に起きていることに近づく方向が一つあります。',
        invite: '中身を見る前に、当ててみましょう。最初にモデルに届くのは実際には何でしょうか。',
        correctTitle: '正解です！',
        wrongTitle: 'おしい！',
        getsRightLabel: 'これが正しくとらえている点',
        revealButton: '中心となる考え方を見る',
        revealTitle: 'では、本当に入るものは何でしょうか。',
        revealCopy: 'モデルはあなたの意図も、あらかじめ用意された答えも受け取りません。出発点はあなたが書いた文章そのもの、つまり言葉、語順、句読点です。書かなかったことは欠けたままです。モデルは文章と会話の文脈から意図を推し量ります。だからこそ、同じ要望でも言い回しが二つ違えば、モデルが扱う材料も変わり得るのです。',
        cta: 'いくつかの言い回しを比べてみましょう',
        resetButton: '選び直す',
        exploreHint: '別の選択肢を選んで、どう聞こえるか見ることもできます。',
        cards: [
            {
                title: '私の意図',
                desc: 'モデルは言葉になる前から、私が望んだことを直接理解する。',
                statusLabel: 'よくある誤解',
                getsRight: 'それは自然な感覚です。人どうしなら本当に意図を推測し合うからです。',
                missesLabel: 'これが見落としている点',
                misses: 'モデルは意図を入力としては受け取りません。文章を受け取り、そこから推測しようとします。',
                bridge: 'だから同じ願いでも、言い回しが違えば別の結果につながることがあります。',
            },
            {
                title: '書かれたままの文章',
                desc: '私が入力した言葉、順序、句読点を、そのまま。',
                statusLabel: '正しく選びました',
                getsRight: 'その通りです。出発点は文章そのもので、そこにあるものも、ないものも含みます。',
                missesLabel: 'まだ見ておきたい点',
                misses: '言い回しの小さな変化が、モデルが受け取る材料をどう変えるかを見ていきます。',
                bridge: 'この後に起きることはすべて、この文章から始まります。',
            },
            {
                title: '返すべき答え',
                desc: 'モデルはもう着地点を知っていて、うまく言葉にするだけ。',
                statusLabel: 'この段階ではない',
                getsRight: '最後に答えが出るのは確かです。',
                missesLabel: 'これが見落としている点',
                misses: 'でも答えは後で組み立てられるもので、最初にモデルが受け取るものではありません。',
                bridge: '最初にあるのは入力だけで、答えはそこから一歩ずつ組み立てられます。',
            },
            {
                title: '重要な言葉だけ',
                desc: 'モデルは事前にふるい分けて、重要なものを残す。',
                statusLabel: '部分的に正しい',
                getsRight: 'すべての言葉が後で同じだけ効くわけではないのは確かです。',
                missesLabel: 'これが見落としている点',
                misses: 'でも入力の段階では文章全体が入り、選ばれた一部だけではありません。重要度の重み付けは後で起こります。',
                bridge: 'まずすべてが入り、何に注目するかは後で決まります。',
            },
        ],
    },

    // Input Comparison Lab section header (the component itself lives in chapter2Visuals)
    inputLab: {
        eyebrow: 'Input Comparison Lab',
        title: 'モデルに届くものを比べる',
        intro: '同じ依頼でも、言い回しはいくつも違います。それぞれがモデルに異なる材料を与えます。',
    },

    // Visible message versus the full input (post-lab card, closes the chapter-title promise)
    fullInput: {
        title: 'あなたのメッセージは入力の一部で、すべてとは限りません',
        body: 'あなたが書いたメッセージは入力の一部ですが、いつもそのすべてとは限りません。AI アプリは、指示や会話のこれまでの部分、その他の文脈を付け加えることもあります。書かれず、付け加えられもしなかったものは、欠けたままです。',
        seen: 'ユーザーが見るもの',
        added: 'アプリが付け加えるかもしれないもの',
        total: 'モデルに渡される入力',
        caveat: 'これはアプリごとに異なり、決まった数式ではありません。',
    },

    // Everyday example
    everyday: {
        title: '日常のひとコマ',
        body: '友だちに「届かなかった」と送ると、相手はもう何のことか分かります。会話や口調、二人の履歴からです。モデルは実際に書かれたものと、会話の中で持っている文脈から始めます。かなり多くを推測できますが、あなたの頭の中にあるものは受け取りません。',
    },

    // What to take from the chapter
    takeaway: {
        title: 'この章のポイント',
        points: [
            '入力は実際に書かれた文章であり、意図ではありません。',
            '言い回し、順序、文脈が、モデルの扱える材料を変えます。',
            '欠けた情報は、モデルに推測させたり、質問させたり、一般的に答えさせたりします。',
            '追跡番号を加えると、依頼は確認できるものに変わります。',
            'あなたが見るメッセージは入力の一部で、アプリはさらに付け加えることがあります。',
            '会話の途中での訂正は、現在の文脈を変えるものであり、モデルが学習で身につけたものを変えるわけではありません。',
        ],
    },

    // Check Your Understanding (true vs false) + the diagnosis question
    lock: {
        title: '理解度チェック',
        truthLabel: '正',
        truthText: 'モデルは実際に書かれたものから始まる。',
        mistakeLabel: '誤',
        mistakeText: 'モデルは私の意図をそのまま受け取る。',
    },

    // In-page diagnosis question (not part of the chapter quiz / quizData)
    diagnosis: {
        prompt: '私の荷物が届いていない?',
        question: 'ユーザーはこのメッセージを書きました。モデルが本当に受け取ったのは何でしょうか。',
        choosePrompt: '正しいと思う答えを選ぶと、短い説明が表示されます。',
        options: [
            '疑問符のついた短い文章で、明示的な依頼はない',
            'すべての詳細を含む、問題の全体',
            'サポートへの問い合わせを開く意図',
            '返すべき答え',
        ],
        explanation: 'モデルが受け取ったのは、まさにこの短い文章です。数語と疑問符だけ。そこには明示的な依頼も詳細もありません。それ以外はすべて私たちが想定しているもので、実際に入ったものではありません。特定の行動がすでに依頼されたと、モデルは決めつけないほうがよいのです。',
    },

    quiz: chapter2Quiz,

    // Visuals and lab sub-namespace
    visuals: chapter2Visuals,
};
