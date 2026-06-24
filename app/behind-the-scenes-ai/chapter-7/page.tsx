"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Hand, Target, Move3d, FlaskConical, MapPin, Navigation, Sigma, BookOpen,
    Map, ArrowLeft, Lock, MoveUpRight, Spline, Globe, Search, Sparkles, CopyCheck, Database,
} from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';
import { SemanticSpaceLab } from '@/components/ai-internals/SemanticSpaceLab';
import { Mentor } from '@/components/ai-internals/Mentor';

/* ════════════════════════════ מפת דרכים ════════════════════════════════ */
// אותה שרשרת כמו בפרקים השכנים. בפרק הזה הצומת הפעיל הוא Vectors:
// שלושת השלבים שלפניו כבר מאחורינו, ושלושת הבאים יפתחו בפרקים הקרובים.

type RoadmapState = 'done' | 'current' | 'next';

const ROADMAP_STEPS: { he: string; en: string; state: RoadmapState }[] = [
    { he: 'טקסט', en: 'Text', state: 'done' },
    { he: 'טוקנים', en: 'Tokens', state: 'done' },
    { he: 'מזהי טוקן', en: 'Token IDs', state: 'done' },
    { he: 'וקטורים', en: 'Vectors', state: 'current' },
    { he: 'דמיון', en: 'Similarity', state: 'next' },
    { he: 'ציונים', en: 'Scores', state: 'next' },
    { he: 'הסתברויות', en: 'Probabilities', state: 'next' },
];

/** מחזיר מחלקות Tailwind ליטרליות לפי מצב הצומת (חובה literal בשביל ה-JIT). */
function roadmapBoxClass(state: RoadmapState): string {
    if (state === 'current') return 'border-violet-400 bg-violet-500/25 ring-2 ring-violet-500/30';
    if (state === 'done') return 'border-slate-600/40 bg-slate-800/30';
    return 'border-slate-700/40 bg-slate-950/30';
}

function roadmapTextClass(state: RoadmapState): string {
    if (state === 'current') return 'text-violet-100';
    if (state === 'done') return 'text-slate-300';
    return 'text-slate-500';
}

const RoadmapStrip: React.FC = () => {
    const reduce = useReducedMotion();
    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <Map size={16} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">מפת הדרכים של המנוע</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">From Text to Probabilities</div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2" dir="ltr">
                {ROADMAP_STEPS.map((step, i) => (
                    <React.Fragment key={step.en}>
                        {i > 0 && <ArrowLeft size={15} className="rotate-180 text-slate-600" />}
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.05 }}
                            className={`relative rounded-xl border px-3 py-1.5 text-center leading-tight ${roadmapBoxClass(step.state)}`}
                        >
                            <span className={`flex items-center justify-center gap-1 text-[11px] font-bold ${roadmapTextClass(step.state)}`}>
                                {step.state === 'next' && <Lock size={9} />}
                                {step.he}
                            </span>
                            <span className="block text-[8px] uppercase tracking-wider text-slate-500" dir="ltr">{step.en}</span>
                        </motion.div>
                    </React.Fragment>
                ))}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-400">
                אנחנו עומדים בדיוק על הצומת של הווקטורים. את הטקסט, הטוקנים והמזהים כבר עברנו, ואת הדמיון, הציונים וההסתברויות נפתח
                בפרקים הקרובים. כאן נעצור ונבין מה וקטור באמת, מבחינה גיאומטרית, לפני שנמדוד איתו משהו.
            </p>
        </div>
    );
};

/* ════════════════════════════ גשר מהפרופיל לחץ ═══════════════════════════ */
// מחבר את פרק 6 לפרק 7: הפרופיל המספרי שראינו שם הוא בעצם קואורדינטות של נקודה.
// דוגמה קטנה: [0.9, 0.4] משמאל, ולצידה חץ מהראשית אל הנקודה (0.9, 0.4).

const BRIDGE_COORDS = [
    { axis: 'x', label: 'ממד ראשון', value: 0.9 },
    { axis: 'y', label: 'ממד שני', value: 0.4 },
];

/** ציור SVG קטן: צירים, נקודה (0.9, 0.4) וחץ מהראשית אליה. */
const BridgeArrow: React.FC = () => {
    const O = { x: 22, y: 92 };          // ראשית הצירים בתוך ה-SVG
    const unit = 78;                     // פיקסלים ליחידה אחת
    const px = O.x + 0.9 * unit;
    const py = O.y - 0.4 * unit;
    return (
        <svg viewBox="0 0 130 110" className="w-full max-w-[15rem]" role="img" aria-label="חץ מהראשית אל הנקודה 0.9, 0.4">
            <defs>
                <marker id="bridge-head" markerWidth="8" markerHeight="8" refX="5.5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#a78bfa" />
                </marker>
            </defs>
            {/* צירים */}
            <line x1={O.x} y1={O.y} x2={120} y2={O.y} stroke="#475569" strokeWidth="1" />
            <line x1={O.x} y1={O.y} x2={O.x} y2={12} stroke="#475569" strokeWidth="1" />
            {/* קווי עזר מקווקווים מהנקודה אל הצירים */}
            <line x1={px} y1={py} x2={px} y2={O.y} stroke="#7c3aed" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
            <line x1={px} y1={py} x2={O.x} y2={py} stroke="#7c3aed" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
            {/* החץ עצמו */}
            <line x1={O.x} y1={O.y} x2={px} y2={py} stroke="#a78bfa" strokeWidth="2.2" markerEnd="url(#bridge-head)" />
            {/* הנקודה */}
            <circle cx={px} cy={py} r="3.2" fill="#c4b5fd" />
            {/* תוויות מספרים (LTR) */}
            <text x={px - 1} y={O.y + 9} fill="#94a3b8" fontSize="7" textAnchor="middle">0.9</text>
            <text x={O.x - 5} y={py + 2.5} fill="#94a3b8" fontSize="7" textAnchor="end">0.4</text>
            <text x={O.x - 4} y={O.y + 9} fill="#64748b" fontSize="7" textAnchor="end">0</text>
        </svg>
    );
};

const VectorBridge: React.FC = () => {
    const reduce = useReducedMotion();
    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={reduce ? { duration: 0 } : { duration: 0.4 }}
            className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-6 text-right"
            dir="rtl"
        >
            <div className="mb-4 flex items-center gap-2">
                <MoveUpRight size={18} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">מהפרופיל לחץ</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">From profile to arrow</div>
                </div>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-slate-300">
                בפרק הקודם ראינו שכל משפט הופך לפרופיל מספרי, רשימה של מספרים. עכשיו נחשוף מה הרשימה הזו באמת: כל מספר ברשימה הוא
                קואורדינטה, ערך לאורך ציר אחד. ניקח דוגמה זעירה עם שני מספרים בלבד, כדי שאפשר יהיה לצייר אותה.
            </p>

            <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-2">
                {/* צד הרשימה המספרית */}
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-950/50 px-4 py-2 font-mono text-lg text-violet-200" dir="ltr">
                        [0.9, 0.4]
                    </div>
                    <ul className="space-y-2">
                        {BRIDGE_COORDS.map((c) => (
                            <li key={c.axis} className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="font-mono text-violet-300" dir="ltr">{c.value.toFixed(1)}</span>
                                <span>=</span>
                                <span>{c.label}</span>
                                <span className="text-slate-600" dir="ltr">({c.axis})</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* צד הציור */}
                <div className="flex justify-center sm:justify-start">
                    <BridgeArrow />
                </div>
            </div>

            <p className="mt-5 rounded-xl border border-violet-500/30 bg-violet-900/15 px-4 py-3 text-sm font-bold leading-relaxed text-violet-100">
                כל מספר הוא קואורדינטה, יחד הם נקודה, והחץ מהראשית הוא הווקטור.
            </p>
        </motion.div>
    );
};

/* ════════════════════════════ הסבר Cosine ════════════════════════════════ */
// שלושה ציורים זה לצד זה: שני חצים מהראשית בזווית הולכת וגדלה.
// הזווית הקטנה = אותו כיוון (cos גבוה), 90° = ניצבים (cos אפס), הרחבה = מנוגדים.

const COSINE_CASES = [
    { id: 'near', deg: 20, hex: '#34d399', he: 'אותו כיוון, קרוב', sub: 'cos ≈ 0.94' },
    { id: 'ortho', deg: 90, hex: '#94a3b8', he: 'ניצבים, לא קשורים', sub: 'cos = 0' },
    { id: 'opp', deg: 160, hex: '#fb7185', he: 'מנוגדים, רחוק', sub: 'cos ≈ -0.94' },
];

/** ציור של שני חצים מהראשית בזווית נתונה, עם קשת שמסמנת את הזווית. */
const AngleDiagram: React.FC<{ deg: number; hex: string; id: string }> = ({ deg, hex, id }) => {
    const O = { x: 65, y: 88 };
    const L = 60;
    const r = 18;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const a1 = toRad(90 - deg / 2);
    const a2 = toRad(90 + deg / 2);
    const p1 = { x: O.x + L * Math.cos(a1), y: O.y - L * Math.sin(a1) };
    const p2 = { x: O.x + L * Math.cos(a2), y: O.y - L * Math.sin(a2) };
    const arc1 = { x: O.x + r * Math.cos(a1), y: O.y - r * Math.sin(a1) };
    const arc2 = { x: O.x + r * Math.cos(a2), y: O.y - r * Math.sin(a2) };
    return (
        <svg viewBox="0 0 130 100" className="w-full" role="img" aria-label={`שני חצים בזווית של ${deg} מעלות`}>
            <defs>
                <marker id={`ah-${id}`} markerWidth="8" markerHeight="8" refX="5.5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill={hex} />
                </marker>
            </defs>
            {/* קשת הזווית */}
            <path d={`M ${arc1.x} ${arc1.y} A ${r} ${r} 0 0 0 ${arc2.x} ${arc2.y}`} fill="none" stroke={hex} strokeWidth="1" opacity="0.55" />
            <text x={O.x} y={O.y - r - 5} fill={hex} fontSize="9" textAnchor="middle">{deg}°</text>
            {/* שני החצים */}
            <line x1={O.x} y1={O.y} x2={p1.x} y2={p1.y} stroke={hex} strokeWidth="2.2" markerEnd={`url(#ah-${id})`} />
            <line x1={O.x} y1={O.y} x2={p2.x} y2={p2.y} stroke={hex} strokeWidth="2.2" markerEnd={`url(#ah-${id})`} />
            {/* נקודת הראשית */}
            <circle cx={O.x} cy={O.y} r="2.4" fill="#cbd5e1" />
        </svg>
    );
};

const CosineExplainer: React.FC = () => {
    const reduce = useReducedMotion();
    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={reduce ? { duration: 0 } : { duration: 0.4 }}
            className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-6 text-right"
            dir="rtl"
        >
            <div className="mb-4 flex items-center gap-2">
                <Spline size={18} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">איך מודדים קרבת כיוון</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Cosine Similarity</div>
                </div>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-slate-300">
                אם הכיוון הוא מה שקובע קרבה, צריך דרך למדוד כמה שני חצים מצביעים לאותו כיוון. המדד הזה נקרא Cosine Similarity (דמיון
                קוסינוס), והוא מסתכל רק על הזווית בין החצים, לא על האורך שלהם. ככל שהזווית קטנה יותר, הקרבה גדולה יותר.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {COSINE_CASES.map((c) => (
                    <div key={c.id} className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                        <AngleDiagram deg={c.deg} hex={c.hex} id={c.id} />
                        <div className="mt-2 text-center">
                            <div className="text-xs font-bold text-slate-200">{c.he}</div>
                            <div className="font-mono text-[11px] text-slate-400" dir="ltr">{c.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-5 rounded-xl border border-violet-500/30 bg-violet-900/15 px-4 py-3 text-sm font-bold leading-relaxed text-violet-100">
                <span dir="ltr">Cosine Similarity</span> הוא פשוט מדד לזווית: <span dir="ltr">0° ← 1</span>, <span dir="ltr">90° ← 0</span>, <span dir="ltr">180° ← מינוס 1</span>.
            </p>
        </motion.div>
    );
};

/* ════════════════════════════ שימושים בעולם האמיתי ═══════════════════════ */
// ארבעה שימושים אמיתיים של קרבת כיוון בין וקטורים, שורה אחת לכל אחד.

const REAL_WORLD_USES = [
    { icon: Search, he: 'חיפוש סמנטי', en: 'Semantic Search', desc: 'מוצא תוצאות לפי המשמעות שחיפשתם, גם כשהמילים המדויקות שונות לגמרי.' },
    { icon: Sparkles, he: 'מערכות המלצה', en: 'Recommendations', desc: 'מקרב פריטים שמצביעים לאותו כיוון, וממליץ על מה שדומה למה שכבר אהבתם.' },
    { icon: CopyCheck, he: 'זיהוי דמיון וכפילויות', en: 'Deduplication', desc: 'מזהה ששני טקסטים אומרים אותו דבר, גם כשהניסוח שונה לחלוטין.' },
    { icon: Database, he: 'אחזור ל-RAG', en: 'RAG Retrieval', desc: 'RAG (אחזור והעשרה): שולף מתוך מאגר ידע את הקטעים הקרובים בכיוון לשאלה, ומזין אותם למודל.' },
];

const RealWorldUses: React.FC = () => {
    const reduce = useReducedMotion();
    return (
        <section className="space-y-4 text-right" dir="rtl">
            <div className="flex items-center gap-2">
                <Globe size={18} className="text-violet-300" />
                <div className="leading-tight">
                    <h3 className="text-lg font-bold text-slate-200">איפה זה עובד בשבילכם</h3>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Where vectors work for you</div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {REAL_WORLD_USES.map((u, i) => {
                    const Icon = u.icon;
                    return (
                        <motion.div
                            key={u.en}
                            initial={reduce ? false : { opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.06 }}
                            className="flex items-start gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4"
                        >
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                                <Icon size={16} />
                            </span>
                            <div className="leading-tight">
                                <div className="text-sm font-bold text-slate-200">{u.he}</div>
                                <div className="mb-1 text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{u.en}</div>
                                <p className="text-xs leading-relaxed text-slate-400">{u.desc}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

/** שלוש אבני היסוד של הפרק, מסומנות לפני שנכנסים למעבדה. */
const CONCEPTS = [
    {
        icon: MapPin,
        he: 'מילה היא נקודה',
        en: 'A word is a point',
        desc: 'כל מילה יושבת במקום קבוע במרחב המשמעות. מילים בעלות משמעות דומה שוכנות באותו אזור.',
    },
    {
        icon: Navigation,
        he: 'כיוון לפני מרחק',
        en: 'Direction before distance',
        desc: 'מה שקובע קרבה במשמעות הוא הכיוון שאליו המילה מצביעה מהראשית, לא כמה היא רחוקה.',
    },
    {
        icon: Sigma,
        he: 'יחסים הם חשבון',
        en: 'Relations are arithmetic',
        desc: 'כשמשמעות הופכת לכיוון, יחסים בין מילים הופכים לחיבור וחיסור של חצים. מלך פחות גבר ועוד אישה מוביל אל מלכה.',
    },
];

const ConceptCards: React.FC = () => {
    const reduce = useReducedMotion();
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {CONCEPTS.map((c, i) => {
                const Icon = c.icon;
                return (
                    <motion.div
                        key={c.en}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.07 }}
                        className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4 text-right"
                        dir="rtl"
                    >
                        <div className="mb-2 flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                                <Icon size={16} />
                            </span>
                            <div className="leading-tight">
                                <div className="text-sm font-bold text-slate-200">{c.he}</div>
                                <div className="text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{c.en}</div>
                            </div>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-400">{c.desc}</p>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default function BehindTheScenesChapter7() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={7}>

            {/* ══════════ HERO ══════════ */}
            {/* עטיפת relative בלי overflow כדי שהמנטור יוכל לחרוג מגבול הכרטיס */}
            <div className="relative">
            <motion.section
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 text-right"
                dir="rtl"
            >
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-fuchsia-500/10 blur-[90px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-violet-500/30 mb-5">
                        <Move3d size={14} className="text-violet-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 07</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        משמעות יש לה{' '}
                        <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                            כיוון במרחב
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        בפרק הקודם ראינו שכל משפט הופך לווקטור משמעות, רצף מספרים. אבל מהו וקטור באמת? הוא נקודה וחץ במרחב. בפרק הזה
                        ניכנס למרחב הזה ונראה אותו בעיניים: מילים קרובות במשמעות שוכנות באותו אזור, הכיוון חשוב יותר מהמרחק, ואפשר
                        אפילו לחבר ולחסר משמעויות. עדיין לא נחשב כאן אחוזים, רק נבנה את האינטואיציה הגיאומטרית.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <Hand size={14} className="text-violet-400" /> גררו מילה במרחב וראו את הקרבה משתנה חי
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Target size={14} className="text-cyan-400" /> נחשו לאן נוחתת האנלוגיה, ובדקו כמה דייקתם
                        </span>
                    </div>
                </div>
            </motion.section>
            {/* המנטור על כיוון במרחב (xl+, מימין) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
              <Mentor pose="explain" line="למשמעות יש כיוון 🧭" width={165} />
            </div>
            </div>

            {/* ══════════ מפת דרכים ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <RoadmapStrip />
            </section>

            {/* ══════════ אבני יסוד ══════════ */}
            <section className="mt-12 space-y-4 text-right" dir="rtl">
                <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-violet-300" />
                    <h3 className="text-lg font-bold text-slate-200">שלושה רעיונות לפני שנכנסים למרחב</h3>
                </div>
                <ConceptCards />
            </section>

            {/* ══════════ גשר מהפרופיל לחץ ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <VectorBridge />
            </section>

            {/* ══════════ Semantic Space Lab ══════════ */}
            <section className="relative mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Semantic Space Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת מרחב המשמעות</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    כאן לא רק צופים, פועלים. בניסוי הראשון גררו מילה במרחב וצפו בדירוג הקרבה מתעדכן בזמן אמת. הסוד יתגלה כשתגררו
                    מילה לאורך אותו קו כיוון: הקרבה כמעט לא משתנה, גם כשהמרחק מהראשית משתנה. בניסוי השני נחשו בעצמכם לאן נוחתת
                    &quot;מלך פחות גבר ועוד אישה&quot;, גררו את הסמן, ובדקו כמה דייקתם.
                </div>

                <SemanticSpaceLab />
                {/* המנטור מזמין לנחש לאן נוחתת האנלוגיה (xl+, משמאל) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="think" line="גררו מילה - הקרבה משתנה" width={160} />
                </div>
            </section>

            {/* ══════════ הסבר Cosine ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <CosineExplainer />
            </section>

            {/* ══════════ שימושים בעולם האמיתי ══════════ */}
            <section className="mt-12">
                <RealWorldUses />
            </section>

            {/* ══════════ סיכום + גשר לפרק 8 ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                {/* המנטור מסכם: כיוון לפני מרחק (xl+, מימין) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="happy" line="כיוון, לא מרחק 🧭" width={160} />
                </div>
                <InsightBox type="intuition" title="הנקודה החשובה בפרק">
                    <span className="block font-bold text-violet-200">משמעות אינה מספר בודד, היא כיוון במרחב. קרבה במשמעות היא קרבה בכיוון, לא במרחק.</span>
                    ראינו שמילים בעלות משמעות דומה מצביעות לאותו כיוון, ולכן &quot;אריה&quot; ו&quot;חתול&quot; נשארים קרובים גם כשאחד מהם רחוק
                    יותר מהראשית. ראינו ש&quot;קרבת כיוון&quot;, שנקראת Cosine Similarity, היא הדרך הטבעית למדוד את זה. ואפילו ראינו שיחסים
                    בין מילים הם חשבון של חצים: מלך פחות גבר ועוד אישה נוחת על מלכה.
                    <span className="mt-3 block text-sm text-slate-400">
                        גשר לפרק הבא: כאן ראינו את הקרבה בעיניים, כצורה ומיקום. בפרק הבא ניקח את אותה קרבת כיוון ונהפוך אותה למספרים:
                        איך מחשבים דמיון, איך הוא הופך לציונים, ואיך הציונים הופכים להסתברויות ולהחלטה.
                    </span>
                </InsightBox>
            </section>

        </ChapterLayout>
    );
}
