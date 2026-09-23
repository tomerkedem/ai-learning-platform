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

import type { Chapter3LabContent } from '@/app/(course)/behind-the-scenes-ai/chapter-3/labContent';

export const chapter3Lab: Chapter3LabContent = {
    modeLabel: 'モード:',

    splitter: {
        hint: '文章を入力すると、リアルタイムでトークンに分かれます。',
        placeholder: '例：洗濯物が乾きませんでした',
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
        deliveryFailure: { label: '否定のサイン', en: 'Negation signal' },
        sortingCenter: { label: 'コーヒーカップ', en: 'Coffee cup phrase' },
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
            { word: '花火', whole: ['花火'], units: ['花', '火'], roleLabel: '複合語', roleEn: 'Compound', note: '一つに見える言葉でも、「花」と「火」の二つの単位になりえます。' },
            { word: '朝ご飯', whole: ['朝ご飯'], units: ['朝', 'ご飯'], roleLabel: '複合語', roleEn: 'Compound', note: '「朝」と「ご飯」の二つの単位に分かれることがあります。' },
            { word: '食べました', whole: ['食べました'], units: ['食べ', 'ました'], roleLabel: '語幹と語尾', roleEn: 'Stem and ending', note: '語幹「食べ」と語尾「ました」が別の単位になりえます。' },
            { word: '食べませんでした', whole: ['食べませんでした'], units: ['食べ', 'ませんでした'], roleLabel: '語幹と語尾', roleEn: 'Stem and ending', note: '長い述語も、語幹と語尾のような複数の単位に分かれます。' },
            { word: 'お天気', whole: ['お天気'], units: ['お', '天気'], roleLabel: '接頭辞', roleEn: 'Prefix', note: '丁寧の接頭辞「お」が「天気」から分かれることがあります。' },
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
            id: 'chat-basics',
            mode: 'chat',
            labelHe: 'Chat モード',
            labelEn: 'Chat mode',
            prompt: '洗濯物が乾きませんでした',
            accent: 'emerald',
            routeHe: '答えを組み立てる',
            routeEn: 'Build answer',
            examples: [
                { labelHe: '基本', labelEn: 'Base', text: '洗濯物が乾きませんでした' },
                { labelHe: '質問として', labelEn: 'With question', text: '洗濯物が乾きませんでしたか？' },
                { labelHe: '強調', labelEn: 'With emphasis', text: '洗濯物が乾きませんでした！！！' },
                { labelHe: 'レシピの分量', labelEn: 'Recipe quantity', text: 'レシピには小麦粉250グラムが必要です' },
                { labelHe: '英語で（対比）', labelEn: 'In English', text: 'The laundry did not dry' },
                { labelHe: '訂正', labelEn: 'Correction', text: 'クッキーではなくケーキを焼きました' },
            ],
        },
        {
            id: 'agent-check',
            mode: 'agent',
            labelHe: 'Agent モード',
            labelEn: 'Agent mode',
            prompt: '猫が帰ってこない理由を調べて',
            accent: 'purple',
            routeHe: 'タスクを理解する',
            routeEn: 'Understand task',
            examples: [
                { labelHe: '調査', labelEn: 'Investigation', text: '猫が帰ってこない理由を調べて' },
                { labelHe: '子供について', labelEn: 'To recipient', text: '子供の猫が帰ってこない理由を調べて' },
            ],
        },
    ],

    roleWords: {
        dry: 'action',
        dried: 'action',
        not: 'negation',
        return: 'action',
        returned: 'action',
        check: 'action-signal',
        Check: 'action-signal',
        cup: 'context',
        coffee: 'context',
        child: 'recipient',
    },

    roleInfo: {
        object: { label: '対象', en: 'Object', why: 'これは文章が話している相手です。ラベルは、文の残りを処理する前に、何についてかを示します。' },
        negation: { label: '否定', en: 'Negation', why: 'この言葉は文章の向きをひっくり返すことがあります。これがないと意味は反対になります。' },
        action: { label: '動作', en: 'Action', why: '対象に何が起きたか。動詞が実際の状態を決めます。' },
        'action-signal': { label: '動作のサイン', en: 'Action signal', why: 'この言葉は、入力を説明から実行の依頼へと変えます。流れ全体が変わります。' },
        context: { label: '文脈', en: 'Context / Location', why: '場所や文脈を加えて、絵をはっきりさせます。たとえばコーヒーを飲んだ場所です。' },
        system: { label: 'システム', en: 'System', why: '対象そのものではなく、より広いシステムを指します。同じ領域でも、向きは別です。' },
        recipient: { label: '受け取る人', en: 'Recipient', why: '動作を受ける相手。とくに実在の人が関わるときに大事です。' },
        'question-signal': { label: '疑問のサイン', en: 'Question signal', why: '疑問符はそれ自体が一つのトークンです。文章の形を、断定から質問へ変えます。' },
        'statement-signal': { label: '断定のサイン', en: 'Statement signal', why: '句点は、文の終わりを示す別のトークンです。記号も一つの処理単位として数えられます。' },
        number: { label: '数字', en: 'Number', why: '数字の並びはそれ自体が一つの単位です。たとえばレシピの分量は、ふつうの依頼を、正確で測れるものに変えます。' },
        noise: { label: 'ノイズ', en: 'Noise', why: '情報をほとんど加えない一般的な言葉。重みは低くても、やはりトークンになります。' },
        other: { label: '一般', en: 'Token', why: 'この学習用トークナイザーで特別な役割に割り当てられていない言葉。それでも処理単位として数えられます。' },
    },

    sortingCenter: { leads: ['コーヒー'], follow: 'カップ' },
    deliveryFailure: { first: 'not', second: 'eat' },
};
