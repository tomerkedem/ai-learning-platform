// i18n/locales/ja/behind-ai/chapter1Visuals.ts
// Active visual copy for the canonical Transparent Chat and its conditional task-system preview.
// No em dash (U+2014) and no en dash (U+2013).

import type { Locale } from '@/i18n/config';

export const chapter1Visuals = {
    contentLocale: 'ja' as Locale,

    // GlassEnginePanel: inner labels
    enginePanel: {
        stationNavLabel: '駅のナビゲーション', previousStation: '前の駅', nextStation: '次の駅', replayStation: '現在の駅を再生', resetJourney: '経路をリセット',
        currentStationLabel: '現在の駅', completedStationLabel: '完了した駅', inputLabel: '入力', transformationLabel: '変換', outputLabel: '出力', conclusionLabel: '学習の結論', limitationLabel: 'イラストの限界',
        productEnvelope: { visibleRequest: '見える利用者の依頼', systemInstruction: '製品が追加したシステム指示', selectedContext: '選択した現在の文脈', modelInput: '現在のモデル入力', insideWindow: '現在のウィンドウ内', omitted: '現在の入力に含まれないもの', systemInstructionExample: '音楽の再生に関する質問に日本語で簡潔に答えてください。', selectedContextExample: '選択した文脈: 音楽アプリのサポート。外部の再生データはありません。', omittedExample: '選ばれていない履歴、製品のメモリ、検索、ツール。' },
        matrix: { token: 'トークン', id: 'ID', embedding: 'embeddingの抜粋', position: '位置', positionAware: '位置を含む表現', attention: 'Attention後', feedForward: 'feed-forward後', checkpoint: 'チェックポイント', predictionPosition: '予測位置' },
        scores: { candidate: '候補トークン', logit: '生のlogit', total: '合計', greedy: 'Greedy', sampling: 'Sampling', selectedToken: '選ばれたトークン' },
        generation: { step: '生成ステップ', appended: 'トークンを追加', updatedContext: '文脈を更新', nextDistribution: '次ステップの分布', stop: '停止条件' },
        agent: { authorization: 'システムの認可', authorized: '認可済み', unauthorized: '未認可', humanApproval: '人による承認', approvalRequired: '承認が必要', approvalGranted: '承認済み', approvalDenied: '承認を拒否', toolNotRun: 'ツールは呼ばれていません', mcpOptional: 'MCPは接続方法の一つであり必須ではありません' },
    },

    // "Sentence Journey" (Chat mode) strings.
    journey: {
        zones: {
            A: 'テキストから処理単位へ',
            B: 'トークンから表現へ',
            C: '文脈の計算',
            D: '表現から答えへ',
        },
        pauseTag: '止まって尋ねる',
        stations: {
            s1: { title: '製品がモデル入力を組み立てる', note: '見える依頼が製品に入り、システム指示と選択した文脈が加わります。', input: '見える利用者の依頼。', transformation: '製品が台本化したシステム指示と選択した現在の文脈を加えます。', output: '現在のモデル入力を示す簡潔な枠。', conclusion: 'チャットに見えるものがモデル入力の全部とは限りません。', limitation: 'メモリ、検索、ツールはこの既定経路に含まれません。' },
            s2: { title: 'トークンに分割', note: '完全な入力が順序付きトークンに分かれます。トークンは単語とは限りません。', input: '製品が組み立てた現在のモデル入力。', transformation: '台本化したtokenizer例が、表示された句読点や先頭空白を含む境界を保ちます。', output: '順序付きトークン列。', conclusion: 'トークンはモデルの処理単位であり、単語とは限りません。', limitation: '境界は学習用の台本で、ライブtokenizerの追跡ではありません。' },
            s3: { title: '各トークンにID', note: '各トークンが語彙内の安定した整数アドレスに対応します。', input: '順序付きトークン列。', transformation: '各トークンを一つのToken IDへ対応させます。', output: 'トークンとIDの表、順序付きID列。', conclusion: 'Token IDは語彙のアドレスであり意味ではありません。', limitation: '近いIDが近い意味を示すとは限らず、表示IDは台本化されています。' },
            s4: { title: 'Embeddingベクトル', note: '各Token IDが学習済みベクトルの行を選びます。ここでは短い抜粋だけを示します。', input: '順序付きToken IDs。', transformation: '各IDが学習済みembedding行列から一行を選びます。', output: 'トークン順に並ぶベクトル抜粋。', conclusion: 'Embeddingsは語彙項目に結び付く数値表現です。', limitation: '抜粋は台本化され、2D表示は合成投影であって完全なベクトルではありません。' },
            s5: { title: '位置と順序', note: '位置情報を各embeddingに組み合わせ、列の順序を保ちます。', input: 'Embeddingベクトル列。', transformation: '各トークン表現に位置情報を組み合わせます。', output: '位置を含む表現列。', conclusion: 'トークン順序は計算を変えます。', limitation: '位置情報の組み合わせ方はアーキテクチャで異なります。' },
            s6: { title: '文脈ウィンドウ', note: '現在使えるものと入力に含まれないものを示します。', input: '組み立てた入力と位置付き表現列。', transformation: '現在のウィンドウ内に入るものと省かれるものを示します。', output: '現在の生成ステップで使える文脈。', conclusion: '文脈ウィンドウはモデルが今使える材料です。', limitation: '保存履歴の全部ではなく、製品のメモリや保持を意味しません。' },
            s7: { title: '文脈へのAttention', note: '一つの層、head、宛先位置について合成の重み付き影響を示します。', input: '文脈内の位置表現。', transformation: '正規化した重みで送信元位置の影響を宛先位置に組み合わせます。', output: '強調位置の更新された文脈表現。', conclusion: '重みは文脈、位置、層、生成ステップで変わります。', limitation: 'Attention重みだけでモデル動作を完全には説明できません。' },
            s8: { title: 'Feed-forward処理', note: '同じfeed-forwardネットワークが各位置ベクトルを独立に変換します。', input: 'Attention後の表現列。', transformation: 'Feed-forwardネットワークが各位置の数値特徴を独立に変えます。', output: '更新された特徴抜粋が列へ戻ります。', conclusion: '各位置表現を変えますが、列全体を一つにまとめません。', limitation: '選んだexpertへトークンを送るのは一部のMoEモデルだけで、任意の発展内容です。' },
            s9: { title: '繰り返す層', note: 'Attentionとfeed-forwardが表現行列を繰り返し更新します。', input: '前の層の表現列。', transformation: '同じ種類の処理が層ごとに繰り返され、各チェックポイントで表現が更新されます。', output: 'Layer 1、Layer 2、最終層後の表現行列。', conclusion: '表現は層を通して更新され、精緻化されます。', limitation: '選んだ抜粋だけを示し、全層や全特徴は表示しません。' },
            s10: { title: '最終文脈表現', note: '各位置の表現が残り、予測位置のベクトルを出力headへ送ります。', input: '複数位置の最終文脈表現。', transformation: '予測位置を強調し、そのベクトルを出力headへ送ります。', output: '次トークンの採点に使うベクトル。', conclusion: '複数位置の表現が残り、一つの関連表現が次の採点に使われます。', limitation: '最終ベクトルの短い抜粋だけを示します。' },
            s11: { title: '生のLogits', note: '出力headが候補トークンへ正または負の生スコアを与えます。', input: '予測位置の最終表現。', transformation: '出力headが語彙の各トークンに生のlogitを計算します。', output: '固定順の小さな次トークン候補例。', conclusion: 'Logitsは生スコアであり百分率ではありません。', limitation: '真実、事実の確信、認可ではなく、大きな語彙の一部だけを示します。' },
            s12: { title: 'Softmax確率', note: 'Softmaxが同じlogitsを合計約1の分布に変えます。', input: '同じ候補順の表示logits。', transformation: 'Softmaxがスコアを指数化して正規化します。', output: '合計約1になる候補確率。', conclusion: 'Softmaxは分布を作りますがトークンを選びません。', limitation: '実モデルははるかに大きな語彙を採点し、表示値は台本化されています。' },
            s13: { title: 'Decodingがトークンを選ぶ', note: 'Greedyは最大値を選び、Samplingは別の候補を抽出する場合があります。', input: '確率分布と有効なDecoding戦略。', transformation: 'Greedyが先頭を選ぶか、Samplingが台本化された決定論的抽出を使います。', output: 'テキストに追加できる選択済みトークン。', conclusion: 'Decodingは分布からの選び方を決め、事実の正しさは決めません。', limitation: '再生で同じ結果になるよう抽出は固定されています。' },
            s14: { title: '生成ループ', note: 'トークンを追加し、文脈を更新すると次の分布が変わります。', input: '選んだトークンと現在の文脈。', transformation: 'トークンを追加して文脈を更新し、新しいスコアを計算して次を選ぶか停止条件に達します。', output: '見える二つの生成ステップとチャットに表示する台本回答断片。', conclusion: '回答はトークンごとに作られ、追加のたびにスコアが変わりえます。', limitation: '実装はゼロから始めず計算済み状態を再利用できます。このイラストは台本化されています。' },
        },
        agent: {
            zones: {
                understand: 'タスクの理解',
                tools: '任意のツール',
                control: '制御と承認',
                exec: '実行とループ',
                output: '出力',
            },
            stations: {
                a1: { title: 'リクエストが入る', note: '頼んだタスク。ここからエージェントのラウンドが始まります。' },
                a2: { title: '考えられるタスクの特定', note: 'システムは依頼と文脈からタスク候補を推定し、意図を直接知るわけではありません。' },
                a3: { title: '使えるツール', note: '製品はプレイリストの検索や削除など許可されたツールを公開できます。MCP は選択可能なプロトコルの一つで、必須ではありません。' },
                a4: { title: '条件付き計画', note: 'ツールが役立ち必要情報がある場合だけ、許可されたツールを検討します。' },
                a5: { title: '不足情報の確認', note: '実行に足りない情報がある?エージェントは推測せず、止まって尋ねます。' },
                a6: { title: '認可と承認', note: 'システム認可がアクセスを制御し、人の承認は機微な外部操作前の別の門です。' },
                a7: { title: '条件付きツール呼び出し', note: '情報、認可、承認がそろった場合だけツールを呼びます。MCPは接続方法の一つにすぎません。' },
                a8: { title: '実行時だけ観測', note: 'Observationは実際のツール呼び出し後だけ現れ、結果またはエラーです。呼び出しなしなら観測もありません。' },
                a9: { title: '条件付きループ', note: '実際の観測後、続行、質問、停止、完了を選べます。' },
                a10: { title: '回答、操作、停止', note: '回答、情報や承認の依頼、認可済み操作、または停止を行います。' },
            },
            toolNames: ['プレイリストの検索', 'プレイリストの削除'],
            mcp: 'MCP (任意)',
            observation: 'ツール呼び出し後の例: プレイリストの詳細を受信',
            missingOn: '識別子がない(Playlist ID)',
            missingOff: '必要な情報はそろっている',
            loopNodes: ['計画', 'ツール呼び出し', '観測', '推論'],
            loopOutcomes: ['続ける', '尋ねる', '止める', '終える'],
            agentNode: 'エージェント',
            resultLabel: '結果',
            gate: {
                safe: '安全な回答',
                ask: '情報を尋ねる',
                approve: '承認が必要',
                stop: '停止',
            },
        },
    },

    // engineTrace: station names, titles, captions and labels
    trace: {
        labels: {
            task: {
                'Delete a playlist': 'プレイリストの削除',
                'Look up a playlist': 'プレイリストの検索',
                'Unclear task': '不明確なタスク',
                'General request': '一般的な依頼',
            },
            decision: {
                'Stop for approval': '承認のため停止',
                'Use the Playlist API': 'プレイリストツールを使う',
                'Use the Playlist deletion tool': 'プレイリスト削除ツールを使う',
                'Ask for the Playlist ID before acting': '行動前にPlaylist IDを尋ねる',
                'Ask what to handle': '何を扱うか尋ねる',
                'Answer directly': '直接答える',
            },
        },
    },

    // mockEngine: demo replies (resolved by the replyKey the engine returns)
    mockEngine: {
        chatReplies: {
            notDelivered: '再生の問題のようです。接続を確認してもう一度再生してみるとよいでしょう。',
            tracking: '今流れている曲を確認できます。確認しましょうか?',
            system: 'アプリの不具合かもしれません。閉じてもう一度開いてみてください。',
            payment: 'ご依頼に合う音楽のおすすめをいくつか紹介します。',
            other: '正確に理解できているか自信がありません。問題を詳しく教えていただけますか?',
        },
        agentReplies: {
            sensitive: 'これはプレイリストを削除する行動です。確認と承認なしには実行しません - 承認用の下書きを用意できます。',
            tool: 'Playlist IDがあります。プレイリストツールで詳細を確認しています...',
            askBarcode: '実際に確認するには、Playlist IDが必要です。',
            vague: '何を指しているのか理解する必要があります - どのタスクやプレイリストを確認しますか?',
            general: '一般的な依頼のようです。外部ツールなしで直接お答えできます。',
        },
    },
};
