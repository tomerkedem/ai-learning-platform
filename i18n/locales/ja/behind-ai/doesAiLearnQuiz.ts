// i18n/locales/ja/behind-ai/doesAiLearnQuiz.ts
//
// Nihongo (ja, LTR) no dai 16 sho quiz ("Does AI Learn From Me") no hyouji tekisuto.
// Hepburu-go ga shinjitsu no gensen.
//
// Kore wa hyouji tekisuto nomi. Kyouyuu no shikumi (correctAnswer, difficulty, concept,
// onComplete, getReviewLinks, nextHref) wa kyouyuu no quizData.ts ni aru. Sho no page wa kono
// tekisuto o shitsumon id (byId) de kyouyuu no honegumi ni kasaneru node, sentakushi no junjo
// wa gengo kan de onaji de nakereba naranai.
//
// Kore wa native speaker ni yoru kakunin ga hitsuyou na first-pass yaku desu.
//
// Em dash (U+2014) mo en dash (U+2013) mo tsukawanai.

import type { DoesAiLearnQuizId, DoesAiLearnQuizText } from '../../he/behind-ai/doesAiLearnQuiz';

export const doesAiLearnQuiz = {
    title: '理解チェック：AI は私から学ぶのか',
    subtitle: 'この章で学んだことを研ぎ澄ます五つの問い',
    startLabel: 'チェックを始める',
    submitLabel: 'チェックを終える',
    completedTitle: 'チェックを終えました',

    byId: {
        1: {
            question: '会話の途中でモデルを訂正すると、モデルは自分を訂正した。起きたことについて最も正確な言い方は？',
            options: [
                'モデルは永久に変わり、これから訂正を覚えている',
                '訂正が会話の文脈に入ったので、モデルは同じチャットの後の方でそれを使える',
                'モデルは訂正を完全に無視した',
                'すべてのユーザーが今、訂正された答えを受け取る',
            ],
            explanation:
                'あなたが書いたことは今、会話の文脈の中にあるので、モデルは同じチャット内の後の答えでそれに頼れる。それは基盤モデルが変わったという意味ではないし、訂正がすべてのユーザーに届くという意味でもない。',
        },
        2: {
            question: '新しいチャットを開き、訂正を再び渡さずに、似た質問をもう一度した。安全な前提は？',
            options: [
                'モデルは前のチャットの訂正を確実に覚えている',
                '製品が記憶を保持するか、あなたが文脈を再び渡さない限り、前の訂正がそこにあると決めつけない',
                '新しいチャットは常に前のチャットが止まったところからちょうど続く',
                'モデルは訓練で学んだことも忘れた',
            ],
            explanation:
                '新しいチャットは前のチャットの文脈なしで始まる。製品に記憶機能があるか、情報を再び渡さない限り、訂正がまだそこにあると決めつけないこと。モデルがすべてを「忘れた」という意味ではなく、前のチャットの訂正が現在の文脈にないというだけだ。',
        },
        3: {
            question: 'ある製品が設定を保存する：「情報源なしに祝日の開館時間を示さない」。それはモデルの訓練とどう違う？',
            options: [
                '違いはない、記憶と訓練は同じもの',
                '記憶は情報を保存して文脈に戻す製品機能。訓練はモデル自体を変えた別のプロセス',
                '記憶は使うたびにモデルの重みを変える',
                '訓練は設定を保存するたびにすぐ起きる',
            ],
            explanation:
                '記憶機能は情報を保存して文脈に戻すので、答えがそれに従える。それは訓練とは異なる。訓練はモデル自体を変える別のプロセスだ。設定を保存してもモデルを訓練するわけではない。',
        },
        4: {
            question: 'なぜチャットでのあなたの一つの訂正が、すべてのユーザー向けにモデルを自動で更新しないのか？',
            options: [
                'モデルが特定のユーザーを無視すると決めているから',
                'モデル自体を変えるには、チャットの一つのメッセージではなく、訓練やシステム更新・テスト・リリースという別のプロセスが必要だから',
                '訂正は三回目以降しか効かないから',
                'どの訂正も常にすぐ訓練に入るから',
            ],
            explanation:
                'モデルの振る舞いを全員向けに変えるには別のプロセスが必要だ。例を集め、訓練やシステム更新をし、評価し、リリースする。一つのチャットの一つの訂正からは起きないし、すべてのユーザー向けに自動でもない。フィードバックが使われるとしても、製品と方針に依存する。',
        },
        5: {
            question: 'モデルに毎回従ってほしい重要な規則がある。最も安全なのは？',
            options: [
                'モデルは前のチャットで規則を学んだと決めつけ、繰り返さない',
                '見えない記憶に頼るのではなく、規則や情報源をプロンプトで再び渡すか、保存された文脈を使う',
                '規則を一度書いて、モデルが永久に変わると信じる',
                'モデルが自分で規則を訓練するのを待つ',
            ],
            explanation:
                '正確さが大事なときは「モデルはもう知っている」に頼らない。規則や情報源をプロンプトで再び渡すか、製品が提供するなら保存された文脈を使う。そうすれば指示はモデルが今見ている文脈の中にあり、見えない学習に依存しない。',
        },
    } satisfies Record<DoesAiLearnQuizId, DoesAiLearnQuizText>,
};
