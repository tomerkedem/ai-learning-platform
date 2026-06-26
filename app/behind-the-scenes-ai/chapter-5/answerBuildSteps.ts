// שלד "מעבדת בניית התשובה" של פרק 5 ("איך AI בונה תשובה"): מבנה לוגי בלבד, בלי טקסט
// תצוגה. מודל לימודי דטרמיניסטי, אין כאן LLM אמיתי, קריאת API או רשת.
//
// הרעיון: אותו פרומפט, אותה לולאת ייצור. בכל צעד המודל שוקל כמה חלקי המשך, בוחר אחד
// (chosenIndex), והחלק הנבחר מצטרף להקשר. ההקשר המעודכן משנה אילו המשכים יקבלו משקל
// גבוה בצעד הבא. שתי הפתיחות מובילות לשתי תשובות שונות, אף שהן יוצאות מאותו פרומפט.
//
// ── הפרדת מבנה מטקסט (Phase 2) ──
// כאן נשאר רק המבנה: מזהי מסלולים, גוון (accent), מידות התאמה (fit) ואינדקס החלק הנבחר
// בכל צעד. כל טקסט התצוגה (פרומפט, פתיחות, מה השתנה, חלקי המשך, תוויות, סיכומים) עבר
// למילון השפה (i18n/locales/<locale>/behind-ai/chapter5Lab.ts, תת-המרחב scenario).
// composeScenario ממזג שלד + טקסט מתורגם לכדי תרחיש מוכן לרינדור. הבחירה מזוהה לפי
// chosenIndex (אינדקס), לא לפי השוואת מחרוזות עברית.
//
// המספרים (fit) הם המחשה לימודית של מידת התאמה, לא חישוב אמיתי של מודל.

import type { Accent } from '@/components/ai-internals/types';

/* ════════════════════════ שלד מבני (לא תלוי שפה) ════════════════════════ */

/** מזהי המסלולים. מקשרים בין השלד לטקסט המתורגם. */
export type BranchId = 'self-service' | 'support';

/** חלק המשך אפשרי, ברמת המבנה: רק מידת ההתאמה (הטקסט מגיע מהמילון). */
export interface CandidateSkeleton {
    /** מידת התאמה להקשר הנוכחי, 0-100. המחשה לימודית בלבד. */
    fit: number;
}

/** צעד אחד בלולאת הייצור, ברמת המבנה. */
export interface StepSkeleton {
    /** אינדקס החלק הנבחר מתוך candidates (במקום השוואת מחרוזות). */
    chosenIndex: number;
    candidates: CandidateSkeleton[];
}

/** מסלול בנייה שלם, ברמת המבנה. */
export interface BranchSkeleton {
    id: BranchId;
    /** גוון המסלול, כדי שההבדל בין שני המסלולים יהיה ויזואלי. */
    accent: Accent;
    /** מידת ההתאמה של הפתיחה בצעד הראשון. */
    openerFit: number;
    /** הצעדים שאחרי הפתיחה (צעד 2 והלאה). */
    steps: StepSkeleton[];
}

/** התרחיש ברמת המבנה: שני מסלולים שמתפצלים מהבחירה הראשונה. */
export const ANSWER_BUILD_SKELETON: { branches: BranchSkeleton[] } = {
    branches: [
        {
            id: 'self-service',
            accent: 'cyan',
            openerFit: 58,
            steps: [
                { chosenIndex: 0, candidates: [{ fit: 64 }, { fit: 41 }, { fit: 33 }] },
                { chosenIndex: 0, candidates: [{ fit: 67 }, { fit: 38 }, { fit: 29 }] },
                { chosenIndex: 0, candidates: [{ fit: 62 }, { fit: 44 }, { fit: 31 }] },
                { chosenIndex: 0, candidates: [{ fit: 60 }, { fit: 36 }, { fit: 28 }] },
            ],
        },
        {
            id: 'support',
            accent: 'indigo',
            openerFit: 54,
            steps: [
                { chosenIndex: 0, candidates: [{ fit: 65 }, { fit: 43 }, { fit: 34 }] },
                { chosenIndex: 0, candidates: [{ fit: 63 }, { fit: 40 }, { fit: 30 }] },
                { chosenIndex: 0, candidates: [{ fit: 61 }, { fit: 39 }, { fit: 27 }] },
                { chosenIndex: 0, candidates: [{ fit: 59 }, { fit: 35 }, { fit: 33 }] },
            ],
        },
    ],
};

/* ════════════════════════ צורת הטקסט המתורגם ════════════════════════ */
// הטקסט עצמו חי במילון השפה. כאן רק החוזה המבני שהמילון חייב לספק, כדי שהמיזוג יהיה
// בטוח בזמן קומפילציה (אם חסר מסלול/צעד/חלק, הקריאה ל-composeScenario לא תעבור טייפ).

/** טקסט מתורגם למסלול אחד. */
export interface BranchText {
    /** שם קצר למסלול (לכרטיס ההשוואה). */
    label: string;
    /** חלק הפתיחה שמגדיר את המסלול. */
    opener: string;
    /** מה שינתה בחירת הפתיחה על ההקשר. */
    openerChanged: string;
    /** לאן המסלול מוביל בסך הכול, לכרטיס ההשוואה. */
    summary: string;
    /** טקסט הצעדים שאחרי הפתיחה, לפי סדר. */
    steps: { changed: string; candidates: string[] }[];
}

/** טקסט מתורגם לכל התרחיש. */
export interface ScenarioText {
    prompt: string;
    firstStepIntro: string;
    branches: Record<BranchId, BranchText>;
}

/* ════════════════════════ תרחיש מוכן לרינדור (שלד + טקסט) ════════════════════════ */

/** חלק המשך אפשרי, אחרי מיזוג: טקסט + מידת התאמה + האם נבחר. */
export interface FragmentCandidate {
    text: string;
    fit: number;
    leading?: boolean;
}

/** צעד אחד אחרי מיזוג. */
export interface BuildStep {
    chosenIndex: number;
    /** טקסט החלק שנבחר (נגזר מ-candidates[chosenIndex]). */
    chosen: string;
    /** מה השתנה בגלל ההקשר המעודכן. */
    changed: string;
    candidates: FragmentCandidate[];
}

/** מסלול בנייה שלם אחרי מיזוג. */
export interface BuildBranch {
    id: BranchId;
    label: string;
    opener: string;
    openerFit: number;
    accent: Accent;
    openerChanged: string;
    summary: string;
    steps: BuildStep[];
}

/** תרחיש המעבדה אחרי מיזוג: פרומפט אחד ושני מסלולי בנייה. */
export interface AnswerBuildScenario {
    prompt: string;
    firstStepIntro: string;
    branches: BuildBranch[];
}

/** ממזג שלד מבני + טקסט מתורגם לכדי תרחיש מוכן לרינדור. מזהה את הבחירה לפי אינדקס. */
export function composeScenario(text: ScenarioText): AnswerBuildScenario {
    return {
        prompt: text.prompt,
        firstStepIntro: text.firstStepIntro,
        branches: ANSWER_BUILD_SKELETON.branches.map((bs) => {
            const bt = text.branches[bs.id];
            return {
                id: bs.id,
                accent: bs.accent,
                openerFit: bs.openerFit,
                label: bt.label,
                opener: bt.opener,
                openerChanged: bt.openerChanged,
                summary: bt.summary,
                steps: bs.steps.map((ss, i) => {
                    const st = bt.steps[i];
                    return {
                        chosenIndex: ss.chosenIndex,
                        chosen: st.candidates[ss.chosenIndex],
                        changed: st.changed,
                        candidates: ss.candidates.map((cs, ci) => ({
                            text: st.candidates[ci],
                            fit: cs.fit,
                            leading: ci === ss.chosenIndex,
                        })),
                    };
                }),
            };
        }),
    };
}

/* ════════════════════════ עזרי תרחיש ════════════════════════ */

/** מחזיר מסלול לפי מזהה, או הראשון כברירת מחדל. */
export function getBranch(scenario: AnswerBuildScenario, id: string | null): BuildBranch {
    return scenario.branches.find((b) => b.id === id) ?? scenario.branches[0];
}

/**
 * בונה את ההקשר המצטבר עד צעד מסוים במסלול.
 * stepCount = 0 → רק הפרומפט. 1 → פרומפט + פתיחה. 2 → ועוד החלק הראשון, וכן הלאה.
 * מחזיר את רשימת חלקי התשובה שנבחרו (בלי הפרומפט).
 */
export function chosenFragmentsUpTo(branch: BuildBranch, stepCount: number): string[] {
    if (stepCount <= 0) return [];
    const out = [branch.opener];
    for (let i = 0; i < Math.min(stepCount - 1, branch.steps.length); i++) {
        out.push(branch.steps[i].chosen);
    }
    return out;
}

/** מספר הצעדים הכולל במסלול, כולל הפתיחה. */
export function totalSteps(branch: BuildBranch): number {
    return branch.steps.length + 1;
}
