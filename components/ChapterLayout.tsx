"use client";

import React, { useState, ReactNode, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CourseHeader } from "@/components/CourseHeader";
import { CourseSidebar } from "@/components/CourseSidebar";
import { courses, type Language } from "@/lib/courseData"; 
import { ChevronRight, ChevronLeft, BookOpen, Trophy } from "lucide-react";

interface ChapterLayoutProps {
    children: ReactNode;
    courseId: string;        
    currentChapterId: number;
    lang?: Language;         
}

export const ChapterLayout: React.FC<ChapterLayoutProps> = ({ 
    children, 
    courseId,
    currentChapterId,
    lang = 'he'
}) => {
    // --- 1. Hooks & Refs ---
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // פתרון לבעיית הגלילה בפרק 16: איפוס מיקום הגלילה בכל מעבר פרק
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [currentChapterId, courseId]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        
        // עדכון מצב Scrolled לצורך עיצוב ה-Header
        if (!isScrolled && scrollTop > 50) setIsScrolled(true);
        else if (isScrolled && scrollTop < 30) setIsScrolled(false);

        // חישוב התקדמות גלילה
        const totalScroll = scrollHeight - clientHeight;
        if (totalScroll <= 0) { 
            setScrollProgress(0); 
            return; 
        }
        setScrollProgress((scrollTop / totalScroll) * 100);
    };

    // --- 2. שליפת נתונים ---
    const currentCourse = courses[courseId];
    
    if (!currentCourse) {
        return <div className="text-white p-10">Error: Course &quot;{courseId}&quot; not found.</div>;
    }

    const chapters = currentCourse.chapters;
    const chapterIndex = chapters.findIndex(c => c.id === currentChapterId);
    
    const activeChapter = chapters[chapterIndex] || {
        id: -1,
        num: `0`,
        label: { he: "", en: "" },
        title: { he: "פרק לא נמצא", en: "Chapter not found" },
        description: { he: "לא נמצא מידע.", en: "No data found." },
        readTime: "0 דקות",
        labelColor: "text-slate-400",
        colorFrom: "from-slate-400",
        colorTo: "to-slate-600",
        href: "#"
    };

    const prevChapter = chapters[chapterIndex - 1];
    const nextChapter = chapters[chapterIndex + 1];
    const isIntro = currentChapterId === 0;

    const isRTL = lang === 'he';
    const uiText = {
        next: isRTL ? "הבא" : "Next",
        prev: isRTL ? "הקודם" : "Prev",
        chapter: isRTL ? "פרק" : "Chapter",
        finishedTitle: isRTL ? "סיימת את כל הפרקים!" : "You finished every chapter!",
        finishedSub: isRTL ? "כל הכבוד — הגעת עד הסוף." : "Well done — you made it all the way through."
    };

    const chapterNumDisplay = activeChapter.id === 0 ? activeChapter.num : `${uiText.chapter} ${activeChapter.id}`;
    const chapterTitle = activeChapter.title[lang];
    const chapterDesc = activeChapter.description[lang];
    const chapterLabel = activeChapter.label[lang];

    const extractColorName = (fullClass: string) => {
        return fullClass.replace('from-', '').split('-')[0];
    };
    
    const themeColorName = extractColorName(activeChapter.colorFrom); 

    return (
        <div 
            className="flex min-h-screen bg-[#050B14] font-sans text-slate-100 selection:bg-indigo-500/30 overflow-hidden relative" 
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* --- רקע גלובלי --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                 <div className="absolute inset-0 bg-[#050B14]"></div>
                 <div className="absolute inset-0 opacity-40"> 
                    <div className="absolute inset-0" 
                        style={{ 
                            backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`,
                            backgroundSize: '40px 40px' 
                        }}
                    ></div>
                 </div>

                 <div className={`absolute top-[-20%] ${isRTL ? 'right-[-10%]' : 'left-[-10%]'} w-150 h-150 bg-${themeColorName}-500/20 blur-[120px] rounded-full mix-blend-screen animate-pulse`}></div>
                 <div className={`absolute bottom-[-20%] ${isRTL ? 'left-[-10%]' : 'right-[-10%]'} w-125 h-125 bg-${themeColorName}-600/10 blur-[100px] rounded-full mix-blend-screen`}></div>
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050B14_120%)]"></div>
            </div>

            <CourseSidebar />

            <div className="flex-1 relative h-screen flex flex-col z-10">
                
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
                    <div className="pointer-events-auto">
                        <CourseHeader 
                            chapterLable={chapterLabel}
                            labelColor={activeChapter.labelColor} 
                            chapterNum={chapterNumDisplay}
                            title={chapterTitle}
                            description={chapterDesc}
                            readTime={activeChapter.readTime}
                            isScrolled={isScrolled}
                            scrollProgress={scrollProgress}
                            colorFrom={activeChapter.colorFrom} 
                            colorTo={activeChapter.colorTo}
                        />
                    </div>
                </div>

                {/* תוכן גלילה - כאן נוסף ה-Ref המטפל באיפוס הגלילה */}
                <div 
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth"
                    onScroll={handleScroll}
                >
                    <main className={`max-w-4xl mx-auto px-8 md:px-12 pb-32 space-y-24 
                        ${isIntro ? 'pt-12' : 'pt-52 py-12'} 
                    `}>
                        
                        <div className="min-h-[50vh]">
                            {children}
                        </div>

                        {/* --- Footer ניווט --- */}
                        <div className="border-t border-slate-800/60 pt-12 mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* אחורה */}
                            {prevChapter ? (
                                <Link href={prevChapter.href || "#"} className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:bg-slate-800 hover:border-slate-700">
                                    <div className={`flex flex-col ${isRTL ? 'items-start' : 'items-end'} gap-2 relative z-10`}>
                                        <span className="text-xs font-mono text-slate-500 group-hover:text-slate-400 transition-colors flex items-center gap-2">
                                            {isRTL ? <ChevronRight size={14} /> : null} {uiText.prev} {!isRTL ? <ChevronRight size={14} /> : null}
                                        </span>
                                        <div className="font-bold text-lg text-slate-300 group-hover:text-white transition-colors">
                                            {prevChapter.title[lang]}
                                        </div>
                                    </div>
                                </Link>
                            ) : (<div></div>)}

                            {/* קדימה */}
                            {nextChapter ? (
                                (() => {
                                    const nextColor = extractColorName(nextChapter.colorFrom);
                                    return (
                                        <Link href={nextChapter.href || "#"} className={`group relative overflow-hidden rounded-2xl border border-${nextColor}-500/30 bg-${nextColor}-900/10 p-6 transition-all hover:bg-${nextColor}-900/20 hover:border-${nextColor}-500/50 ${isRTL ? 'text-right' : 'text-left'}`}>
                                            <div className={`absolute inset-0 bg-linear-to-r from-transparent via-${nextColor}-500/5 to-${nextColor}-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                            
                                            <div className={`flex flex-col ${isRTL ? 'items-start' : 'items-end'} gap-2 relative z-10`}>
                                                <span className={`text-xs font-mono font-bold text-${nextColor}-400 group-hover:text-${nextColor}-300 transition-colors flex items-center gap-2`}>
                                                    {!isRTL ? <ChevronLeft size={14} /> : null}
                                                    {uiText.next}: {uiText.chapter} {nextChapter.id} 
                                                    {isRTL ? <ChevronLeft size={14} /> : null}
                                                </span>
                                                <div className="font-bold text-xl text-white group-hover:scale-[1.02] transition-transform origin-right">
                                                    {nextChapter.title[lang]}
                                                </div>
                                                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                                                    <BookOpen size={12} />
                                                    {nextChapter.readTime}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })()
                            ) : (
                                <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-900/10 flex flex-col items-center justify-center text-center gap-2">
                                    <Trophy size={28} className="text-amber-400" />
                                    <span className="font-bold text-lg text-white">{uiText.finishedTitle}</span>
                                    <span className="text-sm text-slate-400">{uiText.finishedSub}</span>
                                </div>
                            )}

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};