// ════════════════════════════════════════════════════════════════════════
// ליבת מצב הלמידה המשותף: מאגר אחד, גזירה אחת, הרבה קוראים.
// מאגר ברמת המודול למשתמש המחובר אחד בלבד. מקורות הנתונים והגזירה מוזרקים (learnerState.ts
// מחבר את האמיתיים), כדי שהמחזור כולו ייבדק בלי דפדפן ובלי Supabase. ייבוא טיפוסים בלבד.
//
// מחזור החיים:
//   - קורא ראשון למשתמש: תמונה מיידית מהמכשיר (עותק הרשומות, היחידות, התור), ואז טעינה אחת
//     מהשרת: שתי בקשות במקביל (quiz_results, learning_unit_progress).
//   - רכיב שעולה מחדש, קורא נוסף או ניווט: אותו מאגר, בלי בקשות.
//   - שינוי מקומי (יחידה, ניסיון בתור): חישוב מחדש בלבד.
//   - סיום שליחת התור, או אירוע מבדק בלי שינוי בתור (למשל ייבוא): רענון רשומות אחד, מאוחד.
//   - חזרה ללשונית אחרי STALE_MS, או חזרת רשת אחרי ניתוק: רענון מלא אחד.
//   - החלפת משתמש או יציאה: המאגר של המשתמש הקודם אינו מוחזר לעולם, גם לא לרינדור אחד.
// כשל בשרת אינו מוחק דבר: נשארים עם הידוע האחרון ומסמנים ניתוק.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import type { CourseLearning, PendingAttemptInput, QuizRecord, ReachedUnit } from "./learningProgress";

/** רענון אחרי חזרה ללשונית רק כשהנתונים מהשרת ישנים מזה. */
export const STALE_MS = 10 * 60 * 1000;

export type StorageKind = "outbox" | "units" | "cache" | null;

export interface LearnerDeps<P extends PendingAttemptInput & { attemptId: string }, S> {
    /** המשתמש המחובר כרגע. מאגר של משתמש אחר אינו נוצר ואינו מוחזר. */
    currentUserId(): string | null;
    // ── מקורות מקומיים, סינכרוניים ──
    cachedRecords(userId: string): { records: QuizRecord[]; loadedAt: number } | null;
    localUnits(userId: string): ReachedUnit[];
    outbox(userId: string): P[];
    // ── השרת: כל אחת היא בקשה אחת, ולעולם אינה זורקת (כשל = offline עם העותק המקומי) ──
    loadRecords(userId: string): Promise<{ records: QuizRecord[]; loadedAt: number | null; offline: boolean }>;
    loadUnits(userId: string): Promise<{ reached: ReachedUnit[]; offline: boolean }>;
    // ── הגזירה (הפונקציות הטהורות) ──
    derive(reached: readonly ReachedUnit[], records: readonly QuizRecord[]): CourseLearning;
    /** אבני הדרך לכל פרק (chapterMilestones), מאותן הגעות בדיוק. */
    milestones(reached: readonly ReachedUnit[]): boolean[][];
    mergeReached(...lists: ReachedUnit[][]): ReachedUnit[];
    withPending(records: readonly QuizRecord[], pending: readonly P[]): QuizRecord[];
    summarize(records: QuizRecord[]): S;
    now(): number;
}

export interface LearnerSync<P> {
    userId: string;
    /** הטעינה האחרונה מהשרת נכשלה (מוצג הידוע האחרון). */
    offline: boolean;
    /** מתי הרשומות נטענו לאחרונה מהשרת (כולל עותק מקומי של טעינה קודמת), או null. */
    loadedAt: number | null;
    pending: P[];
    rejected: P[];
}

export interface LearnerView<P, S> {
    userId: string;
    /** false עד שהטעינה הראשונה מהשרת הסתיימה (בהצלחה או בכשל); עד אז מוצגת התמונה המקומית. */
    ready: boolean;
    course: CourseLearning;
    /** milestones[n - 1] = אבני הדרך של פרק n, לפי סדר המרשם. רק מצב, בלי מזהים. */
    milestones: readonly (readonly boolean[])[];
    summary: S;
    /** רשומות המבדקים העדכניות (מהשרת ועם ניסיונות שממתינים בתור): הניסיון האחרון של כל מבדק. */
    records: readonly QuizRecord[];
    sync: LearnerSync<P>;
}

interface Entry<P, S> {
    userId: string;
    /** רשומות מהשרת (או מהעותק המקומי של טעינה קודמת), בלי הממתינים. */
    records: QuizRecord[];
    /** הגעות שהגיעו מטעינת השרת, בנוסף למאגר המקומי. */
    serverUnits: ReachedUnit[];
    loadedAt: number | null;
    offline: boolean;
    ready: boolean;
    started: boolean;
    inflightAll: Promise<void> | null;
    inflightRecords: Promise<void> | null;
    /** חתימת התור כפי שנראה לאחרונה, והממתינים (לא נדחים) שבו. */
    outboxSig: string;
    pending: P[];
    view: LearnerView<P, S>;
}

export function createLearnerStore<P extends PendingAttemptInput & { attemptId: string }, S>(deps: LearnerDeps<P, S>) {
    let entry: Entry<P, S> | null = null;
    const listeners = new Set<() => void>();
    const notify = () => listeners.forEach((l) => l());

    const signature = (queue: P[]) => queue.map((p) => `${p.attemptId}:${p.rejected ?? ""}`).join("|");

    function build(e: Entry<P, S>): void {
        const queue = deps.outbox(e.userId);
        const records = deps.withPending(e.records, queue);
        const reached = deps.mergeReached(e.serverUnits, deps.localUnits(e.userId));
        e.view = {
            userId: e.userId,
            ready: e.ready,
            course: deps.derive(reached, records),
            milestones: deps.milestones(reached),
            summary: deps.summarize(records),
            records,
            sync: {
                userId: e.userId,
                offline: e.offline,
                loadedAt: e.loadedAt,
                pending: queue.filter((p) => !p.rejected),
                rejected: queue.filter((p) => p.rejected),
            },
        };
    }

    /**
     * משווה את התור לנראה לאחרונה. ניסיון שיצא מהתור בלי שנדחה אושר בשרת: ממוזג לרשומות כאן (אותו
     * מיזוג כמו בשרת), כדי שהציון האחרון לא ייעלם עד הרענון. מחזיר האם התור השתנה.
     */
    function applyOutbox(e: Entry<P, S>): boolean {
        const queue = deps.outbox(e.userId);
        const sig = signature(queue);
        if (sig === e.outboxSig) return false;
        const still = new Set(queue.map((p) => p.attemptId));
        const confirmed = e.pending.filter((p) => !still.has(p.attemptId));
        if (confirmed.length) e.records = deps.withPending(e.records, confirmed);
        e.outboxSig = sig;
        e.pending = queue.filter((p) => !p.rejected);
        return true;
    }

    function open(userId: string): Entry<P, S> {
        if (entry?.userId === userId) return entry;
        const cached = deps.cachedRecords(userId);
        const e: Entry<P, S> = {
            userId,
            records: cached?.records ?? [],
            serverUnits: [],
            loadedAt: cached?.loadedAt ?? null,
            offline: false,
            ready: false,
            started: false,
            inflightAll: null,
            inflightRecords: null,
            outboxSig: "",
            pending: [],
            view: undefined as unknown as LearnerView<P, S>,
        };
        // התור ההתחלתי הוא נקודת הייחוס: פריטים שיוצאים ממנו אחר כך אושרו בשרת.
        const queue = deps.outbox(userId);
        e.outboxSig = signature(queue);
        e.pending = queue.filter((p) => !p.rejected);
        build(e);
        entry = e;
        return e;
    }

    /** טעינה מהשרת. בקשה זהה שכבר בדרך מוחזרת כפי שהיא (איחוד). תשובה של משתמש קודם נזרקת. */
    function refresh(e: Entry<P, S>, scope: "all" | "records"): Promise<void> {
        if (e.inflightAll) return e.inflightAll;
        if (scope === "records" && e.inflightRecords) return e.inflightRecords;
        const run = async () => {
            let snap: Awaited<ReturnType<LearnerDeps<P, S>["loadRecords"]>> | null = null;
            let units: Awaited<ReturnType<LearnerDeps<P, S>["loadUnits"]>> | null = null;
            try {
                [snap, units] = await Promise.all([
                    deps.loadRecords(e.userId),
                    scope === "all" ? deps.loadUnits(e.userId) : Promise.resolve(null),
                ]);
            } catch {
                // המקורות אינם אמורים לזרוק; אם זרקו, זה כמו ניתוק.
            }
            if (entry !== e) return;
            const offline = !snap || snap.offline || !!units?.offline;
            if (snap && !snap.offline) {
                e.records = snap.records;
                e.loadedAt = snap.loadedAt;
            } else if (snap && !e.records.length && snap.records.length) {
                // ניתוק: הידוע האחרון לעולם אינו נמחק; עותק מקומי משלים רק כשאין שום דבר אחר.
                e.records = snap.records;
                e.loadedAt = snap.loadedAt;
            }
            if (units) e.serverUnits = deps.mergeReached(e.serverUnits, units.reached);
            e.offline = offline;
            e.ready = true;
            // ניסיון שאושר בזמן הטעינה אולי חסר בתשובה: ממוזג גם לרשומות החדשות (הרענון הבא מאשר).
            applyOutbox(e);
            build(e);
            notify();
        };
        const p = run().finally(() => {
            if (scope === "all") e.inflightAll = null;
            else e.inflightRecords = null;
        });
        if (scope === "all") e.inflightAll = p;
        else e.inflightRecords = p;
        return p;
    }

    const current = () => (entry && entry.userId === deps.currentUserId() ? entry : null);
    const recompute = (e: Entry<P, S>) => { build(e); notify(); };

    return {
        /** התמונה הנוכחית למשתמש הזה, או null. אינה טוענת מהשרת; יוצרת תמונה מקומית בפעם הראשונה. */
        getView(userId: string | null): LearnerView<P, S> | null {
            if (!userId || userId !== deps.currentUserId()) return null;
            return open(userId).view;
        },
        /** קורא חדש. הקורא הראשון למשתמש מתחיל את הטעינה היחידה מהשרת. */
        subscribe(userId: string | null, listener: () => void): () => void {
            if (!userId || userId !== deps.currentUserId()) return () => {};
            const e = open(userId);
            listeners.add(listener);
            if (!e.started) {
                e.started = true;
                void refresh(e, "all");
            }
            return () => { listeners.delete(listener); };
        },
        /** רענון מפורש (מאוחד עם כל רענון שכבר בדרך). */
        refresh(): Promise<void> {
            const e = current();
            return e ? refresh(e, "all") : Promise.resolve();
        },
        /** משחרר את מאגר המשתמש מהזיכרון (יציאה או החלפת משתמש). לא מודיע: React מתרנדר ממילא. */
        reset(): void {
            entry = null;
        },
        userId: (): string | null => entry?.userId ?? null,

        // ── אירועים (learnerState.ts מחבר אותם לדפדפן) ──
        /** אירוע מבדק באותה לשונית: שינוי בתור = חישוב מחדש; בלי שינוי = הרשומות השתנו בחוץ (סיום שליחה, ייבוא). */
        onQuizEvent(): void {
            const e = current();
            if (!e) return;
            if (!applyOutbox(e) && e.started) void refresh(e, "records");
            recompute(e);
        },
        /** הגעה ליחידה (או סנכרון שלה) באותה לשונית: חישוב מחדש בלבד. */
        onUnitsEvent(): void {
            const e = current();
            if (e) recompute(e);
        },
        /** שינוי באחסון מלשונית אחרת. מפתח שאינו של המשתמש או של מצב הלמידה: כלום. */
        onStorage(kind: StorageKind): void {
            const e = current();
            if (!e || !kind) return;
            if (kind === "outbox") applyOutbox(e);
            if (kind === "cache") {
                // לשונית אחרת טענה מהשרת: אם העותק חדש יותר, משתמשים בו בלי בקשה.
                const cached = deps.cachedRecords(e.userId);
                if (cached && (e.loadedAt === null || cached.loadedAt > e.loadedAt)) {
                    e.records = cached.records;
                    e.loadedAt = cached.loadedAt;
                    e.offline = false;
                }
            }
            recompute(e);
        },
        /** הלשונית חזרה להיות גלויה: רענון אחד רק כשהנתונים ישנים, ורק כשאין טעינה בדרך. */
        onVisible(): void {
            const e = current();
            if (!e || !e.started || e.inflightAll || e.inflightRecords) return;
            if (e.loadedAt === null || deps.now() - e.loadedAt >= STALE_MS) void refresh(e, "all");
        },
        /** הרשת חזרה: רענון אחד רק אם הטעינה האחרונה נכשלה. */
        onOnline(): void {
            const e = current();
            if (e && e.started && e.offline) void refresh(e, "all");
        },
    };
}

/**
 * הניסיון האחרון של מבדק, משלושה מצבים נפרדים: undefined = עוד לא ידוע (ההתחברות או הטעינה הראשונה
 * מהשרת עוד לא הסתיימו, ואין רשומה מקומית), null = ידוע שלא נוסה, אחרת הרשומה. view null אחרי שההתחברות
 * ידועה = אין לומד מחובר, ולכן אין תוצאה שמורה.
 */
export function latestQuizRecord(
    authReady: boolean,
    view: { ready: boolean; records: readonly QuizRecord[] } | null,
    quizId: string,
): QuizRecord | null | undefined {
    if (!authReady) return undefined;
    const record = view?.records.find((r) => r.quizId === quizId);
    if (record) return record;
    return view && !view.ready ? undefined : null;
}

export type LearnerStore<P extends PendingAttemptInput & { attemptId: string }, S> = ReturnType<typeof createLearnerStore<P, S>>;
