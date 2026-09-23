"use client";

import React from 'react';
import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';
import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';
import { Quiz } from '@/components/content/Quiz';
import { Mentor, EMERALD_ACCENT } from '@/components/ai-internals/Mentor';
import { DecoratorBuilder, ContextManagerVis } from '@/components/demos/chapter-11';
import { 
    Wand2, DoorOpen, Stamp, Timer, 
    Layers, PackageCheck
} from 'lucide-react';

export default function Chapter11() {

  // --- Code Snippets & Outputs ---

  const simpleDecoratorCode = `def logger(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with {args}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

@logger
def add(a: int, b: int) -> int:
    return a + b

add(3, 5)`;

  const simpleDecoratorOutput = `Calling add with (3, 5)
add returned 8`;

  const repeatDecoratorCode = `from functools import wraps

def repeat(n: int):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for i in range(n):
                print(f"Call number {i + 1}")
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def say_hello():
    print("Hello!")

say_hello()`;

  const repeatDecoratorOutput = `Call number 1
Hello!
Call number 2
Hello!
Call number 3
Hello!`;

  const lruCacheCode = `from functools import lru_cache
import time

@lru_cache(maxsize=100)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

start = time.perf_counter()
print(f"Fib(30) = {fibonacci(30)}")
print(f"Time: {time.perf_counter() - start:.4f}s")`;

  const lruCacheOutput = `Fib(30) = 832040
Time: 0.0001s`;

  const contextManagerCode = `class FileHandler:
    def __init__(self, path: str):
        self.path = path

    def __enter__(self):
        print("Opening file...")
        self.file = open(self.path, "w", encoding="utf-8")
        return self.file

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Closing file...")
        self.file.close()

# שימוש ב-with מבטיח סגירה
# with FileHandler("test.txt") as f:
#     f.write("Hello")
print("Opening file...")
print("Writing data...")
print("Closing file...")`;

  const contextManagerOutput = `Opening file...
Writing data...
Closing file...`;

  const contextLibCode = `from contextlib import contextmanager

@contextmanager
def open_utf8(path: str, mode: str = "r"):
    print("Opening file (Generator)...")
    # f = open(path, mode, encoding="utf-8")
    try:
        yield "FileObject"
    finally:
        print("Closing file (Generator)...")
        # f.close()

with open_utf8("data.txt", "w") as f:
    print(f"Writing to {f}")`;

  const contextLibOutput = `Opening file (Generator)...
Writing to FileObject
Closing file (Generator)...`;

  const dataclassCode = `from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

p = Point(1.0, 2.5)
print(p)
print(f"Equality check: {p == Point(1.0, 2.5)}")`;

  const dataclassOutput = `Point(x=1.0, y=2.5)
Equality check: True`;

  const finalExampleCode = `import time
from dataclasses import dataclass
from typing import Any, Callable

def measure_time(func: Callable[..., Any]):
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = time.perf_counter() - start
        return Result(func.__name__, duration, result)
    return wrapper

@dataclass
class Result:
    name: str
    duration: float
    output: Any

@measure_time
def heavy_computation(n: int) -> int:
    time.sleep(0.1)
    return sum(i * i for i in range(n))

res = heavy_computation(1000)
print(res)`;

  const finalExampleOutput = `Result(name='heavy_computation', duration=0.10, output=332833500)`;

  // --- Quiz ---
  const questions = [
    {
        id: 1,
        question: "מה התפקיד של @wraps בדקורטור?",
        options: [
            "לגרום לקוד לרוץ מהר יותר",
            "לשמור על המטא-דאטה (שם ודוקסטרינג) של הפונקציה המקורית שנעטפה",
            "לעטוף את הפונקציה ב-try/except באופן אוטומטי",
            "למנוע מהפונקציה לרוץ יותר מפעם אחת"
        ],
        correctAnswer: 1,
        explanation: "כשאנחנו עוטפים פונקציה, היא מאבדת את השם המקורי שלה (`__name__`) לטובת `wrapper`. הדקורטור `@wraps` מעתיק את המידע המקורי בחזרה."
    },
    {
        id: 2,
        question: "מה קורה ב-Context Manager (בלוק with) אם יש שגיאה?",
        options: [
            "התוכנית קורסת מיד והקובץ נשאר פתוח",
            "המתודה __exit__ נקראת בכל מקרה, מה שמבטיח סגירה תקינה של המשאב",
            "השגיאה נעלמת והקוד ממשיך רגיל",
            "חייבים להוסיף try/finally ידנית בתוך ה-with"
        ],
        correctAnswer: 1,
        explanation: "זה כל היופי ב-`with`: הוא מבטיח ש-`__exit__` ירוץ וינקה את המשאבים, גם אם נזרקה חריגה בתוך הבלוק."
    },
    {
        id: 3,
        question: "מתי כדאי להשתמש ב-@dataclass?",
        options: [
            "תמיד, לכל מחלקה",
            "רק כשצריך ירושה מרובה",
            "כאשר המחלקה משמשת בעיקר לאחסון נתונים (Data Container) ורוצים לחסוך כתיבת __init__ ו-__repr__",
            "כשרוצים להגדיר פונקציות סטטיות בלבד"
        ],
        correctAnswer: 2,
        explanation: "@dataclass הוא קיצור דרך מצוין למחלקות שעיקר תפקידן הוא להחזיק מידע. הוא מייצר אוטומטית את הקוד הטכני המשעמם."
    }
  ];

  return (
    <ChapterLayout courseId="python" currentChapterId={11}>
        
        {/* --- Hero Section --- */}
        <div className="relative">
          {/* המנטור (xl+, משמאל) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="happy" line="קסם סביב הקוד, בלי לגעת בו" width={160} accent={EMERALD_ACCENT} bubbleSide="bottom" />
          </div>
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <Wand2 size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">Decorators & Context Managers</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                דקורטורים, Context Managers ו-dataclass
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
                פייתון נבנתה לאלגנטיות. כשהקוד מתחיל לחזור על עצמו, הכלים האלו נכנסים לפעולה.
                הם לא רק &quot;חכמים&quot;, הם הדרך הפייתונית לכתוב קוד נקי, מודולרי ובטוח.
            </p>
        </section>
        </div>

        {/* --- 1. Decorators --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-blue-500 pr-4 flex items-center gap-2">
                <Layers size={24} className="text-blue-500"/>
                דקורטורים: לעטוף את הלוגיקה
            </h3>
            
            <p className="text-slate-300">
                דקורטור הוא פונקציה שעוטפת פונקציה אחרת. הוא מאפשר להוסיף התנהגות (כמו לוגים או בדיקת הרשאות) בלי לגעת בקוד המקורי.
            </p>

            {/* Interactive Decorator Builder */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">
                    <strong>בנה דקורטור:</strong> הוסף שכבות לפונקציה וראה איך ההתנהגות משתנה.
                </p>
                <DecoratorBuilder />
            </div>

            <LiveCodeEditor
                initialCode={simpleDecoratorCode}
            />
        </section>

        {/* --- 2. Advanced Decorators --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-yellow-500 pr-4 flex items-center gap-2">
                <Timer size={24} className="text-yellow-500"/>
                דקורטורים עם פרמטרים ושימושים נפוצים
            </h3>
            
            <p className="text-slate-300">
                אפשר להעביר פרמטרים לדקורטור (כמו מספר חזרות), ולהשתמש בכלים מובנים כמו <code>lru_cache</code> לשיפור ביצועים דרמטי.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
                <LiveCodeEditor
                initialCode={repeatDecoratorCode}
            />
                <LiveCodeEditor
                initialCode={lruCacheCode}
            />
            </div>
        </section>

        {/* --- 3. Context Managers --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-purple-500 pr-4 flex items-center gap-2">
                <DoorOpen size={24} className="text-purple-500"/>
                Context Managers (with)
            </h3>
            
            <p className="text-slate-300">
                ניהול משאבים (קבצים, חיבורים) דורש סדר. הבלוק <code>with</code> מבטיח שהמשאב ייסגר תמיד, גם אם הקוד קרס באמצע.
            </p>

            {/* Interactive Context Manager Visualizer */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">
                    <strong>ויזואליזציה של with:</strong> ראה איך המשאב נפתח ונסגר אוטומטית.
                </p>
                <ContextManagerVis />
            </div>

            <LiveCodeEditor
                initialCode={contextManagerCode}
            />

            <InsightBox type="intuition" title="קיצור דרך: @contextmanager">
                לא חייבים לכתוב מחלקה שלמה. הספרייה <code>contextlib</code> מאפשרת להפוך פונקציה פשוטה (עם <code>yield</code>) למנהל הקשר חכם.
                <LiveCodeEditor
                initialCode={contextLibCode}
            />
            </InsightBox>
        </section>

        {/* --- 4. Dataclasses --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-pink-500 pr-4 flex items-center gap-2">
                <Stamp size={24} className="text-pink-500"/>
                @dataclass: הדרך הנקייה למידע
            </h3>
            
            <p className="text-slate-300">
                כבר פגשנו אותן, אבל עכשיו ברור שהן בעצם דקורטור שכותב קוד בשבילנו.
                זהו הכלי המושלם לאובייקטים שכל תפקידם הוא להחזיק נתונים.
            </p>

            <LiveCodeEditor
                initialCode={dataclassCode}
            />
        </section>

        {/* --- 5. Full Example --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-indigo-500 pr-4 flex items-center gap-2">
                <PackageCheck size={24} className="text-indigo-500"/>
                דוגמה מסכמת: שילוב כלים
            </h3>
            
            <p className="text-slate-300">
                נשלב דקורטור למדידת זמן עם <code>dataclass</code> כדי להחזיר תוצאה עשירה ומדויקת.
            </p>

            <LiveCodeEditor
                initialCode={finalExampleCode}
            />
        </section>

        {/* --- Quiz --- */}
        <section className="mt-20">
            <Quiz questions={questions} title="מבדק ידע - פרק 11" />
        </section>

    </ChapterLayout>
  );
}