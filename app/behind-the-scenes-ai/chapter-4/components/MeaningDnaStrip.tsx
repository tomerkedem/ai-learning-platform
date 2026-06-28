"use client";

// MeaningDnaStrip - חתימת המשמעות כראיה קומפקטית ורגועה.
// ──────────────────────────────────────────────────────────────────────────
// כל משפט הופך לרצף "גנים" זוהרים (ממדי משמעות). שני משפטים זה מעל זה חושפים את
// הגנים המשותפים. compareDna נותן את הספירה ואת הקרבה. שכבת תמיכה: מעט גבולות, מספר
// מפתח גדול אחד (כמה גנים משותפים), בלי תוויות זעירות. ה-aria שומר נגישות והקראה.

import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import type { JoinedSentence, Chapter4LabDict } from '../labContent';
import { DNA_DIMS, compareDna, dimValue, DIM_STYLE } from '../embeddingEngine';

interface MeaningDnaStripProps {
    active: JoinedSentence;
    compare: JoinedSentence | null;
    geneLabels: Chapter4LabDict['genes'];
    dna: Chapter4LabDict['dna'];
    dir: 'rtl' | 'ltr';
}

const LIT = 0.4;
const CLOSE = 0.2;
const CLOSE_VERDICT = 0.7;

const GeneRow: React.FC<{
    sentence: JoinedSentence;
    geneLabels: Chapter4LabDict['genes'];
    shared: Set<string>;
    reduce: boolean;
}> = ({ sentence, geneLabels, shared, reduce }) => (
    <div className="grid grid-cols-6 gap-1.5">
        {DNA_DIMS.map((d) => {
            const value = dimValue(sentence.profile, d);
            const isShared = shared.has(d);
            return (
                <div
                    key={d}
                    className={`relative h-14 overflow-hidden rounded-lg bg-slate-900/70 ${isShared ? 'ring-1 ring-inset ring-white/35' : ''}`}
                    aria-label={`${geneLabels[d]} ${Math.round(value * 100)}%`}
                >
                    <motion.div
                        initial={false}
                        animate={{ height: `${Math.round(value * 100)}%` }}
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 20 }}
                        className={`absolute inset-x-0 bottom-0 ${DIM_STYLE[d].bar}`}
                    />
                </div>
            );
        })}
    </div>
);

export const MeaningDnaStrip: React.FC<MeaningDnaStripProps> = ({ active, compare, geneLabels, dna, dir }) => {
    const reduce = useReducedMotion();

    const result = useMemo(() => (compare ? compareDna(active.profile, compare.profile) : null), [active, compare]);

    const sharedGenes = useMemo(() => {
        const set = new Set<string>();
        if (!compare) return set;
        DNA_DIMS.forEach((d) => {
            const av = dimValue(active.profile, d);
            const bv = dimValue(compare.profile, d);
            if (av >= LIT && bv >= LIT && Math.abs(av - bv) <= CLOSE) set.add(d);
        });
        return set;
    }, [active, compare]);

    const driftPct = result ? Math.round(result.drift * 100) : 0;
    const stayedClose = result ? result.closeness >= CLOSE_VERDICT : false;
    const verdict = stayedClose ? dna.stayedClose : dna.drifted;

    return (
        <div dir={dir} className="text-start">
            <div className="mb-3 text-base font-bold text-slate-100">{dna.title}</div>

            {/* רצועות הגנים בכרטיס שקט אחד */}
            <div className="space-y-3 rounded-2xl border border-slate-700/40 bg-slate-900/30 p-4">
                <div>
                    <div className="mb-1.5 text-[13px] font-bold text-cyan-200">{active.text}</div>
                    <GeneRow sentence={active} geneLabels={geneLabels} shared={sharedGenes} reduce={!!reduce} />
                </div>

                {compare && (
                    <div>
                        <div className="mb-1.5 text-[13px] font-bold text-fuchsia-200">{compare.text}</div>
                        <GeneRow sentence={compare} geneLabels={geneLabels} shared={sharedGenes} reduce={!!reduce} />
                    </div>
                )}
            </div>

            {/* סיכום הראיה: מספר מפתח גדול, פסיקה, סחיפה */}
            {compare && result && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-500/20 bg-violet-900/10 px-4 py-3">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black leading-none text-violet-100" dir="ltr">
                            {result.sharedGenes}/{result.totalGenes}
                        </span>
                        <span className="text-xs text-slate-400">{dna.sharedLabel}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span
                            className={`rounded-md border px-2.5 py-1 text-xs font-bold ${
                                stayedClose
                                    ? 'border-emerald-500/30 bg-emerald-900/15 text-emerald-200'
                                    : 'border-amber-500/30 bg-amber-900/15 text-amber-200'
                            }`}
                        >
                            {verdict}
                        </span>
                        <span className="font-mono text-sm text-violet-200" dir="ltr">
                            {dna.drift(driftPct)}
                        </span>
                    </div>
                </div>
            )}

            {/* סיכום מוסתר להקראה */}
            <p className="sr-only" aria-live="polite">
                {active.ttsLine}
                {compare && result ? ` ${compare.ttsLine} ${dna.sharedGenes(result.sharedGenes, result.totalGenes)}. ${verdict}.` : ''}
            </p>
        </div>
    );
};
