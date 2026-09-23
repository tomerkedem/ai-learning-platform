"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
    Sparkles, ChevronLeft, 
    ScanEye, Fingerprint, Activity, Binary, ArrowDown 
} from "lucide-react";
import Link from 'next/link';
import Image from 'next/image'; // 1. הוספת ייבוא לתמונה
import { motion } from "framer-motion";
import { ChapterLayout } from '@/components/ChapterLayout';

// --- רכיב ה-X-Ray ---
const XRayCard = ({ icon, term, reality, color }: { icon: React.ReactNode, term: string, reality: string, color: string }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="relative h-40 w-full cursor-pointer group perspective-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsHovered(!isHovered)}
        >
            <motion.div 
                animate={{ rotateX: isHovered ? 180 : 0, opacity: isHovered ? 0 : 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="absolute inset-0 bg-slate-900/80 border border-slate-700 rounded-2xl flex flex-col items-center justify-center p-4 shadow-xl z-20 backface-hidden"
            >
                <div className={`p-3 rounded-full bg-slate-800 text-slate-400 mb-3 group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-slate-200 tracking-wider">{term}</h3>
                <span className="text-xs text-slate-500 mt-2">רחף כדי לגלות את האמת</span>
            </motion.div>

            <motion.div 
                initial={{ rotateX: -180, opacity: 0 }}
                animate={{ rotateX: isHovered ? 0 : -180, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className={`absolute inset-0 bg-${color}-900/20 border border-${color}-500/50 rounded-2xl flex flex-col items-center justify-center p-4 shadow-[0_0_30px_rgba(0,0,0,0.3)] z-10 backdrop-blur-md`}
            >
                <h3 className={`text-lg font-bold text-${color}-400 mb-2`}>בסך הכל...</h3>
                <p className="text-center text-slate-200 text-sm font-medium leading-relaxed">
                    {reality}
                </p>
            </motion.div>
        </div>
    );
};

// --- הדגמת וקטור חיה ---
const VectorDemo = () => {
    const [word, setWord] = useState("חתול");
    
    const vectors: Record<string, number[]> = {
        "חתול": [0.9, 0.1, 0.85, 0.05],
        "כלב": [0.88, 0.12, 0.80, 0.15],
        "פיצה": [0.02, 0.95, 0.10, 0.90]
    };

    const activeVector = vectors[word] || vectors["חתול"];

    return (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col gap-6 items-center w-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <div className="flex flex-col items-center gap-4 z-10 w-full">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">הקלט האנושי</span>
                <div className="flex flex-wrap justify-center gap-2">
                    {Object.keys(vectors).map(w => (
                        <button 
                            key={w}
                            onClick={() => setWord(w)}
                            className={`px-4 py-2 rounded-lg text-sm transition-all ${word === w ? 'bg-white text-black font-bold shadow-[0_0_15px_white]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                        >
                            {w}
                        </button>
                    ))}
                </div>
                <div className="text-5xl mt-2 drop-shadow-md animate-bounce">
                    {word === "חתול" ? "🐱" : word === "כלב" ? "🐶" : "🍕"}
                </div>
            </div>

            <div className="flex flex-col items-center text-slate-600 gap-1">
                <div className="h-8 w-px bg-slate-700"></div>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Embedding</span>
                <div className="h-8 w-px bg-slate-700"></div>
                <ArrowDown size={16} />
            </div>

            <div className="w-full z-10 bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                <span className="text-xs text-slate-500 uppercase tracking-widest mb-4 block text-center">מה המודל רואה (וקטור)</span>
                
                <div className="grid grid-cols-4 gap-3 h-24 items-end px-2">
                    {activeVector.map((val, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 w-full h-full justify-end group">
                            <div className="relative w-full h-full flex items-end justify-center">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${val * 100}%` }}
                                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                                    className={`w-full rounded-md ${i % 2 === 0 ? 'bg-blue-500' : 'bg-purple-500'} opacity-80 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(59,130,246,0.3)]`}
                                ></motion.div>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">{val.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="text-[10px] text-slate-600 text-center mt-3 font-mono">
                    [ {activeVector.join(", ")} ]
                </div>
            </div>
        </div>
    );
};

export default function IntroPage() {
  return (
   <ChapterLayout courseId="mathIntuitive"currentChapterId={0}>
          
          {/* --- HERO SECTION משודרג עם תמונה --- */}
         <section className="relative min-h-[80vh] flex flex-col justify-center items-center text-center space-y-8 py-12 overflow-hidden">
  
            <div className="absolute inset-0 z-0">
                <Image 
                    src="/0a0f6cf1-3f4f-4205-b7d2-888396fd8529.png"
                    alt="AI Math Background"
                    fill
                    className="object-cover opacity-80" 
                    priority
                />
                
                {/* שינוי 2: חיזקתי את הגרדיאנט השחור מעל התמונה */}
                {/* זה מה שמאפשר לטקסט הלבן "לקפוץ" החוצה גם מעל רקע צבעוני */}
                <div className="absolute inset-0 bg-linear-to-b from-[#050B14]/90 via-[#050B14]/50 to-[#050B14]"></div>
                
                {/* Vignette חזק יותר בצדדים */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050B14_100%)]"></div>
            </div>    
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6 backdrop-blur-sm">
                    <Sparkles size={16} />
                    <span>מתמטיקה אינטואיטיבית למתכנתים</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-linear-to-b from-white via-slate-200 to-slate-500 leading-tight mb-6 drop-shadow-lg">
                    לפצח את <br/>
                    <span className="bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">הקופסה השחורה</span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                    המודלים לא עושים קסמים. הם עושים מתמטיקה. <br/>
                    והחדשות הטובות? אתה כבר מכיר את היסודות.
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-4 animate-bounce text-slate-600 z-10"
            >
                <ArrowDown size={24} />
            </motion.div>
          </section>

          {/* --- THE PROBLEM --- */}
          <section className="max-w-3xl mx-auto space-y-8 mb-24 relative">
            <div className="absolute -right-20 top-0 text-[200px] text-slate-800/10 font-black -z-10 select-none">?</div>
            
            <h2 className="text-3xl font-bold text-white border-r-4 border-blue-500 pr-6">
                מה באמת קורה מאחורי הוילון?
            </h2>
            
            <div className="prose prose-invert prose-lg text-slate-300 leading-8">
                <p>
                    כשנכנסים לעולם של בינה מלאכותית, יש רגע שבו מרגישים שכל התהליך קורה מאחורי וילון סגור.
                    המודלים מייצרים תוצאות מרשימות, אבל הדרך שבה הם מגיעים אליהן נראית <span className="text-rose-400 font-bold">מסתורית או לא נגישה</span>.
                </p>
                <p>
                    התחושה הזו לא מגיעה מקושי אמיתי, אלא מפער קטן בהבנה.
                    אנחנו רגילים לחשוב שמתמטיקה שייכת לעולם אחר, משהו רחוק, משהו שלמדנו פעם ושאין לו מקום בעבודה היומיומית.
                </p>
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700/50 shadow-inner my-8">
                    <p className="font-bold text-xl text-white mb-2">המציאות שונה לגמרי.</p>
                    <p className="text-slate-400">
                        מאחורי כל מודל עומדים כמה רעיונות פשוטים, אינטואיטיביים ומאוד שימושיים. 
                        לא צריך נוסחאות ארוכות ולא סימנים משונים. צריך רק להבין מהי השפה שהמודלים מדברים בה.
                    </p>
                </div>
            </div>
          </section>

          {/* --- X-RAY SECTION --- */}
          <section className="py-16 relative">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">תראה כמה זה פשוט</h2>
                <p className="text-slate-400">רחף עם העכבר מעל המושגים המפחידים כדי לגלות את ההיגיון הפשוט שמתחת</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                <XRayCard 
                    icon={<Binary size={32} />}
                    term="Embedding"
                    reality="סך הכל רשימה של מספרים שמייצגת משמעות."
                    color="blue"
                />
                <XRayCard 
                    icon={<Activity size={32} />}
                    term="Gradient Descent"
                    reality="לרדת במורד הגבעה בצעדים קטנים עד שמגיעים למטה."
                    color="purple"
                />
                <XRayCard 
                    icon={<ScanEye size={32} />}
                    term="Attention"
                    reality="לדעת באיזו מילה במשפט כדאי להתמקד עכשיו."
                    color="amber"
                />
                <XRayCard 
                    icon={<Fingerprint size={32} />}
                    term="Probability"
                    reality="פשוט לספור כמה פעמים משהו קרה בעבר."
                    color="emerald"
                />
             </div>
          </section>

          {/* --- THE SHIFT DEMO --- */}
          <section className="max-w-4xl mx-auto py-16 space-y-8">
             <div className="text-center">
                 <h2 className="text-3xl font-bold text-white mb-2">השינוי בתפיסה</h2>
                 <p className="text-slate-400">ברגע שהמושגים מתיישבים בראש, משהו משתנה.</p>
             </div>

             <div className="grid md:grid-cols-2 gap-12 items-center">
                 
                 <VectorDemo />

                 <div className="space-y-6 text-right">
                     <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">✕</div>
                         <div>
                             <h4 className="font-bold text-slate-300">איך ראית את זה עד היום</h4>
                             <p className="text-sm text-slate-500">טקסט הוא רצף של תווים ומילים.</p>
                         </div>
                     </div>
                     <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">✓</div>
                         <div>
                             <h4 className="font-bold text-white">איך תראה את זה מעכשיו</h4>
                             <p className="text-sm text-slate-400">טקסט הוא <span className="text-emerald-400 font-bold">וקטור</span>. נקודה במרחב שיש לה כיוון ומשמעות.</p>
                         </div>
                     </div>
                     <p className="text-sm text-slate-400 italic mt-4 border-r-2 border-slate-700 pr-4">
                         &quot;אחת המטרות של הלומדה היא להראות שכל זה מתחבר לכלים שאתה כבר מכיר בפייתון.&quot;
                     </p>
                 </div>

             </div>
          </section>

          {/* --- CTA --- */}
          <section className="py-20 text-center">
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link href="/chapter-1">
                        <Button size="lg" className="h-20 px-16 text-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-[0_0_60px_rgba(37,99,235,0.4)] border-t border-blue-400/30 group">
                            <span className="font-black tracking-wide ml-3">אני מוכן להתחיל</span>
                            <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
                                <ChevronLeft size={24} className="text-white" />
                            </div>
                        </Button>
                    </Link>
                </motion.div>
                <p className="mt-6 text-slate-500 text-sm">
                    פרק 1: למה מתמטיקה היא חלק מהעבודה?
                </p>
          </section>

    </ChapterLayout>
  );
}