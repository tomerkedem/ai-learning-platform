"use client";

// components/ai-internals/StickyContextBar.tsx
// פס הקשר דביק משותף ללומדה "מאחורי הקלעים של AI".
//
// ── הבעיה שהוא פותר ──────────────────────────────────────────────────────────
// בפרקים מבוססי-בורר (2, 3, 8, 9, 10, 11, 12) הלומד בוחר תרחיש/פרומפט אחד ואז
// גולל דרך אזור ניתוח ארוך (הסתברויות, דירוגים, שערים, החלטות). הבורר נשאר בראש
// המעבדה ונעלם מהמסך, והלומד מאבד את התשובה לשאלה "על איזה קלט מדברים עכשיו?".
// הפס הזה מצמיד שורה דקה אחת: הקלט הפעיל + ההחלטה שהמנוע גזר ממנו, ונשאר גלוי
// תוך כדי גלילת הניתוח. זו אותה גישה כמו StickyInputDock של פרק 8, מותאמת לבחירה
// בדידה (בורר) במקום לשדה הקלדה חי.
//
// ── גבולות אחריות ────────────────────────────────────────────────────────────
// שכבת הצגה בלבד. כל השדות *נקראים* מה-state של הפרק (props); הפס אינו משנה לוגיקה,
// אינו מחזיק state, ואינו מקור קלט שני — הבחירה נשארת בבורר הקיים של הפרק.

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanSearch } from 'lucide-react';

import { ACCENTS } from './accents';
import { DUR, EASE } from './motionTokens';
import type { Accent } from './types';

/** טון ההחלטה — מנותק מהאנומים הספציפיים של כל פרק. */
export type ContextTone = 'go' | 'caution' | 'stop' | 'neutral';

/** טון ההחלטה → גוון תג. צעד בטוח=ירוק, זהירות=ענבר, עצירה=ורוד. */
const TONE_ACCENT: Record<ContextTone, Accent> = {
    go: 'emerald',
    caution: 'amber',
    stop: 'rose',
    neutral: 'slate',
};

export interface StickyContextBarProps {
    /** הטקסט המרכזי: הפרומפט / התרחיש / הקלט שמנותח כעת. */
    inputText: string;
    /** תווית קצרה (סוג הבקשה / שם התרחיש). אופציונלי. */
    labelHe?: string;
    labelEn?: string;
    /** גוון הנקודה לצד הקלט (גוון התרחיש הפעיל). ברירת מחדל: purple. */
    inputAccent?: Accent;
    /** ההחלטה / המסלול שהמנוע גזר מהקלט. */
    decisionHe: string;
    decisionEn?: string;
    tone: ContextTone;
    /** מדד קצר אופציונלי שמוצג בדסקטופ (למשל "פער 12%" / "סיכון גבוה"). */
    metricHe?: string;
    reduce: boolean;
    /**
     * עוקף את ה-offset הדביק. ברירת המחדל מכוונת לכותרת הפרק הדביקה של
     * ChapterLayout במצב מכווץ (~88px), זהה ל-StickyInputDock.
     */
    stickyClassName?: string;
}

export const StickyContextBar: React.FC<StickyContextBarProps> = ({
    inputText,
    labelHe,
    labelEn,
    inputAccent = 'purple',
    decisionHe,
    decisionEn,
    tone,
    metricHe,
    reduce,
    stickyClassName = 'sticky top-[88px] z-10',
}) => {
    const ia = ACCENTS[inputAccent];
    const da = ACCENTS[TONE_ACCENT[tone]];

    return (
        <div className={stickyClassName}>
            {/* רקע אטום-למחצה + blur כדי שהניתוח שנגלל מאחור לא יזלוג. */}
            <div
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-700/50 bg-slate-950/85 px-3 py-2 shadow-xl shadow-black/30 backdrop-blur-xl"
                dir="rtl"
            >
                {/* ── ימין (התחלת RTL): הקלט הנוכחי ── */}
                <div className="flex min-w-0 items-center gap-2">
                    <span className="hidden shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:inline-flex">
                        <ScanSearch size={13} className="text-slate-400" />
                        <span>מנותח כעת</span>
                    </span>

                    <span className={`h-2 w-2 shrink-0 rounded-full ${ia.dot}`} />

                    <span className="min-w-0 leading-tight">
                        {labelHe && (
                            <span className="block truncate text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                {labelHe}
                                {labelEn && <span className="ms-1 opacity-70" dir="ltr">{labelEn}</span>}
                            </span>
                        )}
                        {/* הקלט עצמו — טקסט פשוט (ללא אנימציה פר-תו, נוח לשדה הקלדה חי). */}
                        <span className="block truncate text-sm font-bold text-slate-100">{inputText}</span>
                    </span>
                </div>

                {/* ── שמאל: מדד + ההחלטה ── */}
                <div className="flex shrink-0 items-center gap-2">
                    {metricHe && (
                        <span className="hidden rounded-md border border-slate-700/60 bg-slate-950/40 px-2 py-0.5 text-[10px] font-bold text-slate-400 sm:inline-flex" dir="rtl">
                            {metricHe}
                        </span>
                    )}

                    {/* תג ההחלטה — מתחלף בהחלקה עדינה כשההחלטה משתנה (אירוע נדיר, לא ג'אנקי). */}
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={decisionHe}
                            initial={reduce ? false : { opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? { opacity: 1 } : { opacity: 0, y: -5 }}
                            transition={reduce ? { duration: 0 } : { duration: DUR.quick, ease: EASE.out }}
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${da.border} ${da.bgSoft} ${da.text}`}
                        >
                            <span>{decisionHe}</span>
                            {decisionEn && (
                                <span className="hidden text-[9px] font-medium uppercase opacity-70 sm:inline" dir="ltr">{decisionEn}</span>
                            )}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
