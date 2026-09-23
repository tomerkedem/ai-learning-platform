"use client";

import React from 'react';

import { InsightBox } from '@/components/content/InsightBox';
import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';
import { Quiz } from '@/components/content/Quiz';
// --- התיקון: ייבוא מהתיקייה הייעודית של פרק 2 ---
import { AgeDemo, SlicingDemo, ComprehensionDemo, CleanSentencesDemo } from '@/components/demos/chapter-2';
import { 
    Variable, Split, Repeat, Scissors, Type, 
    ToggleRight, Braces, Terminal, Check, X,
    Sparkles, Edit3
} from 'lucide-react';
import { ChapterLayout } from '@/components/ChapterLayout';
import { Mentor, EMERALD_ACCENT } from '@/components/ai-internals/Mentor';

export default function Chapter2() {



  // --- שאלות למבחן ---
  const questions = [
    {
        id: 1,
        question: "מה קורה כשמגדירים משתנה בפייתון (למשל x = 10)?",
        options: [
            "המשתנה x מקבל סוג int לנצח ולא ניתן לשנותו",
            "נוצר אובייקט 10 בזיכרון, ו-x הוא רק תווית (מצביע) אליו",
            "פייתון דורשת להצהיר int x = 10 לפני כן",
            "המשתנה x נשמר כמחרוזת כברירת מחדל"
        ],
        correctAnswer: 1,
        explanation: "בפייתון הטיפוס שייך לערך (לאובייקט), לא למשתנה. המשתנה הוא רק שם שמצביע למיקום בזיכרון."
    },
    {
        id: 2,
        question: "איזה מהערכים הבאים ייחשב כ-False בתנאי if?",
        options: [
            "המספר -1",
            "המחרוזת \"False\"",
            "רשימה ריקה []",
            "המספר 0.00001"
        ],
        correctAnswer: 2,
        explanation: "בפייתון, מבנים ריקים (כמו רשימה ריקה, מחרוזת ריקה) והמספר 0 נחשבים False. כל מספר שאינו 0 (כולל שלילי) הוא True."
    },
    {
        id: 3,
        question: "מה היתרון העיקרי של List Comprehension?",
        options: [
            "הוא מאפשר לכתוב לולאות אינסופיות בקלות",
            "הוא הדרך היחידה ליצור רשימות בפייתון",
            "הוא מצהיר על הכוונה (מה אנחנו רוצים) בשורה אחת קריאה ויעילה",
            "הוא עובד רק עם מספרים שלמים"
        ],
        correctAnswer: 2,
        explanation: "List Comprehension הופך לוגיקה של 'יצירה, לולאה, סינון והוספה' לשורה אחת שמסבירה מה אנחנו בונים."
    },
    {
        id: 4,
        question: "כיצד מומלץ לחבר כמות גדולה של מחרוזות בפייתון?",
        options: [
            "בעזרת אופרטור + בתוך לולאה",
            "בעזרת f-strings",
            "בעזרת הפונקציה join()",
            "אי אפשר לחבר מחרוזות בפייתון"
        ],
        correctAnswer: 2,
        explanation: "השימוש ב-join יעיל משמעותית מחיבור ב-+, כיוון שהוא יוצר את המחרוזת הסופית בפעולה אחת בזיכרון במקום ליצור עותקים זמניים רבים."
    }
  ];

  return (
    <ChapterLayout courseId="python" currentChapterId={2}>
        
        {/* --- פתיחה --- */}
        <div className="relative">
          {/* המנטור (xl+, משמאל) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="code" line="תחביר נקי = קוד שמתחזק את עצמו" width={160} accent={EMERALD_ACCENT} bubbleSide="bottom" />
          </div>
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-yellow-400 mb-2">
                <Variable size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">Basic Syntax</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                יסודות פייתון למתכנתים מנוסים
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
                בפייתון הכול מתחיל בפשטות. אבל מאחורי הפשטות הזו מסתתרת הרבה חכמה.
                בניגוד לשפות שמכריחות אותך להצהיר מראש על טיפוס המשתנה, בפייתון הטיפוס שייך לערך, לא למשתנה עצמו.
                זו אחת התפיסות החשובות ביותר להבין לפני שמתחילים לעבוד איתה ברצינות.
            </p>
        </section>
        </div>

        {/* --- משתנים וטיפוסים --- */}
        <section className="mt-12 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-blue-500 pr-4">
                משתנים וטיפוסים מובנים
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                    <p className="text-slate-300 mb-4">
                        בארבע שורות קצרות יצרנו ארבעה טיפוסים שונים לגמרי, בלי שום הצהרה מוקדמת:
                    </p>
                    <LiveCodeEditor initialCode={`name = "Tomer"      # str
age = 32            # int
active = True       # bool
score = None        # NoneType

print(f"name type: {type(name)}")
print(f"age type: {type(age)}")`} />
                </div>
                
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700 font-bold text-white flex items-center gap-2">
                        <Type size={16} className="text-blue-400"/> הטיפוסים הבסיסיים
                    </div>
                    <div className="p-4 space-y-3">
                        {[
                            { type: "int", ex: "42", desc: "מספר שלם" },
                            { type: "float", ex: "3.14", desc: "מספר עשרוני" },
                            { type: "str", ex: "\"hello\"", desc: "מחרוזת טקסט" },
                            { type: "bool", ex: "True", desc: "ערך לוגי" },
                            { type: "None", ex: "None", desc: "היעדר ערך (null)" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm border-b border-slate-800 last:border-0 pb-2 last:pb-0">
                                <span className="font-mono text-yellow-400 w-16">{item.type}</span>
                                <span className="font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded">{item.ex}</span>
                                <span className="text-slate-300 w-24 text-left">{item.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <LiveCodeEditor initialCode={`def add(a: int, b: int) -> int:
    return a + b

# ה-IDE יצעק עליך אם תנסה:
# add("10", 20)

result = add(10, 20)
print(f"Result: {result}")`} />
        </section>

        {/* --- תנאים --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-purple-500 pr-4 flex items-center gap-2">
                <Split size={24} className="text-purple-500"/>
                תנאים והיגיון בוליאני
            </h3>
            
            <p className="text-slate-300">
                התחביר פשוט להפליא: אין סוגריים, אין נקודה-פסיק. הקוד נקרא כמו אנגלית.
            </p>
            <LiveCodeEditor initialCode={`temperature = 31
 
if temperature > 30:
    print("חם מאוד היום!")
elif temperature > 20:
    print("מזג אוויר נעים")
else:
    print("קריר בחוץ")`} />

            <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                    <div className="flex items-center gap-2 text-red-400 font-bold mb-4">
                        <X size={20} />
                        Falsy Values (שקר)
                    </div>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 font-mono text-sm">
                        <li>0, 0.0</li>
                        <li>&quot;&quot; (Empty String)</li>
                        <li>[], {}, () (Empty Collections)</li>
                        <li>None</li>
                        <li>False</li>
                    </ul>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4">
                        <Check size={20} />
                        Truthy Values (אמת)
                    </div>
                    <p className="text-slate-300">
                        כל דבר אחר שאינו ברשימה האדומה.
                    </p>
                </div>
            </div>

            <InsightBox type="intuition" title="טיפ הנדסי: היפטרות מ-if">
                במערכות מורכבות, שרשרת של if/elif הופכת לספגטי. הדרך הפייתונית היא להשתמש במילון (Dictionary) לניהול החלטות.
            </InsightBox>
            
            <LiveCodeEditor initialCode={`actions = {
    "hot": "הפעל מזגן",
    "cold": "הפעל חימום",
    "normal": "אין צורך בפעולה"
}
 
state = "hot"
print(f"Action: {actions[state]}")`} />
        </section>

        {/* --- לולאות --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-orange-500 pr-4 flex items-center gap-2">
                <Repeat size={24} className="text-orange-500"/>
                לולאות (Loops)
            </h3>
            <p className="text-slate-300">
                בפייתון, for לא נועדה &quot;לספור צעדים&quot; אלא לעבור על אובייקטים (Iterables).
            </p>
            <LiveCodeEditor initialCode={`names = ["תמר", "נועם", "תומר"]
 
# גם הערך וגם האינדקס
for i, name in enumerate(names):
    print(f"{i}: {name}")`} />
        </section>

        {/* --- חיתוכים (עם הדגמה אינטראקטיבית מתוך התיקייה החדשה) --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-pink-500 pr-4 flex items-center gap-2">
                <Scissors size={24} className="text-pink-500"/>
                חיתוכים (Slicing)
            </h3>
            
            <p className="text-slate-300">
                מעט תכונות חוסכות כל כך הרבה קוד כמו Slicing. התחביר הוא <code>[start:end:step]</code>.
                זה מאפשר גישה מהירה לחלקים מרשימות ומחרוזות.
                <br/>
                <span className="text-indigo-400 text-sm font-bold flex items-center gap-1 mt-2">
                    <Edit3 size={14}/> נסה בעצמך: שנה את הערכים למטה
                </span>
            </p>
            
            <SlicingDemo />
            
            <InsightBox type="info" title="חיבור מחרוזות יעיל">
                בעבודה עם טקסטים, הימנע משרשור עם <code>+</code> בתוך לולאות. זה יוצר המון עותקים בזיכרון.
                במקום זאת, השתמש ב-<code>&quot;&quot;.join(list)</code> שהוא יעיל פי כמה.
            </InsightBox>
        </section>

        {/* --- f-strings (עם הדגמה אינטראקטיבית) --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-yellow-500 pr-4 flex items-center gap-2">
                <Type size={24} className="text-yellow-500"/>
                f-strings: פורמט מודרני
            </h3>
            
            <p className="text-slate-300">
                מאז גרסה 3.6, זה הסטנדרט. פשוט שמים <code>f</code> לפני המחרוזת וכותבים קוד בתוך <code>{`{}`}</code>.
                זה מאפשר לבצע חישובים ישירות בתוך הטקסט.
            </p>
            
            <AgeDemo />

        </section>

        {/* --- List Comprehensions (עם הדגמה אינטראקטיבית) --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-emerald-500 pr-4 flex items-center gap-2">
                <Braces size={24} className="text-emerald-500"/>
                List Comprehensions
            </h3>
            
            <div className="prose prose-invert text-slate-300 leading-8">
                <p>
                    במקום &quot;צור רשימה, עבור בלולאה, הוסף איברים&quot;, פייתון אומרת: <strong>&quot;בנה רשימה של איברים שעומדים בתנאי.&quot;</strong>
                    נסה לשנות את גודל הטווח ואת תנאי הסינון:
                </p>
            </div>
            
            <ComprehensionDemo />
            
            <div className="flex gap-4 mt-4 text-sm text-slate-400">
                <div className="bg-slate-800/50 px-3 py-1 rounded border border-slate-700">Set: {`{n*n for n in range(5)}`}</div>
                <div className="bg-slate-800/50 px-3 py-1 rounded border border-slate-700">Dict: {`{n: n*n ...}`}</div>
            </div>
        </section>

        {/* --- דוגמה מסכמת (עם הדגמה אינטראקטיבית) --- */}
        <section className="mt-20 space-y-6">
            <h3 className="text-2xl font-bold text-white border-r-4 border-indigo-500 pr-4 flex items-center gap-2">
                <Terminal size={24} className="text-indigo-500"/>
                דוגמה מרכזית: ניקוי נתונים הנדסי
            </h3>
            
            <p className="text-slate-300">
                הגיע הזמן לחבר הכל. נבנה פונקציה שמקבלת רשימת משפטים, מנקה רווחים, ומסננת שורות ריקות.
                <br/>
                <strong>נסה בעצמך:</strong> ערוך את הטקסטים ברשימה למטה (raw), הוסף שורות חדשות, ותראה איך הפלט מתעדכן אוטומטית.
            </p>

            {/* רכיב ה-CleanSentencesDemo מתוך התיקייה החדשה */}
            <CleanSentencesDemo />
        </section>

        {/* --- סיכום --- */}
        <section className="mt-20 bg-linear-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3 mb-4 text-white">
                <Sparkles className="text-yellow-400" />
                <h3 className="text-xl font-bold">סיכום: איך לחשוב &quot;פייתונית&quot;</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8 text-slate-300 leading-relaxed">
                <div>
                    <h4 className="font-bold text-white mb-2">פשטות לפני הכול</h4>
                    <p>פייתון מעודדת אותך לוותר על תחבולות ולהעדיף בהירות. אם אפשר לכתוב דבר אחד ברור בשורה אחת, אין סיבה לפרוס אותו על שלוש.</p>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-2">תחשוב ב&quot;מה&quot;, לא ב&quot;איך&quot;</h4>
                    <p>בשפות אחרות אתה מתאר צעדים טכניים. בפייתון אתה מתאר את התוצאה הרצויה (כמו ב-Comprehensions).</p>
                </div>
            </div>
        </section>

        {/* --- מבחן --- */}
        <section className="mt-20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <ToggleRight className="text-purple-400"/>
                בוא נראה שהבנת
            </h3>
            <Quiz questions={questions} title="מבדק ידע - פרק 2" />
        </section>

    </ChapterLayout>
  );
}