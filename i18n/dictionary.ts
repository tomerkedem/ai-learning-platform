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

// פרק 5 (פיילוט i18n של הפרקים). העברית היא המקור; שאר השפות הן stubs שמייצאים מחדש
// את העברית (fallback בטוח) עד שיתורגמו בשלב מאוחר יותר.
import { chapter5 as heChapter5 } from './locales/he/behind-ai/chapter5';
import { chapter5 as arChapter5 } from './locales/ar/behind-ai/chapter5';
import { chapter5 as ruChapter5 } from './locales/ru/behind-ai/chapter5';
import { chapter5 as enChapter5 } from './locales/en/behind-ai/chapter5';
import { chapter5 as esChapter5 } from './locales/es/behind-ai/chapter5';
import { chapter5 as jaChapter5 } from './locales/ja/behind-ai/chapter5';
import { semanticSpace as heSemanticSpace } from './locales/he/behind-ai/semanticSpace';
import { semanticSpace as arSemanticSpace } from './locales/ar/behind-ai/semanticSpace';
import { semanticSpace as ruSemanticSpace } from './locales/ru/behind-ai/semanticSpace';
import { semanticSpace as enSemanticSpace } from './locales/en/behind-ai/semanticSpace';
import { semanticSpace as esSemanticSpace } from './locales/es/behind-ai/semanticSpace';
import { semanticSpace as jaSemanticSpace } from './locales/ja/behind-ai/semanticSpace';

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
export type Chapter5Dict = typeof heChapter5;
export type SemanticSpaceDict = typeof heSemanticSpace;
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
    chapter5: Chapter5Dict;
    semanticSpace: SemanticSpaceDict;
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
    he: { catalog: heCatalog, chrome: heChrome, behindAi: { introduction: heIntroduction, chapter1: heChapter1, chapter2: heChapter2, chapter3: heChapter3, chapter4: heChapter4, chapter5: heChapter5, semanticSpace: heSemanticSpace, conceptLabels: heConceptLabels, finalExam: heFinalExam, chapterQuiz: heChapterQuiz, introVisuals: heIntroVisuals, aiInternals: heAiInternals } },
    ar: { catalog: arCatalog, chrome: arChrome, behindAi: { introduction: arIntroduction, chapter1: arChapter1, chapter2: arChapter2, chapter3: arChapter3, chapter4: arChapter4, chapter5: arChapter5, semanticSpace: arSemanticSpace, conceptLabels: arConceptLabels, finalExam: arFinalExam, chapterQuiz: arChapterQuiz, introVisuals: arIntroVisuals, aiInternals: arAiInternals } },
    ru: { catalog: ruCatalog, chrome: ruChrome, behindAi: { introduction: ruIntroduction, chapter1: ruChapter1, chapter2: ruChapter2, chapter3: ruChapter3, chapter4: ruChapter4, chapter5: ruChapter5, semanticSpace: ruSemanticSpace, conceptLabels: ruConceptLabels, finalExam: ruFinalExam, chapterQuiz: ruChapterQuiz, introVisuals: ruIntroVisuals, aiInternals: ruAiInternals } },
    en: { catalog: enCatalog, chrome: enChrome, behindAi: { introduction: enIntroduction, chapter1: enChapter1, chapter2: enChapter2, chapter3: enChapter3, chapter4: enChapter4, chapter5: enChapter5, semanticSpace: enSemanticSpace, conceptLabels: enConceptLabels, finalExam: enFinalExam, chapterQuiz: enChapterQuiz, introVisuals: enIntroVisuals, aiInternals: enAiInternals } },
    es: { catalog: esCatalog, chrome: esChrome, behindAi: { introduction: esIntroduction, chapter1: esChapter1, chapter2: esChapter2, chapter3: esChapter3, chapter4: esChapter4, chapter5: esChapter5, semanticSpace: esSemanticSpace, conceptLabels: esConceptLabels, finalExam: esFinalExam, chapterQuiz: esChapterQuiz, introVisuals: esIntroVisuals, aiInternals: esAiInternals } },
    ja: { catalog: jaCatalog, chrome: jaChrome, behindAi: { introduction: jaIntroduction, chapter1: jaChapter1, chapter2: jaChapter2, chapter3: jaChapter3, chapter4: jaChapter4, chapter5: jaChapter5, semanticSpace: jaSemanticSpace, conceptLabels: jaConceptLabels, finalExam: jaFinalExam, chapterQuiz: jaChapterQuiz, introVisuals: jaIntroVisuals, aiInternals: jaAiInternals } },
};

/** מחזיר את המילון לשפה, עם נפילה לעברית אם השפה לא נמצאה. */
export function getDictionary(locale: Locale): Dictionary {
    return DICTS[locale] ?? DICTS.he;
}
