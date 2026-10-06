"use client";

// ════════════════════════════════════════════════════════════════════════
// מצב הלמידה המשותף של הלומד המחובר: מאגר אחד לכל הקוראים (learnerStore.ts), מחובר כאן למקורות
// הקיימים (account.ts) ולאירועי הדפדפן. אין כאן לוגיקת שמירה חדשה: התור, מאגר היחידות והעותק
// המקומי נשארים כפי שהם, ו-AccountSync ממשיך לשלוח אותם.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import { useCallback, useSyncExternalStore } from "react";
import {
    LEARNING_PROGRESS_UPDATED_EVENT,
    getPendingAttempts,
    learnerStorageKind,
    loadAccountSnapshot,
    loadReachedUnits,
    localReachedUnits,
    readCachedRecords,
    signedInUserId,
    subscribeAuthState,
    supabase,
    useAuthState,
    withPending,
    type PendingAttempt,
} from "./account";
import { chapterMilestones, courseLearning, mergeReached, type QuizRecord } from "./learningProgress";
import { getMasterySummary, MASTERY_UPDATED_EVENT, type MasterySummary } from "./masteryProgress";
import { createLearnerStore, latestQuizRecord, type LearnerSync, type LearnerView } from "./learnerStore";

export type CourseLearningView = LearnerView<PendingAttempt, MasterySummary>;
export type CourseLearningSync = LearnerSync<PendingAttempt>;

const store = createLearnerStore<PendingAttempt, MasterySummary>({
    currentUserId: signedInUserId,
    cachedRecords: readCachedRecords,
    localUnits: localReachedUnits,
    outbox: getPendingAttempts,
    loadRecords: loadAccountSnapshot,
    loadUnits: loadReachedUnits,
    derive: courseLearning,
    milestones: chapterMilestones,
    mergeReached,
    withPending,
    summarize: getMasterySummary,
    now: Date.now,
});

if (typeof window !== "undefined") {
    window.addEventListener(MASTERY_UPDATED_EVENT, store.onQuizEvent);
    window.addEventListener(LEARNING_PROGRESS_UPDATED_EVENT, store.onUnitsEvent);
    window.addEventListener("storage", (e) => {
        const userId = store.userId();
        if (userId) store.onStorage(learnerStorageKind(userId, e.key));
    });
    window.addEventListener("online", store.onOnline);
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") store.onVisible();
    });
    // יציאה או החלפת משתמש: נתוני המשתמש הקודם יוצאים מהזיכרון (getView ממילא לא מחזיר אותם).
    subscribeAuthState(() => {
        const held = store.userId();
        if (held && held !== signedInUserId()) store.reset();
    });
}

/**
 * מצב הלמידה של הלומד המחובר, או null כשאין לומד מחובר. כל הקוראים חולקים מאגר אחד: עלייה של
 * רכיב, קורא נוסף או ניווט אינם טוענים שוב מהשרת.
 */
export function useCourseLearning(): CourseLearningView | null {
    const userId = useAuthState().session?.user.id ?? null;
    const subscribe = useCallback((listener: () => void) => store.subscribe(userId, listener), [userId]);
    return useSyncExternalStore(subscribe, () => store.getView(userId), () => null);
}

/**
 * הניסיון האחרון של מבדק מסוים, מהמאגר המשותף (בלי טעינה נוספת). undefined = עוד לא ידוע; null = ידוע
 * שלא נוסה; אחרת הרשומה, שהציון בה הוא של הניסיון האחרון (לא הטוב ביותר). בלי Supabase מוגדר אין
 * התחברות שתסתיים, ולכן המצב ידוע מיד (אין לומד מחובר).
 */
export function useLatestQuizRecord(quizId: string): QuizRecord | null | undefined {
    const authReady = useAuthState().ready || !supabase;
    return latestQuizRecord(authReady, useCourseLearning(), quizId);
}
