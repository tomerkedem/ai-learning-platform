// i18n/locales/en/behind-ai/chapterBridges.ts
//
// משפט הגשר שבסוף כל פרק מוגן (מבשר את נושא הפרק הבא). תוכן מוגן: נטען בשרת בלבד
// (i18n/chapterContent.server.ts) ומגיע לעמוד רק אחרי בדיקת הרשאה.
// No em dash (U+2014) and no en dash (U+2013).

export const chapterBridges: Record<number, string> = {
        2: 'Now we know what the product assembles. How does the model divide that input into units it can process?', 3: 'A Token ID identifies a token, but the number itself has no meaning. How does it become a useful representation?',
        6: 'Attention can weigh only information available now. What is actually inside the current window?', 7: 'The context is ready. How does the model turn it into scores for possible next tokens?', 8: 'Softmax gives a distribution, but it is not yet a choice. How is the next token selected?', 9: 'One token has been selected. How does that choice become a complete response?',
        10: 'A response can be fluent and still be wrong. Why does that happen?', 11: 'If fluency is not enough, how can the system connect the answer to external evidence?', 12: 'A source improves grounding, but the draft may still misuse it. How can the system check the draft against the evidence?', 13: 'A check can catch one problem. What happens when the failure repeats and the system needs to improve?',
        14: 'A change may improve familiar examples. How do we test whether it also works on new cases?', 15: 'We know how updates are evaluated. But does one correction in my chat change the model itself?', 16: 'So far, the system has mainly returned responses. What changes when it must pursue a goal through several steps and actions?',
};
