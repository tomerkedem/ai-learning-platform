"use client";

// תוכן מעבדת ה-Tokenization, locale-aware.
// ──────────────────────────────────────────────────────────────────────────
// כל הטקסט הגלוי והנתונים תלויי-השפה של המעבדה (TokenizationLab, TokenStream,
// TokenColorLegend, TokenCountMeter, TokenRoleCard, SubwordSplitLab,
// TokenizationRoadmap) מרוכזים כאן כחבילת תוכן אחת.
//
// התוכן עצמו (העברית וחבילות השפות) נבנה בשרת בלבד ב-labContent.server.ts, ומגיע לעמוד
// רק אחרי בדיקת הרשאה. כאן נשארים הטיפוסים, ה-Context וה-hook.
//
// השדות המבניים (id, mode, accent, role keys, active) אינם טקסט ואינם מתורגמים.
// אין שימוש בתו מקף ארוך (em dash) או מקף בינוני (en dash).

import React, { createContext, useContext } from 'react';

import type {
    TokenScenario,
    RoadmapStep,
    PhraseAfterSignal,
    PairSignal,
} from './tokenizer';
import type { TokenRole, RoleWordMap } from './tokenRoles';

/* ════════════════════════ טיפוסים ════════════════════════ */

/** תווית כפולה: ראשית (לפי השפה) ומשנית (תיאור אנגלי קצר). */
export interface DualLabel {
    label: string;
    en: string;
}

/** טקסט תפקיד טוקן (locale-aware), נגזר מ-ROLE_INFO בעברית. */
export interface RoleInfoText {
    label: string;
    en: string;
    why: string;
}

/** שורת פירוק תת-מילים (locale-aware). מכליל את ה-Hebrew Token Lab לכל שפה. */
export interface SubwordSplit {
    /** היחידה הנראית כמילה אחת. */
    word: string;
    /** פירוק שלם: המילה כיחידה אחת. */
    whole: string[];
    /** פירוק לימודי: המילה מתפצלת לכמה יחידות עבודה. */
    units: string[];
    roleLabel: string;
    roleEn: string;
    note: string;
}

export interface Chapter3LabContent {
    /** תווית "מצב:" שליד מתג ה-Chat/Agent. */
    modeLabel: string;

    splitter: {
        hint: string;
        placeholder: string;
        aria: string;
        quickLabel: string;
        resetLabel: string;
    };

    stream: {
        title: string;
        titleEn: string;
        empty: string;
        hint: string;
        rail: {
            input: DualLabel;
            tokenizer: DualLabel;
            stream: DualLabel;
        };
    };

    legend: {
        title: string;
        titleEn: string;
    };

    count: {
        title: string;
        titleEn: string;
        note: string;
    };

    roleCard: {
        closeAria: string;
    };

    signals: {
        number: DualLabel;
        action: DualLabel;
        deliveryFailure: DualLabel;
        sortingCenter: DualLabel;
    };

    noSpaceNote: string;

    educational: {
        badge: string;
        note: string;
    };

    subword: {
        title: string;
        titleEn: string;
        badge: string;
        hint: string;
        wordsLabel: string;
        tokensLabel: string;
        splitAll: string;
        mergeAll: string;
        splitHint: string;
        mergeHint: string;
        ariaWhole: string;
        ariaSplit: string;
        note: string;
        splits: SubwordSplit[];
    };

    roadmap: {
        title: string;
        titleEn: string;
        note: string;
        steps: RoadmapStep[];
    };

    /* נתונים תלויי-שפה לזיהוי דטרמיניסטי (לא טקסט גלוי). */
    scenarios: TokenScenario[];
    roleWords: RoleWordMap;
    roleInfo: Record<TokenRole, RoleInfoText>;
    sortingCenter: PhraseAfterSignal;
    deliveryFailure: PairSignal;
}

/* ════════════════════════ Context ════════════════════════ */

// התוכן נבנה בשרת בלבד (labContent.server.ts) ומגיע לעמוד אחרי בדיקת הרשאה, כי הוא
// תוכן של פרק מוגן. אין ברירת מחדל בצד הלקוח: רכיבי המעבדה חיים רק בתוך ה-Provider.
const Chapter3LabContext = createContext<Chapter3LabContent | null>(null);

/** מחזיר את תוכן המעבדה הפעיל. חייב Provider (עמוד פרק 3). */
export function useChapter3Lab(): Chapter3LabContent {
    const value = useContext(Chapter3LabContext);
    if (!value) throw new Error('useChapter3Lab must be used within Chapter3LabProvider');
    return value;
}

/** עוטף את תוכן הפרק עם תוכן מעבדה לפי שפה. */
export const Chapter3LabProvider: React.FC<{ value: Chapter3LabContent; children: React.ReactNode }> = ({
    value,
    children,
}) => <Chapter3LabContext.Provider value={value}>{children}</Chapter3LabContext.Provider>;
