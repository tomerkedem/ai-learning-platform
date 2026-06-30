"use client";

import React from 'react';
import { CheckCircle2, HelpCircle, Wrench, Hand } from 'lucide-react';

import type { DecisionKind, DecisionState } from './types';

// גרסה קומפקטית של DecisionCard: שורה אחת במקום כרטיס הירו, לשימוש בתוך מעבדות
// צפופות שבהן ההחלטה היא סיכום קצר ולא הפיוטה הראשית. אותם ארבעה סוגי החלטה.
const KIND: Record<DecisionKind, { box: string; text: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
    answer: { box: 'border-emerald-500/40 bg-emerald-900/15', text: 'text-emerald-300', Icon: CheckCircle2 },
    ask: { box: 'border-amber-500/40 bg-amber-900/15', text: 'text-amber-300', Icon: HelpCircle },
    tool: { box: 'border-blue-500/40 bg-blue-900/15', text: 'text-blue-300', Icon: Wrench },
    stop: { box: 'border-rose-500/40 bg-rose-900/15', text: 'text-rose-300', Icon: Hand },
};

interface DecisionPillProps {
    decision: DecisionState;
    /** תווית עליונה קטנה. ברירת מחדל אנגלית, עקבי עם שאר תוויות-העל הטכניות במעבדות. */
    eyebrow?: string;
    /** מחלקות נוספות (למשל ring להבזק). */
    className?: string;
}

/** שורת החלטה קומפקטית: אייקון + תווית-על + תווית ההחלטה, צבועה לפי הסוג. */
export const DecisionPill: React.FC<DecisionPillProps> = ({ decision, eyebrow = 'Final decision', className = '' }) => {
    const s = KIND[decision.kind];
    return (
        <div
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 ${s.box} ${className}`}
            role="status"
            aria-live="polite"
        >
            <s.Icon size={16} className={s.text} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{eyebrow}</span>
            <strong className={`ms-auto text-sm font-black ${s.text}`}>{decision.label}</strong>
        </div>
    );
};
