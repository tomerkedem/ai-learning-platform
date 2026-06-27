// app/behind-the-scenes-ai/chapter-1/engineTrace.ts
//
// פירוק "המנוע השקוף" לתחנות מרכזיות מוצגות, מקובצות למערכות (acts).
// כל שלב הוא חשיפה כנה של מה שהמנוע כבר עושה: הערכים הסופיים (הסתברויות, ביטחון,
// החלטה) מגיעים ישירות מ-runChatEngine/runAgentEngine, והשלבים הביניים (טוקנים,
// התאמות מילות-מפתח, ספירות, דגלים) מחושבים עם אותם קבועים/עוזרים בדיוק שמייצא
// המנוע. אין כאן מספר חדש, אין שכפול נוסחה - רק שיקוף של הצינור הקיים.
//
// הטקסט המוצג (שמות מערכות, כותרות, כיתובים, תוויות) מגיע מהמילון (viz = chapter1
// Visuals) המועבר פנימה, כדי שהתצוגה תהיה תלוית-שפה. שמות המערכות באנגלית (actEn)
// ומזהי השלבים נשארים כאן כמבנה. אין מקף ארוך (U+2014).

import type { DecisionState, IntentProbability } from '@/components/ai-internals/types';
import type { Chapter1VisualsDict } from '@/i18n/locales/he/behind-ai/chapter1Visuals';

import {
    runChatEngine,
    runAgentEngine,
    CHAT_RULES,
    vocabFor,
    matchedWords,
    countHits,
    hasBarcode,
    joinTokens,
    type Confidence,
} from './mockEngine';

export interface TraceBase {
    id: string;
    /** מערכה (קיבוץ-על) להצגת overview-first. */
    act: string;
    actEn: string;
    title: string;
    titleEn: string;
    /** כיתוב כן וקצר לשלב. */
    note: string;
}

export type EngineTraceStep =
    | (TraceBase & { kind: 'raw'; value: string })
    | (TraceBase & { kind: 'normalize'; original: string; normalized: string; changed: boolean })
    | (TraceBase & { kind: 'tokens'; tokens: string[] })
    | (TraceBase & { kind: 'count'; value: number; unit: string })
    | (TraceBase & { kind: 'keywords'; groups: { label: string; matched: string[]; total: number }[] })
    | (TraceBase & { kind: 'flag'; on: boolean; onLabel: string; offLabel: string; detail?: string; triggerToken?: string })
    | (TraceBase & { kind: 'candidates'; items: { label: string; hits: number }[] })
    | (TraceBase & { kind: 'probabilities'; items: IntentProbability[] })
    | (TraceBase & { kind: 'winner'; label: string; value: number })
    | (TraceBase & { kind: 'gap'; top: number; second: number; margin: number })
    | (TraceBase & { kind: 'confidence'; level: Confidence })
    | (TraceBase & { kind: 'decision'; decision: DecisionState })
    | (TraceBase & { kind: 'reply'; text: string });

// שמות המערכות באנגלית (מבנה, לא תלוי-שפה). העברית מגיעה מ-viz.trace.acts.
const ACT_EN = {
    intake: 'Intake',
    analyze: 'Analysis',
    decide: 'Decision',
    output: 'Output',
    task: 'Task detection',
    risk: 'Risk & responsibility',
    act: 'Decision & output',
};

/* ════════════════════════ Chat: התחנות המרכזיות ═════════════════════════ */

export function traceChatEngine(text: string, viz: Chapter1VisualsDict): EngineTraceStep[] {
    const r = runChatEngine(text);
    const t = viz.trace;
    const c = t.chat;
    const vocab = vocabFor(text);
    const tokens = r.tokens;
    const lc = text.toLowerCase();
    const hasNeg = vocab.negation.some((w) => lc.includes(w));
    const negToken = vocab.negation.find((w) => lc.includes(w))?.trim();

    const groups = CHAT_RULES.map((rule) => ({
        label: rule.label,
        matched: matchedWords(text, vocab.chatWords[rule.key]),
        total: vocab.chatWords[rule.key].length,
    }));
    const candidates = [
        ...CHAT_RULES.map((rule) => ({ label: rule.label, hits: countHits(text, vocab.chatWords[rule.key]) })),
        { label: 'Other', hits: 0 },
    ];
    const top = r.intents[0];
    const second = r.intents[1];
    const margin = Math.max(0, (top?.value ?? 0) - (second?.value ?? 0));
    const normalized = joinTokens(tokens, text);

    return [
        { id: 'c1', act: t.acts.intake, actEn: ACT_EN.intake, title: c.c1.title, titleEn: 'Raw input', note: c.c1.note, kind: 'raw', value: text || '-' },
        { id: 'c2', act: t.acts.intake, actEn: ACT_EN.intake, title: c.c2.title, titleEn: 'Normalize', note: c.c2.note, kind: 'normalize', original: text, normalized, changed: text !== normalized },
        { id: 'c3', act: t.acts.intake, actEn: ACT_EN.intake, title: c.c3.title, titleEn: 'Tokenize', note: c.c3.note, kind: 'tokens', tokens },
        { id: 'c4', act: t.acts.intake, actEn: ACT_EN.intake, title: c.c4.title, titleEn: 'Token count', note: c.c4.note, kind: 'count', value: tokens.length, unit: t.unit },

        { id: 'c5', act: t.acts.analyze, actEn: ACT_EN.analyze, title: c.c5.title, titleEn: 'Keyword scan', note: c.c5.note, kind: 'keywords', groups },
        { id: 'c6', act: t.acts.analyze, actEn: ACT_EN.analyze, title: c.c6.title, titleEn: 'Negation', note: c.c6.note, kind: 'flag', on: hasNeg, onLabel: t.negationOn, offLabel: t.negationOff, detail: hasNeg ? t.negationDetail : undefined, triggerToken: negToken },
        { id: 'c7', act: t.acts.analyze, actEn: ACT_EN.analyze, title: c.c7.title, titleEn: 'Candidate intents', note: c.c7.note, kind: 'candidates', items: candidates },

        { id: 'c8', act: t.acts.decide, actEn: ACT_EN.decide, title: c.c8.title, titleEn: 'Probabilities', note: c.c8.note, kind: 'probabilities', items: r.intents },
        { id: 'c9', act: t.acts.decide, actEn: ACT_EN.decide, title: c.c9.title, titleEn: 'Top selection', note: c.c9.note, kind: 'winner', label: top?.label ?? '-', value: top?.value ?? 0 },
        { id: 'c10', act: t.acts.decide, actEn: ACT_EN.decide, title: c.c10.title, titleEn: 'Margin', note: c.c10.note, kind: 'gap', top: top?.value ?? 0, second: second?.value ?? 0, margin },
        { id: 'c11', act: t.acts.decide, actEn: ACT_EN.decide, title: c.c11.title, titleEn: 'Confidence', note: c.c11.note, kind: 'confidence', level: r.confidence },
        { id: 'c12', act: t.acts.decide, actEn: ACT_EN.decide, title: c.c12.title, titleEn: 'Meaning', note: c.c12.note, kind: 'raw', value: r.meaning },

        { id: 'c13', act: t.acts.output, actEn: ACT_EN.output, title: c.c13.title, titleEn: 'Decision', note: c.c13.note, kind: 'decision', decision: r.decision },
        { id: 'c14', act: t.acts.output, actEn: ACT_EN.output, title: c.c14.title, titleEn: 'Output state', note: c.c14.note, kind: 'raw', value: r.output },
        { id: 'c15', act: t.acts.output, actEn: ACT_EN.output, title: c.c15.title, titleEn: 'Reply', note: c.c15.note, kind: 'reply', text: viz.mockEngine.chatReplies[r.replyKey] },
    ];
}

/* ════════════════════════ Agent: התחנות המרכזיות ════════════════════════ */

export function traceAgentEngine(text: string, viz: Chapter1VisualsDict): EngineTraceStep[] {
    const r = runAgentEngine(text);
    const t = viz.trace;
    const ag = t.agent;
    const vocab = vocabFor(text);
    const tokens = r.tokens;
    const actionMatched = matchedWords(text, vocab.actionWords);
    const deliveryMatched = matchedWords(text, vocab.deliveryWords);
    const sensitiveMatched = matchedWords(text, vocab.sensitiveWords);
    const barcode = hasBarcode(text);
    const barcodeToken = text.match(/\d{6,}/)?.[0];
    const normalized = joinTokens(tokens, text);

    return [
        { id: 'a1', act: t.acts.intake, actEn: ACT_EN.intake, title: ag.a1.title, titleEn: 'Raw input', note: ag.a1.note, kind: 'raw', value: text || '-' },
        { id: 'a2', act: t.acts.intake, actEn: ACT_EN.intake, title: ag.a2.title, titleEn: 'Normalize', note: ag.a2.note, kind: 'normalize', original: text, normalized, changed: text !== normalized },
        { id: 'a3', act: t.acts.intake, actEn: ACT_EN.intake, title: ag.a3.title, titleEn: 'Tokenize', note: ag.a3.note, kind: 'tokens', tokens },
        { id: 'a4', act: t.acts.intake, actEn: ACT_EN.intake, title: ag.a4.title, titleEn: 'Token count', note: ag.a4.note, kind: 'count', value: tokens.length, unit: t.unit },

        { id: 'a5', act: t.acts.task, actEn: ACT_EN.task, title: ag.a5.title, titleEn: 'Action words', note: ag.a5.note, kind: 'keywords', groups: [{ label: t.actionWordsLabel, matched: actionMatched, total: vocab.actionWords.length }] },
        { id: 'a6', act: t.acts.task, actEn: ACT_EN.task, title: ag.a6.title, titleEn: 'Domain scan', note: ag.a6.note, kind: 'keywords', groups: [{ label: t.deliveryDomainLabel, matched: deliveryMatched, total: vocab.deliveryWords.length }] },
        { id: 'a7', act: t.acts.task, actEn: ACT_EN.task, title: ag.a7.title, titleEn: 'Identifier', note: ag.a7.note, kind: 'flag', on: barcode, onLabel: t.barcodeOn, offLabel: t.barcodeOff, detail: barcode ? t.barcodeOnDetail : t.barcodeOffDetail, triggerToken: barcodeToken },
        { id: 'a8', act: t.acts.task, actEn: ACT_EN.task, title: ag.a8.title, titleEn: 'Task detected', note: ag.a8.note, kind: 'raw', value: r.task },

        { id: 'a9', act: t.acts.risk, actEn: ACT_EN.risk, title: ag.a9.title, titleEn: 'Missing info', note: ag.a9.note, kind: 'raw', value: r.missingInfo },
        { id: 'a10', act: t.acts.risk, actEn: ACT_EN.risk, title: ag.a10.title, titleEn: 'Tool need', note: ag.a10.note, kind: 'flag', on: r.toolNeed.needed, onLabel: t.toolNeed(r.toolNeed.tool), offLabel: t.noTool },
        { id: 'a11', act: t.acts.risk, actEn: ACT_EN.risk, title: ag.a11.title, titleEn: 'Sensitivity', note: ag.a11.note, kind: 'keywords', groups: [{ label: t.sensitiveLabel, matched: sensitiveMatched, total: vocab.sensitiveWords.length }] },
        { id: 'a12', act: t.acts.risk, actEn: ACT_EN.risk, title: ag.a12.title, titleEn: 'Action readiness', note: ag.a12.note, kind: 'flag', on: r.canActNow, onLabel: t.canActNow, offLabel: t.cannotActYet, detail: t.riskDetail(r.risk) },

        { id: 'a13', act: t.acts.act, actEn: ACT_EN.act, title: ag.a13.title, titleEn: 'Decision', note: ag.a13.note, kind: 'decision', decision: r.decision },
        { id: 'a14', act: t.acts.act, actEn: ACT_EN.act, title: ag.a14.title, titleEn: 'Output state', note: ag.a14.note, kind: 'raw', value: r.output },
        { id: 'a15', act: t.acts.act, actEn: ACT_EN.act, title: ag.a15.title, titleEn: 'Reply', note: ag.a15.note, kind: 'reply', text: viz.mockEngine.agentReplies[r.replyKey] },
    ];
}
