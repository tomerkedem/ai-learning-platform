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

interface UniversalMeaningDemoProps {
    dir?: 'rtl' | 'ltr';
}

export const UniversalMeaningDemo: React.FC<UniversalMeaningDemoProps> = ({ dir = 'rtl' }) => {
    const lab = useChapter4Lab();
    const m = lab.map;
    const o = m.objects;
    const ex = m.objectExplain;

    // שני אשכולות: חיות למעלה-שמאל, אוכל למטה-ימין, ומחשב נפרד למעלה-ימין.
    const nodes: ProximityNode[] = [
        { id: 'dog', pos: { x: 0.28, y: 0.34 }, nearestId: 'cat', assetSrc: '/assets/semantic-object-dog.png', fallbackGlyph: 'dog', label: o.dog, explanation: ex.dog },
        { id: 'cat', pos: { x: 0.46, y: 0.3 }, nearestId: 'dog', assetSrc: '/assets/semantic-object-cat.png', fallbackGlyph: 'cat', label: o.cat, explanation: ex.cat },
        { id: 'apple', pos: { x: 0.56, y: 0.7 }, nearestId: 'cucumber', assetSrc: '/assets/semantic-object-apple.png', fallbackGlyph: 'apple', label: o.apple, explanation: ex.apple },
        { id: 'cucumber', pos: { x: 0.76, y: 0.66 }, nearestId: 'apple', assetSrc: '/assets/semantic-object-cucumber.png', fallbackGlyph: 'cucumber', label: o.cucumber, explanation: ex.cucumber },
        { id: 'computer', pos: { x: 0.84, y: 0.32 }, assetSrc: '/assets/semantic-object-computer.png', fallbackGlyph: 'computer', label: o.computer, explanation: ex.computer },
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
                            <Sparkles size={18} className="text-cyan-300" />
                            <h4 className="text-lg font-bold text-white">{m.visualTitle}</h4>
                        </div>
                        <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{m.visualSubtitle}</p>
                    </div>

                    <MeaningProximity nodes={nodes} activeId={activeId} onSelect={setActiveId} closestTag={m.closestTag} dir={dir} showAllLinks />
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
