"use client";
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Mentor, EMERALD_ACCENT, type MentorPose } from "@/components/ai-internals/Mentor";

export const SmartMentor = ({ activeSection }: { activeSection: string }) => {
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // כל סקשן ממופה לתנוחה של המנטור (מתוך הסט השקוף החדש) ולטקסט מלווה.
  const mentorData: Record<string, { text: string; pose: MentorPose }> = {
    hero: {
      text: "ברוך הבא! אני כאן כדי להראות לך איך פייתון הופכת אותך למתכנת AI.",
      pose: "hello"
    },
    code: {
      text: "שים לב - רק 3 שורות קוד כדי להפעיל בינה מלאכותית עוצמתית!",
      pose: "code"
    },
    roadmap: {
      text: "זה המסלול שלנו. כל שלב כאן הוא קריטי לבניית מערכות Production.",
      pose: "roadmap"
    }
  };

  const currentData = mentorData[activeSection] || mentorData.hero;

  useEffect(() => {
    if (mounted && activeSection) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(`/audio/${activeSection}.mp3`);
      audioRef.current = audio;
      audio.play().catch(() => console.log("Audio blocked"));
    }
  }, [activeSection, mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-100">
      <motion.div
        animate={{
          top: activeSection === 'hero' ? '20vh' : activeSection === 'code' ? '45vh' : '70vh',
          right: '350px',
        }}
        transition={{ type: "spring", stiffness: 50, damping: 15 }}
        className="absolute pointer-events-auto flex flex-col items-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-900/95 border border-emerald-500/30 p-4 rounded-2xl mb-4 max-w-60 shadow-2xl backdrop-blur-md relative"
            dir="rtl"
          >
            <p className="text-white text-sm font-medium">{currentData.text}</p>
            <div className="absolute top-full right-1/2 translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-emerald-500/30 rotate-45 -mt-1.5" />
          </motion.div>
        </AnimatePresence>

        {/* הדמות השקופה: ריחוף עדין + לחיצה להשמעת השמע. בלי חיתוך עיגול. */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => audioRef.current?.play()}
          className="relative cursor-pointer"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentData.pose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Mentor pose={currentData.pose} width={180} accent={EMERALD_ACCENT} float={false} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};
