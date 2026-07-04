"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link2, MousePointerClick, FlaskConical, Lightbulb, ScanSearch, Lock, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { ChapterQuiz } from '../ChapterQuiz';
import { InsightBox } from '@/components/content/InsightBox';

import { AttentionGuess } from '@/components/ai-internals/AttentionGuess';
import { AttentionSentenceLab } from '@/components/ai-internals/AttentionSentenceLab';
import { Mentor } from '@/components/ai-internals/Mentor';
import { SpeakButton } from '@/components/ai-internals/SpeakButton';
import { FloatingReadAloud } from '@/components/ai-internals/FloatingReadAloud';
import { ReadAloudControls, type ReadAloudMode } from '@/components/ai-internals/ReadAloudControls';
import type { ReadAloudSegment } from '@/components/ai-internals/useReadAloud';
import { LOCALE_SPEECH_LANG } from '@/components/ai-internals/readAloudLang';
import { useT } from '@/i18n/useT';

/** הפרומפט העוגן של הפרק. */
const PROMPT = 'החבילה סומנה כנמסרה, אבל הלקוח אומר שלא קיבל אותה.';

/* ════════════════════════ תוכן הפרק ════════════════════════ */
// הטקסט מרוכז כאן כדי שמנוע ההקראה והתצוגה יחלקו מקור אחד, ושהמעבר לרב-לשוני
// בעתיד יהיה קל. הפרק כרגע בעברית בלבד, בהתאם לתוכנית הפרקים.
const COPY = {
    hero: {
        titleLead: 'אותו משפט,',
        titleHighlight: 'אבל לא כל מילה חשובה באותה מידה',
        lede:
            'המשפט כולו נמצא מול המודל בבת אחת. אז למה הוא לא מתייחס לכל המילים בעוצמה זהה? בפרק הזה נגלה איך המודל מחליט, בכל רגע, אילו חלקים בהקשר חשובים לו עכשיו. המנגנון הזה נקרא Attention.',
    },
    primer: {
        eyebrow: 'מה זה Attention',
        title: 'רגע לפני המעבדה: מה זה Attention?',
        lead:
            'לפני שנתחיל לשחק עם המשפט, בואו נבין מה בעצם עושה מנגנון הקשב. כשהמודל קורא משפט, הוא לא מתייחס לכל המילים בעוצמה זהה. בכל רגע הוא שוקל אילו חלקים בטקסט קשורים זה לזה עכשיו, וכמה חזק. זה כל הרעיון של Attention.',
        points: [
            {
                title: 'יחסים, לא מילה אחת חשובה',
                body: 'הקשב לא בוחר מילה אחת מנצחת ונצמד אליה. הוא שואל, לכל חלק שהוא מעבד, אילו חלקים אחרים חשובים לו עכשיו. לכן החשיבות אינה תכונה קבועה של מילה, אלא נובעת מהקשר בין החלקים.',
            },
            {
                title: 'המתח שבמשפט שלנו',
                body: 'במשפט "החבילה סומנה כנמסרה, אבל הלקוח אומר שלא קיבל אותה", העיקר הוא לא מילה בודדת אלא המתח בין "נמסרה" לבין "לא קיבל". שם הקשב צריך להיות חזק, כי זו הסתירה שהתשובה חייבת לטפל בה.',
            },
            {
                title: 'מילים קטנות שמזיזות את הקשר',
                body: 'מילים כמו "אבל", שלילה ("לא"), תנאים ("רק אם"), חריגים וכינויים ("אותה") משנים אילו קשרים נעשים חשובים. שינוי קטן כזה יכול להזיז לגמרי את מוקד הקשב.',
            },
            {
                title: 'מה Attention הוא לא',
                body: 'הקשב הוא לא תודעה ולא הבנה אנושית. אין למודל רגע של "הבנתי". והוא גם לא בדיקת אמת: משקל קשב גבוה על "נמסרה" לא אומר שהחבילה באמת נמסרה, אלא רק שהמילה חשובה לעיבוד ההקשר.',
            },
        ],
    },
    lab: {
        title: 'שנו את המשפט, וראו מי חשוב עכשיו',
        intro:
            'תשובה טובה מתחילה מזה שהמודל שוקל נכון את הקשרים בין חלקי המשפט. שנו משהו קטן: הסירו את "אבל", החליפו את הסטטוס, או הפכו את השלילה, וראו איך מוקד הקשב והקשר בין החלקים זזים מיד.',
    },
    wow: {
        title: 'הנקודה המפתיעה',
        lead: 'אותו משפט. אותו מודל. אבל ברגע שמשנים מילה, חלק אחר במשפט מושך יותר משקל.',
        body:
            'אין מילה אחת שהיא "החשובה ביותר". החשיבות אינה תכונה קבועה של מילה, אלא תוצאה של הקשרים בתוך המשפט. וזה ההבדל בין רשימה קבועה של מילים מודגשות לבין מנגנון שמשקלל יחסים ומשתנה לפי מה שכתוב.',
    },
    everyday: {
        title: 'רגע מהחיים',
        body:
            'כשאדם קורא "החבילה סומנה כנמסרה, אבל הלקוח אומר שלא קיבל אותה", הוא נעצר רגע ב"אבל". המילה הזו משנה איך קוראים את כל ההמשך. חשוב לזכור: המודל לא נעצר ולא מבין כמו אדם. אין לו רגע של "הבנה". מנגנון הקשב רק נותן לו דרך מתמטית לשקלל אילו חלקים בטקסט קשורים זה לזה חזק יותר, ולפי זה לערבב את המידע.',
    },
    mistake: {
        wrongTitle: 'טעות נפוצה',
        wrong:
            '"Attention זה כשהמודל מסמן את המילים החשובות, ואז עונה לפיהן." לפי זה הקשב הוא מעין טוש מדגיש שמסמן פעם אחת מה חשוב.',
        rightTitle: 'איך זה באמת עובד',
        right:
            'Attention הוא לא טוש מדגיש. הוא מנגנון של יחסים. בכל רגע הוא שואל, בעצם: כשאני מעבד את החלק הזה, אילו חלקים אחרים בהקשר צריכים להשפיע עליו הכי הרבה? התשובה משתנה לפי מה שכתוב במשפט.',
    },
    qkv: {
        title: 'איך מנגנון היחסים עובד, בלי נוסחאות',
        sub: 'Query · Key · Value',
        body:
            'כל מילה שולחת מעין שאלה: על מה כדאי לי להסתכל עכשיו? מילים אחרות חושפות אותות: איזה מידע אני מכילה? המודל מחשב אילו זוגות של שאלה ואות מתאימים חזק יותר, ואז מערבב את המידע לפי עוצמת ההתאמה. ככה המשמעות של כל מילה מתעדכנת לפי ההקשר שסביבה. זה כל הרעיון, בלי מתמטיקה.',
    },
    lock: {
        title: 'נעילת הבנה',
        trueLabel: 'אמת',
        trueText: 'Attention לא אומר שמילה אחת תמיד חשובה. החשיבות משתנה לפי מה שכתוב במשפט ולפי הקשרים בתוכו.',
        falseLabel: 'טעות',
        falseText: '"המודל סימן את המילים החשובות ואז ענה."',
        question: 'הנה הפרומפט שוב. כשהמודל מכין תשובה זהירה, איזה קשר חשוב במיוחד?',
        options: [
            'החבילה ⟵ סומנה',
            'כנמסרה ⟵ שלא קיבל',
            'הלקוח ⟵ אומר',
            'סומנה ⟵ הלקוח',
        ],
        correctIndex: 1,
        explanationLead: 'הקשר החזק הוא',
        explanationPair: '"כנמסרה" מול "שלא קיבל"',
        explanationRest:
            '. העיקר הוא לא רק שחסרה חבילה, אלא הסתירה בין מה שהמערכת מסמנת לבין מה שהלקוח מדווח. שם הקשב צריך להיות חזק כדי שהתשובה לא תניח דבר שעוד לא נבדק.',
    },
    practical: {
        title: 'תובנה מעשית',
        lead: 'הקשב יודע לשקלל קשרים בתוך מה שכתבתם, אבל רק אם הקשרים באמת נמצאים שם.',
        uses: [
            'אם בפרומפט יש תנאי, חריג, סתירה או שלילה, כתבו אותם במפורש. מילים כמו "אבל", "לא" ו"רק אם" הן הסימנים שמכוונים את הקשב אל הקשר הנכון.',
            'אם חשוב לכם קשר בין שני דברים, הצמידו אותם וכתבו בבירור למה כל כינוי מתייחס. אל תסמכו על כך שהמודל "יבין לבד" מה קשור למה.',
        ],
        caveat:
            'וזכרו: משקל קשב גבוה על מילה לא אומר שהמידע נכון. Attention מחבר חלקי טקסט זה לזה, הוא לא בודק עובדות בעולם. לאימות צריך מקור חיצוני או כלי.',
    },
} as const;

/* ════════════════════════ נעילת הבנה: שאלת אבחון ════════════════════════ */

const DiagnosisQuestion: React.FC = () => {
    const [choice, setChoice] = useState<number | null>(null);
    const answered = choice !== null;
    const lock = COPY.lock;

    return (
        <div dir="rtl" className="text-right">
            <div className="mb-3 flex items-center gap-2">
                <p className="text-sm font-bold text-slate-200">{lock.question}</p>
                <SpeakButton text={lock.question} />
            </div>
            <p className="mb-4 rounded-lg border border-slate-700/50 bg-slate-950/40 p-3 text-sm text-slate-300">{PROMPT}</p>

            <div className="grid gap-2 sm:grid-cols-2">
                {lock.options.map((opt, i) => {
                    const isCorrect = i === lock.correctIndex;
                    const isChosen = i === choice;
                    let cls = 'border-slate-700/50 bg-slate-950/30 text-slate-300 hover:border-slate-600';
                    if (answered && isCorrect) cls = 'border-emerald-400/70 bg-emerald-900/25 text-emerald-100';
                    else if (answered && isChosen && !isCorrect) cls = 'border-rose-400/70 bg-rose-900/20 text-rose-100';
                    return (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setChoice(i)}
                            className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${cls}`}
                        >
                            <span dir="rtl">{opt}</span>
                            {answered && isCorrect && <CheckCircle2 size={16} className="shrink-0 text-emerald-300" />}
                            {answered && isChosen && !isCorrect && <XCircle size={16} className="shrink-0 text-rose-300" />}
                        </button>
                    );
                })}
            </div>

            {answered && (
                <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-3 text-sm leading-relaxed text-slate-200"
                >
                    {lock.explanationLead} <span className="font-bold text-emerald-200">{lock.explanationPair}</span>
                    {lock.explanationRest}
                </motion.p>
            )}
        </div>
    );
};

export default function BehindTheScenesChapter6() {
    const reduce = useReducedMotion();
    const { t } = useT();
    const raLabels = t.behindAi.aiInternals.readAloud;

    // ── דוק האזנה מודרכת: מקטעי הקראה יציבים בלבד. לא נכללים: ניחוש, מצב חי של
    // המעבדה, כפתורים, מנטורים וחידון. הפרק בעברית בלבד, לכן שפת הדיבור נעולה ל-he
    // כדי שההקראה תמיד תתאים לתוכן, ללא תלות בשפת הממשק. ──
    // טקסט ההסבר "רגע לפני המעבדה": כותרת + פתיח + כל הנקודות. משמש גם את הכפתור
    // הנקודתי בתוך הסקשן וגם את מקטע הדוק, כדי לשמור מקור אחד.
    const primerText = `${COPY.primer.title}. ${COPY.primer.lead} ${COPY.primer.points.map((p) => `${p.title}. ${p.body}`).join(' ')}`;

    const sHero: ReadAloudSegment = { id: 'hero', label: COPY.hero.titleHighlight, text: `${COPY.hero.titleLead} ${COPY.hero.titleHighlight}. ${COPY.hero.lede}` };
    const sPrimer: ReadAloudSegment = { id: 'primer', label: COPY.primer.title, text: primerText };
    const sLab: ReadAloudSegment = { id: 'lab', label: COPY.lab.title, text: `${COPY.lab.title}. ${COPY.lab.intro}` };
    const sWow: ReadAloudSegment = { id: 'wow', label: COPY.wow.title, text: `${COPY.wow.title}. ${COPY.wow.lead} ${COPY.wow.body}` };
    const sEveryday: ReadAloudSegment = { id: 'everyday', label: COPY.everyday.title, text: `${COPY.everyday.title}. ${COPY.everyday.body}` };
    const sMistake: ReadAloudSegment = { id: 'mistake', label: COPY.mistake.rightTitle, text: `${COPY.mistake.rightTitle}. ${COPY.mistake.right}` };
    const sQkv: ReadAloudSegment = { id: 'qkv', label: COPY.qkv.title, text: `${COPY.qkv.title}. ${COPY.qkv.body}` };
    const sLock: ReadAloudSegment = { id: 'lock', label: COPY.lock.title, text: COPY.lock.question };
    const sPractical: ReadAloudSegment = { id: 'practical', label: COPY.practical.title, text: `${COPY.practical.title}. ${COPY.practical.lead} ${COPY.practical.uses.join(' ')}` };
    const sCaveat: ReadAloudSegment = { id: 'caveat', label: COPY.practical.title, text: COPY.practical.caveat };

    const readAloudByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
        short: [sHero, sPrimer, sPractical, sCaveat],
        regular: [sHero, sPrimer, sLab, sWow, sMistake, sPractical, sCaveat],
        full: [sHero, sPrimer, sLab, sWow, sEveryday, sMistake, sQkv, sLock, sPractical, sCaveat],
    };

    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={6}>

            {/* ══════════ HERO ══════════ */}
            <div className="relative">
                <motion.section
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 text-right"
                    dir="rtl"
                >
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-violet-500/30 mb-5">
                            <Link2 size={14} className="text-violet-400" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300">Behind the Scenes · 06 · Attention</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                            {COPY.hero.titleLead}{' '}
                            <span className="bg-gradient-to-l from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent">
                                {COPY.hero.titleHighlight}
                            </span>
                        </h1>

                        <div className="flex items-start gap-2.5 max-w-3xl">
                            <p className="text-lg text-slate-300 leading-relaxed">{COPY.hero.lede}</p>
                            <SpeakButton text={`${COPY.hero.titleLead} ${COPY.hero.titleHighlight}. ${COPY.hero.lede}`} className="mt-1" />
                        </div>

                        <div className="mt-6 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4">
                            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <ScanSearch size={13} className="text-violet-400" /> הפרומפט של הפרק
                            </div>
                            <p className="text-base font-bold text-slate-100">{PROMPT}</p>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-violet-400" /> שנו משהו במשפט
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Link2 size={14} className="text-emerald-400" /> וראו לאן הקשב זז
                            </span>
                        </div>

                        {/* דוק ההאזנה המודרכת: אותו רכיב של המבוא ופרק 5, נעוץ למסילת הקצה. */}
                        <FloatingReadAloud dir="rtl">
                            <ReadAloudControls
                                segmentsByMode={readAloudByMode}
                                lang={LOCALE_SPEECH_LANG.he}
                                locale="he"
                                dir="rtl"
                                labels={raLabels}
                                reduce={!!reduce}
                                compact
                            />
                        </FloatingReadAloud>
                    </div>
                </motion.section>

                {/* מנטור הירו: נכס ייעודי עם אלפא שקוף. בלי בועת דיבור, כדי שלא ישכפל את
                    כותרת הפרק ולא יתחרה בה. מוצג רק מ-xl ומעלה. */}
                <div className="pointer-events-none absolute top-1/2 left-full ml-3 2xl:ml-6 z-20 hidden w-[170px] -translate-y-1/2 xl:block">
                    <motion.img
                        src="/assets/chapter-08-attention-mentor-hero-alpha.png"
                        alt="המנטור של הלומדה"
                        initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                        animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, -10, 0] }}
                        transition={reduce ? { duration: 0 } : { y: { repeat: Infinity, duration: 4, ease: 'easeInOut' }, opacity: { duration: 0.4 } }}
                        className="block h-auto w-full object-contain drop-shadow-[0_15px_35px_rgba(34,211,238,0.30)]"
                        draggable={false}
                    />
                </div>
            </div>

            {/* ══════════ ניחוש לפני הסבר: ארבע השערות על Attention ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <AttentionGuess />
            </section>

            {/* ══════════ רגע לפני המעבדה: הסבר Attention ══════════ */}
            {/* חוליית ההסבר בין הניחוש למעבדה: מבססת מה זה קשב לפני שנוגעים במשפט, כדי
                שהמעבר מהניחוש למעבדה לא יהיה חד מדי. */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="rounded-[2rem] border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-xl md:p-8">
                    <div className="mb-4 flex items-start justify-between gap-2.5">
                        <div>
                            <span className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-300">
                                <Sparkles size={14} /> {COPY.primer.eyebrow}
                            </span>
                            <h3 className="text-xl font-black text-white md:text-2xl">{COPY.primer.title}</h3>
                        </div>
                        <SpeakButton text={primerText} />
                    </div>

                    <p className="text-[15px] leading-relaxed text-slate-300 md:text-base">{COPY.primer.lead}</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {COPY.primer.points.map((pt) => (
                            <div key={pt.title} className="rounded-2xl border border-slate-700/50 bg-slate-950/30 p-4">
                                <div className="mb-1.5 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                    <div className="text-sm font-bold text-slate-100">{pt.title}</div>
                                </div>
                                <p className="text-[15px] leading-relaxed text-slate-300">{pt.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ מעבדת הקשב ══════════ */}
            {/* אין פס הקשר דביק כאן: המשפט העוגן גלוי תמיד בתוך המעבדה עצמה, וגם בהירו,
                כך שאין צורך להצמיד עותק שלישי שלו. */}
            <section id="attention-lab" className="relative mt-12 space-y-5 text-right scroll-mt-24" dir="rtl">
                <div className="flex items-center gap-3">
                    <FlaskConical size={24} className="text-violet-400" />
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-400">Attention Lab</div>
                        <h3 className="text-2xl font-bold text-white">{COPY.lab.title}</h3>
                    </div>
                </div>

                <div className="flex items-start gap-2.5">
                    <p className="text-base leading-relaxed text-slate-300">{COPY.lab.intro}</p>
                    <SpeakButton text={`${COPY.lab.title}. ${COPY.lab.intro}`} className="mt-1" />
                </div>

                <AttentionSentenceLab />

                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="explain" line="שנו מילה, והמשקל זז" width={160} />
                </div>
            </section>

            {/* ══════════ רגע ה-wow ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <InsightBox type="intuition" title={COPY.wow.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block text-lg font-bold text-violet-200">{COPY.wow.lead}</span>
                        <SpeakButton text={`${COPY.wow.title}. ${COPY.wow.lead} ${COPY.wow.body}`} />
                    </div>
                    <span className="mt-2 block">{COPY.wow.body}</span>
                </InsightBox>
            </section>

            {/* ══════════ דוגמה יומיומית ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Lightbulb size={18} className="text-amber-300" />
                            <div className="text-sm font-bold text-slate-100">{COPY.everyday.title}</div>
                        </div>
                        <SpeakButton text={`${COPY.everyday.title}. ${COPY.everyday.body}`} />
                    </div>
                    <p>{COPY.everyday.body}</p>
                </div>
            </section>

            {/* ══════════ תיקון טעות נפוצה ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-rose-200">
                            <XCircle size={18} />
                            <span className="text-sm font-bold">{COPY.mistake.wrongTitle}</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">{COPY.mistake.wrong}</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5">
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-emerald-200">
                                <CheckCircle2 size={18} />
                                <span className="text-sm font-bold">{COPY.mistake.rightTitle}</span>
                            </div>
                            <SpeakButton text={`${COPY.mistake.rightTitle}. ${COPY.mistake.right}`} />
                        </div>
                        <p className="leading-relaxed text-slate-300">{COPY.mistake.right}</p>
                    </div>
                </div>
            </section>

            {/* ══════════ הסבר Q/K/V עדין ══════════ */}
            <section className="mt-12 text-right" dir="rtl">
                <div className="rounded-2xl border border-violet-500/30 bg-slate-900/40 p-5 leading-relaxed text-slate-300">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Link2 size={18} className="text-violet-300" />
                            <div className="leading-tight">
                                <div className="text-sm font-bold text-slate-100">{COPY.qkv.title}</div>
                                <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">{COPY.qkv.sub}</div>
                            </div>
                        </div>
                        <SpeakButton text={`${COPY.qkv.title}. ${COPY.qkv.body}`} />
                    </div>
                    <p>{COPY.qkv.body}</p>
                </div>
            </section>

            {/* ══════════ נעילת הבנה ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="celebrate" line="נעלתם את הקשב" width={160} />
                </div>
                <div className="rounded-2xl border border-violet-500/40 bg-slate-900/60 p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <Lock size={20} className="text-violet-300" />
                        <h3 className="text-xl font-bold text-white">{COPY.lock.title}</h3>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">{COPY.lock.trueLabel}</div>
                            <p className="text-sm leading-relaxed text-slate-200">{COPY.lock.trueText}</p>
                        </div>
                        <div className="rounded-xl border border-rose-500/30 bg-rose-950/10 p-4">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-rose-300">{COPY.lock.falseLabel}</div>
                            <p className="text-sm leading-relaxed text-slate-200">{COPY.lock.falseText}</p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-700/50 bg-slate-950/30 p-4">
                        <DiagnosisQuestion />
                    </div>
                </div>
            </section>

            {/* ══════════ תובנה מעשית ══════════ */}
            <section className="relative mt-12 text-right" dir="rtl">
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
                    <Mentor pose="pointdown" line="ככה כותבים פרומפט שהקשב מבין" width={160} />
                </div>
                <InsightBox type="intuition" title={COPY.practical.title}>
                    <div className="flex items-start justify-between gap-2.5">
                        <span className="block">{COPY.practical.lead}</span>
                        <SpeakButton text={`${COPY.practical.title}. ${COPY.practical.lead} ${COPY.practical.uses.join(' ')} ${COPY.practical.caveat}`} />
                    </div>
                    <ul className="mt-3 space-y-2">
                        {COPY.practical.uses.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                <span className="text-sm">{line}</span>
                            </li>
                        ))}
                    </ul>
                    <span className="mt-3 block text-sm text-slate-400">{COPY.practical.caveat}</span>
                </InsightBox>
            </section>

            {/* ══════════ מבדק הבנה ══════════ */}
            <section className="mt-12 mb-4" dir="rtl">
                <ChapterQuiz chapterId={6} />
            </section>
        </ChapterLayout>
    );
}
