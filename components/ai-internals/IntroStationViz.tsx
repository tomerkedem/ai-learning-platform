"use client";

// components/ai-internals/IntroStationViz.tsx
//
// הסצנות החיות שנפתחות בתוך כרטיסי התחנות במפת המבוא. לכל אחת מ-14 התחנות יש
// סצנה שמתחילה לנוע מיד עם פתיחת הכרטיס, ומגע אחד שמשנה את התוצאה. כל סצנה
// מלמדת מושג אחד, לא מקשטת. אין כאן מודל אמיתי: אלה דוגמאות לימודיות מוחשיות.
//
// ── יושרה ─────────────────────────────────────────────────────────────────────
// המספרים והאחוזים כאן הם דוגמה להמחשה בלבד, לא פלט אמיתי של מודל.
//
// ── תוכן וכיוון ────────────────────────────────────────────────────────────────
// הטקסט (משפטים, טוקנים, תוויות, הערות) מגיע מהמילון (t.behindAi.introVisuals.viz),
// והכיוון מגיע מ-useT. המבנה שאינו תלוי-שפה (וקטורים, ציונים גולמיים, אחוזים,
// מיקומים במפת המשמעות, אינדקסים של קשב) נשאר כאן.
//
// ── הפעלה מחדש ────────────────────────────────────────────────────────────────
// הפאנל של תחנה נטען מחדש בכל פתיחה, ולכן כל סצנה רצה מחדש בכל פתיחת כרטיס.
// בנוסף, כפתור "הפעלה מחדש" בעוטף (StationViz) מרענן את הסצנה דרך key, בלי
// לסגור את הכרטיס. חשוב להרצאות: הסצנה זמינה שוב מול קהל בלחיצה אחת.
//
// ── reduced-motion ────────────────────────────────────────────────────────────
// כל סצנה מקבלת reduce. כשהתנועה מצומצמת מציגים את המצב הקונספטואלי הסופי בלי
// רצפים מתוזמנים, והאינטראקציות ממשיכות לעבוד בלי תנועה.

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, ArrowRightLeft, CornerDownLeft, Pause, Play, Plus,
    RotateCcw, Square, Volume2, VolumeX,
} from 'lucide-react';
import type { AccentStyle } from './accents';
import { SpeakButton } from './SpeakButton';
import { useT } from '@/i18n/useT';
import type { Direction } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import type { StationVizKind } from '@/app/behind-the-scenes-ai/introduction/introContent';

type IntroViz = Dictionary['behindAi']['introVisuals']['viz'];

/* ════════════ פלטת "עידן AI": צבע אקזוטי וייחודי לכל תחנה ════════════ */
// כל תחנה מקבלת גוון ניאון או אבן-חן משלה. הסדר קופץ חזק על גלגל הגוונים כך שכל
// תחנה שונה קיצונית מזו שלפניה. אלה אינם חלק ממערכת ה-Accent הכללית של הקורס,
// אלא פלטה ייעודית למפת המבוא, עם ערכי צבע מותאמים (arbitrary) כדי לאפשר גוונים
// שלא קיימים בפלטה הרגילה. מחלקות ליטרליות בלבד כדי ש-Tailwind יזהה אותן.
export const STATION_PALETTE: Record<string, AccentStyle> = {
    // 1 · הבקשה נכנסת - מגנטה פלזמה
    request: {
        border: 'border-[#ff3cac]/45', text: 'text-[#ff3cac]', softText: 'text-[#ff3cac]/70', bgSoft: 'bg-[#ff3cac]/12',
        solid: 'bg-[#ff3cac]', solidText: 'text-white', barFill: 'bg-[#ff3cac]', barGradient: 'bg-gradient-to-l from-[#ff3cac] to-[#ff7ad9]',
        dot: 'bg-[#ff3cac]', ringSoft: 'ring-[#ff3cac]/30', glow: 'shadow-[0_0_45px_-10px_rgba(255,60,172,0.55)]',
    },
    // 2 · פירוק לטוקנים - ליים רדיום
    tokenize: {
        border: 'border-[#b6ff2e]/45', text: 'text-[#b6ff2e]', softText: 'text-[#b6ff2e]/70', bgSoft: 'bg-[#b6ff2e]/12',
        solid: 'bg-[#b6ff2e]', solidText: 'text-slate-950', barFill: 'bg-[#b6ff2e]', barGradient: 'bg-gradient-to-l from-[#b6ff2e] to-[#e6ff57]',
        dot: 'bg-[#b6ff2e]', ringSoft: 'ring-[#b6ff2e]/30', glow: 'shadow-[0_0_45px_-10px_rgba(182,255,46,0.5)]',
    },
    // 3 · מזהים - טורקיז סייבר
    ids: {
        border: 'border-[#1fe0ff]/45', text: 'text-[#1fe0ff]', softText: 'text-[#1fe0ff]/70', bgSoft: 'bg-[#1fe0ff]/12',
        solid: 'bg-[#1fe0ff]', solidText: 'text-slate-950', barFill: 'bg-[#1fe0ff]', barGradient: 'bg-gradient-to-l from-[#1fe0ff] to-[#5ef2ff]',
        dot: 'bg-[#1fe0ff]', ringSoft: 'ring-[#1fe0ff]/30', glow: 'shadow-[0_0_45px_-10px_rgba(31,224,255,0.5)]',
    },
    // 4 · ייצוג מספרי - ענבר סולארי
    embedding: {
        border: 'border-[#ffb020]/45', text: 'text-[#ffb020]', softText: 'text-[#ffb020]/70', bgSoft: 'bg-[#ffb020]/12',
        solid: 'bg-[#ffb020]', solidText: 'text-slate-950', barFill: 'bg-[#ffb020]', barGradient: 'bg-gradient-to-l from-[#ffb020] to-[#ffd152]',
        dot: 'bg-[#ffb020]', ringSoft: 'ring-[#ffb020]/30', glow: 'shadow-[0_0_45px_-10px_rgba(255,176,32,0.5)]',
    },
    // 5 · מיקום וסדר - אולטרה-סגול
    position: {
        border: 'border-[#a24bff]/45', text: 'text-[#a24bff]', softText: 'text-[#a24bff]/70', bgSoft: 'bg-[#a24bff]/12',
        solid: 'bg-[#a24bff]', solidText: 'text-white', barFill: 'bg-[#a24bff]', barGradient: 'bg-gradient-to-l from-[#a24bff] to-[#c98bff]',
        dot: 'bg-[#a24bff]', ringSoft: 'ring-[#a24bff]/30', glow: 'shadow-[0_0_45px_-10px_rgba(162,75,255,0.55)]',
    },
    // 6 · חלון הקשר - מנטה זוהרת
    context: {
        border: 'border-[#22ffb0]/45', text: 'text-[#22ffb0]', softText: 'text-[#22ffb0]/70', bgSoft: 'bg-[#22ffb0]/12',
        solid: 'bg-[#22ffb0]', solidText: 'text-slate-950', barFill: 'bg-[#22ffb0]', barGradient: 'bg-gradient-to-l from-[#22ffb0] to-[#68ffce]',
        dot: 'bg-[#22ffb0]', ringSoft: 'ring-[#22ffb0]/30', glow: 'shadow-[0_0_45px_-10px_rgba(34,255,176,0.5)]',
    },
    // 7 · קשב - ורמיליון
    attention: {
        border: 'border-[#ff5a3c]/45', text: 'text-[#ff5a3c]', softText: 'text-[#ff5a3c]/70', bgSoft: 'bg-[#ff5a3c]/12',
        solid: 'bg-[#ff5a3c]', solidText: 'text-white', barFill: 'bg-[#ff5a3c]', barGradient: 'bg-gradient-to-l from-[#ff5a3c] to-[#ff8a73]',
        dot: 'bg-[#ff5a3c]', ringSoft: 'ring-[#ff5a3c]/30', glow: 'shadow-[0_0_45px_-10px_rgba(255,90,60,0.55)]',
    },
    // 8 · ערבוב - אולטרה-מרין
    mix: {
        border: 'border-[#3b7bff]/45', text: 'text-[#3b7bff]', softText: 'text-[#3b7bff]/70', bgSoft: 'bg-[#3b7bff]/12',
        solid: 'bg-[#3b7bff]', solidText: 'text-white', barFill: 'bg-[#3b7bff]', barGradient: 'bg-gradient-to-l from-[#3b7bff] to-[#79a6ff]',
        dot: 'bg-[#3b7bff]', ringSoft: 'ring-[#3b7bff]/30', glow: 'shadow-[0_0_45px_-10px_rgba(59,123,255,0.55)]',
    },
    // 9 · שכבות - שרטרז
    layers: {
        border: 'border-[#d8ff33]/45', text: 'text-[#d8ff33]', softText: 'text-[#d8ff33]/70', bgSoft: 'bg-[#d8ff33]/12',
        solid: 'bg-[#d8ff33]', solidText: 'text-slate-950', barFill: 'bg-[#d8ff33]', barGradient: 'bg-gradient-to-l from-[#d8ff33] to-[#ecff77]',
        dot: 'bg-[#d8ff33]', ringSoft: 'ring-[#d8ff33]/30', glow: 'shadow-[0_0_45px_-10px_rgba(216,255,51,0.5)]',
    },
    // 10 · מצב פנימי - פוקסיה היפר
    state: {
        border: 'border-[#ff2dd4]/45', text: 'text-[#ff2dd4]', softText: 'text-[#ff2dd4]/70', bgSoft: 'bg-[#ff2dd4]/12',
        solid: 'bg-[#ff2dd4]', solidText: 'text-white', barFill: 'bg-[#ff2dd4]', barGradient: 'bg-gradient-to-l from-[#ff2dd4] to-[#ff74e4]',
        dot: 'bg-[#ff2dd4]', ringSoft: 'ring-[#ff2dd4]/30', glow: 'shadow-[0_0_45px_-10px_rgba(255,45,212,0.55)]',
    },
    // 11 · ציונים - אינפרנו כתום
    logits: {
        border: 'border-[#ff8a00]/45', text: 'text-[#ff8a00]', softText: 'text-[#ff8a00]/70', bgSoft: 'bg-[#ff8a00]/12',
        solid: 'bg-[#ff8a00]', solidText: 'text-slate-950', barFill: 'bg-[#ff8a00]', barGradient: 'bg-gradient-to-l from-[#ff8a00] to-[#ffb347]',
        dot: 'bg-[#ff8a00]', ringSoft: 'ring-[#ff8a00]/30', glow: 'shadow-[0_0_45px_-10px_rgba(255,138,0,0.5)]',
    },
    // 12 · Softmax - טורקיז ניאו
    softmax: {
        border: 'border-[#00f0c8]/45', text: 'text-[#00f0c8]', softText: 'text-[#00f0c8]/70', bgSoft: 'bg-[#00f0c8]/12',
        solid: 'bg-[#00f0c8]', solidText: 'text-slate-950', barFill: 'bg-[#00f0c8]', barGradient: 'bg-gradient-to-l from-[#00f0c8] to-[#57f7dc]',
        dot: 'bg-[#00f0c8]', ringSoft: 'ring-[#00f0c8]/30', glow: 'shadow-[0_0_45px_-10px_rgba(0,240,200,0.5)]',
    },
    // 13 · בחירה - אינדיגו חשמלי
    decoding: {
        border: 'border-[#6c4dff]/45', text: 'text-[#6c4dff]', softText: 'text-[#6c4dff]/70', bgSoft: 'bg-[#6c4dff]/12',
        solid: 'bg-[#6c4dff]', solidText: 'text-white', barFill: 'bg-[#6c4dff]', barGradient: 'bg-gradient-to-l from-[#6c4dff] to-[#9b86ff]',
        dot: 'bg-[#6c4dff]', ringSoft: 'ring-[#6c4dff]/30', glow: 'shadow-[0_0_45px_-10px_rgba(108,77,255,0.55)]',
    },
    // 14 · הלולאה - אודם ניאון
    loop: {
        border: 'border-[#ff2e63]/45', text: 'text-[#ff2e63]', softText: 'text-[#ff2e63]/70', bgSoft: 'bg-[#ff2e63]/12',
        solid: 'bg-[#ff2e63]', solidText: 'text-white', barFill: 'bg-[#ff2e63]', barGradient: 'bg-gradient-to-l from-[#ff2e63] to-[#ff6c92]',
        dot: 'bg-[#ff2e63]', ringSoft: 'ring-[#ff2e63]/30', glow: 'shadow-[0_0_45px_-10px_rgba(255,46,99,0.55)]',
    },
};

// שלשות ה-RGB של אותם 14 גוונים (בפורמט "r g b" של MentorAccent), כדי שהמנטור
// יוכל לצבוע את בועת-הדיבור בגוון התחנה שהוא מדבר עליה. נגזר מאותם צבעי הפלטה.
export const STATION_RGB: Record<string, string> = {
    request: '255 60 172',
    tokenize: '182 255 46',
    ids: '31 224 255',
    embedding: '255 176 32',
    position: '162 75 255',
    context: '34 255 176',
    attention: '255 90 60',
    mix: '59 123 255',
    layers: '216 255 51',
    state: '255 45 212',
    logits: '255 138 0',
    softmax: '0 240 200',
    decoding: '108 77 255',
    loop: '255 46 99',
};

interface VizProps {
    a: AccentStyle;
    reduce: boolean;
    // true כשהריצה הנוכחית היא חזרה אוטומטית של לולאת-התצוגה. סצנות משתיקות את
    // צלילי-הפתיחה שלהן במצב זה, כדי שהלולאה לא תהפוך למטרונום. צלילי מגע של
    // המשתמש תמיד מתנגנים (הם לא מותנים ב-silent).
    silent: boolean;
    viz: IntroViz;
    dir: Direction;
    // Focus Stage: הסצנה מרונדרת כמכשיר של תחנת-במה. כבוי כברירת מחדל; סצנה שלא
    // מגיבה ל-focus פשוט מרנדרת כרגיל, ולכן ההצטרפות היא תמיד מפורשת.
    focus?: boolean;
}

// Focus Stage: StationViz מספק כאן אלמנט-יעד, והכיתוב מרונדר אליו (portal) מתחת לפריסת
// הקריאה + המכשיר. undefined = ברירת המחדל (כיתוב במקומו). null = היעד עוד לא קיים.
const FocusCaptionSlot = React.createContext<HTMLElement | null | undefined>(undefined);

function Caption({ children }: { children: React.ReactNode }) {
    // שורת התובנה של הסצנה, עם הקראה נקודתית שלה. הטקסט תמיד מגיע כמחרוזת מהמילון
    // (כולל כיתובים דינמיים), אז ההקראה תמיד תואמת את מה שמוצג כרגע.
    const text = typeof children === 'string' ? children : undefined;
    const slot = React.useContext(FocusCaptionSlot);
    if (slot !== undefined) {
        // כיתוב אחד בלבד: עד שהיעד קיים לא מרונדר דבר, ואז הוא עובר לשם כמשפט הסיכום.
        return slot && createPortal(
            <div className="flex items-start gap-3">
                <p className="flex-1 text-[15px] font-medium leading-relaxed text-slate-100">{children}</p>
                {text && <SpeakButton text={text} className="shrink-0" />}
            </div>,
            slot,
        );
    }
    return (
        <div className="mt-3 flex items-start gap-2">
            <p className="flex-1 text-[13px] leading-relaxed text-slate-400">{children}</p>
            {text && <SpeakButton text={text} className="shrink-0" />}
        </div>
    );
}

// חץ זרימה תלוי-כיוון: בעברית וערבית הזרימה שמאלה, בשאר השפות ימינה.
function FlowArrow({ dir }: { dir: Direction }) {
    return dir === 'rtl'
        ? <ArrowLeft size={14} className="shrink-0 text-slate-600" aria-hidden />
        : <ArrowRight size={14} className="shrink-0 text-slate-600" aria-hidden />;
}

// טיימרים עם ניקוי אוטומטי: כמה סצנות מריצות רצף פתיחה קצוב, וכולן חייבות לבטל
// את הטיימרים כשהכרטיס נסגר או כשהסצנה מופעלת מחדש.
function useTimers() {
    const ids = useRef<number[]>([]);
    useEffect(() => () => { ids.current.forEach((id) => clearTimeout(id)); }, []);
    return (fn: () => void, ms: number) => { ids.current.push(window.setTimeout(fn, ms)); };
}

/* ── סאונד עדין (Web Audio API, ללא קבצי שמע וללא תלות חדשה) ──
   טונים סינתטיים קצרים ורכים שמלווים רגעי-מפתח בלבד: חיתוך, היפוך קלף, נעילת
   100%, הגרלה, טוקן שנפלט. אין צליל על אנימציה אינסופית ואין רקע מתמשך.
   מתג ההשתקה בכותרת הסצנה משותף לכל התחנות. ה-AudioContext נפתח במחוות
   המשתמש הראשונה (לחיצת פתיחת הכרטיס) כדי לעמוד במדיניות ה-autoplay. */
const PENTA = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]; // סולם פנטטוני חמים
let vizAudio: AudioContext | null = null;
let vizAudioArmed = false;

function armVizAudio() {
    if (vizAudioArmed || typeof window === 'undefined') return;
    vizAudioArmed = true;
    const unlock = () => {
        const AC = window.AudioContext
            ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AC && !vizAudio) vizAudio = new AC();
        if (vizAudio && vizAudio.state === 'suspended') void vizAudio.resume();
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
}

const sound = {
    enabled: true,
    play(freq: number, dur = 0.2, peak = 0.05, type: OscillatorType = 'sine') {
        const ctx = vizAudio;
        if (!this.enabled || !ctx || ctx.state !== 'running') return;
        const t0 = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 2400; // טימבר רך, לא צפצוף
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(lp); lp.connect(gain); gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        osc.start(t0);
        osc.stop(t0 + dur + 0.05);
    },
    /** טיק קצר בסולם הפנטטוני, לפי אינדקס עולה. */
    tick(i = 0) { this.play(PENTA[i % PENTA.length], 0.16, 0.045); },
    /** צליל סיום קטן ומתגמל: יסוד + קווינטה. */
    chime() { this.play(523.25, 0.35, 0.06); this.play(783.99, 0.4, 0.035); },
};

// רטט עדין במגע (haptics) בטלפונים שתומכים ב-Vibration API. שקט לגמרי היכן שלא
// נתמך (דסקטופ, iOS Safari). נגיעה פרימיום שמחזקת את תחושת ה"מגע" באינטראקציות.
export function haptic(ms = 8) {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(ms);
}

// כפתור פעולה קטן ואחיד לסצנות (מגע נוח גם בטלפון).
// focus (Focus Stage בלבד): מקטע ניטרלי בקבוצה, עם פס-בחירה דק בגוון התחנה במקום מילוי מלא.
// action (עם focus): הכפתור אינו מקטע בקבוצת בחירה אלא פעולה בפני עצמה (למשל "הגרילו"),
// ולכן הוא שומר על רוחב טבעי ומסגרת משלו במקום להימתח כמקטע.
function VizButton({ onClick, active, disabled, children, a, focus, action }: {
    onClick: () => void; active?: boolean; disabled?: boolean; children: React.ReactNode; a: AccentStyle; focus?: boolean; action?: boolean;
}) {
    const segment = focus && !action;
    return (
        <button
            type="button"
            onClick={() => { haptic(); onClick(); }}
            disabled={disabled}
            aria-pressed={active}
            className={segment
                ? `relative inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg px-3 py-1 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${active
                    ? 'bg-slate-700/70 text-white'
                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                    } ${disabled ? 'opacity-40' : ''}`
                : focus
                    ? `inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-600/70 bg-slate-800/60 px-3.5 py-1 text-sm font-bold text-slate-100 transition-colors hover:bg-slate-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${disabled ? 'opacity-40' : ''}`
                    : `inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3.5 py-1 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${active
                ? `${a.border} ${a.solid} ${a.solidText}`
                : `${a.border} bg-slate-950/50 ${a.text} hover:bg-white/[0.04]`
                } ${disabled ? 'opacity-40' : ''}`}
        >
            {children}
            {segment && active && <span className={`absolute inset-x-5 bottom-1 h-0.5 rounded-full opacity-70 ${a.solid}`} aria-hidden />}
        </button>
    );
}

/* ════════════ 1 · הבקשה נכנסת: מה שאתם רואים מול מה שהמודל מקבל ════════════ */

// רוחבי מקטעי הרצף (הוראות / היסטוריה / הבקשה), באחוזים. להמחשה בלבד.
const REQ_SEGMENTS = [42, 33, 25];

function RequestViz({ a, reduce, silent, viz, dir, focus }: VizProps) {
    const v = viz.request;
    const [view, setView] = useState<'you' | 'model'>(reduce ? 'model' : 'you');
    const touched = useRef(false);
    const after = useTimers();

    // רצף הפתיחה: קודם רואים את הבועה המוכרת, ואז נחשף מה שהמודל באמת מקבל.
    useEffect(() => {
        if (!reduce) after(() => { if (!touched.current) { if (!silent) sound.tick(1); setView('model'); } }, 1700);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pick = (next: 'you' | 'model') => { touched.current = true; sound.tick(1); setView(next); };

    // Focus Stage בלבד: מיקום משותף בתא אחד של grid, כדי ששתי התצוגות וה"ממדד" יחלקו גובה.
    const cell = focus ? 'col-start-1 row-start-1 ' : '';

    // תצוגת "מה שהמודל מקבל". מוגדרת פעם אחת כי ב-Focus Stage היא מרונדרת גם כממדד
    // שקוף (ראו למטה). ברירת המחדל מרנדרת בדיוק את אותו פלט כמו קודם.
    const modelView = (
        <motion.div
            key="model"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className={`${cell}flex flex-col gap-1.5`}
        >
            {/* השכבות הסמויות נערמות מעל ההודעה הגלויה. לכל שכבה צבע משלה,
                ואותם צבעים בדיוק חוזרים ברצועה למטה: הרצועה היא שלוש השכבות.
                ב-Focus Stage אלה שורות בתוך מכשיר אחד: בלי משטח ומסגרת לכל שורה, קו מפריד דק,
                והקטגוריה נשמרת בנקודה ובסימן-קצה דק ומעומעם. */}
            {([
                ['system', v.systemLabel, v.systemText, 'border-violet-500/40 bg-violet-900/20 text-violet-100', 'bg-violet-400'],
                ['history', v.historyLabel, v.historyText, 'border-amber-500/40 bg-amber-900/15 text-amber-100', 'bg-amber-400'],
                ['user', v.userLabel, v.userText, `${a.border} ${a.bgSoft} text-white`, ''],
            ] as const).map(([key, label, text, cls, dotCls], i) => (
                <motion.div
                    key={key}
                    initial={reduce ? false : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.22 }}
                    className={focus
                        ? `relative overflow-hidden border border-transparent py-2 pe-3 ps-4 text-slate-100 ${i > 0 ? 'border-t-slate-700/50' : ''}`
                        : `rounded-xl border px-3 py-2 ${cls}`}
                >
                    {focus && <span className={`absolute inset-y-2 start-0 w-0.5 rounded-full opacity-50 ${key === 'user' ? a.dot : dotCls}`} aria-hidden />}
                    <span className={focus
                        ? 'flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-slate-300'
                        : 'flex items-center gap-1.5 text-xs font-black uppercase tracking-wide opacity-80'}>
                        <span className={`h-1.5 w-1.5 rounded-full ${key === 'user' ? a.dot : dotCls}`} aria-hidden />
                        {label}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed">{text}</span>
                </motion.div>
            ))}

            {/* הפאנץ׳: שלוש השכבות נדחסות לרצועה אחת. החץ פועם מטה כדי
                לרמז על הזרימה, והרצועה "נתפסת" ב-snap עם סריקת-אור. */}
            <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={reduce ? { duration: 0 } : { duration: 0.3, delay: 0.8 }}
                className="mt-1.5"
            >
                <span className={`mb-1 flex items-center gap-1 text-sm font-bold ${focus ? 'text-slate-300' : a.text}`}>
                    <motion.span
                        aria-hidden
                        animate={reduce ? undefined : { y: [0, 3, 0] }}
                        transition={reduce ? undefined : { duration: 0.9, delay: 0.85, repeat: 2, ease: 'easeInOut' }}
                        className="inline-flex"
                    >
                        <CornerDownLeft size={13} aria-hidden />
                    </motion.span>
                    {v.stripLabel}
                </span>
                <div className={focus ? 'relative flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full' : 'relative flex h-3 w-full overflow-hidden rounded-full'} dir={dir}>
                    {REQ_SEGMENTS.map((w, i) => (
                        <motion.span
                            key={i}
                            initial={reduce ? false : { scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            style={{ width: `${w}%`, originX: dir === 'rtl' ? 1 : 0 }}
                            transition={reduce ? { duration: 0 } : { delay: 0.9 + i * 0.18, type: 'spring', stiffness: 300, damping: 16 }}
                            className={`${i === 0 ? 'bg-violet-500' : i === 1 ? 'bg-amber-500' : a.solid}${focus ? ' opacity-70' : ''}`}
                        />
                    ))}
                    {/* סריקת-אור חד-פעמית שעוברת על הרצועה כשהיא מתגבשת. דקורטיבית בלבד,
                        ולכן לא מוצגת ב-Focus Stage. */}
                    {!reduce && !focus && (
                        <motion.span
                            aria-hidden
                            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                            initial={{ left: '-33%', opacity: 0 }}
                            animate={{ left: ['-33%', '100%'], opacity: [0, 1, 0] }}
                            transition={{ duration: 0.6, delay: 1.5, ease: 'easeInOut' }}
                        />
                    )}
                </div>
            </motion.div>
        </motion.div>
    );

    return (
        <div dir={dir}>
            <div className={focus ? 'mb-3 flex gap-1 rounded-xl border border-slate-700/70 bg-slate-900/40 p-1' : 'mb-3 flex flex-wrap gap-1.5'}>
                <VizButton a={a} focus={focus} active={view === 'you'} onClick={() => pick('you')}>{v.youTab}</VizButton>
                <VizButton a={a} focus={focus} active={view === 'model'} onClick={() => pick('model')}>{v.modelTab}</VizButton>
            </div>

            <div className={focus ? 'grid' : 'min-h-[150px]'}>
                {/* Focus Stage: ממדד שקוף של תצוגת המודל באותו תא, כך שהגובה הסופי שמור מהרינדור
                    הראשון והחשיפה אחרי 1.7 שניות לא מגדילה את התחנה. לא נראה ולא נקרא. */}
                {focus && <div aria-hidden className="invisible col-start-1 row-start-1">{modelView}</div>}
                <AnimatePresence mode="wait" initial={false}>
                    {view === 'you' ? (
                        <motion.div
                            key="you"
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 0.3 }}
                            className={`${cell}${focus ? 'self-center ' : ''}flex justify-end pt-4`}
                        >
                            <div className="max-w-[85%]">
                                <span className={`mb-1 block text-end text-xs font-bold ${focus ? 'text-slate-300' : a.softText}`}>{v.userLabel}</span>
                                <motion.div
                                    initial={reduce ? false : { scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 22, delay: 0.15 }}
                                    className={focus
                                        ? 'rounded-2xl border border-slate-600/60 bg-slate-800 px-4 py-2.5 text-sm font-bold text-slate-50'
                                        : `rounded-2xl ${a.solid} ${a.solidText} px-4 py-2.5 text-sm font-bold`}
                                >
                                    {v.userText}
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : modelView}
                </AnimatePresence>
            </div>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ 2 · פירוק לטוקנים: קו חיתוך חי ושני משפטים ════════════ */

// צבעי קבוצות לחלקי-מילה במשפט "המילים הארוכות": חלקים של אותה מילה מקבלים
// אותו צבע, כך שרואים מיד אילו חתיכות היו פעם מילה אחת. מחלקות סטטיות בלבד.
const PIECE_STYLES = [
    { border: 'border-sky-500/40', text: 'text-sky-300' },
    { border: 'border-amber-500/40', text: 'text-amber-300' },
    { border: 'border-violet-500/40', text: 'text-violet-300' },
    { border: 'border-emerald-500/40', text: 'text-emerald-300' },
    { border: 'border-rose-500/40', text: 'text-rose-300' },
];

function TokenizeViz({ a, reduce, silent, viz, dir }: VizProps) {
    const v = viz.tokenize;
    const [variant, setVariant] = useState<'a' | 'b'>('a');
    const after = useTimers();
    const data = variant === 'a'
        ? { sentence: v.sentence, tokens: v.tokens, caption: v.caption }
        : { sentence: v.altSentence, tokens: v.altTokens, caption: v.altCaption };

    // צליל "חיתוך" קטן כשקו החיתוך מסיים לעבור על המשפט (לא בחזרה אוטומטית).
    useEffect(() => {
        if (!reduce && !silent) after(() => sound.play(880, 0.09, 0.045, 'triangle'), 460);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant]);

    return (
        <div dir={dir}>
            {/* key=variant: החלפת משפט מריצה את סצנת החיתוך מחדש */}
            <div key={variant}>
                <div className="relative mb-3 overflow-hidden rounded-lg border border-white/5 bg-slate-950/50 px-3 py-2 text-sm text-slate-300">
                    {data.sentence}
                    {/* קו החיתוך: לייזר זוהר שחולף על המשפט בכיוון הקריאה */}
                    {!reduce && (
                        <motion.span
                            aria-hidden
                            className={`absolute inset-y-0 w-0.5 ${a.solid}`}
                            style={{ boxShadow: `0 0 10px 2px rgb(255 255 255 / 0.5)` }}
                            initial={{ left: dir === 'rtl' ? '100%' : '0%', opacity: 1 }}
                            animate={{ left: dir === 'rtl' ? '0%' : '100%', opacity: [1, 1, 0] }}
                            transition={{ duration: 0.7, ease: 'easeInOut' }}
                        />
                    )}
                    {/* ניצוץ בכל תפר-חיתוך, פורץ כשהלייזר עובר בו */}
                    {!reduce && data.tokens.slice(1).map((_, i) => {
                        const f = (i + 1) / data.tokens.length;
                        return (
                            <motion.span
                                key={`seam-${i}`}
                                aria-hidden
                                className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white"
                                style={{ insetInlineStart: `${f * 100}%` }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [0, 1.8, 0], opacity: [0, 1, 0] }}
                                transition={{ duration: 0.32, delay: f * 0.6, ease: 'easeOut' }}
                            />
                        );
                    })}
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.tokens.map((tok, i) => {
                        // במשפט המילים הארוכות, חלקי אותה מילה צבועים באותו צבע.
                        const piece = variant === 'b'
                            ? PIECE_STYLES[v.altGroups[i] % PIECE_STYLES.length]
                            : { border: a.border, text: a.text };
                        // התנפצות: כל טוקן נופל כרסיס מהמשפט, עם overshoot וסיבוב קל,
                        // ונוחת אחרי שהלייזר חתך את התפר שלו. dropDelay מסונכרן עם הניצוץ.
                        const dropDelay = 0.5 + i * 0.11;
                        return (
                            <span key={`${tok}-${i}`} className="relative inline-flex">
                                {/* הבזק-נחיתה מאחורי הטוקן ברגע שהוא מתייצב */}
                                {!reduce && (
                                    <motion.span
                                        aria-hidden
                                        className={`pointer-events-none absolute inset-0 rounded-lg ${a.solid}`}
                                        initial={{ scale: 0.6, opacity: 0 }}
                                        animate={{ scale: [0.6, 1.5], opacity: [0.6, 0] }}
                                        transition={{ duration: 0.45, delay: dropDelay + 0.05, ease: 'easeOut' }}
                                    />
                                )}
                                <motion.span
                                    initial={reduce ? false : { opacity: 0, y: -14, scale: 0.6, rotate: i % 2 === 0 ? -8 : 8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                                    transition={reduce ? { duration: 0 } : { delay: dropDelay, type: 'spring', stiffness: 360, damping: 15 }}
                                    className={`relative inline-flex items-center gap-1.5 rounded-lg border ${piece.border} bg-slate-950/60 px-2.5 py-1.5`}
                                >
                                    <span className="font-mono text-[10px] text-slate-500" dir="ltr">{i + 1}</span>
                                    <span className={`text-sm font-bold ${piece.text}`}>{tok}</span>
                                </motion.span>
                            </span>
                        );
                    })}
                </div>
                <Caption>{data.caption}</Caption>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
                <VizButton a={a} active={variant === 'a'} onClick={() => { sound.tick(0); setVariant('a'); }}>{v.variantA}</VizButton>
                <VizButton a={a} active={variant === 'b'} onClick={() => { sound.tick(0); setVariant('b'); }}>{v.variantB}</VizButton>
            </div>
        </div>
    );
}

/* ════════════ 3 · מזהים: קלפים שמתהפכים ממילים למספרים ════════════ */

// מזהים להמחשה בלבד (כתובות במילון), לא מזהים אמיתיים של מודל.
const TOKEN_IDS = [7412, 209, 5306, 4812, 1573, 662, 3948, 88];

function IdsViz({ a, reduce, silent, viz, dir }: VizProps) {
    const v = viz.ids;
    const tokens = viz.tokenize.tokens;
    const [flipped, setFlipped] = useState<boolean[]>(() => tokens.map(() => reduce));
    const after = useTimers();

    // רצף הפתיחה: הקלפים מתהפכים אחד אחרי השני עד ששורת המילים הופכת לשורת מספרים.
    useEffect(() => {
        if (reduce) return;
        tokens.forEach((_, i) => {
            after(() => { if (!silent) sound.tick(i); setFlipped((f) => f.map((x, j) => (j === i ? true : x))); }, 650 + i * 240);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggle = (i: number) => { sound.tick(i); setFlipped((f) => f.map((x, j) => (j === i ? !x : x))); };

    return (
        <div dir={dir}>
            <div className="flex flex-wrap gap-2">
                {tokens.map((tok, i) => (
                    <button
                        key={`${tok}-${i}`}
                        type="button"
                        onClick={() => toggle(i)}
                        aria-pressed={flipped[i]}
                        className="[perspective:600px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-lg"
                    >
                        <motion.span
                            className="grid [transform-style:preserve-3d]"
                            animate={{ rotateY: flipped[i] ? 180 : 0 }}
                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 24 }}
                        >
                            <span className={`[grid-area:1/1] [backface-visibility:hidden] inline-flex items-center justify-center rounded-lg border ${a.border} bg-slate-950/60 px-2.5 py-1.5 text-sm font-bold ${a.text}`}>
                                {tok}
                            </span>
                            <span
                                dir="ltr"
                                className={`[grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)] inline-flex items-center justify-center rounded-lg border border-white/10 bg-slate-900 px-2.5 py-1.5 font-mono text-sm font-bold text-slate-200`}
                            >
                                {TOKEN_IDS[i % TOKEN_IDS.length]}
                            </span>
                        </motion.span>
                    </button>
                ))}
            </div>
            <p className={`mt-2.5 text-sm font-bold ${a.text}`}>{v.hint}</p>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ 4 · ייצוג מספרי: השרשרת + מפת משמעות זעירה ════════════ */

const EMB_VECTOR = ['0.12', '-0.44', '0.91', '0.07', '-0.28'];

// מפת המשמעות מציגה מילים, לא אובייקטים: התחנה מלמדת שטקסט הופך למספרים, והמודל
// לא רואה חתול, רק את המילה. הסדר מבני וקבוע בכל השפות: 0 חבילה, 1 משלוח,
// 2 חתול, 3 כלב. זוג 0+1 קרוב, זוג 2+3 קרוב, והזוגות רחוקים זה מזה.
// לכל מילה שני מספרים מהווקטור שלה (להמחשה): מילים קרובות = מספרים דומים.
// המספרים של "חבילה" הם שני הראשונים מהשרשרת שמעל (EMB_VECTOR), כדי שהלומד
// יפגוש את אותו וקטור פעמיים: פעם כרשימה ופעם כמיקום במרחב.
const MAP_POS = [
    { x: 22, y: 30 },
    { x: 38, y: 58 },
    { x: 68, y: 26 },
    { x: 84, y: 54 },
];
const MAP_VEC = [
    ['0.12', '-0.44'],
    ['0.15', '-0.41'],
    ['0.80', '0.62'],
    ['0.83', '0.65'],
];
const MAP_NEAREST = [1, 0, 3, 2];

// שני האשכולות בצבעים שונים: מילות המשלוח (0,1) מול החיות (2,3). הצבע מסמן
// שכונה במרחב המשמעות, וגם המספרים צבועים לפי האשכול. מחלקות סטטיות בלבד.
const CLUSTER_STYLE = [
    { border: 'border-blue-500/40', text: 'text-blue-300', ring: 'ring-blue-400/40' },
    { border: 'border-rose-500/40', text: 'text-rose-300', ring: 'ring-rose-400/40' },
];
const clusterOf = (i: number) => (i < 2 ? 0 : 1);

function EmbeddingViz({ a, reduce, viz, dir }: VizProps) {
    const [sel, setSel] = useState(0);
    const near = MAP_NEAREST[sel];

    return (
        <div dir={dir}>
            {/* השרשרת: טוקן, מזהה, וקטור */}
            <div className="flex flex-wrap items-center gap-2">
                <motion.span
                    initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: reduce ? 0 : 0.3 }}
                    className={`rounded-lg border ${a.border} bg-slate-950/60 px-2.5 py-1.5 text-sm font-bold ${a.text}`}
                >
                    {viz.embedding.token}
                </motion.span>
                <FlowArrow dir={dir} />
                <motion.span
                    initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : 0.25 }}
                    className="rounded-lg border border-white/10 bg-slate-950/60 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-300"
                    dir="ltr"
                >
                    ID 4812
                </motion.span>
                <FlowArrow dir={dir} />
                <div className="flex flex-wrap items-center gap-1" dir="ltr">
                    {EMB_VECTOR.map((val, i) => (
                        <motion.span
                            key={i}
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: reduce ? 0 : 0.25, delay: reduce ? 0 : 0.5 + i * 0.08 }}
                            className="rounded-md border border-white/10 bg-slate-950/60 px-1.5 py-1 font-mono text-[10px] text-slate-300"
                        >
                            {val}
                        </motion.span>
                    ))}
                    <span className="px-1 font-mono text-[10px] text-slate-600">...</span>
                </div>
            </div>
            {/* כיתוב השרשרת יושב מתחת לשרשרת (במקום wall אחד גדול למטה) */}
            <Caption>{viz.embedding.caption(viz.sharedNote)}</Caption>

            {/* מפת המשמעות: נכנסת אחרי השרשרת (חשיפה מדורגת, פחות עומס בבת אחת) */}
            <motion.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.7 }}
                className="relative mt-3 h-36 overflow-hidden rounded-xl border border-white/5 bg-slate-950/60 sm:h-44"
                dir="ltr"
            >
                {/* רשת קואורדינטות עדינה: הופכת את הכרטיס למרחב, כך שברור שהמיקום נושא משמעות */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.18]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, rgb(148 163 184 / 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgb(148 163 184 / 0.6) 1px, transparent 1px)',
                        backgroundSize: '26px 26px',
                    }}
                />
                <svg className={`pointer-events-none absolute inset-0 h-full w-full ${CLUSTER_STYLE[clusterOf(sel)].text}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                    <motion.line
                        key={`ln-${sel}`}
                        x1={MAP_POS[sel].x} y1={MAP_POS[sel].y}
                        x2={MAP_POS[near].x} y2={MAP_POS[near].y}
                        stroke="currentColor" strokeWidth={1.5} strokeDasharray="4 3" vectorEffect="non-scaling-stroke"
                        initial={reduce ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.9 }}
                    />
                </svg>
                {viz.embedding.mapWords.map((w, i) => {
                    const isSel = i === sel;
                    const isNear = i === near;
                    const c = CLUSTER_STYLE[clusterOf(i)];
                    return (
                        <motion.button
                            key={w}
                            type="button"
                            onClick={() => { sound.play(440, 0.15, 0.05); setSel(i); }}
                            aria-pressed={isSel}
                            initial={reduce ? false : { opacity: 0, y: -8, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={reduce ? { duration: 0 } : { delay: 0.3 + i * 0.15, type: 'spring', stiffness: 280, damping: 20 }}
                            style={{ left: `${MAP_POS[i].x}%`, top: `${MAP_POS[i].y}%` }}
                            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                        >
                            <span
                                className={`rounded-full border px-2.5 py-1 text-sm font-bold transition-all ${c.border} ${c.text} ${isSel
                                    ? `bg-slate-950/90 ring-2 ${c.ring}`
                                    : isNear
                                        ? 'bg-slate-950/80'
                                        : 'bg-slate-950/70 opacity-60'
                                    }`}
                            >
                                {w}
                            </span>
                            {/* שני מספרים מהווקטור: הראיה שקרבה במפה היא דמיון במספרים */}
                            <span className={`font-mono text-xs transition-opacity ${c.text} ${isSel || isNear ? '' : 'opacity-50'}`} dir="ltr">
                                {MAP_VEC[i][0]} · {MAP_VEC[i][1]}
                            </span>
                        </motion.button>
                    );
                })}
            </motion.div>
            <p className={`mt-2 text-sm font-bold ${a.text}`}>
                {viz.embedding.nearLabel}: {viz.embedding.mapWords[sel]} + {viz.embedding.mapWords[near]} · {viz.embedding.mapHint}
            </p>
            {/* כיתוב המפה בלבד (הערת השרשרת עברה למעלה, מתחת לשרשרת) */}
            <Caption>{viz.embedding.mapCaption}</Caption>
        </div>
    );
}

/* ════════════ 5 · מיקום וסדר: החלפה שהופכת את משמעות העסקה ════════════ */

// אינדקסים מבניים: אילו שתי מילים מתחלפות. המילים עצמן מהמילון.
const POS_SWAP: readonly [number, number] = [1, 3];

function PositionViz({ a, reduce, silent, viz, dir }: VizProps) {
    const v = viz.position;
    const [swapped, setSwapped] = useState(false);
    const touched = useRef(false);
    const after = useTimers();

    // רצף פתיחה: אחרי שהתגים נחתמים, המילים מתחלפות פעם אחת מול העיניים.
    useEffect(() => {
        if (!reduce) after(() => { if (!touched.current) { if (!silent) sound.tick(3); setSwapped(true); } }, 1800);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const order = v.tokens.map((_, i) => i);
    if (swapped) { order[POS_SWAP[0]] = POS_SWAP[1]; order[POS_SWAP[1]] = POS_SWAP[0]; }

    return (
        <div dir={dir}>
            {/* תגי המיקום קבועים במקומם; המילים הן שזזות ביניהם */}
            <div className="grid grid-cols-4 gap-1.5">
                {v.tokens.map((_, i) => (
                    <motion.span
                        key={`badge-${i}`}
                        initial={reduce ? false : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={reduce ? { duration: 0 } : { delay: 0.2 + i * 0.12, type: 'spring', stiffness: 340, damping: 18 }}
                        className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${a.solid} ${a.solidText}`}
                        dir="ltr"
                    >
                        {i + 1}
                    </motion.span>
                ))}
                {order.map((tokenIdx) => (
                    <motion.span
                        key={`tok-${tokenIdx}`}
                        layout
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 26 }}
                        // שתי המילים שמתחלפות צבועות כל אחת בצבע קבוע משלה, כדי שרואים
                        // אותן נוסעות בין התגים. מחלקות סטטיות בלבד.
                        className={`mt-1 flex min-h-[34px] items-center justify-center rounded-lg border px-1 py-1.5 text-center text-xs font-bold sm:text-sm ${tokenIdx === POS_SWAP[0]
                            ? 'border-amber-500/40 bg-slate-950/70 text-amber-300'
                            : tokenIdx === POS_SWAP[1]
                                ? 'border-emerald-500/40 bg-slate-950/70 text-emerald-300'
                                : 'border-white/10 bg-slate-950/50 text-slate-300'
                            }`}
                    >
                        {v.tokens[tokenIdx]}
                    </motion.span>
                ))}
            </div>

            {/* המשמעות מתהפכת יחד עם הסדר */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
                <VizButton a={a} onClick={() => { touched.current = true; sound.tick(3); setSwapped((s) => !s); }}>
                    <ArrowRightLeft size={12} aria-hidden />
                    {v.swapLabel}
                </VizButton>
                <div className="relative inline-flex">
                    {/* ניצוץ שפורץ ברגע שהמשמעות מתהפכת, כדי להדגיש שזה אותו טקסט בדיוק */}
                    {!reduce && (
                        <motion.span
                            key={`spark-${swapped}`}
                            aria-hidden
                            className={`pointer-events-none absolute inset-0 rounded-full ${swapped ? 'bg-amber-400' : 'bg-emerald-400'}`}
                            initial={{ scale: 0.7, opacity: 0.55 }}
                            animate={{ scale: 1.7, opacity: 0 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    )}
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={swapped ? 'b' : 'a'}
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 0.2 }}
                            className={`relative rounded-full border px-3 py-1 text-sm font-bold ${swapped
                                ? 'border-amber-500/40 bg-amber-900/15 text-amber-300'
                                : 'border-emerald-500/40 bg-emerald-900/15 text-emerald-300'
                                }`}
                        >
                            {swapped ? v.meaningB : v.meaningA}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ 6 · חלון הקשר: הודעות נכנסות, הישנות נשכחות ════════════ */

const CTX_WINDOW = 3;

function ContextViz({ a, reduce, silent, viz, dir }: VizProps) {
    const v = viz.context;
    const msgs = v.messages;
    const [count, setCount] = useState(CTX_WINDOW);
    const after = useTimers();

    // רצף פתיחה: הודעה אחת מגיעה לבד, כדי שיהיה ברור מה הכפתור עושה.
    useEffect(() => {
        if (!reduce) after(() => { if (!silent) sound.tick(2); setCount((c) => Math.min(c + 1, msgs.length)); }, 1500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const outside = msgs.slice(0, count - CTX_WINDOW);
    const inside = msgs.slice(count - CTX_WINDOW, count);
    const done = count >= msgs.length;

    return (
        <div dir={dir}>
            {/* הערימה שמחוץ לחלון: אפורה, דחוסה, לא קיימת עבור המודל */}
            <div className="mb-2 min-h-[22px]">
                {outside.length > 0 && (
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-500">{v.outLabel} · <span dir="ltr">{outside.length}</span></span>
                        {outside.map((m, i) => (
                            <motion.div
                                key={`m-${i}`}
                                layoutId={`ctx-${i}`}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
                                className="w-fit max-w-[80%] rounded-lg border border-white/5 bg-slate-950/40 px-2 py-0.5 text-xs text-slate-500 line-through decoration-slate-600"
                            >
                                {m}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* החלון עצמו: רק מה שבפנים קיים. מבזיק כשהודעה נדחפת החוצה (count עולה). */}
            <motion.div
                key={`win-${count}`}
                animate={reduce ? undefined : { boxShadow: ['0 0 0 0 rgba(255,255,255,0)', '0 0 22px 2px rgba(255,255,255,0.18)', '0 0 0 0 rgba(255,255,255,0)'] }}
                transition={reduce ? undefined : { duration: 0.6, ease: 'easeOut' }}
                className={`rounded-xl border-2 ${a.border} ${a.bgSoft} p-2.5 ring-1 ${a.ringSoft}`}
            >
                <span className={`mb-1.5 block text-xs font-black uppercase tracking-wide ${a.text}`}>
                    {v.windowLabel} · <span dir="ltr">{CTX_WINDOW}</span>
                </span>
                <div className="flex flex-col gap-1.5">
                    {inside.map((m, i) => {
                        const gi = count - CTX_WINDOW + i;
                        return (
                            <motion.div
                                key={`m-${gi}`}
                                layoutId={`ctx-${gi}`}
                                initial={reduce ? false : { opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
                                className={`w-fit max-w-[85%] rounded-lg border px-2.5 py-1 text-sm ${gi % 2 === 0
                                    ? `self-start ${a.border} bg-slate-950/60 text-slate-200`
                                    : 'self-end border-white/10 bg-slate-800/60 text-slate-300'
                                    }`}
                            >
                                {m}
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            <div className="mt-2.5">
                <VizButton a={a} disabled={done} onClick={() => { sound.tick(2); setCount((c) => Math.min(c + 1, msgs.length)); }}>
                    <Plus size={12} aria-hidden />
                    {v.addLabel}
                </VizButton>
            </div>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ 7 · קשב: לחיצה על מילה מציירת מחדש את הקשרים ════════════ */

// לכל מילה מוגדר מבנית למי היא הכי קשובה (חזק) ולמי פחות (חלש). אינדקסים לפי
// סדר הטוקנים הקבוע במילון: 0 שם עצם, 1 פועל, 2 מילת קישור, 3 כינוי גוף, 4 מצב.
const FOCUS_MAP: Record<number, { s: number; w: number }> = {
    0: { s: 1, w: 4 },
    1: { s: 0, w: 4 },
    2: { s: 4, w: 1 },
    3: { s: 0, w: 4 },
    4: { s: 3, w: 0 },
};
const ATTN_DEFAULT_FOCUS = 3;

type AttnArc = { d: string; tx: number; ty: number; lx: number; ly: number };

function AttentionViz({ a, reduce, viz, dir, focus: stage }: VizProps) {
    const v = viz.attention;
    const wrapRef = useRef<HTMLDivElement>(null);
    const tokRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [focus, setFocus] = useState(ATTN_DEFAULT_FOCUS);
    const [geo, setGeo] = useState<{ w: number; h: number; strong: AttnArc; weak: AttnArc } | null>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const compute = () => {
            const els = tokRefs.current;
            const map = FOCUS_MAP[focus];
            const f = els[focus], s = els[map.s], w = els[map.w];
            if (!f || !s || !w) return;
            const cb = wrap.getBoundingClientRect();
            const topOf = (el: HTMLElement) => {
                const r = el.getBoundingClientRect();
                return { x: r.left - cb.left + r.width / 2, y: r.top - cb.top };
            };
            const fp = topOf(f);
            const toArc = (p: { x: number; y: number }): AttnArc => {
                const cx = (fp.x + p.x) / 2;
                const cy = Math.min(fp.y, p.y) - 26;
                return { d: `M ${fp.x} ${fp.y} Q ${cx} ${cy} ${p.x} ${p.y}`, tx: p.x, ty: p.y, lx: cx, ly: (fp.y + 2 * cy + p.y) / 4 };
            };
            setGeo({ w: cb.width, h: cb.height, strong: toArc(topOf(s)), weak: toArc(topOf(w)) });
        };
        const raf = requestAnimationFrame(compute);
        const ro = new ResizeObserver(compute);
        ro.observe(wrap);
        return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    }, [focus]);

    return (
        <div dir={dir}>
            <div ref={wrapRef} className="relative pt-14">
                {geo && (
                    <svg
                        key={`arcs-${focus}`}
                        className={`pointer-events-none absolute left-0 top-0 ${a.text}`}
                        width={geo.w}
                        height={geo.h}
                        viewBox={`0 0 ${geo.w} ${geo.h}`}
                        aria-hidden
                    >
                        {/* קשר חלש */}
                        <motion.path
                            d={geo.weak.d} fill="none" stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" opacity={0.35}
                            initial={reduce ? false : { pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: 'easeInOut' }}
                        />
                        <circle cx={geo.weak.tx} cy={geo.weak.ty} r={2.5} fill="currentColor" opacity={0.4} />
                        {/* קשר חזק: הילה + קו + נקודת-נחיתה */}
                        <circle cx={geo.strong.tx} cy={geo.strong.ty} r={7} fill="currentColor" opacity={0.18} />
                        <motion.path
                            d={geo.strong.d} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"
                            initial={reduce ? false : { pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: 'easeInOut', delay: 0.15 }}
                        />
                        <circle cx={geo.strong.tx} cy={geo.strong.ty} r={3.5} fill="currentColor" />
                    </svg>
                )}

                {/* פולס שנע לאורך הקשר החזק: הקשב הוא זרימה, לא קו סטטי */}
                {geo && !reduce && (
                    <motion.span
                        key={`pulse-${focus}-${geo.w}`}
                        aria-hidden
                        className={`pointer-events-none absolute left-0 top-0 h-1.5 w-1.5 rounded-full ${a.solid}`}
                        style={{ offsetPath: `path("${geo.strong.d}")` }}
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ offsetDistance: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.5, delay: 0.9, repeat: Infinity, repeatDelay: 0.5, ease: 'easeInOut' }}
                    />
                )}

                {/* תוויות קצרות ליד הקווים */}
                {geo && (
                    <>
                        <span
                            className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-full border ${a.border} bg-slate-950/80 px-2 py-0.5 text-[11px] font-bold ${a.text}`}
                            style={{ left: geo.strong.lx, top: geo.strong.ly }}
                        >
                            {v.strongLabel}
                        </span>
                        <span
                            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-full border border-white/10 bg-slate-950/70 px-2 py-0.5 text-[11px] font-bold text-slate-400"
                            style={{ left: geo.weak.lx, top: geo.weak.ly }}
                        >
                            {v.weakLabel}
                        </span>
                    </>
                )}

                <div className="flex flex-wrap items-center gap-2">
                    {v.tokens.map((tok, i) => {
                        const map = FOCUS_MAP[focus];
                        const cls =
                            i === focus ? `${a.border} bg-slate-950/70 ${a.text} ring-1 ${a.ringSoft}`
                                : i === map.s ? `${a.border} bg-slate-950/60 ${a.text}`
                                    : i === map.w ? 'border-white/10 bg-slate-950/50 text-slate-300'
                                        : 'border-white/5 bg-slate-950/40 text-slate-500';
                        return (
                            <button
                                key={tok}
                                type="button"
                                onClick={() => { haptic(); sound.play(440, 0.15, 0.05); setFocus(i); }}
                                aria-pressed={i === focus}
                                className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-lg"
                            >
                                {/* אדווה שפורצת מהמילה שנגעו בה, כדי שהמגע ירגיש מוחשי */}
                                {!reduce && i === focus && (
                                    <motion.span
                                        key={`ripple-${focus}`}
                                        aria-hidden
                                        className={`pointer-events-none absolute inset-0 rounded-lg ${a.solid}`}
                                        initial={{ scale: 0.8, opacity: 0.5 }}
                                        animate={{ scale: 1.6, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                    />
                                )}
                                <span
                                    ref={(el) => { tokRefs.current[i] = el; }}
                                    className={`relative inline-block rounded-lg border px-2.5 py-1.5 text-sm font-bold transition-colors ${cls}`}
                                >
                                    {tok}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
            {/* שורת הסיפור: מה בדיוק המילה שבמוקד מחפשת, מתחלפת עם כל לחיצה.
                ב-Focus Stage כל חמשת המשפטים נערמים בתא אחד של grid, אחד גלוי והשאר
                ממדדים שקופים, כדי שמעבר בין מילים לא ישנה את גובה התחנה. */}
            <div className={stage ? 'mt-2.5 grid' : 'mt-2.5'}>
                {stage && v.stories.map((story, i) => (
                    <p key={`m-${i}`} aria-hidden className="invisible col-start-1 row-start-1 text-sm font-bold">{story}</p>
                ))}
                <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                        key={focus}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.2 }}
                        className={stage ? 'col-start-1 row-start-1 text-sm font-bold text-slate-100' : `text-sm font-bold ${a.text}`}
                    >
                        {v.stories[focus]}
                    </motion.p>
                </AnimatePresence>
            </div>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ 8 · ערבוב מידע: אותה מילה, הקשר אחר, משמעות אחרת ════════════ */

// שני ההקשרים בצבעים קבועים (מחלקות סטטיות בלבד, בשביל Tailwind JIT):
// הראשון תכלת, השני ענבר. הצבע מלווה את הזרימה ואת המשמעות שיוצאת.
const MIX_STYLE = {
    a: {
        chip: 'border-cyan-500/40 bg-cyan-900/15 text-cyan-200',
        dot: 'bg-cyan-400',
    },
    b: {
        chip: 'border-amber-500/40 bg-amber-900/15 text-amber-200',
        dot: 'bg-amber-400',
    },
} as const;

// Focus Stage: אותם שני צבעי-הקשר, אבל על משטח ניטרלי. הצבע נשאר הסימן שמקשר בין
// הטוקן שנכנס לטוקן שיוצא, ולא הופך את הכרטיס למשטח צבוע.
const MIX_STAGE_CHIP = {
    a: 'border-cyan-500/35 bg-slate-900/70 text-cyan-100',
    b: 'border-amber-500/35 bg-slate-900/70 text-amber-100',
} as const;

// בנק המומחים: 8 מומחים, ורק תת-קבוצה נדלקת לכל טוקן. זו החתימה של מודלי 2026
// (Mixture-of-Experts): ראוטר מפעיל מעט מומחים מתוך רבים, כך שהמודל עצום אך רק
// חלק קטן רץ לכל טוקן. הניתוב כאן קבוע להמחשה בלבד; אין התמחות-נושא אמיתית
// (בפועל הניתוב נלמד ואטום). הרעיון: ניתוב + דלילות.
const NUM_EXPERTS = 8;
const EXPERT_ROUTES: Record<'a' | 'b', number[]> = { a: [1, 4, 6], b: [0, 3] };

function MixViz({ a, reduce, silent, viz, dir, focus }: VizProps) {
    const v = viz.mix;
    const [tok, setTok] = useState<'a' | 'b'>('a');
    const touched = useRef(false);
    const after = useTimers();
    const active = EXPERT_ROUTES[tok];

    // ניתוב: טיק קטן בבחירה, וצליל עדין כשהטוקן המועשר נוחת. withSound=false
    // בניתוב האוטומטי של הפתיחה (כדי שהלולאה לא תשמיע), true במגע של המשתמש.
    const route = (k: 'a' | 'b', withSound: boolean) => {
        if (withSound) {
            sound.tick(k === 'a' ? 0 : 2);
            after(() => sound.play(659.25, 0.22, 0.04), 620);
        }
        setTok(k);
    };

    // רצף פתיחה: טוקן א' מנותב, ואז מעבר אוטומטי לטוקן ב' מראה שנדלקים מומחים
    // אחרים בלי שנדרש מגע. מכאן הלומד ממשיך להחליף בעצמו.
    useEffect(() => {
        if (!reduce) after(() => { if (!touched.current) route('b', !silent); }, 2600);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const s = MIX_STYLE[tok];
    const chip = focus ? MIX_STAGE_CHIP[tok] : s.chip;
    const token = tok === 'a' ? v.tokenA : v.tokenB;
    // ממדד שקוף לשורות שמתחלפות ב-AnimatePresence: בזמן ההחלפה אין ילד בתא, ובלי
    // הממדד הזירה הייתה מתכווצת ומזיזה את התחנה. משמש בטוקן הנכנס ובטוקן היוצא.
    const cell = focus ? 'col-start-1 row-start-1 ' : '';

    return (
        <div dir={dir}>
            {/* בחירת טוקן: שני טוקנים לדוגמה, כל אחד מנותב למומחים אחרים.
                ב-Focus Stage זו קבוצת-בחירה ניטרלית, וצבע ההקשר נשאר כנקודה קטנה. */}
            <div className={focus ? 'flex gap-1 rounded-xl border border-slate-700/70 bg-slate-900/40 p-1' : 'flex gap-2'}>
                {(['a', 'b'] as const).map((k) => {
                    const on = tok === k;
                    return (
                        <button
                            key={k}
                            type="button"
                            onClick={() => { haptic(); touched.current = true; route(k, true); }}
                            aria-pressed={on}
                            className={focus
                                ? `inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${on ? 'bg-slate-700/70 text-white' : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'}`
                                : `flex-1 rounded-xl border px-3 py-2 text-center text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${on ? MIX_STYLE[k].chip : 'border-white/10 bg-slate-950/50 text-slate-400 hover:bg-white/[0.03]'}`}
                        >
                            {focus && <span className={`h-1.5 w-1.5 rounded-full ${MIX_STYLE[k].dot} ${on ? '' : 'opacity-50'}`} aria-hidden />}
                            {k === 'a' ? v.tokenA : v.tokenB}
                        </button>
                    );
                })}
            </div>

            {/* הזירה: טוקן נכנס -> ראוטר -> בנק מומחים (רק כמה נדלקים) -> טוקן מועשר */}
            <div className="mt-3 flex flex-col items-center gap-2">
                {/* טוקן נכנס */}
                <div className={focus ? 'grid justify-items-center' : ''}>
                    {focus && <span aria-hidden className={`${cell}invisible rounded-full border px-3 py-1 text-sm font-bold`}>{v.tokenA}</span>}
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={`in-${tok}`}
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 0.22 }}
                            className={`${cell}rounded-full border px-3 py-1 text-sm font-bold ${chip}`}
                        >
                            {token}
                        </motion.span>
                    </AnimatePresence>
                </div>

                {/* מוליך זורם מהטוקן אל הראוטר */}
                <span aria-hidden className="relative h-3 w-0.5 overflow-hidden bg-white/15">
                    {!reduce && (
                        <motion.span
                            key={`wire-${tok}`}
                            className={`absolute inset-x-0 h-1.5 ${a.solid}`}
                            initial={{ top: '-50%', opacity: 0 }}
                            animate={{ top: '110%', opacity: [0, 1, 0] }}
                            transition={{ duration: 0.5, ease: 'easeIn' }}
                        />
                    )}
                </span>

                {/* ראוטר */}
                <div className={focus
                    ? 'flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 px-2.5 py-1'
                    : `flex items-center gap-1.5 rounded-lg border ${a.border} ${a.bgSoft} px-2.5 py-1`}>
                    <span className={`h-2 w-2 rounded-sm ${a.solid}`} aria-hidden />
                    <span className={focus ? 'text-xs font-bold text-slate-200' : `text-xs font-bold ${a.text}`}>{v.routerLabel}</span>
                </div>

                {/* בנק מומחים: 8, ורק active נדלקים בפעימה מדורגת */}
                <div className="mt-0.5 grid grid-cols-4 gap-1.5">
                    {Array.from({ length: NUM_EXPERTS }).map((_, i) => {
                        const on = active.includes(i);
                        return (
                            <motion.div
                                key={`${tok}-e${i}`}
                                initial={reduce ? false : { scale: on ? 0.8 : 1, opacity: on ? 0.5 : 0.35 }}
                                animate={on ? { scale: [0.8, 1.12, 1], opacity: 1 } : { scale: 1, opacity: 0.35 }}
                                transition={reduce ? { duration: 0 } : { duration: 0.4, delay: on ? 0.3 + active.indexOf(i) * 0.14 : 0, ease: 'easeOut' }}
                                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-[11px] font-black ${on ? `${a.border} ${a.bgSoft} ${a.text}${focus ? '' : ` ${a.glow}`}` : 'border-white/10 bg-slate-950/50 text-slate-600'}`}
                            >
                                <span dir="ltr">{i + 1}</span>
                            </motion.div>
                        );
                    })}
                </div>

                {/* כמה מומחים מתוך כמה רצים */}
                <span className={focus ? 'text-xs font-bold text-slate-300' : `text-xs font-bold ${a.text}`} dir="auto">{v.activeNote(active.length, NUM_EXPERTS)}</span>

                {/* טוקן מועשר יוצא */}
                <div className={focus ? 'grid justify-items-center' : ''}>
                    {focus && (
                        <span aria-hidden className={`${cell}invisible inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold`}>
                            <Plus size={12} aria-hidden />
                            <span>{v.tokenA} · {v.outLabel}</span>
                        </span>
                    )}
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={`out-${tok}`}
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={reduce ? { duration: 0 } : { delay: 0.6, type: 'spring', stiffness: 300, damping: 22 }}
                            className={`${cell}inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold ${chip}`}
                        >
                            <Plus size={12} aria-hidden />
                            <span>{token} · {v.outLabel}</span>
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>

            <p className={focus ? 'mt-2.5 text-sm font-bold text-slate-200' : `mt-2.5 text-sm font-bold ${a.text}`}>{v.hint}</p>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ 9 · שכבות עומק: אותו בלוק חוזר במגדל, וההבנה מתחדדת ════════════ */

// טשטוש המשפט לפי עומק העיבוד: רדוד מטושטש, עמוק חד. אינדקס לפי שלב (0..2).
const FLOOR_BLUR = [3, 1.5, 0];
const FLOOR_OPACITY = [0.55, 0.8, 1];
// מגדל של שכבות רבות (רמז ל"עשרות"). לכל שלב סמנטי העומק (0-מבוסס) שאליו מגיע
// הסמן: דקדוק רדוד, קישורים באמצע, משמעות עמוק.
const NUM_LAYERS = 10;
const PHASE_AT = [1, 5, 9];

function LayersViz({ a, reduce, silent, viz, dir }: VizProps) {
    const v = viz.layers;
    const [phase, setPhase] = useState(reduce ? v.floors.length - 1 : 0);
    const touched = useRef(false);
    const after = useTimers();
    // עומק השכבה שכל שלב סמנטי מגיע אליו: דקדוק מוקדם, משמעות עמוק.
    const depth = PHASE_AT[phase] ?? PHASE_AT[PHASE_AT.length - 1];

    // מעבר שלב: צליל עולה בסולם ככל שיורדים עמוק יותר. withSound=false בעלייה
    // האוטומטית של הפתיחה, true במגע של המשתמש.
    const goPhase = (i: number, withSound: boolean) => { if (withSound) sound.tick(i + 1); setPhase(i); };

    // רצף פתיחה: הסמן עולה לבד דרך השכבות, השלב מתקדם והמשפט מתחדד.
    useEffect(() => {
        if (reduce) return;
        after(() => { if (!touched.current) goPhase(1, !silent); }, 1300);
        after(() => { if (!touched.current) goPhase(2, !silent); }, 2600);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div dir={dir}>
            {/* המשפט: מטושטש בעומק רדוד, חד ככל שהעיבוד מעמיק */}
            <motion.div
                animate={{ filter: `blur(${FLOOR_BLUR[phase]}px)`, opacity: FLOOR_OPACITY[phase] }}
                transition={{ duration: reduce ? 0 : 0.45 }}
                className="mb-3 rounded-lg border border-white/5 bg-slate-950/50 px-3 py-2 text-center text-sm font-bold text-slate-100"
            >
                {v.sentence}
            </motion.div>

            <div className="flex gap-3">
                {/* מגדל העומק: אותו בלוק חוזר בשכבות רבות. הסמן ממלא עד העומק הנוכחי,
                    וה-"⋮" למעלה מרמז שיש עוד הרבה מעבר למה שמוצג. */}
                <div className="flex w-14 shrink-0 flex-col items-center">
                    <span aria-hidden className="mb-1 text-base font-black leading-none text-slate-600">⋮</span>
                    <div className="flex flex-col-reverse gap-1">
                        {Array.from({ length: NUM_LAYERS }).map((_, i) => {
                            const reached = i <= depth;
                            const cur = i === depth;
                            return (
                                <motion.span
                                    key={i}
                                    aria-hidden
                                    initial={false}
                                    animate={{ opacity: reached ? 1 : 0.2, scale: cur ? 1.14 : 1 }}
                                    transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : (reached ? i * 0.03 : 0) }}
                                    className={`h-2 w-9 rounded-sm ${reached ? a.solid : 'bg-slate-700/50'} ${cur ? a.glow : ''}`}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* שלושת השלבים הסמנטיים לאורך העומק: מהעמוק (משמעות) לרדוד (דקדוק) */}
                <div className="flex flex-1 flex-col gap-1.5">
                    {[...v.floors].map((_, ri) => v.floors.length - 1 - ri).map((i) => {
                        const active = i === phase;
                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => { haptic(); touched.current = true; goPhase(i, true); }}
                                aria-pressed={active}
                                className={`w-full rounded-xl border px-3 py-2 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${active ? `${a.border} ${a.bgSoft}` : 'border-white/5 bg-slate-950/40 hover:bg-white/[0.03]'}`}
                            >
                                <span className={`block text-sm font-bold ${active ? a.text : 'text-slate-400'}`}>
                                    {v.floors[i]}
                                </span>
                                <AnimatePresence initial={false}>
                                    {active && (
                                        <motion.span
                                            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                                            transition={{ duration: reduce ? 0 : 0.25 }}
                                            className="block overflow-hidden text-[13px] leading-relaxed text-slate-300"
                                        >
                                            {v.notes[i]}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* מה חוזר בכל שכבה (קשב + feed-forward), ורמז אינטראקציה */}
            <p className={`mt-2.5 text-center text-[13px] font-bold ${a.text}`} dir="auto">{v.blockLabel}</p>
            <p className="mt-1 text-center text-[13px] font-bold text-slate-400">{v.hint}</p>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ 10 · מצב פנימי: כל ההקשר נדחס לנקודה אחת ════════════ */

// מיקומי רוחות-הרפאים של המילים סביב הכדור (אחוזים בתוך הזירה).
const GHOST_POS = [
    { left: '10%', top: '16%' },
    { left: '74%', top: '10%' },
    { left: '6%', top: '62%' },
    { left: '72%', top: '66%' },
    { left: '42%', top: '4%' },
];

function StateViz({ a, reduce, silent, viz, dir }: VizProps) {
    const v = viz.state;
    const tokens = viz.attention.tokens;
    const [ghosts, setGhosts] = useState(reduce);
    const after = useTimers();

    // צליל דחיסה חם כשהכדור נולד: בס עדין + נגיעת פעמון (לא בחזרה אוטומטית).
    useEffect(() => {
        if (!reduce && !silent) after(() => { sound.play(130.81, 0.3, 0.06, 'triangle'); sound.play(523.25, 0.4, 0.04); }, 1600);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div dir={dir}>
            {/* הטוקנים מופיעים, ואז נדחסים אל הכדור */}
            {!reduce && (
                <motion.div
                    initial={{ opacity: 1, scale: 1, y: 0 }}
                    animate={{ opacity: 0, scale: 0.1, y: 46 }}
                    transition={{ duration: 0.8, delay: 1.1, ease: 'easeIn' }}
                    className="flex flex-wrap justify-center gap-1.5"
                    aria-hidden
                >
                    {tokens.map((tok, i) => (
                        <motion.span
                            key={tok}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.12, duration: 0.3 }}
                            className={`rounded-md border ${a.border} bg-slate-950/60 px-2 py-1 text-xs font-bold ${a.text}`}
                        >
                            {tok}
                        </motion.span>
                    ))}
                </motion.div>
            )}

            {/* הזירה: הכדור במרכז, רוחות המילים סביבו */}
            <div className="relative mx-auto h-36 w-full max-w-xs">
                {/* חלקיקים שמתכנסים מהשוליים אל מרכז הכדור: כל ההקשר נדחס לנקודה */}
                {!reduce && GHOST_POS.map((p, i) => (
                    <motion.span
                        key={`mote-${i}`}
                        aria-hidden
                        className={`pointer-events-none absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${a.solid}`}
                        initial={{ left: p.left, top: p.top, opacity: 0, scale: 1 }}
                        animate={{ left: '50%', top: '50%', opacity: [0, 1, 0], scale: 0.3 }}
                        transition={{ duration: 0.75, delay: 1.05 + i * 0.06, ease: 'easeIn' }}
                    />
                ))}
                <AnimatePresence>
                    {ghosts && tokens.slice(0, GHOST_POS.length).map((tok, i) => (
                        <motion.span
                            key={tok}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : i * 0.08 }}
                            style={GHOST_POS[i]}
                            className="absolute text-sm font-bold text-slate-400"
                        >
                            {tok}
                        </motion.span>
                    ))}
                </AnimatePresence>

                <motion.div
                    initial={reduce ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={reduce ? { duration: 0 } : { delay: 1.6, type: 'spring', stiffness: 220, damping: 16 }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                    <motion.div
                        animate={reduce ? undefined : { scale: [1, 1.07, 1] }}
                        transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 2.4 }}
                        className={`h-16 w-16 rounded-full ${a.barGradient} ${a.glow}`}
                        aria-hidden
                    />
                </motion.div>
                <span className={`absolute bottom-0 left-1/2 w-full -translate-x-1/2 text-center text-sm font-bold leading-tight ${a.text}`}>
                    {v.orbLabel}
                </span>
            </div>

            <div className="mt-2.5 flex justify-center">
                <VizButton a={a} active={ghosts} onClick={() => { sound.tick(4); setGhosts((g) => !g); }}>{v.insideBtn}</VizButton>
            </div>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ 11 · ציונים גולמיים: מרוץ מועמדים שמסתדר לפי מוביל ════════════ */

// ציונים גולמיים להמחשה בלבד, בסדר "לא ממוין" בכוונה כדי שהמיון יקרה מול העיניים.
const LOGIT_SCORES = [8.2, 6.1, 4.0, 5.5, 3.2, 4.8, 2.1, 3.9];
const LOGIT_MAX = 10;
// מדליות פודיום לשלושת המובילים (זהב, כסף, ארד). מחלקות סטטיות בלבד.
const LOGIT_MEDAL = ['bg-amber-400 text-slate-950', 'bg-slate-300 text-slate-950', 'bg-amber-700 text-white'];

function LogitsViz({ a, reduce, silent, viz, dir }: VizProps) {
    const v = viz.logits;
    const [sorted, setSorted] = useState(reduce);
    const after = useTimers();

    // רצף פתיחה: העמודות מתמלאות בערבוביה, ואז הרשימה מסתדרת לפי מוביל.
    useEffect(() => {
        if (!reduce) after(() => { if (!silent) sound.tick(4); setSorted(true); }, 1900);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const items = v.words.map((w, i) => ({ w, s: LOGIT_SCORES[i % LOGIT_SCORES.length] }));
    const list = sorted ? [...items].sort((x, y) => y.s - x.s) : items;
    const leader = sorted ? list[0].w : null;

    return (
        <div dir={dir}>
            <div className="mb-2.5 w-fit rounded-lg border border-white/5 bg-slate-950/50 px-3 py-1.5 text-sm text-slate-300">
                {v.prompt}
            </div>
            <div className="flex flex-col gap-1.5">
                {list.map(({ w, s }, i) => {
                    const isLeader = w === leader;
                    return (
                        <motion.div
                            key={w}
                            layout
                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
                            className={`flex items-center gap-2 rounded-md px-1.5 py-0.5 ${isLeader ? `ring-1 ${a.ringSoft} ${a.bgSoft}` : ''}`}
                        >
                            {/* מדליית פודיום לשלושת המובילים, מופיעה כשהרשימה מסתדרת */}
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center" dir="ltr">
                                {sorted && i < 3 && (
                                    <motion.span
                                        initial={reduce ? false : { scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={reduce ? { duration: 0 } : { delay: 0.1 + i * 0.08, type: 'spring', stiffness: 360, damping: 16 }}
                                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-black ${LOGIT_MEDAL[i]}`}
                                    >
                                        {i + 1}
                                    </motion.span>
                                )}
                            </span>
                            <span className={`w-16 shrink-0 truncate text-sm font-bold ${isLeader ? a.text : 'text-slate-300'}`}>{w}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800/70">
                                <motion.div
                                    className={`h-full rounded-full ${isLeader ? a.barGradient : 'bg-slate-500'}`}
                                    initial={reduce ? false : { width: 0 }}
                                    animate={{ width: `${(s / LOGIT_MAX) * 100}%` }}
                                    transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.15 + i * 0.08 }}
                                />
                            </div>
                            <span className="w-8 shrink-0 text-left font-mono text-xs text-slate-400" dir="ltr">{s}</span>
                        </motion.div>
                    );
                })}
            </div>
            <p className="mt-2 text-[13px] font-bold text-slate-400">{v.note}</p>
            <Caption>{v.caption(viz.sharedNote)}</Caption>
        </div>
    );
}

/* ════════════ 12 · Softmax: הציונים הופכים לאחוזים שננעלים על 100 ════════════ */

// ציון גולמי והסתברות מבניים (לא תלויי-שפה). התוויות (שמש/גשם/ענן) מהמילון.
const SCORE_DATA = [
    { raw: 8.2, prob: 72 },
    { raw: 6.1, prob: 19 },
    { raw: 4.0, prob: 6 },
];

function ScoresViz({ a, reduce, silent, viz, dir }: VizProps) {
    const maxRaw = 10; // קנה מידה קבוע לעמודות הציון הגולמי
    const [total, setTotal] = useState(reduce ? 100 : 0);

    // המונה מטפס אל 100 אחרי שעמודות ההסתברות מסיימות להתמלא.
    useEffect(() => {
        if (reduce) return;
        let iv: number | undefined;
        const to = window.setTimeout(() => {
            iv = window.setInterval(() => {
                setTotal((t) => {
                    if (t + 5 >= 100) { if (iv) window.clearInterval(iv); return 100; }
                    return t + 5;
                });
            }, 30);
        }, 1200);
        return () => { window.clearTimeout(to); if (iv) window.clearInterval(iv); };
    }, [reduce]);

    // צליל נעילה קטן כשהמונה מגיע ל-100% (לא בחזרה אוטומטית).
    useEffect(() => {
        if (total === 100 && !reduce && !silent) sound.chime();
    }, [total, reduce, silent]);

    return (
        <div className="flex flex-col gap-2.5">
            {/* כותרות שתי העמודות: ציון גולמי (אפור) מול סיכוי (צבעוני) */}
            <div className="flex items-center gap-2.5" dir={dir}>
                <span className="w-12 shrink-0" />
                <span className="flex-1 text-center text-xs font-bold text-slate-500">{viz.scores.rawHeader}</span>
                <span className="w-8 shrink-0" />
                <span className="w-3 shrink-0" />
                <span className={`flex-1 text-center text-xs font-bold ${a.text}`}>{viz.scores.probHeader}</span>
                <span className="w-10 shrink-0" />
            </div>
            {SCORE_DATA.map((row, i) => (
                <div key={i} className="flex items-center gap-2.5" dir={dir}>
                    <span className="w-12 shrink-0 truncate text-sm font-bold text-slate-300">{viz.scores.rowLabels[i]}</span>
                    {/* ציון גולמי */}
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800/70">
                        <motion.div
                            className="h-full rounded-full bg-slate-500"
                            initial={reduce ? false : { width: 0 }}
                            animate={{ width: `${(row.raw / maxRaw) * 100}%` }}
                            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.1 }}
                        />
                    </div>
                    <span className="w-8 shrink-0 text-left font-mono text-xs text-slate-400" dir="ltr">{row.raw}</span>
                    <CornerDownLeft size={12} className="shrink-0 text-slate-600" aria-hidden />
                    {/* הסתברות */}
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800/70">
                        <motion.div
                            className={`h-full rounded-full ${a.barGradient}`}
                            initial={reduce ? false : { width: 0 }}
                            animate={{ width: `${row.prob}%` }}
                            transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.5 + i * 0.1 }}
                        />
                    </div>
                    <span className={`w-10 shrink-0 text-left font-mono text-xs font-bold ${a.text}`} dir="ltr">{row.prob}%</span>
                </div>
            ))}

            {/* רגע הנעילה: ביחד תמיד 100% */}
            <div className="flex items-center justify-end gap-2" dir={dir}>
                <span className="text-sm font-bold text-slate-400">{viz.scores.totalLabel}</span>
                <motion.span
                    animate={total === 100 && !reduce ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-sm font-black ${total === 100 ? `${a.border} ${a.text} ${a.bgSoft}` : 'border-white/10 text-slate-400'}`}
                    dir="ltr"
                >
                    {total}%
                </motion.span>
            </div>
            <Caption>{viz.scores.caption(viz.sharedNote)}</Caption>
        </div>
    );
}

/* ════════════ 13 · בחירת הטוקן הבא: מצב בטוח מול מצב מפתיע ════════════ */

// ההסתברויות זהות לתחנת ה-Softmax (72/19/6), כדי שהסיפור יהיה רציף.
const DECODE_PROBS = [72, 19, 6];

function DecodingViz({ a, reduce, silent, viz, dir, focus }: VizProps) {
    const v = viz.decoding;
    const labels = viz.scores.rowLabels;
    const [mode, setMode] = useState<'sure' | 'surprise'>('sure');
    const [highlight, setHighlight] = useState<number | null>(null);
    const [chosen, setChosen] = useState<number | null>(null);
    const [tally, setTally] = useState<number[]>([0, 0, 0]);
    const [spinning, setSpinning] = useState(false);
    const after = useTimers();
    const rolls = tally.reduce((s, n) => s + n, 0);

    const pick = (m: 'sure' | 'surprise') => {
        if (m === 'sure') return 0;
        const r = Math.random() * 100;
        return r < DECODE_PROBS[0] ? 0 : r < DECODE_PROBS[0] + DECODE_PROBS[1] ? 1 : 2;
    };

    // withSound=false בהגרלה האוטומטית של הפתיחה, true בהגרלה שהמשתמש יזם.
    const roll = (m: 'sure' | 'surprise', withSound: boolean) => {
        if (spinning) return;
        const target = pick(m);
        if (reduce) {
            if (withSound) sound.tick(5);
            setChosen(target);
            setTally((t) => t.map((n, i) => (i === target ? n + 1 : n)));
            return;
        }
        setSpinning(true);
        setChosen(null);
        // אפקט הגרלה: הסימון רץ בין האפשרויות עם טיק קטן, מאט, ונעצר על הנבחרת.
        // הצעד האחרון מסומן idx = steps % 3, לכן בוחרים steps בין 7 ל-9 בהתאם.
        const steps = target === 0 ? 9 : target === 1 ? 7 : 8;
        let t = 0;
        for (let k = 0; k < steps; k++) {
            t += 70 + k * 26;
            const idx = (k + 1) % 3;
            after(() => { if (withSound) sound.play(329.63, 0.06, 0.03); setHighlight(idx); }, t);
        }
        after(() => {
            setHighlight(null);
            setChosen(target);
            setTally((prev) => prev.map((n, i) => (i === target ? n + 1 : n)));
            setSpinning(false);
            if (withSound) sound.chime();
        }, t + 240);
    };

    // רצף פתיחה: הגרלה אחת אוטומטית במצב הבטוח, כדי שהסצנה חיה מיד.
    useEffect(() => {
        if (!reduce) after(() => roll('sure', !silent), 900);
        else { setChosen(0); setTally([1, 0, 0]); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div dir={dir}>
            {/* המשפט הנבנה: הפרומפט + הטוקן שנבחר. ב-Focus Stage מקומו של הטוקן שמור
                מראש (ממדד שקוף באותו תא), כדי שההגרלה הראשונה והמעברים בין ההגרלות
                לא יגדילו ולא יכווצו את התחנה. */}
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
                <span className="rounded-lg border border-white/5 bg-slate-950/50 px-3 py-1.5 text-sm text-slate-300">{v.prompt}</span>
                <div className={focus ? 'grid' : ''}>
                    {focus && (
                        <span aria-hidden className="invisible col-start-1 row-start-1 rounded-lg border px-3 py-1.5 text-base font-black">
                            {labels[0]}
                        </span>
                    )}
                    <AnimatePresence mode="wait">
                        {chosen !== null && (
                            <motion.span
                                key={`${rolls}-${chosen}`}
                                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 18 }}
                                className={`${focus ? 'col-start-1 row-start-1 ' : ''}rounded-lg border ${a.border} ${a.bgSoft} px-3 py-1.5 text-base font-black ${a.text}`}
                            >
                                {labels[chosen]}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* שלוש האפשרויות עם ההסתברויות שלהן */}
            <div className="flex flex-col gap-1.5">
                {labels.map((w, i) => {
                    const isHl = highlight === i;
                    const isChosen = chosen === i && !spinning;
                    return (
                        <div
                            key={w}
                            className={`flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5 transition-all ${isChosen ? `${a.border} ${a.bgSoft} ring-1 ${a.ringSoft}` : isHl ? `${a.border} bg-slate-950/70` : 'border-white/5 bg-slate-950/40'
                                }`}
                        >
                            <span className={`w-16 shrink-0 truncate text-sm font-bold ${isChosen || isHl ? a.text : 'text-slate-300'}`}>{w}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800/70">
                                <motion.div
                                    className={`h-full rounded-full ${isChosen ? a.barGradient : 'bg-slate-500'}`}
                                    initial={reduce ? false : { width: 0 }}
                                    animate={{ width: `${DECODE_PROBS[i]}%` }}
                                    transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.1 }}
                                />
                            </div>
                            <span className="w-10 shrink-0 text-left font-mono text-xs text-slate-400" dir="ltr">{DECODE_PROBS[i]}%</span>
                        </div>
                    );
                })}
            </div>

            {/* מגע: מצב, הגרלה, ותוצאות מצטברות. ב-Focus Stage שני המצבים הם קבוצת-בחירה
                אחת וההגרלה היא פעולה נפרדת לידה, כי אלה שני תפקידים שונים. */}
            <div className={focus ? 'mt-3 flex flex-wrap items-center gap-2' : 'mt-3 flex flex-wrap items-center gap-1.5'}>
                <div className={focus ? 'flex min-w-0 grow basis-[220px] gap-1 rounded-xl border border-slate-700/70 bg-slate-900/40 p-1' : 'contents'}>
                    <VizButton a={a} focus={focus} active={mode === 'sure'} onClick={() => setMode('sure')}>{v.sure}</VizButton>
                    <VizButton a={a} focus={focus} active={mode === 'surprise'} onClick={() => setMode('surprise')}>{v.surprise}</VizButton>
                </div>
                <VizButton a={a} focus={focus} action disabled={spinning} onClick={() => roll(mode, true)}>
                    <Play size={12} aria-hidden />
                    {v.roll}
                </VizButton>
            </div>
            {/* שורת התוצאות המצטברות מופיעה רק מההגרלה השנייה. ב-Focus Stage מקומה שמור
                מראש, כדי שהופעתה לא תקפיץ את התחנה באמצע ההתנסות. */}
            {focus ? (
                <p className={`mt-2 text-[13px] font-bold text-slate-400 ${rolls > 1 ? '' : 'invisible'}`} aria-hidden={rolls > 1 ? undefined : true}>
                    {v.tally}: {labels.map((w, i) => `${w} ${tally[i]}`).join(' · ')}
                </p>
            ) : rolls > 1 && (
                <p className="mt-2 text-[13px] font-bold text-slate-400">
                    {v.tally}: {labels.map((w, i) => `${w} ${tally[i]}`).join(' · ')}
                </p>
            )}
            <Caption>{mode === 'sure' ? v.sureNote : v.surpriseNote}</Caption>
        </div>
    );
}

/* ════════════ 14 · הלולאה: כל סיבוב מנוע מוסיף טוקן אחד ════════════ */

function LoopViz({ a, reduce, silent, viz, dir }: VizProps) {
    const v = viz.loop;
    const [n, setN] = useState(reduce ? v.words.length : 0);
    const [playing, setPlaying] = useState(!reduce);
    const done = n >= v.words.length;

    // כל "סיבוב מנוע" פולט טוקן אחד עם טיק עולה בסולם (לא בחזרה אוטומטית).
    // השהיה מקפיאה את התשובה באמצע.
    useEffect(() => {
        if (!playing || done) return;
        const id = window.setTimeout(() => { if (!silent) sound.tick(n); setN((x) => x + 1); }, n === 0 ? 700 : 850);
        return () => window.clearTimeout(id);
    }, [playing, n, done, silent]);

    // צליל סיום קטן כשמגיעים לסימן העצירה (לא בחזרה אוטומטית).
    useEffect(() => {
        if (done && !reduce && !silent) sound.chime();
    }, [done, reduce, silent]);

    return (
        <div dir={dir}>
            <div className="mb-3 flex items-center gap-3">
                {/* טבעת המנוע: מסתובבת כשהלולאה רצה */}
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center" aria-hidden>
                    {done ? (
                        <span className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${a.border} ${a.text}`}>
                            <Square size={11} fill="currentColor" />
                        </span>
                    ) : (
                        <motion.span
                            className={`h-9 w-9 rounded-full border-2 border-t-transparent ${a.border} ${a.text}`}
                            animate={playing && !reduce ? { rotate: 360 } : { rotate: 0 }}
                            transition={playing && !reduce ? { repeat: Infinity, duration: 0.85, ease: 'linear' } : { duration: 0 }}
                        />
                    )}
                </span>
                <span className={`text-sm font-bold ${a.text}`}>
                    {v.tokenLabel} <span className="font-mono" dir="ltr">{n}/{v.words.length}</span>
                </span>
                {!reduce && !done && (
                    <VizButton a={a} onClick={() => setPlaying((p) => !p)}>
                        {playing ? <Pause size={12} aria-hidden /> : <Play size={12} aria-hidden />}
                        {playing ? v.pause : v.play}
                    </VizButton>
                )}
            </div>

            {/* התשובה הנבנית, טוקן אחרי טוקן */}
            <div className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border border-white/5 bg-slate-950/50 px-3 py-2">
                {v.words.slice(0, n).map((w, i) => (
                    <motion.span
                        key={i}
                        initial={reduce ? false : { opacity: 0, y: 6, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 20 }}
                        className={`rounded-md border ${a.border} bg-slate-950/60 px-2 py-0.5 text-sm font-bold ${a.text}`}
                    >
                        {w}
                    </motion.span>
                ))}
                {!done && !reduce && playing && (
                    <motion.span
                        aria-hidden
                        className={`h-4 w-0.5 ${a.solid}`}
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.9, repeat: Infinity }}
                    />
                )}
                {done && (
                    <motion.span
                        initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 18 }}
                        className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-slate-900 px-2 py-0.5 text-xs font-bold text-slate-400"
                    >
                        <Square size={9} fill="currentColor" aria-hidden />
                        {v.stopLabel}
                    </motion.span>
                )}
            </div>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ מפה ועוטף ════════════ */

const VIZ_MAP: Record<StationVizKind, React.FC<VizProps>> = {
    request: RequestViz,
    tokenize: TokenizeViz,
    ids: IdsViz,
    embedding: EmbeddingViz,
    position: PositionViz,
    context: ContextViz,
    attention: AttentionViz,
    mix: MixViz,
    layers: LayersViz,
    state: StateViz,
    logits: LogitsViz,
    scores: ScoresViz,
    decoding: DecodingViz,
    loop: LoopViz,
};

// משך רצף הפתיחה המשוער של כל סצנה (מילישניות). לולאת התצוגה ממתינה לסוף
// הרצף ועוד 3 שניות, ואז מריצה את הסצנה מחדש, כאילו נלחץ "הפעלה מחדש".
const VIZ_RUN_MS: Record<StationVizKind, number> = {
    request: 3600,
    tokenize: 1500,
    ids: 2000,
    embedding: 1700,
    position: 2800,
    context: 2100,
    attention: 1500,
    mix: 4000,
    layers: 3000,
    state: 2600,
    logits: 2600,
    scores: 2200,
    decoding: 2700,
    loop: 5200,
};
const LOOP_PAUSE_MS = 3000;

/**
 * מתג השתקה גלובלי יחיד לכל סצנות התחנות. מוצג פעם אחת מעל המפה (לא בכל
 * כרטיס), ומשתיק או מפעיל את הצלילים של כל 14 התחנות יחד.
 */
export const VizSoundToggle: React.FC = () => {
    const { t, dir } = useT();
    const viz = t.behindAi.introVisuals.viz;
    const [on, setOn] = useState(sound.enabled);
    useEffect(() => { armVizAudio(); }, []);
    return (
        <button
            type="button"
            dir={dir}
            onClick={() => { sound.enabled = !sound.enabled; setOn(sound.enabled); if (sound.enabled) sound.tick(2); }}
            aria-pressed={on}
            className="inline-flex min-h-[32px] items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-900/15 px-3.5 py-1.5 text-xs font-bold text-cyan-200 transition-colors hover:bg-cyan-900/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
            {on ? <Volume2 size={13} aria-hidden /> : <VolumeX size={13} aria-hidden />}
            {on ? viz.soundOff : viz.soundOn}
        </button>
    );
};

/**
 * focusStage: תחנת-במה (כבוי כברירת מחדל). המכשיר מקבל משטח שקוע ניטרלי, הסצנה שומרת
 * את הגובה הסופי שלה, והכיתוב מרונדר אל captionSlot של ההורה.
 */
export const StationViz: React.FC<{ kind: StationVizKind; a: AccentStyle; reduce: boolean; focusStage?: { captionSlot: HTMLElement | null } }> = ({ kind, a, reduce, focusStage }) => {
    const { t, dir } = useT();
    const viz = t.behindAi.introVisuals.viz;
    // key=runId: כל עלייה טוענת את הסצנה מחדש (ידנית או מלולאת התצוגה).
    const [runId, setRunId] = useState(0);
    // לולאת תצוגה: כל עוד הכרטיס פתוח ואף אחד לא נגע בסצנה, היא רצה שוב ושוב.
    // מגע בסצנה עוצר את הלולאה (הלומד השתלט); "הפעלה מחדש" מחזירה אותה.
    const [looping, setLooping] = useState(!reduce);
    // autoReplay=true רק בחזרות האוטומטיות של הלולאה. הפתיחה הראשונה וההפעלה-מחדש
    // הידנית משאירות false, כדי שהצליל יישמע בהן אך לא בכל סיבוב לולאה.
    const [autoReplay, setAutoReplay] = useState(false);
    useEffect(() => { armVizAudio(); }, []);

    useEffect(() => {
        if (!looping || reduce) return;
        const id = window.setTimeout(() => { setAutoReplay(true); setRunId((r) => r + 1); }, VIZ_RUN_MS[kind] + LOOP_PAUSE_MS);
        return () => window.clearTimeout(id);
    }, [looping, runId, reduce, kind]);

    const stopLoop = () => setLooping(false);
    const Cmp = VIZ_MAP[kind];
    return (
        <div className={focusStage ? 'rounded-2xl border border-slate-700/50 bg-slate-950/60 p-3.5 md:p-4' : 'mt-3 rounded-xl border border-white/5 bg-slate-950/40 p-3.5'} dir={dir}>
            <div className="mb-1.5 flex justify-end">
                <button
                    type="button"
                    onClick={() => { setAutoReplay(false); setLooping(!reduce); setRunId((r) => r + 1); }}
                    className="inline-flex min-h-[30px] items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/60 px-2.5 py-0.5 text-xs font-bold text-slate-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                >
                    <RotateCcw size={12} aria-hidden />
                    {viz.replay}
                </button>
            </div>
            <div key={runId} onPointerDownCapture={stopLoop} onKeyDownCapture={stopLoop}>
                <FocusCaptionSlot.Provider value={focusStage ? focusStage.captionSlot : undefined}>
                    <Cmp a={a} reduce={reduce} viz={viz} dir={dir} silent={autoReplay} focus={!!focusStage} />
                </FocusCaptionSlot.Provider>
            </div>
        </div>
    );
};
