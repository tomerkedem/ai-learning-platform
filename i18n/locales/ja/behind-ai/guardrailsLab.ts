// i18n/locales/ja/behind-ai/guardrailsLab.ts
//
// 第18章 (Guardrails) の「Guardrails Lab」の日本語 (ja, LTR) データ。
// ヘブライ語が真実の源であり、型 (GuardrailsLabContent) を定義する。第17章
// (Chat to Agent) で始まった会議調整のシナリオを引き継ぐ。
//
// 中心となる考え：まったく同じ依頼「30分のプロジェクト計画会議を設定し、招待を送って
// ください」が、六つの違う行動につながり、各行動は制御の層を通る。足りない情報を尋ねる、
// 許可される低リスクの読み取り、用意されるだけの下書き、承認が必要な送信、確認された証拠
// なしに予約する禁じられた行動が遮断される、そして上限で止まる再試行。
//
// 完全に決定的：ランダム性なし、実際のモデル呼び出しなし、実際のカレンダーシステムなし、
// 実際の招待送信なし、実際の予約変更なし、隠れた思考連鎖なし。ここの例はすべて学習用のみ。
// 行動の順序は固定で、構造的なキーも固定。
//
// これはあとで母語話者が見直すための一次翻訳。
//
// 長いダッシュ (U+2014) と中ダッシュ (U+2013) は使わない。

import type { GuardrailsLabContent } from '../../he/behind-ai/guardrailsLab';

export const guardrailsLab: GuardrailsLabContent = {
    sectionEyebrow: 'Guardrails Lab',
    sectionTitle: '同じ依頼、六つの行動、六つの決定',
    sectionIntro:
        '依頼は固定：「30分のプロジェクト計画会議を設定し、招待を送ってください。」六つの行動を切り替えて、制御の層がそれぞれについて、続けるか、尋ねるか、下書きだけを用意するか、承認のために止まるか、遮断するか、再試行の上限で止まるかをどう決めるか見よう。',
    heading: '制御の層',
    kicker: 'Guardrails Lab',
    taskLabel: 'タスク',
    task: '30分のプロジェクト計画会議を設定し、招待を送ってください。',
    actionSelectLabel: '行動を選ぶ',
    requestLabel: '要求された行動',
    riskLabel: 'リスクレベル',
    checksLabel: '制御チェック',
    outcomeLabel: 'システムの決定',
    mayLabel: 'エージェントがしてよいこと',
    mustNotLabel: 'エージェントがしてはいけないこと',
    auditLabel: '制御メモ',
    verifyLabel: '結果の検証',
    takeawayLabel: '結論',
    disclaimer:
        'ここの例はすべて学習用のみ。カレンダーシステムへの実際の接続はなく、実際の招待送信もなく、実際の予約変更もない。目的は、リスクと権限がどう結果を決めるかを示すことであって、特定の製品を説明することではない。',
    sr: {
        actionGroup: '要求された行動の選択',
        actionDetail: '選択した行動の詳細と制御の決定',
    },
    actions: [
        {
            id: 'ask',
            actionType: 'ask',
            control: '足りない情報を求める',
            request: '会議の適した時間帯なしでタスクを始める。',
            riskTone: 'missing',
            riskLabel: '情報が足りない',
            outcomeTone: 'ask',
            outcomeLabel: '止まって尋ねる',
            checks: [
                { label: '必要な情報', state: 'fail', note: '適した時間帯がなく、本当の空き状況を確認できない。' },
                { label: 'リスクレベル', state: 'warn', note: 'いま何か行動すれば、推測に頼ることになる。' },
                { label: '権限', state: 'warn', note: '行動を決めるだけの情報がない。' },
            ],
            mayDo: 'ユーザーに適した時間帯を尋ね、それから初めて続ける。',
            mustNot: '前に進むために時間帯や空き状況をでっち上げる。',
            auditNote: 'タスクは必要な入力なしには始められない。良いエージェントは推測せずに止まり、足りないものを求める。',
            verification: 'まだ実行していない。不足する入力を待っている。',
            takeaway: '重要な情報が足りない？止まって尋ねる、推測しない。',
        },
        {
            id: 'lookup',
            actionType: 'lookup',
            control: '空き状況を確認する',
            request: '明日の午後、30分の会議のカレンダーの空き状況を確認する。',
            riskTone: 'low',
            riskLabel: '低リスク',
            outcomeTone: 'allow',
            outcomeLabel: '許可',
            checks: [
                { label: '必要な情報', state: 'pass', note: '時間帯は有効で明日の午後、参加者はすでに分かっている。' },
                { label: 'リスクレベル', state: 'pass', note: '読み取りのみで、世界の何も変えない。' },
                { label: '権限', state: 'pass', note: 'カレンダー照会ツールはこの主体にこのカレンダーで許可されている。' },
            ],
            result: {
                label: 'ツールの結果 (例)',
                rows: ['ステータス: 空き時間が見つかった', '適した時間: 15:00から15:30'],
            },
            mayDo: '空き状況を読み、ユーザーに示す。',
            mustNot: 'カレンダーの何かを変える、または結果に現れなかった時間に頼る。',
            auditNote: '読み取りの行動は世界の何も変えない。ツールが利用でき許可されているとき、追加の承認なしに続けられる。',
            verification: '出力は期待した形式で有効な状態を返した。許可されたことは、時間が確定したことを意味せず、期待した形式の結果が返ったことを意味するにすぎない。',
            takeaway: '情報を読むのは最も安全な行動だ。何も変えない。',
        },
        {
            id: 'draft',
            actionType: 'draft',
            control: '招待の下書きを書く',
            request: '15:00から15:30の枠の招待を下書きする。',
            riskTone: 'medium',
            riskLabel: '中リスク',
            outcomeTone: 'draft',
            outcomeLabel: '下書きのみ',
            checks: [
                { label: '必要な情報', state: 'pass', note: 'ツールが確認した時間が下書きに使える。' },
                { label: 'リスクレベル', state: 'warn', note: '招待は参加者に向けたものだが、まだ送信されていない。' },
                { label: '権限', state: 'warn', note: '下書きを用意することは許可されているが、送信は許可されていない。' },
            ],
            result: {
                label: '下書き (未送信)',
                rows: ['こんにちは、皆さん。カレンダーによると、明日の15:00から15:30が30分のプロジェクト計画会議に合います。招待を送る前に承認をいただけますか。'],
            },
            mayDo: '下書きを用意し、確認のために示す。',
            mustNot: '承認なしに下書きを送信する。',
            auditNote: '下書きは送信より安全だ。下書きは人の確認の準備ができており、まだ何も参加者に出ていない。',
            verification: '下書きは存在する。検証は時間が最終的であるとは主張せず、送信されたとも言わない。',
            takeaway: '下書きは送信より安全だ。何かが外に出る前なら直しやすい。',
        },
        {
            id: 'send',
            actionType: 'send',
            control: '招待を送信する',
            request: '15:00から15:30の枠の招待を、分かっている参加者に送信する。',
            riskTone: 'high',
            riskLabel: '高リスク',
            outcomeTone: 'approval',
            outcomeLabel: '承認が必要',
            checks: [
                { label: '必要な情報', state: 'pass', note: '下書きの準備ができている。' },
                { label: 'リスクレベル', state: 'fail', note: '本当の参加者に向かい、取り消しにくい外部への行動。' },
                { label: 'システム認可', state: 'pass', note: 'この主体は送信ツールを許可されている。' },
                { label: '人の承認', state: 'warn', note: '実行前に必要。認可と承認は別である。' },
            ],
            result: { label: '承認状態（招待は未送信）', rows: ['実行は待機する。承認が与えられるまで招待は送信されない。', '承認が与えられれば、送信を続けられる。', '拒否、取消し、期限切れなら停止し、招待は送られない。'] },
            mayDo: '下書きを示し、送信の明確な承認を求める。',
            mustNot: '承認が与えられる前に送信する、または承認がすでに得られたものとして扱う。',
            auditNote: '参加者に送信することは、取り消しにくい外部への行動だ。システムがツールを許可していても、実行は人の承認のゲートで待機する。',
            verification: '送信していないため保留中。行動の認可は、結果が起きたことを証明しない。',
            takeaway: '外部の慎重を要する行動は、承認のゲートを通る。システムの認可は、人の承認ではない。',
        },
        {
            id: 'mark',
            actionType: 'mark',
            control: '確定済みにする',
            request: 'カレンダーが空き状況を確認していないのに、会議を確定済み・予約済みにする。',
            riskTone: 'blocked',
            riskLabel: '遮断',
            outcomeTone: 'stop',
            outcomeLabel: '遮断',
            checks: [
                { label: '必要な情報', state: 'fail', note: 'ツールは空き状況を確認しておらず、予約の根拠がない。' },
                { label: 'ポリシー', state: 'fail', note: 'ツールが確認した時間なしに会議を予約する行動は遮断される。' },
                { label: '人の承認', state: 'fail', note: 'ポリシーの遮断は上書きできず、空き状況をでっち上げることもできない。' },
            ],
            mayDo: 'ツールが確認した空き状況がなければ予約済みにはできないと説明する。',
            mustNot: '会議を予約する、またはツールが返さなかった空き状況をでっち上げる。',
            auditNote: 'エージェントが説明できる行動でも、遮断されたままのものがある。確認された空き状況なしに予約することは、システム全体の信頼性を損なう。人の承認は、未検証の空き状況を事実に変えることはできない。',
            verification: '未実行のため、検証すべき結果がない。',
            takeaway: 'たとえ説明できても、単に実行しない行動がある。承認は証拠ではない。',
        },
        { id: 'limit', actionType: 'retry', control: '再試行上限', request: '空き時間が見つかるまでカレンダーの照会を繰り返す。', riskTone: 'limit', riskLabel: '再試行上限', outcomeTone: 'limit', outcomeLabel: '上限で停止', checks: [{ label: '入力検証', state: 'pass', note: '時間帯は有効で、呼び出し自体は正当だ。' }, { label: '再試行上限', state: 'fail', note: '上限は初回に加えて再試行一回、合計二回。どちらも時間を返さなかった。' }, { label: 'システム認可', state: 'pass', note: '読み取りは許可されても設定された上限は適用される。' }], result: { label: '試行の要約', rows: ['1回目 (2回中): エラー、サービスが利用できない。', '2回目 (2回中、再試行一回): 再びエラー、上限到達。'] }, mayDo: '停止し、許可された試行内で時間を検証できなかったと正直に報告する。', mustNot: '無制限に再試行したり、時間が見つかったと報告したりしない。', auditNote: '上限は繰り返し実行を安全に止める。', verification: '有効な検証済み結果はない。上限到達は成功ではない。', takeaway: '上限は実行を止め、理由を見えるようにする。' },
    ],
};
