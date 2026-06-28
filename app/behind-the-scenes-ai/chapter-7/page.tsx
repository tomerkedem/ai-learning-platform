"use client";

// ════════════════════════════════════════════════════════════════════════
// פרק 7 - Context Window (מציין מקום)
// ────────────────────────────────────────────────────────────────────────
// זהו עמוד מציין מקום כן ומינימלי. התוכן המלא של הפרק (מה המודל באמת רואה
// עכשיו, מה נכנס לחלון ההקשר ומה נופל ממנו) ייבנה בשלב נפרד. אין כאן מבדק,
// אין תרגום לשפות נוספות, ואין נכסי מנטור. אין שימוש בתו מקף ארוך.
// ════════════════════════════════════════════════════════════════════════

import React from 'react';
import { Layers, Hammer } from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';

export default function BehindTheScenesChapter7() {
    return (
        <ChapterLayout courseId="behind-the-scenes-ai" currentChapterId={7}>
            <section className="text-right" dir="rtl">
                <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 p-8 md:p-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-slate-500/30 mb-5">
                        <Layers size={14} className="text-slate-300" />
                        <span className="font-mono text-[11px] tracking-widest uppercase text-slate-300">Behind the Scenes · 07</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
                        Context Window: מה המודל באמת רואה עכשיו
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        המודל לא מחזיק את כל מה שנאמר אי פעם. בכל רגע יש לו חלון הקשר מוגבל,
                        וזה קובע מה נכנס לחישוב, מה עדיין משפיע, ומה כבר נפל מחוץ לתמונה.
                    </p>

                    <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-950/15 px-4 py-3 text-sm text-amber-200">
                        <Hammer size={16} />
                        <span>הפרק הזה בבנייה. התוכן המלא, המעבדה והמבדק יתווספו בשלב נפרד.</span>
                    </div>
                </div>
            </section>
        </ChapterLayout>
    );
}
