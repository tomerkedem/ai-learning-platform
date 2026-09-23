"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, FunctionSquare, ArrowRight, Activity, TrendingDown, Target, AlertCircle, CheckCircle, Check, X } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { ChapterLayout } from '@/components/ChapterLayout';

// --- רכיבים ויזואליים פנימיים ---

// 1. המחשה: המודל כפונקציה (Input -> F(x) -> Output)
const ModelFunctionLab = () => {
  const [inputType, setInputType] = useState<'text' | 'image' | 'user'>('text');
  const [processing, setProcessing] = useState(false);

  const scenarios = {
    text: {
        input: "השירות היה מעולה!",
        vector: "[0.1, 0.9, 0.5]",
        output: "סנטימנט: חיובי (0.98)",
        icon: "💬"
    },
    image: {
        input: "Pixel Matrix",
        vector: "[255, 128, 64...]",
        output: "סיווג: חתול (0.85)",
        icon: "🖼️"
    },
    user: {
        input: "User History",
        vector: "[Clicks: 50, Time: 2m]",
        output: "ניבוי: יבצע רכישה",
        icon: "👤"
    }
  };

  const current = scenarios[inputType];

  const handleProcess = () => {
      setProcessing(true);
      setTimeout(() => setProcessing(false), 1500);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col gap-8 relative overflow-hidden mt-8">
      
      {/* Tabs */}
      <div className="flex justify-center gap-4 z-10">
          {(['text', 'image', 'user'] as const).map(type => (
              <button
                key={type}
                onClick={() => setInputType(type)}
                className={`px-4 py-2 rounded-lg text-sm transition-all border ${inputType === type ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
              >
                  {type === 'text' ? 'טקסט' : type === 'image' ? 'תמונה' : 'משתמש'}
              </button>
          ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 z-10">
          
          {/* Input */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center w-full md:w-1/4 h-32 flex flex-col items-center justify-center gap-2">
              <div className="text-2xl">{current.icon}</div>
              <div className="text-sm font-bold text-white">{current.input}</div>
              <div className="text-[10px] text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded">
                  {current.vector}
              </div>
          </div>

          {/* The Function (Black Box) */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="w-full h-1 bg-slate-800 absolute top-1/2 -z-10"></div>
              <motion.div 
                animate={{ scale: processing ? [1, 1.1, 1] : 1 }}
                transition={{ repeat: processing ? Infinity : 0, duration: 0.5 }}
                className="bg-purple-600 w-24 h-24 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(147,51,234,0.4)] border-4 border-slate-900 z-10 cursor-pointer hover:bg-purple-500 transition-colors"
                onClick={handleProcess}
              >
                  <div className="text-white font-mono font-bold text-xl">f(x)</div>
              </motion.div>
              {processing && (
                  <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 50, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full z-20 shadow-lg"
                  />
              )}
          </div>

          {/* Output */}
          <div className={`bg-slate-950 p-4 rounded-xl border w-full md:w-1/4 h-32 flex flex-col items-center justify-center gap-2 transition-all duration-500 ${processing ? 'border-slate-800 opacity-50' : 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)] opacity-100'}`}>
              <div className="text-xs text-slate-500 uppercase tracking-widest">Output (y)</div>
              <div className="text-sm font-bold text-green-400 text-center">
                  {processing ? "Computing..." : current.output}
              </div>
          </div>
      </div>

      <p className="text-center text-xs text-slate-500 mt-2">
          לחץ על הריבוע הסגול <strong>f(x)</strong> כדי להפעיל את המודל
      </p>
    </div>
  )
}

// 2. עקומת הטעות (Loss Curve)
const LossCurveLab = () => {
    const [param, setParam] = useState(50); // 0 to 100
    
    // פונקציית פרבולה פשוטה: y = (x-50)^2
    // מנורמלת לגובה של 0-100 לצורך התצוגה
    const loss = Math.pow(param - 50, 2) / 25; 
    
    // צבע משתנה מאדום (טעות גבוהה) לירוק (טעות נמוכה)
    const isLowLoss = loss < 10;
    const color = isLowLoss ? "text-green-400" : "text-red-400";
    const ballColor = isLowLoss ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]" : "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]";

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 relative mt-8">
            <div className="flex justify-between items-start mb-8">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <TrendingDown size={20} className="text-blue-400"/>
                    המרדף אחרי המינימום
                </h3>
                <div className={`text-right font-mono text-sm border px-3 py-1 rounded ${isLowLoss ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                    <div className="text-xs opacity-70">Current Loss</div>
                    <div className={`font-bold ${color}`}>{loss.toFixed(1)}</div>
                </div>
            </div>

            {/* איזור הגרף */}
            <div className="relative h-48 w-full border-b border-l border-slate-700 mb-6 bg-slate-950/30 rounded-tr-xl">
                {/* SVG Curve */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
                    {/* נצייר פרבולה ויזואלית */}
                    <path 
                        d="M0,0 Q50,200 100,0" 
                        fill="none" 
                        stroke="#475569" 
                        strokeWidth="2" 
                        strokeDasharray="4 4"
                        vectorEffect="non-scaling-stroke"
                        transform="scale(1, -1) translate(0, -200)" // הופך את ה-Y כדי שהמינימום יהיה למטה
                    />
                </svg>

                {/* הכדור שזז על העקומה */}
                <motion.div 
                    className={`absolute w-6 h-6 rounded-full border-2 border-white z-10 ${ballColor}`}
                    animate={{ 
                        left: `${param}%`,
                        bottom: `${100 - (loss)}%` 
                    }}
                    style={{ bottom: `${100 - (Math.pow(param - 50, 2) / 25)}%` }} 
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
                
                {/* קו המטרה */}
                <div className="absolute bottom-0 left-1/2 w-px h-full border-r border-dashed border-green-500/30 flex items-end justify-center pb-2">
                    <span className="text-[10px] text-green-500 bg-slate-900 px-1">Goal (Min Error)</span>
                </div>
            </div>

            {/* סליידר שליטה */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                    <span>פרמטר שגוי (שמאל)</span>
                    <span>הפרמטר המושלם</span>
                    <span>פרמטר שגוי (ימין)</span>
                </div>
                <input 
                    type="range" min="0" max="100" step="1" value={param}
                    onChange={(e) => setParam(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-center text-xs text-slate-400 mt-2">
                    הזז את הסליידר כדי למצוא את הנקודה שבה הטעות (Loss) היא מינימלית.
                </p>
            </div>
        </div>
    );
};

// 3. מינימום מקומי מול גלובלי
const MinimaExplorer = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Local Minima Card */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
                <div>
                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                        <AlertCircle size={16} className="text-orange-400"/> מינימום מקומי
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        &quot;בור קטן&quot; בתוך עמק גדול יותר. המודל עלול &quot;להיתקע&quot; שם, וזה חלק טבעי מהאימון.
                    </p>
                </div>
                <div className="h-24 w-full relative border-b border-slate-700">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0,0 Q20,80 40,50 Q60,20 100,100" fill="none" stroke="#fb923c" strokeWidth="2" />
                        <circle cx="40" cy="50" r="3" fill="#fb923c" />
                    </svg>
                    <div className="absolute top-[50%] left-[40%] text-[10px] text-orange-400 -translate-y-6">נתקע כאן</div>
                </div>
            </div>

            {/* Global Minima Card */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
                <div>
                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-400"/> מינימום גלובלי
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        הנקודה הכי נמוכה בכל העקומה. זה המקום שבו המודל מגיע לביצועים הכי טובים שהוא מסוגל.
                    </p>
                </div>
                <div className="h-24 w-full relative border-b border-slate-700">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0,0 Q20,80 40,50 Q60,20 100,100" fill="none" stroke="#4ade80" strokeWidth="2" />
                        <circle cx="60" cy="20" r="3" fill="#4ade80" />
                    </svg>
                    <div className="absolute top-[80%] left-[60%] text-[10px] text-green-400 translate-y-2">המטרה האמיתית</div>
                </div>
            </div>
        </div>
    )
}

// --- העמוד הראשי ---

export default function ChapterEight() {
  return (
  
          
            <ChapterLayout courseId="mathIntuitive" currentChapterId={8}>
          
          {/* סעיף 1: קלט ← פלט בצורה הכי פשוטה */}
          <section id="part-1" className="scroll-mt-24 mb-8">
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><FunctionSquare size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">1. קלט ← פלט בצורה הכי פשוטה</h2>
                </div>
                
                <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none space-y-6">
                    <p>
                        כמעט כל מודל בעולם ה-AI, מהקטנים ביותר ועד הגדולים ביותר, פועל על רעיון אחד פשוט מאוד:
                        <strong>מקבלים קלט, מבצעים עליו חישוב, ומחזירים פלט.</strong>
                    </p>
                    <p>
                        זה הכול. מודלים יכולים להיות מורכבים, עמוקים ורב שכבתיים, אבל הבסיס נשאר זהה לחלוטין: <strong>פונקציה</strong>.
                        משהו שמקבל משהו אחד ומחזיר משהו אחר.
                    </p>
                    
                    <div className="bg-slate-900 border-l-4 border-blue-500 p-6 rounded-r-xl my-4">
                        <h4 className="font-bold text-white mb-2">מה זה אומר בפועל?</h4>
                        <p className="text-slate-400 text-sm mb-4">
                            כשמודל מקבל וקטור קלט, הוא מבצע עליו סדרת חישובים. החישובים האלה יכולים להיות פשוטים או מסובכים, אבל העיקרון נשאר זהה: המודל ממפה את הקלט לפלט.
                        </p>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li className="flex items-center gap-2"><ArrowRight size={14} className="text-blue-400"/> וקטור של משפט ← סנטימנט חיובי או שלילי</li>
                            <li className="flex items-center gap-2"><ArrowRight size={14} className="text-blue-400"/> תמונה ← תג &quot;כלב&quot;, &quot;חתול&quot; או &quot;אדם&quot;</li>
                            <li className="flex items-center gap-2"><ArrowRight size={14} className="text-blue-400"/> נתוני משתמש ← סיכוי לקניה</li>
                        </ul>
                    </div>

                    <p>
                        מאחורי כל זה לא עומדת &quot;הבנה&quot; של העולם, אלא מיפוי מתמטי.
                        למה חשוב לראות מודל כפונקציה? כי זה מפשט את כל התמונה.
                        אין קסם, אין אינטואיציות נסתרות. יש דרך אחת שבה המודל פועל:
                        <strong>קלט נכנס ← המודל מעבד אותו ← פלט יוצא.</strong>
                    </p>
                </div>
            </div>

            <ModelFunctionLab />

            <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none mt-8">
                <p>
                    הפונקציה עצמה היא אוסף של חוקים שהמודל למד מהדאטה. וזה בדיוק מה שמבדיל בין מודל &quot;טוב&quot; למודל &quot;חלש&quot;: איזו פונקציה הוא למד.
                </p>
                <p>
                    ומה שמעניין יותר: המודל לא רק מנסה להחזיר פלט. הוא מנסה להחזיר <strong>פלט נכון</strong>.
                    כזה שמקטין את הטעות שלו מהעולם האמיתי.
                </p>
            </div>

          </section>


          {/* סעיף 2: מה זה "עקומה"? */}
          <section id="part-2" className="scroll-mt-24 mb-8">
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-400"><Activity size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">2. מה זה &quot;עקומה&quot; ולמה כל מודל מנסה לרדת בה?</h2>
                </div>
                
                <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none space-y-6">
                    <p>
                        כשאומרים שמודל &quot;לומד&quot;, בפועל קורה דבר הרבה יותר פשוט:
                        הוא מנסה למצוא מקום נמוך על עקומה מתמטית שמייצגת את הטעות שלו.
                        ואז מגיע רגע שבו הכול מתחבר: <strong>המודל לא מחפש תשובה. הוא מחפש מינימום.</strong>
                    </p>
                    
                    <h3 className="text-white font-bold text-xl">מה זו בכלל &quot;עקומה&quot;?</h3>
                    <p>
                        עקומה היא דרך לייצג את הקשר בין קלט לבין טעות.
                        לכל קלט שהמודל בוחר, הוא מייצר פלט. הפלט הזה מושווה למציאות, וההפרש ביניהם הוא הטעות.
                        כשמציירים את הטעות הזו על גרף, מתקבלת עקומה.
                    </p>
                    <ul className="list-disc list-inside space-y-2 marker:text-red-500">
                        <li><strong>נקודה נמוכה</strong> על העקומה אומרת &quot;טעות קטנה&quot;.</li>
                        <li><strong>נקודה גבוהה</strong> אומרת &quot;טעות גדולה&quot;.</li>
                    </ul>
                    <p>
                        גם אם זה לא נראה כמו גרף שאתה רואה בבית ספר, זו אותה אינטואיציה: יש מקום גבוה, ויש מקום נמוך. המודל רוצה לרדת למקום הנמוך.
                    </p>
                </div>
            </div>

            <LossCurveLab />

            <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none mt-8">
                <h3 className="text-white font-bold text-xl mb-2">למה חשוב להבין את זה כמפתח?</h3>
                <p>
                    כי בלי ההבנה הזו למידת מכונה נראית כמו קסם שחור. אבל עם ההבנה הזו כל התהליך נהיה מאוד הגיוני:
                </p>
                <ul className="list-none space-y-2 bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <li className="flex items-center gap-2"><Check size={16} className="text-green-400"/> יש עקומה שמודדת טעות.</li>
                    <li className="flex items-center gap-2"><Check size={16} className="text-green-400"/> אנחנו רוצים להיות כמה שיותר נמוך.</li>
                    <li className="flex items-center gap-2"><Check size={16} className="text-green-400"/> כל צעד של המודל הוא ניסיון להתקרב לנקודה נמוכה יותר.</li>
                </ul>
                <p className="mt-4 text-sm text-slate-400 italic">
                    * כשאתה חושב על &quot;עקומה&quot;, אל תחשוב על גרף חלק שמצויר על לוח. במודלים אמיתיים העקומה נמצאת במרחב של אלפי או מיליוני משתנים. אבל האינטואיציה נשארת זהה.
                </p>
            </div>

          </section>


          {/* סעיף 3: מה זה בכלל מינימום */}
          <section id="part-3" className="scroll-mt-24">
             <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800"><Target className="text-green-400" size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">3. מה זה בכלל מינימום?</h2>
                </div>
                
                <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none space-y-6">
                    <p>
                        אחרי שהבנו שהמודל נע על עקומה של טעות ושואף לרדת כל הזמן, מגיע הרעיון שמחזיק את כל תהליך הלמידה: <strong>המינימום</strong>.
                        זו המילה שכל מפתח שומע שוב ושוב באימון מודלים. אבל מה זה בעצם אומר?
                    </p>
                    <p>
                        <strong>מינימום הוא המקום שבו המודל טועה הכי מעט.</strong>
                        כשמציירים את הטעות כעקומה, יש נקודה אחת (או כמה נקודות) שבה הטעות היא הכי נמוכה. זו נקודת המינימום.
                        שם המודל מרגיש &quot;נוח&quot;: הוא מפיק פלטים שמתאימים לדאטה טוב יותר מאשר בכל נקודה אחרת.
                    </p>
                </div>

                <MinimaExplorer />

                <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none mt-8">
                    <h3 className="text-white font-bold text-xl mb-4">למה מפתחים צריכים להבין מינימום?</h3>
                    <p>
                        כי זה מסביר הרבה התנהגויות של מודלים:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                        <li className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-sm text-slate-300">לפעמים האימון &quot;נתקע&quot;.</li>
                        <li className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-sm text-slate-300">לפעמים המודל לא משתפר מעבר לנקודה מסוימת.</li>
                        <li className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-sm text-slate-300">לפעמים הירידה איטית מדי או מהירה מדי.</li>
                        <li className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-sm text-slate-300">ולפעמים יש כמה פתרונות טובים, לא רק אחד.</li>
                    </ul>
                    <p className="mt-6">
                        ברגע שמבינים שמודל רק מחפש נקודה נמוכה על עקומה ולא &quot;מנסה להבין&quot; משהו עמוק יותר – הכול נהיה ברור.
                        זה הרגע שבו לומדים להבין את המודל כיצירה מתמטית, ולא כקופסה שחורה.
                    </p>
                </div>
             </div>
          </section>


          {/* Quiz */}
          <section id="quiz" className="mt-16 pt-8 border-t border-slate-800">
             <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">בדיקת הבנה: סיכום פרק 8</h2>
                <p className="text-slate-400 text-sm">האם הבנת איך המודל חושב?</p>
             </div>
             <ChapterEightQuiz />
          </section>

        </ChapterLayout>
    
  );
}


// --- קומפוננטות עזר ---

function ChapterEightQuiz() {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    
    const questions = [
        {
            id: 1,
            text: "מהי ההגדרה הפשוטה ביותר של מודל AI?",
            options: [
                { id: 1, text: "מוח מלאכותי שחושב כמו בן אדם" },
                { id: 2, text: "פונקציה מתמטית שמקבלת קלט ומחזירה פלט", correct: true },
                { id: 3, text: "מסד נתונים גדול" }
            ]
        },
        {
            id: 2,
            text: "מה מייצגת ה'עקומה' (Loss Curve) שהמודל מנסה לרדת בה?",
            options: [
                { id: 1, text: "את רמת הטעות של המודל (גבוה = רע, נמוך = טוב)", correct: true },
                { id: 2, text: "את מהירות המעבד" },
                { id: 3, text: "את כמות הזיכרון הפנוי" }
            ]
        },
        {
            id: 3,
            text: "מה ההבדל בין מינימום מקומי לגלובלי?",
            options: [
                { id: 1, text: "אין הבדל" },
                { id: 2, text: "מינימום גלובלי הוא הנקודה הנמוכה ביותר בכל המרחב (הפתרון הטוב ביותר)", correct: true },
                { id: 3, text: "מינימום מקומי עדיף תמיד" }
            ]
        }
    ];

    const handleSelect = (qId: number, oId: number) => {
        setAnswers(prev => ({ ...prev, [qId]: oId }));
    };

    const allCorrect = questions.every(q => {
        const selected = answers[q.id];
        const correctOption = q.options.find(o => o.correct);
        return selected === correctOption?.id;
    });

    return (
        <div className="space-y-4 max-w-xl mx-auto text-right relative z-10">
            {questions.map((q) => (
                <div key={q.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                    <h4 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
                        <span className="bg-slate-800 text-slate-400 w-5 h-5 rounded flex items-center justify-center text-[10px]">{q.id}</span>
                        {q.text}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                        {q.options.map((opt) => {
                            const isSelected = answers[q.id] === opt.id;
                            const isCorrect = opt.correct;
                            
                            let btnClass = "w-full text-right px-3 py-2 rounded-lg border transition-all text-xs flex items-center justify-between ";
                            
                            if (isSelected) {
                                if (isCorrect) btnClass += "bg-green-500/10 border-green-500/50 text-green-300";
                                else btnClass += "bg-red-500/10 border-red-500/50 text-red-300";
                            } else {
                                btnClass += "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-400";
                            }

                            return (
                                <button key={opt.id} onClick={() => handleSelect(q.id, opt.id)} className={btnClass}>
                                    <span>{opt.text}</span>
                                    {isSelected && (isCorrect ? <Check size={14} className="text-green-400" /> : <X size={14} className="text-red-400" />)}
                                </button>
                            )
                        })}
                    </div>
                </div>
            ))}

            <AnimatePresence>
                {allCorrect && Object.keys(answers).length === 3 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="sticky bottom-8 z-50 flex justify-center pt-6"
                    >
                        <Link href="/chapter-9">
                            <Button size="lg" className="h-14 px-10 text-base bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-[0_0_40px_rgba(37,99,235,0.5)] border-t border-blue-400/30 hover:scale-105 transition-transform">
                                <span className="font-bold">המשך לפרק 9: שיפועים</span> <ChevronLeft className="mr-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}