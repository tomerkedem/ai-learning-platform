"use client";
import React from 'react';
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft, Info, Workflow, Layers, MousePointerClick,
} from "lucide-react";
import Link from 'next/link';
import { ChapterLayout } from "@/components/ChapterLayout";
import { IntroRoadmap } from "@/components/ai-internals/IntroRoadmap";
import { EngineReveal } from "@/components/ai-internals/EngineReveal";
import { EngineGate } from "@/components/ai-internals/EngineGate";
import { HypothesisGuess } from "@/components/ai-internals/HypothesisGuess";
import { CourseSystems } from "@/components/ai-internals/CourseSystems";
import { AgentLoop } from "@/components/ai-internals/AgentLoop";
import { Mentor } from "@/components/ai-internals/Mentor";
import {
  HERO, HERO_CHAT, ENGINE_TEASER, QUICK_GUESS, ROADMAP_HEADING, ROADMAP_ZONES,
  ROADMAP_STATIONS, TRUTH_NOTE, AGENT_CARD, AGENT_DEMO, SYSTEMS_HEADING, COURSE_SYSTEMS, SYSTEM_LABELS, CTA, MENTOR_LINES,
} from "./introContent";

// כותרת-מקטע אחידה
function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="text-center mb-6">
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
  // מצב המתג Chat/Agent מורם לכאן כדי שכל הקופי של הכרטיס יתחלף יחד עם התצוגה החיה.
  const [agentMode, setAgentMode] = React.useState<'chat' | 'agent'>('chat');
  const agentCard = AGENT_CARD[agentMode];

  return (
    <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={0} lang="he">
      <div className="px-4 pb-24" style={{ marginTop: '160px' }} dir="rtl">
        <div className="max-w-5xl mx-auto">

          {/* ══════════ 1 · OUTSIDE VIEW ══════════ */}
          {/* מבחוץ נראה כמו שני שלבים: בקשה ותשובה. השאלה "מה קרה באמצע" נשארת פתוחה. */}
          <div className="relative">
            <div className="text-center md:text-right mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-cyan-500/30 mb-3">
                <span className="relative flex h-2 w-2">
                  {!reduce && <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />}
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span className="text-cyan-300 text-xs font-bold tracking-wide">{HERO.badge}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3">
                {HERO.titleLead}{' '}
                <span className="bg-gradient-to-l from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  {HERO.titleAccent}
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed">{HERO.intro}</p>
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <EngineReveal
                reduce={!!reduce}
                promptRole={HERO_CHAT.promptRole}
                prompt={HERO_CHAT.prompt}
                answerRole={HERO_CHAT.answerRole}
                answer={HERO_CHAT.answer}
                outsideLine={HERO_CHAT.outsideLine}
                curiosityLine={HERO_CHAT.curiosityLine}
                inputPlaceholder={HERO_CHAT.inputPlaceholder}
              />
            </motion.div>

            {/* המנטור עומד מימין לכרטיס המרכזי (xl+ בלבד). */}
            <div className="absolute top-44 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
              <Mentor pose="hero" line={MENTOR_LINES.hero} width={180} />
            </div>
          </div>

          {/* ══════════ 2 · QUICK GUESS: FOUR COMPETING HYPOTHESES ══════════ */}
          {/* בחירת מודל חשיבה (לא שאלון), לפני שהשער חושף את התשובה. */}
          <motion.section
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mt-20"
          >
            <HypothesisGuess reduce={!!reduce} content={QUICK_GUESS} />
          </motion.section>

          {/* ══════════ 3 · REVEAL GATE ══════════ */}
          {/* אחרי הניחוש: פותחים את מה שקרה באמצע, ומובילים ישירות אל המפה שמתחת. */}
          <motion.section
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <EngineGate
              reduce={!!reduce}
              lead={HERO_CHAT.gateLead}
              revealLabel={HERO_CHAT.revealLabel}
              closeLabel={HERO_CHAT.closeLabel}
              revealedLabel={HERO_CHAT.revealedLabel}
              bridge={HERO_CHAT.bridge}
              downCue={HERO_CHAT.downCue}
              teaser={ENGINE_TEASER}
            />
          </motion.section>

          {/* ══════════ 4 · MAIN ROADMAP (ALWAYS VISIBLE) ══════════ */}
          {/* מפת 14 התחנות. גלויה תמיד, עם תחנת "פירוק לטוקנים" פתוחה כברירת מחדל. */}
          <section className="mt-10">
            <SectionHeading eyebrow={ROADMAP_HEADING.eyebrow} title={ROADMAP_HEADING.title}>
              {ROADMAP_HEADING.subtitle}
            </SectionHeading>

            {/* רמז עדין שהכרטיסים נפתחים */}
            <div className="mb-8 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-900/15 px-3.5 py-1.5 text-xs font-bold text-cyan-200">
                <MousePointerClick size={13} aria-hidden />
                {ROADMAP_HEADING.hint}
              </span>
            </div>

            <div className="relative">
              <IntroRoadmap zones={ROADMAP_ZONES} stations={ROADMAP_STATIONS} reduce={!!reduce} defaultOpenId="tokenize" />
              {/* המנטור מלווה את המפה (xl+, מצד ימין - צד הקריאה הטבעי ב-RTL) */}
              <div className="absolute top-6 left-full ml-3 2xl:ml-6 z-20 hidden xl:block pointer-events-none">
                <Mentor pose="mapNavigator" line={MENTOR_LINES.roadmap} width={170} />
              </div>
            </div>

            {/* ── 7 · TRUTH NOTE (near the roadmap) ── */}
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-cyan-500/20 bg-cyan-900/10 p-4 backdrop-blur-xl">
              <Info size={16} className="mt-0.5 shrink-0 text-cyan-400/80" />
              <p className="text-[13px] leading-relaxed text-slate-300 md:text-sm">{TRUTH_NOTE}</p>
            </div>
          </section>

          {/* ══════════ 8 · AGENT SEPARATION ══════════ */}
          {/* ה-Agent הוא שכבת מערכת סביב המודל, לא פעולה פנימית של הטרנספורמר. */}
          <motion.section
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mt-20 relative overflow-hidden rounded-[2rem] border border-purple-500/30 bg-slate-900/60 p-6 backdrop-blur-xl md:p-8"
          >
            <div className="absolute -top-16 -left-10 w-56 h-56 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative flex flex-col gap-5 md:flex-row md:items-start">
              <div className="shrink-0 rounded-2xl border border-purple-500/30 bg-purple-500/15 p-3">
                <Workflow className="text-purple-300" size={24} />
              </div>
              <div className="min-w-0">
                <span className="text-purple-300/80 text-[11px] font-bold uppercase tracking-[0.25em] block mb-2">
                  {agentCard.eyebrow}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white mb-2">{agentCard.title}</h2>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">{agentCard.body}</p>

                {/* לולאת הבקרה החיה: Agent כשכבה סביב המודל, לא תחנה פנימית */}
                <div className="mt-6">
                  <AgentLoop reduce={!!reduce} demo={AGENT_DEMO} mode={agentMode} onModeChange={setAgentMode} />
                </div>

                <p className="mt-6 text-base font-bold leading-relaxed text-purple-100">{agentCard.closing}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{agentCard.note}</p>
              </div>
            </div>
          </motion.section>

          {/* ══════════ 9 · COURSE SYSTEMS (16 chapters, 5 systems) ══════════ */}
          {/* חמש מערכות שנפתחות, לא חמישה פרקים. כל שער מגלה את טווח הפרקים שבתוכו. */}
          <section className="mt-20">
            <SectionHeading eyebrow={SYSTEMS_HEADING.eyebrow} title={SYSTEMS_HEADING.title} />

            {/* באנר שמבהיר: 16 פרקים, 5 מערכות */}
            <div className="mb-3 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-900/20 px-4 py-2 text-sm font-black text-cyan-100">
                <Layers size={15} aria-hidden /> {SYSTEMS_HEADING.summary}
              </span>
            </div>
            <p className="mx-auto mb-8 max-w-2xl text-center text-base leading-relaxed text-slate-400 md:text-lg">
              {SYSTEMS_HEADING.subtitle}
            </p>

            <CourseSystems systems={COURSE_SYSTEMS} labels={SYSTEM_LABELS} reduce={!!reduce} />
          </section>

          {/* ══════════ 10 · CTA TO CHAPTER 1 ══════════ */}
          <motion.section
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mt-20 relative overflow-hidden rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-900/60 p-10 md:p-14 text-center shadow-2xl"
          >
            <div className="absolute -top-20 right-1/2 translate-x-1/2 w-80 h-40 bg-cyan-500/15 blur-[80px] rounded-full pointer-events-none" />
            <span className="relative text-cyan-400 text-[11px] font-bold uppercase tracking-[0.25em] block mb-3">
              {CTA.eyebrow}
            </span>
            <h2 className="relative text-2xl md:text-4xl font-black text-white mb-4 tracking-tight">
              {CTA.title}
            </h2>
            <p className="relative text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-8 lg:mb-40 leading-relaxed">
              {CTA.body}
            </p>
            {/* עוטף את הכפתור כדי שהמנטור יעמוד בדיוק מעליו והאצבע תנחת עליו (lg+ בלבד) */}
            <div className="relative inline-block">
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 -translate-x-1/2 translate-y-[2%] hidden lg:block">
                <Mentor pose="pointdown" width={132} glow={false} float={false} />
              </div>
              <Link
                href={CTA.href}
                className="relative inline-flex items-center gap-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-4 px-10 rounded-2xl transition-all shadow-[0_8px_30px_-6px_rgba(34,211,238,0.6)] hover:shadow-[0_8px_40px_-4px_rgba(34,211,238,0.8)] active:scale-95 no-underline text-lg"
              >
                {CTA.button}
                <ChevronLeft size={22} />
              </Link>
            </div>
          </motion.section>

        </div>
      </div>
    </ChapterLayout>
  );
}
