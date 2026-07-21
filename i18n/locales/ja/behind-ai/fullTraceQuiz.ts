import type { FullTraceQuizId,FullTraceQuizText } from '../../he/behind-ai/fullTraceQuiz';
export const fullTraceQuiz={title:'確認: フルトレース',subtitle:'5つの層について5問',startLabel:'開始',submitLabel:'終了',completedTitle:'完了',byId:{
1:{question:'実際にモデルへ入るものは？',options:['保存された全情報','選択された規則と関連情報から組み立てた現在の入力だけ','全memoryと履歴が常に入る','最後の一文だけ'],explanation:'履歴、memory、RAG、tool結果は選択時だけ入り、保存は自動入力ではありません。'},
2:{question:'次トークン生成の正しい説明は？',options:['IDに意味がありsoftmaxが選ぶ','IDをembeddingsにし、logitsを出し、softmaxが分布を作りdecodingが選ぶ','embeddingsは確率','logitsは常に合計1'],explanation:'IDは識別、embeddingは表現、logitsはスコア、softmaxは分布、decodingは選択です。'},
3:{question:'groundingとself-checkについて正しいものは？',options:['RAGは即座にパラメータを変える','根拠をcontextに加え、self-checkは問題を見つけても真実を証明しない','外部根拠は常に正しい','self-checkは真実を保証する'],explanation:'groundingは再学習ではなく、情報源と確認はどちらも誤る可能性があります。'},
4:{question:'成功報告の前に必要なものは？',options:['高いconfidenceだけ','toolとauthorization、policy、必要なapproval、上限付き実行、目標の検証','任意のaccepted','policyが拒否してもapproval'],explanation:'authorizationとapprovalは別で、tool成功だけではtask完了ではありません。'},
5:{question:'feedbackの後工程で正しいものは？',options:['即座に学習する','後で確認され、更新は別のheld-out事例で評価され得る','改善例と評価例は同一','常にmemoryになる'],explanation:'改善は別のoffline経路で、全feedbackを使わず、評価も分けます。'},
} satisfies Record<FullTraceQuizId,FullTraceQuizText>};
