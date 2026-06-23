"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Terminal, Zap, Box, Layers, ShieldCheck } from "lucide-react";
import { StaticCodeBlock } from "@/components/content/StaticCodeBlock";

// --- רכיב ה-Hook המרכזי: הכוח של פייתון כ-Leverage ---
export const AILeverageHero = () => (
    <div className="grid lg:grid-cols-2 gap-12 items-center py-16 border-b border-slate-800/50">
        <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <Zap size={14} className="fill-current" />
                <span>AI ENGINEERING LEVERAGE</span>
            </div>
            <h2 className="text-4xl font-black text-white leading-tight">
                אל תלמד רק שפה. <br />
                <span className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">תלמד לשלוט ב-Stack.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed text-right" dir="rtl">
                ב-2026, פייתון היא ה-Orchestrator של עולם ה-AI. היא לא רק &quot;שפת סקריפטים&quot;, היא הצינור שמחבר בין אלגוריתמים ב-++C, ליבות CUDA וגרפים של טריליוני פרמטרים. שליטה בה מאפשרת למפתח לחשוב ולהתנהג כארכיטקט בינה.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-center">
                    <div className="text-2xl font-black text-emerald-500">10X</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Development Velocity</div>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-center">
                    <div className="text-2xl font-black text-cyan-500">Native</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">LLM Ecosystem</div>
                </div>
            </div>
        </div>

        <div className="relative group" dir="ltr">
            <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-2xl">
                <div className="text-xs text-slate-500 font-mono mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                    <span className="ml-2">production_ai_pipeline.py</span>
                </div>
                <StaticCodeBlock
                    language="python"
                    code={`from transformers import pipeline

# Calling a trained model through a Python library
classifier = pipeline("sentiment-analysis", model="bert-base-multilingual-cased")
result = classifier("I really enjoy learning Python.")

print(f"Confidence: {result[0]['score']:.4f}")`}
                />
            </div>
        </div>
    </div>
);

// --- רכיב ה-Roadmap ההנדסי: ה-Pipeline ---
export const IndustrialRoadmap = () => {
    const steps = [
        { icon: Terminal, title: "היסודות", desc: "שליטה בתחביר לא כפקודות, אלא כבסיס לארכיטקטורה מודרנית.", phase: "01" },
        { icon: Box, title: "OOP מודרני", desc: "בניית רכיבים מודולריים (Classes) שניתן להרחיב ולתחזק ב-Production.", phase: "02" },
        { icon: Layers, title: "מנועי נתונים", desc: "עיבוד נתונים מאסיבי בזיכרון בעזרת Numpy ו-Vectorization.", phase: "03" },
        { icon: ShieldCheck, title: "מוכן ל-Production", desc: "חיבור למודלים, ניהול תלויות וארכיטקטורת שכבות מתקדמת.", phase: "04" },
    ];

    return (
        <div className="relative mt-4">
            {/* פס החיבור שמשדר את רעיון ה-Pipeline (md ומעלה) */}
            <motion.div
                aria-hidden
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="hidden md:block absolute top-[4.75rem] inset-x-6 h-px origin-right bg-linear-to-l from-emerald-500/0 via-emerald-500/40 to-emerald-500/0"
            />

            <div className="grid md:grid-cols-4 gap-6">
                {steps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 26 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -6 }}
                        className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl transition-colors duration-300 hover:border-emerald-500/40 hover:bg-slate-900/70"
                    >
                        {/* זוהר רקע ב-hover */}
                        <div className="pointer-events-none absolute -inset-px rounded-3xl bg-linear-to-b from-emerald-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {/* מספר-רפאים ענק */}
                        <span className="pointer-events-none absolute -top-4 left-3 select-none font-mono text-7xl font-black leading-none text-white/[0.03] transition-colors duration-300 group-hover:text-emerald-500/[0.07]">
                            {step.phase}
                        </span>

                        <div className="relative">
                            <div className="mb-5 text-[10px] font-mono tracking-widest text-emerald-500/70">
                                שלב {step.phase}
                            </div>

                            {/* אריח האייקון שמאיר בגרדיאנט */}
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800/80 text-slate-300 shadow-inner transition-all duration-300 group-hover:border-transparent group-hover:bg-linear-to-br group-hover:from-emerald-500 group-hover:to-cyan-500 group-hover:text-slate-950">
                                <step.icon size={26} />
                            </div>

                            <h4 className="mb-2 text-right font-bold text-white" dir="rtl">{step.title}</h4>
                            <p className="text-right text-xs leading-relaxed text-slate-500 transition-colors duration-300 group-hover:text-slate-400" dir="rtl">{step.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};