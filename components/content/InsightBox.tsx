import React from 'react';
import { Lightbulb, AlertTriangle, Info, BrainCircuit } from 'lucide-react';

type BoxType = 'intuition' | 'warning' | 'info' | 'math';

interface InsightBoxProps {
    type?: BoxType;
    title: string;
    /**
     * דרגת כותרת סמנטית. ברירת המחדל 4 משמרת את ההתנהגות הקיימת בכל הצרכנים.
     * פרק שבו התיבה היא מקטע עליון בפני עצמו (למשל התובנה המעשית) מעביר 2, כדי
     * שמתאר הכותרות של העמוד לא ידלג על דרגה. העיצוב אינו משתנה.
     */
    headingLevel?: 2 | 3 | 4;
    children: React.ReactNode;
}

export const InsightBox: React.FC<InsightBoxProps> = ({ type = 'info', title, headingLevel = 4, children }) => {
    const Heading = `h${headingLevel}` as const;

    const styles = {
        intuition: {
            border: 'border-indigo-500/30',
            bg: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--ib-l)_var(--bts-tint-mix),var(--ib-d))_10%,transparent)] [--ib-d:var(--color-indigo-900)] [--ib-l:var(--color-indigo-500)]',
            icon: <BrainCircuit size={20} className="text-indigo-400" />,
            titleColor: 'text-indigo-300'
        },
        warning: {
            border: 'border-amber-500/30',
            bg: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--ib-l)_var(--bts-tint-mix),var(--ib-d))_10%,transparent)] [--ib-d:var(--color-amber-900)] [--ib-l:var(--color-amber-500)]',
            icon: <AlertTriangle size={20} className="text-amber-400" />,
            titleColor: 'text-amber-300'
        },
        info: {
            border: 'border-blue-500/30',
            bg: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--ib-l)_var(--bts-tint-mix),var(--ib-d))_10%,transparent)] [--ib-d:var(--color-blue-900)] [--ib-l:var(--color-blue-500)]',
            icon: <Info size={20} className="text-blue-400" />,
            titleColor: 'text-blue-300'
        },
        math: {
            border: 'border-emerald-500/30',
            bg: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--ib-l)_var(--bts-tint-mix),var(--ib-d))_10%,transparent)] [--ib-d:var(--color-emerald-900)] [--ib-l:var(--color-emerald-500)]',
            icon: <Lightbulb size={20} className="text-emerald-400" />,
            titleColor: 'text-emerald-300'
        }
    };

    // רקע התיבה: Dark = הגוון -900 בשקיפות (זהה למקור); Light = הגוון -500 (--bts-tint-mix).
    const style = styles[type];

    return (
        <div className={`my-8 rounded-xl border ${style.border} ${style.bg} p-6 relative overflow-hidden text-start`}>
            <div className="absolute top-0 left-0 w-24 h-24 bg-linear-to-br from-[var(--bts-fill-soft)] to-transparent rounded-br-full pointer-events-none"></div>

            <div className="flex items-start gap-4 relative z-10">
                <div className="p-2 rounded-lg bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] border border-[var(--bts-fill-soft)] shadow-sm shrink-0">
                    {style.icon}
                </div>
                <div>
                    <Heading className={`text-base font-bold mb-2 ${style.titleColor}`}>
                        {title}
                    </Heading>
                    <div className="text-[var(--bts-text-secondary)] text-sm leading-relaxed">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};