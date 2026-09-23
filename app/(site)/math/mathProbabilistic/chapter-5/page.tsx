"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, Terminal, Play, Check, Brain, 
  Target, Zap, Activity, Eye, ShieldAlert, TrendingUp, 
  Layers, AlertTriangle, Info, Sparkles, Scale, 
  Gauge, X, Lightbulb, MousePointer2, 
  Binary, Search, Compass, Waves, ArrowDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { ChapterLayout } from '@/components/ChapterLayout';

// --- רכיבים פנימיים מפוצלים: מעבדות פרק 5 ---

// 1. מעבדת הלוס: MSE מול MAE (הענשה מול סובלנות)
const LossComparisonLab = () => {
    const [prediction, setPrediction] = useState(40);
    const target = 30;
    
    const error = Math.abs(target - prediction);
    const mse = Math.pow(error, 2);
    const mae = error;

    return (
        <div className="bg-slate-900/60 border border-red-500/30 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-md relative overflow-hidden text-right">
            <div className="absolute top-4 right-4 text-red-500/10 pointer-events-none"><Target size={80}/></div>
            <h4 className="text-red-400 font-black text-xl mb-4 flex items-center gap-3 justify-end tracking-tighter">
                מעבדה 01: פילוסופיית הענישה <Scale size={20} />
            </h4>
            
            <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl mb-8">
                <p className="text-xs text-red-300 font-bold flex items-center justify-end gap-2 italic text-right">
                    <Zap size={14}/> פקודה למפעיל:
                </p>
                <p className="text-[13px] text-slate-400 mt-1 leading-relaxed text-right">
                    הזז את התחזית של המודל הרחק מהמטרה (30). שים לב איך ב-MSE הטעות &quot;מתפוצצת&quot; ככל שהפער גדל, בעוד שב-MAE היא עולה בצורה מתונה וישרה.
                </p>
            </div>

            <div className="space-y-8 relative z-10">
                <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 tracking-widest uppercase">
                        <span>Prediction: {prediction}</span>
                        <span>Target: {target}</span>
                    </div>
                    <input type="range" min="0" max="100" value={prediction} onChange={(e) => setPrediction(Number(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-black/40 p-6 rounded-2xl border border-red-500/20 text-center relative overflow-hidden">
                        <motion.div 
                            animate={{ opacity: [0.2, 0.4, 0.2] }} 
                            className="absolute inset-0 bg-red-500/5 pointer-events-none" 
                        />
                        <div className="text-[10px] text-red-400 font-bold mb-1 uppercase tracking-widest">MSE (Squared)</div>
                        <div className="text-4xl font-mono font-black text-white">{mse.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-500 mt-2 italic">מענישה בחומרה חריגות</div>
                    </div>
                    <div className="bg-black/40 p-6 rounded-2xl border border-blue-500/20 text-center">
                        <div className="text-[10px] text-blue-400 font-bold mb-1 uppercase tracking-widest">MAE (Absolute)</div>
                        <div className="text-4xl font-mono font-black text-white">{mae}</div>
                        <div className="text-[10px] text-slate-500 mt-2 italic">יציבה וסובלנית</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2. סימולטור Cross Entropy: ביטחון עצמי בטעות
const CrossEntropyModule = () => {
    const [confidence, setConfidence] = useState(0.2); // הסתברות לקטגוריה הנכונה
    const ce = -Math.log(confidence + 1e-12).toFixed(2);

    return (
        <div className="bg-slate-900/60 border border-indigo-500/30 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-md text-right relative overflow-hidden">
            <div className="absolute top-4 left-4 text-indigo-500/10 pointer-events-none"><Waves size={80}/></div>
            <h4 className="text-indigo-400 font-black text-xl mb-4 flex items-center gap-3 justify-end tracking-tighter">
                מעבדה 02: הביטחון בטעות <Waves size={20} />
            </h4>
            
            <p className="text-slate-400 text-sm mb-8 leading-relaxed text-right">
                בסיווג, לא מספיק לדעת אם המודל צדק. חשוב לדעת עד כמה הוא היה <strong>בטוח</strong>. ב-Cross Entropy, ענישה על טעות שנעשתה בביטחון גבוה היא קטלנית.
            </p>

            <div className="bg-black/40 p-8 rounded-3xl border border-slate-800 space-y-8 relative z-10">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-right">
                        Confidence in Correct Class: {(confidence * 100).toFixed(0)}%
                    </label>
                    <input 
                        type="range" min="0.01" max="1" step="0.01" value={confidence} 
                        onChange={(e) => setConfidence(parseFloat(e.target.value))} 
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                </div>

                <div className="text-center py-6 border-y border-slate-800/50">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Cross Entropy Loss</div>
                    <motion.div 
                        key={ce}
                        initial={{ scale: 1.1, color: "#fff" }}
                        animate={{ scale: 1, color: Number(ce) > 2 ? "#ef4444" : "#fff" }}
                        className="text-6xl font-mono font-black"
                    >
                        {ce}
                    </motion.div>
                </div>
                <p className="text-[11px] text-slate-500 italic text-center leading-relaxed">
                    ככל שהמודל בטוח יותר בטעות שלו (Confidence נמוך לקטגוריה הנכונה), הלוס מזנק לאינסוף.
                </p>
            </div>
        </div>
    );
};

// --- רכיב מבחן הסמכה פרק 5 ---
const ChapterFiveQuiz = () => {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});
    const [submitted, setSubmitted] = useState(false);
    
    const questions = [
        {
            id: 1,
            q: "מה קורה בתוך פונקציית MSE כאשר השגיאה גדלה?",
            options: [
                "השגיאה נשארת באותו גודל יחסי",
                "השגיאה מועלית בריבוע, מה שגורם לענישה אגרסיבית על חריגות",
                "השגיאה מתאפסת באופן אוטומטי"
            ],
            correct: 1,
            explanation: "מדויק. MSE מעצימה טעויות גדולות. זה מעולה לדאטה נקי, אבל מסוכן כשיש חריגים (Outliers) שעלולים להטות את המודל."
        },
        {
            id: 2,
            q: "מדוע Cross Entropy נחשבת לסטנדרט במשימות סיווג?",
            options: [
                "כי היא מודדת רק אם המודל צדק או טעה (Binary)",
                "כי היא מודדת את הפער בין התפלגויות ההסתברות ומענישה על בטחון עצמי שגוי",
                "כי היא הפונקציה המהירה ביותר לחישוב ב-NumPy"
            ],
            correct: 1,
            explanation: "נכון מאוד. היא נותנת משוב איכותי שאומר למודל לא רק שזה שגוי, אלא עד כמה ההסתברות שהוא נתן הייתה רחוקה מהאמת."
        },
        {
            id: 3,
            q: "איזו פונקציה תעדיף להשתמש בה בדאטה רועש מאוד עם הרבה תקלות מדידה?",
            options: [
                "MSE כדי לזהות את התקלות מהר",
                "MAE כדי לשמור על יציבות ולא להיגרר אחרי החריגות",
                "פונקציה קבועה של 0"
            ],
            correct: 1,
            explanation: "בדיוק. MAE יציבה יותר כי היא מתייחסת לכל שגיאה באופן ליניארי ולא מעצימה את הרעש האקראי."
        }
    ];

    const score = Object.keys(answers).filter(id => answers[Number(id)] === questions[Number(id)-1].correct).length;

    return (
        <div className="max-w-3xl mx-auto py-24 border-t border-slate-800 mt-32">
            <div className="text-center mb-16 space-y-4 text-right">
                <div className="inline-block p-3 bg-red-500/10 rounded-2xl text-red-400 mb-2 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]"><Gauge size={32} /></div>
                <h3 className="text-4xl font-black text-white tracking-tight">בוחן המצפן: פרק 5</h3>
                <p className="text-slate-400 text-sm">הוכח שאתה מבין איך המודל חווה את הטעויות שלו.</p>
            </div>

            <div className="space-y-10">
                {questions.map((q) => {
                    const isAnswered = answers[q.id] !== undefined;
                    const isCorrect = answers[q.id] === q.correct;
                    return (
                        <div key={q.id} className={`bg-slate-900/40 border p-8 rounded-[2.5rem] text-right transition-all duration-500 ${isAnswered ? (isCorrect ? 'border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.05)]' : 'border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.05)]') : 'border-slate-800'}`}>
                            <p className="text-white font-bold text-lg mb-6 leading-tight">{q.q}</p>
                            <div className="grid gap-3">
                                {q.options.map((opt, oIdx) => (
                                    <button key={oIdx} onClick={() => {!submitted && setAnswers({...answers, [q.id]: oIdx}); setShowFeedback({...showFeedback, [q.id]: true})}}
                                        className={`p-4 rounded-2xl text-right transition-all border text-sm cursor-pointer ${answers[q.id] === oIdx ? (oIdx === q.correct ? 'border-green-500 bg-green-500/10 text-white' : 'border-red-500 bg-red-500/10 text-white') : 'border-slate-800 bg-black/20 text-slate-400 hover:border-slate-600'}`}
                                        disabled={submitted}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="flex-1">{opt}</span>
                                            {answers[q.id] === oIdx && (oIdx === q.correct ? <Check size={18} className="text-green-400 shrink-0"/> : <X size={18} className="text-red-400 shrink-0"/>)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <AnimatePresence>
                                {showFeedback[q.id] && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 p-5 rounded-2xl border flex items-start gap-3 justify-end ${isCorrect ? 'bg-green-500/5 border-green-500/20 text-green-400/90' : 'bg-red-500/5 border-red-500/20 text-red-400/90'}`}>
                                        <div className="text-sm font-medium leading-relaxed italic text-right">{isCorrect ? q.explanation : "חשוב על הדרך שבה הפונקציה מעבדת את הפער בין התחזית למציאות."}</div>
                                        <Lightbulb size={18} className="shrink-0 mt-1 opacity-60"/>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-16 text-center">
                {!submitted ? (
                    <Button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < 3} className="h-16 px-16 bg-red-600 hover:bg-red-500 text-white rounded-full font-black text-xl shadow-2xl cursor-pointer transition-all active:scale-95">סיום והסמכת לוס</Button>
                ) : (
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="p-10 bg-slate-900 border-2 border-red-500/30 rounded-[3rem] shadow-3xl">
                        <div className="mb-6">
                            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Model Compass Score</span>
                            <div className="text-6xl font-black text-white">{Math.round((score/3)*100)}%</div>
                        </div>
                        {score === 3 ? (
                            <Link href="/math/mathProbabilistic/chapter-6">
                                <Button className="h-16 px-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold cursor-pointer gap-3 text-lg transition-transform hover:scale-105 shadow-xl shadow-indigo-500/20">כל הכבוד! למנוע הלמידה <ChevronLeft size={22}/></Button>
                            </Link>
                        ) : (
                            <Button onClick={() => {setSubmitted(false); setAnswers({}); setShowFeedback({});}} className="h-14 px-10 bg-red-600/20 text-red-400 rounded-full font-bold cursor-pointer">נדרש כיול מחדש - נסה שוב</Button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default function ChapterFive() {
  return (
    <ChapterLayout courseId="mathProbabilistic" currentChapterId={5}>
        
        {/* פתיחה דרמטית: הלוס כמצפן */}
        <section className="relative pt-16 pb-20 text-right">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto px-4">
                <div className="flex items-center gap-3 justify-end mb-8 text-red-400 font-bold tracking-widest uppercase text-[10px]">
                    <span>Error Dynamics: Stage 05</span>
                    <Target size={16} fill="currentColor" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tighter leading-tight">
                    פונקציות עלות: <br/>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 via-orange-400 to-indigo-600 text-right">איך מודל מרגיש שהוא טועה</span>
                </h1>
                
                <div className="prose prose-invert text-slate-300 text-base max-w-4xl ml-auto leading-relaxed space-y-6">
                    <p className="text-xl font-bold border-r-4 border-red-500 pr-6 py-2 bg-red-500/5 rounded-l-2xl italic">
                        בכל תהליך למידה יש רגע אחד שמכוון את הכול. הרגע שבו המודל בודק כמה הוא טעה. בלי היכולת למדוד טעות, אין מה לשפר, אין מה לכוון, ואין דרך לייצר למידה אמיתית.
                    </p>
                    <p>
                        פונקציית עלות היא המצפן של המודל. היא מגדירה איזו טעות נחשבת חמורה ואיך המודל אמור להגיב אליה. מהנדס שבוחר Loss בוחר פילוסופיית למידה למודל שלו.
                    </p>
                </div>
            </motion.div>
        </section>

        {/* שלב 1: MSE vs MAE */}
        <section className="py-24 border-t border-slate-800/50 text-right">
            <div className="max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div className="space-y-8 order-2 lg:order-1">
                        <div className="flex items-center gap-4 justify-end">
                            <h2 className="text-3xl font-black text-white tracking-tight">רגרסיה: בין ענישה לסובלנות</h2>
                            <Scale className="text-orange-400" size={32} />
                        </div>
                        <div className="prose prose-invert text-slate-300 text-[15px] leading-relaxed space-y-4">
                            <p>
                                <strong>MSE (Mean Squared Error):</strong> מעלה כל שגיאה בריבוע. שגיאות קטנות נעלמות, שגיאות גדולות הופכות למפלצות. זה מכריח את המודל להתמקד בחריגות.
                            </p>
                            <p>
                                <strong>MAE (Mean Absolute Error):</strong> לוקחת ערך מוחלט בלבד. כל שגיאה מקבלת משקל זהה. זה הופך את המודל לעמיד הרבה יותר מול רעש ונתונים קיצוניים.
                            </p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-inner font-mono text-blue-400 text-xs text-left" dir="ltr">
                            import numpy as np<br/><br/>
                            <span className="text-slate-500"># Comparison</span><br/>
                            mse = np.mean((y_true - y_pred) ** 2)<br/>
                            mae = np.mean(np.abs(y_true - y_pred))
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <LossComparisonLab />
                    </div>
                </div>
            </div>
        </section>

        {/* שלב 2: Cross Entropy */}
        
        <section className="py-24 bg-slate-950/40 text-right">
            <div className="max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <CrossEntropyModule />
                    </div>
                    <div className="space-y-8 order-1 lg:order-2">
                        <div className="flex items-center gap-4 justify-end text-right">
                            <h2 className="text-3xl font-black text-white tracking-tight">Cross Entropy: הליבה של הסיווג</h2>
                            <Waves className="text-indigo-400" size={32} />
                        </div>
                        <div className="prose prose-invert text-slate-300 text-[15px] leading-relaxed space-y-6">
                            <p>
                                בסיווג (כמו זיהוי חתול או כלב), המודל מחזיר הסתברויות. <strong>Cross Entropy</strong> לא רק בודקת אם המודל צדק, אלא כמה הוא היה בטוח בעצמו.
                            </p>
                            <p className="bg-indigo-500/5 p-6 rounded-2xl border-r-4 border-indigo-500">
                                היא מענישה בחומרה מודל ש&quot;בטוח&quot; בתשובה הלא נכונה. זה מייצר אות למידה חד שדוחף את המודל לכיול מדויק של הביטחון שלו.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* שלב 3: יציבות והתכנסות */}
        <section className="py-24 border-t border-slate-800/50 text-right">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-400 mb-6 border border-emerald-500/20"><TrendingUp size={32} /></div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">איך ה-Loss מעצב את העתיד?</h2>
                    <p className="text-slate-400 text-lg max-w-2xl leading-relaxed mt-4">
                        בחירה של Loss היא בחירה של ה&quot;נוף&quot; שבו המודל מטייל. פונקציה חלקה תוביל ללמידה יציבה, בעוד פונקציה קופצנית תיצור &quot;אדמה רועדת&quot; למודל.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-right">
                        <h5 className="text-white font-bold mb-3">מהירות התכנסות</h5>
                        <p className="text-slate-500 text-xs leading-relaxed">MSE מייצרת שיפועים חזקים לשגיאות גדולות, ולכן מאפשרת קפיצות למידה מהירות בהתחלה.</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-right">
                        <h5 className="text-white font-bold mb-3">עמידות לרעש</h5>
                        <p className="text-slate-500 text-xs leading-relaxed">MAE מייצרת שיפועים אחידים, מה שהופך אותה לאיטית יותר אך יציבה הרבה יותר בדאטה רועש.</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-right">
                        <h5 className="text-white font-bold mb-3">חדות סיווג</h5>
                        <p className="text-slate-500 text-xs leading-relaxed">Cross Entropy מחדדת את ההבדל בין הסתברויות קטנות לגדולות, מה שמביא לדיוק מקסימלי.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* בוחן הסמכה סופי */}
        <ChapterFiveQuiz />

        {/* סיום הפרק */}
        <section className="py-40 text-center relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 blur-[120px] rounded-full pointer-events-none"></div>
             <motion.div initial={{ scale: 0.98, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="max-w-2xl mx-auto px-4 relative z-10">
                <Sparkles className="mx-auto text-emerald-400 mb-8 opacity-60" size={48} />
                <h2 className="text-4xl font-black text-white mb-8 tracking-tight italic">הבנת את שפת הטעות</h2>
                <p className="text-slate-400 text-lg mb-12 leading-relaxed text-right">
                    עכשיו כשאתה יודע איך המודל מרגיש שהוא טועה, הגיע הזמן ללמוד איך הוא מתקן את עצמו. בפרק הבא נצלול למנוע של הלמידה המודרנית – <strong>Gradient Descent</strong>, ונראה איך הלוס הופך לתנועה במורד ההר לעבר הדיוק המושלם.
                </p>
            </motion.div>
        </section>

    </ChapterLayout>
  );
}