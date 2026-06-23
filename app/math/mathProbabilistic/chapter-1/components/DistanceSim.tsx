"use client";

import React, { useState, useMemo } from 'react';
import { motion } from "framer-motion";
import { Compass, Zap, CheckCircle2, Target, Lightbulb } from "lucide-react";

export const DistanceSim = () => {
    const [vecA, setVecA] = useState({ x: 2, y: 1 });
    const [vecB, setVecB] = useState({ x: 1, y: 2 });
    const [metric, setMetric] = useState<'cosine' | 'euclidean'>('cosine');

    // חישובים גיאומטריים ופונקציית לוס (פרק 2 ופרק 5) [cite: 63, 67-68, 79, 98]
    const stats = useMemo(() => {
        const dotProduct = vecA.x * vecB.x + vecA.y * vecB.y;
        const normA = Math.sqrt(vecA.x ** 2 + vecA.y ** 2);
        const normB = Math.sqrt(vecB.x ** 2 + vecB.y ** 2);
        
        const cosineSim = dotProduct / (normA * normB || 1);
        const euclideanDist = Math.sqrt(Math.pow(vecA.x - vecB.x, 2) + Math.pow(vecA.y - vecB.y, 2));
        const loss = Math.pow(euclideanDist, 2);
        
        return { 
            cosine: cosineSim.toFixed(3), 
            euclidean: euclideanDist.toFixed(3), 
            loss: loss.toFixed(2) 
        };
    }, [vecA, vecB]);

    // ניהול משימות ללא useEffect כדי למנוע cascading renders
    const tasks = useMemo(() => [
        { 
            title: "משימת הזווית", 
            desc: "הבא את הווקטורים לאותו כיוון (דמיון > 0.99)",
            isComplete: Number(stats.cosine) > 0.99 
        },
        { 
            title: "ענישת ה-Loss", 
            desc: "הרחק את המושגים עד שה-Loss יעבור את 15.0",
            isComplete: Number(stats.loss) > 15 
        }
    ], [stats.cosine, stats.loss]);

    // חישוב המשימה הפעילה בזמן אמת
    const activeTaskIndex = tasks.findIndex(t => !t.isComplete);
    const currentTask = activeTaskIndex === -1 ? tasks.length - 1 : activeTaskIndex;

    const getPointPos = (val: number) => `${(val / 5) * 100}%`;

    return (
        <div className="w-full bg-slate-950 border border-blue-500/20 rounded-[3rem] p-8 shadow-2xl text-right font-sans" dir="rtl">
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4 pr-4 border-r-4 border-blue-500/50">
                    <Compass className="text-blue-500" size={32} />
                    <h4 className="text-white font-black text-2xl tracking-tight">מעבדה 2: מרחב ולוס</h4>
                </div>
                
                <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
                    <button onClick={() => setMetric('cosine')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${metric === 'cosine' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>דמיון קוסינוס</button>
                    <button onClick={() => setMetric('euclidean')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${metric === 'euclidean' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>מרחק אוקלידי</button>
                </div>
            </div>

            {/* לוח המשימות */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {tasks.map((t, i) => (
                    <div key={i} className={`p-4 rounded-2xl border transition-all ${t.isComplete ? 'bg-emerald-500/10 border-emerald-500/50' : i === currentTask ? 'bg-blue-500/10 border-blue-500/50 ring-1 ring-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-white/5 border-white/10 opacity-40'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            {t.isComplete ? <CheckCircle2 className="text-emerald-400" size={18} /> : <Target className={i === currentTask ? "text-blue-400 animate-pulse" : "text-slate-500"} size={18} />}
                            <span className={`text-xs font-bold ${i === currentTask ? 'text-white' : 'text-slate-400'}`}>{t.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{t.desc}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
                <div className="bg-black/40 rounded-[2.5rem] border border-white/5 aspect-square relative p-10 overflow-hidden shadow-inner">
                    <div className="relative w-full h-full border-l-2 border-b-2 border-white/10 bg-grid-white/[0.02]">
                        <svg className="absolute inset-0 w-full h-full overflow-visible">
                            <defs>
                                <marker id="m-blue" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#3b82f6" /></marker>
                                <marker id="m-emerald" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#10b981" /></marker>
                            </defs>
                            <motion.line x1="0" y1="100%" x2={getPointPos(vecA.x)} y2={`${100 - (vecA.y / 5) * 100}%`} stroke="#10b981" strokeWidth="4" markerEnd="url(#m-emerald)" />
                            <motion.line x1="0" y1="100%" x2={getPointPos(vecB.x)} y2={`${100 - (vecB.y / 5) * 100}%`} stroke="#3b82f6" strokeWidth="4" markerEnd="url(#m-blue)" />
                        </svg>
                    </div>
                </div>

                <div className="flex flex-col justify-center space-y-10">
                    <div className="grid grid-cols-2 gap-8">
                        {[
                            {v: vecA, s: setVecA, c: "emerald", label: "וקטור א'"}, 
                            {v: vecB, s: setVecB, c: "blue", label: "וקטור ב'"}
                        ].map((vec, idx) => (
                            <div key={idx} className="space-y-4 text-right">
                                <label className={`text-[10px] font-black text-${idx === 0 ? 'emerald' : 'blue'}-500 uppercase block tracking-tighter`}>
                                    {vec.label}
                                </label>
                                {['x', 'y'].map(axis => (
                                    <input 
                                        key={axis} 
                                        type="range" 
                                        min="0.1" 
                                        max="4.5" 
                                        step="0.1" 
                                        value={axis === 'x' ? vec.v.x : vec.v.y} 
                                        onChange={(e) => vec.s({...vec.v, [axis]: parseFloat(e.target.value)})} 
                                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-white" 
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                            <div className="text-[10px] text-slate-500 uppercase font-black mb-1">{metric === 'cosine' ? 'דמיון קוסינוס' : 'מרחק אוקלידי'}</div>
                            <div className="text-4xl font-black text-white tracking-tighter">{metric === 'cosine' ? stats.cosine : stats.euclidean}</div>
                        </div>
                        <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20 text-center relative overflow-hidden">
                            <div className="text-[10px] text-red-400 uppercase font-black mb-1 flex items-center justify-center gap-1"><Zap size={10} /> מדד טעות (Loss)</div>
                            <div className="text-4xl font-black text-white tracking-tighter">{stats.loss}</div>
                            <motion.div className="absolute bottom-0 left-0 h-1 bg-red-500" initial={false} animate={{ width: `${Math.min(100, Number(stats.loss) * 5)}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-blue-600/5 rounded-3xl border border-blue-500/10 flex gap-4">
                <Lightbulb className="text-blue-400 shrink-0 mt-1" size={20} />
                <div className="text-[11px] text-slate-400 leading-relaxed italic text-justify">
                    <strong>מסקנה מפרק 1:</strong> כפי שמוסבר בלומדה, מודלים לומדים מטעויות[cite: 105]. כאשר מדד ה-Loss גדל, המודל מקבל &quot;אות&quot; חזק המורה לו לשנות את הפרמטרים הפנימיים שלו כדי להקטין את השגיאה ולהתקרב לפתרון הרצוי [cite: 119-120, 136].
                </div>
            </div>
        </div>
    );
};