"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

// ייבוא גלובלי של כל האייקונים
import { Scale, ArrowLeft, Target, Zap, HardHat, Layout, Divide, Ruler, Brain, CheckCircle, X, Check } from "lucide-react";

import Link from 'next/link';

import { FormulaDisplay } from "@/components/FormulaDisplay"; 
import { motion, AnimatePresence } from "framer-motion"; 

// ייבוא MathRenderer
import MathRenderer from "@/components/MathRenderer";
import { ChapterLayout } from '@/components/ChapterLayout';

// --- רכיבים ויזואליים אינטראקטיביים ---

interface VectorVisualProps {
    x: number;
    y: number;
    color: string;
    label: string;
    isNormalized: boolean;
}

const SCALE = 10;
const ORIGIN_X = 150;
const ORIGIN_Y = 96;

const VectorVisual: React.FC<VectorVisualProps> = ({ x, y, color, label, isNormalized }) => {
    
    const norm = Math.sqrt(x * x + y * y);
    const targetX = isNormalized ? (x / norm) * SCALE * 5 : x * SCALE;
    const targetY = isNormalized ? (y / norm) * SCALE * 5 : y * SCALE;

    const displayNorm = isNormalized ? 1 : norm;

    return (
        <div className="relative w-full h-48 border border-slate-700/50 rounded-lg bg-slate-950/30 overflow-hidden">
            <div className="absolute inset-0 bg-repeat bg-center opacity-10" style={{ backgroundImage: `linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)`, backgroundSize: `${SCALE * 2}px ${SCALE * 2}px` }}></div>
            
            <svg width="100%" height="100%" viewBox="0 0 300 192" className="absolute">
                
                {!isNormalized && (
                    <circle cx={ORIGIN_X} cy={ORIGIN_Y} r={SCALE * 5} fill="none" stroke="#64748b" strokeDasharray="2 2" strokeWidth="1" />
                )}

                <circle cx={ORIGIN_X} cy={ORIGIN_Y} r="2" fill="#64748b" />
                
                <motion.line 
                    x1={ORIGIN_X} 
                    y1={ORIGIN_Y} 
                    x2={ORIGIN_X + targetX} 
                    y2={ORIGIN_Y - targetY} 
                    stroke={color} 
                    strokeWidth="3" 
                    markerEnd={`url(#arrowhead-${color.replace('#', '')})`}
                    animate={{ x2: ORIGIN_X + targetX, y2: ORIGIN_Y - targetY }}
                    transition={{ type: "spring", stiffness: 100 }}
                />
                
                 <defs>
                    <marker id={`arrowhead-${color.replace('#', '')}`} markerWidth="5" markerHeight="5" refX="2" refY="2" orient="auto">
                        <path d="M0,0 L4,2 L0,4 z" fill={color} />
                    </marker>
                </defs>

                <text x={ORIGIN_X + targetX + 5} y={ORIGIN_Y - targetY - 5} fill={color} fontSize="12" className="font-bold">
                    {label}
                </text>
            </svg>
             <div className="absolute bottom-2 left-2 text-xs text-slate-400 font-mono" dir="ltr">
                ||{label}|| = {displayNorm.toFixed(2)}
            </div>
        </div>
    );
};

const NormLab = () => {
    // Ruler מגיע מהייבוא הגלובלי
    const [x, setX] = useState(3);
    const [y, setY] = useState(4);
    const [isNormalized, setIsNormalized] = useState(false);
    
    const norm = Math.sqrt(x * x + y * y);
    const normalizedX = norm > 0 ? x / norm : 0;
    const normalizedY = norm > 0 ? y / norm : 0;

    const currentX = isNormalized ? normalizedX * SCALE * 5 / SCALE : x;
    const currentY = isNormalized ? normalizedY * SCALE * 5 / SCALE : y;

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Ruler className="text-fuchsia-400" size={20} /> מעבדת הנורמה ועוצמת המידע
            </h3>
            
            <VectorVisual x={currentX} y={currentY} color="#F472B6" label="v" isNormalized={isNormalized} />

            <div className="mt-6 space-y-4">
                <div className="text-2xl font-black text-white text-center">
                    עוצמה (נורמה): <span className="text-fuchsia-400">{norm.toFixed(2)}</span>
                </div>

                <Button 
                    onClick={() => setIsNormalized(!isNormalized)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 transition-colors"
                >
                    {isNormalized ? "בטל נירמול (שמור על עוצמה)" : "בצע נירמול (הפוך לאורך 1)"}
                </Button>
                
                <div className="text-sm text-slate-400 p-3 bg-slate-950 rounded border border-slate-800">
                    <span className="font-bold text-white">אינטואיציה:</span> כשמנרמלים, המודל מוחק את ה&quot;עוצמה&quot; (האורך) ומשאיר רק את ה&quot;כיוון&quot; (המשמעות).
                </div>


                {/* Sliders */}
                <div className="space-y-2 pt-4">
                    <label className="text-sm font-medium text-slate-300 flex justify-between">
                        מימד X: <span>{x}</span>
                    </label>
                    <input
                        type="range"
                        min="-10"
                        max="10"
                        step="0.1"
                        value={x}
                        onChange={e => { setX(Number(e.target.value)); setIsNormalized(false); }}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex justify-between">
                        מימד Y: <span>{y}</span>
                    </label>
                    <input
                        type="range"
                        min="-10"
                        max="10"
                        step="0.1"
                        value={y}
                        onChange={e => { setY(Number(e.target.value)); setIsNormalized(false); }}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />
                </div>
            </div>
        </div>
    );
};

const DistanceProblemLab = () => {
    // Target מגיע מהייבוא הגלובלי
    const [x1] = useState(3); 
    const [y1] = useState(4);
    
    const [x2, setX2] = useState(7);
    const [y2, setY2] = useState(1);

    const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    const normV1 = Math.sqrt(x1 * x1 + y1 * y1);
    const normV2 = Math.sqrt(x2 * x2 + y2 * y2);

    const handleX2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setX2(Number(event.target.value));
    };

    const handleY2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setY2(Number(event.target.value));
    };

    const scale = 10;
    const origin = 150;
    const heightCenter = 96;

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="text-emerald-400" size={20} /> מעבדת מרחק: השוואת עוצמה מול פער
            </h3>
            
            <div className="relative w-full h-48 border border-slate-700/50 rounded-lg bg-slate-950/30">
                <svg width="100%" height="100%" viewBox="0 0 300 192">
                    <circle cx={origin} cy={heightCenter} r="2" fill="#64748b" />
                    
                    {/* V1 - ירוק */}
                    <line x1={origin} y1={heightCenter} x2={origin + x1 * scale} y2={heightCenter - y1 * scale} stroke="#34D399" strokeWidth="2" />
                    <circle cx={origin + x1 * scale} cy={heightCenter - y1 * scale} r="3" fill="#34D399" />
                    
                    {/* V2 - סגול */}
                    <line x1={origin} y1={heightCenter} x2={origin + x2 * scale} y2={heightCenter - y2 * scale} stroke="#8B5CF6" strokeWidth="2" />
                    <circle cx={origin + x2 * scale} cy={heightCenter - y2 * scale} r="3" fill="#8B5CF6" />
                    
                    {/* קו המרחק (כתום) */}
                    <line 
                        x1={origin + x1 * scale} 
                        y1={heightCenter - y1 * scale} 
                        x2={origin + x2 * scale} 
                        y2={heightCenter - y2 * scale} 
                        stroke="#F97316" 
                        strokeDasharray="4 2" 
                        strokeWidth="1.5"
                    />

                    <text x={20} y={20} fill="#34D399" fontSize="10" className="font-bold">v1: [{x1}, {y1}]</text>
                    <text x={20} y={35} fill="#8B5CF6" fontSize="10" className="font-bold">v2: [{x2}, {y2}]</text>

                </svg>
            </div>

            <div className="mt-6 space-y-4 text-center">
                <div className="text-sm font-bold text-white">נורמה v1: <span className="text-emerald-400">{normV1.toFixed(2)}</span> | נורמה v2: <span className="text-purple-400">{normV2.toFixed(2)}</span></div>
                <div className="text-2xl font-black text-white">
                    מרחק אוקלידי (L2): <span className="text-orange-400">{distance.toFixed(2)}</span>
                </div>

                {/* Sliders */}
                <div className="space-y-2 pt-4">
                    <label className="text-sm font-medium text-slate-300 flex justify-between">
                        מימד X של v2: <span>{x2}</span>
                    </label>
                    <input
                        type="range"
                        min="-10"
                        max="10"
                        step="0.1"
                        value={x2}
                        onChange={handleX2Change}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex justify-between">
                        מימד Y של v2: <span>{y2}</span>
                    </label>
                    <input
                        type="range"
                        min="-10"
                        max="10"
                        step="0.1"
                        value={y2}
                        onChange={handleY2Change}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </div>
        </div>
    );
};

const DistanceProblemDemo = () => {
    // Divide מגיע מהייבוא הגלובלי
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Divide className="text-orange-400" size={20} /> מרחק מול משמעות
            </h4>
            
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700/50">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
                    <span>משפט 1: &quot;אני מאחר לעבודה&quot;</span>
                    <span>משפט 2: &quot;אני מתקשה להגיע בזמן&quot;</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                    <span>תוצאת מרחק: <span className="text-red-400 font-bold">גדול</span></span> 
                    <span>תוצאת משמעות: <span className="text-green-400 font-bold">זהה</span> (בעיה!)</span>
                </p>
            </div>
            
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700/50">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
                    <span>משפט 1: &quot;אני אוהב קפה&quot;</span>
                    <span>משפט 2: &quot;אני אוהב לשרוף גשרים&quot;</span>
                </div>
                 <p className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                    <span>תוצאת מרחק: <span className="text-green-400 font-bold">קטן</span></span> 
                    <span>תוצאת משמעות: <span className="text-red-400 font-bold">שונה</span> (בעיה!)</span>
                </p>
            </div>

            <p className="text-sm text-slate-400 pt-2 border-t border-slate-800/50">
                המודל זקוק לכלי שמודד <span className="font-bold text-white">כיוון רעיוני</span> ולא רק את הפער הגיאומטרי.
            </p>
        </div>
    );
};

function NormDistanceQuiz() {
    const [answers, setAnswers] = useState<Record<number, number>>({});

    const questions = [
        {
            id: 1,
            text: "מה תפקידה האינטואיטיבי של הנורמה (Norm) עבור מודל AI?",
            options: [
                { id: 1, text: "למצוא את המינימום הגלובלי של פונקציית ההפסד (Loss)" },
                { id: 2, text: "לסכם את <b>'הגודל'</b> או <b>'העוצמה'</b> של הוקטור", correct: true }, 
                { id: 3, text: "לחשב את הזווית בין שני וקטורים" }
            ]
        },
        {
            id: 2,
            text: "וקטור המייצג אובייקט קיצוני, חריג או פעיל במיוחד, יהיה בדרך כלל בעל:",
            options: [
                { id: 1, text: "מרחק קטן במיוחד מהראשית" },
                { id: 2, text: "<b>נורמה גבוהה (אורך גדול)</b>", correct: true }, 
                { id: 3, text: "נורמה אפס" }
            ]
        },
        {
            id: 3,
            text: "מדוע מרחק אוקלידי (L2) אינו מספיק למדידת דמיון סמנטי (משמעות) בטקסט?",
            options: [
                { id: 1, text: "כי הוא לא יכול לעבוד עם וקטורים מעל 10 ממדים" },
                { id: 2, text: "כי הוא מודד שונות גיאומטרית בלבד, ולא כיוון רעיוני", correct: true },
                { id: 3, text: "כי הוא דורש חישוב איטרטיבי ולוקח זמן רב מדי" }
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

    const isComplete = Object.keys(answers).length === questions.length;

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
             <div className="flex items-center gap-4 mb-8 pt-10 border-t border-slate-800">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20"><Brain size={24} /></div>
                <h2 className="text-3xl font-bold text-white">4. בדיקת אינטואיציה</h2>
            </div>
            
            {questions.map((q) => (
                <div key={q.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <h4 className="font-bold text-white mb-4 text-lg border-r-4 border-fuchsia-500 pr-3">{q.text}</h4>
                    <div className="space-y-3">
                        {q.options.map((opt) => {
                            const isSelected = answers[q.id] === opt.id;
                            const isCorrect = opt.correct;
                            
                            let btnClass = "w-full text-right p-4 rounded-lg border transition-all text-sm flex items-center justify-between group ";
                            
                            if (isSelected && isComplete) {
                                if (isCorrect) btnClass += "bg-green-500/10 border-green-500/50 text-green-300";
                                else btnClass += "bg-red-500/10 border-red-500/50 text-red-300";
                            } else {
                                btnClass += "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800 hover:border-blue-500/30 text-slate-300";
                                if (isSelected) btnClass += " border-blue-500/50 bg-blue-500/10";
                            }

                            return (
                                <button 
                                    key={opt.id}
                                    onClick={() => handleSelect(q.id, opt.id)}
                                    className={btnClass}
                                    disabled={isComplete}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: opt.text }} />
                                    {isComplete && (isCorrect ? <Check size={18} className="text-green-400" /> : <X size={18} className="text-red-400" />)}
                                    {!isComplete && <div className={`w-4 h-4 rounded-full border border-slate-600 ${isSelected ? 'bg-blue-500 border-blue-500' : 'group-hover:border-blue-400'}`} />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            ))}
            
            <AnimatePresence>
                {isComplete && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center pt-8"
                    >
                        {allCorrect ? (
                            <p className="text-xl font-bold text-green-400 mb-6 flex items-center justify-center gap-2">
                                <CheckCircle size={24} /> הבנה מצוינת! אתה מוכן לקוסינוס.
                            </p>
                        ) : (
                            <p className="text-xl font-bold text-red-400 mb-6 flex items-center justify-center gap-2">
                                <X size={24} /> עבור על ההסברים, ואז המשך.
                            </p>
                        )}
                        <Link href="/chapter-7">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-lg rounded-xl transition-transform hover:scale-105">
                                המשך לפרק 7: דמיון קוסינוס
                                <ArrowLeft size={20} className="mr-2 rotate-180" />
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface NumPyNormTableProps {
    norm: string;
    distance: string;
}

const NumPyNormTable: React.FC<NumPyNormTableProps> = ({ norm, distance }) => (
    <div className="mt-4">
        <h4 className="text-xl font-bold text-white mb-4 border-r-4 border-fuchsia-500 pr-3">חישוב מהיר ב-NumPy</h4>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-slate-400 table-auto">
                <thead className="text-xs uppercase bg-slate-800/70 text-slate-300">
                    <tr className="text-right">
                        <th scope="col" className="px-6 py-3">השדה המתמטי</th>
                        <th scope="col" className="px-6 py-3">NumPy פונקציה</th>
                        <th scope="col" className="px-6 py-3">דוגמה לתוצאה</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-slate-900 border-b border-slate-800 hover:bg-slate-800/50">
                        <td className="px-6 py-4 font-bold text-fuchsia-400">נורמה (אורך)</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-300">np.linalg.norm(v)</td>
                        <td className="px-6 py-4 font-mono text-xs text-blue-300">{norm}</td>
                    </tr>
                    <tr className="bg-slate-900 border-b border-slate-800 hover:bg-slate-800/50">
                        <td className="px-6 py-4 font-bold text-emerald-400">מרחק (אוקלידי)</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-300">np.linalg.norm(v1 - v2)</td>
                        <td className="px-6 py-4 font-mono text-xs text-blue-300">{distance}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p className="text-sm text-slate-500 mt-3 border-r-2 border-slate-700 pr-3">
             אינטואיציה: NumPy מחשבת את המרחק והנורמה באופן מיידי, גם במימדים גבוהים, באמצעות אותה פונקציה (norm).
        </p>
    </div>
);

const SimpleCodeDisplay: React.FC<{title: string, code: string, output: string, description: string}> = ({ title, code, output, description }) => (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 h-full flex flex-col">
        <h4 className="text-sm font-bold text-white mb-3 border-r-4 border-blue-500 pr-3">{title}</h4>
        
        {/* בלוק הקוד עצמו - LTR כפוי */}
        <pre className="flex-1 bg-slate-950 p-3 rounded-md text-xs font-mono text-slate-300 overflow-x-auto" dir="ltr">
            <code>{code}</code>
        </pre>
        
        {/* הפלט - LTR כפוי */}
        <div className="bg-slate-800/70 p-2 mt-2 rounded-md border border-slate-700" dir="ltr">
            <span className="text-yellow-400 font-semibold mr-2">פלט:</span>
            <span className="text-white font-mono">{output}</span>
        </div>
        
        <p className="text-xs text-slate-400 mt-3 border-r-2 border-slate-700 pr-3">{description}</p>
    </div>
);


// --- העמוד הראשי ---

export default function ChapterSix() {
  
  // הגדרת תוכן הנוסחה כקוד LaTeX מלא
  const normFormulaLatex = 
    "\\mathbf{||v||} = \\sqrt{v_1^2 + v_2^2 + \\dots + v_n^2}";

  const distanceFormulaLatex =
    "\\text{Distance}(v_1, v_2) = \\sqrt{(v_{1,1} - v_{2,1})^2 + \\dots + (v_{1,n} - v_{2,n})^2}";

  // הנוסחה הקונקרטית של הדוגמה (זו שבתמונה)
  const normExampleLatex = 
    "\\mathbf{||v||} = \\sqrt{\\mathbf{3^2} + \\mathbf{4^2}} = \\sqrt{\\mathbf{25}} = \\mathbf{5}";


  return (
  
          
            <ChapterLayout courseId="mathIntuitive" currentChapterId={6}>
          
          {/* סעיף 1: מהי נורמה? (אורך) */}
          <section id="norma" className="scroll-mt-24 mb-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-fuchsia-500/10 rounded-xl text-fuchsia-400 border border-fuchsia-500/20"><Scale size={24} /></div>
                <h2 className="text-3xl font-bold text-white">1. מהי נורמה? (האורך של הוקטור)</h2>
            </div>
            
            <div className="prose prose-invert text-slate-400 text-lg leading-relaxed max-w-none space-y-6">
                <p>
                    <span className="font-bold">נורמה</span> היא מספר אחד שמסכם את <span className="font-bold text-white">&quot;הגודל&quot;</span> של הוקטור. אפשר לחשוב עליה פשוט כעל <span className="font-bold">אורך</span>.
                </p>
                <p>
                    אם תצייר וקטור על לוח כקווים, הנורמה היא האורך של הקו. לדוגמה, <span className="font-bold">וקטור V = [3, 4]</span> הנורמה שלו היא 5 (על בסיס פיתגורס).
                </p>
                <p>
                    במרחב רב־ממדי, הנורמה (L2) היא הדרך למדידת המרחק הגיאומטרי האמיתי בין נקודות במרחב, לא סכום צעדים ולא קיצורים מלאכותיים.  במודלי AI, היא קובעת את ה&quot;משקל&quot; או ה&quot;עוצמה&quot; של הוקטור.
                </p>
                
                
                <FormulaDisplay 
                    title="נוסחת הנורמה (L2 - הכללת פיתגורס)"
                    content={normFormulaLatex} 
                    explanation="השורש של סכום הריבועים של כל הרכיבים בוקטור. זו הדרך היחידה למדוד את המרחק הגיאומטרי האמיתי (הקו הישר) מהראשית."
                    icon={<Zap className="text-fuchsia-400" />}
                />
                
                
                {/* הוספת mb-6 כדי להרחיק ממעבדת הנורמה */}
                <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg mt-4 text-center mb-6"> 
                    <h5 className="text-sm text-slate-400 mb-2">דוגמה קונקרטית לחישוב הנורמה של [3, 4]:</h5>
                    <MathRenderer latex={normExampleLatex} displayMode={true} />
                </div>
            </div>
            
            {/* LAB 1: NormLab */}
            <NormLab />

            
            <div className="grid grid-cols-1 gap-8 mt-12">
                 
                 <SimpleCodeDisplay
                    title="דוגמה: חישוב נורמה ב-NumPy (LTR כפוי)"
                    code={`import numpy as np
v = np.array([3, 4])
norm_v = np.linalg.norm(v) # מחשב את הנורמה (אורך)
print(f'Norm: {norm_v:.2f}')`}
                    output="5.00"
                    description="כך המודל מחשב את 'עוצמת' המידע של הוקטור (גם באלפי ממדים). זהו היישום הפרקטי של נוסחת הנורמה."
                />
                {/* NumPy Table כעת מתחת לבלוק הקוד, עם ריווח למעלה */}
                <div className="mt-8">
                     <NumPyNormTable norm="5.00" distance="5.00" />
                </div>
            </div>
            
            <div className="prose prose-invert text-slate-400 text-lg leading-relaxed max-w-none space-y-6 mt-12">
                <h3 className="text-xl font-bold text-white mb-4 border-r-4 border-fuchsia-500 pr-3">למה נורמה קריטית ב-AI? (עוצמה מול כיוון)</h3>
                <p>
                    נורמה מציגה למודל כמה חזק או קיצוני אובייקט מסוים. זה קריטי עבור:
                </p>
                <ul className="list-disc pr-6 space-y-2">
                    <li><b>חריגות (Outliers)</b>: וקטור ארוך במיוחד יכול להיות אנומליה (פעילות קיצונית).</li>
                    <li><b>נירמול (Normalization)</b>: תהליך בו אנו משנים את הוקטור כך שאורכו יהיה 1. זה מאפשר למודל להתעלם מהעוצמה (אורך הוקטור) ולהתמקד <b>רק בכיוון</b> (במשמעות הסמנטית). זהו הבסיס לדמיון קוסינוס.</li>
                </ul>
                <p className="font-bold text-white">
                    אינטואיציה: נורמה עוזרת למודל להבין את <span className="font-bold text-white">עוצמת המידע</span>; נירמול מסיר את העוצמה ומשאיר רק את <span className="font-bold text-white">הכיוון (המשמעות)</span>.
                </p>
            </div>
          </section>


          {/* סעיף 2: מדידת מרחק בין וקטורים */}
          <section id="distance" className="scroll-mt-24 mb-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20"><Target size={24} /></div>
                <h2 className="text-3xl font-bold text-white">2. מרחק אוקלידי: המדד הראשון לדמיון</h2>
            </div>
            
            <div className="prose prose-invert text-slate-400 text-lg leading-relaxed max-w-none space-y-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">הצעד הראשון: מרחק</h3>
                <p>
                    כדי להשוות בין שני וקטורים, הדרך האינטואיטיבית ביותר היא למדוד את המרחק ביניהם. אנו משתמשים ב<b>מרחק אוקלידי (L2 Distance)</b>, שהוא למעשה אורך הוקטור המחבר בין שתי הנקודות במרחב הרב-ממדי.
                </p>
                <p className="font-bold text-white border-r-4 border-emerald-500 pr-3 bg-emerald-500/5 py-1 rounded-r">
                    מרחק קטן ← הוקטורים קרובים גיאומטרית. מרחק גדול ← הוקטורים רחוקים גיאומטרית.
                </p>
            </div>
            
            {/* LAB 2: DistanceProblemLab */}
            <DistanceProblemLab />

            {/* מעבר מ-grid ל-space-y לריווח נכון */}
            <div className="space-y-8 mt-8">
                <FormulaDisplay 
                    title="נוסחת המרחק בין 2 וקטורים (L2)"
                    content={distanceFormulaLatex} 
                    explanation="השורש של סכום ריבועי ההפרשים. זו הכללה של נוסחת המרחק הדו-ממדית לכל מספר של ממדים."
                    icon={<HardHat className="text-emerald-400" />}
                />
                
                {/* שימוש ב-SimpleCodeDisplay לתיקון כיווניות LTR והחלפת גרשיים */}
                 <SimpleCodeDisplay
                    title="דוגמה: חישוב מרחק ב-NumPy (LTR כפוי)"
                    code={`import numpy as np
v1 = np.array([3, 4])
v2 = np.array([7, 1])
# המרחק הוא נורמת ההפרש
distance = np.linalg.norm(v1 - v2)
print(f'Distance: {distance:.2f}')`}
                    output="5.00"
                    description="מרחק שימושי בקיבוץ (Clustering) ואיתור חריגים, שבהם המיקום הגיאומטרי המוחלט הוא העיקר."
                />
            </div>
             <p className="prose prose-invert text-slate-400 text-lg leading-relaxed max-w-none mt-6">
                <b>הסבר מעמיק:</b> ביישומי AI מסוימים, כמו ניתוח תמונות או נתוני חיישנים, המרחק האוקלידי עשוי להיות מדד טוב. אבל ברגע שאנו נכנסים לתחום השפה (NLP), שם <b>המשמעות</b> חשובה יותר מהעוצמה המילולית, המרחק הופך לבעייתי, כפי שנראה בסעיף הבא.
            </p>
          </section>


          {/* סעיף 3: הבעיה הקריטית עם מרחק (הכנה לקוסינוס) */}
          <section id="problem" className="scroll-mt-24 mb-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20"><Layout size={24} /></div>
                <h2 className="text-3xl font-bold text-white">3. הבעיה הגדולה: מרחק מול משמעות</h2>
            </div>
            
            <div className="prose prose-invert text-slate-400 text-lg leading-relaxed max-w-none space-y-6">
                <p>
                    כאן מגיעה הנקודה הקריטית: <b>מרחק (L2) לא יודע להבין משמעות</b>. מדוע? כי המרחק מתחשב באורך הוקטור (הנורמה), וזו לא תמיד אינדיקציה טובה לדמיון רעיוני.
                </p>
                <p className="font-bold text-red-300">
                    מרחק מודד שונות גיאומטרית בלבד, לא שונות רעיונית. בטקסט, וקטורים עם משמעות זהה (כגון &quot;כלב גדול&quot; ו&quot;כלב ענק&quot;) יכולים להיות מרוחקים מאוד אם האורך של אחד מהם (העוצמה) גבוה בהרבה מהשני.
                </p>
                <p>
                    זהו הפער הגדול ביותר במעבר מגיאומטריה פשוטה לגיאומטריה של דאטה. אנו צריכים מדד ששואל: <b>האם הם מצביעים לאותו כיוון?</b>
                </p>
            </div>
            
            {/* DistanceProblemDemo */}
            <DistanceProblemDemo />
            
            <div className="prose prose-invert text-slate-400 text-lg leading-relaxed max-w-none space-y-6 mt-12">
                <h3 className="text-xl font-bold text-white mb-4 border-r-4 border-red-500 pr-3">הפתרון: מודדים כיוון!</h3>
                <p>
                    השאלה החשובה ב-NLP היא לא &quot;כמה רחוק&quot;, אלא <b>&quot;לאיזה כיוון הוקטורים מצביעים?&quot;</b>
                </p>
                <p>
                    <b>כיוון</b> - מספר למודל, האם שני משפטים &quot;מסתובבים סביב אותו רעיון&quot;, גם אם המרחק ביניהם גדול.
                    זו הסיבה שמערכות NLP כמעט תמיד משתמשות במדידת זווית בין וקטורים.
                </p>
                <p className="font-bold text-white">
                    המדד הזה נקרא <b>דמיון קוסינוס</b>, והוא אחד הכלים החשובים ביותר להבנת משמעות בשפה. נצלול אליו בפרק הבא.
                </p>
            </div>
          </section>

          {/* סעיף 4: החידון */}
          <section id="quiz" className="scroll-mt-24">
             <NormDistanceQuiz />
          </section>
      
        </ChapterLayout>
    
  );
}