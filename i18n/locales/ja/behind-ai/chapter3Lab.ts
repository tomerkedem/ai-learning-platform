// i18n/locales/ja/behind-ai/chapter3Lab.ts
// Japanese content for the chapter 3 tokenization lab (Chapter3LabContent).
// Shape source: app/behind-the-scenes-ai/chapter-3/labContent (HE_LAB_CONTENT is canonical).
//
// Plain data module (type-only imports). Wired through the client labContent registry,
// not the i18n dictionary.
//
// IMPORTANT (Japanese is space-free):
//  - No artificial spaces are inserted into Japanese examples.
//  - The sub-word lab uses curated Japanese examples (compounds, stem + ending, the
//    polite prefix お) to show that one visible text unit becomes several model units,
//    without relying on spaces.
//  - The educational whitespace tokenizer sees a space-free sentence as roughly one
//    unit; the noSpaceNote says so honestly and points to the sub-word lab. An English
//    example is included as a contrast that visibly splits into many tokens.
//
// Structural keys are NOT translated. English secondary captions stay English.
// No em dash (U+2014), no en dash (U+2013).

import type { Chapter3LabContent } from '@/app/behind-the-scenes-ai/chapter-3/labContent';

export const chapter3Lab: Chapter3LabContent = {
    modeLabel: 'モード:',

    splitter: {
        hint: '文章を入力すると、リアルタイムでトークンに分かれます。',
        placeholder: '例：荷物が届きませんでした',
        aria: 'トークン分割のための入力欄',
        quickLabel: 'クイック実験:',
        resetLabel: 'リセット',
    },

    stream: {
        title: 'トークンの流れ',
        titleEn: 'Token Stream',
        empty: '文章を入力すると、ここでトークンに分かれます。',
        hint: 'トークンをタップすると、その役割が見られます。',
        rail: {
            input: { label: '入力テキスト', en: 'Input Text' },
            tokenizer: { label: 'トークナイザー', en: 'Tokenizer' },
            stream: { label: 'トークンの流れ', en: 'Token Stream' },
        },
    },

    legend: {
        title: 'トークンの色マップ',
        titleEn: 'Token Color Map',
    },

    count: {
        title: 'トークン数',
        titleEn: 'Token Count',
        note: 'この数はあとでコンテキストウィンドウにつながります。モデルが一度に保持できるトークンの数です。ここでは考え方をまくだけです。',
    },

    roleCard: {
        closeAria: '役割カードを閉じる',
    },

    signals: {
        number: { label: '数字トークン', en: 'Number token' },
        action: { label: '動作のサイン', en: 'Action signal' },
        deliveryFailure: { label: '配送失敗のサイン', en: 'Delivery failure signal' },
        sortingCenter: { label: '仕分けセンター', en: 'Sorting center' },
    },

    noSpaceNote:
        '日本語には言葉のあいだに空白がありません。だからこの学習用ツールは、文をほぼ一つの単位として見ます。実際のモデルはそれでも複数の単位に分けます。下のサブワード・ラボがその様子を示します。',

    educational: {
        badge: 'Educational',
        note: 'これは学習用のトークナイザーで、商用モデルではありません。この段階は準備にすぎません。システムはまだ完全な確率を計算せず、答えも返しません。テキストを処理単位に分けるだけです。役割の色分けは学習の助けで、実際のモデルは言語的な役割ではなく統計で分けます。',
    },

    subword: {
        title: 'サブワード・ラボ',
        titleEn: 'Sub-word Lab',
        badge: '学習用の分割',
        hint: '一つに見える言葉でも、複数の単位に分かれることがあります。言葉をタップして確かめましょう。分けるほどトークンの数が増えます。',
        wordsLabel: '言葉:',
        tokensLabel: 'トークン:',
        splitAll: 'すべて分ける',
        mergeAll: 'すべてまとめる',
        splitHint: 'タップして分ける',
        mergeHint: 'タップしてまとめる',
        ariaWhole: 'ひとまとまり、タップして分ける',
        ariaSplit: '分割済み、タップしてまとめる',
        note: 'これは学習用の分割です。実際のトークナイザーは語の区切りではなく、大量のテキストから学んだサブワードの統計で分けます。ここでは、一つの言葉が複数の単位に分かれるという考え方を示しています。',
        splits: [
            { word: '荷物', whole: ['荷物'], units: ['荷', '物'], roleLabel: '複合語', roleEn: 'Compound', note: '一つに見える言葉でも、「荷」と「物」の二つの単位になりえます。' },
            { word: '追跡番号', whole: ['追跡番号'], units: ['追跡', '番号'], roleLabel: '複合語', roleEn: 'Compound', note: '「追跡」と「番号」の二つの単位に分かれることがあります。' },
            { word: '届きました', whole: ['届きました'], units: ['届き', 'ました'], roleLabel: '語幹と語尾', roleEn: 'Stem and ending', note: '語幹「届き」と語尾「ました」が別の単位になりえます。' },
            { word: '届きませんでした', whole: ['届きませんでした'], units: ['届き', 'ませんでした'], roleLabel: '語幹と語尾', roleEn: 'Stem and ending', note: '長い述語も、語幹と語尾のような複数の単位に分かれます。' },
            { word: 'お問い合わせ', whole: ['お問い合わせ'], units: ['お', '問い合わせ'], roleLabel: '接頭辞', roleEn: 'Prefix', note: '丁寧の接頭辞「お」が分かれることがあります。' },
        ],
    },

    roadmap: {
        title: 'エンジンのロードマップ',
        titleEn: 'From Text to Probabilities',
        note: '今はまだ最初の段階です。テキストがトークンになります。次の段階（トークンID、ベクトル）で、実際のモデルは統計的な計算を行います。この分割がなければ、道のりは始まりません。',
        steps: [
            { he: 'テキスト', en: 'Text', active: true },
            { he: 'トークン', en: 'Tokens', active: true },
            { he: 'トークンID', en: 'Token IDs', active: false },
            { he: 'ベクトル', en: 'Vectors', active: false },
            { he: '類似度', en: 'Similarity', active: false },
            { he: 'スコア', en: 'Scores', active: false },
            { he: '確率', en: 'Probabilities', active: false },
        ],
    },

    scenarios: [
        {
            id: 'chat-delivery',
            mode: 'chat',
            labelHe: 'Chat モード',
            labelEn: 'Chat mode',
            prompt: '荷物が届きませんでした',
            accent: 'emerald',
            routeHe: '答えを組み立てる',
            routeEn: 'Build answer',
            examples: [
                { labelHe: '基本', labelEn: 'Base', text: '荷物が届きませんでした' },
                { labelHe: '質問として', labelEn: 'With question', text: '荷物が届きませんでしたか？' },
                { labelHe: '強調', labelEn: 'With emphasis', text: '荷物が届きませんでした！！！' },
                { labelHe: '追跡番号', labelEn: 'Tracking number', text: '追跡番号は12345です' },
                { labelHe: '英語で（対比）', labelEn: 'In English', text: 'The package did not arrive 12345' },
                { labelHe: '訂正', labelEn: 'Correction', text: '靴ではなく本を注文しました' },
            ],
        },
        {
            id: 'agent-investigate',
            mode: 'agent',
            labelHe: 'Agent モード',
            labelEn: 'Agent mode',
            prompt: '荷物が届かない理由を調べて',
            accent: 'purple',
            routeHe: 'タスクを理解する',
            routeEn: 'Understand task',
            examples: [
                { labelHe: '調査', labelEn: 'Investigation', text: '荷物が届かない理由を調べて' },
                { labelHe: 'お客様について', labelEn: 'To recipient', text: 'お客様の荷物が届かない理由を調べて' },
            ],
        },
    ],

    roleWords: {
        package: 'object',
        not: 'negation',
        arrive: 'action',
        arrived: 'action',
        check: 'action-signal',
        Check: 'action-signal',
        tracking: 'context',
        customer: 'recipient',
    },

    roleInfo: {
        object: { label: '対象', en: 'Object', why: 'これは文章が話している相手です。ラベルは、文の残りを処理する前に、何についてかを示します。' },
        negation: { label: '否定', en: 'Negation', why: 'この言葉は文章の向きをひっくり返すことがあります。これがないと意味は反対になります。' },
        action: { label: '動作', en: 'Action', why: '対象に何が起きたか。動詞が実際の状態を決めます。' },
        'action-signal': { label: '動作のサイン', en: 'Action signal', why: 'この言葉は、入力を説明から実行の依頼へと変えます。流れ全体が変わります。' },
        context: { label: '文脈', en: 'Context / Location', why: '場所や文脈を加えて、絵をはっきりさせます。たとえば荷物が届くはずだった場所です。' },
        system: { label: 'システム', en: 'System', why: '荷物ではなく、システムそのものを指します。同じ領域でも、向きは別です。' },
        recipient: { label: '受け取る人', en: 'Recipient', why: '動作を受ける相手。とくに実在の人が関わるときに大事です。' },
        'question-signal': { label: '疑問のサイン', en: 'Question signal', why: '疑問符はそれ自体が一つのトークンです。文章の形を、断定から質問へ変えます。' },
        'statement-signal': { label: '断定のサイン', en: 'Statement signal', why: '句点は、文の終わりを示す別のトークンです。記号も一つの処理単位として数えられます。' },
        number: { label: '数字', en: 'Number', why: '数字の並びはそれ自体が一つの単位です。たとえば追跡番号は、ふつうの依頼を、確認できるものに変えます。' },
        noise: { label: 'ノイズ', en: 'Noise', why: '情報をほとんど加えない一般的な言葉。重みは低くても、やはりトークンになります。' },
        other: { label: '一般', en: 'Token', why: 'この学習用トークナイザーで特別な役割に割り当てられていない言葉。それでも処理単位として数えられます。' },
    },

    sortingCenter: { leads: ['仕分け'], follow: 'センター' },
    deliveryFailure: { first: 'not', second: 'arrive' },
};
