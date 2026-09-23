"use client";

// EmbeddingExperienceLab - חלק המשפטים של "קרבה במשמעות" בפרק 4.
// ──────────────────────────────────────────────────────────────────────────
// אותה שפת תצוגה כמו דמו האובייקטים: בוחרים משפט, ורואים איזה משפט הכי קרוב אליו
// במשמעות. השדה הוא התוצאה, ה-DNA הוא ההוכחה (אילו רכיבי משמעות משותפים), וכוחות
// המשמעות הם ההסבר (אילו אותות עיצבו את הייצוג). המיקומים בשדה הם פריסה נקייה, והקרוב
// ביותר נגזר מ-nearbyIds של המנוע, כך שזוג המשלוח באמת מודגש כקרוב.

import React, { useCallback, useMemo, useState } from 'react';
import { RotateCcw, ArrowLeft, PackageX, Truck, PackageCheck, Monitor, CreditCard, Search, Send, Sparkles, Dna, type LucideIcon } from 'lucide-react';

import { GuessButton } from '@/components/ai-internals/GuessButton';

import { useChapter4Lab, joinSentences } from '../labContent';
import type { SentenceId } from '../embeddingEngine';
import { SemanticCardMap, type SemanticCardData } from './SemanticCardMap';
import { MeaningDnaStrip } from './MeaningDnaStrip';

const DEFAULT_ACTIVE: SentenceId = 'pkg-not-arrived';
const DEFAULT_COMPARE: SentenceId = 'delivery-not-handed';

// שפת צבע אחידה לדרגות הקרבה, תואמת בדיוק למפת הכרטיסים:
// ציאן=הנבחר, ירוק=הכי קרוב, סגול=קשור אבל שונה, אפור=רחוק יותר.
const RELATION_TONE = {
    close: 'border-emerald-500/30 bg-emerald-900/15 text-emerald-200',
    related: 'border-violet-500/30 bg-violet-900/15 text-violet-200',
    far: 'border-slate-500/30 bg-slate-800/40 text-slate-300',
} as const;

// קצה צבעוני מוביל לכל שורת יחס, כך שהכרטיס בפאנל מהדהד את הכרטיס המתאים במפה.
const RELATION_ACCENT = {
    close: 'border-s-emerald-400/60',
    related: 'border-s-violet-400/60',
    far: 'border-s-slate-500/50',
} as const;

const RelationRow: React.FC<{ tone: keyof typeof RELATION_TONE; label: string; text: string; reason: string }> = ({ tone, label, text, reason }) => (
    <div className={`rounded-xl border border-s-2 border-slate-700/40 bg-slate-950/30 p-2.5 ${RELATION_ACCENT[tone]}`}>
        <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${RELATION_TONE[tone]}`}>{label}</span>
            <span className="text-[13px] font-bold text-slate-100">{text}</span>
        </div>
        <p className="text-[12px] leading-relaxed text-slate-400">{reason}</p>
    </div>
);

// אייקון מזהה לכל כרטיס משפט. נקבע בקוד (לא טקסט מתורגם), ומחזק חזותית את המשמעות.
const ICON: Record<SentenceId, LucideIcon> = {
    'pkg-not-arrived': PackageX,
    'delivery-not-handed': Truck,
    'pkg-arrived': PackageCheck,
    'system-not-showing': Monitor,
    'billing-address-update': CreditCard,
    'agent-investigate-delay': Search,
    'agent-notify-lost': Send,
};

interface EmbeddingExperienceLabProps {
    dir?: 'rtl' | 'ltr';
}

export const EmbeddingExperienceLab: React.FC<EmbeddingExperienceLabProps> = ({ dir = 'rtl' }) => {
    const lab = useChapter4Lab();
    const sentences = useMemo(() => joinSentences(lab), [lab]);
    const byId = useMemo(() => new Map(sentences.map((s) => [s.id, s] as const)), [sentences]);

    const [activeId, setActiveId] = useState<SentenceId>(DEFAULT_ACTIVE);
    const [compareId, setCompareId] = useState<SentenceId | null>(DEFAULT_COMPARE);
    // originId != null פירושו שהחלפת מילה פעילה: זה המשפט המקורי שאליו "חזרה" מחזירה.
    const [originId, setOriginId] = useState<SentenceId | null>(null);

    const active = byId.get(activeId) ?? sentences[0];
    const compare = compareId ? byId.get(compareId) ?? null : null;

    // בונה כרטיס סמנטי קומפקטי למשפט: תווית קצרה, אייקון מזהה ושבבי משמעות.
    const cardOf = useCallback(
        (id: SentenceId): SemanticCardData => {
            const c = lab.map.cards[id];
            return { id, shortLabel: c.shortLabel, icon: ICON[id], chips: c.chips };
        },
        [lab],
    );

    // בחירת משפט מהבוחר: מבטל החלפת מילה פעילה, וההשוואה נקבעת לקרוב ביותר לפי מטא-דאטה
    // היחסים, כדי שה-DNA יעקוב אחרי אותו "הכי קרוב" שמוצג בפאנל היחסים.
    const handleSelect = useCallback(
        (id: SentenceId) => {
            if (!byId.get(id)) return;
            setActiveId(id);
            setCompareId(lab.map.relations[id].closestId);
            setOriginId(null);
        },
        [byId, lab],
    );

    // החלפת מילה: המשפט המקורי נשמר ב-originId, המשפט המוחלף הופך לנבחר, וההשוואה נקבעת אל
    // המקורי. כך ה-DNA מראה ישירות אם ניסוח שונה קירב או הרחיק את המשמעות מהמשפט המקורי.
    const handleSwap = useCallback(
        (toId: SentenceId) => {
            if (!byId.get(toId)) return;
            setOriginId(activeId);
            setCompareId(activeId);
            setActiveId(toId);
        },
        [byId, activeId],
    );

    // חזרה למשפט המקורי: משחזר משפט נבחר, קרוב ביותר, מפה, DNA וכוחות המשמעות, ומסתיר את
    // הכפתור (אין עוד החלפה פעילה).
    const handleReset = useCallback(() => {
        if (originId === null) return;
        setActiveId(originId);
        setCompareId(lab.map.relations[originId].closestId);
        setOriginId(null);
    }, [originId, lab]);

    const ex = lab.explain;
    const r = lab.map;
    const rel = r.relations[activeId];
    const relClosest = byId.get(rel.closestId) ?? null;
    const relRelated = byId.get(rel.relatedId) ?? null;
    const relFar = byId.get(rel.farId) ?? null;

    // נתוני מפת הכרטיסים: המשפט הנבחר במרכז, וסביבו שלושת היחסים לפי דרגת קרבה.
    const selectedCard = cardOf(activeId);
    const relCards = [
        { card: cardOf(rel.closestId), tag: r.relClosest, tier: 'closest' as const },
        { card: cardOf(rel.relatedId), tag: r.relRelated, tier: 'related' as const },
        { card: cardOf(rel.farId), tag: r.relFar, tier: 'far' as const },
    ];

    return (
        <div dir={dir} className="space-y-5 text-start">
            {/* ── בחירת משפט: כרטיס דביק שנשאר בראש בזמן גלילה אל המפה, ה-DNA וכוחות המשמעות,
                 כדי שאפשר לבחור משפט אחר ולראות את השינויים למטה בלי לגלול חזרה ── */}
            <div
                className="sticky z-30 rounded-2xl border border-slate-700/50 bg-slate-950/90 p-4 shadow-xl shadow-black/30 backdrop-blur-xl"
                style={{ top: 'var(--bts-sticky-top, 88px)' }}
            >
                <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">{lab.controls.pickSentence}</div>
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
                                        ? 'border-cyan-400/60 bg-cyan-900/20 text-cyan-100'
                                        : 'border-slate-700/50 bg-slate-800/30 text-slate-300 hover:border-slate-600'
                                }`}
                            >
                                {s.text}
                            </button>
                        );
                    })}
                </div>

                {/* החלפת מילה: שאלה מנחה, כפתור עם השינוי המפורש (מקור ← תוצאה), והסבר קצר */}
                {active.swaps.length > 0 && (
                    <div className="mt-4 border-t border-slate-700/40 pt-4">
                        <div className="mb-2.5 text-[12px] font-bold text-violet-200">{lab.controls.swapTitle}</div>
                        <div className="flex flex-wrap gap-2">
                            {active.swaps.map((sw) => (
                                <button
                                    key={sw.chipId}
                                    type="button"
                                    onClick={() => handleSwap(sw.toId)}
                                    aria-label={`${sw.from} ${sw.label}`}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-violet-500/50 bg-violet-900/20 px-3 py-1.5 text-xs font-bold text-violet-100 transition-colors hover:brightness-110"
                                >
                                    <span>{sw.from}</span>
                                    <ArrowLeft size={13} className="shrink-0 text-violet-300" aria-hidden />
                                    <span className="text-cyan-200">{sw.label}</span>
                                </button>
                            ))}
                        </div>
                        <p className="mt-2.5 text-[12px] leading-relaxed text-slate-400">{lab.controls.swapHint}</p>
                    </div>
                )}

                {/* חזרה למשפט המקורי: מופיע רק כשהחלפה פעילה, ומשחזר את כל התצוגה */}
                {originId !== null && (
                    <div className="mt-4 border-t border-slate-700/40 pt-3">
                        <GuessButton
                            onClick={handleReset}
                            variant="ghost"
                            leadingIcon={<RotateCcw size={13} />}
                        >
                            {lab.controls.resetSwap}
                        </GuessButton>
                    </div>
                )}
            </div>

            {/* ── שלב 3: מפת הכרטיסים ברוחב מלא ──────────────────────────────── */}
            {/* השדה משוחרר לרוחב מלא כדי שלכרטיסים יהיה אוויר; ההסבר יושב כרצועה מתחתיו. */}
            <div>
                <div className="mb-3">
                    <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-cyan-300" />
                        <h4 className="text-lg font-bold text-white">{r.packageTitle}</h4>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{r.packageSubtitle}</p>
                </div>

                <SemanticCardMap selected={selectedCard} relations={relCards} onSelect={(id) => handleSelect(id as SentenceId)} dir={dir} />
            </div>

            {/* פאנל "מה קרוב למה": רצועה אופקית מתחת למפה, שלוש דרגות זו לצד זו */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4">
                <div className="mb-3 text-[13px] font-bold text-slate-100">{r.relationTitle}</div>
                {/* עוגן: המשפט הנבחר כפס ציאן מודגש, תואם למרכז המודגש במפה */}
                <div className="mb-3 flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-900/15 px-3 py-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(34,211,238,0.45)]" />
                    <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-cyan-300/80">{r.centerLabel}</span>
                    <span className="truncate text-sm font-bold text-cyan-100">{active.text}</span>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-3">
                    {relClosest && <RelationRow tone="close" label={r.relClosest} text={relClosest.text} reason={rel.reasonClosest} />}
                    {relRelated && <RelationRow tone="related" label={r.relRelated} text={relRelated.text} reason={rel.reasonRelated} />}
                    {relFar && <RelationRow tone="far" label={r.relFar} text={relFar.text} reason={rel.reasonFar} />}
                </div>
                <p className="mt-3 border-t border-slate-700/40 pt-3 text-[12px] leading-relaxed text-slate-400">{r.coreRule}</p>
            </div>

            {/* ── שלב 4: הוכחה והסבר. ה-DNA הוא הראיה היחידה: אילו רכיבי משמעות משותפים ── */}
            <div className="rounded-2xl border border-violet-500/30 bg-slate-900/40 p-4 sm:p-5">
                <div className="mb-1 flex items-center gap-2">
                    <Dna size={18} className="text-violet-300" />
                    <h4 className="text-lg font-bold text-white">{r.proofTitle}</h4>
                </div>
                <p className="mb-4 text-[13px] leading-relaxed text-slate-400">{r.proofLead}</p>

                {/* ה-DNA כראיה: אילו רכיבי משמעות משותפים */}
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/30 p-4">
                    <MeaningDnaStrip active={active} compare={compare} geneLabels={lab.genes} dna={lab.dna} dir={dir} />
                    <p className="mt-3 text-[13px] leading-relaxed text-slate-400">{ex.dna}</p>
                </div>

                {/* שורת היושרה: Embedding משווה משמעות, לא מאמת מה קרה באמת */}
                <p className="mt-4 border-t border-violet-500/20 pt-3 text-[13px] font-semibold leading-relaxed text-slate-200">{r.honest}</p>
            </div>
        </div>
    );
};
