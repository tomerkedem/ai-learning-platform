"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Compass, RotateCw, Search, Check, X, Layers, Code, Play, RefreshCcw, Sigma } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { ChapterLayout } from '@/components/ChapterLayout';

// --- רכיבים ויזואליים פנימיים ---

// 1. רכיב קוד אינטראקטיבי (טרמינל מריץ קוד)
const InteractiveCodeBlock = ({ filename, code, output, explanation }: { filename: string, code: string, output: string, explanation: string }) => {
    const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');

    const run = () => {
        setStatus('running');
        setTimeout(() => setStatus('done'), 1200);
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
                    {status === 'running' ? <RefreshCcw size={12} className="animate-spin"/> : status === 'done' ? <RotateCw size={12}/> : <Play size={12} fill="currentColor"/>}
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

// 3. מעבדת הקוסינוס: סיבוב וקטורים
const CosineLab = () => {
  const [angle1, setAngle1] = useState(45); 
  const [angle2, setAngle2] = useState(60); 

  const rad1 = (angle1 * Math.PI) / 180;
  const rad2 = (angle2 * Math.PI) / 180;

  const similarity = Math.cos(rad1 - rad2).toFixed(3);

  const simVal = parseFloat(similarity);
  const colorClass = simVal > 0.9 ? 'text-green-400' : simVal > 0.5 ? 'text-blue-400' : simVal > 0 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col gap-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors duration-500"></div>
      
      <div className="flex flex-col md:flex-row gap-12 items-center justify-between z-10 relative">
          
          {/* המעגל והוקטורים */}
          <div className="w-64 h-64 relative flex items-center justify-center">
              {/* מעגל רקע */}
              <div className="absolute inset-0 border-2 border-slate-800 rounded-full border-dashed"></div>
              
              {/* צירים */}
              <div className="absolute w-full h-px bg-slate-800"></div>
              <div className="absolute h-full w-px bg-slate-800"></div>

              {/* וקטור 1 (קבוע/נשלט) */}
              <motion.div 
                className="absolute w-1/2 h-1 bg-blue-500 origin-left left-1/2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                style={{ rotate: `${-angle1}deg` }}
              >
                  <span className="absolute right-0 -top-6 text-blue-400 text-xs font-bold bg-slate-900 px-1 rounded">V1</span>
              </motion.div>

              {/* וקטור 2 (נשלט) */}
              <motion.div 
                className="absolute w-1/2 h-1 bg-purple-500 origin-left left-1/2 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.6)]"
                style={{ rotate: `${-angle2}deg` }}
              >
                  <span className="absolute right-0 -top-6 text-purple-400 text-xs font-bold bg-slate-900 px-1 rounded">V2</span>
              </motion.div>

              {/* המרכז */}
              <div className="absolute w-4 h-4 bg-white rounded-full border-4 border-slate-900 z-10"></div>
          </div>

          {/* בקרה והסבר */}
          <div className="flex-1 space-y-6">
              <h3 className="text-white font-bold flex items-center gap-2 text-lg">
                  <Compass size={20} className="text-purple-400"/> מעבדת הזוויות
              </h3>
              
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Cosine Similarity</div>
                      <div className={`text-4xl font-mono font-bold ${colorClass}`}>
                          {similarity}
                      </div>
                  </div>
                  <div className="text-right text-xs text-slate-400 max-w-35 leading-relaxed">
                      {simVal > 0.9 ? "כמעט זהים! (אותו כיוון)" : 
                       simVal > 0.5 ? "דומים למדי." : 
                       simVal > 0 ? "קשר חלש." : "כיוונים שונים/מנוגדים."}
                  </div>
              </div>

              <div className="space-y-4">
                  <div>
                      <div className="flex justify-between text-xs text-blue-400 mb-2 font-bold">
                          <span>V1 Angle</span>
                          <span>{angle1}°</span>
                      </div>
                      <input 
                        type="range" min="0" max="180" step="1" value={angle1}
                        onChange={(e) => setAngle1(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                  </div>
                  <div>
                      <div className="flex justify-between text-xs text-purple-400 mb-2 font-bold">
                          <span>V2 Angle</span>
                          <span>{angle2}°</span>
                      </div>
                      <input 
                        type="range" min="0" max="180" step="1" value={angle2}
                        onChange={(e) => setAngle2(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                  </div>
              </div>
          </div>
      </div>
    </div>
  )
}

// 4. חיפוש סמנטי (Semantic Search Demo)
const SemanticSearchLab = () => {
    const [query, setQuery] = useState("חתול");
    
    const sortedResults = useMemo(() => {
        const database = [
            { text: "גור", type: "cat", score: 0.92 },
            { text: "חיה", type: "cat", score: 0.85 },
            { text: "כלב", type: "dog", score: 0.76 },
            { text: "שולחן", type: "obj", score: 0.12 },
            { text: "ענן", type: "obj", score: -0.05 },
        ];

        let results;
        
        if (query.includes("חתול")) {
            results = database;
        } else {
            const resultsMap = database.map((d, i) => {
                const seed = (query.length * (i + 1) * 17) % 100; 
                return { ...d, score: seed / 100 };
            });
            if (query.length > 5) {
                resultsMap[0].score = Math.min(0.9, resultsMap[0].score + 0.3);
            }
            results = resultsMap;
        }

        return [...results].sort((a, b) => b.score - a.score);
    }, [query]);

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 mt-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 space-y-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Search size={18} className="text-emerald-400"/> מנוע חיפוש סמנטי
                    </h3>
                    <p className="text-sm text-slate-400">
                        הקלד מילה, והמודל ימצא מילים עם <strong>כיוון וקטורי דומה</strong> (לאו דווקא אותיות דומות).
                    </p>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                    </div>
                    <div className="text-xs text-slate-500 bg-slate-950/50 p-3 rounded border border-slate-800">
                        נסה לכתוב &quot;חתול&quot;. שים לב ש&quot;גור&quot; מקבל ציון גבוה למרות שאין להם אותיות משותפות. זה הכוח של וקטורים.
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-xs text-slate-500 px-2 uppercase font-bold tracking-wider">
                        <span>תוצאה</span>
                        <span>דמיון (Cosine)</span>
                    </div>
                    {sortedResults.map((item, i) => (
                        <motion.div 
                            key={item.text}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between bg-slate-950 border border-slate-800 p-3 rounded-lg hover:border-slate-600 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${item.score > 0.8 ? 'bg-emerald-500' : item.score > 0.5 ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
                                <span className="text-slate-200 font-bold">{item.text}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                                    <div 
                                        className={`h-full ${item.score > 0.8 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                                        style={{ width: `${Math.max(0, item.score * 100)}%` }}
                                    ></div>
                                </div>
                                <span className="font-mono text-sm text-slate-400 w-12 text-left">{item.score.toFixed(2)}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// 5. כרטיס סיכום

// 6. רכיב Quiz
function ChapterSevenQuiz() {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    
    const questions = [
        {
            id: 1,
            text: "מה מודד Cosine Similarity?",
            options: [
                { id: 1, text: "את המרחק הפיזי בין הנקודות" },
                { id: 2, text: "את הזווית (הכיוון) בין הוקטורים", correct: true },
                { id: 3, text: "את אורך הוקטורים" }
            ]
        },
        {
            id: 2,
            text: "למה משתמשים בזה בטקסט (NLP)?",
            options: [
                { id: 1, text: "כי משפטים עם משמעות דומה מצביעים לאותו כיוון במרחב", correct: true },
                { id: 2, text: "כי זה מחשב את מספר המילים במשפט" },
                { id: 3, text: "כי זה מאפשר לתקן שגיאות כתיב" }
            ]
        },
        {
            id: 3,
            text: "אם הציון הוא 1.0, מה זה אומר?",
            options: [
                { id: 1, text: "שהוקטורים מצביעים לכיוונים הפוכים" },
                { id: 2, text: "שהוקטורים מצביעים בדיוק לאותו כיוון (זהות מושלמת)", correct: true },
                { id: 3, text: "שאין שום קשר ביניהם" }
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
                        <Link href="/chapter-8">
                            <Button size="lg" className="h-14 px-10 text-base bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full shadow-[0_0_40px_rgba(168,85,247,0.5)] border-t border-purple-400/30 hover:scale-105 transition-transform">
                                <span className="font-bold">המשך לפרק 8: פונקציות</span> <ChevronLeft className="mr-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- העמוד הראשי ---

export default function ChapterSeven() {
  return (
  
          
            <ChapterLayout courseId="mathIntuitive" currentChapterId={7}>
          
          {/* סעיף 1: דמיון ככיוון ולא כמרחק */}
          <section id="part-1" className="scroll-mt-24 mb-8">
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><RotateCw size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">1. דמיון ככיוון ולא כמרחק</h2>
                </div>
                
                <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none space-y-6">
                    <p>
                        בפרק הקודם ראינו שמרחק בין וקטורים הוא כלי שימושי, אבל יש לו מגבלות ברורות. בעיקר בעולם של טקסט, שבו המשמעות לא תמיד יושבת על &quot;עד כמה שני משפטים רחוקים אחד מהשני&quot;, אלא על השאלה לאיזה כיוון הם מצביעים.
                    </p>
                    <p>
                        כאן נכנס הרעיון החשוב הזה: <strong>דמיון אמיתי בין שני וקטורים נקבע לפי הכיוון שלהם, לא רק לפי המרחק הגיאומטרי ביניהם.</strong>
                    </p>

                    <h3 className="text-xl font-bold text-white">למה הכיוון חשוב יותר מהמרחק?</h3>
                    <div className="bg-slate-900 border-l-4 border-purple-500 p-6 rounded-r-xl">
                        <p className="text-base text-slate-300 mb-3">תחשוב על שני משפטים שונים מבחינת המילים, אבל דומים מאוד ברעיון:</p>
                        <ul className="list-none space-y-1 text-base">
                            <li className="text-blue-300">&quot;אני מאחר לעבודה&quot;</li>
                            <li className="text-blue-300">&quot;אני מתקשה להגיע בזמן&quot;</li>
                        </ul>
                        <p className="text-sm text-slate-400 mt-3">
                            הכיוון שלהם זורם באותו רעיון. גם אם הוקטורים רחוקים יחסית, זווית קטנה ביניהם מספרת שהם &quot;פונים&quot; לאותו כיוון.
                        </p>
                    </div>

                    <p>
                        זו הסיבה שמודלים מודרניים מסתמכים הרבה יותר על זווית ופחות על מרחק. הנה ויזואליזציה הממחישה את החשיבות של הזווית:
                    </p>
                </div>
            </div>

            <CosineLab />
            
            <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none space-y-6 mt-8">
                <p>
                    <strong>מה בעצם מודדים בזווית?</strong> הזווית מספרת למודל האם שני אובייקטים &quot;נעים סביב אותו רעיון&quot;.
                    כאן נכנס לתמונה דמיון קוסינוס: זה המדד שמודד עד כמה שני וקטורים מצביעים לאותו כיוון.
                </p>
            </div>

          </section>


          {/* סעיף 2: איך מודדים דמיון בין שני משפטים */}
          <section id="part-2" className="scroll-mt-24 mb-8">
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Code size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">2. איך מודדים דמיון קוסינוס (Cosine Similarity)?</h2>
                </div>
                
                <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none space-y-6">
                    <p>
                        המודלים המודרניים לא בודקים אם שתי מילים זהות. הם משווים בין שני וקטורים שמייצגים את המשמעות.
                        וכדי להשוות בין שני וקטורים, משתמשים במדד שנקרא <strong>דמיון קוסינוס</strong>.
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cosine Function Code */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 font-mono text-sm relative shadow-lg" dir="ltr">
                    <div className="absolute top-0 right-0 p-2 text-xs text-slate-600">numpy_cosine_function.py</div>
                    <code className="block leading-relaxed">
                        <span className="text-purple-400">import</span> numpy <span className="text-purple-400">as</span> np<br/><br/>
                        <span className="text-blue-400">def</span> <span className="text-yellow-300">cosine_similarity</span>(a, b):<br/>
                        &nbsp;&nbsp;<span className="text-slate-500"># 1. Dot product: How similar their directions are</span><br/>
                        &nbsp;&nbsp;dot = np.<span className="text-yellow-300">dot</span>(a, b)<br/>
                        &nbsp;&nbsp;<span className="text-slate-500"># 2. Norm: Length of each vector</span><br/>
                        &nbsp;&nbsp;norm_a = np.linalg.<span className="text-yellow-300">norm</span>(a)<br/>
                        &nbsp;&nbsp;norm_b = np.linalg.<span className="text-yellow-300">norm</span>(b)<br/>
                        &nbsp;&nbsp;<span className="text-slate-500"># 3. Final score: Divides dot product by lengths</span><br/>
                        &nbsp;&nbsp;<span className="text-purple-400">return</span> dot / (norm_a * norm_b)
                    </code>
                </div>

                {/* Explanation Cards */}
                <div className="flex flex-col justify-center space-y-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <h4 className="font-bold text-white mb-1 flex items-center gap-2"><Sigma size={16}/> מה עושה np.dot(a, b)?</h4>
                        <p className="text-sm text-slate-400">
                            מחשבת את המכפלה הסקלרית. ככל ששני וקטורים מצביעים בכיוון דומה יותר, הערך של dot גדול יותר.
                        </p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <h4 className="font-bold text-white mb-1 flex items-center gap-2"><Layers size={16}/> מה עושה np.linalg.norm(a)?</h4>
                        <p className="text-sm text-slate-400">
                            מחשבת את האורך של הוקטור (Length). וקטורים גדולים יקבלו נורמה גדולה יותר.
                        </p>
                    </div>
                </div>
            </div>

            {/* Practical Example */}
            <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none space-y-4 mt-8">
                <h4 className="text-white font-bold text-xl">דוגמה מעשית: חישוב Cosine Similarity</h4>
                <p>
                    וקטורים שמצביעים לאותו כיוון יקבלו ערך קרוב ל-1, ווקטורים בכיוונים שונים יקבלו ערך נמוך.
                </p>
            </div>
            
            <InteractiveCodeBlock 
                filename="run_cosine.py"
                code={`<span class="text-purple-400">import</span> numpy <span class="text-purple-400">as</span> np

<span class="text-blue-400">def</span> <span class="text-yellow-300">cosine_similarity</span>(a, b):
    dot = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    <span class="text-purple-400">return</span> dot / (norm_a * norm_b)

v1 = np.array([0.2, 0.8, 0.4]) <span class="text-slate-500"># וקטור 1 (Similar)</span>
v2 = np.array([0.25, 0.75, 0.35]) <span class="text-slate-500"># וקטור 2 (Similar Direction)</span>

<span class="text-blue-400">print</span>(f"Similarity: {cosine_similarity(v1, v2):.4f}")`}
                output={`Similarity: 0.9996`}
                explanation="תוצאה גבוהה (כמעט 1) מראה שהמשמעויות זהות. המדד מתעלם מהאורך המשתנה של הווקטורים ומתמקד בזווית הקטנה שביניהם."
            />

            <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none space-y-4 mt-8">
                <h4 className="text-white font-bold text-xl">למה דמיון קוסינוס עובד כל כך טוב?</h4>
                <ul className="list-disc list-inside space-y-2 marker:text-emerald-500">
                    <li>הוא מתעלם מהמרחק האבסולוטי (לא מעניינת אותנו כמות המידע).</li>
                    <li>הוא מתמקד בכיוון המשמעותי (&quot;קו המחשבה&quot; המשותף).</li>
                    <li>הוא עמיד לשינויים קטנים בדאטה (שינוי ניסוח קל לא מרסק את הדמיון).</li>
                </ul>
            </div>
          </section>


          {/* סעיף 3: חיבור ישיר לעולם ה-Embeddings */}
          <section id="part-3" className="scroll-mt-24">
             <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Layers size={20} /></div>
                    <h2 className="text-2xl font-bold text-white">3. חיבור ישיר לעולם ה-Embeddings</h2>
                </div>
                <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none space-y-6">
                    <p>
                        בשלב הזה כל מה שלמדנו על וקטורים, זוויות ודמיון מתחיל להתחבר לתמונה גדולה יותר. מאחורי כל מודל מודרני יושב מנגנון אחד שמאפשר לו לעבוד עם טקסטים, תמונות ואפילו משתמשים: <strong>Embedding</strong>.
                    </p>
                    <p>
                        Embedding הוא לא הוקטור עצמו, אלא המנגנון שמייצר את הוקטורים. זה השער שדרכו תוכן עשיר ומורכב נכנס אל המודל ויוצא בצד השני כייצוג מספרי מסודר.
                    </p>
                    <p>
                        <strong>איך Embeddings ממקמים משמעות במרחב?</strong>
                        בזמן האימון המודל לומד איזה מילים ומשפטים מופיעים יחד, אילו מקבלים משמעות דומה ואילו רחוקים לגמרי, ובכך הוא בונה מרחב משמעות. במרחב זה, משפטים דומים מצביעים לכיוון דומה.
                    </p>
                </div>
            </div>

            <SemanticSearchLab />

            <div className="prose prose-invert text-slate-300 text-lg leading-relaxed max-w-none mt-8">
                <p>
                    <strong>דוגמה אחת שמאגדת את הכל:</strong> נניח שיש לנו Embedding של המשפט “החתול קפץ על השולחן”. המודל יחפש כיוון דומה במרחב הוקטורים, ולכן ימצא משפט כמו: “הגור טיפס על הספה” כי הוא מצביע לאותו רעיון, גם אם אין מילים משותפות.
                </p>
                <p>
                    <strong>למה Embeddings הם שכבת היסוד של מודלים מודרניים?</strong> כי הם מאפשרים לייצג כמעט כל דבר בעולם (מילים, משפטים, משתמשים, תמונות) בצורה שהמודל יודע לחשב עליה. לכן Embeddings נמצאים בלב של מערכות חיפוש, מערכות המלצה ומודלי שפה.
                </p>
            </div>
          </section>


          {/* Quiz */}
          <section id="quiz" className="mt-16 pt-8 border-t border-slate-800">
             <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">בדיקת הבנה: סיכום פרק 7</h2>
                <p className="text-slate-400 text-sm">האם הבנת את עקרון הזווית?</p>
             </div>
             <ChapterSevenQuiz />
          </section>

        </ChapterLayout>
    
  );
}