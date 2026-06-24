"use client";

import React from 'react';
import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';
import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';
import { Quiz } from '@/components/content/Quiz';
import { Mentor, EMERALD_ACCENT } from '@/components/ai-internals/Mentor';
import { MemoryVisualizer, VectorizationRace } from '@/components/demos/chapter-13';
import { 
    Gauge, Activity, Database, Zap, 
    Cpu, BarChart3
} from 'lucide-react';

export default function Chapter13() {

  // --- Code Snippets & Outputs ---

  const timeitCode = `import timeit

# מדידת יצירת רשימה
code = "result = [x**2 for x in range(1000)]"
time = timeit.timeit(code, number=1000)

print(f"Total time for 1000 runs: {time:.4f} sec")`;

  const timeitOutput = `Total time for 1000 runs: 0.2451 sec`;

  const profileCode = `import cProfile

def compute():
    # פעולה כבדה לצורך הדגמה
    return sum(i * i for i in range(100_000))

# הרצת הפרופיילר
cProfile.run("compute()")`;

  const profileOutput = `         4 function calls in 0.012 seconds

   Ordered by: standard name

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.000    0.000    0.012    0.012 <string>:1(<module>)
        1    0.000    0.000    0.012    0.012 main.py:3(compute)
        1    0.012    0.012    0.012    0.012 main.py:5(<genexpr>)
        1    0.000    0.000    0.000    0.000 {built-in method builtins.exec}`;

  const generatorCode = `def squares():
    # Generator: מחשב ערך רק כשמבקשים
    for i in range(5):
        print(f"Generating {i}...")
        yield i ** 2

# שים לב: שום דבר לא קורה כאן עדיין
gen = squares()

print("Start loop:")
for n in gen:
    print(f"Got: {n}")`;

  const generatorOutput = `Start loop:
Generating 0...
Got: 0
Generating 1...
Got: 1
Generating 2...
Got: 4
Generating 3...
Got: 9
Generating 4...
Got: 16`;

  const numpyCode = `import numpy as np

# יצירת מערך NumPy
arr = np.array([1, 2, 3, 4, 5])

# פעולה וקטורית (על כל המערך בבת אחת)
doubled = arr * 2

print(f"Original: {arr}")
print(f"Doubled:  {doubled}")
print(f"Mean:     {np.mean(arr)}")`;

  const numpyOutput = `Original: [1 2 3 4 5]
Doubled:  [ 2  4  6  8 10]
Mean:     3.0`;

  const numpyVsNaiveCode = `import numpy as np
from collections import Counter

words = ["apple", "banana", "apple", "orange", "banana", "apple"]

# גישה נאיבית (פייתון טהור)
def word_freq_naive(w):
    return dict(Counter(w))

# גישה וקטורית (NumPy)
def word_freq_numpy(w):
    arr = np.array(w)
    unique, counts = np.unique(arr, return_counts=True)
    return dict(zip(unique, counts))

print(word_freq_numpy(words))`;

  const numpyVsNaiveOutput = `{'apple': 3, 'banana': 2, 'orange': 1}`;

  // --- Quiz ---
  const questions = [
    {
        id: 1,
        question: "מהו היתרון המרכזי של Generator על פני רשימה רגילה?",
        options: [
            "הוא תמיד מהיר יותר פי 2",
            "הוא חוסך זיכרון כי הוא מחשב ערכים אחד-אחד לפי דרישה (Lazy Evaluation)",
            "הוא מאפשר לגשת לאיברים לפי אינדקס בצורה מהירה יותר",
            "הוא תומך במיון אוטומטי"
        ],
        correctAnswer: 1,
        explanation: "Generator לא שומר את כל הערכים בזיכרון, אלא מייצר אותם 'תוך כדי תנועה'. זה קריטי כשעובדים עם כמויות דאטה גדולות."
    },
    {
        id: 2,
        question: "מהי וקטוריזציה (Vectorization) ב-NumPy?",
        options: [
            "הפיכת תמונה לוקטור גרפי",
            "ביצוע פעולה מתמטית על מערך שלם בפקודה אחת, תוך שימוש ביכולות המעבד (SIMD) וללא לולאת פייתון",
            "שימוש בוקטורים במקום במחרוזות",
            "דחיסת נתונים"
        ],
        correctAnswer: 1,
        explanation: "וקטוריזציה מאפשרת ל-NumPy להעביר את הפעולה לקוד C יעיל ולעבד גושי מידע במקביל, מה שמאיץ את החישוב פי 50-100."
    },
    {
        id: 3,
        question: "איך מודדים זמן ריצה של קטע קוד בצורה אמינה?",
        options: [
            "סופרים שניות בלב",
            "משתמשים במודול timeit שמריץ את הקוד מספר פעמים ומחשב ממוצע",
            "מדפיסים את השעה לפני ואחרי הקוד",
            "מסתכלים על מנהל המשימות (Task Manager)"
        ],
        correctAnswer: 1,
        explanation: "מודול timeit מנטרל רעשי רקע ומריץ את הקוד בלולאה כדי לקבל תוצאה סטטיסטית מדויקת."
    }
  ];

  return (
    <ChapterLayout courseId="python" currentChapterId={13}>
        
        {/* --- Hero Section --- */}
        <div className="relative">
          {/* המנטור (xl+, משמאל) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="chart" line="וקטוריזציה במקום לולאות" width={160} accent={EMERALD_ACCENT} bubbleSide="bottom" />
          </div>
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-yellow-400 mb-2">
                <Gauge size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">Performance & Memory</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                ביצועים, זיכרון וקצת NumPy
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
                פייתון לא חייבת להיות איטית. עם הכלים הנכונים, היא הופכת לכלי הנדסי חזק.
                בפרק הזה נלמד איך למדוד ביצועים, לחסוך בזיכרון עם Generators, ולהאיץ חישובים עם NumPy.
            </p>
        </section>
        </div>

        {/* --- 1. Measuring Performance --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-blue-500 pr-4 flex items-center gap-2">
                <Activity size={24} className="text-blue-500"/>
                מדידה ופרופיילינג: לא לנחש
            </h3>
            
            <p className="text-slate-300">
                לפני שמתקנים, מודדים. <code>timeit</code> נותן זמן מדויק, ו-<code>cProfile</code> מראה איפה בדיוק צוואר הבקבוק.
            </p>

            <LiveCodeEditor
                initialCode={timeitCode}
            />

            <LiveCodeEditor
                initialCode={profileCode}
            />
        </section>

        {/* --- 2. Generators --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-emerald-500 pr-4 flex items-center gap-2">
                <Database size={24} className="text-emerald-500"/>
                זיכרון ו-Generators
            </h3>
            
            <p className="text-slate-300">
                למה לטעון מיליון שורות לזיכרון אם אפשר לעבד אותן אחת אחת?
                Generators הם המפתח לעבודה עם Big Data במחשב נייד.
            </p>

            {/* Interactive Memory Visualizer */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">
                    <strong>סימולציית זיכרון:</strong> ראה את ההבדל בין רשימה ש&quot;מתנפחת&quot; לבין Generator שנשאר רזה.
                </p>
                <MemoryVisualizer />
            </div>

            <LiveCodeEditor
                initialCode={generatorCode}
            />
        </section>

        {/* --- 3. NumPy & Vectorization --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-purple-500 pr-4 flex items-center gap-2">
                <Zap size={24} className="text-purple-500"/>
                NumPy וחישוב וקטורי
            </h3>
            
            <p className="text-slate-300">
                NumPy מחליפה את הלולאות האיטיות של פייתון בפעולות C מהירות על בלוקים של זיכרון.
                זהו הבסיס לכל עולם ה-Data Science.
            </p>

            {/* Interactive Vectorization Race */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">
                    <strong>מרוץ הביצועים:</strong> פייתון מול NumPy. מי ינצח?
                </p>
                <VectorizationRace />
            </div>

            <LiveCodeEditor
                initialCode={numpyCode}
            />

            <InsightBox type="info" title="למה זה מהיר?">
                NumPy משתמשת ב-SIMD (Single Instruction, Multiple Data). המעבד מבצע את פעולת הכפל על המון מספרים במכה אחת, במקום אחד-אחד.
            </InsightBox>
        </section>

        {/* --- 4. Real World Example --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-indigo-500 pr-4 flex items-center gap-2">
                <BarChart3 size={24} className="text-indigo-500"/>
                דוגמה: ספירת מילים חכמה
            </h3>
            
            <p className="text-slate-300">
                השוואה בין פתרון &quot;נאיבי&quot; לפתרון מבוסס NumPy. בנפחים גדולים, ההבדל הוא עצום.
            </p>

            <LiveCodeEditor
                initialCode={numpyVsNaiveCode}
            />
        </section>

        {/* --- Summary --- */}
        <section className="mt-24 bg-linear-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3 mb-6 text-white justify-center">
                <Cpu className="text-blue-400" />
                <h2 className="text-2xl font-bold">סיכום: להיות יעיל</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-emerald-400 font-bold mb-2">Timeit</h4>
                    <p className="text-slate-400 text-sm">מדוד זמנים בצורה מדעית, אל תנחש.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-yellow-400 font-bold mb-2">Generators</h4>
                    <p className="text-slate-400 text-sm">השתמש ב-yield כדי לחסוך בזיכרון ולעבד זרמי מידע.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-purple-400 font-bold mb-2">NumPy</h4>
                    <p className="text-slate-400 text-sm">לחישובים מספריים, זרוק את ה-Lists ותעבור למערכים.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-blue-400 font-bold mb-2">Profile</h4>
                    <p className="text-slate-400 text-sm">מצא את צוואר הבקבוק האמיתי בעזרת cProfile.</p>
                </div>
            </div>
        </section>

        {/* --- Quiz --- */}
        <section className="mt-20">
            <Quiz questions={questions} title="מבדק ידע - פרק 13" />
        </section>

    </ChapterLayout>
  );
}