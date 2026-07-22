// i18n/locales/ja/behind-ai/chapterQuiz.ts
// Japanese chapter-quiz chrome. Shape source: ../../he/behind-ai/chapterQuiz.
//
// Display text only. Quiz behavior stays in quizData.ts. Question content is out of
// scope here. "AI" and other Latin terms (Attention, Tool Call, Tokenization, prompt)
// are kept on purpose. No em dash (U+2014) and no en dash (U+2013).

export const chapterQuiz = {
    subtitle: 'この章で学んだことを確かめる5つの問題',
    startLabel: 'テストを始める',
    submitLabel: 'テストを終える',
    completedTitle: 'テスト完了',
    nextQuestionLabel: '次の問い',
    transitions: {
        2: '製品が何を組み立てるか分かりました。モデルは入力を処理できる単位にどう分けるのでしょうか。', 3: 'Token ID はトークンを識別しますが、数字自体に意味はありません。どう役立つ表現になるのでしょうか。',
        6: 'Attention が重み付けできるのは今ある情報だけです。現在の窓には何があるのでしょうか。', 7: '文脈が整いました。モデルは次のトークン候補のスコアをどう作るのでしょうか。', 8: 'Softmax は分布を作りますが、まだ選択ではありません。次のトークンはどう選ばれるのでしょうか。', 9: 'トークンが1つ選ばれました。その選択はどう完全な応答になるのでしょうか。',
        10: '応答は流暢でも間違っていることがあります。なぜでしょうか。', 11: '流暢さだけでは足りないなら、システムはどう外部の根拠と回答を結び付けるのでしょうか。', 12: '情報源は根拠を強めますが、下書きが誤用することもあります。どう照合するのでしょうか。', 13: '確認で1つの問題を見つけられます。同じ失敗が繰り返され、改善が必要ならどうなるでしょうか。',
        14: '変更で見慣れた例が改善しても、新しいケースで働くとどう確かめるのでしょうか。', 15: '更新の評価方法は分かりました。では、チャットでの1回の訂正はモデル自体を変えるのでしょうか。', 16: 'これまでシステムは主に応答を返してきました。複数の手順と操作で目標を追うと何が変わるのでしょうか。',
    } as Record<number, string>,

    title: (chapterName: string) => `理解度テスト: ${chapterName}`,
    reviewLinkLabel: (chapterNumber: number, chapterName: string) =>
        `第${chapterNumber}章に戻る: ${chapterName}`,

    chapterNames: {
        1: '透明なチャット',
        2: 'Model Input',
        3: 'Tokenization',
        4: 'Embeddings',
        5: 'Semantic Space: 意味のマップ',
        6: 'Attention：いま何が重要か',
        7: 'Context Window',
        8: 'Logits & Softmax',
        9: 'Decoding',
        10: 'Generation Loop',
        11: 'Hallucinations',
        12: 'RAG & Grounding',
        13: 'Self-Check',
        14: 'Learning from Mistakes',
        15: '評価と一般化',
        16: 'AI は私から学ぶのか',
        17: 'Chat to Agent',
        18: 'Guardrails',
        19: 'Full Trace',
    } as Record<number, string>,
};
