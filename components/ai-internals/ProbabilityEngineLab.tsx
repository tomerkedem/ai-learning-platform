"use client";

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ScrollText, Scale } from 'lucide-react';

import { PromptScenarioSelector } from './PromptScenarioSelector';
import { CandidateRankingPanel } from './CandidateRankingPanel';
import { DistributionShapePanel } from './DistributionShapePanel';
import { ConfidenceMarginCard } from './ConfidenceMarginCard';
import { ProbabilitySignalsPanel } from './ProbabilitySignalsPanel';
import { DecisionOutcomeCard } from './DecisionOutcomeCard';
import { MostLikelyNotTruthCard } from './MostLikelyNotTruthCard';
import type { ProbabilityScenario } from './types';

interface ProbabilityEngineLabProps {
    scenarios: ProbabilityScenario[];
    defaultId?: string;
}

// טקסטי הסבר לימודיים קצרים, קבועים לכל אזור (לא תלויי בחירה).
const HELPERS = {
    ranking: 'כל תשובה מתחילה בתחרות בין כמה פירושים אפשריים. המנוע נותן לכל אפשרות ציון יחסי, ואז בודק אם יש מוביל ברור.',
    margin: 'המספר הגבוה ביותר לא מספיק. חשוב גם הפער בינו לבין האפשרות השנייה.',
    decision: 'כאשר הפער גדול, אפשר לענות בזהירות. כאשר הפער קטן, עדיף לבקש עוד הקשר.',
};

/**
 * מעבדת ההסתברויות (Probability Engine Lab) - מיכל הפרק.
 * אחריות יחידה: מחזיק את הבחירה הנוכחית ומרכיב את לוח הבקרה ההסתברותי.
 * כל הנתונים מגיעים מבחוץ ב-props; אין כאן מודל אמיתי, חישוב חי או courseData.
 */
export const ProbabilityEngineLab: React.FC<ProbabilityEngineLabProps> = ({ scenarios, defaultId }) => {
    const reduce = useReducedMotion();
    const [selectedId, setSelectedId] = useState(defaultId ?? scenarios[0]?.id);

    const current = useMemo(
        () => scenarios.find((sc) => sc.id === selectedId) ?? scenarios[0],
        [scenarios, selectedId],
    );

    if (!current) return null;

    // מפתח הפעלה: כל החלפת תרחיש מנגנת מחדש את חשיפת הלוח.
    const replayKey = current.id;
    const distributionValues = current.candidates.map((c) => c.probability);

    return (
        <div className="space-y-4">
            {/* בחירת הפרומט */}
            <p className="text-sm leading-relaxed text-slate-400" dir="rtl">
                בחרו אחד משלושת הניסוחים. כולם עוסקים באותה חבילה, אבל כל אחד מייצר התפלגות הסתברות שונה לגמרי.
            </p>
            <PromptScenarioSelector scenarios={scenarios} selectedId={current.id} onSelect={setSelectedId} />

            {/* הסבר לפני דירוג האפשרויות */}
            <p className="text-sm leading-relaxed text-slate-400" dir="rtl">{HELPERS.ranking}</p>

            {/* לוח הבקרה - מתחלף בכל בחירה */}
            <motion.div
                key={replayKey}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
            >
                {/* שורה עליונה: דירוג האפשרויות (רחב) + מדי ההתפלגות והפער */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <CandidateRankingPanel candidates={current.candidates} accent={current.accent} />
                    </div>
                    <div className="flex flex-col gap-4 lg:col-span-1">
                        <DistributionShapePanel shape={current.distributionShape} values={distributionValues} />
                    </div>
                </div>

                {/* פער הביטחון - מדגיש שהפער חשוב יותר מהמספר הראשון */}
                <p className="text-sm leading-relaxed text-slate-400" dir="rtl">{HELPERS.margin}</p>
                <ConfidenceMarginCard
                    topProbability={current.topProbability}
                    secondProbability={current.secondProbability}
                    margin={current.margin}
                    confidence={current.confidence}
                />

                {/* הרמזים שהזיזו את ההסתברות */}
                <ProbabilitySignalsPanel signals={current.signals} accent={current.accent} />

                {/* ההחלטה */}
                <div className="flex items-center gap-2 pt-1 text-slate-400" dir="rtl">
                    <Scale size={15} />
                    <p className="text-sm leading-relaxed">{HELPERS.decision}</p>
                </div>
                <DecisionOutcomeCard
                    kind={current.decisionKind}
                    decisionHe={current.decisionHe}
                    decisionEn={current.decisionEn}
                    explanation={current.decisionExplanation}
                />
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
