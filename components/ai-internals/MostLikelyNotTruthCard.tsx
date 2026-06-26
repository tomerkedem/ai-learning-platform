"use client";

import React from 'react';
import { ShieldAlert } from 'lucide-react';

/**
 * כרטיס התובנה המרכזי של הפרק: "ההמשך המוביל אינו הוכחה".
 * גם משקל סבירות גבוה לא הופך המשך לאמת - הוא רק נראה הכי מתאים מתוך מה
 * שהמודל שקל. זהו הלקח החשוב ביותר עבור הלומד.
 */
export const MostLikelyNotTruthCard: React.FC = () => {
    return (
        <div
            className="relative overflow-hidden rounded-2xl border border-rose-500/40 bg-gradient-to-bl from-rose-500/15 to-slate-900/40 p-6 text-right shadow-[0_0_45px_-12px_rgba(251,113,133,0.45)]"
            dir="rtl"
        >
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-rose-500/10 blur-[70px]" />

            <div className="relative z-10 flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rose-400/30 bg-slate-950/60 text-rose-300">
                    <ShieldAlert size={22} />
                </span>
                <div>
                    <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400/80" dir="ltr">
                        Most likely · Not proven
                    </div>
                    <h4 className="text-xl font-black leading-tight text-white">
                        ההמשך המוביל אינו הוכחה
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">
                        גם המשך שקיבל את המשקל הגבוה ביותר אינו בהכרח אמת. זה רק אומר שהוא נראה הכי מתאים מתוך
                        ההמשכים שהמודל שקל, לפי הקלט וההקשר. משקל סבירות גבוה הוא הערכה, לא הבטחה, ולכן תשובה
                        שנשמעת בטוחה אינה ראיה לכך שהיא נכונה.
                    </p>
                </div>
            </div>
        </div>
    );
};
