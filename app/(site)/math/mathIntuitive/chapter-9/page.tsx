"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, TrendingDown, TrendingUp, ArrowDownRight, MoveRight, Terminal, Play, RotateCcw, Mountain, AlertCircle, RefreshCcw, Check, BookOpen, Footprints, X } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { ChapterLayout } from '@/components/ChapterLayout';

// --- רכיבים ויזואליים פנימיים ---

// 1. גרף סטטי (Matplotlib Style)
const MatplotlibGraph = () => (
    <div className="bg-white p-4 rounded-lg mt-4 h-64 w-full relative font-sans select-none overflow-hidden border-4 border-slate-200">
        <div className="text-black text-xs font-bold text-center mb-1">Simple Error Curve</div>
        <div className="h-full w-full relative pl-8 pb-8">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-black font-medium origin-center -ml-6">Error</div>
            <div className="w-full h-full border-l border-b border-black relative">
                <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <line x1="0" y1="20" x2="200" y2="20" stroke="#eee" strokeWidth="1" />
                    <line x1="0" y1="40" x2="200" y2="40" stroke="#eee" strokeWidth="1" />
                    <line x1="0" y1="60" x2="200" y2="60" stroke="#eee" strokeWidth="1" />
                    <line x1="0" y1="80" x2="200" y2="80" stroke="#eee" strokeWidth="1" />
                    <path d="M 0 5 Q 100 190 200 5" fill="none" stroke="#1f77b4" strokeWidth="3" />
                    <circle cx="100" cy="98" r="3" fill="red" />
                    <text x="100" y="85" fontSize="8" textAnchor="middle" fill="red" fontWeight="bold">min (x=3)</text>
                </svg>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-black font-medium -mb-6">Position on the curve</div>
        </div>
    </div>
);

// 2. רכיב קוד אינטראקטיבי
const InteractiveCodeBlock = ({ filename, code, output, explanation, visualContent }: { filename: string, code: string, output: string, explanation: string, visualContent?: React.ReactNode }) => {
    const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');

    const run = () => {
        setStatus('running');
        setTimeout(() => setStatus('done'), 1500);
    };

    const reset = () => setStatus('idle');

    return (
        <div className="my-8 border border-slate-800 rounded-xl overflow-hidden bg-[#0d1117] shadow-2xl relative group">
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
                    className={`h-7 text-xs font-bold gap-2 transition-all ${status === 'done' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-green-600 hover:bg-green-500'}`}
                >
                    {status === 'running' ? <RefreshCcw size={12} className="animate-spin"/> : status === 'done' ? <RotateCcw size={12}/> : <Play size={12} fill="currentColor"/>}
                    {status === 'done' ? 'נקה פלט' : status === 'running' ? 'מריץ...' : 'הרץ קוד'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-5 font-mono text-sm text-slate-300 border-b lg:border-b-0 lg:border-l border-slate-800 overflow-x-auto leading-relaxed" dir="ltr">
                    <pre dangerouslySetInnerHTML={{ __html: code }} />
                </div>
                <div className="bg-[#090c10] p-5 font-mono text-sm relative min-h-50 flex flex-col justify-between">
                    <div className="absolute top-2 right-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold select-none">Terminal Output</div>
                    <AnimatePresence mode="wait">
                        {status === 'idle' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex items-center justify-center text-slate-600 italic text-xs">
                                לחץ על &quot;הרץ קוד&quot; כדי לראות את התוצאה...
                            </motion.div>
                        )}
                        {status === 'running' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-blue-400 gap-3">
                                <RefreshCcw size={24} className="animate-spin opacity-50" />
                                <span className="text-xs tracking-wider">EXECUTING SCRIPT...</span>
                            </motion.div>
                        )}
                        {status === 'done' && (
                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-green-400 whitespace-pre-wrap leading-relaxed w-full" dir="ltr">
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
                            <span className="text-blue-400 font-bold">ניתוח:</span> {explanation}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

// 3. סימולטור השיפוע (סליידר)
const SlopeSimulator = () => {
  const [position, setPosition] = useState(80); 
  const slope = 2 * (position - 50);
  const height = Math.pow(position - 50, 2) / 25; 
  const slopeAbs = Math.abs(slope);
  const direction = slope > 0 ? "left" : "right"; 
  const isFlat = slopeAbs < 5;
  const arrowColor = isFlat ? "text-green-400" : "text-red-400";

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden my-12 group">
      <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors duration-500"></div>
      <div className="flex justify-between items-start z-10 relative mb-6">
          <div>
            <h3 className="text-white font-bold flex items-center gap-2 text-lg">
                <Mountain size={20} className="text-orange-400"/> המעבדה: להרגיש את השיפוע
            </h3>
            <p className="text-xs text-slate-400 mt-1">הזז את הסליידר כדי לראות איך השיפוע משתנה</p>
          </div>
          <div className="text-right bg-slate-950 px-3 py-1 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Slope Value</div>
              <div className={`font-mono font-bold text-xl ${arrowColor}`}>{slope.toFixed(1)}</div>
          </div>
      </div>
      <div className="relative h-56 w-full border-b border-slate-700 bg-slate-950/50 rounded-xl overflow-hidden mb-6 shadow-inner">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px]"></div>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <path d="M0,0 Q50,200 100,0" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" transform="scale(1, -1) translate(0, -200)" />
          </svg>
          <motion.div 
              className="absolute w-5 h-5 bg-white rounded-full border-4 border-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.8)] z-20"
              animate={{ left: `${position}%`, bottom: `${100 - Math.min(Math.max(height, 0), 100)}%` }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
          <motion.div 
              className={`absolute flex flex-col items-center gap-1 font-bold text-xs ${arrowColor} z-10`}
              animate={{ left: `${position}%`, bottom: `${100 - Math.min(Math.max(height, 0), 100) + 12}%`, opacity: isFlat ? 0 : 1 }}
          >
              {direction === 'left' ? <><ArrowDownRight size={32} style={{ transform: 'scaleX(-1)' }} /> <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">זוז שמאלה!</span></> : <><span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">זוז ימינה!</span> <ArrowDownRight size={32} /></>}
          </motion.div>
          {isFlat && (
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold border border-green-500/50 flex items-center gap-2">
                 <Check size={16} /> הגעת למינימום!
             </motion.div>
          )}
      </div>
      <input type="range" min="0" max="100" step="1" value={position} onChange={(e) => setPosition(parseFloat(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500 relative z-10" />
      <div className="flex justify-between text-xs text-slate-500 px-1 mt-2 font-mono">
          <span>HIGH ERROR (Left)</span>
          <span>MINIMUM</span>
          <span>HIGH ERROR (Right)</span>
      </div>
    </div>
  )
}

// 4. מעבדת הצעדים (הכדור הקופץ)
const LearningStepsLab = () => {
    const [history, setHistory] = useState<number[]>([-1]);
    const learningRate = 0.2;

    const performStep = () => {
        const currentX = history[history.length - 1];
        const slope = 2 * (currentX - 3);
        const nextX = currentX - (learningRate * slope);
        setHistory(prev => [...prev, nextX]);
    };

    const reset = () => setHistory([-1]);
    const normalize = (val: number) => ((val + 2) / 10) * 100;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Visual */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 relative h-64 overflow-hidden">
                <div className="absolute top-4 left-4 text-xs text-slate-500 flex items-center gap-2">
                    <Footprints size={14} /> מסלול הלמידה
                </div>
                <div className="absolute bottom-10 left-0 w-full h-px bg-slate-700"></div>
                <div className="absolute bottom-0 w-px h-full border-r border-dashed border-green-500/30" style={{ left: `${normalize(3)}%` }}>
                    <span className="absolute bottom-2 left-2 text-[10px] text-green-500 bg-slate-900 px-1">Target (3)</span>
                </div>
                {history.map((x, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: i === history.length - 1 ? 1 : 0.4 }}
                        className={`absolute w-3 h-3 rounded-full -translate-x-1/2 ${i === history.length - 1 ? 'bg-blue-500 border-2 border-white z-10 w-4 h-4' : 'bg-slate-600'}`}
                        style={{ left: `${normalize(x)}%`, bottom: '40px' }}
                    >
                        {i === history.length - 1 && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] text-white font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                x={x.toFixed(2)}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-sm flex-1 relative overflow-hidden" dir="ltr">
                    <div className="absolute top-0 right-0 p-2 opacity-50 text-xs text-slate-500">learning_step.py</div>
                    <div className="space-y-2 text-xs md:text-sm leading-relaxed">
                        <span className="text-purple-400"># Current State</span><br/>
                        x = <span className="text-yellow-300">{history[history.length-1].toFixed(4)}</span><br/><br/>
                        <span className="text-slate-500"># 1. Calculate Slope</span><br/>
                        slope = 2 * (x - 3)<br/>
                        <span className="text-slate-500 opacity-70"># Slope: {(2 * (history[history.length-1] - 3)).toFixed(4)}</span><br/><br/>
                        <span className="text-slate-500"># 2. Update Position</span><br/>
                        x = x - (0.2 * slope)<br/>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={performStep} disabled={Math.abs(history[history.length-1] - 3) < 0.01} className="flex-1 bg-blue-600 hover:bg-blue-500">
                        <Play size={16} className="mr-2 fill-current" /> בצע צעד למידה
                    </Button>
                    <Button onClick={reset} className="bg-slate-950 border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white px-4">
                        <RotateCcw size={16} />
                    </Button>
                </div>
                
                {Math.abs(history[history.length-1] - 3) < 0.01 && (
                    <div className="text-center text-xs text-green-400 font-bold animate-pulse bg-green-500/10 py-2 rounded border border-green-500/30">
                        המודל התכנס! (השיפוע קטן מ-0.01)
                    </div>
                )}
            </div>
        </div>
    )
}

// --- העמוד הראשי ---

export default function ChapterNine() {
  return (
   
         
           <ChapterLayout courseId="mathIntuitive" currentChapterId={9}>
          
          {/* סעיף 1: מה זה שיפוע */}
          <section id="part-1" className="scroll-mt-24">
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400"><TrendingDown size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">1. מה זה שיפוע? (בלי להגיד &quot;נגזרת&quot;)</h2>
                </div>
                
                <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none space-y-6">
                    <p>
                        כדי שמודל ילמד לרדת בעקומה של הטעות, הוא צריך לדעת לאן ללכת.
                        הוא יודע שיש עקומה, הוא יודע שיש נקודות גבוהות ונמוכות, אבל <strong>איך הוא מחליט מהו הצעד הבא?</strong>
                    </p>
                    <p>
                        התשובה היא: <strong>שיפוע</strong>.
                        ובוא נסביר אותו בצורה הכי אנושית שאפשר, בלי להשתמש במילה &quot;נגזרת&quot;.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-orange-500 p-6 rounded-r-xl">
                        <p className="font-bold text-white text-xl mb-2">שיפוע הוא פשוט &quot;כמה תלול השטח מתחתיך&quot;</p>
                        <p>אם אתה עומד על גבעה:</p>
                        <ul className="mt-4 space-y-2">
                            <li className="flex items-center gap-2"><ArrowDownRight className="text-red-400" size={18}/> <span className="text-slate-300"><strong>שיפוע גבוה</strong> אומר שהקרקע יורדת חזק לכיוון מסוים.</span></li>
                            <li className="flex items-center gap-2"><MoveRight className="text-green-400" size={18}/> <span className="text-slate-300"><strong>שיפוע נמוך</strong> אומר שהקרקע כמעט שטוחה.</span></li>
                            <li className="flex items-center gap-2"><TrendingUp className="text-yellow-400" size={18}/> <span className="text-slate-300"><strong>שיפוע חיובי</strong> אומר שאתה עולה.</span></li>
                            <li className="flex items-center gap-2"><TrendingDown className="text-blue-400" size={18}/> <span className="text-slate-300"><strong>שיפוע שלילי</strong> אומר שאתה יורד.</span></li>
                        </ul>
                    </div>
                    <p>
                        המודל מבצע את זה בדיוק, רק על עקומה של טעות במקום על גבעה אמיתית.
                    </p>
                </div>
            </div>
            {/* כאן אפשר להוסיף שוב את ה-SlopeSimulator אם רוצים לחזק את ההבנה כבר בהתחלה, אבל המשתמש שם אותו בסוף פרק 4. נשאיר אותו שם כדי לא להעמיס. */}
          </section>

          {/* סעיף 2: איך השיפוע עוזר למודל? */}
          <section id="part-2" className="mb-8">
            <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none space-y-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><BookOpen className="text-blue-400"/> איך השיפוע עוזר למודל?</h3>
                <p>
                    הוא נותן למודל תשובה לשאלה הכי חשובה במהלך האימון:
                    <br/>
                    <span className="text-blue-300 font-medium bg-blue-500/10 px-2 py-1 rounded inline-block mt-2">
                        &quot;אם אזוז קצת שמאלה או ימינה – האם הטעות תגדל או תקטן?&quot;
                    </span>
                </p>
                <p>
                    זה כל הסיפור. המודל בודק את השיפוע במקום שבו הוא נמצא:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
                    <li className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <strong className="text-white block mb-1">שיפוע גדול</strong>
                        <span className="text-sm text-slate-400">צריך לזוז מהר (אנחנו רחוקים).</span>
                    </li>
                    <li className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <strong className="text-white block mb-1">שיפוע קטן</strong>
                        <span className="text-sm text-slate-400">להתקדם בעדינות (אנחנו קרובים).</span>
                    </li>
                    <li className="bg-slate-900 border border-slate-800 p-4 rounded-xl border-b-4 border-b-green-500">
                        <strong className="text-white block mb-1">שיפוע אפס</strong>
                        <span className="text-sm text-slate-400">אתה בול במינימום. עצור.</span>
                    </li>
                </ul>
                <p>
                    <strong>למה חשוב להבין את זה?</strong> כי שיפוע אומר למודל יותר מכל דבר אחר: כמה טעות יש כאן, ומה יקרה אם אזוז.
                    אפשר לחשוב על זה כעל &quot;מד טעות מקומי&quot; שמכוון את כל תהליך הלמידה.
                </p>
                <p>
                    המודל לא רואה את כל העקומה. הוא רואה רק את האזור שהוא נמצא בו, ואת השיפוע שמוביל אותו קדימה.
                    זו הסיבה שבפועל כל תהליך הלמידה נשען על הרעיון הזה: <strong>לחשב שיפוע ולזוז לכיוון שמקטין טעות.</strong>
                </p>
            </div>
          </section>

          {/* סעיף 3: למה שיפוע = כמות הטעות */}
          <section id="part-3" className="mb-8">
            <div className="bg-slate-900/30 border border-slate-800 p-8 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><AlertCircle size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">למה שיפוע אומר לנו &quot;כמה טעות יש כאן&quot;?</h2>
                </div>
                <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none space-y-4">
                    <p>
                        עכשיו כשהרעיון של שיפוע ברור, ניכנס למשהו עמוק יותר: למה מודלים מסתמכים דווקא עליו כדי לדעת איך להתקדם?
                        התשובה פשוטה יותר ממה שנדמה.
                    </p>
                    
                    <div className="space-y-4 my-6">
                        <div className="flex gap-4">
                            <div className="w-1 bg-red-500 rounded-full"></div>
                            <div>
                                <h4 className="text-white font-bold">שיפוע גבוה = אזור עם טעות גדולה</h4>
                                <p className="text-sm text-slate-400 mt-1">
                                    כששיפוע חד, זה אומר שהעקומה משתנה מהר. הטעות קופצת בצורה משמעותית.
                                    זה כמו להגיד: &quot;משהו פה ממש לא מדויק, תזוז חזק לכיוון הירידה.&quot;
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1 bg-green-500 rounded-full"></div>
                            <div>
                                <h4 className="text-white font-bold">שיפוע נמוך = אזור עם טעות קטנה</h4>
                                <p className="text-sm text-slate-400 mt-1">
                                    כששיפוע קטן, העקומה כמעט שטוחה. זה רמז למודל שהוא מתקרב למקום טוב.
                                    הוא לא צריך לקפוץ, אלא לבצע צעד קטן ועדין.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p>
                        השיפוע נותן כיוון וגם עוצמה. זו הסיבה שהשיפוע הוא הכלי המרכזי שמודלים משתמשים בו.
                        הוא מסביר גם לאן לזוז וגם כמה לזוז.
                    </p>
                </div>
            </div>
          </section>

          {/* סעיף 4: הדגמה קצרה עם גרף פשוט (קוד + מעבדה) */}
          <section id="part-4">
             <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800"><Terminal className="text-purple-400" size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">הדגמה קצרה עם גרף פשוט</h2>
                </div>
                <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none">
                    <p>
                        כדי שהרעיון של שיפוע יהפוך למוחשי, נבנה רגע את הדוגמה הפשוטה ביותר: עקומה בצורת U.
                        זו עקומה שמייצגת טעות: גבוהה בצדדים, נמוכה באמצע.
                    </p>
                    <p>נניח שהטעות מוגדרת כך:</p>
                </div>
            </div>

            {/* Code Block 1: Error Function (With Graph Output!) */}
            <InteractiveCodeBlock 
                filename="plot_error.py"
                code={`<span class="text-purple-400">import</span> numpy <span class="text-purple-400">as</span> np<br/>
<span class="text-purple-400">import</span> matplotlib.pyplot <span class="text-purple-400">as</span> plt<br/><br/>

<span class="text-slate-500"># Simple error function</span><br/>
<span class="text-blue-400">def</span> <span class="text-yellow-300">error</span>(x):<br/>
&nbsp;&nbsp;<span class="text-purple-400">return</span> (x - 3)**2 + 2<br/><br/>

xs = np.linspace(-2, 8, 200)<br/>
ys = error(xs)<br/><br/>

plt.plot(xs, ys)<br/>
plt.xlabel(<span class="text-green-400">"Position"</span>)<br/>
plt.ylabel(<span class="text-green-400">"Error"</span>)<br/>
plt.show()`}
                output={`[Graph Generated]`}
                visualContent={<MatplotlibGraph />}
                explanation="אם תריץ את הקוד הזה, תראה גרף עם צורה ברורה מאוד: הטעות גבוהה בקצוות, ונמוכה בנקודה אחת באמצע, באזור של x=3. זו נקודת המינימום."
            />

            <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none my-8">
                <p>
                    <strong>מה המודל &quot;מרגיש&quot; לאורך העקומה?</strong>
                    <br/>
                    נניח שהמודל נמצא בנקודה גבוהה בצד שמאל. שם השיפוע גדול מאוד. זה כמו לעמוד על מדרון תלול – ברור לגמרי לאן צריך לזוז.
                    באזור המרכז, ליד המינימום, העקומה כמעט שטוחה. השיפוע קטן מאוד. המודל מבין שהוא קרוב לפתרון טוב וצריך לנוע באיטיות.
                </p>
            </div>

            {/* Visual Simulator */}
            <SlopeSimulator />

            <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none mt-12">
                <h3 className="text-xl font-bold text-white mb-4">איך מודל היה &quot;מיישם&quot; את זה?</h3>
                <p>
                    נוסיף קטע קוד קטן שמדמה צעד אחד של תהליך הלמידה.
                    בכל צעד, המודל יזוז לכיוון הנכון ובקפיצה שמתאימה לגודל השיפוע.
                </p>
            </div>

            {/* Code Block 2: Learning Loop */}
            <InteractiveCodeBlock 
                filename="gradient_descent_step.py"
                code={`<span class="text-slate-500"># Starting point</span><br/>
x = -1<br/>
learning_rate = 0.1<br/><br/>

<span class="text-blue-400">print</span>(<span class="text-green-400">"Starting Descent:"</span>)<br/>
<span class="text-blue-400">for</span> step <span class="text-blue-400">in</span> <span class="text-yellow-300">range</span>(5):<br/>
&nbsp;&nbsp;<span class="text-slate-500"># Calculate slope: 2*(x-3)</span><br/>
&nbsp;&nbsp;slope = 2 * (x - 3)<br/><br/>
    
&nbsp;&nbsp;<span class="text-slate-500"># Move against slope</span><br/>
&nbsp;&nbsp;x = x - learning_rate * slope<br/><br/>
    
&nbsp;&nbsp;<span class="text-blue-400">print</span>(f<span class="text-green-400">"Step {step + 1}: x = {x:.4f}"</span>)`}
                output={`Starting Descent:
Step 1: x = -0.2000
Step 2: x = 0.4400
Step 3: x = 0.9520
Step 4: x = 1.3616
Step 5: x = 1.6893`}
                explanation="מה ראינו? הערך של x מתקרב בהדרגה ל-3. בכל צעד, השיפוע מכוון את המודל. ככל שמתקרבים, השיפוע קטן והצעדים נהיים קטנים ועדינים יותר."
            />

            <div className="bg-blue-500/10 border-l-4 border-blue-500 p-6 rounded-r-xl mt-8">
                <h4 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
                    <Check size={18}/> למה הדוגמה הזו חשובה לך כמפתח?
                </h4>
                <p className="text-slate-300 text-base leading-relaxed">
                    כי היא מתארת בצורה אנושית את כל תהליך הלמידה: יש עקומה שמייצגת טעות, השיפוע אומר למודל לאן לזוז, כל צעד הוא ניסיון להקטין טעות, והמודל נע עד שהוא מתקרב לנקודה שבה השיפוע כמעט אפס.
                    <br/><br/>
                    <strong>אין קסם. אין החלטות נסתרות. רק רצף של תיקונים קטנים.</strong>
                </p>
            </div>

            {/* מעבדת הצעדים (Learning Steps Lab) - הוחזרה לכאן! */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 mt-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800"><Play className="text-blue-400" size={18} /></div>
                    <h3 className="font-bold text-white">בוא נראה את זה קורה בזמן אמת</h3>
                </div>
                <p className="text-sm text-slate-400 mb-6">
                    לחץ על הכפתור &quot;בצע צעד למידה&quot; ותראה איך המודל מתקדם ל-3.
                </p>
                <LearningStepsLab />
            </div>

          </section>

          {/* Quiz */}
          <section id="quiz" className="mt-16 pt-8 border-t border-slate-800">
             <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">בדיקת הבנה: סיכום פרק 9</h2>
                <p className="text-slate-400 text-sm">האם הבנת איך המודל משתמש בשיפוע?</p>
             </div>
             <ChapterNineQuiz />
          </section>
         </ChapterLayout>           
   
  );
}


// --- קומפוננטות עזר ---

function ChapterNineQuiz() {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    
    const questions = [
        {
            id: 1,
            text: "מה אומר שיפוע תלול (גבוה) למודל?",
            options: [
                { id: 1, text: "שהוא קרוב מאוד לפתרון" },
                { id: 2, text: "שהטעות משתנה מהר, ולכן צריך לבצע תיקון משמעותי", correct: true },
                { id: 3, text: "שהוא צריך לעצור" }
            ]
        },
        {
            id: 2,
            text: "מה קורה לצעדי הלמידה כשהמודל מתקרב למינימום?",
            options: [
                { id: 1, text: "הם נהיים קטנים יותר ועדינים יותר", correct: true },
                { id: 2, text: "הם נהיים גדולים יותר כדי לסיים מהר" },
                { id: 3, text: "הם נשארים בגודל קבוע" }
            ]
        },
        {
            id: 3,
            text: "מהו התפקיד הכפול של השיפוע?",
            options: [
                { id: 1, text: "לסמן כיוון (לאן לזוז) ועוצמה (כמה לזוז)", correct: true },
                { id: 2, text: "לחשב את אחוז הדיוק הסופי" },
                { id: 3, text: "למחוק נתונים שגויים" }
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
                        <Link href="/chapter-10">
                            <Button size="lg" className="h-14 px-10 text-base bg-linear-to-r from-orange-600 to-indigo-600 hover:from-orange-500 hover:to-indigo-500 text-white rounded-full shadow-[0_0_40px_rgba(249,115,22,0.5)] border-t border-orange-400/30 hover:scale-105 transition-transform">
                                <span className="font-bold">המשך לפרק 10: Gradient Descent</span> <ChevronLeft className="mr-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}