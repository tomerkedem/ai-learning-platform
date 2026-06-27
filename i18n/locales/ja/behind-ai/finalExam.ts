// i18n/locales/ja/behind-ai/finalExam.ts
// Japanese final-exam chrome. Shape source: ../../he/behind-ai/finalExam.
//
// Display text only. Behavior (questions, passScore, onComplete, getReviewLinks)
// and the structural tier data (min/color) stay in quizData.ts. Tier order must
// stay identical to the Hebrew source, since label/sub overlay min/color by index.
// The course name matches the Japanese catalog title ("AI の舞台裏").
//
// No em dash (U+2014) and no en dash (U+2013) in this file.

export const finalExam = {
    backToChapter: '第16章に戻る',
    pageTitle: 'コース修了テスト',
    pageSubtitle:
        '「AI の舞台裏」の総まとめテストです。入力から責任ある判断まで、全体の流れと概念のつながりを確認します。いつでも戻ることができ、進捗はお使いの端末に保存されます。',

    examTitle: 'コース修了テスト: AI の舞台裏',
    examSubtitle: 'コース全体をまとめた18問、入力から責任ある判断まで。',
    startLabel: '修了テストを始める',
    submitLabel: '修了テストを終える',
    completedTitle: '修了テスト完了',
    reviewLabel: 'コースの最初に戻る',
    nextLabel: '完了: コースカタログに戻る',

    tiers: [
        { label: '優秀', sub: 'AI の内部の流れを理解し、説明できます' },
        { label: 'とても良い', sub: '主要な考え方は明確です。いくつかの点を復習するとよいでしょう' },
        { label: '部分的な理解', sub: '間違えた章を復習することをおすすめします' },
        { label: 'コースを復習しましょう', sub: '先に進む前に、もう一度内容を見直すとよいでしょう' },
    ],
};
