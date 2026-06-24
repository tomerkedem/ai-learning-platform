"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, MousePointerClick, Hand, FlaskConical, ArrowLeft, Workflow } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine } from '@/components/content/AssessmentEngine';
import { behindAiChapterQuizzes } from '../quizData';
import { InsightBox } from '@/components/content/InsightBox';

import { ControlLayerLab } from '@/components/ai-internals/ControlLayerLab';
import { Mentor } from '@/components/ai-internals/Mentor';

/** מיקום הפרק במסלול ה-Agent: הפעולה כבר על השולחן, שכבת הבקרה כאן. */
const AGENT_FLOW: { he: string; en: string; state: 'done' | 'active' }[] = [
    { he: 'הבנת המשימה', en: 'Understand task', state: 'done' },
    { he: 'בחירת כלי', en: 'Select tool', state: 'done' },
    { he: 'הפעלה ותוצאה', en: 'Call, observe', state: 'done' },
    { he: 'בקרה: לפעול או לעצור', en: 'Control: act or stop', state: 'active' },
];

const AgentFlowStrip: React.FC = () => {
    const reduce = useReducedMotion();
    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <Workflow size={16} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">מסלול ה-Agent</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Understand to Control</div>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2" dir="ltr">
                {AGENT_FLOW.map((s, i) => (
                    <React.Fragment key={s.en}>
                        {i > 0 && <ArrowLeft size={15} className="rotate-180 text-slate-600" />}
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.05 }}
                            className={`relative rounded-xl border px-3 py-1.5 text-center leading-tight ${
                                s.state === 'active' ? 'border-violet-500/50 bg-violet-900/25' : 'border-emerald-500/40 bg-emerald-900/15'
                            }`}
                        >
                            <span className={`text-[11px] font-bold ${s.state === 'active' ? 'text-violet-200' : 'text-emerald-200'}`}>{s.he}</span>
                            <span className="block text-[8px] uppercase tracking-wider text-slate-500" dir="ltr">{s.en}</span>
                        </motion.div>
                    </React.Fragment>
                ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
                כל מה שבנינו בחצי ה-Agent מתאחד כאן לשכבה אחת: בקרה. גם אם המשימה ברורה, הכלי מתאים, והתוצאה חזרה, עדיין צריך לשאול האם בטוח, האם מותר, והאם צריך אישור.
            </p>
        </div>
    );
};

export default function BehindTheScenesChapter12() {
    const reduce = useReducedMotion();

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={13}>

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
                <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-teal-500/10 blur-[90px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-violet-500/30 mb-5">
                        <ShieldCheck size={14} className="text-violet-400" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 13</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        Agent טוב יודע מתי לפעול,{' '}
                        <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-teal-400 bg-clip-text text-transparent">
                            ומתי לעצור
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        אותה יכולת, החלטה הפוכה. ה-Agent יודע להשתמש בכלי Email, יש לו גישה לפרטי לקוח, והוא יודע לנסח הודעה יפה, ובכל זאת
                        בוחר לא לשלוח, ומציע טיוטה לאישור. עצירה אינה כישלון, היא אחריות. ה-Agent מוגבל בכוונה, וזה מה שהופך אותו למקצועי.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                            <MousePointerClick size={14} className="text-violet-400" /> עברו בין סיכון נמוך, בינוני וגבוה
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Hand size={14} className="text-teal-400" /> ראו פעולה מסוכנת הופכת לטיוטה לאישור
                        </span>
                    </div>
                </div>
            </motion.section>
            {/* המנטור: מתי לפעול ומתי לעצור (xl+, מימין) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
              <Mentor pose="headsup" line="מתי לפעול, ומתי לעצור ✋" width={165} />
            </div>
            </div>

            {/* ══════════ מסלול קריאה ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="space-y-3 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 leading-relaxed text-slate-300">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-violet-300" />
                        <div className="leading-tight">
                            <div className="text-sm font-bold text-slate-200">מה נלמד בפרק הזה</div>
                            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Reading path</div>
                        </div>
                    </div>
                    <p>
                        בפרק הקודם ה-Agent קיבל Observation והחליט מה הצעד הבא. עכשיו יש נקודה חשובה יותר: לא כל צעד הבא צריך להתבצע אוטומטית.
                    </p>
                    <p>
                        גם אם המשימה ברורה, הכלי מתאים, והתוצאה חזרה, עדיין צריך לשאול שלוש שאלות: <span className="font-bold text-violet-200">האם בטוח</span> (סיכון), <span className="font-bold text-violet-200">האם מותר</span> (הרשאה), ו<span className="font-bold text-violet-200">האם צריך אישור אנושי</span>. אלה שלושת השערים שמרכיבים את שכבת הבקרה.
                    </p>
                    <p className="font-bold text-violet-200">
                        המסר: Agent טוב יודע מתי לפעול, ומתי לעצור. עצירה היא אפשרות חוקית ושווה, לא כישלון.
                    </p>
                </div>
            </section>

            {/* ══════════ מסלול ה-Agent ══════════ */}
            <section className="mt-8 text-right" dir="rtl">
                <AgentFlowStrip />
            </section>

            {/* ══════════ Control Layer Lab ══════════ */}
            <section className="relative mt-12 space-y-5 text-right" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Control Layer Lab</div>
                        <h3 className="text-2xl font-bold text-white">מעבדת שכבת הבקרה</h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    כל רכיב כאן מלווה בהקדמה, בשורת מסקנה, ובהנחיית Try this. עברו בין התרחישים, וראו איך אותה יכולת מובילה להחלטה שונה
                    לפי הסיכון, ההרשאה והאישור. שימו לב במיוחד איך &quot;Send&quot; מסוכנת הופכת ל-&quot;Create draft&quot; בטוחה. אף פעולה אמיתית לא
                    מתבצעת, הכל מודל לימודי שקוף, וכל החלטה מחושבת חי מהנוסחה הלוגית של שכבת הבקרה.
                </div>

                <ControlLayerLab />
                {/* המנטור: סיכון, הרשאה, אישור (xl+, משמאל) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="explain" line="סיכון, הרשאה, אישור" width={160} />
                </div>
            </section>

            {/* ══════════ סיכום ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                {/* המנטור: עצירה היא אחריות (xl+, מימין) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                  <Mentor pose="reassure" line="עצירה היא אחריות" width={160} />
                </div>
                <InsightBox type="intuition" title="הנקודה החשובה בפרק">
                    <span className="block font-bold text-violet-200">ככל שה-Agent קרוב יותר לפעולה אמיתית בעולם, כך הוא צריך יותר בקרה, הרשאה ואחריות.</span>
                    ראינו ש-Agent טוב לא רק יודע איך לפעול, הוא יודע מתי אסור לו לפעול לבד. סיכון נמוך זרם לתשובה, סיכון בינוני הפך
                    לטיוטה, וסיכון גבוה נעצר בשער האישור. ביטחון גבוה לא ביטל את הצורך באישור, סתירה הובילה לעצירה והצפת הסתירה, ועמימות
                    הובילה לשאלה מבהירה. עצירה לא הייתה כישלון לאורך כל הדרך, היא הייתה הצעד המקצועי.
                    <span className="mt-3 block text-sm text-slate-400">
                        כאן נסגר חצי ה-Agent מבחינה רעיונית. גשר לפרק 14: בפרק הבא נחבר את הכל, את צד ה-Chat ואת צד ה-Agent, על אותו מסך.
                    </span>
                </InsightBox>
            </section>


            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-16 mb-4" dir="rtl">
                <AssessmentEngine {...behindAiChapterQuizzes[13]} />
            </section>
        </ChapterLayout>
    );
}
