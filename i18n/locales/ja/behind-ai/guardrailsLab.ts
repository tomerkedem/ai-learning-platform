// i18n/locales/ja/behind-ai/guardrailsLab.ts
//
// 第18章 (Guardrails) の「Guardrails Lab」の日本語 (ja, LTR) データ。
// ヘブライ語が真実の源であり、型 (GuardrailsLabContent) を定義する。
//
// 中心となる考え：まったく同じタスク「荷物を確認して、顧客に連絡して」が、五つの
// 違う行動につながり、各行動は制御の層を通る。足りない情報を尋ねる、許可される低リスクの
// 読み取り、用意されるだけの下書き、承認が必要な送信、遮断される禁じられたステータス変更。
//
// 完全に決定的：ランダム性なし、実際のモデル呼び出しなし、実際の追跡システムなし、実際の
// メッセージ送信なし、実際のステータス変更なし、隠れた思考連鎖なし。ここの例はすべて学習用の
// み。行動の順序は固定で、構造的なキーも固定。
//
// これはあとで母語話者が見直すための一次翻訳。
//
// 長いダッシュ (U+2014) と中ダッシュ (U+2013) は使わない。

import type { GuardrailsLabContent } from '../../he/behind-ai/guardrailsLab';

export const guardrailsLab: GuardrailsLabContent = {
    sectionEyebrow: 'Guardrails Lab',
    sectionTitle: '同じタスク、五つの行動、五つの決定',
    sectionIntro:
        'タスクは固定：「荷物を確認して、顧客に連絡して。」五つの行動を切り替えて、制御の層がそれぞれについて、続けるか、尋ねるか、下書きだけを用意するか、承認のために止まるか、遮断するかをどう決めるか見よう。',
    heading: '制御の層',
    kicker: 'Guardrails Lab',
    taskLabel: 'タスク',
    task: '荷物を確認して、顧客に連絡して。',
    actionSelectLabel: '行動を選ぶ',
    requestLabel: '要求された行動',
    riskLabel: 'リスクレベル',
    checksLabel: '制御チェック',
    outcomeLabel: 'システムの決定',
    mayLabel: 'エージェントがしてよいこと',
    mustNotLabel: 'エージェントがしてはいけないこと',
    auditLabel: '制御メモ',
    takeawayLabel: '結論',
    disclaimer:
        'ここの例はすべて学習用のみ。実際の追跡システムはなく、実際のメッセージ送信もなく、実際のステータス変更もない。目的は、リスクと権限がどう結果を決めるかを示すことであって、特定の製品を説明することではない。',
    sr: {
        actionGroup: '要求された行動の選択',
        actionDetail: '選択した行動の詳細と制御の決定',
    },
    actions: [
        {
            id: 'ask',
            actionType: 'ask',
            control: '足りない情報を求める',
            request: '追跡番号なしでタスクを始める。',
            riskTone: 'missing',
            riskLabel: '情報が足りない',
            outcomeTone: 'ask',
            outcomeLabel: '止まって尋ねる',
            checks: [
                { label: '必要な情報', state: 'fail', note: '追跡番号がなく、本当のステータスを確認できない。' },
                { label: 'リスクレベル', state: 'warn', note: 'いま何か行動すれば、推測に頼ることになる。' },
                { label: '権限', state: 'warn', note: '行動を決めるだけの情報がない。' },
            ],
            mayDo: 'ユーザーに追跡番号を尋ね、それから初めて続ける。',
            mustNot: '前に進むために追跡番号やステータスをでっち上げる。',
            auditNote: 'タスクは必要な入力なしには始められない。良いエージェントは推測せずに止まり、足りないものを求める。',
            takeaway: '重要な情報が足りない？止まって尋ねる、推測しない。',
        },
        {
            id: 'lookup',
            actionType: 'lookup',
            control: 'ステータスを確認する',
            request: '荷物の追跡ステータスを確認する。',
            riskTone: 'low',
            riskLabel: '低リスク',
            outcomeTone: 'allow',
            outcomeLabel: '許可',
            checks: [
                { label: '必要な情報', state: 'pass', note: '追跡番号がある。' },
                { label: 'リスクレベル', state: 'pass', note: '読み取りのみで、世界の何も変えない。' },
                { label: '権限', state: 'pass', note: '読み取りツールが利用でき、許可されている。' },
            ],
            result: {
                label: 'ツールの結果 (例)',
                rows: ['ステータス: 遅延', '到着予定: 利用不可'],
            },
            mayDo: 'ステータスを読み、ユーザーに示す。',
            mustNot: 'ステータスを変える、または結果に現れなかったことに頼る。',
            auditNote: '読み取りの行動は世界の何も変えない。ツールが利用でき許可されているとき、追加の承認なしに続けられる。',
            takeaway: '情報を読むのは最も安全な行動だ。何も変えない。',
        },
        {
            id: 'draft',
            actionType: 'draft',
            control: 'メッセージの下書きを書く',
            request: '遅延について顧客へのメッセージを下書きする。',
            riskTone: 'medium',
            riskLabel: '中リスク',
            outcomeTone: 'draft',
            outcomeLabel: '下書きのみ',
            checks: [
                { label: '必要な情報', state: 'pass', note: '情報源からのステータスがある。' },
                { label: 'リスクレベル', state: 'warn', note: 'メッセージは顧客に向けたものだが、まだ送信されていない。' },
                { label: '権限', state: 'warn', note: '下書きを用意することは許可されているが、送信は許可されていない。' },
            ],
            result: {
                label: '下書き (未送信)',
                rows: ['こんにちは、あなたの荷物を確認しました。追跡によると遅延しており、まだ確定した到着日はありません。新しい情報が入り次第、お知らせします。'],
            },
            mayDo: '下書きを用意し、確認のために示す。',
            mustNot: '承認なしに下書きを送信する。',
            auditNote: '下書きは送信より安全だ。下書きは人の確認の準備ができており、まだ何も顧客に出ていない。',
            takeaway: '下書きは送信より安全だ。何かが外に出る前なら直しやすい。',
        },
        {
            id: 'send',
            actionType: 'send',
            control: 'メッセージを送信する',
            request: '顧客にメッセージを送信する。',
            riskTone: 'high',
            riskLabel: '高リスク',
            outcomeTone: 'approval',
            outcomeLabel: '承認が必要',
            checks: [
                { label: '必要な情報', state: 'pass', note: '下書きの準備ができている。' },
                { label: 'リスクレベル', state: 'fail', note: '本当の顧客に向かう外部への行動。' },
                { label: '権限', state: 'warn', note: '実行の前に人の承認を必要とする。' },
            ],
            mayDo: '下書きを示し、送信の明確な承認を求める。',
            mustNot: '承認が与えられる前に送信する。',
            auditNote: '顧客に送信することは、取り消しにくい外部への行動だ。エージェントが送信できるときでさえ、承認のゲートで止まる。',
            takeaway: '外部の慎重を要する行動は、承認のゲートを通る。能力は許可ではない。',
        },
        {
            id: 'mark',
            actionType: 'mark',
            control: '配達済みにする',
            request: '情報源が遅延を示しているのに、荷物を配達済みにする。',
            riskTone: 'blocked',
            riskLabel: '遮断',
            outcomeTone: 'stop',
            outcomeLabel: '遮断',
            checks: [
                { label: '必要な情報', state: 'fail', note: '情報源は配達を裏づけておらず、ステータスは遅延だ。' },
                { label: 'リスクレベル', state: 'fail', note: '根拠なく公式の記録を変える。' },
                { label: '権限', state: 'fail', note: '禁じられた行動であり、承認があっても通らない。' },
            ],
            mayDo: '情報源に根拠がなければ配達済みにはできないと説明する。',
            mustNot: '公式のステータスを変える、または配達の証拠をでっち上げる。',
            auditNote: 'エージェントが説明できる行動でも、遮断されたままのものがある。根拠なく公式のステータスを変えることは、システム全体の信頼性を損なう。',
            takeaway: 'たとえ説明できても、単に実行しない行動がある。',
        },
    ],
};
