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
    vocabFor,
    matchedWords,
    hasBarcode,
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
    // תחנת-מסע (סצנה קולנועית תולבש בשלבים): מציגה את טוקני המשפט הנבחר כעוגן קבוע.
    | (TraceBase & { kind: 'station'; tokens: string[] })
    // Embedding: טוקני המשפט עפים אל מרחב-משמעות (מיקום = משמעות, המחשה).
    | (TraceBase & { kind: 'embeddingScene'; tokens: string[] })
    // Attention: הטוקן הממוקד (pivot, למשל שלילה) שוקל את שכניו ומעצב את המשמעות.
    | (TraceBase & { kind: 'attentionScene'; tokens: string[]; pivot: number })
    // תחנות-עומק על טוקני המשפט: מיקום/סדר, חלון-הקשר, feed-forward, שכבות, מצב פנימי.
    | (TraceBase & { kind: 'positionScene'; tokens: string[] })
    | (TraceBase & { kind: 'contextScene'; tokens: string[] })
    | (TraceBase & { kind: 'ffScene'; tokens: string[] })
    | (TraceBase & { kind: 'layersScene'; tokens: string[] })
    | (TraceBase & { kind: 'stateScene'; tokens: string[] })
    // Decoding: רגע-הבחירה. התמונה ההסתברותית הופכת להחלטה - המוביל ננעל מול החלופות.
    | (TraceBase & { kind: 'decisionScene'; items: IntentProbability[]; margin: number; level: Confidence })
    // Agent (שלד): צ'יפים של כלים / כלי-נבחר + תג MCP + סמן-לולאה. יולבש בסצנות בשלב 2.
    | (TraceBase & { kind: 'agentStub'; chips: string[]; mcp?: boolean; loop?: boolean })
    // Agent Step 2: לולאת-החשיבה, גשר-MCP, ושער-הבקרה (guardrails).
    | (TraceBase & { kind: 'loopScene'; nodes: string[]; outcomes: string[] })
    | (TraceBase & { kind: 'mcpScene'; agentLabel: string; mcpLabel: string; toolLabel: string; resultLabel: string })
    | (TraceBase & { kind: 'guardrailScene'; sensitive: boolean; safe: string; ask: string; approve: string; stop: string })
    | (TraceBase & { kind: 'reply'; text: string });

/* ════════════════════════ Chat: התחנות המרכזיות ═════════════════════════ */

export function traceChatEngine(text: string, viz: Chapter1VisualsDict): EngineTraceStep[] {
    const r = runChatEngine(text);
    const tokens = r.tokens;
    const top = r.intents[0];
    const second = r.intents[1];
    const margin = Math.max(0, (top?.value ?? 0) - (second?.value ?? 0));

    // תוויות הכוונה של mockEngine הן מזהים באנגלית. ממפים לתצוגה בשפת הלומד לפני
    // שהן מגיעות למסך (Logits + Decoding). הערכים (ההסתברויות) לא משתנים.
    const intentMap = viz.trace.labels.intent as Record<string, string>;
    const intentItems: IntentProbability[] = r.intents.map((i) => ({ ...i, label: intentMap[i.label] ?? i.label }));

    // ה-pivot לסצנת הקשב: טוקן השלילה אם קיים (למשל "לא" ב"החבילה לא הגיעה"),
    // כי הוא זה שמעצב חזק את המשמעות. אחרת - טוקן שני (או ראשון) כברירת מחדל.
    const vocab = vocabFor(text);
    const negIdx = tokens.findIndex((tk) => vocab.negation.some((n) => tk.toLowerCase().includes(n.trim().toLowerCase())));
    const pivot = negIdx >= 0 ? negIdx : Math.min(1, Math.max(0, tokens.length - 1));

    // ── "מסע המשפט": 14 תחנות מיושרות למפת המבוא, על אותו משפט (הפרומפט) ──
    // המחרוזות התלויות-שפה (כותרות, כיתובים, אזורים) מגיעות מ-viz.journey (מרוכזות
    // ל-6 שפות). המונחים האנגליים (Prompt...) וסוגי הסצנה נשארים מבניים כאן. הערכים
    // (הסתברויות, ביטחון) מגיעים מ-runChatEngine כהמחשה של העיקרון, לא כפלט אמיתי.
    const st = viz.journey.stations;
    const { A: ZA, B: ZB, C: ZC, D: ZD } = viz.journey.zones;

    return [
        { id: 's1', act: ZA, actEn: 'Text to units', title: st.s1.title, titleEn: 'Prompt', note: st.s1.note, kind: 'raw', value: text || '-' },
        { id: 's2', act: ZA, actEn: 'Text to units', title: st.s2.title, titleEn: 'Tokenization', note: st.s2.note, kind: 'tokens', tokens },
        { id: 's3', act: ZA, actEn: 'Text to units', title: st.s3.title, titleEn: 'Token IDs', note: st.s3.note, kind: 'count', value: tokens.length, unit: viz.trace.unit },

        { id: 's4', act: ZB, actEn: 'To representations', title: st.s4.title, titleEn: 'Embedding', note: st.s4.note, kind: 'embeddingScene', tokens },
        { id: 's5', act: ZB, actEn: 'To representations', title: st.s5.title, titleEn: 'Positional Encoding', note: st.s5.note, kind: 'positionScene', tokens },
        { id: 's6', act: ZB, actEn: 'To representations', title: st.s6.title, titleEn: 'Context Window', note: st.s6.note, kind: 'contextScene', tokens },

        { id: 's7', act: ZC, actEn: 'Computing context', title: st.s7.title, titleEn: 'Attention', note: st.s7.note, kind: 'attentionScene', tokens, pivot },
        { id: 's8', act: ZC, actEn: 'Computing context', title: st.s8.title, titleEn: 'Feed-Forward', note: st.s8.note, kind: 'ffScene', tokens },
        { id: 's9', act: ZC, actEn: 'Computing context', title: st.s9.title, titleEn: 'Transformer', note: st.s9.note, kind: 'layersScene', tokens },
        { id: 's10', act: ZC, actEn: 'Computing context', title: st.s10.title, titleEn: 'Hidden State', note: st.s10.note, kind: 'stateScene', tokens },

        { id: 's11', act: ZD, actEn: 'To the answer', title: st.s11.title, titleEn: 'Logits', note: st.s11.note, kind: 'probabilities', items: intentItems },
        { id: 's12', act: ZD, actEn: 'To the answer', title: st.s12.title, titleEn: 'Softmax', note: st.s12.note, kind: 'gap', top: top?.value ?? 0, second: second?.value ?? 0, margin },
        { id: 's13', act: ZD, actEn: 'To the answer', title: st.s13.title, titleEn: 'Decoding', note: st.s13.note, kind: 'decisionScene', items: intentItems, margin, level: r.confidence },
        { id: 's14', act: ZD, actEn: 'To the answer', title: st.s14.title, titleEn: 'Output', note: st.s14.note, kind: 'reply', text: viz.mockEngine.chatReplies[r.replyKey] },
    ];
}

/* ════════════════════════ Agent: התחנות המרכזיות ════════════════════════ */

export function traceAgentEngine(text: string, viz: Chapter1VisualsDict): EngineTraceStep[] {
    const r = runAgentEngine(text);
    // ── לולאת-הסוכן (Agent), שונה מ"מסע המשפט" של Chat: מטרה -> כלים (MCP) ->
    // בקרה -> קריאת-כלי -> תצפית -> לולאה -> פעולה/עצירה. שלד: תחנות + מבנה; הסצנות
    // הקולנועיות (בחירת-כלי, קריאת-MCP, לולאה, אישור) יולבשו בשלב 2. הערכים
    // (מטרה, סיכון, החלטה) מ-runAgentEngine כהמחשה, לא כפעולה אמיתית בעולם.
    const ag = viz.journey.agent;
    const st = ag.stations;
    const vocab = vocabFor(text);
    const barcode = hasBarcode(text);
    const sensitive = matchedWords(text, vocab.sensitiveWords).length > 0;
    const primaryTool = ag.toolNames[0] ?? '';
    const { understand: ZU, tools: ZT, control: ZG, exec: ZE, output: ZO } = ag.zones;

    // מזהי המשימה וההחלטה של mockEngine הם אנגלית פנימית. ממפים לתצוגה בשפת הלומד.
    const taskMap = viz.trace.labels.task as Record<string, string>;
    const decisionMap = viz.trace.labels.decision as Record<string, string>;
    const goalText = taskMap[r.task] ?? r.task;
    const finalDecision: DecisionState = { ...r.decision, label: decisionMap[r.decision.label] ?? r.decision.label };

    return [
        { id: 'a1', act: ZU, actEn: 'Understand', title: st.a1.title, titleEn: 'Request', note: st.a1.note, kind: 'raw', value: text || '-' },
        { id: 'a2', act: ZU, actEn: 'Understand', title: st.a2.title, titleEn: 'Goal', note: st.a2.note, kind: 'raw', value: goalText },

        { id: 'a3', act: ZT, actEn: 'Tools via MCP', title: st.a3.title, titleEn: 'Available Tools', note: st.a3.note, kind: 'agentStub', chips: ag.toolNames, mcp: true },
        { id: 'a4', act: ZT, actEn: 'Tools via MCP', title: st.a4.title, titleEn: 'Tool Selection', note: st.a4.note, kind: 'agentStub', chips: [primaryTool] },
        { id: 'a5', act: ZT, actEn: 'Tools via MCP', title: st.a5.title, titleEn: 'Missing Info', note: st.a5.note, kind: 'flag', on: !barcode, onLabel: ag.missingOn, offLabel: ag.missingOff },

        { id: 'a6', act: ZG, actEn: 'Guardrails', title: st.a6.title, titleEn: 'Risk & Permission', note: st.a6.note, kind: 'guardrailScene', sensitive, safe: ag.gate.safe, ask: ag.gate.ask, approve: ag.gate.approve, stop: ag.gate.stop },

        { id: 'a7', act: ZE, actEn: 'Execute & loop', title: st.a7.title, titleEn: 'Tool Call', note: st.a7.note, kind: 'mcpScene', agentLabel: ag.agentNode, mcpLabel: ag.mcp, toolLabel: primaryTool, resultLabel: ag.resultLabel },
        { id: 'a8', act: ZE, actEn: 'Execute & loop', title: st.a8.title, titleEn: 'Observation', note: st.a8.note, kind: 'raw', value: ag.observation },
        { id: 'a9', act: ZE, actEn: 'Execute & loop', title: st.a9.title, titleEn: 'Reasoning Loop', note: st.a9.note, kind: 'loopScene', nodes: ag.loopNodes, outcomes: ag.loopOutcomes },

        { id: 'a10', act: ZO, actEn: 'Action or stop', title: st.a10.title, titleEn: 'Final', note: st.a10.note, kind: 'decision', decision: finalDecision },
    ];
}
