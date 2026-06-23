"use client";

import React from 'react';
import { 
    Compass, Target, Layers, Terminal, GraduationCap, Code2, 
    Activity, ShieldAlert, Zap, BrainCircuit, LineChart
} from 'lucide-react';

import { ChapterLayout } from '@/components/ChapterLayout';
import { AssessmentEngine } from '@/components/content/AssessmentEngine';
import { InsightBox } from '@/components/content/InsightBox';
import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';

// רכיבי המעבדות המקומיים
import { VectorLab } from './components/VectorLab';
import { DistanceSim } from './components/DistanceSim';

export default function Chapter1() {

  // --- Quiz Questions ---
  const chapterQuestions = [
    {
        id: 1,
        question: "מהי המשמעות המעשית של 'מיקום וקטורי' עבור מודל AI?",
        options: [
            "כמות הזיכרון שהמילה תופסת בשרת",
            "כתובת גיאומטרית במרחב סמנטי המגדירה את ה'משמעות' של הנתון",
            "המספר הסידורי של המילה במילון",
            "דירוג הפופולריות של המילה"
        ],
        correctAnswer: 1,
        explanation: "וקטור הוא הדרך של המודל לייצג משמעות כמיקום גיאומטרי[cite: 61, 199]. פריטים קרובים במרחב נתפסים כדומים רעיונית[cite: 71, 204]."
    },
    {
        id: 2,
        question: "כיצד 'דמיון קוסינוס' עוזר לנו מעבר למרחק רגיל (אוקלידי)?",
        options: [
            "הוא מהיר יותר לחישוב בפייתון",
            "הוא בוחן את כיוון הוקטור (הקשר סמנטי) ולא רק את המרחק הפיזי",
            "הוא מוחק נתונים מיותרים מהוקטור",
            "הוא תמיד נותן תוצאה חיובית"
        ],
        correctAnswer: 1,
        explanation: "דמיון קוסינוס בודק את הזווית והכיוון [cite: 243-247]. אם שני וקטורים מצביעים לאותו כיוון, הם חולקים הקשר נושאי דומה גם אם עוצמתם המספרית שונה[cite: 245, 258]."
    },
    {
        id: 3,
        question: "מה מייצגת ה'נורמה' של וקטור בעולם ה-Embeddings?",
        options: [
            "את אורך הווקטור, המעיד על עוצמת האות או חשיבות המידע",
            "את כמות השגיאות שיש בנתונים",
            "את מספר הממדים שיש לוקטור",
            "את הזמן שלקח למודל לעבד את הנתון"
        ],
        correctAnswer: 0,
        explanation: "הנורמה היא מספר יחיד המייצג את 'גודל' או עוצמת הווקטור כולו [cite: 228-230, 323]. נורמה גבוהה מעידה על וקטור 'חזק' יותר מבחינה מספרית[cite: 236]."
    },
    {
        id: 4,
        question: "מדוע מודלים לומדים מ'לוס' (Loss) ולא ישירות מהצלחה?",
        options: [
            "כי קל יותר למחשב לחסר מאשר לחבר",
            "כי הלוס מגדיר את כיוון התיקון הנדרש כדי לצמצם את הפער מהמציאות",
            "כי לוס תופס פחות מקום בזיכרון",
            "כי הצלחה היא עניין סובייקטיבי למודל"
        ],
        correctAnswer: 1,
        explanation: "הלוס הוא המצפן שמורה למודל כמה הוא טעה ובאיזה כיוון עליו להשתפר [cite: 93, 662-663]. זהו הדלק שמניע את תהליך הלמידה[cite: 109]."
    },
    {
        id: 5,
        question: "מהי הסכנה ההנדסית בשימוש בנתונים עם 'ערכים חריגים' (Outliers)?",
        options: [
            "הם גורמים למודל לעבוד לאט יותר",
            "הם עלולים להסיט את הניבוי של המודל ולייצר 'טעות יציבה' שאינה משקפת את המציאות",
            "הם גורמים למחיקת וקטורים אחרים",
            "הם משנים את שפת התכנות של המודל"
        ],
        correctAnswer: 1,
        explanation: "מודלים מגיבים בצורה עקבית ומדויקת למספרים[cite: 184]. שינוי קטן או חריג בדאטה עלול להסיט את כיוון הלמידה כולו, בדיוק כמו שמדרון משנה את מסלול הגלגול של כדור [cite: 184, 503-505]."
    }
  ];

  return (
    <ChapterLayout courseId="mathProbabilistic" currentChapterId={1}>
        
        {/* --- Hero Section --- */}
        <section className="space-y-6 text-right" dir="rtl">
            <div className="flex items-center gap-3 text-blue-400 mb-2 justify-start">
                <Terminal size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">Applied Intuition 01</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                למה אנחנו צריכים מתמטיקה יישומית בעולם של AI?
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                מאחורי כל פעולה של המודל – סיכום טקסט, השלמת קוד או סיווג תמונה – עומד חישוב מתמטי מדויק. בפרק זה נחדל לראות במודל &apos;קופסה שחורה&apos; ונתחיל להבין את ההיגיון הגיאומטרי שמניע אותו.            </p>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex gap-4 mt-6 items-start">
                <BrainCircuit className="text-blue-500 shrink-0 mt-1" size={24} />
                <div>
                    <h4 className="font-bold text-white mb-1">המתמטיקה היא המצפן שלך</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        כשמבינים את המספרים שמאחורי הקלעים, אפשר להגיד בביטחון מתי המודל פועל בהיגיון ומתי הדאטה מטעה אותו. הבנת הווקטורים והמרחב היא הצעד הראשון להפיכה ממפתח שמשתמש ב-AI למפתח שבונה AI.
                    </p>
                </div>
            </div>
        </section>

        {/* --- 1. וקטורים --- */}
        <section className="mt-20 space-y-8 text-right" dir="rtl">
            <h3 className="text-2xl font-bold text-white border-r-4 border-blue-500 pr-4 flex items-center gap-3">
                <Layers size={24} className="text-blue-500"/>
                1. וקטורים: ה-DNA של המידע
            </h3>
            
            <div className="space-y-6 text-slate-300 leading-loose">
                <p>המודל מתרגם כל פיסת מידע לוקטור - רשימה מסודרת של מספרים המייצגת משמעות במרחב רב-ממדי.</p>
                <InsightBox type="intuition" title="וקטור הוא כתובת גיאומטרית">
                    עבור המודל, מילה היא נקודה במרחב. ככל ששתי מילים &quot;קרובות&quot; יותר מתמטית, המודל תופס אותן כבעלות משמעות דומה.
                </InsightBox>
            </div>
            
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-sm">
                <VectorLab />
            </div>

            <div className="mt-10 space-y-4">
                <h4 className="font-bold text-white flex items-center gap-2">
                    <Code2 size={20} className="text-blue-400" />
                    <span>ניסוי בקוד: יצירת וקטור ב-Numpy</span>
                </h4>
                <p className="text-slate-400 text-sm">
                    ב-AI, אנחנו משתמשים בספריית <code>numpy</code> לניהול וקטורים. שים לב איך כל מספר במערך מייצג &quot;ממד&quot; אחר של המידע.
                </p>
                <LiveCodeEditor 
                    initialCode={`import numpy as np\n\n# הגדרת וקטור למילה "טכנולוגיה"\nv = np.array([0.3, 1.2, 4.8])\n\nprint("הייצוג הווקטורי:")\nprint(v)\nprint(f"מספר ממדים: {v.shape}")`}
                />
            </div>
        </section>

        {/* --- 2. נורמות ומרחקים --- */}
        <section className="mt-24 space-y-8 text-right" dir="rtl">
            <h3 className="text-2xl font-bold text-white border-r-4 border-emerald-500 pr-4 flex items-center gap-3">
                <Compass size={24} className="text-emerald-400"/>
                2. נורמות ומרחקים: הגיאומטריה של הדמיון
            </h3>

            <p className="text-slate-300 leading-relaxed">
                כדי להבין מה דומה למה, המודל מודד מרחק. המרחק האוקלידי בודק את הקו הישר, בעוד שדמיון קוסינוס בודק את הכיוון (הזווית) בין המושגים.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 mb-2 font-mono text-xs uppercase tracking-widest justify-start">
                        <Code2 size={14} /> <span>Euclidean Distance</span>
                    </div>
                    <LiveCodeEditor 
                        initialCode={`import numpy as np\na = np.array([1, 2, 3])\nb = np.array([1.5, 2.3, 2.7])\n\n# חישוב המרחק הפיזי בין הנקודות\ndist = np.linalg.norm(a - b)\nprint(f"מרחק אוקלידי: {dist:.3f}")`}
                    />
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-400 mb-2 font-mono text-xs uppercase tracking-widest justify-start">
                        <Code2 size={14} /> <span>Cosine Similarity</span>
                    </div>
                    <LiveCodeEditor 
                        initialCode={`import numpy as np\na = np.array([1, 2, 3])\nb = np.array([1, 2, 2.5])\n\n# חישוב דמיון קוסינוס (זווית)\nsim = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))\nprint(f"דמיון קוסינוס: {sim:.3f}")`}
                    />
                </div>
            </div>

            <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 mt-12 shadow-2xl backdrop-blur-sm">
                <DistanceSim />
            </div>
        </section>
        
        {/* --- אתגר יישומי: דמיון סמנטי --- */}
        <section className="mt-24 space-y-8 text-right bg-blue-500/5 p-8 rounded-[3rem] border border-blue-500/20" dir="rtl">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/40">
                    <Zap size={24} className="text-blue-400 animate-pulse" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-white">אתגר 01: המרדף אחרי הדמיון המושלם</h3>
                    <p className="text-slate-400 text-sm">הפוך את המתמטיקה לכלי עבודה בשטח</p>
                </div>
            </div>

            <div className="space-y-4 text-slate-300">
                <p>
                    וקטור המטרה שלנו (<code>vector_a</code>) מייצג את המושג <strong>&quot;בינה מלאכותית&quot;</strong> במרחב הסמנטי. 
                </p>
                <p className="font-bold text-white">
                    המשימה שלך: שנה את הערכים בוקטור <code>vector_b</code> כך שהמודל יזהה דמיון של 98% לפחות (0.98 ומעלה).
                </p>
                <div className="bg-black/30 p-4 rounded-xl text-xs border border-white/5 italic">
                    💡 <strong>רמז מהספר:</strong> דמיון קוסינוס בוחן כיוון. נסה לשמור על יחס דומה בין המספרים לזה של וקטור המטרה.
                </div>
            </div>

            
            <LiveCodeEditor
                initialCode={`import numpy as np

# וקטור המטרה (בינה מלאכותית)
vector_a = np.array([1.2, 2.4, 0.5])
# המשימה שלך: שנה את הערכים כאן כדי להגיע לדמיון של 0.98 ומעלה
vector_b = np.array([5.0, 1.0, 2.0])

def calculate_similarity(a, b):
    dot_product = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    return dot_product / (norm_a * norm_b)

def draw_vectors(a, b):
    # ויזואליזציה בסיסית של כיוון הווקטורים ב-2D (ממדים ראשונים)
    print("\\n--- מפת כיוונים (2D Projection) ---")
    grid_size = 10
    grid = [[' ' for _ in range(grid_size)] for _ in range(grid_size)]

    for vec, char in [(a, 'A'), (b, 'B')]:
        # נרמול למיקום על הגריד
        x = int((vec[0] / np.max([a[0], b[0], 1])) * (grid_size - 1))
        y = int((vec[1] / np.max([a[1], b[1], 1])) * (grid_size - 1))
        grid[grid_size - 1 - y][x] = char

    for row in grid:
        print('|' + ''.join(row) + '|')
    print(' ' + '-' * grid_size)
    print("A = Target, B = Your Guess")

sim = calculate_similarity(vector_a, vector_b)
print(f"Current Similarity: {sim:.4f}")

# הצגת המפה רק אם אין שגיאת תחביר
draw_vectors(vector_a, vector_b)

if sim >= 0.98:
    print("\\n🌟 הצלחת! הבנת איך כיוון הווקטור קובע דמיון.")
else:
    print("\\n❌ עדיין לא שם... נסה לשנות את הערכים ב-vector_b.")`}
            />
        </section>


        {/* --- 3. לוס --- */}
        <section className="mt-24 space-y-8 text-right" dir="rtl">
            <h3 className="text-2xl font-bold text-white border-r-4 border-red-500 pr-4 flex items-center gap-3">
                <Target size={24} className="text-red-500"/>
                3. לוס: למה מודלים לומדים מטעויות?
            </h3>
            
            <div className="space-y-6 text-slate-300">
                <p>מודלים לומדים מטעויות, לא מהצלחה. הלוס (Loss) מודד את הפער בין הניבוי למציאות.</p>
                <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-xl">
                    <p className="text-sm text-slate-200 leading-relaxed">
                        מנגנון ה-<strong>Gradient Descent</strong> הוא מנוע הניווט המתמטי. הוא בודק את &quot;שיפוע&quot; הטעות ומבצע צעדים קטנים בכיוון ההפוך כדי להגיע למינימום טעות.
                    </p>
                </div>
            </div>

            

            <div className="mt-10">
                <h4 className="font-bold text-white flex items-center gap-2 mb-4">
                    <Activity size={20} className="text-red-400" />
                    <span>סימולציה: צעד למידה אחד (Gradient Descent)</span>
                </h4>
                <LiveCodeEditor 
                    initialCode={`# חישוב לוס ועדכון פרמטר\nx = -1.0 # ניחוש נוכחי\nlr = 0.1 # קצב למידה\n\n# שיפוע פונקציית הטעות\ngradient = 2 * (x - 3)\n\n# עדכון: נסיגה נגד כיוון השיפוע\nx_new = x - lr * gradient\nprint(f"הלוס החדש: {(x_new-3)**2:.4f}")`}
                />
            </div>
        </section>

        {/* --- 4. טעויות נפוצות --- */}
        <section className="mt-24 space-y-8 text-right" dir="rtl">
            <h3 className="text-2xl font-bold text-white border-r-4 border-amber-500 pr-4 flex items-center gap-3">
                <ShieldAlert size={24} className="text-amber-500"/>
                4. איפה מפתחים טועים?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-xl hover:bg-white/[0.07] transition-all group">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-3 text-lg">
                        <Zap size={20} className="text-amber-400" />
                        התעלמות מהלוס
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed">מפתחים רואים בפלט אמת מוחלטת בלי לבדוק את הלוס. בלי הבנת השגיאה, אי אפשר לדעת אם המודל מנחש או באמת יודע.</p>
                </div>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-xl hover:bg-white/[0.07] transition-all group">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-3 text-lg">
                        <ShieldAlert size={20} className="text-red-400" />
                        אמון עיוור בדאטה
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed">דאטה הוא חומר הגלם. אם הוא מוטה או לא יציב, המודל ילמד טעות יציבה ויתרגם אותה לניבויים שגויים באופן עקבי.</p>
                </div>
            </div>
        </section>

        {/* --- 5. רגישות לדאטה --- */}
        <section className="mt-24 space-y-8 text-right" dir="rtl">
            <h3 className="text-2xl font-bold text-white border-r-4 border-pink-500 pr-4 flex items-center gap-3">
                <LineChart size={24} className="text-pink-500"/>
                5. דוגמה הנדסית: רגישות המודל לדאטה
            </h3>
            
            <p className="text-slate-300 leading-relaxed">
                צפה איך שינוי זעיר (Data Drift) בנקודת קלט אחת בלבד מסוגל להסיט את כל כיוון הניבוי של המודל. זהו הלב של הבנת יציבות במודלים.
            </p>

            <LiveCodeEditor 
                initialCode={`import numpy as np\nx = np.array([1, 2, 3, 4])\ny = np.array([2, 4, 6, 8]) # יחס מושלם y=2x\n\n# שיבוש זעיר בנקודה אחת\ny[2] += 0.8\n\n# חישוב שיפוע המודל המעודכן\nnew_slope = np.sum(x * y) / np.sum(x * x)\nprint(f"שיפוע מעודכן: {new_slope:.3f}")`}
            />
        </section>

        {/* --- Quiz Section --- */}
        <section className="mt-32 border-t border-white/5 pt-10 text-right" dir="rtl">
            <div className="max-w-4xl mx-auto">
               <div className="flex items-center gap-4 justify-start mb-16 pr-6 border-r-4 border-blue-400/30">
                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-inner">
                        <GraduationCap size={28} className="text-blue-400 opacity-80" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-black text-white tracking-tight">בוחן הסמכה: פרק 1</h2>
                        <p className="text-slate-500 text-base font-medium opacity-70">הוכח שליטה באבני היסוד של ה-AI להמשך הלומדה</p>
                    </div>
                </div>
                
               
                    <AssessmentEngine 
                        title="מבדק אינטואיציה מתמטית" 
                        subtitle="ענה על השאלות בעיון כדי לקבל הסמכה להמשך" 
                        questions={chapterQuestions} 
                    />
               
            </div>
        </section>

    </ChapterLayout>
  );
}