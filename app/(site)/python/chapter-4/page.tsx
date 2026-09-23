"use client";

import React from 'react';

import { InsightBox } from '@/components/content/InsightBox';
import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';
import { Quiz } from '@/components/content/Quiz';
import { MutableTrapDemo, PipelineBuilderDemo } from '@/components/demos/chapter-4';
import { 
    FunctionSquare, Box, GitMerge, Variable, 
    AlertTriangle, Layers, ArrowRightLeft,
    BrainCircuit, BookOpen
} from 'lucide-react';
import { ChapterLayout } from '@/components/ChapterLayout';
import { Mentor, EMERALD_ACCENT } from '@/components/ai-internals/Mentor';

export default function Chapter4() {

  // --- Code Snippets & Outputs ---
  
  const basicFuncCode = `def greet(name):
    print(f"Hello {name}!")

greet("Tamar")`;
  const basicFuncOutput = `Hello Tamar!`;

  const returnCode = `def min_max_avg(values: list[int]) -> tuple[int, int, float]:
    return min(values), max(values), sum(values) / len(values)

# Tuple Unpacking - הדרך הפייתונית
low, high, avg = min_max_avg([10, 5, 8, 12])
print(f"Low: {low}, High: {high}, Avg: {avg}")`;
  const returnOutput = `Low: 5, High: 12, Avg: 8.75`;

  const argsKwargsCode = `def run_inference(model, **config):
    # שימוש ב-get מאפשר גמישות וערכי ברירת מחדל
    temp = config.get("temperature", 0.7)
    limit = config.get("max_tokens", 256)
    
    print(f"Running {model} with temp={temp}, limit={limit}")

# שימוש גמיש - שדות חדשים לא שוברים את הקוד
config = {"temperature": 0.8, "top_p": 0.9} 
run_inference("GPT-4", **config)`;
  const argsKwargsOutput = `Running GPT-4 with temp=0.8, limit=256`;

  const firstClassCode = `def make_multiplier(factor: int):
    # פונקציה פנימית (Closure)
    def multiply(x: int) -> int:
        return x * factor
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)

print(f"Double 5: {double(5)}")
print(f"Triple 5: {triple(5)}")`;
  const firstClassOutput = `Double 5: 10
Triple 5: 15`;

  const lambdaCode = `numbers = [1, 2, 3, 4]
# שימוש ב-lambda לפעולה רגעית
squares = list(map(lambda x: x ** 2, numbers))
print(f"Squares: {squares}")

# מיון לפי אורך המילה
words = ["AI", "Data", "Learning"]
words.sort(key=lambda w: len(w))
print(f"Sorted: {words}")`;
  const lambdaOutput = `Squares: [1, 4, 9, 16]
Sorted: ['AI', 'Data', 'Learning']`;

  const docstringCode = `def normalize(text: str) -> str:
    """
    Clean text by removing extra spaces and converting to lowercase.
    Args:
        text (str): The raw input text. 
    Returns:
        str: Normalized text.
    """
    return text.strip().lower()

# בדיקה שהתיעוד עובד
print(normalize("  PyTHon  "))
print(normalize.__doc__)`;
  const docstringOutput = `python

    Clean text by removing extra spaces and converting to lowercase.
    Args:
        text (str): The raw input text. 
    Returns:
        str: Normalized text.
    `;

  const mainExampleCode = `def analyze_text(text: str) -> dict:
    """Run all analysis steps on raw text."""
    # בדוגמה אמיתית היינו קוראים לפונקציות העזר שיצרנו
    clean = text.strip().lower()
    words = clean.split()
    return {"words": len(words), "text": clean}

# הפונקציה הראשית היא פשוט "מנהלת" שמחברת חלקים קטנים
result = analyze_text("  AI is Awesome ")
print(result)`;
  const mainExampleOutput = `{'words': 3, 'text': 'ai is awesome'}`;

  // --- Quiz ---
  const questions = [
    {
        id: 1,
        question: "מדוע מסוכן להשתמש ב-list=[] כערך ברירת מחדל לפרמטר?",
        options: [
            "זה גורם לשגיאת סינטקס (Syntax Error)",
            "הרשימה נוצרת פעם אחת בלבד ונשמרת בין קריאות (Mutable Default Trap)",
            "זה תופס יותר מדי זיכרון",
            "פייתון לא תומכת ברשימות כברירת מחדל"
        ],
        correctAnswer: 1,
        explanation: "ערכי ברירת מחדל מחושבים בזמן הגדרת הפונקציה, לא בזמן הריצה. לכן רשימה שהוגדרה כך תצבור ערכים מקריאה לקריאה."
    },
    {
        id: 2,
        question: "מה המשמעות של **kwargs בפייתון?",
        options: [
            "זה מעביר את הערכים כרשימה רגילה",
            "זה אוסף את כל הארגומנטים בעלי השם (Keyword Arguments) לתוך מילון",
            "זו דרך להגדיר פונקציה פרטית",
            "זה מחייב את המשתמש להעביר מילון בלבד"
        ],
        correctAnswer: 1,
        explanation: "**kwargs אוסף את כל הפרמטרים שהועברו בצורה key=value לתוך מילון, מה שמאפשר גמישות בממשק הפונקציה."
    },
    {
        id: 3,
        question: "מהו העיקרון של SRP (Single Responsibility Principle)?",
        options: [
            "כל פונקציה צריכה להיות אחראית על כל המערכת",
            "פונקציה צריכה לעשות דבר אחד בלבד ולעשות אותו היטב",
            "אסור לקרוא לפונקציה מתוך פונקציה אחרת",
            "פונקציה חייבת להיות כתובה בשורה אחת"
        ],
        correctAnswer: 1,
        explanation: "עיקרון האחריות היחידה קובע שפונקציה צריכה להיות ממוקדת במשימה אחת. זה מקל על בדיקות, תחזוקה וקריאות."
    }
  ];

  return (
    <ChapterLayout courseId="python" currentChapterId={4}>
        
        {/* --- Hero Section --- */}
        <div className="relative">
          {/* המנטור (xl+, משמאל) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="explain" line="פונקציה טובה עושה דבר אחד" width={160} accent={EMERALD_ACCENT} bubbleSide="bottom" />
          </div>
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-purple-400 mb-2">
                <FunctionSquare size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">Functions & Scope</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                פונקציות בפייתון
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
                כל שפת תכנות מאפשרת לכתוב פונקציות, אבל בפייתון הן הרבה יותר מסתם דרך &quot;לא לחזור על קוד&quot;.
                הן אבן הבניין המרכזית של כל מערכת יציבה.
                <br/>
                אם משתנים הם החומר הגולמי, הפונקציות הן המכונות שמעבדות אותו.
            </p>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex gap-4 mt-6">
                <BrainCircuit className="text-purple-500 shrink-0" size={24} />
                <div>
                    <h4 className="font-bold text-white mb-1">למה זה קריטי ב-AI?</h4>
                    <p className="text-sm text-slate-400">
                        במערכות למידת מכונה הקוד מתמלא מהר מאוד בניקוי נתונים, מדידות וניסויים.
                        פונקציות ברורות הן ההבדל בין קוד שביר לקוד הנדסי שניתן לבדוק ולהרחיב.
                    </p>
                </div>
            </div>
        </section>
        </div>

        {/* --- 1. פרמטרים והחזרת ערכים --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-blue-500 pr-4 flex items-center gap-2">
                <Box size={24} className="text-blue-500"/>
                פרמטרים והחזרת ערכים
            </h3>
            
            <p className="text-slate-300">
                פונקציה היא מכונה קטנה: קלט נכנס, עיבוד קורה, פלט יוצא.
                תחילה, נראה את המבנה הבסיסי ביותר:
            </p>
            
            <LiveCodeEditor
                initialCode={basicFuncCode}
            />

            <p className="text-slate-300 mt-4">
                אבל הכוח האמיתי מגיע כשאנחנו רוצים להחזיר יותר מנתון אחד.
                אחד הפיצ&apos;רים הכי נוחים בפייתון הוא היכולת להחזיר מספר ערכים בבת אחת (Tuple Unpacking), מה שחוסך יצירת מבנים מיותרים.
            </p>
            
            <LiveCodeEditor
                initialCode={returnCode}
            />
            
            <InsightBox type="info" title="פרמטרים בעלי שם (Keyword Arguments)">
                קריאה לפונקציה עם שמות הפרמטרים (<code>connect(host=&quot;localhost&quot;, port=80)</code>)
                הופכת את הקוד לקריא הרבה יותר ומונעת טעויות סדר.
            </InsightBox>
        </section>

        {/* --- 2. המלכודת (Mutable Defaults) --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-red-500 pr-4 flex items-center gap-2">
                <AlertTriangle size={24} className="text-red-500"/>
                זהירות: המלכודת הנפוצה ביותר
            </h3>
            
            <p className="text-slate-300">
                ערכי ברירת מחדל נוצרים <strong>פעם אחת בלבד</strong> בזמן הגדרת הפונקציה.
                אם תשתמש ברשימה ריקה כברירת מחדל, היא תישמר ותגדל בין קריאות. זה באג שקשה מאוד לאתר.
            </p>

            {/* ההדגמה האינטראקטיבית (Lab) */}
            <div className="mt-6">
                <MutableTrapDemo />
            </div>

            <InsightBox type="warning" title="כלל ברזל">
                לעולם אל תשתמש ב-List או Dict כערך ברירת מחדל.
                תמיד השתמש ב-<code>None</code> ואתחל בתוך הפונקציה:
                <br/>
                <code>if items is None: items = []</code>
            </InsightBox>
        </section>

        {/* --- 3. *args & **kwargs --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-yellow-500 pr-4 flex items-center gap-2">
                <GitMerge size={24} className="text-yellow-500"/>
                גמישות עם *args ו-**kwargs
            </h3>
            
            <p className="text-slate-300">
                במערכות AI הממשק משתנה כל הזמן. היום המודל צריך שני פרמטרים, מחר חמישה.
                <code>**kwargs</code> מאפשר לך לאסוף פרמטרים לא צפויים למילון, ולשמור על הקוד יציב.
            </p>

            <LiveCodeEditor
                initialCode={argsKwargsCode}
            />
        </section>

        {/* --- 4. פונקציות כאובייקטים ולמדה --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-emerald-500 pr-4 flex items-center gap-2">
                <Variable size={24} className="text-emerald-500"/>
                פונקציות כערכים (First-Class Citizens)
            </h3>
            
            <div className="prose prose-invert text-slate-300 leading-8">
                <p>
                    בפייתון, פונקציה היא משתנה לכל דבר. אפשר להעביר אותה לפונקציה אחרת, או אפילו ליצור פונקציה שמחזירה פונקציה (Closure).
                    זה הבסיס לתכנות פונקציונלי ולבניית &quot;מפעלים&quot; של לוגיקה.
                </p>
            </div>

            <LiveCodeEditor
                initialCode={firstClassCode}
            />

            <h4 className="text-xl font-bold text-white mt-8 mb-4">Lambda: פונקציות אנונימיות</h4>
            <p className="text-slate-300 mb-4">
                לפעמים צריך פונקציה קטנה וחד-פעמית (למשל עבור מיון או map). במקום להגדיר אותה עם שם, משתמשים ב-lambda.
            </p>
            <LiveCodeEditor
                initialCode={lambdaCode}
            />
        </section>

        {/* --- 5. Scope & Docstrings --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-indigo-400 pr-4 flex items-center gap-2">
                <BookOpen size={24} className="text-indigo-400"/>
                Scope (LEGB) ותיעוד
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-lg font-bold text-white mb-2">LEGB: סדר חיפוש המשתנים</h4>
                    <ul className="space-y-2 text-slate-300 text-sm">
                        <li className="flex gap-2"><span className="text-yellow-400 font-bold">L</span> Local (בתוך הפונקציה)</li>
                        <li className="flex gap-2"><span className="text-yellow-400 font-bold">E</span> Enclosing (פונקציה עוטפת)</li>
                        <li className="flex gap-2"><span className="text-yellow-400 font-bold">G</span> Global (הקובץ)</li>
                        <li className="flex gap-2"><span className="text-yellow-400 font-bold">B</span> Built-in (שפת פייתון)</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-bold text-white mb-2">Docstrings</h4>
                    <p className="text-slate-300 text-sm mb-2">
                        תיעוד הוא לא בונוס, הוא חלק מהקוד. השתמש ב-<code>&quot;&quot;&quot; &quot;&quot;&quot;</code> כדי להסביר מה הפונקציה עושה.
                    </p>
                    <LiveCodeEditor
                initialCode={docstringCode}
            />
                </div>
            </div>
        </section>

        {/* --- 6. דוגמה מרכזית: Utility Functions --- */}
        <section className="mt-20 space-y-6">
            <h3 className="text-2xl font-bold text-white border-r-4 border-pink-500 pr-4 flex items-center gap-2">
                <Layers size={24} className="text-pink-500"/>
                דוגמה מרכזית: בניית Pipeline לעיבוד טקסט
            </h3>
            
            <p className="text-slate-300">
                במקום לכתוב פונקציית ספגטי ענקית, נפרק את המשימה לפונקציות קטנות שעושות דבר אחד (SRP).
                <br/>
                הפונקציה הראשית <code>analyze_text</code> רק מחברת את החלקים.
            </p>

            {/* ההדגמה האינטראקטיבית (Lab) */}
            <div className="my-8">
                <PipelineBuilderDemo />
            </div>

            <LiveCodeEditor
                initialCode={mainExampleCode}
            />
        </section>

        {/* --- סיכום --- */}
        <section className="mt-24 bg-linear-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3 mb-6 text-white justify-center">
                <ArrowRightLeft className="text-purple-400" />
                <h2 className="text-2xl font-bold">סיכום: Best Practices</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-slate-950/50 rounded-lg">
                    <h4 className="text-emerald-400 font-bold mb-2">SRP</h4>
                    <p className="text-slate-400 text-sm">פונקציה אחת = פעולה אחת. קל לבדיקה, קל לתחזוקה.</p>
                </div>
                <div className="p-4 bg-slate-950/50 rounded-lg">
                    <h4 className="text-blue-400 font-bold mb-2">Explicit is better</h4>
                    <p className="text-slate-400 text-sm">העדף פרמטרים ברורים על פני משתנים גלובליים נסתרים.</p>
                </div>
                <div className="p-4 bg-slate-950/50 rounded-lg">
                    <h4 className="text-red-400 font-bold mb-2">No Mutable Defaults</h4>
                    <p className="text-slate-400 text-sm">היזהר מ-list=[] כברירת מחדל. זה הבאג הנפוץ ביותר.</p>
                </div>
            </div>
        </section>

        {/* --- Quiz --- */}
        <section className="mt-20">
            <Quiz questions={questions} title="מבדק ידע - פרק 4" />
        </section>

    </ChapterLayout>
  );
}