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
    questionOverrides: {
        13: { question: '先頭の続きと表示された候補の間に大きな確率差があると、何が分かりますか。', options: ['見た目だけの飾りです', 'この分布内で先頭候補を強く好むという意味で、事実性、根拠、実行許可の証明ではありません', 'モデルが遅くなります', '回答そのものを置き換えます'], explanation: '大きな確率差は、表示された分布内での強い選好を示します。真実、Grounding、実行許可は証明しません。事実を信頼するには、適切な文脈、証拠、根拠付け、検証が必要です。' },
        17: { question: 'チャットで回答を訂正しました。その訂正が今後どう使われるかについて最も正確なのはどれですか。', options: ['短期記憶がすぐ満杯になります', '現在の文脈では影響し得ますが、新しいチャットには自動で入らず、製品が保存または取得する場合があり、それも即時のモデル学習ではありません', '他の利用者からだけ学びます', '訂正を意図的に無視します'], explanation: '訂正は現在の文脈で影響し得ます。製品はモデルのパラメータを変えずに情報を保存できます。後から prompts、規則、workflows、情報源、ツールを改善することもでき、モデル学習は別の工程です。1回の訂正で全体のモデルが即座に再学習することはありません。' },
    },
    backToChapter: '第19章に戻る',
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
