"use client";

// MeaningDnaStrip - חתימת המשמעות כראיה קומפקטית.
// ──────────────────────────────────────────────────────────────────────────
// כל משפט הופך לרצף "גנים" זוהרים (ממדי משמעות). שני משפטים זה מעל זה חושפים את
// הגנים המשותפים. compareDna נותן את הספירה ואת הקרבה. יש סיכום טקסטואלי קצר וגם
// סיכום מוסתר להקראה (TTS / קורא מסך). יפה בטלפון כי הרצועות נערמות לרוחב מלא.

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
    showLabels: boolean;
}> = ({ sentence, geneLabels, shared, reduce, showLabels }) => (
    <div className="grid grid-cols-6 gap-1.5">
        {DNA_DIMS.map((d) => {
            const value = dimValue(sentence.profile, d);
            const isShared = shared.has(d);
            return (
                <div key={d} className="flex flex-col items-center gap-1">
                    <div
                        className={`relative h-16 w-full overflow-hidden rounded-lg border bg-slate-900/70 ${
                            isShared ? 'border-white/40' : 'border-slate-700/40'
                        }`}
                        aria-label={`${geneLabels[d]} ${Math.round(value * 100)}%`}
                    >
                        <motion.div
                            initial={false}
                            animate={{ height: `${Math.round(value * 100)}%` }}
                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 20 }}
                            className={`absolute inset-x-0 bottom-0 ${DIM_STYLE[d].bar}`}
                        />
                        {isShared && <span className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/30" />}
                    </div>
                    {showLabels && (
                        <span className="w-full truncate text-center text-[9px] font-medium text-slate-400">{geneLabels[d]}</span>
                    )}
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
            <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-bold text-slate-200">{dna.title}</span>
            </div>

            {/* רצועת המשפט הפעיל */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-3">
                <div className="mb-2 text-xs font-bold text-cyan-200">{active.text}</div>
                <GeneRow sentence={active} geneLabels={geneLabels} shared={sharedGenes} reduce={!!reduce} showLabels={!compare} />
            </div>

            {compare && (
                <>
                    {/* רצועת ההשוואה */}
                    <div className="mt-2 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-3">
                        <div className="mb-2 text-xs font-bold text-fuchsia-200">{compare.text}</div>
                        <GeneRow sentence={compare} geneLabels={geneLabels} shared={sharedGenes} reduce={!!reduce} showLabels />
                    </div>

                    {/* סיכום הראיה: גנים משותפים, סחיפה, פסיקה */}
                    {result && (
                        <div className="mt-3 rounded-2xl border border-violet-500/30 bg-violet-900/10 p-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-sm font-bold text-violet-100">{dna.sharedGenes(result.sharedGenes, result.totalGenes)}</span>
                                <span
                                    className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${
                                        stayedClose
                                            ? 'border-emerald-500/40 bg-emerald-900/20 text-emerald-200'
                                            : 'border-amber-500/40 bg-amber-900/20 text-amber-200'
                                    }`}
                                >
                                    {verdict}
                                </span>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800/80">
                                    <motion.div
                                        initial={false}
                                        animate={{ width: `${Math.round(result.closeness * 100)}%` }}
                                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20 }}
                                        className="h-full rounded-full bg-gradient-to-l from-violet-400 to-fuchsia-400"
                                    />
                                </div>
                                <span className="shrink-0 font-mono text-[11px] text-violet-200" dir="ltr">
                                    {dna.drift(driftPct)}
                                </span>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* סיכום מוסתר להקראה */}
            <p className="sr-only" aria-live="polite">
                {active.ttsLine}
                {compare && result ? ` ${compare.ttsLine} ${dna.sharedGenes(result.sharedGenes, result.totalGenes)}. ${verdict}.` : ''}
            </p>
        </div>
    );
};
