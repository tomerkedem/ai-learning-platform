"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
    ChevronLeft, Activity, BarChart3, Calculator, Brain, Users, TrendingUp, Check, X,
    Play, RefreshCcw, RotateCcw, Lightbulb, AlertTriangle, Scale, ArrowRight, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { ChapterLayout } from "@/components/ChapterLayout";
// --- הגדרות טיפוסים (Interfaces) - הכל מרוכז כאן למעלה ---

interface InteractiveCodeBlockProps {
    filename: string;
    code: string;
    output: string;
    explanation: string;
    description: string;
    visualContent?: React.ReactNode;
}

interface ExampleCardProps {
    title: string;
    scenario: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
}

// --- 1. רכיב גרף Matplotlib (ויזואליזציה לקוד) ---
const MatplotlibDistribution = () => (
    <div className="bg-white p-4 rounded-lg mt-4 h-64 w-full relative font-sans select-none overflow-hidden border-4 border-slate-200">
        <div className="text-black text-xs font-bold text-center mb-1">Figure 1: Normal Distribution</div>
        <div className="h-full w-full relative pl-8 pb-8">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-black font-medium origin-center -ml-6">Frequency</div>
            <div className="w-full h-full border-l border-b border-black relative">
                <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <line x1="0" y1="20" x2="200" y2="20" stroke="#eee" strokeWidth="1" />
                    <line x1="0" y1="40" x2="200" y2="40" stroke="#eee" strokeWidth="1" />
                    <line x1="0" y1="60" x2="200" y2="60" stroke="#eee" strokeWidth="1" />
                    <line x1="0" y1="80" x2="200" y2="80" stroke="#eee" strokeWidth="1" />
                    <path d="M 0 95 Q 50 95 70 60 Q 100 5 130 60 Q 150 95 200 95" fill="rgba(31, 119, 180, 0.2)" stroke="#1f77b4" strokeWidth="2" />
                    <line x1="100" y1="95" x2="100" y2="10" stroke="red" strokeWidth="1" strokeDasharray="4" />
                    <text x="105" y="20" fontSize="8" fill="red">Mean (0)</text>
                    <line x1="130" y1="95" x2="130" y2="60" stroke="green" strokeWidth="1" strokeDasharray="2" />
                    <text x="135" y="70" fontSize="8" fill="green">1 Std</text>
                </svg>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-black font-medium -mb-6">Value (Sigma)</div>
        </div>
    </div>
);

// --- 2. רכיב קוד אינטראקטיבי ---
const InteractiveCodeBlock: React.FC<InteractiveCodeBlockProps> = ({ filename, code, output, explanation, description, visualContent }) => {
    const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');

    const run = () => {
        setStatus('running');
        setTimeout(() => setStatus('done'), 1500);
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
                    {status === 'done' ? 'נקה והרץ שוב' : status === 'running' ? 'מריץ סקריפט...' : 'הרץ קוד'}
                </Button>
            </div>
            
            <div className="p-4 bg-slate-900/80 border-b border-slate-800 text-sm text-slate-300 leading-relaxed">
                <span className="font-bold text-emerald-400 mb-1 flex items-center gap-2"><BookOpen size={14}/> הסבר על הקוד:</span>
                {description}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-5 font-mono text-sm text-slate-300 border-b lg:border-b-0 lg:border-l border-slate-800 overflow-x-auto leading-relaxed" dir="ltr">
                    <pre dangerouslySetInnerHTML={{ __html: code }} />
                </div>
                
                <div className="bg-[#090c10] p-5 font-mono text-sm relative min-h-50 flex flex-col justify-between">
                    <div className="absolute top-2 right-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold select-none">Terminal Output</div>
                    <AnimatePresence mode="wait">
                        {status === 'idle' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-slate-600 text-xs gap-2">
                                <Activity size={32} className="opacity-20" />
                                <span>לחץ על &quot;הרץ קוד&quot; כדי לראות את הפלט...</span>
                            </motion.div>
                        )}
                        {status === 'running' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-blue-400 gap-3">
                                <RefreshCcw size={24} className="animate-spin opacity-50" />
                                <span className="text-xs tracking-wider">CALCULATING METRICS...</span>
                            </motion.div>
                        )}
                        {status === 'done' && (
                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-emerald-400 whitespace-pre-wrap leading-relaxed w-full pt-4" dir="ltr">
                                <span className="text-slate-500 block mb-2 select-none">$ python3 {filename}</span>
                                {output}
                                {visualContent && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                                        {visualContent}
                                    </motion.div>
                                )}
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

// --- 3. מעבדת הממוצע והחציון ---
const MeanMedianLab = () => {
  const [hasOutlier, setHasOutlier] = useState(false);
  
  const baseData = [10, 10, 11, 12, 10];
  const currentData = hasOutlier ? [...baseData, 100] : baseData;

  const sum = currentData.reduce((a, b) => a + b, 0);
  const mean = sum / currentData.length;
  
  const sorted = [...currentData].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col gap-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-500"></div>
      
      <div className="absolute top-4 left-4 z-20">
          <motion.div 
            initial={false}
            animate={{ 
                backgroundColor: hasOutlier ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)",
                borderColor: hasOutlier ? "rgba(239, 68, 68, 0.5)" : "rgba(16, 185, 129, 0.5)"
            }}
            className="border px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-md"
          >
              {hasOutlier ? (
                  <><AlertTriangle size={14} className="text-red-400" /><span className="text-red-200">הטיה חריגה (Bias) זוהתה!</span></>
              ) : (
                  <><Check size={14} className="text-emerald-400" /><span className="text-emerald-200">הדאטה מאוזן ותקין</span></>
              )}
          </motion.div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-end justify-between z-10 mt-8">
          <div className="flex items-end gap-2 h-48 w-full max-w-md border-b border-slate-700 pb-2 px-4 relative">
             {currentData.map((val, i) => {
                 const isOutlier = val === 100;
                 return (
                    <motion.div 
                        key={i}
                        layout
                        initial={{ height: 0 }}
                        animate={{ height: isOutlier ? "100%" : `${(val / 100) * 100 * (hasOutlier ? 1 : 4)}%` }}
                        className={`w-12 rounded-t-md relative group/bar transition-colors duration-500 ${isOutlier ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]' : 'bg-blue-500/80 hover:bg-blue-400'}`}
                    >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                            {val}K
                        </span>
                    </motion.div>
                 )
             })}
             <motion.div 
                animate={{ bottom: hasOutlier ? "30%" : "45%" }} 
                className="absolute left-0 w-full h-0.5 bg-yellow-400 z-20 border-t border-dashed border-yellow-200 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
             >
                 <span className="absolute right-0 -top-6 text-xs text-yellow-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-yellow-400/30">
                     ממוצע: {mean.toFixed(1)}K
                 </span>
             </motion.div>
             <motion.div 
                animate={{ bottom: hasOutlier ? "10%" : "40%" }} 
                className="absolute left-0 w-full h-0.5 bg-emerald-400 z-20 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
             >
                 <span className="absolute left-0 -bottom-6 text-xs text-emerald-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-emerald-400/30">
                     חציון: {median.toFixed(1)}K
                 </span>
             </motion.div>
          </div>

          <div className="flex flex-col gap-4 min-w-70">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-xl">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                      <Users size={18} className="text-blue-400"/> המשרד הוירטואלי
                  </h4>
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                      {hasOutlier 
                        ? "שים לב! נכנס בעל שכר גבוה מאוד (100K). הממוצע קפץ למעלה והוא כבר לא מייצג את העובד הפשוט. החציון, לעומת זאת, נשאר יציב." 
                        : "במצב רגיל, כשאין פערים קיצוניים, הממוצע והחציון מספרים סיפור דומה מאוד."}
                  </p>
                  <Button 
                    onClick={() => setHasOutlier(!hasOutlier)}
                    variant={hasOutlier ? "destructive" : "default"}
                    className={`w-full transition-all duration-300 ${hasOutlier ? 'hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-500'}`}
                  >
                      {hasOutlier ? "הסר את המנכ\"ל (תקן נתונים)" : "הכנס מנכ\"ל (צור הטיה)"}
                  </Button>
              </div>
          </div>
      </div>
    </div>
  )
}

// --- 4. מעבדת הנירמול (Normalization Demo) ---
const NormalizationDemo = () => {
    const [isNormalized, setIsNormalized] = useState(false);

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 my-8 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Scale size={20} className="text-purple-400" /> 
                    למה צריך נירמול? (תראה בעצמך)
                </h3>
                <Button 
                    size="sm" 
                    onClick={() => setIsNormalized(!isNormalized)}
                    className={isNormalized ? "bg-slate-700" : "bg-purple-600 hover:bg-purple-500"}
                >
                    {isNormalized ? "אפס נתונים (חזור למקור)" : "נרמל את הנתונים 🪄"}
                </Button>
            </div>

            <div className="flex gap-8 items-end justify-center h-48 border-b border-slate-700 pb-2 relative">
                <motion.div 
                    layout
                    className="w-24 bg-blue-500 rounded-t-lg relative group flex flex-col justify-end items-center shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    animate={{ height: isNormalized ? "50%" : "90%" }}
                >
                    <span className="text-xs text-white font-bold mb-2 block">{isNormalized ? "0.8" : "2.5M ₪"}</span>
                    <span className="absolute -bottom-8 text-xs text-slate-400">מחיר</span>
                </motion.div>

                <motion.div 
                    layout
                    className="w-24 bg-pink-500 rounded-t-lg relative group flex flex-col justify-end items-center shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                    animate={{ height: isNormalized ? "40%" : "5%" }} 
                >
                    <span className="text-xs text-white font-bold mb-2 block">{isNormalized ? "0.2" : "4"}</span>
                    <span className="absolute -bottom-8 text-xs text-slate-400">חדרים</span>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={isNormalized ? "norm" : "raw"}
                    className="absolute top-0 right-0 max-w-56 text-xs bg-slate-950 p-3 rounded border border-slate-800 text-slate-300 shadow-xl"
                >
                    {isNormalized 
                        ? "✅ מצוין! עכשיו שתי העמודות באותו סדר גודל (סביב ה-0). המודל יכול ללמוד משתיהן במידה שווה."
                        : "❌ בעיה: 'מחיר' (במיליונים) הוא ענק לעומת 'חדרים' (בודדים). המודל יתעלם מכמות החדרים כי המספר קטן מדי."
                    }
                </motion.div>
            </div>
        </div>
    )
}

// --- 5. מעבדת סטיית התקן והרעש ---
const StdDevSimulator = () => {
    const [spread, setSpread] = useState(2); 
    const points = Array.from({ length: 30 }).map((_, i) => {
        const offset = (Math.sin(i * 132.1) * spread * 8); 
        return 50 + offset;
    });
    const stdDev = spread * 2.5;
    const confidence = Math.max(0, 100 - (stdDev * 5));
    
    const getGaussianPath = (std: number) => {
        const mean = 50;
        const scale = 50 / Math.max(1, std); 
        let path = "M 0 100";
        for (let x = 0; x <= 100; x += 2) {
            const exponent = -0.5 * Math.pow((x - mean) / std, 2);
            const y = 100 - (scale * (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(exponent));
            path += ` L ${x} ${y}`;
        }
        path += " L 100 100 Z"; 
        return path;
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Activity size={18} className="text-purple-400" /> 
                    סימולטור רעש וודאות
                </h3>
                <div className={`text-xs font-bold px-3 py-1 rounded border transition-colors duration-300 ${confidence > 70 ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-red-500/20 text-red-400 border-red-500/50"}`}>
                    רמת ודאות המודל: {confidence.toFixed(0)}%
                </div>
            </div>
            
            <div className="h-40 w-full bg-slate-950/50 rounded-xl relative border-b border-slate-700 mb-6 flex items-center px-8 overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute left-0 top-0">
                    <motion.path
                        d={getGaussianPath(stdDev)}
                        fill={confidence > 70 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"}
                        stroke={confidence > 70 ? "#34d399" : "#f87171"}
                        strokeWidth="1.5"
                        transition={{ duration: 0.3 }}
                    />
                </svg>
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-600 border-r border-dashed border-slate-500/30 z-0" style={{ left: '50%' }}></div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 z-10">יעד (50ms)</div>

                {points.map((pt, i) => {
                    const leftPos = (pt / 100) * 100;
                    const distance = Math.abs(pt - 50);
                    const colorClass = distance < 15 ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 
                                       distance < 30 ? 'bg-yellow-400' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
                    
                    return (
                        <motion.div
                            key={i}
                            animate={{ left: `${leftPos}%` }}
                            transition={{ type: "spring", stiffness: 50, damping: 10 }}
                            className={`absolute w-2 h-2 md:w-3 md:h-3 rounded-full ${colorClass} z-10`}
                            style={{ top: `${30 + (i % 3) * 20}%` }} 
                        />
                    )
                })}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>יציב ומדויק</span>
                    <span>רועש ומבולגן</span>
                </div>
                <input 
                    type="range" min="1" max="10" step="0.1" value={spread}
                    onChange={(e) => setSpread(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <p className="text-center text-xs text-slate-500 mt-2 bg-black/30 p-2 rounded">
                    {stdDev < 4 
                        ? "✅ המודל מקבל נתונים ברורים וחדים. קל ללמוד." 
                        : "⚠️ המודל רואה 'ענן' של נקודות. יהיה לו קשה להחליט איפה האמת."}
                </p>
            </div>
        </div>
    )
}

// --- העמוד הראשי ---

export default function ChapterTwo() {
  return (
    
      
      <ChapterLayout courseId="mathIntuitive" currentChapterId={2}>
          
          {/* סעיף 1: המרכז */}
          <section id="part-1" className="scroll-mt-24 mb-8">
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><BarChart3 size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">1. האתגר: בחירת המדד המרכזי הנכון</h2>
                </div>
                
                <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none space-y-6">
                    <p>
                        כשאנחנו אוספים נתונים, הדבר הראשון שאנחנו מנסים להבין הוא איפה &quot;מרוכז&quot; רוב המידע. תחשוב על זה כמו לנסות לסכם יום עבודה שלם במילה אחת: &quot;היה סבבה&quot;. זה המדד המרכזי.
                    </p>
                    <p>
                        ב-AI, הדילמה הקבועה היא: באיזה מדד להשתמש?
                        יש לנו שני שחקנים ראשיים, ולכל אחד יתרונות וחסרונות קריטיים:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                            <h4 className="text-lg font-bold text-yellow-400 mb-2">הממוצע (Mean)</h4>
                            <p className="text-sm text-slate-400 mb-2">
                                <strong>ההיגיון:</strong> מחברים את כולם ומחלקים בכולם. הוגן ודמוקרטי.
                            </p>
                            <p className="text-xs text-red-400 bg-red-400/10 p-2 rounded">
                                <strong>הסכנה:</strong> הוא רגיש מאוד לקיצון. אם מיליארדר נכנס לחדר, הממוצע של כולם קופץ לשמיים, למרות ששום דבר לא השתנה אצל האנשים הרגילים.
                            </p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                            <h4 className="text-lg font-bold text-emerald-400 mb-2">החציון (Median)</h4>
                            <p className="text-sm text-slate-400 mb-2">
                                <strong>ההיגיון:</strong> מעמידים את כולם בשורה ולוקחים את האמצעי.
                            </p>
                            <p className="text-xs text-green-400 bg-green-400/10 p-2 rounded">
                                <strong>היתרון:</strong> הוא &quot;עיוור&quot; לקיצון. לא אכפת לו אם הראשון בשורה הוא מיליארדר או סתם עשיר. הוא נשאר יציב.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-950/50 p-4 border border-slate-700 rounded-lg mt-4 flex gap-3 items-start">
                        <ArrowRight className="text-blue-400 mt-1 shrink-0" size={20} />
                        <div>
                            <h5 className="text-sm font-bold text-white mb-1">בוא נראה את זה בעיניים:</h5>
                            <p className="text-xs text-slate-400">
                                בסימולציה למטה יש נתוני שכר של עובדים. הכל נראה רגיל.
                                לחץ על הכפתור כדי להכניס &quot;מנכ&quot;ל&quot; עם שכר עתק, ושים לב איזה קו משתולל ואיזה נשאר רגוע.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <MeanMedianLab />
          </section>

          {/* סעיף 2: פיזור */}
          <section id="part-2" className="scroll-mt-24 mb-8">
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><TrendingUp size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">2. מדד הפחד: כמה אנחנו בטוחים?</h2>
                </div>
                
                <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none space-y-4">
                    <p>
                        אחרי שמצאנו את המרכז, השאלה הבאה היא: <strong>כמה הנתונים מפוזרים סביבו?</strong>
                        זהו אולי המדד החשוב ביותר למפתח AI, כי הוא מגדיר את רמת ה&quot;רעש&quot; (Noise) במערכת.
                    </p>
                    <p>
                        הכלי שלנו למדוד את זה נקרא <strong>סטיית תקן (Standard Deviation)</strong>.
                    </p>
                    <ul className="space-y-2 text-sm bg-slate-900 p-4 rounded-lg border border-slate-800">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span><strong>סטייה נמוכה:</strong> כל הנתונים צפופים. המודל יכול ללמוד בקלות ולחזות בדיוק גבוה.</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span><strong>סטייה גבוהה:</strong> כאוס. הנתונים מפוזרים לכל עבר. למודל יהיה קשה מאוד למצוא דפוסים.</span>
                        </li>
                    </ul>
                    
                    <div className="bg-slate-950/50 p-4 border border-slate-700 rounded-lg mt-4 flex gap-3 items-start">
                        <ArrowRight className="text-purple-400 mt-1 shrink-0" size={20} />
                        <div>
                            <h5 className="text-sm font-bold text-white mb-1">נסה בעצמך:</h5>
                            <p className="text-xs text-slate-400">
                                גרור את הסליידר ימינה כדי להגדיל את הרעש.
                                שים לב איך העקומה (ההתפלגות) הופכת ל&quot;פיתה&quot; שטוחה ורחבה. זה הסימן שהמודל מאבד ביטחון.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <StdDevSimulator />
          </section>

          {/* סעיף 3: דוגמאות מהעולם האמיתי */}
          <section id="part-3" className="scroll-mt-24 mb-8">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Users size={20} /></div>
                <div>
                    <h2 className="text-2xl font-bold text-white">3. דוגמאות מהעולם האמיתי</h2>
                    <p className="text-slate-400 text-sm">איפה תפגוש את המדדים האלה ביום-יום כמפתח?</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ExampleCard 
                    title="זמני תגובה (Latency)" 
                    scenario="ניטור שרתים (DevOps)"
                    desc="הממוצע נראה תקין? אל תאמין לו. בדוק את סטיית התקן. אם היא גבוהה, יש לך לקוחות שסובלים מאיטיות קיצונית ('Spikes') שהממוצע מסתיר."
                    icon={<Activity size={18} />} color="blue"
                />
                <ExampleCard 
                    title="מחירי נדל&quot;ן" 
                    scenario="מודל חיזוי מחירים"
                    desc="אם תאמן מודל על מחירי דירות לפי 'ממוצע', וילות יוקרה בודדות יהרסו את החיזוי לדירות רגילות. חובה להשתמש בחציון."
                    icon={<Calculator size={18} />} color="purple"
                />
                <ExampleCard 
                    title="דירוג באפליקציה" 
                    scenario="מערכות המלצה"
                    desc="מוצר עם ציון 3.0 יכול להיות בינוני (כולם נתנו 3) או שנוי במחלוקת (חצי נתנו 1, חצי נתנו 5). רק סטיית התקן תגלה את האמת."
                    icon={<Brain size={18} />} color="emerald"
                />
            </div>
          </section>

          {/* סעיף 4: NumPy Demo - התיקון הגדול! */}
          <section id="part-4" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4">4. NumPy: איך עושים את זה בקוד?</h2>
            <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none space-y-4">
                <p>
                    בפייתון, הספרייה <strong>NumPy</strong> היא כלי העבודה הראשי שלנו. היא יודעת לחשב את כל מה שלמדנו בפקודה אחת מהירה.
                </p>
                <p>
                    אבל השימוש החשוב ביותר שלה ב-AI הוא לא סתם חישוב, אלא <strong>נירמול (Normalization)</strong>. בוא נבין למה זה קריטי.
                </p>
            </div>

            <NormalizationDemo />
             
             {/* דוגמה 1: חישוב בסיסי */}
             <div className="mt-12 mb-6">
                <h3 className="text-lg font-bold text-white mb-2">דוגמה 1: חישוב מדדים בסיסי</h3>
                <p className="text-sm text-slate-400">נראה איך טוענים נתונים ומחשבים את המדדים שלמדנו.</p>
             </div>

             <InteractiveCodeBlock
                filename="stat_analysis.py"
                description="סקריפט זה טוען מערך נתונים ומחשב עבורו את הממוצע וסטיית התקן. זהו השלב הראשון בכל חקירת דאטה (Exploratory Data Analysis)."
                code={`<span class="text-purple-400">import</span> numpy <span class="text-purple-400">as</span> np<br/><br/>
<span class="text-slate-500"># נתונים מדומים: זמני תגובה של שרת במילי-שניות</span><br/>
latencies = np.array([<span class="text-blue-400">98</span>, <span class="text-blue-400">102</span>, <span class="text-blue-400">100</span>, <span class="text-blue-400">101</span>, <span class="text-blue-400">99</span>, <span class="text-blue-400">103</span>])<br/><br/>
<span class="text-slate-500"># 1. חישוב מדדים סטטיסטיים</span><br/>
avg = np.mean(latencies)      <span class="text-slate-500"># חישוב הממוצע</span><br/>
std = np.std(latencies)       <span class="text-slate-500"># חישוב סטיית התקן</span><br/><br/>
<span class="text-yellow-300">print</span>(f<span class="text-green-400">'Average: {avg}'</span>)<br/>
<span class="text-yellow-300">print</span>(f<span class="text-green-400">'Std Dev: {std:.2f}'</span>)`}
                output={`Average: 100.5\nStd Dev: 1.70`}
                explanation="ניתוח: שים לב שסטיית התקן (1.70) קטנה מאוד ביחס לממוצע. זה מעיד שהשרת יציב מאוד והביצועים עקביים."
            />
            
            <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none space-y-4 mt-12">
                <h3 className="text-xl font-bold text-white">דוגמה 2: הקוד לנירמול (Standardization)</h3>
                <p>
                    כמו שראינו בסימולציה למעלה, מודל לא יכול להתמודד עם מספרים בסדרי גודל שונים.
                    הפתרון הוא נוסחת ה-<strong>Z-Score</strong>: לוקחים כל מספר, מפחיתים ממנו את הממוצע, ומחלקים בסטיית התקן.
                </p>
                <p className="text-sm bg-slate-900 p-2 rounded border border-slate-800 inline-block">
                    התוצאה תמיד תהיה דאטה עם <strong>ממוצע 0</strong> ו<strong>סטייה 1</strong>.
                </p>
            </div>

            <InteractiveCodeBlock
                filename="normalization.py"
                description="הקוד הזה מבצע את הקסם: הוא לוקח נתונים 'משוגעים' בגדלים שונים ומנרמל אותם לסקאלה אחידה שהמודל יכול להבין."
                code={`<span class="text-purple-400">import</span> numpy <span class="text-purple-400">as</span> np<br/><br/>
<span class="text-slate-500"># דאטה מקורי: שים לב לפערים העצומים</span><br/>
data = np.array([<span class="text-blue-400">10</span>, <span class="text-blue-400">1000</span>, <span class="text-blue-400">50</span>, <span class="text-blue-400">500</span>])<br/><br/>
<span class="text-slate-500"># שלב 1: חישוב המדדים הנוכחיים</span><br/>
mean = np.mean(data)<br/>
std = np.std(data)<br/><br/>
<span class="text-slate-500"># שלב 2: ביצוע הנירמול (Z-Score Formula)</span><br/>
normalized_data = (data - mean) / std<br/><br/>
<span class="text-yellow-300">print</span>(f<span class="text-green-400">'Original Mean: {mean}'</span>)<br/>
<span class="text-yellow-300">print</span>(f<span class="text-green-400">'New Mean: {np.mean(normalized_data):.2f}'</span>) <span class="text-slate-500"># צפוי לצאת 0</span><br/>
<span class="text-yellow-300">print</span>(f<span class="text-green-400">'New Std: {np.std(normalized_data):.2f}'</span>) <span class="text-slate-500"># צפוי לצאת 1</span>`}
                output={`Original Mean: 390.0\nNew Mean: 0.00\nNew Std: 1.00`}
                explanation="הצלחה! הדאטה עבר טרנספורמציה. לא משנה אם המספרים המקוריים היו במיליונים או בשברים - עכשיו הם מיושרים לפי קו האפס. המודל מוכן ללמידה."
            />
          </section>

          {/* סעיף 5: בונוס ויזואלי */}
          <section id="part-5" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4">5. בונוס: איך זה נראה בגרף אמיתי?</h2>
            <p className="text-slate-400 text-sm mb-4">
                מתכנתי AI משתמשים המון בספריית <strong>Matplotlib</strong> כדי לצייר את הדאטה ולוודא שהנירמול עבד. הנה הצצה לאיך זה נראה בקוד אמיתי שמצייר &quot;התפלגות נורמלית&quot; (הפעמון המפורסם).
            </p>

            <InteractiveCodeBlock 
                filename="plot_distribution.py"
                description="קוד זה משתמש בספריית הגרפיקה כדי לצייר היסטוגרמה של נתונים אקראיים. שים לב לצורת הפעמון שנוצרת."
                code={`<span class="text-purple-400">import</span> matplotlib.pyplot <span class="text-purple-400">as</span> plt<br/>
<span class="text-purple-400">import</span> numpy <span class="text-purple-400">as</span> np<br/><br/>
<span class="text-slate-500"># יצירת 1000 נקודות אקראיות בהתפלגות נורמלית</span><br/>
data = np.random.normal(0, 1, 1000)<br/><br/>
<span class="text-slate-500"># יצירת הגרף</span><br/>
plt.hist(data, bins=30, alpha=0.6, color=<span class="text-green-400">'b'</span>)<br/>
plt.title(<span class="text-green-400">'Normal Distribution'</span>)<br/>
plt.show()`}
                output="[Graph Generated Successfully]"
                explanation="הגרף מראה שרוב הנתונים מתרכזים סביב ה-0 (האמצע), ויש פחות ופחות נתונים ככל שמתרחקים לצדדים. זוהי ההתנהגות הרצויה של דאטה מנורמל."
                visualContent={<MatplotlibDistribution />}
            />
          </section>

          {/* Quiz */}
          <section id="quiz" className="mt-16 pt-8 border-t border-slate-800">
             <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">בדיקת הבנה: סיכום פרק 2</h2>
                <p className="text-slate-400 text-sm">בוא נראה אם אתה מוכן לפרק הבא</p>
             </div>
             <ChapterTwoQuiz />
          </section>

        </ChapterLayout>

  );
}

// --- קומפוננטות עזר (הוספו מחדש) ---

function ExampleCard({ title, scenario, desc, icon, color }: ExampleCardProps) {
    const colors: Record<string, string> = {
        blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
        purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
        emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    };

    return (
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 relative hover:border-slate-700 transition-colors">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 border ${colors[color]}`}>
                {icon}
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">{scenario}</div>
            <h3 className="text-base font-bold text-white mb-2">{title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
        </div>
    )
}

function ChapterTwoQuiz() {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    
    const questions = [
        {
            id: 1,
            text: "מתי עדיף להשתמש בחציון (Median) על פני ממוצע?",
            options: [
                { id: 1, text: "תמיד, הממוצע הוא מדד מיושן" },
                { id: 2, text: "כשיש בנתונים ערכים קיצוניים (Outliers) שמעוותים את התמונה", correct: true },
                { id: 3, text: "כשהנתונים מסודרים מהקטן לגדול" }
            ]
        },
        {
            id: 2,
            text: "מה מספרת לנו סטיית התקן?",
            options: [
                { id: 1, text: "כמה הנתונים מפוזרים ורחוקים מהמרכז (רעש)", correct: true },
                { id: 2, text: "כמה נתונים חסרים בטבלה" },
                { id: 3, text: "את הערך הגבוה ביותר במערך" }
            ]
        },
        {
            id: 3,
            text: "למה כדאי להשתמש ב-NumPy?",
            options: [
                { id: 1, text: "כי זה נראה יפה בקוד" },
                { id: 2, text: "כי היא מבצעת חישובים מתמטיים במהירות וביעילות", correct: true },
                { id: 3, text: "כי אי אפשר לחשב ממוצע בפייתון רגיל" }
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
                <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
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
                                btnClass += "bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-400";
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="sticky bottom-8 z-50 flex justify-center pt-4"
                    >
                        <Link href="/chapter-3">
                            <Button size="lg" className="h-14 px-8 text-base bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-xl hover:scale-105 transition-transform">
                                המשך לפרק 3: הסתברות <ChevronLeft className="mr-2 h-4 w-4 rotate-180" />
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}