"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, Terminal, Play, Check, Brain, 
  Target, Zap, Activity, Eye, ShieldAlert, TrendingUp, 
  Layers, AlertTriangle, Info, Sparkles, Scale, 
  Gauge, X, Lightbulb, MousePointer2, 
  Dices, Filter, Binary, Percent, MessageSquareCode,
  ShieldCheck, ArrowRightLeft, ListChecks
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { ChapterLayout } from '@/components/ChapterLayout';

// --- רכיבים פנימיים מפוצלים: מעבדות פרק 4 ---

// 1. מעבדת היחס הבסיסי: הסתברות כסטטיסטיקה חיה
const ProbabilityRatioLab = () => {
    const [events, setEvents] = useState(["success", "fail", "success", "success", "fail", "success"]);
    
    const pFail = (events.filter(e => e === "fail").length / events.length).toFixed(2);
    const pSuccess = (1 - Number(pFail)).toFixed(2);

    const toggleEvent = (index: number) => {
        const newEvents = [...events];
        newEvents[index] = newEvents[index] === "success" ? "fail" : "success";
        setEvents(newEvents);
    };

    return (
        <div className="bg-slate-900/60 border border-emerald-500/30 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-md relative overflow-hidden text-right">
            <div className="absolute top-4 right-4 text-emerald-500/10 pointer-events-none"><Percent size={80}/></div>
            <h4 className="text-emerald-400 font-black text-xl mb-4 flex items-center gap-3 justify-end tracking-tighter">
                מעבדה 01: הסתברות כיחס חי <Dices size={20} />
            </h4>
            
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl mb-8">
                <p className="text-xs text-emerald-300 font-bold flex items-center justify-end gap-2 italic">
                    <Zap size={14}/> פקודה למפעיל:
                </p>
                <p className="text-[13px] text-slate-400 mt-1 leading-relaxed text-right">
                    לחץ על הריבועים כדי לשנות את תוצאות האירועים ב-Dataset. ראה איך היחס (ההסתברות) משתנה מיד. זהו הבסיס לכל חישוב סבירות במודל.
                </p>
            </div>

            <div className="space-y-8 relative z-10">
                <div className="flex flex-wrap justify-center gap-3">
                    {events.map((e, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleEvent(i)}
                            className={`px-4 py-2 rounded-xl border-2 font-mono font-bold text-xs cursor-pointer transition-all ${e === 'success' ? 'bg-green-500/10 border-green-500/40 text-green-400' : 'bg-red-500/10 border-red-500/40 text-red-400'}`}
                        >
                            {e.toUpperCase()}
                        </motion.button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/40 p-6 rounded-3xl border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-black mb-1">P(Fail)</div>
                        <div className="text-4xl font-mono font-black text-red-400">{pFail}</div>
                    </div>
                    <div className="bg-black/40 p-6 rounded-3xl border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-black mb-1">P(Success)</div>
                        <div className="text-4xl font-mono font-black text-green-400">{pSuccess}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2. סימולטור הסתברות מותנית: צמצום מרחב האפשרויות
const ConditionalProbLab = () => {
    const [filterPaid, setFilterPaid] = useState(false);
    
    // Data: Paid (P), Free (F) | Action (1), NoAction (0)
    const data = [
        { type: 'P', action: 1 }, { type: 'F', action: 0 },
        { type: 'P', action: 1 }, { type: 'P', action: 0 },
        { type: 'F', action: 0 }, { type: 'P', action: 1 }
    ];

    const filteredData = filterPaid ? data.filter(d => d.type === 'P') : data;
    const pAction = (filteredData.filter(d => d.action === 1).length / filteredData.length).toFixed(2);

    return (
        <div className="bg-slate-900/60 border border-blue-500/30 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-md text-right relative overflow-hidden">
            <h4 className="text-blue-400 font-black text-xl mb-4 flex items-center gap-3 justify-end tracking-tighter">
                מעבדה 02: כוחה של ההתניה <Filter size={20} />
            </h4>
            
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                הסתברות מותנית היא פשוט <strong>צמצום המבט</strong>. הפעל את הפילטר כדי לראות מה ההסתברות לפעולה <em>בהנחה</em> שהמשתמש משלם (Paid).
            </p>

            <div className="flex flex-col gap-6 bg-black/40 p-8 rounded-3xl border border-slate-800">
                <div className="flex justify-center">
                    <Button 
                        onClick={() => setFilterPaid(!filterPaid)}
                        className={`h-12 px-8 rounded-full font-bold transition-all cursor-pointer ${filterPaid ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        {filterPaid ? "הסר התניה (כל המשתמשים)" : "התנה על משתמשים בתשלום"}
                    </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-2 h-12 items-center">
                    <AnimatePresence mode="popLayout">
                        {filteredData.map((d, i) => (
                            <motion.div 
                                key={`${d.type}-${i}`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${d.action ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}
                            >
                                {d.type}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="text-center pt-4 border-t border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">P(Action | {filterPaid ? 'Paid' : 'All'})</div>
                    <div className="text-5xl font-mono font-black text-white">{pAction}</div>
                </div>
            </div>
        </div>
    );
};

// 3. בוחן הסמכה פרק 4
const ChapterFourQuiz = () => {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});
    const [submitted, setSubmitted] = useState(false);
    
    const questions = [
        {
            id: 1,
            q: "מהו הרעיון הבסיסי ביותר של הסתברות בעבודה עם דאטה?",
            options: [
                "נוסחה מתמטית מסובכת למדידת אקראיות",
                "יחס בין מספר המקרים המקיימים תנאי מסוים לבין כלל האפשרויות",
                "דרך למחוק נתונים לא רצויים"
            ],
            correct: 1,
            explanation: "נכון מאוד! הסתברות היא בסך הכל יחס. אם מבינים אותה כיחס, היא הופכת לכלי עבודה פרקטי לזיהוי הטיות וסיכונים."
        },
        {
            id: 2,
            q: "מתי נשתמש בחוק הכפל בהסתברות?",
            options: [
                "כשאנחנו רוצים לחשב את הסיכוי שאחד משני אירועים יקרה",
                "כשאנחנו רוצים לחשב את הסיכוי ששני אירועים יקרו יחד",
                "כשאנחנו רוצים לחלק את הדאטה לשתי קבוצות"
            ],
            correct: 1,
            explanation: "בדיוק. חוק הכפל משמש לחישוב שילוב של אירועים (למשל: גם יורד גשם וגם המשתמש לקח מטריה)."
        },
        {
            id: 3,
            q: "איך משפט בייס עוזר למפתחי AI?",
            options: [
                "הוא מאפשר לעדכן את סבירות התחזית (כמו ספאם) בכל פעם שמצטבר מידע חדש",
                "הוא עוזר לכתוב קוד פייתון מהיר יותר",
                "הוא משמש רק לחישובי גיאומטריה"
            ],
            correct: 0,
            explanation: "נכון. בייס הוא המנוע של מערכות לומדות. הוא מאפשר לנו לחשב הסתברות 'הפוכה' – מה הסיכוי שזה ספאם בהינתן שהמערכת סימנה אותו ככזה."
        }
    ];

    const score = Object.keys(answers).filter(id => answers[Number(id)] === questions[Number(id)-1].correct).length;

    return (
        <div className="max-w-3xl mx-auto py-24 border-t border-slate-800 mt-32">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-block p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 mb-2 border border-emerald-500/20"><Gauge size={32} /></div>
                <h3 className="text-4xl font-black text-white tracking-tight">בוחן קבלת החלטות: פרק 4</h3>
                <p className="text-slate-400 text-sm italic">הוכח הבנה בהיגיון הסתברותי לפני המעבר לפונקציות עלות</p>
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
                                        className={`p-4 rounded-2xl text-right transition-all border text-sm cursor-pointer ${answers[q.id] === oIdx ? (oIdx === q.correct ? 'border-green-500 bg-green-500/10 text-white shadow-lg shadow-green-500/5' : 'border-red-500 bg-red-500/10 text-white shadow-lg shadow-red-500/5') : 'border-slate-800 bg-black/20 text-slate-400 hover:border-slate-600'}`}
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
                                        <div className="text-sm font-medium leading-relaxed italic text-right">{isCorrect ? q.explanation : "נסה לחשוב שוב על המשמעות של היחס וכיצד מידע חדש (התניה) משנה את התוצאה."}</div>
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
                    <Button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < 3} className="h-16 px-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-black text-xl shadow-2xl cursor-pointer transition-all active:scale-95">סיום והסמכה</Button>
                ) : (
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="p-10 bg-slate-900 border-2 border-emerald-500/30 rounded-[3rem] shadow-3xl">
                        <div className="mb-6">
                            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Decision Engine Score</span>
                            <div className="text-6xl font-black text-white">{Math.round((score/3)*100)}%</div>
                        </div>
                        {score === 3 ? (
                            <Link href="/math/mathProbabilistic/chapter-5">
                                <Button className="h-16 px-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold cursor-pointer gap-3 text-lg transition-transform hover:scale-105 shadow-xl shadow-indigo-500/20">מצוין! ממשיכים לפונקציות עלות <ChevronLeft size={22}/></Button>
                            </Link>
                        ) : (
                            <Button onClick={() => {setSubmitted(false); setAnswers({}); setShowFeedback({});}} className="h-14 px-10 bg-red-600/20 text-red-400 rounded-full font-bold cursor-pointer border border-red-500/20 hover:bg-red-600/30 transition-all">נדרש 100% לביצוע החלטות - נסה שוב</Button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default function ChapterFour() {
  return (
    <ChapterLayout courseId="mathProbabilistic" currentChapterId={4}>
        
        {/* פתיחה דרמטית: הסתברות כמנוע החלטות */}
        <section className="relative pt-16 pb-20 text-right">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto px-4">
                <div className="flex items-center gap-3 justify-end mb-8 text-blue-400 font-bold tracking-widest uppercase text-[10px]">
                    <span>Decision Logic: Stage 04</span>
                    <Binary size={16} fill="currentColor" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tighter leading-tight">
                    היגיון הסתברותי: <br/>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-emerald-400 to-indigo-600">מאירועים לקבלת החלטות</span>
                </h1>
                
                <div className="prose prose-invert text-slate-300 text-base max-w-4xl ml-auto leading-relaxed space-y-6">
                    <p className="text-xl font-bold border-r-4 border-blue-500 pr-6 py-2 bg-blue-500/5 rounded-l-2xl italic">
                        הסתברות היא אחד הכלים הכי פרקטיים שמפתח יכול להשתמש בהם. אין צורך בנוסחאות מסובכות. הבסיס הוא רעיון פשוט: יחס בין כמה מכלל האפשרויות.
                    </p>
                    <p>
                        מודלים משתמשים בהסתברות בכל שלב: בבחירה של המילה הבאה, של קטגוריה, או של פעולה. מפתח שמבין הסתברות ברמה יישומית יודע לא רק מה המודל החזיר, אלא <strong>למה</strong> הוא החזיר את זה.
                    </p>
                </div>
            </motion.div>
        </section>

        {/* שלב 1: הסתברות כיחס + מעבדה */}
        <section className="py-24 border-t border-slate-800/50 text-right">
            <div className="max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div className="space-y-8 order-2 lg:order-1">
                        <div className="flex items-center gap-4 justify-end">
                            <h2 className="text-3xl font-black text-white tracking-tight text-right">הסתברות היא יחס, לא נוסחה</h2>
                            <Percent className="text-emerald-400" size={32} />
                        </div>
                        <p className="text-slate-300 text-[15px] leading-relaxed">
                            אם מתוך 100 בקשות לשרת, 7 נכשלות, ההסתברות לכישלון היא 7 מתוך 100, כלומר 0.07. היחס הזה הוא הכלי הכי בסיסי שיש, והוא מופיע בכל מקום – כשבודקים Dataset, טעויות מודל או תדירות של אירועים.
                        </p>
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-inner font-mono text-emerald-500 text-xs text-left" dir="ltr">
                            import numpy as np<br/><br/>
                            <span className="text-slate-500"># Probability of failure calculation</span><br/>
                            events = np.array([&quot;success&quot;, &quot;fail&quot;, &quot;success&quot;])<br/>
                            p_fail = np.mean(events == &quot;fail&quot;)<br/>
                            print(&quot;Probability of failure:&quot;, p_fail)
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <ProbabilityRatioLab />
                    </div>
                </div>
            </div>
        </section>

        {/* שלב 2: חוקי החיבור והכפל */}
        <section className="py-24 bg-slate-950/40 text-right">
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-black text-white tracking-tighter">חוקי המשחק: חיבור וכפל</h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto italic">
                        איך מודלים משלבים אירועים שונים כדי להגיע למסקנה סופית?
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 hover:border-blue-500/30 transition-all group">
                        <div className="flex justify-between items-center mb-6">
                            <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[9px] font-black uppercase">OR Logic</span>
                            <h4 className="text-white font-bold text-xl">חוק החיבור</h4>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">
                            &quot;מה ההסתברות שאחד משני אירועים יקרה? אם האירועים לא חופפים – פשוט מחברים.&quot;
                        </p>
                        <div className="p-4 bg-black/40 rounded-xl font-mono text-blue-300 text-xs text-left" dir="ltr">
                            P(Small or Big) = 0.2 + 0.3 = 0.5
                        </div>
                    </div>
                    <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 hover:border-emerald-500/30 transition-all group">
                        <div className="flex justify-between items-center mb-6">
                            <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[9px] font-black uppercase">AND Logic</span>
                            <h4 className="text-white font-bold text-xl">חוק הכפל</h4>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">
                            &quot;מה ההסתברות ששני אירועים יקרו יחד? אם הם בלתי תלויים – פשוט מכפילים.&quot;
                        </p>
                        <div className="p-4 bg-black/40 rounded-xl font-mono text-emerald-300 text-xs text-left" dir="ltr">
                            P(Rain and Umbrella) = 0.3 * 0.8 = 0.24
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* שלב 3: הסתברות מותנית + מעבדה */}
        <section className="py-24 border-t border-slate-800/50 text-right">
            <div className="max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div className="space-y-8 order-2 lg:order-1">
                        <div className="flex items-center gap-4 justify-end">
                            <h2 className="text-3xl font-black text-white tracking-tight">הסתברות מותנית: ההקשר קובע</h2>
                            <Filter className="text-blue-400" size={32} />
                        </div>
                        <div className="prose prose-invert text-slate-300 text-[15px] leading-relaxed space-y-6">
                            <p>
                                הסתברות מותנית עונה על שאלה אחת: <strong>מה ההסתברות שמשהו יקרה בהנחה שכבר קרה משהו אחר?</strong>
                            </p>
                            <p>
                                אנחנו מצמצמים את מרחב האפשרויות רק למקרים שבהם התנאי מתקיים, ובתוכו מחשבים מחדש את היחס. זהו הכלי המרכזי לזיהוי קבוצות שונות בתוך דאטה והבנת קשרים נסתרים.
                            </p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl font-mono text-blue-400 text-xs text-left" dir="ltr">
                            # Filter only paid users<br/>
                            mask = (users == &quot;paid&quot;)<br/>
                            p_click_given_paid = np.mean(clicked[mask] == 1)
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <ConditionalProbLab />
                    </div>
                </div>
            </div>
        </section>

        {/* שלב 4: בייס וסינון ספאם */}
        
        <section className="py-24 bg-slate-950/40 text-right">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    <div className="flex-1 space-y-8">
                        <div className="p-4 bg-indigo-500/10 rounded-3xl w-fit ml-auto text-indigo-500 border border-indigo-500/20"><MessageSquareCode size={32} /></div>
                        <h2 className="text-3xl font-black text-white tracking-tighter text-right">בייס: המנוע של ChatGPT וסינון ספאם</h2>
                        <div className="prose prose-invert text-slate-300 text-[15px] leading-relaxed space-y-6">
                            <p>
                                משפט בייס מאפשר למודל לעדכן את התמונה בכל פעם שמגיע מידע חדש. במקום נוסחאות מפחידות, חשוב עליו כטבלת שכיחות: כמה מתוך ההודעות שסומנו כספאם הן באמת ספאם?
                            </p>
                            <p className="bg-indigo-500/5 p-6 rounded-2xl border-r-4 border-indigo-500 font-bold text-white leading-relaxed">
                                &quot;המודל אינו אומר 'זו הודעת ספאם'. הוא אומר: הסתברות הספאם גבוהה יותר מהאלטרנטיבה, ועל פי זה מקבל החלטה.&quot;
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex-1 bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <h5 className="text-slate-500 font-mono text-[10px] uppercase mb-4 tracking-widest italic">Simulation: Frequency Table (Bayes)</h5>
                        <div className="overflow-x-auto" dir="ltr">
                            <table className="w-full text-xs font-mono text-slate-400 border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800">
                                        <th className="p-2 text-left">Actual / Pred</th>
                                        <th className="p-2 text-center text-blue-400">Pred: Spam</th>
                                        <th className="p-2 text-center">Pred: Ham</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-slate-800/50">
                                        <td className="p-2 text-left text-white font-bold tracking-tighter italic">Actual Spam</td>
                                        <td className="p-2 text-center text-emerald-400 bg-emerald-400/5 font-black tracking-tighter italic">A (Correct)</td>
                                        <td className="p-2 text-center">B (Miss)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2 text-left text-white font-bold tracking-tighter italic">Actual Ham</td>
                                        <td className="p-2 text-center text-red-400">C (False Pos)</td>
                                        <td className="p-2 text-center">D (Correct)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 p-4 bg-black/40 rounded-xl border border-slate-800 text-[12px] font-mono text-indigo-300 text-center">
                            P(Spam | Pred_Spam) = A / (A + C)
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* בוחן הסמכה סופי */}
        <ChapterFourQuiz />

        {/* סיום הפרק */}
        <section className="py-40 text-center relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
             <motion.div initial={{ scale: 0.98, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="max-w-2xl mx-auto px-4 relative z-10">
                <Sparkles className="mx-auto text-emerald-400 mb-8 opacity-60" size={48} />
                <h2 className="text-4xl font-black text-white mb-8 tracking-tight italic">החשיבה ההסתברותית הופנמה</h2>
                <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                    הבנת שהסתברות היא הדרך של המודל לנהל שיחה עם המציאות הלא ודאית. כעת, כשאתה יודע לחשב יחסים, התניות וסיכויים, אתה מוכן לצלול ללב של הלמידה – פונקציות עלות (Loss Functions), המצפן שמכוון את המודל לדיוק מקסימלי.
                </p>
            </motion.div>
        </section>

    </ChapterLayout>
  );
}