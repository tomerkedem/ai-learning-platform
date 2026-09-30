"use client";

// ההירו של המבוא ודוגמת הצ'אט הפותחת (EngineReveal): התצוגה המקדימה הציבורית. משותף לעמוד
// המלא (IntroView) ולתצוגה המקדימה לאורחים (IntroPreview). הטקסט מגיע מ-introPreview, המרחב
// היחיד של המבוא שבמילון הלקוח. readAloud: דוק ההקראה של העמוד, מוצב בתוך ההירו.

import React from 'react';
import { motion } from "framer-motion";
import { useReducedMotion } from "@/components/reducedMotion";
import { EngineReveal } from "@/components/ai-internals/EngineReveal";
import { useT } from "@/i18n/useT";

export function IntroHero({ readAloud }: { readAloud: React.ReactNode }) {
  const reduce = useReducedMotion();
  const { t, dir } = useT();
  const isRtl = dir === 'rtl';
  const p = t.behindAi.introPreview;

  return (
    // מבחוץ נראה כמו שני שלבים: בקשה ותשובה. השאלה "מה קרה באמצע" נשארת פתוחה.
    <div className="relative">
      {/* הירו טקסט-ראשון (M12). עד כאן עמדה בשוליים דמות גדולה, והטקסט יושר לצד
          אחד כדי לפנות לה מקום. בלי הדמות אין למה ליישר: הכותרת והפתיח ממורכזים
          מעל כרטיס הצאט, עם מידת-שורה קריאה לפתיח, כך שהמרכז הוויזואלי של העמוד
          עובר לטיפוגרפיה ולמה שקורה בכרטיס עצמו. דוק ההאזנה צף (portal ל-body)
          ואינו משפיע על הזרימה כאן. */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bts-surface-elevated)] border border-[var(--bts-brand-primary)]/30 mb-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--bts-brand-primary-strong)] opacity-75 animate-ping motion-reduce:hidden" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--bts-brand-primary)]" />
          </span>
          <span className="text-[var(--bts-brand-primary-strong)] text-xs font-bold tracking-wide">{p.hero.badge}</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-3xl md:text-5xl font-black text-[var(--bts-text-primary)] tracking-tight leading-tight mb-4">
          {p.hero.titleLead}{' '}
          <span className={`${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent`}>
            {p.hero.titleAccent}
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-base md:text-lg text-[var(--bts-text-secondary)] leading-relaxed">{p.hero.intro}</p>

        {readAloud}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.6 }}
      >
        <EngineReveal
          reduce={!!reduce}
          dir={dir}
          promptRole={p.chat.promptRole}
          prompt={p.chat.prompt}
          answerRole={p.chat.answerRole}
          answer={p.chat.answer}
          outsideLine={p.chat.outsideLine}
          curiosityLine={p.chat.curiosityLine}
          inputPlaceholder={p.chat.inputPlaceholder}
        />
      </motion.div>
    </div>
  );
}
