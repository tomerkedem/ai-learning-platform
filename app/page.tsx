"use client";

import React, { useCallback } from 'react';
import Link from 'next/link';
import { courses } from "@/lib/courseData";
import { ArrowLeft, ArrowRight, CodeXml, Sigma, BrainCog, BookOpen, Eye } from "lucide-react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine, ISourceOptions } from "tsparticles-engine";
import { Tilt } from '@/components/ui/Tilt';
import { useT } from "@/i18n/useT";

export default function HomePage() {

  const { dir, t } = useT();

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions: ISourceOptions = {
    fullScreen: { enable: false },
    background: { color: { value: "transparent" } },
    fpsLimit: 120,
    interactivity: {
        events: { onHover: { enable: true, mode: "grab" }, resize: true },
        modes: { grab: { distance: 150, links: { opacity: 0.5, color: "#6366f1" } } },
    },
    particles: {
        color: { value: ["#4f46e5", "#60a5fa", "#a78bfa"] },
        links: { color: "#4f46e5", distance: 150, enable: true, opacity: 0.2, width: 1 },
        move: { enable: true, speed: 0.8, direction: "none", random: true, straight: false, outModes: { default: "bounce" } },
        number: { density: { enable: true, area: 800 }, value: 100 },
        opacity: { value: 0.5, random: true },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  const tiltOptions = {
    reverse: true,
    max: 15,
    perspective: 1000,
    scale: 1.02,
    speed: 1000,
    transition: true,
    axis: null,
    reset: true,
    easing: "cubic-bezier(.03,.98,.52,.99)",
  };

  const getIcon = (id: string) => {
    if (id === 'python') return <CodeXml size={32} />;
    if (id === 'behind-the-scenes-ai') return <Eye size={32} />;
    if (id.includes('math')) return <BrainCog size={32} />;
    return <Sigma size={32} />;
  };

  const getIconColor = (id: string) => {
    switch(id) {
        case 'python':
            return 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 text-yellow-300 border-yellow-400/30 shadow-[0_0_15px_rgba(250,204,21,0.3)]';
        case 'mathIntuitive':
            return 'bg-gradient-to-br from-blue-400/20 to-cyan-500/20 text-blue-300 border-blue-400/30 shadow-[0_0_15px_rgba(96,165,250,0.3)]';
        case 'mathProbabilistic':
            return 'bg-gradient-to-br from-pink-400/20 to-purple-500/20 text-pink-300 border-pink-400/30 shadow-[0_0_15px_rgba(232,121,249,0.3)]';
        case 'behind-the-scenes-ai':
            return 'bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-300 border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.3)]';
        default:
            return 'bg-gradient-to-br from-blue-400/20 to-cyan-500/20 text-blue-300 border-blue-400/30 shadow-[0_0_15px_rgba(96,165,250,0.3)]';
    }
  };

  // טקסט הכרטיסים (כותרת/תיאור) מגיע מהמילון (t.catalog.cards) לפי מזהה הלומדה.
  // כאן נשאר רק המבנה הבלתי-תלוי-שפה: מזהה, קטע הקוד וצבעו (קוד אינו ניתן לתרגום).
  const heroCards = [
    {
        id: 'python',
        snippet: `def process(data: dict) -> list[float]:
    # Modern AI Engineering
    return [0.1, 0.5, 0.9]`,
        snippetColor: "text-yellow-400"
    },
    {
        id: 'mathIntuitive',
        snippet: `# Cosine Similarity
similarity = dot(a, b) / (norm(a)*norm(b))
# Spatial Geometry`,
        snippetColor: "text-blue-400"
    },
    {
        id: 'mathProbabilistic',
        snippet: `# Gradient Descent
x = x - lr * slope(x)
# P(Spam | Words)`,
        snippetColor: "text-pink-400"
    },
    {
        id: 'behind-the-scenes-ai',
        snippet: `Input -> Tokens -> Numbers
-> Probabilities -> Decision
# Chat & Agent, exposed`,
        snippetColor: "text-cyan-400"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden" dir={dir}>
        {/* Credit Card */}
        <div className="fixed top-6 start-6 z-50 hidden md:flex animate-fade-in-down">
            <div className="group flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-[#0B1121]/60 backdrop-blur-xl border border-slate-700/50 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:border-indigo-500/50 transition-all duration-500 hover:scale-105 cursor-default">
                <div className="relative">
                     <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-lg border border-white/10">
                        תק
                     </div>
                     <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0B1121] rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[10px] text-slate-400 font-medium group-hover:text-indigo-300 transition-colors uppercase tracking-wider">{t.catalog.builtBy}</span>
                    <span className="text-sm font-black text-white tracking-wide leading-none">{t.catalog.authorName}</span>
                </div>
            </div>
        </div>

        {/* Backgrounds */}
        <div className="fixed inset-0 z-0 pointer-events-none">
             <Particles id="tsparticles" init={particlesInit} options={particlesOptions} className="absolute inset-0 h-full w-full" />
        </div>
        <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617]/80 to-[#020617]"></div>

        <main className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col items-center">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-mono text-slate-400 mb-4 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]"></span>
                    {t.catalog.badge}
                </div>
               <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-linear-to-b from-white via-indigo-100 to-slate-500 tracking-tight leading-tight">
                    {t.catalog.heroTitle}
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto italic">
                    &quot;{t.catalog.tagline}&quot;
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full relative z-20 pb-20">
                {heroCards.map((card) => {
                    const originalCourseData = courses[card.id];
                    if (!originalCourseData) return null;

                    const firstChapterHref = originalCourseData.chapters[0]?.href || '#';
                    const cardText = t.catalog.cards[card.id] ?? { title: '', description: '' };

                    return (
                        <Tilt key={card.id} options={tiltOptions} className="h-full">
                            <Link href={firstChapterHref} className="group relative h-full block">
                                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-700/50 group-hover:border-indigo-500/50 transition-all duration-300"></div>

                                <div className="relative h-full p-8 flex flex-col items-start">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-6 transition-all duration-300 ${getIconColor(card.id)} group-hover:scale-110 shadow-lg`}>
                                        {getIcon(card.id)}
                                    </div>

                                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                                        {cardText.title}
                                    </h2>

                                    {/* Code Snippet Section */}
                                    <div className="w-full bg-black/60 rounded-xl p-4 mb-6 border border-slate-800 shadow-inner group-hover:border-slate-700 transition-colors overflow-hidden">
                                        <div className="flex gap-1.5 mb-3 opacity-30">
                                            <div className="w-2 h-2 rounded-full bg-red-500" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                        </div>
                                        <pre 
                                            dir="ltr" 
                                            className={`font-mono text-[10px] sm:text-[11px] leading-relaxed tracking-tight ${card.snippetColor} opacity-90 text-left`}
                                        >
                                            {card.snippet}
                                        </pre>
                                    </div>

                                    <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                                        {cardText.description}
                                    </p>

                                    <div className="w-full pt-6 border-t border-slate-800 flex items-center justify-between">
                                        <span className="text-xs font-mono text-slate-500 flex items-center gap-2">
                                            <BookOpen size={14} />
                                            {t.catalog.chaptersCount(originalCourseData.chapters.length - 1)}
                                        </span>
                                        <span className={`flex items-center gap-2 text-sm font-bold text-white transition-transform ${dir === 'rtl' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
                                            {t.catalog.startLearning}
                                            {dir === 'rtl' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </Tilt>
                    );
                })}
            </div>
        </main>
    </div>
  );
}