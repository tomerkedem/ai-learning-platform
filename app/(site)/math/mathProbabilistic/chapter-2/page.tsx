"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, Terminal, Play, Check, Brain, 
  Target, Zap, Activity, Fingerprint, Compass, Eye, 
  ShieldAlert, Cpu, Layers, Info, Sparkles, Scale, 
  Code2, Database, Binary, Gauge, X, Lightbulb, 
  MousePointer2, Map as MapIcon, Move, Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { ChapterLayout } from '@/components/ChapterLayout';

// --- רכיבים פנימיים מפוצלים: מעבדות פרק 2 ---

// 1. מעבדת הניווט המרחבי (Vector as GPS)
const VectorGPSModule = () => {
    const [age, setAge] = useState(35);
    const [income, setIncome] = useState(80000);
    const [purchases, setPurchases] = useState(12);

    return (
        <div className="bg-slate-900/60 border border-blue-500/30 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-4 right-4 text-blue-500/10 rotate-12 pointer-events-none"><MapIcon size={80}/></div>
            <h4 className="text-blue-400 font-black text-xl mb-4 flex items-center gap-3 justify-end tracking-tighter">
                מעבדה 01: כתובת GPS בתוך המרחב <Compass size={20} />
            </h4>
            
            <div className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-2xl mb-8 text-right">
                <p className="text-xs text-blue-300 font-bold flex items-center justify-end gap-2 italic">
                    <Zap size={14}/> פקודה למפעיל:
                </p>
                <p className="text-[13px] text-slate-400 mt-1">
                    שנה את מאפייני הלקוח וראה כיצד ה&quot;מיקום&quot; שלו בזיכרון המודל משתנה. ב-AI, מיקום הוא משמעות. 
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-black/40 p-8 rounded-3xl border border-slate-800 relative z-10">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono text-slate-500"><span>90</span><span>AGE: {age}</span><span>18</span></div>
                        <input type="range" min="18" max="90" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono text-slate-500"><span>150K</span><span>INCOME: {income}</span><span>20K</span></div>
                        <input type="range" min="20000" max="150000" step="1000" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                    </div>
                </div>
                
                <div className="bg-slate-950 p-6 rounded-2xl border border-blue-500/30 text-center space-y-4">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Client Vector (DNA)</div>
                    <div className="font-mono text-2xl text-blue-400 font-black">[{age}, {income.toLocaleString()}, {purchases}]</div>
                    <p className="text-[11px] text-slate-500 italic leading-relaxed">הכתובת הייחודית של הלקוח במרחב המשתמשים שלך. </p>
                </div>
            </div>
        </div>
    );
};

// 2. מעבדת הטרנספורמציה (Matrix-Vector Interaction)
const MatrixTransformModule = () => {
    const [x1, setX1] = useState(3);
    const [x2, setX2] = useState(5);
    
    // Matrix W: [[1, 0], [0, 1], [1, -1]]
    const result = [x1, x2, x1 - x2];

    return (
        <div className="bg-slate-900/60 border border-emerald-500/30 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-md text-right">
            <h4 className="text-emerald-400 font-black text-xl mb-4 flex items-center gap-3 justify-end">
                מעבדה 02: המנוע החישובי (מטריצות) <Cpu size={20} />
            </h4>
            
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl mb-8">
                <p className="text-xs text-emerald-300 font-bold flex items-center justify-end gap-2 italic">
                    <Zap size={14}/> פקודה למפעיל:
                </p>
                <p className="text-[13px] text-slate-400 mt-1 leading-relaxed">
                    שנה את וקטור הקלט (X) וצפה כיצד הכפל במטריצת המשקלים (W) מייצר ייצוג חדש. כך שכבות בבינה מלאכותית מעבירות מידע. 
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
                <div className="flex flex-col gap-4 bg-black/40 p-6 rounded-2xl border border-slate-800 w-full lg:w-48 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Input Vector (x)</span>
                    <div className="flex justify-center gap-2">
                        <input type="number" value={x1} onChange={(e)=>setX1(Number(e.target.value))} className="w-12 bg-slate-900 border border-slate-700 rounded text-center text-white py-1"/>
                        <input type="number" value={x2} onChange={(e)=>setX2(Number(e.target.value))} className="w-12 bg-slate-900 border border-slate-700 rounded text-center text-white py-1"/>
                    </div>
                </div>
                
                <div className="text-slate-600"><X size={24}/></div>

                <div className="font-mono text-xs p-4 bg-slate-800/50 rounded-lg text-slate-400 border border-slate-700 text-left" dir="ltr">
                    W = [[1, 0],<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[0, 1],<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1, -1]]
                </div>

                <div className="text-slate-600"><Move size={24} className="rotate-90 lg:rotate-0"/></div>

                <div className="flex flex-col gap-2 bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/30 w-full lg:w-48 text-center">
                    <span className="text-[10px] text-emerald-500 font-bold uppercase">Transformed (y)</span>
                    <div className="font-mono text-xl text-white font-bold tracking-tighter">
                        [{result[0]}, {result[1]}, {result[2]}]
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- רכיב מבחן פרק 2 ---
const ChapterTwoQuiz = () => {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});
    const [submitted, setSubmitted] = useState(false);
    
    const questions = [
        {
            id: 1,
            q: "מה מייצגת 'נורמה' של וקטור בעולם הנתונים?",
            options: ["את כמות המילים בטקסט", "את העוצמה הכללית או ה'גודל' המספרי של האות", "את סוג הפונט שבו נכתב המידע"],
            correct: 1,
            explanation: "נכון. הנורמה מסכמת את גודל הוקטור למספר אחד, מה שעוזר לנו לשמור על איזון מספרי ולמנוע מנתונים קיצוניים להטות את המודל. "
        },
        {
            id: 2,
            q: "למה משתמשים במטריצות כמעט בכל שכבה ברשת נוירונים?",
            options: ["כדי להציג טבלאות למשתמש", "כדי לבצע חישובים על קבוצות גדולות של וקטורים בבת אחת וביעילות", "כדי למחוק וקטורים ישנים"],
            correct: 1,
            explanation: "בדיוק. המטריצה היא המנוע החישובי. היא מאפשרת להחיל טרנספורמציות ומשקלים על מיליוני נתונים במקביל. "
        },
        {
            id: 3,
            q: "מה קורה בזמן פעולת 'טרנספוז' (Transpose) במטריצה?",
            options: ["המידע בתוך התאים משתנה", "שורות הופכות לעמודות ולהיפך לצורך התאמה מבנית", "המטריצה נמחקת מהזיכרון"],
            correct: 1,
            explanation: "נכון מאוד. הטרנספוז לא משנה את התוכן אלא רק את הארגון שלו, מה שמאפשר לוקטורים ומטריצות 'לדבר באותה שפה' בזמן חישוב למידה. "
        }
    ];

    const score = Object.keys(answers).filter(id => answers[Number(id)] === questions[Number(id)-1].correct).length;

    return (
        <div className="max-w-3xl mx-auto py-24 border-t border-slate-800 mt-32">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-block p-3 bg-blue-500/10 rounded-2xl text-blue-400 mb-2 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]"><Gauge size={32} /></div>
                <h3 className="text-4xl font-black text-white tracking-tight">בוחן הסמכה: גיאומטריית ה-AI</h3>
                <p className="text-slate-400 text-sm">הוכח שליטה בוקטורים ומטריצות כדי להפוך למפתח AI מוסמך.</p>
            </div>

            <div className="space-y-10">
                {questions.map((q) => {
                    const isAnswered = answers[q.id] !== undefined;
                    const isCorrect = answers[q.id] === q.correct;
                    return (
                        <div key={q.id} className={`bg-slate-900/40 border p-8 rounded-[2.5rem] text-right transition-all duration-500 ${isAnswered ? (isCorrect ? 'border-green-500/30' : 'border-red-500/30') : 'border-slate-800'}`}>
                            <p className="text-white font-bold text-lg mb-6">{q.q}</p>
                            <div className="grid gap-3">
                                {q.options.map((opt, oIdx) => (
                                    <button key={oIdx} onClick={() => {!submitted && setAnswers({...answers, [q.id]: oIdx}); setShowFeedback({...showFeedback, [q.id]: true})}}
                                        className={`p-4 rounded-2xl text-right transition-all border text-sm cursor-pointer ${answers[q.id] === oIdx ? (oIdx === q.correct ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10') : 'border-slate-800 bg-black/20 text-slate-400 hover:border-slate-600'}`}
                                        disabled={submitted}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{opt}</span>
                                            {answers[q.id] === oIdx && (oIdx === q.correct ? <Check size={18} className="text-green-400"/> : <X size={18} className="text-red-400"/>)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <AnimatePresence>
                                {showFeedback[q.id] && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 p-5 rounded-2xl border flex items-start gap-3 justify-end ${isCorrect ? 'bg-green-500/5 border-green-500/20 text-green-400/90' : 'bg-red-500/5 border-red-500/20 text-red-400/90'}`}>
                                        <div className="text-sm font-medium leading-relaxed italic text-right">{isCorrect ? q.explanation : "נסה שוב. זכור שמטריצות ווקטורים הם כלים לסידור ועיבוד יעיל של מידע. "}</div>
                                        <Lightbulb size={18} className="shrink-0 mt-1"/>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-16 text-center">
                {!submitted ? (
                    <Button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < 3} className="h-16 px-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black text-xl shadow-2xl cursor-pointer">שלח מבחן</Button>
                ) : (
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="p-10 bg-slate-900 border-2 border-blue-500/30 rounded-[3rem]">
                        <p className="text-6xl font-black text-white mb-6">{Math.round((score/3)*100)}%</p>
                        {score === 3 ? (
                            <Link href="/math/mathProbabilistic/chapter-3">
                                <Button className="h-16 px-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold cursor-pointer gap-3 text-lg transition-transform hover:scale-105">כל הכבוד! עוברים לפרק 3 <ChevronLeft size={22}/></Button>
                            </Link>
                        ) : (
                            <Button onClick={() => {setSubmitted(false); setAnswers({}); setShowFeedback({});}} className="h-14 px-10 bg-red-600/20 text-red-400 rounded-full font-bold cursor-pointer">נסה שוב - נדרשים 100% להמשך</Button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default function ChapterTwo() {
  return (
    <ChapterLayout courseId="mathProbabilistic" currentChapterId={2}>
        
        {/* פתיחה דרמטית: מפות ולא רשימות */}
        <section className="relative pt-16 pb-20 text-right">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto px-4">
                <div className="flex items-center gap-3 justify-end mb-8">
                    <span className="bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-blue-500/20">Spatial Intelligence</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tighter leading-tight">
                    העולם הוא מפה, <br/>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-emerald-400 to-indigo-500">הנתונים הם מיקומים</span>
                </h1>
                
                <div className="prose prose-invert text-slate-300 text-base max-w-3xl ml-auto leading-relaxed space-y-6">
                    <p className="text-xl font-bold border-r-4 border-blue-500 pr-6 py-2 bg-blue-500/5 rounded-l-2xl">
                        בואו נשכח ממתמטיקה קלאסית. ב-AI, אתה לא עובד עם רשימות. אתה עובד עם מפות. 
                    </p>
                    <p>
                        כל נתון שאתה מזין למודל – מילה, מחיר או תמונה – מקבל כתובת GPS מדויקת בתוך מרחב דיגיטלי עצום. הכתובת הזו היא <strong>הוקטור</strong>, והמרחב הוא המרחב הרב-ממדי של המודל שלך. 
                    </p>
                </div>
            </motion.div>
        </section>

        {/* שלב 1: הוקטור כזהות */}
        <section className="py-24 border-t border-slate-800/50 text-right">
            <div className="max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div className="space-y-8 order-2 lg:order-1">
                        <div className="flex items-center gap-4 justify-end">
                            <h2 className="text-3xl font-black text-white tracking-tight">הוקטור הוא ה-DNA</h2>
                            <Layers className="text-emerald-500" size={32} />
                        </div>
                        <p className="text-slate-300 text-[15px] leading-relaxed">
                            וקטור הוא דרך לייצג מידע בצורה מסודרת, אחידה וקלה לעיבוד. במקום לשמור תכונות בצורה מפוזרת, וקטור מרכז אותן לרשימה אחת שבה לכל מקום יש תפקיד ברור. 
                        </p>
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-inner font-mono text-emerald-500 text-xs text-left" dir="ltr">
                            import numpy as np<br/><br/>
                            <span className="text-slate-500"># Profile: [Age, Income, Purchases]</span><br/>
                            client_vector = np.array([35, 80000, 12])<br/>
                            print(&quot;Vector Shape:&quot;, client_vector.shape)
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <VectorGPSModule />
                    </div>
                </div>
            </div>
        </section>

        {/* שלב 2: נורמה ועוצמת האות */}
        <section className="py-24 bg-slate-950/40 text-right">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="flex-1 space-y-6 order-2 lg:order-1">
                        <h2 className="text-3xl font-black text-white flex items-center justify-end gap-3 italic">נורמה: כמה האות חזק? <Scale size={28} className="text-blue-400" /></h2>
                        <p className="text-slate-300 text-base leading-relaxed">
                            לא מספיק לדעת מהם הערכים בוקטור. חשוב להבין גם את <strong>העוצמה הכללית</strong> שלהם. הנורמה היא מספר יחיד שמייצג את &quot;גודל&quot; הוקטור כולו. 
                        </p>
                        <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                             <p className="text-blue-400 font-bold mb-2 flex items-center justify-end gap-2 text-sm">הוראות הרצה בקוד <Terminal size={14}/></p>
                             <div className="font-mono text-xs text-blue-300 bg-black/40 p-4 rounded-xl border border-slate-800 text-left" dir="ltr">
                                v = np.array([2.0, 3.0, 6.0])<br/>
                                norm = np.linalg.norm(v)<br/>
                                print(&quot;Norm:&quot;, norm) # Output: 7.0
                             </div>
                        </div>
                    </div>
                    <div className="flex-1 bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] relative group">
                        <div className="absolute top-4 left-4 text-emerald-500/10 pointer-events-none group-hover:scale-110 transition-transform duration-700"><Maximize2 size={120}/></div>
                        <p className="text-slate-400 text-sm italic leading-relaxed relative z-10">
                            &quot;נורמה גבוהה מצביעה על וקטור חזק יותר. במודלים זה מונע מצבים שבהם פריטים מסוימים 'תופסים יותר מדי מקום' רק בגלל ערכים גדולים.&quot; 
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* שלב 3: המנוע החישובי - מטריצות */}
        <section className="py-24 border-t border-slate-800/50 text-right">
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <div className="p-4 bg-emerald-500/10 rounded-full w-fit mx-auto text-emerald-500 border border-emerald-500/20 shadow-lg"><Binary size={36} /></div>
                    <h2 className="text-4xl font-black text-white tracking-tighter">מטריצות: המנוע מאחורי הקלעים</h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto italic">
                        מטריצה היא פשוט טבלה שמכילה הרבה וקטורים יחד. זה הכלי שמאפשר לבצע חישובים על קבוצות ערכים בבת אחת. 
                    </p>
                </div>

                <MatrixTransformModule />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/30 transition-all group">
                        <h4 className="text-white font-bold text-xl mb-4">כפל מטריצה בוקטור</h4>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            זו הפעולה המרכזית ב-AI. המטריצה מקבלת וקטור והופכת אותו לוקטור חדש (טרנספורמציה). שלוש שורות במטריצה ייצרו שלושה ערכים חדשים בוקטור. 
                        </p>
                    </div>
                    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition-all group">
                        <h4 className="text-white font-bold text-xl mb-4 italic">טרנספוז (Transpose)</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            היפוך שורות לעמודות. פעולה חיונית כשהחישוב זורם אחורה (בשלב הלמידה) כדי להתאים גדלים וכיווניות של נתונים. 
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* בוחן הסמכה סופי */}
        <ChapterTwoQuiz />

    </ChapterLayout>
  );
}