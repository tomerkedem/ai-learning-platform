"use client";

import React from 'react';
import { Palette } from 'lucide-react';
import { ROLE_ORDER, ROLE_STYLE } from '@/app/behind-the-scenes-ai/chapter-3/tokenRoles';
import { useChapter3Lab } from '@/app/behind-the-scenes-ai/chapter-3/labContent';
import { useT } from '@/i18n/useT';

/**
 * Token Color Map: מקרא קבוע של כל התפקידים והצבעים. אותו צבע משמש בכל
 * התצוגות, כך שאפשר לזהות תפקיד במבט אחד. הטקסט מגיע מתוכן המעבדה (locale-aware).
 */
export const TokenColorLegend: React.FC = () => {
    const { legend, roleInfo } = useChapter3Lab();
    const { dir } = useT();
    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-start" dir={dir}>
            <div className="mb-3 flex items-center gap-2">
                <Palette size={16} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">{legend.title}</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">{legend.titleEn}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {ROLE_ORDER.map((role) => {
                    const s = ROLE_STYLE[role];
                    const info = roleInfo[role];
                    return (
                        <div key={role} className={`flex items-center gap-2 rounded-lg border ${s.border} ${s.bg} px-2 py-1.5`}>
                            <span className={`h-2 w-2 shrink-0 rounded-full ${s.dot}`} />
                            <span className="leading-tight">
                                <span className={`block text-[11px] font-bold ${s.text}`}>{info.label}</span>
                                <span className="block text-[8px] uppercase tracking-wider text-slate-500" dir="ltr">{info.en}</span>
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
