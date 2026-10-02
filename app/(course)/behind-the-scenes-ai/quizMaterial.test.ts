// Quiz question material: a model response is declared in the data (context, prompt,
// modelResponses), never inferred from quotes or prefixes. All six locales carry the same
// structure for the same question, and the answer logic of migrated questions is unchanged.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");
const read = (...rel: string[]) => readFileSync(join(ROOT, ...rel), "utf8");
const LOCALES = ["he", "en", "es", "ru", "ar", "ja"] as const;

interface Material { context?: string; prompt?: string; modelResponses?: { label?: string; text: string }[] }
type Entry = Material & { question: string; options: string[]; explanation: string };
type Quiz = { byId: Record<number, Entry> };

// Every chapter quiz dictionary (file, export name). Chapter 1-19 order.
const QUIZZES: [string, string][] = [
    ["chapter1Quiz", "chapter1Quiz"], ["chapter2Quiz", "chapter2Quiz"], ["chapter3Quiz", "chapter3Quiz"],
    ["chapter4Quiz", "chapter4Quiz"], ["semanticSpaceQuiz", "semanticSpaceQuiz"], ["attentionQuiz", "attentionQuiz"],
    ["contextWindowQuiz", "contextWindowQuiz"], ["logitsSoftmaxQuiz", "logitsSoftmaxQuiz"], ["decodingQuiz", "decodingQuiz"],
    ["generationLoopQuiz", "generationLoopQuiz"], ["hallucinationsQuiz", "hallucinationsQuiz"], ["groundingQuiz", "groundingQuiz"],
    ["selfCheckQuiz", "selfCheckQuiz"], ["mistakeLearningQuiz", "mistakeLearningQuiz"], ["evaluationQuiz", "evaluationQuiz"],
    ["doesAiLearnQuiz", "doesAiLearnQuiz"], ["chatToAgentQuiz", "chatToAgentQuiz"], ["guardrailsQuiz", "guardrailsQuiz"],
    ["fullTraceQuiz", "fullTraceQuiz"],
];

async function load(locale: string, file: string): Promise<Quiz> {
    const mod = await import(pathToFileURL(join(ROOT, "i18n", "locales", locale, "behind-ai", `${file}.ts`)).href);
    const quiz = Object.values(mod).find((v) => !!v && typeof v === "object" && "byId" in (v as object)) as Quiz | undefined;
    assert.ok(quiz, `${locale}/${file} exports a quiz`);
    return quiz;
}

const shape = (e: Entry) => ({
    context: !!e.context,
    prompt: !!e.prompt,
    responses: (e.modelResponses ?? []).length,
    labelled: (e.modelResponses ?? []).map((r) => !!r.label),
});

// The only questions that present output the model produced (by meaning, decided by hand).
const MIGRATED: Record<string, number[]> = { generationLoopQuiz: [2, 3], hallucinationsQuiz: [5], selfCheckQuiz: [3] };

test("material structure is identical in all six locales, and only declared questions carry it", async () => {
    let declared = 0;
    for (const [file] of QUIZZES) {
        const he = await load("he", file);
        for (const [id, entry] of Object.entries(he.byId)) {
            const expectMaterial = (MIGRATED[file] ?? []).includes(Number(id));
            assert.equal(!!entry.modelResponses?.length, expectMaterial, `${file} #${id}: model responses only where declared`);
            if (expectMaterial) declared++;
            for (const locale of LOCALES.slice(1)) {
                const other = (await load(locale, file)).byId[Number(id)];
                assert.ok(other, `${locale}/${file} #${id} exists`);
                // Same roles, same number of responses, same labelled/unlabelled pattern: a Hebrew
                // base field can never leak into another locale through the merge by id.
                assert.deepEqual(shape(other), shape(entry), `${locale}/${file} #${id}: same material shape as he`);
                assert.equal(other.options.length, entry.options.length, `${locale}/${file} #${id}: options count`);
            }
        }
    }
    assert.equal(declared, 4);
});

test("quoted user input and example sentences are not model responses", async () => {
    // Chapter 2 user messages, chapter 5 example sentences, chapter 7 earlier message, chapter 11
    // visitor question: quoted, but not model output. They stay inside the question text.
    const plain: [string, number][] = [["chapter2Quiz", 2], ["chapter2Quiz", 3], ["chapter2Quiz", 5], ["semanticSpaceQuiz", 3],
        ["contextWindowQuiz", 3], ["hallucinationsQuiz", 3], ["attentionQuiz", 5], ["generationLoopQuiz", 5]];
    for (const locale of LOCALES) {
        for (const [file, id] of plain) {
            const e = (await load(locale, file)).byId[id];
            assert.equal(e.modelResponses, undefined, `${locale}/${file} #${id}`);
            assert.equal(e.prompt, undefined, `${locale}/${file} #${id}`);
        }
    }
    // The renderer reads only the declared fields; it never parses the question text.
    const engine = read("components", "content", "AssessmentEngine.tsx");
    const material = engine.slice(engine.indexOf("function QuestionMaterial("), engine.indexOf("// אינדקסים מקוריים"));
    assert.ok(material.length > 0);
    assert.doesNotMatch(material, /question\.question|\.split\(|\.match\(|\.replace\(|RegExp/);
    assert.match(material, /if \(!question\.context && !question\.prompt && responses\.length === 0\) return null;/);
});

test("a single model response and multiple responses keep their order and labels", async () => {
    for (const locale of LOCALES) {
        const gl = await load(locale, "generationLoopQuiz");
        assert.equal(gl.byId[2].modelResponses!.length, 1, `${locale} ch10 Q2: one response`);
        assert.equal(gl.byId[2].modelResponses![0].label, undefined);
        // Q3: one prompt and two runs of it, in order. Both responses continue that same prompt
        // (two openings of the chapter's pasta answer); the first is the Q2 chunk.
        const q3 = gl.byId[3];
        assert.ok(q3.prompt);
        assert.equal(q3.context, undefined, `${locale}: the question itself states the setup`);
        assert.equal(q3.modelResponses!.length, 2);
        assert.notEqual(q3.modelResponses![0].text, q3.modelResponses![1].text);
        assert.equal(q3.modelResponses![0].text, gl.byId[2].modelResponses![0].text, `${locale}: Q3 run 1 is the Q2 chunk`);
        assert.match(q3.modelResponses![0].label!, /1/);
        assert.match(q3.modelResponses![1].label!, /2/);
        // Q11.5: the three labels are the ones the options and explanation refer to.
        const h5 = (await load(locale, "hallucinationsQuiz")).byId[5];
        const labels = h5.modelResponses!.map((r) => r.label!);
        assert.equal(labels.length, 3);
        for (const label of labels) assert.ok(h5.explanation.includes(`(${label})`), `${locale} ch11 Q5: "${label}" referenced in the explanation`);
        assert.ok(h5.options[1].includes(`(${labels[1]})`) && h5.options[1].includes(`(${labels[2]})`), `${locale} ch11 Q5: correct option names b and c`);
        // Q13.3: the draft is the model response; the source stays context.
        const s3 = (await load(locale, "selfCheckQuiz")).byId[3];
        assert.equal(s3.modelResponses!.length, 1);
        assert.ok(s3.modelResponses![0].label && s3.context);
        // The question field is only the question: none of the material is repeated inside it.
        for (const e of [gl.byId[2], q3, h5, s3]) {
            for (const r of e.modelResponses!) assert.ok(!e.question.includes(r.text), `${locale}: response text not inside question`);
            if (e.prompt) assert.ok(!e.question.includes(e.prompt));
        }
    }
});

test("Chapter 10 Hebrew: the corrected prompt sentence and the sampling question", async () => {
    const q3 = (await load("he", "generationLoopQuiz")).byId[3];
    assert.equal(q3.prompt, "אני מנסה להכין פסטה, והיא תמיד יוצאת לי לא טעימה. מה לעשות?");
    assert.equal(q3.question, "אותו Prompt בדיוק נשלח למודל פעמיים. שום דבר ב-Prompt לא השתנה. למה בכל זאת התקבלו תשובות שונות?");
    assert.equal(q3.options[1], "כי המודל בוחר טוקנים מתוך התפלגות הסתברויות, ולכן אותו Prompt יכול להוביל לבחירות שונות בהרצות שונות");
    for (const file of [["i18n", "locales", "he", "behind-ai", "generationLoopLab.ts"], ["app", "(course)", "behind-the-scenes-ai", "quizQuestions.ts"]]) {
        assert.doesNotMatch(read(...file), /ותמיד יוצאת לי לא טעימה/);
    }
});

// Chapter 10 Q3 teaches probabilistic decoding: the same unchanged prompt, run twice, can yield
// different outputs because tokens are sampled from a distribution; context divergence follows.
test("Chapter 10 Q3: same unchanged prompt, sampling as the root cause, divergence as the consequence", async () => {
    const terms: Record<(typeof LOCALES)[number], { twice: RegExp; unchanged: RegExp; distribution: string; sampling: string; context: string; condition: string }> = {
        he: { twice: /פעמיים/, unchanged: /לא השתנה/, distribution: "התפלגות הסתברויות", sampling: "דגימה", context: "להקשר", condition: "כאשר תהליך הבחירה כולל דגימה" },
        en: { twice: /twice/, unchanged: /Nothing in the prompt changed/, distribution: "probability distribution", sampling: "sampling", context: "context", condition: "When the selection process includes sampling" },
        es: { twice: /dos veces/, unchanged: /Nada en el Prompt cambió/, distribution: "distribución de probabilidades", sampling: "muestreo", context: "contexto", condition: "Cuando el proceso de elección incluye muestreo" },
        ru: { twice: /дважды/, unchanged: /ничего не изменилось/, distribution: "распределения вероятностей", sampling: "сэмплирование", context: "контекст", condition: "Когда выбор включает сэмплирование" },
        ar: { twice: /مرّتين/, unchanged: /لم يتغيّر/, distribution: "توزيع احتمالات", sampling: "معاينة", context: "السياق", condition: "حين تتضمّن عملية الاختيار معاينة" },
        ja: { twice: /2回/, unchanged: /変わっていません/, distribution: "確率分布", sampling: "サンプリング", context: "文脈", condition: "選択の過程にサンプリングが含まれていると" },
    };
    for (const locale of LOCALES) {
        const t = terms[locale];
        const q3 = (await load(locale, "generationLoopQuiz")).byId[3];
        // The question states an identical, unchanged prompt sent twice.
        assert.match(q3.question, t.twice, `${locale}: twice`);
        assert.match(q3.question, t.unchanged, `${locale}: unchanged prompt`);
        // Index 1 (the stored correctAnswer) names probabilistic token selection, not the context effect.
        assert.ok(q3.options[1].includes(t.distribution), `${locale}: correct option names the distribution`);
        assert.ok(!q3.options[1].includes(t.context), `${locale}: correct option is not the context consequence`);
        for (const i of [0, 2, 3]) {
            assert.ok(!q3.options[i].includes(t.distribution), `${locale}: distractor ${i} does not name the distribution`);
            // The premise says the prompt is identical and unchanged: no distractor may blame the prompt.
            assert.doesNotMatch(q3.options[i], /prompt|プロンプト/i, `${locale}: distractor ${i} does not contradict the premise`);
        }
        assert.equal(new Set(q3.options).size, 4, `${locale}: four distinct options`);
        // Explanation: conditional on sampling (not every decoding is stochastic), root cause before divergence.
        const ex = q3.explanation;
        assert.ok(ex.includes(t.condition), `${locale}: sampling stated as a condition`);
        assert.ok(ex.indexOf(t.sampling) >= 0 && ex.indexOf(t.context) > ex.indexOf(t.sampling), `${locale}: sampling explained before context divergence`);
        assert.doesNotMatch(ex, /always|תמיד|siempre|всегда|دائمًا|必ず/, `${locale}: no claim that outputs always differ`);
    }
});

test("migrated questions keep their answer logic in the server base", () => {
    const base = read("app", "(course)", "behind-the-scenes-ai", "quizQuestions.ts");
    const entry = (constName: string, id: number) => {
        const start = base.indexOf(`export const ${constName}: QuizQuestion[]`);
        const from = base.indexOf(`id: ${id},`, start);
        return base.slice(from, base.indexOf("\n    }", from));
    };
    // [quiz, id, correctAnswer, correct option text, concept, difficulty]
    const expected: [string, number, number, string, string, string][] = [
        ["generationLoopQuiz", 2, 1, "הוא הפך לחלק מההקשר ומשפיע על אילו המשכים יקבלו משקל גבוה בצעד הבא", "פלט הופך לקלט", "medium"],
        ["generationLoopQuiz", 3, 1, "כי המודל בוחר טוקנים מתוך התפלגות הסתברויות, ולכן אותו Prompt יכול להוביל לבחירות שונות בהרצות שונות", "צעד מוקדם מכוון", "medium"],
        ["selfCheckQuiz", 3, 1, "\\\"פתוחה בחג בין 10:00 ל-14:00\\\", כי המקור לא נותן שעות חג", "טענה לא נתמכת", "medium"],
    ];
    for (const [quiz, id, correct, option, concept, difficulty] of expected) {
        const e = entry(quiz, id);
        assert.match(e, new RegExp(`correctAnswer: ${correct},`), `${quiz} #${id} correctAnswer`);
        const options = [...e.slice(e.indexOf("options: ["), e.indexOf("],", e.indexOf("options: ["))).matchAll(/^\s+"((?:[^"\\]|\\.)*)",?$/gm)].map((m) => m[1]);
        assert.equal(options[correct], option, `${quiz} #${id} correct option`);
        assert.ok(e.includes(`concept: "${concept}"`) && e.includes(`difficulty: "${difficulty}"`), `${quiz} #${id} concept/difficulty`);
        assert.ok(e.includes("modelResponses: ["), `${quiz} #${id} declares its model response`);
    }
    const h5 = entry("hallucinationsQuiz", 5);
    assert.match(h5, /correctAnswer: 1,/);
    assert.ok(h5.includes('{ label: "א", text: "הספרייה פתוחה בחג בין 10:00 ל-14:00" },'));
});

test("labels exist in all six locales and the renderer exposes them semantically", () => {
    for (const locale of LOCALES) {
        const chrome = read("i18n", "locales", locale, "chrome.ts");
        const block = chrome.slice(chrome.indexOf("assessment: {"), chrome.indexOf("\n    },", chrome.indexOf("assessment: {")));
        for (const key of ["prompt", "modelResponse", "modelResponses"]) {
            assert.match(block, new RegExp(`\\n\\s+${key}: '[^']+',`), `${locale}: assessment.${key}`);
        }
        assert.doesNotMatch(block, /[\u2013\u2014]/, `${locale}: no en/em dash`);
    }
    const engine = read("components", "content", "AssessmentEngine.tsx");
    // figure + figcaption name the group; blockquote marks the quoted artifact; read-aloud follows the visual order.
    assert.match(engine, /<figure className="rounded-e-xl border-s-2 [^"]*">\s*<figcaption className=\{MATERIAL_CAPTION\}>\{responsesCaption\(responses\.length, labels\)\}<\/figcaption>/);
    assert.match(engine, /<blockquote className=\{`mt-1 \$\{MATERIAL_TEXT\}`\}>\{question\.prompt\}<\/blockquote>/);
    assert.match(engine, /speakJoin\(\s*q\.context,\s*q\.prompt && `\$\{l\.prompt\}: \$\{q\.prompt\}`,\s*\.\.\.responses\.map\(/);
    assert.match(engine, /<QuestionMaterial question=\{currentQuestion\} labels=\{a\} \/>\s*\{\/\* שורת השאלה/);
    assert.match(engine, /<SpeakButton text=\{questionSpeech\(currentQuestion, a\)\}/);
});

// Quiz scores are 0-100 scores, not percentages: no learner-facing score is rendered with "%",
// and assistive technology hears "score N out of 100" in every locale.
test("quiz scores render as 0-100 scores without a percent sign", () => {
    const sources = {
        engine: read("components", "content", "AssessmentEngine.tsx"),
        dashboard: read("app", "(course)", "behind-the-scenes-ai", "MasteryDashboard.tsx"),
    };
    // Any score-like expression followed by "%" (JSX text or template literal) is a regression.
    const scoreWithPercent = /\{(?:scoreValue|[\w.?]*score(?:Percent|Value)?|[\w.?]*(?:average|best)Score(?:Percent)?)\}%|\$\{[^}]*(?:score|Score)[^}]*\}%/;
    for (const [name, src] of Object.entries(sources)) assert.doesNotMatch(src, scoreWithPercent, `${name}: no score rendered with %`);
    // The ring shows the bare number and gives screen readers the localized phrase.
    assert.match(sources.engine, /\{scoreValue\}\s*<\/motion\.div>\s*\{\/\*[^]*?\*\/\}\s*<span className="sr-only">\{a\.scoreOutOf\(scoreValue\)\}<\/span>/);
    for (const locale of LOCALES) {
        const chrome = read("i18n", "locales", locale, "chrome.ts");
        const line = chrome.match(/scoreOutOf: \([^)]*\) => `([^`]+)`,/);
        assert.ok(line, `${locale}: assessment.scoreOutOf`);
        assert.ok(line[1].includes("${score}") && line[1].includes("100"), `${locale}: score out of 100`);
        assert.doesNotMatch(line[1], /%|％/, `${locale}: no percent sign`);
    }
});
