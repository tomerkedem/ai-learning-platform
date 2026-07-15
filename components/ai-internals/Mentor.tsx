"use client";

// components/ai-internals/Mentor.tsx
// המנטור של הלומדה כרכיב יחיד וגנרי: ממפה פוזה סמנטית → קובץ נכס, מצרף בועת-דיבור
// אופציונלית, מנרמל גודל, ומכבד reduced-motion. אחריות יחידה: להציג את המנטור.
// אין כאן לוגיקת פרק — הפוזה והטקסט מגיעים מבחוץ, כך שאפשר להפוך אותו למלווה מגיב
// (למשל think→celebrate) פשוט על-ידי החלפת ה-pose לפי state של ההורה.

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type MentorPose =
    | 'hero'
    | 'think'
    | 'headsup'
    | 'celebrate'
    | 'hello'
    | 'ready'
    | 'reassure'
    | 'explain'
    | 'explain-opposite'
    | 'inputClarity'
    | 'token'
    | 'tokenRibbon'
    | 'happy'
    | 'roadmap'
    | 'inspect'
    | 'peek'
    | 'pointdown'
    | 'chart'
    | 'code'
    | 'type'
    | 'guessThinking'
    | 'correct'
    | 'plausiblePaths'
    | 'answerBuilder'
    | 'holographic'
    | 'holographicUi'
    | 'mapNavigator'
    | 'meaningSpace'
    | 'presenter';

const POSE_SRC: Record<MentorPose, string> = {
    hero: '/assets/mentor-hero.png',
    think: '/assets/mentor-think.png',
    headsup: '/assets/mentor-headsup.png',
    celebrate: '/assets/mentor-celebrate.png',
    hello: '/assets/mentor-hello.png',
    ready: '/assets/mentor-ready.png',
    reassure: '/assets/mentor-reassure.png',
    explain: '/assets/mentor-explain.png',
    'explain-opposite': '/assets/mentor-explain-opposite.png',
    // פוזת פרק 2 (הירו): המנטור מציג שדה קלט זוהר, בהירות ותשומת לב לניסוח.
    inputClarity: '/assets/mentor-input-clarity-alpha.png',
    token: '/assets/mentor-token.png',
    // פוזת מעבדת הטוקנים של פרק 3: המנטור מסדר רצועת אריחי טוקנים צפים.
    tokenRibbon: '/assets/mentor-token-ribbon-alpha.png',
    happy: '/assets/mentor-happy.png',
    roadmap: '/assets/mentor-roadmap.png',
    inspect: '/assets/mentor-inspect.png',
    peek: '/assets/mentor-peek.png',
    pointdown: '/assets/mentor-pointdown.png',
    chart: '/assets/mentor-chart.png',
    code: '/assets/mentor-code.png',
    type: '/assets/mentor-type.png',
    // פוזה גלובלית לשימוש חוזר: מנטור מהורהר שמזמין לעצור ולחשוב לפני שבוחרים.
    guessThinking: '/assets/mentor-thinking-refine-alpha.png',
    // פוזת הצלחה לשימוש חוזר (תשובה נכונה). כרגע ממופה לנכס החגיגה הקיים.
    correct: '/assets/mentor-celebrate.png',
    // פוזת הירו של פרק 4 (הלב ההסתברותי): המנטור מציג כמה המשכים אפשריים ובוחר את
    // הסביר ביותר. בשימוש בהירו של פרק 4 בלבד.
    plausiblePaths: '/assets/mentor-plausible-paths-alpha.png',
    // פוזת הירו של פרק 5 (איך AI בונה תשובה): המנטור בונה תשובה צעד אחר צעד מחלקים
    // והקשר. בשימוש בהירו של פרק 5 בלבד.
    answerBuilder: '/assets/mentor-answer-builder-alpha.png',
    // פוזת פרק 1 (המעבדה השקופה): המנטור חושף מנוע AI הולוגרפי בין השאלה לתשובה.
    // נכס landscape רחב, שונה מהפוזות הפורטרט. בשימוש בפרק 1 בלבד.
    holographic: '/assets/mentor_holographic.png',
    // פוזת הירו של פרק 5 (המרחב הסמנטי): המנטור מחזיק אשכולות מושגים הולוגרפיים
    // ומצביע על קבוצות מילים קרובות במשמעות. נכס שקוף. בשימוש בהירו של פרק 5 בלבד.
    holographicUi: '/assets/mentor-holographic-ui-transparent-alpha.png',
    // פוזת מבוא (מפת המנוע): המנטור מלווה את מפת התחנות מהטקסט עד התשובה ופותח אותה
    // ללומד. נכס שקוף (ללא מסכה לבנה). בשימוש במבוא בלבד.
    mapNavigator: '/assets/mentor_map_navigator.png',
    // פוזת הירו של פרק 4 (Embeddings): המנטור מציג מרחב משמעות תלת-ממדי שאליו נכנס
    // משפט והופך לנקודה זוהרת ליד נקודות קרובות ורחוקות. בשימוש בהירו של פרק 4 בלבד.
    meaningSpace: '/assets/mentor-embeddings-meaning-space.png',
    // פוזת מציג (presenter) של פרק 7: דמות גוף-מלא שמציגה את הרעיון לצד כרטיס הירו.
    // נכס ייעודי לפרק. בשימוש בהירו של פרק 7 בלבד.
    presenter: '/assets/mentor-presenter.png',
};

// נרמול גודל: פוזות "גוף מלא" (600px) מצולמות רחוק יותר מהבוסטים (~315px), ולכן הפנים
// יוצאות קטנות יותר באותו רוחב-מסגרת. מכפיל per-pose מקרב את גודל-הראש בין הפוזות,
// כדי שהחלפת פוזה באותו slot לא "תקפיץ" את המנטור. ערך 1 = ברירת מחדל.
const POSE_SCALE: Partial<Record<MentorPose, number>> = {
    hero: 1.12,
    ready: 1.12,
    explain: 1.12,
    'explain-opposite': 1.12,
    inputClarity: 1.12,
    token: 1.08,
    roadmap: 1.15,
    inspect: 1.12,
    pointdown: 1.12,
};

// צבע ההדגשה (הילה, בועת-דיבור, drop-shadow). ברירת המחדל מעתיקה במדויק את גווני
// הציאן המקוריים, כך שכל שימוש קיים (BTS-AI) נשאר זהה לחלוטין. לומדות אחרות יכולות
// להעביר accent משלהן (למשל אמרלד לפייתון). base/shadow הם שלשות RGB ("r g b").
export interface MentorAccent {
    /** גוון הבסיס להילה ולמסגרת הבועה (שלשת RGB, למשל "6 182 212"). */
    base: string;
    /** גוון ה-drop-shadow מתחת לדמות (שלשת RGB, למשל "34 211 238"). */
    shadow: string;
    /** צבע טקסט הבועה (כל ערך CSS תקין, למשל "#a5f3fc"). */
    text: string;
    /** רקע בועת-הדיבור (כל ערך CSS תקין). ברירת מחדל: slate-900/95. */
    bubbleBg?: string;
}

// רקע ברירת המחדל של הבועה (slate-900/95), נשמר כשאין accent מותאם.
const DEFAULT_BUBBLE_BG = 'rgb(15 23 42 / 0.95)';

const CYAN_ACCENT: MentorAccent = { base: '6 182 212', shadow: '34 211 238', text: '#a5f3fc' };

export const EMERALD_ACCENT: MentorAccent = { base: '16 185 129', shadow: '52 211 153', text: '#a7f3d0' };

export interface MentorProps {
    pose?: MentorPose;
    /** טקסט בועת-דיבור. ללא טקסט — אין בועה. */
    line?: string;
    /** אייקון קטן בתוך בועת-הדיבור, לצד הטקסט. נכשל בחן (מוסתר) אם הקובץ חסר. */
    lineIcon?: string;
    /** רוחב המסגרת בפיקסלים (הגובה אוטומטי). */
    width?: number;
    /** נכס גיבוי אם תמונת הפוזה חסרה/נכשלת בטעינה. נופל אליו בחן, פעם אחת. */
    fallbackSrc?: string;
    /** מראה הופכת אופקית (כיוון הצבעה הפוך / התאמת RTL). */
    flip?: boolean;
    /** ריחוף עדין. ברירת מחדל true (מכובה אוטומטית ב-reduced-motion). */
    float?: boolean;
    /** צד בועת-הדיבור ביחס לדמות. */
    bubbleSide?: 'top' | 'bottom';
    /** הזזה אופקית של הבועה (px) כשהראש אינו במרכז המסגרת (למשל פוזת presenter של גוף-מלא).
     *  חיובי = ימינה. ממורכז אוטומטית לפי flip, כך שהחץ נשאר מעל הראש בשני הכיוונים. ברירת מחדל 0. */
    bubbleShiftX?: number;
    /** הילת רקע רכה. ברירת מחדל true. */
    glow?: boolean;
    /** צבע ההדגשה. ברירת מחדל ציאן (תואם BTS-AI). */
    accent?: MentorAccent;
    /** מחלקת רוחב-מרבי לבועת-הדיבור. ברירת מחדל max-w-[12rem] (שומרת על המצב הקיים). */
    bubbleWidthClass?: string;
    /** מחלקת גודל-טקסט לבועת-הדיבור. ברירת מחדל text-[11px] (שומרת על המצב הקיים). */
    bubbleTextClass?: string;
    className?: string;
}

export const Mentor: React.FC<MentorProps> = ({
    pose = 'hero',
    line,
    lineIcon,
    width = 160,
    fallbackSrc,
    flip = false,
    float = true,
    bubbleSide = 'top',
    bubbleShiftX = 0,
    glow = true,
    accent = CYAN_ACCENT,
    bubbleWidthClass = 'max-w-[12rem]',
    bubbleTextClass = 'text-[11px]',
    className = '',
}) => {
    const reduce = useReducedMotion();
    const doFloat = float && !reduce;
    const scale = POSE_SCALE[pose] ?? 1;

    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 18 }}
            className={`relative ${className}`}
            style={{ width }}
        >
            {glow && (
                <div
                    className="pointer-events-none absolute inset-0 rounded-full blur-2xl"
                    style={{ backgroundColor: `rgb(${accent.base} / 0.15)` }}
                />
            )}

            {/* בועת-דיבור — מחוץ לעטיפת ה-flip כדי שהטקסט לא יתהפך */}
            {line && (
                <div
                    data-mentor-bubble
                    className={`absolute left-1/2 z-10 w-max ${bubbleWidthClass} -translate-x-1/2 ${
                        bubbleSide === 'top' ? '-top-2 -translate-y-full' : '-bottom-2 translate-y-full'
                    }`}
                    style={bubbleShiftX ? { left: `calc(50% + ${flip ? -bubbleShiftX : bubbleShiftX}px)` } : undefined}
                >
                    <div
                        className="relative rounded-2xl border px-3 py-2 text-center shadow-lg backdrop-blur-sm"
                        style={{
                            borderColor: `rgb(${accent.base} / 0.4)`,
                            backgroundColor: accent.bubbleBg ?? DEFAULT_BUBBLE_BG,
                            transition: 'background-color 0.45s ease, border-color 0.45s ease',
                        }}
                    >
                        <p className={`flex flex-col items-center justify-center gap-1 ${bubbleTextClass} font-bold leading-snug`} style={{ color: accent.text }}>
                            {lineIcon && (
                                // אייקון בולט מעל הטקסט (באדג'). next/image מיותר כאן.
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={lineIcon}
                                    alt=""
                                    aria-hidden
                                    className="h-8 w-8 shrink-0 object-contain drop-shadow-[0_0_6px_rgba(34,211,238,0.35)]"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    draggable={false}
                                />
                            )}
                            <span>{line}</span>
                        </p>
                        <span
                            className={`absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 ${
                                bubbleSide === 'top' ? '-bottom-1.5 border-b border-r' : '-top-1.5 border-l border-t'
                            }`}
                            style={{
                                borderColor: `rgb(${accent.base} / 0.4)`,
                                backgroundColor: accent.bubbleBg ?? DEFAULT_BUBBLE_BG,
                                transition: 'background-color 0.45s ease, border-color 0.45s ease',
                            }}
                        />
                    </div>
                </div>
            )}

            {/* עטיפת ה-flip סטטית (לא מונפשת) כדי לא להתנגש בטרנספורם של הריחוף */}
            <div className="relative" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
                <motion.img
                    src={POSE_SRC[pose]}
                    // alt="" - המנטור דקורטיבי: טקסט הבועה נקרא בנפרד, ואין מידע ייחודי בתמונה.
                    // גם מונע alt בעברית קשיחה במסלולים en/es/ru/ar/ja.
                    alt=""
                    animate={doFloat ? { y: [0, -10, 0] } : undefined}
                    transition={doFloat ? { repeat: Infinity, duration: 4, ease: 'easeInOut' } : undefined}
                    className="relative mx-auto block h-auto w-full object-contain"
                    style={{ scale, filter: `drop-shadow(0 15px 35px rgb(${accent.shadow} / 0.35))` }}
                    onError={fallbackSrc ? (e) => {
                        // נפילה חד-פעמית לנכס הגיבוי; הבדיקה ב-endsWith מונעת לולאת onError.
                        const img = e.currentTarget;
                        if (!img.src.endsWith(fallbackSrc)) img.src = fallbackSrc;
                    } : undefined}
                    draggable={false}
                />
            </div>
        </motion.div>
    );
};
