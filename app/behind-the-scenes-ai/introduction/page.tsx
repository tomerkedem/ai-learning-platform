"use client";
import React from 'react';
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Info, Workflow, Layers, MousePointerClick,
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
import { useT } from "@/i18n/useT";
import type {
  QuickGuessContent, RoadmapZone, RoadmapStation, CourseSystem, AgentDemo, AgentStage,
} from "./introContent";

/* ════════════════════════ מטא־דאטה מבני (לא ניתן לתרגום) ════════════════════════ */
// הטקסט מגיע מהמילון (t.behindAi.introduction) לפי מזהה; כאן נשאר רק המבנה שאינו תלוי
// שפה: מזהי ההשערות והרמז הוויזואלי שלהן, סדר האזורים, מזהה/אזור/המחשה של כל תחנה,
// מזהי המערכות עם מספרי הפרקים שבהן, וסדר שלבי הדמו. introContent.ts מספק את הטיפוסים.

const HYPOTHESIS_META = [
  { id: 'read', cue: 'read' },
  { id: 'rail', cue: 'rail' },
  { id: 'tokens', cue: 'tokens', correct: true },
  { id: 'archive', cue: 'archive' },
] as const;

const ROADMAP_ZONE_META = ['A', 'B', 'C', 'D'] as const;

const ROADMAP_STATION_META = [
  // אזור A - מהטקסט ליחידות עבודה
  { id: 'request', zone: 'A' },
  { id: 'tokenize', zone: 'A', viz: 'tokenize' },
  { id: 'ids', zone: 'A' },
  // אזור B - מטוקנים לייצוגים
  { id: 'embedding', zone: 'B', viz: 'embedding' },
  { id: 'position', zone: 'B' },
  { id: 'context', zone: 'B' },
  // אזור C - חישוב ההקשר
  { id: 'attention', zone: 'C', viz: 'attention' },
  { id: 'mix', zone: 'C' },
  { id: 'layers', zone: 'C' },
  { id: 'state', zone: 'C' },
  // אזור D - מהייצוג לתשובה
  { id: 'logits', zone: 'D' },
  { id: 'softmax', zone: 'D', viz: 'scores' },
  { id: 'decoding', zone: 'D' },
  { id: 'loop', zone: 'D', viz: 'loop' },
] as const;

const SYSTEM_META = [
  { id: 'outside', chapters: ['1', '2', '3', '4'] },
  { id: 'representations', chapters: ['5', '6', '7'] },
  { id: 'context', chapters: ['8', '9'] },
  { id: 'agent', chapters: ['10', '11', '12', '13'] },
  { id: 'synthesis', chapters: ['14', '15', '16'] },
] as const;

const AGENT_STAGE_META = ['task', 'tool', 'risk', 'act', 'answer'] as const;
const CHAT_STAGE_META = ['in', 'model', 'out'] as const;

const CTA_HREF = '/behind-the-scenes-ai/chapter-1';

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
  const { t, dir } = useT();
  const isRtl = dir === 'rtl';
  const intro = t.behindAi.introduction;

  // מצב המתג Chat/Agent מורם לכאן כדי שכל הקופי של הכרטיס יתחלף יחד עם התצוגה החיה.
  const [agentMode, setAgentMode] = React.useState<'chat' | 'agent'>('chat');
  const agentCard = intro.agent.card[agentMode];

  // ── הרכבת תוכן הרכיבים: טקסט מהמילון לפי מזהה, ממוזג על המטא־דאטה המבני ──
  const quickGuess: QuickGuessContent = {
    eyebrow: intro.quickGuess.eyebrow,
    question: intro.quickGuess.question,
    hint: intro.quickGuess.hint,
    correctLead: intro.quickGuess.correctLead,
    correctBody: intro.quickGuess.correctBody,
    correctBridge: intro.quickGuess.correctBridge,
    wrongLead: intro.quickGuess.wrongLead,
    retry: intro.quickGuess.retry,
    revealCorrect: intro.quickGuess.revealCorrect,
    hypotheses: HYPOTHESIS_META.map((m) => ({
      id: m.id,
      cue: m.cue,
      correct: 'correct' in m ? m.correct : undefined,
      ...intro.quickGuess.hypotheses[m.id],
    })),
  };

  const roadmapZones: RoadmapZone[] = ROADMAP_ZONE_META.map((id) => ({
    id,
    ...intro.roadmap.zones[id],
  }));

  const roadmapStations: RoadmapStation[] = ROADMAP_STATION_META.map((m) => ({
    id: m.id,
    zone: m.zone,
    ...('viz' in m ? { viz: m.viz } : {}),
    ...intro.roadmap.stations[m.id],
  }));

  const courseSystems: CourseSystem[] = SYSTEM_META.map((m) => {
    const sx = intro.systems.items[m.id];
    return {
      id: m.id,
      title: sx.title,
      range: sx.range,
      teaser: sx.teaser,
      purpose: sx.purpose,
      stationChips: [...sx.stationChips],
      chapters: m.chapters.map((n, i) => ({ n, label: sx.chapters[i] })),
    };
  });

  const buildStages = (
    ids: readonly string[],
    src: Record<string, Omit<AgentStage, 'id'>>,
  ): AgentStage[] => ids.map((id) => ({ id, ...src[id] }));

  const agentDemo = {
    ...intro.agent.demo,
    agentStages: buildStages(AGENT_STAGE_META, intro.agent.demo.agentStages),
    chatStages: buildStages(CHAT_STAGE_META, intro.agent.demo.chatStages),
  } as AgentDemo;

  return (
    <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={0}>
      <div className="px-4 pb-24" style={{ marginTop: '160px' }} dir={dir}>
        <div className="max-w-5xl mx-auto">

          {/* ══════════ 1 · OUTSIDE VIEW ══════════ */}
          {/* מבחוץ נראה כמו שני שלבים: בקשה ותשובה. השאלה "מה קרה באמצע" נשארת פתוחה. */}
          <div className="relative">
            <div className="text-center md:text-start mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-cyan-500/30 mb-3">
                <span className="relative flex h-2 w-2">
                  {!reduce && <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />}
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span className="text-cyan-300 text-xs font-bold tracking-wide">{intro.hero.badge}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3">
                {intro.hero.titleLead}{' '}
                <span className={`${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent`}>
                  {intro.hero.titleAccent}
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed">{intro.hero.intro}</p>
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <EngineReveal
                reduce={!!reduce}
                dir={dir}
                promptRole={intro.chat.promptRole}
                prompt={intro.chat.prompt}
                answerRole={intro.chat.answerRole}
                answer={intro.chat.answer}
                outsideLine={intro.chat.outsideLine}
                curiosityLine={intro.chat.curiosityLine}
                inputPlaceholder={intro.chat.inputPlaceholder}
              />
            </motion.div>

            {/* המנטור עומד בצד הקריאה הטבעי של הכרטיס המרכזי (xl+ בלבד). */}
            {/* ב-LTR הוא יושב מימין לכרטיס, ולכן מהופך אופקית כדי לפנות אל התוכן ולא ממנו. */}
            <div className={`absolute top-44 ${isRtl ? 'left-full ml-3 2xl:ml-6' : 'right-full mr-3 2xl:mr-6'} z-20 hidden xl:block pointer-events-none`}>
              <Mentor pose="hero" line={intro.mentor.hero} width={180} flip={!isRtl} />
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
            <HypothesisGuess reduce={!!reduce} content={quickGuess} dir={dir} />
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
              dir={dir}
              lead={intro.chat.gateLead}
              revealLabel={intro.chat.revealLabel}
              closeLabel={intro.chat.closeLabel}
              revealedLabel={intro.chat.revealedLabel}
              bridge={intro.chat.bridge}
              downCue={intro.chat.downCue}
              teaser={intro.engineTeaser}
            />
          </motion.section>

          {/* ══════════ 4 · MAIN ROADMAP (ALWAYS VISIBLE) ══════════ */}
          {/* מפת 14 התחנות. גלויה תמיד, עם תחנת "פירוק לטוקנים" פתוחה כברירת מחדל. */}
          <section className="mt-10">
            <SectionHeading eyebrow={intro.roadmapHeading.eyebrow} title={intro.roadmapHeading.title}>
              {intro.roadmapHeading.subtitle}
            </SectionHeading>

            {/* רמז עדין שהכרטיסים נפתחים */}
            <div className="mb-8 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-900/15 px-3.5 py-1.5 text-xs font-bold text-cyan-200">
                <MousePointerClick size={13} aria-hidden />
                {intro.roadmapHeading.hint}
              </span>
            </div>

            <div className="relative">
              <IntroRoadmap zones={roadmapZones} stations={roadmapStations} stationDetailLabels={intro.stationDetailLabels} reduce={!!reduce} dir={dir} defaultOpenId="tokenize" />
              {/* המנטור מלווה את המפה (xl+), בצד הקריאה הטבעי של הכיוון הפעיל */}
              {/* ב-LTR הוא יושב מימין למפה, ולכן מהופך אופקית כדי לפנות אל התוכן ולא ממנו. */}
              <div className={`absolute top-6 ${isRtl ? 'left-full ml-3 2xl:ml-6' : 'right-full mr-3 2xl:mr-6'} z-20 hidden xl:block pointer-events-none`}>
                <Mentor pose="mapNavigator" line={intro.mentor.roadmap} width={170} flip={!isRtl} />
              </div>
            </div>

            {/* ── 7 · TRUTH NOTE (near the roadmap) ── */}
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-cyan-500/20 bg-cyan-900/10 p-4 backdrop-blur-xl">
              <Info size={16} className="mt-0.5 shrink-0 text-cyan-400/80" />
              <p className="text-[13px] leading-relaxed text-slate-300 md:text-sm">{intro.truthNote}</p>
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
                  <AgentLoop reduce={!!reduce} demo={agentDemo} mode={agentMode} onModeChange={setAgentMode} dir={dir} />
                </div>

                <p className="mt-6 text-base font-bold leading-relaxed text-purple-100">{agentCard.closing}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{agentCard.note}</p>
              </div>
            </div>
          </motion.section>

          {/* ══════════ 9 · COURSE SYSTEMS (16 chapters, 5 systems) ══════════ */}
          {/* חמש מערכות שנפתחות, לא חמישה פרקים. כל שער מגלה את טווח הפרקים שבתוכו. */}
          <section className="mt-20">
            <SectionHeading eyebrow={intro.systems.heading.eyebrow} title={intro.systems.heading.title} />

            {/* באנר שמבהיר: 16 פרקים, 5 מערכות */}
            <div className="mb-3 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-900/20 px-4 py-2 text-sm font-black text-cyan-100">
                <Layers size={15} aria-hidden /> {intro.systems.heading.summary}
              </span>
            </div>
            <p className="mx-auto mb-8 max-w-2xl text-center text-base leading-relaxed text-slate-400 md:text-lg">
              {intro.systems.heading.subtitle}
            </p>

            <CourseSystems systems={courseSystems} labels={intro.systems.labels} reduce={!!reduce} dir={dir} />
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
              {intro.cta.eyebrow}
            </span>
            <h2 className="relative text-2xl md:text-4xl font-black text-white mb-4 tracking-tight">
              {intro.cta.title}
            </h2>
            <p className="relative text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-8 lg:mb-40 leading-relaxed">
              {intro.cta.body}
            </p>
            {/* עוטף את הכפתור כדי שהמנטור יעמוד בדיוק מעליו והאצבע תנחת עליו (lg+ בלבד) */}
            <div className="relative inline-block">
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 -translate-x-1/2 translate-y-[2%] hidden lg:block">
                <Mentor pose="pointdown" width={132} glow={false} float={false} />
              </div>
              <Link
                href={CTA_HREF}
                className="relative inline-flex items-center gap-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-4 px-10 rounded-2xl transition-all shadow-[0_8px_30px_-6px_rgba(34,211,238,0.6)] hover:shadow-[0_8px_40px_-4px_rgba(34,211,238,0.8)] active:scale-95 no-underline text-lg"
              >
                {intro.cta.button}
                {isRtl ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
              </Link>
            </div>
          </motion.section>

        </div>
      </div>
    </ChapterLayout>
  );
}
