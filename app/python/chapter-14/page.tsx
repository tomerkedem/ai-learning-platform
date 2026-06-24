"use client";

import React from 'react';
import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';
import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';
import { Quiz } from '@/components/content/Quiz';
import { Mentor, EMERALD_ACCENT } from '@/components/ai-internals/Mentor';
import { DataFrameVis, PandasLab } from '@/components/demos/chapter-14';
import { 
    Table2, Database, Filter, FileSpreadsheet, 
    Merge, RefreshCw
} from 'lucide-react';

export default function Chapter14() {

  // --- Code Snippets & Outputs ---

  const basicPandasCode = `import pandas as pd

# יצירת DataFrame ממילון
data = {
    "name": ["Dana", "Roi", "Noa"],
    "age": [29, 34, None],
    "city": ["Tel Aviv", "Haifa", "Jerusalem"]
}
df = pd.DataFrame(data)

# חישוב ממוצע (מתעלם אוטומטית מ-NaN)
print(f"Average age: {df['age'].mean()}")

# סינון פשוט
active = df[df["age"] > 30]
print(f"Over 30: \\n{active}")`;

  const basicPandasOutput = `Average age: 31.5
Over 30: 
   name   age   city
1   Roi  34.0  Haifa`;

  const readCsvCode = `import pandas as pd

# טעינה עם הגדרת טיפוסים לחיסכון בזיכרון
# df = pd.read_csv("data/users.csv", dtype={"age": "float32"})

# לצורך הדגמה, ניצור את ה-DF ידנית
df = pd.DataFrame({
    "id": [1, 2, 3],
    "text": ["מוצר מצוין", "שרות גרוע", "נחמד מאוד"],
    "rating": [5, 1, 4]
})

print(df.head())`;

  const readCsvOutput = `   id        text  rating
0   1  מוצר מצוין       5
1   2   שרות גרוע       1
2   3   נחמד מאוד       4`;

  const locIlocCode = `import pandas as pd

df = pd.DataFrame({
    "name": ["Dana", "Roi", "Hila"],
    "role": ["Admin", "User", "User"],
    "age": [30, 25, 40]
}).set_index("name")

# שליפה לפי שם (Label)
print(f"Dana's role: {df.loc['Dana', 'role']}")

# שליפה לפי מיקום (Position)
print(f"First row age: {df.iloc[0, 1]}")`;

  const locIlocOutput = `Dana's role: Admin
First row age: 30`;

  const transformationsCode = `import pandas as pd

df = pd.DataFrame({
    "text": ["  Hello ", "WORLD", " python "],
    "score": [10, 20, 30]
})

# Map: שינוי עמודה בודדת
df["clean_text"] = df["text"].map(str.strip).map(str.lower)

# Apply: פונקציה מותאמת אישית
df["is_high"] = df["score"].apply(lambda x: x > 15)

print(df)`;

  const transformationsOutput = `       text  score clean_text  is_high
0    Hello      10      hello    False
1     WORLD     20      world     True
2   python      30     python     True`;

  const missingValuesCode = `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "A": [1, 2, np.nan],
    "B": [5, np.nan, np.nan],
    "C": [1, 2, 3]
})

# מילוי ערכים חסרים בממוצע
df["A"] = df["A"].fillna(df["A"].mean())

# הסרת שורות עם חוסרים
clean_df = df.dropna()

print("Filled A:\\n", df["A"])
print("Clean DF:\\n", clean_df)`;

  const missingValuesOutput = `Filled A:
 0    1.0
1    2.0
2    1.5
Name: A, dtype: float64
Clean DF:
    A    B  C
0  1.0  5.0  1`;

  const mergeCode = `import pandas as pd

users = pd.DataFrame({"id": [1, 2], "name": ["Dana", "Roi"]})
orders = pd.DataFrame({"id": [1, 1, 2], "amount": [100, 200, 50]})

# מיזוג (כמו SQL JOIN)
merged = pd.merge(users, orders, on="id", how="left")

print(merged)`;

  const mergeOutput = `   id  name  amount
0   1  Dana     100
1   1  Dana     200
2   2   Roi      50`;

  // --- Quiz ---
  const questions = [
    {
        id: 1,
        question: "מהו היתרון המרכזי של DataFrame על פני רשימת מילונים (List of Dicts)?",
        options: [
            "אין יתרון, זה אותו דבר",
            "DataFrame מאפשר פעולות וקטוריות מהירות, עבודה עם עמודות, וטיפול נוח בערכים חסרים",
            "רשימת מילונים תופסת פחות זיכרון",
            "DataFrame עובד רק עם מספרים"
        ],
        correctAnswer: 1,
        explanation: "Pandas בנויה מעל NumPy, מה שמאפשר לה לבצע חישובים על עמודות שלמות במהירות עצומה, בניגוד ללולאות איטיות על רשימות רגילות."
    },
    {
        id: 2,
        question: "מה עושה הפקודה df.loc['Dana', 'age']?",
        options: [
            "ניגשת לתא בשורה עם האינדקס 'Dana' ובעמודה 'age'",
            "ניגשת לשורה מספר 0 ולעמודה מספר 1",
            "מוחקת את השורה של דנה",
            "מחפשת את המילה Dana בכל הטבלה"
        ],
        correctAnswer: 0,
        explanation: "הפקודה loc עובדת לפי תוויות (Labels). היא מחפשת את האינדקס השמי ואת שם העמודה."
    },
    {
        id: 3,
        question: "באיזה פורמט מומלץ לשמור datasets גדולים לעבודה חוזרת?",
        options: [
            "CSV (קובץ טקסט פשוט)",
            "Excel (קובץ גיליון אלקטרוני)",
            "Parquet (פורמט בינארי דחוס יעיל)",
            "JSON (קובץ טקסט היררכי)"
        ],
        correctAnswer: 2,
        explanation: "Parquet הוא פורמט עמודות (Columnar) דחוס, שטוען נתונים מהר פי כמה מ-CSV ושומר על סוגי הנתונים (dtypes) בצורה מדויקת."
    }
  ];

  return (
    <ChapterLayout courseId="python" currentChapterId={14}>
        
        {/* --- Hero Section --- */}
        <div className="relative">
          {/* המנטור (xl+, משמאל) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="chart" line="טבלאות ענק, בכמה שורות" width={160} accent={EMERALD_ACCENT} />
          </div>
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <Table2 size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">Data Engineering with Pandas</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                Pandas למהנדסי AI
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
                Pandas היא השכבה האנושית של הנתונים. היא הופכת מטריצות מתמטיות (NumPy) לטבלאות עם משמעות.
                זהו הכלי המרכזי לניקוי, סינון והכנת דאטה למודלים.
            </p>
        </section>
        </div>

        {/* --- 1. Why Pandas? --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-blue-500 pr-4 flex items-center gap-2">
                <Database size={24} className="text-blue-500"/>
                למה Pandas ולא רשימות?
            </h3>
            
            <p className="text-slate-300">
                רשימות מעולות לאובייקטים בודדים. אבל כשצריך לנתח מיליון שורות, לחשב ממוצעים ולסנן לפי תנאים - Pandas מנצחת בנוקאאוט.
            </p>

            {/* Interactive Visualization */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">
                    <strong>השוואת מבני נתונים:</strong> ראה את ההבדל הוויזואלי בין הרשימה הגמישה לטבלה המובנית.
                </p>
                <DataFrameVis />
            </div>

            <LiveCodeEditor
                initialCode={basicPandasCode}
            />
        </section>

        {/* --- 2. Input/Output --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-yellow-500 pr-4 flex items-center gap-2">
                <FileSpreadsheet size={24} className="text-yellow-500"/>
                קריאה וכתיבה: CSV, Parquet, JSON
            </h3>
            
            <p className="text-slate-300">
                הצעד הראשון הוא לטעון את הנתונים. Pandas תומכת בכל פורמט אפשרי.
                טיפ: השתמש ב-<code>Parquet</code> לקבצים גדולים.
            </p>
            
            <LiveCodeEditor
                initialCode={readCsvCode}
            />
        </section>

        {/* --- 3. Selection & Filtering --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-purple-500 pr-4 flex items-center gap-2">
                <Filter size={24} className="text-purple-500"/>
                בחירה וסינון: loc, iloc
            </h3>
            
            <p className="text-slate-300">
                איך מוצאים את מה שחשוב? <code>loc</code> עובד לפי שמות, <code>iloc</code> לפי מיקום, וסינון בוליאני עובד לפי לוגיקה.
            </p>

            {/* Interactive Lab */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">
                    <strong>מעבדת Pandas:</strong> נסה לסנן ולנקות את הטבלה בעצמך.
                </p>
                <PandasLab />
            </div>

            <LiveCodeEditor
                initialCode={locIlocCode}
            />
        </section>

        {/* --- 4. Transformations --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-orange-500 pr-4 flex items-center gap-2">
                <RefreshCw size={24} className="text-orange-500"/>
                טרנספורמציות: apply, map
            </h3>
            
            <p className="text-slate-300">
                עיבוד הנתונים בפועל. <code>map</code> לעמודה בודדת, <code>apply</code> ללוגיקה מורכבת יותר.
            </p>

            <LiveCodeEditor
                initialCode={transformationsCode}
            />
        </section>

        {/* --- 5. Missing Data & Merging --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-red-500 pr-4 flex items-center gap-2">
                <Merge size={24} className="text-red-500"/>
                מיזוג וטיפול בחוסרים
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-white font-bold mb-2">טיפול ב-NaN</h4>
                    <LiveCodeEditor
                initialCode={missingValuesCode}
            />
                </div>
                <div>
                    <h4 className="text-white font-bold mb-2">מיזוג (Merge)</h4>
                    <LiveCodeEditor
                initialCode={mergeCode}
            />
                </div>
            </div>

            <InsightBox type="intuition" title="מתי לעבור ל-Polars?">
                אם ה-dataset שלך גדול מהזיכרון (למשל 10GB+) או ש-Pandas נהיה איטי מדי, זה הזמן לבדוק את הספרייה <strong>Polars</strong> או <strong>Dask</strong>. הן עובדות בצורה דומה אך יעילה הרבה יותר לנפחים עצומים.
            </InsightBox>
        </section>

        {/* --- Quiz --- */}
        <section className="mt-20">
            <Quiz questions={questions} title="מבדק ידע - פרק 14" />
        </section>

    </ChapterLayout>
  );
}