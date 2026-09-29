// i18n/chapterContent.server.ts
//
// תוכן הפרקים המוגנים (2-19 ומבחן הסיום), בשרת בלבד. 'server-only' שובר את הבנייה אם
// רכיב לקוח מייבא את הקובץ, ולכן התוכן לעולם לא נכנס לחבילת JS ציבורית. עמוד מוגן
// קורא לכאן רק אחרי בדיקת הרשאה בשרת, ומעביר ללקוח את הפרוסה של השפה והפרק בלבד.

import 'server-only';
import type { Locale } from './config';
import type { BehindAiDict, ProtectedNamespace } from './dictionary';
import { conceptLabels as heConceptLabels } from './locales/he/behind-ai/conceptLabels';
import { conceptLabels as arConceptLabels } from './locales/ar/behind-ai/conceptLabels';
import { conceptLabels as ruConceptLabels } from './locales/ru/behind-ai/conceptLabels';
import { conceptLabels as enConceptLabels } from './locales/en/behind-ai/conceptLabels';
import { conceptLabels as esConceptLabels } from './locales/es/behind-ai/conceptLabels';
import { conceptLabels as jaConceptLabels } from './locales/ja/behind-ai/conceptLabels';
import { chapterBridges as heChapterBridges } from './locales/he/behind-ai/chapterBridges';
import { chapterBridges as arChapterBridges } from './locales/ar/behind-ai/chapterBridges';
import { chapterBridges as ruChapterBridges } from './locales/ru/behind-ai/chapterBridges';
import { chapterBridges as enChapterBridges } from './locales/en/behind-ai/chapterBridges';
import { chapterBridges as esChapterBridges } from './locales/es/behind-ai/chapterBridges';
import { chapterBridges as jaChapterBridges } from './locales/ja/behind-ai/chapterBridges';

import { chapter2 as heChapter2 } from './locales/he/behind-ai/chapter2';
import { chapter2 as arChapter2 } from './locales/ar/behind-ai/chapter2';
import { chapter2 as ruChapter2 } from './locales/ru/behind-ai/chapter2';
import { chapter2 as enChapter2 } from './locales/en/behind-ai/chapter2';
import { chapter2 as esChapter2 } from './locales/es/behind-ai/chapter2';
import { chapter2 as jaChapter2 } from './locales/ja/behind-ai/chapter2';
import { chapter3 as heChapter3 } from './locales/he/behind-ai/chapter3';
import { chapter3 as arChapter3 } from './locales/ar/behind-ai/chapter3';
import { chapter3 as ruChapter3 } from './locales/ru/behind-ai/chapter3';
import { chapter3 as enChapter3 } from './locales/en/behind-ai/chapter3';
import { chapter3 as esChapter3 } from './locales/es/behind-ai/chapter3';
import { chapter3 as jaChapter3 } from './locales/ja/behind-ai/chapter3';
import { chapter4 as heChapter4 } from './locales/he/behind-ai/chapter4';
import { chapter4 as arChapter4 } from './locales/ar/behind-ai/chapter4';
import { chapter4 as ruChapter4 } from './locales/ru/behind-ai/chapter4';
import { chapter4 as enChapter4 } from './locales/en/behind-ai/chapter4';
import { chapter4 as esChapter4 } from './locales/es/behind-ai/chapter4';
import { chapter4 as jaChapter4 } from './locales/ja/behind-ai/chapter4';
import { generationLoop as heGenerationLoop } from './locales/he/behind-ai/generationLoop';
import { generationLoop as arGenerationLoop } from './locales/ar/behind-ai/generationLoop';
import { generationLoop as ruGenerationLoop } from './locales/ru/behind-ai/generationLoop';
import { generationLoop as enGenerationLoop } from './locales/en/behind-ai/generationLoop';
import { generationLoop as esGenerationLoop } from './locales/es/behind-ai/generationLoop';
import { generationLoop as jaGenerationLoop } from './locales/ja/behind-ai/generationLoop';
import { semanticSpace as heSemanticSpace } from './locales/he/behind-ai/semanticSpace';
import { semanticSpace as arSemanticSpace } from './locales/ar/behind-ai/semanticSpace';
import { semanticSpace as ruSemanticSpace } from './locales/ru/behind-ai/semanticSpace';
import { semanticSpace as enSemanticSpace } from './locales/en/behind-ai/semanticSpace';
import { semanticSpace as esSemanticSpace } from './locales/es/behind-ai/semanticSpace';
import { semanticSpace as jaSemanticSpace } from './locales/ja/behind-ai/semanticSpace';
import { attention as heAttention } from './locales/he/behind-ai/attention';
import { attention as arAttention } from './locales/ar/behind-ai/attention';
import { attention as ruAttention } from './locales/ru/behind-ai/attention';
import { attention as enAttention } from './locales/en/behind-ai/attention';
import { attention as esAttention } from './locales/es/behind-ai/attention';
import { attention as jaAttention } from './locales/ja/behind-ai/attention';
import { contextWindow as heContextWindow } from './locales/he/behind-ai/contextWindow';
import { contextWindow as arContextWindow } from './locales/ar/behind-ai/contextWindow';
import { contextWindow as ruContextWindow } from './locales/ru/behind-ai/contextWindow';
import { contextWindow as enContextWindow } from './locales/en/behind-ai/contextWindow';
import { contextWindow as esContextWindow } from './locales/es/behind-ai/contextWindow';
import { contextWindow as jaContextWindow } from './locales/ja/behind-ai/contextWindow';
import { logitsSoftmax as heLogitsSoftmax } from './locales/he/behind-ai/logitsSoftmax';
import { logitsSoftmax as arLogitsSoftmax } from './locales/ar/behind-ai/logitsSoftmax';
import { logitsSoftmax as ruLogitsSoftmax } from './locales/ru/behind-ai/logitsSoftmax';
import { logitsSoftmax as enLogitsSoftmax } from './locales/en/behind-ai/logitsSoftmax';
import { logitsSoftmax as esLogitsSoftmax } from './locales/es/behind-ai/logitsSoftmax';
import { logitsSoftmax as jaLogitsSoftmax } from './locales/ja/behind-ai/logitsSoftmax';
import { decoding as heDecoding } from './locales/he/behind-ai/decoding';
import { decoding as arDecoding } from './locales/ar/behind-ai/decoding';
import { decoding as ruDecoding } from './locales/ru/behind-ai/decoding';
import { decoding as enDecoding } from './locales/en/behind-ai/decoding';
import { decoding as esDecoding } from './locales/es/behind-ai/decoding';
import { decoding as jaDecoding } from './locales/ja/behind-ai/decoding';
import { hallucinations as heHallucinations } from './locales/he/behind-ai/hallucinations';
import { hallucinations as arHallucinations } from './locales/ar/behind-ai/hallucinations';
import { hallucinations as ruHallucinations } from './locales/ru/behind-ai/hallucinations';
import { hallucinations as enHallucinations } from './locales/en/behind-ai/hallucinations';
import { hallucinations as esHallucinations } from './locales/es/behind-ai/hallucinations';
import { hallucinations as jaHallucinations } from './locales/ja/behind-ai/hallucinations';
import { grounding as heGrounding } from './locales/he/behind-ai/grounding';
import { grounding as arGrounding } from './locales/ar/behind-ai/grounding';
import { grounding as ruGrounding } from './locales/ru/behind-ai/grounding';
import { grounding as enGrounding } from './locales/en/behind-ai/grounding';
import { grounding as esGrounding } from './locales/es/behind-ai/grounding';
import { grounding as jaGrounding } from './locales/ja/behind-ai/grounding';
import { selfCheck as heSelfCheck } from './locales/he/behind-ai/selfCheck';
import { selfCheck as arSelfCheck } from './locales/ar/behind-ai/selfCheck';
import { selfCheck as ruSelfCheck } from './locales/ru/behind-ai/selfCheck';
import { selfCheck as enSelfCheck } from './locales/en/behind-ai/selfCheck';
import { selfCheck as esSelfCheck } from './locales/es/behind-ai/selfCheck';
import { selfCheck as jaSelfCheck } from './locales/ja/behind-ai/selfCheck';
import { mistakeLearning as heMistakeLearning } from './locales/he/behind-ai/mistakeLearning';
import { mistakeLearning as arMistakeLearning } from './locales/ar/behind-ai/mistakeLearning';
import { mistakeLearning as ruMistakeLearning } from './locales/ru/behind-ai/mistakeLearning';
import { mistakeLearning as enMistakeLearning } from './locales/en/behind-ai/mistakeLearning';
import { mistakeLearning as esMistakeLearning } from './locales/es/behind-ai/mistakeLearning';
import { mistakeLearning as jaMistakeLearning } from './locales/ja/behind-ai/mistakeLearning';
import { evaluation as heEvaluation } from './locales/he/behind-ai/evaluation';
import { evaluation as arEvaluation } from './locales/ar/behind-ai/evaluation';
import { evaluation as ruEvaluation } from './locales/ru/behind-ai/evaluation';
import { evaluation as enEvaluation } from './locales/en/behind-ai/evaluation';
import { evaluation as esEvaluation } from './locales/es/behind-ai/evaluation';
import { evaluation as jaEvaluation } from './locales/ja/behind-ai/evaluation';
import { evaluationScore as heEvaluationScore } from './locales/he/behind-ai/evaluationScore';
import { evaluationScore as arEvaluationScore } from './locales/ar/behind-ai/evaluationScore';
import { evaluationScore as ruEvaluationScore } from './locales/ru/behind-ai/evaluationScore';
import { evaluationScore as enEvaluationScore } from './locales/en/behind-ai/evaluationScore';
import { evaluationScore as esEvaluationScore } from './locales/es/behind-ai/evaluationScore';
import { evaluationScore as jaEvaluationScore } from './locales/ja/behind-ai/evaluationScore';
import { doesAiLearn as heDoesAiLearn } from './locales/he/behind-ai/doesAiLearn';
import { doesAiLearn as arDoesAiLearn } from './locales/ar/behind-ai/doesAiLearn';
import { doesAiLearn as ruDoesAiLearn } from './locales/ru/behind-ai/doesAiLearn';
import { doesAiLearn as enDoesAiLearn } from './locales/en/behind-ai/doesAiLearn';
import { doesAiLearn as esDoesAiLearn } from './locales/es/behind-ai/doesAiLearn';
import { doesAiLearn as jaDoesAiLearn } from './locales/ja/behind-ai/doesAiLearn';
import { chatToAgent as heChatToAgent } from './locales/he/behind-ai/chatToAgent';
import { chatToAgent as arChatToAgent } from './locales/ar/behind-ai/chatToAgent';
import { chatToAgent as ruChatToAgent } from './locales/ru/behind-ai/chatToAgent';
import { chatToAgent as enChatToAgent } from './locales/en/behind-ai/chatToAgent';
import { chatToAgent as esChatToAgent } from './locales/es/behind-ai/chatToAgent';
import { chatToAgent as jaChatToAgent } from './locales/ja/behind-ai/chatToAgent';
import { guardrails as heGuardrails } from './locales/he/behind-ai/guardrails';
import { guardrails as arGuardrails } from './locales/ar/behind-ai/guardrails';
import { guardrails as ruGuardrails } from './locales/ru/behind-ai/guardrails';
import { guardrails as enGuardrails } from './locales/en/behind-ai/guardrails';
import { guardrails as esGuardrails } from './locales/es/behind-ai/guardrails';
import { guardrails as jaGuardrails } from './locales/ja/behind-ai/guardrails';
import { fullTrace as heFullTrace } from './locales/he/behind-ai/fullTrace';
import { fullTrace as arFullTrace } from './locales/ar/behind-ai/fullTrace';
import { fullTrace as ruFullTrace } from './locales/ru/behind-ai/fullTrace';
import { fullTrace as enFullTrace } from './locales/en/behind-ai/fullTrace';
import { fullTrace as esFullTrace } from './locales/es/behind-ai/fullTrace';
import { fullTrace as jaFullTrace } from './locales/ja/behind-ai/fullTrace';
import { finalExam as heFinalExam } from './locales/he/behind-ai/finalExam';
import { finalExam as arFinalExam } from './locales/ar/behind-ai/finalExam';
import { finalExam as ruFinalExam } from './locales/ru/behind-ai/finalExam';
import { finalExam as enFinalExam } from './locales/en/behind-ai/finalExam';
import { finalExam as esFinalExam } from './locales/es/behind-ai/finalExam';
import { finalExam as jaFinalExam } from './locales/ja/behind-ai/finalExam';

type ProtectedDict = Pick<BehindAiDict, ProtectedNamespace>;

const PROTECTED: Record<Locale, ProtectedDict> = {
    he: { chapter2: heChapter2, chapter3: heChapter3, chapter4: heChapter4, generationLoop: heGenerationLoop, semanticSpace: heSemanticSpace, attention: heAttention, contextWindow: heContextWindow, logitsSoftmax: heLogitsSoftmax, decoding: heDecoding, hallucinations: heHallucinations, grounding: heGrounding, selfCheck: heSelfCheck, mistakeLearning: heMistakeLearning, evaluation: heEvaluation, evaluationScore: heEvaluationScore, doesAiLearn: heDoesAiLearn, chatToAgent: heChatToAgent, guardrails: heGuardrails, fullTrace: heFullTrace, finalExam: heFinalExam, conceptLabels: heConceptLabels, chapterBridges: heChapterBridges },
    ar: { chapter2: arChapter2, chapter3: arChapter3, chapter4: arChapter4, generationLoop: arGenerationLoop, semanticSpace: arSemanticSpace, attention: arAttention, contextWindow: arContextWindow, logitsSoftmax: arLogitsSoftmax, decoding: arDecoding, hallucinations: arHallucinations, grounding: arGrounding, selfCheck: arSelfCheck, mistakeLearning: arMistakeLearning, evaluation: arEvaluation, evaluationScore: arEvaluationScore, doesAiLearn: arDoesAiLearn, chatToAgent: arChatToAgent, guardrails: arGuardrails, fullTrace: arFullTrace, finalExam: arFinalExam, conceptLabels: arConceptLabels, chapterBridges: arChapterBridges },
    ru: { chapter2: ruChapter2, chapter3: ruChapter3, chapter4: ruChapter4, generationLoop: ruGenerationLoop, semanticSpace: ruSemanticSpace, attention: ruAttention, contextWindow: ruContextWindow, logitsSoftmax: ruLogitsSoftmax, decoding: ruDecoding, hallucinations: ruHallucinations, grounding: ruGrounding, selfCheck: ruSelfCheck, mistakeLearning: ruMistakeLearning, evaluation: ruEvaluation, evaluationScore: ruEvaluationScore, doesAiLearn: ruDoesAiLearn, chatToAgent: ruChatToAgent, guardrails: ruGuardrails, fullTrace: ruFullTrace, finalExam: ruFinalExam, conceptLabels: ruConceptLabels, chapterBridges: ruChapterBridges },
    en: { chapter2: enChapter2, chapter3: enChapter3, chapter4: enChapter4, generationLoop: enGenerationLoop, semanticSpace: enSemanticSpace, attention: enAttention, contextWindow: enContextWindow, logitsSoftmax: enLogitsSoftmax, decoding: enDecoding, hallucinations: enHallucinations, grounding: enGrounding, selfCheck: enSelfCheck, mistakeLearning: enMistakeLearning, evaluation: enEvaluation, evaluationScore: enEvaluationScore, doesAiLearn: enDoesAiLearn, chatToAgent: enChatToAgent, guardrails: enGuardrails, fullTrace: enFullTrace, finalExam: enFinalExam, conceptLabels: enConceptLabels, chapterBridges: enChapterBridges },
    es: { chapter2: esChapter2, chapter3: esChapter3, chapter4: esChapter4, generationLoop: esGenerationLoop, semanticSpace: esSemanticSpace, attention: esAttention, contextWindow: esContextWindow, logitsSoftmax: esLogitsSoftmax, decoding: esDecoding, hallucinations: esHallucinations, grounding: esGrounding, selfCheck: esSelfCheck, mistakeLearning: esMistakeLearning, evaluation: esEvaluation, evaluationScore: esEvaluationScore, doesAiLearn: esDoesAiLearn, chatToAgent: esChatToAgent, guardrails: esGuardrails, fullTrace: esFullTrace, finalExam: esFinalExam, conceptLabels: esConceptLabels, chapterBridges: esChapterBridges },
    ja: { chapter2: jaChapter2, chapter3: jaChapter3, chapter4: jaChapter4, generationLoop: jaGenerationLoop, semanticSpace: jaSemanticSpace, attention: jaAttention, contextWindow: jaContextWindow, logitsSoftmax: jaLogitsSoftmax, decoding: jaDecoding, hallucinations: jaHallucinations, grounding: jaGrounding, selfCheck: jaSelfCheck, mistakeLearning: jaMistakeLearning, evaluation: jaEvaluation, evaluationScore: jaEvaluationScore, doesAiLearn: jaDoesAiLearn, chatToAgent: jaChatToAgent, guardrails: jaGuardrails, fullTrace: jaFullTrace, finalExam: jaFinalExam, conceptLabels: jaConceptLabels, chapterBridges: jaChapterBridges },
};

/** פרוסת התוכן של שפה ומרחבי-שמות מבוקשים. עם נפילה לעברית, כמו getDictionary. */
export function getProtectedContent(locale: Locale, namespaces: readonly ProtectedNamespace[]): Partial<BehindAiDict> {
    const dict = PROTECTED[locale] ?? PROTECTED.he;
    return Object.fromEntries(namespaces.map((ns) => [ns, dict[ns]]));
}
