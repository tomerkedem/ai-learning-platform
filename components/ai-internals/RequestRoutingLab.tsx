"use client";

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Compass } from 'lucide-react';

import { RequestExampleSelector } from './RequestExampleSelector';
import { DecisionSignalsPanel } from './DecisionSignalsPanel';
import { IntentShiftStrip } from './IntentShiftStrip';
import { RequestTypeDetector } from './RequestTypeDetector';
import { RouteSwitchboard } from './RouteSwitchboard';
import { RiskMeter } from './RiskMeter';
import { MissingInfoSpotlight } from './MissingInfoSpotlight';
import { DecisionCard } from './DecisionCard';
import { StickyContextBar, type ContextTone } from './StickyContextBar';
import { ACCENTS } from './accents';
import { DUR, EASE } from './motionTokens';
import type { RouteKind, RoutingExample } from './types';

interface RequestRoutingLabProps {
    examples: RoutingExample[];
    defaultId?: string;
}

// טקסטי הסבר לימודיים קצרים, קבועים לכל אזור (לא תלויי בחירה).
// מיפוי מסלול → טון ההחלטה לפס ההקשר הדביק, ותווית אנגלית קצרה.
const ROUTE_TONE: Record<RouteKind, ContextTone> = {
    answer: 'go',
    tool: 'go',
    ask: 'caution',
    stop: 'stop',
};
const ROUTE_EN: Record<RouteKind, string> = {
    answer: 'Answer',
    tool: 'Prepare tool',
    ask: 'Ask for info',
    stop: 'Stop for approval',
};

const HELPERS = {
    intentShift: 'זהו שינוי הכוונה. המילים בפרומט הן הרמזים הראשונים: האם המשתמש שואל, מבקש בדיקה, או מבקש פעולה?',
    detector: 'כאן המנוע מנסה להבין איזה סוג בקשה עומדת מולו. הוא לא בודק עדיין את החבילה עצמה, אלא רק מסווג את הפרומט: שאלה כללית, בדיקה ספציפית או בקשת פעולה.',
    switchboard: 'אחרי שהמנוע מבין את סוג הבקשה, הוא בוחר לאיזה מסלול לשלוח אותה. לפעמים נכון לענות מיד, לפעמים צריך לבקש מידע, לפעמים אפשר להתכונן לשימוש בכלי, ולפעמים חובה לעצור לפני פעולה.',
    risk: 'ככל שהבקשה מתקרבת לפעולה בעולם האמיתי, רמת האחריות עולה. שאלה כללית היא סיכון נמוך, בדיקת מידע ספציפי דורשת זהירות, ופעולה מול לקוח דורשת אימות ואישור.',
    missing: 'חסר ברקוד לא אומר שה-Agent נתקע. זה אומר שהוא זיהה שאי אפשר לבצע בדיקה אמיתית בלי מזהה. Agent טוב לא ממציא נתונים, הוא מבקש את מה שחסר.',
    signals: 'המנוע לא בוחר מסלול במקרה. הוא קורא את הפרומט ומחפש רמזים: מילת שאלה, בקשת בדיקה, פעולה, מידע חסר או סיכון.',
};

/**
 * מעבדת ניתוב בקשות (Request Routing Lab) - מיכל הפרק.
 * אחריות יחידה: מחזיק את הבחירה הנוכחית ומרכיב את אזורי הלוח.
 * כל הנתונים מגיעים מבחוץ ב-props; אין כאן לוגיקת מנוע או courseData.
 */
export const RequestRoutingLab: React.FC<RequestRoutingLabProps> = ({ examples, defaultId }) => {
    const reduce = useReducedMotion();
    const [selectedId, setSelectedId] = useState(defaultId ?? examples[0]?.id);

    const current = useMemo(
        () => examples.find((ex) => ex.id === selectedId) ?? examples[0],
        [examples, selectedId],
    );

    if (!current) return null;

    // מפתח מדורג ממוקד: רק לוח הרמזים (DecisionSignalsPanel) משחזר את ה-stagger
    // שלו בכל החלפת ניסוח, כדי להראות את הרמזים החדשים. שאר הלוח אינו מנותק-ומורכב
    // מחדש — הוא נשאר על המסך והרכיבים שבו עוברים בין הערכים (מראה מה השתנה, לא מאפס).
    const replayKey = current.id;
    const a = ACCENTS[current.accent];

    return (
        <div className="space-y-4">
            {/* אזור בחירת הבקשה */}
            <p className="text-sm leading-relaxed text-slate-400" dir="rtl">
                בחרו אחד משלושת הניסוחים. כולם עוסקים באותו נושא - חבילה שמתעכבת - אבל כל אחד מהם גורם למנוע לבחור מסלול אחר.
            </p>
            <RequestExampleSelector examples={examples} selectedId={current.id} onSelect={setSelectedId} />

            {/* פס הקשר דביק: הניסוח הפעיל + המסלול שנגזר ממנו, גלוי לאורך גלילת הניתוח */}
            <StickyContextBar
                inputText={current.requestText}
                labelHe={current.label}
                inputAccent={current.accent}
                decisionHe={current.decision.label}
                decisionEn={ROUTE_EN[current.selectedRoute]}
                tone={ROUTE_TONE[current.selectedRoute]}
                reduce={!!reduce}
            />

            {/* רמזי החלטה: מה בפרומט גרם למנוע לזהות כוונה ולבחור מסלול */}
            <p className="text-sm leading-relaxed text-slate-400" dir="rtl">{HELPERS.signals}</p>
            <DecisionSignalsPanel key={`signals-${replayKey}`} signals={current.decisionSignals} accent={current.accent} />

            {/* Intent Shift */}
            <p className="text-sm leading-relaxed text-slate-400" dir="rtl">{HELPERS.intentShift}</p>
            <IntentShiftStrip activeStage={current.intentStage} />

            {/* לוח הבקרה - נשאר מותקן; הרכיבים שבו עוברים בין הערכים בכל בחירה */}
            <motion.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={reduce ? { duration: 0 } : { duration: DUR.mid, ease: EASE.out }}
                className="grid grid-cols-1 gap-4 lg:grid-cols-2"
            >
                {/* 1. סוג הבקשה */}
                <div className="lg:col-span-2">
                    <RequestTypeDetector
                        requestType={current.requestType}
                        typeScores={current.typeScores}
                        accent={current.accent}
                        helper={HELPERS.detector}
                    />
                </div>

                {/* 2. ניתוב המסלול - הלב של הפרק */}
                <div className="lg:col-span-2">
                    <RouteSwitchboard activeRoute={current.selectedRoute} nextRoute={current.nextRoute} helper={HELPERS.switchboard} />
                </div>

                {/* 3. סיכון ומידע חסר */}
                <RiskMeter level={current.riskLevel} approvalRequired={current.approvalRequired} helper={HELPERS.risk} />
                <MissingInfoSpotlight
                    item={current.missingInfo}
                    label={current.missingInfoLabel}
                    note={current.missingInfoNote}
                    helper={HELPERS.missing}
                    accent={current.accent}
                />

                {/* 4. ההחלטה והסינתזה */}
                <div className="lg:col-span-2 space-y-3">
                    <DecisionCard decision={current.decision} />

                    {/* סינתזה: ההסבר נשען על הרמזים שזוהו למעלה */}
                    <div
                        className={`flex items-start gap-3 rounded-2xl border ${a.border} ${a.bgSoft} p-4 text-right`}
                        dir="rtl"
                    >
                        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-950/50 ${a.text}`}>
                            <Compass size={16} />
                        </span>
                        <div>
                            <div className={`mb-1 text-[10px] font-bold uppercase tracking-[0.2em] ${a.text}`}>
                                למה זה המסלול?
                            </div>
                            <p className="text-sm leading-relaxed text-slate-200">{current.promptExplanation}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
