"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Brain, Network, Cpu, MessageSquare, ArrowLeft, BookOpen, Layers, Zap, Search, Target, TrendingUp, RefreshCcw } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { ChapterLayout } from '@/components/ChapterLayout';

// --- רכיבים ויזואליים פנימיים ---

// 1. המתרגם הויזואלי: מתמטיקה -> שפת ה-AI
const VisualTranslator = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            
            {/* Concept 1: Vector/Embedding */}
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl flex flex-col gap-4 group hover:border-blue-500/30 transition-all">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Layers size={20} /></div>
                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase">המתמטיקה</div>
                            <div className="text-sm font-bold text-white">וקטור (Vector)</div>
                        </div>
                    </div>
                    <ArrowLeft className="text-slate-600" size={16} />
                    <div className="text-right">
                        <div className="text-xs text-slate-500 font-bold uppercase">ב-AI זה נקרא</div>
                        <div className="text-sm font-bold text-blue-300">Embedding</div>
                    </div>
                </div>
                
                {/* Visual */}
                <div className="bg-slate-950 rounded-lg p-4 flex items-center justify-center gap-2 h-24 border border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                    <span className="text-xs text-slate-400">Word</span>
                    <ArrowLeft size={14} className="text-slate-600 rotate-180" />
                    <div className="flex gap-1">
                        {[0.1, 0.9, -0.4, 0.2].map((n, i) => (
                            <motion.div 
                                key={i}
                                initial={{ height: 10 }}
                                animate={{ height: Math.abs(n) * 40 }}
                                className={`w-3 rounded-sm ${n > 0 ? 'bg-blue-500' : 'bg-red-500'}`}
                            />
                        ))}
                    </div>
                    <span className="text-xs font-mono text-blue-400 ml-2">[0.1, 0.9...]</span>
                </div>
                
                <p className="text-xs text-slate-400 leading-relaxed">
                    המודל לא קורא מילים. הוא ממיר כל מילה לרשימת מספרים (וקטור) שמייצגת את המשמעות שלה.
                </p>
            </div>

            {/* Concept 2: Cosine Similarity */}
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl flex flex-col gap-4 group hover:border-purple-500/30 transition-all">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Search size={20} /></div>
                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase">המתמטיקה</div>
                            <div className="text-sm font-bold text-white">זווית</div>
                        </div>
                    </div>
                    <ArrowLeft className="text-slate-600" size={16} />
                    <div className="text-right">
                        <div className="text-xs text-slate-500 font-bold uppercase">ב-AI זה נקרא</div>
                        <div className="text-sm font-bold text-purple-300">Semantic Similarity</div>
                    </div>
                </div>

                {/* Visual */}
                <div className="bg-slate-950 rounded-lg p-4 flex items-center justify-center h-24 border border-slate-800 relative">
                    <svg width="100" height="80" viewBox="0 0 100 80" className="overflow-visible">
                        <line x1="10" y1="70" x2="80" y2="70" stroke="#475569" strokeWidth="2" /> {/* Base */}
                        <line x1="10" y1="70" x2="70" y2="20" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" /> {/* Vector A */}
                        <line x1="10" y1="70" x2="80" y2="40" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" /> {/* Vector B */}
                        <path d="M 30 62 Q 35 55 30 52" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2 2" /> {/* Arc */}
                        <text x="35" y="55" fontSize="10" fill="white">θ</text>
                    </svg>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                    איך המודל יודע ש&quot;מלך&quot; ו&quot;מלכה&quot; קרובים? הוקטורים שלהם מצביעים כמעט לאותו כיוון (זווית קטנה).
                </p>
            </div>

            {/* Concept 3: Gradient */}
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl flex flex-col gap-4 group hover:border-emerald-500/30 transition-all">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><TrendingUp size={20} /></div>
                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase">המתמטיקה</div>
                            <div className="text-sm font-bold text-white">שיפוע (נגזרת)</div>
                        </div>
                    </div>
                    <ArrowLeft className="text-slate-600" size={16} />
                    <div className="text-right">
                        <div className="text-xs text-slate-500 font-bold uppercase">ב-AI זה נקרא</div>
                        <div className="text-sm font-bold text-emerald-300">Backpropagation</div>
                    </div>
                </div>

                {/* Visual */}
                <div className="bg-slate-950 rounded-lg p-4 flex items-center justify-center h-24 border border-slate-800 relative">
                    <svg width="100" height="60" viewBox="0 0 100 60" className="overflow-visible">
                        <path d="M 10 10 Q 50 80 90 20" fill="none" stroke="#475569" strokeWidth="2" />
                        <circle cx="30" cy="38" r="4" fill="white" />
                        <line x1="10" y1="20" x2="50" y2="55" stroke="#10b981" strokeWidth="2" /> {/* Slope Line */}
                        <text x="55" y="50" fontSize="10" fill="#10b981">Slope</text>
                    </svg>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                    כשהמודל טועה, הוא מחשב את השיפוע כדי להבין &quot;לאן לתקן&quot;. זה המנוע של הלמידה.
                </p>
            </div>

            {/* Concept 4: Minimum */}
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl flex flex-col gap-4 group hover:border-red-500/30 transition-all">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-400"><Target size={20} /></div>
                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase">המתמטיקה</div>
                            <div className="text-sm font-bold text-white">נקודת מינימום</div>
                        </div>
                    </div>
                    <ArrowLeft className="text-slate-600" size={16} />
                    <div className="text-right">
                        <div className="text-xs text-slate-500 font-bold uppercase">ב-AI זה נקרא</div>
                        <div className="text-sm font-bold text-red-300">Loss Optimization</div>
                    </div>
                </div>

                {/* Visual */}
                <div className="bg-slate-950 rounded-lg p-4 flex items-center justify-center h-24 border border-slate-800 relative">
                    <svg width="100" height="60" viewBox="0 0 100 60" className="overflow-visible">
                        <path d="M 10 10 Q 50 90 90 10" fill="none" stroke="#475569" strokeWidth="2" />
                        <circle cx="50" cy="50" r="4" fill="#ef4444" className="animate-pulse" />
                        <text x="58" y="52" fontSize="10" fill="#ef4444">Zero Error</text>
                    </svg>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                    המטרה של כל אימון היא פשוטה: להגיע לתחתית של עקומת הטעות, שם המודל הכי מדויק.
                </p>
            </div>

        </div>
    );
};

// 2. סימולטור LLM
const LLMDemo = () => {
    const [step, setStep] = useState(0);
    
    const steps = [
        { title: "1. הקלט (Input)", desc: "המשתמש כותב: 'איך מכינים פיצה?'", visual: "text" },
        { title: "2. הופך למספרים (Embedding)", desc: "המודל לא רואה טקסט. הוא ממיר את המילים לוקטורים: [0.12, 0.88, ...]", visual: "vector" },
        { title: "3. חיפוש הקשר (Cosine)", desc: "המודל מחפש במרחב הוקטורי שלו מושגים קרובים בזווית: 'בצק', 'גבינה', 'תנור'.", visual: "search" },
        { title: "4. יצירת תשובה (Output)", desc: "על בסיס ההסתברויות, הוא בוחר את המילה הבאה הכי סבירה.", visual: "output" }
    ];

    const nextStep = () => setStep((prev) => (prev + 1) % steps.length);

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 mt-8 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="text-emerald-400" /> המוח של ChatGPT
                </h3>
                <div className="text-xs text-slate-500 font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    Step {step + 1}/4
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Visual Side */}
                <div className="h-56 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden shadow-inner">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                            className="text-center w-full px-4"
                        >
                            {step === 0 && (
                                <div className="text-2xl font-bold text-white">🍕 איך מכינים פיצה?</div>
                            )}
                            {step === 1 && (
                                <div className="font-mono text-blue-400 text-sm break-all">
                                    [0.12, 0.88, -0.4, 0.2, 0.91, 0.05, -0.3, ...]
                                </div>
                            )}
                            {step === 2 && (
                                <div className="flex flex-col gap-2 items-center">
                                    <div className="text-xs text-slate-500 mb-2">נמצאו וקטורים קרובים:</div>
                                    <div className="flex gap-2">
                                        <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded text-sm border border-emerald-500/30">בצק (0.92)</span>
                                        <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded text-sm border border-emerald-500/30">רוטב (0.88)</span>
                                    </div>
                                </div>
                            )}
                            {step === 3 && (
                                <div className="text-left font-mono text-sm text-green-400 bg-black/50 p-4 rounded border-l-4 border-green-500 w-full">
                                    &gt; מערבבים קמח ומים...<span className="animate-pulse">|</span>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Text Side */}
                <div className="space-y-6">
                    <div>
                        <h4 className="text-lg font-bold text-blue-300 mb-2">{steps[step].title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed min-h-10">
                            {steps[step].desc}
                        </p>
                    </div>
                    
                    <Button onClick={nextStep} className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20">
                        {step === 3 ? <><RefreshCcw size={16} className="ml-2"/> התחל מחדש</> : <><ArrowLeft size={16} className="ml-2 rotate-180"/> השלב הבא</>}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// 3. כרטיסיות "מה הלאה"
const NextSteps = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-blue-500/30 transition-colors group">
                <Network className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h4 className="font-bold text-white mb-2">מרחבים ומימדים</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                    ראינו וקטורים קטנים. בספר הבא נראה איך עובדים במרחב של 4096 מימדים ואיך &quot;מקפלים&quot; אותם.
                </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-purple-500/30 transition-colors group">
                <Cpu className="text-purple-400 mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h4 className="font-bold text-white mb-2">מטריצות (Matrix)</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                    המנוע האמיתי. איך מכפילים מיליון מספרים בבת אחת כדי לייצר &quot;חשיבה&quot; בשכבות המודל.
                </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-orange-500/30 transition-colors group">
                <Zap className="text-orange-400 mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h4 className="font-bold text-white mb-2">אופטימיזציה מתקדמת</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                    מעבר ל-Gradient Descent פשוט. נלמד על Adam, Momentum ואיך מאמנים מודלי ענק.
                </p>
            </div>
        </div>
    );
};

// --- העמוד הראשי ---

export default function ChapterTwelve() {
  return (
   
          
            <ChapterLayout courseId="mathIntuitive" currentChapterId={12}>
          
          {/* סעיף 1: למה זה חוזר בכל מודל? */}
          <section id="part-1" className="scroll-mt-24 mt-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20"><Brain size={24} /></div>
                <h2 className="text-3xl font-bold text-white">1. המודל לא מבין עולם, הוא מבין מתמטיקה</h2>
            </div>
            
            <div className="prose prose-invert text-slate-400 text-lg leading-relaxed max-w-none space-y-6">
                <p>
                    עברת דרך ארוכה. וקטורים, נורמה, מרחק, בייס... לכאורה אלו נושאים נפרדים, אבל האמת הפשוטה היא שכולם חוזרים בכל מודל מודרני.
                </p>
                <p>
                    הסיבה ברורה: מודלים לא פועלים על מילים או תמונות. הם פועלים על <strong>ייצוגים מתמטיים</strong> שלהם.
                    ככל שהמודלים גדלים (כמו GPT-4), היסודות האלו לא נעלמים – הם הופכים להיות המנוע שמחזיק את הכל.
                </p>
            </div>
            
            <VisualTranslator />

            <div className="bg-blue-500/10 border-r-4 border-blue-500 p-6 mt-8 rounded-r-xl">
                <p className="text-blue-200 text-sm font-medium leading-relaxed">
                    כשמישהו יגיד לך בעתיד &quot;המודל תקוע במינימום מקומי&quot; או &quot;ה-Cosine Similarity נמוך&quot;, זה כבר לא יישמע כמו קסם שחור.
                    אתה תבין בדיוק מה קורה מתחת למכסה המנוע. אתה חלק מהשיחה.
                </p>
            </div>
          </section>


          {/* סעיף 2: הדגמת NLP */}
          <section id="part-2" className="scroll-mt-24 mt-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20"><MessageSquare size={24} /></div>
                <h2 className="text-3xl font-bold text-white">2. בזמן אמת: איך צ&#39;אטבוט עובד?</h2>
            </div>
            <div className="prose prose-invert text-slate-400 text-lg leading-relaxed max-w-none">
                <p>
                    בוא נראה את זה קורה בפועל. כשאתה שואל את ChatGPT שאלה, הוא לא &quot;קורא&quot; אותה כמו בן אדם.
                    הוא מפרק אותה לוקטורים, מחשב זוויות במרחב עצום, ומשתמש בהסתברות כדי לבחור את המילה הבאה.
                </p>
            </div>
            
            <LLMDemo />
          </section>


          {/* סעיף 3: מה הלאה? */}
          <section id="part-3" className="scroll-mt-24 mt-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20"><BookOpen size={24} /></div>
                <h2 className="text-3xl font-bold text-white">3. איפה פוגשים את זה בספר הבא?</h2>
            </div>
            <div className="prose prose-invert text-slate-400 text-lg leading-relaxed max-w-none">
                <p>
                    הספר הזה נתן לך את האינטואיציה. את השפה.
                    הספר הבא בסדרה (&quot;מתמטיקה יישומית למפתחי AI&quot;) ייקח את הכלים האלו צעד אחד קדימה ויבנה איתם מודלים מאפס.
                </p>
            </div>
            
            <NextSteps />
          </section>

          {/* סיום */}
          <div className="mt-24 pt-12 border-t border-slate-800 text-center">
              <div className="inline-block p-4 rounded-full bg-slate-900 border border-slate-800 mb-6 shadow-2xl">
                  <span className="text-4xl">🚀</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-4">סיימת את הלומדה בהצלחה!</h3>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
                  יש לך עכשיו יתרון עצום: בזמן שאחרים רואים מודל כ&quot;קופסה שחורה&quot;, 
                  אתה רואה אותו כאוסף של צעדים מתמטיים פשוטים והגיוניים.
              </p>
              
              {/* הכפתור המתוקן - לבן עם טקסט כחול */}
              <Link href="/intro">
                <Button className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-6 text-lg rounded-xl gap-2 font-bold shadow-xl transition-transform hover:scale-105">
                    <RefreshCcw size={18} /> חזור להתחלה
                </Button>
              </Link>
          </div>

      
            </ChapterLayout>
          
    
  );
}