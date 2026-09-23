"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
    ChevronLeft, Activity, Terminal, TrendingUp, Check, X, ShieldAlert, 
    Mail, Search, MousePointer2, AlertTriangle, RefreshCcw, Lightbulb, 
    Server, Play, RotateCcw, Users
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { ChapterLayout } from '@/components/ChapterLayout';

// --- הגדרות Props ---
interface InteractiveCodeBlockProps {
    filename: string;
    code: string;
    output: string;
    explanation: string;
    description: string;
}

interface PatternCardProps {
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
}

// --- 1. רכיב קוד אינטראקטיבי ---
const InteractiveCodeBlock: React.FC<InteractiveCodeBlockProps> = ({ filename, code, output, explanation, description }) => {
    const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');

    const run = () => {
        setStatus('running');
        setTimeout(() => setStatus('done'), 1000);
    };

    const reset = () => setStatus('idle');

    return (
        <div className="my-10 border border-slate-800 rounded-xl overflow-hidden bg-[#0d1117] shadow-2xl relative group">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#161b22]">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono ml-3">{filename}</span>
                </div>
                <Button 
                    onClick={status === 'done' ? reset : run}
                    disabled={status === 'running'}
                    size="sm"
                    className={`h-7 text-xs font-bold gap-2 transition-all ${status === 'done' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                >
                    {status === 'running' ? <RefreshCcw size={12} className="animate-spin"/> : status === 'done' ? <RotateCcw size={12}/> : <Play size={12} fill="currentColor"/>}
                    {status === 'done' ? 'אפס' : status === 'running' ? 'מריץ...' : 'הרץ קוד'}
                </Button>
            </div>
            
            <div className="p-4 bg-slate-900/80 border-b border-slate-800 text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                <Terminal size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                    <span className="font-bold text-emerald-400 ml-1">הסבר על הקוד:</span>
                    {description}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-5 font-mono text-sm text-slate-300 border-b lg:border-b-0 lg:border-l border-slate-800 overflow-x-auto leading-relaxed" dir="ltr">
                    <pre dangerouslySetInnerHTML={{ __html: code }} />
                </div>
                
                <div className="bg-[#090c10] p-5 font-mono text-sm relative min-h-45 flex flex-col justify-between">
                    <div className="absolute top-2 right-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold select-none">Terminal Output</div>
                    <AnimatePresence mode="wait">
                        {status === 'idle' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-slate-600 text-xs gap-2">
                                <Activity size={32} className="opacity-20" />
                                <span>המתנה להרצה...</span>
                            </motion.div>
                        )}
                        {status === 'running' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-blue-400 gap-3">
                                <RefreshCcw size={24} className="animate-spin opacity-50" />
                                <span className="text-xs tracking-wider">COUNTING...</span>
                            </motion.div>
                        )}
                        {status === 'done' && (
                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-emerald-400 whitespace-pre-wrap leading-relaxed w-full pt-4" dir="ltr">
                                <span className="text-slate-500 block mb-2 select-none">$ python3 {filename}</span>
                                {output}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {status === 'done' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 pt-4 border-t border-slate-800">
                            <div className="flex gap-2 items-start">
                                <Lightbulb size={16} className="text-yellow-400 mt-0.5 shrink-0" />
                                <div className="text-xs text-slate-300">
                                    <span className="text-yellow-400 font-bold block mb-1">ניתוח התוצאה:</span> 
                                    {explanation}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- 2. מעבדת תדירות (Frequency Lab) ---
const FrequencyLab = () => {
  const [requests, setRequests] = useState<{status: 'success' | 'fail'}[]>([]);
  
  const addRequest = () => {
    // סימולציה: 80% הצלחה (כמו שרת יציב)
    const isSuccess = Math.random() > 0.2;
    setRequests(prev => [...prev, { status: isSuccess ? 'success' : 'fail' }]);
  };

  const reset = () => setRequests([]);

  const total = requests.length;
  const fails = requests.filter(r => r.status === 'fail').length;
  const probability = total === 0 ? 0 : fails / total;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden group my-8">
      <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-500"></div>
      
      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          
          {/* Controls */}
          <div className="flex flex-col gap-4 w-full md:w-1/3">
              <h3 className="text-white font-bold flex items-center gap-2">
                  <Server size={18} className="text-blue-400"/> סימולטור שרת
              </h3>
              <p className="text-xs text-slate-400">
                  לחץ כדי לשלוח בקשות. חלקן יכשלו באופן אקראי.
                  כך בדיוק נראית הסתברות בעולם האמיתי: אוסף של אירועים.
              </p>
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-sm shadow-xl">
                  <div className="flex justify-between mb-2">
                      <span className="text-slate-500">סה&quot;כ בקשות:</span>
                      <span className="text-white">{total}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                      <span className="text-red-400">כישלונות:</span>
                      <span className="text-red-400">{fails}</span>
                  </div>
                  <div className="h-px bg-slate-800 my-2"></div>
                  <div className="flex justify-between items-center">
                      <span className="text-blue-400">P(Fail):</span>
                      <span className="text-xl font-bold text-blue-400">
                          {probability.toFixed(3)}
                      </span>
                  </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={addRequest} className="flex-1 bg-blue-600 hover:bg-blue-500">
                    שלח בקשה 🚀
                </Button>
                <Button onClick={reset} variant="outline" className="border-slate-700 bg-slate-800 hover:bg-slate-700">
                    <RefreshCcw size={16}/>
                </Button>
              </div>
          </div>

          {/* Visual Grid */}
          <div className="flex-1 bg-slate-950/50 rounded-xl border border-slate-800 p-4 min-h-50 w-full">
              <div className="text-xs text-slate-500 mb-2 text-center">היסטוריית בקשות (ירוק=הצלחה, אדום=כישלון)</div>
              <div className="flex flex-wrap gap-1 content-start max-h-48 overflow-y-auto custom-scrollbar">
                  <AnimatePresence>
                    {requests.map((r, i) => (
                        <motion.div 
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`w-3 h-3 rounded-sm ${r.status === 'success' ? 'bg-emerald-500/40' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`}
                        />
                    ))}
                  </AnimatePresence>
                  {requests.length === 0 && (
                      <div className="w-full h-32 flex items-center justify-center text-slate-600 text-xs italic flex-col gap-2">
                          <Activity size={24} className="opacity-20" />
                          הטרמינל ריק... שלח בקשה ראשונה.
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  )
}

// --- 3. גלאי ספאם חי (Spam Detector Lab) ---
const SpamDetectorLab = () => {
    const [input, setInput] = useState("Hello click here for free money urgent");
    
    // מילון מילים והמשקל שלהן
    const wordWeights: Record<string, { weight: number, label: string, color: string }> = {
        "free": { weight: 0.95, label: "Spam Heavy", color: "text-red-500" },
        "urgent": { weight: 0.85, label: "Spam Heavy", color: "text-red-400" },
        "money": { weight: 0.70, label: "Suspicious", color: "text-orange-400" },
        "click": { weight: 0.60, label: "Common", color: "text-yellow-400" },
        "hello": { weight: 0.05, label: "Safe", color: "text-emerald-400" },
        "project": { weight: 0.10, label: "Safe", color: "text-emerald-400" },
    };

    const words = input.toLowerCase().split(/\s+/);
    
    let spamScore = 0;
    let detectedWords = 0;

    words.forEach(w => {
        const cleanW = w.replace(/[^a-z]/g, '');
        if (wordWeights[cleanW]) {
            spamScore += wordWeights[cleanW].weight;
            detectedWords++;
        }
    });

    const finalProbability = detectedWords > 0 ? (spamScore / detectedWords) : 0.1;
    const isSpam = finalProbability > 0.5;

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 mt-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full z-0"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Mail size={20} /></div>
                <h3 className="text-xl font-bold text-white">מעבדה חיה: איך המודל &quot;קורא&quot; ספאם?</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-4">
                    <label className="text-sm text-slate-400 block">הזן טקסט לבדיקה (באנגלית):</label>
                    <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white font-mono focus:ring-2 focus:ring-purple-500 outline-none h-32 text-sm resize-none"
                    />
                    <div className="text-xs text-slate-500 flex flex-wrap gap-2 items-center">
                        <span className="font-bold text-slate-400">נסה להוסיף:</span>
                        <span className="text-red-400 cursor-pointer hover:underline bg-red-500/10 px-1.5 py-0.5 rounded" onClick={() => setInput(input + " free")}>free</span>
                        <span className="text-red-400 cursor-pointer hover:underline bg-red-500/10 px-1.5 py-0.5 rounded" onClick={() => setInput(input + " urgent")}>urgent</span>
                        <span className="text-emerald-400 cursor-pointer hover:underline bg-emerald-500/10 px-1.5 py-0.5 rounded" onClick={() => setInput(input + " hello")}>hello</span>
                    </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-center shadow-lg">
                    {/* Gauge Visual */}
                    <div className="absolute top-0 right-0 w-1 h-full bg-linear-to-b from-emerald-500 via-yellow-500 to-red-500 opacity-30"></div>
                    
                    <div className="mb-6">
                        <div className="text-sm text-slate-400 mb-2 flex justify-between">
                            <span>הסתברות לספאם</span>
                            <span className="font-mono text-xs opacity-50">P(Spam|Text)</span>
                        </div>
                        <div className="flex items-end gap-3">
                            <span className={`text-4xl font-bold font-mono transition-colors duration-500 ${isSpam ? 'text-red-500' : 'text-emerald-500'}`}>
                                {(finalProbability * 100).toFixed(1)}%
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded mb-2 border ${isSpam ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                {isSpam ? "SPAM DETECTED" : "SAFE MESSAGE"}
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                            <motion.div 
                                animate={{ width: `${finalProbability * 100}%`, backgroundColor: isSpam ? '#ef4444' : '#10b981' }}
                                className="h-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">מילים שזוהו (Evidence):</div>
                        <div className="flex flex-wrap gap-2">
                            {words.map((w, i) => {
                                const cleanW = w.replace(/[^a-z]/g, '');
                                const data = wordWeights[cleanW];
                                if (!data) return null;
                                return (
                                    <span key={i} className={`text-xs px-2 py-1 rounded border border-slate-800 bg-slate-900 ${data.color}`}>
                                        {w} ({data.weight})
                                    </span>
                                )
                            })}
                            {detectedWords === 0 && <span className="text-slate-600 text-xs italic">לא זוהו מילות מפתח מוכרות</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- העמוד הראשי ---

export default function ChapterThree() {
  return (
  
      
      <ChapterLayout courseId="mathIntuitive" currentChapterId={3}>
          
          {/* סעיף 1: הסתברות כתדירות */}
          <section id="part-1" className="scroll-mt-24">
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><TrendingUp size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">1. הסתברות = תדירות בעולם האמיתי</h2>
                </div>
                
                <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none space-y-6">
                    <p>
                        לפני שמדברים על נוסחאות או סמלים, חשוב להבין משהו פשוט: <strong>הסתברות היא לא מתמטיקה מופשטת. היא תיאור של המציאות.</strong>
                    </p>
                    <p>
                        כשאומרים &quot;הסתברות של 0.2&quot;, הרבה אנשים רואים סתם מספר. אבל מי שמפתח מערכות מבין שזה אומר:
                        <br/>
                        <strong>&quot;זה קורה בערך 20 אחוז מהפעמים.&quot;</strong>
                    </p>
                    <div>
                        וזהו. אין פה קסם. הסתברות היא בעצם ספירה.
                        אם מתוך 100 בקשות לשרת:
                        <ul className="list-disc pr-6 mt-2 mb-2">
                            <li>20 נכשלות</li>
                            <li>80 מצליחות</li>
                        </ul>
                        אז ההסתברות לכישלון היא: 20 מתוך 100 (0.2).
                    </div>
                    <p>
                        השפה הזו טבעית הרבה יותר ממונחים כמו &quot;אירועים&quot; או &quot;מרחבי דגימה&quot;. מפתח לא צריך את כל זה. הוא צריך להבין מה קורה בדאטה.
                    </p>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 my-4 flex gap-4 items-start">
                        <div className="text-blue-400 mt-1"><Lightbulb size={20}/></div>
                        <div>
                            <h4 className="text-white font-bold text-sm">למה זה חשוב בעבודה עם AI?</h4>
                            <p className="text-slate-400 text-sm mt-1">
                                כי מודלים לא &quot;מנחשים&quot;. הם משווים תדירויות שהם ראו בעבר ומייצרים תחזיות בהתאם.
                                אם המודל ראה שב-90% מהמקרים אחרי המילה &quot;היה&quot; מגיעה המילה &quot;טוב&quot;, הוא ישלים את המשפט בהתאם.
                                בלי תדירות – אין למידה.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* מעבדת תדירות */}
            <FrequencyLab />

          </section>


          {/* סעיף 2: דוגמאות ותרחישים */}
          <section id="part-2" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Search size={20} /></div>
                <div>
                    <h2 className="text-2xl font-bold text-white">2. איך מייצגים תרחישים בצורה פשוטה?</h2>
                    <p className="text-slate-400 text-sm">כשמסתכלים על העולם דרך תדירויות, מתחילים לראות את הסיבות.</p>
                </div>
            </div>

            <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none mb-8 space-y-4">
                <p>
                    אחרי שמבינים שהסתברות היא בעצם תדירות, מגיעה השאלה הפרקטית:
                    <strong>איך מייצגים תרחיש בצורה שהמודל מסוגל להבין וללמוד ממנו?</strong>
                </p>
                <p>
                    מבחינת המודל, &quot;תרחיש&quot; הוא פשוט רגע שבו משהו קורה. הוא לא יודע אם זה &quot;משתמש שלוחץ על כפתור&quot; או &quot;מייל שמגיע&quot;.
                    מה שהוא צריך זה ייצוג מספרי שנותן תמונה ברורה של מה קורה ומה קרה בעבר.
                </p>
                <p>
                    <strong>תרחיש = הקשר (Context)</strong>.
                    למשל, אם משתמש לוחץ על כפתור רק כשהוא מגיע מדפדפן מסוים, זה תרחיש חוזר.
                    אם בקשות מסוימות ל-API כושלות בעיקר בלילה, זה תרחיש חוזר.
                </p>
                <p>
                    להלן מספר דוגמאות ללמה דברים קורים יותר או פחות:
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PatternCard 
                    title="הטיית יום ראשון"
                    icon={<MousePointer2 size={18} />}
                    desc="נניח שיש לך מערכת שממליצה על כתבות. המודל זיהה שמשתמשים לוחצים על כתבות 'כספים' בעיקר ביום ראשון בבוקר. הוא למד לקשר בין הזמן לתוכן."
                    color="blue"
                />
                <PatternCard 
                    title="מילות מפתח (Spam)"
                    icon={<ShieldAlert size={18} />}
                    desc="אם מילה מסוימת מופיעה 14 פעמים בספאם ופעם אחת בלבד בהודעה רגילה, המודל לא צריך להבין אנגלית. הוא מבין שהמילה הזו מסוכנת."
                    color="red"
                />
                <PatternCard 
                    title="אנומליה ברמזורים"
                    icon={<AlertTriangle size={18} />}
                    desc="בדרך כלל מגיעות 300 מכוניות בשעה. פתאום הגיעו 200 ב-5 דקות. ההסתברות הנמוכה מסמנת למערכת: משהו חריג קורה."
                    color="orange"
                />
                <PatternCard 
                    title="השלמת מילים (NLP)"
                    icon={<Terminal size={18} />}
                    desc="למה מודל NLP נוטה להשלים מילים מסוימות? אם 80 אחוז מהפעמים שבהן מופיעה המילה 'מזג' מגיע אחריה 'אוויר', המודל ילמד שזה המשך טבעי."
                    color="green"
                />
            </div>
            
            <div className="mt-8 mb-8 bg-slate-900/50 p-4 border-r-4 border-purple-500 rounded-r text-sm text-slate-400">
                <strong>מה המשותף לכל הדוגמאות?</strong> העיקרון הבסיסי חוזר שוב ושוב: דברים שקורים הרבה מקבלים משקל גבוה, ודברים שקורים מעט מקבלים משקל נמוך.
                זה הכול. מזה נבנים מודלים מורכבים.
            </div>
          </section>


          {/* סעיף 3: סיווג והדגמה מעשית */}
          <section id="part-3" className="scroll-mt-24 mb-8">
             <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Activity size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">3. חיבור ראשוני לעולם של סיווגים (Spam/Ham)</h2>
                </div>
                <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none space-y-4">
                    <p>
                        עכשיו שהבנו שתדירות היא הלב של הסתברות, אפשר לראות איך זה יושב בדיוק על אחד היישומים הכי בסיסיים בעולם ה-ML: <strong>סיווג (Classification)</strong>.
                    </p>
                    <p>
                        ברוב היישומים הראשונים של מתכנתים בעולמות ה-AI, סיווג הוא הצעד הטבעי:
                        האם זה ספאם או לא? האם הלקוח יעזוב או יישאר?
                        למרות שהמשימות נראות שונות לגמרי, יש להן מבנה זהה: המודל מקבל משהו, ומנסה לשייך אותו לאחת משתי קבוצות.
                    </p>
                    <p>
                        למה דווקא Spam/Ham הוא הדוגמה הכי קלאסית? כי זה מקרה פשוט להבנה והוא מגלה בדיוק איך המודל &quot;חושב&quot;.
                    </p>
                    <p>                        
                        להלן טבלה שמדגימה איך המודל משתמש בתדירויות של מילים:
                    </p>
                </div>
            </div>

            {/* טבלת מילים */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden mb-8 shadow-2xl">
                <table className="w-full text-sm text-left text-slate-400" dir="ltr">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Word</th>
                            <th className="px-6 py-4">Spam Count</th>
                            <th className="px-6 py-4">Normal Count</th>
                            <th className="px-6 py-4">Conclusion</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-slate-800/50 hover:bg-slate-900/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-white">free</td>
                            <td className="px-6 py-4 text-red-400 font-bold bg-red-500/10 rounded w-fit">42</td>
                            <td className="px-6 py-4 text-emerald-400">3</td>
                            <td className="px-6 py-4 text-red-300 text-xs font-bold">High Risk (Spam)</td>
                        </tr>
                        <tr className="border-b border-slate-800/50 hover:bg-slate-900/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-white">urgent</td>
                            <td className="px-6 py-4 text-red-400 font-bold bg-red-500/10 rounded w-fit">17</td>
                            <td className="px-6 py-4 text-emerald-400">1</td>
                            <td className="px-6 py-4 text-orange-300 text-xs font-bold">Suspicious</td>
                        </tr>
                        <tr className="hover:bg-slate-900/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-white">hello</td>
                            <td className="px-6 py-4 text-red-400">2</td>
                            <td className="px-6 py-4 text-emerald-400 font-bold bg-emerald-500/10 rounded w-fit">58</td>
                            <td className="px-6 py-4 text-emerald-300 text-xs font-bold">Safe</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none space-y-4 mb-6">
                <p>
                    המודל רואה ש-<code>free</code> כמעט תמיד מופיעה בספאם. <code>hello</code> מופיעה בדרך כלל בהודעות רגילות.
                    אין כאן נוסחאות מתוחכמות. זו פשוט ספירה.
                </p>
                <div className="bg-slate-950/50 p-4 border border-slate-700 rounded-lg flex gap-3 items-start">
                    <Users className="text-blue-400 mt-1 shrink-0" size={20} />
                    <div>
                        <h5 className="text-sm font-bold text-white mb-1">מה זה אומר למפתח בפועל?</h5>
                        <p className="text-xs text-slate-400">
                            כשמפתחים מערכות סיווג, כדאי לשים לב: מה מופיע הרבה בקבוצה מסוימת? מה כמעט לא מופיע?
                            רק מהשאלות האלה אפשר לפעמים לשפר מודל פי כמה.
                        </p>
                    </div>
                </div>
            </div>

            {/* מעבדת הספאם */}
            <SpamDetectorLab />

          </section>

          {/* סעיף 4: קוד פייתון */}
          <section id="part-4" className="scroll-mt-24">
             <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Terminal size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">4. איך מחשבים את זה בפייתון?</h2>
                </div>
                <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none">
                    <p>
                        ראינו את התיאוריה, עכשיו בוא נראה איך זה נראה בקוד אמיתי.
                        הפונקציה הבאה היא הבסיס לכל הסתברות: ספירת מקרים חיוביים חלקי סך כל המקרים.
                    </p>
                </div>
            </div>

            <InteractiveCodeBlock 
                filename="calc_prob.py"
                description="קוד זה מדגים את הנוסחה הבסיסית ביותר: Probability = Event / Total. אנו משתמשים בנתונים מהטבלה כדי לחשב את הסיכוי שמייל הוא ספאם."
                code={`<span class="text-purple-400">def</span> <span class="text-blue-400">calculate_probability</span>(event_count, total_count):<br/>    <span class="text-slate-500"># נוסחת ההסתברות הבסיסית: חלק חלקי שלם</span><br/>    <span class="text-purple-400">return</span> event_count / total_count<br/><br/><span class="text-slate-500"># נתונים מהטבלה שלנו</span><br/>total_emails = <span class="text-blue-400">100</span><br/>spam_emails = <span class="text-blue-400">20</span><br/><br/><span class="text-slate-500"># חישוב</span><br/>prob_spam = calculate_probability(spam_emails, total_emails)<br/><br/><span class="text-yellow-300">print</span>(f<span class="text-green-400">'Total Emails: {total_emails}'</span>)<br/><span class="text-yellow-300">print</span>(f<span class="text-green-400">'Spam Emails: {spam_emails}'</span>)<br/><span class="text-yellow-300">print</span>(f<span class="text-green-400">'Probability of Spam: {prob_spam:.2f}'</span>)`}
                output={`Total Emails: 100\nSpam Emails: 20\nProbability of Spam: 0.20`}
                explanation="התוצאה 0.20 אומרת שיש סיכוי של 20% שכל מייל אקראי הוא ספאם, בהתבסס על ההיסטוריה שראינו. פשוט, נכון?"
            />
            
            <div className="mt-8">
                <h4 className="text-white font-bold mb-2">למה זה חשוב לקראת הפרק הבא?</h4>
                <p className="text-slate-400 text-sm">
                    כי בעולם האמיתי, מודלים לא מסתפקים בידע על &quot;כמה פעמים מילה מופיעה&quot;. הם רוצים לדעת: מה הסיכוי למשהו <strong>בהינתן</strong> משהו אחר?
                    ופה בדיוק נכנסת <strong>הסתברות מותנית</strong>, שהיא הבסיס לכל משימות הסיווג המורכבות.
                </p>
            </div>

          </section>


          {/* Quiz */}
          <section id="quiz" className="mt-24 pt-12 border-t border-slate-800">
             <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-white mb-2">בדיקת הבנה: סיכום פרק 3</h2>
                <p className="text-slate-400 text-sm">האם תפסת את הקונספט של הסתברות כתדירות?</p>
             </div>
             <ChapterThreeQuiz />
          </section>

       </ChapterLayout>      
  
  );
}


// --- קומפוננטות עזר ---

function PatternCard({ title, desc, icon, color }: PatternCardProps) {
    const colors: Record<string, string> = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        red: "text-red-400 bg-red-500/10 border-red-500/20",
        orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
        green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    };

    return (
        <div className={`p-5 rounded-xl border border-slate-800 bg-slate-950 relative hover:border-slate-700 transition-colors group`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 border ${colors[color]} group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
        </div>
    )
}

function ChapterThreeQuiz() {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    
    const questions = [
        {
            id: 1,
            text: "מה המשמעות של 'הסתברות 0.9' עבור מפתח AI?",
            options: [
                { id: 1, text: "מספר קסם אבסטרקטי" },
                { id: 2, text: "האירוע קורה בערך ב-90% מהמקרים (תדירות גבוהה)", correct: true },
                { id: 3, text: "המודל בטוח ב-100% שזה נכון" }
            ]
        },
        {
            id: 2,
            text: "איך מודל לומד לזהות ספאם?",
            options: [
                { id: 1, text: "הוא משווה תדירות הופעה של מילים בהודעות ספאם מול הודעות רגילות", correct: true },
                { id: 2, text: "הוא קורא את המייל ומבין את הכוונה הזדונית" },
                { id: 3, text: "מישהו מתכנת לו ידנית את כל חוקי הספאם" }
            ]
        },
        {
            id: 3,
            text: "מה קורה כשיש 'רעש' או חוסר עקביות בנתונים?",
            options: [
                { id: 1, text: "המודל מדלג על הנתונים האלו" },
                { id: 2, text: "המודל לא מצליח לזהות דפוס ברור (ההסתברות מתפזרת)", correct: true },
                { id: 3, text: "המודל ממציא נתונים חדשים" }
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
        <div className="space-y-6 max-w-xl mx-auto text-right">
            {questions.map((q) => (
                <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h4 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
                        <span className="bg-blue-500/20 text-blue-400 w-6 h-6 rounded flex items-center justify-center text-xs">{q.id}</span>
                        {q.text}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                        {q.options.map((opt) => {
                            const isSelected = answers[q.id] === opt.id;
                            const isCorrect = opt.correct;
                            
                            let btnClass = "w-full text-right px-4 py-3 rounded-lg border transition-all text-xs flex items-center justify-between ";
                            
                            if (isSelected) {
                                if (isCorrect) btnClass += "bg-emerald-500/10 border-emerald-500/50 text-emerald-300";
                                else btnClass += "bg-red-500/10 border-red-500/50 text-red-300";
                            } else {
                                btnClass += "bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-400";
                            }

                            return (
                                <button key={opt.id} onClick={() => handleSelect(q.id, opt.id)} className={btnClass}>
                                    <span>{opt.text}</span>
                                    {isSelected && (isCorrect ? <Check size={14} className="text-emerald-400" /> : <X size={14} className="text-red-400" />)}
                                </button>
                            )
                        })}
                    </div>
                </div>
            ))}

            <AnimatePresence>
                {allCorrect && Object.keys(answers).length === 3 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="sticky bottom-8 z-50 flex justify-center pt-4"
                    >
                        <Link href="/chapter-4">
                            <Button size="lg" className="h-14 px-8 text-md bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-xl hover:scale-105 transition-transform">
                                המשך לפרק 4: הסתברות מותנית <ChevronLeft className="mr-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}