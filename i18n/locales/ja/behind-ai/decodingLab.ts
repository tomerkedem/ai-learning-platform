// i18n/locales/ja/behind-ai/decodingLab.ts
//
// 第9章(Decoding: 次のトークンを選ぶ)の「Decoding のラボ」データ。日本語(ja、LTR)。
// ヘブライ語が原文で、型(DecodingLabContent)を定義する。
//
// 中心となる考え: 確率はすでに存在し(第8章の話)、ここでは固定されている。学習者は選び
// 方(Decoding)だけを変える。保守的、バランス、開いた、の三つ。そして「別の選び方を
// 試す」を押すと、同じ分布から異なるトークンが選ばれうるようすを見られる。保守的な
// 選び方は最もありそうな候補にとどまり、開いた選び方は低い候補にも出番を与える。
//
// 選択は乱数ではない。各スタイルは固定の選択列を持ち、テストが安定したまま学習者は
// 多様さを見られる。確率も選択もすべて学習用の図解であり、モデルの実際の出力ではない。
// どのスタイルも、続きが世界で正しいかどうかは確かめない。
//
// これは日本語の初回訳であり、後でネイティブによるレビューを行う。
//
// ダッシュ(em/enダッシュ)は使わない。読点「、」句点「。」は使用可。

import type { DecodingLabContent } from '../../he/behind-ai/decodingLab';

export const decodingLab: DecodingLabContent = {
    sectionEyebrow: 'Decoding Lab',
    sectionTitle: '同じ分布、違う選び方。だれが選ばれる?',
    sectionIntro:
        'ここでは確率は固定で変わりません。選び方だけを変えて、「別の選び方を試す」を押しましょう。中心となる考え: 同じ分布でも、選び方が違えば、別のトークンが選ばれることがあります。保守的な選び方は最もありそうな候補にとどまり、開いた選び方は低い候補にも出番を与えます。',
    heading: '次のトークンを選ぶ',
    kicker: 'Decoding Lab',
    promptBase: 'あなたの荷物は...',
    promptLabel: '続きをつける文',
    distributionLabel: '固定された分布',
    probabilityLabel: '確率',
    styleLabel: '選び方を選ぶ',
    stabilityLabel: '安定',
    varietyLabel: '多様',
    selectedLabel: '選ばれたトークン',
    whyLabel: 'なぜ選ばれたか',
    replayButton: '別の選び方を試す',
    continuationNote:
        '続きはここでは、読みやすいようにひとまとまりの言い回しで示しています。実際にはモデルは次のトークンを一歩ずつ選びます。これは選択の図解であり、モデルの内部の正確な記録ではありません。',
    disclaimer:
        'ここでの確率と選択は学習用の図解であり、モデルの実際の出力ではありません。同じ分布から、選び方がだれを選ぶかを示すためのものです。どのスタイルも、続きが世界で正しいかどうかは確かめません。',
    sr: {
        styleGroup: '選び方の選択',
        replay: '同じ選び方で別の選択を表示する',
        distribution: '続きの確率分布',
    },
    continuations: [
        { id: 'delayed', label: '遅延した', prob: 52 },
        { id: 'pickup', label: '受け取り待ち', prob: 24 },
        { id: 'delivered', label: '配達された', prob: 16 },
        { id: 'lost', label: '紛失した', prob: 8 },
    ],
    styles: [
        {
            id: 'conservative',
            control: '保守的',
            summary: '最もありそうな候補にとどまる。予測しやすく安定した出力。',
            stability: 3,
            variety: 1,
            picks: ['delayed', 'delayed', 'delayed', 'delayed'],
            whenTop: '保守的な選び方は、ほぼいつも確率が最も高い候補にとどまります。だから出力は予測しやすく安定します。',
            whenLower: '別の候補に余地ができても、保守的な選び方は先頭の候補に戻る傾向があります。',
        },
        {
            id: 'balanced',
            control: 'バランス',
            summary: 'たいていありそうな候補の中から選び、少し多様さがある。',
            stability: 2,
            variety: 2,
            picks: ['delayed', 'pickup', 'delayed', 'delivered'],
            whenTop: 'バランスの選び方はたいていありそうな候補の中から選び、ここでは先頭が出ました。',
            whenLower: 'バランスの選び方は別のありそうな候補に出番を与えました。最も高くはないが、それでも近い候補です。',
        },
        {
            id: 'creative',
            control: '開いた',
            summary: '低い候補にも出番を与える。多様さが増え、安定は下がる。',
            stability: 1,
            variety: 3,
            picks: ['pickup', 'delayed', 'delivered', 'lost', 'delayed'],
            whenTop: '開いた選び方でも先頭の候補はやはり最もありそうなので、ときどき選ばれます。',
            whenLower: '開いた選び方は、よりありそうでない候補に出番を与えました。これは多様さを増しますが、それを正しくするわけではありません。',
        },
    ],
};
