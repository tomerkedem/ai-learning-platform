// i18n/dictionary.ts
//
// מאחד את מרחבי-השמות (catalog, chrome) לכל שפה, וגוזר את טיפוס המילון מהעברית.
// כך כל שפה אחרת חייבת לעמוד במבנה של העברית (בדיקת קומפילציה לשלמות התרגום).
// כל ה-stubs מייצאים מחדש את העברית, ולכן fallback לעברית מובטח גם ברמת המילון.

import type { Locale } from './config';

import { catalog as heCatalog } from './locales/he/catalog';
import { chrome as heChrome } from './locales/he/chrome';
import { catalog as arCatalog } from './locales/ar/catalog';
import { chrome as arChrome } from './locales/ar/chrome';
import { catalog as ruCatalog } from './locales/ru/catalog';
import { chrome as ruChrome } from './locales/ru/chrome';
import { catalog as enCatalog } from './locales/en/catalog';
import { chrome as enChrome } from './locales/en/chrome';
import { catalog as esCatalog } from './locales/es/catalog';
import { chrome as esChrome } from './locales/es/chrome';
import { catalog as jaCatalog } from './locales/ja/catalog';
import { chrome as jaChrome } from './locales/ja/chrome';

// פרק 1 (i18n של תוכן הפרק, שלב C1). העברית היא המקור; שאר השפות הן stubs שמייצאים
// מחדש את העברית (fallback בטוח) עד שיתורגמו בשלב C3.
import { chapter1 as heChapter1 } from './locales/he/behind-ai/chapter1';
import { chapter1 as arChapter1 } from './locales/ar/behind-ai/chapter1';
import { chapter1 as ruChapter1 } from './locales/ru/behind-ai/chapter1';
import { chapter1 as enChapter1 } from './locales/en/behind-ai/chapter1';
import { chapter1 as esChapter1 } from './locales/es/behind-ai/chapter1';
import { chapter1 as jaChapter1 } from './locales/ja/behind-ai/chapter1';

// פרק 2 (i18n של תוכן הפרק, שלב C1). העברית היא המקור; שאר השפות הן stubs שמייצאים
// מחדש את העברית (fallback בטוח) עד שיתורגמו בשלב מאוחר יותר.
import { chapter2 as heChapter2 } from './locales/he/behind-ai/chapter2';
import { chapter2 as arChapter2 } from './locales/ar/behind-ai/chapter2';
import { chapter2 as ruChapter2 } from './locales/ru/behind-ai/chapter2';
import { chapter2 as enChapter2 } from './locales/en/behind-ai/chapter2';
import { chapter2 as esChapter2 } from './locales/es/behind-ai/chapter2';
import { chapter2 as jaChapter2 } from './locales/ja/behind-ai/chapter2';

// פרק 3 (Tokenization). העברית היא המקור; שאר השפות הן stubs שמייצאים מחדש את
// העברית (fallback בטוח) עד שיתורגמו בשלבים מאוחרים יותר (C/D).
import { chapter3 as heChapter3 } from './locales/he/behind-ai/chapter3';
import { chapter3 as arChapter3 } from './locales/ar/behind-ai/chapter3';
import { chapter3 as ruChapter3 } from './locales/ru/behind-ai/chapter3';
import { chapter3 as enChapter3 } from './locales/en/behind-ai/chapter3';
import { chapter3 as esChapter3 } from './locales/es/behind-ai/chapter3';
import { chapter3 as jaChapter3 } from './locales/ja/behind-ai/chapter3';

// פרק 4 (Embeddings). העברית היא המקור; שאר השפות הן skeletons זמניים שמייצאים מחדש
// את העברית (fallback בטוח) עד שיתורגמו, שפה לכל commit.
import { chapter4 as heChapter4 } from './locales/he/behind-ai/chapter4';
import { chapter4 as arChapter4 } from './locales/ar/behind-ai/chapter4';
import { chapter4 as ruChapter4 } from './locales/ru/behind-ai/chapter4';
import { chapter4 as enChapter4 } from './locales/en/behind-ai/chapter4';
import { chapter4 as esChapter4 } from './locales/es/behind-ai/chapter4';
import { chapter4 as jaChapter4 } from './locales/ja/behind-ai/chapter4';

// פרק Generation Loop (פרק 10, "איך תשובה נבנית עד הסוף"). העברית היא שפת המקור,
// וכל שש השפות מתורגמות באמת (contentLocale משלהן), לא נפילה לעברית.
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

// פרק Hallucinations (פרק 11, "למה תשובה בטוחה יכולה להיות שגויה"). העברית היא שפת
// המקור, וכל שש השפות מתורגמות באמת (contentLocale משלהן), לא נפילה לעברית.
import { hallucinations as heHallucinations } from './locales/he/behind-ai/hallucinations';
import { hallucinations as arHallucinations } from './locales/ar/behind-ai/hallucinations';
import { hallucinations as ruHallucinations } from './locales/ru/behind-ai/hallucinations';
import { hallucinations as enHallucinations } from './locales/en/behind-ai/hallucinations';
import { hallucinations as esHallucinations } from './locales/es/behind-ai/hallucinations';
import { hallucinations as jaHallucinations } from './locales/ja/behind-ai/hallucinations';

// פרק RAG & Grounding (פרק 12, "איך מחברים AI למקורות"). העברית היא שפת המקור, וכל
// שש השפות מתורגמות באמת (contentLocale משלהן), לא נפילה לעברית.
import { grounding as heGrounding } from './locales/he/behind-ai/grounding';
import { grounding as arGrounding } from './locales/ar/behind-ai/grounding';
import { grounding as ruGrounding } from './locales/ru/behind-ai/grounding';
import { grounding as enGrounding } from './locales/en/behind-ai/grounding';
import { grounding as esGrounding } from './locales/es/behind-ai/grounding';
import { grounding as jaGrounding } from './locales/ja/behind-ai/grounding';

// פרק Self-Check (פרק 13, "בדיקה עצמית בזמן תשובה"). העברית היא שפת המקור, וכל שש
// השפות מתורגמות באמת (contentLocale משלהן), לא נפילה לעברית.
import { selfCheck as heSelfCheck } from './locales/he/behind-ai/selfCheck';
import { selfCheck as arSelfCheck } from './locales/ar/behind-ai/selfCheck';
import { selfCheck as ruSelfCheck } from './locales/ru/behind-ai/selfCheck';
import { selfCheck as enSelfCheck } from './locales/en/behind-ai/selfCheck';
import { selfCheck as esSelfCheck } from './locales/es/behind-ai/selfCheck';
import { selfCheck as jaSelfCheck } from './locales/ja/behind-ai/selfCheck';

// פרק Learning from Mistakes (פרק 14, "איך מודל משתפר מטעות"). העברית היא שפת המקור,
// וכל שש השפות מתורגמות באמת (contentLocale משלהן), לא נפילה לעברית.
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

// המבוא (i18n של המבוא). העברית היא המקור; שאר השפות הן stubs שמייצאים מחדש את
// העברית (fallback בטוח) עד שיתורגמו בשלב מאוחר יותר.
import { introduction as heIntroduction } from './locales/he/behind-ai/introduction';
import { introduction as arIntroduction } from './locales/ar/behind-ai/introduction';
import { introduction as ruIntroduction } from './locales/ru/behind-ai/introduction';
import { introduction as enIntroduction } from './locales/en/behind-ai/introduction';
import { introduction as esIntroduction } from './locales/es/behind-ai/introduction';
import { introduction as jaIntroduction } from './locales/ja/behind-ai/introduction';

// תוויות תצוגה למושגים (concept) של הלומדה. העברית היא המקור (מפת זהות); שאר השפות
// הן stubs שמייצאים מחדש את העברית (fallback בטוח) עד שיתורגמו בשלב B3.
import { conceptLabels as heConceptLabels } from './locales/he/behind-ai/conceptLabels';
import { conceptLabels as arConceptLabels } from './locales/ar/behind-ai/conceptLabels';
import { conceptLabels as ruConceptLabels } from './locales/ru/behind-ai/conceptLabels';
import { conceptLabels as enConceptLabels } from './locales/en/behind-ai/conceptLabels';
import { conceptLabels as esConceptLabels } from './locales/es/behind-ai/conceptLabels';
import { conceptLabels as jaConceptLabels } from './locales/ja/behind-ai/conceptLabels';

// כרום עמוד מבחן הסיום. העברית היא המקור; שאר השפות הן stubs שמייצאים מחדש את
// העברית (fallback בטוח) עד שיתורגמו בשלב F3.
import { finalExam as heFinalExam } from './locales/he/behind-ai/finalExam';
import { finalExam as arFinalExam } from './locales/ar/behind-ai/finalExam';
import { finalExam as ruFinalExam } from './locales/ru/behind-ai/finalExam';
import { finalExam as enFinalExam } from './locales/en/behind-ai/finalExam';
import { finalExam as esFinalExam } from './locales/es/behind-ai/finalExam';
import { finalExam as jaFinalExam } from './locales/ja/behind-ai/finalExam';

// כרום מבדקי הפרקים (כותרת, תת-כותרת, תוויות וכפתורים). העברית היא המקור; שאר
// השפות הן stubs שמייצאים מחדש את העברית (fallback בטוח) עד שיתורגמו בשלב מאוחר.
import { chapterQuiz as heChapterQuiz } from './locales/he/behind-ai/chapterQuiz';
import { chapterQuiz as arChapterQuiz } from './locales/ar/behind-ai/chapterQuiz';
import { chapterQuiz as ruChapterQuiz } from './locales/ru/behind-ai/chapterQuiz';
import { chapterQuiz as enChapterQuiz } from './locales/en/behind-ai/chapterQuiz';
import { chapterQuiz as esChapterQuiz } from './locales/es/behind-ai/chapterQuiz';
import { chapterQuiz as jaChapterQuiz } from './locales/ja/behind-ai/chapterQuiz';

// המחשות ותוויות פנימיות של המבוא. העברית היא המקור; שאר השפות הן stubs שמייצאים
// מחדש את העברית (fallback בטוח) עד שיתורגמו בשלב I2.
import { introVisuals as heIntroVisuals } from './locales/he/behind-ai/introVisuals';
import { introVisuals as arIntroVisuals } from './locales/ar/behind-ai/introVisuals';
import { introVisuals as ruIntroVisuals } from './locales/ru/behind-ai/introVisuals';
import { introVisuals as enIntroVisuals } from './locales/en/behind-ai/introVisuals';
import { introVisuals as esIntroVisuals } from './locales/es/behind-ai/introVisuals';
import { introVisuals as jaIntroVisuals } from './locales/ja/behind-ai/introVisuals';

// כרום משותף של רכיבי ai-internals (ChatInterfacePanel, ConfidenceMeter). העברית היא
// המקור; שאר השפות הן stubs שמייצאים מחדש את העברית עד שיתורגמו (en כבר מתורגם).
import { aiInternals as heAiInternals } from './locales/he/behind-ai/aiInternals';
import { aiInternals as arAiInternals } from './locales/ar/behind-ai/aiInternals';
import { aiInternals as ruAiInternals } from './locales/ru/behind-ai/aiInternals';
import { aiInternals as enAiInternals } from './locales/en/behind-ai/aiInternals';
import { aiInternals as esAiInternals } from './locales/es/behind-ai/aiInternals';
import { aiInternals as jaAiInternals } from './locales/ja/behind-ai/aiInternals';

// העברית מגדירה את הצורה. כל שאר השפות מוטמעות אליה.
export type CatalogDict = typeof heCatalog;
export type ChromeDict = typeof heChrome;
export type Chapter1Dict = typeof heChapter1;
export type Chapter2Dict = typeof heChapter2;
export type Chapter3Dict = typeof heChapter3;
export type Chapter4Dict = typeof heChapter4;
export type GenerationLoopDict = typeof heGenerationLoop;
export type SemanticSpaceDict = typeof heSemanticSpace;
export type AttentionDict = typeof heAttention;
export type ContextWindowDict = typeof heContextWindow;
export type LogitsSoftmaxDict = typeof heLogitsSoftmax;
export type DecodingDict = typeof heDecoding;
export type HallucinationsDict = typeof heHallucinations;
export type GroundingDict = typeof heGrounding;
export type SelfCheckDict = typeof heSelfCheck;
export type MistakeLearningDict = typeof heMistakeLearning;
export type EvaluationDict = typeof heEvaluation;
export type IntroductionDict = typeof heIntroduction;
export type ConceptLabelsDict = typeof heConceptLabels;
export type FinalExamDict = typeof heFinalExam;
export type ChapterQuizDict = typeof heChapterQuiz;
export type IntroVisualsDict = typeof heIntroVisuals;
export type AiInternalsDict = typeof heAiInternals;

/** מרחב הלומדה "מאחורי הקלעים של AI". מתרחב עם כל פרק שעובר i18n. */
export interface BehindAiDict {
    introduction: IntroductionDict;
    chapter1: Chapter1Dict;
    chapter2: Chapter2Dict;
    chapter3: Chapter3Dict;
    chapter4: Chapter4Dict;
    generationLoop: GenerationLoopDict;
    semanticSpace: SemanticSpaceDict;
    attention: AttentionDict;
    contextWindow: ContextWindowDict;
    logitsSoftmax: LogitsSoftmaxDict;
    decoding: DecodingDict;
    hallucinations: HallucinationsDict;
    grounding: GroundingDict;
    selfCheck: SelfCheckDict;
    mistakeLearning: MistakeLearningDict;
    evaluation: EvaluationDict;
    conceptLabels: ConceptLabelsDict;
    finalExam: FinalExamDict;
    chapterQuiz: ChapterQuizDict;
    introVisuals: IntroVisualsDict;
    aiInternals: AiInternalsDict;
}

export interface Dictionary {
    catalog: CatalogDict;
    chrome: ChromeDict;
    behindAi: BehindAiDict;
}

const DICTS: Record<Locale, Dictionary> = {
    he: { catalog: heCatalog, chrome: heChrome, behindAi: { introduction: heIntroduction, chapter1: heChapter1, chapter2: heChapter2, chapter3: heChapter3, chapter4: heChapter4, generationLoop: heGenerationLoop, semanticSpace: heSemanticSpace, attention: heAttention, contextWindow: heContextWindow, logitsSoftmax: heLogitsSoftmax, decoding: heDecoding, hallucinations: heHallucinations, grounding: heGrounding, selfCheck: heSelfCheck, mistakeLearning: heMistakeLearning, evaluation: heEvaluation, conceptLabels: heConceptLabels, finalExam: heFinalExam, chapterQuiz: heChapterQuiz, introVisuals: heIntroVisuals, aiInternals: heAiInternals } },
    ar: { catalog: arCatalog, chrome: arChrome, behindAi: { introduction: arIntroduction, chapter1: arChapter1, chapter2: arChapter2, chapter3: arChapter3, chapter4: arChapter4, generationLoop: arGenerationLoop, semanticSpace: arSemanticSpace, attention: arAttention, contextWindow: arContextWindow, logitsSoftmax: arLogitsSoftmax, decoding: arDecoding, hallucinations: arHallucinations, grounding: arGrounding, selfCheck: arSelfCheck, mistakeLearning: arMistakeLearning, evaluation: arEvaluation, conceptLabels: arConceptLabels, finalExam: arFinalExam, chapterQuiz: arChapterQuiz, introVisuals: arIntroVisuals, aiInternals: arAiInternals } },
    ru: { catalog: ruCatalog, chrome: ruChrome, behindAi: { introduction: ruIntroduction, chapter1: ruChapter1, chapter2: ruChapter2, chapter3: ruChapter3, chapter4: ruChapter4, generationLoop: ruGenerationLoop, semanticSpace: ruSemanticSpace, attention: ruAttention, contextWindow: ruContextWindow, logitsSoftmax: ruLogitsSoftmax, decoding: ruDecoding, hallucinations: ruHallucinations, grounding: ruGrounding, selfCheck: ruSelfCheck, mistakeLearning: ruMistakeLearning, evaluation: ruEvaluation, conceptLabels: ruConceptLabels, finalExam: ruFinalExam, chapterQuiz: ruChapterQuiz, introVisuals: ruIntroVisuals, aiInternals: ruAiInternals } },
    en: { catalog: enCatalog, chrome: enChrome, behindAi: { introduction: enIntroduction, chapter1: enChapter1, chapter2: enChapter2, chapter3: enChapter3, chapter4: enChapter4, generationLoop: enGenerationLoop, semanticSpace: enSemanticSpace, attention: enAttention, contextWindow: enContextWindow, logitsSoftmax: enLogitsSoftmax, decoding: enDecoding, hallucinations: enHallucinations, grounding: enGrounding, selfCheck: enSelfCheck, mistakeLearning: enMistakeLearning, evaluation: enEvaluation, conceptLabels: enConceptLabels, finalExam: enFinalExam, chapterQuiz: enChapterQuiz, introVisuals: enIntroVisuals, aiInternals: enAiInternals } },
    es: { catalog: esCatalog, chrome: esChrome, behindAi: { introduction: esIntroduction, chapter1: esChapter1, chapter2: esChapter2, chapter3: esChapter3, chapter4: esChapter4, generationLoop: esGenerationLoop, semanticSpace: esSemanticSpace, attention: esAttention, contextWindow: esContextWindow, logitsSoftmax: esLogitsSoftmax, decoding: esDecoding, hallucinations: esHallucinations, grounding: esGrounding, selfCheck: esSelfCheck, mistakeLearning: esMistakeLearning, evaluation: esEvaluation, conceptLabels: esConceptLabels, finalExam: esFinalExam, chapterQuiz: esChapterQuiz, introVisuals: esIntroVisuals, aiInternals: esAiInternals } },
    ja: { catalog: jaCatalog, chrome: jaChrome, behindAi: { introduction: jaIntroduction, chapter1: jaChapter1, chapter2: jaChapter2, chapter3: jaChapter3, chapter4: jaChapter4, generationLoop: jaGenerationLoop, semanticSpace: jaSemanticSpace, attention: jaAttention, contextWindow: jaContextWindow, logitsSoftmax: jaLogitsSoftmax, decoding: jaDecoding, hallucinations: jaHallucinations, grounding: jaGrounding, selfCheck: jaSelfCheck, mistakeLearning: jaMistakeLearning, evaluation: jaEvaluation, conceptLabels: jaConceptLabels, finalExam: jaFinalExam, chapterQuiz: jaChapterQuiz, introVisuals: jaIntroVisuals, aiInternals: jaAiInternals } },
};

/** מחזיר את המילון לשפה, עם נפילה לעברית אם השפה לא נמצאה. */
export function getDictionary(locale: Locale): Dictionary {
    return DICTS[locale] ?? DICTS.he;
}
