// Public introduction preview strings: the hero, the opening chat example and the read-aloud
// labels. This is all introduction text that ships in the public client bundle; the rest
// (introduction.ts) is loaded only on the server for a signed-in, confirmed learner.

export const introPreview = {
    hero: {
        badge: '透明なラボ · Behind the Scenes',
        titleLead: 'あなたが送るメッセージと',
        titleAccent: '受け取る回答の間で、実際には何が起きているのか?',
        intro: 'チャットにメッセージを送った瞬間に何が起きているかをのぞいてみます。',
    },

    chat: {
        promptRole: 'あなたのリクエスト',
        prompt: '友人を夕食に招待するのですが、何を作ればいいですか?',
        inputPlaceholder: 'メッセージを入力...',
        answerRole: '回答',
        answer: 'パスタとシンプルなサラダはいかがでしょう。皆さんの好みを教えていただければ、もっと具体的なメニューを提案できます。',
        outsideLine: '外から見ると2つのステップに見えます。リクエストを書いて、回答を受け取った、という流れです。',
        curiosityLine: 'しかし本当の問いは、その間に何が起きたのか、です。',
    },

    readAloud: {
        dock: '音声ガイド',
        play: '読み上げ',
        pause: '一時停止',
        resume: '再開',
        stop: '停止',
        prev: '前のセグメント',
        next: '次のセグメント',
        voice: '音声',
        browserDefault: 'ブラウザーの既定の音声',
        settings: '読み上げオプション',
        sections: 'セクション',
        nowReading: '読み上げ中',
        unsupported: 'このブラウザーでは読み上げを利用できません。',
        scope: '範囲',
        scopeShort: '短め',
        scopeRegular: '標準',
        scopeFull: '詳細',
        speed: '速度',
    },
};
