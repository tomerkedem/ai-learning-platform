import { fullTraceLab as en } from '../../en/behind-ai/fullTraceLab';
import type { FullTraceLabContent } from '../../he/behind-ai/fullTraceLab';

const copy: Record<string, [string, string, string]> = {
    context: ['コンテキストの組み立て', 'プロダクトが今使える情報を集める', '保存とモデル入力は別です。現在の文脈、履歴、保存メモリ、retentionを区別し、この例ではメモリを取得しません。'],
    'model-input': ['モデル入力', '組み立てたパッケージだけがモデルに入る', '教育用の簡略表現であり、実装形式はプロダクトごとに異なります。'],
    tokens: ['Tokens と IDs', 'テキストをトークンと識別子に変える', 'トークンは単語とは限らず、ID自体に意味はありません。'],
    representations: ['Embeddings', 'IDを変換可能な表現にする', 'ベクトルは文脈に応じて層で変換され、固定された意味の地図ではありません。'],
    'attention-context': ['Attention と window', '現在の窓の関係を動的に重み付けする', 'Attentionは永久順位ではなく、context windowは過去に保存された全情報ではありません。'],
    generation: ['Logits から生成', 'Softmaxが分布を作りdecodingが選ぶ', 'logits 2.0/1.0/0.0から0.665/0.245/0.090。選択トークンを追加し停止条件まで繰り返します。'],
    'grounding-choice': ['リスクとgrounding', '最新の根拠が必要か判断する', 'もっともらしい文でも根拠不足になり得ます。現在の配送状況にはツールを使い、単純な知識質問なら省略できます。'],
    'agent-tool': ['Agent とツール', 'Agentはモデルを囲むプロダクトシステム', 'モデルは構造化呼び出しを提案でき、アプリが利用可否と上限一回のretryを判断します。'],
    authorization: ['Authorization', 'アプリが権限とpolicyを確認する', '追跡の読み取りは許可、送信は別のapprovalが必要です。confidenceはどちらも上書きしません。'],
    'tool-result': ['ツール実行', '外部システムが観測可能な結果を返す', '123456789はdelayed、確定到着日はなし。外部根拠も不完全な場合があります。'],
    'draft-check': ['下書きと確認', 'groundedな下書きを誤り得るself-checkで確認', '日付の捏造、送信済みの主張、不確実性を確認しますが、真実の証明ではありません。'],
    approval: ['人の承認', '送信には明示的な確認が必要', '既定では送信しません。システムauthorizationと人のapprovalは別です。'],
    verification: ['実行と検証', '観測結果をユーザー目標と照合する', 'ツールacceptedだけでタスク完了とは限らず、正直な最終状態を表示します。'],
    offline: ['フィードバックと評価', '改善は後で別経路で行う', '全feedbackが使われるわけではなく、更新は別のheld-out事例で評価され、一会話で即時学習しません。'],
};

export const fullTraceLab: FullTraceLabContent = {
    ...en, sectionTitle: '1つの依頼、複数の層、検証できる結果', sectionIntro: '同じ荷物依頼をcontext、モデル、grounding、Agent、制御、模擬実行、検証まで追跡します。', heading: 'フルトレース', promptLabel: 'ユーザーの依頼', prompt: '荷物123456789の状況を確認し、顧客向け更新を作成してください。私の承認なしに送信しないでください。', disclosure: '台本化された教育シミュレーションです。実接続、実送信、隠れた思考連鎖の表示はありません。', variabilityNote: 'すべての依頼がmemory、RAG、tool、Agent、approval、self-check、offline改善を使うわけではありません。省略、反復、早期停止があり、構成も製品ごとに異なります。', layerHeading: '現在のレイヤー',
    layers: { model: { label: 'Model internal', description: 'モデル内部の計算' }, product: { label: 'Application or product', description: '組み立て、調整、task state' }, tool: { label: 'External system or tool', description: '定義された外部連携' }, human: { label: 'Human control', description: '明示的な人の判断' }, offline: { label: 'Offline improvement process', description: 'ライブ応答外の後工程' } }, statusLabels: { required: '主経路', optional: '任意', skipped: 'この例では省略', repeated: '反復あり', stop: '停止点' }, labels: { input: '入力', process: '変換または判断', output: '出力', details: '詳細', branchReason: '分岐理由', stopReason: '停止理由', stage: '段階', previous: '前へ', next: '次へ', reset: 'リセット', selectStage: '主要段階を選択', progress: (c, t) => `任意経路を含む ${t} 段階中 ${c}` },
    stages: en.stages.map((s) => { const c = copy[s.id]; const localized = c ? { ...s, tab: c[0], title: c[1], refresher: c[2], input: c[2], process: c[2], output: c[2], facts: undefined, details: undefined, branchReason: undefined, stopReason: undefined } : s; if (s.id === 'tokens') localized.details = { label: '短い例', items: ['「確認」→ ID 4812', '「荷物」→ ID 907', '番号は複数tokenになり得る', 'ID自体に意味はない'] }; if (s.id === 'representations') localized.details = { label: '短い表現', items: ['4812 → [0.2, −0.4, …]', '907 → [0.7, 0.1, …]', '層がベクトルを変換する'] }; if (s.id === 'generation') localized.details = { label: '唯一の数値例', items: ['2.0 / 1.0 / 0.0 はlogits', 'Softmax: 0.665 / 0.245 / 0.090', 'Softmaxは選択しない', 'Decodingが選びloopを繰り返す'] }; if (s.id === 'grounding-choice') localized.branchReason = '状態は変化するため根拠を取得しますが、モデルパラメータは変わりません。'; if (s.id === 'approval') localized.stopReason = 'ユーザーが送信前の承認を明示しました。'; if (s.id === 'verification') localized.branchReason = 'approvalがなければ実行を省略します。'; if (s.id === 'offline') localized.branchReason = 'ライブ応答とは別のoffline経路です。'; return localized; }),
    branches: { ...en.branches, title: 'シミュレーション分岐を試す', intro: '経路が継続、省略、停止する理由を確認します。', missingInfo: { label: '追跡番号がない', outcome: '捏造せずユーザーに質問。' }, knowledge: { label: '単純な知識質問', outcome: 'ツールとapprovalを省略可能。' }, toolNeeded: { label: '現在の配送状況', outcome: '変化するためツールが必要。' }, toolError: { label: 'ツールエラー', first: '試行1失敗。retryは残り1回。', retry: 'retry 1/1失敗。', exhausted: '上限到達: failed。' }, approval: { ...en.branches.approval, title: '教育用approval', pending: '待機中、未送信', deny: '送信を拒否', approve: '模擬送信を承認', denied: '拒否。実行なし。', approved: 'シミュレーションのみ承認。', accepted: 'acceptedを模擬', rejected: 'rejectedを模擬', verifyAccepted: 'acceptedを検証: 模擬success。', verifyRejected: 'rejectedを検証: failed。' }, restart: '分岐を戻す' }, sr: { stageGroup: '段階を選択', stageDetail: '現在の段階の詳細', branchGroup: '教育用分岐を選択' },
};
