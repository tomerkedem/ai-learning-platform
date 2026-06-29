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
    description: LocalizedText;
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
                description: { he: "המודלים לא עושים קסמים. הם עובדים עם מושגים פשוטים כמו ממוצע ומרחק. בוא נלמד את השפה שלהם.", en: "Models aren't magic. They use simple concepts. Let's learn their language." },
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
                description: { he: "בתוך המודל – כל זה נעלם. לא נשארת שפה, לא נשארת תמונה... הכול מתורגם למספרים.", en: "Inside the model, everything becomes numbers." },
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
                description: { he: "איך מבינים את ה'מרכז' וה'פיזור' של הדאטה כדי לזהות רעש ואנומליות.", en: "Understanding the center and spread of data." },
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
                description: { he: "הסתברות היא לא קסם, היא תדירות. איך מייצגים תרחישים וסיווגים בצורה פשוטה.", en: "Probability is frequency. Representing scenarios and classifications." },
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
                description: { he: "מה מסתתר מאחורי השאלה 'כמה סביר שזה נכון?' ואיך הקשר משנה את התמונה.", en: "How likely is it? How context changes the picture." },
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
                description: { he: "איך טקסט, תמונה או משתמש הופכים לרשימת מספרים שהמחשב יודע לעבד.", en: "How text and images become lists of numbers." },
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
                description: { he: "מה זה 'אורך' של וקטור ואיך מודלים מודדים כמה דברים שונים זה מזה.", en: "What is vector 'length' and how to measure difference." },
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
                description: { he: "למה בטקסט הכיוון חשוב יותר מהמרחק? על דמיון סמנטי ו-Embeddings.", en: "Why direction matters more than distance in text." },
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
                description: { he: "מה זו 'עקומה' ולמה כל מודל בעולם מנסה למצוא את המינימום שלה.", en: "What is a curve and why we seek its minimum." },
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
                description: { he: "מה זה שיפוע בלי להגיד 'נגזרת', ואיך הוא אומר למודל כמה טעות יש לו.", en: "What is slope and how it guides error correction." },
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
                description: { he: "האלגוריתם שמניע את הכל: איך המודל גולש במורד העקומה כדי להקטין את הטעות.", en: "The algorithm that drives everything." },
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
                description: { he: "כותבים קוד! יישום מעשי בפייתון של כל מה שלמדנו: ממוצע, בייס, נורמה ו-Gradient Descent.", en: "Practical Python implementation of everything we learned." },
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
                description: { he: "איך אבני הבניין שלמדנו (וקטורים, שיפועים, הסתברות) בונים את המודלים הגדולים ביותר.", en: "Connecting the building blocks to the real world." },
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
        title: { he: "פייתון פרקטי למתכנתים לעידן ה-AI", en: "Practical Python for AI Era" },
        description: { he: "המדריך המלא להפיכת קוד פייתון למערכות AI יציבות", en: "The complete guide to turning Python code into robust AI systems" },
        chapters: [
            {
                id: 0,
                href: "/python/introduction",
                num: "מבוא",
                label: { he: "התחלה", en: "Start" },
                title: { he: "מבוא: פייתון היא שפת ההנדסה של ה-AI", en: "Intro: Python is the Engineering Language of AI" },
                description: { he: "למה הלומדה הזו נכתבה למתכנתים מנוסים ולא למתחילים.", en: "Why this book is for experienced devs." },
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
                description: { he: "פייתון ככלי הנדסי, PEP 8 וניהול קוד נקי.", en: "Python as an engineering tool." },
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
                description: { he: "משתנים, f-strings, ו-List Comprehensions.", en: "Variables, f-strings, and List Comprehensions." },
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
                description: { he: "הלב של כל מערכת נתונים ואיך בוחרים נכון.", en: "The heart of every data system." },
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
                description: { he: "פרמטרים, args/kwargs, ו-Scope.", en: "Parameters, args/kwargs, and Scope." },
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
                description: { he: "איך בונים פרויקט Production אמיתי.", en: "Building a real Production project." },
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
                description: { he: "על venv, pip ו-Poetry.", en: "About venv, pip, and Poetry." },
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
                description: { he: "עבודה נכונה עם JSON, CSV ומשתני סביבה.", en: "Working with JSON, CSV and env vars." },
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
                description: { he: "איך בונים מערכת שיודעת לדווח על בעיות.", en: "Building a system that reports issues." },
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
                description: { he: "מתי להשתמש במחלקות ומתי ב-Dataclasses.", en: "When to use classes vs Dataclasses." },
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
                description: { he: "איך להפוך פייתון לשפה בטוחה יותר.", en: "Making Python safer." },
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
                description: { he: "קסמים שמקצרים את הקוד.", en: "Magic tricks that shorten code." },
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
                description: { he: "למה אי אפשר בלי טסטים ואיך עושים את זה.", en: "Why tests are mandatory." },
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
                description: { he: "איך כותבים קוד פייתון מהיר באמת.", en: "Writing fast Python code." },
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
                description: { he: "עיבוד נתונים טבלאיים בצורה מקצועית.", en: "Professional data processing." },
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
                description: { he: "ניהול קריאות מרובות ל-API במקביל.", en: "Managing concurrent calls." },
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
                description: { he: "שימוש ב-Typer ליצירת סקריפטים נוחים.", en: "Using Typer for scripts." },
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
                description: { he: "בונים כלי אמיתי מאפס.", en: "Building a real tool from scratch." },
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
                description: { he: "מבנה תיקיות, Docker ו-CI/CD.", en: "Folder structure, Docker, and CI/CD." },
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
                description: { he: "למה מתכנתים צריכים שכבת הבנה דקה ומדויקת.", en: "Why devs need precise understanding." },
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
                description: { he: "איך וקטורים, הסתברות ולוס מחזיקים את המודל.", en: "How vectors, probability, and loss support the model." },
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
                description: { he: "מפות, כיוונים, ודמיון במרחב (Embeddings).", en: "Maps, directions, and spatial similarity." },
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
                description: { he: "לזהות חריגות ורעש לפני שהמודל רואה אותם.", en: "Spotting outliers before the model sees them." },
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
                description: { he: "חוקי בייס והסתברות מותנית ככלי עבודה למפתחים.", en: "Bayes and conditional probability as dev tools." },
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
                description: { he: "על MSE, MAE ו-Cross Entropy כמצפן של הלמידה.", en: "MSE, MAE, and Cross Entropy as learning compasses." },
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
                description: { he: "שיפועים, קצב למידה והתכנסות: איך המודל משתפר.", en: "Slopes, learning rate, and convergence." },
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
                description: { he: "איך להפוך 'האם להמליץ למשתמש?' לשאלה מתמטית.", en: "Turning 'Should we recommend?' into math." },
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
                description: { he: "למה אסור להסתכל רק על ממוצע ואיך לא ליפול ב-Loss.", en: "Why relying on mean is dangerous." },
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
                description: { he: "בונים מודל רגרסיה מאפס: דאטה, Loss, ו-Gradient Descent.", en: "Building regression from scratch." },
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
        title: { he: "מאחורי הקלעים של AI", en: "Behind the Scenes of AI", ar: "ما وراء كواليس AI", ru: "AI за кулисами", es: "Entre bastidores de AI", ja: "AI の舞台裏" },
        description: { he: "מה קורה כשכותבים לצ'ט או ל-Agent", en: "What happens when you write to a chat or an agent", ar: "ما الذي يحدث عندما تكتب إلى محادثة أو وكيل", ru: "Что происходит, когда вы пишете в чат или агенту", es: "Qué ocurre cuando escribes a un chat o a un agente", ja: "チャットやエージェントに入力したとき、何が起きるのか" },
        chapters: [
            {
                id: 0,
                href: "/behind-the-scenes-ai/introduction",
                num: "מבוא",
                label: { he: "פתיח", en: "Intro", ar: "تمهيد", ru: "Вступление", es: "Apertura", ja: "イントロ" },
                title: { he: "מבוא: מה קורה מאחורי הקלעים של AI", en: "Intro: Behind the Scenes of AI", ar: "مقدّمة: ما الذي يحدث وراء كواليس AI", ru: "Введение: что происходит за кулисами AI", es: "Introducción: qué ocurre entre bastidores de AI", ja: "はじめに：AI の舞台裏で何が起きているのか" },
                description: { he: "מהקלט ועד התשובה: איך טקסט הופך לטוקנים, מספרים, הסתברויות והחלטה - ומה משתנה כשזה Agent.", en: "From input to answer: how text becomes tokens, numbers, probabilities and a decision.", ar: "من المُدخل إلى الجواب: كيف يتحوّل النص إلى توكنات وأرقام واحتمالات وقرار - وما الذي يتغيّر حين يكون وكيلًا (Agent).", ru: "От ввода до ответа: как текст превращается в токены, числа, вероятности и решение - и что меняется, когда это агент (Agent).", es: "De la entrada a la respuesta: cómo el texto se convierte en tokens, números, probabilidades y una decisión, y qué cambia cuando es un agente (Agent).", ja: "入力から答えまで：テキストがどのようにトークン、数値、確率、そして判断になるのか。そしてエージェント（Agent）になると何が変わるのか。" },
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
                description: { he: "אותו משפט, שני מצבי צפייה ושני מסלולי עיבוד: איך תשובה נולדת ב-Chat ואיך משימה מנוהלת ב-Agent.", en: "One sentence, two view modes and two processing paths.", ar: "الجملة نفسها، نمطا عرض ومساران للمعالجة: كيف يولد الجواب في Chat وكيف تُدار المهمة في Agent.", ru: "Одно предложение, два режима просмотра и два пути обработки: как рождается ответ в Chat и как управляется задача в Agent.", es: "La misma frase, dos modos de visualización y dos rutas de procesamiento: cómo nace una respuesta en Chat y cómo se gestiona una tarea en Agent.", ja: "同じ一文、二つの表示モードと二つの処理経路：Chat で答えがどう生まれ、Agent でタスクがどう進むのか。" },
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
                description: { he: "המודל לא מקבל את הכוונה שלכם אלא את הטקסט שכתבתם. נראה איך ניסוח, סדר, פיסוק ומה שחסר משנים את מה שיש למודל לעבוד איתו, עוד לפני כל עיבוד עמוק.", en: "The model does not receive your intention, it receives the text you wrote. We see how wording, order, punctuation and what is missing change the material the model works with, before any deeper processing.", ar: "النموذج لا يتلقّى نيّتك بل النص الذي كتبته. سنرى كيف تغيّر الصياغة والترتيب وعلامات الترقيم وما هو ناقص المادةَ التي يعمل عليها النموذج، قبل أي معالجة أعمق.", ru: "Модель получает не ваше намерение, а написанный вами текст. Посмотрим, как формулировка, порядок, пунктуация и то, чего не хватает, меняют материал, с которым работает модель, ещё до любой глубокой обработки.", es: "El modelo no recibe tu intención, sino el texto que escribiste. Veremos cómo la redacción, el orden, la puntuación y lo que falta cambian el material con el que trabaja el modelo, antes de cualquier procesamiento más profundo.", ja: "モデルはあなたの意図ではなく、あなたが書いたテキストを受け取る。言い回し、順序、句読点、そして欠けている情報が、深い処理の前にモデルが扱う材料をどう変えるのかを見ていく。" },
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
                description: { he: "המשפט לא נכנס למודל כמקשה אחת. לפני חישוב משמעות, הטקסט מתפרק ליחידות עבודה שנקראות טוקנים, וגם פיסוק, מספרים ורווחים משנים את הפירוק.", en: "The sentence does not enter the model as one block. Before meaning is computed, text breaks into work units called tokens, and punctuation, numbers and spaces all change the split.", ar: "لا تدخل الجملة إلى النموذج ككتلة واحدة. قبل حساب المعنى، يتفكّك النص إلى وحدات عمل تُسمّى توكنات، كما تغيّر علامات الترقيم والأرقام والمسافات طريقة التفكيك.", ru: "Предложение не входит в модель как единое целое. Перед вычислением смысла текст распадается на рабочие единицы - токены, а пунктуация, числа и пробелы меняют разбиение.", es: "La frase no entra en el modelo como un bloque único. Antes de calcular el significado, el texto se divide en unidades de trabajo llamadas tokens, y la puntuación, los números y los espacios cambian la división.", ja: "文はひとかたまりでモデルに入るわけではない。意味を計算する前に、テキストはトークンと呼ばれる作業単位に分解され、句読点・数字・スペースも分け方を変える。" },
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
                description: { he: "המנוע לא עובד עם מילים אלא עם מספרים. כל טוקן הופך ל-Token ID ואז לווקטור משמעות, וכך שני משפטים שונים יכולים להצביע לאותו כיוון.", en: "The engine works with numbers, not words. Each token becomes a Token ID and then a meaning vector, so two different sentences can point in the same direction.", ar: "لا يعمل المحرّك مع الكلمات بل مع الأرقام. يتحوّل كل توكن إلى Token ID ثم إلى متّجه معنى، وهكذا يمكن لجملتين مختلفتين أن تشيرا إلى الاتجاه نفسه.", ru: "Движок работает не со словами, а с числами. Каждый токен превращается в Token ID, а затем в вектор смысла, поэтому два разных предложения могут указывать в одном направлении.", es: "El motor no trabaja con palabras, sino con números. Cada token se convierte en un Token ID y luego en un vector de significado, así dos frases distintas pueden apuntar en la misma dirección.", ja: "エンジンは言葉ではなく数値で動く。各トークンは Token ID になり、さらに意味ベクトルになる。だから異なる二つの文が同じ方向を指すこともある。" },
                readTime: "13 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-cyan-500"
            },
            {
                id: 5,
                href: "/behind-the-scenes-ai/chapter-5",
                num: "05",
                label: { he: "מרחב המשמעות", en: "The Meaning Space", ar: "فضاء المعنى", ru: "Пространство смысла", es: "El espacio del significado", ja: "意味の空間" },
                title: { he: "הגיאומטריה של המשמעות", en: "The Geometry of Meaning", ar: "هندسة المعنى", ru: "Геометрия смысла", es: "La geometría del significado", ja: "意味の幾何学" },
                description: { he: "וקטור הוא לא רק רשימת מספרים, הוא נקודה וחץ במרחב. כאן נבין למה הכיוון חשוב יותר מהמרחק, איך מילים קרובות במשמעות שוכנות באותו אזור, ומהי אנלוגיה בין וקטורים.", en: "A vector is not just a list of numbers, it is a point and an arrow in space. Here we see why direction matters more than distance, how words close in meaning sit in the same region, and what a vector analogy is.", ar: "المتّجه ليس مجرّد قائمة أرقام، بل نقطة وسهم في الفضاء. هنا نفهم لماذا الاتجاه أهمّ من المسافة، وكيف تسكن الكلمات المتقاربة في المعنى المنطقة نفسها، وما هو التناظر بين المتّجهات.", ru: "Вектор - это не просто список чисел, а точка и стрелка в пространстве. Здесь мы поймём, почему направление важнее расстояния, как близкие по смыслу слова находятся в одной области и что такое аналогия между векторами.", es: "Un vector no es solo una lista de números, es un punto y una flecha en el espacio. Aquí entenderemos por qué la dirección importa más que la distancia, cómo las palabras cercanas en significado ocupan la misma región y qué es una analogía entre vectores.", ja: "ベクトルは単なる数値の列ではなく、空間内の点であり矢印でもある。ここでは、なぜ距離より方向が重要なのか、意味の近い言葉がなぜ同じ領域に集まるのか、そしてベクトル間のアナロジーとは何かを理解する。" },
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
                title: { he: "Attention, מי חשוב עכשיו", en: "Attention, Who Matters Now", ar: "Attention: ما المهمّ الآن", ru: "Attention: что важно сейчас", es: "Attention: qué importa ahora", ja: "Attention：いま重要なのは何か" },
                description: { he: "המשפט כולו מול המודל, אבל לא כל מילה חשובה באותה מידה. Attention הוא מנגנון יחסים דינמי שמחליט, בכל רגע, אילו חלקים בהקשר מושכים יותר משקל.", en: "The whole sentence is in front of the model, but not every word matters equally. Attention is a dynamic relationship mechanism that decides, at each moment, which parts of the context draw more weight.", ar: "الجملة كلّها أمام النموذج، لكن ليست كل كلمة بالأهمّية نفسها. Attention آلية علاقات ديناميكية تقرّر، في كل لحظة، أيّ أجزاء السياق تجذب وزنًا أكبر.", ru: "Всё предложение перед моделью, но не каждое слово одинаково важно. Attention - это динамический механизм связей, который в каждый момент решает, какие части контекста получают больший вес.", es: "Toda la frase está ante el modelo, pero no toda palabra importa por igual. Attention es un mecanismo dinámico de relaciones que decide, en cada momento, qué partes del contexto reciben más peso.", ja: "文の全体がモデルの前にあるが、すべての語が同じだけ重要なわけではない。Attention は、その瞬間ごとに文脈のどの部分がより大きな重みを引くかを決める動的な関係の仕組みだ。" },
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
                description: { he: "המודל לא מחזיק את כל מה שנאמר אי פעם. בכל רגע יש לו חלון הקשר מוגבל, וזה קובע מה נכנס לחישוב, מה עדיין משפיע, ומה כבר נפל מחוץ לתמונה. פרק זה עדיין בבנייה.", en: "The model does not hold everything that was ever said. At any moment it has a limited context window, and that decides what enters the computation, what still has influence, and what has already fallen out of the picture. This chapter is still under construction.", ar: "لا يحتفظ النموذج بكل ما قيل يومًا. في كل لحظة لديه نافذة سياق محدودة، وهي تحدّد ما يدخل في الحساب، وما لا يزال مؤثّرًا، وما سقط بالفعل خارج الصورة. هذا الفصل لا يزال قيد الإنشاء.", ru: "Модель не хранит всё, что когда-либо было сказано. В каждый момент у неё ограниченное окно контекста, и оно определяет, что попадает в вычисление, что ещё влияет, а что уже выпало из картины. Эта глава пока в разработке.", es: "El modelo no guarda todo lo que se dijo alguna vez. En cada momento tiene una ventana de contexto limitada, y eso decide qué entra en el cálculo, qué sigue influyendo y qué ya quedó fuera de la imagen. Este capítulo todavía está en construcción.", ja: "モデルはこれまで言われたすべてを保持しているわけではない。どの瞬間にも限られたコンテキストウィンドウしか持たず、それが計算に入るもの、まだ影響するもの、すでに範囲外に落ちたものを決める。この章はまだ作成中です。" },
                readTime: "5 דקות",
                labelColor: "text-slate-400",
                colorFrom: "from-slate-400",
                colorTo: "to-slate-600"
            },
            {
                id: 8,
                href: "/behind-the-scenes-ai/chapter-8",
                num: "08",
                label: { he: "Logits & Softmax", en: "Logits & Softmax", ar: "Logits & Softmax", ru: "Logits & Softmax", es: "Logits & Softmax", ja: "Logits & Softmax" },
                title: { he: "Logits & Softmax: מציונים להסתברויות", en: "Logits & Softmax: From Scores to Probabilities", ar: "Logits & Softmax: من الدرجات إلى الاحتمالات", ru: "Logits & Softmax: от оценок к вероятностям", es: "Logits & Softmax: de puntuaciones a probabilidades", ja: "Logits & Softmax：スコアから確率へ" },
                description: { he: "המודל לא מחזיר אמת מוחלטת. הוא מדרג אפשרויות ובוחר את מה שנראה הכי סביר.", en: "The model does not return absolute truth. It ranks possible options and chooses what looks most likely.", ar: "لا يعيد النموذج حقيقة مطلقة. إنّه يرتّب الاحتمالات ويختار ما يبدو الأرجح.", ru: "Модель не возвращает абсолютную истину. Она ранжирует варианты и выбирает наиболее вероятный.", es: "El modelo no devuelve una verdad absoluta. Clasifica las opciones posibles y elige la que parece más probable.", ja: "モデルは絶対的な真実を返すわけではない。候補を順位づけし、最もありそうなものを選ぶ。" },
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
                description: { he: "אחרי שיש הסתברויות, המודל עדיין צריך לבחור טוקן אחד. כאן נראה איך הבחירה נעשית, ולמה אותה התפלגות יכולה להוביל לתשובות שונות. פרק זה עדיין בבנייה.", en: "Once there are probabilities, the model still has to choose a single token. Here we see how the choice is made, and why the same distribution can lead to different answers. This chapter is still under construction.", ar: "بعد أن تتوفّر الاحتمالات، لا يزال على النموذج أن يختار توكنًا واحدًا. هنا نرى كيف يُتّخذ الاختيار، ولماذا قد يقود التوزيع نفسه إلى إجابات مختلفة. هذا الفصل لا يزال قيد الإنشاء.", ru: "Когда вероятности уже есть, модель всё ещё должна выбрать один токен. Здесь мы увидим, как делается выбор и почему одно и то же распределение может приводить к разным ответам. Эта глава пока в разработке.", es: "Una vez que hay probabilidades, el modelo todavía tiene que elegir un solo token. Aquí vemos cómo se toma la decisión y por qué la misma distribución puede llevar a respuestas distintas. Este capítulo todavía está en construcción.", ja: "確率が出そろっても、モデルはなお一つのトークンを選ばなければならない。ここでは、その選択がどう行われるのか、そして同じ分布がなぜ異なる答えにつながりうるのかを見ていく。この章はまだ作成中です。" },
                readTime: "5 דקות",
                labelColor: "text-slate-400",
                colorFrom: "from-slate-400",
                colorTo: "to-slate-600"
            },
            {
                id: 10,
                href: "/behind-the-scenes-ai/chapter-10",
                num: "10",
                label: { he: "איך AI בונה תשובה", en: "Word by Word", ar: "كيف يبني AI جوابًا", ru: "Как AI строит ответ", es: "Cómo AI construye una respuesta", ja: "AI はどう答えを組み立てるか" },
                title: { he: "איך AI בונה תשובה", en: "Every Word Moves the Engine", ar: "كيف يبني AI جوابًا", ru: "Как AI строит ответ", es: "Cómo AI construye una respuesta", ja: "AI はどう答えを組み立てるか" },
                description: { he: "התשובה לא נולדת בבת אחת. המודל בונה אותה בלולאה, וכל חלק שנכתב מצטרף להקשר ומשפיע על החלק הבא.", en: "A sentence does not enter as one block. It is built word by word, and each word moves the probability, the confidence, and the decision.", ar: "لا يولد الجواب دفعة واحدة. يبنيه النموذج في حلقة، وكل جزء يُكتب ينضمّ إلى السياق ويؤثّر في الجزء التالي.", ru: "Ответ не рождается сразу. Модель строит его в цикле, и каждая написанная часть входит в контекст и влияет на следующую.", es: "La respuesta no nace de golpe. El modelo la construye en un bucle, y cada parte escrita se suma al contexto e influye en la siguiente.", ja: "答えは一度に生まれるわけではない。モデルはループの中で組み立て、書かれた各部分が文脈に加わり、次の部分に影響する。" },
                readTime: "12 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-fuchsia-500"
            },
            {
                id: 11,
                href: "/behind-the-scenes-ai/chapter-11",
                num: "11",
                label: { he: "בחירת כלי", en: "Tool Selection", ar: "اختيار الأداة", ru: "Выбор инструмента", es: "Selección de herramienta", ja: "ツールの選択" },
                title: { he: "בחירת Tool - מתי Agent צריך כלי", en: "Tool Selection - When an Agent Needs a Tool", ar: "اختيار Tool: متى يحتاج Agent إلى أداة", ru: "Выбор Tool - когда Agent нужен инструмент", es: "Selección de Tool: cuándo un Agent necesita una herramienta", ja: "Tool の選択：Agent はいつツールを必要とするか" },
                description: { he: "Agent לא אמור לנחש מידע שאפשר לבדוק בכלי, אבל גם לא להשתמש בכלי כשלא צריך. בחירת כלי היא החלטה רב-גורמית: התאמה, נתונים, סיכון והרשאה.", en: "An agent should not guess data a tool could check, but also should not use a tool when none is needed. Tool selection is a multi-factor decision: match, data, risk, and permission.", ar: "لا ينبغي لـ Agent أن يخمّن معلومات يمكن التحقّق منها بأداة، ولا أن يستخدم أداة دون حاجة. اختيار الأداة قرار متعدّد العوامل: الملاءمة والبيانات والمخاطرة والإذن.", ru: "Agent не должен угадывать данные, которые можно проверить инструментом, но и не должен использовать инструмент без надобности. Выбор инструмента - многофакторное решение: соответствие, данные, риск и разрешение.", es: "Un Agent no debería adivinar datos que puede comprobar con una herramienta, pero tampoco usar una herramienta cuando no hace falta. Elegir una herramienta es una decisión multifactor: ajuste, datos, riesgo y permiso.", ja: "Agent はツールで確認できる情報を当てずっぽうで埋めるべきではないが、不要なときにツールを使うべきでもない。ツールの選択は、適合・データ・リスク・権限という多要素の判断だ。" },
                readTime: "15 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-emerald-500"
            },
            {
                id: 12,
                href: "/behind-the-scenes-ai/chapter-12",
                num: "12",
                label: { he: "הפעלת כלי ותוצאה", en: "Tool Call and Observation", ar: "استدعاء الأداة والملاحظة", ru: "Вызов инструмента и наблюдение", es: "Llamada a herramienta y observación", ja: "ツール呼び出しと観測" },
                title: { he: "Tool Call, Observation והחלטה הבאה", en: "Tool Call, Observation and the Next Decision", ar: "Tool Call وObservation والقرار التالي", ru: "Tool Call, Observation и следующее решение", es: "Tool Call, Observation y la siguiente decisión", ja: "Tool Call、Observation、そして次の判断" },
                description: { he: "Agent פועל בלולאה: מחליט, מפעיל כלי, קורא תוצאה, ומחליט שוב. Tool Call אינו סוף הסיפור, הוא רק דרך להביא Observation חדשה.", en: "An agent works in a loop: it decides, calls a tool, reads the result, and decides again. A tool call is not the end of the story, only a way to bring a new observation.", ar: "يعمل Agent في حلقة: يقرّر، يستدعي أداة، يقرأ النتيجة، ثم يقرّر من جديد. ليس Tool Call نهاية القصّة، بل طريقة لجلب Observation جديدة.", ru: "Agent работает в цикле: решает, вызывает инструмент, читает результат и снова решает. Tool Call - не конец истории, а лишь способ получить новое Observation.", es: "Un Agent trabaja en un bucle: decide, llama a una herramienta, lee el resultado y vuelve a decidir. Un Tool Call no es el final de la historia, solo una forma de traer una nueva Observation.", ja: "Agent はループで動く：判断し、ツールを呼び、結果を読み、また判断する。Tool Call は物語の終わりではなく、新しい Observation を得る手段にすぎない。" },
                readTime: "15 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-teal-500"
            },
            {
                id: 13,
                href: "/behind-the-scenes-ai/chapter-13",
                num: "13",
                label: { he: "עצירה ואחריות", en: "Stop and Responsibility", ar: "التوقّف والمسؤولية", ru: "Остановка и ответственность", es: "Detenerse y responsabilidad", ja: "停止と責任" },
                title: { he: "עצירה, אישור ואחריות", en: "Stopping, Approval and Responsibility", ar: "التوقّف والموافقة والمسؤولية", ru: "Остановка, одобрение и ответственность", es: "Detenerse, aprobación y responsabilidad", ja: "停止、承認、そして責任" },
                description: { he: "Agent טוב יודע מתי לפעול ומתי לעצור. ככל שהוא קרוב יותר לפעולה אמיתית בעולם, כך הוא צריך יותר בקרה, הרשאה ואחריות. עצירה אינה כישלון.", en: "A good agent knows when to act and when to stop. The closer it gets to real-world action, the more control, permission, and responsibility it needs. Stopping is not failure.", ar: "يعرف Agent الجيّد متى يتصرّف ومتى يتوقّف. وكلّما اقترب من فعل حقيقي في العالم، احتاج إلى مزيد من الرقابة والإذن والمسؤولية. التوقّف ليس فشلًا.", ru: "Хороший Agent знает, когда действовать и когда остановиться. Чем ближе он к реальному действию в мире, тем больше нужны контроль, разрешение и ответственность. Остановка - не провал.", es: "Un buen Agent sabe cuándo actuar y cuándo detenerse. Cuanto más cerca está de una acción real en el mundo, más control, permiso y responsabilidad necesita. Detenerse no es un fracaso.", ja: "良い Agent は、行動するときと止まるときを知っている。現実世界での実際の行動に近づくほど、より多くの制御・権限・責任が必要になる。止まることは失敗ではない。" },
                readTime: "15 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-rose-500"
            },
            {
                id: 14,
                href: "/behind-the-scenes-ai/chapter-14",
                num: "14",
                label: { he: "המעבדה המאוחדת", en: "The Unified Lab", ar: "المختبر الموحّد", ru: "Объединённая лаборатория", es: "El laboratorio unificado", ja: "統合ラボ" },
                title: { he: "Behind the Scenes Lab - המודל וה-Agent על אותו מסך", en: "Behind the Scenes Lab - The Model and the Agent on One Screen", ar: "Behind the Scenes Lab: النموذج وAgent على الشاشة نفسها", ru: "Behind the Scenes Lab - модель и Agent на одном экране", es: "Behind the Scenes Lab: el modelo y el Agent en una sola pantalla", ja: "Behind the Scenes Lab：モデルと Agent を一つの画面で" },
                description: { he: "פרק השיא: כל החלקים מתאחדים למעבדה אחת, שבה אותו קלט מפעיל מנוע תשובה (Chat) או מנוע פעולה (Agent). לא ראינו רק תשובה, ראינו איך היא נבנתה.", en: "The capstone: all the parts unite into one lab where the same input drives an answer engine (Chat) or an action engine (Agent). We did not just see an answer, we saw how it was built.", ar: "فصل الذروة: تتّحد كل الأجزاء في مختبر واحد، حيث يُشغّل المُدخل نفسه محرّك جواب (Chat) أو محرّك فعل (Agent). لم نرَ جوابًا فحسب، بل رأينا كيف بُني.", ru: "Кульминационная глава: все части соединяются в одну лабораторию, где один и тот же ввод запускает движок ответа (Chat) или движок действия (Agent). Мы увидели не просто ответ, а то, как он был построен.", es: "El capítulo culminante: todas las partes se unen en un solo laboratorio, donde la misma entrada activa un motor de respuesta (Chat) o un motor de acción (Agent). No vimos solo una respuesta, vimos cómo se construyó.", ja: "クライマックスの章：すべての部品が一つのラボに統合され、同じ入力が答えのエンジン（Chat）か行動のエンジン（Agent）を動かす。私たちは答えだけでなく、それがどう組み立てられたかを見た。" },
                readTime: "16 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-cyan-500"
            },
            {
                id: 15,
                href: "/behind-the-scenes-ai/chapter-15",
                num: "15",
                label: { he: "האם AI לומד מטעויות", en: "Does AI Learn from Mistakes", ar: "هل يتعلّم AI من الأخطاء", ru: "Учится ли AI на ошибках", es: "¿AI aprende de los errores?", ja: "AI は間違いから学ぶのか" },
                title: { he: "האם AI לומד מהטעויות שלך", en: "Does AI Learn From Your Mistakes", ar: "هل يتعلّم AI من أخطائك", ru: "Учится ли AI на ваших ошибках", es: "¿AI aprende de tus errores?", ja: "AI はあなたの間違いから学ぶのか" },
                description: { he: "כשאתה מדבר עם המודל הוא לא לומד ממך. המשקלים שלו קפואים, והתיקון שלך חי רק כל עוד הוא בהקשר, ונעלם כשהשיחה נגמרת. אבל זו לא כל התמונה: יש שלוש שכבות למידה שונות.", en: "When you talk to the model it does not learn from you. Its weights are frozen, and your correction lives only while it is in context, and vanishes when the conversation ends. But that is not the whole picture: there are three different layers of learning.", ar: "حين تتحدّث إلى النموذج فهو لا يتعلّم منك. أوزانه مجمّدة، وتصحيحك يحيا فقط ما دام في السياق، ويختفي حين تنتهي المحادثة. لكن هذه ليست الصورة كاملة: هناك ثلاث طبقات تعلّم مختلفة.", ru: "Когда вы говорите с моделью, она не учится у вас. Её веса заморожены, и ваша поправка живёт, лишь пока она в контексте, и исчезает с концом разговора. Но это не вся картина: есть три разных слоя обучения.", es: "Cuando hablas con el modelo, no aprende de ti. Sus pesos están congelados, y tu corrección vive solo mientras está en el contexto, y desaparece cuando termina la conversación. Pero esa no es toda la imagen: hay tres capas de aprendizaje distintas.", ja: "あなたがモデルと話しても、モデルはあなたから学ばない。重みは凍結されており、あなたの訂正は文脈にある間だけ生き、会話が終わると消える。だがそれが全体像ではない：学習には三つの異なる層がある。" },
                readTime: "11 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-amber-500"
            },
            {
                id: 16,
                href: "/behind-the-scenes-ai/chapter-16",
                num: "16",
                label: { he: "לעבוד נכון עם AI", en: "Working Well with AI", ar: "العمل الصحيح مع AI", ru: "Как правильно работать с AI", es: "Trabajar bien con AI", ja: "AI と上手に付き合う" },
                title: { he: "איך לעבוד נכון עם מודל ו-Agent", en: "How to Work Well with a Model and an Agent", ar: "كيف تعمل بشكل صحيح مع نموذج وAgent", ru: "Как правильно работать с моделью и Agent", es: "Cómo trabajar bien con un modelo y un Agent", ja: "モデルと Agent と上手に付き合う方法" },
                description: { he: "פרק הסיום: מי שמבין מה קורה מאחורי הקלעים יודע לנסח בקשות טובות יותר, לזהות מגבלות, ולבחור נכון בין Chat לבין Agent. כתיבה טובה היא הגדרה, לא קסם.", en: "The closing chapter: whoever understands what happens behind the scenes writes better requests, recognizes limits, and chooses well between Chat and Agent. Good writing is definition, not magic.", ar: "الفصل الختامي: من يفهم ما يحدث وراء الكواليس يعرف كيف يصوغ طلبات أفضل، ويتبيّن الحدود، ويختار بصواب بين Chat وAgent. الكتابة الجيّدة تعريف، لا سحر.", ru: "Заключительная глава: тот, кто понимает, что происходит за кулисами, умеет формулировать лучшие запросы, видит ограничения и верно выбирает между Chat и Agent. Хорошая формулировка - это определение, а не магия.", es: "El capítulo final: quien entiende lo que ocurre entre bastidores sabe formular mejores peticiones, reconoce los límites y elige bien entre Chat y Agent. Escribir bien es definir, no magia.", ja: "締めくくりの章：舞台裏で何が起きているかを理解している人は、より良い依頼を書き、限界を見極め、Chat と Agent を正しく選べる。良い文章とは定義であって、魔法ではない。" },
                readTime: "14 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-teal-500"
            }
        ]
    }
};