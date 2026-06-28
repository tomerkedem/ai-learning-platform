"use client";

// EmbeddingExperienceLab - מכונת הלמידה ההיברידית של פרק 4.
// ──────────────────────────────────────────────────────────────────────────
// מתזמר בלבד: מחזיק activeId, compareId ושובל החלפת מילה, ומחבר את שלושת הפאנלים
// לחוויה אחת. המפה בוחרת איפה המשפט נוחת, המגנט מסביר למה הוא נחת שם, וה-DNA מוכיח
// למה שני משפטים קרובים או רחוקים. בחירת משפט מעדכנת את הכל יחד, והחלפת מילה מרגישה
// כמו משמעות שזזה, לא רק נתון שהשתנה. ברירת המחדל עברית (ללא Provider).

import React, { useCallback, useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';

import { useChapter4Lab, joinSentences } from '../labContent';
import type { SentenceId } from '../embeddingEngine';
import { MeaningSpaceMap, type SwapTrail } from './MeaningSpaceMap';
import { MeaningMagnetPanel } from './MeaningMagnetPanel';
import { MeaningDnaStrip } from './MeaningDnaStrip';

const DEFAULT_ACTIVE: SentenceId = 'pkg-not-arrived';
const DEFAULT_COMPARE: SentenceId = 'delivery-not-handed';
const STRANGER: SentenceId = 'billing-address-update';

interface EmbeddingExperienceLabProps {
    dir?: 'rtl' | 'ltr';
}

export const EmbeddingExperienceLab: React.FC<EmbeddingExperienceLabProps> = ({ dir = 'rtl' }) => {
    const lab = useChapter4Lab();
    const sentences = useMemo(() => joinSentences(lab), [lab]);
    const byId = useMemo(() => new Map(sentences.map((s) => [s.id, s] as const)), [sentences]);

    const [activeId, setActiveId] = useState<SentenceId>(DEFAULT_ACTIVE);
    const [compareId, setCompareId] = useState<SentenceId | null>(DEFAULT_COMPARE);
    const [swapTrail, setSwapTrail] = useState<SwapTrail | null>(null);

    const active = byId.get(activeId) ?? sentences[0];
    const compare = compareId ? byId.get(compareId) ?? null : null;

    // בחירת משפט: ההשוואה נקבעת לתאום הקרוב, או לזר אם אין תאום. השובל מתאפס.
    const handleSelect = useCallback(
        (id: SentenceId) => {
            const picked = byId.get(id);
            if (!picked) return;
            setActiveId(id);
            setCompareId(picked.nearbyIds[0] ?? (id === STRANGER ? DEFAULT_ACTIVE : STRANGER));
            setSwapTrail(null);
        },
        [byId],
    );

    // החלפת מילה: אותו משפט עם מילה שונה. שומרים את ההשוואה כדי שה-DNA יראה את הסחיפה,
    // ומציירים שובל מהמיקום הישן לחדש כדי שיירגש שהמשמעות זזה.
    const handleSwap = useCallback(
        (toId: SentenceId) => {
            const from = byId.get(activeId);
            const to = byId.get(toId);
            if (!from || !to) return;
            setSwapTrail({ from: from.point, to: to.point });
            setActiveId(toId);
        },
        [byId, activeId],
    );

    const handleReset = useCallback(() => {
        setActiveId(DEFAULT_ACTIVE);
        setCompareId(DEFAULT_COMPARE);
        setSwapTrail(null);
    }, []);

    return (
        <div dir={dir} className="space-y-4 text-start">
            {/* בקרת בחירה + החלפת מילה */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{lab.controls.pickSentence}</div>
                <div className="flex flex-wrap gap-2">
                    {sentences.map((s) => {
                        const isActive = s.id === activeId;
                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => handleSelect(s.id)}
                                aria-pressed={isActive}
                                className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${
                                    isActive
                                        ? 'border-violet-500/60 bg-violet-900/25 text-violet-100'
                                        : 'border-slate-700/60 bg-slate-800/40 text-slate-300 hover:border-slate-600'
                                }`}
                            >
                                {s.text}
                            </button>
                        );
                    })}
                </div>

                {active.swaps.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300">{lab.controls.swapWord}</span>
                        {active.swaps.map((sw) => (
                            <button
                                key={sw.chipId}
                                type="button"
                                onClick={() => handleSwap(sw.toId)}
                                className="rounded-xl border border-violet-500/50 bg-violet-900/20 px-3 py-1.5 text-xs font-bold text-violet-100 transition-colors hover:brightness-110"
                            >
                                {sw.label}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={handleReset}
                            className="ms-auto inline-flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-xs font-bold text-slate-400 transition-colors hover:text-slate-200"
                        >
                            <RotateCcw size={13} /> {lab.controls.reset}
                        </button>
                    </div>
                )}
            </div>

            {/* המפה והמגנט זה לצד זה במסכים רחבים, נערמים בטלפון */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <MeaningSpaceMap
                    sentences={sentences}
                    activeId={activeId}
                    compareId={compareId}
                    onSelect={handleSelect}
                    labels={lab.map}
                    swapTrail={swapTrail}
                    dir={dir}
                />
                <MeaningMagnetPanel profile={active.profile} labels={lab.magnets} title={lab.ui.magnetTitle} dir={dir} />
            </div>

            {/* ה-DNA כראיה ברוחב מלא */}
            <MeaningDnaStrip active={active} compare={compare} geneLabels={lab.genes} dna={lab.dna} dir={dir} />
        </div>
    );
};
