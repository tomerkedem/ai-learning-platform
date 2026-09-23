"use client";

import React from 'react';
import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';
import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';
import { Quiz } from '@/components/content/Quiz';
import { Mentor, EMERALD_ACCENT } from '@/components/ai-internals/Mentor';
import { PathNavigator, EnvConfigLab } from '@/components/demos/chapter-7';
import { 
    FolderOpen, FileJson, Settings, HardDrive, 
    FileText, Globe, Database 
} from 'lucide-react';

export default function Chapter7() {

  // --- Code Snippets & Outputs ---

  const pathlibCode = `from pathlib import Path

# יצירת נתיב בסיס (התיקייה הנוכחית)
base_dir = Path(".").resolve()

# שרשור נתיבים בצורה חכמה (עובד בכל מערכת הפעלה)
data_path = base_dir / "data" / "dataset.csv"

# יצירת תיקייה אם לא קיימת
# data_path.parent.mkdir(parents=True, exist_ok=True)

print(f"Base: {base_dir}")
print(f"Target: {data_path}")`;
  
  const pathlibOutput = `Base: /home/user/projects/ai-course
Target: /home/user/projects/ai-course/data/dataset.csv`;

  const findRootCode = `from pathlib import Path

def find_project_root() -> Path:
    # סימולציה של חיפוש כלפי מעלה
    current = Path("/home/user/projects/ai-course/src/utils").resolve()
    for parent in current.parents:
        if (parent / ".git").exists() or (parent / "pyproject.toml").exists():
            return parent
    return Path("/home/user/projects/ai-course") # Fallback for demo

root = find_project_root()
print(f"Project Root: {root}")`;
  
  const findRootOutput = `Project Root: /home/user/projects/ai-course`;

  const jsonUnicodeCode = `import json
from pathlib import Path

data = {"model": "gpt-4", "language": "עברית"}
path = Path("config.json")

# כתיבה נכונה (שומרת על עברית קריאה)
# with path.open("w", encoding="utf-8") as f:
#    json.dump(data, f, ensure_ascii=False, indent=2)

# הדמיה של מה שנכתב לקובץ:
json_str = json.dumps(data, ensure_ascii=False, indent=2)
print(json_str)`;

  const jsonUnicodeOutput = `{
  "model": "gpt-4",
  "language": "עברית"
}`;

  const parquetCode = `import pandas as pd

# קריאת CSV איטית
# df = pd.read_csv("data/users.csv")

# שמירה לפורמט Parquet (בינארי ומהיר)
# df.to_parquet("data/users.parquet", index=False)

print("Saved users.parquet successfully.")
print("File size reduced by ~60%.")
print("Loading time: 0.1s (vs 2.5s CSV)")`;

  const parquetOutput = `Saved users.parquet successfully.
File size reduced by ~60%.
Loading time: 0.1s (vs 2.5s CSV)`;

  const envLoadCode = `import os
# from dotenv import load_dotenv
# load_dotenv()  # טוען משתנים מקובץ .env

# סימולציה של משתנה סביבה
os.environ["API_KEY"] = "sk-12345-secret"

api_key = os.getenv("API_KEY")
if not api_key:
    raise ValueError("Missing API_KEY!")

print(f"Loaded Key: {api_key[:4]}****")`;

  const envLoadOutput = `Loaded Key: sk-1****`;

  const universalLoaderCode = `from pathlib import Path
import json

def load_file(path: Path):
    if path.suffix == ".json":
        # Simulating file read
        return {"status": "loaded", "type": "json"}
    
    if path.suffix == ".csv":
        return "DataFrame[rows=100, cols=5]"
        
    raise ValueError(f"Unknown format: {path.suffix}")

print(load_file(Path("config.json")))
print(load_file(Path("data.csv")))`;

  const universalLoaderOutput = `{'status': 'loaded', 'type': 'json'}
DataFrame[rows=100, cols=5]`;

  // --- Quiz ---
  const questions = [
    {
        id: 1,
        question: "מדוע מומלץ להשתמש ב-pathlib במקום במחרוזות רגילות לנתיבים?",
        options: [
            "כי זה נראה יותר מקצועי",
            "כי זה מטפל אוטומטית בהבדלים בין מערכות הפעלה (לוכסנים) ומספק מתודות נוחות",
            "כי זה מהיר יותר ב-50%",
            "פייתון מפסיקה לתמוך במחרוזות בגרסה הבאה"
        ],
        correctAnswer: 1,
        explanation: "pathlib הוא אובייקט חכם שיודע האם להשתמש ב-\\\\ (Windows) או ב-/ (Linux/Mac), ומונע באגים של שרשור נתיבים ידני."
    },
    {
        id: 2,
        question: "מה ההבדל העיקרי בין ensure_ascii=True ל-False ב-JSON?",
        options: [
            "אין הבדל",
            "False שומר על תווים (כמו עברית) בצורתם המקורית, True ממיר אותם לקוד יוניקוד (\\uXXXX)",
            "False מוחק תווים לא חוקיים",
            "True מכווץ את הקובץ"
        ],
        correctAnswer: 1,
        explanation: "כברירת מחדל (True), פייתון ממירה כל תו שאינו אנגלית לקוד. כדי לראות עברית קריאה בקובץ, חייבים להגדיר ensure_ascii=False."
    },
    {
        id: 3,
        question: "היכן בטוח לשמור מפתחות API וסיסמאות?",
        options: [
            "בראש קובץ ה-Python הראשי",
            "בקובץ טקסט שנקרא passwords.txt בגיט",
            "במשתני סביבה (Environment Variables) או בקובץ .env שלא עולה לגיט",
            "בהערה בתוך הקוד"
        ],
        correctAnswer: 2,
        explanation: "סודות לעולם לא נכנסים לקוד המקור (Source Control). משתני סביבה הם הדרך המאובטחת והסטנדרטית להזריק סודות לאפליקציה."
    }
  ];

  return (
    <ChapterLayout courseId="python" currentChapterId={7}>
        
        {/* --- Hero Section --- */}
        <div className="relative">
          {/* המנטור (xl+, משמאל) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="inspect" line="קונפיג בחוץ, קוד בפנים" width={160} accent={EMERALD_ACCENT} bubbleSide="bottom" />
          </div>
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-purple-400 mb-2">
                <FolderOpen size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">File System & I/O</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                קבצים, נתיבים וקונפיגורציה
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
                כל פרויקט AI מוצא את עצמו מוקף בקבצים: Datasets, מודלים, לוגים וקונפיגורציות.
                אם אינך יודע לנהל אותם, המערכת תהפוך לשבירה ותלויה במחשב הספציפי שלך.
                <br/>
                הפרק הזה מלמד איך לבנות מערכת קבצים הנדסית, חוצת פלטפורמות ומאובטחת.
            </p>
        </section>
        </div>

        {/* --- 1. pathlib --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-blue-500 pr-4 flex items-center gap-2">
                <HardDrive size={24} className="text-blue-500"/>
                pathlib: הדרך המודרנית לנתיבים
            </h3>
            
            <p className="text-slate-300">
                פעם עבדנו עם מחרוזות. היום אנחנו עובדים עם אובייקטים. <code>Path</code> מאפשר לשרשר תיקיות עם <code>/</code> בצורה טבעית, ודואג לתרגם את זה למערכת ההפעלה הנכונה.
            </p>

            {/* Interactive Path Demo */}
            <div className="mt-6">
                <PathNavigator />
            </div>

            {/* כאן היה חסר השימוש במשתנים - הוספתי אותם כעת */}
            <LiveCodeEditor
                initialCode={pathlibCode}
            />
            
            <InsightBox type="info" title="איתור שורש הפרויקט">
                במקום לנחש איפה הקובץ נמצא, אפשר לחפש דינמית את תיקיית הגיט או ה-pyproject.toml:
                <LiveCodeEditor
                initialCode={findRootCode}
            />
            </InsightBox>
        </section>

        {/* --- 2. JSON & Encoding --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-yellow-500 pr-4 flex items-center gap-2">
                <FileJson size={24} className="text-yellow-500"/>
                JSON ועברית (UTF-8)
            </h3>
            
            <p className="text-slate-300">
                עברית היא נקודת תורפה בקריאת קבצים. הכלל הוא פשוט: תמיד להגדיר <code>encoding=&quot;utf-8&quot;</code>.
                ב-JSON, פרמטר הקסם הוא <code>ensure_ascii=False</code>.
            </p>
            
            <LiveCodeEditor
                initialCode={jsonUnicodeCode}
            />
        </section>

        {/* --- 3. CSV vs Parquet --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-emerald-500 pr-4 flex items-center gap-2">
                <Database size={24} className="text-emerald-500"/>
                ביצועים: CSV מול Parquet
            </h3>
            
            <p className="text-slate-300">
                קבצי CSV הם נהדרים לאקסל, אבל איטיים למחשב. בעבודה עם דאטה גדול (AI Datasets), 
                פורמט <strong>Parquet</strong> מהיר פי כמה ותופס פחות מקום.
            </p>

            <LiveCodeEditor
                initialCode={parquetCode}
            />
        </section>

        {/* --- 4. Config & Env Vars --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-red-500 pr-4 flex items-center gap-2">
                <Settings size={24} className="text-red-500"/>
                קונפיגורציה וסודות
            </h3>
            
            <p className="text-slate-300">
                אף אחד לא רוצה לשנות קוד בשביל לעדכן סיסמה. נתונים רגישים שומרים ב-Environment Variables.
            </p>

            {/* Interactive Env Lab */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">
                    <strong>מעבדת אבטחה:</strong> ראה את ההבדל בין קוד מסוכן לקוד מאובטח.
                </p>
                <EnvConfigLab />
            </div>

            <LiveCodeEditor
                initialCode={envLoadCode}
            />
        </section>

        {/* --- 5. Universal Loader Example --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-indigo-500 pr-4 flex items-center gap-2">
                <FileText size={24} className="text-indigo-500"/>
                דוגמה מסכמת: הטוען האוניברסלי
            </h3>
            
            <p className="text-slate-300">
                במקום לכתוב פונקציה לכל סוג קובץ, נכתוב פונקציה אחת חכמה שמזהה את הסיומת ומחזירה את המידע.
            </p>

            <LiveCodeEditor
                initialCode={universalLoaderCode}
            />
        </section>

        {/* --- 6. Best Practices Summary --- */}
        <section className="mt-24 bg-linear-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3 mb-6 text-white justify-center">
                <Globe className="text-blue-400" />
                <h2 className="text-2xl font-bold">סיכום: הנדסת קבצים</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-emerald-400 font-bold mb-2">Paths</h4>
                    <p className="text-slate-400 text-sm">השתמש ב-<code>pathlib</code>. אל תשרשר מחרוזות.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-yellow-400 font-bold mb-2">Encoding</h4>
                    <p className="text-slate-400 text-sm">תמיד <code>utf-8</code>. תמיד.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-red-400 font-bold mb-2">Secrets</h4>
                    <p className="text-slate-400 text-sm">לעולם לא בקוד. רק ב-<code>.env</code>.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-blue-400 font-bold mb-2">Formats</h4>
                    <p className="text-slate-400 text-sm">CSV לאקסל, Parquet לדאטה גדול, JSON לקונפיג.</p>
                </div>
            </div>
        </section>

        {/* --- Quiz --- */}
        <section className="mt-20">
            <Quiz questions={questions} title="מבדק ידע - פרק 7" />
        </section>

    </ChapterLayout>
  );
}