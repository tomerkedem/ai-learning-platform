// src/lib/courseData.ts

import type { Locale } from '@/i18n/config';
import type { LocalizedText } from '@/lib/localize';

// טיפוס השפה הורחב למערך ה-locale המלא (he, ar, ru, en, es, ja + עתידיות).
// שדות הטקסט הם LocalizedText: עברית חובה, שאר השפות אופציונליות ונופלות לעברית
// דרך tField. הנתונים הקיימים (he+en) נשארים תקפים ללא שינוי.
export type Language = Locale;

export interface ChapterData {
    id: number;
    num: string;
    // טקסטים מרובי-שפות (he = מקור / fallback)
    label: LocalizedText;
    title: LocalizedText;
    readTime: string;
    
    // עיצוב מלא
    labelColor: string; // למשל: "text-blue-400"
    colorFrom: string;  // למשל: "from-blue-400"
    colorTo: string;    // למשל: "to-indigo-500"
    
    href?: string;
}

export interface CourseData {
    id: string;
    title: LocalizedText;
    description: LocalizedText;
    chapters: ChapterData[];
    // כשהפרק האחרון הבנוי אינו הפרק האחרון בתוכנית (עוד פרקים מתוכננים אך טרם נבנו),
    // מסך הסיום של הפוטר משתמש בניסוח ניטרלי במקום "סיימת את כל הפרקים". ברירת מחדל:
    // לא מוגדר, כלומר לומדה שהושלמה מציגה את מסך הסיום הרגיל.
    hasUpcomingChapters?: boolean;
}

export const courses: Record<string, CourseData> = {
    
    // --- לומדה 1: מתמטיקה אינטואיטיבית ---
    mathIntuitive: {
        id: "mathIntuitive",
        title: { he: "מתמטיקה אינטואיטיבית ל-AI", en: "Intuitive Math for AI" },
        description: { he: "הבסיס המתמטי שכל מפתח AI חייב להכיר", en: "The mathematical foundation every AI developer needs" },
        chapters: [
            {
                id: 0,
                href: "/math/mathIntuitive/introduction",
                num: "מבוא",
                label: { he: "ברוכים הבאים", en: "Welcome" },
                title: { he: "מבוא: להסיר את הווילון מעל ה-AI", en: "Intro: Unveiling the AI Black Box" },
                readTime: "5 דקות",
                labelColor: "text-sky-400",
                colorFrom: "from-sky-400",
                colorTo: "to-blue-500"
            },
            {
                id: 1,
                href: "/math/mathIntuitive/chapter-1",
                num: "פרק 1",
                label: { he: "הבסיס: מתמטיקה", en: "The Math Basis" },
                title: { he: "למה מתמטיקה היא חלק מהעבודה?", en: "Why is Math Part of the Job?" },
                readTime: "8 דקות",
                labelColor: "text-blue-400",
                colorFrom: "from-blue-400",
                colorTo: "to-indigo-500"
            },
            {
                id: 2,
                href: "/math/mathIntuitive/chapter-2",
                num: "פרק 2",
                label: { he: "סטטיסטיקה", en: "Statistics" },
                title: { he: "ממוצע, חציון וסטיית תקן – בלי סיבוכים", en: "Mean, Median, Std Dev - Made Simple" },
                readTime: "10 דקות",
                labelColor: "text-emerald-400",
                colorFrom: "from-emerald-400",
                colorTo: "to-green-500"
            },
            {
                id: 3,
                href: "/math/mathIntuitive/chapter-3",
                num: "פרק 3",
                label: { he: "הסתברות למתכנתים", en: "Probability" },
                title: { he: "הסתברות שמדברת בשפה של מתכנת", en: "Probability for Developers" },
                readTime: "12 דקות",
                labelColor: "text-purple-400",
                colorFrom: "from-purple-400",
                colorTo: "to-fuchsia-500"
            },
            {
                id: 4,
                href: "/math/mathIntuitive/chapter-4",
                num: "פרק 4",
                label: { he: "בייס והתניה", en: "Bayes & Conditionals" },
                title: { he: "הסתברות מותנית ובייס – הגרסה האנושית", en: "Conditional Probability & Bayes" },
                readTime: "10 דקות",
                labelColor: "text-amber-400",
                colorFrom: "from-amber-400",
                colorTo: "to-yellow-500"
            },
            {
                id: 5,
                href: "/math/mathIntuitive/chapter-5",
                num: "פרק 5",
                label: { he: "וקטורים ב-AI", en: "Vectors" },
                title: { he: "וקטורים – הלב של כל מודל", en: "Vectors - The Heart of Every Model" },
                readTime: "10 דקות",
                labelColor: "text-indigo-400",
                colorFrom: "from-indigo-400",
                colorTo: "to-blue-700"
            },
            {
                id: 6,
                href: "/math/mathIntuitive/chapter-6",
                num: "פרק 6",
                label: { he: "נורמה ומרחק", en: "Norms & Distance" },
                title: { he: "נורמה ומרחק – מודדים את העולם", en: "Norms & Distance" },
                readTime: "12 דקות",
                labelColor: "text-pink-400",
                colorFrom: "from-pink-400",
                colorTo: "to-rose-500"
            },
            {
                id: 7,
                href: "/math/mathIntuitive/chapter-7",
                num: "פרק 7",
                label: { he: "דמיון קוסינוס", en: "Cosine Similarity" },
                title: { he: "זווית ודמיון קוסינוס", en: "Angle & Cosine Similarity" },
                readTime: "10 דקות",
                labelColor: "text-rose-400",
                colorFrom: "from-rose-400",
                colorTo: "to-pink-500"
            },
            {
                id: 8,
                href: "/math/mathIntuitive/chapter-8",
                num: "פרק 8",
                label: { he: "פונקציות ועקומות", en: "Functions" },
                title: { he: "פונקציות – איך מודל חושב", en: "Functions - How Models Think" },
                readTime: "8 דקות",
                labelColor: "text-cyan-400",
                colorFrom: "from-cyan-400",
                colorTo: "to-sky-500"
            },
            {
                id: 9,
                href: "/math/mathIntuitive/chapter-9",
                num: "פרק 9",
                label: { he: "שיפוע (Slope)", en: "Slope" },
                title: { he: "שיפוע – המנוע של הלמידה", en: "Slope - The Engine of Learning" },
                readTime: "10 דקות",
                labelColor: "text-teal-400",
                colorFrom: "from-teal-400",
                colorTo: "to-emerald-500"
            },
            {
                id: 10,
                href: "/math/mathIntuitive/chapter-10",
                num: "פרק 10",
                label: { he: "Gradient Descent", en: "Gradient Descent" },
                title: { he: "Gradient Descent – הלמידה עצמה", en: "Gradient Descent - The Learning Itself" },
                readTime: "15 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-purple-600"
            },
            {
                id: 11,
                href: "/math/mathIntuitive/chapter-11",
                num: "פרק 11",
                label: { he: "פרויקט סיום", en: "Final Project" },
                title: { he: "פרויקט סיום – mini_math_primer", en: "Final Project - mini_math_primer" },
                readTime: "20 דקות",
                labelColor: "text-orange-400",
                colorFrom: "from-orange-400",
                colorTo: "to-amber-500"
            },
            {
                id: 12,
                href: "/math/mathIntuitive/chapter-12",
                num: "פרק 12",
                label: { he: "סיכום וחיבור ל-ML", en: "Summary" },
                title: { he: "איך כל זה מתחבר ל-ML ול-NLP", en: "Connecting to Machine Learning" },
                readTime: "8 דקות",
                labelColor: "text-slate-400",
                colorFrom: "from-slate-400",
                colorTo: "to-gray-500"
            }
        ]
    },

    // --- לומדה 2: פייתון פרקטי ---
    python: {
        id: "python",
        title: { he: "פייתון פרקטי למפתחי AI לעידן ה-AI", en: "Practical Python for AI Era" },
        description: { he: "המדריך המלא להפיכת קוד פייתון למערכות AI יציבות", en: "The complete guide to turning Python code into robust AI systems" },
        chapters: [
            {
                id: 0,
                href: "/python/introduction",
                num: "מבוא",
                label: { he: "התחלה", en: "Start" },
                title: { he: "מבוא: פייתון היא שפת ההנדסה של ה-AI", en: "Intro: Python is the Engineering Language of AI" },
                readTime: "5 דקות",
                labelColor: "text-slate-400",
                colorFrom: "from-slate-400",
                colorTo: "to-gray-500"
            },
            {
                id: 1,
                href: "/python/chapter-1",
                num: "פרק 1",
                label: { he: "השפה של ה-AI", en: "AI Language" },
                title: { he: "למה פייתון חשובה בעידן ה-AI?", en: "Why Python Matters in the AI Era?" },
                readTime: "10 דקות",
                labelColor: "text-blue-400",
                colorFrom: "from-blue-400",
                colorTo: "to-indigo-500"
            },
            {
                id: 2,
                href: "/python/chapter-2",
                num: "פרק 2",
                label: { he: "תחביר בסיסי", en: "Basic Syntax" },
                title: { he: "יסודות פייתון למתכנתים מנוסים", en: "Python Basics for Experienced Devs" },
                readTime: "12 דקות",
                labelColor: "text-indigo-400",
                colorFrom: "from-indigo-400",
                colorTo: "to-blue-600"
            },
            {
                id: 3,
                href: "/python/chapter-3",
                num: "פרק 3",
                label: { he: "מבני נתונים", en: "Data Structures" },
                title: { he: "מבני נתונים שימושיים: list, dict, set", en: "Useful Data Structures" },
                readTime: "15 דקות",
                labelColor: "text-purple-400",
                colorFrom: "from-purple-400",
                colorTo: "to-fuchsia-600"
            },
            {
                id: 4,
                href: "/python/chapter-4",
                num: "פרק 4",
                label: { he: "פונקציות", en: "Functions" },
                title: { he: "פונקציות מתקדמות ו-Lambdas", en: "Advanced Functions" },
                readTime: "12 דקות",
                labelColor: "text-pink-400",
                colorFrom: "from-pink-400",
                colorTo: "to-rose-500"
            },
            {
                id: 5,
                href: "/python/chapter-5",
                num: "פרק 5",
                label: { he: "מודולים", en: "Modules" },
                title: { he: "מודולים וארגון פרויקט", en: "Project Org" },
                readTime: "10 דקות",
                labelColor: "text-rose-400",
                colorFrom: "from-rose-400",
                colorTo: "to-red-500"
            },
            {
                id: 6,
                href: "/python/chapter-6",
                num: "פרק 6",
                label: { he: "סביבות", en: "Environments" },
                title: { he: "סביבות וירטואליות וניהול תלויות", en: "Virtual Envs" },
                readTime: "10 דקות",
                labelColor: "text-red-400",
                colorFrom: "from-red-400",
                colorTo: "to-orange-500"
            },
            {
                id: 7,
                href: "/python/chapter-7",
                num: "פרק 7",
                label: { he: "קבצים", en: "Files" },
                title: { he: "קבצים, נתיבים וקונפיגורציה", en: "Files & Config" },
                readTime: "12 דקות",
                labelColor: "text-orange-400",
                colorFrom: "from-orange-400",
                colorTo: "to-amber-500"
            },
            {
                id: 8,
                href: "/python/chapter-8",
                num: "פרק 8",
                label: { he: "שגיאות ולוגים", en: "Errors & Logs" },
                title: { he: "חריגות, לוגים ואבחון תקלות", en: "Exceptions & Logs" },
                readTime: "12 דקות",
                labelColor: "text-amber-400",
                colorFrom: "from-amber-400",
                colorTo: "to-yellow-500"
            },
            {
                id: 9,
                href: "/python/chapter-9",
                num: "פרק 9",
                label: { he: "OOP", en: "OOP" },
                title: { he: "תכנות מונחה עצמים (OOP) ב-AI", en: "OOP in AI" },
                readTime: "15 דקות",
                labelColor: "text-yellow-400",
                colorFrom: "from-yellow-400",
                colorTo: "to-lime-500"
            },
            {
                id: 10,
                href: "/python/chapter-10",
                num: "פרק 10",
                label: { he: "Typing", en: "Typing" },
                title: { he: "טיפוסיות סטטית (Type Hints)", en: "Static Typing" },
                readTime: "10 דקות",
                labelColor: "text-lime-400",
                colorFrom: "from-lime-400",
                colorTo: "to-green-500"
            },
            {
                id: 11,
                href: "/python/chapter-11",
                num: "פרק 11",
                label: { he: "כלים מתקדמים", en: "Advanced Tools" },
                title: { he: "דקורטורים ו-Context Managers", en: "Decorators" },
                readTime: "12 דקות",
                labelColor: "text-green-400",
                colorFrom: "from-green-400",
                colorTo: "to-emerald-500"
            },
            {
                id: 12,
                href: "/python/chapter-12",
                num: "פרק 12",
                label: { he: "בדיקות", en: "Testing" },
                title: { he: "בדיקות אוטומטיות עם Pytest", en: "Automated Testing" },
                readTime: "15 דקות",
                labelColor: "text-emerald-400",
                colorFrom: "from-emerald-400",
                colorTo: "to-teal-500"
            },
            {
                id: 13,
                href: "/python/chapter-13",
                num: "פרק 13",
                label: { he: "ביצועים", en: "Performance" },
                title: { he: "ביצועים, זיכרון ו-NumPy", en: "Performance & NumPy" },
                readTime: "15 דקות",
                labelColor: "text-teal-400",
                colorFrom: "from-teal-400",
                colorTo: "to-cyan-500"
            },
            {
                id: 14,
                href: "/python/chapter-14",
                num: "פרק 14",
                label: { he: "Pandas", en: "Pandas" },
                title: { he: "Pandas למהנדסי AI", en: "Pandas for AI" },
                readTime: "20 דקות",
                labelColor: "text-cyan-400",
                colorFrom: "from-cyan-400",
                colorTo: "to-sky-500"
            },
            {
                id: 15,
                href: "/python/chapter-15",
                num: "פרק 15",
                label: { he: "Async", en: "Async" },
                title: { he: "אסינכרוניות וממשקי רשת", en: "Async & Networking" },
                readTime: "15 דקות",
                labelColor: "text-sky-400",
                colorFrom: "from-sky-400",
                colorTo: "to-blue-500"
            },
            {
                id: 16,
                href: "/python/chapter-16",
                num: "פרק 16",
                label: { he: "CLI", en: "CLI" },
                title: { he: "בניית כלי שורת פקודה (CLI)", en: "Building CLI Tools" },
                readTime: "10 דקות",
                labelColor: "text-blue-400",
                colorFrom: "from-blue-400",
                colorTo: "to-indigo-500"
            },
            {
                id: 17,
                href: "/python/chapter-17",
                num: "פרק 17",
                label: { he: "פרויקט", en: "Project" },
                title: { he: "תרגול מאוחד: mini_text_analyzer", en: "Unified Practice" },
                readTime: "25 דקות",
                labelColor: "text-indigo-400",
                colorFrom: "from-indigo-400",
                colorTo: "to-purple-600"
            },
            {
                id: 18,
                href: "/python/chapter-18",
                num: "פרק 18",
                label: { he: "בונוס", en: "Bonus" },
                title: { he: "תבנית הזהב לפרויקטים", en: "Golden Template" },
                readTime: "10 דקות",
                labelColor: "text-purple-400",
                colorFrom: "from-purple-400",
                colorTo: "to-fuchsia-500"
            }
        ]
    },

    // --- לומדה 3: מתמטיקה והיגיון הסתברותי ---
    mathProbabilistic: {
        id: "mathProbabilistic",
        title: { he: "מתמטיקה והיגיון הסתברותי", en: "Math & Probabilistic Logic" },
        description: { he: "להבין את המספרים שמאחורי ההחלטות", en: "Understanding the numbers behind decisions" },
        chapters: [
            {
                id: 0,
                href: "/math/mathProbabilistic/introduction",
                num: "מבוא",
                label: { he: "פתיחה", en: "Intro" },
                title: { he: "מבוא: לנהל שיחה עם המודל", en: "Intro: Conversing with the Model" },
                readTime: "5 דקות",
                labelColor: "text-slate-400",
                colorFrom: "from-slate-400",
                colorTo: "to-gray-500"
            },
            {
                id: 1,
                href: "/math/mathProbabilistic/chapter-1",
                num: "פרק 1",
                label: { he: "המתמטיקה", en: "The Math" },
                title: { he: "למה צריך מתמטיקה יישומית?", en: "Why Applied Math?" },
                readTime: "10 דקות",
                labelColor: "text-blue-400",
                colorFrom: "from-blue-400",
                colorTo: "to-indigo-500"
            },
            {
                id: 2,
                href: "/math/mathProbabilistic/chapter-2",
                num: "פרק 2",
                label: { he: "גיאומטריה", en: "Geometry" },
                title: { he: "וקטורים ומטריצות – הגיאומטריה של ה-AI", en: "Vectors & Matrices" },
                readTime: "15 דקות",
                labelColor: "text-indigo-400",
                colorFrom: "from-indigo-400",
                colorTo: "to-purple-600"
            },
            {
                id: 3,
                href: "/math/mathProbabilistic/chapter-3",
                num: "פרק 3",
                label: { he: "סטטיסטיקה", en: "Statistics" },
                title: { he: "סטטיסטיקה תיאורית והבנת דאטה", en: "Descriptive Stats" },
                readTime: "12 דקות",
                labelColor: "text-purple-400",
                colorFrom: "from-purple-400",
                colorTo: "to-fuchsia-500"
            },
            {
                id: 4,
                href: "/math/mathProbabilistic/chapter-4",
                num: "פרק 4",
                label: { he: "הסתברות", en: "Probability" },
                title: { he: "היגיון הסתברותי וקבלת החלטות", en: "Probabilistic Logic" },
                readTime: "15 דקות",
                labelColor: "text-pink-400",
                colorFrom: "from-pink-400",
                colorTo: "to-rose-500"
            },
            {
                id: 5,
                href: "/math/mathProbabilistic/chapter-5",
                num: "פרק 5",
                label: { he: "פונקציות עלות", en: "Loss Functions" },
                title: { he: "פונקציות עלות – איך מודל מרגיש שטעה", en: "Loss Functions" },
                readTime: "12 דקות",
                labelColor: "text-rose-400",
                colorFrom: "from-rose-400",
                colorTo: "to-red-500"
            },
            {
                id: 6,
                href: "/math/mathProbabilistic/chapter-6",
                num: "פרק 6",
                label: { he: "Gradient Descent", en: "Gradient Descent" },
                title: { he: "Gradient Descent – מנוע הלמידה", en: "Gradient Descent" },
                readTime: "15 דקות",
                labelColor: "text-orange-400",
                colorFrom: "from-orange-400",
                colorTo: "to-amber-500"
            },
            {
                id: 7,
                href: "/math/mathProbabilistic/chapter-7",
                num: "פרק 7",
                label: { he: "מוצר ו-AI", en: "Product & AI" },
                title: { he: "תרגום שאלות מוצר למודלים הסתברותיים", en: "Product Questions to Models" },
                readTime: "12 דקות",
                labelColor: "text-amber-400",
                colorFrom: "from-amber-400",
                colorTo: "to-yellow-500"
            },
            {
                id: 8,
                href: "/math/mathProbabilistic/chapter-8",
                num: "פרק 8",
                label: { he: "טעויות נפוצות", en: "Common Mistakes" },
                title: { he: "דפוסים שגויים ואיך לתקן אותם", en: "Patterns & Fixes" },
                readTime: "10 דקות",
                labelColor: "text-yellow-400",
                colorFrom: "from-yellow-400",
                colorTo: "to-lime-500"
            },
            {
                id: 9,
                href: "/math/mathProbabilistic/chapter-9",
                num: "פרק 9",
                label: { he: "פרויקט", en: "Project" },
                title: { he: "פרויקט סיום: mini_mathlab", en: "Final Project" },
                readTime: "20 דקות",
                labelColor: "text-teal-400",
                colorFrom: "from-teal-400",
                colorTo: "to-cyan-500"
            }
        ]
    },

    // --- לומדה 4: מאחורי הקלעים של AI ---
    "behind-the-scenes-ai": {
        id: "behind-the-scenes-ai",
        // התוכנית הסופית כוללת 19 פרקים, וכולם בנויים. הפרק האחרון בתוכנית הוא 19
        // (Full Trace), שמסתיים ב-CTA למבחן הסיום. לכן אין דגל hasUpcomingChapters:
        // הפוטר של פרק 19 מציג את מסך הסיום הרגיל.
        title: { he: "מאחורי הקלעים של AI", en: "Behind the Scenes of AI", ar: "ما وراء كواليس AI", ru: "AI за кулисами", es: "Entre bastidores de AI", ja: "AI の舞台裏" },
        description: { he: "מה קורה כשכותבים לצ'ט או ל-Agent", en: "What happens when you write to a chat or an agent", ar: "ما الذي يحدث عندما تكتب إلى محادثة أو وكيل", ru: "Что происходит, когда вы пишете в чат или агенту", es: "Qué ocurre cuando escribes a un chat o a un agente", ja: "チャットやエージェントに入力したとき、何が起きるのか" },
        chapters: [
            {
                id: 0,
                href: "/behind-the-scenes-ai/introduction",
                num: "מבוא",
                label: { he: "פתיח", en: "Intro", ar: "تمهيد", ru: "Вступление", es: "Apertura", ja: "イントロ" },
                title: { he: "מבוא: מה קורה מאחורי הקלעים של AI", en: "Intro: Behind the Scenes of AI", ar: "مقدّمة: ما الذي يحدث وراء كواليس AI", ru: "Введение: что происходит за кулисами AI", es: "Introducción: qué ocurre entre bastidores de AI", ja: "はじめに：AI の舞台裏で何が起きているのか" },
                readTime: "6 דקות",
                labelColor: "text-cyan-400",
                colorFrom: "from-cyan-400",
                colorTo: "to-blue-500"
            },
            {
                id: 1,
                href: "/behind-the-scenes-ai/chapter-1",
                num: "פרק 1",
                label: { he: "הצ'אט השקוף", en: "The Transparent Chat", ar: "المحادثة الشفافة", ru: "Прозрачный чат", es: "El chat transparente", ja: "透明なチャット" },
                title: { he: "הצ'אט השקוף: הדרך שמאחורי התשובה", en: "The Transparent Chat: The Path Behind the Answer", ar: "المحادثة الشفافة: الطريق خلف الجواب", ru: "Прозрачный чат: путь за ответом", es: "El chat transparente: el camino detrás de la respuesta", ja: "透明なチャット：答えの背後にある道のり" },
                readTime: "8 דקות",
                labelColor: "text-blue-400",
                colorFrom: "from-blue-400",
                colorTo: "to-indigo-500"
            },
            {
                id: 2,
                href: "/behind-the-scenes-ai/chapter-2",
                num: "פרק 2",
                label: { he: "Model Input", en: "Model Input", ar: "Model Input", ru: "Model Input", es: "Model Input", ja: "Model Input" },
                title: { he: "Model Input: מה באמת נכנס למודל", en: "Model Input: What Really Enters the Model", ar: "Model Input: ما الذي يدخل فعلًا إلى النموذج", ru: "Model Input: что на самом деле получает модель", es: "Model Input: qué entra realmente en el modelo", ja: "Model Input：モデルに実際に入るもの" },
                readTime: "8 דקות",
                labelColor: "text-indigo-400",
                colorFrom: "from-indigo-400",
                colorTo: "to-violet-500"
            },
            {
                id: 3,
                href: "/behind-the-scenes-ai/chapter-3",
                num: "03",
                label: { he: "Tokenization", en: "Tokenization", ar: "Tokenization", ru: "Tokenization", es: "Tokenization", ja: "Tokenization" },
                title: { he: "Tokenization: כשהטקסט מתפרק לטוקנים", en: "Tokenization: When Text Breaks Into Tokens", ar: "Tokenization: عندما يتفكّك النص إلى توكنات", ru: "Tokenization: когда текст распадается на токены", es: "Tokenization: cuando el texto se divide en tokens", ja: "Tokenization：テキストがトークンに分かれるとき" },
                readTime: "11 דקות",
                labelColor: "text-fuchsia-400",
                colorFrom: "from-fuchsia-400",
                colorTo: "to-violet-500"
            },
            {
                id: 4,
                href: "/behind-the-scenes-ai/chapter-4",
                num: "04",
                label: { he: "Embeddings", en: "Embeddings", ar: "Embeddings", ru: "Embeddings", es: "Embeddings", ja: "Embeddings" },
                title: { he: "Embeddings: ממספר חסר משמעות למשמעות", en: "Embeddings: From a Meaningless Number to Meaning", ar: "Embeddings: من رقم بلا معنى إلى المعنى", ru: "Embeddings: От числа без смысла к смыслу", es: "Embeddings: De un número sin significado al significado", ja: "Embeddings: 意味のない数値から意味へ" },
                readTime: "13 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-cyan-500"
            },
            {
                id: 5,
                href: "/behind-the-scenes-ai/chapter-5",
                num: "05",
                label: { he: "Semantic Space", en: "Semantic Space", ar: "Semantic Space", ru: "Semantic Space", es: "Semantic Space", ja: "Semantic Space" },
                title: { he: "Semantic Space: מפת המשמעות של המודל", en: "Semantic Space: The Model's Map of Meaning", ar: "Semantic Space: خريطة المعنى لدى النموذج", ru: "Semantic Space: карта смысла модели", es: "Semantic Space: el mapa de significado del modelo", ja: "Semantic Space: モデルの意味マップ" },
                readTime: "12 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-fuchsia-500"
            },
            {
                id: 6,
                href: "/behind-the-scenes-ai/chapter-6",
                num: "06",
                label: { he: "מי חשוב עכשיו", en: "Who Matters Now", ar: "ما المهمّ الآن", ru: "Что важно сейчас", es: "Qué importa ahora", ja: "いま重要なのは何か" },
                title: { he: "Attention: מי חשוב עכשיו", en: "Attention: Who Matters Now", ar: "Attention: ما المهمّ الآن", ru: "Attention: что важно сейчас", es: "Attention: qué importa ahora", ja: "Attention：いま重要なのは何か" },
                readTime: "12 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-emerald-500"
            },
            {
                id: 7,
                href: "/behind-the-scenes-ai/chapter-7",
                num: "07",
                label: { he: "Context Window", en: "Context Window", ar: "Context Window", ru: "Context Window", es: "Context Window", ja: "Context Window" },
                title: { he: "Context Window: מה המודל באמת רואה עכשיו", en: "Context Window: What the Model Really Sees Now", ar: "Context Window: ما الذي يراه النموذج فعلًا الآن", ru: "Context Window: что модель на самом деле видит сейчас", es: "Context Window: lo que el modelo realmente ve ahora", ja: "Context Window：モデルがいま実際に見ているもの" },
                readTime: "10 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-sky-500"
            },
            {
                id: 8,
                href: "/behind-the-scenes-ai/chapter-8",
                num: "08",
                label: { he: "Logits & Softmax", en: "Logits & Softmax", ar: "Logits & Softmax", ru: "Logits & Softmax", es: "Logits & Softmax", ja: "Logits & Softmax" },
                title: { he: "Logits & Softmax: מציונים להסתברויות", en: "Logits & Softmax: From Scores to Probabilities", ar: "Logits & Softmax: من الدرجات إلى الاحتمالات", ru: "Logits & Softmax: от оценок к вероятностям", es: "Logits & Softmax: de puntuaciones a probabilidades", ja: "Logits & Softmax：スコアから確率へ" },
                readTime: "9 דקות",
                labelColor: "text-purple-400",
                colorFrom: "from-purple-400",
                colorTo: "to-emerald-500"
            },
            {
                id: 9,
                href: "/behind-the-scenes-ai/chapter-9",
                num: "09",
                label: { he: "Decoding", en: "Decoding", ar: "Decoding", ru: "Decoding", es: "Decoding", ja: "Decoding" },
                title: { he: "Decoding: בחירת הטוקן הבא", en: "Decoding: Choosing the Next Token", ar: "Decoding: اختيار التوكن التالي", ru: "Decoding: выбор следующего токена", es: "Decoding: elegir el siguiente token", ja: "Decoding：次のトークンを選ぶ" },
                readTime: "10 דקות",
                labelColor: "text-sky-400",
                colorFrom: "from-sky-400",
                colorTo: "to-indigo-500"
            },
            {
                id: 10,
                href: "/behind-the-scenes-ai/chapter-10",
                num: "10",
                label: { he: "Generation Loop", en: "Generation Loop", ar: "Generation Loop", ru: "Generation Loop", es: "Generation Loop", ja: "Generation Loop" },
                title: { he: "Generation Loop: איך תשובה נבנית עד הסוף", en: "Generation Loop: How an Answer Is Built to the End", ar: "Generation Loop: كيف تُبنى الإجابة حتى النهاية", ru: "Generation Loop: как ответ строится до конца", es: "Generation Loop: cómo se construye una respuesta hasta el final", ja: "Generation Loop：回答が最後まで組み立てられる仕組み" },
                readTime: "12 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-fuchsia-500"
            },
            {
                id: 11,
                href: "/behind-the-scenes-ai/chapter-11",
                num: "11",
                label: { he: "Hallucinations", en: "Hallucinations", ar: "Hallucinations", ru: "Hallucinations", es: "Hallucinations", ja: "Hallucinations" },
                title: { he: "Hallucinations: למה תשובה בטוחה יכולה להיות שגויה", en: "Hallucinations: Why a Confident Answer Can Be Wrong", ar: "Hallucinations: لماذا قد تكون الإجابة الواثقة خاطئة", ru: "Hallucinations: почему уверенный ответ может быть ошибочным", es: "Hallucinations: por qué una respuesta segura puede estar equivocada", ja: "Hallucinations：自信のある答えが間違っていることがある理由" },
                readTime: "11 דקות",
                labelColor: "text-amber-400",
                colorFrom: "from-amber-400",
                colorTo: "to-rose-500"
            },
            {
                id: 12,
                href: "/behind-the-scenes-ai/chapter-12",
                num: "12",
                label: { he: "RAG & Grounding", en: "RAG & Grounding", ar: "RAG & Grounding", ru: "RAG & Grounding", es: "RAG & Grounding", ja: "RAG & Grounding" },
                title: { he: "RAG & Grounding: איך מחברים AI למקורות", en: "RAG & Grounding: How AI Connects to Sources", ar: "RAG & Grounding: كيف يتّصل AI بالمصادر", ru: "RAG & Grounding: как AI подключается к источникам", es: "RAG & Grounding: cómo la AI se conecta a fuentes", ja: "RAG & Grounding：AI はどのように情報源につながるのか" },
                readTime: "13 דקות",
                labelColor: "text-teal-400",
                colorFrom: "from-teal-400",
                colorTo: "to-emerald-500"
            },
            {
                id: 13,
                href: "/behind-the-scenes-ai/chapter-13",
                num: "13",
                label: { he: "Self-Check", en: "Self-Check", ar: "Self-Check", ru: "Self-Check", es: "Self-Check", ja: "Self-Check" },
                title: { he: "Self-Check: בדיקה עצמית בזמן תשובה", en: "Self-Check: Checking the Answer While It Is Being Built", ar: "Self-Check: فحص ذاتي أثناء بناء الإجابة", ru: "Self-Check: самопроверка во время ответа", es: "Self-Check: verificar la respuesta mientras se construye", ja: "Self-Check：回答をつくりながら自分で確認する" },
                readTime: "13 דקות",
                labelColor: "text-indigo-400",
                colorFrom: "from-indigo-400",
                colorTo: "to-sky-500"
            },
            {
                id: 14,
                href: "/behind-the-scenes-ai/chapter-14",
                num: "14",
                label: { he: "Learning from Mistakes", en: "Learning from Mistakes", ar: "Learning from Mistakes", ru: "Learning from Mistakes", es: "Learning from Mistakes", ja: "Learning from Mistakes" },
                title: { he: "Learning from Mistakes: איך מודל משתפר מטעות", en: "Learning from Mistakes: How a Model Improves from a Mistake", ar: "Learning from Mistakes: كيف يتحسّن النموذج من الخطأ", ru: "Learning from Mistakes: как модель улучшается на ошибке", es: "Learning from Mistakes: cómo un modelo mejora a partir de un error", ja: "Learning from Mistakes：モデルは間違いからどう良くなるのか" },
                readTime: "12 דקות",
                labelColor: "text-fuchsia-400",
                colorFrom: "from-fuchsia-400",
                colorTo: "to-violet-500"
            },
            {
                id: 15,
                href: "/behind-the-scenes-ai/chapter-15",
                num: "15",
                label: { he: "Evaluation & Generalization", en: "Evaluation & Generalization", ar: "Evaluation & Generalization", ru: "Evaluation & Generalization", es: "Evaluation & Generalization", ja: "Evaluation & Generalization" },
                title: { he: "Evaluation & Generalization: שינן או הבין", en: "Evaluation & Generalization: Memorized or Understood?", ar: "Evaluation & Generalization: حفظ أم فهم؟", ru: "Evaluation & Generalization: запомнил или понял?", es: "Evaluation & Generalization: ¿memorizó o entendió?", ja: "Evaluation & Generalization：暗記か理解か" },
                readTime: "12 דקות",
                labelColor: "text-emerald-400",
                colorFrom: "from-emerald-400",
                colorTo: "to-teal-500"
            },
            {
                id: 16,
                href: "/behind-the-scenes-ai/chapter-16",
                num: "16",
                label: { he: "האם AI לומד ממני", en: "Does AI Learn From Me", ar: "هل يتعلّم AI مني", ru: "Учится ли AI у меня", es: "¿La AI aprende de mí?", ja: "AI は私から学ぶのか" },
                title: { he: "Does AI Learn From Me: האם AI לומד ממני", en: "Does AI Learn From Me?", ar: "Does AI Learn From Me: هل يتعلّم AI مني", ru: "Does AI Learn From Me: учится ли AI у меня", es: "Does AI Learn From Me: ¿la AI aprende de mí?", ja: "Does AI Learn From Me：AI は私から学ぶのか" },
                readTime: "12 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-fuchsia-500"
            },
            {
                id: 17,
                href: "/behind-the-scenes-ai/chapter-17",
                num: "17",
                label: { he: "Chat to Agent", en: "Chat to Agent", ar: "Chat to Agent", ru: "Chat to Agent", es: "Chat to Agent", ja: "Chat to Agent" },
                title: { he: "Chat to Agent: כששאלה הופכת למשימה", en: "Chat to Agent: When a Question Becomes a Task", ar: "Chat to Agent: عندما يتحوّل السؤال إلى مهمّة", ru: "Chat to Agent: когда вопрос становится задачей", es: "Chat to Agent: cuando una pregunta se convierte en tarea", ja: "Chat to Agent：問いがタスクになるとき" },
                readTime: "11 דקות",
                labelColor: "text-teal-400",
                colorFrom: "from-teal-400",
                colorTo: "to-violet-500"
            },
            {
                id: 18,
                href: "/behind-the-scenes-ai/chapter-18",
                num: "18",
                label: { he: "Guardrails", en: "Guardrails", ar: "Guardrails", ru: "Guardrails", es: "Guardrails", ja: "Guardrails" },
                title: { he: "Guardrails: סיכון, הרשאות, אישור ועצירה", en: "Guardrails: Risk, Permissions, Approval, and Stopping", ar: "Guardrails: المخاطر والأذونات والموافقة والتوقّف", ru: "Guardrails: риск, разрешения, одобрение и остановка", es: "Guardrails: riesgo, permisos, aprobación y parada", ja: "Guardrails：リスク・権限・承認・停止" },
                readTime: "11 דקות",
                labelColor: "text-indigo-400",
                colorFrom: "from-indigo-400",
                colorTo: "to-sky-500"
            },
            {
                id: 19,
                href: "/behind-the-scenes-ai/chapter-19",
                num: "19",
                label: { he: "Full Trace", en: "Full Trace", ar: "Full Trace", ru: "Full Trace", es: "Full Trace", ja: "Full Trace" },
                title: { he: "Full Trace: פרומפט אחד, כל התחנות", en: "Full Trace: One Prompt, All Stations", ar: "Full Trace: طلب واحد، كل المحطات", ru: "Full Trace: один промпт, все станции", es: "Full Trace: un prompt, todas las estaciones", ja: "Full Trace：一つのプロンプト、すべての駅" },
                readTime: "12 דקות",
                labelColor: "text-emerald-400",
                colorFrom: "from-emerald-400",
                colorTo: "to-teal-500"
            }
        ]
    }
};