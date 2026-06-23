"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Keyboard, MessageSquare, Workflow, Play, Pause, StepForward, RotateCcw,
    FunctionSquare, Presentation, ArrowLeftRight, Lightbulb, MousePointerClick,
    Info, Hash, BarChart3, CheckCircle2, XCircle, ArrowLeft, Maximize2, Layers,
    Globe, BookMarked, Sparkles, ShieldCheck, WifiOff, Radio, Loader2, AlertTriangle, Lock,
} from 'lucide-react';

import {
    traceChat, traceAgent, SUMMARY_SCENARIOS, FORMULAS, NARRATION,
    type Trace, type Stage, type StagePayload, type StageState, type Tone, type SectionNarration,
} from '@/app/behind-the-scenes-ai/chapter-14/traces';
import {
    SCENARIO_LIBRARY, getScenario, scenarioToTraces, DOMAIN_SWITCHER_NARRATION,
    type LibraryScenario,
} from '@/app/behind-the-scenes-ai/chapter-14/scenarioLibrary';
import { useLiveCapability, type LiveCapability } from '@/components/ai-internals/useLiveCapability';

/* ════════════════════════ מקור התרחיש ════════════════════════════════════ */

type SourceMode = 'canonical' | 'library' | 'custom';

/** תווית יושרה: הלומד תמיד יודע מאיפה הגיע התרחיש. */
const SOURCE_BADGE: Record<SourceMode, { he: string; en: string; cls: string; icon: React.ReactNode }> = {
    canonical: { he: 'שיעור מאומת', en: 'Verified lesson', cls: 'border-teal-500/40 bg-teal-900/15 text-teal-200', icon: <ShieldCheck size={12} /> },
    library: { he: 'תרחיש מהספרייה', en: 'Curated scenario', cls: 'border-sky-500/40 bg-sky-900/15 text-sky-200', icon: <BookMarked size={12} /> },
    custom: { he: 'תרחיש שנוצר ב-AI', en: 'AI generated scenario', cls: 'border-fuchsia-500/40 bg-fuchsia-900/15 text-fuchsia-200', icon: <Sparkles size={12} /> },
};

/* ════════════════════════ טון צבעוני ═════════════════════════════════════ */

const TONE: Record<Tone, { border: string; bg: string; text: string; soft: string }> = {
    answer: { border: 'border-teal-500/40', bg: 'bg-teal-900/15', text: 'text-teal-300', soft: 'bg-teal-500/15' },
    ask: { border: 'border-amber-500/40', bg: 'bg-amber-900/15', text: 'text-amber-300', soft: 'bg-amber-500/15' },
    tool: { border: 'border-violet-500/40', bg: 'bg-violet-900/20', text: 'text-violet-200', soft: 'bg-violet-500/15' },
    stop: { border: 'border-rose-500/40', bg: 'bg-rose-900/15', text: 'text-rose-300', soft: 'bg-rose-500/15' },
    neutral: { border: 'border-slate-700/50', bg: 'bg-slate-950/40', text: 'text-slate-400', soft: 'bg-slate-800/40' },
};

function chipClass(state: StageState, active: boolean): string {
    if (active) return 'border-violet-500/60 bg-violet-500/15 text-violet-100 ring-1 ring-violet-500/40';
    switch (state) {
        case 'done': return 'border-teal-500/40 bg-teal-900/15 text-teal-200';
        case 'active': return 'border-violet-500/50 bg-violet-900/25 text-violet-200';
        case 'blocked': return 'border-rose-500/40 bg-rose-900/15 text-rose-200';
        case 'skipped': return 'border-slate-800 bg-slate-950/30 text-slate-700';
        default: return 'border-slate-800 bg-slate-950/30 text-slate-500';
    }
}

/* ════════════════════════ קומפוננטה ראשית ════════════════════════════════ */

export const BehindScenesLab: React.FC = () => {
    const reduce = !!useReducedMotion();
    const cap = useLiveCapability();

    const [source, setSource] = useState<SourceMode>('canonical');
    const [text, setText] = useState('החבילה לא הגיעה');
    const [mode, setMode] = useState<'chat' | 'agent'>('chat');
    const [libraryId, setLibraryId] = useState(SCENARIO_LIBRARY[0].id);

    // השכבה החיה (Custom): מצב הייצור והתרחיש שנוצר.
    const [customScenario, setCustomScenario] = useState<LibraryScenario | null>(null);
    const [customText, setCustomText] = useState('');
    const [genState, setGenState] = useState<'idle' | 'loading' | 'error'>('idle');
    const [genError, setGenError] = useState('');

    // אם השכבה החיה לא זמינה אבל המקור הנבחר הוא Custom, חוזרים לקנוני בשקט -
    // ה-Custom נשאר מוצג בבורר אבל מסומן "available in live mode" ולא נשבר.
    const effectiveSource: SourceMode = source === 'custom' && cap !== 'live' ? 'canonical' : source;

    // פתרון התרחיש למקור הנבחר -> שני מסלולים (chat ו-agent). canonical מחושב חי
    // מהמנוע הדטרמיניסטי; library ו-custom עוברים דרך אותו presenter שקוף.
    const { chat, agent, activeText, badgeSource } = useMemo(() => {
        if (effectiveSource === 'library') {
            const s = getScenario(libraryId) ?? SCENARIO_LIBRARY[0];
            const t = scenarioToTraces(s);
            return { chat: t.chat, agent: t.agent, activeText: s.prompt, badgeSource: 'library' as SourceMode };
        }
        if (effectiveSource === 'custom' && customScenario) {
            const t = scenarioToTraces(customScenario);
            return { chat: t.chat, agent: t.agent, activeText: customScenario.prompt, badgeSource: 'custom' as SourceMode };
        }
        return { chat: traceChat(text), agent: traceAgent(text), activeText: text, badgeSource: 'canonical' as SourceMode };
    }, [effectiveSource, libraryId, customScenario, text]);

    const activeTrace = mode === 'chat' ? chat : agent;
    const sourceKey = `${badgeSource}:${libraryId}:${customScenario?.prompt ?? ''}:${text}`;

    const pick = (s: { text: string; mode: 'chat' | 'agent' }) => { setText(s.text); setMode(s.mode); };

    async function generate() {
        const t = customText.trim();
        if (!t) return;
        setGenState('loading');
        setGenError('');
        try {
            const res = await fetch('/api/scenario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: t }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.message || 'הייצור נכשל');
            }
            const data = await res.json();
            if (!data?.scenario) throw new Error('תשובה לא תקינה');
            setCustomScenario(data.scenario as LibraryScenario);
            setGenState('idle');
        } catch (e) {
            // כשל פנייה חי לא מוריד לתרחיש בודד - הלומד נשאר עם חוויית שכבה 1 המלאה.
            setGenError(e instanceof Error ? e.message : 'הייצור נכשל');
            setGenState('error');
        }
    }

    return (
        <div className="space-y-5">
            {/* ── מחוון מצב (Offline / Live) ──────────────────────────────── */}
            <ModeIndicator cap={cap} />

            {/* ── 1. Full Behind the Scenes Lab ──────────────────────────── */}
            <LabSection n={NARRATION.lab} icon={<Layers size={18} className="text-violet-300" />}>
                <div className="space-y-4">
                    {/* בורר התחומים: Canonical / Library / Custom */}
                    <DomainSwitcher source={source} onChange={setSource} cap={cap} />

                    {/* קריינות קצרה של בורר התחומים */}
                    <SwitcherNote />

                    {/* בקרת מקור: משתנה לפי המצב הנבחר */}
                    {source === 'canonical' && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]">
                                <div className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-950/60 px-3 focus-within:border-violet-500/60">
                                    <Keyboard size={15} className="shrink-0 text-violet-300" />
                                    <input
                                        type="text"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="כתבו בקשה אחת..."
                                        dir="rtl"
                                        aria-label="שדה הקלט של המעבדה המאוחדת"
                                        className="w-full bg-transparent py-2.5 text-base font-medium text-white placeholder:text-slate-600 focus:outline-none"
                                    />
                                </div>
                                <ModeSwitch mode={mode} onChange={setMode} />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-bold text-slate-500">ניסוי מהיר:</span>
                                {SUMMARY_SCENARIOS.map((s) => {
                                    const active = s.text === text && s.mode === mode;
                                    return (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => pick(s)}
                                            className={`rounded-lg border px-2.5 py-1 text-right leading-tight transition-colors ${active ? 'border-violet-500/50 bg-violet-900/25' : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'}`}
                                        >
                                            <span className={`block text-[11px] font-bold ${active ? 'text-violet-200' : 'text-slate-300'}`}>{s.labelHe}</span>
                                            <span className="block text-[8px] uppercase tracking-wider text-slate-500" dir="ltr">{s.behaviorHe}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {source === 'library' && (
                        <LibraryPicker
                            selectedId={libraryId}
                            onSelect={setLibraryId}
                            mode={mode}
                            onMode={setMode}
                            prompt={activeText}
                        />
                    )}

                    {source === 'custom' && (
                        <CustomPanel
                            cap={cap}
                            text={customText}
                            onText={setCustomText}
                            onGenerate={generate}
                            genState={genState}
                            genError={genError}
                            scenario={customScenario}
                            mode={mode}
                            onMode={setMode}
                        />
                    )}

                    {/* תווית יושרה למקור הפעיל */}
                    <IntegrityBadge source={badgeSource} />

                    {/* Engine Pipeline + Active Stage Details (חקירה) */}
                    <ExplorablePipeline trace={activeTrace} reduce={reduce} />
                </div>
            </LabSection>

            {/* ── 2. Chat Mode Replay ────────────────────────────────────── */}
            <LabSection n={NARRATION.chatReplay} icon={<MessageSquare size={18} className="text-violet-300" />}>
                <StagePlayer trace={chat} resetKey={`chat:${sourceKey}`} reduce={reduce} />
            </LabSection>

            {/* ── 3. Agent Mode Replay ───────────────────────────────────── */}
            <LabSection n={NARRATION.agentReplay} icon={<Workflow size={18} className="text-violet-300" />}>
                <StagePlayer trace={agent} resetKey={`agent:${sourceKey}`} reduce={reduce} />
            </LabSection>

            {/* ── 4. Compare Chat vs Agent (חתימתי) ──────────────────────── */}
            <LabSection n={NARRATION.compare} icon={<ArrowLeftRight size={18} className="text-violet-300" />}>
                <CompareView chat={chat} agent={agent} reduce={reduce} />
            </LabSection>

            {/* ── 5. Formula View ────────────────────────────────────────── */}
            <LabSection n={NARRATION.formula} icon={<FunctionSquare size={18} className="text-violet-300" />}>
                <FormulaView chat={chat} label={activeText} />
            </LabSection>

            {/* ── 6. Presentation Mode ───────────────────────────────────── */}
            <LabSection n={NARRATION.presentation} icon={<Presentation size={18} className="text-violet-300" />}>
                <PresentationView trace={activeTrace} resetKey={`pres:${mode}:${sourceKey}`} reduce={reduce} />
            </LabSection>

            {/* ── disclaimer ─────────────────────────────────────────────── */}
            <div className="flex items-start gap-2 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-500" dir="rtl">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>
                    מקור אמת אחד: כל מספר כאן מגיע מהמנועים של פרקים 6 עד 12, בלי חישוב סותר ובלי קידוד קשיח. <span className="font-bold text-slate-400">מערכת אמיתית מורכבת יותר</span>,
                    אבל המסלול הזה מתאר נאמנה את צורת החשיבה. וזכרו: דמיון אינו הסתברות, זיהוי משימה אינו אישור לפעול, יכולת אינה הרשאה, ועצירה אינה כישלון.
                </span>
            </div>
        </div>
    );
};

/* ════════════════════════ עוטף סקשן עם קריינות ════════════════════════════ */

const LabSection: React.FC<{ n: SectionNarration; icon: React.ReactNode; children: React.ReactNode }> = ({ n, icon, children }) => (
    <section className="space-y-3 rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5 text-right" dir="rtl">
        <div className="flex items-center gap-2.5">
            {icon}
            <div className="leading-tight">
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400" dir="ltr">{n.eyebrow}</div>
                <h4 className="text-lg font-bold text-white">{n.titleHe}</h4>
            </div>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">{n.intro}</p>
        {children}
        <div className="flex items-start gap-2 rounded-xl border border-violet-500/30 bg-violet-900/15 p-3">
            <Lightbulb size={15} className="mt-0.5 shrink-0 text-violet-300" />
            <p className="text-sm font-bold leading-relaxed text-violet-100">{n.takeaway}</p>
        </div>
        <div className="rounded-xl border border-slate-700/40 bg-slate-950/30 p-3">
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400" dir="ltr">
                <MousePointerClick size={13} /> Try this
            </div>
            <p className="text-[13px] leading-relaxed text-slate-400">{n.tryThis}</p>
        </div>
    </section>
);

/* ════════════════════════ Mode Switch ════════════════════════════════════ */

const ModeSwitch: React.FC<{ mode: 'chat' | 'agent'; onChange: (m: 'chat' | 'agent') => void }> = ({ mode, onChange }) => (
    <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/80 p-1" dir="ltr">
        {(['chat', 'agent'] as const).map((m) => {
            const active = mode === m;
            return (
                <button
                    key={m}
                    type="button"
                    onClick={() => onChange(m)}
                    aria-pressed={active}
                    className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${active ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    {active && <motion.span layoutId="bsl-mode-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-lg bg-violet-500/80" />}
                    <span className="relative z-10 flex items-center gap-1.5">
                        {m === 'chat' ? <MessageSquare size={15} /> : <Workflow size={15} />}
                        {m === 'chat' ? 'Chat' : 'Agent'}
                    </span>
                </button>
            );
        })}
    </div>
);

/* ════════════════════════ מחוון מצב (Offline / Live) ═════════════════════ */

const ModeIndicator: React.FC<{ cap: LiveCapability }> = ({ cap }) => {
    if (cap === 'live') {
        return (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-teal-500/40 bg-teal-900/15 px-4 py-2" dir="rtl">
                <div className="flex items-center gap-2 text-teal-200">
                    <Radio size={15} className="text-teal-300" />
                    <span className="text-sm font-bold">מצב חי <span className="text-[11px] font-medium text-teal-400/80" dir="ltr">Live mode</span></span>
                </div>
                <span className="text-[11px] text-teal-300/80">כל השכבות פעילות, כולל יצירת תרחיש חופשי.</span>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-900/15 px-4 py-2" dir="rtl">
            <div className="flex items-center gap-2 text-amber-200">
                {cap === 'checking' ? <Loader2 size={15} className="animate-spin text-amber-300" /> : <WifiOff size={15} className="text-amber-300" />}
                <span className="text-sm font-bold">מצב לימוד offline <span className="text-[11px] font-medium text-amber-400/80" dir="ltr">Offline learning mode</span></span>
            </div>
            <span className="text-[11px] text-amber-300/80">המסלול המלא וכל הספרייה זמינים. יצירת תרחיש חופשי דורשת מצב חי.</span>
        </div>
    );
};

/* ════════════════════════ בורר התחומים (3 מצבים) ═════════════════════════ */

const DomainSwitcher: React.FC<{ source: SourceMode; onChange: (s: SourceMode) => void; cap: LiveCapability }> = ({ source, onChange, cap }) => {
    const tabs: { id: SourceMode; he: string; en: string; icon: React.ReactNode; badge: string }[] = [
        { id: 'canonical', he: 'חבילות', en: 'Canonical', icon: <ShieldCheck size={14} />, badge: 'Verified lesson' },
        { id: 'library', he: 'ספרייה', en: 'Library', icon: <BookMarked size={14} />, badge: 'Curated scenario' },
        { id: 'custom', he: 'מצב חופשי', en: 'Custom', icon: <Sparkles size={14} />, badge: 'AI generated' },
    ];
    const liveOnly = cap !== 'live';
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500" dir="ltr">
                <Globe size={13} className="text-violet-300" /> Domain Switcher
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {tabs.map((t) => {
                    const active = source === t.id;
                    const disabled = t.id === 'custom' && liveOnly;
                    return (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => onChange(t.id)}
                            aria-pressed={active}
                            className={`relative flex flex-col items-start gap-1 rounded-xl border px-3 py-2 text-right transition-colors ${active
                                ? 'border-violet-500/60 bg-violet-900/25'
                                : 'border-slate-700/60 bg-slate-900/40 hover:border-slate-600'}`}
                            dir="rtl"
                        >
                            <span className={`flex items-center gap-1.5 text-sm font-bold ${active ? 'text-violet-100' : 'text-slate-200'}`}>
                                <span className={active ? 'text-violet-300' : 'text-slate-400'}>{t.icon}</span>
                                {t.he}
                                <span className="text-[10px] font-medium text-slate-500" dir="ltr">{t.en}</span>
                            </span>
                            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">
                                {SOURCE_BADGE[t.id].icon}{t.badge}
                            </span>
                            {disabled && (
                                <span className="mt-0.5 inline-flex items-center gap-1 rounded border border-amber-500/40 bg-amber-900/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300" dir="ltr">
                                    <Lock size={9} /> available in live mode
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const SwitcherNote: React.FC = () => (
    <div className="rounded-xl border border-slate-700/40 bg-slate-950/30 p-3 text-[12px] leading-relaxed text-slate-400" dir="rtl">
        <span className="font-bold text-slate-300">{DOMAIN_SWITCHER_NARRATION.titleHe}. </span>
        {DOMAIN_SWITCHER_NARRATION.intro}
    </div>
);

/* ════════════════════════ תווית יושרה למקור ══════════════════════════════ */

const IntegrityBadge: React.FC<{ source: SourceMode }> = ({ source }) => {
    const b = SOURCE_BADGE[source];
    return (
        <div className="flex items-center gap-2" dir="rtl">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${b.cls}`}>
                {b.icon}{b.he}<span className="text-[9px] font-medium uppercase tracking-wider opacity-70" dir="ltr">{b.en}</span>
            </span>
        </div>
    );
};

/* ════════════════════════ בורר תרחיש מהספרייה ════════════════════════════ */

const LibraryPicker: React.FC<{
    selectedId: string; onSelect: (id: string) => void;
    mode: 'chat' | 'agent'; onMode: (m: 'chat' | 'agent') => void;
    prompt: string;
}> = ({ selectedId, onSelect, mode, onMode, prompt }) => {
    const selected = getScenario(selectedId) ?? SCENARIO_LIBRARY[0];
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">תחום מהספרייה:</span>
                {SCENARIO_LIBRARY.map((s) => {
                    const active = s.id === selectedId;
                    return (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => onSelect(s.id)}
                            className={`rounded-lg border px-2.5 py-1 text-right leading-tight transition-colors ${active ? 'border-sky-500/50 bg-sky-900/25' : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'}`}
                        >
                            <span className={`block text-[11px] font-bold ${active ? 'text-sky-200' : 'text-slate-300'}`}>{s.domainHe}</span>
                            <span className="block text-[8px] uppercase tracking-wider text-slate-500" dir="ltr">{s.domainEn}</span>
                        </button>
                    );
                })}
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]">
                <div className="rounded-xl border border-slate-700/60 bg-slate-950/60 px-3 py-2.5" dir="rtl">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">Scenario prompt</div>
                    <div className="mt-0.5 text-base font-medium text-white">&quot;{prompt}&quot;</div>
                    <div className="mt-1 text-[11px] text-slate-400">{selected.blurbHe}</div>
                </div>
                <ModeSwitch mode={mode} onChange={onMode} />
            </div>
        </div>
    );
};

/* ════════════════════════ פאנל המצב החופשי (השכבה החיה) ══════════════════ */

const CustomPanel: React.FC<{
    cap: LiveCapability;
    text: string; onText: (t: string) => void;
    onGenerate: () => void;
    genState: 'idle' | 'loading' | 'error';
    genError: string;
    scenario: LibraryScenario | null;
    mode: 'chat' | 'agent'; onMode: (m: 'chat' | 'agent') => void;
}> = ({ cap, text, onText, onGenerate, genState, genError, scenario, mode, onMode }) => {
    // שכבה 1: אין מפתח/רשת. מציגים הסבר ברור, לא נשברים, לא נעלמים.
    if (cap !== 'live') {
        return (
            <div className="space-y-2 rounded-xl border border-amber-500/40 bg-amber-900/10 p-4" dir="rtl">
                <div className="flex items-center gap-2 text-amber-200">
                    <Lock size={15} className="text-amber-300" />
                    <span className="text-sm font-bold">המצב החופשי זמין במצב חי <span className="text-[11px] font-medium text-amber-400/80" dir="ltr">available in live mode</span></span>
                </div>
                <p className="text-[12px] leading-relaxed text-amber-100/80">
                    יצירת תרחיש חי מטקסט שאתם מקלידים דורשת חיבור פעיל ומפתח. גם בלעדיה, המעבדה מלאה:
                    בחרו <span className="font-bold">חבילות</span> לתרחיש המאומת, או <span className="font-bold">ספרייה</span> כדי לראות את אותו מנוע שקוף עובד על רפואה, חיוב, IT ומשאבי אנוש.
                </p>
            </div>
        );
    }

    // שכבה 2: מצב חי. שדה קלט + יצירה.
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]">
                <div className="flex items-center gap-2 rounded-xl border border-fuchsia-500/40 bg-slate-950/60 px-3 focus-within:border-fuchsia-400/60">
                    <Sparkles size={15} className="shrink-0 text-fuchsia-300" />
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => onText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && genState !== 'loading') onGenerate(); }}
                        placeholder="כתבו מצב מכל תחום (רפואה, משפט, חינוך)..."
                        dir="rtl"
                        aria-label="שדה המצב החופשי"
                        className="w-full bg-transparent py-2.5 text-base font-medium text-white placeholder:text-slate-600 focus:outline-none"
                    />
                </div>
                <button
                    type="button"
                    onClick={onGenerate}
                    disabled={genState === 'loading' || !text.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-fuchsia-500/50 bg-fuchsia-900/25 px-4 py-2 text-sm font-bold text-fuchsia-200 hover:brightness-110 disabled:opacity-40"
                >
                    {genState === 'loading' ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                    {genState === 'loading' ? 'בונה תרחיש...' : 'בנו תרחיש'}
                </button>
            </div>

            {genState === 'error' && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-500/40 bg-rose-900/15 p-3 text-[12px] text-rose-200" dir="rtl">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    <span>הייצור החי נכשל ({genError}). שאר המעבדה עובדת כרגיל, אפשר לבחור חבילות או ספרייה.</span>
                </div>
            )}

            {scenario ? (
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]">
                    <div className="rounded-xl border border-fuchsia-500/30 bg-slate-950/60 px-3 py-2.5" dir="rtl">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">Generated · {scenario.domainEn}</div>
                        <div className="mt-0.5 text-base font-medium text-white">&quot;{scenario.prompt}&quot;</div>
                        <div className="mt-1 text-[11px] text-slate-400">תחום שזוהה: {scenario.domainHe}</div>
                    </div>
                    <ModeSwitch mode={mode} onChange={onMode} />
                </div>
            ) : (
                <p className="text-[12px] text-slate-500" dir="rtl">הקלידו מצב ולחצו &quot;בנו תרחיש&quot;. המנוע השקוף יציג אותו דרך אותן שכבות בדיוק.</p>
            )}
        </div>
    );
};

/* ════════════════════════ Engine Pipeline (chips) ════════════════════════ */

const PipelineBar: React.FC<{ stages: Stage[]; activeIndex: number; onSelect?: (i: number) => void; reduce: boolean }> = ({ stages, activeIndex, onSelect, reduce }) => (
    <div className="flex flex-wrap items-center gap-1.5" dir="ltr">
        {stages.map((s, i) => (
            <React.Fragment key={s.id}>
                {i > 0 && <ArrowLeft size={11} className={`rotate-180 ${i <= activeIndex ? 'text-violet-500/50' : 'text-slate-700'}`} />}
                <motion.button
                    type="button"
                    onClick={onSelect ? () => onSelect(i) : undefined}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.25, delay: i * 0.03 }}
                    className={`rounded-lg border px-2 py-1 text-center leading-tight transition-colors ${chipClass(s.state, i === activeIndex)} ${onSelect ? 'cursor-pointer' : 'cursor-default'}`}
                >
                    <span className="block text-[10px] font-bold">{s.he}</span>
                    <span className="block text-[7px] uppercase tracking-wider opacity-70" dir="ltr">{s.en}</span>
                </motion.button>
            </React.Fragment>
        ))}
    </div>
);

/* ════════════════════════ Active Stage Detail ════════════════════════════ */

const StageDetail: React.FC<{ stage: Stage; big?: boolean }> = ({ stage, big }) => {
    const p = stage.payload;
    return (
        <div className={`rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 ${big ? 'min-h-[12rem]' : ''}`}>
            <div className="mb-2 flex items-center justify-between gap-2">
                <div className="leading-tight">
                    <div className={`font-bold text-slate-100 ${big ? 'text-xl' : 'text-sm'}`}>{stage.he}</div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500" dir="ltr">{stage.en}</div>
                </div>
                <StageStateBadge state={stage.state} />
            </div>
            <StagePayloadView payload={p} />
            <p className={`mt-3 leading-relaxed text-slate-400 ${big ? 'text-sm' : 'text-[11px]'}`}>{stage.explainHe}</p>
        </div>
    );
};

const StageStateBadge: React.FC<{ state: StageState }> = ({ state }) => {
    const map: Record<StageState, { he: string; cls: string }> = {
        done: { he: 'הושלם', cls: 'border-teal-500/40 bg-teal-500/15 text-teal-300' },
        active: { he: 'פעיל', cls: 'border-violet-500/40 bg-violet-500/15 text-violet-200' },
        blocked: { he: 'נחסם', cls: 'border-rose-500/40 bg-rose-500/15 text-rose-300' },
        pending: { he: 'ממתין', cls: 'border-slate-700/50 bg-slate-800/40 text-slate-500' },
        skipped: { he: 'דולג', cls: 'border-slate-700/50 bg-slate-800/40 text-slate-600' },
    };
    const m = map[state];
    return <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${m.cls}`}>{m.he}</span>;
};

const StagePayloadView: React.FC<{ payload: StagePayload }> = ({ payload: p }) => {
    switch (p.kind) {
        case 'input':
            return <div className="rounded-lg bg-slate-800/60 px-3 py-2 text-base font-bold text-slate-100" dir="rtl">&quot;{p.text}&quot;</div>;
        case 'tokens':
            return <Chips items={p.tokens.length ? p.tokens : ['...']} icon={<Hash size={11} />} />;
        case 'ids':
            return (
                <div className="flex flex-wrap gap-2" dir="rtl">
                    {p.pairs.map((pr, i) => (
                        <span key={i} className="flex flex-col items-center rounded-lg border border-slate-700/50 bg-slate-800/40 px-2 py-1 leading-none">
                            <span className="text-xs font-bold text-slate-200">{pr.token}</span>
                            <span className="mt-0.5 font-mono text-[11px] text-violet-300" dir="ltr">{pr.id ?? '-'}</span>
                        </span>
                    ))}
                </div>
            );
        case 'vector':
            return (
                <div className="space-y-1.5">
                    {p.dims.map((d) => (
                        <div key={d.en} className="flex items-center gap-2">
                            <span className="w-16 shrink-0 text-[11px] font-bold text-slate-300">{d.he}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-l from-cyan-400 to-violet-500" style={{ width: `${Math.round(d.value * 100)}%` }} /></div>
                            <span className="w-9 shrink-0 text-left font-mono text-[11px] text-slate-400" dir="ltr">{d.value.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            );
        case 'sim':
            return (
                <div className="space-y-1.5">
                    <div className="mb-1 inline-flex items-center gap-1 rounded border border-amber-500/40 bg-amber-900/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-300" dir="ltr">Similarity, not probability</div>
                    {p.items.map((it) => (
                        <div key={it.labelEn} className="flex items-center gap-2">
                            <span className="w-32 shrink-0 truncate text-[11px] text-slate-300">{it.labelHe}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-amber-500/60" style={{ width: `${Math.max(0, it.value) * 100}%` }} /></div>
                            <span className="w-9 shrink-0 text-left font-mono text-[11px] font-bold text-slate-300" dir="ltr">{it.value.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            );
        case 'scores':
            return (
                <div className="space-y-1">
                    {p.items.map((it) => (
                        <div key={it.labelHe} className="flex items-center justify-between rounded-lg border border-slate-700/40 bg-slate-900/40 px-3 py-1.5">
                            <span className="text-[12px] text-slate-300">{it.labelHe}</span>
                            <span className="font-mono text-sm font-bold text-violet-200" dir="ltr">{it.value.toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="pt-1 text-[10px] text-slate-500">הציונים הגולמיים לא מסתכמים ל-100%.</div>
                </div>
            );
        case 'probs':
            return (
                <div className="space-y-1.5">
                    {p.items.map((it) => (
                        <div key={it.labelHe} className="flex items-center gap-2">
                            <span className={`w-32 shrink-0 truncate text-[11px] ${it.lead ? 'font-bold text-teal-200' : 'text-slate-300'}`}>{it.labelHe}</span>
                            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${it.lead ? 'bg-gradient-to-l from-teal-400 to-emerald-500' : 'bg-slate-600'}`} style={{ width: `${it.value}%` }} /></div>
                            <span className={`w-9 shrink-0 text-left font-mono text-[11px] font-black ${it.lead ? 'text-teal-200' : 'text-slate-400'}`} dir="ltr">{it.value}%</span>
                        </div>
                    ))}
                </div>
            );
        case 'confidence':
            return (
                <div className="grid grid-cols-3 gap-2">
                    <MiniStat labelEn="Top" value={`${p.top}%`} />
                    <MiniStat labelEn="Second" value={`${p.second}%`} />
                    <MiniStat labelEn="Margin" value={`${p.margin}%`} accent />
                    <div className="col-span-3 rounded-lg border border-slate-700/40 bg-slate-900/40 px-3 py-1.5 text-center text-sm font-bold text-slate-200">
                        ביטחון: {p.levelHe} <span className="text-[10px] text-slate-500" dir="ltr">{p.levelEn}</span>
                    </div>
                </div>
            );
        case 'response':
            return <ToneCard tone={p.tone} title={p.decisionHe}>{p.text}</ToneCard>;
        case 'task':
            return (
                <div className="flex flex-wrap gap-2">
                    <MiniStat labelEn="Action signal" value={p.actionHe} />
                    <MiniStat labelEn="Request type" value={p.requestHe} />
                </div>
            );
        case 'missing':
            return (
                <div className="space-y-1.5">
                    {p.items.length === 0 ? <div className="text-[12px] text-slate-400">לבקשה הזו לא נדרש מידע נוסף.</div> : p.items.map((it) => (
                        <div key={it.he} className={`flex items-center justify-between rounded-lg border px-3 py-1.5 ${it.present ? 'border-teal-500/30 bg-teal-900/10' : 'border-amber-500/40 bg-amber-900/15'}`}>
                            <span className="flex items-center gap-1.5 text-[12px]">{it.present ? <CheckCircle2 size={13} className="text-teal-300" /> : <XCircle size={13} className="text-amber-300" />}{it.he}</span>
                            <span className={`text-[9px] font-bold uppercase ${it.present ? 'text-teal-300' : 'text-amber-300'}`} dir="ltr">{it.present ? 'available' : 'missing'}</span>
                        </div>
                    ))}
                    <div className="text-[11px] font-bold text-slate-400">{p.note}</div>
                </div>
            );
        case 'tools':
            return (
                <div className="space-y-1.5">
                    {p.items.map((it) => (
                        <div key={it.nameEn} className="flex items-center gap-2">
                            <span className={`w-32 shrink-0 truncate text-[11px] ${it.nameEn === p.selectedEn ? 'font-bold text-violet-200' : 'text-slate-300'}`} dir="ltr">{it.nameEn}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${it.nameEn === p.selectedEn ? 'bg-gradient-to-l from-violet-400 to-fuchsia-500' : 'bg-slate-600'}`} style={{ width: `${it.match}%` }} /></div>
                            <span className="w-8 shrink-0 text-left font-mono text-[11px] font-bold text-slate-300" dir="ltr">{it.match}</span>
                        </div>
                    ))}
                    {p.selectedEn && <div className="text-[11px] font-bold text-violet-200" dir="ltr">Selected: {p.selectedEn}</div>}
                </div>
            );
        case 'call':
            return (
                <div className="space-y-2">
                    <div className={`rounded-lg border bg-slate-950/70 p-3 font-mono text-[12px] ${p.called ? 'border-slate-700/50 text-slate-200' : 'border-amber-500/40 text-amber-200'}`} dir="ltr">{p.code}</div>
                    <div className={`text-[11px] font-bold ${p.called ? 'text-teal-300' : 'text-amber-300'}`}>{p.called ? 'הכלי הופעל.' : 'הקריאה לא הופעלה (חסר קלט או אישור). Tool selected אינו Tool called.'}</div>
                </div>
            );
        case 'observation':
            return p.available ? (
                <div className="space-y-1 font-mono text-[12px]" dir="ltr">
                    {p.fields.map((f) => (
                        <div key={f.key} className="flex items-center gap-2"><span className="w-28 shrink-0 text-slate-500">{f.key}:</span><span className="text-slate-200">{f.value}</span></div>
                    ))}
                </div>
            ) : <div className="text-[12px] text-slate-400">אין תוצאה, הכלי לא הופעל.</div>;
        case 'risk':
            return (
                <div className="flex flex-wrap gap-2">
                    <MiniStat labelEn="Action" value={p.actionHe} />
                    <MiniStat labelEn="Risk" value={p.riskHe} />
                    <MiniStat labelEn="Approval" value={p.approvalHe} accent={p.tone === 'stop'} />
                </div>
            );
        case 'decision':
            return <ToneCard tone={p.tone} title={`${p.he} · ${p.en}`}>{p.detail}</ToneCard>;
        default:
            return null;
    }
};

const Chips: React.FC<{ items: string[]; icon?: React.ReactNode }> = ({ items, icon }) => (
    <div className="flex flex-wrap gap-1.5" dir="rtl">
        {items.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-lg border border-slate-700/50 bg-slate-800/40 px-2 py-1 text-sm font-bold text-slate-200">{icon}{t}</span>
        ))}
    </div>
);

const MiniStat: React.FC<{ labelEn: string; value: string; accent?: boolean }> = ({ labelEn, value, accent }) => (
    <div className={`flex-1 rounded-lg border px-3 py-2 leading-tight ${accent ? 'border-violet-500/40 bg-violet-900/15' : 'border-slate-700/40 bg-slate-900/40'}`}>
        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">{labelEn}</div>
        <div className={`mt-0.5 text-sm font-bold ${accent ? 'text-violet-200' : 'text-slate-200'}`}>{value}</div>
    </div>
);

const ToneCard: React.FC<{ tone: Tone; title: string; children: React.ReactNode }> = ({ tone, title, children }) => {
    const t = TONE[tone];
    return (
        <div className={`rounded-xl border p-3 ${t.border} ${t.bg}`}>
            <div className={`text-[11px] font-bold uppercase tracking-wider ${t.text}`} dir="ltr">{title}</div>
            <p className="mt-1 text-sm leading-relaxed text-slate-200" dir="rtl">{children}</p>
        </div>
    );
};

/* ════════════════════════ Explorable Pipeline (חקירה) ════════════════════ */

const ExplorablePipeline: React.FC<{ trace: Trace; reduce: boolean }> = ({ trace, reduce }) => {
    const lastActive = Math.max(0, trace.stages.findIndex((s) => s.state === 'active'));
    const [sel, setSel] = useState(0);
    // איפוס הבחירה כשמשתנה המסלול (תבנית reset-on-key).
    const key = `${trace.mode}:${trace.text}`;
    const [prevKey, setPrevKey] = useState(key);
    if (key !== prevKey) { setPrevKey(key); setSel(lastActive >= 0 ? lastActive : 0); }
    const safeSel = Math.min(sel, trace.stages.length - 1);

    return (
        <div className="space-y-3 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2">
                <Workflow size={15} className="text-violet-300" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500" dir="ltr">Engine Pipeline · {trace.mode === 'chat' ? 'Chat' : 'Agent'}</span>
            </div>
            <PipelineBar stages={trace.stages} activeIndex={safeSel} onSelect={setSel} reduce={reduce} />
            <p className="text-[11px] text-slate-500">לחצו על שלב כדי לפתוח את הפרטים שלו. לא הכל גלוי בבת אחת, המידע נחשף כשצריך.</p>
            <StageDetail stage={trace.stages[safeSel]} />
        </div>
    );
};

/* ════════════════════════ Stage Player (Replay / Presentation) ═══════════ */

const StagePlayer: React.FC<{ trace: Trace; resetKey: string; reduce: boolean; presentation?: boolean }> = ({ trace, resetKey, reduce, presentation }) => {
    const max = trace.stages.length - 1;
    const [step, setStep] = useState(0);
    const [playing, setPlaying] = useState(false);

    const [prevKey, setPrevKey] = useState(resetKey);
    if (resetKey !== prevKey) { setPrevKey(resetKey); setStep(0); setPlaying(false); }
    if (playing && step >= max) setPlaying(false);
    if (step > max) setStep(max);

    useEffect(() => {
        if (!playing) return;
        const id = setInterval(() => setStep((s) => Math.min(s + 1, max)), reduce ? 500 : 1000);
        return () => clearInterval(id);
    }, [playing, max, reduce]);

    const current = trace.stages[Math.min(step, max)];

    return (
        <div className={`space-y-3 rounded-2xl border p-4 ${presentation ? 'border-violet-500/30 bg-slate-950/50' : 'border-slate-700/50 bg-slate-900/50'}`}>
            <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => { if (step >= max) setStep(0); setPlaying((p) => !p); }} className="inline-flex items-center gap-2 rounded-xl border border-violet-500/50 bg-violet-900/25 px-3 py-2 text-sm font-bold text-violet-200 hover:brightness-110">
                    {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? 'עצירה' : (presentation ? 'הצגה' : 'Replay')}
                </button>
                <button type="button" onClick={() => { setPlaying(false); setStep((s) => Math.min(s + 1, max)); }} disabled={step >= max} className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-sm font-bold text-slate-300 hover:border-slate-600 disabled:opacity-40">
                    <StepForward size={14} /> Next
                </button>
                <button type="button" onClick={() => { setPlaying(false); setStep(0); }} className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-sm font-bold text-slate-400 hover:text-slate-200">
                    <RotateCcw size={14} /> איפוס
                </button>
                <span className="font-mono text-xs text-slate-500" dir="ltr">{step + 1} / {max + 1}</span>
            </div>

            {!presentation && <PipelineBar stages={trace.stages} activeIndex={step} onSelect={setStep} reduce={reduce} />}

            <motion.div key={step} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={reduce ? { duration: 0 } : { duration: 0.3 }}>
                <StageDetail stage={current} big={presentation} />
            </motion.div>

            {presentation && (
                <div className="flex items-center justify-center gap-1.5">
                    {trace.stages.map((s, i) => (
                        <span key={s.id} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-violet-400' : i < step ? 'w-1.5 bg-teal-400/60' : 'w-1.5 bg-slate-700'}`} />
                    ))}
                </div>
            )}
        </div>
    );
};

/* ════════════════════════ Compare Chat vs Agent ══════════════════════════ */

const CompareView: React.FC<{ chat: Trace; agent: Trace; reduce: boolean }> = ({ chat, agent, reduce }) => {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <CompareColumn trace={chat} icon={<MessageSquare size={15} />} reduce={reduce} />
                <CompareColumn trace={agent} icon={<Workflow size={15} />} reduce={reduce} />
            </div>
            <div className="rounded-xl border border-violet-500/30 bg-violet-900/10 p-3 text-sm leading-relaxed text-slate-300">
                <span className="font-bold text-violet-200">אותו משפט, שני מנועים. </span>
                ב-Chat המערכת מזהה בקשת הסבר ומדרגת כוונות עד תשובה. ב-Agent היא מזהה משימה, בודקת מידע חסר וכלי, ולפעמים עוצרת. ההבדל הוא במנוע, לא במילים.
            </div>
        </div>
    );
};

const CompareColumn: React.FC<{ trace: Trace; icon: React.ReactNode; reduce: boolean }> = ({ trace, icon, reduce }) => {
    const t = TONE[trace.outcomeTone];
    return (
        <div className="space-y-2 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4">
            <div className="flex items-center gap-2">
                <span className="text-violet-300">{icon}</span>
                <span className="text-sm font-bold text-slate-200">{trace.mode === 'chat' ? 'Chat, מנוע תשובה' : 'Agent, מנוע פעולה'}</span>
            </div>
            <PipelineBar stages={trace.stages} activeIndex={-1} reduce={reduce} />
            <div className={`rounded-xl border p-3 ${t.border} ${t.bg}`}>
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">Outcome</div>
                <div className={`text-sm font-black ${t.text}`}>{trace.outcomeHe}</div>
            </div>
        </div>
    );
};

/* ════════════════════════ Formula View ═══════════════════════════════════ */

const FormulaView: React.FC<{ chat: Trace; label: string }> = ({ chat, label }) => {
    const [open, setOpen] = useState(true);
    const scoresStage = chat.stages.find((s) => s.id === 'scores');
    const probsStage = chat.stages.find((s) => s.id === 'probabilities');
    const scores = scoresStage && scoresStage.payload.kind === 'scores' ? scoresStage.payload.items : [];
    const probs = probsStage && probsStage.payload.kind === 'probs' ? probsStage.payload.items : [];

    return (
        <div className="space-y-3">
            <button type="button" onClick={() => setOpen((o) => !o)} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${open ? 'border-violet-500/50 bg-violet-900/25 text-violet-200' : 'border-slate-700/60 bg-slate-800/40 text-slate-300'}`}>
                <FunctionSquare size={15} /> {open ? 'הסתרת נוסחאות' : 'הצגת נוסחאות'} <span className="text-[10px] uppercase opacity-70" dir="ltr">Formula View</span>
            </button>

            {open && (
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        {FORMULAS.map((fm) => (
                            <div key={fm.en} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700/50 bg-slate-950/40 p-2.5">
                                <span className="font-mono text-[12px] text-slate-300" dir="ltr">{fm.en}</span>
                                <span className="text-[10px] text-slate-500">{fm.he} · {fm.chapter}</span>
                            </div>
                        ))}
                    </div>

                    {/* softmax חי: scores -> probabilities */}
                    <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                        <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500" dir="ltr"><BarChart3 size={12} className="text-violet-300" /> Live softmax for &quot;{label}&quot;</div>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3" dir="ltr">
                            <div className="space-y-1">
                                <div className="text-center text-[9px] font-bold uppercase text-slate-500">scores</div>
                                {scores.map((s) => <div key={s.labelHe} className="rounded border border-slate-700/50 bg-slate-900/40 px-2 py-1 text-center font-mono text-[11px] text-slate-300">{s.value.toFixed(2)}</div>)}
                            </div>
                            <div className="flex flex-col items-center gap-1 text-slate-500"><FunctionSquare size={20} className="text-violet-300" /><span className="font-mono text-[8px]">softmax</span></div>
                            <div className="space-y-1">
                                <div className="text-center text-[9px] font-bold uppercase text-slate-500">probabilities</div>
                                {probs.map((pr) => <div key={pr.labelHe} className={`rounded border px-2 py-1 text-center font-mono text-[11px] font-bold ${pr.lead ? 'border-teal-500/40 bg-teal-900/15 text-teal-200' : 'border-slate-700/50 bg-slate-900/40 text-slate-300'}`}>{pr.value}%</div>)}
                            </div>
                        </div>
                        <div className="mt-2 text-center text-[10px] text-slate-500">סכום ההסתברויות: <span className="font-mono font-bold text-emerald-300">{probs.reduce((a, b) => a + b.value, 0)}%</span></div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ════════════════════════ Presentation View ══════════════════════════════ */

const PresentationView: React.FC<{ trace: Trace; resetKey: string; reduce: boolean }> = ({ trace, resetKey, reduce }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Maximize2 size={12} /> מצב הצגה: שלב אחר שלב, מסך נקי, החלק הרלוונטי בלבד.
            </div>
            <StagePlayer trace={trace} resetKey={resetKey} reduce={reduce} presentation />
        </div>
    );
};
