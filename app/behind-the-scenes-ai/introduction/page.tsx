"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ChevronLeft, ChevronDown, Eye, Cpu, Keyboard, Scissors, Hash, Network,
  BarChart3, Percent, GitBranch, Send, MessageCircle,
  Workflow, AlertCircle, Wrench, ShieldCheck, CornerDownRight, ArrowLeftRight,
  ListOrdered, Focus, Layers, Thermometer, Repeat, Type, Info,
} from "lucide-react";
import Link from 'next/link';
import { ChapterLayout } from "@/components/ChapterLayout";
import { EngineTrail, type TrailStep } from "@/components/ai-internals/EngineTrail";
import { GuessRevealGate, LiveTokenizeTaste } from "@/components/ai-internals/IntroInteractions";
import { Mentor } from "@/components/ai-internals/Mentor";

// ─── מפת הלמידה: שש תחנות מרכזיות מהקלט ועד תשובה ───
// זו מפת למידה, לא צילום מלא של כל פעולה פנימית. בחרנו את התחנות המרכזיות שעוזרות להבין
// איך טקסט הופך לתשובה. כל תחנה לחיצה ופותחת הסבר אנושי קצר + דוגמה. הפירוט הטכני חי
// בשכבת העומק (DEEP_FLOW) ובפרקים עצמם.
const HERO_FLOW: TrailStep[] = [
  {
    id: 'input', label: 'הטקסט נכנס', sub: 'מה שכתבתם בצ׳אט', icon: <Keyboard size={18} />, accent: 'cyan',
    detail: 'המשתמש כותב בקשה בשפה טבעית. בנקודה הזו למודל אין עדיין שום "הבנה" - מבחינתו זה רק רצף של תווים, רווחים וסימנים.',
    example: 'מה מזג האוויר בתל אביב?',
  },
  {
    id: 'tokens', label: 'פירוק לטוקנים', sub: 'הטקסט נחתך ליחידות', icon: <Scissors size={18} />, accent: 'cyan',
    detail: 'המודל לא קורא משפט כמו אדם. הוא מפרק אותו לטוקנים - לפעמים מילה שלמה, לפעמים חלק ממילה או סימן. זו השפה שהוא באמת עובד איתה.',
    example: '"תל-אביב" → ["תל", "-", "אביב"]',
  },
  {
    id: 'meaning', label: 'מספרים ומשמעות', sub: 'כל טוקן הופך לווקטור', icon: <Network size={18} />, accent: 'blue',
    detail: 'כל טוקן מקבל ייצוג מספרי שאפשר לחשב עליו: וקטור שמייצג משמעות. טוקנים בעלי משמעות קרובה מקבלים מספרים קרובים זה לזה.',
    example: '"מלך" ו"מלכה" יושבים קרוב זה לזה במרחב',
  },
  {
    id: 'context', label: 'חישוב ההקשר', sub: 'כל טוקן מסתכל על מה שלפניו', icon: <Focus size={18} />, accent: 'indigo',
    detail: 'המודל בודק אילו חלקים בהקשר חשובים להבנת הטוקן הנוכחי. כך נבנית הבנה: מילה כמו "הוא" יודעת למי היא מתייחסת. זה חוזר שוב ושוב, בהרבה שכבות.',
    example: 'ב"הכלב רץ כי הוא שמח" - "הוא" מתחבר ל"כלב"',
  },
  {
    id: 'rank', label: 'דירוג הטוקן הבא', sub: 'ציון והסתברות לכל אפשרות', icon: <BarChart3 size={18} />, accent: 'purple',
    detail: 'בסוף כל סיבוב המודל מדרג אפשרויות לטוקן הבא: נותן ציון לכל אפשרות, הופך אותו להסתברות, ובוחר אחת.',
    example: '"שמש" 72% · "גשם" 19% · "ענן" 6%',
  },
  {
    id: 'loop', label: 'לולאה עד תשובה', sub: 'מילה אחר מילה', icon: <Repeat size={18} />, accent: 'rose',
    detail: 'הטוקן שנבחר מצטרף לתשובה, ואז התהליך חוזר מההתחלה כדי לבחור את הבא - עד שהמודל מגיע לסימן עצירה. כך נבנית תשובה שלמה.',
    example: '"היום" → "היום צפוי" → "היום צפוי שמש"',
  },
];

// ─── שכבת העומק האופציונלית ───
// פירוט עשיר יותר של מה שמתרחש בתוך התחנות. זו עדיין מפת למידה: מאחורי כל תחנה כאן
// רצים חישובים רבים, והמספר המדויק של הפעולות אינו קבוע ותלוי במודל ובהקשר.
const DEEP_FLOW: TrailStep[] = [
  {
    id: 'd-input', label: 'קלט משתמש', sub: 'הטקסט הגולמי', icon: <Keyboard size={16} />, accent: 'cyan',
    detail: 'מה שהוקלד, עדיין רק רצף תווים בלי משמעות.',
    example: 'מה מזג האוויר בתל אביב?',
  },
  {
    id: 'd-tok', label: 'Tokenization', sub: 'חיתוך ליחידות עבודה', icon: <Scissors size={16} />, accent: 'cyan',
    detail: 'הטקסט נחתך לטוקנים: מילה, חלק ממילה או סימן. לא אותיות בודדות ולא בהכרח מילים שלמות.',
    example: '"אביב" הוא טוקן אחד',
  },
  {
    id: 'd-ids', label: 'Token IDs', sub: 'כתובת במילון', icon: <Hash size={16} />, accent: 'blue',
    detail: 'כל טוקן ממופה למזהה קבוע מתוך אוצר מילים. זו כתובת, עדיין לא משמעות.',
    example: '"אביב" → 8423',
  },
  {
    id: 'd-emb', label: 'Embeddings', sub: 'מזהה הופך לווקטור', icon: <Network size={16} />, accent: 'blue',
    detail: 'המזהה הופך לרשימת מספרים שמקודדת משמעות. מילים קרובות במשמעות מקבלות מספרים קרובים.',
    example: '"מלך" ו"מלכה" קרובים במרחב',
  },
  {
    id: 'd-pos', label: 'מידע על מיקום', sub: 'הסדר נשמר', icon: <ListOrdered size={16} />, accent: 'indigo',
    detail: 'הסדר ברצף משפיע על המשמעות, ולכן נשמר מידע על המיקום של כל טוקן.',
    example: '"כלב נשך אדם" ≠ "אדם נשך כלב"',
  },
  {
    id: 'd-attn', label: 'Attention', sub: 'על מי כל טוקן נשען', icon: <Focus size={16} />, accent: 'indigo',
    detail: 'כל טוקן מחשב כמה כל טוקן קודם רלוונטי לו, ובונה הקשר. כמה מנגנוני קשב רצים במקביל, כל אחד תופס יחס אחר.',
    example: '"הוא" נשען על "כלב"',
  },
  {
    id: 'd-mlp', label: 'ערבוב מידע (MLP / Feed Forward)', sub: 'עיבוד פנימי נוסף', icon: <Cpu size={16} />, accent: 'purple',
    detail: 'אחרי הקשב כל טוקן עובר עיבוד פנימי נוסף שמזקק את מה שנאסף.',
    example: 'שלב "עיכול" של המידע',
  },
  {
    id: 'd-layers', label: 'שכבות Transformer', sub: 'אותו עיבוד חוזר ומעמיק', icon: <Layers size={16} />, accent: 'purple',
    detail: 'הקשב והעיבוד חוזרים בהרבה שכבות, עם ייצוב ביניהן. בכל שכבה הייצוג נעשה מופשט יותר.',
    example: 'עשרות שכבות במודלים גדולים',
  },
  {
    id: 'd-logits', label: 'ציונים גולמיים (Logits)', sub: 'ציון לכל אפשרות', icon: <BarChart3 size={16} />, accent: 'purple',
    detail: 'המודל מייצר ציון גולמי לכל טוקן אפשרי באוצר המילים. עדיין לא אחוז.',
    example: '"שמש": 8.2 · "גשם": 6.1',
  },
  {
    id: 'd-softmax', label: 'הסתברויות (Softmax)', sub: 'ציונים הופכים לאחוזים', icon: <Percent size={16} />, accent: 'amber',
    detail: 'הציונים הופכים להתפלגות שמסתכמת ל-100%.',
    example: '"שמש" 72% · "גשם" 19%',
  },
  {
    id: 'd-decode', label: 'בקרת פענוח', sub: 'כמה "להעז" בבחירה', icon: <Thermometer size={16} />, accent: 'amber',
    detail: 'פרמטרים כמו temperature ו-top-p קובעים כמה לדבוק בצפוי וכמה לאפשר גיוון.',
    example: 'נמוך → צפוי; גבוה → יצירתי',
  },
  {
    id: 'd-pick', label: 'בחירת הטוקן הבא', sub: 'טוקן אחד נבחר', icon: <GitBranch size={16} />, accent: 'rose',
    detail: 'מתוך כל החישוב נבחר טוקן אחד: המילה או חלק המילה הבא בתשובה.',
    example: 'נבחר: "שמש"',
  },
  {
    id: 'd-loop', label: 'חזרה בלולאה', sub: 'שוב, לטוקן הבא', icon: <Repeat size={16} />, accent: 'rose',
    detail: 'הטוקן הנבחר חוזר לקלט והכול רץ מחדש, עד סימן עצירה.',
    example: 'מילה אחר מילה',
  },
  {
    id: 'd-detok', label: 'פענוח לטקסט', sub: 'טוקנים → טקסט קריא', icon: <Type size={16} />, accent: 'cyan',
    detail: 'רצף הטוקנים מורכב בחזרה לטקסט עם רווחים ופיסוק, כפי שמוצג על המסך.',
    example: '["היום","צפוי","שמש"] → "היום צפוי שמש"',
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
    detail: 'בצ׳אט המטרה אחת ויחידה: לייצר תשובה טקסטואלית. אין משימה לבצע - רק שאלה לענות עליה.',
    example: '"כתוב לי סיכום קצר על תל אביב"',
  },
  {
    id: 'c2', label: 'Tokens', icon: <Scissors size={15} />,
    detail: 'אותו פירוק לטוקנים מהמפה. זה הקלט האמיתי של המנוע - גם ב-Chat וגם ב-Agent.',
    example: '"סיכום" → ["סי", "כום"]',
  },
  {
    id: 'c3', label: 'Probabilities', icon: <Percent size={15} />,
    detail: 'המנוע מחשב הסתברות לכל טוקן הבא. ב-Chat זה כל הסיפור - החישוב הזה חוזר על עצמו לכל מילה בתשובה.',
    example: 'המילה הבאה: "תל" 64% · "עיר" 21%',
  },
  {
    id: 'c4', label: 'Decision', icon: <GitBranch size={15} />,
    detail: 'בכל צעד נבחר הטוקן הבא. אין כאן כלים, אין פעולות בעולם - רק בחירת מילים, אחת אחרי השנייה.',
    example: 'נבחר: "תל"',
  },
  {
    id: 'c5', label: 'Response', icon: <Send size={15} />,
    detail: 'התוצר הסופי הוא בלוק טקסט אחד שחוזר אליך. כאן הסיפור נגמר - המנוע לא עושה שום דבר מעבר.',
    example: '"תל אביב היא עיר החוף הגדולה..."',
  },
];

// ─── preview: Agent Mode ───
// אותה הצצה, אבל ה-detail מדגיש את מה שהופך Agent לשונה: החלטות, כלים, אחריות ולולאה.
const AGENT_FLOW: TrailStep[] = [
  {
    id: 'a1', label: 'Task', icon: <Workflow size={15} />,
    detail: 'Agent לא רק עונה - הוא מזהה משימה. השאלה הראשונה היא לא "מה לכתוב" אלא "מה המטרה שצריך להשיג".',
    example: '"תזמן לי פגישה עם דנה מחר ב-10"',
  },
  {
    id: 'a2', label: 'Missing Info', icon: <AlertCircle size={15} />,
    detail: 'לפני פעולה ה-Agent בודק מה חסר לו. חוסר מידע משמעו לשאול או לברר - לא לנחש. זה ההבדל מ-Chat.',
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
    detail: 'Agent פועל בלולאה: צעד, תוצאה, החלטה הבאה - שוב ושוב, עד שהמשימה הושלמה. לא תשובה אחת, אלא מסלול.',
    example: 'נוצר אירוע → לאשר מול המשתמש',
  },
];

// ─── מה נפתח בפרקים הבאים ───
// יוצר תיאבון להמשך: כל כרטיס מצמיד תחנה במפה לשאלה שנפתח לעומק בפרק. הצבעים
// מהדהדים את צבעי התחנות במפה (cyan → blue → indigo → purple → rose) לעקביות.
const NEXT_PEEKS: { icon: React.ReactNode; chip: string; title: string; text: string }[] = [
  {
    icon: <Scissors size={18} />, chip: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-300',
    title: 'פירוק לטוקנים',
    text: 'איך משפט נחתך ליחידות עבודה - לא לאותיות, וגם לא תמיד למילים שלמות.',
  },
  {
    icon: <Network size={18} />, chip: 'border-blue-500/30 bg-blue-500/15 text-blue-300',
    title: 'ממילים למספרים',
    text: 'איך טוקן הופך לווקטור (רשימת מספרים שמייצגת משמעות), ולמה מילים קרובות יושבות קרוב.',
  },
  {
    icon: <Focus size={18} />, chip: 'border-indigo-500/30 bg-indigo-500/15 text-indigo-300',
    title: 'ההקשר משנה החלטה',
    text: 'איך Attention גורם לכל טוקן להישען על מה שלפניו, כך שאותה מילה מקבלת משמעות אחרת לפי ההקשר.',
  },
  {
    icon: <Percent size={18} />, chip: 'border-purple-500/30 bg-purple-500/15 text-purple-300',
    title: 'מציונים להסתברויות',
    text: 'איך ציונים גולמיים (Logits) הופכים לאחוזים (Softmax), ואיך נבחר מתוכם הטוקן הבא.',
  },
  {
    icon: <Workflow size={18} />, chip: 'border-rose-500/30 bg-rose-500/15 text-rose-300',
    title: 'צ׳אט מול Agent',
    text: 'במה סוֹכֵן (Agent) שבוחר כלי, בודק סיכון ומבקש אישור שונה מצ׳אט שרק מייצר טקסט.',
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
  const [deepOpen, setDeepOpen] = useState(false);

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
                  מבחוץ זה נראה כמו רגע אחד: כתבנו משפט וקיבלנו תשובה. מבפנים יש מסלול שלם: פירוק, מספרים, הקשר, דירוג ובחירה - תחנה אחר תחנה.
                </p>
                <p className="text-sm md:text-base text-cyan-300/90 font-semibold">
                  בלומדה הזו לא נסתפק במה שהמודל עונה. ננסה להבין איך הוא הגיע לשם.
                </p>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed mt-2">
                  כשמבינים את המסלול, מפסיקים לנחש מול המודל: יודעים למה הוא בטוח, מתי לחשוד בתשובה, ואיך לנסח טוב יותר. בלי נוסחאות מפחידות - רק אינטואיציה.
                </p>
              </div>
            </div>
          </motion.section>

          {/* המנטור עומד מימין לכרטיס המרכזי ומצביע אליו. רק במסכים רחבים (xl+); בצרים מוסתר.
              עטיפת-מיקום סטטית כדי שטרנספורם-המיקום לא יתנגש באנימציות הפנימיות של <Mentor>. */}
          <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="hero" line="בואו נפתח את המכסה ביחד 👀" width={185} />
          </div>
          </div>

          {/* ══════════ GUESS GATE ══════════ */}
          {/* ניחוש מהיר שמכוון את האינטואיציה הנכונה לפני שפותחים את מפת הלמידה. */}
          <motion.section
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mt-20"
          >
            <GuessRevealGate reduce={!!reduce} />
          </motion.section>

          {/* ══════════ OUTSIDE vs BEHIND ══════════ */}
          <section className="mt-20">
            <SectionHeading eyebrow="פותחים את המנוע" title="מה שהמשתמש רואה מול מה שהמנוע עושה">
              אותו קלט. אותה תשובה. אבל מתחת לפני השטח מתרחש מסלול שלם, וזה בדיוק מה שנחשוף.
            </SectionHeading>

            <div className="relative">
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
                  <EngineTrail steps={HERO_FLOW} accent="cyan" autoplay interval={1000} interactive controls />
                </div>
                <p className="text-cyan-300/70 text-xs mt-5 text-center leading-relaxed">
                  מפת למידה של התחנות המרכזיות, לא צילום מלא של כל חישוב. לחצו על כל תחנה כדי להציץ פנימה: מה קורה שם, עם דוגמה.
                </p>
              </motion.div>
            </div>
            {/* המנטור בודק עם זכוכית מגדלת - "פותחים את המנוע" (xl+, מצד שמאל) */}
            <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
              <Mentor pose="inspect" line="בואו נציץ פנימה 🔍" width={170} />
            </div>
            </div>
          </section>

          {/* ══════════ DEEP LAYER (optional) ══════════ */}
          {/* רובד עומק נפתח: מציג תחנות-משנה רבות יותר, בלי לטעון שיש מספר קבוע של פעולות. */}
          <section className="mt-12">
            <div className="text-center">
              <button
                type="button"
                onClick={() => setDeepOpen((o) => !o)}
                aria-expanded={deepOpen}
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-500/40 bg-cyan-900/15 px-6 py-3 text-sm font-bold text-cyan-200 transition-colors hover:bg-cyan-900/30"
              >
                {deepOpen ? 'סגרו את שכבת העומק' : 'פתחו את שכבת העומק'}
                <motion.span
                  aria-hidden
                  animate={{ rotate: deepOpen ? 180 : 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                  className="inline-flex"
                >
                  <ChevronDown size={18} />
                </motion.span>
              </button>
              <p className="mx-auto mt-3 max-w-xl text-xs text-slate-500 leading-relaxed">
                רוצים לראות מה מסתתר בתוך התחנות? פתחו את המנוע המלא ותציצו בתחנות-המשנה.
              </p>
            </div>

            <AnimatePresence initial={false}>
              {deepOpen && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 rounded-[2rem] border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl md:p-8">
                    <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-cyan-500/20 bg-cyan-900/10 p-3.5">
                      <Info size={15} className="mt-0.5 shrink-0 text-cyan-400/80" />
                      <p className="text-[13px] leading-relaxed text-slate-300">
                        זו מפת למידה, לא צילום מלא של כל פעולה פנימית. מאחורי כל תחנה פשוטה מסתתרים חישובים רבים. המספר המדויק של הפעולות אינו קבוע ותלוי במודל, באורך ההקשר ובאופן ההפעלה שלו.
                      </p>
                    </div>
                    <EngineTrail steps={DEEP_FLOW} accent="cyan" interactive compact />
                    <p className="mt-5 text-center text-xs leading-relaxed text-slate-500">
                      אלה רעיונות הליבה שמתרחשים בתוך התחנות. אין כאן רשימה מלאה של כל החישובים, אלא דרך לזכור מה קורה במנוע.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ══════════ LIVE TOKENIZE TASTE ══════════ */}
          {/* טעימה אינטראקטיבית: המשפט של הלומד עצמו עובר את השלב הראשון, חי וביושר. */}
          <section className="mt-20">
            <SectionHeading eyebrow="נסו בעצמכם" title="ראיתם את המפה. עכשיו תורכם.">
              לא צריך לחכות לסוף הלומדה כדי לראות את המנוע עובד. כתבו משפט משלכם, וצפו בתחנה הראשונה קורית בזמן אמת, על המילים שלכם.
            </SectionHeading>
            <div className="relative">
              <LiveTokenizeTaste reduce={!!reduce} />
              {/* המנטור מציג את הטוקן מימין לכרטיס (xl+ בלבד) */}
              <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                <Mentor pose="token" line="זה הטוקן שלכם 🧊" width={165} />
              </div>
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
            <p className="relative text-cyan-200/90 text-base md:text-lg mt-5 font-semibold max-w-3xl mx-auto leading-relaxed">
              ובלב כל התחנות האלה עומד דבר אחד: ה<span className="text-cyan-300 font-bold">וקטור</span> - רשימת מספרים שמייצגת משמעות. זו שפת האם של המודל: כל מה שקורה כאן - ההקשר, הדירוג וההסתברות - קורה על וקטורים.
            </p>
            <p className="relative text-slate-400 text-base md:text-lg mt-4">
              הלומדה הזו נועדה להפוך את המסלול הזה לגלוי.
            </p>
          </motion.section>

          {/* ══════════ CHAT vs AGENT PREVIEW ══════════ */}
          <section className="mt-20">
            <SectionHeading eyebrow="שני מצבים · הצצה מקדימה" title="Chat מול Agent - שני חלונות לאותו רעיון">
              Chat עונה על שאלה, Agent (סוֹכֵן) מבצע משימה. בהמשך נראה את שניהם לעומק; כאן הצצה מהירה - לחצו על כל שלב כדי לראות מה מייחד כל מצב.
            </SectionHeading>

            <div className="relative">
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
            {/* המנטור מציג את ההסתברויות (xl+, מצד שמאל) */}
            <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
              <Mentor pose="chart" line="ככה נראות ההסתברויות 📊" width={160} flip />
            </div>
            </div>

            {/* הבהרה: ה-Agent הוא שכבת מערכת סביב המודל, לא פעולה פנימית שלו */}
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-purple-500/25 bg-slate-900/50 p-5 backdrop-blur-xl">
              <div className="shrink-0 rounded-xl border border-purple-500/30 bg-purple-500/15 p-2">
                <Workflow className="text-purple-300" size={18} />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                המפה למעלה מסבירה איך מודל מייצר טקסט. בהמשך הלומדה נפתח גם את שכבת ה-Agent: מערכת סביב המודל שיכולה לבחור כלי, לבדוק סיכון, לבקש אישור או לעצור. ה-Agent אינו אותה פעולה פנימית של המודל, אלא שכבה נוספת מסביבו, ולכן נציג אותו כמסלול נפרד.
              </p>
            </div>
          </section>

          {/* ══════════ COURSE APPETITE ══════════ */}
          {/* תיאבון להמשך: מצמיד תחנות מהמפה לשאלות שנפתח לעומק בפרקים. */}
          <section className="mt-20">
            <SectionHeading eyebrow="המשך המסע" title="מה נפתח בפרקים הבאים">
              כל תחנה במפה נפתחת לפרק עם מנגנון חי שאפשר לשחק איתו, לא רק לקרוא עליו.
            </SectionHeading>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {NEXT_PEEKS.map((peek, i) => (
                <motion.div
                  key={peek.title}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.06 }}
                  className="group rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 backdrop-blur-xl transition-colors hover:border-cyan-500/40"
                >
                  <div className={`mb-3 inline-flex rounded-xl border p-2.5 ${peek.chip}`}>
                    {peek.icon}
                  </div>
                  <h3 className="mb-1.5 text-base font-bold text-white">{peek.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{peek.text}</p>
                </motion.div>
              ))}
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
            {/* המנטור מצביע אל כפתור ההתחלה (מושתל בכרטיס, lg+ בלבד) */}
            <div className="pointer-events-none absolute bottom-0 left-6 z-0 hidden lg:block">
              <Mentor pose="pointdown" width={140} glow={false} float={false} />
            </div>
            <h2 className="relative text-2xl md:text-4xl font-black text-white mb-4 tracking-tight">
              מוכן לפתוח את המנוע?
            </h2>
            <p className="relative text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              בפרק הראשון נתחיל מההתחלה של המסלול - נראה איך טקסט הופך לתשובה, תחנה אחר תחנה.
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
