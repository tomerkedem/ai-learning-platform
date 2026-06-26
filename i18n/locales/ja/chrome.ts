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
};
