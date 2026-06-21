"use client";

import React from 'react';

interface EngineStepProps {
    /** הסבר קצר בעברית לשלב הזה. */
    note: string;
    children: React.ReactNode;
}

/**
 * עוטף שלב יחיד במנוע ומצרף לו כיתוב הסבר בעברית.
 * אחריות יחידה: קישור בין כרטיס שלב לבין ההסבר שלו. הטקסט מגיע מבחוץ דרך props.
 */
export const EngineStep: React.FC<EngineStepProps> = ({ note, children }) => (
    <div dir="rtl">
        {children}
        <p className="mt-2 px-1 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-400">
            <span className="mt-[5px] h-1 w-1 rounded-full bg-slate-600 shrink-0" />
            <span>{note}</span>
        </p>
    </div>
);
