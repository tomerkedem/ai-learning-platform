"use client";

import React, { useState, useMemo } from 'react';
import { motion } from "framer-motion";
import { Fingerprint, Info, Plus, CheckCircle2, Lightbulb } from "lucide-react";

// מילון סמנטי - ייצוג רעיונות כמספרים
const WORD_DATABASE: Record<string, number[]> = {
    "מחשב": [0.8, 0.1, 0.9, -0.2],
    "לפטופ": [0.7, 0.2, 0.8, -0.1],
    "קפה": [-0.3, 0.8, -0.4, 0.6],
    "תה": [-0.2, 0.7, -0.5, 0.5],
    "טבע": [-0.7, -0.3, -0.6, 0.8],
    "עץ": [-0.8, -0.4, -0.5, 0.7],
};

export const VectorLab = () => {
    const [wordA, setWordA] = useState("מחשב");
    const [wordB, setWordB] = useState("לפטופ");
    const [showMath, setShowMath] = useState(false);
    const [step, setStep] = useState(1);

    const vecA = useMemo(() => WORD_DATABASE[wordA] || [0, 0, 0, 0], [wordA]);
    const vecB = useMemo(() => WORD_DATABASE[wordB] || [0, 0, 0, 0], [wordB]);

    const combinedVec = useMemo(() => {
        return vecA.map((val, i) => parseFloat((val + vecB[i]).toFixed(2)));
    }, [vecA, vecB]);

    // פונקציית עזר למיקום בטוח שמונעת חיתוך ויזואלי
    const getMapPos = (val: number, isResult = false) => {
        const scaleFactor = isResult ? 4 : 2; 
        const normalized = (val + (scaleFactor / 2)) / scaleFactor;
        return `${normalized * 80 + 10}%`; 
    };

    return (
        <div className="w-full bg-slate-950 border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-2xl text-right font-sans" dir="rtl">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 pr-4 border-r-4 border-emerald-500/50">
                    <Fingerprint className="text-emerald-400" size={28} />
                    <h4 className="text-white font-black text-2xl">מעבדה 1: הגיאומטריה של המשמעות</h4>
                </div>
                <div className="text-emerald-500 font-mono text-sm bg-emerald-500/10 px-4 py-1 rounded-full border border-emerald-500/20">
                    צעד {step} מתוך 3
                </div>
            </div>

            {/* רכיב הנחיות */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { id: 1, text: "בחר שתי מילים דומות (למשל 'מחשב' ו'לפטופ')", active: step === 1 },
                    { id: 2, text: "לחץ על 'חיבור וקטורים' כדי לשלב את המשמעות", active: step === 2 },
                    { id: 3, text: "ראה איפה הנקודה החדשה הופיעה במפה", active: step === 3 }
                ].map((s) => (
                    <div key={s.id} className={`p-4 rounded-2xl border transition-all ${s.active ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 opacity-50'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            {step > s.id ? <CheckCircle2 size={16} className="text-emerald-400" /> : <div className="w-4 h-4 rounded-full border-2 border-current text-emerald-500 flex items-center justify-center text-[10px]">{s.id}</div>}
                            <span className={`text-xs font-bold ${s.active ? 'text-emerald-400' : 'text-slate-400'}`}>משימה</span>
                        </div>
                        <p className="text-sm text-slate-200">{s.text}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* מפת המרחב */}
                <div className="bg-black/40 p-6 rounded-[2.5rem] border border-white/5 relative h-80 shadow-inner overflow-hidden">
                    <div className="relative w-full h-full border border-white/10 rounded-xl bg-grid-white/[0.02]">
                        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5" />
                        <div className="absolute left-1/2 top-0 w-px h-full bg-white/5" />

                        {Object.entries(WORD_DATABASE).map(([name, v]) => (
                            <motion.div 
                                key={name}
                                style={{ left: getMapPos(v[0]), top: getMapPos(v[1]) }}
                                className={`absolute px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                    name === wordA ? 'bg-emerald-500 text-black z-20 ring-4 ring-emerald-500/20 shadow-lg' : 
                                    name === wordB ? 'bg-blue-500 text-white z-20 ring-4 ring-blue-500/20 shadow-lg' : 'bg-white/5 text-slate-600'
                                }`}
                            >
                                {name}
                            </motion.div>
                        ))}

                        {showMath && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ 
                                    opacity: 1, 
                                    scale: 1, 
                                    left: getMapPos(combinedVec[0], true), 
                                    top: getMapPos(combinedVec[1], true) 
                                }}
                                className="absolute p-3 rounded-xl text-xs font-black bg-purple-600 text-white border-2 border-white shadow-2xl z-30 whitespace-nowrap"
                            >
                                תוצאה: {wordA} + {wordB}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* שליטה */}
                <div className="flex flex-col justify-center gap-6 text-right">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-emerald-500 block">מילה א&apos;:</label>
                            <select 
                                value={wordA} 
                                onChange={(e) => { setWordA(e.target.value); if(step === 1) setStep(2); }}
                                className="w-full bg-slate-900 border-2 border-white/10 p-4 text-white rounded-2xl focus:border-emerald-500 outline-none"
                            >
                                {Object.keys(WORD_DATABASE).map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-blue-500 block">מילה ב&apos;:</label>
                            <select 
                                value={wordB} 
                                onChange={(e) => { setWordB(e.target.value); if(step === 1) setStep(2); }}
                                className="w-full bg-slate-900 border-2 border-white/10 p-4 text-white rounded-2xl focus:border-blue-500 outline-none"
                            >
                                {Object.keys(WORD_DATABASE).map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                    </div>

                    <button 
                        onClick={() => { setShowMath(!showMath); setStep(showMath ? 2 : 3); }}
                        className={`w-full py-5 rounded-[1.5rem] font-black text-lg transition-all flex items-center justify-center gap-3 ${
                            showMath ? 'bg-purple-600 text-white shadow-lg' : 'bg-emerald-500 text-black hover:bg-emerald-400'
                        }`}
                    >
                        <Plus size={20} /> {showMath ? "אפס ניסוי" : "חיבור וקטורים (שלב רעיונות)"}
                    </button>
                    
                    <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10 flex items-start gap-3">
                        <Lightbulb className="text-emerald-400 shrink-0" size={20} />
                        <p className="text-xs text-slate-300">
                            <strong>שים לב:</strong> בגלל שווקטורים הם רשימות של מספרים, המודל יכול לחשב משמעות בצורה גיאומטרית[cite: 8].
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 p-6 bg-blue-600/10 rounded-[2rem] border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2 text-blue-400 text-sm font-bold">
                    <Info size={18} /> מה אנחנו לומדים מזה?
                </div>
                <p className="text-xs text-slate-400 leading-relaxed italic">
                    ב-AI, מילים הן לא טקסט אלא &quot;כתובת GPS&quot; במפה דיגיטלית עצומה[cite: 199]. חיבור וקטורים מדגים איך המודל משלב רעיונות לכדי משמעות חדשה[cite: 203].
                </p>
            </div>
        </div>
    );
};