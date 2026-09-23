"use client";

// components/ai-internals/AgentLoop.tsx
//
// "Living Engine" v4 (אב-טיפוס ויזואלי בטוח, DOM/SVG/CSS בלבד):
// שתי סצנות פרימיום שוות-מעמד סביב אותה ליבת-LLM. הליבה (EngineCore) זהה בגודל
// ובמיקום בשני המצבים, כדי שתורגש כמנוע אחד שסביבו מתחלף עולם:
//
//   Chat  - עולם תכלת: מסילת-זכוכית אופקית שעוברת ישר דרך הליבה (ChatStraightPath).
//           מינימלי ומרוּוח. המסר בסיום: השיחה השתנתה, העולם שבחוץ לא.
//   Agent - עולם סגול: אותה ליבה, אותו גודל, אותו מיקום, מוקפת בטבעות חדר-בקרה
//           (AgentControlRoom) עם 6 תחנות, שהפולס מתקדם ביניהן בזמן הרצה.
//
// התשובה כבר לא יושבת בכרטיס נפרד מתחת למנוע. בסיום הסבב היא נחשפת כשורת-תוצאה
// ירוקה קומפקטית בתוך ה-slot החי שמעל המנוע (LiveStatusSlot), ליד פאנץ' המצב, בלי
// להגדיל את גובה הכרטיס.
//
// ארכיטקטורה: AgentLoop הוא המנצח (state, מתג, הרצה, פולס, תחנות); רכיבי-העזר
// הפנימיים הם חלקי-הסצנה. שכבת ה-canvas הריקה (aria-hidden) שמורה לשלב עתידי של
// מנוע חלקיקים, בלי תלות חדשה וללא ריסטור טקסט-לחלקיקים כרגע.
//
// נגישות: התחנות ומתג המצב הם כפתורים אמיתיים (aria-pressed), עם תווית מלאה,
// תמיכת מקלדת וטבעת פוקוס. קישוטים aria-hidden. הכיתוב החי הוא aria-live יחיד.
//
// reduced-motion: מבטל תנועות רציפות (טבעות מסתובבות, פולס, parallax, פעימות,
// סריקת-אור), ומשאיר רק החלפות-מצב עדינות. כל הטקסט מגיע מבחוץ (מוכן ל-i18n).

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Cpu, Keyboard, Sparkles, Target, Wrench, ShieldCheck, Zap, MessageSquare, MessageCircle, Bot,
} from 'lucide-react';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';
import type { AgentDemo } from '@/app/(course)/behind-the-scenes-ai/introduction/introContent';
import type { Direction } from '@/i18n/config';

const STAGE_ICON: Record<string, React.ReactNode> = {
    task: <Target size={26} />,
    tool: <Wrench size={26} />,
    risk: <ShieldCheck size={26} />,
    act: <Zap size={26} />,
    answer: <MessageSquare size={26} />,
    in: <Keyboard size={26} />,
    out: <Sparkles size={26} />,
};

// צבע ייחודי לכל תחנה (rgb), נגזר מהמשמעות: קלט=תכלת, הבנת-מטרה=ענבר, בחירת-כלי=סגול,
// בדיקת-סיכון=ורוד, ביצוע=אמרלד, תשובה=פוקסיה. הצבע נחשף בליבה, בהילה ובפולס שנוחת בתחנה.
const STAGE_RGB: Record<string, string> = {
    in: '34,211,238',    // תכלת - קלט/טקסט
    task: '251,191,36',  // ענבר - הבנת המטרה
    tool: '167,139,250', // סגול - בחירת כלי
    risk: '251,113,133', // ורוד - בדיקת סיכון
    act: '52,211,153',   // אמרלד - ביצוע פעולה
    answer: '232,121,249', // פוקסיה - התשובה (Agent)
    out: '232,121,249',  // פוקסיה - התשובה (Chat)
};
const stageRgb = (id: string, fallback: string) => STAGE_RGB[id] ?? fallback;

const ORBIT_R = 38; // אחוז רדיוס - טבעת התחנות במצב Agent

type Mode = 'agent' | 'chat';
type Stage = AgentDemo['agentStages'][number];
type Positioned = Stage & { x: number; y: number };

/* ═══════════════════════ רכיבי-סצנה פנימיים ═══════════════════════ */

// הבמה החיה (EngineCore + ChatStraightPath + AgentControlRoom) מודעת-ערכה: ב-Dark
// היא נשארת בדיוק כפי שהיא, וב-Light היא מקבלת משטח טכני בהיר ואותן טבעות, הילות
// ותנועות בגוונים מותאמים. כל שינוי Light מוגבל ל-variant של light: כדי ש-Dark לא ישתנה.

// ── EngineCore: הליבה המשותפת. זהה בגודל ובמיקום בשני המצבים (רציפות ויזואלית).
//    הצבע הניטרלי-תכלת נשמר גם ב-Agent; מה שמתחלף הוא העולם *סביב* הליבה, לא היא. ──
const EngineCore: React.FC<{
    coreLabel: string; coreText: string; reduce: boolean;
    running: boolean; completed: boolean; onRun: () => void; runLabel: string; replayLabel: string;
}> = ({ coreLabel, coreText, reduce, running, completed, onRun, runLabel, replayLabel }) => (
    // הליבה: ההילה החיצונית הרחבה ירדה משמעותית. הליבה נקראת עכשיו כגוף מוגדר עם
    // מסגרת ועומק פנימי, ולא כמקור אור שמתחרה בהסבר שלידה.
    <div className="relative flex h-48 w-48 flex-col items-center justify-center rounded-full border border-cyan-400/35 bg-slate-900/70 backdrop-blur-xl shadow-[0_0_48px_-22px_rgba(34,211,238,0.4),inset_0_0_40px_-22px_rgba(34,211,238,0.4)] light:border-cyan-600/45 light:bg-white/85 light:shadow-[0_0_48px_-20px_rgba(8,145,178,0.5),inset_0_0_40px_-22px_rgba(8,145,178,0.35)]">
        {/* מערבולת-אנרגיה מסתובבת: תחושת ליבה חיה. הוחלשה כדי שתישאר מרקם ולא תאורה. */}
        {/* תמיד ברינדור (זהה בשרת ובלקוח); ב-reduced-motion מוסתר ב-CSS ולא מונפש. */}
        <motion.div
            className="pointer-events-none absolute inset-1.5 rounded-full opacity-40 motion-reduce:hidden"
            aria-hidden
            style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(34,211,238,0.20) 55deg, transparent 150deg, rgba(168,85,247,0.14) 250deg, transparent 340deg)' }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        />
        {/* פעימת-נשימה: שכבת זוהר פנימית שנושמת. משרעת האטימות צומצמה, כך שהנשימה
            נשארת מורגשת אך אינה מהבהבת ברקע לאורך כל זמן הקריאה. */}
        <motion.div
            className="pointer-events-none absolute inset-4 rounded-full bg-gradient-to-br from-cyan-400/10 to-purple-400/10 blur-lg motion-reduce:from-cyan-400/8 motion-reduce:to-purple-400/8 motion-reduce:blur-md"
            aria-hidden
            animate={reduce ? undefined : { opacity: [0.45, 0.7, 0.45], scale: [0.92, 1.05, 0.92] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* טבעת-זכוכית פנימית דקה: הגדרה וחדות */}
        <div className="pointer-events-none absolute inset-2 rounded-full border border-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] light:border-slate-900/[0.07] light:shadow-[inset_0_1px_0_#fff]" aria-hidden />
        <div className="relative mb-2.5 inline-flex items-center gap-2 rounded-full border border-cyan-500/50 bg-slate-950/70 px-4 py-1.5 light:border-cyan-600/50 light:bg-white">
            <Cpu size={22} className="text-cyan-300 light:text-cyan-700!" aria-hidden />
            <span className="text-lg font-bold tracking-wide text-cyan-200 light:text-cyan-800!" dir="ltr">{coreLabel}</span>
        </div>
        {running ? (
            // בזמן סבב: לב-המנוע מציג את שם התחנה שהפולס עובר בה כרגע.
            <AnimatePresence mode="wait">
                <motion.span
                    key={coreText}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                    className="relative px-3.5 text-center text-xl font-bold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.55)] light:text-slate-900! light:drop-shadow-none"
                >
                    {coreText}
                </motion.span>
            </AnimatePresence>
        ) : (
            // idle/סיום: לב-המנוע *הוא* כפתור ההרצה. Play במרכז - כמו נגן. הליבה היא מה שמריצים.
            <button
                type="button"
                onClick={onRun}
                className="relative inline-flex items-center gap-1.5 rounded-full border border-cyan-300/55 bg-cyan-500/20 px-4 py-2 text-sm font-black text-white light:text-cyan-900! light:border-cyan-600/50 light:bg-cyan-500/15 shadow-[0_0_16px_-6px_rgba(34,211,238,0.6)] transition-all hover:scale-[1.04] hover:bg-cyan-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
            >
                <Play size={14} className="fill-current" aria-hidden />
                {completed ? replayLabel : runLabel}
            </button>
        )}
    </div>
);

// ── ChatStraightPath: עולם התכלת. נתיב-זכוכית אופקי (lane) עם מסילה שעוברת ישר
//    דרך הליבה. סריקת-אור זורמת רק בזמן הרצה (טקסט "זורם" במסלול), לפי כיוון הקריאה. ──
const ChatStraightPath: React.FC<{ reduce: boolean; running: boolean; isRtl: boolean }> = ({
    reduce, running, isRtl,
}) => (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* מסדרון-הזכוכית: לוח אופקי רחב שממלא את הסצנה ונותן לה גוף (מרוּוח אך לא ריק) */}
        <div className="absolute inset-x-[6%] inset-y-[16%] rounded-[2.25rem] border border-cyan-500/25 bg-cyan-500/[0.04] shadow-[inset_0_1px_0_0_rgba(34,211,238,0.15)] light:border-cyan-600/30 light:bg-cyan-500/[0.07]" />
        <div className="absolute inset-x-[6%] inset-y-[16%] rounded-[2.25rem] bg-gradient-to-b from-cyan-400/[0.06] via-transparent to-cyan-500/[0.03]" />
        {/* הילת-מוקד רכה סביב הליבה: עומק וכובד-מרכז. הוחלשה כדי שלא תיצור מקור אור
            שני לצד הליבה עצמה. */}
        <div className="absolute left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.05] blur-3xl light:bg-cyan-400/[0.2]" />
        {/* המסילה: קו דק שמחבר קלט->ליבה->תשובה */}
        <div className="absolute inset-x-[15%] top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-500/10 via-cyan-400/50 to-cyan-500/10 light:via-cyan-500/70">
            {running && !reduce && (
                <motion.div
                    className="absolute top-0 h-full w-1/4 rounded-full bg-gradient-to-r from-transparent via-cyan-100/90 to-transparent light:via-cyan-800/80"
                    animate={{ left: isRtl ? ['100%', '-25%'] : ['-25%', '100%'] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                />
            )}
        </div>
    </div>
);

// ── AgentControlRoom: עולם הסגול. טבעות חדר-בקרה סביב הליבה. הטבעת המקווקוות
//    עוברת בדיוק דרך מרכזי התחנות (inset 12% = רדיוס 38%). ──
const AgentControlRoom: React.FC<{ reduce: boolean }> = ({ reduce }) => (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* הילת-מוקד רכה מאחורי הליבה. הוחלשה: הסגול הוא מבטא משני, ולא תאורת-במה. */}
        <div className="absolute left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl light:bg-purple-500/[0.2]" />
        {/* דיסק-רקע עדין בתוך טבעת התחנות, נותן עומק */}
        <div className="absolute inset-[12%] rounded-full bg-gradient-to-b from-purple-500/[0.05] via-transparent to-slate-950/20 light:to-indigo-300/25" />
        {/* טבעת התחנות המקווקוות (עוברת דרך מרכזי התחנות) - נשארת: מסמנת את מסלול התחנות */}
        <div className="absolute inset-[12%] rounded-full border border-dashed border-purple-400/28 light:border-purple-600/50" />
        {/* טבעת דקה נוספת בפנים: שכבתיות של חדר בקרה */}
        <div className="absolute inset-[30%] rounded-full border border-purple-300/10 light:border-purple-500/30" />
        <>
                <motion.div
                    className="absolute inset-[4%] rounded-full motion-reduce:hidden light:brightness-75 light:saturate-150"
                    style={{
                        background: 'conic-gradient(from 0deg, rgba(168,85,247,0), rgba(168,85,247,0.3), rgba(34,211,238,0.16), rgba(168,85,247,0))',
                        WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                        mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                    }}
                    animate={reduce ? undefined : { rotate: 360 }}
                    transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
                />
                {/* טבעת פנימית נגדית, דקה מאוד - עומק של חדר בקרה */}
                <motion.div
                    className="absolute inset-[22%] rounded-full motion-reduce:hidden light:brightness-75 light:saturate-200"
                    style={{
                        background: 'conic-gradient(from 180deg, rgba(34,211,238,0), rgba(34,211,238,0.16), rgba(168,85,247,0))',
                        WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 1px), #000 calc(100% - 1px))',
                        mask: 'radial-gradient(farthest-side, transparent calc(100% - 1px), #000 calc(100% - 1px))',
                    }}
                    animate={reduce ? undefined : { rotate: -360 }}
                    transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
                />
                <div className="absolute inset-[4%] hidden rounded-full border border-purple-400/25 light:border-purple-600/45 motion-reduce:block" />
        </>
    </div>
);

// ── LiveStatusSlot: תיבת הנרטיב הנושמת. מצב יחיד של aria-live לכל הכרטיס.
//    idle: רמז שקט · running/hover: הסבר התחנה הפעילה · completed: הפאנץ' (closing) +
//    שורת-תוצאה ירוקה קומפקטית עם התשובה עצמה (אות "התקבלה תשובה"), במקום כרטיס נפרד. ──
const LiveStatusSlot: React.FC<{
    reduce: boolean; showClosing: boolean; activeStage: Stage | null;
    closing?: string; hintPrompt: string; body?: string;
    inputLabel?: string; inputText?: string;
    /** התשובה עצמה, שנחשפת בסיום בתוך אותו כרטיס (במקום כרטיס נפרד מתחת למנוע). */
    answerLabel?: string; answerText?: string;
}> = ({ reduce, showClosing, activeStage, closing, hintPrompt, body, inputLabel, inputText, answerLabel, answerText }) => (
    <div
        role="status"
        aria-live="polite"
        className={`flex min-h-[2.75rem] w-full flex-col items-center justify-center rounded-xl border px-4 py-2.5 text-center text-base leading-relaxed transition-colors ${showClosing ? 'border-[var(--bts-brand-secondary)]/30 bg-[var(--bts-brand-secondary)]/10 text-[var(--bts-text-secondary)]' : 'border-purple-500/20 bg-purple-500/8 text-[var(--bts-text-secondary)]'}`}
    >
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={showClosing ? 'done' : activeStage ? `stage-${activeStage.id}` : 'idle'}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                transition={reduce ? { duration: 0 } : { duration: 0.28 }}
            >
                {showClosing ? (
                    <>
                        <p className="font-bold text-[var(--bts-brand-secondary)]">{closing}</p>
                        {/* התשובה עצמה נוחתת כאן, בתוך אותו כרטיס: שורת-תוצאה ירוקה קומפקטית
                            (אינסו + תווית + הטקסט) במקום כרטיס נפרד מתחת למנוע. גובה הכרטיס
                            לא גדל: הסגירה קצרה מגוף-המנוחה, והשורה יושבת במרווח שהתפנה. */}
                        {answerText && (
                            <span className="relative mt-3 inline-flex max-w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 rounded-xl border border-emerald-400/35 bg-emerald-500/[0.08] px-3.5 py-1.5">
                                {/* פרץ-זוהר עדין ברגע ההגעה, מתפשט ודוהה (aria-hidden, reduce-aware) */}
                                {!reduce && (
                                    <motion.span
                                        aria-hidden
                                        className="pointer-events-none absolute -inset-2 rounded-2xl"
                                        style={{ background: 'radial-gradient(closest-side, rgba(52,211,153,0.45), transparent)' }}
                                        initial={{ opacity: 0.85, scale: 0.6 }}
                                        animate={{ opacity: 0, scale: 1.6 }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                    />
                                )}
                                {/* אינסו (円相): טבעת-זן ירוקה כאות "התקבלה תשובה" */}
                                <span className="relative grid h-4 w-4 shrink-0 place-items-center" aria-hidden>
                                    <span
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background: 'conic-gradient(from 210deg, rgba(52,211,153,0.95), rgba(52,211,153,0.3) 250deg, transparent 312deg, rgba(52,211,153,0.95))',
                                            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px))',
                                            mask: 'radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px))',
                                        }}
                                    />
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 8px rgba(52,211,153,0.85)' }} />
                                </span>
                                {answerLabel && <span className="text-sm font-black uppercase tracking-[0.18em] text-[var(--bts-status-positive)]">{answerLabel}</span>}
                                <span className="text-[15px] font-bold leading-snug text-[var(--bts-status-positive)]">{answerText}</span>
                            </span>
                        )}
                    </>
                ) : activeStage ? (
                    <div>
                        <span><span className="font-bold text-[var(--bts-brand-secondary)]">{activeStage.label}: </span>{activeStage.hint}</span>
                        {/* ערך-ההחלטה של התחנה (כוונה/כלי/סיכון/הצעד) עולה לכאן, מעל המנוע, במקום
                            קונסולה נפרדת מתחת לקפל. מוצג רק בתחנות שיש להן ערך (Agent). */}
                        {(activeStage.intent ?? activeStage.tool ?? activeStage.risk ?? activeStage.next) ? (
                            <div className="mt-2 ms-2.5 inline-flex items-center rounded-full border border-purple-400/45 bg-purple-500/15 px-3.5 py-1 text-sm font-black text-[var(--bts-text-primary)]">
                                {activeStage.intent ?? activeStage.tool ?? activeStage.risk ?? activeStage.next}
                            </div>
                        ) : null}
                    </div>
                ) : (
                    // idle: היררכיה ברורה. הבקשה (הכי חשובה) בתיבה מובחנת ומודגשת, אחריה ההסבר
                    // כפסקה קריאה, ולבסוף קריאה-לפעולה שקטה. יישור-התחלה לקריאות של רב-שורות.
                    <div className="space-y-2.5 text-start">
                        {(inputLabel || inputText) && (
                            <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/[0.07] px-3 py-2">
                                <div className="text-xs font-black uppercase tracking-[0.15em] text-[var(--bts-brand-primary-strong)]">{inputLabel}</div>
                                <div className="mt-0.5 text-base font-bold leading-snug text-[var(--bts-text-primary)]">{inputText}</div>
                            </div>
                        )}
                        {body && <p className="text-[15px] leading-relaxed text-[var(--bts-text-secondary)]">{body}</p>}
                        <p className="text-sm text-[var(--bts-text-muted)]">{hintPrompt}</p>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    </div>
);

/* ═══════════════════════ המנצח: AgentLoop ═══════════════════════ */

export const AgentLoop: React.FC<{
    reduce: boolean;
    demo: AgentDemo;
    /** כיוון הכתיבה הפעיל. נקבע בעמוד מ-useT, לא מקובע ב-rtl. */
    dir: Direction;
    mode?: Mode;
    onModeChange?: (m: Mode) => void;
    /** זהות הסצנה בכותרת הקומפקטית, מתחלפת לפי המצב (מגיע מהכרטיס ב-page). */
    eyebrow?: string;
    title?: string;
    /** ההסבר של המצב. יושב ב-slot החי במצב idle (לא בכותרת), כדי לקצר את הכרטיס. */
    body?: string;
    /** הפאנץ' שנוחת ב-slot החי במצב סיום. מגיע מהכרטיס לפי המצב הפעיל (page). */
    closing?: string;
    /** הסיפור המוקרא של המצב הפעיל (goal, tools, approval, result). מחליף הקראת הגדרות הכרטיס. */
    narration?: string;
}> = ({ reduce, demo, dir, mode: modeProp, onModeChange, eyebrow, title, body, closing, narration }) => {
    const isRtl = dir === 'rtl';
    // המתג יכול להיות נשלט מבחוץ (כדי שהקופי שמסביב יתחלף יחד איתו) או פנימי.
    const [modeInternal, setModeInternal] = useState<Mode>('chat');
    const mode = modeProp ?? modeInternal;
    const [step, setStep] = useState(-1);
    const [running, setRunning] = useState(false);
    // מזהה הרצה: עולה בכל הרצה, כדי לאפס את פולס-ההחלטה אל תחנת ההתחלה (קלט)
    // במקום שימשיך מהמיקום הקודם (התשובה) ויסחף אחורה.
    const [runId, setRunId] = useState(0);
    // שכבת-חלקיקים עתידית: נקודת-עיגון בלבד (aria-hidden, ריקה) לשלב ה-Canvas.
    const particleLayerRef = useRef<HTMLCanvasElement>(null);

    // ── סאונד עדין (Web Audio API, ללא תלות וללא קבצי-שמע): צליל-טיק סינתטי בכל מעבר של
    //    הכדור לתחנה, וצליל-סיום מתגמל. הקשר-האודיו נוצר/מתחדש בתוך לחיצת המשתמש על "הריצו". ──
    const audioRef = useRef<AudioContext | null>(null);
    const ensureAudio = useCallback((): AudioContext | null => {
        if (typeof window === 'undefined') return null;
        const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AC) return null;
        if (!audioRef.current) audioRef.current = new AC();
        if (audioRef.current.state === 'suspended') void audioRef.current.resume();
        return audioRef.current;
    }, []);
    const playTone = useCallback((freq: number, dur: number, peak: number, delay = 0) => {
        const ctx = ensureAudio();
        if (!ctx) return;
        const t0 = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 2600; // טימבר חמים ורך, לא צפצוף חד
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(lp); lp.connect(gain); gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.015);          // אטאק רך
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);          // דעיכה טבעית עם זנב
        osc.start(t0);
        osc.stop(t0 + dur + 0.04);
    }, [ensureAudio]);

    const stages = mode === 'agent' ? demo.agentStages : demo.chatStages;

    // הרצת הסבב: קידום שלב-אחרי-שלב, עד התחנה האחרונה.
    useEffect(() => {
        if (!running) return;
        if (step >= stages.length - 1) {
            const t = setTimeout(() => setRunning(false), 800);
            return () => clearTimeout(t);
        }
        const t = setTimeout(() => setStep((s) => s + 1), reduce ? 1000 : 1900);
        return () => clearTimeout(t);
    }, [running, step, stages.length, reduce]);

    // סאונד: מעבר-תחנה = טיק בסולם פנטטוני עולה (תחושת התקדמות והצטברות), וסיום = צליל
    // מתגמל עם הרמוניית-קווינטה (רגע ה"תשובה מוכנה"). רק בזמן הרצה, ורק כשאין reduce.
    useEffect(() => {
        if (reduce || !running || step < 0) return;
        const penta = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]; // C4 D4 E4 G4 A4 C5 - פנטטוני חמים
        if (step >= stages.length - 1) {
            // רגע ה"תשובה חזרה": ארפג'ו עולה של אקורד דו-מז'ור + נצנוץ עליון. פלוריש מתגמל וזכיר.
            playTone(523.25, 0.6, 0.11, 0);      // C5
            playTone(659.25, 0.6, 0.10, 0.07);   // E5
            playTone(783.99, 0.7, 0.10, 0.14);   // G5
            playTone(1046.5, 0.55, 0.06, 0.21);  // C6 - נצנוץ
        } else {
            playTone(penta[Math.min(step, penta.length - 1)], 0.26, 0.1);
        }
    }, [step, running, reduce, stages.length, playTone]);

    // ניקוי הקשר-האודיו ביציאה מהרכיב.
    useEffect(() => () => { const a = audioRef.current; if (a) void a.close().catch(() => undefined); }, []);

    // ההקשר-אודיו נוצר/מתחדש כאן, בתוך מחוות-המשתמש (לחיצה), כדי לעמוד במדיניות ה-autoplay.
    const run = () => { if (!reduce) ensureAudio(); setStep(0); setRunning(true); setRunId((n) => n + 1); };
    // לחיצה על טוגל המצב (Chat/Agent) מחליפה מצב *ומריצה* מיד את הסבב שלו, בלי צורך
    // בלחיצה נפרדת על "הריצו". הלחיצה עצמה היא מחוות-משתמש, ולכן run() רשאי לאתחל אודיו.
    // כפתור ההרצה בלב-המנוע נשאר לריצה-חוזרת (replay) בלי החלפת מצב.
    const switchMode = (m: Mode) => {
        if (onModeChange) onModeChange(m); else setModeInternal(m);
        run();
    };

    // התחנה הפעילה נקבעת אך ורק לפי שלב הסבב (לחיצה על "הריצו"), לא לפי ריחוף עכבר.
    const activeId = step >= 0 ? stages[step].id : null;
    const activeStage = stages.find((s) => s.id === activeId) ?? null;
    const coreText = activeStage ? activeStage.label : demo.idleCore;
    const completed = step >= 0 && step === stages.length - 1;
    // הפאנץ' נוחת כשהסבב הסתיים.
    const showClosing = completed && !!closing;

    // תחנות שמסביב לליבה. ב-Chat הליבה היא שלב "מודל", ולכן היא לא תחנה על המסילה.
    const orbit = mode === 'agent' ? demo.agentStages : demo.chatStages.filter((s) => s.id !== 'model');
    const positioned: Positioned[] = orbit.map((s, i) => {
        if (mode === 'agent') {
            // כיוון זוויתי תלוי-קריאה: LTR עם כיוון השעון, RTL נגדו, כך שהתחנה השנייה
            // מתקדמת לכיוון הקריאה במקום מראה עיוור של הבמה.
            const sign = isRtl ? -1 : 1;
            const ang = ((-90 + sign * i * (360 / orbit.length)) * Math.PI) / 180;
            return { ...s, x: 50 + ORBIT_R * Math.cos(ang), y: 50 + ORBIT_R * Math.sin(ang) };
        }
        // Chat: קלט בקצה תחילת-הקריאה, תשובה בקצה סופה (תלוי-כיוון, לא מראה עיוור).
        const startX = isRtl ? 84 : 16;
        const endX = isRtl ? 16 : 84;
        return { ...s, x: s.id === 'in' ? startX : endX, y: 50 };
    });
    const activeOrbit = positioned.find((n) => n.id === activeId);
    const activePos = activeOrbit ? { x: activeOrbit.x, y: activeOrbit.y } : activeId ? { x: 50, y: 50 } : null;

    // תחנת ההתחלה של הסבב (קלט בשני המצבים). הפולס מתחיל ממנה בכל הרצה.
    const firstOrbit = positioned.find((n) => n.id === stages[0]?.id);
    const firstPos = firstOrbit ? { x: firstOrbit.x, y: firstOrbit.y } : { x: 50, y: 50 };

    // צבעי הסצנה: תכלת ל-Chat, סגול ל-Agent. הליבה עצמה נשארת ניטרלית בשני המצבים.
    // גוון ברירת-מחדל לתחנה שאין לה צבע ייחודי (נופל לפי המצב).
    const isAgent = mode === 'agent';
    const fallbackRgb = isAgent ? '168,85,247' : '34,211,238';
    // צבע הפולס = צבע התחנה שאליה הוא נוחת. בסיום (התקבלה תשובה) הוא הופך לירוק.
    const pulseRgb = completed ? '52,211,153' : activeId ? stageRgb(activeId, fallbackRgb) : fallbackRgb;

    return (
        <div dir={dir}>
            {/* ── ראש-הסצנה המינימליסטי: ללא תיבת-קונסולה. אוויר נדיב, טיפוגרפיה נקייה,
                והלב הוא מתג-הנוזל: גלולה זוהרת שמחליקה בין Chat ל-Agent (layoutId spring)
                וממירה צבע, עם כותרת מונפשת והילת-אווירה שמתחלפת. ── */}
            <div className="relative isolate mb-6">
                {/* הילת-אווירה רכה מאחורי הכותרת, מתחלפת בצבע לפי המצב (גימור עדין) */}
                <div
                    aria-hidden
                    className={`pointer-events-none absolute -top-10 end-0 -z-10 h-40 w-2/3 rounded-full blur-3xl transition-colors duration-700 ${isAgent ? 'bg-purple-600/6' : 'bg-cyan-500/6'}`}
                />

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                    {/* זהות: eyebrow דק עם מרווח-אותיות רחב + כותרת שמתחלפת בהנפשה */}
                    <div className="min-w-0 flex-1">
                        {eyebrow && (
                            <div className={`mb-1.5 text-sm font-black uppercase tracking-[0.22em] transition-colors duration-500 ${isAgent ? 'text-[var(--bts-brand-secondary)]' : 'text-[var(--bts-brand-primary-strong)]'}`}>{eyebrow}</div>
                        )}
                        <div className="flex items-center gap-2.5">
                            <AnimatePresence mode="wait">
                                <motion.h3
                                    key={`title-${mode}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                                    transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="line-clamp-2 text-base font-black leading-tight tracking-tight text-[var(--bts-text-primary)] sm:line-clamp-1 sm:text-lg"
                                >
                                    {title}
                                </motion.h3>
                            </AnimatePresence>
                            {/* הקראת הקופי של המצב הפעיל (מתחלף יחד עם מתג Chat/Agent) */}
                            <SpeakButton text={narration ?? speakJoin(eyebrow, title, body, closing)} />
                        </div>
                    </div>

                    {/* בקרות: מתג-נוזל + הרצה */}
                    <div className="flex shrink-0 items-center gap-3">
                        <div className="relative inline-flex items-center rounded-full border border-[var(--bts-border)] bg-[var(--bts-surface-inset)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
                            {(['chat', 'agent'] as const).map((m) => {
                                const on = mode === m;
                                const isA = m === 'agent';
                                return (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => switchMode(m)}
                                        aria-pressed={on}
                                        className={`relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold transition-colors duration-300 focus:outline-none focus-visible:ring-2 ${isA ? 'focus-visible:ring-purple-400/50' : 'focus-visible:ring-cyan-400/50'} ${on ? (isA ? 'text-[var(--bts-text-primary)]' : 'text-slate-950') : 'text-[var(--bts-text-muted)] hover:text-[var(--bts-text-secondary)]'}`}
                                    >
                                        {on && (
                                            <motion.span
                                                layoutId="scene-thumb"
                                                aria-hidden
                                                className="absolute inset-0 -z-10 rounded-full"
                                                style={{
                                                    background: isA
                                                        ? 'linear-gradient(135deg,#c084fc 0%,#a855f7 45%,#7c3aed 100%)'
                                                        : 'linear-gradient(135deg,#67e8f9 0%,#22d3ee 45%,#0891b2 100%)',
                                                    boxShadow: isA
                                                        ? '0 3px 12px -5px rgba(168,85,247,0.5), inset 0 1px 0 rgba(255,255,255,0.3)'
                                                        : '0 3px 12px -5px rgba(34,211,238,0.5), inset 0 1px 0 rgba(255,255,255,0.4)',
                                                }}
                                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                        {isA ? <Bot size={16} aria-hidden /> : <MessageCircle size={16} aria-hidden />}
                                        {isA ? demo.modeAgent : demo.modeChat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* מפריד לרוחב מלא: פס דק שמפריד בבירור בין הכותרת לתוכן, עם דהייה בקצוות
                    וגוון תלוי-מצב. שלילת המרווח (-mx) מותחת אותו עד קצות הכרטיס. */}
                <div
                    aria-hidden
                    className={`mt-5 -mx-4 h-px bg-gradient-to-r from-transparent to-transparent transition-colors duration-500 md:-mx-6 ${isAgent ? 'via-purple-400/30' : 'via-cyan-400/30'}`}
                />
            </div>

            {/* חדר-הבקרה: רשת 3 עמודות בדסקטופ - עמודת-המנוע קבועה במרכז בין שתי עמודות
                צדדיות שוות (1fr), כך שהמנוע *תמיד* ממורכז ואינו זז בין המצבים. הפאנלים
                יושבים בעמודות הצד; במובייל הכל נופל לטור אחד. */}
            <div>
            {/* ה-slot החי מעל המנוע. כפתור ההרצה עבר ללב-המנוע (Play במרכז), ולכן כאן נשאר
                רק כרטיס-הבקשה/ההסבר. רחב (max-w-4xl) כדי לנצל את רוחב הכרטיס החיצוני,
                שהטקסט יגלוש לפחות שורות ויחסוך גובה. */}
            <div className="mx-auto mb-4 w-full max-w-4xl">
                <div className="w-full">
                    <LiveStatusSlot
                        reduce={reduce}
                        showClosing={showClosing}
                        activeStage={activeStage}
                        closing={closing}
                        hintPrompt={demo.hintPrompt}
                        body={body}
                        inputLabel={demo.input.label}
                        inputText={demo.input.text}
                        answerLabel={demo.output.label}
                        answerText={mode === 'chat' ? demo.output.chat : demo.output.agent}
                    />
                </div>
            </div>
            {/* הבמה: ליבה משותפת + סצנה תלוית-מצב. mx-auto ממרכז אותה תמיד. ב-Chat הבמה
                נמוכה יותר (aspect-[7/5]) כדי שהמנוע יעלה למעלה ולא יישאר מרווח מיותר. */}
            <div className={`relative mx-auto w-full max-w-[460px] rounded-[2rem] light:bg-[radial-gradient(ellipse_at_50%_45%,#ffffff_0%,#eef2fb_62%,#e2e9f6_100%)] light:shadow-[inset_0_0_0_1px_rgba(148,163,184,0.45),0_18px_40px_-28px_rgba(30,41,59,0.35)] ${isAgent ? 'aspect-square' : 'aspect-[7/5]'}`}>
                {/* שכבת-חלקיקים עתידית: ריקה, aria-hidden, לא מציירת דבר כרגע (עיגון ל-Canvas). */}
                <canvas ref={particleLayerRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-0" />

                {/* הסצנה הויזואלית סביב הליבה, לפי המצב */}
                {isAgent
                    ? <AgentControlRoom reduce={reduce} />
                    : <ChatStraightPath reduce={reduce} running={running} isRtl={isRtl} />}

                {/* ליבת המודל: זהה בשני המצבים (גודל, מיקום, צבע) */}
                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                    <EngineCore
                        coreLabel={demo.coreLabel}
                        coreText={coreText}
                        reduce={reduce}
                        running={running}
                        completed={completed}
                        onRun={run}
                        runLabel={demo.run}
                        replayLabel={demo.replay}
                    />
                </div>

                {/* פולס ההחלטה: נקודה זוהרת שעוברת אל התחנה/הליבה הפעילה */}
                {!reduce && activePos && (
                    <motion.span
                        // key לפי הרצה: כל הרצה ממקמת מחדש את הפולס בתחנת הקלט (בלי סחיפה אחורה מהתשובה).
                        key={runId}
                        aria-hidden
                        className="pointer-events-none absolute z-30 h-4 w-4 rounded-full transition-colors duration-500"
                        // הכדור 16px: היסט -8px ממרכז ה-(left,top), כך שמרכזו נוחת בדיוק על מרכז האייקון.
                        // הצבע = גוון התחנה הפעילה (pulseRgb), כך שהאנרגיה מחליפה גוון בין תחנה לתחנה.
                        style={{ x: -8, y: -8, background: `rgb(${pulseRgb})`, boxShadow: `0 0 16px 5px rgba(${pulseRgb},0.75)` }}
                        initial={{ left: `${firstPos.x}%`, top: `${firstPos.y}%` }}
                        animate={{ left: `${activePos.x}%`, top: `${activePos.y}%` }}
                        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                    />
                )}

                {/* תחנות המסלול (Agent: 6 סביב הטבעת · Chat: קלט/תשובה בקצות המסילה) */}
                {positioned.map((n) => {
                    const isActive = activeId === n.id;
                    // כל תחנה בצבע הייחודי שלה: במנוחה גוון עדין, בהפעלה הצבע מתלקח + הילה תואמת.
                    // תחנת התשובה (התחנה הפעילה ברגע הסיום) הופכת לירוק - אות "התקבלה תשובה".
                    const rgb = isActive && completed ? '52,211,153' : stageRgb(n.id, fallbackRgb);
                    return (
                        // עוטף-מיקום: ממקם את *מרכז האייקון* בדיוק על (x,y).
                        <div
                            key={n.id}
                            className="absolute z-20"
                            style={{ left: `${n.x}%`, top: `${n.y}%`, transform: 'translate(-50%, -50%)' }}
                        >
                            {/* תחנה = סמן ויזואלי בלבד. לא אינטראקטיבית: מוארת רק כשהפולס עובר בה בזמן סבב. */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.7 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                                // התחנה הפעילה נשארת האות הברור: מסגרת מלאה, מילוי בגוון והילה.
                                // התחנות במנוחה ירדו למסגרת עדינה על משטח סלייט, כדי שרק אחת
                                // תיראה "דולקת" בכל רגע.
                                className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 light:text-[color-mix(in_oklab,rgb(var(--ink))_62%,black)]! ${isActive ? '' : 'light:bg-white/90!'}`}
                                style={{
                                    ['--ink' as string]: rgb,
                                    borderColor: isActive ? `rgb(${rgb})` : `rgba(${rgb},0.3)`,
                                    background: isActive ? `rgba(${rgb},0.2)` : 'rgba(15,23,42,0.8)',
                                    color: isActive ? '#ffffff' : `rgb(${rgb})`,
                                    boxShadow: isActive ? `0 0 20px -4px rgba(${rgb},0.6)` : 'none',
                                }}
                            >
                                {/* טבעת-פעימה על התחנה הפעילה. הוחלשה: הפולס שנוחת בתחנה
                                    וההילה כבר מסמנים אותה, ושלושה אותות במקביל היו עודף. */}
                                {isActive && !reduce && (
                                    <motion.span
                                        aria-hidden
                                        className="absolute inset-0 rounded-2xl"
                                        style={{ boxShadow: `0 0 0 2px rgba(${rgb},0.45)` }}
                                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                )}
                                <span className="relative">{STAGE_ICON[n.id]}</span>
                                {/* תוויות התחנה מוצגות רק ב-Chat (שני הקצוות: קלט/תשובה). ב-Agent הוסרו:
                                    כשהפולס עובר בתחנה, שם התחנה כבר משתנה במרכז המנוע, ולכן התוויות מיותרות
                                    ומייצרות רעש. הזהות עדיין נחשפת בהרצה (מרכז + ה-slot החי + הקונסולה). */}
                                {!isAgent && (
                                    <span
                                        className={`pointer-events-none absolute left-1/2 top-full mt-1.5 w-28 -translate-x-1/2 text-center text-sm font-bold leading-tight transition-colors ${isActive ? 'light:text-[color-mix(in_oklab,rgb(var(--ink))_62%,black)]!' : 'light:text-slate-600!'}`}
                                        style={{ color: isActive ? `rgb(${rgb})` : '#cbd5e1' }}
                                    >
                                        {n.label}
                                    </span>
                                )}
                            </motion.div>
                        </div>
                    );
                })}
            </div>
            </div>
        </div>
    );
};
