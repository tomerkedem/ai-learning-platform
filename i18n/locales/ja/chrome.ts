// i18n/locales/ja/chrome.ts
// Japanese chrome strings. Source shape: ../he/chrome.
import { chrome as heChrome } from '../he/chrome';

export const chrome: typeof heChrome = {
    backToCatalog: 'コースカタログに戻る',
    tableOfContents: '目次',
    courseProgress: 'コースの進捗',
    authorName: 'トメル・ケデム',
    authorRole: 'コース作成者',
    intro: 'はじめに',

    header: {
        readTime: '読了時間',
        progress: '進捗',
    },

    nav: {
        next: '次へ',
        prev: '前へ',
        finishedTitle: 'すべての章を修了しました！',
        finishedSub: 'お見事です。最後までたどり着きました。',
    },

    focus: {
        toggleTitle: 'ナビゲーションを隠して学習エリアを広げる',
        enter: '集中モード',
        exit: '集中モードを終了',
        activeBadge: '集中モード オン',
        press: '',
        toExit: 'で終了',
    },

    footer: {
        defaultLabel: 'AI 開発者のためのインタラクティブコース',
        copyright: '© 2026 トメル・ケデム. 無断複製を禁じます。',
    },

    assessment: {
        start: 'テストを始める',
        mentorStart: '準備はいい？どれだけ身についたか見てみよう',
        questionsLabel: '問題数',
        recommendedTimeLabel: '推奨時間',
        recommendedTime: (min) => `${min}分`,
        submit: 'テストを終える',
        completed: 'テスト終了！',
        next: '次の章へ進む',
        review: '短い復習に戻る',
        mentorPassHigh: '見事、完全に理解しています！',
        mentorPass: 'いいね、合格です！',
        mentorFail: 'まだ合格ではありません。弱いところを復習して、もう一度試しましょう。',
        failNote: '自信を持って先へ進むには、理解がまだ足りません。弱いところを復習して、もう一度試しましょう。',
        correctSummary: (correct, total) => `${total}問中${correct}問正解`,
        timeLabel: '時間',
        strongConcepts: '得意なところ',
        weakConcepts: '強化したいところ',
        recommendedReview: 'おすすめの復習',
        reviewAnswers: '解答を確認する',
        retry: 'もう一度',
        tiers: [
            { label: '見事！', sub: '内容を完全に習得' },
            { label: 'とても良い', sub: 'とても良い理解' },
            { label: 'もう少し', sub: '合格ラインの近く' },
            { label: 'まだ合格していません', sub: '合格ラインの下' },
        ],
        questionCounter: (current, total) => `問題 ${current} / ${total}`,
        streak: (n) => `${n}連続`,
        mute: '音を消す',
        unmute: '音を出す',
        prev: '前へ',
        continue: '次へ',
    },
};
