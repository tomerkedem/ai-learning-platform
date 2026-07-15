"use client";

import React from 'react';
import { Terminal, Clock, Activity, Zap, Percent } from "lucide-react";
import { useT } from "@/i18n/useT";

interface CourseHeaderProps {
    chapterLable?: string;
    chapterNum: string;
    title: string;
    readTime?: string;
    isScrolled: boolean;
    scrollProgress: number;
    // מחקנו את color - הוא מיותר
    colorFrom?: string; // מצפה למחלקה מלאה: "from-indigo-500"
    colorTo?: string;   // מצפה למחלקה מלאה: "to-purple-600"
    labelColor?: string; // הצבע המדויק לטקסט (נלקח מ-courseData)
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({ 
    chapterLable, 
    chapterNum,
    title,
    readTime = "10 דקות",
    isScrolled,
    scrollProgress,
    colorFrom = "from-indigo-500", // ברירת מחדל
    colorTo = "to-purple-600",     // ברירת מחדל
    labelColor
}) => {
    const { t } = useT();

    const safeProgress = (typeof scrollProgress === 'number' && Number.isFinite(scrollProgress))
        ? Math.round(Math.max(0, Math.min(100, scrollProgress))) 
        : 0;

    // --- לוגיקת צבעים חכמה ---
    
    // 1. צבע הטקסט: אם קיבלנו labelColor נשתמש בו, אחרת נגזור אותו מ-colorFrom
    // (הופך את "from-indigo-500" ל-"text-indigo-500")
    const textColorClass = labelColor || colorFrom.replace('from-', 'text-');
    
    // 2. צבע הגבול: גוזרים אותו מ-colorFrom
    // (הופך את "from-indigo-500" ל-"border-indigo-500")
    const borderColorClass = colorFrom.replace('from-', 'border-');

    return (
        <header 
            className={`
                sticky top-0 z-40 w-full transition-all duration-500
                border-b border-amber-400/20
                ${isScrolled 
                    ? 'py-3 bg-[#0B1121]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
                    : 'py-6 bg-[#0F172A]' 
                }
            `}
        >
            {/* רקע עם אפקטים */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/20 via-[#0F172A] to-[#02040a]"></div>

            <div className="absolute inset-0 pointer-events-none opacity-60"> 
                <div 
                    className="absolute inset-0" 
                    style={{ 
                        backgroundImage: `
                            linear-gradient(to right, rgba(99, 102, 241, 0.15) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(99, 102, 241, 0.15) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px'
                    }}
                ></div>
            </div>

            {/* פס התקדמות תחתון */}
            <div className={`absolute bottom-0 left-0 w-full h-0.75 bg-slate-900/80 transition-opacity duration-300 ${safeProgress > 0 ? 'opacity-100' : 'opacity-0'}`}>
                <div 
                    className={`relative h-full bg-linear-to-r ${colorFrom} via-cyan-400 ${colorTo} shadow-[0_0_20px_currentColor] transition-all duration-100 ease-out`}
                    style={{ width: `${safeProgress}%` }} 
                >
                </div>
            </div>

            <div className="w-full h-full px-6 md:px-10 relative z-10 flex items-start justify-between">
                
                {/* צד ימין: כותרת */}
                {/* flex-1 + min-w-0 מאפשרים לכותרת לנצל את כל הרוחב הפנוי עד התקרה הרחבה (max-w-5xl),
                    כך שכותרות ארוכות לא נשברות מוקדם בדסקטופ. במובייל הקונטיינר צר יותר מהתקרה ולכן השבירה טבעית. */}
                <div className="flex flex-1 min-w-0 flex-col items-start justify-center max-w-5xl">
                    
                    {/* שורת הפרק והתווית */}
                    <div className="flex items-center gap-3 text-[11px] font-mono font-bold tracking-widest mb-2">
                        <span className={`flex items-center gap-1.5 bg-[#0F172A] px-3 py-1.5 rounded border ${borderColorClass}/40 shadow-lg shadow-indigo-900/20`}>
                            <Terminal size={12} className={textColorClass} />
                            <span className={textColorClass}>{chapterNum}</span>
                        </span>

                        {chapterLable && (
                            <span className={`${textColorClass} uppercase opacity-80`}>
                                {chapterLable}
                            </span>
                        )}
                    </div>

                    {/* גודל הכותרת קטן במובייל: כותרת פרק ארוכה (ספרדית, אנגלית) נשברה שם לשש
                        שורות וניפחה את הכותרת ל-329px, כלומר 39% ממסך של 844px. מ-sm ומעלה
                        הגדלים נשארים כשהיו. */}
                    <h1 className={`font-black text-white leading-tight transition-all duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] ${isScrolled ? 'text-lg sm:text-2xl' : 'text-xl sm:text-3xl md:text-4xl'}`}>
                        {title}
                    </h1>
                </div>

                {/* צד שמאל: נתונים */}
                <div className="flex items-center pl-2 pt-1 shrink-0">
                    <div className={`
                        relative overflow-hidden
                        flex items-center gap-4 px-6 py-3
                        rounded-xl transition-all duration-500
                        ${isScrolled 
                            ? 'bg-[#0f172a] border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                            : 'bg-[#1E293B] border border-slate-600/50 shadow-xl' 
                        }
                    `}>
                        <div className="flex flex-col items-end relative z-10">
                            <span className={`text-[10px] font-mono uppercase tracking-wider mb-0.5 whitespace-nowrap ${isScrolled ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {isScrolled ? t.chrome.header.progress : t.chrome.header.readTime}
                            </span>
                            
                            <div className="flex items-center gap-2">
                                <span className={`text-lg font-bold font-mono whitespace-nowrap transition-colors duration-300 ${isScrolled ? 'text-emerald-400' : 'text-white'}`}>
                                    {isScrolled ? safeProgress : readTime}
                                </span>
                                
                                {isScrolled ? (
                                    <Percent size={16} className="text-emerald-500" />
                                ) : (
                                    <Clock size={18} className={textColorClass} />
                                )}
                            </div>
                        </div>

                        <div className={`w-px h-10 mx-2 hidden sm:block transition-colors ${isScrolled ? 'bg-emerald-900' : 'bg-slate-600'}`}></div>

                        {isScrolled ? (
                             <Activity size={20} className="text-emerald-500" />
                        ) : (
                             <Zap size={20} className="text-amber-400 hidden sm:block drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                        )}
                    </div>
                </div>

            </div>
        </header>
    );
};