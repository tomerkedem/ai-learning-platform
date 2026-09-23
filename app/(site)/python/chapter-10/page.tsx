"use client";

import React from 'react';
import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';
import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';
import { Quiz } from '@/components/content/Quiz';
import { Mentor, EMERALD_ACCENT } from '@/components/ai-internals/Mentor';
import { TypeSafetyLab, ProtocolVis } from '@/components/demos/chapter-10';
import { 
    Scale, ShieldCheck, FileJson, Combine, 
    BoxSelect, Fingerprint 
} from 'lucide-react';

export default function Chapter10() {

  // --- Code Snippets & Outputs ---

  const basicTypesCode = `def add(a: int, b: int) -> int:
    return a + b

def greet(name: str) -> str:
    return f"שלום {name}"

def maybe_divide(x: float, y: float) -> float | None:
    if y == 0:
        return None
    return x / y

print(add(5, 10))
print(greet("דנה"))
print(maybe_divide(10.0, 2.0))`;

  const basicTypesOutput = `15
שלום דנה
5.0`;

  const unionOptionalCode = `from typing import Union, Optional, Literal

def parse_number(s: str) -> Union[int, float, None]:
    try:
        return int(s)
    except ValueError:
        try:
            return float(s)
        except ValueError:
            return None

def set_mode(mode: Literal["train", "test"]) -> None:
    print(f"Running in {mode} mode")

print(parse_number("42"))
print(parse_number("3.14"))
set_mode("train")`;

  const unionOptionalOutput = `42
3.14
Running in train mode`;

  const collectionsCode = `from typing import List, Dict

# הגדרת רשימה ומילון עם טיפוסים
names: List[str] = ["דנה", "משה"]
ages: Dict[str, int] = {"דנה": 32, "משה": 40}

def average_length(words: List[str]) -> float:
    total = sum(len(w) for w in words)
    return total / len(words)

print(f"Avg length: {average_length(names)}")`;

  const collectionsOutput = `Avg length: 3.0`;

  const typedDictCode = `from typing import TypedDict

class User(TypedDict):
    name: str
    age: int
    active: bool

def describe_user(user: User) -> str:
    status = 'פעיל' if user['active'] else 'לא פעיל'
    return f"{user['name']} ({user['age']}) - {status}"

data: User = {"name": "דנה", "age": 30, "active": True}
print(describe_user(data))`;

  const typedDictOutput = `דנה (30) - פעיל`;

  const protocolCode = `from typing import Protocol

class Cleaner(Protocol):
    def clean(self, text: str) -> str:
        ...

class LowerCleaner:
    def clean(self, text: str) -> str:
        return text.lower()

def process_text(c: Cleaner, s: str) -> str:
    return c.clean(s)

processor = LowerCleaner()
print(process_text(processor, "HELLO"))`;

  const protocolOutput = `hello`;

  const finalExampleCode = `from pathlib import Path
from typing import List, Dict, Union
import json

def tokenize(text: str) -> List[str]:
    """Split text into words."""
    return text.split()

def word_stats(tokens: List[str]) -> Dict[str, Union[int, float]]:
    """Return basic statistics."""
    lengths = [len(t) for t in tokens]
    return {
        "num_words": len(tokens),
        "avg_length": sum(lengths) / len(lengths) if lengths else 0
    }

text = "Python is amazing and strongly typed now"
stats = word_stats(tokenize(text))
print(stats)`;

  const finalExampleOutput = `{'num_words': 7, 'avg_length': 4.714285714285714}`;

  // --- Quiz ---
  const questions = [
    {
        id: 1,
        question: "האם פייתון אוכפת את הטיפוסים בזמן ריצה (Runtime)?",
        options: [
            "כן, אם שלחתי מחרוזת במקום מספר התוכנית תקרוס מיד",
            "לא, הטיפוסים הם הערות בלבד עבור מפתחים וכלים חיצונים (כמו mypy)",
            "רק בגרסאות פייתון 3.12 ומעלה",
            "רק אם משתמשים ב-TypedDict"
        ],
        correctAnswer: 1,
        explanation: "פייתון היא שפה דינמית. ה-Type Hints נועדו לבדיקה סטטית לפני ההרצה (על ידי ה-IDE או כלי CI), אך לא משפיעים על הריצה עצמה."
    },
    {
        id: 2,
        question: "מה המשמעות של Optional[str]?",
        options: [
            "המשתנה חייב להיות מחרוזת אופציונלית (ריקה)",
            "המשתנה יכול להיות str או None",
            "המשתנה הוא רשימה של מחרוזות",
            "המשתנה הוא מחרוזת שחייבת להכיל ערך"
        ],
        correctAnswer: 1,
        explanation: "Optional[T] הוא קיצור דרך ל-Union[T, None]. זה אומר שהערך יכול להיות מהטיפוס המבוקש או None."
    },
    {
        id: 3,
        question: "מהו Protocol בפייתון?",
        options: [
            "פרוטוקול תקשורת כמו HTTP",
            "דרך להגדיר ממשק (Interface) שמחלקות צריכות לממש באופן מפורש",
            "דרך להגדיר מבנה (Duck Typing) שאובייקטים צריכים להתאים לו, בלי לרשת ממנו",
            "סוג של רשימה מאובטחת"
        ],
        correctAnswer: 2,
        explanation: "Protocol מאפשר להגדיר 'חוזה': אילו מתודות צריכות להיות לאובייקט. כל אובייקט שמממש את המתודות האלו נחשב תקין, גם אם לא ירש מהפרוטוקול."
    }
  ];

  return (
    <ChapterLayout courseId="python" currentChapterId={10}>
        
        {/* --- Hero Section --- */}
        <div className="relative">
          {/* המנטור (xl+, משמאל) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="type" line="טיפוסים תופסים באגים לפני ההרצה" width={160} accent={EMERALD_ACCENT} bubbleSide="bottom" />
          </div>
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-blue-400 mb-2">
                <Scale size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">Static Typing & Reliability</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                טיפוסיות סטטית עם typing
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
                פייתון נולדה כשפה דינמית, וזה כיף לסקריפטים. אבל כשבונים מערכות גדולות, הדינמיות הופכת למלכודת.
                <br/>
                רמזי טיפוס (Type Hints) הם כמו תמרורים בכביש: הם לא עוצרים את התנועה, אבל מונעים תאונות יקרות.
            </p>
        </section>
        </div>

        {/* --- 1. Basic Types --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-blue-500 pr-4 flex items-center gap-2">
                <ShieldCheck size={24} className="text-blue-500"/>
                בסיס: למה צריך את זה?
            </h3>
            
            <p className="text-slate-300">
                ההבדל בין קוד שמתרסק אצל הלקוח לקוד שמתריע אצלך בעורך.
            </p>

            {/* Interactive Type Safety Lab */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">
                    <strong>מעבדת בטיחות:</strong> נסה להריץ קוד שגוי באופן דינמי (קריסה) מול סטטי (התרעה).
                </p>
                <TypeSafetyLab />
            </div>

            <LiveCodeEditor
                initialCode={basicTypesCode}
            />
        </section>

        {/* --- 2. Complex Types (Union/Optional) --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-yellow-500 pr-4 flex items-center gap-2">
                <Combine size={24} className="text-yellow-500"/>
                טיפוסים מורכבים: Union, Optional, Literal
            </h3>
            
            <p className="text-slate-300">
                החיים לא תמיד פשוטים. לפעמים פונקציה מחזירה מספר, ולפעמים <code>None</code>.
                <code>Literal</code> מאפשר להגביל ערכים למחרוזות ספציפיות בלבד (כמו Enum).
            </p>
            
            <LiveCodeEditor
                initialCode={unionOptionalCode}
            />
        </section>

        {/* --- 3. Data Structures --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-emerald-500 pr-4 flex items-center gap-2">
                <BoxSelect size={24} className="text-emerald-500"/>
                מבני נתונים ו-TypedDict
            </h3>
            
            <p className="text-slate-300">
                רשימה היא לא סתם רשימה, היא <code>List[str]</code>.
                וכשעובדים עם מילונים שמתנהגים כמו אובייקטים, <code>TypedDict</code> הוא החבר הכי טוב שלך.
            </p>

            <LiveCodeEditor
                initialCode={collectionsCode}
            />

            <LiveCodeEditor
                initialCode={typedDictCode}
            />
        </section>

        {/* --- 4. Protocols & Duck Typing --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-purple-500 pr-4 flex items-center gap-2">
                <Fingerprint size={24} className="text-purple-500"/>
                Protocols: הדרך הפייתונית לממשקים
            </h3>
            
            <p className="text-slate-300">
                בפייתון לא צריך ירושה כדי להתאים לממשק. אם זה נראה כמו ברווז ועושה קול של ברווז (Duck Typing) - זה מספיק.
                <code>Protocol</code> מאפשר להגדיר את ה&quot;ברווז&quot; הזה בצורה מסודרת.
            </p>

            <div className="mt-6">
                <ProtocolVis />
            </div>

            <LiveCodeEditor
                initialCode={protocolCode}
            />

            <InsightBox type="intuition" title="מה זה mypy?">
                mypy הוא כלי שרץ על הקוד שלך <strong>לפני</strong> שאתה מריץ אותו. הוא קורא את ה-Type Hints ומסמן שגיאות לוגיות, בדיוק כמו קומפיילר בשפות כמו C++ או Java.
            </InsightBox>
        </section>

        {/* --- 5. Full Example --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-indigo-500 pr-4 flex items-center gap-2">
                <FileJson size={24} className="text-indigo-500"/>
                דוגמה מסכמת: פרויקט מוקשח
            </h3>
            
            <p className="text-slate-300">
                הנה הפרויקט המוכר שלנו, אבל הפעם כשהוא כתוב כמו שמערכת Enterprise צריכה להיות כתובה.
            </p>

            <LiveCodeEditor
                initialCode={finalExampleCode}
            />
        </section>

        {/* --- Quiz --- */}
        <section className="mt-20">
            <Quiz questions={questions} title="מבדק ידע - פרק 10" />
        </section>

    </ChapterLayout>
  );
}