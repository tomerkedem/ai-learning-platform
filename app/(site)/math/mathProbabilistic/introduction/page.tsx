"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Brain, Target, MessageCircle, ShieldCheck, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { ChapterLayout } from "@/components/ChapterLayout";

export default function ProbabilisticIntroPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      // תוכן חדש שהוספנו על בסיס הקובץ המצורף
      title: "המשך ישיר למסע שלך",
      content: "אחרי שפגשנו את אבני הבניין בלומדה 'מתמטיקה אינטואיטיבית', אנחנו עוברים לשלב הבא. ניקח את הווקטורים, השיפועים וההסתברויות ונראה איך הם מתחברים למערכות קבלת החלטות אמיתיות וללוגיקה של מודלים גדולים.",
      icon: <ArrowRight className="text-emerald-400" size={28} />,
      label: "השלב הבא בסדרה"
    },
    {
      // תוכן מקורי 1
      title: "הפער שבין קוד למתמטיקה",
      content: "עולם ה-AI מתקדם בקצב שקשה לעקוב אחריו, ויש רגעים שזה מרגיש כאילו כולם מבינים משהו שאתה 'כמעט' מבין. מתמטיקה, הסתברות, פונקציות עלות... המילים האלה נשמעות מורכב, אבל בפועל אתה צריך רק שכבת הבנה דקה ומדויקת שמחברת בין מה שאתה כבר יודע לבין מה שהמודלים מצפים שתבין.",
      icon: <Brain className="text-blue-400" size={28} />,
      label: "הבנה מדויקת"
    },
    {
      // תוכן מקורי 2
      title: "הגישה: אינטואיציה קודם",
      content: "במקום הסברים כבדים, אנחנו נלך על קו אחר: אינטואיציה קודם, נוסחאות אחר כך, ורק כשצריך. כל מושג ייכנס לחיים דרך דוגמת פייתון קטנה, דרך סיפור קצר, או דרך חיבור ישיר לעולם שאתה כבר חי בו כמתכנת.",
      icon: <Target className="text-purple-400" size={28} />,
      label: "קוד וסיפורים"
    },
    {
      // תוכן מקורי 3
      title: "למה זה חשוב?",
      content: "היום מודל לא רק 'מריץ קוד'. הוא מחשב וקטורים, מודד זוויות, משווה הסתברויות ומכוון את עצמו על בסיס שגיאות שהוא יודע למדוד. אם אתה מבין את השפה הזו, אתה לא עובד מול קופסה שחורה. אתה מנהל שיחה.",
      icon: <MessageCircle className="text-pink-400" size={28} />,
      label: "לנהל שיחה"
    },
    {
      // תוכן מקורי 4
      title: "מה תקבל מהמסלול הזה?",
      content: "הבנה ברורה של וקטורים ומטריצות, אינטואיציה חדה להסתברות, והיכרות עם הדרך שבה מודלים לומדים משגיאות. אבל בעיקר: ביטחון. להרגיש שאתה שולט במה שקורה מאחורי הקלעים, גם בלי דוקטורט.",
      icon: <ShieldCheck className="text-amber-400" size={28} />,
      label: "ביטחון מקצועי"
    }
  ];

  const isLastStep = currentStep === steps.length - 1;

  return (
    <ChapterLayout 
      courseId="mathProbabilistic"
      currentChapterId={0} 
      lang="he"
    >
      <div 
        className="flex flex-col items-center justify-center min-h-[50vh] px-4" 
        style={{ marginTop: '130px' }} // גובה מותאם אישית למניעת הסתרה
        dir="rtl"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            // הקטנת Padding מ-14 ל-8 להורדת גובה
            className="bg-slate-900/90 border border-slate-700/50 p-7 md:p-9 rounded-[2.5rem] shadow-2xl backdrop-blur-2xl w-full max-w-4xl relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full" />

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-right relative z-10">
              <div className="flex-1 w-full order-2 md:order-1">
                <div className="flex items-center gap-5 mb-4">
                  <div className="p-3.5 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl shrink-0">
                    {steps[currentStep].icon}
                  </div>
                  <div>
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest block mb-1">
                      {steps[currentStep].label}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                      {steps[currentStep].title}
                    </h2>
                  </div>
                </div>

                <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-6">
                  {steps[currentStep].content}
                </p>
              </div>

              {/* מנטור בגודל קומפקטי (w-36) כדי לשמור על גובה כרטיס נמוך */}
              <div className="w-28 h-28 md:w-36 md:h-36 shrink-0 relative order-1 md:order-2 self-center">
                 <motion.img 
                   animate={{ y: [0, -8, 0] }}
                   transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                   src="/assets/mentor-hero.png" 
                   alt="Mentor" 
                   className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(16,185,129,0.3)]"
                 />
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-800/60">
              <div className="flex gap-2.5 flex-row-reverse">
                {steps.map((_, index) => (
                  <div key={index} className={`h-1.5 rounded-full transition-all duration-500 ${index === currentStep ? 'w-10 bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'w-2 bg-slate-800'}`} />
                ))}
              </div>

              {isLastStep ? (
                <Link href="/math/mathProbabilistic/chapter-1" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 px-10 rounded-xl transition-all shadow-lg active:scale-95 no-underline flex items-center gap-2 text-base">
                  קדימה, לפרק 1
                  <ChevronLeft size={20} />
                </Link>
              ) : (
                <button onClick={() => setCurrentStep(prev => prev + 1)} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-10 rounded-xl border border-slate-700 transition-all flex items-center gap-2 text-base">
                  המשך
                  <ChevronLeft size={20} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </ChapterLayout>
  );
}