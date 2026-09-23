"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Database, Activity, GitCommit, CheckCircle, Terminal, ChevronLeft, Check, X, Eye, RefreshCcw, Microscope, Brain, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { ChapterLayout } from "@/components/ChapterLayout";

// --- רכיבים ויזואליים פנימיים ---

// 1. DataVisionLab: המחשה של Flattening (תמונה לוקטור)
const DataVisionLab = () => {
  const [isFlattened, setIsFlattened] = useState(false);
  
  const gridData = [
    { val: 1, color: "bg-red-500", border: "border-red-400/50", shadow: "shadow-red-500/20" },
    { val: 0, color: "bg-slate-800", border: "border-slate-700", shadow: "" },
    { val: 1, color: "bg-red-500", border: "border-red-400/50", shadow: "shadow-red-500/20" },
    
    { val: 0, color: "bg-slate-800", border: "border-slate-700", shadow: "" },
    { val: 1, color: "bg-blue-500", border: "border-blue-400/50", shadow: "shadow-blue-500/20" },
    { val: 0, color: "bg-slate-800", border: "border-slate-700", shadow: "" },
    
    { val: 1, color: "bg-emerald-500", border: "border-emerald-400/50", shadow: "shadow-emerald-500/20" },
    { val: 1, color: "bg-emerald-500", border: "border-emerald-400/50", shadow: "shadow-emerald-500/20" },
    { val: 1, color: "bg-emerald-500", border: "border-emerald-400/50", shadow: "shadow-emerald-500/20" },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col items-center gap-6 relative overflow-hidden group my-8">
      <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-500"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full min-h-45 z-10">
        {/* Input Matrix (מימין) */}
        <div className="relative">
            <div className="text-xs text-slate-400 mb-3 text-center font-mono font-bold tracking-wider">Input (Image)</div>
            <div className={`grid grid-cols-3 gap-2 transition-all duration-700 p-3 rounded-xl border border-dashed border-slate-700 ${isFlattened ? 'opacity-20 scale-90 blur-[1px]' : 'opacity-100 scale-100 bg-slate-900/50'}`}>
            {gridData.map((item, i) => (
                <motion.div 
                    key={`grid-${i}`}
                    layoutId={`pixel-${i}`}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white border ${item.border} ${item.color} ${item.shadow}`}
                >
                {item.val}
                </motion.div>
            ))}
            </div>
        </div>

        {/* Action Button (באמצע) */}
        <div className="flex flex-col items-center gap-3">
            <Button 
                onClick={() => setIsFlattened(!isFlattened)}
                className="rounded-full w-14 h-14 bg-slate-800 border border-slate-600 hover:bg-blue-600 hover:border-blue-400 hover:scale-110 transition-all shadow-xl"
            >
                {/* תיקון: החץ מצביע שמאלה (מהמטריצה לוקטור) */}
                {isFlattened ? <RefreshCcw size={20} /> : <ArrowLeft size={24} />}
            </Button>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {isFlattened ? "Reset" : "Flatten"}
            </span>
        </div>

        {/* Output Vector (משמאל) */}
        <div className="relative max-w-45 md:max-w-75">
            <div className="text-xs text-slate-400 mb-3 text-center font-mono font-bold tracking-wider">Model Input (Vector)</div>
            <div className={`flex flex-wrap gap-2 justify-center transition-all duration-700 p-3 rounded-xl border border-dashed border-slate-700 ${!isFlattened ? 'opacity-20 scale-90 blur-[1px]' : 'opacity-100 scale-100 bg-slate-900/50'}`}>
                {gridData.map((item, i) => (
                <motion.div 
                    key={`vector-${i}`}
                    layoutId={isFlattened ? `pixel-${i}` : undefined}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white border ${item.border} ${item.color} ${item.shadow}`}
                >
                {item.val}
                </motion.div>
            ))}
            </div>
        </div>
      </div>
    </div>
  )
}

// 2. LossVisualizer
const LossVisualizer = () => {
    const [weight, setWeight] = useState(0); 
    const target = 4;
    const loss = Math.pow(weight - target, 2); 

    const normalizedLoss = Math.min(loss / 50, 1);
    const colorR = Math.floor(normalizedLoss * 255);
    const colorG = Math.floor((1 - normalizedLoss) * 220 + 35);
    
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 relative">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Activity size={18} className="text-purple-400" /> 
                    סימולטור: חיפוש המינימום
                </h3>
                <div className="text-xs font-mono bg-black/40 px-3 py-1 rounded text-slate-400" dir="ltr">
                    Loss = (Guess - Target)²
                </div>
            </div>
            
            <div className="h-40 w-full bg-slate-950/50 rounded-xl relative border-b border-l border-slate-700 mb-6 overflow-hidden">
                <svg className="w-full h-full absolute inset-0 pointer-events-none" preserveAspectRatio="none">
                    <path d="M0,0 C20,100 80,100 100,0" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                </svg>
                
                <motion.div 
                    animate={{ 
                        left: `${((weight + 2) / 12) * 100}%`, 
                        bottom: `${Math.max(10, 100 - (loss * 2.5))}%` 
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                    className="absolute w-5 h-5 rounded-full shadow-[0_0_20px_currentColor] border-2 border-white transform -translate-x-1/2 z-10"
                    style={{ backgroundColor: `rgb(${colorR}, ${colorG}, 50)`, color: `rgb(${colorR}, ${colorG}, 50)` }}
                />

                <div className="absolute bottom-0 left-1/2 w-px h-full bg-green-500/30 border-r border-dashed border-green-500/50 flex items-end justify-center pb-2">
                    <span className="text-[10px] text-green-400 bg-slate-900 px-1">Target</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between text-xs text-slate-400">
                    <span>ניחוש נמוך מדי</span>
                    <span>ניחוש גבוה מדי</span>
                </div>
                <input 
                    type="range" min="-2" max="10" step="0.1" value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                
                <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-slate-800/50">
                    <div className="text-xs text-slate-500">Current Loss:</div>
                    <div className="font-mono font-bold" style={{ color: `rgb(${colorR}, ${colorG}, 100)` }}>
                        {loss.toFixed(4)}
                    </div>
                </div>
                {loss < 0.1 && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-center text-green-400 text-sm font-bold flex justify-center gap-2">
                        <CheckCircle size={16} /> מעולה! המודל התכנס למינימום.
                    </motion.div>
                )}
            </div>
        </div>
    )
}


// --- העמוד הראשי ---

export default function ChapterOne() {
  return (
          
    <ChapterLayout courseId="mathIntuitive" currentChapterId={1}>
          
          {/* --- סעיף 1 --- */}
          <section id="part-1" className="scroll-mt-24 mb-8">
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Eye size={20}/></div>
                    <h2 className="text-2xl font-bold text-white">1. איך מודלים &quot;רואים&quot; את הנתונים?</h2>
                </div>
                
                <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none space-y-4">
                    <p>
                        כשאנחנו עובדים עם AI, אנחנו רגילים לחשוב במונחים של קבצים, טקסטים, תמונות ומידע עסקי.
                        אבל בתוך המודל – כל זה נעלם. לא נשארת שפה, לא נשארת תמונה, לא נשארים מושגים.
                        הכול מתורגם לצורה אחת בלבד: <strong>מספרים</strong>.
                    </p>
                    <p>
                        כשאתה מזין למודל תמונה, הוא לא רואה &quot;צורות&quot; או &quot;צבעים&quot;. הוא רואה מטריצה (טבלה) של פיקסלים.
                        אבל מודל מתמטי לא יודע להתמודד עם טבלה דו-ממדית. הוא צריך רשימה אחת ארוכה.
                        לפעולה הזו קוראים <strong>Flattening (שיטוח)</strong>.
                    </p>
                </div>
            </div>

            <DataVisionLab />

            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden mt-8 shadow-md">
                <div className="bg-slate-900/50 p-2 px-4 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                        <Terminal size={14} className="text-blue-400" />
                        הקוד שמאחורי הקלעים
                    </div>
                </div>
                <div className="p-4 grid gap-4">
                    <code className="font-mono text-xs text-left block leading-relaxed" dir="ltr">
                        <span className="text-purple-400">import</span> numpy <span className="text-purple-400">as</span> np<br/>
                        <span className="text-slate-500"># 1. התמונה שלנו (מטריצה 3x3)</span><br/>
                        image = np.array([[1, 0, 1], [0, 1, 0], [1, 0, 1]])<br/>
                        <span className="text-slate-500"># 2. שיטוח לוקטור</span><br/>
                        flat_vector = image.<span className="text-yellow-300">flatten</span>()<br/>
                        <span className="text-blue-400">print</span>(flat_vector) <span className="text-slate-600">{'// [1, 0, 1, 0, 1, 0, 1, 0, 1]'}</span>
                    </code>
                    <div className="bg-blue-500/5 border border-blue-500/10 rounded p-3 text-xs text-blue-200">
                        <strong>מה קרה כאן?</strong> הפקודה <code>flatten()</code> לוקחת את המבנה הדו-ממדי ו&quot;מדביקה&quot; את השורות אחת אחרי השנייה לוקטור אחד ארוך שהמודל יכול לעבד.
                    </div>
                </div>
            </div>
          </section>


          {/* --- סעיף 2 --- */}
          <section id="part-2" className="scroll-mt-24 mb-8" >
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Activity size={20}/></div>
                    <h2 className="text-2xl font-bold text-white">2. למה ML זה בעצם &quot;צמצום טעות&quot;?</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="prose prose-invert text-slate-400 text-base leading-relaxed space-y-4">
                        <p>
                            איך המודל מחליט? התשובה תמיד חוזרת לאותה נקודה: <strong>מודלים לא &quot;מבינים&quot; שום דבר. הם רק מנסים לצמצם טעות.</strong>
                        </p>
                        <p>
                            כל מודל קם בבוקר עם מטרה אחת: לקבל קלט, לתת פלט, ולנסות להיות פחות גרוע ממה שהיה קודם.
                            זה נקרא <strong>Loss Function</strong> (פונקציית הפסד). המודל צריך להבין איפה הוא טעה, ולאיזה כיוון &quot;לזוז&quot; כדי לשפר.
                        </p>
                    </div>
                    
                    <div>
                        <LossVisualizer />
                    </div>
                </div>
            </div>
          </section>


          {/* --- סעיף 3 --- */}
          <section id="part-3" className="scroll-mt-24">
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-white mb-2">3. הקשר בין נתונים, תחזיות והחלטות</h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-base">
                    המודל לא מחליט אם לאשר עסקה או לחסום משתמש. הוא רק מחשב הסתברות. ההחלטה היא שלך.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-slate-800 via-blue-500/50 to-slate-800 -z-10 -translate-y-1/2 rounded-full"></div>
                
                <PipelineCard 
                    step="01"
                    title="הנתונים (Data)"
                    icon={<Database className="text-white" size={18} />}
                    desc="חומר הגלם (טקסט/תמונה) הופך לוקטור של מספרים."
                    color="blue"
                />
                
                <PipelineCard 
                    step="02"
                    title="התחזית (Prediction)"
                    icon={<Brain className="text-white" size={18} />}
                    desc="המודל מוציא מספר (למשל: 0.88 הסתברות לספאם)."
                    color="purple"
                    isMain
                />
                
                <PipelineCard 
                    step="03"
                    title="ההחלטה (Decision)"
                    icon={<GitCommit className="text-white" size={18} />}
                    desc="הלוגיקה שלך: 'אם מעל 0.80, חסום את המייל'."
                    color="green"
                />
            </div>
          </section>


          {/* --- סעיף 4 --- */}
          <section id="part-4" className="bg-slate-950/50 border border-slate-800 rounded-2xl p-8 relative overflow-hidden group mt-12">
             <div className="absolute top-0 right-0 w-full h-1 bg-linear-to-r from-transparent via-yellow-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             
             <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 shrink-0">
                    <Microscope className="text-yellow-500 w-8 h-8" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">4. מה מפתח צריך לקחת מכאן?</h2>
                    <p className="text-slate-400 text-base">
                        אתה לא צריך להיות דוקטור למתמטיקה. אבל כדי לא לעבוד &quot;על עיוור&quot;, זכור את הכללים האלו:
                    </p>
                    
                    <div className="grid grid-cols-1 gap-3">
                        <CheckItem title="כל מודל רואה וקטור" desc="ברגע שאתה מבין שטקסט הוא רשימת מספרים, חצי מהקסם השחור נעלם." />
                        <CheckItem title="כל תחזית היא מדידה" desc="דמיון, קרבה, שונות – הכל מתורגם למספרים שאומרים 'כמה זה דומה'." />
                        <CheckItem title="שינוי קטן בקלט = שינוי גדול בפלט" desc="בגלל שהכל מתמטיקה, שינוי קטן בנתונים יכול להזיז את הוקטור למקום אחר." />
                    </div>
                </div>
             </div>
          </section>

          {/* --- QUIZ --- */}
          <section id="quiz" className="mt-16 pt-8 border-t border-slate-800">
             <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">בדיקת הבנה: סיכום פרק 1</h2>
                <p className="text-slate-400 text-sm">האם האינטואיציות יושבות טוב?</p>
             </div>
             <ChapterQuiz />
          </section>
      
      </ChapterLayout>

  );
}

// --- Helper Components ---

interface PipelineCardProps {
  step: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  isMain?: boolean;
}

function PipelineCard({ step, title, desc, icon, color, isMain }: PipelineCardProps) {
    const colors: Record<string, string> = {
        blue: "bg-blue-600 border-blue-500",
        purple: "bg-purple-600 border-purple-500",
        green: "bg-green-600 border-green-500",
    };

    return (
        <div className={`
            relative p-5 rounded-xl border border-slate-800 bg-slate-900 transition-all duration-300 group hover:-translate-y-1
            ${isMain ? 'ring-1 ring-purple-500/50 shadow-xl' : ''}
        `}>
            <div className="absolute top-4 left-4 text-[10px] font-mono font-bold text-slate-600 opacity-50">
                {step}
            </div>
            <div className={`mb-3 p-2 rounded-lg inline-block border shadow-lg ${colors[color] || colors.blue}`}>
                {icon}
            </div>
            <h3 className="text-base font-bold text-white mb-2">{title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
        </div>
    );
}

function CheckItem({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-800">
            <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={16} />
            <div>
                <h4 className="text-white font-bold text-sm mb-0.5">{title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function ChapterQuiz() {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    
    const questions = [
        {
            id: 1,
            text: "מה עושה המודל עם תמונה שהוא מקבל?",
            options: [
                { id: 1, text: "מבין את המשמעות הויזואלית" },
                { id: 2, text: "ממיר אותה לוקטור (רשימת מספרים)", correct: true },
                { id: 3, text: "שומר אותה כקובץ PNG" }
            ]
        },
        {
            id: 2,
            text: "מהי המטרה העיקרית של המודל בתהליך האימון?",
            options: [
                { id: 1, text: "לצמצם את פונקציית הטעות (Loss)", correct: true },
                { id: 2, text: "לייצר נתונים חדשים" },
                { id: 3, text: "לכתוב קוד יעיל יותר" }
            ]
        },
        {
            id: 3,
            text: "מי מקבל את ההחלטה הסופית (למשל: לחסום מייל)?",
            options: [
                { id: 1, text: "המודל עצמו" },
                { id: 2, text: "קוד התוכנה (הלוגיקה) על בסיס התחזית", correct: true },
                { id: 3, text: "המשתמש בלבד" }
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
                        <Link href="/chapter-2">
                            <Button size="lg" className="h-14 px-10 text-base bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-[0_0_40px_rgba(37,99,235,0.5)] border-t border-blue-400/30 hover:scale-105 transition-transform">
                                <span className="font-bold">המשך לפרק 2: סטטיסטיקה</span> <ChevronLeft className="mr-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}