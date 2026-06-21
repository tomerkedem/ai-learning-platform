"use client";
import React from 'react';
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft, Eye, Cpu, Keyboard, Scissors, Binary, Network,
  BarChart3, Percent, Gauge, GitBranch, Send, MessageCircle,
  Workflow, AlertCircle, Wrench, ShieldCheck, CornerDownRight, ArrowLeftRight,
} from "lucide-react";
import Link from 'next/link';
import { ChapterLayout } from "@/components/ChapterLayout";
import { EngineTrail, type TrailStep } from "@/components/ai-internals/EngineTrail";

// ─── המסלול הפנימי המלא: מקלט ועד תשובה ───
const FULL_FLOW: TrailStep[] = [
  { id: 'input', label: 'Input', sub: 'מה שכתבת בצ׳אט', icon: <Keyboard size={18} />, accent: 'cyan' },
  { id: 'tokens', label: 'Tokens', sub: 'הטקסט מתפרק לרכיבים', icon: <Scissors size={18} />, accent: 'cyan' },
  { id: 'numbers', label: 'Numbers', sub: 'כל רכיב הופך למספרים', icon: <Binary size={18} />, accent: 'blue' },
  { id: 'meaning', label: 'Meaning', sub: 'ייצוג של משמעות והקשר', icon: <Network size={18} />, accent: 'blue' },
  { id: 'scores', label: 'Scores', sub: 'דירוג של אפשרויות', icon: <BarChart3 size={18} />, accent: 'indigo' },
  { id: 'probs', label: 'Probabilities', sub: 'הסתברות לכל אפשרות', icon: <Percent size={18} />, accent: 'indigo' },
  { id: 'confidence', label: 'Confidence', sub: 'כמה המערכת בטוחה', icon: <Gauge size={18} />, accent: 'purple' },
  { id: 'decision', label: 'Decision', sub: 'הבחירה הסופית', icon: <GitBranch size={18} />, accent: 'purple' },
  { id: 'response', label: 'Response', sub: 'מה שחזר אליך', icon: <Send size={18} />, accent: 'cyan' },
];

// ─── מה שהמשתמש רואה מבחוץ ───
const OUTSIDE_FLOW: TrailStep[] = [
  { id: 'in', label: 'Input', sub: 'כתבנו משפט', icon: <Keyboard size={18} />, accent: 'cyan' },
  { id: 'out', label: 'Response', sub: 'קיבלנו תשובה', icon: <Send size={18} />, accent: 'cyan' },
];

// ─── preview: Chat Mode ───
const CHAT_FLOW: TrailStep[] = [
  { id: 'c1', label: 'Input', icon: <Keyboard size={15} /> },
  { id: 'c2', label: 'Tokens', icon: <Scissors size={15} /> },
  { id: 'c3', label: 'Probabilities', icon: <Percent size={15} /> },
  { id: 'c4', label: 'Decision', icon: <GitBranch size={15} /> },
  { id: 'c5', label: 'Response', icon: <Send size={15} /> },
];

// ─── preview: Agent Mode ───
const AGENT_FLOW: TrailStep[] = [
  { id: 'a1', label: 'Task', icon: <Workflow size={15} /> },
  { id: 'a2', label: 'Missing Info', icon: <AlertCircle size={15} /> },
  { id: 'a3', label: 'Tool Need', icon: <Wrench size={15} /> },
  { id: 'a4', label: 'Safety Check', icon: <ShieldCheck size={15} /> },
  { id: 'a5', label: 'Next Step', icon: <CornerDownRight size={15} /> },
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
                  מבחוץ זה נראה כמו רגע אחד: כתבנו משפט וקיבלנו תשובה. מבפנים זה מסלול שלם: פירוק, חישוב, דירוג, הסתברות והחלטה.
                </p>
                <p className="text-sm md:text-base text-cyan-300/90 font-semibold">
                  בקורס הזה לא נסתפק בתשובה - נפתח את הדרך שהובילה אליה.
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
              אותו קלט. אותה תשובה. אבל מתחת לפני השטח מתרחש מסלול שלם - וזה בדיוק מה שנהפוך לנראה.
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
                  <EngineTrail steps={FULL_FLOW} accent="cyan" autoplay interval={650} />
                </div>
                <p className="text-cyan-300/70 text-xs mt-5 text-center leading-relaxed">
                  תשעה שלבים חשופים - כל אחד נראה לעין, וניתן לעצירה.
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
              ייצוג של <span className="text-indigo-300 font-bold">משמעות</span>, עובר
              <span className="text-indigo-300 font-bold"> דירוג</span>, הופך
              ל<span className="text-purple-300 font-bold">הסתברויות</span>, נבדק מבחינת
              <span className="text-purple-300 font-bold"> ביטחון</span> - ורק אז מוביל
              ל<span className="text-cyan-300 font-bold">החלטה</span>.
            </p>
            <p className="relative text-slate-400 text-base md:text-lg mt-5">
              הפרויקט הזה נועד להפוך את המסלול הזה לנראה.
            </p>
          </motion.section>

          {/* ══════════ CHAT vs AGENT PREVIEW ══════════ */}
          <section className="mt-20">
            <SectionHeading eyebrow="שני מצבים · preview" title="Chat מול Agent - שני חלונות לאותו רעיון">
              בהמשך נראה את שני המצבים בפעולה. כאן רק הצצה: אותו מנוע, שני מסלולי עיבוד שונים.
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
                <EngineTrail steps={CHAT_FLOW} accent="blue" autoplay interval={750} compact />
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
                <EngineTrail steps={AGENT_FLOW} accent="purple" autoplay interval={750} compact />
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
