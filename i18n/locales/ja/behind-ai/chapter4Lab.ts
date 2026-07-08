// i18n/locales/ja/behind-ai/chapter4Lab.ts
// 第4章 Embeddings ラボの日本語コンテンツ（Chapter4LabDict）。
// 形のもと: app/behind-the-scenes-ai/chapter-4/labContent（Chapter4LabDict が正本）。
//
// データモジュールのみ（型のみの import、ビルドで消える）。i18n 辞書ではなく、クライアント
// 側のラボコンテンツのレジストリ経由で読み込み、サーバ/クライアントの境界を保ちます。
//
// 構造キーは翻訳しません: sentence ids, chip ids, magnet ids, dim keys は安定。
// 日本語のトークンは手作業で明示的に定義し、空白では分割しません。日本語には単語間の
// 空白がないため、各トークンは学習用の意味のまとまりとして手で区切っています。
// 長いダッシュ（U+2014）や中ダッシュ（U+2013）は使いません。

import type { Chapter4LabDict } from '@/app/behind-the-scenes-ai/chapter-4/labContent';

export const chapter4Lab: Chapter4LabDict = {
    sentences: {
        'pkg-not-arrived': {
            text: '荷物が届かなかった',
            tokens: ['荷物', 'が', '届か', 'なかった'],
            ttsLine: '荷物が届かなかった。配送失敗の苦情で、失敗の方向に高い。',
            swaps: {
                'to-arrived': { label: '届いた', from: '届かなかった' },
            },
        },
        'delivery-not-handed': {
            text: '配送が完了しなかった',
            tokens: ['配送', 'が', '完了し', 'なかった'],
            ttsLine: '配送が完了しなかった。まったく違う単語だが、意味の方向は同じ。',
        },
        'pkg-arrived': {
            text: '荷物が届いた',
            tokens: ['荷物', 'が', '届いた'],
            ttsLine: '荷物が届いた。同じ配送の領域だが失敗はなく、だから点が動く。',
        },
        'system-not-showing': {
            text: 'システムが荷物を表示しない',
            tokens: ['システム', 'が', '荷物', 'を', '表示し', 'ない'],
            ttsLine: 'システムが荷物を表示しない。配送の問題ではなくシステムの不具合。',
        },
        'billing-address-update': {
            text: '請求先住所を更新した',
            tokens: ['請求先', '住所', 'を', '更新し', 'た'],
            ttsLine: '請求先住所を更新した。配送から遠い話題で、だから地図の遠くに落ちる。',
        },
        'agent-investigate-delay': {
            text: 'なぜ荷物が届かなかったか調べて',
            tokens: ['なぜ', '荷物', 'が', '届か', 'なかった', 'か', '調べて'],
            ttsLine: 'なぜ荷物が届かなかったか調べて。安全な調査の依頼で、リスクは低い。',
        },
        'agent-notify-lost': {
            text: '荷物が紛失したと顧客に連絡して',
            tokens: ['荷物', 'が', '紛失し', 'た', 'と', '顧客', 'に', '連絡して'],
            ttsLine: '荷物が紛失したと顧客に連絡して。顧客への行動で、承認が必要。',
        },
    },

    map: {
        closestTag: '最も近い',
        honest: 'Embedding は意味の比較に役立ちます。実際に何が起きたかは証明しません。',

        visualTitle: 'まず単純な近さ',
        visualSubtitle: '意味が似たものほど近くに現れます。オブジェクトを選んで、何が一番近いか見てみましょう。',
        ruleLine: '意味が似たものほど近くに位置します。',
        objects: {
            dog: '犬',
            cat: '猫',
            apple: 'りんご',
            cucumber: 'きゅうり',
            computer: 'コンピュータ',
        },
        objectExplain: {
            dog: '犬と猫は近い。どちらも動物だから。',
            cat: '犬と猫は近い。どちらも動物だから。',
            apple: 'りんごときゅうりは近い。どちらも食べ物だから。',
            cucumber: 'りんごときゅうりは近い。どちらも食べ物だから。',
            computer: 'コンピュータは遠い。技術の世界に属するから。',
        },
        objectSelected: '選んだオブジェクト',
        objectClosest: '最も近い',
        objectNoClose: 'ほかから遠い',
        numericTitle: '数値表現',
        numericNote: '意味が似た物は似た数値を得るので、地図上で近くに座ります。ランダムなベクトルはそれらをまとめません。',
        numericDisclaimer: '数値は説明のためのものです。実際の空間には人間には読めない数百の次元があります。',

        packageTitle: '文どうしの意味の近さ',
        packageSubtitle: '違う文でも、似た考えを説明していれば近くなり得ます。',
        centerLabel: '選んだ文',
        closestLabel: '意味で最も近い',
        packageRule: 'モデルは同じ単語だけを探すのではありません。意味の近さを比べます。',
        cards: {
            'pkg-not-arrived': { shortLabel: '届かなかった', chips: ['配送の問題', '荷物の状態'] },
            'delivery-not-handed': { shortLabel: '完了しなかった', chips: ['配送の問題', '荷物の状態'] },
            'pkg-arrived': { shortLabel: '届いた', chips: ['荷物の状態'] },
            'system-not-showing': { shortLabel: '表示されない', chips: ['荷物の状態'] },
            'billing-address-update': { shortLabel: '請求先住所', chips: ['支払い'] },
            'agent-investigate-delay': { shortLabel: '状態の確認', chips: ['問い合わせ', '荷物の状態'] },
            'agent-notify-lost': { shortLabel: '荷物が紛失', chips: ['行動', '例外'] },
        },

        proofTitle: '証明と説明',
        proofLead: '何が何に近いか見たあとは、なぜかが見えます。どの意味の要素が共通か、どんな力が表現を形づくったか。',

        relationTitle: '何が何に近い？',
        coreRule: '近いほど意味が似ている。遠いほど似ていない。',
        relClosest: '最も近い',
        relRelated: '関連するが別',
        relFar: 'より遠い',
        objectRows: [
            { pair: '犬は猫に近い', reason: 'どちらも動物だから。' },
            { pair: 'りんごはきゅうりに近い', reason: 'どちらも食べ物だから。' },
            { pair: 'コンピュータはそれらから遠い', reason: '技術の世界に属するから。' },
        ],
        relations: {
            'pkg-not-arrived': {
                closestId: 'delivery-not-handed',
                relatedId: 'agent-notify-lost',
                farId: 'billing-address-update',
                reasonClosest: 'どちらも配送の問題を説明している。',
                reasonRelated: 'まだ荷物の問題に関連するが、これはそれに続く行動。',
                reasonFar: '配送の問題ではなく支払いの詳細に関わる。',
            },
            'delivery-not-handed': {
                closestId: 'pkg-not-arrived',
                relatedId: 'agent-notify-lost',
                farId: 'billing-address-update',
                reasonClosest: 'どちらも配送の問題を説明している。',
                reasonRelated: '同じ問題に関連するが、これは顧客への行動。',
                reasonFar: '配送ではなく支払いの詳細に関わる。',
            },
            'pkg-arrived': {
                closestId: 'delivery-not-handed',
                relatedId: 'agent-investigate-delay',
                farId: 'billing-address-update',
                reasonClosest: '同じ荷物配送の世界。',
                reasonRelated: '同じ領域だが、状態の説明ではなく確認の依頼。',
                reasonFar: '支払いに関わる、まったく別の話題。',
            },
            'system-not-showing': {
                closestId: 'pkg-not-arrived',
                relatedId: 'agent-investigate-delay',
                farId: 'billing-address-update',
                reasonClosest: 'どちらも何か問題のある荷物について。',
                reasonRelated: '関連するが、これは確認する行動の依頼。',
                reasonFar: '荷物の問題ではなく支払いに関わる。',
            },
            'billing-address-update': {
                closestId: 'system-not-showing',
                relatedId: 'pkg-not-arrived',
                farId: 'agent-notify-lost',
                reasonClosest: 'どちらも配送そのものではなくシステム内の詳細に関わる。',
                reasonRelated: 'これも配送だが、支払いではなく配送の問題。',
                reasonFar: 'これは紛失した荷物についての顧客への行動で、支払いから遠い。',
            },
            'agent-investigate-delay': {
                closestId: 'pkg-not-arrived',
                relatedId: 'agent-notify-lost',
                farId: 'billing-address-update',
                reasonClosest: 'どちらも届かなかった荷物について、ここでは確認の依頼として。',
                reasonRelated: 'どちらも行動だが、これは顧客に知らせる。',
                reasonFar: '配送の確認ではなく支払いに関わる。',
            },
            'agent-notify-lost': {
                closestId: 'agent-investigate-delay',
                relatedId: 'pkg-not-arrived',
                farId: 'billing-address-update',
                reasonClosest: 'どちらも問題のある荷物をめぐる行動。',
                reasonRelated: '問題そのものに関連するが、これは問題の説明にすぎず行動ではない。',
                reasonFar: '支払いに関わる、別の話題。',
            },
        },
        howto: {
            title: '表示の読み方？',
            rowPoint: 'カード = 文',
            rowClose: '近い = 似た意味',
            rowFar: '遠い = 似ていない',
            rowSwap: '単語を入れ替えると近づいたり遠ざかったり',
            legendWhy: 'なぜ近い、または遠い？ 意味の DNA と意味の力を見てください。',
        },
    },

    magnets: {
        delivery: '配送',
        delay: '遅延',
        complaint: '苦情',
        tracking: '追跡',
        refund: '返金',
        risk: 'リスク',
    },

    genes: {
        delivery: '配送',
        system: 'システム',
        address: '住所',
        payment: '支払い',
        urgency: '緊急度',
        failure: '失敗',
        action: '行動',
        risk: 'リスク',
        customer: '顧客',
        permission: '承認',
    },

    dna: {
        title: 'ベクトルの中の意味',
        intro: 'ベクトルは一つの数ではありません。モデルが学習した意味の要素のプロファイルです。一つひとつの横木が一つの意味の要素で、ノードの高さはその要素が文の中でどれだけ強いかを示します。',
        roleActive: '選んだ文',
        roleCompare: '比較',
        twistMeaning: '二つの文の意味が近いほど、二本の鎖はきつく絡み合います。意味がずれると、鎖は離れていきます。',
        leadShared: (names) => `二つの文は同じ意味の要素で強く反応します：${names}。だから近いのです。`,
        leadNone: '二つの文は別々の要素を活性化するので、より離れています。',
        sharedBadge: '共通',
        guideSize: 'ノードが大きいほど、その文でその要素が強いことを表します。',
        guideBond: '緑に脈打つ結合は共通の要素で、それが意味を近づけます。',
        stayedClose: '意味は近いまま',
        drifted: '意味がずれた',
        axesNote: 'ここでの軸は学習用のラベルです。実際のモデルでは、ベクトルは人間の特徴として読めない数百から数千の数値次元を持ちます。',
    },

    controls: {
        pickSentence: '文を選ぶ',
        swapTitle: '単語を入れ替えるとどうなる？',
        swapHint: '言い回しの小さな変化で、意味が近づいたり遠ざかったりします。',
        resetSwap: '元の文に戻す',
    },

    fallback: {
        missingSentence: 'コンテンツがありません',
    },

    ui: {
        magnetTitle: '意味の力',
    },

    explain: {
        title: 'クイックガイド',
        mapShadow: '地図は、もっと大きな意味空間の平らな影です。',
        close: '近い点はたいてい似た意味を表します。',
        far: '遠い点は間違いではなく、意味が少し似ていないだけです。',
        regions: '色付きの輪は意味の近所で、はっきりした境界ではありません。',
        forces: '意味の力は、どの信号が文をこの方向へ引き寄せたかを示します。',
        dna: '意味の DNA は、なぜ二つの文が近いかを証明します。同じ意味の要素が似た強さで光ります。',
        notTruth: 'Embedding は意味の比較に役立ちます。実際に何が起きたかは証明しません。',
    },
};
