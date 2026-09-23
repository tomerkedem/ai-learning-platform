"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, Terminal, Play, Check, Brain, 
  Target, Zap, Activity, Eye, ShieldAlert, TrendingUp, 
  Layers, AlertTriangle, Info, Sparkles, Scale, 
  BarChart3, Gauge, X, Lightbulb, MousePointer2, 
  ArrowRightLeft, Filter, LineChart, Binary
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { ChapterLayout } from '@/components/ChapterLayout';

// --- רכיבים פנימיים מפוצלים: מעבדות פרק 3 ---

// 1. מעבדת הנטייה המרכזית: ממוצע לעומת חציון
const CentralTendencyLab = () => {
    const [outlier, setOutlier] = useState(12);
    const data = [10, 12, 11, 9, outlier];
    
    const mean = (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1);
    const sorted = [...data].sort((a, b) => a - b);
    const median = sorted[2].toFixed(1);

    return (
        <div className="bg-slate-900/60 border border-indigo-500/30 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-md relative overflow-hidden text-right">
            <div className="absolute top-4 right-4 text-indigo-500/10 pointer-events-none"><BarChart3 size={80}/></div>
            <h4 className="text-indigo-400 font-black text-xl mb-4 flex items-center gap-3 justify-end tracking-tighter">
                מעבדה 01: ממוצע vs חציון <Scale size={20} />
            </h4>
            
            <div className="bg-indigo-500/5 border border-indigo-500/20 p-5 rounded-2xl mb-8">
                <p className="text-xs text-indigo-300 font-bold flex items-center justify-end gap-2 italic">
                    <Zap size={14}/> פקודה למפעיל:
                </p>
                <p className="text-[13px] text-slate-400 mt-1 leading-relaxed">
                    שנה את הערך של &quot;הנתון החריג&quot; (Outlier) וצפה כיצד הממוצע נגרר אחריו, בעוד שהחציון נשאר יציב ונאמן לרוב הדאטה.
                </p>
            </div>

            <div className="space-y-8 bg-black/40 p-8 rounded-3xl border border-slate-800 relative z-10">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Outlier Value: {outlier}</label>
                    <input type="range" min="10" max="250" value={outlier} onChange={(e) => setOutlier(Number(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-slate-950 p-6 rounded-2xl border border-red-500/20 text-center">
                        <div className="text-[10px] text-red-400 font-bold mb-1 uppercase tracking-widest">ממוצע (Mean)</div>
                        <div className="text-4xl font-mono font-black text-white">{mean}</div>
                        <div className="text-[10px] text-slate-500 mt-2 italic">רגיש מאוד לחריגות</div>
                    </div>
                    <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/20 text-center">
                        <div className="text-[10px] text-emerald-400 font-bold mb-1 uppercase tracking-widest">חציון (Median)</div>
                        <div className="text-4xl font-mono font-black text-white">{median}</div>
                        <div className="text-[10px] text-slate-500 mt-2 italic">יציב ומייצג</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2. סימולטור התפלגויות: החתימה של הדאטה
const DistributionModule = () => {
    const [type, setType] = useState<'normal' | 'skewed' | 'bimodal'>('normal');

    return (
        <div className="bg-slate-900/60 border border-blue-500/30 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-md text-right">
            <h4 className="text-blue-400 font-black text-xl mb-6 flex items-center gap-3 justify-end tracking-tighter">
                מעבדה 02: זיהוי התפלגויות <Activity size={24} />
            </h4>
            
            <div className="flex justify-end gap-2 mb-8">
                <Button onClick={() => setType('bimodal')} className={`h-8 rounded-full text-[11px] font-bold cursor-pointer ${type === 'bimodal' ? 'bg-blue-600' : 'bg-slate-800'}`}>דו-גבעית ⛰️</Button>
                <Button onClick={() => setType('skewed')} className={`h-8 rounded-full text-[11px] font-bold cursor-pointer ${type === 'skewed' ? 'bg-blue-600' : 'bg-slate-800'}`}>עקומה/זנב 🎣</Button>
                <Button onClick={() => setType('normal')} className={`h-8 rounded-full text-[11px] font-bold cursor-pointer ${type === 'normal' ? 'bg-blue-600' : 'bg-slate-800'}`}>נורמלית 🔔</Button>
            </div>

            <div className="bg-black/40 p-8 rounded-3xl border border-slate-800 min-h-62.5 flex flex-col justify-between">
                <div className="flex items-end justify-center gap-1 h-32 mb-6 px-4">
                    {Array.from({ length: 20 }).map((_, i) => {
                        let height = 10;
                        if (type === 'normal') height = Math.exp(-Math.pow(i - 10, 2) / 20) * 100;
                        if (type === 'skewed') height = Math.exp(-i / 5) * 100;
                        if (type === 'bimodal') height = (Math.exp(-Math.pow(i - 5, 2) / 5) + Math.exp(-Math.pow(i - 15, 2) / 5)) * 80;
                        
                        return (
                            <motion.div key={i} animate={{ height: `${height + 5}%` }} className="flex-1 bg-blue-500/40 border-t border-blue-400 rounded-t-sm" />
                        );
                    })}
                </div>
                
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-sm text-slate-400 leading-relaxed italic">
                    {type === 'normal' && "הסביבה האידיאלית. המודל לומד בצורה חלקה וה-Loss יורד בעקביות."}
                    {type === 'skewed' && "סכנה: הממוצע נגרר לזנב. פתרון: Log Scaling לדחיסת הנתונים."}
                    {type === 'bimodal' && "המודל מבולבל! יש כאן שני דפוסים שונים. מומלץ לפצל את הדאטה."}
                </div>
            </div>
        </div>
    );
};

// --- רכיב מבחן הסמכה פרק 3 ---
const ChapterThreeQuiz = () => {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});
    const [submitted, setSubmitted] = useState(false);
    
    const questions = [
        {
            id: 1,
            q: "מתי נעדיף להשתמש בחציון (Median) במקום בממוצע כדי להבין את הדאטה?",
            options: [
                "כשהדאטה נקי ומושלם",
                "כשיש ערכים קיצוניים (Outliers) שעלולים להטות את הממוצע בצורה מטעה",
                "כשיש מעט מאוד נתונים ב-Dataset"
            ],
            correct: 1,
            explanation: "נכון מאוד! החציון חסין לערכים קיצוניים כי הוא מייצג את הנתון שנמצא בדיוק באמצע, ללא תלות בעוצמת המספרים בקצוות."
        },
        {
            id: 2,
            q: "מה אומרת לנו סטיית תקן (Standard Deviation) גבוהה על יציבות המודל?",
            options: [
                "שהדאטה יציב מאוד והלמידה תהיה מהירה",
                "שהדאטה רועש ומפוזר, מה שיגרום ל-Loss להיות קופצני וקשה להתכנסות",
                "שאין צורך לנרמל את הנתונים"
            ],
            correct: 1,
            explanation: "בדיוק. פיזור גבוה משמעו שונות גדולה, מה שמחייב את המודל 'לעבוד קשה יותר' כדי למצוא דפוס אחיד."
        },
        {
            id: 3,
            q: "למה MSE (Mean Squared Error) בעייתי במיוחד בנוכחות חריגים?",
            options: [
                "כי הוא מעלה את השגיאה בריבוע, ובכך 'מנפח' ונותן משקל יתר לטעויות של החריגים",
                "כי הוא איטי מדי לחישוב",
                "כי הוא מתעלם לחלוטין מערכים קיצוניים"
            ],
            correct: 0,
            explanation: "נכון. העלאה בריבוע הופכת טעות גדולה לאסון מתמטי שמושך את כל הגרדיאנט לכיוון הלא נכון."
        }
    ];

    const score = Object.keys(answers).filter(id => answers[Number(id)] === questions[Number(id)-1].correct).length;

    return (
        <div className="max-w-3xl mx-auto py-24 border-t border-slate-800 mt-32">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-block p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 mb-2 border border-emerald-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]"><Gauge size={32} /></div>
                <h3 className="text-4xl font-black text-white tracking-tight">בוחן ניתוח נתונים: פרק 3</h3>
                <p className="text-slate-400 text-sm">הוכח שאתה יודע לזהות בעיות בדאטה לפני שהן הופכות לבעיות במודל.</p>
            </div>

            <div className="space-y-10">
                {questions.map((q) => {
                    const isAnswered = answers[q.id] !== undefined;
                    const isCorrect = answers[q.id] === q.correct;
                    return (
                        <div key={q.id} className={`bg-slate-900/40 border p-8 rounded-[2.5rem] text-right transition-all duration-500 ${isAnswered ? (isCorrect ? 'border-green-500/30' : 'border-red-500/30') : 'border-slate-800'}`}>
                            <p className="text-white font-bold text-lg mb-6 leading-tight">{q.q}</p>
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
                                        <div className="text-sm font-medium leading-relaxed italic text-right">{isCorrect ? q.explanation : "חשוב שוב על ההשלכה המתמטית של המדד על פונקציית הטעות."}</div>
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
                    <Button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < 3} className="h-16 px-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-black text-xl shadow-2xl cursor-pointer transition-all active:scale-95">סיום אימות נתונים</Button>
                ) : (
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="p-10 bg-slate-900 border-2 border-emerald-500/30 rounded-[3rem]">
                        <p className="text-6xl font-black text-white mb-6">{Math.round((score/3)*100)}%</p>
                        {score === 3 ? (
                            <Link href="/math/mathProbabilistic/chapter-4">
                                <Button className="h-16 px-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold cursor-pointer gap-3 text-lg transition-transform hover:scale-105 shadow-xl shadow-indigo-500/20">מעולה! ממשיכים להסתברות <ChevronLeft size={22}/></Button>
                            </Link>
                        ) : (
                            <Button onClick={() => {setSubmitted(false); setAnswers({}); setShowFeedback({});}} className="h-14 px-10 bg-red-600/20 text-red-400 rounded-full font-bold cursor-pointer">נדרש דיוק מקסימלי - נסה שוב</Button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default function ChapterThree() {
  return (
    <ChapterLayout courseId="mathProbabilistic" currentChapterId={3}>
        
        {/* פתיחה עוצמתית */}
        <section className="relative pt-16 pb-20 text-right">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto px-4">
                <div className="flex items-center gap-3 justify-end mb-8 text-emerald-400 font-bold tracking-widest uppercase text-[10px]">
                    <span>Data Quality Control: Stage 03</span>
                    <Layers size={16} fill="currentColor" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tighter leading-tight">
                    להבין את הדאטה <br/>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-blue-400 to-indigo-600">לפני שהמודל רואה אותו</span>
                </h1>
                
                <div className="prose prose-invert text-slate-300 text-base max-w-4xl ml-auto leading-relaxed space-y-6">
                    <p className="text-xl font-bold border-r-4 border-emerald-500 pr-6 py-2 bg-emerald-500/5 rounded-l-2xl">
                        הפער הקריטי ביותר ב-AI אינו בבחירת האלגוריתם, אלא בהבנה מה באמת &quot;מסתתר&quot; בתוך הדאטה שאתה מאמן עליו את המודל.
                    </p>
                    <p>
                        רוב הבעיות המשמעותיות ב-ML (יציבות לא טובה, Loss קופץ, התכנסות איטית) נובעות מליקויים בנתונים ולא באלגוריתם. סטטיסטיקה תיאורית היא כלי הנדסי שמאפשר לך לראות את המבנה הבסיסי לפני שאתה מריץ שורת קוד אחת של אימון.
                    </p>
                </div>
            </motion.div>
        </section>

        {/* שלב 1: נטייה מרכזית */}
        <section className="py-24 border-t border-slate-800/50 text-right">
            <div className="max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div className="space-y-8 order-2 lg:order-1">
                        <div className="flex items-center gap-4 justify-end">
                            <h2 className="text-3xl font-black text-white tracking-tight">נטייה מרכזית: המרכז המטעה</h2>
                            <Target className="text-red-400" size={32} />
                        </div>
                        <p className="text-slate-300 text-[15px] leading-relaxed">
                            הממוצע (Mean) רגיש מאוד לחריגות שכן הוא משקלל כל נקודה. במצבים של דאטה &quot;רעוע&quot;, החציון (Median) מציג תמונה אמינה יותר לגבי רוב הנתונים שכן הוא אינו מושפע מערכים קיצוניים.
                        </p>
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-inner font-mono text-emerald-500 text-xs text-left" dir="ltr">
                            import numpy as np<br/><br/>
                            <span className="text-slate-500"># Response times (ms) with an outlier</span><br/>
                            data = np.array([10, 12, 11, 9, 250])<br/>
                            print(&quot;Mean:&quot;, np.mean(data)) # Affected!<br/>
                            print(&quot;Median:&quot;, np.median(data)) # Stable!
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <CentralTendencyLab />
                    </div>
                </div>
            </div>
        </section>

        {/* שלב 2: התפלגויות */}
        <section className="py-24 bg-slate-950/40 text-right">
            <div className="max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <DistributionModule />
                    </div>
                    <div className="space-y-8 order-1 lg:order-2">
                        <div className="flex items-center gap-4 justify-end">
                            <h2 className="text-3xl font-black text-white tracking-tight">החתימה של הדאטה</h2>
                            <Activity className="text-blue-400" size={32} />
                        </div>
                        <div className="prose prose-invert text-slate-300 text-[15px] leading-relaxed space-y-6">
                            <p>
                                צורת ההתפלגות קובעת כיצד המודל יכול ללמוד דפוסים יציבים. זוהי למעשה היסטוגרמה שמראה את תדירות הופעתם של כל ערך בדאטה.
                            </p>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 bg-slate-900 rounded-xl border-r-4 border-blue-500">
                                    <span className="text-white font-bold block mb-1">התפלגות נורמלית 🔔</span>
                                    <p className="text-xs text-slate-400 italic">הסביבה הלימודית היציבה ביותר. המודל לומד בצורה חלקה וה-Loss יורד קבוע.</p>
                                </div>
                                <div className="p-4 bg-slate-900 rounded-xl border-r-4 border-yellow-500">
                                    <span className="text-white font-bold block mb-1">התפלגות עקומה 🎣</span>
                                    <p className="text-xs text-slate-400 italic">הזנב מושך את הממוצע. המודל נוטה לתת משקל יתר למקרים הנדירים בזנב.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* שלב 3: Z-Score וזיהוי חריגות */}
        <section className="py-24 border-t border-slate-800/50 text-right">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    <div className="flex-1 space-y-8">
                        <div className="p-4 bg-orange-500/10 rounded-3xl w-fit ml-auto text-orange-500 border border-orange-500/20 shadow-sm"><ShieldAlert size={32} /></div>
                        <h2 className="text-3xl font-black text-white tracking-tighter">Z-Score: כלי המעקב של המפתח</h2>
                        <div className="prose prose-invert text-slate-300 text-[15px] leading-relaxed space-y-6">
                            <p>
                                כדי לאתר חריגות במהירות, ניתן להשתמש בציון תקן (Z-Score). הוא מספר לנו כמה סטיות תקן הערך הספציפי רחוק מהממוצע.
                            </p>
                            <ul className="text-xs text-slate-400 space-y-2">
                                <li className="flex items-center gap-2 justify-end">ערך נורמלי וטיפוסי <span className="font-mono text-white">|Z| ≈ 0</span></li>
                                <li className="flex items-center gap-2 justify-end text-yellow-400/80">ערך חריג יחסית <span className="font-mono text-white">|Z| ≥ 2</span></li>
                                <li className="flex items-center gap-2 justify-end text-red-500 font-bold tracking-tighter italic animate-pulse">ערך קיצוני מאוד - דורש טיפול! <span className="font-mono text-white">|Z| ≥ 3</span></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="flex-1 bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-orange-500/20"></div>
                        <h5 className="text-slate-500 font-mono text-[10px] uppercase mb-4 tracking-widest italic">Simulation: Outlier Detection</h5>
                        <div className="font-mono text-sm text-blue-300 bg-black/40 p-6 rounded-xl border border-slate-800 mb-6 text-left" dir="ltr">
                            # Server latency (ms)<br/>
                            times = np.array([50, 52, 55, 60, 48, 150])<br/><br/>
                            z_scores = (times - np.mean(times)) / np.std(times)<br/>
                            print(&quot;Z-scores:&quot;, z_scores)<br/>
                            # Index 5 (150ms) will show Z &gt; 2.5
                        </div>
                        <div className="bg-orange-500/5 p-4 rounded-xl border border-orange-500/20 text-[13px] text-orange-200 leading-relaxed italic">
                            &quot;ערך קיצוני אחד יוצר בליטות בגרף ה-Loss וגורם למודל לבזבז איטרציות רבות בניסיון לרצות את החריגה.&quot;
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* שלב 4: סיכום הנדסי ובחירת Loss */}
        <section className="py-24 bg-slate-950/20 text-right">
             <div className="max-w-4xl mx-auto px-4">
                <h3 className="text-2xl font-black text-white mb-12 flex items-center gap-3 justify-end tracking-tight">ההשלכה על בחירת פונקציית ה-Loss</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-red-500/30 transition-all group">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">High Sensitivity</span>
                            <h4 className="text-white font-bold text-lg">MSE (Mean Squared Error)</h4>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">מענישה בחומרה על טעויות גדולות בגלל ההעלאה בריבוע. מתאימה רק כשהדאטה נקי ויציב.</p>
                        <div className="w-12 h-1 bg-red-500 opacity-30"></div>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/30 transition-all group">
                         <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Robust Strategy</span>
                            <h4 className="text-white font-bold text-lg">MAE (Mean Absolute Error)</h4>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">פחות רגישה לחריגים משום שאינה מעלה את הטעות בריבוע. המדד המועדף כשהדאטה רועש.</p>
                        <div className="w-12 h-1 bg-emerald-500 opacity-30"></div>
                    </div>
                </div>
             </div>
        </section>

        {/* בוחן הסמכה סופי */}
        <ChapterThreeQuiz />

        {/* סיום הפרק */}
        <section className="py-40 text-center relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
             <motion.div initial={{ scale: 0.98, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="max-w-2xl mx-auto px-4 relative z-10">
                <Sparkles className="mx-auto text-emerald-400 mb-8 opacity-60" size={48} />
                <h2 className="text-4xl font-black text-white mb-8 tracking-tight italic">אימות נתונים הושלם</h2>
                <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                    הבנת שהסטטיסטיקה היא השכבה הראשונה של בקרת איכות למודלים. כעת, כשאתה יודע לזהות רעש, חריגות והתפלגויות, אתה מוכן לצלול לעולם ההסתברות – שם המודל לומד לקבל החלטות מתוך אי-ודאות.
                </p>
            </motion.div>
        </section>

    </ChapterLayout>
  );
}