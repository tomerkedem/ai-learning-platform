"use client";

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Send, Bot, Sparkles } from 'lucide-react';
import { ModeToggle } from './ModeToggle';
import { ACCENTS } from './accents';
import type { Accent, ChatMessage, FlowMode } from './types';

interface ChatInterfacePanelProps {
    title: string;
    subtitle?: string;
    mode: FlowMode;
    onModeChange: (mode: FlowMode) => void;
    messages: ChatMessage[];
    inputValue: string;
    onInputChange: (value: string) => void;
    onSend: () => void;
    /** האם להציג אינדיקטור הקלדה במקום תגובת ה-AI. */
    isTyping?: boolean;
    /** תשובת ה-AI נכתבת כרגע חי (streaming) - מוסיף סמן מהבהב לבועה. */
    streaming?: boolean;
    /** האם המנוע החי (Claude אמיתי) זמין - קובע את תווית התג Live/דמו. */
    live?: boolean;
    /** דוגמאות מהירות שמופיעות מעל הקלט. */
    suggestions?: string[];
    onSuggestion?: (text: string) => void;
    accent?: Accent;
    /** טוקן מודגש כרגע (קישור חי למנוע). */
    highlightToken?: string | null;
    /** ריחוף/נגיעה במילה בהודעת המשתמש - מדגיש את אותו טוקן במנוע. */
    onTokenHover?: (token: string | null) => void;
}

const TypingDots: React.FC<{ accent: Accent }> = ({ accent }) => {
    const a = ACCENTS[accent];
    return (
        <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${a.dot}`}
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                />
            ))}
        </div>
    );
};

/**
 * ממשק צ'אט מודרני. אחריות יחידה: תצוגת שיחה + קלט.
 * כל הנתונים מגיעים מבחוץ דרך props. אין כאן לוגיקת AI ואין תלות ב-courseData.
 */
export const ChatInterfacePanel: React.FC<ChatInterfacePanelProps> = ({
    title,
    subtitle,
    mode,
    onModeChange,
    messages,
    inputValue,
    onInputChange,
    onSend,
    isTyping = false,
    streaming = false,
    live = false,
    suggestions = [],
    onSuggestion,
    accent = 'cyan',
    highlightToken,
    onTokenHover,
}) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const scrollRef = useRef<HTMLDivElement>(null);

    // הודעת המשתמש מוצגת כמילים לחיצות (כשיש onTokenHover), כדי לקשר חי למנוע.
    const renderUserText = (text: string): React.ReactNode => {
        if (!onTokenHover) return text;
        return text.split(/(\s+)/).map((part, i) => {
            if (part === '' || /^\s+$/.test(part)) return part;
            const hl = highlightToken === part;
            return (
                <span
                    key={i}
                    onMouseEnter={() => onTokenHover(part)}
                    onMouseLeave={() => onTokenHover(null)}
                    onClick={(e) => { e.stopPropagation(); onTokenHover(hl ? null : part); }}
                    className={`cursor-pointer rounded transition-colors ${hl ? 'bg-slate-950/40 px-0.5 ring-1 ring-white/50' : 'hover:bg-slate-950/20'}`}
                >
                    {part}
                </span>
            );
        });
    };

    // גלילה אוטומטית לתחתית בכל הודעה / בזמן הקלדה.
    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
    }, [messages, isTyping, reduce]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSend();
        }
    };

    const visible = isTyping ? messages.filter((m) => m.role !== 'ai') : messages;

    return (
        <div className="relative isolate flex flex-col rounded-[2rem] border border-white/10 bg-slate-950/80 h-[640px] overflow-hidden" dir="rtl">
            {/* רקע גריד עדין + הילת פינה (המסגרת והזוהר מגיעים מ-HoloFrame) */}
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
            <div className={`pointer-events-none absolute -top-24 -right-16 -z-10 h-52 w-52 rounded-full blur-[80px] ${a.bgSoft}`} />

            {/* כותרת + מצב */}
            <div className="relative z-10 p-5 border-b border-white/10 shrink-0 space-y-3 bg-slate-900/50">
                <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                        <span className="relative flex h-2.5 w-2.5">
                            {!reduce && <span className={`absolute inline-flex h-full w-full rounded-full ${a.dot} opacity-60 animate-ping`} />}
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${a.dot}`} />
                        </span>
                        <div>
                            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500">{title}</div>
                            {subtitle && <div className="text-xs text-slate-400">{subtitle}</div>}
                        </div>
                    </div>
                    <span
                        title={live ? 'מודל אמיתי (Claude) מחובר' : 'מצב דמו: תשובות מתוסרטות, בלי מודל חי'}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-widest border ${live ? `${a.border} ${a.bgSoft} ${a.text}` : 'border-white/10 bg-slate-800/60 text-slate-400'}`}
                    >
                        <span className="relative flex h-1.5 w-1.5">
                            {!reduce && live && <span className={`absolute inline-flex h-full w-full rounded-full ${a.dot} opacity-75 animate-ping`} />}
                            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${live ? a.dot : 'bg-slate-500'}`} />
                        </span>
                        {live ? 'Live' : 'דמו'}
                    </span>
                </div>
                <ModeToggle mode={mode} onChange={onModeChange} accent={accent} />
            </div>

            {/* הודעות */}
            <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-3">
                <AnimatePresence initial={false} mode="popLayout">
                    {visible.map((m) => (
                        <motion.div
                            key={m.id}
                            layout
                            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg
                                ${m.role === 'user'
                                    ? `self-start rounded-br-md ${a.solid} ${a.solidText} ${a.glow}`
                                    : 'self-end rounded-bl-md bg-gradient-to-bl from-slate-800 to-slate-800/60 text-slate-100 border border-white/10'
                                }`}
                        >
                            {m.role === 'ai' && (
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                                    <Bot size={11} /> AI
                                </div>
                            )}
                            {m.role === 'user' ? renderUserText(m.text) : m.text}
                            {m.role === 'ai' && streaming && (
                                <motion.span
                                    aria-hidden
                                    className={`ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 rounded-sm ${a.dot}`}
                                    animate={reduce ? undefined : { opacity: [1, 0.2, 1] }}
                                    transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            )}
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            key="typing"
                            layout
                            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.3 }}
                            className="self-end rounded-2xl px-4 py-3 bg-slate-800 border border-white/10"
                        >
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1.5">
                                <Bot size={11} /> AI מקליד
                            </div>
                            <TypingDots accent={accent} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* דוגמאות מהירות */}
            {suggestions.length > 0 && (
                <div className="relative z-10 px-4 pt-3 shrink-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2">
                        <Sparkles size={11} /> נסו דוגמה
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((s) => (
                            <button
                                key={s}
                                onClick={() => onSuggestion?.(s)}
                                className="px-3 py-1.5 rounded-full text-xs bg-slate-900 border border-white/10 text-slate-300 hover:border-white/30 hover:text-white transition-colors active:scale-95"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* קלט */}
            <div className="relative z-10 p-4 shrink-0">
                <div className={`flex items-center gap-2 rounded-2xl bg-slate-900 border border-white/10 p-1.5 transition-all focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/10`}>
                    <input
                        value={inputValue}
                        onChange={(e) => onInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="כתוב הודעה..."
                        className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none"
                    />
                    <motion.button
                        onClick={onSend}
                        aria-label="Send"
                        whileHover={reduce ? undefined : { scale: 1.06 }}
                        whileTap={{ scale: 0.92 }}
                        className={`shrink-0 p-2.5 rounded-xl ${a.solid} ${a.solidText} ${a.glow}`}
                    >
                        <Send size={18} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
