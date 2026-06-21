// src/lib/courseData.ts

export type Language = 'he' | 'en';

export interface ChapterData {
    id: number;
    num: string;
    // טקסטים בשתי שפות
    label: { he: string; en: string };
    title: { he: string; en: string };
    description: { he: string; en: string };
    readTime: string;
    
    // עיצוב מלא
    labelColor: string; // למשל: "text-blue-400"
    colorFrom: string;  // למשל: "from-blue-400"
    colorTo: string;    // למשל: "to-indigo-500"
    
    href?: string;
}

export interface CourseData {
    id: string;
    title: { he: string; en: string };
    description: { he: string; en: string };
    chapters: ChapterData[];
}

export const courses: Record<string, CourseData> = {
    
    // --- קורס 1: מתמטיקה אינטואיטיבית ---
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

    // --- קורס 2: פייתון פרקטי ---
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
                description: { he: "למה הספר הזה נכתב למתכנתים מנוסים ולא למתחילים.", en: "Why this book is for experienced devs." },
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

    // --- קורס 3: מתמטיקה והיגיון הסתברותי ---
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

    // --- קורס 4: מאחורי הקלעים של AI ---
    "behind-the-scenes-ai": {
        id: "behind-the-scenes-ai",
        title: { he: "מאחורי הקלעים של AI", en: "Behind the Scenes of AI" },
        description: { he: "מה קורה כשכותבים לצ'ט או ל-Agent", en: "What happens when you write to a chat or an agent" },
        chapters: [
            {
                id: 0,
                href: "/behind-the-scenes-ai/introduction",
                num: "מבוא",
                label: { he: "פתיח", en: "Intro" },
                title: { he: "מבוא: מה קורה מאחורי הקלעים של AI", en: "Intro: Behind the Scenes of AI" },
                description: { he: "מהקלט ועד התשובה: איך טקסט הופך לטוקנים, מספרים, הסתברויות והחלטה - ומה משתנה כשזה Agent.", en: "From input to answer: how text becomes tokens, numbers, probabilities and a decision." },
                readTime: "6 דקות",
                labelColor: "text-cyan-400",
                colorFrom: "from-cyan-400",
                colorTo: "to-blue-500"
            },
            {
                id: 1,
                href: "/behind-the-scenes-ai/chapter-1",
                num: "פרק 1",
                label: { he: "הדרך אל התשובה", en: "The Path to the Answer" },
                title: { he: "לא רק תשובה - הדרך שמאחורי התשובה", en: "Not Just an Answer - The Path Behind It" },
                description: { he: "אותו משפט, שני מצבי צפייה ושני מסלולי עיבוד: איך תשובה נולדת ב-Chat ואיך משימה מנוהלת ב-Agent.", en: "One sentence, two view modes and two processing paths." },
                readTime: "8 דקות",
                labelColor: "text-blue-400",
                colorFrom: "from-blue-400",
                colorTo: "to-indigo-500"
            },
            {
                id: 2,
                href: "/behind-the-scenes-ai/chapter-2",
                num: "פרק 2",
                label: { he: "ההחלטה הראשונה", en: "The First Decision" },
                title: { he: "שאלה, בדיקה או פעולה - ההחלטה הראשונה של המנוע", en: "Question, Check or Action - The Engine's First Decision" },
                description: { he: "אותו נושא, שלושה ניסוחים, ארבעה מסלולים: איך כוונת הבקשה קובעת לאן המנוע מנתב אותה.", en: "Same topic, three phrasings, four routes: how intent decides where the engine sends a request." },
                readTime: "8 דקות",
                labelColor: "text-indigo-400",
                colorFrom: "from-indigo-400",
                colorTo: "to-violet-500"
            },
            {
                id: 3,
                href: "/behind-the-scenes-ai/chapter-3",
                num: "03",
                label: { he: "הלב ההסתברותי", en: "The Probabilistic Heart" },
                title: { he: "AI כמנוע הסתברותי", en: "AI as a Probabilistic Engine" },
                description: { he: "המודל לא מחזיר אמת מוחלטת. הוא מדרג אפשרויות ובוחר את מה שנראה הכי סביר.", en: "The model does not return absolute truth. It ranks possible options and chooses what looks most likely." },
                readTime: "9 דקות",
                labelColor: "text-purple-400",
                colorFrom: "from-purple-400",
                colorTo: "to-emerald-500"
            },
            {
                id: 4,
                href: "/behind-the-scenes-ai/chapter-4",
                num: "04",
                label: { he: "מילה אחר מילה", en: "Word by Word" },
                title: { he: "כל מילה מזיזה את המנוע", en: "Every Word Moves the Engine" },
                description: { he: "משפט לא נכנס כגוש אחד. הוא נבנה מילה אחר מילה, וכל מילה מזיזה את ההסתברות, את הביטחון ואת ההחלטה.", en: "A sentence does not enter as one block. It is built word by word, and each word moves the probability, the confidence, and the decision." },
                readTime: "12 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-fuchsia-500"
            },
            {
                id: 5,
                href: "/behind-the-scenes-ai/chapter-5",
                num: "05",
                label: { he: "טקסט מתפרק", en: "Text Splits" },
                title: { he: "Tokenization - הטקסט מתפרק לחלקים", en: "Tokenization - Text Splits Into Parts" },
                description: { he: "AI לא מתחיל בלהבין, הוא מתחיל בלפרק. לפני חישוב המשמעות, הטקסט הופך ליחידות עבודה שנקראות Tokens.", en: "AI does not start by understanding, it starts by splitting. Before meaning, text becomes work units called Tokens." },
                readTime: "11 דקות",
                labelColor: "text-fuchsia-400",
                colorFrom: "from-fuchsia-400",
                colorTo: "to-violet-500"
            },
            {
                id: 6,
                href: "/behind-the-scenes-ai/chapter-6",
                num: "06",
                label: { he: "ממילים למספרים", en: "Words to Numbers" },
                title: { he: "ממילים למספרים ולמשמעות", en: "From Words to Numbers to Meaning" },
                description: { he: "המנוע לא עובד עם מילים אלא עם מספרים. כל טוקן הופך ל-Token ID ואז לווקטור משמעות, וכך שני משפטים שונים יכולים להצביע לאותו כיוון.", en: "The engine works with numbers, not words. Each token becomes a Token ID and then a meaning vector, so two different sentences can point in the same direction." },
                readTime: "13 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-cyan-500"
            },
            {
                id: 7,
                href: "/behind-the-scenes-ai/chapter-7",
                num: "07",
                label: { he: "דמיון וציונים", en: "Similarity and Scores" },
                title: { he: "דמיון, ציונים והסתברויות", en: "Similarity, Scores and Probabilities" },
                description: { he: "המערכת משווה, מדרגת, ואז הופכת ציונים להסתברויות. האחוזים אינם קסם, הם השלב האחרון בשרשרת חישובים שלמה.", en: "The system compares, ranks, then turns scores into probabilities. The percentages are not magic, they are the final step in a full computation chain." },
                readTime: "15 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-emerald-500"
            }
        ]
    }
};