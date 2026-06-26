// i18n/locales/ja/catalog.ts
// Japanese catalog strings (concise, card-length aware). Source shape: ../he/catalog.
import { catalog as heCatalog } from '../he/catalog';

export const catalog: typeof heCatalog = {
    badge: 'Core Foundations v1.0',
    heroTitle: 'AI を支える工学のコア',
    tagline: 'まず直感、それから数式。',
    builtBy: '制作',
    authorName: 'トメル・ケデム',
    startLearning: '学習を始める',

    cards: {
        python: {
            title: '開発者のための実践 Python',
            description: 'スクリプトの作成から、安定して本番運用できる AI システムの設計へ。',
        },
        mathIntuitive: {
            title: 'AI のための直感的な数学',
            description: '埋め込み（Embeddings）という「ブラックボックス」を理解するための直感を養う。',
        },
        mathProbabilistic: {
            title: 'AI のための確率的思考',
            description: '最適化と勾配降下法を動かすロジックを身につける。',
        },
        'behind-the-scenes-ai': {
            title: 'AI の舞台裏',
            description: 'チャットやエージェントに入力したとき、実際に何が起きるのか。テキストから確率、判断、そして行動まで。',
        },
    },
};
