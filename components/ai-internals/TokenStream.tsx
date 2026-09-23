"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ScanLine, Sparkles } from 'lucide-react';
import { TokenChip } from './TokenChip';
import { TokenRoleCard } from './TokenRoleCard';
import { ACCENTS } from './accents';
import type { Accent } from './types';
import type { Token } from '@/app/(course)/behind-the-scenes-ai/chapter-3/tokenizer';
import { useChapter3Lab } from '@/app/(course)/behind-the-scenes-ai/chapter-3/labContent';
import { useT } from '@/i18n/useT';

interface TokenStreamProps {
    tokens: Token[];
    accent: Accent;
    selectedIndex: number | null;
    onSelect: (index: number | null) => void;
}

/** צומת במסלול הפירוק (Input Text -> Tokenizer -> Token Stream). */
const RailNode: React.FC<{ he: string; en: string; accent: Accent; highlight?: boolean }> = ({ he, en, accent, highlight }) => {
    const a = ACCENTS[accent];
    return (
        <div className={`rounded-xl border px-3 py-1.5 text-center leading-tight ${highlight ? `${a.border} ${a.bgTint}` : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)]'}`}>
            <span className={`block text-[11px] font-bold ${highlight ? a.text : 'text-[var(--bts-text-secondary)]'}`}>{he}</span>
            <span className="block text-[8px] uppercase tracking-[0.16em] text-[var(--bts-text-faint)]" dir="ltr">{en}</span>
        </div>
    );
};

/**
 * Token Stream Animation: המשפט לא נכנס כמקשה אחת. כל token נכנס ככרטיס נע,
 * נדלק לרגע ומתיישב בשורה. לחיצה על טוקן פותחת את כרטיס התפקיד שלו.
 */
export const TokenStream: React.FC<TokenStreamProps> = ({ tokens, accent, selectedIndex, onSelect }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const { stream } = useChapter3Lab();
    const { dir } = useT();

    // מעקב אחרי טוקנים חדשים כדי לפעום אותם (New token detected).
    // החישוב נעשה ב-effect (לא בזמן render) כדי לא לקרוא ref בזמן הרינדור.
    const prevIds = useRef<Set<string>>(new Set(tokens.map((t) => t.id)));
    const [newIds, setNewIds] = useState<Set<string>>(new Set());
    useEffect(() => {
        const current = new Set(tokens.map((t) => t.id));
        const fresh = new Set([...current].filter((id) => !prevIds.current.has(id)));
        prevIds.current = current;
        setNewIds(fresh);
    }, [tokens]);

    const selected = selectedIndex != null ? tokens[selectedIndex] : null;

    return (
        <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
            <div className="mb-4 flex items-center gap-2">
                <ScanLine size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-[var(--bts-text-body)]">{stream.title}</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">{stream.titleEn}</div>
                </div>
            </div>

            {/* המסלול */}
            <div className="mb-4 flex items-center justify-center gap-2" dir="ltr">
                <RailNode he={stream.rail.input.label} en={stream.rail.input.en} accent={accent} />
                <ArrowLeft size={16} className="rotate-180 text-[var(--bts-text-subtle)]" />
                <RailNode he={stream.rail.tokenizer.label} en={stream.rail.tokenizer.en} accent={accent} highlight />
                <ArrowLeft size={16} className="rotate-180 text-[var(--bts-text-subtle)]" />
                <RailNode he={stream.rail.stream.label} en={stream.rail.stream.en} accent={accent} />
            </div>

            {/* הטוקנים */}
            {tokens.length === 0 ? (
                <p className="py-4 text-center text-sm text-[var(--bts-text-faint)]">{stream.empty}</p>
            ) : (
                <div className="flex flex-wrap gap-2" dir={dir}>
                    <AnimatePresence mode="popLayout">
                        {tokens.map((tok, i) => (
                            <motion.div
                                key={tok.id}
                                layout
                                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={reduce ? undefined : { opacity: 0, scale: 0.7 }}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 22, delay: Math.min(i * 0.06, 0.5) }}
                            >
                                <TokenChip
                                    text={tok.text}
                                    role={tok.role}
                                    onClick={() => onSelect(selectedIndex === i ? null : i)}
                                    active={selectedIndex === i}
                                    pulse={newIds.has(tok.id)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--bts-text-faint)]">
                <Sparkles size={12} className={a.text} /> {stream.hint}
            </p>

            {/* כרטיס התפקיד של הטוקן הנבחר */}
            <AnimatePresence>
                {selected && (
                    <div className="mt-3">
                        <TokenRoleCard key={selected.id} text={selected.text} role={selected.role} onClose={() => onSelect(null)} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
