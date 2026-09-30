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
import type { chapter1 as heChapter1 } from './locales/he/behind-ai/chapter1';

// פרק 2 (i18n של תוכן הפרק, שלב C1). העברית היא המקור; שאר השפות הן stubs שמייצאים
// מחדש את העברית (fallback בטוח) עד שיתורגמו בשלב מאוחר יותר.
import type { chapter2 as heChapter2 } from './locales/he/behind-ai/chapter2';

// פרק 3 (Tokenization). העברית היא המקור; שאר השפות הן stubs שמייצאים מחדש את
// העברית (fallback בטוח) עד שיתורגמו בשלבים מאוחרים יותר (C/D).
import type { chapter3 as heChapter3 } from './locales/he/behind-ai/chapter3';

// פרק 4 (Embeddings). העברית היא המקור; שאר השפות הן skeletons זמניים שמייצאים מחדש
// את העברית (fallback בטוח) עד שיתורגמו, שפה לכל commit.
import type { chapter4 as heChapter4 } from './locales/he/behind-ai/chapter4';

// פרק Generation Loop (פרק 10, "איך תשובה נבנית עד הסוף"). העברית היא שפת המקור,
// וכל שש השפות מתורגמות באמת (contentLocale משלהן), לא נפילה לעברית.
import type { generationLoop as heGenerationLoop } from './locales/he/behind-ai/generationLoop';
import type { semanticSpace as heSemanticSpace } from './locales/he/behind-ai/semanticSpace';
import type { attention as heAttention } from './locales/he/behind-ai/attention';
import type { contextWindow as heContextWindow } from './locales/he/behind-ai/contextWindow';
import type { logitsSoftmax as heLogitsSoftmax } from './locales/he/behind-ai/logitsSoftmax';
import type { decoding as heDecoding } from './locales/he/behind-ai/decoding';

// פרק Hallucinations (פרק 11, "למה תשובה בטוחה יכולה להיות שגויה"). העברית היא שפת
// המקור, וכל שש השפות מתורגמות באמת (contentLocale משלהן), לא נפילה לעברית.
import type { hallucinations as heHallucinations } from './locales/he/behind-ai/hallucinations';

// פרק RAG & Grounding (פרק 12, "איך מחברים AI למקורות"). העברית היא שפת המקור, וכל
// שש השפות מתורגמות באמת (contentLocale משלהן), לא נפילה לעברית.
import type { grounding as heGrounding } from './locales/he/behind-ai/grounding';

// פרק Self-Check (פרק 13, "בדיקה עצמית בזמן תשובה"). העברית היא שפת המקור, וכל שש
// השפות מתורגמות באמת (contentLocale משלהן), לא נפילה לעברית.
import type { selfCheck as heSelfCheck } from './locales/he/behind-ai/selfCheck';

// פרק Learning from Mistakes (פרק 14, "איך מודל משתפר מטעות"). העברית היא שפת המקור,
// וכל שש השפות מתורגמות באמת (contentLocale משלהן), לא נפילה לעברית.
import type { mistakeLearning as heMistakeLearning } from './locales/he/behind-ai/mistakeLearning';
import type { evaluation as heEvaluation } from './locales/he/behind-ai/evaluation';

// הרחבת פרק 15: לוח פירוק הציון וכרטיס ההטיה שאחריו. מרחב שמות נפרד, כדי שמעבדת
// ההערכה הקיימת (evaluationLab) תישאר בדיוק כפי שהיא. העברית היא שפת המקור, וכל שש
// השפות מתורגמות באמת, לא נפילה לעברית.
import type { evaluationScore as heEvaluationScore } from './locales/he/behind-ai/evaluationScore';

// פרק Does AI Learn From Me (פרק 16, "האם AI לומד ממני"). העברית היא שפת המקור, וכל
// שש השפות מתורגמות באמת (contentLocale משלהן), לא נפילה לעברית.
import type { doesAiLearn as heDoesAiLearn } from './locales/he/behind-ai/doesAiLearn';

// פרק Chat to Agent (פרק 17, "כששאלה הופכת למשימה", פותח את מקטע ה-Agent). העברית
// היא שפת המקור, וכל שש השפות מתורגמות באמת (contentLocale משלהן), לא נפילה לעברית.
import type { chatToAgent as heChatToAgent } from './locales/he/behind-ai/chatToAgent';

// פרק Guardrails (פרק 18, "סיכון, הרשאות, אישור ועצירה", ממשיך את מקטע ה-Agent).
// העברית היא שפת המקור, וכל שש השפות מתורגמות באמת (contentLocale משלהן), לא נפילה לעברית.
import type { guardrails as heGuardrails } from './locales/he/behind-ai/guardrails';

// פרק Full Trace (פרק 19, "פרומפט אחד, כל התחנות", פרק הסיכום). העברית היא שפת המקור,
// וכל שש השפות מתורגמות באמת (contentLocale משלהן), לא נפילה לעברית.
import type { fullTrace as heFullTrace } from './locales/he/behind-ai/fullTrace';

// המבוא (i18n של המבוא). העברית היא המקור; שאר השפות הן stubs שמייצאים מחדש את
// העברית (fallback בטוח) עד שיתורגמו בשלב מאוחר יותר.
import type { introduction as heIntroduction } from './locales/he/behind-ai/introduction';
import { introPreview as heIntroPreview } from './locales/he/behind-ai/introPreview';
import { introPreview as arIntroPreview } from './locales/ar/behind-ai/introPreview';
import { introPreview as ruIntroPreview } from './locales/ru/behind-ai/introPreview';
import { introPreview as enIntroPreview } from './locales/en/behind-ai/introPreview';
import { introPreview as esIntroPreview } from './locales/es/behind-ai/introPreview';
import { introPreview as jaIntroPreview } from './locales/ja/behind-ai/introPreview';

// תוויות תצוגה למושגים (concept) של הלומדה. העברית היא המקור (מפת זהות); שאר השפות
// הן stubs שמייצאים מחדש את העברית (fallback בטוח) עד שיתורגמו בשלב B3.
import type { conceptLabels as heConceptLabels } from './locales/he/behind-ai/conceptLabels';
import type { chapterBridges as heChapterBridges } from './locales/he/behind-ai/chapterBridges';

// כרום עמוד מבחן הסיום. העברית היא המקור; שאר השפות הן stubs שמייצאים מחדש את
// העברית (fallback בטוח) עד שיתורגמו בשלב F3.
import type { finalExam as heFinalExam } from './locales/he/behind-ai/finalExam';

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
import type { introVisuals as heIntroVisuals } from './locales/he/behind-ai/introVisuals';

// כרום משותף של רכיבי ai-internals (ChatInterfacePanel, ConfidenceMeter). העברית היא
// המקור; שאר השפות הן stubs שמייצאים מחדש את העברית עד שיתורגמו (en כבר מתורגם).
import { aiInternals as heAiInternals } from './locales/he/behind-ai/aiInternals';
import { aiInternals as arAiInternals } from './locales/ar/behind-ai/aiInternals';
import { aiInternals as ruAiInternals } from './locales/ru/behind-ai/aiInternals';
import { aiInternals as enAiInternals } from './locales/en/behind-ai/aiInternals';
import { aiInternals as esAiInternals } from './locales/es/behind-ai/aiInternals';
import { aiInternals as jaAiInternals } from './locales/ja/behind-ai/aiInternals';

// דפי המידע של הלומדה (אודות, שאלות נפוצות, קשר, תנאי בטא, פרטיות, נגישות). העברית היא
// שפת המקור ומגדירה את הטיפוס; כל שש השפות מתורגמות באמת.
import { infoPages as heInfoPages } from './locales/he/behind-ai/infoPages';
import { infoPages as arInfoPages } from './locales/ar/behind-ai/infoPages';
import { infoPages as ruInfoPages } from './locales/ru/behind-ai/infoPages';
import { infoPages as enInfoPages } from './locales/en/behind-ai/infoPages';
import { infoPages as esInfoPages } from './locales/es/behind-ai/infoPages';
import { infoPages as jaInfoPages } from './locales/ja/behind-ai/infoPages';

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
export type EvaluationScoreDict = typeof heEvaluationScore;
export type DoesAiLearnDict = typeof heDoesAiLearn;
export type ChatToAgentDict = typeof heChatToAgent;
export type GuardrailsDict = typeof heGuardrails;
export type FullTraceDict = typeof heFullTrace;
export type IntroductionDict = typeof heIntroduction;
export type IntroPreviewDict = typeof heIntroPreview;
export type ConceptLabelsDict = typeof heConceptLabels;
export type ChapterBridgesDict = typeof heChapterBridges;
export type FinalExamDict = typeof heFinalExam;
export type ChapterQuizDict = typeof heChapterQuiz;
export type IntroVisualsDict = typeof heIntroVisuals;
export type AiInternalsDict = typeof heAiInternals;
export type InfoPagesDict = typeof heInfoPages;

/** מרחב הלומדה "מאחורי הקלעים של AI". מתרחב עם כל פרק שעובר i18n. */
export interface BehindAiDict {
    introduction: IntroductionDict;
    introPreview: IntroPreviewDict;
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
    evaluationScore: EvaluationScoreDict;
    doesAiLearn: DoesAiLearnDict;
    chatToAgent: ChatToAgentDict;
    guardrails: GuardrailsDict;
    fullTrace: FullTraceDict;
    conceptLabels: ConceptLabelsDict;
    chapterBridges: ChapterBridgesDict;
    finalExam: FinalExamDict;
    chapterQuiz: ChapterQuizDict;
    introVisuals: IntroVisualsDict;
    aiInternals: AiInternalsDict;
    infoPages: InfoPagesDict;
}

export interface Dictionary {
    catalog: CatalogDict;
    chrome: ChromeDict;
    behindAi: BehindAiDict;
}

/**
 * מרחבי-שמות מוגנים (המבוא המלא, פרקים 1-19 ומבחן הסיום). הם אינם במילון הלקוח: התוכן שלהם
 * נטען רק בשרת (i18n/chapterContent.server.ts) אחרי בדיקת הרשאה, ומגיע לעמוד דרך
 * ProtectedContentProvider. useT ממזג אותם לתוך t.behindAi בתוך העמוד המוגן בלבד.
 */
export const PROTECTED_NAMESPACES = [
    // המבוא המלא ופרק 1: ללומד מחובר ומאומת. לאורחים יש רק introPreview (ההירו ודוגמת הצ'אט).
    'introduction', 'introVisuals', 'chapter1',
    'chapter2', 'chapter3', 'chapter4', 'generationLoop', 'semanticSpace', 'attention', 'contextWindow',
    'logitsSoftmax', 'decoding', 'hallucinations', 'grounding', 'selfCheck', 'mistakeLearning', 'evaluation',
    'evaluationScore', 'doesAiLearn', 'chatToAgent', 'guardrails', 'fullTrace', 'finalExam',
    // משותפים לכל הפרקים המוגנים: שמות המושגים ומשפטי הגשר בין הפרקים.
    'conceptLabels', 'chapterBridges',
] as const satisfies readonly (keyof BehindAiDict)[];
export type ProtectedNamespace = (typeof PROTECTED_NAMESPACES)[number];

type PublicDictionary = Omit<Dictionary, 'behindAi'> & {
    behindAi: Omit<BehindAiDict, ProtectedNamespace> & { conceptLabels: ConceptLabelsDict };
};

// שמות המושגים שייכים כולם לפרקים המוגנים (למושגי פרק 1 אין תווית), ולכן המילון הציבורי
// מחזיק מפה ריקה. עמוד מוגן, ו-layout למשתמש עם הרשאה פעילה, מקבלים את המפה המלאה מהשרת.
const NO_CONCEPT_LABELS: ConceptLabelsDict = {};

const DICTS: Record<Locale, PublicDictionary> = {
    he: { catalog: heCatalog, chrome: heChrome, behindAi: { introPreview: heIntroPreview, conceptLabels: NO_CONCEPT_LABELS, chapterQuiz: heChapterQuiz, aiInternals: heAiInternals, infoPages: heInfoPages } },
    ar: { catalog: arCatalog, chrome: arChrome, behindAi: { introPreview: arIntroPreview, conceptLabels: NO_CONCEPT_LABELS, chapterQuiz: arChapterQuiz, aiInternals: arAiInternals, infoPages: arInfoPages } },
    ru: { catalog: ruCatalog, chrome: ruChrome, behindAi: { introPreview: ruIntroPreview, conceptLabels: NO_CONCEPT_LABELS, chapterQuiz: ruChapterQuiz, aiInternals: ruAiInternals, infoPages: ruInfoPages } },
    en: { catalog: enCatalog, chrome: enChrome, behindAi: { introPreview: enIntroPreview, conceptLabels: NO_CONCEPT_LABELS, chapterQuiz: enChapterQuiz, aiInternals: enAiInternals, infoPages: enInfoPages } },
    es: { catalog: esCatalog, chrome: esChrome, behindAi: { introPreview: esIntroPreview, conceptLabels: NO_CONCEPT_LABELS, chapterQuiz: esChapterQuiz, aiInternals: esAiInternals, infoPages: esInfoPages } },
    ja: { catalog: jaCatalog, chrome: jaChrome, behindAi: { introPreview: jaIntroPreview, conceptLabels: NO_CONCEPT_LABELS, chapterQuiz: jaChapterQuiz, aiInternals: jaAiInternals, infoPages: jaInfoPages } },
};

/**
 * מחזיר את המילון הציבורי לשפה, עם נפילה לעברית אם השפה לא נמצאה.
 * הטיפוס כולל גם את המרחבים המוגנים כדי שעמודי הפרקים יישארו בטוחי-טיפוס, אבל בזמן ריצה
 * הם קיימים רק בתוך ProtectedContentProvider (ראו useT). מחוץ לעמוד מוגן אין לגשת אליהם.
 */
export function getDictionary(locale: Locale): Dictionary {
    return (DICTS[locale] ?? DICTS.he) as Dictionary;
}
