"use client";

// components/ai-internals/IntroInteractions.tsx
// טעימת טוקניזציה חיה למבוא של "מאחורי הקלעים של AI".
//
// ── כלל היושרה ───────────────────────────────────────────────────────────────
// ערך הליבה של הלומדה הוא ש"כל המספרים מחושבים חי". לכן הרכיב כאן לא מזייף שום
// חישוב מודל: הטוקניזציה היא פיצול-טקסט אמיתי בצד-לקוח (ומסויג בכך מפורשות).
// החישוב האמיתי במורד הצינור חי בלאב של פרק 8.
//
// הערה: הניחוש המהיר עבר לרכיב ייעודי HypothesisGuess (כרטיסי השערה פרימיום).

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Keyboard, Info } from 'lucide-react';

/* ════════════════════════ טעימת טוקניזציה חיה ════════════════════════════ */

const SAMPLE_SENTENCES = [
    'מה מזג האוויר בתל-אביב?',
    'תכתוב לי שיר קצר על הים',
    'כמה זה 17 כפול 23?',
];

/**
 * פיצול ראשוני להמחשה: לפי רווחים, עם ניתוק סימני פיסוק נגררים לטוקן נפרד.
 * זה *לא* מתיימר להיות הטוקנייזר האמיתי (שחותך גם בתוך מילים) - וזה מסויג בתצוגה.
 */
function tokenize(text: string): string[] {
    const trimmed = text.trim();
    if (!trimmed) return [];
    return trimmed.split(/\s+/).flatMap((word) => {
        const m = word.match(/^(.+?)([?!.,:;]+)$/u);
        return m ? [m[1], m[2]] : [word];
    });
}

export const LiveTokenizeTaste: React.FC<{ reduce: boolean }> = ({ reduce }) => {
    const [text, setText] = useState(SAMPLE_SENTENCES[0]);
    const tokens = useMemo(() => tokenize(text), [text]);

    return (
        <div
            dir="rtl"
            className="rounded-[2rem] border border-cyan-500/30 bg-slate-900/60 p-6 backdrop-blur-xl shadow-[0_0_40px_-12px_rgba(34,211,238,0.35)] md:p-8"
        >
            <div className="mb-5 flex items-center gap-2.5">
                <div className="rounded-xl border border-cyan-500/30 bg-slate-800 p-2">
                    <Scissors className="text-cyan-400" size={18} />
                </div>
                <div>
                    <div className="text-sm font-bold text-white">המשפט שלכם, רגע אחרי שנכנס למנוע</div>
                    <div className="text-xs text-cyan-400/80">טוקניזציה חיה - מחושבת על מה שתכתבו, כאן ועכשיו</div>
                </div>
            </div>

            <div className="relative flex items-center rounded-2xl border border-slate-700/60 bg-slate-950/60 transition-colors focus-within:border-cyan-500/60">
                <Keyboard size={18} className="mr-4 shrink-0 text-cyan-400/70" />
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="כתבו כאן משפט משלכם…"
                    dir="rtl"
                    aria-label="שדה הקלדה לטוקניזציה חיה"
                    className="w-full bg-transparent px-3 py-3.5 text-lg font-medium text-white placeholder:text-slate-600 focus:outline-none"
                />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                {SAMPLE_SENTENCES.map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setText(s)}
                        className="rounded-xl border border-cyan-500/30 bg-cyan-900/10 px-3 py-1.5 text-xs font-bold text-cyan-200/90 transition-colors hover:bg-cyan-900/25"
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">הטוקנים שלכם</span>
                    <span
                        role="status"
                        aria-live="polite"
                        aria-label={`${tokens.length} טוקנים`}
                        className="font-mono text-xs font-bold text-cyan-300"
                        dir="ltr"
                    >
                        {tokens.length} tokens
                    </span>
                </div>
                <div className="flex min-h-[3rem] flex-wrap gap-2">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {tokens.map((tok, i) => (
                            <motion.span
                                key={i}
                                layout
                                initial={reduce ? false : { opacity: 0, scale: 0.6, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 22, delay: Math.min(i * 0.025, 0.3) }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-slate-950/60 px-2.5 py-1.5"
                            >
                                <span className="font-mono text-[9px] text-slate-600">{i + 1}</span>
                                <span className="text-sm font-bold text-cyan-100">{tok}</span>
                            </motion.span>
                        ))}
                    </AnimatePresence>
                    {tokens.length === 0 && (
                        <span className="self-center text-sm text-slate-600">כתבו משהו כדי לראות את הפיצול…</span>
                    )}
                </div>
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-xl border border-white/5 bg-slate-950/40 p-3 text-[11px] leading-relaxed text-slate-400">
                <Info size={13} className="mt-0.5 shrink-0 text-slate-500" />
                <span>
                    זה פיצול ראשוני להמחשה. מודל אמיתי חותך לפעמים גם <span className="font-bold text-slate-300">בתוך</span> מילה
                    (למשל <code dir="ltr" className="text-cyan-300">&quot;תל-אביב&quot; → [&quot;תל&quot;,&quot;-&quot;,&quot;אביב&quot;]</code>), ולכל טוקן נותן מספר מזהה.
                    זו רק <span className="font-bold text-cyan-300">התחנה השנייה במפה</span> - כל השאר מחכה בהמשך.
                </span>
            </div>
        </div>
    );
};
