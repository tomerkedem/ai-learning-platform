"use client";

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ScrollText, Plus, Sparkles } from 'lucide-react';

import { PromptScenarioSelector } from './PromptScenarioSelector';
import { CandidateRankingPanel } from './CandidateRankingPanel';
import { ProbabilitySignalsPanel } from './ProbabilitySignalsPanel';
import { MostLikelyNotTruthCard } from './MostLikelyNotTruthCard';
import { ACCENTS } from './accents';
import { DUR, EASE } from './motionTokens';
import type { ContinuationScenario, ProbabilityCandidate } from './types';

interface ContinuationLabProps {
    scenarios: ContinuationScenario[];
    defaultId?: string;
}

// טקסטי הסבר לימודיים קצרים, קבועים, לא תלויי בחירה.
const HELPERS = {
    ranking: 'כל בקשה פותחת תחרות בין כמה המשכים אפשריים. המודל נותן לכל המשך משקל סבירות לפי מה שכתוב. שימו לב מי מוביל, ובכמה.',
    context: 'עכשיו הוסיפו פרט הקשר אחד. אותם המשכים בדיוק יקבלו משקלים אחרים. ההקשר משנה מה נעשה סביר.',
};

/**
 * מעבדת ההמשכים הסבירים (Continuation Lab) - מיכל הפרק.
 * אחריות יחידה: מחזיק את הפרומט הנבחר ואת פריט ההקשר הפעיל, ומרכיב את הלוח.
 * כל הנתונים מגיעים מבחוץ ב-props. אין כאן מודל אמיתי, חישוב חי או courseData.
 * הפער כמדד ביטחון ושער ההחלטה אינם כאן, הם שייכים לפרק 9.
 */
export const ContinuationLab: React.FC<ContinuationLabProps> = ({ scenarios, defaultId }) => {
    const reduce = useReducedMotion();
    const [selectedId, setSelectedId] = useState(defaultId ?? scenarios[0]?.id);
    const [activeContextId, setActiveContextId] = useState<string | null>(null);

    const current = useMemo(
        () => scenarios.find((sc) => sc.id === selectedId) ?? scenarios[0],
        [scenarios, selectedId],
    );

    if (!current) return null;

    const activeToggle = current.contextToggles.find((t) => t.id === activeContextId) ?? null;
    const activeAccent = activeToggle?.accent ?? current.accent;

    // אותה קבוצת המשכים, משקלים לפי ההקשר הפעיל. ממיינים יורד כדי שהמוביל יזוז למעלה.
    const activeContinuations: ProbabilityCandidate[] = current.continuations
        .map((c) => ({
            ...c,
            probability: activeToggle ? (activeToggle.weights[c.id] ?? c.probability) : c.probability,
        }))
        .sort((a, b) => b.probability - a.probability);

    const activeSignals = activeToggle ? activeToggle.signals : current.signals;

    // החלפת פרומט מאפסת את ההקשר הפעיל, כדי שכל פרומט יתחיל מהמשקל הבסיסי שלו.
    const selectPrompt = (id: string) => {
        setSelectedId(id);
        setActiveContextId(null);
    };

    // מפתח לשחזור ה-stagger של לוח הרמזים בכל החלפת פרומט או הקשר.
    const replayKey = `${current.id}-${activeContextId ?? 'base'}`;

    const fullPrompt = activeToggle ? `${current.prompt} ${activeToggle.labelHe}` : current.prompt;

    return (
        <div className="space-y-4">
            <p className="text-sm leading-relaxed text-slate-400" dir="rtl">
                בחרו אחד משלושת הניסוחים. כל אחד פותח קבוצת המשכים אפשריים עם משקלים שונים.
            </p>

            {/* הבורר נצמד בראש אזור הניתוח: אפשר להחליף ניסוח בכל שלב של הגלילה. */}
            <div className="sticky z-20" style={{ top: 'var(--bts-sticky-top, 88px)' }}>
                <div className="rounded-2xl border border-slate-700/40 bg-slate-950/75 p-2 shadow-xl shadow-black/30 backdrop-blur-xl">
                    <PromptScenarioSelector scenarios={scenarios} selectedId={current.id} onSelect={selectPrompt} />
                </div>
            </div>

            {/* הפרומט המלא: הניסוח עם תוספת ההקשר אם נבחרה */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 text-right" dir="rtl">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">הפרומט המלא</div>
                <p className="text-sm font-bold text-slate-100">
                    &quot;{fullPrompt}&quot;
                </p>
            </div>

            {/* הסבר לפני דירוג ההמשכים */}
            <p className="text-sm leading-relaxed text-slate-400" dir="rtl">{HELPERS.ranking}</p>

            {/* דירוג ההמשכים: אותו לוח, המשקלים נעים עם כל בחירה והקשר */}
            <motion.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={reduce ? { duration: 0 } : { duration: DUR.mid, ease: EASE.out }}
                className="space-y-4"
            >
                <CandidateRankingPanel candidates={activeContinuations} accent={activeAccent} />

                {/* הבהרת המחשה לימודית, צמוד למספרים כדי שהאחוזים לא ייקראו כהסתברות אמיתית */}
                <p className="-mt-1 px-1 text-xs leading-relaxed text-slate-500" dir="rtl">
                    המספרים כאן הם המחשה לימודית של יחסי סבירות, לא חישוב אמיתי של מודל.
                </p>

                {/* בורר ההקשר: הלב של המעבדה. הוספת פרט מזיזה את המשקלים */}
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
                    <div className="mb-1 flex items-center gap-2">
                        <Plus size={16} className={ACCENTS[activeAccent].text} />
                        <div className="leading-tight">
                            <div className="text-sm font-bold text-slate-200">הוסיפו הקשר</div>
                            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Add context</div>
                        </div>
                    </div>
                    <p className="mb-4 text-xs leading-relaxed text-slate-400">{HELPERS.context}</p>

                    <div className="flex flex-wrap gap-2">
                        <ContextChip
                            label="בלי הקשר נוסף"
                            active={activeContextId === null}
                            accent={current.accent}
                            onClick={() => setActiveContextId(null)}
                        />
                        {current.contextToggles.map((t) => (
                            <ContextChip
                                key={t.id}
                                label={`+ ${t.labelHe}`}
                                active={activeContextId === t.id}
                                accent={t.accent}
                                onClick={() => setActiveContextId(t.id)}
                            />
                        ))}
                    </div>

                    {activeToggle && (
                        <motion.div
                            key={activeToggle.id}
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                            className={`mt-4 flex items-start gap-2 rounded-xl border p-3 text-sm leading-relaxed text-slate-200 ${ACCENTS[activeToggle.accent].border} ${ACCENTS[activeToggle.accent].bgSoft}`}
                        >
                            <Sparkles size={15} className={`mt-0.5 shrink-0 ${ACCENTS[activeToggle.accent].text}`} />
                            <span>{activeToggle.note}</span>
                        </motion.div>
                    )}
                </div>

                {/* הרמזים שהזיזו את המשקל - מפתח ממוקד לשחזור ה-stagger */}
                <ProbabilitySignalsPanel key={`signals-${replayKey}`} signals={activeSignals} accent={activeAccent} />
            </motion.div>

            {/* כרטיס התובנה המרכזי - קבוע, לא תלוי בבחירה */}
            <div className="flex items-center gap-2 pt-2 text-slate-400" dir="rtl">
                <ScrollText size={15} />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">The key takeaway</span>
            </div>
            <MostLikelyNotTruthCard />
        </div>
    );
};

/** צ׳יפ בחירת הקשר. הצ׳יפ הפעיל מקבל את גוון ההקשר, השאר נשארים נייטרליים. */
const ContextChip: React.FC<{
    label: string;
    active: boolean;
    accent: React.ComponentProps<typeof CandidateRankingPanel>['accent'];
    onClick: () => void;
}> = ({ label, active, accent, onClick }) => {
    const a = ACCENTS[accent];
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-bold transition-colors ${
                active
                    ? `${a.border} ${a.bgSoft} ${a.text}`
                    : 'border-slate-700/60 bg-slate-950/40 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
        >
            {label}
        </button>
    );
};
