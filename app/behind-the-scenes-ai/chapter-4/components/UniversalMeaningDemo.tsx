"use client";

// UniversalMeaningDemo - שלב 1: קרבה במשמעות עם אובייקטים מוכרים.
// ──────────────────────────────────────────────────────────────────────────
// אותו מנגנון כמו שלב המשפטים, אך פשוט: בוחרים אובייקט, רואים מה הכי קרוב אליו,
// וקוראים למה. שני אשכולות: חיות (כלב, חתול) ואוכל (תפוח, מלפפון), ומחשב נפרד
// (טכנולוגיה). השדה הוא הצד הוויזואלי, ולצדו בוחר, מקרא הנבחר והקרוב, והסבר קצר.
// כל הטקסט המלא יושב לצד השדה, לא בתוכו. אין כאן משפטי משלוח, DNA או כוחות משמעות.
// נכסי PNG עם שקיפות, וצללית גיבוי אם נכס חסר.

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

import { useChapter4Lab } from '../labContent';
import { MeaningProximity, type ProximityNode } from './MeaningProximity';
import { ObjectGlyph } from './objectGlyphs';

// ייצוג מספרי להמחשה: אובייקטים מאותה קטגוריה מקבלים מספרים דומים (כלב~חתול, תפוח~מלפפון),
// ומחשב שונה. מבנה בלבד (לא מתורגם), להראות שקרבה במפה = דמיון במספרים, לא במקרה.
const OBJ_VEC: Record<string, number[]> = {
    dog: [0.82, 0.71, -0.12, 0.64, -0.20, 0.55],
    cat: [0.78, 0.68, -0.08, 0.60, -0.16, 0.51],
    apple: [-0.24, 0.18, 0.80, 0.66, 0.40, -0.30],
    cucumber: [-0.19, 0.14, 0.84, 0.61, 0.36, -0.26],
    computer: [0.10, -0.82, 0.22, -0.58, 0.75, 0.14],
};
const fmtN = (n: number) => (n >= 0 ? `+${n.toFixed(2)}` : n.toFixed(2));
// שפת צבע אחידה למספרים בקורס: ציאן = חיובי, סגול = שלילי.
const numTone = (n: number) => (n >= 0 ? 'text-cyan-200' : 'text-violet-200');

interface UniversalMeaningDemoProps {
    dir?: 'rtl' | 'ltr';
    /** מספר המעבדה בפרק (מוצג כתג ליד הכותרת). לא מוצג אם לא הועבר. */
    labNumber?: number;
}

export const UniversalMeaningDemo: React.FC<UniversalMeaningDemoProps> = ({ dir = 'rtl', labNumber }) => {
    const lab = useChapter4Lab();
    const m = lab.map;
    const o = m.objects;
    const ex = m.objectExplain;

    // שני אשכולות: חיות למעלה-שמאל, אוכל למטה-ימין, ומחשב נפרד למעלה-ימין.
    const nodes: ProximityNode[] = [
        { id: 'dog', pos: { x: 0.28, y: 0.34 }, nearestId: 'cat', assetSrc: '/assets/semantic-object-dog.png', fallbackGlyph: 'dog', label: o.dog, explanation: ex.dog, vector: OBJ_VEC.dog },
        { id: 'cat', pos: { x: 0.46, y: 0.3 }, nearestId: 'dog', assetSrc: '/assets/semantic-object-cat.png', fallbackGlyph: 'cat', label: o.cat, explanation: ex.cat, vector: OBJ_VEC.cat },
        { id: 'apple', pos: { x: 0.56, y: 0.7 }, nearestId: 'cucumber', assetSrc: '/assets/semantic-object-apple.png', fallbackGlyph: 'apple', label: o.apple, explanation: ex.apple, vector: OBJ_VEC.apple },
        { id: 'cucumber', pos: { x: 0.76, y: 0.66 }, nearestId: 'apple', assetSrc: '/assets/semantic-object-cucumber.png', fallbackGlyph: 'cucumber', label: o.cucumber, explanation: ex.cucumber, vector: OBJ_VEC.cucumber },
        { id: 'computer', pos: { x: 0.84, y: 0.32 }, assetSrc: '/assets/semantic-object-computer.png', fallbackGlyph: 'computer', label: o.computer, explanation: ex.computer, vector: OBJ_VEC.computer },
    ];

    const byId = new Map(nodes.map((n) => [n.id, n] as const));
    const [activeId, setActiveId] = useState('dog');
    const active = byId.get(activeId) ?? nodes[0];
    const closest = active.nearestId ? byId.get(active.nearestId) ?? null : null;
    // שורת היחס המודגשת: חיות, אוכל או מחשב.
    const activeRow = activeId === 'dog' || activeId === 'cat' ? 0 : activeId === 'apple' || activeId === 'cucumber' ? 1 : 2;

    return (
        <div dir={dir} className="text-start">
            {/* גריד: שדה (ימין ב-RTL) + בוחר, מקרא ופאנל יחסים (שמאל) */}
            <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-6">
                <div className="lg:col-span-7">
                    {/* כותרת ותת-כותרת מעל השדה: מה המפה מלמדת */}
                    <div className="mb-3">
                        <div className="flex items-center gap-2">
                            {labNumber != null && (
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-600/50 bg-slate-800/60 font-mono text-sm font-black text-slate-200">
                                    {labNumber}
                                </span>
                            )}
                            <Sparkles size={18} className="text-cyan-300" />
                            <h4 className="text-lg font-bold text-white">{m.visualTitle}</h4>
                        </div>
                        <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{m.visualSubtitle}</p>
                    </div>

                    <MeaningProximity nodes={nodes} activeId={activeId} onSelect={setActiveId} closestTag={m.closestTag} dir={dir} showAllLinks showGrid />

                    {/* ייצוג מספרי מתחת למפה (ממלא את הרווח): אותם אובייקטים קרובים => מספרים דומים */}
                    <div className="mt-4 rounded-2xl border border-violet-500/25 bg-slate-900/40 p-4">
                        <div className="mb-2.5 text-[13px] font-bold text-slate-100">{m.numericTitle}</div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-cyan-200">
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-300" /> {active.label}
                                </div>
                                <div className="flex flex-wrap gap-1 font-mono text-[10px]" dir="ltr">
                                    {(OBJ_VEC[active.id] ?? []).map((n, i) => (
                                        <span key={i} className={`rounded bg-slate-800/60 px-1.5 py-0.5 ${numTone(n)}`}>{fmtN(n)}</span>
                                    ))}
                                </div>
                            </div>
                            {closest && (
                                <div>
                                    <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-violet-200">
                                        <span className="h-2 w-2 shrink-0 rounded-full bg-violet-300" /> {closest.label}
                                    </div>
                                    <div className="flex flex-wrap gap-1 font-mono text-[10px]" dir="ltr">
                                        {(OBJ_VEC[closest.id] ?? []).map((n, i) => (
                                            <span key={i} className={`rounded bg-slate-800/60 px-1.5 py-0.5 ${numTone(n)}`}>{fmtN(n)}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="mt-2.5 text-[11px] leading-relaxed text-slate-400">{m.numericNote}</p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{m.numericDisclaimer}</p>
                    </div>
                </div>

                <div className="mt-5 space-y-4 lg:col-span-5 lg:mt-0">
                    {/* בוחר אובייקטים עם תמונה זעירה */}
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4">
                        <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">{m.objectSelected}</div>
                        <div className="flex flex-wrap gap-2">
                            {nodes.map((n) => {
                                const isActive = n.id === activeId;
                                return (
                                    <button
                                        key={n.id}
                                        type="button"
                                        onClick={() => setActiveId(n.id)}
                                        aria-pressed={isActive}
                                        className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 transition-colors ${
                                            isActive ? 'border-cyan-400/60 bg-cyan-900/20' : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'
                                        }`}
                                    >
                                        <ObjectGlyph assetSrc={n.assetSrc} glyph={n.fallbackGlyph} className="h-7 w-7 object-contain" />
                                        <span className={`text-xs font-bold ${isActive ? 'text-cyan-100' : 'text-slate-300'}`}>{n.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* מקרא הנבחר והקרוב */}
                    <div className="space-y-2 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-200 shadow-[0_0_8px_2px_rgba(34,211,238,0.4)]" />
                            <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-slate-400">{m.objectSelected}</span>
                            <span className="text-sm font-bold text-cyan-100">{active.label}</span>
                        </div>
                        {closest ? (
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-violet-300" />
                                <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-slate-400">{m.objectClosest}</span>
                                <span className="text-sm font-bold text-violet-200">{closest.label}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-500/60" />
                                <span className="text-[12px] font-medium text-slate-400">{m.objectNoClose}</span>
                            </div>
                        )}
                    </div>

                    {/* פאנל "מה קרוב למה": שורות יחס מפורשות, השורה הפעילה מודגשת */}
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4">
                        <div className="mb-3 text-[13px] font-bold text-slate-100">{m.relationTitle}</div>
                        <div className="space-y-2">
                            {m.objectRows.map((row, i) => (
                                <div key={row.pair} className={`rounded-xl border p-2.5 ${i === activeRow ? 'border-cyan-400/40 bg-cyan-900/10' : 'border-slate-700/40 bg-slate-950/30'}`}>
                                    <div className="text-[13px] font-bold text-slate-100">{row.pair}</div>
                                    <p className="mt-0.5 text-[12px] leading-relaxed text-slate-400">{row.reason}</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-3 text-[12px] leading-relaxed text-slate-400">{m.coreRule}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
