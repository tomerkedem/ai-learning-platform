"use client";
import React from 'react';
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Info, Layers, MousePointerClick,
} from "lucide-react";
import Link from 'next/link';
import { ChapterLayout, FocusModeContext } from "@/components/ChapterLayout";
import { IntroRoadmap } from "@/components/ai-internals/IntroRoadmap";
import { VizSoundToggle } from "@/components/ai-internals/IntroStationViz";
import { ExpandableLab } from "@/components/ai-internals/ExpandableLab";
import { EngineReveal } from "@/components/ai-internals/EngineReveal";
import { HypothesisGuess } from "@/components/ai-internals/HypothesisGuess";
import { NextTokenGuess } from "@/components/ai-internals/NextTokenGuess";
import { CourseSystems } from "@/components/ai-internals/CourseSystems";
import { AgentLoop } from "@/components/ai-internals/AgentLoop";
import { Mentor } from "@/components/ai-internals/Mentor";
import { ReadAloudControls, type ReadAloudMode } from "@/components/ai-internals/ReadAloudControls";
import { FloatingReadAloud } from "@/components/ai-internals/FloatingReadAloud";
import type { ReadAloudSegment } from "@/components/ai-internals/useReadAloud";
import { useT } from "@/i18n/useT";
import type { Locale } from "@/i18n/config";
import type {
  QuickGuessContent, RoadmapZone, RoadmapStation, CourseSystem, AgentDemo, AgentStage, NextTokenContent,
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

// לכל תחנה יש סצנה חיה שנפתחת עם הכרטיס (IntroStationViz).
const ROADMAP_STATION_META = [
  // אזור A - מהטקסט ליחידות עבודה
  { id: 'request', zone: 'A', viz: 'request' },
  { id: 'tokenize', zone: 'A', viz: 'tokenize' },
  { id: 'ids', zone: 'A', viz: 'ids' },
  // אזור B - מטוקנים לייצוגים
  { id: 'embedding', zone: 'B', viz: 'embedding' },
  { id: 'position', zone: 'B', viz: 'position' },
  { id: 'context', zone: 'B', viz: 'context' },
  // אזור C - חישוב ההקשר
  { id: 'attention', zone: 'C', viz: 'attention' },
  { id: 'mix', zone: 'C', viz: 'mix' },
  { id: 'layers', zone: 'C', viz: 'layers' },
  { id: 'state', zone: 'C', viz: 'state' },
  // אזור D - מהייצוג לתשובה
  { id: 'logits', zone: 'D', viz: 'logits' },
  { id: 'softmax', zone: 'D', viz: 'scores' },
  { id: 'decoding', zone: 'D', viz: 'decoding' },
  { id: 'loop', zone: 'D', viz: 'loop' },
] as const;

const SYSTEM_META = [
  { id: 'outside', chapters: ['1', '2'] },
  { id: 'representations', chapters: ['3', '4', '5', '6', '7'] },
  { id: 'generation', chapters: ['8', '9', '10'] },
  { id: 'reliability', chapters: ['11', '12', '13'] },
  { id: 'learning', chapters: ['14', '15', '16'] },
  { id: 'agent', chapters: ['17', '18', '19'] },
] as const;

const AGENT_STAGE_META = ['in', 'task', 'tool', 'risk', 'act', 'answer'] as const;
const CHAT_STAGE_META = ['in', 'model', 'out'] as const;

// בונוס ניחוש הטוקן הבא: ההסתברויות (מבני, זהה לכל השפות). הסדר תואם למילות הטוקן
// במילון (introduction.nextToken.rounds[i].tokens) לפי אינדקס. otherP = שאר המסה.
const NEXT_TOKEN_META = [
  { probs: [37, 24, 15, 9, 6], otherP: 9 },
  { probs: [51, 17, 9, 7, 3], otherP: 13 },
] as const;

const CTA_HREF = '/behind-the-scenes-ai/chapter-1';

// מיפוי locale -> תג שפה BCP-47 להקראה (Web Speech API). מבני, לא ניתן לתרגום.
// ערבית נשארת בסיסית (ar) כי זמינות קולות אזוריים לא עקבית בין דפדפנים.
const LOCALE_SPEECH_LANG: Record<Locale, string> = {
  he: 'he-IL',
  en: 'en-US',
  es: 'es-ES',
  ru: 'ru-RU',
  ar: 'ar',
  ja: 'ja-JP',
};

// סדר 14 התחנות בפס ההקראה, זהה לסדר המפה (ROADMAP_STATION_META).
const READALOUD_STATION_IDS = ROADMAP_STATION_META.map((m) => m.id);

// מנטור ההירו: הגודל תלוי במצב המיקוד. הרכיב חייב לשבת בתוך ה-children של
// ChapterLayout (כלומר בתוך ה-Provider) כדי לקרוא את המצב החי. במיקוד פי 2.7
// (486px, בועה 30px), מחוץ למיקוד פי 2 (360px, בועה 22px).
function HeroMentor({ line, flip }: { line: string; flip: boolean }) {
  const isFocusMode = React.useContext(FocusModeContext);
  return (
    <Mentor
      pose="hero"
      line={line}
      flip={flip}
      width={isFocusMode ? 486 : 360}
      bubbleWidthClass="max-w-md"
      bubbleTextClass={isFocusMode ? 'text-[30px] leading-tight' : 'text-[22px] leading-tight'}
    />
  );
}

// כותרת-מקטע אחידה
function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="text-center mb-6">
      <span className="text-cyan-400 text-sm md:text-base font-bold uppercase tracking-[0.2em] block mb-3">
        {eyebrow}
      </span>
      <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-3">{title}</h2>
      {children && <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">{children}</p>}
    </div>
  );
}

export default function BehindTheScenesIntroPage() {
  const reduce = useReducedMotion();
  const { t, dir, locale } = useT();
  const isRtl = dir === 'rtl';
  const intro = t.behindAi.introduction;

  // ── פסי ההקראה לפי מצב היקף (scope). רק טקסט למידה משמעותי, מאותם מפתחות מילון
  // שכבר מרונדרים, בלי לשכפל קופי. לא נכללים כפתורים, ניווט, מונים, תוויות, באדג׳ים,
  // צ׳יפים, פרטי-תחנה נסתרים, משפטי מנטור דקורטיביים, או מכונת הדמו של ה-Agent.
  const sTitle: ReadAloudSegment = {
    id: 'title', label: intro.hero.titleLead,
    text: `${intro.hero.titleLead} ${intro.hero.titleAccent}. ${intro.hero.intro}`,
  };
  const sOutside: ReadAloudSegment = {
    id: 'outside', label: intro.chat.outsideLine,
    text: `${intro.chat.outsideLine} ${intro.chat.curiosityLine}`,
  };
  const sRoadmapHeading: ReadAloudSegment = {
    id: 'roadmap-heading', label: intro.roadmapHeading.title,
    text: `${intro.roadmapHeading.title}. ${intro.roadmapHeading.subtitle}`,
  };
  const sRoadmapSubtitle: ReadAloudSegment = {
    id: 'roadmap-subtitle', label: intro.roadmapHeading.title,
    text: intro.roadmapHeading.subtitle,
  };
  const sStations: ReadAloudSegment[] = READALOUD_STATION_IDS.map((id) => {
    const s = intro.roadmap.stations[id];
    return { id: `station-${id}`, label: s.title, text: `${s.title}. ${s.explanation}` };
  });
  const sTruth: ReadAloudSegment = { id: 'truth', label: intro.truthNote, text: intro.truthNote };
  const sCta: ReadAloudSegment = {
    id: 'cta', label: intro.cta.title,
    text: `${intro.cta.title}. ${intro.cta.body}`,
  };

  // תוספות למצב Full בלבד (טקסט למידה משמעותי, ללא רכיבי UI).
  const sQuickGuessQ: ReadAloudSegment = {
    id: 'qg-question', label: intro.quickGuess.question, text: intro.quickGuess.question,
  };
  const sHypotheses: ReadAloudSegment[] = HYPOTHESIS_META.map((m) => {
    const h = intro.quickGuess.hypotheses[m.id];
    return { id: `hyp-${m.id}`, label: h.title, text: h.concept };
  });
  const sGate: ReadAloudSegment = {
    id: 'gate', label: intro.chat.gateLead,
    text: `${intro.chat.gateLead} ${intro.chat.bridge}`,
  };
  const sAgent: ReadAloudSegment = {
    id: 'agent', label: intro.agent.card.agent.title,
    text: `${intro.agent.card.agent.title}. ${intro.agent.card.agent.body} ${intro.agent.card.agent.closing}`,
  };
  const sSystems: ReadAloudSegment[] = SYSTEM_META.map((m) => {
    const sx = intro.systems.items[m.id];
    return { id: `system-${m.id}`, label: sx.title, text: sx.purpose };
  });

  const readAloudByMode: Record<ReadAloudMode, ReadAloudSegment[]> = {
    short: [sTitle, sOutside, sRoadmapSubtitle, sCta],
    regular: [sTitle, sOutside, sRoadmapHeading, ...sStations, sTruth, sCta],
    full: [
      sTitle, sOutside, sQuickGuessQ, ...sHypotheses, sGate, sAgent,
      sRoadmapHeading, ...sStations, sTruth, ...sSystems, sCta,
    ],
  };

  // מצב המתג Chat/Agent מורם לכאן כדי שכל הקופי של הכרטיס יתחלף יחד עם התצוגה החיה.
  const [agentMode, setAgentMode] = React.useState<'chat' | 'agent'>('chat');
  const agentCard = intro.agent.card[agentMode];

  // ── הרכבת תוכן הרכיבים: טקסט מהמילון לפי מזהה, ממוזג על המטא־דאטה המבני ──
  const quickGuess: QuickGuessContent = {
    eyebrow: intro.quickGuess.eyebrow,
    question: intro.quickGuess.question,
    hint: intro.quickGuess.hint,
    correctTitle: intro.quickGuess.correctTitle,
    correctLead: intro.quickGuess.correctLead,
    correctBody: intro.quickGuess.correctBody,
    correctBridge: intro.quickGuess.correctBridge,
    wrongLead: intro.quickGuess.wrongLead,
    retry: intro.quickGuess.retry,
    revealCorrect: intro.quickGuess.revealCorrect,
    bonusStart: intro.quickGuess.bonusStart,
    hypotheses: HYPOTHESIS_META.map((m) => ({
      id: m.id,
      cue: m.cue,
      correct: 'correct' in m ? m.correct : undefined,
      ...intro.quickGuess.hypotheses[m.id],
    })),
  };

  // בונוס ניחוש הטוקן הבא: מיזוג המחרוזות מהמילון עם ההסתברויות המבניות (לפי אינדקס).
  const nextTokenContent: NextTokenContent = {
    ...intro.nextToken,
    rounds: intro.nextToken.rounds.map((r, i) => ({
      context: r.context,
      prefix: r.prefix,
      insight: r.insight,
      otherP: NEXT_TOKEN_META[i].otherP,
      options: r.tokens.map((token, j) => ({ token, p: NEXT_TOKEN_META[i].probs[j] })),
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
      <div className="px-4 pb-24 mt-24 sm:mt-32 md:mt-40" dir={dir}>
        <div className="max-w-5xl mx-auto">

          {/* ══════════ 1 · OUTSIDE VIEW ══════════ */}
          {/* מבחוץ נראה כמו שני שלבים: בקשה ותשובה. השאלה "מה קרה באמצע" נשארת פתוחה. */}
          <div className="relative">
            {/* ב-lg+ דוק ההאזנה מעוגן בפינה העליונה, מעל הכותרת. הכותרת וה-lede מתפזרים
                לרוחב מלא ויושבים מתחתיו (הבאדג' שמעל הכותרת מפנה אותם מתחת לדוק). */}
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

              {/* דוק האזנה מודרכת צף: מצמיד לקצה החיצוני (תלוי-כיוון) ונשאר נגיש תוך כדי
                  גלילה; במובייל מתכווץ לאייקון בלבד. ממומש דרך portal ל-body (FloatingReadAloud). */}
              <FloatingReadAloud dir={dir}>
                <ReadAloudControls
                  segmentsByMode={readAloudByMode}
                  lang={LOCALE_SPEECH_LANG[locale]}
                  locale={locale}
                  dir={dir}
                  labels={intro.readAloud}
                  reduce={!!reduce}
                  compact
                />
              </FloatingReadAloud>
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
              <HeroMentor line={intro.mentor.hero} flip={!isRtl} />
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
            <ExpandableLab title={intro.quickGuess.question}>
              <HypothesisGuess
                reduce={!!reduce}
                content={quickGuess}
                dir={dir}
                bonus={<NextTokenGuess content={nextTokenContent} reduce={!!reduce} dir={dir} />}
              />
            </ExpandableLab>
          </motion.section>

          {/* ══════════ 3 · CHAT vs AGENT (full card, before the map) ══════════ */}
          {/* מוקדם בכוונה: מיד אחרי הניחוש, ניגוד חזק בין Chat ל-Agent לפני שנכנסים */}
          {/* לפירוק המודל במפה. הקופי כאן קדימה-מבט (בלי "עד עכשיו ראינו"). */}
          {/* הכרטיס נשען כולו על AgentLoop: הכותרת/eyebrow/body עוברים פנימה לקונסולה
              קומפקטית, וה-closing/note נוחתים ב-slot החי. גבול הכרטיס וההילה מתחלפים
              לפי המצב (תכלת ל-Chat, סגול ל-Agent), כך שכל הכרטיס נושם עם הסצנה. */}
          {/* משפט המסגור כשורת-פתיח מוקפדת: קו-מבטא גרדיאנט (תכלת->סגול, רמז ל-Chat->Agent),
              טקסט גדול ומודגש, ושמות המצבים צבועים בגוון הסצנה שלהם. */}
          <div className="mx-auto mb-7 mt-20 max-w-3xl text-center">
            <div className="mx-auto mb-4 h-px w-20 bg-gradient-to-r from-cyan-400/70 via-slate-500/30 to-purple-400/70" />
            <p className="text-lg font-bold leading-relaxed tracking-tight text-slate-100 md:text-2xl">
              {intro.agent.intro.split(/(Chat|Agent)/g).map((part, i) =>
                part === 'Chat' ? <span key={i} className="font-black text-cyan-300">Chat</span>
                  : part === 'Agent' ? <span key={i} className="font-black text-purple-300">Agent</span>
                    : <React.Fragment key={i}>{part}</React.Fragment>,
              )}
            </p>
          </div>
          {/* ExpandableLab עוטף את הכרטיס כולו (כולל כל רכיביו) ומאפשר הגדלה למסך מלא.
              הכרטיס מוגבל ל-max-w-4xl כדי שגם בתצוגה הרגילה וגם במסך מלא הפרופורציות
              יישארו נעימות (בלי כותרת שנמתחת יתר על המידה). */}
          <motion.section
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-5 max-w-5xl"
          >
            <ExpandableLab title={agentCard.title}>
              <div className={`relative overflow-hidden rounded-[2rem] border bg-slate-900/60 p-4 backdrop-blur-xl md:p-6 transition-colors ${agentMode === 'agent' ? 'border-purple-500/30' : 'border-cyan-500/30'}`}>
                <div className={`absolute -top-16 -left-10 w-56 h-56 blur-[80px] rounded-full pointer-events-none transition-colors ${agentMode === 'agent' ? 'bg-purple-500/10' : 'bg-cyan-500/10'}`} />
                <div className="relative">
                  <AgentLoop
                    reduce={!!reduce}
                    demo={agentDemo}
                    mode={agentMode}
                    onModeChange={setAgentMode}
                    dir={dir}
                    eyebrow={agentCard.eyebrow}
                    title={agentCard.title}
                    body={agentCard.body}
                    closing={agentCard.closing}
                  />
                </div>
              </div>
            </ExpandableLab>
          </motion.section>

          {/* מעבר קצר אל המפה: פותחים את הקופסה האמצעית (המודל) */}
          <p className="mt-8 text-center text-base font-bold leading-relaxed text-slate-200 md:text-lg">
            {intro.agent.transition}
          </p>

          {/* ══════════ 4 · MAIN ROADMAP (ALWAYS VISIBLE) ══════════ */}
          {/* מפת 14 התחנות. גלויה תמיד, עם תחנת "פירוק לטוקנים" פתוחה כברירת מחדל.
              הניחוש זורם ישירות אל המפה: כותרת המפה ("פותחים את המנוע") נושאת את
              רגע המעבר, בלי שער-טעימה נפרד שכפל את אזורי המפה שממש למטה. */}
          <section className="mt-20">
            <SectionHeading eyebrow={intro.roadmapHeading.eyebrow} title={intro.roadmapHeading.title}>
              {intro.roadmapHeading.subtitle}
            </SectionHeading>

            {/* רמז עדין שהכרטיסים נפתחים + מתג השתקה גלובלי אחד לכל הסצנות */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex min-h-[32px] items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-900/15 px-3.5 py-1.5 text-xs font-bold text-cyan-200">
                <MousePointerClick size={13} aria-hidden />
                {intro.roadmapHeading.hint}
              </span>
              <VizSoundToggle />
            </div>

            {/* המנטור-מדריך גולש אל התחנה הפתוחה; הוא מרונדר בתוך IntroRoadmap כדי
                שתהיה לו גישה ישירה לכרטיס הפתוח ולמיקומו. */}
            <div className="relative">
              <ExpandableLab>
                <IntroRoadmap zones={roadmapZones} stations={roadmapStations} reduce={!!reduce} dir={dir} mentorLine={intro.mentor.roadmap} mentorWidth={330} />
              </ExpandableLab>
            </div>

            {/* ── 7 · TRUTH NOTE (near the roadmap) ── */}
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-cyan-500/20 bg-cyan-900/10 p-4 backdrop-blur-xl">
              <Info size={16} className="mt-0.5 shrink-0 text-cyan-400/80" />
              <p className="text-[13px] leading-relaxed text-slate-300 md:text-sm">{intro.truthNote}</p>
            </div>
          </section>

          {/* ══════════ 5 · COURSE SYSTEMS (19 chapters, 6 systems) ══════════ */}
          {/* שש מערכות שנפתחות, לא שישה פרקים. כל שער מגלה את טווח הפרקים שבתוכו. */}
          <section className="mt-20">
            <SectionHeading eyebrow={intro.systems.heading.eyebrow} title={intro.systems.heading.title} />

            {/* באנר שמבהיר: 19 פרקים, 6 מערכות */}
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

          {/* ══════════ 6 · CTA TO CHAPTER 1 ══════════ */}
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
