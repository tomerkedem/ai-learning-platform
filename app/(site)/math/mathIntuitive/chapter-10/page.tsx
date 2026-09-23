"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { 
    TrendingDown, RefreshCcw, Activity, ArrowRight, Zap, CheckCircle2, 
    Terminal, Brain, Mountain, Check, X, Gauge, 
    ArrowLeft, BookOpen, MousePointer2, Eye, Ruler // הוספתי Eye ו-Ruler להסבר
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { ChapterLayout } from '@/components/ChapterLayout';

// --- Types ---
interface SimulationStep {
    i: number;
    x: number;
    slope: number;
    error: number;
    prevX: number;
}

// --- UI Components ---

const SectionHeader = ({ icon: Icon, title, subtitle, color = "cyan" }: { icon: React.ElementType, title: string, subtitle: string, color?: string }) => (
    <div className={`space-y-4 mb-10 border-r-4 border-${color}-500 pr-6 text-right`} dir="rtl">
        <div className="flex items-center gap-3">
            <div className={`p-3 bg-${color}-500/10 rounded-xl text-${color}-400 shadow-[0_0_15px_rgba(0,0,0,0.3)] border border-${color}-500/20`}>
                <Icon size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{title}</h2>
        </div>
        <p className="text-lg text-slate-300 max-w-4xl leading-relaxed font-medium opacity-90">{subtitle}</p>
    </div>
);

const ExplainCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl text-right mt-6 backdrop-blur-sm shadow-lg" dir="rtl">
        <h4 className="text-cyan-300 font-bold mb-3 text-lg flex items-center gap-2">
            <BookOpen size={20} /> {title}
        </h4>
        <div className="text-slate-300 text-base leading-relaxed space-y-2">
            {children}
        </div>
    </div>
);

const TextBlock = ({ children }: { children: React.ReactNode }) => (
    <div className="text-lg text-slate-300 leading-8 max-w-4xl mb-8 space-y-6 font-light text-right" dir="rtl">
        {children}
    </div>
);

// --- Component 1: The Hiker Game ---
const HikerGame = () => {
    const [pos, setPos] = useState(-85); 
    const [message, setMessage] = useState("המשימה: רד לתחתית העמק. לאן תלך?");
    const [isSuccess, setIsSuccess] = useState(false);

    const getHeight = (x: number) => 15 + 75 * Math.pow(x / 100, 2);

    const move = (direction: 'left' | 'right') => {
        if (isSuccess) return;
        const isLeftSlope = pos < 0; 
        const goingDown = (isLeftSlope && direction === 'right') || (!isLeftSlope && direction === 'left');
        
        if (goingDown) {
            const newPos = pos * 0.65;
            setPos(newPos);
            if (Math.abs(newPos) < 4) {
                setMessage("🏆 בול! הגעת למינימום. כאן השיפוע הוא אפס.");
                setIsSuccess(true);
            } else {
                setMessage("מצוין! אתה יורד בגובה. תמשיך.");
            }
        } else {
            const newPos = Math.sign(pos) * Math.min(Math.abs(pos * 1.3), 100); 
            setPos(newPos);
            setMessage("⚠️ שים לב! אתה מטפס למעלה. ב-AI אנחנו תמיד רוצים לרדת במדד הטעות.");
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="bg-[#020617] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative group h-80">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute inset-0 bg-linear-to-b from-cyan-900/10 to-transparent" />

                <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="-100 0 200 100">
                    <defs>
                        <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d="M-100,15 Q0,165 100,15 V100 H-100 Z" fill="url(#mountainGrad)" />
                    <path d="M-100,15 Q0,165 100,15" fill="none" stroke="#38bdf8" strokeWidth="3" className="drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                    
                    <line 
                        x1={pos - 10} y1={100 - getHeight(pos - 10)}
                        x2={pos + 10} y2={100 - getHeight(pos + 10)}
                        stroke={isSuccess ? "#4ade80" : "#f472b6"} 
                        strokeWidth="2"
                        strokeDasharray="4"
                    />
                </svg>

                <motion.div 
                    className="absolute text-5xl z-10 filter drop-shadow-lg" 
                    animate={{ left: `${50 + pos / 2}%`, bottom: `${getHeight(pos)}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ transform: 'translateX(-50%) translateY(15px)' }}
                >🧗</motion.div>
                
                <div className="absolute bottom-[13%] left-1/2 -translate-x-1/2 text-3xl animate-bounce filter drop-shadow-lg">🚩</div>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 flex flex-col items-center gap-4 text-center backdrop-blur-md">
                <div className={`text-lg font-bold transition-colors ${isSuccess ? 'text-green-400' : 'text-slate-200'}`}>
                    {message}
                </div>
                <div className="flex gap-4">
                    {!isSuccess ? (
                        <>
                            <Button onClick={() => move('right')} className="h-12 px-8 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-lg rounded-xl">
                                <ArrowRight className="mr-2" /> ימינה
                            </Button>
                            <Button onClick={() => move('left')} className="h-12 px-8 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-lg rounded-xl">
                                שמאלה <ArrowLeft className="ml-2" />
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => {setPos(-85); setIsSuccess(false); setMessage("המטרה: רד לתחתית העמק. לאן תלך?");}} className="bg-green-600 hover:bg-green-500 text-white rounded-full px-8 h-12 text-lg">
                            <RefreshCcw className="ml-2" /> התחל מחדש
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Component 2: Graph Visualizer ---
const GraphVisualizer = ({ currentX, history }: { currentX: number; history: number[] }) => {
    const mapX = (x: number) => ((x + 5) / 10) * 100;
    const mapY = (y: number) => 100 - (y / 30) * 100;

    const parabolaPath = useMemo(() => {
        let d = "";
        for (let x = -5; x <= 5; x += 0.1) {
            const y = (x - 3) ** 2 + 2;
            d += `${x === -5 ? "M" : "L"} ${mapX(x)} ${mapY(y)} `;
        }
        return d;
    }, []);

    const currentY = (currentX - 3) ** 2 + 2;
    const slope = 2 * (currentX - 3);
    const tanLen = 1.5;
    const x1 = currentX - tanLen;
    const y1 = currentY - slope * tanLen;
    const x2 = currentX + tanLen;
    const y2 = currentY + slope * tanLen;

    return (
        <div className="absolute top-4 right-4 w-48 h-36 bg-slate-900/90 border border-slate-600 rounded-xl shadow-2xl z-10 backdrop-blur-md overflow-hidden hidden md:block">
            <div className="absolute top-0 left-0 w-full bg-slate-800/50 py-1 text-[10px] text-cyan-400 text-center font-mono uppercase font-bold tracking-wider border-b border-slate-700">
                Live Visualization
            </div>
            <svg viewBox="0 0 100 100" className="w-full h-full mt-2" preserveAspectRatio="none">
                <line x1="0" y1="95" x2="100" y2="95" stroke="#475569" strokeWidth="0.5" />
                <path d={parabolaPath} fill="none" stroke="#06b6d4" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                {history.map((hx, i) => (
                    <circle key={i} cx={mapX(hx)} cy={mapY((hx - 3) ** 2 + 2)} r="1.5" fill="rgba(255,255,255,0.3)" />
                ))}
                <line x1={mapX(x1)} y1={mapY(y1)} x2={mapX(x2)} y2={mapY(y2)} stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round" className="opacity-80" />
                <motion.circle
                    animate={{ cx: mapX(currentX), cy: mapY(currentY) }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    r="3.5" fill="#fbbf24" stroke="white" strokeWidth="1.5"
                    className="drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                />
            </svg>
            <div className="absolute bottom-1 left-2 text-[9px] text-slate-500 font-mono">Target: x=3.0</div>
        </div>
    );
};

// --- Component 3: Python Playground ---
const PythonPlayground = () => {
    const [lr, setLr] = useState(0.1);
    const [startX, setStartX] = useState(0.0);
    const [output, setOutput] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [animX, setAnimX] = useState(0.0);
    const [historyX, setHistoryX] = useState<number[]>([]);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setStartX(0.0); }, []);
    useEffect(() => {
        if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }, [output]);

    const runSimulation = (customLr: number) => {
        setLr(customLr);
        setIsRunning(true);
        setHistoryX([]);
        setAnimX(startX);
        setOutput([`$ initializing training...`, `> Learning Rate: ${customLr}`, `> Target: Minimize (x-3)² + 2`]);

        let x = startX;
        const stepsData: SimulationStep[] = [];

        for (let i = 1; i <= 15; i++) {
            const slope = 2 * (x - 3);
            const prevX = x;
            x = x - (customLr * slope);
            const error = Math.pow(x - 3, 2) + 2;
            stepsData.push({ i, x, slope, error, prevX });
            if (Math.abs(x) > 12) break;
            if (Math.abs(slope) < 0.01) break;
        }

        let idx = 0;
        const interval = setInterval(() => {
            if (idx < stepsData.length) {
                const s = stepsData[idx];
                const isCrash = Math.abs(s.x) > 12;
                const isSuccess = Math.abs(s.slope) < 0.01;
                let logLine = `Step ${s.i}: x=${s.prevX.toFixed(2)} → ${s.x.toFixed(2)} | Err=${s.error.toFixed(2)}`;
                if (isCrash) logLine = "💥 CRASH: Gradient Exploded!";
                if (isSuccess) logLine = "✨ CONVERGED: Minimum Reached!";
                setOutput(prev => [...prev, logLine]);
                setAnimX(s.x);
                setHistoryX(prev => [...prev, s.prevX]);
                idx++;
            } else {
                clearInterval(interval);
                setIsRunning(false);
            }
        }, 200);
    };

    return (
        <div className="my-16 space-y-8" dir="ltr">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" dir="rtl">
                <button onClick={() => runSimulation(0.1)} disabled={isRunning} className="group relative bg-[#0f172a] border-2 border-cyan-500/30 hover:border-cyan-400 p-6 rounded-2xl text-right transition-all hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] disabled:opacity-50">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-black text-xl text-cyan-300 group-hover:text-cyan-200">קצב מושלם (0.1)</span>
                        <div className="p-2 bg-cyan-500/20 rounded-full text-cyan-400"><CheckCircle2 size={20} /></div>
                    </div>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">המודל יורד בצעדים מדודים ומתכנס ל-3. <br/>האיזון המושלם.</p>
                </button>
                <button onClick={() => runSimulation(1.1)} disabled={isRunning} className="group relative bg-[#0f172a] border-2 border-red-500/30 hover:border-red-400 p-6 rounded-2xl text-right transition-all hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(248,113,113,0.15)] disabled:opacity-50">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-black text-xl text-red-300 group-hover:text-red-200">התפוצצות (1.1)</span>
                        <div className="p-2 bg-red-500/20 rounded-full text-red-400"><Zap size={20} /></div>
                    </div>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">הצעד גדול מדי! המודל יקפוץ ויעוף לחלל.</p>
                </button>
                <button onClick={() => runSimulation(0.01)} disabled={isRunning} className="group relative bg-[#0f172a] border-2 border-yellow-500/30 hover:border-yellow-400 p-6 rounded-2xl text-right transition-all hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(250,204,21,0.15)] disabled:opacity-50">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-black text-xl text-yellow-300 group-hover:text-yellow-200">זחילה (0.01)</span>
                        <div className="p-2 bg-yellow-500/20 rounded-full text-yellow-400"><Activity size={20} /></div>
                    </div>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">בטוח אבל איטי להחריד. ייקח נצח להגיע ליעד.</p>
                </button>
            </div>

            <div className="bg-[#0B1221] border border-slate-700 rounded-[2rem] overflow-hidden shadow-3xl grid lg:grid-cols-2 relative ring-1 ring-white/5">
                <div className="p-8 border-r border-slate-800 bg-[#0f172a]/50 text-left backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-6 text-blue-400 font-mono text-xs font-bold uppercase tracking-[0.2em]">
                        <Terminal size={14} /> Training Script.py
                    </div>
                    <div className="font-mono text-[15px] leading-8 text-slate-300">
                        <span className="text-purple-400">def</span> <span className="text-yellow-200">get_slope</span>(x):<br/>
                        &nbsp;&nbsp;<span className="text-purple-400">return</span> 2 * (x - 3) <span className="text-slate-500 opacity-60">{'// הנגזרת'}</span><br/><br/>
                        current_x = <span className="text-green-400">{startX}</span><br/>
                        <span className="bg-white/5 px-1 rounded text-yellow-300">learning_rate = {lr}</span><br/><br/>
                        <span className="text-purple-400">for</span> step <span className="text-purple-400">in</span> range(15):<br/>
                        &nbsp;&nbsp;slope = get_slope(current_x)<br/>
                        &nbsp;&nbsp;<span className="text-slate-500 opacity-60">{'// הלב של האלגוריתם:'}</span><br/>
                        &nbsp;&nbsp;<span className="text-blue-300">current_x</span> = current_x <span className="text-red-500 font-black">-</span> (lr * slope)<br/>
                    </div>
                </div>
                <div className="bg-black/80 p-8 flex flex-col min-h-105 text-left relative">
                    <GraphVisualizer currentX={animX} history={historyX} />
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                        <span className="text-slate-500 font-mono text-xs uppercase font-bold tracking-widest">Output Console</span>
                        <div className="flex gap-2 opacity-50"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div></div>
                    </div>
                    <div ref={terminalRef} className="flex-1 font-mono text-sm space-y-2 overflow-y-auto custom-scrollbar z-0 pr-2">
                        {output.length === 0 && <span className="opacity-30 italic text-slate-400"> Waiting for input... Select a scenario above.</span>}
                        {output.map((line, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`${line.includes("CRASH") ? "text-red-400 font-bold bg-red-900/10 p-1 rounded" : line.includes("SUCCESS") ? "text-cyan-300 font-bold bg-cyan-900/10 p-1 rounded" : "text-green-400"}`}>
                                {line}
                            </motion.div>
                        ))}
                        {isRunning && <span className="animate-pulse text-green-500">_</span>}
                    </div>
                </div>
            </div>
            
            <ExplainCard title="מה למדנו מהקוד?">
                <p>בקוד למעלה אפשר לראות את הלב של הבינה המלאכותית: <strong>לולאה פשוטה שחוזרת על עצמה</strong>. </p>
                <p>בכל סיבוב, המחשב בודק את השיפוע ומעדכן את המיקום שלנו בכיוון ההפוך (סימן מינוס). הפרמטר <code>learning_rate</code> קובע את גודל הצעד – ואם הוא לא מדויק, המודל לא ילמד.</p>
                <ul className="list-disc list-inside mt-2 text-slate-400 text-sm">
                    <li>אם הקצב גדול מדי - המודל &quot;מתפוצץ&quot; ועף מהגרף.</li>
                    <li>אם הקצב קטן מדי - המודל בקושי זז.</li>
                </ul>
            </ExplainCard>
        </div>
    );
};

// --- Component 4: Quiz ---
const ChapterQuiz = () => {
    const [step, setStep] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);

    const questions = [
        { q: "מהי המטרה העיקרית של Gradient Descent?", opts: ["למצוא את המקסימום של הפונקציה", "למצוא את המינימום של פונקציית הטעות", "לחשב את הממוצע של כל הנתונים"], ans: 1, expl: "אנחנו רוצים להקטין את הטעות (לרדת לעמק) למינימום האפשרי." },
        { q: "למה משתמשים בסימן מינוס (-) בנוסחת העדכון?", opts: ["כדי ללכת נגד כיוון השיפוע (לרדת)", "סתם מוסכמה מתמטית", "כי השיפוע תמיד שלילי"], ans: 0, expl: "השיפוע מצביע על כיוון העלייה. כדי לרדת, אנחנו חייבים לבצע פעולה הפוכה." },
        { q: "מה קורה כשהשיפוע (Slope) מתקרב ל-0?", opts: ["המודל מתחיל להשתולל", "המודל מתייצב ומפסיק לזוז (התכנסות)", "המודל מדלג לצד השני"], ans: 1, expl: "שיפוע 0 אומר שהגענו לתחתית העמק (קרקע ישרה). שם המודל עוצר." }
    ];

    const handleAns = (idx: number) => {
        setSelected(idx);
        if (idx === questions[step].ans) setScore(s => s + 1);
        setTimeout(() => {
            if (step < questions.length - 1) { setStep(s => s + 1); setSelected(null); }
            else setFinished(true);
        }, 1500);
    };

    if (finished) return (
        <div className="bg-slate-900 border border-slate-700 p-12 rounded-[32px] text-center space-y-8 shadow-2xl relative overflow-hidden" dir="rtl">
            <div className="absolute inset-0 bg-linear-to-br from-green-900/20 to-transparent" />
            <div className="relative z-10">
                <CheckCircle2 size={80} className="text-green-400 mx-auto mb-6" />
                <h3 className="text-4xl font-black text-white">כל הכבוד! סיימת את פרק 10</h3>
                <p className="text-slate-300 text-xl max-w-xl mx-auto">ענית נכון על {score} מתוך {questions.length} שאלות.<br/>עכשיו יש לך את הידע לבנות את המודל הראשון שלך.</p>
                <Link href="/chapter-11"><Button className="mt-8 bg-cyan-600 hover:bg-cyan-500 rounded-full px-12 h-14 text-xl font-bold text-white shadow-lg shadow-cyan-900/50 hover:scale-105 transition-transform">המשך לפרק הבא</Button></Link>
            </div>
        </div>
    );

    return (
        <div className="bg-slate-900/50 border border-slate-700 p-10 rounded-[32px] shadow-2xl text-right relative overflow-hidden" dir="rtl">
            <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3"><Brain size={32} className="text-purple-400"/> מבחן ידע</h3>
                <span className="text-slate-400 text-sm font-mono bg-slate-800 px-3 py-1 rounded-full border border-slate-700">שאלה {step + 1} / {questions.length}</span>
            </div>
            
            <h4 className="text-2xl text-white mb-10 font-bold leading-relaxed">{questions[step].q}</h4>
            
            <div className="grid gap-4">
                {questions[step].opts.map((opt, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleAns(i)} 
                        disabled={selected !== null} 
                        className={`w-full text-right p-6 rounded-2xl border-2 transition-all text-lg font-medium flex justify-between items-center group
                        ${selected === null 
                            ? 'border-slate-700 bg-slate-800/50 hover:border-cyan-500 hover:bg-slate-800 text-slate-300' 
                            : i === questions[step].ans 
                                ? 'border-green-500 bg-green-900/20 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                                : 'border-red-500/30 bg-red-900/10 opacity-50'
                        }`}
                    >
                        <span className="group-hover:translate-x-1 transition-transform">{opt}</span>
                        {selected === i && (i === questions[step].ans ? <Check size={28} className="text-green-400" /> : <X size={28} className="text-red-400" />)}
                        {selected === null && <MousePointer2 size={20} className="opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />}
                    </button>
                ))}
            </div>
            
            <AnimatePresence>
                {selected !== null && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-slate-800 rounded-2xl border-r-4 border-cyan-500 text-slate-200 text-lg leading-relaxed shadow-lg">
                        <span className="font-bold text-cyan-400 block mb-1">הסבר:</span>{questions[step].expl}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Main Page ---
export default function ChapterTen() {
  return (
    <ChapterLayout courseId="mathIntuitive" currentChapterId={10}>
      <section className="space-y-6 py-5 text-right" dir="rtl">
        
        <TextBlock>
            <p>בפרקים הקודמים דיברנו על עקומת הטעות, על מינימום ועל שיפוע. עכשיו אנחנו מחברים את כל החלקים יחד לתהליך שהופך מודל &quot;לא מאומן&quot; למשהו שמסוגל להבין דפוסים.</p>
            <p>זהו השלב שבו המודל מפסיק &quot;לבהות&quot; בדאטה ומתחיל ממש ללמוד. 
                <br/><span className="text-white font-bold bg-white/5 px-2 rounded">Gradient Descent</span> הוא המנגנון שמאפשר למחשב לשפר את עצמו צעד אחר צעד, עד שהוא מגיע לתוצאה האופטימלית.</p>
            <div className="bg-slate-800/50 p-8 rounded-3xl border-r-4 border-cyan-500 shadow-xl text-xl text-slate-200 backdrop-blur-sm mt-6">
                &quot;המודל לא מנחש את התשובה. הוא גולש במורד עקומת הטעות עד שהוא מוצא אותה.&quot;
            </div>
        </TextBlock>
      </section>

      <section className="my-1 space-y-8" dir="rtl">
          <SectionHeader icon={Mountain} title="1. רעיון ירידת המפל (The Descent)" subtitle="Gradient Descent הוא רעיון מתמטי פשוט שמדמה ירידה על מדרון. המודל מחפש את הירידה בעקומת הטעות ומתקדם צעד אחר צעד לנקודה עם טעות נמוכה יותר." color="yellow" />
          <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                  <TextBlock>
                      <p>דמיין שאתה עומד על גבעה בחושך מוחלט ורוצה להגיע לבסיס שלה. הדרך הטבעית ביותר היא לזוז בכל פעם לכיוון שבו הקרקע יורדת הכי חזק.</p>
                      <p>זה לא ניחוש - זו בדיקה מקומית. אתה בודק את השיפוע מתחת לרגליים שלך, וזז:</p>
                  </TextBlock>
                  <ul className="space-y-4 list-none text-right">
                      <li className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                          <span className="text-red-400 font-bold text-2xl">📉</span>
                          <div className="text-slate-300">
                              <strong>שיפוע תלול:</strong> המפל חד &larr; נעשה צעד גדול כי אנחנו רחוקים.
                          </div>
                      </li>
                      <li className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                          <span className="text-green-400 font-bold text-2xl">🐢</span>
                          <div className="text-slate-300">
                              <strong>שיפוע מתון:</strong> אנחנו ליד המינימום &larr; נעשה צעד עדין וזהיר.
                          </div>
                      </li>
                  </ul>
                  <p className="text-slate-400 mt-4 text-right">זו התאמה דינמית שמאפשרת למודל להתכנס בצורה יציבה.</p>
              </div>
              <div className="ltr w-full"><HikerGame /></div>
          </div>
      </section>

      <section className="my-32 bg-[#020617] border border-slate-800 p-16 rounded-[40px] text-right relative overflow-hidden shadow-2xl" dir="rtl">
          <div className="absolute top-0 left-0 p-10 opacity-5 pointer-events-none"><TrendingDown size={400} /></div>
          <div className="relative z-10 space-y-12">
              <div className="text-center max-w-4xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-6 tracking-tight">למה המודל זז &quot;נגד&quot; השיפוע?</h2>
                  <p className="text-slate-300 text-xl leading-relaxed">
                      אחד המשפטים המבלבלים הוא: &quot;המודל זז נגד השיפוע&quot;. למה לא איתו? הרי השיפוע הוא הכיוון!
                      <br/><span className="text-cyan-400 font-bold bg-cyan-900/20 px-2 rounded">התשובה פשוטה:</span> השיפוע מצביע לכיוון העלייה. אנחנו רוצים לרדת.
                  </p>
              </div>
              <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                  <div className="bg-slate-800/50 border border-slate-700 p-10 rounded-[30px] text-center shadow-lg hover:border-red-500/30 transition-all hover:-translate-y-2">
                      <TrendingDown className="rotate-180 mx-auto text-red-400 mb-6 drop-shadow-[0_0_15px_rgba(248,113,113,0.4)]" size={64} />
                      <h3 className="text-2xl font-black text-red-200 mb-3">שיפוע חיובי (+)</h3>
                      <p className="text-slate-300 text-lg">ההר עולה ימינה.<br/>כדי לרדת, צריך ללכת <strong>שמאלה (מינוס)</strong>.</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 p-10 rounded-[30px] text-center shadow-lg hover:border-green-500/30 transition-all hover:-translate-y-2">
                      <TrendingDown className="mx-auto text-green-400 mb-6 drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]" size={64} />
                      <h3 className="text-2xl font-black text-green-200 mb-3">שיפוע שלילי (-)</h3>
                      <p className="text-slate-300 text-lg">ההר יורד ימינה.<br/>כדי להמשיך לרדת, צריך ללכת <strong>ימינה (פלוס)</strong>.</p>
                  </div>
              </div>
              <div className="mt-16 bg-slate-950/80 p-12 rounded-[30px] border border-slate-800 text-center max-w-3xl mx-auto shadow-2xl backdrop-blur-xl">
                  <div className="text-yellow-500 font-bold text-sm uppercase tracking-[0.3em] mb-6 flex items-center justify-center gap-2"><Zap size={16}/> הנוסחה הקדושה <Zap size={16}/></div>
                  <div className="font-mono text-3xl md:text-4xl text-white font-black tracking-wider drop-shadow-xl" dir="ltr">
                      x = x <span className="text-red-500">-</span> (rate * slope)
                  </div>
                  
                  {/* הסבר על רכיבי הנוסחה - ההוספה החדשה */}
                  <div className="grid md:grid-cols-2 gap-6 mt-12 text-right">
                      <div className="bg-slate-900/80 p-6 rounded-2xl border border-blue-500/30 hover:border-blue-500/60 transition-colors">
                          <h4 className="text-blue-400 font-bold text-xl mb-3 flex items-center gap-3"><Eye size={24}/> Slope (השיפוע)</h4>
                          <p className="text-slate-300 text-base leading-relaxed">
                              זהו &quot;מד התלילות&quot;. הוא עונה על השאלה: האם המדרון עולה או יורד, וכמה חזק? <br/>
                              <span className="text-slate-400 text-sm mt-2 block">• שיפוע גבוה = רחוקים מהיעד.<br/>• שיפוע 0 = הגענו לתחתית.</span>
                          </p>
                      </div>
                      <div className="bg-slate-900/80 p-6 rounded-2xl border border-purple-500/30 hover:border-purple-500/60 transition-colors">
                          <h4 className="text-purple-400 font-bold text-xl mb-3 flex items-center gap-3"><Ruler size={24}/> Rate (קצב הלמידה)</h4>
                          <p className="text-slate-300 text-base leading-relaxed">
                              זהו &quot;אורך הצעד&quot;. הוא קובע כמה נתייחס לשיפוע. האם לרוץ (מספר גדול) או לזחול (מספר קטן)? <br/>
                              <span className="text-slate-400 text-sm mt-2 block">זה הכפתור הרגיש ביותר במערכת שקובע אם נלמד או נתרסק.</span>
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section className="my-32 space-y-12" dir="rtl">
          <SectionHeader icon={Gauge} title="2. המעבדה החיה: קצב הלמידה" subtitle="כל צעד שהמודל עושה מושפע מפרמטר קריטי: Learning Rate. אפשר לחשוב עליו בתור 'כמה חזק אני מסובב את ההגה' או 'כמה גז אני נותן'." color="purple" />
          <div className="bg-[#0f172a] p-10 rounded-[40px] border border-slate-700 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><BookOpen size={32}/></div>
                  <div>
                      <h3 className="text-2xl font-black text-white">מעבדת קוד אינטראקטיבית</h3>
                      <p className="text-slate-400 text-lg">שחק עם הקוד וראה איך המודל מתנהג בזמן אמת. המטרה: להגיע ל-x=3.</p>
                  </div>
              </div>
              <PythonPlayground />
          </div>
      </section>

      <section className="my-32 max-w-3xl mx-auto"><ChapterQuiz /></section>
    </ChapterLayout>
  );
}