"use client";

// ════════════════════════════════════════════════════════════════════════
// התצוגה המקדימה של המבוא למי שאינו לומד מחובר ומאומת: ההירו ודוגמת הצ'אט הפותחת בלבד,
// ומיד אחריהן הזמנה להרשמה חינמית או להתחברות. שאר המבוא לא נשלח בתשובה בכלל (השרת
// מרנדר את הרכיב הזה במקום IntroView), ולכן אין מה להסתיר בגלילה או ב-CSS.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import { UserPlus } from "lucide-react";
import { ChapterLayout } from "@/components/ChapterLayout";
import { useReducedMotion } from "@/components/reducedMotion";
import { ReadAloudControls } from "@/components/ai-internals/ReadAloudControls";
import { FloatingReadAloud } from "@/components/ai-internals/FloatingReadAloud";
import type { ReadAloudSegment } from "@/components/ai-internals/useReadAloud";
import { LOCALE_SPEECH_LANG } from "@/components/ai-internals/readAloudLang";
import { useT } from "@/i18n/useT";
import { AccountPanel } from "../AccountPanel";
import type { CourseAccess } from "../_access/access";
import { IntroHero } from "./IntroHero";

export function IntroPreview({ access }: { access: CourseAccess }) {
  const reduce = useReducedMotion();
  const { t, dir, locale } = useT();
  const p = t.behindAi.introPreview;
  const x = t.chrome.access;

  // מחובר אבל עוד לא פתוח: הסיבה (מייל לא מאומת, השעיה, תקלה). אורח: אין סיבה, רק ההזמנה.
  const reason =
    access.status === "unconfirmed" ? x.unconfirmed
    : access.status === "suspended" ? x.suspended
    : access.status === "unavailable" ? x.unavailable
    : null;

  // ההקראה מכסה רק את מה שמוצג: ההירו, השורות שמתחת לכרטיס וההזמנה.
  const segments: ReadAloudSegment[] = [
    { id: 'title', label: p.hero.titleLead, text: `${p.hero.titleLead} ${p.hero.titleAccent}. ${p.hero.intro}` },
    { id: 'outside', label: p.chat.outsideLine, text: `${p.chat.outsideLine} ${p.chat.curiosityLine}` },
    { id: 'gate', label: x.previewTitle, text: `${x.previewTitle}. ${x.previewBody}${reason ? ` ${reason}` : ''}` },
  ];

  return (
    <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={0} themeAware>
      <div className="px-4 pb-24 mt-24 sm:mt-32 md:mt-40" dir={dir}>
        <div className="max-w-5xl mx-auto">
          <IntroHero
            readAloud={
              <FloatingReadAloud dir={dir}>
                <ReadAloudControls
                  segmentsByMode={{ short: segments, regular: segments, full: segments }}
                  lang={LOCALE_SPEECH_LANG[locale]}
                  locale={locale}
                  dir={dir}
                  labels={p.readAloud}
                  reduce={!!reduce}
                  compact
                  hideScope
                />
              </FloatingReadAloud>
            }
          />

          {/* גבול התצוגה המקדימה: הזמנה קומפקטית, ובה ההרשמה וההתחברות עצמן. */}
          <section
            aria-labelledby="intro-preview-gate"
            className="mx-auto mt-10 max-w-xl rounded-3xl border border-[var(--bts-brand-primary)]/30 bg-[var(--bts-surface-elevated)] p-5 md:p-7 text-start space-y-3"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--bts-border)] bg-[var(--bts-fill-soft)]">
                <UserPlus size={18} aria-hidden className="text-[var(--bts-brand-primary-strong)]" />
              </span>
              <h2 id="intro-preview-gate" className="text-lg md:text-xl font-black leading-tight text-[var(--bts-text-primary)]">
                {x.previewTitle}
              </h2>
            </div>
            <p className="text-sm text-[var(--bts-text-muted)] leading-relaxed">{x.previewBody}</p>
            {reason && <p role="status" className="text-sm font-bold text-[var(--bts-text-secondary)] leading-relaxed">{reason}</p>}
            <AccountPanel defaultOpen={access.status === "signed-out"} />
          </section>
        </div>
      </div>
    </ChapterLayout>
  );
}
