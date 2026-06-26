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
                label: { he: "מה באמת נכנס למודל", en: "What Really Enters the Model" },
                title: { he: "מה באמת נכנס למודל", en: "What Really Enters the Model" },
                description: { he: "המודל לא מקבל את הכוונה שלכם אלא את הטקסט שכתבתם. נראה איך ניסוח, סדר, פיסוק ומה שחסר משנים את מה שיש למודל לעבוד איתו, עוד לפני כל עיבוד עמוק.", en: "The model does not receive your intention, it receives the text you wrote. We see how wording, order, punctuation and what is missing change the material the model works with, before any deeper processing." },
                readTime: "8 דקות",
                labelColor: "text-indigo-400",
                colorFrom: "from-indigo-400",
                colorTo: "to-violet-500"
            },
            {
                id: 3,
                href: "/behind-the-scenes-ai/chapter-3",
                num: "03",
                label: { he: "Tokenization, הטקסט מתפרק", en: "Tokenization" },
                title: { he: "Tokenization, הטקסט מתפרק", en: "Tokenization - Text Splits Into Units" },
                description: { he: "המשפט לא נכנס למודל כמקשה אחת. לפני חישוב משמעות, הטקסט מתפרק ליחידות עבודה שנקראות טוקנים, וגם פיסוק, מספרים ורווחים משנים את הפירוק.", en: "The sentence does not enter the model as one block. Before meaning is computed, text breaks into work units called tokens, and punctuation, numbers and spaces all change the split." },
                readTime: "11 דקות",
                labelColor: "text-fuchsia-400",
                colorFrom: "from-fuchsia-400",
                colorTo: "to-violet-500"
            },
            {
                id: 4,
                href: "/behind-the-scenes-ai/chapter-4",
                num: "04",
                label: { he: "AI כמנוע הסתברותי", en: "The Probabilistic Heart" },
                title: { he: "AI כמנוע הסתברותי", en: "AI as a Probabilistic Engine" },
                description: { he: "המודל לא מחזיר אמת מוחלטת. הוא מדרג אפשרויות ובוחר את מה שנראה הכי סביר.", en: "The model does not return absolute truth. It ranks possible options and chooses what looks most likely." },
                readTime: "9 דקות",
                labelColor: "text-purple-400",
                colorFrom: "from-purple-400",
                colorTo: "to-emerald-500"
            },
            {
                id: 5,
                href: "/behind-the-scenes-ai/chapter-5",
                num: "05",
                label: { he: "איך AI בונה תשובה", en: "Word by Word" },
                title: { he: "איך AI בונה תשובה", en: "Every Word Moves the Engine" },
                description: { he: "התשובה לא נולדת בבת אחת. המודל בונה אותה בלולאה, וכל חלק שנכתב מצטרף להקשר ומשפיע על החלק הבא.", en: "A sentence does not enter as one block. It is built word by word, and each word moves the probability, the confidence, and the decision." },
                readTime: "12 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-fuchsia-500"
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
                label: { he: "מרחב המשמעות", en: "The Meaning Space" },
                title: { he: "הגיאומטריה של המשמעות", en: "The Geometry of Meaning" },
                description: { he: "וקטור הוא לא רק רשימת מספרים, הוא נקודה וחץ במרחב. כאן נבין למה הכיוון חשוב יותר מהמרחק, איך מילים קרובות במשמעות שוכנות באותו אזור, ומהי אנלוגיה בין וקטורים.", en: "A vector is not just a list of numbers, it is a point and an arrow in space. Here we see why direction matters more than distance, how words close in meaning sit in the same region, and what a vector analogy is." },
                readTime: "12 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-fuchsia-500"
            },
            {
                id: 8,
                href: "/behind-the-scenes-ai/chapter-8",
                num: "08",
                label: { he: "מי חשוב עכשיו", en: "Who Matters Now" },
                title: { he: "Attention, מי חשוב עכשיו", en: "Attention, Who Matters Now" },
                description: { he: "המשפט כולו מול המודל, אבל לא כל מילה חשובה באותה מידה. Attention הוא מנגנון יחסים דינמי שמחליט, בכל רגע, אילו חלקים בהקשר מושכים יותר משקל.", en: "The whole sentence is in front of the model, but not every word matters equally. Attention is a dynamic relationship mechanism that decides, at each moment, which parts of the context draw more weight." },
                readTime: "12 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-emerald-500"
            },
            {
                id: 9,
                href: "/behind-the-scenes-ai/chapter-9",
                num: "09",
                label: { he: "מתי לענות ומתי לעצור", en: "When to Answer or Stop" },
                title: { he: "Confidence - מתי לענות ומתי לעצור", en: "Confidence - When to Answer and When to Stop" },
                description: { he: "מודל טוב לא רק יודע לענות, הוא יודע מתי לא לענות. הביטחון אינו רק מספר, הוא שער החלטה שמכריע אם הפער מספיק כדי לפעול.", en: "A good model not only knows how to answer, it knows when not to. Confidence is not just a number, it is a decision gate that decides whether the margin is enough to act." },
                readTime: "14 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-teal-500"
            },
            {
                id: 10,
                href: "/behind-the-scenes-ai/chapter-10",
                num: "10",
                label: { he: "מ-Prompt למשימה", en: "From Prompt to Task" },
                title: { he: "מ-Prompt למשימה - איך Agent מבין מה לעשות", en: "From Prompt to Task - How an Agent Understands What to Do" },
                description: { he: "מילה אחת מהפכת שאלה למשימה. Agent מתחיל בלהבין את המשימה: מה המטרה, מה חסר, ומה מותר. זיהוי משימה אינו אישור לפעול.", en: "One word turns a question into a task. An agent starts by understanding the task: the goal, what is missing, and what is allowed. Detecting a task is not approval to act." },
                readTime: "14 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-fuchsia-500"
            },
            {
                id: 11,
                href: "/behind-the-scenes-ai/chapter-11",
                num: "11",
                label: { he: "בחירת כלי", en: "Tool Selection" },
                title: { he: "בחירת Tool - מתי Agent צריך כלי", en: "Tool Selection - When an Agent Needs a Tool" },
                description: { he: "Agent לא אמור לנחש מידע שאפשר לבדוק בכלי, אבל גם לא להשתמש בכלי כשלא צריך. בחירת כלי היא החלטה רב-גורמית: התאמה, נתונים, סיכון והרשאה.", en: "An agent should not guess data a tool could check, but also should not use a tool when none is needed. Tool selection is a multi-factor decision: match, data, risk, and permission." },
                readTime: "15 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-emerald-500"
            },
            {
                id: 12,
                href: "/behind-the-scenes-ai/chapter-12",
                num: "12",
                label: { he: "הפעלת כלי ותוצאה", en: "Tool Call and Observation" },
                title: { he: "Tool Call, Observation והחלטה הבאה", en: "Tool Call, Observation and the Next Decision" },
                description: { he: "Agent פועל בלולאה: מחליט, מפעיל כלי, קורא תוצאה, ומחליט שוב. Tool Call אינו סוף הסיפור, הוא רק דרך להביא Observation חדשה.", en: "An agent works in a loop: it decides, calls a tool, reads the result, and decides again. A tool call is not the end of the story, only a way to bring a new observation." },
                readTime: "15 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-teal-500"
            },
            {
                id: 13,
                href: "/behind-the-scenes-ai/chapter-13",
                num: "13",
                label: { he: "עצירה ואחריות", en: "Stop and Responsibility" },
                title: { he: "עצירה, אישור ואחריות", en: "Stopping, Approval and Responsibility" },
                description: { he: "Agent טוב יודע מתי לפעול ומתי לעצור. ככל שהוא קרוב יותר לפעולה אמיתית בעולם, כך הוא צריך יותר בקרה, הרשאה ואחריות. עצירה אינה כישלון.", en: "A good agent knows when to act and when to stop. The closer it gets to real-world action, the more control, permission, and responsibility it needs. Stopping is not failure." },
                readTime: "15 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-rose-500"
            },
            {
                id: 14,
                href: "/behind-the-scenes-ai/chapter-14",
                num: "14",
                label: { he: "המעבדה המאוחדת", en: "The Unified Lab" },
                title: { he: "Behind the Scenes Lab - המודל וה-Agent על אותו מסך", en: "Behind the Scenes Lab - The Model and the Agent on One Screen" },
                description: { he: "פרק השיא: כל החלקים מתאחדים למעבדה אחת, שבה אותו קלט מפעיל מנוע תשובה (Chat) או מנוע פעולה (Agent). לא ראינו רק תשובה, ראינו איך היא נבנתה.", en: "The capstone: all the parts unite into one lab where the same input drives an answer engine (Chat) or an action engine (Agent). We did not just see an answer, we saw how it was built." },
                readTime: "16 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-cyan-500"
            },
            {
                id: 15,
                href: "/behind-the-scenes-ai/chapter-15",
                num: "15",
                label: { he: "האם AI לומד מטעויות", en: "Does AI Learn from Mistakes" },
                title: { he: "האם AI לומד מהטעויות שלך", en: "Does AI Learn From Your Mistakes" },
                description: { he: "כשאתה מדבר עם המודל הוא לא לומד ממך. המשקלים שלו קפואים, והתיקון שלך חי רק כל עוד הוא בהקשר, ונעלם כשהשיחה נגמרת. אבל זו לא כל התמונה: יש שלוש שכבות למידה שונות.", en: "When you talk to the model it does not learn from you. Its weights are frozen, and your correction lives only while it is in context, and vanishes when the conversation ends. But that is not the whole picture: there are three different layers of learning." },
                readTime: "11 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-amber-500"
            },
            {
                id: 16,
                href: "/behind-the-scenes-ai/chapter-16",
                num: "16",
                label: { he: "לעבוד נכון עם AI", en: "Working Well with AI" },
                title: { he: "איך לעבוד נכון עם מודל ו-Agent", en: "How to Work Well with a Model and an Agent" },
                description: { he: "פרק הסיום: מי שמבין מה קורה מאחורי הקלעים יודע לנסח בקשות טובות יותר, לזהות מגבלות, ולבחור נכון בין Chat לבין Agent. כתיבה טובה היא הגדרה, לא קסם.", en: "The closing chapter: whoever understands what happens behind the scenes writes better requests, recognizes limits, and chooses well between Chat and Agent. Good writing is definition, not magic." },
                readTime: "14 דקות",
                labelColor: "text-violet-400",
                colorFrom: "from-violet-400",
                colorTo: "to-teal-500"
            }
        ]
    }
};