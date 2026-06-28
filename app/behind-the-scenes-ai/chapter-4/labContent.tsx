"use client";

// תוכן מעבדת ה-Embeddings, locale-aware (שכבת תוכן בלבד, ללא UI).
// ──────────────────────────────────────────────────────────────────────────
// כאן מחברים את השכבה המבנית מ-embeddingEngine.ts (SENTENCE_STRUCTS, projectProfile,
// MAGNETS, DNA helpers) עם תוכן לומד מקומי. הגאומטריה בלתי תלוית שפה, ולכן משפט נוחת
// באותו מקום בכל שפה. הטקסט (text, tokens, ttsLine, תוויות) מגיע מהמילון לפי id יציב.
//
// בקומיט הזה קיים רק תוכן עברי (HE_LAB). כל עוד אין Provider בעמוד, ה-hook מחזיר את
// ברירת המחדל העברית, ולכן אין שינוי התנהגות גלוי. שפות נוספות יצורפו בקומיט ה-i18n.
//
// השדות המבניים (id, category, nearbyIds, magnet ids, dim keys) אינם טקסט ואינם
// מתורגמים. אין שימוש בתו מקף ארוך או מקף בינוני.

import React, { createContext, useContext } from 'react';

import type { Locale } from '@/i18n/config';
import {
    SENTENCE_STRUCTS,
    getSentenceStruct,
    projectProfile,
    type SentenceStruct,
    type SentenceId,
    type MapPoint2D,
    type MagnetId,
    type DimKey,
} from './embeddingEngine';

import { chapter4Lab as HE_LAB } from '@/i18n/locales/he/behind-ai/chapter4Lab';

/* ════════════════════════ טיפוסים ════════════════════════ */

/** טקסט לומד למשפט בודד. tokens מחושב ידנית, לעולם לא מפיצול לפי רווחים. */
export interface LabSentenceText {
    /** הטקסט הטבעי בשפה. */
    text: string;
    /** מערך הטוקנים המפורש (מחבר ידני, לא split על רווח). */
    tokens: string[];
    /** שורת הסבר קצרה וקריאה להקראה (TTS). */
    ttsLine: string;
    /** תוויות החלפת מילה, לפי chipId יציב. */
    swaps?: Record<string, { label: string }>;
}

/** חבילת התוכן המקומי של מעבדת ה-Embeddings. */
export interface Chapter4LabDict {
    /** תוכן לומד לכל id מבני ב-SENTENCE_STRUCTS. ממופה לפי SentenceId, ולכן חובה לכסות
     *  כל מזהה. הוספת SentenceStruct חדש תיצור שגיאת קומפילציה כאן עד שיתווסף תוכן. */
    sentences: Record<SentenceId, LabSentenceText>;

    map: {
        /** קצה ימני של ציר X (עולם המשלוח). */
        axisXStart: string;
        /** קצה שמאלי של ציר X (מערכת ותשלום). */
        axisXEnd: string;
        /** קצה נמוך של ציר Y (רגוע). */
        axisYStart: string;
        /** קצה גבוה של ציר Y (כשל וסיכון). */
        axisYEnd: string;
        /** הבהרה שהמפה היא צל דו-ממדי של מרחב גדול בהרבה. */
        shadowNote: string;
        legendTitle: string;
        emptyState: string;
    };

    /** תוויות מגנט לפי מזהה מגנט יציב. */
    magnets: Record<MagnetId, string>;

    /** תוויות גנים לפי ממד יציב. */
    genes: Record<DimKey, string>;

    dna: {
        title: string;
        /** תבנית גנים משותפים, למשל 5 מתוך 6. */
        sharedGenes: (shared: number, total: number) => string;
        /** תבנית סחיפה באחוזים. */
        drift: (pct: number) => string;
        stayedClose: string;
        drifted: string;
    };

    controls: {
        pickSentence: string;
        swapWord: string;
        reset: string;
        compareWith: string;
    };

    fallback: {
        /** תווית גיבוי גלויה אם חסר טקסט למשפט. */
        missingSentence: string;
    };

    ui: {
        /** כותרת פאנל המגנט. */
        magnetTitle: string;
    };
}

/**
 * משפט מחובר: שכבה מבנית (engine) פלוס טקסט מקומי פלוס נקודת היטל מחושבת.
 * זהו האובייקט שרכיבי המפה, המגנט וה-DNA יצרכו בעתיד.
 */
export interface JoinedSentence extends SentenceStruct {
    text: string;
    tokens: string[];
    ttsLine: string;
    swaps: { chipId: string; toId: SentenceId; label: string }[];
    point: MapPoint2D;
}

/* ════════════════════════ חיבור (join) ════════════════════════ */

/** מחבר רשומה מבנית אחת עם הטקסט המקומי שלה. */
function joinOne(struct: SentenceStruct, dict: Chapter4LabDict): JoinedSentence {
    const text = dict.sentences[struct.id];

    if (!text) {
        const message = `[chapter4 lab] missing localized content for sentence id "${struct.id}"`;
        // בפיתוח נכשל ברעש כדי לתפוס id חסר מוקדם. בפרודקשן נופלים בבטחה לתווית גיבוי.
        if (process.env.NODE_ENV !== 'production') {
            throw new Error(message);
        }
        return {
            ...struct,
            text: dict.fallback.missingSentence,
            tokens: [],
            ttsLine: dict.fallback.missingSentence,
            swaps: [],
            point: projectProfile(struct.profile),
        };
    }

    const swaps = (struct.wordSwaps ?? []).map((w) => ({
        chipId: w.chipId,
        toId: w.toId,
        label: text.swaps?.[w.chipId]?.label ?? w.chipId,
    }));

    return {
        ...struct,
        text: text.text,
        tokens: text.tokens,
        ttsLine: text.ttsLine,
        swaps,
        point: projectProfile(struct.profile),
    };
}

/** מחבר את כל המשפטים המבניים עם התוכן המקומי. */
export function joinSentences(dict: Chapter4LabDict): JoinedSentence[] {
    return SENTENCE_STRUCTS.map((struct) => joinOne(struct, dict));
}

/** מחבר משפט בודד לפי id, או undefined אם אין רשומה מבנית כזו. */
export function joinSentence(id: string, dict: Chapter4LabDict): JoinedSentence | undefined {
    const struct = getSentenceStruct(id);
    return struct ? joinOne(struct, dict) : undefined;
}

/* ════════════════════════ מרשם תוכן לפי שפה ════════════════════════ */

// בקומיט הזה קיימת רק עברית. כל שפה שאינה במפה נופלת בבטחה לעברית. שאר השפות יתווספו
// כאן בקומיט ה-i18n, בלי לשנות את חתימת הפונקציה.
const LAB_CONTENT_BY_LOCALE: Partial<Record<Locale, Chapter4LabDict>> = {
    he: HE_LAB,
};

/** מחזיר את תוכן המעבדה לשפה, עם נפילה לעברית. */
export function getLabContent(locale: Locale): Chapter4LabDict {
    return LAB_CONTENT_BY_LOCALE[locale] ?? HE_LAB;
}

/* ════════════════════════ Context ════════════════════════ */

const Chapter4LabContext = createContext<Chapter4LabDict>(HE_LAB);

/** מחזיר את תוכן המעבדה הפעיל. ללא Provider מחזיר את ברירת המחדל העברית. */
export function useChapter4Lab(): Chapter4LabDict {
    return useContext(Chapter4LabContext);
}

/** עוטף את תוכן הפרק עם תוכן מעבדה לפי שפה. */
export const Chapter4LabProvider: React.FC<{ value: Chapter4LabDict; children: React.ReactNode }> = ({
    value,
    children,
}) => <Chapter4LabContext.Provider value={value}>{children}</Chapter4LabContext.Provider>;
