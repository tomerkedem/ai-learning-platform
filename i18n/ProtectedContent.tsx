"use client";

// i18n/ProtectedContent.tsx
//
// תוכן של פרק מוגן, שהשרת מעביר לעמוד רק אחרי בדיקת הרשאה (ראו
// app/(course)/behind-the-scenes-ai/_access/openCourseContent.ts). התוכן לא נמצא בשום
// חבילת JS ציבורית: הוא מגיע רק בתשובת השרת לבקשה מורשית. useT ממזג את dict לתוך
// t.behindAi, ולכן רכיבי הפרק ממשיכים לקרוא t.behindAi.<מרחב> בלי שינוי.

import React, { createContext, useContext } from 'react';
import type { BehindAiDict } from './dictionary';
import type { QuizQuestion } from '@/app/(course)/behind-the-scenes-ai/quizData';

export interface ProtectedContent {
    /** מרחבי-השמות של הפרק, בשפת הבקשה. */
    dict: Partial<BehindAiDict>;
    /** שאלות המבדק של הפרק, או של מבחן הסיום. */
    quiz?: QuizQuestion[];
    /** מושג -> פרק, לקישורי חזרה (כל המושגים, כולל של הפרקים המוגנים). */
    conceptChapters?: Record<string, number>;
    /** תוכן מעבדה שנבנה בשרת (פרקים 3 ו-4). הצורה מוגדרת בקובץ התוכן של הפרק. */
    lab?: unknown;
    /** מפתחות התשובה של הפרק (answerKeys.server.ts). */
    answers?: AnswerKeys;
}

/** מפתחות תשובה של פרק מוגן: בדיקת ההבנה, האבחון, ניחוש הפתיחה ולוח הציון (פרק 15). */
export interface AnswerKeys {
    lock?: number;
    diag?: number;
    guessCorrect?: string;
    guessTones?: Record<string, string>;
    scoreGuess?: number;
    scoreLock?: number;
}

const ProtectedContentContext = createContext<ProtectedContent | null>(null);

export function ProtectedContentProvider({ value, children }: { value: ProtectedContent; children: React.ReactNode }) {
    return <ProtectedContentContext.Provider value={value}>{children}</ProtectedContentContext.Provider>;
}

export function useProtectedContent(): ProtectedContent | null {
    return useContext(ProtectedContentContext);
}

/** מפתח תשובה של הפרק הנוכחי (מגיע מהשרת רק אחרי בדיקת הרשאה). */
export function useAnswerKey<K extends Exclude<keyof AnswerKeys, 'guessTones'>>(name: K): AnswerKeys[K] {
    return useContext(ProtectedContentContext)?.answers?.[name];
}

/** טון הסטטוס של כל כרטיס ניחוש לפי מזהה (איזה ניחוש מדויק), מהשרת. */
export function useGuessTones<T extends string>(): Record<string, T> {
    return (useContext(ProtectedContentContext)?.answers?.guessTones ?? {}) as Record<string, T>;
}
