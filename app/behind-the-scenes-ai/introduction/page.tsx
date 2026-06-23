"use client";
import React from 'react';
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft, Eye, Cpu, Keyboard, Scissors, Hash, Network,
  BarChart3, Percent, Gauge, GitBranch, Send, MessageCircle,
  Workflow, AlertCircle, Wrench, ShieldCheck, CornerDownRight, ArrowLeftRight,
  ListOrdered, Focus, Layers, Thermometer, Repeat, Type,
} from "lucide-react";
import Link from 'next/link';
import { ChapterLayout } from "@/components/ChapterLayout";
import { EngineTrail, type TrailStep } from "@/components/ai-internals/EngineTrail";

// ─── המסלול הפנימי המלא: מקלט ועד תשובה ───
// המסלול האמיתי, בלי דילוג על שלבים: מתווים גולמיים, דרך הקשב ושכבות ה-Transformer,
// ועד תשובה שנבנית מילה-אחר-מילה. כל שלב לחיץ ופותח הסבר + דוגמה.
const FULL_FLOW: TrailStep[] = [
  {
    id: 'input', label: 'Input', sub: 'מה שכתבת בצ׳אט', icon: <Keyboard size={18} />, accent: 'cyan',
    detail: 'הטקסט הגולמי שהקלדת. בשלב הזה למודל אין שום "הבנה" עדיין — מבחינתו זה רק רצף של תווים, רווחים וסימנים.',
    example: 'מה מזג האוויר בתל אביב?',
  },
  {
    id: 'tokens', label: 'Tokenization', sub: 'הטקסט נחתך ליחידות', icon: <Scissors size={18} />, accent: 'cyan',
    detail: 'הטקסט נחתך ליחידות קטנות (Tokens) — לפעמים מילה שלמה, לפעמים רק חלק ממילה או אפילו תו בודד. זו השפה שהמודל באמת עובד איתה.',
    example: '"תל-אביב" → ["תל", "-", "אביב"]',
  },
  {
    id: 'ids', label: 'Token IDs', sub: 'כל טוקן → מספר מזהה', icon: <Hash size={18} />, accent: 'blue',
    detail: 'לכל טוקן יש מספר קבוע מתוך אוצר מילים (Vocabulary) של עשרות אלפי ערכים. אותו טוקן תמיד מקבל את אותו מזהה.',
    example: '"אביב" → 8423',
  },
  {
    id: 'embeddings', label: 'Embeddings', sub: 'כל מזהה → וקטור משמעות', icon: <Network size={18} />, accent: 'blue',
    detail: 'כל מזהה הופך לרשימה ארוכה של מספרים (וקטור) שמייצגת משמעות. מילים בעלות משמעות קרובה מקבלות וקטורים קרובים במרחב.',
    example: '"מלך" ו"מלכה" יושבים קרוב זה לזה במרחב',
  },
  {
    id: 'position', label: 'Positional Encoding', sub: 'לאן כל טוקן שייך ברצף', icon: <ListOrdered size={18} />, accent: 'indigo',
    detail: 'וקטור לבדו לא יודע אם המילה ראשונה או אחרונה. כאן מוסיפים לכל טוקן מידע על מיקומו — כי הסדר משנה את המשמעות לחלוטין.',
    example: '"כלב נשך אדם" ≠ "אדם נשך כלב"',
  },
  {
    id: 'attention', label: 'Attention', sub: 'כל טוקן מסתכל על האחרים', icon: <Focus size={18} />, accent: 'indigo',
    detail: 'הלב של המודל. כל טוקן "מסתכל" על שאר הטוקנים ומחליט אילו מהם רלוונטיים לו. ככה נבנה ההקשר, וככה מילה כמו "הוא" יודעת למי היא מתייחסת.',
    example: 'ב"הכלב רץ כי הוא שמח" — "הוא" מתחבר ל"כלב"',
  },
  {
    id: 'layers', label: 'Transformer Layers', sub: 'עיבוד שחוזר עשרות פעמים', icon: <Layers size={18} />, accent: 'purple',
    detail: 'הקשב והעיבוד חוזרים שוב ושוב, בעשרות שכבות. בכל שכבה הייצוג הופך מעודן ומופשט יותר — ממילים בודדות אל משמעות המשפט כולו.',
    example: '32, 80 ולפעמים יותר שכבות במודלים גדולים',
  },
  {
    id: 'logits', label: 'Logits / Scores', sub: 'ציון לכל אפשרות', icon: <BarChart3 size={18} />, accent: 'purple',
    detail: 'בסוף השכבות המודל מייצר ציון (Logit) לכל טוקן אפשרי באוצר המילים — כמה הוא מתאים להיות הטוקן הבא. אלה מספרים גולמיים, עדיין לא אחוזים.',
    example: '"שמש": 8.2 · "גשם": 6.1 · "פיל": -3.4',
  },
  {
    id: 'probs', label: 'Softmax → Probabilities', sub: 'ציונים הופכים לאחוזים', icon: <Percent size={18} />, accent: 'purple',
    detail: 'פונקציית Softmax הופכת את הציונים הגולמיים להתפלגות הסתברות שמסתכמת ל-100%. עכשיו לכל אפשרות יש אחוז ברור.',
    example: '"שמש" 72% · "גשם" 19% · "ענן" 6%',
  },
  {
    id: 'sampling', label: 'Sampling / Temperature', sub: 'איך בוחרים מתוך ההתפלגות', icon: <Thermometer size={18} />, accent: 'amber',
    detail: 'המודל לא תמיד בוחר את הכי סביר. פרמטרים כמו Temperature ו-top-p קובעים כמה "להעז": טמפרטורה נמוכה = צפוי ויציב, גבוהה = יצירתי ומגוון.',
    example: 'טמפרטורה נמוכה → תמיד "שמש"; גבוהה → לפעמים "ענן"',
  },
  {
    id: 'confidence', label: 'Confidence', sub: 'כמה המערכת בטוחה', icon: <Gauge size={18} />, accent: 'amber',
    detail: 'המודל בוחן את הפער בין האפשרות המובילה לבאות אחריה. פער גדול = ביטחון גבוה. פער קטן = חוסר ודאות, ולפעמים עדיף לסייג או לשאול.',
    example: '72% מול 19% → פער גדול, ביטחון גבוה',
  },
  {
    id: 'decision', label: 'Decision', sub: 'טוקן אחד נבחר', icon: <GitBranch size={18} />, accent: 'rose',
    detail: 'מתוך כל החישוב נבחר טוקן אחד בלבד — המילה (או חלק המילה) הבאה בתשובה.',
    example: 'נבחר: "שמש"',
  },
  {
    id: 'loop', label: 'Autoregressive Loop', sub: 'מילה אחר מילה', icon: <Repeat size={18} />, accent: 'rose',
    detail: 'הטוקן שנבחר מצורף לקלט, והכל רץ מחדש כדי לייצר את הטוקן הבא. כך התשובה נבנית מילה-אחר-מילה, עד שהמודל מייצר סימן עצירה.',
    example: '"היום" → "היום צפוי" → "היום צפוי מזג..."',
  },
  {
    id: 'detok', label: 'Detokenization', sub: 'טוקנים → טקסט קריא', icon: <Type size={18} />, accent: 'cyan',
    detail: 'רצף הטוקנים שנוצר מורכב בחזרה לטקסט רגיל, עם רווחים וסימני פיסוק — בדיוק כמו שאתה רואה אותו על המסך.',
    example: '["היום","צפוי","שמש"] → "היום צפוי שמש"',
  },
  {
    id: 'response', label: 'Response', sub: 'מה שחזר אליך', icon: <Send size={18} />, accent: 'cyan',
    detail: 'הטקסט הסופי מוצג לך בצ׳אט. מבחוץ זה הרגע היחיד שראית — אבל עכשיו אתה יודע כמה שלבים עמדו מאחוריו.',
    example: 'היום צפוי מזג אוויר שמשי בתל אביב 🌞',
  },
];

// ─── מה שהמשתמש רואה מבחוץ ───
const OUTSIDE_FLOW: TrailStep[] = [
  { id: 'in', label: 'Input', sub: 'כתבנו משפט', icon: <Keyboard size={18} />, accent: 'cyan' },
  { id: 'out', label: 'Response', sub: 'קיבלנו תשובה', icon: <Send size={18} />, accent: 'cyan' },
];

// ─── preview: Chat Mode ───
// הצצה מתומצתת. ה-detail כאן ממוקד במה שמייחד את מצב ה-Chat: לייצר טקסט, בלי פעולה בעולם.
const CHAT_FLOW: TrailStep[] = [
  {
    id: 'c1', label: 'Input', icon: <Keyboard size={15} />,
    detail: 'בצ׳אט המטרה אחת ויחידה: לייצר תשובה טקסטואלית. אין משימה לבצע — רק שאלה לענות עליה.',
    example: '"כתוב לי סיכום קצר על תל אביב"',
  },
  {
    id: 'c2', label: 'Tokens', icon: <Scissors size={15} />,
    detail: 'אותו פירוק לטוקנים מהמסלול המלא. זה הקלט האמיתי של המנוע — גם ב-Chat וגם ב-Agent.',
    example: '"סיכום" → ["סי", "כום"]',
  },
  {
    id: 'c3', label: 'Probabilities', icon: <Percent size={15} />,
    detail: 'המנוע מחשב הסתברות לכל טוקן הבא. ב-Chat זה כל הסיפור — החישוב הזה חוזר על עצמו לכל מילה בתשובה.',
    example: 'המילה הבאה: "תל" 64% · "עיר" 21%',
  },
  {
    id: 'c4', label: 'Decision', icon: <GitBranch size={15} />,
    detail: 'בכל צעד נבחר הטוקן הבא. אין כאן כלים, אין פעולות בעולם — רק בחירת מילים, אחת אחרי השנייה.',
    example: 'נבחר: "תל"',
  },
  {
    id: 'c5', label: 'Response', icon: <Send size={15} />,
    detail: 'התוצר הסופי הוא בלוק טקסט אחד שחוזר אליך. כאן הסיפור נגמר — המנוע לא עושה שום דבר מעבר.',
    example: '"תל אביב היא עיר החוף הגדולה..."',
  },
];

// ─── preview: Agent Mode ───
// אותה הצצה, אבל ה-detail מדגיש את מה שהופך Agent לשונה: החלטות, כלים, אחריות ולולאה.
const AGENT_FLOW: TrailStep[] = [
  {
    id: 'a1', label: 'Task', icon: <Workflow size={15} />,
    detail: 'Agent לא רק עונה — הוא מזהה משימה. השאלה הראשונה היא לא "מה לכתוב" אלא "מה המטרה שצריך להשיג".',
    example: '"תזמן לי פגישה עם דנה מחר ב-10"',
  },
  {
    id: 'a2', label: 'Missing Info', icon: <AlertCircle size={15} />,
    detail: 'לפני פעולה ה-Agent בודק מה חסר לו. חוסר מידע משמעו לשאול או לברר — לא לנחש. זה ההבדל מ-Chat.',
    example: 'חסר: עם איזו דנה? באיזה יומן?',
  },
  {
    id: 'a3', label: 'Tool Need', icon: <Wrench size={15} />,
    detail: 'Agent מחליט אם הוא צריך כלי חיצוני (יומן, חיפוש, API) או שהוא יכול לטפל בזה לבד. כאן נכנס העולם האמיתי.',
    example: 'צריך: גישה ליומן',
  },
  {
    id: 'a4', label: 'Safety Check', icon: <ShieldCheck size={15} />,
    detail: 'לפני פעולה אמיתית נבדקים הרשאה וסיכון. פעולה הפיכה זה דבר אחד; פעולה בלתי-הפיכה דורשת זהירות ואישור.',
    example: 'יצירת אירוע = הפיך · שליחת מייל = פחות',
  },
  {
    id: 'a5', label: 'Next Step', icon: <CornerDownRight size={15} />,
    detail: 'Agent פועל בלולאה: צעד, תוצאה, החלטה הבאה — שוב ושוב, עד שהמשימה הושלמה. לא תשובה אחת, אלא מסלול.',
    example: 'נוצר אירוע → לאשר מול המשתמש',
  },
];

// כותרת-מקטע אחידה
function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="text-center mb-10">
      <span className="text-cyan-400 text-[11px] font-bold uppercase tracking-[0.25em] block mb-3">
        {eyebrow}
      </span>
      <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-3">{title}</h2>
      {children && <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">{children}</p>}
    </div>
  );
}

export default function BehindTheScenesIntroPage() {
  const reduce = useReducedMotion();

  return (
    <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={0} lang="he">
      <div className="px-4 pb-24" style={{ marginTop: '160px' }} dir="rtl">
        <div className="max-w-5xl mx-auto">

          {/* ══════════ HERO ══════════ */}
          {/* עוטף relative בלי overflow כדי שהמנטור יוכל לחרוג מגבול הכרטיס */}
          <div className="relative">
          <motion.section
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-900/80 backdrop-blur-2xl p-6 md:p-8 shadow-2xl"
          >
            {/* הילות רקע */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            {/* shimmer סורק עדין מעל אזור המנוע */}
            {!reduce && (
              <motion.div
                className="absolute inset-y-0 w-1/3 bg-gradient-to-l from-transparent via-cyan-400/[0.06] to-transparent pointer-events-none"
                initial={{ x: '-150%' }}
                animate={{ x: '300%' }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
              />
            )}

            <div className="relative z-10">
              <div className="text-center md:text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-cyan-500/30 mb-3">
                  <span className="relative flex h-2 w-2">
                    {!reduce && <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />}
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                  </span>
                  <span className="text-cyan-300 text-xs font-bold tracking-wide">המעבדה השקופה · Behind the Scenes</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-2 md:whitespace-nowrap">
                  מה מסתתר בין{' '}
                  <span className="bg-gradient-to-l from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    הקלט לתשובה
                  </span>
                </h1>

                <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-1.5">
                  מבחוץ זה נראה כמו רגע אחד: כתבנו משפט וקיבלנו תשובה. מבפנים זה מסלול שלם: פירוק, מספרים, הקשר, חישוב, הסתברות והחלטה — שלב אחר שלב.
                </p>
                <p className="text-sm md:text-base text-cyan-300/90 font-semibold">
                  בלומדה הזו לא נסתפק במה שהמודל עונה. ננסה להבין איך הוא הגיע לשם.
                </p>
              </div>
            </div>
          </motion.section>

          {/* המנטור עומד מימין לכרטיס ומבחוץ ומצביע עליו. רק במסכים רחבים (xl+) יש שם מקום; בצרים מוסתר. */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 48, scale: 0.7 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 17, delay: 0.4 }}
            className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block w-40 2xl:w-52 pointer-events-none"
          >
            <div className="absolute inset-0 bg-cyan-500/15 blur-2xl rounded-full" />
            <motion.img
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              src="/assets/mentor-hero.png"
              alt="Mentor"
              className="relative w-full h-auto object-contain drop-shadow-[0_15px_35px_rgba(34,211,238,0.35)]"
            />
          </motion.div>
          </div>

          {/* ══════════ OUTSIDE vs BEHIND ══════════ */}
          <section className="mt-20">
            <SectionHeading eyebrow="פותחים את המנוע" title="מה שהמשתמש רואה מול מה שהמנוע עושה">
              אותו קלט. אותה תשובה. אבל מתחת לפני השטח מתרחש מסלול שלם – וזה בדיוק מה שנחשוף.
            </SectionHeading>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1.3fr] gap-6 items-stretch">
              {/* Outside View */}
              <motion.div
                initial={reduce ? false : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                    <Eye className="text-slate-300" size={18} />
                  </div>
                  <div>
                    <div className="text-slate-200 font-bold text-sm">Outside View</div>
                    <div className="text-slate-500 text-xs">מה שהמשתמש רואה</div>
                  </div>
                </div>
                <EngineTrail steps={OUTSIDE_FLOW} accent="cyan" autoplay interval={1300} />
                <p className="text-slate-500 text-xs mt-5 text-center leading-relaxed">
                  שני שלבים. רגע אחד. נראה פשוט.
                </p>
              </motion.div>

              {/* מפריד אמצעי */}
              <div className="hidden lg:flex flex-col items-center justify-center gap-3">
                <ArrowLeftRight className="text-slate-600" size={28} />
                <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
                  אותה בקשה
                </span>
              </div>

              {/* Behind the Scenes View */}
              <motion.div
                initial={reduce ? false : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-6 backdrop-blur-xl shadow-[0_0_40px_-12px_rgba(34,211,238,0.4)]"
              >
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 blur-[70px] rounded-full pointer-events-none" />
                <div className="relative flex items-center gap-2.5 mb-5">
                  <div className="p-2 rounded-xl bg-slate-800 border border-cyan-500/30">
                    <Cpu className="text-cyan-400" size={18} />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">Behind the Scenes View</div>
                    <div className="text-cyan-400/80 text-xs">מה שהמנוע עושה בפועל</div>
                  </div>
                </div>
                <div className="relative">
                  <EngineTrail steps={FULL_FLOW} accent="cyan" autoplay interval={650} interactive />
                </div>
                <p className="text-cyan-300/70 text-xs mt-5 text-center leading-relaxed">
                  המסלול המלא – בלי דילוג על שלבים. לחצו על כל שלב כדי להציץ פנימה: מה קורה שם, עם דוגמה.
                </p>
              </motion.div>
            </div>
          </section>

          {/* ══════════ NARRATIVE ══════════ */}
          <motion.section
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mt-20 relative overflow-hidden rounded-[2rem] border border-slate-700/40 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-8 md:p-12 text-center"
          >
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-px h-full bg-gradient-to-b from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 pointer-events-none" />
            <p className="relative text-xl md:text-2xl text-slate-200 leading-relaxed max-w-3xl mx-auto font-medium">
              כשאנחנו כותבים לצ׳אט, הטקסט <span className="text-cyan-300 font-bold">מתפרק</span>, הופך
              ל<span className="text-blue-300 font-bold">מספרים</span>, מקבל
              ייצוג של <span className="text-blue-300 font-bold">משמעות</span>, לומד את
              ה<span className="text-indigo-300 font-bold">הקשר</span> בין המילים דרך
              <span className="text-indigo-300 font-bold"> שכבות הקשב</span>, עובר
              <span className="text-purple-300 font-bold"> דירוג</span>, הופך
              ל<span className="text-purple-300 font-bold">הסתברויות</span>, נבדק מבחינת
              <span className="text-amber-300 font-bold"> ביטחון</span>, ונבנה
              <span className="text-rose-300 font-bold"> מילה אחר מילה</span> עד
              ל<span className="text-cyan-300 font-bold">תשובה</span>.
            </p>
            <p className="relative text-slate-400 text-base md:text-lg mt-5">
              הלומדה הזו נועדה להפוך את המסלול הזה לגלוי.
            </p>
          </motion.section>

          {/* ══════════ CHAT vs AGENT PREVIEW ══════════ */}
          <section className="mt-20">
            <SectionHeading eyebrow="שני מצבים · הצצה מקדימה" title="Chat מול Agent – שני חלונות לאותו רעיון">
              Chat עונה על שאלה, Agent (סוֹכֵן) מבצע משימה. בהמשך נראה את שניהם לעומק; כאן הצצה מהירה — לחצו על כל שלב כדי לראות מה מייחד כל מצב.
            </SectionHeading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chat Mode */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-blue-500/30 bg-slate-900/60 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30">
                    <MessageCircle className="text-blue-300" size={18} />
                  </div>
                  <div>
                    <div className="text-white font-bold">Chat Mode</div>
                    <div className="text-blue-300/70 text-xs">טקסט הופך לתשובה</div>
                  </div>
                </div>
                <EngineTrail steps={CHAT_FLOW} accent="blue" autoplay interval={750} compact interactive />
              </motion.div>

              {/* Agent Mode */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-3xl border border-purple-500/30 bg-slate-900/60 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30">
                    <Workflow className="text-purple-300" size={18} />
                  </div>
                  <div>
                    <div className="text-white font-bold">Agent Mode</div>
                    <div className="text-purple-300/70 text-xs">בקשה הופכת להחלטה ולפעולה</div>
                  </div>
                </div>
                <EngineTrail steps={AGENT_FLOW} accent="purple" autoplay interval={750} compact interactive />
              </motion.div>
            </div>
          </section>

          {/* ══════════ CTA ══════════ */}
          <motion.section
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mt-20 relative overflow-hidden rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-900/60 p-10 md:p-14 text-center shadow-2xl"
          >
            <div className="absolute -top-20 right-1/2 translate-x-1/2 w-80 h-40 bg-cyan-500/15 blur-[80px] rounded-full pointer-events-none" />
            <h2 className="relative text-2xl md:text-4xl font-black text-white mb-4 tracking-tight">
              מוכן לפתוח את המנוע?
            </h2>
            <p className="relative text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              בפרק הראשון נתחיל מההתחלה של המסלול - נראה איך טקסט הופך לתשובה, שלב אחר שלב.
            </p>
            <Link
              href="/behind-the-scenes-ai/chapter-1"
              className="relative inline-flex items-center gap-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-4 px-10 rounded-2xl transition-all shadow-[0_8px_30px_-6px_rgba(34,211,238,0.6)] hover:shadow-[0_8px_40px_-4px_rgba(34,211,238,0.8)] active:scale-95 no-underline text-lg"
            >
              התחל לפתוח את המנוע
              <ChevronLeft size={22} />
            </Link>
          </motion.section>

        </div>
      </div>
    </ChapterLayout>
  );
}
