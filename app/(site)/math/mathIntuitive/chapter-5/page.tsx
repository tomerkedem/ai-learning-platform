"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { 
    ChevronLeft, Brain, ScanFace, FileText, UserCircle, MoveRight, 
    Layers, Sparkles, Code, Hash, Palette, Lightbulb, 
    MousePointer2, Monitor, Cat, Sandwich, RefreshCw, Check, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

// שינוי: ייבוא המעטפת החדשה במקום הרכיבים הנפרדים
import { ChapterLayout } from "@/components/ChapterLayout";

// --- רכיבים פנימיים (המעבדות) ---
// (הקוד של המעבדות נשאר זהה לחלוטין לקוד המקורי שלך)

// 1. המעבדה החדשה: איך אובייקט הופך לוקטור?
const ObjectToVectorLab = () => {
    const [activeTab, setActiveTab] = useState<'image' | 'text' | 'user'>('text');

    return (
        <div className="bg-[#0b1120] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl my-10 relative z-10">
            {/* Header / Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/50">
                <button 
                    onClick={() => setActiveTab('image')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'image' ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Palette size={16} /> תמונה (פיקסלים)
                </button>
                <button 
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'text' ? 'bg-purple-600/10 text-purple-400 border-b-2 border-purple-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <FileText size={16} /> טקסט (משמעות)
                </button>
                <button 
                    onClick={() => setActiveTab('user')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'user' ? 'bg-emerald-600/10 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <UserCircle size={16} /> משתמש (התנהגות)
                </button>
            </div>

            {/* Content Area */}
            <div className="p-6 min-h-112.5">
                <AnimatePresence mode="wait">
                    {activeTab === 'image' && <ImageVectorDemo key="image" />}
                    {activeTab === 'text' && <TextVectorDemo key="text" />}
                    {activeTab === 'user' && <UserVectorDemo key="user" />}
                </AnimatePresence>
            </div>
        </div>
    );
};

// --- תת-רכיב 1: הדגמת תמונה (Pixel Grid) ---
const ImageVectorDemo = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const grid = [
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 0, 1, 1, 0,
        0, 1, 1, 1, 1, 1, 1, 1,
        0, 1, 1, 1, 1, 1, 1, 1,
        0, 0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col md:flex-row gap-8 items-start h-full">
            <div className="flex-1 space-y-4 w-full">
                <h3 className="text-xl font-bold text-white">1. המקור: תמונה</h3>
                <p className="text-slate-400 text-sm">
                    למודל אין מושג מה זה &quot;אדום&quot; או &quot;לב&quot;. כל פיקסל הופך למספר מ-0 (שחור) ל-255 (לבן/צבע מלא).
                    <br/><span className="text-blue-400 font-bold block mt-2">👇 נסה לרחף עם העכבר על הפיקסלים בציור:</span>
                </p>
                
                <div className="grid grid-cols-8 gap-1 w-64 h-64 bg-black p-1 border border-slate-700 mx-auto md:mx-0 shadow-2xl">
                    {grid.map((val, i) => (
                        <div 
                            key={i}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={`
                                rounded-sm cursor-crosshair transition-all duration-200
                                ${val === 1 ? 'bg-slate-200' : 'bg-slate-800'}
                                ${hoveredIndex === i ? 'ring-2 ring-blue-500 scale-125 z-10 shadow-lg' : ''}
                            `}
                        />
                    ))}
                </div>
            </div>

            <div className="flex-1 space-y-4 w-full h-full flex flex-col">
                <h3 className="text-xl font-bold text-white">2. התרגום: הוקטור</h3>
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl relative overflow-hidden flex-1 flex flex-col justify-center">
                    <div className="flex justify-between text-xs text-slate-500 font-mono mb-4 uppercase tracking-wider">
                        <span>Value (0-255)</span>
                        <span>Pixel Index</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-8">
                        <div className="text-6xl font-mono font-bold text-blue-500 drop-shadow-lg">
                            {hoveredIndex !== null ? (grid[hoveredIndex] * 255) : "-"}
                        </div>
                        <div className="text-6xl font-mono font-bold text-slate-700">
                            {hoveredIndex !== null ? hoveredIndex : "-"}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-900">
                        <p className="text-xs text-slate-500 mb-2">כך המחשב &quot;רואה&quot; את התמונה (רשימה שטוחה):</p>
                        <div className="font-mono text-xs text-slate-400 break-all bg-black/40 p-3 rounded border border-slate-900 leading-relaxed">
                            vector = [<br/> 
                            {grid.map((v, i) => (
                                <span key={i} className={`inline-block mx-0.5 transition-colors duration-200 ${hoveredIndex === i ? "text-blue-400 font-bold bg-blue-900/30 px-1 rounded transform scale-110" : "opacity-50"}`}>
                                    {v * 255}, 
                                </span>
                            ))} ... ]
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- תת-רכיב 2: הדגמת טקסט ---
const TextVectorDemo = () => {
    const [selectedWord, setSelectedWord] = useState('cat');

    const words = {
        cat: { label: "חתול", icon: <Cat/>, scores: { animal: 0.99, tech: 0.05, food: 0.01, fluffy: 0.95 } },
        laptop: { label: "לפטופ", icon: <Monitor/>, scores: { animal: 0.01, tech: 0.99, food: 0.01, fluffy: 0.05 } },
        burger: { label: "המבורגר", icon: <Sandwich/>, scores: { animal: 0.1, tech: 0.01, food: 0.99, fluffy: 0.2 } },
    };

    const current = words[selectedWord as keyof typeof words];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8 h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">1. המקור: מילים</h3>
                    <p className="text-slate-400 text-sm max-w-lg">
                        מילים הופכות למספרים שמייצגים <strong>משמעות</strong>. שימו לב: המספרים כאן הם לא אקראיים, הם מייצגים &quot;תכונות&quot; סמויות.
                    </p>
                </div>
                <div className="flex gap-3">
                    {Object.entries(words).map(([key, data]) => (
                        <button 
                            key={key}
                            onClick={() => setSelectedWord(key)}
                            className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl border transition-all ${selectedWord === key ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-600'}`}
                        >
                            <span className="text-xl">{data.icon}</span>
                            <span className="text-xs font-bold">{data.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-12 items-center flex-1">
                <div className="flex-1 w-full space-y-5">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-right">ניתוח וקטור סמנטי</h4>
                    
                    {Object.entries(current.scores).map(([trait, value]) => (
                        <div key={trait}>
                            <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
                                <span>{trait === 'animal' ? 'חיה' : trait === 'tech' ? 'טכנולוגיה' : trait === 'food' ? 'אוכל' : 'שומני/רך'}</span>
                                <span>{value}</span>
                            </div>
                            <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${value * 100}%` }}
                                    transition={{ duration: 0.5, type: "spring" }}
                                    className={`h-full ${value > 0.8 ? 'bg-emerald-500' : value > 0.4 ? 'bg-yellow-500' : 'bg-slate-600'}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hidden md:block w-px h-40 bg-slate-800"></div>

                <div className="bg-black/60 p-6 rounded-xl border border-slate-800 font-mono text-sm text-center min-w-75 shadow-2xl">
                    <div className="text-[10px] text-slate-500 mb-4 uppercase tracking-widest">הוקטור הסופי (Embedding)</div>
                    <div className="text-purple-400 tracking-wider text-lg">
                        [ {Object.values(current.scores).join(', ')} ]
                    </div>
                    <p className="text-xs text-slate-600 mt-4">
                        המודל משתמש בוקטור הזה כדי לחשב מרחק לוקטורים של מילים אחרות.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

// --- תת-רכיב 3: הדגמת משתמש ---
const UserVectorDemo = () => {
    const [stats, setStats] = useState({ visits: 12, time: 4.5, purchases: 1 });

    const randomize = () => {
        setStats({
            visits: Math.floor(Math.random() * 50),
            time: Number((Math.random() * 10).toFixed(1)),
            purchases: Math.floor(Math.random() * 5)
        });
    };

    const vector = [
        (stats.visits / 50).toFixed(2),
        (stats.time / 10).toFixed(2),
        (stats.purchases / 5).toFixed(2),
        "0.85", 
        "0.02"
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col md:flex-row gap-12 items-center h-full pt-4">
            
            <div className="flex-1 space-y-6 w-full">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">1. המקור: פרופיל משתמש</h3>
                    <Button onClick={randomize} size="sm" variant="outline" className="gap-2 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300">
                        <RefreshCw size={14} /> שנה נתונים אקראית
                    </Button>
                </div>
                
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                        <span className="text-slate-400">כניסות לאפליקציה (שבועי)</span>
                        <span className="text-emerald-400 font-mono font-bold text-xl">{stats.visits}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                        <span className="text-slate-400">זמן ממוצע (דקות)</span>
                        <span className="text-emerald-400 font-mono font-bold text-xl">{stats.time}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                        <span className="text-slate-400">רכישות בחודש</span>
                        <span className="text-emerald-400 font-mono font-bold text-xl">{stats.purchases}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">אחוז צפייה בוידאו</span>
                        <span className="text-emerald-400 font-mono font-bold text-xl">85%</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center text-slate-700">
                <MoveRight size={48} className="hidden md:block" />
                <div className="md:hidden">⬇</div>
            </div>

            <div className="flex-1 w-full">
                <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 font-mono text-sm relative shadow-2xl group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-500 to-teal-400"></div>
                    <div className="text-slate-500 mb-4 flex justify-between">
                        <span># Python Vector Representation</span>
                        <Code size={14}/>
                    </div>
                    
                    <div className="space-y-2 bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
                        <div className="flex justify-between text-emerald-400">
                            <span>user_vec = [</span>
                        </div>
                        <div className="pl-4 space-y-1 text-slate-300">
                            <div className="flex justify-between group-hover:bg-slate-800/50 rounded px-1"><span>{vector[0]},</span> <span className="text-slate-600">{"// visits"}</span></div>
                            <div className="flex justify-between group-hover:bg-slate-800/50 rounded px-1"><span>{vector[1]},</span> <span className="text-slate-600">{"// avg_time"}</span></div>
                            <div className="flex justify-between group-hover:bg-slate-800/50 rounded px-1"><span>{vector[2]},</span> <span className="text-slate-600">{"// purchases"}</span></div>
                            <div className="flex justify-between group-hover:bg-slate-800/50 rounded px-1"><span>{vector[3]},</span> <span className="text-slate-600">{"// engagement"}</span></div>
                            <div className="flex justify-between group-hover:bg-slate-800/50 rounded px-1"><span>{vector[4]}</span> <span className="text-slate-600">{"// churn_risk"}</span></div>
                        </div>
                        <div className="text-emerald-400">]</div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-900 text-[10px] text-slate-500 text-center">
                        ככה נטפליקס וספוטיפיי &quot;רואות&quot; אותך. 
                    </div>
                </div>
            </div>

        </motion.div>
    );
};

// --- מעבדה 2: החץ הגיאומטרי (וקטור במרחב) ---
const VectorPlayground = () => {
    const [vector, setVector] = useState({ x: 3, y: 2 });
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const updateVector = (clientX: number, clientY: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const scale = 30;
        
        let newX = (clientX - rect.left - centerX) / scale;
        let newY = -(clientY - rect.top - centerY) / scale;

        newX = Math.round(newX * 10) / 10;
        newY = Math.round(newY * 10) / 10;

        newX = Math.max(-5, Math.min(5, newX));
        newY = Math.max(-3, Math.min(3, newY));

        setVector({ x: newX, y: newY });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        updateVector(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) updateVector(e.clientX, e.clientY);
    };

    const handleMouseUp = () => setIsDragging(false);

    return (
        <div className="flex flex-col md:flex-row gap-6 my-12 items-stretch select-none relative z-10" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            
            {/* Graph */}
            <div 
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 relative min-h-87.5 flex items-center justify-center cursor-crosshair overflow-hidden group shadow-inner"
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
            >
                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                     style={{ 
                         backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', 
                         backgroundSize: '30px 30px',
                         backgroundPosition: 'center center'
                     }}>
                </div>

                <div className="absolute w-full h-0.5 bg-slate-700 top-1/2 left-0"></div>
                <div className="absolute h-full w-0.5 bg-slate-700 left-1/2 top-0"></div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                        </marker>
                    </defs>
                    <line 
                        x1="50%" y1="50%" 
                        x2={`calc(50% + ${vector.x * 30}px)`} 
                        y2={`calc(50% - ${vector.y * 30}px)`} 
                        stroke="#3b82f6" strokeWidth="4" markerEnd="url(#arrowhead)" 
                        className="drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                    />
                </svg>

                <div 
                    className="absolute w-6 h-6 bg-white rounded-full shadow-[0_0_20px_rgba(59,130,246,1)] border-4 border-blue-500 z-10 transform -translate-x-1/2 -translate-y-1/2 transition-transform active:scale-125"
                    style={{ left: `calc(50% + ${vector.x * 30}px)`, top: `calc(50% - ${vector.y * 30}px)` }}
                />

                <div className="absolute top-4 right-4 text-xs text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-full border border-slate-700 flex items-center gap-2 pointer-events-none">
                    <MousePointer2 size={12} className="text-blue-400"/> לחץ וגרור לשליטה
                </div>
            </div>

            {/* Code */}
            <div className="w-full md:w-80 bg-[#0d1117] border border-slate-800 rounded-xl p-6 flex flex-col justify-center relative shadow-2xl">
                <div className="absolute top-0 left-0 px-3 py-1 bg-slate-800 text-[10px] text-slate-400 rounded-br-lg font-mono flex items-center gap-2" dir="ltr">
                    <Code size={12}/> Python Representation
                </div>
                
                <div className="font-mono text-sm leading-loose mt-4" dir="ltr">
                    <span className="text-slate-500"># 1. ייבוא NumPy</span><br/>
                    <span className="text-purple-400">import</span> numpy <span className="text-purple-400">as</span> np<br/><br/>
                    
                    <span className="text-slate-500"># 2. יצירת הוקטור</span><br/>
                    <span className="text-blue-300">my_vector</span> = np.array([<br/>
                    &nbsp;&nbsp;<span className="text-yellow-400 font-bold">{vector.x.toFixed(1)}</span>, <span className="text-slate-500"># X coordinate</span><br/>
                    &nbsp;&nbsp;<span className="text-yellow-400 font-bold">{vector.y.toFixed(1)}</span> &nbsp;<span className="text-slate-500"># Y coordinate</span><br/>
                    ])
                </div>

                <div className="mt-auto pt-6 border-t border-slate-800">
                    <p className="text-xs text-slate-400 text-center">
                        המספרים משתנים בזמן אמת.<br/>כך המחשב &quot;רואה&quot; כיוון ועוצמה.
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- מעבדה 3: סמנטיקה (גרירת מילים מתוקנת) ---
const SemanticPlayground = () => {
    // אנו נשתמש במצב (State) כדי לשמור את המיקום
    // ונשתמש ב-event handlers רגילים של React במקום ב-motion drag כדי להבטיח סנכרון מושלם
    const [positions, setPositions] = useState<Record<string, {x: number, y: number}>>({
        dog: { x: 50, y: 50 },
        cat: { x: 150, y: 80 },
        car: { x: 300, y: 200 },
        bike: { x: 400, y: 150 }
    });

    const [draggingId, setDraggingId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handlePointerDown = (id: string, e: React.PointerEvent) => {
        e.preventDefault();
        setDraggingId(id);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!draggingId || !containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        
        // חישוב מיקום יחסי בתוך הקונטיינר
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        // גבולות (כדי שלא יצא מהקופסה)
        x = Math.max(0, Math.min(rect.width - 80, x));
        y = Math.max(0, Math.min(rect.height - 40, y));

        setPositions(prev => ({
            ...prev,
            [draggingId]: { x, y }
        }));
    };

    const handlePointerUp = () => {
        setDraggingId(null);
    };

    const getDistance = (p1: {x:number, y:number}, p2: {x:number, y:number}) => {
        const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        return (dist / 50).toFixed(2); 
    };

    return (
        <div className="my-12 relative z-10" onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Brain className="text-purple-400" /> המשימה שלך: סדר את המילים
            </h3>
            <p className="text-slate-400 text-sm mb-6">
                גרור את המילים בגרף. נסה לקרב את החיות אחת לשנייה, ואת כלי הרכב אחד לשני.
                שים לב איך ה&quot;מרחק הסמנטי&quot; למטה משתנה.
            </p>

            <div 
                ref={containerRef}
                onPointerMove={handlePointerMove}
                className="relative w-full h-100 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner touch-none cursor-crosshair"
            >
                {/* רקע נקודות מובלט */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-slate-900/50 to-slate-950"></div>
                <div 
                    className="absolute inset-0 opacity-40 pointer-events-none" 
                    style={{ 
                        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
                        backgroundSize: '24px 24px' 
                    }}
                ></div>

                {/* קווים מחברים (מתעדכנים בזמן אמת כי הם מבוססים על אותו State) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <line x1={positions.dog.x + 40} y1={positions.dog.y + 20} x2={positions.cat.x + 40} y2={positions.cat.y + 20} stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
                    <line x1={positions.car.x + 40} y1={positions.car.y + 20} x2={positions.bike.x + 40} y2={positions.bike.y + 20} stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
                </svg>

                {/* מילים נגררות */}
                {Object.entries(positions).map(([key, pos]) => (
                    <div
                        key={key}
                        onPointerDown={(e) => handlePointerDown(key, e)}
                        style={{ 
                            left: pos.x, 
                            top: pos.y,
                            position: 'absolute',
                            cursor: 'grab',
                            touchAction: 'none'
                        }}
                        className={`
                            px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg z-10 flex items-center gap-2 select-none transition-shadow
                            ${key === 'dog' || key === 'cat' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'}
                            ${draggingId === key ? 'scale-110 shadow-2xl ring-2 ring-white cursor-grabbing z-50' : ''}
                        `}
                    >
                        {key === 'dog' && '🐶 כלב'}
                        {key === 'cat' && '🐱 חתול'}
                        {key === 'car' && '🚗 מכונית'}
                        {key === 'bike' && '🚲 אופניים'}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                    <div className="text-xs text-slate-500 mb-1">מרחק חיות (Semantic Distance)</div>
                    <div className="text-2xl font-mono font-bold text-emerald-400">
                        {getDistance(positions.dog, positions.cat)}
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                    <div className="text-xs text-slate-500 mb-1">מרחק רכבים (Semantic Distance)</div>
                    <div className="text-2xl font-mono font-bold text-orange-400">
                        {getDistance(positions.car, positions.bike)}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- העמוד הראשי (Refactored) ---

export default function ChapterFive() {
  return (
   
          
            <ChapterLayout courseId="mathIntuitive" currentChapterId={5}>
        
            {/* סעיף 1: איך אובייקט הופך לוקטור */}
            <section id="part-1" className="scroll-mt-24 mb-8">
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Hash size={20} /></div>
                        <h2 className="text-2xl font-bold text-white">1. איך מציגים אובייקט כסדרה של מספרים?</h2>
                    </div>
                    
                    <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none space-y-6">
                        <p>
                            אם יש משהו אחד שבאמת משנה את הדרך שבה מפתח מבין AI, זה הרעיון שכל אובייקט בעולם – טקסט, תמונה, משתמש, מוצר, אירוע – יכול להפוך לוקטור.
                            זאת אומרת: <strong>רשימה מסודרת של מספרים.</strong>
                        </p>
                        <p>
                            כדי להבין מודלים מודרניים, צריך להבין את המשפט הבא:
                            <strong>AI לא עובד על תוכן. הוא עובד על מספרים שמייצגים תוכן.</strong>
                            וזה בדיוק מה שנותן לוקטורים את הכוח שלהם.
                        </p>
                        
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 my-4">
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                <Lightbulb size={18} className="text-yellow-400"/> מה זה בכלל וקטור?
                            </h4>
                            <p className="text-slate-400 text-sm">
                                זה פשוט מאוד. וקטור הוא רשימה של מספרים. לא מטריצה, לא אובייקט מסובך. רשימה.
                                <br/>
                                <code className="bg-slate-800 px-1 rounded text-purple-300">[0.2, 1.7, 3.4]</code>
                            </p>
                        </div>

                        <p>
                            <strong>איך זה קורה בפועל?</strong> אפשר לחשוב על זה כעל תרגום.
                            אובייקט מגיע מבחוץ – תמונה, מילה, משתמש – והמודל ממיר את התכונות החשובות שלו למספרים.
                        </p>
                    </div>
                </div>

                {/* מעבדת הוקטורים החדשה */}
                <ObjectToVectorLab />

                <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none mt-8 space-y-4">
                    <h4 className="text-xl font-bold text-white">סיכום הדוגמאות:</h4>
                    <ul className="list-disc pr-6 space-y-2">
                        <li><strong>פיקסל:</strong> למודל אין מושג מה זה &quot;אדום&quot;. הוא מקבל מספרים מ-0 עד 255 שמייצגים עוצמה של צבע.</li>
                        <li><strong>מילה:</strong> &quot;המבורגר&quot; הופך לרשימת מספרים שלא מייצגת אותיות, אלא משמעות (אוכל, שומן, טעם).</li>
                        <li><strong>משתמש:</strong> המודל לא מכיר את &quot;יוסי&quot;. הוא מכיר וקטור שמייצג דפוסי התנהגות (שעות כניסה, סוגי קליקים).</li>
                    </ul>
                </div>
            </section>

            {/* סעיף 2: גיאומטריה ודמיון */}
            <section id="part-2" className="scroll-mt-24 mb-8">
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Layers size={20} /></div>
                        <h2 className="text-2xl font-bold text-white">2. למה כמעט כל AI עובד על וקטורים?</h2>
                    </div>
                    
                    <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none space-y-4 mb-8">
                        <p>
                            אחרי שהבנו שוקטור הוא רשימת מספרים, עולה השאלה: למה דווקא וקטורים?
                            יש לזה סיבות עמוקות שמחברות בין מתמטיקה, יעילות, והדרך שבה מודלים לומדים דפוסים.
                        </p>
                        <p>
                            הסיבה החשובה ביותר היא <strong>מדידת דמיון</strong>.
                            כדי שמודל יבין ש&quot;חתול&quot; ו&quot;גור&quot; קרובים, הוא צריך למדוד מרחק. וקטור מאפשר לעשות בדיוק את זה.
                        </p>
                    </div>

                    {/* מעבדת החץ הגיאומטרי */}
                    <VectorPlayground />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                <Sparkles size={16} className="text-yellow-400"/> מתמטיקה מהירה
                            </h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                מעבדים מודרניים (GPU) בנויים לטחון וקטורים. הם יכולים לבצע מיליארדי פעולות כפל וחיבור בשנייה על רשימות כאלה.
                            </p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                <Brain size={16} className="text-purple-400"/> למידת תכונות
                            </h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                המודל &quot;לומד&quot; לבד את המספרים בוקטור. המספרים האלה מייצגים תכונות עמוקות שהמודל זיהה בדאטה.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* סעיף 3: המרחב הסמנטי */}
            <section id="part-3" className="scroll-mt-24 mb-8">
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Brain size={20} /></div>
                        <h2 className="text-2xl font-bold text-white">3. הוקטור כמשמעות (Semantic Space)</h2>
                    </div>
                    <div className="prose prose-invert text-slate-400 text-base leading-relaxed max-w-none">
                        <p>
                            הקסם האמיתי קורה כשהמודל לומד לסדר את הוקטורים במרחב לפי המשמעות שלהם.
                            מילים בעלות משמעות דומה יקבלו וקטורים קרובים מתמטית.
                        </p>
                        <p>
                            במרחב הזה, המרחק בין &quot;מלך&quot; ל&quot;מלכה&quot; הוא קטן מאוד, והמרחק בינם לבין &quot;המבורגר&quot; הוא עצום.
                            המודל לא מבין עברית – הוא מבין גיאומטריה.
                        </p>
                    </div>
                </div>

                {/* מעבדת גרירת מילים */}
                <SemanticPlayground />
                
                <div className="mt-6 bg-slate-950 p-4 rounded-lg border border-slate-800 text-sm text-slate-400">
                    <strong>למה זה חשוב?</strong> ככה בדיוק עובדים מודלי שפה (כמו GPT). הם לא &quot;קוראים&quot;. הם מחשבים איזה וקטור הכי קרוב לוקטור הנוכחי במרחב הסמנטי כדי לנחש את המילה הבאה.
                </div>
            </section>

            {/* סעיף 4: תהליך ההמרה בפועל */}
            <section id="part-4" className="scroll-mt-24 bg-slate-900/40 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800"><ScanFace className="text-yellow-400" size={20} /></div>
                        <h2 className="text-2xl font-bold text-white">4. סיכום: הכל זה מספרים</h2>
                    </div>
                    
                    <div className="prose prose-invert text-slate-400 text-sm leading-relaxed max-w-none mb-4">
                        <p>
                            זה היופי. כיוון שהכול מתורגם לוקטורים, מודלים יכולים לעבוד על סוגים שונים של מידע באותה לוגיקה בדיוק.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ProcessCard 
                            title="טקסט (NLP)" 
                            desc="כל מילה מקבלת וקטור. מילים בהקשר דומה (כמו 'לקוח' ו'משתמש') יקבלו מספרים דומים." 
                            icon={<FileText size={18}/>}
                            color="blue" 
                        />
                        <ProcessCard 
                            title="תמונה (CV)" 
                            desc="המודל סורק צבעים וצורות, וממיר אותם לרשימת מאפיינים שמייצגת 'מה יש בתמונה'." 
                            icon={<Palette size={18}/>}
                            color="purple" 
                        />
                        <ProcessCard 
                            title="משתמש (User)" 
                            desc="היסטוריית הפעולות הופכת לוקטור התנהגות. זה מה שמאפשר לנטפליקס להמליץ לך על סרטים." 
                            icon={<UserCircle size={18}/>}
                            color="emerald" 
                        />
                    </div>
                </div>
            </section>

            {/* Quiz */}
            <section id="quiz" className="mt-16 pt-8 border-t border-slate-800">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">בדיקת הבנה: סיכום פרק 5</h2>
                    <p className="text-slate-400 text-sm">האם הבנת איך העולם הופך למספרים?</p>
                </div>
                <ChapterFiveQuiz />
            </section>
        
       
    </ChapterLayout>
    
  );
}


// --- קומפוננטות עזר (לכרטיסים ולחידון) ---

interface ProcessCardProps {
    title: string;
    desc: string;
    color: string;
    icon: React.ReactNode;
}

function ProcessCard({ title, desc, color, icon }: ProcessCardProps) {
    const colors: Record<string, string> = {
        blue: "border-blue-500/30 bg-blue-500/10 text-blue-400",
        purple: "border-purple-500/30 bg-purple-500/10 text-purple-400",
        emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    };

    return (
        <div className={`p-5 rounded-xl border ${colors[color]} relative group hover:scale-[1.02] transition-transform`}>
            <div className="flex items-center gap-2 mb-3">
                {icon}
                <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{desc}</p>
        </div>
    )
}

function ChapterFiveQuiz() {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    
    const questions = [
        {
            id: 1,
            text: "מהו וקטור בהקשר של AI?",
            options: [
                { id: 1, text: "חץ שמצביע לכיוון מסוים" },
                { id: 2, text: "רשימה מסודרת של מספרים שמייצגת אובייקט", correct: true },
                { id: 3, text: "סוג של וירוס מחשב" }
            ]
        },
        {
            id: 2,
            text: "למה משתמשים בוקטורים לייצוג מילים?",
            options: [
                { id: 1, text: "כדי לאפשר חישוב מתמטי של דמיון ומשמעות", correct: true },
                { id: 2, text: "כי זה חוסך מקום בזיכרון" },
                { id: 3, text: "כדי להצפין את המידע" }
            ]
        },
        {
            id: 3,
            text: "מה קורה לוקטורים של מילים דומות (כמו 'כלב' ו'חתול')?",
            options: [
                { id: 1, text: "הם יהיו רחוקים מאוד זה מזה" },
                { id: 2, text: "הם יהיו קרובים במרחב הוקטורי", correct: true },
                { id: 3, text: "הם יהיו זהים לחלוטין" }
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
                        <Link href="/chapter-6">
                            <Button size="lg" className="h-14 px-10 text-base bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-[0_0_40px_rgba(37,99,235,0.5)] border-t border-blue-400/30 hover:scale-105 transition-transform">
                                <span className="font-bold">המשך לפרק 6: מרחקים</span> <ChevronLeft className="mr-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}