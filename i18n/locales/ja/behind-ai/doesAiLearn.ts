// i18n/locales/ja/behind-ai/doesAiLearn.ts
//
// Nihongo (ja, LTR) no Does AI Learn From Me sho (dai 16 sho) no moji. "Behind the Scenes of
// AI" course. Hepburu-go ga shinjitsu no gensen de, kata (DoesAiLearnDict) o teigi suru.
//
// Aidea: chat de model o teisei suru to, sore wa bunmyaku ni aru node teisei o tsukaeru. Sore
// wa kiban model ga anata kara eikyuu ni gakushuu shita to iu imi de wa nai. Bunmyaku, kioku
// (product kino), log to feedback, soshite kunren wa kotonaru soo da. Sho wa ippan teki de
// gainen teki na mama: tokutei no product no houshin, privacy, kunren ni tsuite no shuchou wa
// naku, AI ga "itsumo oboete iru" toka "kesshite oboete inai" to iu shuchou mo nai.
//
// Kore wa native speaker ni yoru kakunin ga hitsuyou na first-pass yaku desu.
//
// Em dash (U+2014) mo en dash (U+2013) mo tsukawanai. Nen no genkyuu mo shinai.

import type { Locale } from '@/i18n/config';
import { doesAiLearnLab } from './doesAiLearnLab';
import { doesAiLearnQuiz } from './doesAiLearnQuiz';

export const doesAiLearn = {
    contentLocale: 'ja' as Locale,

    hero: {
        badge: 'Behind the Scenes · 16 · Does AI Learn From Me',
        titleLead: 'あなたはモデルを訂正した。',
        titleHighlight: '本当にあなたから学んだのか？',
        lede: '前の章では、本当の改善が起きたかを確かめた。今度はあなたの視点から問う。チャットでモデルを訂正したとき、本当にあなたから学んだのか、それとも今書いたことを使っただけなのか。文脈・記憶・訓練を分けて考える。',
        hook: 'モデルは「荷物は明日届きます」と言い、あなたは「いいえ、追跡では確定した予定はありません」と答えた。次に新しいチャットを開いたとき、何が起きる？',
        chipTry: '四つの学習の層を切り替える',
        chipCompare: '訂正がいつ役立ち、いつ消えるかを見る',
    },

    mentor: {
        hero: '今の訂正は、必ずしも永久の学習ではない',
        labExplain: '層を切り替えて、何が変わるか見よう',
        misconception: '効いた。でも必ずしも学ばれてはいない',
        lock: '新しいチャットはまっさらな紙から始まる',
        practical: '規則や情報源をもう一度渡そう',
    },

    primer: {
        eyebrow: '文脈・記憶・訓練は同じではない',
        title: 'ラボの前に：モデルが「私から学ぶ」とはどういう意味？',
        subtitle: '今使うこと・履歴・記憶・保持・訓練は同じではない。',
        lead:
            'モデルを訂正してモデルが自分を直すと、学んだように感じやすい。だがたいていはもっと単純なことが起きている。訂正が、モデルが今見ている文脈に入ったのだ。混同しやすいいくつかの層を分けてみよう。',
        points: [
            {
                title: '現在の文脈',
                body: '現在の会話であなたが書くことは文脈の一部だ。モデルは同じチャットの後の答えを作るときにそれを使える。',
            },
            {
                title: '新しい会話',
                body: '新しいチャットは、製品が記憶を保持するか、あなたが文脈を再び渡さない限り、古い訂正を必ずしも含まない。',
            },
            {
                title: '製品の記憶',
                body: '一部の製品は記憶や保存された設定を提供する。これは製品機能であって、基盤モデルを変えることと同じではない。',
            },
            {
                title: '保持と記憶と訓練の違い',
                body: '保持とは、サービスが一定の期間や目的でデータを保つこと。記憶とは、選ばれた情報が今後の会話で戻ってくることがあること。訓練とは、モデルを変える別のプロセスのためにデータを選ぶこと。これらは別のことで、製品と設定によって異なる。',
            },
            {
                title: '訓練と更新',
                body: 'モデル自体を変えるには、訓練または更新という別のプロセスが必要だ。一つのチャットの一つの訂正から即座に起きることではない。',
            },
            {
                title: '安全な前提',
                body: '見えない学習に頼らないこと。事実が大事なら、文脈をもう一度渡すか、信頼できる情報源を使う。',
            },
        ],
    },

    see: {
        title: '訂正から持続的な改善へ',
        steps: [
            '現在のチャットでの訂正',
            '現在の文脈が変わる',
            '答えが今よくなる',
            '新しいチャットには含まれないかもしれない',
            '持続的な改善には記憶か訓練が要る',
        ],
        caption:
            'ここにはいくつかの異なる層がある。文脈、記憶、サービスによるデータの保持、そして訓練だ。あなたの訂正は文脈の層に生きており、必ずしもより深い層には届かない。第14章はフィードバックが後の改善プロセスにつながりうることを示し、第15章はどんな更新も評価が必要だと示した。そしてここでは、そのどれもが、モデルが一つの訂正から即座に学んだという意味ではないことを見た。',
    },

    guess: {
        eyebrow: 'クイック予想 · 開く前に',
        title: 'モデルを訂正し、同じチャットでモデルは自分を直した。新しいチャットでは何が起きる？',
        subtitle: '最も安全な前提を選ぼう。ここに点数はなく、実際に起きることを表す一つの方向がある。',
        invite: 'ラボで確かめる前に、次のチャットで訂正がどうなるか予想してみよう。',
        correctTitle: '大正解！',
        wrongTitle: 'おしい！',
        getsRightLabel: '合っている点',
        revealButton: '主要な考えを見る',
        revealTitle: 'では実際には何が起きる？',
        revealCopy:
            '訂正は現在の会話の中では役立ちうる。文脈の中にあるからだ。だがそれは基盤モデルが変わったという意味ではないし、新しいチャットでは訂正がまだそこにあると決めつけるべきではない。持続的な改善には、製品の記憶か、別の訓練プロセスが要る。',
        cta: 'ラボで見てみよう',
        resetButton: 'もう一度選ぶ',
        exploreHint: '別の選択肢を選んで、どう聞こえるか見ることもできる。',

        cards: {
            contextNotPermanent: {
                title: '今はこれを使えるが、モデルは必ずしも変わっていない',
                desc: '訂正は文脈の中にあるから現在のチャットで役立つのであって、モデルが永久に学んだからではない。',
                statusLabel: '正しく選べた',
                getsRight: 'その通り。訂正は会話の文脈に生きているので、基盤モデルを変えずに今役立つ。',
                missesLabel: 'まだ見るべきこと',
                misses: 'ラボでは、新しいチャットで何が起きるか、そして製品の記憶と訓練の違いを見る。',
                bridge: '文脈では役立つが、必ずしも永久に学ばれてはいない。',
            },
            alwaysRemembers: {
                title: 'これからずっとこれを覚えている',
                desc: '訂正がモデルに入ったので、どのチャットでも覚えている。',
                statusLabel: 'よくある誤解',
                getsRight: 'そう感じるのはもっともだ。チャットの中では訂正は実際に効いたのだから。',
                missesLabel: '見落とすこと',
                misses: '基盤モデルは訂正で変わっていない。新しいチャットでは、それを覚えていると決めつけないこと。',
                bridge: '今は効いたが、永久には保存されていない。',
            },
            cantUseAtAll: {
                title: '訂正をまったく使えない',
                desc: 'チャットでの訂正は何にも影響しない。',
                statusLabel: '別の層',
                getsRight: '訂正が基盤モデルを変えないのは本当だ。',
                missesLabel: '見落とすこと',
                misses: 'だが同じチャットの中では訂正は役立つ。モデルが今見ている文脈の中にあるからだ。',
                bridge: '現在の文脈では訂正はちゃんと働く。',
            },
            everyoneGetsIt: {
                title: 'すべてのユーザーが今、訂正された答えを受け取る',
                desc: 'あなたの訂正が全員のためにモデルを更新する。',
                statusLabel: '部分的に正しい',
                getsRight: 'フィードバックが将来の改善につながることがあるのは本当だ。',
                missesLabel: '見落とすこと',
                misses: 'だがそれは別のプロセスで、遅く、製品に依存する。一つの訂正が、すべてのユーザー向けにモデルを即座に更新することはない。',
                bridge: '全員のための改善は別のプロセスで、即座ではない。',
            },
        },
    },

    insight: {
        title: 'この章の要点',
        lead: 'ややこしいのは、訂正がチャットの中では実際に効くことだ。',
        body: 'モデルはより良く答え、学んだように感じる。だがたいていの場合、起きたことはもっと単純だ。訂正が、モデルが今見ている文脈に入ったのだ。それは必ずしもモデル自体が変わったという意味ではない。',
    },

    misconception: {
        wrongLabel: 'よくある誤解',
        wrongQuote: '「一度直したから、もう分かっている。」',
        rightLabel: '実際の仕組み',
        rightBody: '訂正は会話の文脈の中にある間は役立つ。新しいチャットでは、製品が記憶を保持するか、情報を再び渡さない限り、そこにあると決めつけないこと。モデルの持続的な変更には、チャットの一つのメッセージではなく、訓練や更新という別のプロセスが必要だ。',
    },

    lock: {
        title: '理解度チェック',
        question: '一つのチャットでモデルを訂正した：「情報源がなければ到着予定を書かない」。それから新しいチャットを開いた。最も安全な前提は？',
        options: [
            '基盤モデルはあなたの規則を永久に学んだ。',
            '記憶か文脈が提供しない限り、新しいチャットは訂正を含まないかもしれない。',
            'すべてのユーザーが今、訂正された振る舞いを受け取る。',
            '訂正はまったく役立たなかった。',
        ],
        success:
            '文脈・記憶・訓練は別々の層だ。新しいチャットは前の文脈なしで始まるので、規則が大事ならもう一度渡すか、製品の記憶を使う。見えない学習に頼らないこと。',
    },

    practical: {
        title: '実践的な要点',
        lead:
            '正確さが大事なときは「モデルはもう知っている」に頼らない。代わりにこう狙う：',
        uses: [
            '大事な規則や情報源を、モデルが覚えていると仮定せず、新しいチャットごとにもう一度渡す。',
            '規則を明示的に書く。例：「情報源がなければ到着予定を作らない。追跡に予定がなければ、確定した予定はないと書く。」',
            '製品が記憶や保存された設定を提供するなら、繰り返すべきことにそれを使う。',
            '変更のたびに、振る舞いが本当に良くなったかをもう一度確かめる。',
        ],
        caveat:
            '事実が大事なら、情報源・規則・保存された文脈を明示的に渡し、モデルが「覚えている」ことに頼らないこと。記憶・履歴・保持は別のもので、製品と設定によって異なる。',
    },

    finalExamCta: {
        title: 'コースの最終試験の準備はできた？',
        body: 'ここまで見てきたすべてを、入力から責任ある判断まで振り返る総まとめ試験。いつでも戻れて、進捗は保存される。',
        button: 'コースの最終試験へ進む',
    },

    lab: doesAiLearnLab,
    quiz: doesAiLearnQuiz,
};
