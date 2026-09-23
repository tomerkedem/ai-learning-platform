"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Play, Code2, Brain, RefreshCcw, CheckCircle2 } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { ChapterLayout } from '@/components/ChapterLayout';

// --- רכיבי עזר ---

interface ExerciseBlockProps {
    id: string;
    title: string;
    description: string;
    code: string;
    output: string;
    challenge: string;
}

const ExerciseBlock = ({ id, title, description, code, output, challenge }: ExerciseBlockProps) => {
    const [isRunning, setIsRunning] = useState(false);
    const [showOutput, setShowOutput] = useState(false);

    const runCode = () => {
        setIsRunning(true);
        setShowOutput(false);
        setTimeout(() => {
            setIsRunning(false);
            setShowOutput(true);
        }, 800);
    };

    return (
        <section id={id} className="scroll-mt-32 mb-16 border-b border-slate-800 pb-16 last:border-0">
            <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 shrink-0 mt-1 border border-blue-500/20">
                    <Code2 size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-slate-400 leading-relaxed text-base max-w-2xl">{description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Code Window */}
                <div className="bg-[#0d1117] rounded-xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
                    <div className="flex justify-between items-center px-4 py-3 bg-[#161b22] border-b border-slate-800">
                        <span className="text-xs text-slate-500 font-mono">main.py</span>
                        <Button 
                            onClick={runCode} 
                            disabled={isRunning}
                            size="sm"
                            className="h-7 text-xs bg-green-600 hover:bg-green-500 text-white gap-2"
                        >
                            {isRunning ? <RefreshCcw size={12} className="animate-spin"/> : <Play size={12}/>}
                            הרץ קוד
                        </Button>
                    </div>
                    <div className="p-5 font-mono text-sm overflow-x-auto custom-scrollbar" dir="ltr">
                        <pre className="text-slate-300 leading-relaxed">
                            <code dangerouslySetInnerHTML={{ __html: code }}></code>
                        </pre>
                    </div>
                </div>

                {/* Output & Challenge Window */}
                <div className="flex flex-col gap-6">
                    {/* Output */}
                    <div className="bg-black/40 rounded-xl border border-slate-800 p-5 flex-1 relative min-h-40">
                        <div className="absolute top-3 right-3 text-[10px] text-slate-600 uppercase tracking-widest font-bold">Terminal Output</div>
                        
                        <AnimatePresence mode="wait">
                            {isRunning ? (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center h-full text-slate-500 gap-2"
                                >
                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs">מריץ חישובים...</span>
                                </motion.div>
                            ) : showOutput ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="font-mono text-sm text-green-400 whitespace-pre-wrap pt-4"
                                    dir="ltr"
                                >
                                    {output}
                                </motion.div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-600 text-sm">
                                    לחץ על &quot;הרץ קוד&quot; כדי לראות תוצאה
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Challenge */}
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5">
                        <h4 className="text-purple-300 font-bold text-sm mb-2 flex items-center gap-2">
                            <Brain size={16}/> אתגר מחשבתי
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {challenge}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- העמוד הראשי ---

export default function ChapterEleven() {
  return (
 
          
            <ChapterLayout courseId="mathIntuitive" currentChapterId={11}>
          
          {/* תפריט ניווט מהיר לתרגילים */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
              <a href="#ex-1" className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full text-xs text-slate-400 hover:text-white transition-colors">1. סטטיסטיקה</a>
              <a href="#ex-2" className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full text-xs text-slate-400 hover:text-white transition-colors">2. מותנית</a>
              <a href="#ex-3" className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full text-xs text-slate-400 hover:text-white transition-colors">3. בייס</a>
              <a href="#ex-4" className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full text-xs text-slate-400 hover:text-white transition-colors">4. נורמה</a>
              <a href="#ex-5" className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full text-xs text-slate-400 hover:text-white transition-colors">5. קוסינוס</a>
              <a href="#ex-6" className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full text-xs text-slate-400 hover:text-white transition-colors">6. Gradient</a>
          </div>

          <div className="space-y-24">
            {/* תרגיל 1: סטטיסטיקה */}
            <ExerciseBlock 
                id="ex-1"
                title="1. ממוצע וסטיית תקן"
                description="נראה איך מספר אחד מספר לנו איפה המרכז, ומספר שני מספר לנו כמה רעש יש."
                code={`<span class="text-purple-400">import</span> numpy <span class="text-purple-400">as</span> np

<span class="text-slate-500"># הנתונים שלנו</span>
data = np.array([10, 12, 13, 9, 8, 15, 14])

<span class="text-slate-500"># חישוב המרכז והפיזור</span>
mean = np.<span class="text-yellow-300">mean</span>(data)
std = np.<span class="text-yellow-300">std</span>(data)

<span class="text-blue-400">print</span>(f"Mean: {mean:.2f}")
<span class="text-blue-400">print</span>(f"Standard deviation: {std:.2f}")`}
                output={`Mean: 11.57\nStandard deviation: 2.49`}
                challenge="נסה לדמיין מה יקרה אם נוסיף לרשימה את המספר 50. הממוצע יקפוץ, אבל סטיית התקן תשתולל ותצביע על 'רעש' חזק."
            />

            {/* תרגיל 2: הסתברות מותנית */}
            <ExerciseBlock 
                id="ex-2"
                title="2. הסתברות מותנית (ההקשר)"
                description="לא שואלים 'כמה זה קורה', אלא 'כמה זה קורה בתוך קבוצה מסוימת'."
                code={`<span class="text-purple-400">import</span> numpy <span class="text-purple-400">as</span> np

<span class="text-slate-500"># [spam_count, ham_count]</span>
with_free = np.array([42, 3])
total_spam = 1200 

<span class="text-slate-500"># P(Free | Spam)</span>
p_free_given_spam = with_free[0] / total_spam

<span class="text-blue-400">print</span>(f"Probability to see 'free' inside spam: {p_free_given_spam:.3f}")`}
                output={`Probability to see 'free' inside spam: 0.035`}
                challenge="זה נראה נמוך (3.5%), אבל אם תשווה את זה להסתברות בתוך הודעות רגילות (שהיא כמעט אפס), תבין למה המודל חושד."
            />

            {/* תרגיל 3: בייס */}
            <ExerciseBlock 
                id="ex-3"
                title="3. חוק בייס (השילוב)"
                description="מחברים את הידע הכללי (Prior) עם הראיות החדשות (Likelihood) כדי לקבל החלטה."
                code={`<span class="text-slate-500"># נתונים</span>
p_spam = 0.6          <span class="text-slate-500"># רוב המיילים הם ספאם</span>
p_free_given_spam = 0.035
p_free = 0.022        <span class="text-slate-500"># תדירות המילה 'free' בכללי</span>

<span class="text-slate-500"># Bayes Formula: P(Spam | Free)</span>
p_spam_given_free = (p_free_given_spam * p_spam) / p_free

<span class="text-blue-400">print</span>(f"Chance of Spam if 'free' appears: {p_spam_given_free:.3f}")`}
                output={`Chance of Spam if 'free' appears: 0.955`}
                challenge="שים לב! למרות שהמילה 'free' נדירה (רק 2.2% מהמיילים), אם היא מופיעה - יש 95.5% סיכוי שזה ספאם."
            />

            {/* תרגיל 4: נורמה */}
            <ExerciseBlock 
                id="ex-4"
                title="4. נורמה (עוצמת הוקטור)"
                description="מספר אחד שמסכם את ה'גודל' או ה'קיצוניות' של הנתונים."
                code={`<span class="text-purple-400">import</span> numpy <span class="text-purple-400">as</span> np

<span class="text-slate-500"># וקטור רגיל</span>
v1 = np.array([3, 4])
norm_v1 = np.linalg.<span class="text-yellow-300">norm</span>(v1)

<span class="text-slate-500"># וקטור קיצוני</span>
v2 = np.array([1, 2, 50])
norm_v2 = np.linalg.<span class="text-yellow-300">norm</span>(v2)

<span class="text-blue-400">print</span>(f"Norm v1: {norm_v1}")
<span class="text-blue-400">print</span>(f"Norm v2: {norm_v2:.2f}")`}
                output={`Norm v1: 5.0\nNorm v2: 50.05`}
                challenge="המספר 50 בוקטור השני 'השתלט' על הנורמה לגמרי. זה מראה כמה הנורמה רגישה לערכים קיצוניים (Outliers)."
            />

            {/* תרגיל 5: דמיון קוסינוס */}
            <ExerciseBlock 
                id="ex-5"
                title="5. דמיון קוסינוס (הכיוון)"
                description="בודקים אם שני וקטורים מצביעים לאותו כיוון, בלי קשר לאורך שלהם."
                code={`<span class="text-purple-400">import</span> numpy <span class="text-purple-400">as</span> np

v1 = np.array([1, 2, 3])      <span class="text-slate-500"># וקטור קטן</span>
v2 = np.array([10, 20, 30])   <span class="text-slate-500"># וקטור ענק (אותו יחס)</span>

dot = np.dot(v1, v2)
norms = np.linalg.norm(v1) * np.linalg.norm(v2)

similarity = dot / norms
<span class="text-blue-400">print</span>(f"Similarity: {similarity:.4f}")`}
                output={`Similarity: 1.0000`}
                challenge="התוצאה היא 1 מושלם! למרות שהמספרים שונים לגמרי (10 מול 1), הכיוון זהה לחלוטין. זה הכוח של קוסינוס."
            />

            {/* תרגיל 6: Gradient Descent */}
            <ExerciseBlock 
                id="ex-6"
                title="6. צעד של למידה (Gradient Descent)"
                description="איך המודל משפר את עצמו בצעד אחד קטן נגד השיפוע."
                code={`<span class="text-slate-500"># הפונקציה: (x-3)^2</span>
x = -1              <span class="text-slate-500"># התחלה רחוקה (המטרה היא 3)</span>
lr = 0.1            <span class="text-slate-500"># קצב למידה</span>

<span class="text-slate-500"># 1. חישוב השיפוע (הנגזרת)</span>
slope = 2 * (x - 3)

<span class="text-slate-500"># 2. עדכון (זזים נגד השיפוע)</span>
x_new = x - (lr * slope)

<span class="text-blue-400">print</span>(f"Old x: {x}")
<span class="text-blue-400">print</span>(f"New x: {x_new}")`}
                output={`Old x: -1\nNew x: -0.2`}
                challenge="המודל זז מ-1- ל-0.2-. הוא התקרב ל-3! אם נריץ את זה בלולאה, הוא יגיע בול ל-3."
            />
          </div>

          {/* סיום חגיגי */}
          <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-10 text-center mt-24 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              <div className="relative z-10">
                  <CheckCircle2 size={48} className="text-white mx-auto mb-4" />
                  <h2 className="text-3xl font-black text-white mb-4">סיימת את החלק המעשי!</h2>
                  <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
                      עכשיו יש לך את האינטואיציה ואת הקוד. בפרק הבא והאחרון, נראה איך כל הדברים האלו מתחברים לטכנולוגיה ששינתה את העולם: NLP ומודלי שפה.
                  </p>
                  <Link href="chapter-12">
                    <Button size="lg" className="h-14 px-10 bg-white text-blue-600 hover:bg-blue-50 border-0 font-bold shadow-xl hover:scale-105 transition-transform">
                        המשך לפרק האחרון: NLP <ChevronLeft className="mr-2 h-5 w-5" />
                    </Button>
                  </Link>
              </div>
          </div>

       
        </ChapterLayout>
  
  );
}