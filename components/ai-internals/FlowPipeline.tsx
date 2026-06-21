"use client";

import React from 'react';
import { ArrowDown } from 'lucide-react';
import { FlowStepCard } from './FlowStepCard';
import type { Accent, FlowStep } from './types';

interface FlowPipelineProps {
    steps: FlowStep[];
    /** אינדקס השלב המודגש (0-based). אם לא מוגדר - אף שלב לא מודגש. */
    activeIndex?: number;
    accent?: Accent;
}

/**
 * מקבלת מערך steps ומציגה אותם כרצף חזותי אנכי עם חיבורים.
 * אין hard-coded chapter logic ואין hard-coded AI logic - רק רינדור של מה שקיבלה.
 */
export const FlowPipeline: React.FC<FlowPipelineProps> = ({
    steps,
    activeIndex,
    accent = 'cyan',
}) => {
    if (steps.length === 0) {
        return (
            <div className="text-center text-sm text-slate-500 py-8" dir="rtl">
                אין שלבים להצגה.
            </div>
        );
    }

    return (
        <div className="flex flex-col items-stretch gap-2" dir="rtl">
            {steps.map((step, i) => (
                <React.Fragment key={step.id}>
                    <FlowStepCard
                        step={step}
                        index={i + 1}
                        isActive={activeIndex === i}
                        accent={accent}
                    />
                    {i < steps.length - 1 && (
                        <div className="flex justify-center py-0.5">
                            <ArrowDown size={16} className="text-slate-600" />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};
