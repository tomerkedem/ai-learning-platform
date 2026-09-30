// Public introduction preview strings: the hero, the opening chat example and the read-aloud
// labels. This is all introduction text that ships in the public client bundle; the rest
// (introduction.ts) is loaded only on the server for a signed-in, confirmed learner.

export const introPreview = {
    hero: {
        badge: 'The Transparent Lab · Behind the Scenes',
        titleLead: 'What really happens between the message you send',
        titleAccent: 'and the answer you receive?',
        intro: 'A look at what happens the moment you send a message to a chat.',
    },

    chat: {
        promptRole: 'Your request',
        prompt: "I'm having friends over for dinner. What could I make?",
        inputPlaceholder: 'Type a message...',
        answerRole: 'The answer',
        answer: 'You could make pasta with a simple salad. If you tell me what they like, I can suggest a more specific menu.',
        outsideLine: 'From the outside it looks like two steps: you wrote a request and got an answer.',
        curiosityLine: 'But the real question is what happened in between.',
    },

    readAloud: {
        dock: 'Guided listening',
        play: 'Read aloud',
        pause: 'Pause',
        resume: 'Resume',
        stop: 'Stop',
        prev: 'Previous segment',
        next: 'Next segment',
        voice: 'Voice',
        browserDefault: 'Browser default voice',
        settings: 'Read-aloud options',
        sections: 'Sections',
        nowReading: 'Now reading',
        unsupported: 'Read-aloud is not available in this browser.',
        scope: 'Scope',
        scopeShort: 'Short',
        scopeRegular: 'Regular',
        scopeFull: 'Full',
        speed: 'Speed',
    },
};
