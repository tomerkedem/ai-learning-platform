"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
    ChevronLeft, CloudRain, Sun, Filter, Table2, Search, GitCommit, Check, X, Umbrella, 
    AlertOctagon, Terminal, Lightbulb, Activity, RefreshCcw, RotateCcw, Play, ArrowRight
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
                    className={`h-7 text-xs font-bold gap-2 transition-all ${status === 'done' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-purple-600 hover:bg-purple-500'}`}
                >
                    {status === 'running' ? <RefreshCcw size={12} className="animate-spin"/> : status === 'done' ? <RotateCcw size={12}/> : <Play size={12} fill="currentColor"/>}
                    {status === 'done' ? 'אפס' : status === 'running' ? 'מריץ...' : 'הרץ קוד'}
                </Button>
            </div>
            
            <div className="p-4 bg-slate-900/80 border-b border-slate-800 text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                <Terminal size={16} className="text-purple-400 shrink-0 mt-0.5" />
                <div>
                    <span className="font-bold text-purple-400 ml-1">הסבר על הקוד:</span>
                    {description}
                </div>
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
                                <span>המתנה להרצה...</span>
                            </motion.div>
                        )}
                        {status === 'running' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-blue-400 gap-3">
                                <RefreshCcw size={24} className="animate-spin opacity-50" />
                                <span className="text-xs tracking-wider">CALCULATING PROBABILITIES...</span>
                            </motion.div>
                        )}
                        {status === 'done' && (
                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-purple-400 whitespace-pre-wrap leading-relaxed w-full pt-4" dir="ltr">
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

// --- 2. סימולטור הקשר (גשם ועננים) ---
const ContextSimulator = () => {
  const [context, setContext] = useState<'general' | 'cloudy'>('general');

  // נתונים (ימים בחודש)
  const totalDays = 20;
  
  // יצירת ימים לסימולציה
  const renderDays = () => {
    let rainCount = 0;
    const days = Array.from({ length: totalDays }).map((_, i) => {
        let isRaining = false;
        let isCloudy = false;

        if (context === 'general') {
            // באופן כללי: יורד גשם ב-20% מהימים
            isRaining = i < 4; 
            isCloudy = i < 6; // קצת עננים
        } else {
            // בהינתן עננים שחורים: יורד גשם ב-80% מהימים
            isCloudy = true;
            isRaining = i < 16;
        }

        if (isRaining) rainCount++;

        return (
            <motion.div 
                key={i}
                layout
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`
                    w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-500
                    ${isRaining ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 
                      isCloudy ? 'bg-slate-700/50 border-slate-600 text-slate-400' : 
                      'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'}
                `}
            >
                {isRaining ? <CloudRain size={16} /> : isCloudy ? <Filter size={16} /> : <Sun size={16} />}
            </motion.div>
        );
    });

    return { elements: days, rainCount };
  };

  const { elements, rainCount } = renderDays();
  const probability = rainCount / totalDays;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden my-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10 relative">
          <div>
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Umbrella size={20} className="text-blue-400"/>
                  המעבדה: כוחו של ההקשר
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                  מה הסיכוי לגשם? תלוי איזה מידע יש לך.
              </p>
          </div>
          
          <div className="flex gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button 
                onClick={() => setContext('general')}
                className={`px-4 py-2 rounded text-xs font-bold transition-all ${context === 'general' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
              >
                  שאלה כללית
              </button>
              <button 
                onClick={() => setContext('cloudy')}
                className={`px-4 py-2 rounded text-xs font-bold transition-all ${context === 'cloudy' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
              >
                  יש עננים שחורים (Condition)
              </button>
          </div>
      </div>

      <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-6 flex flex-col items-center">
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
              {elements}
          </div>
          
          <div className="flex items-center gap-4 text-sm font-mono bg-black/40 px-4 py-2 rounded border border-slate-800">
              <span className="text-slate-400">
                  {context === 'general' ? 'P(Rain)' : 'P(Rain | Clouds)'} = 
              </span>
              <span className={`text-xl font-bold ${probability > 0.5 ? 'text-blue-400' : 'text-yellow-400'}`}>
                  {probability.toFixed(2)}
              </span>
          </div>
          <p className="text-xs text-slate-500 mt-3 text-center max-w-md">
              {context === 'general' 
                ? "בלי הקשר, הסיכוי לגשם נמוך (20%). זה ה-'Prior' שלך." 
                : "ברגע שיש הקשר (עננים), מרחב המדגם משתנה וההסתברות קופצת (80%). זו הסתברות מותנית."}
          </p>
      </div>
    </div>
  );
};

// --- 3. חוקר בייס (טבלת הספאם האינטראקטיבית) ---
const BayesTableExplorer = () => {
    const [focus, setFocus] = useState<'all' | 'free'>('all');

    // נתונים מהטקסט
    const data = {
        free: { spam: 42, ham: 3 },
        noFree: { spam: 1158, ham: 797 }
    };

    const totalSpam = data.free.spam + data.noFree.spam; // 1200
    const totalHam = data.free.ham + data.noFree.ham;   // 800
    
    // חישוב אחוז ספאם בהינתן המילה free
    const probSpamGivenFree = data.free.spam / (data.free.spam + data.free.ham);

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 mt-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -z-10"></div>
            
            <div className="mb-6">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Table2 size={20} className="text-purple-400"/>
                    בייס בטבלה: המילה &quot;Free&quot;
                </h3>
                <p className="text-sm text-slate-400">
                    לחץ על השורה הראשונה כדי לראות מה קורה להסתברות כשהמודל מזהה את המילה.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* הטבלה */}
                <div className="lg:col-span-2 space-y-2">
                    {/* Header */}
                    <div className="grid grid-cols-3 text-xs text-slate-500 uppercase tracking-wider px-4 pb-2 border-b border-slate-800">
                        <div>המילה &quot;Free&quot;?</div>
                        <div className="text-center text-red-400">ספאם</div>
                        <div className="text-center text-emerald-400">הודעה רגילה</div>
                    </div>

                    {/* Row 1: Word Exists */}
                    <button 
                        onClick={() => setFocus(focus === 'free' ? 'all' : 'free')}
                        className={`w-full grid grid-cols-3 items-center px-4 py-4 rounded-xl border transition-all duration-300 text-sm group
                        ${focus === 'free' 
                            ? 'bg-purple-900/20 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.1)] scale-[1.02]' 
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-50'}`}
                    >
                        <div className="flex items-center gap-2 font-bold text-white">
                            <Check size={16} className="text-purple-400" /> מופיעה
                        </div>
                        <div className="text-center font-mono font-bold text-red-400 text-lg">
                            {data.free.spam}
                        </div>
                        <div className="text-center font-mono font-bold text-emerald-400 text-lg">
                            {data.free.ham}
                        </div>
                    </button>

                    {/* Row 2: Word Missing */}
                    <div className={`grid grid-cols-3 items-center px-4 py-4 rounded-xl border border-slate-800 bg-slate-950 text-sm transition-all duration-500
                        ${focus === 'free' ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}
                    >
                        <div className="flex items-center gap-2 text-slate-400">
                            <X size={16} /> לא מופיעה
                        </div>
                        <div className="text-center font-mono text-slate-500">
                            {data.noFree.spam}
                        </div>
                        <div className="text-center font-mono text-slate-500">
                            {data.noFree.ham}
                        </div>
                    </div>
                </div>

                {/* התובנה (פאנל צד) */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-center relative overflow-hidden">
                    <div className={`transition-all duration-500 absolute inset-0 bg-linear-to-b from-purple-500/10 to-transparent ${focus === 'free' ? 'opacity-100' : 'opacity-0'}`}></div>
                    
                    <div className="relative z-10 text-center">
                        <div className="text-xs text-slate-500 uppercase mb-2 font-bold">ההסתברות לספאם</div>
                        
                        {focus === 'all' ? (
                            <div className="space-y-2">
                                <div className="text-3xl font-mono font-bold text-slate-300">
                                    {((totalSpam / (totalSpam + totalHam)) * 100).toFixed(0)}%
                                </div>
                                <p className="text-xs text-slate-500">
                                    באופן כללי (בלי לדעת כלום), רוב ההודעות הן ספאם (1200 מתוך 2000).
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-4xl font-mono font-bold text-purple-400"
                                >
                                    {(probSpamGivenFree * 100).toFixed(1)}%
                                </motion.div>
                                <p className="text-xs text-purple-200">
                                    ברגע שראינו &quot;Free&quot;, אנחנו מתעלמים משאר הטבלה.
                                    מסתכלים רק על השורה העליונה: 42 מול 3.
                                    <br/>
                                    <strong>החשד הפך לכמעט ודאות.</strong>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- העמוד הראשי ---

export default function ChapterFour() {
  return (
   
      
        <ChapterLayout courseId="mathIntuitive" currentChapterId={4}>
          
          {/* סעיף 1: מהי הסתברות מותנית */}
          <section id="part-1" className="scroll-mt-24 mb-8">
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><GitCommit size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">1. מה זו באמת הסתברות מותנית?</h2>
                </div>
                
                <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none space-y-4">
                    <p>
                        בפרק הקודם דיברנו על שאלה פשוטה: <strong>&quot;כמה פעמים משהו קורה מתוך כל המקרים?&quot;</strong>.
                        זו הסתברות בסיסית, והיא חשובה. אבל בחיים האמיתיים – ובטח בעולם ה-AI – זו לא השאלה שאנחנו באמת רוצים לשאול.
                    </p>
                    <p>
                        השאלה האמיתית היא: <strong>&quot;כמה פעמים משהו קורה בתוך קבוצה מסוימת?&quot;</strong>.
                    </p>
                    
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl my-6">
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                            <Umbrella size={18} className="text-blue-400"/> דוגמה יומיומית
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <p className="text-slate-500 mb-1">שאלה כללית:</p>
                                <p className="text-white">&quot;מה הסיכוי שירד היום גשם?&quot;</p>
                                <div className="mt-2 text-xs bg-slate-800 p-2 rounded text-slate-400">בודקים את כל הימים בשנה. (נניח 20%)</div>
                            </div>
                            <div className="border-r border-slate-800 pr-6">
                                <p className="text-slate-500 mb-1">שאלה מותנית:</p>
                                <p className="text-white">&quot;מה הסיכוי שירד גשם <strong>בהינתן שיש עננים שחורים?</strong>&quot;</p>
                                <div className="mt-2 text-xs bg-blue-900/30 text-blue-300 p-2 rounded border border-blue-500/30">אנחנו בודקים רק מצב חלקי. הסיכוי קופץ ל-80%.</div>
                            </div>
                        </div>
                    </div>

                    <p>
                        ברגע שיש הקשר (Context), הסיכוי משתנה. אנחנו כבר לא בודקים את הכול, אלא תת-קבוצה. וזה בדיוק מהות ההסתברות המותנית.
                    </p>
                </div>
            </div>

            {/* סימולטור ההקשר */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-blue-400 font-bold bg-blue-400/10 p-3 rounded border border-blue-400/20">
                    <ArrowRight size={16} /> נסה בעצמך: החלף בין &quot;שאלה כללית&quot; ל-&quot;עננים שחורים&quot; וראה איך ההסתברות משתנה.
                </div>
                <ContextSimulator />
            </div>

            <div className="mt-6 flex gap-4 text-sm text-slate-400 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <AlertOctagon className="text-yellow-500 shrink-0" size={20} />
                <p>
                    מודלים לא עובדים על עיוור. הם תמיד שואלים: &quot;מה הסיכוי שהמשתמש יעזוב, <strong>בהינתן</strong> שזו הפנייה השלישית שלו החודש?&quot;.
                    המילה הקטנה הזו &quot;בהינתן&quot; (Given) היא כל ההבדל.
                </p>
            </div>
          </section>


          {/* סעיף 2: בייס דרך טבלאות */}
          <section id="part-2" className="scroll-mt-24 mb-8">
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Table2 size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">2. בייס דרך טבלאות (בלי נוסחאות)</h2>
                </div>
                
                <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none space-y-4">
                    <p>
                        כדי להבין את &quot;חוק בייס&quot; המפורסם, לא צריך מתמטיקה כבדה. צריך פשוט להסתכל על טבלה.
                        בייס אומר דבר פשוט: <strong>כשמגיע מידע חדש (ראיות), צריך לעדכן את האמונות שלנו.</strong>
                    </p>
                    <p>
                        המילה &quot;בייס&quot; היא לא מונח טכני, אלא שמו של תומס בייס, שהבין שצריך לשלב ידע קודם עם מידע חדש.
                    </p>
                    <p>
                        בוא ניקח את הדוגמה הקלאסית: זיהוי ספאם. סרקנו אלפי מיילים וספרנו כמה פעמים המילה <code>free</code> מופיעה.
                        הנה הנתונים האמיתיים בטבלה האינטראקטיבית למטה:
                    </p>
                </div>
            </div>

            <BayesTableExplorer />
            
            <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none mt-8">
                <p>
                    הטבלה מציגה שני עולמות: העולם הכללי (כמה ספאם יש בכלל) והעולם שבקונטקסט (מה קורה כשרואים &quot;Free&quot;).
                    בייס פשוט מחבר ביניהם ושואל: <strong>בהינתן שאני רואה Free, איזה תרחיש הופיע יותר פעמים?</strong>
                </p>
            </div>

          </section>


          {/* סעיף 3: סבירות ולא ודאות */}
          <section id="part-3" className="scroll-mt-24 mb-8">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Search size={20} /></div>
                <div>
                    <h2 className="text-2xl font-bold text-white">3. מה מסתתר מאחורי &quot;כמה סביר?&quot;</h2>
                </div>
            </div>

            <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none mb-8">
                <p>
                    המוח האנושי אוהב שחור ולבן. מודלים עובדים באפור.
                    הם לא אומרים &quot;זו הודעת ספאם&quot;. הם אומרים: &quot;בהקשר הזה, יש יותר ראיות לספאם מאשר להודעה רגילה&quot;.
                </p>
                <p>
                    הבנה של <strong>Likelihood (סבירות)</strong> היא קריטית למפתח. אחוזים הם לא סתם מספרים, הם רמזים למבנה הדאטה.
                    כשאתה מבין שהמודל בודק סבירות ולא אמת מוחלטת, אתה פתאום מבין למה הוא טועה לפעמים.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                    <h4 className="font-bold text-white mb-2">חשיבה של מתכנת רגיל</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li className="flex gap-2"><X size={16} className="text-red-500"/> אם יש &quot;Free&quot;, זה ספאם (True).</li>
                        <li className="flex gap-2"><X size={16} className="text-red-500"/> אם אין, זה תקין (False).</li>
                    </ul>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl border-l-4 border-l-purple-500">
                    <h4 className="font-bold text-white mb-2">חשיבה של מפתח AI</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li className="flex gap-2"><Check size={16} className="text-green-500"/> הנוכחות של &quot;Free&quot; מעלה את הסבירות ב-90%.</li>
                        <li className="flex gap-2"><Check size={16} className="text-green-500"/> המודל מחפש ראיות נוספות לחיזוק.</li>
                    </ul>
                </div>
            </div>
          </section>


          {/* סעיף 4: Code Demo */}
          <section id="part-4" className="scroll-mt-24">
             <div className="flex flex-col gap-6 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Terminal size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">4. הדגמה בקוד: לתרגם טבלה לפייתון</h2>
                </div>
                <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none">
                    <p>
                        אחרי שעברנו דרך התיאוריה, הגיע הזמן לראות את זה בקוד.
                        לא נוסחאות כבדות, אלא חישוב פשוט של יחסים מתוך הטבלה שראינו קודם.
                    </p>
                </div>
             </div>
                
            <InteractiveCodeBlock 
                filename="bayes_demo.py"
                description="הקוד מחשב את ההסתברות המותנית: מה הסיכוי למצוא את המילה 'Free' בתוך קבוצת הספאם, לעומת הסיכוי למצוא אותה בהודעות רגילות."
                code={`<span class="text-purple-400">import</span> numpy <span class="text-purple-400">as</span> np<br/><br/>
<span class="text-slate-500"># נתונים מטבלת התדרים שלנו</span><br/>
spam_with_free = <span class="text-blue-400">42</span><br/>
ham_with_free = <span class="text-blue-400">3</span><br/>
total_spam = <span class="text-blue-400">1200</span><br/>
total_ham = <span class="text-blue-400">800</span><br/><br/>
<span class="text-slate-500"># חישוב הסתברות בסיסית (Prior)</span><br/>
p_spam = total_spam / (total_spam + total_ham)<br/><br/>
<span class="text-slate-500"># חישוב הסתברות מותנית (Likelihood)</span><br/>
<span class="text-slate-500"># P(Free | Spam)</span><br/>
p_free_given_spam = spam_with_free / total_spam<br/>
<span class="text-slate-500"># P(Free | Ham)</span><br/>
p_free_given_ham = ham_with_free / total_ham<br/><br/>
<span class="text-yellow-300">print</span>(f<span class="text-green-400">'Basic probability of spam: {p_spam:.2f}'</span>)<br/>
<span class="text-yellow-300">print</span>(f<span class="text-green-400">'Prob. to see free in SPAM: {p_free_given_spam:.3f}'</span>)<br/>
<span class="text-yellow-300">print</span>(f<span class="text-green-400">'Prob. to see free in HAM:  {p_free_given_ham:.3f}'</span>)`}
                output={`Basic probability of spam: 0.60\nProb. to see free in SPAM: 0.035\nProb. to see free in HAM:  0.004`}
                explanation="שים לב לפער: הסיכוי לראות 'Free' בספאם הוא 3.5%, בעוד שבהודעה רגילה הוא אפסי (0.4%). הפער העצום הזה (פי 9!) הוא מה שגורם למודל לסמן את ההודעה כחשודה."
            />
          </section>


          {/* Quiz */}
          <section id="quiz" className="mt-16 pt-8 border-t border-slate-800">
             <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">בדיקת הבנה: סיכום פרק 4</h2>
                <p className="text-slate-400 text-sm">האם תפסת את כוחו של ההקשר?</p>
             </div>
             <ChapterQuiz />
          </section>

        </ChapterLayout>
    
  );
}


// --- קומפוננטת המבחן ---

function ChapterQuiz() {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    
    const questions = [
        {
            id: 1,
            text: "מהו ההבדל העיקרי בין הסתברות רגילה להסתברות מותנית?",
            options: [
                { id: 1, text: "הסתברות מותנית משתמשת במספרים גדולים יותר" },
                { id: 2, text: "הסתברות מותנית מתייחסת למידע נוסף (הקשר/Context) שכבר ידוע לנו", correct: true },
                { id: 3, text: "אין הבדל, זה רק שם אחר" }
            ]
        },
        {
            id: 2,
            text: "מהו עקרון בייס במשפט אחד פשוט?",
            options: [
                { id: 1, text: "נוסחה לחישוב ממוצעים" },
                { id: 2, text: "כשמגיע מידע חדש, צריך לעדכן את האמונה שלנו לגבי הסבירות של אירוע", correct: true },
                { id: 3, text: "דרך למחוק נתוני ספאם מהמערכת" }
            ]
        },
        {
            id: 3,
            text: "איך מודל מחליט אם הודעה היא ספאם?",
            options: [
                { id: 1, text: "הוא בודק אם המילה Free מופיעה, וזה מספיק" },
                { id: 2, text: "הוא משווה את הסבירות של המילים תחת 'ספאם' מול הסבירות שלהן תחת 'הודעה רגילה'", correct: true },
                { id: 3, text: "הוא מנחש באופן אקראי" }
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
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="sticky bottom-8 z-50 flex justify-center pt-6"
                    >
                        <Link href="/chapter-5">
                            <Button size="lg" className="h-14 px-10 text-base bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full shadow-[0_0_40px_rgba(168,85,247,0.5)] border-t border-purple-400/30 hover:scale-105 transition-transform">
                                <span className="font-bold">המשך לפרק 5: וקטורים</span> <ChevronLeft className="mr-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}