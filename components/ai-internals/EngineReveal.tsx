"use client";

// components/ai-internals/EngineReveal.tsx
//
// "המבט מבחוץ": כרטיס בסגנון צ׳אט שמראה איך הדברים נראים מנקודת המבט של הלומד,
// בקשה למעלה ותשובה למטה, וביניהן הרמז שמשהו שלם מסתתר. זו אשליית הפשטות: שני
// שלבים בלבד. השאלה "מה קרה באמצע" נשארת פתוחה כאן בכוונה, ונענית בהמשך הרצף
// (ניחוש ההשערות -> שער המנוע -> מפת התחנות).
//
// הרכיב אינו חושף עדיין את התחנות, כדי לא להדליף את תשובת הניחוש שמופיע אחריו.
// הוא ניטרלי לתוכן: כל הטקסט מגיע ב-props (מוכן ל-i18n).

import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, Send } from 'lucide-react';

interface EngineRevealProps {
    reduce: boolean;
    promptRole: string;
    prompt: string;
    answerRole: string;
    answer: string;
    outsideLine: string;
    curiosityLine: string;
    /** טקסט דהוי בשורת ההקלדה התחתונה. */
    inputPlaceholder?: string;
}

export const EngineReveal: React.FC<EngineRevealProps> = ({
    reduce, promptRole, prompt, answerRole, answer, outsideLine, curiosityLine,
    inputPlaceholder = 'הקלידו הודעה...',
}) => {
    return (
        <div
            dir="rtl"
            className="relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-900/70 p-5 backdrop-blur-2xl shadow-2xl md:p-7"
        >
            {/* הילות רקע */}
            <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px]" />

            <div className="relative">
                {/* ── בקשה (משתמש) ── */}
                <div className="flex items-start justify-end gap-2.5">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-sm border border-cyan-500/30 bg-cyan-900/20 px-4 py-3">
                        <div className="mb-1 text-[11px] font-bold text-cyan-300/80">{promptRole}</div>
                        <p className="text-sm leading-relaxed text-slate-100 md:text-base">{prompt}</p>
                    </div>
                    <div className="mt-0.5 shrink-0 rounded-full border border-cyan-500/30 bg-slate-800 p-2">
                        <User size={16} className="text-cyan-300" />
                    </div>
                </div>

                {/* ── הרווח שביניהן: כאן מסתתר המנוע ── */}
                <div className="my-3">
                    <div className="relative flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-600/50 bg-slate-950/40 px-4 py-4">
                        {!reduce && (
                            <motion.div
                                className="pointer-events-none absolute inset-x-6 h-px bg-gradient-to-l from-transparent via-cyan-400/70 to-transparent"
                                initial={{ top: '0%' }}
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                                aria-hidden
                            />
                        )}
                        <p className="text-center text-sm leading-relaxed text-slate-400">{outsideLine}</p>
                        <p className="text-center text-base font-bold leading-relaxed text-cyan-200 md:text-lg">{curiosityLine}</p>
                    </div>
                </div>

                {/* ── תשובה (מודל) ── */}
                <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0 rounded-full border border-indigo-500/30 bg-slate-800 p-2">
                        <Sparkles size={16} className="text-indigo-300" />
                    </div>
                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-indigo-500/30 bg-indigo-900/15 px-4 py-3">
                        <div className="mb-1 text-[11px] font-bold text-indigo-300/80">{answerRole}</div>
                        <p className="text-sm leading-relaxed text-slate-100 md:text-base">{answer}</p>
                    </div>
                </div>

                {/* ── שורת ההקלדה (תחתית): כמו בצ׳אט אמיתי, הקלט למטה וההודעות מעליו.
                    דהויה ולא-פעילה בכוונה - היא רק ממחישה איפה מקלידים. ── */}
                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-600/50 bg-slate-950/60 py-2 pr-4 pl-2">
                    <span className="flex-1 text-sm text-slate-500">{inputPlaceholder}</span>
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-slate-950" aria-hidden>
                        <Send size={16} />
                    </span>
                </div>
            </div>
        </div>
    );
};
