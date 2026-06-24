"use client";

import React from 'react';
import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';
import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';
import { Quiz } from '@/components/content/Quiz';
import { Mentor, EMERALD_ACCENT } from '@/components/ai-internals/Mentor';
import { ClassVsInstance, DataclassLab, CompositionVis } from '@/components/demos/chapter-9';
import { 
    Box, Layers, Combine, PackageCheck, 
    Wand2, Fingerprint, BoxSelect
} from 'lucide-react';

export default function Chapter9() {

  // --- Code Snippets & Outputs ---

  const basicClassCode = `class Counter:
    """A simple counter that keeps its value in memory."""
    
    def __init__(self, start: int = 0):
        self.value = start

    def increment(self, step: int = 1) -> None:
        self.value += step

    def get(self) -> int:
        return self.value

c = Counter(10)
c.increment()
print(c.get())`;
  const basicClassOutput = `11`;

  const magicMethodsCode = `class Vector:
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y

    def __str__(self) -> str:
        return f"({self.x}, {self.y})"

    def __repr__(self) -> str:
        return f"Vector(x={self.x}, y={self.y})"

    def __len__(self) -> int:
        return abs(self.x) + abs(self.y)

v = Vector(3, -4)
print(f"User view: {v}")
print(f"Dev view:  {repr(v)}")
print(f"Length:    {len(v)}")`;
  const magicMethodsOutput = `User view: (3, -4)
Dev view:  Vector(x=3, y=-4)
Length:    7`;

  const classVarCode = `class Tokenizer:
    language = "hebrew"  # משתנה מחלקה (משותף)

    def __init__(self, text: str):
        self.text = text # משתנה מופע (אישי)

t1 = Tokenizer("שלום")
t2 = Tokenizer("היי")

print(f"t1 lang: {t1.language}")
print(f"t2 lang: {t2.language}")

# שינוי ברמת המחלקה משפיע על כולם (אם לא דרסו אותו במופע)
Tokenizer.language = "english"
print(f"t1 new lang: {t1.language}")`;
  const classVarOutput = `t1 lang: hebrew
t2 lang: hebrew
t1 new lang: english`;

  const decoratorsCode = `class User:
    def __init__(self, name, is_admin=False):
        self.name = name
        self.is_admin = is_admin

    @classmethod
    def admin(cls, name):
        # Factory method: יוצרת מופע בצורה מיוחדת
        return cls(name, is_admin=True)

    @staticmethod
    def validate_name(name):
        # סתם פונקציה לוגית, לא תלויה במופע
        return len(name) > 1

u = User.admin("Tomer")
print(f"Name: {u.name}, Admin: {u.is_admin}")
print(f"Valid name? {User.validate_name('T')}")`;
  const decoratorsOutput = `Name: Tomer, Admin: True
Valid name? False`;

  const dataclassCode = `from dataclasses import dataclass

@dataclass
class Person:
    name: str
    age: int

p1 = Person("Dana", 30)
p2 = Person("Dana", 30)

print(p1)           # הדפסה יפה אוטומטית
print(p1 == p2)     # השוואה לפי ערכים אוטומטית`;
  const dataclassOutput = `Person(name='Dana', age=30)
True`;

  const frozenCode = `from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: int
    y: int

p = Point(3, 4)
print(p)

try:
    p.x = 10  # זה יכשל כי האובייקט קפוא
except Exception as e:
    print(f"Error: {e}")`;
  const frozenOutput = `Point(x=3, y=4)
Error: cannot assign to field 'x'`;

  const textCleanerCode = `from dataclasses import dataclass
import re

@dataclass
class TextCleaner:
    lower: bool = True
    remove_punct: bool = True

    def clean(self, text: str) -> str:
        result = text
        if self.lower:
            result = result.lower()
        if self.remove_punct:
            result = re.sub(r"[^\\w\\s]", "", result)
        return result.strip()

cleaner = TextCleaner(lower=True)
print(cleaner.clean("!שלום, עולם!!!"))`;
  
  const textCleanerOutput = `שלום עולם`; // הפלט כאן בעברית ולכן לא נשים dir=ltr

  // --- Quiz ---
  const questions = [
    {
        id: 1,
        question: "מה התפקיד של המתודה __init__?",
        options: [
            "למחוק את האובייקט מהזיכרון",
            "לאתחל את האובייקט ולקבל פרמטרים ראשוניים בעת היצירה",
            "להדפיס את האובייקט למסך",
            "להמיר את האובייקט למחרוזת"
        ],
        correctAnswer: 1,
        explanation: "__init__ היא הבנאי (Constructor) של המחלקה. היא רצה אוטומטית כשיוצרים מופע חדש."
    },
    {
        id: 2,
        question: "מה עושה הדקורטור @dataclass?",
        options: [
            "הופך את המחלקה למהירה יותר",
            "יוצר אוטומטית מתודות כמו __init__, __repr__ ו-__eq__ כדי לחסוך קוד",
            "מונע יצירת מופעים מהמחלקה",
            "מחייב את המחלקה לעבוד עם בסיס נתונים"
        ],
        correctAnswer: 1,
        explanation: "@dataclass חוסך כתיבת קוד חוזר (Boilerplate) ומייצר אוטומטית את התשתית לאובייקטים שנועדו להחזיק נתונים."
    },
    {
        id: 3,
        question: "מה ההבדל בין מתודת מחלקה (@classmethod) למתודת מופע רגילה?",
        options: [
            "אין הבדל",
            "מתודת מופע מקבלת self ופועלת על אובייקט ספציפי, בעוד מתודת מחלקה מקבלת cls ופועלת ברמת המחלקה",
            "מתודת מחלקה לא יכולה לקבל פרמטרים",
            "מתודת מופע היא פרטית ואי אפשר לקרוא לה מבחוץ"
        ],
        correctAnswer: 1,
        explanation: "מתודת מופע (Instance Method) עובדת על הנתונים של אובייקט בודד (self). מתודת מחלקה עובדת על המחלקה כולה (cls) ושימושית למשל ליצירת מופעים (Factory)."
    }
  ];

  return (
    <ChapterLayout courseId="python" currentChapterId={9}>
        
        {/* --- Hero Section --- */}
        <div className="relative">
          {/* המנטור (xl+, משמאל) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="explain" line="מחלקה היא תבנית, לא קסם" width={160} accent={EMERALD_ACCENT} />
          </div>
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-400 mb-2">
                <Box size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">Object Oriented Programming</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                תכנות מונחה עצמים (OOP)
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
                בעידן של פונקציות ו-Pipelines, קל לשכוח את יסודות ה-OOP.
                <br/>
                אבל כשמערכת גדלה, הנתונים והפעולות צריכים &quot;בית&quot;. המחלקה (Class) היא הדרך לארגן מחשבה הנדסית ולבנות רכיבים עם זהות.
            </p>
        </section>
        </div>

        {/* --- 1. Basic Class --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-blue-500 pr-4 flex items-center gap-2">
                <BoxSelect size={24} className="text-blue-500"/>
                הגדרת מחלקה בסיסית
            </h3>
            
            <p className="text-slate-300">
                המחלקה היא התבנית, האובייקט הוא התוצר. <code>__init__</code> מאתחלת את הנתונים, ו-<code>self</code> הוא הגישה לאובייקט עצמו.
            </p>

            <LiveCodeEditor
                initialCode={basicClassCode}
            />
        </section>

        {/* --- 2. Magic Methods --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-yellow-500 pr-4 flex items-center gap-2">
                <Wand2 size={24} className="text-yellow-500"/>
                מתודות קסם (Magic Methods)
            </h3>
            
            <p className="text-slate-300">
                מתודות כמו <code>__str__</code> ו-<code>__len__</code> מאפשרות לאובייקט שלך להתנהג כמו אובייקט פייתון טבעי.
            </p>
            
            <LiveCodeEditor
                initialCode={magicMethodsCode}
            />
        </section>

        {/* --- 3. Class vs Instance Variables --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-purple-500 pr-4 flex items-center gap-2">
                <Layers size={24} className="text-purple-500"/>
                משתני מחלקה מול מופע
            </h3>
            
            <p className="text-slate-300">
                האם המידע שייך לרובוט הספציפי (שם), או לכל הרובוטים בעולם (גרסת תוכנה)?
            </p>

            {/* Interactive Visualizer */}
            <div className="mt-6">
                <ClassVsInstance />
            </div>

            <LiveCodeEditor
                initialCode={classVarCode}
            />
        </section>

        {/* --- 4. Decorators --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-orange-500 pr-4 flex items-center gap-2">
                <Fingerprint size={24} className="text-orange-500"/>
                @classmethod ו-@staticmethod
            </h3>
            
            <p className="text-slate-300">
                לא כל פעולה קשורה למופע ספציפי. לפעמים אנחנו רוצים &quot;מפעל&quot; ליצירת אובייקטים (classmethod) או סתם פונקציית עזר (staticmethod).
            </p>

            <LiveCodeEditor
                initialCode={decoratorsCode}
            />
        </section>

        {/* --- 5. Dataclasses --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-pink-500 pr-4 flex items-center gap-2">
                <PackageCheck size={24} className="text-pink-500"/>
                @dataclass: קוד נקי לאובייקטי מידע
            </h3>
            
            <p className="text-slate-300">
                במקום לכתוב את אותן מתודות שוב ושוב, <code>@dataclass</code> עושה את העבודה השחורה בשבילך.
            </p>

            {/* Interactive Lab */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">
                    <strong>מעבדת Dataclass:</strong> שחק עם ההגדרות וראה איך הקוד משתנה.
                </p>
                <DataclassLab />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
                <LiveCodeEditor
                initialCode={dataclassCode}
            />
                <LiveCodeEditor
                initialCode={frozenCode}
            />
            </div>

            <InsightBox type="info" title="מתי להשתמש ב-frozen?">
                השתמש ב-<code>frozen=True</code> עבור אובייקטים שלא אמורים להשתנות, כמו קונפיגורציה שנטענה או נקודה גיאוגרפית קבועה. זה מונע באגים של שינוי לא מכוון.
            </InsightBox>
        </section>

        {/* --- 6. Composition vs Inheritance --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-emerald-500 pr-4 flex items-center gap-2">
                <Combine size={24} className="text-emerald-500"/>
                קומפוזיציה (Composition)
            </h3>
            
            <p className="text-slate-300">
                במקום לרשת ממחלקה אחרת (&quot;להיות&quot;), עדיף להכיל אותה (&quot;להשתמש ב&quot;). זה גמיש ובטוח יותר.
            </p>

            <CompositionVis />

            <h4 className="text-xl font-bold text-white mt-8 mb-4">דוגמה מסכמת: TextCleaner</h4>
            <LiveCodeEditor
                initialCode={textCleanerCode}
            />
        </section>

        {/* --- Quiz --- */}
        <section className="mt-20">
            <Quiz questions={questions} title="מבדק ידע - פרק 9" />
        </section>

    </ChapterLayout>
  );
}